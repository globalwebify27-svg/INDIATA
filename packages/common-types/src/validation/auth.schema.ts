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

export const RegisterEnquiryDtoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(150),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits").max(15),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  candidateName: z.string().min(2, "Candidate name must be at least 2 characters").max(150),
  candidateContact: z.string().min(10, "Candidate contact must be at least 10 digits").max(15),
  candidateType: z.string().min(2, "Candidate type is required").max(50),
  partyName: z.string().min(2, "Party / Organization name is required").max(150),
  electionType: z.string().min(2, "Election type is required").max(50),
  state: z.string().min(2, "State is required").max(50),
  district: z.string().min(2, "District is required").max(100),
  constituencyName: z.string().min(2, "Constituency name is required").max(150),
  subDivision: z.string().max(150).optional(),
  boothsCount: z.number().int().nonnegative().optional().default(0),
  electionName: z.string().max(150).optional(),
  electionYear: z.number().int().optional(),
  pollingDate: z.string().optional(),
  requestedServices: z.array(z.string()).optional().default([]),
  notes: z.string().max(1000).optional(),
});

export type RegisterEnquiryDto = z.infer<typeof RegisterEnquiryDtoSchema>;

export const ForgotPasswordDtoSchema = z.object({
  identifier: z.string().min(3, "Email or phone number is required").max(120),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDtoSchema>;

export const ResetPasswordDtoSchema = z.object({
  identifier: z.string().min(3, "Email or phone number is required").max(120),
  otp: z.string().min(4, "OTP code must be at least 4 digits").max(8),
  newPassword: z.string().min(6, "New password must be at least 6 characters").max(128),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>;

