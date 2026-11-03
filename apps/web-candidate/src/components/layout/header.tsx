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
  Radio,
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

  const handleEmergency = () => {
    showToast(
      "error",
      "Emergency Protocol Armed",
      "High-priority dispatch notification sent to central war room command.",
    );
  };

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onOpenMobile();
    } else {
      onToggleCollapse();
    }
  };

  return (
    <header className="sticky top-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 w-full bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#1E293B] shadow-xs select-none">
      {/* LEFT: Sidebar Toggle & Search & Location Badges */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="p-2 rounded-lg text-[#493BBF] hover:bg-[#493BBF]/10 transition-colors cursor-pointer"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative w-56 sm:w-72">
          <Search className="w-4 h-4 text-[#493BBF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search voter EPIC, booth..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F2F3FF] dark:bg-[#1E293B] text-[#161B2A] dark:text-[#F8FAFC] placeholder:text-[#787585] dark:placeholder:text-[#94A3B8] border border-[#493BBF]/20 rounded-lg text-xs font-medium focus:outline-none focus:border-[#493BBF] focus:ring-2 focus:ring-[#493BBF]/20 transition-all shadow-2xs"
          />
        </form>

        {/* Location & Election Selector Badges */}
        <div className="hidden xl:flex items-center gap-2">
          {/* East Delhi AC-54 */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#493BBF]/10 to-[#6256D9]/10 text-[#493BBF] dark:text-[#C5C0FF] px-3 py-1 rounded-full border border-[#493BBF]/30 text-xs font-bold shadow-2xs hover:scale-105 transition-transform cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-[#493BBF]" />
            <span>East Delhi</span>
            <span className="text-[10px] text-white bg-[#493BBF] px-1.5 py-0.2 rounded-full font-extrabold">
              AC-54
            </span>
          </div>

          {/* General 2024 */}
          <div className="text-[#0060AB] dark:text-[#88BEF8] px-3 py-1 text-xs font-bold bg-[#0060AB]/10 rounded-full border border-[#0060AB]/30 flex items-center gap-1.5 shadow-2xs hover:scale-105 transition-transform cursor-pointer">
            <Vote className="w-3.5 h-3.5" />
            <span>General 2024</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Live Nodes & Quick Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* 14,290 Live Nodes Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm" />
          </span>
          <span>14,290 Live Nodes</span>
        </div>

        {/* Sync Button */}
        <button
          type="button"
          onClick={handleSyncRoll}
          className="p-2 rounded-lg text-[#493BBF] dark:text-[#C5C0FF] bg-[#493BBF]/5 hover:bg-[#493BBF]/15 border border-[#493BBF]/20 transition-all cursor-pointer"
          title="Synchronize Live Roll Status"
        >
          <RefreshCw
            className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
          />
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors shadow-2xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#BA1A1A] rounded-full animate-pulse pointer-events-none" />

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-2 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
                <span className="text-xs font-bold text-[#161B2A] dark:text-[#F8FAFC]">
                  War Room Telemetry Alerts
                </span>
                <span className="text-[10px] font-bold text-[#493BBF] bg-[#ECE8FF] px-1.5 py-0.5 rounded">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-[#F1F3FA] dark:hover:bg-[#1E293B] transition-colors cursor-pointer">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#159B91]">
                    <Check className="w-3.5 h-3.5" />
                    <span>ECI Draft Roll Batch #4029 Synced</span>
                  </div>
                  <p className="text-[11px] text-[#707E94] dark:text-[#94A3B8] mt-0.5">
                    1,420 records processed across 8 wards.
                  </p>
                  <span className="text-[9px] text-[#707E94] mt-1 block">
                    4 minutes ago
                  </span>
                </div>

                <div className="p-3 hover:bg-[#F1F3FA] dark:hover:bg-[#1E293B] transition-colors cursor-pointer">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E99A32]">
                    <Vote className="w-3.5 h-3.5" />
                    <span>BLO Verification Required</span>
                  </div>
                  <p className="text-[11px] text-[#707E94] dark:text-[#94A3B8] mt-0.5">
                    6 Booth vacancies flagged for urgent officer mapping.
                  </p>
                  <span className="text-[9px] text-[#707E94] mt-1 block">
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
          className="p-2 rounded-lg text-[#707E94] hover:text-[#161B2A] dark:hover:text-white hover:bg-[#F1F3FA] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#707E94]" />
          )}
        </button>

        {/* Emergency Action Button */}
        <button
          type="button"
          onClick={handleEmergency}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm hover:shadow-md hover:from-red-700 hover:to-rose-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Emergency</span>
        </button>

        {/* Candidate Profile Avatar Dropdown */}
        <div className="relative pl-2 border-l border-[#C8C4D6]/60 dark:border-[#334155]" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-0.5 rounded-lg hover:bg-[#F1F3FA] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <div className="relative ring-2 ring-[#493BBF]/40 rounded-full p-0.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#493BBF] to-[#6256D9] text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
                RS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5 flex items-center justify-center ring-2 ring-white dark:ring-[#0F172A]">
                <Check className="w-2 h-2 text-white" />
              </span>
            </div>

            <div className="text-left hidden lg:block leading-none">
              <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC]">
                Rajeshwar Sharma
              </div>
              <div className="text-[10px] text-[#493BBF] dark:text-[#C5C0FF] font-bold mt-0.5">
                Candidate • AC-54
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#707E94] hidden lg:block" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-2 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                <p className="text-xs font-bold text-[#161B2A] dark:text-[#F8FAFC]">
                  Rajeshwar Sharma
                </p>
                <p className="text-[10px] text-[#707E94] dark:text-[#94A3B8] truncate mt-0.5">
                  candidate@rajtantra.in
                </p>
                <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E6F7F5] text-[#159B91]">
                  Candidate Clearance L4
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/settings/organization"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#161B2A] dark:text-[#F8FAFC] hover:bg-[#F1F3FA] dark:hover:bg-[#1E293B] transition-colors"
                >
                  <Building className="w-4 h-4 text-[#707E94]" />
                  <span>Kasba Peth War Room</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#161B2A] dark:text-[#F8FAFC] hover:bg-[#F1F3FA] dark:hover:bg-[#1E293B] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#707E94]" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#E15B70] hover:bg-[#FDF2F4] dark:hover:bg-[#4C0519]/30 transition-colors"
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
