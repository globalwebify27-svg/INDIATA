import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/voter_model.dart';
import 'voter_slip_dialog.dart';

class VoterCard extends StatelessWidget {
  final VoterModel voter;
  final CandidateColors c;
  final VoidCallback onTap;
  final Function(VoterSentiment newSentiment)? onSentimentChanged;

  const VoterCard({
    super.key,
    required this.voter,
    required this.c,
    required this.onTap,
    this.onSentimentChanged,
  });

  @override
  Widget build(BuildContext context) {
    Color sentimentColor;
    String sentimentText;

    switch (voter.sentiment) {
      case VoterSentiment.favorable:
        sentimentColor = const Color(0xFF10B981);
        sentimentText = "Supporter";
        break;
      case VoterSentiment.swing:
        sentimentColor = const Color(0xFFF59E0B);
        sentimentText = "Swing Voter";
        break;
      case VoterSentiment.opposition:
        sentimentColor = const Color(0xFFEF4444);
        sentimentText = "Opposition";
        break;
      case VoterSentiment.unclassified:
        sentimentColor = const Color(0xFF94A3B8);
        sentimentText = "Unclassified";
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
            // Top Meta Row: Booth #, Serial #, Sentiment Badge, Influencer Star
            Row(
              children: [
                // Booth & Serial Tag
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF4F46E5).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    "B#${voter.boothNumber} • S#${voter.serialNumber}",
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF6366F1),
                    ),
                  ),
                ),
                const SizedBox(width: 6),

                // Sentiment Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: sentimentColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: sentimentColor,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 5),
                      Text(
                        sentimentText,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: sentimentColor,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),

                // Influencer Star
                if (voter.isKeyInfluencer)
                  Container(
                    margin: const EdgeInsets.only(right: 6),
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFBBF24).withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.star_rounded, size: 14, color: Color(0xFFF59E0B)),
                  ),

                // Voter Slip Status
                Icon(
                  voter.isSlipDistributed ? Icons.check_circle_rounded : Icons.pending_outlined,
                  size: 16,
                  color: voter.isSlipDistributed ? const Color(0xFF10B981) : c.textMuted,
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Names & Marathi Names
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: sentimentColor.withOpacity(0.15),
                  child: Text(
                    voter.name.isNotEmpty ? voter.name[0] : "V",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: sentimentColor,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        voter.name,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: c.textPrimary,
                        ),
                      ),
                      Text(
                        voter.nameMr,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: c.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "EPIC: ${voter.epic} • House #${voter.houseNumber}",
                        style: TextStyle(
                          fontSize: 10.5,
                          fontFamily: 'monospace',
                          color: c.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Secondary Details (Age, Gender, Area, Family Head)
            Wrap(
              spacing: 6,
              runSpacing: 4,
              children: [
                _miniTag("${voter.age} Yrs", c),
                _miniTag(voter.gender == VoterGender.male ? "Male" : "Female", c),
                _miniTag(voter.area, c),
                if (voter.isHeadOfFamily)
                  _miniTag("Family Head (3 members)", c, isAccent: true),
                if (voter.welfareSchemes.isNotEmpty)
                  _miniTag("${voter.welfareSchemes.length} Scheme Beneficiary", c, isGreen: true),
              ],
            ),
            const SizedBox(height: 12),
            Divider(height: 1, color: c.cardBorder),
            const SizedBox(height: 8),

            // Quick Actions Bar
            Row(
              children: [
                // Quick Call
                _actionIconButton(
                  icon: Icons.call_rounded,
                  color: const Color(0xFF10B981),
                  label: "Call",
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Initiating call to ${voter.name} (+91 ${voter.mobile})")),
                    );
                  },
                ),
                const SizedBox(width: 8),

                // Quick WhatsApp
                _actionIconButton(
                  icon: Icons.chat_rounded,
                  color: const Color(0xFF22C55E),
                  label: "WhatsApp",
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Opening WhatsApp chat with ${voter.name}")),
                    );
                  },
                ),
                const SizedBox(width: 8),

                // Quick Slip
                _actionIconButton(
                  icon: Icons.confirmation_number_outlined,
                  color: const Color(0xFF4F46E5),
                  label: "Voter Slip",
                  onTap: () => VoterSlipDialog.show(context, voter, c),
                ),
                const Spacer(),

                // View Dossier CTA
                Row(
                  children: [
                    Text(
                      "Full Dossier",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF6366F1),
                      ),
                    ),
                    const Icon(Icons.chevron_right_rounded, size: 16, color: Color(0xFF6366F1)),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _miniTag(String label, CandidateColors c, {bool isAccent = false, bool isGreen = false}) {
    Color bg = c.scaffoldBg;
    Color text = c.textSecondary;

    if (isAccent) {
      bg = const Color(0xFF4F46E5).withOpacity(0.1);
      text = const Color(0xFF6366F1);
    } else if (isGreen) {
      bg = const Color(0xFF10B981).withOpacity(0.1);
      text = const Color(0xFF10B981);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: text),
      ),
    );
  }

  Widget _actionIconButton({
    required IconData icon,
    required Color color,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(6),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 13, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: color),
            ),
          ],
        ),
      ),
    );
  }
}
