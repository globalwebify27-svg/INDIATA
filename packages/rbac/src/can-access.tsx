import React from "react";
import { PermissionCode } from "./permissions";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "./has-permission";

export interface CanAccessProps {
  userPermissions?: string[] | null;
  permission?: PermissionCode | string;
  anyPermissions?: (PermissionCode | string)[];
  allPermissions?: (PermissionCode | string)[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative component for conditional rendering based on RBAC permissions.
 */
export function CanAccess({
  userPermissions,
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
  children,
}: CanAccessProps): React.ReactElement | null {
  if (permission && !hasPermission(userPermissions, permission)) {
    return <>{fallback}</>;
  }

  if (anyPermissions && !hasAnyPermission(userPermissions, anyPermissions)) {
    return <>{fallback}</>;
  }

  if (allPermissions && !hasAllPermissions(userPermissions, allPermissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
