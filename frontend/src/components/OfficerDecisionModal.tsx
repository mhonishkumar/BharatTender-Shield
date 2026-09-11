"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Gavel, CheckCircle2, AlertTriangle, XCircle, Search, ShieldCheck, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#0F294A] text-white rounded-md">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0F294A]">
                Final Procurement Decision
              </h3>
              <p className="text-[11px] text-slate-500">
                Evaluating: <span className="font-semibold text-slate-800">{companyName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Statutory Mandate Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900 flex items-start space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-[#0F294A] flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <div className="font-bold uppercase tracking-wider text-[10px] text-[#0F294A]">
                Statutory Accountability Notice
              </div>
              <p className="mt-0.5 font-medium">
                AI provides decision support only. The official procurement qualification decision is rendered solely by the authorized Procurement Officer.
              </p>
            </div>
          </div>

          {/* Decision Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Select Official Determination:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedDecision("COMPLIANT")}
                className={`p-3 rounded-md border text-left text-xs transition-all flex items-center space-x-2 ${
                  selectedDecision === "COMPLIANT"
                    ? "border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold ring-1 ring-emerald-600"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <div>Approve / Compliant</div>
                  <span className="text-[10px] font-normal text-slate-500 block">Meets all requirements</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("REQUEST_CLARIFICATION")}
                className={`p-3 rounded-md border text-left text-xs transition-all flex items-center space-x-2 ${
                  selectedDecision === "REQUEST_CLARIFICATION"
                    ? "border-orange-500 bg-orange-50/80 text-orange-900 font-bold ring-1 ring-orange-500"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <div>
                  <div>Request Clarification</div>
                  <span className="text-[10px] font-normal text-slate-500 block">Minor remediable issue</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("MANUAL_REVIEW")}
                className={`p-3 rounded-md border text-left text-xs transition-all flex items-center space-x-2 ${
                  selectedDecision === "MANUAL_REVIEW"
                    ? "border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-1 ring-blue-600"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Search className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <div>Manual Review</div>
                  <span className="text-[10px] font-normal text-slate-500 block">Escalate to committee</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("NON_COMPLIANT")}
                className={`p-3 rounded-md border text-left text-xs transition-all flex items-center space-x-2 ${
                  selectedDecision === "NON_COMPLIANT"
                    ? "border-red-600 bg-red-50/80 text-red-900 font-bold ring-1 ring-red-600"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div>
                  <div>Mark Non-Compliant</div>
                  <span className="text-[10px] font-normal text-slate-500 block">Disqualified on criteria</span>
                </div>
              </button>
            </div>
          </div>

          {/* Officer Details */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium block">Deciding Procurement Officer:</span>
            <span className="text-slate-900 font-semibold">{user?.full_name || "Authorized Officer"}</span>
            <span className="text-slate-400 text-[10px] block mt-0.5">{user?.email}</span>
          </div>

          {/* Officer Justification */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Procurement Officer Justification & Remarks:
            </label>
            <textarea
              rows={3}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Record the official justification citing verified findings, cross-document checks, and applicable tender clauses..."
              className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
            />
          </div>

          {/* Mandatory Checkbox */}
          <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-[#0F294A] focus:ring-[#0F294A]"
            />
            <span className="leading-snug">
              I certify that I have reviewed the AI-assisted verification evidence, cross-document analysis, and risk factors, and I hereby render this official procurement decision on behalf of the procuring authority.
            </span>
          </label>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded text-xs font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#0F294A] hover:bg-blue-900 text-white rounded text-xs font-medium flex items-center space-x-1.5 shadow-xs"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Recording..." : "Record Official Decision"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
