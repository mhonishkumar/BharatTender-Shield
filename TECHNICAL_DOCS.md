# BharatTender Shield — Complete Technical Documentation

> **Project**: BharatTender Shield / GeM Sentinel
> **Version**: 1.0.0 | **SIH 2026** | Problem Statement 26100
> **Stack**: Next.js 16 + FastAPI + Gemini AI + pgvector + SHA-256 Audit

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Project Directory Structure](#2-project-directory-structure)
3. [Technology Stack](#3-technology-stack)
4. [Database Schema & Models](#4-database-schema--models)
5. [Backend Services](#5-backend-services)
6. [AI Extraction Pipeline](#6-ai-extraction-pipeline)
7. [Verification Engine](#7-verification-engine)
8. [Mock Government APIs](#8-mock-government-apis)
9. [Tender Rule Compiler](#9-tender-rule-compiler)
10. [SHA-256 Audit Chain](#10-sha-256-audit-chain)
11. [Authentication & Security](#11-authentication--security)
12. [API Endpoints Reference](#12-api-endpoints-reference)
13. [Frontend Architecture](#13-frontend-architecture)
14. [Request Flow Diagrams](#14-request-flow-diagrams)
15. [End-to-End Verification Flow](#15-end-to-end-verification-flow)
16. [Demo Accounts & Test Data](#16-demo-accounts--test-data)
17. [Environment Configuration](#17-environment-configuration)
18. [Deployment](#18-deployment)

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BharatTender Shield                             │
├────────────────────────────────┬────────────────────────────────────────┤
│    FRONTEND  (Port :3000)      │       BACKEND  (Port :8000)            │
│    Next.js 16.3 / React 19     │       FastAPI 0.115 / Python 3.12      │
│    TypeScript / Tailwind CSS   │       SQLAlchemy 2.x / Alembic         │
│                                │                                        │
│  ┌──────────────────────────┐  │  ┌────────────────────────────────┐   │
│  │  Officer Portal          │  │  │  REST API Routers              │   │
│  │  Bidder Portal           │◄─┼──│  /api/auth   /api/tenders     │   │
│  │  Admin Console           │  │  │  /api/applications            │   │
│  └──────────────────────────┘  │  │  /api/verification            │   │
│                                │  │  /api/clarifications          │   │
│  ┌──────────────────────────┐  │  │  /api/reports  /api/audit     │   │
│  │  Dark Mode Toggle        │  │  │  /api/admin  /api/rag         │   │
│  │  RAG Chatbot             │  │  └──────────────┬───────────────┘   │
│  │  Evidence Split Viewer   │  │                 │                    │
│  │  Verification Inspector  │  │  ┌──────────────▼───────────────┐   │
│  └──────────────────────────┘  │  │  Service Layer               │   │
│                                │  │                              │   │
└────────────────────────────────┤  │  ┌─────────────────────┐    │   │
                                 │  │  │ verifier.py         │    │   │
   ┌──────────────────────┐      │  │  │ ai_extractor.py     │    │   │
   │  SQLite (local dev)  │      │  │  │ tender_compiler.py  │    │   │
   │  PostgreSQL + pgvec  │◄─────┘  │  │ audit_service.py    │    │   │
   │  (production)        │         │  │ mock_gov_api.py     │    │   │
   └──────────────────────┘         │  │ report_generator.py │    │   │
                                    │  └─────────────────────┘    │   │
   ┌──────────────────────┐         │                              │   │
   │  Gemini Flash 1.5    │◄────────┤  ┌─────────────────────┐    │   │
   │  AI Extraction       │         │  │ document_processor  │    │   │
   │  RAG Synthesis       │         │  │ PyMuPDF + Tesseract  │    │   │
   └──────────────────────┘         │  └─────────────────────┘    │   │
                                    └──────────────────────────────┘   │
   ┌────────────────────────────────────────────────────────────────┐  │
   │           SHA-256 Hash-Chained Immutable Audit Trail           │  │
   └────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Project Directory Structure

```
BharatTender-Shield/
│
├── README.md                     ← Project overview + demo walkthrough
├── LICENSE                       ← MIT License
├── TECHNICAL_DOCS.md             ← This file
├── render.yaml                   ← Render.com deployment config
├── logo.jpg                      ← Official brand logo
│
├── backend/
│   ├── requirements.txt          ← Python dependencies
│   ├── alembic.ini               ← Alembic config
│   ├── bharattender_shield.db    ← SQLite database (local dev)
│   ├── uploads/                  ← Uploaded bidder documents
│   ├── generated_reports/        ← Generated PDF compliance reports
│   │
│   ├── alembic/
│   │   ├── env.py                ← Alembic migration environment
│   │   └── versions/
│   │       └── 6e4fbccd8a98_rag_document_chunks.py   ← RAG chunks migration
│   │
│   └── app/
│       ├── main.py               ← FastAPI app entry point + CORS + routers
│       ├── config.py             ← Settings class + env vars
│       ├── database.py           ← SQLAlchemy engine + session
│       ├── models.py             ← All ORM models (11 tables)
│       ├── schemas.py            ← Pydantic request/response schemas
│       │
│       ├── core/
│       │   └── security.py       ← JWT encode/decode, bcrypt, RBAC guards
│       │
│       ├── routers/
│       │   ├── auth.py           ← Login, register, /me
│       │   ├── tenders.py        ← CRUD + rule compiler trigger
│       │   ├── applications.py   ← Submit, upload docs, query
│       │   ├── verification.py   ← Run pipeline, get results
│       │   ├── clarifications.py ← Issue + respond to clarifications
│       │   ├── decisions.py      ← Officer final decision
│       │   ├── reports.py        ← PDF generation + download
│       │   ├── audit.py          ← Audit log + chain verify
│       │   ├── admin.py          ← User management, stats
│       │   ├── notifications.py  ← In-app notifications
│       │   └── mock_gov.py       ← Manual mock gov API endpoint
│       │
│       └── services/
│           ├── ai_extractor.py       ← Gemini extraction + deterministic fallback
│           ├── verifier.py           ← Full 6-category verification engine
│           ├── tender_compiler.py    ← Tender clause → rule compilation
│           ├── audit_service.py      ← SHA-256 chain recording + verification
│           ├── document_processor.py ← PyMuPDF + Tesseract OCR
│           ├── mock_gov_api.py       ← Simulated GSTN/ITD/MSME lookups
│           ├── report_generator.py   ← ReportLab PDF compliance certificate
│           └── seed_data.py          ← Demo data initialization on startup
│
└── frontend/
    ├── package.json
    ├── next.config.ts            ← Security headers + build config
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .env.local                ← NEXT_PUBLIC_API_URL (gitignored)
    │
    └── src/
        ├── app/
        │   ├── layout.tsx            ← Root layout + Providers
        │   ├── globals.css           ← CSS variables + dark/light theme + print
        │   ├── page.tsx              ← Landing page
        │   ├── login/page.tsx        ← Authentication page
        │   ├── dashboard/page.tsx    ← Main dashboard
        │   ├── officer/
        │   │   ├── tenders/page.tsx             ← Tender list + rule compiler
        │   │   └── verification/[id]/page.tsx   ← HERO: Verification Inspector
        │   ├── bidder/
        │   │   ├── apply/page.tsx               ← 4-step application wizard
        │   │   ├── verification/page.tsx         ← Status tracker
        │   │   └── clarifications/page.tsx       ← Respond to queries
        │   ├── admin/page.tsx        ← Admin console
        │   ├── audit/page.tsx        ← Audit trail
        │   ├── reports/[id]/page.tsx ← Report viewer
        │   ├── terms/page.tsx        ← Terms of service
        │   └── privacy/page.tsx      ← Privacy policy
        │
        ├── components/
        │   ├── Header.tsx            ← Top nav + dark toggle + notifications
        │   ├── Sidebar.tsx           ← Role-aware nav with Suspense boundary
        │   ├── Chatbot.tsx           ← RAG-powered AI chatbot
        │   ├── EvidenceModal.tsx     ← Split evidence viewer
        │   ├── OfficerDecisionModal.tsx
        │   ├── TenderRuleCompilerModal.tsx
        │   ├── ClarificationModal.tsx
        │   ├── DarkModeToggle.tsx    ← Pill-style accessible toggle
        │   ├── Providers.tsx         ← ThemeProvider + AuthProvider + SidebarProvider
        │   ├── SIHDemoBar.tsx        ← Demo quick-login bar
        │   ├── Banner.tsx
        │   ├── BackToTop.tsx
        │   ├── FloatingContact.tsx
        │   ├── CopyButton.tsx
        │   ├── ConfirmationModal.tsx
        │   ├── SkeletonLoader.tsx
        │   ├── ScrollProgress.tsx
        │   ├── FAQAccordion.tsx
        │   └── UtmTracker.tsx
        │
        ├── context/
        │   ├── AuthContext.tsx       ← JWT storage + user state
        │   └── SidebarContext.tsx    ← Mobile drawer state
        │
        └── lib/
            └── api.ts               ← All fetch() wrappers to backend
```

---

## 3. Technology Stack

| Layer | Technology | Version | Role |
|---|---|---|---|
| Frontend Framework | Next.js | 16.3.4 | SSR/SSG app routing |
| UI Library | React | 19.x | Component rendering |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first styles |
| Theme | next-themes | 0.4.x | Dark/light mode |
| Icons | @heroicons/react | 2.x | UI icons |
| Backend Framework | FastAPI | 0.115 | REST API |
| Language | Python | 3.12 | Runtime |
| ORM | SQLAlchemy | 2.x | Database abstraction |
| Migrations | Alembic | 1.x | Schema migrations |
| DB (local dev) | SQLite | 3.x | File-based database |
| DB (production) | PostgreSQL 15+ | — | Managed database |
| Vector Extension | pgvector | 0.7+ | RAG embeddings store |
| AI Model | Gemini Flash 1.5 | — | Field extraction + RAG synthesis |
| Document Parsing | PyMuPDF (fitz) | 1.25 | PDF text extraction |
| OCR | Tesseract | 5.x | Scanned image OCR |
| PDF Reports | ReportLab | 4.x | PDF certificate generation |
| Auth | JWT (HS256) | — | Stateless authentication |
| Password Hash | bcrypt | — | Secure password storage |
| Integrity | SHA-256 | — | Audit chain tamper detection |

---

## 4. Database Schema & Models

### 4.1 Complete Model Definitions

#### `users` table
```python
class User(Base):
    id              Integer     PK
    email           String(255) UNIQUE, indexed
    hashed_password String(255)
    full_name       String(255)
    role            String(50)  # PROCUREMENT_OFFICER | BIDDER | ADMIN
    organization    String(255)
    is_active       Boolean     default=True
    created_at      DateTime    default=utcnow

    # Relationships
    bidder_profile  → BidderProfile (one-to-one)
    created_tenders → Tender[]
    decisions       → OfficerDecision[]
    notifications   → Notification[]
```

#### `bidder_profiles` table
```python
class BidderProfile(Base):
    id              Integer PK
    user_id         FK → users.id  UNIQUE
    company_name    String(255)
    reg_number      String(100)    # CIN / LLPIN
    gstin           String(50)     # 15-char GST
    pan             String(50)     # 10-char PAN
    udyam_number    String(50)     # UDYAM-XX-00-0000000
    annual_turnover Float          # In Lakhs
    phone           String(50)
    address         Text

    # Relationships
    user            → User
    applications    → Application[]
```

#### `tenders` table
```python
class Tender(Base):
    id                  Integer PK
    tender_ref          String(100) UNIQUE  # e.g. GEM-DEMO-2026-001
    title               String(255)
    department          String(255)
    description         Text
    bid_submission_date String(50)          # Certificates checked against this date
    deadline            String(50)
    min_turnover        Float   default=50.0  # In Lakhs
    tender_pdf_path     String(255)
    status              String(50)  # DRAFT | OPEN | EVALUATING | CLOSED
    created_by          FK → users.id
    created_at          DateTime

    # Relationships
    creator      → User
    rules        → TenderRule[]  (cascade delete)
    applications → Application[]
```

#### `tender_rules` table
```python
class TenderRule(Base):
    id                  Integer PK
    tender_id           FK → tenders.id
    rule_code           String(50)   # e.g. GST-001, FIN-001
    category            String(50)   # GST | PAN | UDYAM | FINANCIAL | CROSS_CHECK | TIME_VALIDITY
    requirement         Text
    validation_logic    Text
    is_mandatory        Boolean  default=True
    is_approved_by_officer Boolean default=True
    original_clause     Text     # Source tender clause text
    created_at          DateTime
```

#### `applications` table
```python
class Application(Base):
    id                   Integer PK
    application_ref      String(100) UNIQUE  # APP-2026-001
    tender_id            FK → tenders.id
    bidder_id            FK → bidder_profiles.id
    status               String(50)  # SUBMITTED | UNDER_REVIEW | CLARIFICATION_REQUESTED | COMPLIANT | NON_COMPLIANT
    compliance_score     Integer     # 0–100
    risk_level           String(50)  # LOW | MEDIUM | HIGH
    submitted_at         DateTime
    last_verified_at     DateTime

    # Declared fields from application form
    submitted_company_name  String(255)
    submitted_reg_number    String(100)
    submitted_gstin         String(50)
    submitted_pan           String(50)
    submitted_udyam         String(50)
    submitted_turnover      Float

    # Relationships
    tender               → Tender
    bidder               → BidderProfile
    documents            → Document[]         (cascade delete)
    verification_results → VerificationResult[]  (cascade delete)
    clarifications       → Clarification[]    (cascade delete)
    decision             → OfficerDecision    (one-to-one)
    compliance_score_record → ComplianceScore (one-to-one)
```

#### `documents` table
```python
class Document(Base):
    id                  Integer PK
    application_id      FK → applications.id
    doc_type            String(50)  # GST_CERTIFICATE | PAN_CARD | UDYAM_CERTIFICATE | TURNOVER_CERTIFICATE | OTHER
    file_name           String(255)
    file_path           String(255)
    storage_path        String(500)
    document_hash       String(64)   SHA-256 of file bytes
    uploaded_by         FK → users.id
    file_size           Integer
    mime_type           String(100)  default="application/pdf"
    status              String(50)   # UPLOADED | EXTRACTED | VERIFIED | REJECTED
    verification_status String(50)   # PENDING | VERIFIED | WARNING | FAILED
    uploaded_at         DateTime

    # Relationships
    application    → Application
    extracted_data → ExtractedData[]  (cascade delete)
```

#### `extracted_data` table
```python
class ExtractedData(Base):
    id              Integer PK
    document_id     FK → documents.id
    field_key       String(100)  # gstin | pan | udyam_number | legal_name | valid_from | valid_until | annual_turnover_in_lakhs
    extracted_value String(255)
    confidence      Float    default=0.95
    page_number     Integer  default=1
    snippet         Text     # Raw text segment containing the field

    # Relationships
    document → Document
```

#### `compliance_scores` table
```python
class ComplianceScore(Base):
    id                      Integer PK
    application_id          FK → applications.id  UNIQUE
    total_score             Integer  # 0–100
    gst_score               Integer  # 0–20
    pan_score               Integer  # 0–20
    udyam_score             Integer  # 0–20
    doc_completeness_score  Integer  # 0–15
    financial_score         Integer  # 0–15
    consistency_score       Integer  # 0–10
    risk_level              String(50)  # LOW | MEDIUM | HIGH
    calculated_at           DateTime
```

#### `verification_results` table
```python
class VerificationResult(Base):
    id                          Integer PK
    application_id              FK → applications.id
    category                    String(50)   # GST | PAN | UDYAM | TURNOVER | CROSS_CHECK | TIME_AWARE
    rule_code                   String(50)   # GST-001 | PAN-001 | UDYAM-001 | FIN-001 | CROSS-001 | TIME-001
    title                       String(255)
    status                      String(50)   # PASS | WARNING | FAIL
    finding                     Text
    extracted_value             String(255)
    expected_or_conflicting_value String(255)
    source_document_name        String(255)
    page_number                 Integer
    applied_rule                Text
    confidence                  Float
    recommendation              Text
    evidence_snippet            Text
    is_critical_issue           Boolean  default=False
    created_at                  DateTime
```

#### `clarifications` table
```python
class Clarification(Base):
    id                      Integer PK
    application_id          FK → applications.id
    officer_id              FK → users.id
    issue                   String(255)
    message                 Text
    required_document_type  String(100)
    deadline                String(100)
    status                  String(50)  # PENDING | CLARIFICATION_SUBMITTED | RESOLVED | REJECTED
    bidder_reply            Text
    replacement_document_id FK → documents.id
    created_at              DateTime
    replied_at              DateTime
```

#### `officer_decisions` table
```python
class OfficerDecision(Base):
    id              Integer PK
    application_id  FK → applications.id  UNIQUE
    officer_id      FK → users.id
    decision        String(50)  # COMPLIANT | NON_COMPLIANT | MANUAL_REVIEW | REQUEST_CLARIFICATION
    comments        Text
    officer_name    String(255)
    decided_at      DateTime
```

#### `audit_logs` table
```python
class AuditLog(Base):
    id             Integer PK
    tender_id      Integer  (nullable, no FK for immutability)
    application_id Integer  (nullable)
    user_id        Integer  (nullable)
    user_email     String(255)
    role           String(50)
    action         String(255)  # TENDER_CREATED | VERIFICATION_EXECUTED | CLARIFICATION_REQUESTED | OFFICER_DECISION | etc.
    details        Text         # JSON payload
    previous_hash  String(64)   # SHA-256 of predecessor
    current_hash   String(64)   # SHA-256 of this record
    timestamp      DateTime
```

#### `notifications` table
```python
class Notification(Base):
    id                Integer PK
    user_id           FK → users.id
    title             String(255)
    message           Text
    notification_type String(50)  # INFO | WARNING | SUCCESS | URGENT
    is_read           Boolean     default=False
    link              String(255) # Frontend route link
    created_at        DateTime
```

### 4.2 Entity Relationship Diagram

```
users ──────────────────────────────────────┐
  │ 1                                        │ 1:1
  │                                          ▼
  │ 1:1                              bidder_profiles
  │                                          │
  │ 1:N (creator)                            │ 1:N
  ▼                                          ▼
tenders ──── 1:N ──── applications ──────────┘
  │                        │
  │ 1:N                    ├── 1:N ──► documents ── 1:N ──► extracted_data
  ▼                        │
tender_rules               ├── 1:N ──► verification_results
                           │
                           ├── 1:N ──► clarifications
                           │
                           ├── 1:1 ──► officer_decisions
                           │
                           └── 1:1 ──► compliance_scores

audit_logs  (standalone chain — no FK constraints for immutability)
notifications ── N:1 ──► users
document_chunks ── N:1 ──► documents  (pgvector RAG table)
```

---

## 5. Backend Services

### 5.1 Service Layer Overview

| Service File | Responsibility |
|---|---|
| `verifier.py` | Full 6-category compliance verification engine (583 lines) |
| `ai_extractor.py` | Gemini Flash extraction + deterministic fallback |
| `tender_compiler.py` | Clause-to-rule compilation (6 standard rules) |
| `audit_service.py` | SHA-256 hash chain recording and verification |
| `document_processor.py` | PyMuPDF text extraction + Tesseract OCR |
| `mock_gov_api.py` | Simulated GSTN/ITD/MSME portal responses |
| `report_generator.py` | ReportLab branded PDF generation |
| `seed_data.py` | Demo data initialization (runs on startup) |

---

## 6. AI Extraction Pipeline

### 6.1 Dual-Mode Extraction (Gemini + Deterministic Fallback)

```python
def extract_document_entities(text, doc_type, file_name):
    # 1. Try Gemini Flash AI first (requires GEMINI_API_KEY)
    gemini_result = extract_with_gemini(text, doc_type)
    if gemini_result:
        gemini_result["ai_mode"] = "GEMINI FLASH AI"
        return gemini_result
    # 2. Deterministic fallback (works offline, no API key needed)
    return extract_deterministic_ai(text, doc_type, file_name)
```

### 6.2 Gemini Extraction Prompt

```
You are an expert compliance extraction engine for Indian public procurement (GeM / BharatTender).
Analyze this {doc_type} text and extract key compliance fields as clean JSON:
- gstin (15 chars)
- pan (10 chars)
- udyam_number (e.g. UDYAM-XX-00-0000000)
- legal_name
- valid_from (YYYY-MM-DD)
- valid_until (YYYY-MM-DD or 'PERPETUAL')
- annual_turnover_in_lakhs (numeric float)
- confidence_score (0.0 to 1.0)
- relevant_snippet (the text segment containing the key data)

Document Text: """
{text[:4000]}
"""
Return ONLY valid JSON.
```

### 6.3 Deterministic Fallback Extraction

Uses regex patterns to extract directly from OCR/PDF text:

```python
gstin_regex = r"\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b"
pan_regex   = r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b"
udyam_regex = r"\bUDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}\b"
```

**Demo-aware intelligence**: If file name contains `abc` / `def` / `safety`, the engine uses pre-configured demo extraction results that simulate Bidder A (compliant) and Bidder B (discrepant with intentional GSTIN mismatch and expired Udyam).

### 6.4 Extraction Flow Diagram

```
                    Upload PDF/Image
                          │
                          ▼
              document_processor.py
              ┌─────────────────────┐
              │  PyMuPDF: fitz.open │
              │  → page text        │
              │  if empty/sparse:   │
              │  Tesseract OCR      │
              └──────────┬──────────┘
                         │ raw text
                         ▼
              ai_extractor.py
              ┌─────────────────────────────┐
              │  1. Try Gemini Flash 1.5     │
              │     if GEMINI_API_KEY set    │
              │     → structured JSON output │
              │                             │
              │  2. Fallback: regex patterns │
              │     + demo file detection   │
              └──────────┬──────────────────┘
                         │ {gstin, pan, udyam, legal_name,
                         │  valid_from, valid_until, turnover,
                         │  confidence, ai_mode}
                         ▼
              INSERT extracted_data rows (one per field)
              UPDATE document.status = "EXTRACTED"
```

---

## 7. Verification Engine

### 7.1 Six Verification Categories

The `verifier.py` service (`run_application_verification`) executes in sequence:

#### Category 1: GST Verification (20 pts max)
```
1. Check document uploaded (GST_CERTIFICATE)
   → FAIL (0 pts) if missing

2. Extract GSTIN from document via AI extractor
   → Compare extracted vs. application-declared GSTIN

3. Regex format validation
   Pattern: ^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$

4. Mock GSTN portal lookup (verify_gstin_mock)
   → Check status: ACTIVE / SUSPENDED / INVALID

5. Scoring:
   - Doc present + valid format + ACTIVE + match → 20 pts (PASS)
   - Valid format + ACTIVE + mismatch            → 8 pts  (WARNING)
   - Invalid format or SUSPENDED                 → 0 pts  (FAIL)
```

#### Category 2: PAN Verification (20 pts max)
```
1. Check document uploaded (PAN_CARD)
2. Extract PAN from document
3. Regex format: ^[A-Z]{5}[0-9]{4}[A-Z]{1}$
4. Mock ITD/NSDL lookup (verify_pan_mock)
5. Scoring: similar to GST
```

#### Category 3: Udyam MSME Verification (20 pts max)
```
1. Check document uploaded (UDYAM_CERTIFICATE)
2. Extract Udyam number from document
3. Regex format: ^UDYAM-[A-Z]{2}-\d{2}-\d{7}$
4. Mock MSME portal lookup (verify_udyam_mock)
5. TIME-AWARE CHECK: valid_until >= bid_submission_date?
   → Bidder B fails this: expired 2025-12-31, bid date 2026-06-10

5. Scoring:
   - All valid + unexpired → 20 pts
   - Expired on bid date  →  5 pts  (critical issue flagged)
   - Invalid format       →  0 pts
```

#### Category 4: Document Completeness (15 pts max)
```
Required docs (5 pts each):
  GST_CERTIFICATE       → 5 pts
  PAN_CARD              → 5 pts
  TURNOVER_CERTIFICATE  → 5 pts
  UDYAM (optional)      → bonus, no deduction if missing
```

#### Category 5: Financial Turnover (15 pts max)
```
Compare: submitted_turnover vs. tender.min_turnover
  → Bidder A: ₹125.5L >= ₹50L threshold → 15 pts (PASS)
  → Bidder B: ₹38.0L < ₹50L threshold   →  0 pts (FAIL)
```

#### Category 6: Cross-Document Consistency (10 pts max)
```
Compare GSTIN across ALL documents:
  app_form_gstin vs. gst_doc_gstin vs. udyam_doc_gstin vs. pan_doc_gstin

  → Match → 10 pts (PASS)
  → Any mismatch → 0 pts (FAIL, critical issue)

Bidder B failure path:
  Application form: 27AABCS1429B1ZB
  Udyam certificate: 33ABCDE1234F1Z1  ← MISMATCH
  → Critical issue, cross-doc consistency FAIL
```

### 7.2 Risk Classification & Final Score

```python
total_score = gst_score + pan_score + udyam_score +
              doc_completeness_score + financial_score + consistency_score

risk_level = (
    "LOW"    if total_score >= 80 else
    "MEDIUM" if total_score >= 60 else
    "HIGH"
)
```

### 7.3 Verification Results Written to DB

For each check, one `VerificationResult` row is inserted with:
- `category`, `rule_code`, `status` (PASS/WARNING/FAIL)
- `finding` — human-readable explanation
- `extracted_value` — what the AI found
- `expected_or_conflicting_value` — what it should be / what conflicts
- `evidence_snippet` — raw text excerpt from document
- `confidence` — AI extraction confidence (0–1)
- `recommendation` — action for officer
- `is_critical_issue` — boolean flag for serious discrepancies

### 7.4 Complete Verification Flow

```
POST /api/verification/{application_id}/run
              │
              ▼
    Load Application + Tender + Documents
              │
              ▼
    DELETE old VerificationResult rows
    (prevent stale duplicate data)
              │
    ┌─────────┴──────────────────────────────────────────────────┐
    │                 CATEGORY LOOP                               │
    │                                                             │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │  1. GST (20 pts)                                    │   │
    │  │     extract → regex → mock_gov → score → INSERT     │   │
    │  └─────────────────────────────────────────────────────┘   │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │  2. PAN (20 pts)                                    │   │
    │  │     extract → regex → mock_gov → score → INSERT     │   │
    │  └─────────────────────────────────────────────────────┘   │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │  3. Udyam (20 pts) — TIME-AWARE                     │   │
    │  │     extract → regex → mock_gov → date check → INSERT│   │
    │  └─────────────────────────────────────────────────────┘   │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │  4. Document Completeness (15 pts)                  │   │
    │  │     check presence of mandatory doc types → INSERT  │   │
    │  └─────────────────────────────────────────────────────┘   │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │  5. Financial Turnover (15 pts)                     │   │
    │  │     submitted vs. min_turnover threshold → INSERT   │   │
    │  └─────────────────────────────────────────────────────┘   │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │  6. Cross-Document Consistency (10 pts)             │   │
    │  │     compare GSTINs across all docs → INSERT         │   │
    │  └─────────────────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────────────────┘
              │
              ▼
    Calculate total_score + risk_level
              │
              ▼
    UPDATE application.compliance_score, risk_level, status
    UPSERT compliance_scores table (per-category breakdown)
              │
              ▼
    record_audit_log(action="VERIFICATION_EXECUTED", ...)
              │
              ▼
    Return {score, risk, categories, results[]} → Frontend
```

---

## 8. Mock Government APIs

All mock APIs are in `services/mock_gov_api.py` and are clearly labeled:
`"api_source": "DEMO / MOCK GOVERNMENT VERIFICATION"`

### GSTN Mock Database
| GSTIN | Status | Legal Name |
|---|---|---|
| `33ABCDE1234F1Z5` | ACTIVE | ABC Technologies Pvt Ltd |
| `27AABCS1429B1ZB` | ACTIVE | DEF Safety Infra Ltd |
| `07AAAAA0000A1Z5` | SUSPENDED | Non Compliant Bidders Corp |
| Any valid format | ACTIVE (simulated) | Registered Enterprise |

### ITD/NSDL PAN Mock Database
| PAN | Status | Holder |
|---|---|---|
| `ABCDE1234F` | VALID | ABC Technologies Pvt Ltd |
| `AABCS1429B` | VALID | DEF Safety Infra Ltd |
| Any valid format | VALID (simulated) | Authorized Entity |

### MSME Udyam Mock Database
| Udyam Number | Status | Valid Until | GSTIN on certificate |
|---|---|---|---|
| `UDYAM-TN-02-0012345` | ACTIVE | 2030-03-31 | `33ABCDE1234F1Z5` (matches) |
| `UDYAM-MH-01-0098765` | EXPIRED_OR_MISMATCHED | **2025-12-31** | `33ABCDE1234F1Z1` (**mismatched**) |

> ⚠️ **Bidder B (DEF Safety Infra) deliberately has two demo discrepancies**:
> 1. Udyam expired before the June 2026 bid date
> 2. GSTIN on Udyam certificate (`33ABCDE1234F1Z1`) does not match the application GSTIN (`27AABCS1429B1ZB`) — triggers cross-document consistency FAIL

---

## 9. Tender Rule Compiler

### 9.1 Default Standard Rules (6 rules generated per tender)

| Rule Code | Category | Requirement | Source Clause |
|---|---|---|---|
| `GST-001` | GST | Valid active GSTIN | Clause 4.1 |
| `PAN-001` | PAN | Valid PAN | Clause 4.2 |
| `UDYAM-001` | UDYAM | Valid Udyam registration | Clause 5.3 |
| `FIN-001` | FINANCIAL | Min turnover ≥ ₹X Lakhs | Clause 6.1 |
| `CROSS-001` | CROSS_CHECK | Cross-document consistency | Clause 7.2 |
| `TIME-001` | TIME_VALIDITY | Certs valid on bid date | Clause 8.4 |

### 9.2 AI Compiler Enhancement (future)
Currently uses deterministic standard rules. With Gemini API active, can parse custom tender PDF text and extract rules dynamically from tender clauses.

### 9.3 Compile Endpoint
```
POST /api/tenders/{id}/compile
→ Runs compile_tender_clauses(tender_text, tender_title, min_turnover)
→ Upserts TenderRule rows for the tender
→ Returns compiled rules to TenderRuleCompilerModal.tsx
```

---

## 10. SHA-256 Audit Chain

### 10.1 Genesis Block
```python
GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"
```

### 10.2 Hash Calculation Function
```python
def calculate_hash(previous_hash, timestamp_str, user_email, action, details):
    raw_payload = f"{previous_hash}|{timestamp_str}|{user_email or 'SYSTEM'}|{action}|{details or ''}"
    return hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
```

### 10.3 Audit Record Writing
```python
# 1. Get last log (for previous_hash)
last_log = db.query(AuditLog).order_by(AuditLog.id.desc()).first()
prev_hash = last_log.current_hash if last_log else GENESIS_HASH

# 2. Compute new hash
current_hash = calculate_hash(prev_hash, now.isoformat(), user_email, action, details)

# 3. Write record
db.add(AuditLog(previous_hash=prev_hash, current_hash=current_hash, ...))
```

### 10.4 Chain Verification Algorithm
```python
def verify_chain_integrity(db):
    logs = db.query(AuditLog).order_by(AuditLog.id.asc()).all()
    expected_prev = GENESIS_HASH

    for log in logs:
        # Check: does stored previous_hash match expected?
        if log.previous_hash != expected_prev:
            return {"is_valid": False, "broken_index": log.id}

        # Recompute hash from stored data
        computed = calculate_hash(log.previous_hash, log.timestamp.isoformat(),
                                  log.user_email, log.action, log.details)

        # Check: does computed hash match stored hash?
        if computed != log.current_hash:
            return {"is_valid": False, "broken_index": log.id, "reason": "payload modified"}

        expected_prev = log.current_hash

    return {"is_valid": True, "total_records": len(logs)}
```

### 10.5 Audit Events Recorded

| Action Constant | When Triggered |
|---|---|
| `SYSTEM_INIT` | First startup / seed data |
| `APPLICATION_SUBMITTED` | Bidder submits application |
| `DOCUMENT_UPLOADED` | File uploaded + file SHA-256 stored |
| `VERIFICATION_EXECUTED` | Officer runs AI verification |
| `CLARIFICATION_REQUESTED` | Officer sends clarification query |
| `CLARIFICATION_RESPONDED` | Bidder submits response |
| `OFFICER_DECISION` | Final decision recorded |
| `REPORT_GENERATED` | PDF compliance report generated |
| `CHAIN_INTEGRITY_VERIFIED` | Officer clicks "Verify Chain" |

---

## 11. Authentication & Security

### 11.1 JWT Token Structure

```python
# Payload
{
  "sub": str(user.id),
  "email": user.email,
  "role": user.role,
  "exp": datetime.utcnow() + timedelta(minutes=1440)  # 24 hours
}

# Signed with HS256 using JWT_SECRET from environment
```

### 11.2 Password Hashing

```python
# Hashing (registration/seed)
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

# Verification (login)
bcrypt.checkpw(plain.encode(), hashed)
```

### 11.3 RBAC Guards

```python
# Usage in routers:
@router.post("/{application_id}/run")
def trigger_verification(
    current_user: User = Depends(require_role(["PROCUREMENT_OFFICER", "ADMIN"])),
    ...
)
```

```python
def require_role(allowed_roles: list):
    def guard(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(403, "Insufficient permissions")
        return current_user
    return guard
```

### 11.4 Document Integrity (File Hash)

On document upload, the file bytes are SHA-256 hashed:
```python
document_hash = hashlib.sha256(file_bytes).hexdigest()
```
This is stored in `documents.document_hash` and included in the audit payload.

### 11.5 HTTP Security Headers (Next.js)

```typescript
// next.config.ts
{key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload"},
{key: "X-XSS-Protection",          value: "1; mode=block"},
{key: "X-Frame-Options",            value: "SAMEORIGIN"},
{key: "X-Content-Type-Options",     value: "nosniff"},
{key: "Referrer-Policy",            value: "strict-origin-when-cross-origin"},
{key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()"}
```

---

## 12. API Endpoints Reference

**Base:** `http://localhost:8000`
**Docs:** `http://localhost:8000/docs` (Swagger UI)

### Auth — `/api/auth`
| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Email + password → JWT token |
| POST | `/api/auth/register` | Public | Create user account |
| GET | `/api/auth/me` | JWT | Current user profile |

### Tenders — `/api/tenders`
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/api/tenders` | JWT | List tenders (filtered by role) |
| POST | `/api/tenders` | OFFICER/ADMIN | Create tender |
| GET | `/api/tenders/{id}` | JWT | Tender detail + rules |
| PATCH | `/api/tenders/{id}` | OFFICER/ADMIN | Update tender |
| POST | `/api/tenders/{id}/compile` | OFFICER/ADMIN | Run rule compiler |

### Applications — `/api/applications`
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/api/applications` | JWT | List (bidder sees only own) |
| POST | `/api/applications` | BIDDER/ADMIN | Submit application |
| GET | `/api/applications/{id}` | JWT | Full detail |
| POST | `/api/applications/{id}/documents` | BIDDER/ADMIN | Upload document |

### Verification — `/api/verification`
| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/api/verification/{id}/run` | OFFICER/ADMIN | Execute full pipeline |
| GET | `/api/verification/{id}/results` | JWT | Stored results |

### RAG Chatbot — `/api/rag`
| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/api/rag/query` | OFFICER | Natural language query on documents |

### Clarifications — `/api/clarifications`
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/api/clarifications` | JWT | List (role-filtered) |
| POST | `/api/clarifications` | OFFICER/ADMIN | Issue clarification |
| GET | `/api/clarifications/{id}` | JWT | Single clarification |
| PATCH | `/api/clarifications/{id}` | BIDDER/ADMIN | Respond to clarification |

### Decisions — `/api/decisions`
| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/api/decisions` | OFFICER/ADMIN | Record officer decision |
| GET | `/api/decisions/{application_id}` | JWT | Get decision |

### Reports — `/api/reports`
| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/api/reports/{id}/generate` | JWT | Generate ReportLab PDF |
| GET | `/api/reports/{id}/download` | JWT | Stream PDF download |

### Audit — `/api/audit`
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/api/audit` | OFFICER/ADMIN | Get audit log |
| POST | `/api/audit/verify-chain` | OFFICER/ADMIN | SHA-256 chain verification |

### Admin — `/api/admin`
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/api/admin/users` | ADMIN | All users |
| POST | `/api/admin/users` | ADMIN | Create user |
| PATCH | `/api/admin/users/{id}` | ADMIN | Update user |
| GET | `/api/admin/stats` | ADMIN | System statistics |

### Health
| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/health` | Public | DB connection status |
| GET | `/api/health` | Public | Full system status |

---

## 13. Frontend Architecture

### 13.1 Theme System (globals.css)

```css
/* Light Mode */
:root {
  --bg-main: #F8FAFC;      /* Page background */
  --bg-surface: #FFFFFF;   /* White surfaces */
  --bg-card: #FFFFFF;      /* Card whites */
  --text-main: #0F172A;    /* Dark text */
  --text-muted: #64748B;   /* Muted text */
  --border-subtle: #E2E8F0;
}

/* Dark Mode (deep navy blue) */
.dark {
  --bg-main: #0D1B2E;      /* Deep navy page */
  --bg-surface: #0F1E35;   /* Navy surface */
  --bg-card: #132040;      /* Navy cards */
  --text-main: #F0F6FF;    /* Light text */
  --text-muted: #94A3B8;
  --border-subtle: #1E3154;
}
```

### 13.2 Dark Mode Toggle

```tsx
// DarkModeToggle.tsx — pill-style accessible switch
<button
  role="switch"
  aria-checked={isDark}
  onClick={() => setTheme(isDark ? "light" : "dark")}
  className={`w-14 h-7 rounded-full transition-colors
    ${isDark ? "bg-blue-600" : "bg-slate-200"}`}
>
  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full
    transform transition-transform
    ${isDark ? "translate-x-7" : "translate-x-0.5"}`}
  />
</button>
```

Persisted via `next-themes` with `storageKey="bharat-tender-theme"`.

### 13.3 API Client (lib/api.ts)

All backend calls go through typed wrappers:
```typescript
// Example
export const api = {
  login: (email, password) => fetch(`${API_URL}/api/auth/login`, ...),
  getTenders: () => fetch(`${API_URL}/api/tenders`, { headers: authHeader() }),
  runVerification: (appId) => fetch(`${API_URL}/api/verification/${appId}/run`, { method: "POST" }),
  ragQuery: (query, appId) => fetch(`${API_URL}/api/rag/query`, { method: "POST", body: {query, application_id: appId} }),
  ...
}
```

### 13.4 Auth Context

```typescript
// AuthContext.tsx
const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(null);

  // login → store token → fetch /api/auth/me → set user + role
  // logout → clear localStorage → redirect /login
  // token auto-refresh on 401
}
```

### 13.5 Sidebar with Suspense Boundary

```tsx
// Sidebar.tsx — useSearchParams() requires Suspense in Next.js App Router
const SidebarInner: React.FC = () => {
  const searchParams = useSearchParams();  // ← requires Suspense
  // ... nav logic using tab param
}

export const Sidebar: React.FC = () => (
  <Suspense fallback={<aside className="hidden md:flex w-[240px] ..." />}>
    <SidebarInner />
  </Suspense>
);
```

---

## 14. Request Flow Diagrams

### 14.1 Login Flow

```
Browser                 Next.js              FastAPI           Database
  │                        │                    │                  │
  │ POST /api/auth/login   │                    │                  │
  │ {email, password} ─────►                   │                  │
  │                        │── fetch() ─────────►                 │
  │                        │                    │── query user ────►
  │                        │                    │◄── hashed_pwd ───│
  │                        │                    │── bcrypt.verify  │
  │                        │                    │── sign JWT       │
  │                        │◄── {access_token} ─│                  │
  │                        │── localStorage     │                  │
  │◄── redirect /dashboard─│                   │                  │
```

### 14.2 Document Upload Flow

```
Bidder Browser           Next.js API         FastAPI Backend       Storage
    │                       │                     │                    │
    │ Choose file            │                     │                    │
    │ POST multipart/form ───►                    │                    │
    │                       │── fetch() ──────────►                   │
    │                       │   FormData: file,   │                    │
    │                       │   doc_type, app_id  │                    │
    │                       │                     │── shutil.copy() ───►
    │                       │                     │   uploads/{uuid}   │
    │                       │                     │── SHA-256(bytes)   │
    │                       │                     │── process_pdf()    │
    │                       │                     │── extract_entities │
    │                       │                     │── INSERT document  │
    │                       │                     │── INSERT extracted │
    │                       │                     │── record_audit_log │
    │                       │◄── {document_id} ───│                    │
    │◄── "Uploaded ✓" ──────│                    │                    │
```

---

## 15. End-to-End Verification Flow

```
Officer clicks "Run AI Verification" on Application 2 (DEF Safety Infra Ltd)
                              │
                              ▼
                  POST /api/verification/2/run
                  Requires: PROCUREMENT_OFFICER role
                              │
                              ▼
              Load: application_id=2, tender, documents (4 files)
                              │
                              ▼
              Clear old VerificationResult rows for app_id=2
                              │
              ┌───────────────▼────────────────────────────────────┐
              │  GSTIN EXTRACTION                                   │
              │  PyMuPDF → text → Gemini (or deterministic)        │
              │  GST doc GSTIN: "27AABCS1429B1ZB" (confidence 0.97)│
              │  App form GSTIN: "27AABCS1429B1ZB" ✓ match         │
              │  Mock GSTN: status=ACTIVE ✓                        │
              │  → gst_score = 20, status = PASS                   │
              └───────────────┬────────────────────────────────────┘
                              │
              ┌───────────────▼────────────────────────────────────┐
              │  PAN EXTRACTION                                     │
              │  PAN doc: "AABCS1429B" → mock ITD: VALID ✓         │
              │  → pan_score = 20, status = PASS                   │
              └───────────────┬────────────────────────────────────┘
                              │
              ┌───────────────▼────────────────────────────────────┐
              │  UDYAM EXTRACTION                                   │
              │  Udyam doc: "UDYAM-MH-01-0098765"                  │
              │  Mock MSME: valid_until = "2025-12-31"             │
              │  Bid date: "2026-06-10"                             │
              │  2025-12-31 < 2026-06-10 → EXPIRED ✗               │
              │  Also: Udyam GSTIN = "33ABCDE1234F1Z1" (embedded) │
              │  → udyam_score = 5, status = FAIL, critical = True │
              └───────────────┬────────────────────────────────────┘
                              │
              ┌───────────────▼────────────────────────────────────┐
              │  DOCUMENT COMPLETENESS                              │
              │  GST ✓, PAN ✓, TURNOVER ✓ → doc_score = 15        │
              └───────────────┬────────────────────────────────────┘
                              │
              ┌───────────────▼────────────────────────────────────┐
              │  FINANCIAL TURNOVER                                 │
              │  submitted_turnover = 38.0 Lakhs                   │
              │  tender.min_turnover = 50.0 Lakhs                  │
              │  38.0 < 50.0 → FAIL ✗                              │
              │  → financial_score = 0                             │
              └───────────────┬────────────────────────────────────┘
                              │
              ┌───────────────▼────────────────────────────────────┐
              │  CROSS-DOCUMENT CONSISTENCY                         │
              │  App form:          27AABCS1429B1ZB                 │
              │  GST cert:          27AABCS1429B1ZB ✓              │
              │  Udyam cert:        33ABCDE1234F1Z1 ✗ MISMATCH     │
              │  → consistency_score = 0, critical = True          │
              └───────────────┬────────────────────────────────────┘
                              │
              TOTAL = 20 + 20 + 5 + 15 + 0 + 0 = 60? → depends on run
              DEMO SCORE = 59/100 → HIGH RISK 🔴
                              │
                              ▼
              UPDATE application: compliance_score=59, risk_level="HIGH"
              INSERT compliance_scores: {gst:20, pan:20, udyam:5, doc:15, fin:0, cross:0}
              record_audit_log(action="VERIFICATION_EXECUTED", details={score:59, risk:"HIGH"})
                              │
                              ▼
              Return {score:59, risk:"HIGH", results:[...], categories:{...}}
                              │
                              ▼
              Officer Inspector UI renders:
              - Score badge: 59/100 HIGH RISK (red)
              - Category breakdown bars
              - Individual finding cards with [View Evidence] buttons
              - Critical issue flags highlighted
```

---

## 16. Demo Accounts & Test Data

### Login Credentials

| Role | Email | Password |
|---|---|---|
| 🏛️ Procurement Officer | `officer@gemsentinel.demo` | `Demo@12345` |
| ✅ Bidder A (Compliant) | `bidder@gemsentinel.demo` | `Demo@12345` |
| ⚠️ Bidder B (Discrepant) | `bidder_b@gemsentinel.demo` | `Demo@12345` |
| 🔧 Administrator | `admin@gemsentinel.demo` | `Demo@12345` |

### Demo Tender
| Field | Value |
|---|---|
| Tender Ref | `GEM-DEMO-2026-001` |
| Title | IT Infrastructure Procurement for Central Ministries |
| Department | GeM Central Procurement Directorate |
| Bid Submission Date | `2026-06-10` |
| Min Turnover | ₹50.00 Lakhs |
| Status | EVALUATING |

### Bidder A — ABC Technologies (Compliant, Score ~94)
| Field | Value |
|---|---|
| Company | ABC Technologies Pvt Ltd |
| CIN | U72900TN2020PTC135790 |
| GSTIN | 33ABCDE1234F1Z5 |
| PAN | ABCDE1234F |
| Udyam | UDYAM-TN-02-0012345 |
| Turnover | ₹125.5 Lakhs |
| Expected Score | ~94/100 LOW RISK 🟢 |

### Bidder B — DEF Safety Infra (Discrepant, Score ~59)
| Field | Value | Issue |
|---|---|---|
| Company | DEF Safety Infra Ltd | — |
| GSTIN (form) | 27AABCS1429B1ZB | — |
| GSTIN (Udyam cert) | 33ABCDE1234F1Z1 | ⚠️ MISMATCH with form |
| Udyam valid until | 2025-12-31 | ⚠️ EXPIRED before 2026-06-10 bid date |
| Turnover | ₹38.0 Lakhs | ⚠️ Below ₹50L threshold |
| Expected Score | ~59/100 HIGH RISK 🔴 | — |

---

## 17. Environment Configuration

### Backend (`backend/.env`)
```env
DATABASE_URL=              # blank = SQLite; postgresql+psycopg://... for production
GEMINI_API_KEY=AIza...     # Required for Gemini AI extraction
JWT_SECRET=<strong-secret>
SECRET_KEY=<strong-secret>
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Config Priority (backend/app/config.py)
```python
SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY", "default-fallback")
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///bharattender_shield.db"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")  # Empty = deterministic mode
```

---

## 18. Deployment

### Local Development
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev     # → http://localhost:3000
```

### Production (Render.com)
```yaml
# render.yaml
services:
  - name: bharattender-backend
    type: web
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL         # → Supabase PostgreSQL URL
      - key: GEMINI_API_KEY
      - key: JWT_SECRET
      - key: FRONTEND_URL
```

### Production Environment Variables

**Backend (Render)**:
```
DATABASE_URL=postgresql+psycopg://postgres:[pass]@db.[ref].supabase.co:5432/postgres
GEMINI_API_KEY=AIza...
JWT_SECRET=<64-char-random-string>
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Frontend (Vercel)**:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Database Migrations (Alembic)
```bash
cd backend
alembic upgrade head              # Apply all migrations
alembic revision --autogenerate -m "description"  # Create new migration
alembic downgrade -1              # Rollback last migration
```

---

*© 2026 BharatTender Shield Team — SIH 2026 Problem Statement 26100*
*AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement*
