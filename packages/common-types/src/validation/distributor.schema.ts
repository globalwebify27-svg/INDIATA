import { z } from "zod";
import {
  DistributorTransactionStatus,
  DistributorPayoutStatus,
  CommissionPlanType,
} from "../enums/distributor.enum";

export const RequestPayoutDtoSchema = z.object({
  amount: z.number().min(1000, "Minimum payout request amount is ₹1,000"),
  remarks: z.string().max(255).optional(),
});

export type RequestPayoutDto = z.infer<typeof RequestPayoutDtoSchema>;

export const QueryTransactionsDtoSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(DistributorTransactionStatus).optional(),
  search: z.string().optional(),
});

export type QueryTransactionsDto = z.infer<typeof QueryTransactionsDtoSchema>;

export const QueryPayoutsDtoSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(DistributorPayoutStatus).optional(),
});

export type QueryPayoutsDto = z.infer<typeof QueryPayoutsDtoSchema>;

export const QueryCandidatesDtoSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.string().optional(),
  search: z.string().optional(),
});

export type QueryCandidatesDto = z.infer<typeof QueryCandidatesDtoSchema>;

export const OnboardCandidateDtoSchema = z.object({
  candidateName: z.string().min(3, "Candidate name must be at least 3 characters"),
  mobile: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Valid mobile number required"),
  email: z.string().email("Valid email required").optional(),
  partyName: z.string().min(2, "Party name required"),
  electionType: z.string().min(2, "Election type required"),
  constituencyName: z.string().min(2, "Constituency name required"),
  district: z.string().min(2, "District required"),
  planType: z.nativeEnum(CommissionPlanType).default(CommissionPlanType.ELECTION_MODULE),
  grossAmount: z.number().min(0).default(150000),
});

export type OnboardCandidateDto = z.infer<typeof OnboardCandidateDtoSchema>;

export const UpdateBankDetailsDtoSchema = z.object({
  bankAccountName: z.string().min(3, "Bank account holder name required"),
  bankAccountNumber: z.string().min(6, "Valid bank account number required"),
  bankIfsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Valid IFSC code required (e.g. HDFC0000123)"),
  bankName: z.string().min(3, "Bank and branch name required"),
});

export type UpdateBankDetailsDto = z.infer<typeof UpdateBankDetailsDtoSchema>;

export const RecordTransactionDtoSchema = z.object({
  organizationId: z.string().optional(),
  planType: z.nativeEnum(CommissionPlanType),
  grossAmount: z.number().min(0, "Gross amount must be positive"),
  commissionRatePct: z.number().min(0).max(100).optional().default(20),
  paymentMethod: z.string().optional().default("Bank Transfer (NEFT)"),
  utrNumber: z.string().optional(),
});

export type RecordTransactionDto = z.infer<typeof RecordTransactionDtoSchema>;

export const QueryEnquiriesDtoSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.string().optional(),
  search: z.string().optional(),
});

export type QueryEnquiriesDto = z.infer<typeof QueryEnquiriesDtoSchema>;

export const CreateEnquiryDtoSchema = z.object({
  candidateName: z.string().min(3, "Candidate name must be at least 3 characters"),
  mobile: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Valid mobile number required"),
  email: z.string().email().optional(),
  constituency: z.string().min(2, "Constituency name required"),
  serviceType: z.string().default("Software Subscription"),
  requestedPackage: z.string().min(2, "Requested package required"),
  amount: z.number().min(0).default(50000),
  notes: z.string().optional(),
});

export type CreateEnquiryDto = z.infer<typeof CreateEnquiryDtoSchema>;
