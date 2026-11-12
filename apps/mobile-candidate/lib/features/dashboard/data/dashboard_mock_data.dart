import '../models/telemetry_kpi.dart';

class DashboardMockData {
  static const TelemetryKPIs defaultKPIs = TelemetryKPIs(
    // Electorate Demographics
    totalVoters: 248510,
    maleVoters: 128420,
    femaleVoters: 119890,
    otherVoters: 200,

    // Polling & Workforce
    totalBooths: 215,
    totalKaryakartas: 184,
    activeKaryakartas: 42,

    // Survey Progress
    surveysCompleted: 159543,
    surveyCoveragePct: 64.2,

    // Voter Sentiment Triad
    favorableSupporters: 92535, // 58.0% of surveyed
    swingVoters: 34120,         // 21.4% of surveyed
    oppositionVoters: 32888,    // 20.6% of surveyed

    // Booth Classification
    criticalBattlegroundBooths: 38,
    safeBooths: 124,
    weakBooths: 53,

    // Citizen Grievances
    openTickets: 18,
    urgentTickets: 4,

    // Ground Operations
    voterSlipsDistributed: 142800,
    pendingUpdateRequests: 29,

    // Multi-Channel Outreach
    whatsappBroadcasts: 48200,
    aiVoiceCalls: 12450,

    // Turnout Trajectory
    projectedTurnoutPct: 68.4,
  );

  static const List<BoothReadinessItem> sampleBooths = [
    BoothReadinessItem(
      boothNumber: 42,
      location: "Shaniwar Peth Community Hall, Room 1",
      locationMr: "शनिवार पेठ समाज मंदिर, खोली १",
      totalVoters: 1180,
      surveyProgressPct: 88.5,
      assignedKaryakarta: "Mahesh Deshmukh",
      karyakartaPhone: "9822011223",
      isKaryakartaOnline: true,
      swingVoterCount: 142,
      status: BoothStatusType.safe,
    ),
    BoothReadinessItem(
      boothNumber: 104,
      location: "Kasba Ganpati Secondary School, Ground Floor",
      locationMr: "कसबा गणपती माध्यमिक शाळा, तळमजला",
      totalVoters: 1240,
      surveyProgressPct: 74.0,
      assignedKaryakarta: "Suresh Gaikwad",
      karyakartaPhone: "9822044556",
      isKaryakartaOnline: true,
      swingVoterCount: 310,
      status: BoothStatusType.battleground,
    ),
    BoothReadinessItem(
      boothNumber: 78,
      location: "Raviwar Peth Market Library",
      locationMr: "रविवार पेठ वाचनालय",
      totalVoters: 980,
      surveyProgressPct: 41.2,
      assignedKaryakarta: "Kishor Jadhav",
      karyakartaPhone: "9822077889",
      isKaryakartaOnline: false,
      swingVoterCount: 265,
      status: BoothStatusType.weak,
    ),
    BoothReadinessItem(
      boothNumber: 15,
      location: "Budhwar Peth Primary Health Post",
      locationMr: "बुधवार पेठ प्राथमिक आरोग्य केंद्र",
      totalVoters: 1050,
      surveyProgressPct: 91.0,
      assignedKaryakarta: "Anand Shinde",
      karyakartaPhone: "9822099001",
      isKaryakartaOnline: true,
      swingVoterCount: 88,
      status: BoothStatusType.safe,
    ),
    BoothReadinessItem(
      boothNumber: 162,
      location: "Mangalwar Peth ZP High School, West Wing",
      locationMr: "मंगळवार पेठ जि.प. हायस्कूल, पश्चिम विंग",
      totalVoters: 1320,
      surveyProgressPct: 62.5,
      assignedKaryakarta: "Dattatray Pawar",
      karyakartaPhone: "9822033445",
      isKaryakartaOnline: true,
      swingVoterCount: 380,
      status: BoothStatusType.battleground,
    ),
    BoothReadinessItem(
      boothNumber: 198,
      location: "Bhavani Peth Vyapari Bhavan",
      locationMr: "भवानी पेठ व्यापारी भवन",
      totalVoters: 1110,
      surveyProgressPct: 38.0,
      assignedKaryakarta: "Nilesh Kulkarni",
      karyakartaPhone: "9822055667",
      isKaryakartaOnline: false,
      swingVoterCount: 410,
      status: BoothStatusType.weak,
    ),
  ];

  static const List<HourlyTurnoutPoint> hourlyTurnoutTrend = [
    HourlyTurnoutPoint(
      timeLabel: "7 AM",
      actualTurnoutPct: 8.5,
      targetTurnoutPct: 8.0,
      note: "Early morning surge in senior citizens",
    ),
    HourlyTurnoutPoint(
      timeLabel: "9 AM",
      actualTurnoutPct: 19.2,
      targetTurnoutPct: 18.0,
      note: "High footfall in Peth areas",
    ),
    HourlyTurnoutPoint(
      timeLabel: "11 AM",
      actualTurnoutPct: 34.6,
      targetTurnoutPct: 32.5,
      note: "Peak family turnout",
    ),
    HourlyTurnoutPoint(
      timeLabel: "1 PM",
      actualTurnoutPct: 44.8,
      targetTurnoutPct: 46.0,
      note: "Afternoon slowdown as expected",
    ),
    HourlyTurnoutPoint(
      timeLabel: "3 PM",
      actualTurnoutPct: 53.2,
      targetTurnoutPct: 55.0,
      note: "Youth turnout accelerating",
    ),
    HourlyTurnoutPoint(
      timeLabel: "5 PM",
      actualTurnoutPct: 64.1,
      targetTurnoutPct: 66.0,
      note: "Final voting queue surge",
    ),
    HourlyTurnoutPoint(
      timeLabel: "6 PM (Proj)",
      actualTurnoutPct: 68.4,
      targetTurnoutPct: 70.0,
      note: "Estimated final turnout projection",
    ),
  ];
}
