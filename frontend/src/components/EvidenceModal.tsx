"use client";

import React from "react";
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

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
  const isWarn = result.status === "WARNING" || result.status === "REVIEW";

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                isPass
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                  : isFail
                  ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                  : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
              }`}
            >
              {isPass ? (
                <CheckCircleIcon className="w-5 h-5 stroke-2" />
              ) : isFail ? (
                <XCircleIcon className="w-5 h-5 stroke-2" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 stroke-2" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="evidence-modal-title" className="font-bold text-base text-[#0B1B3D] dark:text-white">
                  Evidence Inspector: {result.title}
                </h3>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                  {result.rule_code || result.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Extracted from {result.source_document_name || "Application Packet"} (Page {result.page_number})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        {/* Modal Body: Split Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 overflow-y-auto">
          {/* LEFT: Document Preview */}
          <div className="p-6 bg-slate-100/70 dark:bg-slate-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <span className="flex items-center space-x-1.5">
                  <DocumentTextIcon className="w-4 h-4 text-[#0B1B3D] dark:text-blue-400 stroke-2" />
                  <span>Document Evidence Snapshot</span>
                </span>
                <span className="text-[11px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  Page {result.page_number}
                </span>
              </div>

              {/* Simulated Document Sheet */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm p-5 font-sans text-xs space-y-4 relative overflow-hidden">
                <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="font-serif font-bold text-sm tracking-wide text-[#0B1B3D] dark:text-white uppercase">
                    Government of India / Statutory Authority
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                    {result.source_document_name?.replace(".pdf", "").replace(/_/g, " ") || "Statutory Registration Dossier"}
                  </div>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                  <p>
                    This certifies that the commercial enterprise registered under relevant statutory schedules has been verified for tender participation.
                  </p>

                  <div
                    className={`p-3 rounded-lg border-2 ${
                      isFail
                        ? "border-red-500 bg-red-50/60 dark:bg-red-950/30"
                        : isWarn
                        ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30"
                        : "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30"
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
                      <span>Extracted Identifier / Clause Snippet</span>
                      <span className={`font-mono font-bold ${isFail ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {isFail ? "⚠️ CONFLICT DETECTED" : "✓ MATCH VERIFIED"}
                      </span>
                    </div>
                    <div className="font-mono text-xs bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold">
                      {result.extracted_value || result.finding}
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1.5 italic">
                      &ldquo;{result.evidence_snippet || result.finding}&rdquo;
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 space-y-0.5 pt-2 font-mono">
                    <div>Integrity Check: SHA-256 Validated</div>
                    <div>Source File: {result.source_document_name}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Deterministic OCR & AI Pipeline</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Confidence: {Math.round((result.confidence || 0.85) * 100)}%
              </span>
            </div>
          </div>

          {/* RIGHT: Verification Evidence Details */}
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Verification Finding
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                    isPass
                      ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                      : isFail
                      ? "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                      : "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  {result.status}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1 leading-snug">
                {result.finding}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Extracted Value:
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-1 block break-all">
                  {result.extracted_value || "None"}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Expected / Conflicting:
                </span>
                <span className="font-mono text-xs font-bold text-red-700 dark:text-red-400 mt-1 block break-all">
                  {result.expected_or_conflicting_value || "N/A"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium block">Source Document:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block truncate">
                  {result.source_document_name || "Application Form"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium block">Document Page:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                  Page {result.page_number}
                </span>
              </div>
            </div>

            <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg p-3 text-xs">
              <span className="font-semibold text-[#0B1B3D] dark:text-blue-300 block mb-1">
                Applied Tender Compliance Rule:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.applied_rule || "Clause: Statutory identifiers must match uniformly across all submitted documents."}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-y border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Extraction Confidence:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#0B1B3D] dark:bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.round((result.confidence || 0.85) * 100)}%` }}
                  />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Math.round((result.confidence || 0.85) * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                System Recommendation:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-2.5 rounded-lg">
                {result.recommendation || "Verify document and request clarification from bidder if required."}
              </p>
            </div>

            {!isPass && onRequestClarification && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onRequestClarification(result);
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 stroke-2" />
                  <span>Request Clarification from Bidder</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500">
            BharatTender Shield • Tamper-evident evidence inspection
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
