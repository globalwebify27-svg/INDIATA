import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

if (typeof process.loadEnvFile === "function" && !process.env.DATABASE_URL) {
  const possiblePaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(__dirname, "../../../.env"),
    path.resolve(__dirname, "../../../../.env"),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        process.loadEnvFile(p);
        break;
      } catch {}
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __rajtantra_prisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__rajtantra_prisma__ ??
  new PrismaClient({
    datasources: process.env.DATABASE_URL
      ? { db: { url: process.env.DATABASE_URL } }
      : undefined,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__rajtantra_prisma__ = prisma;
}

export * from "@prisma/client";

