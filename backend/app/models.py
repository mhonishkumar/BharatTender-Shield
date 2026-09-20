import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False) # PROCUREMENT_OFFICER, BIDDER, ADMIN
    organization = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    bidder_profile = relationship("BidderProfile", back_populates="user", uselist=False)
    created_tenders = relationship("Tender", back_populates="creator")
    decisions = relationship("OfficerDecision", back_populates="officer")
    notifications = relationship("Notification", back_populates="user")


class BidderProfile(Base):
    __tablename__ = "bidder_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    reg_number = Column(String(100), nullable=True)
    gstin = Column(String(50), nullable=True)
    pan = Column(String(50), nullable=True)
    udyam_number = Column(String(50), nullable=True)
    annual_turnover = Column(Float, default=0.0) # In Lakhs
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)

    user = relationship("User", back_populates="bidder_profile")
    applications = relationship("Application", back_populates="bidder")


class Tender(Base):
    __tablename__ = "tenders"

    id = Column(Integer, primary_key=True, index=True)
    tender_ref = Column(String(100), unique=True, index=True, nullable=False) # e.g. GEM-DEMO-2026-001
    title = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    bid_submission_date = Column(String(50), nullable=False) # Date relative to which certs are checked
    deadline = Column(String(50), nullable=False)
    min_turnover = Column(Float, default=50.0) # In Lakhs
    tender_pdf_path = Column(String(255), nullable=True)
    status = Column(String(50), default="OPEN") # DRAFT, OPEN, EVALUATING, CLOSED
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    creator = relationship("User", back_populates="created_tenders")
    rules = relationship("TenderRule", back_populates="tender", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="tender")


class TenderRule(Base):
    __tablename__ = "tender_rules"

    id = Column(Integer, primary_key=True, index=True)
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=False)
    rule_code = Column(String(50), nullable=False) # e.g. GST-001, PAN-001, UDYAM-001
    category = Column(String(50), nullable=False) # GST, PAN, UDYAM, FINANCIAL, DOCUMENT, TIME_VALIDITY
    requirement = Column(Text, nullable=False)
    validation_logic = Column(Text, nullable=False)
    is_mandatory = Column(Boolean, default=True)
    is_approved_by_officer = Column(Boolean, default=True)
    original_clause = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tender = relationship("Tender", back_populates="rules")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    application_ref = Column(String(100), unique=True, index=True, nullable=False) # e.g. APP-2026-001
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=False)
    bidder_id = Column(Integer, ForeignKey("bidder_profiles.id"), nullable=False)
    status = Column(String(50), default="SUBMITTED") # DRAFT, SUBMITTED, UNDER_REVIEW, CLARIFICATION_REQUESTED, COMPLIANT, NON_COMPLIANT
    compliance_score = Column(Integer, default=0) # 0 to 100
    risk_level = Column(String(50), default="MEDIUM") # LOW, MEDIUM, HIGH
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_verified_at = Column(DateTime, nullable=True)
    
    # Application Form declared fields
    submitted_company_name = Column(String(255), nullable=True)
    submitted_reg_number = Column(String(100), nullable=True)
    submitted_gstin = Column(String(50), nullable=True)
    submitted_pan = Column(String(50), nullable=True)
    submitted_udyam = Column(String(50), nullable=True)
    submitted_turnover = Column(Float, default=0.0)

    tender = relationship("Tender", back_populates="applications")
    bidder = relationship("BidderProfile", back_populates="applications")
    documents = relationship("Document", back_populates="application", cascade="all, delete-orphan")
    verification_results = relationship("VerificationResult", back_populates="application", cascade="all, delete-orphan")
    clarifications = relationship("Clarification", back_populates="application", cascade="all, delete-orphan")
    decision = relationship("OfficerDecision", back_populates="application", uselist=False)
    compliance_score_record = relationship("ComplianceScore", back_populates="application", uselist=False, cascade="all, delete-orphan")



class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    doc_type = Column(String(50), nullable=False) # GST_CERTIFICATE, PAN_CARD, UDYAM_CERTIFICATE, TURNOVER_CERTIFICATE, OTHER
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    storage_path = Column(String(500), nullable=True)
    document_hash = Column(String(64), nullable=True, index=True) # SHA-256
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    file_size = Column(Integer, default=0)
    mime_type = Column(String(100), default="application/pdf")
    status = Column(String(50), default="UPLOADED") # UPLOADED, EXTRACTED, VERIFIED, REJECTED
    verification_status = Column(String(50), default="PENDING") # PENDING, VERIFIED, WARNING, FAILED
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("Application", back_populates="documents")
    extracted_data = relationship("ExtractedData", back_populates="document", cascade="all, delete-orphan")


class ExtractedData(Base):
    __tablename__ = "extracted_data"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    field_key = Column(String(100), nullable=False) # e.g. gstin, pan, legal_name, valid_from, valid_to, turnover
    extracted_value = Column(String(255), nullable=True)
    confidence = Column(Float, default=0.95)
    page_number = Column(Integer, default=1)
    snippet = Column(Text, nullable=True)

    document = relationship("Document", back_populates="extracted_data")


class ComplianceScore(Base):
    __tablename__ = "compliance_scores"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)
    total_score = Column(Integer, default=0) # 0 to 100
    gst_score = Column(Integer, default=0)
    pan_score = Column(Integer, default=0)
    udyam_score = Column(Integer, default=0)
    doc_completeness_score = Column(Integer, default=0)
    financial_score = Column(Integer, default=0)
    consistency_score = Column(Integer, default=0)
    risk_level = Column(String(50), default="MEDIUM") # LOW, MEDIUM, HIGH
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("Application", back_populates="compliance_score_record")


class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    category = Column(String(50), nullable=False) # GST, PAN, UDYAM, TURNOVER, CROSS_CHECK, TIME_AWARE
    rule_code = Column(String(50), nullable=True) # e.g. GST-001
    title = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False) # PASS, WARNING, FAIL
    finding = Column(Text, nullable=False)
    extracted_value = Column(String(255), nullable=True)
    expected_or_conflicting_value = Column(String(255), nullable=True)
    source_document_name = Column(String(255), nullable=True)
    page_number = Column(Integer, default=1)
    applied_rule = Column(Text, nullable=True)
    confidence = Column(Float, default=0.95)
    recommendation = Column(Text, nullable=True)
    evidence_snippet = Column(Text, nullable=True)
    is_critical_issue = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("Application", back_populates="verification_results")



class Clarification(Base):
    __tablename__ = "clarifications"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    issue = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    required_document_type = Column(String(100), nullable=True)
    deadline = Column(String(100), nullable=True)
    status = Column(String(50), default="PENDING") # PENDING, CLARIFICATION_SUBMITTED, RESOLVED, REJECTED
    bidder_reply = Column(Text, nullable=True)
    replacement_document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    replied_at = Column(DateTime, nullable=True)

    application = relationship("Application", back_populates="clarifications")


class OfficerDecision(Base):
    __tablename__ = "officer_decisions"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    decision = Column(String(50), nullable=False) # COMPLIANT, NON_COMPLIANT, MANUAL_REVIEW, REQUEST_CLARIFICATION
    comments = Column(Text, nullable=False)
    officer_name = Column(String(255), nullable=False)
    decided_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("Application", back_populates="decision")
    officer = relationship("User", back_populates="decisions")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    tender_id = Column(Integer, nullable=True)
    application_id = Column(Integer, nullable=True)
    user_id = Column(Integer, nullable=True)
    user_email = Column(String(255), nullable=True)
    role = Column(String(50), nullable=True)
    action = Column(String(255), nullable=False) # e.g. TENDER_CREATED, VERIFICATION_EXECUTED, CLARIFICATION_REQUESTED
    details = Column(Text, nullable=True)
    previous_hash = Column(String(64), nullable=False)
    current_hash = Column(String(64), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="INFO") # INFO, WARNING, SUCCESS, URGENT
    is_read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class TenderAssignment(Base):
    """Tracks explicit assignment of a tender to a specific bidder by an officer."""
    __tablename__ = "tender_assignments"

    id = Column(Integer, primary_key=True, index=True)
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=False)
    bidder_id = Column(Integer, ForeignKey("bidder_profiles.id"), nullable=False)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="INVITED")  # INVITED, VIEWED, APPLIED, UNDER_VERIFICATION, COMPLETED
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)

    tender = relationship("Tender")
    bidder = relationship("BidderProfile")
    officer = relationship("User", foreign_keys=[assigned_by])


class DocumentChunk(Base):
    """
    Stores text chunks and their vector embeddings for RAG retrieval.
    Each chunk preserves full provenance: document, page, application, tender, bidder.
    On PostgreSQL + pgvector: embedding stored as vector(768).
    On SQLite (local dev): embedding stored as JSON text.
    """
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True, index=True)
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidder_profiles.id"), nullable=True, index=True)

    chunk_text = Column(Text, nullable=False)
    page_number = Column(Integer, default=1)
    chunk_index = Column(Integer, default=0)
    source_filename = Column(String(255), nullable=True)
    doc_type = Column(String(50), nullable=True)  # GST_CERTIFICATE, PAN_CARD, etc.

    # Embedding stored as JSON array (SQLite compat); pgvector migration handles vector type
    embedding = Column(Text, nullable=True)  # JSON list of floats

    # Metadata JSON (doc_type, file_name, etc.)
    chunk_metadata = Column(Text, nullable=True)  # JSON string

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document")
    application = relationship("Application")
    tender = relationship("Tender")
    bidder = relationship("BidderProfile")
