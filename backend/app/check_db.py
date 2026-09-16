import os
import sys
# Add the backend directory to PYTHONPATH for local execution
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.config import settings
from app.database import engine
from sqlalchemy import text
from app.config import settings
from app.database import engine
from sqlalchemy import text

def main():
    # Mask password for safety in logs
    url = settings.DATABASE_URL
    masked = url
    if "@" in url:
        prefix, rest = url.split("//", 1)
        user_pass, host = rest.split("@", 1)
        if ":" in user_pass:
            user, _ = user_pass.split(":", 1)
            masked = f"{prefix}//{user}:***@{host}"
        else:
            masked = f"{prefix}//***@{host}"
    print(f"[check_db] Using DATABASE_URL: {masked}")
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("[check_db] ✅ Database connection successful")
    except Exception as e:
        print("[check_db] ❌ Database connection failed:")
        print(e)

if __name__ == "__main__":
    main()
