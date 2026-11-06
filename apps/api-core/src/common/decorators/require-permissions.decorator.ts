import { SetMetadata } from "@nestjs/common";
import { PermissionCode } from "@rajtantra/rbac";

export const PERMISSIONS_KEY = "permissions";

/**
 * Decorator to require one or more granular RBAC permissions on a route handler or controller.
 */
export const RequirePermissions = (...permissions: (PermissionCode | string)[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
