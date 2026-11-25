import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CampaignChannel,
  CampaignStatus,
} from "@rajtantra/common-types";

describe("CampaignsService", () => {
  let service: CampaignsService;
  let prisma: any;

  const tenantId = "kasba-peth-2026";
  const actorId = "user-cadmin-01";

  beforeEach(async () => {
    prisma = {
      voter: {
        count: jest.fn().mockResolvedValue(1250),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllCampaigns", () => {
    it("returns paginated campaigns list", async () => {
      const res = await service.findAllCampaigns(tenantId, { page: 1, limit: 10 });
      expect(res.campaigns).toBeDefined();
      expect(res.campaigns.length).toBeGreaterThanOrEqual(1);
      expect(res.meta.total).toBeGreaterThanOrEqual(1);
    });

    it("filters by channel", async () => {
      const res = await service.findAllCampaigns(tenantId, {
        page: 1,
        limit: 10,
        channel: CampaignChannel.WHATSAPP,
      });
      for (const c of res.campaigns) {
        expect(c.channel).toBe(CampaignChannel.WHATSAPP);
      }
    });
  });

  describe("getCampaignStats", () => {
    it("calculates delivery and read rate metrics", async () => {
      const stats = await service.getCampaignStats(tenantId);
      expect(stats.totalCampaigns).toBeGreaterThanOrEqual(1);
      expect(stats.deliveryRatePct).toBeGreaterThanOrEqual(0);
      expect(stats.channelBreakdown).toBeDefined();
    });
  });

  describe("createCampaign", () => {
    it("creates a campaign with estimated credits based on voter count", async () => {
      prisma.voter.count.mockResolvedValue(2000);

      const res = await service.createCampaign(tenantId, actorId, {
        name: "Test Election Day Blast",
        channel: CampaignChannel.WHATSAPP,
        campaignType: "Election Day Reminder",
        messageTemplate: "Vote today at your booth!",
      });

      expect(res.name).toBe("Test Election Day Blast");
      expect(res.recipientCount).toBe(2000);
      expect(res.estimatedCostCredits).toBe(2000);
    });
  });

  describe("launchCampaign", () => {
    it("launches campaign and updates status to RUNNING", async () => {
      const created = await service.createCampaign(tenantId, actorId, {
        name: "Scheduled Broadcast",
        channel: CampaignChannel.SMS,
        campaignType: "Voting Information",
        messageTemplate: "Check your polling booth",
        scheduledTime: "Tomorrow 9 AM",
      });

      const launchRes = await service.launchCampaign(tenantId, created.id);
      expect(launchRes.success).toBe(true);
      expect(launchRes.campaign.status).toBe(CampaignStatus.RUNNING);
    });
  });

  describe("estimateAudience", () => {
    it("estimates audience size and credits", async () => {
      prisma.voter.count
        .mockResolvedValueOnce(5000) // total
        .mockResolvedValueOnce(2600) // male
        .mockResolvedValueOnce(2400); // female

      const est = await service.estimateAudience(tenantId, {
        booths: ["101", "102"],
        channel: CampaignChannel.AI_VOICE,
      });

      expect(est.matchingVotersCount).toBe(5000);
      expect(est.estimatedCredits).toBe(10000); // 5000 * 2 for AI_VOICE
      expect(est.demographics.male).toBe(2600);
    });
  });

  describe("deleteCampaign", () => {
    it("throws NotFoundException if campaign not found", async () => {
      await expect(service.deleteCampaign(tenantId, "cmp-non-existent")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
