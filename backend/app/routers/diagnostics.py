from fastapi import APIRouter
from sqlalchemy import text
from app.database import engine
import logging

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

@router.get("/connect-db")
def test_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("[connect-db] Database connection successful")
        return {"status": "connected"}
    except Exception as e:
        logger.error(f"[connect-db] Database connection failed: {e}")
        return {"status": "failed", "error": str(e)}
