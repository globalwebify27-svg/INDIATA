"use client";

import React, { useState, useMemo } from "react";
import {
  Megaphone,
  CreditCard,
  MessageSquare,
  Mail,
  Headphones,
  Plus,
  Search,
  Pause,
  Play,
  X,
  ChevronRight,
  TrendingUp,
  Layers,
  User,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

export type CampaignChannel = "WHATSAPP" | "SMS" | "AI_VOICE" | "BULK";
export type CampaignStatus = "RUNNING" | "SCHEDULED" | "COMPLETED" | "PAUSED" | "DRAFT";

export interface CampaignRecord {
  id: string;
  name: string;
  channel: CampaignChannel;
  campaignType: string;
  targetAudience: string;
  recipientCount: number;
  deliveredCount?: number;
  readCount?: number;
  answeredCount?: number;
  failedCount?: number;
  callDurationSeconds?: number;
  status: CampaignStatus;
  scheduledTime: string;
  createdDate: string;
  messageTemplate: string;
  estimatedCostCredits: number;
  booths?: number[];
  language?: string;
  voiceModel?: string;
}

export interface ChannelCredits {
  whatsapp: number;
  sms: number;
  voice: number;
  totalBalanceInr: number;
}

export interface AutomationTrigger {
  id: string;
  name: string;
  campaignType: string;
  channel: CampaignChannel;
  trigger: string;
  audience: string;
  lastExecution: string;
  nextExecution: string;
  status: "ACTIVE" | "PAUSED";
  sentToday: number;
  failedCount: number;
  templateSnippet: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  channel: CampaignChannel;
  status: "APPROVED" | "PENDING";
  content: string;
  variables: string[];
}

export interface VoterResponseItem {
  id: string;
  voterName: string;
  mobile: string;
  campaign: string;
  channel: CampaignChannel;
  messageReceived: string;
  receivedDate: string;
  responseStatus: "NEW" | "ACTIONED";
  callDuration?: string;
  summary?: string;
}

export const SEED_CAMPAIGNS: CampaignRecord[] = [
  {
    id: "cmp-01",
    name: "Voter Slip Broadcast - Booths 101 to 105",
    channel: "WHATSAPP",
    campaignType: "Voter Slip Sharing",
    targetAudience: "Verified Supporters & Neutrals in Kothrud (Booths 101-105)",
    recipientCount: 4500,
    deliveredCount: 4320,
    readCount: 3890,
    failedCount: 180,
    status: "RUNNING",
    scheduledTime: "2024-04-18 09:00 AM",
    createdDate: "2024-04-17",
    messageTemplate:
      "Namaskar {Name} ji! Here is your official voter slip for Booth #{Booth}. Vote for change and development on Election Day!",
    estimatedCostCredits: 4500,
    booths: [101, 102, 103, 104, 105],
  },
  {
    id: "cmp-02",
    name: "Youth First-Time Voter Drive",
    channel: "SMS",
    campaignType: "Voting Information",
    targetAudience: "Voters aged 18-24 across all Prabhaags",
    recipientCount: 8200,
    deliveredCount: 7950,
    readCount: 7100,
    failedCount: 250,
    status: "COMPLETED",
    scheduledTime: "2024-04-16 06:00 PM",
    createdDate: "2024-04-15",
    messageTemplate:
      "Your vote shapes Pune's future! Check your polling center online at Indata Portal or contact our helpline at 1800-INDATA.",
    estimatedCostCredits: 8200,
  },
  {
    id: "cmp-03",
    name: "Candidate Audio Message by Adv. Vikram Patil",
    channel: "AI_VOICE",
    campaignType: "General Announcement",
    targetAudience: "Senior Citizens & Women Beneficiaries",
    recipientCount: 12000,
    deliveredCount: 10450,
    readCount: 8900,
    answeredCount: 9680,
    callDurationSeconds: 42,
    failedCount: 1550,
    status: "SCHEDULED",
    scheduledTime: "2024-04-20 10:00 AM",
    createdDate: "2024-04-18",
    messageTemplate:
      "Personal voice message highlighting Ladki Bahin assistance, healthcare expansion, and metro line extensions in Pune.",
    estimatedCostCredits: 24000,
    language: "Marathi (Pune dialect)",
    voiceModel: "Adv. Vikram Patil (AI Cloned HD)",
  },
  {
    id: "cmp-04",
    name: "Booth Turnout Surge Reminder",
    channel: "BULK",
    campaignType: "Election Day Reminder",
    targetAudience: "Booths 103, 105, 108 (Identified Swing Zones)",
    recipientCount: 3500,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    status: "DRAFT",
    scheduledTime: "2024-04-22 07:00 AM",
    createdDate: "2024-04-18",
    messageTemplate:
      "Voting has begun! Polls close at 6 PM. Transport assistance available from booth karyakartas.",
    estimatedCostCredits: 3500,
    booths: [103, 105, 108],
  },
  {
    id: "cmp-05",
    name: "Shiv Jayanti Greetings Broadcast",
    channel: "WHATSAPP",
    campaignType: "Festival / Holiday Greetings",
    targetAudience: "All Verified WhatsApp Contacts (Prabhaag 12)",
    recipientCount: 15400,
    deliveredCount: 15120,
    readCount: 14200,
    failedCount: 280,
    status: "COMPLETED",
    scheduledTime: "2024-02-19 08:00 AM",
    createdDate: "2024-02-18",
    messageTemplate:
      "Jai Bhavani, Jai Shivaji! Heartiest wishes on Chhatrapati Shivaji Maharaj Jayanti from Adv. Vikram Patil & Family.",
    estimatedCostCredits: 15400,
  },
  {
    id: "cmp-06",
    name: "Senior Citizen Wheelchair Van Coordination",
    channel: "AI_VOICE",
    campaignType: "Volunteer / Worker Communication",
    targetAudience: "Voters 65+ with Wheelchair Assistance Flag",
    recipientCount: 1420,
    deliveredCount: 1380,
    readCount: 1300,
    answeredCount: 1310,
    callDurationSeconds: 35,
    failedCount: 40,
    status: "SCHEDULED",
    scheduledTime: "2024-04-21 04:00 PM",
    createdDate: "2024-04-18",
    messageTemplate:
      "Namaskar! Wheelchair transport van has been scheduled for your household tomorrow at 9 AM for Booth 101.",
    estimatedCostCredits: 2840,
    language: "Marathi",
    voiceModel: "Karyakarta Voice Agent",
  },
];

export const SEED_TEMPLATES: TemplateItem[] = [
  {
    id: "tpl-wa-01",
    name: "Voter Information Slip with QR & Map Link",
    category: "Election Communication",
    channel: "WHATSAPP",
    status: "APPROVED",
    content:
      "Namaskar {Voter Name} ji, your voting booth is {Booth Number} at {Polling Station}. Tap here to download digital voter slip.",
    variables: ["{Voter Name}", "{Booth Number}", "{Polling Station}"],
  },
  {
    id: "tpl-wa-02",
    name: "Official Birthday Greetings & Good Health Wishes",
    category: "Birthday",
    channel: "WHATSAPP",
    status: "APPROVED",
    content:
      "Happy Birthday, {Voter Name} ji! Wishing you health, peace and happiness ahead. Warm regards, Adv. Vikram Patil & Family.",
    variables: ["{Voter Name}"],
  },
  {
    id: "tpl-sms-01",
    name: "Election Day Morning Turnout Push",
    category: "Reminder",
    channel: "SMS",
    status: "APPROVED",
    content:
      "Voting has begun! Cast your vote at Booth #{Booth Number}. Free transport helpline: 1800-INDATA.",
    variables: ["{Booth Number}"],
  },
  {
    id: "tpl-voice-01",
    name: "Candidate Audio Broadcast - Healthcare & Metro",
    category: "Announcement",
    channel: "AI_VOICE",
    status: "APPROVED",
    content:
      "Namaskar, mi Adv. Vikram Patil bolat ahe. Kasba Peth chya sarvangin vikasasathi aple aashirwad dya.",
    variables: ["{Candidate Name}"],
  },
];

export function CampaignControlView() {
  const { showToast } = useToast();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "WHATSAPP" | "SMS" | "AI_VOICE" | "BILLING">("OVERVIEW");
  const [channelSubView, setChannelSubView] = useState<
    "DASHBOARD" | "LIVE" | "CREATE" | "INDIVIDUAL" | "AUTOMATED" | "TEMPLATES" | "STATS" | "RESPONSES"
  >("DASHBOARD");

  // Balances
  const [credits, setCredits] = useState<ChannelCredits>({
    whatsapp: 48250,
    sms: 92400,
    voice: 31800,
    totalBalanceInr: 18450,
  });

  // Campaigns Data
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(SEED_CAMPAIGNS);

  // Filters
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);

  // Wizard state
  const [wizardMode, setWizardMode] = useState<"BULK" | "INDIVIDUAL">("BULK");
  const [wizardChannel, setWizardChannel] = useState<CampaignChannel>("WHATSAPP");
  const [wizardType, setWizardType] = useState<string>("Election Day Reminder");
  const [wizardName, setWizardName] = useState<string>("Polling Day Turnout Push");
  const [wizardAudience, setWizardAudience] = useState<"CONSTITUENCY" | "BOOTHS" | "SEGMENT">("CONSTITUENCY");
  const [wizardMessage, setWizardMessage] = useState<string>(
    "Namaskar {Voter Name} ji! Here is your official voter slip for Booth #{Booth Number}. Vote for change and development on Election Day!"
  );
  const [wizardSchedule, setWizardSchedule] = useState<"NOW" | "SCHEDULED">("NOW");

  // Calculations
  const stats = useMemo(() => {
    return {
      total: campaigns.length,
      active: campaigns.filter((c) => c.status === "RUNNING").length,
      scheduled: campaigns.filter((c) => c.status === "SCHEDULED").length,
      completed: campaigns.filter((c) => c.status === "COMPLETED").length,
      totalSent: 41520,
      callsMade: 13420,
      failedComms: 2300,
      availCredits: "1.72L",
    };
  }, [campaigns]);

  const channelStats = useMemo(() => {
    return {
      whatsapp: {
        sent: 19900,
        delivered: 19440,
        read: 18090,
        failed: 460,
      },
      sms: {
        sent: 8200,
        delivered: 7950,
        segments: "1.0 avg",
        failed: 250,
      },
      voice: {
        sent: 13420,
        answered: 10990,
        avgDur: "40s",
        failed: 1590,
      },
    };
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchChannel =
        activeTab === "OVERVIEW"
          ? channelFilter === "ALL" || c.channel === channelFilter
          : c.channel === activeTab;

      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchSearch =
        !searchQuery.trim() ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.channel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchChannel && matchStatus && matchSearch;
    });
  }, [campaigns, activeTab, channelFilter, statusFilter, searchQuery]);

  const toggleCampaignStatus = (id: string, currentStatus: CampaignStatus) => {
    const nextStatus: CampaignStatus = currentStatus === "RUNNING" ? "PAUSED" : "RUNNING";
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    );
    showToast(
      "info",
      "Campaign Updated",
      `Campaign ${nextStatus === "RUNNING" ? "resumed" : "paused"} successfully.`
    );
  };

  const handleLaunchCampaign = () => {
    const newCamp: CampaignRecord = {
      id: `cmp-0${campaigns.length + 1}`,
      name: wizardName.trim() || "Multi-Channel Voter Broadcast",
      channel: wizardChannel,
      campaignType: wizardType,
      targetAudience:
        wizardAudience === "CONSTITUENCY"
          ? "All Verified Electors (Assembly 215)"
          : "Targeted Booths Segment",
      recipientCount: 5000,
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
      status: wizardSchedule === "NOW" ? "RUNNING" : "SCHEDULED",
      scheduledTime: wizardSchedule === "NOW" ? "Just now" : "2024-04-20 10:00 AM",
      createdDate: "2024-04-18",
      messageTemplate: wizardMessage,
      estimatedCostCredits: 5000,
    };

    setCampaigns([newCamp, ...campaigns]);
    setShowGenerateModal(false);
    showToast(
      "success",
      "Campaign Launched",
      `Campaign "${newCamp.name}" queued for multi-channel dispatch.`
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800 select-none">
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Outreach & Communication
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-blue-600">Campaign Control Centre</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 ml-1">
              215 - Kasba Peth
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Multi-Channel Communication Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Execute and monitor WhatsApp blasts, SMS broadcasts, AI Voice outbound calls, and automated trigger sequences with end-to-end delivery verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Total Balance Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <CreditCard className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                Total Balance
              </span>
              <span className="font-bold text-slate-900">
                ₹{credits.totalBalanceInr.toLocaleString()} (Credits)
              </span>
            </div>
          </div>

          {/* Recharge Credits Button */}
          <button
            type="button"
            onClick={() => setShowRechargeModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>$ Recharge Credits</span>
          </button>

          {/* Generate Campaign Primary Button */}
          <button
            type="button"
            onClick={() => {
              setShowGenerateModal(true);
              setWizardStep(1);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Generate Campaign</span>
          </button>
        </div>
      </div>

      {/* 2. TOP WORKSPACE TABS */}
      <div className="flex flex-wrap items-center bg-white p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shadow-xs gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("OVERVIEW")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "OVERVIEW"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Campaign Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("WHATSAPP");
            setChannelSubView("DASHBOARD");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "WHATSAPP"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Workspace</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {credits.whatsapp.toLocaleString()}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("SMS");
            setChannelSubView("DASHBOARD");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "SMS"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>SMS Workspace</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {credits.sms.toLocaleString()}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("AI_VOICE");
            setChannelSubView("DASHBOARD");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "AI_VOICE"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Headphones className="w-4 h-4 text-purple-500" />
          <span>AI Voice Call Workspace</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700">
            {credits.voice.toLocaleString()}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("BILLING")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "BILLING"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-500" />
          <span>Recharge & Billing</span>
        </button>
      </div>

      {/* 3. CAMPAIGN DASHBOARD TAB (OVERVIEW) */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6 animate-fade-in">
          {/* 8 KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Campaigns
              </span>
              <div className="text-xl font-black text-slate-900 mt-1">{stats.total}</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Active Live
              </span>
              <div className="text-xl font-black text-blue-600 mt-1">{stats.active}</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                Scheduled
              </span>
              <div className="text-xl font-black text-purple-600 mt-1">{stats.scheduled}</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Completed
              </span>
              <div className="text-xl font-black text-blue-700 mt-1">{stats.completed}</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Sent
              </span>
              <div className="text-xl font-black text-slate-900 mt-1">
                {stats.totalSent.toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Calls Made
              </span>
              <div className="text-xl font-black text-blue-600 mt-1">
                {stats.callsMade.toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                Failed Comms
              </span>
              <div className="text-xl font-black text-rose-600 mt-1">{stats.failedComms}</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                Avail Credits
              </span>
              <div className="text-xl font-black text-amber-600 mt-1">{stats.availCredits}</div>
            </div>
          </div>

          {/* 3 CHANNEL OVERVIEW CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* WhatsApp Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">WhatsApp Business API</h3>
                      <span className="text-[10px] text-blue-600 font-bold">Meta Cloud Verified</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {credits.whatsapp.toLocaleString()} Credits
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl my-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent</span>
                    <span className="font-bold text-slate-900">
                      {channelStats.whatsapp.sent.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">Delivered</span>
                    <span className="font-bold text-blue-600">
                      {channelStats.whatsapp.delivered.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-700 block">Read</span>
                    <span className="font-bold text-blue-700">
                      {channelStats.whatsapp.read.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Failed</span>
                    <span className="font-bold text-rose-600">{channelStats.whatsapp.failed}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("WHATSAPP");
                  setChannelSubView("DASHBOARD");
                }}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open WhatsApp Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SMS Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">DLT Transactional SMS</h3>
                      <span className="text-[10px] text-blue-600 font-bold">TRAI DLT Registered Header</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {credits.sms.toLocaleString()} Credits
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl my-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent</span>
                    <span className="font-bold text-slate-900">
                      {channelStats.sms.sent.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">Delivered</span>
                    <span className="font-bold text-blue-600">
                      {channelStats.sms.delivered.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Segments</span>
                    <span className="font-bold text-slate-900">{channelStats.sms.segments}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Failed</span>
                    <span className="font-bold text-rose-600">{channelStats.sms.failed}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("SMS");
                  setChannelSubView("DASHBOARD");
                }}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open SMS Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* AI Voice Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">AI Voice Outbound Engine</h3>
                      <span className="text-[10px] text-purple-600 font-bold">Marathi Cloned Speech</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {credits.voice.toLocaleString()} Credits
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl my-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Calls Made</span>
                    <span className="font-bold text-slate-900">
                      {channelStats.voice.sent.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Answered</span>
                    <span className="font-bold text-purple-600">
                      {channelStats.voice.answered.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Dur.</span>
                    <span className="font-bold text-slate-900">{channelStats.voice.avgDur}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Failed</span>
                    <span className="font-bold text-rose-600">{channelStats.voice.failed}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("AI_VOICE");
                  setChannelSubView("DASHBOARD");
                }}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open AI Voice Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* BROADCAST ACTIVITY TABLE SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  <span>Recent Multi-Channel Broadcast Activity</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time broadcast execution pipeline across WhatsApp, SMS, and Outbound Voice Agents.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search campaign name or audience..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="ALL">All Channels</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="AI_VOICE">AI Voice</option>
                  <option value="BULK">Bulk</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="RUNNING">Running</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PAUSED">Paused</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-3">Campaign Name</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">Campaign Type</th>
                    <th className="py-2.5 px-3">Audience & Reach</th>
                    <th className="py-2.5 px-3">Scheduled / Sent Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredCampaigns.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCampaign(c)}
                      className="cursor-pointer hover:bg-slate-50 transition"
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{c.id}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                            c.channel === "WHATSAPP"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : c.channel === "SMS"
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : c.channel === "AI_VOICE"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {c.channel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {c.campaignType || "General Announcement"}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 truncate max-w-xs">
                          {c.targetAudience}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {c.recipientCount.toLocaleString()} Contacts
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {c.scheduledTime}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === "RUNNING"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : c.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : c.status === "SCHEDULED"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : c.status === "PAUSED"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td
                        className="py-3 px-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {c.status === "RUNNING" || c.status === "PAUSED" ? (
                            <button
                              type="button"
                              onClick={() => toggleCampaignStatus(c.id, c.status)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                              title={c.status === "RUNNING" ? "Pause Campaign" : "Resume Campaign"}
                            >
                              {c.status === "RUNNING" ? (
                                <Pause className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-blue-600" />
                              )}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setSelectedCampaign(c)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCampaigns.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No broadcast campaigns match your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. CHANNEL WORKSPACE TABS (WHATSAPP, SMS, AI_VOICE) */}
      {(activeTab === "WHATSAPP" || activeTab === "SMS" || activeTab === "AI_VOICE") && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub-Tabs Nav */}
          <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700 gap-1">
            {[
              { id: "DASHBOARD", label: "Dashboard" },
              { id: "LIVE", label: "Live Campaigns" },
              { id: "CREATE", label: "Create Campaign" },
              { id: "INDIVIDUAL", label: "Individual Comms" },
              { id: "AUTOMATED", label: "Automated Campaigns" },
              {
                id: "TEMPLATES",
                label: activeTab === "AI_VOICE" ? "Script Library" : "Template Library",
              },
              { id: "STATS", label: "Statistics & Analytics" },
              { id: "RESPONSES", label: activeTab === "AI_VOICE" ? "Call History" : "Responses" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setChannelSubView(tab.id as typeof channelSubView)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  channelSubView === tab.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Available Credits
              </span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {activeTab === "WHATSAPP"
                  ? credits.whatsapp.toLocaleString()
                  : activeTab === "SMS"
                  ? credits.sms.toLocaleString()
                  : credits.voice.toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Campaigns
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {campaigns.filter((c) => c.channel === activeTab && c.status === "RUNNING").length}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Delivered Messages
              </span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {campaigns
                  .filter((c) => c.channel === activeTab)
                  .reduce((acc, c) => acc + (c.deliveredCount || 0), 0)
                  .toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                Read / Engaged
              </span>
              <div className="text-2xl font-black text-purple-600 mt-1">
                {campaigns
                  .filter((c) => c.channel === activeTab)
                  .reduce((acc, c) => acc + (c.readCount || 0), 0)
                  .toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                Failed / Undelivered
              </span>
              <div className="text-2xl font-black text-rose-600 mt-1">
                {campaigns
                  .filter((c) => c.channel === activeTab)
                  .reduce((acc, c) => acc + (c.failedCount || 0), 0)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                Active Automations
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">2 Active</div>
            </div>
          </div>

          {/* Banner for Quick Launch */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-blue-800/40">
            <div>
              <h3 className="text-base font-black">
                Launch New{" "}
                {activeTab === "WHATSAPP"
                  ? "WhatsApp Broadcast"
                  : activeTab === "SMS"
                  ? "DLT SMS Campaign"
                  : "AI Voice Outbound Blast"}
              </h3>
              <p className="text-xs text-blue-200/90 max-w-xl mt-0.5">
                Target verified voters across booths with pre-approved templates and automated variable substitution.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setWizardChannel(activeTab);
                setShowGenerateModal(true);
                setWizardStep(1);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer shrink-0"
            >
              + Quick Campaign Wizard
            </button>
          </div>

          {/* Filtered Campaigns Table for this channel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              {activeTab === "WHATSAPP"
                ? "Active & Past WhatsApp Campaigns"
                : activeTab === "SMS"
                ? "Active & Past SMS Campaigns"
                : "Active & Past AI Voice Campaigns"}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-3">Campaign Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Target Audience</th>
                    <th className="py-2.5 px-3">Delivered</th>
                    <th className="py-2.5 px-3">Read / Answered</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {campaigns
                    .filter((c) => c.channel === activeTab)
                    .map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{c.id}</span>
                        </td>
                        <td className="py-3 px-3">{c.campaignType}</td>
                        <td className="py-3 px-3">
                          <span className="text-slate-800 font-semibold block">{c.targetAudience}</span>
                          <span className="text-[10px] text-slate-400">{c.recipientCount} contacts</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">
                          {c.deliveredCount?.toLocaleString() || 0}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-purple-600">
                          {c.readCount?.toLocaleString() || c.answeredCount?.toLocaleString() || 0}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCampaign(c)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. RECHARGE & BILLING TAB */}
      {activeTab === "BILLING" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Communication Credits, Billing & Invoice Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized balance management across WhatsApp Meta Business API, DLT SMS, and AI Outbound Speech.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRechargeModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer"
            >
              + Recharge Wallet
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                WhatsApp Balance
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {credits.whatsapp.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                ₹0.65 / utility conversation
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                DLT SMS Balance
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {credits.sms.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                ₹0.15 / 160-char segment
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                AI Voice Call Balance
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {credits.voice.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                ₹0.85 / connected minute
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Total Wallet Reserve
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{credits.totalBalanceInr.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Direct GST Tax Invoice
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Available Channel Recharge Bundles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-600">WhatsApp High-Volume Pack</div>
                  <div className="text-xl font-black text-slate-900 mt-1">₹15,000</div>
                  <p className="text-xs text-slate-500 mt-1">
                    25,000 Meta Business Utility Messages with full QR & media support.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCredits((prev) => ({ ...prev, whatsapp: prev.whatsapp + 25000 }));
                    showToast("success", "Recharge Successful", "25,000 WhatsApp credits added.");
                  }}
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Recharge WhatsApp
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-600">DLT SMS Blast Pack</div>
                  <div className="text-xl font-black text-slate-900 mt-1">₹10,000</div>
                  <p className="text-xs text-slate-500 mt-1">
                    70,000 160-character promotional/transactional SMS credits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCredits((prev) => ({ ...prev, sms: prev.sms + 70000 }));
                    showToast("success", "Recharge Successful", "70,000 SMS credits added.");
                  }}
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Recharge SMS
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-600">Combo Triple-Power Pack</div>
                  <div className="text-xl font-black text-slate-900 mt-1">₹35,000</div>
                  <p className="text-xs text-slate-500 mt-1">
                    50,000 WhatsApp + 50,000 SMS + 15,000 AI Voice Outbound Minutes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCredits((prev) => ({
                      ...prev,
                      whatsapp: prev.whatsapp + 50000,
                      sms: prev.sms + 50000,
                      voice: prev.voice + 15000,
                    }));
                    showToast(
                      "success",
                      "Triple Pack Activated!",
                      "WhatsApp, SMS, and Voice balances topped up."
                    );
                  }}
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
                >
                  Activate Combo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. GUIDED CAMPAIGN GENERATOR MODAL (7 STEPS) */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Step {wizardStep} of 4 • Guided Campaign Engine
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {wizardStep === 1 && "Step 1: Select Channel & Mode"}
                  {wizardStep === 2 && "Step 2: Campaign Type & Objective"}
                  {wizardStep === 3 && "Step 3: Audience & Message Script"}
                  {wizardStep === 4 && "Step 4: Review Cost & Launch"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Select communication pipeline and batch targeting mode:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setWizardMode("BULK")}
                      className={`cursor-pointer p-4 rounded-xl border transition ${
                        wizardMode === "BULK"
                          ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Layers className="w-5 h-5 text-blue-600 mb-2" />
                      <h4 className="font-bold text-sm text-slate-900">A. Bulk Campaign</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Broadcast to thousands of verified electors, entire booths, or segmented lists.
                      </p>
                    </div>

                    <div
                      onClick={() => setWizardMode("INDIVIDUAL")}
                      className={`cursor-pointer p-4 rounded-xl border transition ${
                        wizardMode === "INDIVIDUAL"
                          ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <User className="w-5 h-5 text-purple-600 mb-2" />
                      <h4 className="font-bold text-sm text-slate-900">B. Individual Communication</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Send a 1-to-1 message or audio call to a single voter with CRM history tracking.
                      </p>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs text-slate-700 mt-4 mb-2">Select Pipeline:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "WHATSAPP",
                        label: "WhatsApp API",
                        icon: MessageSquare,
                        bal: credits.whatsapp,
                      },
                      { id: "SMS", label: "DLT SMS", icon: Mail, bal: credits.sms },
                      {
                        id: "AI_VOICE",
                        label: "AI Voice Call",
                        icon: Headphones,
                        bal: credits.voice,
                      },
                    ].map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => setWizardChannel(ch.id as CampaignChannel)}
                        className={`cursor-pointer p-3.5 rounded-xl border transition ${
                          wizardChannel === ch.id
                            ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <ch.icon className="w-4 h-4 text-blue-600 mb-1" />
                        <span className="font-bold text-xs block text-slate-900">{ch.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {ch.bal.toLocaleString()} credits
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Choose campaign intent to load pre-cleared templates and compliance headers:
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={wizardName}
                      onChange={(e) => setWizardName(e.target.value)}
                      placeholder="e.g. Polling Day Turnout Push"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Campaign Type & Goal *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        "Election Day Reminder",
                        "Voter Slip Sharing",
                        "Polling Booth Information",
                        "Birthday Messages",
                        "Festival / Holiday Greetings",
                        "General Announcement",
                        "Volunteer / Worker Communication",
                      ].map((t) => (
                        <div
                          key={t}
                          onClick={() => setWizardType(t)}
                          className={`cursor-pointer p-3 rounded-xl border text-xs font-semibold transition ${
                            wizardType === t
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "CONSTITUENCY", label: "Full Assembly (215)" },
                      { id: "BOOTHS", label: "Specific Booths" },
                      { id: "SEGMENT", label: "Custom Filter Segment" },
                    ].map((aud) => (
                      <button
                        key={aud.id}
                        type="button"
                        onClick={() => setWizardAudience(aud.id as typeof wizardAudience)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          wizardAudience === aud.id
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        {aud.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message Content / Voice Script *
                    </label>
                    <textarea
                      rows={4}
                      value={wizardMessage}
                      onChange={(e) => setWizardMessage(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] text-slate-400">Insert tag:</span>
                      {["{Voter Name}", "{Booth Number}", "{Polling Station}"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setWizardMessage((prev) => prev + " " + tag)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Campaign Name:</span>
                      <span className="font-bold text-slate-900">{wizardName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pipeline Channel:</span>
                      <span className="font-bold text-blue-600 font-mono">{wizardChannel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Reach:</span>
                      <span className="font-bold text-slate-900">5,000 Verified Electors</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Cost:</span>
                      <span className="font-bold text-amber-600 font-mono">5,000 Credits</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700">Dispatch Time:</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setWizardSchedule("NOW")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          wizardSchedule === "NOW"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        Dispatch Immediately
                      </button>
                      <button
                        type="button"
                        onClick={() => setWizardSchedule("SCHEDULED")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          wizardSchedule === "SCHEDULED"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        Schedule for Later
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunchCampaign}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-sm"
                >
                  Confirm & Launch Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. RECHARGE MODAL */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Recharge Communication Wallet</h3>
              <button
                type="button"
                onClick={() => setShowRechargeModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-amber-800">Current Wallet Reserve:</span>
                <span className="font-bold text-amber-900 text-sm">
                  ₹{credits.totalBalanceInr.toLocaleString()}
                </span>
              </div>

              {[
                {
                  title: "WhatsApp Surge Pack",
                  cost: "₹10,000",
                  perk: "15,000 WhatsApp Messages",
                  action: () => setCredits((p) => ({ ...p, whatsapp: p.whatsapp + 15000 })),
                },
                {
                  title: "SMS High-Throughput Pack",
                  cost: "₹5,000",
                  perk: "35,000 SMS Broadcasts",
                  action: () => setCredits((p) => ({ ...p, sms: p.sms + 35000 })),
                },
                {
                  title: "AI Voice Marathi Pack",
                  cost: "₹15,000",
                  perk: "18,000 Outbound Call Mins",
                  action: () => setCredits((p) => ({ ...p, voice: p.voice + 18000 })),
                },
              ].map((pack) => (
                <div
                  key={pack.title}
                  className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50"
                >
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{pack.title}</h5>
                    <p className="text-[11px] text-slate-500">{pack.perk}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      pack.action();
                      setShowRechargeModal(false);
                      showToast(
                        "success",
                        "Recharge Completed",
                        `Added ${pack.perk} to your organization balance.`
                      );
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Pay {pack.cost}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. CAMPAIGN DETAILS MODAL */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {selectedCampaign.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{selectedCampaign.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Channel:</span>
                  <span className="font-mono font-bold text-blue-600">
                    {selectedCampaign.channel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status:</span>
                  <span className="font-bold text-slate-900">{selectedCampaign.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Type:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedCampaign.campaignType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Schedule:</span>
                  <span className="font-mono text-slate-800">{selectedCampaign.scheduledTime}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Target Audience:</span>
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                  {selectedCampaign.targetAudience} ({selectedCampaign.recipientCount.toLocaleString()}{" "}
                  voters)
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Message Template:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-mono text-[11px] leading-relaxed">
                  {selectedCampaign.messageTemplate}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Delivered</span>
                  <span className="font-bold text-blue-600">
                    {selectedCampaign.deliveredCount?.toLocaleString() || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Read / Answered</span>
                  <span className="font-bold text-purple-600">
                    {selectedCampaign.readCount?.toLocaleString() ||
                      selectedCampaign.answeredCount?.toLocaleString() ||
                      0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Failed</span>
                  <span className="font-bold text-rose-600">
                    {selectedCampaign.failedCount || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
