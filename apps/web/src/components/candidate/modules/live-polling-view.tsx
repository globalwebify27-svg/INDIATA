"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Radio,
  Clock,
  Calendar,
  Building2,
  Users,
  ArrowRight,
  Search,
  Bell,
  History,
  TrendingUp,
  FileSpreadsheet,
  X,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { apiFetch } from "@/lib/api-client";

// ============================================================================
// DATA MODELS & TELEMETRY DEFINITIONS
// ============================================================================

interface TimeCheckpoint {
  time: string;
  percentage: number;
  votes: number;
  delta: string;
  surge: string;
}

interface BoothTurnoutRecord {
  boothNumber: number;
  name: string;
  locality: string;
  totalVoters: number;
  bloName: string;
  bloPhone: string;
  karyakartaCount: number;
  slipDeliveryPct: number;
  projectedTurnout: number;
  lastTurnout: number;
  votesCast: number;
  remainingVoters: number;
  liveTurnoutPct: number;
  grade: "A" | "B" | "C" | "D";
}

interface HistoricalElection {
  id: string;
  title: string;
  date: string;
  type: string;
  registeredVoters: number;
  votesCast: number;
  finalPercentage: number;
  totalBooths: number;
  winnerMargin: string;
  notificationLogsCount: number;
}

// ============================================================================
// INITIAL STATIC REFERENCE DATA
// ============================================================================

const TIME_CHECKPOINTS: TimeCheckpoint[] = [
  { time: "07:00 AM", percentage: 4.6, votes: 433, delta: "+4.6%", surge: "+4.6%" },
  { time: "09:00 AM", percentage: 12.6, votes: 1191, delta: "+8.0%", surge: "+8%" },
  { time: "11:00 AM", percentage: 23.5, votes: 2219, delta: "+10.9%", surge: "+10.9%" },
  { time: "01:00 PM", percentage: 34.3, votes: 3247, delta: "+10.8%", surge: "+10.8%" },
  { time: "03:00 PM", percentage: 44.1, votes: 4167, delta: "+9.8%", surge: "+9.8%" },
  { time: "05:00 PM", percentage: 53.8, votes: 5087, delta: "+9.7%", surge: "+9.7%" },
  { time: "06:00 PM", percentage: 57.2, votes: 5412, delta: "+3.4%", surge: "+3.4%" },
];

const INITIAL_BOOTHS: BoothTurnoutRecord[] = [
  {
    boothNumber: 101,
    name: "Navbharat High School, Room 1",
    locality: "Kothrud Depot Road",
    totalVoters: 1142,
    bloName: "Sanjay K. Kulkarni",
    bloPhone: "+91 98220 11234",
    karyakartaCount: 5,
    slipDeliveryPct: 92,
    projectedTurnout: 74.0,
    lastTurnout: 68.4,
    votesCast: 783,
    remainingVoters: 359,
    liveTurnoutPct: 68.5,
    grade: "A",
  },
  {
    boothNumber: 102,
    name: "Navbharat High School, Room 2",
    locality: "Kothrud Depot Road",
    totalVoters: 1205,
    bloName: "Asha V. More",
    bloPhone: "+91 98220 54321",
    karyakartaCount: 4,
    slipDeliveryPct: 88,
    projectedTurnout: 71.5,
    lastTurnout: 65.2,
    votesCast: 786,
    remainingVoters: 419,
    liveTurnoutPct: 65.2,
    grade: "A",
  },
  {
    boothNumber: 103,
    name: "Dr. Babasaheb Ambedkar Samaj Mandir",
    locality: "Paud Phata",
    totalVoters: 980,
    bloName: "Rameshwar P. Mane",
    bloPhone: "+91 94220 98765",
    karyakartaCount: 3,
    slipDeliveryPct: 74,
    projectedTurnout: 66.0,
    lastTurnout: 54.1,
    votesCast: 530,
    remainingVoters: 450,
    liveTurnoutPct: 54.1,
    grade: "B",
  },
  {
    boothNumber: 104,
    name: "Pune Municipal Primary School No. 18",
    locality: "Erandwane",
    totalVoters: 1350,
    bloName: "Geeta N. Salunkhe",
    bloPhone: "+91 98901 23456",
    karyakartaCount: 6,
    slipDeliveryPct: 68,
    projectedTurnout: 63.8,
    lastTurnout: 51.3,
    votesCast: 693,
    remainingVoters: 657,
    liveTurnoutPct: 51.3,
    grade: "B",
  },
  {
    boothNumber: 105,
    name: "Abasaheb Garware College, Hall B",
    locality: "Karve Road",
    totalVoters: 1480,
    bloName: "Dattatraya Shinde",
    bloPhone: "+91 97632 11098",
    karyakartaCount: 3,
    slipDeliveryPct: 58,
    projectedTurnout: 58.2,
    lastTurnout: 48.9,
    votesCast: 724,
    remainingVoters: 756,
    liveTurnoutPct: 48.9,
    grade: "C",
  },
  {
    boothNumber: 106,
    name: "Modern High School, Wing A",
    locality: "Shivajinagar Gaothan",
    totalVoters: 1120,
    bloName: "Nitin B. Jagtap",
    bloPhone: "+91 98505 44321",
    karyakartaCount: 4,
    slipDeliveryPct: 85,
    projectedTurnout: 73.4,
    lastTurnout: 69.1,
    votesCast: 774,
    remainingVoters: 346,
    liveTurnoutPct: 69.1,
    grade: "A",
  },
  {
    boothNumber: 107,
    name: "Ferguson Junior College Library",
    locality: "FC Road",
    totalVoters: 1290,
    bloName: "Madhavi R. Joshi",
    bloPhone: "+91 98231 77654",
    karyakartaCount: 5,
    slipDeliveryPct: 90,
    projectedTurnout: 75.8,
    lastTurnout: 62.4,
    votesCast: 802,
    remainingVoters: 488,
    liveTurnoutPct: 62.2,
    grade: "A",
  },
  {
    boothNumber: 108,
    name: "Deccan Education Society School",
    locality: "Deccan Gymkhana",
    totalVoters: 890,
    bloName: "Pravin S. Gaikwad",
    bloPhone: "+91 99221 00987",
    karyakartaCount: 2,
    slipDeliveryPct: 45,
    projectedTurnout: 48.0,
    lastTurnout: 49.5,
    votesCast: 320,
    remainingVoters: 570,
    liveTurnoutPct: 36.0,
    grade: "D",
  },
];

const HISTORICAL_ELECTIONS: HistoricalElection[] = [
  {
    id: "HIST-2024-LS",
    title: "18th Lok Sabha General Parliamentary Elections 2024",
    date: "13 May 2024",
    type: "Lok Sabha (Parliamentary)",
    registeredVoters: 2045000,
    votesCast: 1398780,
    finalPercentage: 68.4,
    totalBooths: 1982,
    winnerMargin: "+48,290 votes (Won)",
    notificationLogsCount: 48,
  },
  {
    id: "HIST-2019-VS",
    title: "Maharashtra Legislative Assembly General Election 2019",
    date: "21 October 2019",
    type: "Vidhan Sabha (Assembly)",
    registeredVoters: 278000,
    votesCast: 178476,
    finalPercentage: 64.2,
    totalBooths: 245,
    winnerMargin: "+12,410 votes (Won)",
    notificationLogsCount: 36,
  },
  {
    id: "HIST-2019-LS",
    title: "17th Lok Sabha General Parliamentary Elections 2019",
    date: "23 April 2019",
    type: "Lok Sabha (Parliamentary)",
    registeredVoters: 1950000,
    votesCast: 1271400,
    finalPercentage: 65.2,
    totalBooths: 1890,
    winnerMargin: "+96,500 votes (Won)",
    notificationLogsCount: 42,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LivePollingView() {
  const { showToast } = useToast();

  // Navigation: LIVE | NOTIFICATIONS | HISTORY
  const [activeTab, setActiveTab] = useState<"LIVE" | "NOTIFICATIONS" | "HISTORY">("LIVE");

  // State Management
  const [lifecycleState, setLifecycleState] = useState<string>("Active: Day 1 (28h left)");
  const [perspective, setPerspective] = useState<string>("Entire Constituency (Consolidated)");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<"ALL" | "A" | "B" | "C" | "D">("ALL");
  const [turnoutRangeFilter, setTurnoutRangeFilter] = useState<string>("ALL");
  const [bloFilter, setBloFilter] = useState<string>("ALL");

  // Notifications State
  const [inAppFrequency, setInAppFrequency] = useState<"15_MIN" | "30_MIN" | "60_MIN" | "2_HOURS">("30_MIN");
  const [emailFrequency, setEmailFrequency] = useState<"15_MIN" | "30_MIN" | "60_MIN" | "2_HOURS">("60_MIN");
  const [inAppEnabled, setInAppEnabled] = useState<boolean>(true);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const [notifyCandidateAdmin, setNotifyCandidateAdmin] = useState<boolean>(true);
  const [notifyWarRoomDesk, setNotifyWarRoomDesk] = useState<boolean>(true);
  const [notifyBoothCoordinators, setNotifyBoothCoordinators] = useState<boolean>(true);
  const [notifyMobilizers, setNotifyMobilizers] = useState<boolean>(false);
  const [categoryOverallTurnout, setCategoryOverallTurnout] = useState<boolean>(true);
  const [categoryBoothWise, setCategoryBoothWise] = useState<boolean>(true);
  const [categoryLowTurnoutAlerts, setCategoryLowTurnoutAlerts] = useState<boolean>(true);
  const [categoryCriticalGrievances, setCategoryCriticalGrievances] = useState<boolean>(true);
  const [categoryFinalReport, setCategoryFinalReport] = useState<boolean>(true);

  // Selected Historical Election
  const [selectedHistoricalElection, setSelectedHistoricalElection] = useState<HistoricalElection | null>(null);

  // Dynamic Telemetry & Booth Data
  const [booths, setBooths] = useState<BoothTurnoutRecord[]>(INITIAL_BOOTHS);
  const [checkpoints, setCheckpoints] = useState<TimeCheckpoint[]>(TIME_CHECKPOINTS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync Telemetry from backend if available
  useEffect(() => {
    let isMounted = true;
    async function loadTelemetry() {
      try {
        const [telRes, boothsRes] = await Promise.allSettled([
          apiFetch<any>("/polling/live"),
          apiFetch<any>("/polling/booths"),
        ]);

        if (telRes.status === "fulfilled" && telRes.value?.data && isMounted) {
          const data = telRes.value.data;
          if (Array.isArray(data.timeSlots) && data.timeSlots.length > 0) {
            setCheckpoints(
              data.timeSlots.map((ts: any) => ({
                time: ts.time,
                percentage: ts.percentage,
                votes: ts.cumulativeVotes || ts.votes,
                delta: ts.delta || "+0.0%",
                surge: ts.delta || "+0.0%",
              }))
            );
          }
        }

        if (boothsRes.status === "fulfilled" && Array.isArray(boothsRes.value?.data) && isMounted) {
          if (boothsRes.value.data.length > 0) {
            setBooths(
              boothsRes.value.data.map((b: any, idx: number) => ({
                boothNumber: b.boothNumber || 101 + idx,
                name: b.name || "Polling Station",
                locality: b.locality || "Pune",
                totalVoters: b.registeredVoters || 1000,
                bloName: b.assignedAgent || "Officer",
                bloPhone: b.agentPhone || "+91 98000 00000",
                karyakartaCount: b.cadreCount || 4,
                slipDeliveryPct: b.slipDeliveryPct || 85,
                projectedTurnout: b.projectedTurnout || 70.0,
                lastTurnout: b.historical2024Turnout || 65.0,
                votesCast: b.votesCast || 600,
                remainingVoters: b.remainingVoters || 400,
                liveTurnoutPct: b.turnoutPercentage || 60.0,
                grade: b.grade || (b.turnoutPercentage >= 60 ? "A" : b.turnoutPercentage >= 50 ? "B" : "C"),
              }))
            );
          }
        }
      } catch {
        // Fallback to static reference data gracefully
      }
    }
    loadTelemetry();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Booths
  const filteredBooths = useMemo(() => {
    return booths.filter((booth) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        booth.name.toLowerCase().includes(q) ||
        booth.locality.toLowerCase().includes(q) ||
        booth.bloName.toLowerCase().includes(q) ||
        booth.boothNumber.toString().includes(q) ||
        `#${booth.boothNumber}`.includes(q);

      const matchGrade = selectedGrade === "ALL" || booth.grade === selectedGrade;

      let matchTurnout = true;
      if (turnoutRangeFilter === "HIGH") {
        matchTurnout = booth.liveTurnoutPct >= 60;
      } else if (turnoutRangeFilter === "MID") {
        matchTurnout = booth.liveTurnoutPct >= 45 && booth.liveTurnoutPct < 60;
      } else if (turnoutRangeFilter === "LOW") {
        matchTurnout = booth.liveTurnoutPct < 45;
      }

      const matchBlo = bloFilter === "ALL" || booth.bloName === bloFilter;

      return matchSearch && matchGrade && matchTurnout && matchBlo;
    });
  }, [booths, searchQuery, selectedGrade, turnoutRangeFilter, bloFilter]);

  // Aggregate Key Metrics (calculated dynamically from current booth records)
  const totalRegistered = useMemo(() => booths.reduce((acc, b) => acc + b.totalVoters, 0), [booths]);
  const totalVotesCast = useMemo(() => booths.reduce((acc, b) => acc + b.votesCast, 0), [booths]);
  const totalRemaining = useMemo(() => booths.reduce((acc, b) => acc + b.remainingVoters, 0), [booths]);
  const overallVotingPct = totalRegistered > 0 ? ((totalVotesCast / totalRegistered) * 100).toFixed(1) : "57.2";
  const verifiedTurnoutPct = "56.3%";

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGrade("ALL");
    setTurnoutRangeFilter("ALL");
    setBloFilter("ALL");
    showToast("info", "Filters Cleared", "Table restored to default view displaying all 8 polling stations.");
  };

  // Sync Action Handler
  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast("success", "ECI Cadre Live Sync", "Polling station counts, BLO stamps, and voter turnout records refreshed.");
    }, 600);
  };

  // Reset Demo Data
  const handleResetDemo = () => {
    setBooths(INITIAL_BOOTHS);
    setCheckpoints(TIME_CHECKPOINTS);
    setLifecycleState("Active: Day 1 (28h left)");
    handleResetFilters();
    showToast("info", "Demo Restored", "Telemetry and checkpoint figures reset to baseline simulation.");
  };

  // Save Notifications Handler
  const handleSaveNotificationSettings = () => {
    showToast(
      "success",
      "Notification Dispatch Synced",
      `In-App: ${inAppFrequency.replace("_", " ")}, Email: ${emailFrequency.replace("_", " ")}. Push dispatcher operational.`
    );
  };

  const handleExportData = (type: "PDF" | "EXCEL") => {
    showToast("info", `Exporting ${type} Report`, `ECI Turnout summary prepared for download.`);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-16">
      {/* ===================================================================== */}
      {/* 1. TOP STATUS BAR & HEADER SECTION                                    */}
      {/* ===================================================================== */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs space-y-4">
        {/* Top Badges & Right Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE POLLING ACTIVE (2-DAY WINDOW)</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium">
              • 34 - Pune Parliamentary Constituency
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncTelemetry}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#1B2638] hover:bg-slate-50 dark:hover:bg-[#202D40] text-slate-700 dark:text-[#F8FAFC] text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 dark:text-[#94A3B8] ${isSyncing ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>
            <button
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#1B2638] hover:bg-slate-50 dark:hover:bg-[#202D40] text-slate-700 dark:text-[#F8FAFC] text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-[#94A3B8]" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              Live Polling &amp; Turnout Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 dark:bg-[#2A1B4E] text-purple-700 dark:text-[#B892FF] border border-purple-200 dark:border-[#49307E]">
              ECI Cadre Sync Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
            Real-time polling station turnout, time-wise voting progression, BLO reporting verification, and post-poll historical archives.
          </p>
        </div>

        {/* Nested Availability & Countdown Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200 dark:border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-start sm:items-center gap-2.5 text-xs">
              <Calendar className="w-4 h-4 text-purple-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-[#64748B] uppercase tracking-wider block">
                  ELECTION DATE &amp; AVAILABILITY PERIOD
                </span>
                <span className="font-semibold text-slate-800 dark:text-[#F8FAFC]">
                  19 Nov 2024, 07:00 AM – 21 Nov 2024, 07:00 AM (48 Hours Max)
                </span>
              </div>
            </div>

            <div className="flex items-start sm:items-center gap-2.5 text-xs">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-[#64748B] uppercase tracking-wider block">
                  LIVE POLLING WINDOW COUNTDOWN
                </span>
                <span className="font-semibold text-slate-800 dark:text-[#F8FAFC]">
                  28 hours, 15 minutes remaining (Day 1 of 2 (Polling Day Active))
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium">Lifecycle State:</span>
            <div className="relative">
              <select
                value={lifecycleState}
                onChange={(e) => setLifecycleState(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#151E2D] text-slate-800 dark:text-[#F8FAFC] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#635BFF] cursor-pointer"
              >
                <option value="Active: Day 1 (28h left)">Active: Day 1 (28h left)</option>
                <option value="Active: Day 2 (Final Hours)">Active: Day 2 (Final Hours)</option>
                <option value="Concluded (Archive Mode)">Concluded (Archive Mode)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. PRIMARY NAVIGATION TABS (Strict Requirement: 3 Tabs)              */}
      {/* ===================================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#29364A] pb-2">
        <button
          onClick={() => setActiveTab("LIVE")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "LIVE"
              ? "bg-[#635BFF] text-white shadow-xs"
              : "text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1B2638]"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Live Dashboard</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
        </button>

        <button
          onClick={() => setActiveTab("NOTIFICATIONS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "NOTIFICATIONS"
              ? "bg-[#635BFF] text-white shadow-xs"
              : "text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1B2638]"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notification Settings</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
            In-App &amp; Email
          </span>
        </button>

        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "HISTORY"
              ? "bg-[#635BFF] text-white shadow-xs"
              : "text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1B2638]"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Election History</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-[#1E293B] text-slate-700 dark:text-[#94A3B8]">
            3 Records
          </span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: LIVE DASHBOARD VIEW                                            */}
      {/* ===================================================================== */}
      {activeTab === "LIVE" && (
        <div className="space-y-5">
          {/* 7 KPI SUMMARY METRIC CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* 1. TOTAL REGISTERED */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                  TOTAL REGISTERED
                </span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-[#2A1B4E] flex items-center justify-center text-purple-600 dark:text-[#B892FF]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">
                {totalRegistered.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-[#64748B] mt-1">100% Electoral Roll</span>
            </div>

            {/* 2. VOTES CAST */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                  VOTES CAST
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {totalVotesCast.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-medium mt-1">
                {overallVotingPct}% Cast so far
              </span>
            </div>

            {/* 3. PENDING VOTERS */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                  PENDING VOTERS
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-amber-500 dark:text-amber-400">
                {totalRemaining.toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400/80 font-medium mt-1">
                {(100 - parseFloat(overallVotingPct)).toFixed(1)}% Yet to Vote
              </span>
            </div>

            {/* 4. VOTING % */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                  VOTING %
                </span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-indigo-600 dark:text-[#818CF8]">
                {overallVotingPct}%
              </div>
              <span className="text-[10px] text-slate-400 dark:text-[#64748B] mt-1">(Cast / Total) × 100</span>
            </div>

            {/* 5. TOTAL BOOTHS */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                  TOTAL BOOTHS
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-slate-600 dark:text-[#94A3B8]">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">
                {booths.length}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-[#64748B] mt-1">Constituency Matrix</span>
            </div>

            {/* 6. BOOTHS LIVE */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                  BOOTHS LIVE
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Radio className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {booths.length} / {booths.length}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                100% Online
              </span>
            </div>

            {/* 7. VERIFIED TURNOUT */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                  VERIFIED TURNOUT
                </span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-[#2A1B4E] flex items-center justify-center text-purple-600 dark:text-[#B892FF]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-purple-600 dark:text-[#C084FC]">
                {verifiedTurnoutPct}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-[#64748B] mt-1">ECI Serial Audited</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* TIME-WISE VOTING PROGRESSION & TURNOUT VELOCITY AREA CHART        */}
          {/* ================================================================= */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#29364A] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-sm sm:text-base">
                    Time-wise Voting Progression &amp; Turnout Velocity
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-[#2A1B4E] text-purple-700 dark:text-[#B892FF] border border-purple-200 dark:border-[#49307E]">
                    ECI Checkpoints
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
                  Cumulative turnout curve across standard reporting checkpoints with incremental surge velocity.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs text-slate-500 dark:text-[#94A3B8]">Perspective:</span>
                <div className="relative">
                  <select
                    value={perspective}
                    onChange={(e) => setPerspective(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1 rounded-xl border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#1B2638] text-slate-800 dark:text-[#F8FAFC] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#635BFF] cursor-pointer"
                  >
                    <option value="Entire Constituency (Consolidated)">Entire Constituency (Consolidated)</option>
                    <option value="Urban Cluster Only">Urban Cluster Only</option>
                    <option value="Peri-Urban &amp; Semi-Rural">Peri-Urban &amp; Semi-Rural</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* High-Fidelity SVG Area Curve Chart */}
            <div className="w-full overflow-x-auto pt-2 pb-1">
              <div className="min-w-[680px] h-[220px] relative select-none">
                <svg className="w-full h-full" viewBox="0 0 1000 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="turnoutAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[
                    { label: "100%", y: 25 },
                    { label: "75%", y: 65 },
                    { label: "50%", y: 105 },
                    { label: "25%", y: 145 },
                    { label: "0%", y: 185 },
                  ].map((grid, idx) => (
                    <g key={idx}>
                      <text
                        x="35"
                        y={grid.y + 3}
                        className="text-[10px] fill-slate-400 dark:fill-[#64748B] font-mono text-right"
                        textAnchor="end"
                      >
                        {grid.label}
                      </text>
                      <line
                        x1="45"
                        y1={grid.y}
                        x2="980"
                        y2={grid.y}
                        stroke="currentColor"
                        strokeDasharray="3 3"
                        className="text-slate-200 dark:text-[#1E293B]"
                        strokeWidth="1"
                      />
                    </g>
                  ))}

                  {/* Area Fill */}
                  <path
                    d="M 60 178 C 120 170, 160 162, 210 162 C 270 162, 300 144, 360 144 C 420 144, 450 128, 510 128 C 570 128, 600 114, 660 114 C 720 114, 760 99, 810 99 C 870 99, 900 93, 960 93 L 960 185 L 60 185 Z"
                    fill="url(#turnoutAreaGradient)"
                  />

                  {/* Smooth Curved Line */}
                  <path
                    d="M 60 178 C 120 170, 160 162, 210 162 C 270 162, 300 144, 360 144 C 420 144, 450 128, 510 128 C 570 128, 600 114, 660 114 C 720 114, 760 99, 810 99 C 870 99, 900 93, 960 93"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />

                  {/* Checkpoint Nodes & Floating Tags */}
                  {[
                    { x: 60, y: 178, pct: "4.6%", time: "07:00 AM" },
                    { x: 210, y: 162, pct: "12.6%", time: "09:00 AM" },
                    { x: 360, y: 144, pct: "23.5%", time: "11:00 AM" },
                    { x: 510, y: 128, pct: "34.3%", time: "01:00 PM" },
                    { x: 660, y: 114, pct: "44.1%", time: "03:00 PM" },
                    { x: 810, y: 99, pct: "53.8%", time: "05:00 PM" },
                    { x: 960, y: 93, pct: "57.2%", time: "06:00 PM" },
                  ].map((node, i) => (
                    <g key={i}>
                      {/* Floating percentage label directly above point */}
                      <text
                        x={node.x}
                        y={node.y - 10}
                        textAnchor="middle"
                        className="text-[11px] font-black fill-slate-800 dark:fill-white font-mono"
                      >
                        {node.pct}
                      </text>
                      {/* Node Circle Outer Glow */}
                      <circle cx={node.x} cy={node.y} r="6" fill="#3B82F6" fillOpacity="0.4" />
                      {/* Node Circle Outer Ring */}
                      <circle cx={node.x} cy={node.y} r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                      {/* X-axis time label below */}
                      <text
                        x={node.x}
                        y="204"
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-slate-400 dark:fill-[#94A3B8]"
                      >
                        {node.time}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* 7 Checkpoint Metric Boxes (Below Chart) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
              {checkpoints.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-[#29364A] bg-slate-50/70 dark:bg-[#0B101A] transition-all hover:border-blue-500/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8]">{slot.time}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">{slot.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 dark:border-[#1E293B]">
                    <span className="text-[10px] text-slate-400 dark:text-[#64748B]">
                      {slot.votes.toLocaleString()} votes
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400">
                      {slot.surge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================================================================= */}
          {/* POLLING STATION TURNOUT INTELLIGENCE TABLE (10 Columns Embedded)  */}
          {/* ================================================================= */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs space-y-4">
            {/* Table Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-sm sm:text-base">
                    Polling Station Turnout Intelligence Table
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-[#94A3B8] border border-slate-200 dark:border-[#29364A]">
                    {filteredBooths.length} Stations Found
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
                  Complete 13-metric audit including BLO phone, karyakartas, slip delivery, projected vs live turnout, and elector inspection.
                </p>
              </div>

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-indigo-600 dark:text-[#818CF8] hover:underline self-start sm:self-center cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
                {/* Search Input */}
                <div className="relative min-w-[240px] sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search booth #, station, locality..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] bg-slate-50 dark:bg-[#0B101A] text-slate-800 dark:text-[#F8FAFC] text-xs placeholder:text-slate-400 dark:placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>

                {/* Grade Filter Pills */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0B101A] border border-slate-200 dark:border-[#29364A]">
                  {(["ALL", "A", "B", "C", "D"] as const).map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedGrade === grade
                          ? "bg-[#635BFF] text-white shadow-xs"
                          : "text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {grade === "ALL" ? "All" : `Grade ${grade}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Turnout Range Dropdown */}
                <div className="relative">
                  <select
                    value={turnoutRangeFilter}
                    onChange={(e) => setTurnoutRangeFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#0B101A] text-slate-800 dark:text-[#F8FAFC] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#635BFF] cursor-pointer"
                  >
                    <option value="ALL">Turnout: All Ranges</option>
                    <option value="HIGH">High (&gt;= 60%)</option>
                    <option value="MID">Moderate (45-60%)</option>
                    <option value="LOW">Lagging (&lt; 45%)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* BLO Officer Dropdown */}
                <div className="relative">
                  <select
                    value={bloFilter}
                    onChange={(e) => setBloFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#0B101A] text-slate-800 dark:text-[#F8FAFC] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#635BFF] cursor-pointer"
                  >
                    <option value="ALL">All Assigned BLO Officers</option>
                    {booths.map((b) => (
                      <option key={b.boothNumber} value={b.bloName}>
                        {b.bloName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Embedded 10-Column Table Container */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#29364A]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-[#101827] text-slate-500 dark:text-[#94A3B8] text-[10px] uppercase font-bold tracking-wider border-b border-slate-200 dark:border-[#29364A]">
                  <tr>
                    <th className="py-3 px-3.5 whitespace-nowrap">BOOTH #</th>
                    <th className="py-3 px-3.5 min-w-[200px]">POLLING STATION &amp; LOCALITY</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">TOTAL</th>
                    <th className="py-3 px-3.5 min-w-[170px]">BLO INCHARGE</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">KARYAKARTAS</th>
                    <th className="py-3 px-3.5 min-w-[130px]">SLIP DELIVERY</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">PROJECTED</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">VOTES CAST</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">REMAINING</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">LIVE TURNOUT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#29364A]">
                  {filteredBooths.map((booth) => {
                    const isSlipHigh = booth.slipDeliveryPct >= 80;
                    const isTurnoutHigh = booth.liveTurnoutPct >= 60;
                    const isTurnoutMid = booth.liveTurnoutPct >= 45 && booth.liveTurnoutPct < 60;

                    return (
                      <tr
                        key={booth.boothNumber}
                        className="border-b border-slate-200 dark:border-[#29364A] hover:bg-slate-50 dark:hover:bg-[#1E293B]/70 transition-colors"
                      >
                        {/* 1. Booth Number */}
                        <td className="py-3.5 px-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          #{booth.boothNumber}
                        </td>

                        {/* 2. Station & Locality */}
                        <td className="py-3.5 px-3.5">
                          <span className="font-bold text-slate-900 dark:text-white block">{booth.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] mt-0.5 block">
                            {booth.locality}
                          </span>
                        </td>

                        {/* 3. Total */}
                        <td className="py-3.5 px-3.5 font-semibold text-slate-800 dark:text-[#F8FAFC]">
                          {booth.totalVoters.toLocaleString()}
                        </td>

                        {/* 4. BLO Incharge */}
                        <td className="py-3.5 px-3.5">
                          <span className="font-bold text-slate-900 dark:text-white block">{booth.bloName}</span>
                          <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-mono mt-0.5 block">
                            {booth.bloPhone}
                          </span>
                        </td>

                        {/* 5. Karyakartas */}
                        <td className="py-3.5 px-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 dark:bg-[#2A1B4E] text-purple-700 dark:text-[#B892FF] border border-purple-200 dark:border-[#49307E]">
                            {booth.karyakartaCount} Cadre
                          </span>
                        </td>

                        {/* 6. Slip Delivery */}
                        <td className="py-3.5 px-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 dark:bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  isSlipHigh ? "bg-[#8B5CF6]" : "bg-amber-500"
                                }`}
                                style={{ width: `${booth.slipDeliveryPct}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white text-[11px]">
                              {booth.slipDeliveryPct}%
                            </span>
                          </div>
                        </td>

                        {/* 7. Projected */}
                        <td className="py-3.5 px-3.5">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {booth.projectedTurnout}%
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] mt-0.5 block">
                            Last: {booth.lastTurnout}%
                          </span>
                        </td>

                        {/* 8. Votes Cast */}
                        <td className="py-3.5 px-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                          {booth.votesCast.toLocaleString()}
                        </td>

                        {/* 9. Remaining */}
                        <td className="py-3.5 px-3.5 font-bold text-amber-500 dark:text-amber-400">
                          {booth.remainingVoters.toLocaleString()}
                        </td>

                        {/* 10. Live Turnout Badge */}
                        <td className="py-3.5 px-3.5 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-black ${
                              isTurnoutHigh
                                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60"
                                : isTurnoutMid
                                ? "bg-purple-100 dark:bg-[#2A1B4E] text-purple-800 dark:text-[#C084FC] border border-purple-300 dark:border-[#49307E]"
                                : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60"
                            }`}
                          >
                            {booth.liveTurnoutPct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-[#29364A] text-xs">
              <span className="text-slate-500 dark:text-[#94A3B8]">
                Showing {filteredBooths.length} of {booths.length} Polling Stations
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="p-1 rounded-lg border border-slate-200 dark:border-[#29364A] text-slate-400 dark:text-[#64748B] opacity-50 cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-slate-700 dark:text-[#F8FAFC]">Page 1 of 1</span>
                <button
                  disabled
                  className="p-1 rounded-lg border border-slate-200 dark:border-[#29364A] text-slate-400 dark:text-[#64748B] opacity-50 cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: NOTIFICATION SETTINGS                                          */}
      {/* ===================================================================== */}
      {activeTab === "NOTIFICATIONS" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-[#29364A] pb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#635BFF]" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Live Polling Notification Dispatch Settings
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
              Configure real-time push and email broadcast frequencies, designated recipient roles, and alert thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Delivery Channels */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200 dark:border-[#1E293B]">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Delivery Channels &amp; Frequency</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">In-App Mobile Push Notifications</span>
                    <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">Delivered directly to Booth Agents and Coordinators</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={inAppEnabled}
                    onChange={(e) => setInAppEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#635BFF] rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">In-App Notification Frequency</label>
                  <select
                    value={inAppFrequency}
                    disabled={!inAppEnabled}
                    onChange={(e) => setInAppFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#151E2D] text-slate-800 dark:text-white font-semibold"
                  >
                    <option value="15_MIN">Every 15 Minutes</option>
                    <option value="30_MIN">Every 30 Minutes (Recommended)</option>
                    <option value="60_MIN">Every 60 Minutes (Hourly)</option>
                    <option value="2_HOURS">Every 2 Hours</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] flex items-center justify-between mt-4">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Email Intelligence Briefs</span>
                    <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">Consolidated analytical reports to campaign leadership</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#635BFF] rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Broadcast Frequency</label>
                  <select
                    value={emailFrequency}
                    disabled={!emailEnabled}
                    onChange={(e) => setEmailFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#151E2D] text-slate-800 dark:text-white font-semibold"
                  >
                    <option value="15_MIN">Every 15 Minutes</option>
                    <option value="30_MIN">Every 30 Minutes</option>
                    <option value="60_MIN">Every 60 Minutes (Recommended)</option>
                    <option value="2_HOURS">Every 2 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recipient Role Assignment */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200 dark:border-[#1E293B]">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Authorized Recipient Roles</span>
              </h3>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCandidateAdmin}
                    onChange={(e) => setNotifyCandidateAdmin(e.target.checked)}
                    className="rounded text-[#635BFF]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Candidate &amp; Chief of Staff</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#94A3B8]">Receives overall constituency summary &amp; highest/lowest booths</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyWarRoomDesk}
                    onChange={(e) => setNotifyWarRoomDesk(e.target.checked)}
                    className="rounded text-[#635BFF]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">War Room Intelligence Desk</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#94A3B8]">Receives real-time telemetry updates and anomaly alerts</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyBoothCoordinators}
                    onChange={(e) => setNotifyBoothCoordinators(e.target.checked)}
                    className="rounded text-[#635BFF]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Booth Coordinators</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#94A3B8]">Receives consolidated figures for their assigned booth clusters</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyMobilizers}
                    onChange={(e) => setNotifyMobilizers(e.target.checked)}
                    className="rounded text-[#635BFF]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Booth Agents &amp; Table Mobilizers</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#94A3B8]">Receives assigned booth metrics only (Strict RBAC isolation)</span>
                  </div>
                </label>
              </div>

              {/* Category Checkboxes */}
              <div className="pt-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Subscribed Event Categories</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#94A3B8]">
                    <input
                      type="checkbox"
                      checked={categoryOverallTurnout}
                      onChange={(e) => setCategoryOverallTurnout(e.target.checked)}
                      className="rounded text-[#635BFF]"
                    />
                    <span>Overall Turnout</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#94A3B8]">
                    <input
                      type="checkbox"
                      checked={categoryBoothWise}
                      onChange={(e) => setCategoryBoothWise(e.target.checked)}
                      className="rounded text-[#635BFF]"
                    />
                    <span>Booth Updates</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#94A3B8]">
                    <input
                      type="checkbox"
                      checked={categoryLowTurnoutAlerts}
                      onChange={(e) => setCategoryLowTurnoutAlerts(e.target.checked)}
                      className="rounded text-[#635BFF]"
                    />
                    <span>Low Turnout Alerts</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#94A3B8]">
                    <input
                      type="checkbox"
                      checked={categoryCriticalGrievances}
                      onChange={(e) => setCategoryCriticalGrievances(e.target.checked)}
                      className="rounded text-[#635BFF]"
                    />
                    <span>Critical Incidents</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#94A3B8]">
                    <input
                      type="checkbox"
                      checked={categoryFinalReport}
                      onChange={(e) => setCategoryFinalReport(e.target.checked)}
                      className="rounded text-[#635BFF]"
                    />
                    <span>Final Closing Report</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#29364A]">
            <button
              onClick={handleSaveNotificationSettings}
              className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249EC] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Notification Configuration
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: ELECTION HISTORY ARCHIVE                                       */}
      {/* ===================================================================== */}
      {activeTab === "HISTORY" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600 dark:text-[#B892FF]" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Statutory Election History Archive
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                Completed election live polling sessions are preserved in read-only audit mode with immutable turnout records.
              </p>
            </div>

            <button
              onClick={() => handleExportData("EXCEL")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Historical Dataset (XLSX)</span>
            </button>
          </div>

          {/* Historical Elections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HISTORICAL_ELECTIONS.map((hist) => (
              <div
                key={hist.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#151E2D] border border-slate-200 dark:border-[#29364A] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-[#2A1B4E] text-purple-700 dark:text-[#B892FF] border border-purple-200 dark:border-[#49307E]">
                    {hist.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-[#94A3B8]">{hist.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{hist.title}</h3>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200/70 dark:border-[#1E293B] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-[#94A3B8]">Final Turnout:</span>
                    <strong className="text-indigo-600 dark:text-[#818CF8]">{hist.finalPercentage}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-[#94A3B8]">Votes Cast:</span>
                    <strong className="text-slate-800 dark:text-white">
                      {hist.votesCast.toLocaleString()} / {hist.registeredVoters.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-[#94A3B8]">Total Booths:</span>
                    <strong className="text-slate-800 dark:text-white">{hist.totalBooths} Polling Stations</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-[#94A3B8]">Outcome Margin:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{hist.winnerMargin}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 dark:text-[#64748B]">
                    {hist.notificationLogsCount} Dispatch Logs
                  </span>
                  <button
                    onClick={() => setSelectedHistoricalElection(hist)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-[#818CF8] hover:underline cursor-pointer"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Drilldown Modal for Selected Historical Election */}
          {selectedHistoricalElection && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#151E2D] rounded-2xl border border-slate-200 dark:border-[#29364A] max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#29364A] pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {selectedHistoricalElection.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-[#94A3B8]">
                      Concluded: {selectedHistoricalElection.date} • Read-Only Preserved Archive
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedHistoricalElection(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200 dark:border-[#1E293B] text-center">
                    <span className="text-slate-400 dark:text-[#94A3B8] block text-[10px]">Turnout</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-[#818CF8]">
                      {selectedHistoricalElection.finalPercentage}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200 dark:border-[#1E293B] text-center">
                    <span className="text-slate-400 dark:text-[#94A3B8] block text-[10px]">Votes Cast</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {selectedHistoricalElection.votesCast.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200 dark:border-[#1E293B] text-center">
                    <span className="text-slate-400 dark:text-[#94A3B8] block text-[10px]">Total Booths</span>
                    <span className="text-lg font-black text-purple-600 dark:text-[#B892FF]">
                      {selectedHistoricalElection.totalBooths}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200 dark:border-[#1E293B] text-center">
                    <span className="text-slate-400 dark:text-[#94A3B8] block text-[10px]">Margin</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {selectedHistoricalElection.winnerMargin}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-[#0B101A] border border-blue-200 dark:border-[#1E293B] text-xs text-slate-700 dark:text-[#94A3B8]">
                  Historical turnout records are locked for statutory ECI compliance. All individual voter stamps and notification logs remain preserved.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleExportData("PDF")}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] text-xs font-bold text-slate-700 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#1B2638] cursor-pointer"
                  >
                    Download Dossier (PDF)
                  </button>
                  <button
                    onClick={() => setSelectedHistoricalElection(null)}
                    className="px-4 py-1.5 rounded-xl bg-[#635BFF] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
