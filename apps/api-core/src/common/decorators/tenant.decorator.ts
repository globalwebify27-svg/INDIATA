import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { AuthenticatedUser, UserRole } from "@rajtantra/common-types";
import { Request } from "express";

export interface RequestWithTenant extends Request {
  user?: AuthenticatedUser;
  tenantId?: string;
}

export function getTenantIdFromContext(request: RequestWithTenant): string {
  const user = request.user;

  if (!user) {
    throw new ForbiddenException("User is not authenticated");
  }

  // Super Admin can access via resolved request tenantId or header
  if (user.role === UserRole.SUPER_ADMIN) {
    const explicitOrgId = request.headers["x-organization-id"] as string;
    return explicitOrgId || user.organizationId || "";
  }

  if (!user.organizationId) {
    throw new ForbiddenException(
      "User is not associated with an active organization tenant",
    );
  }

  return user.organizationId;
}

export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    return getTenantIdFromContext(
      ctx.switchToHttp().getRequest<RequestWithTenant>(),
    );
  },
);
