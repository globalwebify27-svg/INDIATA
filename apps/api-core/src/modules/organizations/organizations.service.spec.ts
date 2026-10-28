import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("OrganizationsService", () => {
  let service: OrganizationsService;
  let prisma: {
    organization: { findUnique: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      organization: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it("should return organization summary when found", async () => {
    const mockOrg = {
      id: "org-kasba-01",
      name: "Kasba Peth War Room",
      slug: "kasba-peth-war-room",
      status: "ACTIVE",
      planType: "ELECTION_MODULE",
      hasAiMode: true,
      aiSeatsLimit: 5,
      state: "Maharashtra",
      district: "Pune",
      constituencyName: "215 - Kasba Peth",
      electionType: "VIDHAN_SABHA",
      pollingDate: new Date("2026-11-20"),
      createdAt: new Date(),
    };

    prisma.organization.findUnique.mockResolvedValue(mockOrg);

    const result = await service.findById("org-kasba-01");

    expect(result.id).toBe("org-kasba-01");
    expect(result.name).toBe("Kasba Peth War Room");
    expect(result.hasAiMode).toBe(true);
  });

  it("should throw NotFoundException when organization does not exist", async () => {
    prisma.organization.findUnique.mockResolvedValue(null);

    await expect(service.findById("non-existent-id")).rejects.toThrow(
      NotFoundException,
    );
  });
});
