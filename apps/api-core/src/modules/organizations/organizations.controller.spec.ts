import { OrganizationsController } from "./organizations.controller";
import {
  OrganizationsService,
  OrganizationSummary,
} from "./organizations.service";

describe("OrganizationsController", () => {
  let controller: OrganizationsController;
  let service: jest.Mocked<OrganizationsService>;

  beforeEach(() => {
    service = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<OrganizationsService>;

    controller = new OrganizationsController(service);
  });

  const mockOrg: OrganizationSummary = {
    id: "org-kasba-01",
    name: "Kasba Peth War Room",
    slug: "kasba-peth-war-room",
    status: "ACTIVE",
    planType: "ELECTION_MODULE",
    hasAiMode: true,
    aiSeatsLimit: 5,
    state: "Maharashtra",
    district: "Pune",
    constituencyName: "215 - Kasba Peth",
    electionType: "VIDHAN_SABHA",
    pollingDate: new Date("2026-11-20"),
    createdAt: new Date(),
  };

  it("getCurrentOrganization should retrieve current tenant organization", async () => {
    service.findById.mockResolvedValue(mockOrg);
    const result = await controller.getCurrentOrganization("org-kasba-01");
    expect(result).toEqual(mockOrg);
    expect(service.findById).toHaveBeenCalledWith("org-kasba-01");
  });

  it("getOrganizationById should retrieve specified organization for authorized roles", async () => {
    service.findById.mockResolvedValue(mockOrg);
    const result = await controller.getOrganizationById("org-kasba-01");
    expect(result).toEqual(mockOrg);
    expect(service.findById).toHaveBeenCalledWith("org-kasba-01");
  });
});
