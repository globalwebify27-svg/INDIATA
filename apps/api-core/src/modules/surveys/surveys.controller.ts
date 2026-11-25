import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { SurveysService } from "./surveys.service";
import { TenantIsolationGuard } from "../../common/guards/tenant-isolation.guard";
import { TenantId } from "../../common/decorators/tenant.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  UserRole,
  AuthenticatedUser,
  SurveyQueryDto,
  SurveyQueryDtoSchema,
  CreateSurveyDto,
  CreateSurveyDtoSchema,
  UpdateSurveyDto,
  UpdateSurveyDtoSchema,
  CreateCorrectionDto,
  CreateCorrectionDtoSchema,
  ReviewCorrectionDto,
  ReviewCorrectionDtoSchema,
  CorrectionStatus,
} from "@rajtantra/common-types";

@Controller("surveys")
@UseGuards(TenantIsolationGuard)
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  /**
   * Aggregate statistics for surveys, welfare schemes, and geotagging.
   */
  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getStats(@TenantId() tenantId: string) {
    return this.surveysService.getSurveyStats(tenantId);
  }

  /**
   * List quarantine voter data correction proposals.
   */
  @Get("corrections/list")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getCorrections(
    @TenantId() tenantId: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("status") status?: CorrectionStatus,
  ) {
    return this.surveysService.findAllCorrections(tenantId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      status,
    });
  }

  /**
   * Propose voter data correction (karyakarta field submission).
   */
  @Post("corrections/propose")
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async proposeCorrection(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateCorrectionDtoSchema)) dto: CreateCorrectionDto,
  ) {
    return this.surveysService.createCorrection(tenantId, user.id, dto);
  }

  /**
   * Review voter data correction (Approve / Reject).
   */
  @Patch("corrections/:id/review")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async reviewCorrection(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(ReviewCorrectionDtoSchema)) dto: ReviewCorrectionDto,
  ) {
    return this.surveysService.reviewCorrection(tenantId, user.id, id, dto);
  }

  /**
   * List all doorstep surveys with filtering and pagination.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findAll(
    @TenantId() tenantId: string,
    @Query(new ZodValidationPipe(SurveyQueryDtoSchema)) query: SurveyQueryDto,
  ) {
    return this.surveysService.findAllSurveys(tenantId, query);
  }

  /**
   * Get single survey by ID.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findById(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.surveysService.findSurveyById(tenantId, id);
  }

  /**
   * Record a new doorstep field survey.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateSurveyDtoSchema)) dto: CreateSurveyDto,
  ) {
    return this.surveysService.createSurvey(tenantId, user.id, dto);
  }

  /**
   * Update survey notes, demands, or welfare schemes.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateSurveyDtoSchema)) dto: UpdateSurveyDto,
  ) {
    return this.surveysService.updateSurvey(tenantId, id, dto);
  }

  /**
   * Delete survey record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async delete(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.surveysService.deleteSurvey(tenantId, id);
  }
}
