import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Identifier is required")
    .transform((val) => val.trim()),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const verify2faSchema = z.object({
  tempToken: z.string().min(1, "Temporary session token is required"),
  code: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d+$/, "Verification code must contain digits only"),
});

export type Verify2faInput = z.infer<typeof verify2faSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Registered email or mobile number is required")
    .transform((val) => val.trim()),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const registerEnquirySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  candidateName: z.string().min(2, "Candidate name is required"),
  candidateContact: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  candidateType: z.string().min(1, "Candidate type is required"),
  partyName: z.string().min(1, "Party name is required"),
  electionType: z.string().min(1, "Election type is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  constituencyName: z.string().min(1, "Constituency name is required"),
  subDivision: z.string().optional(),
  boothsCount: z.number().int().nonnegative().optional(),
  electionName: z.string().optional(),
  electionYear: z.number().int().optional(),
  pollingDate: z.string().optional(),
  requestedServices: z.string().optional(),
  notes: z.string().optional(),
});

export type RegisterEnquiryInput = z.infer<typeof registerEnquirySchema>;
