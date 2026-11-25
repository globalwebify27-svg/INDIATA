import {
  Controller,
  Get,
  Post,
  Patch,
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
  SlipQueryDto,
  SlipQueryDtoSchema,
  CreateSlipDispatchDto,
  CreateSlipDispatchDtoSchema,
  BulkSlipDispatchDto,
  BulkSlipDispatchDtoSchema,
  UpdateSlipStatusDto,
  UpdateSlipStatusDtoSchema,
} from "@rajtantra/common-types";

@Controller("slips")
@UseGuards(TenantIsolationGuard)
export class SlipsController {
  constructor(private readonly surveysService: SurveysService) {}

  /**
   * Aggregate statistics for voter slip dispatches & channel distribution.
   */
  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getStats(@TenantId() tenantId: string) {
    return this.surveysService.getSlipStats(tenantId);
  }

  /**
   * List all voter slip dispatches with filtering and pagination.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findAll(
    @TenantId() tenantId: string,
    @Query(new ZodValidationPipe(SlipQueryDtoSchema)) query: SlipQueryDto,
  ) {
    return this.surveysService.findAllSlips(tenantId, query);
  }

  /**
   * Dispatch a single voter slip (WhatsApp, Physical, or Thermal).
   */
  @Post("dispatch")
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async dispatch(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateSlipDispatchDtoSchema)) dto: CreateSlipDispatchDto,
  ) {
    return this.surveysService.dispatchSlip(tenantId, user.id, dto);
  }

  /**
   * Bulk dispatch voter slips.
   */
  @Post("dispatch-bulk")
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async dispatchBulk(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(BulkSlipDispatchDtoSchema)) dto: BulkSlipDispatchDto,
  ) {
    return this.surveysService.dispatchBulkSlips(tenantId, user.id, dto);
  }

  /**
   * Update slip status (e.g. PRINTED -> DELIVERED).
   */
  @Patch(":id/status")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async updateStatus(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateSlipStatusDtoSchema)) dto: UpdateSlipStatusDto,
  ) {
    return this.surveysService.updateSlipStatus(tenantId, id, dto);
  }
}
