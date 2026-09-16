from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

def _create_db_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite"):
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=False
        )

    # For PostgreSQL on cloud (Render / Supabase)
    # Attempt psycopg v3 driver first; if not present, fallback to psycopg2 or standard postgresql
    pool_kwargs = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_size": 10,
        "max_overflow": 20,
        "echo": False
    }

    try:
        return create_engine(db_url, **pool_kwargs)
    except Exception as err:
        if "psycopg" in db_url:
            # Try psycopg2 fallback
            fallback_url = db_url.replace("postgresql+psycopg://", "postgresql+psycopg2://")
            try:
                return create_engine(fallback_url, **pool_kwargs)
            except Exception:
                pass
        raise err

engine = _create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
