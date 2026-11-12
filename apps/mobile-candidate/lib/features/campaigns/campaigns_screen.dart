import 'package:flutter/material.dart';
import '../../core/theme/candidate_theme.dart';
import '../../core/components/status_pill.dart';
import '../../core/components/section_header.dart';
import 'models/campaign_model.dart';
import 'data/campaign_mock_data.dart';
import 'widgets/campaign_card.dart';
import 'screens/campaign_wizard_sheet.dart';
import 'screens/campaign_detail_screen.dart';

class CampaignsScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const CampaignsScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<CampaignsScreen> createState() => _CampaignsScreenState();
}

class _CampaignsScreenState extends State<CampaignsScreen> {
  List<CampaignModel> _campaigns = [];
  int _selectedStatusIndex = 0; // 0=All, 1=Live, 2=Scheduled, 3=Completed, 4=Paused
  String _selectedChannelFilter = "All Channels";

  final List<String> _statusTabs = ["All (5)", "Live (2)", "Scheduled (1)", "Completed (1)", "Paused (1)"];
  final List<String> _channelFilters = ["All Channels", "WhatsApp", "Bulk SMS", "AI Voice"];

  @override
  void initState() {
    super.initState();
    _campaigns = List.from(CampaignMockData.campaigns);
  }

  List<CampaignModel> get _filteredCampaigns {
    return _campaigns.where((camp) {
      if (_selectedStatusIndex == 1 && camp.status != CampaignStatus.liveDispatching) return false;
      if (_selectedStatusIndex == 2 && camp.status != CampaignStatus.scheduled) return false;
      if (_selectedStatusIndex == 3 && camp.status != CampaignStatus.completed) return false;
      if (_selectedStatusIndex == 4 && camp.status != CampaignStatus.paused) return false;

      if (_selectedChannelFilter == "WhatsApp" && camp.channel != CampaignChannel.whatsapp) return false;
      if (_selectedChannelFilter == "Bulk SMS" && camp.channel != CampaignChannel.sms) return false;
      if (_selectedChannelFilter == "AI Voice" && camp.channel != CampaignChannel.aiVoice) return false;

      return true;
    }).toList();
  }

  void _openDetail(CampaignModel camp) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CampaignDetailScreen(
          campaign: camp,
          c: widget.c,
          onCampaignUpdated: (updated) {
            setState(() {
              final idx = _campaigns.indexWhere((x) => x.id == updated.id);
              if (idx != -1) _campaigns[idx] = updated;
            });
          },
        ),
      ),
    );
  }

  void _togglePause(CampaignModel camp) {
    setState(() {
      final idx = _campaigns.indexWhere((x) => x.id == camp.id);
      if (idx != -1) {
        final newStatus = camp.status == CampaignStatus.liveDispatching
            ? CampaignStatus.paused
            : CampaignStatus.liveDispatching;
        _campaigns[idx] = camp.copyWith(status: newStatus);
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(camp.status == CampaignStatus.liveDispatching ? "Campaign paused." : "Campaign resumed!"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = widget.isDark;
    final results = _filteredCampaigns;

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          // 1. MULTI-CHANNEL QUOTA CARD
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark
                    ? [const Color(0xFF1E1B4B), const Color(0xFF0F2744)]
                    : [const Color(0xFFEDE9FE), Colors.white],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? const Color(0xFF4338CA) : const Color(0xFFC4B5FD)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Gateway Quotas & Credit Reserves", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                    StatusPill(label: "SLA 99.9% ACTIVE", color: c.green),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _channelBalance("WhatsApp API", "45,200", "Remaining", const Color(0xFF22C55E)),
                    _channelBalance("Bulk SMS", "1,20,000", "Remaining", const Color(0xFF3B82F6)),
                    _channelBalance("AI Voice Calls", "12,400", "Mins Remaining", const Color(0xFF8B5CF6)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // 2. "+ Compose & Schedule Broadcast" Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: () {
                CampaignWizardSheet.show(context, c, (newCamp) {
                  setState(() {
                    _campaigns.insert(0, newCamp);
                  });
                });
              },
              icon: const Icon(Icons.add_circle_outline, color: Colors.white, size: 20),
              label: const Text(
                "Compose & Schedule Broadcast (7-Step Wizard)",
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          const SizedBox(height: 14),

          // 3. Status Tabs
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: List.generate(_statusTabs.length, (idx) {
                final isSel = _selectedStatusIndex == idx;
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: ChoiceChip(
                    label: Text(_statusTabs[idx]),
                    selected: isSel,
                    selectedColor: const Color(0xFF4F46E5),
                    backgroundColor: c.cardBg,
                    labelStyle: TextStyle(
                      fontSize: 11,
                      fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                      color: isSel ? Colors.white : c.textSecondary,
                    ),
                    side: BorderSide(color: isSel ? const Color(0xFF4F46E5) : c.cardBorder),
                    onSelected: (val) {
                      if (val) setState(() => _selectedStatusIndex = idx);
                    },
                  ),
                );
              }),
            ),
          ),
          const SizedBox(height: 8),

          // 4. Channel Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _channelFilters.map((ch) {
                final isSel = _selectedChannelFilter == ch;
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: FilterChip(
                    label: Text(ch),
                    selected: isSel,
                    selectedColor: const Color(0xFF4F46E5).withOpacity(0.15),
                    backgroundColor: c.scaffoldBg,
                    labelStyle: TextStyle(
                      fontSize: 10.5,
                      fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                      color: isSel ? const Color(0xFF4F46E5) : c.textSecondary,
                    ),
                    side: BorderSide(color: isSel ? const Color(0xFF4F46E5) : c.cardBorder),
                    onSelected: (val) {
                      setState(() => _selectedChannelFilter = ch);
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 14),

          // 5. Section Header
          SectionHeader(
            c: c,
            title: "Active Broadcast Dispatches",
            subtitle: "Showing ${results.length} campaign dispatches",
          ),
          const SizedBox(height: 8),

          // 6. Campaign Cards List
          if (results.isNotEmpty)
            ...results.map((camp) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: CampaignCard(
                  campaign: camp,
                  c: c,
                  onTap: () => _openDetail(camp),
                  onTogglePause: () => _togglePause(camp),
                ),
              );
            })
          else
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              child: Column(
                children: [
                  Icon(Icons.campaign_outlined, size: 48, color: c.textMuted),
                  const SizedBox(height: 8),
                  Text("No campaigns in this view", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary)),
                ],
              ),
            ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _channelBalance(String name, String balance, String label, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(width: 6, height: 6, decoration: BoxDecoration(shape: BoxShape.circle, color: color)),
            const SizedBox(width: 4),
            Text(name, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: widget.c.textSecondary)),
          ],
        ),
        const SizedBox(height: 4),
        Text(balance, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: color)),
        Text(label, style: TextStyle(fontSize: 8.5, color: widget.c.textMuted)),
      ],
    );
  }
}
