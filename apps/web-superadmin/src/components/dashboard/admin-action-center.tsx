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
    <div className="bg-[#FDFEFE] dark:bg-[#201A15] rounded-xl border border-[#ACB9D1] dark:border-[#352B22] shadow-2xs p-5 space-y-4">
      {/* Triage Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#ACB9D1] dark:border-[#352B22]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E0EDFE] dark:bg-[#2B241E] text-[#2087FE] dark:text-[#FFB77D] flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#010627] dark:text-[#F7EFE9]">
              Pending Approvals &amp; Verification
            </h2>
            <p className="text-xs text-[#717785] dark:text-[#DBC2B0]">
              Operational queue requiring Super Admin clearance
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0EDFE] dark:bg-[#6E3900] text-[#2087FE] dark:text-[#FFDCC3]">
          {totalActionable} Actionable
        </span>
      </div>

      {/* Triage Item List */}
      <div className="divide-y divide-[#ACB9D1]/40 dark:divide-[#352B22]">
        {/* Item 1: Kothrud Central Campaign Committee */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-[#010627] dark:text-[#F7EFE9]">
                Kothrud Central Campaign Committee
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E0EDFE] dark:bg-[#6E3900] text-[#2087FE] dark:text-[#FFDCC3]">
                KYC Clearance
              </span>
            </div>
            <p className="text-xs text-[#717785] dark:text-[#DBC2B0]">
              Submitted by RO Ashok Shinde • Assembly Constituency AC-210 • 42 Booth Agents mapped
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleReview("Kothrud Central Campaign Committee")}
              className="px-3 py-1.5 rounded-lg border border-[#ACB9D1] dark:border-[#352B22] text-[#010627] dark:text-[#F7EFE9] hover:bg-[#E0EDFE] dark:hover:bg-[#2B241E] text-xs font-semibold transition-colors cursor-pointer"
            >
              Review KYC
            </button>
            <button
              type="button"
              onClick={() => handleApprove("Kothrud Central Campaign Committee")}
              className="px-3 py-1.5 rounded-lg bg-[#2087FE] hover:bg-[#2087FE]/90 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              Approve
            </button>
          </div>
        </div>

        {/* Item 2: Western Gateway Agency */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-[#010627] dark:text-[#F7EFE9]">
                Western Gateway Agency
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E0EDFE] dark:bg-[#3D0089] text-[#2087FE] dark:text-[#D2BBFF]">
                Tier Upgrade
              </span>
            </div>
            <p className="text-xs text-[#717785] dark:text-[#DBC2B0]">
              Distributor Commission tier adjustment to Platinum (18% margin on bulk ward packs)
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleVerifySettlement("Western Gateway Agency")}
              className="px-3 py-1.5 rounded-lg border border-[#ACB9D1] dark:border-[#352B22] text-[#010627] dark:text-[#F7EFE9] hover:bg-[#E0EDFE] dark:hover:bg-[#2B241E] text-xs font-semibold transition-colors cursor-pointer"
            >
              Verify Settlement
            </button>
          </div>
        </div>

        {/* Item 3: Pune Cantonment Vidhan Sabha Unit */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-[#010627] dark:text-[#F7EFE9]">
                Pune Cantonment Vidhan Sabha Unit
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B3EDD7] dark:bg-[#005323]/50 text-[#010627] dark:text-[#92F5A4]">
                Quota Request
              </span>
            </div>
            <p className="text-xs text-[#717785] dark:text-[#DBC2B0]">
              Expansion request: 50,000 SMS / WhatsApp credits for voter slip reminders
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleGrantQuota("Pune Cantonment Vidhan Sabha Unit")}
              className="px-3 py-1.5 rounded-lg bg-[#12CF94] hover:bg-[#12CF94]/90 text-[#010627] font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              Grant Quota
            </button>
          </div>
        </div>
      </div>

      {/* Footer Action link */}
      <div className="pt-3 border-t border-[#ACB9D1] dark:border-[#352B22] flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onNavigate("candidate-requests")}
          className="text-xs font-bold text-[#2087FE] dark:text-[#FFB77D] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All Pending Queues</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleRunAudit}
          className="text-xs font-semibold text-[#717785] dark:text-[#DBC2B0] hover:text-[#010627] flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#E0EDFE] dark:hover:bg-[#2B241E] transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#12CF94]" />
          <span>Run Compliance Audit</span>
        </button>
      </div>
    </div>
  );
}
