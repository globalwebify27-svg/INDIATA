import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/telemetry_kpi.dart';

class SentimentDistributionCard extends StatelessWidget {
  final TelemetryKPIs kpis;
  final CandidateColors c;
  final Function(String sentimentType)? onSelectSentiment;

  const SentimentDistributionCard({
    super.key,
    required this.kpis,
    required this.c,
    this.onSelectSentiment,
  });

  @override
  Widget build(BuildContext context) {
    final favorablePct = kpis.favorablePct;
    final swingPct = kpis.swingPct;
    final oppositionPct = kpis.oppositionPct;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.psychology_alt_rounded, size: 18, color: Color(0xFF6366F1)),
                  const SizedBox(width: 8),
                  Text(
                    "VOTER SENTIMENT TRIAD",
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.1,
                      color: c.textMuted,
                    ),
                  ),
                ],
              ),
              Text(
                "${kpis.surveysCompleted.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')} Surveyed",
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: c.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Proportional Multi-Segmented Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              height: 12,
              child: Row(
                children: [
                  Expanded(
                    flex: (favorablePct * 10).round(),
                    child: Container(
                      color: const Color(0xFF10B981), // Emerald
                    ),
                  ),
                  const SizedBox(width: 2),
                  Expanded(
                    flex: (swingPct * 10).round(),
                    child: Container(
                      color: const Color(0xFFF59E0B), // Amber
                    ),
                  ),
                  const SizedBox(width: 2),
                  Expanded(
                    flex: (oppositionPct * 10).round(),
                    child: Container(
                      color: const Color(0xFFEF4444), // Rose
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),

          // 3-Tier Legend Items
          Row(
            children: [
              Expanded(
                child: _buildLegendItem(
                  label: "Supporters",
                  labelMr: "अनुकूल",
                  pct: "${favorablePct.toStringAsFixed(1)}%",
                  count: "${(kpis.favorableSupporters / 1000).toStringAsFixed(1)}k",
                  color: const Color(0xFF10B981),
                  onTap: () => onSelectSentiment?.call("favorable"),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildLegendItem(
                  label: "Swing Voters",
                  labelMr: "तटस्थ / डळमळीत",
                  pct: "${swingPct.toStringAsFixed(1)}%",
                  count: "${(kpis.swingVoters / 1000).toStringAsFixed(1)}k",
                  color: const Color(0xFFF59E0B),
                  onTap: () => onSelectSentiment?.call("swing"),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildLegendItem(
                  label: "Opposition",
                  labelMr: "प्रतिकूल",
                  pct: "${oppositionPct.toStringAsFixed(1)}%",
                  count: "${(kpis.oppositionVoters / 1000).toStringAsFixed(1)}k",
                  color: const Color(0xFFEF4444),
                  onTap: () => onSelectSentiment?.call("opposition"),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem({
    required String label,
    required String labelMr,
    required String pct,
    required String count,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                ),
                const SizedBox(width: 6),
                Flexible(
                  child: Text(
                    label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: c.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  pct,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: color,
                  ),
                ),
                Text(
                  count,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: c.textMuted,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
