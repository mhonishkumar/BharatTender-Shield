from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app import models
from app.core.security import get_password_hash
from app.services.audit_service import record_audit_log
from app.services.tender_compiler import compile_tender_clauses
from app.services.verifier import run_application_verification

def initialize_demo_data(db: Session):
    # Check if data already exists
    existing_user = db.query(models.User).filter(models.User.email == "officer@gemsentinel.demo").first()
    if existing_user:
        print("[Demo Seed] Database already seeded.")
        return

    print("[Demo Seed] Initializing BharatTender Shield seed data...")

    # 1. Create Demo Users
    demo_password_hash = get_password_hash("Demo@12345")

    officer = models.User(
        email="officer@gemsentinel.demo",
        hashed_password=demo_password_hash,
        full_name="Rajesh Verma, IPoS",
        role="PROCUREMENT_OFFICER",
        organization="GeM Central Procurement Directorate",
        is_active=True
    )
    db.add(officer)

    bidder_user_a = models.User(
        email="bidder@gemsentinel.demo",
        hashed_password=demo_password_hash,
        full_name="Vikramaditya Sharma",
        role="BIDDER",
        organization="ABC Technologies Pvt Ltd",
        is_active=True
    )
    db.add(bidder_user_a)

    bidder_user_b = models.User(
        email="bidder_b@gemsentinel.demo",
        hashed_password=demo_password_hash,
        full_name="Sanjay Kulkarni",
        role="BIDDER",
        organization="DEF Safety Infra Ltd",
        is_active=True
    )
    db.add(bidder_user_b)

    admin = models.User(
        email="admin@gemsentinel.demo",
        hashed_password=demo_password_hash,
        full_name="System Administrator",
        role="ADMIN",
        organization="BharatTender Shield Core Administration",
        is_active=True
    )
    db.add(admin)
    db.commit()
    db.refresh(officer)
    db.refresh(bidder_user_a)
    db.refresh(bidder_user_b)

    # 2. Create Bidder Profiles
    profile_a = models.BidderProfile(
        user_id=bidder_user_a.id,
        company_name="ABC Technologies Pvt Ltd",
        reg_number="U72900TN2020PTC135790",
        gstin="33ABCDE1234F1Z5",
        pan="ABCDE1234F",
        udyam_number="UDYAM-TN-02-0012345",
        annual_turnover=125.5,
        phone="+91 98401 23456",
        address="Plot 42, Tech Corridor Phase 1, Chennai, TN"
    )
    db.add(profile_a)

    profile_b = models.BidderProfile(
        user_id=bidder_user_b.id,
        company_name="DEF Safety Infra Ltd",
        reg_number="U28999MH2019PLC246810",
        gstin="27AABCS1429B1ZB",
        pan="AABCS1429B",
        udyam_number="UDYAM-MH-01-0098765",
        annual_turnover=38.0,
        phone="+91 98200 65432",
        address="MIDC Industrial Area, Turbhe, Navi Mumbai, MH"
    )
    db.add(profile_b)
    db.commit()
    db.refresh(profile_a)
    db.refresh(profile_b)

    # 3. Create Main SIH Demo Tender
    tender = models.Tender(
        tender_ref="GEM-DEMO-2026-001",
        title="Supply of Industrial Safety Equipment & Personal Protective Gear",
        department="Ministry of Heavy Industries / Central Procurement Wing",
        description="Comprehensive procurement tender for standard certified industrial helmets, harness safety units, high-temperature gloves, and protective gear for central PSU engineering facilities.",
        bid_submission_date="10-06-2026",
        deadline="20-06-2026",
        min_turnover=50.0,
        status="OPEN",
        created_by=officer.id
    )
    db.add(tender)
    db.commit()
    db.refresh(tender)

    # 4. Compile and Add Tender Rules
    rules_data = compile_tender_clauses(min_turnover=tender.min_turnover)
    for r in rules_data:
        rule_obj = models.TenderRule(
            tender_id=tender.id,
            rule_code=r["rule_code"],
            category=r["category"],
            requirement=r["requirement"],
            validation_logic=r["validation_logic"],
            is_mandatory=r["is_mandatory"],
            is_approved_by_officer=r["is_approved_by_officer"],
            original_clause=r.get("original_clause")
        )
        db.add(rule_obj)
    db.commit()

    # Log Tender Creation in Audit Chain
    record_audit_log(
        db=db,
        action="TENDER_CREATED",
        user_id=officer.id,
        user_email=officer.email,
        role="PROCUREMENT_OFFICER",
        tender_id=tender.id,
        details=f"Tender {tender.tender_ref} initialized with 6 compiled compliance rules."
    )

    # 5. Create Application for BIDDER A (Compliant, Score 94/100, LOW risk)
    app_a = models.Application(
        application_ref="APP-2026-001",
        tender_id=tender.id,
        bidder_id=profile_a.id,
        status="SUBMITTED",
        submitted_company_name="ABC Technologies Pvt Ltd",
        submitted_reg_number="U72900TN2020PTC135790",
        submitted_gstin="33ABCDE1234F1Z5",
        submitted_pan="ABCDE1234F",
        submitted_udyam="UDYAM-TN-02-0012345",
        submitted_turnover=125.5
    )
    db.add(app_a)
    db.commit()
    db.refresh(app_a)

    # Documents for Bidder A
    doc_a1 = models.Document(
        application_id=app_a.id,
        doc_type="GST_CERTIFICATE",
        file_name="ABC_Tech_GST_Registration_Certificate.pdf",
        file_path="uploads/demo_abc_gst.pdf",
        storage_path="uploads/demo_abc_gst.pdf",
        document_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        uploaded_by=bidder_user_a.id,
        file_size=245000,
        status="UPLOADED",
        verification_status="PENDING"
    )
    doc_a2 = models.Document(
        application_id=app_a.id,
        doc_type="PAN_CARD",
        file_name="ABC_Technologies_PAN_Card.pdf",
        file_path="uploads/demo_abc_pan.pdf",
        storage_path="uploads/demo_abc_pan.pdf",
        document_hash="f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2",
        uploaded_by=bidder_user_a.id,
        file_size=180000,
        status="UPLOADED",
        verification_status="PENDING"
    )
    doc_a3 = models.Document(
        application_id=app_a.id,
        doc_type="UDYAM_CERTIFICATE",
        file_name="ABC_Udyam_Registration_Certificate.pdf",
        file_path="uploads/demo_abc_udyam.pdf",
        storage_path="uploads/demo_abc_udyam.pdf",
        document_hash="5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        uploaded_by=bidder_user_a.id,
        file_size=310000,
        status="UPLOADED",
        verification_status="PENDING"
    )
    doc_a4 = models.Document(
        application_id=app_a.id,
        doc_type="TURNOVER_CERTIFICATE",
        file_name="ABC_CA_Certified_Turnover_Statement_FY24-25.pdf",
        file_path="uploads/demo_abc_turnover.pdf",
        storage_path="uploads/demo_abc_turnover.pdf",
        document_hash="4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
        uploaded_by=bidder_user_a.id,
        file_size=420000,
        status="UPLOADED",
        verification_status="PENDING"
    )
    db.add_all([doc_a1, doc_a2, doc_a3, doc_a4])
    db.commit()

    # Extracted data for Bidder A
    ed_a1 = models.ExtractedData(
        document_id=doc_a1.id,
        field_key="gstin",
        extracted_value="33ABCDE1234F1Z5",
        confidence=0.99,
        snippet="GSTIN: 33ABCDE1234F1Z5 Legal Name: ABC Technologies Pvt Ltd"
    )
    ed_a2 = models.ExtractedData(
        document_id=doc_a2.id,
        field_key="pan",
        extracted_value="ABCDE1234F",
        confidence=0.98,
        snippet="Permanent Account Number: ABCDE1234F"
    )
    ed_a3 = models.ExtractedData(
        document_id=doc_a3.id,
        field_key="udyam_number",
        extracted_value="UDYAM-TN-02-0012345",
        confidence=0.98,
        snippet="Udyam Registration Number: UDYAM-TN-02-0012345 Valid: ACTIVE"
    )
    db.add_all([ed_a1, ed_a2, ed_a3])
    db.commit()

    # 6. Create Application for BIDDER B (Non-compliant, Score 62/100, MEDIUM/HIGH risk)
    # Issues: GSTIN mismatch, expired Udyam on bid date, missing turnover certificate
    app_b = models.Application(
        application_ref="APP-2026-002",
        tender_id=tender.id,
        bidder_id=profile_b.id,
        status="SUBMITTED",
        submitted_company_name="DEF Safety Infra Ltd",
        submitted_reg_number="U28999MH2019PLC246810",
        submitted_gstin="27AABCS1429B1ZB",
        submitted_pan="AABCS1429B",
        submitted_udyam="UDYAM-MH-01-0098765",
        submitted_turnover=38.0
    )
    db.add(app_b)
    db.commit()
    db.refresh(app_b)

    # Documents for Bidder B (Turnover document deliberately omitted!)
    doc_b1 = models.Document(
        application_id=app_b.id,
        doc_type="GST_CERTIFICATE",
        file_name="DEF_Safety_GST_Certificate.pdf",
        file_path="uploads/demo_def_gst.pdf",
        storage_path="uploads/demo_def_gst.pdf",
        document_hash="ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
        uploaded_by=bidder_user_b.id,
        file_size=220000,
        status="UPLOADED",
        verification_status="PENDING"
    )
    doc_b2 = models.Document(
        application_id=app_b.id,
        doc_type="PAN_CARD",
        file_name="DEF_Company_PAN_Copy.pdf",
        file_path="uploads/demo_def_pan.pdf",
        storage_path="uploads/demo_def_pan.pdf",
        document_hash="e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683",
        uploaded_by=bidder_user_b.id,
        file_size=175000,
        status="UPLOADED",
        verification_status="PENDING"
    )
    doc_b3 = models.Document(
        application_id=app_b.id,
        doc_type="UDYAM_CERTIFICATE",
        file_name="DEF_MSME_Udyam_Registration.pdf",
        file_path="uploads/demo_def_udyam.pdf",
        storage_path="uploads/demo_def_udyam.pdf",
        document_hash="7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451",
        uploaded_by=bidder_user_b.id,
        file_size=295000,
        status="UPLOADED",
        verification_status="PENDING"
    )
    db.add_all([doc_b1, doc_b2, doc_b3])
    db.commit()


    # Extracted data for Bidder B showing contradictory GSTIN embedded in Udyam
    ed_b1 = models.ExtractedData(
        document_id=doc_b1.id,
        field_key="gstin",
        extracted_value="27AABCS1429B1ZB",
        confidence=0.98,
        snippet="GSTIN: 27AABCS1429B1ZB Entity: DEF Safety Infra Ltd"
    )
    ed_b2 = models.ExtractedData(
        document_id=doc_b2.id,
        field_key="pan",
        extracted_value="AABCS1429B",
        confidence=0.97,
        snippet="Income Tax PAN: AABCS1429B"
    )
    # Here is the deliberate mismatch!
    ed_b3 = models.ExtractedData(
        document_id=doc_b3.id,
        field_key="gstin",
        extracted_value="33ABCDE1234F1Z1", # Contradicts 27AABCS1429B1ZB!
        confidence=0.97,
        snippet="Associated Enterprise GSTIN: 33ABCDE1234F1Z1"
    )
    ed_b4 = models.ExtractedData(
        document_id=doc_b3.id,
        field_key="valid_until",
        extracted_value="2025-12-31", # Expired before June 2026 bid date!
        confidence=0.96,
        snippet="Registration Period Valid Till: 31-Dec-2025 (Expired)"
    )
    db.add_all([ed_b1, ed_b2, ed_b3, ed_b4])
    db.commit()

    # 7. Pre-run verification on both bidders to make immediate dashboard display realistic
    print("[Demo Seed] Running initial AI verification on demo applications...")
    run_application_verification(db, app_a.id, officer.id)
    run_application_verification(db, app_b.id, officer.id)

    # 8. Notifications for Bidder & Officer
    notif1 = models.Notification(
        user_id=bidder_user_b.id,
        title="⚠️ Action Required: Compliance Discrepancy",
        message="A potential GSTIN mismatch and missing turnover certificate were flagged in your application for GEM-DEMO-2026-001.",
        notification_type="WARNING",
        link="/bidder/verification"
    )
    notif2 = models.Notification(
        user_id=officer.id,
        title="High Risk Bidder Detected",
        message="DEF Safety Infra Ltd has 3 critical compliance issues requiring officer review on GEM-DEMO-2026-001.",
        notification_type="URGENT",
        link=f"/officer/verification/{app_b.id}"
    )
    db.add_all([notif1, notif2])
    db.commit()

    print("[Demo Seed] BharatTender Shield seed data successfully initialized!")
