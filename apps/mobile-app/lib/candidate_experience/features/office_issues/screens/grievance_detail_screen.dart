import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/office_issue_model.dart';

class GrievanceDetailScreen extends StatefulWidget {
  final GrievanceTicket ticket;
  final CandidateColors c;
  final bool isDark;
  final VoidCallback onTicketUpdated;

  const GrievanceDetailScreen({
    super.key,
    required this.ticket,
    required this.c,
    required this.isDark,
    required this.onTicketUpdated,
  });

  @override
  State<GrievanceDetailScreen> createState() => _GrievanceDetailScreenState();
}

class _GrievanceDetailScreenState extends State<GrievanceDetailScreen> {
  late GrievanceStatus _currentStatus;
  final TextEditingController _resolutionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _currentStatus = widget.ticket.status;
    _resolutionController.text = widget.ticket.resolutionNotes ?? "";
  }

  void _updateStatus(GrievanceStatus newStatus) {
    setState(() {
      _currentStatus = newStatus;
      widget.ticket.status = newStatus;
      if (newStatus == GrievanceStatus.resolved && widget.ticket.satisfactionRating == null) {
        widget.ticket.satisfactionRating = 5;
      }
    });
    widget.onTicketUpdated();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.green.shade800,
        content: Text("Ticket status updated to ${widget.ticket.statusLabel}"),
      ),
    );
  }

  void _sendWhatsAppUpdate() {
    final message =
        "Namaskar ${widget.ticket.citizenName} ji. Regarding your grievance #${widget.ticket.id} (${widget.ticket.categoryLabel}) for ${widget.ticket.pethOrWard}: The issue is currently marked '${widget.ticket.statusLabel}'. Assigned worker: ${widget.ticket.assignedWorkerName}. - Adv. Vikram Patil Candidate War Room.";

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.green.shade800,
        content: Row(
          children: [
            const Icon(Icons.send_rounded, color: Colors.white, size: 16),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                "WhatsApp dispatched to ${widget.ticket.citizenPhone}:\n\"$message\"",
                style: const TextStyle(fontSize: 11, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = widget.ticket;
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
            Row(
              children: [
                Text(
                  t.id,
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.primary),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: t.priorityColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(color: t.priorityColor.withOpacity(0.5)),
                  ),
                  child: Text(
                    t.priorityLabel,
                    style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: t.priorityColor),
                  ),
                ),
              ],
            ),
            Text(
              "Created: ${t.createdAt}",
              style: TextStyle(fontSize: 10, color: c.textMuted),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Send WhatsApp Status to Citizen",
            icon: const Icon(Icons.message_rounded, color: Colors.green, size: 20),
            onPressed: _sendWhatsAppUpdate,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        children: [
          // Status Stepper & Quick Action Buttons
          Container(
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
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "LIFECYCLE STATUS STAGE",
                      style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: t.statusColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: t.statusColor),
                      ),
                      child: Text(
                        t.statusLabel,
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: t.statusColor),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _statusStepButton("NEW", GrievanceStatus.ticketNew, Colors.blue),
                    const SizedBox(width: 6),
                    _statusStepButton("IN PROGRESS", GrievanceStatus.inProgress, Colors.amber.shade800),
                    const SizedBox(width: 6),
                    _statusStepButton("RESOLVED", GrievanceStatus.resolved, Colors.green),
                    const SizedBox(width: 6),
                    _statusStepButton("CLOSED", GrievanceStatus.closed, Colors.grey),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Citizen & Location Header Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: c.primary.withOpacity(0.12),
                  child: Icon(t.categoryIcon, color: c.primary, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        t.citizenName,
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "${t.citizenPhone} • Booth #${t.boothNumber}",
                        style: TextStyle(fontSize: 11, color: c.textSecondary),
                      ),
                      Text(
                        t.pethOrWard,
                        style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: c.primary),
                      ),
                    ],
                  ),
                ),
                IconButton.filledTonal(
                  icon: const Icon(Icons.phone_in_talk_rounded, size: 16),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Calling ${t.citizenName} (${t.citizenPhone})...")),
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Grievance Subject & Description Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(
                    color: c.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    t.categoryLabel.toUpperCase(),
                    style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w800, color: c.primary),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  t.title,
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
                ),
                const SizedBox(height: 6),
                Text(
                  t.description,
                  style: TextStyle(fontSize: 11.5, color: c.textSecondary, height: 1.45),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Assigned Field Worker Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: Colors.teal.withOpacity(0.12),
                  child: const Icon(Icons.support_agent_rounded, color: Colors.teal, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "ASSIGNED ACTION KARYAKARTA",
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: c.textMuted),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        t.assignedWorkerName,
                        style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                      ),
                      Text(
                        t.assignedWorkerPhone,
                        style: TextStyle(fontSize: 10.5, color: c.textSecondary),
                      ),
                    ],
                  ),
                ),
                IconButton.filledTonal(
                  icon: const Icon(Icons.chat_bubble_rounded, size: 16),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Messaging ${t.assignedWorkerName} on WhatsApp...")),
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Field Resolution Notes & Verification
          Container(
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
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "FIELD ACTION & RESOLUTION REMARKS",
                      style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
                    ),
                    if (t.satisfactionRating != null)
                      Row(
                        children: List.generate(5, (index) {
                          return Icon(
                            index < t.satisfactionRating! ? Icons.star_rounded : Icons.star_border_rounded,
                            size: 14,
                            color: Colors.amber,
                          );
                        }),
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _resolutionController,
                  maxLines: 3,
                  style: TextStyle(fontSize: 11.5, color: c.textPrimary),
                  decoration: InputDecoration(
                    hintText: "Enter official resolution remarks, PMC officer liaison details...",
                    hintStyle: TextStyle(fontSize: 11, color: c.textMuted),
                    filled: true,
                    fillColor: c.scaffoldBg,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                  ),
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        widget.ticket.resolutionNotes = _resolutionController.text;
                      });
                      widget.onTicketUpdated();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Resolution notes saved successfully.")),
                      );
                    },
                    icon: const Icon(Icons.save_rounded, size: 14, color: Colors.white),
                    label: const Text("Save Notes", style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: c.primary,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Bottom Action: Send WhatsApp Acknowledgement
          ElevatedButton.icon(
            onPressed: _sendWhatsAppUpdate,
            icon: const Icon(Icons.chat_rounded, color: Colors.white, size: 18),
            label: const Text("Dispatch WhatsApp Update to Citizen", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              padding: const EdgeInsets.symmetric(vertical: 13),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),

          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _statusStepButton(String label, GrievanceStatus status, Color color) {
    final isSelected = _currentStatus == status;

    return Expanded(
      child: InkWell(
        onTap: () => _updateStatus(status),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 7),
          decoration: BoxDecoration(
            color: isSelected ? color : color.withOpacity(0.08),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: color, width: isSelected ? 1.5 : 0.8),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 8.5,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : color,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
