import { Test, TestingModule } from "@nestjs/testing";
import { BoothsController } from "./booths.controller";
import { BoothsService } from "./booths.service";
import { BoothGrade, BloStatus } from "@rajtantra/common-types";

describe("BoothsController", () => {
  let controller: BoothsController;
  let service: {
    getStats: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    getWorkforce: jest.Mock;
    createKaryakarta: jest.Mock;
    assignKaryakartasToBooth: jest.Mock;
    unassignKaryakartaFromBooth: jest.Mock;
    getBloDirectory: jest.Mock;
    updateBloOfficer: jest.Mock;
  };

  const tenantId = "org-kasba-001";

  beforeEach(async () => {
    service = {
      getStats: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getWorkforce: jest.fn(),
      createKaryakarta: jest.fn(),
      assignKaryakartasToBooth: jest.fn(),
      unassignKaryakartaFromBooth: jest.fn(),
      getBloDirectory: jest.fn(),
      updateBloOfficer: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoothsController],
      providers: [{ provide: BoothsService, useValue: service }],
    }).compile();

    controller = module.get<BoothsController>(BoothsController);
  });

  describe("getStats", () => {
    it("should return aggregate statistics", async () => {
      const mockStats = {
        totalBooths: 8,
        totalVoters: 9500,
        gradeBreakdown: { gradeA: 4, gradeB: 3, gradeC: 1, gradeD: 0 },
      };
      service.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(tenantId);
      expect(result).toBe(mockStats);
      expect(service.getStats).toHaveBeenCalledWith(tenantId);
    });
  });

  describe("findAll", () => {
    it("should return paginated booths with calculated grades", async () => {
      const mockResult = {
        booths: [{ boothNumber: "101", grade: BoothGrade.A, score: 85 }],
        meta: { page: 1, limit: 20, totalRecords: 1, totalPages: 1 },
      };
      service.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(tenantId, {
        page: 1,
        limit: 20,
        sortBy: "boothNumber",
        sortOrder: "asc",
      });

      expect(result).toBe(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(tenantId, expect.any(Object));
    });
  });

  describe("findById", () => {
    it("should return a single booth by id", async () => {
      const mockBooth = { id: "b1", boothNumber: "101" };
      service.findById.mockResolvedValue(mockBooth);

      const result = await controller.findById(tenantId, "b1");
      expect(result).toBe(mockBooth);
      expect(service.findById).toHaveBeenCalledWith(tenantId, "b1");
    });
  });

  describe("create", () => {
    it("should create a new booth", async () => {
      const dto = {
        boothNumber: "109",
        boothName: "New High School",
        totalVoters: 800,
        maleVoters: 400,
        femaleVoters: 400,
        karyakartasCount: 2,
        slipsPercent: 50,
      };
      service.create.mockResolvedValue({ id: "b9", ...dto });

      const result = await controller.create(tenantId, dto);
      expect(result.boothNumber).toBe("109");
      expect(service.create).toHaveBeenCalledWith(tenantId, dto);
    });
  });

  describe("workforce operations", () => {
    it("should get workforce roster", async () => {
      const mockCadre = [{ id: "u1", name: "Suresh Patil", assignedBooths: ["101"] }];
      service.getWorkforce.mockResolvedValue(mockCadre);

      const result = await controller.getWorkforce(tenantId, "Suresh");
      expect(result).toBe(mockCadre);
      expect(service.getWorkforce).toHaveBeenCalledWith(tenantId, {
        search: "Suresh",
        boothNumber: undefined,
      });
    });

    it("should assign karyakartas to a booth", async () => {
      service.assignKaryakartasToBooth.mockResolvedValue({ success: true });

      const result = await controller.assignKaryakartas(tenantId, "101", {
        karyakartaIds: ["550e8400-e29b-41d4-a716-446655440000"],
      });

      expect(result.success).toBe(true);
      expect(service.assignKaryakartasToBooth).toHaveBeenCalledWith(
        tenantId,
        "101",
        ["550e8400-e29b-41d4-a716-446655440000"]
      );
    });

    it("should unassign karyakarta from a booth", async () => {
      service.unassignKaryakartaFromBooth.mockResolvedValue({ success: true });

      const result = await controller.unassignKaryakarta(tenantId, "101", "u1");
      expect(result.success).toBe(true);
      expect(service.unassignKaryakartaFromBooth).toHaveBeenCalledWith(
        tenantId,
        "101",
        "u1"
      );
    });
  });

  describe("BLO Directory", () => {
    it("should get BLO directory", async () => {
      const mockBlo = [{ id: "blo-101", name: "Sanjay Kulkarni" }];
      service.getBloDirectory.mockResolvedValue(mockBlo);

      const result = await controller.getBloDirectory(tenantId);
      expect(result).toBe(mockBlo);
      expect(service.getBloDirectory).toHaveBeenCalledWith(tenantId, {
        search: undefined,
      });
    });

    it("should update BLO officer contact", async () => {
      service.updateBloOfficer.mockResolvedValue({
        boothNumber: "101",
        bloName: "New Officer",
      });

      const result = await controller.updateBloOfficer(tenantId, "101", {
        bloName: "New Officer",
        status: BloStatus.ACTIVE,
      });

      expect(result.bloName).toBe("New Officer");
      expect(service.updateBloOfficer).toHaveBeenCalledWith(
        tenantId,
        "101",
        expect.any(Object)
      );
    });
  });
});
