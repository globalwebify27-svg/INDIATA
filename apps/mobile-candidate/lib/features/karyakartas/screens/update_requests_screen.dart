import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/update_request_model.dart';
import '../data/karyakarta_mock_data.dart';

class UpdateRequestsScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const UpdateRequestsScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<UpdateRequestsScreen> createState() => _UpdateRequestsScreenState();
}

class _UpdateRequestsScreenState extends State<UpdateRequestsScreen> {
  List<UpdateRequestModel> _requests = [];
  int _activeTab = 0; // 0=Pending, 1=Approved, 2=Rejected

  @override
  void initState() {
    super.initState();
    _requests = List.from(KaryakartaMockData.updateRequests);
  }

  void _approveRequest(UpdateRequestModel req) {
    setState(() {
      final idx = _requests.indexWhere((r) => r.id == req.id);
      if (idx != -1) {
        _requests[idx] = req.copyWith(
          status: UpdateRequestStatus.approved,
          reviewedAt: "Just now by Candidate",
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF10B981),
        content: Text("✓ Approved update for ${req.voterName}! Electoral roll updated."),
      ),
    );
  }

  void _rejectRequest(UpdateRequestModel req) {
    final controller = TextEditingController(text: "Insufficient ground verification documentation");
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: widget.c.cardBg,
        title: Text("Reject Update Request", style: TextStyle(color: widget.c.textPrimary)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Provide feedback to Karyakarta ${req.karyakartaName}:", style: TextStyle(fontSize: 12, color: widget.c.textSecondary)),
            const SizedBox(height: 8),
            TextField(
              controller: controller,
              maxLines: 2,
              style: TextStyle(color: widget.c.textPrimary, fontSize: 13),
              decoration: InputDecoration(
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
              Navigator.pop(ctx);
              setState(() {
                final idx = _requests.indexWhere((r) => r.id == req.id);
                if (idx != -1) {
                  _requests[idx] = req.copyWith(
                    status: UpdateRequestStatus.rejected,
                    reviewedAt: "Rejected just now",
                    candidateRemarks: controller.text.trim(),
                  );
                }
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: const Color(0xFFEF4444),
                  content: Text("Request rejected with feedback sent to ${req.karyakartaName}."),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444)),
            child: const Text("Confirm Rejection", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    final pendingList = _requests.where((r) => r.status == UpdateRequestStatus.pending).toList();
    final approvedList = _requests.where((r) => r.status == UpdateRequestStatus.approved).toList();
    final rejectedList = _requests.where((r) => r.status == UpdateRequestStatus.rejected).toList();

    List<UpdateRequestModel> currentList;
    if (_activeTab == 0) {
      currentList = pendingList;
    } else if (_activeTab == 1) {
      currentList = approvedList;
    } else {
      currentList = rejectedList;
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
          "Field Update Requests",
          style: TextStyle(color: c.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          if (pendingList.isNotEmpty)
            TextButton(
              onPressed: () {
                setState(() {
                  for (int i = 0; i < _requests.length; i++) {
                    if (_requests[i].status == UpdateRequestStatus.pending) {
                      _requests[i] = _requests[i].copyWith(
                        status: UpdateRequestStatus.approved,
                        reviewedAt: "Batch approved",
                      );
                    }
                  }
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: Color(0xFF10B981),
                    content: Text("All pending field update requests have been approved!"),
                  ),
                );
              },
              child: const Text("Approve All", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
            ),
        ],
      ),
      body: Column(
        children: [
          // Segment Tabs
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: c.appBarBg,
            child: Row(
              children: [
                _tabItem(0, "Pending (${pendingList.length})", const Color(0xFFF59E0B)),
                const SizedBox(width: 8),
                _tabItem(1, "Approved (${approvedList.length})", const Color(0xFF10B981)),
                const SizedBox(width: 8),
                _tabItem(2, "Rejected (${rejectedList.length})", const Color(0xFFEF4444)),
              ],
            ),
          ),

          // Explanatory Note
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: c.scaffoldBg,
            child: Row(
              children: [
                const Icon(Icons.info_outline_rounded, size: 14, color: Color(0xFF6366F1)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    "Doorstep surveyors submit record amendments. Approving merges changes into central database.",
                    style: TextStyle(fontSize: 10.5, color: c.textMuted),
                  ),
                ),
              ],
            ),
          ),

          // Requests List
          Expanded(
            child: currentList.isNotEmpty
                ? ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: currentList.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final req = currentList[index];
                      return _buildRequestCard(req, c);
                    },
                  )
                : Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.check_circle_outline_rounded, size: 54, color: Color(0xFF10B981)),
                        const SizedBox(height: 12),
                        Text(
                          _activeTab == 0 ? "All requests reviewed!" : "No records in this tab.",
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
                        ),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _tabItem(int idx, String label, Color accent) {
    final isSel = _activeTab == idx;
    final c = widget.c;

    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _activeTab = idx),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSel ? accent.withOpacity(0.15) : c.cardBg,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: isSel ? accent : c.cardBorder),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
              color: isSel ? accent : c.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRequestCard(UpdateRequestModel req, CandidateColors c) {
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
          // Header: Request ID, Field Type, Booth #
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF4F46E5).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  req.fieldLabel.toUpperCase(),
                  style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                ),
              ),
              const SizedBox(width: 6),
              Text(
                "Booth #${req.boothNumber} • Serial #${req.serialNumber}",
                style: TextStyle(fontSize: 10.5, color: c.textMuted),
              ),
              const Spacer(),
              Text(
                req.submittedAt,
                style: TextStyle(fontSize: 10, color: c.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Voter Name
          Text(
            "${req.voterName} (${req.voterNameMr})",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary),
          ),
          const SizedBox(height: 10),

          // DIFF COMPARISON BOX (BEFORE VS AFTER)
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.scaffoldBg,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: c.cardBorder),
            ),
            child: Column(
              children: [
                // Old Value
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEF4444).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text("OLD", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFFEF4444))),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        req.oldValue,
                        style: const TextStyle(
                          fontSize: 12,
                          decoration: TextDecoration.lineThrough,
                          color: Color(0xFFEF4444),
                        ),
                      ),
                    ),
                  ],
                ),
                const Divider(height: 12),

                // New Value
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text("NEW", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        req.newValue,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF10B981),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Karyakarta Note
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(Icons.notes_rounded, size: 14, color: c.textMuted),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  "\"${req.reason}\" — Submitted by ${req.karyakartaName}",
                  style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: c.textSecondary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // ACTIONS (If Pending)
          if (req.status == UpdateRequestStatus.pending) ...[
            const Divider(height: 1),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _rejectRequest(req),
                    icon: const Icon(Icons.close_rounded, size: 16, color: Color(0xFFEF4444)),
                    label: const Text("Reject", style: TextStyle(color: Color(0xFFEF4444))),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFEF4444)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _approveRequest(req),
                    icon: const Icon(Icons.check_rounded, size: 16, color: Colors.white),
                    label: const Text("Approve & Merge", style: TextStyle(color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
              ],
            ),
          ] else ...[
            Row(
              children: [
                Icon(
                  req.status == UpdateRequestStatus.approved ? Icons.verified_rounded : Icons.cancel_rounded,
                  size: 14,
                  color: req.status == UpdateRequestStatus.approved ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                ),
                const SizedBox(width: 6),
                Text(
                  "${req.status == UpdateRequestStatus.approved ? 'Approved' : 'Rejected'}: ${req.reviewedAt ?? ''}",
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.bold,
                    color: req.status == UpdateRequestStatus.approved ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
