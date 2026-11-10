"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Filter,
  Users,
  ShieldCheck,
  Building,
  HeartHandshake,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useKaryakartaAuth } from "../../../karyakarta/context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../../karyakarta/context/karyakarta-language-context";
import {
  MOCK_SCOPED_VOTERS,
  MOCK_ISSUES,
  MOCK_SLIPS,
} from "../../../karyakarta/data/mock-karyakarta-data";

interface ReportCard {
  id: string;
  title: string;
  marathiTitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  format: "CSV" | "EXCEL" | "PRINT";
  onGenerate: () => void;
}

export default function ReportsPage() {
  const { user, assignedBooths } = useKaryakartaAuth();
  const { t } = useKaryakartaLanguage();

  const [selectedBoothFilter, setSelectedBoothFilter] = useState<string>("ALL");
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Filtered voters based on selected booth
  const scopedVoters = MOCK_SCOPED_VOTERS.filter((v) => {
    if (selectedBoothFilter !== "ALL" && v.boothNumber !== selectedBoothFilter) return false;
    if (assignedBooths?.length && !assignedBooths.includes(v.boothNumber)) return false;
    return true;
  });

  const triggerDownload = (fileName: string, content: string) => {
    // UTF-8 BOM (\uFEFF) ensures Excel properly displays Marathi & Hindi text!
    const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessToast(`Export ready: ${fileName}`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  // 1. Voter Master Roll CSV
  const handleExportVoterRoll = () => {
    const headers = [
      "EPIC ID",
      "Voter Name",
      "Marathi Name",
      "Age",
      "Gender",
      "Relative Name",
      "Relation",
      "Booth",
      "Serial",
      "House No",
      "Address",
      "Mobile Phone",
      "Classification",
      "Visited",
      "Scheme",
    ];
    const rows = scopedVoters.map((v) => [
      v.epicId,
      `"${v.name}"`,
      `"${v.marathiName || ""}"`,
      v.age,
      v.gender,
      `"${v.relativeName}"`,
      v.relation,
      v.boothNumber,
      v.serialNumber || 42,
      `"${v.houseNo}"`,
      `"${v.address}"`,
      `"${v.phone || "N/A"}"`,
      v.classification,
      v.isVisited ? "Yes" : "No",
      `"${v.scheme || "None"}"`,
    ]);
    const content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    triggerDownload(`voter_roll_booth_${selectedBoothFilter}_${Date.now()}.csv`, content);
  };

  // 2. Doorstep Survey Progress Report
  const handleExportSurveyReport = () => {
    const headers = [
      "EPIC ID",
      "Voter Name",
      "Booth",
      "Phone",
      "Classification",
      "Visited",
      "Caste",
      "Occupation",
      "Scheme Benefits",
      "Demands / Issues",
      "Remarks",
      "Last Visit Date",
    ];
    const rows = scopedVoters.map((v) => [
      v.epicId,
      `"${v.name}"`,
      v.boothNumber,
      `"${v.phone || ""}"`,
      v.classification,
      v.isVisited ? "YES" : "NO",
      `"${v.caste || ""}"`,
      `"${v.occupation || ""}"`,
      `"${v.scheme || ""}"`,
      `"${(v.demand || "").replace(/"/g, '""')}"`,
      `"${(v.remarks || "").replace(/"/g, '""')}"`,
      `"${v.lastVisitDate || "Pending"}"`,
    ]);
    const content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    triggerDownload(`doorstep_survey_progress_${Date.now()}.csv`, content);
  };

  // 3. Unvisited Target Sheet
  const handleExportUnvisitedSheet = () => {
    const unvisited = scopedVoters.filter((v) => !v.isVisited);
    const headers = ["Serial", "Voter Name", "Marathi Name", "Booth", "House No", "Address", "Phone", "Age", "Gender"];
    const rows = unvisited.map((v) => [
      v.serialNumber || 42,
      `"${v.name}"`,
      `"${v.marathiName || ""}"`,
      v.boothNumber,
      `"${v.houseNo}"`,
      `"${v.address}"`,
      `"${v.phone || "Missing"}"`,
      v.age,
      v.gender,
    ]);
    const content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    triggerDownload(`unvisited_voters_field_sheet_${Date.now()}.csv`, content);
  };

  // 4. Grievance Register
  const handleExportGrievances = () => {
    const headers = [
      "Ticket Number",
      "Citizen Name",
      "Phone",
      "Booth",
      "Category",
      "Priority",
      "Status",
      "Created At",
      "Description",
      "Resolution Notes",
    ];
    const rows = MOCK_ISSUES.map((t) => [
      t.ticketNumber,
      `"${t.voterName}"`,
      `"${t.voterPhone}"`,
      t.voterBooth,
      `"${t.category}"`,
      t.priority,
      t.status,
      `"${t.createdAt}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.resolutionNotes || "Open / In Progress"}"`,
    ]);
    const content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    triggerDownload(`grievance_tickets_registry_${Date.now()}.csv`, content);
  };

  // 5. Voter Slip Dispatch History
  const handleExportSlips = () => {
    const headers = ["Slip Number", "Voter Name", "EPIC ID", "Booth", "Method", "Status", "Timestamp"];
    const rows = MOCK_SLIPS.map((s) => [
      s.slipNumber,
      `"${s.voterName}"`,
      s.epicId,
      s.boothNumber,
      s.deliveryMethod,
      s.status,
      `"${s.timestamp}"`,
    ]);
    const content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    triggerDownload(`voter_slip_dispatch_log_${Date.now()}.csv`, content);
  };

  // 6. Welfare Scheme Beneficiaries
  const handleExportWelfareSchemes = () => {
    const withSchemes = scopedVoters.filter((v) => !!v.scheme);
    const headers = ["Voter Name", "EPIC ID", "Phone", "Booth", "Enrolled Scheme", "Citizen Demands", "Classification"];
    const rows = withSchemes.map((v) => [
      `"${v.name}"`,
      v.epicId,
      `"${v.phone || ""}"`,
      v.boothNumber,
      `"${v.scheme}"`,
      `"${v.demand || ""}"`,
      v.classification,
    ]);
    const content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    triggerDownload(`welfare_schemes_roster_${Date.now()}.csv`, content);
  };

  const reportCards: ReportCard[] = [
    {
      id: "voter-roll",
      title: "Booth Voter Master Roll",
      marathiTitle: "बूथनिहाय मतदार यादी",
      description: "Complete register of electors with Part numbers, Serial numbers, and contact availability.",
      icon: Users,
      badge: `${scopedVoters.length} Electors`,
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
      format: "CSV",
      onGenerate: handleExportVoterRoll,
    },
    {
      id: "survey-progress",
      title: "Doorstep Survey & Sentiment Progress",
      marathiTitle: "घरोघरी सर्व्हे व कल अहवाल",
      description: "Surveyed electors, political sentiment classifications (Supporters, Doubtful), and notes.",
      icon: ShieldCheck,
      badge: "Campaign Strategy",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      format: "EXCEL",
      onGenerate: handleExportSurveyReport,
    },
    {
      id: "unvisited-sheet",
      title: "Unvisited Electors Action Sheet",
      marathiTitle: "भेट न दिलेले मतदार संपर्क सूची",
      description: "Focused fieldwork calling sheet of pending electors with addresses and mobile numbers.",
      icon: Clock,
      badge: `${scopedVoters.filter((v) => !v.isVisited).length} Pending`,
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      format: "PRINT",
      onGenerate: handleExportUnvisitedSheet,
    },
    {
      id: "grievances",
      title: "Local Civic Grievance Register",
      marathiTitle: "स्थानिक नागरिक तक्रार नोंदवही",
      description: "Log of civic issues (water, drainage, road repair) for Candidate War Room review.",
      icon: AlertCircle,
      badge: `${MOCK_ISSUES.length} Tickets`,
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      format: "CSV",
      onGenerate: handleExportGrievances,
    },
    {
      id: "slips",
      title: "Voter Slip Dispatch & Print Audit",
      marathiTitle: "मतदार स्लिप वाटप ऑडिट",
      description: "Audit register of thermal printed slips and digital WhatsApp dispatch receipts.",
      icon: Printer,
      badge: `${MOCK_SLIPS.length} Dispatched`,
      badgeColor: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
      format: "CSV",
      onGenerate: handleExportSlips,
    },
    {
      id: "welfare-schemes",
      title: "Government Welfare Scheme Beneficiaries",
      marathiTitle: "शासकीय योजना लाभार्थी यादी",
      description: "List of voters enrolled in or requesting Ladki Bahin, PMAY, or Ayushman Bharat.",
      icon: HeartHandshake,
      badge: "Welfare Impact",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
      format: "EXCEL",
      onGenerate: handleExportWelfareSchemes,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {downloadSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{downloadSuccessToast}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              Constituency Reports Desk
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Candidate: {user?.candidateName || "Anand Shinde"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#2087fe]" />
            {t("reports.title", "Reports & Export Center")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate and export official CSV registers, doorstep survey summaries, and unvisited calling sheets formatted for MS Excel and physical field printing.
          </p>
        </div>

        {/* Booth Scope Selector */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <select
            value={selectedBoothFilter}
            onChange={(e) => setSelectedBoothFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Assigned Booths ({user?.assignedBooths?.join(", ") || "All"})</option>
            {user?.assignedBooths?.map((b) => (
              <option key={b} value={b}>
                Booth {b} Only
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportCards.map((report) => {
          const IconComponent = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                    <IconComponent className="w-5 h-5 text-[#2087fe]" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${report.badgeColor}`}>
                    {report.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {report.title}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {report.marathiTitle}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                  Format: {report.format}
                </span>

                <button
                  type="button"
                  onClick={report.onGenerate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#2087fe] hover:bg-blue-600 text-white shadow-xs transition-transform active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Encoding & Compliance Notice */}
      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-3">
        <Building className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Multilingual Compatibility Guarantee:</div>
          <p>
            All generated reports embed the standard <strong>UTF-8 Byte Order Mark (BOM)</strong>. This guarantees that Devanagari script (Marathi and Hindi voter names and address fields) will open with crystal clear font rendering in Microsoft Excel, Google Sheets, and LibreOffice Calc without corrupted characters.
          </p>
        </div>
      </div>
    </div>
  );
}
