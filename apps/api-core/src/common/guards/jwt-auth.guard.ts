import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { JwtPayload, AuthenticatedUser } from "@rajtantra/common-types";
import { env } from "../../config/env.config";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Authentication token is missing or malformed",
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedException("Bearer token is empty");
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: env.JWT_ACCESS_SECRET,
      });

      const authenticatedUser: AuthenticatedUser = {
        id: payload.sub,
        email: payload.email,
        phone: payload.phone,
        name:
          (payload as unknown as { name?: string }).name ||
          payload.email ||
          payload.phone,
        role: payload.role,
        organizationId: payload.organizationId,
        hasAiSeat: payload.hasAiSeat,
      };

      (request as unknown as { user: AuthenticatedUser }).user =
        authenticatedUser;
      return true;
    } catch {
      throw new UnauthorizedException(
        "Invalid or expired authentication token",
      );
    }
  }
}
