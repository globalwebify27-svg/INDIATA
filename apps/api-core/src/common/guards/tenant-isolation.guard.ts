import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import { AuthenticatedUser, UserRole } from "@rajtantra/common-types";

interface ScopedRequest extends Request {
  user?: AuthenticatedUser;
  tenantId?: string;
}

@Injectable()
export class TenantIsolationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ScopedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        "Authenticated user context required for tenant isolation",
      );
    }

    // Super Admin has global platform-wide access
    if (user.role === UserRole.SUPER_ADMIN) {
      const headerOrgId = request.headers["x-organization-id"];
      const rawHeader = Array.isArray(headerOrgId)
        ? headerOrgId[0]
        : headerOrgId;
      const paramOrgId =
        request.params["organizationId"] ?? request.params["orgId"];
      const queryOrgId =
        typeof request.query["organizationId"] === "string"
          ? request.query["organizationId"]
          : undefined;
      const explicitOrgId =
        (typeof paramOrgId === "string" ? paramOrgId : undefined) ||
        queryOrgId ||
        rawHeader;

      request.tenantId = explicitOrgId;
      return true;
    }

    // Non-super-admins must belong to an organization
    if (!user.organizationId) {
      throw new ForbiddenException(
        "User is not associated with any organization tenant",
      );
    }

    // Check if client tried to specify an organizationId that differs from their assigned tenant
    const targetOrgId =
      request.params["organizationId"] ||
      request.params["orgId"] ||
      (request.query["organizationId"] as string) ||
      (request.body &&
        typeof request.body === "object" &&
        (request.body as { organizationId?: string }).organizationId);

    if (targetOrgId && targetOrgId !== user.organizationId) {
      throw new ForbiddenException(
        "Cross-tenant data access is strictly prohibited",
      );
    }

    // Lock request to authenticated tenant
    request.tenantId = user.organizationId;
    return true;
  }
}
