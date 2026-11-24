import {
  PrismaClient,
  DistributorStatus,
  EnquiryStatus,
  PlanType,
  TransactionStatus,
  PayoutStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { SeedLogger } from "../shared/logger";
import { SeedOptions, SeedResult } from "../shared/types";
import {
  SEED_DISTRIBUTORS,
  DEFAULT_DEV_PASSWORD,
  SYSTEM_ORGANIZATION_IDS,
} from "../shared/constants";

export async function seedCommercial(
  prisma: PrismaClient,
  options?: SeedOptions
): Promise<SeedResult> {
  const logger = new SeedLogger("commercial", options?.verbose ?? false);
  logger.info("Seeding Commercial Domain (Distributors, Enquiries, Ledger Transactions, Payouts)...");

  try {
    // -------------------------------------------------------------
    // 1. Seed Franchise Distributors
    // -------------------------------------------------------------
    for (const dist of SEED_DISTRIBUTORS) {
      const existing = await prisma.distributor.findUnique({
        where: { email: dist.email },
      });

      if (!existing) {
        await prisma.distributor.create({
          data: {
            id: dist.id,
            companyName: dist.companyName,
            contactName: dist.contactName,
            email: dist.email,
            phone: dist.phone,
            status: DistributorStatus.ACTIVE,
            commissionRatePct: dist.commissionRatePct,
            bankAccountName: dist.bankAccountName,
            bankAccountNumber: dist.bankAccountNumber,
            bankIfsc: dist.bankIfsc,
            bankName: dist.bankName,
          },
        });
        logger.recordInserted("Distributor", dist.companyName);
      } else {
        logger.recordSkipped("Distributor", dist.companyName, "Distributor exists");
      }
    }

    // -------------------------------------------------------------
    // 2. Seed Registration Enquiries (KYC / Lead Pipeline)
    // -------------------------------------------------------------
    const dummyPasswordHash = await bcrypt.hash(DEFAULT_DEV_PASSWORD, 10);
    const enquiries = [
      {
        enquiryNumber: "ENQ-2026-001",
        fullName: "Adv. Dilip R. Jagtap",
        mobile: "+919822199001",
        email: "dilip.jagtap@example.com",
        candidateName: "Dilip Ramchandra Jagtap",
        candidateContact: "+919822199001",
        candidateType: "Sitting MLA / Aspirant",
        partyName: "Rashtravadi Mahayuti Alliance",
        electionType: "VIDHAN_SABHA",
        state: "Maharashtra",
        district: "Pune",
        constituencyName: "214 - Pune Cantonment",
        subDivision: "Camp & Ghorpadi",
        boothsCount: 285,
        electionName: "Maharashtra Legislative Assembly 2026",
        electionYear: 2026,
        pollingDate: new Date("2026-11-20"),
        requestedServices: "Central Electoral Roll Sync, Karyakarta App Licenses (300 seats), AI Voice Broadcast",
        notes: "High priority lead referred by Sahyadri Distributor.",
        status: EnquiryStatus.REVIEWED,
      },
      {
        enquiryNumber: "ENQ-2026-002",
        fullName: "Dr. Sunita V. Deshmukh",
        mobile: "+919822199002",
        email: "sunita.deshmukh@example.com",
        candidateName: "Dr. Sunita Vikram Deshmukh",
        candidateContact: "+919822199002",
        candidateType: "Independent Social Reformer",
        partyName: "Independent",
        electionType: "MUNICIPAL_CORPORATION",
        state: "Maharashtra",
        district: "Pune",
        constituencyName: "PMC Ward 14 - Erandwane",
        subDivision: "Deccan & Karve Road",
        boothsCount: 42,
        electionName: "Pune Municipal Corporation Elections 2026",
        electionYear: 2026,
        pollingDate: new Date("2026-12-15"),
        requestedServices: "Voter Turnout Tracking, Doorstep Surveys",
        notes: "Trial candidate interested in standard 6-month war room plan.",
        status: EnquiryStatus.PENDING,
      },
      {
        enquiryNumber: "ENQ-2026-003",
        fullName: "Mahesh B. Gaikwad",
        mobile: "+919822199003",
        email: "mahesh.gaikwad@example.com",
        candidateName: "Mahesh Baburao Gaikwad",
        candidateContact: "+919822199003",
        candidateType: "Party Nominee",
        partyName: "Vikas Aghadi Front",
        electionType: "VIDHAN_SABHA",
        state: "Maharashtra",
        district: "Pune",
        constituencyName: "208 - Vadgaon Sheri",
        subDivision: "Kalyani Nagar & Kharadi",
        boothsCount: 340,
        electionName: "Maharashtra Legislative Assembly 2026",
        electionYear: 2026,
        pollingDate: new Date("2026-11-20"),
        requestedServices: "Enterprise War Room with unlimited WhatsApp Broadcasts",
        notes: "Approved and ready for onboarding.",
        status: EnquiryStatus.APPROVED,
      },
    ];

    for (const enq of enquiries) {
      const existing = await prisma.registrationEnquiry.findUnique({
        where: { enquiryNumber: enq.enquiryNumber },
      });

      if (!existing) {
        await prisma.registrationEnquiry.create({
          data: {
            ...enq,
            passwordHash: dummyPasswordHash,
          },
        });
        logger.recordInserted("RegistrationEnquiry", enq.enquiryNumber);
      } else {
        logger.recordSkipped("RegistrationEnquiry", enq.enquiryNumber, "Enquiry exists");
      }
    }

    // -------------------------------------------------------------
    // 3. Seed Distributor Ledger Transactions
    // -------------------------------------------------------------
    const primaryDistributor = await prisma.distributor.findFirst({
      where: { email: "distributor@indiata.in" },
    });

    if (primaryDistributor) {
      // Find or check target organization
      const targetOrg = await prisma.organization.findUnique({
        where: { id: SYSTEM_ORGANIZATION_IDS.KASBA_PETH },
      });

      const transactions = [
        {
          transactionRef: "TXN-2026-KASBA",
          distributorId: primaryDistributor.id,
          organizationId: targetOrg ? targetOrg.id : null,
          planType: PlanType.ELECTION_MODULE,
          grossAmount: 500000.0,
          commissionRatePct: 20.0,
          commissionAmount: 100000.0,
          status: TransactionStatus.COMPLETED,
          paymentMethod: "Bank Transfer (NEFT)",
          utrNumber: "HDFCN26110012345",
          receiptUrl: "/receipts/TXN-2026-KASBA.pdf",
          settledAt: new Date("2026-11-01"),
        },
        {
          transactionRef: "TXN-2026-KOTHRUD",
          distributorId: primaryDistributor.id,
          organizationId: null,
          planType: PlanType.OFFICE_12M,
          grossAmount: 240000.0,
          commissionRatePct: 20.0,
          commissionAmount: 48000.0,
          status: TransactionStatus.COMPLETED,
          paymentMethod: "UPI / Corporate Banking",
          utrNumber: "ICIC26110067890",
          receiptUrl: "/receipts/TXN-2026-KOTHRUD.pdf",
          settledAt: new Date("2026-11-10"),
        },
      ];

      for (const txn of transactions) {
        const existingTxn = await prisma.distributorTransaction.findUnique({
          where: { transactionRef: txn.transactionRef },
        });

        if (!existingTxn) {
          await prisma.distributorTransaction.create({
            data: txn,
          });
          logger.recordInserted("DistributorTransaction", txn.transactionRef);
        } else {
          logger.recordSkipped("DistributorTransaction", txn.transactionRef, "Transaction exists");
        }
      }

      // -----------------------------------------------------------
      // 4. Seed Distributor Payout Requests
      // -----------------------------------------------------------
      const payouts = [
        {
          payoutNumber: "PAY-2026-001",
          distributorId: primaryDistributor.id,
          amount: 48000.0,
          status: PayoutStatus.SETTLED,
          utrNumber: "HDFCPAY26110099",
          remarks: "Monthly commission settlement for October 2026",
          settledAt: new Date("2026-11-05"),
        },
        {
          payoutNumber: "PAY-2026-002",
          distributorId: primaryDistributor.id,
          amount: 100000.0,
          status: PayoutStatus.PENDING,
          remarks: "Commission settlement for Kasba Peth Campaign onboarding",
        },
      ];

      for (const pay of payouts) {
        const existingPay = await prisma.distributorPayout.findUnique({
          where: { payoutNumber: pay.payoutNumber },
        });

        if (!existingPay) {
          await prisma.distributorPayout.create({
            data: pay,
          });
          logger.recordInserted("DistributorPayout", pay.payoutNumber);
        } else {
          logger.recordSkipped("DistributorPayout", pay.payoutNumber, "Payout exists");
        }
      }
    }

    logger.info("✓ Commercial domain seeder completed.");
    logger.printSummary();
    return logger.toResult(true);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error("Commercial seeder encountered a failure", error);
    logger.printSummary();
    return logger.toResult(false, errMsg);
  }
}
