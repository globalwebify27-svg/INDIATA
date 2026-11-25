import { z } from "zod";
import { BroadcastScope, BroadcastPriority } from "../enums/polling.enum";

// ============================================================================
// HOURLY TURNOUT SCHEMAS
// ============================================================================

export const RecordHourlyTurnoutDtoSchema = z.object({
  boothNumber: z.string().trim().min(1, "Booth number is required"),
  timeSlot: z.string().trim().min(1, "Time slot is required"), // e.g. "09:00 - 11:00"
  maleVoted: z.coerce.number().int().min(0).default(0),
  femaleVoted: z.coerce.number().int().min(0).default(0),
  cumulativePct: z.coerce.number().min(0).max(100).optional(),
});

export type RecordHourlyTurnoutDto = z.infer<typeof RecordHourlyTurnoutDtoSchema>;

export const QueryHourlyTurnoutDtoSchema = z.object({
  boothNumber: z.string().trim().optional(),
  timeSlot: z.string().trim().optional(),
});

export type QueryHourlyTurnoutDto = z.infer<typeof QueryHourlyTurnoutDtoSchema>;

// ============================================================================
// BROADCAST NOTIFICATIONS (LPIANE ENGINE)
// ============================================================================

export const CreateBroadcastNotificationDtoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  message: z.string().trim().min(1, "Message is required"),
  scope: z.nativeEnum(BroadcastScope).default(BroadcastScope.ALL_CADRE),
  targetBoothNumber: z.string().trim().optional(),
  priority: z.nativeEnum(BroadcastPriority).default(BroadcastPriority.NORMAL),
});

export type CreateBroadcastNotificationDto = z.infer<typeof CreateBroadcastNotificationDtoSchema>;

export const QueryBroadcastNotificationDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  scope: z.nativeEnum(BroadcastScope).optional(),
  targetBoothNumber: z.string().trim().optional(),
});

export type QueryBroadcastNotificationDto = z.infer<typeof QueryBroadcastNotificationDtoSchema>;

// ============================================================================
// TURNOUT AUDIT LEDGER
// ============================================================================

export const QueryTurnoutAuditDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  boothNumber: z.string().trim().optional(),
  voterId: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export type QueryTurnoutAuditDto = z.infer<typeof QueryTurnoutAuditDtoSchema>;
