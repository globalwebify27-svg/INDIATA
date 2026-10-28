import { HealthController } from "./health.controller";
import { HealthService, HealthStatus } from "./health.service";

describe("HealthController", () => {
  let controller: HealthController;
  let service: jest.Mocked<HealthService>;

  beforeEach(() => {
    service = {
      checkHealth: jest.fn(),
    } as unknown as jest.Mocked<HealthService>;
    controller = new HealthController(service);
  });

  it("should return health status payload", async () => {
    const mockHealth: HealthStatus = {
      status: "ok",
      uptimeSeconds: 120,
      database: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
    service.checkHealth.mockResolvedValue(mockHealth);

    const result = await controller.getHealth();
    expect(result).toEqual(mockHealth);
  });
});
