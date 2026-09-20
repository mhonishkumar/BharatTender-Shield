"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SIHDemoBar } from "@/components/SIHDemoBar";
import {
  DocumentChartBarIcon as FileSpreadsheet,
  ArrowDownTrayIcon as Download,
  CheckCircleIcon as CheckCircle2,
  ExclamationTriangleIcon as AlertTriangle,
  XCircleIcon as XCircle,
  DocumentTextIcon as FileText,
  ShieldCheckIcon as ShieldCheck,
  BuildingOffice2Icon as Building,
  ArrowLeftIcon as ArrowLeft,
} from "@heroicons/react/24/outline";

export default function ReportPage() {
  const { id } = useParams();
  const applicationId = Number(id) || 2;

  const [preview, setPreview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreview();
  }, [applicationId]);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const data = await api.getReportPreview(applicationId);
      setPreview(data);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading || !preview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#0F294A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Generating compliance report preview...</p>
        </div>
      </div>
    );
  }

  const isLow = preview.risk_level === "LOW";
  const isHigh = preview.risk_level === "HIGH";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <SIHDemoBar />
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/officer/verification/${applicationId}`}
              className="text-xs text-slate-500 hover:text-[#0F294A] flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Verification Inspector</span>
            </Link>

            <button
              onClick={() => api.downloadReport(applicationId).catch(err => alert("Download failed: " + err.message))}
              className="bg-[#0F294A] hover:bg-blue-900 text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Generate & Download Official PDF</span>
            </button>
          </div>

          {/* Report Preview Document Canvas */}
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-8 space-y-6">
            {/* Header of Report with Official Branding */}
            <div className="border-b-2 border-[#0F294A] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/logo.jpg"
                  alt="BharatTender Shield"
                  className="w-14 h-14 object-contain rounded"
                />
                <div>
                  <h1 className="text-xl font-bold text-[#0F294A] tracking-tight">
                    BharatTender Shield
                  </h1>
                  <p className="text-xs text-orange-600 font-medium italic">
                    "Every Bid Verified. Every Decision Defensible."
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    SIH 2026 Problem Statement 26100 • GeM Procurement Compliance Platform
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500">
                <div className="font-mono font-bold text-slate-900">{preview.application_ref}</div>
                <div>Issued: {new Date().toLocaleDateString()}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">SHA-256 Chained</div>
              </div>
            </div>

            {/* Tender & Bidder Identification Summary */}
            <div className="bg-slate-50 rounded border border-slate-200 p-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Tender Reference:</span>
                <span className="font-semibold text-slate-900">{preview.tender_ref}</span>
                <p className="text-[11px] text-slate-600 mt-0.5">{preview.tender_title}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Bidder Enterprise:</span>
                <span className="font-semibold text-slate-900">{preview.company_name}</span>
                <p className="font-mono text-[11px] text-slate-600 mt-0.5">
                  GSTIN: {preview.gstin} | PAN: {preview.pan}
                </p>
              </div>
            </div>

            {/* Score & Risk Banner */}
            <div className="p-4 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Assessed Compliance Score</span>
                <div className="text-3xl font-extrabold text-[#0F294A] mt-0.5">
                  {preview.compliance_score} <span className="text-base text-slate-400 font-normal">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-semibold block">Risk Determination</span>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded text-xs font-bold ${
                    isLow
                      ? "bg-emerald-100 text-emerald-800"
                      : isHigh
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {preview.risk_level} RISK
                </span>
              </div>
            </div>

            {/* Officer Decision Section */}
            <div className="border rounded border-slate-200 p-4 space-y-2 text-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Official Procurement Determination
              </span>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Official Decision:</span>
                <span className="font-bold text-[#0F294A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {preview.officer_decision}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Deciding Officer:</span>
                <span className="text-slate-900">{preview.decided_by}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700 block mb-0.5">Officer Comments:</span>
                <p className="bg-slate-50 p-2.5 rounded text-slate-700 italic border border-slate-200">
                  "{preview.officer_comments}"
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex justify-between items-center">
              <span>ReportLab Generated Compliance Certificate</span>
              <span>AI Decision Support • GeM Procurement Authority</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
