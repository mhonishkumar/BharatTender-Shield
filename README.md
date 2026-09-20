# BharatTender Shield — GeM Sentinel
> **"Every Bid Verified. Every Decision Defensible."**
>
> **Smart India Hackathon (SIH) 2026 — Problem Statement 26100**
> *AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement*

<div align="center">

![BharatTender Shield](./logo.jpg)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791?logo=postgresql)](https://www.postgresql.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-Flash-4285F4?logo=google)](https://ai.google.dev/)

</div>

---

## Table of Contents
1. [Executive Overview](#executive-overview)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [User Portals & Roles](#user-portals--roles)
5. [AI / RAG Pipeline](#ai--rag-pipeline)
6. [Verification Engine](#verification-engine)
7. [Pre-Seeded Demo Accounts](#pre-seeded-demo-accounts)
8. [Local Development Setup](#local-development-setup)
9. [Environment Variables](#environment-variables)
10. [API Reference](#api-reference)
11. [Database Schema](#database-schema)
12. [Audit & Security](#audit--security)
13. [SIH Live Demo Walkthrough](#sih-live-demo-walkthrough)
14. [Compliance Score Breakdown](#compliance-score-breakdown)
15. [Limitations & Production Roadmap](#limitations--production-roadmap)
16. [License](#license)

---

## Executive Overview

**BharatTender Shield** is a secure, AI-powered compliance platform for Government e-Marketplace (GeM) public procurement. It solves the critical operational bottleneck where procurement officers must manually verify complex multi-document statutory requirements under tight deadlines.

### Core Principle — Human Authority is Sacred
> ⚠️ **AI NEVER automatically approves or rejects a bidder.**
>
> The AI acts as intelligent decision support — extracting statutory identifiers, cross-comparing documents, and surfacing evidence-backed discrepancies. **The Procurement Officer alone renders the final, legally defensible procurement decision.**

### What It Solves
| Problem | BharatTender Shield Solution |
|---|---|
| Manual GST/PAN/Udyam verification across portals | Automated deterministic rule engine + Gemini AI extraction |
| Inconsistent evaluation criteria | Tender-to-Rule compiler converts clauses to structured rules |
| Untraced procurement decisions | SHA-256 hash-chained immutable audit trail |
| Slow document evidence gathering | RAG pipeline + pgvector evidence retrieval |
| Compliance report generation | ReportLab-branded PDF with scoring |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      BharatTender Shield                        │
├──────────────────────────┬──────────────────────────────────────┤
│   FRONTEND (Port 3000)   │        BACKEND (Port 8000)          │
│   Next.js 16 / React 19  │        FastAPI / Python 3.12        │
│   TypeScript / Tailwind  │        SQLAlchemy + Alembic         │
│                          │                                      │
│  ┌──────────────────┐    │   ┌────────────────────────────┐    │
│  │   Officer Portal │◄───┼───│  /api/verify               │    │
│  │   Bidder Portal  │    │   │  /api/tenders              │    │
│  │   Admin Console  │    │   │  /api/applications         │    │
│  └──────────────────┘    │   │  /api/clarifications       │    │
│                          │   │  /api/reports              │    │
│  ┌──────────────────┐    │   │  /api/audit                │    │
│  │  DarkModeToggle  │    │   └──────────┬─────────────────┘    │
│  │  RAG Chatbot     │    │              │                       │
│  │  Evidence Viewer │    │   ┌──────────▼─────────────────┐    │
│  └──────────────────┘    │   │  AI / RAG Engine           │    │
│                          │   │  ┌─────────────────────┐   │    │
└──────────────────────────┤   │  │ Gemini Flash 1.5    │   │    │
                           │   │  │ pgvector RAG        │   │    │
   ┌───────────────────┐   │   │  │ Deterministic Rules │   │    │
   │ Supabase / SQLite │◄──┘   │  │ PyMuPDF + Tesseract │   │    │
   │  pgvector         │       │  └─────────────────────┘   │    │
   │  JWT + RBAC       │       └────────────────────────────┘    │
   └───────────────────┘                                         │
                                                                  │
   ┌───────────────────────────────────────────────────────────┐  │
   │              SHA-256 Hash-Chained Audit Trail             │  │
   └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | Next.js | 16.3.4 | App framework, routing, SSR |
| **Frontend** | React | 19.x | Component UI |
| **Frontend** | TypeScript | 5.x | Type safety |
| **Frontend** | Tailwind CSS | 4.x | Utility styling |
| **Frontend** | next-themes | 0.4 | Dark/light mode toggle |
| **Frontend** | @heroicons/react | 2.x | Icon library |
| **Backend** | FastAPI | 0.115 | REST API framework |
| **Backend** | Python | 3.12 | Runtime |
| **Backend** | SQLAlchemy | 2.x | ORM |
| **Backend** | Alembic | 1.x | Database migrations |
| **Database** | SQLite (dev) | 3.x | Local development |
| **Database** | PostgreSQL + pgvector | 15+ | Production + RAG vector store |
| **Database** | Supabase | — | Managed Postgres + Storage |
| **AI** | Gemini Flash 1.5 | — | Document extraction + RAG |
| **Document** | PyMuPDF (fitz) | 1.25 | PDF text extraction |
| **Document** | Tesseract OCR | 5.x | Scanned image OCR |
| **Reports** | ReportLab | 4.x | PDF compliance certificate |
| **Auth** | JWT (HS256) | — | Stateless authentication |
| **Auth** | bcrypt | — | Password hashing |
| **Security** | SHA-256 | — | Audit hash chaining |

---

## User Portals & Roles

### 1. Procurement Officer Portal (`PROCUREMENT_OFFICER`)
| Feature | Description |
|---|---|
| Executive Dashboard | Active tenders, high-risk bidders, pending reviews |
| Tender Rule Compiler | Converts legal clauses → structured verification rules |
| Bidder Verification Inspector | Animated multi-stage pipeline, 100-pt compliance score |
| Evidence Viewer | Split layout: document preview + extracted values + conflicts |
| Clarification Dispatcher | Formal document clarification requests to bidders |
| Officer Final Decision | Mandatory statutory confirmation before decision locks |
| PDF Report Generator | ReportLab-branded compliance certificate download |
| Audit Trail | SHA-256 chain viewer with integrity verification |

### 2. Bidder Enterprise Portal (`BIDDER`)
| Feature | Description |
|---|---|
| Tender Application Wizard | 4-step: Company Info → Upload Docs → Review → Submit |
| Verification Status Tracker | Per-category badges (PASS/FAIL/PENDING), risk score |
| Clarification Response | Upload replacement documents + reply to officer queries |
| Application History | Track all submitted applications and their status |

### 3. Admin Console (`ADMIN`)
| Feature | Description |
|---|---|
| User Management | Create/activate/deactivate officers and bidders |
| Role Assignment | Assign and modify RBAC roles |
| Engine Diagnostics | View AI extraction pipeline status |
| System Audit Logs | Complete tamper-evident event log |

---

## AI / RAG Pipeline

### Flow Diagram
```
Bidder Document Upload
        │
        ▼
┌───────────────────────────────┐
│  1. Document Ingestion        │
│     PyMuPDF → text extraction │
│     Tesseract OCR (fallback)  │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│  2. Chunking & Embedding      │
│     Text split into chunks    │
│     Gemini Embedding API      │
│     Stored → pgvector (1536d) │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│  3. Gemini AI Extraction      │
│     Structured field extract: │
│     GSTIN, PAN, Udyam,        │
│     Turnover, Dates, Names    │
│     Confidence scoring        │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│  4. Deterministic Rule Engine │
│     Regex: GSTIN format       │
│     Regex: PAN format         │
│     Regex: Udyam format       │
│     Threshold: Turnover ≥ min │
│     Cross-doc entity matching │
│     Date validity at bid date │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│  5. RAG Evidence Retrieval    │
│     Officer query → vector    │
│     pgvector cosine search    │
│     Top-K chunk retrieval     │
│     Gemini synthesis answer   │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│  6. Compliance Score (0-100)  │
│     + Risk Classification     │
│     + Evidence Package        │
│     → Officer Inspector UI    │
└───────────────────────────────┘
```

### RAG Chatbot
The in-app chatbot allows Procurement Officers to ask natural language questions about any tender or application:
- *"What is the GSTIN mismatch in Application 2?"*
- *"Show me turnover evidence for DEF Safety Infra Ltd"*
- *"Which bidders have expired Udyam certificates?"*

---

## Verification Engine

### Compliance Score Breakdown
| Category | Max Points | Validation Method |
|---|---|---|
| **GST Registration** | 20 pts | Format regex + Mock GSTN gateway + Doc upload |
| **PAN Card** | 20 pts | Format regex + Mock ITD lookup + Cross-match |
| **Udyam MSME** | 20 pts | Format regex + Mock MSME portal + Date validity |
| **Document Completeness** | 15 pts | Presence of all mandatory uploads |
| **Financial Turnover** | 15 pts | Declared vs. tender minimum threshold |
| **Cross-Doc Consistency** | 10 pts | Entity resolution across all submitted docs |
| **TOTAL** | **100 pts** | — |

### Risk Tiers
| Score Range | Risk Level | Action Required |
|---|---|---|
| 80 – 100 | 🟢 **LOW RISK** | Recommend approval (Officer confirms) |
| 60 – 79 | 🟡 **MEDIUM RISK** | Clarifications recommended |
| 0 – 59 | 🔴 **HIGH RISK** | Major discrepancies — likely disqualification |

### Deterministic Rules
```python
# GSTIN: 15-char alphanumeric
GSTIN_PATTERN = r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'

# PAN: 10-char alpha-numeric
PAN_PATTERN = r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$'

# Udyam Registration
UDYAM_PATTERN = r'^UDYAM-[A-Z]{2}-\d{2}-\d{7}$'

# Bid Date validation
is_valid = certificate_valid_from <= bid_date <= certificate_valid_until
```

---

## Pre-Seeded Demo Accounts

> All accounts use the same password: **`Demo@12345`**

| Role | Email | Password | Name | Organization |
|---|---|---|---|---|
| 🏛️ **Procurement Officer** | `officer@gemsentinel.demo` | `Demo@12345` | Rajesh Verma, IPoS | GeM Central Procurement Directorate |
| ✅ **Bidder A (Compliant)** | `bidder@gemsentinel.demo` | `Demo@12345` | Vikramaditya Sharma | ABC Technologies Pvt Ltd (Score: 94%, LOW Risk) |
| ⚠️ **Bidder B (Discrepant)** | `bidder_b@gemsentinel.demo` | `Demo@12345` | Sanjay Kulkarni | DEF Safety Infra Ltd (Score: 59%, HIGH Risk) |
| 🔧 **Administrator** | `admin@gemsentinel.demo` | `Demo@12345` | System Administrator | BharatTender Shield Core Administration |

### Demo Bidder Data
| Field | Bidder A (Compliant) | Bidder B (Discrepant) |
|---|---|---|
| **Company** | ABC Technologies Pvt Ltd | DEF Safety Infra Ltd |
| **CIN** | U72900TN2020PTC135790 | U45200MH2015PTC265431 |
| **GSTIN** | 33ABCDE1234F1Z5 | 27DEFGH5678J2Z3 |
| **PAN** | ABCDE1234F | DEFGH5678J |
| **Udyam** | UDYAM-TN-02-0012345 | UDYAM-MH-12-0078901 |
| **Turnover** | ₹125.5 Lakhs | ₹45.0 Lakhs |
| **Issue** | None | GSTIN mismatch + expired Udyam on bid date |

---

## Local Development Setup

### Prerequisites
- Python 3.12+
- Node.js 20+ / npm 10+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/mhonishkumar/BharatTender-Shield.git
cd BharatTender-Shield
```

### 2. Backend (FastAPI)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (Linux/macOS)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env    # Windows
cp .env.example .env      # Linux/macOS

# Edit .env with your Gemini API key (see Environment Variables section)

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend will seed demo data automatically on first run.

### 3. Frontend (Next.js)
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.local.example .env.local    # Windows
cp .env.local.example .env.local      # Linux/macOS

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Production Build (Frontend)
```bash
cd frontend
npm run build
npm start
```

### 5. Run Tests
```bash
cd backend
python -m tests.test_compliance
```

---

## Environment Variables

### Backend — `backend/.env`
```env
# ─────────────────────────────────────────
# BharatTender Shield — Backend Environment
# ─────────────────────────────────────────

# Database (SQLite for local dev, PostgreSQL for production)
DATABASE_URL=                          # Leave blank for SQLite (auto-creates bharattender_shield.db)
                                       # PostgreSQL: postgresql://user:password@host:5432/dbname
                                       # Supabase:   postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres

# Gemini AI API Key (required for AI extraction and RAG)
GEMINI_API_KEY=AIza...                 # Get from: https://aistudio.google.com/app/apikey

# JWT Security
JWT_SECRET=bharattendershield-super-secret-key-2026-sih
SECRET_KEY=bharattendershield-super-secret-key-2026-sih

# CORS Origins
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Cloud deployment detection (auto-detected on Render/Heroku)
# RENDER=true   (set automatically by Render)
# CLOUD_ENV=true
```

### Frontend — `frontend/.env.local`
```env
# ──────────────────────────────────────────
# BharatTender Shield — Frontend Environment
# ──────────────────────────────────────────

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# App metadata
NEXT_PUBLIC_APP_NAME=BharatTender Shield
NEXT_PUBLIC_APP_VERSION=1.0.0
```

> 🔒 **Never commit `.env` or `.env.local` files to version control.**
> The `.gitignore` already excludes them.

---

## API Reference

Base URL: `http://localhost:8000`

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

### Authentication
```
POST   /api/auth/login              # Login → returns JWT token
POST   /api/auth/register           # Register new user
GET    /api/auth/me                 # Get current user profile
```

### Tenders
```
GET    /api/tenders                 # List all tenders
POST   /api/tenders                 # Create tender (Officer)
GET    /api/tenders/{id}            # Get tender details
POST   /api/tenders/{id}/compile    # Run Tender Rule Compiler (AI)
```

### Applications
```
GET    /api/applications            # List applications
POST   /api/applications            # Submit application (Bidder)
GET    /api/applications/{id}       # Get application details
POST   /api/applications/{id}/documents  # Upload document
```

### Verification
```
POST   /api/verify/{application_id} # Run full verification pipeline
GET    /api/verify/{application_id}/results  # Get verification results
POST   /api/rag/query               # RAG chatbot query
```

### Clarifications
```
GET    /api/clarifications          # List clarifications
POST   /api/clarifications          # Create clarification (Officer)
PATCH  /api/clarifications/{id}     # Respond to clarification (Bidder)
```

### Reports & Audit
```
POST   /api/reports/{application_id}/generate   # Generate PDF report
GET    /api/reports/{application_id}/download   # Download PDF
GET    /api/audit                               # Get audit log
POST   /api/audit/verify-chain                  # Verify SHA-256 chain
```

### Health
```
GET    /health                      # Basic health check
GET    /api/health                  # Full system health
```

---

## Database Schema

### Core Tables
```
users                 → id, email, hashed_password, full_name, role, organization, is_active
bidder_profiles       → id, user_id, company_name, gstin, pan, udyam_number, annual_turnover
tenders               → id, tender_ref, title, rules (JSON), bid_submission_date, status
tender_rules          → id, tender_id, rule_code, description, category, threshold
applications          → id, tender_id, bidder_user_id, submitted_gstin, submitted_pan, status
documents             → id, application_id, doc_type, storage_path, sha256_hash, extracted_data (JSON)
extracted_data        → id, document_id, field_key, extracted_value, confidence, source_page
verification_results  → id, application_id, category, rule_code, status, finding, score
clarifications        → id, application_id, officer_user_id, question, response, status
decisions             → id, application_id, officer_user_id, decision, justification, locked_at
audit_logs            → id, action, user_id, application_id, prev_hash, current_hash, timestamp
document_chunks       → id, document_id, content, embedding (vector 1536), chunk_index
```

### Alembic Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

---

## Audit & Security

### SHA-256 Hash Chain
Every action (verification run, clarification, decision, document upload) produces an immutable audit record:

```python
current_hash = SHA256(
    previous_hash
    + timestamp (ISO8601)
    + user_id
    + action_type
    + JSON payload
)
```

This creates a tamper-evident blockchain-style chain where any modification to a historical record would invalidate all subsequent hashes.

### Security Headers (Production)
Configured in `next.config.ts`:
```
X-DNS-Prefetch-Control: on
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### RBAC (Role-Based Access Control)
| Endpoint | OFFICER | BIDDER | ADMIN |
|---|---|---|---|
| Run verification | ✅ | ❌ | ✅ |
| Submit application | ❌ | ✅ | ✅ |
| Issue clarification | ✅ | ❌ | ✅ |
| Respond clarification | ❌ | ✅ | ✅ |
| Record final decision | ✅ | ❌ | ✅ |
| Generate PDF report | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

### Authentication Flow
```
Client          FastAPI         Database
  │                │                │
  │─── POST /login ──►│            │
  │               │── query user ──►│
  │               │◄── user data ───│
  │               │── verify bcrypt │
  │◄── JWT token ─│                │
  │                │                │
  │─── GET /api/x ──►│             │
  │   Bearer: token  │             │
  │               │── decode JWT   │
  │               │── check role   │
  │◄── response ──│                │
```

---

## SIH Live Demo Walkthrough

> **5-Minute Presentation Script**

1. **Login as Officer** → use `officer@gemsentinel.demo` / `Demo@12345`  
   *(or click the SIH Demo Bar at top for instant login)*

2. **Dashboard** → Shows 2 tenders, 4 applications, HIGH risk alert for DEF Safety Infra

3. **Open Tender `GEM-DEMO-2026-001`** → View compiled AI rules (Clause 4.1, 5.2, etc.)

4. **Open Bidder B (DEF Safety Infra Ltd)** → Click **"Run AI Verification"**
   - Watch animated 4-stage pipeline: Extract → Validate → Cross-Check → Score

5. **Score: 59/100 — HIGH RISK** 🔴
   - GSTIN mismatch: Application says `27DEFGH5678J2Z3`, document says different
   - Udyam expired: `UDYAM-MH-12-0078901` was expired as of bid date `10-06-2026`

6. **Click [View Evidence]** on GSTIN finding  
   - Split viewer: Document image (left) + Extracted data + Conflicting values (right)

7. **Send Clarification** → "Please upload corrected GSTIN certificate"

8. **Switch to Bidder B** → View clarification, upload replacement, submit response

9. **Return to Officer** → Re-run verification, score improves, record **Final Decision**

10. **Download PDF Report** → ReportLab compliance certificate with SHA-256 footer

11. **Audit Logs** → Click **"Verify Chain Integrity"** → All hashes validate ✅

---

## Compliance Score Breakdown

```
┌────────────────────────────────────────────────┐
│          COMPLIANCE SCORE BREAKDOWN            │
├───────────────────────┬──────┬─────────────────┤
│ Category              │ Max  │ Validation      │
├───────────────────────┼──────┼─────────────────┤
│ GST Registration      │ 20   │ Regex + Mock    │
│ PAN Card              │ 20   │ Regex + Mock    │
│ Udyam MSME            │ 20   │ Regex + Date    │
│ Document Completeness │ 15   │ Upload check    │
│ Financial Turnover    │ 15   │ Threshold       │
│ Cross-Doc Consistency │ 10   │ Entity match    │
├───────────────────────┼──────┼─────────────────┤
│ TOTAL                 │ 100  │                 │
├───────────────────────┴──────┴─────────────────┤
│  80-100 │ 🟢 LOW RISK    │ Recommend Approve  │
│  60-79  │ 🟡 MEDIUM RISK │ Clarify & Review   │
│   0-59  │ 🔴 HIGH RISK   │ Likely Disqualify  │
└────────────────────────────────────────────────┘
```

---

## Limitations & Production Roadmap

### Current Limitations (SIH Demo)
1. **Mock Government APIs**: GST, PAN, Udyam lookups are simulated. Production requires authorized API Setu / NIC / GSTN / MSME portal gateway credentials.
2. **SQLite Default**: Development uses SQLite. Production requires PostgreSQL with pgvector extension.
3. **Tesseract OCR**: Works well on digital PDFs; low-resolution physical scans may require manual review.
4. **Single-Region**: Not multi-tenancy ready yet — designed for demonstration scale.

### Production Roadmap
- [ ] Live GSTN API integration via API Setu
- [ ] Live Income Tax Department PAN validation
- [ ] Live MSME Udyam portal lookup
- [ ] NIC GeM procurement portal data sync
- [ ] Multi-tenancy (separate DB per department)
- [ ] S3 / Supabase Storage for document files
- [ ] Redis-based job queue for async verification
- [ ] Email notifications (SMTP / SendGrid)
- [ ] Mobile PWA (Progressive Web App)
- [ ] Kubernetes deployment manifests

---

## License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for full details.

© 2026 BharatTender Shield Team — Smart India Hackathon 2026

---

<div align="center">

**Built for Smart India Hackathon 2026 · Problem Statement 26100**

*AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement*

🇮🇳 *Making Government Procurement Transparent, Verifiable, and Defensible.*

</div>
