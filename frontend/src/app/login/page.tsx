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
  HomeIcon as Home,
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please check your email and password.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-[#0F1E35] dark:to-slate-900 flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#0F294A] dark:bg-slate-900 text-white py-2 px-4 text-center text-xs font-medium border-b border-transparent dark:border-slate-800 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-1.5 text-blue-300 hover:text-white transition-colors text-xs font-semibold"
          aria-label="Go to Home Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <span className="hidden sm:inline text-slate-300">
          Government of India &nbsp;•&nbsp; Ministry of Petroleum &amp; Natural Gas &nbsp;•&nbsp; Secure Procurement Portal
        </span>
        <span className="sm:hidden text-slate-300">BharatTender Shield &nbsp;•&nbsp; Secure Portal</span>
        <div className="w-16 hidden sm:block" /> {/* spacer to center text */}
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
              <div className="inline-flex items-center space-x-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <Shield className="w-3 h-3" />
                <span>SHA-256 Cryptographically Secured</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F294A] dark:text-white leading-tight">
                BharatTender Shield
              </h1>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-1">
                Every Bid Verified. Every Decision Defensible.
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0">
              AI-assisted bid compliance verification for transparent, evidence-based
              government procurement. Cross-verifies GST, PAN, Udyam MSME, and
              bid-date validity with tamper-evident audit trails.
            </p>

            <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto lg:mx-0">
              {[
                { icon: CheckCircle2, label: "Deterministic Rules", color: "text-emerald-600 dark:text-emerald-400" },
                { icon: Shield, label: "SHA-256 Audit Chain", color: "text-[#0F294A] dark:text-blue-400" },
                { icon: Cpu, label: "AI Evidence Extraction", color: "text-orange-600 dark:text-orange-400" },
                { icon: UserCheck, label: "Human-in-the-Loop", color: "text-blue-700 dark:text-blue-400" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center space-x-2 bg-white dark:bg-[#0F1E35] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login Card */}
          <div>
            <div className="bg-white dark:bg-[#0F1E35] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0F294A] dark:text-white">Portal Sign In</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sign in with your official credentials to access the procurement portal.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs p-3 rounded-xl flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your official email"
                    className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F294A]/30 dark:focus:ring-blue-500/50 focus:border-[#0F294A] dark:focus:border-blue-500 transition-all"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center space-x-1 transition-colors"
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
                    className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F294A]/30 dark:focus:ring-blue-500/50 focus:border-[#0F294A] dark:focus:border-blue-500 transition-all"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0F294A] dark:bg-blue-600 hover:bg-blue-900 dark:hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoading ? "Verifying Credentials..." : "Secure Sign In"}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Contact your system administrator if you cannot access your account.
                </p>
              </div>
            </div>

            {/* Back to Home — prominent button */}
            <div className="mt-4">
              <Link
                href="/"
                className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home Page</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0F1E35]/80 text-center text-xs text-slate-500 dark:text-slate-400">
        BharatTender Shield &nbsp;•&nbsp; GeM Procurement Compliance System &nbsp;•&nbsp; Government of India
      </footer>
    </div>
  );
}
