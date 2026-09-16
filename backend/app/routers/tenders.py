import shutil
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user, require_role
from app.services.tender_compiler import compile_tender_clauses
from app.services.document_processor import process_pdf_document
from app.services.audit_service import record_audit_log
from app.config import settings

router = APIRouter(prefix="/api/tenders", tags=["Tenders"])

@router.get("", response_model=List[schemas.TenderResponse])
def get_tenders(db: Session = Depends(get_db)):
    tenders = db.query(models.Tender).order_by(models.Tender.created_at.desc()).all()
    return tenders

@router.get("/{tender_id}", response_model=schemas.TenderResponse)
def get_tender(tender_id: int, db: Session = Depends(get_db)):
    tender = db.query(models.Tender).filter(models.Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    return tender

@router.post("", response_model=schemas.TenderResponse)
def create_tender(
    tender_data: schemas.TenderCreate,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    existing = db.query(models.Tender).filter(models.Tender.tender_ref == tender_data.tender_ref).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tender reference already exists")

    tender = models.Tender(
        tender_ref=tender_data.tender_ref,
        title=tender_data.title,
        department=tender_data.department,
        description=tender_data.description,
        bid_submission_date=tender_data.bid_submission_date,
        deadline=tender_data.deadline,
        min_turnover=tender_data.min_turnover,
        created_by=current_user.id
    )
    db.add(tender)
    db.commit()
    db.refresh(tender)

    # Automatically compile standard rules
    rules = compile_tender_clauses(
        tender_text=tender_data.description or "",
        tender_title=tender_data.title,
        min_turnover=tender_data.min_turnover
    )
    for r in rules:
        rule_obj = models.TenderRule(
            tender_id=tender.id,
            rule_code=r["rule_code"],
            category=r["category"],
            requirement=r["requirement"],
            validation_logic=r["validation_logic"],
            is_mandatory=r["is_mandatory"],
            is_approved_by_officer=True,
            original_clause=r.get("original_clause")
        )
        db.add(rule_obj)
    db.commit()

    record_audit_log(
        db=db,
        action="TENDER_CREATED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=tender.id,
        details=f"Tender {tender.tender_ref} created with {len(rules)} rules."
    )

    db.refresh(tender)
    return tender

@router.post("/compile-rules")
async def compile_rules_from_text_or_pdf(
    tender_id: Optional[int] = Form(None),
    tender_text: Optional[str] = Form(""),
    min_turnover: Optional[float] = Form(50.0),
    file: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"]))
):
    extracted_text = tender_text or ""
    if file:
        file_path = settings.UPLOAD_DIR / f"tender_pdf_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        proc_res = process_pdf_document(str(file_path))
        if proc_res["success"]:
            extracted_text += "\n" + proc_res["full_text"]

    rules = compile_tender_clauses(
        tender_text=extracted_text,
        min_turnover=min_turnover or 50.0
    )
    return {
        "success": True,
        "total_rules": len(rules),
        "compiled_rules": rules,
        "extracted_clause_length": len(extracted_text)
    }

@router.put("/rules/{rule_id}", response_model=schemas.TenderRuleResponse)
def update_tender_rule(
    rule_id: int,
    rule_update: schemas.TenderRuleBase,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    rule = db.query(models.TenderRule).filter(models.TenderRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    rule.requirement = rule_update.requirement
    rule.validation_logic = rule_update.validation_logic
    rule.is_mandatory = rule_update.is_mandatory
    rule.is_approved_by_officer = rule_update.is_approved_by_officer
    db.commit()
    db.refresh(rule)

    record_audit_log(
        db=db,
        action="TENDER_RULE_MODIFIED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=rule.tender_id,
        details=f"Rule {rule.rule_code} updated by officer."
    )
    return rule

@router.post("/{tender_id}/rules", response_model=schemas.TenderRuleResponse)
def add_tender_rule(
    tender_id: int,
    rule_data: schemas.TenderRuleCreate,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    tender = db.query(models.Tender).filter(models.Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    new_rule = models.TenderRule(
        tender_id=tender.id,
        rule_code=rule_data.rule_code,
        category=rule_data.category,
        requirement=rule_data.requirement,
        validation_logic=rule_data.validation_logic,
        is_mandatory=rule_data.is_mandatory,
        is_approved_by_officer=rule_data.is_approved_by_officer,
        original_clause=rule_data.original_clause
    )
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    record_audit_log(
        db=db,
        action="TENDER_RULE_ADDED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=tender.id,
        details=f"Rule {new_rule.rule_code} added to tender {tender.tender_ref}."
    )
    return new_rule

@router.get("/{tender_id}/applications", response_model=List[schemas.ApplicationResponse])
def get_tender_applications(
    tender_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tender = db.query(models.Tender).filter(models.Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    query = db.query(models.Application).filter(models.Application.tender_id == tender_id)
    if current_user.role == "BIDDER":
        if not current_user.bidder_profile:
            return []
        query = query.filter(models.Application.bidder_id == current_user.bidder_profile.id)

    return query.order_by(models.Application.submitted_at.desc()).all()


@router.post("/{tender_id}/assign-bidder")
def assign_bidder_to_tender(
    tender_id: int,
    payload: dict,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """Officer assigns a tender to a specific bidder."""
    tender = db.query(models.Tender).filter(models.Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    bidder_id = payload.get("bidder_id")
    if not bidder_id:
        raise HTTPException(status_code=422, detail="bidder_id is required")

    bidder = db.query(models.BidderProfile).filter(models.BidderProfile.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    # Check if already assigned
    existing = db.query(models.TenderAssignment).filter(
        models.TenderAssignment.tender_id == tender_id,
        models.TenderAssignment.bidder_id == bidder_id
    ).first()
    if existing:
        return {"message": "Bidder already assigned to this tender", "assignment_id": existing.id}

    assignment = models.TenderAssignment(
        tender_id=tender_id,
        bidder_id=bidder_id,
        assigned_by=current_user.id,
        status="INVITED"
    )
    db.add(assignment)

    # Create notification for bidder
    notification = models.Notification(
        user_id=bidder.user_id,
        title="New Tender Assigned",
        message=f"You have been invited to bid on: {tender.title} ({tender.tender_ref})",
        notification_type="INFO",
        link=f"/bidder/tenders/{tender_id}"
    )
    db.add(notification)
    db.commit()
    db.refresh(assignment)

    record_audit_log(
        db=db,
        action="TENDER_BIDDER_ASSIGNED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=tender_id,
        details=f"Bidder {bidder.company_name} assigned to tender {tender.tender_ref}."
    )

    return {"message": "Bidder successfully assigned", "assignment_id": assignment.id}


@router.get("/{tender_id}/assigned-bidders")
def get_assigned_bidders(
    tender_id: int,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """Get all bidders assigned to a tender."""
    assignments = db.query(models.TenderAssignment).filter(
        models.TenderAssignment.tender_id == tender_id
    ).all()
    return [
        {
            "assignment_id": a.id,
            "bidder_id": a.bidder_id,
            "company_name": a.bidder.company_name,
            "gstin": a.bidder.gstin,
            "status": a.status,
            "assigned_at": a.assigned_at
        }
        for a in assignments
    ]


@router.get("/bidder/my-tenders")
def get_bidder_assigned_tenders(
    current_user: models.User = Depends(require_role(["BIDDER"])),
    db: Session = Depends(get_db)
):
    """Get tenders assigned to the currently logged-in bidder."""
    if not current_user.bidder_profile:
        return []

    assignments = db.query(models.TenderAssignment).filter(
        models.TenderAssignment.bidder_id == current_user.bidder_profile.id
    ).all()

    result = []
    for a in assignments:
        t = a.tender
        result.append({
            "assignment_id": a.id,
            "assignment_status": a.status,
            "tender_id": t.id,
            "tender_ref": t.tender_ref,
            "title": t.title,
            "department": t.department,
            "description": t.description,
            "bid_submission_date": t.bid_submission_date,
            "deadline": t.deadline,
            "min_turnover": t.min_turnover,
            "status": t.status,
            "rules": [
                {"category": r.category, "requirement": r.requirement, "is_mandatory": r.is_mandatory}
                for r in t.rules
            ]
        })
    return result


@router.post("/{tender_id}/publish")
def publish_tender(
    tender_id: int,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """Publish a draft tender so bidders can apply."""
    tender = db.query(models.Tender).filter(models.Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    tender.status = "OPEN"
    db.commit()

    record_audit_log(
        db=db,
        action="TENDER_PUBLISHED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=tender_id,
        details=f"Tender {tender.tender_ref} published and now open for bids."
    )
    return {"message": "Tender published successfully", "tender_ref": tender.tender_ref, "status": "OPEN"}


