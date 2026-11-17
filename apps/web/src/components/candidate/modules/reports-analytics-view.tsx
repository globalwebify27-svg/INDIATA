"use client";

import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Sparkles,
  Clock,
  Bookmark,
  Database,
  Calendar,
  AlertTriangle,
  Download,
  ArrowRight,
  Loader2,
  Send,
  CheckCircle2,
  X,
  RefreshCw,
  Trash2,
  Play,
  CheckSquare,
  Square,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

export type ReportViewTab = "DASHBOARD" | "BUILDER" | "AI" | "HISTORY" | "SAVED";

export interface ReportTemplate {
  id: string;
  title: string;
  category: "VOTER" | "USER" | "BOOTH" | "CAMPAIGN" | "SURVEY" | "ISSUES" | "VOTER_SLIPS" | "ELECTION_ANALYTICS";
  categoryLabel: string;
  desc: string;
  defaultDataSource: string;
  defaultScope: string;
  defaultFormat: "PDF" | "XLSX" | "CSV";
  estimatedRecords: string;
  suggestedColumns: string[];
}

export interface GeneratedHistoryItem {
  id: string;
  reportName: string;
  category: string;
  generatedBy: string;
  generatedOn: string;
  scope: string;
  filters: string;
  format: "PDF" | "XLSX" | "CSV";
  records: number;
  fileSize: string;
  status: "COMPLETED" | "PROCESSING" | "FAILED";
}

export interface SavedPresetItem {
  id: string;
  name: string;
  category: string;
  dataSource: string;
  scope: string;
  columns: string[];
  filtersSummary: string;
  format: "PDF" | "XLSX" | "CSV";
  lastRun: string;
}

export interface AiSynthesisPlan {
  prompt: string;
  dataSource: string;
  scope: string;
  appliedFilters: string[];
  suggestedColumns: string[];
  estimatedRecords: number;
  recommendedFormat: "PDF" | "XLSX" | "CSV";
  summaryNarrative: string;
}

const TEMPLATES: ReportTemplate[] = [
  {
    id: "rep-vot-01",
    title: "Complete Electoral Roll Dossier",
    category: "VOTER",
    categoryLabel: "Voter Reports",
    desc: "Master electoral ledger containing verified names, relatives, house numbers, EPIC numbers, and age clusters.",
    defaultDataSource: "Voters Database",
    defaultScope: "Entire Constituency (215 - Kasba Peth)",
    defaultFormat: "XLSX",
    estimatedRecords: "2,48,650",
    suggestedColumns: ["fullName", "relativeName", "epicNumber", "age", "gender", "boothNumber", "address"],
  },
  {
    id: "rep-vot-02",
    title: "Booth-wise Voter Distribution & Turnout Audit",
    category: "VOTER",
    categoryLabel: "Voter Reports",
    desc: "Voter counts, gender balance ratios, and historical turnout projections segmented across each polling station.",
    defaultDataSource: "Voters Database",
    defaultScope: "All 2,045 Polling Booths",
    defaultFormat: "PDF",
    estimatedRecords: "2,045",
    suggestedColumns: ["boothNumber", "pollingStation", "totalVoters", "maleRatio", "projectedTurnout"],
  },
  {
    id: "rep-vot-03",
    title: "Voter Classification & Cadre Alignment Report",
    category: "VOTER",
    categoryLabel: "Voter Reports",
    desc: "Core supporters, fence sitters, leaning opponents, and local community influencers identified by karyakartas.",
    defaultDataSource: "Voters Database",
    defaultScope: "Field Cadre Tracked Voters",
    defaultFormat: "XLSX",
    estimatedRecords: "42,120",
    suggestedColumns: ["fullName", "politicalLeaning", "isInfluencer", "boothNumber", "karyakartaName"],
  },
  {
    id: "rep-vot-04",
    title: "Mobile Number Availability & WhatsApp Reachability",
    category: "VOTER",
    categoryLabel: "Voter Reports",
    desc: "Voter records with validated 10-digit mobile numbers for direct WhatsApp broadcasts and SMS outreach.",
    defaultDataSource: "Voters Database",
    defaultScope: "Verified Mobile Voters",
    defaultFormat: "CSV",
    estimatedRecords: "1,86,430",
    suggestedColumns: ["fullName", "epicNumber", "mobile", "boothNumber", "isVisited"],
  },
  {
    id: "rep-usr-01",
    title: "Field Worker Deployment & Performance Dossier",
    category: "USER",
    categoryLabel: "User & Karyakarta Reports",
    desc: "Booth-wise Karyakarta assignments, surveys completed, door visits executed, and voter slips delivered.",
    defaultDataSource: "Karyakarta / Workforce",
    defaultScope: "Active Field Cadre",
    defaultFormat: "PDF",
    estimatedRecords: "4,850",
    suggestedColumns: ["name", "phone", "assignedBooth", "surveysCompleted", "voterSlipsDelivered", "status"],
  },
  {
    id: "rep-usr-02",
    title: "Voter Update Request Governance & Moderation Log",
    category: "USER",
    categoryLabel: "User & Karyakarta Reports",
    desc: "Audit trail of field worker update requests with approvals, rejections, and timestamped justifications.",
    defaultDataSource: "Karyakarta Update Requests",
    defaultScope: "All Submission Queues",
    defaultFormat: "XLSX",
    estimatedRecords: "892",
    suggestedColumns: ["id", "voterName", "karyakartaName", "status", "reviewedBy", "requestedAt"],
  },
  {
    id: "rep-bth-01",
    title: "Booth Readiness & Polling Station Vulnerability Index",
    category: "BOOTH",
    categoryLabel: "Booth & Constituency",
    desc: "Vulnerability rating, BLO contact status, agent appointment, and infrastructure readiness for polling day.",
    defaultDataSource: "Polling Booths",
    defaultScope: "Critical & Normal Booths",
    defaultFormat: "PDF",
    estimatedRecords: "272",
    suggestedColumns: ["boothNumber", "stationName", "vulnerability", "bloName", "readinessPercent"],
  },
  {
    id: "rep-cmp-01",
    title: "Multi-Channel Campaign Delivery & Engagement Audit",
    category: "CAMPAIGN",
    categoryLabel: "Campaign Reports",
    desc: "WhatsApp, SMS, and Voice blast analytics, read receipts, audio duration, and failed delivery breakdowns.",
    defaultDataSource: "Campaigns Engine",
    defaultScope: "All Completed Campaigns",
    defaultFormat: "PDF",
    estimatedRecords: "18",
    suggestedColumns: ["title", "channel", "targetAudience", "deliveryRate", "engagementRate", "spentBudget"],
  },
  {
    id: "rep-srv-01",
    title: "Door-to-Door Voter Survey Progress & Coverage",
    category: "SURVEY",
    categoryLabel: "Survey & Field Ops",
    desc: "Household visits, pending survey quotas, and local priority issues reported during ground drives.",
    defaultDataSource: "Surveys & Field Ops",
    defaultScope: "Constituency Doorstep Drives",
    defaultFormat: "XLSX",
    estimatedRecords: "72,450",
    suggestedColumns: ["householdId", "boothNumber", "surveyorName", "issuesReported", "surveyDate"],
  },
  {
    id: "rep-iss-01",
    title: "Public Demands & Civic Grievance Resolution Ledger",
    category: "ISSUES",
    categoryLabel: "Issues & Public Demands",
    desc: "Categorized constituent grievances (Water, Roads, Electricity, Schemes) with resolution velocity.",
    defaultDataSource: "Grievance / Office Issues",
    defaultScope: "All Registered Complaints",
    defaultFormat: "XLSX",
    estimatedRecords: "42",
    suggestedColumns: ["ticketId", "category", "prabhaag", "status", "priority", "assignedTo"],
  },
  {
    id: "rep-slp-01",
    title: "Voter Information Slip Distribution & Delivery Audit",
    category: "VOTER_SLIPS",
    categoryLabel: "Voter Slip Reports",
    desc: "Slip generation status, physical delivery confirmations, digital QR downloads, and pending batches.",
    defaultDataSource: "Voter Slips Registry",
    defaultScope: "All Electoral Parts",
    defaultFormat: "PDF",
    estimatedRecords: "1,92,430",
    suggestedColumns: ["epicNumber", "voterName", "boothNumber", "slipStatus", "deliveryMode"],
  },
  {
    id: "rep-elc-01",
    title: "Historical Margin & Turnout Comparative Strategy Dossier",
    category: "ELECTION_ANALYTICS",
    categoryLabel: "Election & Analytics",
    desc: "Assembly vs Parliamentary historical trend comparison across 2014, 2019, and 2024 projections.",
    defaultDataSource: "Historical Election Intelligence",
    defaultScope: "Kasba Peth & Pune PC",
    defaultFormat: "PDF",
    estimatedRecords: "8 Wards",
    suggestedColumns: ["wardName", "2019Turnout", "2024Target", "winningMargin", "swingFactor"],
  },
];

const DATA_FIELDS: Record<string, { id: string; label: string; defaultChecked: boolean }[]> = {
  Voters: [
    { id: "fullName", label: "Voter Full Name", defaultChecked: true },
    { id: "relativeName", label: "Relative / Father Name", defaultChecked: true },
    { id: "epicNumber", label: "EPIC Number", defaultChecked: true },
    { id: "gender", label: "Gender", defaultChecked: true },
    { id: "age", label: "Age", defaultChecked: true },
    { id: "mobile", label: "Mobile Number", defaultChecked: true },
    { id: "address", label: "Residential Address", defaultChecked: true },
    { id: "boothNumber", label: "Booth Number", defaultChecked: true },
    { id: "pollingStation", label: "Polling Station", defaultChecked: true },
    { id: "caste", label: "Caste Community", defaultChecked: false },
    { id: "occupation", label: "Occupation", defaultChecked: false },
    { id: "karyakartaName", label: "Assigned Karyakarta", defaultChecked: true },
    { id: "politicalLeaning", label: "Political Stance", defaultChecked: false },
    { id: "isInfluencer", label: "Key Influencer Flag", defaultChecked: false },
    { id: "hasVoted", label: "Voting Status", defaultChecked: false },
    { id: "isVisited", label: "Doorstep Visit Flag", defaultChecked: true },
  ],
  Users: [
    { id: "id", label: "User ID", defaultChecked: true },
    { id: "name", label: "Full Name", defaultChecked: true },
    { id: "phone", label: "Phone Number", defaultChecked: true },
    { id: "role", label: "Assigned Role", defaultChecked: true },
    { id: "status", label: "Account Status", defaultChecked: true },
    { id: "prabhaag", label: "Prabhaag / Ward", defaultChecked: true },
    { id: "assignedBooths", label: "Assigned Booths", defaultChecked: true },
    { id: "lastActive", label: "Last Active Timestamp", defaultChecked: true },
  ],
  Karyakarta: [
    { id: "name", label: "Karyakarta Name", defaultChecked: true },
    { id: "phone", label: "Contact Phone", defaultChecked: true },
    { id: "assignedBooth", label: "Assigned Booth No", defaultChecked: true },
    { id: "surveysCompleted", label: "Surveys Completed", defaultChecked: true },
    { id: "voterSlipsDelivered", label: "Slips Delivered", defaultChecked: true },
    { id: "status", label: "Verification Status", defaultChecked: true },
    { id: "joinedDate", label: "Joined Date", defaultChecked: false },
    { id: "isOnline", label: "Current Field Connectivity", defaultChecked: true },
  ],
  Booths: [
    { id: "boothNumber", label: "Booth Number", defaultChecked: true },
    { id: "stationName", label: "Polling Station Location", defaultChecked: true },
    { id: "totalVoters", label: "Total Registered Voters", defaultChecked: true },
    { id: "maleVoters", label: "Male Count", defaultChecked: true },
    { id: "femaleVoters", label: "Female Count", defaultChecked: true },
    { id: "vulnerabilityLevel", label: "ECI Vulnerability Rating", defaultChecked: true },
    { id: "karyakartaCount", label: "Assigned Cadre Count", defaultChecked: true },
    { id: "readinessScore", label: "Readiness Percentage", defaultChecked: true },
  ],
  Campaign: [
    { id: "title", label: "Campaign Title", defaultChecked: true },
    { id: "type", label: "Channel Type", defaultChecked: true },
    { id: "audience", label: "Target Audience Size", defaultChecked: true },
    { id: "sentCount", label: "Total Dispatched", defaultChecked: true },
    { id: "deliveredCount", label: "Successfully Delivered", defaultChecked: true },
    { id: "openRate", label: "Engagement Rate", defaultChecked: true },
    { id: "status", label: "Campaign Status", defaultChecked: true },
    { id: "date", label: "Launch Date", defaultChecked: true },
  ],
  Issues: [
    { id: "id", label: "Grievance ID", defaultChecked: true },
    { id: "title", label: "Issue Title", defaultChecked: true },
    { id: "category", label: "Department / Category", defaultChecked: true },
    { id: "prabhaag", label: "Prabhaag / Ward", defaultChecked: true },
    { id: "status", label: "Resolution Status", defaultChecked: true },
    { id: "priority", label: "Priority Level", defaultChecked: true },
    { id: "assignedWorker", label: "Assigned Karyakarta", defaultChecked: true },
    { id: "reportedDate", label: "Date Reported", defaultChecked: true },
  ],
};

function getFieldsForSource(source: string): { id: string; label: string; defaultChecked: boolean }[] {
  return DATA_FIELDS[source] ?? DATA_FIELDS["Voters"] ?? [];
}

const SAMPLE_RECORDS: Record<string, string | number>[] = [
  {
    id: "v-01",
    fullName: "Narayan Govind Joshi",
    relativeName: "Govind Joshi",
    epicNumber: "MH34091104",
    age: 48,
    gender: "Male",
    boothNumber: "101",
    mobile: "+91 98221 44001",
    address: "Dahanukar Colony Lane 3",
    pollingStation: "Navbharat High School, Room 1",
    karyakartaName: "Vikas Patil",
  },
  {
    id: "v-02",
    fullName: "Sunita Rajesh Verma",
    relativeName: "Rajesh Verma",
    epicNumber: "WXE0821443",
    age: 39,
    gender: "Female",
    boothNumber: "101",
    mobile: "+91 98221 44002",
    address: "Flat 4, Mayur Apt, Kothrud",
    pollingStation: "Navbharat High School, Room 1",
    karyakartaName: "Pooja Deshmukh",
  },
  {
    id: "v-03",
    fullName: "Rajesh Kumar Verma",
    relativeName: "Kishore Verma",
    epicNumber: "WXE4829102",
    age: 42,
    gender: "Male",
    boothNumber: "101",
    mobile: "+91 98221 44001",
    address: "Flat 4, Mayur Apt, Kothrud",
    pollingStation: "Navbharat High School, Room 1",
    karyakartaName: "Vikas Patil",
  },
  {
    id: "v-04",
    fullName: "Amit Baban Shinde",
    relativeName: "Baban Shinde",
    epicNumber: "WXE1290384",
    age: 35,
    gender: "Male",
    boothNumber: "106",
    mobile: "+91 99908 12345",
    address: "12/A Kasba Peth Lane",
    pollingStation: "Karve Nagar Samaj Mandir",
    karyakartaName: "Sachin Babar",
  },
  {
    id: "v-05",
    fullName: "Kavita Ashok Patil",
    relativeName: "Ashok Patil",
    epicNumber: "WXE7765109",
    age: 31,
    gender: "Female",
    boothNumber: "108",
    mobile: "+91 98230 99887",
    address: "Plot 88, Ideal Colony",
    pollingStation: "Karve Nagar Samaj Mandir",
    karyakartaName: "Pooja Deshmukh",
  },
];

const AI_PROMPT_EXAMPLES = [
  "Generate a complete voter turnout and vulnerability report for Booth 101 to 108.",
  "List all field workers who completed over 150 doorstep surveys this month.",
  "Show all pending voter update requests submitted in the last 30 days.",
  "Generate a WhatsApp and SMS campaign delivery comparison dossier.",
  "Compare voter demographics and gender balance across all 8 assembly wards.",
  "Generate physical voter slip distribution checklist for Booth #105.",
];

export function ReportsAnalyticsView() {
  const { showToast } = useToast();

  // Navigation & Subviews
  const [activeTab, setActiveTab] = useState<ReportViewTab>("DASHBOARD");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");

  // History & Presets State
  const [historyItems, setHistoryItems] = useState<GeneratedHistoryItem[]>([
    {
      id: "GEN-2024-0419",
      reportName: "Booth-wise Voter Distribution & Turnout Audit",
      category: "Voter Reports",
      generatedBy: "Adv. Vikram Patil (Candidate)",
      generatedOn: "2024-04-18 04:30 PM",
      scope: "Booths #101 - #108",
      filters: "Gender: All, Age: All, Turnout > 50%",
      format: "PDF",
      records: 2045,
      fileSize: "4.2 MB",
      status: "COMPLETED",
    },
    {
      id: "GEN-2024-0418",
      reportName: "Mobile Number Availability & WhatsApp Reachability",
      category: "Voter Reports",
      generatedBy: "War Room Head (Dr. Sameer Deshpande)",
      generatedOn: "2024-04-18 11:15 AM",
      scope: "Prabhaag 12 - Kothrud West",
      filters: "Has Mobile = Yes, Verified = True",
      format: "CSV",
      records: 186430,
      fileSize: "12.8 MB",
      status: "COMPLETED",
    },
    {
      id: "GEN-2024-0417",
      reportName: "Field Worker Deployment & Performance Dossier",
      category: "User & Karyakarta Reports",
      generatedBy: "Adv. Vikram Patil (Candidate)",
      generatedOn: "2024-04-17 06:10 PM",
      scope: "Active Field Cadre",
      filters: "Status = APPROVED, Booths Assigned",
      format: "PDF",
      records: 4850,
      fileSize: "2.1 MB",
      status: "COMPLETED",
    },
    {
      id: "GEN-2024-0416",
      reportName: "Voter Information Slip Distribution & Delivery Audit",
      category: "Voter Slip Reports",
      generatedBy: "Data Operator (Suresh K.)",
      generatedOn: "2024-04-16 02:45 PM",
      scope: "Constituency Kasba Peth",
      filters: "Delivered = True",
      format: "XLSX",
      records: 192430,
      fileSize: "18.4 MB",
      status: "COMPLETED",
    },
    {
      id: "GEN-2024-0415",
      reportName: "Public Demands & Civic Grievance Resolution Ledger",
      category: "Issues & Public Demands",
      generatedBy: "War Room Head (Dr. Sameer Deshpande)",
      generatedOn: "2024-04-15 10:00 AM",
      scope: "Ward 12 Grievance Desk",
      filters: "Category: Water & Drainage",
      format: "PDF",
      records: 42,
      fileSize: "1.4 MB",
      status: "COMPLETED",
    },
  ]);

  const [savedPresets, setSavedPresets] = useState<SavedPresetItem[]>([
    {
      id: "cfg-01",
      name: "Daily Booth-wise Turnout Projection",
      category: "Voter Reports",
      dataSource: "Voters Database",
      scope: "All Booths (#101 to #108)",
      columns: ["boothNumber", "pollingStation", "totalVoters", "projectedTurnout"],
      filtersSummary: "Active Voters, Age 18-90, Local Residents",
      format: "PDF",
      lastRun: "2024-04-18",
    },
    {
      id: "cfg-02",
      name: "Weekly Karyakarta Slip Distribution Progress",
      category: "User & Karyakarta Reports",
      dataSource: "Karyakarta / Workforce",
      scope: "All Active Karyakartas",
      columns: ["name", "phone", "assignedBooth", "voterSlipsDelivered"],
      filtersSummary: "Status = APPROVED",
      format: "XLSX",
      lastRun: "2024-04-17",
    },
    {
      id: "cfg-03",
      name: "Monthly Civic Grievance Escalation Dossier",
      category: "Issues & Public Demands",
      dataSource: "Grievance / Office Issues",
      scope: "Entire Constituency",
      columns: ["ticketId", "category", "prabhaag", "status", "priority"],
      filtersSummary: "Priority = HIGH / URGENT",
      format: "PDF",
      lastRun: "2024-04-15",
    },
  ]);

  // Builder Wizard State
  const [builderStep, setBuilderStep] = useState<number>(1);
  const [selectedDataSource, setSelectedDataSource] = useState<string>("Voters");
  const [selectedScope, setSelectedScope] = useState<string>("CONSTITUENCY");
  const [selectedBooth, setSelectedBooth] = useState<string>("ALL");
  const [selectedWorker, setSelectedWorker] = useState<string>("ALL");
  const [reportTitle, setReportTitle] = useState<string>("Custom Voter Intelligence Report");
  const [exportFormat, setExportFormat] = useState<"PDF" | "XLSX" | "CSV">("PDF");
  const [includeSummaryPage, setIncludeSummaryPage] = useState<boolean>(true);
  const [embedCharts, setEmbedCharts] = useState<boolean>(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    getFieldsForSource("Voters").filter((f) => f.defaultChecked).map((f) => f.id)
  );

  // Modals & Compilation
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileProgress, setCompileProgress] = useState<number>(0);
  const [completedReport, setCompletedReport] = useState<GeneratedHistoryItem | null>(null);

  // AI Prompt State
  const [aiPromptText, setAiPromptText] = useState<string>("");
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiPlan, setAiPlan] = useState<AiSynthesisPlan | null>(null);

  // Filter templates list
  const filteredTemplates = useMemo(() => {
    if (selectedCategoryFilter === "ALL") return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  // Change data source in builder
  const handleSelectDataSource = (source: string) => {
    setSelectedDataSource(source);
    const fields = getFieldsForSource(source);
    setSelectedColumns(fields.filter((f) => f.defaultChecked).map((f) => f.id));
    setReportTitle(`Custom ${source} Analysis Dossier`);
  };

  const handleToggleColumn = (colId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const handleSelectAllColumns = () => {
    const fields = getFieldsForSource(selectedDataSource).map((f) => f.id);
    setSelectedColumns(fields);
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns([]);
  };

  // Real download helper
  const triggerBrowserDownload = (name: string, format: string) => {
    const filename = `${name.replace(/[^a-zA-Z0-9_-]/g, "_")}_${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`;
    const csvHeader = "EPIC Number,Voter Full Name,Relative Name,Age,Gender,Booth Number,Mobile Number,Residential Address\n";
    const csvRows = SAMPLE_RECORDS.map(
      (r) =>
        `"${r.epicNumber}","${r.fullName}","${r.relativeName}",${r.age},"${r.gender}","${r.boothNumber}","${r.mobile}","${r.address}"`
    ).join("\n");
    const content = `${csvHeader}${csvRows}\n`;
    const blob = new Blob([content], { type: format === "CSV" ? "text/csv;charset=utf-8;" : "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Compile and generate
  const handleGenerateReport = (title: string, format: "PDF" | "XLSX" | "CSV", recordsCount: number, cat: string) => {
    setShowPreviewModal(false);
    setIsCompiling(true);
    setCompileProgress(10);
    setTimeout(() => setCompileProgress(35), 400);
    setTimeout(() => setCompileProgress(70), 900);
    setTimeout(() => {
      setCompileProgress(100);
      setIsCompiling(false);
      const newReport: GeneratedHistoryItem = {
        id: `GEN-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        reportName: title,
        category: cat,
        generatedBy: "Adv. Vikram Patil (Candidate)",
        generatedOn: new Date().toLocaleString(),
        scope: selectedScope === "BOOTH" ? `Booth #${selectedBooth}` : "Entire Candidate Profile Scope",
        filters: `Format: ${format}, Columns: ${selectedColumns.length}`,
        format,
        records: recordsCount,
        fileSize: format === "PDF" ? "3.8 MB" : format === "XLSX" ? "5.4 MB" : "1.9 MB",
        status: "COMPLETED",
      };
      setHistoryItems((prev) => [newReport, ...prev]);
      setCompletedReport(newReport);
      showToast("success", "Report Generated", `Successfully generated "${title}" in ${format} format.`);
    }, 1500);
  };

  // Execute AI Prompt
  const handleExecuteAiPrompt = (overridePrompt?: string) => {
    const text = overridePrompt || aiPromptText;
    if (!text.trim()) {
      showToast("error", "Empty Prompt", "Please enter a natural language report instruction.");
      return;
    }
    setIsAiAnalyzing(true);
    setAiPlan(null);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      let ds = "Voters Database";
      let sc = "Kasba Peth Constituency";
      let rc = 248650;
      let fmt: "PDF" | "XLSX" | "CSV" = "PDF";
      let cols = ["fullName", "epicNumber", "age", "gender", "boothNumber", "mobile"];
      const flts = ["Authorized Access: Candidate Admin", "Status: Active Roll"];
      let narrative =
        "AI interpreted your request and identified the primary voter database as the authoritative data source. Cross-referenced booth boundaries and generated voter demographic breakdown.";

      const lower = text.toLowerCase();
      if (lower.includes("karyakarta") || lower.includes("worker")) {
        ds = "Workforce & Karyakarta";
        sc = "Active Field Cadre";
        rc = 4850;
        fmt = "XLSX";
        cols = ["name", "phone", "assignedBooth", "surveysCompleted", "voterSlipsDelivered"];
        flts.push("Surveys Completed > 150");
        narrative =
          "AI filtered the workforce performance registry. Isolated karyakartas matching the threshold criteria across all assigned prabhaags.";
      } else if (lower.includes("campaign")) {
        ds = "Campaign Outreach Engine";
        sc = "Multi-channel blasts";
        rc = 18;
        fmt = "PDF";
        cols = ["title", "type", "sentCount", "deliveredCount", "openRate"];
        flts.push("Channels: WhatsApp, SMS, Voice");
        narrative =
          "AI consolidated multi-channel campaign analytics into an executive comparative brief with read rates and delivery ratios.";
      } else if (lower.includes("update request")) {
        ds = "Karyakarta Update Requests";
        sc = "Last 30 Days Submissions";
        rc = 892;
        fmt = "XLSX";
        cols = ["id", "voterName", "karyakartaName", "status", "requestedAt"];
        flts.push("Status: PENDING", "Date >= Last 30 Days");
        narrative =
          "AI isolated unmoderated voter field updates awaiting Candidate Admin verification with change diff previews.";
      }

      setAiPlan({
        prompt: text,
        dataSource: ds,
        scope: sc,
        appliedFilters: flts,
        suggestedColumns: cols,
        estimatedRecords: rc,
        recommendedFormat: fmt,
        summaryNarrative: narrative,
      });
      showToast("success", "AI Synthesis Plan Ready", "AI synthesized custom report schema.");
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800">
      {/* SECTION 1: HEADER & SUB-VIEW TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Analytics &amp; Intelligence
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-violet-600">
              Report Generation &amp; Data Export Centre
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 ml-1">
              Soft Copy Exports
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Data Export Centre &amp; Custom Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Generate, customize, preview, and download authenticated PDF, Excel, and CSV dossiers
            across all electoral, field cadre, voter slip, and campaign databases.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab("DASHBOARD")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "DASHBOARD"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-violet-600" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("BUILDER");
              setBuilderStep(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "BUILDER"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Custom Builder</span>
          </button>
          <button
            onClick={() => setActiveTab("AI")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "AI" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Report</span>
          </button>
          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "HISTORY"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Export History ({historyItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("SAVED")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "SAVED" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Saved Presets ({savedPresets.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: 5 KPI SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Reports
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">1,248</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 8 Core Modules</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Generated Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">24</div>
          <div className="text-[11px] text-blue-600/80 mt-1">Ready for Download</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
              Scheduled Reports
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 mt-2">6</div>
          <div className="text-[11px] text-slate-500 mt-1">Nightly &amp; Weekly Runs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Recent Archives
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">48</div>
          <div className="text-[11px] text-slate-500 mt-1">In 30-Day Retention</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              Failed Jobs
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">0</div>
          <div className="text-[11px] text-slate-500 mt-1">All Queues Operational</div>
        </div>
      </div>

      {/* SECTION 3: DASHBOARD VIEW (CATALOG OF 12 REPORTS) */}
      {activeTab === "DASHBOARD" && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Generation Hero Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-blue-800/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
                  Quick Generation
                </span>
                <span className="text-xs text-blue-200">
                  Select a predefined template or configure custom variables
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight">
                Export Executive Dossiers or Raw Datasets
              </h2>
              <p className="text-xs text-blue-200/90 max-w-2xl mt-0.5">
                Every exported file includes digital verification hashes, role-based boundary verification,
                and comprehensive audit timestamps.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setActiveTab("BUILDER");
                  setBuilderStep(1);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-sm transition cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Custom Report Builder</span>
              </button>
              <button
                onClick={() => setActiveTab("AI")}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition border border-purple-400/40 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Prompt Export</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL", label: "All Categories (8)" },
              { id: "VOTER", label: "1. Voter Reports" },
              { id: "USER", label: "2. User & Karyakarta" },
              { id: "BOOTH", label: "3. Booth & Constituency" },
              { id: "CAMPAIGN", label: "4. Campaign Reports" },
              { id: "SURVEY", label: "5. Survey & Field Ops" },
              { id: "ISSUES", label: "6. Issues & Demands" },
              { id: "VOTER_SLIPS", label: "7. Voter Slip Reports" },
              { id: "ELECTION_ANALYTICS", label: "8. Election & Analytics" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategoryFilter === cat.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {item.categoryLabel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        item.defaultFormat === "PDF"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : item.defaultFormat === "XLSX"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.defaultFormat}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Scope
                      </span>
                      <span className="font-semibold text-slate-700 truncate block">
                        {item.defaultScope}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Est. Volume
                      </span>
                      <span className="font-semibold text-slate-700 truncate block">
                        {item.estimatedRecords} Records
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedDataSource(
                        item.category === "USER"
                          ? "Karyakarta"
                          : item.category === "BOOTH"
                          ? "Booths"
                          : item.category === "CAMPAIGN"
                          ? "Campaign"
                          : item.category === "ISSUES"
                          ? "Issues"
                          : "Voters"
                      );
                      setReportTitle(item.title);
                      setExportFormat(item.defaultFormat);
                      setActiveTab("BUILDER");
                      setBuilderStep(2);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Customize Scope</span>
                  </button>

                  <button
                    onClick={() => {
                      setReportTitle(item.title);
                      setExportFormat(item.defaultFormat);
                      setShowPreviewModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Preview &amp; Export</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: CUSTOM REPORT BUILDER WIZARD */}
      {activeTab === "BUILDER" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Step {builderStep} of 6
                </span>
                <h2 className="text-lg font-black text-slate-900">Custom Report Builder</h2>
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Drafting: <span className="font-bold text-slate-900">{reportTitle}</span>
              </div>
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { step: 1, label: "1. Source" },
                { step: 2, label: "2. Scope" },
                { step: 3, label: "3. Data Fields" },
                { step: 4, label: "4. Filters" },
                { step: 5, label: "5. Formatting" },
                { step: 6, label: "6. Review & Export" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setBuilderStep(s.step)}
                  className={`text-left p-2 rounded-xl transition cursor-pointer ${
                    builderStep === s.step
                      ? "bg-blue-50 border border-blue-300 font-bold text-blue-700"
                      : builderStep > s.step
                      ? "bg-slate-100 text-slate-700 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold">Step {s.step}</div>
                  <div className="text-xs truncate">{s.label.replace(/^\d+\.\s*/, "")}</div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: Select Primary Data Source */}
          {builderStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select Primary Data Source</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose the underlying module repository. Only authorized candidate records will be queryable.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {[
                  {
                    id: "Voters",
                    label: "Voters Database",
                    count: "2,48,650 Electors",
                    desc: "Roll lists, demographics, mobile numbers, relatives, and voting flags.",
                  },
                  {
                    id: "Karyakarta",
                    label: "Karyakarta & Workforce",
                    count: "4,850 Cadre",
                    desc: "Doorstep visits, survey counts, slip delivery, and live field status.",
                  },
                  {
                    id: "Booths",
                    label: "Polling Booths",
                    count: "2,045 Booths",
                    desc: "Station metadata, vulnerability indexes, BLO details, and turnout history.",
                  },
                  {
                    id: "Campaign",
                    label: "Campaigns & Broadcasts",
                    count: "18 Broadcasts",
                    desc: "WhatsApp, SMS, IVR audio blasts, open rates, and budget logs.",
                  },
                  {
                    id: "Issues",
                    label: "Civic Grievances & Demands",
                    count: "42 Tickets",
                    desc: "Constituent complaints, departmental tags, and resolution timeline.",
                  },
                  {
                    id: "Users",
                    label: "System User Accounts",
                    count: "14 Active Staff",
                    desc: "Candidate admin, war room analysts, booth adhyaksh, and role permissions.",
                  },
                ].map((src) => (
                  <div
                    key={src.id}
                    onClick={() => handleSelectDataSource(src.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      selectedDataSource === src.id
                        ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{src.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                        {src.count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{src.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Define Geographic & Entity Scope */}
          {builderStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Define Geographic &amp; Entity Scope</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isolate records to a specific constituency, booth, Karyakarta, or campaign.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    id: "CONSTITUENCY",
                    label: "Entire Candidate Profile",
                    desc: "215 - Kasba Peth (All 8 Wards, 2,045 Booths)",
                  },
                  {
                    id: "BOOTH",
                    label: "Specific Polling Booth",
                    desc: "Isolate data to a single booth or cluster",
                  },
                  {
                    id: "WORKER",
                    label: "Specific Karyakarta / User",
                    desc: "Generate dedicated individual activity dossier",
                  },
                ].map((sc) => (
                  <div
                    key={sc.id}
                    onClick={() => setSelectedScope(sc.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      selectedScope === sc.id
                        ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">{sc.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{sc.desc}</div>
                  </div>
                ))}
              </div>

              {selectedScope === "BOOTH" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Target Polling Booth
                  </label>
                  <select
                    value={selectedBooth}
                    onChange={(e) => setSelectedBooth(e.target.value)}
                    className="w-full p-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 font-medium"
                  >
                    <option value="ALL">All Booths in Ward</option>
                    <option value="101">Booth #101 - Navbharat High School, Room 1 (1,140 Voters)</option>
                    <option value="102">Booth #102 - Ganesh Krupa Bldg, Room 2 (980 Voters)</option>
                    <option value="103">Booth #103 - Swapnanagari Primary Hall (1,220 Voters)</option>
                    <option value="104">Booth #104 - Karve Nagar Samaj Mandir (1,050 Voters)</option>
                    <option value="105">Booth #105 - Prabhat Road Gymkhana (890 Voters)</option>
                  </select>
                </div>
              )}

              {selectedScope === "WORKER" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Karyakarta / Field Worker
                  </label>
                  <select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    className="w-full p-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 font-medium"
                  >
                    <option value="ALL">All Field Workers (4,850)</option>
                    <option value="vikas">Vikas Patil (Booth #101 Incharge)</option>
                    <option value="pooja">Pooja Deshmukh (Booth #107 Incharge)</option>
                    <option value="sachin">Sachin Babar (Prabhaag 12 Coordinator)</option>
                    <option value="amit">Amit Baban Shinde (Field Volunteer)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Select Columns & Data Attributes */}
          {builderStep === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Select Columns &amp; Data Attributes ({selectedColumns.length} Selected)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Check the data points you want to include in the exported report table.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAllColumns}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAllColumns}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
                {getFieldsForSource(selectedDataSource).map((f) => {
                  const isChecked = selectedColumns.includes(f.id);
                  return (
                    <div
                      key={f.id}
                      onClick={() => handleToggleColumn(f.id)}
                      className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition ${
                        isChecked
                          ? "bg-blue-50/70 border-blue-300 text-blue-900 font-bold"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xs">{f.label}</span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Apply Query Conditions & Filters */}
          {builderStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Apply Query Conditions &amp; Filters</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filter output by age range, gender, verification status, and communication availability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Gender Filter
                  </label>
                  <select className="w-full p-2 rounded-xl text-xs bg-white border border-slate-300">
                    <option>All Genders</option>
                    <option>Male Electors Only</option>
                    <option>Female Electors Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Age Bracket
                  </label>
                  <select className="w-full p-2 rounded-xl text-xs bg-white border border-slate-300">
                    <option>All Ages (18 - 100+)</option>
                    <option>Youth (18 - 29)</option>
                    <option>Middle Age (30 - 59)</option>
                    <option>Senior Citizens (60+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Mobile Number Status
                  </label>
                  <select className="w-full p-2 rounded-xl text-xs bg-white border border-slate-300">
                    <option>All Records</option>
                    <option>Has Valid Mobile (+91)</option>
                    <option>Missing Mobile Number</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Doorstep Visit Status
                  </label>
                  <select className="w-full p-2 rounded-xl text-xs bg-white border border-slate-300">
                    <option>All Records</option>
                    <option>Visited by Karyakarta</option>
                    <option>Not Visited Yet</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Output Layout & Format */}
          {builderStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Output Layout &amp; File Format</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure output file format, presentation styling, and executive summary cover page.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Report Dossier Title</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-white border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Export File Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "PDF", label: "PDF Document", desc: "Formatted dossier" },
                      { id: "XLSX", label: "Excel (XLSX)", desc: "Multi-sheet workbook" },
                      { id: "CSV", label: "Raw CSV", desc: "Fast data pipeline" },
                    ].map((fmt) => (
                      <div
                        key={fmt.id}
                        onClick={() => setExportFormat(fmt.id as "PDF" | "XLSX" | "CSV")}
                        className={`cursor-pointer p-2.5 rounded-xl border text-center transition ${
                          exportFormat === fmt.id
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-bold"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-bold">{fmt.label}</div>
                        <div className="text-[10px] text-slate-400">{fmt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSummaryPage}
                    onChange={(e) => setIncludeSummaryPage(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800">
                    Include Executive Summary Page &amp; KPI Cards
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={embedCharts}
                    onChange={(e) => setEmbedCharts(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800">
                    Embed Visual Charts &amp; Demographic Pie Breakdowns
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Live Sample Preview */}
          {builderStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Step 6: Review Configuration &amp; Generate Dossier
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm parameters before executing server-side file assembly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Title</span>
                  <span className="font-bold text-slate-900">{reportTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Data Source</span>
                  <span className="font-bold text-slate-900">{selectedDataSource}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Columns Count</span>
                  <span className="font-bold text-slate-900">{selectedColumns.length} Columns</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Export Format</span>
                  <span className="font-bold text-blue-600">{exportFormat}</span>
                </div>
              </div>

              {/* Sample Record Preview Grid */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Live Sample Record Preview (First 4 rows)
                  </span>
                  <span className="text-[11px] text-slate-400">Total estimated records: ~1,240</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 text-[10px] uppercase font-bold text-slate-500">
                        {selectedColumns.slice(0, 6).map((col) => (
                          <th key={col} className="py-2 px-3">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {SAMPLE_RECORDS.slice(0, 4).map((rec, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          {selectedColumns.slice(0, 6).map((c) => (
                            <td key={c} className="py-2.5 px-3 truncate max-w-[150px]">
                              {String(rec[c] || "—")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={builderStep === 1}
              onClick={() => setBuilderStep((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              Previous Step
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSavedPresets((prev) => [
                    {
                      id: `cfg-${Date.now()}`,
                      name: reportTitle,
                      category: selectedDataSource,
                      dataSource: selectedDataSource,
                      scope: selectedScope,
                      columns: selectedColumns,
                      filtersSummary: `${selectedColumns.length} cols, Format ${exportFormat}`,
                      format: exportFormat,
                      lastRun: "Just now",
                    },
                    ...prev,
                  ]);
                  showToast("success", "Preset Saved", `Saved configuration "${reportTitle}" as preset template.`);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
              >
                Save Configuration Preset
              </button>

              {builderStep < 6 ? (
                <button
                  onClick={() => setBuilderStep((prev) => Math.min(6, prev + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition cursor-pointer"
                >
                  <span>Continue to Step {builderStep + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleGenerateReport(reportTitle, exportFormat, 1240, selectedDataSource)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate &amp; Download {exportFormat}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: AI NATURAL LANGUAGE REPORT GENERATOR */}
      {activeTab === "AI" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                Natural Language Query
              </span>
              <span className="text-xs text-slate-500">ChatGPT-style Prompt Interface</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              AI Natural Language Report Generator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Describe your required analytical or operational report in plain language. The AI agent
              will identify authorized repositories, apply appropriate filters, and construct the download package.
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={aiPromptText}
                onChange={(e) => setAiPromptText(e.target.value)}
                placeholder="e.g. Generate a complete voter report for Booth 101 to 108 with mobile reachability and caste breakdown..."
                className="w-full p-3.5 pr-28 rounded-2xl text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              />
              <button
                disabled={isAiAnalyzing || !aiPromptText.trim()}
                onClick={() => handleExecuteAiPrompt()}
                className="absolute right-3 bottom-3 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 transition shadow-sm cursor-pointer"
              >
                {isAiAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Execute</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Click Suggested Prompt Examples:
              </span>
              <div className="flex flex-wrap gap-2">
                {AI_PROMPT_EXAMPLES.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAiPromptText(prompt);
                      handleExecuteAiPrompt(prompt);
                    }}
                    className="text-left px-3 py-1.5 rounded-xl text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition font-medium cursor-pointer"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Synthesis Plan Output */}
          {aiPlan && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-blue-50/40 border border-purple-200 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-black text-slate-900">AI Report Synthesis Plan</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                  Ready for Generation
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {aiPlan.summaryNarrative}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Data Source
                  </span>
                  <span className="font-bold text-slate-900">{aiPlan.dataSource}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Scope Filter
                  </span>
                  <span className="font-bold text-slate-900">{aiPlan.scope}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Estimated Records
                  </span>
                  <span className="font-bold text-slate-900">{aiPlan.estimatedRecords.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Recommended Format
                  </span>
                  <span className="font-bold text-purple-700">{aiPlan.recommendedFormat}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  onClick={() => {
                    setReportTitle(`AI Export: ${aiPlan.prompt.slice(0, 40)}...`);
                    setExportFormat(aiPlan.recommendedFormat);
                    setSelectedDataSource("Voters");
                    setActiveTab("BUILDER");
                    setBuilderStep(3);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-800 bg-white border border-purple-200 hover:bg-purple-50 cursor-pointer"
                >
                  Inspect / Edit Fields
                </button>
                <button
                  onClick={() =>
                    handleGenerateReport(
                      `AI Export - ${aiPlan.dataSource}`,
                      aiPlan.recommendedFormat,
                      aiPlan.estimatedRecords,
                      aiPlan.dataSource
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate &amp; Download Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: EXPORT HISTORY AUDIT LOG */}
      {activeTab === "HISTORY" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Generated Report History &amp; Audit Log</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every exported file retained for 30 days under authorized candidate governance policy.
              </p>
            </div>
            <button
              onClick={() => showToast("info", "Log Refreshed", "Refreshed export queue.")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Log</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-3">Report Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Generated By</th>
                  <th className="py-2.5 px-3">Scope &amp; Filters</th>
                  <th className="py-2.5 px-3 text-center">Format</th>
                  <th className="py-2.5 px-3 text-center">Records</th>
                  <th className="py-2.5 px-3">Generated On</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {historyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.reportName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.id} • {item.fileSize}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.category}</td>
                    <td className="py-3 px-3 text-slate-600">{item.generatedBy}</td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-500 text-[11px]">
                      <span className="font-semibold text-slate-700 block">{item.scope}</span>
                      <span className="block text-[10px] truncate">{item.filters}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          item.format === "PDF"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : item.format === "XLSX"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.format}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {item.records.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {item.generatedOn}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            triggerBrowserDownload(item.reportName, item.format);
                            showToast("success", "Download Started", `Downloading cached file for ${item.reportName} (${item.format})`);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleGenerateReport(item.reportName, item.format, item.records, item.category)}
                          title="Regenerate with current data"
                          className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 7: SAVED REPORT CONFIGURATIONS */}
      {activeTab === "SAVED" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Saved Report Configurations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved templates retain your selected data sources, columns, filters, and formats for one-click re-runs.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab("BUILDER");
                setBuilderStep(1);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              + Create New Preset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {preset.category}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-blue-600">
                      {preset.format}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{preset.name}</h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Scope: <span className="font-semibold text-slate-700">{preset.scope}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Columns: {preset.columns.length} Fields Configured
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSavedPresets((prev) => prev.filter((p) => p.id !== preset.id));
                      showToast("info", "Preset Removed", `Removed preset "${preset.name}".`);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleGenerateReport(preset.name, preset.format, 1200, preset.category)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run Report Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: PREVIEW & EXPORT MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Report Preview
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-100 text-blue-700">
                    {exportFormat}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{reportTitle}</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Candidate Profile
                  </span>
                  <span className="font-bold text-slate-900">Adv. Vikram Patil (215 - Kasba Peth)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Scope</span>
                  <span className="font-bold text-slate-900">
                    {selectedScope === "BOOTH" ? `Booth #${selectedBooth}` : "Entire Constituency"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Records</span>
                  <span className="font-bold text-slate-900">2,045 Records</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Generation Engine
                  </span>
                  <span className="font-bold text-blue-600">INDATA Core DB v2.4</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Sample Tabular Data Grid
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
                        <th className="py-2.5 px-3">EPIC ID</th>
                        <th className="py-2.5 px-3">Voter Full Name</th>
                        <th className="py-2.5 px-3">Relative Name</th>
                        <th className="py-2.5 px-3">Age / Gender</th>
                        <th className="py-2.5 px-3">Booth</th>
                        <th className="py-2.5 px-3">Mobile Reachable</th>
                        <th className="py-2.5 px-3">Karyakarta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {SAMPLE_RECORDS.slice(0, 5).map((r) => (
                        <tr key={r.id as string} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                            {r.epicNumber}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{r.fullName}</td>
                          <td className="py-2.5 px-3 text-slate-600">{r.relativeName}</td>
                          <td className="py-2.5 px-3">
                            {r.age} Yrs • {r.gender}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 font-semibold text-[11px]">
                              #{r.boothNumber}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 font-mono">{r.mobile}</td>
                          <td className="py-2.5 px-3 text-slate-600">{r.karyakartaName || "Vikas Patil"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Back to Configuration
              </button>
              <button
                onClick={() => handleGenerateReport(reportTitle, exportFormat, 2045, selectedDataSource)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Generate &amp; Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 9: COMPILING PROGRESS MODAL */}
      {isCompiling && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Compiling Report Dossier...</h3>
              <p className="text-xs text-slate-500 mt-1">
                {compileProgress < 30
                  ? "Connecting to ECI & Candidate Roll Data Stores..."
                  : compileProgress < 75
                  ? "Filtering and aggregating records across booths..."
                  : "Formatting soft copy layout and signing checksums..."}
              </p>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${compileProgress}%` }}
              />
            </div>
            <div className="text-[11px] font-bold text-slate-400">{compileProgress}% Complete</div>
          </div>
        </div>
      )}

      {/* SECTION 10: GENERATION COMPLETED MODAL */}
      {completedReport && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                Generation Completed
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">{completedReport.reportName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ready for download in {completedReport.format} format.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Records</span>
                <span className="font-bold text-slate-900">
                  {completedReport.records.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">File Size</span>
                <span className="font-bold text-slate-900">{completedReport.fileSize}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Format</span>
                <span className="font-bold text-blue-600">{completedReport.format}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setCompletedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  triggerBrowserDownload(completedReport.reportName, completedReport.format);
                  showToast(
                    "success",
                    "Download Complete",
                    `Downloaded ${completedReport.reportName} (${completedReport.format})`
                  );
                  setCompletedReport(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Soft Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
