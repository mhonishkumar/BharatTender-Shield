import hashlib
import json
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app import models, schemas

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

def calculate_hash(previous_hash: str, timestamp_str: str, user_email: str, action: str, details: str) -> str:
    raw_payload = f"{previous_hash}|{timestamp_str}|{user_email or 'SYSTEM'}|{action}|{details or ''}"
    return hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()

def record_audit_log(
    db: Session,
    action: str,
    user_id: Optional[int] = None,
    user_email: Optional[str] = None,
    role: Optional[str] = None,
    tender_id: Optional[int] = None,
    application_id: Optional[int] = None,
    details: Optional[str] = None
) -> models.AuditLog:
    # Get last log entry to retrieve previous_hash
    last_log = db.query(models.AuditLog).order_by(models.AuditLog.id.desc()).first()
    prev_hash = last_log.current_hash if last_log else GENESIS_HASH
    
    now = datetime.utcnow()
    timestamp_str = now.isoformat()
    
    current_hash = calculate_hash(
        previous_hash=prev_hash,
        timestamp_str=timestamp_str,
        user_email=user_email or "SYSTEM",
        action=action,
        details=details or ""
    )
    
    log_entry = models.AuditLog(
        tender_id=tender_id,
        application_id=application_id,
        user_id=user_id,
        user_email=user_email,
        role=role,
        action=action,
        details=details,
        previous_hash=prev_hash,
        current_hash=current_hash,
        timestamp=now
    )
    
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry

def verify_chain_integrity(db: Session) -> schemas.AuditVerificationResult:
    logs = db.query(models.AuditLog).order_by(models.AuditLog.id.asc()).all()
    if not logs:
        return schemas.AuditVerificationResult(
            is_valid=True,
            total_records=0,
            message="Audit chain is empty. Genesis state intact."
        )
    
    expected_prev_hash = GENESIS_HASH
    for idx, log in enumerate(logs):
        if log.previous_hash != expected_prev_hash:
            return schemas.AuditVerificationResult(
                is_valid=False,
                total_records=len(logs),
                broken_index=log.id,
                message=f"Tamper detected at record #{log.id}: previous_hash does not match predecessor hash!"
            )
        
        # Verify the current hash calculation
        timestamp_str = log.timestamp.isoformat()
        computed_hash = calculate_hash(
            previous_hash=log.previous_hash,
            timestamp_str=timestamp_str,
            user_email=log.user_email or "SYSTEM",
            action=log.action,
            details=log.details or ""
        )
        
        if computed_hash != log.current_hash:
            return schemas.AuditVerificationResult(
                is_valid=False,
                total_records=len(logs),
                broken_index=log.id,
                message=f"Tamper detected at record #{log.id}: current_hash mismatch! Data payload has been modified."
            )
        
        expected_prev_hash = log.current_hash

    return schemas.AuditVerificationResult(
        is_valid=True,
        total_records=len(logs),
        broken_index=None,
        message="Cryptographic audit chain is 100% valid. All SHA-256 links verified and untampered."
    )
