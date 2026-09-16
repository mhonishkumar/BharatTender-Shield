import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User
from app.core.security import get_password_hash

def seed():
    db = SessionLocal()
    try:
        hashed_pwd = get_password_hash("SecurePass123!")
        
        users = [
            User(email="admin@bharattender.com", hashed_password=hashed_pwd, role="ADMIN", full_name="System Administrator", organization="BharatTender Shield Admin", is_active=True),
            User(email="bidder1@bharattender.com", hashed_password=hashed_pwd, role="BIDDER", full_name="Bidder One", organization="Bidder One Corp", is_active=True),
            User(email="bidder2@bharattender.com", hashed_password=hashed_pwd, role="BIDDER", full_name="Bidder Two", organization="Bidder Two Inc", is_active=True),
            User(email="bidder3@bharattender.com", hashed_password=hashed_pwd, role="BIDDER", full_name="Bidder Three", organization="Bidder Three LLC", is_active=True),
            User(email="officer1@bharattender.gov.in", hashed_password=hashed_pwd, role="PROCUREMENT_OFFICER", full_name="Officer One", organization="Ministry of Defense", is_active=True),
            User(email="officer2@bharattender.gov.in", hashed_password=hashed_pwd, role="PROCUREMENT_OFFICER", full_name="Officer Two", organization="Ministry of Education", is_active=True),
            User(email="officer3@bharattender.gov.in", hashed_password=hashed_pwd, role="PROCUREMENT_OFFICER", full_name="Officer Three", organization="Ministry of Health", is_active=True),
        ]
        
        count = 0
        for user in users:
            existing = db.query(User).filter(User.email == user.email).first()
            if not existing:
                db.add(user)
                count += 1
            else:
                existing.hashed_password = hashed_pwd

        # Also update demo admin password
        admin_demo = db.query(User).filter(User.email == "admin@gemsentinel.demo").first()
        if admin_demo:
            admin_demo.hashed_password = hashed_pwd
                
        db.commit()
        print(f"Seeding complete. Inserted {count} new users.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
