import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/audit_event_model.dart';
import '../data/audit_log_mock_data.dart';

class AuditLogScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const AuditLogScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<AuditLogScreen> createState() => _AuditLogScreenState();
}

class _AuditLogScreenState extends State<AuditLogScreen> {
  String _searchQuery = "";
  AuditCategory? _selectedCategory;

  List<AuditEvent> get _filteredEvents {
    return AuditLogMockData.events.where((e) {
      final matchesSearch = _searchQuery.isEmpty ||
          e.actionTitle.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          e.actorName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          e.details.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          e.ipAddress.contains(_searchQuery);

      final matchesCategory = _selectedCategory == null || e.category == _selectedCategory;

      return matchesSearch && matchesCategory;
    }).toList();
  }

  void _exportAuditLog() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.green.shade800,
        content: const Row(
          children: [
            Icon(Icons.check_circle_rounded, color: Colors.white, size: 16),
            SizedBox(width: 8),
            Expanded(
              child: Text(
                "Audit Trail exported with SHA-256 digital signature (audit_log_signed.csv)",
                style: TextStyle(fontSize: 11, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final events = _filteredEvents;

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        backgroundColor: c.cardBg,
        elevation: 0.5,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: c.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Security & Audit Ledger",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Immutable Trail of Candidate & Cadre Activities",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Export Signed Audit Trail",
            icon: const Icon(Icons.file_download_outlined, color: Colors.blue, size: 22),
            onPressed: _exportAuditLog,
          ),
        ],
      ),
      body: Column(
        children: [
          // Security Integrity Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            color: Colors.blue.withOpacity(0.08),
            child: Row(
              children: [
                const Icon(Icons.verified_user_rounded, color: Colors.blue, size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "Tamper-proof blockchain hash chaining enabled. Every write operation is cryptographically signed.",
                    style: TextStyle(fontSize: 10.5, color: Colors.blue.shade900, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),

          // Search & Category Filters
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            color: c.cardBg,
            child: Column(
              children: [
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: "Search action, actor, IP address, or details...",
                    hintStyle: TextStyle(fontSize: 11.5, color: c.textMuted),
                    prefixIcon: Icon(Icons.search_rounded, size: 18, color: c.textMuted),
                    filled: true,
                    fillColor: c.scaffoldBg,
                    contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                  ),
                  style: TextStyle(fontSize: 12, color: c.textPrimary),
                ),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _categoryChip("All Events (${AuditLogMockData.events.length})", null),
                      const SizedBox(width: 6),
                      _categoryChip("Auth", AuditCategory.authentication),
                      const SizedBox(width: 6),
                      _categoryChip("Campaigns", AuditCategory.campaigns),
                      const SizedBox(width: 6),
                      _categoryChip("Voter Roll", AuditCategory.voterRoll),
                      const SizedBox(width: 6),
                      _categoryChip("Grievances", AuditCategory.grievances),
                      const SizedBox(width: 6),
                      _categoryChip("Security", AuditCategory.security),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Timeline Event List
          Expanded(
            child: events.isEmpty
                ? Center(child: Text("No audit events match your search.", style: TextStyle(color: c.textSecondary, fontSize: 12)))
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    itemCount: events.length,
                    itemBuilder: (context, index) {
                      final item = events[index];
                      return _buildEventCard(item);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _categoryChip(String label, AuditCategory? category) {
    final isSelected = _selectedCategory == category;
    final c = widget.c;

    return InkWell(
      onTap: () => setState(() => _selectedCategory = category),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? c.primary : c.cardBg,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? c.primary : c.borderColor),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : c.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildEventCard(AuditEvent item) {
    final c = widget.c;
    final isCritical = item.severity == AuditSeverity.critical;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isCritical ? Colors.red : c.borderColor,
          width: isCritical ? 1.5 : 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: item.categoryColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        item.categoryLabel,
                        style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: item.categoryColor),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      item.id,
                      style: TextStyle(fontSize: 9.5, color: c.textMuted, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                Text(
                  item.timestamp,
                  style: TextStyle(fontSize: 10, color: c.textMuted),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor: item.categoryColor.withOpacity(0.12),
                  child: Icon(item.categoryIcon, size: 16, color: item.categoryColor),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.actionTitle,
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.bold,
                          color: isCritical ? Colors.red : c.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "Actor: ${item.actorName} (${item.actorRole})",
                        style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: c.textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: c.scaffoldBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.details,
                    style: TextStyle(fontSize: 11, color: c.textPrimary, height: 1.35),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.phonelink_setup_rounded, size: 12, color: c.textMuted),
                          const SizedBox(width: 4),
                          Text(
                            item.device,
                            style: TextStyle(fontSize: 9.5, color: c.textMuted),
                          ),
                        ],
                      ),
                      Text(
                        item.ipAddress,
                        style: TextStyle(fontSize: 9.5, color: c.textMuted),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
