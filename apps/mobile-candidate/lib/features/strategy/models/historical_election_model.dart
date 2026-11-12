import 'package:flutter/material.dart';

class CandidateVoteShare {
  final String name;
  final String party;
  final int votes;
  final double percentage;
  final bool isWinner;
  final Color partyColor;

  const CandidateVoteShare({
    required this.name,
    required this.party,
    required this.votes,
    required this.percentage,
    required this.isWinner,
    required this.partyColor,
  });
}

class HistoricalElection {
  final String id;
  final int year;
  final String name;
  final String nameMr;
  final String type; // General Assembly, By-Election, Lok Sabha Segment
  final double turnoutPercentage;
  final int totalVotesPolled;
  final String winningMargin;
  final String winnerSummary;
  final String keyTakeaway;
  final List<CandidateVoteShare> results;

  const HistoricalElection({
    required this.id,
    required this.year,
    required this.name,
    required this.nameMr,
    required this.type,
    required this.turnoutPercentage,
    required this.totalVotesPolled,
    required this.winningMargin,
    required this.winnerSummary,
    required this.keyTakeaway,
    required this.results,
  });
}

class PethSwingData {
  final String pethName;
  final String pethNameMr;
  final int totalBooths;
  final String historicalMargin;
  final String swingStatus; // FORTRESS, BATTLEGROUND, AT_RISK, FAVORABLE
  final Color statusColor;
  final String strategicAction;

  const PethSwingData({
    required this.pethName,
    required this.pethNameMr,
    required this.totalBooths,
    required this.historicalMargin,
    required this.swingStatus,
    required this.statusColor,
    required this.strategicAction,
  });
}

class StrategyPlaybook {
  final String id;
  final String title;
  final String category;
  final String objective;
  final List<String> actionSteps;
  final IconData icon;

  const StrategyPlaybook({
    required this.id,
    required this.title,
    required this.category,
    required this.objective,
    required this.actionSteps,
    required this.icon,
  });
}

class StrategyBotQA {
  final String id;
  final String query;
  final String queryMr;
  final String answer;
  final String category;

  const StrategyBotQA({
    required this.id,
    required this.query,
    required this.queryMr,
    required this.answer,
    required this.category,
  });
}
