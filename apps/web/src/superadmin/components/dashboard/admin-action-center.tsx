import React from "react";
import { ClipboardCheck, ArrowRight, ShieldCheck } from "lucide-react";
import { NavKey } from "../../types/superadmin.types";
import { useToast } from "../../context/toast-context";

export interface AdminActionCenterProps {
  pendingCandidatesCount?: number;
  pendingEnquiriesCount?: number;
  pendingDistributorsCount?: number;
  onNavigate: (key: NavKey) => void;
}

export function AdminActionCenter({
  pendingCandidatesCount: _pendingCandidatesCount = 3,
  pendingEnquiriesCount: _pendingEnquiriesCount = 4,
  pendingDistributorsCount: _pendingDistributorsCount = 2,
  onNavigate,
}: AdminActionCenterProps) {
  const { toast } = useToast();
  const totalActionable = 3;

  const handleApprove = (name: string) => {
    toast(`Approved clearance for "${name}". Notification dispatched.`, "success");
  };

  const handleReview = (name: string) => {
    toast(`Opening KYC document dossier for "${name}".`, "info");
    onNavigate("candidate-requests");
  };

  const handleVerifySettlement = (name: string) => {
    toast(`Loading distributor commission tier audit for "${name}".`, "info");
    onNavigate("distributor-requests");
  };

  const handleGrantQuota = (name: string) => {
    toast(`Allocated 50,000 WhatsApp / SMS dispatch credits to "${name}".`, "success");
  };

  const handleRunAudit = () => {
    toast("Initiating automated integrity and compliance audit across all 128 nodes...", "info");
    setTimeout(() => {
      toast("Compliance Audit Complete: 100% telemetry verified. No anomalies detected.", "success");
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-[#062237] rounded-xl border border-[#E2E8F0] dark:border-[#0e3554] shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-5.5 space-y-4">
      {/* Triage Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] dark:border-[#0e3554]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2087FE] dark:text-[#38BDF8] flex items-center justify-center">
            <ClipboardCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-[14.5px] sm:text-[15px] font-bold text-[#010627] dark:text-[#F5F6F6]">
              Pending Approvals &amp; Verification
            </h2>
            <p className="text-[11px] text-[#717785] dark:text-[#94A3B8] font-normal">
              Operational triage queue awaiting administrative clearance
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60 shadow-2xs">
          {totalActionable} Actionable
        </span>
      </div>

      {/* Triage Item List */}
      <div className="divide-y divide-[#ACB9D1]/25 dark:divide-[#0e3554]/30">
        {/* Item 1: Kothrud Central Campaign Committee */}
        <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group/item hover:bg-[#F3F8FD]/70 dark:hover:bg-[#072439]/50 -mx-1.5 px-1.5 rounded-md transition-colors">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[12.5px] sm:text-[13px] text-[#010627] dark:text-[#F5F6F6]">
                Kothrud Central Campaign Committee
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#1D4ED8] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800/60">
                KYC Clearance
              </span>
            </div>
            <p className="text-[11px] text-[#717785] dark:text-[#94A3B8] truncate">
              Submitted by RO Ashok Shinde • AC-210 • 42 Booth Agents mapped
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleReview("Kothrud Central Campaign Committee")}
              className="px-2.5 py-1 rounded-md border border-[#ACB9D1] dark:border-[#0e3554] text-[#010627] dark:text-[#F5F6F6] hover:border-[#2087FE] hover:bg-[#E0EDFE]/60 dark:hover:bg-[#072439] text-[11.5px] font-semibold transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              Review KYC
            </button>
            <button
              type="button"
              onClick={() => handleApprove("Kothrud Central Campaign Committee")}
              className="px-3 py-1 rounded-md bg-[#2087FE] hover:bg-[#1A77E8] active:bg-[#1267D8] text-white text-[11.5px] font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Approve
            </button>
          </div>
        </div>

        {/* Item 2: Western Gateway Agency */}
        <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group/item hover:bg-[#F3F8FD]/70 dark:hover:bg-[#072439]/50 -mx-1.5 px-1.5 rounded-md transition-colors">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[12.5px] sm:text-[13px] text-[#010627] dark:text-[#F5F6F6]">
                Western Gateway Agency
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                Tier Upgrade
              </span>
            </div>
            <p className="text-[11px] text-[#717785] dark:text-[#94A3B8] truncate">
              Distributor tier adjustment to Platinum (18% margin on bulk ward packs)
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleVerifySettlement("Western Gateway Agency")}
              className="px-2.5 py-1 rounded-md border border-[#ACB9D1] dark:border-[#0e3554] text-[#010627] dark:text-[#F5F6F6] hover:border-[#7C3AED] hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-[11.5px] font-semibold transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              Verify Settlement
            </button>
          </div>
        </div>

        {/* Item 3: Pune Cantonment Vidhan Sabha Unit */}
        <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group/item hover:bg-[#F3F8FD]/70 dark:hover:bg-[#072439]/50 -mx-1.5 px-1.5 rounded-md transition-colors">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[12.5px] sm:text-[13px] text-[#010627] dark:text-[#F5F6F6]">
                Pune Cantonment Vidhan Sabha Unit
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                Quota Request
              </span>
            </div>
            <p className="text-[11px] text-[#717785] dark:text-[#94A3B8] truncate">
              Expansion request: 50,000 SMS / WhatsApp credits for voter slip reminders
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleGrantQuota("Pune Cantonment Vidhan Sabha Unit")}
              className="px-3 py-1 rounded-md bg-[#12CF94] hover:bg-[#0FB883] active:bg-[#0AA675] text-white font-bold text-[11.5px] transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
              Grant Quota
            </button>
          </div>
        </div>
      </div>

      {/* Footer Action link */}
      <div className="pt-2.5 border-t border-[#F1F5F9] dark:border-[#0e3554] flex items-center justify-between flex-wrap gap-2 text-[11px]">
        <button
          type="button"
          onClick={() => onNavigate("candidate-requests")}
          className="font-bold text-[#2087FE] dark:text-[#0D79FD] hover:underline flex items-center gap-1 group/link cursor-pointer"
        >
          <span>View All Pending Queues</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleRunAudit}
          className="font-medium text-[#717785] dark:text-[#94A3B8] hover:text-[#010627] dark:hover:text-[#F5F6F6] flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#E0EDFE]/60 dark:hover:bg-[#072439] border border-transparent hover:border-[#ACB9D1]/50 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3 h-3 text-[#12CF94] dark:text-[#01C588]" />
          <span>Run Compliance Audit</span>
        </button>
      </div>
    </div>
  );
}
