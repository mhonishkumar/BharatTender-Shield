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
  Building2,
  FileSpreadsheet,
  BookOpen,
  HelpCircle,
  LogIn,
  UserPlus,
  CheckCircle,
  ExternalLink,
  Layers,
  ChevronDown
} from "lucide-react";
import { translations, Language } from "@/lib/i18n";

export default function LandingPage() {
  const [lang, setLang] = useState<Language>("en");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = translations[lang] || translations.en;

  const languagesList: { code: Language; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", label: "Malayalam", native: "മലയാളം" },
  ];

  const slideGradients = [
    "from-[#0B1E36] via-[#16365C] to-[#0B1E36]",
    "from-[#064E3B] via-[#0D6B50] to-[#064E3B]",
    "from-[#7C2D12] via-[#9A3412] to-[#7C2D12]"
  ];

  const slideLinks = ["/login", "/login", "/audit"];

  // Auto slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % t.slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [t.slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % t.slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + t.slides.length) % t.slides.length);

  const tenders = [
    {
      id: "CPCL-PROC-2026-089",
      title: "Supply & Installation of High-Pressure Catalyst Tubes for CDU-III",
      dept: "Refinery Operations (CPCL Manali)",
      value: "₹ 14.50 Cr",
      deadline: "2026-10-15",
      category: "Equipment",
      status: "ACTIVE"
    },
    {
      id: "CPCL-PROC-2026-090",
      title: "Annual Turnaround & Maintenance Contract for Fluid Catalytic Cracker",
      dept: "Mechanical Maintenance",
      value: "₹ 8.20 Cr",
      deadline: "2026-10-22",
      category: "Services",
      status: "ACTIVE"
    },
    {
      id: "CPCL-PROC-2026-091",
      title: "Procurement of Industrial Gas Detectors & SIL-2 Safety Systems",
      dept: "HSE & Industrial Safety",
      value: "₹ 3.75 Cr",
      deadline: "2026-11-05",
      category: "Safety",
      status: "NEW"
    },
    {
      id: "CPCL-PROC-2026-092",
      title: "Bulk Supply of High-Grade Desalination & Demineralization Chemicals",
      dept: "Process Chemical Tech",
      value: "₹ 2.10 Cr",
      deadline: "2026-11-12",
      category: "Chemicals",
      status: "ACTIVE"
    }
  ];

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-900 ${
        fontSize === "large" ? "text-base" : fontSize === "xlarge" ? "text-lg" : "text-sm"
      }`}
    >
      {/* 1. TOP UTILITY BAR (Official Indian Government Portal Header) */}
      <div className="bg-[#0B1E36] text-slate-200 border-b border-blue-900/60 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left Government Organization Identity */}
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-orange-400 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 inline text-orange-400" />
              <span>{t.govtOfIndia}</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="hidden md:inline text-slate-300 font-medium">
              {t.ministryName}
            </span>
          </div>

          {/* Right Utility Controls: Font Sizing & 6-Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Font Accessibility */}
            <div className="flex items-center space-x-1 border-r border-slate-700 pr-3">
              <span className="text-[11px] text-slate-400 mr-1">Font:</span>
              <button
                onClick={() => setFontSize("normal")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  fontSize === "normal" ? "bg-orange-500 text-white" : "text-slate-300 hover:text-white"
                }`}
                title="Default Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  fontSize === "large" ? "bg-orange-500 text-white" : "text-slate-300 hover:text-white"
                }`}
                title="Large Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize("xlarge")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  fontSize === "xlarge" ? "bg-orange-500 text-white" : "text-slate-300 hover:text-white"
                }`}
                title="Extra Large Font Size"
              >
                A++
              </button>
            </div>

            {/* 6-Language Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] font-medium transition-colors border border-slate-700"
              >
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                <span>{languagesList.find((l) => l.code === lang)?.native || "Language"}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-50 text-xs">
                  {languagesList.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                        lang === item.code
                          ? "bg-blue-50 text-[#0F294A] font-bold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{item.native}</span>
                      <span className="text-[10px] text-slate-400">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors shadow-xs"
            >
              <LogIn className="w-3 h-3" />
              <span>{t.signInButton}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & LOGO BRANDING */}
      <header className="bg-white border-b border-slate-200 shadow-xs py-3 px-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          {/* Logo & Entity Name */}
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
                  {t.cpclFullName}
                </h1>
                <span className="hidden lg:inline-block bg-blue-50 text-[#0F294A] border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  {t.cpclGroupTag}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {t.platformSubtitle}
              </p>
            </div>
          </div>

          {/* Search Bar & Action */}
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F294A] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <Link
              href="/login"
              className="bg-[#0F294A] hover:bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center space-x-1.5 shrink-0 shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.signInButton}</span>
            </Link>
          </div>
        </div>

        {/* 3. NAVIGATION BAR (Clean, Instant, No Lag) */}
        <div className="max-w-7xl mx-auto mt-3 border-t border-slate-100 pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <nav className="flex flex-wrap items-center space-x-1 sm:space-x-3 text-slate-700">
            <Link href="/" className="bg-[#0F294A] text-white px-3 py-1.5 rounded-md font-bold transition-colors">
              {t.navHome}
            </Link>
            <Link href="#tenders" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors">
              {t.navTenders}
            </Link>
            <Link href="#verification" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors">
              {t.navVerification}
            </Link>
            <Link href="#quicklinks" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors">
              {t.navQuickLinks}
            </Link>
            <Link href="/audit" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-orange-600 inline" />
              <span>{t.navAuditVault}</span>
            </Link>
            <Link href="/login" className="hover:text-[#0F294A] px-2.5 py-1.5 rounded transition-colors">
              {t.navVendorReg}
            </Link>
          </nav>

          {/* Official Clean Production Status */}
          <div className="flex items-center space-x-2 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>{t.portalStatus}</span>
          </div>
        </div>
      </header>

      {/* 4. HERO SLIDER / CAROUSEL */}
      <section className="relative bg-slate-900 text-white overflow-hidden shadow-md">
        <div className={`bg-gradient-to-r ${slideGradients[currentSlide % slideGradients.length]} transition-all duration-700 py-12 px-4 sm:px-8`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Carousel Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-orange-300 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                <span>{t.slides[currentSlide]?.badge}</span>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  {t.slides[currentSlide]?.subtitle}
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 leading-tight">
                  {t.slides[currentSlide]?.headline}
                </h2>
              </div>

              <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl font-normal">
                {t.slides[currentSlide]?.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={slideLinks[currentSlide % slideLinks.length]}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-md font-bold text-xs flex items-center space-x-2 transition-all shadow-md group"
                >
                  <span>{t.slides[currentSlide]?.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/audit"
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-5 py-2.5 rounded-md font-semibold text-xs transition-colors"
                >
                  {t.navAuditVault}
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
                  <h3 className="font-bold text-white text-base">CPCL E-Procurement</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Deterministic AI Rule Verification & Cryptographic SHA-256 Logs
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-[11px] text-orange-200 font-mono">
                  Notice: CPCL/PROC/2026/089
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
          {t.slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${currentSlide === idx ? "w-6 bg-orange-500" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* 5. NOTICE TICKER */}
      <div className="bg-orange-600 text-white py-2 px-4 text-xs font-semibold flex items-center space-x-3 shadow-inner">
        <span className="bg-white text-orange-700 px-2 py-0.5 rounded font-bold uppercase text-[10px] shrink-0">
          Official Notice
        </span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee inline-block font-medium">
            {t.noticeTicker}
          </div>
        </div>
      </div>

      {/* 6. MAIN CONTENT SECTION */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* GRID: LIVE TENDERS + QUICK SERVICES SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 8 COLS: ACTIVE TENDERS */}
          <div className="lg:col-span-8 space-y-6" id="tenders">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-[#0F294A] flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span>{t.activeTendersTitle}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.activeTendersSubtitle}
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-1 text-xs">
                {[
                  { key: "all", label: t.filterAll },
                  { key: "Equipment", label: t.filterEquipment },
                  { key: "Services", label: t.filterServices },
                  { key: "Safety", label: t.filterSafety },
                  { key: "Chemicals", label: t.filterChemicals },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveTab(cat.key)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      activeTab === cat.key ? "bg-[#0F294A] text-white font-bold" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tender List */}
            <div className="space-y-3">
              {tenders
                .filter((tender) => activeTab === "all" || tender.category === activeTab)
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
                        <span>{t.estimatedValue}: <b className="text-slate-900">{tender.value}</b></span>
                        <span>•</span>
                        <span>{t.submissionDeadline}: <b className="text-orange-700">{tender.deadline}</b></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
                      <Link
                        href="/login"
                        className="w-full sm:w-auto bg-[#0F294A] hover:bg-blue-900 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center justify-center space-x-1 transition-colors"
                      >
                        <span>{t.applyAndVerify}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{t.ruleEngineNotice}</span>
              </div>
              <Link href="/login" className="text-[#0F294A] font-bold hover:underline shrink-0 ml-2">
                {t.viewManual}
              </Link>
            </div>
          </div>

          {/* RIGHT 4 COLS: QUICK SERVICES & PORTAL ACCESS */}
          <div className="lg:col-span-4 space-y-6" id="quicklinks">
            
            {/* Enterprise Portal Access Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <UserCheck className="w-5 h-5 text-[#0F294A]" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{t.instantAccessTitle}</h3>
                  <p className="text-[11px] text-slate-500">{t.instantAccessSubtitle}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                {t.instantAccessDesc}
              </p>

              <div className="space-y-2">
                <Link
                  href="/login"
                  className="w-full bg-[#0F294A] hover:bg-blue-900 text-white text-xs font-semibold py-2.5 px-3 rounded flex items-center justify-between transition-colors shadow-xs"
                >
                  <span>{t.officerSignIn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded flex items-center justify-between transition-colors"
                >
                  <span>{t.bidderASignIn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded flex items-center justify-between transition-colors"
                >
                  <span>{t.bidderBSignIn}</span>
                  <ArrowRight className="w-4 h-4 text-orange-600" />
                </Link>
              </div>
            </div>

            {/* Quick Navigation Services Grid */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-orange-600" />
                <span>{t.quickServicesTitle}</span>
              </h3>

              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li>
                  <Link href="/audit" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>{t.cryptographicAudit}</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/officer/tenders" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>{t.complianceCompiler}</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/bidder/apply" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4 text-orange-600" />
                      <span>{t.newVendorReg}</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-purple-600" />
                      <span>{t.vendorHelpdesk}</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* 7. ARCHITECTURE & COMPLIANCE PILLARS */}
        <div className="pt-8 border-t border-slate-200" id="verification">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
            <h2 className="text-2xl font-black text-[#0F294A]">
              {t.architectureTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.architectureSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.pillar1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.pillar1Desc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.pillar2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.pillar2Desc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-700 rounded-md flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.pillar3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.pillar3Desc}
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* 8. OFFICIAL FOOTER */}
      <footer className="bg-[#0B1E36] text-slate-400 text-xs py-10 border-t-4 border-orange-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center">
                <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">CPCL E-Procurement</h4>
                <p className="text-[11px] text-slate-400">Chennai Petroleum Corporation Ltd</p>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {t.footerAbout}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">{t.footerQuickNav}</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/" className="hover:text-white">{t.navHome}</Link></li>
              <li><Link href="#tenders" className="hover:text-white">{t.navTenders}</Link></li>
              <li><Link href="/audit" className="hover:text-white">{t.navAuditVault}</Link></li>
              <li><Link href="/login" className="hover:text-white">{t.signInButton}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">{t.footerGovtPortals}</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Government e-Marketplace (GeM)</a></li>
              <li><a href="https://mopng.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Ministry of Petroleum & Natural Gas</a></li>
              <li><a href="https://cpcl.co.in" target="_blank" rel="noreferrer" className="hover:text-white">CPCL Official Corporate Portal</a></li>
              <li><a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">National Portal of India</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Security & Compliance</h5>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-2">
              All bid evaluations and qualification assessments are cryptographically verified using SHA-256 hash chains.
            </p>
            <p className="text-[10px] text-emerald-400 font-mono">
              Integrity Status: Active & Secured
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-slate-800 flex flex-wrap justify-between items-center text-[11px] text-slate-500">
          <p>{t.footerCopyright}</p>
          <p>{t.footerGIGW}</p>
        </div>
      </footer>
    </div>
  );
}
