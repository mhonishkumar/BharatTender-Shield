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
  History as HistoryIcon,
  FileSpreadsheet,
  Building,
  CheckCircle,
  HelpCircle,
  LogIn,
  ShieldCheck,
  Menu,
  X,
  Landmark,
  Briefcase,
  Award,
  Sparkles,
  DollarSign,
  Scale,
  Zap,
  ExternalLink
} from "lucide-react";
import { Chatbot } from "@/components/Chatbot";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSchemeModal, setActiveSchemeModal] = useState<any | null>(null);

  const governmentSchemes = [
    {
      id: "msme-sambandh",
      title: "MSME Sambandh & PPP Policy",
      subtitle: "Mandatory 25% Procurement Mandate",
      desc: "Monitors and ensures the mandatory 25% annual procurement from Micro and Small Enterprises (MSEs) by Central Ministries and CPSEs, including 4% from SC/ST and 3% from Women entrepreneurs.",
      tag: "Statutory Mandate",
      color: "border-blue-200 bg-blue-50/50 text-blue-900",
      icon: Scale
    },
    {
      id: "make-in-india",
      title: "Public Procurement (Make in India)",
      subtitle: "PPP-MII Order 2017 (Revised)",
      desc: "Grants purchase preference to Class-I local suppliers (local content ≥ 50%) and Class-II local suppliers (≥ 20%) in all tenders with non-splittable and splittable procurement bids.",
      tag: "Local Content Preference",
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
      icon: Award
    },
    {
      id: "treds",
      title: "TReDS Integration",
      subtitle: "Trade Receivables Discounting System",
      desc: "Institutional mechanism for discounting trade receivables of MSMEs from corporate and government buyers to ensure liquidity and eliminate 45-day delayed payment bottlenecks.",
      tag: "Financial Liquidity",
      color: "border-purple-200 bg-purple-50/50 text-purple-900",
      icon: DollarSign
    },
    {
      id: "startup-india",
      title: "Startup India Tender Exemptions",
      subtitle: "DPIIT Recognized Entities",
      desc: "Relaxes prior turnover and prior experience criteria for DPIIT-recognized startups in government tenders, subject to meeting technical specifications and quality parameters.",
      tag: "Turnover Exemption",
      color: "border-amber-200 bg-amber-50/50 text-amber-900",
      icon: Zap
    },
    {
      id: "gem-sahay",
      title: "GeM Sahay 2.0",
      subtitle: "Instant Collateral-Free GeM Financing",
      desc: "Enables sole proprietors and MSMEs to access frictionless instant working capital against purchase orders directly on GeM with frictionless disbursal.",
      tag: "Collateral-Free Loan",
      color: "border-rose-200 bg-rose-50/50 text-rose-900",
      icon: Sparkles
    },
    {
      id: "atmanirbhar",
      title: "Atmanirbhar Bharat Global Tender Ban",
      subtitle: "No Global Tender Enquiries < ₹200 Cr",
      desc: "Enforces GFR Rule 161 (iv) prohibiting Global Tender Enquiries (GTE) for tenders below ₹200 Crores, strictly shielding domestic suppliers and manufacturers.",
      tag: "Domestic Shield",
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-900",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-900 flex flex-col justify-between">
      <div>
        {/* 1. TOP NAVBAR */}
        <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Official Brand Logo & Title */}
            <Link href="/" className="flex items-center space-x-3 group z-50">
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
                <span className="font-extrabold text-base sm:text-lg text-[#0F294A] leading-tight group-hover:text-blue-900 transition-colors">
                  BharatTender <span className="text-emerald-600">Shield</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 leading-none hidden sm:block">
                  Every Bid Verified. Every Decision Defensible.
                </span>
              </div>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden z-50 p-2 text-slate-600 hover:text-[#0F294A] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-600">
              {[
                { name: "Home", href: "#home" },
                { name: "Upcoming Tenders", href: "#tenders" },
                { name: "Govt Schemes", href: "#schemes" },
                { name: "How It Works", href: "#how-it-works" },
                { name: "Features", href: "#features" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name.toLowerCase())}
                  className={`transition-colors border-b-2 py-1 ${
                    activeTab === item.name.toLowerCase() ? "text-[#0F294A] border-[#0F294A] font-bold" : "border-transparent hover:text-slate-900"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Desktop Auth Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/login"
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
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

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-4 flex flex-col space-y-3 z-50">
              {[
                { name: "Home", href: "#home" },
                { name: "Upcoming Tenders", href: "#tenders" },
                { name: "Government Schemes", href: "#schemes" },
                { name: "How It Works", href: "#how-it-works" },
                { name: "Key Features", href: "#features" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.name.toLowerCase());
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm font-semibold p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 w-full"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#0F294A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 w-full shadow-md"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* 2. HERO SECTION */}
        <section id="home" className="relative bg-gradient-to-b from-blue-50/60 via-white to-[#F8FAFC] pt-8 md:pt-14 pb-12 md:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Text Content */}
            <div className="lg:col-span-7 space-y-5 md:space-y-6 text-left">
              {/* SIH Pill Tag */}
              <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 text-orange-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <span className="text-orange-600">🏆</span>
                <span>Smart India Hackathon 2026 | PS 26100</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-mono text-[11px]">SHA-256 Verified</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0F294A] leading-tight">
                Bharat<span className="text-orange-500">Tender</span> <span className="text-emerald-600">Shield</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                Every Bid Verified. Every Decision Defensible.
              </p>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                AI-assisted bid compliance verification and cross-document discrepancy detection platform for transparent, evidence-based GeM and public procurement.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="bg-[#0F294A] hover:bg-blue-900 text-white px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
                >
                  <span>Login to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-95"
                >
                  <Play className="w-4 h-4 text-[#0F294A] fill-[#0F294A]" />
                  <span>How It Works</span>
                </a>

                <Link
                  href="/admin"
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-5 py-3 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-xs"
                >
                  <Lock className="w-4 h-4 text-purple-700" />
                  <span>Admin Console</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero-Trust Cryptographic Hash</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Deterministic Rule Engine</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>Human-in-the-Loop Verdicts</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Badge */}
            <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0">
              <div className="relative max-w-sm md:max-w-md w-full p-6 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-4 text-center">
                <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto flex items-center justify-center">
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
                  <div className="mt-3 inline-block bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-1 rounded border border-slate-200">
                    SHA-256 Hash Chain Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. UPCOMING TENDERS SECTION */}
        <section id="tenders" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Public Procurement Notices</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight">
                  Upcoming & Active Tenders
                </h2>
                <p className="text-sm text-slate-500 mt-1">Live high-value government procurement opportunities ready for verified bidding.</p>
              </div>
              <Link
                href="/officer/tenders"
                className="text-xs sm:text-sm font-bold text-[#0F294A] hover:text-blue-800 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg border border-slate-200 flex items-center justify-center transition-colors"
              >
                <span>Browse All Tenders</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: "GEM-DEMO-2026-001",
                  title: "Supply of Industrial Safety Equipment & Protective Gear",
                  dept: "Ministry of Petroleum & Natural Gas • CPCL",
                  value: "₹50 Lakhs",
                  deadline: "10-06-2026",
                  category: "Safety Equipment",
                  status: "Active",
                  criteria: "GST, PAN, Udyam MSME, Turnover ₹50L"
                },
                {
                  id: "GEM-2026-002",
                  title: "High-Performance Cloud Compute & Server Upgradation",
                  dept: "Department of Telecommunications (DoT)",
                  value: "₹1.45 Crores",
                  deadline: "18-07-2026",
                  category: "IT Hardware",
                  status: "Upcoming",
                  criteria: "Class-I Local Supplier (PPP-MII), ISO 27001"
                },
                {
                  id: "GEM-2026-003",
                  title: "Refinery Pipeline Corrosion Monitoring Sensors",
                  dept: "Indian Oil Corporation Limited (IOCL)",
                  value: "₹3.80 Crores",
                  deadline: "25-08-2026",
                  category: "Engineering & Machinery",
                  status: "Upcoming",
                  criteria: "PESO Certification, Min 3 Yrs Experience"
                },
              ].map((tender) => (
                <div key={tender.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-[#0F294A] hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="bg-[#0F294A] text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded">
                        {tender.id}
                      </span>
                      <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center">
                        <HistoryIcon className="w-3 h-3 mr-1" /> Closes: {tender.deadline}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 leading-snug text-base">{tender.title}</h3>
                    
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center text-slate-600">
                        <Landmark className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                        <span className="truncate">{tender.dept}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Briefcase className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                        <span>Estimated Value: <strong className="text-slate-900 font-bold">{tender.value}</strong></span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                      <span className="font-bold text-slate-700 block mb-0.5">Mandatory Criteria:</span>
                      <span className="text-slate-500">{tender.criteria}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200 flex items-center space-x-2">
                    <Link
                      href="/bidder/apply"
                      className="flex-1 text-center bg-[#0F294A] hover:bg-blue-900 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-xs"
                    >
                      Apply for Tender
                    </Link>
                    <Link
                      href="/officer/verification/2"
                      className="text-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors"
                      title="Inspect Verification Demo"
                    >
                      Demo Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. GOVERNMENT SCHEMES & PUBLIC PROCUREMENT POLICIES */}
        <section id="schemes" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <Landmark className="w-4 h-4" />
                <span>National Procurement Mandates & Schemes</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight">
                Government Procurement Schemes & Protections
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                BharatTender Shield automatically cross-verifies bidder eligibility against all statutory Government of India procurement mandates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {governmentSchemes.map((scheme) => {
                const Icon = scheme.icon;
                return (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between group hover:border-[#0F294A]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0F294A] group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {scheme.tag}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-[#0F294A] leading-tight">
                        {scheme.title}
                      </h3>
                      <h4 className="text-xs font-semibold text-emerald-700">
                        {scheme.subtitle}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {scheme.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveSchemeModal(scheme)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <span>View Scheme Guidelines</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-400">Rule Verified</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight text-center lg:text-left">
              How It Works: 7-Stage Cryptographic Pipeline
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* 7 Step Horizontal Pipeline */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                {[
                  { step: "1", title: "Tender", desc: "Published on GeM", icon: FileText },
                  { step: "2", title: "Bidder Docs", desc: "Uploaded by bidders", icon: UserCheck },
                  { step: "3", title: "AI Extractions", desc: "Extracts key info", icon: Cpu },
                  { step: "4", title: "Verification", desc: "Validates govt data", icon: ShieldCheck },
                  { step: "5", title: "Evidence Review", desc: "View detailed proof", icon: SearchCheck },
                  { step: "6", title: "Officer Decision", desc: "Approve / Reject", icon: CheckCircle2 },
                  { step: "7", title: "Audit Report", desc: "With SHA-256 log", icon: FileSpreadsheet },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col items-center space-y-2 shadow-2xs hover:border-[#0F294A] transition-colors relative">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0F294A]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[11px] md:text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Callout Box */}
              <div className="lg:col-span-4 bg-emerald-50/70 border border-emerald-200 p-6 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2.5 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <h3 className="text-base sm:text-lg font-black">AI assists. Officers decide.</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Every determination is cross-referenced with statutory registries (GSTN, MCA, Udyam) and sealed into a tamper-evident SHA-256 audit log.
                </p>
                <div className="pt-2">
                  <Link
                    href="/officer/verification/2"
                    className="inline-flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>Try Hero Verification Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. KEY FEATURES SECTION */}
        <section id="features" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight">
                Enterprise Key Features
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Built specifically for Smart India Hackathon 2026 Problem Statement 26100.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "AI-assisted document verification", icon: FileCheck, color: "text-blue-600", desc: "Automated OCR and semantic parsing of complex multi-page tender bids." },
                { title: "Cross-document discrepancy detection", icon: Layers, color: "text-emerald-600", desc: "Finds mismatch between turnover certificates, balance sheets, and GST returns." },
                { title: "Time-aware compliance validation", icon: HistoryIcon, color: "text-orange-600", desc: "Checks registration dates against tender cut-off and bid submission deadlines." },
                { title: "Evidence-based verification split UI", icon: ShieldCheck, color: "text-[#0F294A]", desc: "Side-by-side original source document viewer with highlighted findings." },
                { title: "Risk scoring & classification", icon: AlertTriangle, color: "text-blue-700", desc: "Granular risk scores (0-100) based on severity of statutory rule violations." },
                { title: "Clarification workflow & messaging", icon: MessageSquare, color: "text-emerald-700", desc: "Interactive clarification channel between procurement officers and bidders." },
                { title: "Tamper-evident SHA-256 audit trail", icon: Lock, color: "text-orange-700", desc: "Cryptographic hash chaining guaranteeing defensibility against legal challenges." },
                { title: "Comprehensive compliance reports", icon: FileSpreadsheet, color: "text-purple-700", desc: "Printable, audit-ready PDF/HTML reports with complete evidence index." },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 w-fit mb-3">
                        <Icon className={`w-5 h-5 ${feat.color}`} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug mb-1.5">
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. GOVERNMENT PARTNERSHIPS */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
           <div className="max-w-7xl mx-auto text-center space-y-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Procurement Ecosystem Integration
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Building className="w-8 h-8 text-[#0F294A] mb-2" />
                    <span className="text-xs font-bold text-slate-800">Ministry of Petroleum</span>
                    <span className="text-[10px] text-slate-500">Government of India</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Landmark className="w-8 h-8 text-[#0F294A] mb-2" />
                    <span className="text-xs font-bold text-slate-800">GeM Portal</span>
                    <span className="text-[10px] text-slate-500">Government e-Marketplace</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Shield className="w-8 h-8 text-emerald-700 mb-2" />
                    <span className="text-xs font-bold text-slate-800">CPCL Procurement</span>
                    <span className="text-[10px] text-slate-500">Chennai Petroleum Corp</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Cpu className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-xs font-bold text-slate-800">SIH 2026</span>
                    <span className="text-[10px] text-slate-500">Smart India Hackathon</span>
                  </div>
              </div>
           </div>
        </section>
      </div>

      {/* 8. SCHEME DETAIL MODAL */}
      {activeSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                {activeSchemeModal.tag}
              </span>
              <button
                onClick={() => setActiveSchemeModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0F294A]">{activeSchemeModal.title}</h3>
              <h4 className="text-xs font-semibold text-emerald-600">{activeSchemeModal.subtitle}</h4>
              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                {activeSchemeModal.desc}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 block">Automated Engine Check:</span>
              <p className="text-slate-600 text-[11px]">
                In BharatTender Shield, all uploaded MSME certificates, turnover balance sheets, and DPIIT recognition letters are verified against live databases via deterministic checks.
              </p>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setActiveSchemeModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold bg-[#0F294A] hover:bg-blue-900 text-white rounded-lg transition-colors"
              >
                Login & Test Eligibility
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 9. FOOTER */}
      <footer className="bg-[#0B1E36] text-slate-300 text-xs py-8 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="font-bold text-sm text-white">
              BharatTender Shield — SIH 2026 Problem Statement 26100
            </div>
            <p className="text-[11px] text-slate-400">
              Government e-Marketplace (GeM) & CPCL AI-Powered Bid Compliance System
            </p>
            <div className="text-[10px] text-slate-500">
              Protected by SHA-256 tamper-evident cryptographic hash chains • Zero-Trust Procurement Architecture
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <Link href="/login" className="hover:text-white transition-colors">Portal Login</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin Console</Link>
            <Link href="/officer/verification/2" className="hover:text-white transition-colors">Hero Demo</Link>
            <Link href="/audit" className="hover:text-white transition-colors">Audit Logs</Link>
          </div>
        </div>
      </footer>

      {/* Floating Local AI Security Chatbot */}
      <Chatbot />
    </div>
  );
}
