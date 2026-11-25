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
import { CampaignsService } from "./campaigns.service";
import { TenantIsolationGuard } from "../../common/guards/tenant-isolation.guard";
import { TenantId } from "../../common/decorators/tenant.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  UserRole,
  AuthenticatedUser,
  CreateCampaignDto,
  CreateCampaignDtoSchema,
  QueryCampaignDto,
  QueryCampaignDtoSchema,
  UpdateCampaignStatusDto,
  UpdateCampaignStatusDtoSchema,
  CreateTemplateDto,
  CreateTemplateDtoSchema,
  EstimateAudienceDto,
  EstimateAudienceDtoSchema,
} from "@rajtantra/common-types";

@Controller("campaigns")
@UseGuards(TenantIsolationGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  /**
   * Aggregate statistics for communications (recipients, delivery rate, channel breakdown).
   */
  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getStats(@TenantId() tenantId: string) {
    return this.campaignsService.getCampaignStats(tenantId);
  }

  /**
   * Get communication credits balance (WhatsApp, SMS, AI Voice, INR).
   */
  @Get("credits")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getCredits(@TenantId() tenantId: string) {
    return this.campaignsService.getChannelCredits(tenantId);
  }

  /**
   * Estimate audience size and credit cost based on segmentation filters.
   */
  @Post("audience/estimate")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async estimateAudience(
    @TenantId() tenantId: string,
    @Body(new ZodValidationPipe(EstimateAudienceDtoSchema)) dto: EstimateAudienceDto,
  ) {
    return this.campaignsService.estimateAudience(tenantId, dto);
  }

  /**
   * List approved message templates.
   */
  @Get("templates")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getTemplates(
    @TenantId() tenantId: string,
    @Query("channel") channel?: string,
    @Query("category") category?: string,
  ) {
    return this.campaignsService.findAllTemplates(tenantId, { channel, category });
  }

  /**
   * Create a new message template.
   */
  @Post("templates")
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async createTemplate(
    @TenantId() tenantId: string,
    @Body(new ZodValidationPipe(CreateTemplateDtoSchema)) dto: CreateTemplateDto,
  ) {
    return this.campaignsService.createTemplate(tenantId, dto);
  }

  /**
   * List voter inbound replies and call feedback.
   */
  @Get("responses")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getResponses(
    @TenantId() tenantId: string,
    @Query("channel") channel?: string,
    @Query("status") status?: string,
  ) {
    return this.campaignsService.findAllResponses(tenantId, { channel, status });
  }

  /**
   * List automated triggers (Birthday greeting, Slip auto-dispatch, Turnout blast).
   */
  @Get("triggers")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getTriggers(@TenantId() tenantId: string) {
    return this.campaignsService.findAllTriggers(tenantId);
  }

  /**
   * List all campaigns with filtering and pagination.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findAll(
    @TenantId() tenantId: string,
    @Query(new ZodValidationPipe(QueryCampaignDtoSchema)) query: QueryCampaignDto,
  ) {
    return this.campaignsService.findAllCampaigns(tenantId, query);
  }

  /**
   * Get single campaign by ID.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findById(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.campaignsService.findCampaignById(tenantId, id);
  }

  /**
   * Create a new campaign.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateCampaignDtoSchema)) dto: CreateCampaignDto,
  ) {
    return this.campaignsService.createCampaign(tenantId, user.id, dto);
  }

  /**
   * Update campaign status (PAUSE / RESUME).
   */
  @Patch(":id/status")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async updateStatus(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateCampaignStatusDtoSchema)) dto: UpdateCampaignStatusDto,
  ) {
    return this.campaignsService.updateCampaignStatus(tenantId, id, dto);
  }

  /**
   * Immediately launch / trigger campaign dispatch.
   */
  @Post(":id/launch")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async launch(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.campaignsService.launchCampaign(tenantId, id);
  }

  /**
   * Delete campaign record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async delete(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.campaignsService.deleteCampaign(tenantId, id);
  }
}
