"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, ArrowRight, Lock, Key, ShieldCheck, UserCheck, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { login, demoLogin, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid administrator credentials.");
    }
  };

  const handleQuickDemoAdmin = async () => {
    setError(null);
    try {
      await demoLogin("admin");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Demo login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Top Banner */}
      <div className="bg-[#0B1E36] text-white py-2 px-4 text-center text-xs font-semibold tracking-wide border-b border-blue-900">
        Government of India • Ministry of Petroleum & Natural Gas • Chennai Petroleum Corporation Limited (CPCL)
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6">
          
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
              <Image
                src="/logo.jpg"
                alt="BharatTender Shield Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#0B1E36] tracking-tight">
                Admin Security Portal
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Chennai Petroleum Corporation Limited (CPCL) Governance Console
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Lock className="w-5 h-5 text-orange-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Administrator Sign In</h2>
                <p className="text-[11px] text-slate-500">Restricted to authorized system admins & security officers</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-md flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Administrator Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gemsentinel.demo"
                  className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B1E36] focus:border-[#0B1E36] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Administrator Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full text-xs border border-slate-300 rounded-md p-2.5 pr-10 focus:outline-none focus:ring-1 focus:ring-[#0B1E36] focus:border-[#0B1E36] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B1E36] hover:bg-blue-950 text-white font-bold py-2.5 px-4 rounded-md text-xs flex items-center justify-center space-x-2 transition-colors shadow-xs"
              >
                <span>{isLoading ? "Authenticating Admin..." : "Sign In to Admin Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Access Button */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold py-2 px-3 rounded flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#0B1E36]" />
                  <span>Instant Demo Admin Sign In</span>
                </div>
                <span className="text-[10px] text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded">
                  Admin
                </span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-[#0B1E36] font-medium">
              ← Return to CPCL Public Portal
            </Link>
          </div>

        </div>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-3 text-[11px] text-center">
        CPCL Administrative Governance • SHA-256 Protected Portal
      </footer>
    </div>
  );
}
