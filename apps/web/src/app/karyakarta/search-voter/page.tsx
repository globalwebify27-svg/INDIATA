"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Download,
} from "lucide-react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import {
  MOCK_SCOPED_VOTERS,
  MOCK_BOOTHS,
  MOCK_ACTIVITIES,
  MOCK_ISSUES,
} from "@/karyakarta/data/mock-karyakarta-data";
import { VoterRecord } from "@/karyakarta/types/karyakarta.types";
import { VoterSearchBar } from "@/karyakarta/components/voters/voter-search-bar";
import { ResultantVoterList } from "@/karyakarta/components/voters/resultant-voter-list";
import { CentralVoterProfile } from "@/karyakarta/components/voters/central-voter-profile";
import { IndividualSurveyModal } from "@/karyakarta/components/surveys/individual-survey-modal";
import { BulkSurveyModal } from "@/karyakarta/components/surveys/bulk-survey-modal";
import { FamilyTreeModal } from "@/karyakarta/components/voters/family-tree-modal";
import { VoterUpdateRequestModal } from "@/karyakarta/components/voters/voter-update-request-modal";
import { CreateVoterProfileModal } from "@/karyakarta/components/voters/create-voter-profile-modal";
import { UserPlus } from "lucide-react";

export default function SearchVoterPage() {
  const { user, assignedBooths } = useKaryakartaAuth();

  // Dynamic voters state
  const [allVoterRecords, setAllVoterRecords] = useState<VoterRecord[]>(MOCK_SCOPED_VOTERS);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [selectedBooth, setSelectedBooth] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");

  // Modals state
  const [activeProfileVoter, setActiveProfileVoter] = useState<VoterRecord | null>(null);
  const [surveyVoter, setSurveyVoter] = useState<VoterRecord | null>(null);
  const [bulkSurveyVoters, setBulkSurveyVoters] = useState<VoterRecord[]>([]);
  const [familyTreeId, setFamilyTreeId] = useState<string | null>(null);
  const [updateRequestVoter, setUpdateRequestVoter] = useState<VoterRecord | null>(null);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);

  // Scoped base voters for this Karyakarta
  const scopedBaseVoters = useMemo(() => {
    if (!assignedBooths || assignedBooths.length === 0) return allVoterRecords;
    return allVoterRecords.filter((v) => assignedBooths.includes(v.boothNumber));
  }, [assignedBooths, allVoterRecords]);

  // Filtered voters
  const filteredVoters = useMemo(() => {
    return scopedBaseVoters.filter((voter) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = voter.name.toLowerCase().includes(q);
        const matchMarathi = voter.marathiName.toLowerCase().includes(q);
        const matchEpic = voter.epicId.toLowerCase().includes(q);
        const matchPhone = voter.phone ? voter.phone.includes(q) : false;
        const matchHouse = voter.houseNo.toLowerCase().includes(q);
        const matchAddress = voter.address.toLowerCase().includes(q);

        if (!matchName && !matchMarathi && !matchEpic && !matchPhone && !matchHouse && !matchAddress) {
          return false;
        }
      }

      // 2. Booth filter
      if (selectedBooth !== "all" && voter.boothNumber !== selectedBooth) {
        return false;
      }

      // 3. Gender filter
      if (selectedGender !== "all" && voter.gender !== selectedGender) {
        return false;
      }

      // 4. Sentiment filter
      if (selectedSentiment !== "all" && voter.classification !== selectedSentiment) {
        return false;
      }

      // 5. Quick filter chips
      if (activeQuickFilter === "visited" && !voter.isVisited) return false;
      if (activeQuickFilter === "unvisited" && voter.isVisited) return false;
      if (activeQuickFilter === "important" && !voter.isImportant) return false;
      if (activeQuickFilter === "has_phone" && !voter.phone) return false;

      return true;
    });
  }, [
    scopedBaseVoters,
    searchQuery,
    selectedBooth,
    selectedGender,
    selectedSentiment,
    activeQuickFilter,
  ]);

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

  const handleVoterCreated = (newVoter: VoterRecord) => {
    setAllVoterRecords((prev) => [newVoter, ...prev]);
    setActiveProfileVoter(newVoter);
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

  const handleExportCsv = () => {
    const headers = ["EPIC ID", "Name", "Marathi Name", "Age", "Gender", "Booth", "Phone", "Visited", "Sentiment"];
    const rows = filteredVoters.map((v) => [
      v.epicId,
      `"${v.name}"`,
      `"${v.marathiName}"`,
      v.age,
      v.gender,
      v.boothNumber,
      v.phone || "N/A",
      v.isVisited ? "Yes" : "No",
      v.classification,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Voters_${user?.id || "Karyakarta"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* HEADER BAR                                                */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Search className="w-6 h-6 text-[#2087FE]" />
            <span>Search Voter Roll</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant search across name, Marathi spelling, EPIC, mobile number, or house number.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={filteredVoters.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCreateProfileOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Voter</span>
          </button>

          <Link
            href="/karyakarta/advanced-search"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Search</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SEARCH CONTROLS & SCOPED BOOTH PICKER                     */}
      {/* ========================================================= */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <VoterSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeQuickFilter={activeQuickFilter}
          onQuickFilterChange={setActiveQuickFilter}
          totalCount={filteredVoters.length}
        />

        {/* Secondary Dropdown Filter Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Booth Picker */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Filter by Booth
            </label>
            <select
              value={selectedBooth}
              onChange={(e) => setSelectedBooth(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Assigned Booths ({assignedBooths?.join(", ") || "All"})</option>
              {assignedBooths && assignedBooths.map((b) => (
                <option key={b} value={b}>
                  Booth {b}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Gender
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Genders</option>
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
            </select>
          </div>

          {/* Sentiment Leaning */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Sentiment / Leaning
            </label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Classifications</option>
              <option value="Supporter">Supporter (अनुकूल)</option>
              <option value="Doubtful">Doubtful (साशंक)</option>
              <option value="Opponent">Opponent (विरोधी)</option>
              <option value="Neutral">Neutral (तटस्थ)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RESULTANT VOTER LIST (Reusable Core Table)                */}
      {/* ========================================================= */}
      <ResultantVoterList
        voters={filteredVoters}
        onSelectVoter={(v) => setActiveProfileVoter(v)}
        onConductSurvey={(v) => setSurveyVoter(v)}
        onPrintSlip={(v) => setActiveProfileVoter(v)}
        onRaiseIssue={(v) => setActiveProfileVoter(v)}
        onToggleImportant={handleToggleImportant}
        onBulkSurvey={(selected) => setBulkSurveyVoters(selected)}
        onCreateNewVoter={() => setIsCreateProfileOpen(true)}
        pageSizeDefault={10}
        showBatchActions={true}
      />

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
          console.log("Quarantine request submitted from search-voter:", req);
        }}
      />

      {/* Create New Central Voter Profile Modal */}
      <CreateVoterProfileModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        onVoterCreated={handleVoterCreated}
        initialQuery={searchQuery}
        defaultBooth={selectedBooth !== "all" ? selectedBooth : undefined}
      />
    </div>
  );
}
