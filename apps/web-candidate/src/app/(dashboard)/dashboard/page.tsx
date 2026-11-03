"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Upload,
  UserPlus,
  FileText,
  TrendingUp,
  Users,
  BadgeCheck,
  Vote,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  FolderArchive,
  ExternalLink,
  CheckCircle2,
  FileSpreadsheet,
  Shield,
  Clock,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

type DemographicTab = "gender-age" | "caste" | "booths";

interface AdminQueueItem {
  id: string;
  type: string;
  typeTag: string;
  constituent: string;
  identifier: string;
  station: string;
  date: string;
  priority: "high" | "medium" | "low";
  status: string;
  actionLabel: string;
  href: string;
}

const ADMIN_QUEUE: AdminQueueItem[] = [
  {
    id: "q-1",
    type: "Form 6: New Elector",
    typeTag: "Form 6",
    constituent: "Rajesh Verma",
    identifier: "EPIC Req #DL-98214",
    station: "Ward 12, Booth 104",
    date: "03 Nov 2026",
    priority: "medium",
    status: "Pending Verification",
    actionLabel: "Verify Record",
    href: "/voters/requests",
  },
  {
    id: "q-2",
    type: "Form 8: Locus Relocation",
    typeTag: "Form 8",
    constituent: "Priya Sharma",
    identifier: "EPIC #WXE482910",
    station: "Ward 9, Booth 88",
    date: "02 Nov 2026",
    priority: "medium",
    status: "Document Review",
    actionLabel: "Review Form",
    href: "/voters/requests",
  },
  {
    id: "q-3",
    type: "BLO Assignment Vacancy",
    typeTag: "BLO",
    constituent: "Govt Senior Sec School",
    identifier: "Station #112 Vacant",
    station: "Ward 14, Booth 112",
    date: "02 Nov 2026",
    priority: "high",
    status: "High Priority Vacancy",
    actionLabel: "Assign BLO",
    href: "/blo",
  },
  {
    id: "q-4",
    type: "Cadre Membership",
    typeTag: "Cadre",
    constituent: "Amit Deshmukh",
    identifier: "Volunteer ID #CAD-402",
    station: "Kasba Peth Sector 4",
    date: "01 Nov 2026",
    priority: "low",
    status: "Cadre Clearance",
    actionLabel: "Approve",
    href: "/members",
  },
];

export default function DashboardPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<DemographicTab>("gender-age");
  const [isStreamPaused, setIsStreamPaused] = useState(false);

  const handleActionToast = (title: string, desc: string) => {
    showToast("info", title, desc);
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-8">
      {/* SECTION A: Candidate Overview Page Heading */}
      <section className="bg-white dark:bg-[#162235] p-4 sm:p-5 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#253247] dark:text-[#F1F5F9] tracking-tight">
              Candidate Overview
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EDF2F8] dark:bg-[#1E2D44] text-[#526B91] dark:text-[#8B9BB4] border border-[#D5DFEE] dark:border-[#2A3E5C]">
              East Delhi AC-54
            </span>
          </div>
          <p className="text-[12px] text-[#68758A] dark:text-[#8B9BB4] mt-1 font-normal">
            Constituency: East Delhi (AC-54) • General Election 2024 • ECI Master Roll Synchronized
          </p>
        </div>

        {/* Authorized Operational Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Import Voter Roll */}
          <button
            type="button"
            onClick={() => handleActionToast("Voter Roll Importer", "Upload modal initialized for official ECI electoral rolls (.csv, .xlsx).")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#162235] border border-[#E1E6EE] dark:border-[#23344E] hover:border-[#3159A8] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] text-[#253247] dark:text-[#F1F5F9] text-[13px] font-medium transition-all shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#526B91]" />
            <span>Import Voter Roll</span>
          </button>

          {/* Register Elector */}
          <Link
            href="/voters"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#3159A8] hover:bg-[#264687] text-white text-[13px] font-medium transition-all shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
            <span>Register Elector</span>
          </Link>

          {/* Export Summary */}
          <button
            type="button"
            onClick={() => handleActionToast("Summary Report", "Exporting administrative summary to spreadsheet format (.xlsx)...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#162235] border border-[#E1E6EE] dark:border-[#23344E] hover:border-[#3159A8] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] text-[#253247] dark:text-[#F1F5F9] text-[13px] font-medium transition-all shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#526B91]" />
            <span>Export Summary</span>
          </button>
        </div>
      </section>

      {/* SECTION B: 4 Summary Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Voters */}
        <div className="bg-white dark:bg-[#162235] p-4 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-medium text-[#68758A] dark:text-[#8B9BB4]">
                Total Voters
              </span>
              <Users className="w-4 h-4 text-[#526B91] shrink-0" />
            </div>
            <div className="text-[26px] font-bold text-[#253247] dark:text-[#F1F5F9] tracking-tight tabular-nums">
              248,650
            </div>
          </div>
          <div className="pt-2.5 mt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-between text-[12px]">
            <span className="inline-flex items-center gap-1 text-[#24866A] font-semibold">
              <TrendingUp className="w-3 h-3" />
              +3.4% verified
            </span>
            <span className="text-[11px] font-medium text-[#526B91] dark:text-[#8B9BB4] bg-[#EDF2F8] dark:bg-[#1E2D44] px-1.5 py-0.2 rounded border border-[#D5DFEE] dark:border-[#2A3E5C]">
              94.2% EPIC
            </span>
          </div>
        </div>

        {/* Card 2: Total Members / Cadre */}
        <div className="bg-white dark:bg-[#162235] p-4 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-medium text-[#68758A] dark:text-[#8B9BB4]">
                Total Members
              </span>
              <BadgeCheck className="w-4 h-4 text-[#526B91] shrink-0" />
            </div>
            <div className="text-[26px] font-bold text-[#253247] dark:text-[#F1F5F9] tracking-tight tabular-nums">
              18,420
            </div>
          </div>
          <div className="pt-2.5 mt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-between text-[12px]">
            <span className="inline-flex items-center gap-1 text-[#24866A] font-semibold">
              <TrendingUp className="w-3 h-3" />
              +12.0% mobilization
            </span>
            <span className="text-[11px] font-medium text-[#C58A32] bg-[#FDF7ED] dark:bg-[#3D2B0C] px-1.5 py-0.2 rounded border border-[#F5E2C4] dark:border-[#523A10]">
              920 pending
            </span>
          </div>
        </div>

        {/* Card 3: Total Polling Booths */}
        <div className="bg-white dark:bg-[#162235] p-4 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-medium text-[#68758A] dark:text-[#8B9BB4]">
                Total Booths
              </span>
              <Vote className="w-4 h-4 text-[#526B91] shrink-0" />
            </div>
            <div className="text-[26px] font-bold text-[#253247] dark:text-[#F1F5F9] tracking-tight tabular-nums">
              264
            </div>
          </div>
          <div className="pt-2.5 mt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-between text-[12px]">
            <span className="text-[#68758A] dark:text-[#8B9BB4] font-medium">
              248 mapped
            </span>
            <span className="text-[11px] font-medium text-[#C84D55] bg-[#FDF2F3] dark:bg-[#3D1417] px-1.5 py-0.2 rounded border border-[#F5CED1] dark:border-[#541C20]">
              16 open
            </span>
          </div>
        </div>

        {/* Card 4: BLO Officers */}
        <div className="bg-white dark:bg-[#162235] p-4 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-medium text-[#68758A] dark:text-[#8B9BB4]">
                BLO Officers
              </span>
              <Shield className="w-4 h-4 text-[#526B91] shrink-0" />
            </div>
            <div className="text-[26px] font-bold text-[#253247] dark:text-[#F1F5F9] tracking-tight tabular-nums">
              258 Verified
            </div>
          </div>
          <div className="pt-2.5 mt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-between text-[12px]">
            <span className="inline-flex items-center gap-1 text-[#C84D55] font-semibold text-[11px]">
              <AlertTriangle className="w-3 h-3" />
              6 Vacant
            </span>
            <Link
              href="/blo"
              className="text-[#3159A8] dark:text-[#4C74C9] font-medium hover:underline flex items-center gap-0.5 text-[12px]"
            >
              Assign <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION C: Administrative Operations Queue */}
      <section className="bg-white dark:bg-[#162235] rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E1E6EE] dark:border-[#23344E] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-[#253247] dark:text-[#F1F5F9]">
                Administrative Operations Queue
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FDF7ED] text-[#C58A32] border border-[#F5E2C4]">
                4 Actions Required
              </span>
            </div>
            <p className="text-[12px] text-[#68758A] dark:text-[#8B9BB4] mt-0.5">
              Pending verifications, Form 6/7/8 elector requests, and cadre approvals
            </p>
          </div>

          <Link
            href="/voters/requests"
            className="text-[13px] text-[#3159A8] dark:text-[#4C74C9] font-medium hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            View All Requests <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Structured Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F4F6F9] dark:bg-[#1E2D44] border-b border-[#E1E6EE] dark:border-[#23344E] text-[#68758A] dark:text-[#8B9BB4] text-[12px] font-semibold">
                <th className="py-2.5 px-4">Request / Form</th>
                <th className="py-2.5 px-4">Constituent / Subject</th>
                <th className="py-2.5 px-4">Station / Ward</th>
                <th className="py-2.5 px-4">Submitted</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E6EE] dark:divide-[#23344E] text-[#253247] dark:text-[#F1F5F9]">
              {ADMIN_QUEUE.map((item) => (
                <tr key={item.id} className="hover:bg-[#F4F6F9]/60 dark:hover:bg-[#1E2D44]/50 transition-colors">
                  <td className="py-3 px-4 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-[#EDF2F8] dark:bg-[#1E2D44] text-[#526B91] border border-[#D5DFEE]">
                        {item.typeTag}
                      </span>
                      <span>{item.type}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#253247] dark:text-[#F1F5F9]">{item.constituent}</div>
                    <div className="text-[11px] text-[#68758A] dark:text-[#8B9BB4]">{item.identifier}</div>
                  </td>
                  <td className="py-3 px-4 text-[#68758A] dark:text-[#8B9BB4]">
                    {item.station}
                  </td>
                  <td className="py-3 px-4 text-[#68758A] dark:text-[#8B9BB4]">
                    {item.date}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                        item.priority === "high"
                          ? "bg-[#FDF2F3] text-[#C84D55] border-[#F5CED1]"
                          : item.priority === "medium"
                          ? "bg-[#FDF7ED] text-[#C58A32] border-[#F5E2C4]"
                          : "bg-[#EBF7F3] text-[#24866A] border-[#C3E8DC]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={item.href}
                      className="inline-flex items-center px-2.5 py-1 rounded border border-[#E1E6EE] dark:border-[#23344E] hover:border-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] text-[#3159A8] dark:text-[#4C74C9] font-medium text-[12px] transition-colors"
                    >
                      {item.actionLabel}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION D: Demographic Intelligence & Cadre Readiness (2:1 Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT BLOCK: Demographics & Caste Matrices (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#162235] p-5 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E6EE] dark:border-[#23344E]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold text-[#253247] dark:text-[#F1F5F9]">
                    Demographics &amp; Electoral Matrices
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF2F8] dark:bg-[#1E2D44] text-[#526B91]">
                    AC-54
                  </span>
                </div>
                <p className="text-[12px] text-[#68758A] dark:text-[#8B9BB4] mt-0.5">
                  Aggregate electoral breakdown • 248k registered constituents
                </p>
              </div>

              {/* Segmented Control Tabs */}
              <div className="flex items-center bg-[#F4F6F9] dark:bg-[#1E2D44] p-0.5 rounded-md border border-[#E1E6EE] dark:border-[#23344E]">
                <button
                  type="button"
                  onClick={() => setActiveTab("gender-age")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                    activeTab === "gender-age"
                      ? "bg-white dark:bg-[#162235] text-[#3159A8] dark:text-[#4C74C9] font-semibold shadow-2xs"
                      : "text-[#68758A] dark:text-[#8B9BB4] hover:text-[#253247]"
                  }`}
                >
                  Gender &amp; Age
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("caste")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                    activeTab === "caste"
                      ? "bg-white dark:bg-[#162235] text-[#3159A8] dark:text-[#4C74C9] font-semibold shadow-2xs"
                      : "text-[#68758A] dark:text-[#8B9BB4] hover:text-[#253247]"
                  }`}
                >
                  Category Split
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("booths")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                    activeTab === "booths"
                      ? "bg-white dark:bg-[#162235] text-[#3159A8] dark:text-[#4C74C9] font-semibold shadow-2xs"
                      : "text-[#68758A] dark:text-[#8B9BB4] hover:text-[#253247]"
                  }`}
                >
                  Top Polling Wards
                </button>
              </div>
            </div>

            {/* TAB CONTENT: Gender & Age */}
            {activeTab === "gender-age" && (
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gender Split Card */}
                  <div className="p-3.5 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] bg-[#F4F6F9]/40 dark:bg-[#1E2D44]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-semibold text-[#68758A] dark:text-[#8B9BB4]">
                        Gender Ratio
                      </span>
                      <span className="text-[11px] font-medium text-[#24866A]">
                        100% Synced
                      </span>
                    </div>

                    {/* Progress representation */}
                    <div className="h-2 w-full bg-[#E1E6EE] dark:bg-[#23344E] rounded-full overflow-hidden flex gap-0.5">
                      <div className="h-full bg-[#3159A8]" style={{ width: "52.4%" }} title="Male: 52.4%" />
                      <div className="h-full bg-[#526B91]" style={{ width: "47.1%" }} title="Female: 47.1%" />
                      <div className="h-full bg-[#C58A32]" style={{ width: "0.5%" }} title="Other: 0.5%" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      <div className="p-2 rounded bg-white dark:bg-[#162235] border border-[#E1E6EE] dark:border-[#23344E]">
                        <div className="text-[11px] text-[#68758A]">Male</div>
                        <div className="text-[15px] font-bold text-[#253247] dark:text-[#F1F5F9]">52.4%</div>
                        <div className="text-[10px] text-[#68758A]">130,292</div>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#162235] border border-[#E1E6EE] dark:border-[#23344E]">
                        <div className="text-[11px] text-[#68758A]">Female</div>
                        <div className="text-[15px] font-bold text-[#253247] dark:text-[#F1F5F9]">47.1%</div>
                        <div className="text-[10px] text-[#68758A]">117,114</div>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#162235] border border-[#E1E6EE] dark:border-[#23344E]">
                        <div className="text-[11px] text-[#68758A]">Third Gender</div>
                        <div className="text-[15px] font-bold text-[#253247] dark:text-[#F1F5F9]">0.5%</div>
                        <div className="text-[10px] text-[#68758A]">1,244</div>
                      </div>
                    </div>
                  </div>

                  {/* Age Cohorts Card */}
                  <div className="p-3.5 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] bg-[#F4F6F9]/40 dark:bg-[#1E2D44]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-semibold text-[#68758A] dark:text-[#8B9BB4]">
                        Age Demographics
                      </span>
                      <span className="text-[11px] font-medium text-[#3159A8]">
                        +4.2% Youth Surge
                      </span>
                    </div>

                    <div className="space-y-2 text-[12px]">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[#253247] dark:text-[#F1F5F9] font-medium">18 - 25 Yrs (First-time / Gen-Z)</span>
                          <span className="font-bold text-[#253247] dark:text-[#F1F5F9]">22.4% <span className="text-[#68758A] font-normal">(55.6k)</span></span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E1E6EE] dark:bg-[#23344E] rounded-full overflow-hidden">
                          <div className="h-full bg-[#3159A8]" style={{ width: "22.4%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[#253247] dark:text-[#F1F5F9] font-medium">26 - 45 Yrs (Working Core)</span>
                          <span className="font-bold text-[#253247] dark:text-[#F1F5F9]">48.6% <span className="text-[#68758A] font-normal">(120.8k)</span></span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E1E6EE] dark:bg-[#23344E] rounded-full overflow-hidden">
                          <div className="h-full bg-[#526B91]" style={{ width: "48.6%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[#253247] dark:text-[#F1F5F9] font-medium">46+ Yrs (Senior Electors)</span>
                          <span className="font-bold text-[#253247] dark:text-[#F1F5F9]">29.0% <span className="text-[#68758A] font-normal">(72.1k)</span></span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E1E6EE] dark:bg-[#23344E] rounded-full overflow-hidden">
                          <div className="h-full bg-[#68758A]" style={{ width: "29.0%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Demographic Segments */}
                <div className="pt-2 border-t border-[#E1E6EE] dark:border-[#23344E]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-[#68758A] dark:text-[#8B9BB4]">
                      Strategic Voter Segments
                    </span>
                    <span className="text-[11px] font-medium text-[#526B91]">
                      5 Monitored Coalitions
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[12px]">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] text-[#253247] dark:text-[#F1F5F9] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#3159A8]" />
                      Vaishya &amp; Business: <span className="font-bold text-[#3159A8]">28.2%</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] text-[#253247] dark:text-[#F1F5F9] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#526B91]" />
                      Purvanchali: <span className="font-bold text-[#526B91]">24.6%</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] text-[#253247] dark:text-[#F1F5F9] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#24866A]" />
                      Punjabi-Khatri: <span className="font-bold text-[#24866A]">19.1%</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] text-[#253247] dark:text-[#F1F5F9] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#C58A32]" />
                      SC / OBC: <span className="font-bold text-[#C58A32]">16.4%</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] text-[#253247] dark:text-[#F1F5F9] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#68758A]" />
                      Others: <span className="font-bold text-[#68758A]">11.7%</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Category Breakdown */}
            {activeTab === "caste" && (
              <div className="py-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-[#E1E6EE] dark:border-[#23344E]">
                    <div className="text-[12px] font-medium text-[#68758A]">General Category</div>
                    <div className="text-[18px] font-bold text-[#253247] dark:text-[#F1F5F9] mt-0.5">47.3%</div>
                    <div className="text-[11px] text-[#24866A] mt-0.5 font-medium">117,611 Registered Voters</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#E1E6EE] dark:border-[#23344E]">
                    <div className="text-[12px] font-medium text-[#68758A]">OBC Communities</div>
                    <div className="text-[18px] font-bold text-[#253247] dark:text-[#F1F5F9] mt-0.5">24.6%</div>
                    <div className="text-[11px] text-[#3159A8] mt-0.5 font-medium">61,167 Registered Voters</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#E1E6EE] dark:border-[#23344E]">
                    <div className="text-[12px] font-medium text-[#68758A]">SC / ST Electors</div>
                    <div className="text-[18px] font-bold text-[#253247] dark:text-[#F1F5F9] mt-0.5">16.4%</div>
                    <div className="text-[11px] text-[#C58A32] mt-0.5 font-medium">40,778 Registered Voters</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#E1E6EE] dark:border-[#23344E]">
                    <div className="text-[12px] font-medium text-[#68758A]">Minority Pockets</div>
                    <div className="text-[18px] font-bold text-[#253247] dark:text-[#F1F5F9] mt-0.5">11.7%</div>
                    <div className="text-[11px] text-[#526B91] mt-0.5 font-medium">29,094 Registered Voters</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Top Polling Wards */}
            {activeTab === "booths" && (
              <div className="py-4 space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#E1E6EE] dark:border-[#23344E]">
                  <div>
                    <div className="text-[13px] font-semibold text-[#253247] dark:text-[#F1F5F9]">
                      Booth 104 — Modern Senior Secondary School
                    </div>
                    <div className="text-[11px] text-[#68758A]">Ward 12 • 1,420 Electors • 98.2% EPIC Verification</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EBF7F3] text-[#24866A]">
                    +14.2% Lead
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#E1E6EE] dark:border-[#23344E]">
                  <div>
                    <div className="text-[13px] font-semibold text-[#253247] dark:text-[#F1F5F9]">
                      Booth 88 — Community Center Block C
                    </div>
                    <div className="text-[11px] text-[#68758A]">Ward 9 • 1,280 Electors • 96.5% EPIC Verification</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EBF7F3] text-[#24866A]">
                    +9.8% Lead
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Bar */}
          <div className="mt-3 pt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-between text-[12px] text-[#68758A]">
            <span>ECI Master Roll Revision Verified</span>
            <Link
              href="/reports"
              className="text-[#3159A8] dark:text-[#4C74C9] font-medium hover:underline flex items-center gap-1"
            >
              Ward Breakdown Report <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* RIGHT BLOCK: Cadre & Polling Readiness (Span 1) */}
        <div className="bg-white dark:bg-[#162235] p-5 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E6EE] dark:border-[#23344E]">
              <div>
                <h2 className="text-[17px] font-bold text-[#253247] dark:text-[#F1F5F9]">
                  Cadre Readiness
                </h2>
                <p className="text-[11px] text-[#68758A]">
                  AC-54 Saturation Index
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EBF7F3] text-[#24866A] border border-[#C3E8DC]">
                Optimal (88.4%)
              </span>
            </div>

            {/* Restrained Progress Display */}
            <div className="my-4 p-3.5 rounded-lg bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E]">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-[#253247] dark:text-[#F1F5F9]">
                  Booth Committee Saturation
                </span>
                <span className="text-[18px] font-bold text-[#3159A8] dark:text-[#4C74C9]">
                  88.4%
                </span>
              </div>
              <div className="h-2 w-full bg-[#E1E6EE] dark:bg-[#23344E] rounded-full overflow-hidden">
                <div className="h-full bg-[#3159A8]" style={{ width: "88.4%" }} />
              </div>
              <p className="text-[11px] text-[#68758A] mt-1.5">
                248 of 264 Polling Booths fully assigned with committee captains.
              </p>
            </div>

            {/* Structured Status Points */}
            <div className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#E1E6EE] dark:border-[#23344E]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#24866A]" />
                  <span className="font-medium text-[#253247] dark:text-[#F1F5F9]">
                    Captains Assigned
                  </span>
                </div>
                <span className="font-semibold text-[#24866A]">
                  248 / 264
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#E1E6EE] dark:border-[#23344E]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3159A8]" />
                  <span className="font-medium text-[#253247] dark:text-[#F1F5F9]">
                    Communication Groups
                  </span>
                </div>
                <span className="font-semibold text-[#3159A8]">
                  260 Active
                </span>
              </div>

              {/* Actionable Warning Notice */}
              <div className="p-3 rounded-md bg-[#FDF7ED] dark:bg-[#3D2B0C] border border-[#F5E2C4] dark:border-[#523A10]">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C58A32] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[12px] font-semibold text-[#C58A32]">
                      16 Booths missing revisions
                    </div>
                    <div className="text-[11px] text-[#68758A] dark:text-[#8B9BB4] mt-0.5">
                      Form 7/8 BLO sign-offs pending verification
                    </div>
                    <Link
                      href="/booths"
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#C58A32] hover:underline"
                    >
                      Resolve Vacancies <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] flex justify-between items-center text-[12px] text-[#68758A]">
            <span>Synced 12m ago</span>
            <Link
              href="/reports"
              className="text-[#3159A8] dark:text-[#4C74C9] font-medium hover:underline flex items-center gap-1"
            >
              Audit Log <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION E: Quick Dispatches & Field Activity Stream (1:2 Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* QUICK OPERATIONAL DISPATCHES (Span 1) */}
        <div className="bg-white dark:bg-[#162235] p-5 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E6EE] dark:border-[#23344E] mb-3">
              <div>
                <h2 className="text-[17px] font-bold text-[#253247] dark:text-[#F1F5F9]">
                  Quick Actions
                </h2>
                <p className="text-[11px] text-[#68758A]">
                  Operational dispatches
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF2F8] text-[#526B91]">
                Administrative
              </span>
            </div>

            {/* 4 Clean Action Tiles */}
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <Link
                href="/voters"
                className="p-3 rounded-md border border-[#E1E6EE] dark:border-[#23344E] hover:border-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] transition-colors flex flex-col justify-between h-20"
              >
                <UserPlus className="w-4 h-4 text-[#3159A8]" />
                <div>
                  <div className="font-semibold text-[#253247] dark:text-[#F1F5F9]">Add Voter</div>
                  <div className="text-[10px] text-[#68758A]">Single Entry</div>
                </div>
              </Link>

              <Link
                href="/members"
                className="p-3 rounded-md border border-[#E1E6EE] dark:border-[#23344E] hover:border-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] transition-colors flex flex-col justify-between h-20"
              >
                <Users className="w-4 h-4 text-[#526B91]" />
                <div>
                  <div className="font-semibold text-[#253247] dark:text-[#F1F5F9]">Add Member</div>
                  <div className="text-[10px] text-[#68758A]">Cadre Sign-up</div>
                </div>
              </Link>

              <Link
                href="/booths"
                className="p-3 rounded-md border border-[#E1E6EE] dark:border-[#23344E] hover:border-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] transition-colors flex flex-col justify-between h-20"
              >
                <Vote className="w-4 h-4 text-[#24866A]" />
                <div>
                  <div className="font-semibold text-[#253247] dark:text-[#F1F5F9]">Map Booth</div>
                  <div className="text-[10px] text-[#68758A]">Station Inspector</div>
                </div>
              </Link>

              <Link
                href="/forms"
                className="p-3 rounded-md border border-[#E1E6EE] dark:border-[#23344E] hover:border-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] transition-colors flex flex-col justify-between h-20"
              >
                <FileText className="w-4 h-4 text-[#C58A32]" />
                <div>
                  <div className="font-semibold text-[#253247] dark:text-[#F1F5F9]">New Survey</div>
                  <div className="text-[10px] text-[#68758A]">Field Form</div>
                </div>
              </Link>

              {/* Bulk CSV Roll Import */}
              <button
                type="button"
                onClick={() => handleActionToast("CSV Importer", "Upload modal launched for Draft Rolls (.csv, .xlsx).")}
                className="col-span-2 p-2.5 rounded-md border border-dashed border-[#E1E6EE] dark:border-[#23344E] hover:border-[#3159A8] hover:bg-[#F0F4FA] dark:hover:bg-[#1E2D44] transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-[#3159A8]" />
                  <div>
                    <div className="text-[12px] font-semibold text-[#253247] dark:text-[#F1F5F9]">
                      Bulk CSV Roll Import
                    </div>
                    <div className="text-[10px] text-[#68758A]">Draft Rolls (.csv, .xlsx)</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#68758A]" />
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-between text-[11px] text-[#68758A]">
            <span>ECI Standard Compliant</span>
            <span className="font-medium text-[#3159A8]">v4.2 Ready</span>
          </div>
        </div>

        {/* RECENT FIELD ACTIVITY & AUDIT STREAM (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#162235] p-5 rounded-lg border border-[#E1E6EE] dark:border-[#23344E] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E6EE] dark:border-[#23344E] mb-3">
              <div>
                <h2 className="text-[17px] font-bold text-[#253247] dark:text-[#F1F5F9]">
                  Field Activity &amp; Audit Stream
                </h2>
                <p className="text-[11px] text-[#68758A]">
                  Real-time elector verification and system event feed
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsStreamPaused(!isStreamPaused);
                    showToast("info", isStreamPaused ? "Stream Resumed" : "Stream Paused", "Activity feed stream toggled.");
                  }}
                  className="px-2.5 py-1 rounded border border-[#E1E6EE] dark:border-[#23344E] text-[11px] font-medium text-[#253247] dark:text-[#F1F5F9] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors cursor-pointer"
                >
                  {isStreamPaused ? "Resume Feed" : "Pause Feed"}
                </button>
                <Link
                  href="/reports"
                  className="text-[12px] font-medium text-[#3159A8] dark:text-[#4C74C9] hover:underline flex items-center gap-1"
                >
                  Full Log <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Stream Entries */}
            <div className="space-y-2 text-[13px]">
              {/* Entry 1 */}
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#E1E6EE] dark:border-[#23344E] hover:bg-[#F4F6F9]/60 dark:hover:bg-[#1E2D44]/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-[#24866A] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#253247] dark:text-[#F1F5F9] truncate">
                      ECI Draft Roll Batch #4029 imported
                    </div>
                    <div className="text-[11px] text-[#68758A] truncate">
                      1,420 records processed • 8 wards
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#68758A] hidden sm:inline">4m ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EBF7F3] text-[#24866A] border border-[#C3E8DC]">
                    Synced
                  </span>
                </div>
              </div>

              {/* Entry 2 */}
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#E1E6EE] dark:border-[#23344E] hover:bg-[#F4F6F9]/60 dark:hover:bg-[#1E2D44]/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Clock className="w-4 h-4 text-[#3159A8] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#253247] dark:text-[#F1F5F9] truncate">
                      Door-to-door survey verification (Sector 4)
                    </div>
                    <div className="text-[11px] text-[#68758A] truncate">
                      340 households verified by Team Vikas
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#68758A] hidden sm:inline">18m ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF2F8] text-[#3159A8] border border-[#D5DFEE]">
                    In Progress
                  </span>
                </div>
              </div>

              {/* Entry 3 */}
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#E1E6EE] dark:border-[#23344E] hover:bg-[#F4F6F9]/60 dark:hover:bg-[#1E2D44]/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Shield className="w-4 h-4 text-[#24866A] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#253247] dark:text-[#F1F5F9] truncate">
                      BLO verified for Booth 112 (Surender Kumar)
                    </div>
                    <div className="text-[11px] text-[#68758A] truncate">
                      Validated via SDM portal API
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#68758A] hidden sm:inline">32m ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EBF7F3] text-[#24866A] border border-[#C3E8DC]">
                    Approved
                  </span>
                </div>
              </div>

              {/* Entry 4 */}
              <div className="flex items-center justify-between p-2.5 rounded-md border border-[#E1E6EE] dark:border-[#23344E] hover:bg-[#F4F6F9]/60 dark:hover:bg-[#1E2D44]/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-[#C58A32] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#253247] dark:text-[#F1F5F9] truncate">
                      14 voter shift requests pending
                    </div>
                    <div className="text-[11px] text-[#68758A] truncate">
                      Form 8 relocation verification required
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#68758A] hidden sm:inline">1h ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FDF7ED] text-[#C58A32] border border-[#F5E2C4]">
                    Review Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-between text-[11px] text-[#68758A]">
            <span>INDIATA Telemetry Gateway v4.2</span>
            <span>Audit Ledger Active</span>
          </div>
        </div>
      </section>
    </div>
  );
}
