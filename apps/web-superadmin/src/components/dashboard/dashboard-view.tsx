"use client";

import React from "react";
import {
  Users,
  Briefcase,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Plus,
  Eye,
  EyeOff,
  UserCheck,
  MessageSquare,
  Building,
  Building2,
} from "lucide-react";
import { PageHeader } from "../layout/page-header";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import {
  CandidateRecord,
  DistributorRecord,
  EnquiryRecord,
  AuditRecord,
  NavKey,
} from "../../types/superadmin.types";
import { useToast } from "../../context/toast-context";

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
  const { toast } = useToast();

  const activeCandidatesCount = candidates.filter((c) => c.status === "Active").length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === "Pending").length;

  const handlePricingToggle = () => {
    const next = !pricingVisible;
    onTogglePricingVisibility(next);
    toast(
      next
        ? "Global Pricing Switch ENABLED: Candidate portals now display standard rate cards."
        : "Global Pricing Switch DISABLED: Rate cards hidden; enquiry quotation mode enforced.",
      next ? "info" : "warning"
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Welcome Area */}
      <PageHeader
        title="Platform Command Dashboard"
        description="Welcome back, Root Administrator. Central telemetry for electoral jurisdictions, tenant war rooms, channel partners, and priority queues."
        breadcrumbs={[{ label: "Super Admin" }, { label: "Dashboard", active: true }]}
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="success" withDot>System Operational</Badge>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500">
              Mock Baseline
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("components")}
              leftIcon={<Layers className="w-3.5 h-3.5" />}
            >
              UI System
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddCandidate}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Candidate
            </Button>
          </div>
        }
      />

      {/* 2. Priority Pending Actions Section (Made more prominent than secondary metrics) */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800/80 bg-gradient-to-r from-amber-50/60 to-orange-50/40 dark:from-amber-950/30 dark:to-orange-950/20 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Administrative Attention Required
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                  9 Items Pending
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Actionable queues requiring root administrator verification before downstream provisioning.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold uppercase tracking-wider">
            High Priority Queue
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Action Item 1: Candidate Requests */}
          <div className="p-3.5 rounded-lg border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  Candidate Applications
                </span>
                <Badge variant="warning">3 Pending</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                Adv. K. Joshi (Pune Ward 21) & 2 others submitted registration leads awaiting territorial clearance.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onNavigate("candidate-requests")}
              rightIcon={<ArrowRight className="w-3 h-3" />}
              className="w-full justify-between"
            >
              Review Applications
            </Button>
          </div>

          {/* Action Item 2: Service Enquiries */}
          <div className="p-3.5 rounded-lg border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Service & Quota Requests
                </span>
                <Badge variant="warning">{pendingEnquiriesCount} Open</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                Rameshwar Patil requested urgent 1,00,000 WhatsApp recharge & AI seat expansion pending approval.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onNavigate("enquiries")}
              rightIcon={<ArrowRight className="w-3 h-3" />}
              className="w-full justify-between"
            >
              Fulfill Quotas
            </Button>
          </div>

          {/* Action Item 3: Distributor Partnership Requests */}
          <div className="p-3.5 rounded-lg border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Distributor Franchises
                </span>
                <Badge variant="purple">2 Pending</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                Maratha Media Tech & Western Gateway Solutions applied for regional partner franchises.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onNavigate("distributor-requests")}
              rightIcon={<ArrowRight className="w-3 h-3" />}
              className="w-full justify-between"
            >
              Verify Partners
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Primary KPI Cards Grid (Clearly labelled mock data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Organizations */}
        <div
          onClick={() => onNavigate("organizations")}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Organizations</span>
            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            6
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              3 Active War Rooms
            </span>
            <span className="text-slate-400 text-[10px]">1 Pending</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between">
            <span>54 Constituencies covered</span>
            <span>{distributors.length} Partners</span>
          </div>
        </div>

        {/* KPI 2: Candidates */}
        <div
          onClick={() => onNavigate("all-candidates")}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Candidate War Rooms</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {candidates.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {activeCandidatesCount} Live Deployments
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-medium text-[10px]">1 Concluded</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            3 Vidhan Sabha &bull; 1 Lok Sabha &bull; 1 PMC
          </div>
        </div>

        {/* KPI 3: Active Licenses */}
        <div
          onClick={() => onNavigate("subscriptions")}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Licenses</span>
            <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            112
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-sky-600 dark:text-sky-400 font-medium">
              9 Expiring in 7 Days
            </span>
            <span className="text-slate-400 text-[10px]">14 Upgrades</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            Commercial annual & trial seats
          </div>
        </div>

        {/* KPI 4: Pending Reviews */}
        <div
          onClick={() => onNavigate("candidate-requests")}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Review Pipeline</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            9
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Pending Clearances
            </span>
            <span className="text-emerald-600 font-semibold text-[10px]">Avg 2.4h</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            3 Leads &bull; 4 Enquiries &bull; 2 Resellers
          </div>
        </div>
      </div>

      {/* 4. Two Useful, Restrained Charts (Election Tier Breakdown & 6-Month Onboarding Velocity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Chart 1: Election Tier Breakdown */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Electoral Tier Footprint
              </h3>
              <p className="text-xs text-slate-500">
                Active deployments segmented across Indian constitutional bodies
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              142 Total Seats
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {[
              { label: "Vidhan Sabha (Assembly)", count: 64, pct: 45, color: "bg-sky-600" },
              { label: "Lok Sabha (Parliamentary)", count: 48, pct: 34, color: "bg-indigo-600" },
              { label: "Municipal Corporations (PMC/BMC)", count: 22, pct: 15, color: "bg-emerald-600" },
              { label: "Zilla Parishad & Gram Panchayat", count: 8, pct: 6, color: "bg-amber-500" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.count} seats ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: 6-Month Onboarding Velocity Trend */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Candidate Onboarding Velocity
              </h3>
              <p className="text-xs text-slate-500">
                Verified candidate tenant growth over the last 6 months
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <TrendingUp className="w-3 h-3" /> +38% Q1
            </span>
          </div>

          {/* Clean Solid Bar Chart */}
          <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {[
              { month: "Nov '25", count: 24, height: "25%" },
              { month: "Dec '25", count: 45, height: "42%" },
              { month: "Jan '26", count: 68, height: "58%" },
              { month: "Feb '26", count: 92, height: "74%" },
              { month: "Mar '26", count: 120, height: "88%" },
              { month: "Apr '26", count: 142, height: "100%" },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  {col.count}
                </span>
                <div
                  className="w-full rounded-t-sm bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 transition-colors"
                  style={{ height: col.height }}
                  title={`${col.month}: ${col.count} cumulative candidates`}
                />
                <span className="text-[10px] text-slate-400 mt-1">{col.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-right">
            <span className="text-[10px] text-slate-400">
              Cumulative production tenant onboardings
            </span>
          </div>
        </div>
      </div>

      {/* 5. Recent Platform Activity Table & Quick Actions Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Table (2 columns wide) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Recent Platform Activity & Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Immutable security and administrative actions logged under ISO/IEC 27001
              </p>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onNavigate("audit")}
              rightIcon={<ArrowRight className="w-3 h-3" />}
            >
              Full Log
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.slice(0, 4).map((aud) => (
                <TableRow key={aud.id}>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {aud.id}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {aud.action}
                    </span>
                    <div className="text-[11px] text-slate-400">{aud.module}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                    {aud.affectedEntity}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {aud.timestamp.split(" ")[1]}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={aud.result === "Success" ? "success" : "warning"} withDot>
                      {aud.result}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Quick Actions Panel (1 column wide) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Command Actions
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct routing to administrative workflows and global switches.
            </p>

            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenAddCandidate}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="w-full justify-start"
              >
                Provision New Candidate
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("candidate-requests")}
                leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                className="w-full justify-start"
              >
                Review Registration Leads (3)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("enquiries")}
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                className="w-full justify-start"
              >
                Candidate Top-up Enquiries (4)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("organizations")}
                leftIcon={<Building2 className="w-3.5 h-3.5" />}
                className="w-full justify-start"
              >
                Organizations & War Rooms (6)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("all-distributors")}
                leftIcon={<Briefcase className="w-3.5 h-3.5" />}
                className="w-full justify-start"
              >
                Distributor Partner Franchises
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePricingToggle}
                leftIcon={
                  pricingVisible ? (
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  )
                }
                className="w-full justify-start"
              >
                Pricing Visibility: {pricingVisible ? "Public Rates" : "Hidden Quotes"}
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Current Session: <strong className="text-slate-700 dark:text-slate-300">admin@rajtantra.gov.in</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
