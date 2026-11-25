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
  TicketQueryDto,
  TicketQueryDtoSchema,
  CreateTicketDto,
  CreateTicketDtoSchema,
  UpdateTicketDto,
  UpdateTicketDtoSchema,
} from "@rajtantra/common-types";

@Controller("tickets")
@UseGuards(TenantIsolationGuard)
export class TicketsController {
  constructor(private readonly surveysService: SurveysService) {}

  /**
   * Aggregate statistics for tickets, resolution rates, and priorities.
   */
  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async getStats(@TenantId() tenantId: string) {
    return this.surveysService.getTicketStats(tenantId);
  }

  /**
   * List all tickets with filtering and pagination.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findAll(
    @TenantId() tenantId: string,
    @Query(new ZodValidationPipe(TicketQueryDtoSchema)) query: TicketQueryDto,
  ) {
    return this.surveysService.findAllTickets(tenantId, query);
  }

  /**
   * Get single ticket by ID or ticketNumber.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async findById(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.surveysService.findTicketById(tenantId, id);
  }

  /**
   * Create a new civic issue / office grievance ticket.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateTicketDtoSchema)) dto: CreateTicketDto,
  ) {
    return this.surveysService.createTicket(tenantId, user.id, user.name || "Field Officer", dto);
  }

  /**
   * Update ticket status, resolution notes, priority, or assignment.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN, UserRole.KARYAKARTA)
  async update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateTicketDtoSchema)) dto: UpdateTicketDto,
  ) {
    return this.surveysService.updateTicket(tenantId, id, dto);
  }

  /**
   * Delete ticket record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CANDIDATE_ADMIN)
  async delete(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.surveysService.deleteTicket(tenantId, id);
  }
}
