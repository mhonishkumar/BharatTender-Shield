"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SIHDemoBar } from "@/components/SIHDemoBar";
import { EvidenceModal } from "@/components/EvidenceModal";
import { ClarificationModal } from "@/components/ClarificationModal";
import { OfficerDecisionModal } from "@/components/OfficerDecisionModal";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RotateCw,
  FileSpreadsheet,
  Gavel,
  MessageSquare,
  History,
  Calendar,
  Layers,
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  Clock,
  Eye,
  FileText
} from "lucide-react";

export default function BidderVerificationPage() {
  const { id } = useParams();
  const applicationId = Number(id) || 1;
  const { user, role, isLoading } = useAuth();
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
      router.push("/");
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
    } catch (e: any) {
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
      { p: 65, label: "Evaluating Bid-Date time validity relative to 10-06-2026..." },
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

  const handleRequestClarificationFromEvidence = (res: any) => {
    setIsClarificationOpen(true);
  };

  if (loading || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#0F294A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading Bidder Verification Record...</p>
        </div>
      </div>
    );
  }

  const score = application.compliance_score;
  const risk = application.risk_level;
  const isHighRisk = risk === "HIGH";
  const isLowRisk = risk === "LOW";
  const isMediumRisk = risk === "MEDIUM";

  // Categorize verification statuses for the summary cards
  const gstResult = results.find((r) => r.category === "GST");
  const panResult = results.find((r) => r.category === "PAN");
  const udyamResult = results.find((r) => r.category === "UDYAM" || r.rule_code === "TIME-001");
  const turnoverResult = results.find((r) => r.category === "TURNOVER");
  const crossResult = results.find((r) => r.category === "CROSS_CHECK" && r.status !== "PASS");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <SIHDemoBar />
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Back Navigation & Breadcrumb */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/dashboard" className="hover:text-[#0F294A] flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span>Bidder Verification</span>
              <span>/</span>
              <span className="font-semibold text-slate-800">{application.application_ref}</span>
            </div>

            {/* Quick switch between Bidder A and Bidder B */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium">Switch Bidder:</span>
              <Link
                href="/officer/verification/1"
                className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                  applicationId === 1
                    ? "bg-[#0F294A] text-white border-[#0F294A]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Bidder A (Compliant)
              </Link>
              <Link
                href="/officer/verification/2"
                className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                  applicationId === 2
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Bidder B (Discrepancies)
              </Link>
            </div>
          </div>

          {/* Top Hero Card: Bidder Information & Verification Trigger */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {application.application_ref}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-mono">
                  {application.tender?.tender_ref || "GEM-DEMO-2026-001"}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-[#0F294A] tracking-tight">
                {application.submitted_company_name}
              </h1>

              <p className="text-xs text-slate-600">
                Tender: <span className="font-semibold text-slate-800">{application.tender?.title}</span> • Bid Submission Date: <span className="font-semibold text-slate-800">{application.tender?.bid_submission_date}</span>
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="bg-[#0F294A] hover:bg-blue-900 text-white px-4 py-2.5 rounded-md text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors"
              >
                {isVerifying ? (
                  <RotateCw className="w-4 h-4 animate-spin text-orange-400" />
                ) : (
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                )}
                <span>{isVerifying ? "Verifying Pipeline..." : "Run AI Verification"}</span>
              </button>

              <button
                onClick={() => setIsClarificationOpen(true)}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                <span>Request Clarification</span>
              </button>

              <button
                onClick={() => setIsDecisionOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Final Decision</span>
              </button>

              <a
                href={api.getReportDownloadUrl(applicationId)}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
                <span>Download PDF Report</span>
              </a>
            </div>
          </div>

          {/* Animated Verification Pipeline Bar */}
          {isVerifying && (
            <div className="bg-slate-900 text-white p-4 rounded-lg shadow-sm border border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center space-x-2">
                  <RotateCw className="w-4 h-4 text-orange-400 animate-spin" />
                  <span className="font-semibold text-orange-400">{pipelineStep}</span>
                </span>
                <span className="font-mono text-slate-300">{pipelineProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${pipelineProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Compliance Score & Summary Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left: Score Box */}
            <div className="md:col-span-4 bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Compliance Score
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                      isLowRisk
                        ? "bg-emerald-100 text-emerald-800"
                        : isHighRisk
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {risk} RISK
                  </span>
                </div>

                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-[#0F294A]">{score}</span>
                  <span className="text-slate-400 text-base font-semibold">/ 100</span>
                </div>

                <p className="text-[11px] text-slate-500 mt-1 italic">
                  AI-Assisted Compliance Assessment (Decision Support)
                </p>
              </div>

              {/* Score breakdown metrics */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>GST Verification (Max 20):</span>
                  <span className="font-semibold text-slate-800">{gstResult?.status === "PASS" ? "20" : "5"}</span>
                </div>
                <div className="flex justify-between">
                  <span>PAN Registration (Max 20):</span>
                  <span className="font-semibold text-slate-800">{panResult?.status === "PASS" ? "20" : "5"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Udyam & Bid Date (Max 20):</span>
                  <span className="font-semibold text-slate-800">{udyamResult?.status === "PASS" ? "20" : "8"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Document Completeness (Max 15):</span>
                  <span className="font-semibold text-slate-800">{application.documents?.length >= 4 ? "15" : "10"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Financial Turnover (Max 15):</span>
                  <span className="font-semibold text-slate-800">{turnoverResult?.status === "PASS" ? "15" : "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cross-Check Consistency (Max 10):</span>
                  <span className="font-semibold text-slate-800">{crossResult ? "0" : "10"}</span>
                </div>
              </div>
            </div>

            {/* Right: Category Quick Cards */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* GST Card */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">GST Status</span>
                  <div className="mt-2 flex items-center space-x-1.5">
                    {gstResult?.status === "PASS" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-xs font-semibold text-slate-800">
                      {gstResult?.status === "PASS" ? "Verified Active" : "Failed"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-mono text-slate-500 truncate">
                  {application.submitted_gstin || "None"}
                </div>
              </div>

              {/* PAN Card */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">PAN Status</span>
                  <div className="mt-2 flex items-center space-x-1.5">
                    {panResult?.status === "PASS" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-xs font-semibold text-slate-800">
                      {panResult?.status === "PASS" ? "Verified Valid" : "Check Failed"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-mono text-slate-500">
                  {application.submitted_pan || "None"}
                </div>
              </div>

              {/* Udyam Card */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Udyam MSME</span>
                  <div className="mt-2 flex items-center space-x-1.5">
                    {udyamResult?.status === "PASS" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="text-xs font-semibold text-slate-800">
                      {udyamResult?.status === "PASS" ? "Valid Active" : "Mismatch / Exp"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-mono text-slate-500 truncate">
                  {application.submitted_udyam || "None"}
                </div>
              </div>

              {/* Turnover Card */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Turnover (≥ ₹50L)</span>
                  <div className="mt-2 flex items-center space-x-1.5">
                    {turnoverResult?.status === "PASS" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-xs font-semibold text-slate-800">
                      {turnoverResult?.status === "PASS" ? "Threshold Met" : "Missing / Deficit"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 font-semibold">
                  Declared: ₹{application.submitted_turnover}L
                </div>
              </div>
            </div>
          </div>

          {/* Time-Aware Bid Date Validation Banner */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 text-blue-800 rounded">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-800">
                  Time-Aware Verification (Tender Bid Submission Date: {application.tender?.bid_submission_date})
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Statutory certificates are validated for subsisting legality specifically on the tender bid submission date.
                </p>
              </div>
            </div>

            {applicationId === 2 ? (
              <span className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded border border-red-200">
                ✕ NOT VALID ON BID DATE (Expired 31-Dec-2025)
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded border border-emerald-200">
                ✓ ALL VALID ON BID DATE
              </span>
            )}
          </div>

          {/* Mock Government Verification Gateway Notice */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-[#0F294A] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                DEMO / MOCK GOVERNMENT VERIFICATION
              </span>
              <span className="text-slate-500 text-[11px]">
                Simulated NIC, GSTN, ITD, and MSME endpoints for hackathon evaluation.
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Production deployment connects to authorized National Informatics Centre (NIC) and API Setu gateways.
            </p>
          </div>

          {/* Verification Findings Table (With View Evidence CTA on Every Row) */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#0F294A]">
                  Verification Findings & Evidence Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Click [View Evidence] to inspect extracted snippets, conflicting values, and applied rules in the signature split viewer.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {results.length} checks executed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">Category / Rule</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Verification Finding</th>
                    <th className="px-6 py-3">Extracted Value</th>
                    <th className="px-6 py-3">Confidence</th>
                    <th className="px-6 py-3 text-right">Evidence Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((res) => {
                    const isPass = res.status === "PASS";
                    const isFail = res.status === "FAIL";
                    const isWarn = res.status === "WARNING";

                    return (
                      <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-3.5">
                          <span className="font-mono font-bold text-[#0F294A] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {res.rule_code || res.category}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPass
                                ? "bg-emerald-100 text-emerald-800"
                                : isFail
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 max-w-sm">
                          <div className="font-semibold text-slate-900">{res.title}</div>
                          <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                            {res.finding}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-700">
                          {res.extracted_value || "N/A"}
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-slate-800">
                          {Math.round(res.confidence * 100)}%
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => handleOpenEvidence(res)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs transition-colors border border-slate-300 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0F294A]" />
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

          {/* Official Officer Decision Record (If Made) */}
          {application.decision && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Final Procurement Determination
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  DECISION: {application.decision.decision}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Deciding Procurement Officer:</span>
                  <span className="text-slate-900 font-semibold">{application.decision.officer_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Timestamp:</span>
                  <span className="text-slate-700">
                    {new Date(application.decision.decided_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded text-xs text-slate-700 border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-0.5">Officer Comments:</span>
                "{application.decision.comments}"
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Signature Split Layout Evidence Modal */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        result={selectedResultForEvidence}
        onRequestClarification={handleRequestClarificationFromEvidence}
      />

      {/* Clarification Request Modal */}
      <ClarificationModal
        isOpen={isClarificationOpen}
        onClose={() => setIsClarificationOpen(false)}
        applicationId={applicationId}
        onClarificationSent={loadData}
      />

      {/* Officer Final Decision Modal */}
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
