/**
 * Represents the active tenant context resolved for a request.
 */
export interface TenantContext {
  organizationId: string;
  isSuperAdmin: boolean;
}

/**
 * Base contract for entities that are isolated by tenant organization.
 */
export interface TenantScopedEntity {
  organizationId: string;
}
