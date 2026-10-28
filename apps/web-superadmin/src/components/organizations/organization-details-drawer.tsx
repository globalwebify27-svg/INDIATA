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
        <div className="w-screen max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-1 pr-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
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
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {organization.name}
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                slug: {organization.slug}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* 1. Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Commercial Plan
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                  {organization.planType.replace("_", " ")}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  AI Intelligence Mode
                </span>
                <div className="flex items-center gap-1.5">
                  <Sparkles
                    className={`w-3.5 h-3.5 ${
                      organization.hasAiMode ? "text-amber-500" : "text-slate-400"
                    }`}
                  />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {organization.hasAiMode ? `${organization.aiSeatsLimit} Seats Enabled` : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Candidate & Client Contact */}
            <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary-500" />
                Associated Candidate & Client Contact
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Candidate Name</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {organization.associatedCandidateName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Primary Contact</span>
                  <span className="text-slate-900 dark:text-slate-100 font-medium">
                    {organization.clientContactName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Contact Phone</span>
                  <a
                    href={`tel:${organization.clientPhone}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {organization.clientPhone}
                  </a>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Contact Email</span>
                  <a
                    href={`mailto:${organization.clientEmail}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {organization.clientEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Electoral Scope & Jurisdiction */}
            <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary-500" />
                Electoral Scope & Jurisdiction
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Election Type</span>
                  <Badge variant="purple">{organization.electionType}</Badge>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Constituency</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {organization.constituencyName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">State / District</span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {organization.state} • {organization.district}
                  </span>
                </div>
                {organization.pollingDate && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Polling Date</span>
                    <span className="text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {organization.pollingDate}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Worker Capacity & Quotas */}
            <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary-500" />
                Worker Seats & Quota Utilization
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Active Field Workers</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {organization.activeWorkersCount} / {organization.maxWorkersLimit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      workerUsagePercent > 90
                        ? "bg-rose-500"
                        : workerUsagePercent > 70
                        ? "bg-amber-500"
                        : "bg-primary-500"
                    }`}
                    style={{ width: `${workerUsagePercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {workerUsagePercent}% of allocated field worker seats currently in active service.
                </p>
              </div>
            </div>

            {/* 5. Distribution Partner Link */}
            <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary-500" />
                Channel Partner & Distributor
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Channel Source</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {organization.distributorName ? (
                      <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                        {organization.distributorName}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    ) : (
                      "Direct HQ Provisioning"
                    )}
                  </span>
                </div>
                {organization.distributorId && (
                  <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Distributor ID</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {organization.distributorId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Entity Metadata */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
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
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-2.5">
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
