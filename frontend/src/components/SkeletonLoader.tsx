"use client";

import React from "react";

export const SkeletonCard: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs animate-pulse">
      <div className="h-10 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 space-x-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
        ))}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center space-x-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className={`h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded ${
                  c === 0 ? "w-1/4" : "flex-1"
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonHeader: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs animate-pulse space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-2 w-2/3">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded w-16"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
