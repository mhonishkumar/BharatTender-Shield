from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import require_role, get_current_user, get_password_hash

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/users", response_model=List[schemas.UserResponse])
def list_users(
    current_user: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    return db.query(models.User).order_by(models.User.id.asc()).all()

@router.post("/users/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    current_user: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"user_id": user.id, "is_active": user.is_active}

@router.get("/stats")
def get_system_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["ADMIN", "PROCUREMENT_OFFICER"]:
        raise HTTPException(status_code=403, detail="Access denied")
        
    total_users = db.query(models.User).count()
    total_tenders = db.query(models.Tender).count()
    total_applications = db.query(models.Application).count()
    high_risk_count = db.query(models.Application).filter(models.Application.risk_level == "HIGH").count()
    pending_count = db.query(models.Application).filter(models.Application.status.in_(["SUBMITTED", "UNDER_REVIEW"])).count()
    verified_count = db.query(models.Application).filter(models.Application.status.in_(["COMPLIANT", "NON_COMPLIANT"])).count()
    total_audit_logs = db.query(models.AuditLog).count()

    return {
        "active_tenders": total_tenders,
        "total_bidders": total_applications,
        "pending_reviews": pending_count,
        "high_risk_bidders": high_risk_count,
        "verified_bidders": verified_count,
        "total_users": total_users,
        "total_audit_logs": total_audit_logs
    }
