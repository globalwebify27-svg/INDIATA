import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/karyakarta_model.dart';

class KaryakartaDetailScreen extends StatelessWidget {
  final KaryakartaModel karyakarta;
  final CandidateColors c;
  final Function(KaryakartaModel updated)? onWorkerUpdated;

  const KaryakartaDetailScreen({
    super.key,
    required this.karyakarta,
    required this.c,
    this.onWorkerUpdated,
  });

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    String statusText;

    switch (karyakarta.status) {
      case KaryakartaStatus.onDuty:
        statusColor = const Color(0xFF10B981);
        statusText = "ON-DUTY (LIVE GPS)";
        break;
      case KaryakartaStatus.offDuty:
        statusColor = const Color(0xFF94A3B8);
        statusText = "OFF-DUTY";
        break;
      case KaryakartaStatus.inactive:
        statusColor = const Color(0xFFEF4444);
        statusText = "INACTIVE ALERT";
        break;
    }

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        backgroundColor: c.appBarBg,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: c.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Karyakarta Scorecard",
          style: TextStyle(color: c.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined, color: Color(0xFF4F46E5)),
            tooltip: "Reassign Worker",
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Reassigning booth for ${karyakarta.name}...")),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // WORKER HEADER CARD
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: c.cardBorder),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: const Color(0xFF4F46E5),
                        child: Text(
                          karyakarta.name.split(" ").map((w) => w[0]).take(2).join(),
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              karyakarta.name,
                              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: c.textPrimary),
                            ),
                            Text(
                              karyakarta.nameMr,
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: c.textSecondary),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              "${karyakarta.roleLabel} • Prabhaag #${karyakarta.assignedPrabhaag}",
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Divider(height: 1),
                  const SizedBox(height: 10),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Status Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: statusColor.withOpacity(0.4)),
                        ),
                        child: Text(
                          statusText,
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: statusColor),
                        ),
                      ),

                      // Assigned Booth
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF4F46E5).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          "ALLOCATED: BOOTH #${karyakarta.assignedBooth}",
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // QUICK ACTIONS (CALL, WHATSAPP, PING)
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("Calling ${karyakarta.name} (+91 ${karyakarta.mobile})...")),
                      );
                    },
                    icon: const Icon(Icons.call_rounded, size: 16),
                    label: const Text("Call Worker"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("Opening WhatsApp with ${karyakarta.name}...")),
                      );
                    },
                    icon: const Icon(Icons.chat_rounded, size: 16, color: Color(0xFF22C55E)),
                    label: const Text("WhatsApp", style: TextStyle(color: Color(0xFF22C55E))),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFF22C55E)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // PERFORMANCE METRICS SCORECARD
            Text(
              "GROUND PERFORMANCE TELEMETRY",
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: c.textMuted),
            ),
            const SizedBox(height: 10),

            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 1.4,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              children: [
                _metricTile("Doorstep Surveys", "${karyakarta.completedSurveys}", "${karyakarta.surveyProgressPct.toStringAsFixed(1)}% of ${karyakarta.targetSurveys} target", Icons.fact_check_rounded, const Color(0xFF10B981), c),
                _metricTile("Today's Velocity", "+${karyakarta.todaySurveys}", "Surveys completed today", Icons.speed_rounded, const Color(0xFF4F46E5), c),
                _metricTile("Voter Slips", "${karyakarta.distributedSlips}", "${karyakarta.slipProgressPct.toStringAsFixed(1)}% delivered", Icons.confirmation_number_outlined, const Color(0xFF06B6D4), c),
                _metricTile("Rank In Ward", "#3 Rank", "Top 5% velocity in Kasba", Icons.emoji_events_outlined, const Color(0xFFF59E0B), c),
              ],
            ),
            const SizedBox(height: 20),

            // LIVE GPS LOCATION & TELEMETRY
            Text(
              "FIELD PRESENCE & LAST KNOWN LOCATION",
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: c.textMuted),
            ),
            const SizedBox(height: 10),

            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: c.cardBorder),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on_rounded, size: 20, color: Color(0xFFEF4444)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              karyakarta.lastActiveLocation,
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
                            ),
                            Text(
                              karyakarta.lastActiveTime,
                              style: TextStyle(fontSize: 11, color: c.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  if (karyakarta.latitude != null) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: c.scaffoldBg,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.gps_fixed_rounded, size: 14, color: Color(0xFF6366F1)),
                          const SizedBox(width: 6),
                          Text(
                            "Coordinates: ${karyakarta.latitude}° N, ${karyakarta.longitude}° E",
                            style: const TextStyle(fontSize: 11, fontFamily: 'monospace'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 20),

            // INACTIVE ALERT BANNER (If flagged)
            if (karyakarta.isAlertInactive)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEE2E2),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFEF4444)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded, color: Color(0xFFEF4444), size: 24),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Text(
                        "Alert: This worker has recorded 0 surveys in the last 48 hours. Consider reassigning Booth #${198}.",
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF991B1B)),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _metricTile(String title, String val, String sub, IconData icon, Color color, CandidateColors c) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: c.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: c.textSecondary)),
              Icon(icon, size: 16, color: color),
            ],
          ),
          Text(val, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: c.textPrimary)),
          Text(sub, style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }
}
