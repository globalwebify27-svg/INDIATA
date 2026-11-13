"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  ExternalLink,
  LayoutGrid,
  List,
  Edit,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { DistributorLayout } from "../../../distributor/components/distributor-layout";
import { candidateStore, CandidateProfile } from "../../../distributor/data/candidate-store";
import { EditCandidateModal } from "../../../distributor/components/edit-candidate-modal";
import { Badge } from "@rajtantra/ui/feedback";

export default function CandidatesDirectoryPage() {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [partyFilter, setPartyFilter] = useState("ALL");
  const [electionFilter, setElectionFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected candidate for Quick Edit Modal
  const [editingCandidate, setEditingCandidate] = useState<CandidateProfile | null>(null);

  // Subscribe to central candidate store for instant reactivity
  useEffect(() => {
    setCandidates(candidateStore.getAllCandidates());
    const unsubscribe = candidateStore.subscribe(() => {
      setCandidates(candidateStore.getAllCandidates());
    });
    return unsubscribe;
  }, []);

  // Unique parties for filter dropdown
  const uniqueParties = Array.from(new Set(candidates.map((c) => c.partyAcronym))).filter(Boolean);

  // Filtering candidates strictly assigned to this distributor
  const filteredCandidates = candidates.filter((cand) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      cand.name.toLowerCase().includes(q) ||
      (cand.marathiName && cand.marathiName.includes(searchTerm)) ||
      cand.mobile.includes(q) ||
      (cand.email && cand.email.toLowerCase().includes(q)) ||
      cand.constituency.toLowerCase().includes(q) ||
      cand.party.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "ALL" || cand.status === statusFilter;
    const matchesParty =
      partyFilter === "ALL" || cand.partyAcronym === partyFilter;
    const matchesElection =
      electionFilter === "ALL" || cand.electionType === electionFilter;

    return matchesSearch && matchesStatus && matchesParty && matchesElection;
  });

  // Pagination calculation
  const totalItems = filteredCandidates.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DistributorLayout
      title="Assigned Candidates Directory"
      subtitle="Manage, review, and configure electoral war rooms for candidates in your franchise"
    >
      <div className="space-y-6">
        {/* Controls & Filter Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search candidate name, mobile, email, constituency, party..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 focus:border-[#2087FE]"
            />
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="EXPIRED">Expired</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            {/* Party Filter */}
            <select
              value={partyFilter}
              onChange={(e) => {
                setPartyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 cursor-pointer"
            >
              <option value="ALL">All Parties</option>
              {uniqueParties.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Election Type Filter */}
            <select
              value={electionFilter}
              onChange={(e) => {
                setElectionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 cursor-pointer"
            >
              <option value="ALL">All Election Types</option>
              <option value="Vidhan Sabha">Vidhan Sabha</option>
              <option value="Municipal Corporation">Municipal Corporation</option>
              <option value="Zilla Parishad">Zilla Parishad</option>
              <option value="Lok Sabha">Lok Sabha</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 text-[#2087FE] shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 text-[#2087FE] shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCandidates.length}</span> of{" "}
            <span className="font-bold text-slate-900 dark:text-white">{candidates.length}</span> assigned candidates
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active ({candidates.filter((c) => c.status === "ACTIVE").length})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Pending ({candidates.filter((c) => c.status === "PENDING_APPROVAL").length})</span>
            </span>
          </div>
        </div>

        {/* View Mode: Table */}
        {viewMode === "table" ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Candidate Details</th>
                    <th className="px-4 py-3.5">Party &amp; Symbol</th>
                    <th className="px-4 py-3.5">Contact Details</th>
                    <th className="px-4 py-3.5">State, District &amp; Constituency</th>
                    <th className="px-4 py-3.5">Status &amp; Registered</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition group"
                    >
                      {/* 1. Candidate Details with Photo */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/60 p-0.5 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden shadow-xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cand.images.profilePhotoUrl}
                              alt={cand.name}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition">
                              {cand.name}
                            </div>
                            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-marathi font-medium">
                              {cand.marathiName}
                            </div>
                            <span className="font-mono text-[9.5px] text-slate-400">
                              ID: {cand.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Party & Symbol */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-slate-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cand.images.partySymbolUrl}
                              alt="Party Symbol"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {cand.party}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Code: <span className="font-mono font-bold text-blue-600">{cand.partyAcronym}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Contact Details */}
                      <td className="px-4 py-3.5 space-y-0.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{cand.mobile}</span>
                        </div>
                        {cand.email && (
                          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[150px]">{cand.email}</span>
                          </div>
                        )}
                      </td>

                      {/* 4. Geography */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {cand.constituency}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{cand.district}, {cand.state}</span>
                        </div>
                        <span className="text-[9.5px] text-blue-600 font-bold">
                          {cand.electionType}
                        </span>
                      </td>

                      {/* 5. Status & Registration Date */}
                      <td className="px-4 py-3.5 space-y-1">
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
                        <div className="text-[10px] text-slate-400">
                          Reg: {cand.registrationDate || cand.createdDate}
                        </div>
                      </td>

                      {/* 6. Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Edit Basic Info */}
                          <button
                            type="button"
                            onClick={() => setEditingCandidate(cand)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                            title="Edit Candidate Information"
                          >
                            <Edit className="w-3 h-3 text-blue-600" />
                            <span>Edit</span>
                          </button>

                          {/* View Profile & Images */}
                          <Link
                            href={`/distributor/candidates/${cand.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2087FE] hover:bg-blue-600 transition shadow-sm"
                          >
                            <span>View Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* View Mode: Grid Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Top: Photo & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-blue-100 dark:bg-blue-950/60 p-0.5 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cand.images.profilePhotoUrl}
                          alt={cand.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {cand.name}
                        </h4>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-marathi font-medium">
                          {cand.marathiName}
                        </p>
                        <span className="font-mono text-[9.5px] text-slate-400">
                          {cand.id}
                        </span>
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

                  {/* Card Data Attributes */}
                  <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Party &amp; Symbol:</span>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                        <div className="w-5 h-5 rounded bg-white p-0.5 border border-slate-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cand.images.partySymbolUrl}
                            alt="Symbol"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="truncate max-w-[140px]">{cand.party}</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Constituency:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                        {cand.constituency}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">District / State:</span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {cand.district}, {cand.state}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {cand.mobile}
                      </span>
                    </div>

                    {cand.email && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="truncate max-w-[160px] text-slate-600 dark:text-slate-300">
                          {cand.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCandidate(cand)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit Profile</span>
                  </button>

                  <Link
                    href={`/distributor/candidates/${cand.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2087FE] hover:bg-blue-600 transition shadow-premium-xs"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Edit Candidate Profile Modal */}
      {editingCandidate && (
        <EditCandidateModal
          isOpen={!!editingCandidate}
          candidate={editingCandidate}
          onClose={() => setEditingCandidate(null)}
          onSaved={() => {
            setEditingCandidate(null);
          }}
        />
      )}
    </DistributorLayout>
  );
}
