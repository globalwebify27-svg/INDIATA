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
