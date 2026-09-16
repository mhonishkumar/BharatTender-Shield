import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
# Use the DATABASE_URL from .env
db_url = os.getenv('DATABASE_URL')
engine = create_engine(db_url)

tables = [
    "audit_logs", "users", "bidder_profiles", "tenders", "notifications", 
    "tender_rules", "applications", "documents", "compliance_scores", 
    "verification_results", "officer_decisions", "extracted_data", "clarifications"
]

try:
    with engine.begin() as conn:
        for table in tables:
            print(f"Enabling RLS on {table}...")
            conn.execute(text(f"ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;"))
    print("Successfully enabled Row Level Security (RLS) on all tables.")
except Exception as e:
    print(f"Error: {e}")
