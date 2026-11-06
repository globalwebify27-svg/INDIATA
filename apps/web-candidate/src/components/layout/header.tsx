"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  MapPin,
  Sparkles,
  Bell,
  Sun,
  Moon,
  Building,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";

export interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

const CONSTITUENCIES = [
  { id: "pune-pc", name: "34 - Pune Parliamentary Constituency", type: "Lok Sabha" },
  { id: "kothrud-ac", name: "214 - Kothrud Assembly Segment", type: "Vidhan Sabha" },
  { id: "shivajinagar-ac", name: "215 - Shivajinagar Assembly Segment", type: "Vidhan Sabha" },
];

export function Header({
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [constituencyDropdownOpen, setConstituencyDropdownOpen] = useState(false);
  const [selectedConstituency, setSelectedConstituency] = useState(
    user?.constituencyName || "34 - Pune Parliamentary Constituency"
  );

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const constituencyRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (constituencyRef.current && !constituencyRef.current.contains(target)) {
        setConstituencyDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchResultsOpen(false);
    showToast(
      "info",
      "Voter Registry Search",
      `Filtering electors for: "${searchQuery}"`,
    );
  };

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onOpenMobile();
    } else {
      onToggleCollapse();
    }
  };

  const candidateInitials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "VP";

  return (
    <header className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-premium-xs select-none gap-3">
      {/* LEFT: Sidebar Toggle + Constituency Pill + War Room Live */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleToggle}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Constituency Context Selector Pill */}
        <div className="relative" ref={constituencyRef}>
          <button
            type="button"
            onClick={() => setConstituencyDropdownOpen(!constituencyDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span className="truncate max-w-[140px] sm:max-w-[210px]">
              {selectedConstituency}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {constituencyDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-scale-up">
              <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Active Constituency
              </div>
              <div className="space-y-1">
                {CONSTITUENCIES.map((c) => {
                  const isCurrent = selectedConstituency.includes(c.name.split(" ")[2] || "");
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedConstituency(c.name);
                        setConstituencyDropdownOpen(false);
                        showToast("info", "Active Constituency", `Switched focus to ${c.name}`);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-brand-50 hover:text-brand-700 font-medium flex items-center justify-between transition-colors"
                    >
                      <span>{c.name} ({c.type})</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* War Room Live Pulsing Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span>War Room Live</span>
        </div>
      </div>

      {/* CENTER: Global Search */}
      <div ref={searchRef} className="flex-1 max-w-lg mx-2 sm:mx-6 relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Global search: voter name, EPIC ID, booth, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResultsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Quick Search Results Overlay */}
        {searchResultsOpen && searchQuery.trim().length > 1 && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto z-50 p-2">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Matching Elector Records</span>
              <span>Press ESC to dismiss</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <Link
                href={`/voters?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => setSearchResultsOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors block"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-brand-600 uppercase">
                      EPIC SEARCH
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-brand-600">
                      View all voter entries matching &quot;{searchQuery}&quot;
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Search across 2,045 Polling Stations &amp; 21.54 L Electors
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-colors" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: AI Mode + Notifications + Theme + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* AI Mode Gradient Action Button */}
        <Link
          href="/ai/assistant"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:opacity-95"
          title="Open Global AI Election Intelligence"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
          <span className="hidden sm:inline">AI Mode</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
            title="System Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                  Operational Alerts (3 new)
                </span>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-brand-600 hover:underline font-semibold"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    3 Swing Booths Require Slip Surge
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Booth #103 &amp; #108 are under 50% distribution.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">5m ago</span>
                </div>
                <div className="p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    ECI Draft Roll Batch #4029 Synced
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    1,420 records processed across 8 wards.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">22m ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4.5 h-4.5 text-amber-400" />
          ) : (
            <Moon className="w-4.5 h-4.5" />
          )}
        </button>

        {/* User Profile Avatar Dropdown */}
        <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
              {candidateInitials}
            </div>

            <div className="text-left hidden md:block leading-tight max-w-[120px]">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {user?.name || "Adv. Vikram Patil"}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Candidate Admin
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {user?.name || "Adv. Vikram Patil"}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {user?.email || "candidate@rajtantra.in"}
                </p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700">
                  Candidate Admin • 34 Pune PC
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/settings/organization"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>Constituency War Room</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Portal Settings</span>
                </Link>

                <a
                  href={process.env.NEXT_PUBLIC_SUPERADMIN_URL || "http://localhost:3000"}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                >
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Super Admin Portal (Port 3000)</span>
                </a>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
