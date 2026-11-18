import 'package:flutter/material.dart';

class AiAction {
  final String label;
  final String actionKey;
  final IconData icon;
  final Color color;

  const AiAction({
    required this.label,
    required this.actionKey,
    required this.icon,
    this.color = const Color(0xFF4F46E5),
  });
}

class AiMessage {
  final String id;
  final String role; // "user" or "assistant"
  final String text;
  final DateTime timestamp;
  final List<AiAction>? actions;
  final String? codeSnippet;

  const AiMessage({
    required this.id,
    required this.role,
    required this.text,
    required this.timestamp,
    this.actions,
    this.codeSnippet,
  });
}
