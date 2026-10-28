import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";
import { UserRole } from "@rajtantra/common-types";

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    guard = new RolesGuard(reflector);
  });

  function createMockContext(user?: unknown): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  }

  it("should allow access if route is public", () => {
    reflector.getAllAndOverride.mockReturnValueOnce(true); // isPublic
    const ctx = createMockContext();
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("should allow access if no roles are required", () => {
    reflector.getAllAndOverride
      .mockReturnValueOnce(false) // isPublic
      .mockReturnValueOnce(undefined); // requiredRoles
    const ctx = createMockContext({ id: "u1", role: UserRole.KARYAKARTA });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("should allow Super Admin regardless of required roles", () => {
    reflector.getAllAndOverride
      .mockReturnValueOnce(false)
      .mockReturnValueOnce([UserRole.CANDIDATE_ADMIN]);
    const ctx = createMockContext({ id: "u1", role: UserRole.SUPER_ADMIN });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("should allow user having one of the required roles", () => {
    reflector.getAllAndOverride
      .mockReturnValueOnce(false)
      .mockReturnValueOnce([UserRole.CANDIDATE_ADMIN, UserRole.DISTRIBUTOR]);
    const ctx = createMockContext({ id: "u1", role: UserRole.CANDIDATE_ADMIN });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("should throw ForbiddenException if user lacks required role", () => {
    reflector.getAllAndOverride
      .mockReturnValueOnce(false)
      .mockReturnValueOnce([UserRole.CANDIDATE_ADMIN]);
    const ctx = createMockContext({ id: "u1", role: UserRole.KARYAKARTA });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException if user context is missing", () => {
    reflector.getAllAndOverride
      .mockReturnValueOnce(false)
      .mockReturnValueOnce([UserRole.CANDIDATE_ADMIN]);
    const ctx = createMockContext(undefined);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
