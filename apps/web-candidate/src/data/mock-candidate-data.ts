import { AuthenticatedUser, UserRole, AuthTokenPair } from "@rajtantra/common-types";

export interface ExtendedUser extends AuthenticatedUser {
  organizationName?: string;
  constituencyName?: string;
  district?: string;
  state?: string;
}

/**
 * UI Development Preview Mode flag.
 *
 * Automatically enabled in development (process.env.NODE_ENV !== "production")
 * Allows UI developers to design, review, and verify all portal screens and layouts
 * with zero database, zero MySQL, and zero backend authentication dependencies.
 *
 * To disable preview mode and test full production authentication:
 * set NEXT_PUBLIC_DISABLE_DEV_PREVIEW="true" in .env.local or .env
 */
export const IS_DEV_PREVIEW =
  process.env.NEXT_PUBLIC_DEV_PREVIEW === "true" ||
  (process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_DISABLE_DEV_PREVIEW !== "true");

export const MOCK_DEV_CANDIDATE_USER: ExtendedUser = {
  id: "cnd-dev-preview-001",
  email: "candidate@rajtantra.in",
  phone: "+919876543212",
  name: "Anand Shinde",
  role: UserRole.CANDIDATE_ADMIN,
  organizationId: "org-kasba-peth-2026",
  organizationName: "Kasba Peth Constituency War Room 2026",
  constituencyName: "215 - Kasba Peth",
  district: "Pune",
  state: "Maharashtra",
  hasAiSeat: true,
};

export const MOCK_DEV_SUPERADMIN_USER: ExtendedUser = {
  id: "sa-dev-preview-001",
  email: "superadmin@rajtantra.in",
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
