import { UserRole } from "../enums/roles.enum";
import { AuthenticatedUser, AuthTokenPair } from "./jwt-payload.interface";

/**
 * Valid portal identifiers supported by the Rajtantra ecosystem.
 */
export type PortalType =
  | "SUPER_ADMIN"
  | "CANDIDATE_WAR_ROOM"
  | "DISTRIBUTOR_PARTNER"
  | "KARYAKARTA_FIELD";

/**
 * Structured portal access descriptor returned by the central authentication engine.
 */
export interface PortalAccessInfo {
  portalKey: PortalType;
  title: string;
  subtitle: string;
  url: string;
  role: UserRole;
  organizationId?: string | null;
  organizationName?: string | null;
  constituencyName?: string | null;
  isDefault?: boolean;
}

/**
 * Central Single Sign-On authentication response contract.
 */
export interface CentralLoginResult {
  user: AuthenticatedUser;
  tokens: AuthTokenPair;
  portals: PortalAccessInfo[];
  primaryPortal: PortalAccessInfo;
}

/**
 * Payload for requesting a secure single-use ticket or token exchange across portal domains.
 */
export interface PortalExchangeDto {
  targetPortal: PortalType;
  refreshToken: string;
}
