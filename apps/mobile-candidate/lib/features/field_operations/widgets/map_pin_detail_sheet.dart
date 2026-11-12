import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/map_pin_model.dart';

class MapPinDetailSheet extends StatelessWidget {
  final MapPinModel pin;
  final CandidateColors c;
  final VoidCallback? onActionTriggered;

  const MapPinDetailSheet({
    super.key,
    required this.pin,
    required this.c,
    this.onActionTriggered,
  });

  static void show(BuildContext context, MapPinModel pin, CandidateColors c, {VoidCallback? onAction}) {
    showModalBottomSheet(
      context: context,
      backgroundColor: c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => MapPinDetailSheet(pin: pin, c: c, onActionTriggered: onAction),
    );
  }

  @override
  Widget build(BuildContext context) {
    switch (pin.type) {
      case MapPinType.worker:
        return _buildWorkerSheet(context);
      case MapPinType.booth:
        return _buildBoothSheet(context);
      case MapPinType.grievance:
        return _buildGrievanceSheet(context);
      case MapPinType.voterCluster:
        return _buildClusterSheet(context);
    }
  }

  Widget _buildWorkerSheet(BuildContext context) {
    final meta = pin.metadata as Map<String, dynamic>;
    final phone = meta["phone"] ?? "9822011223";

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.navigation_rounded, color: Color(0xFF10B981), size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pin.title,
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Text(
                      "Booth #${meta["booth"]} • ${meta["location"]}",
                      style: TextStyle(fontSize: 12, color: c.textSecondary),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  meta["velocity"] ?? "+28 today",
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1),
          const SizedBox(height: 12),

          _sheetRow("Live GPS Coordinates", "${pin.latitude}° N, ${pin.longitude}° E", isMono: true),
          _sheetRow("Surveys Completed", meta["surveys"] ?? "1,045 Done"),
          _sheetRow("Heartbeat Status", "Active GPS Signal Verified"),
          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Calling ${pin.title} (+91 $phone)...")),
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
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Opening WhatsApp with ${pin.title}...")),
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
        ],
      ),
    );
  }

  Widget _buildBoothSheet(BuildContext context) {
    final meta = pin.metadata as Map<String, dynamic>;
    final statusColor = pin.status == "SAFE"
        ? const Color(0xFF10B981)
        : (pin.status == "BATTLEGROUND" ? const Color(0xFFF59E0B) : const Color(0xFFEF4444));

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.how_to_vote_rounded, color: statusColor, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pin.title,
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Text(
                      pin.subtitle,
                      style: TextStyle(fontSize: 11, color: c.textSecondary),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  pin.status,
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: statusColor),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1),
          const SizedBox(height: 12),

          _sheetRow("Registered Voters", "${meta["voters"]} Voters"),
          _sheetRow("Assigned President", meta["president"] ?? "Mahesh Deshmukh"),
          _sheetRow("Survey Coverage", "${meta["progress"]}% Surveyed"),
          _sheetRow("Swing Voter Target", "${meta["swing"]} Persuadable Voters"),
          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            height: 44,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.pop(context);
                onActionTriggered?.call();
              },
              icon: const Icon(Icons.groups_rounded, size: 18),
              label: Text("Inspect Booth #${meta["boothNumber"]} Voters"),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGrievanceSheet(BuildContext context) {
    final meta = pin.metadata as Map<String, dynamic>;

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFEF4444).withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.report_problem_outlined, color: Color(0xFFEF4444), size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pin.title,
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Text(
                      pin.subtitle,
                      style: TextStyle(fontSize: 11, color: c.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1),
          const SizedBox(height: 12),

          _sheetRow("Category", meta["category"] ?? "Water Supply"),
          _sheetRow("Priority", meta["priority"] ?? "High Priority"),
          _sheetRow("Resolution Status", meta["status"] ?? "IN_PROGRESS"),
          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            height: 44,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Routing to Office & Grievances ticket queue...")),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text("View Ticket in Office Hub"),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildClusterSheet(BuildContext context) {
    final meta = pin.metadata as Map<String, dynamic>;

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.hub_rounded, color: Color(0xFF6366F1), size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pin.title,
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Text(
                      pin.subtitle,
                      style: TextStyle(fontSize: 11, color: c.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1),
          const SizedBox(height: 12),

          _sheetRow("Electorate Volume", "${meta["voters"]} Registered Voters"),
          _sheetRow("Encompassed Booths", "${meta["booths"]} Polling Booths"),
          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            height: 44,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text("Close Cluster View"),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sheetRow(String label, String value, {bool isMono = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: c.textSecondary)),
          Text(
            value,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              fontFamily: isMono ? 'monospace' : null,
              color: c.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
