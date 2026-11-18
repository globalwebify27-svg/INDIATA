import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/karyakarta_model.dart';
import '../data/karyakarta_mock_data.dart';
import 'karyakarta_detail_screen.dart';
import 'add_karyakarta_sheet.dart';

class KaryakartaListScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const KaryakartaListScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<KaryakartaListScreen> createState() => _KaryakartaListScreenState();
}

class _KaryakartaListScreenState extends State<KaryakartaListScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<KaryakartaModel> _workers = [];
  int _statusFilter = 0; // 0=All, 1=OnDuty, 2=OffDuty, 3=InactiveAlerts

  @override
  void initState() {
    super.initState();
    _workers = List.from(KaryakartaMockData.karyakartas);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<KaryakartaModel> get _filteredWorkers {
    final q = _searchController.text.trim().toLowerCase();

    return _workers.where((w) {
      if (q.isNotEmpty) {
        final matchName = w.name.toLowerCase().contains(q);
        final matchNameMr = w.nameMr.contains(q);
        final matchMobile = w.mobile.contains(q);
        final matchBooth = w.assignedBooth.toString().contains(q);
        if (!matchName && !matchNameMr && !matchMobile && !matchBooth) {
          return false;
        }
      }

      if (_statusFilter == 1 && w.status != KaryakartaStatus.onDuty) return false;
      if (_statusFilter == 2 && w.status != KaryakartaStatus.offDuty) return false;
      if (_statusFilter == 3 && !w.isAlertInactive) return false;

      return true;
    }).toList();
  }

  void _openDetail(KaryakartaModel worker) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => KaryakartaDetailScreen(
          karyakarta: worker,
          c: widget.c,
          onWorkerUpdated: (updated) {
            setState(() {
              final idx = _workers.indexWhere((x) => x.id == updated.id);
              if (idx != -1) _workers[idx] = updated;
            });
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final results = _filteredWorkers;

    final onDutyCount = _workers.where((w) => w.status == KaryakartaStatus.onDuty).length;
    final offDutyCount = _workers.where((w) => w.status == KaryakartaStatus.offDuty).length;
    final alertCount = _workers.where((w) => w.isAlertInactive).length;

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      body: Column(
        children: [
          // 1. Search Bar & Status Chips
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            color: c.appBarBg,
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  style: TextStyle(color: c.textPrimary, fontSize: 13),
                  decoration: InputDecoration(
                    hintText: "Search Worker, Phone, Booth #...",
                    hintStyle: TextStyle(fontSize: 12, color: c.textMuted),
                    prefixIcon: const Icon(Icons.search_rounded, size: 20, color: Color(0xFF6366F1)),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {});
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: c.cardBg,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: c.cardBorder),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: c.cardBorder),
                    ),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 10),

                // Status Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _statusChip(0, "All (${_workers.length})", null),
                      _statusChip(1, "On-Duty ($onDutyCount)", const Color(0xFF10B981)),
                      _statusChip(2, "Off-Duty ($offDutyCount)", const Color(0xFF94A3B8)),
                      _statusChip(3, "Inactive Alerts ($alertCount)", const Color(0xFFEF4444)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // 2. Summary Counter
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: c.scaffoldBg,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Workforce: ${results.length} of 184 Total Field Surveyors",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textMuted),
                ),
                Text(
                  "Active SLA: 99.4%",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF10B981)),
                ),
              ],
            ),
          ),

          // 3. List of Karyakartas
          Expanded(
            child: results.isNotEmpty
                ? ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 6, 16, 80),
                    itemCount: results.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final worker = results[index];
                      return _buildWorkerCard(worker, c);
                    },
                  )
                : Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.badge_outlined, size: 54, color: c.textMuted),
                        const SizedBox(height: 10),
                        Text("No field workers found", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary)),
                      ],
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          AddKaryakartaSheet.show(context, c, (newWorker) {
            setState(() {
              _workers.insert(0, newWorker);
            });
          });
        },
        backgroundColor: const Color(0xFF4F46E5),
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text("Add Worker", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _statusChip(int idx, String label, Color? accentColor) {
    final isSel = _statusFilter == idx;
    final c = widget.c;

    return Padding(
      padding: const EdgeInsets.only(right: 6),
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
          if (val) setState(() => _statusFilter = idx);
        },
      ),
    );
  }

  Widget _buildWorkerCard(KaryakartaModel w, CandidateColors c) {
    Color statusColor;
    String statusText;

    switch (w.status) {
      case KaryakartaStatus.onDuty:
        statusColor = const Color(0xFF10B981);
        statusText = "ON-DUTY";
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

    return InkWell(
      onTap: () => _openDetail(w),
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: c.cardBg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: w.isAlertInactive ? const Color(0xFFEF4444) : c.cardBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Booth Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF4F46E5).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    "BOOTH #${w.assignedBooth}",
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                  ),
                ),
                const SizedBox(width: 6),

                // Role
                Text(
                  w.roleLabel,
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: c.textSecondary),
                ),
                const Spacer(),

                // Status Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    children: [
                      Container(width: 6, height: 6, decoration: BoxDecoration(shape: BoxShape.circle, color: statusColor)),
                      const SizedBox(width: 5),
                      Text(statusText, style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: statusColor)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Worker Name & Contact
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: statusColor.withOpacity(0.15),
                  child: Text(
                    w.name.isNotEmpty ? w.name[0] : "K",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: statusColor),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        w.name,
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary),
                      ),
                      Text(
                        "${w.nameMr} • +91 ${w.mobile}",
                        style: TextStyle(fontSize: 11, color: c.textSecondary),
                      ),
                    ],
                  ),
                ),
                if (w.todaySurveys > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      "+${w.todaySurveys} today",
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            // Survey Progress Bar
            Row(
              children: [
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: w.targetSurveys > 0 ? (w.completedSurveys / w.targetSurveys) : 0,
                      backgroundColor: c.scaffoldBg,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        w.surveyProgressPct >= 75 ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                      ),
                      minHeight: 6,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  "${w.completedSurveys} / ${w.targetSurveys} (${w.surveyProgressPct.toStringAsFixed(0)}%)",
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textSecondary),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Location & Inline Actions
            Row(
              children: [
                Icon(Icons.location_on_outlined, size: 13, color: c.textMuted),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    w.lastActiveLocation,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 10.5, color: c.textMuted),
                  ),
                ),
                const SizedBox(width: 8),

                // Inline Call
                InkWell(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Calling ${w.name} (+91 ${w.mobile})...")),
                    );
                  },
                  borderRadius: BorderRadius.circular(6),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.call_rounded, size: 12, color: Color(0xFF10B981)),
                        SizedBox(width: 4),
                        Text("Call", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 6),

                // Inline WhatsApp
                InkWell(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Opening WhatsApp with ${w.name}...")),
                    );
                  },
                  borderRadius: BorderRadius.circular(6),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF22C55E).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.chat_rounded, size: 12, color: Color(0xFF22C55E)),
                        SizedBox(width: 4),
                        Text("Chat", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF22C55E))),
                      ],
                    ),
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
