"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SIHDemoBar } from "@/components/SIHDemoBar";
import {
  FileText, Clock, CheckCircle2, AlertTriangle, XCircle,
  ArrowRight, Shield, Eye, PlusCircle, FileCheck, Building,
  Upload, Layers, Users, ExternalLink, ChevronRight, Zap,
  BarChart2, History, UserPlus, Star, Bell, TrendingUp,
  CalendarDays, IndianRupee, FileWarning, Lock,
} from "lucide-react";

// ─── Static quick-launch cards ────────────────────────────────────────────────
const QUICK_ACTIONS_OFFICER = [
  { label: "Create Tender", href: "/officer/tenders?create=true", icon: PlusCircle, color: "bg-[#0F294A] text-white", desc: "Publish a new procurement notice" },
  { label: "Verify Bidder", href: "/officer/verification/2", icon: Shield, color: "bg-orange-600 text-white", desc: "Run AI compliance check" },
  { label: "View Reports", href: "/reports/2", icon: BarChart2, color: "bg-emerald-700 text-white", desc: "Download PDF reports" },
  { label: "Audit Trail", href: "/audit", icon: History, color: "bg-slate-700 text-white", desc: "SHA-256 hash chain logs" },
];

const QUICK_ACTIONS_BIDDER = [
  { label: "Apply for Tender", href: "/bidder/apply", icon: PlusCircle, color: "bg-[#0F294A] text-white", desc: "Submit a new bid" },
  { label: "My Documents", href: "/bidder/verification#documents", icon: Upload, color: "bg-blue-600 text-white", desc: "Upload compliance docs" },
  { label: "Verification", href: "/bidder/verification", icon: Shield, color: "bg-emerald-700 text-white", desc: "View AI score" },
  { label: "Clarifications", href: "/bidder/clarifications", icon: Bell, color: "bg-orange-600 text-white", desc: "Respond to officer queries" },
];

const ANNOUNCEMENTS = [
  { id: 1, tag: "New", color: "bg-emerald-100 text-emerald-800", title: "GeM FY 2026-27 Tenders Now Open", desc: "New procurement cycle is live. All registered bidders may now apply for open tenders.", date: "14 Sep 2026" },
  { id: 2, tag: "Notice", color: "bg-blue-100 text-blue-800", title: "Mandatory Udyam Re-verification", desc: "All MSME bidders must re-verify Udyam Registration before 30 Sep 2026.", date: "10 Sep 2026" },
  { id: 3, tag: "Alert", color: "bg-red-100 text-red-800", title: "GST Compliance Deadline", desc: "Bidders with pending GST filings will be flagged HIGH RISK automatically.", date: "05 Sep 2026" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { role, user, isLoading } = useAuth();
  const router = useRouter();

  const [tenders, setTenders] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    active_tenders: 24,
    pending_reviews: 17,
    verified_bidders: 138,
    high_risk_bidders: 6,
    total_audit_logs: 5,
  });
  const [loadingData, setLoadingData] = useState(true);
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) { router.push("/login"); return; }
    if (user) loadDashboardData();
  }, [user, isLoading]);

  // Rotate announcements every 4s
  useEffect(() => {
    const t = setInterval(() => setActiveAnnouncement((p) => (p + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [tendersData, appsData] = await Promise.all([api.getTenders(), api.getApplications()]);
      setTenders(tendersData);
      setApplications(appsData);
      if (role === "PROCUREMENT_OFFICER" || role === "ADMIN") {
        try {
          const s = await api.getAdminStats();
          setStats((prev: any) => ({ ...prev, ...s }));
        } catch { /* fallback */ }
      }
    } catch { /* ignore */ } finally { setLoadingData(false); }
  };

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#0F294A] border-t-[#FF9933] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading BharatTender Shield...</p>
        </div>
      </div>
    );
  }

  const quickActions = role === "BIDDER" ? QUICK_ACTIONS_BIDDER : QUICK_ACTIONS_OFFICER;

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
      <SIHDemoBar />
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-5 lg:p-6 space-y-6 overflow-x-hidden">

          {/* ══════════════════════════════════════════════════════════════════
              ANNOUNCEMENT BANNER (all roles)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="relative bg-[#0F294A] rounded-xl overflow-hidden shadow-md">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }} />

            <div className="relative flex flex-col md:flex-row md:items-center gap-4 p-5">
              {/* Left: Announcement carousel */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ANNOUNCEMENTS[activeAnnouncement].color}`}>
                    {ANNOUNCEMENTS[activeAnnouncement].tag}
                  </span>
                  <span className="text-[10px] text-slate-400">{ANNOUNCEMENTS[activeAnnouncement].date}</span>
                </div>
                <h2 className="text-white font-bold text-base leading-snug">
                  {ANNOUNCEMENTS[activeAnnouncement].title}
                </h2>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  {ANNOUNCEMENTS[activeAnnouncement].desc}
                </p>
                {/* Dots */}
                <div className="flex items-center space-x-1.5 mt-3">
                  {ANNOUNCEMENTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveAnnouncement(i)}
                      className={`rounded-full transition-all ${i === activeAnnouncement ? "w-4 h-1.5 bg-[#FF9933]" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Featured Tender CTA */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 md:w-64 flex-shrink-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-[#FF9933] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    FEATURED
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">GEM-DEMO-2026-001</span>
                </div>
                <p className="text-white text-xs font-semibold leading-snug mb-1">
                  Supply of Industrial Safety Equipment & Protective Gear
                </p>
                <div className="flex items-center space-x-1 text-[10px] text-slate-300 mb-3">
                  <CalendarDays className="w-3 h-3" />
                  <span>Closes: 10 Jun 2026</span>
                  <span className="mx-1">•</span>
                  <IndianRupee className="w-3 h-3" />
                  <span>Min ₹50L Turnover</span>
                </div>
                <div className="flex flex-col space-y-1.5">
                  {role === "BIDDER" ? (
                    <Link href="/bidder/apply" className="bg-[#FF9933] hover:bg-orange-400 text-white text-[11px] font-bold px-3 py-1.5 rounded text-center transition-colors">
                      Apply Now →
                    </Link>
                  ) : (
                    <>
                      <Link href="/officer/verification/2" className="bg-[#FF9933] hover:bg-orange-400 text-white text-[11px] font-bold px-3 py-1.5 rounded text-center transition-colors">
                        Inspect Bidder B →
                      </Link>
                      <Link href="/officer/verification/1" className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium px-3 py-1.5 rounded text-center transition-colors">
                        Bidder A (Compliant)
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              PROCUREMENT OFFICER VIEW
              ══════════════════════════════════════════════════════════════════ */}
          {role === "PROCUREMENT_OFFICER" && (
            <div className="space-y-6">
              {/* Page title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-[#0F294A]">Procurement Dashboard</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Welcome back, <strong>{user.full_name}</strong>. Monitor tender compliance and bidder verification.
                  </p>
                </div>
                <Link
                  href="/officer/tenders?create=true"
                  className="inline-flex items-center space-x-1.5 bg-[#0F294A] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Tender</span>
                </Link>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Tenders", value: stats.active_tenders, sub: "8 open today", icon: FileText, iconBg: "bg-blue-50", iconColor: "text-[#0F294A]", valueColor: "text-[#0F294A]", trend: "+3" },
                  { label: "Pending Reviews", value: stats.pending_reviews, sub: "Awaiting action", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600", valueColor: "text-amber-600", trend: "-2" },
                  { label: "Verified Bidders", value: stats.verified_bidders, sub: "92% Compliance", icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", valueColor: "text-emerald-700", trend: "+12" },
                  { label: "High Risk", value: stats.high_risk_bidders, sub: "Immediate review", icon: AlertTriangle, iconBg: "bg-red-50", iconColor: "text-red-600", valueColor: "text-red-600", trend: "+1" },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs card-lift">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                        <span className={`p-1.5 rounded-lg ${card.iconBg}`}>
                          <Icon className={`w-4 h-4 ${card.iconColor}`} />
                        </span>
                      </div>
                      <div className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-slate-400">{card.sub}</span>
                        <span className={`text-[10px] font-semibold flex items-center space-x-0.5 ${card.trend.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                          <TrendingUp className="w-3 h-3" />
                          <span>{card.trend}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Launch Actions */}
              <div>
                <h2 className="text-sm font-bold text-[#0F294A] mb-3 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#FF9933]" />
                  <span>Quick Launch</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((qa) => {
                    const Icon = qa.icon;
                    return (
                      <Link key={qa.label} href={qa.href} className={`${qa.color} rounded-xl p-4 flex flex-col space-y-2 card-lift shadow-sm`}>
                        <Icon className="w-6 h-6 opacity-90" />
                        <div>
                          <div className="text-xs font-bold">{qa.label}</div>
                          <div className="text-[10px] opacity-75 leading-snug">{qa.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Two-column row: Recent Tenders + New Users Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Recent Tenders List */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F294A]">Active Tenders</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Latest procurement notices</p>
                    </div>
                    <Link href="/officer/tenders" className="text-xs text-blue-700 font-semibold hover:underline flex items-center space-x-1">
                      <span>View all</span><ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {tenders.length === 0 ? (
                      /* empty state */
                      [
                        { ref: "GEM-DEMO-2026-001", title: "Supply of Industrial Safety Equipment", status: "Open", deadline: "10 Jun 2026", apps: 2 },
                        { ref: "GEM-DEMO-2026-002", title: "Procurement of IT Infrastructure Hardware", status: "Open", deadline: "25 Jun 2026", apps: 0 },
                        { ref: "GEM-DEMO-2026-003", title: "Annual Maintenance of Office Equipment", status: "Draft", deadline: "—", apps: 0 },
                      ].map((t) => (
                        <div key={t.ref} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/70 transition-colors">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800 truncate">{t.title}</div>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-[10px] font-mono text-slate-400">{t.ref}</span>
                              <span className="text-[10px] text-slate-400">•</span>
                              <span className="text-[10px] text-slate-400">Due: {t.deadline}</span>
                              <span className="text-[10px] text-slate-400">•</span>
                              <span className="text-[10px] text-slate-400">{t.apps} application{t.apps !== 1 ? "s" : ""}</span>
                            </div>
                          </div>
                          <span className={`ml-3 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === "Open" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                            {t.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      tenders.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/70 transition-colors">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800 truncate">{t.title}</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{t.tender_ref}</div>
                          </div>
                          <span className={`ml-3 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${t.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                            {t.is_active ? "Open" : "Closed"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* New Users / Onboarding Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4 text-[#0F294A]" />
                      <h3 className="text-sm font-bold text-[#0F294A]">New Users Guide</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Step-by-step for first-time users</p>
                  </div>
                  <div className="flex-1 px-5 py-4 space-y-3">
                    {[
                      { step: "1", title: "Login as Officer", desc: "Use demo credentials or click Quick Login below.", icon: Lock, color: "text-[#0F294A] bg-blue-50" },
                      { step: "2", title: "Open Featured Tender", desc: "View GEM-DEMO-2026-001 compliance rules.", icon: FileText, color: "text-orange-600 bg-orange-50" },
                      { step: "3", title: "Run AI Verification", desc: "Select Bidder B and run multi-stage pipeline.", icon: Shield, color: "text-emerald-700 bg-emerald-50" },
                      { step: "4", title: "Download Report", desc: "Export SHA-256 tamper-evident PDF report.", icon: FileCheck, color: "text-purple-700 bg-purple-50" },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.step} className="flex items-start space-x-3">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">{s.title}</div>
                            <div className="text-[11px] text-slate-500 leading-snug">{s.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-5 pb-4">
                    <Link href="/officer/verification/2" className="block w-full text-center bg-[#0F294A] text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-900 transition-colors">
                      Start Live Demo →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Applications Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F294A]">Recent Tender Applications</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Evaluate AI compliance assessments and render decisions.
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    {applications.length} submissions
                  </span>
                </div>

                {applications.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileWarning className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400">No applications yet</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">
                      Applications will appear here once bidders submit their bids.
                    </p>
                    <Link href="/officer/tenders?create=true" className="inline-flex items-center space-x-1.5 bg-[#0F294A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-900 transition-colors">
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Create a Tender</span>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                        <tr>
                          <th className="px-5 py-3">Bidder Enterprise</th>
                          <th className="px-5 py-3">Tender Ref</th>
                          <th className="px-5 py-3">Score</th>
                          <th className="px-5 py-3">Risk</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {applications.map((app) => {
                          const isHigh = app.risk_level === "HIGH";
                          const isLow = app.risk_level === "LOW";
                          return (
                            <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="font-semibold text-slate-800">{app.submitted_company_name}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  {app.application_ref} • GSTIN: {app.submitted_gstin || "N/A"}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 font-mono text-slate-600 text-[11px]">
                                {app.tender?.tender_ref || "GEM-DEMO-2026-001"}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="font-bold text-[#0F294A] text-sm">{app.compliance_score}</span>
                                <span className="text-slate-400 text-[10px]"> /100</span>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isLow ? "bg-emerald-100 text-emerald-800" : isHigh ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                                  {app.risk_level}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-slate-600 font-medium text-[11px]">{app.status}</span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <Link
                                  href={`/officer/verification/${app.id}`}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#0F294A] hover:bg-blue-900 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Verify & Decide</span>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              BIDDER VIEW
              ══════════════════════════════════════════════════════════════════ */}
          {role === "BIDDER" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Bidder Portal
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-[#0F294A]">
                    Welcome, {user.organization || user.full_name}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track your bids, review compliance scores and respond to clarifications.
                  </p>
                </div>
                <Link
                  href="/bidder/apply"
                  className="inline-flex items-center space-x-1.5 bg-[#0F294A] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Apply for Tender</span>
                </Link>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((qa) => {
                  const Icon = qa.icon;
                  return (
                    <Link key={qa.label} href={qa.href} className={`${qa.color} rounded-xl p-4 flex flex-col space-y-2 card-lift shadow-sm`}>
                      <Icon className="w-6 h-6 opacity-90" />
                      <div>
                        <div className="text-xs font-bold">{qa.label}</div>
                        <div className="text-[10px] opacity-75 leading-snug">{qa.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Status stepper */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Current Application</span>
                    <h3 className="text-sm font-bold text-[#0F294A]">
                      GEM-DEMO-2026-001 — Industrial Safety Equipment
                    </h3>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
                    Verification In Progress
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1">
                  {[
                    { label: "Application", sub: "Completed", done: true },
                    { label: "Documents", sub: "Submitted", done: true },
                    { label: "Verification", sub: "Under Review", active: true },
                    { label: "Decision", sub: "Pending Officer", pending: true },
                  ].map((step, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto text-sm font-bold border-2 ${
                        step.done ? "bg-emerald-600 border-emerald-600 text-white" :
                        step.active ? "bg-[#0F294A] border-[#0F294A] text-white animate-pulse" :
                        "bg-white border-slate-300 text-slate-400"
                      }`}>
                        {step.done ? "✓" : step.active ? "●" : "○"}
                      </div>
                      <div className={`font-semibold ${step.active ? "text-[#0F294A]" : step.pending ? "text-slate-400" : "text-slate-700"}`}>
                        {step.label}
                      </div>
                      <div className={`text-[10px] ${step.active ? "text-blue-600 font-medium" : "text-slate-400"}`}>{step.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action alerts */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0F294A] flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span>Action Required</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
                        <span>⚠️ Udyam Registration Discrepancy</span>
                        <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded-full">Action Required</span>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        The GSTIN in your uploaded Udyam Certificate does not match the GSTIN in your application form.
                      </p>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      <Link href="/bidder/verification" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs">
                        View Details
                      </Link>
                      <Link href="/bidder/clarifications" className="bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                        Upload Corrected Doc
                      </Link>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-red-900 mb-2">
                        <span>✕ Turnover Certificate Missing</span>
                        <span className="text-[10px] bg-red-200 px-1.5 py-0.5 rounded-full">Mandatory</span>
                      </div>
                      <p className="text-xs text-red-800 leading-relaxed">
                        CA Certified Turnover Certificate verifying minimum ₹50 Lakh annual turnover is not attached.
                      </p>
                    </div>
                    <div className="mt-3">
                      <Link href="/bidder/verification#documents" className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Document</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats mini cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs card-lift">
                  <span className="text-[11px] text-slate-500 font-medium block">Compliance Score</span>
                  <div className="text-2xl font-bold text-[#0F294A] mt-1">
                    {applications[0]?.compliance_score || 59}<span className="text-sm text-slate-400 font-normal"> /100</span>
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold mt-1 block">AI-Assisted Assessment</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs card-lift">
                  <span className="text-[11px] text-slate-500 font-medium block">Submitted Documents</span>
                  <div className="text-2xl font-bold text-slate-800 mt-1">
                    {applications[0]?.documents?.length || 3}<span className="text-sm text-slate-400 font-normal"> /4</span>
                  </div>
                  <span className="text-[10px] text-red-600 font-semibold mt-1 block">1 document missing</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs card-lift">
                  <span className="text-[11px] text-slate-500 font-medium block">Open Clarifications</span>
                  <div className="text-2xl font-bold text-orange-600 mt-1">
                    {applications[0]?.clarifications?.length || 1}
                  </div>
                  <Link href="/bidder/clarifications" className="text-[10px] text-blue-700 font-semibold hover:underline mt-1 block">
                    Respond now →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              ADMIN VIEW
              ══════════════════════════════════════════════════════════════════ */}
          {role === "ADMIN" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-[#0F294A]">System Administration Console</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage users, health monitoring, verification engine and cryptographic audit logs.
                </p>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Users", value: "4", sub: "Officers, Bidders, Admin", icon: Users, color: "text-[#0F294A]", bg: "bg-blue-50" },
                  { label: "Audit Records", value: String(stats.total_audit_logs || 5), sub: "SHA-256 Hash Chained", icon: History, color: "text-emerald-700", bg: "bg-emerald-50" },
                  { label: "Verification Mode", value: "Live", sub: "Deterministic + AI", icon: Zap, color: "text-purple-700", bg: "bg-purple-50" },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs card-lift">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">{c.label}</span>
                        <span className={`p-1.5 rounded-lg ${c.bg}`}><Icon className={`w-4 h-4 ${c.color}`} /></span>
                      </div>
                      <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{c.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Users table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-[#0F294A]">Platform Users</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">All registered demo accounts and their roles</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-5 py-3 text-left">User</th>
                        <th className="px-5 py-3 text-left">Email</th>
                        <th className="px-5 py-3 text-left">Role</th>
                        <th className="px-5 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: "Rajesh Verma", email: "officer@gemsentinel.demo", role: "PROCUREMENT_OFFICER", status: "Active" },
                        { name: "ABC Technologies Pvt Ltd", email: "bidder@gemsentinel.demo", role: "BIDDER", status: "Active" },
                        { name: "DEF Safety Infra Ltd", email: "bidder_b@gemsentinel.demo", role: "BIDDER", status: "High Risk" },
                        { name: "System Administrator", email: "admin@gemsentinel.demo", role: "ADMIN", status: "Active" },
                      ].map((u) => (
                        <tr key={u.email} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-slate-800">{u.name}</td>
                          <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{u.email}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              u.role === "ADMIN" ? "bg-purple-100 text-purple-800" :
                              u.role === "PROCUREMENT_OFFICER" ? "bg-blue-100 text-blue-800" :
                              "bg-emerald-100 text-emerald-800"
                            }`}>
                              {u.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-[#0F294A] mb-3">Platform Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Link href="/audit" className="px-4 py-2 bg-[#0F294A] text-white rounded-lg text-xs font-semibold hover:bg-blue-900 transition-colors shadow-xs">
                    View Cryptographic Audit Trail
                  </Link>
                  <Link href="/officer/verification/2" className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-200 border border-slate-200 transition-colors">
                    Test Verification Engine
                  </Link>
                  <Link href="/officer/tenders?create=true" className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 transition-colors">
                    Create Tender
                  </Link>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
