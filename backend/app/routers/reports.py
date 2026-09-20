import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.core.security import get_current_user
from app.services.report_generator import generate_compliance_report

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("")
def list_all_reports(
    tender_id: Optional[int] = None,
    risk_level: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all applications with report data. Available to Officer and Admin."""
    if current_user.role not in ["ADMIN", "PROCUREMENT_OFFICER"]:
        raise HTTPException(status_code=403, detail="Access denied")

    query = db.query(models.Application)
    if tender_id:
        query = query.filter(models.Application.tender_id == tender_id)
    if risk_level:
        query = query.filter(models.Application.risk_level == risk_level)
    if status_filter:
        query = query.filter(models.Application.status == status_filter)

    apps = query.order_by(models.Application.submitted_at.desc()).all()

    result = []
    for app in apps:
        result.append({
            "application_id": app.id,
            "application_ref": app.application_ref,
            "tender_ref": app.tender.tender_ref if app.tender else "N/A",
            "tender_title": app.tender.title if app.tender else "N/A",
            "company_name": app.submitted_company_name,
            "compliance_score": app.compliance_score,
            "risk_level": app.risk_level,
            "status": app.status,
            "submitted_at": app.submitted_at,
            "officer_decision": app.decision.decision if app.decision else "Pending Review",
            "decided_by": app.decision.officer_name if app.decision else None,
        })
    return result


@router.get("/{application_id}/preview")
def get_report_preview(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    findings = []
    for vr in application.verification_results:
        findings.append({
            "id": vr.id,
            "category": vr.category,
            "rule_code": vr.rule_code,
            "title": vr.title,
            "status": vr.status,
            "finding": vr.finding,
            "extracted_value": vr.extracted_value,
            "expected_value": vr.expected_or_conflicting_value,
            "source_document": vr.source_document_name,
            "page_number": vr.page_number,
            "applied_rule": vr.applied_rule,
            "confidence": vr.confidence,
            "recommendation": vr.recommendation,
            "evidence_snippet": vr.evidence_snippet,
            "is_critical": vr.is_critical_issue,
        })

    clarifications = []
    for cl in application.clarifications:
        clarifications.append({
            "id": cl.id,
            "issue": cl.issue,
            "message": cl.message,
            "status": cl.status,
            "bidder_reply": cl.bidder_reply,
            "created_at": cl.created_at,
            "replied_at": cl.replied_at,
        })

    return {
        "application_id": application.id,
        "application_ref": application.application_ref,
        "tender_id": application.tender_id,
        "tender_ref": application.tender.tender_ref if application.tender else "N/A",
        "tender_title": application.tender.title if application.tender else "N/A",
        "tender_department": application.tender.department if application.tender else "N/A",
        "bid_submission_date": application.tender.bid_submission_date if application.tender else "N/A",
        "company_name": application.submitted_company_name,
        "gstin": application.submitted_gstin,
        "pan": application.submitted_pan,
        "udyam": application.submitted_udyam,
        "turnover": application.submitted_turnover,
        "compliance_score": application.compliance_score,
        "risk_level": application.risk_level,
        "status": application.status,
        "submitted_at": application.submitted_at,
        "total_documents": len(application.documents),
        "total_findings": len(findings),
        "findings": findings,
        "clarifications": clarifications,
        "officer_decision": application.decision.decision if application.decision else None,
        "officer_comments": application.decision.comments if application.decision else None,
        "decided_by": application.decision.officer_name if application.decision else None,
        "decided_at": application.decision.decided_at if application.decision else None,
    }


@router.get("/{application_id}/download")
def download_compliance_pdf(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    pdf_path = generate_compliance_report(application)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="Could not generate PDF report.")

    filename = os.path.basename(pdf_path)
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=filename
    )
