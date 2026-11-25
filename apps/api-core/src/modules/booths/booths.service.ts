import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  BoothGrade,
  BoothSupportLevel,
  BloStatus,
  BoothQueryDto,
  CreateBoothDto,
  UpdateBoothDto,
  CreateKaryakartaDto,
  UpdateBloOfficerDto,
} from "@rajtantra/common-types";

export interface BoothScoreResult {
  score: number;
  grade: BoothGrade;
  supportLevel: BoothSupportLevel;
  isSwing: boolean;
  isVulnerable: boolean;
}

export function calculateBoothScore(params: {
  projectedTurnout: number;
  slipsPercent: number;
  karyakartasCount: number;
  lastTurnout?: number;
  supporterRatio?: number;
}): BoothScoreResult {
  const turnoutScore = (Math.min(Math.max(params.projectedTurnout, 0), 100) / 100) * 35;
  const slipsScore = (Math.min(Math.max(params.slipsPercent, 0), 100) / 100) * 30;
  const karyakartaScore = Math.min(params.karyakartasCount / 5, 1) * 20;
  const lastTurnoutScore = ((params.lastTurnout ?? params.projectedTurnout) / 100) * 15;

  const totalScore = Math.round(turnoutScore + slipsScore + karyakartaScore + lastTurnoutScore);

  let grade: BoothGrade;
  if (totalScore >= 75) {
    grade = BoothGrade.A;
  } else if (totalScore >= 60) {
    grade = BoothGrade.B;
  } else if (totalScore >= 45) {
    grade = BoothGrade.C;
  } else {
    grade = BoothGrade.D;
  }

  const supportLevel: BoothSupportLevel =
    params.supporterRatio && params.supporterRatio >= 60
      ? BoothSupportLevel.HIGH
      : params.supporterRatio && params.supporterRatio < 40
      ? BoothSupportLevel.LOW
      : totalScore >= 70
      ? BoothSupportLevel.HIGH
      : totalScore >= 50
      ? BoothSupportLevel.MEDIUM
      : BoothSupportLevel.LOW;

  const isSwing = totalScore >= 55 && totalScore <= 72;
  const isVulnerable = totalScore < 55 || params.karyakartasCount < 2;

  return {
    score: totalScore,
    grade,
    supportLevel,
    isSwing,
    isVulnerable,
  };
}

@Injectable()
export class BoothsService {
  private readonly logger = new Logger(BoothsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper to parse comma-separated or JSON assigned booths string
   */
  private parseAssignedBooths(assigned?: string | null): string[] {
    if (!assigned) return [];
    try {
      const parsed = JSON.parse(assigned);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    return assigned
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
  }

  /**
   * Helper to serialize booth numbers array into comma-separated string
   */
  private serializeAssignedBooths(booths: string[]): string {
    return Array.from(new Set(booths.map((b) => b.trim()).filter(Boolean))).join(",");
  }

  // ===========================================================================
  // 1. BOOTH LIST & PAGINATION
  // ===========================================================================
  async findAll(tenantId: string, query: BoothQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      grade,
      locality,
      minTurnout,
      maxTurnout,
      sortBy = "boothNumber",
      sortOrder = "asc",
    } = query;

    const where: any = {
      organizationId: tenantId,
    };

    if (search) {
      where.OR = [
        { boothNumber: { contains: search } },
        { boothName: { contains: search } },
        { locality: { contains: search } },
        { pollingCentre: { contains: search } },
        { bloName: { contains: search } },
      ];
    }

    if (locality) {
      where.locality = { contains: locality };
    }

    if (minTurnout !== undefined || maxTurnout !== undefined) {
      where.projectedTurnout = {};
      if (minTurnout !== undefined) where.projectedTurnout.gte = minTurnout;
      if (maxTurnout !== undefined) where.projectedTurnout.lte = maxTurnout;
    }

    // Retrieve all matching booths for score calculation and potential grade filtering
    const allMatching = await this.prisma.pollingBooth.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: {
            voters: true,
          },
        },
      },
    });

    // Enrich booths with dynamic score and grade calculation
    const enriched = allMatching.map((b) => {
      const projected = Number(b.projectedTurnout ?? 65);
      const last = Number(b.lastTurnout ?? 60);
      const scoring = calculateBoothScore({
        projectedTurnout: projected,
        slipsPercent: b.slipsPercent,
        karyakartasCount: b.karyakartasCount,
        lastTurnout: last,
      });

      return {
        id: b.id,
        boothNumber: b.boothNumber,
        boothName: b.boothName,
        locality: b.locality,
        partNumber: b.partNumber,
        pollingCentre: b.pollingCentre,
        pollingAddress: b.pollingAddress,
        latitude: b.latitude ? Number(b.latitude) : null,
        longitude: b.longitude ? Number(b.longitude) : null,
        googleMapsUrl: b.googleMapsUrl,
        totalVoters: b.totalVoters,
        maleVoters: b.maleVoters,
        femaleVoters: b.femaleVoters,
        actualRegisteredVoters: b._count.voters,
        bloName: b.bloName,
        bloPhone: b.bloPhone,
        karyakartasCount: b.karyakartasCount,
        slipsPercent: b.slipsPercent,
        projectedTurnout: projected,
        lastTurnout: last,
        score: scoring.score,
        grade: scoring.grade,
        supportLevel: scoring.supportLevel,
        isSwing: scoring.isSwing,
        isVulnerable: scoring.isVulnerable,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      };
    });

    // If grade filter was supplied, filter in-memory by computed grade
    const filteredByGrade = grade
      ? enriched.filter((b) => b.grade === grade)
      : enriched;

    const totalRecords = filteredByGrade.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedBooths = filteredByGrade.slice(startIndex, startIndex + limit);

    return {
      booths: paginatedBooths,
      meta: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }

  // ===========================================================================
  // 2. BOOTH AGGREGATE VITALS & SUMMARY
  // ===========================================================================
  async getStats(tenantId: string) {
    const booths = await this.prisma.pollingBooth.findMany({
      where: { organizationId: tenantId },
    });

    const totalBooths = booths.length;
    let totalVoters = 0;
    let totalMaleVoters = 0;
    let totalFemaleVoters = 0;
    let sumTurnout = 0;
    let sumSlips = 0;
    let blosCount = 0;

    const gradeBreakdown = {
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      gradeD: 0,
    };

    for (const b of booths) {
      totalVoters += b.totalVoters;
      totalMaleVoters += b.maleVoters;
      totalFemaleVoters += b.femaleVoters;
      const turnout = Number(b.projectedTurnout ?? 0);
      sumTurnout += turnout;
      sumSlips += b.slipsPercent;
      if (b.bloName && b.bloPhone) blosCount++;

      const scoring = calculateBoothScore({
        projectedTurnout: turnout,
        slipsPercent: b.slipsPercent,
        karyakartasCount: b.karyakartasCount,
        lastTurnout: Number(b.lastTurnout ?? turnout),
      });

      if (scoring.grade === BoothGrade.A) gradeBreakdown.gradeA++;
      else if (scoring.grade === BoothGrade.B) gradeBreakdown.gradeB++;
      else if (scoring.grade === BoothGrade.C) gradeBreakdown.gradeC++;
      else gradeBreakdown.gradeD++;
    }

    // Count unique assigned karyakartas
    const karyakartas = await this.prisma.user.findMany({
      where: {
        organizationId: tenantId,
        role: "KARYAKARTA",
      },
      select: { assignedBooths: true },
    });

    const activeAssignedCount = karyakartas.filter((k) => {
      const assigned = this.parseAssignedBooths(k.assignedBooths);
      return assigned.length > 0;
    }).length;

    return {
      totalBooths,
      totalVoters,
      totalMaleVoters,
      totalFemaleVoters,
      gradeBreakdown,
      averageTurnout: totalBooths > 0 ? Number((sumTurnout / totalBooths).toFixed(1)) : 0,
      averageSlipsDeliveredPct: totalBooths > 0 ? Math.round(sumSlips / totalBooths) : 0,
      totalKaryakartasCount: karyakartas.length,
      assignedKaryakartasCount: activeAssignedCount,
      bloCoveragePct: totalBooths > 0 ? Math.round((blosCount / totalBooths) * 100) : 0,
    };
  }

  // ===========================================================================
  // 3. SINGLE BOOTH DETAIL
  // ===========================================================================
  async findById(tenantId: string, idOrNumber: string) {
    const booth = await this.prisma.pollingBooth.findFirst({
      where: {
        organizationId: tenantId,
        OR: [{ id: idOrNumber }, { boothNumber: idOrNumber }],
      },
      include: {
        hourlyLogs: {
          orderBy: { recordedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!booth) {
      throw new NotFoundException(`Polling booth '${idOrNumber}' not found in this organization`);
    }

    // Find assigned karyakartas for this booth
    const allCadre = await this.prisma.user.findMany({
      where: {
        organizationId: tenantId,
        role: "KARYAKARTA",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        activationKey: true,
        assignedBooths: true,
      },
    });

    const assignedKaryakartas = allCadre
      .filter((k) => {
        const booths = this.parseAssignedBooths(k.assignedBooths);
        return booths.includes(booth.boothNumber);
      })
      .map((k) => ({
        id: k.id,
        name: k.name,
        phone: k.phone,
        status: k.status,
        activationKey: k.activationKey,
      }));

    // Calculate voter stance distribution in this booth
    const stanceCounts = await this.prisma.voter.groupBy({
      by: ["classification"],
      where: {
        organizationId: tenantId,
        boothNumber: booth.boothNumber,
      },
      _count: {
        id: true,
      },
    });

    const classificationBreakdown: Record<string, number> = {
      SUPPORTER: 0,
      OPPONENT: 0,
      DOUBTFUL: 0,
      NEUTRAL: 0,
      UNDECIDED: 0,
    };

    let totalRecordedVoters = 0;
    for (const item of stanceCounts) {
      classificationBreakdown[item.classification] = item._count.id;
      totalRecordedVoters += item._count.id;
    }

    const supporterRatio =
      totalRecordedVoters > 0
        ? Math.round(((classificationBreakdown.SUPPORTER ?? 0) / totalRecordedVoters) * 100)
        : undefined;

    const scoring = calculateBoothScore({
      projectedTurnout: Number(booth.projectedTurnout ?? 65),
      slipsPercent: booth.slipsPercent,
      karyakartasCount: assignedKaryakartas.length || booth.karyakartasCount,
      lastTurnout: Number(booth.lastTurnout ?? 60),
      supporterRatio,
    });

    return {
      ...booth,
      latitude: booth.latitude ? Number(booth.latitude) : null,
      longitude: booth.longitude ? Number(booth.longitude) : null,
      projectedTurnout: booth.projectedTurnout ? Number(booth.projectedTurnout) : null,
      lastTurnout: booth.lastTurnout ? Number(booth.lastTurnout) : null,
      score: scoring.score,
      grade: scoring.grade,
      supportLevel: scoring.supportLevel,
      isSwing: scoring.isSwing,
      isVulnerable: scoring.isVulnerable,
      assignedKaryakartas,
      classificationBreakdown,
      totalVotersInRoll: totalRecordedVoters,
    };
  }

  // ===========================================================================
  // 4. CREATE BOOTH
  // ===========================================================================
  async create(tenantId: string, dto: CreateBoothDto) {
    const existing = await this.prisma.pollingBooth.findUnique({
      where: {
        organizationId_boothNumber: {
          organizationId: tenantId,
          boothNumber: dto.boothNumber,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Booth #${dto.boothNumber} already exists in this constituency war room`
      );
    }

    const created = await this.prisma.pollingBooth.create({
      data: {
        ...dto,
        organizationId: tenantId,
      },
    });

    this.logger.log(`Created polling booth #${created.boothNumber} for tenant ${tenantId}`);

    const scoring = calculateBoothScore({
      projectedTurnout: Number(created.projectedTurnout ?? 65),
      slipsPercent: created.slipsPercent,
      karyakartasCount: created.karyakartasCount,
      lastTurnout: Number(created.lastTurnout ?? 60),
    });

    return {
      ...created,
      latitude: created.latitude ? Number(created.latitude) : null,
      longitude: created.longitude ? Number(created.longitude) : null,
      projectedTurnout: created.projectedTurnout ? Number(created.projectedTurnout) : null,
      lastTurnout: created.lastTurnout ? Number(created.lastTurnout) : null,
      score: scoring.score,
      grade: scoring.grade,
      supportLevel: scoring.supportLevel,
      isSwing: scoring.isSwing,
      isVulnerable: scoring.isVulnerable,
    };
  }

  // ===========================================================================
  // 5. UPDATE BOOTH
  // ===========================================================================
  async update(tenantId: string, id: string, dto: UpdateBoothDto) {
    const existing = await this.prisma.pollingBooth.findFirst({
      where: { id, organizationId: tenantId },
    });

    if (!existing) {
      throw new NotFoundException(`Polling booth '${id}' not found in this organization`);
    }

    if (dto.boothNumber && dto.boothNumber !== existing.boothNumber) {
      const collision = await this.prisma.pollingBooth.findUnique({
        where: {
          organizationId_boothNumber: {
            organizationId: tenantId,
            boothNumber: dto.boothNumber,
          },
        },
      });
      if (collision) {
        throw new ConflictException(
          `Cannot rename booth: Booth #${dto.boothNumber} already exists`
        );
      }
    }

    const updated = await this.prisma.pollingBooth.update({
      where: { id: existing.id },
      data: dto,
    });

    this.logger.log(`Updated polling booth #${updated.boothNumber}`);

    const scoring = calculateBoothScore({
      projectedTurnout: Number(updated.projectedTurnout ?? 65),
      slipsPercent: updated.slipsPercent,
      karyakartasCount: updated.karyakartasCount,
      lastTurnout: Number(updated.lastTurnout ?? 60),
    });

    return {
      ...updated,
      latitude: updated.latitude ? Number(updated.latitude) : null,
      longitude: updated.longitude ? Number(updated.longitude) : null,
      projectedTurnout: updated.projectedTurnout ? Number(updated.projectedTurnout) : null,
      lastTurnout: updated.lastTurnout ? Number(updated.lastTurnout) : null,
      score: scoring.score,
      grade: scoring.grade,
      supportLevel: scoring.supportLevel,
      isSwing: scoring.isSwing,
      isVulnerable: scoring.isVulnerable,
    };
  }

  // ===========================================================================
  // 6. DELETE BOOTH
  // ===========================================================================
  async delete(tenantId: string, id: string) {
    const existing = await this.prisma.pollingBooth.findFirst({
      where: { id, organizationId: tenantId },
    });

    if (!existing) {
      throw new NotFoundException(`Polling booth '${id}' not found in this organization`);
    }

    const registeredVoters = await this.prisma.voter.count({
      where: { organizationId: tenantId, boothId: existing.id },
    });

    if (registeredVoters > 0) {
      throw new BadRequestException(
        `Cannot delete Booth #${existing.boothNumber}: It has ${registeredVoters} registered voters assigned. Please reassign voters first.`
      );
    }

    await this.prisma.pollingBooth.delete({
      where: { id: existing.id },
    });

    this.logger.log(`Deleted polling booth #${existing.boothNumber}`);
    return {
      success: true,
      message: `Polling Booth #${existing.boothNumber} deleted successfully`,
    };
  }

  // ===========================================================================
  // 7. KARYAKARTA WORKFORCE OPERATIONS
  // ===========================================================================
  async getWorkforce(tenantId: string, query?: { search?: string; boothNumber?: string }) {
    const where: any = {
      organizationId: tenantId,
      role: "KARYAKARTA",
    };

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search } },
        { phone: { contains: query.search } },
        { activationKey: { contains: query.search } },
      ];
    }

    const cadre = await this.prisma.user.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            assignedVoters: true,
            surveysConducted: true,
            slipsDispatched: true,
          },
        },
      },
    });

    const mapped = cadre.map((k) => {
      const assigned = this.parseAssignedBooths(k.assignedBooths);
      return {
        id: k.id,
        name: k.name,
        phone: k.phone,
        status: k.status,
        activationKey: k.activationKey,
        reactivationKey: k.reactivationKey,
        assignedBooths: assigned,
        votersAssignedCount: k._count.assignedVoters,
        surveysCompletedCount: k._count.surveysConducted,
        slipsDispatchedCount: k._count.slipsDispatched,
        joinedDate: k.createdAt,
      };
    });

    if (query?.boothNumber) {
      return mapped.filter((k) => k.assignedBooths.includes(query.boothNumber!));
    }

    return mapped;
  }

  async createKaryakarta(tenantId: string, dto: CreateKaryakartaDto) {
    const existing = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existing) {
      throw new ConflictException(
        `User with phone number ${dto.phone} already exists in the system`
      );
    }

    // Generate activation key if not supplied e.g. "KAS" + 3 random digits
    const activationKey =
      dto.activationKey || `KAS${Math.floor(100 + Math.random() * 900)}`;

    const assignedBoothsString = this.serializeAssignedBooths(dto.assignedBooths);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        role: "KARYAKARTA",
        status: "ACTIVE",
        organizationId: tenantId,
        activationKey,
        assignedBooths: assignedBoothsString,
      },
    });

    // Assign Role & Portal
    const karyakartaRole = await this.prisma.roleDefinition.findUnique({
      where: { code: "KARYAKARTA" },
    });
    if (karyakartaRole) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: karyakartaRole.id },
      });
    }

    const karyakartaPortal = await this.prisma.portal.findUnique({
      where: { key: "KARYAKARTA_FIELD" },
    });
    if (karyakartaPortal) {
      await this.prisma.portalAssignment.create({
        data: { userId: user.id, portalId: karyakartaPortal.id, isDefault: true },
      });
    }

    // Update booth karyakarta counts
    for (const bNum of dto.assignedBooths) {
      await this.prisma.pollingBooth.updateMany({
        where: { organizationId: tenantId, boothNumber: bNum },
        data: { karyakartasCount: { increment: 1 } },
      });
    }

    this.logger.log(`Created Karyakarta ${user.name} (${user.phone}) with key ${activationKey}`);

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      activationKey: user.activationKey,
      assignedBooths: dto.assignedBooths,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  async assignKaryakartasToBooth(
    tenantId: string,
    boothNumber: string,
    karyakartaIds: string[]
  ) {
    const booth = await this.prisma.pollingBooth.findUnique({
      where: {
        organizationId_boothNumber: {
          organizationId: tenantId,
          boothNumber,
        },
      },
    });

    if (!booth) {
      throw new NotFoundException(`Booth #${boothNumber} not found in this organization`);
    }

    let newlyAssignedCount = 0;

    for (const kId of karyakartaIds) {
      const user = await this.prisma.user.findFirst({
        where: { id: kId, organizationId: tenantId, role: "KARYAKARTA" },
      });

      if (!user) continue;

      const currentBooths = this.parseAssignedBooths(user.assignedBooths);
      if (!currentBooths.includes(boothNumber)) {
        currentBooths.push(boothNumber);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { assignedBooths: this.serializeAssignedBooths(currentBooths) },
        });
        newlyAssignedCount++;
      }
    }

    // Refresh actual karyakarta count on the booth
    const allCadre = await this.prisma.user.findMany({
      where: { organizationId: tenantId, role: "KARYAKARTA" },
      select: { assignedBooths: true },
    });

    const activeCount = allCadre.filter((k) =>
      this.parseAssignedBooths(k.assignedBooths).includes(boothNumber)
    ).length;

    await this.prisma.pollingBooth.update({
      where: { id: booth.id },
      data: { karyakartasCount: activeCount },
    });

    this.logger.log(`Assigned ${newlyAssignedCount} karyakarta(s) to Booth #${boothNumber}`);

    return {
      success: true,
      boothNumber,
      totalKaryakartasNow: activeCount,
      newlyAssignedCount,
    };
  }

  async unassignKaryakartaFromBooth(
    tenantId: string,
    boothNumber: string,
    karyakartaId: string
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: karyakartaId, organizationId: tenantId, role: "KARYAKARTA" },
    });

    if (!user) {
      throw new NotFoundException(`Karyakarta '${karyakartaId}' not found in this organization`);
    }

    const currentBooths = this.parseAssignedBooths(user.assignedBooths);
    const updatedBooths = currentBooths.filter((b) => b !== boothNumber);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { assignedBooths: this.serializeAssignedBooths(updatedBooths) },
    });

    // Update booth count
    const allCadre = await this.prisma.user.findMany({
      where: { organizationId: tenantId, role: "KARYAKARTA" },
      select: { assignedBooths: true },
    });

    const activeCount = allCadre.filter((k) =>
      this.parseAssignedBooths(k.assignedBooths).includes(boothNumber)
    ).length;

    await this.prisma.pollingBooth.updateMany({
      where: { organizationId: tenantId, boothNumber },
      data: { karyakartasCount: activeCount },
    });

    this.logger.log(`Unassigned Karyakarta ${user.name} from Booth #${boothNumber}`);

    return {
      success: true,
      boothNumber,
      karyakartaId,
      totalKaryakartasNow: activeCount,
    };
  }

  // ===========================================================================
  // 8. BLO (BOOTH LEVEL OFFICER) DIRECTORY OPERATIONS
  // ===========================================================================
  async getBloDirectory(tenantId: string, query?: { search?: string }) {
    const org = await this.prisma.organization.findUnique({
      where: { id: tenantId },
      select: { constituencyName: true },
    });

    const where: any = {
      organizationId: tenantId,
      bloName: { not: null },
    };

    if (query?.search) {
      where.OR = [
        { bloName: { contains: query.search } },
        { bloPhone: { contains: query.search } },
        { boothNumber: { contains: query.search } },
        { pollingCentre: { contains: query.search } },
      ];
    }

    const booths = await this.prisma.pollingBooth.findMany({
      where,
      orderBy: { boothNumber: "asc" },
    });

    return booths.map((b) => ({
      id: `blo-${b.boothNumber}`,
      boothId: b.id,
      boothNumber: b.boothNumber,
      name: b.bloName ?? "Not Assigned",
      phone: b.bloPhone ?? "N/A",
      pollingStation: b.boothName,
      pollingCentre: b.pollingCentre,
      pollingAddress: b.pollingAddress,
      constituency: org?.constituencyName ?? "Constituency",
      status: BloStatus.ACTIVE,
      lastVerifiedDate: b.updatedAt.toISOString().split("T")[0],
    }));
  }

  async updateBloOfficer(tenantId: string, boothNumber: string, dto: UpdateBloOfficerDto) {
    const booth = await this.prisma.pollingBooth.findUnique({
      where: {
        organizationId_boothNumber: {
          organizationId: tenantId,
          boothNumber,
        },
      },
    });

    if (!booth) {
      throw new NotFoundException(`Booth #${boothNumber} not found in this organization`);
    }

    const updated = await this.prisma.pollingBooth.update({
      where: { id: booth.id },
      data: {
        bloName: dto.bloName ?? booth.bloName,
        bloPhone: dto.bloPhone ?? booth.bloPhone,
      },
    });

    this.logger.log(`Updated BLO officer for Booth #${boothNumber}`);

    return {
      boothNumber: updated.boothNumber,
      bloName: updated.bloName,
      bloPhone: updated.bloPhone,
      status: dto.status ?? BloStatus.ACTIVE,
      updatedAt: updated.updatedAt,
    };
  }
}
