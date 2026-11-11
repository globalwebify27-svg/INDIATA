"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  MapPin,
  Building2,
  CheckSquare,
  BookUser,
  Filter,
  Users,
  Shield,
  Activity,
  Megaphone,
  CreditCard,
  BarChart3,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export interface NavItemConfig {
  key: string;
  label: string;
  href?: string;
  isAction?: boolean;
  actionKey?: "logout";
  icon: LucideIcon;
  iconColor: string; // Inactive accent color class
  badge?: string | number;
  badgeType?: "warning" | "teal" | "violet" | "default";
  pulseDot?: boolean; // Cyan pulse dot
  amberDot?: boolean; // Amber indicator dot (e.g. Users)
  hasChevron?: boolean; // Downward chevron (e.g. Users)
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
        icon: LayoutGrid,
        iconColor: "text-slate-300",
      },
      {
        key: "field-map",
        label: "Live Field Map",
        href: "/candidate/field-map",
        icon: MapPin,
        iconColor: "text-cyan-400",
        pulseDot: true,
      },
      {
        key: "office-issues",
        label: "Office & Issues",
        href: "/candidate/office",
        icon: Building2,
        iconColor: "text-amber-400",
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
        icon: CheckSquare,
        iconColor: "text-cyan-400",
      },
      {
        key: "phonebook",
        label: "Phone Book",
        href: "/candidate/phonebook",
        icon: BookUser,
        iconColor: "text-purple-400",
      },
      {
        key: "filters",
        label: "Filters",
        href: "/candidate/filters",
        icon: Filter,
        iconColor: "text-blue-400",
      },
    ],
  },
  {
    groupTitle: "WORKFORCE & TEAM",
    items: [
      {
        key: "users",
        label: "Users",
        href: "/candidate/users",
        icon: Users,
        iconColor: "text-emerald-400",
        amberDot: true,
        hasChevron: true,
      },
      {
        key: "blo",
        label: "BLO Information",
        href: "/candidate/blo",
        icon: Shield,
        iconColor: "text-blue-400",
      },
      {
        key: "activities",
        label: "User Activities",
        href: "/candidate/activities",
        icon: Activity,
        iconColor: "text-cyan-400",
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
        iconColor: "text-rose-400",
      },
      {
        key: "subscriptions",
        label: "Subscription Plans",
        href: "/candidate/subscriptions",
        icon: CreditCard,
        iconColor: "text-amber-400",
      },
    ],
  },
  {
    groupTitle: "ANALYTICS & STRATEGY",
    items: [
      {
        key: "reports",
        label: "Reports",
        href: "/candidate/reports",
        icon: BarChart3,
        iconColor: "text-purple-400",
      },
      {
        key: "strategy",
        label: "Previous Election & Strategy",
        href: "/candidate/strategy",
        icon: History,
        iconColor: "text-fuchsia-400",
      },
    ],
  },
  {
    groupTitle: "ADMINISTRATION",
    items: [
      {
        key: "settings",
        label: "Profile & Party Settings",
        href: "/candidate/settings",
        icon: Settings,
        iconColor: "text-slate-400",
      },
      {
        key: "logout",
        label: "Logout",
        isAction: true,
        actionKey: "logout",
        icon: LogOut,
        iconColor: "text-rose-400",
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

  const isItemActive = (href?: string) => {
    if (!href) return false;
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

      {/* CANDIDATE SIDEBAR: OBSIDIAN SLATE-950 THEME */}
      <aside
        aria-label="INDIATA Candidate Navigation"
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col justify-between h-screen bg-slate-950 text-slate-300 border-r border-slate-900 shadow-xl select-none transition-all duration-200 ease-in-out ${
          collapsed ? "md:w-20" : "md:w-64"
        } ${
          mobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* BRAND HEADER BAR */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-900/80 bg-slate-950 shrink-0">
          {collapsed && !mobileOpen ? (
            <div className="w-full flex items-center justify-center relative">
              <Link
                href="/candidate"
                className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 text-sm hover:scale-105 transition-transform"
                title="INDIATA Candidate War Room"
              >
                IN
              </Link>
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors hidden md:block"
                  title="Expand Sidebar"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link
                href="/candidate"
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
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">
                  {group.groupTitle}
                </p>
              )}

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const active = !item.isAction && isItemActive(item.href);
                  const IconComp = item.icon;

                  // -----------------------------------------------------
                  // COLLAPSED STATE (w-20 RAIL WITH HOVER TOOLTIPS)
                  // -----------------------------------------------------
                  if (collapsed && !mobileOpen) {
                    if (item.isAction) {
                      return (
                        <div key={item.key} className="flex justify-center py-0.5">
                          <button
                            type="button"
                            onClick={logout}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative group text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                            title={item.label}
                          >
                            <IconComp className="w-4 h-4 shrink-0" />
                            {/* Floating Tooltip */}
                            <div
                              role="tooltip"
                              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-rose-300 px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-2"
                            >
                              <span>{item.label}</span>
                              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                            </div>
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div key={item.key} className="flex justify-center py-0.5">
                        <Link
                          href={item.href || "/candidate"}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative group ${
                            active
                              ? "bg-[#2087FE] text-white shadow-md shadow-blue-500/30"
                              : `${item.iconColor} hover:text-white hover:bg-slate-900/80`
                          }`}
                          title={item.label}
                        >
                          <IconComp className={`w-4 h-4 shrink-0 ${active ? "text-white" : item.iconColor}`} />

                          {item.pulseDot && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
                          )}

                          {item.badge && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950 flex items-center justify-center">
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
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-400 text-slate-950">
                                {item.badge}
                              </span>
                            )}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                          </div>
                        </Link>
                      </div>
                    );
                  }

                  // -----------------------------------------------------
                  // EXPANDED STATE (EXACT MATCH TO CLIENT REFERENCE)
                  // -----------------------------------------------------
                  if (item.isAction) {
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 cursor-pointer"
                      >
                        <IconComp className="w-4 h-4 shrink-0 text-rose-400" />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.key}
                      href={item.href || "/candidate"}
                      onClick={onCloseMobile}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-[#2087FE] text-white shadow-md shadow-blue-500/25"
                          : "text-slate-300 hover:text-white hover:bg-slate-900/80"
                      }`}
                    >
                      <IconComp
                        className={`w-4 h-4 shrink-0 ${
                          active ? "text-white" : item.iconColor
                        }`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>

                      {/* Live Field Map Cyan Pulse Dot */}
                      {item.pulseDot && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
                      )}

                      {/* Users Amber Indicator Dot + Chevron */}
                      {item.amberDot && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      )}
                      {item.hasChevron && (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}

                      {/* Office & Issues Circular Amber Badge */}
                      {item.badge && (
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
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

        {/* BOTTOM USER PROFILE CARD (EXACT CLIENT REFERENCE) */}
        <div className="p-3 border-t border-slate-900 bg-slate-950/90 shrink-0">
          {collapsed && !mobileOpen ? (
            <div className="flex justify-center">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer relative group"
                title={`${user?.name || "Adv. Vikram Patil"} - Candidate Admin`}
              >
                {candidateInitials}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-white p-3 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  <p className="font-bold text-slate-100">{user?.name || "Adv. Vikram Patil"}</p>
                  <p className="text-[11px] text-slate-400 font-normal">
                    {user?.constituencyName || "Pune Constituency"}
                  </p>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                {candidateInitials}
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || "Adv. Vikram Patil"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user?.constituencyName || "Pune Constituency"}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
