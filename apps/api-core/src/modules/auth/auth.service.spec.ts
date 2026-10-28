import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../prisma/prisma.service";
import { UserRole } from "@rajtantra/common-types";

describe("AuthService", () => {
  let service: AuthService;
  let prisma: {
    user: { findFirst: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    refreshToken: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
  };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue("mock-access-token-xyz"),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe("login", () => {
    it("should successfully authenticate user with valid credentials", async () => {
      const passwordHash = await bcrypt.hash("Secret123", 10);
      prisma.user.findFirst.mockResolvedValue({
        id: "user-001",
        email: "candidate@rajtantra.in",
        phone: "+919876543212",
        name: "Rajesh Patil",
        passwordHash,
        role: UserRole.CANDIDATE_ADMIN,
        status: "ACTIVE",
        organizationId: "org-pune-01",
        hasAiSeat: true,
      });

      prisma.refreshToken.create.mockResolvedValue({});
      prisma.user.update.mockResolvedValue({});

      const result = await service.login({
        identifier: "candidate@rajtantra.in",
        password: "Secret123",
      });

      expect(result.user.id).toBe("user-001");
      expect(result.user.email).toBe("candidate@rajtantra.in");
      expect(result.tokens.accessToken).toBe("mock-access-token-xyz");
      expect(result.tokens.refreshToken).toBeDefined();
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });

    it("should throw UnauthorizedException on invalid password", async () => {
      const passwordHash = await bcrypt.hash("CorrectPass", 10);
      prisma.user.findFirst.mockResolvedValue({
        id: "user-001",
        email: "candidate@rajtantra.in",
        phone: "+919876543212",
        passwordHash,
        status: "ACTIVE",
      });

      await expect(
        service.login({
          identifier: "candidate@rajtantra.in",
          password: "WrongPassword",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if user does not exist", async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.login({
          identifier: "unknown@rajtantra.in",
          password: "AnyPassword",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if user account is not active", async () => {
      const passwordHash = await bcrypt.hash("CorrectPass", 10);
      prisma.user.findFirst.mockResolvedValue({
        id: "user-001",
        email: "suspended@rajtantra.in",
        phone: "+919876543212",
        passwordHash,
        status: "SUSPENDED",
      });

      await expect(
        service.login({
          identifier: "suspended@rajtantra.in",
          password: "CorrectPass",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if user has no password hash set", async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: "worker-001",
        email: null,
        phone: "+919876543213",
        passwordHash: null,
        status: "ACTIVE",
      });

      await expect(
        service.login({
          identifier: "+919876543213",
          password: "AnyPassword",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("refresh", () => {
    it("should rotate refresh token and issue new token pair", async () => {
      const futureDate = new Date(Date.now() + 100000);
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: "rt-001",
        tokenHash: "somehash",
        isRevoked: false,
        expiresAt: futureDate,
        user: {
          id: "user-001",
          email: "candidate@rajtantra.in",
          phone: "+919876543212",
          role: UserRole.CANDIDATE_ADMIN,
          status: "ACTIVE",
          organizationId: "org-01",
          hasAiSeat: true,
        },
      });

      prisma.refreshToken.update.mockResolvedValue({});
      prisma.refreshToken.create.mockResolvedValue({});

      const tokens = await service.refresh({
        refreshToken: "valid-refresh-token",
      });

      expect(tokens.accessToken).toBe("mock-access-token-xyz");
      expect(tokens.refreshToken).toBeDefined();
      expect(prisma.refreshToken.update).toHaveBeenCalledWith({
        where: { id: "rt-001" },
        data: { isRevoked: true },
      });
    });

    it("should throw UnauthorizedException if refresh token is revoked", async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: "rt-001",
        isRevoked: true,
        expiresAt: new Date(Date.now() + 100000),
        user: { status: "ACTIVE" },
      });

      await expect(
        service.refresh({ refreshToken: "revoked-token" }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if refresh token is expired", async () => {
      const pastDate = new Date(Date.now() - 100000);
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: "rt-001",
        isRevoked: false,
        expiresAt: pastDate,
        user: { status: "ACTIVE" },
      });

      await expect(
        service.refresh({ refreshToken: "expired-token" }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if user account associated with token is inactive", async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: "rt-001",
        isRevoked: false,
        expiresAt: new Date(Date.now() + 100000),
        user: { status: "INACTIVE" },
      });

      await expect(
        service.refresh({ refreshToken: "valid-token-inactive-user" }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("logout", () => {
    it("should throw BadRequestException if refresh token is empty", async () => {
      await expect(service.logout("")).rejects.toThrow();
    });

    it("should revoke refresh token", async () => {
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
      const result = await service.logout("some-refresh-token");
      expect(result.revoked).toBe(true);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { tokenHash: expect.any(String), isRevoked: false },
        data: { isRevoked: true },
      });
    });
  });

  describe("getMe", () => {
    it("should return user profile with organization name", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "usr-1",
        email: "user@rajtantra.in",
        phone: "+919876543210",
        name: "Test Candidate",
        role: UserRole.CANDIDATE_ADMIN,
        organizationId: "org-1",
        hasAiSeat: true,
        organization: { name: "Kasba Peth Campaign" },
      });

      const profile = await service.getMe("usr-1");
      expect(profile.id).toBe("usr-1");
      expect(profile.organizationName).toBe("Kasba Peth Campaign");
    });

    it("should throw UnauthorizedException if user does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getMe("non-existent")).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
