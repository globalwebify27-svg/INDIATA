"use client";

import React, { useState, useMemo } from "react";
import {
  Printer,
  Share2,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Eye,
} from "lucide-react";
import { useKaryakartaAuth } from "../../../karyakarta/context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../../karyakarta/context/karyakarta-language-context";
import { MOCK_SLIPS, MOCK_VOTERS } from "../../../karyakarta/data/mock-karyakarta-data";
import { VoterSlipRecord, VoterRecord } from "../../../karyakarta/types/karyakarta.types";
import { VoterSlipPreviewModal } from "../../../karyakarta/components/slips/voter-slip-preview-modal";

export default function SlipHistoryPage() {
  const { user } = useKaryakartaAuth();
  const { t } = useKaryakartaLanguage();

  const [slips, setSlips] = useState<VoterSlipRecord[]>(MOCK_SLIPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<"ALL" | "PRINTED" | "DIGITAL_WHATSAPP">("ALL");
  const [selectedBooth, setSelectedBooth] = useState<string>("ALL");
  const [selectedVoterForSlip, setSelectedVoterForSlip] = useState<VoterRecord | null>(null);

  // Scoped slips based on assigned booths
  const scopedSlips = useMemo(() => {
    return slips.filter((s) => {
      if (!user?.assignedBooths?.length) return true;
      return user.assignedBooths.includes(s.boothNumber);
    });
  }, [slips, user]);

  // Filtered slips
  const filteredSlips = useMemo(() => {
    return scopedSlips.filter((s) => {
      if (methodFilter !== "ALL" && s.deliveryMethod !== methodFilter) return false;
      if (selectedBooth !== "ALL" && s.boothNumber !== selectedBooth) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mSlip = s.slipNumber.toLowerCase().includes(q);
        const mVoter = s.voterName.toLowerCase().includes(q);
        const mEpic = s.epicId.toLowerCase().includes(q);
        if (!mSlip && !mVoter && !mEpic) return false;
      }
      return true;
    });
  }, [scopedSlips, methodFilter, selectedBooth, searchQuery]);

  // KPI Metrics
  const totalCount = scopedSlips.length;
  const printedCount = scopedSlips.filter((s) => s.deliveryMethod === "PRINTED").length;
  const whatsappCount = scopedSlips.filter((s) => s.deliveryMethod === "DIGITAL_WHATSAPP").length;

  const handleOpenSlipModal = (slip: VoterSlipRecord) => {
    // Find voter from mock voters
    const voter = MOCK_VOTERS.find((v: VoterRecord) => v.id === slip.voterId || v.epicId === slip.epicId);
    if (voter) {
      setSelectedVoterForSlip(voter);
    } else {
      // Create fallback voter record from slip details
      setSelectedVoterForSlip({
        id: slip.voterId,
        epicId: slip.epicId,
        name: slip.voterName,
        marathiName: "",
        relativeName: "S. Rao",
        relation: "S/o",
        age: 45,
        gender: "M",
        dob: "1980-01-01",
        houseNo: "Plot 14",
        address: "Shaniwar Peth, Pune",
        village: "Pune City",
        ward: "Ward 12",
        prabhaag: "Prabhaag 18",
        electoralPart: "Part 42",
        boothNumber: slip.boothNumber,
        boothName: "Navbharat High School",
        phone: "+91 98221 00000",
        hasPhoto: true,
        caste: "General",
        occupation: "Business",
        qualification: "Graduate",
        scheme: "",
        demand: "",
        candidateHelp: "",
        extraInfo: "",
        remarks: "",
        classification: "Supporter",
        isImportant: false,
        isFavourite: false,
        isVisited: true,
        isVoted: false,
        isOutside: false,
        isDeceased: false,
        lastVisitDate: null,
        lastUpdated: "Today",
        assignedKaryakartaId: "KAR-01",
        familyId: "fam-01",
        familyHead: false,
        familyMembersCount: 1,
        serialNumber: 42,
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ["Slip Number", "Voter Name", "EPIC ID", "Booth", "Delivery Method", "Status", "Timestamp"];
    const rows = filteredSlips.map((s) => [
      s.slipNumber,
      `"${s.voterName}"`,
      s.epicId,
      s.boothNumber,
      s.deliveryMethod,
      s.status,
      `"${s.timestamp}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `voter_slip_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              ECI Voter Slip Registry
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Candidate: {user?.candidateName || "Anand Shinde"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Printer className="w-6 h-6 text-[#2087fe]" />
            {t("slips.title", "Voter Slip Dispatch & Print History")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit log of official thermal printed voter slips and digital WhatsApp dispatch receipts across assigned booths.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Slip Register
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Total Slips Issued</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Thermal Physical Printed</div>
          <div className="text-2xl font-black text-[#2087fe]">{printedCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Digital WhatsApp Shared</div>
          <div className="text-2xl font-black text-emerald-600">{whatsappCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Dispatch Success Rate</div>
          <div className="text-2xl font-black text-emerald-600">100%</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search slip #, voter name, or EPIC..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Method Filter */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMethodFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                methodFilter === "ALL"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setMethodFilter("PRINTED")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                methodFilter === "PRINTED"
                  ? "bg-white dark:bg-slate-700 text-[#2087fe] shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              Printed
            </button>
            <button
              onClick={() => setMethodFilter("DIGITAL_WHATSAPP")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                methodFilter === "DIGITAL_WHATSAPP"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </button>
          </div>

          {/* Booth Filter */}
          <select
            value={selectedBooth}
            onChange={(e) => setSelectedBooth(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Booths</option>
            {user?.assignedBooths?.map((b) => (
              <option key={b} value={b}>
                Booth {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Slip Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Slip Reference</th>
                <th className="py-3 px-4">Voter Details</th>
                <th className="py-3 px-4">Booth</th>
                <th className="py-3 px-4">Delivery Channel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dispatched At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSlips.map((slip) => {
                const isPrinted = slip.deliveryMethod === "PRINTED";
                return (
                  <tr
                    key={slip.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {slip.slipNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {slip.voterName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {slip.epicId}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {slip.boothNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isPrinted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
                          <Printer className="w-3 h-3" />
                          Thermal (80mm)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
                          <Share2 className="w-3 h-3" />
                          Digital WhatsApp
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Delivered
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {slip.timestamp}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenSlipModal(slip)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Re-issue Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Modal */}
      {selectedVoterForSlip && (
        <VoterSlipPreviewModal
          isOpen={!!selectedVoterForSlip}
          voter={selectedVoterForSlip}
          onClose={() => setSelectedVoterForSlip(null)}
          onSlipDispatched={(method) => {
            const newRecord: VoterSlipRecord = {
              id: `slp-${Date.now().toString().slice(-4)}`,
              slipNumber: `SLP-${selectedVoterForSlip.boothNumber.replace("#", "")}-${Math.floor(1000 + Math.random() * 9000)}`,
              voterId: selectedVoterForSlip.id,
              voterName: selectedVoterForSlip.name,
              epicId: selectedVoterForSlip.epicId,
              boothNumber: selectedVoterForSlip.boothNumber,
              karyakartaId: user?.id || "KAR-01",
              deliveryMethod: method,
              status: method === "PRINTED" ? "PRINT_SUCCESS" : "DELIVERED",
              timestamp: "Just now",
              location: "18.5204, 73.8567",
            };
            setSlips((prev) => [newRecord, ...prev]);
          }}
        />
      )}
    </div>
  );
}
