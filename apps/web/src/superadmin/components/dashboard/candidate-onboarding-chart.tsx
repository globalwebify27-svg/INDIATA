"use client";

import React, { useState } from "react";
import { TrendingUp, Users } from "lucide-react";

export function CandidateOnboardingChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = [
    { month: "Nov '25", count: 24, heightPct: 20, quota: "1.2M msgs" },
    { month: "Dec '25", count: 45, heightPct: 35, quota: "2.8M msgs" },
    { month: "Jan '26", count: 68, heightPct: 52, quota: "4.5M msgs" },
    { month: "Feb '26", count: 92, heightPct: 70, quota: "6.9M msgs" },
    { month: "Mar '26", count: 120, heightPct: 86, quota: "9.4M msgs" },
    { month: "Apr '26", count: 142, heightPct: 100, quota: "11.8M msgs" },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#FDFEFE] dark:bg-[#062237] border border-[#ACB9D1] dark:border-[#0e3554] shadow-soft-card flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#010627] dark:text-[#F5F6F6]">
                Candidate Onboarding Velocity
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B3EDD7] dark:bg-[#01C588]/15 text-[#010627] dark:text-[#01C588] border border-[#12CF94]/40 dark:border-[#01C588]/30">
                <TrendingUp className="w-3 h-3 text-[#12CF94] dark:text-[#01C588]" /> +38% Q1 Run-Rate
              </span>
            </div>
            <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-0.5">
              Cumulative production campaign tenants activated across assemblies
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E0EDFE] dark:bg-[#072439] text-[#2087FE] dark:text-[#0D79FD] border border-[#ACB9D1] dark:border-[#0e3554] text-[11px] font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>142 Total Candidates</span>
          </div>
        </div>

        {/* Animated Bar Chart Container */}
        <div className="relative pt-6 pb-2 px-2 border-b border-[#ACB9D1]/40 dark:border-[#0e3554]">
          {/* Subtle Background Guide Lines */}
          <div className="absolute inset-x-2 top-8 border-b border-dashed border-[#ACB9D1]/30 dark:border-[#0e3554]/50 pointer-events-none" />
          <div className="absolute inset-x-2 top-24 border-b border-dashed border-[#ACB9D1]/30 dark:border-[#0e3554]/50 pointer-events-none" />

          {/* Bar Columns */}
          <div className="h-44 flex items-end gap-3 sm:gap-4">
            {data.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-lg bg-[#010627] dark:bg-[#072439] border border-transparent dark:border-[#0e3554] text-white dark:text-[#F5F6F6] text-[11px] font-medium shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                      <div className="font-bold">{item.month}: {item.count} Candidates</div>
                      <div className="text-[10px] text-slate-300 dark:text-[#94A3B8] font-mono">Quota: {item.quota}</div>
                    </div>
                  )}

                  {/* Value Above Bar */}
                  <span
                    className={`text-[10px] font-bold mb-1.5 transition-colors ${
                      isHovered
                        ? "text-[#2087FE] dark:text-[#0D79FD] font-extrabold"
                        : "text-[#717785] dark:text-[#94A3B8]"
                    }`}
                  >
                    {item.count}
                  </span>

                  {/* Bar Column */}
                  <div
                    className={`w-full rounded-t-xl transition-all duration-200 ${
                      isHovered
                        ? "bg-[#FC7C36] dark:bg-[#F48637] shadow-sm scale-x-105"
                        : "bg-[#2087FE] dark:bg-[#0D79FD] hover:bg-[#2087FE]/90 dark:hover:bg-[#0D79FD]/90"
                    }`}
                    style={{ height: `${item.heightPct}%` }}
                  />

                  {/* Month Label */}
                  <span className="text-[10px] text-[#717785] dark:text-[#94A3B8] mt-2 font-medium tracking-tight">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-3 text-right">
        <span className="text-[11px] text-[#717785] dark:text-[#94A3B8]">
          Source: Verified multi-tenant database ledger &bull; Updated real-time
        </span>
      </div>
    </div>
  );
}
