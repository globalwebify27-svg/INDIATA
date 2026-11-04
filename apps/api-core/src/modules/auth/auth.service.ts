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
  RegisterEnquiryDto,
  ForgotPasswordDto,
  LoginResult,
  PortalAccessInfo,
} from "@rajtantra/common-types";

export type { LoginResult };

export interface RegisterEnquiryResult {
  enquiryNumber: string;
  message: string;
  status: string;
  candidateName: string;
  constituencyName: string;
  createdAt: Date;
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

  async registerEnquiry(dto: RegisterEnquiryDto): Promise<RegisterEnquiryResult> {
    const mobile = dto.mobile.trim();
    const email = dto.email && dto.email.trim().length > 0 ? dto.email.trim() : null;

    // Check if phone or email already registered in users table
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: mobile },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        "An account with this phone number or email already exists. Please login instead.",
      );
    }

    // Check if pending registration enquiry already exists with this phone
    const existingEnquiry = await this.prisma.registrationEnquiry.findFirst({
      where: {
        mobile,
        status: "PENDING",
      },
    });

    if (existingEnquiry) {
      return {
        enquiryNumber: existingEnquiry.enquiryNumber,
        message: "You already have a pending registration enquiry under review.",
        status: existingEnquiry.status,
        candidateName: existingEnquiry.candidateName,
        constituencyName: existingEnquiry.constituencyName,
        createdAt: existingEnquiry.createdAt,
      };
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const enquiryNumber = `ENQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const enquiry = await this.prisma.registrationEnquiry.create({
      data: {
        enquiryNumber,
        fullName: dto.fullName.trim(),
        mobile,
        email,
        passwordHash,
        candidateName: dto.candidateName.trim(),
        candidateContact: dto.candidateContact.trim(),
        candidateType: dto.candidateType,
        partyName: dto.partyName.trim(),
        electionType: dto.electionType,
        state: dto.state.trim(),
        district: dto.district.trim(),
        constituencyName: dto.constituencyName.trim(),
        subDivision: dto.subDivision ? dto.subDivision.trim() : null,
        boothsCount: dto.boothsCount || 0,
        electionName: dto.electionName ? dto.electionName.trim() : null,
        electionYear: dto.electionYear || new Date().getFullYear(),
        pollingDate: dto.pollingDate ? new Date(dto.pollingDate) : null,
        requestedServices: JSON.stringify(dto.requestedServices || []),
        notes: dto.notes ? dto.notes.trim() : null,
        status: "PENDING",
      },
    });

    return {
      enquiryNumber: enquiry.enquiryNumber,
      message:
        "Registration enquiry successfully submitted. Super Admin will review your account and activate access.",
      status: enquiry.status,
      candidateName: enquiry.candidateName,
      constituencyName: enquiry.constituencyName,
      createdAt: enquiry.createdAt,
    };
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<{ message: string; challengeSent: boolean }> {
    const identifier = dto.identifier.trim();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      return {
        message:
          "If an account matches your details, password reset instructions have been dispatched.",
        challengeSent: false,
      };
    }

    return {
      message:
        "Password reset verification code has been dispatched to your registered phone/email.",
      challengeSent: true,
    };
  }


  async login(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResult> {
    const identifier = dto.identifier.trim();

    // Find user by email or phone with tenant details
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      include: {
        organization: true,
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

    const portals = this.resolveAuthorizedPortals(
      user.role as UserRole,
      user.organization?.name,
      user.organization?.constituencyName,
    );
    const primaryPortal = portals.find((p) => p.isDefault) || portals[0];

    return {
      user: authenticatedUser,
      tokens,
      portals,
      primaryPortal,
    };
  }

  private resolveAuthorizedPortals(
    role: UserRole,
    organizationName?: string | null,
    constituencyName?: string | null,
  ): PortalAccessInfo[] {
    const origins = env.CORS_ORIGIN.split(",").map((s) => s.trim());
    const superAdminUrl = origins[0] || "http://localhost:3000";
    const candidateUrl = origins[1] || "http://localhost:3001";

    if (role === UserRole.SUPER_ADMIN) {
      return [
        {
          portalKey: "SUPER_ADMIN",
          title: "Super Admin Platform Command",
          subtitle: "Multi-tenant War Room Infrastructure, KYC & Licencing",
          url: superAdminUrl,
          role: UserRole.SUPER_ADMIN,
          isDefault: true,
        },
        {
          portalKey: "CANDIDATE_WAR_ROOM",
          title: "Candidate War Room (Supervisory Mode)",
          subtitle: "Inspect live booth readiness & GIS telemetry across constituencies",
          url: `${candidateUrl}/dashboard`,
          role: UserRole.SUPER_ADMIN,
          isDefault: false,
        },
      ];
    }

    if (role === UserRole.CANDIDATE_ADMIN) {
      return [
        {
          portalKey: "CANDIDATE_WAR_ROOM",
          title: organizationName || "Constituency War Room",
          subtitle: constituencyName
            ? `Constituency: ${constituencyName}`
            : "Voter intelligence, GIS telemetry & cadre command",
          url: `${candidateUrl}/dashboard`,
          role: UserRole.CANDIDATE_ADMIN,
          organizationName,
          constituencyName,
          isDefault: true,
        },
      ];
    }

    if (role === UserRole.DISTRIBUTOR) {
      return [
        {
          portalKey: "DISTRIBUTOR_PARTNER",
          title: "Distributor Partner Network",
          subtitle: "Agency onboarding, candidate allocation & commission ledger",
          url: "http://localhost:3002",
          role: UserRole.DISTRIBUTOR,
          isDefault: true,
        },
      ];
    }

    // Default: Karyakarta
    return [
      {
        portalKey: "KARYAKARTA_FIELD",
        title: "Field Karyakarta Canvassing",
        subtitle: "Booth voter slip handoff & family survey check-ins",
        url: "http://localhost:3003",
        role: UserRole.KARYAKARTA,
        isDefault: true,
      },
    ];
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
