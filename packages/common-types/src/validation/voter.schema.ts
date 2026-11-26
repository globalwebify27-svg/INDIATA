import { z } from "zod";
import { VoterClassification, VoterStatus, VoterRecordSource } from "../enums/voter.enum";

const booleanQueryParam = z
  .union([
    z.boolean(),
    z.enum(["true", "false", "1", "0"]).transform((val) => val === "true" || val === "1"),
  ])
  .optional();

export const VoterQueryDtoSchema = z.object({
  q: z.string().optional(),
  boothNumber: z.string().optional(),
  boothId: z.string().optional(),
  classification: z.nativeEnum(VoterClassification).optional(),
  gender: z.enum(["M", "F", "O", "MALE", "FEMALE", "OTHER"]).optional(),
  minAge: z.coerce.number().min(18).max(120).optional(),
  maxAge: z.coerce.number().min(18).max(120).optional(),
  isVisited: booleanQueryParam,
  isVoted: booleanQueryParam,
  isKeyInfluencer: booleanQueryParam,
  isImportant: booleanQueryParam,
  isFavourite: booleanQueryParam,
  familyId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(["name", "serialNumber", "age", "createdAt", "updatedAt"]).default("serialNumber"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type VoterQueryDto = z.infer<typeof VoterQueryDtoSchema>;

export const CreateVoterDtoSchema = z.object({
  epicId: z.string().trim().min(3).max(20).optional(),
  serialNumber: z.number().int().positive().optional(),
  name: z.string().trim().min(2, "Full name is required").max(150),
  marathiName: z.string().trim().max(150).optional(),
  relativeName: z.string().trim().max(150).optional(),
  relation: z.string().trim().max(20).optional(),
  age: z.number().int().min(18).max(120).optional(),
  gender: z.string().trim().max(10).optional(),
  dob: z.string().trim().max(20).optional(),
  phone: z.string().trim().max(20).optional(),
  whatsapp: z.string().trim().max(20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  houseNo: z.string().trim().max(100).optional(),
  buildingChawl: z.string().trim().max(150).optional(),
  street: z.string().trim().max(150).optional(),
  area: z.string().trim().max(150).optional(),
  landmark: z.string().trim().max(150).optional(),
  address: z.string().trim().max(500).optional(),
  village: z.string().trim().max(100).optional(),
  ward: z.string().trim().max(50).optional(),
  prabhaag: z.string().trim().max(50).optional(),
  pincode: z.string().trim().max(10).optional(),
  caste: z.string().trim().max(100).optional(),
  subCaste: z.string().trim().max(100).optional(),
  communityGroup: z.string().trim().max(100).optional(),
  primaryLanguage: z.string().trim().max(50).default("Marathi"),
  occupation: z.string().trim().max(100).optional(),
  qualification: z.string().trim().max(100).optional(),
  classification: z.nativeEnum(VoterClassification).default(VoterClassification.NEUTRAL),
  status: z.nativeEnum(VoterStatus).default(VoterStatus.VERIFIED),
  source: z.nativeEnum(VoterRecordSource).default(VoterRecordSource.CANDIDATE_ADMIN),
  isKeyInfluencer: z.boolean().default(false),
  isImportant: z.boolean().default(false),
  isFavourite: z.boolean().default(false),
  votingLikelihoodPct: z.number().min(0).max(100).default(80),
  strategyNotes: z.string().optional(),
  remarks: z.string().optional(),
  familyId: z.string().optional(),
  familyHead: z.boolean().default(false),
  familyMembersCount: z.number().int().min(1).default(1),
  isVisited: z.boolean().default(false),
  lastVisitDate: z.string().optional(),
  scheme: z.string().optional(),
  demand: z.string().optional(),
  candidateHelp: z.string().optional(),
  boothId: z.string().optional(),
  boothNumber: z.union([z.string(), z.number()]).transform((val) => String(val)).optional(),
  boothName: z.string().optional(),
  electoralPart: z.string().optional(),
  assignedKaryakartaId: z.string().optional(),
});

export type CreateVoterDto = z.infer<typeof CreateVoterDtoSchema>;

export const UpdateVoterDtoSchema = CreateVoterDtoSchema.partial();
export type UpdateVoterDto = z.infer<typeof UpdateVoterDtoSchema>;

export const UpdateVoterClassificationDtoSchema = z.object({
  classification: z.nativeEnum(VoterClassification),
  remarks: z.string().optional(),
});
export type UpdateVoterClassificationDto = z.infer<typeof UpdateVoterClassificationDtoSchema>;

export const UpdateVoterTurnoutDtoSchema = z.object({
  isVoted: z.boolean(),
  votedAt: z.string().optional(),
  votedBy: z.string().optional(),
});
export type UpdateVoterTurnoutDto = z.infer<typeof UpdateVoterTurnoutDtoSchema>;

export const BulkImportVoterDtoSchema = z.object({
  voters: z.array(CreateVoterDtoSchema).min(1).max(5000),
});
export type BulkImportVoterDto = z.infer<typeof BulkImportVoterDtoSchema>;
