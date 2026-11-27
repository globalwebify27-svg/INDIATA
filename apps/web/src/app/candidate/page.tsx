"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Vote,
  AlertCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Search,
  CheckCircle2,
  UserPlus,
  SlidersHorizontal,
  Building2,
  MessageSquare,
  Printer,
  ShieldCheck,
  Activity,
  Layers,
  PieChart,
  Radio,
  Clock,
  TrendingUp,
  Award,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";

// ============================================================================
// DATA MODELS & REPOSITORIES (MATCHING CANDIDATE WAR ROOM REPO)
// ============================================================================

interface ElectionContext {
  electionName: string;
  state: string;
  constituency: string;
  candidateName: string;
  partyName: string;
  totalVoters: number;
  coveredVoters: number;
  totalBooths: number;
  activeKaryakartas: number;
  liveSurveyProgressPercent: number;
  voterSlipsGeneratedPercent: number;
  turnoutTargetPercent: number;
}

const ELECTION_META: ElectionContext = {
  electionName: "Lok Sabha General Elections 2024",
  state: "Maharashtra",
  constituency: "34 - Pune Parliamentary Constituency",
  candidateName: "Adv. Vikram Patil",
  partyName: "Rashtriya Vikas Morcha",
  totalVoters: 2154200,
  coveredVoters: 1682300,
  totalBooths: 2045,
  activeKaryakartas: 4850,
  liveSurveyProgressPercent: 78.2,
  voterSlipsGeneratedPercent: 84.6,
  turnoutTargetPercent: 72,
};

interface PollingStationRecord {
  boothNumber: number;
  name: string;
  locality: string;
  prabhaag: string;
  totalVoters: number;
  grade: "Grade A" | "Grade B • Swing" | "Grade C • Swing" | "Grade D • Swing";
  bloName: string;
  bloPhone: string;
  karyakartas: number;
  slipsPercent: number;
  slipsDelivered: number;
  slipsRemaining: number;
  projectedTurnout: number;
  lastTurnout: number;
}

const BOOTH_RECORDS: PollingStationRecord[] = [
  {
    boothNumber: 101,
    name: "Navbharat High School, Room 1",
    locality: "Kothrud Depot Road",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 1142,
    grade: "Grade A",
    bloName: "Sanjay K. Kulkarni",
    bloPhone: "+91 98220 11234",
    karyakartas: 5,
    slipsPercent: 92,
    slipsDelivered: 1051,
    slipsRemaining: 91,
    projectedTurnout: 74.0,
    lastTurnout: 68.4,
  },
  {
    boothNumber: 102,
    name: "Navbharat High School, Room 2",
    locality: "Kothrud Depot Road",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 1205,
    grade: "Grade A",
    bloName: "Asha V. More",
    bloPhone: "+91 98220 54321",
    karyakartas: 4,
    slipsPercent: 88,
    slipsDelivered: 1060,
    slipsRemaining: 145,
    projectedTurnout: 71.5,
    lastTurnout: 65.2,
  },
  {
    boothNumber: 103,
    name: "Dr. Babasaheb Ambedkar Samaj Mandir",
    locality: "Paud Phata",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 980,
    grade: "Grade B • Swing",
    bloName: "Rameshwar P. Mane",
    bloPhone: "+91 94220 98765",
    karyakartas: 3,
    slipsPercent: 74,
    slipsDelivered: 725,
    slipsRemaining: 255,
    projectedTurnout: 66.0,
    lastTurnout: 54.1,
  },
  {
    boothNumber: 104,
    name: "Pune Municipal Primary School No. 18",
    locality: "Erandwane",
    prabhaag: "Prabhaag 13 - Erandwane",
    totalVoters: 1350,
    grade: "Grade B • Swing",
    bloName: "Geeta N. Salunkhe",
    bloPhone: "+91 98901 23456",
    karyakartas: 6,
    slipsPercent: 68,
    slipsDelivered: 918,
    slipsRemaining: 432,
    projectedTurnout: 63.8,
    lastTurnout: 51.3,
  },
  {
    boothNumber: 105,
    name: "Abasaheb Garware College, Hall B",
    locality: "Karve Road",
    prabhaag: "Prabhaag 13 - Erandwane",
    totalVoters: 1480,
    grade: "Grade C • Swing",
    bloName: "Dattatraya Shinde",
    bloPhone: "+91 97632 11098",
    karyakartas: 3,
    slipsPercent: 58,
    slipsDelivered: 858,
    slipsRemaining: 622,
    projectedTurnout: 58.2,
    lastTurnout: 48.9,
  },
  {
    boothNumber: 106,
    name: "Modern High School, Wing A",
    locality: "Shivajinagar Gaothan",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 1120,
    grade: "Grade A",
    bloName: "Nitin B. Jagtap",
    bloPhone: "+91 98505 44321",
    karyakartas: 4,
    slipsPercent: 85,
    slipsDelivered: 952,
    slipsRemaining: 168,
    projectedTurnout: 73.4,
    lastTurnout: 69.1,
  },
  {
    boothNumber: 107,
    name: "Ferguson Junior College Library",
    locality: "FC Road",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 1290,
    grade: "Grade B • Swing",
    bloName: "Madhavi R. Joshi",
    bloPhone: "+91 98231 77654",
    karyakartas: 4,
    slipsPercent: 71,
    slipsDelivered: 916,
    slipsRemaining: 374,
    projectedTurnout: 68.0,
    lastTurnout: 62.4,
  },
  {
    boothNumber: 108,
    name: "Gokhale Memorial Community Hall",
    locality: "Deccan Gymkhana",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 890,
    grade: "Grade D • Swing",
    bloName: "Pravin S. Gaikwad",
    bloPhone: "+91 99224 88321",
    karyakartas: 2,
    slipsPercent: 44,
    slipsDelivered: 392,
    slipsRemaining: 498,
    projectedTurnout: 51.0,
    lastTurnout: 41.5,
  },
];

interface DirectiveTask {
  id: string;
  title: string;
  assignedTo: string;
  assignedRole: string;
  boothNumber: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  deadline: string;
  status: "OVERDUE" | "IN PROGRESS" | "PENDING" | "COMPLETED";
}

const WAR_ROOM_TASKS: DirectiveTask[] = [
  {
    id: "TSK-101",
    title: "Distribute remaining 120 voter slips in Paud Phata swing cluster",
    assignedTo: "Vikas Mane",
    assignedRole: "Karyakarta",
    boothNumber: 103,
    priority: "CRITICAL",
    deadline: "Today, 5:00 PM",
    status: "OVERDUE",
  },
  {
    id: "TSK-102",
    title: "Verify 18 unmapped senior citizens for home voting assistance",
    assignedTo: "Pooja Jadhav",
    assignedRole: "Karyakarta Lead",
    boothNumber: 101,
    priority: "HIGH",
    deadline: "Tomorrow, 12:00 PM",
    status: "IN PROGRESS",
  },
  {
    id: "TSK-103",
    title: "Escalate low water pressure grievance TKT-9210 to PMC Ward Officer",
    assignedTo: "Ramesh Shinde",
    assignedRole: "War Room Operator",
    boothNumber: 105,
    priority: "HIGH",
    deadline: "Today, 6:30 PM",
    status: "IN PROGRESS",
  },
  {
    id: "TSK-104",
    title: "Set up Bluetooth slip printer desks at Navbharat School gate",
    assignedTo: "Ganesh Patil",
    assignedRole: "Booth Adhyaksh",
    boothNumber: 102,
    priority: "MEDIUM",
    deadline: "In 2 days",
    status: "PENDING",
  },
  {
    id: "TSK-105",
    title: "Cross-check ECI roll additions with BLO Sanjay Kulkarni",
    assignedTo: "Amit Deshmukh",
    assignedRole: "Prabhaag Incharge",
    boothNumber: 101,
    priority: "LOW",
    deadline: "Completed 2h ago",
    status: "COMPLETED",
  },
  {
    id: "TSK-106",
    title: "AI Voice broadcast follow-up for 420 undecided youth electors",
    assignedTo: "Sneha Joshi",
    assignedRole: "Campaign Manager",
    boothNumber: 104,
    priority: "MEDIUM",
    deadline: "Today, 8:00 PM",
    status: "IN PROGRESS",
  },
];

interface CriticalAlert {
  id: string;
  severity: "CRITICAL" | "HIGH" | "WARNING";
  category: string;
  title: string;
  description: string;
  affectedArea: string;
  timestamp: string;
  actionLabel: string;
  actionHref: string;
}

const CRITICAL_ALERTS: CriticalAlert[] = [
  {
    id: "alt-01",
    severity: "CRITICAL",
    category: "VOTER SLIP LAG",
    title: "3 High-Priority Swing Booths Under 50% Slip Distribution",
    description:
      "Booth #103 (Paud Phata, 48% slips), Booth #108 (Deccan, 44%), and Booth #112 (Karve Nagar, 46%) require urgent mobilizer surge before tomorrow evening.",
    affectedArea: "Prabhaag 12 & 14 (3 Polling Stations, 3,420 Electors)",
    timestamp: "12m ago",
    actionLabel: "Dispatch Surge Squad ->",
    actionHref: "/field-map",
  },
  {
    id: "alt-02",
    severity: "HIGH",
    category: "PUBLIC GRIEVANCE",
    title: "Critical Water Supply Disruption in Dahanukar Colony",
    description:
      "Ticket #TKT-9210 escalated: Low municipal water pressure reported by 45 resident households in swing sector. Immediate water tanker dispatch coordinated.",
    affectedArea: "Dahanukar Colony, Kothrud (Booth #102 & #103)",
    timestamp: "24m ago",
    actionLabel: "Open Ticket Desk ->",
    actionHref: "/office/tickets",
  },
  {
    id: "alt-03",
    severity: "HIGH",
    category: "CADRE INACTIVITY",
    title: "5 Assigned Karyakartas Inactive on Field for > 48 Hours",
    description:
      "Mobilizers in Ward 14 have not checked in or synced survey app packets. Substitute reserve table agents ready for immediate deployment.",
    affectedArea: "Ward 14 - Shivajinagar Gaothan",
    timestamp: "1h ago",
    actionLabel: "Reassign Cadre ->",
    actionHref: "/users",
  },
];

export default function CandidateWarRoomDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [timeframe, setTimeframe] = useState<"today" | "week" | "campaign">("today");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters state
  const [filterGender, setFilterGender] = useState("all");
  const [filterCaste, setFilterCaste] = useState("all");
  const [filterMember, setFilterMember] = useState("all");
  const [filterWard, setFilterWard] = useState("all");
  const [filterBooth, setFilterBooth] = useState("all");

  // Booth table filter
  const [boothSearch, setBoothSearch] = useState("");

  // Ranked booths search
  const [rankedSearch, setRankedSearch] = useState("");
  const [rankedPrabhaag, setRankedPrabhaag] = useState("all");

  // Task filter
  const [taskFilter, setTaskFilter] = useState<"ALL" | "OVERDUE" | "IN PROGRESS" | "PENDING" | "COMPLETED">("ALL");

  // Alerts filter
  const [alertFilter, setAlertFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "WARNING">("ALL");

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);

  const CAROUSEL_ITEMS = useMemo(
    () => [
      {
        id: "sug-1",
        category: "ATTENTION REQUIRED",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
        title: "Pending Voter Update Requests",
        description: "New information collected on-ground by field workers is waiting for candidate admin review.",
        target: "Target Indicator: 1,240 records pending review",
        classification: "Classification: Awaiting sync approval",
        actionText: "Review Update Requests ->",
        actionHref: "/voters",
      },
      {
        id: "sug-2",
        category: "HISTORICAL STRATEGY INSIGHT",
        badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
        title: "Previous Campaign Coverage",
        description: "Review historical campaign activities and booth coverage recorded in the selected constituency.",
        target: "Target Indicator: 18 booths covered in records",
        classification: "Classification: Prior election blueprint",
        actionText: "View Historical Strategy ->",
        actionHref: "/strategy",
      },
      {
        id: "sug-3",
        category: "VOTER DATA INSIGHT",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
        title: "Voters Without Mobile Numbers",
        description: "Identify voter records where mobile contact information is missing across priority booths.",
        target: "Target Indicator: 2,450 matching records",
        classification: "Classification: Incomplete contact roll",
        actionText: "View Filtered Voters ->",
        actionHref: "/voters",
      },
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [CAROUSEL_ITEMS.length]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("success", "Telemetry Synced", "Master electoral roll, cadre GPS pings, and voter slip metrics are up to date.");
    }, 600);
  };

  const handleApplyFilters = () => {
    setShowFilterDrawer(false);
    showToast("info", "Filters Applied", "War room metrics refreshed with selected filter taxonomy.");
  };

  const handleResetFilters = () => {
    setFilterGender("all");
    setFilterCaste("all");
    setFilterMember("all");
    setFilterWard("all");
    setFilterBooth("all");
    setShowFilterDrawer(false);
    showToast("info", "Filters Reset", "Showing complete constituency dataset.");
  };

  // Filtered booth matrix
  const filteredBooths = useMemo(() => {
    return BOOTH_RECORDS.filter((b) => {
      const matchSearch =
        boothSearch.trim() === "" ||
        b.name.toLowerCase().includes(boothSearch.toLowerCase()) ||
        b.locality.toLowerCase().includes(boothSearch.toLowerCase()) ||
        b.boothNumber.toString().includes(boothSearch);
      return matchSearch;
    });
  }, [boothSearch]);

  // Filtered ranked booths
  const rankedBooths = useMemo(() => {
    return [...BOOTH_RECORDS]
      .sort((a, b) => b.totalVoters - a.totalVoters)
      .filter((b) => {
        const matchSearch =
          b.name.toLowerCase().includes(rankedSearch.toLowerCase()) ||
          b.locality.toLowerCase().includes(rankedSearch.toLowerCase()) ||
          b.boothNumber.toString().includes(rankedSearch);
        const matchPrabhaag = rankedPrabhaag === "all" || b.prabhaag.toLowerCase().includes(rankedPrabhaag.toLowerCase());
        return matchSearch && matchPrabhaag;
      });
  }, [rankedSearch, rankedPrabhaag]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    if (taskFilter === "ALL") return WAR_ROOM_TASKS;
    return WAR_ROOM_TASKS.filter((t) => t.status === taskFilter);
  }, [taskFilter]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    if (alertFilter === "ALL") return CRITICAL_ALERTS;
    return CRITICAL_ALERTS.filter((a) => a.severity === alertFilter);
  }, [alertFilter]);

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-800">
      {/* ========================================================================= */}
      {/* SECTION 0: CENTRAL WAR ROOM COMMAND HEADER CARD (SCREENSHOT 1)           */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#151E2D] p-5 rounded-2xl border border-slate-200/90 dark:border-[#29364A] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                Central War Room Command
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60">
                Verified Official Roll
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-[11px] text-slate-400 dark:text-[#64748B] font-mono">Updated: Just now</span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-[#F8FAFC] mt-1 tracking-tight">
              {ELECTION_META.electionName}
            </h1>

            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-[#94A3B8] flex-wrap">
              <span>
                Candidate: <strong className="text-slate-800 dark:text-[#F8FAFC] font-semibold">{ELECTION_META.candidateName}</strong> (
                {ELECTION_META.partyName})
              </span>
              <span>•</span>
              <span className="text-blue-700 dark:text-blue-400 font-semibold">User: {user?.name || "Adv. Vikram Patil"} ({user?.role ? user.role.toUpperCase() : "Candidate Super Admin"})</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <select className="pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#1B2638] dark:hover:bg-[#1B2638]/80 border border-slate-200 dark:border-[#29364A] rounded-xl text-xs font-bold text-slate-800 dark:text-[#F8FAFC] appearance-none shadow-xs cursor-pointer">
                <option value="pc-34">34 - Pune Parliamentary Constituency</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="pl-3 pr-8 py-2 bg-blue-50/80 hover:bg-blue-100/80 dark:bg-blue-950/40 dark:hover:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs font-bold text-blue-800 dark:text-blue-200 appearance-none shadow-xs cursor-pointer">
                <option value="all">All Vidhan Sabha Segments</option>
                <option value="214">214 - Kothrud Assembly Segment</option>
                <option value="215">215 - Kasba Peth Assembly Segment</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-xs cursor-pointer ${
                showFilterDrawer
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white dark:bg-[#243247] text-slate-700 dark:text-white border-slate-200 dark:border-[#3E4F68] hover:bg-slate-50 dark:hover:bg-[#2E3E58]"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Timeframe Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-[#101827] p-1 rounded-xl border border-slate-200/80 dark:border-[#29364A]">
              <button
                type="button"
                onClick={() => setTimeframe("today")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === "today"
                    ? "bg-white dark:bg-[#243247] text-slate-900 dark:text-white shadow-xs font-bold dark:border dark:border-[#3E4F68]"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTimeframe("week")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === "week"
                    ? "bg-white dark:bg-[#243247] text-slate-900 dark:text-white shadow-xs font-bold dark:border dark:border-[#3E4F68]"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setTimeframe("campaign")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === "campaign"
                    ? "bg-white dark:bg-[#243247] text-slate-900 dark:text-white shadow-xs font-bold dark:border dark:border-[#3E4F68]"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Full Campaign
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#3E4F68] bg-white dark:bg-[#243247] hover:bg-slate-50 dark:hover:bg-[#2E3E58] text-slate-700 dark:text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
              title="Refresh ECI Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
              <span>Refresh</span>
            </button>

            {/* Register Elector CTA */}
            <Link
              href="/voters"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#1D61E0] dark:hover:bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Register Elector</span>
            </Link>
          </div>
        </div>

        {/* EXPANDABLE MULTI-SELECT FILTER DRAWER */}
        {showFilterDrawer && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 animate-fade-in">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="all">All Genders</option>
                <option value="male">Male (51.4%)</option>
                <option value="female">Female (48.5%)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Caste Category</label>
              <select
                value={filterCaste}
                onChange={(e) => setFilterCaste(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="all">All Categories</option>
                <option value="general">General / Open (33.1%)</option>
                <option value="obc">OBC (29.0%)</option>
                <option value="sc">SC (13.8%)</option>
                <option value="minority">Religious Minorities (8.5%)</option>
                <option value="st_nt">ST / NT (6.6%)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Member Status</label>
              <select
                value={filterMember}
                onChange={(e) => setFilterMember(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="all">All Member Types</option>
                <option value="active">Active Cadre (28,450)</option>
                <option value="new">Newly Registered (+1,630)</option>
                <option value="standby">Standby / Inactive (4,120)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Area / Ward</label>
              <select
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="all">All Wards</option>
                <option value="ward-12">Prabhaag 12 - Kothrud West</option>
                <option value="ward-13">Prabhaag 13 - Erandwane</option>
                <option value="ward-14">Prabhaag 14 - Shivajinagar</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Polling Booth</label>
              <select
                value={filterBooth}
                onChange={(e) => setFilterBooth(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="all">All Polling Stations (8)</option>
                <option value="101">Booth #101 - Navbharat High School</option>
                <option value="102">Booth #102 - Saraswati Vidyalaya</option>
                <option value="103">Booth #103 - Saint Mary Convent</option>
                <option value="104">Booth #104 - ZP Primary School</option>
                <option value="105">Booth #105 - Municipal Community Hall</option>
                <option value="106">Booth #106 - Modern Education Trust</option>
                <option value="107">Booth #107 - Abhinav Kala Kendra</option>
                <option value="108">Booth #108 - Pune Gymkhana Pavilion</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-[#1D61E0] dark:hover:bg-[#2563EB] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#243247] dark:hover:bg-[#2E3E58] text-slate-600 dark:text-white dark:border dark:border-[#3E4F68] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: 3 HIGH-PRIORITY FOCUS BOOTHS ALERT BANNER (SCREENSHOT 1)       */}
      {/* ========================================================================= */}
      <section className="bg-amber-50 border border-amber-200 dark:bg-[#2A1D0B] dark:border-[#B45309]/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-[#FDE68A]">
              3 High-Priority Swing Booths Require Slip Distribution Surge
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-200/90 mt-0.5">
              Booth #103 (Paud Phata) &amp; Booth #108 (Deccan) are currently under 50% voter slip distribution threshold.
            </p>
          </div>
        </div>

        <Link
          href="/field-map"
          className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold shadow-sm shadow-amber-500/20 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Dispatch on Live Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: 8 TOP KPI METRIC CARDS (SCREENSHOT 1)                          */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Card 1: TOTAL VOTERS */}
        <div className="bg-white dark:bg-[#151E2D] p-3.5 rounded-2xl border border-blue-200/70 dark:border-[#29364A] shadow-xs hover:border-blue-400 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">TOTAL VOTERS</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center">
              <Vote className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">21.54 L</span>
          </div>
          <div className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>ECI Verified</span>
          </div>
        </div>

        {/* Card 2: TOTAL MEMBERS */}
        <div className="bg-white dark:bg-[#151E2D] p-3.5 rounded-2xl border border-indigo-200/70 dark:border-[#29364A] shadow-xs hover:border-indigo-400 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">TOTAL MEMBERS</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">34,200</span>
          </div>
          <div className="flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span>28,450 Active Mem</span>
          </div>
        </div>

        {/* Card 3: TOTAL BOOTHS */}
        <div className="bg-white dark:bg-[#151E2D] p-3.5 rounded-2xl border border-purple-200/70 dark:border-[#29364A] shadow-xs hover:border-purple-400 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">TOTAL BOOTHS</span>
            <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">2,045</span>
          </div>
          <div className="text-[10.5px] font-semibold text-slate-500 dark:text-[#94A3B8]">2,038 Active Stations</div>
        </div>

        {/* Card 4: BLO OFFICERS */}
        <div className="bg-white dark:bg-[#151E2D] p-3.5 rounded-2xl border border-cyan-200/70 dark:border-[#29364A] shadow-xs hover:border-cyan-400 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-600" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">BLO OFFICERS</span>
            <div className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">2,045</span>
          </div>
          <div className="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">98.4% Verified Assign</div>
        </div>

        {/* Card 5: KARYAKARTAS */}
        <div className="bg-white dark:bg-[#151E2D] p-3.5 rounded-2xl border border-emerald-200/70 dark:border-[#29364A] shadow-xs hover:border-emerald-400 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-600" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">KARYAKARTAS</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">4,850</span>
          </div>
          <div className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>3,120 On Field</span>
          </div>
        </div>

        {/* Card 6: COVERAGE */}
        <div className="bg-white dark:bg-[#151E2D] p-3.5 rounded-2xl border border-amber-200/70 dark:border-[#29364A] shadow-xs hover:border-amber-400 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">COVERAGE</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">78.2%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "78.2%" }} />
          </div>
        </div>

        {/* Card 7: SLIPS DELIV. */}
        <div className="bg-white dark:bg-[#151E2D] p-3.5 rounded-2xl border border-violet-200/70 dark:border-[#29364A] shadow-xs hover:border-violet-400 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">SLIPS DELIV.</span>
            <div className="w-6 h-6 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 flex items-center justify-center">
              <Printer className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">84.6%</span>
          </div>
          <div className="text-[10.5px] font-semibold text-violet-700 dark:text-violet-400">18.2 L Handed</div>
        </div>

        {/* Card 8: OPEN ISSUES */}
        <div className="bg-white dark:bg-[#151E2D] p-3.5 rounded-2xl border border-rose-200/70 dark:border-[#29364A] shadow-xs hover:border-rose-400 transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">OPEN ISSUES</span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">42</span>
          </div>
          <div className="text-[10.5px] font-semibold text-rose-600 dark:text-rose-400">89% Resolved</div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: LIVE FIELD OPS MAP PREVIEW + ATTENTION CAROUSEL (SCREENSHOT 2)  */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Live Field Operations Preview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Live Field Operations Preview</h3>
              </div>
              <p className="text-xs text-slate-500">
                Visualizing active Karyakarta survey tracks across Kothrud, Erandwane, and Shivajinagar.
              </p>
            </div>

            <Link
              href="/field-map"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Expand Interactive Full Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SVG Preview Canvas */}
          <div className="relative w-full h-64 rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden flex items-center justify-center">
            {/* Grid background dots */}
            <svg className="absolute inset-0 w-full h-full text-slate-200/80" width="100%" height="100%">
              <defs>
                <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-dots)" />
            </svg>

            {/* Geometric Polygons & Trajectories */}
            <svg viewBox="0 0 600 240" className="w-full h-full relative z-10">
              {/* Sine Wave Curve */}
              <path
                d="M 20 180 C 140 30, 240 240, 360 120 S 480 40, 580 160"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="opacity-70"
              />

              {/* Polygon 1: Blue (Booth 101) */}
              <polygon
                points="120,70 200,90 170,180 90,150"
                fill="#3B82F6"
                fillOpacity="0.08"
                stroke="#2563EB"
                strokeWidth="2"
              />
              <g transform="translate(135, 125)">
                <rect x="-6" y="-12" width="100" height="22" rx="6" fill="white" stroke="#E2E8F0" />
                <circle cx="2" cy="-1" r="3" fill="#2563EB" />
                <text x="10" y="2" fontSize="9" fontWeight="bold" fill="#1E293B">Pooja J. (Booth 101)</text>
              </g>

              {/* Polygon 2: Green (Booth 102) */}
              <polygon
                points="230,80 320,70 340,160 250,170"
                fill="#10B981"
                fillOpacity="0.08"
                stroke="#059669"
                strokeWidth="2"
              />
              <g transform="translate(265, 125)">
                <rect x="-6" y="-12" width="105" height="22" rx="6" fill="white" stroke="#E2E8F0" />
                <circle cx="2" cy="-1" r="3" fill="#059669" />
                <text x="10" y="2" fontSize="9" fontWeight="bold" fill="#1E293B">Ganesh P. (Booth 102)</text>
              </g>

              {/* Polygon 3: Amber (Booth 104) */}
              <polygon
                points="360,90 470,95 440,190 350,180"
                fill="#F59E0B"
                fillOpacity="0.08"
                stroke="#D97706"
                strokeWidth="2"
              />
              <g transform="translate(385, 145)">
                <rect x="-6" y="-12" width="100" height="22" rx="6" fill="white" stroke="#E2E8F0" />
                <circle cx="2" cy="-1" r="3" fill="#D97706" />
                <text x="10" y="2" fontSize="9" fontWeight="bold" fill="#1E293B">Vikas M. (Booth 104)</text>
              </g>
            </svg>

            {/* Bottom Legend */}
            <div className="absolute bottom-3 left-4 flex items-center gap-4 text-xs font-semibold bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-xs z-20">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Active Karyakarta</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Field Squad</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Swing Zone</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Attention Required Carousel (Dark Card) */}
        {(() => {
          const currentCarousel = CAROUSEL_ITEMS[carouselIndex] || CAROUSEL_ITEMS[0]!;
          return (
            <div className="bg-[#0B1527] text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Sparkles className="w-3 h-3" />
                    <span>{currentCarousel.category}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCarouselIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCarouselIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full ml-1">
                      Auto
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-white tracking-tight">
                  {currentCarousel.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentCarousel.description}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
                  <p className="font-semibold text-slate-200">{currentCarousel.target}</p>
                  <p className="text-slate-400 text-[11px]">{currentCarousel.classification}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Link
                  href={currentCarousel.actionHref}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>{currentCarousel.actionText}</span>
                </Link>

                {/* Pagination Dots */}
                <div className="flex items-center justify-center gap-1.5">
                  {CAROUSEL_ITEMS.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        carouselIndex === idx ? "w-6 bg-amber-400" : "w-1.5 bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: ORGANISATION SCORE + GENDER + MEMBER SUMMARY (SCREENSHOT 2 & 3) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Organisation Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Organisation Score</h3>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                ECI Roll Match: High
              </span>
            </div>

            {/* Circular Radial Gauge */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#2563EB"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.82)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-slate-900 block leading-none">82%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HEALTH</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-medium">Booth Coverage</span>
                <span className="font-bold text-slate-900">99.6%</span>
              </div>
              <p className="text-[11px] text-slate-400">2,038 / 2,045 booths active</p>
            </div>
          </div>

          <div className="mt-4 p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Booths w/o Data: 7 Booths</span>
          </div>
        </div>

        {/* Card 2: Gender Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Gender Distribution</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">21,54,328 total</span>
            </div>

            {/* Donut Chart */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#2563EB"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.514)}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#EC4899"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.485)}
                    strokeLinecap="round"
                    className="rotate-180 origin-center"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xs font-black text-slate-900 block leading-tight">100%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">CLASSIFIED</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Male</span>
                </span>
                <span className="font-bold text-slate-900">11,07,320 (51.4%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Female</span>
                </span>
                <span className="font-bold text-slate-900">10,45,288 (48.5%)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Third Gender / Others:</span>
            <span className="font-bold text-slate-700">1,720 (0.1%)</span>
          </div>
        </div>

        {/* Card 3: Member Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Member Summary</h3>
              </div>
              <Link href="/members" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View Roster &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Members</span>
                <span className="text-lg font-black text-slate-900 mt-0.5 block">34,200</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Active Cadre</span>
                <span className="text-lg font-black text-emerald-700 mt-0.5 block">28,450</span>
              </div>
            </div>

            <div className="space-y-2 mt-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Standby / Inactive</span>
                <span className="font-bold text-slate-900">4,120</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Newly Enrolled (Past 14 days)</span>
                <span className="font-bold text-emerald-600">+1,630</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Cadre Readiness Rate:</span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">83.2% Verified</span>
          </div>
        </div>
      </section>

      {/* Blue Action Button Row (Screenshot 3) */}
      <div className="flex">
        <Link
          href="/voters"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add / Import Voters</span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: CASTE CATEGORIES & CASTE DISTRIBUTION (SCREENSHOT 3)           */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Card: Caste Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Caste Categories</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Broad social classifications across 21.54 L electorate</p>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              6 Categories
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {/* General */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                  <span>General / Open Category</span>
                </span>
                <span className="font-mono text-slate-900">712,000 &bull; <strong>33.1%</strong></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "33.1%" }} />
              </div>
            </div>

            {/* OBC */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                  <span>OBC (Other Backward Classes)</span>
                </span>
                <span className="font-mono text-slate-900">624,000 &bull; <strong>29%</strong></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "29%" }} />
              </div>
            </div>

            {/* SC */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
                  <span>SC (Scheduled Castes)</span>
                </span>
                <span className="font-mono text-slate-900">298,000 &bull; <strong>13.8%</strong></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "13.8%" }} />
              </div>
            </div>

            {/* Religious Minorities */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
                  <span>Religious Minorities</span>
                </span>
                <span className="font-mono text-slate-900">184,000 &bull; <strong>8.5%</strong></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "8.5%" }} />
              </div>
            </div>

            {/* ST / NT */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  <span>ST / NT (Nomadic Tribes)</span>
                </span>
                <span className="font-mono text-slate-900">142,000 &bull; <strong>6.6%</strong></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "6.6%" }} />
              </div>
            </div>

            {/* Other */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
                  <span>Other / Unclassified</span>
                </span>
                <span className="font-mono text-slate-900">194,200 &bull; <strong>9%</strong></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-400 h-2 rounded-full" style={{ width: "9%" }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Primary Demographic: <strong>General + OBC (62.1%)</strong></span>
            <Link href="/voters" className="font-bold text-blue-600 hover:text-blue-700">
              Filter Roll by Caste &rarr;
            </Link>
          </div>
        </div>

        {/* Right Card: Caste Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Caste Distribution</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Specific community clusters &amp; demographic density</p>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Community Breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2 text-xs">
            {/* Col 1 */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Maratha</span>
                  </span>
                  <span className="font-bold text-slate-900">22.4%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "22.4%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">General / Open Category • 482,100</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>Brahmin</span>
                  </span>
                  <span className="font-bold text-slate-900">10.4%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: "10.4%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">General / Open Category • 224,000</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-cyan-600" />
                    <span>Vanjari (OBC/NT)</span>
                  </span>
                  <span className="font-bold text-slate-900">5.3%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-600 h-1.5 rounded-full" style={{ width: "5.3%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">OBC • 114,000</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span>Matang (SC)</span>
                  </span>
                  <span className="font-bold text-slate-900">4.6%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: "4.6%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">SC • 100,000</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Jain / Marwari</span>
                  </span>
                  <span className="font-bold text-slate-900">3.2%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: "3.2%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">General / Open Category</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Mali (OBC)</span>
                  </span>
                  <span className="font-bold text-slate-900">9.2%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "9.2%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">OBC • 198,000</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Neo-Buddhist (SC)</span>
                  </span>
                  <span className="font-bold text-slate-900">9.2%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "9.2%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">SC • 198,000</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Muslim</span>
                  </span>
                  <span className="font-bold text-slate-900">6.6%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "6.6%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Religious Minorities • 142,000</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>Dhangar (OBC/NT)</span>
                  </span>
                  <span className="font-bold text-slate-900">4.1%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: "4.1%" }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">OBC • 88,000</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Aggregated from verified booth surveys and electoral records</span>
            <span className="font-bold text-slate-700">10 Key Segments</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: BOOTH INTELLIGENCE & READINESS MATRIX (SCREENSHOT 4)           */}
      {/* ========================================================================= */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Booth Intelligence &amp; Readiness Matrix</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status, BLO verification, karyakarta staffing, and slip delivery per polling station.
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search booth name, locality, #..."
                value={boothSearch}
                onChange={(e) => setBoothSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs w-48 sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <Link
              href="/candidate/live-polling"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors shadow-2xs"
            >
              <span>View More Turnout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">BOOTH #</th>
                <th className="py-3 px-3">POLLING STATION NAME &amp; LOCALITY</th>
                <th className="py-3 px-3">VOTERS</th>
                <th className="py-3 px-3">BLO INCHARGE</th>
                <th className="py-3 px-3">KARYAKARTAS</th>
                <th className="py-3 px-3">SLIP DELIVERY</th>
                <th className="py-3 px-3">PROJECTED TURNOUT</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooths.map((booth) => (
                <tr key={booth.boothNumber} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">#{booth.boothNumber}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{booth.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{booth.locality}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{booth.totalVoters.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-800">{booth.bloName}</p>
                    <p className="text-[11px] text-slate-400">{booth.bloPhone}</p>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{booth.karyakartas} Assigned</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            booth.slipsPercent >= 80 ? "bg-blue-600" : booth.slipsPercent >= 50 ? "bg-amber-500" : "bg-rose-500"
                          }`}
                          style={{ width: `${booth.slipsPercent}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 text-[11px]">{booth.slipsPercent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900">{booth.projectedTurnout}%</span>
                    <span className="text-[10px] text-slate-400 block">Last: {booth.lastTurnout}%</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/voters?booth=${booth.boothNumber}`}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] shadow-2xs"
                    >
                      Inspect Roll
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View More Voter Turnout Callout (Client Specification Requirement) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 px-1 text-xs text-slate-500 border-t border-slate-100">
          <span>Showing 8 polling stations in Kasba Peth constituency</span>
          <Link
            href="/candidate/live-polling"
            className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            <span>View More — Open Detailed Voter Turnout Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: TOP BOOTHS BY TOTAL VOTER COUNT (SCREENSHOT 5)                 */}
      {/* ========================================================================= */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Top Booths by Total Voter Count</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked descending order of registered voters to focus high-density mobilizations and voter slip delivery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ranked booths..."
                value={rankedSearch}
                onChange={(e) => setRankedSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] bg-slate-50 dark:bg-[#0B101A] text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] w-40 sm:w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={rankedPrabhaag}
              onChange={(e) => setRankedPrabhaag(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#29364A] bg-slate-50 dark:bg-[#1E293B] text-xs font-semibold text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Prabhaags</option>
              <option value="12">Prabhaag 12</option>
              <option value="13">Prabhaag 13</option>
              <option value="14">Prabhaag 14</option>
            </select>

            <span className="text-xs font-semibold text-slate-400 dark:text-white bg-slate-100 dark:bg-[#1E293B] border border-transparent dark:border-[#29364A] px-2.5 py-1.5 rounded-xl hidden sm:inline-block">
              Showing {rankedBooths.length} Ranked Booths
            </span>
          </div>
        </div>

        {/* Ranked Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">RANK</th>
                <th className="py-3 px-3">POLLING LOCATION &amp; BUILDING</th>
                <th className="py-3 px-3">BOOTH NUMBER</th>
                <th className="py-3 px-3">AREA / PRABHAAG</th>
                <th className="py-3 px-3">TOTAL VOTERS</th>
                <th className="py-3 px-3">COVERAGE &amp; SLIPS</th>
                <th className="py-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedBooths.map((booth, idx) => {
                const rankNum = idx + 1;
                return (
                  <tr key={booth.boothNumber} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs font-mono shadow-2xs ${
                          rankNum === 1
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : rankNum === 2
                            ? "bg-slate-200 text-slate-800 border border-slate-300"
                            : rankNum === 3
                            ? "bg-orange-100 text-orange-900 border border-orange-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        #{rankNum}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{booth.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{booth.locality}</p>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">Booth #{booth.boothNumber}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{booth.prabhaag}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {booth.totalVoters.toLocaleString()}{" "}
                      <span className="text-[11px] font-normal text-slate-400">registered</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{booth.slipsPercent}%</span>{" "}
                      <span className="text-[11px] text-slate-400">({booth.slipsDelivered.toLocaleString()} slips)</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/voters?booth=${booth.boothNumber}`}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px]"
                      >
                        Inspect Roll
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: CAMPAIGN CHANNELS & OFFICE TICKETS (SCREENSHOT 6)              */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Campaign Communication Channels */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Campaign Communication Channels</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Live delivery throughput across automated voter broadcasts.</p>
            </div>
            <Link href="/campaigns" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              Manage Campaigns &rarr;
            </Link>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            {/* Channel 1: WhatsApp */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>WhatsApp Voter Slip Broadcast</span>
                </span>
                <span className="text-blue-600">96% Delivered (4,320 / 4,500)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "96%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Delivered: <strong>4,320</strong></span>
                <span>Failed: <strong className="text-rose-600">180 (4%)</strong></span>
                <span>Responses: <strong className="text-emerald-600">614 (14.2%)</strong></span>
              </div>
            </div>

            {/* Channel 2: Youth SMS */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Youth First-Time Voter SMS</span>
                </span>
                <span className="text-blue-600">97% Delivered (7,950 / 8,200)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "97%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Delivered: <strong>7,950</strong></span>
                <span>Failed: <strong className="text-rose-600">250 (3%)</strong></span>
                <span>Click-through: <strong className="text-blue-600">1,550 (19.5%)</strong></span>
              </div>
            </div>

            {/* Channel 3: AI Voice */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>AI Voice Outreach Calls</span>
                </span>
                <span className="text-purple-600">87% Connected (10,450 / 12,000)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "87%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Connected: <strong>10,450</strong></span>
                <span>Failed: <strong className="text-rose-600">1,550 (13%)</strong></span>
                <span>Avg Duration: <strong>48 sec</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top Public Demands & Office Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Top Public Demands &amp; Office Tickets</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Constituency grievances logged via Candidate Office Helpdesk.</p>
            </div>
            <Link href="/office/tickets" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              Open Ticket Desk &rarr;
            </Link>
          </div>

          {/* 4 Mini Stat Boxes */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">TOTAL</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">42</span>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">OPEN</span>
              <span className="text-base font-black text-amber-900 mt-0.5 block">14</span>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200/80">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">IN PROGRESS</span>
              <span className="text-base font-black text-blue-900 mt-0.5 block">18</span>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200/80">
              <span className="text-[10px] font-bold text-purple-700 uppercase block">RESOLVED</span>
              <span className="text-base font-black text-purple-900 mt-0.5 block">10</span>
            </div>
          </div>

          {/* 3 Sample Tickets */}
          <div className="space-y-2.5 text-xs">
            {/* TKT-9210 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  <span className="text-blue-600 font-mono">TKT-9210</span> Water Supply
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">HIGH</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">OPEN</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Entire Dahanukar Colony Lane 3 has faced low municipal pressure for 5 straight days...
              </p>
              <p className="text-[10px] text-slate-400">
                Visitor: Narayan Govind Joshi • Assigned: Sachin Babar (Prabhaag Incharge)
              </p>
            </div>

            {/* TKT-9208 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  <span className="text-blue-600 font-mono">TKT-9208</span> Pension
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">MEDIUM</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">IN PROGRESS</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Sanjay Gandhi Niradhar Yojana monthly pension not credited into bank for 3...
              </p>
              <p className="text-[10px] text-slate-400">
                Visitor: Shabana Begum Mansuri • Assigned: Office Helpdesk (Sanjay Shinde)
              </p>
            </div>

            {/* TKT-9195 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  <span className="text-blue-600 font-mono">TKT-9195</span> Roads &amp; Infrastructure
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">CRITICAL</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">RESOLVED</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Deep pothole causing accidents near Erandwane fire station crossing.
              </p>
              <p className="text-[10px] text-slate-400">
                Visitor: Mahesh Balkrishna Kadam • Assigned: Sachin Babar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: VOTER INTELLIGENCE & POLITICAL LEANING (SCREENSHOT 7)          */}
      {/* ========================================================================= */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Voter Intelligence &amp; Demographic Distribution</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Constituency voter segmentation across age cohorts, gender ratio, and social clusters.
            </p>
          </div>
          <Link href="/voters" className="text-xs font-bold text-blue-600 hover:text-blue-700">
            Explore Full Board &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1 text-xs">
          {/* Col 1: Age Demographics */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex justify-between font-bold text-slate-900">
              <span>Age Demographics</span>
              <span className="text-slate-500 font-mono">Total: 21.54 L</span>
            </div>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>18 - 25 Yrs (Youth First-Time)</span>
                  <span className="font-bold">3.98 L (18.5%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "18.5%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>26 - 40 Yrs (Working Core)</span>
                  <span className="font-bold">8.23 L (38.2%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: "38.2%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>41 - 60 Yrs (Family Heads)</span>
                  <span className="font-bold">5.84 L (27.1%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: "27.1%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>60+ Yrs (Senior Citizens)</span>
                  <span className="font-bold">3.49 L (16.2%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "16.2%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Gender Ratio & Turnout */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex justify-between font-bold text-slate-900">
              <span>Gender Ratio &amp; Turnout Inclination</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                944 F/1000 M
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">MALE VOTERS</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">11.07 L</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">51.4% (67% Projected Turnout)</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">FEMALE VOTERS</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">10.45 L</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">48.5% (71% Projected Turnout)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-pink-50 border border-pink-200/80 text-[11px] text-pink-900">
              <strong className="block mb-0.5">Women Mobilization Signal:</strong>
              Ladki Bahin scheme recipients in Wards 12 &amp; 13 show 74% strong turnout intent.
            </div>
          </div>

          {/* Col 3: Social & Demographic Clusters */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex justify-between font-bold text-slate-900">
              <span>Social &amp; Demographic Clusters</span>
              <span className="text-slate-400 text-[11px]">Sample Model</span>
            </div>

            <div className="space-y-2 font-medium text-slate-700">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" />Maratha Community</span>
                <span className="font-bold text-slate-900">22.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-600" />OBC Clusters (Mali, Vanjari, Dhangar)</span>
                <span className="font-bold text-slate-900">14.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600" />Brahmin Demographic</span>
                <span className="font-bold text-slate-900">10.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-600" />SC (Neo-Buddhist &amp; Matang)</span>
                <span className="font-bold text-slate-900">9.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-600" />Muslim Community</span>
                <span className="font-bold text-slate-900">6.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Other Mixed Classifications</span>
                <span className="font-bold text-slate-900">36.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voter Classification & Political Leaning Intelligence */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Voter Classification &amp; Political Leaning Intelligence</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Electoral sentiment segmentation derived from verified field surveys and household interactions.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              16.82 L SAMPLED (78.2% SURVEYED)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">SUPPORTERS</span>
              <span className="text-base font-black text-blue-900 block mt-0.5">7.87 L</span>
              <span className="text-[10px] text-blue-600 mt-0.5 block">46.8% of surveyed</span>
            </div>
            <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200">
              <span className="text-[10px] font-bold text-cyan-700 uppercase block">LEANING FAVORABLE</span>
              <span className="text-base font-black text-cyan-900 block mt-0.5">2.35 L</span>
              <span className="text-[10px] text-cyan-600 mt-0.5 block">14.0% favorable</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">NEUTRAL</span>
              <span className="text-base font-black text-amber-900 block mt-0.5">2.69 L</span>
              <span className="text-[10px] text-amber-600 mt-0.5 block">16.0% neutral</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-[10px] font-bold text-purple-700 uppercase block">UNDECIDED / SWING</span>
              <span className="text-base font-black text-purple-900 block mt-0.5">3.11 L</span>
              <span className="text-[10px] text-purple-600 mt-0.5 block">18.5% core swing</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">OPPOSITION</span>
              <span className="text-base font-black text-rose-900 block mt-0.5">0.80 L</span>
              <span className="text-[10px] text-rose-600 mt-0.5 block">4.8% opponent</span>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">UNCLASSIFIED</span>
              <span className="text-base font-black text-slate-700 block mt-0.5">1.72 L</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Pending survey</span>
            </div>
          </div>

          {/* Net Leaning Bar */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Constituency Field Leaning Balance</span>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
              <div className="bg-blue-600 h-3" style={{ width: "46.8%" }} title="Supporters: 46.8%" />
              <div className="bg-cyan-500 h-3" style={{ width: "14.0%" }} title="Leaning Favorable: 14.0%" />
              <div className="bg-amber-400 h-3" style={{ width: "16.0%" }} title="Neutral: 16.0%" />
              <div className="bg-purple-500 h-3" style={{ width: "18.5%" }} title="Swing: 18.5%" />
              <div className="bg-rose-500 h-3" style={{ width: "4.8%" }} title="Opposition: 4.8%" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: COMMUNITY & LOCAL STAKEHOLDER STATISTICS (SCREENSHOT 8)       */}
      {/* ========================================================================= */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Community &amp; Local Stakeholder Statistics</h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                LIVE CENTRALIZED RECORDS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregate real-time intelligence on voluntary farmer, worker, cooperative, and grassroots associations across authorized elector rolls.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Refreshed: 22:50</span>
            </span>
            <Link href="/voters" className="font-bold text-blue-600 hover:text-blue-700">
              Filter Electors &rarr;
            </Link>
          </div>
        </div>

        {/* 12 Stat Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center text-xs">
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block truncate">TOTAL ASSOCIATED ELECT...</span>
            <span className="text-lg font-black text-emerald-900 mt-0.5 block">8</span>
            <span className="text-[10px] text-slate-500 block truncate">Unique Electors (Counted Once)</span>
          </div>

          <div className="p-3 bg-green-50/70 rounded-xl border border-green-200/80">
            <span className="text-[10px] font-bold text-green-700 uppercase block truncate">FARMERS &amp; AGRICULTURE</span>
            <span className="text-lg font-black text-green-900 mt-0.5 block">1</span>
            <span className="text-[10px] text-slate-500 block truncate">Farmers &amp; Assocs.</span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
            <span className="text-[10px] font-bold text-amber-700 uppercase block truncate">SUGAR FACTORY WORKERS</span>
            <span className="text-lg font-black text-amber-900 mt-0.5 block">1</span>
            <span className="text-[10px] text-slate-500 block truncate">Sugar Mill &amp; Cane Coop</span>
          </div>

          <div className="p-3 bg-pink-50/70 rounded-xl border border-pink-200/80">
            <span className="text-[10px] font-bold text-pink-700 uppercase block truncate">ANGANWADI / BALWADI</span>
            <span className="text-lg font-black text-pink-900 mt-0.5 block">1</span>
            <span className="text-[10px] text-slate-500 block truncate">Childcare Volunteers</span>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80">
            <span className="text-[10px] font-bold text-blue-700 uppercase block truncate">VILLAGE COMMUNITY</span>
            <span className="text-lg font-black text-blue-900 mt-0.5 block">1</span>
            <span className="text-[10px] text-slate-500 block truncate">Village Active Members</span>
          </div>

          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/80">
            <span className="text-[10px] font-bold text-purple-700 uppercase block truncate">LOCAL STAKEHOLDERS</span>
            <span className="text-lg font-black text-purple-900 mt-0.5 block">2</span>
            <span className="text-[10px] text-slate-500 block truncate">Trade &amp; RWA Guilds</span>
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200/80">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block truncate">COOPERATIVE SOCIETIES</span>
            <span className="text-lg font-black text-indigo-900 mt-0.5 block">2</span>
            <span className="text-[10px] text-slate-500 block truncate">Patsanstha &amp; Credit</span>
          </div>

          <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200/80">
            <span className="text-[10px] font-bold text-teal-700 uppercase block truncate">SHG MEMBERS (BACHAT G...</span>
            <span className="text-lg font-black text-teal-900 mt-0.5 block">3</span>
            <span className="text-[10px] text-slate-500 block truncate">Women Self-Help</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-600 uppercase block truncate">OTHER COMMUNITY GRO...</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">1</span>
            <span className="text-[10px] text-slate-500 block truncate">Special Collectives</span>
          </div>

          <div className="p-3 bg-yellow-50/70 rounded-xl border border-yellow-200/80">
            <span className="text-[10px] font-bold text-yellow-700 uppercase block truncate">PENDING VERIFICATION</span>
            <span className="text-lg font-black text-yellow-900 mt-0.5 block">2</span>
            <span className="text-[10px] text-slate-500 block truncate">Unverified Intake</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">NOT DISCLOSED</span>
            <span className="text-lg font-black text-slate-700 mt-0.5 block">1</span>
            <span className="text-[10px] text-slate-500 block truncate">Declaration Opt-out</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">NOT ASSOCIATED</span>
            <span className="text-lg font-black text-slate-700 mt-0.5 block">1</span>
            <span className="text-[10px] text-slate-500 block truncate">Confirmed Independent</span>
          </div>
        </div>

        {/* Bottom Sub-Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2 text-xs">
          {/* Card 1: Community Group Distribution */}
          <div className="lg:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex justify-between font-bold text-slate-900">
              <span>1. Community Group Distribution</span>
              <span className="text-slate-500 font-mono">12 Total Recorded</span>
            </div>

            {/* Segmented Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
              <div className="bg-emerald-500 h-2.5" style={{ width: "8.3%" }} />
              <div className="bg-amber-500 h-2.5" style={{ width: "8.3%" }} />
              <div className="bg-pink-500 h-2.5" style={{ width: "8.3%" }} />
              <div className="bg-blue-500 h-2.5" style={{ width: "8.3%" }} />
              <div className="bg-purple-500 h-2.5" style={{ width: "16.7%" }} />
              <div className="bg-indigo-500 h-2.5" style={{ width: "16.7%" }} />
              <div className="bg-teal-500 h-2.5" style={{ width: "25%" }} />
              <div className="bg-slate-400 h-2.5" style={{ width: "8.3%" }} />
            </div>

            {/* 8-Item Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium text-slate-700">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Agriculture: 1 (8%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Sugar Industry: 1 (8%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500" />Childcare: 1 (8%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Village: 1 (8%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" />Local Orgs: 2 (17%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" />Cooperatives: 2 (17%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500" />Self-Help Groups: 3 (25%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" />Other: 1 (8%)</div>
            </div>
          </div>

          {/* Right Cards: Verification & Constituency */}
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex justify-between font-bold text-slate-900 mb-2">
                <span>3. Verification Overview</span>
                <span className="text-emerald-600">83% Validated</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center font-bold">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                  Verified: 10
                </div>
                <div className="p-2 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                  Pending: 2
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex justify-between font-bold text-slate-900 mb-1">
                <span>4. Constituency-wise Distribution</span>
                <span className="text-slate-400 text-[10px]">By Assembly Segment</span>
              </div>
              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>215 - Kasba Peth</span>
                  <span className="font-bold">7 (58%)</span>
                </div>
                <div className="flex justify-between">
                  <span>214 - Kothrud</span>
                  <span className="font-bold">5 (42%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11: WORKFORCE MOBILIZATION & TASK MANAGEMENT (SCREENSHOT 9 & 10)  */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        {/* Top: Cadre Mobilization Summary & Table (Screenshot 9) */}
        <div className="bg-white dark:bg-[#151E2D] p-5 rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#29364A] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Field Operations &amp; Workforce Intelligence
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
                Real-time tracking of karyakarta deployments, surveys executed, voter slip delivery, and live field status.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 dark:bg-[#1B2638] rounded-xl border border-slate-200/80 dark:border-[#29364A]">
              <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase block">TOTAL CADRE</span>
              <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">4,850</span>
              <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] block">Registered Karyakartas</span>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-800/60">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase block">ACTIVE ON FIELD</span>
              <span className="text-lg font-black text-blue-900 dark:text-blue-300 mt-0.5 block">3,120</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 block">64.3% Real-time deployed</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#1B2638] rounded-xl border border-slate-200/80 dark:border-[#29364A]">
              <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase block">INACTIVE / STANDBY</span>
              <span className="text-lg font-black text-slate-700 dark:text-slate-300 mt-0.5 block">1,730</span>
              <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] block">Available for reserve</span>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-800/60">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block">SURVEYS DONE</span>
              <span className="text-lg font-black text-indigo-900 dark:text-indigo-300 mt-0.5 block">16.82 L</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block">78.2% Completion</span>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200/80 dark:border-purple-800/60">
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase block">ASSIGNED BOOTHS</span>
              <span className="text-lg font-black text-purple-900 dark:text-purple-300 mt-0.5 block">2,038</span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 block">99.6% Booth coverage</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase block">UNASSIGNED BOOTHS</span>
              <span className="text-lg font-black text-amber-900 dark:text-amber-300 mt-0.5 block">7</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 block">Requires table agents</span>
            </div>
          </div>

          {/* Workforce Mobilization Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#29364A]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1B2638] border-b border-slate-200 dark:border-[#29364A] text-slate-500 dark:text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">KARYAKARTA NAME</th>
                  <th className="py-3 px-3">PRABHAAG &amp; ASSIGNED BOOTH</th>
                  <th className="py-3 px-3">SURVEYS COMPLETED</th>
                  <th className="py-3 px-3">VOTER SLIPS HANDED</th>
                  <th className="py-3 px-3">FIELD STATUS</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#29364A] font-medium">
                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center">
                      Po
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Pooja Jadhav</span>
                  </td>
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 dark:text-white block">Booth #101</strong>
                    <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">Prabhaag 12 - Kothrud West</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">184</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">420</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 whitespace-nowrap">
                      Active on Field
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => showToast("info", "GPS Locator", "Pinging Pooja Jadhav: Navbharat School corridor")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#2A374A] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap"
                    >
                      Locate GPS
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center">
                      Ga
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Ganesh Patil</span>
                  </td>
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 dark:text-white block">Booth #102</strong>
                    <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">Prabhaag 12 - Kothrud West</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">210</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">512</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 whitespace-nowrap">
                      Active on Field
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => showToast("info", "GPS Locator", "Pinging Ganesh Patil: Saraswati Vidyalaya Gate")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#2A374A] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap"
                    >
                      Locate GPS
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center">
                      Vi
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Vikas More</span>
                  </td>
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 dark:text-white block">Booth #104</strong>
                    <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">Prabhaag 13 - Erandwane</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">95</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">230</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      Offline
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => showToast("warning", "GPS Offline", "Vikas More terminal last reported 2 hours ago")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#2A374A] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap"
                    >
                      Locate GPS
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center">
                      Su
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Supriya Salve</span>
                  </td>
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 dark:text-white block">Booth #106</strong>
                    <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">Prabhaag 14 - Shivajinagar</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">142</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">310</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 whitespace-nowrap">
                      Active on Field
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => showToast("info", "GPS Locator", "Pinging Supriya Salve: Modern High School Desk")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#2A374A] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap"
                    >
                      Locate GPS
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center">
                      Am
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Amol Chordia</span>
                  </td>
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 dark:text-white block">Booth #103</strong>
                    <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">Prabhaag 12 - Kothrud West</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-400 dark:text-[#94A3B8]">0</td>
                  <td className="py-3 px-3 font-bold text-slate-400 dark:text-[#94A3B8]">0</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      Offline
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => showToast("warning", "GPS Offline", "Amol Chordia terminal currently offline")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#29364A] bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#2A374A] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap"
                    >
                      Locate GPS
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom: War Room Task Management (Screenshot 9 & 10) */}
        <div className="bg-white dark:bg-[#151E2D] p-5 rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">War Room Task Management</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
                Operational directives assigned to booth adhyaksh, karyakartas, and war room coordinators.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#101827] p-1 rounded-xl text-xs font-semibold border border-slate-200/80 dark:border-[#29364A]">
              {(["ALL", "OVERDUE", "IN PROGRESS", "PENDING", "COMPLETED"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTaskFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    taskFilter === tab
                      ? "bg-white dark:bg-[#243247] text-slate-900 dark:text-white shadow-xs font-bold dark:border dark:border-[#3E4F68]"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Summary Boxes (Screenshot 10) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-[#1B2638] rounded-xl border border-slate-200 dark:border-[#29364A]">
              <span className="text-[10px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase block">TOTAL TASKS</span>
              <span className="text-base font-black text-slate-900 dark:text-white block mt-0.5">6</span>
            </div>
            <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/60">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase block">ASSIGNED</span>
              <span className="text-base font-black text-blue-900 dark:text-blue-300 block mt-0.5">6</span>
            </div>
            <div className="p-2.5 bg-cyan-50/60 dark:bg-cyan-950/40 rounded-xl border border-cyan-200 dark:border-cyan-800/60">
              <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase block">IN PROGRESS</span>
              <span className="text-base font-black text-cyan-900 dark:text-cyan-300 block mt-0.5">3</span>
            </div>
            <div className="p-2.5 bg-yellow-50/60 dark:bg-yellow-950/40 rounded-xl border border-yellow-200 dark:border-yellow-800/60">
              <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-400 uppercase block">PENDING</span>
              <span className="text-base font-black text-yellow-900 dark:text-yellow-300 block mt-0.5">1</span>
            </div>
            <div className="p-2.5 bg-rose-50/60 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/60">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase block">OVERDUE</span>
              <span className="text-base font-black text-rose-900 dark:text-rose-300 block mt-0.5">1</span>
            </div>
            <div className="p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/60">
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase block">COMPLETED</span>
              <span className="text-base font-black text-purple-900 dark:text-purple-300 block mt-0.5">1</span>
            </div>
          </div>

          {/* Task Management Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#29364A]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1B2638] border-b border-slate-200 dark:border-[#29364A] text-slate-500 dark:text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">TASK ID &amp; DIRECTIVE</th>
                  <th className="py-3 px-3">ASSIGNED PERSON &amp; ROLE</th>
                  <th className="py-3 px-3">BOOTH</th>
                  <th className="py-3 px-3">PRIORITY</th>
                  <th className="py-3 px-3">DEADLINE</th>
                  <th className="py-3 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#29364A] font-medium">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{t.id}</span>
                      <span className="text-slate-800 dark:text-white font-semibold">{t.title}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{t.assignedTo}</p>
                      <p className="text-[11px] text-slate-400 dark:text-[#94A3B8]">{t.assignedRole}</p>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700 dark:text-slate-200">Booth #{t.boothNumber}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === "CRITICAL"
                            ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60"
                            : t.priority === "HIGH"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                            : t.priority === "MEDIUM"
                            ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">{t.deadline}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === "OVERDUE"
                            ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60"
                            : t.status === "IN PROGRESS"
                            ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60"
                            : t.status === "PENDING"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                            : "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 12: LIVE MONITORING & CRITICAL ALERTS STACK (SCREENSHOT 11)       */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        {/* Top: Live War Room Monitoring */}
        <div className="bg-white dark:bg-[#151E2D] p-5 rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Live War Room Monitoring</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                Live telemetry aggregated from active Android terminals, web kiosks, and field dispatchers.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60">
              Real-Time Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-blue-50/50 dark:bg-[#1B2638] rounded-xl border border-blue-100 dark:border-[#29364A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Active Polling Stations</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium">2,038 of 2,045 operational</p>
                </div>
              </div>
              <span className="font-black text-sm text-blue-700 dark:text-blue-400">99.6%</span>
            </div>

            <div className="p-3.5 bg-emerald-50/50 dark:bg-[#1B2638] rounded-xl border border-emerald-100 dark:border-[#29364A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Active Field Mobilizers</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium">GPS pinging within 15 mins</p>
                </div>
              </div>
              <span className="font-black text-sm text-emerald-700 dark:text-emerald-400">3,120</span>
            </div>

            <div className="p-3.5 bg-amber-50/50 dark:bg-[#1B2638] rounded-xl border border-amber-100 dark:border-[#29364A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 flex items-center justify-center font-bold">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Critical Flagged Issues</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium">Action required by coordinators</p>
                </div>
              </div>
              <span className="font-black text-sm text-amber-700 dark:text-amber-400">4</span>
            </div>

            <div className="p-3.5 bg-purple-50/50 dark:bg-[#1B2638] rounded-xl border border-purple-100 dark:border-[#29364A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Last Global Telemetry Sync</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium">ECI server connection verified</p>
                </div>
              </div>
              <span className="font-black text-sm text-purple-700 dark:text-purple-400">Just now</span>
            </div>
          </div>
        </div>

        {/* Bottom: Alerts & Attention Required (Screenshot 11) */}
        <div className="bg-white dark:bg-[#151E2D] p-5 rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Alerts &amp; Attention Required</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                Actionable operational bottlenecks, lagging booth coverage, and overdue assignments requiring intervention.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#101827] p-1 rounded-xl text-xs font-semibold border border-slate-200/80 dark:border-[#29364A]">
              {(["ALL", "CRITICAL", "HIGH", "WARNING"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setAlertFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    alertFilter === tab
                      ? "bg-white dark:bg-[#243247] text-slate-900 dark:text-white shadow-xs font-bold dark:border dark:border-[#3E4F68]"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab === "ALL" ? "All Alerts" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Stack of Alert Cards */}
          <div className="space-y-3">
            {filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  alt.severity === "CRITICAL"
                    ? "bg-rose-50/50 border-rose-200 dark:bg-[#221318] dark:border-[#881337]/60"
                    : alt.severity === "HIGH"
                    ? "bg-amber-50/50 border-amber-200 dark:bg-[#22170D] dark:border-[#78350F]/60"
                    : "bg-slate-50 border-slate-200 dark:bg-[#1B2638] dark:border-[#29364A]"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alt.severity === "CRITICAL"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 dark:border dark:border-rose-800/50"
                          : alt.severity === "HIGH"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/50"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700"
                      }`}
                    >
                      {alt.severity}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      {alt.category}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-300 font-mono">{alt.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{alt.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-normal">{alt.description}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium">
                    <span className="text-slate-400 dark:text-slate-400">Affected Area:</span> {alt.affectedArea}
                  </p>
                </div>

                <Link
                  href={alt.actionHref}
                  className={`px-4 py-2 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto ${
                    alt.severity === "CRITICAL"
                      ? "bg-[#E11D48] hover:bg-[#BE123C]"
                      : "bg-[#F59E0B] hover:bg-[#D97706]"
                  }`}
                >
                  {alt.actionLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 13: DATA QUALITY & RECENT ACTIVITY FEED (SCREENSHOT 12)           */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        {/* Data Quality & Integrity (Dark Navy Cards!) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Data Quality &amp; Electoral Roll Integrity Metrics</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit status of voter contacts, photo rolls, geospatial coordinates, and duplicate indices.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              ROLL HEALTH: 96.2% OPTIMAL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Dark Card 1 */}
            <div className="p-4 rounded-xl bg-[#0B1527] border border-slate-800 text-white space-y-2">
              <span className="text-[11px] text-slate-400 block font-medium">Mobile Contact Seeding:</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-white">89.4%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "89.4%" }} />
              </div>
              <span className="text-[10px] text-slate-400 block">19.25 L reachable phones</span>
            </div>

            {/* Dark Card 2 */}
            <div className="p-4 rounded-xl bg-[#0B1527] border border-slate-800 text-white space-y-2">
              <span className="text-[11px] text-slate-400 block font-medium">ECI Photo Roll Clarity:</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-white">98.1%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: "98.1%" }} />
              </div>
              <span className="text-[10px] text-slate-400 block">High-resolution ECI portraits</span>
            </div>

            {/* Dark Card 3 */}
            <div className="p-4 rounded-xl bg-[#0B1527] border border-slate-800 text-white space-y-2">
              <span className="text-[11px] text-slate-400 block font-medium">Geotagged Address Accuracy:</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-white">94.7%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "94.7%" }} />
              </div>
              <span className="text-[10px] text-slate-400 block">Matched to Prabhaag boundary</span>
            </div>

            {/* Dark Card 4 */}
            <div className="p-4 rounded-xl bg-[#0B1527] border border-slate-800 text-white space-y-2">
              <span className="text-[11px] text-slate-400 block font-medium">Duplicate Detection Index:</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-white">0.3% (Low Risk)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-slate-600 h-1.5 rounded-full" style={{ width: "0.3%" }} />
              </div>
              <span className="text-[10px] text-slate-400 block">Cross-booth deduplicated</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed (Screenshot 12) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Recent Activity Feed</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chronological operational log across voter registrations, surveys, tasks, and grievances.
              </p>
            </div>
            <Link href="/activities" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View Full Audit Trail &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* Act 1 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">SLIP</span>
                <span className="text-slate-400 text-[10px]">2m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 mt-1">Pooja Jadhav</h5>
              <p className="text-slate-600">Delivered 8 voter information slips</p>
              <p className="text-slate-400 text-[11px]">Booth 101 Navbharat High School</p>
            </div>

            {/* Act 2 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">OFFICE</span>
                <span className="text-slate-400 text-[10px]">7m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 mt-1">Office Reception</h5>
              <p className="text-slate-600">Registered grievance #TKT-9210 (Water Supply)</p>
              <p className="text-slate-400 text-[11px]">Dahanukar Colony Lane 3</p>
            </div>

            {/* Act 3 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">SURVEY</span>
                <span className="text-slate-400 text-[10px]">14m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 mt-1">Ganesh Patil</h5>
              <p className="text-slate-600">Logged new household survey (Supporter classified)</p>
              <p className="text-slate-400 text-[11px]">Booth 102 Kothrud Depot</p>
            </div>

            {/* Act 4 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800">CAMPAIGN</span>
                <span className="text-slate-400 text-[10px]">28m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 mt-1">Broadcast Server</h5>
              <p className="text-slate-600">WhatsApp Campaign CMP-01 reached 96% delivery threshold</p>
              <p className="text-slate-400 text-[11px]">Ward 12 Broadcast Node</p>
            </div>

            {/* Act 5 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">BLO</span>
                <span className="text-slate-400 text-[10px]">42m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 mt-1">Sanjay Kulkarni (BLO)</h5>
              <p className="text-slate-600">ECI electoral roll amendment verified (14 additions)</p>
              <p className="text-slate-400 text-[11px]">Booth 101 Electoral Table</p>
            </div>

            {/* Act 6 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">CADRE</span>
                <span className="text-slate-400 text-[10px]">55m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 mt-1">Amit Deshmukh</h5>
              <p className="text-slate-600">Reassigned 2 standby karyakartas to Paud Phata swing sector</p>
              <p className="text-slate-400 text-[11px]">Booth 103 Desk</p>
            </div>
          </div>
        </div>

        {/* Live Feedback & Voter Sentiment Card */}
        <div className="bg-white dark:bg-[#151E2D] p-5 rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:!text-white text-sm">Live Feedback &amp; Citizen Reactions</h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Stream
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:!text-slate-300 mt-0.5">
                Real-time feedback collected by booth karyakartas, WhatsApp citizen lines, and outbound IVR calls.
              </p>
            </div>
            <Link href="/feedback" className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Open Live Feedback Hub &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-emerald-50/50 dark:bg-[#13231D] rounded-xl border border-emerald-100 dark:border-emerald-800/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/50">POSITIVE</span>
                <span className="text-slate-400 dark:!text-slate-300 text-[10px] font-medium">4m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 dark:!text-white mt-1">Ramesh N. Joshi (Booth #101)</h5>
              <p className="text-slate-600 dark:!text-slate-200 text-xs leading-relaxed font-normal">Voter slip delivered at home. Entire 5-member family confirmed support for our candidate.</p>
              <p className="text-slate-400 dark:!text-slate-400 text-[11px] font-medium">Reported by: <span className="text-slate-500 dark:!text-slate-200 font-semibold">Pooja Jadhav (Karyakarta)</span></p>
            </div>

            <div className="p-3 bg-rose-50/50 dark:bg-[#221318] rounded-xl border border-rose-100 dark:border-rose-900/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 dark:border dark:border-rose-800/50">URGENT</span>
                <span className="text-slate-400 dark:!text-slate-300 text-[10px] font-medium">12m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 dark:!text-white mt-1">Sunita A. Deshmukh (Booth #102)</h5>
              <p className="text-slate-600 dark:!text-slate-200 text-xs leading-relaxed font-normal">Drinking water low pressure in Dahanukar Colony Lane 3. Tanker requested urgently.</p>
              <p className="text-slate-400 dark:!text-slate-400 text-[11px] font-medium">Via: <span className="text-slate-500 dark:!text-slate-200 font-semibold">Citizen WhatsApp Line</span></p>
            </div>

            <div className="p-3 bg-amber-50/50 dark:bg-[#22170D] rounded-xl border border-amber-100 dark:border-amber-900/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/50">SWING</span>
                <span className="text-slate-400 dark:!text-slate-300 text-[10px] font-medium">28m ago</span>
              </div>
              <h5 className="font-bold text-slate-900 dark:!text-white mt-1">Amit S. Kulkarni (Booth #103)</h5>
              <p className="text-slate-600 dark:!text-slate-200 text-xs leading-relaxed font-normal">Answered AI voice call. Expressed satisfaction with candidate, asked for Paud Phata traffic solution.</p>
              <p className="text-slate-400 dark:!text-slate-400 text-[11px] font-medium">Via: <span className="text-slate-500 dark:!text-slate-200 font-semibold">AI Outbound Call Survey</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 14: VOTER SLIPS & WORKFORCE DISPATCH STREAM (SCREENSHOT 13 & 14)  */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        {/* Top: Voter Slip Generation & Distribution Analytics (Screenshot 13) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Voter Slip Generation &amp; Distribution Analytics</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Constituency-wide throughput of printed, digital WhatsApp slips, and door-to-door handovers.
              </p>
            </div>
            <Link href="/voters" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              Launch Slip Batch Generator &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">TOTAL SLIPS NEEDED</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">21.54 L</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">100% Electors</span>
            </div>
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">SLIPS GENERATED</span>
              <span className="text-base font-black text-blue-900 block mt-0.5">19.82 L</span>
              <span className="text-[10px] text-blue-600 mt-0.5 block">92.0% Prepared</span>
            </div>
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200">
              <span className="text-[10px] font-bold text-purple-700 uppercase block">DELIVERED TO ELECTORS</span>
              <span className="text-base font-black text-purple-900 block mt-0.5">18.23 L</span>
              <span className="text-[10px] text-purple-600 mt-0.5 block">84.6% Handed Over</span>
            </div>
            <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200">
              <span className="text-[10px] font-bold text-teal-700 uppercase block">DIGITAL WHATSAPP SLIPS</span>
              <span className="text-base font-black text-teal-900 block mt-0.5">12.45 L</span>
              <span className="text-[10px] text-teal-600 mt-0.5 block">Delivered on mobile</span>
            </div>
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block">THERMAL PRINTED SLIPS</span>
              <span className="text-base font-black text-indigo-900 block mt-0.5">5.78 L</span>
              <span className="text-[10px] text-indigo-600 mt-0.5 block">Field printer dispatched</span>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">PENDING SLIPS</span>
              <span className="text-base font-black text-amber-900 block mt-0.5">3.31 L</span>
              <span className="text-[10px] text-amber-600 mt-0.5 block">Target for remaining days</span>
            </div>
          </div>

          {/* Booth-Wise Slip Distribution Performance Sample */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="font-bold text-slate-800">Booth-Wise Slip Distribution Performance Sample</span>
              <span className="text-slate-400 text-[11px]">Showing representative sample of polling stations</span>
            </div>

            <div className="space-y-3">
              {/* Booth 101 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Booth #101: Kothrud Depot Road</span>
                  <span className="text-blue-600 font-bold">92%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "92%" }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                  <span>1,051 delivered</span>
                  <span>91 remaining</span>
                </div>
              </div>

              {/* Booth 102 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Booth #102: Kothrud Depot Road</span>
                  <span className="text-blue-600 font-bold">88%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "88%" }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                  <span>1,060 delivered</span>
                  <span>145 remaining</span>
                </div>
              </div>

              {/* Booth 103 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Booth #103: Paud Phata</span>
                  <span className="text-amber-600 font-bold">74%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "74%" }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                  <span>725 delivered</span>
                  <span>255 remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Side-by-Side Workforce Assignments (Large ~67%) & Live War Room Activity Stream (Small Rectangle ~33%) (Screenshot 14) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left: Workforce Assignments & Field Cadre Performance (Large 2/3) */}
          <div className="lg:col-span-2 min-w-0 bg-white dark:bg-[#151E2D] p-5 rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Workforce Assignments &amp; Field Cadre Performance</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                    Top karyakarta mobilizers ranked by door-to-door surveys and voter slips handed over.
                  </p>
                </div>
                <Link href="/users" className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 whitespace-nowrap shrink-0">
                  All 4,850 Cadre &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#29364A] custom-scroll">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#1B2638] border-b border-slate-200 dark:border-[#29364A] text-slate-500 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 whitespace-nowrap">KARYAKARTA</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">PRABHAAG &amp; BOOTH</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">SURVEYS</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">SLIPS HANDED</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">FIELD STATUS</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#29364A] font-medium">
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                            Po
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">Pooja Jadhav</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <strong className="text-slate-900 dark:text-white block font-bold leading-tight">Booth #101</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">Prabhaag 12 • Kothrud West</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">184</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">420</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60 whitespace-nowrap">
                          Active on Field
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => showToast("info", "GPS Locator", "Pinging Pooja Jadhav: Navbharat School corridor")}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#3E4F68] bg-white dark:bg-[#243247] hover:bg-slate-50 dark:hover:bg-[#2E3E58] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all shadow-xs active:scale-95"
                        >
                          Locate GPS
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                            Ga
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">Ganesh Patil</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <strong className="text-slate-900 dark:text-white block font-bold leading-tight">Booth #102</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">Prabhaag 12 • Kothrud West</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">210</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">512</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60 whitespace-nowrap">
                          Active on Field
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => showToast("info", "GPS Locator", "Pinging Ganesh Patil: Saraswati Vidyalaya Gate")}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#3E4F68] bg-white dark:bg-[#243247] hover:bg-slate-50 dark:hover:bg-[#2E3E58] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all shadow-xs active:scale-95"
                        >
                          Locate GPS
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                            Vi
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">Vikas More</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <strong className="text-slate-900 dark:text-white block font-bold leading-tight">Booth #104</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">Prabhaag 13 • Erandwane</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">95</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">230</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700 whitespace-nowrap">
                          Offline
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => showToast("warning", "GPS Offline", "Vikas More terminal last reported 2 hours ago")}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#3E4F68] bg-white dark:bg-[#243247] hover:bg-slate-50 dark:hover:bg-[#2E3E58] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all shadow-xs active:scale-95"
                        >
                          Locate GPS
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                            Su
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">Supriya Salve</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <strong className="text-slate-900 dark:text-white block font-bold leading-tight">Booth #106</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">Prabhaag 14 • Shivajinagar</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">142</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">310</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60 whitespace-nowrap">
                          Active on Field
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => showToast("info", "GPS Locator", "Pinging Supriya Salve: Modern High School Desk")}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#3E4F68] bg-white dark:bg-[#243247] hover:bg-slate-50 dark:hover:bg-[#2E3E58] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all shadow-xs active:scale-95"
                        >
                          Locate GPS
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 dark:hover:bg-[#1B2638]/60 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                            Am
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">Amol Chordia</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <strong className="text-slate-900 dark:text-white block font-bold leading-tight">Booth #103</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">Prabhaag 12 • Kothrud West</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400 whitespace-nowrap">0</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400 whitespace-nowrap">0</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700 whitespace-nowrap">
                          Offline
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => showToast("warning", "GPS Offline", "Amol Chordia terminal currently offline")}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#3E4F68] bg-white dark:bg-[#243247] hover:bg-slate-50 dark:hover:bg-[#2E3E58] text-slate-700 dark:text-white font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all shadow-xs active:scale-95"
                        >
                          Locate GPS
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Live War Room Activity Stream (Small Rectangle 1/3) (Screenshot 14) */}
          <div className="lg:col-span-1 min-w-0 bg-white dark:bg-[#151E2D] p-5 rounded-2xl border border-slate-200 dark:border-[#29364A] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Live War Room Activity Stream</h3>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60 shrink-0">
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Real-time audit log of surveys, slip distributions, and field grievance escalations.
              </p>

              {/* Feed Items Stack */}
              <div className="space-y-2.5 mt-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-[#1B2638] rounded-xl border border-slate-200/80 dark:border-[#29364A] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 dark:border dark:border-blue-800/50">SLIP</span>
                    <span className="text-slate-400 dark:text-slate-300 text-[10px] font-medium">2m ago</span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white mt-1">Pooja Jadhav</h5>
                  <p className="text-slate-600 dark:text-slate-200 text-xs leading-relaxed font-normal">Delivered 8 voter information slips</p>
                  <p className="text-slate-400 dark:text-slate-400 text-[11px] font-medium">Booth 101</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#1B2638] rounded-xl border border-slate-200/80 dark:border-[#29364A] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/50">OFFICE</span>
                    <span className="text-slate-400 dark:text-slate-300 text-[10px] font-medium">7m ago</span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white mt-1">Office Reception</h5>
                  <p className="text-slate-600 dark:text-slate-200 text-xs leading-relaxed font-normal">Registered grievance #TKT-9210 (Water Supply)</p>
                  <p className="text-slate-400 dark:text-slate-400 text-[11px] font-medium">Kothrud</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#1B2638] rounded-xl border border-slate-200/80 dark:border-[#29364A] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 dark:border dark:border-purple-800/50">SURVEY</span>
                    <span className="text-slate-400 dark:text-slate-300 text-[10px] font-medium">14m ago</span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white mt-1">Ganesh Patil</h5>
                  <p className="text-slate-600 dark:text-slate-200 text-xs leading-relaxed font-normal">Logged new household survey (Supporter classified)</p>
                  <p className="text-slate-400 dark:text-slate-400 text-[11px] font-medium">Booth 102</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#1B2638] rounded-xl border border-slate-200/80 dark:border-[#29364A] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border dark:border-cyan-800/50">CAMPAIGN</span>
                    <span className="text-slate-400 dark:text-slate-300 text-[10px] font-medium">28m ago</span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white mt-1">Broadcast Server</h5>
                  <p className="text-slate-600 dark:text-slate-200 text-xs leading-relaxed font-normal">WhatsApp Campaign CMP-01 reached 96% delivery threshold</p>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <Link
              href="/activities"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-[#243247] dark:hover:bg-[#2E3E58] dark:border dark:border-[#3E4F68] text-slate-700 dark:text-white rounded-xl text-xs font-bold text-center block transition-all shadow-xs cursor-pointer"
            >
              View Complete Activity Audit Log
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
