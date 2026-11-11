/**
 * Central API Client for Super Admin Portal
 * Connects UI views to Next.js App Router API endpoints (/api/superadmin/...)
 */

export const superAdminApi = {
  // Dashboard
  async getDashboardOverview() {
    const res = await fetch("/api/superadmin/dashboard");
    return res.json();
  },

  async getPendingApprovals() {
    const res = await fetch("/api/superadmin/dashboard/pending-approvals");
    return res.json();
  },

  async handlePendingApproval(id: string, action: "approve" | "reject" | "verify") {
    const res = await fetch("/api/superadmin/dashboard/pending-approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    return res.json();
  },

  // Organizations
  async getOrganizations(params?: { status?: string; electionType?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.electionType) query.set("electionType", params.electionType);
    if (params?.search) query.set("search", params.search);
    const res = await fetch(`/api/superadmin/organizations?${query.toString()}`);
    return res.json();
  },

  async addOrganization(data: any) {
    const res = await fetch("/api/superadmin/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateOrganizationStatus(id: string, status: string, reason?: string) {
    const res = await fetch(`/api/superadmin/organizations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason }),
    });
    return res.json();
  },

  // Candidates
  async getCandidates(params?: { party?: string; electionType?: string; status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.party) query.set("party", params.party);
    if (params?.electionType) query.set("electionType", params.electionType);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const res = await fetch(`/api/superadmin/candidates?${query.toString()}`);
    return res.json();
  },

  async addCandidate(data: any) {
    const res = await fetch("/api/superadmin/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async toggleCandidateStatus(id: string) {
    const res = await fetch(`/api/superadmin/candidates/${id}`, {
      method: "PATCH",
    });
    return res.json();
  },

  async getCandidateRequests() {
    const res = await fetch("/api/superadmin/candidates/requests");
    return res.json();
  },

  async handleCandidateRequest(id: string, action: "approve" | "decline") {
    const res = await fetch("/api/superadmin/candidates/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    return res.json();
  },

  // Enquiries
  async getEnquiries() {
    const res = await fetch("/api/superadmin/enquiries");
    return res.json();
  },

  async updateEnquiryStatus(id: string, status: string, remarks?: string) {
    const res = await fetch("/api/superadmin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, remarks }),
    });
    return res.json();
  },

  // Distributors
  async getDistributors(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/superadmin/distributors${query}`);
    return res.json();
  },

  async addDistributor(data: any) {
    const res = await fetch("/api/superadmin/distributors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async toggleDistributorStatus(id: string) {
    const res = await fetch(`/api/superadmin/distributors/${id}/status`, {
      method: "PATCH",
    });
    return res.json();
  },

  async getDistributorRequests() {
    const res = await fetch("/api/superadmin/distributors/requests");
    return res.json();
  },

  async handleDistributorRequest(id: string, action: "approve" | "decline") {
    const res = await fetch("/api/superadmin/distributors/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    return res.json();
  },

  async getSettlements() {
    const res = await fetch("/api/superadmin/distributors/settlements");
    return res.json();
  },

  async verifySettlement(id: string) {
    const res = await fetch("/api/superadmin/distributors/settlements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },

  // Campaigns
  async getCampaigns() {
    const res = await fetch("/api/superadmin/campaigns");
    return res.json();
  },

  // AI Governance
  async getAiGovernance() {
    const res = await fetch("/api/superadmin/ai-governance");
    return res.json();
  },

  async updateAiQuota(id: string, additionalSeats: number) {
    const res = await fetch("/api/superadmin/ai-governance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, additionalSeats }),
    });
    return res.json();
  },

  // Subscriptions
  async getSubscriptions() {
    const res = await fetch("/api/superadmin/subscriptions");
    return res.json();
  },

  async generateLicense(candidateName: string, planName: string, amount: string) {
    const res = await fetch("/api/superadmin/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateName, planName, amount }),
    });
    return res.json();
  },

  // Audits
  async getAudits(search?: string, moduleName?: string) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (moduleName) query.set("module", moduleName);
    const res = await fetch(`/api/superadmin/audit?${query.toString()}`);
    return res.json();
  },

  async exportAudits(format = "CSV") {
    const res = await fetch("/api/superadmin/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format }),
    });
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch("/api/superadmin/settings");
    return res.json();
  },

  async updateSettings(data: any) {
    const res = await fetch("/api/superadmin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
