"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { DocumentTextIcon, ArrowLeftIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex flex-col text-slate-800 dark:text-slate-100">
      <Header />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-8">
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 flex items-center space-x-1">
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Terms of Service</span>
        </div>

        {/* Draft Notice */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-2">
          <span className="font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-200 dark:bg-amber-900 rounded text-[10px]">
            Draft for Review
          </span>
          <span>
            SIH 2026 Evaluation Draft • Subject to statutory amendment by authorized procurement authorities.
          </span>
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h1 className="text-2xl font-black text-[#0B1B3D] dark:text-white flex items-center space-x-2.5">
              <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Terms of Service & Platform Governance</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              BharatTender Shield / GeM Sentinel Procurement Platform Guidelines
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B1B3D] dark:text-slate-200">1. Scope of Service</h2>
            <p className="text-slate-600 dark:text-slate-400">
              BharatTender Shield provides automated bid compliance verification, document parsing, cross-referencing, and discrepancy detection for public procurement tenders. The platform acts as a statutory decision-support tool.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B1B3D] dark:text-slate-200">2. Officer Decision Primacy</h2>
            <p className="text-slate-600 dark:text-slate-400">
              In accordance with General Financial Rules (GFR 2017), the artificial intelligence pipeline does not possess authority to autonomously disqualify or award bids. Final legal determination is vested exclusively in the designated Procurement Officer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B1B3D] dark:text-slate-200">3. Tamper-Evident Audit Logging</h2>
            <p className="text-slate-600 dark:text-slate-400">
              All interactions, document uploads, automated evaluations, officer justifications, and clarification exchanges are permanently sealed using SHA-256 cryptographic hashes. Users acknowledge that audit logs are immutable and admissible for statutory audit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B1B3D] dark:text-slate-200">4. Bidder Representations & Warranties</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Bidders represent that all uploaded certificates (GST, PAN, MSME Udyam, CA Turnover statements) are authentic and legally subsisting on the bid submission date. Uploading forged or backdated documents constitutes grounds for debarment.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        BharatTender Shield • SIH 2026 Problem Statement 26100
      </footer>
    </div>
  );
}
