"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { OrganizationRecord } from "../../types/superadmin.types";
import { OrganizationStatus } from "@rajtantra/common-types";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationRecord | null;
  onConfirm: (orgId: string, newStatus: OrganizationStatus, reason: string) => void;
}

export function StatusChangeDialog({
  isOpen,
  onClose,
  organization,
  onConfirm,
}: StatusChangeDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrganizationStatus>(
    organization?.status || OrganizationStatus.ACTIVE
  );
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when org changes
  React.useEffect(() => {
    if (organization) {
      setSelectedStatus(organization.status);
      setReason("");
    }
  }, [organization]);

  if (!organization) return null;

  const isSuspension = selectedStatus === OrganizationStatus.SUSPENDED;
  const isExpiration = selectedStatus === OrganizationStatus.EXPIRED;
  const isDestructive = isSuspension || isExpiration;
  const isUnchanged = selectedStatus === organization.status;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnchanged) {
      onClose();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(organization.id, selectedStatus, reason);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Change Organization Status"
      description={`Update administrative status and operational access for ${organization.name}.`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={isDestructive ? "danger" : "primary"}
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isUnchanged}
          >
            {isSuspension ? "Suspend Organization" : "Apply Status Change"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Organization Summary Box */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#072439] border border-slate-200 dark:border-[#0e3554] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800 dark:text-[#F5F6F6]">
              {organization.name}
            </span>
            <Badge
              variant={
                organization.status === OrganizationStatus.ACTIVE
                  ? "success"
                  : organization.status === OrganizationStatus.PENDING
                  ? "warning"
                  : organization.status === OrganizationStatus.SUSPENDED
                  ? "danger"
                  : "neutral"
              }
              withDot
            >
              {organization.status}
            </Badge>
          </div>
          <div className="text-slate-500 dark:text-[#94A3B8]">
            Slug: <span className="font-mono text-slate-700 dark:text-[#F5F6F6]">{organization.slug}</span> • Candidate: {organization.associatedCandidateName}
          </div>
          <div className="text-slate-500 dark:text-[#94A3B8]">
            Constituency: {organization.constituencyName} ({organization.electionType})
          </div>
        </div>

        {/* Status Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F6F6]">
            New Organization Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                status: OrganizationStatus.ACTIVE,
                label: "Active",
                desc: "Full operational access",
              },
              {
                status: OrganizationStatus.PENDING,
                label: "Pending",
                desc: "Awaiting activation",
              },
              {
                status: OrganizationStatus.SUSPENDED,
                label: "Suspended",
                desc: "Immediate lockout",
              },
              {
                status: OrganizationStatus.EXPIRED,
                label: "Expired",
                desc: "Subscription lapsed",
              },
            ].map((opt) => (
              <button
                key={opt.status}
                type="button"
                onClick={() => setSelectedStatus(opt.status)}
                className={`p-3 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                  selectedStatus === opt.status
                    ? opt.status === OrganizationStatus.ACTIVE
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-[#01C588]/15 dark:border-[#01C588]/40 text-emerald-900 dark:text-[#01C588]"
                      : opt.status === OrganizationStatus.SUSPENDED
                      ? "border-rose-500 bg-rose-50/50 dark:bg-[#F48637]/15 dark:border-[#F48637]/40 text-rose-900 dark:text-[#F48637]"
                      : opt.status === OrganizationStatus.PENDING
                      ? "border-amber-500 bg-amber-50/50 dark:bg-[#F48637]/15 dark:border-[#F48637]/40 text-amber-900 dark:text-[#F48637]"
                      : "border-slate-500 bg-slate-100 dark:bg-[#072439] dark:border-[#0e3554] text-slate-900 dark:text-[#F5F6F6]"
                    : "border-slate-200 dark:border-[#0e3554] hover:border-slate-300 dark:hover:border-[#0D79FD]/50 bg-white dark:bg-[#072439] text-slate-700 dark:text-[#94A3B8]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-semibold">{opt.label}</span>
                  {selectedStatus === opt.status && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-current" />
                  )}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#94A3B8]">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Operational Impact Warning */}
        {isSuspension && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-[#F48637]/10 border border-rose-200 dark:border-[#F48637]/30 flex items-start gap-2.5 text-rose-800 dark:text-[#F48637]">
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600 dark:text-[#F48637]" />
            <div className="text-xs space-y-1">
              <span className="font-semibold block">Security & Access Impact</span>
              <p className="text-[11px] leading-relaxed text-rose-700 dark:text-[#F48637]/90">
                Suspending this organization immediately terminates active JWT voter sessions, locks out all {organization.activeWorkersCount} field worker accounts, and blocks voter slip exports.
              </p>
            </div>
          </div>
        )}

        {isExpiration && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-[#F48637]/10 border border-amber-200 dark:border-[#F48637]/30 flex items-start gap-2.5 text-amber-800 dark:text-[#F48637]">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-[#F48637]" />
            <div className="text-xs space-y-1">
              <span className="font-semibold block">Subscription Lapsed Notice</span>
              <p className="text-[11px] leading-relaxed text-amber-700 dark:text-[#F48637]/90">
                Setting this tenant to Expired disables automated WhatsApp voter broadcast pipelines and switches field staff to read-only archival view.
              </p>
            </div>
          </div>
        )}

        {/* Reason / Audit Note */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F6F6]">
            Administrative Audit Reason <span className="font-normal text-slate-400 dark:text-[#94A3B8]">(Optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Requested by distributor, campaign cycle concluded, compliance check..."
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#0e3554] bg-white dark:bg-[#072439] text-slate-900 dark:text-[#F5F6F6] placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] focus:outline-hidden focus:ring-1 focus:ring-[#0D79FD] focus:border-[#0D79FD] transition-colors resize-none"
          />
        </div>
      </form>
    </Dialog>
  );
}
