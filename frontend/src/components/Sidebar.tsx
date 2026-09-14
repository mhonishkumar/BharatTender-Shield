"use client";

import React, { useState } from "react";
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
  Building,
  LogOut,
  ExternalLink,
  UserPlus,
  ChevronRight,
  Zap,
  Bell,
  Star,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

const QUICK_LINKS = [
  { label: "GeM Portal", href: "https://gem.gov.in", desc: "Government e-Marketplace" },
  { label: "CPPP", href: "https://eprocure.gov.in", desc: "e-Procurement Portal" },
  { label: "MCA21", href: "https://www.mca.gov.in", desc: "Company Registry" },
  { label: "GSTIN Verify", href: "https://www.gst.gov.in", desc: "GST Portal" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();
  const [quickLinksOpen, setQuickLinksOpen] = useState(true);

  const officerNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Tenders", href: "/officer/tenders", icon: FileText },
    { label: "Applications", href: "/dashboard#applications", icon: Users },
    { label: "Bidder Verification", href: "/officer/verification/2", icon: CheckSquare, badge: "Demo", badgeColor: "orange" },
    { label: "Risk Review", href: "/dashboard?filter=high-risk", icon: ShieldAlert },
    { label: "Reports", href: "/reports/2", icon: FileSpreadsheet },
    { label: "Audit Logs", href: "/audit", icon: History, badge: "SHA-256", badgeColor: "blue" },
    { label: "Settings", href: "/dashboard#settings", icon: Settings },
  ];

  const bidderNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Available Tenders", href: "/officer/tenders", icon: FileText },
    { label: "Apply for Tender", href: "/bidder/apply", icon: PlusCircle },
    { label: "My Documents", href: "/bidder/verification#documents", icon: Upload },
    { label: "Verification Status", href: "/bidder/verification", icon: CheckSquare, badge: "Score", badgeColor: "green" },
    { label: "Clarifications", href: "/bidder/clarifications", icon: MessageSquare, badge: "Action", badgeColor: "orange" },
    { label: "Reports", href: "/reports/2", icon: FileSpreadsheet },
    { label: "Company Profile", href: "/dashboard#profile", icon: Building },
  ];

  const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Users & Roles", href: "/dashboard#users", icon: Users },
    { label: "Tenders", href: "/officer/tenders", icon: FileText },
    { label: "Audit Trail", href: "/audit", icon: History },
    { label: "System Diagnostics", href: "/dashboard#system", icon: Settings },
  ];

  const currentNav = role === "BIDDER" ? bidderNav : role === "ADMIN" ? adminNav : officerNav;
  const portalLabel = role === "BIDDER" ? "Bidder Portal" : role === "ADMIN" ? "Admin Console" : "Procurement Portal";

  const getBadgeClass = (color?: string) => {
    if (color === "orange") return "bg-orange-100 text-orange-700 border border-orange-200";
    if (color === "green") return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    if (color === "blue") return "bg-blue-100 text-blue-700 border border-blue-200";
    return "bg-slate-100 text-slate-600 border border-slate-200";
  };

  return (
    <aside className="w-[240px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-[calc(100vh-7.5rem)]">

      {/* New Tender CTA — prominent top button */}
      <div className="p-3 border-b border-slate-100">
        <Link
          href={role === "BIDDER" ? "/bidder/apply" : "/officer/tenders?create=true"}
          className="sidebar-cta w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{role === "BIDDER" ? "Apply for Tender" : "New Tender"}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-auto" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-5">
        {/* Main Navigation */}
        <div>
          <div className="px-4 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {portalLabel}
            </span>
          </div>
          <nav className="space-y-0.5 px-2">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  !item.href.includes("#") &&
                  !item.href.includes("?") &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#0F294A] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                      isActive ? "bg-white/20 text-white" : getBadgeClass(item.badgeColor)
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Links */}
        <div>
          <button
            onClick={() => setQuickLinksOpen(!quickLinksOpen)}
            className="w-full flex items-center justify-between px-4 mb-2 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
              Quick Links
            </span>
            <ChevronRight className={`w-3 h-3 text-slate-300 transition-transform ${quickLinksOpen ? "rotate-90" : ""}`} />
          </button>
          {quickLinksOpen && (
            <div className="px-2 space-y-0.5">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-slate-600 hover:text-[#0F294A] hover:bg-blue-50 transition-colors group"
                >
                  <div>
                    <div className="font-medium">{link.label}</div>
                    <div className="text-[10px] text-slate-400">{link.desc}</div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* New Users / Onboarding */}
        <div className="px-3">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-1.5">
              <UserPlus className="w-3.5 h-3.5 text-[#0F294A]" />
              <span className="text-[11px] font-bold text-[#0F294A]">New to the Platform?</span>
            </div>
            <ul className="space-y-1 text-[10px] text-slate-600">
              <li className="flex items-start space-x-1.5">
                <Star className="w-3 h-3 text-[#FF9933] mt-0.5 shrink-0" />
                <span>Sign in as a <b>Demo Officer</b> to explore all features</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <Zap className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                <span>Run AI verification on a real tender bid</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <Bell className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                <span>Apply as a <b>Bidder</b> to see the compliance score</span>
              </li>
            </ul>
            <Link
              href="/login"
              className="block w-full text-center bg-[#0F294A] text-white text-[10px] font-semibold py-1.5 rounded-md hover:bg-blue-900 transition-colors mt-1"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 space-y-2">
        {/* Engine status */}
        <div className="flex items-center space-x-2 px-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block pulse-badge shrink-0" />
          <span className="text-[10px] text-slate-500">Verification Engine Active</span>
        </div>
        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
