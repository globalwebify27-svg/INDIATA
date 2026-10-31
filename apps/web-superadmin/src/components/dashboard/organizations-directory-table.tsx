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
    avatarColor: "saffron",
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
    <section className="bg-[#FDFEFE] dark:bg-[#201A15] rounded-xl border border-[#ACB9D1] dark:border-[#352B22] shadow-2xs overflow-hidden">
      {/* Table Header & Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#ACB9D1] dark:border-[#352B22] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#010627] dark:text-[#F7EFE9]">
            Registered Organizations &amp; Campaign War Rooms
          </h2>
          <p className="text-xs text-[#717785] dark:text-[#DBC2B0] mt-0.5">
            Directory of candidate campaign secretariats, party war rooms, and civic units.
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search field */}
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by name..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-[#ACB9D1] dark:border-[#352B22] text-xs bg-[#F3F8FD] dark:bg-[#2B241E] text-[#010627] dark:text-[#F7EFE9] placeholder:text-[#717785] focus:outline-none focus:border-[#2087FE] focus:ring-1 focus:ring-[#2087FE] w-40 sm:w-44 transition-colors"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#717785] pointer-events-none" />
          </div>

          {/* Org Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1.5 pl-2.5 pr-7 rounded-lg border border-[#ACB9D1] dark:border-[#352B22] text-xs bg-[#FDFEFE] dark:bg-[#201A15] text-[#010627] dark:text-[#F7EFE9] focus:outline-none focus:border-[#2087FE] cursor-pointer"
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
            className="py-1.5 pl-2.5 pr-7 rounded-lg border border-[#ACB9D1] dark:border-[#352B22] text-xs bg-[#FDFEFE] dark:bg-[#201A15] text-[#010627] dark:text-[#F7EFE9] focus:outline-none focus:border-[#2087FE] cursor-pointer"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ACB9D1] dark:border-[#352B22] bg-[#FDFEFE] dark:bg-[#201A15] hover:bg-[#E0EDFE] dark:hover:bg-[#2B241E] text-[#010627] dark:text-[#F7EFE9] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#717785]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* The Enterprise Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F3F8FD] dark:bg-[#251E18] border-b border-[#ACB9D1] dark:border-[#352B22] text-[11px] font-bold text-[#717785] dark:text-[#DBC2B0] uppercase tracking-wider">
              <th className="py-3 px-5" scope="col">
                Organization Name
              </th>
              <th className="py-3 px-4" scope="col">
                Organization Type
              </th>
              <th className="py-3 px-4" scope="col">
                Subscription Status
              </th>
              <th className="py-3 px-4" scope="col">
                Created Date
              </th>
              <th className="py-3 px-4 text-right" scope="col">
                Available Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ACB9D1]/40 dark:divide-[#352B22] text-xs">
            {filteredOrgs.map((org) => {
              const avatarStyles =
                org.avatarColor === "saffron"
                  ? "bg-[#E0EDFE] dark:bg-[#6E3900] text-[#2087FE] dark:text-[#FFB77D]"
                  : org.avatarColor === "violet"
                  ? "bg-[#E0EDFE] dark:bg-[#3D0089] text-[#2087FE] dark:text-[#D2BBFF]"
                  : "bg-[#B3EDD7] dark:bg-[#005323] text-[#12CF94] dark:text-[#92F5A4]";

              const statusStyles =
                org.status === "Active"
                  ? "bg-[#B3EDD7] dark:bg-[#005323]/50 text-[#010627] dark:text-[#92F5A4] border-[#12CF94]/40 dark:border-[#005323]"
                  : org.status === "Trial"
                  ? "bg-[#FC7C36]/15 dark:bg-[#6E3900] text-[#FC7C36] dark:text-[#FFDCC3] border-[#FC7C36]/30"
                  : "bg-[#F3F8FD] dark:bg-[#2B241E] text-[#717785] dark:text-[#DBC2B0] border-[#ACB9D1]";

              return (
                <tr
                  key={org.id}
                  className="hover:bg-[#E0EDFE]/40 dark:hover:bg-[#251E18]/60 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg font-bold flex items-center justify-center text-xs flex-shrink-0 ${avatarStyles}`}
                      >
                        {org.avatarText}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#010627] dark:text-[#F7EFE9]">
                          {org.name}
                        </div>
                        <div className="text-[11px] text-[#717785] dark:text-[#A8988C] font-mono mt-0.5">
                          ID: {org.code} &bull; {org.nodes} Booth Nodes
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#010627] dark:text-[#F7EFE9]">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F3F8FD] dark:bg-[#2B241E] text-[#717785] dark:text-[#DBC2B0] border border-[#ACB9D1] dark:border-[#352B22]">
                      {org.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusStyles}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          org.status === "Active"
                            ? "bg-[#12CF94]"
                            : org.status === "Trial"
                            ? "bg-[#FC7C36]"
                            : "bg-[#717785]"
                        }`}
                      />
                      <span>{org.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#717785] dark:text-[#DBC2B0] font-medium font-mono text-[11px]">
                    {org.createdDate}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(org.name)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#2087FE] dark:text-[#FFB77D] hover:bg-[#E0EDFE] dark:hover:bg-[#2B241E] transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleManageLicenses(org.name)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#717785] dark:text-[#DBC2B0] hover:bg-[#E0EDFE] dark:hover:bg-[#2B241E] transition-colors cursor-pointer"
                      >
                        Manage Licenses
                      </button>
                      <button
                        type="button"
                        onClick={() => toast(`Options for ${org.name}`, "info")}
                        className="p-1 rounded text-[#717785] hover:text-[#010627] hover:bg-[#E0EDFE] dark:hover:bg-[#2B241E] transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
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
      <div className="p-3.5 px-5 bg-[#F3F8FD]/60 dark:bg-[#251E18]/60 border-t border-[#ACB9D1] dark:border-[#352B22] flex items-center justify-between text-xs text-[#717785] dark:text-[#DBC2B0]">
        <span>
          Showing <strong className="text-[#010627] dark:text-[#F7EFE9]">1 to {filteredOrgs.length}</strong> of 128 organizations
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="p-1.5 rounded-md border border-[#ACB9D1] dark:border-[#352B22] text-[#717785] hover:text-[#010627] hover:bg-[#FDFEFE] dark:hover:bg-[#201A15] transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2.5 py-0.5 rounded bg-[#2087FE] text-white font-bold text-xs">
            1
          </span>
          <button
            type="button"
            className="p-1.5 rounded-md border border-[#ACB9D1] dark:border-[#352B22] text-[#717785] hover:text-[#010627] hover:bg-[#FDFEFE] dark:hover:bg-[#201A15] transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
