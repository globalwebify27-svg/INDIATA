import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

export interface HealthStatus {
  status: "ok" | "degraded";
  uptimeSeconds: number;
  database: "healthy" | "unreachable";
  timestamp: string;
  version: string;
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth(): Promise<HealthStatus> {
    const isDbHealthy = await this.prisma.isHealthy();

    return {
      status: isDbHealthy ? "ok" : "degraded",
      uptimeSeconds: Math.floor(process.uptime()),
      database: isDbHealthy ? "healthy" : "unreachable",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
  }
}
