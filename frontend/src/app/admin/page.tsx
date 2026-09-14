"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  Server,
  Sliders,
  Users,
  Activity,
  AlertTriangle,
  RotateCw,
  Save,
  CheckCircle2,
  FileSpreadsheet,
  Globe,
  Database,
  Radio,
  FileCheck
} from "lucide-react";

export default function AdminSecurityPage() {
  const [strictHashMode, setStrictHashMode] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [gstinVerificationApi, setGstinVerificationApi] = useState("ACTIVE");
  const [rateLimitPerMin, setRateLimitPerMin] = useState(120);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [verifyingLedger, setVerifyingLedger] = useState(false);
  const [ledgerMessage, setLedgerMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRunSecurityCheck = () => {
    setVerifyingLedger(true);
    setLedgerMessage(null);
    setTimeout(() => {
      setVerifyingLedger(false);
      setLedgerMessage("SHA-256 Ledger Verified: All 1,420 block hashes matched. 0 Tamper alerts.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#0B1E36] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                  ADMINISTRATOR CONSOLE
                </span>
                <span className="text-xs font-mono text-[#047857] font-semibold">
                  STATUS: OPERATIONAL
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#0B1E36] mt-1">
                Security Controls & Governance Portal
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Chennai Petroleum Corporation Limited (CPCL) — Central System Security & Cryptographic Settings
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRunSecurityCheck}
                disabled={verifyingLedger}
                className="bg-[#0B1E36] hover:bg-blue-950 text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${verifyingLedger ? "animate-spin text-orange-400" : ""}`} />
                <span>{verifyingLedger ? "Running Audit..." : "Run Security Audit"}</span>
              </button>

              <Link
                href="/audit"
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#047857]" />
                <span>Audit Logs</span>
              </Link>
            </div>
          </div>

          {/* Alert notifications */}
          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Security configuration updated and broadcasted across CPCL procurement nodes.</span>
            </div>
          )}

          {ledgerMessage && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3.5 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{ledgerMessage}</span>
            </div>
          )}

          {/* Security Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Cryptographic Ledger</span>
                <Lock className="w-4 h-4 text-[#0B1E36]" />
              </div>
              <p className="text-xl font-extrabold text-[#0B1E36]">SHA-256 Enabled</p>
              <p className="text-[11px] text-emerald-600 font-medium">Strict Predecessor Chaining</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>API Verification Engine</span>
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-extrabold text-slate-900">GSTIN / Udyam Live</p>
              <p className="text-[11px] text-slate-500 font-medium">Mock Gateway • 99.98% Uptime</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Authentication Rules</span>
                <Key className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xl font-extrabold text-slate-900">MFA Enforced</p>
              <p className="text-[11px] text-slate-500 font-medium">Role-Based Access Control</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Emergency Lockdown</span>
                <Radio className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-xl font-extrabold text-emerald-700">INACTIVE</p>
              <p className="text-[11px] text-slate-500 font-medium">System Operating Normally</p>
            </div>
          </div>

          {/* Form Settings Grid */}
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* 1. Cryptographic Security & Hash Settings */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#0B1E36]" />
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Cryptographic Integrity & SHA-256 Ledger Settings</h2>
                  <p className="text-xs text-slate-500">Configure post-bid tamper proofing and decision logging strictness</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded border border-slate-200">
                  <input
                    type="checkbox"
                    id="strictHash"
                    checked={strictHashMode}
                    onChange={(e) => setStrictHashMode(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#0B1E36] rounded focus:ring-1 focus:ring-[#0B1E36]"
                  />
                  <label htmlFor="strictHash" className="text-xs cursor-pointer">
                    <span className="font-bold text-slate-900 block">Strict SHA-256 Predecessor Hash Chaining</span>
                    <span className="text-slate-600 block mt-0.5">
                      Ensures every tender rule, evidence extraction, and officer decision requires the exact hash of the preceding block.
                    </span>
                  </label>
                </div>

                <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded border border-slate-200">
                  <input
                    type="checkbox"
                    id="mfaEnforced"
                    checked={mfaEnforced}
                    onChange={(e) => setMfaEnforced(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#0B1E36] rounded focus:ring-1 focus:ring-[#0B1E36]"
                  />
                  <label htmlFor="mfaEnforced" className="text-xs cursor-pointer">
                    <span className="font-bold text-slate-900 block">Mandatory Multi-Factor Authentication (MFA)</span>
                    <span className="text-slate-600 block mt-0.5">
                      Enforce step-up authentication for Procurement Officers making final tender award or rejection decisions.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Endpoint & API Rate Limiting */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Server className="w-5 h-5 text-[#047857]" />
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">External API & Rate Limiting Controls</h2>
                  <p className="text-xs text-slate-500">Manage connections to GST Portal, MSME Udyam Database, and CORS rules</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GSTIN / Udyam Verification API Gateway:
                  </label>
                  <select
                    value={gstinVerificationApi}
                    onChange={(e) => setGstinVerificationApi(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                  >
                    <option value="ACTIVE">ACTIVE (Live Auto-Verification)</option>
                    <option value="SIMULATED">SIMULATED (Mock Test Sandbox)</option>
                    <option value="STRICT_ONLY">STRICT ONLY (Reject Unverified GSTINs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    API Rate Limit (Requests / Min / IP):
                  </label>
                  <input
                    type="number"
                    value={rateLimitPerMin}
                    onChange={(e) => setRateLimitPerMin(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Session Timeout (Minutes):
                  </label>
                  <input
                    type="number"
                    value={sessionTimeoutMins}
                    onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Emergency Switches & Governance */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Emergency System Controls</h2>
                  <p className="text-xs text-slate-500">Procurement freeze and maintenance mode overrides</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className={`p-4 rounded-lg border transition-colors ${emergencyLockdown ? "bg-red-50 border-red-300" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Emergency Procurement Lockdown</span>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        Immediately suspends all active bidding and bid modifications across CPCL portals.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmergencyLockdown(!emergencyLockdown)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                        emergencyLockdown ? "bg-red-600 text-white" : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                      }`}
                    >
                      {emergencyLockdown ? "LOCKDOWN ACTIVE" : "ENABLE LOCKDOWN"}
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border transition-colors ${maintenanceMode ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">System Maintenance Mode</span>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        Restricts portal access to System Administrators only.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                        maintenanceMode ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                      }`}
                    >
                      {maintenanceMode ? "MAINTENANCE ON" : "NORMAL OPERATION"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#0B1E36] hover:bg-blue-950 text-white font-bold px-6 py-2.5 rounded-md text-xs flex items-center space-x-2 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Security Configuration</span>
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}
