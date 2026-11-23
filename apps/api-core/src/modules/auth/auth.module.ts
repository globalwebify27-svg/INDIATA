import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthNotificationService } from "./auth-notification.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { env } from "../../config/env.config";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthNotificationService, JwtStrategy],
  exports: [AuthService, AuthNotificationService, JwtModule],
})
export class AuthModule {}
