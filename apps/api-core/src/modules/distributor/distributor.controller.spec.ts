import { Test, TestingModule } from "@nestjs/testing";
import { DistributorController } from "./distributor.controller";
import { DistributorService } from "./distributor.service";
import {
  UserRole,
  AuthenticatedUser,
  CommissionPlanType,
  DistributorTransactionStatus,
  DistributorPayoutStatus,
} from "@rajtantra/common-types";

describe("DistributorController", () => {
  let controller: DistributorController;
  let service: {
    resolveDistributor: jest.Mock;
    getLedgerSummary: jest.Mock;
    getTransactions: jest.Mock;
    recordTransaction: jest.Mock;
    getPayouts: jest.Mock;
    requestPayout: jest.Mock;
    getCandidates: jest.Mock;
    getCandidateById: jest.Mock;
    onboardCandidate: jest.Mock;
    getEnquiries: jest.Mock;
    createEnquiry: jest.Mock;
    getProfile: jest.Mock;
    updateBankDetails: jest.Mock;
  };

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
  };

  beforeEach(async () => {
    service = {
      resolveDistributor: jest.fn().mockResolvedValue(mockDistributor),
      getLedgerSummary: jest.fn(),
      getTransactions: jest.fn(),
      recordTransaction: jest.fn(),
      getPayouts: jest.fn(),
      requestPayout: jest.fn(),
      getCandidates: jest.fn(),
      getCandidateById: jest.fn(),
      onboardCandidate: jest.fn(),
      getEnquiries: jest.fn(),
      createEnquiry: jest.fn(),
      getProfile: jest.fn(),
      updateBankDetails: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistributorController],
      providers: [{ provide: DistributorService, useValue: service }],
    }).compile();

    controller = module.get<DistributorController>(DistributorController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getLedgerSummary", () => {
    it("returns financial summary", async () => {
      const mockSummary = { grossTurnover: 1500000, totalCommission: 300000, availableBalance: 250000 };
      service.getLedgerSummary.mockResolvedValue(mockSummary);

      const res = await controller.getLedgerSummary(mockUser);
      expect(res).toEqual(mockSummary);
      expect(service.getLedgerSummary).toHaveBeenCalledWith(mockDistributor.id);
    });
  });

  describe("getTransactions", () => {
    it("returns paginated transactions", async () => {
      const mockTxns = { transactions: [], meta: { total: 0 } };
      service.getTransactions.mockResolvedValue(mockTxns);

      const res = await controller.getTransactions(mockUser, { page: 1, limit: 10, status: DistributorTransactionStatus.COMPLETED });
      expect(res).toEqual(mockTxns);
      expect(service.getTransactions).toHaveBeenCalledWith(mockDistributor.id, { page: 1, limit: 10, status: DistributorTransactionStatus.COMPLETED });
    });
  });

  describe("recordTransaction", () => {
    it("records a commission transaction", async () => {
      const dto = {
        planType: CommissionPlanType.ELECTION_MODULE,
        grossAmount: 150000,
        commissionRatePct: 20,
        paymentMethod: "Bank Transfer",
      };
      const mockCreated = { id: "txn-1", grossAmount: 150000, commissionAmount: 30000 };
      service.recordTransaction.mockResolvedValue(mockCreated);

      const res = await controller.recordTransaction(mockUser, dto);
      expect(res).toEqual(mockCreated);
      expect(service.recordTransaction).toHaveBeenCalledWith(mockDistributor.id, dto);
    });
  });

  describe("getPayouts", () => {
    it("returns payout history", async () => {
      const mockPayouts = { payouts: [], meta: { total: 0 } };
      service.getPayouts.mockResolvedValue(mockPayouts);

      const res = await controller.getPayouts(mockUser, { page: 1, limit: 10, status: DistributorPayoutStatus.PENDING });
      expect(res).toEqual(mockPayouts);
      expect(service.getPayouts).toHaveBeenCalledWith(mockDistributor.id, { page: 1, limit: 10, status: DistributorPayoutStatus.PENDING });
    });
  });

  describe("requestPayout", () => {
    it("creates payout withdrawal request", async () => {
      const dto = { amount: 50000, remarks: "Payout request" };
      const mockRes = { success: true, payout: { id: "pay-1", amount: 50000 } };
      service.requestPayout.mockResolvedValue(mockRes);

      const res = await controller.requestPayout(mockUser, dto);
      expect(res).toEqual(mockRes);
      expect(service.requestPayout).toHaveBeenCalledWith(mockDistributor.id, dto);
    });
  });

  describe("getCandidates", () => {
    it("returns managed candidates", async () => {
      const mockCandidates = { candidates: [], meta: { total: 0 } };
      service.getCandidates.mockResolvedValue(mockCandidates);

      const res = await controller.getCandidates(mockUser, { page: 1, limit: 10 });
      expect(res).toEqual(mockCandidates);
      expect(service.getCandidates).toHaveBeenCalledWith(mockDistributor.id, { page: 1, limit: 10 });
    });
  });

  describe("getCandidateById", () => {
    it("returns single candidate organization details", async () => {
      const mockOrg = { id: "org-1", name: "Kasba Campaign" };
      service.getCandidateById.mockResolvedValue(mockOrg);

      const res = await controller.getCandidateById(mockUser, "org-1");
      expect(res).toEqual(mockOrg);
      expect(service.getCandidateById).toHaveBeenCalledWith(mockDistributor.id, "org-1");
    });
  });

  describe("onboardCandidate", () => {
    it("onboards new candidate", async () => {
      const dto = {
        candidateName: "Pooja Gaikwad",
        mobile: "+919822055665",
        partyName: "RSM",
        electionType: "Vidhan Sabha",
        constituencyName: "Kasba Peth",
        district: "Pune",
        planType: CommissionPlanType.ELECTION_MODULE,
        grossAmount: 150000,
      };
      const mockRes = { success: true, candidate: { name: "Pooja Gaikwad" } };
      service.onboardCandidate.mockResolvedValue(mockRes);

      const res = await controller.onboardCandidate(mockUser, dto);
      expect(res).toEqual(mockRes);
      expect(service.onboardCandidate).toHaveBeenCalledWith(mockDistributor.id, dto);
    });
  });

  describe("getProfile", () => {
    it("returns franchise profile", async () => {
      const mockProfile = { id: "dist-001", companyName: "Sahyadri Solutions" };
      service.getProfile.mockResolvedValue(mockProfile);

      const res = await controller.getProfile(mockUser);
      expect(res).toEqual(mockProfile);
      expect(service.getProfile).toHaveBeenCalledWith(mockDistributor.id);
    });
  });

  describe("updateBankDetails", () => {
    it("updates bank details", async () => {
      const dto = {
        bankAccountName: "Sahyadri Pvt Ltd",
        bankAccountNumber: "50200012345678",
        bankIfsc: "HDFC0000123",
        bankName: "HDFC Bank, Pune",
      };
      const mockRes = { success: true, bankDetails: dto };
      service.updateBankDetails.mockResolvedValue(mockRes);

      const res = await controller.updateBankDetails(mockUser, dto);
      expect(res).toEqual(mockRes);
      expect(service.updateBankDetails).toHaveBeenCalledWith(mockDistributor.id, dto);
    });
  });
});
