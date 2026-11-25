import { z } from "zod";
import { CampaignChannel, CampaignStatus } from "../enums/campaign.enum";
import { VoterClassification } from "../enums/voter.enum";

// ============================================================================
// CAMPAIGN SCHEMAS
// ============================================================================

export const CreateCampaignDtoSchema = z.object({
  name: z.string().trim().min(2, "Campaign name is required").max(150),
  channel: z.nativeEnum(CampaignChannel).default(CampaignChannel.WHATSAPP),
  campaignType: z.string().trim().default("General Announcement"),
  targetAudience: z.string().trim().optional(),
  booths: z.array(z.coerce.string()).optional(),
  classification: z.nativeEnum(VoterClassification).optional(),
  gender: z.string().trim().optional(),
  minAge: z.coerce.number().int().min(18).max(120).optional(),
  maxAge: z.coerce.number().int().min(18).max(120).optional(),
  messageTemplate: z.string().trim().min(5, "Message template is required"),
  scheduledTime: z.string().trim().optional(),
  language: z.string().trim().optional(),
  voiceModel: z.string().trim().optional(),
});

export type CreateCampaignDto = z.infer<typeof CreateCampaignDtoSchema>;

export const QueryCampaignDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  channel: z.nativeEnum(CampaignChannel).optional(),
  status: z.nativeEnum(CampaignStatus).optional(),
  search: z.string().trim().optional(),
});

export type QueryCampaignDto = z.infer<typeof QueryCampaignDtoSchema>;

export const UpdateCampaignStatusDtoSchema = z.object({
  status: z.nativeEnum(CampaignStatus),
});

export type UpdateCampaignStatusDto = z.infer<typeof UpdateCampaignStatusDtoSchema>;

// ============================================================================
// TEMPLATE SCHEMAS
// ============================================================================

export const CreateTemplateDtoSchema = z.object({
  name: z.string().trim().min(2, "Template name is required").max(150),
  category: z.string().trim().min(2, "Category is required"),
  channel: z.nativeEnum(CampaignChannel).default(CampaignChannel.WHATSAPP),
  content: z.string().trim().min(5, "Content is required"),
  variables: z.array(z.string().trim()).default([]),
});

export type CreateTemplateDto = z.infer<typeof CreateTemplateDtoSchema>;

// ============================================================================
// AUDIENCE ESTIMATOR
// ============================================================================

export const EstimateAudienceDtoSchema = z.object({
  booths: z.array(z.coerce.string()).optional(),
  classification: z.nativeEnum(VoterClassification).optional(),
  gender: z.string().trim().optional(),
  minAge: z.coerce.number().int().min(18).max(120).optional(),
  maxAge: z.coerce.number().int().min(18).max(120).optional(),
  channel: z.nativeEnum(CampaignChannel).default(CampaignChannel.WHATSAPP),
});

export type EstimateAudienceDto = z.infer<typeof EstimateAudienceDtoSchema>;
