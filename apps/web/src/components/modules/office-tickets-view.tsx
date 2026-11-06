"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function OfficeTicketsView() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(SAMPLE_TICKETS[0] ?? null);

  const filtered = SAMPLE_TICKETS.filter((t) => {
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
    showToast("success", "Ticket Status Updated", `Ticket ${id} marked as ${newStatus}.`);
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Office Helpdesk &amp; Civic Grievances
            </span>
            <Badge variant="warning">42 Open Issues</Badge>
            <Badge variant="teal">89% Resolution SLA</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Constituency Issues &amp; Public Demands
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Civic infrastructure escalation tracking, public demands triage, and candidate office resolution SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="md">
            <Plus className="w-3.5 h-3.5" />
            <span>Log Public Grievance</span>
          </Button>
        </div>
      </section>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Tickets Table / List (Span 2) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket, ward, citizen..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 pl-2 pr-6 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="py-1.5 pl-2 pr-6 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>
          </div>

          {/* Tickets Cards List */}
          <div className="space-y-2.5">
            {filtered.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-brand-500 shadow-sm ring-1 ring-[#5146D8]/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#98A2B3] shadow-premium-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-brand-600">
                          {t.id}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                          {t.category}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                            t.priority === "CRITICAL"
                              ? "bg-rose-50 text-rose-600"
                              : t.priority === "HIGH"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-brand-50 text-brand-600"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {t.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold shrink-0 ${
                        t.status === "RESOLVED"
                          ? "bg-emerald-50 text-emerald-600"
                          : t.status === "IN PROGRESS"
                          ? "bg-brand-50 text-brand-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {t.ward} &bull; {t.booth} &bull; Reported by {t.reporter}
                    </span>
                    <span>{t.createdDate.split(",")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Ticket Resolution Details (Span 1) */}
        {selectedTicket && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between h-fit">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-mono font-bold text-sm text-brand-600">
                  {selectedTicket.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    selectedTicket.status === "RESOLVED"
                      ? "bg-emerald-50 text-emerald-600"
                      : selectedTicket.status === "IN PROGRESS"
                      ? "bg-brand-50 text-brand-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {selectedTicket.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Citizen Contact:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {selectedTicket.reporter} ({selectedTicket.phone})
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-200">
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-medium text-slate-800 dark:text-white">
                    {selectedTicket.ward} &bull; Station {selectedTicket.booth}
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-200">
                  <span className="text-slate-500 block">Office Staff Assigned:</span>
                  <span className="font-medium text-brand-600">
                    {selectedTicket.assignedStaff}
                  </span>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-white">
                  Update Resolution Workflow:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, "IN PROGRESS")}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-center cursor-pointer"
                  >
                    Mark In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, "RESOLVED")}
                    className="p-2 rounded-lg bg-[#0DAD9B] hover:bg-[#0B9585] text-white text-xs font-semibold text-center cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
