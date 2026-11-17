"use client";

import React, { useState } from "react";
import { Search, Download, Eye, X } from "lucide-react";
import { useToast } from "@/context/toast-context";

export interface AuditEventRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  module: string;
  action: string;
  relatedRecord: string;
  ipAddress: string;
  device: string;
  outcome: "SUCCESS" | "FAILED" | "WARNING";
  details: string;
}

export const SEED_AUDIT_LOGS: AuditEventRecord[] = [
  {
    id: "aud-1092",
    timestamp: "2024-04-18 10:42:15",
    actor: "Adv. Vikram Patil (Candidate)",
    role: "CANDIDATE_ADMIN",
    module: "Total Voters",
    action: "EXPORT_VOTER_LIST_CSV",
    relatedRecord: "Booth #101 (Navbharat High School)",
    ipAddress: "192.168.1.105 (Pune)",
    device: "Chrome / Windows 11",
    outcome: "SUCCESS",
    details: "Exported CSV containing 1,142 verified voter records for field printing.",
  },
  {
    id: "aud-1091",
    timestamp: "2024-04-18 10:20:00",
    actor: "Sachin Babar (Prabhaag Incharge)",
    role: "PRABHAAG_INCHARGE",
    module: "Office & Issues",
    action: "CREATE_OFFICE_TICKET",
    relatedRecord: "Ticket #TKT-9210 (Water Supply)",
    ipAddress: "114.143.120.45 (Pune Mobile)",
    device: "Mobile Safari / iOS 17",
    outcome: "SUCCESS",
    details: "Logged priority citizen grievance regarding municipal pipeline pressure.",
  },
  {
    id: "aud-1090",
    timestamp: "2024-04-18 09:12:44",
    actor: "Dr. Sameer Deshpande (War Room Head)",
    role: "WAR_ROOM_HEAD",
    module: "Campaign Control",
    action: "DISPATCH_CAMPAIGN_BROADCAST",
    relatedRecord: "CMP-01 (Voter Slip Broadcast)",
    ipAddress: "192.168.1.120 (War Room Server)",
    device: "Firefox / Ubuntu 22.04",
    outcome: "SUCCESS",
    details: "Initiated 4,500 WhatsApp message dispatches with dynamic slip payload.",
  },
  {
    id: "aud-1089",
    timestamp: "2024-04-18 08:35:10",
    actor: "Ganesh Patil",
    role: "KARYAKARTA",
    module: "Users & Karyakarta",
    action: "SUBMIT_UPDATE_REQUEST",
    relatedRecord: "User ID #kar-102",
    ipAddress: "157.34.89.210 (Jio 5G)",
    device: "Android App / Chrome Mobile",
    outcome: "SUCCESS",
    details: "Submitted request to update primary mobile number.",
  },
  {
    id: "aud-1088",
    timestamp: "2024-04-17 19:40:02",
    actor: "Pooja Jadhav",
    role: "KARYAKARTA",
    module: "Live Field Map",
    action: "LOG_SURVEY_LOCATION",
    relatedRecord: "Voter #MH34089211",
    ipAddress: "106.213.14.77 (Airtel 4G)",
    device: "Indata Karyakarta App",
    outcome: "SUCCESS",
    details: "Survey location marked at Ideal Colony coordinates.",
  },
  {
    id: "aud-1087",
    timestamp: "2024-04-17 17:15:33",
    actor: "Mahesh Thorat",
    role: "DATA_OPERATOR",
    module: "Total Voters",
    action: "BULK_DELETE_ATTEMPT",
    relatedRecord: "Booth #108 Roll",
    ipAddress: "192.168.1.189",
    device: "Chrome / Windows 10",
    outcome: "FAILED",
    details: "Unauthorized bulk deletion rejected by role policy. Alert flagged to Super Admin.",
  },
];

export function UserActivitiesAuditView() {
  const { showToast } = useToast();
  const [logs] = useState<AuditEventRecord[]>(SEED_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<AuditEventRecord | null>(null);

  const filteredLogs = logs.filter((item) => {
    const matchesSearch =
      item.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relatedRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = moduleFilter === "ALL" || item.module === moduleFilter;
    const matchesOutcome = outcomeFilter === "ALL" || item.outcome === outcomeFilter;

    return matchesSearch && matchesModule && matchesOutcome;
  });

  const handleExportCsv = () => {
    const headers = [
      "Event ID",
      "Timestamp",
      "Actor",
      "Role",
      "Module",
      "Action",
      "Related Record",
      "IP",
      "Outcome",
      "Details",
    ];

    const rows = filteredLogs.map((e) => [
      e.id,
      e.timestamp,
      `"${e.actor}"`,
      e.role,
      e.module,
      e.action,
      `"${e.relatedRecord}"`,
      e.ipAddress,
      e.outcome,
      `"${e.details}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Indata_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("success", "Export Complete", `Exported ${filteredLogs.length} audit log events to CSV.`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* HEADER CARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Compliance & Security
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
              Sample Audit Events
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            User Activities & Security Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger tracking voter lookups, CSV downloads, ticket assignments, and administrative actions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail CSV</span>
        </button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, IP, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Modules</option>
            <option value="Total Voters">Total Voters</option>
            <option value="Office & Issues">Office & Issues</option>
            <option value="Campaign Control">Campaign Control</option>
            <option value="Users & Karyakarta">Users & Karyakarta</option>
            <option value="Live Field Map">Live Field Map</option>
          </select>
        </div>

        <div className="w-full md:w-44">
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed / Blocked</option>
            <option value="WARNING">Warning</option>
          </select>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User / Actor</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action / Event</th>
                <th className="py-3 px-4">Related Record</th>
                <th className="py-3 px-4">IP & Device</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{item.actor}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      {item.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                      {item.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                    {item.action}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                    {item.relatedRecord}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                    <span className="block font-mono">{item.ipAddress}</span>
                    <span className="text-[10px] text-slate-400">{item.device}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.outcome === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.outcome === "FAILED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(item)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Inspect Event Payload"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No audit trail events match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVENT INSPECTOR MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {selectedEvent.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Security Audit Event Record
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Actor:</span>
                  <span className="font-bold text-slate-900">{selectedEvent.actor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Timestamp:</span>
                  <span className="font-mono text-slate-800">{selectedEvent.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Module:</span>
                  <span className="font-bold text-blue-700">{selectedEvent.module}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Outcome:</span>
                  <span
                    className={`font-bold ${
                      selectedEvent.outcome === "SUCCESS"
                        ? "text-emerald-700"
                        : selectedEvent.outcome === "FAILED"
                        ? "text-rose-700"
                        : "text-amber-700"
                    }`}
                  >
                    {selectedEvent.outcome}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">
                  Action Identifier:
                </span>
                <p className="font-mono bg-slate-100 p-2 rounded-lg text-slate-800">
                  {selectedEvent.action}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">
                  Related Record Context:
                </span>
                <p className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  {selectedEvent.relatedRecord}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">
                  Payload Audit Details:
                </span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                  {selectedEvent.details}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>
                  Client Signature: {selectedEvent.ipAddress} • {selectedEvent.device}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
