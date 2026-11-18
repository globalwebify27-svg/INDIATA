import {
  OrganizationPlanType,
  OrganizationStatus,
  DistributorStatus,
} from "@rajtantra/common-types";

export type ElectionType =
  | "Vidhan Sabha"
  | "Lok Sabha"
  | "Municipal Corporation"
  | "Zilla Parishad"
  | "Nagar Parishad"
  | "Gram Panchayat";

export type AccountType = "Sale" | "Demo";

export type OrganizationType =
  | "Candidate Campaign War Room"
  | "Constituency Party Office"
  | "Distributor Partner Entity"
  | "Coalition Campaign Hub";

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  organizationType: OrganizationType;
  associatedCandidateName: string;
  associatedCandidateId?: string;
  clientContactName: string;
  clientEmail: string;
  clientPhone: string;
  state: string;
  district: string;
  constituencyName: string;
  electionType: ElectionType;
  status: OrganizationStatus;
  planType: OrganizationPlanType;
  hasAiMode: boolean;
  aiSeatsLimit: number;
  pollingDate?: string;
  distributorId?: string;
  distributorName?: string;
  activeWorkersCount: number;
  maxWorkersLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateRecord {
  id: string;
  name: string;
  marathiName: string;
  username: string;
  email: string;
  phone: string;
  party: string;
  partyMarathi: string;
  symbol: string;
  electionType: ElectionType;
  electionName: string;
  electionYear: string;
  geography: string;
  accountType: AccountType;
  status: "Active" | "Inactive" | "Suspended" | "Pending";
  subscriptionStatus: "Active" | "Trial Expiring" | "Expired" | "Pending Renewal";
  planName: string;
  planType: OrganizationPlanType;
  usersUsed: number;
  usersAllowed: number;
  aiAccess: boolean;
  aiSeats: number;
  campaignStatus: "Active" | "Paused" | "Inactive";
  acquisitionSource: "Direct" | "Distributor";
  acquisitionDistributor: string;
  pendingEnquiries: number;
  appName: string;
  slipUrl: string;
  pdfAccess: boolean;
  excelAccess: boolean;
  imageAccess: boolean;
  apkAccess: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface DistributorRecord {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  status: DistributorStatus;
  candidateCount: number;
  registeredDate: string;
}

export interface EnquiryRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  type: string;
  category: "Communication" | "Intelligence" | "Data Access" | "Hardware";
  submissionDate: string;
  status: "Pending" | "Under Review" | "Approved" | "Completed" | "Rejected";
  requestedQuantity: string;
  remarks: string;
}

export interface CandidateRequestItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  constituency: string;
  electionType: ElectionType;
  party: string;
  source: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Declined";
  priority: "High" | "Normal";
}

export interface DistributorRequestItem {
  id: string;
  agencyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  proposedTerritory: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Declined";
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  module: string;
  affectedEntity: string;
  reference: string;
  result: "Success" | "Failed" | "Warning";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "candidate" | "distributor" | "security" | "billing";
  read: boolean;
  priority: "high" | "medium" | "low";
}

export type NavKey =
  | "dashboard"
  | "organizations"
  | "all-candidates"
  | "add-candidate"
  | "candidate-profile"
  | "candidate-requests"
  | "enquiries"
  | "campaigns"
  | "ai-dashboard"
  | "all-distributors"
  | "distributor-requests"
  | "subscriptions"
  | "audit"
  | "settings"
  | "profile"
  | "components";

// ============================================================================
// Granular Multi-Role & Cross-Portal System Configuration Types
// ============================================================================

export interface SuperAdminRoleConfig {
  sessionTimeoutMinutes: number;
  enforceStrict2FA: boolean;
  maxConcurrentSessions: number;
  auditRetentionDays: number;
  emergencyLockdown: boolean;
}

export interface CandidatePortalConfig {
  maxSubUsersLimit: number;
  allowVoterRollCsvExport: boolean;
  allowVoterRollExcelExport: boolean;
  allowVoterRollPdfExport: boolean;
  voterSlipQuotaPerDay: number;
  telemetryRefreshSeconds: number;
  aiCopilotDailyPromptLimit: number;
}

export interface DistributorPortalConfig {
  showCommissionTiers: boolean;
  selfOnboardingLeadLimit: number;
  autoApproveTrialLicenses: boolean;
  allowQuotaReallocation: boolean;
}

export interface KaryakartaPortalConfig {
  gpsGeofenceRadiusMeters: number;
  offlineSyncFrequencyMinutes: number;
  bluetoothThermalPrintingEnabled: boolean;
  allowDirectSentimentEdit: boolean;
  maxAudioNoteDurationSeconds: number;
}

export interface CitizenPortalConfig {
  rateLimitPerMinute: number;
  enforceSearchCaptcha: boolean;
  enableDirectWhatsAppSharing: boolean;
  maskPhoneNumberDigits: boolean;
}

export interface RolePortalSettingsConfig {
  superAdmin: SuperAdminRoleConfig;
  candidate: CandidatePortalConfig;
  distributor: DistributorPortalConfig;
  karyakarta: KaryakartaPortalConfig;
  citizen: CitizenPortalConfig;
}

// ============================================================================
// Notification & Redirection Management Types
// ============================================================================

export type NotificationFrequency =
  | "REAL_TIME"
  | "HOURLY_DIGEST"
  | "DAILY_SUMMARY"
  | "WEEKLY_BRIEF"
  | "MUTED";

export interface NotificationDeliveryConfig {
  globalFrequency: NotificationFrequency;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  maxSmsPerHour: number;
  maxWhatsAppPerDay: number;
  maxPushPerHour: number;
}

export type TargetPortalType =
  | "SUPER_ADMIN"
  | "CANDIDATE"
  | "DISTRIBUTOR"
  | "KARYAKARTA"
  | "CITIZEN";

export interface NotificationRedirectionConfig {
  targetPortal: TargetPortalType;
  routePath: string;
  fallbackRoute: string;
  passParameters: boolean;
}

export interface NotificationTemplateConfig {
  id: string;
  type: string;
  category: "candidate" | "distributor" | "security" | "billing" | "operations" | "voters";
  name: string;
  description: string;
  channels: {
    inApp: boolean;
    push: boolean;
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  frequency: NotificationFrequency;
  templateSubject: string;
  templateBody: string;
  availablePlaceholders: string[];
  redirection: NotificationRedirectionConfig;
  isActive: boolean;
}

export interface FullPlatformSettingsState {
  generalElectionCadence: string;
  highAvailabilityReplicas: number;
  pricingPublic: boolean;
  maintenanceMode: boolean;
  roleSettings: RolePortalSettingsConfig;
  notificationDelivery: NotificationDeliveryConfig;
  notificationTemplates: NotificationTemplateConfig[];
}
