from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    full_name: str
    email: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[int] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str # PROCUREMENT_OFFICER, BIDDER, ADMIN
    organization: Optional[str] = None
    company_name: Optional[str] = None
    gstin: Optional[str] = None
    pan: Optional[str] = None
    udyam_number: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    organization: Optional[str] = None
    is_active: bool
    created_at: datetime
    officer_id: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    bidder_profile: Optional[Any] = None

    class Config:
        from_attributes = True

# Officer Admin Creation Schema
class OfficerCreateRequest(BaseModel):
    full_name: str
    officer_id: str
    official_email: str
    phone: str
    department: str
    designation: str
    username: str
    password: str
    status: str = "ACTIVE" # ACTIVE, INACTIVE, SUSPENDED

# Bidder Admin Creation Schema
class BidderCreateRequest(BaseModel):
    company_name: str
    authorized_person: str
    email: str
    phone: str
    gstin: str
    pan: str
    udyam_number: Optional[str] = None
    address: Optional[str] = None
    username: str
    password: str
    status: str = "ACTIVE"

class UserStatusUpdateRequest(BaseModel):
    status: str # ACTIVE, INACTIVE, SUSPENDED

class UserPasswordResetRequest(BaseModel):
    new_password: str


# Bidder Profile Schemas
class BidderProfileResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    reg_number: Optional[str] = None
    gstin: Optional[str] = None
    pan: Optional[str] = None
    udyam_number: Optional[str] = None
    annual_turnover: float
    phone: Optional[str] = None

    class Config:
        from_attributes = True

# Tender Rule Schemas
class TenderRuleBase(BaseModel):
    rule_code: str
    category: str
    requirement: str
    validation_logic: str
    is_mandatory: bool = True
    is_approved_by_officer: bool = True
    original_clause: Optional[str] = None

class TenderRuleCreate(TenderRuleBase):
    pass

class TenderRuleResponse(TenderRuleBase):
    id: int
    tender_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Tender Schemas
class TenderCreate(BaseModel):
    tender_ref: str
    title: str
    department: str
    description: Optional[str] = None
    bid_submission_date: str
    deadline: str
    min_turnover: float = 50.0

class TenderResponse(BaseModel):
    id: int
    tender_ref: str
    title: str
    department: str
    description: Optional[str] = None
    bid_submission_date: str
    deadline: str
    min_turnover: float
    status: str
    created_at: datetime
    rules: List[TenderRuleResponse] = []

    class Config:
        from_attributes = True

# Document Schemas
class DocumentResponse(BaseModel):
    id: int
    application_id: int
    doc_type: str
    file_name: str
    file_size: int
    mime_type: str
    status: str
    verification_status: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Verification Result Schemas
class VerificationResultResponse(BaseModel):
    id: int
    application_id: int
    category: str
    rule_code: Optional[str] = None
    title: str
    status: str # PASS, WARNING, FAIL
    finding: str
    extracted_value: Optional[str] = None
    expected_or_conflicting_value: Optional[str] = None
    source_document_name: Optional[str] = None
    page_number: int
    applied_rule: Optional[str] = None
    confidence: float
    recommendation: Optional[str] = None
    evidence_snippet: Optional[str] = None
    is_critical_issue: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Clarification Schemas
class ClarificationCreate(BaseModel):
    application_id: int
    issue: str
    message: str
    required_document_type: Optional[str] = None
    deadline: Optional[str] = None

class ClarificationReply(BaseModel):
    bidder_reply: str
    replacement_document_id: Optional[int] = None

class ClarificationResponse(BaseModel):
    id: int
    application_id: int
    officer_id: int
    issue: str
    message: str
    required_document_type: Optional[str] = None
    deadline: Optional[str] = None
    status: str
    bidder_reply: Optional[str] = None
    replacement_document_id: Optional[int] = None
    created_at: datetime
    replied_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Officer Decision Schemas
class OfficerDecisionCreate(BaseModel):
    application_id: int
    decision: str # COMPLIANT, NON_COMPLIANT, MANUAL_REVIEW, REQUEST_CLARIFICATION
    comments: str

class OfficerDecisionResponse(BaseModel):
    id: int
    application_id: int
    officer_id: int
    decision: str
    comments: str
    officer_name: str
    decided_at: datetime

    class Config:
        from_attributes = True

# Application Schemas
class ApplicationCreate(BaseModel):
    tender_id: int
    submitted_company_name: str
    submitted_reg_number: Optional[str] = None
    submitted_gstin: str
    submitted_pan: str
    submitted_udyam: Optional[str] = None
    submitted_turnover: float

class ApplicationResponse(BaseModel):
    id: int
    application_ref: str
    tender_id: int
    bidder_id: int
    status: str
    compliance_score: int
    risk_level: str
    submitted_at: datetime
    last_verified_at: Optional[datetime] = None
    submitted_company_name: Optional[str] = None
    submitted_reg_number: Optional[str] = None
    submitted_gstin: Optional[str] = None
    submitted_pan: Optional[str] = None
    submitted_udyam: Optional[str] = None
    submitted_turnover: float
    documents: List[DocumentResponse] = []
    verification_results: List[VerificationResultResponse] = []
    clarifications: List[ClarificationResponse] = []
    decision: Optional[OfficerDecisionResponse] = None
    tender: Optional[TenderResponse] = None

    class Config:
        from_attributes = True

# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: int
    tender_id: Optional[int] = None
    application_id: Optional[int] = None
    user_email: Optional[str] = None
    role: Optional[str] = None
    action: str
    details: Optional[str] = None
    previous_hash: str
    current_hash: str
    timestamp: datetime

    class Config:
        from_attributes = True

class AuditVerificationResult(BaseModel):
    is_valid: bool
    total_records: int
    broken_index: Optional[int] = None
    message: str

# Notification Schemas
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
