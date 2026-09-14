"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Cpu,
  Lock,
  CheckCircle2,
  FileText,
  Activity,
  UserCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
  Bell,
  ExternalLink,
  Building2,
  FileSpreadsheet,
  Award,
  BookOpen,
  HelpCircle,
  LogIn,
  UserPlus,
  Flame,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function LandingPage() {
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

  const slides = [
    {
      title: "Chennai Petroleum Corporation Limited (CPCL)",
      subtitle: "Ministry of Petroleum & Natural Gas • Government of India",
      headline: "Invitation for Expression of Interest (EoI)",
      description:
        "Global E-Procurement Tenders for Manali & Nagapattinam Refineries. AI-Assisted Bid Compliance Verification with Tamper-Evident SHA-256 Audit Trail.",
      tag: "Notice No: CPCL/PROC/2026/089",
      bgGradient: "from-[#0F294A] via-[#1E3A8A] to-[#0F294A]",
      badge: "LIVE E-TENDER NOTICE",
      actionText: "View Tender Details",
      actionLink: "/login"
    },
    {
      title: "BharatTender Shield • Automated Bid Compliance",
      subtitle: "Government e-Marketplace (GeM) Integration Platform",
      headline: "Deterministic AI Rule Extraction & Verification",
      description:
        "Cross-verify GSTIN, PAN, Udyam MSME Certificates, Financial Turnover Thresholds, and Bid-Date Validity instantly with zero manual delay.",
      tag: "SIH 2026 • Problem Statement 26100",
      bgGradient: "from-[#064E3B] via-[#047857] to-[#064E3B]",
      badge: "AI-ASSISTED COMPLIANCE",
      actionText: "Access Demo Portal",
      actionLink: "/login"
    },
    {
      title: "Clean & Transparent Public Procurement",
      subtitle: "Chennai Petroleum Corporation Limited (CPCL)",
      headline: "Tamper-Evident SHA-256 Cryptographic Audit Logs",
      description:
        "Every verification decision, officer override, and document extraction is locked in an immutable hash chain for total legal defensibility.",
      tag: "CPCL Digital Initiative 2026",
      bgGradient: "from-[#7C2D12] via-[#C2410C] to-[#7C2D12]",
      badge: "SECURITY & AUDIT",
      actionText: "Inspect Audit Vault",
      actionLink: "/audit"
    }
  ];

  // Auto slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const tenders = [
    {
      id: "GEM-DEMO-2026-001",
      title: "Supply & Installation of High-Pressure Catalyst Tubes for CDU-III",
      dept: "Refinery Operations (CPCL Manali)",
      value: "₹ 14.50 Cr",
      deadline: "2026-10-15",
      category: "Equipment",
      status: "ACTIVE"
    },
    {
      id: "GEM-DEMO-2026-002",
      title: "Annual Maintenance & Turnaround Services for Fluid Catalytic Cracking Unit",
      dept: "Maintenance Division",
      value: "₹ 8.20 Cr",
      deadline: "2026-10-22",
      category: "Services",
      status: "ACTIVE"
    },
    {
      id: "GEM-DEMO-2026-003",
      title: "Procurement of Industrial Gas Sensors & Explosion-Proof Monitoring Systems",
      dept: "Safety & Environment",
      value: "₹ 3.75 Cr",
      deadline: "2026-11-05",
      category: "Safety",
      status: "NEW"
    },
    {
      id: "GEM-DEMO-2026-004",
      title: "Supply of High-Grade Desalination Chemicals & Water Treatment Reagents",
      dept: "Chemical Process Tech",
      value: "₹ 2.10 Cr",
      deadline: "2026-11-12",
      category: "Chemicals",
      status: "UPCOMING"
    }
  ];

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-900 ${
        fontSize === "large" ? "text-base" : fontSize === "xlarge" ? "text-lg" : "text-sm"
      }`}
    >
      {/* 1. TOP UTILITY BAR (Official Government Header Style) */}
      <div className="bg-[#0B1E36] text-slate-200 border-b border-blue-900/60 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left Government Org Branding */}
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-orange-400 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 inline" />
              <span>भारत सरकार | Govt. of India</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300 font-medium">
              पेट्रोलियम और प्राकृतिक गैस मंत्रालय | Ministry of Petroleum & Natural Gas
            </span>
          </div>

          {/* Right Utility Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 border-r border-slate-700 pr-3">
              <span className="text-[11px] text-slate-400">Font:</span>
              <button
                onClick={() => setFontSize("normal")}
                className={`px-1 rounded text-[11px] font-bold ${fontSize === "normal" ? "bg-orange-500 text-white" : "hover:text-white"}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-1 rounded text-[11px] font-bold ${fontSize === "large" ? "bg-orange-500 text-white" : "hover:text-white"}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize("xlarge")}
                className={`px-1 rounded text-[11px] font-bold ${fontSize === "xlarge" ? "bg-orange-500 text-white" : "hover:text-white"}`}
              >
                A++
              </button>
            </div>

            <div className="flex items-center space-x-1 text-slate-300">
              <Globe className="w-3.5 h-3.5" />
              <span className="font-medium text-[11px]">English / हिंदी</span>
            </div>

            <Link
              href="/login"
              className="bg-orange-600 hover:bg-orange-500 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>SIH Demo Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & BRANDING */}
      <header className="bg-white border-b border-slate-200 shadow-xs py-3 px-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          {/* Logo & Org Name */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 p-1 bg-white rounded border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
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
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F294A] tracking-tight leading-none">
                  Chennai Petroleum Corporation Limited
                </h1>
                <span className="hidden lg:inline-block bg-blue-100 text-[#0F294A] text-[10px] font-bold px-2 py-0.5 rounded">
                  A Group Company of IndianOil
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                BharatTender Shield — GeM Procurement Compliance & AI Verification System
              </p>
            </div>
          </div>

          {/* Search Bar & Quick Actions */}
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <input
                type="text"
                placeholder="Search Tenders, Rules, GSTIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F294A] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <Link
              href="/login"
              className="bg-[#0F294A] hover:bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center space-x-1.5 shrink-0 shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Officer / Vendor Sign In</span>
            </Link>
          </div>
        </div>

        {/* 3. NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto mt-3 border-t border-slate-100 pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex flex-wrap items-center space-x-1 sm:space-x-4 text-slate-700">
            <Link href="/" className="bg-[#0F294A] text-white px-3 py-1.5 rounded-md font-bold">
              Home
            </Link>
            <Link href="#tenders" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors">
              Active Tenders
            </Link>
            <Link href="#verification" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors">
              AI Verification Engine
            </Link>
            <Link href="#quicklinks" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors">
              Quick Links & Services
            </Link>
            <Link href="/audit" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-orange-600 inline" />
              <span>SHA-256 Audit Vault</span>
            </Link>
            <Link href="/login" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors">
              Vendor Registration
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-orange-700 font-bold bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
            <Flame className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            <span>SIH 2026 Live Demo Online</span>
          </div>
        </div>
      </header>

      {/* 4. HERO SLIDER / CAROUSEL (MeitY Style Announcement Banner) */}
      <section className="relative bg-slate-900 text-white overflow-hidden shadow-md">
        <div className={`bg-gradient-to-r ${slides[currentSlide].bgGradient} transition-all duration-700 py-12 px-4 sm:px-8`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Carousel Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-300 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                <span>{slides[currentSlide].badge}</span>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  {slides[currentSlide].subtitle}
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 leading-tight">
                  {slides[currentSlide].headline}
                </h2>
              </div>

              <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl font-normal">
                {slides[currentSlide].description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={slides[currentSlide].actionLink}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-md font-bold text-xs flex items-center space-x-2 transition-all shadow-md group"
                >
                  <span>{slides[currentSlide].actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-5 py-2.5 rounded-md font-semibold text-xs transition-colors"
                >
                  Instant SIH Evaluator Login
                </Link>
              </div>
            </div>

            {/* Carousel Right Visual Badge */}
            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-center space-y-4 shadow-xl max-w-xs">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">CPCL GeM Verification</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Powered by AI Rule Engine & Instant GST/Udyam Cross-Matching
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-[11px] text-orange-200 font-mono">
                  {slides[currentSlide].tag}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${currentSlide === idx ? "w-6 bg-orange-500" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* 5. NOTICE TICKER / LATEST ANNOUNCEMENTS */}
      <div className="bg-orange-500 text-white py-2 px-4 text-xs font-semibold flex items-center space-x-3 shadow-inner">
        <span className="bg-white text-orange-600 px-2 py-0.5 rounded font-bold uppercase text-[10px] shrink-0">
          Latest Notice
        </span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee inline-block font-medium">
            🔔 CPCL GEM-DEMO-2026-001 Tender Released • Mandatory AI Bidder Compliance Verification Active • Register as New Vendor or Access Officer Portal via SIH Demo Access •
          </div>
        </div>
      </div>

      {/* 6. MAIN CONTENT SECTION: TENDERS & QUICK LINKS */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* GRID: LIVE TENDERS + QUICK LINKS SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 8 COLS: ACTIVE TENDERS TABLE */}
          <div className="lg:col-span-8 space-y-6" id="tenders">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-[#0F294A] flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span>Active E-Procurement Tenders</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chennai Petroleum Corporation Limited (CPCL) — GeM Integrated Notices
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-1 text-xs">
                {["all", "Equipment", "Services", "Safety", "Chemicals"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                      activeTab === cat ? "bg-[#0F294A] text-white font-bold" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tender List */}
            <div className="space-y-3">
              {tenders
                .filter((t) => activeTab === "all" || t.category === activeTab)
                .map((tender) => (
                  <div
                    key={tender.id}
                    className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-50 text-[#0F294A] text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200">
                          {tender.id}
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {tender.status}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {tender.dept}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm hover:text-[#0F294A] transition-colors cursor-pointer">
                        {tender.title}
                      </h3>

                      <div className="flex items-center space-x-4 text-xs text-slate-600 pt-1">
                        <span>Estimated Value: <b className="text-slate-900">{tender.value}</b></span>
                        <span>•</span>
                        <span>Submission Deadline: <b className="text-orange-700">{tender.deadline}</b></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
                      <Link
                        href="/login"
                        className="w-full sm:w-auto bg-[#0F294A] hover:bg-blue-900 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center justify-center space-x-1 transition-colors"
                      >
                        <span>Apply & Verify</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0" />
                <span>All tender bids are verified using <b>BharatTender Shield Deterministic Rules Engine</b>.</span>
              </div>
              <Link href="/login" className="text-[#0F294A] font-bold hover:underline shrink-0 ml-2">
                View Verification Manual →
              </Link>
            </div>
          </div>

          {/* RIGHT 4 COLS: QUICK LINKS & USER PORTAL ACCESS */}
          <div className="lg:col-span-4 space-y-6" id="quicklinks">
            
            {/* Quick Demo Login Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <UserCheck className="w-5 h-5 text-[#0F294A]" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Instant Demo Portal Access</h3>
                  <p className="text-[11px] text-slate-500">Smart India Hackathon 2026 Evaluation</p>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                Log in to experience live procurement verification, discrepancy flagging, and evidence split-viewing:
              </p>

              <div className="space-y-2">
                <Link
                  href="/login"
                  className="w-full bg-[#0F294A] hover:bg-blue-900 text-white text-xs font-semibold py-2.5 px-3 rounded flex items-center justify-between transition-colors shadow-xs"
                >
                  <span>Sign In as Procurement Officer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded flex items-center justify-between transition-colors"
                >
                  <span>Sign In as Bidder A (Compliant)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded flex items-center justify-between transition-colors"
                >
                  <span>Sign In as Bidder B (Discrepant)</span>
                  <ArrowRight className="w-4 h-4 text-orange-600" />
                </Link>
              </div>
            </div>

            {/* Quick Navigation Services Grid */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-orange-600" />
                <span>Quick Links & Services</span>
              </h3>

              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li>
                  <Link href="/audit" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Cryptographic Audit Vault</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/officer/tenders" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Tender Compliance Compiler</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/bidder/apply" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4 text-orange-600" />
                      <span>New Vendor Registration</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-purple-600" />
                      <span>Vendor Helpdesk & Guidelines</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* 7. FEATURES & COMPLIANCE VERIFICATION HIGHLIGHTS */}
        <div className="pt-8 border-t border-slate-200" id="verification">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
            <h2 className="text-2xl font-black text-[#0F294A]">
              BharatTender Shield Platform Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Ensuring 100% transparent, evidence-backed government procurement verification with human-in-the-loop governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Deterministic Rule Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tender-to-Rule engine automatically parses qualification criteria (GSTIN validity, turnover thresholds, Udyam MSME date ranges) into executable validation pipelines.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Evidence Split-Viewer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Procurement Officers inspect original PDF document evidence side-by-side with extracted data, confidence scores, and rule verification outputs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-700 rounded-md flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">SHA-256 Tamper-Evident Logs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every officer approval, override, and bidder clarification response is chained into an immutable SHA-256 cryptographic audit trail for zero post-bid tampering.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* 8. OFFICIAL GOVERNMENT PORTAL FOOTER */}
      <footer className="bg-[#0B1E36] text-slate-400 text-xs py-10 border-t-4 border-orange-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center">
                <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">CPCL Portal</h4>
                <p className="text-[11px] text-slate-400">Chennai Petroleum Corp Ltd</p>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              A Group Company of IndianOil under the Ministry of Petroleum & Natural Gas, Government of India.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Navigation</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/" className="hover:text-white">CPCL Home</Link></li>
              <li><Link href="#tenders" className="hover:text-white">Live E-Procurement Notices</Link></li>
              <li><Link href="/audit" className="hover:text-white">SHA-256 Audit Trail Vault</Link></li>
              <li><Link href="/login" className="hover:text-white">Vendor Registration & Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Government Portals</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Government e-Marketplace (GeM)</a></li>
              <li><a href="https://mopng.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Ministry of Petroleum & Natural Gas</a></li>
              <li><a href="https://cpcl.co.in" target="_blank" rel="noreferrer" className="hover:text-white">CPCL Official Portal</a></li>
              <li><a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">National Portal of India</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">SIH Hackathon 2026</h5>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-2">
              Developed for Smart India Hackathon 2026 • Problem Statement 26100 (GeM Procurement Compliance Engine).
            </p>
            <p className="text-[10px] text-orange-400 font-mono">
              Status: Operational & Tested
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-slate-800 flex flex-wrap justify-between items-center text-[11px] text-slate-500">
          <p>© 2026 Chennai Petroleum Corporation Limited (CPCL) & BharatTender Shield. All Rights Reserved.</p>
          <p>Designed in alignment with Government of India Web Guidelines (GIGW).</p>
        </div>
      </footer>
    </div>
  );
}
