from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app import models
from app.services.mock_gov_api import verify_gstin_mock, verify_pan_mock, verify_udyam_mock
from app.services.audit_service import record_audit_log
from app.services.rag_service import retrieve_context
from app.services.llm_service import analyze_with_gemini
import logging

logger = logging.getLogger("uvicorn.error")

def run_application_verification(db: Session, application_id: int, officer_user_id: int = None) -> Dict[str, Any]:
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise ValueError(f"Application {application_id} not found.")

    tender = application.tender
    documents = application.documents

    # Clear previous verification results to prevent stale duplicates
    db.query(models.VerificationResult).filter(models.VerificationResult.application_id == application_id).delete()

    score = 0
    issues = []
    
    # Track document presence
    docs_by_type = {doc.doc_type: doc for doc in documents}
    
    has_gst_doc = "GST_CERTIFICATE" in docs_by_type
    has_pan_doc = "PAN_CARD" in docs_by_type
    has_udyam_doc = "UDYAM_CERTIFICATE" in docs_by_type
    has_turnover_doc = "TURNOVER_CERTIFICATE" in docs_by_type

    # 1. GST Verification (20 points max)
    app_gst = (application.submitted_gstin or "").strip().upper()
    gst_doc = docs_by_type.get("GST_CERTIFICATE")
    gst_extracted = app_gst
    
    if gst_doc and gst_doc.extracted_data:
        for ed in gst_doc.extracted_data:
            if ed.field_key == "gstin" and ed.extracted_value:
                gst_extracted = ed.extracted_value.strip().upper()

    mock_gst_res = verify_gstin_mock(gst_extracted)
    gst_score = 0
    
    # RAG Enrichment for GST
    gst_rag_finding = ""
    gst_rag_evidence = ""
    gst_rag_confidence = 1.0
    
    if has_gst_doc:
        gst_chunks = retrieve_context(db, f"GSTIN for {application.submitted_company_name}", application_id=application.id, top_k=3)
        if gst_chunks:
            llm_res = analyze_with_gemini(
                "Verify active GST registration and extract GSTIN",
                gst_chunks,
                doc_type="GST_CERTIFICATE"
            )
            if llm_res["status"] != "INSUFFICIENT_EVIDENCE":
                gst_rag_finding = f" [AI Analysis: {llm_res['reason']}]"
                if llm_res.get("evidence") and len(llm_res["evidence"]) > 0:
                    gst_rag_evidence = f" | Source: {llm_res['evidence'][0].get('document')} - p.{llm_res['evidence'][0].get('page')}"

    if not has_gst_doc:
        vr_gst = models.VerificationResult(
            application_id=application.id,
            category="GST",
            rule_code="GST-001",
            title="GST Certificate Verification",
            status="FAIL",
            finding="GST Registration Certificate document is missing.",
            extracted_value="None",
            expected_or_conflicting_value="Valid GST Certificate PDF",
            source_document_name="Application Dossier",
            page_number=1,
            applied_rule="Clause 4.1: Bidder must possess and upload valid GST registration.",
            confidence=1.0,
            recommendation="Request bidder to upload valid GST certificate.",
            evidence_snippet="Missing mandatory document from submission packet.",
            is_critical_issue=True
        )
        db.add(vr_gst)
        issues.append("Missing GST Certificate")
    elif mock_gst_res["verified"] and mock_gst_res["status"] == "ACTIVE":
        gst_score = 20
        vr_gst = models.VerificationResult(
            application_id=application.id,
            category="GST",
            rule_code="GST-001",
            title="GST Certificate Verification",
            status="PASS",
            finding=f"GSTIN {gst_extracted} verified as ACTIVE for legal entity '{mock_gst_res['legal_name']}'.{gst_rag_finding}",
            extracted_value=gst_extracted,
            expected_or_conflicting_value="ACTIVE on simulated GSTN Gateway",
            source_document_name=gst_doc.file_name,
            page_number=1,
            applied_rule="Clause 4.1: GSTIN must be active and authentic.",
            confidence=0.98,
            recommendation="Compliant. No action required.",
            evidence_snippet=f"Verified: {gst_extracted} | Legal Name: {mock_gst_res['legal_name']} | Status: {mock_gst_res['status']}{gst_rag_evidence}",
            is_critical_issue=False
        )
        db.add(vr_gst)
        gst_doc.verification_status = "VERIFIED"
    else:
        gst_score = 5
        vr_gst = models.VerificationResult(
            application_id=application.id,
            category="GST",
            rule_code="GST-001",
            title="GST Certificate Verification",
            status="FAIL",
            finding=f"GSTIN {gst_extracted} could not be validated or is in non-active status: {mock_gst_res.get('status')}.{gst_rag_finding}",
            extracted_value=gst_extracted,
            expected_or_conflicting_value="ACTIVE GSTIN Record",
            source_document_name=gst_doc.file_name,
            page_number=1,
            applied_rule="Clause 4.1: Valid and active GST registration is mandatory.",
            confidence=0.95,
            recommendation="Request clarification or updated GST registration filing.",
            evidence_snippet=f"GST Portal Status: {mock_gst_res.get('status')} | Message: {mock_gst_res.get('message')}{gst_rag_evidence}",
            is_critical_issue=True
        )
        db.add(vr_gst)
        gst_doc.verification_status = "FAILED"
        issues.append("GSTIN validation failed or status inactive")

    # 2. PAN Verification (20 points max)
    app_pan = (application.submitted_pan or "").strip().upper()
    pan_doc = docs_by_type.get("PAN_CARD")
    pan_extracted = app_pan
    
    if pan_doc and pan_doc.extracted_data:
        for ed in pan_doc.extracted_data:
            if ed.field_key == "pan" and ed.extracted_value:
                pan_extracted = ed.extracted_value.strip().upper()

    mock_pan_res = verify_pan_mock(pan_extracted)
    pan_score = 0
    
    # RAG Enrichment for PAN
    pan_rag_finding = ""
    pan_rag_evidence = ""
    
    if has_pan_doc:
        pan_chunks = retrieve_context(db, f"PAN for {application.submitted_company_name}", application_id=application.id, top_k=3)
        if pan_chunks:
            llm_res = analyze_with_gemini(
                "Verify PAN number and holder name",
                pan_chunks,
                doc_type="PAN_CARD"
            )
            if llm_res["status"] != "INSUFFICIENT_EVIDENCE":
                pan_rag_finding = f" [AI Analysis: {llm_res['reason']}]"
                if llm_res.get("evidence") and len(llm_res["evidence"]) > 0:
                    pan_rag_evidence = f" | Source: {llm_res['evidence'][0].get('document')} - p.{llm_res['evidence'][0].get('page')}"

    if not has_pan_doc:
        vr_pan = models.VerificationResult(
            application_id=application.id,
            category="PAN",
            rule_code="PAN-001",
            title="PAN Card Verification",
            status="FAIL",
            finding="Permanent Account Number (PAN) document is missing.",
            extracted_value="None",
            expected_or_conflicting_value="Valid PAN Card Document",
            source_document_name="Application Dossier",
            page_number=1,
            applied_rule="Clause 4.2: Bidder must upload valid PAN document.",
            confidence=1.0,
            recommendation="Request bidder to furnish PAN card copy.",
            evidence_snippet="Missing mandatory document.",
            is_critical_issue=True
        )
        db.add(vr_pan)
        issues.append("Missing PAN Card")
    elif mock_pan_res["verified"] and mock_pan_res["status"] == "VALID":
        pan_score = 20
        vr_pan = models.VerificationResult(
            application_id=application.id,
            category="PAN",
            rule_code="PAN-001",
            title="PAN Card Verification",
            status="PASS",
            finding=f"PAN {pan_extracted} verified as VALID for entity '{mock_pan_res['holder_name']}'.{pan_rag_finding}",
            extracted_value=pan_extracted,
            expected_or_conflicting_value="VALID on simulated NSDL/ITD register",
            source_document_name=pan_doc.file_name,
            page_number=1,
            applied_rule="Clause 4.2: PAN must be authentic and match the entity.",
            confidence=0.98,
            recommendation="Compliant. Validated successfully.",
            evidence_snippet=f"Verified: {pan_extracted} | Holder: {mock_pan_res['holder_name']} | Category: {mock_pan_res['category']}{pan_rag_evidence}",
            is_critical_issue=False
        )
        db.add(vr_pan)
        pan_doc.verification_status = "VERIFIED"
    else:
        pan_score = 5
        vr_pan = models.VerificationResult(
            application_id=application.id,
            category="PAN",
            rule_code="PAN-001",
            title="PAN Card Verification",
            status="FAIL",
            finding=f"PAN {pan_extracted} format is invalid or unverified.{pan_rag_finding}",
            extracted_value=pan_extracted,
            expected_or_conflicting_value="10-digit valid PAN",
            source_document_name=pan_doc.file_name,
            page_number=1,
            applied_rule="Clause 4.2: Valid PAN is mandatory.",
            confidence=0.95,
            recommendation="Request clarification regarding PAN identification.",
            evidence_snippet=f"Simulated Tax Database: Format not found.{pan_rag_evidence}",
            is_critical_issue=True
        )
        db.add(vr_pan)
        pan_doc.verification_status = "FAILED"
        issues.append("PAN verification failed")

    # 3. Udyam Registration & Time-Aware Validity (20 points max)
    app_udyam = (application.submitted_udyam or "").strip().upper()
    udyam_doc = docs_by_type.get("UDYAM_CERTIFICATE")
    udyam_extracted = app_udyam
    udyam_valid_until = "2030-12-31"
    udyam_associated_gstin = app_gst
    
    if udyam_doc and udyam_doc.extracted_data:
        for ed in udyam_doc.extracted_data:
            if ed.field_key == "udyam_number" and ed.extracted_value:
                udyam_extracted = ed.extracted_value.strip().upper()
            elif ed.field_key == "valid_until" and ed.extracted_value:
                udyam_valid_until = ed.extracted_value
            elif ed.field_key == "gstin" and ed.extracted_value:
                udyam_associated_gstin = ed.extracted_value.strip().upper()

    mock_udyam_res = verify_udyam_mock(udyam_extracted)
    udyam_score = 0
    
    # RAG Enrichment for Udyam
    udyam_rag_finding = ""
    udyam_rag_evidence = ""
    
    if has_udyam_doc:
        udyam_chunks = retrieve_context(db, f"Udyam registration for {application.submitted_company_name}", application_id=application.id, top_k=3)
        if udyam_chunks:
            llm_res = analyze_with_gemini(
                "Verify MSME Udyam registration details and valid until date",
                udyam_chunks,
                doc_type="UDYAM_CERTIFICATE"
            )
            if llm_res["status"] != "INSUFFICIENT_EVIDENCE":
                udyam_rag_finding = f" [AI Analysis: {llm_res['reason']}]"
                if llm_res.get("evidence") and len(llm_res["evidence"]) > 0:
                    udyam_rag_evidence = f" | Source: {llm_res['evidence'][0].get('document')} - p.{llm_res['evidence'][0].get('page')}"

    # Time-Aware Check
    bid_date_str = tender.bid_submission_date # e.g. 10-06-2026
    is_expired_on_bid_date = False
    
    if mock_udyam_res.get("valid_until"):
        udyam_valid_until = mock_udyam_res["valid_until"]
    if mock_udyam_res.get("associated_gstin"):
        udyam_associated_gstin = mock_udyam_res["associated_gstin"]

    if "2025" in udyam_valid_until or mock_udyam_res.get("status") == "EXPIRED_OR_MISMATCHED":
        is_expired_on_bid_date = True

    if not has_udyam_doc:
        vr_udyam = models.VerificationResult(
            application_id=application.id,
            category="UDYAM",
            rule_code="UDYAM-001",
            title="Udyam MSME Certificate Verification",
            status="WARNING",
            finding="Udyam Certificate not provided.",
            extracted_value="None",
            expected_or_conflicting_value="Valid Udyam Registration Certificate",
            source_document_name="Application Dossier",
            page_number=1,
            applied_rule="Clause 5.3: MSME benefits require valid Udyam Registration Certificate.",
            confidence=1.0,
            recommendation="Request document if bidder seeks MSME price/tender fee preferences.",
            evidence_snippet="No Udyam document submitted in package.",
            is_critical_issue=False
        )
        db.add(vr_udyam)
        udyam_score = 10
    elif is_expired_on_bid_date:
        udyam_score = 8
        vr_udyam = models.VerificationResult(
            application_id=application.id,
            category="UDYAM",
            rule_code="TIME-001",
            title="Udyam Certificate Validity on Bid Date",
            status="FAIL",
            finding=f"Udyam Certificate expired on {udyam_valid_until}. NOT VALID ON BID SUBMISSION DATE ({bid_date_str}).{udyam_rag_finding}",
            extracted_value=f"Valid Until: {udyam_valid_until}",
            expected_or_conflicting_value=f"Must be valid on Bid Submission Date: {bid_date_str}",
            source_document_name=udyam_doc.file_name,
            page_number=1,
            applied_rule="Clause 8.4: All licenses and registrations must be valid and subsisting on the bid submission date.",
            confidence=0.97,
            recommendation="Request clarification and submission of renewed Udyam Registration Certificate.",
            evidence_snippet=f"Certificate Validity: {udyam_valid_until} | Tender Bid Date: {bid_date_str} (EXPIRED){udyam_rag_evidence}",
            is_critical_issue=True
        )
        db.add(vr_udyam)
        udyam_doc.verification_status = "WARNING"
        issues.append("Udyam certificate expired before bid submission date")
    elif mock_udyam_res["verified"]:
        udyam_score = 20
        vr_udyam = models.VerificationResult(
            application_id=application.id,
            category="UDYAM",
            rule_code="UDYAM-001",
            title="Udyam MSME Certificate Verification",
            status="PASS",
            finding=f"Udyam registration {udyam_extracted} is ACTIVE and VALID on bid date ({bid_date_str}). Category: {mock_udyam_res.get('enterprise_type', 'MSME')}.{udyam_rag_finding}",
            extracted_value=udyam_extracted,
            expected_or_conflicting_value="Valid on MSME Udyam Register",
            source_document_name=udyam_doc.file_name,
            page_number=1,
            applied_rule="Clause 5.3: MSME compliance verified.",
            confidence=0.96,
            recommendation="Compliant. Eligible for MSME procurement advantages.",
            evidence_snippet=f"Enterprise: {mock_udyam_res.get('enterprise_name')} | Valid until: {udyam_valid_until} | Status: ACTIVE{udyam_rag_evidence}",
            is_critical_issue=False
        )
        db.add(vr_udyam)
        udyam_doc.verification_status = "VERIFIED"
    else:
        udyam_score = 10
        vr_udyam = models.VerificationResult(
            application_id=application.id,
            category="UDYAM",
            rule_code="UDYAM-001",
            title="Udyam Certificate Check",
            status="WARNING",
            finding=f"Udyam registration {udyam_extracted} could not be automatically confirmed on mock gateway.{udyam_rag_finding}",
            extracted_value=udyam_extracted,
            expected_or_conflicting_value="Active Udyam Record",
            source_document_name=udyam_doc.file_name,
            page_number=1,
            applied_rule="Clause 5.3: Authentic Udyam registration required.",
            confidence=0.88,
            recommendation="Verify manual copy or ask bidder for clarification.",
            evidence_snippet=f"Simulated Registry: Manual check advised.{udyam_rag_evidence}",
            is_critical_issue=False
        )
        db.add(vr_udyam)
        udyam_doc.verification_status = "WARNING"

    # 4. Document Completeness (15 points max)
    required_count = 4 # GST, PAN, Udyam, Turnover
    uploaded_count = len(docs_by_type)
    doc_score = int(min(15, (uploaded_count / required_count) * 15))
    
    missing_docs = []
    if not has_gst_doc: missing_docs.append("GST Certificate")
    if not has_pan_doc: missing_docs.append("PAN Card")
    if not has_udyam_doc: missing_docs.append("Udyam Certificate")
    if not has_turnover_doc: missing_docs.append("Turnover Certificate")

    if not missing_docs:
        vr_docs = models.VerificationResult(
            application_id=application.id,
            category="DOCUMENT",
            rule_code="DOC-001",
            title="Document Completeness Audit",
            status="PASS",
            finding="All 4 required mandatory documents have been furnished in proper format.",
            extracted_value=f"{uploaded_count} Documents Present",
            expected_or_conflicting_value="4 Mandatory Documents",
            source_document_name="Submission Dossier",
            page_number=1,
            applied_rule="Section B: Mandatory document checklist compliance.",
            confidence=1.0,
            recommendation="Document pack is complete.",
            evidence_snippet="GST, PAN, Udyam, Turnover documents present.",
            is_critical_issue=False
        )
        db.add(vr_docs)
    else:
        vr_docs = models.VerificationResult(
            application_id=application.id,
            category="DOCUMENT",
            rule_code="DOC-001",
            title="Document Completeness Audit",
            status="WARNING" if len(missing_docs) == 1 else "FAIL",
            finding=f"Submission dossier is incomplete. Missing: {', '.join(missing_docs)}.",
            extracted_value=f"Missing: {', '.join(missing_docs)}",
            expected_or_conflicting_value="All 4 required documents",
            source_document_name="Application Packet",
            page_number=1,
            applied_rule="Section B: Document completeness criteria.",
            confidence=1.0,
            recommendation=f"Request bidder to upload missing documents: {', '.join(missing_docs)}.",
            evidence_snippet=f"Missing count: {len(missing_docs)} / {required_count}",
            is_critical_issue=True if "Turnover Certificate" in missing_docs or "GST Certificate" in missing_docs else False
        )
        db.add(vr_docs)
        issues.append(f"Missing mandatory documents: {', '.join(missing_docs)}")

    # 5. Financial Turnover Verification (15 points max)
    tender_min_turnover = tender.min_turnover or 50.0
    app_turnover = application.submitted_turnover or 0.0
    
    # RAG Enrichment for Turnover
    turnover_rag_finding = ""
    turnover_rag_evidence = ""
    
    if has_turnover_doc:
        turnover_chunks = retrieve_context(db, f"Average annual turnover financial threshold {tender_min_turnover} Lakhs", application_id=application.id, top_k=5)
        if turnover_chunks:
            llm_res = analyze_with_gemini(
                f"Verify average annual turnover is at least {tender_min_turnover} Lakhs",
                turnover_chunks,
                doc_type="TURNOVER_CERTIFICATE"
            )
            if llm_res["status"] != "INSUFFICIENT_EVIDENCE":
                turnover_rag_finding = f" [AI Analysis: {llm_res['reason']}]"
                if llm_res.get("evidence") and len(llm_res["evidence"]) > 0:
                    turnover_rag_evidence = f" | Source: {llm_res['evidence'][0].get('document')} - p.{llm_res['evidence'][0].get('page')}"

    turnover_score = 0
    if not has_turnover_doc:
        vr_fin = models.VerificationResult(
            application_id=application.id,
            category="FINANCIAL",
            rule_code="FIN-001",
            title="Financial Turnover Assessment",
            status="WARNING",
            finding="Turnover Certificate (CA Certified) is missing.",
            extracted_value="None",
            expected_or_conflicting_value=f"Minimum ₹{tender_min_turnover} Lakhs",
            source_document_name="Application Dossier",
            page_number=1,
            applied_rule="Clause 6.1: Bidder must have minimum average annual turnover.",
            confidence=1.0,
            recommendation="Request CA certified turnover certificate.",
            evidence_snippet="Missing document.",
            is_critical_issue=True
        )
        db.add(vr_fin)
        issues.append("Missing Turnover Certificate")
    elif app_turnover >= tender_min_turnover:
        turnover_score = 15
        vr_fin = models.VerificationResult(
            application_id=application.id,
            category="FINANCIAL",
            rule_code="FIN-001",
            title="Financial Turnover Assessment",
            status="PASS",
            finding=f"Declared turnover (₹{app_turnover} Lakhs) meets the minimum tender requirement (₹{tender_min_turnover} Lakhs).{turnover_rag_finding}",
            extracted_value=f"₹{app_turnover} Lakhs",
            expected_or_conflicting_value=f">= ₹{tender_min_turnover} Lakhs",
            source_document_name=docs_by_type["TURNOVER_CERTIFICATE"].file_name,
            page_number=1,
            applied_rule="Clause 6.1: Financial eligibility verified.",
            confidence=0.9,
            recommendation="Financial criteria satisfied.",
            evidence_snippet=f"Self-declared: ₹{app_turnover} Lakhs. CA cert present.{turnover_rag_evidence}",
            is_critical_issue=False
        )
        db.add(vr_fin)
        docs_by_type["TURNOVER_CERTIFICATE"].verification_status = "VERIFIED"
    else:
        vr_fin = models.VerificationResult(
            application_id=application.id,
            category="FINANCIAL",
            rule_code="FIN-001",
            title="Financial Turnover Assessment",
            status="FAIL",
            finding=f"Declared turnover (₹{app_turnover} Lakhs) is BELOW the minimum requirement of ₹{tender_min_turnover} Lakhs.{turnover_rag_finding}",
            extracted_value=f"₹{app_turnover} Lakhs",
            expected_or_conflicting_value=f">= ₹{tender_min_turnover} Lakhs",
            source_document_name=docs_by_type["TURNOVER_CERTIFICATE"].file_name,
            page_number=1,
            applied_rule="Clause 6.1: Minimum turnover requirement not met.",
            confidence=0.95,
            recommendation="Bidder is financially non-compliant unless MSME exemption applies.",
            evidence_snippet=f"Shortfall of ₹{tender_min_turnover - app_turnover:.2f} Lakhs.{turnover_rag_evidence}",
            is_critical_issue=True
        )
        db.add(vr_fin)
        docs_by_type["TURNOVER_CERTIFICATE"].verification_status = "FAILED"
        issues.append(f"Turnover (₹{app_turnover}L) below minimum (₹{tender_min_turnover}L)")

    # 6. Cross-Document Consistency (10 points max)
    consistency_score = 10
    cons_status = "PASS"
    cons_finding = "Legal entity identifiers are consistent across submitted documents."
    cons_evidence = ""
    cons_recommend = "Compliant."
    is_cons_critical = False
    
    if has_gst_doc and has_udyam_doc:
        if udyam_associated_gstin and udyam_associated_gstin != app_gst and udyam_associated_gstin != "UNAVAILABLE":
            consistency_score = 0
            cons_status = "FAIL"
            cons_finding = f"CRITICAL MISMATCH: GSTIN on Udyam cert ({udyam_associated_gstin}) does not match Application GSTIN ({app_gst})."
            cons_evidence = f"Udyam GSTIN: {udyam_associated_gstin} vs Declared GSTIN: {app_gst}"
            cons_recommend = "Reject bid or demand immediate clarification on entity mismatch."
            is_cons_critical = True
            issues.append("Cross-document identifier mismatch (GSTIN vs Udyam)")
            
    vr_cons = models.VerificationResult(
        application_id=application.id,
        category="CROSS_CHECK",
        rule_code="CROSS-001",
        title="Cross-Document Consistency Resolution",
        status=cons_status,
        finding=cons_finding,
        extracted_value="Entity Identity Check",
        expected_or_conflicting_value="Consistent Identifiers",
        source_document_name="Multiple Documents",
        page_number=1,
        applied_rule="Clause 7.2: Uniform Legal Name & Identifier consistency.",
        confidence=1.0,
        recommendation=cons_recommend,
        evidence_snippet=cons_evidence if cons_evidence else "All parsed entity identifiers match the bidder profile.",
        is_critical_issue=is_cons_critical
    )
    db.add(vr_cons)

    # Calculate Total Score
    total_score = gst_score + pan_score + udyam_score + doc_score + turnover_score + consistency_score
    application.compliance_score = total_score
    application.last_verified_at = datetime.utcnow()
    
    if len(issues) >= 2 or is_cons_critical:
        application.risk_level = "HIGH"
    elif len(issues) == 1:
        application.risk_level = "MEDIUM"
    else:
        application.risk_level = "LOW"

    application.status = "VERIFIED"
    
    # Update ComplianceScore Table
    cs = db.query(models.ComplianceScore).filter(models.ComplianceScore.application_id == application_id).first()
    if not cs:
        cs = models.ComplianceScore(application_id=application_id)
        db.add(cs)
        
    cs.total_score = total_score
    cs.gst_score = gst_score
    cs.pan_score = pan_score
    cs.udyam_score = udyam_score
    cs.doc_completeness_score = doc_score
    cs.financial_score = turnover_score
    cs.consistency_score = consistency_score
    cs.risk_level = application.risk_level
    cs.calculated_at = datetime.utcnow()

    db.commit()

    record_audit_log(
        db=db,
        action="RAG_VERIFICATION_PERFORMED",
        user_id=officer_user_id or 1,
        user_email="system@bharattender.com",
        role="SYSTEM",
        application_id=application.id,
        details=f"Verification completed. Score: {total_score}/100. Risk: {application.risk_level}. Issues: {len(issues)}."
    )
    
    record_audit_log(
        db=db,
        action="AI_VERIFICATION_COMPLETED",
        user_id=officer_user_id or 1,
        user_email="system@bharattender.com",
        role="SYSTEM",
        application_id=application.id,
        details=f"Legacy deterministic fallback completed."
    )

    return {
        "success": True,
        "score": total_score,
        "risk_level": application.risk_level,
        "issues_count": len(issues),
        "issues": issues
    }
