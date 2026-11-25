import { Test, TestingModule } from "@nestjs/testing";
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import {
  BoothsService,
  calculateBoothScore,
} from "./booths.service";
import { PrismaService } from "../../prisma/prisma.service";
import { BoothGrade, BoothSupportLevel } from "@rajtantra/common-types";

describe("BoothsService", () => {
  let service: BoothsService;
  let prisma: {
    pollingBooth: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      delete: jest.Mock;
    };
    user: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    voter: {
      count: jest.Mock;
      groupBy: jest.Mock;
    };
    organization: {
      findUnique: jest.Mock;
    };
    roleDefinition: {
      findUnique: jest.Mock;
    };
    portal: {
      findUnique: jest.Mock;
    };
    userRole: {
      create: jest.Mock;
    };
    portalAssignment: {
      create: jest.Mock;
    };
  };

  const tenantId = "org-kasba-001";

  const mockBooth = {
    id: "booth-001",
    boothNumber: "101",
    boothName: "Navbharat High School, Room 1",
    locality: "Kothrud Depot Road",
    partNumber: "Part 101",
    pollingCentre: "Navbharat Education Complex",
    pollingAddress: "Room 1, Kasba Peth, Pune",
    latitude: 18.52043,
    longitude: 73.85674,
    googleMapsUrl: "https://maps.google.com/?q=18.52043,73.85674",
    totalVoters: 1142,
    maleVoters: 602,
    femaleVoters: 540,
    bloName: "Sanjay K. Kulkarni",
    bloPhone: "+91 98220 11234",
    karyakartasCount: 5,
    slipsPercent: 92,
    projectedTurnout: 74.0,
    lastTurnout: 68.4,
    organizationId: tenantId,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { voters: 10 },
  };

  beforeEach(async () => {
    prisma = {
      pollingBooth: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      voter: {
        count: jest.fn(),
        groupBy: jest.fn(),
      },
      organization: {
        findUnique: jest.fn(),
      },
      roleDefinition: {
        findUnique: jest.fn(),
      },
      portal: {
        findUnique: jest.fn(),
      },
      userRole: {
        create: jest.fn(),
      },
      portalAssignment: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoothsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BoothsService>(BoothsService);
  });

  describe("calculateBoothScore", () => {
    it("should calculate Grade A for high readiness metrics", () => {
      const result = calculateBoothScore({
        projectedTurnout: 80,
        slipsPercent: 90,
        karyakartasCount: 5,
        lastTurnout: 75,
      });

      expect(result.grade).toBe(BoothGrade.A);
      expect(result.score).toBeGreaterThanOrEqual(75);
      expect(result.supportLevel).toBe(BoothSupportLevel.HIGH);
    });

    it("should calculate Grade C or D for low readiness metrics", () => {
      const result = calculateBoothScore({
        projectedTurnout: 40,
        slipsPercent: 30,
        karyakartasCount: 1,
        lastTurnout: 35,
      });

      expect([BoothGrade.C, BoothGrade.D]).toContain(result.grade);
      expect(result.isVulnerable).toBe(true);
    });
  });

  describe("findAll", () => {
    it("should return paginated booths with calculated scores and grades", async () => {
      prisma.pollingBooth.findMany.mockResolvedValue([mockBooth]);

      const result = await service.findAll(tenantId, {
        page: 1,
        limit: 20,
        sortBy: "boothNumber",
        sortOrder: "asc",
      });

      expect(result.booths).toHaveLength(1);
      expect(result.booths[0]!.boothNumber).toBe("101");
      expect(result.booths[0]!.grade).toBeDefined();
      expect(result.booths[0]!.score).toBeDefined();
      expect(result.meta.totalRecords).toBe(1);
    });
  });

  describe("getStats", () => {
    it("should aggregate vitals and grade breakdown", async () => {
      prisma.pollingBooth.findMany.mockResolvedValue([mockBooth]);
      prisma.user.findMany.mockResolvedValue([
        { assignedBooths: "101,102" },
      ]);

      const stats = await service.getStats(tenantId);

      expect(stats.totalBooths).toBe(1);
      expect(stats.totalVoters).toBe(1142);
      expect(stats.gradeBreakdown).toBeDefined();
      expect(stats.averageTurnout).toBe(74);
      expect(stats.bloCoveragePct).toBe(100);
    });
  });

  describe("findById", () => {
    it("should return detailed booth profile with assigned cadre and stances", async () => {
      prisma.pollingBooth.findFirst.mockResolvedValue({
        ...mockBooth,
        hourlyLogs: [],
      });
      prisma.user.findMany.mockResolvedValue([
        {
          id: "cadre-01",
          name: "Suresh Patil",
          phone: "+919876543213",
          status: "ACTIVE",
          activationKey: "KAS101",
          assignedBooths: "101,102",
        },
      ]);
      prisma.voter.groupBy.mockResolvedValue([
        { classification: "SUPPORTER", _count: { id: 8 } },
        { classification: "OPPONENT", _count: { id: 2 } },
      ]);

      const result = await service.findById(tenantId, "101");

      expect(result.boothNumber).toBe("101");
      expect(result.assignedKaryakartas).toHaveLength(1);
      expect(result.assignedKaryakartas[0]!.name).toBe("Suresh Patil");
      expect(result.classificationBreakdown.SUPPORTER).toBe(8);
    });

    it("should throw NotFoundException if booth does not exist", async () => {
      prisma.pollingBooth.findFirst.mockResolvedValue(null);

      await expect(service.findById(tenantId, "999")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("create", () => {
    it("should create a new booth when boothNumber is unique", async () => {
      prisma.pollingBooth.findUnique.mockResolvedValue(null);
      prisma.pollingBooth.create.mockResolvedValue(mockBooth);

      const result = await service.create(tenantId, {
        boothNumber: "101",
        boothName: "Navbharat High School",
        totalVoters: 1000,
        maleVoters: 500,
        femaleVoters: 500,
        karyakartasCount: 2,
        slipsPercent: 50,
      });

      expect(result.boothNumber).toBe("101");
      expect(prisma.pollingBooth.create).toHaveBeenCalled();
    });

    it("should throw ConflictException if booth number already exists", async () => {
      prisma.pollingBooth.findUnique.mockResolvedValue(mockBooth);

      await expect(
        service.create(tenantId, {
          boothNumber: "101",
          boothName: "Duplicate",
          totalVoters: 100,
          maleVoters: 50,
          femaleVoters: 50,
          karyakartasCount: 0,
          slipsPercent: 0,
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("delete", () => {
    it("should delete a booth if no voters are registered in it", async () => {
      prisma.pollingBooth.findFirst.mockResolvedValue(mockBooth);
      prisma.voter.count.mockResolvedValue(0);
      prisma.pollingBooth.delete.mockResolvedValue(mockBooth);

      const result = await service.delete(tenantId, "booth-001");

      expect(result.success).toBe(true);
      expect(prisma.pollingBooth.delete).toHaveBeenCalledWith({
        where: { id: "booth-001" },
      });
    });

    it("should throw BadRequestException if voters are assigned to the booth", async () => {
      prisma.pollingBooth.findFirst.mockResolvedValue(mockBooth);
      prisma.voter.count.mockResolvedValue(15);

      await expect(service.delete(tenantId, "booth-001")).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("Karyakarta workforce management", () => {
    it("should assign karyakartas to a booth and update karyakartasCount", async () => {
      prisma.pollingBooth.findUnique.mockResolvedValue(mockBooth);
      prisma.user.findFirst.mockResolvedValue({
        id: "cadre-01",
        name: "Ganesh Shinde",
        assignedBooths: "103",
      });
      prisma.user.update.mockResolvedValue({});
      prisma.user.findMany.mockResolvedValue([
        { assignedBooths: "101,103" },
      ]);
      prisma.pollingBooth.update.mockResolvedValue({});

      const result = await service.assignKaryakartasToBooth(tenantId, "101", [
        "cadre-01",
      ]);

      expect(result.success).toBe(true);
      expect(result.newlyAssignedCount).toBe(1);
    });
  });

  describe("BLO Directory", () => {
    it("should retrieve BLO directory with formatted contacts", async () => {
      prisma.organization.findUnique.mockResolvedValue({
        constituencyName: "215 - Kasba Peth",
      });
      prisma.pollingBooth.findMany.mockResolvedValue([mockBooth]);

      const directory = await service.getBloDirectory(tenantId);

      expect(directory).toHaveLength(1);
      expect(directory[0]!.name).toBe("Sanjay K. Kulkarni");
      expect(directory[0]!.phone).toBe("+91 98220 11234");
      expect(directory[0]!.boothNumber).toBe("101");
    });
  });
});
