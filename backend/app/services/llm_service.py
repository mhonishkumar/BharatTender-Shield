"""
llm_service.py
--------------
Structured LLM service for BharatTender Shield.

Uses Gemini Flash to analyze retrieved evidence and produce structured compliance output.

CRITICAL RULES:
  - LLM does NOT make final PASS/FAIL decisions — deterministic Python rules do.
  - LLM enriches evidence, extracts values, and explains findings.
  - If evidence is insufficient, returns INSUFFICIENT_EVIDENCE (no hallucination).
  - All output is validated against a strict schema.
  - Never invents GSTIN, PAN, Udyam numbers, turnover figures, or dates.

Output schema:
  {
    "requirement": str,
    "extracted_value": str | null,
    "status": "PASS" | "FAIL" | "REVIEW" | "INSUFFICIENT_EVIDENCE",
    "confidence": float (0.0-1.0),
    "evidence": [{"document": str, "page": int, "text": str}],
    "reason": str,
    "ai_mode": str
  }
"""
import json
import logging
from typing import Dict, Any, List, Optional

from app.config import settings

logger = logging.getLogger("uvicorn.error")

ALLOWED_STATUSES = {"PASS", "FAIL", "REVIEW", "INSUFFICIENT_EVIDENCE"}


def analyze_with_gemini(
    requirement: str,
    evidence_chunks: List[Dict[str, Any]],
    doc_type: str = "",
    tender_context: str = "",
) -> Dict[str, Any]:
    """
    Analyze retrieved evidence chunks against a compliance requirement.
    
    Args:
        requirement: The compliance requirement text (e.g., "Bidder must have active GSTIN")
        evidence_chunks: List of RAG-retrieved chunks [{chunk_text, page_number, source_filename, ...}]
        doc_type: Document type being analyzed (for context)
        tender_context: Additional tender-level context (optional)
    
    Returns:
        Structured compliance analysis dict (schema above).
    
    IMPORTANT: This function ONLY extracts and explains.
    The caller (verifier.py) makes the actual compliance decision.
    """
    if not evidence_chunks:
        return _insufficient_evidence_response(requirement)

    # Build evidence context string from retrieved chunks
    evidence_text = _format_evidence_for_prompt(evidence_chunks)

    if settings.GEMINI_API_KEY:
        try:
            result = _call_gemini(requirement, evidence_text, doc_type, tender_context)
            result["ai_mode"] = "GEMINI FLASH AI + RAG"
            return result
        except Exception as e:
            logger.warning(f"[LLMService] Gemini analysis failed, using deterministic fallback: {e}")

    # Fallback: deterministic analysis from evidence text
    return _deterministic_analysis(requirement, evidence_chunks)


def _format_evidence_for_prompt(evidence_chunks: List[Dict[str, Any]]) -> str:
    """Format retrieved chunks into a numbered evidence list for the prompt."""
    lines = []
    for i, chunk in enumerate(evidence_chunks, 1):
        doc = chunk.get("source_filename", "Unknown Document")
        page = chunk.get("page_number", 1)
        text = chunk.get("chunk_text", "").strip()[:800]  # limit per chunk
        lines.append(f"[Evidence {i}] Document: {doc} | Page: {page}\n{text}")
    return "\n\n".join(lines)


def _call_gemini(
    requirement: str,
    evidence_text: str,
    doc_type: str,
    tender_context: str,
) -> Dict[str, Any]:
    """Call Gemini Flash with structured output prompt."""
    import google.generativeai as genai
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""You are an expert compliance verification engine for Indian public procurement (GeM / BharatTender Shield).

TASK: Analyze the provided evidence documents and determine whether the compliance requirement is satisfied.

COMPLIANCE REQUIREMENT:
{requirement}

DOCUMENT TYPE: {doc_type or "Not specified"}
{f"TENDER CONTEXT: {tender_context}" if tender_context else ""}

RETRIEVED EVIDENCE FROM DOCUMENTS:
{evidence_text}

INSTRUCTIONS:
1. Only use information from the provided evidence. DO NOT invent or hallucinate any values.
2. If the evidence does not contain enough information to verify the requirement, set status to "INSUFFICIENT_EVIDENCE".
3. Extract the actual value found in documents (e.g., GSTIN, turnover figure, expiry date).
4. Your status field MUST be one of: PASS, FAIL, REVIEW, INSUFFICIENT_EVIDENCE.
   - PASS: Evidence clearly satisfies the requirement
   - FAIL: Evidence clearly fails the requirement  
   - REVIEW: Evidence is ambiguous and needs officer review
   - INSUFFICIENT_EVIDENCE: Not enough evidence to determine compliance
5. Never claim "Government portal verified" — you only see document evidence.
6. Confidence must be between 0.0 and 1.0.

Respond with ONLY valid JSON in this exact format (no markdown, no explanation):
{{
  "requirement": "{requirement[:200]}",
  "extracted_value": "<the value found in evidence, or null if not found>",
  "status": "<PASS|FAIL|REVIEW|INSUFFICIENT_EVIDENCE>",
  "confidence": <float 0.0-1.0>,
  "evidence": [
    {{
      "document": "<filename>",
      "page": <page number>,
      "text": "<relevant text snippet from evidence>"
    }}
  ],
  "reason": "<clear explanation referencing specific evidence>"
}}"""

    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Clean markdown fences (reuse pattern from existing ai_extractor.py)
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]

    parsed = json.loads(raw.strip())
    return _validate_llm_response(parsed, requirement, evidence_chunks)


def _validate_llm_response(
    parsed: Dict[str, Any],
    requirement: str,
    evidence_chunks: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Validate and sanitize LLM response.
    Ensures status is in allowed set and evidence references are valid.
    """
    # Validate status
    status = str(parsed.get("status", "REVIEW")).upper()
    if status not in ALLOWED_STATUSES:
        logger.warning(f"[LLMService] Invalid status '{status}' from LLM, defaulting to REVIEW")
        status = "REVIEW"

    # Validate confidence
    try:
        confidence = float(parsed.get("confidence", 0.7))
        confidence = max(0.0, min(1.0, confidence))
    except (TypeError, ValueError):
        confidence = 0.7

    # Validate evidence array
    evidence = []
    for ev in parsed.get("evidence", []):
        if isinstance(ev, dict):
            evidence.append({
                "document": str(ev.get("document", "Unknown Document"))[:255],
                "page": int(ev.get("page", 1)),
                "text": str(ev.get("text", ""))[:500],
            })

    # If LLM returned no evidence items, populate from retrieved chunks
    if not evidence and evidence_chunks:
        for chunk in evidence_chunks[:3]:
            evidence.append({
                "document": chunk.get("source_filename", "Unknown Document"),
                "page": chunk.get("page_number", 1),
                "text": chunk.get("chunk_text", "")[:300],
            })

    return {
        "requirement": requirement,
        "extracted_value": parsed.get("extracted_value"),
        "status": status,
        "confidence": confidence,
        "evidence": evidence,
        "reason": str(parsed.get("reason", "Analysis complete."))[:1000],
    }


def _deterministic_analysis(
    requirement: str,
    evidence_chunks: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Fallback: Build a basic analysis from evidence chunks without LLM.
    Returns REVIEW status with evidence citations.
    """
    evidence = []
    combined_text = ""
    for chunk in evidence_chunks[:5]:
        evidence.append({
            "document": chunk.get("source_filename", "Unknown Document"),
            "page": chunk.get("page_number", 1),
            "text": chunk.get("chunk_text", "")[:300],
        })
        combined_text += " " + chunk.get("chunk_text", "")

    return {
        "requirement": requirement,
        "extracted_value": None,
        "status": "REVIEW",
        "confidence": 0.75,
        "evidence": evidence,
        "reason": f"Evidence retrieved from {len(evidence_chunks)} document chunk(s). Manual officer review recommended. AI extraction unavailable (offline mode).",
        "ai_mode": "DETERMINISTIC FALLBACK (No API Key)"
    }


def _insufficient_evidence_response(requirement: str) -> Dict[str, Any]:
    """Return a standardized INSUFFICIENT_EVIDENCE response."""
    return {
        "requirement": requirement,
        "extracted_value": None,
        "status": "INSUFFICIENT_EVIDENCE",
        "confidence": 0.0,
        "evidence": [],
        "reason": "No relevant document chunks were found for this requirement. The officer should verify manually or request the bidder to upload the required document.",
        "ai_mode": "INSUFFICIENT_EVIDENCE"
    }


def answer_officer_question(
    question: str,
    evidence_chunks: List[Dict[str, Any]],
    application_ref: str = "",
    tender_ref: str = "",
) -> Dict[str, Any]:
    """
    Answer an officer's natural language question using retrieved evidence.
    Used for the RAG chat assistant.
    
    Returns:
        {answer: str, sources: [{document, page, text}], confidence: float}
    """
    if not evidence_chunks:
        return {
            "answer": "I could not find relevant documents to answer this question. Please ensure documents have been uploaded and processed for this application.",
            "sources": [],
            "confidence": 0.0,
        }

    evidence_text = _format_evidence_for_prompt(evidence_chunks)

    if settings.GEMINI_API_KEY:
        try:
            return _gemini_officer_answer(question, evidence_text, application_ref, tender_ref, evidence_chunks)
        except Exception as e:
            logger.warning(f"[LLMService] Officer Q&A Gemini call failed: {e}")

    # Fallback: return evidence snippets
    sources = [
        {
            "document": c.get("source_filename", "Unknown"),
            "page": c.get("page_number", 1),
            "text": c.get("chunk_text", "")[:300],
        }
        for c in evidence_chunks[:5]
    ]
    return {
        "answer": f"Found {len(evidence_chunks)} relevant evidence chunks. Please review the sources below. (AI answer generation is offline — check GEMINI_API_KEY.)",
        "sources": sources,
        "confidence": 0.5,
    }


def _gemini_officer_answer(
    question: str,
    evidence_text: str,
    application_ref: str,
    tender_ref: str,
    evidence_chunks: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Generate a sourced answer using Gemini."""
    import google.generativeai as genai
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    context_header = ""
    if application_ref:
        context_header += f"Application: {application_ref}\n"
    if tender_ref:
        context_header += f"Tender: {tender_ref}\n"

    prompt = f"""You are a procurement compliance assistant for BharatTender Shield (India's GeM procurement platform).

{context_header}

OFFICER'S QUESTION:
{question}

RETRIEVED EVIDENCE FROM SUBMITTED DOCUMENTS:
{evidence_text}

INSTRUCTIONS:
1. Answer ONLY based on the evidence provided. Do not invent facts.
2. If the evidence does not contain the answer, say so clearly.
3. Reference specific documents and pages in your answer.
4. Be concise and factual. This is a compliance context.
5. Never claim government portal verification unless the evidence explicitly shows it.

Respond in ONLY valid JSON:
{{
  "answer": "<your factual answer referencing document evidence>",
  "confidence": <float 0.0-1.0>
}}"""

    response = model.generate_content(prompt)
    raw = response.text.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]

    parsed = json.loads(raw.strip())

    sources = [
        {
            "document": c.get("source_filename", "Unknown"),
            "page": c.get("page_number", 1),
            "text": c.get("chunk_text", "")[:300],
        }
        for c in evidence_chunks[:5]
    ]

    return {
        "answer": str(parsed.get("answer", "Unable to generate answer.")),
        "sources": sources,
        "confidence": max(0.0, min(1.0, float(parsed.get("confidence", 0.7)))),
    }


def generate_clarification_text(
    issue: str,
    finding: str,
    evidence_snippet: str,
    company_name: str = "",
    doc_type: str = "",
) -> str:
    """
    Generate a specific, evidence-referenced clarification request message.
    
    Used by officers when requesting clarification from bidders.
    The message references the actual discrepancy found.
    """
    if settings.GEMINI_API_KEY:
        try:
            return _gemini_clarification(issue, finding, evidence_snippet, company_name, doc_type)
        except Exception as e:
            logger.warning(f"[LLMService] Clarification generation failed: {e}")

    # Template fallback
    return (
        f"During the compliance verification of your bid application"
        f"{f' for {company_name}' if company_name else ''}, "
        f"the following issue was identified:\n\n"
        f"Issue: {issue}\n\n"
        f"Finding: {finding}\n\n"
        f"Please provide the corrected document or clarification addressing the above discrepancy "
        f"within the specified deadline."
    )


def _gemini_clarification(
    issue: str,
    finding: str,
    evidence_snippet: str,
    company_name: str,
    doc_type: str,
) -> str:
    """Generate professional clarification text using Gemini."""
    import google.generativeai as genai
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""You are a procurement officer writing a formal clarification request to a bidder under India's GeM procurement system.

Issue identified: {issue}
Technical finding: {finding}
Evidence: {evidence_snippet[:500]}
Bidder company: {company_name or "the bidder"}
Document type: {doc_type or "submitted document"}

Write a clear, professional, formal clarification request message (2-3 sentences) that:
1. Specifically references the discrepancy found
2. Asks the bidder to provide the correct document or explanation
3. Maintains a formal government communication tone
4. Does NOT invent new issues beyond what is described above

Return ONLY the clarification message text — no JSON, no markdown formatting."""

    response = model.generate_content(prompt)
    return response.text.strip()[:1500]
