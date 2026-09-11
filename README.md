# BharatTender Shield
> **"Every Bid Verified. Every Decision Defensible."**
> 
> **Smart India Hackathon (SIH) 2026 — Problem Statement 26100**  
> *AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement*

---

## Executive Overview
**BharatTender Shield** is a secure, AI-powered compliance platform for public procurement (Government e-Marketplace / GeM). It addresses the critical challenge of high-volume tender compliance verification:
- Procurement officers must verify complex statutory documents (GST, PAN, MSME Udyam, financial statements) under tight deadlines.
- Discrepancies and eligibility issues lead to costly disputes or audit disqualifications.
- **Critical Principle**: **AI NEVER automatically approves or rejects a bidder.** AI acts as intelligent decision support, extracting statutory identifiers, cross-comparing documents, and providing evidence. **The Procurement Officer renders the final, defensible procurement decision.**

---

## Visual Identity & Brand Design
- **Official Brand Logo**: BharatTender Shield official emblem integrated into Header, Sidebar, Login, and PDF Compliance Reports.
- **Color Palette**:
  - **Deep Navy Blue** (`#0F294A`): Authority, trust, security.
  - **Accent Orange** (`#EA580C`): Warnings, alerts, action required.
  - **Accent Green** (`#15803D`): Verified, compliant, approved.
  - **Clean Background** (`#F8FAFC` / `#FFFFFF`): Professional, enterprise-grade government portal.
- **Typography**: Inter across all views for maximum legibility and accessibility.

---

## User Portals & Roles
1. **Procurement Officer Portal**:
   - Executive Dashboard (Active Tenders, High-Risk Bidders, Pending Reviews).
   - **Tender-to-Rule Compiler**: Converts tender legal clauses into structured, editable verification rules.
   - **Bidder Verification Inspector (Hero Feature)**: Animated multi-stage verification pipeline, 100-point transparent compliance score, and mock government lookups.
   - **Evidence Viewer**: Signature split layout displaying document preview on the left and extracted values, conflicting values, confidence, and applied rules on the right.
   - **Clarification Dispatcher**: Request corrected documentation directly from bidders.
   - **Official Final Decision**: Final procurement determination with mandatory statutory confirmation.
   - **Compliance Report Generation**: Downloads official branded ReportLab PDF.
2. **Bidder Portal**:
   - Application Wizard (Company Info, Document Uploads, Review, Application ID generation).
   - Verification Status Tracker with category status badges and "Action Required" alert cards.
   - Clarification Response Drawer to upload replacement documents and reply to inquiries.
3. **Admin Console**:
   - User and role management, engine diagnostics, and system audit logs.

---

## Verification Pipeline & Engine
1. **Deterministic Rule Engine**:
   - Regex validation for GSTIN (15 chars), PAN (10 chars), Udyam (UDYAM-XX-00-0000000), and numeric turnover thresholds.
2. **Mock Government Gateways**:
   - Simulated NIC, GSTN, ITD, and MSME lookups clearly labeled as `DEMO / MOCK GOVERNMENT VERIFICATION`.
3. **Cross-Document Entity Resolution**:
   - Detects discrepancies between application form, GST certificate, PAN card, and Udyam filings (e.g. conflicting GSTIN embedded in Udyam).
4. **Time-Aware Bid Date Validation**:
   - Evaluates certificate validity specifically as of the tender bid submission date (e.g. 10-06-2026).
5. **Transparent 100-Point Compliance Scoring**:
   - GST: 20 pts
   - PAN: 20 pts
   - Udyam MSME: 20 pts
   - Document Completeness: 15 pts
   - Financial Turnover: 15 pts
   - Cross-Document Consistency: 10 pts
   - **Risk Tiers**: 80–100 (LOW), 60–79 (MEDIUM), 0–59 (HIGH).
6. **Tamper-Evident SHA-256 Audit Trail**:
   - Every verification, clarification, and decision is cryptographically chained (`current_hash = SHA256(prev_hash + timestamp + user + action + payload)`).
   - Interactive verification button verifies the entire chain from the genesis block.

---

## Pre-Seeded SIH Demo Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Procurement Officer** | `officer@gemsentinel.demo` | `Demo@12345` | Rajesh Verma, IPoS (Central Directorate) |
| **Bidder A (Compliant)** | `bidder@gemsentinel.demo` | `Demo@12345` | ABC Technologies Pvt Ltd (Score 94%, LOW Risk) |
| **Bidder B (Discrepant)**| `bidder_b@gemsentinel.demo` | `Demo@12345` | DEF Safety Infra Ltd (Score 59%, HIGH Risk) |
| **Administrator** | `admin@gemsentinel.demo` | `Demo@12345` | System Administrator |

---

## SIH 5-Minute Live Presentation Walkthrough
1. **Log in as Officer** (`officer@gemsentinel.demo` or click the top SIH Demo Bar).
2. **Open Tender `GEM-DEMO-2026-001`**: View compiled compliance rules.
3. **Open Bidder B (`DEF Safety Infra Ltd`)**: Click **Run AI Verification** to see real-time extraction.
4. **Examine Score & Risk**: Score drops to 59/100 (HIGH Risk).
5. **Inspect GSTIN Mismatch**: Click **[View Evidence]** to showcase the signature split viewer showing the conflicting GSTIN and expired Udyam on the bid date.
6. **Request Clarification**: Send formal query to Bidder B.
7. **Switch to Bidder B**: View the clarification inquiry and submit a corrected document.
8. **Return to Officer**: Re-run verification, review updated score, and record **Officer Final Decision**.
9. **Download PDF Report**: Click **Generate PDF Report** to view the ReportLab compliance certificate.
10. **Verify Audit Trail**: Open **Audit Logs** and click **Verify Chain Integrity** to validate the SHA-256 hashes.

---

## Local Development & Setup

### 1. Backend (FastAPI + Python 3.12)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend (Next.js + TypeScript + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Automated Tests
Run the comprehensive verification test suite:
```bash
cd backend
python -m tests.test_compliance
```
Tests pass for:
- Mock Government Verification (GST, PAN, Udyam)
- Deterministic regex format validation
- Cross-document mismatch detection
- SHA-256 hash chaining integrity
- ReportLab PDF compliance report generation

---

## Limitations & Production Roadmap
1. **Mock Government APIs**: Simulated for SIH presentation. Production requires authorized API Setu / NIC gateway credentials.
2. **Human Authority**: AI strictly assists; final qualification/disqualification is legally reserved for the Procurement Officer.
3. **Scanned Documents**: PyMuPDF handles digital PDFs; low-resolution physical scans trigger graceful manual review notices.
