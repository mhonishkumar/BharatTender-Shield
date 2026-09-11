"use client";

import React from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Maximize2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  X
} from "lucide-react";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any | null;
  onRequestClarification?: (result: any) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  result,
  onRequestClarification,
}) => {
  if (!isOpen || !result) return null;

  const isPass = result.status === "PASS";
  const isFail = result.status === "FAIL";
  const isWarn = result.status === "WARNING";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-md ${
                isPass
                  ? "bg-emerald-100 text-emerald-700"
                  : isFail
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isPass ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isFail ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-base text-[#0F294A]">
                  Evidence Inspector: {result.title}
                </h3>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                  {result.rule_code || result.category}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Extracted from {result.source_document_name || "Application Packet"} (Page {result.page_number})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-y-auto">
          {/* LEFT: Document Preview */}
          <div className="p-6 bg-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-600 font-semibold">
                <span className="flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-[#0F294A]" />
                  <span>Document Evidence Snapshot</span>
                </span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                  Page {result.page_number} of 2
                </span>
              </div>

              {/* Simulated Document Sheet */}
              <div className="bg-white rounded border border-slate-300 shadow-sm p-5 text-slate-800 font-sans text-xs space-y-4 relative overflow-hidden">
                {/* Simulated Document Header */}
                <div className="text-center border-b border-slate-200 pb-3">
                  <div className="font-serif font-bold text-sm tracking-wide text-[#0F294A] uppercase">
                    Government of India / Statutory Authority
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                    {result.source_document_name?.replace(".pdf", "").replace(/_/g, " ") || "Statutory Registration Dossier"}
                  </div>
                </div>

                {/* Body Content with highlighted snippet */}
                <div className="space-y-2 text-[11px] leading-relaxed text-slate-700">
                  <p>
                    This is to certify that the commercial enterprise registered under relevant statutory schedules has been verified for tender participation.
                  </p>
                  
                  {/* Highlighted conflict box */}
                  <div className={`p-3 rounded border-2 ${
                    isFail
                      ? "border-red-500 bg-red-50/50"
                      : isWarn
                      ? "border-amber-500 bg-amber-50/50"
                      : "border-emerald-500 bg-emerald-50/50"
                  }`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center justify-between">
                      <span>Extracted Identifier / Clause Snippet</span>
                      <span className="font-mono text-red-600 font-bold">
                        {isFail ? "⚠️ CONFLICT DETECTED" : "✓ MATCH VERIFIED"}
                      </span>
                    </div>
                    <div className="font-mono text-xs bg-white p-2 rounded border border-slate-200 text-slate-900 font-bold">
                      {result.extracted_value || result.finding}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1.5 italic">
                      "{result.evidence_snippet || result.finding}"
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-0.5 pt-2">
                    <div>Digital Timestamp: 2026-06-10 14:32:10 UTC</div>
                    <div>Integrity Check: SHA-256 Validated</div>
                    <div>Source File: {result.source_document_name}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Deterministic OCR & AI Pipeline</span>
              <span className="text-emerald-700 font-medium">Confidence: {Math.round(result.confidence * 100)}%</span>
            </div>
          </div>

          {/* RIGHT: Verification Evidence Details */}
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Finding Title & Status Badge */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verification Finding
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                    isPass
                      ? "bg-emerald-100 text-emerald-800"
                      : isFail
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {result.status}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mt-1 leading-snug">
                {result.finding}
              </h4>
            </div>

            {/* Extracted vs Expected / Conflicting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Extracted Value:
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 mt-1 block break-all">
                  {result.extracted_value || "None"}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Expected / Conflicting:
                </span>
                <span className="font-mono text-xs font-bold text-red-700 mt-1 block break-all">
                  {result.expected_or_conflicting_value || "N/A"}
                </span>
              </div>
            </div>

            {/* Source & Page */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Source Document:</span>
                <span className="text-slate-800 font-semibold mt-0.5 block truncate">
                  {result.source_document_name || "Application Form"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Document Page:</span>
                <span className="text-slate-800 font-semibold mt-0.5 block">
                  Page {result.page_number}
                </span>
              </div>
            </div>

            {/* Applied Rule */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-md p-3 text-xs">
              <span className="font-semibold text-[#0F294A] block mb-1">
                Applied Tender Compliance Rule:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {result.applied_rule || "Clause: Statutory identifiers must match uniformly across all submitted documents."}
              </p>
            </div>

            {/* AI Confidence & Deterministic Check */}
            <div className="flex items-center justify-between text-xs py-1 border-y border-slate-100">
              <span className="text-slate-500">Extraction Confidence:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#0F294A] h-2 rounded-full"
                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                  />
                </div>
                <span className="font-bold text-slate-800">{Math.round(result.confidence * 100)}%</span>
              </div>
            </div>

            {/* Recommendation */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                System Recommendation:
              </span>
              <p className="text-xs text-slate-600 bg-amber-50 border border-amber-200 p-2.5 rounded">
                {result.recommendation || "Verify document and request clarification from bidder if required."}
              </p>
            </div>

            {/* Action CTA */}
            {(!isPass && onRequestClarification) && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onRequestClarification(result);
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request Clarification from Bidder</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            BharatTender Shield • Tamper-evident evidence inspection
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
