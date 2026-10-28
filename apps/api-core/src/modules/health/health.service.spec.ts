import { Test, TestingModule } from "@nestjs/testing";
import { HealthService } from "./health.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("HealthService", () => {
  let service: HealthService;
  let prisma: jest.Mocked<Pick<PrismaService, "isHealthy">>;

  beforeEach(async () => {
    prisma = {
      isHealthy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it("should return ok when database is healthy", async () => {
    prisma.isHealthy.mockResolvedValue(true);

    const result = await service.checkHealth();

    expect(result.status).toBe("ok");
    expect(result.database).toBe("healthy");
    expect(result.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(result.version).toBe("1.0.0");
    expect(result.timestamp).toBeDefined();
  });

  it("should return degraded when database is unreachable", async () => {
    prisma.isHealthy.mockResolvedValue(false);

    const result = await service.checkHealth();

    expect(result.status).toBe("degraded");
    expect(result.database).toBe("unreachable");
  });
});
