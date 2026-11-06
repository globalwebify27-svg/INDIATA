"use client";

import React, { useState } from "react";
import {
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReportItem {
  id: string;
  title: string;
  category: "Electoral Roll" | "Demographics" | "Turnout Analysis" | "Field Operations";
  description: string;
  format: "PDF" | "XLSX" | "CSV";
  recordsCount: string;
  generatedDate: string;
}

const AVAILABLE_REPORTS: ReportItem[] = [
  {
    id: "REP-01",
    title: "Booth-Wise Voter Slip Distribution Comprehensive Ledger",
    category: "Field Operations",
    description: "Detailed breakdown of slips handed, pending electors, and door-to-door verification remarks for all 264 booths.",
    format: "XLSX",
    recordsCount: "264 Booth Records",
    generatedDate: "Today, 08:00 AM",
  },
  {
    id: "REP-02",
    title: "Constituency Age & Gender Demographic Cross-Tabulation",
    category: "Demographics",
    description: "Statistical cohort cross-analysis across youth, working age, women electors, and prabhag clusters.",
    format: "PDF",
    recordsCount: "248,650 Electors",
    generatedDate: "Yesterday",
  },
  {
    id: "REP-03",
    title: "Swing Booth Performance & Historical Turnout Comparison",
    category: "Turnout Analysis",
    description: "Comparative matrix analyzing 2019 General Election vs 2024 projections for 42 swing polling stations.",
    format: "PDF",
    recordsCount: "42 Priority Stations",
    generatedDate: "02 Nov 2026",
  },
  {
    id: "REP-04",
    title: "Official Form 6/7/8 Quarantine Verification Register",
    category: "Electoral Roll",
    description: "Audit trail of constituent-submitted correction requests with BLO verification sign-off timestamps.",
    format: "CSV",
    recordsCount: "14 Pending Records",
    generatedDate: "01 Nov 2026",
  },
];

export function ReportsAnalyticsView() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = AVAILABLE_REPORTS.filter(
    (r) => selectedCategory === "all" || r.category === selectedCategory
  );

  const handleDownload = (title: string, format: string) => {
    showToast(
      "success",
      "Report Download Prepared",
      `Generating authenticated ${format} report: "${title}". Download starting...`,
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Intelligence &amp; Data Center
            </span>
            <Badge variant="teal">Export Ready</Badge>
            <Badge variant="neutral">ECI Compliant Format</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Reports, Dossiers &amp; Electoral Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Downloadable executive summaries, booth-level slips, demographic cross-tabulations, and audit registries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              showToast(
                "info",
                "Custom Export Generator",
                "Select parameters, ward boundaries, and field columns for customized reporting.",
              )
            }
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Generate Custom Dossier</span>
          </Button>
        </div>
      </section>

      {/* Reports Directory Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">
            Official Campaign Reports Library
          </h2>

          <div className="flex flex-wrap items-center gap-1.5">
            {["all", "Electoral Roll", "Demographics", "Turnout Analysis", "Field Operations"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-600 text-white"
                    : "bg-slate-50 text-slate-500 hover:text-slate-800"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:shadow-premium-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-bold text-brand-600 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      item.format === "PDF"
                        ? "bg-rose-50 text-rose-600"
                        : item.format === "XLSX"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-brand-50 text-brand-600"
                    }`}
                  >
                    {item.format}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">{item.recordsCount}</span>

                <button
                  type="button"
                  onClick={() => handleDownload(item.title, item.format)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
