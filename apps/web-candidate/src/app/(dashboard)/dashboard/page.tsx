"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Upload,
  UserPlus,
  Radio,
  FileText,
  TrendingUp,
  Users,
  BadgeCheck,
  Vote,
  AlertTriangle,
  ArrowRight,
  PieChart,
  Calendar,
  Layers,
  ChevronRight,
  Zap,
  FolderArchive,
  Keyboard,
  ExternalLink,
  Activity,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

type DemographicTab = "gender-age" | "caste" | "booths";

export default function DashboardPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<DemographicTab>("gender-age");
  const [isStreamPaused, setIsStreamPaused] = useState(false);

  const handleActionToast = (title: string, desc: string) => {
    showToast("info", title, desc);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* SECTION A: Welcome & Command Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#493BBF] via-[#6256D9] to-[#0060AB] flex items-center justify-center text-white shadow-md shadow-[#493BBF]/20 shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#161B2A] dark:text-[#F8FAFC] tracking-tight">
                War Room Command
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-[#493BBF] to-indigo-600 text-white shadow-2xs">
                AC-54 Live
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <p className="text-xs font-medium text-[#707E94] dark:text-[#94A3B8] mt-0.5">
              Real-time voter roll sync • Instant field dispatches
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Import CSV */}
          <button
            type="button"
            onClick={() => handleActionToast("CSV Importer", "Upload modal initialized for Draft Rolls.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-[#C8C4D6]/80 dark:border-[#334155] hover:border-[#493BBF] hover:bg-[#493BBF]/5 text-[#161B2A] dark:text-[#F8FAFC] text-xs font-bold transition-all shadow-2xs hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#493BBF]" />
            <span>Import CSV</span>
          </button>

          {/* Add Voter */}
          <Link
            href="/voters"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-[#C8C4D6]/80 dark:border-[#334155] hover:border-[#0060AB] hover:bg-[#0060AB]/5 text-[#161B2A] dark:text-[#F8FAFC] text-xs font-bold transition-all shadow-2xs hover:-translate-y-0.5 active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-[#0060AB]" />
            <span>Add Voter</span>
          </Link>

          {/* Deploy AI Broadcast */}
          <button
            type="button"
            onClick={() => handleActionToast("AI Broadcast Scheduled", "Deploying voice and WhatsApp templates across 264 booths.")}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#493BBF] via-[#6256D9] to-[#0060AB] text-white shadow-sm hover:shadow-md hover:opacity-95 text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Deploy AI Broadcast</span>
          </button>

          {/* PDF Export */}
          <button
            type="button"
            onClick={() => handleActionToast("PDF Briefing", "Generating high-resolution daily intelligence briefing...")}
            className="p-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-[#C8C4D6]/80 dark:border-[#334155] hover:border-red-400 hover:bg-red-50 text-red-600 transition-all shadow-2xs hover:-translate-y-0.5 cursor-pointer"
            title="Export PDF Briefing"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION B: 4 Colorful Core KPI Statistic Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Total Voters (Vivid Indigo) */}
        <div className="relative bg-gradient-to-b from-white to-[#493BBF]/5 dark:from-[#0F172A] dark:to-[#493BBF]/10 p-5 rounded-xl border border-[#493BBF]/20 shadow-2xs hover:shadow-md hover:border-[#493BBF] transition-all duration-200 group flex flex-col justify-between hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#493BBF] via-indigo-500 to-purple-500" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#707E94] dark:text-[#94A3B8] tracking-wider uppercase">
                Total Voters
              </span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#493BBF] text-white shadow-sm group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[32px] font-extrabold text-[#161B2A] dark:text-[#F8FAFC] tracking-tight leading-none mb-3 tabular-nums">
              248,650
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#C8C4D6]/40 dark:border-[#1E293B]">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +3.4%
              </span>
              <span className="text-[10px] font-extrabold text-[#493BBF] dark:text-[#C5C0FF] bg-[#493BBF]/10 border border-[#493BBF]/20 px-2 py-0.5 rounded-full">
                94.2% EPIC
              </span>
            </div>
            <div className="mt-2.5 h-1.5 w-full bg-[#EAEDFF] dark:bg-[#1E293B] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#493BBF] via-indigo-500 to-purple-500 rounded-full"
                style={{ width: "94.2%" }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Active Cadre (Vivid Electric Azure Blue) */}
        <div className="relative bg-gradient-to-b from-white to-[#0060AB]/5 dark:from-[#0F172A] dark:to-[#0060AB]/10 p-5 rounded-xl border border-[#0060AB]/20 shadow-2xs hover:shadow-md hover:border-[#0060AB] transition-all duration-200 group flex flex-col justify-between hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0060AB] via-sky-500 to-cyan-500" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#707E94] dark:text-[#94A3B8] tracking-wider uppercase">
                Active Cadre
              </span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0060AB] text-white shadow-sm group-hover:scale-110 transition-transform">
                <BadgeCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[32px] font-extrabold text-[#161B2A] dark:text-[#F8FAFC] tracking-tight leading-none mb-3 tabular-nums">
              18,420
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#C8C4D6]/40 dark:border-[#1E293B]">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +12.0%
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                920 pending
              </span>
            </div>
            <div className="mt-2.5 h-1.5 w-full bg-[#EAEDFF] dark:bg-[#1E293B] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#0060AB] to-cyan-500 rounded-full"
                style={{ width: "78%" }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Booth Coverage (Vivid Teal/Emerald) */}
        <div className="relative bg-gradient-to-b from-white to-teal-500/5 dark:from-[#0F172A] dark:to-teal-500/10 p-5 rounded-xl border border-teal-500/20 shadow-2xs hover:shadow-md hover:border-teal-500 transition-all duration-200 group flex flex-col justify-between hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#707E94] dark:text-[#94A3B8] tracking-wider uppercase">
                Booth Coverage
              </span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-sm group-hover:scale-110 transition-transform">
                <Vote className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-[32px] font-extrabold text-[#161B2A] dark:text-[#F8FAFC] tracking-tight leading-none tabular-nums">
                264
              </span>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                Booths
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#C8C4D6]/40 dark:border-[#1E293B]">
              <span className="text-[10px] font-bold text-[#707E94] dark:text-[#94A3B8]">
                248 mapped • 16 open
              </span>
              <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                93.9% Ready
              </span>
            </div>
            <div className="mt-2.5 h-1.5 w-full bg-[#EAEDFF] dark:bg-[#1E293B] rounded-full overflow-hidden flex gap-0.5 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-l-full"
                style={{ width: "93.9%" }}
              />
              <div
                className="h-full bg-rose-500 rounded-r-full"
                style={{ width: "6.1%" }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: BLO Officers (Vivid Gold/Amber) */}
        <div className="relative bg-gradient-to-b from-white to-amber-500/5 dark:from-[#0F172A] dark:to-amber-500/10 p-5 rounded-xl border border-amber-500/20 shadow-2xs hover:shadow-md hover:border-amber-500 transition-all duration-200 group flex flex-col justify-between hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#707E94] dark:text-[#94A3B8] tracking-wider uppercase">
                BLO Officers
              </span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[32px] font-extrabold text-[#161B2A] dark:text-[#F8FAFC] tracking-tight leading-none mb-3 tabular-nums">
              258 Verified
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#C8C4D6]/40 dark:border-[#1E293B]">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <AlertTriangle className="w-3 h-3" />
                6 Vacant
              </span>
              <Link
                href="/blo"
                className="text-xs font-extrabold text-amber-700 dark:text-amber-400 hover:text-amber-800 hover:underline flex items-center gap-0.5"
              >
                Assign <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="mt-2.5 h-1.5 w-full bg-[#EAEDFF] dark:bg-[#1E293B] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{ width: "97.7%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: Middle Grid (2:1 Ratio) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT BLOCK: Demographic & Caste Intelligence (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#C8C4D6]/50 dark:border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xs">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-[#161B2A] dark:text-[#F8FAFC]">
                      Demographics &amp; Caste Matrices
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#493BBF] text-white shadow-2xs">
                      AC-54
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-[#707E94] dark:text-[#94A3B8] mt-0.5">
                    Electoral breakdown • 248k constituents
                  </p>
                </div>
              </div>

              {/* Segmented Control Tabs */}
              <div className="flex items-center bg-[#EAEDFF] dark:bg-[#1E293B] p-1 rounded-xl border border-[#C8C4D6]/40 dark:border-[#334155] shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab("gender-age")}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "gender-age"
                      ? "bg-gradient-to-r from-[#493BBF] to-[#6256D9] text-white shadow-2xs"
                      : "text-[#474554] dark:text-[#94A3B8] hover:text-[#493BBF] hover:bg-white dark:hover:bg-[#0F172A]"
                  }`}
                >
                  Gender &amp; Age
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("caste")}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "caste"
                      ? "bg-gradient-to-r from-[#493BBF] to-[#6256D9] text-white shadow-2xs"
                      : "text-[#474554] dark:text-[#94A3B8] hover:text-[#493BBF] hover:bg-white dark:hover:bg-[#0F172A]"
                  }`}
                >
                  Caste Split
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("booths")}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "booths"
                      ? "bg-gradient-to-r from-[#493BBF] to-[#6256D9] text-white shadow-2xs"
                      : "text-[#474554] dark:text-[#94A3B8] hover:text-[#493BBF] hover:bg-white dark:hover:bg-[#0F172A]"
                  }`}
                >
                  Top Booths
                </button>
              </div>
            </div>

            {/* TAB CONTENT: Gender & Age */}
            {activeTab === "gender-age" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
                  {/* Gender Ratio Visual */}
                  <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-[#0F172A] dark:to-[#0060AB]/10 p-4 rounded-xl border border-[#0060AB]/20 shadow-2xs hover:border-[#0060AB] transition-all">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] uppercase tracking-wide flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#0060AB]" /> Gender Ratio
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        100% Synced
                      </span>
                    </div>

                    {/* Gradient Distribution Bar */}
                    <div className="h-3 w-full rounded-full overflow-hidden flex gap-1 mb-3.5 bg-[#EAEDFF] dark:bg-[#1E293B] p-0.5 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-l-full"
                        style={{ width: "52.4%" }}
                        title="Male: 52.4%"
                      />
                      <div
                        className="bg-gradient-to-r from-rose-500 to-pink-500 h-full"
                        style={{ width: "47.1%" }}
                        title="Female: 47.1%"
                      />
                      <div
                        className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-r-full"
                        style={{ width: "0.5%" }}
                        title="Other: 0.5%"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-blue-200 dark:border-blue-900 shadow-2xs">
                        <div className="text-[11px] text-blue-700 dark:text-blue-400 font-bold flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600" /> Male
                        </div>
                        <div className="text-sm font-extrabold text-[#161B2A] dark:text-[#F8FAFC] mt-0.5">
                          52.4%
                        </div>
                        <div className="text-[10px] text-[#707E94] font-semibold">130,292</div>
                      </div>

                      <div className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-rose-200 dark:border-rose-900 shadow-2xs">
                        <div className="text-[11px] text-rose-700 dark:text-rose-400 font-bold flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500" /> Female
                        </div>
                        <div className="text-sm font-extrabold text-[#161B2A] dark:text-[#F8FAFC] mt-0.5">
                          47.1%
                        </div>
                        <div className="text-[10px] text-[#707E94] font-semibold">117,114</div>
                      </div>

                      <div className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-amber-200 dark:border-amber-900 shadow-2xs">
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> Other
                        </div>
                        <div className="text-sm font-extrabold text-[#161B2A] dark:text-[#F8FAFC] mt-0.5">
                          0.5%
                        </div>
                        <div className="text-[10px] text-[#707E94] font-semibold">1,244</div>
                      </div>
                    </div>
                  </div>

                  {/* Age Demographics Segment */}
                  <div className="bg-gradient-to-br from-white to-purple-50/50 dark:from-[#0F172A] dark:to-[#493BBF]/10 p-4 rounded-xl border border-[#493BBF]/20 shadow-2xs hover:border-[#493BBF] transition-all">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] uppercase tracking-wide flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#493BBF]" /> Age Demographics
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        +4.2% Youth Surge
                      </span>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#161B2A] dark:text-[#F8FAFC] font-bold">18 - 25 Yrs (Gen-Z)</span>
                          <span className="text-[#493BBF] dark:text-[#C5C0FF] font-extrabold">
                            22.4% <span className="text-[#707E94] font-normal">(55.6k)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#EAEDFF] dark:bg-[#1E293B] rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-gradient-to-r from-[#493BBF] to-indigo-500 rounded-full" style={{ width: "22.4%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#161B2A] dark:text-[#F8FAFC] font-bold">26 - 45 Yrs (Workforce)</span>
                          <span className="text-[#0060AB] dark:text-[#88BEF8] font-extrabold">
                            48.6% <span className="text-[#707E94] font-normal">(120.8k)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#EAEDFF] dark:bg-[#1E293B] rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-gradient-to-r from-[#0060AB] to-cyan-500 rounded-full" style={{ width: "48.6%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#161B2A] dark:text-[#F8FAFC] font-bold">46+ Yrs (Senior)</span>
                          <span className="text-amber-700 dark:text-amber-400 font-extrabold">
                            29.0% <span className="text-[#707E94] font-normal">(72.1k)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#EAEDFF] dark:bg-[#1E293B] rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: "29.0%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Caste & Strategic Pockets with vivid colored pills */}
                <div className="mt-5 pt-4 border-t border-[#C8C4D6]/40 dark:border-[#1E293B]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold text-[#707E94] dark:text-[#94A3B8] uppercase tracking-wider">
                      Strategic Voter Segments
                    </span>
                    <span className="text-[10px] font-bold text-[#493BBF] dark:text-[#C5C0FF] bg-[#493BBF]/10 px-2 py-0.5 rounded-full">
                      5 Coalitions
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-xs text-purple-900 dark:text-purple-300 font-bold hover:scale-105 transition-transform cursor-pointer shadow-2xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-sm" />
                      Vaishya &amp; Traders: <span className="text-purple-700 dark:text-purple-400 font-extrabold">28.2%</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/30 text-xs text-teal-900 dark:text-teal-300 font-bold hover:scale-105 transition-transform cursor-pointer shadow-2xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shadow-sm" />
                      Purvanchali: <span className="text-teal-700 dark:text-teal-400 font-extrabold">24.6%</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-sky-500/10 border border-blue-500/30 text-xs text-blue-900 dark:text-blue-300 font-bold hover:scale-105 transition-transform cursor-pointer shadow-2xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
                      Punjabi-Khatri: <span className="text-blue-700 dark:text-blue-400 font-extrabold">19.1%</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-300 font-bold hover:scale-105 transition-transform cursor-pointer shadow-2xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                      SC / OBC: <span className="text-amber-700 dark:text-amber-400 font-extrabold">16.4%</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 text-xs text-rose-900 dark:text-rose-300 font-bold hover:scale-105 transition-transform cursor-pointer shadow-2xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                      Others: <span className="text-rose-700 dark:text-rose-400 font-extrabold">11.7%</span>
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* TAB CONTENT: Caste Split */}
            {activeTab === "caste" && (
              <div className="py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B]">
                    <div className="text-xs font-bold text-[#707E94]">General Category</div>
                    <div className="text-xl font-extrabold text-[#161B2A] dark:text-[#F8FAFC] mt-0.5">47.3%</div>
                    <div className="text-[11px] text-[#159B91] mt-1 font-semibold">117,611 Registered Voters</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B]">
                    <div className="text-xs font-bold text-[#707E94]">OBC Communities</div>
                    <div className="text-xl font-extrabold text-[#161B2A] dark:text-[#F8FAFC] mt-0.5">24.6%</div>
                    <div className="text-[11px] text-[#0060AB] mt-1 font-semibold">61,167 Registered Voters</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B]">
                    <div className="text-xs font-bold text-[#707E94]">SC / ST Electors</div>
                    <div className="text-xl font-extrabold text-[#161B2A] dark:text-[#F8FAFC] mt-0.5">16.4%</div>
                    <div className="text-[11px] text-[#E99A32] mt-1 font-semibold">40,778 Registered Voters</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B]">
                    <div className="text-xs font-bold text-[#707E94]">Minority Pockets</div>
                    <div className="text-xl font-extrabold text-[#161B2A] dark:text-[#F8FAFC] mt-0.5">11.7%</div>
                    <div className="text-[11px] text-[#E15B70] mt-1 font-semibold">29,094 Registered Voters</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Top Booths */}
            {activeTab === "booths" && (
              <div className="py-5 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-[#161B2A] dark:text-[#F8FAFC]">
                      Booth 104 — Modern Senior Secondary School
                    </div>
                    <div className="text-[11px] text-[#707E94]">Ward 12 • 1,420 Electors • 98.2% EPIC</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-[#E6F7F5] text-[#159B91]">
                    +14.2% Lead
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-[#161B2A] dark:text-[#F8FAFC]">
                      Booth 88 — Community Center Block C
                    </div>
                    <div className="text-[11px] text-[#707E94]">Ward 9 • 1,280 Electors • 96.5% EPIC</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-[#E6F7F5] text-[#159B91]">
                    +9.8% Lead
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card Bottom Bar */}
          <div className="mt-4 pt-3 border-t border-[#C8C4D6]/40 dark:border-[#1E293B] flex items-center justify-between text-xs text-[#707E94]">
            <span className="font-medium">ECI Revision Verified</span>
            <Link
              href="/reports"
              className="text-[#493BBF] dark:text-[#C5C0FF] font-extrabold hover:underline flex items-center gap-1 hover:translate-x-1 transition-transform"
            >
              Ward Breakdown <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* RIGHT BLOCK: Organization Health & Cadre Readiness (Span 1) */}
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#C8C4D6]/50 dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-2xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#161B2A] dark:text-[#F8FAFC]">
                    Cadre Readiness
                  </h2>
                  <p className="text-[10px] font-medium text-[#707E94]">
                    AC-54 Saturation Index
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-extrabold">
                High
              </span>
            </div>

            {/* Vibrant Radial Gauge with SVG Gradient */}
            <div className="my-4 flex flex-col items-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="cadreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#493bbf" />
                      <stop offset="50%" stopColor="#0060ab" />
                      <stop offset="100%" stopColor="#00b4d8" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#eaedff" strokeWidth="9" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="url(#cadreGrad)"
                    strokeDasharray="251.2"
                    strokeDashoffset="29.1"
                    strokeLinecap="round"
                    strokeWidth="9"
                  />
                </svg>
                <div className="absolute flex flex-col items-center text-center p-3 rounded-full bg-gradient-to-b from-white to-[#493BBF]/5 shadow-inner">
                  <span className="text-[28px] font-extrabold bg-gradient-to-r from-[#493BBF] to-[#0060AB] bg-clip-text text-transparent tracking-tight leading-none">
                    88.4%
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider mt-0.5">
                    Ready
                  </span>
                </div>
              </div>
              <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] mt-1">
                Booth Committee Saturation
              </div>
            </div>

            {/* Stat Points with vivid accents */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-xs font-bold text-[#161B2A] dark:text-[#F8FAFC]">
                    Captains Assigned
                  </span>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  248 / 264
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0060AB] shadow-sm" />
                  <span className="text-xs font-bold text-[#161B2A] dark:text-[#F8FAFC]">
                    WhatsApp Broadcasts
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#0060AB] bg-[#0060AB]/10 px-2 py-0.5 rounded-md">
                  260 Active
                </span>
              </div>

              {/* Warning Alert Card */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 flex items-start gap-2.5 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
                <div className="flex-1">
                  <div className="text-xs font-extrabold text-rose-700">
                    16 Booths missing revisions
                  </div>
                  <div className="text-[11px] text-[#474554] dark:text-[#94A3B8] mt-0.5 font-medium">
                    Form 7/8 BLO sign-offs pending
                  </div>
                  <Link
                    href="/booths"
                    className="mt-1 text-[11px] font-extrabold text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Resolve Vacancies <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#C8C4D6]/40 dark:border-[#1E293B] flex justify-between items-center text-xs text-[#707E94]">
            <span className="font-medium">Synced 12m ago</span>
            <Link
              href="/reports"
              className="text-xs font-extrabold text-[#493BBF] dark:text-[#C5C0FF] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Audit Report <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION D: Quick Actions Dock & Recent Activity Stream (1:2 Ratio) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* QUICK DISPATCH LAUNCHPAD (Span 1) */}
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#C8C4D6]/50 dark:border-[#1E293B] mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-2xs">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#161B2A] dark:text-[#F8FAFC]">
                    Quick Dispatches
                  </h2>
                  <p className="text-[10px] font-medium text-[#707E94]">
                    Operational actions
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#493BBF]/10 text-[#493BBF]">
                Instant
              </span>
            </div>

            {/* 5 Colorful Interactive Action Tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Tile 1: Add Voter (Purple) */}
              <Link
                href="/voters"
                className="p-3 rounded-xl border border-[#493BBF]/20 hover:border-[#493BBF] bg-gradient-to-br from-white to-[#493BBF]/5 dark:from-[#0F172A] dark:to-[#493BBF]/10 hover:shadow-md transition-all text-left group flex flex-col justify-between h-20 shadow-2xs hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#493BBF] text-white flex items-center justify-center group-hover:scale-110 shadow-2xs transition-transform">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] group-hover:text-[#493BBF] leading-tight">
                    Add Voter
                  </div>
                  <div className="text-[10px] text-[#707E94] font-semibold">Single Entry</div>
                </div>
              </Link>

              {/* Tile 2: Add Member (Blue) */}
              <Link
                href="/members"
                className="p-3 rounded-xl border border-[#0060AB]/20 hover:border-[#0060AB] bg-gradient-to-br from-white to-[#0060AB]/5 dark:from-[#0F172A] dark:to-[#0060AB]/10 hover:shadow-md transition-all text-left group flex flex-col justify-between h-20 shadow-2xs hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0060AB] text-white flex items-center justify-center group-hover:scale-110 shadow-2xs transition-transform">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] group-hover:text-[#0060AB] leading-tight">
                    Add Member
                  </div>
                  <div className="text-[10px] text-[#707E94] font-semibold">Cadre Sign-up</div>
                </div>
              </Link>

              {/* Tile 3: New Booth (Teal) */}
              <Link
                href="/booths"
                className="p-3 rounded-xl border border-teal-500/20 hover:border-teal-500 bg-gradient-to-br from-white to-teal-500/5 dark:from-[#0F172A] dark:to-teal-500/10 hover:shadow-md transition-all text-left group flex flex-col justify-between h-20 shadow-2xs hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex items-center justify-center group-hover:scale-110 shadow-2xs transition-transform">
                  <Vote className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] group-hover:text-teal-700 leading-tight">
                    New Booth
                  </div>
                  <div className="text-[10px] text-[#707E94] font-semibold">Map Station</div>
                </div>
              </Link>

              {/* Tile 4: New Survey (Amber) */}
              <Link
                href="/forms"
                className="p-3 rounded-xl border border-amber-500/20 hover:border-amber-500 bg-gradient-to-br from-white to-amber-500/5 dark:from-[#0F172A] dark:to-amber-500/10 hover:shadow-md transition-all text-left group flex flex-col justify-between h-20 shadow-2xs hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center group-hover:scale-110 shadow-2xs transition-transform">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] group-hover:text-amber-700 leading-tight">
                    New Survey
                  </div>
                  <div className="text-[10px] text-[#707E94] font-semibold">Field Form</div>
                </div>
              </Link>

              {/* Tile 5: Bulk CSV Import (Dashed Full Width) */}
              <button
                type="button"
                onClick={() => handleActionToast("CSV Importer", "Upload modal launched for Draft Rolls (.csv, .xlsx).")}
                className="col-span-2 p-2.5 rounded-xl border-2 border-dashed border-[#493BBF]/30 hover:border-[#493BBF] hover:bg-[#493BBF]/5 transition-all text-left flex items-center justify-between group bg-white dark:bg-[#0F172A] hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#493BBF]/10 text-[#493BBF] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FolderArchive className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] group-hover:text-[#493BBF] leading-tight">
                      Bulk CSV Import
                    </div>
                    <div className="text-[10px] text-[#707E94] font-semibold">Draft Rolls (.csv, .xlsx)</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#493BBF] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#C8C4D6]/40 dark:border-[#1E293B] flex items-center justify-between text-xs text-[#707E94]">
            <span>
              Shortcut:{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-[#EAEDFF] dark:bg-[#1E293B] text-[#493BBF] dark:text-[#C5C0FF] font-bold text-[10px] border border-[#C8C4D6]/40">
                Alt + N
              </kbd>
            </span>
            <span
              onClick={() => handleActionToast("Keymaps", "Alt+N: Quick Entry | Cmd+K: Search")}
              className="text-[#493BBF] dark:text-[#C5C0FF] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              Keymaps <Keyboard className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* RECENT ACTIVITY STREAM (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-[#C8C4D6]/60 dark:border-[#1E293B] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#C8C4D6]/50 dark:border-[#1E293B] mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-2xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-[#161B2A] dark:text-[#F8FAFC]">
                      Field Activity Stream
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-[#707E94]">
                    Real-time voter verification feed
                  </p>
                </div>
              </div>
              <Link
                href="/reports"
                className="text-xs font-extrabold text-[#493BBF] dark:text-[#C5C0FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Logs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Stream Entries with colorful left ribbons */}
            <div className="space-y-2.5">
              {/* Entry 1 (Teal/Emerald) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1E293B]/40 border border-[#C8C4D6]/50 dark:border-[#334155] border-l-4 border-l-emerald-500 hover:bg-emerald-500/5 hover:shadow-2xs transition-all cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] truncate">
                      ECI Draft Roll Batch #4029 imported
                    </div>
                    <div className="text-[11px] text-[#707E94] dark:text-[#94A3B8] font-medium truncate">
                      1,420 records processed • 8 wards
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[10px] font-bold text-[#707E94] hidden sm:inline">4m ago</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500 text-white shadow-2xs">
                    Synced
                  </span>
                </div>
              </div>

              {/* Entry 2 (Indigo/Purple) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1E293B]/40 border border-[#C8C4D6]/50 dark:border-[#334155] border-l-4 border-l-[#493BBF] hover:bg-[#493BBF]/5 hover:shadow-2xs transition-all cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#493BBF]/15 text-[#493BBF] dark:text-[#C5C0FF] flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] truncate">
                      Door-to-door survey 78% in Sector 4
                    </div>
                    <div className="text-[11px] text-[#707E94] dark:text-[#94A3B8] font-medium truncate">
                      340 households verified • Team Vikas
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[10px] font-bold text-[#707E94] hidden sm:inline">18m ago</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#493BBF] text-white shadow-2xs">
                    In Progress
                  </span>
                </div>
              </div>

              {/* Entry 3 (Cyan/Secondary) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1E293B]/40 border border-[#C8C4D6]/50 dark:border-[#334155] border-l-4 border-l-[#0060AB] hover:bg-[#0060AB]/5 hover:shadow-2xs transition-all cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#0060AB]/15 text-[#0060AB] dark:text-[#88BEF8] flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] truncate">
                      BLO verified for Booth 112 (Surender Kumar)
                    </div>
                    <div className="text-[11px] text-[#707E94] dark:text-[#94A3B8] font-medium truncate">
                      Validated via SDM portal API
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[10px] font-bold text-[#707E94] hidden sm:inline">32m ago</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#0060AB] text-white shadow-2xs">
                    Approved
                  </span>
                </div>
              </div>

              {/* Entry 4 (Amber/Orange) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1E293B]/40 border border-[#C8C4D6]/50 dark:border-[#334155] border-l-4 border-l-amber-500 hover:bg-amber-500/5 hover:shadow-2xs transition-all cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#161B2A] dark:text-[#F8FAFC] truncate">
                      14 voter shift requests pending
                    </div>
                    <div className="text-[11px] text-[#707E94] dark:text-[#94A3B8] font-medium truncate">
                      Form 8 relocation verification
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[10px] font-bold text-[#707E94] hidden sm:inline">1h ago</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-500 text-white shadow-2xs">
                    Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="mt-4 pt-3 border-t border-[#C8C4D6]/40 dark:border-[#1E293B] flex items-center justify-between text-xs text-[#707E94]">
            <span className="text-[10px] font-medium">Rajtantra Telemetry Gateway v4.2</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsStreamPaused(!isStreamPaused);
                  showToast("info", isStreamPaused ? "Stream Resumed" : "Stream Paused", "Live telemetry updates toggled.");
                }}
                className="px-3 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-[#C8C4D6]/60 dark:border-[#334155] text-xs font-bold text-[#161B2A] dark:text-[#F8FAFC] hover:bg-[#EAEDFF] hover:text-[#493BBF] transition-all shadow-2xs cursor-pointer"
              >
                {isStreamPaused ? "Resume Stream" : "Pause Stream"}
              </button>
              <button
                type="button"
                onClick={() => handleActionToast("Ward Filter", "Filtered activity to current active constituency ward.")}
                className="px-3 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-[#C8C4D6]/60 dark:border-[#334155] text-xs font-bold text-[#161B2A] dark:text-[#F8FAFC] hover:bg-[#EAEDFF] hover:text-[#493BBF] transition-all shadow-2xs cursor-pointer"
              >
                Filter Ward
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
