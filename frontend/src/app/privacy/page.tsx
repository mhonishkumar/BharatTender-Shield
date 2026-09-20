"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ShieldCheckIcon, ArrowLeftIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function PrivacyPage() {
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
          <span className="font-semibold text-slate-800 dark:text-slate-200">Privacy Policy</span>
        </div>

        {/* Draft Notice */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-2">
          <span className="font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-200 dark:bg-amber-900 rounded text-[10px]">
            Draft for Review
          </span>
          <span>
            SIH 2026 Evaluation Draft • Compliant with Digital Personal Data Protection Act (DPDPA 2023).
          </span>
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h1 className="text-2xl font-black text-[#0B1B3D] dark:text-white flex items-center space-x-2.5">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>Data Protection & Privacy Policy</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Procurement Data Protection Principles for GeM Sentinel
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B1B3D] dark:text-slate-200">1. Data Collected</h2>
            <p className="text-slate-600 dark:text-slate-400">
              The platform processes commercial and statutory records submitted by bidders, including GSTIN, PAN, Udyam MSME certificates, balance sheets, and OEM authorization documents strictly for tender evaluation purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B1B3D] dark:text-slate-200">2. Strict Role-Based Multi-Tenant Isolation</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Document chunks and embeddings are strictly isolated by bidder identifier. Competing commercial bidders are cryptographically and logically prohibited from accessing or querying documents submitted by other participating entities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B1B3D] dark:text-slate-200">3. Artificial Intelligence & Vector Processing</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Text chunks processed by Gemini embeddings and LLMs are utilized strictly in-session for compliance verification and are not retained for model training or cross-enterprise indexing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B1B3D] dark:text-slate-200">4. Retention & Audit Storage</h2>
            <p className="text-slate-600 dark:text-slate-400">
              All compliance verification reports, audit logs, and cryptographic hashes are retained for statutory retention periods mandated by Indian public procurement directives.
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
