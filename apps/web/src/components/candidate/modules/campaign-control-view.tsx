"use client";

import React, { useState } from "react";
import {
  Plus,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CampaignItem {
  id: string;
  name: string;
  channel: "WhatsApp Broadcast" | "SMS Dispatch" | "AI Voice IVR";
  targetAudience: string;
  sentCount: number;
  totalTarget: number;
  deliveryRate: string;
  status: "Completed" | "Active Dispatch" | "Scheduled";
  scheduledFor: string;
}

const SAMPLE_CAMPAIGNS: CampaignItem[] = [
  {
    id: "CMP-401",
    name: "Ward 12 & 14 Official Voter Slip PDF Broadcast",
    channel: "WhatsApp Broadcast",
    targetAudience: "Verified Electors with Mobile Contacts (Ward 12 & 14)",
    sentCount: 4320,
    totalTarget: 4500,
    deliveryRate: "96%",
    status: "Active Dispatch",
    scheduledFor: "Today, 10:00 AM",
  },
  {
    id: "CMP-402",
    name: "Youth First-Time Voters Polling Station Orientation",
    channel: "SMS Dispatch",
    targetAudience: "Age 18 - 25 Electors (All 8 Wards)",
    sentCount: 7950,
    totalTarget: 8200,
    deliveryRate: "97%",
    status: "Completed",
    scheduledFor: "Yesterday, 04:30 PM",
  },
  {
    id: "CMP-403",
    name: "Autonomous Voice Outreach: Marathi Candidate Audio Message",
    channel: "AI Voice IVR",
    targetAudience: "Senior Citizen & Family Heads (Kasba Peth)",
    sentCount: 10450,
    totalTarget: 12000,
    deliveryRate: "87%",
    status: "Active Dispatch",
    scheduledFor: "Today, 02:00 PM",
  },
  {
    id: "CMP-404",
    name: "Final Turnout Surge Alert on Polling Day Eve",
    channel: "WhatsApp Broadcast",
    targetAudience: "All 21.54 L Electors with mapped WhatsApp",
    sentCount: 0,
    totalTarget: 184000,
    deliveryRate: "Pending",
    status: "Scheduled",
    scheduledFor: "Election Eve, 06:00 PM",
  },
];

export function CampaignControlView() {
  const { showToast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState("all");

  const filtered = SAMPLE_CAMPAIGNS.filter((c) => {
    if (selectedChannel === "whatsapp") return c.channel.includes("WhatsApp");
    if (selectedChannel === "sms") return c.channel.includes("SMS");
    if (selectedChannel === "voice") return c.channel.includes("Voice");
    return true;
  });

  const handleCreateCampaign = () => {
    showToast(
      "info",
      "Campaign Wizard Opened",
      "Select audience demographic filters, template message, and dispatch schedule.",
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Campaign Broadcast Hub
            </span>
            <Badge variant="teal">Meta Cloud API Connected</Badge>
            <Badge variant="ai">AI Voice Bot Dispatch</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Voter Outreach &amp; Campaign Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Automated WhatsApp voter slip delivery, SMS notifications, and autonomous conversational voice IVR.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="md" onClick={handleCreateCampaign}>
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign Broadcast</span>
          </Button>
        </div>
      </section>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">WhatsApp Voter Slips</span>
            <span className="text-xs font-bold text-emerald-600">96% Delivery</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 tabular-nums">
            18.2 L
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Official ECI Voter Cards Dispatched</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">SMS Notification Credits</span>
            <span className="text-xs font-bold text-brand-600">Active Tier</span>
          </div>
          <div className="text-2xl font-bold text-brand-600 mt-1 tabular-nums">
            350,000
          </div>
          <div className="text-[11px] text-slate-500 mt-1">DLT Approved SMS Headers</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI Voice Outreach Channels</span>
            <span className="text-xs font-bold text-[#7867E9]">87% Connect Rate</span>
          </div>
          <div className="text-2xl font-bold text-[#7867E9] mt-1 tabular-nums">
            50 Concurrent
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Autonomous Marathi Voice Agents</div>
        </div>
      </div>

      {/* Campaigns Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">
            Active &amp; Scheduled Broadcast Campaigns
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedChannel("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedChannel === "all" ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-500"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannel("whatsapp")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedChannel === "whatsapp" ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-500"
              }`}
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannel("voice")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedChannel === "voice" ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-500"
              }`}
            >
              Voice IVR
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#DCE2EC]/60 dark:divide-[#22324F]/60">
          {filtered.map((c) => (
            <div key={c.id} className="p-4 hover:bg-slate-50/60 dark:hover:bg-[#1E293B]/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-brand-600">
                      {c.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        c.channel.includes("WhatsApp")
                          ? "bg-emerald-50 text-emerald-600"
                          : c.channel.includes("Voice")
                          ? "bg-[#F4F2FD] text-[#7867E9]"
                          : "bg-brand-50 text-brand-600"
                      }`}
                    >
                      {c.channel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        c.status === "Active Dispatch"
                          ? "bg-amber-50 text-amber-600"
                          : c.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500">{c.targetAudience}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-800 dark:text-white tabular-nums">
                    {c.sentCount.toLocaleString()} / {c.totalTarget.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    {c.deliveryRate} Delivery Throughput
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
