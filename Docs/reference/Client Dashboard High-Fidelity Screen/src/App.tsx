import { useState, useRef, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ─── Icon primitive ───────────────────────────────────────────────────────────

function Icon({ d, size = 16, className = "" }: { d: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}

const I: Record<string, string> = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  voters: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  members: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  workers: "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  blo: "M9 17H5a2 2 0 0 0-2 2v2h18v-2a2 2 0 0 0-2-2h-4 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 11v6",
  booths: "M3 3h18v18H3z M3 9h18 M9 21V9",
  forms: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  campaigns: "M22 2 11 13 M22 2 15 22 9 13 2 9z",
  aiCalling: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  aiMode: "M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01",
  reports: "M18 20V10 M12 20V4 M6 20v-6",
  analysis: "M2 12h2l3-9 4 18 3-12 2 3h6",
  filters: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  importExport: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  phoneBook: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 11.8 19.79 19.79 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  updateRequests: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  activities: "M12 20V10 M18 20V4 M6 20v-6",
  organization: "M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16",
  profile: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 18l6-6-6-6",
  chevronLeft: "M15 18l-6-6 6-6",
  plus: "M12 5v14 M5 12h14",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  userPlus: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 8v6 M23 11h-6",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  building: "M3 21h18 M5 21V7l8-4v18 M19 21V11l-6-4 M9 9h1 M9 12h1 M9 15h1 M9 18h1",
  alertCircle: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M12 8v4 M12 16h.01",
  check: "M20 6L9 17l-5-5",
  checkCircle: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  x: "M18 6L6 18 M6 6l12 12",
  xCircle: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M15 9l-6 6 M9 9l6 6",
  moreHorizontal: "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  copy: "M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  qrCode: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h.01 M18 14h.01 M14 18h.01 M18 18h.01 M18 21v-3 M21 14h-3 M21 21v-3h-3",
  sliders: "M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  mapPin: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  clock: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M12 6v6l4 2",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  power: "M18.36 6.64a9 9 0 1 1-12.73 0 M12 2v10",
  externalLink: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
  refreshCw: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  info: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M12 16v-4 M12 8h.01",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  sparkle: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
  mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8",
  paperclip: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  globe: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  monitor: "M20 3H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z M8 21h8 M12 17v4",
  palette: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z M7.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M10.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M15.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M18.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  image: "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  fingerprint: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 0 0 8 11a4 4 0 1 1 8 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0 0 15.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 0 0 8 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4",
  cpu: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  hash: "M4 9h16 M4 15h16 M10 3L8 21 M16 3l-2 18",
};

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  { group: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: "dashboard" }] },
  {
    group: "Election Operations",
    items: [
      { key: "voters", label: "Voters", icon: "voters" },
      { key: "members", label: "Members", icon: "members" },
      { key: "workers", label: "Workers", icon: "workers" },
      { key: "blo", label: "BLO", icon: "blo" },
      { key: "booths", label: "Booths", icon: "booths" },
      { key: "forms", label: "Forms", icon: "forms" },
    ],
  },
  { group: "Communication", items: [{ key: "campaigns", label: "Dashboard", icon: "dashboard" }, { key: "camp-whatsapp", label: "WhatsApp", icon: "campaigns" }, { key: "camp-sms", label: "SMS", icon: "fileText" }, { key: "camp-voice", label: "Voice", icon: "phone" }, { key: "camp-scripts", label: "Scripts", icon: "fileText" }, { key: "camp-analytics", label: "Analytics", icon: "analysis" }, { key: "aiCalling", label: "AI Calling", icon: "aiCalling" }] },
  { group: "Intelligence", items: [{ key: "aiMode", label: "AI Mode", icon: "aiMode" }, { key: "ai-search", label: "AI Search", icon: "search" }, { key: "reports", label: "AI Report", icon: "reports" }, { key: "ai-campaign", label: "AI Campaign", icon: "campaigns" }, { key: "analysis", label: "Previous Election", icon: "analysis" }] },
  { group: "Data", items: [{ key: "filters", label: "Filters", icon: "filters" }, { key: "importExport", label: "Import / Export", icon: "importExport" }, { key: "phoneBook", label: "Phone Book", icon: "phoneBook" }, { key: "updateRequests", label: "Update Requests", icon: "updateRequests" }, { key: "activities", label: "Activities", icon: "activities" }] },
  { group: "Organization", items: [{ key: "organization", label: "Organization", icon: "organization" }, { key: "org-members", label: "Team Members", icon: "voters" }, { key: "org-access", label: "My Access", icon: "key" }, { key: "org-permissions", label: "Permissions", icon: "shield" }, { key: "profile", label: "Profile", icon: "profile" }, { key: "settings", label: "Settings", icon: "settings" }] },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

function ProgressBar({ value, max = 100, className = "" }: { value: number; max?: number; className?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`h-1.5 bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-[#1d4ed8] rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

type BadgeVariant = "default" | "success" | "warning" | "danger" | "muted" | "info";
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const s: Record<BadgeVariant, string> = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    muted: "bg-slate-100 text-slate-500 border-slate-200",
    info: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${s[variant]}`}>{children}</span>;
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ placeholder, type = "text", value, onChange }: { placeholder?: string; type?: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-slate-200 rounded bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
    />
  );
}

function Select({ children, placeholder }: { children: React.ReactNode; placeholder?: string }) {
  return (
    <div className="relative">
      <select className="w-full appearance-none px-3 py-2 text-sm border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:border-blue-400 transition-colors pr-8 cursor-pointer">
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <Icon d={I.chevronDown} size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ activeKey, onNav }: { activeKey: string; onNav: (k: string) => void }) {
  const activeTop = activeKey.startsWith("members") ? "members" : activeKey.startsWith("blo") ? "blo" : (activeKey === "booths" || activeKey === "booth-detail") ? "booths" : activeKey === "voters" ? "voters" : activeKey.startsWith("form") ? "forms" : activeKey.startsWith("org-") ? "organization" : activeKey.startsWith("camp-") ? "campaigns" : activeKey.startsWith("worker-") ? "workers" : activeKey;
  return (
    <aside className="flex flex-col bg-white border-r border-slate-200 w-56 shrink-0 h-full overflow-y-auto">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[#1d4ed8] rounded flex items-center justify-center text-white font-bold text-xs select-none">EM</div>
        <div>
          <div className="text-sm font-semibold text-slate-900 leading-none">ElectManager</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Election Platform</div>
        </div>
      </div>
      <nav className="flex-1 py-3 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="mb-4">
            <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 select-none">{group.group}</div>
            {group.items.map((item) => {
              const active = activeTop === item.key;
              const isMembersExpanded = item.key === "members" && activeKey.startsWith("members");
              const isBLOExpanded = item.key === "blo" && activeKey.startsWith("blo");
              const hasSubnav = item.key === "members" || item.key === "blo";
              return (
                <div key={item.key}>
                  <button
                    onClick={() => {
                      if (item.key === "members") onNav("members-board");
                      else if (item.key === "blo") onNav("blo-board");
                      else onNav(item.key);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm font-medium mb-0.5 transition-colors text-left
                      ${active ? "bg-blue-50 text-[#1d4ed8]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <Icon d={I[item.icon]} size={15} className="shrink-0" />
                    <span className="truncate flex-1">{item.label}</span>
                    {hasSubnav && <Icon d={I.chevronDown} size={12} className={`shrink-0 transition-transform ${isMembersExpanded || isBLOExpanded ? "rotate-180" : ""}`} />}
                  </button>
                  {isMembersExpanded && (
                    <div className="ml-5 border-l border-slate-200 pl-3 mb-1 space-y-0.5">
                      {[
                        { key: "members-board", label: "Members Board" },
                        { key: "members-add", label: "Add Member" },
                        { key: "members-registrations", label: "Registrations" },
                        { key: "members-reglink", label: "Registration Link" },
                      ].map((sub) => (
                        <button key={sub.key} onClick={() => onNav(sub.key)}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors
                            ${activeKey === sub.key ? "bg-blue-50 text-[#1d4ed8] font-medium" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {isBLOExpanded && (
                    <div className="ml-5 border-l border-slate-200 pl-3 mb-1 space-y-0.5">
                      {[
                        { key: "blo-board", label: "BLO Board" },
                        { key: "blo-add", label: "Add BLO" },
                      ].map((sub) => (
                        <button key={sub.key} onClick={() => onNav(sub.key)}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors
                            ${activeKey === sub.key ? "bg-blue-50 text-[#1d4ed8] font-medium" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  return (
    <header className="h-12 bg-white border-b border-slate-200 flex items-center px-5 gap-4 shrink-0">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-200 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 select-none">
        <Icon d={I.building} size={14} className="text-slate-400" />
        <span className="font-medium max-w-[110px] truncate">Rajpur District</span>
        <Icon d={I.chevronDown} size={12} className="text-slate-400" />
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-200 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 select-none">
        <span className="text-slate-400 text-xs font-medium">Election:</span>
        <span className="font-medium max-w-[120px] truncate">General 2024</span>
        <Icon d={I.chevronDown} size={12} className="text-slate-400" />
      </div>
      <div className="flex-1 max-w-xs relative">
        <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input type="text" placeholder="Search voters, booths, members…" className="w-full pl-8 pr-3 py-1.5 text-sm rounded border border-slate-200 bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
      </div>
      <div className="flex-1" />
      <div className="relative">
        <button onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }} className="relative w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition-colors">
          <Icon d={I.bell} size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-10 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Notifications</span>
              <span className="text-xs text-[#1d4ed8] cursor-pointer hover:underline">Mark all read</span>
            </div>
            {[{ text: "40 member registrations pending approval", time: "1h ago", t: "warning" }, { text: "Registration link expires in 2 days", time: "3h ago", t: "default" }, { text: "CSV import completed: 85 records", time: "5h ago", t: "success" }].map((n, i) => (
              <div key={i} className="px-4 py-3 flex gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.t === "warning" ? "bg-amber-400" : n.t === "success" ? "bg-green-400" : "bg-slate-300"}`} />
                <div><p className="text-xs text-slate-700">{n.text}</p><p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <button onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }} className="flex items-center gap-2 px-1 py-1 rounded hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 bg-[#1d4ed8] text-white rounded-full flex items-center justify-center text-xs font-semibold select-none">RK</div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">Ramesh Kumar</span>
          <Icon d={I.chevronDown} size={12} className="text-slate-400" />
        </button>
        {userOpen && (
          <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
            {["Profile", "Settings", "Sign out"].map((item) => (
              <button key={item} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">{item}</button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Members data ─────────────────────────────────────────────────────────────

type MemberStatus = "Active" | "Inactive" | "Pending" | "Suspended";
type MemberType = "Primary" | "Associate" | "Youth" | "Women" | "Senior";

interface Member {
  id: number;
  name: string;
  mobile: string;
  email: string;
  type: MemberType;
  constituency: string;
  joinDate: string;
  status: MemberStatus;
  gender: string;
  caste: string;
  ward: string;
}

const MEMBERS: Member[] = [
  { id: 1, name: "Anita Deshmukh", mobile: "98412 34567", email: "anita.d@email.com", type: "Primary", constituency: "Rajpur", joinDate: "12 Jan 2024", status: "Active", gender: "Female", caste: "General", ward: "Ward 3" },
  { id: 2, name: "Suresh Nair", mobile: "97234 56789", email: "suresh.n@email.com", type: "Associate", constituency: "Rajpur", joinDate: "08 Feb 2024", status: "Active", gender: "Male", caste: "OBC", ward: "Ward 1" },
  { id: 3, name: "Pooja Verma", mobile: "96345 67890", email: "pooja.v@email.com", type: "Youth", constituency: "Shivnagar", joinDate: "22 Feb 2024", status: "Pending", gender: "Female", caste: "General", ward: "Ward 5" },
  { id: 4, name: "Ramesh Kulkarni", mobile: "95456 78901", email: "ramesh.k@email.com", type: "Senior", constituency: "Rajpur", joinDate: "03 Mar 2024", status: "Active", gender: "Male", caste: "SC", ward: "Ward 2" },
  { id: 5, name: "Sunita Iyer", mobile: "94567 89012", email: "sunita.i@email.com", type: "Women", constituency: "Shivnagar", joinDate: "15 Mar 2024", status: "Active", gender: "Female", caste: "General", ward: "Ward 7" },
  { id: 6, name: "Vijay Patil", mobile: "93678 90123", email: "vijay.p@email.com", type: "Primary", constituency: "Rajpur", joinDate: "28 Mar 2024", status: "Inactive", gender: "Male", caste: "OBC", ward: "Ward 4" },
  { id: 7, name: "Kavya Reddy", mobile: "92789 01234", email: "kavya.r@email.com", type: "Youth", constituency: "Laxmi Nagar", joinDate: "10 Apr 2024", status: "Active", gender: "Female", caste: "ST", ward: "Ward 6" },
  { id: 8, name: "Arun Mehta", mobile: "91890 12345", email: "arun.m@email.com", type: "Associate", constituency: "Rajpur", joinDate: "22 Apr 2024", status: "Suspended", gender: "Male", caste: "General", ward: "Ward 1" },
  { id: 9, name: "Deepa Singh", mobile: "90901 23456", email: "deepa.s@email.com", type: "Women", constituency: "Shivnagar", joinDate: "05 May 2024", status: "Pending", gender: "Female", caste: "OBC", ward: "Ward 8" },
  { id: 10, name: "Manoj Tiwari", mobile: "89012 34567", email: "manoj.t@email.com", type: "Primary", constituency: "Laxmi Nagar", joinDate: "18 May 2024", status: "Active", gender: "Male", caste: "General", ward: "Ward 3" },
];

const STATUS_V: Record<MemberStatus, BadgeVariant> = { Active: "success", Inactive: "muted", Pending: "warning", Suspended: "danger" };
const TYPE_V: Record<MemberType, BadgeVariant> = { Primary: "default", Associate: "info", Youth: "success", Women: "warning", Senior: "muted" };

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// MEMBERS BOARD
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

function MembersBoard({ onNav }: { onNav: (k: string) => void }) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [filterType, setFilterType] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterConstituency, setFilterConstituency] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = MEMBERS.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.mobile.includes(search)) return false;
    if (filterType && m.type !== filterType) return false;
    if (filterGender && m.gender !== filterGender) return false;
    if (filterConstituency && m.constituency !== filterConstituency) return false;
    if (filterStatus && m.status !== filterStatus) return false;
    return true;
  });

  function toggleRow(id: number) {
    setSelectedRows((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll() {
    setSelectedRows(selectedRows.size === filtered.length ? new Set() : new Set(filtered.map((m) => m.id)));
  }

  const activeFilterCount = [filterType, filterGender, filterConstituency, filterStatus].filter(Boolean).length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
        {/* Breadcrumb + heading */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Election Management</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Members</span>
        </nav>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Members</h1>
              <Badge variant="default">1,240 total</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Manage party members, registrations and links.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <Icon d={I.upload} size={14} />Upload CSV
            </button>
            <button onClick={() => onNav("members-reglink")} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <Icon d={I.link} size={14} />Create Reg. Link
            </button>
            <button onClick={() => onNav("members-add")} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
              <Icon d={I.plus} size={14} />Add Member
            </button>
          </div>
        </div>

        {/* Search + filters */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or mobile…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>
          <div className="w-px h-6 bg-slate-200" />
          {/* Filters */}
          {[
            { label: "Member Type", val: filterType, set: setFilterType, opts: ["Primary", "Associate", "Youth", "Women", "Senior"] },
            { label: "Gender", val: filterGender, set: setFilterGender, opts: ["Male", "Female", "Other"] },
            { label: "Constituency", val: filterConstituency, set: setFilterConstituency, opts: ["Rajpur", "Shivnagar", "Laxmi Nagar"] },
            { label: "Status", val: filterStatus, set: setFilterStatus, opts: ["Active", "Inactive", "Pending", "Suspended"] },
          ].map((f) => (
            <div key={f.label} className="relative">
              <select value={f.val} onChange={(e) => f.set(e.target.value)}
                className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none focus:border-blue-400 cursor-pointer transition-colors
                  ${f.val ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"}`}>
                <option value="">{f.label}</option>
                {f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
              <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button onClick={() => { setFilterType(""); setFilterGender(""); setFilterConstituency(""); setFilterStatus(""); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-2">Clear</button>
          )}
          <div className="flex-1" />
          {/* Join Date filter */}
          <div className="relative">
            <select className="appearance-none text-sm border border-slate-200 bg-slate-50 text-slate-600 rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer">
              <option>Join Date: All</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded overflow-hidden">
            {(["table", "cards"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${view === v ? "bg-slate-100 text-slate-800" : "bg-white text-slate-400 hover:bg-slate-50"}`}>
                <Icon d={v === "table" ? I.list : I.grid} size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Result summary */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">{filtered.length.toLocaleString()} members</span>
          {activeFilterCount > 0 && <Badge variant="default">{activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied</Badge>}
        </div>

        {/* Bulk toolbar */}
        {selectedRows.size > 0 && (
          <div className="bg-[#1d4ed8] text-white rounded-md px-4 py-2.5 flex items-center gap-4">
            <span className="text-sm font-medium">{selectedRows.size} selected</span>
            <div className="w-px h-4 bg-blue-400" />
            {["Export", "Send Message", "Change Status"].map((a) => (
              <button key={a} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-500 rounded hover:bg-blue-500 transition-colors">{a}</button>
            ))}
            <div className="flex-1" />
            <button onClick={() => setSelectedRows(new Set())} className="text-blue-200 hover:text-white text-xs">Clear</button>
          </div>
        )}

        {/* Table view */}
        {view === "table" ? (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="pl-4 pr-2 py-3 w-10">
                      <input type="checkbox"
                        checked={selectedRows.size === filtered.length && filtered.length > 0}
                        ref={(el) => { if (el) el.indeterminate = selectedRows.size > 0 && selectedRows.size < filtered.length; }}
                        onChange={toggleAll}
                        className="rounded border-slate-300 accent-[#1d4ed8] cursor-pointer" />
                    </th>
                    {["Sr No", "Name", "Mobile", "Email", "Member Type", "Constituency", "Join Date", "Status", "Actions"].map((h, i) => (
                      <th key={h} className={`px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${i === 0 ? "text-center w-14" : i >= 7 ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={10} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <Icon d={I.members} size={18} className="text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-500">No members found</p>
                        <button onClick={() => { setSearch(""); setFilterType(""); setFilterGender(""); setFilterConstituency(""); setFilterStatus(""); }} className="text-xs text-[#1d4ed8] hover:underline">Clear filters</button>
                      </div>
                    </td></tr>
                  ) : filtered.map((m, idx) => {
                    const sel = selectedRows.has(m.id);
                    return (
                      <tr key={m.id} className={`transition-colors ${sel ? "bg-blue-50/60" : "hover:bg-slate-50"}`}>
                        <td className="pl-4 pr-2 py-3">
                          <input type="checkbox" checked={sel} onChange={() => toggleRow(m.id)} className="rounded border-slate-300 accent-[#1d4ed8] cursor-pointer" />
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-400 text-center font-medium">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-semibold text-slate-500 shrink-0">
                              {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800 text-sm leading-tight">{m.name}</div>
                              <div className="text-[10px] text-slate-400">{m.gender} · {m.caste}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600 font-mono">{m.mobile}</td>
                        <td className="px-3 py-3 text-xs text-slate-500">{m.email}</td>
                        <td className="px-3 py-3"><Badge variant={TYPE_V[m.type]}>{m.type}</Badge></td>
                        <td className="px-3 py-3 text-xs text-slate-600">{m.constituency}</td>
                        <td className="px-3 py-3 text-xs text-slate-500">{m.joinDate}</td>
                        <td className="px-3 py-3"><Badge variant={STATUS_V[m.status]}>{m.status}</Badge></td>
                        <td className="px-3 py-3 text-right">
                          <div className="relative inline-flex items-center gap-1">
                            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="View">
                              <Icon d={I.eye} size={13} />
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Edit">
                              <Icon d={I.edit} size={13} />
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                              <Icon d={I.trash} size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Showing {Math.min(1, filtered.length)}–{Math.min(pageSize, filtered.length)} of {filtered.length} members</span>
              <div className="flex items-center gap-1">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1">
                  <Icon d={I.chevronLeft} size={12} />Previous
                </button>
                {[1, 2, 3].map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 text-xs font-medium rounded transition-colors ${currentPage === p ? "bg-[#1d4ed8] text-white" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{p}</button>
                ))}
                <span className="text-xs text-slate-400 px-1">…</span>
                <button className="w-7 h-7 text-xs font-medium rounded text-slate-600 border border-slate-200 hover:bg-slate-50">50</button>
                <button onClick={() => setCurrentPage((p) => p + 1)} className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 flex items-center gap-1">
                  Next<Icon d={I.chevronRight} size={12} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Card view */
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((m) => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-md p-4 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{m.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.constituency}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant={STATUS_V[m.status]}>{m.status}</Badge>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Icon d={I.phone} size={11} className="text-slate-300 shrink-0" />
                    <span className="font-mono">{m.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Icon d={I.mail} size={11} className="text-slate-300 shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Icon d={I.calendar} size={11} className="text-slate-300 shrink-0" />
                    <span>Joined {m.joinDate}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Badge variant={TYPE_V[m.type]}>{m.type}</Badge>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.eye} size={13} /></button>
                    <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.edit} size={13} /></button>
                    <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors"><Icon d={I.trash} size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// ADD MEMBER — multi-step form
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

const STEPS = [
  { n: 1, label: "Identity", icon: "user" },
  { n: 2, label: "Address", icon: "mapPin" },
  { n: 3, label: "Profile", icon: "eye" },
  { n: 4, label: "Occupation", icon: "briefcase" },
  { n: 5, label: "Political", icon: "flag" },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors
              ${s.n < current ? "bg-[#1d4ed8] border-[#1d4ed8] text-white" : s.n === current ? "bg-white border-[#1d4ed8] text-[#1d4ed8]" : "bg-white border-slate-200 text-slate-400"}`}>
              {s.n < current ? <Icon d={I.check} size={13} /> : s.n}
            </div>
            <span className={`mt-1 text-[10px] font-medium whitespace-nowrap ${s.n === current ? "text-[#1d4ed8]" : s.n < current ? "text-slate-600" : "text-slate-400"}`}>
              {s.label}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`h-px w-16 mx-2 mb-5 ${s.n < current ? "bg-[#1d4ed8]" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function AddMember({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);

  function StepContent() {
    if (step === 1) return (
      <div className="space-y-5">
        <div className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">Personal Identity</div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name" required><Input placeholder="Enter first name" /></FormField>
          <FormField label="Last Name" required><Input placeholder="Enter last name" /></FormField>
          <FormField label="Mobile Number" required><Input placeholder="Enter mobile number" type="tel" /></FormField>
          <FormField label="Member Type" required>
            <Select placeholder="Select type">
              {["Primary", "Associate", "Youth", "Women", "Senior"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Gender" required>
            <Select placeholder="Select gender">
              {["Male", "Female", "Other"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Date of Birth"><Input type="date" /></FormField>
          <FormField label="Marital Status">
            <Select placeholder="Select status">
              {["Single", "Married", "Widowed", "Divorced"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Caste">
            <Select placeholder="Select caste">
              {["General", "OBC", "SC", "ST", "Other"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Caste Category">
            <Select placeholder="Select category">
              {["Category A", "Category B", "Category C"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Relation Type">
                <Select placeholder="Select relation">
                  {["Father", "Mother", "Spouse", "Guardian"].map((o) => <option key={o}>{o}</option>)}
                </Select>
              </FormField>
              <FormField label="Relation Name"><Input placeholder="Enter name" /></FormField>
            </div>
          </div>
        </div>
      </div>
    );
    if (step === 2) return (
      <div className="space-y-5">
        <div className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">Address Details</div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="House / Flat No."><Input placeholder="e.g. A-204" /></FormField>
          <FormField label="Street / Area"><Input placeholder="Enter street name" /></FormField>
          <FormField label="Village / Locality"><Input placeholder="Enter village or locality" /></FormField>
          <FormField label="Ward / Block">
            <Select placeholder="Select ward">
              {["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Booth">
            <Select placeholder="Select booth">
              {["Booth 8", "Booth 17", "Booth 31", "Booth 42", "Booth 55"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Constituency">
            <Select placeholder="Select constituency">
              {["Rajpur", "Shivnagar", "Laxmi Nagar"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="City / Town"><Input placeholder="Enter city" /></FormField>
          <FormField label="District"><Input placeholder="Enter district" /></FormField>
          <FormField label="State">
            <Select placeholder="Select state">
              {["Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="PIN Code"><Input placeholder="Enter 6-digit PIN" /></FormField>
        </div>
        <div className="pt-2">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input type="checkbox" className="rounded border-slate-300 accent-[#1d4ed8]" />
            Permanent address same as current address
          </label>
        </div>
      </div>
    );
    if (step === 3) return (
      <div className="space-y-5">
        <div className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">Profile Information</div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email Address"><Input type="email" placeholder="member@email.com" /></FormField>
          <FormField label="WhatsApp Number"><Input type="tel" placeholder="Same as mobile?" /></FormField>
          <FormField label="Voter ID (EPIC)"><Input placeholder="e.g. RJP0042817" /></FormField>
          <FormField label="Aadhaar Number"><Input placeholder="Last 4 digits only" /></FormField>
          <FormField label="Education Qualification">
            <Select placeholder="Select qualification">
              {["Below Matric", "Matric", "Intermediate", "Graduate", "Post-Graduate", "Doctorate"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Blood Group">
            <Select placeholder="Select blood group">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
        </div>
        <div>
          <FormField label="Profile Photo">
            <div className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <Icon d={I.upload} size={20} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-500">Click to upload or drag & drop</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 2 MB</p>
            </div>
          </FormField>
        </div>
        <div>
          <FormField label="Notes / Remarks">
            <textarea placeholder="Optional internal notes…" rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors resize-none" />
          </FormField>
        </div>
      </div>
    );
    if (step === 4) return (
      <div className="space-y-5">
        <div className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">Occupation Details</div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Occupation">
            <Select placeholder="Select occupation">
              {["Farmer", "Business", "Government Employee", "Private Employee", "Self-Employed", "Student", "Homemaker", "Retired", "Other"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Annual Income">
            <Select placeholder="Select range">
              {["Below 1 Lakh", "1–3 Lakh", "3–5 Lakh", "5–10 Lakh", "Above 10 Lakh"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Employer / Business Name"><Input placeholder="Company or business name" /></FormField>
          <FormField label="Designation / Role"><Input placeholder="e.g. Manager, Owner" /></FormField>
          <FormField label="Work City"><Input placeholder="City where you work" /></FormField>
          <FormField label="Years of Experience"><Input type="number" placeholder="0" /></FormField>
        </div>
        <div className="pt-2">
          <div className="text-xs font-medium text-slate-600 mb-2">Skills & Expertise</div>
          <div className="flex flex-wrap gap-2">
            {["Social Work", "Legal", "Media / PR", "IT / Tech", "Finance", "Healthcare", "Education", "Transport"].map((skill) => (
              <label key={skill} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded text-xs text-slate-600 cursor-pointer hover:bg-slate-50 select-none">
                <input type="checkbox" className="accent-[#1d4ed8] rounded" />
                {skill}
              </label>
            ))}
          </div>
        </div>
      </div>
    );
    if (step === 5) return (
      <div className="space-y-5">
        <div className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">Political Information</div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Party Membership Since"><Input type="date" /></FormField>
          <FormField label="Membership ID"><Input placeholder="Existing membership ID" /></FormField>
          <FormField label="Assigned Constituency">
            <Select placeholder="Select constituency">
              {["Rajpur", "Shivnagar", "Laxmi Nagar"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Assigned Booth">
            <Select placeholder="Select booth">
              {["Booth 8", "Booth 17", "Booth 31", "Booth 42", "Booth 55"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Political Role">
            <Select placeholder="Select role">
              {["Booth President", "Block Coordinator", "Ward Secretary", "Youth Leader", "General Member", "Observer"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
          <FormField label="Referring Member"><Input placeholder="Name of referring member" /></FormField>
        </div>
        <div>
          <FormField label="Previous Party Affiliation">
            <Select placeholder="If applicable">
              {["None", "INC", "BJP", "AAP", "BSP", "SP", "Other"].map((o) => <option key={o}>{o}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="space-y-2 pt-2">
          <div className="text-xs font-medium text-slate-600 mb-2">Terms & Agreements</div>
          {["I confirm this member has agreed to the party constitution.", "Member has provided valid KYC documents.", "All information provided is accurate to the best of my knowledge."].map((t) => (
            <label key={t} className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
              <input type="checkbox" className="accent-[#1d4ed8] rounded mt-0.5 shrink-0" />
              {t}
            </label>
          ))}
        </div>
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 flex items-center gap-3">
            <Icon d={I.checkCircle} size={16} className="text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Member added successfully</p>
              <p className="text-xs text-green-600 mt-0.5">The member record has been saved and is pending approval.</p>
            </div>
          </div>
        )}
      </div>
    );
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[800px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span onClick={onBack} className="hover:text-slate-600 cursor-pointer">Members</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Add Member</span>
        </nav>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Add Member</h1>
            <p className="text-sm text-slate-500 mt-0.5">Register a new party member. Complete all required fields.</p>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <Icon d={I.chevronLeft} size={14} />Back to Members
          </button>
        </div>

        {/* Step indicator */}
        <div className="bg-white border border-slate-200 rounded-md px-6 py-5 flex justify-center">
          <StepIndicator current={step} total={STEPS.length} />
        </div>

        {/* Step content */}
        <div className="bg-white border border-slate-200 rounded-md p-6">
          <StepContent />
        </div>

        {/* Actions */}
        <div className="bg-white border border-slate-200 rounded-md px-5 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-400">Step {step} of {STEPS.length}: {STEPS[step - 1].label}</div>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={() => setStep((s) => s - 1)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Icon d={I.chevronLeft} size={14} />Back
              </button>
            )}
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Save Draft
            </button>
            {step < STEPS.length ? (
              <button onClick={() => setStep((s) => s + 1)} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
                Continue<Icon d={I.chevronRight} size={14} />
              </button>
            ) : (
              <button onClick={() => setSaved(true)} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors flex items-center gap-2">
                <Icon d={I.check} size={14} />Submit Member
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// REGISTRATIONS
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

type RegStatus = "Pending" | "Approved" | "Rejected";

interface Registration {
  id: number;
  name: string;
  mobile: string;
  type: MemberType;
  submitted: string;
  status: RegStatus;
  constituency: string;
}

const REGS: Registration[] = [
  { id: 1, name: "Kartik Sharma", mobile: "98712 34500", type: "Youth", submitted: "01 Sep 2024", status: "Pending", constituency: "Rajpur" },
  { id: 2, name: "Lalita Devi", mobile: "97823 45611", type: "Women", submitted: "01 Sep 2024", status: "Pending", constituency: "Shivnagar" },
  { id: 3, name: "Vivek Pandey", mobile: "96934 56722", type: "Primary", submitted: "31 Aug 2024", status: "Approved", constituency: "Rajpur" },
  { id: 4, name: "Rekha Gupta", mobile: "95045 67833", type: "Associate", submitted: "30 Aug 2024", status: "Approved", constituency: "Laxmi Nagar" },
  { id: 5, name: "Ashok Yadav", mobile: "94156 78944", type: "Senior", submitted: "29 Aug 2024", status: "Rejected", constituency: "Rajpur" },
  { id: 6, name: "Priti Jain", mobile: "93267 89055", type: "Women", submitted: "29 Aug 2024", status: "Pending", constituency: "Shivnagar" },
  { id: 7, name: "Nikhil Soni", mobile: "92378 90166", type: "Youth", submitted: "28 Aug 2024", status: "Approved", constituency: "Rajpur" },
  { id: 8, name: "Sarita Kumari", mobile: "91489 01277", type: "Primary", submitted: "27 Aug 2024", status: "Rejected", constituency: "Laxmi Nagar" },
];

const REG_STATUS_V: Record<RegStatus, BadgeVariant> = { Pending: "warning", Approved: "success", Rejected: "danger" };

function Registrations() {
  const [tab, setTab] = useState<"All" | RegStatus>("All");
  const filtered = REGS.filter((r) => tab === "All" || r.status === tab);

  const counts = {
    Total: REGS.length,
    Pending: REGS.filter((r) => r.status === "Pending").length,
    Approved: REGS.filter((r) => r.status === "Approved").length,
    Rejected: REGS.filter((r) => r.status === "Rejected").length,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Members</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Registrations</span>
        </nav>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Registrations</h1>
            <p className="text-sm text-slate-500 mt-0.5">Review and approve incoming member registration requests.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <Icon d={I.download} size={14} />Export
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Registrations", value: counts.Total, icon: I.members, variant: "muted" as BadgeVariant },
            { label: "Pending Review", value: counts.Pending, icon: I.clock, variant: "warning" as BadgeVariant },
            { label: "Approved", value: counts.Approved, icon: I.checkCircle, variant: "success" as BadgeVariant },
            { label: "Rejected", value: counts.Rejected, icon: I.xCircle, variant: "danger" as BadgeVariant },
          ].map((c) => (
            <div key={c.label} className="bg-white border border-slate-200 rounded-md p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{c.label}</span>
                <div className="w-7 h-7 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-400">
                  <Icon d={c.icon} size={13} />
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900 tracking-tight">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="border-b border-slate-200 flex px-4">
            {(["All", "Pending", "Approved", "Rejected"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors
                  ${tab === t ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {t}
                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded font-semibold
                  ${tab === t ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                  {t === "All" ? counts.Total : counts[t as RegStatus]}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Name", "Mobile", "Member Type", "Constituency", "Submitted", "Status", "Actions"].map((h, i) => (
                    <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${i >= 5 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Icon d={I.checkCircle} size={28} className="text-slate-200" />
                      <p className="text-sm text-slate-500">No registrations in this category</p>
                    </div>
                  </td></tr>
                ) : filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-semibold text-slate-500 shrink-0">
                          {r.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium text-slate-800">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">{r.mobile}</td>
                    <td className="px-4 py-3"><Badge variant={TYPE_V[r.type]}>{r.type}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{r.constituency}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{r.submitted}</td>
                    <td className="px-4 py-3 text-right"><Badge variant={REG_STATUS_V[r.status]}>{r.status}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors" title="View details">
                          <Icon d={I.eye} size={13} />
                        </button>
                        {r.status === "Pending" && (
                          <>
                            <button className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors">Approve</button>
                            <button className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors">Reject</button>
                          </>
                        )}
                        {r.status === "Approved" && (
                          <button className="px-2.5 py-1 text-xs font-medium text-[#1d4ed8] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">View Member</button>
                        )}
                        {r.status === "Rejected" && (
                          <button className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors">Re-review</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Showing {filtered.length} of {REGS.length} registrations</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 flex items-center gap-1 disabled:opacity-40" disabled>
                <Icon d={I.chevronLeft} size={12} />Previous
              </button>
              <button className="w-7 h-7 text-xs font-medium rounded bg-[#1d4ed8] text-white">1</button>
              <button className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 flex items-center gap-1">
                Next<Icon d={I.chevronRight} size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// REGISTRATION LINK
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

type LinkState = "active" | "expired" | "deactivated";

function QRCodeSVG({ value }: { value: string }) {
  // A visually representative QR-code placeholder using a grid pattern
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const size = 13;
  const cells: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      // Fixed finder patterns
      const inFinder = (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);
      if (inFinder) return (r === 0 || r === 2 || c === 0 || c === 2 || (r === 1 && c === 1));
      return ((seed * (r + 1) * (c + 1) * 2654435761) & 0xffff) > 0x8000;
    })
  );
  const cellSize = 8;
  const svgSize = size * cellSize + 16;
  return (
    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={svgSize} height={svgSize} fill="white" />
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? <rect key={`${r}-${c}`} x={c * cellSize + 8} y={r * cellSize + 8} width={cellSize - 1} height={cellSize - 1} fill="#0f172a" /> : null
        )
      )}
    </svg>
  );
}

function RegistrationLink() {
  const [linkState, setLinkState] = useState<LinkState>("active");
  const [copied, setCopied] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const regUrl = "https://electmanager.app/register/rajpur-2024-x7k9m";
  const expiryDate = "15 Sep 2024";
  const registrationsViaLink = 214;

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const STATE_CONFIG: Record<LinkState, { label: string; variant: BadgeVariant; desc: string }> = {
    active: { label: "Active", variant: "success", desc: "This link is live and accepting registrations." },
    expired: { label: "Expired", variant: "warning", desc: "This link has passed its expiry date and is no longer accepting registrations." },
    deactivated: { label: "Deactivated", variant: "danger", desc: "This link has been manually deactivated." },
  };

  const stateInfo = STATE_CONFIG[linkState];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[900px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Members</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Registration Link</span>
        </nav>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Registration Link</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage the public registration link and QR code for new members.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
            <Icon d={I.plus} size={14} />Create New Link
          </button>
        </div>

        {/* State switcher (demo) */}
        <div className="bg-white border border-slate-200 rounded-md px-4 py-2.5 flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Preview state:</span>
          {(["active", "expired", "deactivated"] as LinkState[]).map((s) => (
            <button key={s} onClick={() => setLinkState(s)}
              className={`px-3 py-1 text-xs font-medium rounded border transition-colors capitalize
                ${linkState === s ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Main link card */}
        <div className="bg-white border border-slate-200 rounded-md">
          {/* Header bar */}
          <div className={`px-5 py-3 border-b flex items-center justify-between rounded-t-md
            ${linkState === "active" ? "bg-green-50 border-green-100" : linkState === "expired" ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${linkState === "active" ? "bg-green-500" : linkState === "expired" ? "bg-amber-400" : "bg-red-400"}`} />
              <span className="text-sm font-semibold text-slate-800">
                {linkState === "active" ? "Active Registration Link" : linkState === "expired" ? "Expired Link" : "Deactivated Link"}
              </span>
              <Badge variant={stateInfo.variant}>{stateInfo.label}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Icon d={I.clock} size={13} />
              {linkState === "active" ? `Expires ${expiryDate}` : linkState === "expired" ? `Expired ${expiryDate}` : `Deactivated on ${expiryDate}`}
            </div>
          </div>

          <div className="p-5 grid grid-cols-[1fr_auto] gap-8">
            {/* Left: link info */}
            <div className="space-y-5">
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1.5">Registration URL</div>
                <div className={`flex items-center gap-2 bg-slate-50 border rounded-md px-3 py-2.5 ${linkState !== "active" ? "opacity-60" : ""}`}>
                  <Icon d={I.link} size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700 font-mono flex-1 truncate">{regUrl}</span>
                  <button
                    onClick={handleCopy}
                    disabled={linkState !== "active"}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                      bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                  >
                    <Icon d={copied ? I.check : I.copy} size={12} className={copied ? "text-green-500" : ""} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  {linkState === "active" && (
                    <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border bg-white border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
                      <Icon d={I.externalLink} size={12} />Open
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{stateInfo.desc}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-1">
                {[
                  { label: "Registrations via link", value: registrationsViaLink.toString(), icon: I.members },
                  { label: "Pending approval", value: "40", icon: I.clock },
                  { label: "Approved members", value: "174", icon: I.checkCircle },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon d={s.icon} size={13} className="text-slate-400" />
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{s.label}</span>
                    </div>
                    <div className="text-xl font-semibold text-slate-800">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Link details */}
              <div className="bg-slate-50 border border-slate-100 rounded-md p-4 space-y-2.5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Link Details</div>
                {[
                  { label: "Created by", value: "Ramesh Kumar" },
                  { label: "Created on", value: "01 Aug 2024" },
                  { label: "Expiry date", value: expiryDate },
                  { label: "Constituency", value: "Rajpur" },
                  { label: "Member type", value: "All types" },
                  { label: "Max registrations", value: "Unlimited" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{d.label}</span>
                    <span className="font-medium text-slate-700">{d.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-1">
                {linkState === "active" && (
                  <>
                    <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                      <Icon d={I.edit} size={14} />Edit Link
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                      <Icon d={I.download} size={14} />Download QR
                    </button>
                    <button onClick={() => setConfirmDeactivate(true)} className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors">
                      <Icon d={I.power} size={14} />Deactivate Link
                    </button>
                  </>
                )}
                {(linkState === "expired" || linkState === "deactivated") && (
                  <>
                    <button onClick={() => setLinkState("active")} className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
                      <Icon d={I.refreshCw} size={14} />Reactivate Link
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                      <Icon d={I.plus} size={14} />Create New Link
                    </button>
                  </>
                )}
              </div>

              {/* Deactivate confirmation */}
              {confirmDeactivate && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Icon d={I.alertCircle} size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Deactivate this link?</p>
                      <p className="text-xs text-red-600 mt-0.5">Existing registrations will be preserved. New registrations via this URL will be rejected.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setLinkState("deactivated"); setConfirmDeactivate(false); }}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors">
                      Yes, Deactivate
                    </button>
                    <button onClick={() => setConfirmDeactivate(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: QR code */}
            <div className="flex flex-col items-center gap-4 min-w-[180px]">
              <div className="text-xs font-medium text-slate-500 self-start">QR Code</div>
              <div className={`border border-slate-200 rounded-md p-4 bg-white ${linkState !== "active" ? "opacity-40 grayscale" : ""}`}>
                <QRCodeSVG value={regUrl} />
              </div>
              {linkState === "active" ? (
                <div className="space-y-2 w-full">
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
                    <Icon d={I.download} size={14} />Download PNG
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                    <Icon d={I.copy} size={14} />Copy Link
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 text-center">QR code unavailable while link is {linkState}.</p>
              )}
              <div className="text-center">
                <p className="text-[10px] text-slate-400 leading-relaxed">Scan to open the registration form directly on mobile.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow guide */}
        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Registration Workflow</div>
          <div className="flex items-start gap-0">
            {[
              { n: "1", title: "Share Link or QR", desc: "Send the URL or display the QR code at events, social media, or posters.", icon: I.link },
              { n: "2", title: "Applicant Fills Form", desc: "The applicant completes the self-registration form with personal details.", icon: I.fileText },
              { n: "3", title: "Pending Review", desc: "Submission appears in Registrations under the Pending tab.", icon: I.clock },
              { n: "4", title: "Admin Approves", desc: "Admin reviews and approves or rejects. Approved applicants become active members.", icon: I.checkCircle },
            ].map((step, i, arr) => (
              <div key={step.n} className="flex items-start flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1d4ed8] shrink-0">
                    <Icon d={step.icon} size={14} />
                  </div>
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1 min-h-[24px]" />}
                </div>
                <div className="ml-3 pb-5 flex-1 pr-4">
                  <div className="text-xs font-semibold text-slate-700">{step.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create new link modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white border border-slate-200 rounded-lg shadow-xl w-[480px] max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Create Registration Link</span>
              <button onClick={() => setShowCreate(false)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors">
                <Icon d={I.x} size={15} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-md px-4 py-3 flex items-start gap-2.5">
                <Icon d={I.info} size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">A unique registration URL and QR code will be generated. Share it publicly to collect member applications.</p>
              </div>
              <FormField label="Constituency" required>
                <Select placeholder="Select constituency">
                  {["Rajpur", "Shivnagar", "Laxmi Nagar"].map((o) => <option key={o}>{o}</option>)}
                </Select>
              </FormField>
              <FormField label="Allowed Member Type">
                <Select placeholder="All types">
                  {["All types", "Primary", "Associate", "Youth", "Women", "Senior"].map((o) => <option key={o}>{o}</option>)}
                </Select>
              </FormField>
              <FormField label="Expiry Date" required><Input type="date" /></FormField>
              <FormField label="Max Registrations">
                <Input type="number" placeholder="Leave blank for unlimited" />
              </FormField>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input type="checkbox" className="accent-[#1d4ed8] rounded" defaultChecked />
                Require admin approval before activation
              </label>
            </div>
            <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => { setShowCreate(false); setLinkState("active"); }} className="px-4 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Icon d={I.link} size={14} />Generate Link & QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// DASHBOARD (retained)
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

const GENDER_DATA = [
  { name: "Male", value: 128640, color: "#1d4ed8" },
  { name: "Female", value: 110890, color: "#6366f1" },
  { name: "Other / Unknown", value: 5780, color: "#94a3b8" },
];
const CASTE_DATA = [
  { name: "General", value: 89450 }, { name: "OBC", value: 72310 },
  { name: "SC", value: 54820 }, { name: "ST", value: 18930 }, { name: "Other", value: 9800 },
];
const TOP_BOOTHS = [
  { rank: 1, booth: "Booth 42", location: "Rajpur Ward A", total: 1842, male: 964, female: 878, coverage: 94 },
  { rank: 2, booth: "Booth 17", location: "Laxmi Nagar", total: 1790, male: 901, female: 889, coverage: 91 },
  { rank: 3, booth: "Booth 08", location: "Gandhi Chowk", total: 1724, male: 876, female: 848, coverage: 88 },
  { rank: 4, booth: "Booth 31", location: "Shivaji Market", total: 1698, male: 855, female: 843, coverage: 86 },
  { rank: 5, booth: "Booth 55", location: "Nehru Colony", total: 1643, male: 820, female: 823, coverage: 83 },
];

function StatCard({ label, value, sub, iconPath }: { label: string; value: string; sub?: string; iconPath: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-400"><Icon d={iconPath} size={15} /></div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function Dashboard({ onNav }: { onNav: (k: string) => void }) {
  const CUSTOM_LABEL = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="500">{`${(percent * 100).toFixed(0)}%`}</text> : null;
  };
  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        <div className="flex items-start justify-between">
          <div><h1 className="text-xl font-semibold text-slate-900 tracking-tight">Dashboard</h1><p className="text-sm text-slate-500 mt-0.5">Overview of your election organization and voter operations.</p></div>
          <div className="flex items-center gap-2"><span className="text-xs text-slate-400">Last updated: 2 min ago</span><button className="text-xs text-[#1d4ed8] hover:underline font-medium">Refresh</button></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-md px-4 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Election:</span>
            <div className="relative"><select className="appearance-none text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded px-3 py-1.5 pr-7 focus:outline-none focus:border-blue-400 cursor-pointer"><option>General Election 2024</option></select><Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Constituency:</span>
            <div className="relative"><select className="appearance-none text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded px-3 py-1.5 pr-7 focus:outline-none focus:border-blue-400 cursor-pointer"><option>Rajpur Constituency</option></select><Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <StatCard label="Total Voters" value="2,45,310" sub="Registered electorate" iconPath={I.voters} />
          <StatCard label="Members" value="1,240" sub="12 pending approval" iconPath={I.members} />
          <StatCard label="Workers" value="486" sub="Across 180 booths" iconPath={I.workers} />
          <StatCard label="Booths" value="180" sub="148 fully covered" iconPath={I.booths} />
          <StatCard label="BLO" value="180" sub="All assigned" iconPath={I.blo} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Organization Score</div>
            <div className="flex items-end gap-3 mb-3"><span className="text-4xl font-bold text-slate-900 tracking-tight">82%</span><Badge variant="success">Good</Badge></div>
            <ProgressBar value={82} className="mb-3" />
            <p className="text-xs text-slate-500 leading-relaxed">Good coverage across constituency. 32 booths need additional worker assignments.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Booth Coverage</div>
            <div className="flex items-end gap-2 mb-1"><span className="text-4xl font-bold text-slate-900 tracking-tight">148</span><span className="text-base text-slate-400 mb-1">/ 180</span></div>
            <p className="text-xs text-slate-500 mb-3">82% booths fully covered</p>
            <ProgressBar value={148} max={180} className="mb-5" />
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              {[{ v: "148", l: "Complete", c: "text-green-600" }, { v: "24", l: "Partial", c: "text-amber-500" }, { v: "8", l: "Unassigned", c: "text-red-500" }].map((s, i) => (
                <div key={i} className={`text-center ${i !== 0 ? "border-l border-slate-100" : ""}`}><div className={`text-lg font-semibold ${s.c}`}>{s.v}</div><div className="text-[10px] text-slate-400 mt-0.5">{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <div className="flex items-center justify-between mb-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Missing Voter Data</div><Icon d={I.alertCircle} size={14} className="text-amber-400" /></div>
            <div className="space-y-3">
              {[{ label: "Mobile numbers missing", value: "12,420", pct: 5.1, v: "warning" as BadgeVariant }, { label: "Address info missing", value: "3,210", pct: 1.3, v: "warning" as BadgeVariant }, { label: "Duplicate records", value: "840", pct: 0.3, v: "danger" as BadgeVariant }].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.v === "warning" ? "bg-amber-400" : "bg-red-400"}`} /><span className="text-slate-600 truncate max-w-[130px]">{item.label}</span></div>
                  <div className="flex items-center gap-2"><span className="font-medium text-slate-800">{item.value}</span><Badge variant={item.v}>{item.pct}%</Badge></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Gender Distribution</div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart><Pie data={GENDER_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={72} dataKey="value" labelLine={false} label={CUSTOM_LABEL}>{GENDER_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip formatter={(v: number) => v.toLocaleString()} /></PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {GENDER_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: item.color }} /><span className="text-slate-600">{item.name}</span></div><div className="text-right"><div className="font-semibold text-slate-800">{item.value.toLocaleString()}</div><div className="text-slate-400">{((item.value / 245310) * 100).toFixed(1)}%</div></div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Caste Distribution</div>
            <ResponsiveContainer width="100%" height={160}><BarChart data={CASTE_DATA} layout="vertical" margin={{ left: 0, right: 24, top: 0, bottom: 0 }}><XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={50} /><Tooltip formatter={(v: number) => v.toLocaleString()} /><Bar dataKey="value" fill="#1d4ed8" radius={[0, 2, 2, 0]} /></BarChart></ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="flex items-center justify-between mb-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member Summary</div><button onClick={() => onNav("members-board")} className="text-xs text-[#1d4ed8] hover:underline font-medium">View Members →</button></div>
          <div className="grid grid-cols-4 gap-0 divide-x divide-slate-100">
            {[{ label: "Total Members", value: "1,240", sub: "All time" }, { label: "Active", value: "1,048", sub: "84.5% of total", color: "text-green-600" }, { label: "Inactive", value: "152", sub: "12.3% of total", color: "text-slate-400" }, { label: "Pending", value: "40", sub: "Awaiting approval", color: "text-amber-500" }].map((item) => (
              <div key={item.label} className="px-5 first:pl-0 last:pr-0 text-center"><div className={`text-2xl font-semibold tracking-tight ${(item as { color?: string }).color || "text-slate-900"}`}>{item.value}</div><div className="text-xs font-medium text-slate-700 mt-0.5">{item.label}</div><div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div></div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-md">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top Booths by Voter Count</div><button className="text-xs text-[#1d4ed8] hover:underline font-medium">View All →</button></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50">{["#", "Booth", "Location", "Total", "Male", "Female", "Coverage"].map((h, i) => (<th key={h} className={`px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide ${i === 0 ? "pl-5 w-10 text-left" : i < 3 ? "text-left" : i === 6 ? "text-left w-36" : "text-right"}`}>{h}</th>))}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {TOP_BOOTHS.map((row) => (<tr key={row.rank} className="hover:bg-slate-50 transition-colors"><td className="px-5 py-3 text-xs font-medium text-slate-400">{row.rank}</td><td className="px-4 py-3 font-medium text-slate-800">{row.booth}</td><td className="px-4 py-3 text-slate-500">{row.location}</td><td className="px-4 py-3 text-right font-medium text-slate-800">{row.total.toLocaleString()}</td><td className="px-4 py-3 text-right text-slate-600">{row.male.toLocaleString()}</td><td className="px-4 py-3 text-right text-slate-600">{row.female.toLocaleString()}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><ProgressBar value={row.coverage} className="flex-1" /><span className="text-xs text-slate-500 w-8 text-right">{row.coverage}%</span></div></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// VOTER BOARD (retained, abbreviated)
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

type VoterStatus = "Supporter" | "Opponent" | "Doubtful" | "Neutral" | "Visited";
interface Voter { id: number; name: string; epic: string; gender: string; age: number; caste: string; mobile: string; booth: string; ward: string; status: VoterStatus; favorite: boolean; }
const STATUS_V_VOTER: Record<VoterStatus, BadgeVariant> = { Supporter: "success", Opponent: "danger", Doubtful: "warning", Neutral: "muted", Visited: "info" };
const SAMPLE_VOTERS: Voter[] = [
  { id: 1, name: "Rahul Sharma", epic: "RJP0042817", gender: "Male", age: 42, caste: "General", mobile: "98****2121", booth: "Booth 102", ward: "Ward 5", status: "Supporter", favorite: false },
  { id: 2, name: "Amit Patel", epic: "RJP0031445", gender: "Male", age: 35, caste: "OBC", mobile: "97****4578", booth: "Booth 102", ward: "Ward 5", status: "Neutral", favorite: false },
  { id: 3, name: "Priya Shah", epic: "RJP0068820", gender: "Female", age: 29, caste: "General", mobile: "96****8899", booth: "Booth 103", ward: "Ward 6", status: "Doubtful", favorite: true },
  { id: 4, name: "Sunita Devi", epic: "RJP0091234", gender: "Female", age: 55, caste: "SC", mobile: "—", booth: "Booth 17", ward: "Ward 3", status: "Supporter", favorite: false },
  { id: 5, name: "Manoj Verma", epic: "RJP0055670", gender: "Male", age: 48, caste: "OBC", mobile: "95****3344", booth: "Booth 42", ward: "Ward 2", status: "Opponent", favorite: false },
  { id: 6, name: "Kavita Joshi", epic: "RJP0073391", gender: "Female", age: 33, caste: "General", mobile: "94****1122", booth: "Booth 55", ward: "Ward 8", status: "Supporter", favorite: true },
  { id: 7, name: "Deepak Yadav", epic: "RJP0044562", gender: "Male", age: 27, caste: "OBC", mobile: "93****7766", booth: "Booth 31", ward: "Ward 4", status: "Neutral", favorite: false },
  { id: 8, name: "Anjali Gupta", epic: "RJP0082214", gender: "Female", age: 61, caste: "General", mobile: "92****5544", booth: "Booth 08", ward: "Ward 1", status: "Doubtful", favorite: false },
  { id: 9, name: "Ravi Kumar", epic: "RJP0019873", gender: "Male", age: 38, caste: "ST", mobile: "91****9900", booth: "Booth 17", ward: "Ward 3", status: "Supporter", favorite: false },
  { id: 10, name: "Meena Kumari", epic: "RJP0066341", gender: "Female", age: 44, caste: "SC", mobile: "—", booth: "Booth 42", ward: "Ward 2", status: "Neutral", favorite: false },
];

function VoterBoard() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalVoters = 4250;
  const pageSize = 10;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalVoters);
  const totalPages = Math.ceil(totalVoters / pageSize);

  function toggleFilter(k: string) {
    setActiveFilters((p) => p.includes(k) ? p.filter((f) => f !== k) : [...p, k]);
  }
  function toggleRow(id: number) { setSelectedRows((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleAll() { setSelectedRows(selectedRows.size === SAMPLE_VOTERS.length ? new Set() : new Set(SAMPLE_VOTERS.map((v) => v.id))); }

  const qfOpts = ["Gender", "Age", "Booth", "Caste", "Ward", "Status", "Visited", "Favorite", "Mobile Available"];

  function RowActionMenu({ onClose }: { onClose: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, [onClose]);
    return (
      <div ref={ref} className="absolute right-10 top-0 z-30 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 text-sm">
        {["View Profile", "Edit", "Call", "WhatsApp", "View Family", "Voter Slip"].map((a) => (
          <button key={a} onClick={onClose} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left text-xs">{a}</button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-4">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Election Management</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Voters</span>
        </nav>
        <div className="flex items-start justify-between">
          <div><h1 className="text-xl font-semibold text-slate-900 tracking-tight">Voters</h1><p className="text-sm text-slate-500 mt-0.5">Search, filter and manage voter records.</p></div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"><Icon d={I.upload} size={14} />Import Data</button>
            <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors"><Icon d={I.plus} size={14} />Add Voter</button>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Icon d={I.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, EPIC / Voter ID, or mobile number…" className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors whitespace-nowrap">
            <Icon d={I.sliders} size={14} />Advanced Filters{activeFilters.length > 0 && <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1d4ed8] text-white text-[10px] font-semibold">{activeFilters.length}</span>}
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {qfOpts.map((f) => {
            const active = activeFilters.includes(f);
            return <button key={f} onClick={() => toggleFilter(f)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${active ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{f}{active && <Icon d={I.x} size={10} />}</button>;
          })}
          {activeFilters.length > 0 && <button onClick={() => setActiveFilters([])} className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-700">Clear All</button>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">{totalVoters.toLocaleString()} voters found</span>
          {activeFilters.length > 0 && <Badge variant="default">{activeFilters.length} filters applied</Badge>}
        </div>
        {selectedRows.size > 0 && (
          <div className="bg-[#1d4ed8] text-white rounded-md px-4 py-2.5 flex items-center gap-4">
            <span className="text-sm font-medium">{selectedRows.size} selected</span>
            <div className="w-px h-4 bg-blue-400" />
            {["Export", "Send Message", "Assign Worker", "Mark Visited"].map((a) => <button key={a} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-500 rounded hover:bg-blue-500 transition-colors">{a}</button>)}
            <div className="flex-1" /><button onClick={() => setSelectedRows(new Set())} className="text-blue-200 hover:text-white text-xs">Clear</button>
          </div>
        )}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="pl-4 pr-2 py-3 w-10"><input type="checkbox" checked={selectedRows.size === SAMPLE_VOTERS.length} ref={(el) => { if (el) el.indeterminate = selectedRows.size > 0 && selectedRows.size < SAMPLE_VOTERS.length; }} onChange={toggleAll} className="rounded border-slate-300 accent-[#1d4ed8] cursor-pointer" /></th>
                  <th className="px-2 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-8">#</th>
                  {["Name", "EPIC", "Gender", "Age", "Caste", "Mobile", "Booth", "Ward", "Status"].map((h) => (
                    <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                  <th className="px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SAMPLE_VOTERS.map((voter, idx) => {
                  const isSelected = selectedRows.has(voter.id);
                  return (
                    <tr key={voter.id} className={`transition-colors ${isSelected ? "bg-blue-50/60" : "hover:bg-slate-50"}`}>
                      <td className="pl-4 pr-2 py-3"><input type="checkbox" checked={isSelected} onChange={() => toggleRow(voter.id)} className="rounded border-slate-300 accent-[#1d4ed8] cursor-pointer" /></td>
                      <td className="px-2 py-3 text-xs text-slate-400 font-medium">{start + idx}</td>
                      <td className="px-3 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-semibold text-slate-500 shrink-0">{voter.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div><div><div className="font-medium text-slate-800 text-sm leading-none">{voter.name}</div>{voter.favorite && <span className="text-[10px] text-amber-500 font-medium">★ Favorite</span>}</div></div></td>
                      <td className="px-3 py-3 text-xs text-slate-500 font-mono">{voter.epic}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{voter.gender}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{voter.age}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{voter.caste}</td>
                      <td className="px-3 py-3 text-xs text-slate-500 font-mono">{voter.mobile === "—" ? <span className="text-slate-300">—</span> : voter.mobile}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{voter.booth}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{voter.ward}</td>
                      <td className="px-3 py-3"><Badge variant={STATUS_V_VOTER[voter.status]}>{voter.status}</Badge></td>
                      <td className="px-3 py-3 text-right"><div className="relative inline-block"><button onClick={() => setOpenRowMenu(openRowMenu === voter.id ? null : voter.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><Icon d={I.moreHorizontal} size={15} /></button>{openRowMenu === voter.id && <RowActionMenu onClose={() => setOpenRowMenu(null)} />}</div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
            <span className="text-xs text-slate-500">Showing {start.toLocaleString()}–{end.toLocaleString()} of {totalVoters.toLocaleString()} voters</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"><Icon d={I.chevronLeft} size={12} />Previous</button>
              {[1, 2, 3, "...", totalPages].map((p, i) => p === "..." ? <span key={i} className="px-2 text-xs text-slate-400">…</span> : (
                <button key={i} onClick={() => setCurrentPage(p as number)} className={`w-7 h-7 text-xs font-medium rounded transition-colors ${currentPage === p ? "bg-[#1d4ed8] text-white" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1">Next<Icon d={I.chevronRight} size={12} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// BLO MANAGEMENT
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

type BLOStatus = "Active" | "Inactive" | "On Leave";
type BLOSource = "Government" | "Party" | "Volunteer" | "Contracted";

interface BLO {
  id: number;
  name: string;
  designation: string;
  phone: string;
  booth: string;
  vidhanSabha: string;
  lokSabha: string;
  state: string;
  source: BLOSource;
  status: BLOStatus;
  area: string;
}

const BLO_STATUS_V: Record<BLOStatus, BadgeVariant> = {
  Active: "success",
  Inactive: "muted",
  "On Leave": "warning",
};

const BLO_SOURCE_V: Record<BLOSource, BadgeVariant> = {
  Government: "default",
  Party: "info",
  Volunteer: "success",
  Contracted: "warning",
};

const BLOS: BLO[] = [
  { id: 1, name: "Sudhir Prakash", designation: "Booth Level Officer", phone: "98712 00011", booth: "Booth 01", vidhanSabha: "Rajpur", lokSabha: "Central Rajpur", state: "Maharashtra", source: "Government", status: "Active", area: "Gandhi Nagar" },
  { id: 2, name: "Meena Tiwari", designation: "Assistant BLO", phone: "97823 00022", booth: "Booth 02", vidhanSabha: "Rajpur", lokSabha: "Central Rajpur", state: "Maharashtra", source: "Government", status: "Active", area: "Nehru Colony" },
  { id: 3, name: "Rajiv Sinha", designation: "Booth Level Officer", phone: "96934 00033", booth: "Booth 03", vidhanSabha: "Rajpur", lokSabha: "Central Rajpur", state: "Maharashtra", source: "Party", status: "On Leave", area: "Shivaji Market" },
  { id: 4, name: "Anjana Pillai", designation: "Senior BLO", phone: "95045 00044", booth: "Booth 08", vidhanSabha: "Shivnagar", lokSabha: "North Rajpur", state: "Maharashtra", source: "Government", status: "Active", area: "Laxmi Nagar" },
  { id: 5, name: "Dinesh Rao", designation: "Booth Level Officer", phone: "94156 00055", booth: "Booth 17", vidhanSabha: "Shivnagar", lokSabha: "North Rajpur", state: "Maharashtra", source: "Volunteer", status: "Active", area: "Rajpur Ward A" },
  { id: 6, name: "Savita Kulkarni", designation: "Assistant BLO", phone: "93267 00066", booth: "Booth 31", vidhanSabha: "Shivnagar", lokSabha: "North Rajpur", state: "Maharashtra", source: "Contracted", status: "Inactive", area: "Gandhi Chowk" },
  { id: 7, name: "Harish Joshi", designation: "Booth Level Officer", phone: "92378 00077", booth: "Booth 42", vidhanSabha: "Rajpur", lokSabha: "Central Rajpur", state: "Maharashtra", source: "Government", status: "Active", area: "Nehru Ward" },
  { id: 8, name: "Pushpa Nair", designation: "Senior BLO", phone: "91489 00088", booth: "Booth 55", vidhanSabha: "Laxmi Nagar", lokSabha: "South Rajpur", state: "Maharashtra", source: "Government", status: "Active", area: "Laxmi Block" },
  { id: 9, name: "Ashutosh Gupta", designation: "Booth Level Officer", phone: "90590 00099", booth: "Booth 63", vidhanSabha: "Laxmi Nagar", lokSabha: "South Rajpur", state: "Maharashtra", source: "Party", status: "On Leave", area: "Civil Lines" },
  { id: 10, name: "Rekha Sharma", designation: "Assistant BLO", phone: "89601 00100", booth: "Booth 72", vidhanSabha: "Laxmi Nagar", lokSabha: "South Rajpur", state: "Maharashtra", source: "Volunteer", status: "Active", area: "Sector 4" },
];

// ─── BLO Board ────────────────────────────────────────────────────────────────

function BLOBoard({ onNav }: { onNav: (k: string) => void }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterVidhan, setFilterVidhan] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = BLOS.filter((b) => {
    const q = search.toLowerCase();
    if (search && !b.name.toLowerCase().includes(q) && !b.designation.toLowerCase().includes(q)) return false;
    if (filterStatus && b.status !== filterStatus) return false;
    if (filterSource && b.source !== filterSource) return false;
    if (filterVidhan && b.vidhanSabha !== filterVidhan) return false;
    return true;
  });

  function toggleRow(id: number) {
    setSelectedRows((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll() {
    setSelectedRows(selectedRows.size === filtered.length ? new Set() : new Set(filtered.map((b) => b.id)));
  }

  const activeFilterCount = [filterStatus, filterSource, filterVidhan].filter(Boolean).length;

  const stats = {
    total: BLOS.length,
    active: BLOS.filter((b) => b.status === "Active").length,
    onLeave: BLOS.filter((b) => b.status === "On Leave").length,
    inactive: BLOS.filter((b) => b.status === "Inactive").length,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Election Management</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Booth Level Officers</span>
        </nav>

        {/* Heading */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Booth Level Officers</h1>
              <Badge variant="muted">{BLOS.length} total</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Manage BLOs assigned to booths across all constituencies.</p>
          </div>
          <button
            onClick={() => onNav("blo-add")}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors"
          >
            <Icon d={I.plus} size={14} />Add BLO
          </button>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Officers", value: stats.total, icon: I.blo, variant: "muted" as BadgeVariant },
            { label: "Active", value: stats.active, icon: I.checkCircle, variant: "success" as BadgeVariant },
            { label: "On Leave", value: stats.onLeave, icon: I.clock, variant: "warning" as BadgeVariant },
            { label: "Inactive", value: stats.inactive, icon: I.xCircle, variant: "danger" as BadgeVariant },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-md p-4 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{s.label}</div>
                <div className="text-2xl font-semibold text-slate-900 tracking-tight">{s.value}</div>
              </div>
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-400">
                <Icon d={s.icon} size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or designation…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>
          <div className="w-px h-6 bg-slate-200" />
          {[
            { label: "Status", val: filterStatus, set: setFilterStatus, opts: ["Active", "Inactive", "On Leave"] },
            { label: "Source", val: filterSource, set: setFilterSource, opts: ["Government", "Party", "Volunteer", "Contracted"] },
            { label: "Vidhan Sabha", val: filterVidhan, set: setFilterVidhan, opts: ["Rajpur", "Shivnagar", "Laxmi Nagar"] },
          ].map((f) => (
            <div key={f.label} className="relative">
              <select
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none focus:border-blue-400 cursor-pointer transition-colors
                  ${f.val ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"}`}
              >
                <option value="">{f.label}</option>
                {f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
              <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setFilterStatus(""); setFilterSource(""); setFilterVidhan(""); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-2"
            >
              Clear
            </button>
          )}
          <div className="flex-1" />
          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded overflow-hidden">
            {(["table", "cards"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${view === v ? "bg-slate-100 text-slate-800" : "bg-white text-slate-400 hover:bg-slate-50"}`}
              >
                <Icon d={v === "table" ? I.list : I.grid} size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">{filtered.length} officers</span>
          {activeFilterCount > 0 && <Badge variant="default">{activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied</Badge>}
        </div>

        {/* Bulk toolbar */}
        {selectedRows.size > 0 && (
          <div className="bg-[#1d4ed8] text-white rounded-md px-4 py-2.5 flex items-center gap-4">
            <span className="text-sm font-medium">{selectedRows.size} selected</span>
            <div className="w-px h-4 bg-blue-400" />
            {["Export", "Change Status", "Reassign Booth"].map((a) => (
              <button key={a} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-500 rounded hover:bg-blue-500 transition-colors">{a}</button>
            ))}
            <div className="flex-1" />
            <button onClick={() => setSelectedRows(new Set())} className="text-blue-200 hover:text-white text-xs">Clear</button>
          </div>
        )}

        {/* Table view */}
        {view === "table" ? (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            {filtered.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Icon d={I.blo} size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-600">No BLOs found.</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Try adjusting your search or filters.</p>
                <button
                  onClick={() => { setSearch(""); setFilterStatus(""); setFilterSource(""); setFilterVidhan(""); }}
                  className="px-4 py-2 text-sm font-medium text-[#1d4ed8] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="pl-4 pr-2 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={selectedRows.size === filtered.length && filtered.length > 0}
                          ref={(el) => { if (el) el.indeterminate = selectedRows.size > 0 && selectedRows.size < filtered.length; }}
                          onChange={toggleAll}
                          className="rounded border-slate-300 accent-[#1d4ed8] cursor-pointer"
                        />
                      </th>
                      {["Sr No", "Name", "Designation", "Phone", "Booth", "Vidhan Sabha", "Lok Sabha", "State", "Source", "Status", "Actions"].map((h, i) => (
                        <th
                          key={h}
                          className={`px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider
                            ${i === 0 ? "text-center w-14" : i >= 9 ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((b, idx) => {
                      const sel = selectedRows.has(b.id);
                      return (
                        <tr key={b.id} className={`transition-colors ${sel ? "bg-blue-50/60" : "hover:bg-slate-50"}`}>
                          <td className="pl-4 pr-2 py-3">
                            <input type="checkbox" checked={sel} onChange={() => toggleRow(b.id)} className="rounded border-slate-300 accent-[#1d4ed8] cursor-pointer" />
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-400 text-center font-medium">
                            {(currentPage - 1) * pageSize + idx + 1}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-semibold text-slate-500 shrink-0">
                                {b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-medium text-slate-800 text-sm leading-tight">{b.name}</div>
                                <div className="text-[10px] text-slate-400">{b.area}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-600">{b.designation}</td>
                          <td className="px-3 py-3 text-xs text-slate-600 font-mono">{b.phone}</td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded">{b.booth}</span>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-600">{b.vidhanSabha}</td>
                          <td className="px-3 py-3 text-xs text-slate-500">{b.lokSabha}</td>
                          <td className="px-3 py-3 text-xs text-slate-500">{b.state}</td>
                          <td className="px-3 py-3"><Badge variant={BLO_SOURCE_V[b.source]}>{b.source}</Badge></td>
                          <td className="px-3 py-3 text-right"><Badge variant={BLO_STATUS_V[b.status]}>{b.status}</Badge></td>
                          <td className="px-3 py-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="View">
                                <Icon d={I.eye} size={13} />
                              </button>
                              <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Edit">
                                <Icon d={I.edit} size={13} />
                              </button>
                              <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors" title="Call">
                                <Icon d={I.phone} size={13} />
                              </button>
                              <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                                <Icon d={I.trash} size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Showing {Math.min(1, filtered.length)}–{Math.min(pageSize, filtered.length)} of {filtered.length} officers
                </span>
                <div className="flex items-center gap-1">
                  <button disabled className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1">
                    <Icon d={I.chevronLeft} size={12} />Previous
                  </button>
                  <button className="w-7 h-7 text-xs font-medium rounded bg-[#1d4ed8] text-white">1</button>
                  <button className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 flex items-center gap-1">
                    Next<Icon d={I.chevronRight} size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Card view */
          filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-md flex flex-col items-center justify-center py-20">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Icon d={I.blo} size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No BLOs found.</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((b) => (
                <div key={b.id} className="bg-white border border-slate-200 rounded-md p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600">
                        {b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-sm leading-tight">{b.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.designation}</div>
                      </div>
                    </div>
                    <Badge variant={BLO_STATUS_V[b.status]}>{b.status}</Badge>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon d={I.phone} size={11} className="text-slate-300 shrink-0" />
                      <span className="font-mono">{b.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon d={I.booths} size={11} className="text-slate-300 shrink-0" />
                      <span>{b.booth} · {b.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon d={I.mapPin} size={11} className="text-slate-300 shrink-0" />
                      <span className="truncate">{b.vidhanSabha} · {b.lokSabha}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Badge variant={BLO_SOURCE_V[b.source]}>{b.source}</Badge>
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.eye} size={13} /></button>
                      <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.edit} size={13} /></button>
                      <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors"><Icon d={I.phone} size={13} /></button>
                      <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors"><Icon d={I.trash} size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Add BLO — two-step form ──────────────────────────────────────────────────

interface BLOFormData {
  fullName: string;
  designation: string;
  phone: string;
  state: string;
  lokSabha: string;
  vidhanSabha: string;
  booth: string;
  area: string;
}

const BLO_STEPS = [
  { n: 1, label: "Officer Details" },
  { n: 2, label: "Location" },
];

function AddBLO({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof BLOFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BLOFormData>({
    fullName: "", designation: "", phone: "",
    state: "", lokSabha: "", vidhanSabha: "", booth: "", area: "",
  });

  function set(k: keyof BLOFormData, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validateStep1(): boolean {
    const e: typeof errors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.designation.trim()) e.designation = "Designation is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^\d[\d\s]{8,}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: typeof errors = {};
    if (!form.state) e.state = "State is required.";
    if (!form.lokSabha) e.lokSabha = "Lok Sabha constituency is required.";
    if (!form.vidhanSabha) e.vidhanSabha = "Vidhan Sabha is required.";
    if (!form.booth) e.booth = "Booth assignment is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep1()) setStep(2);
  }

  function handleSubmit() {
    if (validateStep2()) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
        <div className="max-w-[640px] mx-auto px-6 py-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mb-5">
            <Icon d={I.checkCircle} size={28} className="text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">BLO Added Successfully</h2>
          <p className="text-sm text-slate-500 mt-2 mb-1">
            <span className="font-medium text-slate-700">{form.fullName}</span> has been registered as a Booth Level Officer.
          </p>
          <p className="text-xs text-slate-400 mb-8">
            Assigned to {form.booth}{form.vidhanSabha ? ` · ${form.vidhanSabha}` : ""}{form.state ? ` · ${form.state}` : ""}.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSubmitted(false); setStep(1); setForm({ fullName: "", designation: "", phone: "", state: "", lokSabha: "", vidhanSabha: "", booth: "", area: "" }); }}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            >
              Add Another BLO
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors"
            >
              Back to BLO Board
            </button>
          </div>
        </div>
      </div>
    );
  }

  function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><Icon d={I.alertCircle} size={11} />{msg}</p>;
  }

  function StepBadge({ n, label, current }: { n: number; label: string; current: number }) {
    const done = n < current;
    const active = n === current;
    return (
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all
          ${done ? "bg-[#1d4ed8] border-[#1d4ed8] text-white" : active ? "bg-white border-[#1d4ed8] text-[#1d4ed8]" : "bg-white border-slate-200 text-slate-400"}`}>
          {done ? <Icon d={I.check} size={13} /> : n}
        </div>
        <span className={`mt-1 text-[10px] font-medium ${active ? "text-[#1d4ed8]" : done ? "text-slate-600" : "text-slate-400"}`}>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[700px] mx-auto px-6 py-6 space-y-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span onClick={onBack} className="hover:text-slate-600 cursor-pointer">Booth Level Officers</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Add BLO</span>
        </nav>

        {/* Heading */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Add Booth Level Officer</h1>
            <p className="text-sm text-slate-500 mt-0.5">Register a new BLO and assign them to a booth.</p>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <Icon d={I.chevronLeft} size={14} />Back
          </button>
        </div>

        {/* Step indicator */}
        <div className="bg-white border border-slate-200 rounded-md px-6 py-5 flex justify-center items-center gap-0">
          <StepBadge n={1} label="Officer Details" current={step} />
          <div className={`h-px w-24 mx-3 mb-5 ${step > 1 ? "bg-[#1d4ed8]" : "bg-slate-200"}`} />
          <StepBadge n={2} label="Location" current={step} />
        </div>

        {/* Step content */}
        <div className="bg-white border border-slate-200 rounded-md p-6">
          {step === 1 ? (
            <div className="space-y-5">
              <div className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">Officer Details</div>
              <div className="space-y-4">
                <div>
                  <FormField label="Full Name" required>
                    <input
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      placeholder="Enter officer's full name"
                      className={`w-full px-3 py-2 text-sm border rounded bg-white placeholder-slate-400 focus:outline-none transition-colors
                        ${errors.fullName ? "border-red-300 focus:border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}
                    />
                    <FieldError msg={errors.fullName} />
                  </FormField>
                </div>
                <div>
                  <FormField label="Designation" required>
                    <div className="relative">
                      <select
                        value={form.designation}
                        onChange={(e) => set("designation", e.target.value)}
                        className={`w-full appearance-none px-3 py-2 text-sm border rounded bg-white focus:outline-none transition-colors pr-8 cursor-pointer
                          ${errors.designation ? "border-red-300 focus:border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}
                      >
                        <option value="">Select designation</option>
                        {["Booth Level Officer", "Senior BLO", "Assistant BLO", "Supervisory BLO"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <Icon d={I.chevronDown} size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <FieldError msg={errors.designation} />
                  </FormField>
                </div>
                <div>
                  <FormField label="Phone Number" required>
                    <input
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="e.g. 98712 34567"
                      type="tel"
                      className={`w-full px-3 py-2 text-sm border rounded bg-white placeholder-slate-400 focus:outline-none transition-colors font-mono
                        ${errors.phone ? "border-red-300 focus:border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}
                    />
                    <FieldError msg={errors.phone} />
                  </FormField>
                </div>
              </div>

              {/* Preview card (shows as fields fill) */}
              {(form.fullName || form.designation || form.phone) && (
                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-md p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Preview</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1d4ed8] rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {form.fullName ? form.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{form.fullName || <span className="text-slate-300">Full name</span>}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{form.designation || <span className="text-slate-300">Designation</span>}</div>
                      {form.phone && <div className="text-xs text-slate-400 font-mono mt-0.5">{form.phone}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">Location Assignment</div>

              {/* Officer summary */}
              <div className="bg-slate-50 border border-slate-100 rounded-md p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1d4ed8] rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {form.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800">{form.fullName}</div>
                  <div className="text-xs text-slate-500">{form.designation} · {form.phone}</div>
                </div>
                <button onClick={() => setStep(1)} className="ml-auto text-xs text-[#1d4ed8] hover:underline font-medium">Edit</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* State */}
                <div>
                  <FormField label="State" required>
                    <div className="relative">
                      <select value={form.state} onChange={(e) => set("state", e.target.value)}
                        className={`w-full appearance-none px-3 py-2 text-sm border rounded bg-white focus:outline-none transition-colors pr-8 cursor-pointer
                          ${errors.state ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}>
                        <option value="">Select state</option>
                        {["Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <Icon d={I.chevronDown} size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <FieldError msg={errors.state} />
                  </FormField>
                </div>

                {/* Lok Sabha */}
                <div>
                  <FormField label="Lok Sabha Constituency" required>
                    <div className="relative">
                      <select value={form.lokSabha} onChange={(e) => set("lokSabha", e.target.value)}
                        className={`w-full appearance-none px-3 py-2 text-sm border rounded bg-white focus:outline-none transition-colors pr-8 cursor-pointer
                          ${errors.lokSabha ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}>
                        <option value="">Select Lok Sabha</option>
                        {["Central Rajpur", "North Rajpur", "South Rajpur"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <Icon d={I.chevronDown} size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <FieldError msg={errors.lokSabha} />
                  </FormField>
                </div>

                {/* Vidhan Sabha */}
                <div>
                  <FormField label="Vidhan Sabha" required>
                    <div className="relative">
                      <select value={form.vidhanSabha} onChange={(e) => set("vidhanSabha", e.target.value)}
                        className={`w-full appearance-none px-3 py-2 text-sm border rounded bg-white focus:outline-none transition-colors pr-8 cursor-pointer
                          ${errors.vidhanSabha ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}>
                        <option value="">Select Vidhan Sabha</option>
                        {["Rajpur", "Shivnagar", "Laxmi Nagar"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <Icon d={I.chevronDown} size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <FieldError msg={errors.vidhanSabha} />
                  </FormField>
                </div>

                {/* Booth */}
                <div>
                  <FormField label="Booth" required>
                    <div className="relative">
                      <select value={form.booth} onChange={(e) => set("booth", e.target.value)}
                        className={`w-full appearance-none px-3 py-2 text-sm border rounded bg-white focus:outline-none transition-colors pr-8 cursor-pointer
                          ${errors.booth ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}>
                        <option value="">Select booth</option>
                        {["Booth 01", "Booth 02", "Booth 03", "Booth 08", "Booth 17", "Booth 31", "Booth 42", "Booth 55", "Booth 63", "Booth 72"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <Icon d={I.chevronDown} size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <FieldError msg={errors.booth} />
                  </FormField>
                </div>

                {/* Area */}
                <div className="col-span-2">
                  <FormField label="Area / Locality">
                    <input
                      value={form.area}
                      onChange={(e) => set("area", e.target.value)}
                      placeholder="e.g. Gandhi Nagar, Sector 4"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </FormField>
                </div>
              </div>

              {/* Validation summary */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 flex items-start gap-2.5">
                  <Icon d={I.alertCircle} size={14} className="text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-red-700">Please fix the following before saving:</p>
                    <ul className="mt-1 space-y-0.5">
                      {Object.values(errors).filter(Boolean).map((msg, i) => (
                        <li key={i} className="text-xs text-red-600">· {msg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="bg-white border border-slate-200 rounded-md px-5 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-400">Step {step} of 2: {BLO_STEPS[step - 1].label}</div>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Icon d={I.chevronLeft} size={14} />Back
              </button>
            )}
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Save Draft
            </button>
            {step === 1 ? (
              <button onClick={handleNext} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
                Next<Icon d={I.chevronRight} size={14} />
              </button>
            ) : (
              <button onClick={handleSubmit} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors flex items-center gap-2">
                <Icon d={I.check} size={14} />Save BLO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// BOOTH MANAGEMENT
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

type BoothStatus = "Complete" | "Partial" | "Unassigned";

interface Booth {
  id: number;
  boothNo: string;
  name: string;
  building: string;
  village: string;
  block: string;
  district: string;
  vidhanSabha: string;
  lokSabha: string;
  totalVoters: number;
  male: number;
  female: number;
  other: number;
  coverage: number;
  status: BoothStatus;
  panchayat: string;
  blo: string;
  casteData: { name: string; value: number }[];
  casteCategory: { name: string; value: number }[];
  documents: { name: string; type: string; uploaded: string; size: string }[];
  qualityIssues: { field: string; count: number; severity: "warning" | "error" }[];
}

const BOOTH_STATUS_V: Record<BoothStatus, BadgeVariant> = {
  Complete: "success",
  Partial: "warning",
  Unassigned: "danger",
};

const BOOTHS: Booth[] = [
  {
    id: 1, boothNo: "001", name: "Gandhi Primary School", building: "Gandhi Primary School", village: "Gandhi Nagar",
    block: "Rajpur Block", district: "Rajpur", vidhanSabha: "Rajpur", lokSabha: "Central Rajpur",
    totalVoters: 1842, male: 964, female: 878, other: 0, coverage: 94, status: "Complete",
    panchayat: "Gandhi Nagar Panchayat", blo: "Sudhir Prakash",
    casteData: [{ name: "General", value: 820 }, { name: "OBC", value: 540 }, { name: "SC", value: 380 }, { name: "ST", value: 102 }],
    casteCategory: [{ name: "Category A", value: 920 }, { name: "Category B", value: 580 }, { name: "Category C", value: 342 }],
    documents: [
      { name: "E-roll 2024.pdf", type: "E-Roll", uploaded: "01 Aug 2024", size: "2.4 MB" },
      { name: "Booth_001_Photo.jpg", type: "Photo", uploaded: "15 Jul 2024", size: "340 KB" },
      { name: "BLO_Report_001.pdf", type: "Report", uploaded: "10 Aug 2024", size: "180 KB" },
    ],
    qualityIssues: [{ field: "Missing mobile numbers", count: 142, severity: "warning" }, { field: "Photo not uploaded", count: 67, severity: "warning" }],
  },
  {
    id: 2, boothNo: "002", name: "Nehru Community Hall", building: "Nehru Community Hall", village: "Nehru Colony",
    block: "Rajpur Block", district: "Rajpur", vidhanSabha: "Rajpur", lokSabha: "Central Rajpur",
    totalVoters: 1790, male: 901, female: 889, other: 0, coverage: 91, status: "Complete",
    panchayat: "Nehru Colony Panchayat", blo: "Meena Tiwari",
    casteData: [{ name: "General", value: 780 }, { name: "OBC", value: 610 }, { name: "SC", value: 290 }, { name: "ST", value: 110 }],
    casteCategory: [{ name: "Category A", value: 890 }, { name: "Category B", value: 540 }, { name: "Category C", value: 360 }],
    documents: [{ name: "E-roll 2024.pdf", type: "E-Roll", uploaded: "01 Aug 2024", size: "2.1 MB" }],
    qualityIssues: [{ field: "Missing mobile numbers", count: 98, severity: "warning" }],
  },
  {
    id: 3, boothNo: "003", name: "Shivaji Market Centre", building: "Shivaji Market Community Centre", village: "Shivaji Market",
    block: "Shivnagar Block", district: "Rajpur", vidhanSabha: "Shivnagar", lokSabha: "North Rajpur",
    totalVoters: 1724, male: 876, female: 848, other: 0, coverage: 72, status: "Partial",
    panchayat: "Shivaji Market Panchayat", blo: "Rajiv Sinha",
    casteData: [{ name: "General", value: 560 }, { name: "OBC", value: 680 }, { name: "SC", value: 320 }, { name: "ST", value: 164 }],
    casteCategory: [{ name: "Category A", value: 740 }, { name: "Category B", value: 620 }, { name: "Category C", value: 364 }],
    documents: [],
    qualityIssues: [{ field: "Missing mobile numbers", count: 320, severity: "error" }, { field: "Duplicate records", count: 14, severity: "error" }, { field: "Address missing", count: 88, severity: "warning" }],
  },
  {
    id: 4, boothNo: "008", name: "Laxmi Nagar School", building: "Laxmi Nagar Govt. School", village: "Laxmi Nagar",
    block: "Shivnagar Block", district: "Rajpur", vidhanSabha: "Shivnagar", lokSabha: "North Rajpur",
    totalVoters: 1698, male: 855, female: 843, other: 0, coverage: 86, status: "Complete",
    panchayat: "Laxmi Nagar Panchayat", blo: "Anjana Pillai",
    casteData: [{ name: "General", value: 700 }, { name: "OBC", value: 580 }, { name: "SC", value: 280 }, { name: "ST", value: 138 }],
    casteCategory: [{ name: "Category A", value: 860 }, { name: "Category B", value: 500 }, { name: "Category C", value: 338 }],
    documents: [{ name: "E-roll 2024.pdf", type: "E-Roll", uploaded: "01 Aug 2024", size: "1.9 MB" }, { name: "Booth_008_Map.pdf", type: "Map", uploaded: "05 Aug 2024", size: "510 KB" }],
    qualityIssues: [],
  },
  {
    id: 5, boothNo: "017", name: "Civil Lines Center", building: "Civil Lines Multipurpose Hall", village: "Civil Lines",
    block: "Rajpur Block", district: "Rajpur", vidhanSabha: "Rajpur", lokSabha: "Central Rajpur",
    totalVoters: 1643, male: 820, female: 823, other: 0, coverage: 55, status: "Partial",
    panchayat: "Civil Lines Panchayat", blo: "Dinesh Rao",
    casteData: [{ name: "General", value: 620 }, { name: "OBC", value: 490 }, { name: "SC", value: 360 }, { name: "ST", value: 173 }],
    casteCategory: [{ name: "Category A", value: 710 }, { name: "Category B", value: 580 }, { name: "Category C", value: 353 }],
    documents: [],
    qualityIssues: [{ field: "Missing mobile numbers", count: 490, severity: "error" }, { field: "Photo not uploaded", count: 220, severity: "warning" }, { field: "DOB missing", count: 105, severity: "warning" }],
  },
  {
    id: 6, boothNo: "031", name: "Gandhi Chowk Hall", building: "Gandhi Chowk Community Hall", village: "Gandhi Chowk",
    block: "Shivnagar Block", district: "Rajpur", vidhanSabha: "Shivnagar", lokSabha: "North Rajpur",
    totalVoters: 1520, male: 765, female: 755, other: 0, coverage: 0, status: "Unassigned",
    panchayat: "Gandhi Chowk Panchayat", blo: "—",
    casteData: [{ name: "General", value: 580 }, { name: "OBC", value: 440 }, { name: "SC", value: 310 }, { name: "ST", value: 190 }],
    casteCategory: [{ name: "Category A", value: 680 }, { name: "Category B", value: 520 }, { name: "Category C", value: 320 }],
    documents: [],
    qualityIssues: [{ field: "BLO not assigned", count: 1, severity: "error" }],
  },
  {
    id: 7, boothNo: "042", name: "Rajpur Ward A School", building: "Rajpur Ward A Primary School", village: "Rajpur Ward A",
    block: "Rajpur Block", district: "Rajpur", vidhanSabha: "Rajpur", lokSabha: "Central Rajpur",
    totalVoters: 1842, male: 964, female: 878, other: 0, coverage: 88, status: "Complete",
    panchayat: "Rajpur Ward Panchayat", blo: "Harish Joshi",
    casteData: [{ name: "General", value: 810 }, { name: "OBC", value: 560 }, { name: "SC", value: 340 }, { name: "ST", value: 132 }],
    casteCategory: [{ name: "Category A", value: 910 }, { name: "Category B", value: 570 }, { name: "Category C", value: 362 }],
    documents: [{ name: "E-roll 2024.pdf", type: "E-Roll", uploaded: "01 Aug 2024", size: "2.2 MB" }],
    qualityIssues: [{ field: "Missing mobile numbers", count: 78, severity: "warning" }],
  },
  {
    id: 8, boothNo: "055", name: "Laxmi Block Centre", building: "Laxmi Block Community Centre", village: "Laxmi Block",
    block: "Laxmi Nagar Block", district: "Rajpur", vidhanSabha: "Laxmi Nagar", lokSabha: "South Rajpur",
    totalVoters: 1398, male: 695, female: 703, other: 0, coverage: 83, status: "Complete",
    panchayat: "Laxmi Nagar Panchayat", blo: "Pushpa Nair",
    casteData: [{ name: "General", value: 540 }, { name: "OBC", value: 420 }, { name: "SC", value: 290 }, { name: "ST", value: 148 }],
    casteCategory: [{ name: "Category A", value: 660 }, { name: "Category B", value: 480 }, { name: "Category C", value: 258 }],
    documents: [{ name: "E-roll 2024.pdf", type: "E-Roll", uploaded: "01 Aug 2024", size: "1.6 MB" }, { name: "BLO_Report_055.pdf", type: "Report", uploaded: "12 Aug 2024", size: "145 KB" }],
    qualityIssues: [],
  },
];

// Booth voters (reuse SAMPLE_VOTERS-style data keyed per booth)
const BOOTH_VOTERS: Record<string, { id: number; name: string; epic: string; gender: string; age: number; caste: string; mobile: string; status: string }[]> = {
  "001": [
    { id: 1, name: "Rahul Sharma", epic: "RJP0042817", gender: "Male", age: 42, caste: "General", mobile: "98****2121", status: "Supporter" },
    { id: 2, name: "Sunita Devi", epic: "RJP0091234", gender: "Female", age: 55, caste: "SC", mobile: "—", status: "Neutral" },
    { id: 3, name: "Vikram Singh", epic: "RJP0033410", gender: "Male", age: 38, caste: "OBC", mobile: "97****4411", status: "Doubtful" },
    { id: 4, name: "Geeta Patel", epic: "RJP0057820", gender: "Female", age: 29, caste: "General", mobile: "96****8800", status: "Supporter" },
    { id: 5, name: "Mohan Yadav", epic: "RJP0012234", gender: "Male", age: 61, caste: "OBC", mobile: "95****3300", status: "Opponent" },
  ],
};

// ─── Booth Board ──────────────────────────────────────────────────────────────

function BoothBoard({ onNav }: { onNav: (k: string, data?: unknown) => void }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterVidhan, setFilterVidhan] = useState("");
  const [filterLok, setFilterLok] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const filtered = BOOTHS.filter((b) => {
    const q = search.toLowerCase();
    if (search && !b.boothNo.includes(q) && !b.name.toLowerCase().includes(q) && !b.village.toLowerCase().includes(q)) return false;
    if (filterStatus && b.status !== filterStatus) return false;
    if (filterVidhan && b.vidhanSabha !== filterVidhan) return false;
    if (filterLok && b.lokSabha !== filterLok) return false;
    return true;
  });

  function toggleRow(id: number) {
    setSelectedRows((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll() {
    setSelectedRows(selectedRows.size === filtered.length ? new Set() : new Set(filtered.map((b) => b.id)));
  }

  const stats = {
    total: BOOTHS.length,
    complete: BOOTHS.filter((b) => b.status === "Complete").length,
    partial: BOOTHS.filter((b) => b.status === "Partial").length,
    unassigned: BOOTHS.filter((b) => b.status === "Unassigned").length,
    totalVoters: BOOTHS.reduce((a, b) => a + b.totalVoters, 0),
  };

  const activeFilterCount = [filterStatus, filterVidhan, filterLok].filter(Boolean).length;

  function CoverageBar({ pct }: { pct: number }) {
    const color = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-xs w-8 text-right font-medium ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-amber-500" : "text-red-500"}`}>{pct}%</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">

        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Election Management</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Booths</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Booths</h1>
              <Badge variant="muted">{BOOTHS.length} total</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Manage booth assignments, coverage and voter data across constituencies.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <Icon d={I.upload} size={14} />Import CSV
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
              <Icon d={I.plus} size={14} />Add Booth
            </button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Booths", value: stats.total.toString(), icon: I.booths },
            { label: "Complete", value: stats.complete.toString(), icon: I.checkCircle, color: "text-green-600" },
            { label: "Partial", value: stats.partial.toString(), icon: I.clock, color: "text-amber-500" },
            { label: "Unassigned", value: stats.unassigned.toString(), icon: I.alertCircle, color: "text-red-500" },
            { label: "Total Voters", value: stats.totalVoters.toLocaleString(), icon: I.voters },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-md p-4 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{s.label}</div>
                <div className={`text-2xl font-semibold tracking-tight ${(s as { color?: string }).color || "text-slate-900"}`}>{s.value}</div>
              </div>
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-400">
                <Icon d={s.icon} size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booth number, name or village…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>
          <div className="w-px h-6 bg-slate-200" />
          {[
            { label: "Status", val: filterStatus, set: setFilterStatus, opts: ["Complete", "Partial", "Unassigned"] },
            { label: "Vidhan Sabha", val: filterVidhan, set: setFilterVidhan, opts: ["Rajpur", "Shivnagar", "Laxmi Nagar"] },
            { label: "Lok Sabha", val: filterLok, set: setFilterLok, opts: ["Central Rajpur", "North Rajpur", "South Rajpur"] },
          ].map((f) => (
            <div key={f.label} className="relative">
              <select
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors
                  ${f.val ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"}`}
              >
                <option value="">{f.label}</option>
                {f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
              <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button onClick={() => { setFilterStatus(""); setFilterVidhan(""); setFilterLok(""); }} className="text-xs text-red-500 hover:text-red-700 font-medium px-2">Clear</button>
          )}
          <div className="flex-1" />
          <div className="flex items-center border border-slate-200 rounded overflow-hidden">
            {(["table", "cards"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`w-8 h-8 flex items-center justify-center transition-colors ${view === v ? "bg-slate-100 text-slate-800" : "bg-white text-slate-400 hover:bg-slate-50"}`}>
                <Icon d={v === "table" ? I.list : I.grid} size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">{filtered.length} booths</span>
          {activeFilterCount > 0 && <Badge variant="default">{activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied</Badge>}
        </div>

        {selectedRows.size > 0 && (
          <div className="bg-[#1d4ed8] text-white rounded-md px-4 py-2.5 flex items-center gap-4">
            <span className="text-sm font-medium">{selectedRows.size} selected</span>
            <div className="w-px h-4 bg-blue-400" />
            {["Export", "Assign BLO", "Change Status"].map((a) => (
              <button key={a} className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-500 rounded hover:bg-blue-500 transition-colors">{a}</button>
            ))}
            <div className="flex-1" />
            <button onClick={() => setSelectedRows(new Set())} className="text-blue-200 hover:text-white text-xs">Clear</button>
          </div>
        )}

        {view === "table" ? (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Icon d={I.booths} size={22} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-600">No booths found.</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Try adjusting your search or filters.</p>
                <button onClick={() => { setSearch(""); setFilterStatus(""); setFilterVidhan(""); setFilterLok(""); }}
                  className="px-4 py-2 text-sm font-medium text-[#1d4ed8] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="pl-4 pr-2 py-3 w-10">
                        <input type="checkbox"
                          checked={selectedRows.size === filtered.length && filtered.length > 0}
                          ref={(el) => { if (el) el.indeterminate = selectedRows.size > 0 && selectedRows.size < filtered.length; }}
                          onChange={toggleAll}
                          className="rounded border-slate-300 accent-[#1d4ed8] cursor-pointer" />
                      </th>
                      {["Booth No", "Building / Name", "Village", "Block", "District", "Vidhan Sabha", "Lok Sabha", "Total Voters", "Coverage", "Status", "Actions"].map((h, i) => (
                        <th key={h} className={`px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${i >= 9 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((b) => {
                      const sel = selectedRows.has(b.id);
                      return (
                        <tr key={b.id} className={`transition-colors ${sel ? "bg-blue-50/60" : "hover:bg-slate-50"}`}>
                          <td className="pl-4 pr-2 py-3">
                            <input type="checkbox" checked={sel} onChange={() => toggleRow(b.id)} className="rounded border-slate-300 accent-[#1d4ed8] cursor-pointer" />
                          </td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center justify-center w-10 h-6 bg-slate-100 text-slate-600 text-xs font-semibold rounded font-mono">{b.boothNo}</span>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => onNav("booth-detail", b)}
                              className="font-medium text-slate-800 hover:text-[#1d4ed8] transition-colors text-sm text-left"
                            >
                              {b.name}
                            </button>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-500">{b.village}</td>
                          <td className="px-3 py-3 text-xs text-slate-500">{b.block}</td>
                          <td className="px-3 py-3 text-xs text-slate-500">{b.district}</td>
                          <td className="px-3 py-3 text-xs text-slate-600">{b.vidhanSabha}</td>
                          <td className="px-3 py-3 text-xs text-slate-500">{b.lokSabha}</td>
                          <td className="px-3 py-3 text-sm font-medium text-slate-800">{b.totalVoters.toLocaleString()}</td>
                          <td className="px-3 py-3 w-36">
                            <CoverageBar pct={b.coverage} />
                          </td>
                          <td className="px-3 py-3 text-right">
                            <Badge variant={BOOTH_STATUS_V[b.status]}>{b.status}</Badge>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button onClick={() => onNav("booth-detail", b)} className="px-2.5 py-1 text-xs font-medium text-[#1d4ed8] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">View</button>
                              <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.edit} size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Showing {filtered.length} of {BOOTHS.length} booths</span>
                <div className="flex items-center gap-1">
                  <button disabled className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded disabled:opacity-40 flex items-center gap-1"><Icon d={I.chevronLeft} size={12} />Previous</button>
                  <button className="w-7 h-7 text-xs font-medium rounded bg-[#1d4ed8] text-white">1</button>
                  <button className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 flex items-center gap-1">Next<Icon d={I.chevronRight} size={12} /></button>
                </div>
              </div>
            )}
          </div>
        ) : (
          filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-md flex flex-col items-center justify-center py-20">
              <Icon d={I.booths} size={28} className="text-slate-200 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No booths found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((b) => {
                const coverColor = b.coverage >= 80 ? "text-green-600" : b.coverage >= 50 ? "text-amber-500" : "text-red-500";
                const barColor = b.coverage >= 80 ? "bg-green-500" : b.coverage >= 50 ? "bg-amber-400" : "bg-red-400";
                return (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-md p-4 hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center w-10 h-8 bg-slate-100 text-slate-600 text-xs font-bold rounded font-mono">{b.boothNo}</span>
                        <div>
                          <button onClick={() => onNav("booth-detail", b)} className="font-medium text-slate-800 hover:text-[#1d4ed8] text-sm leading-tight block text-left">{b.name}</button>
                          <div className="text-[10px] text-slate-400 mt-0.5">{b.village} · {b.vidhanSabha}</div>
                        </div>
                      </div>
                      <Badge variant={BOOTH_STATUS_V[b.status]}>{b.status}</Badge>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Icon d={I.mapPin} size={11} className="text-slate-300 shrink-0" />
                        <span className="truncate">{b.block} · {b.district}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Icon d={I.voters} size={11} className="text-slate-300 shrink-0" />
                        <span><span className="font-medium text-slate-700">{b.totalVoters.toLocaleString()}</span> voters</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${b.coverage}%` }} />
                      </div>
                      <span className={`text-xs font-medium ${coverColor}`}>{b.coverage}%</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="text-[10px] text-slate-400">BLO: <span className="text-slate-600">{b.blo}</span></div>
                      <button onClick={() => onNav("booth-detail", b)} className="text-xs font-medium text-[#1d4ed8] hover:underline">View Details →</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Booth Detail ─────────────────────────────────────────────────────────────

function BoothDetail({ booth, onBack }: { booth: Booth; onBack: () => void }) {
  const [tab, setTab] = useState<"insight" | "voters" | "documents">("insight");
  const [voterSearch, setVoterSearch] = useState("");

  const coverColor = booth.coverage >= 80 ? "text-green-600" : booth.coverage >= 50 ? "text-amber-500" : "text-red-500";
  const barColor = booth.coverage >= 80 ? "bg-green-500" : booth.coverage >= 50 ? "bg-amber-400" : "bg-red-400";

  const boothVoters = BOOTH_VOTERS[booth.boothNo] ?? BOOTH_VOTERS["001"];
  const filteredVoters = boothVoters.filter((v) => {
    const q = voterSearch.toLowerCase();
    return !voterSearch || v.name.toLowerCase().includes(q) || v.epic.toLowerCase().includes(q);
  });

  const VOTER_STATUS_V: Record<string, BadgeVariant> = { Supporter: "success", Opponent: "danger", Doubtful: "warning", Neutral: "muted", Visited: "info" };

  const GENDER_CHART = [
    { name: "Male", value: booth.male, color: "#1d4ed8" },
    { name: "Female", value: booth.female, color: "#6366f1" },
    { name: "Other", value: booth.other, color: "#94a3b8" },
  ].filter((d) => d.value > 0);

  const totalQ = booth.qualityIssues.reduce((a, i) => a + i.count, 0);
  const hasErrors = booth.qualityIssues.some((i) => i.severity === "error");

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span onClick={onBack} className="hover:text-slate-600 cursor-pointer">Booths</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Booth {booth.boothNo} — {booth.name}</span>
        </nav>

        {/* Booth header card */}
        <div className="bg-white border border-slate-200 rounded-md px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-slate-600 font-mono">{booth.boothNo}</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{booth.name}</h1>
                  <Badge variant={BOOTH_STATUS_V[booth.status]}>{booth.status}</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Icon d={I.mapPin} size={12} />
                  <span>{booth.village} · {booth.block} · {booth.district} · {booth.vidhanSabha} · {booth.lokSabha}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{booth.totalVoters.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Total Voters</div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold tracking-tight ${coverColor}`}>{booth.coverage}%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Coverage</div>
              </div>
              <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                <Icon d={I.edit} size={14} />Edit Booth
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="border-b border-slate-200 flex px-4">
            {(["insight", "voters", "documents"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors capitalize
                  ${tab === t ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {t === "insight" ? "Insight" : t === "voters" ? `Voters (${booth.totalVoters.toLocaleString()})` : `Documents (${booth.documents.length})`}
              </button>
            ))}
          </div>

          {/* ── INSIGHT ── */}
          {tab === "insight" && (
            <div className="p-5 space-y-5">
              {/* Quick stats row */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Male Voters", value: booth.male.toLocaleString(), icon: I.user },
                  { label: "Female Voters", value: booth.female.toLocaleString(), icon: I.user },
                  { label: "BLO Assigned", value: booth.blo === "—" ? "None" : booth.blo, icon: I.blo },
                  { label: "Panchayat", value: booth.panchayat, icon: I.organization },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon d={s.icon} size={12} className="text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 truncate">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Gender distribution */}
                <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Gender Distribution</div>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="45%" height={130}>
                      <PieChart>
                        <Pie data={GENDER_CHART} cx="50%" cy="50%" innerRadius={36} outerRadius={60} dataKey="value" labelLine={false}>
                          {GENDER_CHART.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => v.toLocaleString()} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2.5">
                      {GENDER_CHART.map((g) => (
                        <div key={g.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: g.color }} />
                            <span className="text-slate-600">{g.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-slate-800">{g.value.toLocaleString()}</div>
                            <div className="text-slate-400">{((g.value / booth.totalVoters) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Caste distribution */}
                <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Caste Distribution</div>
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={booth.casteData} layout="vertical" margin={{ left: 0, right: 32, top: 0, bottom: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => v > 999 ? `${(v / 1000).toFixed(1)}k` : v.toString()} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={50} />
                      <Tooltip formatter={(v: number) => v.toLocaleString()} />
                      <Bar dataKey="value" fill="#1d4ed8" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Caste categories */}
              <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Caste Categories</div>
                <div className="flex gap-6">
                  {booth.casteCategory.map((c) => (
                    <div key={c.name} className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-medium">{c.name}</span>
                        <span className="text-slate-800 font-semibold">{c.value.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1d4ed8] rounded-full" style={{ width: `${(c.value / booth.totalVoters) * 100}%` }} />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{((c.value / booth.totalVoters) * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booth coverage */}
              <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Booth Coverage</div>
                  <span className={`text-sm font-bold ${coverColor}`}>{booth.coverage}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${booth.coverage}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs text-center">
                  <div className="bg-white border border-slate-200 rounded p-2">
                    <div className="font-semibold text-slate-800 text-base">{booth.male.toLocaleString()}</div>
                    <div className="text-slate-400 mt-0.5">Male</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2">
                    <div className="font-semibold text-slate-800 text-base">{booth.female.toLocaleString()}</div>
                    <div className="text-slate-400 mt-0.5">Female</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2">
                    <div className="font-semibold text-slate-800 text-base">{booth.totalVoters.toLocaleString()}</div>
                    <div className="text-slate-400 mt-0.5">Total</div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Location</div>
                  <div className="space-y-2">
                    {[
                      { label: "Building", value: booth.building },
                      { label: "Village", value: booth.village },
                      { label: "Panchayat", value: booth.panchayat },
                      { label: "Block", value: booth.block },
                      { label: "District", value: booth.district },
                      { label: "Vidhan Sabha", value: booth.vidhanSabha },
                      { label: "Lok Sabha", value: booth.lokSabha },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start justify-between text-xs gap-2">
                        <span className="text-slate-400 shrink-0 w-24">{row.label}</span>
                        <span className="font-medium text-slate-700 text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                    <Icon d={I.mapPin} size={12} />View on Map
                  </button>
                </div>

                {/* Quality Check */}
                <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data Quality Check</div>
                    {hasErrors
                      ? <Badge variant="danger">Needs Attention</Badge>
                      : totalQ > 0
                        ? <Badge variant="warning">Warnings</Badge>
                        : <Badge variant="success">Clean</Badge>
                    }
                  </div>

                  {booth.qualityIssues.length === 0 ? (
                    <div className="flex flex-col items-center py-4 text-center">
                      <Icon d={I.checkCircle} size={28} className="text-green-400 mb-2" />
                      <p className="text-sm font-medium text-slate-700">All data looks accurate.</p>
                      <p className="text-xs text-slate-400 mt-0.5">No quality issues detected for this booth.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {booth.qualityIssues.map((issue) => (
                        <div key={issue.field} className={`flex items-center justify-between p-2.5 rounded border text-xs
                          ${issue.severity === "error" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
                          <div className="flex items-center gap-2">
                            <Icon d={I.alertCircle} size={13} className={issue.severity === "error" ? "text-red-400" : "text-amber-400"} />
                            <span className={issue.severity === "error" ? "text-red-700" : "text-amber-700"}>{issue.field}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${issue.severity === "error" ? "text-red-600" : "text-amber-600"}`}>{issue.count}</span>
                            <button className="text-[#1d4ed8] hover:underline font-medium">Resolve</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {booth.qualityIssues.length > 0 && (
                    <button className="mt-3 w-full text-xs font-medium text-[#1d4ed8] hover:underline text-center">
                      View Full Quality Report →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── VOTERS ── */}
          {tab === "voters" && (
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    value={voterSearch}
                    onChange={(e) => setVoterSearch(e.target.value)}
                    placeholder="Search by name or EPIC…"
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                  />
                </div>
                <div className="relative">
                  <select className="appearance-none text-sm border border-slate-200 bg-slate-50 text-slate-600 rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer">
                    <option>All Status</option>
                    {["Supporter", "Opponent", "Doubtful", "Neutral"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="appearance-none text-sm border border-slate-200 bg-slate-50 text-slate-600 rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer">
                    <option>All Caste</option>
                    {["General", "OBC", "SC", "ST"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <span className="text-sm text-slate-500 ml-auto">{booth.totalVoters.toLocaleString()} voters in this booth</span>
              </div>

              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {["Name", "EPIC", "Gender", "Age", "Caste", "Mobile", "Status", "Actions"].map((h, i) => (
                        <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${i >= 6 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVoters.length === 0 ? (
                      <tr><td colSpan={8} className="py-12 text-center text-sm text-slate-400">No voters match your search.</td></tr>
                    ) : filteredVoters.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-semibold text-slate-500 shrink-0">
                              {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span className="font-medium text-slate-800">{v.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-mono">{v.epic}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{v.gender}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{v.age}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{v.caste}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-mono">{v.mobile === "—" ? <span className="text-slate-300">—</span> : v.mobile}</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={VOTER_STATUS_V[v.status] || "muted"}>{v.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.eye} size={13} /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.phone} size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filteredVoters.length} of {booth.totalVoters.toLocaleString()} voters</span>
                <button className="text-[#1d4ed8] hover:underline font-medium">Load all voters →</button>
              </div>
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {tab === "documents" && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Upload, view and compare official election documents for this booth.</p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                    <Icon d={I.refreshCw} size={14} />Compare with E-Roll
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
                    <Icon d={I.upload} size={14} />Upload Document
                  </button>
                </div>
              </div>

              {booth.documents.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-md py-16 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <Icon d={I.fileText} size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">No documents uploaded yet.</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Upload the E-Roll PDF and other booth documents here.</p>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
                    <Icon d={I.upload} size={14} />Upload First Document
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {booth.documents.map((doc) => (
                    <div key={doc.name} className="flex items-center gap-4 px-4 py-3 bg-white border border-slate-200 rounded-md hover:border-slate-300 transition-colors">
                      <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded flex items-center justify-center shrink-0">
                        <Icon d={I.fileText} size={16} className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">{doc.name}</div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <Badge variant="muted">{doc.type}</Badge>
                          <span className="text-[10px] text-slate-400">{doc.size} · Uploaded {doc.uploaded}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors" title="View">
                          <Icon d={I.eye} size={13} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors" title="Download">
                          <Icon d={I.download} size={13} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors" title="Delete">
                          <Icon d={I.trash} size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* E-Roll comparison */}
              {booth.documents.some((d) => d.type === "E-Roll") && (
                <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">E-Roll Comparison</div>
                    <Badge variant="info">Ready to Compare</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    Compare the uploaded E-Roll PDF with live voter data to identify discrepancies, missing records, or mismatches.
                  </p>
                  <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#1d4ed8] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">
                    <Icon d={I.refreshCw} size={14} />Run Comparison
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// FORMS & SURVEY MANAGEMENT
// ─── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

type FormStatus = "Draft" | "Active" | "Closed";
type ParticipantType = "All" | "Public" | "Voters" | "Members";
type QuestionType = "Short Text" | "Long Text" | "Number" | "Single Choice" | "Multiple Choice" | "Dropdown" | "Date" | "Rating";

interface FormQuestion {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: string[];
  maxRating?: number;
}

interface FormSection {
  id: string;
  title: string;
  questions: FormQuestion[];
}

interface SurveyForm {
  id: string;
  title: string;
  description: string;
  audience: ParticipantType;
  status: FormStatus;
  responses: number;
  createdDate: string;
  sections: FormSection[];
}

interface FormResponse {
  id: string;
  respondent: string;
  date: string;
  type: ParticipantType;
  status: "Complete" | "Partial";
  answers: Record<string, string | string[]>;
}

const FORM_STATUS_V: Record<FormStatus, BadgeVariant> = { Draft: "muted", Active: "success", Closed: "warning" };

const FORMS_DATA: SurveyForm[] = [
  {
    id: "f1", title: "Voter Satisfaction Survey 2024", description: "Measure voter satisfaction with election services.", audience: "Voters", status: "Active", responses: 1842, createdDate: "10 Aug 2024",
    sections: [
      {
        id: "s1", title: "Personal Information", questions: [
          { id: "q1", type: "Short Text", label: "Full Name", required: true },
          { id: "q2", type: "Dropdown", label: "Ward", required: true, options: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"] },
          { id: "q3", type: "Single Choice", label: "Gender", required: false, options: ["Male", "Female", "Other"] },
        ],
      },
      {
        id: "s2", title: "Satisfaction", questions: [
          { id: "q4", type: "Rating", label: "Overall satisfaction with election services", required: true, maxRating: 5 },
          { id: "q5", type: "Multiple Choice", label: "Which services did you use?", required: false, options: ["Voter ID", "Booth assistance", "Helpline", "Website"] },
          { id: "q6", type: "Long Text", label: "Any additional comments?", required: false },
        ],
      },
    ],
  },
  {
    id: "f2", title: "Member Engagement Form", description: "Collect feedback from active party members.", audience: "Members", status: "Active", responses: 486, createdDate: "05 Aug 2024",
    sections: [
      {
        id: "s1", title: "Engagement", questions: [
          { id: "q1", type: "Rating", label: "How engaged do you feel with party activities?", required: true, maxRating: 5 },
          { id: "q2", type: "Multiple Choice", label: "What activities have you participated in?", required: false, options: ["Rallies", "Booth work", "Canvassing", "Social media"] },
          { id: "q3", type: "Long Text", label: "Suggestions for improvement", required: false },
        ],
      },
    ],
  },
  {
    id: "f3", title: "Booth Feedback Form", description: "Quick feedback from voters at booths.", audience: "Voters", status: "Closed", responses: 3240, createdDate: "01 Jul 2024",
    sections: [
      {
        id: "s1", title: "Booth Experience", questions: [
          { id: "q1", type: "Rating", label: "Booth experience rating", required: true, maxRating: 5 },
          { id: "q2", type: "Single Choice", label: "Was your name on the voter list?", required: true, options: ["Yes", "No"] },
          { id: "q3", type: "Short Text", label: "Booth number", required: true },
        ],
      },
    ],
  },
  {
    id: "f4", title: "New Member Registration Survey", description: "Onboarding survey for new members.", audience: "All", status: "Draft", responses: 0, createdDate: "20 Aug 2024",
    sections: [
      {
        id: "s1", title: "Background", questions: [
          { id: "q1", type: "Short Text", label: "Previous party affiliation", required: false },
          { id: "q2", type: "Multiple Choice", label: "Areas of interest", required: false, options: ["Policy", "Outreach", "Fundraising", "IT & Tech"] },
        ],
      },
    ],
  },
  {
    id: "f5", title: "Public Opinion Poll", description: "Gather public opinion on key issues.", audience: "Public", status: "Active", responses: 9122, createdDate: "15 Aug 2024",
    sections: [
      {
        id: "s1", title: "Key Issues", questions: [
          { id: "q1", type: "Rating", label: "Rate the current government performance", required: true, maxRating: 10 },
          { id: "q2", type: "Single Choice", label: "Most important issue in your area", required: true, options: ["Roads", "Water supply", "Employment", "Education", "Healthcare"] },
          { id: "q3", type: "Long Text", label: "What would you like the government to prioritize?", required: false },
        ],
      },
    ],
  },
];

const FORM_RESPONSES: FormResponse[] = [
  { id: "r1", respondent: "Rahul Sharma", date: "12 Aug 2024", type: "Voters", status: "Complete", answers: { q1: "Rahul Sharma", q2: "Ward 3", q3: "Male", q4: "4", q5: ["Voter ID", "Booth assistance"], q6: "Very smooth process this year." } },
  { id: "r2", respondent: "Priya Shah", date: "11 Aug 2024", type: "Voters", status: "Complete", answers: { q1: "Priya Shah", q2: "Ward 5", q3: "Female", q4: "5", q5: ["Website"], q6: "" } },
  { id: "r3", respondent: "Amit Patel", date: "10 Aug 2024", type: "Voters", status: "Partial", answers: { q1: "Amit Patel", q2: "Ward 1", q3: "Male", q4: "3", q5: [], q6: "" } },
  { id: "r4", respondent: "Sunita Devi", date: "10 Aug 2024", type: "Voters", status: "Complete", answers: { q1: "Sunita Devi", q2: "Ward 2", q3: "Female", q4: "5", q5: ["Helpline"], q6: "Excellent helpline support." } },
  { id: "r5", respondent: "Vijay Kumar", date: "09 Aug 2024", type: "Voters", status: "Complete", answers: { q1: "Vijay Kumar", q2: "Ward 4", q3: "Male", q4: "2", q5: ["Voter ID"], q6: "Long queues at booth." } },
  { id: "r6", respondent: "Kavita Joshi", date: "09 Aug 2024", type: "Voters", status: "Partial", answers: { q1: "Kavita Joshi", q2: "Ward 3", q3: "Female", q4: "4", q5: [], q6: "" } },
];

const OVER_TIME = [
  { date: "10 Aug", responses: 180 }, { date: "11 Aug", responses: 310 }, { date: "12 Aug", responses: 420 },
  { date: "13 Aug", responses: 290 }, { date: "14 Aug", responses: 380 }, { date: "15 Aug", responses: 260 },
];

const QUESTION_TYPES_META: { type: QuestionType; icon: string; desc: string }[] = [
  { type: "Short Text", icon: I.edit, desc: "Single line text" },
  { type: "Long Text", icon: I.fileText, desc: "Multi-line text" },
  { type: "Number", icon: I.reports, desc: "Numeric input" },
  { type: "Single Choice", icon: I.check, desc: "One option" },
  { type: "Multiple Choice", icon: I.checkCircle, desc: "Many options" },
  { type: "Dropdown", icon: I.chevronDown, desc: "Select from list" },
  { type: "Date", icon: I.calendar, desc: "Date picker" },
  { type: "Rating", icon: I.star, desc: "Star rating" },
];

const QTypeIcon: Record<QuestionType, string> = {
  "Short Text": I.edit, "Long Text": I.fileText, "Number": I.reports,
  "Single Choice": I.check, "Multiple Choice": I.checkCircle,
  "Dropdown": I.chevronDown, "Date": I.calendar, "Rating": I.star,
};

// ─── Forms Board ──────────────────────────────────────────────────────────────

function FormsBoard({ onNav }: { onNav: (k: string, data?: unknown) => void }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAudience, setFilterAudience] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");

  const filtered = FORMS_DATA.filter((f) => {
    const q = search.toLowerCase();
    if (search && !f.title.toLowerCase().includes(q)) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    if (filterAudience && f.audience !== filterAudience) return false;
    return true;
  });

  const stats = {
    total: FORMS_DATA.length,
    active: FORMS_DATA.filter((f) => f.status === "Active").length,
    draft: FORMS_DATA.filter((f) => f.status === "Draft").length,
    closed: FORMS_DATA.filter((f) => f.status === "Closed").length,
    totalResponses: FORMS_DATA.reduce((a, f) => a + f.responses, 0),
  };

  const activeFilterCount = [filterStatus, filterAudience].filter(Boolean).length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Election Management</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Forms</span>
        </nav>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Forms & Surveys</h1>
              <Badge variant="muted">{FORMS_DATA.length} forms</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Create surveys, collect responses and analyse results.</p>
          </div>
          <button onClick={() => onNav("form-create")} className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
            <Icon d={I.plus} size={14} />Create Form
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Forms", value: stats.total, icon: I.forms, color: "" },
            { label: "Active", value: stats.active, icon: I.checkCircle, color: "text-green-600" },
            { label: "Draft", value: stats.draft, icon: I.edit, color: "text-slate-400" },
            { label: "Closed", value: stats.closed, icon: I.xCircle, color: "text-amber-500" },
            { label: "Total Responses", value: stats.totalResponses.toLocaleString(), icon: I.members, color: "text-[#1d4ed8]" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-md p-4 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{s.label}</div>
                <div className={`text-2xl font-semibold tracking-tight ${s.color || "text-slate-900"}`}>{typeof s.value === "number" ? s.value : s.value}</div>
              </div>
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-400">
                <Icon d={s.icon} size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search forms…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
          </div>
          <div className="w-px h-6 bg-slate-200" />
          {[
            { label: "Status", val: filterStatus, set: setFilterStatus, opts: ["Draft", "Active", "Closed"] },
            { label: "Audience", val: filterAudience, set: setFilterAudience, opts: ["All", "Public", "Voters", "Members"] },
          ].map((f) => (
            <div key={f.label} className="relative">
              <select value={f.val} onChange={(e) => f.set(e.target.value)}
                className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors
                  ${f.val ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"}`}>
                <option value="">{f.label}</option>
                {f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
              <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          ))}
          {activeFilterCount > 0 && <button onClick={() => { setFilterStatus(""); setFilterAudience(""); }} className="text-xs text-red-500 hover:text-red-700 font-medium px-2">Clear</button>}
          <div className="flex-1" />
          <div className="flex items-center border border-slate-200 rounded overflow-hidden">
            {(["table", "cards"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`w-8 h-8 flex items-center justify-center transition-colors ${view === v ? "bg-slate-100 text-slate-800" : "bg-white text-slate-400 hover:bg-slate-50"}`}>
                <Icon d={v === "table" ? I.list : I.grid} size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">{filtered.length} form{filtered.length !== 1 ? "s" : ""}</span>
          {activeFilterCount > 0 && <Badge variant="default">{activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied</Badge>}
        </div>

        {view === "table" ? (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Icon d={I.forms} size={22} className="text-slate-300" /></div>
                <p className="text-sm font-semibold text-slate-600">No forms found.</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Try adjusting your search or create a new form.</p>
                <button onClick={() => onNav("form-create")} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
                  <Icon d={I.plus} size={14} />Create Form
                </button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Title", "Audience", "Status", "Responses", "Created", "Actions"].map((h, i) => (
                      <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${i >= 4 ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <button onClick={() => onNav("form-detail", f)} className="font-medium text-slate-800 hover:text-[#1d4ed8] transition-colors text-left block">
                          {f.title}
                        </button>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{f.description}</p>
                      </td>
                      <td className="px-4 py-3"><Badge variant="info">{f.audience}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={FORM_STATUS_V[f.status]}>{f.status}</Badge></td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{f.responses.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 text-right">{f.createdDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button onClick={() => onNav("form-detail", f)} className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Details</button>
                          <button onClick={() => onNav("form-analytics", f)} className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Analytics</button>
                          <button onClick={() => onNav("form-responses", f)} className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Responses</button>
                          <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.edit} size={13} /></button>
                          <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.externalLink} size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((f) => (
              <div key={f.id} className="bg-white border border-slate-200 rounded-md p-4 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <button onClick={() => onNav("form-detail", f)} className="font-medium text-slate-800 hover:text-[#1d4ed8] text-sm text-left leading-snug flex-1 mr-2">{f.title}</button>
                  <Badge variant={FORM_STATUS_V[f.status]}>{f.status}</Badge>
                </div>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{f.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1"><Icon d={I.members} size={11} className="text-slate-300" /><span className="font-medium text-slate-700">{f.responses.toLocaleString()}</span> responses</div>
                  <div className="w-px h-3 bg-slate-200" />
                  <Badge variant="info">{f.audience}</Badge>
                  <div className="w-px h-3 bg-slate-200" />
                  <span>{f.createdDate}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
                  <button onClick={() => onNav("form-detail", f)} className="flex-1 py-1.5 text-xs font-medium text-[#1d4ed8] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors text-center">Details</button>
                  <button onClick={() => onNav("form-analytics", f)} className="flex-1 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors text-center">Analytics</button>
                  <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.edit} size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Create Form ──────────────────────────────────────────────────────────────

let _qId = 100;
function genId() { return `q${++_qId}`; }

function CreateForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState<ParticipantType>("All");
  const [status, setStatus] = useState<FormStatus>("Draft");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const [sections, setSections] = useState<FormSection[]>([
    {
      id: "s1", title: "Section 1", questions: [
        { id: genId(), type: "Short Text", label: "Question 1", required: false },
      ],
    },
  ]);

  const [addingType, setAddingType] = useState<{ sectionId: string } | null>(null);
  const [editingQ, setEditingQ] = useState<string | null>(null);

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Form title is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addSection() {
    setSections((p) => [...p, { id: `s${Date.now()}`, title: `Section ${p.length + 1}`, questions: [] }]);
  }

  function deleteSection(sid: string) {
    setSections((p) => p.filter((s) => s.id !== sid));
  }

  function addQuestion(sectionId: string, type: QuestionType) {
    const defaults: Partial<FormQuestion> = {};
    if (["Single Choice", "Multiple Choice", "Dropdown"].includes(type)) defaults.options = ["Option 1", "Option 2"];
    if (type === "Rating") defaults.maxRating = 5;
    const newQ: FormQuestion = { id: genId(), type, label: `New ${type} question`, required: false, ...defaults };
    setSections((p) => p.map((s) => s.id === sectionId ? { ...s, questions: [...s.questions, newQ] } : s));
    setEditingQ(newQ.id);
    setAddingType(null);
  }

  function deleteQuestion(sectionId: string, qId: string) {
    setSections((p) => p.map((s) => s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.id !== qId) } : s));
    if (editingQ === qId) setEditingQ(null);
  }

  function updateQuestion(sectionId: string, qId: string, patch: Partial<FormQuestion>) {
    setSections((p) => p.map((s) => s.id === sectionId ? { ...s, questions: s.questions.map((q) => q.id === qId ? { ...q, ...patch } : q) } : s));
  }

  function updateSectionTitle(sid: string, t: string) {
    setSections((p) => p.map((s) => s.id === sid ? { ...s, title: t } : s));
  }

  function moveQuestion(sectionId: string, qId: string, dir: -1 | 1) {
    setSections((p) => p.map((s) => {
      if (s.id !== sectionId) return s;
      const qs = [...s.questions];
      const idx = qs.findIndex((q) => q.id === qId);
      if (idx + dir < 0 || idx + dir >= qs.length) return s;
      [qs[idx], qs[idx + dir]] = [qs[idx + dir], qs[idx]];
      return { ...s, questions: qs };
    }));
  }

  if (saved) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
        <div className="max-w-[640px] mx-auto px-6 py-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mb-5">
            <Icon d={I.checkCircle} size={28} className="text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Form Created</h2>
          <p className="text-sm text-slate-500 mt-1 mb-1"><span className="font-medium text-slate-700">{title}</span> has been saved as <Badge variant={FORM_STATUS_V[status]}>{status}</Badge></p>
          <p className="text-xs text-slate-400 mb-8">Audience: {audience} · {sections.length} section{sections.length !== 1 ? "s" : ""} · {sections.reduce((a, s) => a + s.questions.length, 0)} questions</p>
          <div className="flex items-center gap-3">
            <button onClick={() => { setSaved(false); setStep(1); setTitle(""); setDescription(""); setSections([{ id: "s1", title: "Section 1", questions: [{ id: genId(), type: "Short Text", label: "Question 1", required: false }] }]); }}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Create Another</button>
            <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">Back to Forms</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[860px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span onClick={onBack} className="hover:text-slate-600 cursor-pointer">Forms</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Create Form</span>
        </nav>
        <div className="flex items-start justify-between">
          <div><h1 className="text-xl font-semibold text-slate-900 tracking-tight">Create Form</h1><p className="text-sm text-slate-500 mt-0.5">Build a survey or feedback form in two steps.</p></div>
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
        </div>

        {/* Step indicator */}
        <div className="bg-white border border-slate-200 rounded-md px-6 py-5 flex justify-center items-center gap-0">
          {[{ n: 1, l: "Basic Details" }, { n: 2, l: "Form Sections" }].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all
                  ${s.n < step ? "bg-[#1d4ed8] border-[#1d4ed8] text-white" : s.n === step ? "bg-white border-[#1d4ed8] text-[#1d4ed8]" : "bg-white border-slate-200 text-slate-400"}`}>
                  {s.n < step ? <Icon d={I.check} size={13} /> : s.n}
                </div>
                <span className={`mt-1 text-[10px] font-medium ${s.n === step ? "text-[#1d4ed8]" : s.n < step ? "text-slate-600" : "text-slate-400"}`}>{s.l}</span>
              </div>
              {i === 0 && <div className={`h-px w-28 mx-3 mb-5 ${step > 1 ? "bg-[#1d4ed8]" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white border border-slate-200 rounded-md p-6 space-y-5">
            <div className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">Basic Details</div>
            <div className="space-y-4">
              <FormField label="Form Title" required>
                <input value={title} onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
                  placeholder="e.g. Voter Satisfaction Survey 2024"
                  className={`w-full px-3 py-2 text-sm border rounded bg-white placeholder-slate-400 focus:outline-none transition-colors
                    ${errors.title ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`} />
                {errors.title && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><Icon d={I.alertCircle} size={11} />{errors.title}</p>}
              </FormField>
              <FormField label="Description">
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief description of this form's purpose…"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors resize-none" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Participant Type">
                  <div className="grid grid-cols-2 gap-2">
                    {(["All", "Public", "Voters", "Members"] as const).map((t) => (
                      <button key={t} onClick={() => setAudience(t)}
                        className={`py-2 px-3 text-xs font-medium rounded border transition-colors
                          ${audience === t ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </FormField>
                <FormField label="Status">
                  <div className="grid grid-cols-3 gap-2">
                    {(["Draft", "Active", "Closed"] as const).map((s) => (
                      <button key={s} onClick={() => setStatus(s)}
                        className={`py-2 px-3 text-xs font-medium rounded border transition-colors
                          ${status === s ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Form builder */}
        {step === 2 && (
          <div className="space-y-4">
            {sections.map((section, si) => (
              <div key={section.id} className="bg-white border border-slate-200 rounded-md overflow-hidden">
                {/* Section header */}
                <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
                  <input value={section.title} onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    className="flex-1 text-sm font-semibold text-slate-800 bg-transparent border-0 outline-none focus:bg-white focus:border focus:border-blue-300 rounded px-1 -mx-1" />
                  <span className="text-xs text-slate-400">{section.questions.length} question{section.questions.length !== 1 ? "s" : ""}</span>
                  {sections.length > 1 && (
                    <button onClick={() => deleteSection(section.id)} className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors rounded">
                      <Icon d={I.trash} size={12} />
                    </button>
                  )}
                </div>

                {/* Questions */}
                <div className="divide-y divide-slate-100">
                  {section.questions.length === 0 && (
                    <div className="px-5 py-6 text-center text-xs text-slate-400">No questions yet. Add one below.</div>
                  )}
                  {section.questions.map((q, qi) => {
                    const isEditing = editingQ === q.id;
                    return (
                      <div key={q.id} className={`p-4 transition-colors ${isEditing ? "bg-blue-50/40" : "hover:bg-slate-50"}`}>
                        <div className="flex items-start gap-3">
                          {/* Drag handle / order */}
                          <div className="flex flex-col items-center gap-1 pt-0.5">
                            <button onClick={() => moveQuestion(section.id, q.id, -1)} disabled={qi === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition-colors">
                              <Icon d="M5 15l7-7 7 7" size={12} />
                            </button>
                            <span className="text-[10px] text-slate-300 font-medium">{qi + 1}</span>
                            <button onClick={() => moveQuestion(section.id, q.id, 1)} disabled={qi === section.questions.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition-colors">
                              <Icon d="M19 9l-7 7-7-7" size={12} />
                            </button>
                          </div>

                          <div className="flex-1 min-w-0">
                            {!isEditing ? (
                              /* Collapsed view */
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <Icon d={QTypeIcon[q.type]} size={12} className="text-slate-400 shrink-0" />
                                    <span className="text-xs text-slate-400">{q.type}</span>
                                    {q.required && <span className="text-[10px] text-red-400 font-medium">Required</span>}
                                  </div>
                                  <div className="text-sm font-medium text-slate-800">{q.label}</div>
                                  {q.options && <div className="flex gap-1 mt-1 flex-wrap">{q.options.slice(0, 4).map((o) => <span key={o} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{o}</span>)}{q.options.length > 4 && <span className="text-[10px] text-slate-400">+{q.options.length - 4} more</span>}</div>}
                                  {q.type === "Rating" && <div className="flex gap-0.5 mt-1">{Array.from({ length: q.maxRating ?? 5 }).map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}</div>}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button onClick={() => setEditingQ(q.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"><Icon d={I.edit} size={13} /></button>
                                  <button onClick={() => deleteQuestion(section.id, q.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-white hover:text-red-400 transition-colors"><Icon d={I.trash} size={13} /></button>
                                </div>
                              </div>
                            ) : (
                              /* Expanded edit view */
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <input value={q.label} onChange={(e) => updateQuestion(section.id, q.id, { label: e.target.value })}
                                    className="flex-1 text-sm font-medium text-slate-800 border border-blue-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-400 bg-white" />
                                  <div className="relative">
                                    <select value={q.type} onChange={(e) => updateQuestion(section.id, q.id, { type: e.target.value as QuestionType })}
                                      className="appearance-none text-xs border border-slate-200 rounded px-2 py-1.5 pr-7 bg-white text-slate-700 focus:outline-none focus:border-blue-300 cursor-pointer">
                                      {QUESTION_TYPES_META.map((t) => <option key={t.type}>{t.type}</option>)}
                                    </select>
                                    <Icon d={I.chevronDown} size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                  </div>
                                </div>

                                {q.type === "Rating" && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Max rating:</span>
                                    {[5, 10].map((n) => (
                                      <button key={n} onClick={() => updateQuestion(section.id, q.id, { maxRating: n })}
                                        className={`px-2 py-0.5 text-xs rounded border transition-colors ${q.maxRating === n ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-600"}`}>{n}</button>
                                    ))}
                                  </div>
                                )}

                                {q.options !== undefined && (
                                  <div className="space-y-1.5">
                                    <div className="text-xs text-slate-500 font-medium">Options</div>
                                    {q.options.map((opt, oi) => (
                                      <div key={oi} className="flex items-center gap-2">
                                        <div className="w-3 h-3 border border-slate-300 rounded-full shrink-0" />
                                        <input value={opt} onChange={(e) => { const o = [...q.options!]; o[oi] = e.target.value; updateQuestion(section.id, q.id, { options: o }); }}
                                          className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-300 bg-white" />
                                        <button onClick={() => { const o = q.options!.filter((_, i) => i !== oi); updateQuestion(section.id, q.id, { options: o }); }}
                                          className="text-slate-300 hover:text-red-400 transition-colors"><Icon d={I.x} size={11} /></button>
                                      </div>
                                    ))}
                                    <button onClick={() => updateQuestion(section.id, q.id, { options: [...q.options!, `Option ${q.options!.length + 1}`] })}
                                      className="text-xs text-[#1d4ed8] hover:underline font-medium">+ Add option</button>
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                                    <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(section.id, q.id, { required: e.target.checked })} className="accent-[#1d4ed8] rounded" />
                                    Required question
                                  </label>
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => setEditingQ(null)} className="px-3 py-1 text-xs font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">Done</button>
                                    <button onClick={() => deleteQuestion(section.id, q.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-white hover:text-red-400 transition-colors"><Icon d={I.trash} size={13} /></button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add question */}
                {addingType?.sectionId === section.id ? (
                  <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Select question type</div>
                    <div className="grid grid-cols-4 gap-2">
                      {QUESTION_TYPES_META.map((qt) => (
                        <button key={qt.type} onClick={() => addQuestion(section.id, qt.type)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors text-left">
                          <Icon d={qt.icon} size={13} className="text-slate-400 shrink-0" />
                          <div><div className="font-medium">{qt.type}</div><div className="text-[10px] text-slate-400">{qt.desc}</div></div>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setAddingType(null)} className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                  </div>
                ) : (
                  <div className="px-5 py-3 border-t border-slate-100">
                    <button onClick={() => { setAddingType({ sectionId: section.id }); setEditingQ(null); }}
                      className="flex items-center gap-2 text-xs font-medium text-[#1d4ed8] hover:underline">
                      <Icon d={I.plus} size={13} />Add Question
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add section */}
            <button onClick={addSection} className="w-full py-3 text-sm font-medium text-slate-500 border-2 border-dashed border-slate-200 rounded-md hover:border-blue-300 hover:text-[#1d4ed8] transition-colors flex items-center justify-center gap-2">
              <Icon d={I.plus} size={14} />Add Section
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white border border-slate-200 rounded-md px-5 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-400">Step {step} of 2{step === 2 ? ` · ${sections.reduce((a, s) => a + s.questions.length, 0)} questions` : ""}</div>
          <div className="flex items-center gap-2">
            {step === 2 && <button onClick={() => setStep(1)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors flex items-center gap-2"><Icon d={I.chevronLeft} size={14} />Back</button>}
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Save Draft</button>
            {step === 1
              ? <button onClick={() => { if (validateStep1()) setStep(2); }} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors flex items-center gap-2">Next<Icon d={I.chevronRight} size={14} /></button>
              : <button onClick={() => setSaved(true)} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors flex items-center gap-2"><Icon d={I.check} size={14} />Publish Form</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Form Detail (tabs: Analytics, Responses, Edit Fields, Access, Share) ─────

function FormDetail({ form, initialTab, onBack }: { form: SurveyForm; initialTab?: string; onBack: () => void }) {
  const [tab, setTab] = useState<string>(initialTab ?? "analytics");
  const [responseFilter, setResponseFilter] = useState("");
  const [responseSearch, setResponseSearch] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const shareUrl = `https://electmanager.app/form/${form.id}`;
  const completionRate = FORM_RESPONSES.length > 0 ? Math.round((FORM_RESPONSES.filter((r) => r.status === "Complete").length / FORM_RESPONSES.length) * 100) : 0;
  const avgRating = 4.1;

  const filteredResponses = FORM_RESPONSES.filter((r) => {
    if (responseSearch && !r.respondent.toLowerCase().includes(responseSearch.toLowerCase())) return false;
    if (responseFilter && r.status !== responseFilter) return false;
    return true;
  });

  const TABS = ["analytics", "responses", "edit-fields", "access", "share"];
  const TAB_LABELS: Record<string, string> = { analytics: "Analytics", responses: `Responses (${form.responses.toLocaleString()})`, "edit-fields": "Edit Fields", access: "Access", share: "Share" };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span onClick={onBack} className="hover:text-slate-600 cursor-pointer">Forms</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium truncate">{form.title}</span>
        </nav>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-md px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{form.title}</h1>
              <Badge variant={FORM_STATUS_V[form.status]}>{form.status}</Badge>
              <Badge variant="info">{form.audience}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">{form.description}</p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{form.responses.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Responses</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{form.createdDate}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Created</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShareOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                <Icon d={I.externalLink} size={14} />Share
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
                <Icon d={I.edit} size={14} />Edit
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="border-b border-slate-200 flex px-4 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                  ${tab === t ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          {/* ─── ANALYTICS ─── */}
          {tab === "analytics" && (
            <div className="p-5 space-y-5">
              {/* KPI row */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Total Responses", value: form.responses.toLocaleString(), icon: I.members, sub: "All time" },
                  { label: "Completion Rate", value: `${completionRate}%`, icon: I.checkCircle, sub: "of started forms" },
                  { label: "Avg. Rating", value: avgRating.toFixed(1), icon: I.star, sub: "across rating questions" },
                  { label: "Sections", value: form.sections.length.toString(), icon: I.list, sub: `${form.sections.reduce((a, s) => a + s.questions.length, 0)} total questions` },
                ].map((k) => (
                  <div key={k.label} className="bg-slate-50 border border-slate-100 rounded-md p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{k.label}</span>
                      <Icon d={k.icon} size={13} className="text-slate-400" />
                    </div>
                    <div className="text-2xl font-semibold text-slate-900 tracking-tight">{k.value}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Over time chart */}
              <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Responses Over Time</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={OVER_TIME} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${v} responses`, ""]} />
                    <Bar dataKey="responses" fill="#1d4ed8" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Respondent type distribution */}
                <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Respondent Type</div>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="45%" height={130}>
                      <PieChart>
                        <Pie data={[{ name: "Voters", value: 78, color: "#1d4ed8" }, { name: "Members", value: 14, color: "#6366f1" }, { name: "Public", value: 8, color: "#94a3b8" }]}
                          cx="50%" cy="50%" innerRadius={36} outerRadius={60} dataKey="value" labelLine={false}>
                          {[{ color: "#1d4ed8" }, { color: "#6366f1" }, { color: "#94a3b8" }].map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {[{ label: "Voters", pct: 78, color: "#1d4ed8" }, { label: "Members", pct: 14, color: "#6366f1" }, { label: "Public", pct: 8, color: "#94a3b8" }].map((d) => (
                        <div key={d.label} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: d.color }} /><span className="text-slate-600">{d.label}</span></div>
                          <span className="font-semibold text-slate-700">{d.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Question-wise response summary */}
                <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Question Response Rate</div>
                  <div className="space-y-2.5">
                    {form.sections.flatMap((s) => s.questions).slice(0, 5).map((q, i) => {
                      const rate = Math.round(85 - i * 8);
                      return (
                        <div key={q.id}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-600 truncate max-w-[200px]">{q.label}</span>
                            <span className="font-medium text-slate-700 ml-2">{rate}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#1d4ed8] rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── RESPONSES ─── */}
          {tab === "responses" && (
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input value={responseSearch} onChange={(e) => setResponseSearch(e.target.value)} placeholder="Search respondent…"
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
                </div>
                <div className="relative">
                  <select value={responseFilter} onChange={(e) => setResponseFilter(e.target.value)}
                    className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors
                      ${responseFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                    <option value="">All Status</option>
                    <option>Complete</option>
                    <option>Partial</option>
                  </select>
                  <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors ml-auto">
                  <Icon d={I.download} size={14} />Export CSV
                </button>
              </div>

              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {["Respondent", "Date", "Type", "Status", "View"].map((h, i) => (
                        <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${i >= 4 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResponses.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-sm text-slate-400">No responses match your filter.</td></tr>
                    ) : filteredResponses.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-semibold text-slate-500 shrink-0">
                              {r.respondent.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span className="font-medium text-slate-800">{r.respondent}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                        <td className="px-4 py-3"><Badge variant="info">{r.type}</Badge></td>
                        <td className="px-4 py-3">
                          <Badge variant={r.status === "Complete" ? "success" : "warning"}>{r.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="px-2.5 py-1 text-xs font-medium text-[#1d4ed8] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">View Response</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filteredResponses.length} of {form.responses.toLocaleString()} responses</span>
                <div className="flex items-center gap-1">
                  <button disabled className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded disabled:opacity-40 flex items-center gap-1"><Icon d={I.chevronLeft} size={12} />Previous</button>
                  <button className="w-7 h-7 text-xs font-medium rounded bg-[#1d4ed8] text-white">1</button>
                  <button className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 flex items-center gap-1">Next<Icon d={I.chevronRight} size={12} /></button>
                </div>
              </div>
            </div>
          )}

          {/* ─── EDIT FIELDS ─── */}
          {tab === "edit-fields" && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Edit form sections and questions. Changes apply immediately.</p>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors"><Icon d={I.check} size={14} />Save Changes</button>
              </div>
              {form.sections.map((section) => (
                <div key={section.id} className="border border-slate-200 rounded-md overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
                    <span className="text-sm font-semibold text-slate-800">{section.title}</span>
                    <span className="text-xs text-slate-400">{section.questions.length} question{section.questions.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {section.questions.map((q, qi) => (
                      <div key={q.id} className="px-5 py-3 flex items-center gap-4">
                        <span className="text-xs text-slate-300 font-medium w-4">{qi + 1}</span>
                        <Icon d={QTypeIcon[q.type]} size={13} className="text-slate-400 shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm text-slate-800">{q.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{q.type}{q.required ? " · Required" : ""}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.edit} size={13} /></button>
                          <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors"><Icon d={I.trash} size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── ACCESS ─── */}
          {tab === "access" && (
            <div className="p-5 space-y-5">
              <p className="text-sm text-slate-500">Control who can access and submit this form.</p>
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Participant Type</div>
                <div className="grid grid-cols-4 gap-3">
                  {(["All", "Public", "Voters", "Members"] as const).map((t) => (
                    <div key={t} className={`p-3 border rounded-md cursor-pointer transition-colors ${form.audience === t ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                      <div className={`text-sm font-medium ${form.audience === t ? "text-blue-700" : "text-slate-700"}`}>{t}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t === "All" ? "Everyone" : t === "Public" ? "Anonymous users" : t === "Voters" ? "Registered voters only" : "Party members only"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submission Settings</div>
                <div className="space-y-2">
                  {["Limit one response per person", "Require authentication", "Allow editing after submission", "Show results to respondents after submission"].map((s) => (
                    <label key={s} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none py-2 px-3 rounded hover:bg-slate-50 transition-colors">
                      <input type="checkbox" defaultChecked={s.includes("one response") || s.includes("Require")} className="accent-[#1d4ed8] rounded" />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">Save Access Settings</button>
              </div>
            </div>
          )}

          {/* ─── SHARE ─── */}
          {tab === "share" && (
            <div className="p-5 space-y-5">
              <p className="text-sm text-slate-500">Share this form with respondents via link, QR code or embed.</p>
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Form Link</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5">
                    <Icon d={I.link} size={14} className="text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-700 font-mono truncate">{shareUrl}</span>
                  </div>
                  <button onClick={() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors whitespace-nowrap">
                    <Icon d={shareCopied ? I.check : I.copy} size={14} className={shareCopied ? "text-green-500" : ""} />
                    {shareCopied ? "Copied!" : "Copy Link"}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors whitespace-nowrap">
                    <Icon d={I.externalLink} size={14} />Open
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">QR Code</div>
                  <div className="border border-slate-200 rounded-md p-4 bg-white inline-block">
                    <QRCodeSVG value={shareUrl} />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                    <Icon d={I.download} size={14} />Download QR Code
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Embed Code</div>
                  <textarea readOnly rows={5}
                    value={`<iframe src="${shareUrl}/embed" width="100%" height="600" frameborder="0" style="border:none; border-radius:6px"></iframe>`}
                    className="w-full text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3 resize-none focus:outline-none" />
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                    <Icon d={I.copy} size={14} />Copy Embed Code
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setShareOpen(false)} />
          <div className="relative bg-white border border-slate-200 rounded-lg shadow-xl w-96 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-900">Share Form</span>
              <button onClick={() => setShareOpen(false)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.x} size={15} /></button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 mb-3">
              <span className="text-xs font-mono text-slate-600 flex-1 truncate">{shareUrl}</span>
              <button onClick={() => setShareCopied(true)} className="text-xs font-medium text-[#1d4ed8] hover:underline whitespace-nowrap"><Icon d={I.copy} size={12} className="inline mr-1" />Copy</button>
            </div>
            <button onClick={() => setShareOpen(false)} className="w-full py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI MODULE ────────────────────────────────────────────────────────────────

interface AIChatMsg {
  id: string;
  role: "user" | "ai";
  content: string;
  time: string;
  voterCard?: { count: number; label: string; voters: { name: string; epic: string; gender: string; age: number }[] };
  chartCard?: boolean;
  historyCard?: boolean;
  actions?: { label: string; variant: "default" | "primary" | "danger"; requiresApproval?: boolean }[];
}

interface AIConversation {
  id: string;
  title: string;
  date: string;
  preview: string;
}

type CampaignStep = "objective" | "content" | "review" | "approval" | "audience" | "schedule" | "launch";

const AI_CONVS: AIConversation[] = [
  { id: "c1", title: "Unvisited voters Booth 12", date: "Today", preview: "Show unvisited voters in Booth 12." },
  { id: "c2", title: "Female voters above 60", date: "Today", preview: "How many female voters above 60 in Ward 3?" },
  { id: "c3", title: "Supporter analysis", date: "Yesterday", preview: "Show supporter breakdown by booth." },
  { id: "c4", title: "Booth 12 coverage", date: "Yesterday", preview: "Generate coverage report for Booth 12." },
  { id: "c5", title: "Uncontacted voters list", date: "2 days ago", preview: "List voters with no contact in Booths 5–10." },
];

const CHAT_INIT: AIChatMsg[] = [
  { id: "m1", role: "user", content: "Show unvisited voters in Booth 12.", time: "10:32 AM" },
  {
    id: "m2", role: "ai",
    content: "I found **324 unvisited voters** in Booth 12. Here is a quick summary of who has not been contacted yet:",
    time: "10:32 AM",
    voterCard: {
      count: 324, label: "Unvisited voters — Booth 12",
      voters: [
        { name: "Rahul Sharma", epic: "ABC1234567", gender: "Male", age: 42 },
        { name: "Priya Shah", epic: "DEF2345678", gender: "Female", age: 29 },
        { name: "Amit Patel", epic: "GHI3456789", gender: "Male", age: 55 },
        { name: "Sunita Devi", epic: "JKL4567890", gender: "Female", age: 38 },
      ],
    },
    actions: [
      { label: "View all voters", variant: "default" },
      { label: "Generate report", variant: "primary" },
      { label: "Show graph", variant: "default" },
      { label: "Send WhatsApp", variant: "danger", requiresApproval: true },
    ],
  },
  { id: "m3", role: "user", content: "What is the gender breakdown?", time: "10:33 AM" },
  {
    id: "m4", role: "ai",
    content: "Here is the gender breakdown of the 324 unvisited voters in Booth 12:",
    time: "10:33 AM", chartCard: true,
    actions: [{ label: "Export data", variant: "default" }, { label: "Generate full report", variant: "primary" }],
  },
];

const AI_REPORT_ROWS = [
  { name: "Rahul Sharma", epic: "ABC1234567", gender: "Male", age: 52, booth: "Booth 10", visited: "No" },
  { name: "Priya Mehta", epic: "DEF2345678", gender: "Female", age: 61, booth: "Booth 11", visited: "No" },
  { name: "Suresh Kumar", epic: "GHI3456789", gender: "Male", age: 58, booth: "Booth 12", visited: "No" },
  { name: "Lakshmi Devi", epic: "JKL4567890", gender: "Female", age: 74, booth: "Booth 13", visited: "No" },
  { name: "Vijay Singh", epic: "MNO5678901", gender: "Male", age: 66, booth: "Booth 14", visited: "No" },
  { name: "Anita Yadav", epic: "PQR6789012", gender: "Female", age: 53, booth: "Booth 15", visited: "No" },
  { name: "Mohan Das", epic: "STU7890123", gender: "Male", age: 71, booth: "Booth 10", visited: "No" },
  { name: "Kavita Joshi", epic: "VWX8901234", gender: "Female", age: 55, booth: "Booth 11", visited: "No" },
];

const RAG_CHAT_INIT: AIChatMsg[] = [
  { id: "r1", role: "user", content: "Show previous election results for Booth 125.", time: "11:00 AM" },
  {
    id: "r2", role: "ai", time: "11:00 AM", historyCard: true,
    content: "**Booth 125 — 2019 General Election**\n\nTotal votes: **1,190**\n\n• BJP — **520** votes (43.7%)\n• INC — **410** votes (34.5%)\n• AAP — **185** votes (15.5%)\n• Others — **75** votes (6.3%)\n\nBJP won by a margin of **110 votes** over INC.",
  },
];

const PARTY_COLORS: Record<string, string> = { BJP: "#f97316", INC: "#22c55e", AAP: "#0ea5e9", Others: "#94a3b8" };

const HIST_RESULTS = [
  { year: "2004", BJP: 395, INC: 498, AAP: 0, Others: 130 },
  { year: "2009", BJP: 410, INC: 520, AAP: 0, Others: 110 },
  { year: "2014", BJP: 480, INC: 460, AAP: 120, Others: 95 },
  { year: "2019", BJP: 520, INC: 410, AAP: 185, Others: 75 },
];

const BOOTH_COMPARE = [
  { booth: "Booth 123", BJP: 480, INC: 395, turnout: 72 },
  { booth: "Booth 124", BJP: 510, INC: 420, turnout: 75 },
  { booth: "Booth 125", BJP: 520, INC: 410, turnout: 78 },
  { booth: "Booth 126", BJP: 498, INC: 445, turnout: 71 },
  { booth: "Booth 127", BJP: 465, INC: 430, turnout: 68 },
];

const CAMPAIGN_STEPS_DEF: { key: CampaignStep; label: string }[] = [
  { key: "objective", label: "Campaign Objective" },
  { key: "content", label: "AI Generated Content" },
  { key: "review", label: "Human Review" },
  { key: "approval", label: "Approval" },
  { key: "audience", label: "Audience" },
  { key: "schedule", label: "Schedule" },
  { key: "launch", label: "Launch & Analytics" },
];

// ─── AI Mode ──────────────────────────────────────────────────────────────────

function AIModeScreen() {
  const [activeConv, setActiveConv] = useState("c1");
  const [messages, setMessages] = useState<AIChatMsg[]>(CHAT_INIT);
  const [input, setInput] = useState("");
  const [approvalAction, setApprovalAction] = useState<string | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send() {
    if (!input.trim()) return;
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((p) => [
      ...p,
      { id: `u${Date.now()}`, role: "user", content: input, time: t },
      {
        id: `a${Date.now()}`, role: "ai", time: t,
        content: "I'm analysing your query across the voter database. Here are the relevant results.",
        actions: [{ label: "View results", variant: "default" }, { label: "Generate report", variant: "primary" }],
      },
    ]);
    setInput("");
  }

  function renderMsg(msg: AIChatMsg) {
    const isUser = msg.role === "user";
    return (
      <div key={msg.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && (
          <div className="w-7 h-7 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <Icon d={I.sparkle} size={11} className="text-white" />
          </div>
        )}
        <div className={`max-w-[76%] flex flex-col gap-2.5 ${isUser ? "items-end" : "items-start"}`}>
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser ? "bg-[#1d4ed8] text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"}`}>
            {msg.content.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
              p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
            )}
          </div>

          {msg.voterCard && (
            <div className="w-[440px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1d4ed8]">
                  <Icon d={I.voters} size={13} />{msg.voterCard.count.toLocaleString()} {msg.voterCard.label}
                </div>
                <Badge variant="info">Booth 12</Badge>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>{["Name", "EPIC", "Gender", "Age"].map((h) => <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {msg.voterCard.voters.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium text-slate-800">{v.name}</td>
                      <td className="px-3 py-2 font-mono text-[10px] text-slate-400">{v.epic}</td>
                      <td className="px-3 py-2 text-slate-600">{v.gender}</td>
                      <td className="px-3 py-2 text-slate-600">{v.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400">Showing 4 of {msg.voterCard.count} · <button className="text-[#1d4ed8] hover:underline">View all</button></div>
            </div>
          )}

          {msg.chartCard && (
            <div className="w-[400px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-700">Gender Breakdown — Unvisited Voters, Booth 12</div>
              <div className="p-4 flex items-center gap-4">
                <ResponsiveContainer width="42%" height={110}>
                  <PieChart>
                    <Pie data={[{ v: 187 }, { v: 130 }, { v: 7 }]} cx="50%" cy="50%" outerRadius={50} dataKey="v" labelLine={false}>
                      {["#1d4ed8", "#8b5cf6", "#94a3b8"].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {[{ l: "Male", v: 187, p: 58, c: "#1d4ed8" }, { l: "Female", v: 130, p: 40, c: "#8b5cf6" }, { l: "Other", v: 7, p: 2, c: "#94a3b8" }].map((d) => (
                    <div key={d.l}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: d.c }} /><span className="text-slate-600">{d.l}</span></div>
                        <span className="font-semibold text-slate-700 text-[10px]">{d.v} ({d.p}%)</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full"><div className="h-full rounded-full" style={{ width: `${d.p}%`, background: d.c }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {msg.actions && (
            <div className="flex flex-wrap gap-2">
              {msg.actions.map((a, i) => (
                <button key={i} onClick={() => a.requiresApproval && setApprovalAction(a.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors
                    ${a.requiresApproval ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : a.variant === "primary" ? "border-blue-300 bg-blue-50 text-[#1d4ed8] hover:bg-blue-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                  {a.requiresApproval && <Icon d={I.alertCircle} size={11} />}{a.label}
                </button>
              ))}
            </div>
          )}
          <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
        </div>
        {isUser && <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-semibold text-slate-600">U</div>}
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Conversation sidebar */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-3 py-3 border-b border-slate-200">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">
            <Icon d={I.plus} size={13} />New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {(["Today", "Yesterday", "2 days ago"] as const).map((group) => {
            const items = AI_CONVS.filter((c) => c.date === group);
            if (!items.length) return null;
            return (
              <div key={group}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{group}</div>
                {items.map((c) => (
                  <button key={c.id} onClick={() => setActiveConv(c.id)}
                    className={`w-full text-left px-3 py-2.5 transition-colors border-l-2 ${activeConv === c.id ? "bg-blue-50 border-[#1d4ed8]" : "border-transparent hover:bg-slate-50"}`}>
                    <div className={`text-xs font-medium truncate ${activeConv === c.id ? "text-[#1d4ed8]" : "text-slate-700"}`}>{c.title}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{c.preview}</div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <div className="px-3 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Language</span>
          <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none cursor-pointer">
            <option>English</option><option>Hindi</option><option>Bengali</option>
          </select>
        </div>
      </div>

      {/* Chat main */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-full flex items-center justify-center">
              <Icon d={I.sparkle} size={14} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">ElecAI Assistant</div>
              <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-medium">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />Online · AI powered
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.refreshCw} size={13} /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.moreHorizontal} size={13} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {messages.map(renderMsg)}
          <div ref={chatEnd} />
        </div>

        {!input && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {["Unvisited voters in Booth 10", "Female supporters in Ward 3", "Coverage report for all booths"].map((s) => (
              <button key={s} onClick={() => setInput(s)}
                className="text-xs text-slate-600 bg-white border border-slate-200 rounded-full px-3 py-1.5 hover:bg-blue-50 hover:border-blue-200 hover:text-[#1d4ed8] transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0">
          <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:bg-white transition-colors">
            <button className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
              <Icon d={I.paperclip} size={14} />
            </button>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything about your voters, booths, or members…" rows={1}
              className="flex-1 text-sm text-slate-800 bg-transparent resize-none focus:outline-none placeholder-slate-400 min-h-[28px] max-h-[120px] py-0.5" />
            <div className="flex items-center gap-1 shrink-0">
              <button className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <Icon d={I.mic} size={14} />
              </button>
              <button onClick={send} disabled={!input.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1d4ed8] text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <Icon d={I.campaigns} size={14} />
              </button>
            </div>
          </div>
          <p className="text-center mt-2 text-[10px] text-slate-400">AI responses may be inaccurate. Always verify before acting on voter data.</p>
        </div>
      </div>

      {/* Human approval modal */}
      {approvalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setApprovalAction(null)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-2xl w-[440px] p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center shrink-0">
                <Icon d={I.alertCircle} size={20} className="text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Human Approval Required</div>
                <p className="text-xs text-slate-500 leading-relaxed">The action <strong className="text-slate-700">"{approvalAction}"</strong> will communicate with 324 voters in Booth 12. This cannot be undone. Review carefully before approving.</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5 space-y-2 text-xs">
              {[["Recipients", "324 voters"], ["Channel", "WhatsApp"], ["Message type", "Booth visit outreach"], ["Estimated cost", "₹97.20 (324 credits)"], ["Available credits", "5,000 credits"]].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-slate-600">{k}</span>
                  <span className={`font-semibold ${k === "Estimated cost" ? "text-amber-700" : "text-slate-800"}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setApprovalAction(null)} className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setApprovalAction(null)} className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Icon d={I.check} size={14} />Approve & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI Search ────────────────────────────────────────────────────────────────

function AISearch() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const EXAMPLES = [
    "Show voters above 50 in Booth 10.",
    "Show unvisited voters.",
    "Show female voters who have not been visited.",
    "Show voters with mobile number in Ward 5.",
    "List BJP supporters in Booth 12.",
  ];

  const PARSED: Record<string, { label: string; value: string }[]> = {
    "Show voters above 50 in Booth 10.": [{ label: "Age", value: "above 50" }, { label: "Booth", value: "Booth 10" }],
    "Show unvisited voters.": [{ label: "Visited", value: "No" }],
    "Show female voters who have not been visited.": [{ label: "Gender", value: "Female" }, { label: "Visited", value: "No" }],
    "Show voters with mobile number in Ward 5.": [{ label: "Mobile", value: "Available" }, { label: "Ward", value: "Ward 5" }],
    "List BJP supporters in Booth 12.": [{ label: "Party affiliation", value: "BJP" }, { label: "Booth", value: "Booth 12" }],
  };

  const COUNTS: Record<string, number> = {
    "Show voters above 50 in Booth 10.": 342,
    "Show unvisited voters.": 4210,
    "Show female voters who have not been visited.": 1984,
    "Show voters with mobile number in Ward 5.": 892,
    "List BJP supporters in Booth 12.": 281,
  };

  function runSearch(q: string) {
    setQuery(q); setActiveQuery(q); setSearched(true);
  }

  const filters = PARSED[activeQuery] ?? (activeQuery ? [{ label: "Query", value: activeQuery }] : []);
  const count = COUNTS[activeQuery] ?? 1287;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[880px] mx-auto px-6 py-8 space-y-5">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#1d4ed8] to-[#7c3aed] text-white text-[10px] font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            <Icon d={I.sparkle} size={10} />AI-Powered
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Natural Language Voter Search</h1>
          <p className="text-sm text-slate-500 mt-1">Ask a question in plain English and instantly filter your voter database.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-lg flex items-center justify-center shrink-0">
              <Icon d={I.sparkle} size={14} className="text-white" />
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") runSearch(query); }}
              placeholder="e.g. Show female voters above 50 in Booth 12 who have not been visited…"
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
            <button onClick={() => runSearch(query)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors shrink-0">
              <Icon d={I.search} size={13} />Search
            </button>
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mr-1">Examples:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => runSearch(ex)}
                className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-blue-50 hover:border-blue-200 hover:text-[#1d4ed8] transition-colors">
                {ex}
              </button>
            ))}
          </div>
        </div>

        {searched && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon d={I.check} size={14} className="text-green-500" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Query Interpreted As</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.map((f) => (
                  <div key={f.label} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 text-xs">
                    <span className="text-slate-500 font-medium">{f.label}:</span>
                    <span className="font-semibold text-[#1d4ed8]">{f.value}</span>
                    <button className="text-blue-300 hover:text-blue-500 ml-0.5"><Icon d={I.x} size={11} /></button>
                  </div>
                ))}
                <button className="text-xs text-[#1d4ed8] hover:underline font-medium px-2">+ Add filter</button>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <span><strong className="text-slate-900 text-lg font-bold">{count.toLocaleString()}</strong> voters matched</span>
                <span className="text-slate-300">·</span>
                <span>From <strong className="text-slate-700">38,450</strong> total voters</span>
                <div className="ml-auto flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors"><Icon d={I.download} size={12} />Export</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.fileText} size={12} />Report</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">By Gender</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={[{ name: "Male", value: Math.round(count * 0.53) }, { name: "Female", value: Math.round(count * 0.45) }, { name: "Other", value: Math.round(count * 0.02) }]} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => `${v} voters`} />
                    <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                      {["#1d4ed8", "#8b5cf6", "#94a3b8"].map((c, i) => <Cell key={i} fill={c} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">By Age Group</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={[{ age: "18–30", n: Math.round(count * 0.16) }, { age: "31–50", n: Math.round(count * 0.45) }, { age: "51–70", n: Math.round(count * 0.32) }, { age: "70+", n: Math.round(count * 0.07) }]} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                    <XAxis dataKey="age" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => `${v} voters`} />
                    <Bar dataKey="n" fill="#1d4ed8" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Search Results</span>
                <span className="text-xs text-slate-400">Showing 1–8 of {count.toLocaleString()}</span>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>{["Name", "EPIC", "Gender", "Age", "Booth", "Ward", "Status"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AI_REPORT_ROWS.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{v.name}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate-400">{v.epic}</td>
                      <td className="px-4 py-2.5 text-slate-600">{v.gender}</td>
                      <td className="px-4 py-2.5 text-slate-600">{v.age}</td>
                      <td className="px-4 py-2.5 text-slate-600">{v.booth}</td>
                      <td className="px-4 py-2.5 text-slate-600">Ward {(i % 5) + 1}</td>
                      <td className="px-4 py-2.5"><Badge variant="warning">Unvisited</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Showing 8 of {count.toLocaleString()} results</span>
                <div className="flex gap-1">
                  <button className="px-2.5 py-1.5 border border-slate-200 rounded text-slate-600 flex items-center gap-1 opacity-40 cursor-not-allowed"><Icon d={I.chevronLeft} size={12} />Prev</button>
                  <button className="px-2.5 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 flex items-center gap-1">Next<Icon d={I.chevronRight} size={12} /></button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── AI Report ────────────────────────────────────────────────────────────────

function AIReport() {
  const [query, setQuery] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeQ, setActiveQ] = useState("");

  const EXAMPLES = [
    "Generate a report of voters above 50 who have not been visited in Booths 10–15.",
    "Export female voters in Ward 3 who are BJP supporters.",
    "All voters with missing mobile numbers in Booth 12.",
  ];

  function generate(q: string) {
    setActiveQ(q); setQuery(q); setGenerating(true); setGenerated(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1100);
  }

  const FILTERS_INTERPRETED = [
    { key: "Age", value: "Above 50 years" },
    { key: "Visited", value: "No" },
    { key: "Booths", value: "Booth 10, 11, 12, 13, 14, 15" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[900px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-lg flex items-center justify-center">
            <Icon d={I.sparkle} size={14} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">AI Report Generator</h1>
            <p className="text-sm text-slate-500">Describe the report you need in plain English.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Describe your report</label>
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={3}
            placeholder="e.g. Generate an Excel report of voters above 50 who have not been visited in Booths 10–15."
            className="w-full text-sm text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-400 resize-none bg-slate-50 focus:bg-white transition-colors mb-3" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Quick examples</span>
              {EXAMPLES.map((ex) => (
                <button key={ex} onClick={() => generate(ex)} className="text-xs text-left text-[#1d4ed8] hover:underline">{ex.slice(0, 60)}…</button>
              ))}
            </div>
            <button onClick={() => generate(query || EXAMPLES[0])}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors shrink-0">
              <Icon d={I.sparkle} size={13} />{generating ? "Generating…" : "Generate Report"}
            </button>
          </div>
        </div>

        {generating && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-full flex items-center justify-center animate-pulse">
              <Icon d={I.sparkle} size={15} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-800 mb-0.5">Analysing your query…</div>
              <div className="text-xs text-slate-400">Parsing filters · Querying voter database · Building preview</div>
            </div>
          </div>
        )}

        {generated && !generating && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Icon d={I.checkCircle} size={14} className="text-green-500" />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Interpreted Query</span>
                </div>
                <div className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 mb-4 font-mono leading-relaxed">{activeQ}</div>
                <div className="space-y-2.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Applied Filters</div>
                  {FILTERS_INTERPRETED.map((f) => (
                    <div key={f.key} className="flex items-center gap-3 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] shrink-0" />
                      <span className="text-slate-500 font-medium w-20">{f.key}</span>
                      <span className="font-semibold text-slate-800">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-4">Dataset</div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="text-3xl font-bold text-slate-900 tracking-tight">2,847</div>
                    <div className="text-xs text-slate-500 mt-0.5">matching voters</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                    <div><div className="text-base font-semibold text-slate-800">114</div><div className="text-[10px] text-slate-400">pages (25/pg)</div></div>
                    <div><div className="text-base font-semibold text-slate-800">~2.1 MB</div><div className="text-[10px] text-slate-400">est. file size</div></div>
                  </div>
                </div>
                <div className="space-y-2 border-t border-slate-100 pt-4 mt-4">
                  {[{ label: "Export Excel", icon: I.download, primary: true }, { label: "Export PDF", icon: I.fileText, primary: false }, { label: "Export CSV", icon: I.download, primary: false }].map((btn) => (
                    <button key={btn.label} className={`w-full flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg border transition-colors
                      ${btn.primary ? "bg-[#1d4ed8] text-white border-transparent hover:bg-blue-700" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                      <Icon d={btn.icon} size={12} />{btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Preview — First 8 rows</span>
                <span className="text-xs text-slate-400">2,847 total rows</span>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>{["#", "Name", "EPIC", "Gender", "Age", "Booth", "Visited"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AI_REPORT_ROWS.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 text-slate-400 font-mono text-[11px]">{i + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">{v.name}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate-400">{v.epic}</td>
                      <td className="px-4 py-2.5 text-slate-600">{v.gender}</td>
                      <td className="px-4 py-2.5 text-slate-600">{v.age}</td>
                      <td className="px-4 py-2.5 text-slate-600">{v.booth}</td>
                      <td className="px-4 py-2.5"><Badge variant="warning">No</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400">Preview only. Export to view all 2,847 rows.</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── AI Campaign ──────────────────────────────────────────────────────────────

type CampaignChannel = "WhatsApp" | "SMS" | "Voice";

function AICampaign() {
  const [channel, setChannel] = useState<CampaignChannel>("WhatsApp");
  const [step, setStep] = useState<CampaignStep>("objective");
  const [objective, setObjective] = useState("");
  const [content, setContent] = useState("Dear {Name}, we would like to remind you about the upcoming election in your area. Your vote matters! Please visit {Booth} on election day. Contact us at 98XXXXXXXX for any help. — Election Office");
  const [approved, setApproved] = useState(false);

  const stepIdx = CAMPAIGN_STEPS_DEF.findIndex((s) => s.key === step);
  const CREDIT: Record<CampaignChannel, number> = { WhatsApp: 0.30, SMS: 0.15, Voice: 0.75 };
  const totalCost = (4250 * CREDIT[channel]).toFixed(0);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Step sidebar */}
      <div className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-3 py-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-md flex items-center justify-center">
              <Icon d={I.sparkle} size={11} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">AI Campaign</span>
          </div>
          <div className="flex items-center border border-slate-200 rounded-lg p-1 gap-0.5">
            {(["WhatsApp", "SMS", "Voice"] as const).map((ch) => (
              <button key={ch} onClick={() => setChannel(ch)}
                className={`flex-1 py-1.5 text-[10px] font-semibold rounded transition-colors ${channel === ch ? "bg-[#1d4ed8] text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                {ch}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 py-3 px-3 space-y-0.5">
          {CAMPAIGN_STEPS_DEF.map((s, i) => {
            const done = i < stepIdx;
            const active = s.key === step;
            return (
              <button key={s.key} onClick={() => setStep(s.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${active ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-2 transition-all
                  ${done ? "bg-[#1d4ed8] border-[#1d4ed8] text-white" : active ? "border-[#1d4ed8] bg-white text-[#1d4ed8]" : "border-slate-200 bg-white text-slate-400"}`}>
                  {done ? <Icon d={I.check} size={9} /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${active ? "text-[#1d4ed8]" : done ? "text-slate-600" : "text-slate-400"}`}>{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="px-4 py-3 border-t border-slate-200 space-y-1.5 text-xs">
          {[["Est. cost", `₹${totalCost}`, "text-slate-800"], ["Credits left", "12,500", "text-green-700"]].map(([k, v, c]) => (
            <div key={k} className="flex items-center justify-between text-slate-500">
              <span>{k}</span><span className={`font-semibold ${c}`}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc]">
        <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
          <div>
            <div className="text-sm font-semibold text-slate-900">{CAMPAIGN_STEPS_DEF[stepIdx].label}</div>
            <div className="text-xs text-slate-400">Step {stepIdx + 1} of {CAMPAIGN_STEPS_DEF.length}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1.5">
            <Icon d={channel === "WhatsApp" ? I.phone : channel === "SMS" ? I.mail : I.mic} size={12} className="text-slate-400" />
            {channel} Campaign · 4,250 recipients
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">

          {step === "objective" && (
            <div className="max-w-[600px] space-y-5">
              <FormField label="Campaign Objective" required>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[{ l: "Voter outreach", d: "Remind voters to visit the booth" }, { l: "Event reminder", d: "Notify about upcoming events" }, { l: "Booth visit", d: "Drive booth visit attendance" }, { l: "Survey promotion", d: "Promote a feedback survey" }].map((opt) => (
                    <button key={opt.l} onClick={() => setObjective(opt.l)}
                      className={`p-3.5 border rounded-xl text-left transition-colors ${objective === opt.l ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                      <div className={`text-sm font-medium mb-0.5 ${objective === opt.l ? "text-[#1d4ed8]" : "text-slate-700"}`}>{opt.l}</div>
                      <div className="text-xs text-slate-400">{opt.d}</div>
                    </button>
                  ))}
                </div>
                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={2} placeholder="Or describe your objective in detail…"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none" />
              </FormField>
              <FormField label="Campaign Name"><input placeholder="e.g. Booth 10–15 Voter Outreach — Aug 2024" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400" /></FormField>
              <FormField label="Target Language">
                <div className="flex gap-2">
                  {["English", "Hindi", "Bengali", "Gujarati"].map((l) => (
                    <button key={l} className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-[#1d4ed8] transition-colors">{l}</button>
                  ))}
                </div>
              </FormField>
            </div>
          )}

          {step === "content" && (
            <div className="max-w-[600px] space-y-5">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-full flex items-center justify-center shrink-0">
                  <Icon d={I.sparkle} size={12} className="text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-1">AI Generated Content</div>
                  <p className="text-xs text-slate-500 leading-relaxed">Message generated based on your objective. Edit before proceeding.</p>
                </div>
              </div>
              <FormField label="Message Content" required>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-400 resize-none font-mono" />
                <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400">
                  <span>{content.length} chars{channel === "SMS" ? " · 1 SMS" : ""}</span>
                  <button className="text-[#1d4ed8] hover:underline font-medium flex items-center gap-1"><Icon d={I.sparkle} size={11} />Regenerate</button>
                </div>
              </FormField>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-700 mb-3">Preview — {channel}</div>
                {channel === "WhatsApp" ? (
                  <div className="bg-[#e2ffc7] rounded-2xl rounded-tl-none px-4 py-3 inline-block max-w-xs">
                    <p className="text-xs text-slate-800 leading-relaxed">{content.replace("{Name}", "Rahul Sharma").replace("{Booth}", "Booth 12")}</p>
                    <div className="text-[10px] text-slate-500 text-right mt-1">10:35 AM ✓✓</div>
                  </div>
                ) : channel === "SMS" ? (
                  <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 inline-block max-w-xs">
                    <p className="text-xs text-slate-800 leading-relaxed">{content.replace("{Name}", "Rahul").replace("{Booth}", "Booth 12")}</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1d4ed8] rounded-full flex items-center justify-center shrink-0"><Icon d={I.mic} size={18} className="text-white" /></div>
                    <div><div className="text-xs font-semibold text-slate-700">Voice message ready</div><div className="text-[10px] text-slate-400 mt-0.5">~45 seconds · AI voice synthesis</div></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="max-w-[600px] space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Icon d={I.alertCircle} size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-amber-800">Human Review Required</div>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">Review the message carefully. Once approved and sent it cannot be recalled.</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Review Checklist</div>
                {["Message content is accurate and appropriate", "Sender name and contact info is correct", "No sensitive or misleading information included", "Target audience is correctly defined", "Opt-out instructions are included"].map((item) => (
                  <label key={item} className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer select-none">
                    <input type="checkbox" className="accent-[#1d4ed8] mt-0.5 rounded" /><span>{item}</span>
                  </label>
                ))}
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs font-semibold text-slate-700 mb-2">Message to review</div>
                <div className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 leading-relaxed font-mono">{content}</div>
              </div>
            </div>
          )}

          {step === "approval" && (
            <div className="max-w-[600px] space-y-5">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Campaign Approval</div>
                {!approved ? (
                  <>
                    <p className="text-sm text-slate-600 mb-4">This campaign requires approval before proceeding. Review the summary and approve to continue.</p>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2 text-xs mb-5">
                      {[["Campaign", "Voter Outreach Aug 2024"], ["Channel", channel], ["Audience", "4,250 voters"], ["Est. Cost", `₹${totalCost}`], ["Credits Available", "12,500"]].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="text-slate-500">{k}</span><span className="font-semibold text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                        <Icon d={I.x} size={14} />Reject
                      </button>
                      <button onClick={() => setApproved(true)} className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <Icon d={I.check} size={14} />Approve Campaign
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4 py-2">
                    <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
                      <Icon d={I.checkCircle} size={22} className="text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-green-700">Campaign Approved</div>
                      <div className="text-xs text-slate-500 mt-0.5">Ready for audience selection and scheduling.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "audience" && (
            <div className="max-w-[600px] space-y-5">
              <FormField label="Audience Type">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[{ l: "All Voters", c: 38450 }, { l: "Unvisited Voters", c: 14210 }, { l: "By Booth", c: null }, { l: "Custom Segment", c: null }].map((opt) => (
                    <div key={opt.l} className="p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <div className="text-sm font-medium text-slate-700">{opt.l}</div>
                      {opt.c && <div className="text-xs text-slate-400 mt-0.5">{opt.c.toLocaleString()} voters</div>}
                    </div>
                  ))}
                </div>
              </FormField>
              <FormField label="Filter by Booth">
                <div className="flex flex-wrap gap-2">
                  {["Booth 10", "Booth 11", "Booth 12", "Booth 13", "Booth 14", "Booth 15"].map((b) => (
                    <button key={b} className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-full bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-[#1d4ed8] transition-colors">{b}</button>
                  ))}
                </div>
              </FormField>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs">
                <div className="font-semibold text-[#1d4ed8] mb-2">Audience Summary</div>
                <div className="flex items-center gap-4 text-slate-600">
                  <span><strong className="text-slate-900 text-base">4,250</strong> recipients</span>
                  <span className="text-slate-300">·</span>
                  <span>Est. cost: <strong className="text-[#1d4ed8]">₹{totalCost}</strong></span>
                  <span className="text-slate-300">·</span>
                  <span className="text-green-700 font-semibold">Within budget</span>
                </div>
              </div>
            </div>
          )}

          {step === "schedule" && (
            <div className="max-w-[600px] space-y-5">
              <FormField label="Send Time">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {["Send now", "Schedule for later", "Drip campaign"].map((opt) => (
                    <div key={opt} className="p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
                      <div className="text-sm font-medium text-slate-700">{opt}</div>
                    </div>
                  ))}
                </div>
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date"><input type="date" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white" /></FormField>
                <FormField label="Time"><input type="time" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white" /></FormField>
              </div>
              <FormField label="Timezone">
                <select className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white appearance-none">
                  <option>IST — India Standard Time (UTC+5:30)</option>
                </select>
              </FormField>
            </div>
          )}

          {step === "launch" && (
            <div className="max-w-[600px] space-y-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
                  <Icon d={I.checkCircle} size={22} className="text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-700">Campaign Launched Successfully</div>
                  <div className="text-xs text-slate-500 mt-0.5">Messages are being delivered to 4,250 recipients via {channel}.</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[{ l: "Sent", v: "2,840", c: "text-[#1d4ed8]" }, { l: "Delivered", v: "2,640", c: "text-green-600" }, { l: "Pending", v: "1,410", c: "text-amber-600" }].map((s) => (
                  <div key={s.l} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Delivery Progress</div>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={[{ t: "10:00", d: 420 }, { t: "10:30", d: 680 }, { t: "11:00", d: 840 }, { t: "11:30", d: 520 }, { t: "12:00", d: 380 }]} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                    <XAxis dataKey="t" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => `${v} messages`} />
                    <Bar dataKey="d" fill="#1d4ed8" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
          <button onClick={() => { const p = CAMPAIGN_STEPS_DEF[stepIdx - 1]; if (p) setStep(p.key); }} disabled={stepIdx === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Icon d={I.chevronLeft} size={14} />Back
          </button>
          <div className="text-xs text-slate-400">Step {stepIdx + 1} / {CAMPAIGN_STEPS_DEF.length}</div>
          <button onClick={() => { const n = CAMPAIGN_STEPS_DEF[stepIdx + 1]; if (n) setStep(n.key); }} disabled={stepIdx === CAMPAIGN_STEPS_DEF.length - 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Continue<Icon d={I.chevronRight} size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RAG Previous Election ────────────────────────────────────────────────────

function RAGElection() {
  const [selElection, setSelElection] = useState("2019");
  const [selConst, setSelConst] = useState("Constituency 5");
  const [selBooth, setSelBooth] = useState("Booth 125");
  const [ragMsgs, setRagMsgs] = useState<AIChatMsg[]>(RAG_CHAT_INIT);
  const [ragInput, setRagInput] = useState("");
  const ragEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { ragEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [ragMsgs]);

  function sendRag() {
    if (!ragInput.trim()) return;
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setRagMsgs((p) => [
      ...p,
      { id: `ru${Date.now()}`, role: "user", content: ragInput, time: t },
      { id: `ra${Date.now()}`, role: "ai", time: t, content: `Based on historical data for ${selBooth} in ${selConst}, the 2019 election showed BJP leading with 520 votes, followed by INC with 410 votes. Voter turnout was 78%. Compared to 2014, the BJP vote share increased by 8.3% while INC declined by 5.1%.` },
    ]);
    setRagInput("");
  }

  const BOOTH_DETAIL = [{ party: "BJP", votes: 520, pct: 43.7, color: "#f97316" }, { party: "INC", votes: 410, pct: 34.5, color: "#22c55e" }, { party: "AAP", votes: 185, pct: 15.5, color: "#0ea5e9" }, { party: "Others", votes: 75, pct: 6.3, color: "#94a3b8" }];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left filter panel */}
      <div className="w-48 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="px-3 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-md flex items-center justify-center">
              <Icon d={I.analysis} size={11} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Historical Data</span>
          </div>
        </div>
        <div className="py-2">
          {[
            { label: "Elections", items: ["2019", "2014", "2009", "2004"], sel: selElection, set: setSelElection },
            { label: "Constituencies", items: ["Constituency 3", "Constituency 4", "Constituency 5", "Constituency 6", "Constituency 7"], sel: selConst, set: setSelConst },
            { label: "Booths", items: ["Booth 120", "Booth 122", "Booth 124", "Booth 125", "Booth 126", "Booth 128"], sel: selBooth, set: setSelBooth },
          ].map((group) => (
            <div key={group.label} className="mb-1">
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{group.label}</div>
              {group.items.map((item) => (
                <button key={item} onClick={() => group.set(item)}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors border-l-2 ${group.sel === item ? "border-[#1d4ed8] bg-blue-50 text-[#1d4ed8] font-medium" : "border-transparent text-slate-600 hover:bg-slate-50"}`}>
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main: charts + chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-4 space-y-4">
          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3">
            {[{ l: "Winner", v: "BJP", s: "2019 General", c: "text-[#f97316]" }, { l: "Winning Margin", v: "110 votes", s: "over INC", c: "text-slate-900" }, { l: "Turnout", v: "78%", s: selBooth, c: "text-green-700" }, { l: "Total Votes", v: "1,190", s: "2019", c: "text-slate-900" }].map((k) => (
              <div key={k.l} className="bg-white border border-slate-200 rounded-xl p-3.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{k.l}</div>
                <div className={`text-xl font-bold tracking-tight ${k.c}`}>{k.v}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{k.s}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-700 mb-0.5">{selConst} — Historical Trend</div>
              <div className="text-[10px] text-slate-400 mb-4">Vote count by party, 2004–2019</div>
              <ResponsiveContainer width="100%" height={155}>
                <BarChart data={HIST_RESULTS} margin={{ left: 0, right: 0, top: 0, bottom: 0 }} barSize={12}>
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  {Object.entries(PARTY_COLORS).map(([p, c]) => <Bar key={p} dataKey={p} fill={c} radius={[2, 2, 0, 0]} />)}
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-3 mt-2 flex-wrap">
                {Object.entries(PARTY_COLORS).map(([p, c]) => (
                  <div key={p} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <div className="w-2 h-2 rounded-full" style={{ background: c }} />{p}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-700 mb-0.5">Booth Comparison — 2019</div>
              <div className="text-[10px] text-slate-400 mb-4">BJP vs INC across nearby booths</div>
              <ResponsiveContainer width="100%" height={155}>
                <BarChart data={BOOTH_COMPARE} layout="vertical" margin={{ left: 48, right: 8, top: 0, bottom: 0 }} barSize={9}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="booth" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip />
                  <Bar dataKey="BJP" fill={PARTY_COLORS.BJP} radius={[0, 2, 2, 0]} />
                  <Bar dataKey="INC" fill={PARTY_COLORS.INC} radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booth detail result */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">{selBooth} — Detailed Results ({selElection})</span>
              <span className="text-xs text-slate-400">Total: 1,190 votes · Turnout 78%</span>
            </div>
            <div className="p-5 space-y-3">
              {BOOTH_DETAIL.map((p) => (
                <div key={p.party}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} /><span className="font-semibold text-slate-800">{p.party}</span></div>
                    <div className="flex items-center gap-3"><span className="font-bold text-slate-900 text-sm">{p.votes.toLocaleString()}</span><span className="text-slate-400 w-12 text-right">{p.pct}%</span></div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full"><div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RAG Chat bottom panel */}
        <div className="h-[270px] bg-white border-t border-slate-200 flex flex-col shrink-0">
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 shrink-0">
            <div className="w-5 h-5 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-md flex items-center justify-center">
              <Icon d={I.sparkle} size={10} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Election AI — Historical Intelligence</span>
            <div className="flex items-center gap-1 ml-2 text-[10px] text-green-600 font-medium"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" />Online</div>
            <div className="ml-auto text-[10px] text-slate-400">Ask about any booth or constituency</div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {ragMsgs.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="w-5 h-5 bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Icon d={I.sparkle} size={9} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === "user" ? "bg-[#1d4ed8] text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}>
                  {msg.content.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
                    p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={ragEnd} />
          </div>
          <div className="px-3 py-2.5 border-t border-slate-100 flex items-center gap-2 shrink-0">
            <input value={ragInput} onChange={(e) => setRagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendRag(); }}
              placeholder={`Ask about ${selBooth} or ${selConst} historical results…`}
              className="flex-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
            <button onClick={sendRag} disabled={!ragInput.trim()}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1d4ed8] text-white hover:bg-blue-700 transition-colors disabled:opacity-40">
              <Icon d={I.campaigns} size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── OPERATIONS MODULE ────────────────────────────────────────────────────────

// ── Shared worker stub data ───────────────────────────────────────────────────

interface Worker {
  id: string;
  name: string;
  mobile: string;
  area: string;
  voterCount: number;
  phonebookCount: number;
}

const WORKERS_LIST: Worker[] = [
  { id: "w1", name: "Rajesh Kumar", mobile: "9812345678", area: "Ward 1 — Booth 10–14", voterCount: 1240, phonebookCount: 380 },
  { id: "w2", name: "Meena Sharma", mobile: "9823456789", area: "Ward 2 — Booth 15–19", voterCount: 980, phonebookCount: 275 },
  { id: "w3", name: "Suresh Patel", mobile: "9834567890", area: "Ward 3 — Booth 20–24", voterCount: 1105, phonebookCount: 310 },
  { id: "w4", name: "Anita Singh", mobile: "9845678901", area: "Ward 4 — Booth 25–29", voterCount: 870, phonebookCount: 220 },
  { id: "w5", name: "Vijay Gupta", mobile: "9856789012", area: "Ward 5 — Booth 30–34", voterCount: 1320, phonebookCount: 420 },
  { id: "w6", name: "Kavita Yadav", mobile: "9867890123", area: "Ward 6 — Booth 35–39", voterCount: 760, phonebookCount: 195 },
];

const PHONEBOOK_VOTERS = [
  { name: "Rahul Sharma", voterId: "ABC1234567", mobile: "9801234567", booth: "Booth 10", worker: "Rajesh Kumar" },
  { name: "Priya Shah", voterId: "DEF2345678", mobile: "9812345678", booth: "Booth 11", worker: "Rajesh Kumar" },
  { name: "Amit Patel", voterId: "GHI3456789", mobile: "9823456789", booth: "Booth 12", worker: "Rajesh Kumar" },
  { name: "Sunita Devi", voterId: "JKL4567890", mobile: "9834567890", booth: "Booth 13", worker: "Rajesh Kumar" },
  { name: "Vijay Kumar", voterId: "MNO5678901", mobile: "9845678901", booth: "Booth 14", worker: "Rajesh Kumar" },
  { name: "Kavita Joshi", voterId: "PQR6789012", mobile: "9856789012", booth: "Booth 10", worker: "Rajesh Kumar" },
  { name: "Mohan Das", voterId: "STU7890123", mobile: "9867890123", booth: "Booth 11", worker: "Rajesh Kumar" },
  { name: "Lakshmi Bai", voterId: "VWX8901234", mobile: "9878901234", booth: "Booth 12", worker: "Rajesh Kumar" },
];

const EXPORT_VOTERS = [
  { name: "Rahul Sharma", voterId: "ABC1234567", gender: "Male", age: 42, booth: "Booth 10", status: "Supporter" },
  { name: "Priya Shah", voterId: "DEF2345678", gender: "Female", age: 29, booth: "Booth 11", status: "Neutral" },
  { name: "Amit Patel", voterId: "GHI3456789", gender: "Male", age: 55, booth: "Booth 12", status: "Doubtful" },
  { name: "Sunita Devi", voterId: "JKL4567890", gender: "Female", age: 38, booth: "Booth 13", status: "Supporter" },
  { name: "Vijay Kumar", voterId: "MNO5678901", gender: "Male", age: 66, booth: "Booth 14", status: "Opponent" },
  { name: "Kavita Joshi", voterId: "PQR6789012", gender: "Female", age: 53, booth: "Booth 10", status: "Supporter" },
  { name: "Mohan Das", voterId: "STU7890123", gender: "Male", age: 71, booth: "Booth 11", status: "Neutral" },
  { name: "Lakshmi Bai", voterId: "VWX8901234", gender: "Female", age: 45, booth: "Booth 12", status: "Supporter" },
];

// ── Filters ───────────────────────────────────────────────────────────────────

type FilterCategory = "Cast Name" | "Occupation" | "Scheme" | "Qualification";

interface FilterItem {
  id: string;
  category: FilterCategory;
  value: string;
  createdDate: string;
  usageCount: number;
}

const FILTER_CATEGORIES: FilterCategory[] = ["Cast Name", "Occupation", "Scheme", "Qualification"];

const FILTERS_INIT: FilterItem[] = [
  { id: "f1", category: "Cast Name", value: "General", createdDate: "01 Aug 2024", usageCount: 3840 },
  { id: "f2", category: "Cast Name", value: "OBC", createdDate: "01 Aug 2024", usageCount: 5210 },
  { id: "f3", category: "Cast Name", value: "SC", createdDate: "01 Aug 2024", usageCount: 2980 },
  { id: "f4", category: "Cast Name", value: "ST", createdDate: "01 Aug 2024", usageCount: 1240 },
  { id: "f5", category: "Occupation", value: "Farmer", createdDate: "02 Aug 2024", usageCount: 4120 },
  { id: "f6", category: "Occupation", value: "Government Employee", createdDate: "02 Aug 2024", usageCount: 1850 },
  { id: "f7", category: "Occupation", value: "Business", createdDate: "02 Aug 2024", usageCount: 2340 },
  { id: "f8", category: "Occupation", value: "Student", createdDate: "02 Aug 2024", usageCount: 3100 },
  { id: "f9", category: "Occupation", value: "Homemaker", createdDate: "02 Aug 2024", usageCount: 2760 },
  { id: "f10", category: "Scheme", value: "PM Awas Yojana", createdDate: "03 Aug 2024", usageCount: 1540 },
  { id: "f11", category: "Scheme", value: "Ujjwala Yojana", createdDate: "03 Aug 2024", usageCount: 2090 },
  { id: "f12", category: "Scheme", value: "Kisan Samman Nidhi", createdDate: "03 Aug 2024", usageCount: 3210 },
  { id: "f13", category: "Qualification", value: "Illiterate", createdDate: "04 Aug 2024", usageCount: 2100 },
  { id: "f14", category: "Qualification", value: "Primary", createdDate: "04 Aug 2024", usageCount: 4300 },
  { id: "f15", category: "Qualification", value: "Secondary", createdDate: "04 Aug 2024", usageCount: 3800 },
  { id: "f16", category: "Qualification", value: "Graduate", createdDate: "04 Aug 2024", usageCount: 2650 },
  { id: "f17", category: "Qualification", value: "Post Graduate", createdDate: "04 Aug 2024", usageCount: 1100 },
];

function FiltersScreen() {
  const [filters, setFilters] = useState<FilterItem[]>(FILTERS_INIT);
  const [activeCategory, setActiveCategory] = useState<FilterCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState<FilterCategory>("Cast Name");
  const [newValue, setNewValue] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const displayed = filters.filter((f) => {
    if (activeCategory !== "All" && f.category !== activeCategory) return false;
    if (search && !f.value.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleAdd() {
    if (!newValue.trim()) return;
    setFilters((p) => [...p, { id: `f${Date.now()}`, category: newCategory, value: newValue.trim(), createdDate: "Today", usageCount: 0 }]);
    setNewValue(""); setShowAdd(false);
  }

  function handleEdit(id: string) {
    setFilters((p) => p.map((f) => f.id === id ? { ...f, value: editValue } : f));
    setEditId(null);
  }

  function handleDelete(id: string) {
    setFilters((p) => p.filter((f) => f.id !== id));
    setDeleteId(null);
  }

  const categoryCounts = FILTER_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filters.filter((f) => f.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Operations</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Filters</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Master Filters</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage filter values used across voter profiles and search.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
            <Icon d={I.plus} size={14} />Add Filter
          </button>
        </div>

        {/* Category tabs + counts */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["All", ...FILTER_CATEGORIES] as const).map((cat) => {
            const count = cat === "All" ? filters.length : categoryCounts[cat] ?? 0;
            const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat as FilterCategory | "All")}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded border transition-colors ${active ? "bg-[#1d4ed8] text-white border-[#1d4ed8]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                {cat}
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{count}</span>
              </button>
            );
          })}
          <div className="ml-auto relative">
            <Icon d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search values…"
              className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors w-52" />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">{displayed.length} value{displayed.length !== 1 ? "s" : ""}</div>

        {/* Table per category or flat */}
        {activeCategory === "All" ? (
          FILTER_CATEGORIES.map((cat) => {
            const items = displayed.filter((f) => f.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat} className="bg-white border border-slate-200 rounded-md overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{cat}</span>
                  <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{items.length}</span>
                </div>
                <FilterTable items={items} editId={editId} editValue={editValue} onEdit={(id, v) => { setEditId(id); setEditValue(v); }} onEditSave={handleEdit} onEditCancel={() => setEditId(null)} onEditChange={setEditValue} onDelete={setDeleteId} />
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <FilterTable items={displayed} editId={editId} editValue={editValue} onEdit={(id, v) => { setEditId(id); setEditValue(v); }} onEditSave={handleEdit} onEditCancel={() => setEditId(null)} onEditChange={setEditValue} onDelete={setDeleteId} />
          </div>
        )}
      </div>

      {/* Add filter modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl w-[400px] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm font-semibold text-slate-900">Add Filter Value</div>
              <button onClick={() => setShowAdd(false)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.x} size={14} /></button>
            </div>
            <div className="space-y-4">
              <FormField label="Filter Type" required>
                <div className="relative">
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as FilterCategory)}
                    className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-400 cursor-pointer pr-8">
                    {FILTER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <Icon d={I.chevronDown} size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </FormField>
              <FormField label="Value" required>
                <input value={newValue} onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                  placeholder="e.g. Brahmin, Carpenter, MNREGA…"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400" />
              </FormField>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={!newValue.trim()} className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                <Icon d={I.plus} size={14} />Add Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl w-[360px] p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-full flex items-center justify-center shrink-0">
                <Icon d={I.trash} size={16} className="text-red-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Delete Filter Value</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">This will remove the value from the master list. Existing voter records will retain their data.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterTable({ items, editId, editValue, onEdit, onEditSave, onEditCancel, onEditChange, onDelete }: {
  items: FilterItem[];
  editId: string | null;
  editValue: string;
  onEdit: (id: string, v: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onEditChange: (v: string) => void;
  onDelete: (id: string) => void;
}) {
  if (!items.length) return <div className="py-10 text-center text-sm text-slate-400">No values found.</div>;
  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          {["Value", "Category", "Usage", "Created", "Actions"].map((h, i) => (
            <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 3 ? "text-right" : "text-left"}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {items.map((f) => (
          <tr key={f.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3">
              {editId === f.id ? (
                <input value={editValue} onChange={(e) => onEditChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") onEditSave(f.id); if (e.key === "Escape") onEditCancel(); }}
                  autoFocus
                  className="px-2 py-1 text-sm border border-blue-400 rounded bg-white focus:outline-none w-full max-w-[200px]" />
              ) : (
                <span className="font-medium text-slate-800">{f.value}</span>
              )}
            </td>
            <td className="px-4 py-3"><Badge variant="muted">{f.category}</Badge></td>
            <td className="px-4 py-3 text-xs text-slate-500">{f.usageCount.toLocaleString()} voters</td>
            <td className="px-4 py-3 text-xs text-slate-400 text-right">{f.createdDate}</td>
            <td className="px-4 py-3 text-right">
              <div className="inline-flex items-center gap-1">
                {editId === f.id ? (
                  <>
                    <button onClick={() => onEditSave(f.id)} className="px-2.5 py-1 text-xs font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">Save</button>
                    <button onClick={onEditCancel} className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => onEdit(f.id, f.value)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><Icon d={I.edit} size={13} /></button>
                    <button onClick={() => onDelete(f.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Icon d={I.trash} size={13} /></button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Update Requests ───────────────────────────────────────────────────────────

type ReqStatus = "Pending" | "Approved" | "Rejected";
type ReqType = "Name Change" | "Address Update" | "Photo Update" | "Mobile Update" | "Caste Update" | "DOB Correction";

interface UpdateRequest {
  id: string;
  reqId: string;
  worker: string;
  voter: string;
  voterId: string;
  reqType: ReqType;
  submitted: string;
  status: ReqStatus;
  details: string;
  before: string;
  after: string;
}

const REQ_STATUS_V: Record<ReqStatus, BadgeVariant> = { Pending: "warning", Approved: "success", Rejected: "danger" };

const UPDATE_REQUESTS: UpdateRequest[] = [
  { id: "r1", reqId: "REQ-001", worker: "Rajesh Kumar", voter: "Rahul Sharma", voterId: "ABC1234567", reqType: "Name Change", submitted: "10 Aug 2024", status: "Pending", details: "Voter requests name correction", before: "Rahul Sharme", after: "Rahul Sharma" },
  { id: "r2", reqId: "REQ-002", worker: "Meena Sharma", voter: "Priya Shah", voterId: "DEF2345678", reqType: "Mobile Update", submitted: "10 Aug 2024", status: "Pending", details: "New mobile number", before: "9800000000", after: "9812345678" },
  { id: "r3", reqId: "REQ-003", worker: "Suresh Patel", voter: "Amit Patel", voterId: "GHI3456789", reqType: "Address Update", submitted: "09 Aug 2024", status: "Approved", details: "Relocated to new ward", before: "12, Old Colony", after: "45, New Town" },
  { id: "r4", reqId: "REQ-004", worker: "Anita Singh", voter: "Sunita Devi", voterId: "JKL4567890", reqType: "Photo Update", submitted: "09 Aug 2024", status: "Approved", details: "Recent photo submission", before: "2018 photo", after: "2024 photo" },
  { id: "r5", reqId: "REQ-005", worker: "Vijay Gupta", voter: "Vijay Kumar", voterId: "MNO5678901", reqType: "Caste Update", submitted: "08 Aug 2024", status: "Rejected", details: "Document verification failed", before: "General", after: "OBC" },
  { id: "r6", reqId: "REQ-006", worker: "Kavita Yadav", voter: "Kavita Joshi", voterId: "PQR6789012", reqType: "DOB Correction", submitted: "08 Aug 2024", status: "Pending", details: "Wrong date in voter roll", before: "01/01/1985", after: "15/03/1985" },
  { id: "r7", reqId: "REQ-007", worker: "Rajesh Kumar", voter: "Mohan Das", voterId: "STU7890123", reqType: "Mobile Update", submitted: "07 Aug 2024", status: "Approved", details: "Number changed", before: "9800011111", after: "9867890123" },
  { id: "r8", reqId: "REQ-008", worker: "Meena Sharma", voter: "Lakshmi Bai", voterId: "VWX8901234", reqType: "Name Change", submitted: "07 Aug 2024", status: "Rejected", details: "Insufficient documentation", before: "Lakshimi Bai", after: "Lakshmi Bai" },
];

function UpdateRequestsScreen() {
  const [statusFilter, setStatusFilter] = useState<ReqStatus | "">("");
  const [workerFilter, setWorkerFilter] = useState("");
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<UpdateRequest[]>(UPDATE_REQUESTS);
  const [viewReq, setViewReq] = useState<UpdateRequest | null>(null);

  const filtered = requests.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (workerFilter && r.worker !== workerFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.voter.toLowerCase().includes(q) && !r.reqId.toLowerCase().includes(q) && !r.worker.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  function approve(id: string) { setRequests((p) => p.map((r) => r.id === id ? { ...r, status: "Approved" } : r)); if (viewReq?.id === id) setViewReq((v) => v ? { ...v, status: "Approved" } : v); }
  function reject(id: string) { setRequests((p) => p.map((r) => r.id === id ? { ...r, status: "Rejected" } : r)); if (viewReq?.id === id) setViewReq((v) => v ? { ...v, status: "Rejected" } : v); }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Operations</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Update Requests</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Update Requests</h1>
            <p className="text-sm text-slate-500 mt-0.5">Review and approve voter data correction requests from field workers.</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "All Requests", value: counts.all, variant: "muted" as BadgeVariant, color: "text-slate-900", icon: I.fileText, filter: "" as ReqStatus | "" },
            { label: "Pending", value: counts.pending, variant: "warning" as BadgeVariant, color: "text-amber-600", icon: I.clock, filter: "Pending" as ReqStatus },
            { label: "Approved", value: counts.approved, variant: "success" as BadgeVariant, color: "text-green-600", icon: I.checkCircle, filter: "Approved" as ReqStatus },
            { label: "Rejected", value: counts.rejected, variant: "danger" as BadgeVariant, color: "text-red-600", icon: I.xCircle, filter: "Rejected" as ReqStatus },
          ].map((s) => (
            <button key={s.label} onClick={() => setStatusFilter(s.filter)}
              className={`bg-white border rounded-md p-4 flex items-start justify-between text-left hover:border-blue-300 transition-colors ${statusFilter === s.filter ? "border-blue-300 bg-blue-50/30" : "border-slate-200"}`}>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{s.label}</div>
                <div className={`text-2xl font-semibold tracking-tight ${s.color}`}>{s.value}</div>
              </div>
              <div className={`w-8 h-8 rounded flex items-center justify-center bg-slate-50 border border-slate-100`}><Icon d={s.icon} size={14} className="text-slate-400" /></div>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID, voter, or worker…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="relative">
            <select value={workerFilter} onChange={(e) => setWorkerFilter(e.target.value)}
              className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors ${workerFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              <option value="">All Workers</option>
              {WORKERS_LIST.map((w) => <option key={w.id}>{w.name}</option>)}
            </select>
            <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ReqStatus | "")}
              className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors ${statusFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              <option value="">All Status</option>
              <option>Pending</option><option>Approved</option><option>Rejected</option>
            </select>
            <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {(search || workerFilter || statusFilter) && (
            <button onClick={() => { setSearch(""); setWorkerFilter(""); setStatusFilter(""); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear</button>
          )}
          <div className="ml-auto text-xs text-slate-500 font-medium">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Request ID", "Worker", "Voter", "Request Type", "Submitted", "Status", "Actions"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 6 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-slate-400">No requests match your filters.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{r.reqId}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-slate-800">{r.worker}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-slate-800">{r.voter}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{r.voterId}</div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="muted">{r.reqType}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.submitted}</td>
                  <td className="px-4 py-3"><Badge variant={REQ_STATUS_V[r.status]}>{r.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => setViewReq(r)} className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                      {r.status === "Pending" && (
                        <>
                          <button onClick={() => approve(r.id)} className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors">Approve</button>
                          <button onClick={() => reject(r.id)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors">Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Request Drawer */}
      {viewReq && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-slate-900/30" onClick={() => setViewReq(null)} />
          <div className="w-[420px] bg-white border-l border-slate-200 flex flex-col shadow-xl">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <div className="text-sm font-semibold text-slate-900">{viewReq.reqId}</div>
                <div className="text-xs text-slate-400 mt-0.5">{viewReq.reqType}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={REQ_STATUS_V[viewReq.status]}>{viewReq.status}</Badge>
                <button onClick={() => setViewReq(null)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.x} size={14} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-3 text-xs">
                {[["Worker", viewReq.worker], ["Voter", viewReq.voter], ["Voter ID", viewReq.voterId], ["Submitted", viewReq.submitted], ["Request Type", viewReq.reqType]].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 font-medium">{k}</span>
                    <span className="font-semibold text-slate-800 text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Change Summary</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="text-[10px] font-semibold text-red-500 uppercase tracking-wide mb-1">Before</div>
                    <div className="text-sm font-medium text-red-800">{viewReq.before}</div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="text-[10px] font-semibold text-green-600 uppercase tracking-wide mb-1">After</div>
                    <div className="text-sm font-medium text-green-800">{viewReq.after}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Worker Notes</div>
                <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2.5 leading-relaxed">{viewReq.details}</div>
              </div>
            </div>
            {viewReq.status === "Pending" && (
              <div className="px-5 py-4 border-t border-slate-200 flex gap-3 shrink-0">
                <button onClick={() => reject(viewReq.id)} className="flex-1 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <Icon d={I.x} size={14} />Reject
                </button>
                <button onClick={() => approve(viewReq.id)} className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Icon d={I.check} size={14} />Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── User Activities ───────────────────────────────────────────────────────────

interface ActivityLog {
  id: string;
  srNo: number;
  userName: string;
  contact: string;
  action: string;
  details: string;
  timestamp: string;
  module: string;
  ip: string;
}

const ACTIVITIES: ActivityLog[] = [
  { id: "a1", srNo: 1, userName: "Rajesh Kumar", contact: "9812345678", action: "Voter Updated", details: "Updated mobile number for voter Rahul Sharma (ABC1234567)", timestamp: "10 Aug 2024, 10:32 AM", module: "Voters", ip: "192.168.1.10" },
  { id: "a2", srNo: 2, userName: "Meena Sharma", contact: "9823456789", action: "Request Submitted", details: "Submitted name correction request for Priya Shah (DEF2345678)", timestamp: "10 Aug 2024, 10:15 AM", module: "Requests", ip: "192.168.1.12" },
  { id: "a3", srNo: 3, userName: "Admin", contact: "9800000000", action: "Request Approved", details: "Approved address update for Amit Patel (GHI3456789)", timestamp: "09 Aug 2024, 5:42 PM", module: "Requests", ip: "192.168.1.1" },
  { id: "a4", srNo: 4, userName: "Suresh Patel", contact: "9834567890", action: "Voter Visited", details: "Marked Sunita Devi (JKL4567890) as visited in Booth 12", timestamp: "09 Aug 2024, 3:20 PM", module: "Voters", ip: "192.168.1.14" },
  { id: "a5", srNo: 5, userName: "Anita Singh", contact: "9845678901", action: "Export Generated", details: "Exported voter list for Booths 10–14 (1,240 records)", timestamp: "09 Aug 2024, 2:05 PM", module: "Export", ip: "192.168.1.16" },
  { id: "a6", srNo: 6, userName: "Admin", contact: "9800000000", action: "Filter Added", details: "Added new Cast Name filter value: 'Yadav'", timestamp: "08 Aug 2024, 11:50 AM", module: "Filters", ip: "192.168.1.1" },
  { id: "a7", srNo: 7, userName: "Vijay Gupta", contact: "9856789012", action: "Campaign Launched", details: "Launched WhatsApp campaign to 4,250 voters in Ward 5", timestamp: "08 Aug 2024, 10:30 AM", module: "Campaigns", ip: "192.168.1.18" },
  { id: "a8", srNo: 8, userName: "Kavita Yadav", contact: "9867890123", action: "Login", details: "User logged in from new device", timestamp: "08 Aug 2024, 9:00 AM", module: "Auth", ip: "192.168.2.5" },
  { id: "a9", srNo: 9, userName: "Rajesh Kumar", contact: "9812345678", action: "Voter Favorited", details: "Added Mohan Das (STU7890123) to favorites", timestamp: "07 Aug 2024, 4:15 PM", module: "Voters", ip: "192.168.1.10" },
  { id: "a10", srNo: 10, userName: "Admin", contact: "9800000000", action: "Request Rejected", details: "Rejected caste update request for Vijay Kumar — insufficient docs", timestamp: "07 Aug 2024, 3:00 PM", module: "Requests", ip: "192.168.1.1" },
];

const ACTION_BADGE: Record<string, BadgeVariant> = {
  "Voter Updated": "info", "Request Submitted": "warning", "Request Approved": "success",
  "Voter Visited": "success", "Export Generated": "muted", "Filter Added": "default",
  "Campaign Launched": "info", "Login": "muted", "Voter Favorited": "default", "Request Rejected": "danger",
};

function UserActivities() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [viewLog, setViewLog] = useState<ActivityLog | null>(null);

  const filtered = ACTIVITIES.filter((a) => {
    if (moduleFilter && a.module !== moduleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.userName.toLowerCase().includes(q) && !a.action.toLowerCase().includes(q) && !a.details.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const modules = [...new Set(ACTIVITIES.map((a) => a.module))];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Operations</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">User Activities</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">User Activities</h1>
            <p className="text-sm text-slate-500 mt-0.5">Audit trail of all actions performed by users in the system.</p>
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <Icon d={I.download} size={14} />Export Log
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Icon d={I.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user, action or details…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
          </div>
          <div className="relative">
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}
              className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors ${moduleFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              <option value="">All Modules</option>
              {modules.map((m) => <option key={m}>{m}</option>)}
            </select>
            <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {(search || moduleFilter) && <button onClick={() => { setSearch(""); setModuleFilter(""); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear</button>}
          <div className="ml-auto text-xs text-slate-500 font-medium">{filtered.length} activities</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Sr No", "User Name", "Contact", "Action", "Details", "Timestamp", ""].map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 6 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-slate-400">No activities match your search.</td></tr>
              ) : filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{a.srNo}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-slate-800">{a.userName}</div>
                    <Badge variant="muted">{a.module}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{a.contact}</td>
                  <td className="px-4 py-3"><Badge variant={ACTION_BADGE[a.action] ?? "default"}>{a.action}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[260px] truncate">{a.details}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{a.timestamp}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setViewLog(a)} className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} of {ACTIVITIES.length} activities</span>
            <div className="flex gap-1">
              <button className="px-2.5 py-1.5 border border-slate-200 rounded flex items-center gap-1 opacity-40 cursor-not-allowed"><Icon d={I.chevronLeft} size={12} />Prev</button>
              <button className="px-2.5 py-1.5 border border-slate-200 rounded flex items-center gap-1 hover:bg-slate-50">Next<Icon d={I.chevronRight} size={12} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity detail drawer */}
      {viewLog && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-slate-900/30" onClick={() => setViewLog(null)} />
          <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-xl">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <div className="text-sm font-semibold text-slate-900">Activity Details</div>
                <div className="text-xs text-slate-400 mt-0.5">{viewLog.timestamp}</div>
              </div>
              <button onClick={() => setViewLog(null)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.x} size={14} /></button>
            </div>
            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600">
                  {viewLog.userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{viewLog.userName}</div>
                  <div className="text-xs text-slate-400 font-mono">{viewLog.contact}</div>
                </div>
                <div className="ml-auto"><Badge variant={ACTION_BADGE[viewLog.action] ?? "default"}>{viewLog.action}</Badge></div>
              </div>
              <div className="space-y-3 text-xs">
                {[["Module", viewLog.module], ["Action", viewLog.action], ["IP Address", viewLog.ip], ["Timestamp", viewLog.timestamp]].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 font-medium">{k}</span>
                    <span className="font-semibold text-slate-800 text-right font-mono">{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Details</div>
                <div className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5 leading-relaxed">{viewLog.details}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Export Voter Data ─────────────────────────────────────────────────────────

function ExportVoterData() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const filteredVoters = EXPORT_VOTERS.filter((v) =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.voterId.toLowerCase().includes(search.toLowerCase())
  );

  function doExport() {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 3000); }, 1200);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Operations</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Export Voter Data</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Export Voter Data</h1>
            <p className="text-sm text-slate-500 mt-0.5">Select a worker and export their assigned voter list to Excel.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${selectedWorker ? "bg-[#1d4ed8] border-[#1d4ed8] text-white" : "border-slate-300 text-slate-400"}`}>1</div>
            <span className={selectedWorker ? "text-slate-700 font-medium" : "text-slate-400"}>Select Worker</span>
            <div className="w-6 h-px bg-slate-300" />
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${selectedWorker ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-slate-300 text-slate-400"}`}>2</div>
            <span className={selectedWorker ? "text-slate-700 font-medium" : "text-slate-400"}>View & Export</span>
          </div>
        </div>

        {/* Step 1: Worker selection */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Step 1 — Select Worker</span>
          </div>
          <div className="divide-y divide-slate-100">
            {WORKERS_LIST.map((w) => (
              <button key={w.id} onClick={() => { setSelectedWorker(w); setSearch(""); setExported(false); }}
                className={`w-full text-left px-4 py-3.5 flex items-center gap-4 transition-colors ${selectedWorker?.id === w.id ? "bg-blue-50 border-l-2 border-[#1d4ed8]" : "hover:bg-slate-50 border-l-2 border-transparent"}`}>
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                  {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${selectedWorker?.id === w.id ? "text-[#1d4ed8]" : "text-slate-800"}`}>{w.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{w.area}</div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                  <div className="flex items-center gap-1"><Icon d={I.phone} size={11} className="text-slate-400" />{w.mobile}</div>
                  <div className="flex items-center gap-1"><Icon d={I.voters} size={11} className="text-slate-400" /><strong className="text-slate-700">{w.voterCount.toLocaleString()}</strong> voters</div>
                </div>
                {selectedWorker?.id === w.id && <div className="w-4 h-4 bg-[#1d4ed8] rounded-full flex items-center justify-center shrink-0"><Icon d={I.check} size={10} className="text-white" /></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Voter list + export */}
        {selectedWorker && (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Step 2 — </span>
                <span className="text-xs font-semibold text-[#1d4ed8]">{selectedWorker.name}</span>
                <span className="text-xs text-slate-500 ml-2">· {selectedWorker.voterCount.toLocaleString()} voters · {selectedWorker.area}</span>
              </div>
              <button onClick={doExport} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors ${exported ? "bg-green-600 text-white" : "bg-[#1d4ed8] text-white hover:bg-blue-700"}`}>
                {exporting ? (
                  <><Icon d={I.refreshCw} size={14} className="animate-spin" />Exporting…</>
                ) : exported ? (
                  <><Icon d={I.check} size={14} />Downloaded!</>
                ) : (
                  <><Icon d={I.download} size={14} />Export Excel</>
                )}
              </button>
            </div>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Icon d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search voter name or ID…"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
              </div>
              <span className="text-xs text-slate-500 ml-auto font-medium">{filteredVoters.length} of {selectedWorker.voterCount.toLocaleString()} shown</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{["Name", "Voter ID", "Gender", "Age", "Booth", "Status"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVoters.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{v.name}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-400">{v.voterId}</td>
                    <td className="px-4 py-2.5 text-slate-600">{v.gender}</td>
                    <td className="px-4 py-2.5 text-slate-600">{v.age}</td>
                    <td className="px-4 py-2.5 text-slate-600">{v.booth}</td>
                    <td className="px-4 py-2.5"><Badge variant={v.status === "Supporter" ? "success" : v.status === "Opponent" ? "danger" : v.status === "Doubtful" ? "warning" : "muted"}>{v.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400">
              Preview only — export includes all {selectedWorker.voterCount.toLocaleString()} voters assigned to {selectedWorker.name}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Phone Book ────────────────────────────────────────────────────────────────

function PhoneBook() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const filteredVoters = PHONEBOOK_VOTERS.filter((v) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return v.name.toLowerCase().includes(q) || v.voterId.toLowerCase().includes(q) || v.mobile.includes(q);
  });

  function doExport() {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 3000); }, 1100);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Operations</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Phone Book</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Phone Book</h1>
            <p className="text-sm text-slate-500 mt-0.5">View and export phone-book voters assigned to each field worker.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Worker selection panel */}
          <div className="col-span-1 bg-white border border-slate-200 rounded-md overflow-hidden h-fit">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Select Worker</span>
            </div>
            <div className="divide-y divide-slate-100">
              {WORKERS_LIST.map((w) => (
                <button key={w.id} onClick={() => { setSelectedWorker(w); setSearch(""); setExported(false); }}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${selectedWorker?.id === w.id ? "bg-blue-50 border-l-2 border-[#1d4ed8]" : "hover:bg-slate-50 border-l-2 border-transparent"}`}>
                  <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-semibold text-slate-600 shrink-0 mt-0.5">
                    {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold truncate ${selectedWorker?.id === w.id ? "text-[#1d4ed8]" : "text-slate-800"}`}>{w.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{w.mobile}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="bg-blue-50 text-[#1d4ed8] border border-blue-200 px-1.5 py-0.5 rounded font-semibold">{w.phonebookCount} phonebook</span>
                      <span className="text-slate-400">{w.voterCount.toLocaleString()} total</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voter panel */}
          <div className="col-span-2">
            {!selectedWorker ? (
              <div className="bg-white border border-slate-200 rounded-md py-20 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Icon d={I.phoneBook} size={22} className="text-slate-300" /></div>
                <p className="text-sm font-semibold text-slate-600">Select a worker</p>
                <p className="text-xs text-slate-400 mt-1">Choose a worker from the left panel to view their phone book.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600">
                      {selectedWorker.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{selectedWorker.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{selectedWorker.mobile} · {selectedWorker.area}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#1d4ed8]">{selectedWorker.phonebookCount}</div>
                      <div className="text-[10px] text-slate-400">phone book</div>
                    </div>
                    <button onClick={doExport} className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded transition-colors ${exported ? "bg-green-600 text-white" : "bg-[#1d4ed8] text-white hover:bg-blue-700"}`}>
                      {exporting ? <><Icon d={I.refreshCw} size={13} className="animate-spin" />Exporting…</>
                        : exported ? <><Icon d={I.check} size={13} />Downloaded!</>
                        : <><Icon d={I.download} size={13} />Export Excel</>}
                    </button>
                  </div>
                </div>

                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-3">
                  <div className="relative flex-1">
                    <Icon d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, voter ID or mobile…"
                      className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium shrink-0">{filteredVoters.length} results</span>
                </div>

                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>{["Name", "Voter ID", "Mobile", "Booth", "Actions"].map((h, i) => (
                      <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 4 ? "text-right" : "text-left"}`}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVoters.length === 0 ? (
                      <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">No results found for "{search}".</td></tr>
                    ) : filteredVoters.map((v, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-slate-800">{v.name}</td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-slate-400">{v.voterId}</td>
                        <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">{v.mobile}</td>
                        <td className="px-4 py-2.5 text-slate-600">{v.booth}</td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><Icon d={I.phone} size={13} /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><Icon d={I.eye} size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400">
                  Showing {filteredVoters.length} of {selectedWorker.phonebookCount} phone-book voters for {selectedWorker.name}.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ORGANIZATION MODULE ──────────────────────────────────────────────────────

type OrgStatus = "Active" | "Suspended" | "Pending";
type OrgRole = "Owner" | "Admin" | "Editor" | "Viewer";
type OrgParty = "BJP" | "INC" | "AAP" | "SP" | "BSP" | "TMC" | "Independent";

interface Organization {
  id: string;
  name: string;
  status: OrgStatus;
  party: OrgParty;
  role: OrgRole;
  createdDate: string;
  street: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  memberCount: number;
}

const ORG_STATUS_V: Record<OrgStatus, BadgeVariant> = { Active: "success", Suspended: "danger", Pending: "warning" };
const ORG_ROLE_V: Record<OrgRole, BadgeVariant> = { Owner: "info", Admin: "default", Editor: "muted", Viewer: "muted" };
const ORG_PARTY_COLORS: Record<OrgParty, string> = {
  BJP: "bg-orange-100 text-orange-700 border-orange-200",
  INC: "bg-green-100 text-green-700 border-green-200",
  AAP: "bg-sky-100 text-sky-700 border-sky-200",
  SP: "bg-red-100 text-red-700 border-red-200",
  BSP: "bg-blue-100 text-blue-700 border-blue-200",
  TMC: "bg-teal-100 text-teal-700 border-teal-200",
  Independent: "bg-slate-100 text-slate-600 border-slate-200",
};

const ORGS_INIT: Organization[] = [
  { id: "o1", name: "Lucknow Central Unit", status: "Active", party: "BJP", role: "Owner", createdDate: "12 Jan 2024", street: "45, Hazratganj Road", city: "Lucknow", district: "Lucknow", state: "Uttar Pradesh", country: "India", pincode: "226001", memberCount: 24 },
  { id: "o2", name: "Varanasi South Cell", status: "Active", party: "BJP", role: "Admin", createdDate: "03 Mar 2024", street: "12, Lanka Crossing", city: "Varanasi", district: "Varanasi", state: "Uttar Pradesh", country: "India", pincode: "221005", memberCount: 18 },
  { id: "o3", name: "Delhi NCR Operations", status: "Suspended", party: "AAP", role: "Editor", createdDate: "20 Apr 2024", street: "8, Connaught Place", city: "New Delhi", district: "Central Delhi", state: "Delhi", country: "India", pincode: "110001", memberCount: 11 },
];

const ORG_LIMIT = 5;

type OrgMemberStatus = "Active" | "Pending" | "Deactivated";

interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: OrgRole;
  joinedDate: string;
  status: OrgMemberStatus;
  invitedBy: string;
  avatar?: string;
}

const ORG_MEMBER_STATUS_V: Record<OrgMemberStatus, BadgeVariant> = { Active: "success", Pending: "warning", Deactivated: "danger" };

const ORG_MEMBERS_INIT: OrgMember[] = [
  { id: "m1", name: "Arun Mehta", email: "arun.mehta@bjplko.in", role: "Owner", joinedDate: "12 Jan 2024", status: "Active", invitedBy: "System" },
  { id: "m2", name: "Priya Sharma", email: "priya.s@bjplko.in", role: "Admin", joinedDate: "15 Jan 2024", status: "Active", invitedBy: "Arun Mehta" },
  { id: "m3", name: "Rohit Verma", email: "rohit.v@bjplko.in", role: "Editor", joinedDate: "02 Feb 2024", status: "Active", invitedBy: "Arun Mehta" },
  { id: "m4", name: "Sunita Yadav", email: "sunita.y@bjplko.in", role: "Viewer", joinedDate: "10 Mar 2024", status: "Active", invitedBy: "Priya Sharma" },
  { id: "m5", name: "Karan Singh", email: "karan.s@bjplko.in", role: "Editor", joinedDate: "22 Apr 2024", status: "Deactivated", invitedBy: "Priya Sharma" },
];

const PENDING_INVITES = [
  { email: "neha.gupta@bjplko.in", role: "Viewer" as OrgRole, invitedBy: "Arun Mehta", sentDate: "28 Aug 2024" },
  { email: "vikram.joshi@bjplko.in", role: "Editor" as OrgRole, invitedBy: "Priya Sharma", sentDate: "30 Aug 2024" },
];

// Permissions matrix
const PERMISSION_KEYS = [
  { key: "viewOrg", label: "View Organization", desc: "Read-only access to organization details" },
  { key: "inviteMembers", label: "Invite Members", desc: "Send invitations to new members" },
  { key: "editOrg", label: "Edit Organization", desc: "Update organization info and settings" },
  { key: "manageRoles", label: "Manage Roles", desc: "Change member roles and permissions" },
  { key: "deleteOrg", label: "Delete Organization", desc: "Permanently delete the organization" },
  { key: "editData", label: "Edit Data", desc: "Edit voter and electoral data" },
  { key: "exportData", label: "Export Data", desc: "Download and export data files" },
];

type PermissionMatrix = Record<OrgRole, Record<string, boolean>>;

const PERM_INIT: PermissionMatrix = {
  Owner:  { viewOrg: true,  inviteMembers: true,  editOrg: true,  manageRoles: true,  deleteOrg: true,  editData: true,  exportData: true  },
  Admin:  { viewOrg: true,  inviteMembers: true,  editOrg: true,  manageRoles: true,  deleteOrg: false, editData: true,  exportData: true  },
  Editor: { viewOrg: true,  inviteMembers: false, editOrg: false, manageRoles: false, deleteOrg: false, editData: true,  exportData: false },
  Viewer: { viewOrg: true,  inviteMembers: false, editOrg: false, manageRoles: false, deleteOrg: false, editData: false, exportData: false },
};

const ROLES_ORDERED: OrgRole[] = ["Owner", "Admin", "Editor", "Viewer"];

// ── Organization List ─────────────────────────────────────────────────────────

function OrgInitials({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = name.charCodeAt(0) * 137 % 360;
  return (
    <div style={{ width: size, height: size, background: `hsl(${hue},55%,92%)`, color: `hsl(${hue},45%,38%)`, borderRadius: 8, fontSize: size * 0.36, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function OrgScreen({ onNav }: { onNav: (k: string, data?: unknown) => void }) {
  const [orgs, setOrgs] = useState<Organization[]>(ORGS_INIT);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrgStatus | "">("");
  const [showCreate, setShowCreate] = useState(false);
  const [editOrg, setEditOrg] = useState<Organization | null>(null);
  const [deleteOrg, setDeleteOrg] = useState<Organization | null>(null);

  const displayed = orgs.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (search && !o.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (showCreate) return <CreateOrg onBack={() => setShowCreate(false)} onSave={(o) => { setOrgs((p) => [...p, o]); setShowCreate(false); }} />;
  if (editOrg) return <CreateOrg initial={editOrg} onBack={() => setEditOrg(null)} onSave={(o) => { setOrgs((p) => p.map((x) => x.id === o.id ? o : x)); setEditOrg(null); }} />;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1000px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-slate-600 font-medium">Organization</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Organizations</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your election organizations and teams.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Usage pill */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-600">
              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1d4ed8] rounded-full" style={{ width: `${(orgs.length / ORG_LIMIT) * 100}%` }} />
              </div>
              <span><strong className="text-slate-800">{orgs.length}</strong> / {ORG_LIMIT} organizations</span>
            </div>
            <button
              onClick={() => { if (orgs.length < ORG_LIMIT) setShowCreate(true); }}
              disabled={orgs.length >= ORG_LIMIT}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Icon d={I.plus} size={14} />New Organization
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Icon d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search organizations…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrgStatus | "")}
              className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors ${statusFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"}`}>
              <option value="">All Status</option>
              <option>Active</option><option>Suspended</option><option>Pending</option>
            </select>
            <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4">
          {displayed.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center"><Icon d={I.organization} size={20} className="text-slate-300" /></div>
              <p className="text-sm font-medium text-slate-500">No organizations found.</p>
              <button onClick={() => setShowCreate(true)} className="text-xs text-[#1d4ed8] hover:underline font-medium">Create your first organization</button>
            </div>
          ) : displayed.map((org) => (
            <div key={org.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5 hover:border-slate-300 hover:shadow-sm transition-all">
              <OrgInitials name={org.name} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-sm font-semibold text-slate-900 truncate">{org.name}</span>
                  <Badge variant={ORG_STATUS_V[org.status]}>{org.status}</Badge>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ORG_PARTY_COLORS[org.party]}`}>{org.party}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Icon d={I.shield} size={11} className="text-slate-400" /><Badge variant={ORG_ROLE_V[org.role]}>{org.role}</Badge></span>
                  <span className="flex items-center gap-1"><Icon d={I.voters} size={11} className="text-slate-400" />{org.memberCount} members</span>
                  <span className="flex items-center gap-1"><Icon d={I.calendar} size={11} className="text-slate-400" />Created {org.createdDate}</span>
                  <span className="flex items-center gap-1"><Icon d={I.globe} size={11} className="text-slate-400" />{org.city}, {org.state}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onNav("org-members")} className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                <button onClick={() => setEditOrg(org)} className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors flex items-center gap-1"><Icon d={I.edit} size={11} />Edit</button>
                <button onClick={() => setDeleteOrg(org)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Icon d={I.trash} size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setDeleteOrg(null)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl w-[380px] p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center shrink-0"><Icon d={I.trash} size={16} className="text-red-500" /></div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Delete Organization</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Delete <strong>{deleteOrg.name}</strong>? This will remove all members and data. This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteOrg(null)} className="flex-1 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setOrgs((p) => p.filter((o) => o.id !== deleteOrg!.id)); setDeleteOrg(null); }} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Create / Edit Organization Wizard ─────────────────────────────────────────

const INDIA_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const PARTIES: OrgParty[] = ["BJP", "INC", "AAP", "SP", "BSP", "TMC", "Independent"];

const SCOPE_PAGES = [
  { key: "voters", label: "Voters", icon: I.voters },
  { key: "booths", label: "Booths", icon: I.organization },
  { key: "members", label: "Members", icon: I.voters },
  { key: "forms", label: "Forms & Surveys", icon: I.fileText },
  { key: "intelligence", label: "AI Intelligence", icon: I.sparkle },
  { key: "operations", label: "Operations Data", icon: I.settings },
  { key: "campaigns", label: "Campaigns", icon: I.campaigns },
  { key: "reports", label: "Reports", icon: I.reports },
];

function CreateOrg({ onBack, onSave, initial }: { onBack: () => void; onSave: (o: Organization) => void; initial?: Organization }) {
  const isEdit = !!initial;
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [street, setStreet] = useState(initial?.street ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [district, setDistrict] = useState(initial?.district ?? "");
  const [state, setState] = useState(initial?.state ?? "Uttar Pradesh");
  const [country, setCountry] = useState(initial?.country ?? "India");
  const [pincode, setPincode] = useState(initial?.pincode ?? "");
  const [party, setParty] = useState<OrgParty>(initial?.party ?? "BJP");
  const [scopePages, setScopePages] = useState<string[]>(SCOPE_PAGES.map((p) => p.key));
  const [saved, setSaved] = useState(false);

  const step1Valid = name.trim() && city.trim() && state && party;

  function handleSave() {
    const org: Organization = {
      id: initial?.id ?? `o${Date.now()}`,
      name: name.trim(),
      status: initial?.status ?? "Active",
      party,
      role: initial?.role ?? "Owner",
      createdDate: initial?.createdDate ?? "Today",
      street, city, district, state, country, pincode,
      memberCount: initial?.memberCount ?? 1,
    };
    setSaved(true);
    setTimeout(() => onSave(org), 900);
  }

  if (saved) return (
    <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Icon d={I.checkCircle} size={24} className="text-green-500" /></div>
        <div className="text-base font-semibold text-slate-900 mb-1">{isEdit ? "Organization updated!" : "Organization created!"}</div>
        <p className="text-sm text-slate-500">Returning to organization list…</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[700px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <button onClick={onBack} className="hover:text-slate-600">Organization</button>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">{isEdit ? `Edit — ${initial.name}` : "New Organization"}</span>
        </nav>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{isEdit ? "Edit Organization" : "New Organization"}</h1>
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-xs">
            {[{ n: 1, label: "Details" }, { n: 2, label: "Scope" }].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px bg-slate-200" />}
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${step > s.n ? "bg-[#1d4ed8] border-[#1d4ed8] text-white" : step === s.n ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-slate-300 text-slate-400"}`}>
                    {step > s.n ? <Icon d={I.check} size={10} className="text-white" /> : s.n}
                  </div>
                  <span className={step >= s.n ? "text-slate-700 font-medium" : "text-slate-400"}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <div className="text-sm font-semibold text-slate-800">Organization Details</div>
              <p className="text-xs text-slate-500 mt-0.5">Basic information and address for this organization.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="Organization Name" required>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lucknow Central Unit"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Street">
                  <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street address, building, area"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
                </FormField>
              </div>
              <FormField label="City" required>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lucknow"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
              </FormField>
              <FormField label="District">
                <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Lucknow"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
              </FormField>
              <FormField label="State" required>
                <div className="relative">
                  <select value={state} onChange={(e) => setState(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 transition-colors pr-8 cursor-pointer">
                    {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </FormField>
              <FormField label="Country">
                <input value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
              </FormField>
              <FormField label="Pincode">
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit pincode" maxLength={6}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
              </FormField>
              <FormField label="Party" required>
                <div className="relative">
                  <select value={party} onChange={(e) => setParty(e.target.value as OrgParty)}
                    className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 transition-colors pr-8 cursor-pointer">
                    {PARTIES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </FormField>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setStep(2)} disabled={!step1Valid}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40">
                Next — Configure Scope<Icon d={I.chevronRight} size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <div className="text-sm font-semibold text-slate-800">Organization Scope</div>
              <p className="text-xs text-slate-500 mt-0.5">Choose which modules and pages members of this organization can access.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SCOPE_PAGES.map((p) => {
                const on = scopePages.includes(p.key);
                return (
                  <button key={p.key} onClick={() => setScopePages((prev) => on ? prev.filter((k) => k !== p.key) : [...prev, p.key])}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${on ? "border-[#1d4ed8] bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 transition-colors ${on ? "bg-[#1d4ed8]" : "bg-slate-100"}`}>
                      <Icon d={p.icon} size={14} className={on ? "text-white" : "text-slate-400"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold truncate ${on ? "text-[#1d4ed8]" : "text-slate-700"}`}>{p.label}</div>
                    </div>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${on ? "bg-[#1d4ed8] border-[#1d4ed8]" : "border-slate-300"}`}>
                      {on && <Icon d={I.check} size={10} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 flex items-center gap-3">
              <Icon d={I.info} size={14} className="text-slate-400 shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">Scope controls apply to Editor and Viewer roles. Owners and Admins retain full access regardless of scope.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Icon d={I.chevronLeft} size={14} />Back
              </button>
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">
                <Icon d={I.checkCircle} size={14} />{isEdit ? "Save Changes" : "Create Organization"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Organization Members ──────────────────────────────────────────────────────

function OrgMembers() {
  const [members, setMembers] = useState<OrgMember[]>(ORG_MEMBERS_INIT);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<OrgRole | "">("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrgRole>("Viewer");
  const [editMember, setEditMember] = useState<OrgMember | null>(null);
  const [editRole, setEditRole] = useState<OrgRole>("Viewer");
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [invites, setInvites] = useState(PENDING_INVITES);
  const [inviteSent, setInviteSent] = useState(false);

  const displayed = members.filter((m) => {
    if (roleFilter && m.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function sendInvite() {
    if (!inviteEmail.trim()) return;
    setInvites((p) => [...p, { email: inviteEmail.trim(), role: inviteRole, invitedBy: "Arun Mehta", sentDate: "Today" }]);
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteEmail(""); setShowInvite(false); }, 1200);
  }

  function saveRole() {
    if (!editMember) return;
    setMembers((p) => p.map((m) => m.id === editMember.id ? { ...m, role: editRole } : m));
    setEditMember(null);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1000px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Organization</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Members</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Members</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage team members for Lucknow Central Unit.</p>
          </div>
          <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
            <Icon d={I.userPlus} size={14} />Invite Member
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Icon d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
          </div>
          <div className="relative">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as OrgRole | "")}
              className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors ${roleFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              <option value="">All Roles</option>
              {ROLES_ORDERED.map((r) => <option key={r}>{r}</option>)}
            </select>
            <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="ml-auto text-xs text-slate-500 font-medium">{displayed.length} member{displayed.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Members table */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Member", "Role", "Joined", "Status", "Actions"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 4 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayed.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-slate-400">No members match your search.</td></tr>
              ) : displayed.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                        {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{m.name}</div>
                        <div className="text-[11px] text-slate-400">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={ORG_ROLE_V[m.role]}>{m.role}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{m.joinedDate}</td>
                  <td className="px-4 py-3"><Badge variant={ORG_MEMBER_STATUS_V[m.status]}>{m.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {m.role !== "Owner" && (
                        <button onClick={() => { setEditMember(m); setEditRole(m.role); }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors flex items-center gap-1">
                          <Icon d={I.edit} size={11} />Edit Role
                        </button>
                      )}
                      {m.role !== "Owner" && (
                        <button onClick={() => setRemoveId(m.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Icon d={I.trash} size={12} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending invitations */}
        {invites.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Pending Invitations</span>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{invites.length}</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Email", "Role", "Invited By", "Sent", ""].map((h, i) => (
                    <th key={i} className={`px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 4 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invites.map((inv, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center"><Icon d={I.mail} size={11} className="text-amber-600" /></div>
                        <span className="text-xs text-slate-700 font-medium">{inv.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={ORG_ROLE_V[inv.role]}>{inv.role}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{inv.invitedBy}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{inv.sentDate}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Resend</button>
                        <button onClick={() => setInvites((p) => p.filter((_, j) => j !== i))} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors">Revoke</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setShowInvite(false)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl w-[420px] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-sm font-semibold text-slate-900">Invite Member</div>
                <p className="text-xs text-slate-400 mt-0.5">Send an email invitation to join this organization.</p>
              </div>
              <button onClick={() => setShowInvite(false)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.x} size={14} /></button>
            </div>
            {inviteSent ? (
              <div className="py-8 flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><Icon d={I.checkCircle} size={20} className="text-green-500" /></div>
                <div className="text-sm font-semibold text-slate-900">Invitation sent!</div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <FormField label="Email Address" required>
                    <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@domain.com"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
                  </FormField>
                  <FormField label="Role" required>
                    <div className="relative">
                      <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as OrgRole)}
                        className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 pr-8 cursor-pointer">
                        {ROLES_ORDERED.filter((r) => r !== "Owner").map((r) => <option key={r}>{r}</option>)}
                      </select>
                      <Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormField>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowInvite(false)} className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={sendInvite} disabled={!inviteEmail.trim()} className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                    <Icon d={I.mail} size={14} />Send Invite
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit role modal */}
      {editMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setEditMember(null)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl w-[360px] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm font-semibold text-slate-900">Edit Role — {editMember.name}</div>
              <button onClick={() => setEditMember(null)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.x} size={14} /></button>
            </div>
            <div className="space-y-2 mb-5">
              {ROLES_ORDERED.filter((r) => r !== "Owner").map((r) => (
                <button key={r} onClick={() => setEditRole(r)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${editRole === r ? "border-[#1d4ed8] bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${editRole === r ? "border-[#1d4ed8] bg-[#1d4ed8]" : "border-slate-300"}`}>
                    {editRole === r && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${editRole === r ? "text-[#1d4ed8]" : "text-slate-700"}`}>{r}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{r === "Admin" ? "Full access except delete org" : r === "Editor" ? "Can edit data and surveys" : "Read-only access"}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditMember(null)} className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={saveRole} className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">Save Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove confirm */}
      {removeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setRemoveId(null)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl w-[360px] p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center shrink-0"><Icon d={I.trash} size={16} className="text-red-500" /></div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Remove Member</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">This member will lose all access to the organization immediately.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRemoveId(null)} className="flex-1 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setMembers((p) => p.filter((m) => m.id !== removeId)); setRemoveId(null); }} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── My Access ─────────────────────────────────────────────────────────────────

const MY_ACCESS_DATA = {
  name: "Arun Mehta",
  email: "arun.mehta@bjplko.in",
  role: "Owner" as OrgRole,
  joinedDate: "12 Jan 2024",
  invitedBy: "System (Founder)",
  org: "Lucknow Central Unit",
  party: "BJP" as OrgParty,
  scopePages: ["voters", "booths", "members", "forms", "intelligence", "operations", "campaigns", "reports"],
  featureAccess: [
    { label: "View voter records", granted: true },
    { label: "Edit voter data", granted: true },
    { label: "Export voter lists", granted: true },
    { label: "Manage booth assignments", granted: true },
    { label: "Send campaigns", granted: true },
    { label: "Access AI Intelligence", granted: true },
    { label: "Manage organization settings", granted: true },
    { label: "Invite new members", granted: true },
    { label: "Delete organization", granted: true },
    { label: "Manage billing", granted: false },
  ],
};

function MyAccess() {
  const d = MY_ACCESS_DATA;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[800px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Organization</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">My Access</span>
        </nav>

        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">My Access</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your current role, permissions, and scope in this organization.</p>
        </div>

        {/* Identity card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-700 shrink-0">
            {d.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-slate-900">{d.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{d.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={ORG_ROLE_V[d.role]}>{d.role}</Badge>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ORG_PARTY_COLORS[d.party]}`}>{d.party}</span>
              <span className="text-xs text-slate-500">{d.org}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Joined</div>
            <div className="text-xs font-semibold text-slate-700">{d.joinedDate}</div>
            <div className="text-[10px] text-slate-400 mt-2">Invited by</div>
            <div className="text-xs font-semibold text-slate-700">{d.invitedBy}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Scope */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Icon d={I.globe} size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Page Access</span>
            </div>
            <div className="space-y-2">
              {SCOPE_PAGES.map((p) => {
                const granted = d.scopePages.includes(p.key);
                return (
                  <div key={p.key} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${granted ? "bg-blue-50" : "bg-slate-100"}`}>
                        <Icon d={p.icon} size={11} className={granted ? "text-[#1d4ed8]" : "text-slate-300"} />
                      </div>
                      <span className={`text-xs font-medium ${granted ? "text-slate-700" : "text-slate-400"}`}>{p.label}</span>
                    </div>
                    {granted
                      ? <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold"><Icon d={I.checkCircle} size={11} className="text-green-500" />Allowed</div>
                      : <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold"><Icon d={I.x} size={11} />Blocked</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feature access */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Icon d={I.key} size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Feature Access</span>
            </div>
            <div className="space-y-2">
              {d.featureAccess.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className={`text-xs font-medium ${f.granted ? "text-slate-700" : "text-slate-400"}`}>{f.label}</span>
                  {f.granted
                    ? <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold"><Icon d={I.checkCircle} size={11} className="text-green-500" />Yes</div>
                    : <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold"><Icon d={I.x} size={11} />No</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#1d4ed8] rounded-lg flex items-center justify-center shrink-0 mt-0.5"><Icon d={I.shield} size={14} className="text-white" /></div>
            <div>
              <div className="text-sm font-semibold text-[#1d4ed8]">Owner Role</div>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">As Owner, you have unrestricted access to all organization features, data, and settings. You can manage members, permissions, and delete the organization.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Permissions Matrix ────────────────────────────────────────────────────────

function OrgPermissions() {
  const [matrix, setMatrix] = useState<PermissionMatrix>(PERM_INIT);
  const [saved, setSaved] = useState(false);

  function toggle(role: OrgRole, permKey: string) {
    if (role === "Owner") return;
    setMatrix((p) => ({
      ...p,
      [role]: { ...p[role], [permKey]: !p[role][permKey] },
    }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const ROLE_COLORS: Record<OrgRole, string> = {
    Owner: "text-blue-700 bg-blue-50 border-blue-200",
    Admin: "text-indigo-700 bg-indigo-50 border-indigo-200",
    Editor: "text-violet-700 bg-violet-50 border-violet-200",
    Viewer: "text-slate-600 bg-slate-50 border-slate-200",
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[900px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Organization</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Permissions</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Role Permissions</h1>
            <p className="text-sm text-slate-500 mt-0.5">Control what each role can do within this organization.</p>
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded transition-colors ${saved ? "bg-green-600 text-white" : "bg-[#1d4ed8] text-white hover:bg-blue-700"}`}>
            {saved ? <><Icon d={I.checkCircle} size={14} />Saved!</> : <><Icon d={I.check} size={14} />Save Changes</>}
          </button>
        </div>

        {/* Role overview pills */}
        <div className="grid grid-cols-4 gap-3">
          {ROLES_ORDERED.map((role) => {
            const count = PERMISSION_KEYS.filter((p) => matrix[role][p.key]).length;
            return (
              <div key={role} className={`rounded-xl border p-4 ${ROLE_COLORS[role]}`}>
                <div className="text-xs font-bold uppercase tracking-wide mb-2">{role}</div>
                <div className="text-2xl font-bold mb-1">{count}<span className="text-sm font-medium opacity-60">/{PERMISSION_KEYS.length}</span></div>
                <div className="text-[10px] font-medium opacity-70">permissions granted</div>
                {role === "Owner" && <div className="text-[10px] font-bold mt-2 opacity-80">Cannot be edited</div>}
              </div>
            );
          })}
        </div>

        {/* Permission matrix */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="grid border-b border-slate-200" style={{ gridTemplateColumns: "1fr repeat(4, 120px)" }}>
            <div className="px-5 py-3.5 bg-slate-50 border-r border-slate-200">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Permission</span>
            </div>
            {ROLES_ORDERED.map((role) => (
              <div key={role} className={`px-3 py-3.5 bg-slate-50 text-center border-r border-slate-200 last:border-r-0`}>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border ${ROLE_COLORS[role]}`}>{role}</span>
              </div>
            ))}
          </div>

          {PERMISSION_KEYS.map((perm, idx) => (
            <div key={perm.key} className={`grid border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors`} style={{ gridTemplateColumns: "1fr repeat(4, 120px)" }}>
              <div className="px-5 py-4 border-r border-slate-100">
                <div className="text-xs font-semibold text-slate-800">{perm.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{perm.desc}</div>
              </div>
              {ROLES_ORDERED.map((role) => {
                const granted = matrix[role][perm.key];
                const isOwner = role === "Owner";
                return (
                  <div key={role} className="px-3 py-4 flex items-center justify-center border-r border-slate-100 last:border-r-0">
                    <button
                      onClick={() => toggle(role, perm.key)}
                      disabled={isOwner}
                      aria-label={`Toggle ${perm.label} for ${role}`}
                      className={`w-9 h-5 rounded-full border-2 transition-all relative ${granted ? "bg-[#1d4ed8] border-[#1d4ed8]" : "bg-slate-100 border-slate-200"} ${isOwner ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:opacity-90"}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${granted ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <Icon d={I.info} size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">Owner permissions are fixed and cannot be modified. Changes take effect immediately when saved and apply to all members with the affected role.</p>
        </div>
      </div>
    </div>
  );
}

// ─── CAMPAIGN MODULE ──────────────────────────────────────────────────────────

type CampChannel = "WhatsApp" | "SMS" | "Voice";
type CampStatus = "Active" | "Scheduled" | "Paused" | "Completed" | "Draft";

interface Campaign {
  id: string;
  name: string;
  channel: CampChannel;
  audience: number;
  status: CampStatus;
  sent: number;
  delivered: number;
  failed: number;
  cost: number;
  createdDate: string;
  scheduledDate?: string;
}

const CAMP_STATUS_V: Record<CampStatus, BadgeVariant> = {
  Active: "success", Scheduled: "info", Paused: "warning", Completed: "muted", Draft: "default",
};

const CHANNEL_COLORS: Record<CampChannel, { bg: string; text: string; border: string; dot: string }> = {
  WhatsApp: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  SMS:      { bg: "bg-blue-50",  text: "text-blue-700",  border: "border-blue-200",  dot: "bg-blue-500"  },
  Voice:    { bg: "bg-violet-50",text: "text-violet-700",border: "border-violet-200",dot: "bg-violet-500"},
};

const CAMPAIGNS_DATA: Campaign[] = [
  { id: "c1",  name: "Booth 10-14 Voter Outreach",   channel: "WhatsApp", audience: 1240, status: "Active",    sent: 1180, delivered: 1102, failed: 78,  cost: 590,  createdDate: "01 Aug 2024", scheduledDate: "01 Aug 2024" },
  { id: "c2",  name: "Ward 2 Election Day Reminder",  channel: "SMS",      audience: 980,  status: "Scheduled", sent: 0,    delivered: 0,    failed: 0,   cost: 0,    createdDate: "02 Aug 2024", scheduledDate: "10 Sep 2024" },
  { id: "c3",  name: "Senior Voter Voice Blast",       channel: "Voice",    audience: 420,  status: "Completed", sent: 418,  delivered: 381,  failed: 37,  cost: 2090, createdDate: "28 Jul 2024" },
  { id: "c4",  name: "Manifesto WhatsApp Broadcast",  channel: "WhatsApp", audience: 5210, status: "Completed", sent: 5200, delivered: 4980, failed: 220, cost: 2600, createdDate: "20 Jul 2024" },
  { id: "c5",  name: "Last Mile Voter SMS Push",      channel: "SMS",      audience: 3840, status: "Paused",    sent: 1920, delivered: 1810, failed: 110, cost: 384,  createdDate: "05 Aug 2024" },
  { id: "c6",  name: "Candidate Introduction Voice",  channel: "Voice",    audience: 760,  status: "Draft",     sent: 0,    delivered: 0,    failed: 0,   cost: 0,    createdDate: "07 Aug 2024" },
  { id: "c7",  name: "Thank You WhatsApp Series",     channel: "WhatsApp", audience: 2100, status: "Active",    sent: 840,  delivered: 812,  failed: 28,  cost: 420,  createdDate: "08 Aug 2024" },
  { id: "c8",  name: "Polling Booth Directions SMS",  channel: "SMS",      audience: 1540, status: "Scheduled", sent: 0,    delivered: 0,    failed: 0,   cost: 0,    createdDate: "09 Aug 2024", scheduledDate: "11 Sep 2024" },
];

const SCRIPTS_DATA = [
  { id: "s1", name: "Election Day Reminder",     channel: "WhatsApp" as CampChannel, language: "Hindi",   created: "01 Aug 2024", updated: "05 Aug 2024", status: "Active" as const,   preview: "नमस्ते {name}! कल मतदान का दिन है। अपना मत अवश्य डालें। बूथ नं {booth} — सुबह 7 से शाम 6 बजे तक।" },
  { id: "s2", name: "Voter Registration Alert",  channel: "SMS"      as CampChannel, language: "English", created: "28 Jul 2024", updated: "28 Jul 2024", status: "Active" as const,   preview: "Hi {name}, your voter registration is confirmed. EPIC: {epic}. Polling Booth: {booth}. Voting date: {date}." },
  { id: "s3", name: "Candidate Introduction",    channel: "Voice"    as CampChannel, language: "Hindi",   created: "15 Jul 2024", updated: "20 Jul 2024", status: "Active" as const,   preview: "नमस्ते, मैं {candidate} बोल रहा हूँ। आपके क्षेत्र का विकास मेरी प्राथमिकता है। कृपया अपना मूल्यवान मत दें।" },
  { id: "s4", name: "Manifesto Broadcast",       channel: "WhatsApp" as CampChannel, language: "Hindi",   created: "10 Jul 2024", updated: "12 Jul 2024", status: "Draft" as const,    preview: "हमारे घोषणापत्र की मुख्य बातें: 1. रोजगार 2. स्वास्थ्य 3. शिक्षा। विस्तार से पढ़ें: {link}" },
  { id: "s5", name: "Thank You Message",         channel: "SMS"      as CampChannel, language: "English", created: "05 Aug 2024", updated: "05 Aug 2024", status: "Active" as const,   preview: "Dear {name}, thank you for your support! Your trust means everything to us. Together we will build a better {area}." },
  { id: "s6", name: "Polling Reminder Voice",    channel: "Voice"    as CampChannel, language: "Bhojpuri",created: "02 Aug 2024", updated: "08 Aug 2024", status: "Archived" as const, preview: "प्रिय {name}, कल वोटिंग है। आपका बूथ {booth} पर है। जरूर आईं। जय हिंद।" },
];

// ── Campaign Dashboard ────────────────────────────────────────────────────────

function CampaignDashboard({ onNav }: { onNav: (k: string) => void }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_DATA);
  const [statusFilter, setStatusFilter] = useState<CampStatus | "">("");
  const [channelFilter, setChannelFilter] = useState<CampChannel | "">("");
  const [search, setSearch] = useState("");

  const totals = {
    active: campaigns.filter((c) => c.status === "Active").length,
    scheduled: campaigns.filter((c) => c.status === "Scheduled").length,
    completed: campaigns.filter((c) => c.status === "Completed").length,
    messages: campaigns.filter((c) => c.channel !== "Voice").reduce((s, c) => s + c.sent, 0),
    calls: campaigns.filter((c) => c.channel === "Voice").reduce((s, c) => s + c.sent, 0),
    cost: campaigns.reduce((s, c) => s + c.cost, 0),
    balance: 12500,
  };

  const channelStats = {
    WhatsApp: { used: 8220,  remaining: 11780 },
    SMS:      { used: 5760,  remaining: 14240 },
    Voice:    { used: 838,   remaining: 4162  },
  };

  const filtered = campaigns.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (channelFilter && c.channel !== channelFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statCards = [
    { label: "Active Campaigns",   value: totals.active,                    color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200", icon: I.zap },
    { label: "Scheduled",          value: totals.scheduled,                  color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",  icon: I.calendar },
    { label: "Completed",          value: totals.completed,                  color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200", icon: I.checkCircle },
    { label: "Total Messages",     value: totals.messages.toLocaleString(),  color: "text-slate-900",  bg: "bg-white",     border: "border-slate-200", icon: I.campaigns },
    { label: "Voice Calls",        value: totals.calls.toLocaleString(),     color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200",icon: I.phone },
    { label: "Campaign Cost",      value: `₹${totals.cost.toLocaleString()}`,color: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-200",  icon: I.reports },
    { label: "Remaining Balance",  value: `₹${totals.balance.toLocaleString()}`,color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200",icon: I.star },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1140px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Campaign Command Center</h1>
            <p className="text-sm text-slate-500 mt-0.5">Overview of all WhatsApp, SMS, and Voice campaigns.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onNav("camp-whatsapp")} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"><Icon d={I.campaigns} size={13} />WhatsApp</button>
            <button onClick={() => onNav("camp-sms")} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors"><Icon d={I.fileText} size={13} />SMS</button>
            <button onClick={() => onNav("camp-voice")} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors"><Icon d={I.phone} size={13} />Voice</button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-7 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 flex flex-col gap-2`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-tight">{s.label}</span>
                <Icon d={s.icon} size={13} className="text-slate-300" />
              </div>
              <div className={`text-xl font-bold tracking-tight ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Channel balance + Status strip */}
        <div className="grid grid-cols-2 gap-4">
          {/* Channel balance */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Channel Balance</div>
            <div className="space-y-4">
              {(["WhatsApp", "SMS", "Voice"] as CampChannel[]).map((ch) => {
                const s = channelStats[ch];
                const total = s.used + s.remaining;
                const pct = (s.used / total) * 100;
                const col = CHANNEL_COLORS[ch];
                return (
                  <div key={ch}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className="text-xs font-semibold text-slate-700">{ch}</span>
                      </div>
                      <div className="flex gap-4 text-[11px]">
                        <span className="text-slate-500">Used: <strong className="text-slate-700">{s.used.toLocaleString()}</strong></span>
                        <span className="text-slate-500">Remaining: <strong className={col.text}>{s.remaining.toLocaleString()}</strong></span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${col.dot}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Campaign Status</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Active",    count: campaigns.filter((c) => c.status === "Active").length,    color: "bg-green-500",  light: "bg-green-50 border-green-200 text-green-700" },
                { label: "Scheduled", count: campaigns.filter((c) => c.status === "Scheduled").length, color: "bg-blue-500",   light: "bg-blue-50 border-blue-200 text-blue-700" },
                { label: "Paused",    count: campaigns.filter((c) => c.status === "Paused").length,    color: "bg-amber-500",  light: "bg-amber-50 border-amber-200 text-amber-700" },
                { label: "Completed", count: campaigns.filter((c) => c.status === "Completed").length, color: "bg-slate-400",  light: "bg-slate-50 border-slate-200 text-slate-600" },
              ].map((s) => (
                <div key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${s.light}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <div>
                    <div className="text-lg font-bold">{s.count}</div>
                    <div className="text-[10px] font-medium opacity-70">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Icon d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
            </div>
            <div className="relative">
              <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value as CampChannel | "")}
                className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors ${channelFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                <option value="">All Channels</option>
                <option>WhatsApp</option><option>SMS</option><option>Voice</option>
              </select>
              <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CampStatus | "")}
                className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors ${statusFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                <option value="">All Status</option>
                <option>Active</option><option>Scheduled</option><option>Paused</option><option>Completed</option><option>Draft</option>
              </select>
              <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {(search || statusFilter || channelFilter) && (
              <button onClick={() => { setSearch(""); setStatusFilter(""); setChannelFilter(""); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear</button>
            )}
            <span className="ml-auto text-xs text-slate-500 font-medium">{filtered.length} campaign{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Campaign", "Channel", "Audience", "Status", "Sent", "Delivered", "Failed", "Cost", "Created", "Actions"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 9 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const col = CHANNEL_COLORS[c.channel];
                const deliveryRate = c.sent > 0 ? Math.round((c.delivered / c.sent) * 100) : 0;
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="text-xs font-semibold text-slate-800 truncate">{c.name}</div>
                      {c.scheduledDate && c.status === "Scheduled" && <div className="text-[10px] text-slate-400 mt-0.5">Scheduled: {c.scheduledDate}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.bg} ${col.text} ${col.border}`}>{c.channel}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{c.audience.toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge variant={CAMP_STATUS_V[c.status]}>{c.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-medium">{c.sent.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-green-700 font-medium">{c.delivered.toLocaleString()}</div>
                      {c.sent > 0 && <div className="text-[10px] text-slate-400">{deliveryRate}%</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-red-600 font-medium">{c.failed > 0 ? c.failed.toLocaleString() : <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-medium">{c.cost > 0 ? `₹${c.cost.toLocaleString()}` : <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{c.createdDate}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => onNav("camp-analytics")} className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                        {c.status === "Active" && (
                          <button onClick={() => setCampaigns((p) => p.map((x) => x.id === c.id ? { ...x, status: "Paused" } : x))}
                            className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors">Pause</button>
                        )}
                        {c.status === "Paused" && (
                          <button onClick={() => setCampaigns((p) => p.map((x) => x.id === c.id ? { ...x, status: "Active" } : x))}
                            className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors">Resume</button>
                        )}
                        <button onClick={() => setCampaigns((p) => p.filter((x) => x.id !== c.id))} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Icon d={I.trash} size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="py-12 text-center text-sm text-slate-400">No campaigns match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Shared Campaign Wizard Shell ──────────────────────────────────────────────

const CAMP_OBJECTIVES = ["Voter Outreach", "Election Day Reminder", "Candidate Introduction", "Manifesto Broadcast", "Thank You Message", "Event Invitation", "Scheme Awareness", "Custom"];

function CampaignWizard({ channel, steps, children, onBack }: {
  channel: CampChannel;
  steps: string[];
  children: React.ReactNode;
  onBack: () => void;
}) {
  const col = CHANNEL_COLORS[channel];
  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[860px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <button onClick={onBack} className="hover:text-slate-600">Campaigns</button>
          <Icon d={I.chevronRight} size={12} />
          <span className={`font-semibold ${col.text}`}>{channel} Campaign</span>
        </nav>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center ${col.bg} border ${col.border}`}>
            <Icon d={channel === "Voice" ? I.phone : channel === "SMS" ? I.fileText : I.campaigns} size={12} className={col.text} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">New {channel} Campaign</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

function WizardSteps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-5">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${i < current ? "bg-[#1d4ed8] border-[#1d4ed8] text-white" : i === current ? "border-[#1d4ed8] text-[#1d4ed8] bg-white" : "border-slate-200 text-slate-400 bg-white"}`}>
              {i < current ? <Icon d={I.check} size={10} className="text-white" /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold whitespace-nowrap ${i <= current ? "text-slate-700" : "text-slate-400"}`}>{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${i < current ? "bg-[#1d4ed8]" : "bg-slate-200"}`} />}
        </div>
      ))}
    </div>
  );
}

function CampApprovalModal({ onApprove, onCancel, summary }: { onApprove: () => void; onCancel: () => void; summary: { audience: number; channel: CampChannel; cost: number; name: string } }) {
  const [approving, setApproving] = useState(false);
  function approve() { setApproving(true); setTimeout(onApprove, 900); }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onCancel} />
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-[460px] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center shrink-0">
            <Icon d={I.shield} size={18} className="text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">Human Approval Required</div>
            <p className="text-xs text-slate-500 mt-0.5">Review this campaign before it goes live.</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 mb-5">
          {[["Campaign", summary.name], ["Channel", summary.channel], ["Audience", `${summary.audience.toLocaleString()} voters`], ["Estimated Cost", `₹${summary.cost.toLocaleString()}`]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">{k}</span>
              <span className="font-semibold text-slate-800">{v}</span>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 flex items-start gap-2 mb-5">
          <Icon d={I.info} size={13} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">₹{summary.cost.toLocaleString()} will be deducted from your campaign balance. This action cannot be undone after launch.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={approve} className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            {approving ? <><Icon d={I.refreshCw} size={13} className="animate-spin" />Approving…</> : <><Icon d={I.checkCircle} size={13} />Approve & Launch</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function CampSuccessScreen({ channel, name, audience, cost, onDone }: { channel: CampChannel; name: string; audience: number; cost: number; onDone: () => void }) {
  const col = CHANNEL_COLORS[channel];
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"><Icon d={I.checkCircle} size={28} className="text-green-500" /></div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Campaign Launched!</h2>
        <p className="text-sm text-slate-500 mb-6">"{name}" is now live and messages are being delivered.</p>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-left space-y-2 mb-6">
          {[["Channel", channel], ["Audience", `${audience.toLocaleString()} voters`], ["Estimated Cost", `₹${cost.toLocaleString()}`], ["Status", "Active"]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-slate-500">{k}</span>
              <span className="font-semibold text-slate-800">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onDone} className="w-full py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-xl hover:bg-blue-700 transition-colors">View Campaign Dashboard</button>
      </div>
    </div>
  );
}

// ── WhatsApp Campaign ─────────────────────────────────────────────────────────

const WA_STEPS = ["Name", "Objective", "Audience", "Message", "Preview", "Approval", "Schedule", "Launch"];

function WhatsAppCampaign({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState<number>(0);
  const [audienceLabel, setAudienceLabel] = useState("All voters");
  const [message, setMessage] = useState("नमस्ते {name}! आपसे निवेदन है कि कल मतदान में जरूर भाग लें। आपका बूथ: {booth}। मतदान समय: सुबह 7 से शाम 6 बजे।\n\n— {candidate} टीम");
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [showApproval, setShowApproval] = useState(false);
  const [launched, setLaunched] = useState(false);

  const estimatedCost = Math.round(audience * 0.5);
  const remaining = 12500;

  const AUDIENCE_OPTS = [
    { label: "All voters", count: 18750 },
    { label: "Booth 10–14 voters", count: 1240 },
    { label: "Ward 1 voters", count: 4210 },
    { label: "Female voters", count: 9120 },
    { label: "Voters aged 18–35", count: 5640 },
    { label: "First-time voters", count: 2310 },
  ];

  const step1Ok = name.trim().length > 3;
  const step2Ok = !!objective;
  const step3Ok = audience > 0;
  const step4Ok = message.trim().length > 10;

  if (launched) return <CampSuccessScreen channel="WhatsApp" name={name} audience={audience} cost={estimatedCost} onDone={onBack} />;

  return (
    <CampaignWizard channel="WhatsApp" steps={WA_STEPS} onBack={onBack}>
      <WizardSteps steps={WA_STEPS} current={step} />
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">

        {step === 0 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-1">Campaign Name</div>
            <FormField label="Give your campaign a descriptive name" required>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Booth 10-14 Election Day Reminder"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400" />
            </FormField>
            <div className="flex justify-end">
              <button onClick={() => setStep(1)} disabled={!step1Ok} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-3">Select Objective</div>
            <div className="grid grid-cols-2 gap-2">
              {CAMP_OBJECTIVES.map((o) => (
                <button key={o} onClick={() => setObjective(o)}
                  className={`px-4 py-3 text-left text-xs font-medium rounded-lg border-2 transition-all ${objective === o ? "border-green-500 bg-green-50 text-green-700" : "border-slate-200 hover:border-slate-300 text-slate-700"}`}>
                  {o}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(2)} disabled={!step2Ok} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-3">Select Audience</div>
            <div className="space-y-2">
              {AUDIENCE_OPTS.map((a) => (
                <button key={a.label} onClick={() => { setAudienceLabel(a.label); setAudience(a.count); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-left transition-all ${audienceLabel === a.label ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <span className={`text-xs font-medium ${audienceLabel === a.label ? "text-green-700" : "text-slate-700"}`}>{a.label}</span>
                  <span className={`text-xs font-bold ${audienceLabel === a.label ? "text-green-700" : "text-slate-500"}`}>{a.count.toLocaleString()} voters</span>
                </button>
              ))}
            </div>
            {audience > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="text-green-700 font-medium">Estimated Cost</span>
                <span className="font-bold text-green-800">₹{estimatedCost.toLocaleString()} <span className="font-normal opacity-70">(Remaining: ₹{remaining.toLocaleString()})</span></span>
              </div>
            )}
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(3)} disabled={!step3Ok} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-1">Compose Message</div>
            <div className="space-y-3">
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none font-sans leading-relaxed" />
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex gap-2">
                  {["{name}", "{booth}", "{candidate}", "{date}"].map((v) => (
                    <button key={v} onClick={() => setMessage((m) => m + v)} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-mono transition-colors">{v}</button>
                  ))}
                </span>
                <span>{message.length} chars</span>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(4)} disabled={!step4Ok} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Preview<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Preview</div>
            <div className="flex gap-6 items-start">
              {/* Phone mockup */}
              <div className="shrink-0 w-[220px] bg-slate-800 rounded-3xl p-3 shadow-xl">
                <div className="bg-green-600 rounded-t-2xl px-3 py-2 flex items-center gap-2 mb-px">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white">C</div>
                  <div>
                    <div className="text-[10px] font-bold text-white">{name || "Campaign"}</div>
                    <div className="text-[9px] text-green-200">Online</div>
                  </div>
                </div>
                <div className="bg-[#e5ddd5] rounded-b-2xl min-h-[220px] p-3">
                  <div className="bg-white rounded-lg rounded-tl-none p-2.5 shadow-sm max-w-[90%]">
                    <p className="text-[10px] text-slate-700 leading-relaxed whitespace-pre-wrap">{message.replace("{name}", "राहुल").replace("{booth}", "Booth 10").replace("{candidate}", "आपका नेता").replace("{date}", "11 Sep")}</p>
                    <div className="text-[9px] text-slate-400 text-right mt-1">9:00 AM ✓✓</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  {[["Name", name], ["Objective", objective], ["Audience", `${audienceLabel} (${audience.toLocaleString()} voters)`], ["Estimated Cost", `₹${estimatedCost.toLocaleString()}`], ["Remaining", `₹${remaining.toLocaleString()}`]].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500 font-medium">{k}</span>
                      <span className="font-semibold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(5)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">Request Approval<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Human Approval</div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0"><Icon d={I.shield} size={18} className="text-amber-600" /></div>
              <div>
                <div className="text-sm font-semibold text-amber-800 mb-1">Awaiting Human Review</div>
                <p className="text-xs text-amber-700 leading-relaxed mb-3">Before launching, a human reviewer must approve this campaign. This ensures compliance and accuracy of the message being sent to {audience.toLocaleString()} voters.</p>
                <button onClick={() => setShowApproval(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                  <Icon d={I.checkCircle} size={13} />Approve Campaign
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(4)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
            </div>
            {showApproval && <CampApprovalModal summary={{ name, channel: "WhatsApp", audience, cost: estimatedCost }} onApprove={() => { setShowApproval(false); setStep(6); }} onCancel={() => setShowApproval(false)} />}
          </>
        )}

        {step === 6 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Schedule</div>
            <div className="space-y-3">
              {[{ v: "now", label: "Send Immediately", desc: "Campaign starts right after launch" }, { v: "later", label: "Schedule for Later", desc: "Pick a specific date and time" }].map((opt) => (
                <button key={opt.v} onClick={() => setScheduleType(opt.v as "now" | "later")}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${scheduleType === opt.v ? "border-[#1d4ed8] bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${scheduleType === opt.v ? "border-[#1d4ed8] bg-[#1d4ed8]" : "border-slate-300"}`}>
                    {scheduleType === opt.v && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${scheduleType === opt.v ? "text-[#1d4ed8]" : "text-slate-700"}`}>{opt.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              ))}
              {scheduleType === "later" && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <FormField label="Date" required>
                    <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" />
                  </FormField>
                  <FormField label="Time" required>
                    <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" />
                  </FormField>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(5)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(7)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Ready to Launch</div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[["Campaign", name], ["Objective", objective], ["Channel", "WhatsApp"], ["Audience", `${audience.toLocaleString()} voters`], ["Schedule", scheduleType === "now" ? "Immediately" : `${scheduleDate} at ${scheduleTime}`], ["Estimated Cost", `₹${estimatedCost.toLocaleString()}`]].map(([k, v]) => (
                <div key={k} className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{k}</div>
                  <div className="text-xs font-semibold text-slate-800">{v}</div>
                </div>
              ))}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
              <Icon d={I.checkCircle} size={14} className="text-green-500 shrink-0" />
              <p className="text-xs text-green-700 font-medium">Campaign is approved and ready to launch.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(6)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setLaunched(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                <Icon d={I.zap} size={14} />Launch WhatsApp Campaign
              </button>
            </div>
          </>
        )}
      </div>
    </CampaignWizard>
  );
}

// ── SMS Campaign ──────────────────────────────────────────────────────────────

const SMS_STEPS = ["Name", "Audience", "Message", "Approval", "Schedule", "Launch"];

function SMSCampaign({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [audience, setAudience] = useState(0);
  const [audienceLabel, setAudienceLabel] = useState("All voters");
  const [message, setMessage] = useState("Dear {name}, election day is tomorrow! Visit Booth {booth} between 7AM–6PM and cast your vote. Together we build a better {area}. - {candidate}");
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [showApproval, setShowApproval] = useState(false);
  const [launched, setLaunched] = useState(false);

  const charCount = message.length;
  const smsPages = Math.ceil(charCount / 160);
  const estimatedCost = Math.round(audience * 0.1 * smsPages);

  const AUDIENCE_OPTS = [
    { label: "All voters", count: 18750 },
    { label: "Ward 1–3 voters", count: 6840 },
    { label: "Male voters", count: 9630 },
    { label: "Voters aged 35+", count: 11200 },
    { label: "Rural voters", count: 7400 },
  ];

  if (launched) return <CampSuccessScreen channel="SMS" name={name} audience={audience} cost={estimatedCost} onDone={onBack} />;

  return (
    <CampaignWizard channel="SMS" steps={SMS_STEPS} onBack={onBack}>
      <WizardSteps steps={SMS_STEPS} current={step} />
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">

        {step === 0 && (
          <>
            <FormField label="Campaign Name" required>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Election Day SMS Reminder"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400" />
            </FormField>
            <div className="flex justify-end">
              <button onClick={() => setStep(1)} disabled={name.trim().length < 3} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-3">Select Audience</div>
            <div className="space-y-2">
              {AUDIENCE_OPTS.map((a) => (
                <button key={a.label} onClick={() => { setAudienceLabel(a.label); setAudience(a.count); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-left transition-all ${audienceLabel === a.label ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <span className={`text-xs font-medium ${audienceLabel === a.label ? "text-blue-700" : "text-slate-700"}`}>{a.label}</span>
                  <span className={`text-xs font-bold ${audienceLabel === a.label ? "text-blue-700" : "text-slate-500"}`}>{a.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
            {audience > 0 && <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-xs flex justify-between"><span className="text-blue-700 font-medium">Estimated Cost</span><span className="font-bold text-blue-800">₹{estimatedCost.toLocaleString()} ({audience.toLocaleString()} × ₹{(0.1 * smsPages).toFixed(2)}/SMS)</span></div>}
            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(2)} disabled={!audience} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-3">Compose SMS</div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 resize-none font-mono leading-relaxed" />
            <div className="grid grid-cols-3 gap-3 text-center">
              {[["Characters", charCount, charCount > 160 ? "text-amber-600" : "text-slate-700"], ["SMS Parts", smsPages, "text-slate-700"], ["Audience Count", audience.toLocaleString(), "text-blue-700"]].map(([l, v, c]) => (
                <div key={l as string} className="bg-slate-50 border border-slate-200 rounded-lg py-2.5">
                  <div className={`text-base font-bold ${c}`}>{v}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {["{name}", "{booth}", "{area}", "{candidate}", "{date}"].map((v) => (
                <button key={v} onClick={() => setMessage((m) => m + v)} className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded font-mono transition-colors">{v}</button>
              ))}
              <span className="ml-auto text-[11px] text-slate-400">{160 - (charCount % 160)} chars remaining</span>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(3)} disabled={message.trim().length < 10} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Human Approval</div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0"><Icon d={I.shield} size={18} className="text-amber-600" /></div>
              <div>
                <div className="text-sm font-semibold text-amber-800 mb-1">Review Required</div>
                <p className="text-xs text-amber-700 leading-relaxed mb-3">An SMS to {audience.toLocaleString()} voters costs ₹{estimatedCost.toLocaleString()}. A human must approve before sending.</p>
                <div className="bg-white border border-amber-200 rounded-lg p-3 mb-3">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Message Preview</div>
                  <p className="text-xs text-slate-700 font-mono leading-relaxed">{message.replace("{name}", "Rahul").replace("{booth}", "Booth 10").replace("{area}", "Ward 1").replace("{candidate}", "Team").replace("{date}", "Sep 11")}</p>
                </div>
                <button onClick={() => setShowApproval(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                  <Icon d={I.checkCircle} size={13} />Approve Campaign
                </button>
              </div>
            </div>
            <div className="flex justify-start">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
            </div>
            {showApproval && <CampApprovalModal summary={{ name, channel: "SMS", audience, cost: estimatedCost }} onApprove={() => { setShowApproval(false); setStep(4); }} onCancel={() => setShowApproval(false)} />}
          </>
        )}

        {step === 4 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Schedule SMS Campaign</div>
            <div className="space-y-3">
              {[{ v: "now", label: "Send Immediately" }, { v: "later", label: "Schedule for Later" }].map((opt) => (
                <button key={opt.v} onClick={() => setScheduleType(opt.v as "now" | "later")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${scheduleType === opt.v ? "border-[#1d4ed8] bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${scheduleType === opt.v ? "border-[#1d4ed8] bg-[#1d4ed8]" : "border-slate-300"}`}>
                    {scheduleType === opt.v && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={`text-xs font-semibold ${scheduleType === opt.v ? "text-[#1d4ed8]" : "text-slate-700"}`}>{opt.label}</span>
                </button>
              ))}
              {scheduleType === "later" && (
                <FormField label="Scheduled Date & Time" required>
                  <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" />
                </FormField>
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(5)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">Review & Launch<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Ready to Launch</div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[["Campaign", name], ["Channel", "SMS"], ["Audience", `${audience.toLocaleString()} voters`], ["SMS Parts", smsPages.toString()], ["Schedule", scheduleType === "now" ? "Immediately" : scheduleDate], ["Estimated Cost", `₹${estimatedCost.toLocaleString()}`]].map(([k, v]) => (
                <div key={k} className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{k}</div>
                  <div className="text-xs font-semibold text-slate-800">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(4)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setLaunched(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">
                <Icon d={I.zap} size={14} />Launch SMS Campaign
              </button>
            </div>
          </>
        )}
      </div>
    </CampaignWizard>
  );
}

// ── Voice Campaign ────────────────────────────────────────────────────────────

const VOICE_STEPS = ["Name & Audience", "Language & Voice", "Script", "Approval", "Schedule", "Launch"];
const LANGUAGES = ["Hindi", "English", "Bhojpuri", "Awadhi", "Urdu", "Marathi", "Bengali", "Tamil", "Telugu", "Punjabi"];
const VOICE_OPTIONS: Record<string, string[]> = {
  Hindi: ["Rajesh (Male)", "Priya (Female)", "Arun (Male)", "Sunita (Female)"],
  English: ["James (Male)", "Anita (Female)", "Rahul (Male)"],
  Bhojpuri: ["Babu (Male)", "Radha (Female)"],
  default: ["Speaker 1 (Male)", "Speaker 2 (Female)"],
};

function VoiceCampaign({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [audience, setAudience] = useState(0);
  const [audienceLabel, setAudienceLabel] = useState("All voters");
  const [language, setLanguage] = useState("Hindi");
  const [voice, setVoice] = useState("Rajesh (Male)");
  const [script, setScript] = useState("नमस्ते {name} जी, मैं {candidate} आपसे कह रहा हूँ। कल मतदान का दिन है। आपका बूथ नंबर {booth} है। कृपया सुबह सात बजे से शाम छह बजे के बीच अपना मूल्यवान मत डालें। धन्यवाद। जय हिंद।");
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [showApproval, setShowApproval] = useState(false);
  const [launched, setLaunched] = useState(false);

  const AUDIENCE_OPTS = [
    { label: "All voters", count: 18750 },
    { label: "Senior voters (60+)", count: 3240 },
    { label: "Rural voters", count: 7400 },
    { label: "Non-smartphone voters", count: 4200 },
    { label: "Ward 5 voters", count: 1320 },
  ];

  const estimatedCost = Math.round(audience * 5);
  const voiceOpts = VOICE_OPTIONS[language] ?? VOICE_OPTIONS.default;

  const CALL_STATS = { successful: 0, rejected: 0, failed: 0, unanswered: 0 };

  if (launched) return <CampSuccessScreen channel="Voice" name={name} audience={audience} cost={estimatedCost} onDone={onBack} />;

  return (
    <CampaignWizard channel="Voice" steps={VOICE_STEPS} onBack={onBack}>
      <WizardSteps steps={VOICE_STEPS} current={step} />
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">

        {step === 0 && (
          <>
            <FormField label="Campaign Name" required>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Senior Voter Voice Blast"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400" />
            </FormField>
            <div className="text-xs font-semibold text-slate-700 mb-2">Select Audience</div>
            <div className="space-y-2">
              {AUDIENCE_OPTS.map((a) => (
                <button key={a.label} onClick={() => { setAudienceLabel(a.label); setAudience(a.count); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-left transition-all ${audienceLabel === a.label ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <span className={`text-xs font-medium ${audienceLabel === a.label ? "text-violet-700" : "text-slate-700"}`}>{a.label}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={audienceLabel === a.label ? "text-violet-700 font-bold" : "text-slate-500"}>{a.count.toLocaleString()} calls</span>
                    <span className={audienceLabel === a.label ? "text-violet-600" : "text-slate-400"}>≈ ₹{(a.count * 5).toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setStep(1)} disabled={!name.trim() || !audience} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-5">
              <FormField label="Language" required>
                <div className="relative">
                  <select value={language} onChange={(e) => { setLanguage(e.target.value); setVoice((VOICE_OPTIONS[e.target.value] ?? VOICE_OPTIONS.default)[0]); }}
                    className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 pr-8 cursor-pointer">
                    {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </FormField>
              <div />
            </div>
            <div className="text-xs font-semibold text-slate-700 mb-2">Select Voice</div>
            <div className="grid grid-cols-2 gap-2">
              {voiceOpts.map((v) => (
                <button key={v} onClick={() => setVoice(v)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${voice === v ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${voice === v ? "bg-violet-200 text-violet-700" : "bg-slate-100 text-slate-500"}`}>
                    {v.includes("Female") ? "♀" : "♂"}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${voice === v ? "text-violet-700" : "text-slate-700"}`}>{v}</div>
                    <div className="text-[10px] text-slate-400">{language}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-3">Voice Script</div>
            <textarea value={script} onChange={(e) => setScript(e.target.value)} rows={6}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 resize-none leading-relaxed" />
            <div className="flex items-center gap-2 flex-wrap">
              {["{name}", "{candidate}", "{booth}", "{date}"].map((v) => (
                <button key={v} onClick={() => setScript((s) => s + v)} className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded font-mono transition-colors">{v}</button>
              ))}
              <span className="ml-auto text-[11px] text-slate-400">{script.length} chars · ≈{Math.ceil(script.length / 100)}s call duration</span>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 flex items-center justify-between text-xs">
              <span className="text-violet-700 font-medium">Estimated Cost</span>
              <div className="text-right">
                <div className="font-bold text-violet-800">₹{estimatedCost.toLocaleString()}</div>
                <div className="text-violet-600 opacity-70">{audience.toLocaleString()} calls × ₹5.00/call</div>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(3)} disabled={script.trim().length < 10} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Next<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Human Approval</div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0"><Icon d={I.shield} size={18} className="text-amber-600" /></div>
              <div>
                <div className="text-sm font-semibold text-amber-800 mb-1">Voice Campaign Approval</div>
                <p className="text-xs text-amber-700 leading-relaxed mb-1">This will initiate {audience.toLocaleString()} outbound voice calls. Cost: ₹{estimatedCost.toLocaleString()}.</p>
                <p className="text-xs text-amber-600 leading-relaxed mb-3">Voice: <strong>{voice}</strong> · Language: <strong>{language}</strong></p>
                <button onClick={() => setShowApproval(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                  <Icon d={I.checkCircle} size={13} />Approve Voice Campaign
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[["Successful calls", "0", "text-green-600"], ["Rejected", "0", "text-red-600"], ["Failed", "0", "text-rose-600"], ["Unanswered", "0", "text-amber-600"]].map(([l, v, c]) => (
                <div key={l} className="bg-slate-50 border border-slate-200 rounded-lg py-3 text-center">
                  <div className={`text-xl font-bold ${c}`}>{v}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{l}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-start">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
            </div>
            {showApproval && <CampApprovalModal summary={{ name, channel: "Voice", audience, cost: estimatedCost }} onApprove={() => { setShowApproval(false); setStep(4); }} onCancel={() => setShowApproval(false)} />}
          </>
        )}

        {step === 4 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Schedule Calls</div>
            <div className="space-y-3">
              {[{ v: "now", label: "Start Immediately" }, { v: "later", label: "Schedule for Later" }].map((opt) => (
                <button key={opt.v} onClick={() => setScheduleType(opt.v as "now" | "later")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${scheduleType === opt.v ? "border-[#1d4ed8] bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${scheduleType === opt.v ? "border-[#1d4ed8] bg-[#1d4ed8]" : "border-slate-300"}`}>
                    {scheduleType === opt.v && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={`text-xs font-semibold ${scheduleType === opt.v ? "text-[#1d4ed8]" : "text-slate-700"}`}>{opt.label}</span>
                </button>
              ))}
              {scheduleType === "later" && (
                <FormField label="Scheduled Date & Time" required>
                  <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" />
                </FormField>
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setStep(5)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">Review<Icon d={I.chevronRight} size={14} /></button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="text-sm font-semibold text-slate-800 mb-4">Ready to Launch</div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[["Campaign", name], ["Channel", "Voice"], ["Audience", `${audience.toLocaleString()} calls`], ["Language", language], ["Voice", voice], ["Script Duration", `≈${Math.ceil(script.length / 100)}s`], ["Schedule", scheduleType === "now" ? "Immediately" : scheduleDate], ["Estimated Cost", `₹${estimatedCost.toLocaleString()}`]].map(([k, v]) => (
                <div key={k} className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{k}</div>
                  <div className="text-xs font-semibold text-slate-800 truncate">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(4)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Icon d={I.chevronLeft} size={14} />Back</button>
              <button onClick={() => setLaunched(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
                <Icon d={I.zap} size={14} />Launch Voice Campaign
              </button>
            </div>
          </>
        )}
      </div>
    </CampaignWizard>
  );
}

// ── Scripts Library ───────────────────────────────────────────────────────────

type ScriptStatus = "Active" | "Draft" | "Archived";
const SCRIPT_STATUS_V: Record<ScriptStatus, BadgeVariant> = { Active: "success", Draft: "warning", Archived: "muted" };

function ScriptsLibrary() {
  const [scripts, setScripts] = useState(SCRIPTS_DATA);
  const [activeChannel, setActiveChannel] = useState<CampChannel | "All">("All");
  const [search, setSearch] = useState("");
  const [viewScript, setViewScript] = useState<typeof SCRIPTS_DATA[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const displayed = scripts.filter((s) => {
    if (activeChannel !== "All" && s.channel !== activeChannel) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function duplicate(id: string) {
    const src = scripts.find((s) => s.id === id);
    if (!src) return;
    setScripts((p) => [...p, { ...src, id: `s${Date.now()}`, name: `${src.name} (Copy)`, status: "Draft" as const, created: "Today", updated: "Today" }]);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1000px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Campaigns</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Scripts</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Script Library</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage reusable message templates for all channels.</p>
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
            <Icon d={I.plus} size={14} />New Script
          </button>
        </div>

        {/* Channel tabs */}
        <div className="flex items-center gap-2">
          {(["All", "WhatsApp", "SMS", "Voice"] as const).map((ch) => {
            const count = ch === "All" ? scripts.length : scripts.filter((s) => s.channel === ch).length;
            const active = activeChannel === ch;
            const col = ch !== "All" ? CHANNEL_COLORS[ch as CampChannel] : null;
            return (
              <button key={ch} onClick={() => setActiveChannel(ch as CampChannel | "All")}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${active ? "bg-[#1d4ed8] text-white border-[#1d4ed8]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                {ch !== "All" && <div className={`w-1.5 h-1.5 rounded-full ${col!.dot}`} />}
                {ch} <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{count}</span>
              </button>
            );
          })}
          <div className="ml-auto relative">
            <Icon d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scripts…"
              className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 w-48 transition-colors" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Name", "Channel", "Language", "Created", "Updated", "Status", "Actions"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 6 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayed.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-slate-400">No scripts found.</td></tr>
              ) : displayed.map((s) => {
                const col = CHANNEL_COLORS[s.channel];
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-800">{s.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 max-w-[220px] truncate">{s.preview}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.bg} ${col.text} ${col.border}`}>{s.channel}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.language}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.created}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.updated}</td>
                    <td className="px-4 py-3"><Badge variant={SCRIPT_STATUS_V[s.status as ScriptStatus]}>{s.status}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => setViewScript(s)} className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                        <button className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Edit</button>
                        <button onClick={() => duplicate(s.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Duplicate"><Icon d={I.copy} size={12} /></button>
                        <button onClick={() => setDeleteId(s.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Icon d={I.trash} size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View script drawer */}
      {viewScript && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-slate-900/30" onClick={() => setViewScript(null)} />
          <div className="w-[440px] bg-white border-l border-slate-200 flex flex-col shadow-xl">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <div className="text-sm font-semibold text-slate-900">{viewScript.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CHANNEL_COLORS[viewScript.channel].bg} ${CHANNEL_COLORS[viewScript.channel].text} ${CHANNEL_COLORS[viewScript.channel].border}`}>{viewScript.channel}</span>
                  <Badge variant={SCRIPT_STATUS_V[viewScript.status as ScriptStatus]}>{viewScript.status}</Badge>
                </div>
              </div>
              <button onClick={() => setViewScript(null)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.x} size={14} /></button>
            </div>
            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
              <div className="space-y-2 text-xs">
                {[["Language", viewScript.language], ["Created", viewScript.created], ["Updated", viewScript.updated]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500 font-medium">{k}</span>
                    <span className="font-semibold text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Script Content</div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{viewScript.preview}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Variables</div>
                <div className="flex flex-wrap gap-1.5">
                  {["{name}", "{booth}", "{candidate}", "{date}"].map((v) => (
                    <span key={v} className="px-2 py-0.5 text-[11px] bg-blue-50 text-blue-700 border border-blue-200 rounded font-mono">{v}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-200 flex gap-2 shrink-0">
              <button className="flex-1 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Edit Script</button>
              <button onClick={() => { duplicate(viewScript.id); setViewScript(null); }} className="flex-1 py-2 text-xs font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors">Duplicate</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl w-[360px] p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center shrink-0"><Icon d={I.trash} size={16} className="text-red-500" /></div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Delete Script</div>
                <p className="text-xs text-slate-500 mt-1">This script will be permanently deleted.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setScripts((p) => p.filter((s) => s.id !== deleteId)); setDeleteId(null); }} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Campaign Analytics ────────────────────────────────────────────────────────

const MSGS_OVER_TIME = [
  { date: "Jul 20", whatsapp: 5200, sms: 0,    voice: 0   },
  { date: "Jul 28", whatsapp: 0,    sms: 0,    voice: 418 },
  { date: "Aug 1",  whatsapp: 1180, sms: 0,    voice: 0   },
  { date: "Aug 5",  whatsapp: 0,    sms: 1920, voice: 0   },
  { date: "Aug 8",  whatsapp: 840,  sms: 0,    voice: 0   },
];

const CHANNEL_PIE = [
  { name: "WhatsApp", value: 7220, color: "#22c55e" },
  { name: "SMS",      value: 1920, color: "#3b82f6" },
  { name: "Voice",    value: 418,  color: "#8b5cf6" },
];

const COST_BY_CAMPAIGN = [
  { name: "Manifesto WA",   cost: 2600 },
  { name: "Voice Blast",    cost: 2090 },
  { name: "Booth Outreach", cost: 590  },
  { name: "Thank You WA",   cost: 420  },
  { name: "SMS Push",       cost: 384  },
];

const AI_INSIGHTS = [
  { type: "success",  icon: I.star,     title: "Top Performer",       body: "Manifesto WhatsApp Broadcast achieved 95.8% delivery rate — the highest across all campaigns." },
  { type: "warning",  icon: I.zap,      title: "Underperforming",     body: "Last Mile Voter SMS Push is paused at 50% send with 5.7% failure rate. Consider resuming off-peak." },
  { type: "danger",   icon: I.shield,   title: "Low Balance Alert",   body: "WhatsApp credits are at 59.1% used. At current spend rate, balance runs out in ≈12 days." },
  { type: "info",     icon: I.sparkle,  title: "AI Recommendation",   body: "Voice campaigns show highest engagement for voters aged 60+. Increase Voice budget by 20% for senior outreach." },
  { type: "danger",   icon: I.reports,  title: "High Spend Alert",    body: "Voice cost per voter is ₹5.00 vs WhatsApp ₹0.50. Review ROI before next Voice campaign launch." },
  { type: "success",  icon: I.checkCircle, title: "Recommended Action", body: "Schedule Thank You WhatsApp to all voters post-election. Estimated reach: 18,750 voters at ₹9,375." },
];

const INSIGHT_STYLES: Record<string, { bg: string; border: string; icon: string; title: string }> = {
  success: { bg: "bg-green-50",  border: "border-green-200",  icon: "text-green-500",  title: "text-green-800" },
  warning: { bg: "bg-amber-50",  border: "border-amber-200",  icon: "text-amber-500",  title: "text-amber-800" },
  danger:  { bg: "bg-red-50",    border: "border-red-200",    icon: "text-red-500",    title: "text-red-800"   },
  info:    { bg: "bg-blue-50",   border: "border-blue-200",   icon: "text-blue-500",   title: "text-blue-800"  },
};

function CampAnalytics() {
  const totalSent = CAMPAIGNS_DATA.reduce((s, c) => s + c.sent, 0);
  const totalDelivered = CAMPAIGNS_DATA.reduce((s, c) => s + c.delivered, 0);
  const totalFailed = CAMPAIGNS_DATA.reduce((s, c) => s + c.failed, 0);
  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0";
  const failureRate = totalSent > 0 ? ((totalFailed / totalSent) * 100).toFixed(1) : "0";
  const voiceCalls = CAMPAIGNS_DATA.filter((c) => c.channel === "Voice").reduce((s, c) => s + c.sent, 0);
  const voiceDelivered = CAMPAIGNS_DATA.filter((c) => c.channel === "Voice").reduce((s, c) => s + c.delivered, 0);
  const voiceRate = voiceCalls > 0 ? ((voiceDelivered / voiceCalls) * 100).toFixed(1) : "0";
  const totalCost = CAMPAIGNS_DATA.reduce((s, c) => s + c.cost, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Campaigns</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Analytics</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Campaign Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">Performance insights across all channels and campaigns.</p>
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <Icon d={I.download} size={14} />Export Report
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: "Total Sent",     value: totalSent.toLocaleString(),       color: "text-slate-900" },
            { label: "Delivered",      value: totalDelivered.toLocaleString(),   color: "text-green-700" },
            { label: "Failed",         value: totalFailed.toLocaleString(),      color: "text-red-600"   },
            { label: "Delivery Rate",  value: `${deliveryRate}%`,               color: "text-blue-700"  },
            { label: "Failure Rate",   value: `${failureRate}%`,                color: "text-rose-600"  },
            { label: "Total Cost",     value: `₹${totalCost.toLocaleString()}`, color: "text-slate-900" },
          ].map((k) => (
            <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{k.label}</div>
              <div className={`text-xl font-bold tracking-tight ${k.color}`}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-3 gap-4">
          {/* Messages over time */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Messages Over Time</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MSGS_OVER_TIME} barCategoryGap="30%">
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="whatsapp" name="WhatsApp" fill="#22c55e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="sms" name="SMS" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="voice" name="Voice" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              {[["WhatsApp", "#22c55e"], ["SMS", "#3b82f6"], ["Voice", "#8b5cf6"]].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c as string }} />{l}
                </div>
              ))}
            </div>
          </div>

          {/* Channel distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Channel Usage</div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={CHANNEL_PIE} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                  {CHANNEL_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => Number(v).toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {CHANNEL_PIE.map((p) => {
                const total = CHANNEL_PIE.reduce((s, x) => s + x.value, 0);
                const pct = ((p.value / total) * 100).toFixed(0);
                return (
                  <div key={p.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} /><span className="text-slate-500">{p.name}</span></div>
                    <div className="flex items-center gap-2"><span className="font-semibold text-slate-700">{p.value.toLocaleString()}</span><span className="text-slate-400">{pct}%</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Delivery + Failure rates */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Delivery vs Failure Rate by Channel</div>
            <div className="space-y-4">
              {(["WhatsApp", "SMS", "Voice"] as CampChannel[]).map((ch) => {
                const camps = CAMPAIGNS_DATA.filter((c) => c.channel === ch);
                const sent = camps.reduce((s, c) => s + c.sent, 0);
                const del = camps.reduce((s, c) => s + c.delivered, 0);
                const fail = camps.reduce((s, c) => s + c.failed, 0);
                const dr = sent > 0 ? (del / sent) * 100 : 0;
                const fr = sent > 0 ? (fail / sent) * 100 : 0;
                const col = CHANNEL_COLORS[ch];
                return (
                  <div key={ch}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-semibold ${col.text}`}>{ch}</span>
                      <div className="flex gap-4 text-[11px]">
                        <span className="text-green-600 font-semibold">{dr.toFixed(1)}% delivered</span>
                        <span className="text-red-500">{fr.toFixed(1)}% failed</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-green-500 rounded-l-full" style={{ width: `${dr}%` }} />
                      <div className="h-full bg-red-400" style={{ width: `${fr}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost by campaign */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Campaign Cost Breakdown</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={COST_BY_CAMPAIGN} layout="vertical" barCategoryGap="25%">
                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                <Bar dataKey="cost" name="Cost" fill="#1d4ed8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Voice call success */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Voice Call Outcomes</div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Successful",  value: 381,  color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200", pct: "91.1%" },
              { label: "Rejected",    value: 18,   color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",   pct: "4.3%"  },
              { label: "Unanswered",  value: 12,   color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200", pct: "2.9%"  },
              { label: "Failed",      value: 7,    color: "text-slate-500",  bg: "bg-slate-50",  border: "border-slate-200", pct: "1.7%"  },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${s.color} mb-0.5`}>{s.value}</div>
                <div className={`text-xs font-semibold ${s.color} opacity-80`}>{s.pct}</div>
                <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon d={I.sparkle} size={14} className="text-[#1d4ed8]" />
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide">AI Insights & Recommendations</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {AI_INSIGHTS.map((ins, i) => {
              const st = INSIGHT_STYLES[ins.type];
              return (
                <div key={i} className={`${st.bg} border ${st.border} rounded-xl p-4 flex items-start gap-3`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white/60`}>
                    <Icon d={ins.icon} size={13} className={st.icon} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${st.title} mb-1`}>{ins.title}</div>
                    <p className={`text-[11px] leading-relaxed ${st.title} opacity-80`}>{ins.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WORKERS MODULE ───────────────────────────────────────────────────────────

type WorkerStatus = "Active" | "Inactive";
const WORKER_STATUS_V: Record<WorkerStatus, BadgeVariant> = { Active: "success", Inactive: "danger" };

interface WorkerRecord {
  id: string;
  srNo: number;
  name: string;
  contact: string;
  email: string;
  prabhaag: string;
  booth: string;
  voterRangeFrom: number;
  voterRangeTo: number;
  status: WorkerStatus;
  pdfImport: boolean;
  excelImport: boolean;
  aiMode: boolean;
  dataImport: "Pending" | "Complete" | "None";
  createdDate: string;
  lastActivity: string;
  uniqueKey: string;
  reactivationKey: string;
}

const PRABHAAG_LIST = ["Prabhaag 1 — Hazratganj", "Prabhaag 2 — Gomti Nagar", "Prabhaag 3 — Alambagh", "Prabhaag 4 — Chinhat", "Prabhaag 5 — Indira Nagar"];
const BOOTH_MAP: Record<string, string[]> = {
  "Prabhaag 1 — Hazratganj": ["Booth 1", "Booth 2", "Booth 3", "Booth 4", "Booth 5"],
  "Prabhaag 2 — Gomti Nagar": ["Booth 6", "Booth 7", "Booth 8", "Booth 9", "Booth 10"],
  "Prabhaag 3 — Alambagh": ["Booth 11", "Booth 12", "Booth 13", "Booth 14"],
  "Prabhaag 4 — Chinhat": ["Booth 15", "Booth 16", "Booth 17"],
  "Prabhaag 5 — Indira Nagar": ["Booth 18", "Booth 19", "Booth 20", "Booth 21"],
};

const WORKERS_DATA: WorkerRecord[] = [
  { id: "w1", srNo: 1, name: "Rajesh Kumar", contact: "9812345678", email: "rajesh.k@bjplko.in", prabhaag: "Prabhaag 1 — Hazratganj", booth: "Booth 2", voterRangeFrom: 1, voterRangeTo: 250, status: "Active", pdfImport: true, excelImport: true, aiMode: true, dataImport: "Complete", createdDate: "12 Jan 2024", lastActivity: "10 Aug 2024", uniqueKey: "WRK-A1B2C3", reactivationKey: "RAK-X9Y8Z7" },
  { id: "w2", srNo: 2, name: "Meena Sharma", contact: "9823456789", email: "meena.s@bjplko.in", prabhaag: "Prabhaag 2 — Gomti Nagar", booth: "Booth 7", voterRangeFrom: 1, voterRangeTo: 300, status: "Active", pdfImport: true, excelImport: false, aiMode: false, dataImport: "Complete", createdDate: "14 Jan 2024", lastActivity: "09 Aug 2024", uniqueKey: "WRK-D4E5F6", reactivationKey: "RAK-W6V5U4" },
  { id: "w3", srNo: 3, name: "Suresh Patel", contact: "9834567890", email: "suresh.p@bjplko.in", prabhaag: "Prabhaag 1 — Hazratganj", booth: "Booth 4", voterRangeFrom: 251, voterRangeTo: 480, status: "Active", pdfImport: false, excelImport: true, aiMode: true, dataImport: "Pending", createdDate: "20 Jan 2024", lastActivity: "08 Aug 2024", uniqueKey: "WRK-G7H8I9", reactivationKey: "RAK-T3S2R1" },
  { id: "w4", srNo: 4, name: "Anita Singh", contact: "9845678901", email: "anita.si@bjplko.in", prabhaag: "Prabhaag 3 — Alambagh", booth: "Booth 12", voterRangeFrom: 1, voterRangeTo: 220, status: "Inactive", pdfImport: true, excelImport: true, aiMode: false, dataImport: "None", createdDate: "05 Feb 2024", lastActivity: "15 Jul 2024", uniqueKey: "WRK-J1K2L3", reactivationKey: "RAK-Q0P9O8" },
  { id: "w5", srNo: 5, name: "Vijay Gupta", contact: "9856789012", email: "vijay.g@bjplko.in", prabhaag: "Prabhaag 4 — Chinhat", booth: "Booth 16", voterRangeFrom: 1, voterRangeTo: 350, status: "Active", pdfImport: true, excelImport: true, aiMode: true, dataImport: "Complete", createdDate: "10 Feb 2024", lastActivity: "10 Aug 2024", uniqueKey: "WRK-M4N5O6", reactivationKey: "RAK-N7M6L5" },
  { id: "w6", srNo: 6, name: "Kavita Yadav", contact: "9867890123", email: "kavita.y@bjplko.in", prabhaag: "Prabhaag 5 — Indira Nagar", booth: "Booth 19", voterRangeFrom: 1, voterRangeTo: 280, status: "Active", pdfImport: false, excelImport: false, aiMode: false, dataImport: "Pending", createdDate: "15 Mar 2024", lastActivity: "07 Aug 2024", uniqueKey: "WRK-P7Q8R9", reactivationKey: "RAK-K4J3I2" },
  { id: "w7", srNo: 7, name: "Mohan Das", contact: "9878901234", email: "mohan.d@bjplko.in", prabhaag: "Prabhaag 2 — Gomti Nagar", booth: "Booth 9", voterRangeFrom: 101, voterRangeTo: 390, status: "Inactive", pdfImport: false, excelImport: true, aiMode: false, dataImport: "None", createdDate: "01 Apr 2024", lastActivity: "20 Jun 2024", uniqueKey: "WRK-S1T2U3", reactivationKey: "RAK-H1G0F9" },
];

const DATA_IMPORT_V: Record<string, BadgeVariant> = { Complete: "success", Pending: "warning", None: "muted" };

function genKey(prefix: string) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return prefix + "-" + Array.from({ length: 9 }, () => chars[Math.floor(Math.random() * chars.length)]).join("").replace(/(.{3})(.{3})(.{3})/, "$1$2$3");
}

// ── Workers Board ─────────────────────────────────────────────────────────────

function WorkersBoard({ onNav }: { onNav: (k: string, data?: unknown) => void }) {
  const [workers, setWorkers] = useState<WorkerRecord[]>(WORKERS_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkerStatus | "">("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const displayed = workers.filter((w) => {
    if (statusFilter && w.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return w.name.toLowerCase().includes(q) || w.contact.includes(q) || w.booth.toLowerCase().includes(q) || w.prabhaag.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: workers.length,
    active: workers.filter((w) => w.status === "Active").length,
    inactive: workers.filter((w) => w.status === "Inactive").length,
    aiEnabled: workers.filter((w) => w.aiMode).length,
  };

  function toggleStatus(id: string) {
    setWorkers((p) => p.map((w) => w.id === id ? { ...w, status: w.status === "Active" ? "Inactive" : "Active" } : w));
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[1160px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-slate-600 font-medium">Election Operations</span>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">Workers</span>
        </nav>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Workers</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage field workers, their booth assignments and access permissions.</p>
          </div>
          <button onClick={() => onNav("worker-add")} className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded hover:bg-blue-700 transition-colors">
            <Icon d={I.plus} size={14} />Add Worker
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Workers", value: stats.total, color: "text-slate-900", bg: "bg-white", border: "border-slate-200", icon: I.workers },
            { label: "Active", value: stats.active, color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: I.checkCircle },
            { label: "Inactive", value: stats.inactive, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: I.xCircle },
            { label: "AI Enabled", value: stats.aiEnabled, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: I.sparkle },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 flex items-center justify-between`}>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{s.label}</div>
                <div className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</div>
              </div>
              <Icon d={s.icon} size={20} className="text-slate-200" />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Icon d={I.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search worker, contact, booth…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as WorkerStatus | "")}
              className={`appearance-none text-sm border rounded px-3 py-2 pr-8 focus:outline-none cursor-pointer transition-colors ${statusFilter ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              <option value="">All Status</option>
              <option>Active</option><option>Inactive</option>
            </select>
            <Icon d={I.chevronDown} size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {(search || statusFilter) && <button onClick={() => { setSearch(""); setStatusFilter(""); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear</button>}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">{displayed.length} workers</span>
            <div className="flex border border-slate-200 rounded overflow-hidden">
              <button onClick={() => setViewMode("table")} className={`px-2.5 py-1.5 transition-colors ${viewMode === "table" ? "bg-[#1d4ed8] text-white" : "text-slate-400 hover:bg-slate-50"}`}><Icon d={I.list} size={13} /></button>
              <button onClick={() => setViewMode("card")} className={`px-2.5 py-1.5 transition-colors ${viewMode === "card" ? "bg-[#1d4ed8] text-white" : "text-slate-400 hover:bg-slate-50"}`}><Icon d={I.grid} size={13} /></button>
            </div>
          </div>
        </div>

        {/* Table view */}
        {viewMode === "table" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Sr", "Worker Name", "Contact", "Prabhaag", "Booth", "Voter Range", "Status", "Data Import", "Created", "Actions"].map((h, i) => (
                    <th key={h} className={`px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wide ${i >= 9 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayed.length === 0 ? (
                  <tr><td colSpan={10} className="py-12 text-center text-sm text-slate-400">No workers found.</td></tr>
                ) : displayed.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-xs text-slate-400 font-mono">{w.srNo}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-bold text-slate-600 shrink-0">
                          {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{w.name}</div>
                          <div className="text-[10px] text-slate-400">{w.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs font-mono text-slate-600">{w.contact}</td>
                    <td className="px-3 py-3 text-xs text-slate-600 max-w-[130px] truncate">{w.prabhaag.split(" — ")[0]}</td>
                    <td className="px-3 py-3 text-xs font-medium text-slate-700">{w.booth}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{w.voterRangeFrom}–{w.voterRangeTo}</td>
                    <td className="px-3 py-3"><Badge variant={WORKER_STATUS_V[w.status]}>{w.status}</Badge></td>
                    <td className="px-3 py-3"><Badge variant={DATA_IMPORT_V[w.dataImport]}>{w.dataImport}</Badge></td>
                    <td className="px-3 py-3 text-xs text-slate-400 whitespace-nowrap">{w.createdDate}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex items-center gap-0.5">
                        <button onClick={() => onNav("worker-detail", w)} className="px-2 py-1 text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                        <button onClick={() => onNav("worker-add", w)} className="px-2 py-1 text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Edit</button>
                        <button onClick={() => toggleStatus(w.id)} className={`px-2 py-1 text-[10px] font-semibold border rounded transition-colors ${w.status === "Active" ? "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100" : "text-green-700 bg-green-50 border-green-200 hover:bg-green-100"}`}>{w.status === "Active" ? "Deact." : "Activ."}</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Access"><Icon d={I.key} size={11} /></button>
                        <button onClick={() => setDeleteId(w.id)} className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Icon d={I.trash} size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Card view */}
        {viewMode === "card" && (
          <div className="grid grid-cols-3 gap-4">
            {displayed.map((w) => (
              <div key={w.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-600">
                      {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{w.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{w.contact}</div>
                    </div>
                  </div>
                  <Badge variant={WORKER_STATUS_V[w.status]}>{w.status}</Badge>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-3 mb-3">
                  <div className="flex justify-between"><span>Prabhaag</span><span className="font-medium text-slate-700 truncate max-w-[130px]">{w.prabhaag.split(" — ")[0]}</span></div>
                  <div className="flex justify-between"><span>Booth</span><span className="font-medium text-slate-700">{w.booth}</span></div>
                  <div className="flex justify-between"><span>Voter Range</span><span className="font-mono text-slate-700">{w.voterRangeFrom}–{w.voterRangeTo}</span></div>
                  <div className="flex justify-between"><span>Data Import</span><Badge variant={DATA_IMPORT_V[w.dataImport]}>{w.dataImport}</Badge></div>
                  <div className="flex justify-between"><span>AI Mode</span><span className={w.aiMode ? "text-blue-600 font-semibold" : "text-slate-400"}>{w.aiMode ? "Enabled" : "Off"}</span></div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => onNav("worker-detail", w)} className="flex-1 py-1.5 text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                  <button onClick={() => onNav("worker-add", w)} className="flex-1 py-1.5 text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Edit</button>
                  <button onClick={() => setDeleteId(w.id)} className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Icon d={I.trash} size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl w-[360px] p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center shrink-0"><Icon d={I.trash} size={16} className="text-red-500" /></div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Delete Worker</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">This worker and all their access credentials will be permanently removed.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setWorkers((p) => p.filter((w) => w.id !== deleteId)); setDeleteId(null); }} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add / Edit Worker ─────────────────────────────────────────────────────────

function AddWorker({ initial, onBack, onSave }: { initial?: WorkerRecord; onBack: () => void; onSave?: (w: WorkerRecord) => void }) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [prabhaag, setPrabhaag] = useState(initial?.prabhaag ?? "");
  const [booth, setBooth] = useState(initial?.booth ?? "");
  const [rangeFrom, setRangeFrom] = useState(initial?.voterRangeFrom?.toString() ?? "1");
  const [rangeTo, setRangeTo] = useState(initial?.voterRangeTo?.toString() ?? "");
  const [status, setStatus] = useState<WorkerStatus>(initial?.status ?? "Active");
  const [pdfImport, setPdfImport] = useState(initial?.pdfImport ?? false);
  const [excelImport, setExcelImport] = useState(initial?.excelImport ?? false);
  const [aiMode, setAiMode] = useState(initial?.aiMode ?? false);
  const [uniqueKey] = useState(initial?.uniqueKey ?? genKey("WRK"));
  const [reactivationKey] = useState(initial?.reactivationKey ?? genKey("RAK"));
  const [saved, setSaved] = useState(false);

  const availableBooths = prabhaag ? (BOOTH_MAP[prabhaag] ?? []) : [];

  const valid = name.trim() && contact.trim().length === 10 && prabhaag && booth && rangeTo;

  function handleSave() {
    if (!valid) return;
    setSaved(true);
    setTimeout(() => { onBack(); }, 900);
  }

  function Toggle({ label, value, onChange, desc }: { label: string; value: boolean; onChange: (v: boolean) => void; desc?: string }) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
        <div>
          <div className="text-xs font-medium text-slate-800">{label}</div>
          {desc && <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>}
        </div>
        <button onClick={() => onChange(!value)} className={`w-9 h-5 rounded-full border-2 relative transition-all ${value ? "bg-[#1d4ed8] border-[#1d4ed8]" : "bg-slate-100 border-slate-200"}`}>
          <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${value ? "left-[18px]" : "left-0.5"}`} />
        </button>
      </div>
    );
  }

  if (saved) return (
    <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Icon d={I.checkCircle} size={24} className="text-green-500" /></div>
        <div className="text-base font-semibold text-slate-900 mb-1">Worker {isEdit ? "updated" : "created"}!</div>
        <p className="text-sm text-slate-500">Returning to workers list…</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[760px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <button onClick={onBack} className="hover:text-slate-600">Workers</button>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">{isEdit ? `Edit — ${initial.name}` : "Add Worker"}</span>
        </nav>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{isEdit ? "Edit Worker" : "Add Worker"}</h1>
        </div>

        {/* Worker Information */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Worker Information</span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField label="Full Name" required>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
              </FormField>
            </div>
            <FormField label="Contact Number" required>
              <input value={contact} onChange={(e) => setContact(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
            </FormField>
            <FormField label="Email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="worker@example.com" type="email"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
            </FormField>
          </div>
        </div>

        {/* Assignment */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Assignment</span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField label="Prabhaag" required>
                <div className="relative">
                  <select value={prabhaag} onChange={(e) => { setPrabhaag(e.target.value); setBooth(""); }}
                    className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 pr-8 cursor-pointer">
                    <option value="">Select Prabhaag first…</option>
                    {PRABHAAG_LIST.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </FormField>
            </div>
            <FormField label="Booth" required>
              <div className="relative">
                <select value={booth} onChange={(e) => setBooth(e.target.value)} disabled={!prabhaag}
                  className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 pr-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="">{prabhaag ? "Select Booth…" : "Select Prabhaag first"}</option>
                  {availableBooths.map((b) => <option key={b}>{b}</option>)}
                </select>
                <Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </FormField>
            <div className="col-span-2">
              <div className="text-xs font-medium text-slate-700 mb-1.5">Voter Serial Number Range <span className="text-red-500">*</span></div>
              <div className="flex items-center gap-3">
                <input value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value.replace(/\D/g, ""))} placeholder="From"
                  className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400" />
                <span className="text-slate-400 text-sm">—</span>
                <input value={rangeTo} onChange={(e) => setRangeTo(e.target.value.replace(/\D/g, ""))} placeholder="To"
                  className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400" />
                {rangeFrom && rangeTo && <span className="text-xs text-slate-500 shrink-0 font-medium">{Math.max(0, parseInt(rangeTo) - parseInt(rangeFrom) + 1)} voters</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Access */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Access Permissions</span>
          </div>
          <div className="px-5">
            <Toggle label="Active Account" value={status === "Active"} onChange={(v) => setStatus(v ? "Active" : "Inactive")} desc="Worker can log in and use the app" />
            <Toggle label="PDF Import" value={pdfImport} onChange={setPdfImport} desc="Allow importing voter data from PDF files" />
            <Toggle label="Excel Import" value={excelImport} onChange={setExcelImport} desc="Allow importing voter data from Excel files" />
            <Toggle label="AI Mode Access" value={aiMode} onChange={setAiMode} desc="Grant access to AI-powered search and insights" />
          </div>
        </div>

        {/* Credentials */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Credentials</span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <FormField label="Unique Key">
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-700">{uniqueKey}</div>
                <button onClick={() => navigator.clipboard?.writeText(uniqueKey)} className="w-8 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors" title="Copy"><Icon d={I.copy} size={13} /></button>
              </div>
            </FormField>
            <FormField label="Reactivation Key">
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-700">{reactivationKey}</div>
                <button onClick={() => navigator.clipboard?.writeText(reactivationKey)} className="w-8 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors" title="Copy"><Icon d={I.copy} size={13} /></button>
              </div>
            </FormField>
          </div>
          <div className="px-5 pb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
              <Icon d={I.info} size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 leading-relaxed">Share credentials securely with the worker. Reactivation key is used to restore access if the account is deactivated.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pb-6">
          <button onClick={onBack} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={!valid}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">
            <Icon d={I.checkCircle} size={14} />{isEdit ? "Save Changes" : "Save Worker"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Worker Details ────────────────────────────────────────────────────────────

function WorkerDetail({ worker, onBack }: { worker: WorkerRecord; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "assignment" | "access" | "activity" | "credentials">("overview");

  const TABS: { key: typeof activeTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "assignment", label: "Assignment" },
    { key: "access", label: "Access" },
    { key: "activity", label: "Activity" },
    { key: "credentials", label: "Credentials" },
  ];

  const ACTIVITY_LOG = [
    { action: "Login", detail: "Logged in from Android device", time: "10 Aug 2024, 9:00 AM" },
    { action: "Data Import", detail: "Imported 48 voter records via Excel", time: "10 Aug 2024, 9:15 AM" },
    { action: "Voter Updated", detail: "Updated mobile for voter serial #124", time: "10 Aug 2024, 10:42 AM" },
    { action: "AI Search", detail: "Searched for voters with Scheme = PM Awas", time: "09 Aug 2024, 3:30 PM" },
    { action: "Login", detail: "Logged in from Android device", time: "09 Aug 2024, 9:00 AM" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[900px] mx-auto px-6 py-6 space-y-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <button onClick={onBack} className="hover:text-slate-600">Workers</button>
          <Icon d={I.chevronRight} size={12} />
          <span className="text-slate-600 font-medium">{worker.name}</span>
        </nav>

        {/* Header card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-lg font-bold text-slate-600 shrink-0">
            {worker.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-base font-semibold text-slate-900">{worker.name}</span>
              <Badge variant={WORKER_STATUS_V[worker.status]}>{worker.status}</Badge>
              {worker.aiMode && <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full"><Icon d={I.sparkle} size={9} />AI</span>}
            </div>
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Icon d={I.phone} size={11} />{worker.contact}</span>
              <span className="flex items-center gap-1"><Icon d={I.mail} size={11} />{worker.email}</span>
              <span className="flex items-center gap-1"><Icon d={I.calendar} size={11} />Since {worker.createdDate}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"><Icon d={I.edit} size={11} />Edit</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-0">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px ${activeTab === t.key ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-2 gap-4">
            {[["Full Name", worker.name], ["Contact", worker.contact], ["Email", worker.email], ["Status", worker.status], ["Data Import", worker.dataImport], ["Created Date", worker.createdDate], ["Last Activity", worker.lastActivity], ["Sr No", worker.srNo.toString()]].map(([k, v]) => (
              <div key={k} className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{k}</div>
                <div className="text-sm font-semibold text-slate-800">{v}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "assignment" && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-3">Booth Assignment</div>
            <div className="grid grid-cols-2 gap-4">
              {[["Prabhaag", worker.prabhaag], ["Booth", worker.booth], ["Voter Range From", worker.voterRangeFrom.toString()], ["Voter Range To", worker.voterRangeTo.toString()], ["Total Voters", (worker.voterRangeTo - worker.voterRangeFrom + 1).toString()]].map(([k, v]) => (
                <div key={k} className={k === "Prabhaag" ? "col-span-2" : ""}>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{k}</div>
                  <div className="text-sm font-semibold text-slate-800">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "access" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Access Permissions</span>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { label: "Account Status", value: worker.status, granted: worker.status === "Active" },
                { label: "PDF Import", value: worker.pdfImport ? "Enabled" : "Disabled", granted: worker.pdfImport },
                { label: "Excel Import", value: worker.excelImport ? "Enabled" : "Disabled", granted: worker.excelImport },
                { label: "AI Mode", value: worker.aiMode ? "Enabled" : "Disabled", granted: worker.aiMode },
              ].map((item) => (
                <div key={item.label} className="px-5 py-3.5 flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <span className={`text-xs font-semibold ${item.granted ? "text-green-700" : "text-slate-400"}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Recent Activity</span>
            </div>
            <div className="divide-y divide-slate-100">
              {ACTIVITY_LOG.map((a, i) => (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#1d4ed8] rounded-full mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-800">{a.action}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{a.detail}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 whitespace-nowrap">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "credentials" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Worker Credentials</span>
            </div>
            <div className="p-5 space-y-4">
              {[["Unique Key", worker.uniqueKey], ["Reactivation Key", worker.reactivationKey]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{k}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-700">{v}</div>
                    <button onClick={() => navigator.clipboard?.writeText(v)} className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><Icon d={I.copy} size={13} /></button>
                  </div>
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
                <Icon d={I.info} size={13} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">Keep these credentials secure. Never share via public channels. Regenerate if compromised.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE MODULE ────────────────────────────────────────────────────────────

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Arun Mehta");
  const [email, setEmail] = useState("arun.mehta@bjplko.in");
  const [mobile, setMobile] = useState("9800000001");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  }

  const SESSIONS = [
    { device: "Chrome on macOS", ip: "103.12.45.6", location: "Lucknow, UP", time: "Active now", current: true },
    { device: "Android App (v3.2.1)", ip: "106.67.89.12", location: "Lucknow, UP", time: "2 hours ago", current: false },
    { device: "Chrome on Windows", ip: "49.204.11.8", location: "New Delhi", time: "1 day ago", current: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-[800px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Profile</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your personal information and account security.</p>
          </div>
          {saved && <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg"><Icon d={I.checkCircle} size={13} />Changes saved</div>}
        </div>

        {/* Profile card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Profile Information</span>
          </div>
          <div className="p-5">
            <div className="flex items-start gap-6 mb-5 pb-5 border-b border-slate-100">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">AM</div>
                <button className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#1d4ed8] rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
                  <Icon d={I.edit} size={10} className="text-white" />
                </button>
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <FormField label="Full Name" required>
                        <input value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" />
                      </FormField>
                    </div>
                    <FormField label="Email">
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" />
                    </FormField>
                    <FormField label="Mobile">
                      <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" />
                    </FormField>
                  </div>
                ) : (
                  <>
                    <div className="text-base font-semibold text-slate-900 mb-0.5">{name}</div>
                    <div className="text-sm text-slate-500 mb-2">{email}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Icon d={I.phone} size={11} />{mobile}</span>
                      <span className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-medium"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" />Email Verified</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              {[["User ID", "USR-A8B4C2D1"], ["Joined", "12 Jan 2024"], ["Role", "Owner"]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{k}</div>
                  <div className="font-semibold text-slate-800">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={handleSave} className="px-5 py-2 text-xs font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"><Icon d={I.checkCircle} size={12} />Save Changes</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"><Icon d={I.edit} size={12} />Edit Profile</button>
              )}
            </div>
          </div>
        </div>

        {/* Organization membership */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Organization Membership</span>
          </div>
          <div className="divide-y divide-slate-100">
            {[{ org: "Lucknow Central Unit", role: "Owner", joined: "12 Jan 2024", party: "BJP" }].map((o) => (
              <div key={o.org} className="px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-bold text-orange-700 shrink-0">{o.org[0]}</div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-800">{o.org}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{o.party} · Joined {o.joined}</div>
                </div>
                <Badge variant="info">{o.role}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Security</span>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Password</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Last changed 45 days ago</div>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"><Icon d={I.lock} size={11} />Change Password</button>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-slate-800">Active Sessions</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{SESSIONS.length} sessions</div>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5"><Icon d={I.logout} size={11} />Logout Other Devices</button>
              </div>
              <div className="space-y-2">
                {SESSIONS.map((s, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${s.current ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-3">
                      <Icon d={I.monitor} size={14} className={s.current ? "text-blue-600" : "text-slate-400"} />
                      <div>
                        <div className={`text-xs font-medium ${s.current ? "text-blue-800" : "text-slate-700"}`}>{s.device} {s.current && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full ml-1">This device</span>}</div>
                        <div className="text-[10px] text-slate-400">{s.ip} · {s.location}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400">{s.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS MODULE ──────────────────────────────────────────────────────────

type SettingsSection = "general" | "party" | "branding" | "notifications" | "language" | "ai-access" | "security";

const SETTINGS_SECTIONS: { key: SettingsSection; label: string; icon: string }[] = [
  { key: "general",       label: "General",         icon: I.settings    },
  { key: "party",         label: "Party & Election", icon: I.flag        },
  { key: "branding",      label: "Branding",         icon: I.palette     },
  { key: "notifications", label: "Notifications",    icon: I.bell        },
  { key: "language",      label: "Language",         icon: I.globe       },
  { key: "ai-access",     label: "AI Access",        icon: I.sparkle     },
  { key: "security",      label: "Security",         icon: I.shield      },
];

function SettingsToggle({ label, value, onChange, desc }: { label: string; value: boolean; onChange: (v: boolean) => void; desc?: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} className={`w-10 h-6 rounded-full border-2 relative transition-all shrink-0 ${value ? "bg-[#1d4ed8] border-[#1d4ed8]" : "bg-slate-100 border-slate-200"}`}>
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SettingsSectionContent({ section }: { section: SettingsSection }) {
  // General
  const [appName, setAppName] = useState("ElectManage Pro");
  const [appDesc, setAppDesc] = useState("Enterprise election operations and voter management platform.");
  const [supportPhone, setSupportPhone] = useState("1800-123-4567");
  const [supportEmail, setSupportEmail] = useState("support@electmanage.in");
  const [defaultLang, setDefaultLang] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // Party
  const [partyNameEn, setPartyNameEn] = useState("Bharatiya Janata Party");
  const [partyNameMr, setPartyNameMr] = useState("भारतीय जनता पक्ष");
  const [candidateName, setCandidateName] = useState("Shri Arun Mehta");
  const [electionType, setElectionType] = useState("State Assembly");
  const [constituency, setConstituency] = useState("Lucknow Central");
  const [lokSabha, setLokSabha] = useState("Lucknow");
  const [vidhanSabha, setVidhanSabha] = useState("Lucknow Cantt");
  const [ward, setWard] = useState("Ward 12");
  const [symbol, setSymbol] = useState("Lotus");

  // Notifications
  const [notifs, setNotifs] = useState({ campaign: true, election: true, meeting: false, event: false, system: true, email: true });

  // Language
  const [ifaceLang, setIfaceLang] = useState("English");
  const [aiLang, setAiLang] = useState("Hindi");

  // Branding
  const [primaryColor, setPrimaryColor] = useState("#1d4ed8");
  const [secondaryColor, setSecondaryColor] = useState("#0ea5e9");
  const [pageTheme, setPageTheme] = useState("Light");

  // AI Access
  const AI_USERS_LIMIT = 5;
  const [aiUsers, setAiUsers] = useState([
    { id: "u1", name: "Arun Mehta",   role: "Owner",  enabled: true  },
    { id: "u2", name: "Priya Sharma", role: "Admin",  enabled: true  },
    { id: "u3", name: "Rohit Verma",  role: "Editor", enabled: true  },
    { id: "u4", name: "Sunita Yadav", role: "Viewer", enabled: false },
    { id: "u5", name: "Karan Singh",  role: "Editor", enabled: false },
    { id: "u6", name: "Rajesh Kumar", role: "Worker", enabled: false },
    { id: "u7", name: "Meena Sharma", role: "Worker", enabled: false },
  ]);
  const aiEnabled = aiUsers.filter((u) => u.enabled).length;

  // Security
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaved, setPwdSaved] = useState(false);

  const [settingSaved, setSettingSaved] = useState(false);
  function saveSection() { setSettingSaved(true); setTimeout(() => setSettingSaved(false), 2000); }

  function UploadZone({ label, hint }: { label: string; hint: string }) {
    return (
      <div>
        <div className="text-xs font-medium text-slate-700 mb-2">{label}</div>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group">
          <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
            <Icon d={I.upload} size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="text-xs font-medium text-slate-600 group-hover:text-blue-700 transition-colors">Click to upload or drag & drop</div>
          <div className="text-[10px] text-slate-400">{hint}</div>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors";
  const selectCls = "w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 pr-8 cursor-pointer";

  if (section === "general") return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-sm font-semibold text-slate-900">General Settings</h2><p className="text-xs text-slate-500 mt-0.5">Core application configuration and contact details.</p></div>
        {settingSaved && <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg"><Icon d={I.checkCircle} size={12} />Saved</div>}
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-2 gap-4">
        <div className="col-span-2"><FormField label="Application Name"><input value={appName} onChange={(e) => setAppName(e.target.value)} className={inputCls} /></FormField></div>
        <div className="col-span-2"><FormField label="Application Description"><textarea value={appDesc} onChange={(e) => setAppDesc(e.target.value)} rows={2} className={`${inputCls} resize-none`} /></FormField></div>
        <FormField label="Support Number"><input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} className={inputCls} /></FormField>
        <FormField label="Support Email"><input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} type="email" className={inputCls} /></FormField>
        <FormField label="Default Language">
          <div className="relative"><select value={defaultLang} onChange={(e) => setDefaultLang(e.target.value)} className={selectCls}><option>English</option><option>Hindi</option><option>Marathi</option></select><Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
        </FormField>
        <FormField label="Timezone">
          <div className="relative"><select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={selectCls}><option>Asia/Kolkata</option><option>Asia/Mumbai</option><option>UTC</option></select><Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
        </FormField>
      </div>
      <div className="flex justify-end"><button onClick={saveSection} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Icon d={I.checkCircle} size={13} />Save Changes</button></div>
    </div>
  );

  if (section === "party") return (
    <div className="space-y-5">
      <div><h2 className="text-sm font-semibold text-slate-900">Party & Election</h2><p className="text-xs text-slate-500 mt-0.5">Configure party identity and election parameters.</p></div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-2 gap-4">
        <FormField label="Party Name (English)"><input value={partyNameEn} onChange={(e) => setPartyNameEn(e.target.value)} className={inputCls} /></FormField>
        <FormField label="Party Name (Marathi)"><input value={partyNameMr} onChange={(e) => setPartyNameMr(e.target.value)} className={inputCls} /></FormField>
        <div className="col-span-2"><FormField label="Candidate Name"><input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className={inputCls} /></FormField></div>
        <FormField label="Election Type">
          <div className="relative"><select value={electionType} onChange={(e) => setElectionType(e.target.value)} className={selectCls}><option>State Assembly</option><option>Lok Sabha</option><option>Municipal</option><option>Panchayat</option></select><Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
        </FormField>
        <FormField label="Constituency"><input value={constituency} onChange={(e) => setConstituency(e.target.value)} className={inputCls} /></FormField>
        <FormField label="Lok Sabha"><input value={lokSabha} onChange={(e) => setLokSabha(e.target.value)} className={inputCls} /></FormField>
        <FormField label="Vidhan Sabha"><input value={vidhanSabha} onChange={(e) => setVidhanSabha(e.target.value)} className={inputCls} /></FormField>
        <FormField label="Ward"><input value={ward} onChange={(e) => setWard(e.target.value)} className={inputCls} /></FormField>
        <FormField label="Voting Symbol"><input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. Lotus" className={inputCls} /></FormField>
      </div>
      <div className="flex justify-end"><button onClick={saveSection} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Icon d={I.checkCircle} size={13} />Save Changes</button></div>
    </div>
  );

  if (section === "branding") return (
    <div className="space-y-5">
      <div><h2 className="text-sm font-semibold text-slate-900">Branding</h2><p className="text-xs text-slate-500 mt-0.5">Upload logos, set brand colors, and configure the visual theme.</p></div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <UploadZone label="Party Logo" hint="PNG or SVG · Max 2 MB · 400×400px" />
          <UploadZone label="Application Logo" hint="PNG or SVG · Max 2 MB · 200×60px" />
          <UploadZone label="Login Logo" hint="PNG · Max 2 MB · 300×300px" />
          <UploadZone label="Banner" hint="PNG or JPG · Max 5 MB · 1200×300px" />
          <div className="col-span-2"><UploadZone label="Login Background" hint="JPG or PNG · Max 8 MB · 1920×1080px" /></div>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Theme Colors</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-medium text-slate-700 mb-2">Primary Color</div>
              <div className="flex items-center gap-2">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <div className="px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-slate-700 bg-slate-50">{primaryColor}</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-700 mb-2">Secondary Color</div>
              <div className="flex items-center gap-2">
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <div className="px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-slate-700 bg-slate-50">{secondaryColor}</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-700 mb-2">Page Theme</div>
              <div className="relative"><select value={pageTheme} onChange={(e) => setPageTheme(e.target.value)} className={selectCls}><option>Light</option><option>Dark</option><option>System</option></select><Icon d={I.chevronDown} size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
            </div>
          </div>
          {/* Live preview strip */}
          <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wide bg-slate-50 border-b border-slate-200">Live Preview</div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: primaryColor }}>A</div>
              <button className="px-4 py-2 text-xs font-semibold text-white rounded-lg" style={{ background: primaryColor }}>Primary Button</button>
              <button className="px-4 py-2 text-xs font-semibold text-white rounded-lg" style={{ background: secondaryColor }}>Secondary</button>
              <div className="px-3 py-1.5 text-xs font-medium rounded-full border text-white" style={{ background: primaryColor, borderColor: primaryColor }}>Badge</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end"><button onClick={saveSection} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Icon d={I.checkCircle} size={13} />Save Branding</button></div>
    </div>
  );

  if (section === "notifications") return (
    <div className="space-y-5">
      <div><h2 className="text-sm font-semibold text-slate-900">Notifications</h2><p className="text-xs text-slate-500 mt-0.5">Control which notifications you receive.</p></div>
      <div className="bg-white border border-slate-200 rounded-xl px-5">
        <SettingsToggle label="Campaign Notifications" value={notifs.campaign} onChange={(v) => setNotifs((p) => ({ ...p, campaign: v }))} desc="Alerts when campaigns are launched, completed, or fail" />
        <SettingsToggle label="Election Announcements" value={notifs.election} onChange={(v) => setNotifs((p) => ({ ...p, election: v }))} desc="Official election schedule and date announcements" />
        <SettingsToggle label="Meeting Alerts" value={notifs.meeting} onChange={(v) => setNotifs((p) => ({ ...p, meeting: v }))} desc="Reminders for scheduled team meetings" />
        <SettingsToggle label="Event Reminders" value={notifs.event} onChange={(v) => setNotifs((p) => ({ ...p, event: v }))} desc="Reminders for voter events and rallies" />
        <SettingsToggle label="System Notifications" value={notifs.system} onChange={(v) => setNotifs((p) => ({ ...p, system: v }))} desc="Platform updates, maintenance alerts, and security notices" />
        <SettingsToggle label="Email Notifications" value={notifs.email} onChange={(v) => setNotifs((p) => ({ ...p, email: v }))} desc="Receive email summaries and critical alerts" />
      </div>
      <div className="flex justify-end"><button onClick={saveSection} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Icon d={I.checkCircle} size={13} />Save Preferences</button></div>
    </div>
  );

  if (section === "language") return (
    <div className="space-y-5">
      <div><h2 className="text-sm font-semibold text-slate-900">Language</h2><p className="text-xs text-slate-500 mt-0.5">Set interface and AI interaction languages.</p></div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
        <div>
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Interface Language</div>
          <div className="grid grid-cols-3 gap-3">
            {["English", "Hindi", "Marathi"].map((l) => (
              <button key={l} onClick={() => setIfaceLang(l)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${ifaceLang === l ? "border-[#1d4ed8] bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${ifaceLang === l ? "bg-[#1d4ed8] text-white" : "bg-slate-100 text-slate-500"}`}>
                  {l === "English" ? "En" : l === "Hindi" ? "हि" : "म"}
                </div>
                <div>
                  <div className={`text-xs font-semibold ${ifaceLang === l ? "text-[#1d4ed8]" : "text-slate-700"}`}>{l}</div>
                  <div className="text-[10px] text-slate-400">{l === "English" ? "English" : l === "Hindi" ? "हिन्दी" : "मराठी"}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">AI Language</div>
          <div className="grid grid-cols-3 gap-3">
            {["English", "Hindi", "Marathi"].map((l) => (
              <button key={l} onClick={() => setAiLang(l)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${aiLang === l ? "border-[#1d4ed8] bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${aiLang === l ? "bg-[#1d4ed8] text-white" : "bg-slate-100 text-slate-500"}`}>
                  {l === "English" ? "En" : l === "Hindi" ? "हि" : "म"}
                </div>
                <div className={`text-xs font-semibold ${aiLang === l ? "text-[#1d4ed8]" : "text-slate-700"}`}>{l}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end"><button onClick={saveSection} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Icon d={I.checkCircle} size={13} />Save Language</button></div>
    </div>
  );

  if (section === "ai-access") return (
    <div className="space-y-5">
      <div><h2 className="text-sm font-semibold text-slate-900">AI Access</h2><p className="text-xs text-slate-500 mt-0.5">Manage which team members and workers have AI mode access.</p></div>
      {/* Plan summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-blue-800 mb-1">AI Pro Plan</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-blue-700">Allowed: <strong>{AI_USERS_LIMIT}</strong> users</span>
            <span className="text-blue-700">Used: <strong>{aiEnabled}</strong></span>
            <span className="text-blue-700">Remaining: <strong className={AI_USERS_LIMIT - aiEnabled <= 1 ? "text-red-600" : ""}>{AI_USERS_LIMIT - aiEnabled}</strong></span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#1d4ed8]">{aiEnabled}<span className="text-sm text-blue-400 font-medium"> / {AI_USERS_LIMIT}</span></div>
          <div className="text-[10px] text-blue-600 mt-1">AI users assigned</div>
          <div className="w-32 h-1.5 bg-blue-200 rounded-full mt-2 ml-auto overflow-hidden">
            <div className="h-full bg-[#1d4ed8] rounded-full" style={{ width: `${(aiEnabled / AI_USERS_LIMIT) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Members & Workers</span>
          <span className="text-[10px] text-slate-400">{aiEnabled} of {AI_USERS_LIMIT} slots used</span>
        </div>
        <div className="divide-y divide-slate-100">
          {aiUsers.map((u) => {
            const canEnable = !u.enabled && aiEnabled >= AI_USERS_LIMIT;
            return (
              <div key={u.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-800">{u.name}</div>
                  <div className="text-[10px] text-slate-400">{u.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  {u.enabled && <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full"><Icon d={I.sparkle} size={9} />AI Enabled</span>}
                  {canEnable && <span className="text-[10px] text-slate-400">Limit reached</span>}
                  <button disabled={canEnable} onClick={() => setAiUsers((p) => p.map((x) => x.id === u.id ? { ...x, enabled: !x.enabled } : x))}
                    className={`w-9 h-5 rounded-full border-2 relative transition-all ${u.enabled ? "bg-[#1d4ed8] border-[#1d4ed8]" : canEnable ? "bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed" : "bg-slate-100 border-slate-200"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${u.enabled ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end"><button onClick={saveSection} className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Icon d={I.checkCircle} size={13} />Save Access</button></div>
    </div>
  );

  if (section === "security") return (
    <div className="space-y-5">
      <div><h2 className="text-sm font-semibold text-slate-900">Security</h2><p className="text-xs text-slate-500 mt-0.5">Manage passwords, two-factor authentication, and active sessions.</p></div>

      {/* Change password */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer" onClick={() => setShowChangePwd((v) => !v)}>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Change Password</span>
          <Icon d={showChangePwd ? I.chevronDown : I.chevronRight} size={13} className="text-slate-400" />
        </div>
        {showChangePwd && (
          <div className="p-5 space-y-3">
            {pwdSaved && <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg"><Icon d={I.checkCircle} size={12} />Password updated successfully</div>}
            <FormField label="Current Password"><input type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} placeholder="Enter current password" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" /></FormField>
            <FormField label="New Password"><input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="Minimum 8 characters" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" /></FormField>
            <FormField label="Confirm Password"><input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Repeat new password" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400" /></FormField>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowChangePwd(false); setOldPwd(""); setNewPwd(""); setConfirmPwd(""); }} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setPwdSaved(true); setOldPwd(""); setNewPwd(""); setConfirmPwd(""); setTimeout(() => setPwdSaved(false), 3000); }}
                disabled={!oldPwd || newPwd.length < 8 || newPwd !== confirmPwd}
                className="px-5 py-2 text-sm font-medium text-white bg-[#1d4ed8] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">Update Password</button>
            </div>
          </div>
        )}
      </div>

      {/* 2FA */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-800">Two-Factor Authentication</div>
          <div className="text-xs text-slate-400 mt-0.5">{twoFA ? "2FA is active. Your account is secured." : "Add an extra layer of security with TOTP."}</div>
        </div>
        <div className="flex items-center gap-3">
          {twoFA && <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Active</span>}
          <button onClick={() => setTwoFA((v) => !v)} className={`w-10 h-6 rounded-full border-2 relative transition-all ${twoFA ? "bg-[#1d4ed8] border-[#1d4ed8]" : "bg-slate-100 border-slate-200"}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${twoFA ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Active Sessions</span>
          <button className="text-xs font-medium text-red-500 hover:text-red-700">Logout All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[{ device: "Chrome on macOS", ip: "103.12.45.6", time: "Active now", current: true }, { device: "Android App v3.2", ip: "106.67.89.12", time: "2 hours ago", current: false }].map((s, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <Icon d={I.monitor} size={14} className={s.current ? "text-[#1d4ed8]" : "text-slate-400"} />
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-800">{s.device} {s.current && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full ml-1">Current</span>}</div>
                <div className="text-[10px] text-slate-400">{s.ip} · {s.time}</div>
              </div>
              {!s.current && <button className="text-[10px] font-medium text-red-500 hover:text-red-700">Logout</button>}
            </div>
          ))}
        </div>
      </div>

      {/* Active devices */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Active Devices</span>
        </div>
        <div className="divide-y divide-slate-100">
          {[{ name: "MacBook Pro 16", type: "Laptop", trusted: true }, { name: "Pixel 7 Android", type: "Mobile", trusted: true }, { name: "Chrome Windows", type: "Browser", trusted: false }].map((d, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <Icon d={I.monitor} size={14} className="text-slate-400" />
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-800">{d.name}</div>
                <div className="text-[10px] text-slate-400">{d.type}</div>
              </div>
              <div className="flex items-center gap-2">
                {d.trusted && <span className="text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Trusted</span>}
                <button className="text-[10px] font-medium text-red-500 hover:text-red-700">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-red-200">
          <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Danger Zone</span>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-red-800">Delete Account</div>
            <p className="text-xs text-red-600 mt-0.5">Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shrink-0">
            <Icon d={I.trash} size={13} />Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}

function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");

  return (
    <div className="flex-1 overflow-hidden flex bg-[#f8fafc]">
      {/* Settings sidebar */}
      <div className="w-52 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">Settings</div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {SETTINGS_SECTIONS.map((s) => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${activeSection === s.key ? "bg-[#1d4ed8] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}>
              <Icon d={s.icon} size={13} className={activeSection === s.key ? "text-white" : "text-slate-400"} />
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[760px] mx-auto px-6 py-6">
          <SettingsSectionContent section={activeSection} />
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState<string>("aiMode");
  const [boothDetailData, setBoothDetailData] = useState<Booth | null>(null);
  const [formDetailData, setFormDetailData] = useState<{ form: SurveyForm; tab?: string } | null>(null);
  const [workerDetailData, setWorkerDetailData] = useState<WorkerRecord | null>(null);
  const [workerEditData, setWorkerEditData] = useState<WorkerRecord | undefined>(undefined);

  const handleNav = useCallback((k: string, data?: unknown) => {
    if (k === "members") setActiveNav("members-board");
    else if (k === "blo") setActiveNav("blo-board");
    else if (k === "booths") { setActiveNav("booths"); setBoothDetailData(null); }
    else if (k === "booth-detail" && data) { setBoothDetailData(data as Booth); setActiveNav("booth-detail"); }
    else if (k === "form-detail" && data) { setFormDetailData({ form: data as SurveyForm }); setActiveNav("form-detail"); }
    else if (k === "form-analytics" && data) { setFormDetailData({ form: data as SurveyForm, tab: "analytics" }); setActiveNav("form-detail"); }
    else if (k === "form-responses" && data) { setFormDetailData({ form: data as SurveyForm, tab: "responses" }); setActiveNav("form-detail"); }
    else if (k === "forms") { setFormDetailData(null); setActiveNav("forms"); }
    else if (k === "worker-detail" && data) { setWorkerDetailData(data as WorkerRecord); setActiveNav("worker-detail"); }
    else if (k === "worker-add" && data) { setWorkerEditData(data as WorkerRecord); setActiveNav("worker-add"); }
    else if (k === "worker-add") { setWorkerEditData(undefined); setActiveNav("worker-add"); }
    else if (k === "workers") { setWorkerDetailData(null); setWorkerEditData(undefined); setActiveNav("workers"); }
    else setActiveNav(k);
  }, []);

  function MainContent() {
    if (activeNav === "dashboard") return <Dashboard onNav={handleNav} />;
    if (activeNav === "voters") return <VoterBoard />;
    if (activeNav === "members-board") return <MembersBoard onNav={handleNav} />;
    if (activeNav === "members-add") return <AddMember onBack={() => handleNav("members-board")} />;
    if (activeNav === "members-registrations") return <Registrations />;
    if (activeNav === "members-reglink") return <RegistrationLink />;
    if (activeNav === "blo-board") return <BLOBoard onNav={handleNav} />;
    if (activeNav === "blo-add") return <AddBLO onBack={() => handleNav("blo-board")} />;
    if (activeNav === "booths") return <BoothBoard onNav={handleNav} />;
    if (activeNav === "booth-detail" && boothDetailData) return <BoothDetail booth={boothDetailData} onBack={() => handleNav("booths")} />;
    if (activeNav === "forms") return <FormsBoard onNav={handleNav} />;
    if (activeNav === "form-create") return <CreateForm onBack={() => handleNav("forms")} />;
    if (activeNav === "form-detail" && formDetailData) return <FormDetail form={formDetailData.form} initialTab={formDetailData.tab} onBack={() => handleNav("forms")} />;
    if (activeNav === "aiMode") return <AIModeScreen />;
    if (activeNav === "ai-search") return <AISearch />;
    if (activeNav === "reports") return <AIReport />;
    if (activeNav === "ai-campaign") return <AICampaign />;
    if (activeNav === "analysis") return <RAGElection />;
    if (activeNav === "filters") return <FiltersScreen />;
    if (activeNav === "updateRequests") return <UpdateRequestsScreen />;
    if (activeNav === "activities") return <UserActivities />;
    if (activeNav === "importExport") return <ExportVoterData />;
    if (activeNav === "phoneBook") return <PhoneBook />;
    if (activeNav === "organization") return <OrgScreen onNav={handleNav} />;
    if (activeNav === "org-members") return <OrgMembers />;
    if (activeNav === "org-access") return <MyAccess />;
    if (activeNav === "org-permissions") return <OrgPermissions />;
    if (activeNav === "campaigns") return <CampaignDashboard onNav={handleNav} />;
    if (activeNav === "camp-whatsapp") return <WhatsAppCampaign onBack={() => handleNav("campaigns")} />;
    if (activeNav === "camp-sms") return <SMSCampaign onBack={() => handleNav("campaigns")} />;
    if (activeNav === "camp-voice") return <VoiceCampaign onBack={() => handleNav("campaigns")} />;
    if (activeNav === "camp-scripts") return <ScriptsLibrary />;
    if (activeNav === "camp-analytics") return <CampAnalytics />;
    if (activeNav === "workers") return <WorkersBoard onNav={handleNav} />;
    if (activeNav === "worker-add") return <AddWorker initial={workerEditData} onBack={() => handleNav("workers")} />;
    if (activeNav === "worker-detail" && workerDetailData) return <WorkerDetail worker={workerDetailData} onBack={() => handleNav("workers")} />;
    if (activeNav === "profile") return <ProfilePage />;
    if (activeNav === "settings") return <SettingsPage />;
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon d={I.dashboard} size={20} className="text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-500">This screen is not yet implemented.</p>
          <p className="text-xs text-slate-400 mt-1">Select a module from the sidebar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeKey={activeNav} onNav={handleNav} />
        <MainContent />
      </div>
    </div>
  );
}
