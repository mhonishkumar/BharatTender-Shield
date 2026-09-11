"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SIHDemoBar } from "@/components/SIHDemoBar";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Upload,
  FileText,
  Clock,
  ArrowRight,
  MessageSquare
} from "lucide-react";

export default function BidderVerificationPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeApp, setActiveApp] = useState<any | null>(null);

  // File upload state
  const [uploadDocType, setUploadDocType] = useState("TURNOVER_CERTIFICATE");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data);
      if (data.length > 0) setActiveApp(data[0]);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !activeApp) return;

    setIsUploading(true);
    try {
      await api.uploadDocument(activeApp.id, uploadDocType, uploadFile);
      setUploadSuccess(true);
      setUploadFile(null);
      setTimeout(() => setUploadSuccess(false), 4000);
      await loadData();
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !activeApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#0F294A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading verification details...</p>
        </div>
      </div>
    );
  }

  const score = activeApp.compliance_score;
  const risk = activeApp.risk_level;
  const isHigh = risk === "HIGH";
  const isLow = risk === "LOW";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <SIHDemoBar />
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Application ID: {activeApp.application_ref}
            </span>
            <h1 className="text-2xl font-bold text-[#0F294A] mt-0.5">
              Bid Compliance & Verification Status
            </h1>
            <p className="text-xs text-slate-500">
              Tender: <span className="font-semibold text-slate-700">{activeApp.tender?.title || "GEM-DEMO-2026-001"}</span>
            </p>
          </div>

          {/* Compliance Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-4 bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Overall Status
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                      isLow
                        ? "bg-emerald-100 text-emerald-800"
                        : isHigh
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
                  AI-Assisted Compliance Assessment
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-700 block mb-1">Status Note:</span>
                <p className="text-[11px] leading-relaxed">
                  {isLow
                    ? "Your submission satisfies statutory criteria. Awaiting final procurement officer confirmation."
                    : "Remediable discrepancies flagged. Please upload the requested documents below."}
                </p>
              </div>
            </div>

            {/* Checklist Cards */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block">GST Compliance</span>
                <div className="mt-2 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">Verified</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">Active on GSTN</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block">PAN Verification</span>
                <div className="mt-2 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">Verified</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">Authentic</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block">Udyam MSME</span>
                <div className="mt-2 flex items-center space-x-1.5">
                  {score < 80 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {score < 80 ? "Mismatch" : "Verified"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {score < 80 ? "Identifier conflict" : "Valid"}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block">Turnover Certificate</span>
                <div className="mt-2 flex items-center space-x-1.5">
                  {score < 80 ? (
                    <XCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {score < 80 ? "Missing" : "Verified"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">≥ ₹50.00 Lakhs</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block">Document Packet</span>
                <div className="mt-2 flex items-center space-x-1.5">
                  {score < 80 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {score < 80 ? "Incomplete" : "Complete (4/4)"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Dossier status</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block">Bid Date Validity</span>
                <div className="mt-2 flex items-center space-x-1.5">
                  {score < 80 ? (
                    <XCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {score < 80 ? "Expired on date" : "Valid (10-06-2026)"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">10 June 2026</span>
              </div>
            </div>
          </div>

          {/* Action Required Callout Cards */}
          {score < 80 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#0F294A]">
                Action Required (Please Remediate)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>⚠️ GSTIN Mismatch Detected</span>
                    <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded">High Priority</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    "The GSTIN found in your uploaded Udyam Registration document does not match the GSTIN provided in your application form."
                  </p>
                  <div className="pt-2 flex space-x-2">
                    <Link
                      href="/bidder/clarifications"
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                    >
                      Upload Corrected Document
                    </Link>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-red-900">
                    <span>✕ Turnover Certificate Missing</span>
                    <span className="text-[10px] bg-red-200 px-2 py-0.5 rounded">Mandatory</span>
                  </div>
                  <p className="text-xs text-red-800 leading-relaxed">
                    "Chartered Accountant certified turnover certificate verifying minimum annual turnover of ₹50.00 Lakhs was not found in your package."
                  </p>
                  <div className="pt-2 flex space-x-2">
                    <a
                      href="#upload-box"
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                    >
                      Upload Turnover Document
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Corrected / Additional Document Box */}
          <div id="upload-box" className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0F294A]">
                Upload Document (Drag-and-Drop)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Allowed formats: PDF, PNG, JPG, JPEG. Instant OCR extraction and deterministic hash recording.
              </p>
            </div>

            {uploadSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-xs text-emerald-800 font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Document uploaded and queued for officer re-verification!</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Select Document Category:
                  </label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  >
                    <option value="TURNOVER_CERTIFICATE">CA Certified Turnover Certificate</option>
                    <option value="UDYAM_CERTIFICATE">Renewed Udyam Registration Certificate</option>
                    <option value="GST_CERTIFICATE">Corrected GST Registration Certificate</option>
                    <option value="PAN_CARD">Permanent Account Number (PAN) Card</option>
                    <option value="OTHER">Clarification Affidavit / Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Choose File:
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#0F294A] file:text-white hover:file:bg-blue-900 border border-slate-200 p-1.5 rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading || !uploadFile}
                className="bg-[#0F294A] hover:bg-blue-900 text-white font-semibold text-xs py-2 px-4 rounded flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? "Uploading & Extracting..." : "Upload Document"}</span>
              </button>
            </form>
          </div>

          {/* Uploaded Documents Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-[#0F294A]">
                Submitted Documents Dossier
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">Document Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Upload Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeApp.documents?.map((doc: any) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-slate-900 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#0F294A]" />
                        <span>{doc.file_name}</span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 font-mono">
                        {doc.doc_type}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc.verification_status === "VERIFIED"
                              ? "bg-emerald-100 text-emerald-800"
                              : doc.verification_status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {doc.verification_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
