"use client";

import React, { useState } from "react";
import {
  Search,
  Phone,
  Download,
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

  const filtered = SAMPLE_BLOS.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.boothNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pollingStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);

    const matchStatus = statusFilter === "all" || b.verificationStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Government Administration
            </span>
            <Badge variant="teal">258 Verified BLOs</Badge>
            <Badge variant="warning">6 Vacancies Flagged</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Booth Level Officers (BLO) Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Official ECI government appointed Booth Level Officers cross-mapped to designated polling stations and SDM offices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() =>
              showToast(
                "success",
                "BLO Directory Exported",
                "Exported verified BLO list with mobile numbers to CSV.",
              )
            }
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export BLO Register</span>
          </Button>
        </div>
      </section>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by BLO name, booth #, station..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 pl-2.5 pr-6 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Vacant">Vacant Booths</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                <th className="py-3 px-4">Booth #</th>
                <th className="py-3 px-4">Designated Polling Station</th>
                <th className="py-3 px-4">Officer Name &amp; Dept</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">SDM Jurisdiction</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE2EC]/60 dark:divide-[#22324F]/60 text-slate-800 dark:text-white">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1E293B]/50 transition-colors">
                  <td className="py-3 px-4 font-bold font-mono text-brand-600">
                    {b.boothNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-white">{b.pollingStation}</div>
                    <div className="text-[11px] text-slate-500">{b.ward}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-white">{b.name}</div>
                    <div className="text-[11px] text-slate-500">{b.designation} &bull; {b.parentDepartment}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    {b.phone}
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-500">
                    {b.sdmJurisdiction}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        b.verificationStatus === "Verified"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {b.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {b.verificationStatus === "Verified" ? (
                      <button
                        type="button"
                        onClick={() =>
                          showToast("info", "Calling BLO", `Initiating phone call to ${b.name} (${b.phone}).`)
                        }
                        className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-brand-600"
                        title="Call BLO"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          showToast("warning", "Vacancy Escalated", `Flagged vacancy for Booth ${b.boothNumber} to SDM office.`)
                        }
                        className="px-2 py-1 rounded bg-amber-50 text-amber-600 font-semibold text-[11px] hover:bg-[#F2A93B] hover:text-white"
                      >
                        Escalate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
