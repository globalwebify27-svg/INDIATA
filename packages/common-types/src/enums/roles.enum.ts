/**
 * System-wide user roles supported across portals and APIs.
 */
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  DISTRIBUTOR = "DISTRIBUTOR",
  CANDIDATE_ADMIN = "CANDIDATE_ADMIN",
  KARYAKARTA = "KARYAKARTA",
}

/**
 * Account lifecycle status for users.
 */
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_APPROVAL = "PENDING_APPROVAL",
}
