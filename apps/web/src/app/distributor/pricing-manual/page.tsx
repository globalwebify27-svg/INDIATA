"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { DistributorLayout } from "../../../distributor/components/distributor-layout";

export default function PricingManualPage() {
  // Franchise profit margin calculator state
  const [platinumCount, setPlatinumCount] = useState(3);
  const [goldCount, setGoldCount] = useState(5);
  const [silverCount, setSilverCount] = useState(2);

  const pricePlatinum = 150000;
  const priceGold = 95000;
  const priceSilver = 45000;
  const franchiseShareRate = 0.20; // 20% franchise commission

  const totalTurnover =
    platinumCount * pricePlatinum +
    goldCount * priceGold +
    silverCount * priceSilver;

  const estimatedFranchiseShare = Math.round(totalTurnover * franchiseShareRate);

  const packages = [
    {
      tier: "Platinum War Room",
      code: "TIER-PLT",
      electionScope: "Vidhan Sabha / Lok Sabha",
      basePrice: "₹ 1,50,000",
      suggestedRetail: "₹ 1,75,000",
      franchiseMargin: "20% (₹ 30,000 / account)",
      features: [
        "Full AI Voice Calling Suite (15,000 outbound mins)",
        "Verified Official WhatsApp Bot with blue tick",
        "AI Family Tree Clustering & Voter Mapping",
        "Unlimited Polling-Booth Voter Slips (PDF & Print)",
        "Up to 15 War Room Karyakarta Sub-logins",
        "Geo-spatial Constituency Heatmap",
      ],
      popular: true,
    },
    {
      tier: "Gold Intelligence",
      code: "TIER-GLD",
      electionScope: "Assembly / Municipal Corporation",
      basePrice: "₹ 95,000",
      suggestedRetail: "₹ 1,15,000",
      franchiseMargin: "20% (₹ 19,000 / account)",
      features: [
        "WhatsApp Broadcast Engine (5,000 messages)",
        "Voter Roll Search & Family Mapping",
        "Booth Slip PDF Export",
        "Up to 8 Campaign User Seats",
        "Voter Sentiment & Cast Analytics",
      ],
      popular: false,
    },
    {
      tier: "Silver Grassroots",
      code: "TIER-SLV",
      electionScope: "Zilla Parishad / Nagar Panchayat",
      basePrice: "₹ 45,000",
      suggestedRetail: "₹ 55,000",
      franchiseMargin: "20% (₹ 9,000 / account)",
      features: [
        "Standard Voter List Directory",
        "Booth Slip Printing",
        "Up to 3 Field Worker Seats",
        "Basic Phonebook Export",
      ],
      popular: false,
    },
    {
      tier: "Trial / Demo Edition",
      code: "TIER-TRIAL",
      electionScope: "All Electoral Types",
      basePrice: "₹ 0 (Free Trial)",
      suggestedRetail: "Free 7-Day Demo",
      franchiseMargin: "Leads pipeline builder",
      features: [
        "7-day full feature access for demonstration",
        "Sample 1,000 voter database",
        "Watermarked voter slip downloads",
      ],
      popular: false,
    },
  ];

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
            <div className="font-bold">
              Central Super Admin Price Book (Read-Only Enforcement)
            </div>
            <p>
              In accordance with platform security and business guidelines, franchise distributors cannot alter base pricing, override subscription amounts, or issue direct tax invoices. All billing collections and commercial activations must be verified by the central Super Admin finance desk.
            </p>
          </div>
        </div>

        {/* Official Packages Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.slice(0, 3).map((pkg, idx) => (
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
                  <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {pkg.code}
                  </span>
                  {pkg.popular && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2087FE] text-white">
                      Most Selected
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {pkg.tier}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Scope: {pkg.electionScope}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#2087FE]">
                    {pkg.basePrice}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Suggested Retail: <span className="font-semibold text-slate-700 dark:text-slate-300">{pkg.suggestedRetail}</span>
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
                Simulate potential candidate pipeline returns based on standard franchise share
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platinum Accounts (₹ 1.5L)
              </label>
              <input
                type="number"
                min={0}
                value={platinumCount}
                onChange={(e) => setPlatinumCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gold Accounts (₹ 95k)
              </label>
              <input
                type="number"
                min={0}
                value={goldCount}
                onChange={(e) => setGoldCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Silver Accounts (₹ 45k)
              </label>
              <input
                type="number"
                min={0}
                value={silverCount}
                onChange={(e) => setSilverCount(Math.max(0, parseInt(e.target.value) || 0))}
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
