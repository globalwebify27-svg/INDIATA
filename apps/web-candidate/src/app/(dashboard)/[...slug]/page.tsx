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
    group: "Rajtantra War Room Module",
    desc: "This workspace module interface is active for UI layout and component review.",
    badge: "Module Preview",
  };

  return (
    <div className="space-y-6">
      {/* Header Banner (Super Admin Surface Style) */}
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#493BBF] dark:text-[#C5C0FF]">
              {info.group}
            </span>
            <Badge variant="primary">{info.badge}</Badge>
            <Badge variant="neutral">UI Dev Preview</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-[#161B2A] dark:text-[#F8FAFC] tracking-tight">
            {info.title}
          </h1>
          <p className="text-xs text-[#707E94] dark:text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            {info.desc}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard">
            <Button variant="outline" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              War Room Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Development Preview Slate */}
      <Card>
        <CardContent className="p-8">
          <div className="max-w-xl mx-auto text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-[#ECE8FF] dark:bg-[#1E1B4B] text-[#493BBF] dark:text-[#C5C0FF] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Compass className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-[#161B2A] dark:text-[#F8FAFC]">
              {info.title} UI Workspace
            </h2>
            <p className="text-xs text-[#707E94] dark:text-[#94A3B8] mt-2 leading-relaxed">
              This module screen is connected to the active Rajtantra Candidate War Room shell. 
              Navigation, theme switching, responsive collapsible sidebar, and header controls are fully active.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3.5 rounded-lg bg-[#F1F3FA] dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-[#159B91] text-xs font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Layout Active</span>
                </div>
                <p className="text-[11px] text-[#707E94] dark:text-[#94A3B8]">
                  Full responsive shell & navigation loaded
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F1F3FA] dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-[#6256D9] dark:text-[#C5C0FF] text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mock Session</span>
                </div>
                <p className="text-[11px] text-[#707E94] dark:text-[#94A3B8]">
                  Zero database or login dependency
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F1F3FA] dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-[#E99A32] text-xs font-bold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Upcoming Phase</span>
                </div>
                <p className="text-[11px] text-[#707E94] dark:text-[#94A3B8]">
                  Ready for component & table injection
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center gap-2">
              <Link href="/dashboard" className="text-xs font-bold text-[#6256D9] dark:text-[#C5C0FF] hover:underline flex items-center gap-1">
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
