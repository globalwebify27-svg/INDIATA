import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/blo_model.dart';
import '../data/blo_mock_data.dart';

class BloDirectoryScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const BloDirectoryScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<BloDirectoryScreen> createState() => _BloDirectoryScreenState();
}

class _BloDirectoryScreenState extends State<BloDirectoryScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<BloModel> _blos = [];

  @override
  void initState() {
    super.initState();
    _blos = List.from(BloMockData.blos);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<BloModel> get _filteredBlos {
    final q = _searchController.text.trim().toLowerCase();

    return _blos.where((b) {
      if (q.isNotEmpty) {
        final matchName = b.name.toLowerCase().contains(q);
        final matchNameMr = b.nameMr.contains(q);
        final matchMobile = b.mobile.contains(q);
        final matchRange = b.boothRange.toLowerCase().contains(q);
        final matchBooths = b.assignedBooths.any((num) => num.toString().contains(q));
        if (!matchName && !matchNameMr && !matchMobile && !matchRange && !matchBooths) {
          return false;
        }
      }
      return true;
    }).toList();
  }

  void _editLiaisonNote(BloModel blo) {
    final controller = TextEditingController(text: blo.candidateLiaisonNotes);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: widget.c.cardBg,
        title: Text("Liaison Note with BLO", style: TextStyle(color: widget.c.textPrimary)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Notes for ${blo.name} (${blo.boothRange}):", style: TextStyle(fontSize: 12, color: widget.c.textSecondary)),
            const SizedBox(height: 8),
            TextField(
              controller: controller,
              maxLines: 3,
              style: TextStyle(color: widget.c.textPrimary, fontSize: 13),
              decoration: InputDecoration(
                hintText: "Record follow-up details on Form 6/7/8 or voter roll revisions...",
                filled: true,
                fillColor: widget.c.scaffoldBg,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () {
              setState(() {
                final idx = _blos.indexWhere((x) => x.id == blo.id);
                if (idx != -1) {
                  _blos[idx] = blo.copyWith(candidateLiaisonNotes: controller.text.trim());
                }
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Liaison note saved successfully.")),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
            child: const Text("Save Note", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final results = _filteredBlos;

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
          "Government BLO Directory",
          style: TextStyle(color: c.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          // Search & Summary Header
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            color: c.appBarBg,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: _searchController,
                  style: TextStyle(color: c.textPrimary, fontSize: 13),
                  decoration: InputDecoration(
                    hintText: "Search BLO Name, Booth #, Phone...",
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
                const SizedBox(height: 12),

                // Form 6/7/8 Revision Status Banner
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: c.cardBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: c.cardBorder),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _StatMini(label: "Form 6 (New)", val: "259 Adds", color: Color(0xFF10B981)),
                      _StatMini(label: "Form 7 (Del)", val: "101 Deletions", color: Color(0xFFEF4444)),
                      _StatMini(label: "Form 8 (Fix)", val: "140 Corrected", color: Color(0xFFF59E0B)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Count Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: c.scaffoldBg,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Designated ECI Officers: ${results.length}",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textMuted),
                ),
                Text(
                  "215 - Kasba Peth Assembly",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF6366F1)),
                ),
              ],
            ),
          ),

          // BLO Cards List
          Expanded(
            child: results.isNotEmpty
                ? ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: results.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final blo = results[index];
                      return _buildBloCard(blo, c);
                    },
                  )
                : Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.contacts_rounded, size: 54, color: c.textMuted),
                        const SizedBox(height: 10),
                        Text("No BLO records found", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary)),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildBloCard(BloModel blo, CandidateColors c) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Government Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF4F46E5).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  "ECI GOVT BLO",
                  style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  blo.boothRange,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Name and Designation
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: const Color(0xFF10B981).withOpacity(0.15),
                child: const Icon(Icons.account_balance_rounded, size: 20, color: Color(0xFF10B981)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      blo.name,
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Text(
                      "${blo.nameMr} • ${blo.designation}",
                      style: TextStyle(fontSize: 11, color: c.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Revision Stats Grid
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: c.scaffoldBg,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _revisionMini("Form 6", "${blo.form6ApprovedCount} / ${blo.form6NewVotersCount}", const Color(0xFF10B981)),
                _revisionMini("Form 7", "${blo.form7DeletionsCount} Deletions", const Color(0xFFEF4444)),
                _revisionMini("Form 8", "${blo.form8CorrectionsCount} Updates", const Color(0xFFF59E0B)),
                _revisionMini("Electorate", "${blo.totalVotersInCharge}", const Color(0xFF6366F1)),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Liaison Notes
          if (blo.candidateLiaisonNotes.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.notes_rounded, size: 14, color: c.textMuted),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      "Note: \"${blo.candidateLiaisonNotes}\"",
                      style: TextStyle(fontSize: 10.5, fontStyle: FontStyle.italic, color: c.textSecondary),
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 10),
          const Divider(height: 1),
          const SizedBox(height: 8),

          // Actions Bar: Call, WhatsApp, Log Note
          Row(
            children: [
              // Call
              InkWell(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Calling BLO ${blo.name} (+91 ${blo.mobile})...")),
                  );
                },
                borderRadius: BorderRadius.circular(6),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.call_rounded, size: 13, color: Color(0xFF10B981)),
                      SizedBox(width: 4),
                      Text("Call BLO", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // WhatsApp
              InkWell(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Opening WhatsApp with BLO ${blo.name}...")),
                  );
                },
                borderRadius: BorderRadius.circular(6),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF22C55E).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.chat_rounded, size: 13, color: Color(0xFF22C55E)),
                      SizedBox(width: 4),
                      Text("WhatsApp", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF22C55E))),
                    ],
                  ),
                ),
              ),
              const Spacer(),

              // Edit Note
              TextButton.icon(
                onPressed: () => _editLiaisonNote(blo),
                icon: const Icon(Icons.edit_note_rounded, size: 16),
                label: const Text("Liaison Note", style: TextStyle(fontSize: 10.5)),
                style: TextButton.styleFrom(foregroundColor: const Color(0xFF4F46E5)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _revisionMini(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF64748B))),
        const SizedBox(height: 2),
        Text(value, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: color)),
      ],
    );
  }
}

class _StatMini extends StatelessWidget {
  final String label;
  final String val;
  final Color color;

  const _StatMini({required this.label, required this.val, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF64748B))),
        const SizedBox(height: 2),
        Text(val, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color)),
      ],
    );
  }
}
