import { AuthenticatedUser, UserRole, AuthTokenPair } from "@rajtantra/common-types";

export interface ExtendedUser extends AuthenticatedUser {
  organizationName?: string;
  constituencyName?: string;
  district?: string;
  state?: string;
}

/**
 * UI Development & Direct Client Preview Mode flag.
 *
 * Defaults to true for all preview, demonstration, and standalone client UI links
 * (ensuring zero database, zero MySQL, and zero authentication blockers).
 *
 * To disable preview mode and connect to a real live production API server:
 * set NEXT_PUBLIC_ENABLE_REAL_API="true" or NEXT_PUBLIC_DISABLE_DEV_PREVIEW="true"
 */
export const IS_DEV_PREVIEW =
  process.env.NEXT_PUBLIC_ENABLE_DEV_PREVIEW === "true";

export const MOCK_DEV_CANDIDATE_USER: ExtendedUser = {
  id: "cnd-dev-preview-001",
  email: "candidate@indiata.in",
  phone: "+919876543212",
  name: "Adv. Vikram Patil",
  role: UserRole.CANDIDATE_ADMIN,
  organizationId: "org-pune-2024",
  organizationName: "Pune Parliamentary Constituency War Room 2024",
  constituencyName: "34 - Pune Parliamentary Constituency",
  district: "Pune",
  state: "Maharashtra",
  hasAiSeat: true,
};

export const MOCK_DEV_SUPERADMIN_USER: ExtendedUser = {
  id: "sa-dev-preview-001",
  email: "superadmin@indiata.in",
  phone: "+919876543210",
  name: "System Super Admin",
  role: UserRole.SUPER_ADMIN,
  organizationId: null,
  organizationName: "Platform Administration",
  constituencyName: "All Constituencies",
  district: "Maharashtra",
  state: "India",
  hasAiSeat: true,
};

export const MOCK_DEV_TOKENS: AuthTokenPair = {
  accessToken: "dev-preview-mock-access-token",
  refreshToken: "dev-preview-mock-refresh-token",
  tokenType: "Bearer",
  expiresIn: 86400,
};
