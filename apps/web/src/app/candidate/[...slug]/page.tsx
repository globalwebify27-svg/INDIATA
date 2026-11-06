"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { VoterManagementView } from "@/components/candidate/modules/voter-management-view";
import { KaryakartaWorkforceView } from "@/components/candidate/modules/karyakarta-workforce-view";
import { FiltersMasterView } from "@/components/candidate/modules/filters-master-view";
import { UserActivitiesAuditView } from "@/components/candidate/modules/user-activities-audit-view";
import { PhoneBookView } from "@/components/candidate/modules/phone-book-view";
import { PreviousElectionStrategyView } from "@/components/candidate/modules/previous-election-strategy-view";
import { BloDirectoryView } from "@/components/candidate/modules/blo-directory-view";
import { LiveFieldMapView } from "@/components/candidate/modules/live-field-map-view";
import { OfficeTicketsView } from "@/components/candidate/modules/office-tickets-view";
import { CampaignControlView } from "@/components/candidate/modules/campaign-control-view";
import { SubscriptionPlansView } from "@/components/candidate/modules/subscription-plans-view";
import { ReportsAnalyticsView } from "@/components/candidate/modules/reports-analytics-view";
import { PortalSettingsView } from "@/components/candidate/modules/portal-settings-view";

export default function CandidateDynamicModulePage() {
  const pathname = usePathname();

  // Module 04: Master Classification & Taxonomy
  if (pathname.includes("/filters")) {
    return <FiltersMasterView />;
  }

  // Module 06: User Activities & Audit Trail
  if (pathname.includes("/activities")) {
    return <UserActivitiesAuditView />;
  }

  // Module 09: Phone Book Directory
  if (pathname.includes("/phonebook")) {
    return <PhoneBookView />;
  }

  // Module 14: Previous Election & Strategy
  if (pathname.includes("/strategy")) {
    return <PreviousElectionStrategyView />;
  }

  // Module 07 & 08: Total Voters & Central Voter Profile
  if (pathname.includes("/voters")) {
    return <VoterManagementView />;
  }

  // Module 03: Workforce, Users, Members & Field Update Requests
  if (pathname.includes("/users") || pathname.includes("/members") || pathname.includes("/update-requests")) {
    return <KaryakartaWorkforceView />;
  }

  // Module 18: Live Field Map GPS Telemetry
  if (pathname.includes("/field-map") || pathname.includes("/live-map")) {
    return <LiveFieldMapView />;
  }

  // Module 15: Government BLO & Booth Management
  if (pathname.includes("/blo") || pathname.includes("/booths")) {
    return <BloDirectoryView />;
  }

  // Module 12: Civic Issue Management & Office Helpdesk
  if (pathname.includes("/office") || pathname.includes("/tickets")) {
    return <OfficeTicketsView />;
  }

  // Module 13: Campaign Outreach Hub & AI Calling
  if (pathname.includes("/campaigns") || pathname.includes("/ai")) {
    return <CampaignControlView />;
  }

  // Subscription Licensure & Recharge
  if (pathname.includes("/subscriptions")) {
    return <SubscriptionPlansView />;
  }

  // Module 11: Reports, Analytics & Intelligence
  if (pathname.includes("/reports") || pathname.includes("/forms")) {
    return <ReportsAnalyticsView />;
  }

  // Module 17: Portal & Organization Settings
  if (pathname.includes("/settings") || pathname.includes("/help")) {
    return <PortalSettingsView />;
  }

  return <VoterManagementView />;
}
