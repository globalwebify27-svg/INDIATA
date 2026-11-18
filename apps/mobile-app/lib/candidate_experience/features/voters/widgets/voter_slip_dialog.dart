import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../../../core/constants/app_constants.dart';
import '../models/voter_model.dart';

class VoterSlipDialog extends StatelessWidget {
  final VoterModel voter;
  final CandidateColors c;

  const VoterSlipDialog({
    super.key,
    required this.voter,
    required this.c,
  });

  static void show(BuildContext context, VoterModel voter, CandidateColors c) {
    showDialog(
      context: context,
      builder: (_) => VoterSlipDialog(voter: voter, c: c),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Slip Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF0F2744),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                "ELECTION COMMISSION OF INDIA • VOTER INFORMATION SLIP",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 8,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "मतदार माहिती पावती",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
            ),
            const Text(
              "215 - Kasba Peth Assembly Constituency (पुणे)",
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
            ),
            const Divider(color: Color(0xFFCBD5E1), height: 20),

            // Main Voter Details Table
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  _slipRow("Voter Name", "${voter.name}\n${voter.nameMr}", isBold: true),
                  const Divider(height: 12, color: Color(0xFFE2E8F0)),
                  _slipRow("EPIC (Voter ID)", voter.epic, isMono: true),
                  _slipRow("Part / Booth No.", "Booth #${voter.boothNumber}"),
                  _slipRow("Serial Number", voter.serialNumber, isBold: true),
                  _slipRow("Age / Gender", "${voter.age} Yrs / ${voter.gender == VoterGender.male ? 'Male (पु)' : 'Female (स्त्री)'}"),
                  _slipRow("Relative Name", voter.guardianName),
                  _slipRow("Polling Station", voter.area),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Polling Date Box
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.how_to_vote_rounded, size: 16, color: Color(0xFF2563EB)),
                  SizedBox(width: 8),
                  Text(
                    "Poll Date: 20 Nov 2026 • 7:00 AM - 6:00 PM",
                    style: TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E40AF),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Candidate Appeal Tag
            const Text(
              "Issued on behalf of Adv. Vikram Patil Campaign",
              style: TextStyle(fontSize: 9, fontStyle: FontStyle.italic, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 18),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: Color(0xFF25D366),
                          content: Text("Voter Information Slip sent via WhatsApp!"),
                        ),
                      );
                    },
                    icon: const Icon(Icons.share_rounded, size: 16, color: Color(0xFF25D366)),
                    label: const Text("WhatsApp", style: TextStyle(fontSize: 11, color: Color(0xFF1E293B))),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      side: const BorderSide(color: Color(0xFFCBD5E1)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: Color(0xFF4F46E5),
                          content: Text("Printing 58mm Thermal Voter Slip..."),
                        ),
                      );
                    },
                    icon: const Icon(Icons.print_rounded, size: 16, color: Colors.white),
                    label: const Text("Print Slip", style: TextStyle(fontSize: 11, color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      padding: const EdgeInsets.symmetric(vertical: 10),
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

  Widget _slipRow(String label, String val, {bool isBold = false, bool isMono = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
          const SizedBox(width: 12),
          Flexible(
            child: Text(
              val,
              textAlign: TextAlign.end,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
                fontFamily: isMono ? 'monospace' : null,
                color: const Color(0xFF0F172A),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
