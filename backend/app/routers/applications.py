import os
import shutil
import uuid
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
    
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(dest_path)

    # Check if a doc of this type already exists, update or replace
    existing_doc = db.query(models.Document).filter(
        models.Document.application_id == application_id,
        models.Document.doc_type == doc_type
    ).first()

    if existing_doc:
        existing_doc.file_name = file.filename
        existing_doc.file_path = str(dest_path.relative_to(settings.BASE_DIR))
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
            file_path=str(dest_path.relative_to(settings.BASE_DIR)),
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

    return doc_obj
