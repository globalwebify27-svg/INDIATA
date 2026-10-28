import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __rajtantra_prisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__rajtantra_prisma__ ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__rajtantra_prisma__ = prisma;
}

export * from "@prisma/client";
