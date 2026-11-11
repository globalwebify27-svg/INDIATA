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
}

export function KaryakartaHeader({ onOpenMobile }: KaryakartaHeaderProps) {
  const { user } = useKaryakartaAuth();
  const { language, setLanguage } = useKaryakartaLanguage();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Menu & Constituency Context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E0EDFE] dark:bg-blue-950/40 text-[#2087FE] dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80">
            <MapPin className="w-3.5 h-3.5 text-[#2087FE]" />
            <span>{user?.constituencyName || "215 - Kasba Peth Assembly"}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Booth Scoped ({user?.assignedBooths.join(", ") || "All"})</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Fast Actions & User Identity */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Voter Search Shortcut */}
        <Link
          href="/karyakarta/search-voter"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Search Voter</span>
        </Link>

        {/* AI Assistant Quick Pill (Candidate Gradient) */}
        {user?.hasAiSeat && (
          <Link
            href="/karyakarta/ai-mode"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2087FE] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">AI Assistant</span>
          </Link>
        )}

        {/* Language Quick Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
          {(["en", "mr", "hi"] as LanguageType[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                language === lang
                  ? "bg-white dark:bg-slate-700 text-[#2087FE] dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* Karyakarta Avatar & Name (Candidate Gradient) */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
            {user?.name.slice(0, 2).toUpperCase() || "SM"}
          </div>
          <div className="hidden xl:block text-left text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-100">
              {user?.name || "Sachin D. Mane"}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Verified Karyakarta</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
