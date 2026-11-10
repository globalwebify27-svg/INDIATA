"use client";

import React, { useState, useMemo } from "react";
import {
  VoterRecord,
  VoterClassification,
} from "../../types/karyakarta.types";
import { useKaryakartaLanguage } from "../../context/karyakarta-language-context";
import {
  Phone,
  Share2,
  Printer,
  FileText,
  AlertCircle,
  Star,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  CheckSquare,
  Square,
  MinusSquare,
  ArrowUpDown,
} from "lucide-react";

interface ResultantVoterListProps {
  voters: VoterRecord[];
  onSelectVoter: (voter: VoterRecord) => void;
  onConductSurvey?: (voter: VoterRecord) => void;
  onPrintSlip?: (voter: VoterRecord) => void;
  onRaiseIssue?: (voter: VoterRecord) => void;
  onToggleImportant?: (voterId: string) => void;
  onBulkSurvey?: (selectedVoters: VoterRecord[]) => void;
  onBulkPrintSlips?: (selectedVoters: VoterRecord[]) => void;
  pageSizeDefault?: number;
  showBatchActions?: boolean;
}

export function ResultantVoterList({
  voters,
  onSelectVoter,
  onConductSurvey,
  onPrintSlip,
  onRaiseIssue,
  onToggleImportant,
  onBulkSurvey,
  onBulkPrintSlips,
  pageSizeDefault = 10,
  showBatchActions = true,
}: ResultantVoterListProps) {
  const { t } = useKaryakartaLanguage();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);
  const [sortBy, setSortBy] = useState<"name" | "epic" | "age" | "booth">("epic");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: "name" | "epic" | "age" | "booth") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Sorted voters
  const sortedVoters = useMemo(() => {
    return [...voters].sort((a, b) => {
      let comp = 0;
      if (sortBy === "name") {
        comp = a.name.localeCompare(b.name);
      } else if (sortBy === "epic") {
        comp = a.epicId.localeCompare(b.epicId);
      } else if (sortBy === "age") {
        comp = a.age - b.age;
      } else if (sortBy === "booth") {
        comp = a.boothNumber.localeCompare(b.boothNumber);
      }
      return sortOrder === "asc" ? comp : -comp;
    });
  }, [voters, sortBy, sortOrder]);

  // Paginated voters
  const totalPages = Math.ceil(sortedVoters.length / pageSize) || 1;
  const paginatedVoters = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedVoters.slice(start, start + pageSize);
  }, [sortedVoters, currentPage, pageSize]);

  // Selection handlers
  const isAllPageSelected =
    paginatedVoters.length > 0 &&
    paginatedVoters.every((v) => selectedIds.has(v.id));

  const isSomePageSelected =
    paginatedVoters.some((v) => selectedIds.has(v.id)) && !isAllPageSelected;

  const toggleSelectAllPage = () => {
    const next = new Set(selectedIds);
    if (isAllPageSelected) {
      paginatedVoters.forEach((v) => next.delete(v.id));
    } else {
      paginatedVoters.forEach((v) => next.add(v.id));
    }
    setSelectedIds(next);
  };

  const toggleSelectVoter = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const selectedVoters = useMemo(() => {
    return voters.filter((v) => selectedIds.has(v.id));
  }, [voters, selectedIds]);

  // Sentiment badge styling helper
  const getClassificationBadge = (cls: VoterClassification) => {
    switch (cls) {
      case "Supporter":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t("status.supporter", "Supporter")}
          </span>
        );
      case "Doubtful":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t("status.doubtful", "Doubtful")}
          </span>
        );
      case "Opponent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {t("status.opponent", "Opponent")}
          </span>
        );
      case "Neutral":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {t("status.neutral", "Neutral")}
          </span>
        );
    }
  };

  const handleShareWhatsApp = (voter: VoterRecord) => {
    if (!voter.phone) return;
    const cleanPhone = voter.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Namaskar ${voter.name} ji,\nHere is your official Election Information for Booth ${voter.boothNumber} (${voter.boothName}).\nYour Voter EPIC ID: ${voter.epicId}.\nINDIATA Campaign Office.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-3">
      {/* ========================================================= */}
      {/* STICKY BATCH ACTIONS BAR (Appears when items are selected) */}
      {/* ========================================================= */}
      {showBatchActions && selectedIds.size > 0 && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2 py-0.5 rounded bg-white/20 font-mono">
              {selectedIds.size}
            </span>
            <span>Voters Selected for Batch Action</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {onBulkSurvey && (
              <button
                onClick={() => onBulkSurvey(selectedVoters)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-blue-900 font-bold hover:bg-blue-50 shadow-xs cursor-pointer transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Bulk Survey</span>
              </button>
            )}

            {onBulkPrintSlips && (
              <button
                onClick={() => onBulkPrintSlips(selectedVoters)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-blue-900 font-bold hover:bg-blue-50 shadow-xs cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>Print Slips ({selectedIds.size})</span>
              </button>
            )}

            <button
              onClick={clearSelection}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium cursor-pointer transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DESKTOP TABLE VIEW (Visible on md and larger screens)     */}
      {/* ========================================================= */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3.5 w-10 text-center">
                  <button
                    onClick={toggleSelectAllPage}
                    className="cursor-pointer text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    title={isAllPageSelected ? "Deselect page" : "Select all on page"}
                  >
                    {isAllPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#2087FE]" />
                    ) : isSomePageSelected ? (
                      <MinusSquare className="w-4 h-4 text-[#2087FE]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-2 w-8 text-center">★</th>
                <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("epic")}>
                  <div className="flex items-center gap-1">
                    <span>EPIC ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    <span>Voter Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("age")}>
                  <div className="flex items-center gap-1">
                    <span>Age / Gender</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Relative</th>
                <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("booth")}>
                  <div className="flex items-center gap-1">
                    <span>Booth No.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Mobile Contact</th>
                <th className="py-3 px-3">Sentiment</th>
                <th className="py-3 px-3">Visit Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedVoters.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-xs">No matching voters in assigned booths.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try adjusting your search criteria or assigned booth scope.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedVoters.map((voter) => {
                  const isSelected = selectedIds.has(voter.id);

                  return (
                    <tr
                      key={voter.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? "bg-blue-50/60 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectVoter(voter.id)}
                          className="w-4 h-4 rounded text-[#2087FE] border-slate-300 focus:ring-[#2087FE] cursor-pointer"
                        />
                      </td>

                      {/* Important / Star Toggle */}
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => onToggleImportant && onToggleImportant(voter.id)}
                          className="cursor-pointer text-slate-300 hover:text-amber-500 transition-colors"
                          title={voter.isImportant ? "Marked as Important" : "Mark as Important"}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              voter.isImportant
                                ? "fill-amber-400 text-amber-500"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      </td>

                      {/* EPIC ID */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white text-xs">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {voter.epicId}
                        </span>
                      </td>

                      {/* Bilingual Name */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onSelectVoter(voter)}
                          className="text-left font-bold text-slate-900 dark:text-white hover:text-[#2087FE] hover:underline cursor-pointer block"
                        >
                          {voter.name}
                        </button>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 font-marathi">
                          {voter.marathiName}
                        </span>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3 px-3 font-medium">
                        <span>
                          {voter.age} Yrs / {voter.gender}
                        </span>
                      </td>

                      {/* Relative */}
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        <span className="text-[11px]">
                          {voter.relation} {voter.relativeName}
                        </span>
                      </td>

                      {/* Booth Number */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                          {voter.boothNumber}
                        </span>
                      </td>

                      {/* Mobile Contact with 1-Click Call / WhatsApp */}
                      <td className="py-3 px-3">
                        {voter.phone ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${voter.phone}`}
                              className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-pointer"
                              title={`Call ${voter.phone}`}
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => handleShareWhatsApp(voter)}
                              className="p-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-300 cursor-pointer"
                              title="Share Slip via WhatsApp"
                            >
                              <Share2 className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                              {voter.phone}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            No Mobile
                          </span>
                        )}
                      </td>

                      {/* Sentiment Badge */}
                      <td className="py-3 px-3">
                        {getClassificationBadge(voter.classification)}
                      </td>

                      {/* Visit Status */}
                      <td className="py-3 px-3">
                        {voter.isVisited ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Visited</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Action Triggers */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectVoter(voter)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Open Central Voter Profile"
                          >
                            <User className="w-3.5 h-3.5" />
                          </button>

                          {onConductSurvey && (
                            <button
                              onClick={() => onConductSurvey(voter)}
                              className="p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer"
                              title="Conduct Doorstep Survey"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onPrintSlip && (
                            <button
                              onClick={() => onPrintSlip(voter)}
                              className="p-1.5 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                              title="Print / Preview Voter Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onRaiseIssue && (
                            <button
                              onClick={() => onRaiseIssue(voter)}
                              className="p-1.5 rounded-lg border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 cursor-pointer"
                              title="Raise Voter Issue / Ticket"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE CARD VIEW (Optimized for field phones)            */}
      {/* ========================================================= */}
      <div className="md:hidden space-y-2.5">
        {paginatedVoters.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-xs">No matching voters.</p>
          </div>
        ) : (
          paginatedVoters.map((voter) => {
            const isSelected = selectedIds.has(voter.id);

            return (
              <div
                key={voter.id}
                className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30"
                    : "border-slate-200/80 dark:border-slate-800 shadow-xs"
                }`}
              >
                {/* Top Row: Checkbox, EPIC, Star, Visit Status */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectVoter(voter.id)}
                      className="w-4 h-4 rounded text-[#2087FE] border-slate-300"
                    />
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {voter.epicId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleImportant && onToggleImportant(voter.id)}
                      className="p-1"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          voter.isImportant
                            ? "fill-amber-400 text-amber-500"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                    {voter.isVisited ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Visited
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Voter Name & Details */}
                <div className="py-2.5 cursor-pointer" onClick={() => onSelectVoter(voter)}>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {voter.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-marathi">
                    {voter.marathiName}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                    <span>{voter.age} Yrs / {voter.gender}</span>
                    <span>•</span>
                    <span>{voter.relation} {voter.relativeName}</span>
                    <span>•</span>
                    <span className="font-mono text-blue-600 font-bold">{voter.boothNumber}</span>
                  </div>
                </div>

                {/* Sentiment & Contact Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>{getClassificationBadge(voter.classification)}</div>

                  <div className="flex items-center gap-1.5">
                    {voter.phone && (
                      <>
                        <a
                          href={`tel:${voter.phone}`}
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          title="Call Voter"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleShareWhatsApp(voter)}
                          className="p-2 rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                          title="WhatsApp Slip"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {onConductSurvey && (
                      <button
                        onClick={() => onConductSurvey(voter)}
                        className="p-2 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                        title="Doorstep Survey"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onPrintSlip && (
                      <button
                        onClick={() => onPrintSlip(voter)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        title="Print Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* PAGINATION & FOOTER CONTROLS                             */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="font-mono">
            Showing {sortedVoters.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, sortedVoters.length)} of {sortedVoters.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono font-bold text-slate-800 dark:text-slate-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
