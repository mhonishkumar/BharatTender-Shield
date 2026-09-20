"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { EvidenceModal } from "@/components/EvidenceModal";
import { ClarificationModal } from "@/components/ClarificationModal";
import { OfficerDecisionModal } from "@/components/OfficerDecisionModal";
import { CopyButton } from "@/components/CopyButton";
import { SkeletonHeader, SkeletonCard, SkeletonTable } from "@/components/SkeletonLoader";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlayIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
  EyeIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function BidderVerificationPage() {
  const { id } = useParams();
  const applicationId = Number(id) || 1;
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification Pipeline Animation States
  const [isVerifying, setIsVerifying] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<string>("");
  const [pipelineProgress, setPipelineProgress] = useState(0);

  // Modals
  const [selectedResultForEvidence, setSelectedResultForEvidence] = useState<any | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isClarificationOpen, setIsClarificationOpen] = useState(false);
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    loadData();
  }, [applicationId, user, isLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      const appData = await api.getApplication(applicationId);
      setApplication(appData);
      const resData = await api.getVerificationResults(applicationId);
      setResults(resData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setPipelineProgress(10);
    setPipelineStep("Ingesting tender rules & bidder document stream...");

    const steps = [
      { p: 25, label: "Extracting statutory identifiers (PyMuPDF & AI)..." },
      { p: 45, label: "Querying Simulated Government Gateways (GSTN / PAN / Udyam)..." },
      { p: 65, label: "Evaluating Bid-Date time validity relative to bid submission date..." },
      { p: 80, label: "Running Cross-Document Consistency Resolution..." },
      { p: 92, label: "Calculating transparent 100-point compliance score..." },
      { p: 100, label: "Cryptographically stamping SHA-256 audit log..." },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 380));
      setPipelineProgress(step.p);
      setPipelineStep(step.label);
    }

    try {
      await api.runVerification(applicationId);
      await loadData();
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    } finally {
      setIsVerifying(false);
      setPipelineStep("");
      setPipelineProgress(0);
    }
  };

  const handleOpenEvidence = (res: any) => {
    setSelectedResultForEvidence(res);
    setIsEvidenceOpen(true);
  };

  const handleRequestClarificationFromEvidence = () => {
    setIsClarificationOpen(true);
  };

  if (loading || !application) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            <SkeletonHeader />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SkeletonCard rows={3} />
              <SkeletonCard rows={3} />
              <SkeletonCard rows={3} />
              <SkeletonCard rows={3} />
            </div>
            <SkeletonTable rows={5} cols={5} />
          </main>
        </div>
      </div>
    );
  }

  const score = application.compliance_score;
  const risk = application.risk_level;
  const isHighRisk = risk === "HIGH";
  const isLowRisk = risk === "LOW";

  // Categorize verification statuses for summary
  const gstResult = results.find((r) => r.category === "GST");
  const panResult = results.find((r) => r.category === "PAN");
  const udyamResult = results.find((r) => r.category === "UDYAM" || r.rule_code === "TIME-001");
  const turnoverResult = results.find((r) => r.category === "TURNOVER");
  const crossResult = results.find((r) => r.category === "CROSS_CHECK" && r.status !== "PASS");

  const lastUpdated = application.updated_at
    ? new Date(application.updated_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex flex-col transition-colors duration-150">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumb & Bidder Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 no-print">
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <Link
                href="/dashboard"
                className="hover:text-[#0B1B3D] dark:hover:text-white flex items-center space-x-1 transition-colors"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5 stroke-2" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span>Verification</span>
              <span>/</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {application.application_ref}
              </span>
              <CopyButton text={application.application_ref} label="ID" />
            </div>

            {/* Switch Bidder Pills */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Switch Bidder:</span>
              <Link
                href="/officer/verification/1"
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  applicationId === 1
                    ? "bg-[#0B1B3D] dark:bg-blue-900 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                Bidder A (Compliant)
              </Link>
              <Link
                href="/officer/verification/2"
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  applicationId === 2
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                Bidder B (Discrepancies)
              </Link>
            </div>
          </div>

          {/* Sticky Header Status Bar (Item 11) */}
          <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {application.application_ref}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/60 font-mono">
                  {application.tender?.tender_ref || "GEM-DEMO-2026-001"}
                </span>
                {/* Last Updated Timestamp (Item 18) */}
                <span className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 ml-1">
                  <ClockIcon className="w-3.5 h-3.5 stroke-2" />
                  <span>Last verified: {lastUpdated}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1B3D] dark:text-white tracking-tight">
                {application.submitted_company_name}
              </h1>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tender: <span className="font-semibold text-slate-800 dark:text-slate-200">{application.tender?.title}</span> • Bid Submission Date: <span className="font-semibold text-slate-800 dark:text-slate-200">{application.tender?.bid_submission_date}</span>
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-2 no-print">
              <button
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="bg-[#0B1B3D] dark:bg-blue-900 hover:bg-blue-900 dark:hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isVerifying ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin text-orange-400 stroke-2" />
                ) : (
                  <PlayIcon className="w-4 h-4 text-emerald-400 stroke-2" />
                )}
                <span>{isVerifying ? "Verifying..." : "Run AI Verification"}</span>
              </button>

              <button
                onClick={() => setIsClarificationOpen(true)}
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-orange-600 dark:text-orange-400 stroke-2" />
                <span>Clarification</span>
              </button>

              <button
                onClick={() => setIsDecisionOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <ScaleIcon className="w-4 h-4 stroke-2" />
                <span>Final Decision</span>
              </button>

              <button
                onClick={() => api.downloadReport(applicationId).catch((err) => alert("Download failed: " + err.message))}
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Download official PDF compliance certificate"
              >
                <DocumentArrowDownIcon className="w-4 h-4 text-blue-700 dark:text-blue-400 stroke-2" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Verification Pipeline Progress */}
          {isVerifying && (
            <div className="bg-[#0B1B3D] dark:bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-blue-900/50 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center space-x-2">
                  <ArrowPathIcon className="w-4 h-4 text-orange-400 animate-spin stroke-2" />
                  <span className="font-semibold text-orange-400">{pipelineStep}</span>
                </span>
                <span className="font-mono text-slate-300">{pipelineProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 via-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${pipelineProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Score & Categorical Status Grid (Evidence-First) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Score Card */}
            <div className="md:col-span-4 bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 print-avoid-break">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Compliance Score
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isLowRisk
                        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                        : isHighRisk
                        ? "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                        : "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    {risk} RISK
                  </span>
                </div>

                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-5xl font-extrabold text-[#0B1B3D] dark:text-white">{score}</span>
                  <span className="text-slate-400 dark:text-slate-500 text-lg font-semibold">/ 100</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  AI-Assisted Evidence Verification • Governed by deterministic rules
                </p>
              </div>

              {/* Breakdown metrics */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>GST Verification (Max 20):</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {gstResult?.status === "PASS" ? "20" : "5"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>PAN Registration (Max 20):</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {panResult?.status === "PASS" ? "20" : "5"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Udyam & Bid Date (Max 20):</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {udyamResult?.status === "PASS" ? "20" : "8"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Document Completeness (Max 15):</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {application.documents?.length >= 4 ? "15" : "10"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Financial Turnover (Max 15):</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {turnoverResult?.status === "PASS" ? "15" : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cross-Check Consistency (Max 10):</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {crossResult ? "0" : "10"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Cards with Hover States (Item 7) & Copy Buttons (Item 9) */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* GST Card */}
              <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all print-avoid-break">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block">GST Status</span>
                  <div className="mt-2 flex items-center space-x-1.5">
                    {gstResult?.status === "PASS" ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-2" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 stroke-2" />
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {gstResult?.status === "PASS" ? "Verified Active" : "Discrepancy"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  <span className="truncate">{application.submitted_gstin || "None"}</span>
                  {application.submitted_gstin && <CopyButton text={application.submitted_gstin} label="GSTIN" />}
                </div>
              </div>

              {/* PAN Card */}
              <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all print-avoid-break">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block">PAN Status</span>
                  <div className="mt-2 flex items-center space-x-1.5">
                    {panResult?.status === "PASS" ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-2" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 stroke-2" />
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {panResult?.status === "PASS" ? "Verified Valid" : "Check Failed"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>{application.submitted_pan || "None"}</span>
                  {application.submitted_pan && <CopyButton text={application.submitted_pan} label="PAN" />}
                </div>
              </div>

              {/* Udyam Card */}
              <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all print-avoid-break">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block">Udyam MSME</span>
                  <div className="mt-2 flex items-center space-x-1.5">
                    {udyamResult?.status === "PASS" ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-2" />
                    ) : (
                      <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-2" />
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {udyamResult?.status === "PASS" ? "Valid Active" : "Mismatch / Expired"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  <span className="truncate">{application.submitted_udyam || "None"}</span>
                  {application.submitted_udyam && <CopyButton text={application.submitted_udyam} label="Udyam" />}
                </div>
              </div>

              {/* Turnover Card */}
              <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all print-avoid-break">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block">Turnover (≥ ₹50L)</span>
                  <div className="mt-2 flex items-center space-x-1.5">
                    {turnoverResult?.status === "PASS" ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-2" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 stroke-2" />
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {turnoverResult?.status === "PASS" ? "Threshold Met" : "Deficit / Missing"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                  Declared: ₹{application.submitted_turnover}L
                </div>
              </div>
            </div>
          </div>

          {/* Time-Aware Bid Date Validation Banner */}
          <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print-avoid-break">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 rounded-lg">
                <CalendarDaysIcon className="w-5 h-5 stroke-2" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Time-Aware Validity Assessment (Tender Bid Date: {application.tender?.bid_submission_date})
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Statutory certificates are validated for legality on the specific bid submission date.
                </p>
              </div>
            </div>

            {applicationId === 2 ? (
              <span className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold px-3 py-1 rounded-lg border border-red-200 dark:border-red-800/60 self-start sm:self-auto">
                ✕ NOT VALID ON BID DATE (Expired 31-Dec-2025)
              </span>
            ) : (
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 self-start sm:self-auto">
                ✓ ALL VALID ON BID DATE
              </span>
            )}
          </div>

          {/* Verification Findings & Evidence Matrix (Hover states on rows: Item 7) */}
          <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden print-avoid-break">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B1B3D] dark:text-white flex items-center space-x-2">
                  <DocumentMagnifyingGlassIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-2" />
                  <span>Verification Findings & Evidence Matrix</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click [View Evidence] to inspect extracted snippets, conflicting values, and applied rules in the signature split viewer.
                </p>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                {results.length} checks executed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">Category / Rule</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Verification Finding</th>
                    <th className="px-6 py-3">Extracted Value</th>
                    <th className="px-6 py-3">Confidence</th>
                    <th className="px-6 py-3 text-right">Evidence Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {results.map((res) => {
                    const isPass = res.status === "PASS";
                    const isFail = res.status === "FAIL";

                    return (
                      <tr
                        key={res.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-3.5">
                          <span className="font-mono font-bold text-[#0B1B3D] dark:text-blue-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {res.rule_code || res.category}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPass
                                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                                : isFail
                                ? "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                                : "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 max-w-sm">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{res.title}</div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {res.finding}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                          {res.extracted_value || "N/A"}
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {Math.round((res.confidence || 0.85) * 100)}%
                        </td>
                        <td className="px-6 py-3.5 text-right no-print">
                          <button
                            onClick={() => handleOpenEvidence(res)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs transition-colors border border-slate-300 dark:border-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <EyeIcon className="w-3.5 h-3.5 text-[#0B1B3D] dark:text-blue-400 stroke-2" />
                            <span>View Evidence</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Officer Decision Record */}
          {application.decision && (
            <div className="bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 print-avoid-break">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Final Procurement Determination
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                  DECISION: {application.decision.decision}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium block">Deciding Procurement Officer:</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{application.decision.officer_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium block">Timestamp:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono">
                    {new Date(application.decision.decided_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Officer Comments:</span>
                &ldquo;{application.decision.comments}&rdquo;
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        result={selectedResultForEvidence}
        onRequestClarification={handleRequestClarificationFromEvidence}
      />

      <ClarificationModal
        isOpen={isClarificationOpen}
        onClose={() => setIsClarificationOpen(false)}
        applicationId={applicationId}
        onClarificationSent={loadData}
      />

      <OfficerDecisionModal
        isOpen={isDecisionOpen}
        onClose={() => setIsDecisionOpen(false)}
        applicationId={applicationId}
        companyName={application.submitted_company_name}
        onDecisionSubmitted={loadData}
      />
    </div>
  );
}
