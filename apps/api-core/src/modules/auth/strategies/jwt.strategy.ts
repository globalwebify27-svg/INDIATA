import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "../../../config/env.config";
import {
  JwtPayload,
  AuthenticatedUser,
  UserRole,
} from "@rajtantra/common-types";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser & { permissions?: string[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException(
        "User account is inactive or no longer exists",
      );
    }

    const permissions =
      user.userRoles?.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.code),
      ) || [];

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role as unknown as UserRole,
      organizationId: user.organizationId,
      hasAiSeat: user.hasAiSeat,
      distributorId: payload.distributorId,
      permissions,
    };
  }
}
