"use client";

import React, { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Check,
  X,
  ChevronRight,
  ArrowLeft,
  TrendingUp,
  Printer,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Users,
  Eye,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

// ============================================================================
// TYPES & DATA MODELS
// ============================================================================

export type WorkforceSubView =
  | "dashboard"
  | "users-all"
  | "users-add"
  | "members"
  | "update-requests";

export type UserRole =
  | "CANDIDATE_ADMIN"
  | "WAR_ROOM_HEAD"
  | "PRABHAAG_INCHARGE"
  | "KARYAKARTA"
  | "BOOTH_ADHYAKSH"
  | "DATA_OPERATOR";

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "BLOCKED";
  prabhaag?: string;
  assignedBooths: number[];
  voterSerialRange?: string;
  modulePermissions: string[];
  canImportData: boolean;
  avatar?: string;
  lastActive: string;
}

export interface KaryakartaCadre {
  id: string;
  name: string;
  phone: string;
  prabhaag: string;
  assignedBooth: number;
  surveysCompleted: number;
  voterSlipsDelivered: number;
  status: "APPROVED" | "PENDING" | "REJECTED" | "BLOCKED";
  joinedDate: string;
  isOnline: boolean;
  currentLocation?: { lat: number; lng: number; label: string };
}

export interface UpdatedFieldDiff {
  field: string;
  label: string;
  oldValue: string;
  newValue: string;
  isNew?: boolean;
}

export interface VoterUpdateRequest {
  id: string;
  voterId: string;
  voterName: string;
  epicNumber: string;
  boothNumber: number;
  locality: string;
  karyakartaId: string;
  karyakartaName: string;
  karyakartaPhone: string;
  field?: string;
  currentValue?: string;
  proposedValue?: string;
  updatedFields: UpdatedFieldDiff[];
  reason: string;
  requestedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SYNC_FAILED";
  hasConflict?: boolean;
  conflictNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  syncError?: string;
}

// ============================================================================
// SEED DATA (Exact match to Indata Candidate Platform)
// ============================================================================

export const SEED_PORTAL_USERS: PortalUser[] = [
  {
    id: "usr-01",
    name: "Adv. Vikram Patil",
    email: "vikram.patil@indata-election.in",
    phone: "+91 98220 99000",
    role: "CANDIDATE_ADMIN",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104, 105, 106, 107, 108],
    modulePermissions: ["ALL"],
    canImportData: true,
    lastActive: "Just now",
  },
  {
    id: "usr-02",
    name: "Dr. Sameer Deshpande",
    email: "sameer.d@indata-election.in",
    phone: "+91 98221 44556",
    role: "WAR_ROOM_HEAD",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104, 105, 106, 107, 108],
    modulePermissions: ["DASHBOARD", "VOTERS", "CAMPAIGN", "REPORTS", "OFFICE", "LIVE_MAP"],
    canImportData: true,
    lastActive: "4 mins ago",
  },
  {
    id: "usr-03",
    name: "Sachin Babar",
    email: "sachin.babar@indata-election.in",
    phone: "+91 98500 12345",
    role: "PRABHAAG_INCHARGE",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [101, 102, 103],
    modulePermissions: ["VOTERS", "KARYAKARTAS", "OFFICE", "LIVE_MAP"],
    canImportData: false,
    lastActive: "18 mins ago",
  },
  {
    id: "usr-04",
    name: "Pooja Jadhav",
    email: "pooja.j@indata-election.in",
    phone: "+91 94230 78901",
    role: "KARYAKARTA",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [101],
    voterSerialRange: "1 to 250",
    modulePermissions: ["VOTER_SEARCH", "SURVEY", "SLIP_DISTRIBUTION", "AI_ASSISTANT"],
    canImportData: false,
    lastActive: "1 hour ago",
  },
  {
    id: "usr-05",
    name: "Ganesh Patil",
    email: "ganesh.p@indata-election.in",
    phone: "+91 98229 11450",
    role: "KARYAKARTA",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [102],
    voterSerialRange: "251 to 500",
    modulePermissions: ["VOTER_SEARCH", "SURVEY", "SLIP_DISTRIBUTION"],
    canImportData: false,
    lastActive: "35 mins ago",
  },
  {
    id: "usr-06",
    name: "Mahesh Thorat",
    email: "mahesh.t@indata-election.in",
    phone: "+91 98909 33221",
    role: "DATA_OPERATOR",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104],
    modulePermissions: ["VOTER_VIEW", "REPORTS_EXPORT"],
    canImportData: false,
    lastActive: "2 hours ago",
  },
];

export const SEED_KARYAKARTAS: KaryakartaCadre[] = [
  {
    id: "kar-101",
    name: "Pooja Jadhav",
    phone: "+91 94230 78901",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooth: 101,
    surveysCompleted: 184,
    voterSlipsDelivered: 420,
    status: "APPROVED",
    joinedDate: "2024-02-01",
    isOnline: true,
    currentLocation: { lat: 18.5074, lng: 73.8077, label: "Ideal Colony Circle" },
  },
  {
    id: "kar-102",
    name: "Ganesh Patil",
    phone: "+91 98229 11450",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooth: 102,
    surveysCompleted: 210,
    voterSlipsDelivered: 512,
    status: "APPROVED",
    joinedDate: "2024-02-05",
    isOnline: true,
    currentLocation: { lat: 18.5085, lng: 73.809, label: "Mayur Colony Lane 4" },
  },
  {
    id: "kar-103",
    name: "Vikas More",
    phone: "+91 98233 44556",
    prabhaag: "Prabhaag 13 - Erandwane",
    assignedBooth: 104,
    surveysCompleted: 95,
    voterSlipsDelivered: 230,
    status: "APPROVED",
    joinedDate: "2024-03-01",
    isOnline: false,
    currentLocation: { lat: 18.5112, lng: 73.8321, label: "Erandwane Gaothan" },
  },
  {
    id: "kar-104",
    name: "Supriya Salve",
    phone: "+91 97654 33210",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    assignedBooth: 106,
    surveysCompleted: 142,
    voterSlipsDelivered: 310,
    status: "APPROVED",
    joinedDate: "2024-03-10",
    isOnline: true,
    currentLocation: { lat: 18.5284, lng: 73.8502, label: "FC Road Deccan" },
  },
  {
    id: "kar-105",
    name: "Amol Chordia",
    phone: "+91 98555 12099",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooth: 103,
    surveysCompleted: 0,
    voterSlipsDelivered: 0,
    status: "PENDING",
    joinedDate: "2024-04-18",
    isOnline: false,
  },
  {
    id: "kar-106",
    name: "Deepak Sutar",
    phone: "+91 98224 88771",
    prabhaag: "Prabhaag 13 - Erandwane",
    assignedBooth: 105,
    surveysCompleted: 0,
    voterSlipsDelivered: 0,
    status: "PENDING",
    joinedDate: "2024-04-18",
    isOnline: false,
  },
];

export const SEED_UPDATE_REQUESTS: VoterUpdateRequest[] = [
  {
    id: "REQ-2024-0891",
    voterId: "v-001",
    voterName: "Rajesh Kumar Verma",
    epicNumber: "WXE4829102",
    boothNumber: 101,
    locality: "Lane 3, Mayur Colony, Kothrud",
    karyakartaId: "kar-101",
    karyakartaName: "Pooja Jadhav",
    karyakartaPhone: "+91 98224 44001",
    field: "Contact & Occupation",
    currentValue: "Mobile: Not Verified, Job: Private",
    proposedValue: "Mobile: +91 98221 44001, Job: High School Teacher",
    updatedFields: [
      { field: "mobile", label: "Mobile Number", oldValue: "+91 98220 00000", newValue: "+91 98221 44001" },
      { field: "occupation", label: "Occupation", oldValue: "Private Service", newValue: "High School Teacher" },
      { field: "qualification", label: "Qualification", oldValue: "Graduate", newValue: "Post Graduate (B.Ed)" },
      { field: "schemeBeneficiary", label: "Govt Scheme", oldValue: "None", newValue: "Majhi Ladki Bahin Yojana", isNew: true },
    ],
    reason: "Met voter in person during doorstep verification. Voter verified Aadhaar-linked mobile & teacher identity card.",
    requestedAt: "2024-04-18 10:15 AM",
    status: "PENDING",
  },
  {
    id: "REQ-2024-0892",
    voterId: "v-002",
    voterName: "Sunita Rajesh Verma",
    epicNumber: "WXE0821443",
    boothNumber: 101,
    locality: "Lane 3, Mayur Colony, Kothrud",
    karyakartaId: "kar-101",
    karyakartaName: "Pooja Jadhav",
    karyakartaPhone: "+91 98224 44001",
    field: "Address & Family Link",
    currentValue: "Old Flat No 12, Mayur Colony",
    proposedValue: "Plot 14, Lane 3, Mayur Colony",
    updatedFields: [
      { field: "address", label: "Residential Address", oldValue: "Flat No 12, Old Mayur Colony", newValue: "Plot 14, Lane 3, Mayur Colony, Pune 411038" },
      { field: "houseNo", label: "House No", oldValue: "12", newValue: "Plot 14" },
      { field: "relativeName", label: "Relation Head", oldValue: "Unknown", newValue: "Husband (Rajesh Kumar Verma)" },
    ],
    reason: "Physical doorstep verification conducted at home. Family moved to newly constructed house on Plot 14 in 2021.",
    requestedAt: "2024-04-18 09:40 AM",
    status: "PENDING",
  },
  {
    id: "REQ-2024-0893",
    voterId: "v-003",
    voterName: "Pooja Santosh Deshmukh",
    epicNumber: "WXE3109244",
    boothNumber: 107,
    locality: "Shiv Plaza, Kothrud Stand",
    karyakartaId: "kar-103",
    karyakartaName: "Ramesh M. More",
    karyakartaPhone: "+91 98220 54321",
    field: "Birth Date & Youth Demographics",
    currentValue: "DOB: 1998-01-01, Age: 26",
    proposedValue: "DOB: 2002-05-14, Age: 22",
    updatedFields: [
      { field: "dob", label: "Date of Birth", oldValue: "1998-01-01", newValue: "2002-05-14" },
      { field: "age", label: "Age", oldValue: "26", newValue: "22" },
      { field: "mobile", label: "Mobile Number", oldValue: "None", newValue: "+91 97654 32110", isNew: true },
      { field: "bloodGroup", label: "Blood Group", oldValue: "Unknown", newValue: "B+ (Donor)", isNew: true },
    ],
    reason: "Birth date was incorrectly recorded in draft electoral roll. Verified via 10th standard certificate photocopy.",
    requestedAt: "2024-04-18 08:30 AM",
    status: "PENDING",
    hasConflict: true,
    conflictNote: "Earlier request submitted by Vikas M. Patil flagged age as 24. Verified Birth Certificate attached.",
  },
  {
    id: "REQ-2024-0894",
    voterId: "v-004",
    voterName: "Amit Baban Shinde",
    epicNumber: "WXE1290384",
    boothNumber: 106,
    locality: "House 88, Gaothan, Erandwane",
    karyakartaId: "kar-102",
    karyakartaName: "Ganesh K. Kulkarni",
    karyakartaPhone: "+91 98229 11450",
    field: "Migration & Out of Town Flag",
    currentValue: "Local Resident",
    proposedValue: "Out of Station (IT Professional, Bengaluru)",
    updatedFields: [
      { field: "isOutside", label: "Out of Station Flag", oldValue: "Local", newValue: "Yes (Bengaluru Tech Park)" },
      { field: "whatsapp", label: "Primary WhatsApp", oldValue: "None", newValue: "+91 99900 12345", isNew: true },
    ],
    reason: "Voter works in Bengaluru software firm. Brother confirmed he will travel to Pune on polling day if reminder sent.",
    requestedAt: "2024-04-17 06:15 PM",
    status: "PENDING",
  },
  {
    id: "REQ-2024-0895",
    voterId: "v-005",
    voterName: "Kavita Ashok Patil",
    epicNumber: "WXE7765109",
    boothNumber: 108,
    locality: "Bldg 3, Erandwane",
    karyakartaId: "kar-104",
    karyakartaName: "Vikas M. Patil",
    karyakartaPhone: "+91 98233 44556",
    field: "Political Stance & Influencer Flag",
    currentValue: "Neutral / Undecided",
    proposedValue: "Strong Supporter / Influencer",
    updatedFields: [
      { field: "stance", label: "Political Stance", oldValue: "NEUTRAL", newValue: "STRONG_SUPPORTER" },
      { field: "isInfluencer", label: "Influencer Flag", oldValue: "No", newValue: "Yes (Society Secretary)" },
      { field: "influenceNote", label: "Influence Radius", oldValue: "None", newValue: "Chintamani Co-Op Society (120 flats)", isNew: true },
    ],
    reason: "Secretary of housing society with 120 flats. Committed personal support and pledged building meeting for candidate.",
    requestedAt: "2024-04-17 04:45 PM",
    status: "PENDING",
  },
  {
    id: "REQ-2024-0896",
    voterId: "v-006",
    voterName: "Surendra Mohan Joshi",
    epicNumber: "WXE5544321",
    boothNumber: 108,
    locality: "Bungalow 7, Deccan Gymkhana",
    karyakartaId: "kar-105",
    karyakartaName: "Asha V. More",
    karyakartaPhone: "+91 98221 00998",
    field: "Senior Citizen Assistance Required",
    currentValue: "Standard Voter",
    proposedValue: "Wheelchair / Senior Citizen Polling Day Pickup",
    updatedFields: [
      { field: "specialAssistance", label: "Assistance Flag", oldValue: "No", newValue: "Yes (Senior Citizen Wheelchair)" },
      { field: "caretakerPhone", label: "Caretaker Contact", oldValue: "None", newValue: "+91 98221 00998", isNew: true },
    ],
    reason: "Age 82, mobility impaired. Son requested vehicle dispatch assistance for polling booth #108 on voting day.",
    requestedAt: "2024-04-16 11:20 AM",
    status: "PENDING",
  },
  {
    id: "REQ-2024-0897",
    voterId: "v-007",
    voterName: "Late Shantaram Govind Kulkarni",
    epicNumber: "WXE8901234",
    boothNumber: 102,
    locality: "Ganesh Krupa Bldg, Kothrud",
    karyakartaId: "kar-101",
    karyakartaName: "Pooja Jadhav",
    karyakartaPhone: "+91 98224 44001",
    field: "Deceased Voter Flag",
    currentValue: "Active",
    proposedValue: "Deceased (Mark for Death List)",
    updatedFields: [
      { field: "isDeceased", label: "Deceased Status", oldValue: "Alive / Active", newValue: "Deceased (Passed away Nov 2023)" },
      { field: "voterSlipStatus", label: "Slip Delivery", oldValue: "PENDING", newValue: "CANCELLED" },
    ],
    reason: "Death certificate verified by family. Death occurred 18-Nov-2023 at Deenanath Mangeshkar Hospital.",
    requestedAt: "2024-04-16 09:10 AM",
    status: "APPROVED",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-16 01:30 PM",
  },
  {
    id: "REQ-2024-0898",
    voterId: "v-008",
    voterName: "Mahesh Bapu Jagtap",
    epicNumber: "WXE9912041",
    boothNumber: 103,
    locality: "Swapnanagari, Paud Road",
    karyakartaId: "kar-102",
    karyakartaName: "Ganesh K. Kulkarni",
    karyakartaPhone: "+91 98229 11450",
    field: "Complete Name & EPIC Correction",
    currentValue: "Mahesh Bapu Jagtap",
    proposedValue: "Mahesh Bapusaheb Jagtap-Patil",
    updatedFields: [
      { field: "fullName", label: "Full Name", oldValue: "Mahesh Bapu Jagtap", newValue: "Mahesh Bapusaheb Jagtap-Patil" },
      { field: "caste", label: "Caste Community", oldValue: "General", newValue: "Maratha (96 Kuli)" },
    ],
    reason: "Name mismatch with official gazette notification submitted by karyakarta.",
    requestedAt: "2024-04-15 03:25 PM",
    status: "REJECTED",
    rejectionReason: "Incomplete documentation. Gazette notification scan is unreadable and does not match EPIC record photo.",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-15 05:40 PM",
  },
  {
    id: "REQ-2024-0899",
    voterId: "v-009",
    voterName: "Anjali Deepak Chitnis",
    epicNumber: "WXE3344112",
    boothNumber: 104,
    locality: "Karve Nagar, Pune",
    karyakartaId: "kar-103",
    karyakartaName: "Ramesh M. More",
    karyakartaPhone: "+91 98220 54321",
    field: "Mobile & Scheme Allocation",
    currentValue: "No Mobile, No Scheme",
    proposedValue: "Mobile: +91 97650 11223, Scheme: PM SVANidhi",
    updatedFields: [
      { field: "mobile", label: "Mobile", oldValue: "None", newValue: "+91 97650 11223", isNew: true },
      { field: "schemeBeneficiary", label: "Govt Scheme", oldValue: "None", newValue: "PM SVANidhi Micro Credit", isNew: true },
    ],
    reason: "Street vendor registered under PM SVANidhi. Wants update on kiosk stall allotment.",
    requestedAt: "2024-04-15 11:00 AM",
    status: "SYNC_FAILED",
    syncError: "ECI Roll Lock: Central database sync timeout on Electoral Part 104. Retry required.",
  },
  {
    id: "REQ-2024-0900",
    voterId: "v-010",
    voterName: "Sameer Ashokrao Gokhale",
    epicNumber: "WXE6711902",
    boothNumber: 105,
    locality: "Prabhat Road, Lane 10",
    karyakartaId: "kar-105",
    karyakartaName: "Asha V. More",
    karyakartaPhone: "+91 98221 00998",
    field: "Address Shift / Outside Ward",
    currentValue: "Prabhat Road Lane 10",
    proposedValue: "Baner Highway (Shifted 2022)",
    updatedFields: [
      { field: "isOutside", label: "Outside Ward Flag", oldValue: "Local Resident", newValue: "Shifted Outside (Baner)" },
      { field: "newAddress", label: "Current Address", oldValue: "Prabhat Rd, Pune", newValue: "Apt 902, Mont Vert, Baner, Pune 411045", isNew: true },
    ],
    reason: "Voter sold Pune property and shifted to Baner. Still registered in Kasba Peth electoral roll.",
    requestedAt: "2024-04-14 02:40 PM",
    status: "APPROVED",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-14 04:10 PM",
  },
  {
    id: "REQ-2024-0901",
    voterId: "v-011",
    voterName: "Sharada Pandurang Shinde",
    epicNumber: "WXE4412890",
    boothNumber: 101,
    locality: "Mayur Colony, Kothrud",
    karyakartaId: "kar-101",
    karyakartaName: "Pooja Jadhav",
    karyakartaPhone: "+91 98224 44001",
    field: "Favorite / Family Influence",
    currentValue: "Untagged",
    proposedValue: "Favorite / Influencer Family",
    updatedFields: [
      { field: "isFavorite", label: "Favorite Star Marker", oldValue: "No", newValue: "Yes (Core Influencer Family)" },
      { field: "isVisited", label: "Doorstep Visit", oldValue: "Not Visited", newValue: "Visited (Twice by Karyakarta)" },
    ],
    reason: "Matriarch of respected 18-voter joint family in Lane 4. Committed entire family vote.",
    requestedAt: "2024-04-14 10:15 AM",
    status: "APPROVED",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-14 12:00 PM",
  },
  {
    id: "REQ-2024-0902",
    voterId: "v-012",
    voterName: "Kiran Tukaram Sonawane",
    epicNumber: "WXE9102456",
    boothNumber: 107,
    locality: "Paud Phata, Kothrud",
    karyakartaId: "kar-103",
    karyakartaName: "Ramesh M. More",
    karyakartaPhone: "+91 98220 54321",
    field: "Wrong Booth Linkage",
    currentValue: "Booth 107 (Paud Phata)",
    proposedValue: "Booth 106 (Erandwane)",
    updatedFields: [
      { field: "boothNumber", label: "Booth Allocation", oldValue: "107", newValue: "106" },
      { field: "pollingStation", label: "Polling Station", oldValue: "Kothrud Stand High School", newValue: "Erandwane Samaj Mandir" },
    ],
    reason: "Voter residence physically falls under Booth 106 boundary. Incorrectly entered in 107 in draft roll.",
    requestedAt: "2024-04-13 04:10 PM",
    status: "REJECTED",
    rejectionReason: "Booth boundary re-allocation requires Form 8 submission with ECI BLO sign-off. Cannot be altered unilaterally via candidate field app.",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-13 05:20 PM",
  },
];

export const SYSTEM_MODULES = [
  { id: "DASHBOARD", name: "War Room Dashboard" },
  { id: "VOTER_SEARCH", name: "Total Voters & Search" },
  { id: "SURVEY", name: "Field Survey Entry" },
  { id: "SLIP_DISTRIBUTION", name: "Voter Slip Delivery & Print" },
  { id: "AI_ASSISTANT", name: "Indic AI Field Assistant Copilot" },
  { id: "OFFICE", name: "Office Grievance & Visitors" },
  { id: "CAMPAIGN", name: "Campaign Control & Broadcast" },
  { id: "REPORTS", name: "Analytical Reports Export" },
  { id: "LIVE_MAP", name: "Live Field Map" },
];

export const CONSTITUENCY_BOOTHS = [
  { boothNumber: 101, name: "Navbharat High School, Room 1" },
  { boothNumber: 102, name: "Navbharat High School, Room 2" },
  { boothNumber: 103, name: "Saraswati Vidya Mandir, Ground Flr" },
  { boothNumber: 104, name: "Saraswati Vidya Mandir, Room 4" },
  { boothNumber: 105, name: "Deccan Gymkhana Pavilion Hall" },
  { boothNumber: 106, name: "Erandwane Samaj Mandir" },
  { boothNumber: 107, name: "Kothrud Stand Municipal School" },
  { boothNumber: 108, name: "Dahanukar Colony Primary School" },
];

// ============================================================================
// MAIN COMPONENT & SUBVIEW ORCHESTRATION
// ============================================================================

export interface KaryakartaWorkforceViewProps {
  initialSubView?: WorkforceSubView;
}

export function KaryakartaWorkforceView({ initialSubView }: KaryakartaWorkforceViewProps) {
  const pathname = usePathname();

  // Determine initial subView from URL or props
  const resolvedInitialSubView = useMemo<WorkforceSubView>(() => {
    if (initialSubView) return initialSubView;
    if (pathname.includes("/users/dashboard")) return "dashboard";
    if (pathname.includes("/users/add")) return "users-add";
    if (pathname.includes("/users/all")) return "users-all";
    if (pathname.includes("/members") || pathname.includes("/karyakartas")) return "members";
    if (pathname.includes("/requests") || pathname.includes("/update-requests")) return "update-requests";
    if (pathname.endsWith("/users") || pathname.endsWith("/users/")) return "dashboard";
    return "dashboard";
  }, [pathname, initialSubView]);

  const [subView, setSubView] = useState<WorkforceSubView>(resolvedInitialSubView);

  // Sync state if pathname changes
  useEffect(() => {
    if (pathname.includes("/users/dashboard")) setSubView("dashboard");
    else if (pathname.includes("/users/add")) setSubView("users-add");
    else if (pathname.includes("/users/all")) setSubView("users-all");
    else if (pathname.includes("/members") || pathname.includes("/karyakartas")) setSubView("members");
    else if (pathname.includes("/requests") || pathname.includes("/update-requests")) setSubView("update-requests");
    else if (pathname.endsWith("/users") || pathname.endsWith("/users/")) setSubView("dashboard");
  }, [pathname]);

  // Master State
  const [users, setUsers] = useState<PortalUser[]>(SEED_PORTAL_USERS);
  const [karyakartas, setKaryakartas] = useState<KaryakartaCadre[]>(SEED_KARYAKARTAS);
  const [updateRequests, setUpdateRequests] = useState<VoterUpdateRequest[]>(SEED_UPDATE_REQUESTS);

  // Filter requests when user clicks "View Updates" from worker table
  const [selectedWorkerFilter, setSelectedWorkerFilter] = useState<string>("ALL");

  return (
    <div className="space-y-6 animate-fade-in">
      {subView === "dashboard" && (
        <UsersDashboardView
          users={users}
          karyakartas={karyakartas}
          updateRequests={updateRequests}
          onNavigate={(target) => setSubView(target)}
        />
      )}

      {subView === "users-all" && (
        <AllUsersView
          users={users}
          setUsers={setUsers}
          onNavigateToAdd={() => setSubView("users-add")}
        />
      )}

      {subView === "users-add" && (
        <AddUserView
          onBack={() => setSubView("users-all")}
          onUserCreated={(newUser) => {
            setUsers((prev) => [newUser, ...prev]);
            setSubView("users-all");
          }}
        />
      )}

      {subView === "members" && (
        <MembersRosterView
          karyakartas={karyakartas}
          setKaryakartas={setKaryakartas}
        />
      )}

      {subView === "update-requests" && (
        <UpdateRequestsView
          updateRequests={updateRequests}
          setUpdateRequests={setUpdateRequests}
          karyakartas={karyakartas}
          workerFilter={selectedWorkerFilter}
          setWorkerFilter={setSelectedWorkerFilter}
        />
      )}
    </div>
  );
}

// ============================================================================
// 1. USER DASHBOARD (Users & Karyakarta Command)
// ============================================================================

interface UsersDashboardViewProps {
  users: PortalUser[];
  karyakartas: KaryakartaCadre[];
  updateRequests: VoterUpdateRequest[];
  onNavigate: (view: WorkforceSubView) => void;
}

function UsersDashboardView({
  users,
  karyakartas,
  updateRequests,
  onNavigate,
}: UsersDashboardViewProps) {
  const pendingRequestsCount = updateRequests.filter((r) => r.status === "PENDING").length;
  const pendingCadreCount = karyakartas.filter((k) => k.status === "PENDING").length;
  const onlineCadreCount = karyakartas.filter((k) => k.isOnline).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Workforce Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Grassroots Cadre
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Users &amp; Karyakarta Command
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational oversight across election war room staff, prabhaag coordinators, and field karyakartas.
          </p>
        </div>
        <button
          onClick={() => onNavigate("users-add")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          onClick={() => onNavigate("users-all")}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Users
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Admins, in-charges &amp; operators</p>
        </div>

        {/* Field Karyakartas */}
        <div
          onClick={() => onNavigate("members")}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Field Karyakartas
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{karyakartas.length}</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">
            {onlineCadreCount} Active on Field now
          </p>
        </div>

        {/* Update Requests */}
        <div
          onClick={() => onNavigate("update-requests")}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Update Requests
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingRequestsCount}</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Requires approval</p>
        </div>

        {/* Pending Onboarding */}
        <div
          onClick={() => onNavigate("members")}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pending Onboarding
          </span>
          <p className="text-2xl font-black text-purple-600 mt-1">{pendingCadreCount}</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            Awaiting registration clearance
          </p>
        </div>
      </div>

      {/* Role Distribution & Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Role Distribution & Permissions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Role Distribution &amp; Permissions</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">Candidate Super Admin</span>
                <span className="text-slate-500 text-[11px]">
                  Full platform sovereignty and export clearance
                </span>
              </div>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">1 User</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">War Room Head</span>
                <span className="text-slate-500 text-[11px]">
                  Dashboard, campaign dispatch, and strategy bot access
                </span>
              </div>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">1 User</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">Prabhaag Incharges</span>
                <span className="text-slate-500 text-[11px]">
                  Prabhaag ward coordination and ticket resolution
                </span>
              </div>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">1 User</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">Booth Karyakartas</span>
                <span className="text-slate-500 text-[11px]">
                  Door-to-door survey, voter slips, and ground mobilization
                </span>
              </div>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">6 Assigned</span>
            </div>
          </div>
        </div>

        {/* Right: Workforce Management Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Workforce Management Shortcuts</h3>
            <p className="text-xs text-slate-500 mb-4">Quick links to core team workflows.</p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate("members")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 block">Review Karyakarta Roster</span>
                  <span className="text-slate-500 text-[11px]">
                    Approve new signups &amp; survey progress metrics
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate("update-requests")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 block">Inspect Profile Update Requests</span>
                  <span className="text-slate-500 text-[11px]">
                    Side-by-side verification of phone, booth changes
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate("users-add")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 block">Provision New User Account</span>
                  <span className="text-slate-500 text-[11px]">
                    Assign booth range and module permissions
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. ALL USERS VIEW (All Portal Users)
// ============================================================================

interface AllUsersViewProps {
  users: PortalUser[];
  setUsers: React.Dispatch<React.SetStateAction<PortalUser[]>>;
  onNavigateToAdd: () => void;
}

function AllUsersView({ users, setUsers, onNavigateToAdd }: AllUsersViewProps) {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState<PortalUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm);
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          showToast("info", "User Status Updated", `User ${u.name} status updated to ${newStatus}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleSaveUserDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
    showToast("success", "Settings Saved", `User settings for ${editingUser.name} saved successfully.`);
    setEditingUser(null);
  };

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "CANDIDATE_ADMIN").length,
      incharges: users.filter((u) => u.role === "PRABHAAG_INCHARGE").length,
      karyakartas: users.filter((u) => u.role === "KARYAKARTA").length,
      operators: users.filter((u) => u.role === "DATA_OPERATOR").length,
    };
  }, [users]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              System Administration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Access Governance
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">All Portal Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage administrative credentials, role hierarchies, assigned booths, and module rights.
          </p>
        </div>
        <button
          onClick={onNavigateToAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* 5 KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Users</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{stats.total}</span>
          <span className="text-[10px] text-blue-600 font-semibold">Active Directory</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Candidate Admins</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{stats.admins}</span>
          <span className="text-[10px] text-indigo-600 font-semibold">Full Privileges</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Prabhaag Incharges</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{stats.incharges}</span>
          <span className="text-[10px] text-teal-600 font-semibold">Ward Supervisors</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Karyakartas</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{stats.karyakartas}</span>
          <span className="text-[10px] text-blue-600 font-semibold">Field Operators</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Data Operators</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{stats.operators}</span>
          <span className="text-[10px] text-amber-600 font-semibold">Roll Viewers</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
        <div className="w-full sm:w-60">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="CANDIDATE_ADMIN">Candidate Admin</option>
            <option value="WAR_ROOM_HEAD">War Room Head</option>
            <option value="PRABHAAG_INCHARGE">Prabhaag Incharge</option>
            <option value="KARYAKARTA">Karyakarta</option>
            <option value="DATA_OPERATOR">Data Operator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Constituency</th>
                <th className="py-3 px-4">Booth Number</th>
                <th className="py-3 px-4">Serial Number</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{u.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-blue-700 block">{u.role.replace("_", " ")}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-800 font-medium block">{u.prabhaag || "215 - Kasba Peth"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-medium text-slate-800">
                      {u.assignedBooths?.length
                        ? `Booths: ${u.assignedBooths.join(", ")}`
                        : "None"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-700 font-medium">
                      {u.voterSerialRange || "Full Roll Range"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {u.modulePermissions.includes("ALL")
                        ? "All Modules (Unrestricted)"
                        : `${u.modulePermissions.length} Modules`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.canImportData ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {u.canImportData ? "Allowed" : "Restricted"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        u.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : u.status === "PENDING"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : u.status === "BLOCKED"
                          ? "bg-rose-100 text-rose-800 hover:bg-rose-200"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditingUser({ ...u })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Side-Drawer / Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                  {editingUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{editingUser.name}</h3>
                  <span className="text-xs text-blue-600 font-semibold">
                    {editingUser.role.replace("_", " ")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserDetails} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CANDIDATE_ADMIN">Candidate Admin</option>
                    <option value="WAR_ROOM_HEAD">War Room Head</option>
                    <option value="PRABHAAG_INCHARGE">Prabhaag Incharge</option>
                    <option value="KARYAKARTA">Karyakarta</option>
                    <option value="DATA_OPERATOR">Data Operator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as "ACTIVE" | "INACTIVE" | "PENDING" | "BLOCKED",
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prabhaag / Ward Jurisdiction</label>
                <input
                  type="text"
                  value={editingUser.prabhaag || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, prabhaag: e.target.value })}
                  placeholder="e.g. Prabhaag 12 - Kothrud West"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Polling Booth Numbers (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingUser.assignedBooths?.join(", ") || ""}
                  onChange={(e) => {
                    const booths = e.target.value
                      .split(",")
                      .map((val) => parseInt(val.trim()))
                      .filter((val) => !isNaN(val));
                    setEditingUser({ ...editingUser, assignedBooths: booths });
                  }}
                  placeholder="101, 102"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Voter Roll Serial Range</label>
                <input
                  type="text"
                  value={editingUser.voterSerialRange || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, voterSerialRange: e.target.value })}
                  placeholder="e.g. 1 to 500"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-700 mb-2">Data Import Policy</label>
                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.canImportData}
                    onChange={(e) => setEditingUser({ ...editingUser, canImportData: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-800">
                    Allow Voter &amp; Contact CSV Import Access
                  </span>
                </label>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p>
                  User ID: <span className="font-mono text-slate-700">{editingUser.id}</span>
                </p>
                <p>Last Active: {editingUser.lastActive || "Today"}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. PROVISION NEW USER VIEW (+ Add User)
// ============================================================================

interface AddUserViewProps {
  onBack: () => void;
  onUserCreated: (newUser: PortalUser) => void;
}

function AddUserView({ onBack, onUserCreated }: AddUserViewProps) {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    loginPassword: "Password@2024",
    role: "KARYAKARTA" as UserRole,
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [101],
    voterSerialRange: "1 to 250",
    modulePermissions: ["VOTER_SEARCH", "SURVEY", "SLIP_DISTRIBUTION", "AI_ASSISTANT"],
    canImportData: false,
  });

  const toggleBooth = (boothNo: number) => {
    setForm((prev) => ({
      ...prev,
      assignedBooths: prev.assignedBooths.includes(boothNo)
        ? prev.assignedBooths.filter((b) => b !== boothNo)
        : [...prev.assignedBooths, boothNo],
    }));
  };

  const togglePermission = (modId: string) => {
    setForm((prev) => ({
      ...prev,
      modulePermissions: prev.modulePermissions.includes(modId)
        ? prev.modulePermissions.filter((m) => m !== modId)
        : [...prev.modulePermissions, modId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      showToast("error", "Validation Error", "Please fill in required fields (Name and Phone).");
      return;
    }

    const created: PortalUser = {
      id: "usr-" + Math.floor(10 + Math.random() * 90),
      name: form.name.trim(),
      email: form.email.trim() || "user@indata-election.in",
      phone: form.phone.trim(),
      role: form.role,
      status: "ACTIVE",
      prabhaag: form.prabhaag,
      assignedBooths: form.assignedBooths,
      voterSerialRange: form.voterSerialRange,
      modulePermissions: form.modulePermissions,
      canImportData: form.canImportData,
      lastActive: "Just now",
    };

    showToast("success", "Account Created", `User ${created.name} successfully registered with ${created.role} role.`);
    onUserCreated(created);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Users</span>
        </button>
        <span className="text-xs font-semibold text-slate-400">User Account Provisioning</span>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Dark Header */}
        <div className="bg-slate-950 p-6 text-white border-b border-slate-800">
          <h1 className="text-xl font-black">Provision New Portal User</h1>
          <p className="text-xs text-blue-200 mt-1">
            Assign credentials, jurisdiction, booth boundaries, and security permissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-xs">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Personal &amp; Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Shankar Jadhav"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="user@indata-election.in"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              2. Role &amp; Organizational Jurisdiction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="KARYAKARTA">Karyakarta (Field Mobilizer)</option>
                  <option value="BOOTH_ADHYAKSH">Booth Adhyaksh (Booth Chief)</option>
                  <option value="PRABHAAG_INCHARGE">Prabhaag Incharge (Ward Coordinator)</option>
                  <option value="WAR_ROOM_HEAD">War Room Head</option>
                  <option value="DATA_OPERATOR">Data Operator</option>
                  <option value="CANDIDATE_ADMIN">Candidate Admin</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Prabhaag / Ward</label>
                <input
                  type="text"
                  value={form.prabhaag}
                  onChange={(e) => setForm({ ...form, prabhaag: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Booths Toggle Chips */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Allot Polling Booths (Click to toggle)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONSTITUENCY_BOOTHS.map((b) => {
                  const isSelected = form.assignedBooths.includes(b.boothNumber);
                  return (
                    <div
                      key={b.boothNumber}
                      onClick={() => toggleBooth(b.boothNumber)}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-500 text-blue-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>Booth #{b.boothNumber}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Voter Serial Number Range (for Door-to-Door Slip Distribution)
              </label>
              <input
                type="text"
                placeholder="e.g. 1 to 250 or Part 101: 50-150"
                value={form.voterSerialRange}
                onChange={(e) => setForm({ ...form, voterSerialRange: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              3. Module Rights &amp; Security Policies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SYSTEM_MODULES.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.modulePermissions.includes(m.id)}
                    onChange={() => togglePermission(m.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-700">{m.name}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-amber-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.canImportData}
                  onChange={(e) => setForm({ ...form, canImportData: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Grant Electoral Roll Data Import Access
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Allows uploading voter CSVs or modifying electoral boundary definitions. Keep disabled for field karyakartas.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Create User Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MEMBERS & KARYAKARTAS ROSTER VIEW
// ============================================================================

interface MembersRosterViewProps {
  karyakartas: KaryakartaCadre[];
  setKaryakartas: React.Dispatch<React.SetStateAction<KaryakartaCadre[]>>;
}

function MembersRosterView({ karyakartas, setKaryakartas }: MembersRosterViewProps) {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return karyakartas.filter((k) => {
      const matchesSearch =
        k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.phone.includes(searchTerm) ||
        k.prabhaag.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || k.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [karyakartas, searchTerm, statusFilter]);

  const handleApprove = (id: string, name: string) => {
    setKaryakartas((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "APPROVED" as const } : k))
    );
    showToast("success", "Karyakarta Approved", `Karyakarta ${name} approved and granted mobile app access.`);
  };

  const handleReject = (id: string, name: string) => {
    setKaryakartas((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "REJECTED" as const } : k))
    );
    showToast("error", "Request Rejected", `Registration request for ${name} rejected.`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Field Cadre Directory
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Grassroots Mobilizers
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Members &amp; Karyakartas Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor ground surveys completed, voter slips delivered, and approve new karyakarta signups.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
            Total Cadre: {karyakartas.length}
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            Pending Approval: {karyakartas.filter((k) => k.status === "PENDING").length}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search karyakarta name, phone, or ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
        <div className="w-full sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved Active</option>
            <option value="PENDING">Pending Verification</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Karyakarta Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Prabhaag &amp; Assigned Booth</th>
                <th className="py-3 px-4">Surveys Done</th>
                <th className="py-3 px-4">Slips Delivered</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {k.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{k.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              k.isOnline ? "bg-blue-500" : "bg-slate-300"
                            }`}
                          />
                          <span className="text-[10px] text-slate-400">
                            {k.isOnline ? "Online on Field" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">{k.phone}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">Booth #{k.assignedBooth}</span>
                    <span className="text-[11px] text-slate-500">{k.prabhaag}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>{k.surveysCompleted}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Printer className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{k.voterSlipsDelivered}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        k.status === "APPROVED"
                          ? "bg-blue-100 text-blue-800"
                          : k.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {k.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(k.id, k.name)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(k.id, k.name)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Verified Cadre</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. VOTER UPDATE REQUESTS & FIELD VERIFICATION VIEW
// ============================================================================

interface UpdateRequestsViewProps {
  updateRequests: VoterUpdateRequest[];
  setUpdateRequests: React.Dispatch<React.SetStateAction<VoterUpdateRequest[]>>;
  karyakartas: KaryakartaCadre[];
  workerFilter: string;
  setWorkerFilter: (worker: string) => void;
}

function UpdateRequestsView({
  updateRequests,
  setUpdateRequests,
  karyakartas,
  workerFilter,
  setWorkerFilter,
}: UpdateRequestsViewProps) {
  const { showToast } = useToast();

  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [boothFilter, setBoothFilter] = useState("ALL");
  const [updateTypeFilter, setUpdateTypeFilter] = useState("ALL");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewDrawerReq, setReviewDrawerReq] = useState<VoterUpdateRequest | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReasonText, setRejectionReasonText] = useState("");

  // Counts
  const stats = useMemo(
    () => ({
      total: updateRequests.length,
      pending: updateRequests.filter((r) => r.status === "PENDING").length,
      approved: updateRequests.filter((r) => r.status === "APPROVED").length,
      rejected: updateRequests.filter((r) => r.status === "REJECTED").length,
      failed: updateRequests.filter((r) => r.status === "SYNC_FAILED").length,
    }),
    [updateRequests]
  );

  // Field worker activity ledger
  const workerAggregates = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        phone: string;
        assignedBooth: number;
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        failed: number;
        lastDate: string;
      }
    >();

    karyakartas.forEach((k) => {
      map.set(k.name, {
        id: k.id,
        name: k.name,
        phone: k.phone,
        assignedBooth: k.assignedBooth,
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        failed: 0,
        lastDate: "—",
      });
    });

    updateRequests.forEach((req) => {
      let entry = map.get(req.karyakartaName);
      if (!entry) {
        entry = {
          id: req.karyakartaId,
          name: req.karyakartaName,
          phone: req.karyakartaPhone || "—",
          assignedBooth: req.boothNumber || 101,
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          failed: 0,
          lastDate: req.requestedAt,
        };
        map.set(req.karyakartaName, entry);
      }
      entry.total += 1;
      if (req.status === "PENDING") entry.pending += 1;
      else if (req.status === "APPROVED") entry.approved += 1;
      else if (req.status === "REJECTED") entry.rejected += 1;
      else if (req.status === "SYNC_FAILED") entry.failed += 1;

      if (req.requestedAt > entry.lastDate || entry.lastDate === "—") {
        entry.lastDate = req.requestedAt;
      }
    });

    return Array.from(map.values()).filter((e) => e.total > 0);
  }, [karyakartas, updateRequests]);

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return updateRequests.filter((req) => {
      if (statusTab !== "ALL" && req.status !== statusTab) return false;
      if (workerFilter !== "ALL" && req.karyakartaName !== workerFilter) return false;
      if (boothFilter !== "ALL" && req.boothNumber !== Number(boothFilter)) return false;

      if (updateTypeFilter !== "ALL") {
        const matchesType =
          req.updatedFields?.some(
            (f) =>
              f.field.toLowerCase().includes(updateTypeFilter.toLowerCase()) ||
              f.label.toLowerCase().includes(updateTypeFilter.toLowerCase())
          ) || req.field?.toLowerCase().includes(updateTypeFilter.toLowerCase());
        if (!matchesType) return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          req.voterName?.toLowerCase().includes(q) ||
          req.epicNumber?.toLowerCase().includes(q) ||
          req.id.toLowerCase().includes(q) ||
          req.karyakartaName.toLowerCase().includes(q) ||
          req.locality?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [updateRequests, statusTab, workerFilter, boothFilter, updateTypeFilter, searchTerm]);

  // Actions
  const handleApprove = (id: string, voterName?: string) => {
    setUpdateRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "APPROVED" as const,
              reviewedBy: "Anand Shinde (Admin)",
              reviewedAt: new Date().toLocaleString(),
            }
          : r
      )
    );
    if (reviewDrawerReq?.id === id) setReviewDrawerReq(null);
    showToast("success", "Update Approved", `Approved update for ${voterName || "voter"}. Synchronized into primary voter registry.`);
  };

  const handleConfirmReject = () => {
    if (!reviewDrawerReq) return;
    if (!rejectionReasonText.trim()) {
      showToast("error", "Reason Required", "Please provide a reason for rejection.");
      return;
    }

    setUpdateRequests((prev) =>
      prev.map((r) =>
        r.id === reviewDrawerReq.id
          ? {
              ...r,
              status: "REJECTED" as const,
              rejectionReason: rejectionReasonText.trim(),
              reviewedBy: "Anand Shinde (Admin)",
              reviewedAt: new Date().toLocaleString(),
            }
          : r
      )
    );
    showToast("info", "Update Rejected", `Rejected update request ${reviewDrawerReq.id}.`);
    setIsRejectModalOpen(false);
    setRejectionReasonText("");
    setReviewDrawerReq(null);
  };

  const handleRetrySync = (id: string) => {
    setUpdateRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "APPROVED" as const,
              reviewedBy: "Anand Shinde (Admin - Auto Synced)",
              reviewedAt: new Date().toLocaleString(),
              syncError: undefined,
            }
          : r
      )
    );
    showToast("success", "Sync Restored", `Sync successfully re-established for request ${id}. Main roll committed.`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRequests.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    setUpdateRequests((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id)
          ? {
              ...r,
              status: "APPROVED" as const,
              reviewedBy: "Anand Shinde (Admin - Bulk)",
              reviewedAt: new Date().toLocaleString(),
            }
          : r
      )
    );
    showToast("success", "Bulk Updates Approved", `Successfully approved ${selectedIds.length} update requests.`);
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    setUpdateRequests((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id)
          ? {
              ...r,
              status: "REJECTED" as const,
              rejectionReason: "Bulk rejected by Administrator during batch audit review.",
              reviewedBy: "Anand Shinde (Admin - Bulk)",
              reviewedAt: new Date().toLocaleString(),
            }
          : r
      )
    );
    showToast("info", "Bulk Updates Rejected", `Rejected ${selectedIds.length} update requests.`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Users &amp; Field Operations
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-blue-600">Voter Update Requests</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 ml-1">
              Pre-Commit Moderation
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Voter Update Requests &amp; Field Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Review changes collected on-ground by Karyakartas. Verified updates synchronize directly into the primary voter roll without disrupting electoral baseline integrity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setUpdateRequests(SEED_UPDATE_REQUESTS);
              setSelectedIds([]);
              showToast("info", "Queue Refreshed", "Refreshed latest incoming voter update queue.");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Queue
          </button>
          <button
            onClick={() => showToast("info", "Exporting...", "Exporting update audit ledger to Excel...")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Log
          </button>
        </div>
      </div>

      {/* 5 KPI Request Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total */}
        <div
          onClick={() => setStatusTab("ALL")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusTab === "ALL"
              ? "bg-blue-50/70 border-blue-300 shadow-xs ring-1 ring-blue-400/30"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Requests
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.total.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>From 5 Field Workers</span>
          </div>
        </div>

        {/* Pending Review */}
        <div
          onClick={() => setStatusTab("PENDING")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusTab === "PENDING"
              ? "bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-400/30"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Pending Review
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{stats.pending}</div>
          <div className="text-[11px] text-amber-700/80 mt-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Awaiting Admin Action</span>
          </div>
        </div>

        {/* Approved */}
        <div
          onClick={() => setStatusTab("APPROVED")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusTab === "APPROVED"
              ? "bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-500/30"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Approved</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700 mt-2">{stats.approved}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>Committed to Voter Roll</span>
          </div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => setStatusTab("REJECTED")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusTab === "REJECTED"
              ? "bg-rose-50/70 border-rose-300 shadow-xs ring-1 ring-rose-400/30"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Rejected</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{stats.rejected}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>Audited &amp; Discarded</span>
          </div>
        </div>

        {/* Failed to Sync */}
        <div
          onClick={() => setStatusTab("SYNC_FAILED")}
          className={`cursor-pointer p-4 rounded-2xl border col-span-2 sm:col-span-1 transition-all ${
            statusTab === "SYNC_FAILED"
              ? "bg-rose-100/70 border-rose-400 shadow-xs ring-1 ring-rose-500/30"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Failed to Sync</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">{stats.failed}</div>
          <div className="text-[11px] text-rose-700 mt-1 flex items-center gap-1 font-semibold">
            <span>Needs Re-attempt</span>
          </div>
        </div>
      </div>

      {/* Field Worker Activity & Submission Volume */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Field Worker Activity &amp; Submission Volume
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live submission breakdown by Karyakartas. Click &quot;Filter Requests&quot; to isolate submissions from a single worker.
            </p>
          </div>
          {workerFilter !== "ALL" && (
            <button
              onClick={() => setWorkerFilter("ALL")}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Clear Worker Filter ({workerFilter})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3">Field Worker</th>
                <th className="py-2.5 px-3">User ID</th>
                <th className="py-2.5 px-3">Assigned Booth</th>
                <th className="py-2.5 px-3 text-center">Total Submitted</th>
                <th className="py-2.5 px-3 text-center">Pending</th>
                <th className="py-2.5 px-3 text-center">Approved</th>
                <th className="py-2.5 px-3 text-center">Rejected</th>
                <th className="py-2.5 px-3">Last Submission</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {workerAggregates.map((w) => {
                const isSelected = workerFilter === w.name;
                return (
                  <tr
                    key={w.id}
                    className={`transition-colors ${
                      isSelected ? "bg-blue-50/70" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{w.name}</div>
                          <div className="text-[10px] text-slate-500">{w.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{w.id}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        Booth #{w.assignedBooth}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{w.total}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">
                        {w.pending}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px]">
                        {w.approved}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
                        {w.rejected}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{w.lastDate}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setWorkerFilter(isSelected ? "ALL" : w.name)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        {isSelected ? "Viewing" : "View Updates"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All Requests", count: stats.total },
              { id: "PENDING", label: "Pending Review", count: stats.pending, alert: stats.pending > 0 },
              { id: "APPROVED", label: "Approved", count: stats.approved },
              { id: "REJECTED", label: "Rejected", count: stats.rejected },
              { id: "SYNC_FAILED", label: "Sync Failed", count: stats.failed, alert: stats.failed > 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusTab === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    statusTab === tab.id
                      ? "bg-white/20 text-white"
                      : tab.alert
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredRequests.length}</span> of{" "}
            {updateRequests.length} requests
          </div>
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by voter name, EPIC ID, request ID, phone, locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={workerFilter}
              onChange={(e) => setWorkerFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Field Workers</option>
              {workerAggregates.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name} ({w.total} reqs)
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={boothFilter}
              onChange={(e) => setBoothFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Booths</option>
              <option value="101">Booth #101 (Navbharat School)</option>
              <option value="102">Booth #102 (Ganesh Krupa)</option>
              <option value="103">Booth #103 (Swapnanagari)</option>
              <option value="104">Booth #104 (Karve Nagar)</option>
              <option value="105">Booth #105 (Prabhat Road)</option>
              <option value="106">Booth #106 (Erandwane Gaothan)</option>
              <option value="107">Booth #107 (Shiv Plaza)</option>
              <option value="108">Booth #108 (Deccan)</option>
            </select>
          </div>

          <div>
            <select
              value={updateTypeFilter}
              onChange={(e) => setUpdateTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Update Types</option>
              <option value="mobile">Mobile Number</option>
              <option value="address">Address / House No</option>
              <option value="outside">Relocated / Outside</option>
              <option value="deceased">Deceased Marker</option>
              <option value="influence">Influencer Tagging</option>
              <option value="scheme">Government Scheme</option>
              <option value="age">Age / DOB</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Header */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold text-slate-900">Update Requests Selected</span>
              <span className="text-xs text-slate-500">
                (Choose a bulk action to process simultaneously)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
              >
                <Check className="w-3.5 h-3.5" />
                Bulk Accept ({selectedIds.length})
              </button>
              <button
                onClick={handleBulkReject}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              >
                <X className="w-3.5 h-3.5" />
                Bulk Reject ({selectedIds.length})
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredRequests.length > 0 && selectedIds.length === filteredRequests.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="py-3 px-3">Req ID</th>
                  <th className="py-3 px-3">Voter Name &amp; EPIC</th>
                  <th className="py-3 px-3">Booth</th>
                  <th className="py-3 px-3">Field Worker</th>
                  <th className="py-3 px-3">Proposed Field Changes</th>
                  <th className="py-3 px-3">Requested At</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-sm">No update requests match the selected filters.</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Try clearing the worker, booth or search criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const isSelected = selectedIds.includes(req.id);
                    return (
                      <tr
                        key={req.id}
                        className={`transition-colors ${
                          isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/70"
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(req.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-600">
                          {req.id}
                          {req.hasConflict && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-sans font-bold mt-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              Conflict
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 text-xs">
                            {req.voterName || "Unnamed Voter"}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 font-mono">
                            <span>{req.epicNumber || "EPIC N/A"}</span>
                            {req.locality && (
                              <>
                                <span>•</span>
                                <span className="font-sans text-[10px] truncate max-w-[150px]">
                                  {req.locality}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            #{req.boothNumber || 101}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 text-xs">{req.karyakartaName}</div>
                          <div className="text-[10px] text-slate-500">{req.karyakartaId}</div>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {req.updatedFields && req.updatedFields.length > 0 ? (
                              req.updatedFields.map((f, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    f.isNew
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "bg-amber-50 text-amber-800 border border-amber-200"
                                  }`}
                                >
                                  {f.label}: {f.newValue}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-600 font-medium">
                                {req.field}: {req.proposedValue}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                          {req.requestedAt}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {req.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3" />
                              Pending Review
                            </span>
                          )}
                          {req.status === "APPROVED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved &amp; Synced
                            </span>
                          )}
                          {req.status === "REJECTED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                          {req.status === "SYNC_FAILED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                              <AlertTriangle className="w-3 h-3" />
                              Sync Failed
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status === "PENDING" ? (
                              <>
                                <button
                                  onClick={() => handleApprove(req.id, req.voterName)}
                                  title="Accept Update"
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setReviewDrawerReq(req);
                                    setIsRejectModalOpen(true);
                                  }}
                                  title="Reject Update"
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : req.status === "SYNC_FAILED" ? (
                              <button
                                onClick={() => handleRetrySync(req.id)}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition"
                              >
                                Retry Sync
                              </button>
                            ) : null}

                            <button
                              onClick={() => setReviewDrawerReq(req)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                            >
                              <Eye className="w-3 h-3" />
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side-by-Side Voter Diff Review Drawer */}
      {reviewDrawerReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-slide-left">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600">
                    {reviewDrawerReq.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      reviewDrawerReq.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : reviewDrawerReq.status === "APPROVED"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : reviewDrawerReq.status === "REJECTED"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {reviewDrawerReq.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Side-by-Side Voter Diff Review
                </h3>
              </div>
              <button
                onClick={() => setReviewDrawerReq(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conflict Alert Banner */}
            {reviewDrawerReq.hasConflict && (
              <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800">
                    Conflict / Duplicate Submission Detected
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {reviewDrawerReq.conflictNote ||
                      "Another field worker previously submitted updates for this voter. Please verify conflicting field values carefully before committing."}
                  </p>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Voter & Worker Metadata Cards */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Target Voter Record
                  </span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {reviewDrawerReq.voterName || "Unnamed Voter"}
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    EPIC: {reviewDrawerReq.epicNumber || "N/A"} • Booth #{reviewDrawerReq.boothNumber || 101}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{reviewDrawerReq.locality}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Submitted By Field Worker
                  </span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {reviewDrawerReq.karyakartaName}
                  </div>
                  <div className="text-xs text-slate-500">
                    ID: {reviewDrawerReq.karyakartaId} • {reviewDrawerReq.karyakartaPhone || "+91 98224 44001"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Submitted: {reviewDrawerReq.requestedAt}
                  </div>
                </div>
              </div>

              {/* Differences List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Field-Level Differences
                  </h4>
                  <span className="text-[11px] text-slate-400">Unchanged fields omitted from view</span>
                </div>

                <div className="space-y-3">
                  {reviewDrawerReq.updatedFields && reviewDrawerReq.updatedFields.length > 0 ? (
                    reviewDrawerReq.updatedFields.map((f, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 flex items-center justify-between">
                          <span>{f.label}</span>
                          {f.isNew && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700">
                              NEW ENTRY
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 text-xs divide-x divide-slate-200">
                          <div className="p-3 bg-slate-50/50">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Current in Primary Roll
                            </span>
                            <div className="font-medium text-slate-600 line-through decoration-slate-400">
                              {f.oldValue || "— None —"}
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50/40">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                              Proposed by Worker
                            </span>
                            <div className="font-bold text-blue-950">{f.newValue}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700">
                        {reviewDrawerReq.field}
                      </div>
                      <div className="grid grid-cols-2 text-xs divide-x divide-slate-200">
                        <div className="p-3 bg-slate-50/50">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Current Value
                          </span>
                          <div className="font-medium text-slate-600">{reviewDrawerReq.currentValue}</div>
                        </div>
                        <div className="p-3 bg-blue-50/40">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                            Proposed Value
                          </span>
                          <div className="font-bold text-blue-950">{reviewDrawerReq.proposedValue}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Justification Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Karyakarta Verification Justification
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  &quot;{reviewDrawerReq.reason}&quot;
                </p>
              </div>

              {/* Audit History (if reviewed) */}
              {reviewDrawerReq.reviewedBy && (
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                    Audit Review History
                  </span>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">Reviewed By:</span> {reviewDrawerReq.reviewedBy} on{" "}
                    {reviewDrawerReq.reviewedAt}
                  </div>
                  {reviewDrawerReq.rejectionReason && (
                    <div className="text-xs text-rose-700 mt-1">
                      <span className="font-bold">Rejection Reason:</span>{" "}
                      {reviewDrawerReq.rejectionReason}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setReviewDrawerReq(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
              >
                Close Drawer
              </button>

              {reviewDrawerReq.status === "PENDING" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                  >
                    <X className="w-4 h-4" />
                    Reject Update
                  </button>
                  <button
                    onClick={() => handleApprove(reviewDrawerReq.id, reviewDrawerReq.voterName)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                  >
                    <Check className="w-4 h-4" />
                    Accept &amp; Commit into DB
                  </button>
                </div>
              ) : reviewDrawerReq.status === "SYNC_FAILED" ? (
                <button
                  onClick={() => handleRetrySync(reviewDrawerReq.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
                >
                  Retry Database Synchronization
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-semibold">
                  Record already archived as {reviewDrawerReq.status}.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Confirmation Modal */}
      {isRejectModalOpen && reviewDrawerReq && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                Reject Voter Update Request
              </h3>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide a clear reason for rejecting the update for{" "}
              <span className="font-bold text-slate-900">{reviewDrawerReq.voterName}</span>. This explanation will be logged and returned to Karyakarta{" "}
              <span className="font-bold text-slate-900">{reviewDrawerReq.karyakartaName}</span>.
            </p>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="e.g., Unverifiable Aadhaar copy, address falls outside assembly constituency..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
