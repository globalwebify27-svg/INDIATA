import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { HealthService, HealthStatus } from "./health.service";
import { Public } from "../../common/decorators/public.decorator";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async getHealth(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }
}
