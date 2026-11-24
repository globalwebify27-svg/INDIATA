import {
  PrismaClient,
  TurnoutStatus,
  SlipChannel,
  SlipStatus,
  TicketPriority,
  TicketStatus,
  CorrectionStatus,
  BroadcastScope,
} from "@prisma/client";
import { SeedLogger } from "../shared/logger";
import { SeedOptions, SeedResult } from "../shared/types";
import { SYSTEM_USER_IDS } from "../shared/constants";

export async function seedEngagement(
  prisma: PrismaClient,
  options?: SeedOptions
): Promise<SeedResult> {
  const logger = new SeedLogger("engagement", options?.verbose ?? false);
  logger.info("Seeding Engagement Domain (Surveys, Turnout Audits, Hourly Logs, Slips, Tickets, Broadcasts)...");

  try {
    const org = await prisma.organization.findUnique({
      where: { slug: "kasba-peth-2026" },
    });

    if (!org) {
      logger.error("Organization 'kasba-peth-2026' not found. Cannot seed engagement.");
      return logger.toResult(false, "Organization missing");
    }

    // Retrieve references
    const booth101 = await prisma.pollingBooth.findUnique({
      where: { organizationId_boothNumber: { organizationId: org.id, boothNumber: "101" } },
    });
    const booth102 = await prisma.pollingBooth.findUnique({
      where: { organizationId_boothNumber: { organizationId: org.id, boothNumber: "102" } },
    });

    const karyakarta1 = await prisma.user.findUnique({
      where: { id: SYSTEM_USER_IDS.KARYAKARTA_1 },
    });
    const candidateAdmin = await prisma.user.findUnique({
      where: { id: SYSTEM_USER_IDS.CANDIDATE_ADMIN_KASBA },
    });

    const voterPatil = await prisma.voter.findUnique({ where: { id: "voter-kasba-001" } });
    const voterVerma = await prisma.voter.findUnique({ where: { id: "voter-kasba-004" } });
    const voterDeshmukh = await prisma.voter.findUnique({ where: { id: "voter-kasba-006" } });

    // -------------------------------------------------------------
    // 1. Voter Doorstep Survey Records (With GPS Geo-tagging)
    // -------------------------------------------------------------
    const surveys = [
      {
        id: "survey-kasba-001",
        voterId: voterPatil ? voterPatil.id : "voter-kasba-001",
        karyakartaId: karyakarta1?.id,
        welfareScheme: "PM Awas Yojana & Ladki Bahin Yojana",
        feedbackNotes: "Warm reception. Strongly committed to candidate following infrastructure development in Shaniwar Peth.",
        citizenDemands: "Pipeline pressure issues during early morning hours.",
        gpsLat: 18.52043,
        gpsLng: 73.85674,
        isGeotagged: true,
        organizationId: org.id,
      },
      {
        id: "survey-kasba-002",
        voterId: voterVerma ? voterVerma.id : "voter-kasba-004",
        karyakartaId: karyakarta1?.id,
        welfareScheme: "PM Mudra Scheme / Vyapari Vikas Yojana",
        feedbackNotes: "Traders association seeking easing of parking restrictions in Mandai zone.",
        citizenDemands: "Designated commercial loading/unloading bays on Main Mandai Road.",
        gpsLat: 18.5218,
        gpsLng: 73.8552,
        isGeotagged: true,
        organizationId: org.id,
      },
    ];

    for (const s of surveys) {
      const existing = await prisma.voterSurveyRecord.findUnique({
        where: { id: s.id },
      });
      if (!existing) {
        await prisma.voterSurveyRecord.create({ data: s });
        logger.recordInserted("VoterSurveyRecord", s.id);
      } else {
        logger.recordSkipped("VoterSurveyRecord", s.id, "Survey exists");
      }
    }

    // -------------------------------------------------------------
    // 2. Live Polling Turnout Audits (LPIANE)
    // -------------------------------------------------------------
    const turnoutAudits = [
      {
        id: "turnout-kasba-001",
        voterId: voterPatil ? voterPatil.id : "voter-kasba-001",
        boothNumber: "101",
        status: TurnoutStatus.VOTED,
        actingUserId: karyakarta1?.id,
        actingUserName: karyakarta1 ? karyakarta1.name : "Karyakarta Suresh Patil",
        timestamp: "Today, 08:45 AM",
        reason: "Polling Booth ECI Slip Verification",
        organizationId: org.id,
      },
      {
        id: "turnout-kasba-002",
        voterId: "voter-kasba-002",
        boothNumber: "101",
        status: TurnoutStatus.VOTED,
        actingUserId: karyakarta1?.id,
        actingUserName: karyakarta1 ? karyakarta1.name : "Karyakarta Suresh Patil",
        timestamp: "Today, 08:46 AM",
        reason: "Family Turnout Verification",
        organizationId: org.id,
      },
      {
        id: "turnout-kasba-003",
        voterId: "voter-kasba-008",
        boothNumber: "106",
        status: TurnoutStatus.VOTED,
        actingUserId: karyakarta1?.id,
        actingUserName: "Self / Field Cadre",
        timestamp: "Today, 09:30 AM",
        reason: "Morning Cadre Turnout",
        organizationId: org.id,
      },
    ];

    for (const ta of turnoutAudits) {
      const existing = await prisma.voterTurnoutAudit.findUnique({
        where: { id: ta.id },
      });
      if (!existing) {
        await prisma.voterTurnoutAudit.create({ data: ta });
        logger.recordInserted("VoterTurnoutAudit", ta.id);
      } else {
        logger.recordSkipped("VoterTurnoutAudit", ta.id, "Turnout audit exists");
      }
    }

    // -------------------------------------------------------------
    // 3. Polling Booth Hourly Turnout Logs
    // -------------------------------------------------------------
    if (booth101) {
      const hourlyLogs = [
        {
          id: "hourly-101-01",
          boothId: booth101.id,
          boothNumber: "101",
          timeSlot: "07:00 - 09:00",
          maleVoted: 110,
          femaleVoted: 85,
          totalVoted: 195,
          cumulativePct: 17.1,
          organizationId: org.id,
        },
        {
          id: "hourly-101-02",
          boothId: booth101.id,
          boothNumber: "101",
          timeSlot: "09:00 - 11:00",
          maleVoted: 180,
          femaleVoted: 145,
          totalVoted: 325,
          cumulativePct: 45.5,
          organizationId: org.id,
        },
        {
          id: "hourly-101-03",
          boothId: booth101.id,
          boothNumber: "101",
          timeSlot: "11:00 - 01:00",
          maleVoted: 120,
          femaleVoted: 105,
          totalVoted: 225,
          cumulativePct: 65.2,
          organizationId: org.id,
        },
      ];

      for (const hl of hourlyLogs) {
        const existing = await prisma.boothHourlyTurnoutLog.findUnique({
          where: { id: hl.id },
        });
        if (!existing) {
          await prisma.boothHourlyTurnoutLog.create({ data: hl });
          logger.recordInserted("BoothHourlyTurnoutLog", `${hl.boothNumber} [${hl.timeSlot}]`);
        } else {
          logger.recordSkipped("BoothHourlyTurnoutLog", `${hl.boothNumber} [${hl.timeSlot}]`, "Log exists");
        }
      }
    }

    // -------------------------------------------------------------
    // 4. ECI Voter Slip Dispatches
    // -------------------------------------------------------------
    const slips = [
      {
        id: "slip-kasba-001",
        voterId: voterPatil ? voterPatil.id : "voter-kasba-001",
        channel: SlipChannel.WHATSAPP_DIGITAL,
        status: SlipStatus.DELIVERED,
        dispatchedById: karyakarta1?.id,
        organizationId: org.id,
      },
      {
        id: "slip-kasba-002",
        voterId: voterVerma ? voterVerma.id : "voter-kasba-004",
        channel: SlipChannel.PHYSICAL_DELIVERY,
        status: SlipStatus.PRINTED,
        dispatchedById: karyakarta1?.id,
        organizationId: org.id,
      },
      {
        id: "slip-kasba-003",
        voterId: voterDeshmukh ? voterDeshmukh.id : "voter-kasba-006",
        channel: SlipChannel.THERMAL_58MM,
        status: SlipStatus.GENERATED,
        dispatchedById: karyakarta1?.id,
        organizationId: org.id,
      },
    ];

    for (const sl of slips) {
      const existing = await prisma.voterSlipDispatch.findUnique({
        where: { id: sl.id },
      });
      if (!existing) {
        await prisma.voterSlipDispatch.create({ data: sl });
        logger.recordInserted("VoterSlipDispatch", sl.id);
      } else {
        logger.recordSkipped("VoterSlipDispatch", sl.id, "Slip exists");
      }
    }

    // -------------------------------------------------------------
    // 5. Civic Grievance Tickets
    // -------------------------------------------------------------
    const tickets = [
      {
        ticketNumber: "TCK-2026-001",
        voterId: voterPatil ? voterPatil.id : "voter-kasba-001",
        voterName: voterPatil ? voterPatil.name : "Suresh R. Patil",
        voterPhone: voterPatil ? voterPatil.phone : "+91 98220 11223",
        voterBooth: "101",
        category: "Municipal / Water Supply",
        title: "Low Water Pressure in Lane 4",
        description: "Drinking water pipeline pressure drops significantly between 7 AM and 9 AM.",
        priority: TicketPriority.HIGH,
        status: TicketStatus.IN_PROGRESS,
        location: "Near Wada Gate, Shaniwar Peth",
        assignedTo: "Karyakarta Suresh Patil",
        karyakartaId: karyakarta1?.id,
        karyakartaName: karyakarta1 ? karyakarta1.name : "Suresh Patil",
        organizationId: org.id,
      },
      {
        ticketNumber: "TCK-2026-002",
        voterId: voterVerma ? voterVerma.id : "voter-kasba-004",
        voterName: "Rajesh Kumar Verma",
        voterPhone: "+91 98220 33001",
        voterBooth: "101",
        category: "Infrastructure / Roads",
        title: "Pothole repair required near Mandai Chowk",
        description: "Deep potholes causing severe traffic congestion during evening market hours.",
        priority: TicketPriority.MEDIUM,
        status: TicketStatus.RESOLVED,
        location: "Main Mandai Road, Kasba Peth",
        assignedTo: "Karyakarta Suresh Patil",
        resolutionNotes: "PMC road contractor patched the trench yesterday. Verified with complainant.",
        karyakartaId: karyakarta1?.id,
        karyakartaName: karyakarta1 ? karyakarta1.name : "Suresh Patil",
        organizationId: org.id,
      },
    ];

    for (const t of tickets) {
      const existing = await prisma.issueTicket.findUnique({
        where: { ticketNumber: t.ticketNumber },
      });
      if (!existing) {
        await prisma.issueTicket.create({ data: t });
        logger.recordInserted("IssueTicket", t.ticketNumber);
      } else {
        logger.recordSkipped("IssueTicket", t.ticketNumber, "Ticket exists");
      }
    }

    // -------------------------------------------------------------
    // 6. Voter Quarantine / Correction Requests
    // -------------------------------------------------------------
    const correctionRequests = [
      {
        id: "corr-kasba-001",
        voterId: "voter-kasba-003",
        karyakartaId: karyakarta1?.id,
        proposedDataJson: JSON.stringify({
          phone: "+91 98220 11999",
          qualification: "B.Tech Graduate",
          isPhoneVerified: true,
        }),
        reason: "Voter updated mobile number during doorstep verification visit.",
        status: CorrectionStatus.PENDING_WAR_ROOM,
        organizationId: org.id,
      },
    ];

    for (const cr of correctionRequests) {
      const existing = await prisma.voterCorrectionRequest.findUnique({
        where: { id: cr.id },
      });
      if (!existing) {
        await prisma.voterCorrectionRequest.create({ data: cr });
        logger.recordInserted("VoterCorrectionRequest", cr.id);
      } else {
        logger.recordSkipped("VoterCorrectionRequest", cr.id, "Correction request exists");
      }
    }

    // -------------------------------------------------------------
    // 7. War Room Broadcast Notifications
    // -------------------------------------------------------------
    const broadcasts = [
      {
        id: "bcast-kasba-001",
        organizationId: org.id,
        senderId: candidateAdmin?.id,
        title: "Morning Cadre Turnout Target: 50% by 12:00 PM",
        message: "All booth in-charges are requested to accelerate senior citizen and homemaker mobilization before noon.",
        scope: BroadcastScope.ALL_CADRE,
        priority: "HIGH",
        sentAt: new Date("2026-11-20T08:00:00Z"),
      },
      {
        id: "bcast-kasba-002",
        organizationId: org.id,
        senderId: candidateAdmin?.id,
        title: "Booth #101 Thermal Slip Printer Paper Rolls Available",
        message: "Additional 58mm thermal rolls have been delivered to Navbharat High School coordination counter.",
        scope: BroadcastScope.BOOTH_SPECIFIC,
        targetBoothNumber: "101",
        priority: "NORMAL",
        sentAt: new Date("2026-11-20T09:15:00Z"),
      },
    ];

    for (const bc of broadcasts) {
      const existing = await prisma.broadcastNotification.findUnique({
        where: { id: bc.id },
      });
      if (!existing) {
        await prisma.broadcastNotification.create({ data: bc });
        logger.recordInserted("BroadcastNotification", bc.title);
      } else {
        logger.recordSkipped("BroadcastNotification", bc.title, "Broadcast exists");
      }
    }

    logger.info("✓ Engagement domain seeder finished.");
    logger.printSummary();
    return logger.toResult(true);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error("Engagement seeder encountered a failure", error);
    logger.printSummary();
    return logger.toResult(false, errMsg);
  }
}
