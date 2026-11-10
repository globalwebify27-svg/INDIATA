"use client";

import React, { useState, useMemo } from "react";
import {
  History,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  AlertCircle,
  MapPin,
  FileSpreadsheet,
} from "lucide-react";
import { useKaryakartaAuth } from "../../../karyakarta/context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../../karyakarta/context/karyakarta-language-context";
import { MOCK_ACTIVITIES } from "../../../karyakarta/data/mock-karyakarta-data";
import { ActivityLogRecord } from "../../../karyakarta/types/karyakarta.types";

export default function ActivityHistoryPage() {
  const { user } = useKaryakartaAuth();
  const { t } = useKaryakartaLanguage();

  const [activities] = useState<ActivityLogRecord[]>(MOCK_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (actionFilter !== "ALL" && !act.action.toLowerCase().includes(actionFilter.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mAction = act.action.toLowerCase().includes(q);
        const mTarget = act.target.toLowerCase().includes(q);
        const mDetails = act.details.toLowerCase().includes(q);
        if (!mAction && !mTarget && !mDetails) return false;
      }
      return true;
    });
  }, [activities, actionFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Action", "Target", "Details", "Status"];
    const rows = filteredActivities.map((a) => [
      `"${a.timestamp}"`,
      `"${a.action}"`,
      `"${a.target}"`,
      `"${a.details.replace(/"/g, '""')}"`,
      a.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `karyakarta_activity_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes("slip") && a.includes("print")) return Printer;
    if (a.includes("slip") || a.includes("digital") || a.includes("whatsapp")) return Share2;
    if (a.includes("issue") || a.includes("grievance")) return AlertCircle;
    if (a.includes("booth") || a.includes("map")) return MapPin;
    return CheckCircle2;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              Audit Trail & Telemetry
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Field Cadre: {user?.name || "Sachin D. Mane"} ({user?.id || "KAR-01"})
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-[#2087fe]" />
            {t("activity.title", "Field Activity Audit History")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable timeline of door-to-door surveys, voter slip dispatches, grievance tickets, and data updates synced with Candidate War Room.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Export Activity Audit CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity, target, or citizen name..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
          />
        </div>

        {/* Action Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs font-semibold">
          {[
            { id: "ALL", label: "All Activities" },
            { id: "survey", label: "Surveys" },
            { id: "slip", label: "Voter Slips" },
            { id: "issue", label: "Issues Logged" },
            { id: "booth", label: "Booth Shares" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActionFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                actionFilter === tab.id
                  ? "bg-[#2087fe] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredActivities.map((act) => {
            const IconComp = getActionIcon(act.action);
            return (
              <div key={act.id} className="relative flex items-start gap-4 group">
                {/* Timeline Dot */}
                <div className="w-5 h-5 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 shrink-0 mt-1 shadow-xs group-hover:scale-125 transition-transform" />

                {/* Content Box */}
                <div className="flex-1 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <IconComp className="w-4 h-4 text-[#2087fe]" />
                        {act.action}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {act.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.timestamp}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-[#2087fe] mb-1">
                    Target: {act.target}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {act.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
