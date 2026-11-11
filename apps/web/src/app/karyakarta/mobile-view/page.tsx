"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Sparkles,
  MapPin,
  Building,
  Phone,
  MessageSquare,
  FileText,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Mic,
  MicOff,
  Share2,
  Check,
  X,
  Smartphone,
  Laptop,
  Maximize2,
  ShieldCheck,
  Sliders,
  Wifi,
  Battery,
} from "lucide-react";
import {
  MOCK_SCOPED_VOTERS,
  MOCK_BOOTHS,
  MOCK_ISSUES,
  MOCK_SLIPS,
  computeKaryakartaKpiStats,
} from "@/karyakarta/data/mock-karyakarta-data";
import { VoterRecord, IssueTicket } from "@/karyakarta/types/karyakarta.types";

export default function KaryakartaMobileViewSimulator() {
  // Simulator configuration
  const [deviceFrame, setDeviceFrame] = useState<"iphone" | "android" | "clean">("iphone");
  const [networkOnline, setNetworkOnline] = useState<boolean>(true);
  const [language, setLanguage] = useState<"mr" | "en" | "hi">("mr");

  // Auth & Activation State (Module 2)
  const [isActivated, setIsActivated] = useState<boolean>(true);
  const [activationKey, setActivationKey] = useState<string>("K9X2B7");
  const [mobilePhone, setMobilePhone] = useState<string>("9822100001");

  // Bottom Tab Navigation (Module 1)
  const [currentTab, setCurrentTab] = useState<"home" | "voters" | "surveys" | "slips" | "more">("home");

  // Voters Data & Scoping
  const [voterList, setVoterList] = useState<VoterRecord[]>(MOCK_SCOPED_VOTERS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilterChip, setSelectedFilterChip] = useState<string>("all");
  const [kpiFilter, setKpiFilter] = useState<string>("all");

  // Active Modals & Drawers
  const [selectedVoter, setSelectedVoter] = useState<VoterRecord | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<string>("personal");
  const [surveyModalVoter, setSurveyModalVoter] = useState<VoterRecord | null>(null);
  const [slipModalVoter, setSlipModalVoter] = useState<VoterRecord | null>(null);
  const [slipPaperSize, setSlipPaperSize] = useState<"58mm" | "80mm">("58mm");
  const [isPrintingAnimation, setIsPrintingAnimation] = useState<boolean>(false);

  // Grievance Module 7 State
  const [issuesList, setIssuesList] = useState<IssueTicket[]>(MOCK_ISSUES);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState<boolean>(false);
  const [issueCategory, setIssueCategory] = useState<
    "Water Supply" | "Road Infrastructure" | "Sanitation" | "Pension / Scheme" | "Electricity" | "Other"
  >("Water Supply");
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceRecordSeconds, setVoiceRecordSeconds] = useState<number>(0);
  const [hasRecordedVoice, setHasRecordedVoice] = useState<boolean>(false);

  // Survey Engine Module 5 State
  const [surveySentiment, setSurveySentiment] = useState<string>("Supporter");
  const [surveySchemes, setSurveySchemes] = useState<string[]>(["Ladki Bahin Yojana"]);

  // AI Copilot Module 8 State
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "नमस्कार सचिन! मी आपला INDIATA निवडणूक सहाय्यक आहे. मी आज आपल्याला कसबा पेठ प्रभागातील मतदारांपर्यंत पोहोचण्यास कशी मदत करू?",
    },
  ]);

  // Compute live 15 KPIs
  const stats = useMemo(() => {
    return computeKaryakartaKpiStats(voterList, MOCK_BOOTHS, issuesList, MOCK_SLIPS);
  }, [voterList, issuesList]);

  // Voice recording simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingVoice]);

  // Filtered Voters logic
  const filteredVoters = useMemo(() => {
    let result = voterList;

    // Search query (English or Marathi)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.marathiName.includes(q) ||
          v.epicId.toLowerCase().includes(q) ||
          v.houseNo.toLowerCase().includes(q)
      );
    }

    // Filter Chips
    if (selectedFilterChip === "unvisited") result = result.filter((v) => !v.isVisited);
    if (selectedFilterChip === "supporters") result = result.filter((v) => v.classification === "Supporter");
    if (selectedFilterChip === "swing") result = result.filter((v) => v.classification === "Doubtful");
    if (selectedFilterChip === "influencers") result = result.filter((v) => v.isImportant);
    if (selectedFilterChip === "seniors") result = result.filter((v) => v.age >= 60);

    // KPI Filters
    if (kpiFilter === "visited") result = result.filter((v) => v.isVisited);
    if (kpiFilter === "not_visited") result = result.filter((v) => !v.isVisited);
    if (kpiFilter === "mobile_missing") result = result.filter((v) => !v.phone);
    if (kpiFilter === "opponents") result = result.filter((v) => v.classification === "Opponent");
    if (kpiFilter === "neutral") result = result.filter((v) => v.classification === "Neutral");

    return result;
  }, [voterList, searchQuery, selectedFilterChip, kpiFilter]);

  // Quick prompt submission for AI Copilot
  const handleAiPrompt = (promptText: string) => {
    setAiMessages((prev) => [
      ...prev,
      { sender: "user", text: promptText },
      {
        sender: "ai",
        text: "मी तपासणी केली: बूथ क्रमांक १०२ मध्ये ४२ संशयित (Swing) मतदार आहेत. यापैकी ६ कुटुंब प्रमुख आहेत. आपण 'Voters' टॅब मध्ये जाऊन 'Doubtful' फिल्टर निवडून त्यांना थेट भेटू शकता.",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 font-sans">
      {/* ========================================================= */}
      {/* TOP SIMULATOR CONTROL BAR (FOR DEVELOPER & CLIENT DEMO)   */}
      {/* ========================================================= */}
      <header className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B00] via-indigo-600 to-[#6256D9] flex items-center justify-center font-black text-white shadow-md">
            IN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base tracking-tight text-white">INDIATA Karyakarta</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30">
                MOBILE PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive 8-Module Prototype for Client Review & Approval
            </p>
          </div>
        </div>

        {/* Device Frame & Mode Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setDeviceFrame("iphone")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceFrame === "iphone"
                  ? "bg-[#6256D9] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone 15</span>
            </button>
            <button
              onClick={() => setDeviceFrame("android")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceFrame === "android"
                  ? "bg-[#6256D9] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Galaxy S24</span>
            </button>
            <button
              onClick={() => setDeviceFrame("clean")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceFrame === "clean"
                  ? "bg-[#6256D9] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>

          {/* Network Simulator Toggle */}
          <button
            onClick={() => setNetworkOnline((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              networkOnline
                ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
                : "bg-amber-950/60 border border-amber-800 text-amber-300"
            }`}
            title="Toggle offline/online mode"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                networkOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span>{networkOnline ? "Online (Synced)" : "Offline (Drift Cache)"}</span>
          </button>

          {/* Return to Desktop Portal Link */}
          <Link
            href="/karyakarta/dashboard"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            <Laptop className="w-3.5 h-3.5 text-cyan-400" />
            <span>Desktop Portal</span>
          </Link>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MODULE QUICK-JUMP CHIPS (FAST DEMO FOR CLIENT)            */}
      {/* ========================================================= */}
      <div className="w-full max-w-5xl flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
        <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px] shrink-0 mr-1">
          Quick Jump:
        </span>
        {[
          { id: "M1", label: "M1: 5-Tab Shell", tab: "home" },
          { id: "M2", label: "M2: Device Activation", isAuth: true },
          { id: "M3", label: "M3: 15 KPIs & Banner", tab: "home" },
          { id: "M4", label: "M4: Fast Voter Search", tab: "voters" },
          { id: "M5", label: "M5: Doorstep Survey", tab: "surveys" },
          { id: "M6", label: "M6: Thermal Slip & Print", tab: "slips" },
          { id: "M7", label: "M7: Audio Grievance", openGrievance: true },
          { id: "M8", label: "M8: Indic AI Copilot", openAi: true },
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              if (mod.isAuth) {
                setIsActivated(false);
              } else {
                setIsActivated(true);
                if (mod.tab) setCurrentTab(mod.tab as any);
                if (mod.openGrievance) setIsCreateIssueOpen(true);
                if (mod.openAi) setCurrentTab("more");
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-[#6256D9] shrink-0 font-medium transition-colors cursor-pointer"
          >
            {mod.label}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* PHONE BEZEL SIMULATOR CONTAINER                           */}
      {/* ========================================================= */}
      <div
        className={`relative transition-all duration-300 ${
          deviceFrame === "iphone"
            ? "w-[412px] h-[860px] bg-black p-3.5 rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_12px_#1e293b,0_0_0_14px_#475569]"
            : deviceFrame === "android"
            ? "w-[412px] h-[860px] bg-slate-900 p-2.5 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_8px_#334155]"
            : "w-full max-w-[430px] min-h-[820px] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl"
        }`}
      >
        {/* Smartphone Hardware Notch / Dynamic Island */}
        {deviceFrame === "iphone" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 border border-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-950/80 border border-indigo-700/50" />
          </div>
        )}
        {deviceFrame === "android" && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-slate-800 shadow-inner" />
        )}

        {/* SCREEN INNER VIEWPORT */}
        <div
          className={`w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative ${
            deviceFrame === "iphone" ? "rounded-[40px]" : deviceFrame === "android" ? "rounded-[28px]" : "rounded-2xl"
          }`}
        >
          {/* ========================================================= */}
          {/* PHONE STATUS BAR (Time, 5G, Battery, Sync Status)        */}
          {/* ========================================================= */}
          <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-300 shrink-0 z-40 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[10px] tracking-tight">5G</span>
              <Wifi className="w-3 h-3 text-slate-300" />
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* Network Offline Alert Bar */}
          {!networkOnline && (
            <div className="bg-amber-600 text-slate-950 font-bold text-[10px] py-1 px-3 text-center flex items-center justify-center gap-1.5 animate-pulse shrink-0">
              <AlertTriangle className="w-3 h-3" />
              <span>OFFLINE MODE — Local SQLite Active (Will auto-sync on reconnect)</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN CONTENT AREA (ROUTED BY TAB / ACTIVATION)          */}
          {/* ========================================================= */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pb-20">
            {/* ------------------------------------------------------- */}
            {/* MODULE 2: ACTIVATION KEY & DEVICE BINDING SCREEN        */}
            {/* ------------------------------------------------------- */}
            {!isActivated ? (
              <div className="p-6 flex flex-col justify-between min-h-full">
                <div className="space-y-6 pt-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6B00] via-indigo-600 to-[#6256D9] mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    <span className="text-2xl font-black text-white">IN</span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">INDIATA Karyakarta</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Field Command & Citizen Outreach System
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Candidate Organization
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>Anand Shinde Campaign</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Constituency: 215 - Kasba Peth Assembly
                    </div>
                  </div>

                  {/* Activation Form */}
                  <div className="space-y-3 text-left">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        6-Digit Activation Key (सक्रियीकरण कोड)
                      </label>
                      <input
                        type="text"
                        value={activationKey}
                        onChange={(e) => setActivationKey(e.target.value.toUpperCase())}
                        maxLength={6}
                        placeholder="e.g. K9X2B7"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center text-lg font-mono font-black tracking-widest text-[#FF6B00] focus:border-[#6256D9] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Registered Mobile Number (मोबाईल क्रमांक)
                      </label>
                      <input
                        type="tel"
                        value={mobilePhone}
                        onChange={(e) => setMobilePhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:border-[#6256D9] focus:outline-hidden"
                      />
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Device UUID will pair cryptographically to prevent sharing.</span>
                    </div>
                  </div>

                  {/* Activation Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setIsActivated(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bold text-sm text-white shadow-md transition-all cursor-pointer"
                    >
                      Verify & Activate App (प्रवेश करा)
                    </button>

                    <button
                      onClick={() => {
                        setActivationKey("K9X2B7");
                        setMobilePhone("9822100001");
                        setIsActivated(true);
                      }}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                    >
                      ⚡ Fast Client Demo Login
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center py-4">
                  Secured by INDIATA Campaign Defense • Version 2.4.0
                </div>
              </div>
            ) : (
              <>
                {/* ------------------------------------------------------- */}
                {/* TAB 1: HOME / DASHBOARD & 15 FIELD KPIS (MODULE 3)      */}
                {/* ------------------------------------------------------- */}
                {currentTab === "home" && (
                  <div className="p-4 space-y-4">
                    {/* Cadre Welcome Header */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 shadow-md relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>FIELD CADRE ACTIVE</span>
                        </span>
                        <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                          <Building className="w-3 h-3 text-[#FF6B00]" />
                          <span>Anand Shinde</span>
                        </span>
                      </div>

                      <h2 className="text-base font-black text-white">Sachin D. Mane</h2>
                      <p className="text-[11px] text-slate-300">
                        215 - Kasba Peth • <span className="text-cyan-300">Shaniwar Peth Central</span>
                      </p>

                      {/* Allocated Booths Chips */}
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>Booths:</span>
                        </span>
                        {["#101", "#102", "#103"].map((b) => (
                          <span
                            key={b}
                            className="px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono text-[10px] font-bold border border-white/15"
                          >
                            Booth {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Search Bar Shortcut */}
                    <button
                      onClick={() => setCurrentTab("voters")}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-slate-400 shadow-sm transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <span>Search Voter by Name, EPIC or House...</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-800 rounded-md text-slate-300 border border-slate-700">
                        50ms
                      </span>
                    </button>

                    {/* 15 KPI Telemetry Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-[#FF6B00]" />
                          <span>Field Telemetry (15 Metrics)</span>
                        </h3>
                        {kpiFilter !== "all" && (
                          <button
                            onClick={() => setKpiFilter("all")}
                            className="text-[10px] text-cyan-400 font-bold hover:underline cursor-pointer"
                          >
                            Reset Filter
                          </button>
                        )}
                      </div>

                      {/* Grid of KPI cards */}
                      <div className="grid grid-cols-2 gap-2 text-left">
                        {[
                          {
                            key: "assigned",
                            label: "Assigned Voters",
                            count: stats.totalAssignedVoters,
                            sub: "3 Booths",
                            bg: "bg-blue-950/40 border-blue-800/60 text-blue-300",
                          },
                          {
                            key: "visited",
                            label: "Total Visited",
                            count: stats.visitedVoters,
                            sub: `${stats.visitPercentage}% covered`,
                            bg: "bg-emerald-950/40 border-emerald-800/60 text-emerald-300",
                          },
                          {
                            key: "not_visited",
                            label: "Not Visited",
                            count: stats.unvisitedVoters,
                            sub: "Doorstep pending",
                            bg: "bg-amber-950/40 border-amber-800/60 text-amber-300",
                          },
                          {
                            key: "surveys",
                            label: "Surveys Done",
                            count: stats.surveysCompleted,
                            sub: "100% data captured",
                            bg: "bg-purple-950/40 border-purple-800/60 text-purple-300",
                          },
                          {
                            key: "important",
                            label: "Important / Key",
                            count: stats.importantVoters,
                            sub: "Priority contacts",
                            bg: "bg-yellow-950/40 border-yellow-800/60 text-yellow-300",
                          },
                          {
                            key: "mobile_has",
                            label: "Mobile Available",
                            count: stats.mobileAvailable,
                            sub: "Reachable via SMS",
                            bg: "bg-cyan-950/40 border-cyan-800/60 text-cyan-300",
                          },
                          {
                            key: "mobile_missing",
                            label: "Mobile Missing",
                            count: stats.mobileMissing,
                            sub: "Needs collection",
                            bg: "bg-rose-950/40 border-rose-800/60 text-rose-300",
                          },
                          {
                            key: "supporters",
                            label: "Supporters (Green)",
                            count: stats.supportersCount,
                            sub: "Confirmed votes",
                            bg: "bg-emerald-950/40 border-emerald-800/60 text-emerald-300",
                          },
                          {
                            key: "doubtful",
                            label: "Doubtful / Swing",
                            count: stats.doubtfulCount,
                            sub: "Target for follow-up",
                            bg: "bg-amber-950/40 border-amber-800/60 text-amber-300",
                          },
                          {
                            key: "opponents",
                            label: "Opponents (Red)",
                            count: stats.opponentsCount,
                            sub: "Rival leanings",
                            bg: "bg-red-950/40 border-red-800/60 text-red-300",
                          },
                          {
                            key: "neutral",
                            label: "Neutral / Undecided",
                            count: stats.neutralCount,
                            sub: "Canvassing target",
                            bg: "bg-slate-900 border-slate-800 text-slate-300",
                          },
                          {
                            key: "open_issues",
                            label: "Open Grievances",
                            count: stats.openIssues,
                            sub: "Booth action needed",
                            bg: "bg-orange-950/40 border-orange-800/60 text-orange-300",
                          },
                          {
                            key: "resolved_issues",
                            label: "Resolved Issues",
                            count: stats.resolvedIssues,
                            sub: "Closed by War Room",
                            bg: "bg-teal-950/40 border-teal-800/60 text-teal-300",
                          },
                          {
                            key: "digital_slips",
                            label: "Digital Slips (WA)",
                            count: stats.digitalSlipsSent,
                            sub: "Delivered to mobile",
                            bg: "bg-indigo-950/40 border-indigo-800/60 text-indigo-300",
                          },
                          {
                            key: "printed_slips",
                            label: "Slips Printed",
                            count: stats.slipsPrinted,
                            sub: "Handed over physically",
                            bg: "bg-blue-950/40 border-blue-800/60 text-blue-300",
                          },
                        ].map((kpi) => (
                          <div
                            key={kpi.key}
                            onClick={() => {
                              setKpiFilter(kpi.key);
                              setCurrentTab("voters");
                            }}
                            className={`p-3 rounded-xl border ${kpi.bg} cursor-pointer hover:brightness-125 transition-all shadow-xs`}
                          >
                            <div className="text-[10px] font-semibold opacity-90 truncate">
                              {kpi.label}
                            </div>
                            <div className="text-lg font-black mt-0.5 text-white">{kpi.count}</div>
                            <div className="text-[9px] opacity-75 truncate">{kpi.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Access to Module 7 Grievance & Module 8 AI */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setIsCreateIssueOpen(true)}
                        className="p-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>+ Raise Grievance</span>
                      </button>

                      <button
                        onClick={() => setCurrentTab("more")}
                        className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                        <span>Indic AI Copilot</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------- */}
                {/* TAB 2: VOTERS SEARCH & ROLL (MODULE 4)                  */}
                {/* ------------------------------------------------------- */}
                {currentTab === "voters" && (
                  <div className="p-4 space-y-3">
                    {/* Search Input Box */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search English / मराठी / EPIC / House..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#6256D9] focus:outline-hidden"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Chips Scrollable Row */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-[10px] font-bold">
                      {[
                        { id: "all", label: "All Voters" },
                        { id: "unvisited", label: "Unvisited" },
                        { id: "supporters", label: "Supporters" },
                        { id: "swing", label: "Swing" },
                        { id: "influencers", label: "Key People" },
                        { id: "seniors", label: "Senior 60+" },
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          onClick={() => setSelectedFilterChip(chip.id)}
                          className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                            selectedFilterChip === chip.id
                              ? "bg-[#6256D9] text-white shadow-xs"
                              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                    {/* Voter Count Result Banner */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>
                        Showing <strong className="text-white">{filteredVoters.length}</strong> voters
                      </span>
                      {kpiFilter !== "all" && (
                        <span className="text-[10px] text-cyan-400 font-semibold">
                          Filter: {kpiFilter}
                        </span>
                      )}
                    </div>

                    {/* Voter Card List */}
                    <div className="space-y-2">
                      {filteredVoters.map((voter) => (
                        <div
                          key={voter.id}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2 text-left"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-bold text-xs text-white">{voter.name}</h4>
                                <span className="text-[10px] text-slate-400">
                                  ({voter.marathiName})
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Age {voter.age} • {voter.gender} • H.No {voter.houseNo} • Booth{" "}
                                {voter.boothNumber}
                              </div>
                            </div>

                            {/* Classification Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase shrink-0 ${
                                voter.classification === "Supporter"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : voter.classification === "Doubtful"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : voter.classification === "Opponent"
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}
                            >
                              {voter.classification}
                            </span>
                          </div>

                          {/* Quick Action Buttons on Voter Card */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">
                              {voter.epicId}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Call */}
                              {voter.phone && (
                                <a
                                  href={`tel:${voter.phone}`}
                                  className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                                  title="Call voter"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                              )}

                              {/* WhatsApp */}
                              {voter.phone && (
                                <a
                                  href={`https://wa.me/${voter.phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                                  title="WhatsApp"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                </a>
                              )}

                              {/* Voter Slip */}
                              <button
                                onClick={() => setSlipModalVoter(voter)}
                                className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800 hover:bg-blue-900 cursor-pointer"
                                title="Print / Share Slip"
                              >
                                <Printer className="w-3 h-3" />
                              </button>

                              {/* Open Full 6-Tab Dossier */}
                              <button
                                onClick={() => {
                                  setSelectedVoter(voter);
                                  setActiveDossierTab("personal");
                                }}
                                className="px-2 py-1 rounded-lg bg-[#6256D9] hover:bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <span>Profile</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------- */}
                {/* TAB 3: DOORSTEP SURVEY ENGINE (MODULE 5)                */}
                {/* ------------------------------------------------------- */}
                {currentTab === "surveys" && (
                  <div className="p-4 space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/50">
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>26-Question Doorstep Survey</span>
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Select an assigned voter to capture political leaning, caste dynamics, and welfare schemes with GPS validation.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Pending Doorstep Visits ({voterList.filter((v) => !v.isVisited).length})
                      </div>
                      {voterList
                        .filter((v) => !v.isVisited)
                        .map((voter) => (
                          <div
                            key={voter.id}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-xs text-white">{voter.name}</div>
                              <div className="text-[10px] text-slate-400">
                                {voter.marathiName} • H.No {voter.houseNo}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSurveyModalVoter(voter);
                                setSurveySentiment(voter.classification);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                            >
                              Conduct Survey
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------- */}
                {/* TAB 4: VOTER SLIPS & THERMAL PRINTER (MODULE 6)         */}
                {/* ------------------------------------------------------- */}
                {currentTab === "slips" && (
                  <div className="p-4 space-y-4">
                    {/* Bluetooth Printer Status Card */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                          <Printer className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">ESC/POS Bluetooth Printer</div>
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>TP-5801 Connected (Paper: {slipPaperSize})</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSlipPaperSize((prev) => (prev === "58mm" ? "80mm" : "58mm"));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 cursor-pointer"
                      >
                        Toggle {slipPaperSize === "58mm" ? "80mm" : "58mm"}
                      </button>
                    </div>

                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Quick Slip Printing Roll
                    </div>

                    <div className="space-y-2">
                      {voterList.slice(0, 5).map((voter) => (
                        <div
                          key={voter.id}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-xs text-white">{voter.name}</div>
                            <div className="text-[10px] text-slate-400">
                              Sr. No #{voter.serialNumber || 42} • Booth {voter.boothNumber} • EPIC {voter.epicId}
                            </div>
                          </div>

                          <button
                            onClick={() => setSlipModalVoter(voter)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Preview Slip</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------- */}
                {/* TAB 5: MORE & INDIC AI COPILOT (MODULE 8)               */}
                {/* ------------------------------------------------------- */}
                {currentTab === "more" && (
                  <div className="p-4 space-y-4">
                    {/* AI Copilot Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-800/60 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6B00] to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-white">Indic Election AI Copilot</h3>
                            <p className="text-[10px] text-cyan-300 font-semibold">
                              Marathi & English Ground Strategy
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active
                        </span>
                      </div>

                      {/* Chat Messages Log */}
                      <div className="p-3 rounded-xl bg-black/40 border border-indigo-900/40 max-h-48 overflow-y-auto space-y-2 text-xs">
                        {aiMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl ${
                              msg.sender === "user"
                                ? "bg-[#6256D9] text-white ml-6 text-right"
                                : "bg-slate-900 text-slate-200 mr-4 border border-slate-800"
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                      </div>

                      {/* Prompt Quick Chips */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400">
                          Suggested Strategy Prompts:
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {[
                            "कस्बा पेठ मधील संशयित (Swing) मतदार दाखवा",
                            "बूथ क्रमांक १०१ मधील ज्येष्ठ नागरिक (६०+ वर्षे)",
                            "लाडकी बहीण योजनेचे लाभार्थी कोण आहेत?",
                          ].map((prompt, i) => (
                            <button
                              key={i}
                              onClick={() => handleAiPrompt(prompt)}
                              className="text-left text-[11px] p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-between group cursor-pointer"
                            >
                              <span>{prompt}</span>
                              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* App Settings List */}
                    <div className="space-y-1 text-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        Application Settings
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span>Language / भाषा</span>
                        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                          {(["mr", "en", "hi"] as const).map((l) => (
                            <button
                              key={l}
                              onClick={() => setLanguage(l)}
                              className={`px-2 py-0.5 rounded-md cursor-pointer ${
                                language === l ? "bg-[#6256D9] text-white" : "text-slate-400"
                              }`}
                            >
                              {l.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span>Device Binding ID</span>
                        <span className="font-mono text-[10px] text-cyan-400">dev-pixel-7a-01</span>
                      </div>

                      <button
                        onClick={() => setIsActivated(false)}
                        className="w-full p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 font-bold text-center hover:bg-rose-900/50 transition-colors cursor-pointer"
                      >
                        Unlink Device & Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ========================================================= */}
          {/* MODULE 1: 5-TAB PERSISTENT BOTTOM NAVIGATION BAR          */}
          {/* ========================================================= */}
          {isActivated && (
            <div className="absolute bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex items-center justify-around z-40">
              {[
                { id: "home", label: "Dashboard", icon: Sliders },
                { id: "voters", label: "Voters", icon: Users },
                { id: "surveys", label: "Surveys", icon: FileText },
                { id: "slips", label: "Slips", icon: Printer },
                { id: "more", label: "Copilot", icon: Sparkles },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as any)}
                    className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                      isActive ? "text-[#FF6B00]" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? "stroke-[2.5]" : ""}`} />
                    <span className="text-[9px] font-bold tracking-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Native Mobile Home Pill Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full z-50 pointer-events-none" />

          {/* ========================================================= */}
          {/* DRAWER / MODAL: 6-TAB CENTRAL VOTER DOSSIER (MODULE 4)    */}
          {/* ========================================================= */}
          {selectedVoter && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col justify-end">
              <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[85%] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
                {/* Drawer Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{selectedVoter.name}</h3>
                      <span className="text-xs text-slate-400">({selectedVoter.marathiName})</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      EPIC: {selectedVoter.epicId} • H.No {selectedVoter.houseNo}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVoter(null)}
                    className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 6 Tabs Row */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-800 overflow-x-auto scrollbar-none text-[10px] font-bold shrink-0">
                  {[
                    { id: "personal", label: "1. Personal" },
                    { id: "family", label: "2. Family Tree" },
                    { id: "survey", label: "3. Sentiment" },
                    { id: "slip", label: "4. Slip Chit" },
                    { id: "issues", label: "5. Issues" },
                    { id: "edit", label: "6. Propose Edit" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDossierTab(tab.id)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 cursor-pointer ${
                        activeDossierTab === tab.id
                          ? "bg-[#6256D9] text-white"
                          : "text-slate-400 hover:text-white bg-slate-800/60"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-4 overflow-y-auto space-y-3 text-xs">
                  {activeDossierTab === "personal" && (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Father/Husband</span>
                          <span className="font-semibold text-white">{selectedVoter.relativeName || "Vithal Patil"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Age / Gender</span>
                          <span className="font-semibold text-white">
                            {selectedVoter.age} Yrs / {selectedVoter.gender}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Polling Booth</span>
                          <span className="font-semibold text-cyan-400">
                            Booth {selectedVoter.boothNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Mobile Phone</span>
                          <span className="font-semibold text-white">
                            {selectedVoter.phone || "Missing"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDossierTab === "family" && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Household Members (House #{selectedVoter.houseNo})
                      </div>
                      {[
                        { name: "Rajesh V. Patil", rel: "Head (Self)", age: 48, role: "Supporter" },
                        { name: "Sunita R. Patil", rel: "Wife", age: 44, role: "Supporter" },
                        { name: "Amit R. Patil", rel: "Son (Youth)", age: 22, role: "Doubtful" },
                        { name: "Pooja R. Patil", rel: "Daughter", age: 19, role: "Neutral" },
                      ].map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-xs text-white">{m.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {m.rel} • Age {m.age}
                            </div>
                          </div>
                          <span className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-white/10 text-cyan-300">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeDossierTab === "survey" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">
                          Political Sentiment Leaning
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {["Supporter", "Doubtful", "Opponent", "Neutral"].map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setVoterList((prev) =>
                                  prev.map((v) =>
                                    v.id === selectedVoter.id
                                      ? { ...v, classification: s as any }
                                      : v
                                  )
                                );
                                setSelectedVoter((prev) =>
                                  prev ? { ...prev, classification: s as any } : null
                                );
                              }}
                              className={`p-2 rounded-lg font-bold text-xs border text-center transition-all cursor-pointer ${
                                selectedVoter.classification === s
                                  ? "bg-indigo-600 border-indigo-400 text-white"
                                  : "bg-slate-950 border-slate-800 text-slate-400"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDossierTab === "slip" && (
                    <div className="text-center space-y-2">
                      <p className="text-[10px] text-slate-400">
                        Official ECI slip format with QR verification.
                      </p>
                      <button
                        onClick={() => {
                          setSlipModalVoter(selectedVoter);
                          setSelectedVoter(null);
                        }}
                        className="w-full py-2.5 rounded-xl bg-blue-600 font-bold text-xs text-white cursor-pointer"
                      >
                        Open Slip Chit Generator
                      </button>
                    </div>
                  )}

                  {activeDossierTab === "issues" && (
                    <div className="text-center space-y-2">
                      <p className="text-[10px] text-slate-400">
                        Civic issues logged for this citizen.
                      </p>
                      <button
                        onClick={() => {
                          setIsCreateIssueOpen(true);
                          setSelectedVoter(null);
                        }}
                        className="w-full py-2.5 rounded-xl bg-orange-600 font-bold text-xs text-white cursor-pointer"
                      >
                        + Log New Issue for Voter
                      </button>
                    </div>
                  )}

                  {activeDossierTab === "edit" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 block">
                        Propose Phone / Name Correction for War Room Quarantine
                      </label>
                      <input
                        type="text"
                        placeholder="New mobile or name"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs"
                      />
                      <button
                        onClick={() => {
                          alert("Correction request queued for War Room review.");
                          setSelectedVoter(null);
                        }}
                        className="w-full py-2 bg-emerald-600 rounded-lg text-xs font-bold text-white cursor-pointer"
                      >
                        Submit Correction Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: 26-QUESTION DOORSTEP SURVEY WIZARD (MODULE 5)      */}
          {/* ========================================================= */}
          {surveyModalVoter && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col justify-end">
              <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-4 max-h-[88%] flex flex-col space-y-3 animate-in slide-in-from-bottom">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="font-bold text-xs text-white">
                      Doorstep Survey: {surveyModalVoter.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      House #{surveyModalVoter.houseNo} • Booth {surveyModalVoter.boothNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => setSurveyModalVoter(null)}
                    className="p-1 rounded-full bg-slate-800 text-slate-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto text-xs pr-1">
                  {/* Step 1: Sentiment */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      1. Citizen Sentiment Leaning
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["Supporter", "Doubtful", "Opponent", "Neutral"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSurveySentiment(s)}
                          className={`p-2 rounded-lg font-bold text-xs border text-center transition-all cursor-pointer ${
                            surveySentiment === s
                              ? "bg-emerald-600 border-emerald-400 text-white"
                              : "bg-slate-950 border-slate-800 text-slate-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Welfare Schemes */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      2. Government Scheme Beneficiary
                    </label>
                    <div className="space-y-1">
                      {["Ladki Bahin Yojana", "PM Awas Yojana", "Ayushman Bharat", "Ration Scheme"].map(
                        (scheme) => {
                          const isChecked = surveySchemes.includes(scheme);
                          return (
                            <button
                              key={scheme}
                              onClick={() => {
                                setSurveySchemes((prev) =>
                                  isChecked ? prev.filter((x) => x !== scheme) : [...prev, scheme]
                                );
                              }}
                              className={`w-full p-2 rounded-lg border text-left flex items-center justify-between text-[11px] font-medium cursor-pointer ${
                                isChecked
                                  ? "bg-indigo-950/60 border-indigo-700 text-indigo-200"
                                  : "bg-slate-950 border-slate-800 text-slate-400"
                              }`}
                            >
                              <span>{scheme}</span>
                              {isChecked && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Step 3: GPS Geotag Verification */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                      <span>GPS Telemetry Verification</span>
                      <span className="text-emerald-400 font-mono">GPS_VERIFIED</span>
                    </div>
                    <div className="text-xs font-mono text-cyan-300">
                      Lat: 18.5196° N, Lng: 73.8553° E (Accuracy: 4.2m)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Geotag locks visit authenticity for War Room integrity.
                    </div>
                  </div>
                </div>

                {/* Submit Survey Button */}
                <button
                  onClick={() => {
                    setVoterList((prev) =>
                      prev.map((v) =>
                        v.id === surveyModalVoter.id
                          ? { ...v, isVisited: true, classification: surveySentiment as any }
                          : v
                      )
                    );
                    setSurveyModalVoter(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 font-bold text-xs text-white shadow-md cursor-pointer"
                >
                  Save & Geotag Survey (जतन करा)
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: ECI VOTER SLIP & THERMAL PRINTER (MODULE 6)        */}
          {/* ========================================================= */}
          {slipModalVoter && (
            <div className="absolute inset-0 bg-black/85 z-50 flex flex-col justify-end">
              <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-4 max-h-[90%] flex flex-col space-y-3 animate-in slide-in-from-bottom">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-blue-400" />
                    <h3 className="font-bold text-xs text-white">Voter Slip (मतदार माहिती पावती)</h3>
                  </div>
                  <button
                    onClick={() => setSlipModalVoter(null)}
                    className="p-1 rounded-full bg-slate-800 text-slate-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Thermal Slip Preview Frame */}
                <div className="bg-white text-slate-900 p-4 rounded-xl shadow-inner font-mono text-xs space-y-2 border border-slate-300 max-w-[320px] mx-auto w-full">
                  <div className="text-center border-b border-slate-300 pb-1.5">
                    <div className="font-bold text-sm tracking-tight">मतदार माहिती पावती</div>
                    <div className="text-[10px] text-slate-600">
                      २१५ - कसबा पेठ विधानसभा मतदारसंघ
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">मतदाराचे नाव:</span>
                      <strong className="text-slate-900">{slipModalVoter.marathiName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">English:</span>
                      <span>{slipModalVoter.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">मतदार ओळखपत्र (EPIC):</span>
                      <strong className="font-bold">{slipModalVoter.epicId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">यादी भाग / खोली क्र.:</span>
                      <span>भाग क्र. {slipModalVoter.boothNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">यादीतील अनुक्रमांक:</span>
                      <strong className="text-base font-black text-indigo-700"># ०४२</strong>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-100 rounded text-[10px] text-center border border-slate-200">
                    <div className="font-bold">मतदान केंद्र:</div>
                    <div>न्यू इंग्लिश स्कूल, शनिवार पेठ, पुणे - ४११०३०</div>
                  </div>

                  <div className="text-center pt-1 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                    आपला नम्र: <strong>आनंद शिंदे</strong> (उमेदवार)
                  </div>
                </div>

                {/* Slip Format & Paper Size Toggles */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 font-bold text-[11px]">Paper Width:</span>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setSlipPaperSize("58mm")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        slipPaperSize === "58mm" ? "bg-blue-600 text-white" : "text-slate-400"
                      }`}
                    >
                      58mm (Pocket)
                    </button>
                    <button
                      onClick={() => setSlipPaperSize("80mm")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        slipPaperSize === "80mm" ? "bg-blue-600 text-white" : "text-slate-400"
                      }`}
                    >
                      80mm (Counter)
                    </button>
                  </div>
                </div>

                {/* Print & Share Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsPrintingAnimation(true);
                      setTimeout(() => {
                        setIsPrintingAnimation(false);
                        alert("Slip sent to Bluetooth Thermal Printer TP-5801.");
                        setSlipModalVoter(null);
                      }, 1200);
                    }}
                    disabled={isPrintingAnimation}
                    className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isPrintingAnimation ? "Printing..." : "Print Thermal Slip"}</span>
                  </button>

                  <button
                    onClick={() => {
                      alert("Opening WhatsApp with digital chit link for " + slipModalVoter.name);
                      setSlipModalVoter(null);
                    }}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: CIVIC GRIEVANCE DESK + VOICE NOTE (MODULE 7)       */}
          {/* ========================================================= */}
          {isCreateIssueOpen && (
            <div className="absolute inset-0 bg-black/85 z-50 flex flex-col justify-end">
              <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-4 max-h-[88%] flex flex-col space-y-3 animate-in slide-in-from-bottom">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <h3 className="font-bold text-xs text-white">+ Raise Civic Grievance</h3>
                  </div>
                  <button
                    onClick={() => setIsCreateIssueOpen(false)}
                    className="p-1 rounded-full bg-slate-800 text-slate-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto text-xs pr-1">
                  {/* Category Grid */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Problem Category
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(
                        [
                          "Water Supply",
                          "Road Infrastructure",
                          "Sanitation",
                          "Pension / Scheme",
                          "Electricity",
                          "Other",
                        ] as const
                      ).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setIssueCategory(cat)}
                          className={`p-2 rounded-lg text-left text-[11px] font-semibold border cursor-pointer ${
                            issueCategory === cat
                              ? "bg-orange-600/30 border-orange-500 text-orange-200"
                              : "bg-slate-950 border-slate-800 text-slate-400"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 60-Second Audio Voice Recorder */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                      <span>Audio Voice Note Memo (नागरिकाचा ऑडिओ)</span>
                      <span className="font-mono text-cyan-400">
                        00:{voiceRecordSeconds < 10 ? `0${voiceRecordSeconds}` : voiceRecordSeconds} / 01:00
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (isRecordingVoice) {
                            setIsRecordingVoice(false);
                            setHasRecordedVoice(true);
                          } else {
                            setIsRecordingVoice(true);
                            setVoiceRecordSeconds(0);
                            setHasRecordedVoice(false);
                          }
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isRecordingVoice
                            ? "bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/50"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                        }`}
                      >
                        {isRecordingVoice ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5 text-red-400" />
                        )}
                      </button>

                      <div className="flex-1">
                        {isRecordingVoice ? (
                          <div className="text-[11px] text-red-400 font-bold animate-pulse">
                            ● Recording citizen complaint... Tap mic to stop.
                          </div>
                        ) : hasRecordedVoice ? (
                          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Voice Memo Attached (00:{voiceRecordSeconds}s)</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400">
                            Tap mic to record 60-second voice note for illiterate citizens.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes Text */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Written Description
                    </label>
                    <textarea
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Enter specific landmark, street, or resident complaints..."
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-hidden focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Submit Ticket */}
                <button
                  onClick={() => {
                    const newTicket: IssueTicket = {
                      id: `iss-${Date.now().toString().slice(-4)}`,
                      ticketNumber: `TCK-${Date.now().toString().slice(-4)}`,
                      voterId: null,
                      voterName: "Citizen",
                      voterPhone: "9822100000",
                      voterBooth: "101",
                      karyakartaId: "KAR-2026-001",
                      karyakartaName: "Sachin D. Mane",
                      category: issueCategory,
                      description: issueDescription || "Reported via mobile field app",
                      priority: "URGENT",
                      status: "NEW",
                      assignedTo: "War Room Desk",
                      createdAt: "Just now",
                      updatedAt: "Just now",
                      resolutionNotes: null,
                      followUps: [],
                    };
                    setIssuesList((prev) => [newTicket, ...prev]);
                    setIsCreateIssueOpen(false);
                    alert("Ticket logged successfully and transmitted to Candidate War Room!");
                  }}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-xs text-white shadow-md cursor-pointer"
                >
                  Log Grievance to War Room (तक्रार दाखल करा)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
