"use client";

import React from "react";
import {
  Smartphone,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import { CandidateRecord } from "../../types/superadmin.types";
import { Dialog } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface CandidateDetailModalProps {
  candidate: CandidateRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: CandidateRecord["status"]) => void;
}

export function CandidateDetailModal({
  candidate,
  isOpen,
  onClose,
  onStatusChange,
}: CandidateDetailModalProps) {
  if (!candidate) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${candidate.name} (${candidate.marathiName})`}
      description={`Tenant Entity Identifier: ${candidate.id} &bull; Created on ${candidate.createdAt}`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                candidate.status === "Active"
                  ? "success"
                  : candidate.status === "Pending"
                  ? "warning"
                  : "danger"
              }
              withDot
            >
              {candidate.status}
            </Badge>
            <span className="text-xs text-slate-500">
              Account Type: <strong>{candidate.accountType}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onStatusChange && (
              <Button
                variant={candidate.status === "Active" ? "danger" : "success"}
                size="xs"
                onClick={() => {
                  onStatusChange(
                    candidate.id,
                    candidate.status === "Active" ? "Inactive" : "Active"
                  );
                  onClose();
                }}
              >
                {candidate.status === "Active" ? "Deactivate Tenant" : "Activate Tenant"}
              </Button>
            )}
            <Button variant="outline" size="xs" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300">
        {/* Top Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Party Affiliation</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{candidate.party}</div>
            <div className="text-[11px] text-slate-500">{candidate.partyMarathi}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Electoral Scope</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{candidate.electionType}</div>
            <div className="text-[11px] text-slate-500">{candidate.geography}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Subscription Plan</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{candidate.planName}</div>
            <div className="text-[11px] text-slate-500">Expires {candidate.expiresAt}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">AI Entitlement</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {candidate.aiAccess ? `${candidate.aiSeats} Active Seats` : "Disabled"}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
              {candidate.aiAccess ? "Agentic Bot Enabled" : "Standard Engine"}
            </div>
          </div>
        </div>

        {/* Operational Quotas */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Field Quotas & System Utilization
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                <span>Field Worker Accounts</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {candidate.usersUsed} / {candidate.usersAllowed}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (candidate.usersUsed / candidate.usersAllowed) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                <span>Acquisition Partner</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {candidate.acquisitionSource}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {candidate.acquisitionDistributor}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                <span>Pending Top-up Enquiries</span>
                <Badge variant={candidate.pendingEnquiries > 0 ? "warning" : "neutral"}>
                  {candidate.pendingEnquiries} Open
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500">Service quotas & recharge</p>
            </div>
          </div>
        </div>

        {/* Branding & App Build flags */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            White-Label & Deployment Metadata
          </h4>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mobile Application Name:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{candidate.appName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Public Voter Slip Base URL:</span>
              <a
                href={candidate.slipUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                {candidate.slipUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Build Capabilities:</span>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${candidate.pdfAccess ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                  PDF Rolls
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${candidate.excelAccess ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                  Excel
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${candidate.apkAccess ? "bg-sky-50 text-sky-700 border border-sky-200" : "bg-slate-100 text-slate-500"}`}>
                  APK Pipeline
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
