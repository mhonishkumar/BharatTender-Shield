"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      id="back-to-top"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-[#0B1B3D] dark:bg-slate-800 text-white shadow-lg hover:bg-blue-900 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-700/30 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 no-print"
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <ArrowUpIcon className="w-5 h-5 stroke-2" />
    </button>
  );
};
