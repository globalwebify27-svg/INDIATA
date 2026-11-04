"use client";

import React from "react";
import { Radio, CheckCircle2 } from "lucide-react";
import { useToast } from "../../context/toast-context";

export function QuotaDistributionPanel() {
  const { toast } = useToast();

  const handleTopup = () => {
    toast("Opening SMS & WhatsApp Gateway credit replenishment portal...", "info");
  };

  return (
    <div className="space-y-5">
      {/* 1. Subscription & Quota Overview Card */}
      <div className="bg-white dark:bg-[#062237] rounded-xl border border-[#E2E8F0] dark:border-[#0e3554] shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] dark:border-[#0e3554]">
          <div>
            <h2 className="text-[14.5px] sm:text-[15px] font-bold text-[#010627] dark:text-[#F5F6F6]">
              Subscription &amp; Quota Overview
            </h2>
            <p className="text-[11px] text-[#717785] dark:text-[#94A3B8]">
              Tier allocation &amp; gateway telemetry
            </p>
          </div>
          <span className="text-[10.5px] font-bold text-[#1D4ED8] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60 shadow-2xs">
            Active 104
          </span>
        </div>

        {/* Visual Segmented Bar of Distribution with Vibrant Gradients */}
        <div className="mt-3.5">
          <div className="h-2.5 w-full bg-[#F3F8FD] dark:bg-[#011A2D] rounded-full overflow-hidden flex gap-0.5 shadow-inner p-0.5">
            <div
              className="bg-[#2087FE] h-full rounded-l-full transition-all duration-300"
              style={{ width: "56%" }}
              title="Vidhan Sabha War Room: 56%"
            />
            <div
              className="bg-[#FC7C36] h-full transition-all duration-300"
              style={{ width: "31%" }}
              title="Lok Sabha War Room: 31%"
            />
            <div
              className="bg-[#12CF94] h-full rounded-r-full transition-all duration-300"
              style={{ width: "13%" }}
              title="Municipal & Civic: 13%"
            />
          </div>

          {/* Legend Items */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11.5px] p-1.5 rounded-md hover:bg-[#F3F8FD]/60 dark:hover:bg-[#072439]/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2087FE] flex-shrink-0" />
                <span className="text-[#010627] dark:text-[#F5F6F6] font-medium">
                  Vidhan Sabha War Room
                </span>
              </div>
              <span className="font-bold text-[#010627] dark:text-[#F5F6F6] tabular-nums">
                58 plans <span className="text-[#717785] dark:text-[#94A3B8] font-normal text-[10.5px]">(56%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[11.5px] p-1.5 rounded-md hover:bg-[#F3F8FD]/60 dark:hover:bg-[#072439]/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FC7C36] flex-shrink-0" />
                <span className="text-[#010627] dark:text-[#F5F6F6] font-medium">
                  Lok Sabha War Room
                </span>
              </div>
              <span className="font-bold text-[#010627] dark:text-[#F5F6F6] tabular-nums">
                32 plans <span className="text-[#717785] dark:text-[#94A3B8] font-normal text-[10.5px]">(31%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[11.5px] p-1.5 rounded-md hover:bg-[#F3F8FD]/60 dark:hover:bg-[#072439]/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#12CF94] flex-shrink-0" />
                <span className="text-[#010627] dark:text-[#F5F6F6] font-medium">
                  Municipal &amp; Civic Tier
                </span>
              </div>
              <span className="font-bold text-[#010627] dark:text-[#F5F6F6] tabular-nums">
                14 plans <span className="text-[#717785] dark:text-[#94A3B8] font-normal text-[10.5px]">(13%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Gateway Health Telemetry Box */}
        <div className="mt-3.5 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11.5px] font-bold text-[#010627] dark:text-[#F5F6F6]">
                SMS / WhatsApp Gateway
              </p>
              <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-bold">
                82% Operational Balance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTopup}
            className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-[#062237] text-[#010627] dark:text-[#F5F6F6] hover:bg-[#12CF94] hover:text-white dark:hover:bg-[#01C588] hover:border-[#12CF94] border border-[#ACB9D1] dark:border-[#0e3554] shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            Top-up
          </button>
        </div>
      </div>

      {/* 2. Organization Status Distribution Card */}
      <div className="bg-white dark:bg-[#062237] rounded-xl border border-[#E2E8F0] dark:border-[#0e3554] shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] dark:border-[#0e3554]">
          <h2 className="text-[14.5px] sm:text-[15px] font-bold text-[#010627] dark:text-[#F5F6F6]">
            Organization Status Distribution
          </h2>
          <span className="text-[10.5px] font-semibold text-[#717785] dark:text-[#94A3B8] bg-[#F3F8FD] dark:bg-[#072439] px-2 py-0.5 rounded-full border border-[#ACB9D1]/60 dark:border-[#0e3554]">
            128 Entities
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          {/* Status item 1: Active */}
          <div className="p-1.5 rounded-md hover:bg-[#F3F8FD]/60 dark:hover:bg-[#072439]/50 transition-colors space-y-1">
            <div className="flex items-center justify-between text-[11.5px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#12CF94]" />
                <span className="text-[#010627] dark:text-[#F5F6F6] font-medium">Active &amp; Deployed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 tabular-nums">
                  104
                </span>
                <span className="text-[10.5px] text-[#717785] dark:text-[#94A3B8] w-9 text-right font-mono font-medium">
                  81.2%
                </span>
              </div>
            </div>
            <div className="h-1 w-full bg-[#E1E6EE] dark:bg-[#0e3554] rounded-full overflow-hidden">
              <div className="h-full bg-[#12CF94] rounded-full" style={{ width: "81.2%" }} />
            </div>
          </div>

          {/* Status item 2: Trial */}
          <div className="p-1.5 rounded-md hover:bg-[#F3F8FD]/60 dark:hover:bg-[#072439]/50 transition-colors space-y-1">
            <div className="flex items-center justify-between text-[11.5px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FC7C36]" />
                <span className="text-[#010627] dark:text-[#F5F6F6] font-medium">Trial / Sandbox Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 tabular-nums">
                  17
                </span>
                <span className="text-[10.5px] text-[#717785] dark:text-[#94A3B8] w-9 text-right font-mono font-medium">
                  13.3%
                </span>
              </div>
            </div>
            <div className="h-1 w-full bg-[#E1E6EE] dark:bg-[#0e3554] rounded-full overflow-hidden">
              <div className="h-full bg-[#FC7C36] rounded-full" style={{ width: "13.3%" }} />
            </div>
          </div>

          {/* Status item 3: Suspended / In Review */}
          <div className="p-1.5 rounded-md hover:bg-[#F3F8FD]/60 dark:hover:bg-[#072439]/50 transition-colors space-y-1">
            <div className="flex items-center justify-between text-[11.5px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#717785]" />
                <span className="text-[#010627] dark:text-[#F5F6F6] font-medium">Suspended / In Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#F3F8FD] dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8] border border-[#ACB9D1] dark:border-[#0e3554] tabular-nums">
                  7
                </span>
                <span className="text-[10.5px] text-[#717785] dark:text-[#94A3B8] w-9 text-right font-mono font-medium">
                  5.5%
                </span>
              </div>
            </div>
            <div className="h-1 w-full bg-[#E1E6EE] dark:bg-[#0e3554] rounded-full overflow-hidden">
              <div className="h-full bg-[#717785] rounded-full" style={{ width: "5.5%" }} />
            </div>
          </div>
        </div>

        {/* Multi-tier Health Indicator */}
        <div className="mt-3 pt-2.5 border-t border-[#ACB9D1]/40 dark:border-[#0e3554] flex items-center justify-between">
          <span className="text-[11px] text-[#717785] dark:text-[#94A3B8] font-medium">
            Compliance Audit Readiness
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>100% Compliant</span>
          </span>
        </div>
      </div>
    </div>
  );
}
