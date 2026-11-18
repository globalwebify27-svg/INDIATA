import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../../../core/components/kpi_card.dart';
import '../models/telemetry_kpi.dart';

class KPIMatrixSection extends StatefulWidget {
  final TelemetryKPIs kpis;
  final CandidateColors c;
  final Function(String title, String val, String category)? onKpiTapped;

  const KPIMatrixSection({
    super.key,
    required this.kpis,
    required this.c,
    this.onKpiTapped,
  });

  @override
  State<KPIMatrixSection> createState() => _KPIMatrixSectionState();
}

class _KPIMatrixSectionState extends State<KPIMatrixSection> {
  int _selectedCategoryIndex = 0;

  final List<String> _categories = [
    "All (22)",
    "Electorate",
    "Workforce",
    "Sentiment",
    "Booths",
    "Operations",
    "Outreach",
  ];

  @override
  Widget build(BuildContext context) {
    final k = widget.kpis;
    final c = widget.c;

    // Filter items based on selected category
    List<Widget> items = [];

    final allItems = [
      // 1-4: Electorate
      _item("Total Voters", _fmt(k.totalVoters), Icons.groups_rounded, const Color(0xFF6366F1), "+340 this week", "Electorate"),
      _item("Male Voters", _fmt(k.maleVoters), Icons.man_rounded, const Color(0xFF3B82F6), "51.7% of electorate", "Electorate"),
      _item("Female Voters", _fmt(k.femaleVoters), Icons.woman_rounded, const Color(0xFFEC4899), "48.2% of electorate", "Electorate"),
      _item("Other Voters", "${k.otherVoters}", Icons.people_outline_rounded, const Color(0xFF8B5CF6), "0.1% of electorate", "Electorate"),

      // 5-7: Workforce
      _item("Total Booths", "${k.totalBooths}", Icons.how_to_vote_rounded, const Color(0xFF10B981), "100% mapped", "Workforce"),
      _item("Assigned Workers", "${k.totalKaryakartas}", Icons.badge_outlined, const Color(0xFF0EA5E9), "85.6% booth coverage", "Workforce"),
      _item("Active On-Duty", "${k.activeKaryakartas} Active", Icons.directions_walk_rounded, const Color(0xFF10B981), "Live field telemetry", "Workforce"),

      // 8-9: Surveys
      _item("Surveys Done", _fmt(k.surveysCompleted), Icons.fact_check_outlined, const Color(0xFF10B981), "${k.surveyCoveragePct}% coverage", "Operations"),
      _item("Doorstep Reach", "${k.surveyCoveragePct}%", Icons.pie_chart_outline_rounded, const Color(0xFF6366F1), "Target: 80% by Friday", "Operations"),

      // 10-12: Sentiment
      _item("Supporters", _fmt(k.favorableSupporters), Icons.thumb_up_rounded, const Color(0xFF10B981), "${k.favorablePct.toStringAsFixed(1)}% of surveyed", "Sentiment"),
      _item("Swing Voters", _fmt(k.swingVoters), Icons.shuffle_rounded, const Color(0xFFF59E0B), "${k.swingPct.toStringAsFixed(1)}% persuasion target", "Sentiment"),
      _item("Opposition", _fmt(k.oppositionVoters), Icons.thumb_down_rounded, const Color(0xFFEF4444), "${k.oppositionPct.toStringAsFixed(1)}% unfavorable", "Sentiment"),

      // 13-15: Booth Strategic Status
      _item("Safe Booths", "${k.safeBooths}", Icons.check_circle_outline_rounded, const Color(0xFF10B981), "Lead margin > 15%", "Booths"),
      _item("Battleground", "${k.criticalBattlegroundBooths}", Icons.crisis_alert_rounded, const Color(0xFFF59E0B), "Lead margin < 5%", "Booths"),
      _item("Weak Booths", "${k.weakBooths}", Icons.warning_amber_rounded, const Color(0xFFEF4444), "Deficit > 10%", "Booths"),

      // 16-19: Operations
      _item("Citizen Issues", "${k.openTickets}", Icons.report_problem_outlined, const Color(0xFFF97316), "${k.urgentTickets} urgent priority", "Operations"),
      _item("Voter Slips Done", _fmt(k.voterSlipsDistributed), Icons.confirmation_number_outlined, const Color(0xFF06B6D4), "${k.voterSlipsPct.toStringAsFixed(1)}% distributed", "Operations"),
      _item("Field Updates", "${k.pendingUpdateRequests}", Icons.pending_actions_rounded, const Color(0xFF8B5CF6), "Awaiting candidate signoff", "Operations"),

      // 20-22: Outreach & Projection
      _item("WhatsApp Sent", _fmt(k.whatsappBroadcasts), Icons.chat_rounded, const Color(0xFF22C55E), "94.2% delivery rate", "Outreach"),
      _item("AI Voice Calls", _fmt(k.aiVoiceCalls), Icons.record_voice_over_rounded, const Color(0xFF6366F1), "Avg duration: 42s", "Outreach"),
      _item("Projected Turnout", "${k.projectedTurnoutPct}%", Icons.trending_up_rounded, const Color(0xFF4F46E5), "Target: 70.0%", "Outreach"),
    ];

    if (_selectedCategoryIndex == 0) {
      items = allItems;
    } else {
      final selectedCategory = _categories[_selectedCategoryIndex];
      items = allItems.where((w) {
        // filter by category tag
        return (w as _KPICardWrapper).category == selectedCategory;
      }).toList();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Category Filter Tabs
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: List.generate(_categories.length, (idx) {
              final isSel = _selectedCategoryIndex == idx;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(_categories[idx]),
                  selected: isSel,
                  selectedColor: const Color(0xFF4F46E5),
                  backgroundColor: c.cardBg,
                  labelStyle: TextStyle(
                    fontSize: 11,
                    fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                    color: isSel ? Colors.white : c.textSecondary,
                  ),
                  side: BorderSide(
                    color: isSel ? const Color(0xFF4F46E5) : c.cardBorder,
                  ),
                  onSelected: (val) {
                    if (val) setState(() => _selectedCategoryIndex = idx);
                  },
                ),
              );
            }),
          ),
        ),
        const SizedBox(height: 12),

        // Grid of KPI Cards
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: items.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.55,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemBuilder: (context, index) => items[index],
          ),
        ),
      ],
    );
  }

  Widget _item(String title, String val, IconData icon, Color color, String sub, String cat) {
    return _KPICardWrapper(
      title: title,
      value: val,
      icon: icon,
      accentColor: color,
      subtitle: sub,
      category: cat,
      onTap: () {
        if (widget.onKpiTapped != null) {
          widget.onKpiTapped!(title, val, cat);
        }
      },
    );
  }

  String _fmt(int num) {
    if (num >= 100000) {
      return "${(num / 100000).toStringAsFixed(2)} Lakh";
    }
    if (num >= 1000) {
      return "${(num / 1000).toStringAsFixed(1)}k";
    }
    return "$num";
  }
}

class _KPICardWrapper extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color accentColor;
  final String subtitle;
  final String category;
  final VoidCallback onTap;

  const _KPICardWrapper({
    required this.title,
    required this.value,
    required this.icon,
    required this.accentColor,
    required this.subtitle,
    required this.category,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final c = CandidateColors(isDark);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
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
                Flexible(
                  child: Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: c.textSecondary,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: accentColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Icon(icon, size: 14, color: accentColor),
                ),
              ],
            ),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: c.textPrimary,
              ),
            ),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: accentColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
