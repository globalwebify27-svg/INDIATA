import {
  MOCK_CANDIDATES,
  MOCK_DISTRIBUTORS,
  MOCK_ENQUIRIES,
  MOCK_AUDITS,
  MOCK_NOTIFICATIONS,
  MOCK_ORGANIZATIONS,
  MOCK_CANDIDATE_REQUESTS,
  MOCK_DISTRIBUTOR_REQUESTS,
} from "@/superadmin/data/mock-superadmin-data";
import {
  CandidateRecord,
  DistributorRecord,
  EnquiryRecord,
  CandidateRequestItem,
  DistributorRequestItem,
  AuditRecord,
  NotificationItem,
  OrganizationRecord,
} from "@/superadmin/types/superadmin.types";
import { OrganizationStatus, DistributorStatus } from "@rajtantra/common-types";

export interface CampaignRecord {
  id: string;
  candidateName: string;
  warRoom: string;
  title: string;
  channel: "WhatsApp" | "SMS" | "Voice OBD";
  recipientsCount: number;
  deliveredCount: number;
  failedCount: number;
  status: "Completed" | "Processing" | "Scheduled" | "Paused";
  dltTemplateId: string;
  dispatchedAt: string;
}

export interface AiTenantUsage {
  id: string;
  candidateName: string;
  warRoom: string;
  electionType: string;
  seatsAllocated: number;
  seatsUsed: number;
  tokensThisMonth: number;
  tokenCap: number;
  sentimentQueries: number;
  speechGenerations: number;
  status: "Healthy" | "Quota Warning" | "Throttled";
}

export interface LicenseRecord {
  id: string;
  licenseKey: string;
  candidateName: string;
  planName: string;
  planType: string;
  amount: string;
  issuedDate: string;
  expiresAt: string;
  status: "Active" | "Expiring Soon" | "Expired";
  autoRenew: boolean;
}

export interface SettlementBatch {
  id: string;
  distributorId: string;
  distributorName: string;
  amount: string;
  candidatesCount: number;
  batchPeriod: string;
  status: "Pending Review" | "Verified" | "Disbursed";
}

export interface PendingApprovalItem {
  id: string;
  entityName: string;
  type: "KYC Clearance" | "Tier Upgrade" | "Distributor Franchise" | "Voter Roll Sync";
  submittedBy: string;
  locus: string;
  status: "Actionable" | "Approved" | "Rejected";
  timestamp: string;
}

// Global Singleton in-memory store for Next.js App Router (persists across requests in node runtime)
class SuperAdminDataStore {
  private organizations: OrganizationRecord[] = [...MOCK_ORGANIZATIONS];
  private candidates: CandidateRecord[] = [...MOCK_CANDIDATES];
  private distributors: DistributorRecord[] = [...MOCK_DISTRIBUTORS];
  private candidateRequests: CandidateRequestItem[] = [...MOCK_CANDIDATE_REQUESTS];
  private distributorRequests: DistributorRequestItem[] = [...MOCK_DISTRIBUTOR_REQUESTS];
  private enquiries: EnquiryRecord[] = [...MOCK_ENQUIRIES];
  private audits: AuditRecord[] = [...MOCK_AUDITS];
  private notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];

  private pendingApprovals: PendingApprovalItem[] = [
    {
      id: "APPR-101",
      entityName: "Kothrud Central Campaign Committee",
      type: "KYC Clearance",
      submittedBy: "RO Ashok Shinde",
      locus: "AC-210 • 42 Booth Agents mapped",
      status: "Actionable",
      timestamp: "12m ago",
    },
    {
      id: "APPR-102",
      entityName: "Western Gateway Agency",
      type: "Tier Upgrade",
      submittedBy: "Franchise Lead: Rajesh Bhatia",
      locus: "Platinum Tier (18% margin on bulk ward packs)",
      status: "Actionable",
      timestamp: "35m ago",
    },
    {
      id: "APPR-103",
      entityName: "Baramati Lok Sabha Digital Hub",
      type: "Voter Roll Sync",
      submittedBy: "Data Officer: S. Kulkarni",
      locus: "14.2 Lakh Electors draft sync verified",
      status: "Actionable",
      timestamp: "1h ago",
    },
  ];

  private campaigns: CampaignRecord[] = [
    {
      id: "CAMP-901",
      candidateName: "Rameshwar Patil",
      warRoom: "Pune Cantonment (AC-214)",
      title: "Rally Announcement & Voter Slip Dispatch",
      channel: "WhatsApp",
      recipientsCount: 45000,
      deliveredCount: 44320,
      failedCount: 680,
      status: "Completed",
      dltTemplateId: "DLT-PUN-00129",
      dispatchedAt: "10 Nov 2026, 09:30 AM",
    },
    {
      id: "CAMP-902",
      candidateName: "Devendra Deshmukh",
      warRoom: "Baramati (PC-35)",
      title: "Booth Worker Telemetry Sync Notice",
      channel: "SMS",
      recipientsCount: 12000,
      deliveredCount: 11890,
      failedCount: 110,
      status: "Completed",
      dltTemplateId: "DLT-BAR-99042",
      dispatchedAt: "10 Nov 2026, 04:15 PM",
    },
    {
      id: "CAMP-903",
      candidateName: "Sunita Ravindra Jadhav",
      warRoom: "PMC Ward 14 (Kothrud)",
      title: "Ward Level Health Camp & PMAY Scheme Push",
      channel: "WhatsApp",
      recipientsCount: 8500,
      deliveredCount: 6200,
      failedCount: 120,
      status: "Processing",
      dltTemplateId: "DLT-PMC-14201",
      dispatchedAt: "11 Nov 2026, 11:00 AM",
    },
    {
      id: "CAMP-904",
      candidateName: "Vijayrao Patil-Kadam",
      warRoom: "Sangli (AC-282)",
      title: "Key Opinion Leader Interactive Audio Cast",
      channel: "Voice OBD",
      recipientsCount: 25000,
      deliveredCount: 24100,
      failedCount: 900,
      status: "Completed",
      dltTemplateId: "DLT-SNG-77821",
      dispatchedAt: "09 Nov 2026, 06:45 PM",
    },
  ];

  private aiTenants: AiTenantUsage[] = [
    {
      id: "AI-TEN-01",
      candidateName: "Devendra Deshmukh",
      warRoom: "Baramati Parliamentary Hub",
      electionType: "Lok Sabha",
      seatsAllocated: 12,
      seatsUsed: 10,
      tokensThisMonth: 18450000,
      tokenCap: 25000000,
      sentimentQueries: 14200,
      speechGenerations: 450,
      status: "Healthy",
    },
    {
      id: "AI-TEN-02",
      candidateName: "Rameshwar Patil",
      warRoom: "Pune Cantonment Office",
      electionType: "Vidhan Sabha",
      seatsAllocated: 5,
      seatsUsed: 5,
      tokensThisMonth: 11890000,
      tokenCap: 12000000,
      sentimentQueries: 8940,
      speechGenerations: 210,
      status: "Quota Warning",
    },
    {
      id: "AI-TEN-03",
      candidateName: "Vijayrao Patil-Kadam",
      warRoom: "Sangli City Campaign",
      electionType: "Vidhan Sabha",
      seatsAllocated: 3,
      seatsUsed: 2,
      tokensThisMonth: 4120000,
      tokenCap: 10000000,
      sentimentQueries: 3100,
      speechGenerations: 95,
      status: "Healthy",
    },
  ];

  private licenses: LicenseRecord[] = [
    {
      id: "LIC-1001",
      licenseKey: "IND-2026-VS-9882-XQ",
      candidateName: "Rameshwar Patil",
      planName: "Vidhan Sabha Enterprise (12M)",
      planType: "OFFICE_12M",
      amount: "₹2,50,000",
      issuedDate: "12 Mar 2024",
      expiresAt: "31 Dec 2026",
      status: "Active",
      autoRenew: true,
    },
    {
      id: "LIC-1002",
      licenseKey: "IND-2026-LS-4412-BB",
      candidateName: "Devendra Deshmukh",
      planName: "Lok Sabha Supreme (Full Cadence)",
      planType: "ELECTION_MODULE",
      amount: "₹6,00,000",
      issuedDate: "15 Jan 2024",
      expiresAt: "30 Jun 2026",
      status: "Active",
      autoRenew: true,
    },
    {
      id: "LIC-1003",
      licenseKey: "IND-2026-MC-3310-TT",
      candidateName: "Sunita Ravindra Jadhav",
      planName: "Municipal 5-Day Trial Demo",
      planType: "TRIAL_5D",
      amount: "₹0 (Trial)",
      issuedDate: "01 Apr 2024",
      expiresAt: "15 Apr 2026",
      status: "Expiring Soon",
      autoRenew: false,
    },
  ];

  private settlements: SettlementBatch[] = [
    {
      id: "SETTLE-B1",
      distributorId: "DIS-101",
      distributorName: "MahaMedia Political Solutions",
      amount: "₹2,40,000",
      candidatesCount: 14,
      batchPeriod: "Oct - Nov 2026",
      status: "Pending Review",
    },
    {
      id: "SETTLE-B2",
      distributorId: "DIS-102",
      distributorName: "Vidarbha-Western Digitech",
      amount: "₹1,60,000",
      candidatesCount: 8,
      batchPeriod: "Oct - Nov 2026",
      status: "Pending Review",
    },
    {
      id: "SETTLE-B3",
      distributorId: "DIS-103",
      distributorName: "Sahyadri Campaign Tech",
      amount: "₹80,000",
      candidatesCount: 5,
      batchPeriod: "Oct - Nov 2026",
      status: "Pending Review",
    },
  ];

  private settings = {
    generalElectionCadence: "Maharashtra Phase IV Readiness",
    pricingPublic: true,
    highAvailabilityReplicas: 3,
    maintenanceMode: false,
    clusterHealth: "Operational (99.98% SLA)",
    primaryDatabase: "PostgreSQL 16 HA Cluster",
    redisTelemetry: "Redis Sentinel Cluster UP",
    smsDltRelay: "National DLT Multi-Gateway UP",
  };

  // -------------------------------------------------------------
  // Audit Logger Helper
  // -------------------------------------------------------------
  public logAudit(
    action: string,
    module: string,
    affectedEntity: string,
    reference: string,
    result: "Success" | "Failed" | "Warning" = "Success"
  ): AuditRecord {
    const newRecord: AuditRecord = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      actor: "admin@indiata.gov.in",
      role: "Super Administrator",
      action,
      module,
      affectedEntity,
      reference,
      result,
    };
    this.audits.unshift(newRecord);
    return newRecord;
  }

  // -------------------------------------------------------------
  // Dashboard & Overview
  // -------------------------------------------------------------
  public getDashboardOverview() {
    const totalOrgs = this.organizations.length;
    const activeSubs = this.candidates.filter((c) => c.status === "Active").length;
    const pendingReqs = this.pendingApprovals.filter((p) => p.status === "Actionable").length;

    return {
      kpis: {
        totalOrganizations: totalOrgs,
        activeSubscriptions: activeSubs,
        pendingRequests: pendingReqs,
        settlementsTotal: "₹4.8L",
        settlementBatches: this.settlements.filter((s) => s.status === "Pending Review").length,
      },
      cadence: this.settings.generalElectionCadence,
      clusterHealth: this.settings.clusterHealth,
      pricingPublic: this.settings.pricingPublic,
      tierDistribution: [
        { tier: "Vidhan Sabha War Room", count: 58, pct: 56 },
        { tier: "Lok Sabha War Room", count: 32, pct: 31 },
        { tier: "Municipal & Civic Tier", count: 14, pct: 13 },
      ],
    };
  }

  public getPendingApprovals() {
    return this.pendingApprovals;
  }

  public handleApprovalAction(id: string, action: "approve" | "reject" | "verify") {
    const item = this.pendingApprovals.find((p) => p.id === id);
    if (!item) return null;

    item.status = action === "reject" ? "Rejected" : "Approved";
    this.logAudit(
      action === "approve" ? "APPROVAL_GRANTED" : action === "verify" ? "SETTLEMENT_VERIFIED" : "APPROVAL_REJECTED",
      "Executive Dashboard",
      item.entityName,
      item.id,
      "Success"
    );
    return item;
  }

  // -------------------------------------------------------------
  // Organizations
  // -------------------------------------------------------------
  public getOrganizations(query?: { status?: string; electionType?: string; search?: string }) {
    let list = [...this.organizations];
    if (query?.status && query.status !== "ALL") {
      list = list.filter((o) => o.status === query.status);
    }
    if (query?.electionType && query.electionType !== "ALL") {
      list = list.filter((o) => o.electionType === query.electionType);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.constituencyName.toLowerCase().includes(q) ||
          o.associatedCandidateName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getOrganizationById(id: string) {
    return this.organizations.find((o) => o.id === id) || null;
  }

  public addOrganization(orgData: Partial<OrganizationRecord>) {
    const id = `ORG-${Date.now().toString().slice(-4)}`;
    const newOrg: OrganizationRecord = {
      id,
      name: orgData.name || "New Campaign Office",
      slug: orgData.slug || `org-${id.toLowerCase()}`,
      organizationType: orgData.organizationType || "Candidate Campaign War Room",
      associatedCandidateName: orgData.associatedCandidateName || "Unassigned",
      associatedCandidateId: orgData.associatedCandidateId,
      clientContactName: orgData.clientContactName || "Administrator",
      clientEmail: orgData.clientEmail || "contact@campaign.in",
      clientPhone: orgData.clientPhone || "+91 98000 00000",
      state: orgData.state || "Maharashtra",
      district: orgData.district || "Pune",
      constituencyName: orgData.constituencyName || "Constituency 01",
      electionType: orgData.electionType || "Vidhan Sabha",
      status: orgData.status || OrganizationStatus.ACTIVE,
      planType: orgData.planType || ("OFFICE_12M" as any),
      hasAiMode: orgData.hasAiMode ?? true,
      aiSeatsLimit: orgData.aiSeatsLimit ?? 5,
      pollingDate: orgData.pollingDate || "2026-11-20",
      activeWorkersCount: orgData.activeWorkersCount || 0,
      maxWorkersLimit: orgData.maxWorkersLimit || 50,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    this.organizations.unshift(newOrg);
    this.logAudit("NEW_ORGANIZATION_CREATED", "Organization Module", newOrg.name, newOrg.id);
    return newOrg;
  }

  public updateOrganizationStatus(id: string, status: OrganizationStatus, reason?: string) {
    const org = this.organizations.find((o) => o.id === id);
    if (!org) return null;
    org.status = status;
    org.updatedAt = new Date().toISOString().slice(0, 10);
    this.logAudit("ORGANIZATION_STATUS_CHANGED", "Organization Module", `${org.name} (${status})`, reason || id);
    return org;
  }

  // -------------------------------------------------------------
  // Candidates
  // -------------------------------------------------------------
  public getCandidates(query?: { party?: string; electionType?: string; status?: string; search?: string }) {
    let list = [...this.candidates];
    if (query?.party && query.party !== "ALL") {
      list = list.filter((c) => c.party === query.party);
    }
    if (query?.electionType && query.electionType !== "ALL") {
      list = list.filter((c) => c.electionType === query.electionType);
    }
    if (query?.status && query.status !== "ALL") {
      list = list.filter((c) => c.status.toLowerCase() === query.status?.toLowerCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.geography.toLowerCase().includes(q) ||
          c.party.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getCandidateById(id: string) {
    return this.candidates.find((c) => c.id === id) || null;
  }

  public addCandidate(data: Partial<CandidateRecord>) {
    const id = `CAN-${Date.now().toString().slice(-4)}`;
    const newCand: CandidateRecord = {
      id,
      name: data.name || "New Candidate",
      marathiName: data.marathiName || data.name || "उमेदवार",
      username: data.username || `cand_${id.toLowerCase()}`,
      email: data.email || "candidate@rajtantra.in",
      phone: data.phone || "+91 98000 00000",
      party: data.party || "Independent",
      partyMarathi: data.partyMarathi || "अपक्ष",
      symbol: data.symbol || "Cup & Saucer",
      electionType: data.electionType || "Vidhan Sabha",
      electionName: data.electionName || "Maharashtra Assembly 2026",
      electionYear: "2026",
      geography: data.geography || "Kasba Peth (AC-215)",
      accountType: data.accountType || "Sale",
      status: "Active",
      subscriptionStatus: "Active",
      planName: data.planName || "Vidhan Sabha Enterprise",
      planType: data.planType || ("OFFICE_12M" as any),
      usersUsed: 1,
      usersAllowed: data.usersAllowed || 50,
      aiAccess: data.aiAccess ?? true,
      aiSeats: data.aiSeats ?? 5,
      campaignStatus: "Active",
      acquisitionSource: data.acquisitionSource || "Direct",
      acquisitionDistributor: data.acquisitionDistributor || "Direct Platform Portal",
      pendingEnquiries: 0,
      appName: data.appName || `${data.name || "Candidate"} Express`,
      slipUrl: `https://slips.indiata.gov.in/${id.toLowerCase()}`,
      pdfAccess: data.pdfAccess ?? true,
      excelAccess: data.excelAccess ?? true,
      imageAccess: data.imageAccess ?? true,
      apkAccess: data.apkAccess ?? true,
      createdAt: new Date().toISOString().slice(0, 10),
      expiresAt: "2026-12-31",
    };
    this.candidates.unshift(newCand);
    this.logAudit("CANDIDATE_ONBOARDED", "Candidate Management", `${newCand.name} (${newCand.party})`, newCand.id);
    return newCand;
  }

  public toggleCandidateStatus(id: string) {
    const cand = this.candidates.find((c) => c.id === id);
    if (!cand) return null;
    cand.status = cand.status === "Active" ? "Suspended" : "Active";
    this.logAudit("CANDIDATE_STATUS_TOGGLED", "Candidate Management", `${cand.name} (${cand.status})`, cand.id);
    return cand;
  }

  // -------------------------------------------------------------
  // Leads & Enquiries
  // -------------------------------------------------------------
  public getCandidateRequests() {
    return this.candidateRequests;
  }

  public handleCandidateRequestAction(id: string, action: "approve" | "decline") {
    const req = this.candidateRequests.find((r) => r.id === id);
    if (!req) return null;
    req.status = action === "approve" ? "Approved" : "Declined";

    if (action === "approve") {
      this.addCandidate({
        name: req.name,
        phone: req.phone,
        email: req.email,
        geography: req.constituency,
        electionType: req.electionType,
        party: req.party,
      });
    }

    this.logAudit("CANDIDATE_LEAD_PROCESSED", "Leads Queue", `${req.name} (${req.status})`, req.id);
    return req;
  }

  public getEnquiries() {
    return this.enquiries;
  }

  public updateEnquiryStatus(id: string, status: "Approved" | "Completed" | "Rejected", remarks?: string) {
    const enq = this.enquiries.find((e) => e.id === id);
    if (!enq) return null;
    enq.status = status;
    if (remarks) enq.remarks = remarks;
    this.logAudit("ENQUIRY_STATUS_UPDATED", "Service & Quota Requests", `${enq.type} - ${enq.candidateName}`, enq.id);
    return enq;
  }

  // -------------------------------------------------------------
  // Distributors
  // -------------------------------------------------------------
  public getDistributors(search?: string) {
    if (!search) return this.distributors;
    const q = search.toLowerCase();
    return this.distributors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.contactPerson.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q)
    );
  }

  public addDistributor(data: Partial<DistributorRecord>) {
    const id = `DIS-${Date.now().toString().slice(-3)}`;
    const newDist: DistributorRecord = {
      id,
      name: data.name || "New Regional Partner",
      contactPerson: data.contactPerson || "Lead Partner",
      email: data.email || "partner@franchise.in",
      phone: data.phone || "+91 98000 00000",
      city: data.city || "Pune",
      state: data.state || "Maharashtra",
      status: DistributorStatus.ACTIVE,
      candidateCount: 0,
      registeredDate: new Date().toISOString().slice(0, 10),
    };
    this.distributors.unshift(newDist);
    this.logAudit("DISTRIBUTOR_ONBOARDED", "Franchise Governance", newDist.name, newDist.id);
    return newDist;
  }

  public toggleDistributorStatus(id: string) {
    const dist = this.distributors.find((d) => d.id === id);
    if (!dist) return null;
    dist.status = dist.status === DistributorStatus.ACTIVE ? DistributorStatus.SUSPENDED : DistributorStatus.ACTIVE;
    this.logAudit("DISTRIBUTOR_STATUS_TOGGLED", "Franchise Governance", `${dist.name} (${dist.status})`, dist.id);
    return dist;
  }

  public getDistributorRequests() {
    return this.distributorRequests;
  }

  public handleDistributorRequestAction(id: string, action: "approve" | "decline") {
    const req = this.distributorRequests.find((r) => r.id === id);
    if (!req) return null;
    req.status = action === "approve" ? "Approved" : "Declined";

    if (action === "approve") {
      this.addDistributor({
        name: req.agencyName,
        contactPerson: req.contactPerson,
        phone: req.phone,
        email: req.email,
        city: req.city,
        state: req.state,
      });
    }

    this.logAudit("DISTRIBUTOR_APPLICATION_PROCESSED", "Franchise Leads", `${req.agencyName} (${req.status})`, req.id);
    return req;
  }

  public getSettlements() {
    return this.settlements;
  }

  public verifySettlement(id: string) {
    const s = this.settlements.find((item) => item.id === id);
    if (!s) return null;
    s.status = "Verified";
    this.logAudit("SETTLEMENT_BATCH_VERIFIED", "Franchise Settlements", `${s.distributorName} (${s.amount})`, s.id);
    return s;
  }

  // -------------------------------------------------------------
  // Campaigns & Telemetry
  // -------------------------------------------------------------
  public getCampaigns() {
    return this.campaigns;
  }

  public getCampaignTelemetry() {
    const totalRecipients = this.campaigns.reduce((acc, c) => acc + c.recipientsCount, 0);
    const totalDelivered = this.campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
    const totalFailed = this.campaigns.reduce((acc, c) => acc + c.failedCount, 0);
    const avgDeliveryRate = totalRecipients ? ((totalDelivered / totalRecipients) * 100).toFixed(1) : "98.5";

    return {
      totalCampaigns: this.campaigns.length,
      totalRecipients,
      totalDelivered,
      totalFailed,
      deliveryRatePct: avgDeliveryRate,
      throughputMsgSec: 450,
      dltCompliancePct: 100,
      gateways: [
        { name: "WhatsApp Cloud Business Relay (Meta)", status: "Active", latency: "14ms" },
        { name: "National SMS DLT Route (AirTel/Jio)", status: "Active", latency: "28ms" },
        { name: "Interactive Voice OBD Carrier Pool", status: "Active", latency: "42ms" },
      ],
    };
  }

  // -------------------------------------------------------------
  // AI Governance
  // -------------------------------------------------------------
  public getAiGovernanceStats() {
    const totalTokens = this.aiTenants.reduce((acc, t) => acc + t.tokensThisMonth, 0);
    const totalQueries = this.aiTenants.reduce((acc, t) => acc + t.sentimentQueries, 0);
    const totalSpeech = this.aiTenants.reduce((acc, t) => acc + t.speechGenerations, 0);
    const totalSeatsAllocated = this.aiTenants.reduce((acc, t) => acc + t.seatsAllocated, 0);

    return {
      totalTokensConsumed: `${(totalTokens / 1000000).toFixed(1)}M Tokens`,
      totalQueriesProcessed: totalQueries,
      totalSpeechGenerated: totalSpeech,
      activeSeats: totalSeatsAllocated,
      safetyFiltersTriggered: 14,
      tenants: this.aiTenants,
    };
  }

  public updateAiTenantQuota(id: string, additionalSeats: number) {
    const tenant = this.aiTenants.find((t) => t.id === id);
    if (!tenant) return null;
    tenant.seatsAllocated += additionalSeats;
    this.logAudit("AI_SEATS_EXTENDED", "AI Governance", `${tenant.candidateName} (+${additionalSeats} seats)`, tenant.id);
    return tenant;
  }

  // -------------------------------------------------------------
  // Subscriptions & Licenses
  // -------------------------------------------------------------
  public getLicenses() {
    return this.licenses;
  }

  public generateLicense(candidateName: string, planName: string, amount: string) {
    const id = `LIC-${Date.now().toString().slice(-4)}`;
    const licenseKey = `IND-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newLic: LicenseRecord = {
      id,
      licenseKey,
      candidateName,
      planName,
      planType: "OFFICE_12M",
      amount,
      issuedDate: new Date().toISOString().slice(0, 10),
      expiresAt: "2027-04-30",
      status: "Active",
      autoRenew: true,
    };
    this.licenses.unshift(newLic);
    this.logAudit("LICENSE_GENERATED", "Subscription Engine", `${candidateName} (${planName})`, licenseKey);
    return newLic;
  }

  // -------------------------------------------------------------
  // Security Audit Ledger
  // -------------------------------------------------------------
  public getAudits(search?: string, module?: string) {
    let list = [...this.audits];
    if (module && module !== "ALL") {
      list = list.filter((a) => a.module.toLowerCase().includes(module.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.action.toLowerCase().includes(q) ||
          a.affectedEntity.toLowerCase().includes(q) ||
          a.actor.toLowerCase().includes(q)
      );
    }
    return list;
  }

  // -------------------------------------------------------------
  // Platform Settings
  // -------------------------------------------------------------
  public getSettings() {
    return this.settings;
  }

  public updateSettings(partial: Partial<typeof this.settings>) {
    this.settings = { ...this.settings, ...partial };
    this.logAudit("PLATFORM_CONFIG_UPDATED", "System Settings", "Global Parameters", "SETTINGS-01");
    return this.settings;
  }

  public getNotifications() {
    return this.notifications;
  }
}

// Global variable on globalThis to survive Next.js Fast Refresh in development
const globalForStore = globalThis as unknown as { superAdminStore?: SuperAdminDataStore };
export const superAdminStore = globalForStore.superAdminStore || new SuperAdminDataStore();
if (process.env.NODE_ENV !== "production") globalForStore.superAdminStore = superAdminStore;
