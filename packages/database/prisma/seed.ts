import {
  PrismaClient,
  Role,
  UserStatus,
  OrganizationStatus,
  PlanType,
  DistributorStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.info("Starting foundational database seed...");

  const passwordHash = await bcrypt.hash("Rajtantra@2026", 10);

  // 1. Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { phone: "+919876543210" },
    update: {},
    create: {
      email: "superadmin@rajtantra.in",
      phone: "+919876543210",
      name: "System Super Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      hasAiSeat: true,
    },
  });
  console.info(`✓ Super Admin seeded: ${superAdmin.email}`);

  // 2. Distributor User & Entity
  const distributorUser = await prisma.user.upsert({
    where: { phone: "+919876543211" },
    update: {},
    create: {
      email: "distributor@rajtantra.in",
      phone: "+919876543211",
      name: "Vikas Deshmukh (Distributor Partner)",
      passwordHash,
      role: Role.DISTRIBUTOR,
      status: UserStatus.ACTIVE,
      hasAiSeat: true,
    },
  });

  const distributor = await prisma.distributor.upsert({
    where: { email: "distributor@rajtantra.in" },
    update: {},
    create: {
      companyName: "Sahyadri Political Media & IT Services",
      contactName: "Vikas Deshmukh",
      email: "distributor@rajtantra.in",
      phone: "+919876543211",
      userId: distributorUser.id,
      status: DistributorStatus.ACTIVE,
      commissionRatePct: 15.0,
    },
  });
  console.info(`✓ Distributor seeded: ${distributor.companyName}`);

  // 3. Candidate Organization Tenant
  const organization = await prisma.organization.upsert({
    where: { slug: "kasba-peth-2026" },
    update: {},
    create: {
      name: "Kasba Peth Constituency War Room 2026",
      slug: "kasba-peth-2026",
      status: OrganizationStatus.ACTIVE,
      planType: PlanType.ELECTION_MODULE,
      hasAiMode: true,
      aiSeatsLimit: 5,
      state: "Maharashtra",
      district: "Pune",
      constituencyName: "215 - Kasba Peth",
      electionType: "VIDHAN_SABHA",
      pollingDate: new Date("2026-11-20"),
      distributorId: distributor.id,
    },
  });
  console.info(`✓ Organization tenant seeded: ${organization.name}`);

  // 4. Candidate Admin (Campaign Owner)
  const candidateAdmin = await prisma.user.upsert({
    where: { phone: "+919876543212" },
    update: {},
    create: {
      email: "candidate@rajtantra.in",
      phone: "+919876543212",
      name: "Anand Shinde (Candidate)",
      passwordHash,
      role: Role.CANDIDATE_ADMIN,
      status: UserStatus.ACTIVE,
      organizationId: organization.id,
      hasAiSeat: true,
    },
  });
  console.info(`✓ Candidate Admin seeded: ${candidateAdmin.email}`);

  // 5. Karyakarta (Field Volunteer)
  const karyakarta = await prisma.user.upsert({
    where: { phone: "+919876543213" },
    update: {},
    create: {
      email: null,
      phone: "+919876543213",
      name: "Suresh Patil (Booth Karyakarta)",
      passwordHash: null,
      role: Role.KARYAKARTA,
      status: UserStatus.ACTIVE,
      organizationId: organization.id,
      hasAiSeat: false,
      activationKey: "KAS101",
      reactivationKey: "REACT_KAS101",
    },
  });
  console.info(
    `✓ Karyakarta seeded: ${karyakarta.name} (Key: ${karyakarta.activationKey})`,
  );

  console.info("Foundational database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
