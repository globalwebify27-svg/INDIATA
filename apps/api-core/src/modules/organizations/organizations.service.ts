import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
  planType: string;
  hasAiMode: boolean;
  aiSeatsLimit: number;
  state: string;
  district: string;
  constituencyName: string;
  electionType: string;
  pollingDate: Date | null;
  createdAt: Date;
}

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(organizationId: string): Promise<OrganizationSummary> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      status: org.status,
      planType: org.planType,
      hasAiMode: org.hasAiMode,
      aiSeatsLimit: org.aiSeatsLimit,
      state: org.state,
      district: org.district,
      constituencyName: org.constituencyName,
      electionType: org.electionType,
      pollingDate: org.pollingDate,
      createdAt: org.createdAt,
    };
  }
}
