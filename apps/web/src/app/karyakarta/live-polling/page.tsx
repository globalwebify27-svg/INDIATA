"use client";

import React, { useState, useMemo } from "react";
import {
  Radio,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Search,
  TrendingUp,
  Vote,
  RotateCcw,
  Check,
} from "lucide-react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import { useToast } from "@/context/toast-context";
import { MOCK_SCOPED_VOTERS } from "@/karyakarta/data/mock-karyakarta-data";
import { VoterRecord } from "@/karyakarta/types/karyakarta.types";

export default function KaryakartaLivePollingPage() {
  const { user, assignedBooths } = useKaryakartaAuth();
  const { showToast } = useToast();

  const [voters, setVoters] = useState<VoterRecord[]>(MOCK_SCOPED_VOTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoothFilter, setSelectedBoothFilter] = useState("all");
  const [turnoutFilter, setTurnoutFilter] = useState<"all" | "voted" | "unvoted">("all");

  // Confirmation & justification modals
  const [confirmVoteVoter, setConfirmVoteVoter] = useState<VoterRecord | null>(null);
  const [correctStatusVoter, setCorrectStatusVoter] = useState<VoterRecord | null>(null);
  const [correctionReason, setCorrectionReason] = useState("");

  // Base electors scoped to karyakarta assigned booths
  const scopedVoters = useMemo(() => {
    if (!assignedBooths || assignedBooths.length === 0) return voters;
    return voters.filter((v) => assignedBooths.includes(v.boothNumber));
  }, [voters, assignedBooths]);

  // Aggregate Turnout Metrics
  const totalElectors = scopedVoters.length;
  const totalVotesCast = scopedVoters.filter((v) => Boolean(v.hasVoted ?? v.isVoted)).length;
  const remainingElectors = totalElectors - totalVotesCast;
  const turnoutPercentage = totalElectors > 0 ? ((totalVotesCast / totalElectors) * 100).toFixed(1) : "0.0";

  const maleVoters = scopedVoters.filter((v) => v.gender === "M");
  const maleVotes = maleVoters.filter((v) => Boolean(v.hasVoted ?? v.isVoted)).length;
  const maleTurnout = maleVoters.length > 0 ? ((maleVotes / maleVoters.length) * 100).toFixed(1) : "0.0";

  const femaleVoters = scopedVoters.filter((v) => v.gender === "F");
  const femaleVotes = femaleVoters.filter((v) => Boolean(v.hasVoted ?? v.isVoted)).length;
  const femaleTurnout = femaleVoters.length > 0 ? ((femaleVotes / femaleVoters.length) * 100).toFixed(1) : "0.0";

  // Filtered queue for rapid field marking
  const displayQueue = useMemo(() => {
    return scopedVoters.filter((v) => {
      const isElectorVoted = Boolean(v.hasVoted ?? v.isVoted);
      if (selectedBoothFilter !== "all" && v.boothNumber !== selectedBoothFilter) return false;
      if (turnoutFilter === "voted" && !isElectorVoted) return false;
      if (turnoutFilter === "unvoted" && isElectorVoted) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = v.name.toLowerCase().includes(q);
        const matchMr = v.marathiName.toLowerCase().includes(q);
        const matchEpic = v.epicId.toLowerCase().includes(q);
        const matchPhone = v.phone ? v.phone.includes(q) : false;
        const matchHouse = v.houseNo.toLowerCase().includes(q);
        if (!matchName && !matchMr && !matchEpic && !matchPhone && !matchHouse) return false;
      }
      return true;
    });
  }, [scopedVoters, selectedBoothFilter, turnoutFilter, searchQuery]);

  const handleConfirmVote = () => {
    if (!confirmVoteVoter) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    setVoters((prev) =>
      prev.map((v) => {
        if (v.id === confirmVoteVoter.id) {
          return {
            ...v,
            isVoted: true,
            hasVoted: true,
            votedAt: timeStr + ", Today",
            votedBy: user ? `${user.name} (Booth Agent #${v.boothNumber})` : "Booth Field Agent",
          };
        }
        return v;
      })
    );

    showToast(
      "success",
      "Voter Turnout Recorded",
      `${confirmVoteVoter.name} (${confirmVoteVoter.epicId}) marked as VOTED at ${timeStr}.`
    );
    setConfirmVoteVoter(null);
  };

  const handleConfirmCorrection = () => {
    if (!correctStatusVoter) return;
    if (!correctionReason.trim()) {
      showToast("error", "Reason Mandatory", "Please enter a justification note to correct voting status.");
      return;
    }

    setVoters((prev) =>
      prev.map((v) => {
        if (v.id === correctStatusVoter.id) {
          return {
            ...v,
            isVoted: false,
            hasVoted: false,
            votedAt: undefined,
            votedBy: undefined,
          };
        }
        return v;
      })
    );

    showToast(
      "info",
      "Turnout Status Reverted",
      `Status for ${correctStatusVoter.name} reverted to Not Voted. Audit note logged.`
    );
    setCorrectStatusVoter(null);
    setCorrectionReason("");
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* HEADER BANNER WITH LIVE BADGE & COUNTDOWN                             */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-900/40 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Polling Day
            </span>
            <span className="text-xs text-slate-400">
              Assigned Booths: {assignedBooths?.map((b) => `Booth #${b}`).join(", ") || "101, 102"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-[#2087FE] animate-pulse" />
            <span>Booth Live Turnout Console</span>
          </h1>
          <p className="text-xs text-slate-300">
            Real-time voter turnout recording, demographic velocity, and ECI queue audit ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-cyan-400" />
              Polls Active
            </div>
            <div className="text-sm font-mono font-black text-cyan-300">07:00 AM – 06:00 PM IST</div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4 PRIMARY TURNOUT KPI CARDS                                          */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Assigned Voters</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-tabular">{totalElectors}</div>
          <div className="text-[11px] text-slate-400">Across allocated polling stations</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-xs space-y-1 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-semibold">Total Votes Cast</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-tabular">{totalVotesCast}</div>
          <div className="text-[11px] text-emerald-600/80 font-bold">{turnoutPercentage}% Overall Turnout</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-1 bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-semibold">Remaining Unvoted</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-tabular">{remainingElectors}</div>
          <div className="text-[11px] text-amber-600/80 font-bold">Target for field mobilization</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Current Turnout Rate</span>
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-tabular">{turnoutPercentage}%</div>
          <div className="text-[11px] text-slate-400">Male: {maleTurnout}% • Female: {femaleTurnout}%</div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DEMOGRAPHIC GENDER PROGRESS BARS                                      */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Male Turnout */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Male Turnout: {maleVotes} / {maleVoters.length}
            </span>
            <span className="text-blue-600 dark:text-blue-400">{maleTurnout}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${maleTurnout}%` }} />
          </div>
        </div>

        {/* Female Turnout */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              Female Turnout: {femaleVotes} / {femaleVoters.length}
            </span>
            <span className="text-pink-600 dark:text-pink-400">{femaleTurnout}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-pink-600 rounded-full transition-all duration-500" style={{ width: `${femaleTurnout}%` }} />
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* RAPID BOOTH VOTER TURN-OUT QUEUE                                     */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Vote className="w-4 h-4 text-[#2087FE]" />
              <span>Polling Booth Voter Queue</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Search by EPIC or Name to verify elector and record official turnout in 1 click.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Turnout status filter tabs */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
              <button
                onClick={() => setTurnoutFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  turnoutFilter === "all" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                All ({scopedVoters.length})
              </button>
              <button
                onClick={() => setTurnoutFilter("unvoted")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  turnoutFilter === "unvoted" ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Unvoted ({remainingElectors})
              </button>
              <button
                onClick={() => setTurnoutFilter("voted")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  turnoutFilter === "voted" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Voted ({totalVotesCast})
              </button>
            </div>
          </div>
        </div>

        {/* Search controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search EPIC, voter name, Marathi spelling, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {assignedBooths && assignedBooths.length > 1 && (
            <select
              value={selectedBoothFilter}
              onChange={(e) => setSelectedBoothFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Assigned Booths</option>
              {assignedBooths.map((b) => (
                <option key={b} value={b}>
                  Booth #{b}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Elector Queue Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3.5">EPIC / ID</th>
                <th className="py-3 px-3.5">Voter Name</th>
                <th className="py-3 px-3.5">Demographics</th>
                <th className="py-3 px-3.5">Booth #</th>
                <th className="py-3 px-3.5">Turnout Status</th>
                <th className="py-3 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No voters found matching your search or filters.
                  </td>
                </tr>
              ) : (
                displayQueue.map((v) => (
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
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        {v.gender === "M" ? "Male" : v.gender === "F" ? "Female" : "Other"} • {v.age} yrs
                      </span>
                      {v.phone && <div className="text-[10px] text-slate-400 font-mono">{v.phone}</div>}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-blue-600 dark:text-blue-400">Booth #{v.boothNumber}</span>
                    </td>
                    <td className="py-3 px-3.5">
                      {Boolean(v.hasVoted ?? v.isVoted) ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                            <Check className="w-3 h-3" /> Voted
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">{v.votedAt || "Today"}</div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
                          <Clock className="w-3 h-3" /> Unvoted
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      {Boolean(v.hasVoted ?? v.isVoted) ? (
                        <button
                          type="button"
                          onClick={() => setCorrectStatusVoter(v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3 text-slate-400" />
                          <span>Correct</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmVoteVoter(v)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          <Vote className="w-3.5 h-3.5" />
                          <span>Mark as Voted</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CONFIRMATION DIALOG MODAL ("Mark as Voted")                           */}
      {/* ===================================================================== */}
      {confirmVoteVoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Vote className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Voter Turnout</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to mark this elector as voted? This will update the live polling rate and log an official audit timestamp.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">{confirmVoteVoter.name}</div>
              <div className="text-[11px] text-slate-400 font-devanagari">{confirmVoteVoter.marathiName}</div>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                <span>EPIC: {confirmVoteVoter.epicId}</span>
                <span>•</span>
                <span>Booth #{confirmVoteVoter.boothNumber}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmVoteVoter(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVote}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STATUS CORRECTION MODAL (WITH MANDATORY JUSTIFICATION)                */}
      {/* ===================================================================== */}
      {correctStatusVoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Correct Voting Status</h3>
              <p className="text-xs text-slate-500">
                To revert an elector to "Not Voted", an audit justification reason is required by statutory election rules.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">{correctStatusVoter.name}</span>
              <span className="text-slate-400"> ({correctStatusVoter.epicId})</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Reason for Reversal / Correction <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Inadvertent click during queue verification, clerical error..."
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCorrectStatusVoter(null);
                  setCorrectionReason("");
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCorrection}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Correction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
