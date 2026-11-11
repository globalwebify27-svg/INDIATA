"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Sparkles,
  MapPin,
  Building,
} from "lucide-react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import {
  MOCK_SCOPED_VOTERS,
  MOCK_BOOTHS,
  MOCK_ISSUES,
  MOCK_SLIPS,
  MOCK_ACTIVITIES,
  computeKaryakartaKpiStats,
} from "@/karyakarta/data/mock-karyakarta-data";
import { VoterRecord } from "@/karyakarta/types/karyakarta.types";
import { KaryakartaKpiGrid } from "@/karyakarta/components/dashboard/karyakarta-kpi-grid";
import { KaryakartaCharts } from "@/karyakarta/components/dashboard/karyakarta-charts";
import { RecentActivityFeed } from "@/karyakarta/components/dashboard/recent-activity-feed";
import { ResultantVoterList } from "@/karyakarta/components/voters/resultant-voter-list";
import { CentralVoterProfile } from "@/karyakarta/components/voters/central-voter-profile";
import { IndividualSurveyModal } from "@/karyakarta/components/surveys/individual-survey-modal";
import { BulkSurveyModal } from "@/karyakarta/components/surveys/bulk-survey-modal";
import { FamilyTreeModal } from "@/karyakarta/components/voters/family-tree-modal";
import { VoterUpdateRequestModal } from "@/karyakarta/components/voters/voter-update-request-modal";

export default function KaryakartaDashboardPage() {
  const { user, assignedBooths } = useKaryakartaAuth();

  // Dynamic voters state
  const [allVoterRecords, setAllVoterRecords] = useState<VoterRecord[]>(MOCK_SCOPED_VOTERS);

  // Active Karyakarta's scoped data
  const scopedVoters = useMemo(() => {
    if (!assignedBooths || assignedBooths.length === 0) return allVoterRecords;
    return allVoterRecords.filter((v) => assignedBooths.includes(v.boothNumber));
  }, [assignedBooths, allVoterRecords]);

  const scopedBooths = useMemo(() => {
    if (!assignedBooths || assignedBooths.length === 0) return MOCK_BOOTHS;
    return MOCK_BOOTHS.filter((b) => assignedBooths.includes(b.boothNumber));
  }, [assignedBooths]);

  // Dynamic KPI Stats
  const stats = useMemo(() => {
    return computeKaryakartaKpiStats(
      scopedVoters,
      scopedBooths,
      MOCK_ISSUES,
      MOCK_SLIPS
    );
  }, [scopedVoters, scopedBooths]);

  // Modals state
  const [activeKpiFilter, setActiveKpiFilter] = useState<string>("all");
  const [activeProfileVoter, setActiveProfileVoter] = useState<VoterRecord | null>(null);
  const [surveyVoter, setSurveyVoter] = useState<VoterRecord | null>(null);
  const [bulkSurveyVoters, setBulkSurveyVoters] = useState<VoterRecord[]>([]);
  const [familyTreeId, setFamilyTreeId] = useState<string | null>(null);
  const [updateRequestVoter, setUpdateRequestVoter] = useState<VoterRecord | null>(null);

  // Filter voters based on active KPI filter
  const displayedVoters = useMemo(() => {
    if (activeKpiFilter === "visited") return scopedVoters.filter((v) => v.isVisited);
    if (activeKpiFilter === "unvisited") return scopedVoters.filter((v) => !v.isVisited);
    if (activeKpiFilter === "important") return scopedVoters.filter((v) => v.isImportant);
    if (activeKpiFilter === "mobile_has") return scopedVoters.filter((v) => !!v.phone);
    if (activeKpiFilter === "mobile_none") return scopedVoters.filter((v) => !v.phone);
    if (activeKpiFilter === "supporters") return scopedVoters.filter((v) => v.classification === "Supporter");
    if (activeKpiFilter === "doubtful") return scopedVoters.filter((v) => v.classification === "Doubtful");
    if (activeKpiFilter === "opponents") return scopedVoters.filter((v) => v.classification === "Opponent");
    if (activeKpiFilter === "neutral") return scopedVoters.filter((v) => v.classification === "Neutral");
    return scopedVoters;
  }, [scopedVoters, activeKpiFilter]);

  const handleUpdateVoter = (updated: VoterRecord) => {
    setAllVoterRecords((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    if (activeProfileVoter && activeProfileVoter.id === updated.id) {
      setActiveProfileVoter(updated);
    }
  };

  const handleBulkUpdate = (updatedList: VoterRecord[]) => {
    const map = new Map(updatedList.map((u) => [u.id, u]));
    setAllVoterRecords((prev) => prev.map((v) => (map.has(v.id) ? map.get(v.id)! : v)));
  };

  const handleToggleImportant = (voterId: string) => {
    setAllVoterRecords((prev) =>
      prev.map((v) => (v.id === voterId ? { ...v, isImportant: !v.isImportant } : v))
    );
    if (activeProfileVoter && activeProfileVoter.id === voterId) {
      setActiveProfileVoter((prev) =>
        prev ? { ...prev, isImportant: !prev.isImportant } : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* WELCOME BANNER & FIELD CADRE CONTEXT                      */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-[#0B1527] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#2087FE]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>FIELD CADRE ACTIVE</span>
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-300 text-xs font-semibold flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Candidate: {user?.candidateName || "Anand Shinde"}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome back, {user?.name || "Sachin Mane"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Constituency: <strong className="text-white">{user?.constituencyName || "215 - Kasba Peth"}</strong> • 
              Assigned Area: <span className="text-slate-200">{user?.assignedArea || "Shaniwar Peth Central"}</span>
            </p>

            {/* Assigned Booths Pills */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Allocated Booths:</span>
              </span>
              {assignedBooths && assignedBooths.length > 0 ? (
                assignedBooths.map((booth) => (
                  <span
                    key={booth}
                    className="px-2.5 py-0.5 rounded-lg bg-white/10 text-cyan-300 font-mono text-xs font-bold border border-white/15"
                  >
                    Booth {booth}
                  </span>
                ))
              ) : (
                <span className="text-xs text-amber-300">Pending allocation</span>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Link
              href="/karyakarta/search-voter"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Voter</span>
            </Link>

            <Link
              href="/karyakarta/ai-mode"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2087FE] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 15 PERFORMANCE KPI METRIC CARDS                           */}
      {/* ========================================================= */}
      <KaryakartaKpiGrid
        stats={stats}
        onFilterClick={(filterType) => {
          setActiveKpiFilter((prev) => (prev === filterType ? "all" : filterType));
        }}
        activeFilter={activeKpiFilter}
      />

      {/* ========================================================= */}
      {/* ANALYTICAL CHARTS (Coverage, Sentiment, Booth Workload)   */}
      {/* ========================================================= */}
      <KaryakartaCharts stats={stats} booths={scopedBooths} />

      {/* ========================================================= */}
      {/* DUAL WORKSPACE SECTION: VOTER LIST & ACTIVITY LOG         */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2 Cols: Resultant Voter List Preview */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2087FE]" />
                <span>Scoped Voter Roll ({displayedVoters.length})</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {activeKpiFilter !== "all"
                  ? `Filtered by: ${activeKpiFilter}`
                  : "All voters residing in your allocated polling booths"}
              </p>
            </div>

            {activeKpiFilter !== "all" && (
              <button
                onClick={() => setActiveKpiFilter("all")}
                className="text-xs font-semibold text-[#2087FE] hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <ResultantVoterList
            voters={displayedVoters}
            onSelectVoter={(v) => setActiveProfileVoter(v)}
            onConductSurvey={(v) => setSurveyVoter(v)}
            onPrintSlip={(v) => setActiveProfileVoter(v)}
            onRaiseIssue={(v) => setActiveProfileVoter(v)}
            onToggleImportant={handleToggleImportant}
            onBulkSurvey={(selected) => setBulkSurveyVoters(selected)}
            pageSizeDefault={5}
            showBatchActions={true}
          />
        </div>

        {/* Right 1 Col: Recent Activity Timeline */}
        <div className="space-y-4">
          <RecentActivityFeed activities={MOCK_ACTIVITIES} maxItems={6} />
        </div>
      </div>

      {/* Central Voter Profile Modal */}
      <CentralVoterProfile
        voter={activeProfileVoter}
        isOpen={!!activeProfileVoter}
        onClose={() => setActiveProfileVoter(null)}
        allVoters={allVoterRecords}
        allBooths={MOCK_BOOTHS}
        allActivities={MOCK_ACTIVITIES}
        allIssues={MOCK_ISSUES}
        onOpenSurvey={(v) => setSurveyVoter(v)}
        onToggleImportant={handleToggleImportant}
        onSelectFamilyMember={(m) => setActiveProfileVoter(m)}
        onOpenFamilyTree={(fId) => setFamilyTreeId(fId)}
        onRequestCorrection={(v) => setUpdateRequestVoter(v)}
      />

      {/* Individual Doorstep Survey Modal */}
      <IndividualSurveyModal
        voter={surveyVoter}
        isOpen={!!surveyVoter}
        onClose={() => setSurveyVoter(null)}
        onSave={handleUpdateVoter}
      />

      {/* Bulk Survey Stepper Modal */}
      <BulkSurveyModal
        selectedVoters={bulkSurveyVoters}
        isOpen={bulkSurveyVoters.length > 0}
        onClose={() => setBulkSurveyVoters([])}
        onComplete={handleBulkUpdate}
      />

      {/* Family Tree Modal */}
      <FamilyTreeModal
        familyId={familyTreeId}
        isOpen={!!familyTreeId}
        onClose={() => setFamilyTreeId(null)}
        allVoters={allVoterRecords}
        onSelectVoter={(v) => setActiveProfileVoter(v)}
        onOpenSurvey={(v) => setSurveyVoter(v)}
      />

      {/* Quarantine Update Request Modal */}
      <VoterUpdateRequestModal
        voter={updateRequestVoter}
        isOpen={!!updateRequestVoter}
        onClose={() => setUpdateRequestVoter(null)}
        onSubmit={(req) => {
          console.log("Quarantine request submitted from dashboard:", req);
        }}
      />
    </div>
  );
}
