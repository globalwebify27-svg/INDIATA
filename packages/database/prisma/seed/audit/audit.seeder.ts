import { PrismaClient } from "@prisma/client";
import { SeedLogger } from "../shared/logger";
import { SeedOptions, SeedResult } from "../shared/types";
import { SYSTEM_USER_IDS } from "../shared/constants";

export async function seedAudit(
  prisma: PrismaClient,
  options?: SeedOptions
): Promise<SeedResult> {
  const logger = new SeedLogger("audit", options?.verbose ?? false);
  logger.info("Seeding Audit Domain (Security Audit Logs, Login Attempts, Session History)...");

  try {
    const org = await prisma.organization.findUnique({
      where: { slug: "kasba-peth-2026" },
    });

    const superAdmin = await prisma.user.findUnique({
      where: { id: SYSTEM_USER_IDS.SUPER_ADMIN },
    });
    const candidateAdmin = await prisma.user.findUnique({
      where: { id: SYSTEM_USER_IDS.CANDIDATE_ADMIN_KASBA },
    });

    // -------------------------------------------------------------
    // 1. Audit Logs (Security & Compliance Ledger) - 36-char UUIDs
    // -------------------------------------------------------------
    const auditLogs = [
      {
        id: "50000000-0000-0000-0000-000000000001",
        userId: superAdmin?.id,
        organizationId: org?.id,
        action: "ORGANIZATION_PROVISION",
        resource: "Organization",
        resourceId: org?.id,
        diff: JSON.stringify({
          action: "create",
          planType: "ELECTION_MODULE",
          slug: "kasba-peth-2026",
          status: "ACTIVE",
        }),
        ipAddress: "127.0.0.1",
        createdAt: new Date("2026-11-01T10:00:00Z"),
      },
      {
        id: "50000000-0000-0000-0000-000000000002",
        userId: candidateAdmin?.id,
        organizationId: org?.id,
        action: "VOTER_ROLL_IMPORT",
        resource: "Voter",
        resourceId: "voter-kasba-001",
        diff: JSON.stringify({
          action: "bulk_import",
          recordsCount: 14,
          source: "ECI_IMPORT",
        }),
        ipAddress: "192.168.1.105",
        createdAt: new Date("2026-11-02T14:30:00Z"),
      },
      {
        id: "50000000-0000-0000-0000-000000000003",
        userId: candidateAdmin?.id,
        organizationId: org?.id,
        action: "BROADCAST_DISPATCH",
        resource: "BroadcastNotification",
        resourceId: "bcast-kasba-001",
        diff: JSON.stringify({
          action: "dispatch",
          title: "Morning Cadre Turnout Target: 50% by 12:00 PM",
        }),
        ipAddress: "192.168.1.105",
        createdAt: new Date("2026-11-20T08:00:00Z"),
      },
    ];

    for (const a of auditLogs) {
      const existing = await prisma.auditLog.findUnique({
        where: { id: a.id },
      });
      if (!existing) {
        await prisma.auditLog.create({ data: a });
        logger.recordInserted("AuditLog", `${a.action} (${a.resource})`);
      } else {
        logger.recordSkipped("AuditLog", a.action, "Audit log exists");
      }
    }

    // -------------------------------------------------------------
    // 2. Login Attempts (Brute Force Defense & Telemetry) - 36-char UUIDs
    // -------------------------------------------------------------
    const loginAttempts = [
      {
        id: "60000000-0000-0000-0000-000000000001",
        identifier: "superadmin@indiata.in",
        ipAddress: "127.0.0.1",
        isSuccess: true,
        createdAt: new Date("2026-11-24T08:00:00Z"),
      },
      {
        id: "60000000-0000-0000-0000-000000000002",
        identifier: "+919876543212",
        ipAddress: "192.168.1.105",
        isSuccess: true,
        createdAt: new Date("2026-11-24T08:15:00Z"),
      },
      {
        id: "60000000-0000-0000-0000-000000000003",
        identifier: "+919876543299",
        ipAddress: "103.21.244.1",
        isSuccess: false,
        createdAt: new Date("2026-11-24T09:00:00Z"),
      },
    ];

    for (const la of loginAttempts) {
      const existing = await prisma.loginAttempt.findUnique({
        where: { id: la.id },
      });
      if (!existing) {
        await prisma.loginAttempt.create({ data: la });
        logger.recordInserted("LoginAttempt", `${la.identifier} [${la.isSuccess ? "SUCCESS" : "FAILED"}]`);
      } else {
        logger.recordSkipped("LoginAttempt", la.identifier, "Login attempt exists");
      }
    }

    logger.info("✓ Audit and security history seeder finished.");
    logger.printSummary();
    return logger.toResult(true);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error("Audit seeder encountered a failure", error);
    logger.printSummary();
    return logger.toResult(false, errMsg);
  }
}
