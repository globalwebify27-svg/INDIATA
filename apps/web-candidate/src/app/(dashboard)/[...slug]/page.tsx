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
  if (pathname.startsWith("/voters")) {
    return <VoterManagementView />;
  }

  // Workforce & Field Operations
  if (
    pathname.startsWith("/users") ||
    pathname.startsWith("/members")
  ) {
    return <KaryakartaWorkforceView />;
  }

  // Live Field Map GPS Telemetry
  if (pathname.startsWith("/field-map")) {
    return <LiveFieldMapView />;
  }

  // Government BLO & Booth Management
  if (pathname.startsWith("/blo") || pathname.startsWith("/booths")) {
    return <BloDirectoryView />;
  }

  // Civic Issue Management & Grievance Tickets
  if (pathname.startsWith("/office")) {
    return <OfficeTicketsView />;
  }

  // Campaign Outreach Hub & AI Calling
  if (
    pathname.startsWith("/campaigns") ||
    pathname.startsWith("/ai")
  ) {
    return <CampaignControlView />;
  }

  // Subscription Licensure & Recharge
  if (pathname.startsWith("/subscriptions")) {
    return <SubscriptionPlansView />;
  }

  // Reports, Analytics & Surveys
  if (
    pathname.startsWith("/reports") ||
    pathname.startsWith("/forms")
  ) {
    return <ReportsAnalyticsView />;
  }

  // Portal & Organization Settings, Help Center
  if (
    pathname.startsWith("/settings") ||
    pathname.startsWith("/help")
  ) {
    return <PortalSettingsView />;
  }

  // Fallback to Voter Management
  return <VoterManagementView />;
}
