import 'package:flutter/material.dart';

class SavedFilterPreset {
  final String id;
  final String title;
  final String titleMr;
  final String description;
  final int matchedVotersCount;
  final IconData icon;
  final Color color;
  final List<String> activeFilterTags;

  const SavedFilterPreset({
    required this.id,
    required this.title,
    required this.titleMr,
    required this.description,
    required this.matchedVotersCount,
    required this.icon,
    required this.color,
    required this.activeFilterTags,
  });
}
