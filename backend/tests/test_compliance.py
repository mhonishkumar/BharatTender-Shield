import os
import pytest
from app.database import SessionLocal, Base, engine
from app import models
from app.services.seed_data import initialize_demo_data
from app.services.mock_gov_api import verify_gstin_mock, verify_pan_mock, verify_udyam_mock
from app.services.audit_service import verify_chain_integrity, record_audit_log
from app.services.verifier import run_application_verification
from app.services.report_generator import generate_compliance_report

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()
    initialize_demo_data(db_session)
    yield db_session
    db_session.close()

def test_mock_gst():
    gst_res = verify_gstin_mock("33ABCDE1234F1Z5")
    assert gst_res["verified"] is True
    assert gst_res["status"] == "ACTIVE"

def test_mock_pan():
    pan_res = verify_pan_mock("ABCDE1234F")
    assert pan_res["verified"] is True

def test_mock_udyam():
    udyam_res = verify_udyam_mock("UDYAM-TN-02-0012345")
    assert udyam_res["verified"] is True

def test_compliant_bidder_a(db):
    app_a = db.query(models.Application).filter(models.Application.application_ref == "APP-2026-001").first()
    assert app_a is not None
    assert app_a.compliance_score >= 80
    assert app_a.risk_level == "LOW"

def test_non_compliant_bidder_b(db):
    app_b = db.query(models.Application).filter(models.Application.application_ref == "APP-2026-002").first()
    assert app_b is not None
    assert app_b.compliance_score < 80
    mismatch_findings = [r for r in app_b.verification_results if "mismatch" in r.finding.lower()]
    assert len(mismatch_findings) > 0

def test_audit_hash_chain_integrity(db):
    integrity = verify_chain_integrity(db)
    assert integrity.is_valid is True
    assert integrity.total_records > 0

def test_report_generation(db):
    app_b = db.query(models.Application).filter(models.Application.application_ref == "APP-2026-002").first()
    pdf_path = generate_compliance_report(app_b)
    assert os.path.exists(pdf_path)
    assert os.path.getsize(pdf_path) > 1000

