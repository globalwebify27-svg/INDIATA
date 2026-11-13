"use client";

import React, { useState, useEffect } from "react";
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
  Search,
  UserPlus,
  Eye,
  Check,
  Copy,
  Loader2,
} from "lucide-react";
import {
  IssueTicket,
  TicketPriority,
  VoterRecord,
} from "../../types/karyakarta.types";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";
import { VoterTicketService } from "../../services/voter-ticket-service";
import { VoterSearchResult } from "@/lib/voters/central-voter-store";
import { CreateVoterProfileModal } from "../voters/create-voter-profile-modal";
import { CentralVoterProfile } from "../voters/central-voter-profile";

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

  // Voter Search & Association State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<VoterSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<VoterRecord | null>(null);

  // Modals state
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);

  // Grievance Fields
  const [voterName, setVoterName] = useState(initialVoterName || "");
  const [voterPhone, setVoterPhone] = useState(initialPhone || "");
  const [boothNumber, setBoothNumber] = useState(
    initialBooth || (user?.assignedBooths?.[0] ?? "#101")
  );
  const [category, setCategory] = useState<IssueTicket["category"]>(
    ISSUE_CATEGORIES[0] ?? "Other"
  );
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [description, setDescription] = useState("");
  const [locationLandmark, setLocationLandmark] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceNoteRecorded, setVoiceNoteRecorded] = useState(false);

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEpic, setCopiedEpic] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialVoterId) {
        // Load initial voter if provided
        VoterTicketService.searchVoters(initialVoterId).then((res) => {
          if (res.length > 0 && res[0]?.voter) {
            handleSelectVoter(res[0].voter);
          }
        });
      }
    } else {
      // Reset search on close
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
      setSelectedVoter(null);
    }
  }, [isOpen, initialVoterId]);

  if (!isOpen) return null;

  // Real-time or triggered search
  const handlePerformSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await VoterTicketService.searchVoters(q, {
        booth: boothNumber !== "all" ? boothNumber : undefined,
        organizationId: user?.organizationId,
        limit: 8,
      });
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectVoter = (voter: VoterRecord) => {
    setSelectedVoter(voter);
    setVoterName(voter.name);
    if (voter.phone) setVoterPhone(voter.phone);
    if (voter.boothNumber) setBoothNumber(voter.boothNumber);
    if (voter.address) setLocationLandmark(voter.address);
    setSearchResults([]);
    setHasSearched(false);
    setSearchQuery("");
  };

  const handleUnlinkVoter = () => {
    setSelectedVoter(null);
  };

  // Called after newly created voter profile is saved
  const handleVoterCreated = (newVoter: VoterRecord) => {
    // Automatically associate newly created voter
    handleSelectVoter(newVoter);
    setIsCreateProfileOpen(false);
  };

  const handleCopyEpic = (epic: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(epic);
      setCopiedEpic(true);
      setTimeout(() => setCopiedEpic(false), 2000);
    }
  };

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
    if (!description.trim() || description.length < 5) {
      errs.description = "Please provide grievance description (min 5 characters)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const ticketPayload: Partial<IssueTicket> = {
        voterId: selectedVoter?.id || initialVoterId || null,
        voterName: voterName.trim(),
        voterPhone: voterPhone.trim() || "+91 98000 00000",
        voterBooth: boothNumber,
        category,
        title: title.trim() || `${category} Issue - ${voterName.trim()}`,
        priority,
        description: description.trim(),
        location: locationLandmark.trim(),
        karyakartaId: user?.id || "KAR-2026-001",
        karyakartaName: user?.name || "Sachin D. Mane",
        assignedTo: `${boothNumber} Quick Response Cell`,
        organizationId: user?.organizationId || "org-kasba-peth-2026",
      };

      // Call API / service
      const res = await VoterTicketService.createTicket(ticketPayload, {
        karyakartaId: user?.id,
        karyakartaName: user?.name,
        organizationId: user?.organizationId,
      });

      if (res.success && res.data) {
        onSubmitIssue(res.data);
        onClose();
      } else {
        // Fallback local submission
        onSubmitIssue({
          ...ticketPayload,
          id: `iss-${Date.now().toString().slice(-4)}`,
          ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
          status: "NEW",
          createdAt: "Just now",
          updatedAt: "Just now",
          resolutionNotes: null,
          followUps: [],
        });
        onClose();
      }
    } catch {
      // Graceful local pass through
      onSubmitIssue({
        voterId: selectedVoter?.id || initialVoterId || null,
        voterName: voterName.trim(),
        voterPhone: voterPhone.trim(),
        voterBooth: boothNumber,
        category,
        priority,
        description: description.trim(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
          {/* ========================================================= */}
          {/* MODAL HEADER                                              */}
          {/* ========================================================= */}
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
                  Search &amp; link central voter record, or create a new citizen profile on the fly
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* FORM BODY                                                 */}
          {/* ========================================================= */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            {/* --------------------------------------------------------- */}
            {/* 1. VOTER IDENTIFICATION, SEARCH & SELECTION (REQ 5 & 6)  */}
            {/* --------------------------------------------------------- */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Citizen / Elector Association</span>
                </div>
                {selectedVoter ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Linked to Central Record</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Search existing or create new</span>
                )}
              </div>

              {/* A: SELECTED VOTER INFORMATION SUMMARY CARD */}
              {selectedVoter ? (
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2087FE] to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                        {selectedVoter.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {selectedVoter.name}
                          </h4>
                          {selectedVoter.marathiName && (
                            <span className="text-xs text-slate-400 font-marathi">
                              ({selectedVoter.marathiName})
                            </span>
                          )}
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                            <span>{selectedVoter.epicId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyEpic(selectedVoter.epicId)}
                              className="cursor-pointer text-slate-400 hover:text-blue-600"
                              title="Copy EPIC ID"
                            >
                              {copiedEpic ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
                          {selectedVoter.phone && (
                            <span className="font-mono text-emerald-600 font-semibold">
                              {selectedVoter.phone}
                            </span>
                          )}
                          {selectedVoter.phone && <span>•</span>}
                          <span>Booth {selectedVoter.boothNumber}</span>
                          <span>•</span>
                          <span>Record ID: <code className="font-mono">{selectedVoter.id}</code></span>
                        </div>

                        {selectedVoter.address && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{selectedVoter.houseNo ? `${selectedVoter.houseNo}, ` : ""}{selectedVoter.address}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsViewProfileOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-blue-200 dark:border-blue-800 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View 360° Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleUnlinkVoter}
                        className="text-[10.5px] font-semibold text-rose-500 hover:underline cursor-pointer"
                      >
                        Change / Unlink Voter
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* B: SEARCH INPUT & FUZZY MATCH RESULTS */
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handlePerformSearch(e.target.value);
                      }}
                      placeholder="Search voter by name, Marathi spelling, EPIC ID, or phone..."
                      className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                    />
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 text-blue-600 absolute right-3 top-2.5 animate-spin" />
                    ) : searchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          setHasSearched(false);
                        }}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>

                  {/* SEARCH RESULTS DROPDOWN / LIST */}
                  {searchResults.length > 0 && (
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-h-52 overflow-y-auto space-y-1.5 shadow-md">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                        <span>Matching Electors ({searchResults.length})</span>
                        <span>Click to associate with ticket</span>
                      </div>

                      {searchResults.map(({ voter, matchType }) => (
                        <div
                          key={voter.id}
                          onClick={() => handleSelectVoter(voter)}
                          className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-between gap-2 cursor-pointer group"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                                {voter.name}
                              </span>
                              {voter.marathiName && (
                                <span className="text-[11px] text-slate-400 font-marathi">
                                  ({voter.marathiName})
                                </span>
                              )}
                              <span
                                className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ${
                                  matchType === "exact"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                }`}
                              >
                                {matchType === "exact" ? "Exact Match" : "Fuzzy Match"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10.5px] text-slate-500">
                              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                {voter.epicId}
                              </span>
                              <span>•</span>
                              <span>Booth {voter.boothNumber}</span>
                              {voter.phone && <span>•</span>}
                              {voter.phone && <span>{voter.phone}</span>}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectVoter(voter);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-[#2087FE] text-white hover:bg-blue-600 shadow-2xs"
                          >
                            Select &rarr;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* NO MATCH FOUND BANNER (REQ 5.1 & 5.2) */}
                  {hasSearched && searchQuery.trim() && searchResults.length === 0 && !isSearching && (
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-xs">No Matching Voter Found</p>
                          <p className="text-[11px] text-amber-800 dark:text-amber-400 mt-0.5">
                            No registered elector in your assigned booths matched &ldquo;{searchQuery}&rdquo;.
                            You can create a complete Central Voter Profile right now without losing this grievance ticket.
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsCreateProfileOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-transform active:scale-95"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Create New Voter Profile</span>
                        </button>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400">
                          (All fields optional • Follows Central Voter Profile)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --------------------------------------------------------- */}
            {/* 2. CITIZEN NAME & PHONE (IF VOTER NOT LINKED)             */}
            {/* --------------------------------------------------------- */}
            {!selectedVoter && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Citizen / Voter Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      placeholder="e.g. Ramesh S. Kulkarni"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
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
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Citizen Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={voterPhone}
                      onChange={(e) => setVoterPhone(e.target.value)}
                      placeholder="+91 98221 00000"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* 3. ASSIGNED BOOTH & LANDMARK LOCATION                     */}
            {/* --------------------------------------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Booth
                </label>
                <select
                  value={boothNumber}
                  onChange={(e) => setBoothNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                >
                  {user?.assignedBooths?.map((b) => (
                    <option key={b} value={b}>
                      Booth {b}
                    </option>
                  ))}
                  <option value="#101">Booth #101</option>
                  <option value="#102">Booth #102</option>
                  <option value="#103">Booth #103</option>
                  <option value="#104">Booth #104</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Landmark / Mohalla / Lane <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={locationLandmark}
                    onChange={(e) => setLocationLandmark(e.target.value)}
                    placeholder="Near Ganpati Temple, Lane 3"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* 4. CATEGORY & PRIORITY                                    */}
            {/* --------------------------------------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Category *
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IssueTicket["category"])}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
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

            {/* Optional Title */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grievance Title <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Low municipal water pressure in Lane 3"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
              />
            </div>

            {/* --------------------------------------------------------- */}
            {/* 5. DETAILED GRIEVANCE DESCRIPTION & VOICE NOTE            */}
            {/* --------------------------------------------------------- */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Grievance Description *
                </label>
                <button
                  type="button"
                  onClick={handleVoiceRecordToggle}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
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
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, citizen expectations, commitments made, or municipal follow-up needed..."
                className={`w-full p-3 text-xs rounded-xl border ${
                  errors.description
                    ? "border-rose-500 bg-rose-50/30"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                } text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
              />
              {errors.description && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.description}</p>
              )}
            </div>

            {/* Sync Notice */}
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
              <FileText className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Candidate War Room Sync:</span> Registered ticket will link to {selectedVoter ? `elector profile #${selectedVoter.id}` : "manual resident"} and dispatch immediately to Candidate Office.
              </div>
            </div>

            {/* ========================================================= */}
            {/* MODAL ACTIONS                                             */}
            {/* ========================================================= */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Ticket...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Register Grievance</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CREATE NEW VOTER PROFILE MODAL */}
      <CreateVoterProfileModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        onVoterCreated={handleVoterCreated}
        initialQuery={searchQuery}
        defaultBooth={boothNumber}
      />

      {/* VIEW ASSOCIATED CENTRAL VOTER PROFILE 360° */}
      {selectedVoter && (
        <CentralVoterProfile
          voter={selectedVoter}
          isOpen={isViewProfileOpen}
          onClose={() => setIsViewProfileOpen(false)}
        />
      )}
    </>
  );
}
