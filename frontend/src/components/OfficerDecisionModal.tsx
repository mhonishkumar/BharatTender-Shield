"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  ScaleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface OfficerDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  companyName: string;
  onDecisionSubmitted?: () => void;
}

export const OfficerDecisionModal: React.FC<OfficerDecisionModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  companyName,
  onDecisionSubmitted,
}) => {
  const { user } = useAuth();
  const [selectedDecision, setSelectedDecision] = useState<string>("COMPLIANT");
  const [comments, setComments] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      alert("Please confirm the statutory declaration before submitting your procurement decision.");
      return;
    }
    if (!comments.trim()) {
      alert("Please provide the legal/procedural justification comments.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitDecision({
        application_id: applicationId,
        decision: selectedDecision,
        comments,
      });
      if (onDecisionSubmitted) onDecisionSubmitted();
      onClose();
    } catch (err: any) {
      alert(`Error submitting decision: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="decision-modal-title"
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#0B1B3D] dark:bg-blue-900 text-white rounded-lg">
              <ScaleIcon className="w-4 h-4 stroke-2" />
            </div>
            <div>
              <h3 id="decision-modal-title" className="font-bold text-sm text-[#0B1B3D] dark:text-white">
                Final Procurement Decision
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Evaluating: <span className="font-semibold text-slate-800 dark:text-slate-200">{companyName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Statutory Mandate Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-lg p-3 text-xs text-blue-900 dark:text-blue-200 flex items-start space-x-2.5">
            <ShieldCheckIcon className="w-5 h-5 text-[#0B1B3D] dark:text-blue-400 flex-shrink-0 mt-0.5 stroke-2" />
            <div className="leading-relaxed">
              <div className="font-bold uppercase tracking-wider text-[10px] text-[#0B1B3D] dark:text-blue-300">
                Statutory Accountability Notice
              </div>
              <p className="mt-0.5 font-medium">
                AI provides evidence support only. The official procurement qualification decision is rendered solely by the authorized Procurement Officer.
              </p>
            </div>
          </div>

          {/* Decision Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Select Official Determination:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedDecision("COMPLIANT")}
                className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center space-x-2.5 ${
                  selectedDecision === "COMPLIANT"
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold ring-1 ring-emerald-600"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 stroke-2" />
                <div>
                  <div>Approve / Compliant</div>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">Meets all requirements</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("REQUEST_CLARIFICATION")}
                className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center space-x-2.5 ${
                  selectedDecision === "REQUEST_CLARIFICATION"
                    ? "border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 font-bold ring-1 ring-orange-500"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <ExclamationTriangleIcon className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 stroke-2" />
                <div>
                  <div>Request Clarification</div>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">Remediable discrepancy</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("MANUAL_REVIEW")}
                className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center space-x-2.5 ${
                  selectedDecision === "MANUAL_REVIEW"
                    ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-bold ring-1 ring-blue-600"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 stroke-2" />
                <div>
                  <div>Manual Review</div>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">Escalate to committee</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("NON_COMPLIANT")}
                className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center space-x-2.5 ${
                  selectedDecision === "NON_COMPLIANT"
                    ? "border-red-600 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-200 font-bold ring-1 ring-red-600"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 stroke-2" />
                <div>
                  <div>Mark Non-Compliant</div>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block">Disqualified on criteria</span>
                </div>
              </button>
            </div>
          </div>

          {/* Officer Details */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Deciding Procurement Officer:</span>
            <span className="text-slate-900 dark:text-white font-semibold">{user?.full_name || "Authorized Officer"}</span>
            <span className="text-slate-400 text-[10px] block mt-0.5 font-mono">{user?.email}</span>
          </div>

          {/* Officer Justification */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Procurement Officer Justification & Remarks:
            </label>
            <textarea
              rows={3}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Record the official justification citing verified findings, cross-document checks, and applicable tender clauses..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          {/* Mandatory Checkbox */}
          <label className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-[#0B1B3D] focus:ring-blue-500"
            />
            <span className="leading-snug">
              I certify that I have reviewed the AI-assisted verification evidence, cross-document analysis, and risk factors, and I hereby render this official procurement decision on behalf of the procuring authority.
            </span>
          </label>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#0B1B3D] dark:bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <ScaleIcon className="w-3.5 h-3.5 stroke-2" />
              <span>{isSubmitting ? "Recording..." : "Record Official Decision"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
