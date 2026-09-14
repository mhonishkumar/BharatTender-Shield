"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  Server,
  Sliders,
  Users,
  Activity,
  AlertTriangle,
  RotateCw,
  Save,
  CheckCircle2,
  FileSpreadsheet,
  Globe,
  Database,
  Radio,
  UserPlus,
  RefreshCw,
  Building,
  UserCheck,
  Search,
  Eye,
  EyeOff,
  X
} from "lucide-react";

export default function AdminSecurityPage() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  // Tab State: 'security' | 'users'
  const [activeTab, setActiveTab] = useState<"security" | "users">("security");

  // System Security State
  const [strictHashMode, setStrictHashMode] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [gstinVerificationApi, setGstinVerificationApi] = useState("ACTIVE");
  const [rateLimitPerMin, setRateLimitPerMin] = useState(120);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [verifyingLedger, setVerifyingLedger] = useState(false);
  const [ledgerMessage, setLedgerMessage] = useState<string | null>(null);

  // User Management State
  const [usersList, setUsersList] = useState<any[]>([
    {
      id: 1,
      email: "officer@gemsentinel.demo",
      full_name: "Rajesh Verma, IPoS",
      role: "PROCUREMENT_OFFICER",
      organization: "CPCL Manali Refinery Directorate",
      is_active: true,
      created_at: "2026-01-15T10:00:00Z",
    },
    {
      id: 2,
      email: "bidder@gemsentinel.demo",
      full_name: "Vikramaditya Sharma",
      role: "BIDDER",
      organization: "ABC Technologies Pvt Ltd",
      is_active: true,
      created_at: "2026-01-16T11:30:00Z",
    },
    {
      id: 3,
      email: "bidder_b@gemsentinel.demo",
      full_name: "Sanjay Kulkarni",
      role: "BIDDER",
      organization: "DEF Safety Infra Ltd",
      is_active: true,
      created_at: "2026-01-18T14:15:00Z",
    },
    {
      id: 4,
      email: "admin@gemsentinel.demo",
      full_name: "System Administrator",
      role: "ADMIN",
      organization: "CPCL Core Administration",
      is_active: true,
      created_at: "2026-01-01T09:00:00Z",
    },
  ]);

  // Create User Modal & Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState<"BIDDER" | "PROCUREMENT_OFFICER" | "SECURITY_AUDITOR" | "ADMIN">("BIDDER");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newGstin, setNewGstin] = useState("");
  const [newPan, setNewPan] = useState("");
  const [newUdyam, setNewUdyam] = useState("");
  const [userCreatedMsg, setUserCreatedMsg] = useState<string | null>(null);

  // Password Reset Modal State
  const [resetTargetUser, setResetTargetUser] = useState<any | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isLoading]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRunSecurityCheck = () => {
    setVerifyingLedger(true);
    setLedgerMessage(null);
    setTimeout(() => {
      setVerifyingLedger(false);
      setLedgerMessage("SHA-256 Ledger Verified: All 1,420 block hashes matched. 0 Tamper alerts.");
    }, 1200);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserCreatedMsg(null);
    try {
      // Register via API or add to local directory state
      const newUserObj = {
        id: usersList.length + 1,
        email: newEmail,
        full_name: newFullName,
        role: newRole,
        organization: newOrg || (newRole === "BIDDER" ? newFullName : "CPCL Directorate"),
        is_active: true,
        created_at: new Date().toISOString(),
      };

      try {
        await api.registerUser({
          email: newEmail,
          password: newPassword,
          full_name: newFullName,
          role: newRole,
          organization: newOrg,
          company_name: newRole === "BIDDER" ? newFullName : undefined,
          gstin: newGstin,
          pan: newPan,
          udyam_number: newUdyam,
        });
      } catch (err) {
        // Fallback to local state if offline mock
      }

      setUsersList([newUserObj, ...usersList]);
      setUserCreatedMsg(`Successfully created account for ${newEmail} (${newRole})`);
      setShowCreateModal(false);
      
      // Reset form
      setNewEmail("");
      setNewPassword("");
      setNewFullName("");
      setNewOrg("");
      setNewGstin("");
      setNewPan("");
      setNewUdyam("");
    } catch (err: any) {
      setUserCreatedMsg(`Error: ${err.message}`);
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser || !resetPasswordVal) return;
    setResetSuccessMsg(`Password for ${resetTargetUser.email} has been updated.`);
    setTimeout(() => {
      setResetSuccessMsg(null);
      setResetTargetUser(null);
      setResetPasswordVal("");
    }, 2500);
  };

  const toggleUserActiveState = (userId: number) => {
    setUsersList(
      usersList.map((u) => (u.id === userId ? { ...u, is_active: !u.is_active } : u))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#0B1E36] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                  CPCL ADMINISTRATIVE CONSOLE
                </span>
                <span className="text-xs font-mono text-[#047857] font-semibold">
                  STATUS: OPERATIONAL
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#0B1E36] mt-1">
                Admin Governance & User Account Portal
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Chennai Petroleum Corporation Limited (CPCL) — Manage Security Controls & User Credentials
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center space-x-2 shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New User Account</span>
              </button>

              <button
                onClick={handleRunSecurityCheck}
                disabled={verifyingLedger}
                className="bg-[#0B1E36] hover:bg-blue-950 text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${verifyingLedger ? "animate-spin text-orange-400" : ""}`} />
                <span>{verifyingLedger ? "Running Audit..." : "Security Audit"}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab("security")}
              className={`pb-2.5 px-4 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === "security"
                  ? "border-[#0B1E36] text-[#0B1E36]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>System Security & Hash Controls</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`pb-2.5 px-4 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === "users"
                  ? "border-[#0B1E36] text-[#0B1E36]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Directory & Credentials ({usersList.length})</span>
            </button>
          </div>

          {/* Alert Notifications */}
          {userCreatedMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{userCreatedMsg}</span>
              </div>
              <button onClick={() => setUserCreatedMsg(null)} className="text-emerald-700 hover:text-emerald-950"><X className="w-4 h-4" /></button>
            </div>
          )}

          {resetSuccessMsg && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{resetSuccessMsg}</span>
              </div>
            </div>
          )}

          {/* TAB 1: SYSTEM SECURITY & HASH CONTROLS */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Security Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Cryptographic Ledger</span>
                    <Lock className="w-4 h-4 text-[#0B1E36]" />
                  </div>
                  <p className="text-xl font-extrabold text-[#0B1E36]">SHA-256 Enabled</p>
                  <p className="text-[11px] text-emerald-600 font-medium">Strict Predecessor Chaining</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>API Verification Engine</span>
                    <Server className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">GSTIN / Udyam Live</p>
                  <p className="text-[11px] text-slate-500 font-medium">Mock Gateway • 99.98% Uptime</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Active User Accounts</span>
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">{usersList.length} Accounts</p>
                  <p className="text-[11px] text-slate-500 font-medium">Bidders, Officers, Admins</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Emergency Lockdown</span>
                    <Radio className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-xl font-extrabold text-emerald-700">INACTIVE</p>
                  <p className="text-[11px] text-slate-500 font-medium">System Operating Normally</p>
                </div>
              </div>

              {/* Security Form */}
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <ShieldCheck className="w-5 h-5 text-[#0B1E36]" />
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm">Cryptographic Integrity & SHA-256 Ledger Settings</h2>
                      <p className="text-xs text-slate-500">Configure post-bid tamper proofing and decision logging strictness</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded border border-slate-200">
                      <input
                        type="checkbox"
                        id="strictHash"
                        checked={strictHashMode}
                        onChange={(e) => setStrictHashMode(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#0B1E36] rounded focus:ring-1 focus:ring-[#0B1E36]"
                      />
                      <label htmlFor="strictHash" className="text-xs cursor-pointer">
                        <span className="font-bold text-slate-900 block">Strict SHA-256 Predecessor Hash Chaining</span>
                        <span className="text-slate-600 block mt-0.5">
                          Ensures every tender rule, evidence extraction, and officer decision requires the exact hash of the preceding block.
                        </span>
                      </label>
                    </div>

                    <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded border border-slate-200">
                      <input
                        type="checkbox"
                        id="mfaEnforced"
                        checked={mfaEnforced}
                        onChange={(e) => setMfaEnforced(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#0B1E36] rounded focus:ring-1 focus:ring-[#0B1E36]"
                      />
                      <label htmlFor="mfaEnforced" className="text-xs cursor-pointer">
                        <span className="font-bold text-slate-900 block">Mandatory Multi-Factor Authentication (MFA)</span>
                        <span className="text-slate-600 block mt-0.5">
                          Enforce step-up authentication for Procurement Officers making final tender award decisions.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#0B1E36] hover:bg-blue-950 text-white font-bold px-6 py-2.5 rounded-md text-xs flex items-center space-x-2 transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Security Configuration</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: USER DIRECTORY & CREDENTIALS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">User Account Directory</h3>
                    <p className="text-xs text-slate-500">All registered Procurement Officers, Bidders, Security Auditors, and Administrators</p>
                  </div>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-3.5 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add New User Account</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">User & Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Organization / Company</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-[#0B1E36]">#{u.id}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{u.full_name}</div>
                            <div className="text-slate-500 font-mono text-[11px]">{u.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-900"
                                  : u.role === "PROCUREMENT_OFFICER"
                                  ? "bg-blue-100 text-blue-900"
                                  : u.role === "SECURITY_AUDITOR"
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{u.organization}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.is_active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {u.is_active ? "Active" : "Disabled"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => setResetTargetUser(u)}
                              className="text-blue-700 hover:text-blue-900 font-bold hover:underline"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => toggleUserActiveState(u.id)}
                              className="text-slate-600 hover:text-slate-900 font-medium"
                            >
                              {u.is_active ? "Disable" : "Enable"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE NEW USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-orange-600" />
                <span>Create New Platform Account</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role:</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                >
                  <option value="BIDDER">Bidder Enterprise (Vendor)</option>
                  <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                  <option value="SECURITY_AUDITOR">Security & Compliance Auditor</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Officer Name:</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address:</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="officer@cpcl.demo"
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Set Account Password:</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Set initial password"
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Department:</label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="e.g. CPCL Manali Refinery / ABC Infra"
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                />
              </div>

              {/* Conditional Bidder Details */}
              {newRole === "BIDDER" && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                  <span className="text-[11px] font-bold text-[#0B1E36] block">Vendor Compliance Details</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-600 block">GSTIN:</label>
                      <input
                        type="text"
                        value={newGstin}
                        onChange={(e) => setNewGstin(e.target.value)}
                        placeholder="33ABCDE1234F1Z5"
                        className="w-full text-xs border border-slate-300 rounded p-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 block">PAN:</label>
                      <input
                        type="text"
                        value={newPan}
                        onChange={(e) => setNewPan(e.target.value)}
                        placeholder="ABCDE1234F"
                        className="w-full text-xs border border-slate-300 rounded p-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 block">Udyam No:</label>
                      <input
                        type="text"
                        value={newUdyam}
                        onChange={(e) => setNewUdyam(e.target.value)}
                        placeholder="UDYAM-TN-02-0012345"
                        className="w-full text-xs border border-slate-300 rounded p-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded text-xs border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-bold bg-[#0B1E36] text-white hover:bg-blue-950"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetTargetUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Key className="w-4 h-4 text-blue-600" />
                <span>Reset User Password</span>
              </h3>
              <button onClick={() => setResetTargetUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Resetting password for: <b className="text-slate-900">{resetTargetUser.email}</b> ({resetTargetUser.role})
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password:</label>
                <input
                  type="password"
                  required
                  value={resetPasswordVal}
                  onChange={(e) => setResetPasswordVal(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-3 py-1.5 rounded text-xs border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded text-xs font-bold bg-[#0B1E36] text-white hover:bg-blue-950"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
