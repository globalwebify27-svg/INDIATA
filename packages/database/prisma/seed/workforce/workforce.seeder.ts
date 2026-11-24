import {
  PrismaClient,
  Role,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { SeedLogger } from "../shared/logger";
import { SeedOptions, SeedResult } from "../shared/types";
import {
  DEFAULT_DEV_PASSWORD,
  SYSTEM_ROLE_IDS,
  SYSTEM_PORTAL_IDS,
  SYSTEM_USER_IDS,
} from "../shared/constants";

export async function seedWorkforce(
  prisma: PrismaClient,
  options?: SeedOptions
): Promise<SeedResult> {
  const logger = new SeedLogger("workforce", options?.verbose ?? false);
  logger.info("Seeding Platform Workforce (Super Admin, Distributors, Candidate Admins, Karyakartas)...");

  try {
    const passwordHash = await bcrypt.hash(DEFAULT_DEV_PASSWORD, 10);

    // Fetch Role Definitions and Portals
    const roles = await prisma.roleDefinition.findMany();
    const roleByCode = new Map(roles.map((r) => [r.code, r]));

    const portals = await prisma.portal.findMany();
    const portalByKey = new Map(portals.map((p) => [p.key, p]));

    // Fetch Organizations
    const kasbaOrg = await prisma.organization.findUnique({
      where: { slug: "kasba-peth-2026" },
    });
    const kothrudOrg = await prisma.organization.findUnique({
      where: { slug: "kothrud-2026" },
    });

    // -------------------------------------------------------------
    // Helper to assign UserRole and PortalAssignment safely
    // -------------------------------------------------------------
    async function assignRoleAndPortal(
      userId: string,
      roleCode: string,
      portalKey: string,
      userLabel: string
    ) {
      const role = roleByCode.get(roleCode);
      if (role) {
        const existingUr = await prisma.userRole.findUnique({
          where: { userId_roleId: { userId, roleId: role.id } },
        });
        if (!existingUr) {
          await prisma.userRole.create({
            data: { userId, roleId: role.id },
          });
          logger.recordInserted("UserRole", `${userLabel} -> ${roleCode}`);
        } else {
          logger.recordSkipped("UserRole", `${userLabel} -> ${roleCode}`, "Already assigned");
        }
      }

      const portal = portalByKey.get(portalKey);
      if (portal) {
        const existingPa = await prisma.portalAssignment.findUnique({
          where: { userId_portalId: { userId, portalId: portal.id } },
        });
        if (!existingPa) {
          await prisma.portalAssignment.create({
            data: { userId, portalId: portal.id, isDefault: true },
          });
          logger.recordInserted("PortalAssignment", `${userLabel} -> ${portalKey}`);
        } else {
          logger.recordSkipped("PortalAssignment", `${userLabel} -> ${portalKey}`, "Already assigned");
        }
      }
    }

    // -------------------------------------------------------------
    // 1. Super Admin
    // -------------------------------------------------------------
    const superAdminExisting = await prisma.user.findUnique({
      where: { phone: "+919876543210" },
    });
    let superAdmin = superAdminExisting;
    if (!superAdmin) {
      superAdmin = await prisma.user.create({
        data: {
          id: SYSTEM_USER_IDS.SUPER_ADMIN,
          email: "superadmin@indiata.in",
          phone: "+919876543210",
          name: "System Super Admin",
          passwordHash,
          role: Role.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          hasAiSeat: true,
        },
      });
      logger.recordInserted("User", `${superAdmin.name} (${superAdmin.email})`);
    } else {
      logger.recordSkipped("User", `${superAdmin.name} (${superAdmin.email})`, "User exists");
    }
    await assignRoleAndPortal(superAdmin.id, "SUPER_ADMIN", "SUPER_ADMIN", "Super Admin");

    // -------------------------------------------------------------
    // 2. Distributor Partner User
    // -------------------------------------------------------------
    const distUserExisting = await prisma.user.findUnique({
      where: { phone: "+919876543211" },
    });
    let distUser = distUserExisting;
    if (!distUser) {
      distUser = await prisma.user.create({
        data: {
          id: SYSTEM_USER_IDS.DISTRIBUTOR_USER,
          email: "distributor@indiata.in",
          phone: "+919876543211",
          name: "Vikas Deshmukh (Distributor Partner)",
          passwordHash,
          role: Role.DISTRIBUTOR,
          status: UserStatus.ACTIVE,
          hasAiSeat: true,
        },
      });
      logger.recordInserted("User", `${distUser.name} (${distUser.email})`);
    } else {
      logger.recordSkipped("User", `${distUser.name} (${distUser.email})`, "User exists");
    }
    await assignRoleAndPortal(distUser.id, "DISTRIBUTOR", "DISTRIBUTOR_PARTNER", "Distributor Partner");

    // Connect user to Distributor entity if not connected
    const distEntity = await prisma.distributor.findUnique({
      where: { email: "distributor@indiata.in" },
    });
    if (distEntity && !distEntity.userId) {
      await prisma.distributor.update({
        where: { id: distEntity.id },
        data: { userId: distUser.id },
      });
      logger.recordUpdated("Distributor", `Linked userId to ${distEntity.companyName}`);
    }

    // -------------------------------------------------------------
    // 3. Candidate Admins
    // -------------------------------------------------------------
    const candidateAdmins = [
      {
        id: SYSTEM_USER_IDS.CANDIDATE_ADMIN_KASBA,
        name: "Anand Shinde (Candidate)",
        email: "candidate@indiata.in",
        phone: "+919876543212",
        orgId: kasbaOrg ? kasbaOrg.id : null,
      },
      {
        id: SYSTEM_USER_IDS.CANDIDATE_ADMIN_KOTHRUD,
        name: "Chandrakant Patil (Candidate)",
        email: "candidate.kothrud@indiata.in",
        phone: "+919876543220",
        orgId: kothrudOrg ? kothrudOrg.id : null,
      },
    ];

    for (const ca of candidateAdmins) {
      const existing = await prisma.user.findUnique({
        where: { phone: ca.phone },
      });
      let candUser = existing;
      if (!candUser) {
        candUser = await prisma.user.create({
          data: {
            id: ca.id,
            email: ca.email,
            phone: ca.phone,
            name: ca.name,
            passwordHash,
            role: Role.CANDIDATE_ADMIN,
            status: UserStatus.ACTIVE,
            organizationId: ca.orgId,
            hasAiSeat: true,
          },
        });
        logger.recordInserted("User", `${candUser.name} (${candUser.email})`);
      } else {
        logger.recordSkipped("User", `${candUser.name} (${candUser.email})`, "User exists");
      }
      await assignRoleAndPortal(candUser.id, "CANDIDATE_ADMIN", "CANDIDATE_WAR_ROOM", ca.name);
    }

    // -------------------------------------------------------------
    // 4. Karyakartas (Field Cadre)
    // -------------------------------------------------------------
    const karyakartas = [
      {
        id: SYSTEM_USER_IDS.KARYAKARTA_1,
        name: "Suresh Patil (Booth Karyakarta)",
        phone: "+919876543213",
        activationKey: "KAS101",
        reactivationKey: "REACT_KAS101",
        assignedBooths: "101,102",
        orgId: kasbaOrg ? kasbaOrg.id : null,
      },
      {
        id: SYSTEM_USER_IDS.KARYAKARTA_2,
        name: "Ganesh Shinde (Booth Karyakarta)",
        phone: "+919876543214",
        activationKey: "KAS103",
        reactivationKey: "REACT_KAS103",
        assignedBooths: "103,104",
        orgId: kasbaOrg ? kasbaOrg.id : null,
      },
      {
        id: SYSTEM_USER_IDS.KARYAKARTA_3,
        name: "Pooja More (Mahila Aghadi Volunteer)",
        phone: "+919876543215",
        activationKey: "KAS105",
        reactivationKey: "REACT_KAS105",
        assignedBooths: "105,106",
        orgId: kasbaOrg ? kasbaOrg.id : null,
      },
    ];

    for (const k of karyakartas) {
      const existing = await prisma.user.findUnique({
        where: { phone: k.phone },
      });
      let karyakartaUser = existing;
      if (!karyakartaUser) {
        karyakartaUser = await prisma.user.create({
          data: {
            id: k.id,
            email: null,
            phone: k.phone,
            name: k.name,
            passwordHash,
            role: Role.KARYAKARTA,
            status: UserStatus.ACTIVE,
            organizationId: k.orgId,
            hasAiSeat: false,
            activationKey: k.activationKey,
            reactivationKey: k.reactivationKey,
            assignedBooths: k.assignedBooths,
          },
        });
        logger.recordInserted("User", `${karyakartaUser.name} (${karyakartaUser.phone})`);
      } else {
        logger.recordSkipped("User", `${karyakartaUser.name} (${karyakartaUser.phone})`, "User exists");
      }
      await assignRoleAndPortal(karyakartaUser.id, "KARYAKARTA", "KARYAKARTA_FIELD", k.name);
    }

    logger.info("✓ Workforce and RBAC assignment seeder finished.");
    logger.printSummary();
    return logger.toResult(true);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error("Workforce seeder encountered a failure", error);
    logger.printSummary();
    return logger.toResult(false, errMsg);
  }
}
