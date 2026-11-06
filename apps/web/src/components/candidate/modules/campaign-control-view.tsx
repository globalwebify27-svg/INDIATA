"use client";

import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  PhoneCall,
  Send,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  X,
  Gift,
  Check,
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
  const [activeTab, setActiveTab] = useState<"all" | "whatsapp" | "sms" | "voice" | "wallet">("all");
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(SAMPLE_CAMPAIGNS);
  const [birthdayAutoPilot, setBirthdayAutoPilot] = useState(true);

  // 5-Step Campaign Wizard Modal State
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Wizard Form Fields
  const [wizardChannel, setWizardChannel] = useState<"WhatsApp" | "SMS" | "Voice">("WhatsApp");
  const [wizardCampaignName, setWizardCampaignName] = useState("");
  const [wizardAudienceWard, setWizardAudienceWard] = useState("All Wards");
  const [wizardAudienceTarget, setWizardAudienceTarget] = useState("Verified Mobile Electors");
  const [wizardTemplateMessage, setWizardTemplateMessage] = useState(
    "Namaskar {{voter_name}} ji! Adv. Vikram Patil requests your valuable vote in the upcoming Assembly election. Your polling station is {{booth_name}} (Booth #{{booth_number}}). Download your official digital voter slip here: {{slip_link}}"
  );
  const [wizardScheduleType, setWizardScheduleType] = useState<"immediate" | "scheduled" | "birthday">("immediate");
  const [wizardScheduleTime, setWizardScheduleTime] = useState("2026-11-08T10:00");

  const filtered = campaigns.filter((c) => {
    if (activeTab === "whatsapp") return c.channel.includes("WhatsApp");
    if (activeTab === "sms") return c.channel.includes("SMS");
    if (activeTab === "voice") return c.channel.includes("Voice");
    return true;
  });

  const handleToggleBirthday = () => {
    const nextState = !birthdayAutoPilot;
    setBirthdayAutoPilot(nextState);
    showToast(
      nextState ? "success" : "info",
      nextState ? "Birthday Auto-Pilot Enabled" : "Birthday Auto-Pilot Paused",
      nextState
        ? "Automated Marathi greetings will dispatch daily at 08:00 AM to registered birthday voters."
        : "Automated daily birthday greetings paused."
    );
  };

  const handleFinishWizard = () => {
    const newCamp: CampaignItem = {
      id: `CMP-${Math.floor(500 + Math.random() * 500)}`,
      name: wizardCampaignName.trim() || `${wizardChannel} Outreach Broadcast`,
      channel:
        wizardChannel === "WhatsApp"
          ? "WhatsApp Broadcast"
          : wizardChannel === "SMS"
          ? "SMS Dispatch"
          : "AI Voice IVR",
      targetAudience: `${wizardAudienceTarget} (${wizardAudienceWard})`,
      sentCount: 0,
      totalTarget: 4800,
      deliveryRate: "Queued",
      status: wizardScheduleType === "immediate" ? "Active Dispatch" : "Scheduled",
      scheduledFor: wizardScheduleType === "immediate" ? "Immediate Dispatch" : wizardScheduleTime,
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    setShowWizard(false);
    setWizardStep(1);
    setWizardCampaignName("");

    showToast(
      "success",
      "Campaign Scheduled & Dispatched",
      `Campaign #${newCamp.id} created for 4,800 electors via ${wizardChannel}. Meta Cloud queue active.`
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 13: Campaign Control
            </span>
            <Badge variant="teal">Meta Cloud API Live</Badge>
            <Badge variant="ai">AI Voice Bot Connected</Badge>
            <Badge variant="neutral">Wallet Balance: ₹42,500</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Campaign Control &amp; Multi-Channel Outreach Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Coordinate high-throughput WhatsApp voter slip delivery, DLT-registered SMS blasts, autonomous AI voice calls, and automated birthday greetings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="md" onClick={() => setShowWizard(true)}>
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Campaign</span>
          </Button>
        </div>
      </section>

      {/* AUTOMATED BIRTHDAY WISHES AUTO-PILOT BANNER */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-brand-500/10 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                Automated Birthday Wishes Engine
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                birthdayAutoPilot ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
              }`}>
                {birthdayAutoPilot ? "AUTO-PILOT ACTIVE" : "PAUSED"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Today: <strong>34 registered voters</strong> are celebrating birthdays in AC-215. Personalized Marathi greeting with candidate audio dispatched at 08:00 AM.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleBirthday}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
            birthdayAutoPilot
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          {birthdayAutoPilot ? "Pause Auto-Pilot" : "Activate Auto-Pilot"}
        </button>
      </div>

      {/* Workspace Tabs */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "all"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All Broadcasts ({campaigns.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "whatsapp"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Workspace ({campaigns.filter((c) => c.channel.includes("WhatsApp")).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sms")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "sms"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>SMS Workspace ({campaigns.filter((c) => c.channel.includes("SMS")).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("voice")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "voice"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>AI Voice Calls ({campaigns.filter((c) => c.channel.includes("Voice")).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wallet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "wallet"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Recharge &amp; Quotas</span>
          </button>
        </div>

        {activeTab !== "wallet" ? (
          /* CAMPAIGNS LIST */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        camp.channel.includes("WhatsApp")
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : camp.channel.includes("SMS")
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                      }`}>
                        {camp.channel}
                      </span>
                      <span className="font-mono text-xs text-slate-400">#{camp.id}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white mt-1.5">
                      {camp.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{camp.targetAudience}</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    camp.status === "Completed"
                      ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      : camp.status === "Active Dispatch"
                      ? "bg-emerald-50 text-emerald-600 animate-pulse"
                      : "bg-amber-50 text-amber-600"
                  }`}>
                    {camp.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivered / Target:</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {camp.sentCount.toLocaleString()} / {camp.totalTarget.toLocaleString()} Electors
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivery Rate:</span>
                    <span className="font-mono font-bold text-brand-600">{camp.deliveryRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timing:</span>
                    <span>{camp.scheduledFor}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all"
                    style={{
                      width: `${camp.totalTarget > 0 ? (camp.sentCount / camp.totalTarget) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* WALLET & RECHARGE VIEW */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Available Wallet Credits</span>
                <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">₹42,500</div>
                <span className="text-[11px] text-emerald-600 mt-1 block">Sufficient for ~68,000 WhatsApp messages</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">AI Voice Minutes Remaining</span>
                <div className="text-2xl font-bold text-indigo-600 mt-1">8,450 Mins</div>
                <span className="text-[11px] text-slate-500 mt-1 block">Conversational Marathi Model</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">DLT Verified SMS Balance</span>
                <div className="text-2xl font-bold text-blue-600 mt-1">112,000 SMS</div>
                <span className="text-[11px] text-slate-500 mt-1 block">TRAI Approved Header Active</span>
              </div>
            </div>

            <div className="p-4 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/50 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-brand-900 dark:text-brand-200">Need Campaign Top-Up?</h4>
                <p className="text-xs text-brand-700 dark:text-brand-300 mt-0.5">
                  Submit a top-up enquiry to add bulk WhatsApp or AI Voice outreach quotas directly through your candidate account manager.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => showToast("success", "Recharge Enquiry Dispatched", "Candidate Secretariat manager notified for wallet top-up.")}
              >
                Request Recharge
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 5-STEP CAMPAIGN CREATION WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Campaign Creation Wizard
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                    Step {wizardStep} of 5
                  </span>
                </div>
                <p className="text-xs text-slate-500">Targeted constituent broadcast builder</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWizard(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Select Channel */}
            {wizardStep === 1 && (
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-white block">Step 1: Choose Broadcast Channel</span>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setWizardChannel("WhatsApp")}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      wizardChannel === "WhatsApp"
                        ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 text-emerald-600 mb-2" />
                    <div className="font-bold text-sm">WhatsApp</div>
                    <div className="text-[11px] text-slate-500 mt-1">Official PDF Voter Slips &amp; Location link</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardChannel("SMS")}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      wizardChannel === "SMS"
                        ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <Send className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="font-bold text-sm">SMS Blast</div>
                    <div className="text-[11px] text-slate-500 mt-1">High-delivery text broadcast via DLT</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardChannel("Voice")}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      wizardChannel === "Voice"
                        ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <PhoneCall className="w-5 h-5 text-purple-600 mb-2" />
                    <div className="font-bold text-sm">AI Voice IVR</div>
                    <div className="text-[11px] text-slate-500 mt-1">Candidate audio recording + AI responses</div>
                  </button>
                </div>

                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    value={wizardCampaignName}
                    onChange={(e) => setWizardCampaignName(e.target.value)}
                    placeholder="e.g. Ward 12 Morning Slip Delivery"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Target Audience */}
            {wizardStep === 2 && (
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-white block">Step 2: Define Demographic Target Audience</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ward Filter</label>
                    <select
                      value={wizardAudienceWard}
                      onChange={(e) => setWizardAudienceWard(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="All Wards">All Wards (AC-215)</option>
                      <option value="Ward 12 (Kothrud)">Ward 12 (Kothrud)</option>
                      <option value="Ward 14 (Erandwane)">Ward 14 (Erandwane)</option>
                      <option value="Ward 9 (Gaothan)">Ward 9 (Gaothan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Audience Segment</label>
                    <select
                      value={wizardAudienceTarget}
                      onChange={(e) => setWizardAudienceTarget(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="Verified Mobile Electors">All Verified Mobile Electors</option>
                      <option value="Ladki Bahin Beneficiaries">Ladki Bahin Beneficiaries</option>
                      <option value="Youth (18 - 25 Years)">Youth (18 - 25 Years)</option>
                      <option value="Senior Citizens (60+ Years)">Senior Citizens (60+ Years)</option>
                      <option value="Business & Traders">Business &amp; Traders</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Reachable Electors:</span>
                    <span className="text-brand-600 font-bold">4,800 Electors</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Filters applied from Module 04 Master Taxonomy.</p>
                </div>
              </div>
            )}

            {/* Step 3: Template & Placeholders */}
            {wizardStep === 3 && (
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-white block">Step 3: Message Template &amp; Placeholders</span>
                <div>
                  <textarea
                    rows={4}
                    value={wizardTemplateMessage}
                    onChange={(e) => setWizardTemplateMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-brand-600">{`{{voter_name}}`}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-brand-600">{`{{booth_name}}`}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-brand-600">{`{{booth_number}}`}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-brand-600">{`{{slip_link}}`}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Scheduling */}
            {wizardStep === 4 && (
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-white block">Step 4: Dispatch Timing</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="sched"
                      checked={wizardScheduleType === "immediate"}
                      onChange={() => setWizardScheduleType("immediate")}
                    />
                    <div>
                      <span className="font-bold block">Immediate Dispatch</span>
                      <span className="text-slate-500 text-[11px]">Dispatch into broadcast queue as soon as confirmed.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="sched"
                      checked={wizardScheduleType === "scheduled"}
                      onChange={() => setWizardScheduleType("scheduled")}
                    />
                    <div>
                      <span className="font-bold block">Schedule for Specific Date &amp; Time</span>
                      <input
                        type="datetime-local"
                        value={wizardScheduleTime}
                        onChange={(e) => setWizardScheduleTime(e.target.value)}
                        className="mt-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Cost Preview & Confirmation */}
            {wizardStep === 5 && (
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-white block">Step 5: Review &amp; Confirm Dispatch</span>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Campaign Channel:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{wizardChannel} Broadcast</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Audience:</span>
                    <span className="font-bold">{wizardAudienceTarget} ({wizardAudienceWard})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Electors:</span>
                    <span className="font-mono font-bold text-brand-600">4,800 Electors</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Quota Deduction:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">₹2,880</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sufficient wallet balance available (₹42,500). Ready for dispatch.</span>
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4 | 5) : 1))}
              >
                Back
              </Button>

              {wizardStep < 5 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setWizardStep((prev) => (prev < 5 ? ((prev + 1) as 1 | 2 | 3 | 4 | 5) : 5))}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleFinishWizard} className="bg-emerald-600 hover:bg-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Dispatch</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
