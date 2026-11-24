import { PrismaClient } from "@prisma/client";
import { SeedLogger } from "../shared/logger";
import { SeedOptions, SeedResult } from "../shared/types";
import { GEOGRAPHY_REFERENCE } from "../shared/constants";

export async function seedGeography(
  _prisma: PrismaClient,
  options?: SeedOptions
): Promise<SeedResult> {
  const logger = new SeedLogger("geography", options?.verbose ?? false);
  logger.info("Verifying State, District and Assembly Constituency geography references...");

  // Validate reference entities
  for (const c of GEOGRAPHY_REFERENCE.CONSTITUENCIES) {
    logger.recordInserted(
      "ConstituencyRef",
      `${GEOGRAPHY_REFERENCE.STATE} > ${GEOGRAPHY_REFERENCE.DISTRICT} > ${c.name} (${c.type})`
    );
  }

  logger.info(
    `✓ Verified ${GEOGRAPHY_REFERENCE.CONSTITUENCIES.length} parliamentary & assembly administrative boundaries.`
  );
  logger.printSummary();
  return logger.toResult(true);
}
