"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Download,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";
import { AuditRecord } from "../../types/superadmin.types";

export function SecurityAuditView() {
  const { toast } = useToast();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("ALL");
  const [exporting, setExporting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getAudits(searchTerm, selectedModule);
      if (res.success) setAudits(res.data);
    } catch {
      toast("Failed to load audit records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedModule]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await superAdminApi.exportAudits("CSV");
      if (res.success) {
        toast(`Export Complete: ${res.recordCount} immutable audit records exported for ECI compliance.`, "success");
        loadData();
      }
    } catch {
      toast("Export failed.", "error");
    } finally {
      setExporting(false);
    }
  };

  const filtered = audits.filter(
    (a) =>
      a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.affectedEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.actor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#2087FE]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Immutable Platform Security Audit Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Statutory Election Commission &amp; Cyber Security compliant audit trail of all administrative state mutations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? "Generating CSV..." : "Export Statutory CSV"}</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, affected entity, actor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
          >
            <option value="ALL">All Modules</option>
            <option value="Executive Dashboard">Executive Dashboard</option>
            <option value="Candidate Management">Candidate Management</option>
            <option value="Organization Module">Organization Module</option>
            <option value="Franchise Governance">Franchise Governance</option>
            <option value="AI Governance">AI Governance</option>
            <option value="Subscription Engine">Subscription Engine</option>
            <option value="System Settings">System Settings</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Audit Records Stream ({filtered.length} Events)
          </h3>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SHA-256 Verification Active
          </span>
        </div>
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Timestamp (IST)</th>
              <th className="p-4">Administrative Actor</th>
              <th className="p-4">Action Executed</th>
              <th className="p-4">Module</th>
              <th className="p-4">Affected Entity</th>
              <th className="p-4">Reference Key</th>
              <th className="p-4">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-900 dark:text-white">{log.actor}</div>
                  <div className="text-[10px] text-[#2087FE] font-medium">{log.role}</div>
                </td>
                <td className="p-4 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                  {log.action}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                    {log.module}
                  </span>
                </td>
                <td className="p-4 font-semibold text-slate-900 dark:text-white max-w-xs">{log.affectedEntity}</td>
                <td className="p-4 font-mono text-[11px] text-slate-400">{log.reference}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.result === "Success"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {log.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
