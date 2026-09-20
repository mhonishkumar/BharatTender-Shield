"use client";

import React, { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, label, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center space-x-1 p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      title={copied ? "Copied to clipboard!" : label ? `Copy ${label}` : "Copy to clipboard"}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? (
        <>
          <CheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-2" />
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <ClipboardDocumentIcon className="w-3.5 h-3.5 stroke-2" />
          {label && <span className="text-[10px] text-slate-500 dark:text-slate-400">{label}</span>}
        </>
      )}
    </button>
  );
};
