"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SubscriptionPlansView() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"software" | "recharge" | "addons">("software");

  const handleEnquiry = (planName: string) => {
    showToast(
      "success",
      "Subscription Enquiry Dispatched",
      `Authorized enquiry logged for ${planName} under ${user?.constituencyName || "Kasba Peth"}. Candidate Secretariat team will contact you.`,
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Subscription &amp; Service Quotas
            </span>
            <Badge variant="teal">Active Enterprise War Room</Badge>
            <Badge variant="neutral">AC-215 Licensure</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            War Room Software &amp; Communication Packs
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Transparent enterprise licensing, WhatsApp &amp; SMS outreach dispatch credits, and dedicated campaign infrastructure.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("software")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "software"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Software Plans
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recharge")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "recharge"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Broadcast Recharges
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("addons")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "addons"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Addon Services
          </button>
        </div>
      </section>

      {/* SECTION 1: Software Subscription Tiers */}
      {activeTab === "software" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Plan 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tier 1 &bull; Assembly
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                  Vidhan Sabha War Room
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Full command center for assembly constituency election campaigns.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to 3,00,000 Verified Elector Rolls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>500 Karyakarta Mobile Activation Keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Doorstep 26-Question Survey Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ECI Polling Station Mapping</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center"
                onClick={() => handleEnquiry("Vidhan Sabha War Room Tier")}
              >
                <span>Request Plan Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Plan 2: Active / Current */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-brand-500 p-5 shadow-sm flex flex-col justify-between relative">
            <div className="absolute -top-3 right-4 bg-brand-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Active Plan
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Tier 2 &bull; Parliamentary
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                  Lok Sabha War Room
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  High-capacity infrastructure for parliamentary constituencies with multiple assembly segments.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Up to 25,00,000 Elector Database</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">5,000 Field Karyakarta Mobile App Keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Autonomous AI Strategy Copilot Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Priority 24/7 War Room Hotline</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => handleEnquiry("Lok Sabha War Room Tier Extension")}
              >
                <span>Manage Licensure</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Plan 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tier 3 &bull; Municipal
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                  Municipal / Civic Ward
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Targeted solution for corporators, prabhags, and municipal civic wards.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to 60,000 Elector Roll Records</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100 Karyakarta Mobile App Keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Civic Grievance Desk Included</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center"
                onClick={() => handleEnquiry("Municipal / Civic Ward Tier")}
              >
                <span>Request Plan Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
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
            <div className="mt-4 pt-3 border-t border-slate-200">
              <Button variant="primary" size="md" className="w-full justify-center" onClick={() => handleEnquiry("50k WhatsApp Pack")}>
                Recharge Credits
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
            <div className="mt-4 pt-3 border-t border-slate-200">
              <Button variant="primary" size="md" className="w-full justify-center" onClick={() => handleEnquiry("100k DLT SMS Pack")}>
                Recharge Credits
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#7867E9] uppercase">Voice IVR</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                25,000 AI Voice Outreach
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Automated conversational candidate voice calls with live feedback capture.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <Button variant="primary" size="md" className="w-full justify-center" onClick={() => handleEnquiry("25k Voice IVR Pack")}>
                Recharge Credits
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Addons */}
      {activeTab === "addons" && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Specialized Election Engineering Services
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            On-ground GIS surveyors, custom candidate mobile app white-labeling, and hardware war room setups.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                White-Label Candidate Mobile App
              </h4>
              <p className="text-xs text-slate-500">
                Customized mobile application on Google Play Store featuring candidate photography, party insignia, and local volunteer onboarding.
              </p>
              <Button variant="outline" size="sm" onClick={() => handleEnquiry("White-Label App Addon")}>
                Request Specification
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                GIS Satellite Mapping &amp; Drone Surveys
              </h4>
              <p className="text-xs text-slate-500">
                High-resolution prabhag boundary vectorization and booth proximity route generation.
              </p>
              <Button variant="outline" size="sm" onClick={() => handleEnquiry("GIS Mapping Addon")}>
                Request Specification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
