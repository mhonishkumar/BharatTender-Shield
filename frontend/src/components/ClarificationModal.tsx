"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface ClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  initialIssue?: string;
  initialDocType?: string;
  onClarificationSent?: () => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  initialIssue = "GSTIN Mismatch detected across documents",
  initialDocType = "GST_CERTIFICATE",
  onClarificationSent,
}) => {
  const [issue, setIssue] = useState(initialIssue);
  const [message, setMessage] = useState("Please provide a clarified or corrected statutory certificate addressing the detected identifier discrepancy.");
  const [docType, setDocType] = useState(initialDocType);
  const [deadline, setDeadline] = useState("3 working days");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.createClarification({
        application_id: applicationId,
        issue,
        message,
        required_document_type: docType,
        deadline,
      });
      if (onClarificationSent) onClarificationSent();
      onClose();
    } catch (err: any) {
      alert(`Error requesting clarification: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clarification-modal-title"
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 rounded-lg">
              <ChatBubbleLeftRightIcon className="w-4 h-4 stroke-2" />
            </div>
            <div>
              <h3 id="clarification-modal-title" className="font-bold text-sm text-[#0B1B3D] dark:text-white">
                Request Official Clarification
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bidder will receive a formal notification to submit corrected evidence.
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
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Issue Summary:
            </label>
            <input
              type="text"
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Required Replacement Document:
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            >
              <option value="GST_CERTIFICATE">GST Registration Certificate</option>
              <option value="UDYAM_CERTIFICATE">Udyam Registration Certificate</option>
              <option value="PAN_CARD">Permanent Account Number (PAN) Card</option>
              <option value="TURNOVER_CERTIFICATE">CA Certified Turnover Certificate</option>
              <option value="OTHER">Other Affidavit / Clarification Letter</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Submission Deadline:
            </label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. 3 working days (15 June 2026)"
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Clarification Instructions for Bidder:
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start space-x-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 stroke-2" />
            <span>
              This request is recorded in the SHA-256 tamper-evident audit trail. The bidder will be flagged for clarification response.
            </span>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <PaperAirplaneIcon className="w-3.5 h-3.5 stroke-2" />
              <span>{isSending ? "Dispatching..." : "Send Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
