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
} from "lucide-react";
import { DistributorStatus } from "@rajtantra/common-types";
import { useDistributorAuth } from "../../context/distributor-auth-context";
import { Badge } from "@rajtantra/ui/feedback";

export function DistributorSidebar() {
  const pathname = usePathname();
  const { distributor, logout, setMockAccount } = useDistributorAuth();

  const navItems = [
    {
      group: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
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
          href: "/candidates",
          icon: Users,
          badge: "4 Active",
        },
        {
          label: "Add Candidate",
          href: "/candidates/new",
          icon: UserPlus,
          badge: "12-Step",
        },
        {
          label: "Generated Enquiries",
          href: "/enquiries",
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
          href: "/pricing-manual",
          icon: BookOpen,
          badge: "Read Only",
        },
        {
          label: "Profile & Settings",
          href: "/profile",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#010627] to-[#2087FE] flex items-center justify-center text-white shadow-premium-sm font-bold text-base">
            R
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                RAJTANTRA
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-[#2087FE] dark:text-blue-300">
                DIST
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
              Regional Partner Console
            </p>
          </div>
        </div>

        {/* Distributor Franchise Identification Pill */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
            <span className="truncate">{distributor?.name || "Maharashtra Western"}</span>
            <span className="text-[10px] font-mono font-bold text-[#2087FE]">
              {distributor?.distributorCode || "DIS-101"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
            <span>{distributor?.territory || "Pune Metro"}</span>
            <Badge variant="success" size="sm">
              {distributor?.status || "ACTIVE"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {section.group}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#2087FE] text-white shadow-premium-xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-600 dark:text-slate-300"}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
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
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
        <div className="p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Test Status Simulator</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <button
              onClick={() => setMockAccount(DistributorStatus.ACTIVE)}
              className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-medium hover:opacity-80 transition"
            >
              Active
            </button>
            <button
              onClick={() => setMockAccount(DistributorStatus.PENDING)}
              className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 font-medium hover:opacity-80 transition"
            >
              Pending
            </button>
            <button
              onClick={() => setMockAccount(DistributorStatus.SUSPENDED)}
              className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 font-medium hover:opacity-80 transition"
            >
              Suspended
            </button>
            <button
              onClick={() => setMockAccount(DistributorStatus.REJECTED)}
              className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 font-medium hover:opacity-80 transition"
            >
              Rejected
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
