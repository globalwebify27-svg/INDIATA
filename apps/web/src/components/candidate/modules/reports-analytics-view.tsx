"use client";

import React, { useState } from "react";
import {
  Download,
  Sparkles,
  Eye,
  CheckCircle2,
  X,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReportItem {
  id: string;
  title: string;
  category: "Electoral Roll" | "Demographics" | "Turnout Analysis" | "Field Operations" | "Civic Grievances" | "Campaigns";
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
  {
    id: "REP-05",
    title: "Civic Grievance Resolution & Municipal Escalation Audit",
    category: "Civic Grievances",
    description: "Ward-wise log of public demand tickets (Water, Roads, Pension) and average turnaround time.",
    format: "XLSX",
    recordsCount: "128 Tickets Logged",
    generatedDate: "Today, 10:30 AM",
  },
  {
    id: "REP-06",
    title: "Multi-Channel WhatsApp & SMS Voter Outreach Delivery Report",
    category: "Campaigns",
    description: "Meta Cloud API delivery rates, read receipts, and voter slip download link analytics.",
    format: "CSV",
    recordsCount: "18,420 Deliveries",
    generatedDate: "Today, 11:15 AM",
  },
];

export function ReportsAnalyticsView() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  const filtered = AVAILABLE_REPORTS.filter(
    (r) => selectedCategory === "all" || r.category === selectedCategory
  );

  const handleDownload = (title: string, format: string) => {
    showToast(
      "success",
      "Report Download Prepared",
      `Generating authenticated ${format} report: "${title}". File saved to local storage.`
    );
  };

  const handleAiGenerate = (promptText?: string) => {
    const text = promptText || aiPrompt;
    if (!text.trim()) return;

    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiPrompt("");
      showToast(
        "success",
        "AI Report Synthesized",
        `Custom analytical dataset generated for "${text}". Available for preview and Excel export.`
      );
    }, 1000);
  };

  const SUGGESTIONS = [
    "List undecided youth voters aged 18-25 in Booth #101",
    "Export Ladki Bahin beneficiaries with mobile numbers in Ward 12",
    "Show pending grievance tickets older than 48 hours",
  ];

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 11: Reports &amp; Analytics
            </span>
            <Badge variant="teal">AI Report Generator Ready</Badge>
            <Badge variant="neutral">AC-215 Bound</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Centralized Reports &amp; Electoral Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Generate, preview, analyze, and export cross-module reports across electoral rolls, field operations, surveys, and campaigns.
          </p>
        </div>
      </section>

      {/* AI NATURAL LANGUAGE REPORT GENERATION BAR */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl p-5 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h3 className="font-bold text-sm">AI Natural Language Report Generator</h3>
        </div>
        <p className="text-xs text-indigo-100 leading-relaxed max-w-2xl">
          Describe the exact cohort or metric you need. The engine cross-indexes voter demographics, booth results, survey feedback, and workforce logs.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAiGenerate();
          }}
          className="flex flex-col sm:flex-row items-center gap-2 pt-1"
        >
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. 'Generate an Excel sheet of women electors in Ward 14 with mobile numbers who haven't received voter slips'..."
            className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 text-xs focus:outline-none focus:bg-white/20"
          />
          <button
            type="submit"
            disabled={isGeneratingAi}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-brand-600 font-bold text-xs hover:bg-indigo-50 transition-colors shrink-0 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isGeneratingAi ? (
              <span>Synthesizing...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-[11px]">
          <span className="text-indigo-200 shrink-0 font-medium">Try asking:</span>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAiGenerate(s)}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white shrink-0 whitespace-nowrap transition-colors cursor-pointer text-[10px]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs & Report Grid */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "all"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All Reports ({AVAILABLE_REPORTS.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("Field Operations")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "Field Operations"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Field Operations
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("Demographics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "Demographics"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Demographics &amp; Caste
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("Turnout Analysis")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "Turnout Analysis"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Turnout &amp; Swing Analysis
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("Civic Grievances")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "Civic Grievances"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Civic Grievances
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("Campaigns")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "Campaigns"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Campaign Analytics
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between gap-3 hover:border-brand-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {report.format} • {report.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{report.generatedDate}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mt-2 leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{report.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{report.recordsCount}</span>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => setPreviewReport(report)}>
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleDownload(report.title, report.format)}>
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT PREVIEW MODAL */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-brand-600">{previewReport.id}</span>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                  {previewReport.title}
                </h3>
                <p className="text-xs text-slate-500">{previewReport.recordsCount} • Generated {previewReport.generatedDate}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {previewReport.description}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-bold text-slate-800 dark:text-white block">Audit &amp; Security Validation:</span>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>ECI Kasba Peth (AC-215) Tenant Isolation Cryptographically Verified</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setPreviewReport(null)}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(previewReport.title, "PDF")}>
                  PDF
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleDownload(previewReport.title, "XLSX")}>
                  Excel (XLSX)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
