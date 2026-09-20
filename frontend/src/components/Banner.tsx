"use client";

import React, { useState, useEffect } from "react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const Banner: React.FC = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem("bts_env_banner_dismissed");
      if (!isDismissed) {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("bts_env_banner_dismissed", "true");
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;

  return (
    <div
      id="env-banner"
      className="bg-[#0B1B3D] dark:bg-slate-900 border-b border-blue-900/40 text-white text-xs px-4 py-2 flex items-center justify-between z-50 relative no-print"
      role="region"
      aria-label="System announcement"
    >
      <div className="flex items-center space-x-2 mx-auto max-w-7xl">
        <InformationCircleIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
        <span className="font-medium text-slate-200">
          <strong className="text-white font-semibold uppercase tracking-wider text-[11px] bg-blue-900/60 px-1.5 py-0.5 rounded mr-1.5 border border-blue-700/50">
            PROTOTYPE ENVIRONMENT
          </strong>
          SIH 2026 Evaluation Sandbox — All verification decisions are recorded in an immutable SHA-256 audit log.
        </span>
      </div>
      <button
        onClick={handleDismiss}
        className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors flex-shrink-0 ml-2"
        aria-label="Dismiss banner"
        title="Dismiss notice"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
