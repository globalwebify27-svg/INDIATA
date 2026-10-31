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
    <div className="space-y-6">
      {/* 1. Subscription & Quota Overview Card */}
      <div className="bg-[#FDFEFE] dark:bg-[#201A15] rounded-xl border border-[#ACB9D1] dark:border-[#352B22] shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#ACB9D1] dark:border-[#352B22]">
          <h2 className="text-base font-bold text-[#010627] dark:text-[#F7EFE9]">
            Subscription &amp; Quota Overview
          </h2>
          <span className="text-xs font-semibold text-[#2087FE] dark:text-[#FFB77D] bg-[#E0EDFE] dark:bg-[#2B241E] px-2 py-0.5 rounded-full border border-[#ACB9D1] dark:border-[#6E3900]">
            Active 104
          </span>
        </div>

        {/* Visual Segmented Bar of Distribution */}
        <div className="mt-4">
          <div className="h-3 w-full bg-[#F3F8FD] dark:bg-[#2B241E] rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-[#2087FE] h-full transition-all"
              style={{ width: "56%" }}
              title="Vidhan Sabha War Room: 56%"
            />
            <div
              className="bg-[#FC7C36] h-full transition-all"
              style={{ width: "31%" }}
              title="Lok Sabha War Room: 31%"
            />
            <div
              className="bg-[#12CF94] h-full transition-all"
              style={{ width: "13%" }}
              title="Municipal & Civic: 13%"
            />
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2087FE] flex-shrink-0" />
                <span className="text-[#010627] dark:text-[#F7EFE9] font-medium">
                  Vidhan Sabha War Room
                </span>
              </div>
              <span className="font-bold text-[#010627] dark:text-[#F7EFE9] tabular-nums">
                58 plans <span className="text-[#717785] dark:text-[#DBC2B0] font-normal">(56%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FC7C36] flex-shrink-0" />
                <span className="text-[#010627] dark:text-[#F7EFE9] font-medium">
                  Lok Sabha War Room
                </span>
              </div>
              <span className="font-bold text-[#010627] dark:text-[#F7EFE9] tabular-nums">
                32 plans <span className="text-[#717785] dark:text-[#DBC2B0] font-normal">(31%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#12CF94] flex-shrink-0" />
                <span className="text-[#010627] dark:text-[#F7EFE9] font-medium">
                  Municipal &amp; Civic Tier
                </span>
              </div>
              <span className="font-bold text-[#010627] dark:text-[#F7EFE9] tabular-nums">
                14 plans <span className="text-[#717785] dark:text-[#DBC2B0] font-normal">(13%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Gateway Health Telemetry Box */}
        <div className="mt-5 p-3.5 rounded-lg bg-[#F3F8FD] dark:bg-[#251E18] border border-[#ACB9D1] dark:border-[#352B22] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B3EDD7] dark:bg-[#1C1611] text-[#12CF94] dark:text-[#92F5A4] shadow-xs">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#010627] dark:text-[#F7EFE9]">
                SMS / WhatsApp Gateway
              </p>
              <p className="text-[11px] text-[#12CF94] dark:text-[#92F5A4] font-semibold">
                82% Operational Balance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTopup}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-[#FDFEFE] dark:bg-[#1C1611] text-[#010627] dark:text-[#F7EFE9] hover:bg-[#E0EDFE] dark:hover:bg-[#2B241E] border border-[#ACB9D1] dark:border-[#352B22] shadow-2xs transition-colors cursor-pointer"
          >
            Top-up
          </button>
        </div>
      </div>

      {/* 2. Organization Status Distribution Card */}
      <div className="bg-[#FDFEFE] dark:bg-[#201A15] rounded-xl border border-[#ACB9D1] dark:border-[#352B22] shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#ACB9D1] dark:border-[#352B22]">
          <h2 className="text-base font-bold text-[#010627] dark:text-[#F7EFE9]">
            Organization Status Distribution
          </h2>
          <span className="text-xs text-[#717785] dark:text-[#DBC2B0]">
            128 Total Entities
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {/* Status item 1: Active */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#12CF94]" />
              <span className="text-[#010627] dark:text-[#F7EFE9]">Active &amp; Deployed</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#B3EDD7] dark:bg-[#005323]/50 text-[#010627] dark:text-[#92F5A4] tabular-nums">
                104
              </span>
              <span className="text-[11px] text-[#717785] dark:text-[#A8988C] w-10 text-right font-mono">
                81.2%
              </span>
            </div>
          </div>

          {/* Status item 2: Trial */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FC7C36]" />
              <span className="text-[#010627] dark:text-[#F7EFE9]">Trial / Sandbox Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FC7C36]/15 dark:bg-[#6E3900] text-[#FC7C36] dark:text-[#FFDCC3] tabular-nums">
                17
              </span>
              <span className="text-[11px] text-[#717785] dark:text-[#A8988C] w-10 text-right font-mono">
                13.3%
              </span>
            </div>
          </div>

          {/* Status item 3: Suspended / In Review */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#717785]" />
              <span className="text-[#010627] dark:text-[#F7EFE9]">Suspended / In Review</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F3F8FD] dark:bg-[#2B241E] text-[#717785] dark:text-[#DBC2B0] border border-[#ACB9D1] dark:border-[#352B22] tabular-nums">
                7
              </span>
              <span className="text-[11px] text-[#717785] dark:text-[#A8988C] w-10 text-right font-mono">
                5.5%
              </span>
            </div>
          </div>
        </div>

        {/* Multi-tier Health Indicator */}
        <div className="mt-5 pt-3.5 border-t border-[#ACB9D1] dark:border-[#352B22] flex items-center justify-between">
          <span className="text-xs text-[#717785] dark:text-[#DBC2B0]">
            Compliance Audit Readiness
          </span>
          <span className="text-xs text-[#12CF94] dark:text-[#92F5A4] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compliant</span>
          </span>
        </div>
      </div>
    </div>
  );
}
