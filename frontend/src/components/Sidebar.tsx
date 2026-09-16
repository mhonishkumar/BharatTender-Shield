"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  CheckSquare,
  ShieldAlert,
  FileSpreadsheet,
  History,
  Settings,
  Upload,
  MessageSquare,
  UserCheck,
  Building,
  LogOut,
  UserPlus,
  ShieldCheck,
  User,
  X
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role, logout } = useAuth();
  const { isOpen, setIsOpen } = useSidebar();

  // Navigation configurations per role
  const officerNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Tenders", href: "/officer/tenders", icon: FileText },
    { label: "Create Tender", href: "/officer/tenders?create=true", icon: PlusCircle },
    { label: "Applications", href: "/dashboard#applications", icon: Users },
    { label: "Bidder Verification", href: "/officer/verification/2", icon: CheckSquare, badge: "Hero Demo" },
    { label: "Risk Review", href: "/dashboard?filter=high-risk", icon: ShieldAlert },
    { label: "Reports", href: "/reports/2", icon: FileSpreadsheet },
    { label: "Audit Logs", href: "/audit", icon: History, badge: "SHA-256" },
    { label: "Settings", href: "/dashboard#settings", icon: Settings },
  ];

  const bidderNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Available Tenders", href: "/officer/tenders", icon: FileText },
    { label: "Apply for Tender", href: "/bidder/apply", icon: PlusCircle },
    { label: "Documents", href: "/bidder/verification#documents", icon: Upload },
    { label: "Verification Status", href: "/bidder/verification", icon: CheckSquare, badge: "Score" },
    { label: "Clarifications", href: "/bidder/clarifications", icon: MessageSquare, badge: "Action" },
    { label: "Reports", href: "/reports/2", icon: FileSpreadsheet },
    { label: "Profile", href: "/dashboard#profile", icon: Building },
  ];

  const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin?tab=users", icon: Users },
    { label: "Officers", href: "/admin?tab=officers", icon: UserCheck },
    { label: "Bidders", href: "/admin?tab=bidders", icon: Building },
    { label: "Tenders", href: "/officer/tenders", icon: FileText },
    { label: "Verification Engine", href: "/officer/verification/2", icon: CheckSquare, badge: "Engine" },
    { label: "Audit Logs", href: "/audit", icon: History, badge: "SHA-256" },
    { label: "Reports", href: "/reports/2", icon: FileSpreadsheet },
    { label: "Settings", href: "/admin?tab=settings", icon: Settings },
    { label: "Profile", href: "/admin?tab=profile", icon: User },
  ];

  const currentNav = role === "BIDDER" ? bidderNav : (role === "ADMIN" ? adminNav : officerNav);

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="py-4">
        {/* Mobile Header with close button */}
        <div className="flex md:hidden items-center justify-between px-4 pb-3 mb-2 border-b border-slate-100">
          <span className="font-bold text-xs text-[#0F294A]">Menu Navigation</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Section Title */}
        <div className="px-4 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {role === "BIDDER" ? "Bidder Portal" : (role === "ADMIN" ? "Admin Console" : "Procurement Portal")}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 px-2">
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
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#0F294A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                      isActive
                        ? "bg-blue-800 text-blue-100"
                        : "bg-orange-100 text-orange-700 border border-orange-200"
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
      <div className="p-4 border-t border-slate-200 space-y-2">
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-500">
          <div className="font-semibold text-slate-700 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>SIH 2026 Engine Active</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Deterministic + Demo AI
          </span>
        </div>

        <button
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 rounded text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible from md up) */}
      <aside className="hidden md:flex w-[240px] bg-white border-r border-slate-200 flex-col justify-between flex-shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dark backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-[280px] max-w-[80vw] bg-white h-full shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
