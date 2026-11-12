import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/campaign_model.dart';

class CampaignDetailScreen extends StatefulWidget {
  final CampaignModel campaign;
  final CandidateColors c;
  final Function(CampaignModel updated)? onCampaignUpdated;

  const CampaignDetailScreen({
    super.key,
    required this.campaign,
    required this.c,
    this.onCampaignUpdated,
  });

  @override
  State<CampaignDetailScreen> createState() => _CampaignDetailScreenState();
}

class _CampaignDetailScreenState extends State<CampaignDetailScreen> {
  late CampaignModel _campaign;

  @override
  void initState() {
    super.initState();
    _campaign = widget.campaign;
  }

  void _togglePause() {
    setState(() {
      if (_campaign.status == CampaignStatus.liveDispatching) {
        _campaign = _campaign.copyWith(status: CampaignStatus.paused);
      } else if (_campaign.status == CampaignStatus.paused) {
        _campaign = _campaign.copyWith(status: CampaignStatus.liveDispatching);
      }
    });
    widget.onCampaignUpdated?.call(_campaign);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_campaign.status == CampaignStatus.paused ? "Campaign paused." : "Campaign resumed!"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    Color channelColor;
    IconData channelIcon;
    switch (_campaign.channel) {
      case CampaignChannel.whatsapp:
        channelColor = const Color(0xFF22C55E);
        channelIcon = Icons.chat_rounded;
        break;
      case CampaignChannel.sms:
        channelColor = const Color(0xFF3B82F6);
        channelIcon = Icons.sms_rounded;
        break;
      case CampaignChannel.aiVoice:
        channelColor = const Color(0xFF8B5CF6);
        channelIcon = Icons.record_voice_over_rounded;
        break;
      case CampaignChannel.autoGreeting:
        channelColor = const Color(0xFFF59E0B);
        channelIcon = Icons.cake_rounded;
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
          "Campaign Analytics",
          style: TextStyle(color: c.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.download_rounded, color: Color(0xFF4F46E5)),
            tooltip: "Export Delivery CSV",
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Exporting Campaign Delivery Log (CSV)...")),
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
            // HERO SUMMARY CARD
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: c.cardBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: channelColor.withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(channelIcon, color: channelColor, size: 20),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _campaign.title,
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
                            ),
                            Text(
                              _campaign.titleMr,
                              style: TextStyle(fontSize: 12, color: c.textSecondary),
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
                      _heroStat("Gateway", _campaign.channelLabel, c),
                      _heroStat("Recipients", "${_campaign.targetCount}", c),
                      _heroStat("Dispatched", "${_campaign.progressPct.toStringAsFixed(0)}%", c, color: channelColor),
                      _heroStat("Status", _campaign.status.name.toUpperCase(), c, isStatus: true),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // DELIVERY TELEMETRY BREAKDOWN
            Text(
              "DELIVERY TELEMETRY FUNNEL",
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: c.textMuted),
            ),
            const SizedBox(height: 10),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: c.cardBorder),
              ),
              child: Column(
                children: [
                  _telemetryRow("Total Targeted", "${_campaign.targetCount}", 1.0, const Color(0xFF6366F1), c),
                  const SizedBox(height: 12),
                  _telemetryRow("Dispatched to Gateway", "${_campaign.dispatchedCount} (${_campaign.progressPct.toStringAsFixed(1)}%)", _campaign.targetCount > 0 ? _campaign.dispatchedCount / _campaign.targetCount : 0, channelColor, c),
                  const SizedBox(height: 12),
                  _telemetryRow("Delivered to Handset", "${_campaign.deliveredCount} (${_campaign.deliveryRatePct.toStringAsFixed(1)}%)", _campaign.targetCount > 0 ? _campaign.deliveredCount / _campaign.targetCount : 0, const Color(0xFF10B981), c),
                  const SizedBox(height: 12),
                  _telemetryRow("Read / Engaged", "${_campaign.readCount} (${_campaign.readRatePct.toStringAsFixed(1)}%)", _campaign.targetCount > 0 ? _campaign.readCount / _campaign.targetCount : 0, const Color(0xFF06B6D4), c),
                  const SizedBox(height: 12),
                  _telemetryRow("Bounced / Failed", "${_campaign.failedCount}", _campaign.targetCount > 0 ? _campaign.failedCount / _campaign.targetCount : 0, const Color(0xFFEF4444), c),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // MESSAGE PREVIEW
            Text(
              "BROADCAST SCRIPT & ATTACHMENT",
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: c.textMuted),
            ),
            const SizedBox(height: 10),

            Container(
              width: double.infinity,
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
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("SCRIPT PREVIEW", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
                      if (_campaign.attachmentType != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFF4F46E5).withOpacity(0.12),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            "MEDIA: ${_campaign.attachmentType!.toUpperCase()}",
                            style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _campaign.messageContent,
                    style: TextStyle(fontSize: 13, height: 1.5, color: c.textPrimary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // MANAGEMENT ACTIONS
            if (_campaign.status == CampaignStatus.liveDispatching || _campaign.status == CampaignStatus.paused) ...[
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  onPressed: _togglePause,
                  icon: Icon(_campaign.status == CampaignStatus.liveDispatching ? Icons.pause_rounded : Icons.play_arrow_rounded),
                  label: Text(_campaign.status == CampaignStatus.liveDispatching ? "Pause Campaign Dispatch" : "Resume Campaign Dispatch"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _campaign.status == CampaignStatus.liveDispatching ? const Color(0xFFEF4444) : const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ],

            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Campaign duplicated as new draft.")),
                  );
                },
                icon: const Icon(Icons.copy_rounded, size: 18),
                label: const Text("Duplicate Campaign Draft"),
                style: OutlinedButton.styleFrom(
                  foregroundColor: c.textPrimary,
                  side: BorderSide(color: c.cardBorder),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _heroStat(String label, String val, CandidateColors c, {Color? color, bool isStatus = false}) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 9.5, color: Color(0xFF64748B))),
        const SizedBox(height: 2),
        Text(
          val,
          style: TextStyle(
            fontSize: isStatus ? 10 : 12,
            fontWeight: FontWeight.bold,
            color: color ?? c.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _telemetryRow(String label, String value, double progress, Color color, CandidateColors c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: TextStyle(fontSize: 11.5, color: c.textSecondary)),
            Text(value, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: color)),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(3),
          child: LinearProgressIndicator(
            value: progress.clamp(0.0, 1.0),
            backgroundColor: c.scaffoldBg,
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 5,
          ),
        ),
      ],
    );
  }
}
