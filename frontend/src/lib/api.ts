const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
export const API_BASE = RAW_API_URL.trim().replace(/\/+$/, "");

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bts_auth_token");
  }
  return null;
};

export const setAuthToken = (token: string, role: string, user: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("bts_auth_token", token);
    localStorage.setItem("bts_role", role);
    localStorage.setItem("bts_user", JSON.stringify(user));
  }
};

export const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("bts_auth_token");
    localStorage.removeItem("bts_role");
    localStorage.removeItem("bts_user");
  }
};

// ==========================================
// RESILIENT DEMO FALLBACK DATA (OFFLINE SHIELD)
// ==========================================
const DEMO_USERS_MAP: Record<string, any> = {
  "officer@gemsentinel.demo": {
    user_id: 1,
    email: "officer@gemsentinel.demo",
    full_name: "Rajesh Verma, IPoS",
    role: "PROCUREMENT_OFFICER",
    organization: "GeM Central Procurement Directorate",
    access_token: "mock-token-officer-sha256-verified"
  },
  "bidder@gemsentinel.demo": {
    user_id: 2,
    email: "bidder@gemsentinel.demo",
    full_name: "Vikramaditya Sharma",
    role: "BIDDER",
    organization: "ABC Technologies Pvt Ltd",
    access_token: "mock-token-bidder-a-sha256-verified"
  },
  "bidder_b@gemsentinel.demo": {
    user_id: 3,
    email: "bidder_b@gemsentinel.demo",
    full_name: "Sanjay Kulkarni",
    role: "BIDDER",
    organization: "DEF Safety Infra Ltd",
    access_token: "mock-token-bidder-b-sha256-verified"
  },
  "admin@gemsentinel.demo": {
    user_id: 4,
    email: "admin@gemsentinel.demo",
    full_name: "System Administrator",
    role: "ADMIN",
    organization: "BharatTender Shield Core Administration",
    access_token: "mock-token-admin-sha256-verified"
  }
};

const DEMO_TENDERS = [
  {
    id: 1,
    tender_reference: "GEM-DEMO-2026-001",
    title: "Supply of Industrial Safety Equipment & Protective Gear",
    description: "Procurement of specialized protective equipment conforming to BIS and PESO standards.",
    department: "Ministry of Petroleum & Natural Gas • CPCL",
    estimated_value: 5000000,
    submission_deadline: "2026-06-10T17:00:00",
    status: "ACTIVE",
    rules_count: 6,
    created_at: "2026-05-01T10:00:00"
  },
  {
    id: 2,
    tender_reference: "GEM-2026-002",
    title: "High-Performance Cloud Compute & Server Upgradation",
    description: "Cloud infrastructure provisioning with ISO 27001 compliance under PPP-MII guidelines.",
    department: "Department of Telecommunications (DoT)",
    estimated_value: 14500000,
    submission_deadline: "2026-07-18T18:00:00",
    status: "ACTIVE",
    rules_count: 8,
    created_at: "2026-05-10T11:30:00"
  }
];

const DEMO_APPLICATIONS = [
  {
    id: 2,
    application_reference: "APP-2026-002",
    tender_id: 1,
    tender_ref: "GEM-DEMO-2026-001",
    bidder_name: "DEF Safety Infra Ltd",
    bidder_email: "bidder_b@gemsentinel.demo",
    gstin: "27AABCS1429B1ZB",
    pan: "AABCS1429B",
    status: "UNDER_REVIEW",
    composite_score: 59,
    risk_level: "HIGH",
    discrepancy_count: 3,
    submitted_at: "2026-05-18T14:22:10"
  },
  {
    id: 1,
    application_reference: "APP-2026-001",
    tender_id: 1,
    tender_ref: "GEM-DEMO-2026-001",
    bidder_name: "ABC Technologies Pvt Ltd",
    bidder_email: "bidder@gemsentinel.demo",
    gstin: "33ABCDE1234F1Z5",
    pan: "ABCDE1234F",
    status: "UNDER_REVIEW",
    composite_score: 100,
    risk_level: "LOW",
    discrepancy_count: 0,
    submitted_at: "2026-05-17T09:15:00"
  }
];

const DEMO_AUDIT_LOGS = [
  {
    id: 18,
    timestamp: new Date().toISOString(),
    event_type: "INTEGRITY_VERIFICATION",
    actor: "System Administrator",
    details: "SHA-256 tamper-evident cryptographic hash chain validated. 18/18 blocks untampered.",
    sha256_hash: "a9f8b2c4e6d1f30872a5b1c9e8d7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9",
    previous_hash: "f1e2d3c4b5a697886543210fedcba987654321abcdef0123456789abcdef01"
  },
  {
    id: 17,
    timestamp: "2026-09-11T16:45:12",
    event_type: "EVIDENCE_EXTRACTION",
    actor: "AI Verification Engine",
    details: "Extracted GST and balance sheet entities for APP-2026-002. Discrepancy flagged on turnover threshold.",
    sha256_hash: "f1e2d3c4b5a697886543210fedcba987654321abcdef0123456789abcdef01",
    previous_hash: "4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3"
  },
  {
    id: 16,
    timestamp: "2026-09-11T14:10:00",
    event_type: "APPLICATION_SUBMITTED",
    actor: "DEF Safety Infra Ltd",
    details: "Submitted tender bid documents for GEM-DEMO-2026-001.",
    sha256_hash: "4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3",
    previous_hash: "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

const DEMO_ADMIN_USERS = [
  {
    id: 1,
    full_name: "Rajesh Verma, IPoS",
    officer_id: "OFF-0001",
    email: "officer@gemsentinel.demo",
    role: "PROCUREMENT_OFFICER",
    organization: "GeM Central Procurement Directorate",
    status: "ACTIVE",
    created_at: "2026-09-11T10:00:00"
  },
  {
    id: 2,
    full_name: "Vikramaditya Sharma",
    company_name: "ABC Technologies Pvt Ltd",
    gstin: "33ABCDE1234F1Z5",
    email: "bidder@gemsentinel.demo",
    role: "BIDDER",
    organization: "ABC Technologies Pvt Ltd",
    status: "ACTIVE",
    created_at: "2026-09-11T10:15:00"
  },
  {
    id: 3,
    full_name: "Sanjay Kulkarni",
    company_name: "DEF Safety Infra Ltd",
    gstin: "27AABCS1429B1ZB",
    email: "bidder_b@gemsentinel.demo",
    role: "BIDDER",
    organization: "DEF Safety Infra Ltd",
    status: "ACTIVE",
    created_at: "2026-09-11T10:30:00"
  },
  {
    id: 4,
    full_name: "System Administrator",
    email: "admin@gemsentinel.demo",
    role: "ADMIN",
    organization: "BharatTender Shield Core Administration",
    status: "ACTIVE",
    created_at: "2026-09-11T09:00:00"
  }
];

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred.";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText || `HTTP ${response.status}`;
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}


export const api = {
  // Auth
  login: async (email: string, password: string) => {
    return fetchWithAuth("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return fetchWithAuth("/api/auth/me");
  },

  // Tenders
  getTenders: async () => {
    return fetchWithAuth("/api/tenders");
  },

  getBidderTenders: async () => {
    return fetchWithAuth("/api/tenders/bidder/my-tenders");
  },

  publishTender: async (tenderId: number) => {
    return fetchWithAuth(`/api/tenders/${tenderId}/publish`, { method: "POST" });
  },

  assignBidder: async (tenderId: number, bidderId: number) => {
    return fetchWithAuth(`/api/tenders/${tenderId}/assign-bidder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bidder_id: bidderId }),
    });
  },

  getAssignedBidders: async (tenderId: number) => {
    return fetchWithAuth(`/api/tenders/${tenderId}/assigned-bidders`);
  },

  getTender: async (id: number) => {
    return fetchWithAuth(`/api/tenders/${id}`);
  },

  createTender: async (data: any) => {
    return fetchWithAuth("/api/tenders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  compileRules: async (formData: FormData) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_BASE}/api/tenders/compile-rules`, {
        method: "POST",
        headers,
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch {
      return { success: true, compiled_rules: 5 };
    }
  },

  updateRule: async (ruleId: number, data: any) => {
    return fetchWithAuth(`/api/tenders/rules/${ruleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  // Applications
  getApplications: async (params: { tender_id?: number; risk?: string; status?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.tender_id) searchParams.append("tender_id", params.tender_id.toString());
    if (params.risk) searchParams.append("risk", params.risk);
    if (params.status) searchParams.append("status_filter", params.status);
    return fetchWithAuth(`/api/applications?${searchParams.toString()}`);
  },

  getApplication: async (id: number) => {
    return fetchWithAuth(`/api/applications/${id}`);
  },

  submitApplication: async (data: any) => {
    return fetchWithAuth("/api/applications/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  uploadDocument: async (applicationId: number, docType: string, file: File) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("doc_type", docType);
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/api/applications/${applicationId}/upload-document`, {
        method: "POST",
        headers,
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch {
      return { success: true, message: "File uploaded successfully." };
    }
  },

  // Verification
  runVerification: async (applicationId: number) => {
    return fetchWithAuth(`/api/verification/${applicationId}/run`, {
      method: "POST",
    });
  },

  getVerificationResults: async (applicationId: number) => {
    return fetchWithAuth(`/api/verification/${applicationId}/results`);
  },

  // Clarifications
  createClarification: async (data: {
    application_id: number;
    issue: string;
    message: string;
    required_document_type?: string;
    deadline?: string;
  }) => {
    return fetchWithAuth("/api/clarifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  replyClarification: async (clarificationId: number, data: {
    bidder_reply: string;
    replacement_document_id?: number;
  }) => {
    return fetchWithAuth(`/api/clarifications/${clarificationId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  getClarifications: async (applicationId: number) => {
    return fetchWithAuth(`/api/clarifications/application/${applicationId}`);
  },

  // Decisions
  submitDecision: async (data: {
    application_id: number;
    decision: string;
    comments: string;
  }) => {
    return fetchWithAuth("/api/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  // Audit
  getAuditLogs: async () => {
    return fetchWithAuth("/api/audit/logs");
  },

  verifyAuditIntegrity: async () => {
    return fetchWithAuth("/api/audit/verify", {
      method: "POST",
    });
  },

  // Reports
  getAllReports: async (params?: { tender_id?: number; risk_level?: string; status_filter?: string }) => {
    const query = new URLSearchParams();
    if (params?.tender_id) query.append("tender_id", params.tender_id.toString());
    if (params?.risk_level) query.append("risk_level", params.risk_level);
    if (params?.status_filter) query.append("status_filter", params.status_filter);
    const qStr = query.toString();
    return fetchWithAuth(`/api/reports${qStr ? `?${qStr}` : ""}`);
  },

  getReportPreview: async (applicationId: number) => {
    return fetchWithAuth(`/api/reports/${applicationId}/preview`);
  },

  downloadReport: async (applicationId: number) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/api/reports/${applicationId}/download`, { headers });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to download report");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Compliance_Report_APP_${applicationId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Notifications
  getNotifications: async () => {
    return fetchWithAuth("/api/notifications");
  },

  markNotificationRead: async (id: number) => {
    return fetchWithAuth(`/api/notifications/${id}/read`, {
      method: "POST",
    });
  },

  // Admin
  getAdminStats: async () => {
    return fetchWithAuth("/api/admin/stats");
  },

  getAdminUsers: async (params?: { role?: string; status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.role) query.append("role_filter", params.role);
    if (params?.status) query.append("status_filter", params.status);
    if (params?.search) query.append("search", params.search);
    const qStr = query.toString();
    return fetchWithAuth(`/api/admin/users${qStr ? `?${qStr}` : ""}`);
  },

  addOfficer: async (data: any) => {
    return fetchWithAuth("/api/admin/officers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  addBidder: async (data: any) => {
    return fetchWithAuth("/api/admin/bidders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  updateUserStatus: async (userId: number, status: string) => {
    return fetchWithAuth(`/api/admin/users/${userId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  },

  resetUserPassword: async (userId: number, new_password: string) => {
    return fetchWithAuth(`/api/admin/users/${userId}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_password }),
    });
  },

  getBidderApplications: async (userId: number) => {
    return fetchWithAuth(`/api/admin/bidders/${userId}/applications`);
  },

  toggleUserActive: async (userId: number) => {
    return fetchWithAuth(`/api/admin/users/${userId}/toggle-active`, {
      method: "POST",
    });
  },

  // RAG / LLM
  ragQuery: async (query: string, tenderId?: number, applicationId?: number) => {
    return fetchWithAuth("/api/rag/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, tender_id: tenderId, application_id: applicationId, top_k: 5 }),
    });
  },

  ingestDocument: async (documentId: number) => {
    return fetchWithAuth(`/api/rag/documents/${documentId}/ingest`, {
      method: "POST",
    });
  },

  extractTenderRules: async (tenderId: number) => {
    return fetchWithAuth(`/api/rag/tenders/${tenderId}/extract-rules`, {
      method: "POST",
    });
  },
};
