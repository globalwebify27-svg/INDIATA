import React from "react";
import { Clock, Plus, ArrowRight } from "lucide-react";
import { AuditRecord, NavKey } from "../../types/superadmin.types";

export interface RecentActivityPanelProps {
  audits: AuditRecord[];
  pricingVisible: boolean;
  onTogglePricingVisibility: () => void;
  onNavigate: (key: NavKey) => void;
  onOpenAddCandidate: () => void;
}

export function RecentActivityPanel({
  audits: _audits,
  pricingVisible: _pricingVisible,
  onTogglePricingVisibility: _onTogglePricingVisibility,
  onNavigate,
  onOpenAddCandidate,
}: RecentActivityPanelProps) {
  const events = [
    {
      id: "ev-1",
      dotClass: "bg-[#12CF94] ring-3 ring-emerald-100 dark:ring-emerald-950/60",
      title: "New Candidate Onboarded:",
      details: "Adv. K. Joshi filed ward roster credentials for Kasba Peth (Ward 21).",
      meta: "4m ago • Operator: System Bot",
    },
    {
      id: "ev-2",
      dotClass: "bg-[#2087FE] ring-3 ring-blue-100 dark:ring-blue-950/60",
      title: "Subscription Renewed:",
      details: "South Mumbai Lok Sabha Committee renewed for Phase 2 operations.",
      meta: "28m ago • Invoice #RJ-9921",
    },
    {
      id: "ev-3",
      dotClass: "bg-[#FC7C36] ring-3 ring-amber-100 dark:ring-amber-950/60",
      title: "Security Token Rotated:",
      details: "Distributor Gateway #14 re-authenticated with 2FA token refresh.",
      meta: "1h ago • Node: West-IN-02",
    },
    {
      id: "ev-4",
      dotClass: "bg-[#12CF94] ring-3 ring-emerald-100 dark:ring-emerald-950/60",
      title: "Voter Roll Database Indexed:",
      details: "2,42,800 voters mapped across 284 booths in Pune Cantonment.",
      meta: "2h ago • Operator: Root Admin",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#062237] rounded-xl border border-[#E2E8F0] dark:border-[#0e3554] shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-5.5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] dark:border-[#0e3554]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-[14.5px] sm:text-[15px] font-bold text-[#010627] dark:text-[#F5F6F6]">
              Recent Platform Activity
            </h2>
            <p className="text-[11px] text-[#717785] dark:text-[#94A3B8] font-normal">
              Real-time audit log of election management operations
            </p>
          </div>
        </div>

        <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-2xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Live Sync</span>
        </span>
      </div>

      {/* Timeline Events List */}
      <div className="space-y-2 py-0.5">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-start gap-2.5 p-1.5 -mx-1.5 rounded-md hover:bg-[#F3F8FD]/70 dark:hover:bg-[#072439]/50 transition-colors"
          >
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ev.dotClass}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-[11.5px] text-[#010627] dark:text-[#F5F6F6] leading-snug">
                <strong className="font-bold">{ev.title} </strong>
                <span>{ev.details}</span>
              </p>
              <span className="text-[10px] text-[#717785] dark:text-[#94A3B8] font-mono mt-0.5 block">
                {ev.meta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Quick Direct Rail */}
      <div className="pt-2.5 border-t border-[#F1F5F9] dark:border-[#0e3554] flex items-center justify-between flex-wrap gap-2 text-[11px]">
        <button
          type="button"
          onClick={() => onNavigate("audit")}
          className="font-bold text-[#2087FE] dark:text-[#0D79FD] hover:underline flex items-center gap-1 group/link cursor-pointer"
        >
          <span>View Full Audit Ledger</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddCandidate}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 hover:bg-[#2087FE] hover:text-white dark:hover:bg-[#0D79FD] text-[#1D4ED8] dark:text-[#38BDF8] font-semibold border border-blue-200 dark:border-blue-800/60 shadow-2xs transition-all active:scale-95 cursor-pointer text-[10.5px]"
          >
            <Plus className="w-3 h-3" />
            <span>Onboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
