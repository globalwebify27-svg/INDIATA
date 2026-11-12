import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';

class QuickWarRoomActions extends StatelessWidget {
  final CandidateColors c;
  final VoidCallback onOpenBroadcast;
  final VoidCallback onOpenFieldMap;
  final VoidCallback onFilterSwingVoters;
  final VoidCallback onOpenIssues;
  final VoidCallback onOpenAiMode;
  final VoidCallback onExportReport;

  const QuickWarRoomActions({
    super.key,
    required this.c,
    required this.onOpenBroadcast,
    required this.onOpenFieldMap,
    required this.onFilterSwingVoters,
    required this.onOpenIssues,
    required this.onOpenAiMode,
    required this.onExportReport,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              const Icon(Icons.bolt_rounded, size: 18, color: Color(0xFFF59E0B)),
              const SizedBox(width: 8),
              Text(
                "WAR ROOM QUICK COMMANDS",
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1,
                  color: c.textMuted,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              _commandButton(
                icon: Icons.campaign_rounded,
                label: "Broadcast Alert",
                accent: const Color(0xFF6366F1),
                onTap: onOpenBroadcast,
              ),
              _commandButton(
                icon: Icons.map_rounded,
                label: "Live Field Map",
                accent: const Color(0xFF10B981),
                onTap: onOpenFieldMap,
              ),
              _commandButton(
                icon: Icons.shuffle_rounded,
                label: "Swing Target List",
                accent: const Color(0xFFF59E0B),
                onTap: onFilterSwingVoters,
              ),
              _commandButton(
                icon: Icons.smart_toy_rounded,
                label: "AI Strategy Copilot",
                accent: const Color(0xFF8B5CF6),
                onTap: onOpenAiMode,
              ),
              _commandButton(
                icon: Icons.confirmation_number_outlined,
                label: "Citizen Grievances",
                accent: const Color(0xFFEF4444),
                onTap: onOpenIssues,
              ),
              _commandButton(
                icon: Icons.picture_as_pdf_outlined,
                label: "EOD Briefing PDF",
                accent: const Color(0xFF0EA5E9),
                onTap: onExportReport,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _commandButton({
    required IconData icon,
    required String label,
    required Color accent,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.only(right: 10),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 110,
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: c.cardBorder),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: accent.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, size: 20, color: accent),
              ),
              const SizedBox(height: 8),
              Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: c.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
