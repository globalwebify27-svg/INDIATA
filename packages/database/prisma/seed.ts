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

const ALL_PERMISSIONS = [
  // Platform & Dashboard
  { code: "dashboard.view", domain: "platform", description: "Access the primary command dashboard" },
  { code: "settings.view", domain: "platform", description: "View organization/platform configuration" },
  { code: "settings.update", domain: "platform", description: "Modify configuration parameters" },
  { code: "audit.view", domain: "platform", description: "Inspect security and audit ledger" },

  // Users & Roles
  { code: "users.view", domain: "users", description: "Read user profiles and team member lists" },
  { code: "users.create", domain: "users", description: "Provision new user accounts" },
  { code: "users.update", domain: "users", description: "Edit user profiles and credentials" },
  { code: "users.delete", domain: "users", description: "Deactivate or archive user accounts" },
  { code: "roles.manage", domain: "users", description: "Manage roles and permission matrices" },

  // Organizations & Candidates
  { code: "organizations.view", domain: "organizations", description: "Read organization profiles" },
  { code: "organizations.create", domain: "organizations", description: "Provision new candidate organizations" },
  { code: "organizations.update", domain: "organizations", description: "Update organization parameters and quotas" },
  { code: "organizations.suspend", domain: "organizations", description: "Suspend or reactivate an organization" },
  { code: "candidates.view", domain: "candidates", description: "View candidate directory" },
  { code: "candidates.create", domain: "candidates", description: "Onboard new election candidates" },
  { code: "candidates.update", domain: "candidates", description: "Modify candidate profiles" },
  { code: "candidates.credentials", domain: "candidates", description: "Generate and dispatch login credentials" },

  // Electoral Operations
  { code: "voters.view", domain: "voters", description: "Browse and search voter registry" },
  { code: "voters.import", domain: "voters", description: "Import electoral rolls and PDF extracts" },
  { code: "voters.export", domain: "voters", description: "Export filtered voter records" },
  { code: "voters.edit", domain: "voters", description: "Update voter demographics and tags" },
  { code: "booths.view", domain: "booths", description: "Inspect booth readiness and grade metrics" },
  { code: "booths.manage", domain: "booths", description: "Assign karyakartas and map BLO contacts" },
  { code: "map.view", domain: "telemetry", description: "Inspect live GIS map and field telemetry" },

  // Campaigns & AI
  { code: "campaigns.view", domain: "campaigns", description: "View active communication campaigns" },
  { code: "campaigns.create", domain: "campaigns", description: "Broadcast WhatsApp/SMS messages" },
  { code: "campaigns.update", domain: "campaigns", description: "Modify scheduled campaign outreach" },
  { code: "ai.calling", domain: "campaigns", description: "Trigger automated AI voice calling rounds" },

  // Subscriptions & Finance
  { code: "subscriptions.view", domain: "finance", description: "View subscription quotas and plan details" },
  { code: "subscriptions.upgrade", domain: "finance", description: "Submit quota upgrade or recharge requests" },
  { code: "payments.verify", domain: "finance", description: "Verify billing payments and commercial waivers" },
];

async function main() {
  console.info("Starting foundational database seed with normalized RBAC...");

  // 1. Seed All Granular Permissions
  for (const perm of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: { description: perm.description, domain: perm.domain },
      create: perm,
    });
  }
  console.info(`✓ Seeded ${ALL_PERMISSIONS.length} granular permissions`);

  // 2. Seed System Role Definitions
  const superAdminRole = await prisma.roleDefinition.upsert({
    where: { code: "SUPER_ADMIN" },
    update: {},
    create: {
      code: "SUPER_ADMIN",
      name: "Root Platform Administrator",
      description: "Unrestricted global clearance across all tenants, licensing, and platforms",
      isSystem: true,
    },
  });

  const candidateAdminRole = await prisma.roleDefinition.upsert({
    where: { code: "CANDIDATE_ADMIN" },
    update: {},
    create: {
      code: "CANDIDATE_ADMIN",
      name: "Candidate War Room Administrator",
      description: "Full management clearance inside assigned election constituency war room",
      isSystem: true,
    },
  });

  const distributorRole = await prisma.roleDefinition.upsert({
    where: { code: "DISTRIBUTOR" },
    update: {},
    create: {
      code: "DISTRIBUTOR",
      name: "Franchise Distributor Partner",
      description: "Agency allocation, lead onboarding, and commission tracking clearance",
      isSystem: true,
    },
  });

  const karyakartaRole = await prisma.roleDefinition.upsert({
    where: { code: "KARYAKARTA" },
    update: {},
    create: {
      code: "KARYAKARTA",
      name: "Field Canvassing Volunteer",
      description: "Assigned polling booth voter slip delivery and survey logging clearance",
      isSystem: true,
    },
  });
  console.info("✓ Seeded 4 System Role Definitions");

  // 3. Map Permissions to Roles
  const allDbPermissions = await prisma.permission.findMany();

  // Super Admin receives ALL permissions
  for (const p of allDbPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: p.id },
    });
  }

  // Candidate Admin permissions
  const candidateCodes = [
    "dashboard.view", "settings.view", "settings.update", "audit.view",
    "users.view", "users.create", "users.update", "users.delete",
    "organizations.view", "organizations.update", "candidates.view", "candidates.update",
    "voters.view", "voters.import", "voters.export", "voters.edit",
    "booths.view", "booths.manage", "map.view",
    "campaigns.view", "campaigns.create", "campaigns.update", "ai.calling",
    "subscriptions.view", "subscriptions.upgrade",
  ];
  for (const p of allDbPermissions.filter((item) => candidateCodes.includes(item.code))) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: candidateAdminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: candidateAdminRole.id, permissionId: p.id },
    });
  }

  // Karyakarta permissions
  const karyakartaCodes = ["dashboard.view", "voters.view", "voters.edit", "booths.view"];
  for (const p of allDbPermissions.filter((item) => karyakartaCodes.includes(item.code))) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: karyakartaRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: karyakartaRole.id, permissionId: p.id },
    });
  }
  console.info("✓ Seeded RolePermission mappings");

  // 4. Seed System Portals
  const superAdminPortal = await prisma.portal.upsert({
    where: { key: "SUPER_ADMIN" },
    update: { baseUrl: "http://localhost:3000/super-admin" },
    create: {
      key: "SUPER_ADMIN",
      name: "Super Admin Platform Console",
      description: "Platform governance, multi-tenant war rooms, and KYC licensing",
      baseUrl: "http://localhost:3000/super-admin",
    },
  });

  const candidatePortal = await prisma.portal.upsert({
    where: { key: "CANDIDATE_WAR_ROOM" },
    update: { baseUrl: "http://localhost:3000/candidate" },
    create: {
      key: "CANDIDATE_WAR_ROOM",
      name: "Candidate War Room Console",
      description: "Constituency voter intelligence, booth readiness, and field telemetry",
      baseUrl: "http://localhost:3000/candidate",
    },
  });

  const distributorPortal = await prisma.portal.upsert({
    where: { key: "DISTRIBUTOR_PARTNER" },
    update: { baseUrl: "http://localhost:3002" },
    create: {
      key: "DISTRIBUTOR_PARTNER",
      name: "Distributor Partner Network",
      description: "Agency allocation, lead onboarding, and commission tracking",
      baseUrl: "http://localhost:3002",
    },
  });

  const karyakartaPortal = await prisma.portal.upsert({
    where: { key: "KARYAKARTA_FIELD" },
    update: { baseUrl: "http://localhost:3003" },
    create: {
      key: "KARYAKARTA_FIELD",
      name: "Field Volunteer Web Portal",
      description: "Booth voter slip delivery and survey check-ins",
      baseUrl: "http://localhost:3003",
    },
  });
  console.info("✓ Seeded 4 System Portals");

  const passwordHash = await bcrypt.hash("Rajtantra@2026", 10);

  // 5. Super Admin User
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

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: superAdmin.id, roleId: superAdminRole.id },
  });

  await prisma.portalAssignment.upsert({
    where: { userId_portalId: { userId: superAdmin.id, portalId: superAdminPortal.id } },
    update: {},
    create: { userId: superAdmin.id, portalId: superAdminPortal.id, isDefault: true },
  });
  console.info(`✓ Super Admin seeded: ${superAdmin.email}`);

  // 6. Distributor User & Entity
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

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: distributorUser.id, roleId: distributorRole.id } },
    update: {},
    create: { userId: distributorUser.id, roleId: distributorRole.id },
  });

  await prisma.portalAssignment.upsert({
    where: { userId_portalId: { userId: distributorUser.id, portalId: distributorPortal.id } },
    update: {},
    create: { userId: distributorUser.id, portalId: distributorPortal.id, isDefault: true },
  });
  console.info(`✓ Distributor seeded: ${distributor.companyName}`);

  // 7. Candidate Organization Tenant
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

  // 8. Candidate Admin (Campaign Owner)
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

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: candidateAdmin.id, roleId: candidateAdminRole.id } },
    update: {},
    create: { userId: candidateAdmin.id, roleId: candidateAdminRole.id },
  });

  await prisma.portalAssignment.upsert({
    where: { userId_portalId: { userId: candidateAdmin.id, portalId: candidatePortal.id } },
    update: {},
    create: { userId: candidateAdmin.id, portalId: candidatePortal.id, isDefault: true },
  });
  console.info(`✓ Candidate Admin seeded: ${candidateAdmin.email}`);

  // 9. Karyakarta (Field Volunteer)
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

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: karyakarta.id, roleId: karyakartaRole.id } },
    update: {},
    create: { userId: karyakarta.id, roleId: karyakartaRole.id },
  });

  await prisma.portalAssignment.upsert({
    where: { userId_portalId: { userId: karyakarta.id, portalId: karyakartaPortal.id } },
    update: {},
    create: { userId: karyakarta.id, portalId: karyakartaPortal.id, isDefault: true },
  });
  console.info(`✓ Karyakarta seeded: ${karyakarta.name}`);

  console.info("Foundational database seed with normalized RBAC completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
