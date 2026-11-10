"use client";

import React, { useState } from "react";
import {
  X,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Tag,
  CheckCircle2,
  Mic,
  FileText,
} from "lucide-react";
import { IssueTicket, TicketPriority } from "../../types/karyakarta.types";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIssue: (issue: Partial<IssueTicket>) => void;
  initialVoterId?: string;
  initialVoterName?: string;
  initialBooth?: string;
  initialPhone?: string;
}

const ISSUE_CATEGORIES: Array<IssueTicket["category"]> = [
  "Water Supply",
  "Road Infrastructure",
  "Sanitation",
  "Pension / Scheme",
  "Electricity",
  "Other",
];

export function CreateIssueModal({
  isOpen,
  onClose,
  onSubmitIssue,
  initialVoterId,
  initialVoterName,
  initialBooth,
  initialPhone,
}: CreateIssueModalProps) {
  const { user } = useKaryakartaAuth();

  const [voterName, setVoterName] = useState(initialVoterName || "");
  const [voterPhone, setVoterPhone] = useState(initialPhone || "");
  const [boothNumber, setBoothNumber] = useState(
    initialBooth || (user?.assignedBooths?.[0] ?? "#101")
  );
  const [category, setCategory] = useState<IssueTicket["category"]>(
    ISSUE_CATEGORIES[0] ?? "Other"
  );
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [description, setDescription] = useState("");
  const [locationLandmark, setLocationLandmark] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceNoteRecorded, setVoiceNoteRecorded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleVoiceRecordToggle = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      setVoiceNoteRecorded(true);
      if (!description) {
        setDescription(
          "Voice note transcribed: Citizen reported persistent drainage block and requested urgent municipal suction tanker."
        );
      }
    } else {
      setIsVoiceRecording(true);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!voterName.trim()) {
      errs.voterName = "Voter or resident name is required";
    }
    if (!description.trim() || description.length < 10) {
      errs.description = "Please provide detailed grievance description (min 10 characters)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newTicket: Partial<IssueTicket> = {
      voterId: initialVoterId || `v-manual-${Date.now().toString().slice(-4)}`,
      voterName: voterName.trim(),
      voterPhone: voterPhone.trim() || "+91 98000 00000",
      voterBooth: boothNumber,
      category,
      priority,
      description: description.trim(),
      karyakartaId: user?.id || "KAR-2026-001",
      karyakartaName: user?.name || "Sachin D. Mane",
      status: "NEW",
      assignedTo: `${boothNumber} Quick Response Cell`,
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      resolutionNotes: null,
      followUps: [],
    };

    onSubmitIssue(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Log Voter Grievance / Field Issue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registered tickets are routed instantly to Candidate War Room & Ward Escalation Cell
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Voter Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Citizen / Voter Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  placeholder="e.g. Ramesh S. Kulkarni"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                    errors.voterName
                      ? "border-rose-500 bg-rose-50/30"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  } text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
                />
              </div>
              {errors.voterName && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.voterName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Citizen Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={voterPhone}
                  onChange={(e) => setVoterPhone(e.target.value)}
                  placeholder="+91 98221 00000"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                />
              </div>
            </div>
          </div>

          {/* Assigned Booth Selection & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Booth *
              </label>
              <select
                value={boothNumber}
                onChange={(e) => setBoothNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
              >
                {user?.assignedBooths?.map((b) => (
                  <option key={b} value={b}>
                    Booth {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Landmark / Mohalla / Lane
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={locationLandmark}
                  onChange={(e) => setLocationLandmark(e.target.value)}
                  placeholder="Near Ganpati Temple, Lane 3"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                />
              </div>
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Category *
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueTicket["category"])}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                >
                  {ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Urgency / Priority *
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["LOW", "MEDIUM", "HIGH", "URGENT"] as TicketPriority[]).map((p) => {
                  const active = priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        active
                          ? p === "URGENT"
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : p === "HIGH"
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : p === "MEDIUM"
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-700 text-white border-slate-700 shadow-xs"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Detailed Grievance Description *
              </label>
              <button
                type="button"
                onClick={handleVoiceRecordToggle}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                  isVoiceRecording
                    ? "bg-rose-100 text-rose-700 border border-rose-300 animate-pulse"
                    : voiceNoteRecorded
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                {isVoiceRecording
                  ? "Recording audio... (Click stop)"
                  : voiceNoteRecorded
                  ? "Voice note attached"
                  : "Record voice note"}
              </button>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem, citizen expectations, and any commitments made during doorstep visit..."
              className={`w-full p-3 text-sm rounded-xl border ${
                errors.description
                  ? "border-rose-500 bg-rose-50/30"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              } text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <FileText className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Automatic Candidate Dashboard Sync:</span> Once
              submitted, this ticket will get a unique tracking ID and appear on the candidate's
              constituency war room dashboard with your Karyakarta signature ({user?.name || "Sachin Mane"}).
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Register Grievance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
