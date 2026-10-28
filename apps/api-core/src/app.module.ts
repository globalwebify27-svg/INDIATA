import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { GlobalHttpExceptionFilter } from "./common/filters/http-exception.filter";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";

@Module({
  imports: [PrismaModule, HealthModule, AuthModule, OrganizationsModule],
  providers: [
    // Deny-by-default global JWT authentication guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Role-based authorization guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global response standardizer: { success, statusCode, message, data, meta, timestamp, requestId }
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Global structured HTTP logging
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Global error response standardizer: { success: false, statusCode, message, error, timestamp, requestId }
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
