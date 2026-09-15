"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  UserCheck,
  ShieldAlert,
  Cpu,
  KeyRound,
  Building,
  UserCog,
  Eye,
  EyeOff,
  Home
} from "lucide-react";

export default function LoginPage() {
  const { login, demoLogin, isLoading } = useAuth();
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
      setError(err.message || "Invalid login credentials. Use Demo@12345 for demo accounts.");
    }
  };

  const fillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("Demo@12345");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-[#0F294A] text-white py-2 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-between">
        <span className="hidden sm:inline">
          Government of India • Ministry of Petroleum & Natural Gas • Chennai Petroleum Corporation Limited (CPCL)
        </span>
        <span className="sm:hidden text-center w-full">
          BharatTender Shield • GeM Procurement
        </span>
        <Link
          href="/"
          className="hidden sm:flex items-center space-x-1 text-slate-300 hover:text-white transition-colors text-[11px]"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Brand Visual Identity */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Image
                  src="/logo.jpg"
                  alt="BharatTender Shield Official Logo"
                  width={112}
                  height={112}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-200 text-blue-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2">
                <Shield className="w-3 h-3 text-blue-700" />
                <span>SHA-256 Cryptographically Defensible</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F294A] leading-tight">
                BharatTender Shield
              </h1>
              <p className="text-sm sm:text-base font-bold text-orange-600 mt-1">
                "Every Bid Verified. Every Decision Defensible."
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0">
              AI-assisted bid compliance verification for transparent, evidence-based government procurement. Cross-verifies GST, PAN, Udyam MSME, and bid-date validity with tamper-evident audit trails.
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700 max-w-md mx-auto lg:mx-0 pt-1">
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[11px]">Deterministic Rules</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <Shield className="w-4 h-4 text-[#0F294A] shrink-0" />
                <span className="font-semibold text-[11px]">SHA-256 Chain</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <Cpu className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="font-semibold text-[11px]">Evidence Split UI</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="font-semibold text-[11px]">Human-in-the-Loop</span>
              </div>
            </div>
          </div>

          {/* Right Side: Clean Login Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F294A]">
                  Portal Sign In
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access Procurement Officer, Bidder Enterprise, or Central Admin Console.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* One-Click Quick Role Selector */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    Quick Demo Credentials
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-semibold">
                    Pass: Demo@12345
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillCredentials("officer@gemsentinel.demo")}
                    className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-[#0F294A] hover:shadow-2xs transition-all text-[11px]"
                  >
                    <div className="font-bold text-[#0F294A] flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Officer Portal</span>
                    </div>
                    <div className="text-slate-400 text-[10px] truncate">officer@gemsentinel.demo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials("admin@gemsentinel.demo")}
                    className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-[#0F294A] hover:shadow-2xs transition-all text-[11px]"
                  >
                    <div className="font-bold text-purple-900 flex items-center space-x-1">
                      <UserCog className="w-3.5 h-3.5 text-purple-600" />
                      <span>Admin Portal</span>
                    </div>
                    <div className="text-slate-400 text-[10px] truncate">admin@gemsentinel.demo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials("bidder@gemsentinel.demo")}
                    className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-[#0F294A] hover:shadow-2xs transition-all text-[11px]"
                  >
                    <div className="font-bold text-emerald-800 flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bidder A (Compliant)</span>
                    </div>
                    <div className="text-slate-400 text-[10px] truncate">bidder@gemsentinel.demo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials("bidder_b@gemsentinel.demo")}
                    className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-[#0F294A] hover:shadow-2xs transition-all text-[11px]"
                  >
                    <div className="font-bold text-orange-800 flex items-center space-x-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
                      <span>Bidder B (High Risk)</span>
                    </div>
                    <div className="text-slate-400 text-[10px] truncate">bidder_b@gemsentinel.demo</div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Official Email / ID:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. officer@gemsentinel.demo or admin@gemsentinel.demo"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F294A] focus:border-[#0F294A] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (Demo@12345)"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F294A] focus:border-[#0F294A] transition-all"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0F294A] hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-70"
                  >
                    <span>{isLoading ? "Verifying Credentials..." : "Secure Sign In to Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* 1-Click Instant Demo Access */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Instant Demo Login:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => demoLogin("officer")}
                    className="text-[#0F294A] font-bold hover:underline"
                  >
                    Officer
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => demoLogin("admin")}
                    className="text-purple-700 font-bold hover:underline"
                  >
                    Admin
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => demoLogin("bidder")}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Bidder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>BharatTender Shield • GeM Procurement Compliance System • SIH 2026 Problem Statement 26100</span>
          <Link href="/" className="text-blue-700 hover:underline font-semibold">
            ← Back to Landing Page
          </Link>
        </div>
      </footer>
    </div>
  );
}
