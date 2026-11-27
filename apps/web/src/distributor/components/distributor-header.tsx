"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  UserPlus,
  Building,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";
import { useDistributorAuth } from "../context/distributor-auth-context";
import { useTheme } from "@/context/theme-context";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenMobile?: () => void;
}

export function DistributorHeader({
  title,
  subtitle,
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: HeaderProps) {
  const { distributor } = useDistributorAuth();
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onOpenMobile?.();
    } else {
      onToggleCollapse?.();
    }
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-[#0B101A]/95 border-b border-slate-200/80 dark:border-[#29364A] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-premium-xs backdrop-blur-md">
      {/* Title & Territory Info with Toggle Menu */}
      <div className="flex items-center gap-3 min-w-0">
        {(onOpenMobile || onToggleCollapse) && (
          <button
            type="button"
            onClick={handleToggle}
            className="p-2 rounded-xl text-slate-600 dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1B2638] transition-colors shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] leading-tight truncate">
            {title || "Distributor Console"}
          </h1>
          {subtitle ? (
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] truncate">{subtitle}</p>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#94A3B8]">
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-[#F8FAFC] truncate">
                <Building className="w-3.5 h-3.5 text-blue-600 dark:text-[#2087FE] shrink-0" />
                <span>{distributor?.name || "Maharashtra Western"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-600 dark:text-[#94A3B8] shrink-0" />
                <span>{distributor?.territory || "Pune Metro"}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Scoped Tenant Isolation Security Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Tenant Isolated ({distributor?.distributorCode || "DIS-101"})</span>
        </div>

        {/* Quick Candidate Onboarding Button */}
        <Link
          href="/distributor/candidates/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-[#1D61E0] dark:hover:bg-[#2563EB] text-white transition-colors shadow-premium-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Candidate</span>
        </Link>

        {/* Theme Toggle (☀️ / 🌙) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1B2638] transition-colors cursor-pointer"
          title={theme === "dark" ? "Switch to Daylight Mode" : "Switch to Obsidian Dark Mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl text-slate-600 dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1B2638] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-[#29364A]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
            {distributor?.contactPerson?.slice(0, 2).toUpperCase() || "SP"}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-bold text-slate-800 dark:text-[#F8FAFC]">
              {distributor?.contactPerson || "Suresh Patil"}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-[#94A3B8]">Franchise Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
}
