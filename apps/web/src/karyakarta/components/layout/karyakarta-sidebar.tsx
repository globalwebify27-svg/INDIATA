"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Filter,
  AlertCircle,
  Sparkles,
  Phone,
  MapPin,
  FileText,
  Printer,
  History,
  UserCheck,
  LogOut,
  X,
  Languages,
} from "lucide-react";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../context/karyakarta-language-context";
import { LanguageType } from "../../types/karyakarta.types";

interface KaryakartaSidebarProps {
  onCloseMobile?: () => void;
}

export function KaryakartaSidebar({ onCloseMobile }: KaryakartaSidebarProps) {
  const pathname = usePathname();
  const { user, logout, setMockAccount } = useKaryakartaAuth();
  const { language, setLanguage, t } = useKaryakartaLanguage();

  const mainNavItems = [
    { href: "/karyakarta/dashboard", label: t("nav.dashboard", "Dashboard"), icon: LayoutDashboard },
    { href: "/karyakarta/search-voter", label: t("nav.search_voter", "Search Voter"), icon: Search },
    { href: "/karyakarta/advanced-search", label: t("nav.advanced_search", "Advanced Filter"), icon: Filter },
    { href: "/karyakarta/issues", label: t("nav.issues", "Voter Issues"), icon: AlertCircle, badge: "2 Open" },
    { href: "/karyakarta/ai-mode", label: t("nav.ai_mode", "AI Field Assistant"), icon: Sparkles, badge: "AI" },
    { href: "/karyakarta/phone-book", label: t("nav.phone_book", "Phone Book"), icon: Phone },
    { href: "/karyakarta/booth-info", label: t("nav.booth_info", "Booth & BLO Directory"), icon: MapPin },
    { href: "/karyakarta/reports", label: t("nav.reports", "Reports & Exports"), icon: FileText },
  ];

  const secondaryNavItems = [
    { href: "/karyakarta/slip-history", label: t("nav.slip_history", "Slip History"), icon: Printer },
    { href: "/karyakarta/activity-history", label: t("nav.activity_history", "Activity History"), icon: History },
    { href: "/karyakarta/profile", label: t("nav.profile", "Profile & Settings"), icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full select-none">
      {/* Brand & Karyakarta Identity Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2087FE] to-[#6256D9] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              I
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                INDIATA
              </div>
              <div className="text-[10px] font-semibold text-[#6256d9] mt-0.5 tracking-wider uppercase">
                Field Cadre Portal
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Karyakarta Credential Card */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-100 mb-1">
            <span className="truncate">{user?.name || "Sachin D. Mane"}</span>
            <span className="text-[10px] font-mono font-bold text-[#2087FE] bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded">
              {user?.id || "KAR-01"}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Cand: <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.candidateName || "Anand Shinde"}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {user?.assignedBooths.map((b) => (
              <span
                key={b}
                className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <div>
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Field Operations
          </div>
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/karyakarta/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#6256d9] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Secondary Audit & Preferences Navigation */}
        <div>
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Ledger &amp; Settings
          </div>
          <div className="space-y-0.5">
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#6256d9] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language Switcher & State Simulator Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
        {/* Language Selection Row */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Languages className="w-3.5 h-3.5 text-[#6256d9]" />
            <span className="font-semibold text-[11px]">Language:</span>
          </div>
          <div className="flex items-center gap-1">
            {(["en", "mr", "hi"] as LanguageType[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  language === lang
                    ? "bg-[#6256d9] text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* QA Test Status Simulator */}
        <div className="p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50">
          <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
            <span>QA State Switcher:</span>
            <span className="font-mono text-[9px]">Dev Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setMockAccount("ACTIVE")}
              className="px-1 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-semibold cursor-pointer text-center"
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setMockAccount("PENDING_APPROVAL")}
              className="px-1 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold cursor-pointer text-center"
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => setMockAccount("SUSPENDED")}
              className="px-1 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 font-semibold cursor-pointer text-center"
            >
              Blocked
            </button>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t("nav.logout", "Sign Out")}</span>
        </button>
      </div>
    </aside>
  );
}
