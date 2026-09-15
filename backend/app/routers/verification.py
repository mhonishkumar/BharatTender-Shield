from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user, require_role
from app.services.verifier import run_application_verification

router = APIRouter(prefix="/api/verification", tags=["Verification"])

@router.post("/{application_id}/run")
def trigger_verification(
    application_id: int,
    current_user: models.User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    try:
        summary = run_application_verification(db, application_id, current_user.id)
        return {
            "success": True,
            "message": "AI-assisted verification pipeline executed successfully.",
            "data": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{application_id}/results", response_model=List[schemas.VerificationResultResponse])
def get_results(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # If bidder, ensure it's their application
    if current_user.role == "BIDDER":
        if not current_user.bidder_profile or application.bidder_id != current_user.bidder_profile.id:
            raise HTTPException(status_code=403, detail="Access denied")

    results = db.query(models.VerificationResult).filter(
        models.VerificationResult.application_id == application_id
    ).all()
    return results
