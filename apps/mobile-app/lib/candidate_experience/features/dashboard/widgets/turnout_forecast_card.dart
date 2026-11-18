import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/telemetry_kpi.dart';
import '../data/dashboard_mock_data.dart';

class TurnoutForecastCard extends StatelessWidget {
  final CandidateColors c;
  final double projectedPct;

  const TurnoutForecastCard({
    super.key,
    required this.c,
    this.projectedPct = 68.4,
  });

  @override
  Widget build(BuildContext context) {
    final points = DashboardMockData.hourlyTurnoutTrend;

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
                  const Icon(Icons.show_chart_rounded, size: 18, color: Color(0xFF10B981)),
                  const SizedBox(width: 8),
                  Text(
                    "PROJECTED TURNOUT TRAJECTORY",
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.1,
                      color: c.textMuted,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  "+4.2% vs 2019",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF10B981),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                "${projectedPct.toStringAsFixed(1)}%",
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: c.textPrimary,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                "Estimated Final Turnout",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: c.textSecondary,
                ),
              ),
              const Spacer(),
              Text(
                "Win Target: 70.0%",
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF6366F1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Hourly Progression Graph Bars
          SizedBox(
            height: 90,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: points.map((p) {
                final isLast = p == points.last;
                final barHeight = (p.actualTurnoutPct / 75.0) * 65; // scale to 65px
                return Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      "${p.actualTurnoutPct.toStringAsFixed(0)}%",
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: isLast ? FontWeight.bold : FontWeight.w500,
                        color: isLast ? const Color(0xFF4F46E5) : c.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      width: 24,
                      height: barHeight,
                      decoration: BoxDecoration(
                        color: isLast
                            ? const Color(0xFF4F46E5)
                            : (p.actualTurnoutPct >= p.targetTurnoutPct
                                ? const Color(0xFF10B981)
                                : const Color(0xFFF59E0B)),
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      p.timeLabel,
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w600,
                        color: c.textMuted,
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 10),

          // Momentum Note
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: c.scaffoldBg,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                const Icon(Icons.insights_rounded, size: 14, color: Color(0xFF6366F1)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "Strong morning surge in Peth core. Mobilize youth wings for 3 PM - 5 PM battleground push.",
                    style: TextStyle(fontSize: 11, color: c.textSecondary),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
