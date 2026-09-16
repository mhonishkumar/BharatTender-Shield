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
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Shield,
  Eye,
  PlusCircle,
  FileCheck,
  Building,
  Upload,
  Layers,
  Users
} from "lucide-react";

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
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      loadDashboardData();
    }
  }, [user, isLoading]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      if (role === "BIDDER") {
        const [tendersData, appsData] = await Promise.all([
          api.getBidderTenders(),
          api.getApplications(), // backend filters automatically by bidder_id if BIDDER
        ]);
        setTenders(tendersData);
        setApplications(appsData);
      } else {
        const [tendersData, appsData] = await Promise.all([
          api.getTenders(),
          api.getApplications(),
        ]);
        setTenders(tendersData);
        setApplications(appsData);

        if (role === "PROCUREMENT_OFFICER" || role === "ADMIN") {
          try {
            const statsData = await api.getAdminStats();
            setStats({
              active_tenders: 0,
              pending_reviews: 0,
              verified_bidders: 0,
              high_risk_bidders: 0,
              ...statsData,
            });
          } catch {
            // fallback
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };


  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#0F294A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading BharatTender Shield...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <SIHDemoBar />
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* ========================================================
              ROLE 1: PROCUREMENT OFFICER DASHBOARD
              ======================================================== */}
          {role === "PROCUREMENT_OFFICER" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#0F294A]">
                    Procurement Dashboard
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Monitor tender compliance, bidder verification and pending procurement reviews.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href="/officer/tenders?create=true"
                    className="bg-[#0F294A] hover:bg-blue-900 text-white px-3.5 py-2 rounded-md text-xs font-medium flex items-center space-x-1.5 shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Tender</span>
                  </Link>
                </div>
              </div>

              {/* Metrics Cards: Clean white cards with subtle borders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Active Tenders</span>
                    <span className="p-1.5 bg-blue-50 text-[#0F294A] rounded">
                      <FileText className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-[#0F294A]">{stats.active_tenders}</span>
                    <span className="text-[11px] text-emerald-600 font-medium">8 Open today</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Pending Reviews</span>
                    <span className="p-1.5 bg-amber-50 text-amber-600 rounded">
                      <Clock className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-amber-600">{stats.pending_reviews}</span>
                    <span className="text-[11px] text-slate-400">Awaiting officer action</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Verified Bidders</span>
                    <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-emerald-700">{stats.verified_bidders}</span>
                    <span className="text-[11px] text-emerald-600 font-medium">92% Compliance</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">High Risk Bidders</span>
                    <span className="p-1.5 bg-red-50 text-red-600 rounded">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-red-600">{stats.high_risk_bidders}</span>
                    <span className="text-[11px] text-red-600 font-medium">Immediate review</span>
                  </div>
                </div>
              </div>

              {/* Main SIH Demo Tender Callout */}
              <div className="bg-linear-to-r from-slate-900 to-[#0F294A] text-white p-5 rounded-lg shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                      Featured SIH Demo Tender
                    </span>
                    <span className="text-xs text-slate-300 font-mono">GEM-DEMO-2026-001</span>
                  </div>
                  <h3 className="text-base font-semibold">
                    Supply of Industrial Safety Equipment & Protective Gear
                  </h3>
                  <p className="text-xs text-slate-300">
                    Bid Submission Date: <b>10-06-2026</b> • Statutory criteria: GST, PAN, Udyam, Min Turnover ₹50 Lakh
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href="/officer/verification/2"
                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <span>Inspect Bidder B (Discrepancies)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/officer/verification/1"
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
                  >
                    Bidder A (Compliant)
                  </Link>
                </div>
              </div>

              {/* Recent Applications Table */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F294A]">
                      Recent Tender Applications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluate AI compliance assessments, cross-document discrepancies, and render decisions.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    Showing {applications.length} submissions
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-6 py-3">Bidder Enterprise</th>
                        <th className="px-6 py-3">Tender Ref</th>
                        <th className="px-6 py-3">Score</th>
                        <th className="px-6 py-3">Risk Level</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.map((app) => {
                        const isHigh = app.risk_level === "HIGH";
                        const isLow = app.risk_level === "LOW";
                        const isMedium = app.risk_level === "MEDIUM";

                        return (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-3.5">
                              <div className="font-semibold text-slate-900">
                                {app.submitted_company_name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {app.application_ref} • GSTIN: {app.submitted_gstin || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-3.5 font-mono text-slate-700">
                              {app.tender?.tender_ref || "GEM-DEMO-2026-001"}
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="font-bold text-sm text-[#0F294A]">
                                {app.compliance_score}
                              </span>
                              <span className="text-slate-400 text-[10px]"> / 100</span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isLow
                                    ? "bg-emerald-100 text-emerald-800"
                                    : isHigh
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {app.risk_level}
                              </span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="text-slate-700 font-medium">
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <Link
                                href={`/officer/verification/${app.id}`}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#0F294A] hover:bg-blue-900 text-white rounded text-xs font-medium transition-colors shadow-xs"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Verify & Decide</span>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              ROLE 2: BIDDER PORTAL DASHBOARD
              ======================================================== */}
          {role === "BIDDER" && (
            <div className="space-y-6">
              {/* Bidder Welcome Header */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Bidder Portal
                  </span>
                  <h1 className="text-2xl font-bold text-[#0F294A] mt-1">
                    Welcome, {user.organization || user.full_name}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track your bid submissions, view transparent compliance scores, and respond to official clarification queries.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href="/bidder/apply"
                    className="bg-[#0F294A] hover:bg-blue-900 text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Apply for New Tender</span>
                  </Link>
                </div>
              </div>

              {/* Active Application Status Stepper */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">Current Application</span>
                    <h3 className="text-sm font-semibold text-[#0F294A]">
                      Tender: {applications.length > 0 ? applications[0].tender?.title || applications[0].application_ref : "No active applications"}
                    </h3>
                  </div>
                  {applications.length > 0 && (
                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded border border-blue-200 mt-2 sm:mt-0">
                      Status: {applications[0].status}
                    </span>
                  )}
                </div>

                {/* Progress Stepper */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2">
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold">
                      ✓
                    </div>
                    <div className="font-semibold text-slate-900">Application</div>
                    <div className="text-[10px] text-slate-400">Completed</div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold">
                      ✓
                    </div>
                    <div className="font-semibold text-slate-900">Documents</div>
                    <div className="text-[10px] text-slate-400">Submitted</div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#0F294A] text-white flex items-center justify-center mx-auto font-bold animate-pulse">
                      ●
                    </div>
                    <div className="font-semibold text-[#0F294A]">Verification</div>
                    <div className="text-[10px] text-blue-600 font-medium">Under Review</div>
                  </div>

                  <div className="space-y-1 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto font-bold">
                      ○
                    </div>
                    <div className="font-semibold text-slate-600">Decision</div>
                    <div className="text-[10px] text-slate-400">Pending Officer</div>
                  </div>
                </div>
              </div>

              {/* Action Required Callouts */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#0F294A] flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span>Action Required</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span>⚠️ Udyam Registration Discrepancy</span>
                        <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">Action Required</span>
                      </div>
                      <p className="text-xs text-amber-800 mt-2 leading-relaxed">
                        The GSTIN embedded in your uploaded Udyam Registration Certificate does not match the GSTIN provided in your application form.
                      </p>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <Link
                        href="/bidder/verification"
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors shadow-xs"
                      >
                        View Verification Details
                      </Link>
                      <Link
                        href="/bidder/clarifications"
                        className="bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-medium px-3 py-1.5 rounded transition-colors"
                      >
                        Upload Corrected Document
                      </Link>
                    </div>
                  </div>

                  <div className="bg-red-50/70 border border-red-200 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-red-900">
                        <span>✕ Turnover Certificate Missing</span>
                        <span className="text-[10px] bg-red-200 px-1.5 py-0.5 rounded">Mandatory</span>
                      </div>
                      <p className="text-xs text-red-800 mt-2 leading-relaxed">
                        CA Certified Turnover Certificate verifying minimum annual turnover of ₹50.00 Lakhs was not attached to your application package.
                      </p>
                    </div>

                    <div className="mt-4">
                      <Link
                        href="/bidder/verification#documents"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded inline-flex items-center space-x-1.5 shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Turnover Document</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bidder Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium">Latest Compliance Score</span>
                  <div className="text-2xl font-bold text-[#0F294A] mt-1">
                    {applications.length > 0 ? applications[0].compliance_score : 0} / 100
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold block mt-1">
                    AI-Assisted Assessment (Decision Support)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium">Total Applications</span>
                  <div className="text-2xl font-bold text-slate-800 mt-1">
                    {applications.length}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Submitted against {tenders.length} assigned tenders
                  </span>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium">Pending Tenders</span>
                  <div className="text-2xl font-bold text-orange-600 mt-1">
                    {tenders.length}
                  </div>
                  <Link href="/bidder/apply" className="text-[10px] text-blue-700 font-semibold hover:underline block mt-1">
                    Apply for an assigned tender →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              ROLE 3: ADMIN PORTAL DASHBOARD
              ======================================================== */}
          {role === "ADMIN" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#0F294A]">
                  System Administration Console
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Manage user roles, system health, verification engine settings, and cryptographic audit logs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">Total Users</span>
                  <div className="text-2xl font-bold text-[#0F294A] mt-1">4</div>
                  <span className="text-[11px] text-slate-400">Officers, Bidders, Admin</span>
                </div>
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">Audit Records</span>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.total_audit_logs || 5}</div>
                  <span className="text-[11px] text-emerald-600 font-medium">SHA-256 Hash Chained</span>
                </div>
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">AI Verification Mode</span>
                  <div className="text-base font-bold text-blue-900 mt-1">Deterministic + Demo AI</div>
                  <span className="text-[11px] text-slate-400">Zero-downtime offline fallback</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold text-[#0F294A]">Platform Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/audit"
                    className="px-4 py-2 bg-[#0F294A] text-white rounded text-xs font-medium hover:bg-blue-900 transition-colors"
                  >
                    View Cryptographic Audit Trail
                  </Link>
                  <Link
                    href="/officer/verification/2"
                    className="px-4 py-2 bg-slate-100 text-slate-800 rounded text-xs font-medium hover:bg-slate-200 border border-slate-200 transition-colors"
                  >
                    Test Verification Engine
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
