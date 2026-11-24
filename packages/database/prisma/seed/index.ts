import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { SeedFunction, SeedModuleKey, SeedOptions, SeedResult } from "./shared/types";
import { printMasterSummary } from "./shared/logger";

// Import Modular Domain Seeders
import { seedCore } from "./core/core.seeder";
import { seedGeography } from "./geography/geography.seeder";
import { seedCommercial } from "./commercial/commercial.seeder";
import { seedElections } from "./elections/elections.seeder";
import { seedWorkforce } from "./workforce/workforce.seeder";
import { seedFieldOperations } from "./field-operations/field-operations.seeder";
import { seedVoters } from "./voters/voters.seeder";
import { seedEngagement } from "./engagement/engagement.seeder";
import { seedAudit } from "./audit/audit.seeder";

// -----------------------------------------------------------------
// Environment Setup & Protection
// -----------------------------------------------------------------
if (typeof process.loadEnvFile === "function" && !process.env.DATABASE_URL) {
  const envPaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(__dirname, "../../../../.env"),
    path.resolve(__dirname, "../../../.env"),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        process.loadEnvFile(envPath);
        break;
      } catch {}
    }
  }
}

if (process.env.NODE_ENV === "production" && !process.argv.includes("--allow-production")) {
  console.error(
    "\n[FATAL] Database seeding is BLOCKED in production mode! Pass --allow-production if intentional.\n"
  );
  process.exit(1);
}

// -----------------------------------------------------------------
// Domain Seed Pipeline Registry (In Strict Foreign-Key Dependency Order)
// -----------------------------------------------------------------
const SEED_PIPELINE: Array<{ key: SeedModuleKey; fn: SeedFunction; description: string }> = [
  {
    key: SeedModuleKey.CORE,
    fn: seedCore,
    description: "System roles, granular permissions, authorized portals, and RBAC matrix",
  },
  {
    key: SeedModuleKey.GEOGRAPHY,
    fn: seedGeography,
    description: "State, district, and electoral constituency hierarchy",
  },
  {
    key: SeedModuleKey.COMMERCIAL,
    fn: seedCommercial,
    description: "Distributors, partner transactions, payouts, and licensing enquiries",
  },
  {
    key: SeedModuleKey.ELECTIONS,
    fn: seedElections,
    description: "Election tenancies and candidate organizations",
  },
  {
    key: SeedModuleKey.WORKFORCE,
    fn: seedWorkforce,
    description: "Super Admin, Distributor, Candidate Admin, and Booth Karyakartas",
  },
  {
    key: SeedModuleKey.FIELD_OPERATIONS,
    fn: seedFieldOperations,
    description: "Polling booths, BLO directory, and ground readiness metrics",
  },
  {
    key: SeedModuleKey.VOTERS,
    fn: seedVoters,
    description: "9-facet electoral roll, household hierarchy, and political classification",
  },
  {
    key: SeedModuleKey.ENGAGEMENT,
    fn: seedEngagement,
    description: "Surveys, civic tickets, voter slip dispatches, turnout audits, and alerts",
  },
  {
    key: SeedModuleKey.AUDIT,
    fn: seedAudit,
    description: "Security audit ledger, login attempts, and operational trails",
  },
];

// -----------------------------------------------------------------
// CLI Argument Parsing
// -----------------------------------------------------------------
function parseArgs(): {
  selectedModule: string | null;
  options: SeedOptions;
  showHelp: boolean;
  listModules: boolean;
} {
  const args = process.argv.slice(2);
  let selectedModule: string | null = null;
  const options: SeedOptions = {
    verbose: args.includes("--verbose") || args.includes("-v"),
    dryRun: args.includes("--dry-run"),
  };
  let showHelp = args.includes("--help") || args.includes("-h");
  let listModules = args.includes("--list");

  for (const arg of args) {
    if (arg.startsWith("--module=")) {
      selectedModule = arg.split("=")[1].trim().toLowerCase();
    }
  }

  return { selectedModule, options, showHelp, listModules };
}

function printUsage(): void {
  console.log(`
INDIATA Modular Database Seeding Engine
=======================================
Usage:
  pnpm seed [options]
  tsx prisma/seed/index.ts [options]

Options:
  --module=<name>       Run a specific seed module (e.g. --module=core)
  --list                List all available seed modules and their descriptions
  --verbose, -v         Enable detailed record-level logging
  --dry-run             Simulate without committing writes (where supported)
  --help, -h            Show this help dialog

Examples:
  pnpm seed --module=core
  pnpm seed --verbose
`);
}

// -----------------------------------------------------------------
// Master Execution Orchestrator
// -----------------------------------------------------------------
async function main(): Promise<void> {
  const { selectedModule, options, showHelp, listModules } = parseArgs();

  if (showHelp) {
    printUsage();
    return;
  }

  if (listModules) {
    console.log("\nAvailable Seed Modules (Execution Order):");
    SEED_PIPELINE.forEach((m, idx) => {
      console.log(`  ${idx + 1}. ${m.key.padEnd(18)} : ${m.description}`);
    });
    console.log();
    return;
  }

  const prisma = new PrismaClient({
    datasources: process.env.DATABASE_URL
      ? { db: { url: process.env.DATABASE_URL } }
      : undefined,
  });

  const results: SeedResult[] = [];
  const startGlobal = Date.now();

  console.log("\n==================================================================");
  console.log("       INDIATA MODULAR DATABASE SEEDING ENGINE INITIALIZED        ");
  console.log("==================================================================");
  console.log(`Target Database: ${process.env.DATABASE_URL ? "Configured in Environment" : "Default"}`);
  console.log(`Scope:           ${selectedModule ? `Single Module [${selectedModule}]` : "Complete Dependency Pipeline"}`);
  console.log(`Verbose Output:  ${options.verbose ? "ENABLED" : "DISABLED"}`);
  console.log("------------------------------------------------------------------\n");

  try {
    let pipelineToRun = SEED_PIPELINE;

    if (selectedModule && selectedModule !== "all") {
      const match = SEED_PIPELINE.find((m) => m.key === selectedModule);
      if (!match) {
        console.error(
          `[ERROR] Unknown module "${selectedModule}". Valid modules are:\n  ${SEED_PIPELINE.map((m) => m.key).join(", ")}`
        );
        process.exit(1);
      }
      pipelineToRun = [match];
    }

    for (const step of pipelineToRun) {
      console.log(`>>> Starting execution for module [${step.key}]...`);
      const res = await step.fn(prisma, options);
      results.push(res);
      if (!res.success) {
        console.error(`[ERROR] Module [${step.key}] failed. Halting pipeline.`);
        break;
      }
    }

    printMasterSummary(results);

    const hasFailure = results.some((r) => !r.success);
    if (hasFailure) {
      process.exit(1);
    }
  } catch (err) {
    console.error("[FATAL] Uncaught error during seed pipeline execution:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log(`Database client disconnected. Total elapsed: ${Date.now() - startGlobal}ms.\n`);
  }
}

main();
