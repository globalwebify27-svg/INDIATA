import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { DistributorService } from "./distributor.service";
import { PrismaService } from "../../prisma/prisma.service";
import {
  AuthenticatedUser,
  UserRole,
  CommissionPlanType,
} from "@rajtantra/common-types";

describe("DistributorService", () => {
  let service: DistributorService;
  let prisma: any;

  const mockUser: AuthenticatedUser = {
    id: "usr-dist-01",
    email: "distributor@indiata.in",
    phone: "+919876543211",
    name: "Vikas Deshmukh",
    role: UserRole.DISTRIBUTOR,
    organizationId: null,
    hasAiSeat: true,
  };

  const mockDistributor = {
    id: "dist-001",
    companyName: "Sahyadri Franchise & Media Solutions",
    contactName: "Vikas Deshmukh",
    email: "distributor@indiata.in",
    phone: "+919876543211",
    userId: mockUser.id,
    status: "ACTIVE",
    commissionRatePct: 20.0,
    bankAccountName: "Sahyadri Franchise Pvt Ltd",
    bankAccountNumber: "50200012345678",
    bankIfsc: "HDFC0000123",
    bankName: "HDFC Bank, FC Road Branch",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      distributor: {
        findFirst: jest.fn().mockResolvedValue(mockDistributor),
        findUnique: jest.fn().mockResolvedValue(mockDistributor),
        create: jest.fn().mockResolvedValue(mockDistributor),
        update: jest.fn().mockResolvedValue(mockDistributor),
      },
      distributorTransaction: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: "txn-1",
            transactionRef: "TXN-2026-001",
            distributorId: mockDistributor.id,
            organizationId: "org-1",
            planType: "ELECTION_MODULE",
            grossAmount: 500000,
            commissionRatePct: 20.0,
            commissionAmount: 100000,
            status: "COMPLETED",
            paymentMethod: "NEFT",
            utrNumber: "UTR123",
            settledAt: new Date(),
            createdAt: new Date(),
            organization: { name: "Kasba Campaign", constituencyName: "Kasba Peth" },
          },
        ]),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: "txn-2",
            ...data,
            createdAt: new Date(),
          }),
        ),
      },
      distributorPayout: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: "pay-1",
            payoutNumber: "PAY-2026-001",
            distributorId: mockDistributor.id,
            amount: 25000,
            status: "SETTLED",
            requestedAt: new Date(),
            settledAt: new Date(),
            utrNumber: "UTR456",
            remarks: "Jan settlement",
          },
        ]),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: "pay-2",
            ...data,
            requestedAt: new Date(),
          }),
        ),
      },
      organization: {
        count: jest.fn().mockResolvedValue(5),
        findMany: jest.fn().mockResolvedValue([
          {
            id: "org-1",
            name: "Anand Shinde Campaign",
            slug: "can-001",
            constituencyName: "Kasba Peth",
            district: "Pune",
            state: "Maharashtra",
            electionType: "Vidhan Sabha",
            planType: "ELECTION_MODULE",
            status: "ACTIVE",
            subscriptionExpiresAt: new Date(),
            createdAt: new Date(),
            users: [{ name: "Anand Shinde", phone: "+919876543212", email: "candidate@indiata.in" }],
            _count: { users: 12, voters: 9237 },
          },
        ]),
        findFirst: jest.fn().mockResolvedValue({
          id: "org-1",
          name: "Anand Shinde Campaign",
          slug: "can-001",
          constituencyName: "Kasba Peth",
          district: "Pune",
          state: "Maharashtra",
          electionType: "Vidhan Sabha",
          planType: "ELECTION_MODULE",
          status: "ACTIVE",
          subscriptionExpiresAt: new Date(),
          createdAt: new Date(),
          users: [],
          _count: { users: 12, voters: 9237 },
        }),
        create: jest.fn().mockResolvedValue({
          id: "org-new",
          name: "New Candidate Campaign",
          slug: "can-999",
          constituencyName: "Kothrud",
          district: "Pune",
          state: "Maharashtra",
          electionType: "Vidhan Sabha",
          planType: "ELECTION_MODULE",
          status: "ACTIVE",
        }),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: "usr-new" }),
      },
      registrationEnquiry: {
        count: jest.fn().mockResolvedValue(1),
        findMany: jest.fn().mockResolvedValue([
          {
            id: "enq-1",
            enquiryNumber: "ENQ-2026-001",
            fullName: "Ramesh Pawar",
            candidateName: "Ramesh Pawar",
            mobile: "+919822100000",
            email: "ramesh@gmail.com",
            partyName: "Aspirant",
            electionType: "Vidhan Sabha",
            constituencyName: "Kothrud",
            district: "Pune",
            status: "PENDING",
            requestedServices: "Election Suite",
            createdAt: new Date(),
          },
        ]),
        create: jest.fn().mockResolvedValue({
          id: "enq-new",
          enquiryNumber: "ENQ-2026-999",
          candidateName: "Sunil Joshi",
          constituencyName: "Shivajinagar",
          status: "PENDING",
          createdAt: new Date(),
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistributorService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DistributorService>(DistributorService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("resolveDistributor", () => {
    it("resolves distributor for user", async () => {
      const res = await service.resolveDistributor(mockUser);
      expect(res.id).toBe(mockDistributor.id);
      expect(prisma.distributor.findFirst).toHaveBeenCalled();
    });
  });

  describe("getLedgerSummary", () => {
    it("calculates turnover, commission, and available balance correctly", async () => {
      const summary = await service.getLedgerSummary(mockDistributor.id);

      expect(summary.grossTurnover).toBe(500000);
      expect(summary.totalCommission).toBe(100000);
      expect(summary.settledPayouts).toBe(25000);
      expect(summary.availableBalance).toBe(75000); // 100000 - 25000
      expect(summary.totalCandidates).toBe(5);
    });

    it("throws NotFoundException if distributor not found", async () => {
      prisma.distributor.findUnique.mockResolvedValue(null);
      await expect(service.getLedgerSummary("invalid-id")).rejects.toThrow(NotFoundException);
    });
  });

  describe("getTransactions", () => {
    it("returns paginated transactions list", async () => {
      const res = await service.getTransactions(mockDistributor.id, { page: 1, limit: 10 });
      expect(res.transactions).toHaveLength(1);
      expect(res.transactions[0]?.grossAmount).toBe(500000);
      expect(res.meta.total).toBe(1);
    });
  });

  describe("recordTransaction", () => {
    it("records a commission transaction", async () => {
      const res = await service.recordTransaction(mockDistributor.id, {
        planType: CommissionPlanType.ELECTION_MODULE,
        grossAmount: 200000,
        commissionRatePct: 20,
        paymentMethod: "Bank Transfer (NEFT)",
      });

      expect(res.grossAmount).toBe(200000);
      expect(res.commissionAmount).toBe(40000); // 20% of 200,000
      expect(prisma.distributorTransaction.create).toHaveBeenCalled();
    });
  });

  describe("requestPayout", () => {
    it("creates payout request when requested amount <= available balance", async () => {
      const res = await service.requestPayout(mockDistributor.id, {
        amount: 50000,
        remarks: "February settlement",
      });

      expect(res.success).toBe(true);
      expect(res.payout.amount).toBe(50000);
      expect(prisma.distributorPayout.create).toHaveBeenCalled();
    });

    it("throws BadRequestException if requested amount exceeds available balance", async () => {
      await expect(
        service.requestPayout(mockDistributor.id, {
          amount: 200000, // Available is 75000
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("getCandidates", () => {
    it("returns paginated candidate organizations", async () => {
      const res = await service.getCandidates(mockDistributor.id, { page: 1, limit: 10 });
      expect(res.candidates).toHaveLength(1);
      expect(res.candidates[0]?.candidateName).toBe("Anand Shinde");
      expect(res.meta.total).toBe(5);
    });
  });

  describe("onboardCandidate", () => {
    it("creates candidate organization and initial commission transaction", async () => {
      const res = await service.onboardCandidate(mockDistributor.id, {
        candidateName: "Pooja Gaikwad",
        mobile: "+919822055665",
        partyName: "Independent",
        electionType: "Vidhan Sabha",
        constituencyName: "Kasba Peth",
        district: "Pune",
        planType: CommissionPlanType.ELECTION_MODULE,
        grossAmount: 150000,
      });

      expect(res.success).toBe(true);
      expect(res.candidate.candidateName).toBe("Pooja Gaikwad");
      expect(res.candidate.commissionEarned).toBe(30000); // 20% of 150,000
      expect(prisma.organization.create).toHaveBeenCalled();
      expect(prisma.distributorTransaction.create).toHaveBeenCalled();
    });
  });

  describe("updateBankDetails", () => {
    it("updates bank account details", async () => {
      prisma.distributor.update.mockResolvedValue({
        bankAccountName: "Sahyadri Political Media Pvt Ltd",
        bankAccountNumber: "999900001234",
        bankIfsc: "SBIN0001234",
        bankName: "State Bank of India, Pune",
      });

      const res = await service.updateBankDetails(mockDistributor.id, {
        bankAccountName: "Sahyadri Political Media Pvt Ltd",
        bankAccountNumber: "999900001234",
        bankIfsc: "SBIN0001234",
        bankName: "State Bank of India, Pune",
      });

      expect(res.success).toBe(true);
      expect(res.bankDetails.bankIfsc).toBe("SBIN0001234");
    });
  });
});
