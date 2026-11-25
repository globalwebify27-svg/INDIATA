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
import { BoothsService } from "./booths.service";
import { TenantIsolationGuard } from "../../common/guards/tenant-isolation.guard";
import { TenantId } from "../../common/decorators/tenant.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  UserRole,
  BoothQueryDto,
  BoothQueryDtoSchema,
  CreateBoothDto,
  CreateBoothDtoSchema,
  UpdateBoothDto,
  UpdateBoothDtoSchema,
  AssignKaryakartaDto,
  AssignKaryakartaDtoSchema,
  CreateKaryakartaDto,
  CreateKaryakartaDtoSchema,
  UpdateBloOfficerDto,
  UpdateBloOfficerDtoSchema,
} from "@rajtantra/common-types";

@Controller("booths")
@UseGuards(TenantIsolationGuard)
export class BoothsController {
  constructor(private readonly boothsService: BoothsService) {}

  /**
   * Aggregate statistics for booth dashboard vitals cards & Grade breakdown.
   * Placed before `:id` to prevent route collision.
   */
  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getStats(@TenantId() tenantId: string) {
    return this.boothsService.getStats(tenantId);
  }

  /**
   * Workforce roster: All karyakartas in the constituency with booth assignments.
   * Placed before `:id` to prevent route collision.
   */
  @Get("workforce")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getWorkforce(
    @TenantId() tenantId: string,
    @Query("search") search?: string,
    @Query("boothNumber") boothNumber?: string
  ) {
    return this.boothsService.getWorkforce(tenantId, { search, boothNumber });
  }

  /**
   * Onboard / Provision a new Karyakarta volunteer.
   */
  @Post("workforce")
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async createKaryakarta(
    @TenantId() tenantId: string,
    @Body(new ZodValidationPipe(CreateKaryakartaDtoSchema)) dto: CreateKaryakartaDto
  ) {
    return this.boothsService.createKaryakarta(tenantId, dto);
  }

  /**
   * BLO (Booth Level Officer) Directory.
   * Placed before `:id` to prevent route collision.
   */
  @Get("blo/directory")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getBloDirectory(
    @TenantId() tenantId: string,
    @Query("search") search?: string
  ) {
    return this.boothsService.getBloDirectory(tenantId, { search });
  }

  /**
   * Update BLO contact details for a specific booth.
   */
  @Patch("blo/:boothNumber")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async updateBloOfficer(
    @TenantId() tenantId: string,
    @Param("boothNumber") boothNumber: string,
    @Body(new ZodValidationPipe(UpdateBloOfficerDtoSchema)) dto: UpdateBloOfficerDto
  ) {
    return this.boothsService.updateBloOfficer(tenantId, boothNumber, dto);
  }

  /**
   * Assign one or more karyakartas to a polling booth.
   */
  @Post(":boothNumber/assign-karyakarta")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async assignKaryakartas(
    @TenantId() tenantId: string,
    @Param("boothNumber") boothNumber: string,
    @Body(new ZodValidationPipe(AssignKaryakartaDtoSchema)) dto: AssignKaryakartaDto
  ) {
    return this.boothsService.assignKaryakartasToBooth(
      tenantId,
      boothNumber,
      dto.karyakartaIds
    );
  }

  /**
   * Unassign a karyakarta from a polling booth.
   */
  @Delete(":boothNumber/karyakarta/:karyakartaId")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async unassignKaryakarta(
    @TenantId() tenantId: string,
    @Param("boothNumber") boothNumber: string,
    @Param("karyakartaId") karyakartaId: string
  ) {
    return this.boothsService.unassignKaryakartaFromBooth(
      tenantId,
      boothNumber,
      karyakartaId
    );
  }

  /**
   * Retrieve paginated polling booths with live computed scores & Grade (A/B/C/D).
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findAll(
    @TenantId() tenantId: string,
    @Query(new ZodValidationPipe(BoothQueryDtoSchema)) query: BoothQueryDto
  ) {
    return this.boothsService.findAll(tenantId, query);
  }

  /**
   * Retrieve full details of a single polling booth by ID or boothNumber.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findById(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.boothsService.findById(tenantId, id);
  }

  /**
   * Create a new polling booth.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async create(
    @TenantId() tenantId: string,
    @Body(new ZodValidationPipe(CreateBoothDtoSchema)) dto: CreateBoothDto
  ) {
    return this.boothsService.create(tenantId, dto);
  }

  /**
   * Update an existing polling booth.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateBoothDtoSchema)) dto: UpdateBoothDto
  ) {
    return this.boothsService.update(tenantId, id, dto);
  }

  /**
   * Delete a polling booth.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async delete(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.boothsService.delete(tenantId, id);
  }
}
