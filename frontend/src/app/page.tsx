"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Cpu,
  Lock,
  CheckCircle2,
  FileText,
  UserCheck,
  Play,
  Layers,
  FileCheck,
  SearchCheck,
  AlertTriangle,
  MessageSquare,
  History,
  FileSpreadsheet,
  Building,
  CheckCircle,
  HelpCircle,
  LogIn,
  ShieldCheck
} from "lucide-react";
import { Chatbot } from "@/components/Chatbot";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-900 flex flex-col justify-between">
      <div>
        {/* 1. TOP NAVBAR (Matching Image 3 Reference) */}
        <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Official Brand Logo & Title */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 p-0.5 bg-white rounded border border-slate-200 shadow-xs shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="BharatTender Shield Logo"
                  width={40}
                  height={40}
                  className="object-contain rounded"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-[#0F294A] leading-tight group-hover:text-blue-900 transition-colors">
                  BharatTender <span className="text-emerald-600">Shield</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 leading-none">
                  Every Bid Verified. Every Decision Defensible.
                </span>
              </div>
            </Link>

            {/* Center: Clean Public Navigation Links (Image 3) */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
              <a
                href="#home"
                onClick={() => setActiveTab("home")}
                className={`transition-colors border-b-2 py-1 ${
                  activeTab === "home" ? "text-[#0F294A] border-[#0F294A] font-bold" : "border-transparent hover:text-slate-900"
                }`}
              >
                Home
              </a>
              <a
                href="#about"
                onClick={() => setActiveTab("about")}
                className={`transition-colors border-b-2 py-1 ${
                  activeTab === "about" ? "text-[#0F294A] border-[#0F294A] font-bold" : "border-transparent hover:text-slate-900"
                }`}
              >
                About
              </a>
              <a
                href="#features"
                onClick={() => setActiveTab("features")}
                className={`transition-colors border-b-2 py-1 ${
                  activeTab === "features" ? "text-[#0F294A] border-[#0F294A] font-bold" : "border-transparent hover:text-slate-900"
                }`}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setActiveTab("how-it-works")}
                className={`transition-colors border-b-2 py-1 ${
                  activeTab === "how-it-works" ? "text-[#0F294A] border-[#0F294A] font-bold" : "border-transparent hover:text-slate-900"
                }`}
              >
                How It Works
              </a>
              <a
                href="#contact"
                onClick={() => setActiveTab("contact")}
                className={`transition-colors border-b-2 py-1 ${
                  activeTab === "contact" ? "text-[#0F294A] border-[#0F294A] font-bold" : "border-transparent hover:text-slate-900"
                }`}
              >
                Contact
              </a>
            </nav>

            {/* Right: Auth Action Buttons (Image 3) */}
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>

              <Link
                href="/login"
                className="bg-[#0F294A] hover:bg-blue-900 text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* 2. HERO SECTION (Matching Image 3 Reference) */}
        <section id="home" className="relative bg-gradient-to-b from-blue-50/50 via-white to-[#F8FAFC] pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* SIH Pill Tag */}
              <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="text-orange-600">🏆</span>
                <span>SIH 2026 | Problem Statement 26100</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#0F294A] leading-tight">
                Bharat<span className="text-orange-500">Tender</span> <span className="text-emerald-600">Shield</span>
              </h1>

              <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Every Bid Verified. Every Decision Defensible.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                AI-assisted bid compliance verification for transparent, evidence-based GeM procurement.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/login"
                  className="bg-[#0F294A] hover:bg-blue-900 text-white px-6 py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all shadow-md"
                >
                  <span>Login to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all shadow-xs"
                >
                  <Play className="w-4 h-4 text-[#0F294A] fill-[#0F294A]" />
                  <span>How It Works</span>
                </a>
              </div>
            </div>

            {/* Right Graphic Badge (Matching Image 3) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-md w-full p-6 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-4 text-center">
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <Image
                    src="/logo.jpg"
                    alt="BharatTender Shield Emblem"
                    width={180}
                    height={180}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-xs font-bold text-[#0F294A] block">
                    Government e Marketplace (GeM) Integrated
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    Ministry of Petroleum & Natural Gas • CPCL Portal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS SECTION (Matching Image 3 Reference) */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F294A] tracking-tight">
              How It Works
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* 7 Step Horizontal Pipeline */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                {[
                  { step: "1", title: "Tender", desc: "Published on GeM", icon: FileText },
                  { step: "2", title: "Bidder Documents", desc: "Uploaded by bidders", icon: UserCheck },
                  { step: "3", title: "AI Extraction", desc: "Extracts key information", icon: Cpu },
                  { step: "4", title: "Rule Verification", desc: "Validates with govt. data", icon: ShieldCheck },
                  { step: "5", title: "Evidence Review", desc: "View detailed proof", icon: SearchCheck },
                  { step: "6", title: "Officer Decision", desc: "Approve / Reject / Clarify", icon: CheckCircle2 },
                  { step: "7", title: "Audit-Ready Report", desc: "With SHA-256 log", icon: FileSpreadsheet },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col items-center space-y-2 shadow-2xs hover:border-[#0F294A] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0F294A]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Callout Box (Matching Image 3) */}
              <div className="lg:col-span-4 bg-emerald-50/60 border border-emerald-200 p-5 rounded-xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <h3 className="text-base font-extrabold">AI assists. Officers decide.</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Transparency. Accountability. Better Procurement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. KEY FEATURES SECTION (Matching Image 3 Reference) */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F294A] tracking-tight">
              Key Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "AI-assisted document verification", icon: FileCheck, color: "text-blue-600" },
                { title: "Cross-document discrepancy detection", icon: Layers, color: "text-emerald-600" },
                { title: "Time-aware compliance validation", icon: History, color: "text-orange-600" },
                { title: "Evidence-based verification", icon: ShieldCheck, color: "text-[#0F294A]" },
                { title: "Risk scoring & classification", icon: AlertTriangle, color: "text-blue-700" },
                { title: "Clarification workflow", icon: MessageSquare, color: "text-emerald-700" },
                { title: "Tamper-evident audit trail", icon: Lock, color: "text-orange-700" },
                { title: "Compliance reports", icon: FileSpreadsheet, color: "text-purple-700" },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5 hover:shadow-md transition-shadow">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 shrink-0">
                      <Icon className={`w-5 h-5 ${feat.color}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {feat.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* 5. FOOTER (Matching Image 3 Reference) */}
      <footer className="bg-[#0B1E36] text-slate-300 text-xs py-4 border-t border-blue-900 text-center">
        <div className="max-w-7xl mx-auto px-4 font-medium">
          BharatTender Shield | SIH 2026 | Government of India
        </div>
      </footer>

      {/* Floating Local AI Security Chatbot */}
      <Chatbot />
    </div>
  );
}
