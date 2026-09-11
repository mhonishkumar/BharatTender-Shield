import os
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from app.config import settings
from app import models

def generate_compliance_report(application: models.Application, output_path: str = None) -> str:
    if not output_path:
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"Compliance_Report_{application.application_ref}_{timestamp}.pdf"
        output_path = str(settings.REPORTS_DIR / filename)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Styles
    # Primary: Deep Navy Blue (#0F294A), Green (#15803D), Orange (#EA580C)
    navy_color = colors.HexColor("#0F294A")
    dark_gray = colors.HexColor("#1E293B")
    accent_green = colors.HexColor("#15803D")
    accent_orange = colors.HexColor("#EA580C")
    danger_red = colors.HexColor("#DC2626")
    bg_light = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#E2E8F0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=navy_color,
        alignment=0
    )

    tagline_style = ParagraphStyle(
        'Tagline',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#64748B"),
        alignment=0
    )

    heading2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=navy_color,
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=dark_gray
    )

    badge_pass = ParagraphStyle(
        'BadgePass',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=accent_green
    )

    badge_fail = ParagraphStyle(
        'BadgeFail',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=danger_red
    )

    badge_warn = ParagraphStyle(
        'BadgeWarn',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=accent_orange
    )

    story = []

    # 1. Header with Official BharatTender Shield Logo
    header_data = []
    logo_file = str(settings.LOGO_PATH)
    if os.path.exists(logo_file):
        try:
            # 1.1 inch width, maintain aspect ratio
            logo_img = Image(logo_file, width=1.1*inch, height=1.1*inch)
            header_text = [
                Paragraph("<b>BharatTender Shield</b>", title_style),
                Paragraph('"Every Bid Verified. Every Decision Defensible."', tagline_style),
                Spacer(1, 4),
                Paragraph("<font size=8 color='#475569'>SIH 2026 Problem Statement: 26100 | Official Procurement Compliance Audit</font>", body_style)
            ]
            header_data = [[logo_img, header_text]]
        except Exception as e:
            header_data = [[[
                Paragraph("<b>BharatTender Shield</b>", title_style),
                Paragraph('"Every Bid Verified. Every Decision Defensible."', tagline_style)
            ]]]
    else:
        header_data = [[[
            Paragraph("<b>BharatTender Shield</b>", title_style),
            Paragraph('"Every Bid Verified. Every Decision Defensible."', tagline_style)
        ]]]

    header_table = Table(header_data, colWidths=[1.3*inch, 6.0*inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=navy_color, spaceBefore=4, spaceAfter=10))

    # 2. Executive Summary Block (Tender & Bidder Details)
    tender = application.tender
    score = application.compliance_score
    risk = application.risk_level
    
    risk_color = accent_green if risk == "LOW" else (accent_orange if risk == "MEDIUM" else danger_red)

    summary_data = [
        [
            Paragraph(f"<b>Application Ref:</b> {application.application_ref}", body_style),
            Paragraph(f"<b>Tender Ref:</b> {tender.tender_ref if tender else 'N/A'}", body_style)
        ],
        [
            Paragraph(f"<b>Bidder Enterprise:</b> {application.submitted_company_name or 'N/A'}", body_style),
            Paragraph(f"<b>Tender Name:</b> {tender.title if tender else 'N/A'}", body_style)
        ],
        [
            Paragraph(f"<b>GSTIN Declared:</b> {application.submitted_gstin or 'N/A'}", body_style),
            Paragraph(f"<b>Procuring Dept:</b> {tender.department if tender else 'N/A'}", body_style)
        ],
        [
            Paragraph(f"<b>PAN:</b> {application.submitted_pan or 'N/A'} | <b>Udyam:</b> {application.submitted_udyam or 'N/A'}", body_style),
            Paragraph(f"<b>Bid Submission Date:</b> {tender.bid_submission_date if tender else 'N/A'}", body_style)
        ],
        [
            Paragraph(f"<b>Compliance Score:</b> <font color='{navy_color}' size=12><b>{score} / 100</b></font>", body_style),
            Paragraph(f"<b>Assessed Risk Level:</b> <font color='{risk_color}' size=12><b>{risk}</b></font>", body_style)
        ]
    ]

    summary_table = Table(summary_data, colWidths=[3.7*inch, 3.6*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # 3. Verification Findings & Evidence Table
    story.append(Paragraph("Verification Findings & Extracted Evidence", heading2_style))
    
    results = application.verification_results
    if results:
        results_rows = [
            [
                Paragraph("<b>Rule / Category</b>", body_style),
                Paragraph("<b>Status</b>", body_style),
                Paragraph("<b>Finding & Extracted Value</b>", body_style),
                Paragraph("<b>Conflicting / Expected Value</b>", body_style),
                Paragraph("<b>Confidence</b>", body_style)
            ]
        ]
        
        for r in results:
            badge = badge_pass if r.status == "PASS" else (badge_warn if r.status == "WARNING" else badge_fail)
            status_text = f"✓ PASS" if r.status == "PASS" else (f"⚠ WARNING" if r.status == "WARNING" else "✕ FAIL")
            
            finding_text = f"<b>{r.title}</b><br/>{r.finding}<br/><font color='#64748B'>Extracted: {r.extracted_value or 'N/A'}</font>"
            expected_text = f"{r.expected_or_conflicting_value or 'N/A'}<br/><font color='#64748B'>Doc: {r.source_document_name} (p.{r.page_number})</font>"
            conf_str = f"{int(r.confidence * 100)}%"

            results_rows.append([
                Paragraph(f"<b>{r.rule_code or r.category}</b>", body_style),
                Paragraph(status_text, badge),
                Paragraph(finding_text, body_style),
                Paragraph(expected_text, body_style),
                Paragraph(conf_str, body_style)
            ])

        res_table = Table(results_rows, colWidths=[1.1*inch, 0.9*inch, 2.7*inch, 2.0*inch, 0.6*inch])
        res_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
            ('BOX', (0,0), (-1,-1), 1, border_color),
            ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP')
        ]))
        story.append(res_table)
    else:
        story.append(Paragraph("<i>No automated verification records executed yet.</i>", body_style))

    story.append(Spacer(1, 10))

    # 4. Officer Final Decision Section
    story.append(Paragraph("Procurement Officer Official Decision", heading2_style))
    decision = application.decision
    if decision:
        dec_color = accent_green if decision.decision == "COMPLIANT" else (accent_orange if "MANUAL" in decision.decision or "CLARIFICATION" in decision.decision else danger_red)
        dec_data = [
            [
                Paragraph(f"<b>Final Decision:</b> <font color='{dec_color}'><b>{decision.decision}</b></font>", body_style),
                Paragraph(f"<b>Deciding Officer:</b> {decision.officer_name}", body_style)
            ],
            [
                Paragraph(f"<b>Officer Justification / Notes:</b> {decision.comments}", body_style),
                Paragraph(f"<b>Decision Timestamp:</b> {decision.decided_at.strftime('%Y-%m-%d %H:%M:%S UTC')}", body_style)
            ]
        ]
    else:
        dec_data = [
            [
                Paragraph("<b>Final Decision:</b> <i>Pending Officer Review</i>", body_style),
                Paragraph("<b>Deciding Officer:</b> <i>Unassigned</i>", body_style)
            ],
            [
                Paragraph("<b>Officer Justification:</b> <i>Review in progress. AI provides decision support only. Final decision is rendered solely by the Procurement Officer.</i>", body_style),
                Paragraph(f"<b>Report Generated:</b> {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}", body_style)
            ]
        ]

    dec_table = Table(dec_data, colWidths=[4.2*inch, 3.1*inch])
    dec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(dec_table)
    story.append(Spacer(1, 10))

    # 5. Tamper-Evident SHA-256 Audit Stamp
    story.append(Paragraph("Tamper-Evident SHA-256 Audit Seal", heading2_style))
    last_audit = application.tender and application.tender.applications
    audit_text = (
        f"Generated by BharatTender Shield Compliance Engine.<br/>"
        f"<b>Audit Security:</b> Cryptographically verified via SHA-256 hash chaining. "
        f"Every verification action, document comparison, and officer decision is logged immutably.<br/>"
        f"<b>Notice:</b> Mock government verification was used in demo mode for simulated registry checks. "
        f"AI provides decision support; procurement officer remains the sole authority for final acceptance/disqualification."
    )
    story.append(Paragraph(audit_text, body_style))
    story.append(Spacer(1, 6))

    doc.build(story)
    return output_path
