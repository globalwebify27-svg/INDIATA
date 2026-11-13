export type LanguageType = "en" | "mr" | "hi";

export type KaryakartaStatus = "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "REJECTED";

export interface KaryakartaUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  organizationId: string;
  candidateName: string;
  constituencyName: string;
  assignedBooths: string[];
  assignedArea: string;
  status: KaryakartaStatus;
  hasAiSeat: boolean;
  deviceUuid: string;
  createdAt: string;
  rejectionReason?: string;
  suspendedReason?: string;
}

export type VoterClassification = "Supporter" | "Opponent" | "Doubtful" | "Neutral";

export interface VoterRecord {
  id: string;
  epicId: string;
  serialNumber?: number;
  name: string;
  marathiName: string;
  relativeName: string;
  relation: "S/o" | "D/o" | "W/o" | "Other";
  age: number;
  gender: "M" | "F" | "Other";
  dob: string;
  houseNo: string;
  address: string;
  village: string;
  ward: string;
  prabhaag: string;
  electoralPart: string;
  boothNumber: string;
  boothName: string;
  phone: string | null;
  hasPhoto: boolean;
  caste: string;
  occupation: string;
  qualification: string;
  scheme: string;
  demand: string;
  candidateHelp: string;
  extraInfo: string;
  remarks: string;
  classification: VoterClassification;
  isImportant: boolean;
  isFavourite: boolean;
  isVisited: boolean;
  isVoted: boolean;
  isOutside: boolean;
  isDeceased: boolean;
  lastVisitDate: string | null;
  lastUpdated: string;
  assignedKaryakartaId: string;
  familyId: string;
  familyHead: boolean;
  familyMembersCount: number;
  email?: string | null;
  source?: "ECI_IMPORT" | "CANDIDATE_ADMIN" | "KARYAKARTA_CREATED" | "PUBLIC_ENQUIRY";
  status?: "Verified" | "Correction Req" | "Quarantined" | "Pending Approval";
  organizationId?: string;
  createdById?: string;
}

export interface FamilyMemberSummary {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: "M" | "F" | "Other";
  epicId: string;
  phone: string | null;
  isFamilyHead: boolean;
  classification: VoterClassification;
}

export interface SurveyRecord {
  id: string;
  voterId: string;
  karyakartaId: string;
  caste: string;
  occupation: string;
  schemeBenefits: string;
  hasVoted: boolean;
  isVisited: boolean;
  candidateHelp: string;
  demand: string;
  extraInfo: string;
  remarks: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
}

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketStatus = "NEW" | "ASSIGNED" | "IN_PROGRESS" | "FOLLOW_UP" | "RESOLVED" | "CLOSED";

export interface TicketFollowUp {
  id: string;
  author: string;
  note: string;
  timestamp: string;
}

export interface IssueTicket {
  id: string;
  ticketNumber: string;
  voterId: string | null;
  voterName: string;
  voterPhone: string;
  voterBooth: string;
  karyakartaId: string;
  karyakartaName: string;
  category: "Water Supply" | "Road Infrastructure" | "Sanitation" | "Pension / Scheme" | "Electricity" | "Other";
  title?: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  location?: string;
  assignedTo: string;
  organizationId?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  resolutionNotes: string | null;
  followUps: TicketFollowUp[];
}

export type DeliveryMethod = "PRINTED" | "DIGITAL_WHATSAPP";
export type SlipDeliveryStatus = "PRINT_SUCCESS" | "PRINT_FAILED" | "SENT" | "DELIVERED" | "FAILED";

export interface VoterSlipRecord {
  id: string;
  slipNumber: string;
  voterId: string;
  voterName: string;
  epicId: string;
  boothNumber: string;
  karyakartaId: string;
  deliveryMethod: DeliveryMethod;
  status: SlipDeliveryStatus;
  timestamp: string;
  location: string | null;
}

export interface PollingBooth {
  id: string;
  boothNumber: string;
  boothName: string;
  partNumber: string;
  pollingCentre: string;
  pollingAddress: string;
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  bloName: string;
  bloPhone: string;
  bloDesignation: string;
  assignedKaryakartas: string[];
}

export interface ActivityLogRecord {
  id: string;
  karyakartaId: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
}

export interface VoterUpdateRequest {
  id: string;
  voterId: string;
  karyakartaId: string;
  voterName: string;
  field: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt: string | null;
  reviewerRemarks: string | null;
}

export interface FilterState {
  searchQuery: string;
  gender: string;
  minAge: string;
  maxAge: string;
  boothNumber: string;
  prabhaag: string;
  ward: string;
  village: string;
  caste: string;
  occupation: string;
  scheme: string;
  classification: string;
  visitedStatus: "all" | "visited" | "not_visited";
  votedStatus: "all" | "voted" | "non_voted";
  mobileStatus: "all" | "available" | "unavailable";
  isImportant: boolean | null;
  isFavourite: boolean | null;
}

export interface KaryakartaKpiStats {
  totalAssignedVoters: number;
  visitedVoters: number;
  unvisitedVoters: number;
  surveysCompleted: number;
  importantVoters: number;
  favouriteVoters: number;
  mobileAvailable: number;
  mobileMissing: number;
  supportersCount: number;
  doubtfulCount: number;
  opponentsCount: number;
  neutralCount: number;
  openIssues: number;
  resolvedIssues: number;
  slipsGenerated: number;
  slipsPrinted: number;
  digitalSlipsSent: number;
  assignedBoothsCount: number;
  visitPercentage: number;
  surveyPercentage: number;
}

