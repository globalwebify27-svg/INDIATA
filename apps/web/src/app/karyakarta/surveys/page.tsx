"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
  UserCheck,
  Users,
  ThumbsUp,
  Scale,
} from "lucide-react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import { useToast } from "@/context/toast-context";
import { MOCK_SCOPED_VOTERS } from "@/karyakarta/data/mock-karyakarta-data";
import { VoterRecord } from "@/karyakarta/types/karyakarta.types";
import { IndividualSurveyModal } from "@/karyakarta/components/surveys/individual-survey-modal";
import { BulkSurveyModal } from "@/karyakarta/components/surveys/bulk-survey-modal";

export default function KaryakartaSurveysPage() {
  const { assignedBooths } = useKaryakartaAuth();
  const { showToast } = useToast();

  const [voters, setVoters] = useState<VoterRecord[]>(MOCK_SCOPED_VOTERS);
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Survey modal state
  const [surveyVoter, setSurveyVoter] = useState<VoterRecord | null>(null);
  const [bulkSurveyVoters, setBulkSurveyVoters] = useState<VoterRecord[]>([]);

  // Scoped voters
  const scopedVoters = useMemo(() => {
    if (!assignedBooths || assignedBooths.length === 0) return voters;
    return voters.filter((v) => assignedBooths.includes(v.boothNumber));
  }, [voters, assignedBooths]);

  // Telemetry metrics
  const totalScoped = scopedVoters.length;
  const completedSurveys = scopedVoters.filter((v) => v.isVisited).length;
  const pendingSurveys = totalScoped - completedSurveys;
  const coveragePercent = totalScoped > 0 ? Math.round((completedSurveys / totalScoped) * 100) : 0;

  // Supporters vs Doubtful
  const supportersCount = scopedVoters.filter((v) => v.isVisited && v.classification === "Supporter").length;
  const doubtfulCount = scopedVoters.filter((v) => v.isVisited && v.classification === "Doubtful").length;

  const displayList = useMemo(() => {
    return scopedVoters.filter((v) => {
      if (activeTab === "pending" && v.isVisited) return false;
      if (activeTab === "completed" && !v.isVisited) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = v.name.toLowerCase().includes(q);
        const matchMr = v.marathiName.toLowerCase().includes(q);
        const matchEpic = v.epicId.toLowerCase().includes(q);
        const matchHouse = v.houseNo.toLowerCase().includes(q);
        if (!matchName && !matchMr && !matchEpic && !matchHouse) return false;
      }
      return true;
    });
  }, [scopedVoters, activeTab, searchQuery]);

  const handleUpdateVoter = (updated: VoterRecord) => {
    setVoters((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleBulkUpdate = (updatedList: VoterRecord[]) => {
    const map = new Map(updatedList.map((u) => [u.id, u]));
    setVoters((prev) => prev.map((v) => (map.has(v.id) ? map.get(v.id)! : v)));
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* HEADER BAR                                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded uppercase tracking-wider border border-blue-200 dark:border-blue-900/40">
              Field Operations
            </span>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Doorstep Surveys</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#2087FE]" />
            <span>Doorstep Voter Survey Hub</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conduct verified voter surveys, record issues, and enroll citizens in government schemes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const unvisited = scopedVoters.filter((v) => !v.isVisited).slice(0, 5);
              if (unvisited.length === 0) {
                showToast("info", "No Pending Electors", "All assigned electors have already been surveyed!");
              } else {
                setBulkSurveyVoters(unvisited);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Bulk Household Survey</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* KPI METRICS                                                           */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Survey Coverage</span>
            <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-tabular">{coveragePercent}%</div>
          <div className="text-[11px] text-slate-400">{completedSurveys} of {totalScoped} electors visited</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-xs space-y-1 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-semibold">Supporters Captured</span>
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-tabular">{supportersCount}</div>
          <div className="text-[11px] text-emerald-600/80 font-bold">Favorable voter base</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-1 bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-semibold">Swing / Doubtful</span>
            <Scale className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-tabular">{doubtfulCount}</div>
          <div className="text-[11px] text-amber-600/80 font-bold">Target for second outreach</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Pending Doorstep Visits</span>
            <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400 font-tabular">{pendingSurveys}</div>
          <div className="text-[11px] text-slate-400">Scheduled for this campaign week</div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SURVEY TARGETS QUEUE                                                  */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "pending" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Pending Survey ({pendingSurveys})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "completed" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Survey Completed ({completedSurveys})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              All Electors ({totalScoped})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search voter, EPIC, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Voter Survey Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3.5">EPIC / Sr. #</th>
                <th className="py-3 px-3.5">Elector Name</th>
                <th className="py-3 px-3.5">Booth & Address</th>
                <th className="py-3 px-3.5">Sentiment Leaning</th>
                <th className="py-3 px-3.5">Doorstep Status</th>
                <th className="py-3 px-3.5 text-right">Survey Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No electors found in this tab.
                  </td>
                </tr>
              ) : (
                displayList.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{v.epicId}</span>
                      <div className="text-[10px] text-slate-400">Sr. #{v.serialNumber}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{v.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-devanagari">{v.marathiName}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-blue-600 dark:text-blue-400">Booth #{v.boothNumber}</span>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{v.address}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.classification === "Supporter"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                          : v.classification === "Doubtful"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300"
                          : v.classification === "Opponent"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300"
                      }`}>
                        {v.classification}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      {v.isVisited ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Visited ({v.lastVisitDate || "Recent"})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" /> Pending Visit
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSurveyVoter(v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{v.isVisited ? "Update Survey" : "Conduct Survey"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Survey Modals */}
      {surveyVoter && (
        <IndividualSurveyModal
          voter={surveyVoter}
          isOpen={true}
          onClose={() => setSurveyVoter(null)}
          onSave={handleUpdateVoter}
        />
      )}

      {bulkSurveyVoters.length > 0 && (
        <BulkSurveyModal
          selectedVoters={bulkSurveyVoters}
          isOpen={true}
          onClose={() => setBulkSurveyVoters([])}
          onComplete={handleBulkUpdate}
        />
      )}
    </div>
  );
}
