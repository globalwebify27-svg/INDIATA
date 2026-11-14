"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  AlertCircle,
  Building,
  UserPlus,
  Eye,
  X,
  Sparkles,
  UserCheck,
  MapPin,
  Phone,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface MasterElector {
  id: string;
  epic: string;
  name: string;
  marathiName: string;
  phone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  ward: string;
  booth: string;
  boothName: string;
  address: string;
}

const INITIAL_MASTER_ELECTORS: MasterElector[] = [
  {
    id: "el-1",
    epic: "WXE4829102",
    name: "Rahul Sharad Shinde",
    marathiName: "राहुल शरद शिंदे",
    phone: "+91 98220 11990",
    age: 38,
    gender: "Male",
    ward: "Ward 12",
    booth: "#101",
    boothName: "Navbharat High School, Room 1",
    address: "Flat 402, Shrikrupa Apts, Dahanukar Colony, Lane 3",
  },
  {
    id: "el-2",
    epic: "WXE3920194",
    name: "Sunita Vilas Kulkarni",
    marathiName: "सुनिता विलास कुलकर्णी",
    phone: "+91 94223 88120",
    age: 62,
    gender: "Female",
    ward: "Ward 12",
    booth: "#101",
    boothName: "Navbharat High School, Room 1",
    address: "B-12, Mayur Colony, Kothrud",
  },
  {
    id: "el-3",
    epic: "WXE1029384",
    name: "Amit Suresh Joshi",
    marathiName: "अमित सुरेश जोशी",
    phone: "+91 98900 77661",
    age: 21,
    gender: "Male",
    ward: "Ward 14",
    booth: "#108",
    boothName: "Gokhale Memorial Hall",
    address: "Plot 88, Near Shanipar Chowk, Kasba Peth",
  },
  {
    id: "el-4",
    epic: "WXE9821443",
    name: "Sunita Verma",
    marathiName: "सुनिता वर्मा",
    phone: "+91 98221 44002",
    age: 44,
    gender: "Female",
    ward: "Ward 9",
    booth: "#88",
    boothName: "Modern High School, Wing A",
    address: "House 104, Gaothan Lane 2",
  },
];

interface TicketItem {
  id: string;
  category: "Water Supply" | "Roads & Infra" | "Pension & Welfare" | "Electricity" | "Ration Card";
  title: string;
  description: string;
  ward: string;
  booth: string;
  reporter: string;
  phone: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN PROGRESS" | "RESOLVED";
  createdDate: string;
  assignedStaff: string;
  linkedEpic?: string;
}

interface VisitorItem {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  handlingStaff: string;
  visitDate: string;
  followUpRequired: string;
  matchedEpic?: string;
}

const SAMPLE_TICKETS: TicketItem[] = [
  {
    id: "TKT-9210",
    category: "Water Supply",
    title: "Low municipal water pressure across Dahanukar Colony",
    description: "Entire Dahanukar Colony Lane 3 has faced low municipal pressure for 5 straight days. 120 households affected.",
    ward: "Ward 12",
    booth: "#103",
    reporter: "Suresh Patil",
    phone: "+91 98220 11990",
    priority: "HIGH",
    status: "OPEN",
    createdDate: "03 Nov 2026, 09:30 AM",
    assignedStaff: "Ashok Shinde (Office Lead)",
    linkedEpic: "WXE4829102",
  },
  {
    id: "TKT-9208",
    category: "Pension & Welfare",
    title: "Sanjay Gandhi Niradhar monthly pension not credited",
    description: "Monthly welfare pension not credited into accounts for 3 senior citizen widows in Erandwane Gaothan.",
    ward: "Ward 14",
    booth: "#107",
    reporter: "Anusaya More",
    phone: "+91 97654 33221",
    priority: "MEDIUM",
    status: "IN PROGRESS",
    createdDate: "02 Nov 2026, 02:15 PM",
    assignedStaff: "Pooja Jagtap",
  },
  {
    id: "TKT-9195",
    category: "Roads & Infra",
    title: "Accident-prone deep pothole near Erandwane fire station",
    description: "Deep pothole causing recurring two-wheeler skids and traffic slowdown near Erandwane fire crossing.",
    ward: "Ward 14",
    booth: "#106",
    reporter: "Vijay Deshmukh",
    phone: "+91 98900 44551",
    priority: "CRITICAL",
    status: "RESOLVED",
    createdDate: "01 Nov 2026, 11:00 AM",
    assignedStaff: "Nitin Jagtap",
  },
  {
    id: "TKT-9182",
    category: "Electricity",
    title: "Street lights non-operational in Kasba Peth Lane 4",
    description: "Dark stretch causing safety concerns for women and senior citizens walking from Ganpati mandir.",
    ward: "Ward 9",
    booth: "#88",
    reporter: "Manish Kulkarni",
    phone: "+91 99221 33445",
    priority: "MEDIUM",
    status: "IN PROGRESS",
    createdDate: "30 Oct 2026, 07:45 PM",
    assignedStaff: "Vikas Jadhav",
  },
];

const SAMPLE_VISITORS: VisitorItem[] = [
  {
    id: "vis-1",
    name: "Suresh Patil",
    phone: "+91 98220 11990",
    purpose: "Water supply pipeline blockage complaint in Dahanukar Colony",
    handlingStaff: "Ashok Shinde",
    visitDate: "Today, 09:30 AM",
    followUpRequired: "05 Nov 2026",
    matchedEpic: "WXE4829102",
  },
  {
    id: "vis-2",
    name: "Sunita Verma",
    phone: "+91 98221 44002",
    purpose: "Inquiry on Ladki Bahin installment status and KYC update",
    handlingStaff: "Pooja Jagtap",
    visitDate: "Today, 11:15 AM",
    followUpRequired: "None Required",
    matchedEpic: "WXE9821443",
  },
  {
    id: "vis-3",
    name: "Mahesh K. Joshi",
    phone: "+91 98900 77661",
    purpose: "Society registration recommendation letter for PMC drainage repair",
    handlingStaff: "Ashok Shinde",
    visitDate: "Yesterday, 04:00 PM",
    followUpRequired: "08 Nov 2026",
  },
];

export function OfficeTicketsView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"tickets" | "visitors">("tickets");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [masterElectors, setMasterElectors] = useState<MasterElector[]>(INITIAL_MASTER_ELECTORS);
  const [electorSearchQuery, setElectorSearchQuery] = useState("");

  const [tickets, setTickets] = useState<TicketItem[]>(SAMPLE_TICKETS);
  const [visitors, setVisitors] = useState<VisitorItem[]>(SAMPLE_VISITORS);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(SAMPLE_TICKETS[0] ?? null);

  // Modals
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showRegisterVisitorModal, setShowRegisterVisitorModal] = useState(false);
  const [showAddNewVoterModal, setShowAddNewVoterModal] = useState(false);

  // Create Ticket Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TicketItem["category"]>("Water Supply");
  const [newPriority, setNewPriority] = useState<TicketItem["priority"]>("HIGH");
  const [newReporter, setNewReporter] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newWard, setNewWard] = useState("Ward 12");
  const [newBooth, setNewBooth] = useState("#101");
  const [newDescription, setNewDescription] = useState("");
  const [newLinkedEpic, setNewLinkedEpic] = useState<string | undefined>(undefined);

  // Visitor Form & Fuzzy Match State
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorPurpose, setVisitorPurpose] = useState("");
  const [visitorFollowUp, setVisitorFollowUp] = useState("");

  // Add New Voter Onboarding Modal State (Section 9)
  const [onboardName, setOnboardName] = useState("");
  const [onboardMarathiName, setOnboardMarathiName] = useState("");
  const [onboardEpic, setOnboardEpic] = useState("");
  const [onboardPhone, setOnboardPhone] = useState("");
  const [onboardAge, setOnboardAge] = useState("28");
  const [onboardGender, setOnboardGender] = useState<"Male" | "Female" | "Other">("Male");
  const [onboardWard, setOnboardWard] = useState("Ward 12");
  const [onboardBooth, setOnboardBooth] = useState("#101");
  const [onboardAddress, setOnboardAddress] = useState("");

  const fuzzyMatch = visitorName.length > 2 && (
    visitorName.toLowerCase().includes("rajesh") || visitorName.toLowerCase().includes("patil")
  );

  // Elector Live Search Results
  const matchedElectors = electorSearchQuery.trim()
    ? masterElectors.filter(
        (e) =>
          e.name.toLowerCase().includes(electorSearchQuery.toLowerCase()) ||
          e.marathiName.toLowerCase().includes(electorSearchQuery.toLowerCase()) ||
          e.epic.toLowerCase().includes(electorSearchQuery.toLowerCase()) ||
          e.phone.includes(electorSearchQuery)
      )
    : [];

  const handleSelectElectorForTicket = (elector: MasterElector) => {
    setNewReporter(elector.name);
    setNewPhone(elector.phone);
    setNewWard(elector.ward);
    setNewBooth(elector.booth);
    setNewLinkedEpic(elector.epic);
    setNewTitle(`Civic Grievance from ${elector.name} (${elector.ward}, Booth ${elector.booth})`);
    setShowCreateTicketModal(true);
  };

  const handleAddNewVoterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim() || !onboardEpic.trim() || !onboardPhone.trim()) {
      showToast("error", "Validation Error", "Name, EPIC ID, and Phone Number are strictly required.");
      return;
    }

    const newVoter: MasterElector = {
      id: `el-${Date.now()}`,
      epic: onboardEpic.trim().toUpperCase(),
      name: onboardName.trim(),
      marathiName: onboardMarathiName.trim() || onboardName.trim(),
      phone: onboardPhone.trim(),
      age: parseInt(onboardAge, 10) || 28,
      gender: onboardGender,
      ward: onboardWard,
      booth: onboardBooth,
      boothName: `${onboardBooth} - Navbharat High School Dispatch`,
      address: onboardAddress.trim() || "Kasba Peth Constituency",
    };

    setMasterElectors((prev) => [newVoter, ...prev]);
    setElectorSearchQuery(newVoter.name);
    setShowAddNewVoterModal(false);

    // Reset Form
    setOnboardName("");
    setOnboardMarathiName("");
    setOnboardEpic("");
    setOnboardPhone("");
    setOnboardAddress("");

    showToast(
      "success",
      "Voter Onboarded to Master Roll",
      `${newVoter.name} (EPIC: ${newVoter.epic}) registered in constituency roll. Ready for issue registration.`
    );
  };

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reporter.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const handleUpdateStatus = (id: string, newStatus: "OPEN" | "IN PROGRESS" | "RESOLVED") => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
    showToast("success", "Ticket Status Updated", `Ticket ${id} marked as ${newStatus}.`);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTicket: TicketItem = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim() || newTitle.trim(),
      ward: newWard,
      booth: newBooth,
      reporter: newReporter.trim() || "Constituent Visitor",
      phone: newPhone.trim() || "+91 98220 00000",
      priority: newPriority,
      status: "OPEN",
      createdDate: "Just now",
      assignedStaff: "Ashok Shinde (Office Lead)",
      linkedEpic: newLinkedEpic,
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setShowCreateTicketModal(false);
    setNewTitle("");
    setNewDescription("");
    setNewLinkedEpic(undefined);

    showToast(
      "success",
      "Civic Grievance Ticket Created",
      `Ticket #${newTicket.id} registered and assigned to Ashok Shinde.`
    );
  };

  const handleRegisterVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const newVisitor: VisitorItem = {
      id: `vis-${Date.now()}`,
      name: visitorName.trim(),
      phone: visitorPhone.trim() || "+91 98000 00000",
      purpose: visitorPurpose.trim() || "Constituent office visit",
      handlingStaff: "Ashok Shinde",
      visitDate: "Just now",
      followUpRequired: visitorFollowUp.trim() || "Pending Review",
      matchedEpic: fuzzyMatch ? "WXE4829102 (Matched)" : undefined,
    };

    setVisitors((prev) => [newVisitor, ...prev]);
    setShowRegisterVisitorModal(false);
    setVisitorName("");
    setVisitorPhone("");
    setVisitorPurpose("");

    showToast(
      "success",
      "Visitor Registered",
      `Visitor log for ${newVisitor.name} recorded. ${fuzzyMatch ? "Linked to existing ECI elector profile." : "New visitor contact created."}`
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 dark:text-brand-400 px-2.5 py-0.5 rounded-full">
              Module 12: Office &amp; Issues
            </span>
            <Badge variant="teal">Civic Response Center</Badge>
            <Badge variant="warning">{tickets.filter((t) => t.status === "OPEN").length} Open Tickets</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Office Helpdesk &amp; Civic Grievance Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search master electoral roll, register walk-in constituents, dispatch civic grievance tickets, and onboard unlisted voters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="outline" size="md" onClick={() => setShowAddNewVoterModal(true)}>
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add New Voter</span>
          </Button>

          <Button variant="outline" size="md" onClick={() => setShowRegisterVisitorModal(true)}>
            <Building className="w-3.5 h-3.5" />
            <span>Register Visitor</span>
          </Button>

          <Button variant="primary" size="md" onClick={() => setShowCreateTicketModal(true)}>
            <Plus className="w-3.5 h-3.5" />
            <span>Create Grievance Ticket</span>
          </Button>
        </div>
      </section>

      {/* SECTION 9: PROMINENT MASTER ELECTOR ROLL SEARCH & ONBOARDING BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              Search Master Electoral Roll (Voter Identification &amp; Issue Pre-load)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {masterElectors.length.toLocaleString()} Electors in Local Constituency Database
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={electorSearchQuery}
            onChange={(e) => setElectorSearchQuery(e.target.value)}
            placeholder="Search elector by Name, Marathi Name, EPIC ID (e.g. 'Rahul Shinde', 'WXE4829102'), or Phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Live Search Match Display */}
        {electorSearchQuery.trim() !== "" && (
          <div className="pt-2">
            {matchedElectors.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 block">
                  Found {matchedElectors.length} Matching Elector(s):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matchedElectors.map((elector) => (
                    <div
                      key={elector.id}
                      className="p-3.5 rounded-xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/40 dark:bg-brand-950/20 flex flex-col justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                            {elector.epic}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {elector.gender}, {elector.age} yrs
                          </span>
                        </div>
                        <div className="font-bold text-sm text-slate-800 dark:text-white">
                          {elector.name}{" "}
                          <span className="text-slate-500 font-normal">({elector.marathiName})</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{elector.ward} &bull; Booth {elector.booth} ({elector.boothName})</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono font-medium">{elector.phone}</span>
                        </div>
                      </div>

                      {/* 1-Click Action: Log Grievance for this Elector */}
                      <button
                        type="button"
                        onClick={() => handleSelectElectorForTicket(elector)}
                        className="w-full py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Grievance / Register Issue for this Elector</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* No Match Found -> Provide Onboarding Action */
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center space-y-2">
                <span className="text-xs text-slate-500 block">
                  No registered elector found matching &ldquo;{electorSearchQuery}&rdquo; in AC-215 roll.
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setOnboardName(electorSearchQuery);
                    setShowAddNewVoterModal(true);
                  }}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Onboard New Voter &ldquo;{electorSearchQuery}&rdquo;</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4 Office Dashboard KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Visitors Today</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 tabular-nums">
            {visitors.length * 6}
          </div>
          <div className="text-[11px] text-brand-600 font-medium mt-1">Reception Counter Active</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Open Grievance Tickets</span>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {tickets.filter((t) => t.status === "OPEN").length}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Assigned to Field Teams</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">In Progress Resolutions</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">
            {tickets.filter((t) => t.status === "IN PROGRESS").length}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">Municipal Department Follow-up</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Resolved This Week</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            28
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">94% Citizen Satisfaction</div>
        </div>
      </div>

      {/* Tabs Selector: Tickets vs Visitors */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("tickets")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "tickets"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Civic Grievance Tickets ({tickets.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("visitors")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "visitors"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Visitor Reception &amp; Interaction Log ({visitors.length})</span>
            </button>
          </div>

          {activeTab === "tickets" && (
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tickets..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="py-1 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              >
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: TICKETS SPLIT VIEW */}
        {activeTab === "tickets" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Ticket Table */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3">Ticket Info</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Reporter</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        selectedTicket?.id === t.id ? "bg-brand-50/40 dark:bg-brand-950/30" : ""
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-mono text-[11px] font-bold text-brand-600 dark:text-brand-400">
                          {t.id}
                        </div>
                        <div className="font-bold text-slate-800 dark:text-white line-clamp-1">{t.title}</div>
                        <div className="text-[10px] text-slate-400">{t.ward} &bull; Booth {t.booth}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {t.category}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.priority === "CRITICAL"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : t.priority === "HIGH"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.status === "OPEN"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                              : t.status === "IN PROGRESS"
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-white">{t.reporter}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{t.phone}</div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-brand-600 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right 1 Col: Detailed Inspection Card */}
            {selectedTicket && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-mono text-xs font-bold text-brand-600">{selectedTicket.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedTicket.status === "OPEN"
                          ? "bg-amber-100 text-amber-800"
                          : selectedTicket.status === "IN PROGRESS"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                      {selectedTicket.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {selectedTicket.description}
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span className="font-semibold">{selectedTicket.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold">{selectedTicket.ward}, Booth {selectedTicket.booth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reporter:</span>
                      <span className="font-semibold">{selectedTicket.reporter}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact:</span>
                      <span className="font-mono">{selectedTicket.phone}</span>
                    </div>
                    {selectedTicket.linkedEpic && (
                      <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400">EPIC Link:</span>
                        <span className="font-mono font-bold text-brand-600">{selectedTicket.linkedEpic}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Update Ticket Status:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedTicket.id, "OPEN")}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedTicket.id, "IN PROGRESS")}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedTicket.id, "RESOLVED")}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VISITOR RECEPTION & INTERACTION LOG */}
        {activeTab === "visitors" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Visitor Name &amp; Contact</th>
                  <th className="py-3 px-4">Visit Purpose / Grievance</th>
                  <th className="py-3 px-4">Handling Staff</th>
                  <th className="py-3 px-4">Elector Linkage</th>
                  <th className="py-3 px-4">Follow-up Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visitors.map((vis) => (
                  <tr key={vis.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-white">{vis.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{vis.phone}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-sm">
                      {vis.purpose}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-white">
                      {vis.handlingStaff}
                    </td>

                    <td className="py-3 px-4">
                      {vis.matchedEpic ? (
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {vis.matchedEpic}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">New Guest Profile</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {vis.followUpRequired}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 9: ONBOARD NEW VOTER MODAL (Full Name, Marathi Name, EPIC, Phone Validation) */}
      {showAddNewVoterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-brand-600" />
                  <span>Onboard New Voter to Constituency Roll</span>
                </h3>
                <p className="text-xs text-slate-500">ECI Kasba Peth (AC-215) Master Database Enrolment</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddNewVoterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewVoterSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardName}
                    onChange={(e) => setOnboardName(e.target.value)}
                    placeholder="e.g. Ramesh Baburao Jadhav"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    नाव (मराठी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardMarathiName}
                    onChange={(e) => setOnboardMarathiName(e.target.value)}
                    placeholder="उदा. रमेश बाबुराव जाधव"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    EPIC ID (Voter ID Number) *
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardEpic}
                    onChange={(e) => setOnboardEpic(e.target.value)}
                    placeholder="e.g. WXE5920194"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={onboardPhone}
                    onChange={(e) => setOnboardPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="110"
                    value={onboardAge}
                    onChange={(e) => setOnboardAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={onboardGender}
                    onChange={(e) => setOnboardGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ward</label>
                  <select
                    value={onboardWard}
                    onChange={(e) => setOnboardWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Ward 12">Ward 12 (Kothrud)</option>
                    <option value="Ward 14">Ward 14 (Erandwane)</option>
                    <option value="Ward 9">Ward 9 (Gaothan)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Booth</label>
                  <select
                    value={onboardBooth}
                    onChange={(e) => setOnboardBooth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="#101">Booth #101</option>
                    <option value="#106">Booth #106</option>
                    <option value="#108">Booth #108</option>
                    <option value="#88">Booth #88</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Residential / House Address
                </label>
                <input
                  type="text"
                  value={onboardAddress}
                  onChange={(e) => setOnboardAddress(e.target.value)}
                  placeholder="e.g. Flat 12, Ganpati Chowk, Kasba Peth, Pune"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddNewVoterModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-brand-600 hover:bg-brand-700">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Onboard Voter</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER VISITOR WITH FUZZY MATCH MODAL */}
      {showRegisterVisitorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-brand-600" />
                  <span>Register Office Visitor &amp; ECI Lookup</span>
                </h3>
                <p className="text-xs text-slate-500">Automated fuzzy duplicate match against master electoral roll.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterVisitorModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterVisitorSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Suresh Patil"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Fuzzy Match Indicator Banner */}
              {fuzzyMatch && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fuzzy Match Found in Master Elector Roll</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Matches <strong>Rahul Sharad Shinde / Suresh Patil</strong> (Booth #101 &bull; EPIC: WXE4829102). Visitor will be linked to this constituent profile.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Contact *</label>
                <input
                  type="tel"
                  required
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="+91 98220 11990"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Purpose of Visit / Grievance *</label>
                <textarea
                  required
                  rows={2}
                  value={visitorPurpose}
                  onChange={(e) => setVisitorPurpose(e.target.value)}
                  placeholder="Reason for visiting office (Water, roads, scheme aid, meeting)..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Follow-Up Date (Optional)</label>
                <input
                  type="date"
                  value={visitorFollowUp}
                  onChange={(e) => setVisitorFollowUp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowRegisterVisitorModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Register &amp; Link Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GRIEVANCE TICKET MODAL */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-brand-600" />
                  <span>Log Civic Grievance Ticket</span>
                </h3>
                <p className="text-xs text-slate-500">Dispatch issue to ward coordinator &amp; track resolution.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateTicketModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3.5 text-xs">
              {newLinkedEpic && (
                <div className="p-2.5 rounded-lg bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center justify-between text-brand-800 dark:text-brand-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Pre-loaded Elector: {newReporter}</span>
                  </span>
                  <span className="font-mono text-[10.5px] font-bold">{newLinkedEpic}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Issue Headline *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Low water pressure in Dahanukar Colony"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TicketItem["category"])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  >
                    <option value="Water Supply">Water Supply</option>
                    <option value="Roads & Infra">Roads &amp; Infra</option>
                    <option value="Pension & Welfare">Pension &amp; Welfare</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Ration Card">Ration Card</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketItem["priority"])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ward *</label>
                  <input
                    type="text"
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Booth Number *</label>
                  <input
                    type="text"
                    value={newBooth}
                    onChange={(e) => setNewBooth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reporter Name *</label>
                  <input
                    type="text"
                    required
                    value={newReporter}
                    onChange={(e) => setNewReporter(e.target.value)}
                    placeholder="Constituent Name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reporter Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateTicketModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
