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
      gradient: "bg-[#2087FE] dark:bg-[#0D79FD]",
      icon: <Vote className="w-3.5 h-3.5" />,
      iconBg: "bg-[#E0EDFE] text-[#2087FE] border border-[#ACB9D1] dark:bg-[#072439] dark:text-[#0D79FD] dark:border-[#0e3554]",
    },
    {
      id: "lok-sabha",
      label: "Lok Sabha (Parliamentary / लोकसभा)",
      category: "central",
      count: 48,
      pct: 34,
      gradient: "bg-[#FC7C36] dark:bg-[#F48637]",
      icon: <Landmark className="w-3.5 h-3.5" />,
      iconBg: "bg-[#FC7C36]/15 text-[#FC7C36] border border-[#FC7C36]/30 dark:bg-[#F48637]/15 dark:text-[#F48637] dark:border-[#F48637]/30",
    },
    {
      id: "municipal",
      label: "Municipal Corporations (PMC/BMC / महानगरपालिका)",
      category: "local",
      count: 22,
      pct: 15,
      gradient: "bg-[#12CF94] dark:bg-[#01C588]",
      icon: <Building className="w-3.5 h-3.5" />,
      iconBg: "bg-[#B3EDD7] text-[#12CF94] border border-[#12CF94]/40 dark:bg-[#01C588]/15 dark:text-[#01C588] dark:border-[#01C588]/30",
    },
    {
      id: "panchayat",
      label: "Zilla Parishad & Gram Panchayat (जिल्हा परिषद)",
      category: "local",
      count: 8,
      pct: 6,
      gradient: "bg-[#2087FE]/60 dark:bg-[#6C43FC]",
      icon: <TreePine className="w-3.5 h-3.5" />,
      iconBg: "bg-[#E0EDFE]/60 text-[#2087FE] border border-[#ACB9D1] dark:bg-[#6C43FC]/15 dark:text-[#6C43FC] dark:border-[#6C43FC]/30",
    },
  ];

  const filteredTiers = activeFilter === "all" ? tiers : tiers.filter((t) => t.category === activeFilter);
  const totalFilteredSeats = filteredTiers.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#FDFEFE] dark:bg-[#062237] border border-[#ACB9D1] dark:border-[#0e3554] shadow-soft-card flex flex-col justify-between">
      <div>
        {/* Header with Title and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#010627] dark:text-[#F5F6F6]">
                Electoral Tier Footprint
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0EDFE] dark:bg-[#072439] text-[#2087FE] dark:text-[#0D79FD] border border-[#ACB9D1] dark:border-[#0e3554]">
                {totalFilteredSeats} Seats
              </span>
            </div>
            <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-0.5">
              Active candidate war room deployments segmented by jurisdiction
            </p>
          </div>

          {/* Interactive Tier Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F3F8FD] dark:bg-[#072439] border border-[#ACB9D1]/50 dark:border-[#0e3554] self-start sm:self-auto text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "all"
                  ? "bg-[#2087FE] dark:bg-[#0D79FD] text-white font-bold shadow-xs"
                  : "text-[#717785] hover:text-[#010627] dark:text-[#94A3B8] dark:hover:text-[#F5F6F6]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("state")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "state"
                  ? "bg-[#2087FE] dark:bg-[#0D79FD] text-white font-bold shadow-xs"
                  : "text-[#717785] hover:text-[#010627] dark:text-[#94A3B8] dark:hover:text-[#F5F6F6]"
              }`}
            >
              Assembly
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("central")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "central"
                  ? "bg-[#2087FE] dark:bg-[#0D79FD] text-white font-bold shadow-xs"
                  : "text-[#717785] hover:text-[#010627] dark:text-[#94A3B8] dark:hover:text-[#F5F6F6]"
              }`}
            >
              Parliament
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("local")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "local"
                  ? "bg-[#2087FE] dark:bg-[#0D79FD] text-white font-bold shadow-xs"
                  : "text-[#717785] hover:text-[#010627] dark:text-[#94A3B8] dark:hover:text-[#F5F6F6]"
              }`}
            >
              Local
            </button>
          </div>
        </div>

        {/* Multi-Segmented Continuous Progress Bar */}
        <div className="w-full h-3 rounded-full bg-[#F3F8FD] dark:bg-[#011A2D] overflow-hidden flex gap-0.5 p-0.5 mb-5 shadow-inner">
          <div
            className="h-full rounded-l-full bg-[#2087FE] dark:bg-[#0D79FD] transition-all duration-300"
            style={{ width: "45%" }}
            title="Vidhan Sabha: 45%"
          />
          <div
            className="h-full bg-[#FC7C36] dark:bg-[#F48637] transition-all duration-300"
            style={{ width: "34%" }}
            title="Lok Sabha: 34%"
          />
          <div
            className="h-full bg-[#12CF94] dark:bg-[#01C588] transition-all duration-300"
            style={{ width: "15%" }}
            title="Municipal Corporations: 15%"
          />
          <div
            className="h-full rounded-r-full bg-[#2087FE]/60 dark:bg-[#6C43FC] transition-all duration-300"
            style={{ width: "6%" }}
            title="Panchayat: 6%"
          />
        </div>

        {/* Tier Items List */}
        <div className="space-y-3">
          {filteredTiers.map((tier) => (
            <div
              key={tier.id}
              className="p-2.5 rounded-xl border border-[#ACB9D1]/40 dark:border-[#0e3554] hover:bg-[#E0EDFE]/30 dark:hover:bg-[#072439]/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg ${tier.iconBg} flex items-center justify-center flex-shrink-0`}>
                    {tier.icon}
                  </div>
                  <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                    {tier.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#010627] dark:text-[#F5F6F6]">
                    {tier.count} seats
                  </span>
                  <span className="text-[11px] font-semibold text-[#717785] dark:text-[#94A3B8]">
                    ({tier.pct}%)
                  </span>
                </div>
              </div>

              {/* Individual Bar */}
              <div className="w-full h-1.5 rounded-full bg-[#F3F8FD] dark:bg-[#011A2D] overflow-hidden">
                <div
                  className={`h-full rounded-full ${tier.gradient} transition-all duration-300`}
                  style={{ width: `${tier.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#ACB9D1]/40 dark:border-[#0e3554] text-[11px] text-[#717785] dark:text-[#94A3B8] flex items-center justify-between">
        <span>Verified constitutional election bodies</span>
        <span className="font-semibold text-[#010627] dark:text-[#94A3B8]">142 Cumulative Jurisdictions</span>
      </div>
    </div>
  );
}
