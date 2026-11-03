"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  MapPin,
  Vote,
  RefreshCw,
  Bell,
  Sun,
  Moon,
  Check,
  Building,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";

export interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

export function Header({
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: HeaderProps) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast(
      "info",
      "Voter Registry Search",
      `Filtering electors for: "${searchQuery}"`,
    );
  };

  const handleSyncRoll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast(
        "success",
        "Roll Telemetry Synced",
        "All 264 Polling Booths synchronized with ECI master roll.",
      );
    }, 700);
  };


  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onOpenMobile();
    } else {
      onToggleCollapse();
    }
  };

  return (
    <header className="sticky top-0 right-0 z-30 flex items-center justify-between px-3 sm:px-4 lg:px-5 h-[60px] w-full max-w-full bg-white dark:bg-[#162235] border-b border-[#E1E6EE] dark:border-[#23344E] shadow-2xs select-none gap-2 sm:gap-3 overflow-hidden min-w-0">
      {/* LEFT: Sidebar Toggle & Breadcrumbs & Search */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="p-1.5 rounded-md text-[#526B91] hover:text-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] transition-colors cursor-pointer shrink-0"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Institutional Breadcrumb */}
        <nav
          aria-label="Breadcrumb navigation"
          className="hidden md:flex items-center gap-1.5 text-xs text-[#68758A] dark:text-[#8B9BB4] shrink-0 font-medium"
        >
          <span className="hover:text-[#253247] transition-colors">INDIATA</span>
          <span className="text-[#ACB9D1]">&rsaquo;</span>
          <span className="hover:text-[#253247] transition-colors">Candidate Portal</span>
          <span className="text-[#ACB9D1]">&rsaquo;</span>
          <span className="text-[#253247] dark:text-[#F1F5F9] font-semibold">Overview</span>
        </nav>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[120px] max-w-[220px] sm:max-w-[260px]">
          <Search className="w-3.5 h-3.5 text-[#68758A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search voter EPIC, booth..."
            className="w-full pl-8 pr-2.5 py-1 bg-[#F4F6F9] dark:bg-[#1E2D44] text-[#253247] dark:text-[#F1F5F9] placeholder:text-[#68758A] dark:placeholder:text-[#8B9BB4] border border-[#E1E6EE] dark:border-[#23344E] rounded-md text-[13px] font-normal focus:outline-none focus:border-[#3159A8] focus:ring-1 focus:ring-[#3159A8] transition-all shadow-2xs truncate"
          />
        </form>

        {/* Administrative Selectors (Visible on desktop) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Constituency Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] text-xs font-medium text-[#253247] dark:text-[#F1F5F9] shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#526B91]" />
            <span>East Delhi (AC-54)</span>
          </div>

          {/* Election Selector */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] text-xs font-medium text-[#253247] dark:text-[#F1F5F9] shadow-2xs">
            <Vote className="w-3.5 h-3.5 text-[#526B91]" />
            <span>General Election 2024</span>
          </div>
        </div>
      </div>

      {/* RIGHT: System Sync & Notifications & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Sync Button */}
        <button
          type="button"
          onClick={handleSyncRoll}
          className="p-1.5 rounded-md text-[#526B91] dark:text-[#8B9BB4] hover:text-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] transition-all cursor-pointer shrink-0"
          title="Synchronize Roll Telemetry"
          aria-label="Synchronize Roll Telemetry"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#3159A8]" : ""}`}
          />
        </button>

        {/* Notification Bell */}
        <div className="relative shrink-0" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-md text-[#526B91] dark:text-[#8B9BB4] hover:text-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] transition-colors shadow-2xs cursor-pointer relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#C58A32] rounded-full pointer-events-none" />
          </button>

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white dark:bg-[#162235] border border-[#E1E6EE] dark:border-[#23344E] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-2 border-b border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#253247] dark:text-[#F1F5F9]">
                  Administrative Alerts
                </span>
                <span className="text-[10px] font-semibold text-[#3159A8] bg-[#F0F4FA] dark:bg-[#1A2844] px-1.5 py-0.5 rounded">
                  2 Pending
                </span>
              </div>
              <div className="divide-y divide-[#E1E6EE] dark:divide-[#23344E] max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors cursor-pointer">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#24866A]">
                    <Check className="w-3.5 h-3.5" />
                    <span>ECI Draft Roll Batch #4029 Synced</span>
                  </div>
                  <p className="text-[11px] text-[#68758A] dark:text-[#8B9BB4] mt-0.5">
                    1,420 electors processed across 8 wards.
                  </p>
                  <span className="text-[10px] text-[#68758A] mt-1 block">
                    4 minutes ago
                  </span>
                </div>

                <div className="p-3 hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors cursor-pointer">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C58A32]">
                    <Vote className="w-3.5 h-3.5" />
                    <span>BLO Verification Pending</span>
                  </div>
                  <p className="text-[11px] text-[#68758A] dark:text-[#8B9BB4] mt-0.5">
                    6 Booth vacancies flagged for officer assignment.
                  </p>
                  <span className="text-[10px] text-[#68758A] mt-1 block">
                    18 minutes ago
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-[#68758A] hover:text-[#253247] dark:hover:text-[#F1F5F9] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors cursor-pointer shrink-0"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle color theme"
        >
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[#68758A]" />
          )}
        </button>

        {/* Candidate Profile Avatar Dropdown */}
        <div className="relative pl-1.5 sm:pl-2 border-l border-[#E1E6EE] dark:border-[#23344E] shrink-0" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3159A8] text-white flex items-center justify-center text-xs font-semibold shadow-2xs shrink-0">
              RS
            </div>

            <div className="text-left hidden lg:block leading-none max-w-[130px]">
              <div className="text-xs font-semibold text-[#253247] dark:text-[#F1F5F9] truncate">
                Rajeshwar Sharma
              </div>
              <div className="text-[10px] text-[#68758A] dark:text-[#8B9BB4] font-medium mt-0.5 truncate">
                Candidate • AC-54
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#68758A] hidden lg:block shrink-0" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-[#162235] border border-[#E1E6EE] dark:border-[#23344E] shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-2 border-b border-[#E1E6EE] dark:border-[#23344E]">
                <p className="text-xs font-semibold text-[#253247] dark:text-[#F1F5F9]">
                  Rajeshwar Sharma
                </p>
                <p className="text-[10px] text-[#68758A] dark:text-[#8B9BB4] truncate mt-0.5">
                  candidate@indiata.in
                </p>
                <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#EBF7F3] text-[#24866A] border border-[#24866A]/20">
                  Authorized Candidate
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/settings/organization"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#253247] dark:text-[#F1F5F9] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors"
                >
                  <Building className="w-3.5 h-3.5 text-[#68758A]" />
                  <span>Kasba Peth War Room</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#253247] dark:text-[#F1F5F9] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#68758A]" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="border-t border-[#E1E6EE] dark:border-[#23344E] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#C84D55] hover:bg-[#FDF2F3] dark:hover:bg-[#3D1417] transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
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
