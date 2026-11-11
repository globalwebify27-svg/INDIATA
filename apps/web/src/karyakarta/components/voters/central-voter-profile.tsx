"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  User,
  MapPin,
  Building2,
  Users,
  FileText,
  Clock,
  Phone,
  Share2,
  Printer,
  AlertCircle,
  Star,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Home,
  Copy,
  Check,
} from "lucide-react";
import { VoterRecord, PollingBooth, ActivityLogRecord, IssueTicket } from "../../types/karyakarta.types";

interface CentralVoterProfileProps {
  voter: VoterRecord | null;
  isOpen: boolean;
  onClose: () => void;
  allVoters?: VoterRecord[];
  allBooths?: PollingBooth[];
  allActivities?: ActivityLogRecord[];
  allIssues?: IssueTicket[];
  onOpenSurvey?: (voter: VoterRecord) => void;
  onPrintSlip?: (voter: VoterRecord) => void;
  onRaiseIssue?: (voter: VoterRecord) => void;
  onToggleImportant?: (voterId: string) => void;
  onSelectFamilyMember?: (voter: VoterRecord) => void;
  onOpenFamilyTree?: (familyId: string) => void;
  onRequestCorrection?: (voter: VoterRecord) => void;
}

type TabType = "personal" | "address" | "booth" | "family" | "survey" | "activity";

export function CentralVoterProfile({
  voter,
  isOpen,
  onClose,
  allVoters = [],
  allBooths = [],
  allActivities = [],
  allIssues = [],
  onOpenSurvey,
  onPrintSlip,
  onRaiseIssue,
  onToggleImportant,
  onSelectFamilyMember,
  onOpenFamilyTree,
  onRequestCorrection,
}: CentralVoterProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [copiedEpic, setCopiedEpic] = useState(false);

  if (!isOpen || !voter) return null;

  // Booth info lookup
  const boothInfo = allBooths.find((b) => b.boothNumber === voter.boothNumber);

  // Household family members
  const familyMembers = useMemo(() => {
    if (!voter.familyId) return [];
    return allVoters.filter((v) => v.familyId === voter.familyId);
  }, [allVoters, voter.familyId]);

  // Activity logs associated with this voter
  const voterActivities = useMemo(() => {
    return allActivities.filter(
      (a) =>
        a.target.includes(voter.name) ||
        a.target.includes(voter.epicId) ||
        a.details.includes(voter.epicId)
    );
  }, [allActivities, voter]);

  // Issues associated with this voter
  const voterIssues = useMemo(() => {
    return allIssues.filter((i) => i.voterId === voter.id || i.voterName === voter.name);
  }, [allIssues, voter]);

  const handleCopyEpic = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(voter.epicId);
      setCopiedEpic(true);
      setTimeout(() => setCopiedEpic(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!voter.phone) return;
    const cleanPhone = voter.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Namaskar ${voter.name} ji,\nHere is your official Election Information:\n• Booth: ${voter.boothNumber} (${voter.boothName})\n• Voter EPIC ID: ${voter.epicId}\n• Address: ${voter.address}\nINDIATA Campaign Office.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  const getSentimentPill = (cls: string) => {
    switch (cls) {
      case "Supporter":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supporter (अनुकूल)</span>
          </span>
        );
      case "Doubtful":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Doubtful (साशंक)</span>
          </span>
        );
      case "Opponent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300">
            <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
            <span>Opponent (विरोधी)</span>
          </span>
        );
      case "Neutral":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300">
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span>Neutral (तटस्थ)</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* ========================================================= */}
        {/* TOP PROFILE HERO BANNER                                  */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Avatar Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2087FE] to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                {voter.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {voter.name}
                  </h2>
                  <button
                    onClick={() => onToggleImportant && onToggleImportant(voter.id)}
                    className="cursor-pointer"
                    title={voter.isImportant ? "Starred Contact" : "Mark as Star"}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        voter.isImportant
                          ? "fill-amber-400 text-amber-400"
                          : "text-white/40 hover:text-amber-400"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-sm text-cyan-300 font-marathi mt-0.5 font-semibold">
                  {voter.marathiName}
                </p>

                <div className="mt-2 flex items-center gap-2 flex-wrap text-xs text-slate-300">
                  {/* EPIC Badge */}
                  <span className="inline-flex items-center gap-1.5 font-mono font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-white border border-white/20">
                    <span>{voter.epicId}</span>
                    <button
                      onClick={handleCopyEpic}
                      className="text-slate-400 hover:text-white"
                      title="Copy EPIC ID"
                    >
                      {copiedEpic ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </span>

                  <span>•</span>
                  <span>{voter.age} Years</span>
                  <span>•</span>
                  <span>{voter.gender === "M" ? "Male" : voter.gender === "F" ? "Female" : "Other"}</span>
                  <span>•</span>
                  <span className="text-slate-200">
                    {voter.relation} {voter.relativeName}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    Booth {voter.boothNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Sentiment & Visit Status Pills */}
            <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
              {getSentimentPill(voter.classification)}
              {voter.isVisited ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Visited on {voter.lastVisitDate || "Recent"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Pending Doorstep Visit</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Buttons Row */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
            {voter.phone && (
              <>
                <a
                  href={`tel:${voter.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call ({voter.phone})</span>
                </a>
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Slip (WhatsApp)</span>
                </button>
              </>
            )}

            {onOpenSurvey && (
              <button
                onClick={() => onOpenSurvey(voter)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Conduct Doorstep Survey</span>
              </button>
            )}

            {onPrintSlip && (
              <button
                onClick={() => onPrintSlip(voter)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voter Slip</span>
              </button>
            )}

            {onRaiseIssue && (
              <button
                onClick={() => onRaiseIssue(voter)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Raise Grievance</span>
              </button>
            )}

            {onRequestCorrection && (
              <button
                onClick={() => onRequestCorrection(voter)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Request Correction</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABS NAVIGATION                                           */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("personal")}
            className={`py-2 px-3 rounded-t-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "personal"
                ? "bg-white dark:bg-slate-900 text-blue-600 border-t-2 border-blue-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal &amp; ID</span>
          </button>

          <button
            onClick={() => setActiveTab("address")}
            className={`py-2 px-3 rounded-t-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "address"
                ? "bg-white dark:bg-slate-900 text-blue-600 border-t-2 border-blue-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Address &amp; Location</span>
          </button>

          <button
            onClick={() => setActiveTab("booth")}
            className={`py-2 px-3 rounded-t-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "booth"
                ? "bg-white dark:bg-slate-900 text-blue-600 border-t-2 border-blue-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Polling Station &amp; BLO</span>
          </button>

          <button
            onClick={() => setActiveTab("family")}
            className={`py-2 px-3 rounded-t-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "family"
                ? "bg-white dark:bg-slate-900 text-blue-600 border-t-2 border-blue-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Household ({familyMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("survey")}
            className={`py-2 px-3 rounded-t-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "survey"
                ? "bg-white dark:bg-slate-900 text-blue-600 border-t-2 border-blue-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Survey &amp; Demands</span>
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`py-2 px-3 rounded-t-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "activity"
                ? "bg-white dark:bg-slate-900 text-blue-600 border-t-2 border-blue-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History ({voterActivities.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB PANELS                                                */}
        {/* ========================================================= */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          {/* Tab 1: Personal & Identification */}
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Electoral Identification
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">EPIC / Voter ID:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{voter.epicId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Electoral Part:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{voter.electoralPart}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Booth:</span>
                    <span className="font-mono font-bold text-blue-600">{voter.boothNumber}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Demographic Details
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date of Birth:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{voter.dob || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Caste / Community:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{voter.caste || "Not recorded"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Occupation:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{voter.occupation || "Not recorded"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Qualification:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{voter.qualification || "Not recorded"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Address & Administrative Location */}
          {activeTab === "address" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-blue-600" />
                  <span>Household Address</span>
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">House Number:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{voter.houseNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Full Registered Address:</span>
                    <span className="font-medium text-slate-900 dark:text-white block leading-relaxed">
                      {voter.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Administrative Division</span>
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ward Number:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{voter.ward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prabhaag:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{voter.prabhaag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Village / City:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{voter.village}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assembly:</span>
                    <span className="font-bold text-[#2087FE]">215 - Kasba Peth</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Polling Station & BLO Details */}
          {activeTab === "booth" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      Polling Station {voter.boothNumber}
                    </h4>
                  </div>
                  {boothInfo?.googleMapsUrl && (
                    <a
                      href={boothInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Polling Centre:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {boothInfo?.pollingCentre || voter.boothName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Station Address:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {boothInfo?.pollingAddress || voter.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* BLO Officer Card */}
              {boothInfo && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Designated Booth Level Officer (BLO)
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        {boothInfo.bloName}
                      </h5>
                      <p className="text-[11px] text-slate-500">{boothInfo.bloDesignation}</p>
                    </div>
                    <a
                      href={`tel:${boothInfo.bloPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{boothInfo.bloPhone}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Household & Family Members */}
          {activeTab === "family" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Household Registered at {voter.houseNo} (Family ID: {voter.familyId})
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{familyMembers.length} Members</span>
                  {onOpenFamilyTree && voter.familyId && (
                    <button
                      onClick={() => onOpenFamilyTree(voter.familyId)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-300 font-bold text-xs cursor-pointer border border-purple-200 dark:border-purple-800"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Family Tree View</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      member.id === voter.id
                        ? "bg-blue-50/70 border-blue-300 dark:bg-blue-950/40 dark:border-blue-800"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {member.name}
                          </span>
                          {member.familyHead && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              Head
                            </span>
                          )}
                          {member.id === voter.id && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              Active Profile
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-marathi">
                          {member.marathiName} • {member.relation} {member.relativeName} • {member.age} Yrs / {member.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                        {member.epicId}
                      </span>
                      {member.id !== voter.id && onSelectFamilyMember && (
                        <button
                          onClick={() => onSelectFamilyMember(member)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                        >
                          View &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Doorstep Survey & Grievance Demands */}
          {activeTab === "survey" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Schemes &amp; Government Benefits
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {voter.scheme || "No government schemes currently tagged."}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Local Area Demand / Grievance
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {voter.demand || "No specific local demands recorded."}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cadre Remarks &amp; Past Candidate Assistance
                </span>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {voter.remarks || "No field remarks entered."}
                </p>
                {voter.candidateHelp && (
                  <p className="text-[11px] text-cyan-600 dark:text-cyan-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                    Candidate Help: {voter.candidateHelp}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 6: Activity History & Tickets */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              {voterActivities.length === 0 && voterIssues.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-xs">No activity records logged for this voter yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {voterActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {act.action}
                        </span>
                        <span className="text-[11px] text-slate-500">{act.details}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{act.timestamp}</span>
                    </div>
                  ))}

                  {voterIssues.map((iss) => (
                    <div
                      key={iss.id}
                      className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-orange-900 dark:text-orange-200 block">
                          Issue: {iss.category} ({iss.ticketNumber})
                        </span>
                        <span className="text-[11px] text-orange-800 dark:text-orange-300">
                          {iss.description}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-200 text-orange-800">
                        {iss.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
