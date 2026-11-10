"use client";

import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { VoterRecord, VoterUpdateRequest } from "../../types/karyakarta.types";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";

interface VoterUpdateRequestModalProps {
  voter: VoterRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: VoterUpdateRequest) => void;
}

const EDITABLE_FIELDS = [
  { id: "name", label: "Voter Full Name (English)", getter: (v: VoterRecord) => v.name },
  { id: "marathiName", label: "Marathi Spelling (मराठी नाव)", getter: (v: VoterRecord) => v.marathiName },
  { id: "age", label: "Age", getter: (v: VoterRecord) => String(v.age) },
  { id: "gender", label: "Gender (M / F / Other)", getter: (v: VoterRecord) => v.gender },
  { id: "relativeName", label: "Relative Name", getter: (v: VoterRecord) => v.relativeName },
  { id: "relation", label: "Relation Type (S/o, W/o, D/o)", getter: (v: VoterRecord) => v.relation },
  { id: "address", label: "House No & Residential Address", getter: (v: VoterRecord) => `${v.houseNo}, ${v.address}` },
  { id: "phone", label: "Mobile Phone Number", getter: (v: VoterRecord) => v.phone || "Not recorded" },
];

export function VoterUpdateRequestModal({
  voter,
  isOpen,
  onClose,
  onSubmit,
}: VoterUpdateRequestModalProps) {
  const { user } = useKaryakartaAuth();

  const [selectedFieldId, setSelectedFieldId] = useState<string>("name");
  const [proposedValue, setProposedValue] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !voter) return null;

  const activeFieldDef = EDITABLE_FIELDS.find((f) => f.id === selectedFieldId) ?? EDITABLE_FIELDS[0]!;
  const currentValue = activeFieldDef.getter(voter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedValue.trim() || !reason.trim()) return;

    setIsSubmitting(true);
    const newReq: VoterUpdateRequest = {
      id: `req-${Date.now().toString().slice(-4)}`,
      voterId: voter.id,
      karyakartaId: user?.id || "KAR-2026-001",
      voterName: voter.name,
      field: activeFieldDef.label,
      currentValue,
      proposedValue: proposedValue.trim(),
      reason: reason.trim(),
      status: "PENDING",
      submittedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + ", " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      reviewedAt: null,
      reviewerRemarks: null,
    };

    setTimeout(() => {
      onSubmit(newReq);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setProposedValue("");
        setReason("");
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                Submit Roll Update Request
              </h3>
              <p className="text-xs text-amber-200 mt-0.5">
                Quarantine Queue Submission for {voter.name} ({voter.epicId})
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

        {/* Protection Explanatory Banner */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Write-Protection Active:</strong> Master electoral rolls cannot be modified directly. Your correction will be audited and reviewed by Candidate Admin before applying.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Update Request Submitted Successfully!
            </h4>
            <p className="text-xs text-slate-500">
              Assigned to Candidate War Room Quarantine Review Queue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Field Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Field to Correct
              </label>
              <select
                value={selectedFieldId}
                onChange={(e) => {
                  setSelectedFieldId(e.target.value);
                  setProposedValue("");
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
              >
                {EDITABLE_FIELDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Value Display */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Current Registered Value:
              </label>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentValue}
              </div>
            </div>

            {/* Proposed Value Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Proposed Corrected Value <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={proposedValue}
                onChange={(e) => setProposedValue(e.target.value)}
                placeholder={`Enter verified ${activeFieldDef.label}...`}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-slate-900 dark:text-white"
              />
            </div>

            {/* Reason & Evidence */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason &amp; Document Evidence <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State verified document (e.g. Aadhaar card, electricity bill, ration card seen during door visit)..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !proposedValue.trim() || !reason.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting Request..." : "Submit to Quarantine Queue"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
