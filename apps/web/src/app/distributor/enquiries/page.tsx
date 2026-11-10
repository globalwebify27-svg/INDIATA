"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  X,
} from "lucide-react";
import { DistributorLayout } from "../../../distributor/components/distributor-layout";
import { mockScopedEnquiries, mockScopedCandidates, ScopedCandidate, ScopedEnquiry } from "../../../distributor/data/mock-distributor-data";

export default function GeneratedEnquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [fulfilmentStatusFilter, setFulfilmentStatusFilter] = useState("ALL");

  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New enquiry form state
  const [newCandidateId, setNewCandidateId] = useState(mockScopedCandidates[0]?.id || "");
  const [newPackage, setNewPackage] = useState("AI Voice Caller 10,000 Minutes Pack");
  const [newNotes, setNewNotes] = useState("");

  const filteredEnquiries = mockScopedEnquiries.filter((enq) => {
    const matchesSearch =
      enq.enquiryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.requestedPackage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.constituency.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEnquiry =
      enquiryStatusFilter === "ALL" || enq.enquiryStatus === enquiryStatusFilter;
    const matchesPayment =
      paymentStatusFilter === "ALL" || enq.paymentStatus === paymentStatusFilter;
    const matchesFulfilment =
      fulfilmentStatusFilter === "ALL" || enq.fulfilmentStatus === fulfilmentStatusFilter;

    return matchesSearch && matchesEnquiry && matchesPayment && matchesFulfilment;
  });

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const cand = mockScopedCandidates.find((c) => c.id === newCandidateId);
    const newEnq = {
      id: `enq-${Date.now()}`,
      enquiryNumber: `ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      candidateId: newCandidateId,
      candidateName: cand?.name || "Candidate",
      constituency: cand?.constituency || "Pune",
      requestedPackage: newPackage,
      amount: "₹ 45,000",
      createdAt: new Date().toISOString().slice(0, 10),
      enquiryStatus: "Pending",
      paymentStatus: "Payment Pending",
      fulfilmentStatus: "Awaiting Payment",
      notes: newNotes || "Requested via Distributor Portal",
    };

    mockScopedEnquiries.unshift(newEnq as any);
    setIsCreateModalOpen(false);
    setSelectedEnquiry(newEnq);
  };

  return (
    <DistributorLayout
      title="Generated Enquiries & Service Tracking"
      subtitle="Track add-on campaigns and subscription requests with 3 independent status lifecycles"
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-600 dark:text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Enquiry No, Candidate, or Service..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20"
            />
          </div>

          {/* 3 Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={enquiryStatusFilter}
              onChange={(e) => setEnquiryStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Enquiry Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Payment Pending">Payment Pending</option>
              <option value="Payment Received">Payment Received</option>
              <option value="Payment Verified">Payment Verified</option>
              <option value="Payment Failed">Payment Failed</option>
            </select>

            <select
              value={fulfilmentStatusFilter}
              onChange={(e) => setFulfilmentStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Fulfilment Statuses</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Awaiting Verification">Awaiting Verification</option>
              <option value="Awaiting Fulfilment">Awaiting Fulfilment</option>
              <option value="In Progress">In Progress</option>
              <option value="Fulfilled">Fulfilled</option>
            </select>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white shadow-premium-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Enquiry</span>
            </button>
          </div>
        </div>

        {/* 3 Status Architecture Explanation Pill */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2087FE] text-white flex items-center justify-center font-bold shrink-0">
              3S
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Independent 3-Status Lifecycle Engine
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                1. Enquiry Status (Commercial) • 2. Payment Status (Finance Verification) • 3. Fulfilment Status (Tech Rollout)
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-full">
            Payment Verification: Super Admin Controlled
          </span>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Enquiry Number</th>
                  <th className="px-4 py-3.5">Candidate Name</th>
                  <th className="px-4 py-3.5">Service / Add-on</th>
                  <th className="px-4 py-3.5">Enquiry Status</th>
                  <th className="px-4 py-3.5">Payment Status</th>
                  <th className="px-4 py-3.5">Fulfilment Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEnquiries.map((enq: ScopedEnquiry) => (
                  <tr
                    key={enq.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3.5 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {enq.enquiryNumber}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300">
                        {enq.createdAt}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {enq.candidateName}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        {enq.constituency}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {enq.requestedPackage}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold text-slate-900 dark:text-slate-100">
                        Est: {enq.amount}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.enquiryStatus === "Approved" || enq.enquiryStatus === "Completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : enq.enquiryStatus === "Rejected"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                        }`}
                      >
                        {enq.enquiryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.paymentStatus === "Payment Verified" || enq.paymentStatus === "Payment Received"
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
                            : enq.paymentStatus === "Payment Failed"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {enq.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.fulfilmentStatus === "Fulfilled"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                            : enq.fulfilmentStatus === "In Progress"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {enq.fulfilmentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#2087FE] bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Enquiry Inspect Drawer / Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Enquiry Details: {selectedEnquiry.enquiryNumber}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Logged on {selectedEnquiry.createdAt}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Candidate:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedEnquiry.candidateName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Constituency:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedEnquiry.constituency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Requested Package:</span>
                    <span className="font-bold text-[#2087FE]">
                      {selectedEnquiry.requestedPackage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Amount:</span>
                    <span className="font-bold font-mono">{selectedEnquiry.amount}</span>
                  </div>
                </div>

                {/* 3 Status Details */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold mb-1">Enquiry</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {selectedEnquiry.enquiryStatus}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold mb-1">Payment</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                      {selectedEnquiry.paymentStatus}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold mb-1">Fulfilment</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {selectedEnquiry.fulfilmentStatus}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold">Administrative Note:</span> {selectedEnquiry.notes || "No additional notes recorded."}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Raise Enquiry Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Raise Candidate Service Enquiry
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Request an add-on service or package upgrade for your candidate
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEnquiry} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Assigned Candidate *
                  </label>
                  <select
                    value={newCandidateId}
                    onChange={(e) => setNewCandidateId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {mockScopedCandidates.map((c: ScopedCandidate) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.constituency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Requested Add-on / Service *
                  </label>
                  <select
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="AI Voice Caller 10,000 Minutes Pack">
                      AI Voice Caller 10,000 Minutes Pack (₹ 45,000)
                    </option>
                    <option value="Official WhatsApp Verified Blue-Tick Bot">
                      Official WhatsApp Verified Blue-Tick Bot (₹ 25,000)
                    </option>
                    <option value="Voter Family Tree AI Clustering Module">
                      Voter Family Tree AI Clustering Module (₹ 35,000)
                    </option>
                    <option value="Booth Slip PDF High-Speed Cloud Server">
                      Booth Slip PDF High-Speed Cloud Server (₹ 20,000)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Candidate Campaign Notes
                  </label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Enter special timing requirements or campaign urgency..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#2087FE] hover:bg-blue-600 text-white shadow-premium-xs transition"
                  >
                    Generate Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DistributorLayout>
  );
}
