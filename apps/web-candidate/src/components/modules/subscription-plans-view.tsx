"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  X,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Cpu,
  Printer,
  Smartphone,
  Layers,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SubscriptionTier {
  id: string;
  tierNumber: number;
  name: string;
  price: string;
  period: string;
  description: string;
  isPopular?: boolean;
  features: string[];
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "tier-1",
    tierNumber: 1,
    name: "Tier 1: Election Mode",
    price: "₹15,000",
    period: "per month",
    description: "Core field canvassing, voter slip distribution, and grassroots ground workforce coordination.",
    features: [
      "Up to 1,50,000 Verified Elector Rolls",
      "250 Field Karyakarta Mobile Activation Keys",
      "Doorstep Verification & Physical Voter Slip Tracker",
      "Basic Analytics, Turnout Tracking & Reports",
      "Live Field Map GPS Telemetry",
    ],
  },
  {
    id: "tier-2",
    tierNumber: 2,
    name: "Tier 2: Office Mode",
    price: "₹25,000",
    period: "per month",
    description: "Comprehensive Vidhan Sabha constituency management with civic grievance office helpdesk.",
    features: [
      "Full Vidhan Sabha (Up to 3,00,000 Electors)",
      "1,000 Karyakarta Mobile Activation Keys",
      "Central Voter Profile Dossier & Household Affinity Graph",
      "Civic Helpdesk & Grievance Ticketing Desk",
      "Govt BLO Directory & ECI Polling Station Mapping",
      "Multi-Channel WhatsApp & SMS Outreach Dashboard",
    ],
  },
  {
    id: "tier-3",
    tierNumber: 3,
    name: "Tier 3: Election Mode + AI",
    price: "₹45,000",
    period: "per month",
    description: "Autonomous predictive strategy engine combined with intensive election-day mobilization tools.",
    features: [
      "Everything in Tier 1: Election Mode",
      "Autonomous AI Strategy Copilot & Conversational War Room",
      "Multi-Cycle Margin Shift & Turnout Simulation",
      "Historical ECI Data Archive (2014 - 2024 Decade)",
      "Automated Marathi Speech Synthesis for Candidate Audio",
      "Autonomous Micro-Targeting & Priority Focus Identification",
    ],
  },
  {
    id: "tier-4",
    tierNumber: 4,
    name: "Tier 4: Office Mode + AI",
    price: "₹65,000",
    period: "per month",
    description: "Full enterprise war room suite with 15-year archives, autonomous AI, and dedicated campaign infrastructure.",
    isPopular: true,
    features: [
      "Everything in Tier 2: Office Mode Suite",
      "Full Agentic AI Intelligence & Voice Engine",
      "15-Year Historical Election Archives (2009 - 2024)",
      "24/7 Dedicated Strategic War Room Hotline Support",
      "Meta Cloud API Verified Priority WhatsApp & Voice IVR Gateway",
      "Unlimited Master Elector Dossier Query & Export",
    ],
  },
];

interface HardwareItem {
  id: string;
  name: string;
  price: string;
  unit: string;
  description: string;
  icon: typeof Cpu;
}

const HARDWARE_ITEMS: HardwareItem[] = [
  {
    id: "hw-1",
    name: "EVM Demo Units",
    price: "₹4,500",
    unit: "per unit",
    description: "Interactive mock EVM training ballot unit with buzzer and candidate symbol sticker sheet.",
    icon: Cpu,
  },
  {
    id: "hw-2",
    name: "Pocket Voter Search Device",
    price: "₹8,200",
    unit: "per unit",
    description: "Portable handheld terminal with offline voter roll search and integrated thermal slip output.",
    icon: Smartphone,
  },
  {
    id: "hw-3",
    name: "Bluetooth Thermal Printers",
    price: "₹3,400",
    unit: "per unit",
    description: "Portable 58mm belt-clip thermal printer for real-time voter slip generation at doorsteps.",
    icon: Printer,
  },
  {
    id: "hw-4",
    name: "Thermal Paper Rolls Pack",
    price: "₹850",
    unit: "box of 20 rolls",
    description: "High-grade 58mm weather-resistant thermal paper rolls with water-resistant coating.",
    icon: Layers,
  },
  {
    id: "hw-5",
    name: "Campaign Merchandise",
    price: "From ₹45",
    unit: "per unit",
    description: "Custom candidate campaign caps, badges, flags, candidate scarfs, and lanyards.",
    icon: Award,
  },
];

export function SubscriptionPlansView() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"software" | "recharge" | "hardware">("software");
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<SubscriptionTier | null>(null);
  const [showSalesModal, setShowSalesModal] = useState(false);

  const handleOpenEnquiry = (tier: SubscriptionTier) => {
    setSelectedPlanForEnquiry(tier);
    setShowSalesModal(true);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 dark:text-brand-400 px-2.5 py-0.5 rounded-full">
              Licensure &amp; Service Quotas
            </span>
            <Badge variant="teal">Vidhan Sabha AC-215 Licensure</Badge>
            <Badge variant="neutral">Candidate Secretariat Support</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            War Room Software Subscriptions &amp; Hardware Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent 4-tier candidate licensing, Meta Cloud WhatsApp dispatch recharges, and specialized election campaign hardware.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab("software")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "software"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            4 Core Software Tiers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recharge")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "recharge"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Broadcast Recharges
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hardware")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "hardware"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Hardware &amp; Auxiliary
          </button>
        </div>
      </section>

      {/* SECTION 1: THE 4 CORE SUBSCRIPTION TIERS MATRIX */}
      {activeTab === "software" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                tier.isPopular
                  ? "bg-white dark:bg-slate-900 border-2 border-brand-600 shadow-lg relative"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium-xs hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular / Full Suite</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {tier.name.split(":")[0]}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                    {tier.name.split(":")[1]?.trim() || tier.name}
                  </h3>
                  <div className="mt-2.5 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-xs text-slate-500">/{tier.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 text-[11.5px] leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry Action Button (NO INSTANT CHECKOUT - Section 12 Requirement) */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant={tier.isPopular ? "primary" : "outline"}
                  size="md"
                  className={`w-full justify-center ${tier.isPopular ? "bg-brand-600 hover:bg-brand-700 text-white" : ""}`}
                  onClick={() => handleOpenEnquiry(tier)}
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  <span>Contact Sales Team</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: Broadcast Recharges */}
      {activeTab === "recharge" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase">WhatsApp Credits</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                50,000 Voter Slip Pack
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Official Meta Cloud WhatsApp voter slip delivery with PDF slip cards.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  showToast("success", "Recharge Enquiry Dispatched", "Candidate account manager notified.");
                  setShowSalesModal(true);
                }}
              >
                Inquire WhatsApp Credits
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase">SMS Dispatch</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                100,000 DLT SMS Pack
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                High-throughput transactional polling booth reminder SMS dispatch.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  showToast("success", "Recharge Enquiry Dispatched", "Candidate account manager notified.");
                  setShowSalesModal(true);
                }}
              >
                Inquire SMS Credits
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase">AI Voice IVR</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                25,000 AI Voice Outreach
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Automated conversational candidate voice calls with live feedback capture.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  showToast("success", "Recharge Enquiry Dispatched", "Candidate account manager notified.");
                  setShowSalesModal(true);
                }}
              >
                Inquire Voice Quota
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Hardware Grid View (When hardware tab active) */}
      {activeTab === "hardware" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HARDWARE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between gap-4 hover:border-brand-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {item.price}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{item.unit}</span>
                  <a
                    href="https://store.indiata.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <span>Order on Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 12: FIXED / PERSISTENT HORIZONTAL SIDE-SCROLLABLE HARDWARE & EXTRA SERVICES BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-3 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 rounded-lg bg-brand-600 text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Election Hardware Store
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block">
                store.indiata.in verified accessories
              </span>
            </div>
          </div>

          {/* Horizontal Side-Scrollable Hardware Items */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            {HARDWARE_ITEMS.map((hw) => {
              const Icon = hw.icon;
              return (
                <div
                  key={hw.id}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shrink-0 text-xs shadow-2xs hover:border-brand-400 transition-all"
                >
                  <Icon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <div className="leading-tight">
                    <span className="font-bold text-slate-800 dark:text-white block whitespace-nowrap">
                      {hw.name}
                    </span>
                    <span className="text-[10.5px] font-mono text-brand-600 dark:text-brand-400 font-semibold">
                      {hw.price}
                    </span>
                  </div>
                  <a
                    href="https://store.indiata.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 p-1 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-brand-600 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    title={`Order ${hw.name}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>

          <a
            href="https://store.indiata.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shrink-0 transition-all shadow-sm"
          >
            <span>Visit Full Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SECTION 12: DEDICATED SALES INQUIRY MODAL (SACHIN PAWAR CONTACT) */}
      {showSalesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-600 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedPlanForEnquiry?.name || "Candidate Licensure Support"}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Candidate Secretariat &bull; {user?.constituencyName || "Kasba Peth AC-215"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSalesModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Subscription activation is governed under state election compliance. To activate or upgrade your war room license, please connect directly with your dedicated political accounts manager:
            </p>

            {/* Account Manager Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Sachin Pawar
              </div>
              <div className="text-slate-500 text-[11px]">
                Senior Strategic Account Lead &bull; Indiata Political Operations
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                <a
                  href="tel:+919822011234"
                  className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 98220 11234</span>
                </a>
                <a
                  href="mailto:sales@indiata.in"
                  className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>sales@indiata.in</span>
                </a>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href="tel:+919822011234"
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs text-center shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Account Manager</span>
              </a>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowSalesModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
