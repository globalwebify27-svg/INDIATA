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
    <div className="bg-[#FDFEFE] dark:bg-[#062237] rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] shadow-2xs p-5 space-y-4">
      {/* Triage Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#ACB9D1] dark:border-[#0e3554]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E0EDFE] dark:bg-[#072439] text-[#2087FE] dark:text-[#0D79FD] flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6]">
              Pending Approvals &amp; Verification
            </h2>
            <p className="text-xs text-[#717785] dark:text-[#94A3B8]">
              Operational queue requiring Super Admin clearance
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD]">
          {totalActionable} Actionable
        </span>
      </div>

      {/* Triage Item List */}
      <div className="divide-y divide-[#ACB9D1]/40 dark:divide-[#0e3554]/50">
        {/* Item 1: Kothrud Central Campaign Committee */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-[#010627] dark:text-[#F5F6F6]">
                Kothrud Central Campaign Committee
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD]">
                KYC Clearance
              </span>
            </div>
            <p className="text-xs text-[#717785] dark:text-[#94A3B8]">
              Submitted by RO Ashok Shinde • Assembly Constituency AC-210 • 42 Booth Agents mapped
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleReview("Kothrud Central Campaign Committee")}
              className="px-3 py-1.5 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] text-[#010627] dark:text-[#F5F6F6] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] text-xs font-semibold transition-colors cursor-pointer"
            >
              Review KYC
            </button>
            <button
              type="button"
              onClick={() => handleApprove("Kothrud Central Campaign Committee")}
              className="px-3 py-1.5 rounded-lg bg-[#2087FE] hover:bg-[#2087FE]/90 dark:bg-[#0D79FD] dark:hover:bg-[#0D79FD]/90 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              Approve
            </button>
          </div>
        </div>

        {/* Item 2: Western Gateway Agency */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-[#010627] dark:text-[#F5F6F6]">
                Western Gateway Agency
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E0EDFE] dark:bg-[#6C43FC]/20 text-[#2087FE] dark:text-[#6C43FC]">
                Tier Upgrade
              </span>
            </div>
            <p className="text-xs text-[#717785] dark:text-[#94A3B8]">
              Distributor Commission tier adjustment to Platinum (18% margin on bulk ward packs)
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleVerifySettlement("Western Gateway Agency")}
              className="px-3 py-1.5 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] text-[#010627] dark:text-[#F5F6F6] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] text-xs font-semibold transition-colors cursor-pointer"
            >
              Verify Settlement
            </button>
          </div>
        </div>

        {/* Item 3: Pune Cantonment Vidhan Sabha Unit */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-[#010627] dark:text-[#F5F6F6]">
                Pune Cantonment Vidhan Sabha Unit
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B3EDD7] dark:bg-[#01C588]/15 text-[#010627] dark:text-[#01C588]">
                Quota Request
              </span>
            </div>
            <p className="text-xs text-[#717785] dark:text-[#94A3B8]">
              Expansion request: 50,000 SMS / WhatsApp credits for voter slip reminders
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleGrantQuota("Pune Cantonment Vidhan Sabha Unit")}
              className="px-3 py-1.5 rounded-lg bg-[#12CF94] hover:bg-[#12CF94]/90 dark:bg-[#01C588] dark:hover:bg-[#01C588]/90 text-[#010627] dark:text-[#011A2D] font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              Grant Quota
            </button>
          </div>
        </div>
      </div>

      {/* Footer Action link */}
      <div className="pt-3 border-t border-[#ACB9D1] dark:border-[#0e3554] flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onNavigate("candidate-requests")}
          className="text-xs font-bold text-[#2087FE] dark:text-[#0D79FD] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All Pending Queues</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleRunAudit}
          className="text-xs font-semibold text-[#717785] dark:text-[#94A3B8] hover:text-[#010627] dark:hover:text-[#F5F6F6] flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#12CF94] dark:text-[#01C588]" />
          <span>Run Compliance Audit</span>
        </button>
      </div>
    </div>
  );
}
