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
import { VotersService } from "./voters.service";
import { TenantIsolationGuard } from "../../common/guards/tenant-isolation.guard";
import { TenantId } from "../../common/decorators/tenant.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  AuthenticatedUser,
  UserRole,
  VoterQueryDto,
  VoterQueryDtoSchema,
  CreateVoterDto,
  CreateVoterDtoSchema,
  UpdateVoterDto,
  UpdateVoterDtoSchema,
  UpdateVoterClassificationDto,
  UpdateVoterClassificationDtoSchema,
  UpdateVoterTurnoutDto,
  UpdateVoterTurnoutDtoSchema,
  BulkImportVoterDto,
  BulkImportVoterDtoSchema,
} from "@rajtantra/common-types";

@Controller("voters")
@UseGuards(TenantIsolationGuard)
export class VotersController {
  constructor(private readonly votersService: VotersService) {}

  /**
   * Aggregate statistics for dashboard vitals cards.
   * Declared before `:id` to prevent route collision.
   */
  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.CANDIDATE_ADMIN,
    UserRole.KARYAKARTA,
    UserRole.DISTRIBUTOR,
  )
  async getStats(
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
  ) {
    return this.votersService.getStats(user, tenantId);
  }

  /**
   * Search and paginated list of voters.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.CANDIDATE_ADMIN,
    UserRole.KARYAKARTA,
    UserRole.DISTRIBUTOR,
  )
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(VoterQueryDtoSchema)) query: VoterQueryDto,
    @TenantId() tenantId: string,
  ) {
    return this.votersService.findAll(user, query, tenantId);
  }

  /**
   * Full 9-section elector dossier with household members & tickets.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.CANDIDATE_ADMIN,
    UserRole.KARYAKARTA,
    UserRole.DISTRIBUTOR,
  )
  async findById(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
  ) {
    return this.votersService.findById(id, user, tenantId);
  }

  /**
   * Create a single voter record.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async create(
    @Body(new ZodValidationPipe(CreateVoterDtoSchema)) dto: CreateVoterDto,
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
  ) {
    return this.votersService.create(dto, user, tenantId);
  }

  /**
   * Bulk import voters from parsed CSV / Excel.
   */
  @Post("bulk-import")
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async bulkImport(
    @Body(new ZodValidationPipe(BulkImportVoterDtoSchema)) dto: BulkImportVoterDto,
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
  ) {
    return this.votersService.bulkImport(dto, user, tenantId);
  }

  /**
   * Fast 1-click sentiment / classification update.
   */
  @Patch(":id/classification")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async updateClassification(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateVoterClassificationDtoSchema))
    dto: UpdateVoterClassificationDto,
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
  ) {
    return this.votersService.updateClassification(id, dto, user, tenantId);
  }

  /**
   * Fast 1-click election-day turnout marking.
   */
  @Patch(":id/turnout")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async updateTurnout(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateVoterTurnoutDtoSchema))
    dto: UpdateVoterTurnoutDto,
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
  ) {
    return this.votersService.updateTurnout(id, dto, user, tenantId);
  }

  /**
   * Update arbitrary voter demographic or operational attributes.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateVoterDtoSchema)) dto: UpdateVoterDto,
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
  ) {
    return this.votersService.update(id, dto, user, tenantId);
  }
}
