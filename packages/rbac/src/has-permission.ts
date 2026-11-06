import { PermissionCode } from "./permissions";

/**
 * Checks if a given permission set contains a specific required permission.
 */
export function hasPermission(
  userPermissions: string[] | undefined | null,
  requiredPermission: PermissionCode | string,
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  // Wildcard root admin clearance
  if (userPermissions.includes("*") || userPermissions.includes("admin.*")) {
    return true;
  }
  return userPermissions.includes(requiredPermission);
}

/**
 * Checks if user has ANY of the specified permissions.
 */
export function hasAnyPermission(
  userPermissions: string[] | undefined | null,
  requiredPermissions: (PermissionCode | string)[],
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes("*") || userPermissions.includes("admin.*")) {
    return true;
  }
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Checks if user has ALL of the specified permissions.
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined | null,
  requiredPermissions: (PermissionCode | string)[],
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes("*") || userPermissions.includes("admin.*")) {
    return true;
  }
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
}
