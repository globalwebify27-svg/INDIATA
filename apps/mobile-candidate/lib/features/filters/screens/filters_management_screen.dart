import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/saved_filter_preset_model.dart';

class FiltersManagementScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final Function(int) onNavigateTab;

  const FiltersManagementScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.onNavigateTab,
  });

  @override
  State<FiltersManagementScreen> createState() => _FiltersManagementScreenState();
}

class _FiltersManagementScreenState extends State<FiltersManagementScreen> {
  final List<SavedFilterPreset> _presets = [
    const SavedFilterPreset(
      id: "preset_01",
      title: "Undecided Youth Voters (18-25) in Kasba Peth",
      titleMr: "अनिर्णित तरुण मतदार (१८-२५ वर्षे)",
      description: "College campus students and young tech professionals with Amber swing sentiment.",
      matchedVotersCount: 3420,
      icon: Icons.school_rounded,
      color: Colors.blue,
      activeFilterTags: ["Age: 18-25", "Sentiment: Amber / Swing", "Peth: Kasba Peth"],
    ),
    const SavedFilterPreset(
      id: "preset_02",
      title: "Majhi Ladki Bahin Beneficiaries (Pending Slip)",
      titleMr: "लाडकी बहीण लाभार्थी (पावती प्रलंबित)",
      description: "Eligible women DBT beneficiaries who have not yet received physical or digital voter slips.",
      matchedVotersCount: 11840,
      icon: Icons.account_balance_rounded,
      color: Colors.purple,
      activeFilterTags: ["Gender: Female", "Scheme: Ladki Bahin DBT", "Slip: Pending"],
    ),
    const SavedFilterPreset(
      id: "preset_03",
      title: "Senior Citizens in Traditional Wadas (65+)",
      titleMr: "वाडा ज्येष्ठ नागरिक मतदार (६५+ वर्षे)",
      description: "Elderly voters requiring morning volunteer escort and EV shuttle assistance on poll day.",
      matchedVotersCount: 5210,
      icon: Icons.elderly_rounded,
      color: Colors.amber,
      activeFilterTags: ["Age: 65+", "Residence: Wada", "Assistance: EV Shuttle"],
    ),
    const SavedFilterPreset(
      id: "preset_04",
      title: "Vyapari Trade Shopkeepers & Retailers",
      titleMr: "व्यापारी मंडळ व किरकोळ व्यावसायिक",
      description: "Commercial trade association members in hardware, gold, electrical, and timber markets.",
      matchedVotersCount: 6890,
      icon: Icons.storefront_rounded,
      color: Colors.teal,
      activeFilterTags: ["Vyapari Guild", "Peth: Raviwar / Budhwar", "Influence: KOL"],
    ),
    const SavedFilterPreset(
      id: "preset_05",
      title: "BLA-2 Deceased & Shifted Verification Roll",
      titleMr: "मतदान प्रतिनिधी चिन्हांकित पडताळणी यादी",
      description: "Ground-verified roll discrepancies to be cross-checked at EVM tables to prevent impersonation.",
      matchedVotersCount: 2700,
      icon: Icons.warning_amber_rounded,
      color: Colors.red,
      activeFilterTags: ["Status: Deceased/Shifted", "Roll Action: Form 7 Target", "Table: BLA-2"],
    ),
  ];

  void _applyFilter(SavedFilterPreset preset) {
    widget.onNavigateTab(1); // Jump to Voters Tab
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: preset.color,
        content: Text("Applied '${preset.title}' (${preset.matchedVotersCount} voters) to Voters Directory."),
      ),
    );
  }

  void _broadcastToGroup(SavedFilterPreset preset) {
    widget.onNavigateTab(3); // Jump to Campaigns Tab
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.indigo,
        content: Text("Initialized Campaign Wizard for ${preset.matchedVotersCount} voters (${preset.title})."),
      ),
    );
  }

  void _showCreatePresetDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: widget.c.cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(Icons.tune_rounded, color: widget.c.primary),
            const SizedBox(width: 8),
            Text("Create Strategic Filter Preset", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: widget.c.textPrimary)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Preset Title", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: widget.c.textMuted)),
            const SizedBox(height: 4),
            TextField(
              decoration: InputDecoration(
                hintText: "e.g. First-Time Female Voters",
                hintStyle: TextStyle(fontSize: 11, color: widget.c.textMuted),
                filled: true,
                fillColor: widget.c.scaffoldBg,
                contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
              style: TextStyle(fontSize: 12, color: widget.c.textPrimary),
            ),
            const SizedBox(height: 10),
            Text("Criteria: All demographic, caste, scheme, and sentiment filters configured in the Voters sheet will be encapsulated into a reusable 1-tap segment.", style: TextStyle(fontSize: 11, color: widget.c.textSecondary)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Cancel", style: TextStyle(color: widget.c.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("New Filter Preset saved to Candidate War Room.")),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: widget.c.primary),
            child: const Text("Save Preset", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

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
              "Master Filters Management",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Strategic Voter Segments & Target Groups",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Create New Preset",
            icon: Icon(Icons.add_circle_outline_rounded, color: c.primary, size: 22),
            onPressed: _showCreatePresetDialog,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.cyan.withOpacity(0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.cyan.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.hub_rounded, color: Colors.cyan, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    "Master presets enable instant one-tap filtering of the 2,75,420 voter database for micro-targeted campaign broadcasts and BLA-2 table execution.",
                    style: TextStyle(fontSize: 11, color: c.textPrimary, height: 1.35),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          Text(
            "ACTIVE STRATEGIC PRESETS (${_presets.length})",
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
          ),
          const SizedBox(height: 8),

          ..._presets.map((preset) {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: c.borderColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CircleAvatar(
                        radius: 19,
                        backgroundColor: preset.color.withOpacity(0.12),
                        child: Icon(preset.icon, size: 20, color: preset.color),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    preset.title,
                                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: preset.color.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: preset.color.withOpacity(0.4)),
                                  ),
                                  child: Text(
                                    "${preset.matchedVotersCount} Voters",
                                    style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: preset.color),
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              preset.titleMr,
                              style: TextStyle(fontSize: 10, color: c.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    preset.description,
                    style: TextStyle(fontSize: 11, color: c.textSecondary, height: 1.35),
                  ),
                  const SizedBox(height: 8),

                  // Filter Tags
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: preset.activeFilterTags.map((tag) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: c.scaffoldBg,
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: c.borderColor),
                        ),
                        child: Text(
                          tag,
                          style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: c.textPrimary),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 12),
                  const Divider(height: 1),
                  const SizedBox(height: 10),

                  // Quick Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _applyFilter(preset),
                          icon: const Icon(Icons.how_to_reg_rounded, size: 14),
                          label: const Text("View in Directory", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: c.primary,
                            side: BorderSide(color: c.primary.withOpacity(0.4)),
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _broadcastToGroup(preset),
                          icon: const Icon(Icons.campaign_rounded, size: 14, color: Colors.white),
                          label: const Text("Broadcast Alert", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: preset.color,
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
