import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { env } from "./config/env.config";

async function bootstrap(): Promise<void> {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) =>
    origin.trim().replace(/\/$/, ""),
  );
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-side)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      // 1. Direct match with configured CORS_ORIGIN or wildcard
      if (
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // 2. Automatically allow all Vercel deployments (*.vercel.app) & localhost
      try {
        const url = new URL(normalizedOrigin);
        if (
          url.hostname.endsWith(".vercel.app") ||
          url.hostname === "localhost" ||
          url.hostname === "127.0.0.1"
        ) {
          return callback(null, true);
        }
      } catch {
        // Fallback for non-URL origins
      }

      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-Id",
      "X-Organization-Id",
    ],
  });

  // Versioned API Prefix: /api/v1
  app.setGlobalPrefix(env.API_PREFIX);

  await app.listen(env.PORT);
  logger.log(
    `Rajtantra Core API successfully started on port ${env.PORT} with prefix ${env.API_PREFIX}`,
  );
  logger.log(`Environment: ${env.NODE_ENV}`);
}

void bootstrap();
