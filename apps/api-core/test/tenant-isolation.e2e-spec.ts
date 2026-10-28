import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { UserRole } from "@rajtantra/common-types";
import { env } from "../src/config/env.config";

describe("TenantIsolation (e2e)", () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const mockPrismaService = {
    isHealthy: jest.fn().mockResolvedValue(true),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    organization: {
      findUnique: jest.fn(),
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

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /api/v1/organizations/current - 401 Unauthorized without Bearer token", async () => {
    await request(app.getHttpServer())
      .get("/api/v1/organizations/current")
      .expect(401);
  });

  it("GET /api/v1/organizations/current - 200 OK for authenticated Candidate Admin with own org", async () => {
    const token = await jwtService.signAsync(
      {
        sub: "user-001",
        email: "candidate@rajtantra.in",
        phone: "+919876543212",
        role: UserRole.CANDIDATE_ADMIN,
        organizationId: "org-kasba-01",
        hasAiSeat: true,
      },
      { secret: env.JWT_ACCESS_SECRET },
    );

    mockPrismaService.organization.findUnique.mockResolvedValue({
      id: "org-kasba-01",
      name: "Kasba Peth War Room",
      slug: "kasba-peth-war-room",
      status: "ACTIVE",
      planType: "ELECTION_MODULE",
      hasAiMode: true,
      aiSeatsLimit: 5,
      state: "Maharashtra",
      district: "Pune",
      constituencyName: "Kasba Peth",
      electionType: "VIDHAN_SABHA",
      pollingDate: new Date("2026-11-20"),
      createdAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .get("/api/v1/organizations/current")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe("org-kasba-01");
  });

  it("GET /api/v1/organizations/:organizationId - 403 Forbidden when attempting cross-tenant access", async () => {
    // User belongs to org-kasba-01
    const token = await jwtService.signAsync(
      {
        sub: "user-001",
        email: "candidate@rajtantra.in",
        phone: "+919876543212",
        role: UserRole.CANDIDATE_ADMIN,
        organizationId: "org-kasba-01",
        hasAiSeat: true,
      },
      { secret: env.JWT_ACCESS_SECRET },
    );

    // Tries to access org-kothrud-999
    const response = await request(app.getHttpServer())
      .get("/api/v1/organizations/org-kothrud-999")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain(
      "Cross-tenant data access is strictly prohibited",
    );
  });
});
