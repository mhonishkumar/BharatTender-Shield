"""
tender_compiler.py
------------------
Converts tender PDF text into structured compliance rules.

Two modes:
  1. LLM Mode: Gemini Flash reads tender clauses and proposes structured rules.
               The backend validates the proposed schema before storing.
               LLM CANNOT generate executable code — only structured rule objects.
  2. Standard Mode: Returns DEFAULT_STANDARD_RULES (always available, no API needed).

The LLM only PROPOSES rules. Officers must review and approve them.
"""
import json
import logging
from typing import List, Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("uvicorn.error")

# Whitelist of allowed rule types — prevents arbitrary LLM-injected rule types
ALLOWED_RULE_TYPES = {
    "GST_REQUIRED", "PAN_REQUIRED", "UDYAM_REQUIRED",
    "TURNOVER_MINIMUM", "DOCUMENT_REQUIRED", "CERTIFICATE_VALIDITY",
    "CROSS_CONSISTENCY", "TIME_VALIDITY", "EXPERIENCE_MINIMUM",
    "CUSTOM_TEXT_RULE"
}

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
        "requirement": "Minimum average annual financial turnover of Rs.50.00 Lakhs.",
        "validation_logic": "Chartered Accountant certified turnover certificate or audited balance sheet showing minimum Rs.50 Lakhs turnover.",
        "is_mandatory": True,
        "is_approved_by_officer": True,
        "original_clause": "Clause 6.1: The bidder must have an average annual turnover of at least Rs.50 Lakhs during the last three financial years (certified by a practicing Chartered Accountant with UDIN)."
    },
    {
        "rule_code": "CROSS-001",
        "category": "CROSS_CHECK",
        "requirement": "Uniform Legal Name and Identifier consistency across all uploaded certificates.",
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


def compile_tender_clauses(
    tender_text: str = "",
    tender_title: str = "",
    min_turnover: float = 50.0,
    use_llm: bool = True,
) -> List[Dict[str, Any]]:
    """
    Compile tender text into structured compliance rules.
    Signature unchanged from original — backward compatible.
    """
    default_rules = _build_default_rules(min_turnover)

    if use_llm and tender_text and len(tender_text.strip()) > 100 and settings.GEMINI_API_KEY:
        try:
            llm_rules = extract_rules_with_gemini(tender_text, tender_title, min_turnover)
            if llm_rules:
                logger.info(f"[TenderCompiler] LLM extracted {len(llm_rules)} rules from tender text")
                return llm_rules
        except Exception as e:
            logger.warning(f"[TenderCompiler] LLM rule extraction failed, using defaults: {e}")

    return default_rules


def extract_rules_with_gemini(
    tender_text: str,
    tender_title: str = "",
    min_turnover: float = 50.0,
) -> List[Dict[str, Any]]:
    """
    Use Gemini to extract structured compliance rules from tender clause text.
    Proposed rule_types are validated against ALLOWED_RULE_TYPES whitelist.
    """
    import google.generativeai as genai
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""You are an expert in Indian public procurement compliance (GeM / GFR 2017).

Analyze this tender document text and extract ALL compliance requirements as structured JSON rules.

TENDER TITLE: {tender_title or "Not specified"}
TENDER TEXT:
\"\"\"
{tender_text[:6000]}
\"\"\"

Extract each distinct compliance requirement as a rule object. For each rule output:
{{
  "rule_type": "<one of: GST_REQUIRED, PAN_REQUIRED, UDYAM_REQUIRED, TURNOVER_MINIMUM, DOCUMENT_REQUIRED, CERTIFICATE_VALIDITY, CROSS_CONSISTENCY, TIME_VALIDITY, EXPERIENCE_MINIMUM, CUSTOM_TEXT_RULE>",
  "rule_code": "<short code like GST-001>",
  "category": "<GST|PAN|UDYAM|FINANCIAL|DOCUMENT|TIME_VALIDITY|CROSS_CHECK|CUSTOM>",
  "requirement": "<human-readable requirement>",
  "validation_logic": "<how to validate this>",
  "required_value": <numeric if applicable else null>,
  "unit": "<INR|PERCENT|YEARS|null>",
  "operator": "<>=|<=|==|EXISTS|null>",
  "is_mandatory": <true|false>,
  "source_page": <page number or null>,
  "original_clause": "<exact clause text>"
}}

Return ONLY a valid JSON array. Include standard rules (GST, PAN, Udyam, Turnover) if not explicitly mentioned — they are mandatory under GeM rules. Default turnover: {min_turnover} Lakhs INR."""

    response = model.generate_content(prompt)
    raw = response.text.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]

    proposed_rules = json.loads(raw.strip())
    if not isinstance(proposed_rules, list):
        raise ValueError("LLM did not return a JSON array")

    validated = []
    seen_codes: set = set()
    for rule in proposed_rules:
        validated_rule = _validate_llm_rule(rule, min_turnover)
        if validated_rule and validated_rule["rule_code"] not in seen_codes:
            validated.append(validated_rule)
            seen_codes.add(validated_rule["rule_code"])

    if not validated:
        return _build_default_rules(min_turnover)

    return validated


def _validate_llm_rule(rule: Dict[str, Any], min_turnover: float) -> Optional[Dict[str, Any]]:
    """Validate a single LLM-proposed rule. Returns None if invalid."""
    if not isinstance(rule, dict):
        return None

    rule_type = str(rule.get("rule_type", "")).upper()
    if rule_type not in ALLOWED_RULE_TYPES:
        return None

    rule_code = str(rule.get("rule_code", f"RULE-001"))[:50]
    category = str(rule.get("category", "CUSTOM"))[:50]
    requirement = str(rule.get("requirement", ""))[:500]
    validation_logic = str(rule.get("validation_logic", "Officer review required."))[:500]
    original_clause = str(rule.get("original_clause", ""))[:1000]

    if not requirement:
        return None

    if rule_type == "TURNOVER_MINIMUM":
        try:
            required_val = float(rule.get("required_value", min_turnover))
        except (TypeError, ValueError):
            required_val = min_turnover
        requirement = f"Minimum average annual financial turnover of Rs.{required_val:.2f} Lakhs."
        validation_logic = f"CA certified turnover certificate showing minimum Rs.{required_val:.2f} Lakhs."

    return {
        "rule_code": rule_code,
        "category": category,
        "requirement": requirement,
        "validation_logic": validation_logic,
        "is_mandatory": bool(rule.get("is_mandatory", True)),
        "is_approved_by_officer": False,  # LLM-generated rules need officer approval
        "original_clause": original_clause,
    }


def _build_default_rules(min_turnover: float) -> List[Dict[str, Any]]:
    """Build default standard rules with adjusted turnover threshold."""
    rules = []
    for default_rule in DEFAULT_STANDARD_RULES:
        rule_copy = default_rule.copy()
        if default_rule["rule_code"] == "FIN-001":
            rule_copy["requirement"] = f"Minimum average annual financial turnover of Rs.{min_turnover:.2f} Lakhs."
            rule_copy["validation_logic"] = f"Chartered Accountant certified turnover certificate or audited statements showing minimum Rs.{min_turnover:.2f} Lakhs."
            rule_copy["original_clause"] = f"Clause 6.1: The bidder must have an average annual turnover of at least Rs.{min_turnover:.2f} Lakhs during the qualifying financial periods."
        rules.append(rule_copy)
    return rules
