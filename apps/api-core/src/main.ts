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
    origin.trim(),
  );
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or allowed origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
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
