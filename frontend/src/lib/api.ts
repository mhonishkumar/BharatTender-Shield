const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

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
      errorDetail = response.statusText || `${response.status}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
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

  demoLogin: async (role: "officer" | "bidder" | "bidder_b" | "admin") => {
    return fetchWithAuth(`/api/auth/demo-login/${role}`, {
      method: "POST",
    });
  },

  getMe: async () => {
    return fetchWithAuth("/api/auth/me");
  },

  // Tenders
  getTenders: async () => {
    return fetchWithAuth("/api/tenders");
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
    const res = await fetch(`${API_BASE}/api/tenders/compile-rules`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
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

    const res = await fetch(`${API_BASE}/api/applications/${applicationId}/upload-document`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
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
  getReportPreview: async (applicationId: number) => {
    return fetchWithAuth(`/api/reports/${applicationId}/preview`);
  },

  getReportDownloadUrl: (applicationId: number) => {
    return `${API_BASE}/api/reports/${applicationId}/download`;
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

  getAdminUsers: async () => {
    return fetchWithAuth("/api/admin/users");
  },

  toggleUserActive: async (userId: number) => {
    return fetchWithAuth(`/api/admin/users/${userId}/toggle-active`, {
      method: "POST",
    });
  },
};
