"use client";

import React, { useState } from "react";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does BharatTender Shield prevent AI hallucinations in tender verification?",
    answer:
      "BharatTender Shield uses an evidence-first RAG (Retrieval-Augmented Generation) pipeline where Gemini 1.5 Flash is strictly constrained to cite exact document chunks and page numbers. Crucially, the AI only enriches and extracts values; all final legal evaluations (GSTIN format, numerical turnover thresholds, dates) are computed by deterministic Python rules.",
  },
  {
    question: "Can the AI engine autonomously reject or disqualify a bidder?",
    answer:
      "No. Under Indian public procurement law (GFR 2017 & GeM guidelines), official decisions require authorized human accountability. The platform acts as an intelligent decision-support copilot, highlighting discrepancies and compiling evidence, while the Procurement Officer retains sole authority to render official determinations.",
  },
  {
    question: "How does the SHA-256 tamper-evident cryptographic audit ledger work?",
    answer:
      "Every document upload, automated verification score, clarification dispatch, and officer verdict generates a SHA-256 digital hash that is cryptographically chained to its predecessor. Any retroactive tampering with database records immediately breaks the chain and triggers tamper alerts, ensuring legal defensibility during arbitrations or court inquiries.",
  },
  {
    question: "What is 'Time-Aware Bid Date Validation'?",
    answer:
      "Statutory certificates (like GST active status, MSME registration, or tax clearances) may be valid today but were expired on the actual tender submission deadline. BharatTender Shield evaluates certificates specifically on the bid submission cut-off date to ensure full legal compliance.",
  },
  {
    question: "How does this platform integrate with the existing Government e-Marketplace (GeM)?",
    answer:
      "BharatTender Shield is engineered to ingest standard GeM tender specification PDFs (NIT) and bidder document packets. It simulates GeM API Setu integrations (GSTN, MCA21, Udyam) and outputs standard compliance audit dossiers and digital qualification certificates.",
  },
];

export const FAQAccordion: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {FAQ_DATA.map((item, index) => {
        const isOpen = openIndices.includes(index);
        return (
          <div
            key={index}
            className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-150"
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-expanded={isOpen}
            >
              <div className="flex items-center space-x-3">
                <QuestionMarkCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 stroke-2" />
                <span className="font-bold text-sm text-[#0B1B3D] dark:text-white">
                  {item.question}
                </span>
              </div>
              <ChevronDownIcon
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 stroke-2 ${
                  isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
