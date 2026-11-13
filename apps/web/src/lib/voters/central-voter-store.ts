import {
  VoterRecord,
  IssueTicket,
} from "@/karyakarta/types/karyakarta.types";
import {
  MOCK_SCOPED_VOTERS,
  MOCK_ISSUES,
} from "@/karyakarta/data/mock-karyakarta-data";

export interface VoterSearchResult {
  voter: VoterRecord;
  matchType: "exact" | "fuzzy";
  score: number;
  matchedOn: string;
}

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (a.charAt(i - 1).toLowerCase() === b.charAt(j - 1).toLowerCase()) {
        curr[j] = prev[j - 1] ?? 0;
      } else {
        const costDelete = prev[j] ?? 0;
        const costInsert = curr[j - 1] ?? 0;
        const costSubstitute = prev[j - 1] ?? 0;
        curr[j] = 1 + Math.min(costDelete, costInsert, costSubstitute);
      }
    }
    const temp = prev;
    prev = curr;
    curr = temp;
  }
  return prev[n] ?? 0;
}

class CentralVoterStore {
  private voters: Map<string, VoterRecord> = new Map();
  private tickets: Map<string, IssueTicket> = new Map();

  constructor() {
    this.seed();
  }

  public seed() {
    this.voters.clear();
    this.tickets.clear();

    for (const v of MOCK_SCOPED_VOTERS) {
      this.voters.set(v.id, {
        ...v,
        source: v.source || "ECI_IMPORT",
        status: v.status || "Verified",
        organizationId: v.organizationId || "org-kasba-peth-2026",
      });
    }

    for (const t of MOCK_ISSUES) {
      this.tickets.set(t.id, {
        ...t,
        organizationId: t.organizationId || "org-kasba-peth-2026",
      });
    }
  }

  // Retrieve all voters (optionally scoped)
  public getAllVoters(organizationId?: string, boothNumbers?: string[]): VoterRecord[] {
    const all = Array.from(this.voters.values());
    return all.filter((v) => {
      if (organizationId && v.organizationId && v.organizationId !== organizationId) {
        return false;
      }
      if (boothNumbers && boothNumbers.length > 0 && !boothNumbers.includes(v.boothNumber)) {
        return false;
      }
      return true;
    });
  }

  // Get voter by ID
  public getVoterById(id: string): VoterRecord | null {
    return this.voters.get(id) || null;
  }

  // Get voter by EPIC
  public getVoterByEpic(epicId: string): VoterRecord | null {
    const clean = epicId.trim().toUpperCase();
    for (const v of this.voters.values()) {
      if (v.epicId.toUpperCase() === clean) {
        return v;
      }
    }
    return null;
  }

  // Exact & Fuzzy Search
  public searchVoters(
    query: string,
    options?: {
      organizationId?: string;
      boothNumbers?: string[];
      limit?: number;
    }
  ): VoterSearchResult[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const candidates = this.getAllVoters(options?.organizationId, options?.boothNumbers);
    const results: VoterSearchResult[] = [];
    const cleanQueryPhone = q.replace(/[^0-9]/g, "");

    for (const voter of candidates) {
      const vName = voter.name.toLowerCase();
      const vMarathi = (voter.marathiName || "").toLowerCase();
      const vEpic = (voter.epicId || "").toLowerCase();
      const vPhone = (voter.phone || "").replace(/[^0-9]/g, "");
      const vHouse = (voter.houseNo || "").toLowerCase();
      const vAddress = (voter.address || "").toLowerCase();

      // 1. Check Exact Matches
      if (vEpic && vEpic === q) {
        results.push({ voter, matchType: "exact", score: 100, matchedOn: "EPIC ID (Exact)" });
        continue;
      }
      if (cleanQueryPhone.length >= 10 && vPhone && vPhone.endsWith(cleanQueryPhone.slice(-10))) {
        results.push({ voter, matchType: "exact", score: 98, matchedOn: "Mobile Number (Exact)" });
        continue;
      }
      if (vName === q || vMarathi === q) {
        results.push({ voter, matchType: "exact", score: 95, matchedOn: "Name (Exact)" });
        continue;
      }

      // 2. Check Strong Substring / Prefix Matches
      if (vEpic.startsWith(q) || (q.length >= 4 && vEpic.includes(q))) {
        results.push({ voter, matchType: "exact", score: 85, matchedOn: "EPIC ID (Prefix/Substring)" });
        continue;
      }
      if (vName.includes(q) || vMarathi.includes(q)) {
        results.push({ voter, matchType: "fuzzy", score: 80, matchedOn: "Name (Substring)" });
        continue;
      }
      if (cleanQueryPhone.length >= 4 && vPhone.includes(cleanQueryPhone)) {
        results.push({ voter, matchType: "fuzzy", score: 75, matchedOn: "Mobile (Partial)" });
        continue;
      }
      if (vHouse.includes(q) || vAddress.includes(q)) {
        results.push({ voter, matchType: "fuzzy", score: 70, matchedOn: "Address / House No" });
        continue;
      }

      // 3. Levenshtein / Word Token Fuzzy Match
      const words = q.split(/\s+/).filter(Boolean);
      const voterWords = vName.split(/\s+/).filter(Boolean);
      let bestWordDistance = 999;

      for (const qw of words) {
        if (qw.length < 3) continue;
        for (const vw of voterWords) {
          const dist = levenshteinDistance(qw, vw);
          if (dist < bestWordDistance) {
            bestWordDistance = dist;
          }
        }
      }

      if (bestWordDistance <= 2) {
        results.push({
          voter,
          matchType: "fuzzy",
          score: Math.max(50, 65 - bestWordDistance * 10),
          matchedOn: `Fuzzy Name Match (Levenshtein dist ${bestWordDistance})`,
        });
      }
    }

    // Sort by score descending (exact matches first)
    results.sort((a, b) => b.score - a.score);

    const limit = options?.limit ?? 10;
    return results.slice(0, limit);
  }

  // Create New Voter Profile (All Fields Optional)
  public createVoter(
    input: Partial<VoterRecord>,
    context?: {
      karyakartaId?: string;
      organizationId?: string;
    }
  ): { voter: VoterRecord; isDuplicateWarning?: boolean; duplicateOfId?: string } {
    // Check duplicate by EPIC if provided
    let isDuplicateWarning = false;
    let duplicateOfId: string | undefined = undefined;

    if (input.epicId && input.epicId.trim()) {
      const existing = this.getVoterByEpic(input.epicId.trim());
      if (existing) {
        isDuplicateWarning = true;
        duplicateOfId = existing.id;
        // Quarantine instead of overwriting
        const quarantinedVoter: VoterRecord = {
          ...existing,
          status: "Quarantined",
          remarks: `${existing.remarks || ""} | Potential duplicate submitted by Karyakarta ${context?.karyakartaId || ""}`,
        };
        this.voters.set(existing.id, quarantinedVoter);
        return { voter: quarantinedVoter, isDuplicateWarning: true, duplicateOfId: existing.id };
      }
    }

    // Generate unique ID
    const newId = `v-new-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
    const epicGenerated = input.epicId?.trim().toUpperCase() || `TEMP${Date.now().toString().slice(-6)}`;

    const newVoter: VoterRecord = {
      id: newId,
      epicId: epicGenerated,
      serialNumber: input.serialNumber || undefined,
      name: input.name?.trim() || "Unspecified Citizen",
      marathiName: input.marathiName?.trim() || "",
      relativeName: input.relativeName?.trim() || "",
      relation: input.relation || "Other",
      age: input.age ?? 0,
      gender: input.gender || "Other",
      dob: input.dob?.trim() || "",
      houseNo: input.houseNo?.trim() || "",
      address: input.address?.trim() || "",
      village: input.village?.trim() || "Kasba Peth",
      ward: input.ward?.trim() || "Ward 12",
      prabhaag: input.prabhaag?.trim() || "Prabhaag 18",
      electoralPart: input.electoralPart?.trim() || "Part 42",
      boothNumber: input.boothNumber?.trim() || "#101",
      boothName: input.boothName?.trim() || "Navbharat High School",
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      hasPhoto: !!input.hasPhoto,
      caste: input.caste?.trim() || "",
      occupation: input.occupation?.trim() || "",
      qualification: input.qualification?.trim() || "",
      scheme: input.scheme?.trim() || "",
      demand: input.demand?.trim() || "",
      candidateHelp: input.candidateHelp?.trim() || "",
      extraInfo: input.extraInfo?.trim() || "",
      remarks: input.remarks?.trim() || "",
      classification: input.classification || "Neutral",
      status: input.status || "Verified",
      source: "KARYAKARTA_CREATED",
      isImportant: !!input.isImportant,
      isFavourite: !!input.isFavourite,
      isVisited: !!input.isVisited,
      isVoted: !!input.isVoted,
      isOutside: !!input.isOutside,
      isDeceased: !!input.isDeceased,
      lastVisitDate: input.isVisited
        ? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : null,
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      assignedKaryakartaId: context?.karyakartaId || input.assignedKaryakartaId || "KAR-2026-001",
      familyId: input.familyId?.trim() || `fam-${Date.now().toString().slice(-4)}`,
      familyHead: !!input.familyHead,
      familyMembersCount: input.familyMembersCount || 1,
      organizationId: context?.organizationId || input.organizationId || "org-kasba-peth-2026",
      createdById: context?.karyakartaId || "KAR-2026-001",
    };

    this.voters.set(newVoter.id, newVoter);
    return { voter: newVoter, isDuplicateWarning, duplicateOfId };
  }

  // Update existing voter
  public updateVoter(id: string, updates: Partial<VoterRecord>): VoterRecord | null {
    const existing = this.voters.get(id);
    if (!existing) return null;

    const updated: VoterRecord = {
      ...existing,
      ...updates,
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    this.voters.set(id, updated);
    return updated;
  }

  // Retrieve Tickets (optionally scoped)
  public getAllTickets(organizationId?: string, boothNumbers?: string[]): IssueTicket[] {
    const all = Array.from(this.tickets.values());
    return all.filter((t) => {
      if (organizationId && t.organizationId && t.organizationId !== organizationId) {
        return false;
      }
      if (boothNumbers && boothNumbers.length > 0 && !boothNumbers.includes(t.voterBooth)) {
        return false;
      }
      return true;
    });
  }

  // Create Issue Ticket with Voter Linkage
  public createTicket(
    input: Partial<IssueTicket>,
    context?: {
      karyakartaId?: string;
      karyakartaName?: string;
      organizationId?: string;
    }
  ): IssueTicket {
    const newId = `iss-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
    const ticketNum = input.ticketNumber || `TKT-2026-${Math.floor(100 + Math.random() * 900)}`;

    // Resolve associated voter if voterId provided
    let matchedVoter: VoterRecord | null = null;
    if (input.voterId) {
      matchedVoter = this.getVoterById(input.voterId);
    }

    const newTicket: IssueTicket = {
      id: newId,
      ticketNumber: ticketNum,
      voterId: input.voterId ?? (matchedVoter ? matchedVoter.id : null),
      voterName: matchedVoter?.name || input.voterName?.trim() || "Citizen",
      voterPhone: matchedVoter?.phone || input.voterPhone?.trim() || "+91 98000 00000",
      voterBooth: matchedVoter?.boothNumber || input.voterBooth || "#101",
      karyakartaId: context?.karyakartaId || input.karyakartaId || "KAR-2026-001",
      karyakartaName: context?.karyakartaName || input.karyakartaName || "Sachin D. Mane",
      category: input.category || "Other",
      title: input.title?.trim() || input.description?.slice(0, 50) || "Field Grievance",
      description: input.description?.trim() || "No detailed description provided.",
      priority: input.priority || "MEDIUM",
      status: "NEW",
      location: input.location?.trim() || matchedVoter?.address || "",
      assignedTo: input.assignedTo || `${input.voterBooth || "#101"} Quick Response Cell`,
      organizationId: context?.organizationId || input.organizationId || "org-kasba-peth-2026",
      attachments: input.attachments || [],
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      resolutionNotes: null,
      followUps: [],
    };

    this.tickets.set(newTicket.id, newTicket);
    return newTicket;
  }

  // Update Ticket Status or Add Follow-Up
  public updateTicket(
    id: string,
    updates: Partial<IssueTicket>,
    newFollowUpNote?: { author: string; note: string }
  ): IssueTicket | null {
    const existing = this.tickets.get(id);
    if (!existing) return null;

    const followUps = [...existing.followUps];
    if (newFollowUpNote && newFollowUpNote.note.trim()) {
      followUps.push({
        id: `fl-${Date.now()}`,
        author: newFollowUpNote.author,
        note: newFollowUpNote.note.trim(),
        timestamp: "Just now",
      });
    }

    const updated: IssueTicket = {
      ...existing,
      ...updates,
      followUps,
      updatedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    this.tickets.set(id, updated);
    return updated;
  }
}

// Global singleton instance for Next.js App Router (persists across API requests in Node runtime)
const globalForVoterStore = globalThis as unknown as {
  __centralVoterStore__?: CentralVoterStore;
};

export const centralVoterStore =
  globalForVoterStore.__centralVoterStore__ ?? new CentralVoterStore();

if (process.env.NODE_ENV !== "production") {
  globalForVoterStore.__centralVoterStore__ = centralVoterStore;
}
