"use client";

import React, { useState } from "react";
import {
  Smartphone,
  FileText,
  Share2,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { CandidateProfile } from "../data/candidate-store";

interface CandidateAppPreviewProps {
  candidate: CandidateProfile;
}

export function CandidateAppPreview({ candidate }: CandidateAppPreviewProps) {
  const [activePreviewMode, setActivePreviewMode] = useState<"app" | "slip" | "whatsapp">("app");

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
              Live Real-Time Reflection
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ID: {candidate.id}
            </span>
          </div>
          <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Candidate App &amp; Voter Slip Live Preview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            This simulator demonstrates exactly how profile information and major images updated through the
            Distributor Portal instantly reflect on the Candidate Mobile App and Voter Slips.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActivePreviewMode("app")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePreviewMode === "app"
                ? "bg-white dark:bg-slate-700 text-[#2087FE] shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App UI</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePreviewMode("slip")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePreviewMode === "slip"
                ? "bg-white dark:bg-slate-700 text-[#2087FE] shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Voter Slip Output</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePreviewMode("whatsapp")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePreviewMode === "whatsapp"
                ? "bg-white dark:bg-slate-700 text-[#2087FE] shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Slip</span>
          </button>
        </div>
      </div>

      {/* Main Simulator Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Phone Mockup Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[330px] sm:w-[350px] bg-slate-950 p-3.5 rounded-[48px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
            {/* Phone Screen */}
            <div className="bg-slate-900 rounded-[38px] overflow-hidden text-slate-100 flex flex-col h-[640px] border border-slate-800 select-none relative font-sans text-xs">
              {/* Dynamic Island / Status Bar */}
              <div className="pt-2 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400 bg-slate-950 z-20">
                <span>9:41</span>
                <div className="w-20 h-4 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <div className="w-4 h-2 rounded-xs border border-slate-400 relative">
                    <div className="w-2.5 h-full bg-slate-300" />
                  </div>
                </div>
              </div>

              {/* VIEW 1: CANDIDATE MOBILE APP */}
              {activePreviewMode === "app" && (
                <div className="flex-1 overflow-y-auto space-y-3 pb-6">
                  {/* Hero Cover Banner */}
                  <div className="relative h-32 w-full bg-slate-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={candidate.images.coverBannerUrl}
                      alt="Candidate Cover Banner"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* App Launcher Icon & Name Badge */}
                    <div className="absolute top-2 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.images.appIconUrl}
                        alt="App Icon"
                        className="w-4 h-4 rounded-md object-contain"
                      />
                      <span className="text-[10px] font-bold text-white tracking-wide">
                        Rajtantra Candidate
                      </span>
                    </div>

                    {/* ECI Symbol overlay on top right */}
                    <div className="absolute top-2 right-3 w-8 h-8 rounded-lg bg-white p-1 shadow-md border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.images.partySymbolUrl}
                        alt="Election Symbol"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Candidate Profile Avatar & Header */}
                  <div className="px-4 -mt-10 relative z-10 flex items-end gap-3">
                    <div className="w-18 h-18 rounded-2xl bg-white p-1 shadow-xl ring-2 ring-[#2087FE] overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.images.profilePhotoUrl}
                        alt={candidate.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    <div className="pb-1 min-w-0">
                      <h4 className="font-black text-sm text-white truncate">
                        {candidate.name}
                      </h4>
                      <p className="text-[11px] text-amber-400 font-marathi font-bold truncate">
                        {candidate.marathiName}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-300 mt-0.5">
                        <span className="font-semibold text-blue-400">{candidate.partyAcronym}</span>
                        <span>•</span>
                        <span className="truncate">{candidate.constituency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Slogan Banner */}
                  <div className="mx-4 p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-200 text-[11px] font-marathi text-center font-bold">
                    &ldquo;{candidate.slogan}&rdquo;
                  </div>

                  {/* Live War Room KPI Cards */}
                  <div className="mx-4 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Voters</span>
                      <strong className="text-xs text-white">
                        {candidate.totalVoters ? candidate.totalVoters.toLocaleString() : "3.42L"}
                      </strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Booths</span>
                      <strong className="text-xs text-white">{candidate.totalBooths || 284}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Polling</span>
                      <strong className="text-xs text-emerald-400">{candidate.pollingDate || "20 Nov"}</strong>
                    </div>
                  </div>

                  {/* Candidate Quick Action Modules */}
                  <div className="mx-4 space-y-2 pt-1">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-xs">Voter Directory 2026</span>
                          <span className="text-[10.5px] text-slate-400">Search 100% booth-wise electors</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-xs">Print Official Slips</span>
                          <span className="text-[10.5px] text-slate-400">Doorstep voter slips with photo</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: VOTER SLIP OUTPUT */}
              {activePreviewMode === "slip" && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100 text-slate-900">
                  <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-3 space-y-2 text-xs">
                    {/* Header Banner */}
                    <div className="w-full h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.images.slipBannerUrl}
                        alt="Voter Slip Header Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-center border-b border-slate-200 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Official ECI Voter Slip 2026
                      </span>
                      <strong className="text-sm font-black text-slate-900 block">
                        {candidate.constituency}
                      </strong>
                    </div>

                    {/* Elector Mock Data */}
                    <div className="grid grid-cols-3 gap-2 text-[10.5px] py-1 border-b border-slate-200">
                      <div className="col-span-2 space-y-0.5">
                        <span className="text-slate-500 block">Voter Name:</span>
                        <strong className="font-bold text-slate-900 text-xs block">Ramesh S. Kulkarni</strong>
                        <span className="font-marathi text-slate-600">रमेश एस. कुलकर्णी</span>
                        <div className="mt-1">
                          <span className="text-slate-500">EPIC: </span>
                          <strong className="font-mono font-bold">MH/12/214/098124</strong>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end justify-between">
                        <div className="w-12 h-12 rounded-lg border border-slate-300 p-0.5 bg-slate-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={candidate.images.partySymbolUrl}
                            alt="Candidate Symbol"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[9.5px] font-bold text-slate-600">Symbol</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg">
                      <div>
                        <span className="text-slate-500 block">Booth Number:</span>
                        <strong className="font-bold text-xs text-blue-700">#101 Navbharat High School</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block">Serial No:</span>
                        <strong className="font-mono font-bold text-xs">482 (Part 42)</strong>
                      </div>
                    </div>

                    {/* Footer Candidate Endorsement */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={candidate.images.profilePhotoUrl}
                            alt={candidate.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[11px] block">{candidate.name}</span>
                          <span className="text-[9.5px] text-slate-500">{candidate.party}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          Vote for Change
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: WHATSAPP CARD */}
              {activePreviewMode === "whatsapp" && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] text-slate-100">
                  <div className="bg-[#1f2c34] rounded-2xl p-3 space-y-2 border border-white/5 text-xs">
                    <div className="flex items-center gap-2 text-[#25d366] text-[11px] font-bold">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp Campaign Slip Message</span>
                    </div>

                    {/* Shared Image Card */}
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.images.coverBannerUrl}
                        alt="WhatsApp Preview"
                        className="w-full h-28 object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-bold">
                        {candidate.name} ({candidate.marathiName})
                      </strong>
                      <p className="text-[11px] text-slate-300 font-marathi">
                        {candidate.slogan}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        मतदान दिनांक: <strong>{candidate.pollingDate}</strong> • चिन्ह: <strong>{candidate.party}</strong>
                      </p>
                      <div className="pt-2">
                        <span className="text-[10px] text-[#53bdeb] font-mono underline block truncate">
                          {candidate.publicSlipUrl}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Key Reflection Details */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Live Image Asset Cross-Mapping</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When a distributor changes any of the 6 major images or basic information in the distributor panel,
              the following client modules update automatically:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#2087FE] flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Candidate Profile Photo</strong>
                  <span className="text-[11px] text-slate-500">Reflects in mobile app header, directory avatars, and voter slips.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Cover Banner Image</strong>
                  <span className="text-[11px] text-slate-500">Hero background for candidate war room app &amp; campaign web pages.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Party Symbol (Chunav Chinha)</strong>
                  <span className="text-[11px] text-slate-500">Printed on official voter slips and EVM election guides.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  4
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Voter Slip Header Banner</strong>
                  <span className="text-[11px] text-slate-500">Official bilingual header printed on door-to-door slips.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan & Verification Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Shared Data Source Compliance</strong>
              <p className="text-[11.5px] text-blue-800 dark:text-blue-300 mt-0.5 leading-relaxed">
                Both the Candidate Listing, Candidate 360° Profile, and Mobile Simulator consume the same central
                <code className="mx-1 font-mono font-bold">candidateStore</code>. No duplicate copies exist,
                guaranteeing complete data consistency across the Distributor Portal demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
