import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { TenantIsolationGuard } from "./tenant-isolation.guard";
import { UserRole } from "@rajtantra/common-types";

describe("TenantIsolationGuard", () => {
  let guard: TenantIsolationGuard;

  beforeEach(() => {
    guard = new TenantIsolationGuard();
  });

  function createMockContext(
    user?: unknown,
    params: Record<string, string> = {},
    query: Record<string, string> = {},
    body: unknown = {},
  ): ExecutionContext {
    const req: Record<string, unknown> = {
      user,
      params,
      query,
      body,
      headers: {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  }

  it("should throw ForbiddenException if user context is missing", () => {
    const ctx = createMockContext(undefined);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException if non-super-admin has no organizationId", () => {
    const ctx = createMockContext({
      id: "u1",
      role: UserRole.CANDIDATE_ADMIN,
      organizationId: null,
    });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("should allow candidate admin when accessing their own organizationId", () => {
    const ctx = createMockContext(
      { id: "u1", role: UserRole.CANDIDATE_ADMIN, organizationId: "org-123" },
      { organizationId: "org-123" },
    );
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("should strictly throw ForbiddenException when candidate admin attempts cross-tenant access in params", () => {
    const ctx = createMockContext(
      { id: "u1", role: UserRole.CANDIDATE_ADMIN, organizationId: "org-123" },
      { organizationId: "org-evil-999" },
    );
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("should strictly throw ForbiddenException when candidate admin attempts cross-tenant access in body", () => {
    const ctx = createMockContext(
      { id: "u1", role: UserRole.CANDIDATE_ADMIN, organizationId: "org-123" },
      {},
      {},
      { organizationId: "org-evil-999" },
    );
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("should allow Super Admin to access any tenant", () => {
    const ctx = createMockContext(
      { id: "u1", role: UserRole.SUPER_ADMIN, organizationId: null },
      { organizationId: "org-any-target" },
    );
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
