"use client";

import React, { useState, useMemo } from "react";
import {
  BookUser,
  Users,
  Phone,
  MessageSquare,
  Search,
  ShieldCheck,
  ExternalLink,
  Eye,
  X,
  ArrowLeft,
  Copy,
  User,
  Check,
  Plus,
  FolderPlus,
  Download,
  Smartphone,
  History,
  Trash2,
  Edit3,
  Upload,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { SEED_ELECTORS, ElectorRecord } from "./voter-management-view";

// ============================================================================
// DATA MODELS
// ============================================================================

export interface CampaignTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CANDIDATE_ADMIN" | "WAR_ROOM_HEAD" | "PRABHAAG_INCHARGE" | "KARYAKARTA" | "DATA_OPERATOR";
  status: "ACTIVE" | "ON_LEAVE" | "OFFLINE";
  prabhaag?: string;
  assignedBooths: number[];
  lastActive: string;
}

export const SEED_CAMPAIGN_TEAM: CampaignTeamMember[] = [
  {
    id: "usr-01",
    name: "Adv. Vikram Patil",
    email: "vikram.patil@indata-election.in",
    phone: "+91 98220 99000",
    role: "CANDIDATE_ADMIN",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104, 105, 106, 107, 108],
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
    lastActive: "2 hours ago",
  },
];

export interface UnifiedContact {
  id: string;
  name: string;
  hindiName?: string;
  phone: string;
  email?: string;
  type: "VOTER" | "CAMPAIGN_TEAM";
  roleOrDesignation: string;
  boothNumber?: number;
  serialNo?: number;
  epicNumber?: string;
  prabhaag?: string;
  politicalLeaning?: string;
  groups: string[];
  syncStatus: "SYNCED" | "PENDING" | "MODIFIED";
  avatarColor: string;
  hasVoted?: boolean;
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  color: "purple" | "blue" | "teal" | "amber" | "rose";
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SyncLogRecord {
  id: string;
  timestamp: string;
  targetDevice: string;
  deviceType: "IOS" | "ANDROID" | "VCARD_FILE";
  totalProcessed: number;
  successfulCount: number;
  duplicateCount: number;
  failedCount: number;
  operator: string;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
  details: string;
}

// Convert SEED_ELECTORS and SEED_CAMPAIGN_TEAM into initial unified list
export const INITIAL_UNIFIED_CONTACTS: UnifiedContact[] = [
  ...SEED_ELECTORS.map((v, i) => ({
    id: v.id,
    name: v.fullName,
    hindiName: v.hindiName,
    phone: v.mobile || `+91 98220 ${10000 + i * 111}`,
    email: `${v.fullName.toLowerCase().replace(/[^a-z]/g, "")}@example.com`,
    type: "VOTER" as const,
    roleOrDesignation: `Verified Elector (Booth #${v.boothNumber})`,
    boothNumber: v.boothNumber,
    serialNo: v.serialNo,
    epicNumber: v.epicNumber,
    prabhaag: v.ward || v.prabhaag,
    politicalLeaning: v.politicalLeaning,
    groups: i < 3 ? ["grp-01"] : i < 6 ? ["grp-02"] : ["grp-03"],
    syncStatus: (i % 2 === 0 ? "SYNCED" : "PENDING") as "SYNCED" | "PENDING",
    avatarColor: "from-blue-600 to-indigo-700",
    hasVoted: v.hasVoted,
  })),
  ...SEED_CAMPAIGN_TEAM.map((m, i) => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    email: m.email,
    type: "CAMPAIGN_TEAM" as const,
    roleOrDesignation: m.role.replace(/_/g, " "),
    boothNumber: m.assignedBooths[0],
    prabhaag: m.prabhaag || "All Wards",
    groups: i % 2 === 0 ? ["grp-01", "grp-04"] : ["grp-02"],
    syncStatus: "SYNCED" as const,
    avatarColor: "from-teal-600 to-emerald-700",
  })),
];

export const INITIAL_CONTACT_GROUPS: ContactGroup[] = [
  {
    id: "grp-01",
    name: "Booth 101 Influencers",
    description: "High-influence residential society committee members, doctors, and community elders.",
    color: "purple",
    memberIds: ["elec-01", "elec-02", "elec-03", "usr-01"],
    createdAt: "2024-04-10",
    updatedAt: "2024-04-18",
  },
  {
    id: "grp-02",
    name: "Youth Campaign Brigade",
    description: "College campus leads, youth wing coordinators, and digital karyakartas.",
    color: "blue",
    memberIds: ["elec-04", "elec-05", "usr-04", "usr-05"],
    createdAt: "2024-04-12",
    updatedAt: "2024-04-17",
  },
  {
    id: "grp-03",
    name: "Senior Citizens Outreach",
    description: "Pensioners association representatives, morning walkers club heads, and elders.",
    color: "amber",
    memberIds: ["elec-06", "elec-07", "elec-08"],
    createdAt: "2024-04-14",
    updatedAt: "2024-04-18",
  },
  {
    id: "grp-04",
    name: "Ward 12 Business Leaders",
    description: "Merchant association executives, shopkeeper union delegates, and trade leaders.",
    color: "teal",
    memberIds: ["elec-09", "elec-10", "usr-03", "usr-06"],
    createdAt: "2024-04-15",
    updatedAt: "2024-04-18",
  },
];

export const INITIAL_SYNC_LOGS: SyncLogRecord[] = [
  {
    id: "sync-101",
    timestamp: "2024-04-18 10:45 AM",
    targetDevice: "Apple iPhone 15 Pro (iOS 17.5)",
    deviceType: "IOS",
    totalProcessed: 14,
    successfulCount: 12,
    duplicateCount: 2,
    failedCount: 0,
    operator: "Adv. Vikram Patil (Candidate)",
    status: "SUCCESS",
    details: "12 new contacts synced to device address book; 2 duplicate numbers merged.",
  },
  {
    id: "sync-102",
    timestamp: "2024-04-17 06:12 PM",
    targetDevice: "Samsung Galaxy S24 Ultra (Android 14)",
    deviceType: "ANDROID",
    totalProcessed: 8,
    successfulCount: 7,
    duplicateCount: 1,
    failedCount: 0,
    operator: "Dr. Sameer Deshpande (War Room Head)",
    status: "SUCCESS",
    details: "Google Contacts API sync completed with booth #101 field karyakartas.",
  },
  {
    id: "sync-103",
    timestamp: "2024-04-16 02:30 PM",
    targetDevice: "vCard 3.0 Universal Archive (.vcf)",
    deviceType: "VCARD_FILE",
    totalProcessed: 20,
    successfulCount: 20,
    duplicateCount: 0,
    failedCount: 0,
    operator: "Mahesh Thorat (Data Operator)",
    status: "SUCCESS",
    details: "Exported vCard package containing all verified booth karyakartas.",
  },
  {
    id: "sync-104",
    timestamp: "2024-04-15 11:20 AM",
    targetDevice: "OnePlus 12 (Android 14)",
    deviceType: "ANDROID",
    totalProcessed: 10,
    successfulCount: 9,
    duplicateCount: 1,
    failedCount: 0,
    operator: "Sachin Babar (Prabhaag Incharge)",
    status: "SUCCESS",
    details: "Prabhaag 12 leadership directory synced to device phone book.",
  },
];

// Helper to generate a valid vCard 3.0 string
function generateVCardString(contacts: UnifiedContact[]): string {
  let vcard = "";
  contacts.forEach((c) => {
    vcard += "BEGIN:VCARD\r\n";
    vcard += "VERSION:3.0\r\n";
    vcard += `FN:${c.name}\r\n`;
    if (c.phone) {
      vcard += `TEL;TYPE=CELL:${c.phone}\r\n`;
    }
    if (c.email) {
      vcard += `EMAIL;TYPE=INTERNET:${c.email}\r\n`;
    }
    vcard += `TITLE:${c.roleOrDesignation}\r\n`;
    vcard += `ORG:INDATA Election Campaign;${c.prabhaag || "Ward"}\r\n`;
    if (c.epicNumber) {
      vcard += `NOTE:EPIC: ${c.epicNumber} | Booth #${c.boothNumber || "General"}\r\n`;
    }
    vcard += "END:VCARD\r\n";
  });
  return vcard;
}

// ============================================================================
// CONTINUOUS SINGLE-PAGE PROFILE COMPONENT
// ============================================================================

function VoterQuickProfileView({
  voter,
  onBack,
}: {
  voter: ElectorRecord;
  onBack: () => void;
}) {
  const { showToast } = useToast();

  const handleCopyEpic = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(voter.epicNumber);
      showToast("info", "EPIC Copied", `EPIC ID ${voter.epicNumber} copied to clipboard!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 flex items-center justify-between gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Phone Book</span>
        </button>

        <div className="flex items-center gap-2">
          {voter.mobile && (
            <a
              href={`tel:${voter.mobile}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Elector</span>
            </a>
          )}
          {voter.mobile && (
            <a
              href={`https://wa.me/${voter.mobile.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero Header */}
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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Elector
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                <span>{voter.relationType}: {voter.relativeName}</span>
                <span>•</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{voter.epicNumber}</span>
                <button onClick={handleCopyEpic} className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <Copy className="w-3 h-3" />
                </button>
                <span>•</span>
                <span>Booth #{voter.boothNumber}</span>
                <span>•</span>
                <span>Sr #{voter.serialNo}</span>
              </div>
            </div>
          </div>

          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              voter.politicalLeaning === "STRONG_SUPPORTER"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : voter.politicalLeaning === "LEANING_SUPPORTER"
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : voter.politicalLeaning === "LEANING_OPPOSITION"
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : "bg-slate-100 text-slate-700"
            }`}>
              {voter.politicalLeaning.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Continuous Subsections */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Contact &amp; Demographics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Phone Contact</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">{voter.mobile || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Age &amp; Gender</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.age} yrs / {voter.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Assigned Polling Booth</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Booth #{voter.boothNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Ward / Prabhaag</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{voter.ward || voter.prabhaag}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 block mb-0.5">Polling Station</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{voter.pollingStation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CONSTITUENCY PHONE BOOK COMPONENT (5 OFFICIAL SUB-SECTIONS)
// ============================================================================

export function PhoneBookView() {
  const { showToast } = useToast();

  // 5 Client-Mandated Sub-Sections
  type PhoneBookTab = "ALL_CONTACTS" | "CONTACT_GROUPS" | "PHONE_SYNC" | "SYNC_HISTORY" | "IMPORT_EXPORT";
  const [activeTab, setActiveTab] = useState<PhoneBookTab>("ALL_CONTACTS");

  // State: Contacts & Groups & Sync History
  const [contacts, setContacts] = useState<UnifiedContact[]>(INITIAL_UNIFIED_CONTACTS);
  const [groups, setGroups] = useState<ContactGroup[]>(INITIAL_CONTACT_GROUPS);
  const [syncLogs, setSyncLogs] = useState<SyncLogRecord[]>(INITIAL_SYNC_LOGS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contactTypeFilter, setContactTypeFilter] = useState<"ALL" | "VOTER" | "CAMPAIGN_TEAM">("ALL");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("ALL");

  // Bulk Selection State
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  // Profile View
  const [selectedVoter, setSelectedVoter] = useState<ElectorRecord | null>(null);

  // Group Management Modals
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupDesc, setNewGroupDesc] = useState<string>("");
  const [newGroupColor, setNewGroupColor] = useState<ContactGroup["color"]>("purple");
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [activeGroupForMembers, setActiveGroupForMembers] = useState<ContactGroup | null>(null);

  // Phone Contact Sync Modal & State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncLogText, setSyncLogText] = useState<string>("");
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(false);
  const [syncTargetDevice, setSyncTargetDevice] = useState<"IOS" | "ANDROID" | "VCARD_FILE">("IOS");
  const [duplicateStrategy, setDuplicateStrategy] = useState<"MERGE" | "SKIP">("MERGE");

  // Import / Export State
  const [importFileName, setImportFileName] = useState<string>("");
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [exportScope, setExportScope] = useState<"ALL" | "VOTER" | "CAMPAIGN_TEAM" | string>("ALL");
  const [exportFormat, setExportFormat] = useState<"VCF" | "CSV">("VCF");

  // Filtered Contacts Logic
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Type Filter
      if (contactTypeFilter === "VOTER" && c.type !== "VOTER") return false;
      if (contactTypeFilter === "CAMPAIGN_TEAM" && c.type !== "CAMPAIGN_TEAM") return false;

      // Group Filter
      if (selectedGroupFilter !== "ALL" && !c.groups.includes(selectedGroupFilter)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q);
        const matchHindi = c.hindiName?.toLowerCase().includes(q);
        const matchPhone = c.phone.replace(/\D/g, "").includes(q.replace(/\D/g, ""));
        const matchRole = c.roleOrDesignation.toLowerCase().includes(q);
        const matchEpic = c.epicNumber?.toLowerCase().includes(q);
        const matchBooth = c.boothNumber?.toString().includes(q);
        return matchName || matchHindi || matchPhone || matchRole || matchEpic || matchBooth;
      }
      return true;
    });
  }, [contacts, contactTypeFilter, selectedGroupFilter, searchQuery]);

  // Bulk Selection Handlers
  const isAllSelected = filteredContacts.length > 0 && filteredContacts.every((c) => selectedContactIds.includes(c.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedContactIds((prev) => prev.filter((id) => !filteredContacts.some((c) => c.id === id)));
    } else {
      const allFilteredIds = filteredContacts.map((c) => c.id);
      setSelectedContactIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Group Creation
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      showToast("warning", "Missing Group Name", "Please enter a valid title for the group.");
      return;
    }
    const newGroup: ContactGroup = {
      id: `grp-${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || "Constituency outreach group.",
      color: newGroupColor,
      memberIds: selectedContactIds,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setGroups((prev) => [...prev, newGroup]);

    // Update contacts' group memberships
    if (selectedContactIds.length > 0) {
      setContacts((prev) =>
        prev.map((c) =>
          selectedContactIds.includes(c.id) ? { ...c, groups: Array.from(new Set([...c.groups, newGroup.id])) } : c
        )
      );
    }

    showToast("success", "Group Created", `Group "${newGroup.name}" created with ${selectedContactIds.length} members.`);
    setNewGroupName("");
    setNewGroupDesc("");
    setIsCreateGroupModalOpen(false);
  };

  // Rename/Update Group
  const handleUpdateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup || !editingGroup.name.trim()) return;

    setGroups((prev) =>
      prev.map((g) => (g.id === editingGroup.id ? { ...editingGroup, updatedAt: new Date().toISOString().slice(0, 10) } : g))
    );
    showToast("success", "Group Updated", `Group "${editingGroup.name}" saved successfully.`);
    setEditingGroup(null);
  };

  // Delete Group
  const handleDeleteGroup = (groupId: string, groupName: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    // Remove group ID from contacts
    setContacts((prev) =>
      prev.map((c) => ({ ...c, groups: c.groups.filter((g) => g !== groupId) }))
    );
    if (selectedGroupFilter === groupId) {
      setSelectedGroupFilter("ALL");
    }
    showToast("info", "Group Removed", `Group "${groupName}" deleted.`);
  };

  // Remove Member from Group
  const handleRemoveMemberFromGroup = (groupId: string, contactId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, memberIds: g.memberIds.filter((m) => m !== contactId) } : g))
    );
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, groups: c.groups.filter((g) => g !== groupId) } : c))
    );
    showToast("info", "Member Removed", "Contact removed from group.");
  };

  // Bulk Add Selected to Group
  const handleBulkAddToGroup = (groupId: string) => {
    const targetGroup = groups.find((g) => g.id === groupId);
    if (!targetGroup) return;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, memberIds: Array.from(new Set([...g.memberIds, ...selectedContactIds])) } : g
      )
    );
    setContacts((prev) =>
      prev.map((c) =>
        selectedContactIds.includes(c.id) ? { ...c, groups: Array.from(new Set([...c.groups, groupId])) } : c
      )
    );
    showToast(
      "success",
      "Contacts Added",
      `Added ${selectedContactIds.length} contacts to "${targetGroup.name}".`
    );
  };

  // Native Contact Sync Simulation & Execution
  const handleStartDeviceSync = () => {
    setShowPermissionPrompt(true);
  };

  const executeSync = () => {
    setShowPermissionPrompt(false);
    setIsSyncing(true);
    setSyncProgress(10);
    setSyncLogText("Connecting to native mobile address book API...");

    const targetList = selectedContactIds.length > 0
      ? contacts.filter((c) => selectedContactIds.includes(c.id))
      : contacts;

    setTimeout(() => {
      setSyncProgress(35);
      setSyncLogText(`Validating ${targetList.length} E.164 phone numbers and ECI voter metadata...`);
    }, 600);

    setTimeout(() => {
      setSyncProgress(70);
      setSyncLogText("Checking duplicate records against local device address book...");
    }, 1200);

    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);

      const duplicates = Math.floor(targetList.length * 0.15);
      const successful = targetList.length - duplicates;

      // Update sync statuses
      setContacts((prev) =>
        prev.map((c) =>
          targetList.some((t) => t.id === c.id) ? { ...c, syncStatus: "SYNCED" } : c
        )
      );

      // Append new Sync History Log
      const deviceName =
        syncTargetDevice === "IOS"
          ? "Apple iPhone 15 Pro (iOS 17.5)"
          : syncTargetDevice === "ANDROID"
          ? "Samsung Galaxy S24 (Android 14)"
          : "vCard Universal Package (.vcf)";

      const newLog: SyncLogRecord = {
        id: `sync-${Date.now()}`,
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }),
        targetDevice: deviceName,
        deviceType: syncTargetDevice,
        totalProcessed: targetList.length,
        successfulCount: successful,
        duplicateCount: duplicates,
        failedCount: 0,
        operator: "Adv. Vikram Patil (Candidate)",
        status: "SUCCESS",
        details: `Successfully synced ${successful} verified contacts; ${duplicates} duplicates handled (${duplicateStrategy}).`,
      };

      setSyncLogs((prev) => [newLog, ...prev]);
      showToast(
        "success",
        "Phone Sync Complete",
        `${successful} contacts saved to ${deviceName} with duplicate detection.`
      );
    }, 1800);
  };

  // Download real .vcf file for physical phone import
  const handleDownloadVCard = (listToDownload = contacts) => {
    const vcardStr = generateVCardString(listToDownload);
    const blob = new Blob([vcardStr], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `INDATA_Verified_Contacts_${new Date().toISOString().slice(0, 10)}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("success", "vCard Generated", "Downloaded .vcf address book file ready for mobile import.");
  };

  // Download CSV
  const handleDownloadCSV = (listToDownload = contacts) => {
    const headers = ["Name", "Phone", "Type", "Role/Designation", "Booth", "EPIC Number", "Ward/Prabhaag"];
    const rows = listToDownload.map((c) => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.type}"`,
      `"${c.roleOrDesignation}"`,
      c.boothNumber || "",
      `"${c.epicNumber || ""}"`,
      `"${c.prabhaag || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `INDATA_Contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "CSV Exported", `Exported ${listToDownload.length} contacts to CSV.`);
  };

  // Simulate file import
  const handleSimulateImport = () => {
    if (!importFileName) {
      showToast("warning", "Select File", "Please choose a CSV or VCF file to import.");
      return;
    }
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      showToast(
        "success",
        "Import Successful",
        `Successfully imported 24 contacts from "${importFileName}". Verified and tagged.`
      );
      setImportFileName("");
    }, 1200);
  };

  // Click-to-Call Handler
  const handleCall = (name: string, phone?: string) => {
    if (!phone) {
      showToast("warning", "No Phone Number", `No registered mobile number for ${name}.`);
      return;
    }
    showToast("info", "Click-to-Call", `Dialing ${name} (${phone}) via tele-outreach gateway.`);
    window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
  };

  // WhatsApp Handler
  const handleWhatsApp = (name: string, phone?: string) => {
    if (!phone) {
      showToast("warning", "No Phone Number", `No registered WhatsApp contact for ${name}.`);
      return;
    }
    const cleanNumber = phone.replace(/\D/g, "");
    showToast("info", "WhatsApp Outreach", `Opening WhatsApp chat with ${name} (${phone}).`);
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  if (selectedVoter) {
    return <VoterQuickProfileView voter={selectedVoter} onBack={() => setSelectedVoter(null)} />;
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ===================================================================== */}
      {/* HEADER SECTION (Breadcrumb, Title, Subtitle, 5 Sub-Sections Switcher) */}
      {/* ===================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Communication Directory
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Verified Contacts
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Candidate Exclusive
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Constituency Phone Book
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified contact directory, multi-group management, native phone synchronization, and data portability.
          </p>
        </div>

        {/* 5 Segmented Sub-Sections Tab Switcher */}
        <div className="flex items-center flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => setActiveTab("ALL_CONTACTS")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "ALL_CONTACTS"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookUser className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>All Contacts ({contacts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("CONTACT_GROUPS")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "CONTACT_GROUPS"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Contact Groups ({groups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PHONE_SYNC")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "PHONE_SYNC"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Phone Contact Sync</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SYNC_HISTORY")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "SYNC_HISTORY"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Sync History ({syncLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("IMPORT_EXPORT")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "IMPORT_EXPORT"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Import / Export</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUB-SECTION 1: ALL CONTACTS DIRECTORY                                 */}
      {/* ===================================================================== */}
      {activeTab === "ALL_CONTACTS" && (
        <div className="space-y-4">
          {/* Search, Filters, and Select All Header */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, phone number, role, EPIC ID, or booth..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Group Filter Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedGroupFilter}
                  onChange={(e) => setSelectedGroupFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Contact Groups</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      📁 {g.name} ({g.memberIds.length})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="px-3 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold rounded-xl text-xs border border-purple-200 dark:border-purple-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>+ Group</span>
                </button>
              </div>
            </div>

            {/* Sub-Filters and Select All Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      isAllSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    }`}
                  >
                    {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{isAllSelected ? "Deselect All" : "Select All"}</span>
                </button>

                <span className="text-xs text-slate-400">
                  Showing {filteredContacts.length} of {contacts.length} contacts
                </span>
              </div>

              {/* Contact Type Toggle Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setContactTypeFilter("ALL")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    contactTypeFilter === "ALL"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  All ({contacts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setContactTypeFilter("VOTER")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    contactTypeFilter === "VOTER"
                      ? "bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  Voters ({contacts.filter((c) => c.type === "VOTER").length})
                </button>
                <button
                  type="button"
                  onClick={() => setContactTypeFilter("CAMPAIGN_TEAM")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    contactTypeFilter === "CAMPAIGN_TEAM"
                      ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  Team ({contacts.filter((c) => c.type === "CAMPAIGN_TEAM").length})
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => {
              const isSelected = selectedContactIds.includes(contact.id);
              const contactGroups = groups.filter((g) => contact.groups.includes(g.id));

              return (
                <div
                  key={contact.id}
                  className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div>
                    {/* Header Row: Checkbox, Name, Tag Badges */}
                    <div className="flex items-start gap-3 mb-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectOne(contact.id)}
                        className="mt-0.5 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3
                            className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors truncate"
                            onClick={() => {
                              const electorMatch = SEED_ELECTORS.find((e) => e.id === contact.id);
                              if (electorMatch) setSelectedVoter(electorMatch);
                            }}
                          >
                            {contact.name}
                          </h3>
                          {contact.hindiName && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                              {contact.hindiName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {contact.roleOrDesignation}
                        </p>
                      </div>

                      {/* Status / Leaning Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          contact.type === "CAMPAIGN_TEAM"
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                            : contact.politicalLeaning === "STRONG_SUPPORTER"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : contact.politicalLeaning === "LEANING_SUPPORTER"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {contact.type === "CAMPAIGN_TEAM"
                          ? "STAFF"
                          : contact.politicalLeaning?.replace(/_/g, " ") || "VOTER"}
                      </span>
                    </div>

                    {/* Card Info Box */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs space-y-1.5 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Mobile Phone:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {contact.phone}
                        </span>
                      </div>
                      {contact.epicNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">EPIC ID:</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            {contact.epicNumber}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Assigned Area:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[170px]">
                          {contact.prabhaag || `Booth #${contact.boothNumber}`}
                        </span>
                      </div>
                    </div>

                    {/* Groups Assigned Tags */}
                    {contactGroups.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap mb-3">
                        {contactGroups.map((g) => (
                          <span
                            key={g.id}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Action Row: Call, WhatsApp, View Profile */}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleCall(contact.name, contact.phone)}
                      className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      <span>Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWhatsApp(contact.name, contact.phone)}
                      className="flex-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                    {contact.type === "VOTER" && (
                      <button
                        type="button"
                        onClick={() => {
                          const match = SEED_ELECTORS.find((e) => e.id === contact.id);
                          if (match) setSelectedVoter(match);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-SECTION 2: CONTACT GROUPS MANAGEMENT                             */}
      {/* ===================================================================== */}
      {activeTab === "CONTACT_GROUPS" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Custom Contact Groups</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Organize voters, influencers, and campaign staff into targeted cohorts for synchronized outreach.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateGroupModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Group</span>
            </button>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => {
              const members = contacts.filter((c) => group.memberIds.includes(c.id));

              return (
                <div
                  key={group.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-purple-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{group.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingGroup(group)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Edit Group"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Delete Group"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Members Counter & Avatars Stack */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {members.length} Enrolled Members
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Updated on {group.updatedAt}
                      </span>
                    </div>

                    {/* Member Avatars Stack */}
                    <div className="flex -space-x-1.5">
                      {members.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          className="w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs"
                          title={m.name}
                        >
                          {m.name.charAt(0)}
                        </div>
                      ))}
                      {members.length > 4 && (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                          +{members.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: Manage Members, Sync Group, Export */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveGroupForMembers(group)}
                      className="flex-1 py-1.5 px-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Manage Members</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDownloadVCard(members);
                      }}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Export Group as vCard"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>vCard</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-SECTION 3: PHONE CONTACT SYNC (NATIVE OS EMULATOR)                */}
      {/* ===================================================================== */}
      {activeTab === "PHONE_SYNC" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Mobile Device Synchronization Engine
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Save Contacts to Mobile Phone
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Sync single or multiple verified voters, community influencers, and karyakartas straight into your mobile device's address book with native OS permission checks and automated duplicate prevention.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                <Smartphone className="w-8 h-8" />
              </div>
            </div>

            {/* Target Device Selection */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Select Connected Target Device / Format:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSyncTargetDevice("IOS")}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    syncTargetDevice === "IOS"
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Apple iPhone / iPad
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    iCloud Address Book (iOS 16, 17, 18)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSyncTargetDevice("ANDROID")}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    syncTargetDevice === "ANDROID"
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Android Smartphone
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Google Contacts (Android 12, 13, 14)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSyncTargetDevice("VCARD_FILE")}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    syncTargetDevice === "VCARD_FILE"
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Direct vCard (.vcf) Package
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Universal Contact File for any phone
                  </span>
                </button>
              </div>
            </div>

            {/* Duplicate Detection & Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Duplicate Detection Protocol
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Scans phone numbers in E.164 standard (+91...). If a contact already exists in device memory, selects action:
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="dup"
                      checked={duplicateStrategy === "MERGE"}
                      onChange={() => setDuplicateStrategy("MERGE")}
                      className="text-blue-600"
                    />
                    <span>Merge &amp; Update Existing</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="dup"
                      checked={duplicateStrategy === "SKIP"}
                      onChange={() => setDuplicateStrategy("SKIP")}
                      className="text-blue-600"
                    />
                    <span>Skip Duplicates</span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Synchronization Queue Scope
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {selectedContactIds.length > 0
                      ? `${selectedContactIds.length} Contacts selected from list`
                      : `All ${contacts.length} verified contacts in constituency roll`}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleStartDeviceSync}
                    disabled={isSyncing}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Sync Directly to Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadVCard()}
                    className="py-2.5 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    title="Download vCard .vcf File"
                  >
                    <Download className="w-4 h-4" />
                    <span>.vcf</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sync Progress Bar */}
            {isSyncing && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900 dark:text-blue-300">{syncLogText}</span>
                  <span className="font-bold text-blue-900 dark:text-blue-300">{syncProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-SECTION 4: SYNC HISTORY AUDIT LOG                                 */}
      {/* ===================================================================== */}
      {activeTab === "SYNC_HISTORY" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Contact Sync Audit Trail</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cryptographic log of all device synchronization runs, duplicate detection passes, and export records.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const headers = ["Timestamp", "Device", "Total", "Success", "Duplicate", "Failed", "Operator"];
                  const rows = syncLogs.map((l) => [
                    `"${l.timestamp}"`,
                    `"${l.targetDevice}"`,
                    l.totalProcessed,
                    l.successfulCount,
                    l.duplicateCount,
                    l.failedCount,
                    `"${l.operator}"`,
                  ]);
                  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
                  const link = document.createElement("a");
                  link.href = encodeURI(csv);
                  link.download = `Sync_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`;
                  link.click();
                  showToast("success", "Audit Exported", "Sync audit log saved as CSV.");
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Target Device</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Processed</th>
                    <th className="py-3 px-4 text-center">Success</th>
                    <th className="py-3 px-4 text-center">Duplicates</th>
                    <th className="py-3 px-4">Operator</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {syncLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {log.targetDevice}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                        {log.totalProcessed}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {log.successfulCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-600 dark:text-amber-400">
                        {log.duplicateCount}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 truncate max-w-[160px]">
                        {log.operator}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[220px]">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-SECTION 5: IMPORT / EXPORT DATA PORTABILITY                       */}
      {/* ===================================================================== */}
      {activeTab === "IMPORT_EXPORT" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel A: Import Contacts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Import Contact Records</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Import voter contacts, society rosters, or party worker lists in CSV, vCard (.vcf), or Excel format.
              </p>

              {/* Drag and Drop Zone */}
              <div className="mt-4 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/40 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {importFileName ? importFileName : "Drag & drop contact file here, or click to browse"}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Supported formats: .CSV, .VCF (vCard 3.0), .XLSX (Max 25MB)
                </span>
                <input
                  type="file"
                  accept=".csv,.vcf,.xlsx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImportFileName(e.target.files[0].name);
                    }
                  }}
                  className="mt-3 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* Column Mapping Preview Info */}
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Auto-Detected Field Headers:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Full Name, Mobile Phone (E.164), Role/Designation, Booth No, EPIC ID
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSimulateImport}
                disabled={isImporting || !importFileName}
                className={`flex-1 py-2.5 px-4 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer ${
                  importFileName
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{isImporting ? "Processing Import..." : "Import Contacts Now"}</span>
              </button>
            </div>
          </div>

          {/* Panel B: Export Contacts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Export Contact Records</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate authenticated contact exports for campaign smartphones, WhatsApp blast engines, or tele-calling teams.
              </p>

              {/* Filter Export Scope */}
              <div className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Contacts to Export:
                  </label>
                  <select
                    value={exportScope}
                    onChange={(e) => setExportScope(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="ALL">All Contacts ({contacts.length} total)</option>
                    <option value="VOTER">Voters Only ({contacts.filter((c) => c.type === "VOTER").length})</option>
                    <option value="CAMPAIGN_TEAM">Campaign Team Only ({contacts.filter((c) => c.type === "CAMPAIGN_TEAM").length})</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        Group: {g.name} ({g.memberIds.length})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Choose Export File Format:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setExportFormat("VCF")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        exportFormat === "VCF"
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                      }`}
                    >
                      <span className="font-bold text-slate-900 dark:text-white block">vCard (.vcf)</span>
                      <span className="text-[10px] text-slate-400 block">Mobile address book import</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExportFormat("CSV")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        exportFormat === "CSV"
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                      }`}
                    >
                      <span className="font-bold text-slate-900 dark:text-white block">Excel / CSV (.csv)</span>
                      <span className="text-[10px] text-slate-400 block">Spreadsheet &amp; blast engines</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  let list = contacts;
                  if (exportScope === "VOTER") list = contacts.filter((c) => c.type === "VOTER");
                  else if (exportScope === "CAMPAIGN_TEAM") list = contacts.filter((c) => c.type === "CAMPAIGN_TEAM");
                  else if (exportScope !== "ALL") list = contacts.filter((c) => c.groups.includes(exportScope));

                  if (exportFormat === "VCF") {
                    handleDownloadVCard(list);
                  } else {
                    handleDownloadCSV(list);
                  }
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export {exportFormat} File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CONTEXTUAL FLOATING BULK ACTIONS BAR (When contacts are selected)     */}
      {/* ===================================================================== */}
      {selectedContactIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white border border-slate-700 shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-4 animate-scaleUp">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-extrabold text-xs">
              {selectedContactIds.length} Selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Create Group from Selected */}
            <button
              type="button"
              onClick={() => setIsCreateGroupModalOpen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Create Group</span>
            </button>

            {/* Quick Add to Existing Group */}
            {groups.length > 0 && (
              <div className="relative group">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Add to Group...</span>
                </button>
                <div className="absolute bottom-full mb-2 left-0 hidden group-hover:block bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-1 w-48 z-50">
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleBulkAddToGroup(g.id)}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors truncate"
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bulk Sync */}
            <button
              type="button"
              onClick={handleStartDeviceSync}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Sync to Device</span>
            </button>

            {/* Export Selected */}
            <button
              type="button"
              onClick={() => {
                const list = contacts.filter((c) => selectedContactIds.includes(c.id));
                handleDownloadVCard(list);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download selected contacts as vCard (.vcf)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export (.vcf)</span>
            </button>

            {/* Clear Selection */}
            <button
              type="button"
              onClick={() => setSelectedContactIds([])}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title="Clear Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CREATE NEW GROUP MODAL                                                */}
      {/* ===================================================================== */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Create Contact Group</h3>
                <p className="text-xs text-slate-500">Group contacts for targeted campaign operations.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateGroupModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ward 12 Senior Voters, Youth Team..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Purpose
                </label>
                <textarea
                  placeholder="Describe the members and target campaign outreach strategy..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Color Tag
                </label>
                <div className="flex items-center gap-2">
                  {(["purple", "blue", "teal", "amber", "rose"] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewGroupColor(color)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        newGroupColor === color
                          ? "ring-2 ring-blue-500 shadow-xs"
                          : "opacity-70 hover:opacity-100"
                      } ${
                        color === "purple"
                          ? "bg-purple-100 text-purple-800"
                          : color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : color === "teal"
                          ? "bg-teal-100 text-teal-800"
                          : color === "amber"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {selectedContactIds.length > 0 && (
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 text-[11px] font-semibold">
                  ✓ {selectedContactIds.length} currently selected contacts will be automatically enrolled.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* EDIT GROUP MODAL                                                      */}
      {/* ===================================================================== */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Edit Group Details</h3>
              <button
                type="button"
                onClick={() => setEditingGroup(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateGroup} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Group Name</label>
                <input
                  type="text"
                  value={editingGroup.name}
                  onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  value={editingGroup.description}
                  onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingGroup(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Update Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MANAGE GROUP MEMBERS MODAL                                            */}
      {/* ===================================================================== */}
      {activeGroupForMembers && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {activeGroupForMembers.name} — Members
                </h3>
                <p className="text-xs text-slate-500">
                  {activeGroupForMembers.memberIds.length} enrolled contacts
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGroupForMembers(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {contacts
                .filter((c) => activeGroupForMembers.memberIds.includes(c.id))
                .map((member) => (
                  <div key={member.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{member.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {member.phone} • {member.roleOrDesignation}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMemberFromGroup(activeGroupForMembers.id, member.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                To add more members, select contacts in "All Contacts" tab and click "Add to Group".
              </span>
              <button
                type="button"
                onClick={() => setActiveGroupForMembers(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* OS CONTACT PERMISSION PROMPT SIMULATOR MODAL                          */}
      {/* ===================================================================== */}
      {showPermissionPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Smartphone className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                “INDATA Candidate Portal” Would Like to Access Your Contacts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This enables one-click saving of verified voters and field coordinators to your native device address book.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPermissionPrompt(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Don't Allow
              </button>
              <button
                type="button"
                onClick={executeSync}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
              >
                Allow Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
