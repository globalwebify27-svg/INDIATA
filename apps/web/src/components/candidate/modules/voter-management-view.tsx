"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Upload,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VoterRecord {
  id: string;
  epicId: string;
  name: string;
  relativeName: string;
  relation: "S/o" | "D/o" | "W/o";
  age: number;
  gender: "M" | "F" | "Other";
  houseNo: string;
  ward: string;
  boothNumber: string;
  boothName: string;
  status: "Verified" | "Correction Req" | "Quarantined";
  phone: string;
  hasPhoto: boolean;
}

const SAMPLE_VOTERS: VoterRecord[] = [
  {
    id: "v-01",
    epicId: "WXE4829102",
    name: "Rajesh Kumar Verma",
    relativeName: "Ramesh Verma",
    relation: "S/o",
    age: 42,
    gender: "M",
    houseNo: "Plot 14, Lane 3",
    ward: "Ward 12",
    boothNumber: "#101",
    boothName: "Navbharat High School",
    status: "Verified",
    phone: "+91 98221 44001",
    hasPhoto: true,
  },
  {
    id: "v-02",
    epicId: "WXE9821443",
    name: "Sunita Rajesh Verma",
    relativeName: "Rajesh Verma",
    relation: "W/o",
    age: 38,
    gender: "F",
    houseNo: "Plot 14, Lane 3",
    ward: "Ward 12",
    boothNumber: "#101",
    boothName: "Navbharat High School",
    status: "Verified",
    phone: "+91 98221 44002",
    hasPhoto: true,
  },
  {
    id: "v-03",
    epicId: "WXE3109244",
    name: "Pooja Santosh Deshmukh",
    relativeName: "Santosh Deshmukh",
    relation: "D/o",
    age: 21,
    gender: "F",
    houseNo: "Flat 402, Shiv Plaza",
    ward: "Ward 14",
    boothNumber: "#107",
    boothName: "Ferguson Junior College",
    status: "Verified",
    phone: "+91 97654 32110",
    hasPhoto: true,
  },
  {
    id: "v-04",
    epicId: "WXE1290384",
    name: "Amit Baban Shinde",
    relativeName: "Baban Shinde",
    relation: "S/o",
    age: 29,
    gender: "M",
    houseNo: "House 88, Gaothan",
    ward: "Ward 9",
    boothNumber: "#106",
    boothName: "Modern High School",
    status: "Correction Req",
    phone: "+91 98900 12345",
    hasPhoto: false,
  },
  {
    id: "v-05",
    epicId: "WXE7765109",
    name: "Kavita Ashok Patil",
    relativeName: "Ashok Patil",
    relation: "W/o",
    age: 54,
    gender: "F",
    houseNo: "Bldg 3, Erandwane",
    ward: "Ward 14",
    boothNumber: "#108",
    boothName: "Gokhale Memorial Hall",
    status: "Verified",
    phone: "+91 98230 99887",
    hasPhoto: true,
  },
  {
    id: "v-06",
    epicId: "WXE5544321",
    name: "Surendra Mohan Joshi",
    relativeName: "Mohan Joshi",
    relation: "S/o",
    age: 67,
    gender: "M",
    houseNo: "Bungalow 7, Deccan",
    ward: "Ward 14",
    boothNumber: "#108",
    boothName: "Gokhale Memorial Hall",
    status: "Quarantined",
    phone: "+91 99221 00998",
    hasPhoto: true,
  },
];

export function VoterManagementView() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"roll" | "requests" | "phonebook">("roll");

  const filteredVoters = SAMPLE_VOTERS.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.epicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.boothNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm);

    const matchesGender =
      genderFilter === "all" || v.gender === genderFilter;

    const matchesStatus =
      statusFilter === "all" || v.status === statusFilter;

    return matchesSearch && matchesGender && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVoters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVoters.map((v) => v.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    showToast(
      "success",
      "Voter Roll Export Initiated",
      `Exporting ${filteredVoters.length} elector records to CSV / Excel format.`,
    );
  };

  const handleQueueBroadcast = () => {
    if (selectedIds.length === 0) {
      showToast("warning", "No Electors Selected", "Please select at least one elector to dispatch voter slips.");
      return;
    }
    showToast(
      "info",
      "Campaign Queue Updated",
      `${selectedIds.length} electors queued for WhatsApp Voter Slip broadcast.`,
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Header Bar */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Voter Intelligence Roll
            </span>
            <Badge variant="teal">248,650 Electors Mapped</Badge>
            <Badge variant="neutral">ECI Draft Roll #4029</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Electoral Roll &amp; Constituent Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Search-first master voter registry with EPIC cross-indexing, booth mapping, and family linkages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="md" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            <span>Export Roll</span>
          </Button>

          <Button variant="outline" size="md">
            <Upload className="w-3.5 h-3.5" />
            <span>Import ECI Roll</span>
          </Button>

          <Button variant="primary" size="md">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Constituent</span>
          </Button>
        </div>
      </section>

      {/* Search & Advanced Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by voter name, EPIC ID, booth number, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Quick Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Gender filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="py-1.5 pl-2.5 pr-7 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
              <option value="Other">Third Gender</option>
            </select>

            {/* Verification Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 pl-2.5 pr-7 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Correction Req">Correction Pending</option>
              <option value="Quarantined">Quarantined Form</option>
            </select>

            {/* Action on selected */}
            {selectedIds.length > 0 && (
              <Button variant="secondary" size="sm" onClick={handleQueueBroadcast}>
                <Send className="w-3 h-3" />
                <span>Broadcast Slips ({selectedIds.length})</span>
              </Button>
            )}
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("roll")}
              className={`pb-1 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "roll"
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Master Roll View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("requests")}
              className={`pb-1 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "requests"
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Pending Form 6/7/8 Requests (14)
            </button>
          </div>

          <span className="text-slate-500 text-[11px]">
            Showing <strong>{filteredVoters.length}</strong> of 248,650 registered electors
          </span>
        </div>
      </div>

      {/* Master Electoral Roll Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredVoters.length &&
                      filteredVoters.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-200 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Elector Name &amp; Relative</th>
                <th className="py-3 px-4">EPIC ID</th>
                <th className="py-3 px-3">Age / Sex</th>
                <th className="py-3 px-4">Booth Station &amp; Ward</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE2EC]/60 dark:divide-[#22324F]/60 text-slate-800 dark:text-white">
              {filteredVoters.map((voter) => {
                const isSelected = selectedIds.includes(voter.id);
                return (
                  <tr
                    key={voter.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-brand-50/50 dark:bg-[#1E1B4B]/30"
                        : "hover:bg-slate-50/70 dark:hover:bg-[#1E293B]/50"
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(voter.id)}
                        className="rounded border-slate-200 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <span>{voter.name}</span>
                        {voter.hasPhoto && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[#0DAD9B]"
                            title="Verified ECI Portrait"
                          />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {voter.relation} {voter.relativeName} &bull; {voter.houseNo}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-[11px]">
                        {voter.epicId}
                      </span>
                    </td>
                    <td className="py-3 px-3 tabular-nums font-medium">
                      {voter.age} Yrs &bull; {voter.gender}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{voter.boothNumber} - {voter.boothName}</div>
                      <div className="text-[11px] text-slate-500">{voter.ward}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {voter.phone}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          voter.status === "Verified"
                            ? "bg-emerald-50 text-emerald-600 border border-[#0DAD9B]/20"
                            : voter.status === "Correction Req"
                            ? "bg-amber-50 text-amber-600 border border-[#F2A93B]/20"
                            : "bg-rose-50 text-rose-600 border border-[#E06068]/20"
                        }`}
                      >
                        {voter.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              "info",
                              "Constituent Dossier",
                              `Opening comprehensive record for ${voter.name} (${voter.epicId}).`,
                            )
                          }
                          className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-brand-50 text-brand-600 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong>1 to 6</strong> of <strong>248,650</strong> entries
          </div>

          <div className="flex items-center gap-1 self-end sm:self-center">
            <button
              type="button"
              disabled
              className="p-1.5 rounded-md border border-slate-200 text-slate-400 opacity-50 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md bg-brand-600 text-white font-bold"
            >
              1
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium"
            >
              2
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium"
            >
              3
            </button>
            <span className="px-2">...</span>
            <button
              type="button"
              className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium"
            >
              41,442
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
