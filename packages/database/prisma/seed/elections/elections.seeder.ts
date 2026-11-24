import { PrismaClient, OrganizationStatus, PlanType } from "@prisma/client";
import { SeedLogger } from "../shared/logger";
import { SeedOptions, SeedResult } from "../shared/types";
import { SEED_ORGANIZATIONS } from "../shared/constants";

export async function seedElections(
  prisma: PrismaClient,
  options?: SeedOptions
): Promise<SeedResult> {
  const logger = new SeedLogger("elections", options?.verbose ?? false);
  logger.info("Seeding Election Tenancies and Candidate War Room Organizations...");

  try {
    for (const org of SEED_ORGANIZATIONS) {
      const existing = await prisma.organization.findUnique({
        where: { slug: org.slug },
      });

      if (!existing) {
        // Verify distributor exists before linking
        let validDistributorId: string | null = null;
        if (org.distributorId) {
          const dist = await prisma.distributor.findUnique({
            where: { id: org.distributorId },
          });
          if (dist) validDistributorId = dist.id;
        }

        await prisma.organization.create({
          data: {
            id: org.id,
            name: org.name,
            slug: org.slug,
            status: OrganizationStatus.ACTIVE,
            planType: PlanType.ELECTION_MODULE,
            hasAiMode: org.hasAiMode,
            aiSeatsLimit: org.aiSeatsLimit,
            state: org.state,
            district: org.district,
            constituencyName: org.constituencyName,
            electionType: org.electionType,
            pollingDate: org.pollingDate,
            distributorId: validDistributorId,
          },
        });
        logger.recordInserted("Organization", `${org.name} (${org.slug})`);
      } else {
        logger.recordSkipped("Organization", `${org.name} (${org.slug})`, "Organization exists");
      }
    }

    logger.info("✓ Elections and organization tenancies seeder finished.");
    logger.printSummary();
    return logger.toResult(true);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error("Elections seeder encountered a failure", error);
    logger.printSummary();
    return logger.toResult(false, errMsg);
  }
}
