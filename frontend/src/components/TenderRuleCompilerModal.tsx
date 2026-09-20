"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import {
  CpuChipIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  BookmarkSquareIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface TenderRuleCompilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenderId: number;
  initialRules: any[];
  onRulesUpdated?: () => void;
}

export const TenderRuleCompilerModal: React.FC<TenderRuleCompilerModalProps> = ({
  isOpen,
  onClose,
  tenderId,
  initialRules,
  onRulesUpdated,
}) => {
  const [rules, setRules] = useState<any[]>(initialRules || []);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEditClick = (rule: any) => {
    setEditingRuleId(rule.id);
    setEditForm({
      requirement: rule.requirement,
      validation_logic: rule.validation_logic,
      is_mandatory: rule.is_mandatory,
      is_approved_by_officer: rule.is_approved_by_officer,
    });
  };

  const handleSaveRule = async (ruleId: number) => {
    setIsSaving(true);
    try {
      const updated = await api.updateRule(ruleId, {
        ...editForm,
        rule_code: rules.find((r) => r.id === ruleId)?.rule_code || "RULE",
        category: rules.find((r) => r.id === ruleId)?.category || "GENERAL",
      });
      setRules((prev) => prev.map((r) => (r.id === ruleId ? updated : r)));
      setEditingRuleId(null);
      setMessage("Rule updated and approved by officer.");
      setTimeout(() => setMessage(null), 3000);
      if (onRulesUpdated) onRulesUpdated();
    } catch (e: any) {
      alert(`Failed to update rule: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveAll = () => {
    setMessage("All compiled rules confirmed for procurement verification.");
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compiler-modal-title"
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#0B1B3D] dark:bg-blue-900 text-white rounded-lg">
              <CpuChipIcon className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h3 id="compiler-modal-title" className="font-bold text-base text-[#0B1B3D] dark:text-white">
                Tender-to-Rule Compiler
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Convert tender legal clauses into deterministic compliance verification rules.
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

        {/* Message Banner */}
        {message && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 px-6 py-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center space-x-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-2" />
            <span>{message}</span>
          </div>
        )}

        {/* Rules List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-blue-50/70 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 flex items-start space-x-2">
            <ExclamationCircleIcon className="w-4 h-4 text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5 stroke-2" />
            <span>
              The AI Compiler extracts statutory requirements from procurement specifications. As Procurement Officer, you have full authority to edit, approve, or adjust deterministic criteria before evaluations begin.
            </span>
          </div>

          {rules.map((rule) => {
            const isEditing = editingRuleId === rule.id;

            return (
              <div
                key={rule.id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#0B1B3D] dark:text-blue-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {rule.rule_code}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {rule.category} Requirement
                    </span>
                    {rule.is_mandatory && (
                      <span className="text-[10px] bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/60">
                        Mandatory
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveRule(rule.id)}
                        disabled={isSaving}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
                      >
                        <BookmarkSquareIcon className="w-3.5 h-3.5 stroke-2" />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(rule)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center space-x-1 transition-colors"
                      >
                        <PencilSquareIcon className="w-3 h-3 stroke-2" />
                        <span>Edit Rule</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Original Clause */}
                {rule.original_clause && (
                  <div className="mb-2.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded text-[11px] text-slate-600 dark:text-slate-400 italic border-l-2 border-[#0B1B3D] dark:border-blue-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 not-italic block mb-0.5">
                      Source Clause:
                    </span>
                    &ldquo;{rule.original_clause}&rdquo;
                  </div>
                )}

                {/* Rule Requirement & Validation Logic */}
                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Requirement Description:
                      </label>
                      <input
                        type="text"
                        value={editForm.requirement}
                        onChange={(e) =>
                          setEditForm({ ...editForm, requirement: e.target.value })
                        }
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Deterministic Validation Logic:
                      </label>
                      <textarea
                        rows={2}
                        value={editForm.validation_logic}
                        onChange={(e) =>
                          setEditForm({ ...editForm, validation_logic: e.target.value })
                        }
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Requirement: </span>
                      <span className="text-slate-900 dark:text-white font-semibold">{rule.requirement}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Validation: </span>
                      <span className="text-slate-700 dark:text-slate-300">{rule.validation_logic}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {rules.length} compliance rules compiled for this tender
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApproveAll}
              className="px-4 py-1.5 bg-[#0B1B3D] dark:bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <CheckCircleIcon className="w-3.5 h-3.5 stroke-2" />
              <span>Approve & Enforce Rules</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
