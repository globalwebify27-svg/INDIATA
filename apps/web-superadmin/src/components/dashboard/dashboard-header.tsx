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
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAE5DC] dark:border-[#352B22]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1B17] dark:text-[#F7EFE9] tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#554336] dark:text-[#DBC2B0] mt-0.5">
            Manage organizations, subscriptions, and platform operations from one place.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Export Summary Button */}
          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-[#201A15] border border-[#EAE5DC] dark:border-[#352B22] hover:bg-[#FAF2EB] dark:hover:bg-[#2B241E] text-[#1E1B17] dark:text-[#F7EFE9] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#554336] dark:text-[#DBC2B0]" />
            <span>Export Summary</span>
          </button>

          {/* Add Organization / Candidate Button */}
          <button
            type="button"
            onClick={onOpenAddCandidate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8D4B00] hover:bg-[#733D00] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer focus:ring-2 focus:ring-[#8D4B00]/20"
          >
            <Plus className="w-4 h-4 text-[#FFDCC3]" />
            <span>+ Add Organization</span>
          </button>
        </div>
      </section>

      {/* Quick Alert Notice Banner (Tactical / Readiness) */}
      <div className="bg-white dark:bg-[#201A15] border-l-4 border-[#8D4B00] rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#EAE5DC] dark:border-[#352B22]">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-[#FFDCC3] dark:bg-[#6E3900] text-[#8D4B00] dark:text-[#FFB77D] mt-0.5 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1E1B17] dark:text-[#F7EFE9]">
              General Election Cadence Active: Maharashtra Phase IV Readiness
            </h4>
            <p className="text-xs text-[#554336] dark:text-[#DBC2B0] mt-0.5 leading-relaxed">
              All telemetry nodes, WhatsApp notification quotas, and constituency war rooms are operating on high-availability dispatch protocols. Database replicas verified 12m ago.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onNavigateToOrganizations}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF2EB] dark:bg-[#2B241E] text-[#554336] dark:text-[#DBC2B0] border border-[#EAE5DC] dark:border-[#352B22] hover:bg-[#F4EDE6] transition-colors cursor-pointer"
          >
            View War Rooms
          </button>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF2EB] dark:bg-[#2B241E] text-[#8D4B00] dark:text-[#FFB77D] border border-[#FFDCC3] dark:border-[#6E3900] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-[#8D4B00] dark:text-[#FFB77D]" />
            Active Cadence
          </span>
        </div>
      </div>
    </div>
  );
}
