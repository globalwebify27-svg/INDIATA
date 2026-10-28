import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { env } from "../../config/env.config";
import {
  LoginDto,
  RefreshTokenDto,
  AuthTokenPair,
  AuthenticatedUser,
  JwtPayload,
  UserRole,
} from "@rajtantra/common-types";

export interface LoginResult {
  user: AuthenticatedUser;
  tokens: AuthTokenPair;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  async login(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResult> {
    const identifier = dto.identifier.trim();

    // Find user by email or phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid identifier or password");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException(
        `Account is ${user.status.toLowerCase()}. Please contact administrator.`,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid identifier or password");
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      organizationId: user.organizationId,
      hasAiSeat: user.hasAiSeat,
    });

    // Save refresh token record
    const tokenHash = this.hashToken(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        deviceInfo: userAgent ? userAgent.substring(0, 255) : null,
        ipAddress: ipAddress ? ipAddress.substring(0, 45) : null,
        expiresAt,
      },
    });

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role as UserRole,
      organizationId: user.organizationId,
      hasAiSeat: user.hasAiSeat,
    };

    return {
      user: authenticatedUser,
      tokens,
    };
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthTokenPair> {
    const rawToken = dto.refreshToken;
    const tokenHash = this.hashToken(rawToken);

    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.isRevoked) {
      throw new UnauthorizedException(
        "Refresh token is invalid or has been revoked",
      );
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException("Refresh token has expired");
    }

    if (record.user.status !== "ACTIVE") {
      throw new UnauthorizedException("User account is no longer active");
    }

    // Revoke current refresh token (rotation policy)
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { isRevoked: true },
    });

    // Issue new token pair
    const tokens = await this.generateTokens({
      sub: record.user.id,
      email: record.user.email,
      phone: record.user.phone,
      role: record.user.role as UserRole,
      organizationId: record.user.organizationId,
      hasAiSeat: record.user.hasAiSeat,
    });

    // Store new refresh token
    const newTokenHash = this.hashToken(tokens.refreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: newTokenHash,
        userId: record.user.id,
        deviceInfo: record.deviceInfo,
        ipAddress: record.ipAddress,
        expiresAt: newExpiresAt,
      },
    });

    return tokens;
  }

  async logout(refreshToken: string): Promise<{ revoked: boolean }> {
    if (!refreshToken) {
      throw new BadRequestException("Refresh token is required to logout");
    }

    const tokenHash = this.hashToken(refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, isRevoked: false },
      data: { isRevoked: true },
    });

    return { revoked: true };
  }

  async getMe(
    userId: string,
  ): Promise<AuthenticatedUser & { organizationName?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role as UserRole,
      organizationId: user.organizationId,
      hasAiSeat: user.hasAiSeat,
      organizationName: user.organization?.name,
    };
  }

  private async generateTokens(payload: JwtPayload): Promise<AuthTokenPair> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: "15m",
    });

    const refreshToken = randomBytes(32).toString("hex");

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
