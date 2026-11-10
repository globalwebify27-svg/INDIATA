import { DistributorStatus } from "@rajtantra/common-types";

export interface DistributorRecord {
  id: string;
  companyName: string;
  name?: string;
  distributorCode?: string;
  contactName: string;
  contactPerson?: string;
  email: string;
  phone: string;
  location: string;
  territory?: string;
  status: DistributorStatus;
  commissionRatePct: number;
  totalCandidates: number;
  activeCandidates: number;
  registrationDate: string;
  createdAt?: string;
  approvedDate?: string;
  suspendedReason?: string;
  rejectionReason?: string;
}

export const MOCK_DISTRIBUTORS: DistributorRecord[] = [
  {
    id: "DIS-101",
    distributorCode: "DIS-101",
    companyName: "MahaMedia Political Solutions Pvt Ltd",
    name: "Maharashtra Western Agency",
    contactName: "Rajesh S. Patil",
    contactPerson: "Rajesh S. Patil",
    email: "distributor@mahamedia.com",
    phone: "+91 98220 99881",
    location: "Pune & Western Maharashtra",
    territory: "Pune Metro",
    status: DistributorStatus.ACTIVE,
    commissionRatePct: 15.0,
    totalCandidates: 8,
    activeCandidates: 7,
    registrationDate: "15 Sep 2026",
    createdAt: "15 Sep 2026",
    approvedDate: "18 Sep 2026",
  },
  {
    id: "DIS-105",
    distributorCode: "DIS-105",
    companyName: "Marathwada Election Tech Partners",
    name: "Marathwada Regional Partner",
    contactName: "Kailash M. Deshmukh",
    contactPerson: "Kailash M. Deshmukh",
    email: "pending@marathwada.com",
    phone: "+91 98220 55441",
    location: "Chhatrapati Sambhajinagar & Jalna",
    territory: "Marathwada North",
    status: DistributorStatus.PENDING,
    commissionRatePct: 10.0,
    totalCandidates: 0,
    activeCandidates: 0,
    registrationDate: "05 Nov 2026",
    createdAt: "05 Nov 2026",
  },
  {
    id: "DIS-106",
    distributorCode: "DIS-106",
    companyName: "Khandesh Digital Campaign Network",
    name: "Khandesh Franchise Agency",
    contactName: "Anil B. Chaudhari",
    contactPerson: "Anil B. Chaudhari",
    email: "suspended@khandesh.com",
    phone: "+91 98220 77112",
    location: "Jalgaon & Dhule",
    territory: "Khandesh Valley",
    status: DistributorStatus.SUSPENDED,
    commissionRatePct: 10.0,
    totalCandidates: 3,
    activeCandidates: 0,
    registrationDate: "10 Aug 2026",
    createdAt: "10 Aug 2026",
    approvedDate: "14 Aug 2026",
    suspendedReason: "Pending territorial compliance verification and contract renewal audit.",
  },
  {
    id: "DIS-107",
    distributorCode: "DIS-107",
    companyName: "Vidarbha Citizen Connect Agency",
    name: "Vidarbha Partner Services",
    contactName: "Pravin K. Thakare",
    contactPerson: "Pravin K. Thakare",
    email: "rejected@vidarbhaconnect.com",
    phone: "+91 98220 33221",
    location: "Nagpur & Wardha",
    territory: "Vidarbha Central",
    status: DistributorStatus.REJECTED,
    commissionRatePct: 10.0,
    totalCandidates: 0,
    activeCandidates: 0,
    registrationDate: "01 Nov 2026",
    createdAt: "01 Nov 2026",
    rejectionReason: "Incomplete business tax documentation and overlapping territorial franchise rights.",
  },
];

export interface ScopedCandidate {
  id: string;
  name: string;
  nameEnglish: string;
  nameMarathi: string;
  marathiName: string;
  mobile: string;
  party: string;
  partyName: string;
  partyAcronym: string;
  electionType: string;
  constituency: string;
  district: string;
  state: string;
  accountType: "SALE" | "DEMO" | "Sale" | "Demo";
  status: "ACTIVE" | "PENDING_APPROVAL" | "EXPIRED" | "SUSPENDED";
  accountStatus: "Active" | "Inactive" | "Suspended";
  subscriptionPlan: "TRIAL_5D" | "OFFICE_6M" | "OFFICE_12M" | "ELECTION_MODULE";
  subscriptionTier: string;
  subscriptionStatus: "Active" | "Expiring" | "Expired" | "Pending";
  expiryDate: string;
  subscriptionExpiresAt: string;
  source: "DISTRIBUTOR";
  distributorId: string;
  totalUsers: number;
  hasAi: boolean;
  hasCampaigns: boolean;
  createdDate: string;
  features: {
    aiVoiceCall: boolean;
    whatsappBot: boolean;
    familyMapping: boolean;
    pdfExport: boolean;
  };
}

export const MOCK_SCOPED_CANDIDATES: ScopedCandidate[] = [
  {
    id: "CAND-201",
    name: "Vikramaditya Shinde",
    nameEnglish: "Vikramaditya Shinde",
    nameMarathi: "विक्रमादित्य शिंदे",
    marathiName: "विक्रमादित्य शिंदे",
    mobile: "+91 98220 11221",
    party: "Rashtriya Vikas Congress (RVC)",
    partyName: "Rashtriya Vikas Congress",
    partyAcronym: "RVC",
    electionType: "Vidhan Sabha",
    constituency: "214 - Kothrud Assembly",
    district: "Pune",
    state: "Maharashtra",
    accountType: "SALE",
    status: "ACTIVE",
    accountStatus: "Active",
    subscriptionPlan: "ELECTION_MODULE",
    subscriptionTier: "Platinum War Room (12M)",
    subscriptionStatus: "Active",
    expiryDate: "30 Nov 2026",
    subscriptionExpiresAt: "30 Nov 2026",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 142,
    hasAi: true,
    hasCampaigns: true,
    createdDate: "01 Oct 2026",
    features: {
      aiVoiceCall: true,
      whatsappBot: true,
      familyMapping: true,
      pdfExport: true,
    },
  },
  {
    id: "CAND-202",
    name: "Sunita Rahul More",
    nameEnglish: "Sunita Rahul More",
    nameMarathi: "सुनिता राहुल मोरे",
    marathiName: "सुनिता राहुल मोरे",
    mobile: "+91 98220 22332",
    party: "Maharashtra Jan Kalyan Aghadi (MJA)",
    partyName: "Maharashtra Jan Kalyan Aghadi",
    partyAcronym: "MJA",
    electionType: "Municipal Corporation",
    constituency: "Ward 14 - Prabhat Road",
    district: "Pune",
    state: "Maharashtra",
    accountType: "SALE",
    status: "ACTIVE",
    accountStatus: "Active",
    subscriptionPlan: "OFFICE_12M",
    subscriptionTier: "Gold Intelligence (6M)",
    subscriptionStatus: "Active",
    expiryDate: "15 Jan 2027",
    subscriptionExpiresAt: "15 Jan 2027",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 68,
    hasAi: false,
    hasCampaigns: true,
    createdDate: "10 Oct 2026",
    features: {
      aiVoiceCall: false,
      whatsappBot: true,
      familyMapping: true,
      pdfExport: true,
    },
  },
  {
    id: "CAND-203",
    name: "Balasaheb K. Jagtap",
    nameEnglish: "Balasaheb K. Jagtap",
    nameMarathi: "बाळासाहेब के. जगताप",
    marathiName: "बाळासाहेब के. जगताप",
    mobile: "+91 98220 33443",
    party: "Independent / अपक्ष",
    partyName: "Independent / अपक्ष",
    partyAcronym: "IND",
    electionType: "Zilla Parishad",
    constituency: "Haveli Rural ZP Circle",
    district: "Pune",
    state: "Maharashtra",
    accountType: "DEMO",
    status: "ACTIVE",
    accountStatus: "Active",
    subscriptionPlan: "TRIAL_5D",
    subscriptionTier: "Trial Demo (5 Days)",
    subscriptionStatus: "Expiring",
    expiryDate: "09 Nov 2026",
    subscriptionExpiresAt: "09 Nov 2026",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 12,
    hasAi: false,
    hasCampaigns: false,
    createdDate: "04 Nov 2026",
    features: {
      aiVoiceCall: false,
      whatsappBot: false,
      familyMapping: false,
      pdfExport: true,
    },
  },
  {
    id: "CAND-204",
    name: "Adv. Ganesh V. Narvekar",
    nameEnglish: "Adv. Ganesh V. Narvekar",
    nameMarathi: "ॲड. गणेश व्ही. नार्वेकर",
    marathiName: "ॲड. गणेश व्ही. नार्वेकर",
    mobile: "+91 98220 44554",
    party: "Swarajya Vikas Manch (SVM)",
    partyName: "Swarajya Vikas Manch",
    partyAcronym: "SVM",
    electionType: "Vidhan Sabha",
    constituency: "215 - Kasba Peth Assembly",
    district: "Pune",
    state: "Maharashtra",
    accountType: "SALE",
    status: "ACTIVE",
    accountStatus: "Active",
    subscriptionPlan: "ELECTION_MODULE",
    subscriptionTier: "Platinum War Room (12M)",
    subscriptionStatus: "Active",
    expiryDate: "28 Feb 2027",
    subscriptionExpiresAt: "28 Feb 2027",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 198,
    hasAi: true,
    hasCampaigns: true,
    createdDate: "20 Sep 2026",
    features: {
      aiVoiceCall: true,
      whatsappBot: true,
      familyMapping: true,
      pdfExport: true,
    },
  },
  {
    id: "CAND-205",
    name: "Pooja Santosh Gaikwad",
    nameEnglish: "Pooja Santosh Gaikwad",
    nameMarathi: "पूजा संतोष गायकवाड",
    marathiName: "पूजा संतोष गायकवाड",
    mobile: "+91 98220 55665",
    party: "Rashtriya Samaj Manch (RSM)",
    partyName: "Rashtriya Samaj Manch",
    partyAcronym: "RSM",
    electionType: "Municipal Corporation",
    constituency: "Ward 22 - Shivajinagar",
    district: "Pune",
    state: "Maharashtra",
    accountType: "SALE",
    status: "PENDING_APPROVAL",
    accountStatus: "Active",
    subscriptionPlan: "OFFICE_6M",
    subscriptionTier: "Gold Intelligence (6M)",
    subscriptionStatus: "Pending",
    expiryDate: "15 Dec 2026",
    subscriptionExpiresAt: "15 Dec 2026",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 0,
    hasAi: false,
    hasCampaigns: false,
    createdDate: "08 Nov 2026",
    features: {
      aiVoiceCall: false,
      whatsappBot: true,
      familyMapping: true,
      pdfExport: true,
    },
  },
];

export const mockScopedCandidates = MOCK_SCOPED_CANDIDATES;

export interface ScopedEnquiry {
  id: string;
  enquiryNumber: string;
  candidateId: string;
  candidateName: string;
  constituency: string;
  serviceType: "Software Subscription" | "Campaign Recharge" | "Historical Data" | "EVM Demo" | "Slip Printer" | "Voter Roll Data";
  requestedPackage: string;
  planName: string;
  requestDate: string;
  createdAt: string;
  amount: string | number;
  enquiryStatus: "Pending" | "Under Review" | "Approved" | "Completed" | "Rejected";
  paymentStatus: "Payment Pending" | "Payment Received" | "Payment Verified" | "Payment Failed";
  fulfilmentStatus: "Awaiting Payment" | "Awaiting Verification" | "Awaiting Fulfilment" | "In Progress" | "Fulfilled";
  notes?: string;
  distributorId: string;
}

export const MOCK_SCOPED_ENQUIRIES: ScopedEnquiry[] = [
  {
    id: "ENQ-7821",
    enquiryNumber: "ENQ-2026-7821",
    candidateId: "CAND-201",
    candidateName: "Vikramaditya Shinde",
    constituency: "214 - Kothrud Assembly",
    serviceType: "Campaign Recharge",
    requestedPackage: "AI Voice Caller 10,000 Minutes Pack",
    planName: "100,000 WhatsApp Dynamic Slips Pack",
    requestDate: "06 Nov 2026, 11:20 AM",
    createdAt: "2026-11-06",
    amount: "₹ 45,000",
    enquiryStatus: "Pending",
    paymentStatus: "Payment Pending",
    fulfilmentStatus: "Awaiting Payment",
    notes: "Constituency-wide booth slip broadcasting requested for Kothrud.",
    distributorId: "DIS-101",
  },
  {
    id: "ENQ-7815",
    enquiryNumber: "ENQ-2026-7815",
    candidateId: "CAND-202",
    candidateName: "Sunita Rahul More",
    constituency: "Ward 14 - Prabhat Road",
    serviceType: "Historical Data",
    requestedPackage: "Voter Family Tree AI Clustering Module",
    planName: "PMC Ward 2017 & 2022 Booth-wise Polling Result Dataset",
    requestDate: "04 Nov 2026, 04:15 PM",
    createdAt: "2026-11-04",
    amount: "₹ 35,000",
    enquiryStatus: "Approved",
    paymentStatus: "Payment Received",
    fulfilmentStatus: "Awaiting Verification",
    notes: "Payment slip submitted via NEFT. Super Admin verification pending.",
    distributorId: "DIS-101",
  },
  {
    id: "ENQ-7790",
    enquiryNumber: "ENQ-2026-7790",
    candidateId: "CAND-204",
    candidateName: "Adv. Ganesh V. Narvekar",
    constituency: "215 - Kasba Peth Assembly",
    serviceType: "Slip Printer",
    requestedPackage: "Official WhatsApp Verified Blue-Tick Bot",
    planName: "5x Bluetooth 58mm Thermal Printers + 100 Roll Box",
    requestDate: "28 Oct 2026, 02:40 PM",
    createdAt: "2026-10-28",
    amount: "₹ 25,000",
    enquiryStatus: "Completed",
    paymentStatus: "Payment Verified",
    fulfilmentStatus: "Fulfilled",
    notes: "Hardware delivered and dispatch tracking number verified.",
    distributorId: "DIS-101",
  },
];

export const mockScopedEnquiries = MOCK_SCOPED_ENQUIRIES;
