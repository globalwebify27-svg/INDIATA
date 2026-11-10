/**
 * Organization subscription plan types.
 */
export enum OrganizationPlanType {
  TRIAL_5D = "TRIAL_5D",
  OFFICE_6M = "OFFICE_6M",
  OFFICE_12M = "OFFICE_12M",
  ELECTION_MODULE = "ELECTION_MODULE",
}

/**
 * Lifecycle status of an organization / campaign tenant.
 */
export enum OrganizationStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  EXPIRED = "EXPIRED",
}

/**
 * Status of a distributor partner.
 */
export enum DistributorStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}
