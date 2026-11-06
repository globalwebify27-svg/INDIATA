"use client";

import React, { useState } from "react";
import { Search, Filter, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "../../context/toast-context";

export interface OrganizationRow {
  id: string;
  name: string;
  code: string;
  nodes: number;
  avatarColor: "saffron" | "violet" | "green";
  avatarText: string;
  type: "Vidhan Sabha (Assembly)" | "Parliamentary (Lok Sabha)" | "Civic / Municipal Body";
  status: "Active" | "Trial" | "Pending Clearance";
  createdDate: string;
}

const DEFAULT_ORGANIZATIONS: OrganizationRow[] = [
  {
    id: "ORG-2024-884",
    name: "Pune Central Campaign Secretariat",
    code: "ORG-2024-884",
    nodes: 42,
    avatarColor: "saffron",
    avatarText: "PC",
    type: "Vidhan Sabha (Assembly)",
    status: "Active",
    createdDate: "Oct 14, 2024",
  },
  {
    id: "ORG-2024-912",
    name: "Baramati Vidhan Sabha War Room",
    code: "ORG-2024-912",
    nodes: 88,
    avatarColor: "violet",
    avatarText: "BV",
    type: "Vidhan Sabha (Assembly)",
    status: "Active",
    createdDate: "Sep 28, 2024",
  },
  {
    id: "ORG-2024-741",
    name: "Nagpur South-West Municipal Unit",
    code: "ORG-2024-741",
    nodes: 31,
    avatarColor: "green",
    avatarText: "NS",
    type: "Civic / Municipal Body",
    status: "Trial",
    createdDate: "Nov 02, 2024",
  },
  {
    id: "ORG-2024-603",
    name: "Thane Parliamentary Strategy Center",
    code: "ORG-2024-603",
    nodes: 124,
    avatarColor: "violet",
    avatarText: "TP",
    type: "Parliamentary (Lok Sabha)",
    status: "Active",
    createdDate: "Aug 19, 2024",
  },
];

export function OrganizationsDirectoryTable() {
  const { toast } = useToast();
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredOrgs = DEFAULT_ORGANIZATIONS.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      org.code.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesType =
      typeFilter === "All Types" ||
      (typeFilter === "Vidhan Sabha" && org.type.includes("Vidhan Sabha")) ||
      (typeFilter === "Lok Sabha" && org.type.includes("Lok Sabha")) ||
      (typeFilter === "Municipal" && org.type.includes("Municipal"));

    const matchesStatus =
      statusFilter === "All Statuses" || org.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDetails = (orgName: string) => {
    toast(`Opening command dossier for ${orgName}...`, "info");
  };

  const handleManageLicenses = (orgName: string) => {
    toast(`Opening active seats and license allocation for ${orgName}...`, "info");
  };

  const handleApplyFilter = () => {
    toast(`Filter applied: ${filteredOrgs.length} organizations matching criteria.`, "info");
  };

  return (
    <section className="bg-white dark:bg-[#062237] rounded-xl border border-[#E2E8F0] dark:border-[#0e3554] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Table Header & Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#F1F5F9] dark:border-[#0e3554] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h2 className="text-[14.5px] sm:text-[15px] font-bold text-[#010627] dark:text-[#F5F6F6]">
            Registered Organizations &amp; Campaign War Rooms
          </h2>
          <p className="text-[11px] text-[#717785] dark:text-[#94A3B8] font-normal mt-0.5">
            Directory of candidate campaign secretariats, party war rooms, and civic units
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search field */}
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by name or ID..."
              className="pl-7 pr-2.5 py-1 rounded-md border border-[#ACB9D1] dark:border-[#0e3554] text-[11px] bg-white dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] placeholder:text-[#717785] dark:placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2087FE] focus:ring-1 focus:ring-[#2087FE]/20 w-40 sm:w-44 transition-all shadow-2xs"
            />
            <Search className="w-3 h-3 absolute left-2 top-2 text-[#717785] dark:text-[#94A3B8] pointer-events-none" />
          </div>

          {/* Org Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1 pl-2 pr-6 rounded-md border border-[#ACB9D1] dark:border-[#0e3554] text-[11px] bg-white dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] focus:outline-none focus:border-[#2087FE] cursor-pointer shadow-2xs"
          >
            <option value="All Types">All Types</option>
            <option value="Vidhan Sabha">Assembly (Vidhan Sabha)</option>
            <option value="Lok Sabha">Parliamentary (Lok Sabha)</option>
            <option value="Municipal">Civic / Municipal Body</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1 pl-2 pr-6 rounded-md border border-[#ACB9D1] dark:border-[#0e3554] text-[11px] bg-white dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] focus:outline-none focus:border-[#2087FE] cursor-pointer shadow-2xs"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Pending Clearance">Pending Clearance</option>
          </select>

          {/* Filter Button */}
          <button
            type="button"
            onClick={handleApplyFilter}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#ACB9D1] dark:border-[#0e3554] bg-white dark:bg-[#072439] hover:bg-[#2087FE] hover:text-white hover:border-[#2087FE] dark:hover:bg-[#0D79FD] text-[#010627] dark:text-[#F5F6F6] text-[11px] font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Filter className="w-3 h-3" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* The Enterprise Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F3F8FD]/80 dark:bg-[#072439] border-b border-[#ACB9D1]/40 dark:border-[#0e3554] text-[10px] font-bold text-[#717785] dark:text-[#94A3B8] uppercase tracking-wider">
              <th className="py-2.5 px-4" scope="col">
                Organization Name
              </th>
              <th className="py-2.5 px-3" scope="col">
                Type
              </th>
              <th className="py-2.5 px-3" scope="col">
                Status
              </th>
              <th className="py-2.5 px-3" scope="col">
                Created
              </th>
              <th className="py-2.5 px-4 text-right" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ACB9D1]/25 dark:divide-[#0e3554]/30 text-[11.5px]">
            {filteredOrgs.map((org) => {
              const avatarStyles =
                org.avatarColor === "saffron"
                  ? "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400"
                  : org.avatarColor === "violet"
                  ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
                  : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400";

              const statusStyles =
                org.status === "Active"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60"
                  : org.status === "Trial"
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/60"
                  : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800/60";

              return (
                <tr
                  key={org.id}
                  className="hover:bg-[#F3F8FD]/70 dark:hover:bg-[#072439]/50 transition-colors"
                >
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-[10.5px] flex-shrink-0 ${avatarStyles}`}
                      >
                        {org.avatarText}
                      </div>
                      <div>
                        <div className="font-bold text-[12px] text-[#010627] dark:text-[#F5F6F6]">
                          {org.name}
                        </div>
                        <div className="text-[10px] text-[#717785] dark:text-[#94A3B8] font-mono">
                          ID: {org.code} &bull; {org.nodes} Booth Nodes
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-[#010627] dark:text-[#F5F6F6]">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F3F8FD] dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8] border border-[#ACB9D1]/50 dark:border-[#0e3554]">
                      {org.type}
                    </span>
                  </td>

                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${statusStyles}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          org.status === "Active"
                            ? "bg-[#12CF94]"
                            : org.status === "Trial"
                            ? "bg-[#FC7C36]"
                            : "bg-[#7C3AED]"
                        }`}
                      />
                      <span>{org.status}</span>
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-[#717785] dark:text-[#94A3B8] font-medium font-mono text-[10.5px]">
                    {org.createdDate}
                  </td>

                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(org.name)}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-[#2087FE] dark:text-[#0D79FD] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleManageLicenses(org.name)}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-[#717785] dark:text-[#94A3B8] hover:text-[#010627] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                      <button
                        type="button"
                        onClick={() => toast(`Options for ${org.name}`, "info")}
                        className="p-1 rounded text-[#717785] dark:text-[#94A3B8] hover:text-[#010627] dark:hover:text-[#F5F6F6] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-2.5 px-4 bg-[#F3F8FD]/60 dark:bg-[#072439]/60 border-t border-[#ACB9D1]/40 dark:border-[#0e3554] flex items-center justify-between text-[11px] text-[#717785] dark:text-[#94A3B8]">
        <span>
          Showing <strong className="text-[#010627] dark:text-[#F5F6F6]">1 to {filteredOrgs.length}</strong> of 128 organizations
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1 rounded border border-[#ACB9D1] dark:border-[#0e3554] text-[#717785] dark:text-[#94A3B8] hover:text-[#010627] dark:hover:text-[#F5F6F6] hover:bg-white dark:hover:bg-[#062237] transition-all active:scale-95 cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 rounded bg-[#2087FE] dark:bg-[#0D79FD] text-white font-bold text-[10.5px] shadow-2xs">
            1
          </span>
          <button
            type="button"
            className="p-1 rounded border border-[#ACB9D1] dark:border-[#0e3554] text-[#717785] dark:text-[#94A3B8] hover:text-[#010627] dark:hover:text-[#F5F6F6] hover:bg-white dark:hover:bg-[#062237] transition-all active:scale-95 cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
