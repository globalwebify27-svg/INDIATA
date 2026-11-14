"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  FileQuestion,
  Send,
  Phone,
  MessageSquare,
  Eye,
  Filter,
  LayoutList,
  LayoutGrid,
  MapPin,
  X,
  Share2,
  Star,
  ExternalLink,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  SlidersHorizontal,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VoterRecord {
  id: string;
  epicId: string;
  name: string;
  marathiName: string;
  relativeName: string;
  relation: "S/o" | "D/o" | "W/o";
  age: number;
  gender: "M" | "F" | "Other";
  houseNo: string;
  ward: string;
  boothNumber: string;
  boothName: string;
  status: "Verified" | "Correction Req" | "Quarantined";
  phone: string;
  hasPhoto: boolean;
  caste: string;
  occupation: string;
  scheme: string;
  sentiment: "Strong Supporter" | "Lean Favorable" | "Neutral / Undecided" | "Opponent";
  familyHead: boolean;
  familyMembersCount: number;
}

const SAMPLE_VOTERS: VoterRecord[] = [
  {
    id: "v-01",
    epicId: "WXE4829102",
    name: "Rajesh Kumar Verma",
    marathiName: "राजेश कुमार वर्मा",
    relativeName: "Ramesh Verma",
    relation: "S/o",
    age: 42,
    gender: "M",
    houseNo: "Plot 14, Lane 3",
    ward: "Ward 12",
    boothNumber: "#101",
    boothName: "Navbharat High School",
    status: "Verified",
    phone: "+91 98221 44001",
    hasPhoto: true,
    caste: "Maratha",
    occupation: "Retail Trader / Merchant",
    scheme: "Pradhan Mantri Awas Yojana",
    sentiment: "Strong Supporter",
    familyHead: true,
    familyMembersCount: 3,
  },
  {
    id: "v-02",
    epicId: "WXE9821443",
    name: "Sunita Rajesh Verma",
    marathiName: "सुनिता राजेश वर्मा",
    relativeName: "Rajesh Verma",
    relation: "W/o",
    age: 38,
    gender: "F",
    houseNo: "Plot 14, Lane 3",
    ward: "Ward 12",
    boothNumber: "#101",
    boothName: "Navbharat High School",
    status: "Verified",
    phone: "+91 98221 44002",
    hasPhoto: true,
    caste: "Maratha",
    occupation: "Homemaker",
    scheme: "Mukhyamantri Ladki Bahin Yojana",
    sentiment: "Strong Supporter",
    familyHead: false,
    familyMembersCount: 3,
  },
  {
    id: "v-03",
    epicId: "WXE3109244",
    name: "Pooja Santosh Deshmukh",
    marathiName: "पूजा संतोष देशमुख",
    relativeName: "Santosh Deshmukh",
    relation: "D/o",
    age: 21,
    gender: "F",
    houseNo: "Flat 402, Shiv Plaza",
    ward: "Ward 14",
    boothNumber: "#107",
    boothName: "Ferguson Junior College",
    status: "Verified",
    phone: "+91 97654 32110",
    hasPhoto: true,
    caste: "Brahmin",
    occupation: "Student & First-Time Voter",
    scheme: "None",
    sentiment: "Neutral / Undecided",
    familyHead: false,
    familyMembersCount: 4,
  },
  {
    id: "v-04",
    epicId: "WXE1290384",
    name: "Amit Baban Shinde",
    marathiName: "अमित बबन शिंदे",
    relativeName: "Baban Shinde",
    relation: "S/o",
    age: 29,
    gender: "M",
    houseNo: "House 88, Gaothan",
    ward: "Ward 9",
    boothNumber: "#106",
    boothName: "Modern High School",
    status: "Correction Req",
    phone: "+91 98900 12345",
    hasPhoto: false,
    caste: "OBC - Mali",
    occupation: "IT & Software Engineer",
    scheme: "Ayushman Bharat - PMJAY",
    sentiment: "Lean Favorable",
    familyHead: true,
    familyMembersCount: 2,
  },
  {
    id: "v-05",
    epicId: "WXE7765109",
    name: "Kavita Ashok Patil",
    marathiName: "कविता अशोक पाटील",
    relativeName: "Ashok Patil",
    relation: "W/o",
    age: 54,
    gender: "F",
    houseNo: "Bldg 3, Erandwane",
    ward: "Ward 14",
    boothNumber: "#108",
    boothName: "Gokhale Memorial Hall",
    status: "Verified",
    phone: "+91 98230 99887",
    hasPhoto: true,
    caste: "Maratha",
    occupation: "Government & Municipal Staff",
    scheme: "Mukhyamantri Ladki Bahin Yojana",
    sentiment: "Strong Supporter",
    familyHead: false,
    familyMembersCount: 3,
  },
  {
    id: "v-06",
    epicId: "WXE5544321",
    name: "Surendra Mohan Joshi",
    marathiName: "सुरेंद्र मोहन जोशी",
    relativeName: "Mohan Joshi",
    relation: "S/o",
    age: 67,
    gender: "M",
    houseNo: "Bungalow 7, Deccan",
    ward: "Ward 14",
    boothNumber: "#108",
    boothName: "Gokhale Memorial Hall",
    status: "Quarantined",
    phone: "+91 99221 00998",
    hasPhoto: true,
    caste: "Brahmin",
    occupation: "Retired Senior Citizen",
    scheme: "Sanjay Gandhi Niradhar Yojana",
    sentiment: "Lean Favorable",
    familyHead: true,
    familyMembersCount: 2,
  },
];

export function VoterManagementView() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"roll" | "requests">("roll");

  // Modals & Dossier State
  const [showDataEnquiryModal, setShowDataEnquiryModal] = useState(false);
  const [selectedProfileVoter, setSelectedProfileVoter] = useState<VoterRecord | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<"basic" | "address" | "election" | "family" | "survey" | "office" | "tickets" | "comms">("basic");
  const [showHouseAddressModal, setShowHouseAddressModal] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [voterNotes, setVoterNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([
    "Met during morning ward canvassing. Family leans positive towards our manifesto.",
    "Requested voter slip delivery via WhatsApp on family head's phone number.",
  ]);
  const [assignedWorker, setAssignedWorker] = useState("Pooja Santosh Jagtap (Squad Alpha)");
  const [priorityGrade, setPriorityGrade] = useState<"Grade A - Must Mobilize" | "Grade B - Follow-up" | "Grade C - Neutral">("Grade A - Must Mobilize");
  const [isFamilyHeadState, setIsFamilyHeadState] = useState(true);
  const [customTagInput, setCustomTagInput] = useState("Key Influencer");

  // Advanced Multi-Select Filter Accordions State
  const [filterAccordionOpen, setFilterAccordionOpen] = useState({
    caste: true,
    booth: true,
    stance: true,
    age: true,
  });
  const [selectedCastes, setSelectedCastes] = useState<string[]>([]);
  const [selectedBooths, setSelectedBooths] = useState<string[]>([]);
  const [selectedStances, setSelectedStances] = useState<string[]>([]);
  const [selectedAgeBrackets, setSelectedAgeBrackets] = useState<string[]>([]);

  // Data Enquiry Form State
  const enquiryState = "Maharashtra";
  const enquiryDistrict = "Pune";
  const [enquiryVidhanSabha, setEnquiryVidhanSabha] = useState("215 - Kasba Peth");
  const [enquiryDetails, setEnquiryDetails] = useState("");

  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleAppendNote = () => {
    if (!voterNotes.trim()) return;
    setSavedNotes((prev) => [voterNotes.trim(), ...prev]);
    setVoterNotes("");
    showToast("success", "Field Note Appended", "Real-time note saved to elector record.");
  };

  const handleSyncOrgData = () => {
    showToast(
      "success",
      "Organization Metrics Synced",
      "Internal metrics and worker assignment saved to master database."
    );
  };

  const filteredVoters = SAMPLE_VOTERS.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marathiName.includes(searchTerm) ||
      v.epicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.boothNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm);

    const matchesGender = genderFilter === "all" || v.gender === genderFilter;
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const matchesCaste = selectedCastes.length === 0 || selectedCastes.some((c) => v.caste.includes(c));
    const matchesBooth = selectedBooths.length === 0 || selectedBooths.includes(v.boothNumber);
    const matchesStance = selectedStances.length === 0 || selectedStances.includes(v.sentiment);
    const matchesAge =
      selectedAgeBrackets.length === 0 ||
      selectedAgeBrackets.some((br) => {
        if (br === "18-25") return v.age >= 18 && v.age <= 25;
        if (br === "26-40") return v.age >= 26 && v.age <= 40;
        if (br === "41-60") return v.age >= 41 && v.age <= 60;
        if (br === "60+") return v.age > 60;
        return true;
      });

    return matchesSearch && matchesGender && matchesStatus && matchesCaste && matchesBooth && matchesStance && matchesAge;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVoters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVoters.map((v) => v.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    showToast(
      "success",
      "Voter Roll Export Initiated",
      `Exporting ${filteredVoters.length} elector records to CSV / Excel format.`
    );
  };

  const handleQueueBroadcast = () => {
    if (selectedIds.length === 0) {
      showToast("warning", "No Electors Selected", "Please select at least one elector to dispatch voter slips.");
      return;
    }
    showToast(
      "info",
      "Campaign Queue Updated",
      `${selectedIds.length} electors queued for WhatsApp Voter Slip broadcast.`
    );
  };

  const handleDataEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDataEnquiryModal(false);
    showToast(
      "success",
      "Voter Data Enquiry Dispatched",
      `Your request for additional voter data in ${enquiryVidhanSabha} has been submitted to the Indata Central Ops team. Reference: #ENQ-${Date.now().toString().slice(-5)}`
    );
    setEnquiryDetails("");
  };

  return (
    <div className="space-y-5">
      {/* Module Header Bar */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 07: Total Voters
            </span>
            <Badge variant="teal">248,650 Electors Mapped</Badge>
            <Badge variant="neutral">ECI Draft Roll #4029</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Electoral Roll &amp; Central Voter Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Search-first master voter registry with EPIC cross-indexing, booth mapping, household linkages, and Central Profile 360°.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="md" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered Roll</span>
          </Button>

          {/* Compliant Action: Request Additional Voter Data (Replaces direct import/add per spec) */}
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowDataEnquiryModal(true)}
            className="cursor-pointer"
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Request Additional Voter Data</span>
          </Button>
        </div>
      </section>

      {/* Search & Advanced Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by voter name, EPIC ID, booth number, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Quick Controls & View Toggle */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "table" ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs" : "text-slate-500"
                }`}
                title="Table View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "cards" ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs" : "text-slate-500"
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Advanced Filters Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`cursor-pointer ${showFilterDrawer ? "border-brand-500 text-brand-600 bg-brand-50" : ""}`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Advanced Filters</span>
            </Button>

            {/* Gender filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="py-1.5 pl-2.5 pr-7 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
              <option value="Other">Third Gender</option>
            </select>

            {/* Verification Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 pl-2.5 pr-7 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Correction Req">Correction Pending</option>
              <option value="Quarantined">Quarantined Form</option>
            </select>

            {/* Action on selected */}
            {selectedIds.length > 0 && (
              <Button variant="secondary" size="sm" onClick={handleQueueBroadcast}>
                <Send className="w-3 h-3" />
                <span>Broadcast Slips ({selectedIds.length})</span>
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters Drawer (Section 3: Multi-Select Accordions) */}
        {showFilterDrawer && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6256D9]" />
                <span>Multi-Select Voter Segmentation Accordions</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCastes([]);
                  setSelectedBooths([]);
                  setSelectedStances([]);
                  setSelectedAgeBrackets([]);
                  setGenderFilter("all");
                  setStatusFilter("all");
                  setSearchTerm("");
                }}
                className="text-xs font-semibold text-[#6256D9] hover:underline cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Accordion 1: Caste & Community */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => setFilterAccordionOpen((p) => ({ ...p, caste: !p.caste }))}
                  className="w-full flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  <span>Caste &amp; Community ({selectedCastes.length})</span>
                  {filterAccordionOpen.caste ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {filterAccordionOpen.caste && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    {["Maratha", "Brahmin", "OBC", "SC", "Jain", "Muslim"].map((c) => {
                      const active = selectedCastes.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleArrayItem(selectedCastes, setSelectedCastes, c)}
                          className="w-full flex items-center gap-2 text-left cursor-pointer hover:text-[#6256D9]"
                        >
                          {active ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#6256D9] shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className={active ? "font-bold text-[#6256D9]" : "text-slate-600 dark:text-slate-300"}>{c}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 2: Polling Station / Booth */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => setFilterAccordionOpen((p) => ({ ...p, booth: !p.booth }))}
                  className="w-full flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  <span>Polling Stations ({selectedBooths.length})</span>
                  {filterAccordionOpen.booth ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {filterAccordionOpen.booth && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    {["#101", "#102", "#103", "#104", "#105", "#108"].map((b) => {
                      const active = selectedBooths.includes(b);
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => toggleArrayItem(selectedBooths, setSelectedBooths, b)}
                          className="w-full flex items-center gap-2 text-left cursor-pointer hover:text-[#6256D9]"
                        >
                          {active ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#6256D9] shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className={active ? "font-bold text-[#6256D9]" : "text-slate-600 dark:text-slate-300"}>Booth {b}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 3: Voting Stance / Sentiment */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => setFilterAccordionOpen((p) => ({ ...p, stance: !p.stance }))}
                  className="w-full flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  <span>Voting Inclination ({selectedStances.length})</span>
                  {filterAccordionOpen.stance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {filterAccordionOpen.stance && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    {["Strong Supporter", "Lean Favorable", "Neutral / Undecided", "Opponent"].map((s) => {
                      const active = selectedStances.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleArrayItem(selectedStances, setSelectedStances, s)}
                          className="w-full flex items-center gap-2 text-left cursor-pointer hover:text-[#6256D9]"
                        >
                          {active ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#6256D9] shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className={active ? "font-bold text-[#6256D9]" : "text-slate-600 dark:text-slate-300"}>{s}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 4: Age Brackets */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => setFilterAccordionOpen((p) => ({ ...p, age: !p.age }))}
                  className="w-full flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  <span>Age Brackets ({selectedAgeBrackets.length})</span>
                  {filterAccordionOpen.age ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {filterAccordionOpen.age && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    {[
                      { id: "18-25", label: "Youth (18 - 25 yrs)" },
                      { id: "26-40", label: "Working Age (26 - 40 yrs)" },
                      { id: "41-60", label: "Experienced (41 - 60 yrs)" },
                      { id: "60+", label: "Senior Citizens (60+ yrs)" },
                    ].map((a) => {
                      const active = selectedAgeBrackets.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => toggleArrayItem(selectedAgeBrackets, setSelectedAgeBrackets, a.id)}
                          className="w-full flex items-center gap-2 text-left cursor-pointer hover:text-[#6256D9]"
                        >
                          {active ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#6256D9] shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className={active ? "font-bold text-[#6256D9]" : "text-slate-600 dark:text-slate-300"}>{a.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("roll")}
              className={`pb-1 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "roll"
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Master Roll View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("requests")}
              className={`pb-1 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "requests"
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Pending Form 6/7/8 Requests (14)
            </button>
          </div>

          <span className="text-slate-500 text-[11px]">
            Showing <strong>{filteredVoters.length}</strong> of 248,650 registered electors
          </span>
        </div>
      </div>

      {/* View Mode: Tabular Roll */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredVoters.length &&
                        filteredVoters.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-slate-200 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Elector Name &amp; Relative</th>
                  <th className="py-3 px-4">EPIC ID</th>
                  <th className="py-3 px-3">Age / Sex</th>
                  <th className="py-3 px-4">Booth Station &amp; Ward</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Central Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE2EC]/60 dark:divide-[#22324F]/60 text-slate-800 dark:text-white">
                {filteredVoters.map((voter) => {
                  const isSelected = selectedIds.includes(voter.id);
                  return (
                    <tr
                      key={voter.id}
                      className={`transition-colors ${
                        isSelected
                          ? "bg-brand-50/50 dark:bg-[#1E1B4B]/30"
                          : "hover:bg-slate-50/70 dark:hover:bg-[#1E293B]/50"
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(voter.id)}
                          className="rounded border-slate-200 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <span>{voter.name}</span>
                          <span className="text-[11px] font-normal text-slate-400">({voter.marathiName})</span>
                          {voter.hasPhoto && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#0DAD9B]"
                              title="Verified ECI Portrait"
                            />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {voter.relation} {voter.relativeName} &bull; {voter.houseNo}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-[11px]">
                          {voter.epicId}
                        </span>
                      </td>
                      <td className="py-3 px-3 tabular-nums font-medium">
                        {voter.age} Yrs &bull; {voter.gender}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold">{voter.boothNumber} - {voter.boothName}</div>
                        <div className="text-[11px] text-slate-500">{voter.ward}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {voter.phone}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                            voter.status === "Verified"
                              ? "bg-emerald-50 text-emerald-600 border border-[#0DAD9B]/20"
                              : voter.status === "Correction Req"
                              ? "bg-amber-50 text-amber-600 border border-[#F2A93B]/20"
                              : "bg-rose-50 text-rose-600 border border-[#E06068]/20"
                          }`}
                        >
                          {voter.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProfileVoter(voter);
                            setProfileActiveTab("basic");
                          }}
                          className="cursor-pointer text-brand-600 border-brand-200 hover:bg-brand-50"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View 360°</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode: Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVoters.map((voter) => (
            <div
              key={voter.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                    <span>{voter.name}</span>
                    {voter.hasPhoto && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </h3>
                  <div className="text-xs text-slate-400 font-normal">{voter.marathiName}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {voter.relation} {voter.relativeName} • Age {voter.age} ({voter.gender})
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {voter.epicId}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Booth:</span>
                  <span className="font-semibold">{voter.boothNumber} - {voter.boothName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Address:</span>
                  <span>{voter.houseNo}, {voter.ward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile:</span>
                  <span className="font-mono">{voter.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {voter.status}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProfileVoter(voter);
                    setProfileActiveTab("basic");
                  }}
                  className="cursor-pointer text-brand-600"
                >
                  <Eye className="w-3 h-3" />
                  <span>Central Profile</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REQUEST ADDITIONAL VOTER DATA ENQUIRY MODAL (SPEC COMPLIANT) */}
      {showDataEnquiryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-brand-600" />
                  <span>Request Additional Voter Data</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Submit an official inquiry to the Indata team for electoral roll augmentation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDataEnquiryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-300">
              Per standard security policy, voter rolls cannot be imported directly. The Indata operations team reviews your specification, validates assembly boundaries, and activates the dataset upon confirmation.
            </div>

            <form onSubmit={handleDataEnquirySubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    disabled
                    value={enquiryState}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">District</label>
                  <input
                    type="text"
                    disabled
                    value={enquiryDistrict}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Vidhan Sabha Constituency *</label>
                <input
                  type="text"
                  required
                  value={enquiryVidhanSabha}
                  onChange={(e) => setEnquiryVidhanSabha(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Details of Required Voter Data *</label>
                <textarea
                  required
                  rows={3}
                  value={enquiryDetails}
                  onChange={(e) => setEnquiryDetails(e.target.value)}
                  placeholder="Specify particular polling stations, additional draft rolls, mobile contact verification requirements, or newly registered Form 6 electors..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowDataEnquiryModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Submit Data Enquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CENTRAL VOTER PROFILE 360° DOSSIER MODAL (SECTION 3 SPEC COMPLIANT) */}
      {selectedProfileVoter && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white dark:bg-[#12131A] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up">
            {/* 1. SECTION 3 HERO HEADER EXPANSION (OCCUPIES 40-50% UPPER VIEWPORT ON DESKTOP) */}
            <div className="p-5 sm:p-6 bg-gradient-to-b from-violet-50/70 via-white to-white dark:from-[#1A1B23] dark:via-[#12131A] dark:to-[#12131A] border-b border-slate-200/80 dark:border-slate-800 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Photo / Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#6256D9] to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#6256D9]/20 shrink-0">
                      {selectedProfileVoter.name.slice(0, 2).toUpperCase()}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsStarred(!isStarred)}
                      className={`absolute -bottom-1 -right-1 p-1 rounded-full border shadow-xs cursor-pointer ${
                        isStarred
                          ? "bg-amber-400 text-white border-amber-300"
                          : "bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}
                      title={isStarred ? "Starred / Bookmarked" : "Click to bookmark"}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Header Identification & Badges */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {selectedProfileVoter.name}
                      </h2>
                      <span className="font-mono text-xs font-black text-[#6256D9] bg-violet-50 dark:bg-violet-950/50 px-2.5 py-0.5 rounded-lg border border-violet-200 dark:border-violet-800">
                        {selectedProfileVoter.epicId}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {selectedProfileVoter.gender} • Age {selectedProfileVoter.age}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {selectedProfileVoter.marathiName} • {selectedProfileVoter.relation} {selectedProfileVoter.relativeName}
                    </p>

                    {/* Full Polling Booth Location & Stance Tag */}
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-[#6256D9]" />
                        <span>Station {selectedProfileVoter.boothNumber}: {selectedProfileVoter.boothName}</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-500">
                        Serial #{selectedProfileVoter.id.replace("v-", "40")} • {selectedProfileVoter.ward}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10.5px] ${
                        selectedProfileVoter.sentiment === "Strong Supporter"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : selectedProfileVoter.sentiment === "Lean Favorable"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      }`}>
                        {selectedProfileVoter.sentiment}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Close & Action */}
                <div className="flex items-center gap-2">
                  {/* DEDICATED HIGH-VISIBILITY [ HOUSE ADDRESS ] CTA BUTTON */}
                  <button
                    type="button"
                    onClick={() => setShowHouseAddressModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#6256D9] hover:bg-[#5044BF] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#6256D9]/20 transition-all cursor-pointer shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>House Address</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProfileVoter(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Bar Pills */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast("info", "Call Initiated", `Calling ${selectedProfileVoter.phone}...`)}
                    className="cursor-pointer text-[#6256D9] border-violet-200 dark:border-violet-800 hover:bg-violet-50"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {selectedProfileVoter.phone}</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => showToast("success", "WhatsApp Opened", `Opening chat with ${selectedProfileVoter.name}`)}
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast("info", "Voter Slip Sent", `Dispatched PDF voter slip to ${selectedProfileVoter.phone}`)}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Digital Slip</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-semibold text-[11px]">
                  <span>Status:</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    {selectedProfileVoter.status}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. PROFILE SECTION TABS */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 overflow-x-auto text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setProfileActiveTab("basic")}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  profileActiveTab === "basic" ? "border-[#6256D9] text-[#6256D9]" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Attributes &amp; Demographics
              </button>
              <button
                type="button"
                onClick={() => setProfileActiveTab("family")}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  profileActiveTab === "family" ? "border-[#6256D9] text-[#6256D9]" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Household &amp; Family ({selectedProfileVoter.familyMembersCount})
              </button>
              <button
                type="button"
                onClick={() => setProfileActiveTab("survey")}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  profileActiveTab === "survey" ? "border-[#6256D9] text-[#6256D9]" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Field Survey &amp; Notes
              </button>
              <button
                type="button"
                onClick={() => setProfileActiveTab("office")}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  profileActiveTab === "office" ? "border-[#6256D9] text-[#6256D9]" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Internal Org Sync
              </button>
              <button
                type="button"
                onClick={() => setProfileActiveTab("tickets")}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  profileActiveTab === "tickets" ? "border-[#6256D9] text-[#6256D9]" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Grievances &amp; Tickets
              </button>
            </div>

            {/* 3. PROFILE TAB CONTENT (SCROLLABLE) */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {profileActiveTab === "basic" && (
                <div className="space-y-4">
                  {/* Detailed Demographics Block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Caste / Community</span>
                      <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedProfileVoter.caste}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Occupation</span>
                      <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedProfileVoter.occupation}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Beneficiary Scheme</span>
                      <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedProfileVoter.scheme}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">House Number</span>
                      <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedProfileVoter.houseNo}</span>
                    </div>
                  </div>

                  {/* Polling Station & Geometry */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6256D9]" />
                      <span>Polling Station Structural Details</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                      <div>Station Name: <strong>{selectedProfileVoter.boothNumber} - {selectedProfileVoter.boothName}</strong></div>
                      <div>Assembly Segment: <strong>215 - Kasba Peth (Pune City)</strong></div>
                      <div>Municipal Ward: <strong>{selectedProfileVoter.ward} (Kothrud Depot Prabhag)</strong></div>
                      <div>ECI Building Code: <strong>MH-215-PS101-ROOM1</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {profileActiveTab === "family" && (
                <div className="space-y-3">
                  <p className="text-slate-500">
                    Electors residing in <strong>{selectedProfileVoter.houseNo}</strong> grouped into a unified household card:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 bg-violet-50/50 dark:bg-violet-950/20 rounded-xl border border-violet-200 dark:border-violet-900/40 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-violet-900 dark:text-violet-200">{selectedProfileVoter.name}</span>
                        <span className="text-[10px] bg-[#6256D9] text-white font-bold px-1.5 py-0.2 rounded ml-2">Head of Family</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">Age {selectedProfileVoter.age} • EPIC: {selectedProfileVoter.epicId}</div>
                      </div>
                      <span className="font-mono text-xs">{selectedProfileVoter.phone}</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white">Sunita Rajesh Verma</span>
                        <span className="text-[10px] text-slate-400 ml-2">(Wife)</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">Age 38 • EPIC: WXE9821443</div>
                      </div>
                      <span className="font-mono text-xs">+91 98221 44002</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: NOTES & REAL-TIME APPEND AREA */}
              {profileActiveTab === "survey" && (
                <div className="space-y-4">
                  {/* Append Real-Time Note Input */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                    <label className="block font-bold text-slate-800 dark:text-white">
                      Append On-Ground Field Agent Note
                    </label>
                    <textarea
                      rows={2}
                      value={voterNotes}
                      onChange={(e) => setVoterNotes(e.target.value)}
                      placeholder="Type voter interaction notes, local requests, or visit observations..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAppendNote}
                        className="px-4 py-1.5 rounded-xl bg-[#6256D9] hover:bg-[#5044BF] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Real-Time Note</span>
                      </button>
                    </div>
                  </div>

                  {/* Chronological Notes History */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Notes History:</span>
                    {savedNotes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <p className="text-slate-700 dark:text-slate-300">{note}</p>
                        <span className="text-[10px] text-slate-400 block font-medium">Logged by Active Field Cadre • Auto-synced to Cloud</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3: INTERNAL ORGANIZATIONAL METRICS & DATABASE SYNC */}
              {profileActiveTab === "office" && (
                <div className="space-y-4">
                  <div className="p-4 bg-violet-50/50 dark:bg-violet-950/20 rounded-2xl border border-violet-200 dark:border-violet-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-[#6256D9]" />
                        <span>Internal Organizational Metrics Sync</span>
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        Live Master DB Sync Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Assigned Karyakarta / Worker
                        </label>
                        <input
                          type="text"
                          value={assignedWorker}
                          onChange={(e) => setAssignedWorker(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Priority Mobilization Grade
                        </label>
                        <select
                          value={priorityGrade}
                          onChange={(e) => setPriorityGrade(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                        >
                          <option value="Grade A - Must Mobilize">Grade A - Must Mobilize</option>
                          <option value="Grade B - Follow-up">Grade B - Follow-up</option>
                          <option value="Grade C - Neutral">Grade C - Neutral</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Custom Campaign Tag
                        </label>
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isFamilyHeadState}
                            onChange={(e) => setIsFamilyHeadState(e.target.checked)}
                            className="w-4 h-4 rounded text-[#6256D9] focus:ring-[#6256D9]"
                          />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Recognized Household Head (Decision Maker)
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSyncOrgData}
                        className="px-5 py-2 rounded-xl bg-[#6256D9] hover:bg-[#5044BF] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#6256D9]/20 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Sync with Master Database</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {profileActiveTab === "tickets" && (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-amber-900 dark:text-amber-200">Ticket #TKT-9210: Low Water Pressure</span>
                      <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded">OPEN</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">Dahanukar Colony Lane 3 municipal pipeline pressure low for 5 straight days.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900">
              <Button variant="outline" size="sm" onClick={() => setSelectedProfileVoter(null)}>
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DEDICATED [ HOUSE ADDRESS ] MODAL WITH VERIFIED GPS COORDINATES */}
      {showHouseAddressModal && selectedProfileVoter && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12131A] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-5 sm:p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#6256D9] dark:bg-violet-950/50 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Structural House Address &amp; GPS
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedProfileVoter.name} ({selectedProfileVoter.epicId})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHouseAddressModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Street Address */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physical Residential Address</span>
              <p className="font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                Plot 14, Lane 3, Dahanukar Colony, Kothrud Depot Road, Ward 12, Pune - 411038
              </p>
            </div>

            {/* Geodetic Verified GPS Coordinates */}
            <div className="p-3.5 bg-violet-50/70 dark:bg-violet-950/30 rounded-2xl border border-violet-200 dark:border-violet-800 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider block">Verified Geodetic Coordinates</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-[#6256D9]">
                  18.52043° N, 73.85674° E
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  ECI Audit Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Spatial telemetry resolution verified to within ±3.2 meters of doorstep.</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://maps.google.com/?q=18.52043,73.85674"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#6256D9] hover:bg-[#5044BF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#6256D9]/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
              <button
                type="button"
                onClick={() => setShowHouseAddressModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
