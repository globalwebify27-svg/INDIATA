"use client";

import React, { useState } from "react";
import {
  MapPin,
  Printer,
  MessageSquare,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

// ============================================================================
// DATA MODELS & PRE-SEEDED CONSTITUENCY TELEMETRY DATA
// ============================================================================

export interface BoothItem {
  boothNumber: number;
  name: string;
  locality: string;
  prabhaag: string;
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  otherVoters: number;
  grade: "A" | "B" | "C" | "D";
  isSwing: boolean;
  isVulnerable: boolean;
  bloName: string;
  bloPhone: string;
  karyakartaCount: number;
  slipsDeliveredPercent: number;
  lastTurnoutPercent: number;
  projectedTurnoutPercent: number;
  supportLevel: "HIGH" | "MEDIUM" | "LOW";
  lat: number;
  lng: number;
}

export interface KaryakartaItem {
  id: string;
  name: string;
  phone: string;
  prabhaag: string;
  assignedBooth: number;
  surveysCompleted: number;
  voterSlipsDelivered: number;
  status: "APPROVED" | "PENDING";
  joinedDate: string;
  isOnline: boolean;
  currentLocation?: { lat: number; lng: number; label: string };
}

export interface IssueItem {
  id: string;
  visitorName: string;
  visitorPhone: string;
  visitorAddress: string;
  isLinkedVoter: boolean;
  voterEpic: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "RESOLVED" | "IN_PROGRESS";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface SlipDeliveryItem {
  id: string;
  voterName: string;
  epicNumber: string;
  boothNumber: number;
  prabhaag: string;
  slipType: "PRINTED_THERMAL" | "DIGITAL_WHATSAPP";
  deliveredBy: string;
  timestamp: string;
  status: "COMPLETED" | "PENDING";
  dateRange: "TODAY" | "LAST_3_DAYS" | "THIS_WEEK";
  mobile: string;
  x: number;
  y: number;
  notes: string;
}

// 8 Official Polling Stations
export const BOOTHS_DATA: BoothItem[] = [
  {
    boothNumber: 101,
    name: "Navbharat High School, Room 1",
    locality: "Kothrud Depot Road",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 1142,
    maleVoters: 590,
    femaleVoters: 552,
    otherVoters: 0,
    grade: "A",
    isSwing: false,
    isVulnerable: false,
    bloName: "Sanjay K. Kulkarni",
    bloPhone: "+91 98220 11234",
    karyakartaCount: 5,
    slipsDeliveredPercent: 92,
    lastTurnoutPercent: 68.4,
    projectedTurnoutPercent: 74,
    supportLevel: "HIGH",
    lat: 18.5074,
    lng: 73.8077,
  },
  {
    boothNumber: 102,
    name: "Navbharat High School, Room 2",
    locality: "Kothrud Depot Road",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 1205,
    maleVoters: 620,
    femaleVoters: 585,
    otherVoters: 0,
    grade: "A",
    isSwing: false,
    isVulnerable: false,
    bloName: "Asha V. More",
    bloPhone: "+91 98220 54321",
    karyakartaCount: 4,
    slipsDeliveredPercent: 88,
    lastTurnoutPercent: 65.2,
    projectedTurnoutPercent: 71.5,
    supportLevel: "HIGH",
    lat: 18.508,
    lng: 73.8085,
  },
  {
    boothNumber: 103,
    name: "Dr. Babasaheb Ambedkar Samaj Mandir",
    locality: "Paud Phata",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 980,
    maleVoters: 510,
    femaleVoters: 470,
    otherVoters: 0,
    grade: "B",
    isSwing: true,
    isVulnerable: false,
    bloName: "Rameshwar P. Mane",
    bloPhone: "+91 94220 98765",
    karyakartaCount: 3,
    slipsDeliveredPercent: 74,
    lastTurnoutPercent: 54.1,
    projectedTurnoutPercent: 66,
    supportLevel: "MEDIUM",
    lat: 18.5135,
    lng: 73.8164,
  },
  {
    boothNumber: 104,
    name: "Pune Municipal Primary School No. 18",
    locality: "Erandwane",
    prabhaag: "Prabhaag 13 - Erandwane",
    totalVoters: 1350,
    maleVoters: 710,
    femaleVoters: 640,
    otherVoters: 0,
    grade: "B",
    isSwing: true,
    isVulnerable: true,
    bloName: "Geeta N. Salunkhe",
    bloPhone: "+91 98901 23456",
    karyakartaCount: 6,
    slipsDeliveredPercent: 68,
    lastTurnoutPercent: 51.3,
    projectedTurnoutPercent: 63.8,
    supportLevel: "MEDIUM",
    lat: 18.5112,
    lng: 73.8321,
  },
  {
    boothNumber: 105,
    name: "Abasaheb Garware College, Hall B",
    locality: "Karve Road",
    prabhaag: "Prabhaag 13 - Erandwane",
    totalVoters: 1480,
    maleVoters: 790,
    femaleVoters: 690,
    otherVoters: 0,
    grade: "C",
    isSwing: true,
    isVulnerable: false,
    bloName: "Dattatraya Shinde",
    bloPhone: "+91 97632 11098",
    karyakartaCount: 3,
    slipsDeliveredPercent: 58,
    lastTurnoutPercent: 48.9,
    projectedTurnoutPercent: 58.2,
    supportLevel: "LOW",
    lat: 18.5148,
    lng: 73.836,
  },
  {
    boothNumber: 106,
    name: "Modern High School, Wing A",
    locality: "Shivajinagar Gaothan",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 1120,
    maleVoters: 580,
    femaleVoters: 540,
    otherVoters: 0,
    grade: "A",
    isSwing: false,
    isVulnerable: false,
    bloName: "Nitin B. Jagtap",
    bloPhone: "+91 98505 44321",
    karyakartaCount: 4,
    slipsDeliveredPercent: 85,
    lastTurnoutPercent: 69.1,
    projectedTurnoutPercent: 73.4,
    supportLevel: "HIGH",
    lat: 18.5284,
    lng: 73.8502,
  },
  {
    boothNumber: 107,
    name: "Ferguson Junior College Library",
    locality: "FC Road",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 1290,
    maleVoters: 670,
    femaleVoters: 620,
    otherVoters: 0,
    grade: "B",
    isSwing: true,
    isVulnerable: false,
    bloName: "Madhavi R. Joshi",
    bloPhone: "+91 98231 77654",
    karyakartaCount: 4,
    slipsDeliveredPercent: 71,
    lastTurnoutPercent: 58.3,
    projectedTurnoutPercent: 67,
    supportLevel: "MEDIUM",
    lat: 18.5228,
    lng: 73.8415,
  },
  {
    boothNumber: 108,
    name: "Gokhale Memorial Community Hall",
    locality: "Deccan Gymkhana",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 890,
    maleVoters: 450,
    femaleVoters: 440,
    otherVoters: 0,
    grade: "D",
    isSwing: true,
    isVulnerable: true,
    bloName: "Pravin S. Gaikwad",
    bloPhone: "+91 99224 88321",
    karyakartaCount: 2,
    slipsDeliveredPercent: 44,
    lastTurnoutPercent: 41.5,
    projectedTurnoutPercent: 52,
    supportLevel: "LOW",
    lat: 18.5181,
    lng: 73.8427,
  },
];

// 6 Active Field Karyakartas
export const KARYAKARTAS_DATA: KaryakartaItem[] = [
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

// 4 Civic Grievance Hotspots
export const ISSUES_DATA: IssueItem[] = [
  {
    id: "TKT-9210",
    visitorName: "Narayan Govind Joshi",
    visitorPhone: "+91 98220 33119",
    visitorAddress: "Plot 34, Dahanukar Colony, Kothrud",
    isLinkedVoter: true,
    voterEpic: "MH34091104",
    category: "Water Supply",
    priority: "HIGH",
    status: "OPEN",
    assignedTo: "Sachin Babar (Prabhaag Incharge)",
    createdAt: "2024-04-18 09:30 AM",
    updatedAt: "2024-04-18 10:00 AM",
    description: "Entire Dahanukar Colony Lane 3 has faced low municipal pressure for 5 straight days.",
  },
  {
    id: "TKT-9208",
    visitorName: "Shabana Begum Mansuri",
    visitorPhone: "+91 98220 77112",
    visitorAddress: "Near Kothrud Stand, Pune",
    isLinkedVoter: true,
    voterEpic: "MH34088921",
    category: "Pension",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    assignedTo: "Office Helpdesk (Sanjay Shinde)",
    createdAt: "2024-04-17 02:15 PM",
    updatedAt: "2024-04-18 08:30 AM",
    description: "Sanjay Gandhi Niradhar Yojana monthly pension not credited into bank for 3 months.",
  },
  {
    id: "TKT-9195",
    visitorName: "Mahesh Balkrishna Kadam",
    visitorPhone: "+91 98901 44550",
    visitorAddress: "Near Erandwane Fire Station Crossing",
    isLinkedVoter: true,
    voterEpic: "MH34077219",
    category: "Roads & Infrastructure",
    priority: "CRITICAL",
    status: "RESOLVED",
    assignedTo: "Sachin Babar",
    createdAt: "2024-04-15 11:00 AM",
    updatedAt: "2024-04-17 04:00 PM",
    description: "Deep pothole causing accidents near Erandwane fire station crossing.",
  },
  {
    id: "TKT-9180",
    visitorName: "Prakash Shridhar Deo",
    visitorPhone: "+91 98222 66778",
    visitorAddress: "Lane 5, Prabhat Road, Pune",
    isLinkedVoter: true,
    voterEpic: "MH34066512",
    category: "Electricity",
    priority: "HIGH",
    status: "OPEN",
    assignedTo: "Sachin Babar",
    createdAt: "2024-04-14 05:00 PM",
    updatedAt: "2024-04-15 09:00 AM",
    description: "Streetlight feeder pillar damaged, sparking during night hours.",
  },
];

// 7 Field Voter Slip Deliveries
export const SLIPS_DATA: SlipDeliveryItem[] = [
  {
    id: "SLIP-DEL-101",
    voterName: "Sunita Ravindra Kulkarni",
    epicNumber: "MH34098231",
    boothNumber: 101,
    prabhaag: "Prabhaag 12 - Kothrud West",
    slipType: "PRINTED_THERMAL",
    deliveredBy: "Sanjay Deshmukh",
    timestamp: "10:14 AM Today",
    status: "COMPLETED",
    dateRange: "TODAY",
    mobile: "+91 98221 44510",
    x: 230,
    y: 290,
    notes: "Handed over 58mm printed slip with candidate symbol. Supporter confirmed family of 4.",
  },
  {
    id: "SLIP-DEL-102",
    voterName: "Amit Suresh Joshi",
    epicNumber: "MH34088192",
    boothNumber: 101,
    prabhaag: "Prabhaag 12 - Kothrud West",
    slipType: "DIGITAL_WHATSAPP",
    deliveredBy: "Sanjay Deshmukh",
    timestamp: "11:22 AM Today",
    status: "COMPLETED",
    dateRange: "TODAY",
    mobile: "+91 98223 90123",
    x: 270,
    y: 260,
    notes: "Delivered official PDF slip via WhatsApp Business API. Verified QR code scanned.",
  },
  {
    id: "SLIP-DEL-103",
    voterName: "Prashant Baban Kamble",
    epicNumber: "MH34015670",
    boothNumber: 103,
    prabhaag: "Prabhaag 12 - Kothrud West",
    slipType: "PRINTED_THERMAL",
    deliveredBy: "Pooja Gaikwad",
    timestamp: "09:45 AM Today",
    status: "COMPLETED",
    dateRange: "TODAY",
    mobile: "+91 97645 22019",
    x: 420,
    y: 220,
    notes: "Printed thermal slip handed at rickshaw stand. Rickshaw union coordinator verified.",
  },
  {
    id: "SLIP-DEL-104",
    voterName: "Mohammad Irfan Shaikh",
    epicNumber: "MH34029810",
    boothNumber: 104,
    prabhaag: "Prabhaag 13 - Erandwane",
    slipType: "DIGITAL_WHATSAPP",
    deliveredBy: "Rahul More",
    timestamp: "Yesterday 04:30 PM",
    status: "COMPLETED",
    dateRange: "LAST_3_DAYS",
    mobile: "+91 99220 33451",
    x: 580,
    y: 260,
    notes: "Sent digital slip via WhatsApp with booth navigation map link.",
  },
  {
    id: "SLIP-DEL-105",
    voterName: "Dr. Ashutosh Shrikant Ranade",
    epicNumber: "MH34033418",
    boothNumber: 105,
    prabhaag: "Prabhaag 13 - Erandwane",
    slipType: "PRINTED_THERMAL",
    deliveredBy: "Rahul More",
    timestamp: "Yesterday 06:15 PM",
    status: "COMPLETED",
    dateRange: "LAST_3_DAYS",
    mobile: "+91 98900 11223",
    x: 510,
    y: 340,
    notes: "Delivered at residence clinic. Requested BLO contact clarification.",
  },
  {
    id: "SLIP-DEL-106",
    voterName: "Kavita Nitin Shinde",
    epicNumber: "MH34044590",
    boothNumber: 106,
    prabhaag: "Prabhaag 14 - Shivajinagar",
    slipType: "DIGITAL_WHATSAPP",
    deliveredBy: "Sachin Thorat",
    timestamp: "Pending Handover",
    status: "PENDING",
    dateRange: "THIS_WEEK",
    mobile: "+91 98811 77665",
    x: 740,
    y: 220,
    notes: "Door locked during 1st visit. Scheduled for digital WhatsApp push + evening callback.",
  },
  {
    id: "SLIP-DEL-107",
    voterName: "Vikram Madhavrao Jadhav",
    epicNumber: "MH34055601",
    boothNumber: 107,
    prabhaag: "Prabhaag 14 - Shivajinagar",
    slipType: "PRINTED_THERMAL",
    deliveredBy: "Sachin Thorat",
    timestamp: "2 days ago",
    status: "COMPLETED",
    dateRange: "LAST_3_DAYS",
    mobile: "+91 97633 44556",
    x: 790,
    y: 280,
    notes: "Delivered printed slip with Ladki Bahin guidance brochure.",
  },
];

type DetailEntity =
  | { type: "booth"; data: BoothItem }
  | { type: "karyakarta"; data: KaryakartaItem }
  | { type: "slip"; data: SlipDeliveryItem }
  | { type: "issue"; data: IssueItem }
  | null;

// ============================================================================
// MAIN COMPONENT: LiveFieldMapView
// ============================================================================

export function LiveFieldMapView() {
  const { showToast } = useToast();

  const [zoomScale, setZoomScale] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<
    "ALL" | "KARYAKARTAS" | "SLIPS" | "BOOTHS" | "ISSUES"
  >("ALL");

  // Filter Bar state
  const [prabhaagFilter, setPrabhaagFilter] = useState("ALL");
  const [boothFilter, setBoothFilter] = useState("ALL");
  const [activityTypeFilter, setActivityTypeFilter] = useState("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [slipFormatFilter, setSlipFormatFilter] = useState("ALL");

  // Selected Pin for details drawer/modal
  const [selectedEntity, setSelectedEntity] = useState<DetailEntity>(null);

  // Filtered Booths
  const filteredBooths = BOOTHS_DATA.filter((b) => {
    if (boothFilter !== "ALL" && b.boothNumber.toString() !== boothFilter) return false;
    if (prabhaagFilter !== "ALL" && !b.prabhaag.toLowerCase().includes(prabhaagFilter.toLowerCase()))
      return false;
    return true;
  });

  // Filtered Karyakartas
  const filteredKaryakartas = KARYAKARTAS_DATA.filter((k) => {
    if (boothFilter !== "ALL" && k.assignedBooth.toString() !== boothFilter) return false;
    if (prabhaagFilter !== "ALL" && !k.prabhaag.toLowerCase().includes(prabhaagFilter.toLowerCase()))
      return false;
    if (statusFilter === "ACTIVE" && !k.isOnline) return false;
    return true;
  });

  // Filtered Issues
  const filteredIssues = ISSUES_DATA.filter((issue) => {
    if (statusFilter === "COMPLETED" && issue.status !== "RESOLVED") return false;
    if (statusFilter === "PENDING" && issue.status !== "OPEN") return false;
    return true;
  });

  // Filtered Slips
  const filteredSlips = SLIPS_DATA.filter((s) => {
    if (boothFilter !== "ALL" && s.boothNumber.toString() !== boothFilter) return false;
    if (prabhaagFilter !== "ALL" && !s.prabhaag.toLowerCase().includes(prabhaagFilter.toLowerCase()))
      return false;
    if (dateRangeFilter !== "ALL" && s.dateRange !== dateRangeFilter) return false;
    if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
    if (slipFormatFilter !== "ALL" && s.slipType !== slipFormatFilter) return false;
    return true;
  });

  const showBooths = activeLayer === "ALL" || activeLayer === "BOOTHS";
  const showKaryakartas =
    (activeLayer === "ALL" || activeLayer === "KARYAKARTAS") &&
    activityTypeFilter !== "SLIPS" &&
    activityTypeFilter !== "ISSUES";
  const showSlips =
    (activeLayer === "ALL" || activeLayer === "SLIPS") &&
    (activityTypeFilter === "ALL" || activityTypeFilter === "SLIPS");
  const showIssues =
    (activeLayer === "ALL" || activeLayer === "ISSUES") &&
    (activityTypeFilter === "ALL" || activityTypeFilter === "ISSUES");

  const totalVisible =
    (showBooths ? filteredBooths.length : 0) +
    (showKaryakartas ? filteredKaryakartas.length : 0) +
    (showSlips ? filteredSlips.length : 0) +
    (showIssues ? filteredIssues.length : 0);

  const handleSelectEntity = (
    type: "booth" | "karyakarta" | "slip" | "issue",
    data: BoothItem | KaryakartaItem | SlipDeliveryItem | IssueItem
  ) => {
    // Typecast entity mapping cleanly
    if (type === "booth") {
      setSelectedEntity({ type: "booth", data: data as BoothItem });
    } else if (type === "karyakarta") {
      setSelectedEntity({ type: "karyakarta", data: data as KaryakartaItem });
    } else if (type === "slip") {
      setSelectedEntity({ type: "slip", data: data as SlipDeliveryItem });
    } else if (type === "issue") {
      setSelectedEntity({ type: "issue", data: data as IssueItem });
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in flex flex-col h-[calc(100vh-5.5rem)]">
      {/* ===================================================================== */}
      {/* TOP CONTROL BAR: GIS TAG, TITLE & LAYER PILL BUTTONS                   */}
      {/* ===================================================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                GIS Operations &amp; Field Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Mock Illustrative Map Telemetry
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
              Live Field Map &amp; Voter Slip Delivery Monitor
            </h1>
          </div>

          {/* Layer Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700 overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveLayer("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === "ALL"
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              All Layers
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("KARYAKARTAS")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === "KARYAKARTAS"
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              Karyakartas ({KARYAKARTAS_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("SLIPS")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === "SLIPS"
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              Voter Slips ({SLIPS_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("BOOTHS")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === "BOOTHS"
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              Booths ({BOOTHS_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("ISSUES")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === "ISSUES"
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              Issues ({ISSUES_DATA.length})
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECONDARY FILTER BAR: 6 MULTI-ATTRIBUTE DROPDOWNS                   */}
        {/* =================================================================== */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Prabhaag
            </label>
            <div className="relative">
              <select
                value={prabhaagFilter}
                onChange={(e) => setPrabhaagFilter(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="ALL">All Prabhaags</option>
                <option value="Kothrud">Prabhaag 12 - Kothrud West</option>
                <option value="Erandwane">Prabhaag 13 - Erandwane</option>
                <option value="Shivajinagar">Prabhaag 14 - Shivajinagar</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Booth Number
            </label>
            <div className="relative">
              <select
                value={boothFilter}
                onChange={(e) => setBoothFilter(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="ALL">All 8 Booths</option>
                {BOOTHS_DATA.map((b) => (
                  <option key={b.boothNumber} value={b.boothNumber.toString()}>
                    Booth #{b.boothNumber} ({b.locality})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Activity Type
            </label>
            <div className="relative">
              <select
                value={activityTypeFilter}
                onChange={(e) => setActivityTypeFilter(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="ALL">All Activities</option>
                <option value="SLIPS">Slip Deliveries Only</option>
                <option value="ISSUES">Grievances Only</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Date Range
            </label>
            <div className="relative">
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today (Live)</option>
                <option value="LAST_3_DAYS">Last 3 Days</option>
                <option value="THIS_WEEK">This Week</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active / Online</option>
                <option value="COMPLETED">Delivered / Resolved</option>
                <option value="PENDING">Pending Handover</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Slip Format
            </label>
            <div className="relative">
              <select
                value={slipFormatFilter}
                onChange={(e) => setSlipFormatFilter(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="ALL">All Slip Types</option>
                <option value="DIGITAL_WHATSAPP">WhatsApp Digital QR Slip</option>
                <option value="PRINTED_THERMAL">58mm Thermal Printed Slip</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN INTERACTIVE CANVAS: DARK NAVY WITH SVG ZONES, PINS & TELEMETRY   */}
      {/* ===================================================================== */}
      <div className="flex-1 bg-[#0B1527] rounded-3xl border border-slate-800 relative overflow-hidden flex shadow-2xl min-h-[540px]">
        <div
          className="w-full h-full relative cursor-grab active:cursor-grabbing transition-transform duration-200"
          style={{ transform: `scale(${zoomScale})`, transformOrigin: "center center" }}
        >
          {/* Coordinate grid mesh overlay */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* SVG Canvas for Boundary Polygons and Trajectory Vectors */}
          <svg
            className="w-full h-full absolute inset-0 pointer-events-none"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            {/* Outer Perimeter Enclosure */}
            <polygon
              points="100,80 340,40 680,60 920,180 840,480 520,560 220,510 80,320"
              fill="rgba(30, 58, 138, 0.12)"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeDasharray="6,4"
            />

            {/* Flight Path / Canvassing Trajectories */}
            <path
              d="M 120 400 Q 350 300 550 250 T 880 180"
              fill="none"
              stroke="#475569"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 280 80 Q 400 240 540 380 T 680 540"
              fill="none"
              stroke="#334155"
              strokeWidth="3"
            />
            <path
              d="M 450 120 Q 560 280 720 340 T 910 460"
              fill="none"
              stroke="#334155"
              strokeWidth="2.5"
              strokeDasharray="4,4"
            />

            {/* Booth Polygons Matching Reference Screenshot */}
            {/* Booth 101 - Blue */}
            <polygon
              points="140,240 280,210 260,340 130,320"
              fill="rgba(37, 99, 235, 0.15)"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            {/* Booth 102 - Green */}
            <polygon
              points="290,200 450,170 470,300 300,320"
              fill="rgba(16, 185, 129, 0.15)"
              stroke="#10b981"
              strokeWidth="2"
            />
            {/* Booth 103 - Amber */}
            <polygon
              points="470,180 640,150 660,280 480,290"
              fill="rgba(245, 158, 11, 0.15)"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            {/* Booth 104 - Red */}
            <polygon
              points="660,160 820,140 840,300 670,310"
              fill="rgba(239, 68, 68, 0.15)"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </svg>

          {/* 1. Polling Stations Pins */}
          {showBooths &&
            filteredBooths.map((booth, index) => {
              const leftPos = 200 + (index % 4) * 180;
              const topPos = 180 + Math.floor(index / 4) * 160;

              return (
                <div
                  key={booth.boothNumber}
                  onClick={() => handleSelectEntity("booth", booth)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  style={{ left: `${leftPos}px`, top: `${topPos}px` }}
                >
                  <div
                    className={`p-2 rounded-2xl border flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-transform group-hover:scale-110 ${
                      booth.grade === "A"
                        ? "bg-slate-900/90 text-blue-300 border-blue-500"
                        : booth.grade === "B"
                        ? "bg-blue-950/90 text-blue-300 border-blue-500"
                        : "bg-amber-950/90 text-amber-300 border-amber-500"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold whitespace-nowrap">
                      Booth #{booth.boothNumber}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* 2. Active Karyakartas on Field */}
          {showKaryakartas &&
            filteredKaryakartas.map((karyakarta, index) => {
              const leftPos = 240 + index * 160;
              const topPos = 230 + (index % 2) * 100;

              return (
                <div
                  key={karyakarta.id}
                  onClick={() => handleSelectEntity("karyakarta", karyakarta)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
                  style={{ left: `${leftPos}px`, top: `${topPos}px` }}
                >
                  <div className="relative flex flex-col items-center">
                    {karyakarta.isOnline && (
                      <span className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-400/40 animate-ping absolute" />
                    )}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white ${
                        karyakarta.isOnline
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {karyakarta.name[0]}
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/95 text-white text-[9px] font-bold border border-slate-700 whitespace-nowrap shadow-md group-hover:border-blue-400">
                      {karyakarta.name} ({karyakarta.surveysCompleted} surveys)
                    </span>
                  </div>
                </div>
              );
            })}

          {/* 3. Voter Slip Deliveries (Thermal & Digital WhatsApp) */}
          {showSlips &&
            filteredSlips.map((slip) => (
              <div
                key={slip.id}
                onClick={() => handleSelectEntity("slip", slip)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
                style={{ left: `${slip.x}px`, top: `${slip.y}px` }}
              >
                <div className="flex flex-col items-center transition-transform group-hover:scale-110">
                  {slip.slipType === "PRINTED_THERMAL" ? (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-indigo-400/50">
                      <Printer className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-cyan-400/50">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  )}
                  <span
                    className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap shadow-md border ${
                      slip.slipType === "PRINTED_THERMAL"
                        ? "bg-indigo-950/95 text-indigo-300 border-indigo-500"
                        : "bg-cyan-950/95 text-cyan-300 border-cyan-500"
                    }`}
                  >
                    {slip.voterName.split(" ")[0]} (
                    {slip.slipType === "PRINTED_THERMAL" ? "58mm Print" : "WhatsApp QR"})
                  </span>
                </div>
              </div>
            ))}

          {/* 4. Citizen Grievance Hotspots */}
          {showIssues &&
            filteredIssues.map((issue, index) => {
              const leftPos = 320 + index * 170;
              const topPos = 200 + (index % 2) * 120;

              return (
                <div
                  key={issue.id}
                  onClick={() => handleSelectEntity("issue", issue)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
                  style={{ left: `${leftPos}px`, top: `${topPos}px` }}
                >
                  <div className="flex flex-col items-center transition-transform group-hover:scale-110">
                    <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/95 text-amber-300 text-[9px] font-bold border border-slate-700 whitespace-nowrap shadow-md">
                      {issue.id}: {issue.category}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* =================================================================== */}
        {/* RIGHT TOP ZOOM & RESET CONTROLS                                     */}
        {/* =================================================================== */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <button
            type="button"
            onClick={() => setZoomScale((prev) => Math.min(1.8, prev + 0.2))}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomScale((prev) => Math.max(0.8, prev - 0.2))}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomScale(1)}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            title="Reset Center View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* =================================================================== */}
        {/* BOTTOM LEFT FLOATING MAP LEGEND BOX                                 */}
        {/* =================================================================== */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 text-[10px] text-slate-300 space-y-1.5 z-30 shadow-2xl max-w-xs">
          <div className="flex items-center justify-between font-bold text-white border-b border-slate-800 pb-1 mb-1">
            <span>Map Legend ({totalVisible} Visible)</span>
            <span className="text-[9px] text-blue-400 font-normal flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Live GPS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Online Karyakarta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Polling Station</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Digital WhatsApp Slip</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>58mm Thermal Print Slip</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Citizen Grievance Hotspot</span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* DETAIL POPUP DRAWER (WHEN PIN CLICKED)                              */}
        {/* =================================================================== */}
        {selectedEntity && (
          <div className="absolute top-4 right-16 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 text-xs animate-slide-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {selectedEntity.type === "booth"
                  ? "Polling Station Dossier"
                  : selectedEntity.type === "karyakarta"
                  ? "Karyakarta Live Telemetry"
                  : selectedEntity.type === "slip"
                  ? "Voter Slip Delivery Record"
                  : "Grievance Pin"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedEntity(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Booth Details */}
            {selectedEntity.type === "booth" && (
              <div className="space-y-2 text-slate-700">
                <h4 className="font-bold text-slate-900 text-sm">
                  Booth #{selectedEntity.data.boothNumber} - {selectedEntity.data.name}
                </h4>
                <p className="text-slate-500 text-[11px]">{selectedEntity.data.locality}</p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Total Electors:</span>
                    <span className="font-bold text-slate-900">
                      {selectedEntity.data.totalVoters}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Slips Delivered:</span>
                    <span className="font-bold text-blue-600">
                      {selectedEntity.data.slipsDeliveredPercent}%
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <span className="text-[10px] text-blue-900 font-bold block">Designated BLO:</span>
                  <span className="font-semibold text-blue-800">
                    {selectedEntity.data.bloName}
                  </span>
                  <span className="text-[10px] text-blue-600 block">
                    {selectedEntity.data.bloPhone}
                  </span>
                </div>
              </div>
            )}

            {/* Karyakarta Details */}
            {selectedEntity.type === "karyakarta" && (
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {selectedEntity.data.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {selectedEntity.data.name}
                    </h4>
                    <span className="text-[10px] text-blue-600 font-semibold">Active in Field</span>
                  </div>
                </div>
                <p className="text-slate-600">
                  Assigned: Booth #{selectedEntity.data.assignedBooth} (
                  {selectedEntity.data.prabhaag})
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Surveys Completed:</span>
                    <span className="font-bold text-slate-900">
                      {selectedEntity.data.surveysCompleted}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Slips Handed:</span>
                    <span className="font-bold text-slate-900">
                      {selectedEntity.data.voterSlipsDelivered}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Slip Delivery Details */}
            {selectedEntity.type === "slip" && (
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700">
                    {selectedEntity.data.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedEntity.data.slipType === "PRINTED_THERMAL"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-cyan-100 text-cyan-800"
                    }`}
                  >
                    {selectedEntity.data.slipType === "PRINTED_THERMAL"
                      ? "58mm Thermal Slip"
                      : "Digital WhatsApp Slip"}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {selectedEntity.data.voterName}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    EPIC: {selectedEntity.data.epicNumber}
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivered By:</span>
                    <span className="font-bold text-slate-800">
                      {selectedEntity.data.deliveredBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booth &amp; Ward:</span>
                    <span className="font-medium text-slate-800">
                      Booth #{selectedEntity.data.boothNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time:</span>
                    <span className="font-medium text-slate-800">
                      {selectedEntity.data.timestamp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-medium text-slate-800">
                      {selectedEntity.data.mobile}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                  {selectedEntity.data.notes}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    showToast(
                      "success",
                      "Follow-up Ping Sent",
                      `Direct ping sent to ${selectedEntity.data.voterName} (${selectedEntity.data.mobile}).`
                    );
                  }}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] transition-colors cursor-pointer"
                >
                  Send Follow-up Greeting
                </button>
              </div>
            )}

            {/* Issue Details */}
            {selectedEntity.type === "issue" && (
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700">
                    {selectedEntity.data.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {selectedEntity.data.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedEntity.data.category}
                </h4>
                <p className="text-slate-600 text-[11px]">{selectedEntity.data.description}</p>
                <p className="text-slate-500 text-[10px]">
                  Visitor: <strong className="text-slate-700">{selectedEntity.data.visitorName}</strong> ({selectedEntity.data.visitorPhone})
                </p>
                <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-600">
                  <span>Assigned To: </span>
                  <span className="font-semibold text-slate-800">{selectedEntity.data.assignedTo}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
