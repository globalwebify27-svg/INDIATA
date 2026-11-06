"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Key,
  Sparkles,
  Send,
  Mail,
  Lock,
  Unlock,
} from "lucide-react";
import { CandidateRecord } from "../../types/superadmin.types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CredentialDeliveryModal } from "./credential-delivery-modal";
import { useToast } from "../../context/toast-context";

export interface CandidateProfileViewProps {
  candidate: CandidateRecord;
  onBack: () => void;
  onUpdateCandidate: (updated: CandidateRecord) => void;
}

type TabKey =
  | "overview"
  | "account"
  | "party"
  | "election"
  | "subscription"
  | "branding"
  | "security";

export function CandidateProfileView({
  candidate,
  onBack,
  onUpdateCandidate,
}: CandidateProfileViewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);

  const isDemo = candidate.accountType === "Demo";
  const userUsagePercent = Math.min(
    Math.round((candidate.usersUsed / (candidate.usersAllowed || 1)) * 100),
    100
  );

  const handleToggleStatus = () => {
    const nextStatus = candidate.status === "Active" ? "Inactive" : "Active";
    onUpdateCandidate({ ...candidate, status: nextStatus });
    toast(`Candidate account is now marked as ${nextStatus}.`, "info");
  };

  const handleToggleAIAccess = () => {
    const nextAI = !candidate.aiAccess;
    onUpdateCandidate({
      ...candidate,
      aiAccess: nextAI,
      aiSeats: nextAI ? (candidate.aiSeats || 5) : 0,
    });
    toast(
      `AI Engine Access ${nextAI ? "enabled with seats" : "revoked"}.`,
      nextAI ? "success" : "info"
    );
  };

  const handleResetPassword = (channel: "whatsapp" | "email") => {
    toast(
      `Password reset instructions dispatched to ${
        channel === "whatsapp" ? candidate.phone : candidate.email
      } via ${channel.toUpperCase()}.`,
      "info"
    );
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "account", label: "Personal & Account" },
    { key: "party", label: "Party & Symbol" },
    { key: "election", label: "Election & Geography" },
    { key: "subscription", label: "Subscription & Quotas" },
    { key: "branding", label: "Branding & App" },
    { key: "security", label: "Credentials & Actions" },
  ];

  return (
    <div className="space-y-5">
      {/* Back button & Title bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Back to Candidate Directory
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCredentialModalOpen(true)}
            leftIcon={<Key className="w-3.5 h-3.5" />}
          >
            Dispatch Credentials
          </Button>
          <Button
            variant={candidate.status === "Active" ? "outline" : "primary"}
            size="sm"
            onClick={handleToggleStatus}
            leftIcon={candidate.status === "Active" ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          >
            {candidate.status === "Active" ? "Deactivate Account" : "Reactivate Account"}
          </Button>
        </div>
      </div>

      {/* Header Profile Banner */}
      <div className="p-5 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#2087FE] dark:bg-[#0D79FD] text-white font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            {candidate.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[#010627] dark:text-[#F5F6F6]">
                {candidate.name}
              </h1>
              <span className="text-sm font-medium text-[#717785] dark:text-[#94A3B8]">
                ({candidate.marathiName})
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded font-semibold bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6]">
                {candidate.id}
              </span>
              <Badge variant={candidate.status === "Active" ? "success" : "neutral"} withDot>
                {candidate.status}
              </Badge>
              <Badge variant={isDemo ? "warning" : "purple"}>
                {isDemo ? "14-Day Pilot Demo" : "Commercial Permanent"}
              </Badge>
            </div>
            <div className="text-xs text-[#717785] dark:text-[#94A3B8]">
              {candidate.party} • {candidate.electionType} • {candidate.geography} • Distributor:{" "}
              <strong className="text-[#010627] dark:text-[#F5F6F6]">
                {candidate.acquisitionDistributor}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* High-Density Summary Vitials Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs">
          <div className="text-[10px] uppercase font-semibold text-[#717785] dark:text-[#94A3B8]">Users Allocated</div>
          <div className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] mt-0.5">
            {candidate.usersUsed} / {candidate.usersAllowed}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs">
          <div className="text-[10px] uppercase font-semibold text-[#717785] dark:text-[#94A3B8]">Plan Tier</div>
          <div className="text-xs font-bold text-[#010627] dark:text-[#F5F6F6] mt-1 truncate">
            {candidate.planName}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs">
          <div className="text-[10px] uppercase font-semibold text-[#717785] dark:text-[#94A3B8]">AI Intelligence</div>
          <div className="text-xs font-bold mt-1 flex items-center gap-1 text-[#010627] dark:text-[#F5F6F6]">
            <Sparkles className={`w-3 h-3 ${candidate.aiAccess ? "text-[#FC7C36] dark:text-[#F48637]" : "text-[#717785] dark:text-[#94A3B8]"}`} />
            {candidate.aiAccess ? `${candidate.aiSeats || 5} Seats Active` : "Disabled"}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs">
          <div className="text-[10px] uppercase font-semibold text-[#717785] dark:text-[#94A3B8]">Campaign Status</div>
          <div className="text-xs font-bold mt-1 text-[#12CF94] dark:text-[#01C588]">
            {candidate.campaignStatus}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs">
          <div className="text-[10px] uppercase font-semibold text-[#717785] dark:text-[#94A3B8]">Historical Margins</div>
          <div className="text-xs font-bold mt-1 text-[#2087FE] dark:text-[#0D79FD]">
            Verified Access
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs">
          <div className="text-[10px] uppercase font-semibold text-[#717785] dark:text-[#94A3B8]">Pending Enquiries</div>
          <div className="text-xs font-bold mt-1 text-[#010627] dark:text-[#F5F6F6]">
            {candidate.pendingEnquiries} Open
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="border-b border-[#ACB9D1] dark:border-[#0e3554] flex items-center gap-2 overflow-x-auto text-xs font-medium pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "border-[#2087FE] dark:border-[#0D79FD] text-[#2087FE] dark:text-[#0D79FD] font-semibold"
                : "border-transparent text-[#717785] dark:text-[#94A3B8] hover:text-[#010627] dark:hover:text-[#F5F6F6]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs">
        {/* 1. OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-[#010627] dark:text-[#F5F6F6]">
              Account Overview & War Room Vitals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] space-y-2.5">
                <span className="font-semibold text-[#010627] dark:text-[#F5F6F6] uppercase tracking-wider text-[11px] block">
                  Candidate & Contact
                </span>
                <div className="flex justify-between py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Full Name (English)</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">{candidate.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Full Name (Marathi)</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">{candidate.marathiName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Registered Phone</span>
                  <span className="font-mono text-[#010627] dark:text-[#F5F6F6]">{candidate.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Email Address</span>
                  <span className="font-mono text-[#010627] dark:text-[#F5F6F6]">{candidate.email}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] space-y-2.5">
                <span className="font-semibold text-[#010627] dark:text-[#F5F6F6] uppercase tracking-wider text-[11px] block">
                  Electoral Scope & Channels
                </span>
                <div className="flex justify-between py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Election Tier</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">{candidate.electionType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Constituency Segment</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">{candidate.geography}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Party Affiliation</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">{candidate.party}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Attributed Partner</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">{candidate.acquisitionDistributor}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PERSONAL & ACCOUNT */}
        {activeTab === "account" && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-[#010627] dark:text-[#F5F6F6]">
              Personal & Account Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Administrative Username</span>
                <span className="font-mono font-medium text-[#010627] dark:text-[#F5F6F6] p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] block">
                  {candidate.username}
                </span>
              </div>
              <div>
                <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Account Classification</span>
                <span className="font-medium text-[#010627] dark:text-[#F5F6F6] p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] block">
                  {candidate.accountType === "Sale" ? "Commercial Permanent (Sale)" : "14-Day Pilot (Demo)"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Created At</span>
                <span className="p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] block">{candidate.createdAt}</span>
              </div>
              <div>
                <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Subscription Expiry</span>
                <span className="p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] block">{candidate.expiresAt}</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. PARTY & SYMBOL */}
        {activeTab === "party" && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-[#010627] dark:text-[#F5F6F6]">
              Party Affiliation & Voting Symbol
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Party Name (English)</span>
                <span className="font-medium p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] block">{candidate.party}</span>
              </div>
              <div>
                <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Party Name (Marathi)</span>
                <span className="font-medium p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] block">{candidate.partyMarathi}</span>
              </div>
            </div>
            <div>
              <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Official Voting Symbol</span>
              <span className="font-semibold text-[#2087FE] dark:text-[#0D79FD] p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] block">
                {candidate.symbol}
              </span>
            </div>
          </div>
        )}

        {/* 4. ELECTION & GEOGRAPHY */}
        {activeTab === "election" && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-[#010627] dark:text-[#F5F6F6]">
              Election Jurisdiction & Booth Allocation
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Election Category</span>
                <span className="font-medium p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] block">{candidate.electionType}</span>
              </div>
              <div>
                <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Election Year</span>
                <span className="font-medium p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] block">{candidate.electionYear}</span>
              </div>
            </div>
            <div>
              <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Jurisdiction / Constituency Segment</span>
              <span className="font-medium p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] block">{candidate.geography}</span>
            </div>
          </div>
        )}

        {/* 5. SUBSCRIPTION & QUOTAS */}
        {activeTab === "subscription" && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-[#010627] dark:text-[#F5F6F6]">
              Subscription Plan & Field Cadre Quota
            </h3>
            <div className="p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#717785] dark:text-[#94A3B8]">Active Field Workers</span>
                <span className="font-bold text-[#010627] dark:text-[#F5F6F6]">
                  {candidate.usersUsed} / {candidate.usersAllowed}
                </span>
              </div>
              <div className="w-full bg-[#ACB9D1]/30 dark:bg-[#011A2D] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    userUsagePercent > 90 ? "bg-[#FC7C36] dark:bg-[#F48637]" : "bg-[#2087FE] dark:bg-[#0D79FD]"
                  }`}
                  style={{ width: `${userUsagePercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#717785] dark:text-[#94A3B8]">
                {candidate.usersAllowed - candidate.usersUsed} field worker slots remaining.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                  INDIATA AI Intelligence Mode
                </div>
                <div className="text-[11px] text-[#717785] dark:text-[#94A3B8]">
                  {candidate.aiAccess ? `${candidate.aiSeats || 5} AI seats authorized` : "Disabled"}
                </div>
              </div>
              <Button
                variant={candidate.aiAccess ? "outline" : "primary"}
                size="sm"
                onClick={handleToggleAIAccess}
              >
                {candidate.aiAccess ? "Revoke AI Access" : "Grant AI Access"}
              </Button>
            </div>
          </div>
        )}

        {/* 6. BRANDING & APP */}
        {activeTab === "branding" && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-[#010627] dark:text-[#F5F6F6]">
              White-label Application & Citizen Endpoints
            </h3>
            <div>
              <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Branded App Title</span>
              <span className="font-medium p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] block">{candidate.appName}</span>
            </div>
            <div>
              <span className="text-[#717785] dark:text-[#94A3B8] block mb-1">Citizen Voter Slip Public URL</span>
              <span className="font-mono text-[#2087FE] dark:text-[#0D79FD] p-2 rounded bg-[#E0EDFE] dark:bg-[#072439] block">
                {candidate.slipUrl}
              </span>
            </div>
          </div>
        )}

        {/* 7. CREDENTIALS & ACTIONS */}
        {activeTab === "security" && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-[#010627] dark:text-[#F5F6F6]">
              Credential Management & Security Guards
            </h3>
            <div className="p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] space-y-3">
              <span className="font-semibold text-[#010627] dark:text-[#F5F6F6] block">
                Dispatched Administrative Recovery Links
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResetPassword("whatsapp")}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Reset via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResetPassword("email")}
                  leftIcon={<Mail className="w-3.5 h-3.5" />}
                >
                  Reset via Email
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#FC7C36]/30 dark:border-[#F48637]/40 bg-[#FC7C36]/5 dark:bg-[#062237] space-y-3">
              <span className="font-semibold text-[#FC7C36] dark:text-[#F48637] block">
                Danger Zone: Tenant Lockout & Safeguard
              </span>
              <p className="text-[11px] text-[#717785] dark:text-[#94A3B8] leading-relaxed">
                Deactivating locks out all candidate staff immediately. Permanent deletion requires root dual-authorization.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => toast("Dual-authorization requested: confirmation required from Platform Root.", "warning")}
              >
                Delete Candidate Partition
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Credential Delivery Modal */}
      <CredentialDeliveryModal
        isOpen={isCredentialModalOpen}
        onClose={() => setIsCredentialModalOpen(false)}
        candidate={candidate}
      />
    </div>
  );
}
