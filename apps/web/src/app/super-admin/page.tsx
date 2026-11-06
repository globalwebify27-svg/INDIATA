"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/superadmin/components/layout/app-shell";
import { DashboardView } from "@/superadmin/components/dashboard/dashboard-view";
import { useToast } from "@/context/toast-context";
import {
  MOCK_CANDIDATES,
  MOCK_DISTRIBUTORS,
  MOCK_ENQUIRIES,
  MOCK_AUDITS,
  MOCK_NOTIFICATIONS,
} from "@/superadmin/data/mock-superadmin-data";
import {
  NavKey,
  CandidateRecord,
  DistributorRecord,
  EnquiryRecord,
  AuditRecord,
} from "@/superadmin/types/superadmin.types";

export default function SuperAdminPortalPage() {
  const { toast } = useToast();

  // Capture Single Sign-On session handoff if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refresh = params.get("refresh");
    if (token) {
      localStorage.setItem("rajtantra_access_token", token);
      if (refresh) {
        localStorage.setItem("rajtantra_refresh_token", refresh);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const [activeNav, setActiveNav] = useState<NavKey>("dashboard");
  const [pricingVisible, setPricingVisible] = useState(true);
  const [candidates] = useState<CandidateRecord[]>(MOCK_CANDIDATES);
  const [distributors] = useState<DistributorRecord[]>(MOCK_DISTRIBUTORS);
  const [enquiries] = useState<EnquiryRecord[]>(MOCK_ENQUIRIES);
  const [audits] = useState<AuditRecord[]>(MOCK_AUDITS);
  const [notifications] = useState(MOCK_NOTIFICATIONS);

  const handleNavigate = (key: NavKey) => {
    if (key === "dashboard") {
      setActiveNav("dashboard");
      return;
    }

    const moduleNames: Record<string, string> = {
      organizations: "Organization & War Room Management",
      "all-candidates": "Candidate Directory",
      "add-candidate": "Candidate Onboarding Wizard",
      "candidate-profile": "Candidate Profile Management",
      "candidate-requests": "Candidate Registration Leads",
      enquiries: "Service & Quota Requests",
      "all-distributors": "Distributor Franchise Network",
      "distributor-requests": "Distributor Franchise Applications",
      campaigns: "Broadcast Campaigns",
      "ai-dashboard": "AI Engine Governance",
      subscriptions: "Subscription & Licensing Governance",
      audit: "Platform Security & Audit Ledger",
      settings: "Platform Settings",
      profile: "Root Administrator Profile",
      components: "UI Design System Kit",
    };

    const targetName = moduleNames[key] || "This module";
    toast(
      `${targetName} is scheduled for an upcoming development phase. The Dashboard is currently the active workspace.`,
      "info"
    );

    setActiveNav("dashboard");
  };

  return (
    <AppShell
      activeNav={activeNav}
      onNavigate={handleNavigate}
      notifications={notifications}
      pricingVisible={pricingVisible}
      onTogglePricingVisibility={setPricingVisible}
    >
      <DashboardView
        candidates={candidates}
        distributors={distributors}
        enquiries={enquiries}
        audits={audits}
        pricingVisible={pricingVisible}
        onTogglePricingVisibility={setPricingVisible}
        onNavigate={handleNavigate}
        onOpenAddCandidate={() => handleNavigate("add-candidate")}
      />
    </AppShell>
  );
}
