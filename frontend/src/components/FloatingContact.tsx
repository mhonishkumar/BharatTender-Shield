"use client";

import React, { useState } from "react";
import { QuestionMarkCircleIcon, XMarkIcon, PhoneIcon, EnvelopeIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export const FloatingContact: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        id="floating-contact"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:scale-105 active:scale-95 no-print"
        aria-label="Procurement Officer Help & Support"
        title="Help & Support Desk"
      >
        <QuestionMarkCircleIcon className="w-5 h-5 text-blue-800 dark:text-blue-400 stroke-2" />
        <span className="text-xs font-semibold tracking-wide">Support Desk</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-800 dark:text-blue-400">
                  <DocumentTextIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="contact-modal-title" className="font-bold text-sm sm:text-base">
                    Procurement Verification Support
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    GeM Sentinel Help & Clarification Desk
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close dialog"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Compliance & Rule Verification Assistance
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  For discrepancies in GST, PAN, or MSME data, use the integrated RAG Chatbot to query submitted document chunks, or issue a formal Clarification Request via the Officer Portal.
                </p>
              </div>

              <div className="flex items-center space-x-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <EnvelopeIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Email Desk</span>
                  <a
                    href="mailto:support@bharattender.gov.in"
                    className="font-mono text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@bharattender.gov.in
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <PhoneIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Toll-Free Procurement Helpline</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    1800-111-2610 (Mon-Fri, 09:00 - 18:00 IST)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-[#0B1B3D] dark:bg-slate-800 hover:bg-blue-900 dark:hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
