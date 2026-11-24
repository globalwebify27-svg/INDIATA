import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

if (typeof process.loadEnvFile === "function" && !process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), "../../.env");
  if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
}

const prisma = new PrismaClient();

async function verifyCounts() {
  const counts = {
    organizations: await prisma.organization.count(),
    distributors: await prisma.distributor.count(),
    distributorTransactions: await prisma.distributorTransaction.count(),
    distributorPayouts: await prisma.distributorPayout.count(),
    registrationEnquiries: await prisma.registrationEnquiry.count(),
    users: await prisma.user.count(),
    roles: await prisma.roleDefinition.count(),
    permissions: await prisma.permission.count(),
    userRoles: await prisma.userRole.count(),
    rolePermissions: await prisma.rolePermission.count(),
    portals: await prisma.portal.count(),
    portalAssignments: await prisma.portalAssignment.count(),
    pollingBooths: await prisma.pollingBooth.count(),
    voters: await prisma.voter.count(),
    surveys: await prisma.voterSurveyRecord.count(),
    turnoutAudits: await prisma.voterTurnoutAudit.count(),
    hourlyTurnoutLogs: await prisma.boothHourlyTurnoutLog.count(),
    slipDispatches: await prisma.voterSlipDispatch.count(),
    issueTickets: await prisma.issueTicket.count(),
    correctionRequests: await prisma.voterCorrectionRequest.count(),
    broadcastNotifications: await prisma.broadcastNotification.count(),
    auditLogs: await prisma.auditLog.count(),
    loginAttempts: await prisma.loginAttempt.count(),
  };

  console.log("=== LIVE DATABASE RECORD COUNTS ===");
  console.log(JSON.stringify(counts, null, 2));
  await prisma.$disconnect();
}

verifyCounts();
