"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Vote,
  BadgeCheck,
  Shield,
  BarChart3,
  BookOpen,
  AlertCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Search,
  CheckCircle2,
  UserPlus,
  Zap,
  Layers,
  Navigation,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";

interface BoothReadinessRow {
  boothNumber: string;
  stationName: string;
  locality: string;
  voters: number;
  grade: "Grade A" | "Grade B - Swing" | "Grade D - Swing";
  bloName: string;
  bloPhone: string;
  karyakartasAssigned: number;
  slipDeliveryPercent: number;
  projectedTurnout: string;
  lastTurnout: string;
}

const BOOTH_DATA: BoothReadinessRow[] = [
  {
    boothNumber: "#101",
    stationName: "Navbharat High School, Room 1",
    locality: "Kothrud Depot Road",
    voters: 1142,
    grade: "Grade A",
    bloName: "Sanjay K. Kulkarni",
    bloPhone: "+91 98220 11234",
    karyakartasAssigned: 5,
    slipDeliveryPercent: 92,
    projectedTurnout: "74%",
    lastTurnout: "68.4%",
  },
  {
    boothNumber: "#102",
    stationName: "Navbharat High School, Room 2",
    locality: "Kothrud Depot Road",
    voters: 1205,
    grade: "Grade A",
    bloName: "Asha V. More",
    bloPhone: "+91 98220 54321",
    karyakartasAssigned: 4,
    slipDeliveryPercent: 88,
    projectedTurnout: "71.5%",
    lastTurnout: "65.2%",
  },
  {
    boothNumber: "#103",
    stationName: "Dr. Babasaheb Ambedkar Samaj Mandir",
    locality: "Paud Phata",
    voters: 980,
    grade: "Grade B - Swing",
    bloName: "Rameshwar P. Mane",
    bloPhone: "+91 94220 98765",
    karyakartasAssigned: 3,
    slipDeliveryPercent: 48,
    projectedTurnout: "66%",
    lastTurnout: "54.1%",
  },
  {
    boothNumber: "#104",
    stationName: "Pune Municipal Primary School No. 18",
    locality: "Erandwane",
    voters: 1350,
    grade: "Grade B - Swing",
    bloName: "Geeta N. Salunkhe",
    bloPhone: "+91 98901 23456",
    karyakartasAssigned: 6,
    slipDeliveryPercent: 68,
    projectedTurnout: "63.8%",
    lastTurnout: "51.3%",
  },
  {
    boothNumber: "#105",
    stationName: "Abasaheb Garware College, Hall B",
    locality: "Karve Road",
    voters: 1410,
    grade: "Grade A",
    bloName: "Dattatray V. Shinde",
    bloPhone: "+91 98224 67890",
    karyakartasAssigned: 5,
    slipDeliveryPercent: 82,
    projectedTurnout: "76.2%",
    lastTurnout: "71.0%",
  },
  {
    boothNumber: "#108",
    stationName: "Gokhale Memorial Community Hall",
    locality: "Deccan Gymkhana",
    voters: 890,
    grade: "Grade D - Swing",
    bloName: "Pravin S. Gaikwad",
    bloPhone: "+91 99224 88321",
    karyakartasAssigned: 2,
    slipDeliveryPercent: 44,
    projectedTurnout: "52%",
    lastTurnout: "41.5%",
  },
];

export default function CandidateWarRoomDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [timeframe, setTimeframe] = useState<"today" | "week" | "campaign">("today");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [boothFilter, setBoothFilter] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [mapLayer, setMapLayer] = useState<"all" | "cadre" | "booths">("all");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(
        "success",
        "War Room Telemetry Refreshed",
        "Synchronized with ECI live rolls, 2,045 Polling Stations & GPS trackers.",
      );
    }, 600);
  };

  const handleTriggerQuickAction = () => {
    showToast(
      "info",
      "Strategy Alert Dispatched",
      "Field alert sent to 8 Karyakarta squads in Wards 12 & 13 to prioritize Booths 103 & 108.",
    );
  };

  const filteredBooths = BOOTH_DATA.filter((b) => {
    const matchesSearch =
      b.stationName.toLowerCase().includes(boothFilter.toLowerCase()) ||
      b.boothNumber.toLowerCase().includes(boothFilter.toLowerCase()) ||
      b.locality.toLowerCase().includes(boothFilter.toLowerCase());

    const matchesGrade =
      selectedGrade === "all" ||
      (selectedGrade === "swing" && b.grade.includes("Swing")) ||
      (selectedGrade === "grade-a" && b.grade === "Grade A");

    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-4 sm:space-y-5 pb-10">
      {/* 1. CANDIDATE CONTEXT & WAR ROOM COMMAND HEADER */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-premium-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-[11px] font-bold text-brand-700 border border-brand-200 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Central War Room Command
            </span>
            <Badge variant="success">Verified Dataset</Badge>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Updated: Just now
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Lok Sabha General Elections 2024
          </h1>

          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 mt-0.5 font-normal">
            Candidate:{" "}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              {user?.name || "Adv. Vikram Patil"}
            </strong>{" "}
            &bull;{" "}
            <span>{user?.constituencyName || "34 - Pune Parliamentary Constituency"}</span>
          </p>
        </div>

        {/* Timeframe selector & Quick Action controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setTimeframe("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === "today"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("week")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === "week"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("campaign")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === "campaign"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Full Campaign
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all shadow-premium-xs cursor-pointer active:scale-95"
            title="Refresh ECI Roll Telemetry"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/voters"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Register Elector</span>
          </Link>
        </div>
      </section>

      {/* 2. HIGH-PRIORITY OPERATIONAL ALERT BANNER */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 shadow-premium-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              3 High-Priority Swing Booths Require Slip Distribution Surge
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Booth #103 (Paud Phata) &amp; Booth #108 (Deccan) are currently under 50% voter slip distribution threshold.
            </p>
          </div>
        </div>

        <Link href="/field-map" className="shrink-0 self-end sm:self-center">
          <button
            type="button"
            className="whitespace-nowrap px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Dispatch on Live Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* 3. EIGHT KEY PERFORMANCE INDICATOR (KPI) CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* KPI 1: Total Voters */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-blue-200/70 dark:border-blue-900/50 shadow-premium-xs hover:border-blue-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Voters
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              21.54 L
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-blue-600 font-semibold truncate">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>ECI Verified</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Booths */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-purple-200/70 dark:border-purple-900/50 shadow-premium-xs hover:border-purple-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-600" />
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Booths
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Vote className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              2,045
            </p>
            <div className="text-[10px] text-purple-600 font-semibold truncate mt-1">
              <span>8 Wards Active</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Cadre */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/50 shadow-premium-xs hover:border-indigo-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-600" />
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Cadre
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BadgeCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              34,200
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-indigo-600 font-semibold truncate">
              <span>Primary Cadre</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Karyakartas */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-cyan-200/70 dark:border-cyan-900/50 shadow-premium-xs hover:border-cyan-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Karyakartas
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              4,850
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
              <span>3,120 On Field</span>
            </div>
          </div>
        </div>

        {/* KPI 5: ECI BLOs */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-sky-200/70 dark:border-sky-900/50 shadow-premium-xs hover:border-sky-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-500" />
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ECI BLOs
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              2,045
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-sky-700 dark:text-sky-400 font-semibold truncate">
              <span>98.4% Verified</span>
            </div>
          </div>
        </div>

        {/* KPI 6: Coverage */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-amber-200/70 dark:border-amber-900/50 shadow-premium-xs hover:border-amber-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Coverage
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              78.2%
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: "78.2%" }} />
            </div>
          </div>
        </div>

        {/* KPI 7: Slips Delivered */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-violet-200/70 dark:border-violet-900/50 shadow-premium-xs hover:border-violet-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Slips Deliv.
            </span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              84.6%
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-violet-600 font-semibold truncate">
              <span>18.2 L Handed</span>
            </div>
          </div>
        </div>

        {/* KPI 8: Open Issues */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-rose-200/70 dark:border-rose-900/50 shadow-premium-xs hover:border-rose-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Open Issues
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              42
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-rose-600 font-semibold truncate">
              <span>89% Resolved</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RE-ARCHITECTED MID SECTION: REALISTIC ELECTION GIS CONSOLE & HIGH-TECH AI STRATEGY ENGINE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: Professional Election GIS Operations Console */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
          {/* Header Bar with Layer Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300">
                  <Navigation className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Field Operations Telemetry GIS
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live GPS cadre tracking, ward slip velocity, and booth geofences across 34 - Pune PC.
              </p>
            </div>

            {/* Interactive Layer Switches */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
              <span className="hidden sm:flex items-center gap-1 pl-2 text-slate-400 text-[11px]">
                <Layers className="w-3 h-3" />
                <span>Layers:</span>
              </span>
              <button
                type="button"
                onClick={() => setMapLayer("all")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  mapLayer === "all"
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                All Feeds
              </button>
              <button
                type="button"
                onClick={() => setMapLayer("cadre")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  mapLayer === "cadre"
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Cadre (14)
              </button>
              <button
                type="button"
                onClick={() => setMapLayer("booths")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  mapLayer === "booths"
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Booths (2,045)
              </button>
            </div>
          </div>

          {/* Cartographic GIS Interactive Canvas */}
          <div className="relative h-72 sm:h-80 my-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {/* Cartographic Latitude/Longitude Reference Grid */}
            <div
              className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Coordinates Ticker */}
            <div className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-400 select-none z-10 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-brand-500" />
              <span>LAT: 18.5204° N</span>
              <span>LON: 73.8567° E</span>
              <span className="hidden sm:inline text-emerald-600 font-semibold">• ECI GEO-LOCKED</span>
            </div>

            {/* Realistic Cartographic Ward SVG Map */}
            <svg
              className="w-full h-full absolute inset-0"
              viewBox="0 0 700 350"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="gradKothrud" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2554a8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2554a8" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="gradErandwane" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="gradDeccan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.06" />
                </linearGradient>
                <linearGradient id="gradShivaji" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
                </linearGradient>
              </defs>

              {/* Realistic Road Arteries (Paud Road, Karve Road, FC Road, Ganeshkhind) */}
              <g stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.7">
                {/* Paud Road Spine */}
                <path d="M 40,240 Q 220,190 380,180 T 660,140" stroke="#94a3b8" strokeWidth="2.5" />
                {/* Karve Road Cross */}
                <path d="M 120,60 Q 240,160 320,320" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" />
                {/* FC Road Axis */}
                <path d="M 360,40 Q 420,180 500,310" stroke="#94a3b8" strokeWidth="2" />
                {/* Mutha River Bend */}
                <path d="M 280,340 C 350,220 460,180 680,110" stroke="#0284c7" strokeWidth="5" strokeOpacity="0.25" strokeLinecap="round" />
              </g>

              {/* Ward 12: Kothrud West */}
              <polygon
                points="60,100 230,80 260,260 70,280"
                fill="url(#gradKothrud)"
                stroke="#2554a8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="90" y="125" fill="#2554a8" fontSize="11" fontWeight="700" letterSpacing="0.5">
                WARD 12 (KOTHRUD)
              </text>
              <text x="90" y="140" fill="#64748b" fontSize="9" fontWeight="500">
                88% Voter Slip Coverage
              </text>

              {/* Ward 13: Erandwane */}
              <polygon
                points="240,75 410,65 390,265 265,260"
                fill="url(#gradErandwane)"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
              <text x="270" y="95" fill="#0891b2" fontSize="11" fontWeight="700" letterSpacing="0.5">
                WARD 13 (ERANDWANE)
              </text>
              <text x="270" y="110" fill="#64748b" fontSize="9" fontWeight="500">
                79% Coverage • Stable
              </text>

              {/* Ward 14: Deccan Gymkhana (Priority Swing Zone) */}
              <polygon
                points="420,60 580,70 560,250 400,265"
                fill="url(#gradDeccan)"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <text x="435" y="90" fill="#b45309" fontSize="11" fontWeight="800" letterSpacing="0.5">
                WARD 14 (DECCAN SWING)
              </text>
              <text x="435" y="105" fill="#d97706" fontSize="9" fontWeight="600">
                ⚠️ Slip Threshold Under 50%
              </text>

              {/* Ward 15: Shivajinagar North */}
              <polygon
                points="360,20 620,15 670,110 430,60"
                fill="url(#gradShivaji)"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Polling Station Nodes (Booths) */}
              {(mapLayer === "all" || mapLayer === "booths") && (
                <g>
                  {/* Booth #101 Navbharat */}
                  <g transform="translate(140, 180)">
                    <circle r="7" fill="#2554a8" />
                    <circle r="12" fill="#2554a8" fillOpacity="0.2" className="animate-ping" />
                    <text x="12" y="4" fill="#0f172a" fontSize="10" fontWeight="700">#101 Navbharat (92%)</text>
                  </g>

                  {/* Booth #103 Dr. Ambedkar Samaj Mandir (Swing) */}
                  <g transform="translate(470, 160)">
                    <circle r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <circle r="16" fill="#f59e0b" fillOpacity="0.3" className="animate-ping" />
                    <text x="14" y="4" fill="#b45309" fontSize="10" fontWeight="800">#103 Paud Phata (48%)</text>
                  </g>

                  {/* Booth #105 Garware College */}
                  <g transform="translate(320, 200)">
                    <circle r="7" fill="#06b6d4" />
                    <text x="12" y="4" fill="#0f172a" fontSize="10" fontWeight="700">#105 Garware (82%)</text>
                  </g>

                  {/* Booth #108 Deccan Gokhale */}
                  <g transform="translate(510, 210)">
                    <circle r="8" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                    <circle r="14" fill="#f43f5e" fillOpacity="0.3" className="animate-ping" />
                    <text x="14" y="4" fill="#e11d48" fontSize="10" fontWeight="800">#108 Deccan (44%)</text>
                  </g>
                </g>
              )}

              {/* Active Karyakarta Trajectories & Live GPS Tracking Nodes */}
              {(mapLayer === "all" || mapLayer === "cadre") && (
                <g>
                  {/* Trajectory 1: Kothrud route */}
                  <path
                    d="M 90,210 Q 140,170 190,195 T 240,160"
                    fill="none"
                    stroke="#2554a8"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                  {/* Trajectory 2: Deccan swing coverage */}
                  <path
                    d="M 430,120 Q 470,160 520,180 T 550,225"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Field Agent Ping 1: Pooja Jadhav */}
                  <g transform="translate(190, 195)">
                    <circle r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <circle r="12" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                  </g>

                  {/* Field Agent Ping 2: Ganesh Patil */}
                  <g transform="translate(320, 140)">
                    <circle r="6" fill="#2554a8" stroke="#ffffff" strokeWidth="2" />
                    <circle r="12" fill="#2554a8" fillOpacity="0.3" className="animate-ping" />
                  </g>

                  {/* Field Agent Ping 3: Vikas Mane (Swing) */}
                  <g transform="translate(520, 180)">
                    <circle r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <circle r="14" fill="#f59e0b" fillOpacity="0.3" className="animate-ping" />
                  </g>
                </g>
              )}
            </svg>

            {/* Over-Map Live Agent Chips */}
            <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm text-xs hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Pooja J. (Booth 101 • 42 / hr)</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                <span>Ganesh P. (Booth 102 • Active)</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Vikas M. (Booth 103 • Canvassing Swing)</span>
              </div>
            </div>

            {/* Top-Right Quick Legend */}
            <div className="absolute top-2.5 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 text-[10.5px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>&gt;80% Handed</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Swing Surge</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Critical (&lt;50%)</span>
              </span>
            </div>
          </div>

          {/* Lower Telemetry Status Strip */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 text-[11.5px]">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>14 Cadre GPS Nodes Online</span>
              </span>
              <span className="hidden sm:inline text-slate-400">&bull;</span>
              <span className="hidden sm:inline">Slip Velocity: <strong>1,420 slips / hr</strong></span>
              <span className="hidden md:inline text-slate-400">&bull;</span>
              <span className="hidden md:inline text-slate-500">ECI Geofence: <strong>Locked</strong></span>
            </div>

            <Link
              href="/field-map"
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 self-start sm:self-center"
            >
              <span>Expand Full Interactive GIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right 5 Columns: Enterprise RAJTANTRA AI STRATEGY ENGINE (Cohesive Light Theme) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            {/* AI Engine Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-wide uppercase flex items-center gap-1.5">
                    RAJTANTRA AI STRATEGY ENGINE
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Real-Time Elector Sentiment &amp; Turnout Modeling
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Model v4.2
              </span>
            </div>

            {/* Prescriptive Strategic Opportunity Alert Container */}
            <div className="bg-gradient-to-br from-amber-50/70 via-white to-brand-50/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-brand-950/20 border border-amber-200/90 dark:border-amber-800/50 rounded-xl p-3.5 space-y-2.5 shadow-premium-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-md">
                  <Zap className="w-3 h-3 text-amber-600" />
                  High-Impact Campaign Signal
                </span>
                <span className="text-[10.5px] font-semibold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.4% Net Lift
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Women Electorate Mobilization (Ladki Bahin Yojana)
                </h4>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Direct benefit disbursement telemetry indicates an <strong>+18.4% favorable swing</strong> among 42,000 women voters in Wards 12 &amp; 13.
                </p>
              </div>

              {/* Actionable Prescriptive Strategy Badge */}
              <div className="p-2.5 rounded-lg bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block text-[11px] mb-0.5">
                  💡 Recommended Tactic:
                </span>
                <span className="text-amber-800 dark:text-amber-300 text-[11.5px] leading-tight block">
                  Deploy 8 dedicated women Karyakarta squads to <strong>Booths #103 &amp; #108</strong> before 4:00 PM to maximize slip handoff.
                </span>
              </div>

              <button
                type="button"
                onClick={handleTriggerQuickAction}
                className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Zap className="w-3 h-3" />
                <span>Dispatch Tactic Alert to Ward 12 &amp; 14 Teams</span>
              </button>
            </div>

            {/* Three Turnout & Electoral Forecast Gauges */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Projected Turnout</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  68.4%
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Target: 72%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Supporter Base</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  46.8%
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  +4.2% Lead
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Undecided Swing</div>
                <div className="text-base font-black text-amber-600 mt-0.5 tabular-nums">
                  18.5%
                </div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  High Target
                </div>
              </div>
            </div>
          </div>

          {/* Bottom AI Suite Action */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/ai/assistant"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-brand-600/20"
            >
              <span>Open Complete AI Strategy Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. BOOTH INTELLIGENCE & READINESS MATRIX (DATA TABLE) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-premium-xs overflow-hidden">
        {/* Table Filter & Action Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Booth Intelligence &amp; Readiness Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status, grade ratings, BLO verification, and karyakarta staffing per polling station.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={boothFilter}
                onChange={(e) => setBoothFilter(e.target.value)}
                placeholder="Search booth #, name..."
                className="pl-7 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 w-44 sm:w-48 shadow-premium-xs"
              />
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
            </div>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="py-1.5 pl-2 pr-6 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer shadow-premium-xs"
            >
              <option value="all">All Grades</option>
              <option value="grade-a">Grade A Only</option>
              <option value="swing">Swing Booths</option>
            </select>

            <Link
              href="/voters"
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 ml-2"
            >
              <span>Filter Total Voters by Booth</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Booth #</th>
                <th className="py-3 px-4">Polling Station Name &amp; Locality</th>
                <th className="py-3 px-3">Voters</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3">BLO Incharge</th>
                <th className="py-3 px-3">Karyakartas</th>
                <th className="py-3 px-4">Slip Delivery</th>
                <th className="py-3 px-3">Projected Turnout</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-100">
              {filteredBooths.map((row) => (
                <tr
                  key={row.boothNumber}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 font-bold font-mono text-brand-600">
                    {row.boothNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {row.stationName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {row.locality}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold tabular-nums">
                    {row.voters.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        row.grade === "Grade A"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : row.grade === "Grade B - Swing"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {row.bloName}
                    </div>
                    <div className="text-[10.5px] text-slate-500 font-mono">
                      {row.bloPhone}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                      {row.karyakartasAssigned} Assigned
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.slipDeliveryPercent >= 80
                              ? "bg-brand-600"
                              : row.slipDeliveryPercent >= 60
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${row.slipDeliveryPercent}%` }}
                        />
                      </div>
                      <span className="font-bold text-[11.5px] tabular-nums">
                        {row.slipDeliveryPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {row.projectedTurnout}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Last: {row.lastTurnout}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/voters?booth=${encodeURIComponent(row.boothNumber)}`}>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect Roll
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. DUAL LOWER SECTION: CAMPAIGN CHANNELS & OFFICE TICKETS (2-Column Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Campaign Communication Channels */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Campaign Communication Channels
                </h3>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  Live delivery throughput across automated voter broadcasts.
                </p>
              </div>
              <Link
                href="/campaigns"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Manage Campaigns
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      WhatsApp Voter Slip Broadcast
                    </span>
                  </div>
                  <span className="font-bold tabular-nums text-emerald-600">
                    96% Delivered{" "}
                    <span className="font-normal text-slate-400 text-[11px]">
                      (4,320 / 4,500)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "96%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-600" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Youth First-Time Voter SMS
                    </span>
                  </div>
                  <span className="font-bold tabular-nums text-brand-600">
                    97% Delivered{" "}
                    <span className="font-normal text-slate-400 text-[11px]">
                      (7,950 / 8,200)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: "97%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      AI Voice Outreach Calls
                    </span>
                  </div>
                  <span className="font-bold tabular-nums text-indigo-600">
                    87% Connected{" "}
                    <span className="font-normal text-slate-400 text-[11px]">
                      (10,450 / 12,000)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: "87%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Twilio &amp; Meta Cloud Gateway: Active</span>
            <span className="text-emerald-600 font-semibold">Zero Throttling</span>
          </div>
        </div>

        {/* Right: Top Public Demands & Office Tickets */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Top Public Demands &amp; Office Tickets
                </h3>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  Constituency grievances logged via Candidate Office Helpdesk.
                </p>
              </div>
              <Link
                href="/office/tickets"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Open Ticket Desk
              </Link>
            </div>

            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-2.5 flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-brand-600">
                      TKT-9210
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      Water Supply
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-rose-50 text-rose-600">
                      HIGH
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Entire Dahanukar Colony Lane 3 has faced low municipal pressure for 5 straight days...
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 shrink-0">
                  OPEN
                </span>
              </div>

              <div className="py-2.5 flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-brand-600">
                      TKT-9208
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      Pension
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-amber-50 text-amber-700">
                      MEDIUM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Sanjay Gandhi Niradhar Yojana monthly pension not credited into bank for 3 senior citizens...
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-brand-600 shrink-0">
                  IN PROGRESS
                </span>
              </div>

              <div className="py-2.5 flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-brand-600">
                      TKT-9195
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      Roads &amp; Infrastructure
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-rose-50 text-rose-600">
                      CRITICAL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Deep pothole causing accidents near Erandwane fire station crossing.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 shrink-0">
                  RESOLVED
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Average Resolution Time: 4.2 Hours</span>
            <span className="text-emerald-600 font-semibold">92% Satisfaction</span>
          </div>
        </div>
      </section>

      {/* 7. VOTER INTELLIGENCE & DEMOGRAPHIC DISTRIBUTION */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-premium-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Voter Intelligence &amp; Demographic Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Constituency voter segmentation across age cohorts, gender ratio, and social clusters.
            </p>
          </div>
          <Link
            href="/voters"
            className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>Explore Full Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Column A: Age Demographics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Age Demographics
              </span>
              <span className="text-[11px] text-slate-500">Total: 21.54 L</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11.5px] mb-1">
                  <span className="text-slate-600 dark:text-slate-400">18 - 25 Yrs (Youth First-Time)</span>
                  <span className="font-bold tabular-nums">3.98 L (18.5%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: "18.5%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11.5px] mb-1">
                  <span className="text-slate-600 dark:text-slate-400">26 - 40 Yrs (Working Core)</span>
                  <span className="font-bold tabular-nums">8.23 L (38.2%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: "38.2%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11.5px] mb-1">
                  <span className="text-slate-600 dark:text-slate-400">41 - 60 Yrs (Family Heads)</span>
                  <span className="font-bold tabular-nums">5.84 L (27.1%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: "27.1%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11.5px] mb-1">
                  <span className="text-slate-600 dark:text-slate-400">60+ Yrs (Senior Citizens)</span>
                  <span className="font-bold tabular-nums">3.49 L (16.2%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "16.2%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Column B: Gender Ratio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Gender Ratio &amp; Turnout Inclination
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">
                944 F/1000 M
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Male Voters
                </span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  11.07 L
                </div>
                <div className="text-[10.5px] text-brand-600 font-semibold mt-0.5">
                  51.4% (67% Projected)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Female Voters
                </span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  10.45 L
                </div>
                <div className="text-[10.5px] text-emerald-600 font-semibold mt-0.5">
                  48.5% (71% Projected)
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
              <span className="text-[11px] font-bold text-rose-600">
                Women Mobilization Signal:
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Ladki Bahin scheme recipients in Wards 12 &amp; 13 show 74% strong turnout intent.
              </p>
            </div>
          </div>

          {/* Column C: Social Clusters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Social &amp; Demographic Clusters
              </span>
              <span className="text-[11px] text-slate-500">Sample Model</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  <span>Maratha Community</span>
                </span>
                <span className="font-bold tabular-nums">22.4%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>OBC Clusters (Mali, Vanjari, Dhangar)</span>
                </span>
                <span className="font-bold tabular-nums">14.5%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Brahmin Demographic</span>
                </span>
                <span className="font-bold tabular-nums">10.4%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>SC (Neo-Buddhist &amp; Matang)</span>
                </span>
                <span className="font-bold tabular-nums">9.2%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Muslim Community</span>
                </span>
                <span className="font-bold tabular-nums">6.6%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Other Mixed Classifications</span>
                </span>
                <span className="font-bold tabular-nums">36.9%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DATA QUALITY & ELECTORAL ROLL INTEGRITY METRICS */}
      <section className="bg-slate-950 text-white rounded-2xl border border-slate-900 p-5 shadow-premium-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">
                Data Quality &amp; Electoral Roll Integrity Metrics
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Audit status of voter contacts, photo rolls, geospatial coordinates, and duplicate indices.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 self-start sm:self-center">
            Roll Health: 96.2% Optimal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400">Mobile Contact Seeding:</div>
            <div className="text-xl font-bold text-white mt-0.5 tabular-nums">89.4%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-brand-600 h-full rounded-full" style={{ width: "89.4%" }} />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5">19.25 L reachable phones</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400">ECI Photo Roll Clarity:</div>
            <div className="text-xl font-bold text-white mt-0.5 tabular-nums">98.1%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "98.1%" }} />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5">High-resolution ECI portraits</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400">Geotagged Address Accuracy:</div>
            <div className="text-xl font-bold text-white mt-0.5 tabular-nums">94.7%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: "94.7%" }} />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5">Matched to Prabhag boundary</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400">Duplicate Detection Index:</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5 tabular-nums">0.3% (Low Risk)</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "3%" }} />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5">Cross-booth deduplicated</div>
          </div>
        </div>
      </section>
    </div>
  );
}
