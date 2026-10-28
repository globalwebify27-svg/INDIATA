import { z } from "zod";

export const LoginDtoSchema = z.object({
  identifier: z
    .string()
    .min(3, "Identifier must be at least 3 characters")
    .max(120, "Identifier cannot exceed 120 characters")
    .describe("Email address or phone number"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(10, "Refresh token is required"),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;

export const MobileActivationDtoSchema = z.object({
  activationKey: z
    .string()
    .length(6, "Activation key must be exactly 6 characters")
    .regex(
      /^[A-Z0-9]{6}$/,
      "Activation key must contain only uppercase alphanumeric characters",
    ),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  deviceUuid: z
    .string()
    .min(10, "Device UUID is required")
    .max(128, "Device UUID cannot exceed 128 characters"),
  deviceModel: z.string().max(100).optional(),
  osVersion: z.string().max(50).optional(),
});

export type MobileActivationDto = z.infer<typeof MobileActivationDtoSchema>;
