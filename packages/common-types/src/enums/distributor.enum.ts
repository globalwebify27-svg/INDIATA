/**
 * Status of a distributor commission transaction.
 */
export enum DistributorTransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

/**
 * Status of a distributor payout withdrawal request.
 */
export enum DistributorPayoutStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SETTLED = "SETTLED",
  REJECTED = "REJECTED",
}

/**
 * Commission plan types for franchise candidate accounts.
 */
export enum CommissionPlanType {
  TRIAL_5D = "TRIAL_5D",
  OFFICE_6M = "OFFICE_6M",
  OFFICE_12M = "OFFICE_12M",
  ELECTION_MODULE = "ELECTION_MODULE",
}
