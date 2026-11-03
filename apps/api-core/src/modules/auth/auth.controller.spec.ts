import { AuthController } from "./auth.controller";
import { AuthService, LoginResult } from "./auth.service";
import { UserRole, AuthenticatedUser } from "@rajtantra/common-types";
import { Request } from "express";

describe("AuthController", () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(() => {
    service = {
      login: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
      getMe: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    controller = new AuthController(service);
  });

  it("should call login on service and return result", async () => {
    const mockResult: LoginResult = {
      user: {
        id: "usr-1",
        email: "user@rajtantra.in",
        phone: "+919876543210",
        name: "Test User",
        role: UserRole.CANDIDATE_ADMIN,
        organizationId: "org-1",
        hasAiSeat: false,
      },
      tokens: {
        accessToken: "mock-access",
        refreshToken: "mock-refresh",
        tokenType: "Bearer",
        expiresIn: 900,
      },
    };

    service.login.mockResolvedValue(mockResult);

    const req = {
      headers: { "user-agent": "JestTest" },
      socket: { remoteAddress: "127.0.0.1" },
    } as unknown as Request;

    const result = await controller.login(
      { identifier: "user@rajtantra.in", password: "password123" },
      req,
    );

    expect(result).toEqual(mockResult);
    expect(service.login).toHaveBeenCalledWith(
      { identifier: "user@rajtantra.in", password: "password123" },
      "127.0.0.1",
      "JestTest",
    );
  });

  it("should call refresh on service and return new tokens", async () => {
    const mockTokens = {
      accessToken: "new-access",
      refreshToken: "new-refresh",
      tokenType: "Bearer" as const,
      expiresIn: 900,
    };
    service.refresh.mockResolvedValue(mockTokens);

    const result = await controller.refresh({
      refreshToken: "valid-refresh-token",
    });
    expect(result).toEqual(mockTokens);
  });

  it("should call logout and return success message", async () => {
    service.logout.mockResolvedValue({ revoked: true });

    const result = await controller.logout({ refreshToken: "token-to-revoke" });
    expect(result.message).toContain("Successfully logged out");
  });

  it("should call getMe with current user ID", async () => {
    const currentUser: AuthenticatedUser = {
      id: "usr-1",
      email: "user@rajtantra.in",
      phone: "+919876543210",
      name: "Test User",
      role: UserRole.CANDIDATE_ADMIN,
      organizationId: "org-1",
      hasAiSeat: false,
    };

    service.getMe.mockResolvedValue({
      ...currentUser,
      organizationName: "Kasba Peth",
    });

    const result = await controller.getMe(currentUser);
    expect(result.id).toBe("usr-1");
    expect(result.organizationName).toBe("Kasba Peth");
  });

  it("should call registerEnquiry on service and return acknowledgement", async () => {
    const mockEnquiryResult = {
      enquiryNumber: "ENQ-2026-12345",
      message: "Enquiry submitted successfully",
      status: "PENDING",
      candidateName: "Rameshwar Patil",
      constituencyName: "Kasba Peth",
      createdAt: new Date(),
    };
    service.registerEnquiry = jest.fn().mockResolvedValue(mockEnquiryResult);

    const dto = {
      fullName: "Rameshwar Patil",
      mobile: "+919822014590",
      email: "rameshwar@patil.in",
      password: "Password123",
      candidateName: "Rameshwar Patil",
      candidateContact: "+919822014590",
      candidateType: "MLA",
      partyName: "BJP",
      electionType: "VIDHAN_SABHA",
      state: "Maharashtra",
      district: "Pune",
      constituencyName: "Kasba Peth",
      boothsCount: 250,
      electionYear: 2026,
      requestedServices: ["VOTER_DATA"],
    };

    const result = await controller.registerEnquiry(dto);
    expect(result).toEqual(mockEnquiryResult);
    expect(service.registerEnquiry).toHaveBeenCalledWith(dto);
  });

  it("should call forgotPassword on service and return challenge response", async () => {
    service.forgotPassword = jest.fn().mockResolvedValue({
      message: "Verification code dispatched",
      challengeSent: true,
    });

    const result = await controller.forgotPassword({ identifier: "candidate@rajtantra.in" });
    expect(result.challengeSent).toBe(true);
    expect(service.forgotPassword).toHaveBeenCalledWith({ identifier: "candidate@rajtantra.in" });
  });
});

