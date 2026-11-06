"use client";

import React from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardKpiGrid } from "./dashboard-kpi-grid";
import { AdminActionCenter } from "./admin-action-center";
import { RecentActivityPanel } from "./recent-activity-panel";
import { QuotaDistributionPanel } from "./quota-distribution-panel";
import { OrganizationsDirectoryTable } from "./organizations-directory-table";
import {
  CandidateRecord,
  DistributorRecord,
  EnquiryRecord,
  AuditRecord,
  NavKey,
} from "../../types/superadmin.types";

export interface DashboardViewProps {
  candidates: CandidateRecord[];
  distributors: DistributorRecord[];
  enquiries: EnquiryRecord[];
  audits: AuditRecord[];
  pricingVisible: boolean;
  onTogglePricingVisibility: (visible: boolean) => void;
  onNavigate: (key: NavKey) => void;
  onOpenAddCandidate: () => void;
}

export function DashboardView({
  candidates,
  distributors,
  enquiries,
  audits,
  pricingVisible,
  onTogglePricingVisibility,
  onNavigate,
  onOpenAddCandidate,
}: DashboardViewProps) {
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === "Pending").length;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* 1. Platform Overview Header with Actions & Tactical Alert Banner */}
      <DashboardHeader
        onOpenAddCandidate={onOpenAddCandidate}
        onNavigateToOrganizations={() => onNavigate("organizations")}
        onNavigateToComponents={() => onNavigate("components")}
      />

      {/* 2. 4 Compact Summary Metric Cards */}
      <DashboardKpiGrid
        candidates={candidates}
        distributors={distributors}
        onNavigate={onNavigate}
      />

      {/* 3. Operational Work Area (Two-Column Layout: 7 cols vs 5 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Pending Approvals & Activity Timeline Feed */}
        <div className="lg:col-span-7 space-y-6">
          <AdminActionCenter
            pendingCandidatesCount={3}
            pendingEnquiriesCount={pendingEnquiriesCount || 4}
            pendingDistributorsCount={2}
            onNavigate={onNavigate}
          />

          <RecentActivityPanel
            audits={audits}
            pricingVisible={pricingVisible}
            onTogglePricingVisibility={() => onTogglePricingVisibility(!pricingVisible)}
            onNavigate={onNavigate}
            onOpenAddCandidate={onOpenAddCandidate}
          />
        </div>

        {/* Right Column (5 cols): Subscription & Quota Overview + Status Distribution */}
        <div className="lg:col-span-5 space-y-6">
          <QuotaDistributionPanel />
        </div>
      </section>

      {/* 4. Registered Organizations & Campaign War Rooms Directory Table */}
      <OrganizationsDirectoryTable />
    </div>
  );
}
