import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { PollingService } from "./polling.service";
import { PrismaService } from "../../prisma/prisma.service";
import {
  BroadcastScope,
  BroadcastPriority,
  BoothTurnoutPaceStatus,
} from "@rajtantra/common-types";

describe("PollingService", () => {
  let service: PollingService;
  let prisma: any;

  const tenantId = "org-kasba-001";
  const actorId = "user-cadmin-01";

  beforeEach(async () => {
    prisma = {
      pollingBooth: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      voter: {
        count: jest.fn(),
        groupBy: jest.fn(),
      },
      boothHourlyTurnoutLog: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      voterTurnoutAudit: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      broadcastNotification: {
        count: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollingService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PollingService>(PollingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getLiveTelemetry", () => {
    it("computes live turnout percentage and pace classifications", async () => {
      prisma.pollingBooth.findMany.mockResolvedValue([
        {
          id: "b-01",
          boothNumber: "101",
          boothName: "Navbharat Room 1",
          totalVoters: 1000,
          maleVoters: 500,
          femaleVoters: 500,
          lastTurnout: 65.0,
          projectedTurnout: 70.0,
        },
      ]);

      prisma.voter.count
        .mockResolvedValueOnce(1000) // total
        .mockResolvedValueOnce(550)  // voted
        .mockResolvedValueOnce(300)  // male voted
        .mockResolvedValueOnce(250); // female voted

      prisma.boothHourlyTurnoutLog.findMany.mockResolvedValue([
        { timeSlot: "07:00 - 09:00", totalVoted: 120 },
        { timeSlot: "09:00 - 11:00", totalVoted: 200 },
      ]);

      const telemetry = await service.getLiveTelemetry(tenantId);

      expect(telemetry.turnoutPercentage).toBe(55.0);
      expect(telemetry.votesCast).toBe(550);
      expect(telemetry.remainingVoters).toBe(450);
      expect(telemetry.demographics.maleVoted).toBe(300);
      expect(telemetry.timeSlots).toHaveLength(7);
      expect(telemetry.paceSummary).toBeDefined();
    });
  });

  describe("getBoothTurnoutList", () => {
    it("returns list of booths with turnout pace", async () => {
      prisma.pollingBooth.findMany.mockResolvedValue([
        {
          id: "b-01",
          boothNumber: "101",
          boothName: "Navbharat Room 1",
          locality: "Kothrud",
          totalVoters: 1000,
          maleVoters: 520,
          femaleVoters: 480,
          lastTurnout: 68.0,
          bloName: "Sanjay Kulkarni",
          bloPhone: "+919822011234",
        },
      ]);

      prisma.voter.groupBy
        .mockResolvedValueOnce([{ boothNumber: "101", _count: 1000 }]) // registered
        .mockResolvedValueOnce([{ boothNumber: "101", _count: 670 }]); // voted

      const list = await service.getBoothTurnoutList(tenantId);

      expect(list).toHaveLength(1);
      expect(list[0]?.turnoutPercentage).toBe(67.0);
      expect(list[0]?.status).toBe(BoothTurnoutPaceStatus.AHEAD);
    });
  });

  describe("recordHourlyTurnout", () => {
    it("creates hourly turnout log and auto-computes cumulative percentage", async () => {
      prisma.pollingBooth.findUnique.mockResolvedValue({
        id: "b-01",
        totalVoters: 1000,
      });

      prisma.boothHourlyTurnoutLog.create.mockResolvedValue({
        id: "log-01",
        boothNumber: "101",
        timeSlot: "09:00 - 11:00",
        totalVoted: 300,
        cumulativePct: 30.0,
      });

      const res = await service.recordHourlyTurnout(tenantId, {
        boothNumber: "101",
        timeSlot: "09:00 - 11:00",
        maleVoted: 160,
        femaleVoted: 140,
      });

      expect(res.id).toBe("log-01");
      expect(prisma.boothHourlyTurnoutLog.create).toHaveBeenCalled();
    });

    it("throws NotFoundException if booth does not exist", async () => {
      prisma.pollingBooth.findUnique.mockResolvedValue(null);

      await expect(
        service.recordHourlyTurnout(tenantId, {
          boothNumber: "999",
          timeSlot: "09:00 - 11:00",
          maleVoted: 10,
          femaleVoted: 10,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("triggerLpianeMobilizationAlert", () => {
    it("dispatches automated alert for critical lag booth", async () => {
      prisma.pollingBooth.findUnique.mockResolvedValue({
        id: "b-01",
        boothNumber: "103",
        boothName: "Dr. Babasaheb Ambedkar Samaj Mandir",
      });

      prisma.broadcastNotification.create.mockResolvedValue({
        id: "notif-01",
        sentAt: new Date(),
      });

      const res = await service.triggerLpianeMobilizationAlert(tenantId, actorId, "103");

      expect(res.success).toBe(true);
      expect(res.alertDispatched).toBe(true);
      expect(res.boothNumber).toBe("103");
      expect(prisma.broadcastNotification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            scope: BroadcastScope.BOOTH_SPECIFIC,
            priority: BroadcastPriority.URGENT,
            targetBoothNumber: "103",
          }),
        }),
      );
    });
  });
});
