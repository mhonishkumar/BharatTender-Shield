import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Cpu, Lock, CheckCircle2, FileText, Activity, UserCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded shadow-sm border border-slate-200 flex items-center justify-center p-1">
                <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="object-contain" />
              </div>
              <span className="font-bold text-xl text-[#0F294A] tracking-tight">
                BharatTender Shield
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-600 hover:text-[#0F294A] transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/login" 
                className="bg-[#0F294A] hover:bg-blue-950 text-white text-sm font-medium px-4 py-2 rounded-md transition-all shadow-sm flex items-center space-x-1.5 group"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-[#0F294A] [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)] lg:[clip-path:polygon(0_0,100%_0,100%_80%,0_100%)] z-0" />
        {/* Subtle background pattern */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-xs font-semibold text-orange-100 uppercase tracking-wide">
              Smart India Hackathon 2026 • PS 26100
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Next-Generation <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
              Procurement Compliance
            </span>
          </h1>
          
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            Empowering Government e-Marketplace (GeM) with AI-assisted verification, deterministic rules, and tamper-evident SHA-256 audit trails.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Access Live Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-3.5 rounded-lg transition-all flex items-center justify-center"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-slate-50 relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F294A]">Why BharatTender Shield?</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              We bridge the gap between automated efficiency and human accountability, ensuring every bid is verified with absolute certainty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Assisted Extraction</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automatically parse complex tender documents and bidder certificates. Extract GST, PAN, and Udyam details instantly without manual data entry.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Deterministic Verification</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cross-reference extracted data against live external APIs (Mock GSTIN/PAN). Enforce hard rules for financial turnovers and deadlines.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tamper-Evident Logs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every action, approval, and verification step is logged with a SHA-256 cryptographic hash, ensuring an immutable audit trail for complete transparency.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Human-in-the-Loop</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI proposes, Humans decide. The Split-UI presents raw evidence alongside extracted data, keeping Procurement Officers in full control.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Tender Rules</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Auto-compile custom compliance checklists from tender descriptions. Ensure specific criteria like ISO certifications or local presence are met.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Risk Scoring</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Bidders are automatically categorized into Low, Medium, and High risk tiers based on historical compliance and data discrepancies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0F294A] mb-6">Ready to secure the procurement process?</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Experience the full suite of compliance tools by accessing the interactive SIH demo portal.
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center space-x-2 bg-[#0F294A] hover:bg-blue-950 text-white font-semibold px-8 py-3.5 rounded-lg shadow-md transition-colors"
          >
            <Lock className="w-5 h-5" />
            <span>Enter Secure Portal</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F294A] text-slate-400 py-12 border-t border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center p-1">
              <Image src="/logo.jpg" alt="Logo" width={24} height={24} className="object-contain brightness-0 invert opacity-80" />
            </div>
            <span className="font-semibold text-white tracking-tight">BharatTender Shield</span>
          </div>
          
          <div className="text-sm text-center md:text-right">
            <p>Smart India Hackathon 2026 • Problem Statement 26100</p>
            <p className="mt-1 text-slate-500">Government e-Marketplace (GeM) Procurement Compliance System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
