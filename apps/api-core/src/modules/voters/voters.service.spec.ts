import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { VotersService } from "./voters.service";
import { PrismaService } from "../../prisma/prisma.service";
import {
  AuthenticatedUser,
  UserRole,
  VoterClassification,
} from "@rajtantra/common-types";

describe("VotersService", () => {
  let service: VotersService;
  let prisma: {
    voter: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      createMany: jest.Mock;
      update: jest.Mock;
    };
    organization: {
      findFirst: jest.Mock;
    };
    user: {
      findUnique: jest.Mock;
    };
  };

  const mockCandidateUser: AuthenticatedUser = {
    id: "user-candidate-01",
    email: "candidate@indiata.in",
    phone: "+919876543212",
    name: "Anand Shinde",
    role: UserRole.CANDIDATE_ADMIN,
    organizationId: "org-kasba-01",
    hasAiSeat: true,
    permissions: ["voters.view", "voters.edit"],
  };

  const mockKaryakartaUser: AuthenticatedUser = {
    id: "user-karyakarta-01",
    email: null,
    phone: "+919876543213",
    name: "Suresh Patil",
    role: UserRole.KARYAKARTA,
    organizationId: "org-kasba-01",
    hasAiSeat: false,
    permissions: ["voters.view"],
  };

  beforeEach(async () => {
    prisma = {
      voter: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
        update: jest.fn(),
      },
      organization: {
        findFirst: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<VotersService>(VotersService);
  });

  describe("findAll", () => {
    it("should query voters with multi-tenant scoping and pagination", async () => {
      const mockVoters = [
        { id: "voter-001", name: "Suresh Patil", epicId: "MH/12/001" },
      ];
      prisma.voter.findMany.mockResolvedValue(mockVoters);
      prisma.voter.count.mockResolvedValue(1);

      const result = await service.findAll(mockCandidateUser, {
        page: 1,
        limit: 20,
        sortBy: "serialNumber",
        sortOrder: "asc",
      });

      expect(prisma.voter.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: "org-kasba-01" }),
          skip: 0,
          take: 20,
        }),
      );
      expect(result.voters).toEqual(mockVoters);
      expect(result.meta.totalRecords).toBe(1);
    });

    it("should strictly enforce booth restrictions for Karyakarta cadre", async () => {
      prisma.user.findUnique.mockResolvedValue({ assignedBooths: "101,102" });
      prisma.voter.findMany.mockResolvedValue([]);
      prisma.voter.count.mockResolvedValue(0);

      await service.findAll(mockKaryakartaUser, {
        page: 1,
        limit: 20,
        sortBy: "serialNumber",
        sortOrder: "asc",
      });

      expect(prisma.voter.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: "org-kasba-01",
            boothNumber: { in: ["101", "102"] },
          }),
        }),
      );
    });
  });

  describe("getStats", () => {
    it("should aggregate political classification and turnout vitals", async () => {
      prisma.voter.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(50)  // supporters
        .mockResolvedValueOnce(20)  // opponents
        .mockResolvedValueOnce(15)  // doubtful
        .mockResolvedValueOnce(15)  // neutral
        .mockResolvedValueOnce(60)  // visited
        .mockResolvedValueOnce(45)  // voted
        .mockResolvedValueOnce(55)  // male
        .mockResolvedValueOnce(45)  // female
        .mockResolvedValueOnce(8);  // key influencers

      const stats = await service.getStats(mockCandidateUser);

      expect(stats.totalElectors).toBe(100);
      expect(stats.supportersCount).toBe(50);
      expect(stats.reachPercentage).toBe(60);
      expect(stats.turnoutPercentage).toBe(45);
    });
  });

  describe("findById", () => {
    it("should return full elector dossier with household members", async () => {
      const mockElector = {
        id: "voter-001",
        name: "Suresh Patil",
        familyId: "FAM-101",
        organizationId: "org-kasba-01",
        tickets: [],
      };
      const mockHousehold = [
        { id: "voter-002", name: "Sunita Patil", relation: "Wife" },
      ];

      prisma.voter.findFirst.mockResolvedValue(mockElector);
      prisma.voter.findMany.mockResolvedValue(mockHousehold);

      const dossier = await service.findById("voter-001", mockCandidateUser);

      expect(dossier.id).toBe("voter-001");
      expect(dossier.householdMembers).toEqual(mockHousehold);
    });

    it("should throw NotFoundException if voter not in organization", async () => {
      prisma.voter.findFirst.mockResolvedValue(null);

      await expect(
        service.findById("unknown-id", mockCandidateUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateClassification", () => {
    it("should fast-update voter political classification", async () => {
      prisma.voter.findFirst.mockResolvedValue({ id: "voter-001" });
      prisma.voter.update.mockResolvedValue({
        id: "voter-001",
        classification: VoterClassification.SUPPORTER,
      });

      const updated = await service.updateClassification(
        "voter-001",
        { classification: VoterClassification.SUPPORTER, remarks: "Pledged vote" },
        mockCandidateUser,
      );

      expect(prisma.voter.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "voter-001" },
          data: expect.objectContaining({
            classification: VoterClassification.SUPPORTER,
            remarks: "Pledged vote",
          }),
        }),
      );
      expect(updated.classification).toBe(VoterClassification.SUPPORTER);
    });
  });

  describe("updateTurnout", () => {
    it("should mark voter turnout with timestamp and logger", async () => {
      prisma.voter.findFirst.mockResolvedValue({ id: "voter-001", isVoted: false });
      prisma.voter.update.mockResolvedValue({
        id: "voter-001",
        isVoted: true,
      });

      await service.updateTurnout(
        "voter-001",
        { isVoted: true, votedAt: "09:30 AM", votedBy: "Booth Agent 1" },
        mockCandidateUser,
      );

      expect(prisma.voter.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "voter-001" },
          data: expect.objectContaining({
            isVoted: true,
            votedAt: "09:30 AM",
            votedBy: "Booth Agent 1",
          }),
        }),
      );
    });
  });
});
