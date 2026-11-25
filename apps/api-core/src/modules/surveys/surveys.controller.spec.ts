import { Test, TestingModule } from "@nestjs/testing";
import { SurveysController } from "./surveys.controller";
import { SlipsController } from "./slips.controller";
import { TicketsController } from "./tickets.controller";
import { SurveysService } from "./surveys.service";
import {
  UserRole,
  AuthenticatedUser,
  SlipChannel,
  SlipStatus,
  TicketPriority,
  TicketStatus,
} from "@rajtantra/common-types";

describe("Surveys, Slips & Tickets Controllers", () => {
  let surveysController: SurveysController;
  let slipsController: SlipsController;
  let ticketsController: TicketsController;

  let service: {
    findAllSurveys: jest.Mock;
    getSurveyStats: jest.Mock;
    findSurveyById: jest.Mock;
    createSurvey: jest.Mock;
    updateSurvey: jest.Mock;
    deleteSurvey: jest.Mock;
    findAllSlips: jest.Mock;
    getSlipStats: jest.Mock;
    dispatchSlip: jest.Mock;
    dispatchBulkSlips: jest.Mock;
    updateSlipStatus: jest.Mock;
    findAllTickets: jest.Mock;
    getTicketStats: jest.Mock;
    findTicketById: jest.Mock;
    createTicket: jest.Mock;
    updateTicket: jest.Mock;
    deleteTicket: jest.Mock;
    findAllCorrections: jest.Mock;
    createCorrection: jest.Mock;
    reviewCorrection: jest.Mock;
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
      findAllSurveys: jest.fn(),
      getSurveyStats: jest.fn(),
      findSurveyById: jest.fn(),
      createSurvey: jest.fn(),
      updateSurvey: jest.fn(),
      deleteSurvey: jest.fn(),
      findAllSlips: jest.fn(),
      getSlipStats: jest.fn(),
      dispatchSlip: jest.fn(),
      dispatchBulkSlips: jest.fn(),
      updateSlipStatus: jest.fn(),
      findAllTickets: jest.fn(),
      getTicketStats: jest.fn(),
      findTicketById: jest.fn(),
      createTicket: jest.fn(),
      updateTicket: jest.fn(),
      deleteTicket: jest.fn(),
      findAllCorrections: jest.fn(),
      createCorrection: jest.fn(),
      reviewCorrection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveysController, SlipsController, TicketsController],
      providers: [{ provide: SurveysService, useValue: service }],
    }).compile();

    surveysController = module.get<SurveysController>(SurveysController);
    slipsController = module.get<SlipsController>(SlipsController);
    ticketsController = module.get<TicketsController>(TicketsController);
  });

  describe("SurveysController", () => {
    it("getStats returns survey stats", async () => {
      const stats = { totalSurveys: 5, geotaggedSurveys: 4, geotaggedPercent: 80.0 };
      service.getSurveyStats.mockResolvedValue(stats);

      const res = await surveysController.getStats(tenantId);
      expect(res).toEqual(stats);
      expect(service.getSurveyStats).toHaveBeenCalledWith(tenantId);
    });

    it("findAll calls service.findAllSurveys", async () => {
      service.findAllSurveys.mockResolvedValue({ surveys: [], meta: { total: 0 } });
      const query = { page: 1, limit: 10, sortBy: "createdAt" as const, sortOrder: "desc" as const };

      await surveysController.findAll(tenantId, query);
      expect(service.findAllSurveys).toHaveBeenCalledWith(tenantId, query);
    });

    it("create passes actor id to service", async () => {
      const dto = { voterId: "v-01", welfareScheme: "PM Awas" };
      service.createSurvey.mockResolvedValue({ id: "s-01", ...dto });

      const res = await surveysController.create(tenantId, mockUser, dto);
      expect(res.id).toBe("s-01");
      expect(service.createSurvey).toHaveBeenCalledWith(tenantId, mockUser.id, dto);
    });
  });

  describe("SlipsController", () => {
    it("getStats returns slip stats", async () => {
      const stats = { totalSlips: 20, deliveredPercent: 65.0 };
      service.getSlipStats.mockResolvedValue(stats);

      const res = await slipsController.getStats(tenantId);
      expect(res).toEqual(stats);
    });

    it("dispatch calls service.dispatchSlip", async () => {
      const dto = {
        voterId: "v-01",
        channel: SlipChannel.WHATSAPP_DIGITAL,
        status: SlipStatus.GENERATED,
      };
      service.dispatchSlip.mockResolvedValue({ id: "slip-01", ...dto });

      const res = await slipsController.dispatch(tenantId, mockUser, dto);
      expect(res.id).toBe("slip-01");
      expect(service.dispatchSlip).toHaveBeenCalledWith(tenantId, mockUser.id, dto);
    });
  });

  describe("TicketsController", () => {
    it("getStats returns ticket stats", async () => {
      const stats = { totalTickets: 8, resolutionRate: 75.0 };
      service.getTicketStats.mockResolvedValue(stats);

      const res = await ticketsController.getStats(tenantId);
      expect(res).toEqual(stats);
    });

    it("create calls service.createTicket with actor info", async () => {
      const dto = {
        category: "Sanitation",
        description: "Garbage collection delayed",
        priority: TicketPriority.HIGH,
        status: TicketStatus.NEW,
      };
      service.createTicket.mockResolvedValue({ id: "tck-01", ...dto });

      const res = await ticketsController.create(tenantId, mockUser, dto);
      expect(res.id).toBe("tck-01");
      expect(service.createTicket).toHaveBeenCalledWith(
        tenantId,
        mockUser.id,
        mockUser.name,
        dto,
      );
    });
  });
});
