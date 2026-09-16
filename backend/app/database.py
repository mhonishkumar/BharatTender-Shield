# Updated to force new deploy

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("uvicorn.error")

def _create_db_engine():
    """Create a SQLAlchemy engine.
    - SQLite for local dev when `DATABASE_URL` is not set.
    - PostgreSQL on Render/Supabase using the `psycopg` (psycopg3) driver.
    """
    db_url = settings.DATABASE_URL

    # SQLite fallback for local development
    if db_url.startswith("sqlite"):
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=False,
        )

    # Normalize any PostgreSQL URL to use the psycopg driver
    # Accepted prefixes: postgresql://, postgres://, postgresql+psycopg://
    for prefix in ("postgresql://", "postgres://", "postgresql+psycopg://"):
        if db_url.startswith(prefix):
            db_url = db_url.replace(prefix, "postgresql+psycopg://", 1)
            break

    logger.info(f"[database] Using driver URL: {db_url}")

    return create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=5,
        max_overflow=10,
        echo=False,
    )

# Create engine and session factory at import time
engine = _create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
