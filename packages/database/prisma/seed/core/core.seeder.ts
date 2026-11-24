import { PrismaClient } from "@prisma/client";
import { SeedLogger } from "../shared/logger";
import { SeedOptions, SeedResult } from "../shared/types";
import {
  CORE_PERMISSIONS,
  CORE_ROLES,
  CORE_PORTALS,
  ROLE_PERMISSION_MATRIX,
} from "../shared/constants";

export async function seedCore(
  prisma: PrismaClient,
  options?: SeedOptions
): Promise<SeedResult> {
  const logger = new SeedLogger("core", options?.verbose ?? true);
  logger.info("Initializing Core Platform Seeder (Permissions, System Roles, Portals, RBAC Matrix)...");

  try {
    // -------------------------------------------------------------
    // 1. Seed Granular Permissions
    // -------------------------------------------------------------
    logger.info(`Seeding ${CORE_PERMISSIONS.length} granular permissions...`);
    const existingPermissions = await prisma.permission.findMany({
      select: { id: true, code: true, domain: true, description: true },
    });
    const permissionMap = new Map(existingPermissions.map((p) => [p.code, p]));

    for (const perm of CORE_PERMISSIONS) {
      const existing = permissionMap.get(perm.code);
      if (!existing) {
        const created = await prisma.permission.create({
          data: {
            code: perm.code,
            domain: perm.domain,
            description: perm.description,
          },
        });
        permissionMap.set(created.code, created);
        logger.recordInserted("Permission", perm.code);
      } else {
        if (
          existing.domain !== perm.domain ||
          existing.description !== perm.description
        ) {
          await prisma.permission.update({
            where: { code: perm.code },
            data: {
              domain: perm.domain,
              description: perm.description,
            },
          });
          logger.recordUpdated("Permission", perm.code);
        } else {
          logger.recordSkipped("Permission", perm.code, "Identical record exists");
        }
      }
    }

    // -------------------------------------------------------------
    // 2. Seed System Role Definitions
    // -------------------------------------------------------------
    logger.info(`Seeding ${CORE_ROLES.length} system role definitions...`);
    const existingRoles = await prisma.roleDefinition.findMany();
    const roleMap = new Map(existingRoles.map((r) => [r.code, r]));

    for (const roleDef of CORE_ROLES) {
      const existing = roleMap.get(roleDef.code);
      if (!existing) {
        const created = await prisma.roleDefinition.create({
          data: {
            id: roleDef.id,
            code: roleDef.code,
            name: roleDef.name,
            description: roleDef.description,
            isSystem: roleDef.isSystem,
          },
        });
        roleMap.set(created.code, created);
        logger.recordInserted("RoleDefinition", roleDef.code);
      } else {
        if (
          existing.name !== roleDef.name ||
          existing.description !== roleDef.description
        ) {
          const updated = await prisma.roleDefinition.update({
            where: { code: roleDef.code },
            data: {
              name: roleDef.name,
              description: roleDef.description,
            },
          });
          roleMap.set(updated.code, updated);
          logger.recordUpdated("RoleDefinition", roleDef.code);
        } else {
          logger.recordSkipped("RoleDefinition", roleDef.code, "Identical role exists");
        }
      }
    }

    // -------------------------------------------------------------
    // 3. Seed Role-Permission Mappings
    // -------------------------------------------------------------
    logger.info("Synchronizing RBAC Role-Permission matrix...");
    const allDbPermissions = await prisma.permission.findMany();
    const existingRolePerms = await prisma.rolePermission.findMany();
    const rolePermSet = new Set(
      existingRolePerms.map((rp) => `${rp.roleId}:${rp.permissionId}`)
    );

    for (const [roleCode, allowedCodes] of Object.entries(ROLE_PERMISSION_MATRIX)) {
      const role = roleMap.get(roleCode);
      if (!role) {
        logger.warn(`Role ${roleCode} not found in database. Skipping permissions.`);
        continue;
      }

      const isWildcard = allowedCodes.includes("*");
      const targetPermissions = isWildcard
        ? allDbPermissions
        : allDbPermissions.filter((p) => allowedCodes.includes(p.code));

      for (const perm of targetPermissions) {
        const key = `${role.id}:${perm.id}`;
        if (!rolePermSet.has(key)) {
          await prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: perm.id,
            },
          });
          rolePermSet.add(key);
          logger.recordInserted("RolePermission", `${roleCode} -> ${perm.code}`);
        } else {
          logger.recordSkipped("RolePermission", `${roleCode} -> ${perm.code}`, "Already granted");
        }
      }
    }

    // -------------------------------------------------------------
    // 4. Seed Portals
    // -------------------------------------------------------------
    logger.info(`Seeding ${CORE_PORTALS.length} authorized platform portals...`);
    const existingPortals = await prisma.portal.findMany();
    const portalMap = new Map(existingPortals.map((p) => [p.key, p]));

    for (const portalDef of CORE_PORTALS) {
      const existing = portalMap.get(portalDef.key);
      if (!existing) {
        await prisma.portal.create({
          data: {
            id: portalDef.id,
            key: portalDef.key,
            name: portalDef.name,
            description: portalDef.description,
            baseUrl: portalDef.baseUrl,
          },
        });
        logger.recordInserted("Portal", portalDef.key);
      } else {
        if (
          existing.baseUrl !== portalDef.baseUrl ||
          existing.name !== portalDef.name ||
          existing.description !== portalDef.description
        ) {
          await prisma.portal.update({
            where: { key: portalDef.key },
            data: {
              baseUrl: portalDef.baseUrl,
              name: portalDef.name,
              description: portalDef.description,
            },
          });
          logger.recordUpdated("Portal", portalDef.key);
        } else {
          logger.recordSkipped("Portal", portalDef.key, "Identical portal exists");
        }
      }
    }

    logger.info("✓ Core platform seeder finished successfully.");
    logger.printSummary();
    return logger.toResult(true);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error("Core platform seeder encountered a failure", error);
    logger.printSummary();
    return logger.toResult(false, errMsg);
  }
}
