"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SIHDemoBar } from "@/components/SIHDemoBar";
import {
  ShieldCheckIcon as ShieldCheck,
  ExclamationTriangleIcon as ShieldAlert,
  ArrowPathIcon as RotateCw,
  HashtagIcon as Hash,
  ClockIcon as Clock,
  CheckBadgeIcon as UserCheck,
  CheckCircleIcon as CheckCircle2,
  LockClosedIcon as Lock,
  ArrowDownIcon as ArrowDown,
} from "@heroicons/react/24/outline";

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<any | null>(null);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    try {
      const res = await api.verifyAuditIntegrity();
      setIntegrityStatus(res);
    } catch (err: any) {
      alert(`Integrity verification failed: ${err.message}`);
    } finally {
      setVerifying(false);
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
              <div className="flex items-center space-x-2">
                <span className="bg-[#0F294A] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                  TAMPER-EVIDENT AUDIT TRAIL
                </span>
                <span className="text-xs font-mono text-slate-400">SHA-256 HASH CHAINING</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0F294A] mt-1">
                Cryptographic Procurement Audit Logs
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Every tender rule creation, document extraction, AI verification run, and officer decision is immutably hashed and chained.
              </p>
            </div>

            <button
              onClick={handleVerifyIntegrity}
              disabled={verifying}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} />
              <span>{verifying ? "Computing Hashes..." : "Verify Chain Integrity"}</span>
            </button>
          </div>

          {/* Integrity Status Card (If run) */}
          {integrityStatus && (
            <div
              className={`p-4 rounded-lg border flex items-center justify-between text-xs animate-in fade-in ${
                integrityStatus.is_valid
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                {integrityStatus.is_valid ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <span className="font-bold text-sm block">
                    {integrityStatus.is_valid ? "Cryptographic Chain 100% Intact" : "Chain Integrity Violation Detected!"}
                  </span>
                  <p className="text-xs mt-0.5">{integrityStatus.message}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold">
                {integrityStatus.total_records} Linked Blocks Verified
              </span>
            </div>
          )}

          {/* Audit Chain Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Immutable Ledger Records ({logs.length})
              </span>
              <span className="text-xs text-slate-400">
                Algorithm: SHA-256 with Predecessor Chaining
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Block #</th>
                    <th className="px-4 py-3">Timestamp (UTC)</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">User & Role</th>
                    <th className="px-4 py-3">Details</th>
                    <th className="px-4 py-3">Previous Hash</th>
                    <th className="px-4 py-3">Current Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#0F294A]">
                        #{log.id}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{log.user_email || "SYSTEM"}</div>
                        <span className="text-[10px] text-blue-700 font-semibold">{log.role || "SYSTEM"}</span>
                      </td>
                      <td className="px-4 py-3 max-w-xs text-slate-600 truncate" title={log.details}>
                        {log.details || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-400 max-w-[120px] truncate" title={log.previous_hash}>
                        {log.previous_hash.slice(0, 10)}...{log.previous_hash.slice(-6)}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-[#0F294A] font-bold max-w-[120px] truncate" title={log.current_hash}>
                        {log.current_hash.slice(0, 10)}...{log.current_hash.slice(-6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
