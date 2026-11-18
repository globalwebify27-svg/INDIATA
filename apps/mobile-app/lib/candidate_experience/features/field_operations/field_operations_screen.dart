import 'package:flutter/material.dart';
import '../../core/theme/candidate_theme.dart';
import '../../core/components/section_header.dart';
import '../karyakartas/screens/karyakarta_list_screen.dart';
import 'widgets/interactive_map_canvas.dart';
import 'screens/blo_directory_screen.dart';

class FieldOperationsScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const FieldOperationsScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<FieldOperationsScreen> createState() => _FieldOperationsScreenState();
}

class _FieldOperationsScreenState extends State<FieldOperationsScreen> {
  int _activeSegment = 0; // 0=Live Map, 1=Workforce, 2=Govt BLOs & Booths

  final List<Map<String, String>> _liveActivityFeed = [
    {
      "worker": "Mahesh Deshmukh",
      "booth": "42",
      "action": "Doorstep Survey Completed for Rajesh Patil (Supporter)",
      "time": "2 mins ago",
      "location": "Shaniwar Wada Lane 4",
      "status": "Green",
    },
    {
      "worker": "Suresh Gaikwad",
      "booth": "104",
      "action": "Citizen Stance Update Request: Swing -> Supporter",
      "time": "8 mins ago",
      "location": "Kasba Ganpati Temple Road",
      "status": "Amber",
    },
    {
      "worker": "Anand Shinde",
      "booth": "15",
      "action": "Voter Information Slip Distributed (Part 15 / Serial 210)",
      "time": "14 mins ago",
      "location": "Budhwar Peth Hospital Post",
      "status": "Green",
    },
    {
      "worker": "Dattatray Pawar",
      "booth": "162",
      "action": "Civic Grievance Logged: Low water pressure morning line",
      "time": "26 mins ago",
      "location": "Mangalwar Peth ZP Complex",
      "status": "Red",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    return Column(
      children: [
        // Top Segmented Switcher
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: c.cardBorder),
            ),
            child: Row(
              children: [
                _segmentTab("🗺️ Live Map", 0, c),
                _segmentTab("👷 Workforce (184)", 1, c),
                _segmentTab("🏛️ Govt BLOs (215)", 2, c),
              ],
            ),
          ),
        ),

        // Body Content
        Expanded(
          child: IndexedStack(
            index: _activeSegment,
            children: [
              _buildLiveMapTelemetry(c),
              KaryakartaListScreen(c: c, isDark: widget.isDark),
              BloDirectoryScreen(c: c, isDark: widget.isDark),
            ],
          ),
        ),
      ],
    );
  }

  Widget _segmentTab(String label, int index, CandidateColors c) {
    final isSelected = _activeSegment == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _activeSegment = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF4F46E5) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : c.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLiveMapTelemetry(CandidateColors c) {
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        // 1. Interactive Vector Map Canvas with 4 Toggles
        InteractiveMapCanvas(
          c: c,
          isDark: widget.isDark,
          onNavigateToBoothVoters: () {
            // Jump to booth voters
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Inspecting booth voters in Total Voters tab...")),
            );
          },
        ),
        const SizedBox(height: 12),

        // 2. Real-Time Telemetry Feed Header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: SectionHeader(
            c: c,
            title: "Live Field Activity Telemetry",
            subtitle: "Real-time survey completions & voter slips",
            actionLabel: "Clear Feed",
            onAction: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Field telemetry feed refreshed.")),
              );
            },
          ),
        ),
        const SizedBox(height: 6),

        // 3. Activity Feed List
        ListView.separated(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _liveActivityFeed.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final item = _liveActivityFeed[index];
            Color statusColor;
            switch (item["status"]) {
              case "Green":
                statusColor = const Color(0xFF10B981);
                break;
              case "Amber":
                statusColor = const Color(0xFFF59E0B);
                break;
              case "Red":
                statusColor = const Color(0xFFEF4444);
                break;
              default:
                statusColor = const Color(0xFF6366F1);
            }

            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: c.cardBorder),
              ),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      item["status"] == "Green" ? Icons.check_circle_outline_rounded : Icons.radar_rounded,
                      size: 16,
                      color: statusColor,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "${item["worker"]} (Booth #${item["booth"]})",
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary),
                            ),
                            Text(item["time"]!, style: TextStyle(fontSize: 9.5, color: c.textMuted)),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          item["action"]!,
                          style: TextStyle(fontSize: 11, color: c.textSecondary),
                        ),
                        Text(
                          "📍 ${item["location"]}",
                          style: TextStyle(fontSize: 9.5, color: c.textMuted),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}
