"use client";

import React, { useState } from "react";
import { Vote, Building, Landmark, TreePine } from "lucide-react";

interface TierItem {
  id: string;
  label: string;
  category: "state" | "central" | "local";
  count: number;
  pct: number;
  gradient: string;
  icon: React.ReactNode;
  iconBg: string;
}

export function ElectoralTierAnalytics() {
  const [activeFilter, setActiveFilter] = useState<"all" | "state" | "central" | "local">("all");

  const tiers: TierItem[] = [
    {
      id: "vidhan-sabha",
      label: "Vidhan Sabha (Legislative Assembly / विधानसभा)",
      category: "state",
      count: 64,
      pct: 45,
      gradient: "bg-[#1E3A8A] dark:bg-blue-600",
      icon: <Vote className="w-3.5 h-3.5" />,
      iconBg: "bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
    },
    {
      id: "lok-sabha",
      label: "Lok Sabha (Parliamentary / लोकसभा)",
      category: "central",
      count: 48,
      pct: 34,
      gradient: "bg-[#EA580C] dark:bg-orange-500",
      icon: <Landmark className="w-3.5 h-3.5" />,
      iconBg: "bg-orange-50 dark:bg-orange-950/80 text-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
    },
    {
      id: "municipal",
      label: "Municipal Corporations (PMC/BMC / महानगरपालिका)",
      category: "local",
      count: 22,
      pct: 15,
      gradient: "bg-[#15803D] dark:bg-emerald-600",
      icon: <Building className="w-3.5 h-3.5" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    },
    {
      id: "panchayat",
      label: "Zilla Parishad & Gram Panchayat (जिल्हा परिषद)",
      category: "local",
      count: 8,
      pct: 6,
      gradient: "bg-[#D97706] dark:bg-amber-500",
      icon: <TreePine className="w-3.5 h-3.5" />,
      iconBg: "bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    },
  ];

  const filteredTiers = activeFilter === "all" ? tiers : tiers.filter((t) => t.category === activeFilter);
  const totalFilteredSeats = filteredTiers.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft-card flex flex-col justify-between">
      <div>
        {/* Header with Title and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Electoral Tier Footprint
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {totalFilteredSeats} Seats
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Active candidate war room deployments segmented by jurisdiction
            </p>
          </div>

          {/* Interactive Tier Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "all"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("state")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "state"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Assembly
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("central")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "central"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Parliament
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("local")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "local"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Local
            </button>
          </div>
        </div>

        {/* Multi-Segmented Continuous Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex gap-0.5 p-0.5 mb-5 shadow-inner">
          <div
            className="h-full rounded-l-full bg-[#1E3A8A] dark:bg-blue-600 transition-all duration-300"
            style={{ width: "45%" }}
            title="Vidhan Sabha: 45%"
          />
          <div
            className="h-full bg-[#EA580C] dark:bg-orange-500 transition-all duration-300"
            style={{ width: "34%" }}
            title="Lok Sabha: 34%"
          />
          <div
            className="h-full bg-[#15803D] dark:bg-emerald-600 transition-all duration-300"
            style={{ width: "15%" }}
            title="Municipal Corporations: 15%"
          />
          <div
            className="h-full rounded-r-full bg-[#D97706] dark:bg-amber-500 transition-all duration-300"
            style={{ width: "6%" }}
            title="Panchayat: 6%"
          />
        </div>

        {/* Tier Items List */}
        <div className="space-y-3">
          {filteredTiers.map((tier) => (
            <div
              key={tier.id}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg ${tier.iconBg} flex items-center justify-center flex-shrink-0`}>
                    {tier.icon}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {tier.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {tier.count} seats
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    ({tier.pct}%)
                  </span>
                </div>
              </div>

              {/* Individual Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${tier.gradient} transition-all duration-300`}
                  style={{ width: `${tier.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Verified constitutional election bodies</span>
        <span className="font-semibold text-slate-600 dark:text-slate-400">142 Cumulative Jurisdictions</span>
      </div>
    </div>
  );
}
