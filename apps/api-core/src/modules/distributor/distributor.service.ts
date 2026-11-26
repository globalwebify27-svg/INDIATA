import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  AuthenticatedUser,
  QueryTransactionsDto,
  RecordTransactionDto,
  QueryPayoutsDto,
  RequestPayoutDto,
  QueryCandidatesDto,
  OnboardCandidateDto,
  QueryEnquiriesDto,
  CreateEnquiryDto,
  UpdateBankDetailsDto,
} from "@rajtantra/common-types";
import { Prisma, PlanType } from "@prisma/client";

@Injectable()
export class DistributorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolve current distributor entity associated with the authenticated user or organization.
   */
  async resolveDistributor(user: AuthenticatedUser) {
    // 1. Try finding by userId
    let distributor = await this.prisma.distributor.findFirst({
      where: { userId: user.id },
    });

    if (distributor) return distributor;

    // 2. Try finding by email or phone
    const orConditions: Prisma.DistributorWhereInput[] = [];
    if (user.email) orConditions.push({ email: user.email });
    if (user.phone) orConditions.push({ phone: user.phone });

    if (orConditions.length > 0) {
      distributor = await this.prisma.distributor.findFirst({
        where: { OR: orConditions },
      });
    }

    if (distributor) return distributor;

    // 3. For SUPER_ADMIN or development fallback, pick the primary active distributor
    distributor = await this.prisma.distributor.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
    });

    if (distributor) return distributor;

    // 4. If no distributor exists at all in the database, provision a default franchise
    return this.prisma.distributor.create({
      data: {
        companyName: "Sahyadri Franchise & Political Media Network",
        contactName: user.name || "Franchise Partner",
        email: user.email || "distributor@indiata.in",
        phone: user.phone || "+919876543211",
        userId: user.id,
        status: "ACTIVE",
        commissionRatePct: 20.0,
        bankAccountName: "Sahyadri Franchise Solutions Pvt Ltd",
        bankAccountNumber: "50200012345678",
        bankIfsc: "HDFC0000123",
        bankName: "HDFC Bank, FC Road Branch",
      },
    });
  }

  // ==========================================================================
  // 1. COMMERCIAL LEDGER & FINANCIAL TELEMETRY
  // ==========================================================================

  async getLedgerSummary(distributorId: string) {
    const distributor = await this.prisma.distributor.findUnique({
      where: { id: distributorId },
    });

    if (!distributor) {
      throw new NotFoundException(`Distributor '${distributorId}' not found`);
    }

    const [transactions, payouts, totalCandidates, activeCandidates] = await Promise.all([
      this.prisma.distributorTransaction.findMany({
        where: { distributorId },
      }),
      this.prisma.distributorPayout.findMany({
        where: { distributorId },
      }),
      this.prisma.organization.count({
        where: { distributorId },
      }),
      this.prisma.organization.count({
        where: { distributorId, status: "ACTIVE" },
      }),
    ]);

    const completedTxns = transactions.filter((t) => t.status === "COMPLETED");
    const grossTurnover = completedTxns.reduce((sum, t) => sum + Number(t.grossAmount), 0);
    const totalCommission = completedTxns.reduce((sum, t) => sum + Number(t.commissionAmount), 0);

    const settledPayouts = payouts
      .filter((p) => p.status === "SETTLED")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayouts = payouts
      .filter((p) => p.status === "PENDING" || p.status === "APPROVED")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const availableBalance = Math.max(0, totalCommission - settledPayouts - pendingPayouts);

    const recentEarningsMonthly = [
      { month: "Jan 2026", gross: 350000, commission: 70000 },
      { month: "Feb 2026", gross: 420000, commission: 84000 },
      { month: "Mar 2026", gross: 500000, commission: 100000 },
      { month: "Current", gross: grossTurnover || 250000, commission: totalCommission || 50000 },
    ];

    return {
      distributorId: distributor.id,
      companyName: distributor.companyName,
      contactName: distributor.contactName,
      commissionRatePct: Number(distributor.commissionRatePct),
      grossTurnover,
      totalCommission,
      settledPayouts,
      pendingPayouts,
      availableBalance,
      totalCandidates,
      activeCandidates,
      bankDetails: {
        bankAccountName: distributor.bankAccountName,
        bankAccountNumber: distributor.bankAccountNumber,
        bankIfsc: distributor.bankIfsc,
        bankName: distributor.bankName,
      },
      recentEarningsMonthly,
    };
  }

  // ==========================================================================
  // 2. TRANSACTIONS LEDGER
  // ==========================================================================

  async getTransactions(distributorId: string, query: QueryTransactionsDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DistributorTransactionWhereInput = {
      distributorId,
    };

    if (query.status) {
      where.status = query.status as any;
    }

    if (query.search) {
      where.OR = [
        { transactionRef: { contains: query.search } },
        { utrNumber: { contains: query.search } },
        { organization: { name: { contains: query.search } } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.distributorTransaction.count({ where }),
      this.prisma.distributorTransaction.findMany({
        where,
        include: {
          organization: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const transactions = items.map((t) => {
      const org = t.organization;
      return {
        id: t.id,
        transactionRef: t.transactionRef,
        organizationId: t.organizationId,
        candidateName: org?.name || "Constituency Candidate",
        constituency: org?.constituencyName || "Maharashtra Assembly",
        planType: t.planType,
        grossAmount: Number(t.grossAmount),
        commissionRatePct: Number(t.commissionRatePct),
        commissionAmount: Number(t.commissionAmount),
        status: t.status,
        paymentMethod: t.paymentMethod,
        utrNumber: t.utrNumber,
        receiptUrl: t.receiptUrl,
        settledAt: t.settledAt,
        createdAt: t.createdAt,
      };
    });

    return {
      transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async recordTransaction(distributorId: string, dto: RecordTransactionDto) {
    const distributor = await this.prisma.distributor.findUnique({
      where: { id: distributorId },
    });

    if (!distributor) {
      throw new NotFoundException(`Distributor '${distributorId}' not found`);
    }

    const commissionRate = dto.commissionRatePct || Number(distributor.commissionRatePct) || 20;
    const commissionAmount = Number(((dto.grossAmount * commissionRate) / 100).toFixed(2));
    const transactionRef = `TXN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const txn = await this.prisma.distributorTransaction.create({
      data: {
        transactionRef,
        distributorId,
        organizationId: dto.organizationId,
        planType: dto.planType as PlanType,
        grossAmount: dto.grossAmount,
        commissionRatePct: commissionRate,
        commissionAmount,
        status: "COMPLETED",
        paymentMethod: dto.paymentMethod || "Bank Transfer (NEFT)",
        utrNumber: dto.utrNumber || `UTR-${Date.now().toString().slice(-8)}`,
        settledAt: new Date(),
      },
      include: {
        organization: true,
      },
    });

    return {
      id: txn.id,
      transactionRef: txn.transactionRef,
      grossAmount: Number(txn.grossAmount),
      commissionAmount: Number(txn.commissionAmount),
      commissionRatePct: Number(txn.commissionRatePct),
      status: txn.status,
      paymentMethod: txn.paymentMethod,
      utrNumber: txn.utrNumber,
      createdAt: txn.createdAt,
    };
  }

  // ==========================================================================
  // 3. PAYOUT WITHDRAWAL REQUESTS
  // ==========================================================================

  async getPayouts(distributorId: string, query: QueryPayoutsDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DistributorPayoutWhereInput = {
      distributorId,
    };

    if (query.status) {
      where.status = query.status as any;
    }

    const [total, items] = await Promise.all([
      this.prisma.distributorPayout.count({ where }),
      this.prisma.distributorPayout.findMany({
        where,
        orderBy: { requestedAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const payouts = items.map((p) => ({
      id: p.id,
      payoutNumber: p.payoutNumber,
      amount: Number(p.amount),
      status: p.status,
      requestedAt: p.requestedAt,
      settledAt: p.settledAt,
      utrNumber: p.utrNumber,
      remarks: p.remarks,
    }));

    return {
      payouts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async requestPayout(distributorId: string, dto: RequestPayoutDto) {
    const summary = await this.getLedgerSummary(distributorId);

    if (dto.amount > summary.availableBalance) {
      throw new BadRequestException(
        `Requested payout ₹${dto.amount.toLocaleString()} exceeds available wallet balance ₹${summary.availableBalance.toLocaleString()}`,
      );
    }

    const payoutNumber = `PAY-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;

    const payout = await this.prisma.distributorPayout.create({
      data: {
        payoutNumber,
        distributorId,
        amount: dto.amount,
        status: "PENDING",
        remarks: dto.remarks || "Franchise commission payout withdrawal",
      },
    });

    return {
      success: true,
      message: `Payout request ${payoutNumber} submitted successfully for ₹${dto.amount.toLocaleString()}`,
      payout: {
        id: payout.id,
        payoutNumber: payout.payoutNumber,
        amount: Number(payout.amount),
        status: payout.status,
        requestedAt: payout.requestedAt,
        remarks: payout.remarks,
      },
    };
  }

  // ==========================================================================
  // 4. CANDIDATE MANAGEMENT (MANAGED SCOPED TENANTS)
  // ==========================================================================

  async getCandidates(distributorId: string, query: QueryCandidatesDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrganizationWhereInput = {
      distributorId,
    };

    if (query.status) {
      where.status = query.status as any;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { constituencyName: { contains: query.search } },
        { slug: { contains: query.search } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.organization.count({ where }),
      this.prisma.organization.findMany({
        where,
        include: {
          users: {
            where: { role: "CANDIDATE_ADMIN" },
            take: 1,
          },
          _count: {
            select: {
              users: true,
              voters: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const candidates = items.map((org) => {
      const adminUser = org.users[0];
      return {
        id: org.id,
        name: org.name,
        code: org.slug ? org.slug.toUpperCase() : org.id.slice(0, 8).toUpperCase(),
        slug: org.slug || org.id,
        candidateName: adminUser?.name || org.name,
        mobile: adminUser?.phone || "—",
        email: adminUser?.email || "—",
        constituency: org.constituencyName,
        district: org.district,
        state: org.state,
        electionType: org.electionType,
        planType: org.planType,
        status: org.status,
        totalUsers: org._count.users,
        totalVoters: org._count.voters,
        createdAt: org.createdAt,
      };
    });

    return {
      candidates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getCandidateById(distributorId: string, id: string) {
    const org = await this.prisma.organization.findFirst({
      where: {
        id,
        distributorId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            status: true,
            hasAiSeat: true,
          },
        },
        _count: {
          select: {
            voters: true,
            users: true,
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundException(`Candidate organization '${id}' not found`);
    }

    return {
      id: org.id,
      name: org.name,
      code: org.slug ? org.slug.toUpperCase() : org.id.slice(0, 8).toUpperCase(),
      slug: org.slug || org.id,
      constituency: org.constituencyName,
      district: org.district,
      state: org.state,
      electionType: org.electionType,
      planType: org.planType,
      status: org.status,
      totalVoters: org._count.voters,
      totalUsers: org._count.users,
      users: org.users,
      createdAt: org.createdAt,
    };
  }

  async onboardCandidate(distributorId: string, dto: OnboardCandidateDto) {
    const distributor = await this.prisma.distributor.findUnique({
      where: { id: distributorId },
    });

    if (!distributor) {
      throw new NotFoundException(`Distributor '${distributorId}' not found`);
    }

    const slug = `cand-${Date.now().toString().slice(-6)}`;
    const orgName = `${dto.candidateName} Campaign (${dto.constituencyName})`;

    const organization = await this.prisma.organization.create({
      data: {
        name: orgName,
        slug,
        state: "Maharashtra",
        district: dto.district,
        constituencyName: dto.constituencyName,
        electionType: dto.electionType,
        planType: dto.planType as PlanType,
        status: "ACTIVE",
        distributorId,
      },
    });

    // Create Candidate Admin user if phone doesn't conflict
    let user = await this.prisma.user.findUnique({
      where: { phone: dto.mobile },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: dto.candidateName,
          phone: dto.mobile,
          email: dto.email,
          role: "CANDIDATE_ADMIN",
          status: "ACTIVE",
          organizationId: organization.id,
          hasAiSeat: true,
        },
      });
    }

    // Record franchise commission transaction
    const commissionRate = Number(distributor.commissionRatePct) || 20;
    const grossAmount = dto.grossAmount || 150000;
    const commissionAmount = Number(((grossAmount * commissionRate) / 100).toFixed(2));
    const transactionRef = `TXN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const transaction = await this.prisma.distributorTransaction.create({
      data: {
        transactionRef,
        distributorId,
        organizationId: organization.id,
        planType: dto.planType as PlanType,
        grossAmount,
        commissionRatePct: commissionRate,
        commissionAmount,
        status: "COMPLETED",
        paymentMethod: "Bank Transfer (NEFT)",
        utrNumber: `UTR-${Date.now().toString().slice(-8)}`,
        settledAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Candidate '${dto.candidateName}' onboarded successfully under ${distributor.companyName}`,
      candidate: {
        organizationId: organization.id,
        code: organization.slug ? organization.slug.toUpperCase() : organization.id.slice(0, 8).toUpperCase(),
        name: organization.name,
        candidateName: dto.candidateName,
        constituency: organization.constituencyName,
        planType: organization.planType,
        grossAmount,
        commissionEarned: commissionAmount,
        transactionRef: transaction.transactionRef,
      },
    };
  }

  // ==========================================================================
  // 5. ENQUIRIES & LEADS MANAGEMENT
  // ==========================================================================

  async getEnquiries(_distributorId: string, query: QueryEnquiriesDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.RegistrationEnquiryWhereInput = {};

    if (query.status) {
      where.status = query.status as any;
    }

    if (query.search) {
      where.OR = [
        { candidateName: { contains: query.search } },
        { constituencyName: { contains: query.search } },
        { enquiryNumber: { contains: query.search } },
        { mobile: { contains: query.search } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.registrationEnquiry.count({ where }),
      this.prisma.registrationEnquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const enquiries = items.map((e) => ({
      id: e.id,
      enquiryNumber: e.enquiryNumber,
      candidateName: e.candidateName,
      contactPerson: e.fullName,
      mobile: e.mobile,
      email: e.email,
      partyName: e.partyName,
      electionType: e.electionType,
      constituency: e.constituencyName,
      district: e.district,
      status: e.status,
      requestedServices: e.requestedServices,
      notes: e.notes,
      createdAt: e.createdAt,
    }));

    return {
      enquiries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async createEnquiry(_distributorId: string, dto: CreateEnquiryDto) {
    const enquiryNumber = `ENQ-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    const enquiry = await this.prisma.registrationEnquiry.create({
      data: {
        enquiryNumber,
        fullName: dto.candidateName,
        candidateName: dto.candidateName,
        candidateContact: dto.mobile,
        candidateType: "PROSPECTIVE_CANDIDATE",
        partyName: "Political Aspirant",
        electionType: "Vidhan Sabha",
        state: "Maharashtra",
        district: "Pune",
        constituencyName: dto.constituency,
        mobile: dto.mobile,
        email: dto.email,
        passwordHash: "ENQ_HASH_PLACEHOLDER",
        status: "PENDING",
        requestedServices: `${dto.serviceType}: ${dto.requestedPackage} (₹${dto.amount})`,
        notes: dto.notes,
      },
    });

    return {
      success: true,
      message: `Enquiry lead '${enquiryNumber}' created successfully`,
      enquiry: {
        id: enquiry.id,
        enquiryNumber: enquiry.enquiryNumber,
        candidateName: enquiry.candidateName,
        constituency: enquiry.constituencyName,
        status: enquiry.status,
        createdAt: enquiry.createdAt,
      },
    };
  }

  // ==========================================================================
  // 6. DISTRIBUTOR PROFILE & BANK DETAILS
  // ==========================================================================

  async getProfile(distributorId: string) {
    const distributor = await this.prisma.distributor.findUnique({
      where: { id: distributorId },
    });

    if (!distributor) {
      throw new NotFoundException(`Distributor '${distributorId}' not found`);
    }

    return {
      id: distributor.id,
      companyName: distributor.companyName,
      contactName: distributor.contactName,
      email: distributor.email,
      phone: distributor.phone,
      status: distributor.status,
      commissionRatePct: Number(distributor.commissionRatePct),
      bankDetails: {
        bankAccountName: distributor.bankAccountName,
        bankAccountNumber: distributor.bankAccountNumber,
        bankIfsc: distributor.bankIfsc,
        bankName: distributor.bankName,
      },
      createdAt: distributor.createdAt,
    };
  }

  async updateBankDetails(distributorId: string, dto: UpdateBankDetailsDto) {
    const updated = await this.prisma.distributor.update({
      where: { id: distributorId },
      data: {
        bankAccountName: dto.bankAccountName,
        bankAccountNumber: dto.bankAccountNumber,
        bankIfsc: dto.bankIfsc,
        bankName: dto.bankName,
      },
    });

    return {
      success: true,
      message: "Bank account details updated successfully for commission settlements",
      bankDetails: {
        bankAccountName: updated.bankAccountName,
        bankAccountNumber: updated.bankAccountNumber,
        bankIfsc: updated.bankIfsc,
        bankName: updated.bankName,
      },
    };
  }
}
