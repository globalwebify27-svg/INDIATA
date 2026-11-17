"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  Phone,
  RefreshCw,
  MapPin,
  Check,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

export interface LiveFeedbackItem {
  id: string;
  citizenName: string;
  citizenPhone: string;
  epicNumber?: string;
  boothNumber: number;
  prabhaag: string;
  pollingStation: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "URGENT_ISSUE";
  channel: "KARYAKARTA_APP" | "WHATSAPP_INBOUND" | "IVR_CALL" | "BOOTH_KIOSK";
  timestamp: string;
  message: string;
  karyakartaReporter?: string;
  status: "NEW" | "ACKNOWLEDGED" | "RESOLVED";
  tags: string[];
}

export const SEED_FEEDBACK_ITEMS: LiveFeedbackItem[] = [
  {
    id: "fb-01",
    citizenName: "Ramesh Narayan Joshi",
    citizenPhone: "+91 98220 11450",
    epicNumber: "MH/34/215/001420",
    boothNumber: 101,
    prabhaag: "Prabhaag 12 - Kothrud West",
    pollingStation: "Navbharat High School, Room 1",
    sentiment: "POSITIVE",
    channel: "KARYAKARTA_APP",
    timestamp: "4 mins ago",
    message: "Voter slip delivered at home by karyakarta Pooja Jadhav. Entire family (5 electors) confirmed support for Adv. Vikram Patil. Requested candidate to visit Ganesh society mandal.",
    karyakartaReporter: "Pooja Jadhav (Karyakarta #101)",
    status: "NEW",
    tags: ["Slip Confirmed", "5 Votes", "Society Visit"],
  },
  {
    id: "fb-02",
    citizenName: "Sunita Ashok Deshmukh",
    citizenPhone: "+91 98500 23145",
    epicNumber: "MH/34/215/001428",
    boothNumber: 102,
    prabhaag: "Prabhaag 12 - Kothrud West",
    pollingStation: "Navbharat High School, Room 2",
    sentiment: "URGENT_ISSUE",
    channel: "WHATSAPP_INBOUND",
    timestamp: "12 mins ago",
    message: "Drinking water supply in Dahanukar Colony Lane 3 has low pressure since morning. Ward corporator promised repair earlier this week. Urgently request water tanker before polling day.",
    karyakartaReporter: "Sachin Babar (Prabhaag Incharge)",
    status: "NEW",
    tags: ["Civic Water Issue", "Immediate Follow-up", "Urgent"],
  },
  {
    id: "fb-03",
    citizenName: "Amit Suresh Kulkarni",
    citizenPhone: "+91 94220 33890",
    epicNumber: "MH/34/215/001435",
    boothNumber: 103,
    prabhaag: "Prabhaag 12 - Kothrud West",
    pollingStation: "Dr. Babasaheb Ambedkar Samaj Mandir",
    sentiment: "NEUTRAL",
    channel: "IVR_CALL",
    timestamp: "28 mins ago",
    message: "Citizen answered outbound AI voice call. Expressed satisfaction with candidate's clean track record, but inquired about local traffic decongestion plans near Paud Phata junction.",
    status: "ACKNOWLEDGED",
    tags: ["IVR Telemetry", "Traffic Demands", "Swing Elector"],
  },
  {
    id: "fb-04",
    citizenName: "Meenakshi Vilas Shinde",
    citizenPhone: "+91 98909 44120",
    epicNumber: "MH/34/215/001442",
    boothNumber: 104,
    prabhaag: "Prabhaag 12 - Kothrud West",
    pollingStation: "Pune Municipal Primary School No. 18",
    sentiment: "POSITIVE",
    channel: "BOOTH_KIOSK",
    timestamp: "45 mins ago",
    message: "Verified enrollment at Helpdesk Kiosk. Grateful that candidate's team helped resolve grandfather's senior citizen pension documentation last month. Staunch supporter.",
    karyakartaReporter: "Ganesh Patil (Karyakarta #102)",
    status: "RESOLVED",
    tags: ["Pension Helped", "Grateful", "Committed Voter"],
  },
  {
    id: "fb-05",
    citizenName: "Dr. Arvind G. Kulkarni",
    citizenPhone: "+91 98221 55670",
    epicNumber: "MH/34/215/001450",
    boothNumber: 101,
    prabhaag: "Prabhaag 12 - Kothrud West",
    pollingStation: "Navbharat High School, Room 1",
    sentiment: "POSITIVE",
    channel: "KARYAKARTA_APP",
    timestamp: "1 hour ago",
    message: "Indian Medical Association local chapter meet concluded positively. Dr. Kulkarni assured 40+ healthcare professional families will cast ballots for development leadership.",
    karyakartaReporter: "Dr. Sameer Deshpande (War Room Head)",
    status: "ACKNOWLEDGED",
    tags: ["Doctors Association", "Influencer", "Endorsement"],
  },
  {
    id: "fb-06",
    citizenName: "Sanjay Bapu More",
    citizenPhone: "+91 98230 77120",
    epicNumber: "MH/34/215/001458",
    boothNumber: 105,
    prabhaag: "Prabhaag 13 - Karve Nagar",
    pollingStation: "Cummins Engineering College, Annex",
    sentiment: "URGENT_ISSUE",
    channel: "WHATSAPP_INBOUND",
    timestamp: "1 hour ago",
    message: "Streetlights not functioning on DP Road leading to polling center. Senior citizens and women requested emergency PMC lighting before election day evening rallies.",
    karyakartaReporter: "Mahesh Thorat (Data Operator)",
    status: "NEW",
    tags: ["PMC Infrastructure", "Streetlights", "Rally Route"],
  },
];

export function LiveFeedbackView() {
  const { showToast } = useToast();

  const [feedbacks, setFeedbacks] = useState<LiveFeedbackItem[]>(SEED_FEEDBACK_ITEMS);
  const [activeSentiment, setActiveSentiment] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      if (activeSentiment !== "ALL" && item.sentiment !== activeSentiment) return false;
      if (channelFilter !== "ALL" && item.channel !== channelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.citizenName.toLowerCase().includes(q);
        const matchPhone = item.citizenPhone.replace(/\D/g, "").includes(q.replace(/\D/g, ""));
        const matchMsg = item.message.toLowerCase().includes(q);
        const matchBooth = item.boothNumber.toString().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        return matchName || matchPhone || matchMsg || matchBooth || matchTags;
      }
      return true;
    });
  }, [feedbacks, activeSentiment, channelFilter, searchQuery]);

  const handleAcknowledge = (id: string, name: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "ACKNOWLEDGED" } : f))
    );
    showToast("info", "Feedback Acknowledged", `Marked feedback from ${name} as acknowledged.`);
  };

  const handleResolve = (id: string, name: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "RESOLVED" } : f))
    );
    showToast("success", "Issue Resolved", `Marked issue for ${name} as resolved.`);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Field Intelligence &amp; Citizen Reactions
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Telemetry Stream
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Live Feedback &amp; Voter Sentiment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time incoming feedback from booth karyakartas, citizen WhatsApp lines, IVR call logs, and helpdesk kiosks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => showToast("info", "Stream Refreshed", "Synchronized latest telemetry with field hubs.")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Influx Today</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">184</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">+28 vs yesterday</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Favorable Sentiment</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">72.4%</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">133 Positive reports</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ThumbsUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Resolved / Handled</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">142</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Response time: 14m avg</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Urgent Flagged Issues</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">6</span>
            <span className="text-[10px] text-rose-500 font-bold mt-0.5 block">Action required</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voter name, phone number, booth, or issue keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Inbound Channels</option>
              <option value="KARYAKARTA_APP">Karyakarta App</option>
              <option value="WHATSAPP_INBOUND">WhatsApp Citizen Line</option>
              <option value="IVR_CALL">AI IVR Call Survey</option>
              <option value="BOOTH_KIOSK">Helpdesk Kiosk</option>
            </select>
          </div>
        </div>

        {/* Sentiment Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSentiment("ALL")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSentiment === "ALL"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            All Feedback ({feedbacks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSentiment("POSITIVE")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSentiment === "POSITIVE"
                ? "bg-emerald-600 text-white font-bold"
                : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
            }`}
          >
            Positive ({feedbacks.filter((f) => f.sentiment === "POSITIVE").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSentiment("NEUTRAL")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSentiment === "NEUTRAL"
                ? "bg-amber-500 text-white font-bold"
                : "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
            }`}
          >
            Neutral / Swing ({feedbacks.filter((f) => f.sentiment === "NEUTRAL").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSentiment("URGENT_ISSUE")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSentiment === "URGENT_ISSUE"
                ? "bg-rose-600 text-white font-bold"
                : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
            }`}
          >
            Urgent Issues ({feedbacks.filter((f) => f.sentiment === "URGENT_ISSUE").length})
          </button>
        </div>
      </div>

      {/* Feedback Feed Cards List */}
      <div className="space-y-3">
        {filteredFeedbacks.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all shadow-xs ${
              item.sentiment === "URGENT_ISSUE"
                ? "border-rose-200 dark:border-rose-900/60 bg-rose-50/20"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.sentiment === "POSITIVE"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : item.sentiment === "URGENT_ISSUE"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {item.sentiment.replace(/_/g, " ")}
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.channel.replace(/_/g, " ")}
                  </span>

                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs text-slate-400 font-mono">{item.timestamp}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {item.citizenName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">{item.citizenPhone}</span>
                  {item.epicNumber && (
                    <span className="text-[11px] text-blue-600 font-mono font-bold">
                      ({item.epicNumber})
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  "{item.message}"
                </p>

                <div className="flex items-center gap-2 pt-2 flex-wrap text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Booth #{item.boothNumber} • {item.pollingStation}
                  </span>
                  {item.karyakartaReporter && (
                    <>
                      <span>•</span>
                      <span className="text-purple-600 font-semibold">
                        Reported by: {item.karyakartaReporter}
                      </span>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <a
                  href={`tel:${item.citizenPhone.replace(/\D/g, "")}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Citizen</span>
                </a>

                {item.status !== "RESOLVED" && (
                  <button
                    type="button"
                    onClick={() => handleResolve(item.id, item.citizenName)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                )}

                {item.status === "NEW" && (
                  <button
                    type="button"
                    onClick={() => handleAcknowledge(item.id, item.citizenName)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Acknowledge</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
