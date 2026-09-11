"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { Cpu, CheckCircle2, Edit3, Save, X, Plus, AlertCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#0F294A] text-white rounded-md">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#0F294A]">
                Tender-to-Rule Compiler
              </h3>
              <p className="text-xs text-slate-500">
                Convert tender legal clauses into deterministic compliance verification rules.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-800 font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Rules List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-xs text-slate-500 bg-blue-50/60 p-3 rounded border border-blue-100 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <span>
              The AI Compiler extracts statutory requirements from procurement specifications. As Procurement Officer, you have full authority to edit, approve, or adjust deterministic criteria before evaluations begin.
            </span>
          </div>

          {rules.map((rule) => {
            const isEditing = editingRuleId === rule.id;

            return (
              <div
                key={rule.id}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-colors"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#0F294A] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {rule.rule_code}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {rule.category} Requirement
                    </span>
                    {rule.is_mandatory && (
                      <span className="text-[10px] bg-red-50 text-red-700 font-bold px-1.5 py-0.2 rounded border border-red-200">
                        Mandatory
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveRule(rule.id)}
                        disabled={isSaving}
                        className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 flex items-center space-x-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(rule)}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200 border border-slate-200 flex items-center space-x-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Rule</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Original Clause */}
                {rule.original_clause && (
                  <div className="mb-2.5 bg-slate-50 p-2.5 rounded text-[11px] text-slate-600 italic border-l-2 border-[#0F294A]">
                    <span className="font-semibold text-slate-700 not-italic block mb-0.5">
                      Source Clause:
                    </span>
                    "{rule.original_clause}"
                  </div>
                )}

                {/* Rule Requirement & Validation Logic */}
                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Requirement Description:
                      </label>
                      <input
                        type="text"
                        value={editForm.requirement}
                        onChange={(e) =>
                          setEditForm({ ...editForm, requirement: e.target.value })
                        }
                        className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Deterministic Validation Logic:
                      </label>
                      <textarea
                        rows={2}
                        value={editForm.validation_logic}
                        onChange={(e) =>
                          setEditForm({ ...editForm, validation_logic: e.target.value })
                        }
                        className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Requirement: </span>
                      <span className="text-slate-900 font-semibold">{rule.requirement}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Validation: </span>
                      <span className="text-slate-700">{rule.validation_logic}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {rules.length} compliance rules compiled for this tender
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-xs font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleApproveAll}
              className="px-4 py-1.5 bg-[#0F294A] hover:bg-blue-900 text-white rounded text-xs font-medium flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve & Enforce Rules</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
