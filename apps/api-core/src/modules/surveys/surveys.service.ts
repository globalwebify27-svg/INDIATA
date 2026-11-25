import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  SurveyQueryDto,
  CreateSurveyDto,
  UpdateSurveyDto,
  SlipQueryDto,
  CreateSlipDispatchDto,
  BulkSlipDispatchDto,
  UpdateSlipStatusDto,
  TicketQueryDto,
  CreateTicketDto,
  UpdateTicketDto,
  CreateCorrectionDto,
  ReviewCorrectionDto,
  SlipChannel,
  SlipStatus,
  TicketPriority,
  TicketStatus,
  CorrectionStatus,
} from "@rajtantra/common-types";
import { Prisma } from "@prisma/client";

@Injectable()
export class SurveysService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================================================
  // 1. DOORSTEP FIELD SURVEYS & VISITS
  // ==========================================================================

  async findAllSurveys(tenantId: string, query: SurveyQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      voterId,
      karyakartaId,
      isGeotagged,
      welfareScheme,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.VoterSurveyRecordWhereInput = {
      organizationId: tenantId,
    };

    if (voterId) {
      where.voterId = voterId;
    }

    if (karyakartaId) {
      where.karyakartaId = karyakartaId;
    }

    if (typeof isGeotagged === "boolean") {
      where.isGeotagged = isGeotagged;
    }

    if (welfareScheme) {
      where.welfareScheme = { contains: welfareScheme };
    }

    if (search) {
      where.OR = [
        { feedbackNotes: { contains: search } },
        { citizenDemands: { contains: search } },
        { welfareScheme: { contains: search } },
        { voter: { name: { contains: search } } },
        { voter: { epicId: { contains: search } } },
      ];
    }

    const [total, surveys] = await Promise.all([
      this.prisma.voterSurveyRecord.count({ where }),
      this.prisma.voterSurveyRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          voter: {
            select: {
              id: true,
              name: true,
              marathiName: true,
              epicId: true,
              boothNumber: true,
              phone: true,
              address: true,
            },
          },
          karyakarta: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      surveys,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getSurveyStats(tenantId: string) {
    const [totalSurveys, geotaggedSurveys, surveysWithSchemes] = await Promise.all([
      this.prisma.voterSurveyRecord.count({
        where: { organizationId: tenantId },
      }),
      this.prisma.voterSurveyRecord.count({
        where: { organizationId: tenantId, isGeotagged: true },
      }),
      this.prisma.voterSurveyRecord.findMany({
        where: {
          organizationId: tenantId,
          welfareScheme: { not: null },
        },
        select: { welfareScheme: true, karyakartaId: true },
      }),
    ]);

    // Scheme Breakdown
    const schemeCounts: Record<string, number> = {};
    for (const s of surveysWithSchemes) {
      if (s.welfareScheme) {
        schemeCounts[s.welfareScheme] = (schemeCounts[s.welfareScheme] || 0) + 1;
      }
    }

    const schemeBreakdown = Object.entries(schemeCounts)
      .map(([scheme, count]) => ({ scheme, count }))
      .sort((a, b) => b.count - a.count);

    const geotaggedPercent =
      totalSurveys > 0 ? Number(((geotaggedSurveys / totalSurveys) * 100).toFixed(1)) : 0;

    return {
      totalSurveys,
      geotaggedSurveys,
      geotaggedPercent,
      schemeBreakdown,
    };
  }

  async findSurveyById(tenantId: string, id: string) {
    const survey = await this.prisma.voterSurveyRecord.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        voter: true,
        karyakarta: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
    });

    if (!survey) {
      throw new NotFoundException(`Survey record with ID '${id}' not found`);
    }

    return survey;
  }

  async createSurvey(tenantId: string, actorId: string, dto: CreateSurveyDto) {
    const voter = await this.prisma.voter.findFirst({
      where: { id: dto.voterId, organizationId: tenantId },
    });

    if (!voter) {
      throw new NotFoundException(`Voter with ID '${dto.voterId}' not found in organization`);
    }

    const isGeotagged =
      dto.isGeotagged ?? (dto.gpsLat !== undefined && dto.gpsLng !== undefined);

    const [survey] = await this.prisma.$transaction([
      this.prisma.voterSurveyRecord.create({
        data: {
          organizationId: tenantId,
          voterId: dto.voterId,
          karyakartaId: dto.karyakartaId || actorId,
          welfareScheme: dto.welfareScheme,
          feedbackNotes: dto.feedbackNotes,
          citizenDemands: dto.citizenDemands,
          gpsLat: dto.gpsLat,
          gpsLng: dto.gpsLng,
          isGeotagged,
        },
        include: {
          voter: {
            select: { id: true, name: true, epicId: true, boothNumber: true },
          },
          karyakarta: {
            select: { id: true, name: true, phone: true },
          },
        },
      }),
      this.prisma.voter.update({
        where: { id: dto.voterId },
        data: {
          isVisited: true,
          lastVisitDate: new Date().toISOString(),
        },
      }),
    ]);

    return survey;
  }

  async updateSurvey(tenantId: string, id: string, dto: UpdateSurveyDto) {
    await this.findSurveyById(tenantId, id);

    const isGeotagged =
      dto.isGeotagged !== undefined
        ? dto.isGeotagged
        : dto.gpsLat !== undefined && dto.gpsLng !== undefined
        ? true
        : undefined;

    return this.prisma.voterSurveyRecord.update({
      where: { id },
      data: {
        ...(dto.welfareScheme !== undefined && { welfareScheme: dto.welfareScheme }),
        ...(dto.feedbackNotes !== undefined && { feedbackNotes: dto.feedbackNotes }),
        ...(dto.citizenDemands !== undefined && { citizenDemands: dto.citizenDemands }),
        ...(dto.gpsLat !== undefined && { gpsLat: dto.gpsLat }),
        ...(dto.gpsLng !== undefined && { gpsLng: dto.gpsLng }),
        ...(isGeotagged !== undefined && { isGeotagged }),
      },
      include: {
        voter: {
          select: { id: true, name: true, epicId: true, boothNumber: true },
        },
        karyakarta: {
          select: { id: true, name: true, phone: true },
        },
      },
    });
  }

  async deleteSurvey(tenantId: string, id: string) {
    await this.findSurveyById(tenantId, id);
    await this.prisma.voterSurveyRecord.delete({ where: { id } });
    return { success: true, message: `Survey record '${id}' deleted successfully` };
  }

  // ==========================================================================
  // 2. ECI VOTER SLIP DISPATCHES
  // ==========================================================================

  async findAllSlips(tenantId: string, query: SlipQueryDto) {
    const {
      page = 1,
      limit = 20,
      voterId,
      channel,
      status,
      dispatchedById,
      sortBy = "dispatchedAt",
      sortOrder = "desc",
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.VoterSlipDispatchWhereInput = {
      organizationId: tenantId,
    };

    if (voterId) where.voterId = voterId;
    if (channel) where.channel = channel;
    if (status) where.status = status;
    if (dispatchedById) where.dispatchedById = dispatchedById;

    const [total, slips] = await Promise.all([
      this.prisma.voterSlipDispatch.count({ where }),
      this.prisma.voterSlipDispatch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          voter: {
            select: {
              id: true,
              name: true,
              epicId: true,
              boothNumber: true,
              phone: true,
              serialNumber: true,
            },
          },
          dispatchedBy: {
            select: { id: true, name: true, phone: true },
          },
        },
      }),
    ]);

    return {
      slips,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getSlipStats(tenantId: string) {
    const [totalSlips, slips] = await Promise.all([
      this.prisma.voterSlipDispatch.count({
        where: { organizationId: tenantId },
      }),
      this.prisma.voterSlipDispatch.findMany({
        where: { organizationId: tenantId },
        select: { channel: true, status: true },
      }),
    ]);

    const channelCounts: Record<string, number> = {
      [SlipChannel.WHATSAPP_DIGITAL]: 0,
      [SlipChannel.PHYSICAL_DELIVERY]: 0,
      [SlipChannel.THERMAL_58MM]: 0,
    };

    const statusCounts: Record<string, number> = {
      [SlipStatus.GENERATED]: 0,
      [SlipStatus.PRINTED]: 0,
      [SlipStatus.DELIVERED]: 0,
      [SlipStatus.FAILED]: 0,
    };

    for (const s of slips) {
      channelCounts[s.channel] = (channelCounts[s.channel] ?? 0) + 1;
      statusCounts[s.status] = (statusCounts[s.status] ?? 0) + 1;
    }

    const deliveredCount = statusCounts[SlipStatus.DELIVERED] ?? 0;
    const deliveredPercent =
      totalSlips > 0 ? Number(((deliveredCount / totalSlips) * 100).toFixed(1)) : 0;

    return {
      totalSlips,
      deliveredPercent,
      channelBreakdown: channelCounts,
      statusBreakdown: statusCounts,
    };
  }

  async dispatchSlip(tenantId: string, actorId: string, dto: CreateSlipDispatchDto) {
    const voter = await this.prisma.voter.findFirst({
      where: { id: dto.voterId, organizationId: tenantId },
    });

    if (!voter) {
      throw new NotFoundException(`Voter with ID '${dto.voterId}' not found`);
    }

    return this.prisma.voterSlipDispatch.create({
      data: {
        organizationId: tenantId,
        voterId: dto.voterId,
        channel: dto.channel,
        status: dto.status,
        dispatchedById: dto.dispatchedById || actorId,
      },
      include: {
        voter: {
          select: { id: true, name: true, epicId: true, boothNumber: true, phone: true },
        },
        dispatchedBy: {
          select: { id: true, name: true, phone: true },
        },
      },
    });
  }

  async dispatchBulkSlips(tenantId: string, actorId: string, dto: BulkSlipDispatchDto) {
    const voters = await this.prisma.voter.findMany({
      where: {
        id: { in: dto.voterIds },
        organizationId: tenantId,
      },
      select: { id: true },
    });

    if (voters.length === 0) {
      throw new BadRequestException("No matching voters found in organization");
    }

    const validVoterIds = voters.map((v) => v.id);

    await this.prisma.voterSlipDispatch.createMany({
      data: validVoterIds.map((vId) => ({
        organizationId: tenantId,
        voterId: vId,
        channel: dto.channel,
        status: dto.status,
        dispatchedById: actorId,
      })),
    });

    return {
      success: true,
      totalDispatched: validVoterIds.length,
      channel: dto.channel,
      status: dto.status,
    };
  }

  async updateSlipStatus(tenantId: string, id: string, dto: UpdateSlipStatusDto) {
    const existing = await this.prisma.voterSlipDispatch.findFirst({
      where: { id, organizationId: tenantId },
    });

    if (!existing) {
      throw new NotFoundException(`Slip dispatch with ID '${id}' not found`);
    }

    return this.prisma.voterSlipDispatch.update({
      where: { id },
      data: { status: dto.status },
      include: {
        voter: {
          select: { id: true, name: true, epicId: true, boothNumber: true },
        },
      },
    });
  }

  // ==========================================================================
  // 3. CIVIC GRIEVANCES & OFFICE HELPDESK TICKETS
  // ==========================================================================

  async findAllTickets(tenantId: string, query: TicketQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      priority,
      category,
      voterBooth,
      assignedTo,
      karyakartaId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.IssueTicketWhereInput = {
      organizationId: tenantId,
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (voterBooth) where.voterBooth = voterBooth;
    if (assignedTo) where.assignedTo = { contains: assignedTo };
    if (karyakartaId) where.karyakartaId = karyakartaId;

    if (search) {
      where.OR = [
        { ticketNumber: { contains: search } },
        { title: { contains: search } },
        { description: { contains: search } },
        { voterName: { contains: search } },
        { voterPhone: { contains: search } },
      ];
    }

    const [total, tickets] = await Promise.all([
      this.prisma.issueTicket.count({ where }),
      this.prisma.issueTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          voter: {
            select: {
              id: true,
              name: true,
              epicId: true,
              boothNumber: true,
              phone: true,
            },
          },
          karyakarta: {
            select: { id: true, name: true, phone: true },
          },
        },
      }),
    ]);

    return {
      tickets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getTicketStats(tenantId: string) {
    const [totalTickets, tickets] = await Promise.all([
      this.prisma.issueTicket.count({
        where: { organizationId: tenantId },
      }),
      this.prisma.issueTicket.findMany({
        where: { organizationId: tenantId },
        select: { status: true, priority: true, category: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {
      [TicketStatus.NEW]: 0,
      [TicketStatus.ASSIGNED]: 0,
      [TicketStatus.IN_PROGRESS]: 0,
      [TicketStatus.FOLLOW_UP]: 0,
      [TicketStatus.RESOLVED]: 0,
      [TicketStatus.CLOSED]: 0,
    };

    const priorityCounts: Record<string, number> = {
      [TicketPriority.LOW]: 0,
      [TicketPriority.MEDIUM]: 0,
      [TicketPriority.HIGH]: 0,
      [TicketPriority.URGENT]: 0,
    };

    const categoryCounts: Record<string, number> = {};

    for (const t of tickets) {
      statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1;
      priorityCounts[t.priority] = (priorityCounts[t.priority] ?? 0) + 1;
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    }

    const resolvedCount = (statusCounts[TicketStatus.RESOLVED] ?? 0) + (statusCounts[TicketStatus.CLOSED] ?? 0);
    const resolutionRate =
      totalTickets > 0 ? Number(((resolvedCount / totalTickets) * 100).toFixed(1)) : 0;

    return {
      totalTickets,
      resolvedCount,
      resolutionRate,
      statusBreakdown: statusCounts,
      priorityBreakdown: priorityCounts,
      categoryBreakdown: categoryCounts,
    };
  }

  async findTicketById(tenantId: string, id: string) {
    const ticket = await this.prisma.issueTicket.findFirst({
      where: {
        OR: [{ id }, { ticketNumber: id }],
        organizationId: tenantId,
      },
      include: {
        voter: true,
        karyakarta: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket '${id}' not found in organization`);
    }

    return ticket;
  }

  async createTicket(
    tenantId: string,
    actorId: string,
    actorName: string,
    dto: CreateTicketDto,
  ) {
    let voterDetails: { name?: string; phone?: string; boothNumber?: string } = {};

    if (dto.voterId) {
      const v = await this.prisma.voter.findFirst({
        where: { id: dto.voterId, organizationId: tenantId },
        select: { name: true, phone: true, boothNumber: true },
      });
      if (v) {
        voterDetails = {
          name: v.name,
          phone: v.phone ?? undefined,
          boothNumber: v.boothNumber ?? undefined,
        };
      }
    }

    const ticketNumber = `TCK-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;

    return this.prisma.issueTicket.create({
      data: {
        organizationId: tenantId,
        ticketNumber,
        voterId: dto.voterId,
        voterName: dto.voterName || voterDetails.name,
        voterPhone: dto.voterPhone || voterDetails.phone,
        voterBooth: dto.voterBooth || voterDetails.boothNumber,
        category: dto.category,
        title: dto.title || `${dto.category} Grievance`,
        description: dto.description,
        priority: dto.priority,
        status: dto.status,
        location: dto.location,
        assignedTo: dto.assignedTo,
        attachments: dto.attachments,
        karyakartaId: dto.karyakartaId || actorId,
        karyakartaName: dto.karyakartaName || actorName,
      },
      include: {
        voter: {
          select: { id: true, name: true, epicId: true, boothNumber: true },
        },
        karyakarta: {
          select: { id: true, name: true, phone: true },
        },
      },
    });
  }

  async updateTicket(tenantId: string, id: string, dto: UpdateTicketDto) {
    const existing = await this.findTicketById(tenantId, id);

    return this.prisma.issueTicket.update({
      where: { id: existing.id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.assignedTo !== undefined && { assignedTo: dto.assignedTo }),
        ...(dto.resolutionNotes !== undefined && { resolutionNotes: dto.resolutionNotes }),
        ...(dto.attachments !== undefined && { attachments: dto.attachments }),
      },
      include: {
        voter: {
          select: { id: true, name: true, epicId: true, boothNumber: true },
        },
        karyakarta: {
          select: { id: true, name: true, phone: true },
        },
      },
    });
  }

  async deleteTicket(tenantId: string, id: string) {
    const existing = await this.findTicketById(tenantId, id);
    await this.prisma.issueTicket.delete({ where: { id: existing.id } });
    return { success: true, message: `Ticket '${existing.ticketNumber}' deleted successfully` };
  }

  // ==========================================================================
  // 4. QUARANTINE CORRECTIONS & PROPOSALS
  // ==========================================================================

  async findAllCorrections(
    tenantId: string,
    query: { page?: number; limit?: number; status?: CorrectionStatus },
  ) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.VoterCorrectionRequestWhereInput = {
      organizationId: tenantId,
    };
    if (status) where.status = status;

    const [total, corrections] = await Promise.all([
      this.prisma.voterCorrectionRequest.count({ where }),
      this.prisma.voterCorrectionRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          voter: {
            select: { id: true, name: true, epicId: true, boothNumber: true, phone: true },
          },
          karyakarta: {
            select: { id: true, name: true, phone: true },
          },
        },
      }),
    ]);

    return {
      corrections,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async createCorrection(tenantId: string, actorId: string, dto: CreateCorrectionDto) {
    const voter = await this.prisma.voter.findFirst({
      where: { id: dto.voterId, organizationId: tenantId },
    });

    if (!voter) {
      throw new NotFoundException(`Voter with ID '${dto.voterId}' not found`);
    }

    return this.prisma.voterCorrectionRequest.create({
      data: {
        organizationId: tenantId,
        voterId: dto.voterId,
        karyakartaId: actorId,
        proposedDataJson: dto.proposedDataJson,
        reason: dto.reason,
        status: CorrectionStatus.PENDING_WAR_ROOM,
      },
      include: {
        voter: {
          select: { id: true, name: true, epicId: true, boothNumber: true },
        },
        karyakarta: {
          select: { id: true, name: true, phone: true },
        },
      },
    });
  }

  async reviewCorrection(
    tenantId: string,
    reviewerId: string,
    id: string,
    dto: ReviewCorrectionDto,
  ) {
    const existing = await this.prisma.voterCorrectionRequest.findFirst({
      where: { id, organizationId: tenantId },
    });

    if (!existing) {
      throw new NotFoundException(`Correction request with ID '${id}' not found`);
    }

    const newStatus =
      dto.status === "APPROVED" ? CorrectionStatus.APPROVED : CorrectionStatus.REJECTED;

    const updated = await this.prisma.voterCorrectionRequest.update({
      where: { id },
      data: {
        status: newStatus,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
      },
      include: {
        voter: true,
      },
    });

    // If APPROVED, optionally merge updates into voter
    if (newStatus === CorrectionStatus.APPROVED && existing.proposedDataJson) {
      try {
        const parsed = JSON.parse(existing.proposedDataJson);
        const allowedFields = ["name", "phone", "email", "address", "houseNo", "age", "isDeceased"];
        const toUpdate: Record<string, any> = {};
        for (const f of allowedFields) {
          if (parsed[f] !== undefined) toUpdate[f] = parsed[f];
        }
        if (Object.keys(toUpdate).length > 0) {
          await this.prisma.voter.update({
            where: { id: existing.voterId },
            data: toUpdate,
          });
        }
      } catch (e) {
        // Log JSON parse error but maintain correction review
      }
    }

    return updated;
  }
}
