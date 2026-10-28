import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  const mockPrismaService = {
    isHealthy: jest.fn().mockResolvedValue(true),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /api/v1/auth/me - should return 401 Unauthorized when unauthenticated (deny-by-default)", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/auth/me")
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(401);
    expect(response.body.error).toBeDefined();
  });

  it("POST /api/v1/auth/login - should return 422 Unprocessable Entity when body is invalid", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ identifier: "x", password: "12" }) // too short
      .expect(422);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(422);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/v1/auth/login - should return 401 when user is not found", async () => {
    mockPrismaService.user.findFirst.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({
        identifier: "notfound@rajtantra.in",
        password: "SecretPassword123",
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(401);
  });
});
