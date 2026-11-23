import {
  Controller,
  Post,
  Get,
  Body,
  Param,
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
  RegisterEnquiryDto,
  RegisterEnquiryDtoSchema,
  ForgotPasswordDto,
  ForgotPasswordDtoSchema,
  ResetPasswordDto,
  ResetPasswordDtoSchema,
  ChangePasswordDto,
  ChangePasswordDtoSchema,
  AdminResetPasswordDto,
  AdminResetPasswordDtoSchema,
  KaryakartaActivationDto,
  KaryakartaActivationDtoSchema,
} from "@rajtantra/common-types";
import { RegisterEnquiryResult } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register-enquiry")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async registerEnquiry(
    @Body(new ZodValidationPipe(RegisterEnquiryDtoSchema)) dto: RegisterEnquiryDto,
  ): Promise<RegisterEnquiryResult> {
    return this.authService.registerEnquiry(dto);
  }

  @Post("forgot-password")
  @Public()
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordDtoSchema)) dto: ForgotPasswordDto,
  ): Promise<{ message: string; challengeSent: boolean; devOtp?: string }> {
    return this.authService.forgotPassword(dto);
  }

  @Post("reset-password")
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordDtoSchema)) dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(dto);
  }

  @Post("change-password")
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(ChangePasswordDtoSchema)) dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(user.id, dto);
  }

  @Post("users/:userId/reset-password")
  @HttpCode(HttpStatus.OK)
  async adminResetPassword(
    @CurrentUser() adminUser: AuthenticatedUser,
    @Param("userId") targetUserId: string,
    @Body(new ZodValidationPipe(AdminResetPasswordDtoSchema)) dto: AdminResetPasswordDto,
  ): Promise<{ message: string; devOtp?: string }> {
    return this.authService.adminResetPassword(adminUser, targetUserId, dto);
  }


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

  @Post("karyakarta/activate")
  @Public()
  @HttpCode(HttpStatus.OK)
  async activateKaryakarta(
    @Body(new ZodValidationPipe(KaryakartaActivationDtoSchema)) dto: KaryakartaActivationDto,
    @Req() req: Request,
  ) {
    const ipAddress =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    return this.authService.activateKaryakarta(dto, ipAddress, userAgent);
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
