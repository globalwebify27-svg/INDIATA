"use client";

import React from "react";
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Users,
  MapPin,
  Phone,
  FileText,
  Star,
  Check,
} from "lucide-react";
import { FilterState, PollingBooth } from "../../types/karyakarta.types";

interface AdvancedFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  booths: PollingBooth[];
  matchingCount: number;
}

const AGE_PRESETS = [
  { label: "18-25 Yrs (First Time)", min: "18", max: "25" },
  { label: "26-40 Yrs (Youth)", min: "26", max: "40" },
  { label: "41-60 Yrs (Mid Age)", min: "41", max: "60" },
  { label: "60+ Yrs (Senior)", min: "60", max: "110" },
];

const OCCUPATION_LIST = [
  "Retail Trader / Merchant",
  "IT Professional / Software Engineer",
  "Homemaker & Self-Help Group",
  "College Student (Engineering)",
  "Retired Bank Manager",
  "Auto / Taxi Driver",
  "Government Employee",
];

const SCHEME_LIST = [
  "Mukhyamantri Ladki Bahin Yojana",
  "Pradhan Mantri Awas Yojana",
  "PM-KISAN Samman Nidhi",
  "Student Free Bus Pass Scheme",
  "Senior Citizen Travel Concession",
];

export function AdvancedFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  booths,
  matchingCount,
}: AdvancedFilterDrawerProps) {
  if (!isOpen) return null;

  const update = (patch: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  // Count active non-default filters
  const activeCount = [
    filters.gender !== "all",
    filters.minAge !== "" || filters.maxAge !== "",
    filters.boothNumber !== "all",
    filters.caste !== "",
    filters.occupation !== "",
    filters.scheme !== "",
    filters.classification !== "all",
    filters.visitedStatus !== "all",
    filters.mobileStatus !== "all",
    filters.isImportant !== null,
  ].filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E0EDFE] text-[#2087FE] border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/80">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Advanced Search Filters</span>
                {activeCount > 0 && (
                  <span className="px-2 py-0.2 rounded-full bg-[#2087FE] text-white font-mono text-[10px]">
                    {activeCount} Active
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Multi-group matrix filter across assigned rolls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* GROUP 1: PERSONAL & DEMOGRAPHICS */}
          <div className="space-y-3">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Personal &amp; Demographics</span>
            </span>

            {/* Gender Buttons */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Gender Selection
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "all", label: "All" },
                  { id: "M", label: "Male" },
                  { id: "F", label: "Female" },
                  { id: "Other", label: "Other" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => update({ gender: g.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      filters.gender === g.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range & Presets */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Age Range (Years)
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAge}
                  onChange={(e) => update({ minAge: e.target.value })}
                  className="w-1/2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAge}
                  onChange={(e) => update({ maxAge: e.target.value })}
                  className="w-1/2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              {/* Quick Age Presets */}
              <div className="flex flex-wrap gap-1">
                {AGE_PRESETS.map((p) => {
                  const isPresetActive = filters.minAge === p.min && filters.maxAge === p.max;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() =>
                        update(
                          isPresetActive ? { minAge: "", maxAge: "" } : { minAge: p.min, maxAge: p.max }
                        )
                      }
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                        isPresetActive
                          ? "bg-[#2087FE] text-white border-[#2087FE]"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caste / Community */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Caste / Community Keyword
              </label>
              <input
                type="text"
                value={filters.caste}
                onChange={(e) => update({ caste: e.target.value })}
                placeholder="e.g. Maratha, Brahmin, Deshmukh..."
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          {/* GROUP 2: POLLING LOCATION & SCOPING */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" />
              <span>2. Polling Station &amp; Area</span>
            </span>

            {/* Booth Select */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Polling Booth Number
              </label>
              <select
                value={filters.boothNumber}
                onChange={(e) => update({ boothNumber: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="all">All Allocated Booths</option>
                {booths.map((b) => (
                  <option key={b.id} value={b.boothNumber}>
                    Booth {b.boothNumber} — {b.boothName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GROUP 3: CONTACT & MOBILE VERIFICATION */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Contact Availability</span>
            </span>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "all", label: "All Contacts" },
                { id: "available", label: "Has Mobile" },
                { id: "unavailable", label: "No Mobile" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => update({ mobileStatus: m.id as any })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    filters.mobileStatus === m.id
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* GROUP 4: FIELD OUTREACH & VISIT STATUS */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2087FE]" />
              <span>4. Field Outreach Status</span>
            </span>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "all", label: "All Records" },
                { id: "visited", label: "Visited Only" },
                { id: "not_visited", label: "Pending Visit" },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => update({ visitedStatus: v.id as any })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    filters.visitedStatus === v.id
                      ? "bg-[#2087FE] text-white border-[#2087FE] shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* GROUP 5: POLITICAL SENTIMENT & WELFARE */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>5. Sentiment &amp; Welfare Schemes</span>
            </span>

            {/* Sentiment dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Voter Leaning / Classification
              </label>
              <select
                value={filters.classification}
                onChange={(e) => update({ classification: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="all">All Classifications</option>
                <option value="Supporter">Supporter (अनुकूल)</option>
                <option value="Doubtful">Doubtful (साशंक)</option>
                <option value="Opponent">Opponent (विरोधी)</option>
                <option value="Neutral">Neutral (तटस्थ)</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Occupation
              </label>
              <select
                value={filters.occupation}
                onChange={(e) => update({ occupation: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              >
                <option value="">All Occupations</option>
                {OCCUPATION_LIST.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheme Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Beneficiary Scheme Tag
              </label>
              <select
                value={filters.scheme}
                onChange={(e) => update({ scheme: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              >
                <option value="">All Schemes</option>
                {SCHEME_LIST.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GROUP 6: PRIORITY KEY CONTACTS */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span>6. Priority &amp; Key Contacts</span>
            </span>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { val: null, label: "All" },
                { val: true, label: "★ Starred" },
                { val: false, label: "Unstarred" },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => update({ isImportant: opt.val })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    filters.isImportant === opt.val
                      ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters ({matchingCount.toLocaleString()} Matching)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
