import { PrismaClient } from "@prisma/client";

export interface SeedOptions {
  dryRun?: boolean;
  verbose?: boolean;
  countMultiplier?: number;
}

export interface SeedRecordStats {
  inserted: number;
  updated: number;
  skipped: number;
}

export interface SeedResult {
  module: string;
  success: boolean;
  durationMs: number;
  stats: Record<string, SeedRecordStats>;
  error?: string;
}

export type SeedFunction = (
  prisma: PrismaClient,
  options?: SeedOptions
) => Promise<SeedResult>;

export enum SeedModuleKey {
  CORE = "core",
  GEOGRAPHY = "geography",
  COMMERCIAL = "commercial",
  ELECTIONS = "elections",
  WORKFORCE = "workforce",
  FIELD_OPERATIONS = "field-operations",
  VOTERS = "voters",
  ENGAGEMENT = "engagement",
  AUDIT = "audit",
}
