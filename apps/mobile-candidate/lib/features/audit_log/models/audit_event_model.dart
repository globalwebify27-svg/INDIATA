import 'package:flutter/material.dart';

enum AuditCategory {
  authentication,
  campaigns,
  voterRoll,
  grievances,
  security,
  system,
}

enum AuditSeverity {
  info,
  warning,
  critical,
}

class AuditEvent {
  final String id;
  final String actionTitle;
  final String actorName;
  final String actorRole;
  final AuditCategory category;
  final String timestamp;
  final String ipAddress;
  final String device;
  final String details;
  final AuditSeverity severity;

  const AuditEvent({
    required this.id,
    required this.actionTitle,
    required this.actorName,
    required this.actorRole,
    required this.category,
    required this.timestamp,
    required this.ipAddress,
    required this.device,
    required this.details,
    this.severity = AuditSeverity.info,
  });

  String get categoryLabel {
    switch (category) {
      case AuditCategory.authentication:
        return "AUTH";
      case AuditCategory.campaigns:
        return "CAMPAIGN";
      case AuditCategory.voterRoll:
        return "VOTER ROLL";
      case AuditCategory.grievances:
        return "GRIEVANCE";
      case AuditCategory.security:
        return "SECURITY";
      case AuditCategory.system:
        return "SYSTEM";
    }
  }

  Color get categoryColor {
    switch (category) {
      case AuditCategory.authentication:
        return Colors.blue;
      case AuditCategory.campaigns:
        return Colors.indigo;
      case AuditCategory.voterRoll:
        return Colors.teal;
      case AuditCategory.grievances:
        return Colors.amber.shade800;
      case AuditCategory.security:
        return Colors.red;
      case AuditCategory.system:
        return Colors.grey.shade700;
    }
  }

  IconData get categoryIcon {
    switch (category) {
      case AuditCategory.authentication:
        return Icons.login_rounded;
      case AuditCategory.campaigns:
        return Icons.campaign_rounded;
      case AuditCategory.voterRoll:
        return Icons.how_to_reg_rounded;
      case AuditCategory.grievances:
        return Icons.receipt_long_rounded;
      case AuditCategory.security:
        return Icons.security_rounded;
      case AuditCategory.system:
        return Icons.sync_rounded;
    }
  }
}
