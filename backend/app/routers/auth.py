from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.core.security import (
    verify_password, get_password_hash, create_access_token, get_current_user
)
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is disabled")

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "user_id": user.id}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email
    }

@router.post("/demo-login/{role}", response_model=schemas.Token)
def demo_login(role: str, db: Session = Depends(get_db)):
    """
    Convenience endpoint for instant SIH demo presentation logins.
    """
    role_map = {
        "officer": "officer@gemsentinel.demo",
        "bidder": "bidder@gemsentinel.demo",
        "bidder_b": "bidder_b@gemsentinel.demo",
        "admin": "admin@gemsentinel.demo"
    }
    email = role_map.get(role.lower())
    if not email:
        raise HTTPException(status_code=400, detail=f"Invalid demo role: {role}")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found. Database may need seeding.")

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "user_id": user.id}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email
    }

@router.post("/register", response_model=schemas.UserResponse)
def register(reg: schemas.RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == reg.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=reg.email,
        hashed_password=get_password_hash(reg.password),
        full_name=reg.full_name,
        role=reg.role,
        organization=reg.organization or reg.company_name,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if reg.role == "BIDDER":
        profile = models.BidderProfile(
            user_id=user.id,
            company_name=reg.company_name or reg.full_name,
            gstin=reg.gstin,
            pan=reg.pan,
            udyam_number=reg.udyam_number,
            annual_turnover=50.0
        )
        db.add(profile)
        db.commit()

    return user

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
