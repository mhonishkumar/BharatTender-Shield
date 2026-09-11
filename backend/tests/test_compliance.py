import os
from app.database import SessionLocal
from app import models
from app.services.mock_gov_api import verify_gstin_mock, verify_pan_mock, verify_udyam_mock
from app.services.audit_service import verify_chain_integrity, record_audit_log
from app.services.verifier import run_application_verification
from app.services.report_generator import generate_compliance_report

def run_all_tests():
    db = SessionLocal()
    print("\n--- RUNNING BHARATTENDER SHIELD AUTOMATED TEST SUITE ---")
    
    # Test 1: Mock Gov Verification
    gst_res = verify_gstin_mock("33ABCDE1234F1Z5")
    assert gst_res["verified"] is True, "GST mock verification failed"
    assert gst_res["status"] == "ACTIVE", "GST status should be ACTIVE"
    print("✓ Test 1 Passed: Mock GST verification functional.")

    pan_res = verify_pan_mock("ABCDE1234F")
    assert pan_res["verified"] is True, "PAN mock verification failed"
    print("✓ Test 2 Passed: Mock PAN verification functional.")

    udyam_res = verify_udyam_mock("UDYAM-TN-02-0012345")
    assert udyam_res["verified"] is True, "Udyam mock verification failed"
    print("✓ Test 3 Passed: Mock Udyam verification functional.")

    # Test 4: Applications & Bidder Data
    app_a = db.query(models.Application).filter(models.Application.application_ref == "APP-2026-001").first()
    assert app_a is not None, "Application APP-2026-001 not found"
    assert app_a.compliance_score >= 80, f"Bidder A score should be >= 80, got {app_a.compliance_score}"
    assert app_a.risk_level == "LOW", f"Bidder A risk should be LOW, got {app_a.risk_level}"
    print(f"✓ Test 4 Passed: Bidder A compliant (Score: {app_a.compliance_score}, Risk: {app_a.risk_level}).")

    app_b = db.query(models.Application).filter(models.Application.application_ref == "APP-2026-002").first()
    assert app_b is not None, "Application APP-2026-002 not found"
    assert app_b.compliance_score < 80, f"Bidder B score should be < 80, got {app_b.compliance_score}"
    # Check for GSTIN mismatch in verification results
    mismatch_findings = [r for r in app_b.verification_results if "mismatch" in r.finding.lower()]
    assert len(mismatch_findings) > 0, "Bidder B should have GSTIN mismatch finding"
    print(f"✓ Test 5 Passed: Bidder B discrepancy detection (Score: {app_b.compliance_score}, Risk: {app_b.risk_level}, Mismatches: {len(mismatch_findings)}).")

    # Test 6: SHA-256 Hash Chain Integrity
    integrity = verify_chain_integrity(db)
    assert integrity.is_valid is True, f"Audit chain integrity broken: {integrity.message}"
    print(f"✓ Test 6 Passed: SHA-256 hash chain 100% intact ({integrity.total_records} chained records verified).")

    # Test 7: ReportLab PDF Report Generation
    pdf_path = generate_compliance_report(app_b)
    assert os.path.exists(pdf_path), f"Report file not generated at {pdf_path}"
    pdf_size = os.path.getsize(pdf_path)
    assert pdf_size > 1000, f"PDF file size unexpectedly small ({pdf_size} bytes)"
    print(f"✓ Test 7 Passed: ReportLab official compliance PDF generated ({pdf_size} bytes).")

    db.close()
    print("--- ALL 7 AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY! ---\n")

if __name__ == "__main__":
    run_all_tests()
