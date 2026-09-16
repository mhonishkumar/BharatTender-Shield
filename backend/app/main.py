import os
from typing import List, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base, SessionLocal, get_db
from app import models, schemas
from app.services.seed_data import initialize_demo_data
from app.routers import (
    auth, tenders, applications, verification, mock_gov,
    clarifications, decisions, reports, audit, admin, notifications
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize Demo Data for SIH Presentation
    db = SessionLocal()
    try:
        initialize_demo_data(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.PROJECT_TAGLINE}\nSIH 2026 Problem Statement: {settings.SIH_STATEMENT}",
    version="1.0.0",
    lifespan=lifespan
)

from sqlalchemy import text

# Dynamic CORS origins configuration
def get_allowed_origins() -> list[str]:
    origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    if settings.FRONTEND_URL:
        origins.append(settings.FRONTEND_URL)
    if settings.ALLOWED_ORIGINS:
        for orig in settings.ALLOWED_ORIGINS.split(","):
            orig = orig.strip()
            if orig and orig not in origins:
                origins.append(orig)
    return origins

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(tenders.router)
app.include_router(applications.router)
app.include_router(verification.router)
app.include_router(mock_gov.router)
app.include_router(clarifications.router)
app.include_router(decisions.router)
app.include_router(reports.router)
app.include_router(audit.router)
app.include_router(admin.router)
app.include_router(notifications.router)

# Serve uploaded documents and static assets
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

@app.get("/logo.jpg")
def get_logo():
    if os.path.exists(settings.LOGO_PATH):
        return FileResponse(str(settings.LOGO_PATH), media_type="image/jpeg")
    return {"error": "Logo not found"}

def _check_db_connection() -> str:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return "connected"
    except Exception as e:
        return "disconnected"

@app.get("/health")
def root_health_check():
    db_status = _check_db_connection()
    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": db_status
    }

@app.get("/api/health")
def api_health_check():
    db_status = _check_db_connection()
    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": db_status,
        "platform": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "ai_engine": "Gemini Flash AI + Deterministic Rule Engine Fallback",
        "audit_security": "SHA-256 Hash Chaining Active"
    }

@app.get("/audit-logs", response_model=List[schemas.AuditLogResponse])
def get_all_audit_logs(
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



