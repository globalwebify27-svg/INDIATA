"use client";

import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Download,
  X,
  Filter,
} from "lucide-react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import {
  MOCK_SCOPED_VOTERS,
  MOCK_BOOTHS,
  MOCK_ACTIVITIES,
  MOCK_ISSUES,
} from "@/karyakarta/data/mock-karyakarta-data";
import { VoterRecord, FilterState, VoterUpdateRequest } from "@/karyakarta/types/karyakarta.types";
import { ResultantVoterList } from "@/karyakarta/components/voters/resultant-voter-list";
import { AdvancedFilterDrawer } from "@/karyakarta/components/voters/advanced-filter-drawer";
import { CentralVoterProfile } from "@/karyakarta/components/voters/central-voter-profile";
import { IndividualSurveyModal } from "@/karyakarta/components/surveys/individual-survey-modal";
import { BulkSurveyModal } from "@/karyakarta/components/surveys/bulk-survey-modal";
import { FamilyTreeModal } from "@/karyakarta/components/voters/family-tree-modal";
import { VoterUpdateRequestModal } from "@/karyakarta/components/voters/voter-update-request-modal";

const INITIAL_FILTERS: FilterState = {
  searchQuery: "",
  gender: "all",
  minAge: "",
  maxAge: "",
  boothNumber: "all",
  prabhaag: "",
  ward: "",
  village: "",
  caste: "",
  occupation: "",
  scheme: "",
  classification: "all",
  visitedStatus: "all",
  votedStatus: "all",
  mobileStatus: "all",
  isImportant: null,
  isFavourite: null,
};

export default function AdvancedSearchPage() {
  const { user, assignedBooths } = useKaryakartaAuth();

  const [allVoterRecords, setAllVoterRecords] = useState<VoterRecord[]>(MOCK_SCOPED_VOTERS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals state
  const [activeProfileVoter, setActiveProfileVoter] = useState<VoterRecord | null>(null);
  const [surveyVoter, setSurveyVoter] = useState<VoterRecord | null>(null);
  const [bulkSurveyVoters, setBulkSurveyVoters] = useState<VoterRecord[]>([]);
  const [familyTreeId, setFamilyTreeId] = useState<string | null>(null);
  const [updateRequestVoter, setUpdateRequestVoter] = useState<VoterRecord | null>(null);

  // Scoped base voters
  const scopedBaseVoters = useMemo(() => {
    if (!assignedBooths || assignedBooths.length === 0) return allVoterRecords;
    return allVoterRecords.filter((v) => assignedBooths.includes(v.boothNumber));
  }, [assignedBooths, allVoterRecords]);

  // Scoped booths
  const scopedBooths = useMemo(() => {
    if (!assignedBooths || assignedBooths.length === 0) return MOCK_BOOTHS;
    return MOCK_BOOTHS.filter((b) => assignedBooths.includes(b.boothNumber));
  }, [assignedBooths]);

  // Filter application matrix
  const filteredVoters = useMemo(() => {
    return scopedBaseVoters.filter((voter) => {
      // 1. Free search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const mName = voter.name.toLowerCase().includes(q);
        const mMr = voter.marathiName.toLowerCase().includes(q);
        const mEpic = voter.epicId.toLowerCase().includes(q);
        const mPhone = voter.phone ? voter.phone.includes(q) : false;
        const mHouse = voter.houseNo.toLowerCase().includes(q);
        if (!mName && !mMr && !mEpic && !mPhone && !mHouse) return false;
      }

      // 2. Gender
      if (filters.gender !== "all" && voter.gender !== filters.gender) return false;

      // 3. Age Range
      if (filters.minAge && voter.age < Number(filters.minAge)) return false;
      if (filters.maxAge && voter.age > Number(filters.maxAge)) return false;

      // 4. Booth
      if (filters.boothNumber !== "all" && voter.boothNumber !== filters.boothNumber) return false;

      // 5. Caste Keyword
      if (filters.caste.trim() && !voter.caste.toLowerCase().includes(filters.caste.toLowerCase().trim())) {
        return false;
      }

      // 6. Occupation
      if (filters.occupation && voter.occupation !== filters.occupation) return false;

      // 7. Scheme
      if (filters.scheme && !voter.scheme.includes(filters.scheme)) return false;

      // 8. Classification / Sentiment
      if (filters.classification !== "all" && voter.classification !== filters.classification) {
        return false;
      }

      // 9. Visited
      if (filters.visitedStatus === "visited" && !voter.isVisited) return false;
      if (filters.visitedStatus === "not_visited" && voter.isVisited) return false;

      // 10. Mobile
      if (filters.mobileStatus === "available" && !voter.phone) return false;
      if (filters.mobileStatus === "unavailable" && voter.phone) return false;

      // 11. Important / Starred
      if (filters.isImportant !== null && voter.isImportant !== filters.isImportant) {
        return false;
      }

      return true;
    });
  }, [scopedBaseVoters, filters]);

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
  };

  const handleExportCsv = () => {
    const headers = ["EPIC ID", "Name", "Marathi Name", "Age", "Gender", "Booth", "Phone", "Visited", "Sentiment", "Caste", "Occupation"];
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
      `"${v.caste}"`,
      `"${v.occupation}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Advanced_Voters_${user?.id || "Karyakarta"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Build active filter badges list
  const activeChips = useMemo(() => {
    const list: { id: string; label: string; onRemove: () => void }[] = [];
    if (filters.gender !== "all") {
      list.push({
        id: "gender",
        label: `Gender: ${filters.gender}`,
        onRemove: () => setFilters((f) => ({ ...f, gender: "all" })),
      });
    }
    if (filters.minAge || filters.maxAge) {
      list.push({
        id: "age",
        label: `Age: ${filters.minAge || "0"}–${filters.maxAge || "100"} Yrs`,
        onRemove: () => setFilters((f) => ({ ...f, minAge: "", maxAge: "" })),
      });
    }
    if (filters.boothNumber !== "all") {
      list.push({
        id: "booth",
        label: `Booth: ${filters.boothNumber}`,
        onRemove: () => setFilters((f) => ({ ...f, boothNumber: "all" })),
      });
    }
    if (filters.classification !== "all") {
      list.push({
        id: "sentiment",
        label: `Sentiment: ${filters.classification}`,
        onRemove: () => setFilters((f) => ({ ...f, classification: "all" })),
      });
    }
    if (filters.visitedStatus !== "all") {
      list.push({
        id: "visited",
        label: filters.visitedStatus === "visited" ? "Visited Only" : "Pending Visit",
        onRemove: () => setFilters((f) => ({ ...f, visitedStatus: "all" })),
      });
    }
    if (filters.mobileStatus !== "all") {
      list.push({
        id: "mobile",
        label: filters.mobileStatus === "available" ? "With Mobile" : "No Mobile",
        onRemove: () => setFilters((f) => ({ ...f, mobileStatus: "all" })),
      });
    }
    if (filters.caste) {
      list.push({
        id: "caste",
        label: `Caste: ${filters.caste}`,
        onRemove: () => setFilters((f) => ({ ...f, caste: "" })),
      });
    }
    if (filters.occupation) {
      list.push({
        id: "occupation",
        label: `Occupation: ${filters.occupation}`,
        onRemove: () => setFilters((f) => ({ ...f, occupation: "" })),
      });
    }
    if (filters.scheme) {
      list.push({
        id: "scheme",
        label: `Scheme: ${filters.scheme}`,
        onRemove: () => setFilters((f) => ({ ...f, scheme: "" })),
      });
    }
    if (filters.isImportant !== null) {
      list.push({
        id: "important",
        label: filters.isImportant ? "★ Starred Only" : "Unstarred",
        onRemove: () => setFilters((f) => ({ ...f, isImportant: null })),
      });
    }
    return list;
  }, [filters]);

  return (
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* HEADER                                                    */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-purple-600" />
            <span>Advanced Search &amp; Multi-Tier Filter</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Query across demographics, booth boundaries, age groups, welfare schemes, and sentiments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={filteredVoters.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 cursor-pointer transition-all"
          >
            <Filter className="w-4 h-4" />
            <span>Configure Matrix Filter</span>
            {activeChips.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-mono">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SEARCH BAR & ACTIVE FILTER CHIPS                          */}
      {/* ========================================================= */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((f) => ({ ...f, searchQuery: e.target.value }))}
            placeholder="Search within filtered results by name, Marathi name, EPIC ID, or house number..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((f) => ({ ...f, searchQuery: "" }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Active Filter Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Active Filters:
            </span>
            {activeChips.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No custom filters active (showing all scoped voters)</span>
            ) : (
              activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold"
                >
                  <span>{chip.label}</span>
                  <button
                    onClick={chip.onRemove}
                    className="hover:text-rose-600 cursor-pointer ml-0.5"
                    title="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}

            {activeChips.length > 0 && (
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer ml-1"
              >
                Clear All
              </button>
            )}
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
            {filteredVoters.length.toLocaleString()} Voters Matching
          </span>
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
        pageSizeDefault={10}
        showBatchActions={true}
      />

      {/* Advanced Filter Slide-over Drawer */}
      <AdvancedFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={() => setFilters(INITIAL_FILTERS)}
        booths={scopedBooths}
        matchingCount={filteredVoters.length}
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
        onSubmit={(req: VoterUpdateRequest) => {
          console.log("Submitted Quarantine Update Request:", req);
        }}
      />
    </div>
  );
}
