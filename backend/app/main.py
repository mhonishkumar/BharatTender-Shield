import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.database import engine, Base, SessionLocal
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

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "platform": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "ai_engine": "Gemini Flash AI + Deterministic Rule Engine Fallback",
        "audit_security": "SHA-256 Hash Chaining Active"
    }
