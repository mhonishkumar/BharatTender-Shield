"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  User
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, logout } = useAuth();

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

  return (
    <aside className="w-[240px] bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="py-4">
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
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0].split("#")[0]));

            return (
              <Link
                key={item.label}
                href={item.href}
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
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 rounded text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
