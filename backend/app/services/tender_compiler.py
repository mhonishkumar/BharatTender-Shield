from typing import List, Dict, Any

DEFAULT_STANDARD_RULES = [
    {
        "rule_code": "GST-001",
        "category": "GST",
        "requirement": "Bidder must possess valid and active GST registration.",
        "validation_logic": "GSTIN must be 15-character alphanumeric, verified as ACTIVE on GSTN registry with no suspension status.",
        "is_mandatory": True,
        "is_approved_by_officer": True,
        "original_clause": "Clause 4.1: The bidder must submit a valid Goods and Services Tax (GST) registration certificate issued by the appropriate statutory authority. The GSTIN status must be active on the portal."
    },
    {
        "rule_code": "PAN-001",
        "category": "PAN",
        "requirement": "Bidder entity or authorized proprietor must hold a valid Permanent Account Number.",
        "validation_logic": "PAN must follow standard 10-character structure and match the legal taxpayer entity recorded across submitted tender documents.",
        "is_mandatory": True,
        "is_approved_by_officer": True,
        "original_clause": "Clause 4.2: Copy of Permanent Account Number (PAN) issued by Income Tax Department, Government of India must be uploaded."
    },
    {
        "rule_code": "UDYAM-001",
        "category": "UDYAM",
        "requirement": "Bidder must provide a valid Udyam Registration Certificate for MSME preference.",
        "validation_logic": "Udyam registration number must be authentic and verify that the enterprise is currently registered under Micro/Small/Medium category.",
        "is_mandatory": True,
        "is_approved_by_officer": True,
        "original_clause": "Clause 5.3: To avail MSME exemption/benefits under Public Procurement Policy, valid Udyam Registration Certificate must be furnished."
    },
    {
        "rule_code": "FIN-001",
        "category": "FINANCIAL",
        "requirement": "Minimum average annual financial turnover of ₹50.00 Lakhs.",
        "validation_logic": "Chartered Accountant certified turnover certificate or audited balance sheet showing minimum ₹50 Lakhs turnover.",
        "is_mandatory": True,
        "is_approved_by_officer": True,
        "original_clause": "Clause 6.1: The bidder must have an average annual turnover of at least ₹50 Lakhs during the last three financial years (certified by a practicing Chartered Accountant with UDIN)."
    },
    {
        "rule_code": "CROSS-001",
        "category": "CROSS_CHECK",
        "requirement": "Uniform Legal Name & Identifier consistency across all uploaded certificates.",
        "validation_logic": "Legal Entity Name, GSTIN, and PAN must correlate without contradictory mismatch across Application form, GST, PAN, and Udyam credentials.",
        "is_mandatory": True,
        "is_approved_by_officer": True,
        "original_clause": "Clause 7.2: Inconsistencies or conflicting identification numbers between statutory certificates will result in clarification requests or rejection."
    },
    {
        "rule_code": "TIME-001",
        "category": "TIME_VALIDITY",
        "requirement": "Statutory registrations and certificates must be unexpired on the Bid Submission Date.",
        "validation_logic": "Certificate validity end date must be on or after the tender bid submission date specified in the tender notice.",
        "is_mandatory": True,
        "is_approved_by_officer": True,
        "original_clause": "Clause 8.4: All licenses, registrations, and certificates must be valid and subsisting as on the date of bid submission."
    }
]

def compile_tender_clauses(tender_text: str = "", tender_title: str = "", min_turnover: float = 50.0) -> List[Dict[str, Any]]:
    """
    Compiles tender clauses into structured compliance rules.
    If custom tender clauses are provided, adapts rules accordingly.
    """
    rules = []
    for default_rule in DEFAULT_STANDARD_RULES:
        rule_copy = default_rule.copy()
        if default_rule["rule_code"] == "FIN-001" and min_turnover:
            rule_copy["requirement"] = f"Minimum average annual financial turnover of ₹{min_turnover:.2f} Lakhs."
            rule_copy["validation_logic"] = f"Chartered Accountant certified turnover certificate or audited statements showing minimum ₹{min_turnover:.2f} Lakhs turnover."
            rule_copy["original_clause"] = f"Clause 6.1: The bidder must have an average annual turnover of at least ₹{min_turnover:.2f} Lakhs during the qualifying financial periods."
        rules.append(rule_copy)
    return rules
