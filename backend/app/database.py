import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("uvicorn.error")

def _create_db_engine():
    """Create a SQLAlchemy engine.
    - SQLite for local dev (when DATABASE_URL is not set)
    - PostgreSQL+psycopg2 for Supabase/Render
    """
    db_url = settings.DATABASE_URL

    # SQLite fallback for local development
    if db_url.startswith("sqlite"):
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=False,
        )

    # PostgreSQL — force psycopg2 driver (most reliable on Render)
    # Normalize any variant to postgresql+psycopg2://
    for prefix in ("postgresql+psycopg://", "postgresql://", "postgres://"):
        if db_url.startswith(prefix):
            db_url = db_url.replace(prefix, "postgresql+psycopg2://", 1)
            break

    logger.info(f"[database] Connecting with driver: psycopg2")

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
