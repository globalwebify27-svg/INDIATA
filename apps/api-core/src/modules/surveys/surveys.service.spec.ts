import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { SurveysService } from "./surveys.service";
import { PrismaService } from "../../prisma/prisma.service";
import {
  SlipChannel,
  SlipStatus,
  TicketPriority,
  TicketStatus,
  CorrectionStatus,
} from "@rajtantra/common-types";

describe("SurveysService", () => {
  let service: SurveysService;
  let prisma: any;

  const tenantId = "org-kasba-001";
  const actorId = "user-karyakarta-01";

  beforeEach(async () => {
    prisma = {
      voterSurveyRecord: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      voterSlipDispatch: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
        update: jest.fn(),
      },
      issueTicket: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      voterCorrectionRequest: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      voter: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveysService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SurveysService>(SurveysService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Surveys Management", () => {
    it("findAllSurveys returns paginated list of surveys", async () => {
      prisma.voterSurveyRecord.count.mockResolvedValue(1);
      prisma.voterSurveyRecord.findMany.mockResolvedValue([
        {
          id: "survey-01",
          welfareScheme: "PM Awas",
          voter: { name: "Rajesh Verma" },
          karyakarta: { name: "Suresh Patil" },
        },
      ]);

      const result = await service.findAllSurveys(tenantId, {
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      expect(result.surveys).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it("getSurveyStats returns breakdown and geotagged percentage", async () => {
      prisma.voterSurveyRecord.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8); // geotagged
      prisma.voterSurveyRecord.findMany.mockResolvedValue([
        { welfareScheme: "PM Awas" },
        { welfareScheme: "PM Awas" },
        { welfareScheme: "Ladki Bahin" },
      ]);

      const stats = await service.getSurveyStats(tenantId);
      expect(stats.totalSurveys).toBe(10);
      expect(stats.geotaggedSurveys).toBe(8);
      expect(stats.geotaggedPercent).toBe(80.0);
      expect(stats.schemeBreakdown).toHaveLength(2);
    });

    it("createSurvey successfully inserts record and marks voter visited", async () => {
      prisma.voter.findFirst.mockResolvedValue({ id: "voter-01" });
      const createdSurvey = { id: "survey-new", voterId: "voter-01", isGeotagged: true };
      prisma.voterSurveyRecord.create.mockResolvedValue(createdSurvey);
      prisma.voter.update.mockResolvedValue({ id: "voter-01", isVisited: true });

      const res = await service.createSurvey(tenantId, actorId, {
        voterId: "voter-01",
        welfareScheme: "PM Awas",
        gpsLat: 18.52043,
        gpsLng: 73.85674,
      });

      expect(res.id).toBe("survey-new");
      expect(prisma.voter.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "voter-01" },
          data: expect.objectContaining({ isVisited: true }),
        }),
      );
    });

    it("createSurvey throws NotFoundException if voter does not exist", async () => {
      prisma.voter.findFirst.mockResolvedValue(null);

      await expect(
        service.createSurvey(tenantId, actorId, { voterId: "non-existent" }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("ECI Voter Slips", () => {
    it("findAllSlips returns list of dispatched slips", async () => {
      prisma.voterSlipDispatch.count.mockResolvedValue(1);
      prisma.voterSlipDispatch.findMany.mockResolvedValue([
        {
          id: "slip-01",
          channel: SlipChannel.WHATSAPP_DIGITAL,
          status: SlipStatus.DELIVERED,
        },
      ]);

      const res = await service.findAllSlips(tenantId, {
        page: 1,
        limit: 20,
        sortBy: "dispatchedAt",
        sortOrder: "desc",
      });

      expect(res.slips).toHaveLength(1);
      expect(res.meta.total).toBe(1);
    });

    it("dispatchSlip creates slip record", async () => {
      prisma.voter.findFirst.mockResolvedValue({ id: "voter-01" });
      prisma.voterSlipDispatch.create.mockResolvedValue({
        id: "slip-new",
        channel: SlipChannel.WHATSAPP_DIGITAL,
        status: SlipStatus.DELIVERED,
      });

      const res = await service.dispatchSlip(tenantId, actorId, {
        voterId: "voter-01",
        channel: SlipChannel.WHATSAPP_DIGITAL,
        status: SlipStatus.DELIVERED,
      });

      expect(res.id).toBe("slip-new");
      expect(prisma.voterSlipDispatch.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            voterId: "voter-01",
            channel: SlipChannel.WHATSAPP_DIGITAL,
            status: SlipStatus.DELIVERED,
          }),
        }),
      );
    });

    it("dispatchBulkSlips creates slips in batch", async () => {
      prisma.voter.findMany.mockResolvedValue([{ id: "v-01" }, { id: "v-02" }]);
      prisma.voterSlipDispatch.createMany.mockResolvedValue({ count: 2 });

      const res = await service.dispatchBulkSlips(tenantId, actorId, {
        voterIds: ["v-01", "v-02"],
        channel: SlipChannel.PHYSICAL_DELIVERY,
        status: SlipStatus.PRINTED,
      });

      expect(res.success).toBe(true);
      expect(res.totalDispatched).toBe(2);
    });
  });

  describe("Civic Issue Tickets", () => {
    it("createTicket generates unique ticket number and assigns defaults", async () => {
      prisma.voter.findFirst.mockResolvedValue({
        name: "Suresh Patil",
        phone: "+919876543210",
        boothNumber: "101",
      });

      prisma.issueTicket.create.mockResolvedValue({
        id: "tck-01",
        ticketNumber: "TCK-2026-1234",
        category: "Water Supply",
        priority: TicketPriority.HIGH,
        status: TicketStatus.NEW,
      });

      const res = await service.createTicket(tenantId, actorId, "Agent Name", {
        voterId: "v-01",
        category: "Water Supply",
        description: "Low pressure in line 4",
        priority: TicketPriority.HIGH,
        status: TicketStatus.NEW,
      });

      expect(res.ticketNumber).toBeDefined();
      expect(res.category).toBe("Water Supply");
    });

    it("updateTicket updates status and notes", async () => {
      prisma.issueTicket.findFirst.mockResolvedValue({
        id: "tck-01",
        ticketNumber: "TCK-2026-1234",
      });
      prisma.issueTicket.update.mockResolvedValue({
        id: "tck-01",
        status: TicketStatus.RESOLVED,
        resolutionNotes: "Fixed pipeline",
      });

      const res = await service.updateTicket(tenantId, "tck-01", {
        status: TicketStatus.RESOLVED,
        resolutionNotes: "Fixed pipeline",
      });

      expect(res.status).toBe(TicketStatus.RESOLVED);
    });
  });

  describe("Quarantine Voter Corrections", () => {
    it("createCorrection submits field change request", async () => {
      prisma.voter.findFirst.mockResolvedValue({ id: "v-01" });
      prisma.voterCorrectionRequest.create.mockResolvedValue({
        id: "corr-01",
        voterId: "v-01",
        status: CorrectionStatus.PENDING_WAR_ROOM,
      });

      const res = await service.createCorrection(tenantId, actorId, {
        voterId: "v-01",
        proposedDataJson: JSON.stringify({ phone: "+919999999999" }),
        reason: "Updated contact info on doorstep visit",
      });

      expect(res.id).toBe("corr-01");
      expect(res.status).toBe(CorrectionStatus.PENDING_WAR_ROOM);
    });

    it("reviewCorrection merges approved fields into voter record", async () => {
      prisma.voterCorrectionRequest.findFirst.mockResolvedValue({
        id: "corr-01",
        voterId: "v-01",
        proposedDataJson: JSON.stringify({ phone: "+919999999999" }),
      });
      prisma.voterCorrectionRequest.update.mockResolvedValue({
        id: "corr-01",
        status: CorrectionStatus.APPROVED,
      });
      prisma.voter.update.mockResolvedValue({ id: "v-01" });

      const res = await service.reviewCorrection(tenantId, "admin-01", "corr-01", {
        status: "APPROVED",
      });

      expect(res.status).toBe(CorrectionStatus.APPROVED);
      expect(prisma.voter.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "v-01" },
          data: { phone: "+919999999999" },
        }),
      );
    });
  });
});
