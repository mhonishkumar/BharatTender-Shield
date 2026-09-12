"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Shield, ArrowRight, CheckCircle2, Lock, UserCheck, ShieldAlert, Cpu } from "lucide-react";

export default function LoginPage() {
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-[#0F294A] text-white py-1.5 px-4 text-center text-xs font-medium tracking-wide">
        Smart India Hackathon 2026 — Problem Statement 26100 • GeM Procurement Compliance Platform
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Brand Visual Identity */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 p-1 bg-white rounded-lg border border-slate-200 shadow-xs">
                <Image
                  src="/logo.jpg"
                  alt="BharatTender Shield Official Logo"
                  width={128}
                  height={128}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F294A] leading-tight">
                BharatTender Shield
              </h1>
              <p className="text-base sm:text-lg font-medium text-orange-600 mt-1">
                "Every Bid Verified. Every Decision Defensible."
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0">
              AI-assisted bid compliance verification for transparent, evidence-based government procurement. Cross-verifies GST, PAN, Udyam MSME, financial thresholds, and bid-date validity with tamper-evident audit trails.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 max-w-sm mx-auto lg:mx-0 pt-2">
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Deterministic Rules</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded border border-slate-200">
                <Shield className="w-4 h-4 text-[#0F294A] shrink-0" />
                <span>SHA-256 Hash Chain</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded border border-slate-200">
                <Cpu className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Evidence-First Split UI</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded border border-slate-200">
                <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Human-in-the-Loop</span>
              </div>
            </div>
          </div>

          {/* Right Side: Clean Login Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#0F294A]">
                  Platform Sign In
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Access Procurement Officer, Bidder, or Admin consoles.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Official Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@gemsentinel.demo"
                    className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0F294A] focus:border-[#0F294A] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0F294A] focus:border-[#0F294A] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0F294A] hover:bg-blue-900 text-white font-medium py-2.5 px-4 rounded-md text-xs flex items-center justify-center space-x-2 transition-colors shadow-xs"
                >
                  <span>{isLoading ? "Authenticating..." : "Sign In to Portal"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* SIH Live Demo Quick Logins */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5 text-center">
                  Instant Demo Access (SIH Evaluation)
                </span>
                
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => demoLogin("officer")}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium py-2 px-3 rounded flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-[#0F294A]" />
                      <span>Continue as <b>Demo Officer</b> (Verma, IPoS)</span>
                    </div>
                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => demoLogin("bidder")}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium py-2 px-3 rounded flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Continue as <b>Demo Bidder A</b> (ABC Tech - Compliant)</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Bidder</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => demoLogin("bidder_b")}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium py-2 px-3 rounded flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Continue as <b>Demo Bidder B</b> (DEF Infra - Discrepancies)</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">Bidder</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
        BharatTender Shield • GeM Procurement Compliance System • SIH 2026 Problem Statement 26100
      </footer>
    </div>
  );
}
