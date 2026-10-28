import { ForbiddenException } from "@nestjs/common";
import { getTenantIdFromContext, RequestWithTenant } from "./tenant.decorator";
import { UserRole, AuthenticatedUser } from "@rajtantra/common-types";

describe("TenantDecorator", () => {
  it("should return user organizationId for regular user", () => {
    const user: AuthenticatedUser = {
      id: "usr-1",
      email: "cand@rajtantra.in",
      phone: "+919876543212",
      name: "Candidate",
      role: UserRole.CANDIDATE_ADMIN,
      organizationId: "org-test-123",
      hasAiSeat: false,
    };

    const req = { user, headers: {} } as unknown as RequestWithTenant;
    expect(getTenantIdFromContext(req)).toBe("org-test-123");
  });

  it("should return explicit header organizationId for Super Admin", () => {
    const user: AuthenticatedUser = {
      id: "usr-sa",
      email: "super@rajtantra.in",
      phone: "+919876543210",
      name: "Super Admin",
      role: UserRole.SUPER_ADMIN,
      organizationId: null,
      hasAiSeat: true,
    };

    const req = {
      user,
      headers: { "x-organization-id": "org-target-999" },
    } as unknown as RequestWithTenant;

    expect(getTenantIdFromContext(req)).toBe("org-target-999");
  });

  it("should throw ForbiddenException if user context is missing", () => {
    const req = { headers: {} } as unknown as RequestWithTenant;
    expect(() => getTenantIdFromContext(req)).toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException if user has no organizationId and is not Super Admin", () => {
    const user: AuthenticatedUser = {
      id: "usr-no-org",
      email: "cand@rajtantra.in",
      phone: "+919876543212",
      name: "Candidate",
      role: UserRole.CANDIDATE_ADMIN,
      organizationId: null,
      hasAiSeat: false,
    };

    const req = { user, headers: {} } as unknown as RequestWithTenant;
    expect(() => getTenantIdFromContext(req)).toThrow(ForbiddenException);
  });
});
