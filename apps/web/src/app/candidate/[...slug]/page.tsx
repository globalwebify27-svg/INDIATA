"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { VoterManagementView } from "@/components/modules/voter-management-view";
import { KaryakartaWorkforceView } from "@/components/modules/karyakarta-workforce-view";
import { BloDirectoryView } from "@/components/modules/blo-directory-view";
import { LiveFieldMapView } from "@/components/modules/live-field-map-view";
import { OfficeTicketsView } from "@/components/modules/office-tickets-view";
import { CampaignControlView } from "@/components/modules/campaign-control-view";
import { SubscriptionPlansView } from "@/components/modules/subscription-plans-view";
import { ReportsAnalyticsView } from "@/components/modules/reports-analytics-view";
import { PortalSettingsView } from "@/components/modules/portal-settings-view";

export default function CandidateDynamicModulePage() {
  const pathname = usePathname();

  // Voter Intelligence Modules
  if (pathname.includes("/voters")) {
    return <VoterManagementView />;
  }

  // Workforce & Field Operations
  if (pathname.includes("/users") || pathname.includes("/members")) {
    return <KaryakartaWorkforceView />;
  }

  // Live Field Map GPS Telemetry
  if (pathname.includes("/field-map") || pathname.includes("/live-map")) {
    return <LiveFieldMapView />;
  }

  // Government BLO & Booth Management
  if (pathname.includes("/blo") || pathname.includes("/booths")) {
    return <BloDirectoryView />;
  }

  // Civic Issue Management & Grievance Tickets
  if (pathname.includes("/office") || pathname.includes("/tickets")) {
    return <OfficeTicketsView />;
  }

  // Campaign Outreach Hub & AI Calling
  if (pathname.includes("/campaigns") || pathname.includes("/ai")) {
    return <CampaignControlView />;
  }

  // Subscription Licensure & Recharge
  if (pathname.includes("/subscriptions")) {
    return <SubscriptionPlansView />;
  }

  // Reports, Analytics & Surveys
  if (pathname.includes("/reports") || pathname.includes("/forms")) {
    return <ReportsAnalyticsView />;
  }

  // Portal & Organization Settings, Help Center
  if (pathname.includes("/settings") || pathname.includes("/help")) {
    return <PortalSettingsView />;
  }

  return <VoterManagementView />;
}
