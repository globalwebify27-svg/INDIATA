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

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        status: true,
        organizationId: true,
        hasAiSeat: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException(
        "User account is inactive or no longer exists",
      );
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role as unknown as UserRole,
      organizationId: user.organizationId,
      hasAiSeat: user.hasAiSeat,
    };
  }
}
