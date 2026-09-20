"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheckIcon as Shield,
  ArrowRightIcon as ArrowRight,
  CheckCircleIcon as CheckCircle2,
  LockClosedIcon as Lock,
  ExclamationTriangleIcon as ShieldAlert,
  CpuChipIcon as Cpu,
  CheckBadgeIcon as UserCheck,
  EyeIcon as Eye,
  EyeSlashIcon as EyeOff,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#0F294A] text-white py-2 px-4 text-center text-xs font-medium">
        <span className="hidden sm:inline">
          Government of India &nbsp;•&nbsp; Ministry of Petroleum &amp; Natural Gas &nbsp;•&nbsp; Secure Procurement Portal
        </span>
        <span className="sm:hidden">BharatTender Shield &nbsp;•&nbsp; Secure Portal</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left: Brand */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl border border-slate-200 shadow-md flex items-center justify-center p-1.5">
                <Image
                  src="/logo.jpg"
                  alt="BharatTender Shield Logo"
                  width={88}
                  height={88}
                  className="object-contain rounded-xl"
                  priority
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <Shield className="w-3 h-3" />
                <span>SHA-256 Cryptographically Secured</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F294A] leading-tight">
                BharatTender Shield
              </h1>
              <p className="text-sm font-bold text-orange-600 mt-1">
                Every Bid Verified. Every Decision Defensible.
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0">
              AI-assisted bid compliance verification for transparent, evidence-based
              government procurement. Cross-verifies GST, PAN, Udyam MSME, and
              bid-date validity with tamper-evident audit trails.
            </p>

            <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto lg:mx-0">
              {[
                { icon: CheckCircle2, label: "Deterministic Rules", color: "text-emerald-600" },
                { icon: Shield, label: "SHA-256 Audit Chain", color: "text-[#0F294A]" },
                { icon: Cpu, label: "AI Evidence Extraction", color: "text-orange-600" },
                { icon: UserCheck, label: "Human-in-the-Loop", color: "text-blue-700" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                  <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                  <span className="text-xs font-semibold text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login Card */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0F294A]">Portal Sign In</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sign in with your official credentials to access the procurement portal.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your official email"
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F294A]/30 focus:border-[#0F294A] transition-all"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F294A]/30 focus:border-[#0F294A] transition-all"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0F294A] hover:bg-blue-900 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoading ? "Verifying Credentials..." : "Secure Sign In"}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Contact your system administrator if you cannot access your account.
                </p>
              </div>
            </div>

            {/* Back to home */}
            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-slate-500 hover:text-[#0F294A] flex items-center justify-center space-x-1 transition-colors">
                <span>← Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white/80 text-center text-xs text-slate-500">
        BharatTender Shield &nbsp;•&nbsp; GeM Procurement Compliance System &nbsp;•&nbsp; SIH 2026 Problem Statement 26100
      </footer>
    </div>
  );
}
