"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { api } from "@/lib/api";
import { Search, Bell, LogOut, Menu, ShieldCheck, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

export const Header: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const { user, role, logout } = useAuth();
  const { toggle } = useSidebar();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
      const unread = data.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (e) {
      // ignore
    }
  };

  const handleNotificationClick = async (notif: any) => {
    try {
      await api.markNotificationRead(notif.id);
      loadNotifications();
      setShowNotifications(false);
    } catch (e) {
      // ignore
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const roleLabel = {
    PROCUREMENT_OFFICER: "Procurement Officer",
    BIDDER: "Bidder Enterprise",
    ADMIN: "Administrator"
  }[role || ""] || role || "Guest";

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40">
      {/* Left: Hamburger menu on mobile + Brand Identity */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={toggle}
          className="md:hidden p-2 text-slate-600 hover:text-[#0F294A] hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-2.5 group">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="BharatTender Shield Logo"
              width={36}
              height={36}
              className="object-contain rounded"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-[#0F294A] leading-tight group-hover:text-blue-900 transition-colors">
              BharatTender Shield
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-none hidden lg:inline">
              Every Bid Verified. Every Decision Defensible.
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search (Hidden on very small screens, visible from sm up) */}
      <div className="hidden sm:block flex-1 max-w-xs md:max-w-md mx-2 sm:mx-4 lg:mx-8">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tenders, bidders, applications, GSTIN..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#0F294A] focus:border-[#0F294A] transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications, Profile, Role badge */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-[#0F294A] hover:bg-slate-100 rounded-md relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-800 flex justify-between items-center">
                <span>Notifications ({unreadCount} new)</span>
                <span className="text-[10px] text-slate-400">SIH Alerts</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !n.is_read ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="font-semibold text-slate-800 flex items-center space-x-1">
                        {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block" />}
                        <span>{n.title}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill / Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 pl-2 border-l border-slate-200">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800 leading-tight max-w-[100px] sm:max-w-none truncate">
              {user?.full_name || "Guest"}
            </span>
            <span className="text-[9px] sm:text-[10px] text-blue-800 font-medium bg-blue-50 px-1 sm:px-1.5 py-0.5 rounded mt-0.5 border border-blue-100 inline-block">
              {roleLabel}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
