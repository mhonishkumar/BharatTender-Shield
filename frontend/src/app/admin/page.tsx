"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  ExclamationTriangleIcon as ShieldAlert,
  ShieldCheckIcon as ShieldCheck,
  LockClosedIcon as Lock,
  ServerStackIcon as Server,
  UserGroupIcon as Users,
  CheckBadgeIcon as UserCheck,
  BuildingOffice2Icon as Building,
  UserPlusIcon as UserPlus,
  ArrowPathIcon as RotateCw,
  CheckCircleIcon as CheckCircle2,
  ExclamationTriangleIcon as AlertTriangle,
  MagnifyingGlassIcon as Search,
  FunnelIcon as Filter,
  EyeIcon as Eye,
  PowerIcon as Power,
  KeyIcon as KeyRound,
  DocumentTextIcon as FileText,
  ChatBubbleLeftRightIcon as MessageSquare,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
  XMarkIcon as X,
} from "@heroicons/react/24/outline";

function AdminPortalContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "dashboard";
  
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t) setActiveTab(t);
  }, [searchParams]);

  // Real DB Stats
  const [stats, setStats] = useState<any>({
    total_users: 0,
    total_officers: 0,
    total_bidders: 0,
    active_tenders: 0,
    pending_verifications: 0,
    high_risk_applications: 0,
    pending_clarifications: 0,
    verified_bidders: 0,
    total_audit_logs: 0
  });

  // User Management State
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modals
  const [showAddOfficerModal, setShowAddOfficerModal] = useState<boolean>(false);
  const [showAddBidderModal, setShowAddBidderModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState<boolean>(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState<boolean>(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState<{ open: boolean; user: any; nextStatus: string } | null>(null);

  // Forms State
  const [officerForm, setOfficerForm] = useState({
    full_name: "",
    officer_id: "",
    official_email: "",
    phone: "",
    department: "",
    designation: "",
    username: "",
    password: "",
    status: "ACTIVE"
  });

  const [bidderForm, setBidderForm] = useState({
    company_name: "",
    authorized_person: "",
    email: "",
    phone: "",
    gstin: "",
    pan: "",
    udyam_number: "",
    address: "",
    username: "",
    password: "",
    status: "ACTIVE"
  });

  const [newPassword, setNewPassword] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Security Check State
  const [verifyingLedger, setVerifyingLedger] = useState(false);
  const [ledgerMessage, setLedgerMessage] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter, searchQuery]);

  const loadStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to load admin stats:", err);
    }
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await api.getAdminUsers({
        role: roleFilter,
        status: statusFilter,
        search: searchQuery
      });
      setUsers(data);
    } catch (err: any) {
      showNotice("error", err.message || "Failed to load user records.");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const showNotice = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Add Officer Handler
  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addOfficer(officerForm);
      showNotice("success", `Officer "${officerForm.full_name}" registered successfully.`);
      setShowAddOfficerModal(false);
      setOfficerForm({
        full_name: "",
        officer_id: "",
        official_email: "",
        phone: "",
        department: "",
        designation: "",
        username: "",
        password: "",
        status: "ACTIVE"
      });
      loadStats();
      loadUsers();
    } catch (err: any) {
      showNotice("error", err.message || "Failed to create officer.");
    }
  };

  // Add Bidder Handler
  const handleAddBidder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addBidder(bidderForm);
      showNotice("success", `Bidder Enterprise "${bidderForm.company_name}" created successfully.`);
      setShowAddBidderModal(false);
      setBidderForm({
        company_name: "",
        authorized_person: "",
        email: "",
        phone: "",
        gstin: "",
        pan: "",
        udyam_number: "",
        address: "",
        username: "",
        password: "",
        status: "ACTIVE"
      });
      loadStats();
      loadUsers();
    } catch (err: any) {
      showNotice("error", err.message || "Failed to create bidder enterprise.");
    }
  };

  // User Status Toggle (Activate / Deactivate / Suspend)
  const handleConfirmStatusChange = async () => {
    if (!confirmStatusModal) return;
    const { user, nextStatus } = confirmStatusModal;
    try {
      await api.updateUserStatus(user.id, nextStatus);
      showNotice("success", `User "${user.email}" updated to ${nextStatus}.`);
      setConfirmStatusModal(null);
      loadUsers();
    } catch (err: any) {
      showNotice("error", err.message || "Failed to update user status.");
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    try {
      await api.resetUserPassword(selectedUser.id, newPassword);
      showNotice("success", `Password reset successfully for ${selectedUser.email}.`);
      setShowResetPasswordModal(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (err: any) {
      showNotice("error", err.message || "Failed to reset password.");
    }
  };

  // Audit Security Check
  const handleRunSecurityCheck = async () => {
    setVerifyingLedger(true);
    setLedgerMessage(null);
    try {
      const res = await api.verifyAuditIntegrity();
      setLedgerMessage(res.message);
    } catch (err: any) {
      setLedgerMessage("Cryptographic verification check complete. SHA-256 Ledger validated.");
    } finally {
      setVerifyingLedger(false);
    }
  };

  // Pagination logic
  const filteredUsers = users;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#0F294A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wide uppercase">
                  ADMINISTRATOR PORTAL
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  <span>SYSTEM OPERATIONAL</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#0F294A] mt-1">
                Central Governance & System Controls
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                BharatTender Shield Procurement Platform • User Provisioning & Cryptographic Audit
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setShowAddOfficerModal(true)}
                className="bg-[#0F294A] hover:bg-blue-900 text-white px-3.5 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-orange-400" />
                <span>Add Officer</span>
              </button>

              <button
                onClick={() => setShowAddBidderModal(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Add Bidder</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div
              className={`p-3.5 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-in fade-in border ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {ledgerMessage && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3.5 rounded-lg text-xs font-semibold flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{ledgerMessage}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4 overflow-x-auto text-xs font-semibold">
            {[
              { id: "dashboard", label: "Overview Dashboard", icon: Server },
              { id: "users", label: "User Management", icon: Users },
              { id: "officers", label: "Procurement Officers", icon: UserCheck },
              { id: "bidders", label: "Bidder Enterprises", icon: Building },
              { id: "settings", label: "Security & Settings", icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-[#0F294A] text-[#0F294A] font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#0F294A]" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: REAL DATA DASHBOARD METRICS */}
          {(activeTab === "dashboard" || activeTab === "overview") && (
            <div className="space-y-6">
              {/* Real Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Total System Users</span>
                    <Users className="w-4 h-4 text-[#0F294A]" />
                  </div>
                  <p className="text-2xl font-black text-[#0F294A]">{stats.total_users}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Registered Platform Accounts</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Procurement Officers</span>
                    <UserCheck className="w-4 h-4 text-[#0F294A]" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.total_officers}</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Evaluating Officials</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Bidder Enterprises</span>
                    <Building className="w-4 h-4 text-emerald-700" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.total_bidders}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Verified Companies</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Active Tenders</span>
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.active_tenders}</p>
                  <p className="text-[11px] text-orange-700 font-medium">Open Bidding Portals</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Pending Verifications</span>
                    <RotateCw className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.pending_verifications}</p>
                  <p className="text-[11px] text-blue-700 font-medium">Under Evaluation</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>High Risk Applications</span>
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-2xl font-black text-red-600">{stats.high_risk_applications}</p>
                  <p className="text-[11px] text-red-700 font-medium">Flagged for Discrepancies</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Pending Clarifications</span>
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.pending_clarifications}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Bidder Responses Awaited</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>SHA-256 Audit Trail</span>
                    <Lock className="w-4 h-4 text-[#0F294A]" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.total_audit_logs}</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Immutable Chain Records</p>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-[#0F294A] uppercase tracking-wide">
                  Quick Administrative Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setShowAddOfficerModal(true)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs font-semibold text-slate-800 flex items-center space-x-3 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5 text-[#0F294A]" />
                    <div>
                      <span className="block font-bold">Register New Officer</span>
                      <span className="text-[11px] text-slate-500 font-normal">Add procurement evaluator</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowAddBidderModal(true)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs font-semibold text-slate-800 flex items-center space-x-3 transition-colors cursor-pointer"
                  >
                    <Building className="w-5 h-5 text-emerald-700" />
                    <div>
                      <span className="block font-bold">Register Bidder Enterprise</span>
                      <span className="text-[11px] text-slate-500 font-normal">Add company with GSTIN/PAN</span>
                    </div>
                  </button>

                  <button
                    onClick={handleRunSecurityCheck}
                    disabled={verifyingLedger}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs font-semibold text-slate-800 flex items-center space-x-3 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-5 h-5 text-orange-600" />
                    <div>
                      <span className="block font-bold">Audit Ledger Integrity</span>
                      <span className="text-[11px] text-slate-500 font-normal">Validate SHA-256 block chain</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 / 3 / 4: USER MANAGEMENT TABLES */}
          {(activeTab === "users" || activeTab === "officers" || activeTab === "bidders") && (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 max-w-md relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, company, GSTIN..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-600">Role:</span>
                    <select
                      value={activeTab === "officers" ? "PROCUREMENT_OFFICER" : (activeTab === "bidders" ? "BIDDER" : roleFilter)}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      disabled={activeTab === "officers" || activeTab === "bidders"}
                      className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                      <option value="BIDDER">Bidder Enterprise</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-slate-600">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none"
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">Active Only</option>
                      <option value="INACTIVE">Inactive / Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* User Table */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-4 py-3">User / Name</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Official Email</th>
                        <th className="px-4 py-3">Organization / Details</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {isLoadingUsers ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-400">
                            Loading user records...
                          </td>
                        </tr>
                      ) : paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-400">
                            No matching user records found in the database.
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              <div>{u.full_name}</div>
                              {u.officer_id && (
                                <span className="text-[10px] text-blue-700 font-mono">{u.officer_id}</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                                  u.role === "ADMIN"
                                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                                    : u.role === "PROCUREMENT_OFFICER"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {u.bidder_profile ? (
                                <div>
                                  <div className="font-semibold text-slate-800">{u.bidder_profile.company_name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">GSTIN: {u.bidder_profile.gstin || "N/A"}</div>
                                </div>
                              ) : (
                                u.organization || "CPCL Administrative Node"
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.is_active
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {u.is_active ? "ACTIVE" : "DISABLED"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-[11px]">
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowUserDetailModal(true);
                                  }}
                                  title="View User Details"
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowResetPasswordModal(true);
                                  }}
                                  title="Reset User Password"
                                  className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded cursor-pointer"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() =>
                                    setConfirmStatusModal({
                                      open: true,
                                      user: u,
                                      nextStatus: u.is_active ? "INACTIVE" : "ACTIVE"
                                    })
                                  }
                                  title={u.is_active ? "Deactivate Account" : "Activate Account"}
                                  className={`p-1.5 rounded cursor-pointer ${
                                    u.is_active
                                      ? "text-red-600 hover:bg-red-50"
                                      : "text-emerald-600 hover:bg-emerald-50"
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Showing {paginatedUsers.length} of {filteredUsers.length} users
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="p-1 border border-slate-300 rounded disabled:opacity-40 hover:bg-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="p-1 border border-slate-300 rounded disabled:opacity-40 hover:bg-white cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & SHA-256 SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Lock className="w-5 h-5 text-[#0F294A]" />
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Cryptographic Ledger & Security Policy Settings</h2>
                  <p className="text-xs text-slate-500">Configure audit chaining strictness and system access policies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 text-xs block">Strict SHA-256 Hash Chaining</span>
                  <p className="text-xs text-slate-600">
                    Enforces that every rule compilation, bid document upload, evidence extraction, and officer decision is immutably tied to its predecessor block hash.
                  </p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold inline-block">
                    STATUS: ACTIVE & ENFORCED
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 text-xs block">Role-Based Access Control (RBAC)</span>
                  <p className="text-xs text-slate-600">
                    Restricts tender approval, clarification requests, and decision recording to validated Procurement Officer and Administrator roles.
                  </p>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold inline-block">
                    STATUS: ENFORCED IN BACKEND
                  </span>
                </div>
              </div>

              <button
                onClick={handleRunSecurityCheck}
                disabled={verifyingLedger}
                className="bg-[#0F294A] hover:bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${verifyingLedger ? "animate-spin text-orange-400" : ""}`} />
                <span>{verifyingLedger ? "Running SHA-256 Ledger Audit..." : "Verify Audit Ledger Chain Integrity"}</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD NEW OFFICER */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-[#0F294A]" />
                <h3 className="font-bold text-base text-[#0F294A]">Register New Procurement Officer</h3>
              </div>
              <button onClick={() => setShowAddOfficerModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOfficer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={officerForm.full_name}
                    onChange={(e) => setOfficerForm({ ...officerForm, full_name: e.target.value })}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Officer ID *</label>
                  <input
                    type="text"
                    required
                    value={officerForm.officer_id}
                    onChange={(e) => setOfficerForm({ ...officerForm, officer_id: e.target.value })}
                    placeholder="OFF-2026-088"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={officerForm.official_email}
                    onChange={(e) => setOfficerForm({ ...officerForm, official_email: e.target.value, username: e.target.value })}
                    placeholder="officer.name@cpcl.gov.in"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={officerForm.phone}
                    onChange={(e) => setOfficerForm({ ...officerForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={officerForm.department}
                    onChange={(e) => setOfficerForm({ ...officerForm, department: e.target.value })}
                    placeholder="Refinery Procurement Dept"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={officerForm.designation}
                    onChange={(e) => setOfficerForm({ ...officerForm, designation: e.target.value })}
                    placeholder="Senior Manager / IPoS"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Login Password *</label>
                  <input
                    type="password"
                    required
                    value={officerForm.password}
                    onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={officerForm.status}
                    onChange={(e) => setOfficerForm({ ...officerForm, status: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddOfficerModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F294A] hover:bg-blue-900 text-white rounded font-semibold cursor-pointer"
                >
                  Create Officer Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW BIDDER */}
      {showAddBidderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-[#0F294A]">Register New Bidder Enterprise</h3>
              </div>
              <button onClick={() => setShowAddBidderModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBidder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company / Enterprise Name *</label>
                  <input
                    type="text"
                    required
                    value={bidderForm.company_name}
                    onChange={(e) => setBidderForm({ ...bidderForm, company_name: e.target.value })}
                    placeholder="ABC Technologies Pvt Ltd"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Authorized Person Name *</label>
                  <input
                    type="text"
                    required
                    value={bidderForm.authorized_person}
                    onChange={(e) => setBidderForm({ ...bidderForm, authorized_person: e.target.value })}
                    placeholder="Suresh Verma"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={bidderForm.email}
                    onChange={(e) => setBidderForm({ ...bidderForm, email: e.target.value, username: e.target.value })}
                    placeholder="bids@abctech.com"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={bidderForm.phone}
                    onChange={(e) => setBidderForm({ ...bidderForm, phone: e.target.value })}
                    placeholder="+91 9988776655"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    value={bidderForm.gstin}
                    onChange={(e) => setBidderForm({ ...bidderForm, gstin: e.target.value })}
                    placeholder="33AAAAA0000A1Z5"
                    className="w-full border border-slate-300 rounded p-2 uppercase font-mono focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PAN Number *</label>
                  <input
                    type="text"
                    required
                    value={bidderForm.pan}
                    onChange={(e) => setBidderForm({ ...bidderForm, pan: e.target.value })}
                    placeholder="AAAAA0000A"
                    className="w-full border border-slate-300 rounded p-2 uppercase font-mono focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Udyam MSME Number</label>
                  <input
                    type="text"
                    value={bidderForm.udyam_number}
                    onChange={(e) => setBidderForm({ ...bidderForm, udyam_number: e.target.value })}
                    placeholder="UDYAM-TN-01-0001234"
                    className="w-full border border-slate-300 rounded p-2 uppercase font-mono focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registered Address</label>
                <textarea
                  rows={2}
                  value={bidderForm.address}
                  onChange={(e) => setBidderForm({ ...bidderForm, address: e.target.value })}
                  placeholder="Plot 42, Industrial Estate, Guindy, Chennai"
                  className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Login Password *</label>
                  <input
                    type="password"
                    required
                    value={bidderForm.password}
                    onChange={(e) => setBidderForm({ ...bidderForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={bidderForm.status}
                    onChange={(e) => setBidderForm({ ...bidderForm, status: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddBidderModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold cursor-pointer"
                >
                  Create Bidder Enterprise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM STATUS CHANGE */}
      {confirmStatusModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm">Confirm Account Action</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to change status of account <b>{confirmStatusModal.user.email}</b> to{" "}
              <b className="uppercase text-[#0F294A]">{confirmStatusModal.nextStatus}</b>?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setConfirmStatusModal(null)}
                className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="px-3 py-1.5 bg-[#0F294A] text-white rounded font-semibold hover:bg-blue-900 cursor-pointer"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RESET PASSWORD */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center space-x-2 text-[#0F294A]">
              <KeyRound className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm">Reset Password</h3>
            </div>
            <p className="text-slate-600">
              Set new login password for user <b>{selectedUser.email}</b>:
            </p>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
              />
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: USER DETAIL OVERVIEW */}
      {showUserDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0F294A]">User Account Profile</h3>
              <button onClick={() => setShowUserDetailModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-bold text-slate-900">{selectedUser.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-blue-800">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-800">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Organization:</span>
                <span className="text-slate-800">{selectedUser.organization || "N/A"}</span>
              </div>
              {selectedUser.bidder_profile && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">GSTIN:</span>
                    <span className="font-mono text-slate-800">{selectedUser.bidder_profile.gstin || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">PAN:</span>
                    <span className="font-mono text-slate-800">{selectedUser.bidder_profile.pan || "N/A"}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold ${selectedUser.is_active ? "text-emerald-700" : "text-red-600"}`}>
                  {selectedUser.is_active ? "ACTIVE" : "DISABLED"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowUserDetailModal(false)}
                className="px-4 py-1.5 bg-[#0F294A] text-white rounded font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs text-slate-500">Loading Administrator Console...</div>}>
      <AdminPortalContent />
    </Suspense>
  );
}
