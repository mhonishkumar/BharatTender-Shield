import os
from pathlib import Path

try:
    from pydantic_settings import BaseSettings
except ImportError:
    class BaseSettings:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "BharatTender Shield"
    PROJECT_TAGLINE: str = "Every Bid Verified. Every Decision Defensible."
    SIH_STATEMENT: str = "26100 - AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bharattendershield-super-secret-key-2026-sih")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/bharattender_shield.db")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    REPORTS_DIR: Path = BASE_DIR / "generated_reports"
    LOGO_PATH: Path = BASE_DIR / "logo.jpg"
    
    # Brand Theme Colors
    COLOR_PRIMARY_NAVY: str = "#0F294A"
    COLOR_SECONDARY_GREEN: str = "#15803D"
    COLOR_ACCENT_ORANGE: str = "#EA580C"
    COLOR_BACKGROUND: str = "#F8FAFC"
    COLOR_TEXT: str = "#0F172A"

settings = Settings()

# Ensure directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
