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
      dotClass: "bg-[#006D30] ring-4 ring-[#DCFCE7] dark:ring-[#005323]/40",
      title: "New Candidate Onboarded:",
      details: "Adv. K. Joshi filed ward roster credentials for Kasba Peth (Ward 21).",
      meta: "4m ago • Operator: System Bot",
    },
    {
      id: "ev-2",
      dotClass: "bg-[#8D4B00] ring-4 ring-[#FFDCC3] dark:ring-[#6E3900]/40",
      title: "Subscription Renewed:",
      details: "South Mumbai Lok Sabha Committee renewed for Phase 2 operations.",
      meta: "28m ago • Invoice #RJ-9921",
    },
    {
      id: "ev-3",
      dotClass: "bg-[#712AE2] ring-4 ring-[#EADDFF] dark:ring-[#3D0089]/40",
      title: "Security Token Rotated:",
      details: "Distributor Gateway #14 re-authenticated with 2FA token refresh.",
      meta: "1h ago • Node: West-IN-02",
    },
    {
      id: "ev-4",
      dotClass: "bg-[#006D30] ring-4 ring-[#DCFCE7] dark:ring-[#005323]/40",
      title: "Voter Roll Database Indexed:",
      details: "2,42,800 voters mapped across 284 booths in Pune Cantonment.",
      meta: "2h ago • Operator: Root Admin",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#201A15] rounded-xl border border-[#EAE5DC] dark:border-[#352B22] shadow-2xs p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC] dark:border-[#352B22]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF2EB] dark:bg-[#2B241E] text-[#554336] dark:text-[#DBC2B0] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E1B17] dark:text-[#F7EFE9]">
              Recent Platform Activity
            </h2>
            <p className="text-xs text-[#554336] dark:text-[#DBC2B0]">
              Real-time audit log of election management operations
            </p>
          </div>
        </div>

        <span className="text-xs text-[#554336] dark:text-[#DBC2B0] font-medium bg-[#FAF2EB] dark:bg-[#2B241E] px-2.5 py-1 rounded-full border border-[#EAE5DC] dark:border-[#352B22]">
          Real-time sync
        </span>
      </div>

      {/* Timeline Events List */}
      <div className="space-y-4 py-1">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-start gap-3">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${ev.dotClass}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#1E1B17] dark:text-[#F7EFE9] leading-relaxed">
                <strong className="font-bold">{ev.title} </strong>
                <span>{ev.details}</span>
              </p>
              <span className="text-[11px] text-[#887364] dark:text-[#A8988C] font-mono mt-0.5 block">
                {ev.meta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Quick Direct Rail */}
      <div className="pt-3 border-t border-[#EAE5DC] dark:border-[#352B22] flex items-center justify-between flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => onNavigate("audit")}
          className="font-bold text-[#8D4B00] dark:text-[#FFB77D] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View Full Audit Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddCandidate}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF2EB] dark:bg-[#2B241E] hover:bg-[#F4EDE6] text-[#8D4B00] dark:text-[#FFB77D] font-semibold border border-[#FFDCC3] dark:border-[#6E3900] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
