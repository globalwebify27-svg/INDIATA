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
    <div className="space-y-4">
      {/* Platform Overview Header & Actions Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#ACB9D1] dark:border-[#0e3554]">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#010627] dark:text-[#F5F6F6] tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#717785] dark:text-[#94A3B8] mt-0.5">
            Manage organizations, subscriptions, and platform operations from one place.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Export Summary Button */}
          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FDFEFE] dark:bg-[#062237] border border-[#ACB9D1] dark:border-[#0e3554] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#717785] dark:text-[#94A3B8]" />
            <span>Export Summary</span>
          </button>

          {/* Add Organization / Candidate Button */}
          <button
            type="button"
            onClick={onOpenAddCandidate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2087FE] hover:bg-[#2087FE]/90 dark:bg-[#0D79FD] dark:hover:bg-[#0D79FD]/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer focus:ring-2 focus:ring-[#2087FE]/20"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Add Organization</span>
          </button>
        </div>
      </section>

      {/* Quick Alert Notice Banner (Tactical / Readiness) */}
      <div className="bg-[#FDFEFE] dark:bg-[#062237] border-l-4 border-[#2087FE] dark:border-l-[#0D79FD] rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#ACB9D1] dark:border-[#0e3554]">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD] mt-0.5 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#010627] dark:text-[#F5F6F6]">
              General Election Cadence Active: Maharashtra Phase IV Readiness
            </h4>
            <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-0.5 leading-relaxed">
              All telemetry nodes, WhatsApp notification quotas, and constituency war rooms are operating on high-availability dispatch protocols. Database replicas verified 12m ago.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onNavigateToOrganizations}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F3F8FD] dark:bg-[#072439] text-[#010627] dark:text-[#94A3B8] border border-[#ACB9D1] dark:border-[#0e3554] hover:bg-[#E0EDFE] dark:hover:bg-[#062237] transition-colors cursor-pointer"
          >
            View War Rooms
          </button>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E0EDFE] dark:bg-[#072439] text-[#2087FE] dark:text-[#0D79FD] border border-[#ACB9D1] dark:border-[#0e3554] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-[#2087FE] dark:text-[#0D79FD]" />
            Active Cadence
          </span>
        </div>
      </div>
    </div>
  );
}
