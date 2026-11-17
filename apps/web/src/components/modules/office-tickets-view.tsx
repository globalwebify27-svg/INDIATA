"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  X,
  AlertCircle,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

// ============================================================================
// DATA MODELS
// ============================================================================

export interface TicketComment {
  author: string;
  text: string;
  timestamp: string;
}

export interface TicketRecord {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  visitorAddress?: string;
  isLinkedVoter: boolean;
  voterEpic?: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  resolutionNote?: string;
  comments: TicketComment[];
}

export interface LinkedVoterRecord {
  id: string;
  fullName: string;
  epicNumber: string;
  mobile: string;
  address: string;
  boothNumber: number;
}

// Initial 4 Seed Tickets matching the reference design
const INITIAL_TICKETS: TicketRecord[] = [
  {
    id: "TKT-9210",
    visitorName: "Narayan Govind Joshi",
    visitorPhone: "+91 98220 33119",
    visitorAddress: "Plot 34, Dahanukar Colony, Kothrud",
    isLinkedVoter: true,
    voterEpic: "MH34091104",
    category: "Water Supply",
    priority: "HIGH",
    status: "OPEN",
    assignedTo: "Sachin Babar (Prabhaag Incharge)",
    createdAt: "2024-04-18 09:30 AM",
    updatedAt: "2024-04-18 10:00 AM",
    description: "Entire Dahanukar Colony Lane 3 has faced low municipal pressure for 5 straight days....",
    comments: [
      {
        author: "Office Desk Registration",
        text: "Visitor verified & linked to Voter ID MH34091104 (Booth #102).",
        timestamp: "2024-04-18 09:30 AM",
      },
      {
        author: "Sachin Babar",
        text: "Coordinated with PMC Water Department Junior Engineer for line inspection.",
        timestamp: "2024-04-18 10:00 AM",
      },
    ],
  },
  {
    id: "TKT-9208",
    visitorName: "Shabana Begum Mansuri",
    visitorPhone: "+91 98220 77112",
    visitorAddress: "Near Kothrud Stand, Pune",
    isLinkedVoter: false,
    category: "Pension",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    assignedTo: "Office Helpdesk (Sanjay Shinde)",
    createdAt: "2024-04-17 03:15 PM",
    updatedAt: "2024-04-18 08:30 AM",
    description: "Sanjay Gandhi Niradhar Yojana monthly pension not credited into bank for 3 month...",
    comments: [
      {
        author: "Office Reception Desk",
        text: "Unverified Citizen Visitor registered at reception desk.",
        timestamp: "2024-04-17 03:15 PM",
      },
      {
        author: "Sanjay Shinde",
        text: "Application submitted to Tehsildar Sanjay Gandhi Yojana cell for passbook verification.",
        timestamp: "2024-04-18 08:30 AM",
      },
    ],
  },
  {
    id: "TKT-9195",
    visitorName: "Mahesh Balkrishna Kadam",
    visitorPhone: "+91 98901 44550",
    visitorAddress: "Near Erandwane Fire Station Crossing",
    isLinkedVoter: true,
    voterEpic: "MH34033418",
    category: "Roads & Infrastructure",
    priority: "CRITICAL",
    status: "RESOLVED",
    assignedTo: "Sachin Babar",
    createdAt: "2024-04-14 11:00 AM",
    updatedAt: "2024-04-17 04:00 PM",
    description: "Deep pothole causing accidents near Erandwane fire station crossing.",
    resolutionNote: "Road patching completed by PMC road engineering squad and verified by cadre.",
    comments: [
      {
        author: "Office Desk",
        text: "Critical traffic hotspot ticket created.",
        timestamp: "2024-04-14 11:00 AM",
      },
      {
        author: "Sachin Babar",
        text: "Hotspot inspected, PMC asphalt squad deployed.",
        timestamp: "2024-04-16 02:00 PM",
      },
    ],
  },
  {
    id: "TKT-9180",
    visitorName: "Savita Vijay Gaikwad",
    visitorPhone: "+91 98222 66778",
    visitorAddress: "Lane 5, Prabhat Road, Pune",
    isLinkedVoter: true,
    voterEpic: "MH34089211",
    category: "Electricity",
    priority: "MEDIUM",
    status: "RESOLVED",
    assignedTo: "Pooja Jadhav",
    createdAt: "2024-04-12 10:30 AM",
    updatedAt: "2024-04-13 06:00 PM",
    description: "Streetlights not functioning on internal society approach road for 2 weeks.",
    resolutionNote: "MSEDCL line engineer replaced fuse in feeder box; functional testing completed.",
    comments: [
      {
        author: "Reception Desk",
        text: "Streetlight maintenance complaint logged.",
        timestamp: "2024-04-12 10:30 AM",
      },
    ],
  },
];

// Pre-seeded searchable electoral roll records for auto-matching
const ELECTORAL_ROLL_DIRECTORY: LinkedVoterRecord[] = [
  {
    id: "v-101",
    fullName: "Narayan Govind Joshi",
    epicNumber: "MH34091104",
    mobile: "+91 98220 33119",
    address: "Plot 34, Dahanukar Colony, Kothrud",
    boothNumber: 102,
  },
  {
    id: "v-102",
    fullName: "Mahesh Balkrishna Kadam",
    epicNumber: "MH34033418",
    mobile: "+91 98901 44550",
    address: "Near Erandwane Fire Station Crossing",
    boothNumber: 104,
  },
  {
    id: "v-103",
    fullName: "Savita Vijay Gaikwad",
    epicNumber: "MH34089211",
    mobile: "+91 98222 66778",
    address: "Lane 5, Prabhat Road, Pune",
    boothNumber: 106,
  },
  {
    id: "v-104",
    fullName: "Rajesh Kumar Verma",
    epicNumber: "WXE4829102",
    mobile: "+91 98221 44001",
    address: "Plot 14, Lane 3, Kasba Peth, Pune",
    boothNumber: 101,
  },
  {
    id: "v-105",
    fullName: "Sunita Rajesh Verma",
    epicNumber: "WXE0821443",
    mobile: "+91 98221 44002",
    address: "Plot 14, Lane 3, Kasba Peth, Pune",
    boothNumber: 101,
  },
  {
    id: "v-106",
    fullName: "Pooja Santosh Jagtap",
    epicNumber: "WXE4412890",
    mobile: "+91 98901 22334",
    address: "Lane 2, Mayur Colony, Kothrud",
    boothNumber: 101,
  },
];

// ============================================================================
// MAIN COMPONENT: OfficeTicketsView
// ============================================================================

export function OfficeTicketsView() {
  const { showToast } = useToast();

  const [tickets, setTickets] = useState<TicketRecord[]>(INITIAL_TICKETS);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Inspect Ticket Drawer / Modal
  const [inspectTicket, setInspectTicket] = useState<TicketRecord | null>(null);
  const [commentInput, setCommentInput] = useState("");

  // Register Visitor / New Ticket Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorAddress, setVisitorAddress] = useState("");
  const [category, setCategory] = useState("Water Supply");
  const [priority, setPriority] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [assignedTo, setAssignedTo] = useState("Sachin Babar (Prabhaag Incharge)");
  const [description, setDescription] = useState("");

  // Electoral roll auto-match state
  const [voterSearch, setVoterSearch] = useState("");
  const [linkedVoter, setLinkedVoter] = useState<LinkedVoterRecord | null>(null);

  // Auto-search voter roll directory
  const matchedVoters = voterSearch.trim()
    ? ELECTORAL_ROLL_DIRECTORY.filter(
        (v) =>
          v.fullName.toLowerCase().includes(voterSearch.toLowerCase()) ||
          v.epicNumber.toLowerCase().includes(voterSearch.toLowerCase()) ||
          v.mobile.includes(voterSearch)
      )
    : [];

  // Potential duplicate detection
  const duplicateTickets =
    visitorName.trim().length >= 3 || visitorPhone.trim().length >= 7
      ? tickets.filter(
          (t) =>
            (visitorName.trim().length >= 3 &&
              t.visitorName.toLowerCase().includes(visitorName.trim().toLowerCase())) ||
            (visitorPhone.trim().length >= 7 &&
              t.visitorPhone &&
              t.visitorPhone.includes(visitorPhone.trim()))
        )
      : [];

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || t.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      t.visitorName.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.assignedTo.toLowerCase().includes(q);

    return matchesStatus && matchesCategory && matchesQuery;
  });

  // Handle Register New Ticket Form Submit
  const handleRegisterTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !description.trim()) {
      showToast("error", "Validation Error", "Please provide visitor name and issue description.");
      return;
    }

    const newTicket: TicketRecord = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      visitorName: visitorName.trim(),
      visitorPhone: visitorPhone.trim() || undefined,
      visitorAddress: visitorAddress.trim() || undefined,
      isLinkedVoter: !!linkedVoter,
      voterEpic: linkedVoter ? linkedVoter.epicNumber : undefined,
      category,
      priority,
      status: "OPEN",
      assignedTo,
      createdAt: "Just now",
      updatedAt: "Just now",
      description: description.trim(),
      comments: [
        {
          author: "Office Desk Registration",
          text: linkedVoter
            ? `Visitor verified & linked to Voter ID ${linkedVoter.epicNumber} (Booth #${linkedVoter.boothNumber}).`
            : "Unverified Citizen Visitor registered at reception desk.",
          timestamp: "Just now",
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    showToast("success", "Ticket Created", `Ticket #${newTicket.id} created and routed to ${assignedTo}.`);
    setIsRegisterModalOpen(false);

    // Reset form
    setVisitorName("");
    setVisitorPhone("");
    setVisitorAddress("");
    setDescription("");
    setLinkedVoter(null);
    setVoterSearch("");
  };

  // Handle Post Internal Comment / Note
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !inspectTicket) return;

    const updated: TicketRecord = {
      ...inspectTicket,
      comments: [
        ...inspectTicket.comments,
        {
          author: "Candidate Office Desk",
          text: commentInput.trim(),
          timestamp: "Just now",
        },
      ],
    };

    setInspectTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setCommentInput("");
    showToast("info", "Note Added", "Comment appended to grievance audit trail.");
  };

  // Handle Change Ticket Status in Drawer
  const handleUpdateStatus = (newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED") => {
    if (!inspectTicket) return;

    const updated: TicketRecord = {
      ...inspectTicket,
      status: newStatus,
      updatedAt: "Just now",
      resolutionNote:
        newStatus === "RESOLVED"
          ? "Issue verified resolved on field inspection."
          : inspectTicket.resolutionNote,
    };

    setInspectTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast("success", "Status Updated", `Ticket #${updated.id} marked as ${newStatus}.`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* ===================================================================== */}
      {/* 1. TOP HEADER BAR: TITLE, TAGS & ACTION BUTTON                       */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Constituency Governance
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Citizen Grievances
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Office Desk &amp; Public Issues
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register visiting citizens, link them to the electoral roll, and monitor resolution workflows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register Visitor / New Ticket</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 2. TOP 4 METRIC KPI CARDS                                             */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Visitors */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Today&apos;s Visitors
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">28</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">
            19 Linked to Voter Roll
          </p>
        </div>

        {/* Open Tickets */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Open Tickets
          </span>
          <p className="text-2xl font-black text-amber-500 mt-1">
            {tickets.filter((t) => t.status === "OPEN").length}
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            Awaiting PMC department action
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            In Progress
          </span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {tickets.filter((t) => t.status === "IN_PROGRESS").length}
          </p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">
            Assigned to Ward Incharges
          </p>
        </div>

        {/* Resolved Issues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Resolved Issues
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {tickets.filter((t) => t.status === "RESOLVED").length}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            89% Satisfaction Index
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. SEARCH & FILTERS BAR                                               */}
      {/* ===================================================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by visitor name, ID, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-48 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-56 relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Roads &amp; Infrastructure">Roads &amp; Infrastructure</option>
            <option value="Pension">Pension</option>
            <option value="Electricity">Electricity</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Ration &amp; Civil Supplies">Ration &amp; Civil Supplies</option>
            <option value="Healthcare">Healthcare</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. TICKETS TABLE MATCHING REFERENCE DESIGN                             */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Visitor &amp; Voter Status</th>
                <th className="py-3.5 px-4">Category &amp; Priority</th>
                <th className="py-3.5 px-4">Issue Description</th>
                <th className="py-3.5 px-4">Assigned Officer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Ticket ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {ticket.id}
                  </td>

                  {/* Visitor & Voter Status */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">
                      {ticket.visitorName}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {ticket.isLinkedVoter ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                          Verified Voter ({ticket.voterEpic})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Unverified Visitor
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category & Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800 block">
                      {ticket.category}
                    </span>
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold mt-0.5 ${
                        ticket.priority === "CRITICAL"
                          ? "bg-rose-100 text-rose-800"
                          : ticket.priority === "HIGH"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  {/* Issue Description */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Created: {ticket.createdAt}
                    </span>
                  </td>

                  {/* Assigned Officer */}
                  <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {ticket.assignedTo}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ticket.status === "RESOLVED"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : ticket.status === "IN_PROGRESS"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setInspectTicket(ticket)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Inspect Ticket
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No tickets found matching the active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. INSPECT TICKET RIGHT-SIDE SLIDE-OVER DRAWER                        */}
      {/* ===================================================================== */}
      {inspectTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {inspectTicket.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      inspectTicket.status === "RESOLVED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {inspectTicket.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {inspectTicket.category}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectTicket(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              {/* Visitor Details Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {inspectTicket.visitorName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inspectTicket.isLinkedVoter
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {inspectTicket.isLinkedVoter ? "Verified Voter" : "Unverified Citizen Visitor"}
                  </span>
                </div>
                <p className="text-slate-600">
                  <strong>Contact:</strong> {inspectTicket.visitorPhone || "Not provided"}
                </p>
                <p className="text-slate-600">
                  <strong>Address:</strong> {inspectTicket.visitorAddress || "Not provided"}
                </p>
                {inspectTicket.voterEpic && (
                  <p className="text-blue-700 font-mono font-bold">
                    Linked Voter ID: {inspectTicket.voterEpic}
                  </p>
                )}
              </div>

              {/* Status Update Actions */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Update Ticket Resolution Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("OPEN")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      inspectTicket.status === "OPEN"
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Mark Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("IN_PROGRESS")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      inspectTicket.status === "IN_PROGRESS"
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("RESOLVED")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      inspectTicket.status === "RESOLVED"
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">
                  Issue Grievance Details
                </span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {inspectTicket.description}
                </p>
              </div>

              {/* Resolution Note if any */}
              {inspectTicket.resolutionNote && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                  <span className="font-bold block mb-0.5">Resolution Verification Note:</span>
                  <p>{inspectTicket.resolutionNote}</p>
                </div>
              )}

              {/* Internal Notes & Action History */}
              <div>
                <span className="font-bold text-slate-800 block mb-2">
                  Internal Notes &amp; Action History
                </span>
                <div className="space-y-2">
                  {inspectTicket.comments?.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-blue-700">{c.author}</span>
                        <span className="text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-700 text-[11px]">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Post Note Form */}
            <form
              onSubmit={handlePostComment}
              className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2"
            >
              <input
                type="text"
                placeholder="Add departmental coordination note or update..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-40 cursor-pointer"
              >
                Post Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. REGISTER VISITOR / NEW TICKET MODAL                                */}
      {/* ===================================================================== */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Register Citizen Visitor &amp; Grievance
                </h3>
                <p className="text-xs text-slate-500">
                  Log reception footfall and match with voter electoral roll.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterTicket} className="space-y-4 text-xs">
              {/* Match with Voter Electoral Roll Card */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Match with Voter Electoral Roll</span>
                  </span>
                  {linkedVoter && (
                    <button
                      type="button"
                      onClick={() => setLinkedVoter(null)}
                      className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Unlink
                    </button>
                  )}
                </div>

                {linkedVoter ? (
                  <div className="p-2.5 bg-white rounded-xl border border-blue-300 text-blue-950 font-medium space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{linkedVoter.fullName}</span>
                      <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {linkedVoter.epicNumber}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Booth #{linkedVoter.boothNumber} • {linkedVoter.address}
                    </span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Type voter name or EPIC to auto-fill..."
                      value={voterSearch}
                      onChange={(e) => setVoterSearch(e.target.value)}
                      className="w-full p-2 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />

                    {matchedVoters.length > 0 && (
                      <div className="mt-2 bg-white rounded-xl border border-blue-200 shadow-sm max-h-32 overflow-y-auto divide-y divide-slate-100">
                        {matchedVoters.map((v) => (
                          <div
                            key={v.id}
                            onClick={() => {
                              setLinkedVoter(v);
                              setVisitorName(v.fullName);
                              setVisitorPhone(v.mobile);
                              setVisitorAddress(v.address);
                              setVoterSearch("");
                            }}
                            className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors"
                          >
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {v.fullName}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {v.address}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-blue-700">
                              {v.epicNumber}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Visitor Name & Mobile Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Visitor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address / Locality */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Address / Locality
                </label>
                <input
                  type="text"
                  value={visitorAddress}
                  onChange={(e) => setVisitorAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Potential Duplicate Grievance Alert */}
              {duplicateTickets.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Potential Duplicate Grievance Detected ({duplicateTickets.length})</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Existing tickets found for this citizen/contact. You may inspect the existing record or proceed to log a new ticket.
                  </p>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {duplicateTickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-1.5 bg-white rounded-lg border border-amber-200 flex items-center justify-between text-[11px]"
                      >
                        <span className="font-bold text-slate-800">
                          {t.id}: {t.category} ({t.status})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setInspectTicket(t);
                            setIsRegisterModalOpen(false);
                          }}
                          className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded text-[10px] cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Water Supply">Water Supply</option>
                    <option value="Roads &amp; Infrastructure">Roads &amp; Infrastructure</option>
                    <option value="Pension">Pension</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Ration &amp; Civil Supplies">Ration &amp; Civil Supplies</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW")
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              {/* Assigned Officer */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Officer
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Sachin Babar (Prabhaag Incharge)">
                    Sachin Babar (Prabhaag Incharge)
                  </option>
                  <option value="Office Helpdesk (Sanjay Shinde)">
                    Office Helpdesk (Sanjay Shinde)
                  </option>
                  <option value="Pooja Jadhav (Karyakarta Lead)">
                    Pooja Jadhav (Karyakarta Lead)
                  </option>
                  <option value="Amit Deshmukh (Prabhaag Incharge)">
                    Amit Deshmukh (Prabhaag Incharge)
                  </option>
                </select>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Detailed Grievance Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe citizen demand, problem area, and action requested..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Register &amp; Assign Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
