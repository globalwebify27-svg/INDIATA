"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Users,
  Building2,
  Calendar,
  Phone,
  
  MapPin,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Check,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Share2,
  
  Send,
  RefreshCw,
  Download,
  Copy,
  
  Eye,
  Layers,
  UserCheck,
  Heart,
  Home,
  Gift,
  AlertCircle,
  Printer,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  
  
  
  
  Vote,
  RotateCcw,
  Clock,
  User,
  History,
  Lock,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { apiFetch } from "@/lib/api-client";

// ============================================================================
// DATA MODELS & TAXONOMY
// ============================================================================

export interface CommunityAllocation {
  id: string;
  electorId: string;
  category: string;
  groupName: string;
  villageOrLocality: string;
  designation: string;
  allocationDate: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED";
  notes?: string;
  allocatedBy?: string;
}

export interface ElectorRecord {
  id: string;
  voterCode: string;
  epicNumber: string;
  partNo: number;
  serialNo: number;
  fullName: string;
  hindiName?: string;
  relativeName: string;
  relativeHindiName?: string;
  relationType: "Father" | "Husband" | "Mother" | "Other";
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  dob: string;
  mobile?: string;
  email?: string;
  address: string;
  newAddress?: string;
  houseNo: string;
  constituency: string;
  constituencyNo: string;
  assemblySegment?: string;
  prabhaag: string;
  ward: string;
  gan: string;
  boothNumber: number;
  pollingStation: string;
  caste?: string;
  occupation?: string;
  qualification?: string;
  bloodGroup?: string;
  schemeBeneficiary?: string[];
  politicalLeaning: "STRONG_SUPPORTER" | "LEANING_SUPPORTER" | "NEUTRAL" | "LEANING_OPPOSITION" | "STRONG_OPPOSITION";
  isInfluencer?: boolean;
  influencerScope?: string;
  voterSlipStatus: "DELIVERED" | "PRINTED" | "GENERATED" | "NOT_GENERATED";
  verified: boolean;
  hasVoted: boolean;
  votedAt?: string;
  votedByUserId?: string;
  votedByUserName?: string;
  votingAuditTrail?: {
    id: string;
    previousStatus: "NOT_VOTED" | "VOTED";
    newStatus: "NOT_VOTED" | "VOTED";
    updatedBy: string;
    userId: string;
    timestamp: string;
    reason?: string;
  }[];
  isVisited: boolean;
  isFavorite: boolean;
  isHelped: boolean;
  isDeceased: boolean;
  isOutside: boolean;
  karyakartaName?: string;
  colorCode?: string;
}

export interface CommunityGroupItem {
  id: string;
  label: string;
  shortLabel: string;
}

const COMMUNITY_GROUPS: CommunityGroupItem[] = [
  { id: "Agriculture", label: "Farmers / Farmers' Associations", shortLabel: "Farmers" },
  { id: "Sugar Industry", label: "Sugar Factory Workers / Sugar Cooperative Members", shortLabel: "Sugar Workers" },
  { id: "Childcare & Community Services", label: "Anganwadi / Balwadi Workers", shortLabel: "Anganwadi" },
  { id: "Village Community", label: "Village Community Members", shortLabel: "Village Community" },
  { id: "Local Organisations", label: "Local Stakeholders / Association Members", shortLabel: "Local Stakeholders" },
  { id: "Cooperatives", label: "Cooperative Society Members", shortLabel: "Cooperatives" },
  { id: "Self-Help Groups", label: "Self-Help Group Members", shortLabel: "SHG Members" },
  { id: "Other", label: "Other Community Groups", shortLabel: "Other Groups" },
  { id: "NOT_ASSOCIATED", label: "Not Associated", shortLabel: "Not Associated" },
  { id: "NOT_DISCLOSED", label: "Not Disclosed", shortLabel: "Not Disclosed" },
];

const COMMUNITY_META: Record<string, { dot: string; subtitle: string }> = {
  Agriculture: { dot: "bg-emerald-500", subtitle: "Farmers, Krishi Vikas Sangh, irrigation & farm worker associations" },
  "Sugar Industry": { dot: "bg-amber-500", subtitle: "Sugar mill staff, cane grower societies & seasonal factory personnel" },
  "Childcare & Community Services": { dot: "bg-pink-500", subtitle: "Anganwadi sevikas, helpers, Balwadi teachers & community health volunteers" },
  "Village Community": { dot: "bg-blue-500", subtitle: "Gram Sabha active community elders, youth mandals & village forums" },
  "Local Organisations": { dot: "bg-purple-500", subtitle: "Vyapar mandals, trader guilds, market associations & RWA committees" },
  Cooperatives: { dot: "bg-indigo-500", subtitle: "Patsanstha credit societies, milk dairies & housing cooperative members" },
  "Self-Help Groups": { dot: "bg-teal-500", subtitle: "Mahila Bachat Gat members, women micro-enterprise & cluster networks" },
  Other: { dot: "bg-slate-500", subtitle: "Special interest civic forums, transport unions & voluntary collectives" },
  NOT_ASSOCIATED: { dot: "bg-slate-400", subtitle: "Explicitly audited and confirmed not associated with any group" },
  NOT_DISCLOSED: { dot: "bg-slate-400", subtitle: "Information pending collection or voluntarily withheld" },
};

const SEED_COMMUNITY_ALLOCATIONS: CommunityAllocation[] = [
  {
    id: "cga-001",
    electorId: "46250582",
    category: "Local Organisations",
    groupName: "Local Stakeholders / Association Members",
    villageOrLocality: "Kasba Peth, Pune",
    designation: "Executive Committee Member, Vyapar Mandal",
    allocationDate: "2024-01-15",
    verificationStatus: "VERIFIED",
    notes: "Voluntarily declared during trader forum registration. Holds voting rights in city market guild.",
    allocatedBy: "Vikas M. Patil (Booth Incharge)",
  },
  {
    id: "cga-002",
    electorId: "46250582",
    category: "Cooperatives",
    groupName: "Cooperative Society Members",
    villageOrLocality: "Kasba Peth",
    designation: "Shareholder Member",
    allocationDate: "2024-02-10",
    verificationStatus: "VERIFIED",
    notes: "Member of Kasba Sahakari Patsanstha since 2012.",
    allocatedBy: "Vikas M. Patil",
  },
  {
    id: "cga-003",
    electorId: "46251581",
    category: "Self-Help Groups",
    groupName: "SHG Members",
    villageOrLocality: "Kasba Peth, Ward 12",
    designation: "Treasurer, Janaki Mahila Bachat Gat",
    allocationDate: "2024-02-05",
    verificationStatus: "VERIFIED",
    notes: "Active in monthly micro-savings and government scheme guidance.",
    allocatedBy: "Pooja S. Jadhav (Karyakarta)",
  },
  {
    id: "cga-004",
    electorId: "46251583",
    category: "Sugar Industry",
    groupName: "Sugar Factory Workers / Sugar Cooperative Members",
    villageOrLocality: "Gaothan, Kasba Peth",
    designation: "Maintenance Technician, Cooperative Sugar Mill",
    allocationDate: "2024-03-12",
    verificationStatus: "UNVERIFIED",
    notes: "Self-declared union membership awaiting verification from mill worker registry.",
    allocatedBy: "Self-Declared Field Survey",
  },
  {
    id: "cga-005",
    electorId: "46251584",
    category: "Childcare & Community Services",
    groupName: "Anganwadi Workers / Balwadi Staff",
    villageOrLocality: "Erandwane, Ward 14",
    designation: "Anganwadi Supervisor (ICDS Cluster 4)",
    allocationDate: "2023-11-20",
    verificationStatus: "VERIFIED",
    notes: "Coordinates 8 Balwadis in Erandwane and Deccan areas.",
    allocatedBy: "Central Verification Desk",
  },
  {
    id: "cga-006",
    electorId: "46251584",
    category: "Self-Help Groups",
    groupName: "SHG Members",
    villageOrLocality: "Erandwane",
    designation: "Cluster Mentor",
    allocationDate: "2024-01-08",
    verificationStatus: "VERIFIED",
    notes: "Mentors 3 local women self-help clusters under MAVIM.",
    allocatedBy: "Central Verification Desk",
  },
  {
    id: "cga-007",
    electorId: "46251585",
    category: "Local Organisations",
    groupName: "Local Stakeholders / Association Members",
    villageOrLocality: "Deccan Gymkhana, Ward 14",
    designation: "President, Deccan Resident Welfare Association",
    allocationDate: "2023-08-14",
    verificationStatus: "VERIFIED",
    notes: "Key community convener for civic issues, traffic, and municipal works.",
    allocatedBy: "Asha V. More (BLO Coordinator)",
  },
  {
    id: "cga-008",
    electorId: "v-001",
    category: "Village Community",
    groupName: "Village Community Members",
    villageOrLocality: "Kothrud West, Ward 12",
    designation: "Community Welfare Council Member",
    allocationDate: "2024-01-18",
    verificationStatus: "VERIFIED",
    notes: "Active in neighborhood sanitation and cultural festivals committee.",
    allocatedBy: "Vikas M. Patil",
  },
  {
    id: "cga-009",
    electorId: "v-001",
    category: "Self-Help Groups",
    groupName: "SHG Members",
    villageOrLocality: "Ideal Colony, Kothrud",
    designation: "President, Ideal Mahila Mandal & Bachat Gat",
    allocationDate: "2023-09-01",
    verificationStatus: "VERIFIED",
    notes: "Voluntarily leads 40 women members in micro-credit activities.",
    allocatedBy: "Vikas M. Patil",
  },
  {
    id: "cga-010",
    electorId: "v-006",
    category: "Agriculture",
    groupName: "Farmers / Farmers' Associations",
    villageOrLocality: "Paud Phata / Mulshi Border",
    designation: "Family Farmland Co-holder",
    allocationDate: "2024-02-18",
    verificationStatus: "UNVERIFIED",
    notes: "Self-reported ancestral agricultural plot association awaiting 7/12 sync.",
    allocatedBy: "Field Survey Desk",
  },
  {
    id: "cga-011",
    electorId: "v-006",
    category: "Other",
    groupName: "Other Community Groups",
    villageOrLocality: "Paud Road, Ward 12",
    designation: "Representative, Paud Phata Auto Workers Union",
    allocationDate: "2023-10-10",
    verificationStatus: "VERIFIED",
    notes: "Verified representative for informal transport workforce welfare.",
    allocatedBy: "Ramesh M. More",
  },
  {
    id: "cga-012",
    electorId: "v-008",
    category: "Cooperatives",
    groupName: "Cooperative Society Members",
    villageOrLocality: "Erandwane, Ward 13",
    designation: "Active Member, Hardware Traders Credit Cooperative",
    allocationDate: "2023-12-05",
    verificationStatus: "VERIFIED",
    notes: "Active member with verified passbook entry.",
    allocatedBy: "Pooja S. Jadhav",
  },
];

const SEED_ELECTOR_STATUSES: Record<string, string> = {
  "46251582": "NOT_DISCLOSED",
  "v-002": "NOT_ASSOCIATED",
};

// ============================================================================
// 11 SEED ELECTORS (Matching Reference Design Exactly)
// ============================================================================

export const SEED_ELECTORS: ElectorRecord[] = [
  {
    id: "46250582",
    voterCode: "46250582",
    epicNumber: "WXE4829102",
    partNo: 325,
    serialNo: 1,
    fullName: "Rajesh Kumar Verma",
    hindiName: "राजेश कुमार वर्मा",
    relativeName: "Ramesh Verma",
    relativeHindiName: "रमेश वर्मा",
    relationType: "Father",
    gender: "MALE",
    age: 42,
    dob: "1982-06-14",
    mobile: "+91 98221 44001",
    email: "rajesh.verma@example.com",
    address: "Plot 14, Lane 3, Kasba Peth, Pune 411011",
    houseNo: "Plot 14",
    constituency: "34 - Pune",
    constituencyNo: "215",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    ward: "Ward 12 (Kasba Peth)",
    gan: "Gan 8",
    boothNumber: 101,
    pollingStation: "PMC School No. 12, Kasba Peth",
    caste: "Maratha",
    occupation: "Business",
    qualification: "Graduate",
    bloodGroup: "O+",
    schemeBeneficiary: ["Ayushman Bharat", "PM Awas Yojana"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: true,
    influencerScope: "Vyapar Mandal Committee Member",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    votedAt: "10:24 AM, 20 Nov",
    votedByUserName: "Vikas M. Patil (Booth Agent #101)",
    votedByUserId: "CADRE-101-01",
    votingAuditTrail: [
      {
        id: "aud-init-01",
        previousStatus: "NOT_VOTED",
        newStatus: "VOTED",
        updatedBy: "Vikas M. Patil (Booth Agent #101)",
        userId: "CADRE-101-01",
        timestamp: "10:24 AM, 20 Nov",
        reason: "Polling Booth Queue Verification & Slip Handover",
      },
    ],
    isVisited: true,
    isFavorite: true,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Vikas M. Patil",
    colorCode: "Blue",
  },
  {
    id: "46251581",
    voterCode: "46251581",
    epicNumber: "WXE0821443",
    partNo: 325,
    serialNo: 2,
    fullName: "Sunita Rajesh Verma",
    hindiName: "सुनीता राजेश वर्मा",
    relativeName: "Rajesh Verma",
    relativeHindiName: "राजेश वर्मा",
    relationType: "Husband",
    gender: "FEMALE",
    age: 38,
    dob: "1986-09-22",
    mobile: "+91 98221 44002",
    email: "sunita.verma@example.com",
    address: "Plot 14, Lane 3, Kasba Peth, Pune 411011",
    houseNo: "Plot 14",
    constituency: "34 - Pune",
    constituencyNo: "215",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    ward: "Ward 12 (Kasba Peth)",
    gan: "Gan 8",
    boothNumber: 101,
    pollingStation: "PMC School No. 12, Kasba Peth",
    caste: "Maratha",
    occupation: "Homemaker",
    qualification: "Post Graduate",
    bloodGroup: "B+",
    schemeBeneficiary: ["Majhi Ladki Bahin Yojana"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: false,
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    votedAt: "10:24 AM, 20 Nov",
    votedByUserName: "Vikas M. Patil (Booth Agent #101)",
    votedByUserId: "CADRE-101-01",
    votingAuditTrail: [
      {
        id: "aud-init-01",
        previousStatus: "NOT_VOTED",
        newStatus: "VOTED",
        updatedBy: "Vikas M. Patil (Booth Agent #101)",
        userId: "CADRE-101-01",
        timestamp: "10:24 AM, 20 Nov",
        reason: "Polling Booth Queue Verification & Slip Handover",
      },
    ],
    isVisited: true,
    isFavorite: false,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Vikas M. Patil",
    colorCode: "Blue",
  },
  {
    id: "46251582",
    voterCode: "46251582",
    epicNumber: "WXE3109244",
    partNo: 325,
    serialNo: 3,
    fullName: "Pooja Santosh Deshmukh",
    hindiName: "पूजा संतोष देशमुख",
    relativeName: "Santosh Deshmukh",
    relativeHindiName: "संतोष देशमुख",
    relationType: "Father",
    gender: "FEMALE",
    age: 21,
    dob: "2003-03-11",
    mobile: "+91 97654 32110",
    address: "Flat 402, Shiv Plaza, Kasba Peth, Pune 411011",
    houseNo: "Flat 402",
    constituency: "34 - Pune",
    constituencyNo: "215",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    ward: "Ward 12 (Kasba Peth)",
    gan: "Gan 8",
    boothNumber: 107,
    pollingStation: "Navin Marathi Shala, Shanipar",
    caste: "Maratha",
    occupation: "Student",
    qualification: "Undergraduate",
    bloodGroup: "A+",
    schemeBeneficiary: ["Youth Apprenticeship Scheme"],
    politicalLeaning: "NEUTRAL",
    isInfluencer: false,
    voterSlipStatus: "PRINTED",
    verified: true,
    hasVoted: false,
    isVisited: true,
    isFavorite: false,
    isHelped: false,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Ramesh M. More",
    colorCode: "Orange",
  },
  {
    id: "46251583",
    voterCode: "46251583",
    epicNumber: "WXE1290384",
    partNo: 325,
    serialNo: 4,
    fullName: "Amit Baban Shinde",
    hindiName: "अमित बबन शिंदे",
    relativeName: "Baban Shinde",
    relativeHindiName: "बबन शिंदे",
    relationType: "Father",
    gender: "MALE",
    age: 29,
    dob: "1995-11-05",
    mobile: "+91 99900 12345",
    email: "amit.shinde95@gmail.com",
    address: "House 88, Gaothan, Kasba Peth, Pune 411011",
    newAddress: "Apt 902, Mont Vert, Baner, Pune 411045",
    houseNo: "House 88",
    constituency: "34 - Pune",
    constituencyNo: "215",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    ward: "Ward 14 (Sadashiv Peth)",
    gan: "Gan 8",
    boothNumber: 106,
    pollingStation: "Shri Shivaji Maratha High School",
    caste: "OBC",
    occupation: "Private Service",
    qualification: "Graduate",
    bloodGroup: "O-",
    schemeBeneficiary: ["PM Mudra Loan"],
    politicalLeaning: "LEANING_SUPPORTER",
    isInfluencer: false,
    voterSlipStatus: "GENERATED",
    verified: true,
    hasVoted: false,
    isVisited: false,
    isFavorite: true,
    isHelped: false,
    isDeceased: false,
    isOutside: true,
    karyakartaName: "Ganesh K. Kulkarni",
    colorCode: "Yellow",
  },
  {
    id: "46251584",
    voterCode: "46251584",
    epicNumber: "WXE7765109",
    partNo: 325,
    serialNo: 5,
    fullName: "Kavita Ashok Patil",
    hindiName: "कविता अशोक पाटील",
    relativeName: "Ashok Patil",
    relativeHindiName: "अशोक पाटील",
    relationType: "Father",
    gender: "FEMALE",
    age: 54,
    dob: "1970-08-19",
    mobile: "+91 98230 99887",
    email: "kavita.patil@edu-pune.gov.in",
    address: "Bldg 3, Erandwane, Pune 411004",
    houseNo: "Bldg 3",
    constituency: "34 - Pune",
    constituencyNo: "215",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 14",
    ward: "Ward 14 (Erandwane)",
    gan: "Gan 4",
    boothNumber: 108,
    pollingStation: "Garware Commerce College",
    caste: "Maratha",
    occupation: "Teacher",
    qualification: "Post Graduate",
    bloodGroup: "AB+",
    schemeBeneficiary: ["Jan Arogya Yojana", "Majhi Ladki Bahin Yojana"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: true,
    influencerScope: "Anganwadi Supervisor",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    votedAt: "10:24 AM, 20 Nov",
    votedByUserName: "Vikas M. Patil (Booth Agent #101)",
    votedByUserId: "CADRE-101-01",
    votingAuditTrail: [
      {
        id: "aud-init-01",
        previousStatus: "NOT_VOTED",
        newStatus: "VOTED",
        updatedBy: "Vikas M. Patil (Booth Agent #101)",
        userId: "CADRE-101-01",
        timestamp: "10:24 AM, 20 Nov",
        reason: "Polling Booth Queue Verification & Slip Handover",
      },
    ],
    isVisited: true,
    isFavorite: true,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Pooja S. Jadhav",
    colorCode: "Green",
  },
  {
    id: "46251585",
    voterCode: "46251585",
    epicNumber: "WXE5544321",
    partNo: 325,
    serialNo: 6,
    fullName: "Surendra Mohan Joshi",
    hindiName: "सुरेंद्र मोहन जोशी",
    relativeName: "Mohan Joshi",
    relativeHindiName: "मोहन जोशी",
    relationType: "Father",
    gender: "MALE",
    age: 67,
    dob: "1957-01-30",
    mobile: "+91 99221 00398",
    email: "sm.joshi.ret@gmail.com",
    address: "Bungalow 7, Deccan, Pune 411004",
    houseNo: "Bungalow 7",
    constituency: "34 - Pune",
    constituencyNo: "215",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 14",
    ward: "Ward 14 (Deccan)",
    gan: "Gan 4",
    boothNumber: 108,
    pollingStation: "Garware Commerce College",
    caste: "Brahmin",
    occupation: "Retired",
    qualification: "Doctorate",
    bloodGroup: "O+",
    schemeBeneficiary: ["Senior Citizen Concession"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: true,
    influencerScope: "Resident Welfare President",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    votedAt: "10:24 AM, 20 Nov",
    votedByUserName: "Vikas M. Patil (Booth Agent #101)",
    votedByUserId: "CADRE-101-01",
    votingAuditTrail: [
      {
        id: "aud-init-01",
        previousStatus: "NOT_VOTED",
        newStatus: "VOTED",
        updatedBy: "Vikas M. Patil (Booth Agent #101)",
        userId: "CADRE-101-01",
        timestamp: "10:24 AM, 20 Nov",
        reason: "Polling Booth Queue Verification & Slip Handover",
      },
    ],
    isVisited: true,
    isFavorite: false,
    isHelped: false,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Asha V. More",
    colorCode: "Purple",
  },
  {
    id: "v-001",
    voterCode: "46251586",
    epicNumber: "MH34089211",
    partNo: 101,
    serialNo: 42,
    fullName: "Sunita Ramesh Deshmukh",
    hindiName: "सुनीता रमेश देशमुख",
    relativeName: "Ramesh Deshmukh",
    relativeHindiName: "रमेश देशमुख",
    relationType: "Husband",
    gender: "FEMALE",
    age: 46,
    dob: "1978-04-12",
    mobile: "+91 98224 55102",
    address: "Flat 402, Shivshankar Heights, Near Ideal Colony, Kothrud, Pune 411038",
    houseNo: "Flat 402",
    constituency: "34 - Pune",
    constituencyNo: "214",
    assemblySegment: "214 - Kothrud",
    prabhaag: "Prabhaag 12 - Kothrud West",
    ward: "Ward 12 (Kothrud West)",
    gan: "Gan 8",
    boothNumber: 101,
    pollingStation: "Navbharat High School, Room 1",
    caste: "Maratha",
    occupation: "School Teacher",
    qualification: "Post Graduate",
    bloodGroup: "B+",
    schemeBeneficiary: ["Majhi Ladki Bahin Yojana", "Mahatma Phule Jan Arogya"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: true,
    influencerScope: "President, Ideal Colony Mahila Mandal",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    votedAt: "10:24 AM, 20 Nov",
    votedByUserName: "Vikas M. Patil (Booth Agent #101)",
    votedByUserId: "CADRE-101-01",
    votingAuditTrail: [
      {
        id: "aud-init-01",
        previousStatus: "NOT_VOTED",
        newStatus: "VOTED",
        updatedBy: "Vikas M. Patil (Booth Agent #101)",
        userId: "CADRE-101-01",
        timestamp: "10:24 AM, 20 Nov",
        reason: "Polling Booth Queue Verification & Slip Handover",
      },
    ],
    isVisited: true,
    isFavorite: true,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Vikas M. Patil",
    colorCode: "Blue",
  },
  {
    id: "v-002",
    voterCode: "46251587",
    epicNumber: "MH34089212",
    partNo: 101,
    serialNo: 43,
    fullName: "Ramesh Vasantrao Deshmukh",
    hindiName: "रमेश वसंतराव देशमुख",
    relativeName: "Vasantrao Deshmukh",
    relativeHindiName: "वसंतराव देशमुख",
    relationType: "Father",
    gender: "MALE",
    age: 52,
    dob: "1972-09-25",
    mobile: "+91 98224 55101",
    address: "Flat 402, Shivshankar Heights, Near Ideal Colony, Kothrud, Pune 411038",
    houseNo: "Flat 402",
    constituency: "34 - Pune",
    constituencyNo: "214",
    assemblySegment: "214 - Kothrud",
    prabhaag: "Prabhaag 12 - Kothrud West",
    ward: "Ward 12 (Kothrud West)",
    gan: "Gan 8",
    boothNumber: 101,
    pollingStation: "Navbharat High School, Room 1",
    caste: "Maratha",
    occupation: "Senior Electrical Engineer, MSEDCL",
    qualification: "Engineering Graduate",
    bloodGroup: "O+",
    schemeBeneficiary: [],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: false,
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    votedAt: "10:24 AM, 20 Nov",
    votedByUserName: "Vikas M. Patil (Booth Agent #101)",
    votedByUserId: "CADRE-101-01",
    votingAuditTrail: [
      {
        id: "aud-init-01",
        previousStatus: "NOT_VOTED",
        newStatus: "VOTED",
        updatedBy: "Vikas M. Patil (Booth Agent #101)",
        userId: "CADRE-101-01",
        timestamp: "10:24 AM, 20 Nov",
        reason: "Polling Booth Queue Verification & Slip Handover",
      },
    ],
    isVisited: true,
    isFavorite: true,
    isHelped: false,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Vikas M. Patil",
    colorCode: "Blue",
  },
  {
    id: "v-006",
    voterCode: "46251588",
    epicNumber: "MH34015670",
    partNo: 103,
    serialNo: 112,
    fullName: "Prashant Bhimrao Kamble",
    hindiName: "प्रशांत भीमराव कांबळे",
    relativeName: "Bhimrao Kamble",
    relativeHindiName: "भीमराव कांबळे",
    relationType: "Father",
    gender: "MALE",
    age: 38,
    dob: "1986-03-10",
    mobile: "+91 97645 22019",
    address: "House 45, Paud Road Basti, Pune 411038",
    houseNo: "House 45",
    constituency: "34 - Pune",
    constituencyNo: "214",
    assemblySegment: "214 - Kothrud",
    prabhaag: "Prabhaag 12 - Kothrud West",
    ward: "Ward 12 (Paud Road)",
    gan: "Gan 8",
    boothNumber: 103,
    pollingStation: "Dr. Babasaheb Ambedkar Samaj Mandir",
    caste: "SC (Neo-Buddhist)",
    occupation: "Auto Rickshaw Driver",
    qualification: "Secondary (10th)",
    bloodGroup: "AB+",
    schemeBeneficiary: ["PM Awas Yojana", "Ayushman Bharat"],
    politicalLeaning: "NEUTRAL",
    isInfluencer: true,
    influencerScope: "Paud Phata Rickshaw Union Rep",
    voterSlipStatus: "GENERATED",
    verified: true,
    hasVoted: false,
    isVisited: true,
    isFavorite: false,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Ramesh M. More",
    colorCode: "Yellow",
  },
  {
    id: "v-008",
    voterCode: "46251589",
    epicNumber: "MH34029810",
    partNo: 104,
    serialNo: 205,
    fullName: "Mohammad Irfan Shaikh",
    hindiName: "मोहम्मद इरफान शेख",
    relativeName: "Abdul Ghaffar Shaikh",
    relativeHindiName: "अब्दुल गफ्फार शेख",
    relationType: "Father",
    gender: "MALE",
    age: 44,
    dob: "1980-05-19",
    mobile: "+91 99220 33451",
    address: "Plot 12, Gulmohar Lane, Erandwane, Pune 411004",
    newAddress: "Shop 4, Market Yard, Gultekdi, Pune 411037",
    houseNo: "Plot 12",
    constituency: "34 - Pune",
    constituencyNo: "214",
    assemblySegment: "214 - Kothrud",
    prabhaag: "Prabhaag 13 - Erandwane",
    ward: "Ward 13 (Erandwane)",
    gan: "Gan 2",
    boothNumber: 104,
    pollingStation: "Pune Municipal Primary School No. 18",
    caste: "Muslim (OBC)",
    occupation: "Hardware Store Owner",
    qualification: "Higher Secondary (12th)",
    bloodGroup: "B-",
    schemeBeneficiary: ["PM Mudra Loan"],
    politicalLeaning: "LEANING_OPPOSITION",
    isInfluencer: false,
    voterSlipStatus: "NOT_GENERATED",
    verified: true,
    hasVoted: false,
    isVisited: false,
    isFavorite: false,
    isHelped: false,
    isDeceased: false,
    isOutside: true,
    karyakartaName: "Pooja S. Jadhav",
    colorCode: "Red",
  },
  {
    id: "46251590",
    voterCode: "46251590",
    epicNumber: "MH34098124",
    partNo: 325,
    serialNo: 15,
    fullName: "Late Shantaram Govind Kulkarni",
    hindiName: "कै. शांताराम गोविंद कुलकर्णी",
    relativeName: "Govind Kulkarni",
    relativeHindiName: "गोविंद कुलकर्णी",
    relationType: "Father",
    gender: "MALE",
    age: 82,
    dob: "1942-02-18",
    mobile: "",
    address: "Old Wada 4, Shanipar, Kasba Peth, Pune 411011",
    houseNo: "Old Wada 4",
    constituency: "34 - Pune",
    constituencyNo: "215",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    ward: "Ward 12 (Kasba Peth)",
    gan: "Gan 8",
    boothNumber: 107,
    pollingStation: "Navin Marathi Shala, Shanipar",
    caste: "Brahmin",
    occupation: "Retired",
    qualification: "Undergraduate",
    bloodGroup: "O+",
    schemeBeneficiary: [],
    politicalLeaning: "NEUTRAL",
    isInfluencer: false,
    voterSlipStatus: "NOT_GENERATED",
    verified: false,
    hasVoted: false,
    isVisited: false,
    isFavorite: false,
    isHelped: false,
    isDeceased: true,
    isOutside: false,
    karyakartaName: "Ramesh M. More",
    colorCode: "Slate",
  },
];

// ============================================================================
// COMMUNITY MULTI-SELECT DROPDOWN COMPONENT
// ============================================================================

interface CommunitySelectProps {
  selectedGroups: string[];
  onToggleGroup: (groupId: string) => void;
  onClearAll: () => void;
  onSelectAll: () => void;
  align?: "left" | "right" | "full";
}

function CommunityGroupDropdown({
  selectedGroups,
  onToggleGroup,
  onClearAll,
  onSelectAll,
  align = "left",
}: CommunitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return COMMUNITY_GROUPS;
    const q = searchQuery.toLowerCase().trim();
    return COMMUNITY_GROUPS.filter(
      (g) => g.label.toLowerCase().includes(q) || g.shortLabel.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className={`relative ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 font-medium truncate text-xs">
            {selectedGroups.length === 0
              ? "Select community / stakeholder groups..."
              : selectedGroups
                  .map((id) => COMMUNITY_GROUPS.find((g) => g.id === id)?.shortLabel || id)
                  .join(", ")}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {selectedGroups.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClearAll();
              }}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-400 hover:text-red-500 cursor-pointer"
              title="Clear all selected groups"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3.5 space-y-3 animate-fade-in ${
            align === "right"
              ? "right-0 w-[340px] sm:w-[460px] max-w-[calc(100vw-2rem)]"
              : align === "full"
              ? "left-0 right-0 w-full"
              : "left-0 w-full sm:w-[480px] max-w-[calc(100vw-2rem)]"
          }`}
        >
          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search community groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onSelectAll}
              className="px-2.5 py-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Group Items List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredGroups.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">No matching community groups found.</div>
            ) : (
              filteredGroups.map((group) => {
                const isSelected = selectedGroups.includes(group.id);
                const meta = COMMUNITY_META[group.id];
                return (
                  <div
                    key={group.id}
                    onClick={() => onToggleGroup(group.id)}
                    className={`pt-1.5 first:pt-0 flex items-start justify-between gap-3 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-teal-50/80 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 font-medium"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-teal-600 border-teal-600 text-white"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${meta?.dot || "bg-slate-400"}`} />
                          <span className="font-semibold text-xs truncate">{group.label}</span>
                        </div>
                        {meta?.subtitle && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-1">
                            {meta.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedGroups.length}</span> of{" "}
              {COMMUNITY_GROUPS.length} groups selected
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

          {/* Selected Tags */}
          {selectedGroups.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap max-h-16 overflow-y-auto pt-1">
              {selectedGroups.map((id) => {
                const grp = COMMUNITY_GROUPS.find((g) => g.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold"
                  >
                    <span>{grp?.shortLabel || id}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleGroup(id);
                      }}
                      className="hover:text-red-500 ml-0.5 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CONTINUOUS SINGLE-PAGE VOTER PROFILE COMPONENT
// ============================================================================

interface VoterProfileViewProps {
  voter: ElectorRecord;
  onBack: () => void;
  communityAllocations: CommunityAllocation[];
  electorStatus?: string;
  isElectionActive?: boolean;
  onToggleTurnout?: (voterId: string, customTimestamp?: string, reason?: string) => void;
  onToggleElectionActive?: () => void;
}

function ContinuousVoterProfileView({
  voter,
  onBack,
  communityAllocations,
  electorStatus,
  isElectionActive = true,
  onToggleTurnout,
  onToggleElectionActive,
}: VoterProfileViewProps) {
  const { showToast } = useToast();

  // Confirmation & Correction Modal States (LPIANE)
  const [isConfirmVoteOpen, setIsConfirmVoteOpen] = useState(false);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [correctionReason, setCorrectionReason] = useState("Wrong EPIC identity verified at booth");
  const [correctionCustomNote, setCorrectionCustomNote] = useState("");

  const handleCopyEpic = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(voter.epicNumber);
      showToast("info", "EPIC Copied", `EPIC ID ${voter.epicNumber} copied to clipboard!`);
    }
  };

  const handleConfirmVote = () => {
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + ", " + new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    if (onToggleTurnout) {
      onToggleTurnout(voter.id, timeStr);
    }
    setIsConfirmVoteOpen(false);
  };

  const handleExecuteCorrection = () => {
    const finalReason = correctionCustomNote.trim() ? `${correctionReason} — ${correctionCustomNote.trim()}` : correctionReason;
    if (onToggleTurnout) {
      onToggleTurnout(voter.id, undefined, finalReason);
    }
    setIsCorrectionOpen(false);
    setCorrectionCustomNote("");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Sticky Navigation & Top Action Bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 flex items-center justify-between gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Elector Roll</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Turnout Action Controls (LPIANE Specification) */}
          {!isElectionActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 cursor-not-allowed">
              <Clock className="w-3.5 h-3.5" />
              <span>Turnout Locked (Pre-Poll/Closed)</span>
            </span>
          ) : !voter.hasVoted ? (
            <button
              type="button"
              onClick={() => setIsConfirmVoteOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Mark as Voted</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs"
                title={`Vote recorded at ${voter.votedAt || "10:45 AM"} by ${voter.votedByUserName || "Candidate Admin"}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Turnout: Voted ({voter.votedAt || "Confirmed"})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCorrectionOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
                title="Authorized Status Correction"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Correct Status</span>
              </button>
            </div>
          )}

          <button
            onClick={() => showToast("info", "Voter Slip", `Generating printable voter slip for ${voter.fullName}...`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Voter Slip</span>
          </button>
          <button
            onClick={() => showToast("info", "SMS Composer", `Opening SMS composer for ${voter.fullName}...`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Direct SMS</span>
          </button>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {voter.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{voter.fullName}</h2>
                {voter.hindiName && (
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {voter.hindiName}
                  </span>
                )}
                {voter.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    Verified ECI Record
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                <span>{voter.relationType}: {voter.relativeName} {voter.relativeHindiName ? `(${voter.relativeHindiName})` : ""}</span>
                <span>•</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{voter.epicNumber}</span>
                <button onClick={handleCopyEpic} className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <Copy className="w-3 h-3" />
                </button>
                <span>•</span>
                <span>Booth #{voter.boothNumber}</span>
                <span>•</span>
                <span>AC-{voter.constituencyNo}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              voter.politicalLeaning === "STRONG_SUPPORTER"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
                : voter.politicalLeaning === "LEANING_SUPPORTER"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}>
              {voter.politicalLeaning.replace("_", " ")}
            </span>
            {voter.isInfluencer && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                Key Community Influencer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ELECTION DAY VOTER TURNOUT INTERACTIVE CARD */}
      <div className={`rounded-2xl border p-5 shadow-xs transition-all ${
        voter.hasVoted 
          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80" 
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              voter.hasVoted 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
            }`}>
              {voter.hasVoted ? <CheckCircle2 className="w-6 h-6" /> : <Vote className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Polling Day Turnout Verification
                </span>
                {isElectionActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Election Active: Polls Open (07:00 AM - 06:00 PM)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    <Lock className="w-3 h-3 text-slate-500" />
                    Election Concluded (Read-Only)
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {voter.hasVoted 
                  ? "Turnout Recorded: Elector has cast ballot at EVM" 
                  : "Turnout Pending: Elector has not yet voted"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {voter.hasVoted
                  ? `Verified voter turnout recorded for Booth #${voter.boothNumber} (${voter.pollingStation}).`
                  : `Mark elector when they arrive and cast their ballot at the designated polling station.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isElectionActive ? (
              <button
                type="button"
                onClick={() => onToggleTurnout && onToggleTurnout(voter.id)}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                  voter.hasVoted
                    ? "bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:text-slate-200 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20"
                }`}
              >
                {voter.hasVoted ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Undo / Mark Not Voted</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Elector Has Voted</span>
                  </>
                )}
              </button>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Turnout Closed</span>
              </div>
            )}

            {onToggleElectionActive && (
              <button
                type="button"
                onClick={onToggleElectionActive}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer"
                title="Toggle simulation between Active Election Day and Concluded Election"
              >
                {isElectionActive ? "Simulate: Conclude Polls" : "Simulate: Open Polls"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTINUOUS SUBSECTIONS: All displayed at once */}
      <div className="space-y-6">
        {/* Subsection 1: Personal Demographics & Family */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Personal Demographics &amp; Contact</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Age &amp; Gender</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.age} yrs / {voter.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Date of Birth</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.dob}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Blood Group</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.bloodGroup || "Not Disclosed"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Social Classification / Caste</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.caste || "General / Open"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Occupation</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.occupation || "Self-Employed"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Education / Qualification</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.qualification || "Graduate"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Primary Phone</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{voter.mobile || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Email</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.email || "—"}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 text-xs block mb-0.5">Residential Address on Electoral Roll</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{voter.address} (House: {voter.houseNo})</span>
            {voter.newAddress && (
              <div className="mt-1 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-300 text-xs">
                <strong>Address Shift Reported:</strong> {voter.newAddress}
              </div>
            )}
          </div>
        </div>

        {/* Subsection 2: Electoral Station & Polling Booth Information */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Electoral Location &amp; Polling Station</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Assembly Constituency</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">AC-{voter.constituencyNo} ({voter.assemblySegment || voter.constituency})</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Booth Number</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Booth #{voter.boothNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Serial Number in Roll</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">Sr. #{voter.serialNo} (Part #{voter.partNo})</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Ward &amp; Prabhaag</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.ward} • {voter.prabhaag}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 block mb-0.5">Assigned Polling Station Building</span>
              <span className="font-bold text-slate-900 dark:text-white">{voter.pollingStation}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block mb-0.5">Assigned Karyakarta / BLO</span>
              <span className="font-bold text-slate-900 dark:text-white">{voter.karyakartaName || "Vikas M. Patil"}</span>
            </div>
          </div>
        </div>

        {/* Subsection 3: Political Leaning & Influencer Analysis */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Vote className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Political Leaning &amp; Community Influence</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Voter Sentiment Rating</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{voter.politicalLeaning.replace("_", " ")}</span>
              <p className="text-[10px] text-slate-500 mt-1">Classified via ground door-to-door survey and community feedback.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Influencer Status</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {voter.isInfluencer ? "Community Influencer (Active)" : "Standard Elector"}
              </span>
              {voter.influencerScope && (
                <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 font-semibold">{voter.influencerScope}</p>
              )}
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Voter Information Slip (VIS)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{voter.voterSlipStatus}</span>
              <p className="text-[10px] text-slate-500 mt-1">Printed QR slip distributed by booth field volunteer.</p>
            </div>
          </div>
        </div>

        {/* Subsection 4: Community & Stakeholder Affiliations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">4. Community &amp; Stakeholder Affiliations</h3>
          </div>
          {communityAllocations.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400">
              {electorStatus === "NOT_DISCLOSED"
                ? "Information voluntarily withheld by elector or pending audit."
                : electorStatus === "NOT_ASSOCIATED"
                ? "Audited and confirmed not affiliated with specific community associations."
                : "No specific stakeholder group associations recorded."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {communityAllocations.map((alloc) => (
                <div key={alloc.id} className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 dark:text-teal-200 text-xs">{alloc.groupName}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-200 text-teal-900 uppercase">
                      {alloc.verificationStatus}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">{alloc.designation} • {alloc.villageOrLocality}</p>
                  {alloc.notes && <p className="text-[10px] text-slate-400 italic mt-1">"{alloc.notes}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subsection 5: Government Welfare Scheme Beneficiary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Gift className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">5. Government Welfare Scheme Beneficiary Status</h3>
          </div>
          {!voter.schemeBeneficiary || voter.schemeBeneficiary.length === 0 ? (
            <p className="text-xs text-slate-400">No active government welfare schemes currently recorded for this elector.</p>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {voter.schemeBeneficiary.map((scheme, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{scheme}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subsection 6: Field Operations & Ground Touchpoints */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">6. Campaign Ground Touchpoints &amp; Field Audit</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] mb-0.5">Survey Visited</span>
              <span className={`font-bold ${voter.isVisited ? "text-emerald-600" : "text-slate-400"}`}>
                {voter.isVisited ? "Yes, Door-to-Door" : "Pending Visit"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] mb-0.5">Voter Slip Handed</span>
              <span className="font-bold text-blue-600">{voter.voterSlipStatus}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] mb-0.5">Office Grievance</span>
              <span className={`font-bold ${voter.isHelped ? "text-emerald-600" : "text-slate-400"}`}>
                {voter.isHelped ? "Helped / Resolved" : "No Open Issues"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-center flex flex-col justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] mb-0.5">Polling Day Turnout</span>
                <span className={`font-bold block ${voter.hasVoted ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500 dark:text-amber-400"}`}>
                  {voter.hasVoted ? `Voted (${voter.votedAt || "Confirmed"})` : "Turnout Pending"}
                </span>
              </div>
              {isElectionActive && (
                <button
                  type="button"
                  onClick={() => (!voter.hasVoted ? setIsConfirmVoteOpen(true) : setIsCorrectionOpen(true))}
                  className="mt-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {voter.hasVoted ? "Correct Status" : "Mark as Voted"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Subsection 7: Live Polling Turnout Telemetry & ECI Audit Ledger (LPIANE) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">7. Live Polling Turnout Telemetry &amp; ECI Audit Ledger</h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  voter.hasVoted
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                }`}
              >
                {voter.hasVoted ? "● Voted (Vote Recorded)" : "○ Not Voted (Pending Turnout)"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">Voting Timestamp</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {voter.votedAt || "Pending Polling Station Visit"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">Recorded By Cadre / Admin</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {voter.votedByUserName || "Not yet recorded"}
              </span>
              {voter.votedByUserId && (
                <span className="text-[10px] text-slate-400 block font-mono">ID: {voter.votedByUserId}</span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">Polling Station &amp; Room</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Booth #{voter.boothNumber}</span>
              <span className="text-[10px] text-slate-400 block truncate">{voter.pollingStation}</span>
            </div>
          </div>

          {/* Audit History Table */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-500" />
              <span>Turnout Status Audit History</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2 px-3">Date &amp; Time</th>
                    <th className="py-2 px-3">Transition</th>
                    <th className="py-2 px-3">Updated By</th>
                    <th className="py-2 px-3">Reason / Audit Remark</th>
                    <th className="py-2 px-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {voter.votingAuditTrail && voter.votingAuditTrail.length > 0 ? (
                    voter.votingAuditTrail.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-medium text-slate-600 dark:text-slate-300">{log.timestamp}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.newStatus === "VOTED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {log.previousStatus} &rarr; {log.newStatus}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{log.updatedBy}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{log.userId}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{log.reason || "Standard Check-in"}</td>
                        <td className="py-2 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            <span>ECI Synced</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-3 px-3 text-center text-slate-400 italic">
                        No previous status changes. Awaiting polling station activity.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL BEFORE MARKING AS VOTED (LPIANE Requirement) */}
      {isConfirmVoteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
                <Vote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Confirm Voter Turnout Entry
                </h3>
                <p className="text-[11px] text-slate-500">Record immutable polling day voting status</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              Are you sure you want to mark <strong>{voter.fullName}</strong> (EPIC:{" "}
              <span className="font-mono font-bold text-blue-600">{voter.epicNumber}</span>) as{" "}
              <strong className="text-emerald-600">VOTED</strong> at Booth #{voter.boothNumber}?
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 space-y-1">
              <div>• Exact voting timestamp will be recorded.</div>
              <div>• Your user identity will be appended to the ECI audit log.</div>
              <div>• Live turnout calculations across the constituency will update immediately.</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmVoteOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVote}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Yes, Confirm Voted</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTHORIZED STATUS CORRECTION MODAL (LPIANE Requirement) */}
      {isCorrectionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Authorized Turnout Status Correction
                </h3>
                <p className="text-[11px] text-slate-500">Revert or correct voting record with audit reasoning</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Justification for Status Correction *
                </label>
                <select
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Wrong EPIC identity verified at booth">Wrong EPIC identity verified at booth</option>
                  <option value="Clerical / accidental double-tap entry">Clerical / accidental double-tap entry</option>
                  <option value="Elector left booth before casting ballot">Elector left booth before casting ballot</option>
                  <option value="Presiding officer audit correction">Presiding officer audit correction</option>
                  <option value="Other administrative adjustment">Other administrative adjustment</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Additional Audit Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={correctionCustomNote}
                  onChange={(e) => setCorrectionCustomNote(e.target.value)}
                  placeholder="Provide any specific verification reference or presiding officer note..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCorrectionOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteCorrection}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to Not Voted</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN VOTER MANAGEMENT VIEW COMPONENT
// ============================================================================

function mapDbVoterToElector(db: any): ElectorRecord {
  const leaningMap: Record<string, ElectorRecord["politicalLeaning"]> = {
    SUPPORTER: "STRONG_SUPPORTER",
    OPPONENT: "STRONG_OPPOSITION",
    DOUBTFUL: "NEUTRAL",
    NEUTRAL: "NEUTRAL",
  };

  const id = String(db.id || Math.random());
  const serialNo = Number(db.serialNumber) || 1;
  const boothNum = parseInt(String(db.boothNumber || "101").replace(/\D/g, "") || "101", 10);
  const partNo = parseInt(String(db.electoralPart || "101").replace(/\D/g, "") || "101", 10);

  return {
    id,
    voterCode: id,
    epicNumber: db.epicId || `MH/12/215/${String(serialNo).padStart(6, "0")}`,
    partNo,
    serialNo,
    fullName: db.name || "Elector",
    hindiName: db.marathiName || db.name || "",
    relativeName: db.relativeName || "N/A",
    relativeHindiName: db.relativeName || "N/A",
    relationType: (db.relation || "Father") as any,
    gender: (String(db.gender || "M").toUpperCase().startsWith("F") ? "FEMALE" : String(db.gender || "M").toUpperCase().startsWith("O") ? "OTHER" : "MALE"),
    age: Number(db.age) || 35,
    dob: db.dob || "1985-01-01",
    mobile: db.phone || "",
    email: db.email || "",
    address: db.address || `${db.houseNo || ""}, ${db.area || ""}, Pune 411030`,
    houseNo: db.houseNo || "",
    constituency: "Kasba Peth",
    constituencyNo: "215",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: db.prabhaag || "Prabhaag 12",
    ward: db.ward || "Ward 18",
    gan: "Gan 8",
    boothNumber: boothNum,
    pollingStation: db.boothName || `Polling Station Room ${boothNum}`,
    caste: db.caste || "General",
    occupation: db.occupation || "N/A",
    qualification: db.qualification || "Graduate",
    schemeBeneficiary: db.scheme ? [db.scheme] : [],
    politicalLeaning: leaningMap[db.classification] || "NEUTRAL",
    isInfluencer: !!db.isKeyInfluencer,
    influencerScope: db.strategyNotes || "",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: !!db.isVoted,
    votedAt: db.votedAt || undefined,
    votedByUserName: db.votedBy || undefined,
    isVisited: !!db.isVisited,
    isFavorite: !!db.isFavourite,
    isHelped: false,
    isDeceased: false,
    isOutside: false,
  };
}

export interface VoterManagementViewProps {
  portalMode?: "CANDIDATE" | "KARYAKARTA";
  assignedBooths?: string[] | number[];
  cadreUserName?: string;
  cadreUserId?: string;
  onNavigateBack?: () => void;
}

export function VoterManagementView({
  portalMode = "CANDIDATE",
  assignedBooths,
  cadreUserName,
  cadreUserId,
}: VoterManagementViewProps = {}) {
  const { showToast } = useToast();

  // Local state of electors for reactive updates (defaults to seed, replaced by live DB)
  const [electors, setElectors] = useState<ElectorRecord[]>(SEED_ELECTORS);
  const [isLiveDbConnected, setIsLiveDbConnected] = useState<boolean>(false);
  const [liveStats, setLiveStats] = useState<any>(null);

  // Load Live Database Voters from Backend
  useEffect(() => {
    let active = true;
    async function loadLiveVoters() {
      try {
        const [votersRes, statsRes] = await Promise.allSettled([
          apiFetch<any>("/voters?limit=100"),
          apiFetch<any>("/voters/stats"),
        ]);

        let rawList: any[] = [];
        if (votersRes.status === "fulfilled" && votersRes.value) {
          const val = votersRes.value as any;
          if (Array.isArray(val.data?.voters)) {
            rawList = val.data.voters;
          } else if (Array.isArray(val.data)) {
            rawList = val.data;
          } else if (Array.isArray(val.voters)) {
            rawList = val.voters;
          } else if (Array.isArray(val)) {
            rawList = val;
          }
        }

        if (rawList.length > 0) {
          const liveList = rawList.map(mapDbVoterToElector);
          if (active) {
            setElectors(liveList);
            setIsLiveDbConnected(true);
          }
        } else if (votersRes.status === "rejected") {
          console.error("Voters API call rejected:", (votersRes as any).reason);
        }

        if (
          statsRes.status === "fulfilled" &&
          statsRes.value?.success &&
          statsRes.value.data
        ) {
          if (active) {
            setLiveStats(statsRes.value.data);
          }
        }
      } catch (err) {
        console.warn("Backend not reached, using local seed electors", err);
      }
    }
    loadLiveVoters();
    return () => {
      active = false;
    };
  }, []);

  // Active Election Day State (Client requirement: turnout control active during polling days)
  const [isElectionDayActive, setIsElectionDayActive] = useState<boolean>(true);

  // Selected Voter for Profile View (Continuous full-page view)
  const [selectedVoter, setSelectedVoter] = useState<ElectorRecord | null>(null);

  // Toggle Turnout Handler (Enhanced with LPIANE Timestamps & Audit Logs)
  const handleToggleTurnout = (voterId: string, customTimestamp?: string, reason?: string) => {
    if (!isElectionDayActive) {
      showToast("warning", "Election Concluded", "Voter turnout recording is restricted to active election polling days only.");
      return;
    }
    const currentTimestamp =
      customTimestamp ||
      new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) +
        ", " +
        new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

    const actorName =
      cadreUserName ||
      (portalMode === "KARYAKARTA" ? "Sachin D. Mane (Booth Agent #101)" : "Candidate Admin (Anand Shinde)");
    const actorId =
      cadreUserId || (portalMode === "KARYAKARTA" ? "CADRE-101-01" : "USR-CADMIN-01");

    setElectors((prev) =>
      prev.map((e) => {
        if (e.id === voterId) {
          const nextVoted = !e.hasVoted;

          // Sync live turnout to backend database
          apiFetch(`/voters/${voterId}/turnout`, {
            method: "PATCH",
            body: JSON.stringify({
              isVoted: nextVoted,
              votedAt: currentTimestamp,
              votedBy: actorName,
            }),
          }).catch((err) => console.warn("Live DB turnout sync warning:", err));

          const auditEntry = {
            id: `aud-${Date.now()}`,
            previousStatus: (e.hasVoted ? "VOTED" : "NOT_VOTED") as "VOTED" | "NOT_VOTED",
            newStatus: (nextVoted ? "VOTED" : "NOT_VOTED") as "VOTED" | "NOT_VOTED",
            updatedBy: actorName,
            userId: actorId,
            timestamp: currentTimestamp,
            reason: reason || (nextVoted ? "Polling Booth Turnout Verification" : "Authorized Status Correction"),
          };
          const nextAudit = [...(e.votingAuditTrail || []), auditEntry];

          showToast(
            nextVoted ? "success" : "info",
            nextVoted ? "Voter Turnout Confirmed" : "Turnout Status Reverted",
            `${e.fullName} has been marked as ${
              nextVoted
                ? "VOTED at " + currentTimestamp + " (Booth #" + e.boothNumber + ")"
                : "NOT VOTED (" + (reason || "Clerical correction") + ")"
            }.`
          );
          return {
            ...e,
            hasVoted: nextVoted,
            votedAt: nextVoted ? currentTimestamp : undefined,
            votedByUserName: nextVoted ? actorName : undefined,
            votedByUserId: nextVoted ? actorId : undefined,
            votingAuditTrail: nextAudit,
          };
        }
        return e;
      })
    );
    if (selectedVoter && selectedVoter.id === voterId) {
      setSelectedVoter((prev) => {
        if (!prev) return null;
        const nextVoted = !prev.hasVoted;
        const auditEntry = {
          id: `aud-${Date.now()}`,
          previousStatus: (prev.hasVoted ? "VOTED" : "NOT_VOTED") as "VOTED" | "NOT_VOTED",
          newStatus: (nextVoted ? "VOTED" : "NOT_VOTED") as "VOTED" | "NOT_VOTED",
          updatedBy: actorName,
          userId: actorId,
          timestamp: currentTimestamp,
          reason: reason || (nextVoted ? "Polling Booth Turnout Verification" : "Authorized Status Correction"),
        };
        return {
          ...prev,
          hasVoted: nextVoted,
          votedAt: nextVoted ? currentTimestamp : undefined,
          votedByUserName: nextVoted ? actorName : undefined,
          votedByUserId: nextVoted ? actorId : undefined,
          votingAuditTrail: [...(prev.votingAuditTrail || []), auditEntry],
        };
      });
    }
  };

  // Quick Filters State
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>("total");

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState<string>("");

  // Advanced Filters State
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<"ADVANCED" | "LESS">("ADVANCED");

  // Collapsible Categories
  const [categoryCollapsed, setCategoryCollapsed] = useState<Record<string, boolean>>({
    recordStatus: false,
    personalInfo: false,
    nameFilters: false,
    locationIdentity: false,
    communityRecords: false,
  });

  // Filter Form Values
  const [filters, setFilters] = useState({
    deceased: "ALL",
    hasMobile: "ALL",
    hasEmail: "ALL",
    hasNewAddress: "ALL",
    gender: "ALL",
    ageMin: "",
    ageMax: "",
    agePreset: "ALL",
    voterName: "",
    constituencyNo: "ALL",
    boothNo: "ALL",
    serialNo: "",
    houseNumber: "",
    epicNumber: "",
    boothStation: "ALL",
    ward: "ALL",
    communityGroups: [] as string[],
  });

  // Selection & Pagination
  const [selectedElectors, setSelectedElectors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);

  // Modals
  const [isAddVoterOpen, setIsAddVoterOpen] = useState<boolean>(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);
  const [smsTemplate, setSmsTemplate] = useState<string>(
    "Namaskar, please cast your vote for Adv. Vikram Patil in the upcoming elections at your assigned booth."
  );

  // New Elector Form State
  const [newElector, setNewElector] = useState({
    fullName: "",
    hindiName: "",
    relativeName: "",
    relativeHindiName: "",
    relationType: "Father" as "Father" | "Husband" | "Mother" | "Other",
    gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
    age: "",
    epicNumber: "",
    mobile: "",
    constituencyNo: "215",
    boothNumber: "101",
    ward: "Ward 12 (Kasba Peth)",
    pollingStation: "PMC School No. 12, Kasba Peth",
    address: "",
  });

  // Community allocations helpers
  const getAllocationsForElector = (electorId: string): CommunityAllocation[] => {
    return SEED_COMMUNITY_ALLOCATIONS.filter((a) => a.electorId === electorId);
  };

  const getElectorCommunityStatus = (electorId: string): string | undefined => {
    return SEED_ELECTOR_STATUSES[electorId];
  };

  // Toggle Category Accordion
  const toggleCategory = (key: string) => {
    setCategoryCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAllCategories = () => {
    setCategoryCollapsed({
      recordStatus: false,
      personalInfo: false,
      nameFilters: false,
      locationIdentity: false,
      communityRecords: false,
    });
  };

  const collapseAllCategories = () => {
    setCategoryCollapsed({
      recordStatus: true,
      personalInfo: true,
      nameFilters: true,
      locationIdentity: true,
      communityRecords: true,
    });
  };

  // Community Group Multi-Select Handlers
  const handleToggleCommunityGroup = (groupId: string) => {
    setFilters((prev) => {
      const exists = prev.communityGroups.includes(groupId);
      const next = exists
        ? prev.communityGroups.filter((g) => g !== groupId)
        : [...prev.communityGroups, groupId];
      return { ...prev, communityGroups: next };
    });
    setCurrentPage(1);
  };

  const handleSelectAllCommunityGroups = () => {
    setFilters((prev) => ({ ...prev, communityGroups: COMMUNITY_GROUPS.map((g) => g.id) }));
    setCurrentPage(1);
  };

  const handleClearCommunityGroups = () => {
    setFilters((prev) => ({ ...prev, communityGroups: [] }));
    setCurrentPage(1);
  };

  // Reset All Filters
  const handleResetAll = () => {
    setFilters({
      deceased: "ALL",
      hasMobile: "ALL",
      hasEmail: "ALL",
      hasNewAddress: "ALL",
      gender: "ALL",
      ageMin: "",
      ageMax: "",
      agePreset: "ALL",
      voterName: "",
      constituencyNo: "ALL",
      boothNo: "ALL",
      serialNo: "",
      houseNumber: "",
      epicNumber: "",
      boothStation: "ALL",
      ward: "ALL",
      communityGroups: [],
    });
    setGlobalSearch("");
    setActiveQuickFilter("total");
    setCurrentPage(1);
    showToast("info", "Filters Reset", "All voter filters and search queries have been reset.");
  };

  // Apply Filters CTA
  const handleApplyFilters = () => {
    setCurrentPage(1);
    showToast("success", "Filters Applied", `Showing ${filteredElectors.length} matching electors.`);
  };

  // Sync Roll CTA
  const handleSyncRoll = () => {
    showToast("info", "Electoral Roll", "Electoral roll synchronized with central server.");
  };

  // Copy EPIC ID
  const handleCopyEpic = (epic: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(epic);
      showToast("info", "EPIC Copied", `EPIC ID ${epic} copied to clipboard!`);
    }
  };

  // Select All Checkbox
  const handleSelectAll = () => {
    if (selectedElectors.length === paginatedElectors.length && paginatedElectors.length > 0) {
      setSelectedElectors([]);
    } else {
      setSelectedElectors(paginatedElectors.map((e) => e.id));
    }
  };

  const handleToggleElector = (id: string) => {
    setSelectedElectors((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    const listToExport = selectedElectors.length > 0
      ? filteredElectors.filter((e) => selectedElectors.includes(e.id))
      : filteredElectors;

    const headers = [
      "Constituency No",
      "Booth No",
      "Sr No",
      "Elector Name",
      "Hindi Name",
      "Relative Name",
      "Relative Hindi Name",
      "EPIC ID",
      "Age",
      "Sex",
      "Deceased",
      "Has Mobile",
      "Has Email",
      "Has New Address",
      "House No",
      "Booth Station",
      "Ward",
      "Community Groups",
      "Contact",
    ];

    const rows = listToExport.map((e) => {
      const allocs = getAllocationsForElector(e.id || e.voterCode);
      const status = getElectorCommunityStatus(e.id || e.voterCode);
      const communityStr =
        allocs.length > 0
          ? allocs.map((a) => `${a.category}: ${a.groupName} (${a.verificationStatus})`).join("; ")
          : status === "NOT_ASSOCIATED"
          ? "Not Associated"
          : status === "NOT_DISCLOSED"
          ? "Not Disclosed"
          : "None";

      return [
        `"${e.constituencyNo || "215"}"`,
        e.boothNumber,
        e.serialNo,
        `"${e.fullName}"`,
        `"${e.hindiName || ""}"`,
        `"${e.relativeName}"`,
        `"${e.relativeHindiName || ""}"`,
        `"${e.epicNumber}"`,
        e.age,
        e.gender,
        e.isDeceased ? '"Yes"' : '"No"',
        e.mobile && e.mobile.trim() !== "" ? '"Yes"' : '"No"',
        e.email && e.email.trim() !== "" ? '"Yes"' : '"No"',
        e.newAddress && e.newAddress.trim() !== "" ? '"Yes"' : '"No"',
        `"${e.houseNo || ""}"`,
        `"${e.pollingStation}"`,
        `"${e.ward || e.prabhaag || ""}"`,
        `"${communityStr}"`,
        `"${e.mobile || ""}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Total_Voters_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "Export Complete", `Exported ${listToExport.length} voters to CSV successfully.`);
  };

  // 23 Quick Filter Cards (Dynamic counts from Live Hostinger DB if available)
  const quickFilterCards = [
    { id: "total", label: "Total Voters", count: liveStats ? liveStats.totalElectors.toLocaleString("en-IN") : "2,48,650", icon: Users, iconBg: "bg-blue-50 dark:bg-blue-950/50", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "male", label: "Male", count: liveStats ? liveStats.maleCount.toLocaleString("en-IN") : "1,27,560", icon: Users, iconBg: "bg-indigo-50 dark:bg-indigo-950/50", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { id: "female", label: "Female", count: liveStats ? liveStats.femaleCount.toLocaleString("en-IN") : "1,21,090", icon: Users, iconBg: "bg-pink-50 dark:bg-pink-950/50", iconColor: "text-pink-600 dark:text-pink-400" },
    { id: "alphabets", label: "Name Alphabet", count: "26", icon: Tag, iconBg: "bg-purple-50 dark:bg-purple-950/50", iconColor: "text-purple-600 dark:text-purple-400" },
    { id: "prabhaag", label: "Prabhaag", count: "12", icon: Building2, iconBg: "bg-cyan-50 dark:bg-cyan-950/50", iconColor: "text-cyan-600 dark:text-cyan-400" },
    { id: "gan", label: "Gan", count: "8", icon: Layers, iconBg: "bg-amber-50 dark:bg-amber-950/50", iconColor: "text-amber-600 dark:text-amber-400" },
    { id: "parts", label: "Electoral Part", count: "325", icon: Layers, iconBg: "bg-blue-50 dark:bg-blue-950/50", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "karyakarta", label: "Karyakarta", count: "4,850", icon: UserCheck, iconBg: "bg-purple-50 dark:bg-purple-950/50", iconColor: "text-purple-600 dark:text-purple-400" },
    { id: "booth", label: "Booth No", count: "2,045", icon: Building2, iconBg: "bg-blue-50 dark:bg-blue-950/50", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "mobile", label: "Mobile", count: liveStats ? liveStats.totalElectors.toLocaleString("en-IN") : "1,86,430", icon: Phone, iconBg: "bg-cyan-50 dark:bg-cyan-950/50", iconColor: "text-cyan-600 dark:text-cyan-400" },
    { id: "dob", label: "DOB / Month", count: liveStats ? liveStats.totalElectors.toLocaleString("en-IN") : "2,48,650", icon: Calendar, iconBg: "bg-rose-50 dark:bg-rose-950/50", iconColor: "text-rose-600 dark:text-rose-400" },
    { id: "surname", label: "Surname", count: "89,540", icon: Users, iconBg: "bg-indigo-50 dark:bg-indigo-950/50", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { id: "voted", label: "Voted", count: liveStats ? liveStats.votedCount.toLocaleString("en-IN") : "1,40,320", icon: CheckCircle2, iconBg: "bg-blue-50 dark:bg-blue-950/50", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "non_voted", label: "Non Voted", count: liveStats ? (liveStats.totalElectors - liveStats.votedCount).toLocaleString("en-IN") : "1,08,330", icon: XCircle, iconBg: "bg-rose-50 dark:bg-rose-950/50", iconColor: "text-rose-600 dark:text-rose-400" },
    { id: "visited", label: "Visited", count: liveStats ? liveStats.visitedCount.toLocaleString("en-IN") : "72,450", icon: Eye, iconBg: "bg-cyan-50 dark:bg-cyan-950/50", iconColor: "text-cyan-600 dark:text-cyan-400" },
    { id: "favorites", label: "Favorites", count: "12,680", icon: Heart, iconBg: "bg-rose-50 dark:bg-rose-950/50", iconColor: "text-rose-600 dark:text-rose-400" },
    { id: "helped", label: "Helped", count: "6,240", icon: Heart, iconBg: "bg-amber-50 dark:bg-amber-950/50", iconColor: "text-amber-600 dark:text-amber-400" },
    { id: "address", label: "Address", count: "2,48,650", icon: MapPin, iconBg: "bg-cyan-50 dark:bg-cyan-950/50", iconColor: "text-cyan-600 dark:text-cyan-400" },
    { id: "outside", label: "Outside", count: "1,860", icon: Share2, iconBg: "bg-amber-50 dark:bg-amber-950/50", iconColor: "text-amber-600 dark:text-amber-400" },
    { id: "printed", label: "Printed", count: "1,92,430", icon: CheckCircle2, iconBg: "bg-purple-50 dark:bg-purple-950/50", iconColor: "text-purple-600 dark:text-purple-400" },
    { id: "deceased", label: "Deceased", count: "320", icon: AlertCircle, iconBg: "bg-slate-100 dark:bg-slate-800", iconColor: "text-slate-600 dark:text-slate-400" },
    { id: "house", label: "House No", count: "2,48,650", icon: Home, iconBg: "bg-amber-50 dark:bg-amber-950/50", iconColor: "text-amber-600 dark:text-amber-400" },
    { id: "schemes", label: "Schemes", count: "98,760", icon: Gift, iconBg: "bg-blue-50 dark:bg-blue-950/50", iconColor: "text-blue-600 dark:text-blue-400" },
  ];

  // Distinct Filter Option Sets
  const uniqueConstituencies = useMemo(() => {
    const s = new Set<string>();
    electors.forEach((e) => {
      if (e.constituencyNo) s.add(e.constituencyNo);
    });
    return Array.from(s).sort();
  }, [electors]);

  const uniqueBooths = useMemo(() => {
    const s = new Set<number>();
    electors.forEach((e) => {
      if (e.boothNumber) s.add(e.boothNumber);
    });
    return Array.from(s).sort((a, b) => a - b);
  }, [electors]);

  const uniqueStations = useMemo(() => {
    const s = new Set<string>();
    electors.forEach((e) => {
      if (e.pollingStation) s.add(e.pollingStation);
    });
    return Array.from(s).sort();
  }, [electors]);

  const uniqueWards = useMemo(() => {
    const s = new Set<string>();
    electors.forEach((e) => {
      if (e.ward) s.add(e.ward);
      else if (e.prabhaag) s.add(e.prabhaag);
    });
    return Array.from(s).sort();
  }, [electors]);

  // Filter Electors
  const filteredElectors = useMemo(() => {
    return electors.filter((e) => {
      // 1. Quick Filters
      if (activeQuickFilter === "male" && e.gender !== "MALE") return false;
      if (activeQuickFilter === "female" && e.gender !== "FEMALE") return false;
      if (activeQuickFilter === "mobile" && (!e.mobile || e.mobile.trim() === "")) return false;
      if (activeQuickFilter === "voted" && !e.hasVoted) return false;
      if (activeQuickFilter === "non_voted" && e.hasVoted) return false;
      if (activeQuickFilter === "visited" && !e.isVisited) return false;
      if (activeQuickFilter === "favorites" && !e.isFavorite) return false;
      if (activeQuickFilter === "helped" && !e.isHelped) return false;
      if (activeQuickFilter === "deceased" && !e.isDeceased) return false;
      if (activeQuickFilter === "outside" && !e.isOutside) return false;
      if (activeQuickFilter === "printed" && e.voterSlipStatus !== "PRINTED" && e.voterSlipStatus !== "DELIVERED") return false;
      if (activeQuickFilter === "schemes" && (!e.schemeBeneficiary || e.schemeBeneficiary.length === 0)) return false;

      // 2. Global Search
      if (globalSearch.trim() !== "") {
        const q = globalSearch.toLowerCase().trim();
        const matchesName = e.fullName.toLowerCase().includes(q);
        const matchesHindi = e.hindiName?.toLowerCase().includes(q);
        const matchesRelative = e.relativeName.toLowerCase().includes(q);
        const matchesRelativeHindi = e.relativeHindiName?.toLowerCase().includes(q);
        const matchesEpic = e.epicNumber.toLowerCase().includes(q);
        const matchesPhone = e.mobile?.replace(/\s+/g, "").includes(q.replace(/\s+/g, ""));
        const matchesBooth = e.boothNumber.toString().includes(q);
        const matchesSr = e.serialNo.toString().includes(q);
        const matchesConstituency = e.constituencyNo.includes(q) || e.assemblySegment?.toLowerCase().includes(q);
        const matchesStation = e.pollingStation.toLowerCase().includes(q);
        const matchesWard = (e.ward || e.prabhaag || "").toLowerCase().includes(q);
        const matchesAddress = (e.houseNo || e.address || "").toLowerCase().includes(q);

        if (
          !matchesName &&
          !matchesHindi &&
          !matchesRelative &&
          !matchesRelativeHindi &&
          !matchesEpic &&
          !matchesPhone &&
          !matchesBooth &&
          !matchesSr &&
          !matchesConstituency &&
          !matchesStation &&
          !matchesWard &&
          !matchesAddress
        ) {
          return false;
        }
      }

      // 3. Category 1: Record Status
      if (filters.deceased === "YES" && !e.isDeceased) return false;
      if (filters.deceased === "NO" && e.isDeceased) return false;
      if (filters.hasMobile === "YES" && (!e.mobile || e.mobile.trim() === "")) return false;
      if (filters.hasMobile === "NO" && e.mobile && e.mobile.trim() !== "") return false;
      if (filters.hasEmail === "YES" && (!e.email || e.email.trim() === "")) return false;
      if (filters.hasEmail === "NO" && e.email && e.email.trim() !== "") return false;
      if (filters.hasNewAddress === "YES" && (!e.newAddress || e.newAddress.trim() === "")) return false;
      if (filters.hasNewAddress === "NO" && e.newAddress && e.newAddress.trim() !== "") return false;

      // 4. Category 2: Personal Information
      if (filters.gender !== "ALL" && e.gender !== filters.gender) return false;
      if (filters.ageMin !== "") {
        const min = parseInt(filters.ageMin, 10);
        if (!isNaN(min) && e.age < min) return false;
      }
      if (filters.ageMax !== "") {
        const max = parseInt(filters.ageMax, 10);
        if (!isNaN(max) && e.age > max) return false;
      }
      if (filters.agePreset !== "ALL") {
        if (filters.agePreset === "18-25" && (e.age < 18 || e.age > 25)) return false;
        if (filters.agePreset === "26-40" && (e.age < 26 || e.age > 40)) return false;
        if (filters.agePreset === "41-60" && (e.age < 41 || e.age > 60)) return false;
        if (filters.agePreset === "60+" && e.age < 60) return false;
      }

      // 5. Category 3: Name Filters
      if (filters.voterName.trim() !== "") {
        const nq = filters.voterName.toLowerCase().trim();
        const m1 = e.fullName.toLowerCase().includes(nq);
        const m2 = e.hindiName?.toLowerCase().includes(nq);
        const m3 = e.relativeName.toLowerCase().includes(nq);
        const m4 = e.relativeHindiName?.toLowerCase().includes(nq);
        if (!m1 && !m2 && !m3 && !m4) return false;
      }

      // 6. Category 4: Location & Identity
      if (filters.constituencyNo !== "ALL" && e.constituencyNo !== filters.constituencyNo) return false;
      if (filters.boothNo !== "ALL" && e.boothNumber.toString() !== filters.boothNo) return false;
      if (filters.serialNo.trim() !== "" && !e.serialNo.toString().includes(filters.serialNo.trim())) return false;
      if (filters.houseNumber.trim() !== "") {
        const hq = filters.houseNumber.toLowerCase().trim();
        const mh = e.houseNo.toLowerCase().includes(hq) || e.address.toLowerCase().includes(hq);
        if (!mh) return false;
      }
      if (filters.epicNumber.trim() !== "" && !e.epicNumber.toLowerCase().includes(filters.epicNumber.toLowerCase().trim())) return false;
      if (filters.boothStation !== "ALL" && e.pollingStation !== filters.boothStation) return false;
      if (filters.ward !== "ALL" && (e.ward || e.prabhaag || "") !== filters.ward) return false;

      // 7. Category 5: Community Groups
      if (filters.communityGroups.length > 0) {
        const allocs = getAllocationsForElector(e.id || e.voterCode);
        const st = getElectorCommunityStatus(e.id || e.voterCode);
        const hasMatch = filters.communityGroups.some((gid) => {
          if (gid === "NOT_ASSOCIATED") return st === "NOT_ASSOCIATED";
          if (gid === "NOT_DISCLOSED") return st === "NOT_DISCLOSED";
          return allocs.some((a) => a.category === gid);
        });
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [activeQuickFilter, globalSearch, filters]);

  // Total pages and Paginated Slice
  const totalPages = Math.ceil(filteredElectors.length / rowsPerPage) || 1;
  const paginatedElectors = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredElectors.slice(start, start + rowsPerPage);
  }, [filteredElectors, currentPage, rowsPerPage]);

  // Active Filter Chips List
  const activeChips = useMemo(() => {
    const chips: { id: string; category: string; label: string; value: string; onClear: () => void }[] = [];

    if (globalSearch.trim() !== "") {
      chips.push({
        id: "globalSearch",
        category: "Search",
        label: "Global Search",
        value: `"${globalSearch}"`,
        onClear: () => setGlobalSearch(""),
      });
    }

    if (filters.deceased !== "ALL") {
      chips.push({
        id: "deceased",
        category: "Record Status",
        label: "Deceased",
        value: filters.deceased === "YES" ? "Yes (Deceased)" : "No (Active/Alive)",
        onClear: () => setFilters((prev) => ({ ...prev, deceased: "ALL" })),
      });
    }

    if (filters.hasMobile !== "ALL") {
      chips.push({
        id: "hasMobile",
        category: "Record Status",
        label: "Has Mobile",
        value: filters.hasMobile === "YES" ? "Yes (Phone Available)" : "No (No Phone)",
        onClear: () => setFilters((prev) => ({ ...prev, hasMobile: "ALL" })),
      });
    }

    if (filters.hasEmail !== "ALL") {
      chips.push({
        id: "hasEmail",
        category: "Record Status",
        label: "Has Email",
        value: filters.hasEmail === "YES" ? "Yes (Email Available)" : "No (No Email)",
        onClear: () => setFilters((prev) => ({ ...prev, hasEmail: "ALL" })),
      });
    }

    if (filters.hasNewAddress !== "ALL") {
      chips.push({
        id: "hasNewAddress",
        category: "Record Status",
        label: "Has New Address",
        value: filters.hasNewAddress === "YES" ? "Yes (Shifted)" : "No (Standard)",
        onClear: () => setFilters((prev) => ({ ...prev, hasNewAddress: "ALL" })),
      });
    }

    if (filters.gender !== "ALL") {
      chips.push({
        id: "gender",
        category: "Demographics",
        label: "Gender",
        value: filters.gender,
        onClear: () => setFilters((prev) => ({ ...prev, gender: "ALL" })),
      });
    }

    if (filters.agePreset !== "ALL") {
      chips.push({
        id: "agePreset",
        category: "Demographics",
        label: "Age Group",
        value: filters.agePreset,
        onClear: () => setFilters((prev) => ({ ...prev, agePreset: "ALL" })),
      });
    }

    if (filters.voterName.trim() !== "") {
      chips.push({
        id: "voterName",
        category: "Name",
        label: "Voter Name",
        value: `"${filters.voterName}"`,
        onClear: () => setFilters((prev) => ({ ...prev, voterName: "" })),
      });
    }

    if (filters.boothNo !== "ALL") {
      chips.push({
        id: "boothNo",
        category: "Location",
        label: "Booth",
        value: `#${filters.boothNo}`,
        onClear: () => setFilters((prev) => ({ ...prev, boothNo: "ALL" })),
      });
    }

    if (filters.serialNo.trim() !== "") {
      chips.push({
        id: "serialNo",
        category: "Location",
        label: "Sr. No.",
        value: filters.serialNo,
        onClear: () => setFilters((prev) => ({ ...prev, serialNo: "" })),
      });
    }

    if (filters.houseNumber.trim() !== "") {
      chips.push({
        id: "houseNumber",
        category: "Location",
        label: "House No.",
        value: `"${filters.houseNumber}"`,
        onClear: () => setFilters((prev) => ({ ...prev, houseNumber: "" })),
      });
    }

    if (filters.epicNumber.trim() !== "") {
      chips.push({
        id: "epicNumber",
        category: "Identity",
        label: "EPIC ID",
        value: filters.epicNumber.toUpperCase(),
        onClear: () => setFilters((prev) => ({ ...prev, epicNumber: "" })),
      });
    }

    filters.communityGroups.forEach((gid) => {
      const g = COMMUNITY_GROUPS.find((cg) => cg.id === gid);
      chips.push({
        id: `comm_${gid}`,
        category: "Community Groups",
        label: "Group",
        value: g?.shortLabel || gid,
        onClear: () => handleToggleCommunityGroup(gid),
      });
    });

    return chips;
  }, [filters, globalSearch]);

  const activeFiltersCount = activeChips.length;

  // Render continuous profile if an elector is selected
  if (selectedVoter) {
    return (
      <ContinuousVoterProfileView
        voter={selectedVoter}
        onBack={() => setSelectedVoter(null)}
        communityAllocations={getAllocationsForElector(selectedVoter.id || selectedVoter.voterCode)}
        electorStatus={getElectorCommunityStatus(selectedVoter.id || selectedVoter.voterCode)}
        isElectionActive={isElectionDayActive}
        onToggleTurnout={handleToggleTurnout}
        onToggleElectionActive={() => setIsElectionDayActive((prev) => !prev)}
      />
    );
  }

  return (
    <div className="space-y-4 pb-12 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ===================================================================== */}
      {/* HEADER SECTION (Breadcrumb, Title, KPI, Actions)                      */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded uppercase tracking-wider border border-blue-200 dark:border-blue-900/40">
              {portalMode === "KARYAKARTA" ? "Field Cadre Operations" : "Voter Intelligence"}
            </span>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {portalMode === "KARYAKARTA" ? "Search Voter" : "Total Voters"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {portalMode === "KARYAKARTA" ? "Search Voter Roll (मतदार यादी शोध)" : "Total Voters"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {portalMode === "KARYAKARTA"
              ? `Instant search across name, Marathi spelling, EPIC, mobile number, or house number. Scoped to Booths: ${assignedBooths?.join(", ") || "101, 102"}`
              : "Electoral roll records with multi-attribute filtering, polling station locators, and unified profiles."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Total Voters Pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs ${
            isLiveDbConnected
              ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
              : "bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isLiveDbConnected ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`} />
            <span>
              {isLiveDbConnected
                ? `Live DB: ${liveStats?.totalElectors ?? electors.length} Electors (Hostinger MySQL)`
                : "2,48,650 Total Voters"}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleSyncRoll}
            className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Refresh</span>
          </button>

          {/* Send SMS Button */}
          <button
            onClick={() => setIsSmsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Send SMS</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>

          {/* Add Voter Button */}
          <button
            onClick={() => setIsAddVoterOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
          >
            <span>+ + Add Voter</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ACTIVE ELECTION DAY TURNOUT WINDOW BANNER                             */}
      {/* ===================================================================== */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
        isElectionDayActive
          ? "bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-emerald-200 dark:border-emerald-800/80"
          : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      }`}>
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full shrink-0 ${isElectionDayActive ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white">
                {isElectionDayActive ? "Active Election Day Polling Turnout Window" : "Election Concluded • Polling Stations Closed"}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isElectionDayActive
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {isElectionDayActive ? "POLLS ACTIVE (07:00 AM - 06:00 PM)" : "READ-ONLY ARCHIVE"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isElectionDayActive
                ? "Real-time voter turnout recording enabled across all booths. Open any central voter profile to verify & toggle turnout status."
                : "Polling has ended. Central voter profile turnout controls are locked in read-only audit mode."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsElectionDayActive((prev) => !prev);
              showToast("info", "Election Mode Switched", !isElectionDayActive ? "Election day mode activated: Polling window opened." : "Election concluded mode: Polling window closed.");
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {isElectionDayActive ? "Simulate: Close Polls" : "Simulate: Open Polls"}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECTION 1: QUICK FILTERS (23 CARDS - MATCHING SCREENSHOT 1)           */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Quick Filters</h2>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Click any card to instantly segment voters.</span>
          </div>

          {activeQuickFilter !== "total" && (
            <button
              onClick={() => {
                setActiveQuickFilter("total");
                setCurrentPage(1);
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Quick Filter</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
          {quickFilterCards.map((card) => {
            const Icon = card.icon;
            const isActive = activeQuickFilter === card.id;
            return (
              <button
                key={card.id}
                onClick={() => {
                  setActiveQuickFilter(card.id);
                  setCurrentPage(1);
                  showToast("info", "Quick Filter", `Filtered by ${card.label}.`);
                }}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 shadow-xs ring-2 ring-blue-500/30"
                    : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 hover:bg-slate-50/80"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block truncate leading-tight">
                    {card.label}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block leading-tight font-tabular mt-0.5">
                    {card.count}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1 leading-none">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECTION 2: SEARCH & FILTER CONTROLS BAR                              */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Global Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Global Search: Elector Name, Hindi Name, EPIC ID, Contact, Booth No., or Sr. No..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-9 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          {globalSearch && (
            <button
              onClick={() => {
                setGlobalSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Advanced vs Less Filters Switcher */}
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => {
              setFilterMode("ADVANCED");
              if (!isFilterPanelOpen) setIsFilterPanelOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isFilterPanelOpen && filterMode === "ADVANCED"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Filters</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterMode("LESS");
              if (!isFilterPanelOpen) setIsFilterPanelOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isFilterPanelOpen && filterMode === "LESS"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Less Filters</span>
          </button>
        </div>

        {/* Expand / Collapse Filters Button */}
        <button
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer ${
            isFilterPanelOpen
              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{isFilterPanelOpen ? "Collapse Filters" : "Expand Filters"}</span>
          <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
            {activeFiltersCount}
          </span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SECTION 3: ADVANCED VOTER FILTERS (5 CATEGORIES)                      */}
      {/* ===================================================================== */}
      {isFilterPanelOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {filterMode === "ADVANCED"
                      ? "ADVANCED VOTER FILTERS (5 CATEGORIES)"
                      : "COMMONLY USED FILTERS (LESS FILTERS)"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                    {activeFiltersCount} Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {filterMode === "ADVANCED"
                    ? "Record Status, Demographics, Name, Electoral Roll Location & Identity, and Community Stakeholder Groups."
                    : "Displaying only commonly used filters for rapid verification."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {filterMode === "ADVANCED" && (
                <div className="flex items-center gap-1 mr-1">
                  <button
                    type="button"
                    onClick={expandAllCategories}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-300 dark:text-slate-700 text-xs">|</span>
                  <button
                    type="button"
                    onClick={collapseAllCategories}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleResetAll}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>Reset All</span>
              </button>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex items-center gap-1 px-3 py-1 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Apply Filters ({filteredElectors.length})</span>
              </button>
            </div>
          </div>

          {/* Active Chips Row */}
          {activeChips.length > 0 && (
            <div className="pt-1 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                Active Filter Chips ({activeChips.length}):
              </span>
              {activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-medium shadow-2xs"
                >
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{chip.category}:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{chip.label}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{chip.value}</span>
                  <button
                    type="button"
                    onClick={chip.onClear}
                    className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={handleResetAll}
                className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline px-2 py-0.5 ml-1 cursor-pointer"
              >
                Clear All ({activeChips.length})
              </button>
            </div>
          )}

          {/* Category Accordions */}
          <div className="space-y-3.5 text-xs">
            {/* CATEGORY 1: RECORD STATUS FILTERS */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => toggleCategory("recordStatus")}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    1. RECORD STATUS FILTERS
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    (Deceased verification, contact availability &amp; address shifts)
                  </span>
                </div>
                {categoryCollapsed.recordStatus ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </button>

              {!categoryCollapsed.recordStatus && (
                <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
                  {/* Deceased Status */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Deceased Status</label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {filters.deceased === "ALL" ? "All Records" : filters.deceased === "YES" ? "Deceased Only" : "Active Only"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                      {(["ALL", "YES", "NO"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setFilters((prev) => ({ ...prev, deceased: opt }));
                            setCurrentPage(1);
                          }}
                          className={`py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filters.deceased === opt
                              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {opt === "ALL" ? "All" : opt === "YES" ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Has Mobile */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Has Mobile</label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {filters.hasMobile === "ALL" ? "All Records" : filters.hasMobile === "YES" ? "With Phone" : "No Phone"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                      {(["ALL", "YES", "NO"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setFilters((prev) => ({ ...prev, hasMobile: opt }));
                            setCurrentPage(1);
                          }}
                          className={`py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filters.hasMobile === opt
                              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {opt === "ALL" ? "All" : opt === "YES" ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Has Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Has Email</label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {filters.hasEmail === "ALL" ? "All Records" : filters.hasEmail === "YES" ? "With Email" : "No Email"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                      {(["ALL", "YES", "NO"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setFilters((prev) => ({ ...prev, hasEmail: opt }));
                            setCurrentPage(1);
                          }}
                          className={`py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filters.hasEmail === opt
                              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {opt === "ALL" ? "All" : opt === "YES" ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Has New Address */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Has New Address</label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {filters.hasNewAddress === "ALL" ? "All Records" : filters.hasNewAddress === "YES" ? "Shifted" : "Standard"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                      {(["ALL", "YES", "NO"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setFilters((prev) => ({ ...prev, hasNewAddress: opt }));
                            setCurrentPage(1);
                          }}
                          className={`py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filters.hasNewAddress === opt
                              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {opt === "ALL" ? "All" : opt === "YES" ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CATEGORY 2: PERSONAL INFORMATION */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => toggleCategory("personalInfo")}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    2. PERSONAL INFORMATION
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    (Gender selection, numeric age bounds &amp; age presets)
                  </span>
                </div>
                {categoryCollapsed.personalInfo ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </button>

              {!categoryCollapsed.personalInfo && (
                <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Gender */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
                      <select
                        value={filters.gender}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, gender: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="ALL">All Genders</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other / As Recorded</option>
                      </select>
                    </div>

                    {/* Age Range */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Age Range (Years)</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          placeholder="Min Age (e.g. 18)"
                          value={filters.ageMin}
                          onChange={(e) => {
                            setFilters((prev) => ({ ...prev, ageMin: e.target.value }));
                            setCurrentPage(1);
                          }}
                          className="w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-slate-400 text-xs font-bold">-</span>
                        <input
                          type="number"
                          placeholder="Max Age (e.g. 100)"
                          value={filters.ageMax}
                          onChange={(e) => {
                            setFilters((prev) => ({ ...prev, ageMax: e.target.value }));
                            setCurrentPage(1);
                          }}
                          className="w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Age Group Preset */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Age Group Preset</label>
                      <select
                        value={filters.agePreset}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, agePreset: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="ALL">All Age Groups</option>
                        <option value="18-25">18 - 25 yrs (Youth)</option>
                        <option value="26-40">26 - 40 yrs (Working)</option>
                        <option value="41-60">41 - 60 yrs (Middle Age)</option>
                        <option value="60+">60+ yrs (Senior Citizen)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CATEGORY 3: NAME FILTERS */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => toggleCategory("nameFilters")}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    3. NAME FILTERS
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    (Search voter name in English or Hindi, partial matching &amp; case-insensitive)
                  </span>
                </div>
                {categoryCollapsed.nameFilters ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </button>

              {!categoryCollapsed.nameFilters && (
                <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 animate-fade-in">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Search Voter Name (English or Hindi / Marathi)
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search voter name..."
                        value={filters.voterName}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, voterName: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                      {filters.voterName && (
                        <button
                          type="button"
                          onClick={() => {
                            setFilters((prev) => ({ ...prev, voterName: "" }));
                            setCurrentPage(1);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Matches against elector full name, Hindi name (e.g. राजेश), relative name, or relative Hindi name with partial substring support.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* CATEGORY 4: LOCATION & IDENTITY */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => toggleCategory("locationIdentity")}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    4. LOCATION &amp; IDENTITY
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    (Constituency, Booth, Sr. No., House No., EPIC ID, Polling Station, Ward)
                  </span>
                </div>
                {categoryCollapsed.locationIdentity ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </button>

              {!categoryCollapsed.locationIdentity && (
                <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {/* Constituency Number */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Constituency Number</label>
                      <select
                        value={filters.constituencyNo}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, constituencyNo: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="ALL">All Constituencies</option>
                        {uniqueConstituencies.map((c) => (
                          <option key={c} value={c}>Constituency #{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Booth Number */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Booth Number</label>
                      <select
                        value={filters.boothNo}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, boothNo: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="ALL">All Booths</option>
                        {uniqueBooths.map((b) => (
                          <option key={b} value={b.toString()}>Booth #{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Serial Number */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Serial Number (Sr. No.)</label>
                      <input
                        type="text"
                        placeholder="e.g. 1, 42, 105"
                        value={filters.serialNo}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, serialNo: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* House Number */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">House Number</label>
                      <input
                        type="text"
                        placeholder="Enter house number..."
                        value={filters.houseNumber}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, houseNumber: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {/* EPIC Number */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">EPIC Number</label>
                      <input
                        type="text"
                        placeholder="ENTER EPIC NUMBER..."
                        value={filters.epicNumber}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, epicNumber: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono"
                      />
                    </div>

                    {/* Booth Station */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Booth Station</label>
                      <select
                        value={filters.boothStation}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, boothStation: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate cursor-pointer"
                      >
                        <option value="ALL">All Polling Stations</option>
                        {uniqueStations.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Ward */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Ward</label>
                      <select
                        value={filters.ward}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, ward: e.target.value }));
                          setCurrentPage(1);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate cursor-pointer"
                      >
                        <option value="ALL">All Wards</option>
                        {uniqueWards.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CATEGORY 5: COMMUNITY / STAKEHOLDER GROUPS */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => toggleCategory("communityRecords")}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors rounded-t-xl cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    5. COMMUNITY / STAKEHOLDER GROUPS
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    (Searchable Multi Select Dropdown for Farmers, Sugar Workers, Anganwadi, SHGs &amp; Co-ops)
                  </span>
                </div>
                {categoryCollapsed.communityRecords ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </button>

              {!categoryCollapsed.communityRecords && (
                <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3 animate-fade-in rounded-b-xl">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Community / Stakeholder Groups
                    </label>
                    <CommunityGroupDropdown
                      selectedGroups={filters.communityGroups}
                      onToggleGroup={handleToggleCommunityGroup}
                      onClearAll={handleClearCommunityGroups}
                      onSelectAll={handleSelectAllCommunityGroups}
                    />
                  </div>

                  {/* Privacy & Compliance Safeguard Notice */}
                  <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-teal-900 dark:text-teal-200">Privacy &amp; Compliance Safeguard:</strong>{" "}
                      Community group records are sourced strictly from voluntary disclosure in the Elector Central Profile or verified field audits. Group affiliations are never inferred from caste, religion, name, or address.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 4: TABLE HEADER & TOOLBAR                                    */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Showing {filteredElectors.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * rowsPerPage, filteredElectors.length)} of {filteredElectors.length.toLocaleString()} matching electors
            </span>
            {selectedElectors.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                {selectedElectors.length} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Rows Selector */}
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Rows:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Sync Button */}
            <button
              onClick={handleSyncRoll}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>Sync</span>
            </button>

            {/* SMS Button */}
            <button
              onClick={() => setIsSmsModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>SMS {selectedElectors.length > 0 ? `(${selectedElectors.length})` : ""}</span>
            </button>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3 text-slate-300" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SECTION 5: ELECTORS DATA TABLE (MATCHING SCREENSHOTS 3, 4, 5)        */}
        {/* ===================================================================== */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedElectors.length === paginatedElectors.length && paginatedElectors.length > 0}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-28 whitespace-nowrap">1. CONSTITUENCY NO.</th>
                <th className="py-3 px-3 w-24 whitespace-nowrap">2. BOOTH NO.</th>
                <th className="py-3 px-3 w-20 whitespace-nowrap">3. SR. NO.</th>
                <th className="py-3 px-3 min-w-[220px]">4. ELECTOR NAME &amp; RELATIVE</th>
                <th className="py-3 px-3 w-32 whitespace-nowrap">5. EPIC ID</th>
                <th className="py-3 px-3 w-28 whitespace-nowrap">6. AGE / SEX</th>
                <th className="py-3 px-3 min-w-[200px]">7. BOOTH STATION &amp; WARD</th>
                <th className="py-3 px-3 w-32 whitespace-nowrap">8. CONTACT</th>
                <th className="py-3 px-3 text-right w-28 whitespace-nowrap">9. VIEW PROFILE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {paginatedElectors.length > 0 ? (
                paginatedElectors.map((elector) => {
                  const isChecked = selectedElectors.includes(elector.id);
                  const allocs = getAllocationsForElector(elector.id || elector.voterCode);
                  const commStatus = getElectorCommunityStatus(elector.id || elector.voterCode);

                  return (
                    <tr
                      key={elector.id}
                      className={`hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-colors ${
                        isChecked ? "bg-blue-50/40 dark:bg-blue-950/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleElector(elector.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* 1. Constituency No */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono font-tabular text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                          AC-{elector.constituencyNo}
                        </span>
                      </td>

                      {/* 2. Booth No */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono font-tabular text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 px-2 py-0.5 rounded">
                          #{elector.boothNumber}
                        </span>
                      </td>

                      {/* 3. Sr. No */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-mono font-tabular text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                          #{elector.serialNo}
                        </span>
                      </td>

                      {/* 4. Elector Name & Relative */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => setSelectedVoter(elector)}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors cursor-pointer"
                              title="Click to view complete voter profile"
                            >
                              {elector.fullName}
                            </button>
                            {elector.hindiName && (
                              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                {elector.hindiName}
                              </span>
                            )}
                          </div>

                          {/* Relative Info */}
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-wrap">
                            <span>
                              {elector.relationType === "Father"
                                ? "S/o"
                                : elector.relationType === "Husband"
                                ? "W/o"
                                : elector.relationType === "Mother"
                                ? "D/o"
                                : "R/o"}{" "}
                              {elector.relativeName}
                            </span>
                            {elector.relativeHindiName && (
                              <span className="text-slate-400">({elector.relativeHindiName})</span>
                            )}
                          </div>

                          {/* Community Groups Badges */}
                          {allocs.length > 0 ? (
                            <div className="flex items-center gap-1 flex-wrap pt-0.5">
                              {allocs.map((a) => (
                                <span
                                  key={a.id}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                                >
                                  <Users className="w-2.5 h-2.5" />
                                  <span>{a.groupName.split("/")[0]?.trim()}</span>
                                  {a.verificationStatus === "VERIFIED" && (
                                    <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                                  )}
                                </span>
                              ))}
                            </div>
                          ) : commStatus === "NOT_ASSOCIATED" ? (
                            <div className="pt-0.5">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
                                Not Associated
                              </span>
                            </div>
                          ) : commStatus === "NOT_DISCLOSED" ? (
                            <div className="pt-0.5">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                Not Disclosed
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* 5. EPIC ID */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <span className="font-mono font-tabular text-[11px] font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded tracking-wide">
                            {elector.epicNumber}
                          </span>
                          <button
                            onClick={() => handleCopyEpic(elector.epicNumber)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors cursor-pointer"
                            title="Copy EPIC ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* 6. Age / Sex */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-xs">
                          <span className="font-mono font-tabular font-bold text-slate-800 dark:text-slate-200">
                            {elector.age} yrs
                          </span>
                          <span className="text-slate-400">/</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              elector.gender === "MALE"
                                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
                                : elector.gender === "FEMALE"
                                ? "bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-900/50"
                                : "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50"
                            }`}
                          >
                            {elector.gender === "MALE" ? "Male" : elector.gender === "FEMALE" ? "Female" : "Other"}
                          </span>
                        </div>
                      </td>

                      {/* 7. Booth Station & Ward */}
                      <td className="py-3 px-3">
                        <div className="max-w-[240px]">
                          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate" title={elector.pollingStation}>
                            {elector.pollingStation}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{elector.ward || elector.prabhaag}</span>
                          </span>
                        </div>
                      </td>

                      {/* 8. Contact */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {elector.mobile ? (
                          <a
                            href={`tel:${elector.mobile}`}
                            className="inline-flex items-center gap-1 font-mono font-tabular text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                            title="Call elector"
                          >
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{elector.mobile}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs font-mono font-tabular">—</span>
                        )}
                      </td>

                      {/* 9. View Profile */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedVoter(elector)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs shrink-0 cursor-pointer group"
                          title="Open Central Voter Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-xs text-slate-700 dark:text-slate-200">No electors found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try clearing filters or adjusting your global search query.</p>
                    <button
                      onClick={handleResetAll}
                      className="mt-3 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================================== */}
        {/* SECTION 6: PAGINATION BAR                                            */}
        {/* ===================================================================== */}
        <div className="p-3 bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing {filteredElectors.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * rowsPerPage, filteredElectors.length)} of {filteredElectors.length.toLocaleString()} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pg
                    ? "bg-[#2563EB] text-white"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                {pg}
              </button>
            ))}

            {totalPages > 4 && <span className="px-1 text-slate-400">...</span>}

            {totalPages > 3 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-[#2563EB] text-white"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                {totalPages.toLocaleString()}
              </button>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ADD VOTER MODAL                                                       */}
      {/* ===================================================================== */}
      {isAddVoterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Register New Elector</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add verified voter information into the electoral roll register.
                </p>
              </div>
              <button
                onClick={() => setIsAddVoterOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddVoterOpen(false);
                showToast("success", "Elector Registered", `New elector ${newElector.fullName} registered into Booth #${newElector.boothNumber}.`);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Narayan Joshi"
                    value={newElector.fullName}
                    onChange={(e) => setNewElector({ ...newElector, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hindi / Local Name</label>
                  <input
                    type="text"
                    placeholder="e.g. रमेश नारायण जोशी"
                    value={newElector.hindiName}
                    onChange={(e) => setNewElector({ ...newElector, hindiName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Father / Husband Name"
                    value={newElector.relativeName}
                    onChange={(e) => setNewElector({ ...newElector, relativeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relation Type</label>
                  <select
                    value={newElector.relationType}
                    onChange={(e) => setNewElector({ ...newElector, relationType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="Father">Father (S/o)</option>
                    <option value="Husband">Husband (W/o)</option>
                    <option value="Mother">Mother (D/o)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sex / Gender</label>
                  <select
                    value={newElector.gender}
                    onChange={(e) => setNewElector({ ...newElector, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35"
                    value={newElector.age}
                    onChange={(e) => setNewElector({ ...newElector, age: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">EPIC Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WXE8921029"
                    value={newElector.epicNumber}
                    onChange={(e) => setNewElector({ ...newElector, epicNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Constituency No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 215"
                    value={newElector.constituencyNo}
                    onChange={(e) => setNewElector({ ...newElector, constituencyNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Booth</label>
                  <select
                    value={newElector.boothNumber}
                    onChange={(e) => setNewElector({ ...newElector, boothNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer"
                  >
                    {uniqueBooths.map((b) => (
                      <option key={b} value={b.toString()}>Booth #{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98220 00000"
                    value={newElector.mobile}
                    onChange={(e) => setNewElector({ ...newElector, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  placeholder="Plot/Flat no, Lane, Locality, Area"
                  value={newElector.address}
                  onChange={(e) => setNewElector({ ...newElector, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVoterOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  Save Elector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* BROADCAST CAMPAIGN SMS MODAL                                         */}
      {/* ===================================================================== */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Broadcast Campaign SMS</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {selectedElectors.length > 0 ? `${selectedElectors.length} Selected Voters` : `${filteredElectors.length.toLocaleString()} Filtered Voters`}
                </p>
              </div>
              <button
                onClick={() => setIsSmsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SMS Template / Content</label>
                <textarea
                  rows={4}
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Supports voter tags: {"{VoterName}"}, {"{BoothNo}"}, {"{PollingStation}"}
                </span>
              </div>

              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[11px] text-blue-800 dark:text-blue-300">
                  Estimated delivery cost: ₹
                  {((selectedElectors.length > 0 ? selectedElectors.length : filteredElectors.length) * 0.12).toFixed(2)}{" "}
                  via DLT SMS Gateway.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSmsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const count = selectedElectors.length > 0 ? selectedElectors.length : filteredElectors.length;
                    setIsSmsModalOpen(false);
                    showToast("success", "SMS Queued", `Campaign SMS broadcast queued for ${count} voters.`);
                  }}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  Broadcast SMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
