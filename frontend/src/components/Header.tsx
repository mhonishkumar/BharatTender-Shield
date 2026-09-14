"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Search, Bell, LogOut, Home, FileText, ClipboardList,
  BarChart2, History, HelpCircle, ChevronDown, CheckCircle2, AlertCircle, X
} from "lucide-react";

const NAV_TABS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Tenders", href: "/officer/tenders", icon: FileText },
  { label: "Applications", href: "/dashboard#applications", icon: ClipboardList },
  { label: "Reports", href: "/reports/2", icon: BarChart2 },
  { label: "Audit Trail", href: "/audit", icon: History },
  { label: "Help", href: "#help", icon: HelpCircle },
];

export const Header: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    } catch { /* ignore */ }
  };

  const handleNotificationClick = async (notif: any) => {
    try {
      await api.markNotificationRead(notif.id);
      loadNotifications();
      setShowNotifications(false);
    } catch { /* ignore */ }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const roleLabel = {
    PROCUREMENT_OFFICER: "Procurement Officer",
    BIDDER: "Bidder Enterprise",
    ADMIN: "Administrator",
  }[role || ""] || role || "Guest";

  const roleColor = {
    PROCUREMENT_OFFICER: "bg-blue-100 text-blue-900 border-blue-200",
    BIDDER: "bg-emerald-100 text-emerald-900 border-emerald-200",
    ADMIN: "bg-purple-100 text-purple-900 border-purple-200",
  }[role || ""] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Row 1: Gov Identity Banner */}
      <div className="bg-[#0F294A] text-white px-4 sm:px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Ashoka Chakra placeholder using text */}
          <div className="w-7 h-7 rounded-full border-2 border-[#FF9933] flex items-center justify-center flex-shrink-0">
            <span className="text-[#FF9933] font-bold text-[10px]">🇮🇳</span>
          </div>
          <div>
            <div className="text-[11px] font-semibold leading-tight text-slate-200">
              Government of India — Ministry of Finance
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              GeM Procurement Compliance Platform &nbsp;|&nbsp; BharatTender Shield
            </div>
          </div>
        </div>

        {/* Scrolling notice bar */}
        <div className="hidden md:flex items-center space-x-2 overflow-hidden max-w-xs lg:max-w-md">
          <span className="text-[10px] font-bold text-[#FF9933] shrink-0 border border-[#FF9933]/40 px-1.5 py-0.5 rounded">
            NOTICE
          </span>
          <div className="overflow-hidden text-[10px] text-slate-300">
            <span className="marquee-text">
              SIH 2026 Demo — All bids are cross-verified via deterministic rules. &nbsp;|&nbsp; New tenders open for FY 2026-27. &nbsp;|&nbsp; GST / PAN / Udyam verification active. &nbsp;|&nbsp;
            </span>
          </div>
        </div>

        {/* Top-right: Digital India logo area */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-[#FF9933]">Digital India</div>
            <div className="text-[9px] text-slate-400">Power To Empower</div>
          </div>
        </div>
      </div>

      {/* Tricolour strip */}
      <div className="gov-tricolour" />

      {/* Row 2: Logo + Search + Profile */}
      <div className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-slate-100">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center space-x-2.5 group flex-shrink-0">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="BharatTender Shield Logo"
              width={32}
              height={32}
              className="object-contain rounded"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#0F294A] leading-tight group-hover:text-blue-800 transition-colors">
              BharatTender Shield
            </span>
            <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">
              Every Bid Verified. Every Decision Defensible.
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-4 lg:mx-8">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search tenders, GSTIN, bidders..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F294A]/30 focus:border-[#0F294A] transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="p-2 text-slate-500 hover:text-[#0F294A] hover:bg-slate-100 rounded-full relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Notifications</span>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setShowNotifications(false); }}>
                      <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      <Bell className="w-6 h-6 mx-auto mb-1 opacity-30" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${!n.is_read ? "bg-blue-50/50" : ""}`}
                      >
                        <div className="flex items-start space-x-2">
                          {!n.is_read
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                            : <AlertCircle className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                          }
                          <div>
                            <div className="font-semibold text-slate-800">{n.title}</div>
                            <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#0F294A,#1e4a7a)" }}
              >
                {(user?.full_name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.full_name || "Guest"}
                </span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${roleColor} leading-tight`}>
                  {roleLabel}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-800">{user?.full_name}</div>
                  <div className="text-slate-500 text-[11px] truncate">{user?.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Navigation Tabs */}
      <nav className="flex items-center space-x-1 px-4 sm:px-6 overflow-x-auto bg-white border-b border-slate-100">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href ||
            (tab.href !== "/dashboard" && !tab.href.startsWith("#") && pathname.startsWith(tab.href.split("?")[0].split("#")[0]));
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex items-center space-x-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? "nav-tab-active text-[#0F294A]"
                  : "border-transparent text-slate-500 hover:text-[#0F294A] hover:border-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
