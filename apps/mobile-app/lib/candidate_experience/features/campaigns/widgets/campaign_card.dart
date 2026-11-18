import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/campaign_model.dart';

class CampaignCard extends StatelessWidget {
  final CampaignModel campaign;
  final CandidateColors c;
  final VoidCallback onTap;
  final VoidCallback onTogglePause;

  const CampaignCard({
    super.key,
    required this.campaign,
    required this.c,
    required this.onTap,
    required this.onTogglePause,
  });

  @override
  Widget build(BuildContext context) {
    Color channelColor;
    IconData channelIcon;

    switch (campaign.channel) {
      case CampaignChannel.whatsapp:
        channelColor = const Color(0xFF22C55E); // WhatsApp Green
        channelIcon = Icons.chat_rounded;
        break;
      case CampaignChannel.sms:
        channelColor = const Color(0xFF3B82F6); // SMS Blue
        channelIcon = Icons.sms_rounded;
        break;
      case CampaignChannel.aiVoice:
        channelColor = const Color(0xFF8B5CF6); // Voice Purple
        channelIcon = Icons.record_voice_over_rounded;
        break;
      case CampaignChannel.autoGreeting:
        channelColor = const Color(0xFFF59E0B); // Amber
        channelIcon = Icons.cake_rounded;
        break;
    }

    Color statusColor;
    String statusText;

    switch (campaign.status) {
      case CampaignStatus.liveDispatching:
        statusColor = const Color(0xFF10B981);
        statusText = "LIVE DISPATCHING";
        break;
      case CampaignStatus.scheduled:
        statusColor = const Color(0xFFF59E0B);
        statusText = "SCHEDULED";
        break;
      case CampaignStatus.completed:
        statusColor = const Color(0xFF06B6D4);
        statusText = "COMPLETED";
        break;
      case CampaignStatus.paused:
        statusColor = const Color(0xFFEF4444);
        statusText = "PAUSED";
        break;
    }

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: c.cardBg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: c.cardBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Channel Badge & Status
            Row(
              children: [
                // Channel Tag
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: channelColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(channelIcon, size: 12, color: channelColor),
                      const SizedBox(width: 4),
                      Text(
                        campaign.channelLabel,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: channelColor,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),

                // Status Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    statusText,
                    style: TextStyle(
                      fontSize: 9.5,
                      fontWeight: FontWeight.bold,
                      color: statusColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Title & Marathi Title
            Text(
              campaign.title,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              campaign.titleMr,
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: c.textSecondary),
            ),
            const SizedBox(height: 6),

            // Target Audience Tag
            Row(
              children: [
                Icon(Icons.groups_outlined, size: 13, color: c.textMuted),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    campaign.targetAudience,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 11, color: c.textMuted),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Progress Bar
            Row(
              children: [
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: campaign.progressPct / 100.0,
                      backgroundColor: c.scaffoldBg,
                      valueColor: AlwaysStoppedAnimation<Color>(channelColor),
                      minHeight: 6,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  "${campaign.progressPct.toStringAsFixed(0)}% Dispatched",
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textSecondary),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Delivery Stats: Dispatched, Delivered, Read
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: c.scaffoldBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _statItem("Target", _fmt(campaign.targetCount), c),
                  _statItem("Sent", _fmt(campaign.dispatchedCount), c, color: channelColor),
                  _statItem("Delivered", _fmt(campaign.deliveredCount), c, color: const Color(0xFF10B981)),
                  _statItem("Read / Heard", _fmt(campaign.readCount), c, color: const Color(0xFF6366F1)),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Bottom Actions & Scheduled Time
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Created: ${campaign.createdDate}",
                  style: TextStyle(fontSize: 9.5, color: c.textMuted),
                ),
                Row(
                  children: [
                    if (campaign.status == CampaignStatus.liveDispatching || campaign.status == CampaignStatus.paused) ...[
                      InkWell(
                        onTap: onTogglePause,
                        borderRadius: BorderRadius.circular(6),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: campaign.status == CampaignStatus.liveDispatching
                                ? const Color(0xFFEF4444).withOpacity(0.1)
                                : const Color(0xFF10B981).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                campaign.status == CampaignStatus.liveDispatching ? Icons.pause_rounded : Icons.play_arrow_rounded,
                                size: 12,
                                color: campaign.status == CampaignStatus.liveDispatching ? const Color(0xFFEF4444) : const Color(0xFF10B981),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                campaign.status == CampaignStatus.liveDispatching ? "Pause" : "Resume",
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: campaign.status == CampaignStatus.liveDispatching ? const Color(0xFFEF4444) : const Color(0xFF10B981),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                    ],
                    Row(
                      children: [
                        Text("Analytics", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF4F46E5))),
                        const Icon(Icons.chevron_right_rounded, size: 16, color: Color(0xFF4F46E5)),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _statItem(String label, String val, CandidateColors c, {Color? color}) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF64748B))),
        const SizedBox(height: 2),
        Text(
          val,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: color ?? c.textPrimary,
          ),
        ),
      ],
    );
  }

  String _fmt(int num) {
    if (num >= 1000) {
      return "${(num / 1000).toStringAsFixed(1)}k";
    }
    return "$num";
  }
}
