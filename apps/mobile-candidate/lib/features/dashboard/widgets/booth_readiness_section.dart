import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/telemetry_kpi.dart';
import '../data/dashboard_mock_data.dart';

class BoothReadinessSection extends StatefulWidget {
  final CandidateColors c;
  final Function(BoothReadinessItem booth)? onSelectBooth;

  const BoothReadinessSection({
    super.key,
    required this.c,
    this.onSelectBooth,
  });

  @override
  State<BoothReadinessSection> createState() => _BoothReadinessSectionState();
}

class _BoothReadinessSectionState extends State<BoothReadinessSection> {
  int _statusFilter = 0; // 0: All, 1: Battleground, 2: Weak, 3: Safe

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final allBooths = DashboardMockData.sampleBooths;

    List<BoothReadinessItem> filteredBooths = allBooths;
    if (_statusFilter == 1) {
      filteredBooths = allBooths.where((b) => b.status == BoothStatusType.battleground).toList();
    } else if (_statusFilter == 2) {
      filteredBooths = allBooths.where((b) => b.status == BoothStatusType.weak).toList();
    } else if (_statusFilter == 3) {
      filteredBooths = allBooths.where((b) => b.status == BoothStatusType.safe).toList();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.how_to_vote_rounded, size: 18, color: Color(0xFF6366F1)),
                  const SizedBox(width: 8),
                  Text(
                    "BOOTH READINESS MATRIX",
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
                "215 Total Booths",
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: c.textSecondary),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),

        // Status Filter Chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              _filterChip(0, "All (${allBooths.length})", null),
              _filterChip(1, "Battleground (2)", const Color(0xFFF59E0B)),
              _filterChip(2, "Weak (2)", const Color(0xFFEF4444)),
              _filterChip(3, "Safe (2)", const Color(0xFF10B981)),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Booth Cards List
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: filteredBooths.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final booth = filteredBooths[index];
            return _buildBoothCard(booth, c);
          },
        ),
      ],
    );
  }

  Widget _filterChip(int index, String label, Color? accentColor) {
    final isSel = _statusFilter == index;
    final c = widget.c;

    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(label),
        selected: isSel,
        selectedColor: accentColor ?? const Color(0xFF4F46E5),
        backgroundColor: c.cardBg,
        labelStyle: TextStyle(
          fontSize: 11,
          fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
          color: isSel ? Colors.white : c.textSecondary,
        ),
        side: BorderSide(
          color: isSel ? (accentColor ?? const Color(0xFF4F46E5)) : c.cardBorder,
        ),
        onSelected: (val) {
          if (val) setState(() => _statusFilter = index);
        },
      ),
    );
  }

  Widget _buildBoothCard(BoothReadinessItem b, CandidateColors c) {
    Color statusColor;
    String statusLabel;

    switch (b.status) {
      case BoothStatusType.safe:
        statusColor = const Color(0xFF10B981);
        statusLabel = "SAFE LEAD";
        break;
      case BoothStatusType.battleground:
        statusColor = const Color(0xFFF59E0B);
        statusLabel = "BATTLEGROUND";
        break;
      case BoothStatusType.weak:
        statusColor = const Color(0xFFEF4444);
        statusLabel = "DEFICIT / WEAK";
        break;
    }

    return InkWell(
      onTap: () => widget.onSelectBooth?.call(b),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: c.cardBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: c.cardBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Booth Number Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF4F46E5).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.4)),
                  ),
                  child: Text(
                    "BOOTH #${b.boothNumber}",
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF6366F1),
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Status Tag
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    statusLabel,
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: statusColor,
                    ),
                  ),
                ),
                const Spacer(),

                // Electorate Count
                Text(
                  "${b.totalVoters} Voters",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textSecondary),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Location
            Text(
              b.location,
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              b.locationMr,
              style: TextStyle(fontSize: 11, color: c.textSecondary),
            ),
            const SizedBox(height: 10),

            // Survey Progress Bar
            Row(
              children: [
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: b.surveyProgressPct / 100.0,
                      backgroundColor: c.scaffoldBg,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        b.surveyProgressPct >= 75 ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                      ),
                      minHeight: 6,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  "${b.surveyProgressPct.toStringAsFixed(1)}% Surveyed",
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textSecondary),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Assigned Worker & Call CTA
            Row(
              children: [
                // Online Dot
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: b.isKaryakartaOnline ? const Color(0xFF10B981) : const Color(0xFF94A3B8),
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  b.assignedKaryakarta,
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: c.textPrimary),
                ),
                const SizedBox(width: 6),
                Text(
                  b.isKaryakartaOnline ? "(On-Duty)" : "(Offline)",
                  style: TextStyle(
                    fontSize: 10,
                    color: b.isKaryakartaOnline ? const Color(0xFF10B981) : c.textMuted,
                  ),
                ),
                const Spacer(),

                // Swing Count Tag
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF59E0B).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    "${b.swingVoterCount} Swing",
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFD97706)),
                  ),
                ),
                const SizedBox(width: 8),

                // Call Action Icon
                InkWell(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Calling Booth President ${b.assignedKaryakarta} (${b.karyakartaPhone})")),
                    );
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF4F46E5).withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.call_rounded, size: 14, color: Color(0xFF4F46E5)),
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
