"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MODULE_REGISTRY: Record<
  string,
  { title: string; group: string; desc: string; badge: string }
> = {
  "/field-map": {
    title: "Live Field GPS Telemetry",
    group: "Field Operations",
    desc: "Real-time canvassing routes, GPS tracks, karyakarta heatmaps, and constituency boundary overlays.",
    badge: "Live GPS",
  },
  "/voters": {
    title: "Voter Management Roll",
    group: "Data Management",
    desc: "Constituency-wide electoral roll indexing with 22 multi-facet search filters, EPIC validation, and voter cards.",
    badge: "Core Roll",
  },
  "/voters/requests": {
    title: "Voter Update Requests",
    group: "Field Operations",
    desc: "Form 6, 7 & 8 pending voter corrections, addition requests, and cross-ward relocation verification.",
    badge: "14 Pending",
  },
  "/members": {
    title: "Members & Registrations",
    group: "Data Management",
    desc: "Primary party cadre memberships, volunteer onboarding intake, and contact verification registry.",
    badge: "Cadre Directory",
  },
  "/booths": {
    title: "Polling Booth Management",
    group: "Data Management",
    desc: "Booth physical locations, GPS markers, sensitive booth categorization, and voter committee allotments.",
    badge: "264 Booths",
  },
  "/blo": {
    title: "Government BLO Directory",
    group: "Data Management",
    desc: "Direct contact directories and jurisdiction mapping for government Booth Level Officers.",
    badge: "Government Directory",
  },
  "/users": {
    title: "Karyakarta & Field Workforce",
    group: "Field Operations",
    desc: "Field volunteers, booth managers, activation key management, and doorstep canvassing task allocations.",
    badge: "Workforce",
  },
  "/forms": {
    title: "Survey & Doorstep Form Engine",
    group: "Field Operations",
    desc: "26-question geo-verified constituent survey designer, responses, and field analytics.",
    badge: "Survey Engine",
  },
  "/office/tickets": {
    title: "Civic Issue & Grievance Tickets",
    group: "Field Operations",
    desc: "Constituency civic infrastructure issues, escalation matrix, and resolution tracker.",
    badge: "Civic Tickets",
  },
  "/campaigns": {
    title: "Campaign Outreach Hub",
    group: "Campaign & Intelligence",
    desc: "Meta WhatsApp Cloud broadcast campaigns, automated voice IVR, and event schedules.",
    badge: "Broadcast Hub",
  },
  "/ai/calling": {
    title: "AI Telephony Dispatch",
    group: "Campaign & Intelligence",
    desc: "Autonomous conversational AI voice calling engine for voter sentiment surveys and election day turnout.",
    badge: "Voice AI",
  },
  "/ai/assistant": {
    title: "AI Intelligence Assistant",
    group: "Campaign & Intelligence",
    desc: "Generative AI strategic advisor grounded in ECI rules, historical swing metrics, and booth demographics.",
    badge: "Copilot",
  },
  "/reports": {
    title: "Reports & Data Analytics",
    group: "Campaign & Intelligence",
    desc: "Electoral roll exports, demographic breakdowns, booth performance slips, and PDF cards.",
    badge: "Export Center",
  },
  "/settings": {
    title: "Portal & Campaign Settings",
    group: "System",
    desc: "Candidate profile, election date, campaign theme, notification channels, and team permissions.",
    badge: "Settings",
  },
  "/settings/organization": {
    title: "Constituency Organization",
    group: "System",
    desc: "Kasba Peth Constituency War Room credentials, tenant isolation parameters, and team rosters.",
    badge: "Organization",
  },
  "/help": {
    title: "Help & Support Center",
    group: "System",
    desc: "Operational playbooks, ECI handbook reference, tech support ticketing, and training videos.",
    badge: "Knowledgebase",
  },
};

export default function ModulePreviewPlaceholder() {
  const pathname = usePathname();
  const info = MODULE_REGISTRY[pathname] || {
    title: pathname
      .replace(/^\//, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    group: "INDIATA War Room Module",
    desc: "This workspace module interface is active for UI layout and component review.",
    badge: "Module Preview",
  };

  return (
    <div className="space-y-5">
      {/* Header Banner (Enterprise Surface Style) */}
      <div className="bg-white dark:bg-[#162235] rounded-lg border border-[#E1E6EE] dark:border-[#23344E] p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#3159A8] dark:text-[#4C74C9]">
              {info.group}
            </span>
            <Badge variant="primary">{info.badge}</Badge>
            <Badge variant="neutral">Administrative Module</Badge>
          </div>
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#253247] dark:text-[#F1F5F9] tracking-tight">
            {info.title}
          </h1>
          <p className="text-[12px] text-[#68758A] dark:text-[#8B9BB4] mt-1 max-w-2xl leading-relaxed">
            {info.desc}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard">
            <Button variant="outline" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Candidate Overview
            </Button>
          </Link>
        </div>
      </div>

      {/* Development Preview Slate */}
      <Card>
        <CardContent className="p-8">
          <div className="max-w-xl mx-auto text-center py-4">
            <div className="w-12 h-12 rounded-lg bg-[#F0F4FA] dark:bg-[#1A2844] border border-[#D5DFEE] dark:border-[#2A3E5C] text-[#3159A8] dark:text-[#4C74C9] flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-[17px] font-bold text-[#253247] dark:text-[#F1F5F9]">
              {info.title} Administrative Workspace
            </h2>
            <p className="text-[12px] text-[#68758A] dark:text-[#8B9BB4] mt-1.5 leading-relaxed">
              This module is active in the INDIATA Candidate War Room shell. 
              Navigation, theme switching, responsive collapsible sidebar, and header controls are fully operational.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-lg bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E]">
                <div className="flex items-center gap-1.5 text-[#24866A] text-[12px] font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Shell Active</span>
                </div>
                <p className="text-[11px] text-[#68758A] dark:text-[#8B9BB4]">
                  Full responsive layout &amp; navigation loaded
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E]">
                <div className="flex items-center gap-1.5 text-[#3159A8] dark:text-[#4C74C9] text-[12px] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Role Clearance</span>
                </div>
                <p className="text-[11px] text-[#68758A] dark:text-[#8B9BB4]">
                  Authenticated for Candidate AC-54
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F4F6F9] dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E]">
                <div className="flex items-center gap-1.5 text-[#C58A32] text-[12px] font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Telemetric Link</span>
                </div>
                <p className="text-[11px] text-[#68758A] dark:text-[#8B9BB4]">
                  Connected to ECI Master Roll telemetry
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E1E6EE] dark:border-[#23344E] flex items-center justify-center gap-2">
              <Link href="/dashboard" className="text-[12px] font-medium text-[#3159A8] dark:text-[#4C74C9] hover:underline flex items-center gap-1">
                <span>Return to Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
