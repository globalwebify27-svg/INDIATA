"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Play,
  PlayCircle,
  Vote,
  Check,
  Building2,
  BarChart2,
  Info,
  Sparkles,
  ArrowRight,
  X,
  ShoppingBag,
  Smartphone,
  Award,
  Printer,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

interface PlanItem {
  id: string;
  module: "ELECTION" | "OFFICE";
  name: string;
  durationLabel: string;
  durationMonths?: number;
  hasAiMode: boolean;
  tagline: string;
  popular: boolean;
  pricingStatus: "CUSTOM_QUOTE" | "CONFIGURED_TERMS";
  features: string[];
}

interface TutorialItem {
  id: string;
  category: "WAR_ROOM" | "VOTERS" | "FIELD" | "AI_MODE";
  title: string;
  duration: string;
  description: string;
  aiExclusive: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imagePlaceholder: "EVM_DEMO" | "VOTER_SEARCH" | "MERCHANDISE" | "PRINTER";
}

export function SubscriptionPlansView() {
  const { showToast } = useToast();
  const supportPhone = "+91 98220 99000";

  // Candidate metadata
  const candidateInfo = {
    candidateName: "Adv. Vikram Patil",
    partyName: "Rashtriya Vikas Morcha",
    electionName: "Lok Sabha General Elections 2024",
    constituency: "34 - Pune Parliamentary Constituency",
  };

  // State
  const [selectedModule, setSelectedModule] = useState<"ELECTION" | "OFFICE">("ELECTION");
  const [selectedPlanForReview, setSelectedPlanForReview] = useState<PlanItem | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<"PENDING" | "ACTIVE" | "EXPIRED" | "NO_REQUEST">("PENDING");
  const [currentRequest, setCurrentRequest] = useState({
    requestId: "REQ-IND-2024-884",
    module: "Election Module",
    planName: "Election Module with AI Mode",
    hasAiMode: true,
    duration: "Active until 15 days post election (June 19, 2024)",
    submittedAt: "Nov 04, 2024, 04:30 PM",
    pricingNote: "Custom Quote Review in progress by INDATA Account Desk",
  });
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [tutorialCategory, setTutorialCategory] = useState<"ALL" | "WAR_ROOM" | "VOTERS" | "FIELD" | "AI_MODE">("ALL");
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);

  // Available plans by module
  const currentPlans: PlanItem[] =
    selectedModule === "ELECTION"
      ? [
          {
            id: "plan-election-ai",
            module: "ELECTION",
            name: "Election Module with AI Mode",
            durationLabel: "Active until Election End Date + 15 Days",
            hasAiMode: true,
            tagline:
              "Complete war room intelligence with multimodal AI Strategy Bot, AI Calling & live voice agent outreach.",
            popular: true,
            pricingStatus: "CUSTOM_QUOTE",
            features: [
              "Complete War Room Dashboard & Real-Time Telemetry",
              "Global AI Mode & Strategy Advisor Bot (Unlimited Prompts)",
              "AI Voice Calling Outreach & Multi-Lingual Automated Campaigns",
              "Live Field Operations GPS Map & Turnout Projection",
              "Booth Intelligence Matrix & Swing Voter Identification",
              "Voter 360° Profile, Household Hierarchy & Roll Analytics",
              "Karyakarta Workforce & Task Management Dispatch",
              "Voter Slip Generator (Barcode & Family Bundling)",
              "Validity: Activation Date up to Election End Date + 15 Days Grace Period",
            ],
          },
          {
            id: "plan-election-no-ai",
            module: "ELECTION",
            name: "Election Module without AI Mode",
            durationLabel: "Active until Election End Date + 15 Days",
            hasAiMode: false,
            tagline:
              "Standard election campaign management, voter directory, slip printing and karyakarta tracking.",
            popular: false,
            pricingStatus: "CUSTOM_QUOTE",
            features: [
              "Complete War Room Dashboard & Standard Analytics",
              "AI Mode Not Included (AI Bot & AI Calling disabled)",
              "Live Field Operations GPS Map & Worker Check-ins",
              "Booth Matrix with Grade Ratings & BLO Coordination",
              "Voter Master Directory & Advanced Filter Segmentation",
              "Karyakarta Cadre Tracking & Survey Collection",
              "Voter Slip Printing & Distribution Accounting",
              "SMS & WhatsApp Manual Message Gateway Link",
              "Validity: Activation Date up to Election End Date + 15 Days Grace Period",
            ],
          },
        ]
      : [
          {
            id: "plan-office-6m-ai",
            module: "OFFICE",
            name: "Office – 6 Months with AI Mode",
            durationLabel: "6 Months Full Access",
            durationMonths: 6,
            hasAiMode: true,
            tagline:
              "Ongoing public office desk, grievance resolution, and constituent engagement with AI Copilot.",
            popular: false,
            pricingStatus: "CONFIGURED_TERMS",
            features: [
              "Office & Public Grievance Ticketing System",
              "Global AI Mode & Citizen Issue Summarizer",
              "Constituent Master Phone Book & Follow-up Logs",
              "Ward & Local Development Project Tracker",
              "Letter & Recommendation Certificate Generator",
              "Staff & Data Operator Roles Management",
              "6 Months Duration from Confirmed Activation Date",
            ],
          },
          {
            id: "plan-office-6m-no-ai",
            module: "OFFICE",
            name: "Office – 6 Months without AI Mode",
            durationLabel: "6 Months Full Access",
            durationMonths: 6,
            hasAiMode: false,
            tagline:
              "Core public relations office management and grievance tracker without automated AI features.",
            popular: false,
            pricingStatus: "CONFIGURED_TERMS",
            features: [
              "Public Grievance Ticketing Desk",
              "AI Mode Not Included",
              "Constituent Contact Book & Visitor Register",
              "Letter Drafts & Official Recommendation Records",
              "Standard Staff Role Permissions",
              "6 Months Duration from Confirmed Activation Date",
            ],
          },
          {
            id: "plan-office-12m-ai",
            module: "OFFICE",
            name: "Office – 12 Months with AI Mode",
            durationLabel: "12 Months Annual Access",
            durationMonths: 12,
            hasAiMode: true,
            tagline:
              "Full year enterprise constituency office automation with predictive AI grievance workflows.",
            popular: true,
            pricingStatus: "CONFIGURED_TERMS",
            features: [
              "Full 12 Months Annual Office Management Suite",
              "Global AI Mode Included (Continuous Constituency Intelligence)",
              "Unlimited Grievance Tickets & Automated Citizen Follow-ups",
              "Local Scheme Beneficiary & Government Fund Utilization Tracker",
              "Priority Phone Support & Dedicated Account Manager",
              "12 Months Duration from Confirmed Activation Date",
            ],
          },
          {
            id: "plan-office-12m-no-ai",
            module: "OFFICE",
            name: "Office – 12 Months without AI Mode",
            durationLabel: "12 Months Annual Access",
            durationMonths: 12,
            hasAiMode: false,
            tagline: "Year-round constituent CRM, office documentation and complaint registers.",
            popular: false,
            pricingStatus: "CONFIGURED_TERMS",
            features: [
              "Full 12 Months Annual Office Management Suite",
              "AI Mode Not Included",
              "Grievance Ticketing & Status Resolution Log",
              "Constituent Records & Letter History",
              "Standard Technical Support",
              "12 Months Duration from Confirmed Activation Date",
            ],
          },
        ];

  // Tutorials data
  const tutorials: TutorialItem[] = [
    {
      id: "tut-1",
      category: "WAR_ROOM",
      title: "War Room Command Dashboard Overview",
      duration: "4m 20s",
      description: "Understanding real-time voter turnout, swing booth indicators, and telemetry.",
      aiExclusive: false,
    },
    {
      id: "tut-2",
      category: "VOTERS",
      title: "Master Electoral Roll & 360° Voter Profile",
      duration: "6m 15s",
      description: "How to use quick filter cards, find family heads, and export booth-wise rolls.",
      aiExclusive: false,
    },
    {
      id: "tut-3",
      category: "FIELD",
      title: "Karyakarta Staffing & Voter Slip Distribution",
      duration: "5m 45s",
      description: "Assigning karyakartas to polling stations and tracking voter slip delivery.",
      aiExclusive: false,
    },
    {
      id: "tut-4",
      category: "AI_MODE",
      title: "Using the AI Strategy Advisor & Booth Predictor",
      duration: "8m 30s",
      description:
        "Leveraging AI strategy prompts to analyze demographic trends and speech talking points.",
      aiExclusive: true,
    },
    {
      id: "tut-5",
      category: "AI_MODE",
      title: "Setting up Automated AI Voice Calling Campaigns",
      duration: "7m 10s",
      description: "Configuring candidate voice cloning and automated multi-lingual voter reach.",
      aiExclusive: true,
    },
  ];

  // Extra Products data
  const extraProducts: ProductItem[] = [
    {
      id: "prod-evm",
      name: "EVM Demo Machine",
      category: "Hardware & Training",
      description:
        "Hands-on electronic voting machine replica with customizable candidate buttons for mock polling and karyakarta booth training.",
      imagePlaceholder: "EVM_DEMO",
    },
    {
      id: "prod-voter-search",
      name: "Voter Search Kiosk & Mobile App",
      category: "Software Tool",
      description:
        "Dedicated public search tablet kiosk and lightweight Android app for volunteers at voter assistance counters on polling day.",
      imagePlaceholder: "VOTER_SEARCH",
    },
    {
      id: "prod-campaign",
      name: "Campaign Merchandise & Kits",
      category: "Merchandise",
      description:
        "Customized high-quality promotional caps, party scarves, rally flags, badges, and rally kit packs tailored to party symbols.",
      imagePlaceholder: "MERCHANDISE",
    },
    {
      id: "prod-printer",
      name: "Bluetooth Thermal Printer & Rolls",
      category: "Field Hardware",
      description:
        "Portable Bluetooth slip printer paired with 50 water-resistant thermal paper rolls for instant on-the-spot voter slip distribution.",
      imagePlaceholder: "PRINTER",
    },
  ];

  // Handlers
  const handleOpenReview = (plan: PlanItem) => {
    setSelectedPlanForReview(plan);
    setShowReviewModal(true);
  };

  const handleConfirmSubmitRequest = () => {
    if (selectedPlanForReview) {
      setCurrentRequest({
        requestId: `REQ-IND-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        module: selectedPlanForReview.module === "ELECTION" ? "Election Module" : "Office Module",
        planName: selectedPlanForReview.name,
        hasAiMode: selectedPlanForReview.hasAiMode,
        duration: selectedPlanForReview.durationLabel,
        submittedAt: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        pricingNote: "Custom Quote Review in progress by INDATA Account Desk",
      });
      setSubscriptionStatus("PENDING");
      setShowReviewModal(false);
      showToast(
        "success",
        "Request Submitted",
        `Purchase request for "${selectedPlanForReview.name}" submitted successfully. Your request status is now Pending.`
      );
    }
  };

  const handleCallSupport = () => {
    window.location.href = `tel:${supportPhone.replace(/\s+/g, "")}`;
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800">
      {/* SECTION 1: HEADER & CONTEXT INFO CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                INDATA Portal
              </span>
              <span className="text-slate-400 text-xs">/</span>
              <span className="text-xs font-semibold text-slate-600">Subscription Plans</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Subscription Plans
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the right INDATA module for your election and office management requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-50 text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              {subscriptionStatus === "ACTIVE" && (
                <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Active Subscription
                </span>
              )}
              {subscriptionStatus === "PENDING" && (
                <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Subscription Pending
                </span>
              )}
              {subscriptionStatus === "EXPIRED" && (
                <span className="inline-flex items-center gap-1 font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-md">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Subscription Expired
                </span>
              )}
              {subscriptionStatus === "NO_REQUEST" && (
                <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                  No Active Plan
                </span>
              )}
            </div>

            <button
              onClick={handleCallSupport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Call INDATA: {supportPhone}</span>
            </button>
          </div>
        </div>

        {/* 4-Column Context Grid */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Candidate Name
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block truncate">
              {candidateInfo.candidateName}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Party / Organization
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block truncate">
              {candidateInfo.partyName}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Selected Election
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block truncate">
              {candidateInfo.electionName}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Constituency Geography
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block truncate">
              {candidateInfo.constituency}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: STATUS ALERT BANNERS */}
      {subscriptionStatus === "PENDING" && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900">
                    Subscription Pending
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-900">
                    Ref: {currentRequest.requestId}
                  </span>
                </div>
                <p className="text-xs text-amber-950 font-medium leading-relaxed max-w-3xl">
                  Your purchase request for <strong>{currentRequest.planName}</strong> is pending
                  confirmation. Please contact the INDATA team or submit your request to complete the
                  purchase process. Your selected module will become available after the purchase is
                  confirmed and your subscription is activated.
                </p>
                <div className="text-[11px] text-amber-800 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                  <span>
                    Module: <strong>{currentRequest.module}</strong>
                  </span>
                  <span>
                    AI Mode: <strong>{currentRequest.hasAiMode ? "Included" : "Not Included"}</strong>
                  </span>
                  <span>
                    Submitted: <strong>{currentRequest.submittedAt}</strong>
                  </span>
                  <span>
                    Validity: <strong>{currentRequest.duration}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setShowDemoModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                <span>Watch Demo</span>
              </button>
              <button
                onClick={handleCallSupport}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call INDATA</span>
              </button>
              <button
                onClick={() => {
                  setSubscriptionStatus("ACTIVE");
                  showToast("success", "Subscription Activated", "Administrator approved request: Subscription Activated successfully.");
                }}
                title="Simulate authorized back-office activation"
                className="px-2.5 py-2 bg-amber-200/60 hover:bg-amber-200 text-amber-900 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer"
              >
                Simulate Activation
              </button>
            </div>
          </div>
        </div>
      )}

      {subscriptionStatus === "ACTIVE" && (
        <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-200 text-blue-900">
                    Active Subscription
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-950">
                    {currentRequest.planName}
                  </span>
                </div>
                <p className="text-xs text-blue-950 leading-relaxed">
                  Your module features are fully unlocked. Activated on <strong>Nov 04, 2024</strong>.
                  Subscription valid until <strong>June 19, 2024</strong> (Election End Date + 15
                  Days Grace Period).
                </p>
                <div className="text-[11px] text-blue-800 flex flex-wrap gap-x-4 pt-1">
                  <span>
                    AI Mode: <strong>{currentRequest.hasAiMode ? "Active" : "Disabled"}</strong>
                  </span>
                  <span>
                    Days Remaining: <strong>224 Days</strong>
                  </span>
                  <span>
                    Feature Tier: <strong>Enterprise Command Suite</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  document.getElementById("tutorials-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>View Tutorials</span>
              </button>
              <button
                onClick={() => {
                  setSubscriptionStatus("EXPIRED");
                  showToast("info", "Subscription Expired", "Subscription period has concluded. Dependent features restricted.");
                }}
                title="Simulate expiration"
                className="px-2 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer"
              >
                Simulate Expiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SELECT SUBSCRIPTION MODULE */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Select Subscription Module
            </h2>
            <p className="text-xs text-slate-500">
              Select whether you need election campaign management or permanent office administration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Election Module */}
          <div
            onClick={() => setSelectedModule("ELECTION")}
            className={`cursor-pointer rounded-2xl p-5 border transition-all ${
              selectedModule === "ELECTION"
                ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Vote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Election Module</h3>
                  <span className="text-[11px] text-blue-600 font-semibold block">
                    Election Campaign Lifecycle
                  </span>
                </div>
              </div>

              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedModule === "ELECTION"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedModule === "ELECTION" && <Check className="w-2.5 h-2.5" />}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              War room command centre, live turnout telemetry, booth intelligence matrix, karyakarta
              field tracking, and voter slip generation.
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Validity:</span>
              <span className="font-bold text-slate-800">Election End Date + 15 Days</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">AI Mode:</span>
              <span className="font-bold text-blue-700">Available with AI &amp; without AI</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedModule("ELECTION");
              }}
              className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedModule === "ELECTION"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {selectedModule === "ELECTION" ? "Viewing Election Plans ↓" : "View Election Plans"}
            </button>
          </div>

          {/* Card B: Office Module */}
          <div
            onClick={() => setSelectedModule("OFFICE")}
            className={`cursor-pointer rounded-2xl p-5 border transition-all ${
              selectedModule === "OFFICE"
                ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Office Module</h3>
                  <span className="text-[11px] text-purple-600 font-semibold block">
                    Permanent Constituency Office
                  </span>
                </div>
              </div>

              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedModule === "OFFICE"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedModule === "OFFICE" && <Check className="w-2.5 h-2.5" />}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Public grievance desk, citizen appointment scheduler, official letter dispatches, ward
              development logs, and constituent CRM.
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Duration Options:</span>
              <span className="font-bold text-slate-800">6 Months or 12 Months</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">AI Mode:</span>
              <span className="font-bold text-purple-700">Available with AI &amp; without AI</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedModule("OFFICE");
              }}
              className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedModule === "OFFICE"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {selectedModule === "OFFICE" ? "Viewing Office Plans ↓" : "View Office Plans"}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: PLANS LIST & COMPARISON */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {selectedModule === "ELECTION" ? "Election Module Plans" : "Office Module Plans"}
            </h2>
            <p className="text-xs text-slate-500">
              {selectedModule === "ELECTION"
                ? "Valid from confirmed activation date up to Election End Date + 15 Days."
                : "Choose your desired subscription duration (6 Months or 12 Months) with AI Mode choice."}
            </p>
          </div>

          <button
            onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{showComparisonMatrix ? "Hide Comparison Matrix" : "Compare Plans in Detail"}</span>
          </button>
        </div>

        {selectedModule === "ELECTION" && (
          <div className="mb-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Election Module Pricing: Custom Quote</strong>
              <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
                Final pricing will be confirmed by the INDATA team after reviewing your election
                details and selected requirements. Workflow: Select Plan → Submit Request → INDATA
                Team Reviews Details → Price &amp; Terms Confirmed → Candidate Confirms → Purchase Completed.
              </p>
            </div>
          </div>
        )}

        {/* Plan Cards Grid */}
        <div
          className={`grid grid-cols-1 ${
            selectedModule === "ELECTION" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4"
          } gap-4`}
        >
          {currentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all relative ${
                plan.popular ? "border-blue-500 ring-1 ring-blue-500/20" : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                  Recommended
                </span>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {plan.durationLabel}
                  </span>
                  {plan.hasAiMode ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      AI Mode Included
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Without AI Mode
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {plan.tagline}
                </p>

                <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pricing Terms
                  </span>
                  <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
                    {plan.pricingStatus === "CUSTOM_QUOTE" ? "Custom Quote" : "Configured Terms"}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Coordinated directly with INDATA Account Desk
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Included Capabilities:
                  </span>
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenReview(plan)}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Submit Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCallSupport}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call to Purchase</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: DETAILED COMPARISON MATRIX (TOGGLEABLE) */}
      {showComparisonMatrix && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Comprehensive Feature Comparison</h3>
              <p className="text-xs text-slate-500">Cross-module comparison between Election and Office suites.</p>
            </div>
            <button
              onClick={() => setShowComparisonMatrix(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Close Comparison
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3">Module Feature</th>
                  <th className="py-2.5 px-3 text-center">Election (AI Mode)</th>
                  <th className="py-2.5 px-3 text-center">Election (Standard)</th>
                  <th className="py-2.5 px-3 text-center">Office (6 / 12M AI)</th>
                  <th className="py-2.5 px-3 text-center">Office (Standard)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    War Room Live Turnout Dashboard
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Global AI Mode &amp; Strategy Bot
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-purple-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-purple-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Automated AI Voice Calling Outreach
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-purple-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Live Field Map &amp; Karyakarta GPS
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Voter Slips Generation &amp; Printing
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Public Grievances &amp; Complaint Tickets
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">Basic</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">Basic</td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Official Recommendation Letters CRM
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6: REVIEW SELECTED PLAN MODAL */}
      {showReviewModal && selectedPlanForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Review Selected Plan</h3>
                <p className="text-xs text-slate-500">
                  Confirm your subscription selection before submitting enquiry.
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Selected Module:</span>
                  <span className="font-bold text-slate-900">
                    {selectedPlanForReview.module === "ELECTION" ? "Election Module" : "Office Module"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Selected Plan:</span>
                  <span className="font-bold text-blue-700">{selectedPlanForReview.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">AI Mode Entitlement:</span>
                  <span className="font-bold text-slate-900">
                    {selectedPlanForReview.hasAiMode ? "Included (AI Enabled)" : "Not Included"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Duration / Validity:</span>
                  <span className="font-bold text-slate-900">
                    {selectedPlanForReview.durationLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Election Details:</span>
                  <span className="font-bold text-slate-900">{candidateInfo.electionName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Constituency:</span>
                  <span className="font-bold text-slate-900">{candidateInfo.constituency}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                <strong>Next Step:</strong> Submitting this request creates an official purchase enquiry.
                The INDATA team will review your election details, confirm pricing, and contact you directly.
                No immediate payment is charged on the portal.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Change Selection
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmitRequest}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  Submit Purchase Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: TUTORIALS & LEARNING CENTRE */}
      <div id="tutorials-section" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Tutorials &amp; Learning Centre
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Step-by-step guides, walkthroughs, and video manuals for your subscribed modules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setTutorialCategory("ALL")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                tutorialCategory === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Guides
            </button>
            <button
              onClick={() => setTutorialCategory("WAR_ROOM")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                tutorialCategory === "WAR_ROOM"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              War Room
            </button>
            <button
              onClick={() => setTutorialCategory("VOTERS")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                tutorialCategory === "VOTERS"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Voter Directory
            </button>
            <button
              onClick={() => setTutorialCategory("FIELD")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                tutorialCategory === "FIELD"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Field Operations
            </button>
            <button
              onClick={() => setTutorialCategory("AI_MODE")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                tutorialCategory === "AI_MODE"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              AI Mode Guides
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials
            .filter((tut) => tutorialCategory === "ALL" || tut.category === tutorialCategory)
            .map((tut) => (
              <div
                key={tut.id}
                onClick={() => setShowDemoModal(true)}
                className="cursor-pointer group rounded-xl border border-slate-200 bg-white hover:border-blue-400 p-3.5 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden mb-2.5">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="w-10 h-10 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 ml-0.5 fill-blue-600 text-blue-600" />
                    </div>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[10px]">
                      {tut.duration}
                    </span>
                    {tut.aiExclusive && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                        AI Mode Exclusive
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                    {tut.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                    {tut.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                  <span>Watch Walkthrough</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* SECTION 8: EXTRA PRODUCTS & SERVICES */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Extra Products &amp; Services
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore additional field hardware, voting demo kits, and campaign merchandise available from INDATA.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Direct Procurement
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {extraProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="aspect-4/3 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center p-4 mb-3">
                  {prod.imagePlaceholder === "EVM_DEMO" && (
                    <Vote className="w-10 h-10 text-blue-600 mb-1" />
                  )}
                  {prod.imagePlaceholder === "VOTER_SEARCH" && (
                    <Smartphone className="w-10 h-10 text-cyan-600 mb-1" />
                  )}
                  {prod.imagePlaceholder === "MERCHANDISE" && (
                    <Award className="w-10 h-10 text-amber-600 mb-1" />
                  )}
                  {prod.imagePlaceholder === "PRINTER" && (
                    <Printer className="w-10 h-10 text-purple-600 mb-1" />
                  )}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mt-1">
                    {prod.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{prod.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{prod.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80">
                <button
                  onClick={handleCallSupport}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call to Purchase</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* E-Commerce Store Callout */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 p-4 rounded-xl">
          <div className="text-xs text-slate-600">
            Looking for bulk campaign kits, volunteer caps, badges, or custom collateral?
          </div>
          <a
            href="https://store.indata.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <span>View All Products in E-Commerce Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SECTION 9: VIDEO PREVIEW / DEMO TRAILER MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                <h3 className="font-extrabold text-sm text-white">INDATA Module Intro Trailer</h3>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video bg-black rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl mb-3">
                <Play className="w-6 h-6 ml-1 fill-white" />
              </div>
              <h4 className="font-bold text-base text-white">INDATA Candidate War Room Preview</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                This preview trailer walks through the command center architecture. Full interactive
                modules unlock upon authorized purchase confirmation.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Duration: 2m 45s</span>
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
