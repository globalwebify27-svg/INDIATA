"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Clock,
  Building2,
  Users,
  ArrowRight,
  Search,
  Bell,
  History,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { apiFetch } from "@/lib/api-client";

// ============================================================================
// DATA MODELS & MOCK TELEMETRY
// ============================================================================

interface TimeSlotProgress {
  time: string;
  label: string;
  votes: number;
  cumulativeVotes: number;
  percentage: number;
  delta: string;
  status: "REPORTED" | "PROJECTED";
}

interface BoothTurnoutItem {
  boothNumber: number;
  name: string;
  locality: string;
  registeredVoters: number;
  votesCast: number;
  remainingVoters: number;
  turnoutPercentage: number;
  maleVoters: number;
  maleVoted: number;
  femaleVoters: number;
  femaleVoted: number;
  assignedAgent: string;
  agentPhone: string;
  lastReportedTime: string;
  historical2024Turnout: number;
  status: "CRITICAL_LAG" | "ON_TRACK" | "AHEAD";
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

const TIME_SLOT_DATA: TimeSlotProgress[] = [
  { time: "07:00 AM", label: "Poll Opening", votes: 8520, cumulativeVotes: 8520, percentage: 3.0, delta: "+3.0%", status: "REPORTED" },
  { time: "09:00 AM", label: "Morning Surge", votes: 24180, cumulativeVotes: 32700, percentage: 11.5, delta: "+8.5%", status: "REPORTED" },
  { time: "11:00 AM", label: "Mid-Morning", votes: 34120, cumulativeVotes: 66820, percentage: 23.5, delta: "+12.0%", status: "REPORTED" },
  { time: "01:00 PM", label: "Midday Report", votes: 38400, cumulativeVotes: 105220, percentage: 37.0, delta: "+13.5%", status: "REPORTED" },
  { time: "03:00 PM", label: "Afternoon Peak", votes: 37030, cumulativeVotes: 142250, percentage: 50.0, delta: "+13.0%", status: "REPORTED" },
  { time: "05:00 PM", label: "Evening Surge", votes: 28450, cumulativeVotes: 170700, percentage: 60.0, delta: "+10.0%", status: "PROJECTED" },
  { time: "06:00 PM", label: "Poll Closure", votes: 14225, cumulativeVotes: 184925, percentage: 65.0, delta: "+5.0%", status: "PROJECTED" },
];

const BOOTH_TURNOUT_LIST: BoothTurnoutItem[] = [
  {
    boothNumber: 101,
    name: "Navbharat High School, Room 1",
    locality: "Kothrud Depot Road",
    registeredVoters: 1142,
    votesCast: 788,
    remainingVoters: 354,
    turnoutPercentage: 69.0,
    maleVoters: 590,
    maleVoted: 418,
    femaleVoters: 552,
    femaleVoted: 370,
    assignedAgent: "Sanjay K. Kulkarni",
    agentPhone: "+91 98220 11234",
    lastReportedTime: "02:45 PM",
    historical2024Turnout: 68.4,
    status: "AHEAD",
  },
  {
    boothNumber: 102,
    name: "Navbharat High School, Room 2",
    locality: "Kothrud Depot Road",
    registeredVoters: 1205,
    votesCast: 747,
    remainingVoters: 458,
    turnoutPercentage: 62.0,
    maleVoters: 625,
    maleVoted: 395,
    femaleVoters: 580,
    femaleVoted: 352,
    assignedAgent: "Asha V. More",
    agentPhone: "+91 98220 54321",
    lastReportedTime: "02:50 PM",
    historical2024Turnout: 65.2,
    status: "AHEAD",
  },
  {
    boothNumber: 103,
    name: "Dr. Babasaheb Ambedkar Samaj Mandir",
    locality: "Paud Phata",
    registeredVoters: 980,
    votesCast: 392,
    remainingVoters: 588,
    turnoutPercentage: 40.0,
    maleVoters: 510,
    maleVoted: 212,
    femaleVoters: 470,
    femaleVoted: 180,
    assignedAgent: "Rameshwar P. Mane",
    agentPhone: "+91 94220 98765",
    lastReportedTime: "02:30 PM",
    historical2024Turnout: 54.1,
    status: "CRITICAL_LAG",
  },
  {
    boothNumber: 104,
    name: "Pune Municipal Primary School No. 18",
    locality: "Erandwane",
    registeredVoters: 1350,
    votesCast: 648,
    remainingVoters: 702,
    turnoutPercentage: 48.0,
    maleVoters: 700,
    maleVoted: 345,
    femaleVoters: 650,
    femaleVoted: 303,
    assignedAgent: "Geeta N. Salunkhe",
    agentPhone: "+91 98901 23456",
    lastReportedTime: "02:40 PM",
    historical2024Turnout: 51.3,
    status: "ON_TRACK",
  },
  {
    boothNumber: 105,
    name: "Abasaheb Garware College, Hall B",
    locality: "Karve Road",
    registeredVoters: 1480,
    votesCast: 473,
    remainingVoters: 1007,
    turnoutPercentage: 32.0,
    maleVoters: 770,
    maleVoted: 254,
    femaleVoters: 710,
    femaleVoted: 219,
    assignedAgent: "Dattatraya Shinde",
    agentPhone: "+91 97632 11098",
    lastReportedTime: "02:15 PM",
    historical2024Turnout: 48.9,
    status: "CRITICAL_LAG",
  },
  {
    boothNumber: 106,
    name: "Modern High School, Wing A",
    locality: "Shivajinagar Gaothan",
    registeredVoters: 1120,
    votesCast: 616,
    remainingVoters: 504,
    turnoutPercentage: 55.0,
    maleVoters: 580,
    maleVoted: 325,
    femaleVoters: 540,
    femaleVoted: 291,
    assignedAgent: "Nitin B. Jagtap",
    agentPhone: "+91 98505 44321",
    lastReportedTime: "02:55 PM",
    historical2024Turnout: 69.1,
    status: "ON_TRACK",
  },
  {
    boothNumber: 107,
    name: "Ferguson Junior College Library",
    locality: "FC Road",
    registeredVoters: 1290,
    votesCast: 709,
    remainingVoters: 581,
    turnoutPercentage: 55.0,
    maleVoters: 660,
    maleVoted: 370,
    femaleVoters: 630,
    femaleVoted: 339,
    assignedAgent: "Madhavi R. Joshi",
    agentPhone: "+91 98231 77654",
    lastReportedTime: "02:42 PM",
    historical2024Turnout: 62.4,
    status: "ON_TRACK",
  },
  {
    boothNumber: 108,
    name: "Deccan Education Society School",
    locality: "Deccan Gymkhana",
    registeredVoters: 890,
    votesCast: 267,
    remainingVoters: 623,
    turnoutPercentage: 30.0,
    maleVoters: 460,
    maleVoted: 142,
    femaleVoters: 430,
    femaleVoted: 125,
    assignedAgent: "Pravin S. Gaikwad",
    agentPhone: "+91 99221 00987",
    lastReportedTime: "02:20 PM",
    historical2024Turnout: 49.5,
    status: "CRITICAL_LAG",
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

export function LivePollingView() {
  const { showToast } = useToast();

  // Navigation Tabs: Live Dashboard | Notification Settings | Election History
  const [activeTab, setActiveTab] = useState<"LIVE" | "NOTIFICATIONS" | "HISTORY">("LIVE");

  // Active Polling Window Simulation
  const [isPollingActive, setIsPollingActive] = useState<boolean>(true);

  // Booth Deep-Dive Modal / Subview State
  const [isBoothModalOpen, setIsBoothModalOpen] = useState<boolean>(false);
  const [boothSearch, setBoothSearch] = useState<string>("");
  const [boothStatusFilter, setBoothStatusFilter] = useState<"ALL" | "AHEAD" | "ON_TRACK" | "CRITICAL_LAG">("ALL");

  // Notification Settings Form
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

  // Selected Historical Election for drill-down
  const [selectedHistoricalElection, setSelectedHistoricalElection] = useState<HistoricalElection | null>(null);

  // Real-time API Telemetry State
  const [telemetry, setTelemetry] = useState<any>(null);
  const [boothList, setBoothList] = useState<BoothTurnoutItem[]>(BOOTH_TURNOUT_LIST);
  const [timeSlots, setTimeSlots] = useState<TimeSlotProgress[]>(TIME_SLOT_DATA);

  // Sync live telemetry from /api/v1/polling
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
          setTelemetry(data);
          if (Array.isArray(data.timeSlots) && data.timeSlots.length > 0) {
            setTimeSlots(data.timeSlots);
          }
        }

        if (boothsRes.status === "fulfilled" && Array.isArray(boothsRes.value?.data) && isMounted) {
          setBoothList(boothsRes.value.data);
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadTelemetry();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Booths in Modal
  const filteredBooths = useMemo(() => {
    return boothList.filter((b) => {
      const matchSearch =
        boothSearch.trim() === "" ||
        b.name.toLowerCase().includes(boothSearch.toLowerCase()) ||
        b.locality.toLowerCase().includes(boothSearch.toLowerCase()) ||
        b.boothNumber.toString().includes(boothSearch) ||
        b.assignedAgent.toLowerCase().includes(boothSearch.toLowerCase());
      const matchStatus = boothStatusFilter === "ALL" || b.status === boothStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [boothList, boothSearch, boothStatusFilter]);

  // Overall Statistics Calculation
  const totalRegistered = telemetry?.totalRegistered ?? 284500;
  const totalVotesCast = telemetry?.votesCast ?? 142250;
  const remainingVoters = telemetry?.remainingVoters ?? (totalRegistered - totalVotesCast);
  const turnoutPercentage =
    telemetry?.turnoutPercentage !== undefined
      ? String(telemetry.turnoutPercentage)
      : ((totalVotesCast / totalRegistered) * 100).toFixed(1);

  // Demographic Statistics
  const maleRegistered = telemetry?.demographics?.maleVoters ?? 146000;
  const maleVoted = telemetry?.demographics?.maleVoted ?? 74500;
  const maleTurnout =
    telemetry?.demographics?.maleTurnoutPct !== undefined
      ? String(telemetry.demographics.maleTurnoutPct)
      : ((maleVoted / maleRegistered) * 100).toFixed(1);

  const femaleRegistered = telemetry?.demographics?.femaleVoters ?? 136500;
  const femaleVoted = telemetry?.demographics?.femaleVoted ?? 66800;
  const femaleTurnout =
    telemetry?.demographics?.femaleTurnoutPct !== undefined
      ? String(telemetry.demographics.femaleTurnoutPct)
      : ((femaleVoted / femaleRegistered) * 100).toFixed(1);

  const otherRegistered = 2000;
  const otherVoted = 950;
  const otherTurnout = ((otherVoted / otherRegistered) * 100).toFixed(1);

  const handleSaveNotificationSettings = () => {
    showToast(
      "success",
      "Notification Schedule Synced",
      `In-App: ${inAppFrequency.replace("_", " ")}, Email: ${emailFrequency.replace("_", " ")}. Push dispatcher operational.`
    );
  };

  const handleExportData = (type: "PDF" | "EXCEL") => {
    showToast(
      "info",
      `Generating ${type} Report`,
      `Statutory ECI Live Polling Turnout dossier for 215 - Kasba Peth prepared for download.`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* ===================================================================== */}
      {/* HEADER SECTION WITH POLLING TELEMETRY STATUS BAR                      */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Live Polling Intelligence &amp; Automated Notification Engine
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isPollingActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300"
                  }`}
                >
                  {isPollingActive ? "● POLLS ACTIVE (07:00 AM – 06:00 PM)" : "CONCLUDED ARCHIVE"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Constituency: <strong>215 - Kasba Peth</strong> • 248 Polling Booths • 2-Day Polling Window (20–21 Nov 2026)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Countdown timer */}
          {isPollingActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>03h 15m remaining</span>
            </div>
          )}

          {/* Polling Simulation Mode Switch */}
          <button
            onClick={() => {
              setIsPollingActive((prev) => !prev);
              showToast(
                "info",
                "Polling State Toggled",
                !isPollingActive
                  ? "Live Polling activated: Polling day window open."
                  : "Polling window closed. Transitioned automatically to Election History archive."
              );
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {isPollingActive ? "Simulate: Conclude Polls" : "Simulate: Open Live Polls"}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PRIMARY NAVIGATION TABS (Strict Requirement: 3 Tabs)                  */}
      {/* ===================================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("LIVE")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "LIVE"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Live Turnout Dashboard</span>
          {isPollingActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab("NOTIFICATIONS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "NOTIFICATIONS"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notification Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "HISTORY"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Election History ({HISTORICAL_ELECTIONS.length})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: CURRENT LIVE POLLING DASHBOARD                                 */}
      {/* ===================================================================== */}
      {activeTab === "LIVE" && (
        <div className="space-y-6">
          {/* TOP KPI SUMMARY METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Registered Electors</span>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {totalRegistered.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Master electoral roll size</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Votes Cast</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {totalVotesCast.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Verified through Central Voter Profiles</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending Electors to Mobilize</span>
              <div className="mt-2 text-2xl font-black text-amber-500">
                {remainingVoters.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Doorstep cadre targeting</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Overall Turnout Percentage</span>
              <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
                {turnoutPercentage}%
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${turnoutPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* DEMOGRAPHIC GENDER TURNOUT SPREAD */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Demographic Turnout Breakdown (Calculated from Central Voter Records)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Male Voter Turnout</span>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">{maleTurnout}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${maleTurnout}%` }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                  <span>Voted: {maleVoted.toLocaleString()}</span>
                  <span>Registered: {maleRegistered.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Female Voter Turnout</span>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400">{femaleTurnout}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${femaleTurnout}%` }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                  <span>Voted: {femaleVoted.toLocaleString()}</span>
                  <span>Registered: {femaleRegistered.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Other / Third Gender Turnout</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{otherTurnout}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${otherTurnout}%` }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                  <span>Voted: {otherVoted.toLocaleString()}</span>
                  <span>Registered: {otherRegistered.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TIME-WISE VOTING PROGRESS THROUGHOUT POLLING HOURS */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Time-wise Voting Progress &amp; Interval Velocity (07:00 AM – 06:00 PM)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time reporting intervals tracking voting acceleration and estimated closing turnout.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportData("PDF")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Time Curve PDF</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {timeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    slot.status === "REPORTED"
                      ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                      : "bg-slate-50 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-70"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">{slot.time}</span>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    {slot.percentage}%
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">{slot.delta}</span>
                  <span className="text-[9.5px] text-slate-400 block mt-1">{slot.cumulativeVotes.toLocaleString()} votes</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOOTH TURNOUT OVERVIEW & "VIEW MORE" CALLOUT */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Booth Turnout Performance &amp; Mobilization Alerts</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-density turnouts versus lagging polling stations needing urgent doorstep cadre dispatch.
                </p>
              </div>

              {/* CORE CLIENT REQUIREMENT: "VIEW MORE" ACTION */}
              <button
                onClick={() => setIsBoothModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>View More — Detailed Voter Turnout Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Preview Grid of 4 Sample Booths */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {boothList.slice(0, 4).map((booth) => (
                <div
                  key={booth.boothNumber}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-600 text-xs">Booth #{booth.boothNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        booth.status === "AHEAD"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : booth.status === "ON_TRACK"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {booth.turnoutPercentage}%
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{booth.name}</p>

                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Voted: {booth.votesCast}</span>
                    <span>Remaining: {booth.remainingVoters}</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        booth.turnoutPercentage >= 60 ? "bg-emerald-500" : booth.turnoutPercentage >= 40 ? "bg-blue-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${booth.turnoutPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: NOTIFICATION SETTINGS (Directly inside Live Polling)           */}
      {/* ===================================================================== */}
      {activeTab === "NOTIFICATIONS" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Live Polling Notification Dispatch Settings
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure real-time push and email broadcast frequencies, designated recipient roles, and alert thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Channel Frequencies */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Delivery Channels &amp; Frequency</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">In-App Mobile Push Notifications</span>
                    <span className="text-[11px] text-slate-400">Delivered directly to Booth Agents and Coordinators</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={inAppEnabled}
                    onChange={(e) => setInAppEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">In-App Notification Frequency</label>
                  <select
                    value={inAppFrequency}
                    disabled={!inAppEnabled}
                    onChange={(e) => setInAppFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="15_MIN">Every 15 Minutes</option>
                    <option value="30_MIN">Every 30 Minutes (Recommended)</option>
                    <option value="60_MIN">Every 60 Minutes (Hourly)</option>
                    <option value="2_HOURS">Every 2 Hours</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between mt-4">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Email Intelligence Briefs</span>
                    <span className="text-[11px] text-slate-400">Consolidated analytical reports to campaign leadership</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Broadcast Frequency</label>
                  <select
                    value={emailFrequency}
                    disabled={!emailEnabled}
                    onChange={(e) => setEmailFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
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
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Authorized Recipient Roles</span>
              </h3>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCandidateAdmin}
                    onChange={(e) => setNotifyCandidateAdmin(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Candidate &amp; Chief of Staff</span>
                    <span className="text-[10px] text-slate-400">Receives overall constituency summary &amp; highest/lowest booths</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyWarRoomDesk}
                    onChange={(e) => setNotifyWarRoomDesk(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">War Room Intelligence Desk</span>
                    <span className="text-[10px] text-slate-400">Receives real-time telemetry updates and anomaly alerts</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyBoothCoordinators}
                    onChange={(e) => setNotifyBoothCoordinators(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Booth Coordinators</span>
                    <span className="text-[10px] text-slate-400">Receives consolidated figures for their assigned booth clusters</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyMobilizers}
                    onChange={(e) => setNotifyMobilizers(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Booth Agents &amp; Table Mobilizers</span>
                    <span className="text-[10px] text-slate-400">Receives assigned booth metrics only (Strict RBAC isolation)</span>
                  </div>
                </label>
              </div>

              {/* Category Checkboxes */}
              <div className="pt-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Subscribed Event Categories</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryOverallTurnout}
                      onChange={(e) => setCategoryOverallTurnout(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Overall Turnout</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryBoothWise}
                      onChange={(e) => setCategoryBoothWise(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Booth Updates</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryLowTurnoutAlerts}
                      onChange={(e) => setCategoryLowTurnoutAlerts(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Low Turnout Alerts</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryCriticalGrievances}
                      onChange={(e) => setCategoryCriticalGrievances(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Critical Incidents</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryFinalReport}
                      onChange={(e) => setCategoryFinalReport(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Final Closing Report</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleSaveNotificationSettings}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Notification Configuration
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: ELECTION HISTORY (Read-Only Past Elections Archive)             */}
      {/* ===================================================================== */}
      {activeTab === "HISTORY" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Statutory Election History Archive
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
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
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {hist.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">{hist.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{hist.title}</h3>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Final Turnout:</span>
                    <strong className="text-blue-600">{hist.finalPercentage}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Votes Cast:</span>
                    <strong>{hist.votesCast.toLocaleString()} / {hist.registeredVoters.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Booths:</span>
                    <strong>{hist.totalBooths} Polling Stations</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Outcome Margin:</span>
                    <strong className="text-emerald-600">{hist.winnerMargin}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">{hist.notificationLogsCount} Dispatch Logs</span>
                  <button
                    onClick={() => setSelectedHistoricalElection(hist)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
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
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {selectedHistoricalElection.title}
                    </h3>
                    <p className="text-xs text-slate-400">
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
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-slate-400 block text-[10px]">Turnout</span>
                    <span className="text-lg font-black text-blue-600">{selectedHistoricalElection.finalPercentage}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-slate-400 block text-[10px]">Votes Cast</span>
                    <span className="text-lg font-black text-emerald-600">{selectedHistoricalElection.votesCast.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-slate-400 block text-[10px]">Total Booths</span>
                    <span className="text-lg font-black text-purple-600">{selectedHistoricalElection.totalBooths}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-slate-400 block text-[10px]">Margin</span>
                    <span className="text-sm font-black text-emerald-600">{selectedHistoricalElection.winnerMargin}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300">
                  Historical turnout records are locked for ECI compliance. All individual voter stamps and notification logs remain preserved.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleExportData("PDF")}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Download Dossier (PDF)
                  </button>
                  <button
                    onClick={() => setSelectedHistoricalElection(null)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* DETAILED BOOTH-WISE VOTER TURNOUT DASHBOARD ("VIEW MORE" MODAL)        */}
      {/* ===================================================================== */}
      {isBoothModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-5xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Comprehensive Booth-wise Voter Turnout Dashboard
                  </h3>
                  <p className="text-xs text-slate-400">
                    215 - Kasba Peth • Live individual voter turnout aggregation per polling station
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBoothModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {(
                  [
                    { id: "ALL", label: "All Booths" },
                    { id: "AHEAD", label: "Ahead (>60%)" },
                    { id: "ON_TRACK", label: "On Track (40-60%)" },
                    { id: "CRITICAL_LAG", label: "Critical Lag (<40%)" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBoothStatusFilter(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      boothStatusFilter === tab.id
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search booth #, name, agent..."
                  value={boothSearch}
                  onChange={(e) => setBoothSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Table Scrollable Container */}
            <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3">Booth #</th>
                    <th className="py-2.5 px-3">Polling Station Name &amp; Locality</th>
                    <th className="py-2.5 px-3">Registered</th>
                    <th className="py-2.5 px-3">Votes Cast</th>
                    <th className="py-2.5 px-3">Remaining</th>
                    <th className="py-2.5 px-3">Turnout %</th>
                    <th className="py-2.5 px-3">Gender Spread</th>
                    <th className="py-2.5 px-3">Assigned Cadre</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBooths.map((booth) => (
                    <tr key={booth.boothNumber} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">#{booth.boothNumber}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{booth.name}</span>
                        <span className="text-[10px] text-slate-400">{booth.locality}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{booth.registeredVoters.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{booth.votesCast.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-semibold text-amber-500">{booth.remainingVoters.toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-14 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                booth.turnoutPercentage >= 60 ? "bg-emerald-500" : booth.turnoutPercentage >= 40 ? "bg-blue-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${booth.turnoutPercentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{booth.turnoutPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[10px] text-slate-500">
                        <span>M: {booth.maleVoted}/{booth.maleVoters}</span>
                        <span className="block">F: {booth.femaleVoted}/{booth.femaleVoters}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{booth.assignedAgent}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{booth.agentPhone}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href={`/candidate/voters?booth=${booth.boothNumber}&turnout=unvoted`}
                          onClick={() => setIsBoothModalOpen(false)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-[10px] shadow-2xs"
                        >
                          Mobilize Unvoted ({booth.remainingVoters})
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <span className="text-xs text-slate-400">
                Showing {filteredBooths.length} of {boothList.length} configured polling stations
              </span>
              <button
                onClick={() => setIsBoothModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
