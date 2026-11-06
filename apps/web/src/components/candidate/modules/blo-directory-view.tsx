"use client";

import React, { useState } from "react";
import {
  Search,
  Phone,
  MessageSquare,
  Download,
  Plus,
  Shield,
  LayoutList,
  LayoutGrid,
  X,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BloRecord {
  id: string;
  name: string;
  phone: string;
  boothNumber: string;
  pollingStation: string;
  ward: string;
  designation: string;
  parentDepartment: string;
  verificationStatus: "Verified" | "Contact Unverified" | "Vacant";
  sdmJurisdiction: string;
}

const SAMPLE_BLOS: BloRecord[] = [
  {
    id: "blo-101",
    name: "Sanjay K. Kulkarni",
    phone: "+91 98220 11234",
    boothNumber: "#101",
    pollingStation: "Navbharat High School, Room 1",
    ward: "Ward 12",
    designation: "Head Clerk",
    parentDepartment: "Revenue Dept, Pune Tehsil",
    verificationStatus: "Verified",
    sdmJurisdiction: "SDM Pune City Division 2",
  },
  {
    id: "blo-102",
    name: "Asha V. More",
    phone: "+91 98220 54321",
    boothNumber: "#102",
    pollingStation: "Navbharat High School, Room 2",
    ward: "Ward 12",
    designation: "Primary Teacher",
    parentDepartment: "Zilla Parishad Education Board",
    verificationStatus: "Verified",
    sdmJurisdiction: "SDM Pune City Division 2",
  },
  {
    id: "blo-106",
    name: "Nitin B. Jagtap",
    phone: "+91 98505 44321",
    boothNumber: "#106",
    pollingStation: "Modern High School, Wing A",
    ward: "Ward 9",
    designation: "Junior Engineer",
    parentDepartment: "Public Works Department",
    verificationStatus: "Verified",
    sdmJurisdiction: "SDM Pune City Division 1",
  },
  {
    id: "blo-107",
    name: "Madhavi R. Joshi",
    phone: "+91 98231 77654",
    boothNumber: "#107",
    pollingStation: "Ferguson Junior College Library",
    ward: "Ward 14",
    designation: "Assistant Teacher",
    parentDepartment: "Municipal School Board",
    verificationStatus: "Verified",
    sdmJurisdiction: "SDM Pune City Division 2",
  },
  {
    id: "blo-108",
    name: "Position Currently Vacant",
    phone: "Pending Assignment",
    boothNumber: "#108",
    pollingStation: "Gokhale Memorial Community Hall",
    ward: "Ward 14",
    designation: "Pending ECI Appointment",
    parentDepartment: "District Election Office",
    verificationStatus: "Vacant",
    sdmJurisdiction: "SDM Pune City Division 2",
  },
];

export function BloDirectoryView() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [blos, setBlos] = useState<BloRecord[]>(SAMPLE_BLOS);
  const [showAddBloModal, setShowAddBloModal] = useState(false);

  // Add BLO Form State
  const [newBloName, setNewBloName] = useState("");
  const [newBloPhone, setNewBloPhone] = useState("");
  const [newBloBooth, setNewBloBooth] = useState("#109");
  const [newBloStation, setNewBloStation] = useState("Navbharat High School");
  const [newBloWard, setNewBloWard] = useState("Ward 12");
  const [newBloDesignation, setNewBloDesignation] = useState("Primary Teacher");
  const [newBloDepartment, setNewBloDepartment] = useState("Education Department");
  const [newBloSdm, setNewBloSdm] = useState("SDM Pune City Division 2");

  const filtered = blos.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.boothNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pollingStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);

    const matchStatus = statusFilter === "all" || b.verificationStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = () => {
    showToast(
      "success",
      "BLO Directory Exported",
      `Exported ${filtered.length} Booth Level Officers to Excel format.`
    );
  };

  const handleCreateBlo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBloName.trim()) return;

    const newRecord: BloRecord = {
      id: `blo-${Date.now()}`,
      name: newBloName.trim(),
      phone: newBloPhone.trim() || "+91 98220 00000",
      boothNumber: newBloBooth,
      pollingStation: newBloStation,
      ward: newBloWard,
      designation: newBloDesignation,
      parentDepartment: newBloDepartment,
      verificationStatus: "Verified",
      sdmJurisdiction: newBloSdm,
    };

    setBlos((prev) => [newRecord, ...prev]);
    setShowAddBloModal(false);
    setNewBloName("");
    setNewBloPhone("");

    showToast(
      "success",
      "BLO Record Saved",
      `Booth Level Officer ${newRecord.name} mapped to ${newRecord.boothNumber}.`
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 15: Election Commission Liaisons
            </span>
            <Badge variant="teal">264 Polling Stations Mapped</Badge>
            <Badge variant="neutral">SDM City Division</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Booth Level Officer (BLO) Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Directory of government BLOs appointed across all polling booths with designation, parent department, and phone outreach.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            <span>Export BLO Roster</span>
          </Button>

          <Button variant="primary" size="md" onClick={() => setShowAddBloModal(true)}>
            <Plus className="w-3.5 h-3.5" />
            <span>Add / Update BLO</span>
          </Button>
        </div>
      </section>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search officer name, booth #, polling station, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === "table" ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs" : "text-slate-500"
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === "cards" ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs" : "text-slate-500"
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 pl-2.5 pr-7 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="Verified">Verified Contact</option>
            <option value="Vacant">Vacant Booth</option>
          </select>
        </div>
      </div>

      {/* Directory Table / Cards View */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Booth Station</th>
                  <th className="py-3 px-4">Officer Name &amp; Contact</th>
                  <th className="py-3 px-4">Designation &amp; Department</th>
                  <th className="py-3 px-3">SDM Jurisdiction</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Direct Outreach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <span className="font-mono text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                          {b.boothNumber}
                        </span>
                        <span>{b.pollingStation}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{b.ward}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-white">{b.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{b.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{b.designation}</div>
                      <div className="text-[11px] text-slate-400">{b.parentDepartment}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {b.sdmJurisdiction}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.verificationStatus === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {b.verificationStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {b.verificationStatus === "Verified" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showToast("info", `Dialing ${b.name}`, `Calling ${b.phone}`)}
                            className="text-brand-600"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => showToast("success", "WhatsApp Chat Opened", `Opening chat with ${b.name}`)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Vacant Position</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    {b.boothNumber}
                  </span>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white mt-1.5">
                    {b.pollingStation}
                  </h3>
                  <div className="text-xs text-slate-500">{b.ward}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  b.verificationStatus === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}>
                  {b.verificationStatus}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-slate-800 dark:text-white">{b.name}</div>
                <div className="font-mono text-slate-500">{b.phone}</div>
                <div className="text-[11px] text-slate-400">{b.designation} • {b.parentDepartment}</div>
              </div>

              {b.verificationStatus === "Verified" && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast("info", `Dialing ${b.name}`, `Calling ${b.phone}`)}
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => showToast("success", "WhatsApp Opened", `Opening chat with ${b.name}`)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ADD / UPDATE BLO MODAL */}
      {showAddBloModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-600" />
                  <span>Map Booth Level Officer (BLO)</span>
                </h3>
                <p className="text-xs text-slate-500">Record appointed government BLO for polling station coordination.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBloModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBlo} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Officer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newBloName}
                  onChange={(e) => setNewBloName(e.target.value)}
                  placeholder="e.g. Ramesh V. Joshi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Contact *</label>
                <input
                  type="tel"
                  required
                  value={newBloPhone}
                  onChange={(e) => setNewBloPhone(e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Booth Number *</label>
                  <input
                    type="text"
                    value={newBloBooth}
                    onChange={(e) => setNewBloBooth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ward *</label>
                  <input
                    type="text"
                    value={newBloWard}
                    onChange={(e) => setNewBloWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Polling Station Name *</label>
                <input
                  type="text"
                  value={newBloStation}
                  onChange={(e) => setNewBloStation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newBloDesignation}
                    onChange={(e) => setNewBloDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={newBloDepartment}
                    onChange={(e) => setNewBloDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">SDM Jurisdiction</label>
                <input
                  type="text"
                  value={newBloSdm}
                  onChange={(e) => setNewBloSdm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddBloModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Officer Mapping
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
