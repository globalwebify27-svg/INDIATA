"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileQuestion,
  BookOpen,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { DistributorStatus } from "@rajtantra/common-types";
import { useDistributorAuth } from "../context/distributor-auth-context";
import { Badge } from "@rajtantra/ui/feedback";

interface DistributorSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
}

export function DistributorSidebar({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
}: DistributorSidebarProps) {
  const pathname = usePathname();
  const { distributor, logout, setMockAccount } = useDistributorAuth();

  const navItems = [
    {
      group: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/distributor/dashboard",
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      group: "Franchise Candidates",
      items: [
        {
          label: "All Candidates",
          href: "/distributor/candidates",
          icon: Users,
          badge: "4 Active",
        },
        {
          label: "Add Candidate",
          href: "/distributor/candidates/new",
          icon: UserPlus,
          badge: "12-Step",
        },
        {
          label: "Generated Enquiries",
          href: "/distributor/enquiries",
          icon: FileQuestion,
          badge: "3 Open",
        },
      ],
    },
    {
      group: "Commercial & Franchise",
      items: [
        {
          label: "Pricing Manual",
          href: "/distributor/pricing-manual",
          icon: BookOpen,
          badge: "Read Only",
        },
        {
          label: "Profile & Settings",
          href: "/distributor/profile",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside
      className={`w-full bg-slate-950 text-slate-300 border-r border-slate-900 shadow-xl flex flex-col h-full select-none transition-all duration-200 ease-in-out`}
    >
      {/* Brand Header */}
      {collapsed ? (
        <div className="h-16 px-2 flex flex-col items-center justify-center border-b border-slate-900/80 bg-slate-950 relative">
          <Link
            href="/distributor/dashboard"
            onClick={onCloseMobile}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-sm tracking-wide hover:scale-105 transition-transform"
            title="INDIATA Distributor Console"
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
          <div className="flex items-center justify-between">
            <Link
              href="/distributor/dashboard"
              onClick={onCloseMobile}
              className="flex items-center gap-3 min-w-0 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-sm tracking-wide shrink-0">
                IN
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white leading-tight flex items-center gap-1.5">
                    INDIATA
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-[#2087FE] border border-blue-500/30">
                    DIST
                  </span>
                </div>
                <p className="text-[10px] font-bold bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider uppercase truncate">
                  Regional Partner Console
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="hidden md:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {onCloseMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Distributor Franchise Identification Pill */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
              <span className="truncate">{distributor?.name || "Maharashtra Western"}</span>
              <span className="text-[10px] font-mono font-bold text-[#2087FE]">
                {distributor?.distributorCode || "DIS-101"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{distributor?.territory || "Pune Metro"}</span>
              <Badge variant="success" size="sm">
                {distributor?.status || "ACTIVE"}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Franchise Code Badge */}
      {collapsed && (
        <div className="py-2 flex justify-center border-b border-slate-900/60">
          <div className="relative group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-[#2087FE] cursor-pointer">
              {distributor?.distributorCode?.slice(-3) || "101"}
            </div>
            {/* Tooltip */}
            <div
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 text-white p-3 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              <p className="font-bold text-slate-100">{distributor?.name || "Maharashtra Western"}</p>
              <p className="text-[11px] text-slate-400 font-normal">
                {distributor?.distributorCode || "DIS-101"} • {distributor?.territory || "Pune Metro"}
              </p>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-4 space-y-5 scrollbar-thin">
        {navItems.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.group}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/distributor/dashboard"
                    ? pathname === "/distributor/dashboard" || pathname === "/distributor"
                    : pathname.startsWith(item.href);
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#2087FE] text-white shadow-premium-xs"
                        : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-900 text-slate-400 border border-slate-800"
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
        ))}
      </div>

      {/* Role State Switcher & Sign Out */}
      {collapsed ? (
        <div className="p-2 border-t border-slate-900 bg-slate-950/80 flex flex-col items-center gap-2">
          <div className="relative group">
            <button
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
              Sign Out
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-2">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 mb-1.5">
              <Sparkles className="w-3 h-3 text-[#2087FE]" />
              <span>Test Status Simulator</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <button
                onClick={() => setMockAccount(DistributorStatus.ACTIVE)}
                className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium hover:bg-emerald-900/60 transition"
              >
                Active
              </button>
              <button
                onClick={() => setMockAccount(DistributorStatus.PENDING)}
                className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60 font-medium hover:bg-amber-900/60 transition"
              >
                Pending
              </button>
              <button
                onClick={() => setMockAccount(DistributorStatus.SUSPENDED)}
                className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 font-medium hover:bg-rose-900/60 transition"
              >
                Suspended
              </button>
              <button
                onClick={() => setMockAccount(DistributorStatus.REJECTED)}
                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium hover:bg-slate-700 transition"
              >
                Rejected
              </button>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
