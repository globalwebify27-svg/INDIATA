import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UserRole } from "@rajtantra/common-types";

describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    guard = new JwtAuthGuard(reflector, jwtService);
  });

  function createMockContext(
    headers: Record<string, string> = {},
  ): ExecutionContext {
    const req = { headers, user: undefined };
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  }

  it("should allow access if route has @Public() decorator", async () => {
    reflector.getAllAndOverride.mockReturnValueOnce(true);
    const ctx = createMockContext();
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it("should throw UnauthorizedException if Authorization header is missing", async () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false);
    const ctx = createMockContext({});
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if Authorization header is not Bearer", async () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false);
    const ctx = createMockContext({ authorization: "Basic abc123xyz" });
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it("should authenticate user and attach to request when Bearer token is valid", async () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false);
    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: "usr-1",
      email: "admin@rajtantra.in",
      phone: "+919876543210",
      role: UserRole.SUPER_ADMIN,
      organizationId: null,
      hasAiSeat: true,
    });

    const ctx = createMockContext({ authorization: "Bearer valid.jwt.token" });
    const result = await guard.canActivate(ctx);

    expect(result).toBe(true);
    const req = ctx.switchToHttp().getRequest() as { user?: unknown };
    expect(req.user).toMatchObject({
      id: "usr-1",
      email: "admin@rajtantra.in",
      role: UserRole.SUPER_ADMIN,
    });
  });

  it("should throw UnauthorizedException when JWT verification fails", async () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false);
    jwtService.verifyAsync.mockRejectedValueOnce(new Error("Token expired"));

    const ctx = createMockContext({
      authorization: "Bearer expired.jwt.token",
    });
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});
