import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.core.security import get_current_user
from app.services.report_generator import generate_compliance_report

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/{application_id}/preview")
def get_report_preview(
    application_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return {
        "application_ref": application.application_ref,
        "tender_ref": application.tender.tender_ref if application.tender else "N/A",
        "tender_title": application.tender.title if application.tender else "N/A",
        "company_name": application.submitted_company_name,
        "gstin": application.submitted_gstin,
        "pan": application.submitted_pan,
        "udyam": application.submitted_udyam,
        "compliance_score": application.compliance_score,
        "risk_level": application.risk_level,
        "total_documents": len(application.documents),
        "total_findings": len(application.verification_results),
        "officer_decision": application.decision.decision if application.decision else "Pending Review",
        "officer_comments": application.decision.comments if application.decision else "N/A",
        "decided_by": application.decision.officer_name if application.decision else "N/A"
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
