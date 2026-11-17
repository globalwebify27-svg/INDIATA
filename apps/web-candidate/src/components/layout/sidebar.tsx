"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Vote,
  Contact,
  Filter,
  Users,
  ChevronDown,
  ShieldCheck,
  Activity,
  Megaphone,
  CreditCard,
  BarChart3,
  History,
  Settings,
  LogOut,
  X,
  MessageSquare,
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
  dotColor?: "cyan" | "amber";
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
    groupTitle: "Core Operations",
    items: [
      {
        key: "dashboard",
        label: "War Room Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        key: "field-map",
        label: "Live Field Map",
        href: "/field-map",
        icon: MapPin,
        pulseDot: true,
      },
      {
        key: "feedback",
        label: "Live Feedback",
        href: "/feedback",
        icon: MessageSquare,
        pulseDot: true,
      },
      {
        key: "tickets",
        label: "Office & Issues",
        href: "/office/tickets",
        icon: Building2,
        badge: 2,
        badgeType: "warning",
      },
    ],
  },
  {
    groupTitle: "Voter Intelligence",
    items: [
      {
        key: "voters",
        label: "Total Voters",
        href: "/voters",
        icon: Vote,
      },
      {
        key: "phonebook",
        label: "Phone Book",
        href: "/voters/phonebook",
        icon: Contact,
      },
      {
        key: "filters",
        label: "Filters",
        href: "/voters/filters",
        icon: Filter,
      },
    ],
  },
  {
    groupTitle: "Workforce & Team",
    items: [
      {
        key: "blo",
        label: "BLO Information",
        href: "/blo",
        icon: ShieldCheck,
      },
      {
        key: "activities",
        label: "User Activities",
        href: "/users/activities",
        icon: Activity,
      },
    ],
  },
  {
    groupTitle: "Campaign & Plans",
    items: [
      {
        key: "campaigns",
        label: "Campaign Control",
        href: "/campaigns",
        icon: Megaphone,
      },
      {
        key: "subscriptions",
        label: "Subscription Plans",
        href: "/subscriptions",
        icon: CreditCard,
      },
    ],
  },
  {
    groupTitle: "Analytics & Strategy",
    items: [
      {
        key: "reports",
        label: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
      {
        key: "strategy",
        label: "Previous Election & Strategy",
        href: "/strategy",
        icon: History,
      },
    ],
  },
  {
    groupTitle: "Administration",
    items: [
      {
        key: "settings",
        label: "Profile & Party Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar({
  collapsed,
  onToggleCollapse: _onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [usersExpanded, setUsersExpanded] = useState<boolean>(true);

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
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isUsersActive =
    pathname.startsWith("/users") ||
    pathname.startsWith("/members") ||
    pathname.includes("/requests") ||
    pathname === "/voters/requests";

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
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin sidebar-scroller">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">
                  {group.groupTitle}
                </p>
              )}

              <nav className="space-y-1">
                {/* Workforce & Team: Users Accordion */}
                {group.groupTitle === "Workforce & Team" && (
                  <div className="relative group/users">
                    <button
                      type="button"
                      onClick={() => setUsersExpanded(!usersExpanded)}
                      className={`relative w-full flex items-center justify-between py-2.5 rounded-2xl text-xs font-semibold transition-all select-none overflow-hidden cursor-pointer ${
                        collapsed && !mobileOpen ? "justify-center px-0" : "px-3"
                      } ${
                        isUsersActive
                          ? "bg-[#132347] text-white font-bold border border-blue-500/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium"
                      }`}
                      title={collapsed && !mobileOpen ? "Users & Karyakarta" : undefined}
                    >
                      {isUsersActive && (!collapsed || mobileOpen) && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-400 rounded-r-full" />
                      )}
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 shrink-0 text-teal-400 ml-0.5" />
                        {(!collapsed || mobileOpen) && <span>Users</span>}
                      </div>
                      {(!collapsed || mobileOpen) && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
                              usersExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      )}
                    </button>

                    {/* Submenu links */}
                    {(!collapsed || mobileOpen) && usersExpanded && (
                      <div className="pl-6 pr-2 py-1.5 space-y-1.5 border-l border-slate-700/60 ml-5 my-1.5">
                        <Link
                          href="/users/dashboard"
                          onClick={onCloseMobile}
                          className={`w-full block py-1.5 px-3 rounded-xl text-xs transition-all ${
                            pathname === "/users/dashboard" || pathname === "/users"
                              ? "border-2 border-white text-white font-bold bg-slate-900/80 shadow-xs"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/40 font-medium"
                          }`}
                        >
                          User Dashboard
                        </Link>
                        <Link
                          href="/users/all"
                          onClick={onCloseMobile}
                          className={`w-full block py-1.5 px-3 rounded-xl text-xs transition-all ${
                            pathname === "/users/all"
                              ? "border-2 border-white text-white font-bold bg-slate-900/80 shadow-xs"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/40 font-medium"
                          }`}
                        >
                          All Users
                        </Link>
                        <Link
                          href="/users/add"
                          onClick={onCloseMobile}
                          className={`w-full block py-1.5 px-3 rounded-xl text-xs transition-all ${
                            pathname === "/users/add"
                              ? "border-2 border-white text-white font-bold bg-slate-900/80 shadow-xs"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/40 font-medium"
                          }`}
                        >
                          + Add User
                        </Link>
                        <Link
                          href="/members"
                          onClick={onCloseMobile}
                          className={`w-full block py-1.5 px-3 rounded-xl text-xs transition-all ${
                            pathname === "/members" || pathname === "/users/members"
                              ? "border-2 border-white text-white font-bold bg-slate-900/80 shadow-xs"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/40 font-medium"
                          }`}
                        >
                          Members / Karyakartas
                        </Link>
                        <Link
                          href="/voters/requests"
                          onClick={onCloseMobile}
                          className={`w-full flex items-center justify-between py-1.5 px-3 rounded-xl text-xs transition-all ${
                            pathname === "/voters/requests" || pathname === "/update-requests" || pathname === "/requests"
                              ? "border-2 border-white text-white font-bold bg-slate-900/80 shadow-xs"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/40 font-medium"
                          }`}
                        >
                          <span>Update Requests</span>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            3
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Group Standard Items */}
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
                              ? "bg-blue-900/50 text-white border border-blue-500 shadow-md shadow-blue-500/20"
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
                      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all overflow-hidden ${
                        active
                          ? "bg-[#132347] text-white border border-blue-500/30 font-bold"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-400 rounded-r-full" />
                      )}
                      <IconComp
                        className={`w-4 h-4 shrink-0 ml-0.5 ${
                          active
                            ? "text-blue-400"
                            : item.key === "dashboard"
                            ? "text-brand-400"
                            : item.key === "field-map" || item.key === "voters"
                            ? "text-cyan-400"
                            : item.key === "tickets"
                            ? "text-amber-400"
                            : item.key === "phonebook"
                            ? "text-purple-400"
                            : item.key === "filters"
                            ? "text-indigo-400"
                            : item.key === "blo"
                            ? "text-emerald-400"
                            : item.key === "activities"
                            ? "text-sky-400"
                            : item.key === "campaigns"
                            ? "text-rose-400"
                            : item.key === "subscriptions"
                            ? "text-amber-400"
                            : item.key === "reports"
                            ? "text-violet-400"
                            : item.key === "strategy"
                            ? "text-fuchsia-400"
                            : "text-slate-400"
                        }`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>

                      {item.pulseDot && (
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.dotColor === "amber"
                              ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                              : "bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                          }`}
                        />
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

                {/* Administration: Logout Action */}
                {group.groupTitle === "Administration" && (
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-3 transition-colors btn-tactile"
                  >
                    <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
                    {(!collapsed || mobileOpen) && <span>Logout</span>}
                  </button>
                )}
              </nav>
            </div>
          ))}
        </div>

        {/* BOTTOM USER PROFILE PILL (EXACT SPEC MATCH) */}
        <div className="p-3 border-t border-slate-900/80 bg-slate-950/80">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              VP
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || "Adv. Vikram Patil"}
                </p>
                <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{user?.constituencyName || "Pune Constituency"}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
