enum BoothStatusType {
  safe,
  battleground,
  weak,
}

class TelemetryKPIs {
  // 1-4: Electorate Demographics
  final int totalVoters;
  final int maleVoters;
  final int femaleVoters;
  final int otherVoters;

  // 5-7: Polling & Workforce
  final int totalBooths;
  final int totalKaryakartas;
  final int activeKaryakartas;

  // 8-9: Survey Progress
  final int surveysCompleted;
  final double surveyCoveragePct;

  // 10-12: Voter Sentiment Triad
  final int favorableSupporters;
  final int swingVoters;
  final int oppositionVoters;

  // 13-15: Booth Strategic Classification
  final int criticalBattlegroundBooths;
  final int safeBooths;
  final int weakBooths;

  // 16-17: Citizen Grievances
  final int openTickets;
  final int urgentTickets;

  // 18-19: Ground Operations
  final int voterSlipsDistributed;
  final int pendingUpdateRequests;

  // 20-21: Multi-Channel Outreach
  final int whatsappBroadcasts;
  final int aiVoiceCalls;

  // 22: Turnout Trajectory
  final double projectedTurnoutPct;

  const TelemetryKPIs({
    required this.totalVoters,
    required this.maleVoters,
    required this.femaleVoters,
    required this.otherVoters,
    required this.totalBooths,
    required this.totalKaryakartas,
    required this.activeKaryakartas,
    required this.surveysCompleted,
    required this.surveyCoveragePct,
    required this.favorableSupporters,
    required this.swingVoters,
    required this.oppositionVoters,
    required this.criticalBattlegroundBooths,
    required this.safeBooths,
    required this.weakBooths,
    required this.openTickets,
    required this.urgentTickets,
    required this.voterSlipsDistributed,
    required this.pendingUpdateRequests,
    required this.whatsappBroadcasts,
    required this.aiVoiceCalls,
    required this.projectedTurnoutPct,
  });

  double get favorablePct =>
      surveysCompleted > 0 ? (favorableSupporters / surveysCompleted) * 100 : 0.0;
  double get swingPct =>
      surveysCompleted > 0 ? (swingVoters / surveysCompleted) * 100 : 0.0;
  double get oppositionPct =>
      surveysCompleted > 0 ? (oppositionVoters / surveysCompleted) * 100 : 0.0;
  double get voterSlipsPct =>
      totalVoters > 0 ? (voterSlipsDistributed / totalVoters) * 100 : 0.0;
}

class BoothReadinessItem {
  final int boothNumber;
  final String location;
  final String locationMr;
  final int totalVoters;
  final double surveyProgressPct;
  final String assignedKaryakarta;
  final String karyakartaPhone;
  final bool isKaryakartaOnline;
  final int swingVoterCount;
  final BoothStatusType status;

  const BoothReadinessItem({
    required this.boothNumber,
    required this.location,
    required this.locationMr,
    required this.totalVoters,
    required this.surveyProgressPct,
    required this.assignedKaryakarta,
    required this.karyakartaPhone,
    required this.isKaryakartaOnline,
    required this.swingVoterCount,
    required this.status,
  });
}

class HourlyTurnoutPoint {
  final String timeLabel;
  final double actualTurnoutPct;
  final double targetTurnoutPct;
  final String note;

  const HourlyTurnoutPoint({
    required this.timeLabel,
    required this.actualTurnoutPct,
    required this.targetTurnoutPct,
    required this.note,
  });
}
