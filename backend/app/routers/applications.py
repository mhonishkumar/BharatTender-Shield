import os
import shutil
import uuid
import hashlib
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user, require_role
from app.services.document_processor import process_pdf_document
from app.services.ai_extractor import extract_document_entities
from app.services.audit_service import record_audit_log
from app.services.chunking_service import chunk_document_pages, chunk_full_text
from app.services.rag_service import store_document_chunks
from app.config import settings



router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.get("", response_model=List[schemas.ApplicationResponse])
def get_applications(
    tender_id: Optional[int] = None,
    risk: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Application)

    # If bidder, only show bidder's applications
    if current_user.role == "BIDDER":
        bidder_profile = current_user.bidder_profile
        if not bidder_profile:
            return []
        query = query.filter(models.Application.bidder_id == bidder_profile.id)
    
    if tender_id:
        query = query.filter(models.Application.tender_id == tender_id)
    if risk:
        query = query.filter(models.Application.risk_level == risk.upper())
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(models.Application.status == status_filter.upper())

    return query.order_by(models.Application.submitted_at.desc()).all()

@router.get("/{application_id}", response_model=schemas.ApplicationResponse)
def get_application(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # If bidder, check ownership
    if current_user.role == "BIDDER":
        if not current_user.bidder_profile or application.bidder_id != current_user.bidder_profile.id:
            raise HTTPException(status_code=403, detail="Access denied")

    return application

@router.post("", response_model=schemas.ApplicationResponse)
@router.post("/submit", response_model=schemas.ApplicationResponse)
def submit_application(
    app_data: schemas.ApplicationCreate,
    current_user: models.User = Depends(require_role(["BIDDER"])),
    db: Session = Depends(get_db)
):
    bidder_profile = current_user.bidder_profile
    if not bidder_profile:
        # Create profile on the fly if needed
        bidder_profile = models.BidderProfile(
            user_id=current_user.id,
            company_name=app_data.submitted_company_name,
            gstin=app_data.submitted_gstin,
            pan=app_data.submitted_pan,
            udyam_number=app_data.submitted_udyam,
            annual_turnover=app_data.submitted_turnover
        )
        db.add(bidder_profile)
        db.commit()
        db.refresh(bidder_profile)

    # Generate unique application ref: APP-2026-XXXX
    short_uuid = str(uuid.uuid4())[:6].upper()
    app_ref = f"APP-2026-{short_uuid}"

    application = models.Application(
        application_ref=app_ref,
        tender_id=app_data.tender_id,
        bidder_id=bidder_profile.id,
        status="SUBMITTED",
        submitted_company_name=app_data.submitted_company_name,
        submitted_reg_number=app_data.submitted_reg_number,
        submitted_gstin=app_data.submitted_gstin.strip().upper(),
        submitted_pan=app_data.submitted_pan.strip().upper(),
        submitted_udyam=app_data.submitted_udyam.strip().upper() if app_data.submitted_udyam else None,
        submitted_turnover=app_data.submitted_turnover,
        compliance_score=0,
        risk_level="MEDIUM"
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    record_audit_log(
        db=db,
        action="APPLICATION_SUBMITTED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=app_data.tender_id,
        application_id=application.id,
        details=f"Bidder '{application.submitted_company_name}' submitted application {application.application_ref}."
    )

    return application

@router.post("/{application_id}/documents", response_model=schemas.DocumentResponse)
@router.post("/{application_id}/upload-document", response_model=schemas.DocumentResponse)
async def upload_document(
    application_id: int,
    doc_type: str = Form(...), # GST_CERTIFICATE, PAN_CARD, UDYAM_CERTIFICATE, TURNOVER_CERTIFICATE, OTHER
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Verify authorization
    if current_user.role == "BIDDER":
        if not current_user.bidder_profile or application.bidder_id != current_user.bidder_profile.id:
            raise HTTPException(status_code=403, detail="Access denied")

    # Validate file extension
    allowed_exts = {".pdf", ".png", ".jpg", ".jpeg"}
    suffix = Path(file.filename).suffix.lower()
    if suffix not in allowed_exts:
        raise HTTPException(status_code=400, detail=f"Unsupported file format '{suffix}'. Allowed: PDF, PNG, JPG, JPEG")

    # Save file
    safe_filename = f"{application.application_ref}_{doc_type}_{uuid.uuid4().hex[:8]}{suffix}"
    dest_path = settings.UPLOAD_DIR / safe_filename

    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save error: {str(e)}")

    file_size = os.path.getsize(dest_path)

    # Compute document SHA-256 hash
    hasher = hashlib.sha256()
    with open(dest_path, "rb") as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    doc_hash = hasher.hexdigest()

    # Check if a doc of this type already exists, update or replace
    existing_doc = db.query(models.Document).filter(
        models.Document.application_id == application_id,
        models.Document.doc_type == doc_type
    ).first()

    if existing_doc:
        existing_doc.file_name = file.filename
        existing_doc.file_path = str(dest_path)
        existing_doc.storage_path = str(dest_path)
        existing_doc.document_hash = doc_hash
        existing_doc.uploaded_by = current_user.id
        existing_doc.file_size = file_size
        existing_doc.mime_type = file.content_type or "application/octet-stream"
        existing_doc.status = "UPLOADED"
        existing_doc.verification_status = "PENDING"
        doc_obj = existing_doc
    else:
        doc_obj = models.Document(
            application_id=application_id,
            doc_type=doc_type,
            file_name=file.filename,
            file_path=str(dest_path),
            storage_path=str(dest_path),
            document_hash=doc_hash,
            uploaded_by=current_user.id,
            file_size=file_size,
            mime_type=file.content_type or "application/octet-stream",
            status="UPLOADED",
            verification_status="PENDING"
        )
        db.add(doc_obj)
    db.commit()
    db.refresh(doc_obj)


    # Extract text and data entities
    raw_text = ""
    pdf_res: dict = {"success": False, "pages": [], "full_text": ""}
    if suffix == ".pdf":
        pdf_res = process_pdf_document(str(dest_path))
        if pdf_res["success"]:
            raw_text = pdf_res["full_text"]

    extracted = extract_document_entities(raw_text, doc_type, file.filename)
    
    # Store extracted records
    db.query(models.ExtractedData).filter(models.ExtractedData.document_id == doc_obj.id).delete()
    if extracted.get("gstin"):
        db.add(models.ExtractedData(
            document_id=doc_obj.id,
            field_key="gstin",
            extracted_value=extracted["gstin"],
            confidence=extracted.get("confidence_score", 0.95),
            snippet=extracted.get("relevant_snippet")
        ))
    if extracted.get("pan"):
        db.add(models.ExtractedData(
            document_id=doc_obj.id,
            field_key="pan",
            extracted_value=extracted["pan"],
            confidence=extracted.get("confidence_score", 0.95),
            snippet=extracted.get("relevant_snippet")
        ))
    if extracted.get("udyam_number"):
        db.add(models.ExtractedData(
            document_id=doc_obj.id,
            field_key="udyam_number",
            extracted_value=extracted["udyam_number"],
            confidence=extracted.get("confidence_score", 0.95),
            snippet=extracted.get("relevant_snippet")
        ))
    if extracted.get("valid_until"):
        db.add(models.ExtractedData(
            document_id=doc_obj.id,
            field_key="valid_until",
            extracted_value=extracted["valid_until"],
            confidence=extracted.get("confidence_score", 0.95),
            snippet=extracted.get("relevant_snippet")
        ))
    db.commit()

    record_audit_log(
        db=db,
        action="DOCUMENT_UPLOADED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        application_id=application.id,
        details=f"Uploaded {doc_type}: {file.filename} ({file_size} bytes)."
    )

    # --- RAG INGESTION: chunk + embed the document ---
    try:
        tender_id = application.tender_id
        bidder_id = application.bidder_id

        if suffix == ".pdf" and pdf_res.get("success") and pdf_res.get("pages"):
            # Use page-level data for better provenance
            chunks = chunk_document_pages(
                pages_data=pdf_res["pages"],
                document_id=doc_obj.id,
                application_id=application.id,
                tender_id=tender_id,
                bidder_id=bidder_id,
                source_filename=file.filename,
                doc_type=doc_type,
            )
        elif raw_text:
            # Fallback: chunk full text without page granularity
            chunks = chunk_full_text(
                full_text=raw_text,
                document_id=doc_obj.id,
                application_id=application.id,
                tender_id=tender_id,
                bidder_id=bidder_id,
                source_filename=file.filename,
                doc_type=doc_type,
            )
        else:
            chunks = []

        if chunks:
            stored_count = store_document_chunks(db, chunks, doc_obj.id)
            doc_obj.status = "EXTRACTED"
            db.commit()

            record_audit_log(
                db=db,
                action="EMBEDDING_GENERATED",
                user_id=current_user.id,
                user_email=current_user.email,
                role=current_user.role,
                application_id=application.id,
                details=f"Generated {stored_count} embedding chunks for {doc_type}: {file.filename}"
            )
    except Exception as rag_err:
        # RAG failure must not block document upload success
        import logging
        logging.getLogger("uvicorn.error").warning(
            f"[RAG Ingestion] Non-critical: Failed to chunk/embed {file.filename}: {rag_err}"
        )

    return doc_obj


# Additional Standard Endpoints for Application Workflow
from app.services.verifier import run_application_verification
from app.services.report_generator import generate_compliance_report
from fastapi.responses import FileResponse

@router.post("/{application_id}/verify")
def verify_application_endpoint(
    application_id: int,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    try:
        summary = run_application_verification(db, application_id, current_user.id)
        return {
            "success": True,
            "message": "Verification executed successfully.",
            "data": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{application_id}/verification", response_model=List[schemas.VerificationResultResponse])
def get_application_verification_endpoint(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role == "BIDDER" and (not current_user.bidder_profile or app.bidder_id != current_user.bidder_profile.id):
        raise HTTPException(status_code=403, detail="Access denied")
    return db.query(models.VerificationResult).filter(models.VerificationResult.application_id == application_id).all()

@router.get("/{application_id}/evidence")
def get_application_evidence_endpoint(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role == "BIDDER" and (not current_user.bidder_profile or app.bidder_id != current_user.bidder_profile.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    results = db.query(models.VerificationResult).filter(models.VerificationResult.application_id == application_id).all()
    evidence_list = []
    for r in results:
        evidence_list.append({
            "id": r.id,
            "rule_code": r.rule_code,
            "title": r.title,
            "status": r.status,
            "finding": r.finding,
            "extracted_value": r.extracted_value,
            "source_document": r.source_document_name,
            "page_number": r.page_number,
            "snippet": r.evidence_snippet,
            "is_critical": r.is_critical_issue
        })
    return {
        "application_id": app.id,
        "application_ref": app.application_ref,
        "company_name": app.submitted_company_name,
        "evidence": evidence_list
    }

@router.post("/{application_id}/clarification", response_model=schemas.ClarificationResponse)
def create_application_clarification_endpoint(
    application_id: int,
    clar_data: schemas.ClarificationCreate,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    clarification = models.Clarification(
        application_id=application_id,
        officer_id=current_user.id,
        issue=clar_data.issue,
        message=clar_data.message,
        required_document_type=clar_data.required_document_type,
        deadline=clar_data.deadline or "3 working days",
        status="PENDING"
    )
    db.add(clarification)
    app.status = "CLARIFICATION_REQUESTED"

    record_audit_log(
        db=db,
        action="CLARIFICATION_REQUESTED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=app.tender_id,
        application_id=app.id,
        details=f"Clarification requested on issue '{clar_data.issue}' for {app.submitted_company_name}."
    )
    db.commit()
    db.refresh(clarification)
    return clarification

@router.post("/{application_id}/decision", response_model=schemas.OfficerDecisionResponse)
def submit_application_decision_endpoint(
    application_id: int,
    decision_data: schemas.OfficerDecisionCreate,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    from datetime import datetime
    existing_dec = db.query(models.OfficerDecision).filter(models.OfficerDecision.application_id == application_id).first()
    if existing_dec:
        existing_dec.decision = decision_data.decision
        existing_dec.comments = decision_data.comments
        existing_dec.officer_id = current_user.id
        existing_dec.officer_name = current_user.full_name
        existing_dec.decided_at = datetime.utcnow()
        dec_obj = existing_dec
    else:
        dec_obj = models.OfficerDecision(
            application_id=application_id,
            officer_id=current_user.id,
            decision=decision_data.decision,
            comments=decision_data.comments,
            officer_name=current_user.full_name,
            decided_at=datetime.utcnow()
        )
        db.add(dec_obj)

    if decision_data.decision == "COMPLIANT":
        app.status = "COMPLIANT"
    elif decision_data.decision == "NON_COMPLIANT":
        app.status = "NON_COMPLIANT"
    elif decision_data.decision == "REQUEST_CLARIFICATION":
        app.status = "CLARIFICATION_REQUESTED"
    else:
        app.status = "MANUAL_REVIEW"

    record_audit_log(
        db=db,
        action=f"OFFICER_DECISION_{decision_data.decision}",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=app.tender_id,
        application_id=app.id,
        details=f"Officer {current_user.full_name} rendered decision '{decision_data.decision}' for {app.submitted_company_name}."
    )
    db.commit()
    db.refresh(dec_obj)
    return dec_obj

@router.get("/{application_id}/report")
def download_application_report_endpoint(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    pdf_path = generate_compliance_report(app)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="Could not generate PDF report.")

    filename = os.path.basename(pdf_path)
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=filename
    )

