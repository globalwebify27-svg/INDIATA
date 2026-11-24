import { SeedRecordStats, SeedResult } from "./types";

export class SeedLogger {
  private moduleName: string;
  private stats: Record<string, SeedRecordStats> = {};
  private startTime: number;
  private verbose: boolean;

  constructor(moduleName: string, verbose = false) {
    this.moduleName = moduleName;
    this.verbose = verbose;
    this.startTime = Date.now();
  }

  private ensureModelStats(model: string): SeedRecordStats {
    if (!this.stats[model]) {
      this.stats[model] = { inserted: 0, updated: 0, skipped: 0 };
    }
    return this.stats[model];
  }

  public recordInserted(model: string, identifier?: string): void {
    const s = this.ensureModelStats(model);
    s.inserted++;
    if (this.verbose && identifier) {
      console.log(`  [+] [${model}] Inserted: ${identifier}`);
    }
  }

  public recordUpdated(model: string, identifier?: string): void {
    const s = this.ensureModelStats(model);
    s.updated++;
    if (this.verbose && identifier) {
      console.log(`  [*] [${model}] Updated: ${identifier}`);
    }
  }

  public recordSkipped(model: string, identifier?: string, reason?: string): void {
    const s = this.ensureModelStats(model);
    s.skipped++;
    if (this.verbose && identifier) {
      console.log(`  [-] [${model}] Skipped: ${identifier} ${reason ? `(${reason})` : ""}`);
    }
  }

  public info(message: string): void {
    console.log(`[${this.moduleName.toUpperCase()}] ${message}`);
  }

  public warn(message: string): void {
    console.warn(`[${this.moduleName.toUpperCase()}] [WARN] ${message}`);
  }

  public error(message: string, err?: unknown): void {
    console.error(`[${this.moduleName.toUpperCase()}] [ERROR] ${message}`, err ?? "");
  }

  public toResult(success = true, error?: string): SeedResult {
    const durationMs = Date.now() - this.startTime;
    return {
      module: this.moduleName,
      success,
      durationMs,
      stats: this.stats,
      error,
    };
  }

  public printSummary(): void {
    const durationMs = Date.now() - this.startTime;
    console.log(`\n--- [Module: ${this.moduleName}] Execution Summary (${durationMs}ms) ---`);
    const models = Object.keys(this.stats);
    if (models.length === 0) {
      console.log("  No records processed.");
    } else {
      for (const model of models) {
        const s = this.stats[model];
        console.log(
          `  • ${model.padEnd(20)} | Inserted: ${String(s.inserted).padStart(4)} | Updated: ${String(s.updated).padStart(4)} | Skipped: ${String(s.skipped).padStart(4)}`
        );
      }
    }
    console.log("------------------------------------------------------------------");
  }
}

export function printMasterSummary(results: SeedResult[]): void {
  console.log("\n==================================================================");
  console.log("             INDIATA SEED EXECUTION MASTER SUMMARY               ");
  console.log("==================================================================");

  let totalInserted = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalDuration = 0;
  let allSuccess = true;

  for (const res of results) {
    const status = res.success ? "SUCCESS" : "FAILED";
    totalDuration += res.durationMs;
    if (!res.success) allSuccess = false;

    let modIns = 0;
    let modUpd = 0;
    let modSkp = 0;
    for (const model of Object.keys(res.stats)) {
      modIns += res.stats[model].inserted;
      modUpd += res.stats[model].updated;
      modSkp += res.stats[model].skipped;
    }

    totalInserted += modIns;
    totalUpdated += modUpd;
    totalSkipped += modSkp;

    console.log(
      `[${status.padEnd(7)}] ${res.module.padEnd(18)} | Ins: ${String(modIns).padStart(4)} | Upd: ${String(modUpd).padStart(4)} | Skp: ${String(modSkp).padStart(4)} | ${res.durationMs}ms`
    );
    if (res.error) {
      console.log(`        Error: ${res.error}`);
    }
  }

  console.log("------------------------------------------------------------------");
  console.log(
    `TOTALS:   ${results.length} Modules    | Ins: ${String(totalInserted).padStart(4)} | Upd: ${String(totalUpdated).padStart(4)} | Skp: ${String(totalSkipped).padStart(4)} | ${totalDuration}ms`
  );
  console.log(`STATUS:   ${allSuccess ? "ALL MODULES SUCCEEDED" : "ONE OR MORE MODULES FAILED"}`);
  console.log("==================================================================\n");
}
