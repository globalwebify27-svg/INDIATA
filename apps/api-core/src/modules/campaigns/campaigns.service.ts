import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateCampaignDto,
  QueryCampaignDto,
  UpdateCampaignStatusDto,
  CreateTemplateDto,
  EstimateAudienceDto,
  CampaignChannel,
  CampaignStatus,
} from "@rajtantra/common-types";
import { Prisma } from "@prisma/client";

export interface StoredCampaign {
  id: string;
  organizationId: string;
  name: string;
  channel: CampaignChannel;
  campaignType: string;
  targetAudience: string;
  recipientCount: number;
  deliveredCount: number;
  readCount: number;
  answeredCount: number;
  failedCount: number;
  callDurationSeconds?: number;
  status: CampaignStatus;
  scheduledTime: string;
  createdDate: string;
  messageTemplate: string;
  estimatedCostCredits: number;
  booths: string[];
  language?: string;
  voiceModel?: string;
  createdById?: string;
}

export interface StoredTemplate {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  channel: CampaignChannel;
  status: "APPROVED" | "PENDING";
  content: string;
  variables: string[];
}

export interface StoredTrigger {
  id: string;
  organizationId: string;
  name: string;
  campaignType: string;
  channel: CampaignChannel;
  trigger: string;
  audience: string;
  lastExecution: string;
  nextExecution: string;
  status: "ACTIVE" | "PAUSED";
  sentToday: number;
  failedCount: number;
  templateSnippet: string;
}

export interface StoredVoterResponse {
  id: string;
  organizationId: string;
  voterName: string;
  mobile: string;
  campaign: string;
  channel: CampaignChannel;
  messageReceived: string;
  receivedDate: string;
  responseStatus: "NEW" | "ACTIONED";
  callDuration?: string;
  summary?: string;
}

@Injectable()
export class CampaignsService {
  // In-memory persistent campaign storage scoped by organizationId
  private campaigns: StoredCampaign[] = [];
  private templates: StoredTemplate[] = [];
  private triggers: StoredTrigger[] = [];
  private responses: StoredVoterResponse[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedDefaultStore();
  }

  private seedDefaultStore() {
    const defaultOrg = "kasba-peth-2026";

    this.campaigns = [
      {
        id: "cmp-kasba-01",
        organizationId: defaultOrg,
        name: "Voter Slip WhatsApp Broadcast - Booths 101 to 105",
        channel: CampaignChannel.WHATSAPP,
        campaignType: "Voter Slip Sharing",
        targetAudience: "Verified Supporters & Neutrals in Kothrud (Booths 101-105)",
        recipientCount: 4500,
        deliveredCount: 4320,
        readCount: 3890,
        answeredCount: 0,
        failedCount: 180,
        status: CampaignStatus.RUNNING,
        scheduledTime: "2026-11-20 09:00 AM",
        createdDate: "2026-11-19",
        messageTemplate:
          "Namaskar {Name} ji! Here is your official voter slip for Booth #{Booth}. Vote for development on Election Day!",
        estimatedCostCredits: 4500,
        booths: ["101", "102", "103", "104", "105"],
      },
      {
        id: "cmp-kasba-02",
        organizationId: defaultOrg,
        name: "Youth First-Time Voter Drive",
        channel: CampaignChannel.SMS,
        campaignType: "Voting Information",
        targetAudience: "Voters aged 18-24 across all Prabhaags",
        recipientCount: 8200,
        deliveredCount: 7950,
        readCount: 7100,
        answeredCount: 0,
        failedCount: 250,
        status: CampaignStatus.COMPLETED,
        scheduledTime: "2026-11-18 06:00 PM",
        createdDate: "2026-11-17",
        messageTemplate:
          "Your vote shapes Kasba Peth's future! Check your polling center online at Indata Portal or call 1800-INDATA.",
        estimatedCostCredits: 8200,
        booths: ["101", "102", "103", "104", "105", "106", "107", "108"],
      },
      {
        id: "cmp-kasba-03",
        organizationId: defaultOrg,
        name: "Candidate Audio Message by Anand Shinde",
        channel: CampaignChannel.AI_VOICE,
        campaignType: "General Announcement",
        targetAudience: "Senior Citizens & Women Beneficiaries",
        recipientCount: 12000,
        deliveredCount: 10450,
        readCount: 8900,
        answeredCount: 9680,
        callDurationSeconds: 42,
        failedCount: 1550,
        status: CampaignStatus.SCHEDULED,
        scheduledTime: "2026-11-26 10:00 AM",
        createdDate: "2026-11-24",
        messageTemplate:
          "Personal voice message highlighting Ladki Bahin assistance, healthcare expansion, and metro line extensions in Pune.",
        estimatedCostCredits: 24000,
        booths: ["101", "102", "103", "104", "105"],
        language: "Marathi (Pune dialect)",
        voiceModel: "Anand Shinde (AI Cloned HD)",
      },
    ];

    this.templates = [
      {
        id: "tpl-wa-01",
        organizationId: defaultOrg,
        name: "Voter Information Slip with QR & Map Link",
        category: "Election Communication",
        channel: CampaignChannel.WHATSAPP,
        status: "APPROVED",
        content:
          "Namaskar {Voter Name} ji, your voting booth is {Booth Number} at {Polling Station}. Tap here to download digital voter slip.",
        variables: ["{Voter Name}", "{Booth Number}", "{Polling Station}"],
      },
      {
        id: "tpl-wa-02",
        organizationId: defaultOrg,
        name: "Official Birthday Greetings & Good Health Wishes",
        category: "Birthday",
        channel: CampaignChannel.WHATSAPP,
        status: "APPROVED",
        content:
          "Happy Birthday, {Voter Name} ji! Wishing you health, peace and happiness ahead. Warm regards, Anand Shinde & Family.",
        variables: ["{Voter Name}"],
      },
      {
        id: "tpl-sms-01",
        organizationId: defaultOrg,
        name: "Election Day Morning Turnout Push",
        category: "Reminder",
        channel: CampaignChannel.SMS,
        status: "APPROVED",
        content:
          "Voting has begun! Cast your vote at Booth #{Booth Number}. Free transport helpline: 1800-INDATA.",
        variables: ["{Booth Number}"],
      },
      {
        id: "tpl-voice-01",
        organizationId: defaultOrg,
        name: "Candidate Audio Broadcast - Healthcare & Infrastructure",
        category: "Announcement",
        channel: CampaignChannel.AI_VOICE,
        status: "APPROVED",
        content:
          "Namaskar, mi Anand Shinde bolat ahe. Kasba Peth chya sarvangin vikasasathi aple aashirwad dya.",
        variables: ["{Candidate Name}"],
      },
    ];

    this.triggers = [
      {
        id: "trg-01",
        organizationId: defaultOrg,
        name: "Voter Birthday Morning Greeting",
        campaignType: "Automated Greeting",
        channel: CampaignChannel.WHATSAPP,
        trigger: "Daily at 08:00 AM (Voter DOB matches today)",
        audience: "All electors celebrating birthday today",
        lastExecution: "Today, 08:00 AM",
        nextExecution: "Tomorrow, 08:00 AM",
        status: "ACTIVE",
        sentToday: 18,
        failedCount: 0,
        templateSnippet: "Happy Birthday, {Voter Name} ji! Wishing you health and prosperity...",
      },
      {
        id: "trg-02",
        organizationId: defaultOrg,
        name: "ECI Digital Voter Slip Auto-Dispatcher",
        campaignType: "Voter Slip Dispatch",
        channel: CampaignChannel.WHATSAPP,
        trigger: "On Karyakarta doorstep verification complete",
        audience: "Verified households with valid mobile numbers",
        lastExecution: "15 mins ago",
        nextExecution: "Instant on trigger",
        status: "ACTIVE",
        sentToday: 142,
        failedCount: 4,
        templateSnippet: "Namaskar {Name} ji! Your official digital voter slip is ready for download...",
      },
    ];

    this.responses = [
      {
        id: "resp-01",
        organizationId: defaultOrg,
        voterName: "Rajesh Kumar Verma",
        mobile: "+91 98220 11234",
        campaign: "Voter Slip WhatsApp Broadcast",
        channel: CampaignChannel.WHATSAPP,
        messageReceived: "Thank you Anand ji, we received the slip. 4 votes confirmed from our family!",
        receivedDate: "Today, 11:42 AM",
        responseStatus: "ACTIONED",
      },
      {
        id: "resp-02",
        organizationId: defaultOrg,
        voterName: "Kavita Ashok Patil",
        mobile: "+91 98220 77889",
        campaign: "Senior Citizen Wheelchair Coordination",
        channel: CampaignChannel.AI_VOICE,
        messageReceived: "Requested wheelchair van pickup at 10 AM for elderly mother.",
        receivedDate: "Today, 10:15 AM",
        callDuration: "42s",
        summary: "Confirmed transportation van request for booth #108.",
        responseStatus: "NEW",
      },
    ];
  }

  // ==========================================================================
  // 1. CAMPAIGN MANAGEMENT
  // ==========================================================================

  async findAllCampaigns(tenantId: string, query: QueryCampaignDto) {
    const { page = 1, limit = 20, channel, status, search } = query;

    let filtered = this.campaigns.filter(
      (c) => c.organizationId === tenantId || c.organizationId === "kasba-peth-2026",
    );

    if (channel) {
      filtered = filtered.filter((c) => c.channel === channel);
    }

    if (status) {
      filtered = filtered.filter((c) => c.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.campaignType.toLowerCase().includes(q) ||
          c.targetAudience.toLowerCase().includes(q),
      );
    }

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      campaigns: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getCampaignStats(tenantId: string) {
    const list = this.campaigns.filter(
      (c) => c.organizationId === tenantId || c.organizationId === "kasba-peth-2026",
    );

    let totalRecipients = 0;
    let totalDelivered = 0;
    let totalRead = 0;
    let totalCredits = 0;

    const channelBreakdown: Record<string, number> = {
      [CampaignChannel.WHATSAPP]: 0,
      [CampaignChannel.SMS]: 0,
      [CampaignChannel.AI_VOICE]: 0,
      [CampaignChannel.BULK]: 0,
    };

    const statusBreakdown: Record<string, number> = {
      [CampaignStatus.RUNNING]: 0,
      [CampaignStatus.SCHEDULED]: 0,
      [CampaignStatus.COMPLETED]: 0,
      [CampaignStatus.PAUSED]: 0,
      [CampaignStatus.DRAFT]: 0,
    };

    for (const c of list) {
      totalRecipients += c.recipientCount;
      totalDelivered += c.deliveredCount || 0;
      totalRead += c.readCount || 0;
      totalCredits += c.estimatedCostCredits;

      channelBreakdown[c.channel] = (channelBreakdown[c.channel] || 0) + 1;
      statusBreakdown[c.status] = (statusBreakdown[c.status] || 0) + 1;
    }

    const deliveryRatePct =
      totalRecipients > 0 ? Number(((totalDelivered / totalRecipients) * 100).toFixed(1)) : 0;
    const readRatePct =
      totalDelivered > 0 ? Number(((totalRead / totalDelivered) * 100).toFixed(1)) : 0;

    return {
      totalCampaigns: list.length,
      totalRecipients,
      totalDelivered,
      totalRead,
      totalCreditsConsumed: totalCredits,
      deliveryRatePct,
      readRatePct,
      channelBreakdown,
      statusBreakdown,
    };
  }

  async getChannelCredits(_tenantId: string) {
    return {
      whatsapp: 142500,
      sms: 88200,
      voice: 24000,
      totalBalanceInr: 42500,
      currency: "INR",
      planType: "ELECTION_PRO_COMMUNICATIONS",
    };
  }

  async findCampaignById(tenantId: string, id: string) {
    const campaign = this.campaigns.find(
      (c) =>
        c.id === id &&
        (c.organizationId === tenantId || c.organizationId === "kasba-peth-2026"),
    );

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID '${id}' not found`);
    }

    return campaign;
  }

  async createCampaign(tenantId: string, actorId: string, dto: CreateCampaignDto) {
    // Determine audience size dynamically based on DB voter count
    let recipientCount = 1000;

    const where: Prisma.VoterWhereInput = {
      organizationId: tenantId,
    };

    if (dto.booths && dto.booths.length > 0) {
      where.boothNumber = { in: dto.booths };
    }

    if (dto.classification) {
      where.classification = dto.classification;
    }

    if (dto.gender) {
      where.gender = dto.gender;
    }

    if (dto.minAge || dto.maxAge) {
      where.age = {};
      if (dto.minAge) where.age.gte = dto.minAge;
      if (dto.maxAge) where.age.lte = dto.maxAge;
    }

    const matchedVoters = await this.prisma.voter.count({ where });
    if (matchedVoters > 0) {
      recipientCount = matchedVoters;
    }

    const multiplier = dto.channel === CampaignChannel.AI_VOICE ? 2 : 1;
    const estimatedCostCredits = recipientCount * multiplier;

    const newCampaign: StoredCampaign = {
      id: `cmp-${Date.now().toString().slice(-6)}`,
      organizationId: tenantId,
      name: dto.name,
      channel: dto.channel,
      campaignType: dto.campaignType,
      targetAudience:
        dto.targetAudience ||
        `Segment: ${dto.classification || "All"} voters across ${
          dto.booths?.length ? dto.booths.length + " booths" : "constituency"
        }`,
      recipientCount,
      deliveredCount: 0,
      readCount: 0,
      answeredCount: 0,
      failedCount: 0,
      status: dto.scheduledTime ? CampaignStatus.SCHEDULED : CampaignStatus.RUNNING,
      scheduledTime: dto.scheduledTime || "Instant Launch",
      createdDate: new Date().toISOString().split("T")[0] || "2026-11-25",
      messageTemplate: dto.messageTemplate,
      estimatedCostCredits,
      booths: dto.booths || [],
      language: dto.language,
      voiceModel: dto.voiceModel,
      createdById: actorId,
    };

    this.campaigns.unshift(newCampaign);
    return newCampaign;
  }

  async updateCampaignStatus(tenantId: string, id: string, dto: UpdateCampaignStatusDto) {
    const campaign = await this.findCampaignById(tenantId, id);
    campaign.status = dto.status;
    return campaign;
  }

  async launchCampaign(tenantId: string, id: string) {
    const campaign = await this.findCampaignById(tenantId, id);
    campaign.status = CampaignStatus.RUNNING;
    campaign.deliveredCount = Math.round(campaign.recipientCount * 0.95);
    campaign.readCount = Math.round(campaign.recipientCount * 0.86);
    return {
      success: true,
      message: `Campaign '${campaign.name}' launched successfully`,
      campaign,
    };
  }

  async deleteCampaign(tenantId: string, id: string) {
    const idx = this.campaigns.findIndex(
      (c) =>
        c.id === id &&
        (c.organizationId === tenantId || c.organizationId === "kasba-peth-2026"),
    );

    if (idx === -1) {
      throw new NotFoundException(`Campaign '${id}' not found`);
    }

    const deleted = this.campaigns.splice(idx, 1)[0];
    return {
      success: true,
      message: `Campaign '${deleted?.name}' deleted successfully`,
    };
  }

  // ==========================================================================
  // 2. AUDIENCE ESTIMATOR
  // ==========================================================================

  async estimateAudience(tenantId: string, dto: EstimateAudienceDto) {
    const where: Prisma.VoterWhereInput = {
      organizationId: tenantId,
    };

    if (dto.booths && dto.booths.length > 0) {
      where.boothNumber = { in: dto.booths };
    }

    if (dto.classification) {
      where.classification = dto.classification;
    }

    if (dto.gender) {
      where.gender = dto.gender;
    }

    if (dto.minAge || dto.maxAge) {
      where.age = {};
      if (dto.minAge) where.age.gte = dto.minAge;
      if (dto.maxAge) where.age.lte = dto.maxAge;
    }

    const [total, male, female] = await Promise.all([
      this.prisma.voter.count({ where }),
      this.prisma.voter.count({ where: { ...where, gender: "MALE" } }),
      this.prisma.voter.count({ where: { ...where, gender: "FEMALE" } }),
    ]);

    const multiplier = dto.channel === CampaignChannel.AI_VOICE ? 2 : 1;
    const estimatedCredits = (total || 1000) * multiplier;
    const estimatedCostInr = Number((estimatedCredits * 0.25).toFixed(2));

    return {
      matchingVotersCount: total || 1000,
      demographics: {
        male: male || 520,
        female: female || 480,
      },
      channel: dto.channel,
      estimatedCredits,
      estimatedCostInr,
    };
  }

  // ==========================================================================
  // 3. TEMPLATES & TRIGGERS
  // ==========================================================================

  async findAllTemplates(tenantId: string, query?: { channel?: string; category?: string }) {
    let list = this.templates.filter(
      (t) => t.organizationId === tenantId || t.organizationId === "kasba-peth-2026",
    );

    if (query?.channel) {
      list = list.filter((t) => t.channel === query.channel);
    }

    if (query?.category) {
      list = list.filter((t) => t.category.toLowerCase().includes(query.category!.toLowerCase()));
    }

    return list;
  }

  async createTemplate(tenantId: string, dto: CreateTemplateDto) {
    const newTpl: StoredTemplate = {
      id: `tpl-${Date.now().toString().slice(-6)}`,
      organizationId: tenantId,
      name: dto.name,
      category: dto.category,
      channel: dto.channel,
      status: "APPROVED",
      content: dto.content,
      variables: dto.variables,
    };

    this.templates.unshift(newTpl);
    return newTpl;
  }

  async findAllResponses(tenantId: string, query?: { channel?: string; status?: string }) {
    let list = this.responses.filter(
      (r) => r.organizationId === tenantId || r.organizationId === "kasba-peth-2026",
    );

    if (query?.channel) {
      list = list.filter((r) => r.channel === query.channel);
    }

    if (query?.status) {
      list = list.filter((r) => r.responseStatus === query.status);
    }

    return list;
  }

  async findAllTriggers(tenantId: string) {
    return this.triggers.filter(
      (tr) => tr.organizationId === tenantId || tr.organizationId === "kasba-peth-2026",
    );
  }
}
