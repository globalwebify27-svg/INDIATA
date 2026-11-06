/**
 * Standard immutable granular permission identifiers for Rajtantra.
 */
export const PERMISSIONS = {
  // Platform & Dashboard
  DASHBOARD_VIEW: "dashboard.view",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_UPDATE: "settings.update",
  AUDIT_VIEW: "audit.view",

  // Users & Roles
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  ROLES_MANAGE: "roles.manage",

  // Organizations & Candidates
  ORGANIZATIONS_VIEW: "organizations.view",
  ORGANIZATIONS_CREATE: "organizations.create",
  ORGANIZATIONS_UPDATE: "organizations.update",
  ORGANIZATIONS_SUSPEND: "organizations.suspend",
  CANDIDATES_VIEW: "candidates.view",
  CANDIDATES_CREATE: "candidates.create",
  CANDIDATES_UPDATE: "candidates.update",
  CANDIDATES_CREDENTIALS: "candidates.credentials",

  // Electoral Operations
  VOTERS_VIEW: "voters.view",
  VOTERS_IMPORT: "voters.import",
  VOTERS_EXPORT: "voters.export",
  VOTERS_EDIT: "voters.edit",
  BOOTHS_VIEW: "booths.view",
  BOOTHS_MANAGE: "booths.manage",
  MAP_VIEW: "map.view",

  // Campaign & AI
  CAMPAIGNS_VIEW: "campaigns.view",
  CAMPAIGNS_CREATE: "campaigns.create",
  CAMPAIGNS_UPDATE: "campaigns.update",
  AI_CALLING: "ai.calling",

  // Subscriptions & Finance
  SUBSCRIPTIONS_VIEW: "subscriptions.view",
  SUBSCRIPTIONS_UPGRADE: "subscriptions.upgrade",
  PAYMENTS_VERIFY: "payments.verify",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
