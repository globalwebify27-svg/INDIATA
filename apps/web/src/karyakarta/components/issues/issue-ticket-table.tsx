"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Send,
  X,
  Eye,
} from "lucide-react";
import { IssueTicket, TicketPriority, TicketStatus, VoterRecord } from "../../types/karyakarta.types";
import { centralVoterStore } from "@/lib/voters/central-voter-store";
import { CentralVoterProfile } from "../voters/central-voter-profile";

interface IssueTicketTableProps {
  tickets: IssueTicket[];
  onOpenCreateModal: () => void;
  onUpdateTicketStatus?: (ticketId: string, newStatus: TicketStatus, note?: string) => void;
}

export function IssueTicketTable({
  tickets,
  onOpenCreateModal,
  onUpdateTicketStatus,
}: IssueTicketTableProps) {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<IssueTicket | null>(null);
  const [followUpNote, setFollowUpNote] = useState("");
  const [viewingVoter, setViewingVoter] = useState<VoterRecord | null>(null);

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === "OPEN" && (t.status === "RESOLVED" || t.status === "CLOSED")) return false;
    if (activeTab === "RESOLVED" && t.status !== "RESOLVED" && t.status !== "CLOSED") return false;
    if (activeTab === "URGENT" && t.priority !== "URGENT") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const mNum = t.ticketNumber.toLowerCase().includes(q);
      const mVoter = t.voterName.toLowerCase().includes(q);
      const mCat = t.category.toLowerCase().includes(q);
      const mDesc = t.description.toLowerCase().includes(q);
      if (!mNum && !mVoter && !mCat && !mDesc) return false;
    }
    return true;
  });

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "URGENT":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            URGENT
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
            MEDIUM
          </span>
        );
      case "LOW":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{status}</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300">
            <Clock className="w-3 h-3 text-blue-600 animate-spin" />
            <span>IN PROGRESS</span>
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300">
            <span>ASSIGNED</span>
          </span>
        );
      case "NEW":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
            <span>NEW</span>
          </span>
        );
    }
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !followUpNote.trim()) return;

    if (onUpdateTicketStatus) {
      onUpdateTicketStatus(selectedTicket.id, selectedTicket.status, followUpNote.trim());
    }
    setFollowUpNote("");
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "ALL", label: "All Tickets" },
            { id: "OPEN", label: "Open Grievances" },
            { id: "URGENT", label: "Urgent Priority" },
            { id: "RESOLVED", label: "Resolved / Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2087FE] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by voter, category, or number..."
            className="w-full sm:w-64 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#2087FE] focus:outline-none"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-3.5">Ticket #</th>
              <th className="py-3 px-3">Voter / Citizen</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Assigned To</th>
              <th className="py-3 px-3">Created</th>
              <th className="py-3 px-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-xs">No issue tickets found.</p>
                  <button
                    onClick={onOpenCreateModal}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 rounded-lg hover:bg-amber-100"
                  >
                    + Log New Grievance
                  </button>
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <td className="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {ticket.ticketNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {ticket.voterName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Booth {ticket.voterBooth}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {ticket.category}
                  </td>
                  <td className="py-3 px-3">{getPriorityBadge(ticket.priority)}</td>
                  <td className="py-3 px-3">{getStatusBadge(ticket.status)}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {ticket.assignedTo}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {ticket.createdAt.split(",")[0]}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(ticket);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-bold text-[11px] cursor-pointer"
                    >
                      View &rarr;
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-2.5">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                {ticket.ticketNumber}
              </span>
              <div className="flex items-center gap-1.5">
                {getPriorityBadge(ticket.priority)}
                {getStatusBadge(ticket.status)}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {ticket.voterName}
              </h4>
              <p className="text-xs text-blue-600 font-semibold">{ticket.category}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ticket.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Booth {ticket.voterBooth}</span>
              <span>{ticket.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Details & Follow-up Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-900 via-amber-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-amber-300">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span className="text-xs font-bold">{selectedTicket.category}</span>
                </div>
                <h3 className="text-base font-bold mt-1">Grievance from {selectedTicket.voterName}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Status and Priority Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Priority:</span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
              </div>

              {/* Linked Voter Info Summary */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {selectedTicket.voterName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedTicket.voterName}
                      </span>
                      {selectedTicket.voterBooth && (
                        <span className="font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                          Booth {selectedTicket.voterBooth}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono">{selectedTicket.voterPhone}</span>
                      {selectedTicket.voterId && (
                        <>
                          <span>•</span>
                          <span>ID: <code className="font-mono">{selectedTicket.voterId}</code></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {selectedTicket.voterId && (
                  <button
                    type="button"
                    onClick={() => {
                      const v = centralVoterStore.getVoterById(selectedTicket.voterId!);
                      if (v) setViewingVoter(v);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-blue-200 dark:border-blue-800 text-blue-600 hover:bg-blue-100/60 dark:hover:bg-blue-950 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View 360° Profile</span>
                  </button>
                )}
              </div>

              {/* Description Box */}
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Issue Description:
                </span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Resolution Notes if Resolved */}
              {selectedTicket.resolutionNotes && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold block mb-1">Resolution Summary:</span>
                  <p>{selectedTicket.resolutionNotes}</p>
                </div>
              )}

              {/* Follow-up Notes Timeline */}
              <div className="space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">
                  Follow-Up Updates &amp; Cadre Notes ({selectedTicket.followUps.length}):
                </span>
                {selectedTicket.followUps.length === 0 ? (
                  <p className="text-slate-400 italic">No previous follow-up entries.</p>
                ) : (
                  selectedTicket.followUps.map((fu) => (
                    <div
                      key={fu.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{fu.author}</span>
                        <span>{fu.timestamp}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200">{fu.note}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Follow-Up Form */}
              <form onSubmit={handleAddFollowUp} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Add Follow-Up Note or Resolution Update:
                </label>
                <textarea
                  rows={2}
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="Record call with ward officer, volunteer visit update, or pipeline status..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!followUpNote.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Follow-Up Note</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Linked Elector Central Voter Profile Modal */}
      {viewingVoter && (
        <CentralVoterProfile
          voter={viewingVoter}
          isOpen={!!viewingVoter}
          onClose={() => setViewingVoter(null)}
        />
      )}
    </div>
  );
}
