"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import {
  Squares2X2Icon,
  DocumentTextIcon,
  PlusCircleIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  DocumentChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  BuildingOffice2Icon,
  ArrowRightStartOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const SidebarInner: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role, logout } = useAuth();
  const { isOpen, setIsOpen } = useSidebar();

  // Prevent background scrolling when mobile drawer is open (Item 5)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Navigation configurations per role
  const officerNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
    { label: "Tenders", href: "/officer/tenders", icon: DocumentTextIcon },
    { label: "Create Tender", href: "/officer/tenders?create=true", icon: PlusCircleIcon },
    { label: "Applications", href: "/dashboard#applications", icon: UserGroupIcon },
    { label: "Bidder Verification", href: "/officer/verification/2", icon: CheckBadgeIcon, badge: "Hero Demo" },
    { label: "Risk Review", href: "/dashboard?filter=high-risk", icon: ExclamationTriangleIcon },
    { label: "Reports", href: "/reports/2", icon: DocumentChartBarIcon },
    { label: "Audit Logs", href: "/audit", icon: ClockIcon, badge: "SHA-256" },
    { label: "Settings", href: "/dashboard#settings", icon: Cog6ToothIcon },
  ];

  const bidderNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
    { label: "Available Tenders", href: "/officer/tenders", icon: DocumentTextIcon },
    { label: "Apply for Tender", href: "/bidder/apply", icon: PlusCircleIcon },
    { label: "Documents", href: "/bidder/verification#documents", icon: ArrowUpTrayIcon },
    { label: "Verification Status", href: "/bidder/verification", icon: CheckBadgeIcon, badge: "Score" },
    { label: "Clarifications", href: "/bidder/clarifications", icon: ChatBubbleLeftRightIcon, badge: "Action" },
    { label: "Reports", href: "/reports/2", icon: DocumentChartBarIcon },
    { label: "Profile", href: "/dashboard#profile", icon: BuildingOffice2Icon },
  ];

  const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: Squares2X2Icon },
    { label: "Users", href: "/admin?tab=users", icon: UserGroupIcon },
    { label: "Officers", href: "/admin?tab=officers", icon: UserIcon },
    { label: "Bidders", href: "/admin?tab=bidders", icon: BuildingOffice2Icon },
    { label: "Tenders", href: "/officer/tenders", icon: DocumentTextIcon },
    { label: "Verification Engine", href: "/officer/verification/2", icon: CheckBadgeIcon, badge: "Engine" },
    { label: "Audit Logs", href: "/audit", icon: ClockIcon, badge: "SHA-256" },
    { label: "Reports", href: "/reports/2", icon: DocumentChartBarIcon },
    { label: "Settings", href: "/admin?tab=settings", icon: Cog6ToothIcon },
    { label: "Profile", href: "/admin?tab=profile", icon: UserIcon },
  ];

  const currentNav = role === "BIDDER" ? bidderNav : (role === "ADMIN" ? adminNav : officerNav);

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-[#0F1E35] transition-colors duration-150">
      <div className="py-4">
        {/* Mobile Header with close button */}
        <div className="flex md:hidden items-center justify-between px-4 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-bold text-xs text-[#0B1B3D] dark:text-white">Navigation Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        {/* Role Section Title */}
        <div className="px-4 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {role === "BIDDER" ? "Bidder Enterprise Portal" : (role === "ADMIN" ? "Admin Control Panel" : "Procurement Portal")}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 px-2.5" aria-label="Sidebar Navigation">
          {currentNav.map((item) => {
            const Icon = item.icon;
            let isActive = false;
            const [itemPath, itemQuery] = item.href.split("?");
            const currentTab = searchParams.get("tab");

            if (itemPath === pathname) {
              if (itemQuery) {
                const itemTab = new URLSearchParams(itemQuery).get("tab");
                isActive = currentTab === itemTab;
              } else if (itemPath === "/admin") {
                isActive = !currentTab || currentTab === "dashboard";
              } else if (itemPath === "/dashboard") {
                isActive = pathname === "/dashboard";
              } else {
                isActive = true;
              }
            } else if (itemPath !== "/dashboard" && itemPath !== "/admin" && pathname.startsWith(itemPath)) {
              isActive = true;
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#0B1B3D] dark:bg-blue-900/60 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 stroke-2 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                      isActive
                        ? "bg-blue-800 text-blue-100"
                        : "bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Sign Out */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-500/20" />
            <span>SIH 2026 Engine</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-mono">
            RAG + Deterministic Rule Engine
          </span>
        </div>

        <button
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-800 transition-colors"
        >
          <ArrowRightStartOnRectangleIcon className="w-4 h-4 stroke-2" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible from md up) */}
      <aside
        id="sidebar"
        className="hidden md:flex w-[240px] bg-white dark:bg-[#0F1E35] border-r border-slate-200 dark:border-slate-800/80 flex-col justify-between flex-shrink-0 min-h-[calc(100vh-4rem)] no-print"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Item 5) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex no-print" role="dialog" aria-modal="true">
          {/* Dark backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative w-[280px] max-w-[85vw] bg-white dark:bg-[#0F1E35] h-full shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export const Sidebar: React.FC = () => (
  <Suspense fallback={<aside className="hidden md:flex w-[240px] bg-white dark:bg-[#0F1E35] border-r border-slate-200 dark:border-slate-800/80 flex-col flex-shrink-0 min-h-[calc(100vh-4rem)] no-print" />}>
    <SidebarInner />
  </Suspense>
);
