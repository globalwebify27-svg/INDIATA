import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/require-permissions.decorator";
import { PermissionCode, hasAllPermissions } from "@rajtantra/rbac";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<(PermissionCode | string)[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException("Authentication session context is missing");
    }

    // Super Admin has unrestricted wildcard access
    if (user.role === "SUPER_ADMIN" || user.permissions?.includes("*")) {
      return true;
    }

    const authorized = hasAllPermissions(user.permissions, requiredPermissions);
    if (!authorized) {
      throw new ForbiddenException(
        `Access denied. Required permissions: ${requiredPermissions.join(", ")}`,
      );
    }

    return true;
  }
}
