import React from "react";
import { Building2, BadgeCheck, Clock, Wallet } from "lucide-react";
import { DashboardKpiCard } from "./dashboard-kpi-card";
import {
  CandidateRecord,
  DistributorRecord,
  NavKey,
} from "../../types/superadmin.types";

export interface DashboardKpiGridProps {
  candidates: CandidateRecord[];
  distributors: DistributorRecord[];
  onNavigate: (key: NavKey) => void;
}

export function DashboardKpiGrid({
  candidates: _candidates,
  distributors: _distributors,
  onNavigate,
}: DashboardKpiGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Organizations */}
      <DashboardKpiCard
        title="Total Organizations"
        value={128}
        icon={<Building2 className="w-5 h-5" />}
        themeColor="saffron"
        badgeText="+12 this cycle"
        primarySubtext="Total registered election entities"
        onClick={() => onNavigate("organizations")}
      />

      {/* Card 2: Active Subscriptions */}
      <DashboardKpiCard
        title="Active Subscriptions"
        value={104}
        icon={<BadgeCheck className="w-5 h-5" />}
        themeColor="green"
        badgeText="92% retention"
        primarySubtext="Paid & active war room licenses"
        onClick={() => onNavigate("subscriptions")}
      />

      {/* Card 3: Pending Requests */}
      <DashboardKpiCard
        title="Pending Requests"
        value={7}
        icon={<Clock className="w-5 h-5" />}
        themeColor="amber"
        badgeText="High Priority"
        primarySubtext="Awaiting admin clearance & KYC"
        onClick={() => onNavigate("candidate-requests")}
      />

      {/* Card 4: Settlements to Review */}
      <DashboardKpiCard
        title="Settlements to Review"
        value="₹4.8L"
        icon={<Wallet className="w-5 h-5" />}
        themeColor="violet"
        badgeText="3 batches ready"
        primarySubtext="Distributor payouts to verify"
        onClick={() => onNavigate("subscriptions")}
      />
    </section>
  );
}
