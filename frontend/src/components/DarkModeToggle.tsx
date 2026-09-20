"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export const DarkModeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton placeholder — prevents layout shift
    return <div className={`w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse ${className}`} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative inline-flex items-center w-14 h-7 rounded-full
        transition-colors duration-300 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${isDark
          ? "bg-blue-600 hover:bg-blue-500"
          : "bg-slate-200 hover:bg-slate-300"
        }
        ${className}
      `}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-amber-300 w-4 h-4">
        <SunIcon />
      </span>
      <span className="absolute right-1.5 text-blue-200 w-3.5 h-3.5">
        <MoonIcon />
      </span>

      {/* Sliding knob */}
      <span
        className={`
          absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md
          transform transition-transform duration-300 flex items-center justify-center
          ${isDark ? "translate-x-7" : "translate-x-0.5"}
        `}
      >
        {isDark ? (
          <MoonIcon className="w-3.5 h-3.5 text-blue-600" />
        ) : (
          <SunIcon className="w-3.5 h-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
};
