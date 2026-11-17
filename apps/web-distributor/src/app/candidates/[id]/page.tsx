"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Vote,
  MapPin,
  CreditCard,
  FileQuestion,
  CheckCircle2,
  ShieldCheck,
  Database,
  Calendar,
  Sparkles,
} from "lucide-react";
import { DistributorLayout } from "../../../components/layout/distributor-layout";
import { useDistributorAuth } from "../../../context/distributor-auth-context";
import { mockScopedCandidates, mockScopedEnquiries, ScopedCandidate, ScopedEnquiry } from "../../../data/mock-distributor-data";
import { Badge } from "@rajtantra/ui/feedback";

export default function CandidateControlPanelPage() {
  const params = useParams();
  const { distributor } = useDistributorAuth();

  const candidateId = (params?.id as string) || "cand-1";
  const candidate =
    mockScopedCandidates.find((c: ScopedCandidate) => c.id === candidateId) ||
    mockScopedCandidates[0]!;

  const candidateEnquiries = mockScopedEnquiries.filter(
    (e: ScopedEnquiry) => e.candidateName.includes(candidate?.name || "") || e.candidateId === candidate?.id
  );

  if (!candidate) {
    return (
      <DistributorLayout title="Candidate Not Found">
        <div className="p-8 text-center text-xs text-slate-500">
          The requested candidate could not be found or is not assigned to your franchise.
        </div>
      </DistributorLayout>
    );
  }

  const [activeTab, setActiveTab] = useState<
    "profile" | "users" | "geography" | "subscription" | "enquiries"
  >("profile");

  return (
    <DistributorLayout
      title={`Candidate Control Panel: ${candidate.name}`}
      subtitle={`ID: ${candidate.id} • ${candidate.constituency} (${candidate.electionType})`}
    >
      <div className="space-y-6">
        {/* Back navigation & Quick bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/candidates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidates Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                candidate.accountType === "DEMO"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              }`}
            >
              {candidate.accountType} ACCOUNT
            </span>
            <Badge
              variant={
                candidate.status === "ACTIVE"
                  ? "success"
                  : candidate.status === "PENDING_APPROVAL"
                  ? "warning"
                  : "neutral"
              }
              size="md"
            >
              {candidate.status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* Candidate Profile Summary Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#010627] to-[#2087FE] text-white text-xl font-black flex items-center justify-center shadow-premium-xs shrink-0">
              {candidate.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {candidate.name}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[#2087FE]">
                  {candidate.party}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                {candidate.marathiName} • {candidate.mobile}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-2">
                <span className="flex items-center gap-1">
                  <Vote className="w-3.5 h-3.5 text-[#2087FE]" />
                  <span>{candidate.electionType}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>{candidate.constituency}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {candidate.subscriptionTier}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/enquiries"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white shadow-premium-xs transition"
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Raise Service Enquiry</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          {[
            { id: "profile", label: "Candidate Profile", icon: Users },
            { id: "users", label: "Campaign Users", icon: Users },
            { id: "geography", label: "Election & Geography", icon: MapPin },
            { id: "subscription", label: "Subscription & Services", icon: CreditCard },
            {
              id: "enquiries",
              label: `Enquiries (${candidateEnquiries.length})`,
              icon: FileQuestion,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition -mb-px ${
                  isActive
                    ? "border-[#2087FE] text-[#2087FE]"
                    : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          {/* Tab 1: Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Candidate Profile & Public Channels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-600 dark:text-slate-300">Official English Name:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {candidate.name}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-600 dark:text-slate-300">Marathi / Devnagari Name:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {candidate.marathiName}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-600 dark:text-slate-300">Contact Mobile:</span>
                  <div className="font-bold font-mono text-slate-900 dark:text-white text-sm mt-0.5">
                    {candidate.mobile}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-600 dark:text-slate-300">Political Party:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {candidate.party}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-600 dark:text-slate-300">Candidate Role Type:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    Lead Principal Candidate
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-600 dark:text-slate-300">Public Slip URL:</span>
                  <div className="font-bold text-[#2087FE] text-xs mt-0.5 truncate">
                    https://rajtantra.in/slips/{candidate.id}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Users */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Campaign Staff & War Room Seats
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Users authorized to access this candidate's mobile and desktop portal
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#2087FE]">
                  4 of 10 Seats Used
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {[
                  { name: "Rahul Deshmukh", role: "Campaign Manager", mobile: "+91 98220 54321", status: "Active" },
                  { name: "Sunil Shinde", role: "Booth Coordinator", mobile: "+91 98220 65432", status: "Active" },
                  { name: "Pooja Kulkarni", role: "Social & WhatsApp Lead", mobile: "+91 98220 76543", status: "Active" },
                  { name: "Mahesh Jadhav", role: "Field Karyakarta", mobile: "+91 98220 87654", status: "Active" },
                ].map((user, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">{user.role} • {user.mobile}</div>
                    </div>
                    <Badge variant="success" size="sm">
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Geography & Data Segregation */}
          {activeTab === "geography" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Constituency & Territorial Boundaries
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Administrative geography assigned to this candidate profile
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Election Category:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {candidate.electionType}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Constituency:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {candidate.constituency}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Franchise Territory:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {distributor?.territory || "Pune Metro"}
                  </div>
                </div>
              </div>

              {/* Electoral Data Partition & Segregation Boundary */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#2087FE] text-white flex items-center justify-center font-bold shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Electoral Data Partition & Segregation Boundary
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Enforced structured isolation preventing cross-constituency data leakage
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {candidate.dataPartitioning?.isolationBoundaryStatus || "ENFORCED"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 text-[11px]">Constituency Partition Key</span>
                    <div className="font-mono font-bold text-[#2087FE] text-sm mt-0.5">
                      {candidate.dataPartitioning?.constituencyPartitionKey || "MH-AC214-KOTHRUD"}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 text-[11px]">Assigned Booth Range</span>
                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                      Booth #{candidate.dataPartitioning?.boothStart || 1} – #{candidate.dataPartitioning?.boothEnd || 284}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {candidate.dataPartitioning?.totalAssignedBooths || 284} Total Booths
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 text-[11px]">Partitioning Strategy</span>
                    <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                      {candidate.dataPartitioning?.partitionStrategy === "FULL_CONSTITUENCY"
                        ? "Full Constituency Roll"
                        : candidate.dataPartitioning?.partitionStrategy === "CLUSTERED_BY_WARD"
                        ? "Clustered by Ward"
                        : "Prabhaag Segmented"}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 text-[11px]">Electoral Roll Cap</span>
                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                      {(candidate.dataPartitioning?.electoralRollCap || 342150).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500">Max Voters Ingest</span>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Designated Campaign Segments & Access Wings:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(
                      candidate.dataPartitioning?.campaignCriteria || [
                        "Main Candidate War Room",
                        "Full Electoral Roll Locus",
                        "Verified Mobile Directory",
                      ]
                    ).map((crit, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 rounded-xl text-xs font-medium bg-blue-100/70 dark:bg-blue-900/40 text-[#2087FE] border border-blue-200 dark:border-blue-800 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>{crit}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Subscription */}
          {activeTab === "subscription" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Subscription Tier & Feature Entitlements
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Official commercial license parameters published on central price book
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {candidate.hasAi && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Mode Active
                    </span>
                  )}
                  <Badge variant="success" size="md">
                    {candidate.subscriptionTier}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white">Subscription Status & License</div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Account Type:</span>
                    <span className="font-bold text-emerald-600">{candidate.accountType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Validity Period:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#2087FE]" />
                      <span>
                        {candidate.subscriptionPlan.startsWith("ELECTION")
                          ? "Election End Date + 15 Days Grace Period"
                          : candidate.subscriptionPlan.startsWith("OFFICE_12M")
                          ? "12 Months Continuous Office License"
                          : candidate.subscriptionPlan.startsWith("OFFICE_6M")
                          ? "6 Months Continuous Office License"
                          : "Strict 5-Day Evaluation Window"}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Expires At:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {candidate.subscriptionExpiresAt}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Distributor ID:</span>
                    <span className="font-mono font-bold text-[#2087FE]">
                      {distributor?.distributorCode || "DIS-101"}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white">Enabled Modules & Entitlements</div>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Voter Roll PDF Generation & Family Chits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Excel Export & Custom Filters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Structured Electoral Data Segregation by Booth Range</span>
                    </div>
                    {candidate.hasAi && (
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>AI Family Grouping, Voice Caller DID & Predictive Sentiment</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Enquiries */}
          {activeTab === "enquiries" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Generated Enquiries for {candidate.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Orders and add-on service requests tracked with 3 independent statuses
                  </p>
                </div>
                <Link
                  href="/enquiries"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2087FE] text-white hover:bg-blue-600 transition"
                >
                  Create New Enquiry
                </Link>
              </div>

              {candidateEnquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-600 dark:text-slate-300">
                  No enquiries recorded for this candidate yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300">
                      <tr>
                        <th className="px-4 py-3">Enquiry No</th>
                        <th className="px-4 py-3">Package / Service</th>
                        <th className="px-4 py-3">Enquiry Status</th>
                        <th className="px-4 py-3">Payment Status</th>
                        <th className="px-4 py-3">Fulfilment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {candidateEnquiries.map((enq: ScopedEnquiry) => (
                        <tr key={enq.id}>
                          <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                            {enq.enquiryNumber}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                            {enq.requestedPackage}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              {enq.enquiryStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                              {enq.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                              {enq.fulfilmentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DistributorLayout>
  );
}
