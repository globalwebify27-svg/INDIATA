import React from "react";
import { Download, Plus, CheckCircle2, ShieldAlert } from "lucide-react";
import { useToast } from "../../context/toast-context";

export interface DashboardHeaderProps {
  onOpenAddCandidate: () => void;
  onNavigateToOrganizations: () => void;
  onNavigateToComponents: () => void;
}

export function DashboardHeader({
  onOpenAddCandidate,
  onNavigateToOrganizations,
  onNavigateToComponents: _onNavigateToComponents,
}: DashboardHeaderProps) {
  const { toast } = useToast();

  const handleExportSummary = () => {
    toast("Generating Platform Operations Executive Summary PDF/CSV...", "info");
  };

  return (
    <div className="space-y-3.5">
      {/* Platform Overview Header & Actions Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[#ACB9D1]/50 dark:border-[#0e3554]">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#010627] dark:text-[#F5F6F6] tracking-tight">
            Platform Overview
          </h1>
          <p className="text-[12px] text-[#717785] dark:text-[#94A3B8] mt-0.5 font-normal">
            Multi-tenant war room operations • High-availability cluster v4.2
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Export Summary Button */}
          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#062237] border border-[#ACB9D1] dark:border-[#0e3554] hover:border-[#2087FE]/50 hover:bg-[#E0EDFE]/60 dark:hover:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] text-[11.5px] font-semibold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#717785] dark:text-[#94A3B8]" />
            <span>Export Summary</span>
          </button>

          {/* Add Organization / Candidate Button */}
          <button
            type="button"
            onClick={onOpenAddCandidate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#2087FE] to-[#1267D8] hover:from-[#1A77E8] hover:to-[#0F58BD] text-white text-[11.5px] font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer focus:ring-2 focus:ring-[#2087FE]/30"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>+ Add Organization</span>
          </button>
        </div>
      </section>

      {/* Tactical Alert Notice Banner (Maharashtra Cadence) */}
      <div className="bg-gradient-to-r from-[#F0F7FF] via-[#F8FBFF] to-white dark:from-[#062237] dark:via-[#092B45] dark:to-[#0A314E] border border-[#2087FE]/20 dark:border-[#0D79FD]/30 border-l-4 border-l-[#2087FE] dark:border-l-[#0D79FD] rounded-xl p-3 sm:p-3.5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#2087FE] to-[#0D62D9] text-white shadow-xs mt-0.5 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[#010627] dark:text-[#F5F6F6]">
              General Election Cadence Active: Maharashtra Phase IV Readiness
            </h4>
            <p className="text-[11.5px] text-[#717785] dark:text-[#94A3B8] mt-0.5 leading-relaxed">
              High-availability dispatch active across all war rooms, notification quotas, and telemetry nodes. Replicas verified 12m ago.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onNavigateToOrganizations}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] border border-[#ACB9D1] dark:border-[#0e3554] hover:bg-[#2087FE] hover:text-white hover:border-[#2087FE] dark:hover:bg-[#0D79FD] transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            View War Rooms
          </button>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-1 shadow-2xs">
            <ShieldAlert className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Active Cadence</span>
          </span>
        </div>
      </div>
    </div>
  );
}
