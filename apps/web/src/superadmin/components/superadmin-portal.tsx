"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/superadmin/components/layout/app-shell";
import { DashboardView } from "@/superadmin/components/dashboard/dashboard-view";
import { OrganizationDirectory } from "@/superadmin/components/organizations/organization-directory";
import { CandidateDirectory } from "@/superadmin/components/candidates/candidate-directory";
import { CandidateProfileView } from "@/superadmin/components/candidates/candidate-profile-view";
import { CandidateOnboardingWizard } from "@/superadmin/components/candidates/onboarding/candidate-onboarding-wizard";
import { CandidateRequestsView } from "@/superadmin/components/candidates/candidate-requests-view";
import { DistributorDirectory } from "@/superadmin/components/distributors/distributor-directory";
import { BroadcastCampaignsView } from "@/superadmin/components/campaigns/broadcast-campaigns-view";
import { AiGovernanceView } from "@/superadmin/components/ai/ai-governance-view";
import { SubscriptionsView } from "@/superadmin/components/subscriptions/subscriptions-view";
import { SecurityAuditView } from "@/superadmin/components/audit/security-audit-view";
import { PlatformSettingsView } from "@/superadmin/components/settings/platform-settings-view";
import { DesignSystemShowcase } from "@/superadmin/components/prototype/design-system-showcase";
import { superAdminApi } from "@/superadmin/services/superadmin-api";
import { useToast } from "@/context/toast-context";
import {
  MOCK_CANDIDATES,
  MOCK_DISTRIBUTORS,
  MOCK_ENQUIRIES,
  MOCK_AUDITS,
  MOCK_NOTIFICATIONS,
  MOCK_ORGANIZATIONS,
} from "@/superadmin/data/mock-superadmin-data";
import {
  NavKey,
  CandidateRecord,
  DistributorRecord,
  EnquiryRecord,
  AuditRecord,
  OrganizationRecord,
} from "@/superadmin/types/superadmin.types";
import { OrganizationStatus } from "@rajtantra/common-types";

export const NAV_KEY_TO_ROUTE: Record<NavKey, string> = {
  dashboard: "/super-admin",
  organizations: "/super-admin/organizations",
  "all-candidates": "/super-admin/candidates",
  "add-candidate": "/super-admin/candidates/new",
  "candidate-profile": "/super-admin/candidates",
  "candidate-requests": "/super-admin/candidates/requests",
  enquiries: "/super-admin/enquiries",
  "all-distributors": "/super-admin/distributors",
  "distributor-requests": "/super-admin/distributors/requests",
  campaigns: "/super-admin/campaigns",
  "ai-dashboard": "/super-admin/ai-governance",
  subscriptions: "/super-admin/subscriptions",
  audit: "/super-admin/audit",
  settings: "/super-admin/settings",
  profile: "/super-admin/settings",
  components: "/super-admin/design-system",
};

export function getNavKeyFromPathname(pathname: string): NavKey {
  if (pathname.includes("/organizations")) return "organizations";
  if (pathname.includes("/candidates/new") || pathname.includes("/onboard")) return "add-candidate";
  if (pathname.includes("/candidates/requests")) return "candidate-requests";
  if (pathname.includes("/enquiries")) return "enquiries";
  if (pathname.includes("/candidates")) return "all-candidates";
  if (pathname.includes("/distributors/requests")) return "distributor-requests";
  if (pathname.includes("/distributors")) return "all-distributors";
  if (pathname.includes("/campaigns")) return "campaigns";
  if (pathname.includes("/ai-governance") || pathname.includes("/ai")) return "ai-dashboard";
  if (pathname.includes("/subscriptions") || pathname.includes("/licenses")) return "subscriptions";
  if (pathname.includes("/audit") || pathname.includes("/security")) return "audit";
  if (pathname.includes("/settings")) return "settings";
  if (pathname.includes("/design-system") || pathname.includes("/components")) return "components";
  return "dashboard";
}

export function SuperAdminPortal() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  // Synchronize activeNav directly from browser URL path
  const activeNav = useMemo(() => getNavKeyFromPathname(pathname), [pathname]);

  const [pricingVisible, setPricingVisible] = useState(true);
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>(MOCK_ORGANIZATIONS);
  const [candidates, setCandidates] = useState<CandidateRecord[]>(MOCK_CANDIDATES);
  const [distributors, setDistributors] = useState<DistributorRecord[]>(MOCK_DISTRIBUTORS);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(MOCK_ENQUIRIES);
  const [audits, setAudits] = useState<AuditRecord[]>(MOCK_AUDITS);
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);

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

  // Load real state from Next.js App Router API
  const refreshData = useCallback(async () => {
    try {
      const [orgsRes, candsRes, distsRes, enqRes, auditsRes] = await Promise.all([
        superAdminApi.getOrganizations(),
        superAdminApi.getCandidates(),
        superAdminApi.getDistributors(),
        superAdminApi.getEnquiries(),
        superAdminApi.getAudits(),
      ]);
      if (orgsRes.success) setOrganizations(orgsRes.data);
      if (candsRes.success) setCandidates(candsRes.data);
      if (distsRes.success) setDistributors(distsRes.data);
      if (enqRes.success) setEnquiries(enqRes.data);
      if (auditsRes.success) setAudits(auditsRes.data);
    } catch {
      // Graceful fallback to initial mock data
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Navigate changes the real browser URL address bar via Next.js router
  const handleNavigate = (key: NavKey) => {
    setSelectedCandidate(null);
    const targetRoute = NAV_KEY_TO_ROUTE[key] || "/super-admin";
    router.push(targetRoute);
  };

  // Organizations Handlers
  const handleAddOrganization = async (org: OrganizationRecord) => {
    try {
      const res = await superAdminApi.addOrganization(org);
      if (res.success) {
        toast(`Organization "${res.data.name}" provisioned.`, "success");
        refreshData();
      }
    } catch {
      toast("Failed to create organization.", "error");
    }
  };

  const handleEditOrganization = async (org: OrganizationRecord) => {
    toast(`Organization "${org.name}" saved.`, "success");
    refreshData();
  };

  const handleUpdateOrgStatus = async (orgId: string, status: OrganizationStatus, reason?: string) => {
    try {
      const res = await superAdminApi.updateOrganizationStatus(orgId, status, reason);
      if (res.success) {
        toast(`Organization status changed to ${status}.`, "success");
        refreshData();
      }
    } catch {
      toast("Status update failed.", "error");
    }
  };

  // Candidates Handlers
  const handleToggleCandidateStatus = async (candId: string) => {
    try {
      const res = await superAdminApi.toggleCandidateStatus(candId);
      if (res.success) {
        toast(`Candidate status changed to ${res.data.status}.`, "success");
        refreshData();
      }
    } catch {
      toast("Status toggle failed.", "error");
    }
  };

  const handleCandidateCreated = async (newCand: CandidateRecord) => {
    try {
      const res = await superAdminApi.addCandidate(newCand);
      if (res.success) {
        toast(`Candidate "${res.data.name}" successfully onboarded.`, "success");
        refreshData();
        handleNavigate("all-candidates");
      }
    } catch {
      toast("Onboarding failed.", "error");
    }
  };

  return (
    <AppShell
      activeNav={activeNav}
      onNavigate={handleNavigate}
      notifications={notifications}
      pricingVisible={pricingVisible}
      onTogglePricingVisibility={setPricingVisible}
    >
      {/* 1. Dashboard Overview */}
      {activeNav === "dashboard" && (
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
      )}

      {/* 2. Organizations & War Rooms */}
      {activeNav === "organizations" && (
        <OrganizationDirectory
          organizations={organizations}
          onAddOrganization={handleAddOrganization}
          onEditOrganization={handleEditOrganization}
          onUpdateOrgStatus={handleUpdateOrgStatus}
        />
      )}

      {/* 3. Candidate Directory */}
      {activeNav === "all-candidates" && (
        selectedCandidate ? (
          <CandidateProfileView
            candidate={selectedCandidate}
            onBack={() => setSelectedCandidate(null)}
            onUpdateCandidate={(updated) => {
              setSelectedCandidate(updated);
              refreshData();
            }}
          />
        ) : (
          <CandidateDirectory
            candidates={candidates}
            onSelectCandidate={(cand) => setSelectedCandidate(cand)}
            onOpenAddWizard={() => handleNavigate("add-candidate")}
            onToggleCandidateStatus={handleToggleCandidateStatus}
          />
        )
      )}

      {/* 4. Candidate Onboarding Wizard */}
      {activeNav === "add-candidate" && (
        <CandidateOnboardingWizard
          distributors={distributors}
          onCandidateCreated={handleCandidateCreated}
          onCancel={() => handleNavigate("all-candidates")}
        />
      )}

      {/* 5. Candidate Requests & Enquiries */}
      {(activeNav === "candidate-requests" || activeNav === "enquiries") && (
        <CandidateRequestsView />
      )}

      {/* 6. Distributor Partners & Applications */}
      {(activeNav === "all-distributors" || activeNav === "distributor-requests") && (
        <DistributorDirectory />
      )}

      {/* 7. Broadcast Campaigns */}
      {activeNav === "campaigns" && (
        <BroadcastCampaignsView />
      )}

      {/* 8. AI Engine Governance */}
      {activeNav === "ai-dashboard" && (
        <AiGovernanceView />
      )}

      {/* 9. Subscriptions & Licences */}
      {activeNav === "subscriptions" && (
        <SubscriptionsView />
      )}

      {/* 10. Security Audit Ledger */}
      {activeNav === "audit" && (
        <SecurityAuditView />
      )}

      {/* 11. Platform Settings & SLA */}
      {activeNav === "settings" && (
        <PlatformSettingsView />
      )}

      {/* 12. UI Design System Showcase */}
      {activeNav === "components" && (
        <DesignSystemShowcase />
      )}
    </AppShell>
  );
}
