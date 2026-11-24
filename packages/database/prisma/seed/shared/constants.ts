export const SYSTEM_ROLE_IDS = {
  SUPER_ADMIN: "00000000-0000-0000-0000-000000000001",
  DISTRIBUTOR: "00000000-0000-0000-0000-000000000002",
  CANDIDATE_ADMIN: "00000000-0000-0000-0000-000000000003",
  KARYAKARTA: "00000000-0000-0000-0000-000000000004",
} as const;

export const SYSTEM_PORTAL_IDS = {
  SUPER_ADMIN: "10000000-0000-0000-0000-000000000001",
  CANDIDATE_WAR_ROOM: "10000000-0000-0000-0000-000000000002",
  DISTRIBUTOR_PARTNER: "10000000-0000-0000-0000-000000000003",
  KARYAKARTA_FIELD: "10000000-0000-0000-0000-000000000004",
} as const;

export const CORE_PERMISSIONS = [
  // Platform & Dashboard
  { code: "dashboard.view", domain: "platform", description: "Access the primary command dashboard" },
  { code: "settings.view", domain: "platform", description: "View organization/platform configuration" },
  { code: "settings.update", domain: "platform", description: "Modify configuration parameters" },
  { code: "audit.view", domain: "platform", description: "Inspect security and audit ledger" },

  // Users & Roles
  { code: "users.view", domain: "users", description: "Read user profiles and team member lists" },
  { code: "users.create", domain: "users", description: "Provision new user accounts" },
  { code: "users.update", domain: "users", description: "Edit user profiles and credentials" },
  { code: "users.delete", domain: "users", description: "Deactivate or archive user accounts" },
  { code: "roles.manage", domain: "users", description: "Manage roles and permission matrices" },

  // Organizations & Candidates
  { code: "organizations.view", domain: "organizations", description: "Read organization profiles" },
  { code: "organizations.create", domain: "organizations", description: "Provision new candidate organizations" },
  { code: "organizations.update", domain: "organizations", description: "Update organization parameters and quotas" },
  { code: "organizations.suspend", domain: "organizations", description: "Suspend or reactivate an organization" },
  { code: "candidates.view", domain: "candidates", description: "View candidate directory" },
  { code: "candidates.create", domain: "candidates", description: "Onboard new election candidates" },
  { code: "candidates.update", domain: "candidates", description: "Modify candidate profiles" },
  { code: "candidates.credentials", domain: "candidates", description: "Generate and dispatch login credentials" },

  // Electoral Operations (Voters & Booths)
  { code: "voters.view", domain: "voters", description: "Browse and search voter registry" },
  { code: "voters.create", domain: "voters", description: "Register new voters manually or via field surveys" },
  { code: "voters.import", domain: "voters", description: "Import electoral rolls and PDF extracts" },
  { code: "voters.export", domain: "voters", description: "Export filtered voter records" },
  { code: "voters.edit", domain: "voters", description: "Update voter demographics, facets and tags" },
  { code: "voters.delete", domain: "voters", description: "Archive or delete voter records" },
  { code: "booths.view", domain: "booths", description: "Inspect booth readiness and grade metrics" },
  { code: "booths.manage", domain: "booths", description: "Assign karyakartas and map BLO contacts" },
  { code: "map.view", domain: "telemetry", description: "Inspect live GIS map and field telemetry" },

  // Field Operations & Grievances
  { code: "surveys.view", domain: "field", description: "Inspect field survey results and analytics" },
  { code: "surveys.record", domain: "field", description: "Submit doorstep citizen feedback and demands" },
  { code: "tickets.view", domain: "field", description: "View civic grievance tickets" },
  { code: "tickets.manage", domain: "field", description: "Assign and resolve civic grievance tickets" },
  { code: "turnout.log", domain: "field", description: "Record hourly and individual voter turnout" },
  { code: "slips.dispatch", domain: "field", description: "Generate and dispatch voter slips" },

  // Campaigns & AI
  { code: "campaigns.view", domain: "campaigns", description: "View active communication campaigns" },
  { code: "campaigns.create", domain: "campaigns", description: "Broadcast WhatsApp/SMS messages" },
  { code: "campaigns.update", domain: "campaigns", description: "Modify scheduled campaign outreach" },
  { code: "ai.calling", domain: "campaigns", description: "Trigger automated AI voice calling rounds" },

  // Subscriptions & Finance
  { code: "subscriptions.view", domain: "finance", description: "View subscription quotas and plan details" },
  { code: "subscriptions.upgrade", domain: "finance", description: "Submit quota upgrade or recharge requests" },
  { code: "payments.verify", domain: "finance", description: "Verify billing payments and commercial waivers" },
] as const;

export const CORE_ROLES = [
  {
    id: SYSTEM_ROLE_IDS.SUPER_ADMIN,
    code: "SUPER_ADMIN",
    name: "Root Platform Administrator",
    description: "Unrestricted global clearance across all tenants, licensing, and platforms",
    isSystem: true,
  },
  {
    id: SYSTEM_ROLE_IDS.CANDIDATE_ADMIN,
    code: "CANDIDATE_ADMIN",
    name: "Candidate War Room Administrator",
    description: "Full management clearance inside assigned election constituency war room",
    isSystem: true,
  },
  {
    id: SYSTEM_ROLE_IDS.DISTRIBUTOR,
    code: "DISTRIBUTOR",
    name: "Franchise Distributor Partner",
    description: "Agency allocation, lead onboarding, and commission tracking clearance",
    isSystem: true,
  },
  {
    id: SYSTEM_ROLE_IDS.KARYAKARTA,
    code: "KARYAKARTA",
    name: "Field Canvassing Volunteer",
    description: "Assigned polling booth voter slip delivery, survey check-ins, and turnout logging",
    isSystem: true,
  },
] as const;

export const ROLE_PERMISSION_MATRIX: Record<string, readonly string[]> = {
  SUPER_ADMIN: ["*"], // Grant all
  CANDIDATE_ADMIN: [
    "dashboard.view",
    "settings.view",
    "settings.update",
    "audit.view",
    "users.view",
    "users.create",
    "users.update",
    "users.delete",
    "organizations.view",
    "organizations.update",
    "candidates.view",
    "candidates.update",
    "voters.view",
    "voters.create",
    "voters.import",
    "voters.export",
    "voters.edit",
    "voters.delete",
    "booths.view",
    "booths.manage",
    "map.view",
    "surveys.view",
    "tickets.view",
    "tickets.manage",
    "turnout.log",
    "slips.dispatch",
    "campaigns.view",
    "campaigns.create",
    "campaigns.update",
    "ai.calling",
    "subscriptions.view",
    "subscriptions.upgrade",
  ],
  DISTRIBUTOR: [
    "dashboard.view",
    "organizations.view",
    "candidates.view",
    "candidates.create",
    "subscriptions.view",
    "payments.verify",
  ],
  KARYAKARTA: [
    "dashboard.view",
    "voters.view",
    "voters.create",
    "voters.edit",
    "booths.view",
    "surveys.record",
    "tickets.view",
    "tickets.manage",
    "turnout.log",
    "slips.dispatch",
  ],
};

export const CORE_PORTALS = [
  {
    id: SYSTEM_PORTAL_IDS.SUPER_ADMIN,
    key: "SUPER_ADMIN",
    name: "Super Admin Platform Console",
    description: "Platform governance, multi-tenant war rooms, and KYC licensing",
    baseUrl: "http://localhost:3000/super-admin",
  },
  {
    id: SYSTEM_PORTAL_IDS.CANDIDATE_WAR_ROOM,
    key: "CANDIDATE_WAR_ROOM",
    name: "Candidate War Room Console",
    description: "Constituency voter intelligence, booth readiness, and field telemetry",
    baseUrl: "http://localhost:3000/candidate",
  },
  {
    id: SYSTEM_PORTAL_IDS.DISTRIBUTOR_PARTNER,
    key: "DISTRIBUTOR_PARTNER",
    name: "Distributor Partner Network",
    description: "Agency allocation, lead onboarding, and commission tracking",
    baseUrl: "http://localhost:3000/distributor/dashboard",
  },
  {
    id: SYSTEM_PORTAL_IDS.KARYAKARTA_FIELD,
    key: "KARYAKARTA_FIELD",
    name: "Field Volunteer Web Portal",
    description: "Booth voter slip delivery and survey check-ins",
    baseUrl: "http://localhost:3000/karyakarta/dashboard",
  },
] as const;

// =================================================================
// 2. GEOGRAPHY & ADMINISTRATIVE CONSTANTS
// =================================================================
export const GEOGRAPHY_REFERENCE = {
  STATE: "Maharashtra",
  DISTRICT: "Pune",
  CONSTITUENCIES: [
    { code: "215", name: "215 - Kasba Peth", type: "VIDHAN_SABHA", electionYear: 2026 },
    { code: "210", name: "210 - Kothrud", type: "VIDHAN_SABHA", electionYear: 2026 },
    { code: "214", name: "214 - Pune Cantonment", type: "VIDHAN_SABHA", electionYear: 2026 },
    { code: "034", name: "34 - Pune Parliamentary Constituency", type: "LOK_SABHA", electionYear: 2029 },
  ],
} as const;

// =================================================================
// 3. COMMERCIAL CONSTANTS (DISTRIBUTORS & PARTNERS)
// =================================================================
export const SYSTEM_DISTRIBUTOR_IDS = {
  SAHYADRI: "20000000-0000-0000-0000-000000000001",
  DECCAN: "20000000-0000-0000-0000-000000000002",
} as const;

export const SEED_DISTRIBUTORS = [
  {
    id: SYSTEM_DISTRIBUTOR_IDS.SAHYADRI,
    companyName: "Sahyadri Political Media & IT Services",
    contactName: "Vikas Deshmukh",
    email: "distributor@indiata.in",
    phone: "+919876543211",
    commissionRatePct: 20.0,
    bankAccountName: "Sahyadri Political Media Pvt Ltd",
    bankAccountNumber: "50200012345678",
    bankIfsc: "HDFC0000123",
    bankName: "HDFC Bank, FC Road Branch",
  },
  {
    id: SYSTEM_DISTRIBUTOR_IDS.DECCAN,
    companyName: "Deccan Electoral Solutions LLP",
    contactName: "Nitin Kulkarni",
    email: "nitin.kulkarni@deccanelectoral.in",
    phone: "+919876543219",
    commissionRatePct: 22.5,
    bankAccountName: "Deccan Electoral Solutions LLP",
    bankAccountNumber: "91002003004050",
    bankIfsc: "ICIC0000456",
    bankName: "ICICI Bank, Deccan Gymkhana",
  },
] as const;

// =================================================================
// 4. ELECTION ORGANIZATIONS / TENANCIES
// =================================================================
export const SYSTEM_ORGANIZATION_IDS = {
  KASBA_PETH: "30000000-0000-0000-0000-000000000001",
  KOTHRUD: "30000000-0000-0000-0000-000000000002",
} as const;

export const SEED_ORGANIZATIONS = [
  {
    id: SYSTEM_ORGANIZATION_IDS.KASBA_PETH,
    name: "Kasba Peth Constituency War Room 2026",
    slug: "kasba-peth-2026",
    state: "Maharashtra",
    district: "Pune",
    constituencyName: "215 - Kasba Peth",
    electionType: "VIDHAN_SABHA",
    pollingDate: new Date("2026-11-20"),
    distributorId: SYSTEM_DISTRIBUTOR_IDS.SAHYADRI,
    hasAiMode: true,
    aiSeatsLimit: 10,
  },
  {
    id: SYSTEM_ORGANIZATION_IDS.KOTHRUD,
    name: "Kothrud Constituency War Room 2026",
    slug: "kothrud-2026",
    state: "Maharashtra",
    district: "Pune",
    constituencyName: "210 - Kothrud",
    electionType: "VIDHAN_SABHA",
    pollingDate: new Date("2026-11-20"),
    distributorId: SYSTEM_DISTRIBUTOR_IDS.SAHYADRI,
    hasAiMode: true,
    aiSeatsLimit: 8,
  },
] as const;

// =================================================================
// 5. WORKFORCE & USERS
// =================================================================
export const SYSTEM_USER_IDS = {
  SUPER_ADMIN: "40000000-0000-0000-0000-000000000001",
  DISTRIBUTOR_USER: "40000000-0000-0000-0000-000000000002",
  CANDIDATE_ADMIN_KASBA: "40000000-0000-0000-0000-000000000003",
  CANDIDATE_ADMIN_KOTHRUD: "40000000-0000-0000-0000-000000000004",
  KARYAKARTA_1: "40000000-0000-0000-0000-000000000011",
  KARYAKARTA_2: "40000000-0000-0000-0000-000000000012",
  KARYAKARTA_3: "40000000-0000-0000-0000-000000000013",
} as const;

export const DEFAULT_DEV_PASSWORD = "Indiata@2026";
// bcrypt hash for "Indiata@2026" with 10 salt rounds:
export const DEFAULT_DEV_PASSWORD_HASH = "$2a$10$wJtKkWb1t7f8gK7oU9U20.i1x8bYlC93N.pM78WlH94vQkZ61p0kK";
