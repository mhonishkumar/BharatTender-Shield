"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { api } from "@/lib/api";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import {
  MagnifyingGlassIcon,
  BellIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  ShieldCheckIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export const Header: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const { user, role, logout } = useAuth();
  const { toggle, isOpen } = useSidebar();
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
    } catch {
      // ignore
    }
  };

  const handleNotificationClick = async (notif: any) => {
    try {
      await api.markNotificationRead(notif.id);
      loadNotifications();
      setShowNotifications(false);
    } catch {
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
    ADMIN: "Administrator",
  }[role || ""] || role || "Guest";

  return (
    <header className="bg-white dark:bg-[#0D1B2E] border-b border-slate-200 dark:border-[#1E3154] h-16 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 transition-colors duration-150 shadow-sm dark:shadow-blue-950/20">
      {/* Left: Hamburger menu on mobile + Brand Identity */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={toggle}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-[#0B1B3D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isOpen ? "Close sidebar menu" : "Open sidebar menu"}
          aria-expanded={isOpen}
        >
          <Bars3Icon className="w-5 h-5 stroke-2" />
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
            <span className="font-semibold text-sm sm:text-base tracking-tight text-[#0B1B3D] dark:text-white leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              BharatTender Shield
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none hidden lg:inline">
              Every Bid Verified. Every Decision Defensible.
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search (Item 3) */}
      <div className="hidden sm:block flex-1 max-w-xs md:max-w-md mx-2 sm:mx-4 lg:mx-8">
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 stroke-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tenders, bidders, applications, GSTIN..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <kbd className="hidden lg:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Dark Mode Toggle, Notifications, Profile */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Dark Mode Toggle (Item 1) */}
        <DarkModeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#0B1B3D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title="Notifications"
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <BellIcon className="w-4 h-4 stroke-2" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex justify-between items-center">
                <span>Notifications ({unreadCount} unread)</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">GeM Sentinel</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-5 text-center text-slate-400 dark:text-slate-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                        !n.is_read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                        {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block flex-shrink-0" />}
                        <span className="truncate">{n.title}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block font-mono">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill / Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight max-w-[110px] sm:max-w-none truncate">
              {user?.full_name || "Officer"}
            </span>
            <span className="text-[9px] sm:text-[10px] text-blue-800 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded mt-0.5 border border-blue-200/60 dark:border-blue-800/60 inline-block">
              {roleLabel}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Sign Out"
            aria-label="Sign out"
          >
            <ArrowRightStartOnRectangleIcon className="w-4 h-4 stroke-2" />
          </button>
        </div>
      </div>
    </header>
  );
};
