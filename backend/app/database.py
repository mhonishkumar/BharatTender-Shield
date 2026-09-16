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
    pool_kwargs = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_size": 10,
        "max_overflow": 20,
        "echo": False
    }

    # If URL is generic postgresql://, try drivers in order of preference
    candidate_urls = []
    if db_url.startswith("postgresql+psycopg://"):
        candidate_urls = [
            db_url,
            db_url.replace("postgresql+psycopg://", "postgresql+psycopg2://"),
            db_url.replace("postgresql+psycopg://", "postgresql://")
        ]
    elif db_url.startswith("postgresql+psycopg2://"):
        candidate_urls = [
            db_url,
            db_url.replace("postgresql+psycopg2://", "postgresql+psycopg://"),
            db_url.replace("postgresql+psycopg2://", "postgresql://")
        ]
    elif db_url.startswith("postgresql://"):
        candidate_urls = [
            db_url.replace("postgresql://", "postgresql+psycopg://"),
            db_url.replace("postgresql://", "postgresql+psycopg2://"),
            db_url
        ]
    else:
        candidate_urls = [db_url]

    last_error = None
    for url in candidate_urls:
        try:
            eng = create_engine(url, **pool_kwargs)
            # Test that the dbapi driver can actually be loaded
            _ = eng.dialect.dbapi
            return eng
        except Exception as e:
            last_error = e
            continue

    if last_error:
        raise last_error
    return create_engine(db_url, **pool_kwargs)

engine = _create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)




Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
