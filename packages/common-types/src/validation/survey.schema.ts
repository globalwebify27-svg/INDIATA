import { z } from "zod";
import {
  SlipChannel,
  SlipStatus,
  TicketPriority,
  TicketStatus,
} from "../enums/survey.enum";

// ============================================================================
// SURVEY SCHEMAS
// ============================================================================

export const SurveyQueryDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  voterId: z.string().trim().optional(),
  karyakartaId: z.string().trim().optional(),
  isGeotagged: z.preprocess((val) => {
    if (typeof val === "string") return val.toLowerCase() === "true";
    return val;
  }, z.boolean().optional()),
  welfareScheme: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "welfareScheme"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SurveyQueryDto = z.infer<typeof SurveyQueryDtoSchema>;

export const CreateSurveyDtoSchema = z.object({
  voterId: z.string().trim().min(1, "Voter ID is required"),
  karyakartaId: z.string().trim().optional(),
  welfareScheme: z.string().trim().max(200).optional(),
  feedbackNotes: z.string().trim().optional(),
  citizenDemands: z.string().trim().optional(),
  gpsLat: z.coerce.number().min(-90).max(90).optional(),
  gpsLng: z.coerce.number().min(-180).max(180).optional(),
  isGeotagged: z.boolean().optional(),
});

export type CreateSurveyDto = z.infer<typeof CreateSurveyDtoSchema>;

export const UpdateSurveyDtoSchema = CreateSurveyDtoSchema.partial();
export type UpdateSurveyDto = z.infer<typeof UpdateSurveyDtoSchema>;

// ============================================================================
// VOTER SLIP SCHEMAS
// ============================================================================

export const SlipQueryDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  voterId: z.string().trim().optional(),
  channel: z.nativeEnum(SlipChannel).optional(),
  status: z.nativeEnum(SlipStatus).optional(),
  dispatchedById: z.string().trim().optional(),
  sortBy: z.enum(["dispatchedAt", "status", "channel"]).default("dispatchedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SlipQueryDto = z.infer<typeof SlipQueryDtoSchema>;

export const CreateSlipDispatchDtoSchema = z.object({
  voterId: z.string().trim().min(1, "Voter ID is required"),
  channel: z.nativeEnum(SlipChannel).default(SlipChannel.WHATSAPP_DIGITAL),
  status: z.nativeEnum(SlipStatus).default(SlipStatus.GENERATED),
  dispatchedById: z.string().trim().optional(),
});

export type CreateSlipDispatchDto = z.infer<typeof CreateSlipDispatchDtoSchema>;

export const BulkSlipDispatchDtoSchema = z.object({
  voterIds: z.array(z.string().trim()).min(1, "At least one voter ID required"),
  channel: z.nativeEnum(SlipChannel).default(SlipChannel.WHATSAPP_DIGITAL),
  status: z.nativeEnum(SlipStatus).default(SlipStatus.GENERATED),
});

export type BulkSlipDispatchDto = z.infer<typeof BulkSlipDispatchDtoSchema>;

export const UpdateSlipStatusDtoSchema = z.object({
  status: z.nativeEnum(SlipStatus),
});

export type UpdateSlipStatusDto = z.infer<typeof UpdateSlipStatusDtoSchema>;

// ============================================================================
// ISSUE TICKET SCHEMAS
// ============================================================================

export const TicketQueryDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  category: z.string().trim().optional(),
  voterBooth: z.string().trim().optional(),
  assignedTo: z.string().trim().optional(),
  karyakartaId: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "priority", "status", "ticketNumber"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TicketQueryDto = z.infer<typeof TicketQueryDtoSchema>;

export const CreateTicketDtoSchema = z.object({
  voterId: z.string().trim().optional(),
  voterName: z.string().trim().max(150).optional(),
  voterPhone: z.string().trim().max(20).optional(),
  voterBooth: z.string().trim().max(50).optional(),
  category: z.string().trim().min(1, "Category is required").max(100),
  title: z.string().trim().max(255).optional(),
  description: z.string().trim().min(1, "Description is required"),
  priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
  status: z.nativeEnum(TicketStatus).default(TicketStatus.NEW),
  location: z.string().trim().max(255).optional(),
  assignedTo: z.string().trim().max(150).optional(),
  attachments: z.string().trim().optional(),
  karyakartaId: z.string().trim().optional(),
  karyakartaName: z.string().trim().max(150).optional(),
});

export type CreateTicketDto = z.infer<typeof CreateTicketDtoSchema>;

export const UpdateTicketDtoSchema = z.object({
  title: z.string().trim().max(255).optional(),
  description: z.string().trim().optional(),
  category: z.string().trim().max(100).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  location: z.string().trim().max(255).optional(),
  assignedTo: z.string().trim().max(150).optional(),
  resolutionNotes: z.string().trim().optional(),
  attachments: z.string().trim().optional(),
});

export type UpdateTicketDto = z.infer<typeof UpdateTicketDtoSchema>;

// ============================================================================
// CORRECTION PROPOSAL SCHEMAS
// ============================================================================

export const CreateCorrectionDtoSchema = z.object({
  voterId: z.string().trim().min(1, "Voter ID is required"),
  proposedDataJson: z.string().trim().min(2, "Proposed data JSON is required"),
  reason: z.string().trim().min(1, "Reason is required"),
});

export type CreateCorrectionDto = z.infer<typeof CreateCorrectionDtoSchema>;

export const ReviewCorrectionDtoSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().trim().optional(),
});

export type ReviewCorrectionDto = z.infer<typeof ReviewCorrectionDtoSchema>;
