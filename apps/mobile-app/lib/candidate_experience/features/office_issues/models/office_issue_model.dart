import 'package:flutter/material.dart';

enum GrievanceCategory {
  waterSupply,
  drainageSewerage,
  roadsTraffic,
  streetlights,
  wadaRedevelopment,
  govtScheme,
  healthcare,
  policeLegal,
}

enum GrievancePriority {
  low,
  medium,
  high,
  critical,
}

enum GrievanceStatus {
  ticketNew,
  inProgress,
  resolved,
  closed,
}

class VisitorRecord {
  final String id;
  final String name;
  final String phone;
  final String pethOrWard;
  final String purpose;
  final String status; // WAITING, WITH_CANDIDATE, COMPLETED, FOLLOW_UP
  final String timeIn;
  final String notes;

  const VisitorRecord({
    required this.id,
    required this.name,
    required this.phone,
    required this.pethOrWard,
    required this.purpose,
    required this.status,
    required this.timeIn,
    required this.notes,
  });

  Color get statusColor {
    switch (status) {
      case "WAITING":
        return Colors.amber;
      case "WITH_CANDIDATE":
        return Colors.blue;
      case "COMPLETED":
        return Colors.green;
      case "FOLLOW_UP":
      default:
        return Colors.purple;
    }
  }
}

class GrievanceTicket {
  final String id;
  final String citizenName;
  final String citizenPhone;
  final String pethOrWard;
  final int boothNumber;
  final GrievanceCategory category;
  final String title;
  final String description;
  final GrievancePriority priority;
  GrievanceStatus status;
  final String assignedWorkerName;
  final String assignedWorkerPhone;
  final String createdAt;
  String? resolutionNotes;
  int? satisfactionRating; // 1 to 5

  GrievanceTicket({
    required this.id,
    required this.citizenName,
    required this.citizenPhone,
    required this.pethOrWard,
    required this.boothNumber,
    required this.category,
    required this.title,
    required this.description,
    required this.priority,
    required this.status,
    required this.assignedWorkerName,
    required this.assignedWorkerPhone,
    required this.createdAt,
    this.resolutionNotes,
    this.satisfactionRating,
  });

  String get categoryLabel {
    switch (category) {
      case GrievanceCategory.waterSupply:
        return "Water Supply & Pressure";
      case GrievanceCategory.drainageSewerage:
        return "Drainage & Sewerage";
      case GrievanceCategory.roadsTraffic:
        return "Roads, Potholes & Traffic";
      case GrievanceCategory.streetlights:
        return "Streetlights & Electricity";
      case GrievanceCategory.wadaRedevelopment:
        return "Old Wada Redevelopment";
      case GrievanceCategory.govtScheme:
        return "Govt Welfare Scheme (DBT)";
      case GrievanceCategory.healthcare:
        return "Healthcare / Hospital Aid";
      case GrievanceCategory.policeLegal:
        return "Police / Legal Assistance";
    }
  }

  IconData get categoryIcon {
    switch (category) {
      case GrievanceCategory.waterSupply:
        return Icons.water_drop_rounded;
      case GrievanceCategory.drainageSewerage:
        return Icons.plumbing_rounded;
      case GrievanceCategory.roadsTraffic:
        return Icons.traffic_rounded;
      case GrievanceCategory.streetlights:
        return Icons.lightbulb_rounded;
      case GrievanceCategory.wadaRedevelopment:
        return Icons.home_work_rounded;
      case GrievanceCategory.govtScheme:
        return Icons.account_balance_rounded;
      case GrievanceCategory.healthcare:
        return Icons.local_hospital_rounded;
      case GrievanceCategory.policeLegal:
        return Icons.gavel_rounded;
    }
  }

  Color get priorityColor {
    switch (priority) {
      case GrievancePriority.critical:
        return Colors.red;
      case GrievancePriority.high:
        return Colors.deepOrange;
      case GrievancePriority.medium:
        return Colors.amber.shade700;
      case GrievancePriority.low:
        return Colors.blue;
    }
  }

  String get priorityLabel {
    switch (priority) {
      case GrievancePriority.critical:
        return "CRITICAL";
      case GrievancePriority.high:
        return "HIGH";
      case GrievancePriority.medium:
        return "MEDIUM";
      case GrievancePriority.low:
        return "LOW";
    }
  }

  Color get statusColor {
    switch (status) {
      case GrievanceStatus.ticketNew:
        return Colors.blue;
      case GrievanceStatus.inProgress:
        return Colors.amber.shade800;
      case GrievanceStatus.resolved:
        return Colors.green;
      case GrievanceStatus.closed:
        return Colors.grey;
    }
  }

  String get statusLabel {
    switch (status) {
      case GrievanceStatus.ticketNew:
        return "NEW";
      case GrievanceStatus.inProgress:
        return "IN PROGRESS";
      case GrievanceStatus.resolved:
        return "RESOLVED";
      case GrievanceStatus.closed:
        return "CLOSED";
    }
  }
}
