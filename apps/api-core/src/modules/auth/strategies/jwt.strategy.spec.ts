import { UnauthorizedException } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserRole } from "@rajtantra/common-types";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;
  let prisma: {
    user: { findUnique: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      user: { findUnique: jest.fn() },
    };
    strategy = new JwtStrategy(prisma as unknown as PrismaService);
  });

  it("should validate and return active user profile", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "usr-1",
      email: "admin@rajtantra.in",
      phone: "+919876543210",
      name: "Super Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      organizationId: null,
      hasAiSeat: true,
    });

    const result = await strategy.validate({
      sub: "usr-1",
      email: "admin@rajtantra.in",
      phone: "+919876543210",
      role: UserRole.SUPER_ADMIN,
      organizationId: null,
      hasAiSeat: true,
    });

    expect(result.id).toBe("usr-1");
    expect(result.role).toBe(UserRole.SUPER_ADMIN);
  });

  it("should throw UnauthorizedException if user is not found or inactive", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      strategy.validate({
        sub: "usr-deleted",
        email: "deleted@rajtantra.in",
        phone: "+919876543299",
        role: UserRole.CANDIDATE_ADMIN,
        organizationId: "org-1",
        hasAiSeat: false,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
