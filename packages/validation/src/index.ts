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

// -------------------------------------------------------------
// CENTRAL VOTER PROFILE CREATION (ALL FIELDS OPTIONAL WITH FORMAT CHECKS)
// -------------------------------------------------------------

export const createVoterProfileSchema = z.object({
  // Personal & Demographic
  name: z.string().optional().or(z.literal("")),
  marathiName: z.string().optional().or(z.literal("")),
  relativeName: z.string().optional().or(z.literal("")),
  relation: z.enum(["S/o", "D/o", "W/o", "Other"]).optional().or(z.literal("").transform(() => undefined)),
  age: z
    .union([
      z.number().int().min(18, "Age must be at least 18").max(120, "Age must be 120 or under"),
      z
        .string()
        .regex(/^$|^(1[89]|[2-9]\d|1[01]\d|120)$/, "Age must be a valid number between 18 and 120")
        .transform((val) => (val ? Number(val) : undefined)),
    ])
    .optional(),
  gender: z.enum(["M", "F", "Other"]).optional().or(z.literal("").transform(() => undefined)),
  dob: z
    .string()
    .regex(/^$|^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
    .optional()
    .or(z.literal("")),
  caste: z.string().optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
  qualification: z.string().optional().or(z.literal("")),

  // Electoral Details
  epicId: z
    .string()
    .regex(/^$|^[A-Za-z0-9\/-]{5,20}$/, "EPIC ID must be 5 to 20 alphanumeric characters")
    .transform((val) => (val ? val.toUpperCase() : ""))
    .optional()
    .or(z.literal("")),
  serialNumber: z
    .union([
      z.number().int().positive(),
      z
        .string()
        .regex(/^$|^\d+$/, "Serial number must be digits only")
        .transform((val) => (val ? Number(val) : undefined)),
    ])
    .optional(),
  electoralPart: z.string().optional().or(z.literal("")),
  boothNumber: z.string().optional().or(z.literal("")),
  boothName: z.string().optional().or(z.literal("")),

  // Contact Details
  phone: z
    .string()
    .transform((val) => (val ? val.trim().replace(/[\s-]/g, "") : ""))
    .pipe(
      z
        .string()
        .regex(
          /^$|^(\+?91)?[6-9]\d{9}$/,
          "Please enter a valid 10-digit Indian mobile number (e.g. 9822100000)"
        )
    )
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address (e.g. voter@example.com)")
    .optional()
    .or(z.literal("")),

  // Address
  houseNo: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  village: z.string().optional().or(z.literal("")),
  ward: z.string().optional().or(z.literal("")),
  prabhaag: z.string().optional().or(z.literal("")),

  // Household & Family
  familyId: z.string().optional().or(z.literal("")),
  familyHead: z.boolean().optional().default(false),
  familyMembersCount: z
    .union([
      z.number().int().min(1),
      z
        .string()
        .regex(/^$|^\d+$/, "Family members count must be digits only")
        .transform((val) => (val ? Number(val) : 1)),
    ])
    .optional()
    .default(1),

  // Cadre Intelligence & Tagging
  classification: z
    .enum(["Supporter", "Opponent", "Doubtful", "Neutral"])
    .optional()
    .default("Neutral"),
  isImportant: z.boolean().optional().default(false),
  isFavourite: z.boolean().optional().default(false),
  isVisited: z.boolean().optional().default(false),
  isVoted: z.boolean().optional().default(false),
  isOutside: z.boolean().optional().default(false),
  isDeceased: z.boolean().optional().default(false),

  // Schemes & Demands
  scheme: z.string().optional().or(z.literal("")),
  demand: z.string().optional().or(z.literal("")),
  candidateHelp: z.string().optional().or(z.literal("")),
  extraInfo: z.string().optional().or(z.literal("")),
  remarks: z.string().optional().or(z.literal("")),

  // System & Association Metadata
  organizationId: z.string().optional().or(z.literal("")),
  assignedKaryakartaId: z.string().optional().or(z.literal("")),
  source: z.enum(["ECI_IMPORT", "CANDIDATE_ADMIN", "KARYAKARTA_CREATED", "PUBLIC_ENQUIRY"]).optional().default("KARYAKARTA_CREATED"),
  status: z.enum(["Verified", "Correction Req", "Quarantined", "Pending Approval"]).optional().default("Verified"),
});

export type CreateVoterProfileInput = z.infer<typeof createVoterProfileSchema>;

// -------------------------------------------------------------
// ISSUE TICKET CREATION & VOTER ASSOCIATION
// -------------------------------------------------------------

export const createIssueTicketSchema = z.object({
  voterId: z.string().nullable().optional(),
  voterName: z.string().optional().or(z.literal("")),
  voterPhone: z
    .string()
    .transform((val) => (val ? val.trim().replace(/[\s-]/g, "") : ""))
    .pipe(
      z
        .string()
        .regex(
          /^$|^(\+?91)?[6-9]\d{9}$/,
          "Please enter a valid 10-digit Indian mobile number"
        )
    )
    .optional()
    .or(z.literal("")),
  voterBooth: z.string().optional().or(z.literal("")),
  category: z.enum([
    "Water Supply",
    "Road Infrastructure",
    "Sanitation",
    "Pension / Scheme",
    "Electricity",
    "Other",
  ]),
  title: z.string().optional().or(z.literal("")),
  description: z.string().min(5, "Please provide grievance description (min 5 characters)"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  location: z.string().optional().or(z.literal("")),
  assignedTo: z.string().optional().or(z.literal("")),
  karyakartaId: z.string().optional().or(z.literal("")),
  karyakartaName: z.string().optional().or(z.literal("")),
  organizationId: z.string().optional().or(z.literal("")),
  attachments: z
    .union([z.array(z.string()), z.string().transform((s) => (s ? [s] : []))])
    .optional()
    .default([]),
});

export type CreateIssueTicketInput = z.infer<typeof createIssueTicketSchema>;
