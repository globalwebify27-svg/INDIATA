"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Plus,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Building,
  HelpCircle,
  Flame,
} from "lucide-react";
import { useKaryakartaAuth } from "../../../karyakarta/context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../../karyakarta/context/karyakarta-language-context";
import { IssueTicketTable } from "../../../karyakarta/components/issues/issue-ticket-table";
import { CreateIssueModal } from "../../../karyakarta/components/issues/create-issue-modal";
import { MOCK_ISSUES } from "../../../karyakarta/data/mock-karyakarta-data";
import { IssueTicket, TicketStatus } from "../../../karyakarta/types/karyakarta.types";

export default function VoterIssuesPage() {
  const { user } = useKaryakartaAuth();
  const { t } = useKaryakartaLanguage();

  const [tickets, setTickets] = useState<IssueTicket[]>(MOCK_ISSUES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Scoped tickets: show tickets belonging to user's assigned booths
  const scopedTickets = tickets.filter(
    (t) => !user?.assignedBooths?.length || user.assignedBooths.includes(t.voterBooth)
  );

  const totalCount = scopedTickets.length;
  const openCount = scopedTickets.filter(
    (t) => t.status === "NEW" || t.status === "ASSIGNED" || t.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = scopedTickets.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  ).length;
  const urgentCount = scopedTickets.filter((t) => t.priority === "URGENT").length;

  const handleCreateIssue = (ticketData: Partial<IssueTicket>) => {
    const newTicket: IssueTicket = {
      id: `iss-${Date.now().toString().slice(-4)}`,
      ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      voterId: ticketData.voterId || "v-01",
      voterName: ticketData.voterName || "Citizen",
      voterPhone: ticketData.voterPhone || "+91 98000 00000",
      voterBooth: ticketData.voterBooth || user?.assignedBooths?.[0] || "#101",
      karyakartaId: user?.id || "KAR-2026-001",
      karyakartaName: user?.name || "Sachin D. Mane",
      category: ticketData.category || "Other",
      description: ticketData.description || "",
      priority: ticketData.priority || "MEDIUM",
      status: "NEW",
      assignedTo: ticketData.assignedTo || "Ward Quick Response Team",
      createdAt: "Just now",
      updatedAt: "Just now",
      resolutionNotes: null,
      followUps: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSuccessToast(`Ticket ${newTicket.ticketNumber} registered and dispatched to Candidate War Room!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus, note?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const followUps = [...t.followUps];
          if (note) {
            followUps.push({
              id: `fl-${Date.now()}`,
              author: `${user?.name || "Karyakarta"} (Field Note)`,
              note,
              timestamp: "Just now",
            });
          }
          return {
            ...t,
            status: newStatus,
            updatedAt: "Just now",
            resolutionNotes:
              newStatus === "RESOLVED"
                ? note || "Issue marked resolved by field Karyakarta"
                : t.resolutionNotes,
            followUps,
          };
        }
        return t;
      })
    );

    setSuccessToast(`Ticket status updated to ${newStatus}`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleExportCSV = () => {
    const headers = [
      "Ticket Number",
      "Voter Name",
      "Booth",
      "Category",
      "Priority",
      "Status",
      "Assigned To",
      "Created At",
      "Description",
    ];
    const rows = scopedTickets.map((t) => [
      t.ticketNumber,
      `"${t.voterName}"`,
      t.voterBooth,
      `"${t.category}"`,
      t.priority,
      t.status,
      `"${t.assignedTo || "N/A"}"`,
      `"${t.createdAt}"`,
      `"${t.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `karyakarta_grievances_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{successToast}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
              M14 Field Workforce
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Constituency: {user?.constituencyName || "215 - Kasba Peth"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            {t("issues.title", "Voter Grievance & Issue Resolution Desk")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Capture, track, and escalate local civic problems, welfare scheme bottlenecks, and voter concerns directly to the Candidate War Room.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Grievances CSV
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Log New Grievance
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Logged */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Registered</div>
          </div>
        </div>

        {/* Active / In Progress */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{openCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active / Pending</div>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Resolved / Closed</div>
          </div>
        </div>

        {/* Urgent Red Flag */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{urgentCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Urgent Priority</div>
          </div>
        </div>
      </div>

      {/* Main Issue Tickets Table */}
      <IssueTicketTable
        tickets={scopedTickets}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onUpdateTicketStatus={handleUpdateStatus}
      />

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitIssue={handleCreateIssue}
      />

      {/* Guidelines Accordion / Helper */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            Field Karyakarta Escalation Protocol:
          </div>
          <p>
            1. All tickets flagged with <span className="text-rose-600 font-bold">URGENT</span> status trigger instant SMS and push alerts to the Candidate's Personal Assistant and designated Ward In-charge.
          </p>
          <p>
            2. For civil utility complaints (drainage, transformer, drinking water), attach citizen phone numbers so municipal liaison staff can verify completion directly with the family.
          </p>
          <p>
            3. When an issue is resolved, add a closing note with proof or date of work completion before changing status to <span className="text-emerald-600 font-bold">RESOLVED</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
