"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  RefreshCw,
  Search,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";
import { CandidateRequestItem, EnquiryRecord } from "../../types/superadmin.types";

export function CandidateRequestsView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"leads" | "enquiries">("leads");
  const [leads, setLeads] = useState<CandidateRequestItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsRes, enqRes] = await Promise.all([
        superAdminApi.getCandidateRequests(),
        superAdminApi.getEnquiries(),
      ]);
      if (leadsRes.success) setLeads(leadsRes.data);
      if (enqRes.success) setEnquiries(enqRes.data);
    } catch {
      toast("Failed to load candidate requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLeadAction = async (id: string, action: "approve" | "decline") => {
    try {
      const res = await superAdminApi.handleCandidateRequest(id, action);
      if (res.success) {
        toast(`Lead ${action === "approve" ? "Approved & Onboarded" : "Declined"}.`, "success");
        loadData();
      }
    } catch {
      toast("Action failed.", "error");
    }
  };

  const handleEnquiryAction = async (id: string, status: "Approved" | "Completed" | "Rejected") => {
    try {
      const res = await superAdminApi.updateEnquiryStatus(id, status);
      if (res.success) {
        toast(`Enquiry marked as ${status}.`, "success");
        loadData();
      }
    } catch {
      toast("Action failed.", "error");
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#2087FE]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Candidate Registration Leads &amp; Quota Requests
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review public portal leads and candidate add-on quota requests awaiting administrative clearance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "leads"
                ? "bg-white dark:bg-slate-900 text-[#2087FE] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Registration Leads ({leads.filter((l) => l.status === "Pending").length})
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "enquiries"
                ? "bg-white dark:bg-slate-900 text-[#2087FE] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Quota Enquiries ({enquiries.filter((e) => e.status === "Pending" || e.status === "Under Review").length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, party, constituency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
          />
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Table Content */}
      {activeTab === "leads" ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Candidate &amp; Party</th>
                <th className="p-4">Constituency</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Clearance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{item.party}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{item.constituency}</div>
                    <div className="text-[10px] text-[#2087FE] font-bold">{item.electionType}</div>
                  </td>
                  <td className="p-4">
                    <div>{item.phone}</div>
                    <div className="text-[11px] text-slate-400">{item.email}</div>
                  </td>
                  <td className="p-4 text-[11px] text-slate-500">{item.source}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === "Approved"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : item.status === "Declined"
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                          : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {item.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleLeadAction(item.id, "approve")}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white transition shadow-xs"
                        >
                          Approve &amp; Onboard
                        </button>
                        <button
                          onClick={() => handleLeadAction(item.id, "decline")}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Request Type &amp; Category</th>
                <th className="p-4">Requested Quota</th>
                <th className="p-4">Remarks</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{enq.candidateName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{enq.candidateId}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{enq.type}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[#2087FE] font-bold">
                      {enq.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{enq.requestedQuantity}</td>
                  <td className="p-4 text-[11px] text-slate-500 max-w-xs truncate">{enq.remarks}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        enq.status === "Approved" || enq.status === "Completed"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : enq.status === "Rejected"
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                          : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {enq.status !== "Completed" && enq.status !== "Approved" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEnquiryAction(enq.id, "Approved")}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs"
                        >
                          Approve Quota
                        </button>
                        <button
                          onClick={() => handleEnquiryAction(enq.id, "Rejected")}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-bold">✓ Fulfilled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
