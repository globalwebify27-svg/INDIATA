"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  MapPin,
  Sparkles,
  Bell,
  Sun,
  Moon,
  Building,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";

export interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

const CONSTITUENCIES = [
  { id: "pune-pc", name: "34 - Pune Parliamentary Constituency", type: "Lok Sabha" },
  { id: "kothrud-ac", name: "214 - Kothrud Assembly Segment", type: "Vidhan Sabha" },
  { id: "shivajinagar-ac", name: "215 - Shivajinagar Assembly Segment", type: "Vidhan Sabha" },
];

export function Header({
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<"alerts" | "directives">("alerts");
  const [showDirectiveModal, setShowDirectiveModal] = useState(false);
  const [directiveScope, setDirectiveScope] = useState<"bulk" | "targeted">("bulk");
  const [selectedKaryakarta, setSelectedKaryakarta] = useState("k-1");
  const [directiveTitle, setDirectiveTitle] = useState("");
  const [directiveBody, setDirectiveBody] = useState("");
  const [directiveUrgency, setDirectiveUrgency] = useState<"NORMAL" | "URGENT" | "FLASH">("NORMAL");

  const FIELD_KARYAKARTAS = [
    { id: "k-1", name: "Pooja Santosh Jagtap", booth: "Booth #101", ward: "Ward 12", phone: "+91 98901 22334" },
    { id: "k-2", name: "Ganesh P. Bhosale", booth: "Booth #102", ward: "Ward 12", phone: "+91 97654 00987" },
    { id: "k-3", name: "Vikas M. Jadhav", booth: "Booth #104", ward: "Ward 14", phone: "+91 98220 77123" },
    { id: "k-4", name: "Nitin R. Jagtap", booth: "Booth #106", ward: "Ward 9", phone: "+91 98900 44551" },
    { id: "k-5", name: "Sneha K. Deshmukh", booth: "Booth #108", ward: "Ward 14", phone: "+91 99221 66554" },
  ];

  const [sentDirectives, setSentDirectives] = useState([
    {
      id: "DIR-104",
      title: "Morning Voter Slip Distribution Wave",
      body: "Ensure 100% voter slip distribution across Booths 101-105 before 11:00 AM.",
      scope: "Bulk Broadcast (All Karyakartas)",
      urgency: "URGENT",
      sentAt: "10m ago",
    },
    {
      id: "DIR-103",
      title: "Verify Dahanukar Colony Voter Grievances",
      body: "Follow up with affected families on municipal water issue resolution status.",
      scope: "Targeted: Pooja Santosh Jagtap",
      urgency: "NORMAL",
      sentAt: "1h ago",
    },
  ]);

  const handleSendDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveTitle.trim() || !directiveBody.trim()) {
      showToast("error", "Missing Information", "Please enter a directive title and message body.");
      return;
    }
    const targetWorker = FIELD_KARYAKARTAS.find((k) => k.id === selectedKaryakarta);
    const targetLabel = directiveScope === "bulk" ? "All Active Karyakartas" : targetWorker?.name || "Selected Karyakarta";

    const newDir = {
      id: `DIR-${Math.floor(100 + Math.random() * 900)}`,
      title: directiveTitle.trim(),
      body: directiveBody.trim(),
      scope: directiveScope === "bulk" ? "Bulk Broadcast" : `Targeted: ${targetLabel}`,
      urgency: directiveUrgency,
      sentAt: "Just now",
    };
    setSentDirectives((prev) => [newDir, ...prev]);
    showToast("success", "Directive Dispatched", `Push notification dispatched to ${targetLabel}.`);
    setShowDirectiveModal(false);
    setDirectiveTitle("");
    setDirectiveBody("");
    setNotificationTab("directives");
  };
  const [constituencyDropdownOpen, setConstituencyDropdownOpen] = useState(false);
  const [selectedConstituency, setSelectedConstituency] = useState(
    user?.constituencyName || "34 - Pune Parliamentary Constituency"
  );

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const constituencyRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (constituencyRef.current && !constituencyRef.current.contains(target)) {
        setConstituencyDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchResultsOpen(false);
    showToast(
      "info",
      "Voter Registry Search",
      `Filtering electors for: "${searchQuery}"`,
    );
  };

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onOpenMobile();
    } else {
      onToggleCollapse();
    }
  };

  const candidateInitials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "VP";

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none gap-3">
        {/* LEFT: Sidebar Toggle + Constituency Pill + War Room Live */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleToggle}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 md:hidden"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Constituency Context Selector Pill */}
          <div className="relative" ref={constituencyRef}>
            <button
              type="button"
              onClick={() => setConstituencyDropdownOpen(!constituencyDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#273750] bg-slate-50 dark:bg-[#111C30] hover:bg-slate-100 dark:hover:bg-[#17243A] text-xs font-semibold text-slate-800 dark:text-[#F1F5FC] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="truncate max-w-[140px] sm:max-w-[210px]">
                {selectedConstituency}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#71819B]" />
            </button>

            {constituencyDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-scale-up">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Active Constituency
                </div>
                <div className="space-y-1">
                  {CONSTITUENCIES.map((c) => {
                    const isCurrent = selectedConstituency.includes(c.name.split(" ")[2] || "");
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedConstituency(c.name);
                          setConstituencyDropdownOpen(false);
                          showToast("info", "Active Constituency", `Switched focus to ${c.name}`);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-brand-50 hover:text-brand-700 font-medium flex items-center justify-between transition-colors"
                      >
                        <span>{c.name} ({c.type})</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* War Room Live Pulsing Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-[#17243A] border border-blue-200/80 dark:border-blue-900/60 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 pulse-glow-blue" />
            <span className="tracking-wide">War Room Live</span>
          </div>
        </div>

        {/* CENTER: Global Search with Ctrl K */}
        <div ref={searchRef} className="flex-1 max-w-md mx-2 sm:mx-6 relative hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#71819B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Global search: voter, EPIC ID, booth, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchResultsOpen(true);
              }}
              onFocus={() => setSearchResultsOpen(true)}
              className="w-full pl-10 pr-16 py-2 bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-[#273750] rounded-xl text-xs text-slate-900 dark:text-[#F1F5FC] placeholder:text-slate-400 dark:placeholder:text-[#71819B] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-[#1C2C46] text-slate-600 dark:text-[#94A3B8] pointer-events-none">
              Ctrl K
            </kbd>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResultsOpen(false);
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Quick Search Results Overlay */}
          {searchResultsOpen && searchQuery.trim().length > 1 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto z-50 p-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Matching Elector Records</span>
                <span>Press ESC to dismiss</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <Link
                  href={`/voters?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchResultsOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors block"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-50 text-[#6256D9] uppercase">
                        EPIC SEARCH
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-brand-600">
                        View all voter entries matching &quot;{searchQuery}&quot;
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Search across 2,045 Polling Stations &amp; 21.54 L Electors
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-colors" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Theme Toggle + AI Mode + Notifications + Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#17243A] transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* AI Mode Gradient Action Button */}
          <Link
            href="/strategy"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            title="Open Strategy & Agentic AI Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
            <span className="hidden sm:inline">AI Mode</span>
          </Link>

          {/* Notifications Dropdown (Section 11 Custom Push Messaging) */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#17243A] transition-colors"
              title="System Notifications & Field Directives"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0D1524]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-88 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                {/* Header with Compose Directive Button */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                      Notifications &amp; Directives
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(false);
                      setShowDirectiveModal(true);
                    }}
                    className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    + Compose Directive
                  </button>
                </div>

                {/* Sub-tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setNotificationTab("alerts")}
                    className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                      notificationTab === "alerts"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    System Alerts (2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationTab("directives")}
                    className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                      notificationTab === "directives"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sent Directives ({sentDirectives.length})
                  </button>
                </div>

                {/* List Container */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {notificationTab === "alerts" ? (
                    <>
                      <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            3 Critical Focus Booths Require Slip Surge
                          </p>
                          <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-1.5 py-0.5 rounded">Urgent</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Booth #103 &amp; #108 are under 50% distribution.
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">5m ago</span>
                      </div>
                      <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                          ECI Draft Roll Batch #4029 Synced
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          1,420 records processed across 8 wards.
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">22m ago</span>
                      </div>
                    </>
                  ) : (
                    sentDirectives.map((dir) => (
                      <div key={dir.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{dir.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            dir.urgency === "FLASH" ? "bg-red-50 text-red-600 dark:bg-red-950/40" :
                            dir.urgency === "URGENT" ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40" :
                            "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}>{dir.urgency}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">{dir.body}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          <span className="font-medium text-blue-600">{dir.scope}</span>
                          <span>{dir.sentAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-[#273750] hover:bg-slate-100 dark:hover:bg-[#17243A] transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                {candidateInitials}
              </div>

              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-900 dark:text-[#F1F5FC] leading-none">
                  {user?.name || "Adv. Vikram Patil"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-[#71819B] mt-0.5">
                  Candidate Admin
                </p>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {user?.name || "Adv. Vikram Patil"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {user?.email || "candidate@rajtantra.in"}
                  </p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700">
                    Candidate Admin • 34 Pune PC
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings/organization"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>Constituency War Room</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Portal Settings</span>
                  </Link>

                  <a
                    href={process.env.NEXT_PUBLIC_SUPERADMIN_URL || "http://localhost:3000"}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Super Admin Portal (Port 3000)</span>
                  </a>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SECTION 11: COMPOSE DIRECTIVE MODAL */}
      {showDirectiveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12131A] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6256D9] dark:bg-violet-950/40 dark:text-violet-300 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Compose Karyakarta Directive
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dispatch real-time push instructions to on-ground campaign cadre
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDirectiveModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendDirective} className="p-4 sm:p-5 space-y-4 text-xs">
              {/* Delivery Scope Toggle */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Delivery Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDirectiveScope("bulk")}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      directiveScope === "bulk"
                        ? "bg-[#6256D9] text-white border-[#6256D9] shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Bulk Broadcast (All Workers)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectiveScope("targeted")}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      directiveScope === "targeted"
                        ? "bg-[#6256D9] text-white border-[#6256D9] shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Targeted 1-to-1 Dispatch
                  </button>
                </div>
              </div>

              {/* Targeted Worker Picker */}
              {directiveScope === "targeted" && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Select Target Karyakarta
                  </label>
                  <select
                    value={selectedKaryakarta}
                    onChange={(e) => setSelectedKaryakarta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    {FIELD_KARYAKARTAS.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name} ({k.booth} • {k.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Urgency Level */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Urgency / Priority
                </label>
                <div className="flex items-center gap-2">
                  {(["NORMAL", "URGENT", "FLASH"] as const).map((urg) => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setDirectiveUrgency(urg)}
                      className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center border text-[11px] transition-all cursor-pointer ${
                        directiveUrgency === urg
                          ? urg === "FLASH"
                            ? "bg-red-600 text-white border-red-600"
                            : urg === "URGENT"
                            ? "bg-amber-600 text-white border-amber-600"
                            : "bg-[#6256D9] text-white border-[#6256D9]"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Directive Headline
                </label>
                <input
                  type="text"
                  value={directiveTitle}
                  onChange={(e) => setDirectiveTitle(e.target.value)}
                  placeholder="e.g. Surge Slip Distribution in Booth #104"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              {/* Directive Body */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Directive Instructions (Marathi / English)
                </label>
                <textarea
                  rows={3}
                  value={directiveBody}
                  onChange={(e) => setDirectiveBody(e.target.value)}
                  placeholder="Enter direct on-ground operational instructions for field workers..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 leading-relaxed"
                  required
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDirectiveModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6256D9] hover:bg-[#5044BF] text-white font-bold shadow-md shadow-[#6256D9]/20 cursor-pointer"
                >
                  Send Push Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
