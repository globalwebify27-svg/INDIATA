import { UserRole } from "../enums/roles.enum";

/**
 * Claims embedded inside a verified JWT access token.
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string | null;
  phone: string;
  role: UserRole;
  organizationId: string | null;
  hasAiSeat: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Authenticated user object attached to Request by the auth guard.
 */
export interface AuthenticatedUser {
  id: string;
  email: string | null;
  phone: string;
  name: string;
  role: UserRole;
  organizationId: string | null;
  hasAiSeat: boolean;
}

/**
 * Pair of access and refresh tokens returned upon successful authentication.
 */
export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number; // Seconds
}

/**
 * Mobile activation credentials for field karyakartas.
 */
export interface MobileActivationPayload {
  activationKey: string;
  phone: string;
  deviceUuid: string;
  deviceModel?: string;
  osVersion?: string;
}

export interface LoginResult {
  user: AuthenticatedUser;
  tokens: AuthTokenPair;
}

export interface RegisterEnquiryResult {
  enquiryNumber: string;
  message: string;
  status: string;
  candidateName: string;
  constituencyName: string;
  createdAt: Date;
}

