"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Lock,
  CheckCircle2,
  Sparkles,
  Calendar,
  ShieldCheck,
  Building2,
  Vote,
  Clock,
} from "lucide-react";
import { DistributorLayout } from "../../../distributor/components/distributor-layout";

type PlanCategory = "ALL" | "ELECTION" | "OFFICE" | "TRIAL";

interface PricingPackage {
  tier: string;
  code: string;
  category: "ELECTION" | "OFFICE" | "TRIAL";
  electionScope: string;
  validity: string;
  hasAi: boolean;
  basePrice: string;
  numericPrice: number;
  suggestedRetail: string;
  franchiseMargin: string;
  tag: string;
  features: string[];
  popular?: boolean;
}

export default function PricingManualPage() {
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory>("ALL");

  // Franchise profit margin calculator state
  const [electionAiCount, setElectionAiCount] = useState(3);
  const [electionStdCount, setElectionStdCount] = useState(4);
  const [office12mCount, setOffice12mCount] = useState(2);
  const [office6mCount, setOffice6mCount] = useState(3);

  const priceElectionAi = 150000;
  const priceElectionStd = 95000;
  const priceOffice12m = 120000;
  const priceOffice6m = 40000;
  const franchiseShareRate = 0.20; // 20% franchise commission

  const totalTurnover =
    electionAiCount * priceElectionAi +
    electionStdCount * priceElectionStd +
    office12mCount * priceOffice12m +
    office6mCount * priceOffice6m;

  const estimatedFranchiseShare = Math.round(totalTurnover * franchiseShareRate);

  const packages: PricingPackage[] = [
    // 1. Election Module
    {
      tier: "Election Module with AI Mode",
      code: "PLAN-EL-AI",
      category: "ELECTION",
      electionScope: "Vidhan Sabha / Lok Sabha / Municipal Corporation",
      validity: "Election End Date + 15 Days Grace Period",
      hasAi: true,
      basePrice: "₹ 1,50,000",
      numericPrice: 150000,
      suggestedRetail: "₹ 1,75,000",
      franchiseMargin: "20% (₹ 30,000 / account)",
      tag: "Full AI Election Suite",
      features: [
        "Full AI Voice Calling Suite (15,000 outbound mins)",
        "Verified Official WhatsApp Bot with Dynamic Slips",
        "AI Family Tree Clustering & Voter Locus Mapping",
        "Real-time Polling-Day Turnout Tracking Guard",
        "Structured Electoral Data Segregation by Booth & Ward",
        "Unlimited Polling-Booth Voter Slips (PDF & Print)",
        "Up to 15 War Room Karyakarta Sub-logins",
      ],
      popular: true,
    },
    {
      tier: "Election Module without AI Mode",
      code: "PLAN-EL-STD",
      category: "ELECTION",
      electionScope: "Assembly / Municipal General Election",
      validity: "Election End Date + 15 Days Grace Period",
      hasAi: false,
      basePrice: "₹ 95,000",
      numericPrice: 95000,
      suggestedRetail: "₹ 1,15,000",
      franchiseMargin: "20% (₹ 19,000 / account)",
      tag: "Standard Election Suite",
      features: [
        "WhatsApp Broadcast Engine (5,000 messages)",
        "Full Voter Directory & Advanced Demographic Filters",
        "Booth Slip PDF Export & Thermal Printing",
        "Polling-Day Turnout Tracking (Live Polls Toggle)",
        "Constituency Data Segregation & Booth Partitioning",
        "Up to 8 Campaign User Seats",
      ],
      popular: false,
    },

    // 2. Office Module
    {
      tier: "Office – 12 Months with AI Mode",
      code: "PLAN-OFF-12M-AI",
      category: "OFFICE",
      electionScope: "Permanent Constituency War Room & Office (12 Months)",
      validity: "12 Months Continuous Office License",
      hasAi: true,
      basePrice: "₹ 1,20,000",
      numericPrice: 120000,
      suggestedRetail: "₹ 1,40,000",
      franchiseMargin: "20% (₹ 24,000 / account)",
      tag: "Annual AI Office",
      features: [
        "Full AI Grievance Classification & Automated Follow-up",
        "AI Voice Caller (5,000 outbound office minutes)",
        "365-Day Voter Directory & Issue Tracking System",
        "Citizen Work Request Management & Letter Generator",
        "Structured Ward / Booth Data Isolation",
        "Up to 10 Office Staff Logins",
      ],
      popular: false,
    },
    {
      tier: "Office – 12 Months without AI Mode",
      code: "PLAN-OFF-12M-STD",
      category: "OFFICE",
      electionScope: "Permanent Constituency Office (12 Months)",
      validity: "12 Months Continuous Office License",
      hasAi: false,
      basePrice: "₹ 75,000",
      numericPrice: 75000,
      suggestedRetail: "₹ 90,000",
      franchiseMargin: "20% (₹ 15,000 / account)",
      tag: "Annual Standard Office",
      features: [
        "365-Day Constituency Office Management Suite",
        "Citizen Grievance & Issue Tracking",
        "Official WhatsApp Notification Gateway",
        "Central Contact Directory with Tagging",
        "Up to 5 Office Staff Logins",
      ],
      popular: false,
    },
    {
      tier: "Office – 6 Months with AI Mode",
      code: "PLAN-OFF-6M-AI",
      category: "OFFICE",
      electionScope: "Constituency Office (6 Months)",
      validity: "6 Months Continuous Office License",
      hasAi: true,
      basePrice: "₹ 65,000",
      numericPrice: 65000,
      suggestedRetail: "₹ 78,000",
      franchiseMargin: "20% (₹ 13,000 / account)",
      tag: "6M AI Office",
      features: [
        "AI Voice Caller (2,500 outbound mins)",
        "Grievance Tracking & Smart Triage",
        "180-Day Voter Relationship Management",
        "WhatsApp Helpdesk Bot",
        "Up to 5 Office Staff Logins",
      ],
      popular: false,
    },
    {
      tier: "Office – 6 Months without AI Mode",
      code: "PLAN-OFF-6M-STD",
      category: "OFFICE",
      electionScope: "Constituency Office (6 Months)",
      validity: "6 Months Continuous Office License",
      hasAi: false,
      basePrice: "₹ 40,000",
      numericPrice: 40000,
      suggestedRetail: "₹ 50,000",
      franchiseMargin: "20% (₹ 8,000 / account)",
      tag: "6M Standard Office",
      features: [
        "180-Day Constituency Office Suite",
        "Citizen Grievance Tracker & Follow-ups",
        "Basic WhatsApp Alerts",
        "Up to 3 Office User Seats",
      ],
      popular: false,
    },

    // 3. Trial Demo Tier
    {
      tier: "Trial Demo (5 Days)",
      code: "PLAN-TRIAL-5D",
      category: "TRIAL",
      electionScope: "All Electoral Types (Evaluation Sandbox)",
      validity: "Strict 5-Day Evaluation Window",
      hasAi: false,
      basePrice: "₹ 0 (Free Trial)",
      numericPrice: 0,
      suggestedRetail: "Free 5-Day Sandbox",
      franchiseMargin: "Direct Lead Conversion Pipeline",
      tag: "5-Day Evaluation",
      features: [
        "5-Day Full Feature Sandbox Access for Candidate Demos",
        "Sample 1,000 Verified Voter Records Locus",
        "Watermarked Voter Slip Downloads & Print Testing",
        "AI Features Demonstration with 50 Test Calls",
      ],
      popular: false,
    },
  ];

  const filteredPackages = packages.filter((pkg) => {
    if (selectedCategory === "ALL") return true;
    return pkg.category === selectedCategory;
  });

  return (
    <DistributorLayout
      title="Commercial Pricing Manual & Catalog"
      subtitle="Official Super Admin rate card and franchise margin planning guide (Strictly Read-Only)"
    >
      <div className="space-y-6">
        {/* Read-Only Governance Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <span>Central Super Admin Price Book (Read-Only Enforcement)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-medium">
                Live Catalog Synced
              </span>
            </div>
            <p>
              In accordance with platform security and business guidelines, franchise distributors cannot alter base pricing, override subscription amounts, or issue direct tax invoices. All billing collections and commercial activations must be verified by the central Super Admin finance desk.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-1">
          {[
            { id: "ALL", label: "All Subscription Models", count: packages.length, icon: ShieldCheck },
            { id: "ELECTION", label: "Election Module", count: 2, icon: Vote },
            { id: "OFFICE", label: "Office Module", count: 4, icon: Building2 },
            { id: "TRIAL", label: "Trial Demo (5 Days)", count: 1, icon: Clock },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as PlanCategory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? "bg-[#2087FE] text-white shadow-premium-xs"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Official Packages Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition flex flex-col justify-between ${
                pkg.popular
                  ? "border-[#2087FE] shadow-premium ring-2 ring-[#2087FE]/20"
                  : "border-slate-200 dark:border-slate-800 shadow-premium-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {pkg.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {pkg.hasAi && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Mode
                      </span>
                    )}
                    {pkg.popular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2087FE] text-white">
                        Most Selected
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {pkg.tier}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                  Scope: {pkg.electionScope}
                </p>

                {/* Validity Pill */}
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                  <Calendar className="w-3 h-3 text-[#2087FE] shrink-0" />
                  <span className="truncate">Validity: {pkg.validity}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#2087FE]">
                    {pkg.basePrice}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Suggested Retail:{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {pkg.suggestedRetail}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    Franchise Share: {pkg.franchiseMargin}
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">
                    Included Features:
                  </div>
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/distributor/candidates/new"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-[#2087FE] hover:text-white transition text-slate-700 dark:text-slate-200"
                >
                  <span>Select for Onboarding</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Franchise Margin Calculator */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#2087FE] flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Franchise Turnover & Commission Simulator
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Simulate potential candidate pipeline returns based on standard 20% franchise commission
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Election AI (₹ 1.5L)
              </label>
              <input
                type="number"
                min={0}
                value={electionAiCount}
                onChange={(e) => setElectionAiCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Election Std (₹ 95k)
              </label>
              <input
                type="number"
                min={0}
                value={electionStdCount}
                onChange={(e) => setElectionStdCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Office 12M AI (₹ 1.2L)
              </label>
              <input
                type="number"
                min={0}
                value={office12mCount}
                onChange={(e) => setOffice12mCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Office 6M (₹ 40k)
              </label>
              <input
                type="number"
                min={0}
                value={office6mCount}
                onChange={(e) => setOffice6mCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#010627] to-[#0A1950] text-white flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Est. Franchise Return (20%)
              </span>
              <div className="text-xl font-extrabold text-emerald-400">
                ₹ {estimatedFranchiseShare.toLocaleString("en-IN")}
              </div>
              <span className="text-[10px] text-slate-400">
                Turnover: ₹ {totalTurnover.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DistributorLayout>
  );
}
