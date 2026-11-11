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
  ChevronLeft,
  ChevronRight,
  X,
  Languages,
} from "lucide-react";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../context/karyakarta-language-context";
import { LanguageType } from "../../types/karyakarta.types";

interface KaryakartaSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
}

export function KaryakartaSidebar({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
}: KaryakartaSidebarProps) {
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
    <aside
      className={`w-full bg-slate-950 text-slate-300 border-r border-slate-900 shadow-xl flex flex-col h-full select-none transition-all duration-200 ease-in-out`}
    >
      {/* Brand & Karyakarta Identity Header (Candidate Master Theme) */}
      {collapsed ? (
        <div className="h-16 px-2 flex flex-col items-center justify-center border-b border-slate-900/80 bg-slate-950 relative">
          <Link
            href="/karyakarta/dashboard"
            onClick={onCloseMobile}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-sm tracking-wide hover:scale-105 transition-transform"
            title="INDIATA Field Cadre Portal"
          >
            IN
          </Link>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="mt-1 p-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 border-b border-slate-900/80 bg-slate-950">
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/karyakarta/dashboard"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 min-w-0 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-sm tracking-wide shrink-0">
                IN
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-white leading-tight flex items-center gap-1.5">
                  INDIATA
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="text-[10px] font-bold bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider uppercase block">
                  Field Cadre Portal
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="hidden lg:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {onCloseMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Karyakarta Credential Card (Candidate Palette) */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
              <span className="truncate">{user?.name || "Sachin D. Mane"}</span>
              <span className="text-[10px] font-mono font-bold text-[#2087FE] bg-blue-950/80 border border-blue-900/60 px-1.5 py-0.5 rounded">
                {user?.id || "KAR-01"}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              Cand: <span className="font-semibold text-slate-200">{user?.candidateName || "Anand Shinde"}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {user?.assignedBooths.map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Credential Pill */}
      {collapsed && (
        <div className="py-2 flex justify-center border-b border-slate-900/60">
          <div className="relative group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs cursor-pointer">
              {user?.name?.slice(0, 2).toUpperCase() || "SM"}
            </div>
            {/* Tooltip */}
            <div
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-white p-3 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              <p className="font-bold text-slate-100">{user?.name || "Sachin D. Mane"} ({user?.id || "KAR-01"})</p>
              <p className="text-[11px] text-slate-400 font-normal">Candidate: {user?.candidateName || "Anand Shinde"}</p>
              <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Booths: {user?.assignedBooths.join(", ") || "All"}</span>
              </div>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-3 space-y-4 scrollbar-thin">
        {/* Primary Navigation */}
        <div>
          {!collapsed && (
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Field Operations
            </div>
          )}
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/karyakarta/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              if (collapsed) {
                return (
                  <div key={item.href} className="flex justify-center py-0.5">
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative group ${
                        isActive
                          ? "bg-[#2087FE] text-white shadow-md shadow-blue-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {/* Floating Tooltip */}
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-2"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-500/20 text-[#2087FE] border border-blue-500/30">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                      </div>
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2087FE] text-white shadow-premium-xs"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-950/60 text-blue-300 border border-blue-800/60"
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
          {!collapsed && (
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Ledger &amp; Settings
            </div>
          )}
          <div className="space-y-0.5">
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (collapsed) {
                return (
                  <div key={item.href} className="flex justify-center py-0.5">
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative group ${
                        isActive
                          ? "bg-[#2087FE] text-white shadow-md shadow-blue-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {/* Floating Tooltip */}
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      >
                        <span>{item.label}</span>
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                      </div>
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2087FE] text-white shadow-premium-xs"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language Switcher & State Simulator Footer */}
      {collapsed ? (
        <div className="p-2 border-t border-slate-900/80 bg-slate-950 flex flex-col items-center gap-2">
          {/* Quick Language Cycle Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => {
                const nextLang: Record<LanguageType, LanguageType> = {
                  en: "mr",
                  mr: "hi",
                  hi: "en",
                };
                setLanguage(nextLang[language]);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-900 hover:text-white transition-colors uppercase font-mono font-bold text-[10px]"
              title="Cycle Language"
            >
              {language}
            </button>
            <div
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              Language: {language.toUpperCase()} (Click to cycle)
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          </div>

          {/* Compact Sign Out */}
          <div className="relative group">
            <button
              type="button"
              onClick={logout}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <div
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-rose-300 px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              {t("nav.logout", "Sign Out")}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-900/80 bg-slate-950 space-y-2">
          {/* Language Selection Row */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Languages className="w-3.5 h-3.5 text-[#2087FE]" />
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
                      ? "bg-[#2087FE] text-white"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* QA Test Status Simulator */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1">
              <span>QA State Switcher:</span>
              <span className="font-mono text-[9px] text-cyan-400">Dev Mode</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setMockAccount("ACTIVE")}
                className="px-1 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 font-semibold cursor-pointer text-center"
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setMockAccount("PENDING_APPROVAL")}
                className="px-1 py-0.5 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800/60 font-semibold cursor-pointer text-center"
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setMockAccount("SUSPENDED")}
                className="px-1 py-0.5 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-semibold cursor-pointer text-center"
              >
                Blocked
              </button>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("nav.logout", "Sign Out")}</span>
          </button>
        </div>
      )}
    </aside>
  );
}
