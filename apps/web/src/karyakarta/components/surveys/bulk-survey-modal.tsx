"use client";

import React, { useState } from "react";
import {
  X,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save,
  Users,
  ThumbsUp,
  HelpCircle,
  ThumbsDown,
  Scale,
} from "lucide-react";
import { VoterRecord, VoterClassification } from "../../types/karyakarta.types";

interface BulkSurveyModalProps {
  selectedVoters: VoterRecord[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: (updatedVoters: VoterRecord[]) => void;
}

export function BulkSurveyModal({
  selectedVoters,
  isOpen,
  onClose,
  onComplete,
}: BulkSurveyModalProps) {
  if (!isOpen || selectedVoters.length === 0) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Batch changes configuration
  const [targetClassification, setTargetClassification] = useState<VoterClassification | "UNCHANGED">("UNCHANGED");
  const [markVisited, setMarkVisited] = useState<boolean>(true);
  const [appendScheme, setAppendScheme] = useState<string>("");
  const [appendRemark, setAppendRemark] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Build diffs for Step 2 preview
  const plannedUpdates: VoterRecord[] = selectedVoters.map((voter) => {
    const updated: VoterRecord = { ...voter };

    if (targetClassification !== "UNCHANGED") {
      updated.classification = targetClassification;
    }
    if (markVisited) {
      updated.isVisited = true;
      updated.lastVisitDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    if (appendScheme.trim()) {
      const existing = voter.scheme ? voter.scheme.split(", ") : [];
      if (!existing.includes(appendScheme.trim())) {
        updated.scheme = existing.concat(appendScheme.trim()).join(", ");
      }
    }
    if (appendRemark.trim()) {
      updated.remarks = voter.remarks
        ? `${voter.remarks}; ${appendRemark.trim()}`
        : appendRemark.trim();
    }

    return updated;
  });

  const handleExecute = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete(plannedUpdates);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Step Tracker */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-400/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  Bulk Survey &amp; Batch Update
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                  {selectedVoters.length} Voters
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Step {step} of 3 &bull;{" "}
                {step === 1
                  ? "Select Batch Attributes"
                  : step === 2
                  ? "Review Diff & Changes"
                  : "Final Confirmation"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Attribute Selection */}
        {step === 1 && (
          <div className="p-5 space-y-5">
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                You are updating attributes across <strong>{selectedVoters.length} selected voters</strong>. Master roll fields (Name, Age, Address) cannot be modified here.
              </span>
            </div>

            {/* Classification batch picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Assign Common Sentiment / Leaning
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTargetClassification("UNCHANGED")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    targetClassification === "UNCHANGED"
                      ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/40 font-bold text-blue-900 dark:text-blue-200"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  Keep Unchanged
                </button>
                <button
                  type="button"
                  onClick={() => setTargetClassification("Supporter")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    targetClassification === "Supporter"
                      ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-900 dark:text-emerald-200"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supporter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetClassification("Doubtful")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    targetClassification === "Doubtful"
                      ? "border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 font-bold text-amber-900 dark:text-amber-200"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Doubtful</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetClassification("Opponent")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    targetClassification === "Opponent"
                      ? "border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/40 font-bold text-rose-900 dark:text-rose-200"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                  <span>Opponent</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetClassification("Neutral")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    targetClassification === "Neutral"
                      ? "border-2 border-slate-500 bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-slate-600" />
                  <span>Neutral</span>
                </button>
              </div>
            </div>

            {/* Mark Visited toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={markVisited}
                  onChange={(e) => setMarkVisited(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Mark all selected as Visited
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sets visit status to true and stamps today's date for all {selectedVoters.length} voters.
                  </span>
                </div>
              </label>
            </div>

            {/* Common Scheme to append */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assign Scheme Beneficiary Tag (Optional)
              </label>
              <input
                type="text"
                value={appendScheme}
                onChange={(e) => setAppendScheme(e.target.value)}
                placeholder="e.g. Mukhyamantri Ladki Bahin Yojana"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Batch Remark note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Batch Remark / Cadre Observation
              </label>
              <input
                type="text"
                value={appendRemark}
                onChange={(e) => setAppendRemark(e.target.value)}
                placeholder="e.g. Doorstep visit campaign completed on 10 Feb"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                <span>Preview Diff &amp; Changes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Diff Preview Table */}
        {step === 2 && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Review Attribute Diff Table ({selectedVoters.length} Voters)
              </span>
              <span className="text-slate-500">Green indicates proposed updates</span>
            </div>

            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-2.5">EPIC ID</th>
                    <th className="p-2.5">Voter Name</th>
                    <th className="p-2.5">Sentiment Diff</th>
                    <th className="p-2.5">Visit Status Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedVoters.map((voter) => {
                    const willChangeClassification =
                      targetClassification !== "UNCHANGED" &&
                      targetClassification !== voter.classification;
                    const willChangeVisited = markVisited && !voter.isVisited;

                    return (
                      <tr key={voter.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">
                          {voter.epicId}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                          {voter.name}
                        </td>
                        <td className="p-2.5">
                          {willChangeClassification ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="line-through text-slate-400">{voter.classification}</span>
                              <ArrowRight className="w-3 h-3 text-emerald-500" />
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {targetClassification}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-500">{voter.classification} (No change)</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {willChangeVisited ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="line-through text-amber-500">Pending</span>
                              <ArrowRight className="w-3 h-3 text-emerald-500" />
                              <span className="font-bold text-emerald-600">Visited</span>
                            </span>
                          ) : (
                            <span className="text-slate-500">
                              {voter.isVisited ? "Visited" : "Pending"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                <span>Proceed to Confirmation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Explicit Confirmation */}
        {step === 3 && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Confirm Batch Update of {selectedVoters.length} Voters?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                This action will stamp updated survey sentiments and visit dates for all selected voters across your assigned booths. This operation is audited and logged in your activity history.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto text-left space-y-1">
              <div className="flex justify-between">
                <span>Selected Records:</span>
                <span className="font-bold">{selectedVoters.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Classification:</span>
                <span className="font-bold text-blue-600">{targetClassification}</span>
              </div>
              <div className="flex justify-between">
                <span>Mark as Visited:</span>
                <span className="font-bold text-emerald-600">{markVisited ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Back to Preview
              </button>
              <button
                type="button"
                onClick={handleExecute}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Applying Batch Updates..." : "Execute Batch Update"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
