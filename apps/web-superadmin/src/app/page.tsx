"use client";

import React, { useState } from "react";
import {
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import { AppShell } from "../components/layout/app-shell";
import { PageHeader } from "../components/layout/page-header";
import { DashboardView } from "../components/dashboard/dashboard-view";
import { CandidateDirectory } from "../components/candidates/candidate-directory";
import { CandidateProfileView } from "../components/candidates/candidate-profile-view";
import { CandidateOnboardingWizard } from "../components/candidates/onboarding/candidate-onboarding-wizard";
import { DesignSystemShowcase } from "../components/prototype/design-system-showcase";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { EmptyState } from "../components/ui/empty-state";
import { SearchInput } from "../components/ui/input";
import { useToast } from "../context/toast-context";
import {
  MOCK_CANDIDATES,
  MOCK_DISTRIBUTORS,
  MOCK_ENQUIRIES,
  MOCK_CANDIDATE_REQUESTS,
  MOCK_DISTRIBUTOR_REQUESTS,
  MOCK_AUDITS,
  MOCK_NOTIFICATIONS,
  MOCK_ORGANIZATIONS,
} from "../data/mock-superadmin-data";
import {
  NavKey,
  CandidateRecord,
  DistributorRecord,
  EnquiryRecord,
  CandidateRequestItem,
  DistributorRequestItem,
  AuditRecord,
  OrganizationRecord,
} from "../types/superadmin.types";
import { OrganizationStatus } from "@rajtantra/common-types";
import { OrganizationDirectory } from "../components/organizations/organization-directory";

export default function SuperAdminPortalPage() {
  const { toast } = useToast();
  const [activeNav, setActiveNav] = useState<NavKey>("dashboard");
  const [pricingVisible, setPricingVisible] = useState(true);
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>(MOCK_ORGANIZATIONS);
  const [candidates, setCandidates] = useState<CandidateRecord[]>(MOCK_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(MOCK_CANDIDATES[0] || null);
  const [distributors] = useState<DistributorRecord[]>(MOCK_DISTRIBUTORS);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(MOCK_ENQUIRIES);
  const [candidateRequests, setCandidateRequests] = useState<CandidateRequestItem[]>(MOCK_CANDIDATE_REQUESTS);
  const [distributorRequests, setDistributorRequests] = useState<DistributorRequestItem[]>(MOCK_DISTRIBUTOR_REQUESTS);
  const [audits] = useState<AuditRecord[]>(MOCK_AUDITS);
  const [notifications] = useState(MOCK_NOTIFICATIONS);

  // Search filter for audit log
  const [auditSearch, setAuditSearch] = useState("");

  const handleAddOrganization = (newOrg: OrganizationRecord) => {
    setOrganizations((prev) => [newOrg, ...prev]);
  };

  const handleEditOrganization = (updatedOrg: OrganizationRecord) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === updatedOrg.id ? updatedOrg : org))
    );
  };

  const handleUpdateOrgStatus = (
    orgId: string,
    status: OrganizationStatus,
    _reason?: string
  ) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === orgId ? { ...org, status } : org))
    );
  };

  const handleAddCandidate = (newCand: CandidateRecord) => {
    setCandidates((prev) => [newCand, ...prev]);
  };

  const handleSelectCandidate = (cand: CandidateRecord) => {
    setSelectedCandidate(cand);
    setActiveNav("candidate-profile");
  };

  const handleUpdateCandidate = (updated: CandidateRecord) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedCandidate(updated);
  };

  const handleToggleCandidateStatus = (candId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candId) {
          const next = c.status === "Active" ? "Inactive" : "Active";
          toast(`Candidate ${c.name} account is now ${next}.`, "info");
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  const handleApproveCandidateRequest = (req: CandidateRequestItem) => {
    setCandidateRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "Approved" } : r))
    );
    toast(`Candidate application for ${req.name} approved. Automated onboarding link issued.`, "success");
  };

  const handleDeclineCandidateRequest = (req: CandidateRequestItem) => {
    setCandidateRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "Declined" } : r))
    );
    toast(`Application for ${req.name} declined.`, "info");
  };

  const handleApproveDistributorRequest = (req: DistributorRequestItem) => {
    setDistributorRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "Approved" } : r))
    );
    toast(`Distributor agency ${req.agencyName} partner credentials activated.`, "success");
  };

  const handleFulfillEnquiry = (enq: EnquiryRecord) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enq.id ? { ...e, status: "Approved" } : e))
    );
    toast(`Quota for ${enq.candidateName} (${enq.type}: ${enq.requestedQuantity}) fulfilled and billed.`, "success");
  };

  const filteredAudits = audits.filter(
    (a) =>
      a.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.affectedEntity.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <AppShell
      activeNav={activeNav}
      onNavigate={setActiveNav}
      notifications={notifications}
      pricingVisible={pricingVisible}
      onTogglePricingVisibility={setPricingVisible}
    >
      {/* 1. Dashboard View */}
      {activeNav === "dashboard" && (
        <DashboardView
          candidates={candidates}
          distributors={distributors}
          enquiries={enquiries}
          audits={audits}
          pricingVisible={pricingVisible}
          onTogglePricingVisibility={setPricingVisible}
          onNavigate={setActiveNav}
          onOpenAddCandidate={() => setActiveNav("add-candidate")}
        />
      )}

      {/* 2. Organizations Directory View */}
      {activeNav === "organizations" && (
        <div className="space-y-6">
          <PageHeader
            title="Organization & Client Management"
            description="Manage client organizations, campaign war rooms, electoral scope, commercial quotas, and status lifecycle."
            breadcrumbs={[
              { label: "Platform" },
              { label: "Organizations", active: true },
            ]}
            badge={
              <Badge variant="neutral">
                {organizations.length} Total Organizations
              </Badge>
            }
          />

          <OrganizationDirectory
            organizations={organizations}
            onAddOrganization={handleAddOrganization}
            onEditOrganization={handleEditOrganization}
            onUpdateOrgStatus={handleUpdateOrgStatus}
          />
        </div>
      )}

      {/* 3. All Candidates View */}
      {activeNav === "all-candidates" && (
        <div className="space-y-6">
          <PageHeader
            title="Candidate Accounts & War Rooms"
            description="Manage client accounts, field quotas, account classifications (Demo vs Permanent), and campaign operations."
            breadcrumbs={[
              { label: "Candidates" },
              { label: "All Candidates", active: true },
            ]}
            badge={
              <Badge variant="neutral">
                {candidates.length} Registered Candidates
              </Badge>
            }
            actions={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveNav("add-candidate")}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Candidate Wizard
              </Button>
            }
          />

          <CandidateDirectory
            candidates={candidates}
            onSelectCandidate={handleSelectCandidate}
            onOpenAddWizard={() => setActiveNav("add-candidate")}
            onToggleCandidateStatus={handleToggleCandidateStatus}
          />
        </div>
      )}

      {/* 4. Add Candidate Onboarding Wizard */}
      {activeNav === "add-candidate" && (
        <div className="space-y-6">
          <CandidateOnboardingWizard
            distributors={distributors}
            onCandidateCreated={(newCand) => {
              handleAddCandidate(newCand);
              setSelectedCandidate(newCand);
              setActiveNav("candidate-profile");
            }}
            onCancel={() => setActiveNav("all-candidates")}
          />
        </div>
      )}

      {/* 5. Candidate Profile & Control Panel View */}
      {activeNav === "candidate-profile" && (
        <div className="space-y-6">
          <PageHeader
            title="Candidate Account & Control Panel"
            description="Supervise candidate profile vitals, subscription quotas, electoral scope, and credential delivery."
            breadcrumbs={[
              { label: "Candidates" },
              { label: "All Candidates" },
              { label: selectedCandidate?.name || "Profile", active: true },
            ]}
          />

          <CandidateProfileView
            candidate={selectedCandidate || candidates[0]!}
            onBack={() => setActiveNav("all-candidates")}
            onUpdateCandidate={handleUpdateCandidate}
          />
        </div>
      )}

      {/* 4. Candidate Requests */}
      {activeNav === "candidate-requests" && (
        <div className="space-y-6">
          <PageHeader
            title="Inbound Candidate Onboarding Requests"
            description="Self-registration leads and distributor submissions awaiting Super Admin verification."
            breadcrumbs={[
              { label: "Candidates" },
              { label: "Candidate Requests", active: true },
            ]}
            badge={
              <Badge variant="warning">
                {candidateRequests.filter((r) => r.status === "Pending").length} Pending Verification
              </Badge>
            }
          />

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Constituency & Type</TableHead>
                  <TableHead>Channel Source</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidateRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {req.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {req.phone} &bull; {req.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {req.constituency}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {req.electionType} &bull; {req.party}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="purple">{req.source}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {req.submittedAt}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "Approved"
                            ? "success"
                            : req.status === "Declined"
                            ? "danger"
                            : "warning"
                        }
                        withDot
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="success"
                            size="xs"
                            onClick={() => handleApproveCandidateRequest(req)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleDeclineCandidateRequest(req)}
                          >
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Completed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 5. Generated Enquiries */}
      {activeNav === "enquiries" && (
        <div className="space-y-6">
          <PageHeader
            title="Generated Service & Top-up Enquiries"
            description="Candidate top-up tickets for WhatsApp messages, AI seats, voter data lists, and slip printers."
            breadcrumbs={[
              { label: "Candidates" },
              { label: "Generated Enquiries", active: true },
            ]}
            badge={
              <Badge variant="warning">
                {enquiries.filter((e) => e.status === "Pending").length} Actionable Tickets
              </Badge>
            }
          />

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Service Request</TableHead>
                  <TableHead>Requested Quota</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enq) => (
                  <TableRow key={enq.id}>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {enq.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {enq.candidateName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {enq.candidateId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {enq.type}
                      </div>
                      <div className="text-[11px] text-slate-400">{enq.category}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                      {enq.requestedQuantity}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          enq.status === "Approved"
                            ? "success"
                            : enq.status === "Completed"
                            ? "neutral"
                            : "warning"
                        }
                        withDot
                      >
                        {enq.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {enq.status === "Pending" ? (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleFulfillEnquiry(enq)}
                        >
                          Fulfill Quota
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Fulfilled</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 6. All Distributors */}
      {activeNav === "all-distributors" && (
        <div className="space-y-6">
          <PageHeader
            title="Distributor Franchise Network"
            description="Regional channel partners managing candidate onboarding across assembly and parliamentary constituencies."
            breadcrumbs={[
              { label: "Distributors" },
              { label: "All Distributors", active: true },
            ]}
          />

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Distributor Organization</TableHead>
                  <TableHead>Contact Lead</TableHead>
                  <TableHead>Region & State</TableHead>
                  <TableHead>Managed Candidates</TableHead>
                  <TableHead>Partner Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributors.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {d.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {d.id} &bull; Registered {d.registeredDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-800 dark:text-slate-200">
                        {d.contactPerson}
                      </div>
                      <div className="text-[11px] text-slate-400">{d.phone}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                      {d.city}, {d.state}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {d.candidateCount}
                      </span>{" "}
                      <span className="text-[11px] text-slate-400">War Rooms</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={d.status === "ACTIVE" ? "success" : "danger"}
                        withDot
                      >
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          toast(`Opening channel details for ${d.name}`, "info")
                        }
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 7. Distributor Requests */}
      {activeNav === "distributor-requests" && (
        <div className="space-y-6">
          <PageHeader
            title="Distributor Franchise Applications"
            description="Regional agency and technology partner applications awaiting territorial authorization."
            breadcrumbs={[
              { label: "Distributors" },
              { label: "Distributor Requests", active: true },
            ]}
            badge={
              <Badge variant="purple">
                {distributorRequests.filter((d) => d.status === "Pending").length} Pending Clearance
              </Badge>
            }
          />

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agency Name & ID</TableHead>
                  <TableHead>Contact Lead</TableHead>
                  <TableHead>Proposed Electoral Region</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributorRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {req.agencyName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {req.contactPerson}
                      </div>
                      <div className="text-[11px] text-slate-400">{req.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">{req.proposedTerritory}</div>
                      <div className="text-[11px] text-slate-500">{req.city}, {req.state}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {req.submittedAt}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "Approved"
                            ? "success"
                            : req.status === "Declined"
                            ? "danger"
                            : "warning"
                        }
                        withDot
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="success"
                            size="xs"
                            onClick={() => handleApproveDistributorRequest(req)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => {
                              setDistributorRequests((prev) =>
                                prev.map((r) => (r.id === req.id ? { ...r, status: "Declined" } : r))
                              );
                              toast(`Agency application for ${req.agencyName} declined.`, "info");
                            }}
                          >
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 8. Subscriptions & Pricing Management */}
      {activeNav === "subscriptions" && (
        <div className="space-y-6">
          <PageHeader
            title="Subscription Plans & Commercial Governance"
            description="Manage software tiers (Office vs Election modules) and toggle platform-wide pricing visibility."
            breadcrumbs={[{ label: "Subscriptions", active: true }]}
            actions={
              <Button
                variant={pricingVisible ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  const next = !pricingVisible;
                  setPricingVisible(next);
                  toast(
                    next
                      ? "Global Pricing Switch ENABLED: Candidate portals now display standard rate cards."
                      : "Global Pricing Switch DISABLED: Rate cards hidden; enquiry quotation mode enforced.",
                    next ? "info" : "warning"
                  );
                }}
                leftIcon={pricingVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              >
                Pricing Visibility: {pricingVisible ? "Public Rates" : "Hidden Quotes"}
              </Button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <Badge variant="purple" className="mb-2">Trial Tier</Badge>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                5-Day Evaluation Demo
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Full feature evaluation with up to 10 field workers. Auto-locks on day 5.
              </p>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                ₹0 <span className="text-xs text-slate-400 font-normal">/ 5 days</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <li>&bull; 10 Field Worker Accounts</li>
                <li>&bull; Up to 5,000 Voters List</li>
                <li>&bull; Standard Filter Schemas</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border-2 border-sky-600 bg-white dark:bg-slate-900 shadow-xs relative">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white">
                Most Popular
              </span>
              <Badge variant="info" className="mb-2">Office Module</Badge>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Office 12-Month Annual
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Year-round constituency liaison office with AI karyakarta and survey engine.
              </p>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {pricingVisible ? "₹1,50,000" : "[Quote On Request]"}{" "}
                <span className="text-xs text-slate-400 font-normal">/ year</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <li>&bull; 50 Field Worker Accounts</li>
                <li>&bull; Full Constituency Voter Roll</li>
                <li>&bull; 5 Concurrent AI Seats Included</li>
                <li>&bull; Slip Printer & WhatsApp Cloud API</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <Badge variant="success" className="mb-2">War Room Tier</Badge>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Election War Room Module
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Peak campaign operations with high concurrency, live turnout, and RinggAI voice bots.
              </p>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {pricingVisible ? "₹3,50,000" : "[Quote On Request]"}{" "}
                <span className="text-xs text-slate-400 font-normal">/ campaign</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <li>&bull; 150+ Field Worker Accounts</li>
                <li>&bull; 10 AI Strategist Seats</li>
                <li>&bull; Multi-Channel Outreach Suite</li>
                <li>&bull; Priority White-Label APK Pipeline</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 9. Platform Audit Log */}
      {activeNav === "audit" && (
        <div className="space-y-6">
          <PageHeader
            title="Platform Security & Audit Log"
            description="Immutable record of administrative operations, role escalations, and quota modifications."
            breadcrumbs={[{ label: "Super Admin" }, { label: "Platform Audit", active: true }]}
            badge={<Badge variant="success" withDot>ISO/IEC 27001 Compliant</Badge>}
          />

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <SearchInput
                value={auditSearch}
                onChange={setAuditSearch}
                placeholder="Filter by actor, action, or target entity..."
                className="max-w-md"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor & Identity</TableHead>
                  <TableHead>Action & Module</TableHead>
                  <TableHead>Target Entity</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.map((aud) => (
                  <TableRow key={aud.id}>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {aud.id}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      {aud.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {aud.actor}
                      </div>
                      <div className="text-[11px] text-slate-400">{aud.role}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {aud.action}
                      </span>
                      <div className="text-[11px] text-slate-500">{aud.module}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                      {aud.affectedEntity}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-500">
                      {aud.reference}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success" withDot>
                        {aud.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 10. Design System Showcase */}
      {activeNav === "components" && (
        <div className="space-y-6">
          <PageHeader
            title="Enterprise UI Foundation & Component Kit"
            description="Living design system, accessible form primitives, tokens, and verified interactive states."
            breadcrumbs={[{ label: "Design System", active: true }]}
          />

          <DesignSystemShowcase />
        </div>
      )}

      {/* 11. Fallback for other standard modules */}
      {![
        "dashboard",
        "organizations",
        "all-candidates",
        "add-candidate",
        "candidate-profile",
        "candidate-requests",
        "enquiries",
        "all-distributors",
        "distributor-requests",
        "subscriptions",
        "audit",
        "components",
      ].includes(activeNav) && (
        <div className="space-y-6">
          <PageHeader
            title={activeNav.replace(/-/g, " ").toUpperCase()}
            description="Governance controls and administrative data schemas for platform operations."
            breadcrumbs={[
              { label: "Super Admin" },
              { label: activeNav.replace(/-/g, " "), active: true },
            ]}
          />

          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
            <EmptyState
              title={`${activeNav.replace(/-/g, " ")} Module Initialized`}
              description="The architectural foundation, layout shell, and design system contracts are ready. Production endpoints connect in Phase 2."
              actionLabel="Return to Platform Dashboard"
              onAction={() => setActiveNav("dashboard")}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
