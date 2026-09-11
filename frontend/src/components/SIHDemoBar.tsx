"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, UserCheck, AlertTriangle, Layers, Info, CheckCircle2 } from "lucide-react";

export const SIHDemoBar: React.FC = () => {
  const { role, user, demoLogin } = useAuth();
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="bg-[#0F294A] text-white border-b border-blue-900/60 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between shadow-sm z-50 sticky top-0">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 font-semibold text-orange-400">
          <Shield className="w-3.5 h-3.5" />
          <span>SIH 2026 Problem 26100</span>
        </div>
        <span className="text-slate-400">|</span>
        <span className="hidden sm:inline text-slate-300">
          Active Role: <span className="text-white font-medium">{role || "Not Logged In"}</span> {user?.full_name ? `(${user.full_name})` : ""}
        </span>
      </div>

      <div className="flex items-center space-x-2 my-1 sm:my-0">
        <span className="text-slate-300 font-medium hidden md:inline">Quick Demo Switch:</span>
        <button
          onClick={() => demoLogin("officer")}
          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center space-x-1 ${
            role === "PROCUREMENT_OFFICER"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-700/70 hover:bg-slate-700 text-slate-200"
          }`}
          title="Procurement Officer Dashboard"
        >
          <UserCheck className="w-3 h-3" />
          <span>Officer (Verma)</span>
        </button>

        <button
          onClick={() => demoLogin("bidder")}
          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center space-x-1 ${
            role === "BIDDER" && user?.email === "bidder@gemsentinel.demo"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-700/70 hover:bg-slate-700 text-slate-200"
          }`}
          title="Compliant Bidder (Score 94% / LOW Risk)"
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Bidder A (Compliant)</span>
        </button>

        <button
          onClick={() => demoLogin("bidder_b")}
          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center space-x-1 ${
            role === "BIDDER" && user?.email === "bidder_b@gemsentinel.demo"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-slate-700/70 hover:bg-slate-700 text-slate-200"
          }`}
          title="Bidder with GSTIN Mismatch & Expired Udyam (Score 59% / HIGH Risk)"
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Bidder B (Discrepancies)</span>
        </button>

        <button
          onClick={() => demoLogin("admin")}
          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center space-x-1 ${
            role === "ADMIN"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-700/70 hover:bg-slate-700 text-slate-200"
          }`}
          title="Admin Console"
        >
          <Layers className="w-3 h-3" />
          <span>Admin</span>
        </button>

        <button
          onClick={() => setShowSteps(!showSteps)}
          className="ml-2 px-2 py-1 bg-orange-600/80 hover:bg-orange-600 rounded text-[11px] font-medium text-white flex items-center space-x-1"
        >
          <Info className="w-3 h-3" />
          <span>5-Min Pitch Guide</span>
        </button>
      </div>

      {showSteps && (
        <div className="w-full mt-2 pt-2 border-t border-slate-700 text-slate-200 bg-slate-900/95 p-3 rounded text-[12px] leading-relaxed shadow-lg">
          <div className="font-semibold text-orange-400 mb-1 flex items-center justify-between">
            <span>SIH 5-Minute Live Presentation Walkthrough:</span>
            <button onClick={() => setShowSteps(false)} className="text-slate-400 hover:text-white">✕ Close</button>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li><b>Login as Officer:</b> View executive metrics (Active Tenders, High Risk Bidders).</li>
            <li><b>Open GEM-DEMO-2026-001:</b> Inspect extracted compliance rules from Tender-to-Rule compiler.</li>
            <li><b>Select Bidder B (DEF Safety):</b> Click <i>Run AI Verification</i> — watch multi-stage pipeline.</li>
            <li><b>Inspect Discrepancies:</b> Compliance Score (59/100, HIGH Risk). Notice GSTIN mismatch & expired Udyam on bid date.</li>
            <li><b>Click [View Evidence]:</b> Showcase the split viewer with extracted value vs conflicting value, source document, and confidence.</li>
            <li><b>Send Clarification:</b> Officer requests clarification. Switch to <i>Bidder B</i> to review and respond.</li>
            <li><b>Officer Final Decision:</b> Officer marks decision with mandatory legal confirmation (AI assists; Officer decides).</li>
            <li><b>Generate Report & Audit:</b> Download ReportLab PDF and verify SHA-256 tamper-evident hash chain integrity.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
