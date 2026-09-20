"""
routers/rag.py
--------------
RAG (Retrieval-Augmented Generation) endpoints for BharatTender Shield.

Provides:
  - POST /api/rag/query         — Officer assistant: answer questions from document evidence
  - POST /api/documents/{id}/ingest — Re-ingest a document (re-chunk + re-embed)
  - POST /api/tenders/{id}/extract-rules — LLM extract rules from tender PDF

RBAC enforced:
  - Bidder: can only query their own application_id
  - Officer/Admin: can query any tender/application they have access to
"""
import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.core.security import get_current_user, require_role
from app.services.rag_service import retrieve_context, store_document_chunks
from app.services.llm_service import answer_officer_question
from app.services.document_processor import process_pdf_document
from app.services.chunking_service import chunk_document_pages, chunk_full_text
from app.services.audit_service import record_audit_log
from app.config import settings

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/api/rag", tags=["RAG"])


# ─── Pydantic schemas ────────────────────────────────────────────────────────

class RAGQueryRequest(BaseModel):
    query: str
    tender_id: Optional[int] = None
    application_id: Optional[int] = None
    top_k: int = 5


class RAGQueryResponse(BaseModel):
    answer: str
    sources: List[dict] = []
    confidence: float = 0.0
    chunks_found: int = 0
    query: str


class EvidenceChunk(BaseModel):
    chunk_id: int
    chunk_text: str
    page_number: int
    source_filename: str
    doc_type: str
    similarity: float
    application_id: Optional[int] = None
    tender_id: Optional[int] = None


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/query", response_model=RAGQueryResponse)
def rag_query(
    request: RAGQueryRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Officer/Admin RAG assistant: answer a question using retrieved document evidence.
    
    Returns an AI-generated answer with citations (document + page number).
    All answers are grounded in actual uploaded documents — no hallucination.
    
    RBAC:
      - BIDDER: forced to their own application_id only
      - OFFICER/ADMIN: can query any application/tender
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Resolve RBAC
    calling_bidder_id = None
    if current_user.role == "BIDDER":
        if not current_user.bidder_profile:
            raise HTTPException(status_code=403, detail="Bidder profile not found")
        calling_bidder_id = current_user.bidder_profile.id
        # Bidder can only query their own application
        if request.application_id:
            app = db.query(models.Application).filter(
                models.Application.id == request.application_id,
                models.Application.bidder_id == calling_bidder_id
            ).first()
            if not app:
                raise HTTPException(status_code=403, detail="Access denied: not your application")

    top_k = max(1, min(request.top_k, 10))  # clamp 1-10

    # Retrieve evidence chunks
    chunks = retrieve_context(
        db=db,
        query=request.query,
        tender_id=request.tender_id,
        application_id=request.application_id,
        top_k=top_k,
        calling_user_role=current_user.role,
        calling_bidder_id=calling_bidder_id,
    )

    # Get application/tender refs for context
    app_ref = ""
    tender_ref = ""
    if request.application_id:
        app = db.query(models.Application).filter(
            models.Application.id == request.application_id
        ).first()
        if app:
            app_ref = app.application_ref
            tender = db.query(models.Tender).filter(
                models.Tender.id == app.tender_id
            ).first()
            if tender:
                tender_ref = tender.tender_ref

    # Generate LLM answer
    result = answer_officer_question(
        question=request.query,
        evidence_chunks=chunks,
        application_ref=app_ref,
        tender_ref=tender_ref,
    )

    return RAGQueryResponse(
        answer=result["answer"],
        sources=result.get("sources", []),
        confidence=result.get("confidence", 0.0),
        chunks_found=len(chunks),
        query=request.query,
    )


@router.get("/query/{application_id}/chunks")
def get_application_chunks(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return all stored document chunks for an application (for debugging/audit).
    Officers/Admin only.
    """
    if current_user.role == "BIDDER":
        # Bidder can see their own chunks
        app = db.query(models.Application).filter(
            models.Application.id == application_id
        ).first()
        if not app or not current_user.bidder_profile or app.bidder_id != current_user.bidder_profile.id:
            raise HTTPException(status_code=403, detail="Access denied")

    chunks = db.query(models.DocumentChunk).filter(
        models.DocumentChunk.application_id == application_id
    ).order_by(models.DocumentChunk.document_id, models.DocumentChunk.chunk_index).all()

    return {
        "application_id": application_id,
        "total_chunks": len(chunks),
        "chunks": [
            {
                "id": c.id,
                "document_id": c.document_id,
                "page_number": c.page_number,
                "chunk_index": c.chunk_index,
                "source_filename": c.source_filename,
                "doc_type": c.doc_type,
                "text_preview": c.chunk_text[:200] + "..." if len(c.chunk_text) > 200 else c.chunk_text,
                "has_embedding": bool(c.embedding),
            }
            for c in chunks
        ]
    }


# ─── Document re-ingestion ────────────────────────────────────────────────────

@router.post("/documents/{document_id}/ingest")
def ingest_document(
    document_id: int,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db),
):
    """
    Re-ingest a document: re-chunk and re-embed it.
    Useful after document replacement or if initial embedding failed.
    """
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    import os
    from pathlib import Path
    file_path = doc.file_path or doc.storage_path
    if not file_path or not os.path.exists(str(file_path)):
        raise HTTPException(status_code=404, detail=f"Document file not found on disk: {file_path}")

    # Get application context
    app = db.query(models.Application).filter(
        models.Application.id == doc.application_id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found for this document")

    suffix = Path(str(file_path)).suffix.lower()
    pdf_res: dict = {"success": False, "pages": [], "full_text": ""}

    if suffix == ".pdf":
        pdf_res = process_pdf_document(str(file_path))

    raw_text = pdf_res.get("full_text", "") if pdf_res.get("success") else ""

    if pdf_res.get("success") and pdf_res.get("pages"):
        chunks = chunk_document_pages(
            pages_data=pdf_res["pages"],
            document_id=doc.id,
            application_id=app.id,
            tender_id=app.tender_id,
            bidder_id=app.bidder_id,
            source_filename=doc.file_name,
            doc_type=doc.doc_type,
        )
    elif raw_text:
        chunks = chunk_full_text(
            full_text=raw_text,
            document_id=doc.id,
            application_id=app.id,
            tender_id=app.tender_id,
            bidder_id=app.bidder_id,
            source_filename=doc.file_name,
            doc_type=doc.doc_type,
        )
    else:
        return {
            "success": False,
            "message": "Could not extract text from document",
            "chunks_stored": 0,
        }

    stored_count = store_document_chunks(db, chunks, doc.id)
    doc.status = "EXTRACTED"
    db.commit()

    record_audit_log(
        db=db,
        action="EMBEDDING_GENERATED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        application_id=app.id,
        details=f"Re-ingested {doc.doc_type}: {doc.file_name} — {stored_count} chunks stored."
    )

    return {
        "success": True,
        "document_id": document_id,
        "chunks_stored": stored_count,
        "message": f"Document re-ingested successfully. {stored_count} chunks embedded.",
    }


# ─── Tender rule extraction ───────────────────────────────────────────────────

@router.post("/tenders/{tender_id}/extract-rules")
def extract_tender_rules(
    tender_id: int,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db),
):
    """
    Re-extract compliance rules from the tender PDF using Gemini LLM.
    Existing rules are NOT deleted — new LLM-proposed rules are added with is_approved_by_officer=False.
    Officer must review and approve each proposed rule.
    """
    from app.services.tender_compiler import extract_rules_with_gemini, _build_default_rules

    tender = db.query(models.Tender).filter(models.Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    if not tender.tender_pdf_path:
        raise HTTPException(
            status_code=400,
            detail="No tender PDF uploaded. Please upload tender PDF first."
        )

    import os
    if not os.path.exists(str(tender.tender_pdf_path)):
        raise HTTPException(status_code=404, detail="Tender PDF file not found on disk")

    # Extract text from tender PDF
    pdf_res = process_pdf_document(str(tender.tender_pdf_path))
    if not pdf_res.get("success"):
        raise HTTPException(status_code=500, detail=f"Failed to read tender PDF: {pdf_res.get('error')}")

    tender_text = pdf_res.get("full_text", "")
    if not tender_text.strip():
        raise HTTPException(status_code=422, detail="Tender PDF appears to be empty or unreadable")

    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY not configured. Cannot perform LLM rule extraction."
        )

    try:
        proposed_rules = extract_rules_with_gemini(
            tender_text=tender_text,
            tender_title=tender.title,
            min_turnover=tender.min_turnover or 50.0,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM rule extraction failed: {str(e)}")

    # Add proposed rules to DB (marked for officer review)
    added = 0
    existing_codes = {r.rule_code for r in tender.rules}

    for rule in proposed_rules:
        if rule["rule_code"] not in existing_codes:
            new_rule = models.TenderRule(
                tender_id=tender.id,
                rule_code=rule["rule_code"],
                category=rule["category"],
                requirement=rule["requirement"],
                validation_logic=rule["validation_logic"],
                is_mandatory=rule.get("is_mandatory", True),
                is_approved_by_officer=rule.get("is_approved_by_officer", False),
                original_clause=rule.get("original_clause", ""),
            )
            db.add(new_rule)
            added += 1
            existing_codes.add(rule["rule_code"])

    db.commit()

    record_audit_log(
        db=db,
        action="TENDER_RULES_EXTRACTED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=tender.id,
        details=f"LLM extracted {len(proposed_rules)} rules from tender PDF. {added} new rules added (pending officer approval)."
    )

    return {
        "success": True,
        "tender_id": tender_id,
        "tender_ref": tender.tender_ref,
        "proposed_rules": len(proposed_rules),
        "new_rules_added": added,
        "message": f"LLM extracted {len(proposed_rules)} rules. {added} new rules added — review and approve in the Rules tab.",
        "rules": proposed_rules,
    }
