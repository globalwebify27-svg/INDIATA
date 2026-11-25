import { Test, TestingModule } from "@nestjs/testing";
import { CampaignsController } from "./campaigns.controller";
import { CampaignsService } from "./campaigns.service";
import {
  UserRole,
  AuthenticatedUser,
  CampaignChannel,
  CampaignStatus,
} from "@rajtantra/common-types";

describe("CampaignsController", () => {
  let controller: CampaignsController;
  let service: {
    getCampaignStats: jest.Mock;
    getChannelCredits: jest.Mock;
    estimateAudience: jest.Mock;
    findAllTemplates: jest.Mock;
    createTemplate: jest.Mock;
    findAllResponses: jest.Mock;
    findAllTriggers: jest.Mock;
    findAllCampaigns: jest.Mock;
    findCampaignById: jest.Mock;
    createCampaign: jest.Mock;
    updateCampaignStatus: jest.Mock;
    launchCampaign: jest.Mock;
    deleteCampaign: jest.Mock;
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
      getCampaignStats: jest.fn(),
      getChannelCredits: jest.fn(),
      estimateAudience: jest.fn(),
      findAllTemplates: jest.fn(),
      createTemplate: jest.fn(),
      findAllResponses: jest.fn(),
      findAllTriggers: jest.fn(),
      findAllCampaigns: jest.fn(),
      findCampaignById: jest.fn(),
      createCampaign: jest.fn(),
      updateCampaignStatus: jest.fn(),
      launchCampaign: jest.fn(),
      deleteCampaign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [{ provide: CampaignsService, useValue: service }],
    }).compile();

    controller = module.get<CampaignsController>(CampaignsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getStats", () => {
    it("returns campaign statistics", async () => {
      const mockStats = { totalCampaigns: 5, totalDelivered: 12500 };
      service.getCampaignStats.mockResolvedValue(mockStats);

      const res = await controller.getStats(tenantId);
      expect(res).toEqual(mockStats);
      expect(service.getCampaignStats).toHaveBeenCalledWith(tenantId);
    });
  });

  describe("getCredits", () => {
    it("returns communication credits", async () => {
      const mockCredits = { whatsappBalance: 15000, smsBalance: 25000 };
      service.getChannelCredits.mockResolvedValue(mockCredits);

      const res = await controller.getCredits(tenantId);
      expect(res).toEqual(mockCredits);
      expect(service.getChannelCredits).toHaveBeenCalledWith(tenantId);
    });
  });

  describe("estimateAudience", () => {
    it("estimates audience size and cost", async () => {
      const dto = { booths: ["101"], channel: CampaignChannel.WHATSAPP };
      const mockEst = { matchingVotersCount: 1500, estimatedCredits: 1500 };
      service.estimateAudience.mockResolvedValue(mockEst);

      const res = await controller.estimateAudience(tenantId, dto);
      expect(res).toEqual(mockEst);
      expect(service.estimateAudience).toHaveBeenCalledWith(tenantId, dto);
    });
  });

  describe("getTemplates", () => {
    it("returns template list", async () => {
      service.findAllTemplates.mockResolvedValue([]);
      const res = await controller.getTemplates(tenantId, CampaignChannel.WHATSAPP, "VOTER_SLIP");
      expect(res).toEqual([]);
      expect(service.findAllTemplates).toHaveBeenCalledWith(tenantId, {
        channel: CampaignChannel.WHATSAPP,
        category: "VOTER_SLIP",
      });
    });
  });

  describe("createTemplate", () => {
    it("creates a template", async () => {
      const dto = {
        name: "Morning Blast",
        channel: CampaignChannel.WHATSAPP,
        bodyText: "Vote today at booth {{booth}}",
      };
      const mockCreated = { id: "tpl-1", ...dto };
      service.createTemplate.mockResolvedValue(mockCreated);

      const res = await controller.createTemplate(tenantId, dto as any);
      expect(res).toEqual(mockCreated);
      expect(service.createTemplate).toHaveBeenCalledWith(tenantId, dto);
    });
  });

  describe("getResponses", () => {
    it("returns voter feedback and responses", async () => {
      service.findAllResponses.mockResolvedValue([]);
      const res = await controller.getResponses(tenantId, CampaignChannel.AI_VOICE, "POSITIVE");
      expect(res).toEqual([]);
      expect(service.findAllResponses).toHaveBeenCalledWith(tenantId, {
        channel: CampaignChannel.AI_VOICE,
        status: "POSITIVE",
      });
    });
  });

  describe("getTriggers", () => {
    it("returns list of triggers", async () => {
      service.findAllTriggers.mockResolvedValue([]);
      const res = await controller.getTriggers(tenantId);
      expect(res).toEqual([]);
      expect(service.findAllTriggers).toHaveBeenCalledWith(tenantId);
    });
  });

  describe("findAll", () => {
    it("returns paginated campaigns", async () => {
      const query = { page: 1, limit: 10, channel: CampaignChannel.SMS };
      const mockList = { campaigns: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      service.findAllCampaigns.mockResolvedValue(mockList);

      const res = await controller.findAll(tenantId, query);
      expect(res).toEqual(mockList);
      expect(service.findAllCampaigns).toHaveBeenCalledWith(tenantId, query);
    });
  });

  describe("findById", () => {
    it("returns campaign by ID", async () => {
      const mockCampaign = { id: "cmp-101", name: "Rally Announcement" };
      service.findCampaignById.mockResolvedValue(mockCampaign);

      const res = await controller.findById(tenantId, "cmp-101");
      expect(res).toEqual(mockCampaign);
      expect(service.findCampaignById).toHaveBeenCalledWith(tenantId, "cmp-101");
    });
  });

  describe("create", () => {
    it("creates campaign and associates actor", async () => {
      const dto = {
        name: "Door-to-door Followup",
        channel: CampaignChannel.WHATSAPP,
        campaignType: "Mobilization",
        messageTemplate: "Namaskar",
      };
      const mockCreated = { id: "cmp-102", ...dto };
      service.createCampaign.mockResolvedValue(mockCreated);

      const res = await controller.create(tenantId, mockUser, dto as any);
      expect(res).toEqual(mockCreated);
      expect(service.createCampaign).toHaveBeenCalledWith(tenantId, mockUser.id, dto);
    });
  });

  describe("updateStatus", () => {
    it("updates campaign status", async () => {
      const dto = { status: CampaignStatus.PAUSED };
      const mockUpdated = { id: "cmp-101", status: CampaignStatus.PAUSED };
      service.updateCampaignStatus.mockResolvedValue(mockUpdated);

      const res = await controller.updateStatus(tenantId, "cmp-101", dto);
      expect(res).toEqual(mockUpdated);
      expect(service.updateCampaignStatus).toHaveBeenCalledWith(tenantId, "cmp-101", dto);
    });
  });

  describe("launch", () => {
    it("launches campaign immediately", async () => {
      const mockRes = { success: true, message: "Campaign launched" };
      service.launchCampaign.mockResolvedValue(mockRes);

      const res = await controller.launch(tenantId, "cmp-101");
      expect(res).toEqual(mockRes);
      expect(service.launchCampaign).toHaveBeenCalledWith(tenantId, "cmp-101");
    });
  });

  describe("delete", () => {
    it("deletes campaign", async () => {
      const mockRes = { success: true, message: "Campaign deleted" };
      service.deleteCampaign.mockResolvedValue(mockRes);

      const res = await controller.delete(tenantId, "cmp-101");
      expect(res).toEqual(mockRes);
      expect(service.deleteCampaign).toHaveBeenCalledWith(tenantId, "cmp-101");
    });
  });
});
