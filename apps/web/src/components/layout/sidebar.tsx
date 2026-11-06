"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  AlertCircle,
  Users,
  UserCheck,
  BookOpen,
  Filter,
  FileEdit,
  Shield,
  Activity,
  Vote,
  BadgeCheck,
  Megaphone,
  PhoneCall,
  Bot,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export interface NavItemConfig {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeType?: "warning" | "teal" | "violet" | "default";
  pulseDot?: boolean;
}

export interface NavGroupConfig {
  groupTitle: string;
  items: NavItemConfig[];
}

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const NAV_GROUPS: NavGroupConfig[] = [
  {
    groupTitle: "CORE OPERATIONS",
    items: [
      {
        key: "dashboard",
        label: "War Room Dashboard",
        href: "/candidate",
        icon: LayoutDashboard,
      },
      {
        key: "field-map",
        label: "Live Field Map",
        href: "/candidate/field-map",
        icon: MapPin,
        pulseDot: true,
      },
      {
        key: "tickets",
        label: "Office & Issues",
        href: "/candidate/office/tickets",
        icon: AlertCircle,
        badge: 2,
        badgeType: "warning",
      },
    ],
  },
  {
    groupTitle: "VOTER INTELLIGENCE",
    items: [
      {
        key: "voters",
        label: "Total Voters",
        href: "/candidate/voters",
        icon: Users,
      },
      {
        key: "voter-profile",
        label: "Central Voter Profile",
        href: "/candidate/voters/profile",
        icon: UserCheck,
      },
      {
        key: "phonebook",
        label: "Phone Book",
        href: "/candidate/voters/phonebook",
        icon: BookOpen,
      },
      {
        key: "requests",
        label: "Voter Update Requests",
        href: "/candidate/voters/requests",
        icon: FileEdit,
        badge: 14,
        badgeType: "warning",
      },
      {
        key: "filters",
        label: "Filters & Segmentation",
        href: "/candidate/voters/filters",
        icon: Filter,
      },
    ],
  },
  {
    groupTitle: "WORKFORCE & TEAM",
    items: [
      {
        key: "users",
        label: "Users & Karyakarta",
        href: "/candidate/users",
        icon: Users,
        pulseDot: true,
      },
      {
        key: "blo",
        label: "BLO Information",
        href: "/candidate/blo",
        icon: Shield,
      },
      {
        key: "booths",
        label: "Booth Management",
        href: "/candidate/booths",
        icon: Vote,
      },
      {
        key: "members",
        label: "Members & Cadre",
        href: "/candidate/members",
        icon: BadgeCheck,
      },
      {
        key: "activities",
        label: "User Activities",
        href: "/candidate/users/activities",
        icon: Activity,
      },
    ],
  },
  {
    groupTitle: "CAMPAIGN & PLANS",
    items: [
      {
        key: "campaigns",
        label: "Campaign Control",
        href: "/candidate/campaigns",
        icon: Megaphone,
      },
      {
        key: "ai-calling",
        label: "AI Calling Outreach",
        href: "/candidate/ai/calling",
        icon: PhoneCall,
        badge: "AI",
        badgeType: "violet",
      },
      {
        key: "ai-assistant",
        label: "AI Strategy Advisor",
        href: "/candidate/ai/assistant",
        icon: Bot,
        badge: "Bot",
        badgeType: "violet",
      },
      {
        key: "subscriptions",
        label: "Subscription Plans",
        href: "/candidate/subscriptions",
        icon: CreditCard,
      },
      {
        key: "reports",
        label: "Reports & Analytics",
        href: "/candidate/reports",
        icon: BarChart3,
      },
    ],
  },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isItemActive = (href: string) => {
    if (href === "/candidate") {
      return pathname === "/candidate" || pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
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
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          role="presentation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* REFERENCE 2 EXACT THEME: SLATE-950 DEEP NAVY SIDEBAR */}
      <aside
        aria-label="Rajtantra Candidate Navigation"
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col justify-between h-screen bg-slate-950 text-slate-300 border-r border-slate-900 shadow-xl select-none transition-all duration-200 ease-in-out ${
          collapsed ? "md:w-20" : "md:w-64"
        } ${
          mobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* BRAND HEADER BAR */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-900/80 bg-slate-950">
          {collapsed && !mobileOpen ? (
            <div className="w-full flex items-center justify-center">
              <Link
                href="/dashboard"
                className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 text-sm hover:scale-105 transition-transform"
                title="Rajtantra / INDATA Candidate War Room"
              >
                IN
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link
                href="/dashboard"
                onClick={onCloseMobile}
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-sm tracking-wide shrink-0">
                  IN
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-white leading-tight flex items-center gap-1.5">
                    INDATA
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </span>
                  <span className="text-[10px] font-bold bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider uppercase block">
                    Candidate Portal
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-1">
                {onToggleCollapse && (
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors hidden md:block"
                    title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                  >
                    {collapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MIDDLE SCROLLABLE NAVIGATION LIST */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">
                  {group.groupTitle}
                </p>
              )}

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const active = isItemActive(item.href);
                  const IconComp = item.icon;

                  if (collapsed && !mobileOpen) {
                    return (
                      <div key={item.key} className="flex justify-center py-0.5">
                        <Link
                          href={item.href}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative group ${
                            active
                              ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                          }`}
                          title={item.label}
                        >
                          <IconComp className="w-4 h-4 shrink-0" />

                          {item.pulseDot && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
                          )}

                          {item.badge && (
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950">
                              {item.badge}
                            </span>
                          )}

                          {/* Floating Tooltip */}
                          <div
                            role="tooltip"
                            className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-2"
                          >
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
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
                      key={item.key}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                      }`}
                    >
                      <IconComp
                        className={`w-4 h-4 shrink-0 ${
                          active
                            ? "text-white"
                            : item.key === "dashboard"
                            ? "text-brand-400"
                            : item.key === "field-map" || item.key === "voters"
                            ? "text-cyan-400"
                            : item.key === "tickets"
                            ? "text-amber-400"
                            : "text-slate-400"
                        }`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>

                      {item.pulseDot && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}

                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.badgeType === "warning"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : item.badgeType === "violet"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* BOTTOM USER PROFILE & ECI STATUS */}
        <div className="p-3 border-t border-slate-900 bg-slate-950/90 space-y-2">
          {collapsed && !mobileOpen ? (
            <div className="flex justify-center">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer relative group"
                title={`${user?.name || "Adv. Vikram Patil"} - Candidate Admin`}
              >
                {candidateInitials}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-white p-3 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  <p className="font-bold text-slate-100">{user?.name || "Adv. Vikram Patil"}</p>
                  <p className="text-[11px] text-slate-400 font-normal">
                    {user?.constituencyName || "34 - Pune Constituency"}
                  </p>
                  <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ECI Roll Sync: Active</span>
                  </div>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                  {candidateInitials}
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="text-xs font-bold text-white truncate">
                    {user?.name || "Adv. Vikram Patil"}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user?.constituencyName || "34 - Pune Constituency"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0"
                title="Sign out of War Room"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ECI SYNC TELEMETRY */}
          {!collapsed && (
            <div className="px-2 pt-0.5 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ECI War Room Sync</span>
              </span>
              <span className="font-semibold text-emerald-400">Optimal</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
