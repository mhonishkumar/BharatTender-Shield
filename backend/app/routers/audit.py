from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user
from app.services.audit_service import verify_chain_integrity

router = APIRouter(prefix="/api/audit", tags=["Audit Trail"])

@router.get("/logs", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(
    tender_id: Optional[int] = None,
    application_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.AuditLog)
    if tender_id:
        query = query.filter(models.AuditLog.tender_id == tender_id)
    if application_id:
        query = query.filter(models.AuditLog.application_id == application_id)
    return query.order_by(models.AuditLog.id.desc()).all()

@router.post("/verify", response_model=schemas.AuditVerificationResult)
def run_integrity_check(db: Session = Depends(get_db)):
    return verify_chain_integrity(db)
