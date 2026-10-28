import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  OrganizationsService,
  OrganizationSummary,
} from "./organizations.service";
import { TenantIsolationGuard } from "../../common/guards/tenant-isolation.guard";
import { TenantId } from "../../common/decorators/tenant.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@rajtantra/common-types";

@Controller("organizations")
@UseGuards(TenantIsolationGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get("current")
  @HttpCode(HttpStatus.OK)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.DISTRIBUTOR,
    UserRole.CANDIDATE_ADMIN,
    UserRole.KARYAKARTA,
  )
  async getCurrentOrganization(
    @TenantId() organizationId: string,
  ): Promise<OrganizationSummary> {
    return this.organizationsService.findById(organizationId);
  }

  @Get(":organizationId")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DISTRIBUTOR, UserRole.CANDIDATE_ADMIN)
  async getOrganizationById(
    @Param("organizationId") organizationId: string,
  ): Promise<OrganizationSummary> {
    return this.organizationsService.findById(organizationId);
  }
}
