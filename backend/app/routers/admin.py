from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import require_role, get_current_user, get_password_hash
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats")
def get_system_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["ADMIN", "PROCUREMENT_OFFICER"]:
        raise HTTPException(status_code=403, detail="Access denied")

    total_users = db.query(models.User).count()
    total_officers = db.query(models.User).filter(models.User.role == "PROCUREMENT_OFFICER").count()
    total_bidders = db.query(models.User).filter(models.User.role == "BIDDER").count()
    active_tenders = db.query(models.Tender).filter(models.Tender.status == "OPEN").count()
    pending_verifications = db.query(models.Application).filter(models.Application.status.in_(["SUBMITTED", "UNDER_REVIEW"])).count()
    high_risk_applications = db.query(models.Application).filter(models.Application.risk_level == "HIGH").count()
    pending_clarifications = db.query(models.Clarification).filter(models.Clarification.status == "PENDING").count()
    verified_bidders = db.query(models.Application).filter(models.Application.status.in_(["COMPLIANT", "NON_COMPLIANT"])).count()
    total_audit_logs = db.query(models.AuditLog).count()

    return {
        "total_users": total_users,
        "total_officers": total_officers,
        "total_bidders": total_bidders,
        "active_tenders": active_tenders,
        "pending_verifications": pending_verifications,
        "high_risk_applications": high_risk_applications,
        "pending_clarifications": pending_clarifications,
        "verified_bidders": verified_bidders,
        "total_audit_logs": total_audit_logs,
        "pending_reviews": pending_verifications,
        "high_risk_bidders": high_risk_applications
    }

@router.get("/users")
def list_users(
    role_filter: Optional[str] = None,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    current_user: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    query = db.query(models.User)

    if role_filter and role_filter != "ALL":
        query = query.filter(models.User.role == role_filter)

    if status_filter and status_filter != "ALL":
        if status_filter == "ACTIVE":
            query = query.filter(models.User.is_active == True)
        elif status_filter in ["INACTIVE", "SUSPENDED"]:
            query = query.filter(models.User.is_active == False)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (models.User.full_name.ilike(search_fmt)) |
            (models.User.email.ilike(search_fmt)) |
            (models.User.organization.ilike(search_fmt))
        )

    users = query.order_by(models.User.id.asc()).all()

    result = []
    for u in users:
        u_dict = {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "organization": u.organization,
            "is_active": u.is_active,
            "created_at": u.created_at,
            "officer_id": f"OFF-{u.id:04d}" if u.role == "PROCUREMENT_OFFICER" else None,
            "bidder_profile": None
        }
        if u.bidder_profile:
            u_dict["bidder_profile"] = {
                "id": u.bidder_profile.id,
                "company_name": u.bidder_profile.company_name,
                "gstin": u.bidder_profile.gstin,
                "pan": u.bidder_profile.pan,
                "udyam_number": u.bidder_profile.udyam_number,
                "phone": u.bidder_profile.phone,
                "address": u.bidder_profile.address,
                "annual_turnover": u.bidder_profile.annual_turnover
            }
        result.append(u_dict)

    return result

@router.post("/officers")
def add_officer(
    req: schemas.OfficerCreateRequest,
    current_user: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    # Prevent duplicate email / username
    existing = db.query(models.User).filter(
        (models.User.email == req.official_email) | (models.User.email == req.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="An officer or user with this email/username already exists.")

    is_active = req.status.upper() == "ACTIVE"

    officer_user = models.User(
        email=req.official_email,
        hashed_password=get_password_hash(req.password),
        full_name=req.full_name,
        role="PROCUREMENT_OFFICER",
        organization=f"{req.department} ({req.designation})",
        is_active=is_active
    )
    db.add(officer_user)
    db.commit()
    db.refresh(officer_user)

    # Log audit
    record_audit_log(
        db=db,
        action="OFFICER_CREATED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        details=f"Created Procurement Officer: {req.full_name} ({req.official_email}), Dept: {req.department}, Officer ID: {req.officer_id}"
    )

    return {
        "message": "Officer created successfully",
        "officer": {
            "id": officer_user.id,
            "full_name": officer_user.full_name,
            "email": officer_user.email,
            "role": officer_user.role,
            "organization": officer_user.organization,
            "is_active": officer_user.is_active,
            "created_at": officer_user.created_at
        }
    }

@router.post("/bidders")
def add_bidder(
    req: schemas.BidderCreateRequest,
    current_user: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    # Duplicate checks
    existing_user = db.query(models.User).filter(
        (models.User.email == req.email) | (models.User.email == req.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="A user with this email/username already exists.")

    if req.gstin:
        existing_gst = db.query(models.BidderProfile).filter(models.BidderProfile.gstin == req.gstin).first()
        if existing_gst:
            raise HTTPException(status_code=400, detail="A bidder profile with this GSTIN already exists.")

    if req.pan:
        existing_pan = db.query(models.BidderProfile).filter(models.BidderProfile.pan == req.pan).first()
        if existing_pan:
            raise HTTPException(status_code=400, detail="A bidder profile with this PAN already exists.")

    is_active = req.status.upper() == "ACTIVE"

    bidder_user = models.User(
        email=req.email,
        hashed_password=get_password_hash(req.password),
        full_name=req.authorized_person,
        role="BIDDER",
        organization=req.company_name,
        is_active=is_active
    )
    db.add(bidder_user)
    db.commit()
    db.refresh(bidder_user)

    profile = models.BidderProfile(
        user_id=bidder_user.id,
        company_name=req.company_name,
        gstin=req.gstin,
        pan=req.pan,
        udyam_number=req.udyam_number,
        phone=req.phone,
        address=req.address,
        annual_turnover=50.0
    )
    db.add(profile)
    db.commit()

    record_audit_log(
        db=db,
        action="BIDDER_CREATED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        details=f"Created Bidder Enterprise: {req.company_name} (GSTIN: {req.gstin}, Auth Person: {req.authorized_person})"
    )

    return {
        "message": "Bidder enterprise created successfully",
        "bidder": {
            "id": bidder_user.id,
            "company_name": req.company_name,
            "email": bidder_user.email,
            "gstin": req.gstin,
            "is_active": bidder_user.is_active
        }
    }

@router.post("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    req: schemas.UserStatusUpdateRequest,
    current_user: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    status_upper = req.status.upper()
    if status_upper == "ACTIVE":
        user.is_active = True
    else:
        user.is_active = False

    db.commit()

    record_audit_log(
        db=db,
        action=f"USER_STATUS_CHANGED",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        details=f"Changed status for user {user.email} (ID #{user.id}) to {status_upper}"
    )

    return {"user_id": user.id, "email": user.email, "is_active": user.is_active, "status": status_upper}

@router.post("/users/{user_id}/reset-password")
def reset_user_password(
    user_id: int,
    req: schemas.UserPasswordResetRequest,
    current_user: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(req.new_password)
    db.commit()

    record_audit_log(
        db=db,
        action="USER_PASSWORD_RESET",
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role,
        details=f"Reset password for user {user.email} (ID #{user.id})"
    )

    return {"message": f"Password reset successfully for {user.email}"}

@router.get("/bidders/{user_id}/applications")
def get_bidder_applications(
    user_id: int,
    current_user: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    profile = db.query(models.BidderProfile).filter(models.BidderProfile.user_id == user_id).first()
    if not profile:
        return []

    apps = db.query(models.Application).filter(models.Application.bidder_id == profile.id).all()
    return apps

