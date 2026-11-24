import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  AuthenticatedUser,
  UserRole,
  VoterQueryDto,
  CreateVoterDto,
  UpdateVoterDto,
  UpdateVoterClassificationDto,
  UpdateVoterTurnoutDto,
  BulkImportVoterDto,
  VoterClassification,
} from "@rajtantra/common-types";
import { Prisma } from "@prisma/client";

export interface VoterStatsSummary {
  totalElectors: number;
  supportersCount: number;
  opponentsCount: number;
  doubtfulCount: number;
  neutralCount: number;
  visitedCount: number;
  votedCount: number;
  maleCount: number;
  femaleCount: number;
  keyInfluencersCount: number;
  reachPercentage: number;
  turnoutPercentage: number;
}

@Injectable()
export class VotersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves the target organization tenancy for the calling user.
   */
  private async resolveTargetOrgId(
    user: AuthenticatedUser,
    explicitTenantId?: string,
  ): Promise<string> {
    if (user.role === UserRole.SUPER_ADMIN) {
      if (explicitTenantId) return explicitTenantId;
      // Default to the first active organization for global review
      const firstOrg = await this.prisma.organization.findFirst({
        where: { status: "ACTIVE" },
        select: { id: true },
      });
      if (!firstOrg) {
        throw new BadRequestException("No active organization found on platform.");
      }
      return firstOrg.id;
    }

    if (!user.organizationId) {
      throw new ForbiddenException("User does not belong to any active election organization.");
    }

    return user.organizationId;
  }

  /**
   * Resolves booth scope if user is Karyakarta.
   */
  private async resolveKaryakartaBooths(user: AuthenticatedUser): Promise<string[] | null> {
    if (user.role !== UserRole.KARYAKARTA) return null;

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { assignedBooths: true },
    });

    if (!dbUser || !dbUser.assignedBooths) return [];

    return dbUser.assignedBooths
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
  }

  /**
   * Search and paginated filtering of voters.
   */
  async findAll(
    user: AuthenticatedUser,
    query: VoterQueryDto,
    explicitTenantId?: string,
  ) {
    const orgId = await this.resolveTargetOrgId(user, explicitTenantId);
    const karyakartaBooths = await this.resolveKaryakartaBooths(user);

    const where: Prisma.VoterWhereInput = {
      organizationId: orgId,
    };

    // Scoping to assigned booths for field karyakartas
    if (karyakartaBooths !== null) {
      where.boothNumber = { in: karyakartaBooths };
    } else if (query.boothNumber) {
      where.boothNumber = query.boothNumber;
    }

    if (query.boothId) {
      where.boothId = query.boothId;
    }

    // Search query term (Name, Marathi, EPIC ID, Phone, House No)
    if (query.q && query.q.trim()) {
      const term = query.q.trim();
      where.OR = [
        { name: { contains: term } },
        { marathiName: { contains: term } },
        { epicId: { contains: term } },
        { phone: { contains: term } },
        { houseNo: { contains: term } },
        { relativeName: { contains: term } },
        { buildingChawl: { contains: term } },
      ];
    }

    // Political Leaning / Classification Filter
    if (query.classification) {
      where.classification = query.classification as VoterClassification;
    }

    // Gender Filter
    if (query.gender) {
      const g = query.gender.toUpperCase().charAt(0);
      where.gender = { startsWith: g };
    }

    // Age Range Filter
    if (query.minAge !== undefined || query.maxAge !== undefined) {
      where.age = {};
      if (query.minAge !== undefined) where.age.gte = query.minAge;
      if (query.maxAge !== undefined) where.age.lte = query.maxAge;
    }

    // Operational Status Filters
    if (query.isVisited !== undefined) where.isVisited = query.isVisited;
    if (query.isVoted !== undefined) where.isVoted = query.isVoted;
    if (query.isKeyInfluencer !== undefined) where.isKeyInfluencer = query.isKeyInfluencer;
    if (query.isImportant !== undefined) where.isImportant = query.isImportant;
    if (query.isFavourite !== undefined) where.isFavourite = query.isFavourite;
    if (query.familyId) where.familyId = query.familyId;

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const sortOrder: Prisma.SortOrder = query.sortOrder === "desc" ? "desc" : "asc";
    const orderBy: Prisma.VoterOrderByWithRelationInput = {
      [query.sortBy || "serialNumber"]: sortOrder,
    };

    const [voters, totalRecords] = await Promise.all([
      this.prisma.voter.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.voter.count({ where }),
    ]);

    return {
      voters,
      meta: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  }

  /**
   * Statistical summary aggregates for dashboard vitals cards.
   */
  async getStats(
    user: AuthenticatedUser,
    explicitTenantId?: string,
  ): Promise<VoterStatsSummary> {
    const orgId = await this.resolveTargetOrgId(user, explicitTenantId);
    const karyakartaBooths = await this.resolveKaryakartaBooths(user);

    const baseWhere: Prisma.VoterWhereInput = {
      organizationId: orgId,
    };

    if (karyakartaBooths !== null) {
      baseWhere.boothNumber = { in: karyakartaBooths };
    }

    const [
      totalElectors,
      supportersCount,
      opponentsCount,
      doubtfulCount,
      neutralCount,
      visitedCount,
      votedCount,
      maleCount,
      femaleCount,
      keyInfluencersCount,
    ] = await Promise.all([
      this.prisma.voter.count({ where: baseWhere }),
      this.prisma.voter.count({ where: { ...baseWhere, classification: "SUPPORTER" } }),
      this.prisma.voter.count({ where: { ...baseWhere, classification: "OPPONENT" } }),
      this.prisma.voter.count({ where: { ...baseWhere, classification: "DOUBTFUL" } }),
      this.prisma.voter.count({ where: { ...baseWhere, classification: "NEUTRAL" } }),
      this.prisma.voter.count({ where: { ...baseWhere, isVisited: true } }),
      this.prisma.voter.count({ where: { ...baseWhere, isVoted: true } }),
      this.prisma.voter.count({ where: { ...baseWhere, gender: { in: ["M", "MALE", "m"] } } }),
      this.prisma.voter.count({ where: { ...baseWhere, gender: { in: ["F", "FEMALE", "f"] } } }),
      this.prisma.voter.count({ where: { ...baseWhere, isKeyInfluencer: true } }),
    ]);

    const reachPercentage =
      totalElectors > 0 ? Math.round((visitedCount / totalElectors) * 100) : 0;
    const turnoutPercentage =
      totalElectors > 0 ? Math.round((votedCount / totalElectors) * 100) : 0;

    return {
      totalElectors,
      supportersCount,
      opponentsCount,
      doubtfulCount,
      neutralCount,
      visitedCount,
      votedCount,
      maleCount,
      femaleCount,
      keyInfluencersCount,
      reachPercentage,
      turnoutPercentage,
    };
  }

  /**
   * Comprehensive 9-section elector dossier with household members & tickets.
   */
  async findById(
    id: string,
    user: AuthenticatedUser,
    explicitTenantId?: string,
  ) {
    const orgId = await this.resolveTargetOrgId(user, explicitTenantId);

    const voter = await this.prisma.voter.findFirst({
      where: { id, organizationId: orgId },
      include: {
        booth: true,
        tickets: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!voter) {
      throw new NotFoundException(`Voter record with ID '${id}' not found.`);
    }

    // Fetch related household electors living in the same family dwelling
    let householdMembers: any[] = [];
    if (voter.familyId) {
      householdMembers = await this.prisma.voter.findMany({
        where: {
          organizationId: orgId,
          familyId: voter.familyId,
          id: { not: voter.id },
        },
        select: {
          id: true,
          name: true,
          marathiName: true,
          relation: true,
          age: true,
          gender: true,
          epicId: true,
          classification: true,
          isVoted: true,
          isVisited: true,
        },
      });
    }

    return {
      ...voter,
      householdMembers,
    };
  }

  /**
   * Create a single voter record.
   */
  async create(
    dto: CreateVoterDto,
    user: AuthenticatedUser,
    explicitTenantId?: string,
  ) {
    const orgId = await this.resolveTargetOrgId(user, explicitTenantId);

    const data: Prisma.VoterCreateInput = {
      name: dto.name,
      marathiName: dto.marathiName,
      relativeName: dto.relativeName,
      relation: dto.relation,
      epicId: dto.epicId,
      serialNumber: dto.serialNumber,
      age: dto.age,
      gender: dto.gender,
      dob: dto.dob,
      phone: dto.phone,
      whatsapp: dto.whatsapp,
      email: dto.email || undefined,
      houseNo: dto.houseNo,
      buildingChawl: dto.buildingChawl,
      street: dto.street,
      area: dto.area,
      landmark: dto.landmark,
      address: dto.address,
      village: dto.village,
      ward: dto.ward,
      prabhaag: dto.prabhaag,
      pincode: dto.pincode,
      caste: dto.caste,
      subCaste: dto.subCaste,
      communityGroup: dto.communityGroup,
      primaryLanguage: dto.primaryLanguage || "Marathi",
      occupation: dto.occupation,
      qualification: dto.qualification,
      classification: dto.classification as VoterClassification,
      isKeyInfluencer: dto.isKeyInfluencer || false,
      isImportant: dto.isImportant || false,
      isFavourite: dto.isFavourite || false,
      votingLikelihoodPct: dto.votingLikelihoodPct || 80,
      strategyNotes: dto.strategyNotes,
      remarks: dto.remarks,
      familyId: dto.familyId,
      familyHead: dto.familyHead || false,
      familyMembersCount: dto.familyMembersCount || 1,
      isVisited: dto.isVisited || false,
      lastVisitDate: dto.lastVisitDate,
      scheme: dto.scheme,
      demand: dto.demand,
      candidateHelp: dto.candidateHelp,
      boothNumber: dto.boothNumber,
      boothName: dto.boothName,
      electoralPart: dto.electoralPart,
      organization: { connect: { id: orgId } },
      createdBy: { connect: { id: user.id } },
    };

    if (dto.boothId) {
      data.booth = { connect: { id: dto.boothId } };
    }

    if (dto.assignedKaryakartaId) {
      data.assignedKaryakarta = { connect: { id: dto.assignedKaryakartaId } };
    }

    return this.prisma.voter.create({ data });
  }

  /**
   * Update arbitrary voter demographic or operational attributes.
   */
  async update(
    id: string,
    dto: UpdateVoterDto,
    user: AuthenticatedUser,
    explicitTenantId?: string,
  ) {
    const orgId = await this.resolveTargetOrgId(user, explicitTenantId);

    const existing = await this.prisma.voter.findFirst({
      where: { id, organizationId: orgId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Voter record with ID '${id}' not found.`);
    }

    const data: Prisma.VoterUpdateInput = {
      ...dto,
      classification: dto.classification
        ? (dto.classification as VoterClassification)
        : undefined,
    };

    delete (data as any).boothId;
    delete (data as any).assignedKaryakartaId;

    if (dto.boothId) {
      data.booth = { connect: { id: dto.boothId } };
    }

    if (dto.assignedKaryakartaId) {
      data.assignedKaryakarta = { connect: { id: dto.assignedKaryakartaId } };
    }

    return this.prisma.voter.update({
      where: { id },
      data,
    });
  }

  /**
   * Fast 1-click sentiment / classification update.
   */
  async updateClassification(
    id: string,
    dto: UpdateVoterClassificationDto,
    user: AuthenticatedUser,
    explicitTenantId?: string,
  ) {
    const orgId = await this.resolveTargetOrgId(user, explicitTenantId);

    const existing = await this.prisma.voter.findFirst({
      where: { id, organizationId: orgId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Voter record with ID '${id}' not found.`);
    }

    return this.prisma.voter.update({
      where: { id },
      data: {
        classification: dto.classification as VoterClassification,
        remarks: dto.remarks || undefined,
      },
    });
  }

  /**
   * Fast 1-click election-day turnout marking (LPIANE).
   */
  async updateTurnout(
    id: string,
    dto: UpdateVoterTurnoutDto,
    user: AuthenticatedUser,
    explicitTenantId?: string,
  ) {
    const orgId = await this.resolveTargetOrgId(user, explicitTenantId);

    const existing = await this.prisma.voter.findFirst({
      where: { id, organizationId: orgId },
      select: { id: true, isVoted: true },
    });

    if (!existing) {
      throw new NotFoundException(`Voter record with ID '${id}' not found.`);
    }

    return this.prisma.voter.update({
      where: { id },
      data: {
        isVoted: dto.isVoted,
        votedAt: dto.isVoted
          ? dto.votedAt || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : null,
        votedBy: dto.isVoted ? dto.votedBy || user.name : null,
      },
    });
  }

  /**
   * Bulk import of voters (from parsed CSV / Excel).
   */
  async bulkImport(
    dto: BulkImportVoterDto,
    user: AuthenticatedUser,
    explicitTenantId?: string,
  ) {
    const orgId = await this.resolveTargetOrgId(user, explicitTenantId);

    const rows = dto.voters.map((v) => ({
      ...v,
      organizationId: orgId,
      createdById: user.id,
      classification: v.classification as VoterClassification,
      primaryLanguage: v.primaryLanguage || "Marathi",
    }));

    const result = await this.prisma.voter.createMany({
      data: rows as any,
      skipDuplicates: true,
    });

    return {
      importedCount: result.count,
      totalSubmitted: dto.voters.length,
      message: `Successfully imported ${result.count} voter records into constituency registry.`,
    };
  }
}
