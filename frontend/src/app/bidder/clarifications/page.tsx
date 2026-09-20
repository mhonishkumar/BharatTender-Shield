"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SIHDemoBar } from "@/components/SIHDemoBar";
import {
  ChatBubbleLeftRightIcon as MessageSquare,
  PaperAirplaneIcon as Send,
  CheckCircleIcon as CheckCircle2,
  ClockIcon as Clock,
  ArrowUpTrayIcon as Upload,
  ExclamationTriangleIcon as AlertTriangle,
  PaperClipIcon as Paperclip,
  DocumentTextIcon as FileText,
} from "@heroicons/react/24/outline";

export default function BidderClarificationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [clarifications, setClarifications] = useState<any[]>([]);
  const [selectedClarification, setSelectedClarification] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const apps = await api.getApplications();
      setApplications(apps);
      if (apps.length > 0) {
        const clars = await api.getClarifications(apps[0].id);
        setClarifications(clars);
        if (clars.length > 0) {
          setSelectedClarification(clars[0]);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClarification) return;

    setIsSubmitting(true);
    try {
      let replacementDocId = undefined;
      if (uploadFile) {
        const uploadRes = await api.uploadDocument(
          selectedClarification.application_id,
          selectedClarification.required_document_type || "UDYAM_CERTIFICATE",
          uploadFile
        );
        replacementDocId = uploadRes.id;
      }

      await api.replyClarification(selectedClarification.id, {
        bidder_reply: replyText || "Corrected statutory documentation has been attached in accordance with the officer's request.",
        replacement_document_id: replacementDocId,
      });

      setSuccessMsg("Clarification response and replacement document submitted successfully!");
      setReplyText("");
      setUploadFile(null);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Error submitting clarification reply: ${err.message}`);
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
          <div>
            <h1 className="text-2xl font-bold text-[#0F294A]">
              Official Clarification Inquiries
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review formal clarification notices dispatched by Procurement Officers and submit rectified evidence.
            </p>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md text-xs text-emerald-800 font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Clarifications List */}
            <div className="md:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 font-semibold text-xs text-[#0F294A]">
                Clarification Requests ({clarifications.length})
              </div>

              <div className="divide-y divide-slate-100">
                {clarifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No open clarification inquiries.
                  </div>
                ) : (
                  clarifications.map((clar) => {
                    const isSelected = selectedClarification?.id === clar.id;
                    const isPending = clar.status === "PENDING";

                    return (
                      <div
                        key={clar.id}
                        onClick={() => setSelectedClarification(clar)}
                        className={`p-4 cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50/70 border-l-4 border-[#0F294A]" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-900 truncate">
                            {clar.issue}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isPending
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {clar.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                          "{clar.message}"
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                          <span>Deadline: {clar.deadline || "3 working days"}</span>
                          <span>{new Date(clar.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Selected Inquiry & Response Box */}
            <div className="md:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-6">
              {selectedClarification ? (
                <>
                  <div className="border-b border-slate-100 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                        Procurement Officer Inquiry
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(selectedClarification.created_at).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-[#0F294A]">
                      {selectedClarification.issue}
                    </h3>

                    <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed italic">
                      "{selectedClarification.message}"
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <div>
                        <span className="font-medium text-slate-500">Required Document:</span>{" "}
                        <span className="font-semibold text-slate-800 font-mono">
                          {selectedClarification.required_document_type || "Statutory Certificate"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-500">Compliance Deadline:</span>{" "}
                        <span className="font-semibold text-red-600">
                          {selectedClarification.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* If already replied, show previous reply */}
                  {selectedClarification.bidder_reply && (
                    <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-md space-y-1 text-xs">
                      <span className="font-bold text-emerald-900 block">
                        Your Submitted Clarification Response:
                      </span>
                      <p className="text-emerald-800 italic">
                        "{selectedClarification.bidder_reply}"
                      </p>
                      <span className="text-[10px] text-emerald-600 block mt-1">
                        Dispatched: {new Date(selectedClarification.replied_at || Date.now()).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Submit Rectification / Bidder Explanation
                    </h4>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Explanation Note to Procurement Officer:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="State clearly how the discrepancy has been addressed and provide details of the attached document..."
                        className="w-full text-xs border border-slate-300 rounded p-2.5 focus:ring-1 focus:ring-[#0F294A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Attach Corrected / Replacement Document:
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#0F294A] file:text-white hover:file:bg-blue-900 border border-slate-200 p-1.5 rounded"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-5 rounded flex items-center space-x-1.5 shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Submitting Response..." : "Dispatch Clarification Reply"}</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Select a clarification from the list to view instructions and reply.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
