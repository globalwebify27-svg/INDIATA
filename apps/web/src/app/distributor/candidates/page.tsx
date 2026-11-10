"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  ExternalLink,
  LayoutGrid,
  List,
} from "lucide-react";
import { DistributorLayout } from "../../../distributor/components/distributor-layout";
import { mockScopedCandidates } from "../../../distributor/data/mock-distributor-data";
import { Badge } from "@rajtantra/ui/feedback";

export default function CandidatesDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Filtering candidates strictly assigned to this distributor
  const filteredCandidates = mockScopedCandidates.filter((cand) => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.marathiName.includes(searchTerm) ||
      cand.mobile.includes(searchTerm) ||
      cand.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.party.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || cand.status === statusFilter;
    const matchesType =
      typeFilter === "ALL" || cand.accountType.toUpperCase() === typeFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DistributorLayout
      title="Assigned Candidates Directory"
      subtitle="Manage, review, and configure electoral war rooms for candidates in your franchise"
    >
      <div className="space-y-6">
        {/* Controls & Filter Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-600 dark:text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate name, mobile, constituency, party..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 focus:border-[#2087FE]"
            />
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="EXPIRED">Expired</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20"
            >
              <option value="ALL">All Account Types</option>
              <option value="SALE">Commercial Sale</option>
              <option value="DEMO">Demo / Trial</option>
            </select>

            {/* Toggle View */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 text-[#2087FE] shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 text-[#2087FE] shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Add Candidate Shortcut */}
            <Link
              href="/distributor/candidates/new"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white shadow-premium-xs transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Candidate</span>
            </Link>
          </div>
        </div>

        {/* Candidate Count and Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 px-1">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCandidates.length}</span> of{" "}
            <span className="font-bold text-slate-900 dark:text-white">{mockScopedCandidates.length}</span> assigned candidates
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active ({mockScopedCandidates.filter((c) => c.status === "ACTIVE").length})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Demo ({mockScopedCandidates.filter((c) => c.accountType === "DEMO" || c.accountType === "Demo").length})</span>
            </span>
          </div>
        </div>

        {/* View Mode: Table */}
        {viewMode === "table" ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Candidate Details</th>
                    <th className="px-4 py-3.5">Party & Acronym</th>
                    <th className="px-4 py-3.5">Election & Locus</th>
                    <th className="px-4 py-3.5">Type & Status</th>
                    <th className="px-4 py-3.5">Subscription Tier</th>
                    <th className="px-4 py-3.5">Add-on Features</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#2087FE] font-extrabold flex items-center justify-center shrink-0">
                            {cand.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {cand.name}
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                              {cand.marathiName} • {cand.mobile}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {cand.party}
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-300">
                          ID: {cand.id}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {cand.electionType}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          {cand.constituency}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 space-y-1">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            cand.accountType === "DEMO" || cand.accountType === "Demo"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          }`}
                        >
                          {cand.accountType}
                        </span>
                        <div>
                          <Badge
                            variant={
                              cand.status === "ACTIVE"
                                ? "success"
                                : cand.status === "PENDING_APPROVAL"
                                ? "warning"
                                : "neutral"
                            }
                            size="sm"
                          >
                            {cand.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {cand.subscriptionTier}
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-300">
                          Expires: {cand.subscriptionExpiresAt}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {cand.features.aiVoiceCall && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-850">
                              Voice AI
                            </span>
                          )}
                          {cand.features.whatsappBot && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-850">
                              WhatsApp
                            </span>
                          )}
                          {cand.features.familyMapping && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-850">
                              Family Map
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/distributor/candidates/${cand.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#2087FE] bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition shadow-sm"
                        >
                          <span>Manage</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* View Mode: Grid Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#2087FE] font-extrabold flex items-center justify-center shrink-0">
                        {cand.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {cand.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {cand.marathiName}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        cand.status === "ACTIVE"
                          ? "success"
                          : cand.status === "PENDING_APPROVAL"
                          ? "warning"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {cand.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Party:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cand.party}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Locus:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cand.constituency} ({cand.electionType})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Account Type:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {cand.accountType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Subscription:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {cand.subscriptionTier}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                    {cand.mobile}
                  </span>
                  <Link
                    href={`/distributor/candidates/${cand.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2087FE] hover:bg-blue-600 transition shadow-premium-xs"
                  >
                    <span>Manage Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DistributorLayout>
  );
}
