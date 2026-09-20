"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SIHDemoBar } from "@/components/SIHDemoBar";
import { TenderRuleCompilerModal } from "@/components/TenderRuleCompilerModal";
import {
  DocumentTextIcon as FileText,
  PlusCircleIcon as PlusCircle,
  CpuChipIcon as Cpu,
  CalendarDaysIcon as Calendar,
  BuildingOffice2Icon as Building,
  CheckCircleIcon as CheckCircle2,
  ClockIcon as Clock,
  ArrowRightIcon as ArrowRight,
  ArrowUpTrayIcon as Upload,
  XMarkIcon as X,
} from "@heroicons/react/24/outline";

function TendersContent() {
  const searchParams = useSearchParams();
  const shouldOpenCreate = searchParams.get("create") === "true";
  const { role } = useAuth();

  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(shouldOpenCreate);

  // Form states
  const [tenderRef, setTenderRef] = useState(`GEM-${new Date().getFullYear()}-` + Math.floor(100 + Math.random() * 900));
  const [title, setTitle] = useState("Supply of High-Grade Safety Helmets & Industrial Gear");
  const [department, setDepartment] = useState("Ministry of Heavy Industries / Central Engineering");
  const [description, setDescription] = useState("Mandatory statutory compliance: Bidder must possess valid and active GST registration, valid PAN card, valid MSME Udyam certificate, and minimum average annual turnover of ₹50.00 Lakhs.");
  const [bidDate, setBidDate] = useState("10-06-2026");
  const [deadline, setDeadline] = useState("25-06-2026");
  const [minTurnover, setMinTurnover] = useState(50.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compiler Modal states
  const [selectedTenderForRules, setSelectedTenderForRules] = useState<any | null>(null);
  const [isCompilerOpen, setIsCompilerOpen] = useState(false);

  useEffect(() => {
    loadTenders();
  }, []);

  const loadTenders = async () => {
    setLoading(true);
    try {
      const data = await api.getTenders();
      setTenders(data);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTender = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newTender = await api.createTender({
        tender_ref: tenderRef,
        title,
        department,
        description,
        bid_submission_date: bidDate,
        deadline,
        min_turnover: minTurnover,
      });
      setIsCreateOpen(false);
      await loadTenders();
      // Open rule compiler to review generated rules
      setSelectedTenderForRules(newTender);
      setIsCompilerOpen(true);
    } catch (err: any) {
      alert(`Error creating tender: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <SIHDemoBar />
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F294A]">
                Procurement Tenders
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage active public procurement notices and configure AI-compiled compliance rulebooks.
              </p>
            </div>

            {(role === "PROCUREMENT_OFFICER" || role === "ADMIN") && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="bg-[#0F294A] hover:bg-blue-900 text-white px-3.5 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Tender</span>
              </button>
            )}
          </div>

          {/* Tenders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenders.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0F294A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {t.tender_ref}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {t.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    {t.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {t.description || "Public procurement requirements under GeM statutory schedules."}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Procuring Department:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">{t.department}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Bid Submission Date:</span>
                    <span className="font-semibold text-slate-900">{t.bid_submission_date}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Min Turnover:</span>
                    <span className="font-semibold text-slate-900">₹{t.min_turnover} Lakhs</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedTenderForRules(t);
                      setIsCompilerOpen(true);
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1"
                  >
                    <Cpu className="w-3.5 h-3.5 text-orange-600" />
                    <span>View Rules ({t.rules?.length || 6})</span>
                  </button>

                  <Link
                    href={`/dashboard`}
                    className="px-3 py-1.5 bg-[#0F294A] hover:bg-blue-900 text-white rounded text-xs font-medium transition-colors shadow-xs"
                  >
                    View Applications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Create Tender Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#0F294A]" />
                <h3 className="font-semibold text-sm text-[#0F294A]">Create Procurement Tender</h3>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTender} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tender ID / Ref:</label>
                  <input
                    type="text"
                    required
                    value={tenderRef}
                    onChange={(e) => setTenderRef(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Min Turnover (₹ Lakhs):</label>
                  <input
                    type="number"
                    required
                    value={minTurnover}
                    onChange={(e) => setMinTurnover(parseFloat(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tender Name / Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Procuring Department:</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Bid Submission Date:</label>
                  <input
                    type="text"
                    required
                    value={bidDate}
                    onChange={(e) => setBidDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Final Deadline:</label>
                  <input
                    type="text"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tender Specification / Legal Clauses:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste tender specification clauses. The Tender-to-Rule Compiler will extract GST, PAN, Udyam, and financial rules automatically."
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded text-xs font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0F294A] hover:bg-blue-900 text-white rounded text-xs font-semibold shadow-xs"
                >
                  {isSubmitting ? "Compiling..." : "Save & Compile Rules"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tender-to-Rule Compiler Modal */}
      {selectedTenderForRules && (
        <TenderRuleCompilerModal
          isOpen={isCompilerOpen}
          onClose={() => setIsCompilerOpen(false)}
          tenderId={selectedTenderForRules.id}
          initialRules={selectedTenderForRules.rules || []}
          onRulesUpdated={loadTenders}
        />
      )}
    </div>
  );
}

export default function TendersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs text-slate-500">Loading Tenders...</div>}>
      <TendersContent />
    </Suspense>
  );
}
