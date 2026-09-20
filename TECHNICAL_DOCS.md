# BharatTender Shield — Technical Documentation

> **Version**: 1.0.0 | **SIH 2026** | **Problem Statement 26100**

---

## Table of Contents
1. [System Architecture](#1-system-architecture)
2. [Request Flow Diagrams](#2-request-flow-diagrams)
3. [AI & RAG Pipeline](#3-ai--rag-pipeline)
4. [Verification Engine Flow](#4-verification-engine-flow)
5. [Authentication & RBAC Flow](#5-authentication--rbac-flow)
6. [Audit Chain Architecture](#6-audit-chain-architecture)
7. [Data Models & Relationships](#7-data-models--relationships)
8. [Frontend Component Tree](#8-frontend-component-tree)
9. [API Endpoints Reference](#9-api-endpoints-reference)
10. [Deployment Architecture](#10-deployment-architecture)

---

## 1. System Architecture

### High-Level System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        OFP["🏛️ Officer Portal<br/>(Next.js)"]
        BDP["🏢 Bidder Portal<br/>(Next.js)"]
        ADM["🔧 Admin Console<br/>(Next.js)"]
    end

    subgraph "API Gateway Layer"
        FA["FastAPI<br/>:8000"]
        MW["JWT Middleware<br/>+ RBAC Guard"]
    end

    subgraph "Business Logic Layer"
        VE["Verification Engine<br/>(verifier.py)"]
        TC["Tender Compiler<br/>(tender_compiler.py)"]
        RP["Report Generator<br/>(report_generator.py)"]
        AS["Audit Service<br/>(audit_service.py)"]
    end

    subgraph "AI Layer"
        GEM["Gemini Flash 1.5<br/>(AI Extraction)"]
        RAG["RAG Pipeline<br/>(pgvector)"]
        OCR["PyMuPDF + Tesseract<br/>(Document Processing)"]
    end

    subgraph "Data Layer"
        DB["SQLite / PostgreSQL<br/>(SQLAlchemy)"]
        VEC["pgvector<br/>(Embeddings)"]
        STR["File Storage<br/>(uploads/)"]
    end

    OFP --> FA
    BDP --> FA
    ADM --> FA
    FA --> MW
    MW --> VE
    MW --> TC
    MW --> RP
    MW --> AS
    VE --> GEM
    VE --> RAG
    VE --> OCR
    TC --> GEM
    RAG --> VEC
    VE --> DB
    TC --> DB
    RP --> DB
    AS --> DB
    OCR --> STR
```

---

## 2. Request Flow Diagrams

### 2.1 Standard API Request Flow

```
Browser/Client
      │
      │  HTTPS Request + Bearer JWT
      ▼
┌─────────────────────────────────────────┐
│            Next.js Frontend             │
│   api.ts wrappers → fetch() calls       │
└─────────────────┬───────────────────────┘
                  │
                  │  HTTP/REST
                  ▼
┌─────────────────────────────────────────┐
│            FastAPI Backend              │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  CORS Middleware                 │   │
│  │  (localhost:3000 + Vercel)       │   │
│  └──────────────┬───────────────────┘   │
│                 │                       │
│  ┌──────────────▼───────────────────┐   │
│  │  JWT Authentication Middleware   │   │
│  │  decode → user_id + role         │   │
│  └──────────────┬───────────────────┘   │
│                 │                       │
│  ┌──────────────▼───────────────────┐   │
│  │  Router Dispatch                 │   │
│  │  auth / tenders / applications   │   │
│  │  verification / reports / audit  │   │
│  └──────────────┬───────────────────┘   │
│                 │                       │
│  ┌──────────────▼───────────────────┐   │
│  │  Service Layer                   │   │
│  │  Business logic + DB queries     │   │
│  └──────────────┬───────────────────┘   │
└─────────────────┼───────────────────────┘
                  │
                  ▼
         SQLAlchemy ORM
                  │
                  ▼
         SQLite / PostgreSQL
```

### 2.2 Bidder Application Submission Flow

```
Bidder                 Frontend              Backend              Database
  │                       │                     │                     │
  │── Fill Wizard Step 1 ─►│                    │                     │
  │   (Company Info)       │                    │                     │
  │                        │                    │                     │
  │── Fill Wizard Step 2 ─►│                    │                     │
  │   (Upload Documents)   │                    │                     │
  │                        │                    │                     │
  │── Review & Submit ─────►│                   │                     │
  │                        │── POST /applications►│                   │
  │                        │                    │── INSERT application►│
  │                        │                    │◄── app_id ──────────│
  │                        │── POST /documents ──►│                   │
  │                        │   (multipart/form)  │── store file ───────►
  │                        │                    │── INSERT document ──►│
  │                        │                    │── SHA-256 hash      │
  │                        │◄── application_ref ─│                   │
  │◄── Application ID ─────│                    │                     │
```

### 2.3 Officer Verification Flow

```
Officer               Frontend              Backend            AI Services
  │                      │                     │                    │
  │── Click "Run AI" ────►│                   │                    │
  │                      │── POST /verify/2 ──►│                   │
  │                      │                    │── load application  │
  │                      │                    │── load documents    │
  │                      │                    │                    │
  │                      │                    │── Gemini Extract ──►│
  │                      │                    │   (for each doc)   │
  │                      │                    │◄── extracted fields─│
  │                      │                    │                    │
  │                      │   [Animated Pipeline UI]               │
  │                      │                    │                    │
  │                      │                    │── regex validation  │
  │                      │                    │── mock gov APIs     │
  │                      │                    │── cross-doc match   │
  │                      │                    │── score calculate   │
  │                      │                    │── risk classify     │
  │                      │                    │── INSERT results    │
  │                      │                    │── INSERT audit_log  │
  │                      │◄── results JSON ───│                    │
  │◄── Score + Evidence ─│                    │                    │
```

---

## 3. AI & RAG Pipeline

### 3.1 Document Ingestion & Embedding

```mermaid
flowchart TD
    A["📄 Bidder Uploads PDF/Image"] --> B["Document Storage<br/>(uploads/ directory)"]
    B --> C{"File Type?"}
    C -->|PDF| D["PyMuPDF<br/>fitz.open()"]
    C -->|Image| E["Tesseract OCR<br/>pytesseract.image_to_string()"]
    D --> F["Raw Text Extraction<br/>+ Page Numbers"]
    E --> F
    F --> G["Text Chunking<br/>(~500 token chunks<br/>with 50-token overlap)"]
    G --> H["Gemini Embedding API<br/>models/text-embedding-004<br/>→ 1536-dim vector"]
    H --> I["INSERT document_chunks<br/>(content, embedding, doc_id)"]
    I --> J["pgvector index<br/>(ivfflat / hnsw)"]
```

### 3.2 Gemini AI Field Extraction

```mermaid
flowchart TD
    A["Document Text"] --> B["Gemini Flash 1.5<br/>Structured Extraction Prompt"]
    B --> C{"Extraction Result"}
    C --> D["GSTIN: 27DEFGH5678J2Z3<br/>Confidence: 0.97"]
    C --> E["PAN: DEFGH5678J<br/>Confidence: 0.95"]
    C --> F["Company Name: DEF Safety Infra<br/>Confidence: 0.99"]
    C --> G["Valid From: 01-04-2023<br/>Confidence: 0.88"]
    C --> H["Valid Until: 31-03-2025<br/>Confidence: 0.85"]
    D --> I["INSERT extracted_data<br/>(field_key, extracted_value,<br/>confidence, source_page)"]
    E --> I
    F --> I
    G --> I
    H --> I
```

### 3.3 RAG Query Flow (Chatbot)

```
Officer Query: "What is the GSTIN mismatch in Application 2?"
      │
      ▼
┌─────────────────────────────────────────────────┐
│  1. EMBED QUERY                                 │
│     Gemini Embedding API                        │
│     query_vector = embed("GSTIN mismatch...")   │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│  2. VECTOR SIMILARITY SEARCH                    │
│     pgvector cosine distance                    │
│     SELECT content FROM document_chunks         │
│     WHERE document_id IN (app_2_docs)           │
│     ORDER BY embedding <=> query_vector         │
│     LIMIT 5                                     │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│  3. CONTEXT ASSEMBLY                            │
│     Top-5 relevant chunks concatenated          │
│     + Original query                            │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│  4. GEMINI SYNTHESIS                            │
│     Prompt: "Based on the following procurement │
│     documents, answer: {query}                  │
│     Context: {top_k_chunks}"                    │
│                                                 │
│     Response: "The GSTIN on the application     │
│     form is 27DEFGH5678J2Z3, however the GST    │
│     certificate document shows 27XYZAB9012K3Z4  │
│     — this is a critical discrepancy..."        │
└─────────────────────────────────────────────────┘
```

---

## 4. Verification Engine Flow

### 4.1 Full Verification Pipeline

```mermaid
flowchart TD
    START["POST /verify/{application_id}"] --> LOAD["Load Application<br/>+ Documents<br/>+ Tender Rules"]
    LOAD --> CLEAR["Clear Previous Results<br/>(prevent stale data)"]
    CLEAR --> GST

    subgraph GST_BLOCK["GST Verification — 20pts"]
        GST["Extract GSTIN<br/>from doc vs. form"]
        GST --> GST_FORMAT{"GSTIN Format Valid?<br/>^[0-9]{2}[A-Z]{5}...Z[0-9A-Z]$"}
        GST_FORMAT -->|Pass| GST_MOCK["Mock GSTN Lookup<br/>verify_gstin_mock()"]
        GST_FORMAT -->|Fail| GST_FAIL["Score: 0<br/>Status: FAIL"]
        GST_MOCK --> GST_MATCH{"Extracted vs.<br/>Applied GSTIN Match?"}
        GST_MATCH -->|Match| GST_PASS["Score: 20<br/>Status: PASS"]
        GST_MATCH -->|Mismatch| GST_PARTIAL["Score: 8<br/>Status: WARN"]
    end

    subgraph PAN_BLOCK["PAN Verification — 20pts"]
        PAN["Extract PAN<br/>from doc vs. form"]
        PAN --> PAN_FORMAT{"PAN Format Valid?<br/>^[A-Z]{5}[0-9]{4}[A-Z]$"}
        PAN_FORMAT -->|Pass| PAN_MOCK["Mock ITD Lookup"]
        PAN_FORMAT -->|Fail| PAN_FAIL["Score: 0"]
        PAN_MOCK --> PAN_PASS["Score: 20"]
    end

    subgraph UDYAM_BLOCK["Udyam MSME — 20pts"]
        UDYAM["Extract Udyam Number"]
        UDYAM --> UDYAM_FORMAT{"Format Valid?<br/>^UDYAM-[A-Z]{2}-\\d{2}-\\d{7}$"}
        UDYAM_FORMAT -->|Pass| UDYAM_DATE{"Valid as of<br/>Bid Date?"}
        UDYAM_DATE -->|Valid| UDYAM_PASS["Score: 20"]
        UDYAM_DATE -->|Expired| UDYAM_EXPIRE["Score: 5<br/>Status: FAIL — Expired"]
        UDYAM_FORMAT -->|Fail| UDYAM_FAIL["Score: 0"]
    end

    subgraph DOC_BLOCK["Document Completeness — 15pts"]
        DOCS["Check required uploads"]
        DOCS --> DOC_GST{"GST Certificate?"}
        DOCS --> DOC_PAN{"PAN Card?"}
        DOCS --> DOC_TURN{"Turnover Cert?"}
    end

    subgraph TURN_BLOCK["Turnover — 15pts"]
        TURN["Declared Turnover vs.<br/>Tender Minimum"]
        TURN --> TURN_CHECK{"Meets threshold?"}
        TURN_CHECK -->|Yes| TURN_PASS["Score: 15"]
        TURN_CHECK -->|No| TURN_FAIL["Score: 0"]
    end

    subgraph CROSS_BLOCK["Cross-Doc Consistency — 10pts"]
        CROSS["Compare GSTIN in:<br/>App Form vs GST Doc<br/>vs Udyam Doc vs PAN Doc"]
        CROSS --> CROSS_MATCH{"All match?"}
        CROSS_MATCH -->|Yes| CROSS_PASS["Score: 10"]
        CROSS_MATCH -->|No| CROSS_FAIL["Score: 0<br/>Critical Issue Flag"]
    end

    GST_BLOCK --> TOTAL
    PAN_BLOCK --> TOTAL
    UDYAM_BLOCK --> TOTAL
    DOC_BLOCK --> TOTAL
    TURN_BLOCK --> TOTAL
    CROSS_BLOCK --> TOTAL

    TOTAL["Sum All Scores<br/>0 – 100 pts"] --> RISK{"Risk Classification"}
    RISK -->|80-100| LOW["🟢 LOW RISK"]
    RISK -->|60-79| MEDIUM["🟡 MEDIUM RISK"]
    RISK -->|0-59| HIGH["🔴 HIGH RISK"]

    LOW --> AUDIT
    MEDIUM --> AUDIT
    HIGH --> AUDIT

    AUDIT["Record Audit Log<br/>SHA-256 hash chain"] --> RESULT["Return Results<br/>to Frontend"]
```

---

## 5. Authentication & RBAC Flow

### 5.1 Login Flow

```
User (Browser)          Next.js              FastAPI            Database
     │                     │                    │                   │
     │── POST /api/login ──►│                  │                   │
     │   {email, password}  │                  │                   │
     │                     │── POST /api/auth/login ►│            │
     │                     │                    │── query user ────►│
     │                     │                    │◄── hashed_pwd ───│
     │                     │                    │── bcrypt.verify() │
     │                     │                    │── create JWT      │
     │                     │                    │   payload: {      │
     │                     │                    │     sub: user_id  │
     │                     │                    │     role: OFFICER │
     │                     │                    │     exp: +24h     │
     │                     │                    │   }               │
     │                     │◄── {access_token} ─│                  │
     │                     │── localStorage.set │                  │
     │◄── redirect /dash ──│                   │                  │

Subsequent Requests:
     │── GET /api/tenders ─►│                  │                  │
     │                     │── GET /api/tenders │                  │
     │                     │   Authorization:   │                  │
     │                     │   Bearer {token}  │                  │
     │                     │                    │── jwt.decode()   │
     │                     │                    │── RBAC check     │
     │                     │                    │── execute query ─►│
     │                     │◄── [{tenders}] ────│                  │
     │◄── render tenders ──│                   │                  │
```

### 5.2 RBAC Permission Matrix

```
┌──────────────────────────────┬──────────────┬────────┬───────┐
│ Action                       │ OFFICER      │ BIDDER │ ADMIN │
├──────────────────────────────┼──────────────┼────────┼───────┤
│ View all tenders             │ ✅           │ ✅     │ ✅    │
│ Create tender                │ ✅           │ ❌     │ ✅    │
│ Run AI verification          │ ✅           │ ❌     │ ✅    │
│ Submit application           │ ❌           │ ✅     │ ✅    │
│ Upload documents             │ ❌           │ ✅     │ ✅    │
│ View own application         │ ❌           │ ✅     │ ✅    │
│ View all applications        │ ✅           │ ❌     │ ✅    │
│ Issue clarification          │ ✅           │ ❌     │ ✅    │
│ Respond to clarification     │ ❌           │ ✅     │ ✅    │
│ Record final decision        │ ✅           │ ❌     │ ✅    │
│ Generate PDF report          │ ✅           │ ✅*    │ ✅    │
│ View audit logs              │ ✅           │ ❌     │ ✅    │
│ Verify SHA-256 chain         │ ✅           │ ❌     │ ✅    │
│ Manage users                 │ ❌           │ ❌     │ ✅    │
│ System diagnostics           │ ❌           │ ❌     │ ✅    │
└──────────────────────────────┴──────────────┴────────┴───────┘
* Bidder can only download their own application report
```

---

## 6. Audit Chain Architecture

### 6.1 SHA-256 Hash Chain

```
GENESIS BLOCK
┌──────────────────────────────────────────────┐
│  id: 1                                        │
│  action: "SYSTEM_INIT"                        │
│  timestamp: 2026-06-10T00:00:00Z              │
│  prev_hash: "0000000000000000" (genesis)      │
│  current_hash: SHA256("0000..." + "INIT" +    │
│                        timestamp)             │
│  = "a3f4b2c1d8e9..."                          │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
BLOCK 2
┌──────────────────────────────────────────────┐
│  id: 2                                        │
│  action: "APPLICATION_SUBMITTED"              │
│  user_id: 3 (bidder_a)                        │
│  application_id: 1                            │
│  timestamp: 2026-06-11T10:30:00Z              │
│  prev_hash: "a3f4b2c1d8e9..."                 │
│  current_hash: SHA256(prev_hash +             │
│                        timestamp +            │
│                        user_id + action +     │
│                        payload_json)          │
│  = "b7d3e9f1a2c4..."                          │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
BLOCK 3
┌──────────────────────────────────────────────┐
│  id: 3                                        │
│  action: "VERIFICATION_RUN"                   │
│  user_id: 1 (officer)                         │
│  application_id: 1                            │
│  payload: {score: 94, risk: "LOW", ...}       │
│  prev_hash: "b7d3e9f1a2c4..."                 │
│  current_hash: SHA256(...) = "c9e5f2a8b1d3..." │
└──────────────────┬───────────────────────────┘
                   │
                 [...]
                   │
                   ▼
BLOCK N — DECISION
┌──────────────────────────────────────────────┐
│  action: "OFFICER_DECISION"                   │
│  payload: {decision: "APPROVED", ...}         │
│  prev_hash: [BLOCK N-1 hash]                  │
│  current_hash: SHA256(...)                    │
└──────────────────────────────────────────────┘

VERIFY: Recompute all hashes from genesis.
        If any computed hash ≠ stored hash → TAMPERED!
```

### 6.2 Audit Events Tracked

| Event | Trigger |
|---|---|
| `SYSTEM_INIT` | Server startup / first seed |
| `APPLICATION_SUBMITTED` | Bidder submits application |
| `DOCUMENT_UPLOADED` | File upload + SHA-256 of file |
| `VERIFICATION_RUN` | Officer runs AI verification |
| `CLARIFICATION_ISSUED` | Officer sends clarification |
| `CLARIFICATION_RESPONDED` | Bidder responds |
| `OFFICER_DECISION` | Final procurement decision recorded |
| `REPORT_GENERATED` | PDF compliance report downloaded |
| `CHAIN_VERIFIED` | Integrity verification performed |

---

## 7. Data Models & Relationships

### 7.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐
│   users      │       │  bidder_profiles  │
├──────────────┤       ├──────────────────┤
│ id (PK)      │──1:1──│ id (PK)           │
│ email        │       │ user_id (FK)      │
│ hashed_pwd   │       │ company_name     │
│ full_name    │       │ gstin            │
│ role         │       │ pan              │
│ organization │       │ udyam_number     │
│ is_active    │       │ annual_turnover  │
└──────────────┘       └──────────────────┘
       │
       │ 1:N (officer creates)
       ▼
┌──────────────┐       ┌──────────────────┐
│   tenders    │       │   tender_rules    │
├──────────────┤       ├──────────────────┤
│ id (PK)      │──1:N──│ id (PK)           │
│ tender_ref   │       │ tender_id (FK)   │
│ title        │       │ rule_code        │
│ description  │       │ description      │
│ rules (JSON) │       │ category         │
│ bid_date     │       │ threshold        │
│ status       │       │ is_mandatory     │
└──────────────┘       └──────────────────┘
       │
       │ 1:N
       ▼
┌──────────────────────┐
│    applications      │
├──────────────────────┤
│ id (PK)              │
│ application_ref      │
│ tender_id (FK)       │
│ bidder_user_id (FK)  │
│ submitted_gstin      │
│ submitted_pan        │
│ submitted_turnover   │
│ status               │
│ compliance_score     │
│ risk_level           │
└──────────────────────┘
       │
       ├──────────────────────────────────────────┐
       │                                          │
       ▼                                          ▼
┌──────────────────┐                   ┌──────────────────────┐
│    documents     │                   │  verification_results │
├──────────────────┤                   ├──────────────────────┤
│ id (PK)          │                   │ id (PK)               │
│ application_id   │                   │ application_id (FK)   │
│ doc_type         │                   │ category              │
│ storage_path     │                   │ rule_code             │
│ sha256_hash      │                   │ title                 │
│ ocr_text         │                   │ status (PASS/FAIL)    │
└──────┬───────────┘                   │ finding               │
       │                               │ extracted_value       │
       │ 1:N                           │ expected_value        │
       ▼                               │ confidence            │
┌──────────────────┐                   │ score_contribution    │
│  extracted_data  │                   │ is_critical_issue     │
├──────────────────┤                   └──────────────────────┘
│ id (PK)          │
│ document_id (FK) │
│ field_key        │       ┌─────────────────────┐
│ extracted_value  │       │   document_chunks    │
│ confidence       │       ├─────────────────────┤
│ source_page      │       │ id (PK)              │
└──────────────────┘       │ document_id (FK)     │
                           │ content (text)       │
                           │ embedding (vector)   │
                           │ chunk_index          │
                           └─────────────────────┘
```

---

## 8. Frontend Component Tree

```
app/
├── layout.tsx                    ← Root layout + Providers
│   └── Providers.tsx             ← ThemeProvider + AuthProvider + SidebarProvider
│
├── login/page.tsx                ← Public login page
│
├── dashboard/page.tsx            ← Officer/Bidder dashboard
│   ├── Header.tsx                ← Top nav + DarkModeToggle + Notifications
│   ├── Sidebar.tsx               ← Role-based nav (with Suspense boundary)
│   └── SIHDemoBar.tsx            ← Quick-login demo bar (SIH presentation)
│
├── officer/
│   ├── tenders/page.tsx          ← Tender list + Rule Compiler trigger
│   │   └── TenderRuleCompilerModal.tsx
│   └── verification/[id]/page.tsx ← ⭐ HERO FEATURE — Verification Inspector
│       ├── EvidenceModal.tsx     ← Split document + extraction viewer
│       ├── OfficerDecisionModal.tsx ← Final decision with confirmation
│       └── ClarificationModal.tsx   ← Clarification request form
│
├── bidder/
│   ├── apply/page.tsx            ← 4-step application wizard
│   ├── verification/page.tsx     ← Status tracker + score display
│   └── clarifications/page.tsx  ← Clarification response drawer
│
├── admin/page.tsx                ← Admin console (tabs: users/tenders/audit)
├── audit/page.tsx                ← Audit trail + chain verify
├── reports/[id]/page.tsx         ← Report viewer + PDF download
├── terms/page.tsx                ← Terms of service
└── privacy/page.tsx              ← Privacy policy

Global Components (src/components/):
├── DarkModeToggle.tsx            ← Pill-style light/dark switch
├── ScrollProgress.tsx            ← Top progress bar
├── Banner.tsx                    ← Environment/info banner
├── BackToTop.tsx                 ← Scroll-to-top button
├── FloatingContact.tsx           ← Floating help button
├── CopyButton.tsx                ← Copy-to-clipboard utility
├── ConfirmationModal.tsx         ← Generic confirm dialog
├── SkeletonLoader.tsx            ← Loading placeholder
├── Chatbot.tsx                   ← RAG-powered AI chatbot
├── FAQAccordion.tsx              ← Accordion FAQ component
└── UtmTracker.tsx                ← UTM parameter tracker
```

---

## 9. API Endpoints Reference

### Base URL: `http://localhost:8000`

#### Authentication (`/api/auth`)
| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/login` | None | `{email, password}` | `{access_token, token_type}` |
| POST | `/api/auth/register` | None | `{email, password, full_name, role, organization}` | `{user}` |
| GET | `/api/auth/me` | JWT | — | `{user}` |

#### Tenders (`/api/tenders`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/tenders` | JWT | Returns list filtered by role |
| POST | `/api/tenders` | OFFICER | Create tender |
| GET | `/api/tenders/{id}` | JWT | Single tender with rules |
| POST | `/api/tenders/{id}/compile` | OFFICER | Run Gemini rule compiler |
| PATCH | `/api/tenders/{id}` | OFFICER | Update tender |

#### Applications (`/api/applications`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/applications` | JWT | Filtered by role |
| POST | `/api/applications` | BIDDER | Submit application |
| GET | `/api/applications/{id}` | JWT | Full detail with docs |
| POST | `/api/applications/{id}/documents` | BIDDER | Upload document (multipart) |

#### Verification (`/api/verify`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/verify/{application_id}` | OFFICER | Run full pipeline |
| GET | `/api/verify/{application_id}/results` | JWT | Get stored results |
| POST | `/api/rag/query` | OFFICER | RAG chatbot query |

#### Clarifications (`/api/clarifications`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/clarifications` | JWT | Filtered by role |
| POST | `/api/clarifications` | OFFICER | Create clarification |
| GET | `/api/clarifications/{id}` | JWT | Single clarification |
| PATCH | `/api/clarifications/{id}` | BIDDER | Respond to clarification |

#### Reports (`/api/reports`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/reports/{application_id}/generate` | JWT | Generate PDF |
| GET | `/api/reports/{application_id}/download` | JWT | Download PDF |

#### Audit (`/api/audit`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/audit` | OFFICER/ADMIN | Get audit log |
| POST | `/api/audit/verify-chain` | OFFICER/ADMIN | Verify SHA-256 chain |

#### Admin (`/api/admin`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/admin/users` | ADMIN | List all users |
| POST | `/api/admin/users` | ADMIN | Create user |
| PATCH | `/api/admin/users/{id}` | ADMIN | Update user |
| DELETE | `/api/admin/users/{id}` | ADMIN | Deactivate user |
| GET | `/api/admin/stats` | ADMIN | System statistics |

#### Health
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` | None | Basic health |
| GET | `/api/health` | None | Full system health |

---

## 10. Deployment Architecture

### Local Development
```
[Browser :3000] ──► [Next.js Dev Server] ──► [FastAPI :8000] ──► [SQLite]
```

### Production (Render.com)
```
[User Browser]
      │
      ▼
[Vercel / Render — Next.js Frontend]
      │  HTTPS API calls
      ▼
[Render Web Service — FastAPI Backend]
      │                    │
      ▼                    ▼
[Supabase PostgreSQL]  [Supabase Storage]
[+ pgvector ext.]      [Document files]
```

### `render.yaml` Services
```yaml
services:
  - type: web
    name: bharattender-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT

  - type: web
    name: bharattender-frontend
    env: node
    buildCommand: npm run build
    startCommand: npm start
```

### Required Production Environment Variables

**Backend (Render)**:
```
DATABASE_URL=postgresql+psycopg://user:pass@host/db
GEMINI_API_KEY=AIza...
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Frontend (Vercel)**:
```
NEXT_PUBLIC_API_URL=https://bharattender-backend.onrender.com
```

---

*© 2026 BharatTender Shield Team — SIH 2026 Problem Statement 26100*
