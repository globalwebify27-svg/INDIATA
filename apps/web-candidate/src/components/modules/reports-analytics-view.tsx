"use client";

import React, { useState } from "react";
import {
  Download,
  Sparkles,
  Eye,
  CheckCircle2,
  X,
  FileSpreadsheet,
  FileText,
  FileCode,
  Users,
  Send,
  Ticket,
  AlertCircle,
  Database,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ReportCategoryKey =
  | "voter-demographics"
  | "campaign-metrics"
  | "slip-logs"
  | "survey-issues";

export interface ReportItem {
  id: string;
  categoryKey: ReportCategoryKey;
  categoryLabel: string;
  title: string;
  description: string;
  recordsCount: string;
  generatedDate: string;
  sampleColumns: string[];
  sampleRows: Record<string, string>[];
}

const SECTION_8_REPORTS: ReportItem[] = [
  {
    id: "REP-DEMO-01",
    categoryKey: "voter-demographics",
    categoryLabel: "1. Voter Demographics & Lists",
    title: "Constituency Demographic Cross-Tabulation & Mobile Coverage",
    description:
      "Comprehensive census analysis by Gender (Male, Female, Third Gender), Age Brackets (18-25, 26-40, 41-60, 60+), Verified Mobile Phone Availability, and Duplicate Elector Risk Flags.",
    recordsCount: "248,650 Electors",
    generatedDate: "Today, 08:30 AM",
    sampleColumns: ["EPIC ID", "Full Name", "Gender/Age", "Ward/Booth", "Mobile Available", "Duplicate Risk"],
    sampleRows: [
      {
        "EPIC ID": "WXE4829102",
        "Full Name": "Rahul Sharad Shinde",
        "Gender/Age": "Male / 38",
        "Ward/Booth": "Ward 12, Booth 101",
        "Mobile Available": "Yes (+91 98220...)",
        "Duplicate Risk": "0% (Clean)",
      },
      {
        "EPIC ID": "WXE3920194",
        "Full Name": "Sunita Vilas Kulkarni",
        "Gender/Age": "Female / 62",
        "Ward/Booth": "Ward 12, Booth 101",
        "Mobile Available": "Yes (+91 94223...)",
        "Duplicate Risk": "0% (Clean)",
      },
      {
        "EPIC ID": "WXE1029384",
        "Full Name": "Amit Suresh Joshi",
        "Gender/Age": "Male / 21",
        "Ward/Booth": "Ward 14, Booth 108",
        "Mobile Available": "Pending Contact",
        "Duplicate Risk": "2.4% (Flagged)",
      },
    ],
  },
  {
    id: "REP-CAMP-02",
    categoryKey: "campaign-metrics",
    categoryLabel: "2. Campaign Metrics",
    title: "Multi-Channel Broadcast Performance & Delivery Audit",
    description:
      "High-throughput dispatch logs for WhatsApp Official PDF slips, TRAI DLT-verified SMS blasts, and AI Voice calls. Tracks Messages Sent, Delivered, Read receipts, and Failed/Bounced numbers.",
    recordsCount: "184,200 Dispatches",
    generatedDate: "Today, 10:15 AM",
    sampleColumns: ["Campaign ID", "Channel", "Target Audience", "Sent", "Delivered", "Delivery Rate"],
    sampleRows: [
      {
        "Campaign ID": "CMP-401",
        "Channel": "WhatsApp API",
        "Target Audience": "Ward 12 & 14 Slip PDF",
        "Sent": "4,500",
        "Delivered": "4,320",
        "Delivery Rate": "96.0%",
      },
      {
        "Campaign ID": "CMP-402",
        "Channel": "SMS Dispatch",
        "Target Audience": "Youth 18-25 Orientation",
        "Sent": "8,200",
        "Delivered": "7,950",
        "Delivery Rate": "97.0%",
      },
      {
        "Campaign ID": "CMP-403",
        "Channel": "AI Voice IVR",
        "Target Audience": "Kasba Peth Family Heads",
        "Sent": "12,000",
        "Delivered": "10,450",
        "Delivery Rate": "87.1%",
      },
    ],
  },
  {
    id: "REP-SLIP-03",
    categoryKey: "slip-logs",
    categoryLabel: "3. Slip Generation Logs",
    title: "Voter Slip Generation & Doorstep Delivery Ledger",
    description:
      "Dual-channel audit ledger comparing Physical Printed Slips handed to electors vs Digital WhatsApp PDF slips. Includes Karyakarta dispatch serials, delivery timestamps, and pending booth queues.",
    recordsCount: "142,800 Verified Slips",
    generatedDate: "Today, 11:45 AM",
    sampleColumns: ["Slip Ref", "Elector Name", "Slip Type", "Assigned Karyakarta", "Delivery Time", "Audit Status"],
    sampleRows: [
      {
        "Slip Ref": "SLP-101-084",
        "Elector Name": "Sunita Vilas Kulkarni",
        "Slip Type": "Physical Print Slip",
        "Assigned Karyakarta": "Pooja J. (Squad Alpha)",
        "Delivery Time": "Today, 09:42 AM",
        "Audit Status": "Handed to Elector",
      },
      {
        "Slip Ref": "SLP-101-085",
        "Elector Name": "Rahul Sharad Shinde",
        "Slip Type": "WhatsApp Digital PDF",
        "Assigned Karyakarta": "Automated Meta Bot",
        "Delivery Time": "Today, 09:45 AM",
        "Audit Status": "Read Receipt (Double Blue)",
      },
      {
        "Slip Ref": "SLP-106-210",
        "Elector Name": "Kavita Ramesh More",
        "Slip Type": "Physical Print Slip",
        "Assigned Karyakarta": "Ganesh P. (Squad Bravo)",
        "Delivery Time": "Today, 10:18 AM",
        "Audit Status": "House Locked (Revisit)",
      },
    ],
  },
  {
    id: "REP-ISSUE-04",
    categoryKey: "survey-issues",
    categoryLabel: "4. Survey & Booth Issues",
    title: "Constituency Civic Grievance & Booth Issues Register",
    description:
      "Real-time ticket logging of civic issues collected during field canvassing. Classifies booth category (Focus, General), grievance domain (Drinking Water, Road Potholes, Streetlights, Drainage), and PMC resolution turnaround.",
    recordsCount: "348 Active Grievances",
    generatedDate: "Today, 12:00 PM",
    sampleColumns: ["Ticket ID", "Ward / Booth", "Domain", "Booth Category", "Resolution Status", "Days Open"],
    sampleRows: [
      {
        "Ticket ID": "TKT-9210",
        "Ward / Booth": "Ward 12, Booth 101",
        "Domain": "Drinking Water Pressure",
        "Booth Category": "Critical Focus Station",
        "Resolution Status": "Escalated to PMC",
        "Days Open": "5 Days",
      },
      {
        "Ticket ID": "TKT-9214",
        "Ward / Booth": "Ward 14, Booth 108",
        "Domain": "Streetlight Inactive",
        "Booth Category": "General Polling Station",
        "Resolution Status": "In Progress (Ward Office)",
        "Days Open": "2 Days",
      },
      {
        "Ticket ID": "TKT-9198",
        "Ward / Booth": "Ward 9, Booth 88",
        "Domain": "Drainage Overflow",
        "Booth Category": "Critical Focus Station",
        "Resolution Status": "Resolved & Signed Off",
        "Days Open": "1 Day",
      },
    ],
  },
];

export function ReportsAnalyticsView() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  const filtered = SECTION_8_REPORTS.filter(
    (r) => selectedCategory === "all" || r.categoryKey === selectedCategory
  );

  const handleDownload = (title: string, format: "PDF" | "CSV" | "XLSX") => {
    showToast(
      "success",
      `Generating ${format} Export`,
      `Cryptographically signed dataset "${title}" (${format}) generated. Encrypted download complete.`
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
        `Custom analytical dataset synthesized for "${text}". Available for instant multi-format export.`
      );
    }, 900);
  };

  const SUGGESTIONS = [
    "List youth electors aged 18-25 in Booth #101 without mobile contacts",
    "Export Ladki Bahin beneficiaries with digital voter slips delivered",
    "Show pending grievance tickets in Critical Focus booths open over 48h",
  ];

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 dark:text-brand-400 px-2.5 py-0.5 rounded-full">
              Module 11: Reports &amp; Dataset Exports
            </span>
            <Badge variant="teal">Multi-Format Engine (PDF / CSV / XLSX)</Badge>
            <Badge variant="neutral">AC-215 Kasba Peth Bound</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Comprehensive Analytical Reports &amp; Dataset Export Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export structured datasets across 4 core operational pillars: Voter Demographics, Campaign Metrics, Slip Generation Logs, and Survey &amp; Booth Issues.
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
          Describe any voter cohort, slip distribution query, or grievance filter. The AI engine cross-indexes master rolls and generates export-ready sheets in seconds.
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
                <span>Generate Dataset</span>
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

      {/* 4 Core Category Tabs & Reports Engine */}
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
            All 4 Categories ({SECTION_8_REPORTS.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("voter-demographics")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "voter-demographics"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>1. Voter Demographics</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("campaign-metrics")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "campaign-metrics"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>2. Campaign Metrics</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("slip-logs")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "slip-logs"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>3. Slip Generation Logs</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("survey-issues")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === "survey-issues"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>4. Survey &amp; Booth Issues</span>
          </button>
        </div>

        {/* Reports Grid with 3 Dedicated Export Buttons (PDF, CSV, Excel) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between gap-4 hover:border-brand-400 dark:hover:border-brand-600 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-mono">
                    {report.categoryLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{report.generatedDate}</span>
                </div>

                <h3 className="font-bold text-base text-slate-800 dark:text-white mt-2 leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {report.description}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Database className="w-3.5 h-3.5 text-brand-600" />
                  <span>Scope: <strong>{report.recordsCount}</strong></span>
                </div>
              </div>

              {/* Multi-Format Dataset Export Engine (PDF, CSV, Excel) + Preview */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewReport(report)}
                  className="flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Schema</span>
                </Button>

                {/* 3 Direct Multi-Format Export Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownload(report.title, "PDF")}
                    className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                    title="Export Print-Ready PDF"
                  >
                    <FileText className="w-3 h-3 text-rose-600" />
                    <span>PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(report.title, "CSV")}
                    className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                    title="Export Raw CSV Spreadsheet"
                  >
                    <FileCode className="w-3 h-3 text-blue-600" />
                    <span>CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(report.title, "XLSX")}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                    title="Export Formatted Microsoft Excel Workbook"
                  >
                    <FileSpreadsheet className="w-3 h-3" />
                    <span>Excel (XLSX)</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT PREVIEW MODAL */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                  {previewReport.id} • {previewReport.categoryLabel}
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                  {previewReport.title}
                </h3>
                <p className="text-xs text-slate-500">{previewReport.recordsCount} • Synchronized {previewReport.generatedDate}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {previewReport.description}
            </p>

            {/* Dataset Preview Schema & Sample Data Rows */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-slate-800 dark:text-white block">
                Sample Live Records (First 3 Rows):
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[10.5px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      {previewReport.sampleColumns.map((col, idx) => (
                        <th key={idx} className="py-2 px-3">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {previewReport.sampleRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white dark:hover:bg-slate-800">
                        {previewReport.sampleColumns.map((col, cIdx) => (
                          <td key={cIdx} className="py-2 px-3 text-slate-700 dark:text-slate-200 font-mono text-[11px]">
                            {row[col] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-bold text-slate-800 dark:text-white block">ECI Compliance &amp; Verification:</span>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Kasba Peth (AC-215) Tenant Isolation &amp; Cryptographic Watermark Applied</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setPreviewReport(null)}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(previewReport.title, "PDF")}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(previewReport.title, "CSV")}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(previewReport.title, "XLSX")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Excel</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
