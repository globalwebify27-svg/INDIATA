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
      dotClass: "bg-[#12CF94] dark:bg-[#01C588] ring-4 ring-[#B3EDD7] dark:ring-[#01C588]/30",
      title: "New Candidate Onboarded:",
      details: "Adv. K. Joshi filed ward roster credentials for Kasba Peth (Ward 21).",
      meta: "4m ago • Operator: System Bot",
    },
    {
      id: "ev-2",
      dotClass: "bg-[#2087FE] dark:bg-[#0D79FD] ring-4 ring-[#E0EDFE] dark:ring-[#0D79FD]/30",
      title: "Subscription Renewed:",
      details: "South Mumbai Lok Sabha Committee renewed for Phase 2 operations.",
      meta: "28m ago • Invoice #RJ-9921",
    },
    {
      id: "ev-3",
      dotClass: "bg-[#FC7C36] dark:bg-[#F48637] ring-4 ring-[#FC7C36]/20 dark:ring-[#F48637]/30",
      title: "Security Token Rotated:",
      details: "Distributor Gateway #14 re-authenticated with 2FA token refresh.",
      meta: "1h ago • Node: West-IN-02",
    },
    {
      id: "ev-4",
      dotClass: "bg-[#12CF94] dark:bg-[#01C588] ring-4 ring-[#B3EDD7] dark:ring-[#01C588]/30",
      title: "Voter Roll Database Indexed:",
      details: "2,42,800 voters mapped across 284 booths in Pune Cantonment.",
      meta: "2h ago • Operator: Root Admin",
    },
  ];

  return (
    <div className="bg-[#FDFEFE] dark:bg-[#062237] rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] shadow-2xs p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#ACB9D1] dark:border-[#0e3554]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E0EDFE] dark:bg-[#072439] text-[#2087FE] dark:text-[#0D79FD] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6]">
              Recent Platform Activity
            </h2>
            <p className="text-xs text-[#717785] dark:text-[#94A3B8]">
              Real-time audit log of election management operations
            </p>
          </div>
        </div>

        <span className="text-xs text-[#717785] dark:text-[#94A3B8] font-medium bg-[#F3F8FD] dark:bg-[#072439] px-2.5 py-1 rounded-full border border-[#ACB9D1] dark:border-[#0e3554]">
          Real-time sync
        </span>
      </div>

      {/* Timeline Events List */}
      <div className="space-y-4 py-1">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-start gap-3">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${ev.dotClass}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#010627] dark:text-[#F5F6F6] leading-relaxed">
                <strong className="font-bold">{ev.title} </strong>
                <span>{ev.details}</span>
              </p>
              <span className="text-[11px] text-[#717785] dark:text-[#94A3B8] font-mono mt-0.5 block">
                {ev.meta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Quick Direct Rail */}
      <div className="pt-3 border-t border-[#ACB9D1] dark:border-[#0e3554] flex items-center justify-between flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => onNavigate("audit")}
          className="font-bold text-[#2087FE] dark:text-[#0D79FD] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View Full Audit Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddCandidate}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E0EDFE] dark:bg-[#072439] hover:bg-[#E0EDFE]/80 dark:hover:bg-[#062237] text-[#2087FE] dark:text-[#0D79FD] font-semibold border border-[#ACB9D1] dark:border-[#0e3554] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
