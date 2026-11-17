"use client";

import React, { useState, useMemo } from "react";
import {
  Phone,
  MessageSquare,
  Search,
  Users,
  ShieldCheck,
  ExternalLink,
  Eye,
  X,
  ArrowLeft,
  BookUser,
  Copy,
  User,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { SEED_ELECTORS, ElectorRecord } from "./voter-management-view";

// ============================================================================
// DATA MODELS
// ============================================================================

export interface CampaignTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CANDIDATE_ADMIN" | "WAR_ROOM_HEAD" | "PRABHAAG_INCHARGE" | "KARYAKARTA" | "DATA_OPERATOR";
  status: "ACTIVE" | "ON_LEAVE" | "OFFLINE";
  prabhaag?: string;
  assignedBooths: number[];
  lastActive: string;
}

export const SEED_CAMPAIGN_TEAM: CampaignTeamMember[] = [
  {
    id: "usr-01",
    name: "Adv. Vikram Patil",
    email: "vikram.patil@indata-election.in",
    phone: "+91 98220 99000",
    role: "CANDIDATE_ADMIN",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104, 105, 106, 107, 108],
    lastActive: "Just now",
  },
  {
    id: "usr-02",
    name: "Dr. Sameer Deshpande",
    email: "sameer.d@indata-election.in",
    phone: "+91 98221 44556",
    role: "WAR_ROOM_HEAD",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104, 105, 106, 107, 108],
    lastActive: "4 mins ago",
  },
  {
    id: "usr-03",
    name: "Sachin Babar",
    email: "sachin.babar@indata-election.in",
    phone: "+91 98500 12345",
    role: "PRABHAAG_INCHARGE",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [101, 102, 103],
    lastActive: "18 mins ago",
  },
  {
    id: "usr-04",
    name: "Pooja Jadhav",
    email: "pooja.j@indata-election.in",
    phone: "+91 94230 78901",
    role: "KARYAKARTA",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [101],
    lastActive: "1 hour ago",
  },
  {
    id: "usr-05",
    name: "Ganesh Patil",
    email: "ganesh.p@indata-election.in",
    phone: "+91 98229 11450",
    role: "KARYAKARTA",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [102],
    lastActive: "35 mins ago",
  },
  {
    id: "usr-06",
    name: "Mahesh Thorat",
    email: "mahesh.t@indata-election.in",
    phone: "+91 98909 33221",
    role: "DATA_OPERATOR",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104],
    lastActive: "2 hours ago",
  },
];

// ============================================================================
// CONTINUOUS SINGLE-PAGE PROFILE COMPONENT
// ============================================================================

function VoterQuickProfileView({
  voter,
  onBack,
}: {
  voter: ElectorRecord;
  onBack: () => void;
}) {
  const { showToast } = useToast();

  const handleCopyEpic = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(voter.epicNumber);
      showToast("info", "EPIC Copied", `EPIC ID ${voter.epicNumber} copied to clipboard!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 flex items-center justify-between gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Phone Book</span>
        </button>

        <div className="flex items-center gap-2">
          {voter.mobile && (
            <a
              href={`tel:${voter.mobile}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Elector</span>
            </a>
          )}
          {voter.mobile && (
            <a
              href={`https://wa.me/${voter.mobile.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {voter.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{voter.fullName}</h2>
                {voter.hindiName && (
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {voter.hindiName}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Elector
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                <span>{voter.relationType}: {voter.relativeName}</span>
                <span>•</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{voter.epicNumber}</span>
                <button onClick={handleCopyEpic} className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <Copy className="w-3 h-3" />
                </button>
                <span>•</span>
                <span>Booth #{voter.boothNumber}</span>
                <span>•</span>
                <span>Sr #{voter.serialNo}</span>
              </div>
            </div>
          </div>

          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              voter.politicalLeaning === "STRONG_SUPPORTER"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : voter.politicalLeaning === "LEANING_SUPPORTER"
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : voter.politicalLeaning === "LEANING_OPPOSITION"
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : "bg-slate-100 text-slate-700"
            }`}>
              {voter.politicalLeaning.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Continuous Subsections */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Contact &amp; Demographics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Phone Contact</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">{voter.mobile || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Age &amp; Gender</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.age} yrs / {voter.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Assigned Polling Booth</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Booth #{voter.boothNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Ward / Prabhaag</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.ward || voter.prabhaag}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 block mb-0.5">Polling Station</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{voter.pollingStation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CONSTITUENCY PHONE BOOK COMPONENT
// ============================================================================

export function PhoneBookView() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"voters" | "users">("voters");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedVoter, setSelectedVoter] = useState<ElectorRecord | null>(null);

  // Filtered Voters
  const filteredVoters = useMemo(() => {
    if (!searchQuery.trim()) return SEED_ELECTORS;
    const q = searchQuery.toLowerCase().trim();
    return SEED_ELECTORS.filter((v) => {
      const matchName = v.fullName.toLowerCase().includes(q);
      const matchPhone = v.mobile ? v.mobile.includes(q) || v.mobile.replace(/\s+/g, "").includes(q.replace(/\s+/g, "")) : false;
      const matchEpic = v.epicNumber.toLowerCase().includes(q);
      return matchName || matchPhone || matchEpic;
    });
  }, [searchQuery]);

  // Filtered Campaign Team
  const filteredTeam = useMemo(() => {
    if (!searchQuery.trim()) return SEED_CAMPAIGN_TEAM;
    const q = searchQuery.toLowerCase().trim();
    return SEED_CAMPAIGN_TEAM.filter((m) => {
      const matchName = m.name.toLowerCase().includes(q);
      const matchPhone = m.phone.includes(q) || m.phone.replace(/\s+/g, "").includes(q.replace(/\s+/g, ""));
      const matchRole = m.role.toLowerCase().includes(q) || m.role.replace("_", " ").toLowerCase().includes(q);
      return matchName || matchPhone || matchRole;
    });
  }, [searchQuery]);

  // Click-to-Call Handler
  const handleCall = (name: string, phone?: string) => {
    if (!phone) {
      showToast("warning", "No Phone Number", `No registered mobile number for ${name}.`);
      return;
    }
    showToast("info", "Click-to-Call", `Dialing ${name} (${phone}) via tele-outreach gateway.`);
    window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
  };

  // WhatsApp Handler
  const handleWhatsApp = (name: string, phone?: string) => {
    if (!phone) {
      showToast("warning", "No Phone Number", `No registered WhatsApp contact for ${name}.`);
      return;
    }
    const cleanNumber = phone.replace(/\D/g, "");
    showToast("info", "WhatsApp Outreach", `Opening WhatsApp chat with ${name} (${phone}).`);
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  if (selectedVoter) {
    return <VoterQuickProfileView voter={selectedVoter} onBack={() => setSelectedVoter(null)} />;
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ===================================================================== */}
      {/* HEADER SECTION (Breadcrumb, Title, Subtitle, Tab Switcher)            */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Communication Directory
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Verified Contacts
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Constituency Phone Book
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quick click-to-call and WhatsApp outreach for voters and campaign personnel.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => setActiveTab("voters")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "voters"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Voter Contacts ({SEED_ELECTORS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Campaign Team ({SEED_CAMPAIGN_TEAM.length})</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SEARCH INPUT BAR                                                      */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === "voters"
                ? "Search voter name, phone number, or EPIC ID..."
                : "Search campaign staff, Karyakartas, or role..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CONTACTS CARD GRID (3 COLUMNS - MATCHING SCREENSHOTS EXACTLY)         */}
      {/* ===================================================================== */}
      {activeTab === "voters" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVoters.map((voter) => (
            <div
              key={voter.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header: Name, Booth, Leaning Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3
                      className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                      onClick={() => setSelectedVoter(voter)}
                    >
                      {voter.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Booth #{voter.boothNumber} • Sr {voter.serialNo}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      voter.politicalLeaning === "STRONG_SUPPORTER"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : voter.politicalLeaning === "LEANING_SUPPORTER"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : voter.politicalLeaning === "LEANING_OPPOSITION"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {voter.politicalLeaning.replace("_", " ")}
                  </span>
                </div>

                {/* Card Info Box */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mobile Phone:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {voter.mobile || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">EPIC ID:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {voter.epicNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons: Call, WhatsApp, View Profile */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleCall(voter.fullName, voter.mobile)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Call</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsApp(voter.fullName, voter.mobile)}
                  className="flex-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVoter(voter)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="View Full Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm hover:text-teal-600 cursor-pointer">
                      {member.name}
                    </h3>
                    <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                      {member.role.replace("_", " ")}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    {member.status}
                  </span>
                </div>

                {/* Info Box */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Direct Contact:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {member.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned Area:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[160px]">
                      {member.prabhaag || "All Booths"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleCall(member.name, member.phone)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Call Team</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsApp(member.name, member.phone)}
                  className="flex-1 py-1.5 px-3 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
