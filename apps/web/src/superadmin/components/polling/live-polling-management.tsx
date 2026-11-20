"use client";

import React, { useState, useMemo } from "react";
import {
  Radio,
  Calendar,
  Clock,
  Building2,
  Plus,
  Play,
  Square,
  Edit,
  Download,
  Search,
  History,
  X,
  Globe,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import {
  LivePollingSchedule,
  ElectionType,
  CandidateRecord,
} from "../../types/superadmin.types";
import {
  MOCK_POLLING_SCHEDULES,
  MOCK_CANDIDATES,
} from "../../data/mock-superadmin-data";

export function LivePollingManagementView() {
  const { toast } = useToast();

  const [schedules, setSchedules] = useState<LivePollingSchedule[]>(MOCK_POLLING_SCHEDULES);
  const [candidates] = useState<CandidateRecord[]>(MOCK_CANDIDATES);
  const [isGlobalEngineEnabled, setIsGlobalEngineEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "LIVE_ACTIVE" | "UPCOMING" | "CONCLUDED_ARCHIVED">("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<LivePollingSchedule | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formElectionType, setFormElectionType] = useState<ElectionType>("Vidhan Sabha");
  const [formDate, setFormDate] = useState("2026-11-20");
  const [formStartTime, setFormStartTime] = useState("07:00");
  const [formEndTime, setFormEndTime] = useState("18:00");
  const [formConstituencies, setFormConstituencies] = useState("215 - Kasba Peth, 214 - Pune Cantonment");
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(["CAN-8091"]);
  const [formIsEnabled, setFormIsEnabled] = useState(true);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchTab = activeTab === "ALL" || s.status === activeTab;
      const matchSearch =
        searchTerm.trim() === "" ||
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.electionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.targetConstituencies.some((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchTab && matchSearch;
    });
  }, [schedules, activeTab, searchTerm]);

  // Metrics
  const activeCount = useMemo(() => schedules.filter((s) => s.status === "LIVE_ACTIVE").length, [schedules]);
  const upcomingCount = useMemo(() => schedules.filter((s) => s.status === "UPCOMING").length, [schedules]);
  const archivedCount = useMemo(() => schedules.filter((s) => s.status === "CONCLUDED_ARCHIVED").length, [schedules]);
  const totalCoveredBooths = useMemo(() => schedules.reduce((acc, s) => acc + s.totalBooths, 0), [schedules]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingSchedule(null);
    setFormTitle("");
    setFormElectionType("Vidhan Sabha");
    setFormDate(new Date().toISOString().split("T")[0] || "2026-11-20");
    setFormStartTime("07:00");
    setFormEndTime("18:00");
    setFormConstituencies("215 - Kasba Peth");
    setSelectedCandidateIds(["CAN-8091"]);
    setFormIsEnabled(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (schedule: LivePollingSchedule) => {
    setEditingSchedule(schedule);
    setFormTitle(schedule.title);
    setFormElectionType(schedule.electionType);
    setFormDate(schedule.pollingDate);
    setFormStartTime(schedule.startTime);
    setFormEndTime(schedule.endTime);
    setFormConstituencies(schedule.targetConstituencies.map((c) => `${c.constituencyNo} - ${c.name}`).join(", "));
    setSelectedCandidateIds(schedule.eligibleCandidateIds);
    setFormIsEnabled(schedule.isEnabled);
    setIsModalOpen(true);
  };

  // Save Modal
  const handleSaveSchedule = () => {
    if (!formTitle.trim()) {
      toast("Please enter an election schedule title.", "error");
      return;
    }

    const constituencyItems = formConstituencies.split(",").map((c, idx) => {
      const trimmed = c.trim();
      const parts = trimmed.split("-");
      return {
        constituencyId: `CONST-NEW-${idx}`,
        constituencyNo: parts[0]?.trim() || `${200 + idx}`,
        name: parts[1]?.trim() || trimmed,
        district: "Pune",
      };
    });

    const candidateNames = candidates
      .filter((c) => selectedCandidateIds.includes(c.id))
      .map((c) => `${c.name} (${c.geography})`);

    if (editingSchedule) {
      // Update
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id
            ? {
                ...s,
                title: formTitle,
                electionType: formElectionType,
                pollingDate: formDate,
                startTime: formStartTime,
                endTime: formEndTime,
                isEnabled: formIsEnabled,
                targetConstituencies: constituencyItems,
                eligibleCandidateIds: selectedCandidateIds,
                eligibleCandidateNames: candidateNames,
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );
      toast(`Schedule "${formTitle}" updated successfully.`, "success");
    } else {
      // Create new
      const newSchedule: LivePollingSchedule = {
        id: `SCHED-${Date.now()}`,
        title: formTitle,
        electionType: formElectionType,
        isEnabled: formIsEnabled,
        pollingDate: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        timezone: "Asia/Kolkata",
        targetConstituencies: constituencyItems,
        eligibleCandidateIds: selectedCandidateIds,
        eligibleCandidateNames: candidateNames,
        status: "UPCOMING",
        totalBooths: 150,
        totalElectors: 165000,
        lastUpdatedBy: "Super Admin (Sanjay Mehta)",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSchedules((prev) => [newSchedule, ...prev]);
      toast(`New polling schedule "${formTitle}" created.`, "success");
    }

    setIsModalOpen(false);
  };

  // Manual Toggle Active Status (Force Activate / Close Polls)
  const handleToggleSessionStatus = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== scheduleId) return s;
        if (s.status === "LIVE_ACTIVE") {
          toast(`Polling session "${s.title}" has been manually closed and archived.`, "info");
          return { ...s, status: "CONCLUDED_ARCHIVED", isEnabled: false };
        } else if (s.status === "UPCOMING") {
          toast(`Polling session "${s.title}" has been forcibly activated. Live polling is now open for candidates.`, "success");
          return { ...s, status: "LIVE_ACTIVE", isEnabled: true };
        } else {
          toast(`Historical session "${s.title}" reactivated as LIVE_ACTIVE.`, "warning");
          return { ...s, status: "LIVE_ACTIVE", isEnabled: true };
        }
      })
    );
  };

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    );
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* HEADER SECTION                                                        */}
      {/* ===================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Live Polling Management &amp; Scheduling Engine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  LPIANE v1.0
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized control of election polling windows, eligible constituencies, and candidate portal live polling activation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Global Master Switch */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Global Engine:</span>
            <button
              onClick={() => {
                setIsGlobalEngineEnabled((prev) => !prev);
                toast(
                  !isGlobalEngineEnabled
                    ? "Global Live Polling Engine Enabled across all scheduled areas."
                    : "Emergency Lockdown: Live Polling Engine Disabled globally.",
                  !isGlobalEngineEnabled ? "success" : "warning"
                );
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase transition-colors cursor-pointer ${
                isGlobalEngineEnabled
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-rose-500 text-white shadow-xs"
              }`}
            >
              {isGlobalEngineEnabled ? "Operational (ON)" : "Lockdown (OFF)"}
            </button>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Polling Schedule</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* KPI METRIC CARDS                                                      */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Live Sessions</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{activeCount}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Constituency in Polls</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Real-time voter turnout synchronizing</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Schedules</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{upcomingCount}</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">Planned General Polls</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Auto-activates on configured election date</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Historical Archives</span>
            <History className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{archivedCount}</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">Read-Only Archives</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Preserved for statutory audit &amp; reporting</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Timezone</span>
            <Globe className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-black text-slate-900 dark:text-white">Asia/Kolkata</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">(IST +05:30)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{totalCoveredBooths} Polling Stations Configured</p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FILTER TABS & SEARCH BAR                                              */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
          {(
            [
              { id: "ALL", label: "All Schedules" },
              { id: "LIVE_ACTIVE", label: "Active Live Now" },
              { id: "UPCOMING", label: "Upcoming" },
              { id: "CONCLUDED_ARCHIVED", label: "Archived History" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search election title, area, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SCHEDULES LIST / MATRIX TABLE                                         */}
      {/* ===================================================================== */}
      <div className="space-y-3.5">
        {filteredSchedules.map((schedule) => {
          const isActive = schedule.status === "LIVE_ACTIVE";
          const isUpcoming = schedule.status === "UPCOMING";

          return (
            <div
              key={schedule.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all shadow-xs ${
                isActive
                  ? "border-emerald-500/50 ring-1 ring-emerald-500/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                          : isUpcoming
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300"
                      }`}
                    >
                      {isActive && "● "}
                      {schedule.status.replace("_", " ")}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                      {schedule.electionType}
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-400">{schedule.id}</span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{schedule.title}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Date: <strong>{schedule.pollingDate}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        Polling Window: <strong>{schedule.startTime} – {schedule.endTime} IST</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>
                        Booths / Electors: <strong>{schedule.totalBooths} booths ({schedule.totalElectors.toLocaleString()} voters)</strong>
                      </span>
                    </div>
                  </div>

                  {/* Constituencies & Eligible Candidates */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-2 text-[11px]">
                    <span className="text-slate-400 font-bold shrink-0">Constituencies:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {schedule.targetConstituencies.map((c) => (
                        <span
                          key={c.constituencyId}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700"
                        >
                          AC-{c.constituencyNo} {c.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[11px]">
                    <span className="text-slate-400 font-bold shrink-0">Authorized Candidates:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {schedule.eligibleCandidateNames.map((name, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Schedule Action Controls */}
                <div className="flex flex-wrap lg:flex-col items-end justify-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
                  {/* Status Switcher */}
                  <button
                    onClick={() => handleToggleSessionStatus(schedule.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer ${
                      isActive
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Emergency Close Polls</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Force Activate Session</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(schedule)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Schedule</span>
                    </button>

                    <button
                      onClick={() => toast(`Immutable audit pack generated for ${schedule.title}.`, "success")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      title="Download Audit Package"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Audit Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSchedules.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No live polling schedules found matching your filters.
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* CREATE / EDIT SCHEDULE MODAL                                          */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {editingSchedule ? "Edit Polling Schedule" : "Configure Live Polling Schedule"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Election Title / General Poll Description *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Maharashtra Assembly General Election 2026 - Phase 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Election Type</label>
                  <select
                    value={formElectionType}
                    onChange={(e) => setFormElectionType(e.target.value as ElectionType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Vidhan Sabha">Vidhan Sabha</option>
                    <option value="Lok Sabha">Lok Sabha</option>
                    <option value="Municipal Corporation">Municipal Corporation</option>
                    <option value="Zilla Parishad">Zilla Parishad</option>
                    <option value="Gram Panchayat">Gram Panchayat</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Polling Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Polling Start Time (IST)</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Polling End Time (IST)</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Constituencies / Wards (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formConstituencies}
                  onChange={(e) => setFormConstituencies(e.target.value)}
                  placeholder="215 - Kasba Peth, 214 - Pune Cantonment"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Eligible Candidate Portals (Assign Live Polling Access)
                </label>
                <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 max-h-36 overflow-y-auto bg-slate-50 dark:bg-slate-800/40">
                  {candidates.map((c) => {
                    const isChecked = selectedCandidateIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCandidateSelection(c.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                        <span className="text-slate-400">({c.geography} • {c.party})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Schedule Enabled</span>
                  <span className="text-[11px] text-slate-400">Activate schedule according to date &amp; polling hours</span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsEnabled}
                  onChange={(e) => setFormIsEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
