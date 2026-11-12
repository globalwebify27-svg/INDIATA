import 'package:flutter/material.dart';

enum ReportCategory {
  electorate,
  workforce,
  sentimentAndBooths,
  campaignsAndGovernance,
}

class ReportMetricRow {
  final String label;
  final String value;
  final String percentage;
  final Color? color;

  const ReportMetricRow({
    required this.label,
    required this.value,
    this.percentage = "",
    this.color,
  });
}

class ReportModel {
  final int number; // 1 to 14
  final String id;
  final String title;
  final String titleMr;
  final ReportCategory category;
  final String description;
  final IconData icon;
  final Color accentColor;
  final String keySummary;
  final List<ReportMetricRow> tableData;
  final String strategicInsight;

  const ReportModel({
    required this.number,
    required this.id,
    required this.title,
    required this.titleMr,
    required this.category,
    required this.description,
    required this.icon,
    required this.accentColor,
    required this.keySummary,
    required this.tableData,
    required this.strategicInsight,
  });

  String get categoryLabel {
    switch (category) {
      case ReportCategory.electorate:
        return "Electorate Demographics";
      case ReportCategory.workforce:
        return "Workforce & Operations";
      case ReportCategory.sentimentAndBooths:
        return "Sentiment & Booth Strategy";
      case ReportCategory.campaignsAndGovernance:
        return "Campaigns & Governance";
    }
  }
}
