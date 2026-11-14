"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  MessageSquare,
  PhoneCall,
  Send,
  CreditCard,
  ArrowRight,
  X,
  Gift,
  Check,
  AlertTriangle,
  UploadCloud,
  ImageIcon,
  FileWarning,
  Trash2,
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
  const pathname = usePathname();
  const basePath = pathname.startsWith("/candidate") ? "/candidate" : "";
  const subscriptionsUrl = `${basePath}/subscriptions`;

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
  const [attachedCreative, setAttachedCreative] = useState<{ name: string; size: string } | null>(null);
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [restrictionErrorMsg, setRestrictionErrorMsg] = useState("");

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset native input so change event triggers reliably
    e.target.value = "";

    const lowerName = file.name.toLowerCase();
    const isVideoOrAudio =
      file.type.startsWith("video/") ||
      file.type.startsWith("audio/") ||
      lowerName.endsWith(".mp4") ||
      lowerName.endsWith(".mov") ||
      lowerName.endsWith(".avi") ||
      lowerName.endsWith(".mkv") ||
      lowerName.endsWith(".mp3") ||
      lowerName.endsWith(".wav") ||
      lowerName.endsWith(".aac") ||
      lowerName.endsWith(".m4a");

    if (isVideoOrAudio) {
      setRestrictionErrorMsg(
        "Video & Audio files are restricted to prevent high data load. Please select an image (JPG, PNG, WebP) under 5MB."
      );
      setShowRestrictionModal(true);
      return;
    }

    const isImage =
      file.type.startsWith("image/") ||
      lowerName.endsWith(".jpg") ||
      lowerName.endsWith(".jpeg") ||
      lowerName.endsWith(".png") ||
      lowerName.endsWith(".webp");

    if (!isImage) {
      setRestrictionErrorMsg(
        "Unsupported file format. Please select an image (JPG, PNG, WebP) under 5MB."
      );
      setShowRestrictionModal(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setRestrictionErrorMsg(
        "File size exceeds 5MB limit. Please compress your image (JPG, PNG, WebP) under 5MB."
      );
      setShowRestrictionModal(true);
      return;
    }

    // Valid Image File
    setAttachedCreative({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    });

    showToast(
      "success",
      "Campaign Creative Attached",
      `Image ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB) verified and ready.`
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
    setAttachedCreative(null);

    showToast(
      "success",
      "Campaign Scheduled & Dispatched",
      `Campaign #${newCamp.id} created for 4,800 electors via ${wizardChannel}. Meta Cloud queue active.`
    );
  };

  return (
    <div className="space-y-5">
      {/* SECTION 5: CRITICAL LOW BROADCAST BALANCE QUOTA WARNING BANNER (< 5%) */}
      <div className="bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-rose-500/15 border-2 border-rose-500/60 dark:border-rose-600/70 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                Quota Warning: Broadcast Balance &lt; 5% Remaining
              </h3>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                1,240 / 25,000 Credits Left
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Your remaining broadcast quota is below 5%. Recharging is required immediately to prevent scheduled campaign suspensions across WhatsApp and SMS channels.
            </p>
          </div>
        </div>

        <Link
          href={subscriptionsUrl}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
        >
          <CreditCard className="w-4 h-4" />
          <span>Recharge Quota / Upgrade Plan</span>
        </Link>
      </div>

      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 dark:text-brand-400 px-2.5 py-0.5 rounded-full">
              Module 13: Campaign Control
            </span>
            <Badge variant="teal">Meta Cloud API Live</Badge>
            <Badge variant="ai">AI Voice Bot Connected</Badge>
            <Badge variant="neutral">Quota Balance: 1,240 / 25,000</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Campaign Control &amp; Multi-Channel Outreach Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
            <span>SMS Blasts ({campaigns.filter((c) => c.channel.includes("SMS")).length})</span>
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
            <span>Recharge &amp; Quota Warning</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab !== "wallet" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((camp) => (
                <div
                  key={camp.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-brand-500/50 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                          {camp.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {camp.channel}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white mt-1">
                        {camp.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Target: {camp.targetAudience}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        camp.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : camp.status === "Active Dispatch"
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Dispatched:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {camp.sentCount.toLocaleString()} / {camp.totalTarget.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Delivery Rate:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {camp.deliveryRate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Timing:</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        {camp.scheduledFor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* WALLET & RECHARGE VIEW */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Remaining Broadcast Quota</span>
                <div className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">1,240 Credits</div>
                <span className="text-[11px] text-rose-600 font-semibold mt-1 block">CRITICAL: Below 5% threshold (25,000 package)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">AI Voice Minutes Remaining</span>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">8,450 Mins</div>
                <span className="text-[11px] text-slate-500 mt-1 block">Conversational Marathi Model</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">DLT Verified SMS Balance</span>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">112,000 SMS</div>
                <span className="text-[11px] text-slate-500 mt-1 block">TRAI Approved Header Active</span>
              </div>
            </div>

            <div className="p-4 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/50 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-brand-900 dark:text-brand-200">Recharge Required Immediately</h4>
                <p className="text-xs text-brand-700 dark:text-brand-300 mt-0.5">
                  Submit an instant top-up enquiry to add bulk WhatsApp or AI Voice outreach quotas directly through your candidate account manager.
                </p>
              </div>
              <Link
                href={subscriptionsUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all cursor-pointer shadow-sm"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Go to Subscriptions</span>
              </Link>
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
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300">
                    Step {wizardStep} of 5
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Targeted constituent broadcast builder</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWizard(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
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
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
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
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
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
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
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
                    <span className="text-brand-600 dark:text-brand-400 font-bold">4,800 Electors</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Filters applied from Module 04 Master Taxonomy.</p>
                </div>
              </div>
            )}

            {/* Step 3: Template & Creative (Section 5 Multimedia Validation) */}
            {wizardStep === 3 && (
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-white block">Step 3: Message Template &amp; Media Creative</span>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Message Body</label>
                  <textarea
                    rows={3}
                    value={wizardTemplateMessage}
                    onChange={(e) => setWizardTemplateMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-brand-600 dark:text-brand-400">{`{{voter_name}}`}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-brand-600 dark:text-brand-400">{`{{booth_name}}`}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-brand-600 dark:text-brand-400">{`{{booth_number}}`}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-brand-600 dark:text-brand-400">{`{{slip_link}}`}</span>
                  </div>
                </div>

                {/* Section 5 File Upload Attachment with Image-Only Validation */}
                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Multimedia Creative (Optional Attachment)
                  </label>
                  
                  {attachedCreative ? (
                    <div className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-brand-600 text-white">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-white block text-xs">
                            {attachedCreative.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            Verified Image ({attachedCreative.size}) • JPG/PNG/WebP Validated
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedCreative(null)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-all"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-brand-500 transition-all bg-slate-50/50 dark:bg-slate-800/40">
                      <input
                        type="file"
                        id="creative-file-input"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        title="Upload Creative Image"
                      />
                      <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                        <UploadCloud className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Click to upload campaign banner image
                        </span>
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400">
                          Supports <strong>JPG, PNG, WebP</strong> up to 5MB. Video &amp; Audio restricted.
                        </span>
                      </div>
                    </div>
                  )}
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
                        className="mt-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
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
                  {attachedCreative && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Attached Creative:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {attachedCreative.name} ({attachedCreative.size})
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Electors:</span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400">4,800 Electors</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Quota Deduction:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">₹2,880</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Low quota warning: deduction will trigger urgent recharge notification.</span>
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

      {/* SECTION 5: STRICT MULTIMEDIA RESTRICTION MODAL */}
      {showRestrictionModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <FileWarning className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Multimedia Upload Restricted
                </h3>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  High Data Load Prevention Policy
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {restrictionErrorMsg ||
                "Video & Audio files are restricted to prevent high data load. Please select an image (JPG, PNG, WebP) under 5MB."}
            </p>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowRestrictionModal(false)}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                Understood, Select Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
