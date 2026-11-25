import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { PollingService } from "./polling.service";
import { TenantIsolationGuard } from "../../common/guards/tenant-isolation.guard";
import { TenantId } from "../../common/decorators/tenant.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  UserRole,
  AuthenticatedUser,
  RecordHourlyTurnoutDto,
  RecordHourlyTurnoutDtoSchema,
  QueryHourlyTurnoutDto,
  QueryHourlyTurnoutDtoSchema,
  CreateBroadcastNotificationDto,
  CreateBroadcastNotificationDtoSchema,
  QueryBroadcastNotificationDto,
  QueryBroadcastNotificationDtoSchema,
  QueryTurnoutAuditDto,
  QueryTurnoutAuditDtoSchema,
  BoothTurnoutPaceStatus,
} from "@rajtantra/common-types";

@Controller("polling")
@UseGuards(TenantIsolationGuard)
export class PollingController {
  constructor(private readonly pollingService: PollingService) {}

  /**
   * Real-time War Room telemetry (Turnout %, Timeslot Trajectory, Demographics, Critical Pace).
   */
  @Get("live")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getLiveTelemetry(@TenantId() tenantId: string) {
    return this.pollingService.getLiveTelemetry(tenantId);
  }

  /**
   * Booth-by-booth turnout status list with lag classification.
   */
  @Get("booths")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getBoothTurnoutList(
    @TenantId() tenantId: string,
    @Query("search") search?: string,
    @Query("status") status?: BoothTurnoutPaceStatus,
  ) {
    return this.pollingService.getBoothTurnoutList(tenantId, { search, status });
  }

  /**
   * Record hourly turnout log for a booth.
   */
  @Post("hourly-turnout")
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async recordHourlyTurnout(
    @TenantId() tenantId: string,
    @Body(new ZodValidationPipe(RecordHourlyTurnoutDtoSchema)) dto: RecordHourlyTurnoutDto,
  ) {
    return this.pollingService.recordHourlyTurnout(tenantId, dto);
  }

  /**
   * Retrieve hourly turnout logs.
   */
  @Get("hourly-turnout")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getHourlyTurnoutLogs(
    @TenantId() tenantId: string,
    @Query(new ZodValidationPipe(QueryHourlyTurnoutDtoSchema)) query: QueryHourlyTurnoutDto,
  ) {
    return this.pollingService.getHourlyTurnoutLogs(tenantId, query);
  }

  /**
   * Turnout audit log ledger (LPIANE individual voter turnout records).
   */
  @Get("audits")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getTurnoutAudits(
    @TenantId() tenantId: string,
    @Query(new ZodValidationPipe(QueryTurnoutAuditDtoSchema)) query: QueryTurnoutAuditDto,
  ) {
    return this.pollingService.getTurnoutAudits(tenantId, query);
  }

  /**
   * Dispatch a broadcast notification to Cadre / Booth agents.
   */
  @Post("broadcasts")
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async createBroadcast(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateBroadcastNotificationDtoSchema))
    dto: CreateBroadcastNotificationDto,
  ) {
    return this.pollingService.createBroadcastNotification(tenantId, user.id, dto);
  }

  /**
   * List dispatched broadcast notifications.
   */
  @Get("broadcasts")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getBroadcasts(
    @TenantId() tenantId: string,
    @Query(new ZodValidationPipe(QueryBroadcastNotificationDtoSchema))
    query: QueryBroadcastNotificationDto,
  ) {
    return this.pollingService.getBroadcastNotifications(tenantId, query);
  }

  /**
   * LPIANE Engine Automated Mobilization: Trigger immediate alert for lagging booth.
   */
  @Post("mobilize/:boothNumber")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async triggerMobilization(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param("boothNumber") boothNumber: string,
  ) {
    return this.pollingService.triggerLpianeMobilizationAlert(tenantId, user.id, boothNumber);
  }
}
