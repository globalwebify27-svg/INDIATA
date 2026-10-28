import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService, LoginResult } from "./auth.service";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  LoginDto,
  LoginDtoSchema,
  RefreshTokenDto,
  RefreshTokenDtoSchema,
  AuthTokenPair,
  AuthenticatedUser,
} from "@rajtantra/common-types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(LoginDtoSchema)) dto: LoginDto,
    @Req() req: Request,
  ): Promise<LoginResult> {
    const ipAddress =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Post("refresh")
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body(new ZodValidationPipe(RefreshTokenDtoSchema)) dto: RefreshTokenDto,
  ): Promise<AuthTokenPair> {
    return this.authService.refresh(dto);
  }

  @Post("logout")
  @Public()
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body(new ZodValidationPipe(RefreshTokenDtoSchema)) dto: RefreshTokenDto,
  ): Promise<{ message: string }> {
    await this.authService.logout(dto.refreshToken);
    return { message: "Successfully logged out and session revoked" };
  }

  @Get("me")
  @HttpCode(HttpStatus.OK)
  async getMe(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AuthenticatedUser & { organizationName?: string }> {
    return this.authService.getMe(user.id);
  }
}
