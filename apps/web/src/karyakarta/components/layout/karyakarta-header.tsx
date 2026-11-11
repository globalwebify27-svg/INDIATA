"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../context/karyakarta-language-context";
import { LanguageType } from "../../types/karyakarta.types";

interface KaryakartaHeaderProps {
  onOpenMobile: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function KaryakartaHeader({
  onOpenMobile,
  collapsed,
  onToggleCollapse,
}: KaryakartaHeaderProps) {
  const { user } = useKaryakartaAuth();
  const { language, setLanguage } = useKaryakartaLanguage();

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onOpenMobile();
    } else {
      onToggleCollapse?.();
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-premium-xs">
      {/* Left: Mobile Menu / Collapse Button & Constituency Context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleToggle}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E0EDFE] dark:bg-blue-950/40 text-[#2087FE] dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#2087FE] shrink-0" />
            <span className="truncate">{user?.constituencyName || "215 - Kasba Peth Assembly"}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Booth Scoped ({user?.assignedBooths.join(", ") || "All"})</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Fast Actions & User Identity */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Voter Search Shortcut */}
        <Link
          href="/karyakarta/search-voter"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Search Voter</span>
        </Link>

        {/* AI Assistant Quick Pill */}
        <Link
          href="/karyakarta/ai-mode"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#2087FE] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-premium-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Link>

        {/* Language Quick Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
          {(["en", "mr", "hi"] as LanguageType[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 rounded-lg uppercase transition-all ${
                language === lang
                  ? "bg-white dark:bg-slate-900 text-[#2087FE] shadow-xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Field Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2087FE]" />
        </button>

        {/* Cadre Badge & Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
            {user?.name?.slice(0, 2).toUpperCase() || "SA"}
          </div>
          <div className="hidden xl:block text-left text-xs">
            <div className="font-bold text-slate-900 dark:text-white leading-tight">
              {user?.name || "Sachin D. Mane"}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Karyakarta</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
