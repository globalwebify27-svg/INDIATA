"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileQuestion,
  TrendingUp,
  UserPlus,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useDistributorAuth } from "../../../distributor/context/distributor-auth-context";
import { DistributorLayout } from "../../../distributor/components/distributor-layout";
import { mockScopedCandidates, mockScopedEnquiries } from "../../../distributor/data/mock-distributor-data";
import { Badge } from "@rajtantra/ui/feedback";

export default function DistributorDashboardPage() {
  const { distributor } = useDistributorAuth();

  // Metrics calculation strictly scoped to this distributor
  const candidates = mockScopedCandidates;
  const enquiries = mockScopedEnquiries;

  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter((c) => c.status === "ACTIVE").length;
  const demoCandidates = candidates.filter((c) => c.accountType === "DEMO" || c.accountType === "Demo").length;
  const expiredCandidates = candidates.filter((c) => c.status === "EXPIRED").length;
  const pendingCandidates = candidates.filter((c) => c.status === "PENDING_APPROVAL").length;

  const totalEnquiries = enquiries.length;
  const convertedEnquiries = enquiries.filter((e) => e.enquiryStatus === "Approved" || e.enquiryStatus === "Completed").length;
  const pendingEnquiries = enquiries.filter((e) => e.enquiryStatus === "Pending" || e.enquiryStatus === "Under Review").length;

  const kpis = [
    {
      title: "Total Assigned",
      value: totalCandidates,
      subtitle: "Candidates in territory",
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Campaigns",
      value: activeCandidates,
      subtitle: "Live in War Room",
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      title: "Demo Accounts",
      value: demoCandidates,
      subtitle: "Trial licenses",
      icon: Clock,
      color: "amber",
    },
    {
      title: "Pending Approvals",
      value: pendingCandidates,
      subtitle: "Awaiting Super Admin",
      icon: AlertCircle,
      color: "purple",
    },
    {
      title: "Expired Accounts",
      value: expiredCandidates,
      subtitle: "Requires renewal",
      icon: Clock,
      color: "rose",
    },
    {
      title: "Total Enquiries",
      value: totalEnquiries,
      subtitle: "Add-ons & services",
      icon: FileQuestion,
      color: "indigo",
    },
    {
      title: "Converted Enquiries",
      value: convertedEnquiries,
      subtitle: "Approved & fulfilled",
      icon: TrendingUp,
      color: "teal",
    },
    {
      title: "Pending Enquiries",
      value: pendingEnquiries,
      subtitle: "Awaiting processing",
      icon: AlertCircle,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80";
      case "amber":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/80";
      case "purple":
        return "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-800/80";
      case "rose":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/80";
      case "indigo":
        return "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80";
      case "teal":
        return "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/80";
      case "orange":
        return "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200/80 dark:border-orange-800/80";
      default:
        return "bg-blue-50 dark:bg-blue-950/40 text-[#2087FE] dark:text-blue-400 border-blue-200/80 dark:border-blue-800/80";
    }
  };

  return (
    <DistributorLayout
      title="Distributor Operations Center"
      subtitle={`Territory: ${distributor?.territory || "Pune Metro"} | Franchise ID: ${distributor?.distributorCode || "DIS-101"}`}
    >
      <div className="space-y-6">
        {/* Franchise Welcome & Action Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#010627] to-[#0A1950] p-6 text-white shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2087FE]/20 text-[#2087FE] border border-[#2087FE]/40">
                DISTRIBUTOR FRANCHISE ACTIVE
              </span>
              <span className="text-xs text-slate-400">
                Tenant ID: {distributor?.distributorCode || "DIS-101"}
              </span>
            </div>
            <h2 className="text-xl font-bold">
              Welcome, {distributor?.name || "Maharashtra Western Agency"}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              You are managing candidates and service enquiries exclusively inside your assigned territorial boundary ({distributor?.territory || "Pune Metro"}).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/distributor/candidates/new"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 dark:bg-[#1D61E0] dark:hover:bg-[#2563EB] text-white shadow-premium-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Candidate</span>
            </Link>
            <Link
              href="/distributor/pricing-manual"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Pricing Manual</span>
            </Link>
          </div>
        </div>

        {/* 8 Metric KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const colorClass = getColorClasses(kpi.color);

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-premium-xs hover:border-slate-300 dark:hover:border-[#3E4F68] transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-[#94A3B8]">
                    {kpi.title}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  {kpi.value}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#94A3B8] mt-0.5">
                  {kpi.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Candidates Table Preview */}
        <div className="bg-white dark:bg-[#151E2D] rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-premium-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-[#29364A] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-[#F8FAFC]">
                Assigned Franchise Candidates
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-0.5">
                Scoped strictly to distributor {distributor?.distributorCode || "DIS-101"} ({candidates.length} total)
              </p>
            </div>
            <Link
              href="/distributor/candidates"
              className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-[#2087FE] hover:underline"
            >
              <span>View All Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="candidate-table dark-theme-table w-full text-left text-xs text-slate-600 dark:text-[#94A3B8]">
              <thead className="bg-slate-50 dark:bg-[#111A28] text-slate-700 dark:text-[#94A3B8] font-bold border-b border-slate-200 dark:border-[#29364A]">
                <tr>
                  <th className="px-5 py-3.5">Candidate Name</th>
                  <th className="px-4 py-3.5">Party</th>
                  <th className="px-4 py-3.5">Election & Locus</th>
                  <th className="px-4 py-3.5">Account Type</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Subscription Tier</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-transparent">
                {candidates.map((cand) => (
                  <tr
                    key={cand.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-[#202D40] transition-colors border-b border-slate-100 dark:border-white/[0.18]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-[#F8FAFC]">
                        {cand.name}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-[#94A3B8]">
                        {cand.marathiName} • {cand.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 dark:text-[#F8FAFC]">
                        {cand.party}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800 dark:text-[#F8FAFC]">
                        {cand.electionType}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-[#94A3B8]">
                        {cand.constituency}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          cand.accountType === "DEMO" || cand.accountType === "Demo"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800"
                        }`}
                      >
                        {cand.accountType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          cand.status === "ACTIVE"
                            ? "success"
                            : cand.status === "PENDING_APPROVAL"
                            ? "warning"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {cand.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800 dark:text-[#F8FAFC]">
                        {cand.subscriptionTier}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-[#94A3B8]">
                        Expires: {cand.subscriptionExpiresAt}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/distributor/candidates/${cand.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-[#F8FAFC] bg-blue-50 dark:bg-[#1B2638] hover:bg-blue-100 dark:hover:bg-[#243247] border border-transparent dark:border-[#29364A] transition"
                      >
                        <span>Manage</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Generated Enquiries with 3-Status Badges */}
        <div className="bg-white dark:bg-[#151E2D] rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-premium-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-[#29364A] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-[#F8FAFC]">
                Recent Generated Enquiries
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-0.5">
                Tracking with independent Enquiry, Payment, and Fulfilment statuses
              </p>
            </div>
            <Link
              href="/distributor/enquiries"
              className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-[#2087FE] hover:underline"
            >
              <span>View All Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="candidate-table dark-theme-table w-full text-left text-xs text-slate-600 dark:text-[#94A3B8]">
              <thead className="bg-slate-50 dark:bg-[#111A28] text-slate-700 dark:text-[#94A3B8] font-bold border-b border-slate-200 dark:border-[#29364A]">
                <tr>
                  <th className="px-5 py-3.5">Enquiry ID & Date</th>
                  <th className="px-4 py-3.5">Candidate Name</th>
                  <th className="px-4 py-3.5">Requested Package</th>
                  <th className="px-4 py-3.5">Enquiry Status</th>
                  <th className="px-4 py-3.5">Payment Status</th>
                  <th className="px-4 py-3.5">Fulfilment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-transparent">
                {enquiries.slice(0, 4).map((enq) => (
                  <tr
                    key={enq.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-[#202D40] transition-colors border-b border-slate-100 dark:border-white/[0.18]"
                  >
                    <td className="px-5 py-3.5 font-mono">
                      <div className="font-bold text-slate-900 dark:text-[#F8FAFC]">
                        {enq.enquiryNumber}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-[#94A3B8]">
                        {enq.createdAt}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800 dark:text-[#F8FAFC]">
                        {enq.candidateName}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-[#94A3B8]">
                        {enq.constituency}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 dark:text-[#F8FAFC]">
                        {enq.requestedPackage}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.enquiryStatus === "Approved" || enq.enquiryStatus === "Completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800"
                            : enq.enquiryStatus === "Rejected"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800"
                        }`}
                      >
                        {enq.enquiryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.paymentStatus === "Payment Verified" || enq.paymentStatus === "Payment Received"
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 dark:border dark:border-teal-800"
                            : enq.paymentStatus === "Payment Failed"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800"
                            : "bg-slate-100 text-slate-800 dark:bg-[#1B2638] dark:text-[#94A3B8] dark:border dark:border-[#29364A]"
                        }`}
                      >
                        {enq.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.fulfilmentStatus === "Fulfilled"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:border dark:border-blue-800"
                            : enq.fulfilmentStatus === "In Progress"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border dark:border-indigo-800"
                            : "bg-slate-100 text-slate-800 dark:bg-[#1B2638] dark:text-[#94A3B8] dark:border dark:border-[#29364A]"
                        }`}
                      >
                        {enq.fulfilmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DistributorLayout>
  );
}
