import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

// Auto-load .env file if available in environment
if (typeof process.loadEnvFile === "function") {
  const possiblePaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "apps/api-core/.env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(__dirname, "../../../.env"),
    path.resolve(__dirname, "../../../../.env"),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        process.loadEnvFile(p);
        break;
      } catch {
        // Continue if parse error or missing
      }
    }
  }
}

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default("/api/v1"),
  DATABASE_URL: z
    .string()
    .default("mysql://app_user:SecurePassword123@localhost:3306/election_db"),
  REDIS_URL: z.string().default("redis://:RedisAuthPass@localhost:6379/0"),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters")
    .default("rajtantra_dev_access_secret_super_secure_key_1234567890_abcdef"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters")
    .default("rajtantra_dev_refresh_secret_super_secure_key_0987654321_fedcba"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z
    .string()
    .default(
      "http://localhost:3000,http://localhost:3001,http://localhost:3002",
    ),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export function validateEnv(
  rawEnv: Record<string, unknown> = process.env,
): EnvConfig {
  const result = EnvSchema.safeParse(rawEnv);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    throw new Error(`Environment validation failed: ${errorDetails}`);
  }
  return result.data;
}

export const env = validateEnv(process.env);

// Ensure process.env has values populated so Prisma and external tools can read them
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = env.DATABASE_URL;
}
for (const [key, val] of Object.entries(env)) {
  if (process.env[key] === undefined && val !== undefined) {
    process.env[key] = String(val);
  }
}

