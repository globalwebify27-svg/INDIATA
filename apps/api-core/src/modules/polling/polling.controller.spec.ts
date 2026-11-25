import { Test, TestingModule } from "@nestjs/testing";
import { PollingController } from "./polling.controller";
import { PollingService } from "./polling.service";
import {
  UserRole,
  AuthenticatedUser,
  BoothTurnoutPaceStatus,
} from "@rajtantra/common-types";

describe("PollingController", () => {
  let controller: PollingController;
  let service: {
    getLiveTelemetry: jest.Mock;
    getBoothTurnoutList: jest.Mock;
    recordHourlyTurnout: jest.Mock;
    getHourlyTurnoutLogs: jest.Mock;
    getTurnoutAudits: jest.Mock;
    createBroadcastNotification: jest.Mock;
    getBroadcastNotifications: jest.Mock;
    triggerLpianeMobilizationAlert: jest.Mock;
  };

  const tenantId = "org-kasba-001";
  const mockUser: AuthenticatedUser = {
    id: "usr-admin-01",
    email: "anand.shinde@indata-election.in",
    phone: "+919876543212",
    name: "Anand Shinde",
    role: UserRole.CANDIDATE_ADMIN,
    organizationId: tenantId,
    hasAiSeat: false,
  };

  beforeEach(async () => {
    service = {
      getLiveTelemetry: jest.fn(),
      getBoothTurnoutList: jest.fn(),
      recordHourlyTurnout: jest.fn(),
      getHourlyTurnoutLogs: jest.fn(),
      getTurnoutAudits: jest.fn(),
      createBroadcastNotification: jest.fn(),
      getBroadcastNotifications: jest.fn(),
      triggerLpianeMobilizationAlert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollingController],
      providers: [{ provide: PollingService, useValue: service }],
    }).compile();

    controller = module.get<PollingController>(PollingController);
  });

  describe("getLiveTelemetry", () => {
    it("returns telemetry metrics", async () => {
      const mockTelemetry = { turnoutPercentage: 62.5, totalRegistered: 10000 };
      service.getLiveTelemetry.mockResolvedValue(mockTelemetry);

      const res = await controller.getLiveTelemetry(tenantId);
      expect(res).toEqual(mockTelemetry);
      expect(service.getLiveTelemetry).toHaveBeenCalledWith(tenantId);
    });
  });

  describe("getBoothTurnoutList", () => {
    it("returns booth-wise turnout list", async () => {
      service.getBoothTurnoutList.mockResolvedValue([]);

      await controller.getBoothTurnoutList(tenantId, "Kothrud", BoothTurnoutPaceStatus.AHEAD);
      expect(service.getBoothTurnoutList).toHaveBeenCalledWith(tenantId, {
        search: "Kothrud",
        status: BoothTurnoutPaceStatus.AHEAD,
      });
    });
  });

  describe("recordHourlyTurnout", () => {
    it("calls service.recordHourlyTurnout", async () => {
      const dto = {
        boothNumber: "101",
        timeSlot: "09:00 - 11:00",
        maleVoted: 100,
        femaleVoted: 90,
      };
      service.recordHourlyTurnout.mockResolvedValue({ id: "log-01", ...dto });

      const res = await controller.recordHourlyTurnout(tenantId, dto);
      expect(res.id).toBe("log-01");
      expect(service.recordHourlyTurnout).toHaveBeenCalledWith(tenantId, dto);
    });
  });

  describe("triggerMobilization", () => {
    it("triggers LPIANE automated mobilization alert", async () => {
      service.triggerLpianeMobilizationAlert.mockResolvedValue({
        success: true,
        alertDispatched: true,
        boothNumber: "103",
      });

      const res = await controller.triggerMobilization(tenantId, mockUser, "103");
      expect(res.success).toBe(true);
      expect(service.triggerLpianeMobilizationAlert).toHaveBeenCalledWith(
        tenantId,
        mockUser.id,
        "103",
      );
    });
  });
});
