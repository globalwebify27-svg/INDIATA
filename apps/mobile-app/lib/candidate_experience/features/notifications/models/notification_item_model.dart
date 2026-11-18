import 'package:flutter/material.dart';

enum NotificationChannel {
  system,
  engagement,
  intelligence,
  directives,
}

class NotificationItem {
  final String id;
  final NotificationChannel channel;
  final String title;
  final String body;
  final String timeAgo;
  bool isRead;
  final String? actionModule; // For deep-linking
  final String? actionLabel;

  NotificationItem({
    required this.id,
    required this.channel,
    required this.title,
    required this.body,
    required this.timeAgo,
    this.isRead = false,
    this.actionModule,
    this.actionLabel,
  });

  String get channelLabel {
    switch (channel) {
      case NotificationChannel.system:
        return "SYSTEM ALERT";
      case NotificationChannel.engagement:
        return "GROUND ENGAGEMENT";
      case NotificationChannel.intelligence:
        return "STRATEGIC INTEL";
      case NotificationChannel.directives:
        return "PARTY DIRECTIVE";
    }
  }

  Color get channelColor {
    switch (channel) {
      case NotificationChannel.system:
        return Colors.blue;
      case NotificationChannel.engagement:
        return Colors.green;
      case NotificationChannel.intelligence:
        return Colors.amber.shade800;
      case NotificationChannel.directives:
        return Colors.purple;
    }
  }

  IconData get channelIcon {
    switch (channel) {
      case NotificationChannel.system:
        return Icons.dns_rounded;
      case NotificationChannel.engagement:
        return Icons.directions_walk_rounded;
      case NotificationChannel.intelligence:
        return Icons.radar_rounded;
      case NotificationChannel.directives:
        return Icons.gavel_rounded;
    }
  }
}
