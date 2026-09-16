import os
from pathlib import Path

try:
    from pydantic_settings import BaseSettings
except ImportError:
    class BaseSettings:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent

# Use /tmp on cloud deployments (Render sets RENDER=true automatically)
_IS_CLOUD = bool(os.getenv("RENDER") or os.getenv("DYNO") or os.getenv("CLOUD_ENV"))
_TMP_DIR = Path("/tmp/bharattender")

def _get_database_url() -> str:
    url = os.getenv("DATABASE_URL", "").strip()
    if not url:
        return f"sqlite:///{BASE_DIR}/bharattender_shield.db"
    # Normalize postgres:// to postgresql+psycopg://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)
    elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url

class Settings:
    PROJECT_NAME: str = "BharatTender Shield"
    PROJECT_TAGLINE: str = "Every Bid Verified. Every Decision Defensible."
    SIH_STATEMENT: str = "26100 - AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement"

    # Support both JWT_SECRET and SECRET_KEY
    SECRET_KEY: str = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY", "bharattendershield-super-secret-key-2026-sih")
    JWT_SECRET: str = SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    DATABASE_URL: str = _get_database_url()

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "")

    UPLOAD_DIR: Path = (_TMP_DIR / "uploads") if _IS_CLOUD else (BASE_DIR / "uploads")
    REPORTS_DIR: Path = (_TMP_DIR / "reports") if _IS_CLOUD else (BASE_DIR / "generated_reports")
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

