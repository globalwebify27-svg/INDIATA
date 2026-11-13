import {
  VoterRecord,
  IssueTicket,
} from "../types/karyakarta.types";
import { centralVoterStore, VoterSearchResult } from "@/lib/voters/central-voter-store";

export interface CreateVoterResponse {
  success: boolean;
  data?: VoterRecord;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  isDuplicateWarning?: boolean;
}

export interface CreateTicketResponse {
  success: boolean;
  data?: IssueTicket;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export class VoterTicketService {
  // Search voters using exact and fuzzy matching
  public static async searchVoters(
    query: string,
    options?: { booth?: string; organizationId?: string; limit?: number }
  ): Promise<VoterSearchResult[]> {
    if (!query.trim()) return [];

    try {
      const params = new URLSearchParams({ q: query.trim() });
      if (options?.booth && options.booth !== "all") params.append("booth", options.booth);
      if (options?.organizationId) params.append("organizationId", options.organizationId);
      if (options?.limit) params.append("limit", options.limit.toString());

      const res = await fetch(`/api/voters?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Fallback to in-memory store if network/SSR issue
    }

    // Direct store fallback
    const boothNumbers = options?.booth && options.booth !== "all" ? [options.booth] : undefined;
    return centralVoterStore.searchVoters(query, {
      organizationId: options?.organizationId,
      boothNumbers,
      limit: options?.limit ?? 10,
    });
  }

  // Create new voter profile (all fields optional)
  public static async createVoter(
    voterData: Partial<VoterRecord>,
    context?: { karyakartaId?: string; organizationId?: string }
  ): Promise<CreateVoterResponse> {
    try {
      const res = await fetch("/api/voters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(context?.karyakartaId ? { "x-karyakarta-id": context.karyakartaId } : {}),
          ...(context?.organizationId ? { "x-organization-id": context.organizationId } : {}),
        },
        body: JSON.stringify(voterData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        return {
          success: true,
          data: json.data,
          isDuplicateWarning: json.isDuplicateWarning,
        };
      }

      if (json.fieldErrors) {
        return {
          success: false,
          error: json.error || "Please correct highlighted fields.",
          fieldErrors: json.fieldErrors,
        };
      }

      return {
        success: false,
        error: json.error || "Failed to create voter profile.",
      };
    } catch {
      // Direct store fallback
      try {
        const result = centralVoterStore.createVoter(voterData, context);
        return {
          success: true,
          data: result.voter,
          isDuplicateWarning: result.isDuplicateWarning,
        };
      } catch (err: unknown) {
        return {
          success: false,
          error: (err as Error)?.message || "Failed to save voter record.",
        };
      }
    }
  }

  // Create issue ticket
  public static async createTicket(
    ticketData: Partial<IssueTicket>,
    context?: { karyakartaId?: string; karyakartaName?: string; organizationId?: string }
  ): Promise<CreateTicketResponse> {
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(context?.karyakartaId ? { "x-karyakarta-id": context.karyakartaId } : {}),
          ...(context?.karyakartaName ? { "x-karyakarta-name": context.karyakartaName } : {}),
          ...(context?.organizationId ? { "x-organization-id": context.organizationId } : {}),
        },
        body: JSON.stringify(ticketData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        return {
          success: true,
          data: json.data,
        };
      }

      return {
        success: false,
        error: json.error || "Failed to register grievance ticket.",
        fieldErrors: json.fieldErrors,
      };
    } catch {
      // Direct store fallback
      try {
        const ticket = centralVoterStore.createTicket(ticketData, context);
        return {
          success: true,
          data: ticket,
        };
      } catch (err: unknown) {
        return {
          success: false,
          error: (err as Error)?.message || "Failed to create issue ticket.",
        };
      }
    }
  }

  // Update ticket status or follow up
  public static async updateTicket(
    ticketId: string,
    updates: Partial<IssueTicket>,
    followUpNote?: { author: string; note: string }
  ): Promise<boolean> {
    try {
      const res = await fetch(`/api/issues/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, followUpNote }),
      });
      const json = await res.json();
      return json.success;
    } catch {
      centralVoterStore.updateTicket(ticketId, updates, followUpNote);
      return true;
    }
  }
}
