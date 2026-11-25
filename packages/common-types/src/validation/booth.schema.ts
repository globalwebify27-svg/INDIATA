import { z } from "zod";
import { BoothGrade, BloStatus } from "../enums/booth.enum";

export const BoothQueryDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  grade: z.nativeEnum(BoothGrade).optional(),
  locality: z.string().trim().optional(),
  minTurnout: z.coerce.number().min(0).max(100).optional(),
  maxTurnout: z.coerce.number().min(0).max(100).optional(),
  sortBy: z
    .enum([
      "boothNumber",
      "boothName",
      "totalVoters",
      "projectedTurnout",
      "slipsPercent",
      "karyakartasCount",
    ])
    .default("boothNumber"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type BoothQueryDto = z.infer<typeof BoothQueryDtoSchema>;

export const CreateBoothDtoSchema = z.object({
  boothNumber: z.string().trim().min(1, "Booth number is required").max(50),
  boothName: z.string().trim().min(2, "Booth name is required").max(200),
  locality: z.string().trim().max(150).optional(),
  partNumber: z.string().trim().max(50).optional(),
  pollingCentre: z.string().trim().max(200).optional(),
  pollingAddress: z.string().trim().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  googleMapsUrl: z.string().url().max(255).optional(),
  totalVoters: z.coerce.number().int().min(0).default(0),
  maleVoters: z.coerce.number().int().min(0).default(0),
  femaleVoters: z.coerce.number().int().min(0).default(0),
  bloName: z.string().trim().max(100).optional(),
  bloPhone: z.string().trim().max(20).optional(),
  karyakartasCount: z.coerce.number().int().min(0).default(0),
  slipsPercent: z.coerce.number().int().min(0).max(100).default(0),
  projectedTurnout: z.coerce.number().min(0).max(100).optional(),
  lastTurnout: z.coerce.number().min(0).max(100).optional(),
});

export type CreateBoothDto = z.infer<typeof CreateBoothDtoSchema>;

export const UpdateBoothDtoSchema = CreateBoothDtoSchema.partial();
export type UpdateBoothDto = z.infer<typeof UpdateBoothDtoSchema>;

export const AssignKaryakartaDtoSchema = z.object({
  karyakartaIds: z.array(z.string().uuid("Invalid user UUID")).min(1, "At least one karyakarta ID is required"),
});
export type AssignKaryakartaDto = z.infer<typeof AssignKaryakartaDtoSchema>;

export const CreateKaryakartaDtoSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(150),
  phone: z.string().trim().min(10, "Phone number must be at least 10 characters").max(20),
  assignedBooths: z.array(z.string()).default([]),
  activationKey: z.string().max(6).optional(),
});
export type CreateKaryakartaDto = z.infer<typeof CreateKaryakartaDtoSchema>;

export const UpdateBloOfficerDtoSchema = z.object({
  bloName: z.string().trim().max(100).optional(),
  bloPhone: z.string().trim().max(20).optional(),
  status: z.nativeEnum(BloStatus).default(BloStatus.ACTIVE),
});
export type UpdateBloOfficerDto = z.infer<typeof UpdateBloOfficerDtoSchema>;
