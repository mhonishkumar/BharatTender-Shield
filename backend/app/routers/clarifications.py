from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user, require_role
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/api/clarifications", tags=["Clarifications"])

@router.post("", response_model=schemas.ClarificationResponse)
def create_clarification(
    clar_data: schemas.ClarificationCreate,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    application = db.query(models.Application).filter(models.Application.id == clar_data.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    clarification = models.Clarification(
        application_id=clar_data.application_id,
        officer_id=current_user.id,
        issue=clar_data.issue,
        message=clar_data.message,
        required_document_type=clar_data.required_document_type,
        deadline=clar_data.deadline or "3 working days",
        status="PENDING"
    )
    db.add(clarification)

    # Update application status
    application.status = "CLARIFICATION_REQUESTED"
    
    # Notify bidder user
    bidder_user = application.bidder.user
    notification = models.Notification(
        user_id=bidder_user.id,
        title=f"Clarification Requested: {clar_data.issue}",
        message=f"Officer requested clarification for tender {application.tender.tender_ref}: '{clar_data.message}'",
        notification_type="URGENT",
        link="/bidder/clarifications"
    )
    db.add(notification)

    record_audit_log(
        db=db,
        action="CLARIFICATION_REQUESTED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=application.tender_id,
        application_id=application.id,
        details=f"Clarification requested on issue '{clar_data.issue}' for {application.submitted_company_name}."
    )

    db.commit()
    db.refresh(clarification)
    return clarification

@router.post("/{clarification_id}/reply", response_model=schemas.ClarificationResponse)
def reply_to_clarification(
    clarification_id: int,
    reply_data: schemas.ClarificationReply,
    current_user: models.User = Depends(require_role(["BIDDER"])),
    db: Session = Depends(get_db)
):
    clarification = db.query(models.Clarification).filter(models.Clarification.id == clarification_id).first()
    if not clarification:
        raise HTTPException(status_code=404, detail="Clarification not found")

    application = clarification.application
    if application.bidder_id != current_user.bidder_profile.id:
        raise HTTPException(status_code=403, detail="Access denied")

    clarification.bidder_reply = reply_data.bidder_reply
    clarification.replacement_document_id = reply_data.replacement_document_id
    clarification.status = "CLARIFICATION_SUBMITTED"
    clarification.replied_at = datetime.utcnow()

    # Notify officer
    officer_notif = models.Notification(
        user_id=clarification.officer_id,
        title=f"Clarification Reply Received: {application.submitted_company_name}",
        message=f"Bidder replied: '{reply_data.bidder_reply[:80]}...'",
        notification_type="INFO",
        link=f"/officer/verification/{application.id}"
    )
    db.add(officer_notif)

    record_audit_log(
        db=db,
        action="CLARIFICATION_REPLIED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=application.tender_id,
        application_id=application.id,
        details=f"Bidder replied to clarification #{clarification.id}: {reply_data.bidder_reply[:60]}."
    )

    db.commit()
    db.refresh(clarification)
    return clarification

@router.get("/application/{application_id}", response_model=List[schemas.ClarificationResponse])
def get_application_clarifications(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Clarification).filter(
        models.Clarification.application_id == application_id
    ).order_by(models.Clarification.created_at.desc()).all()
