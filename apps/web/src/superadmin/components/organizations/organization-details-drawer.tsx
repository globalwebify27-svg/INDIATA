"use client";

import React, { useEffect } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  Shield,
  Layers,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { OrganizationRecord } from "../../types/superadmin.types";
import { OrganizationStatus } from "@rajtantra/common-types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface OrganizationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationRecord | null;
  onEdit: (org: OrganizationRecord) => void;
  onChangeStatus: (org: OrganizationRecord) => void;
}

export function OrganizationDetailsDrawer({
  isOpen,
  onClose,
  organization,
  onEdit,
  onChangeStatus,
}: OrganizationDetailsDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !organization) return null;

  const workerUsagePercent = Math.min(
    Math.round((organization.activeWorkersCount / (organization.maxWorkersLimit || 1)) * 100),
    100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#FDFEFE] dark:bg-[#062237] border-l border-[#ACB9D1] dark:border-[#0e3554] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-[#ACB9D1] dark:border-[#0e3554] flex items-start justify-between bg-[#F3F8FD]/50 dark:bg-[#072439]">
            <div className="space-y-1 pr-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#717785] dark:text-[#94A3B8]">
                  {organization.id}
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
              <h2 className="text-base font-semibold text-[#010627] dark:text-[#F5F6F6] leading-snug">
                {organization.name}
              </h2>
              <p className="text-xs font-mono text-[#717785] dark:text-[#94A3B8]">
                slug: {organization.slug}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#717785] hover:text-[#010627] dark:hover:text-[#F5F6F6] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* 1. Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439]">
                <span className="text-[11px] text-[#717785] dark:text-[#94A3B8] block mb-1">
                  Commercial Plan
                </span>
                <span className="font-semibold text-[#010627] dark:text-[#F5F6F6] block">
                  {organization.planType.replace("_", " ")}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439]">
                <span className="text-[11px] text-[#717785] dark:text-[#94A3B8] block mb-1">
                  AI Intelligence Mode
                </span>
                <div className="flex items-center gap-1.5">
                  <Sparkles
                    className={`w-3.5 h-3.5 ${
                      organization.hasAiMode ? "text-[#FC7C36] dark:text-[#F48637]" : "text-[#717785] dark:text-[#94A3B8]"
                    }`}
                  />
                  <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                    {organization.hasAiMode ? `${organization.aiSeatsLimit} Seats Enabled` : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Candidate & Client Contact */}
            <div className="space-y-2.5 p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#717785] dark:text-[#94A3B8] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2087FE] dark:text-[#0D79FD]" />
                Associated Candidate & Client Contact
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Candidate Name</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">
                    {organization.associatedCandidateName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Primary Contact</span>
                  <span className="text-[#010627] dark:text-[#F5F6F6] font-medium">
                    {organization.clientContactName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Contact Phone</span>
                  <a
                    href={`tel:${organization.clientPhone}`}
                    className="text-[#2087FE] dark:text-[#0D79FD] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {organization.clientPhone}
                  </a>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Contact Email</span>
                  <a
                    href={`mailto:${organization.clientEmail}`}
                    className="text-[#2087FE] dark:text-[#0D79FD] hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {organization.clientEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Electoral Scope & Jurisdiction */}
            <div className="space-y-2.5 p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#717785] dark:text-[#94A3B8] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2087FE] dark:text-[#0D79FD]" />
                Electoral Scope & Jurisdiction
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Election Type</span>
                  <Badge variant="purple">{organization.electionType}</Badge>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Constituency</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">
                    {organization.constituencyName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">State / District</span>
                  <span className="text-[#010627] dark:text-[#F5F6F6]">
                    {organization.state} • {organization.district}
                  </span>
                </div>
                {organization.pollingDate && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#717785] dark:text-[#94A3B8]">Polling Date</span>
                    <span className="text-[#010627] dark:text-[#F5F6F6] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#717785] dark:text-[#94A3B8]" />
                      {organization.pollingDate}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Worker Capacity & Quotas */}
            <div className="space-y-2.5 p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#717785] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#2087FE] dark:text-[#0D79FD]" />
                Worker Seats & Quota Utilization
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Active Field Workers</span>
                  <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                    {organization.activeWorkersCount} / {organization.maxWorkersLimit}
                  </span>
                </div>
                <div className="w-full bg-[#E0EDFE] dark:bg-[#011A2D] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      workerUsagePercent > 90
                        ? "bg-[#FC7C36] dark:bg-[#F48637]"
                        : workerUsagePercent > 70
                        ? "bg-[#FC7C36] dark:bg-[#F48637]"
                        : "bg-[#2087FE] dark:bg-[#0D79FD]"
                    }`}
                    style={{ width: `${workerUsagePercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#717785] dark:text-[#94A3B8]">
                  {workerUsagePercent}% of allocated field worker seats currently in active service.
                </p>
              </div>
            </div>

            {/* 5. Distribution Partner Link */}
            <div className="space-y-2.5 p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#717785] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2087FE] dark:text-[#0D79FD]" />
                Channel Partner & Distributor
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Channel Source</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">
                    {organization.distributorName ? (
                      <span className="flex items-center gap-1 text-[#2087FE] dark:text-[#0D79FD]">
                        {organization.distributorName}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    ) : (
                      "Direct HQ Provisioning"
                    )}
                  </span>
                </div>
                {organization.distributorId && (
                  <div className="flex justify-between items-center py-1 border-t border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                    <span className="text-[#717785] dark:text-[#94A3B8]">Distributor ID</span>
                    <span className="font-mono text-[#010627] dark:text-[#F5F6F6]">
                      {organization.distributorId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Entity Metadata */}
            <div className="p-3 rounded-lg bg-[#F3F8FD] dark:bg-[#072439] border border-[#ACB9D1] dark:border-[#0e3554] text-[11px] text-[#717785] dark:text-[#94A3B8] space-y-1">
              <div className="flex justify-between">
                <span>Created On</span>
                <span>{organization.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span>{organization.updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] flex items-center justify-between gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChangeStatus(organization)}
              leftIcon={<Shield className="w-3.5 h-3.5" />}
            >
              Change Status
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(organization)}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Organization
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
