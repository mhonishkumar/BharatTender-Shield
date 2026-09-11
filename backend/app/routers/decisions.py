from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user, require_role
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/api/decisions", tags=["Officer Decisions"])

@router.post("", response_model=schemas.OfficerDecisionResponse)
def submit_officer_decision(
    decision_data: schemas.OfficerDecisionCreate,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    application = db.query(models.Application).filter(models.Application.id == decision_data.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Update or create decision
    existing_dec = db.query(models.OfficerDecision).filter(
        models.OfficerDecision.application_id == decision_data.application_id
    ).first()

    if existing_dec:
        existing_dec.decision = decision_data.decision
        existing_dec.comments = decision_data.comments
        existing_dec.officer_id = current_user.id
        existing_dec.officer_name = current_user.full_name
        existing_dec.decided_at = datetime.utcnow()
        dec_obj = existing_dec
    else:
        dec_obj = models.OfficerDecision(
            application_id=decision_data.application_id,
            officer_id=current_user.id,
            decision=decision_data.decision,
            comments=decision_data.comments,
            officer_name=current_user.full_name,
            decided_at=datetime.utcnow()
        )
        db.add(dec_obj)

    # Update application status
    if decision_data.decision == "COMPLIANT":
        application.status = "COMPLIANT"
    elif decision_data.decision == "NON_COMPLIANT":
        application.status = "NON_COMPLIANT"
    elif decision_data.decision == "REQUEST_CLARIFICATION":
        application.status = "CLARIFICATION_REQUESTED"
    else:
        application.status = "MANUAL_REVIEW"

    # Notify bidder
    bidder_user = application.bidder.user
    notif = models.Notification(
        user_id=bidder_user.id,
        title=f"Procurement Decision Rendered: {application.tender.tender_ref}",
        message=f"Official decision: {decision_data.decision}. Review your application dashboard.",
        notification_type="SUCCESS" if decision_data.decision == "COMPLIANT" else "WARNING",
        link=f"/bidder/verification"
    )
    db.add(notif)

    # Record in Audit Hash Chain
    record_audit_log(
        db=db,
        action=f"OFFICER_DECISION_{decision_data.decision}",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        tender_id=application.tender_id,
        application_id=application.id,
        details=f"Officer {current_user.full_name} rendered decision '{decision_data.decision}' for {application.submitted_company_name}. Comments: {decision_data.comments}"
    )

    db.commit()
    db.refresh(dec_obj)
    return dec_obj
