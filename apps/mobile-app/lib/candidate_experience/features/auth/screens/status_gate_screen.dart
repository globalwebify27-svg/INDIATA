import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/candidate_user.dart';
import '../services/auth_service.dart';

class StatusGateScreen extends StatefulWidget {
  final CandidateUser user;
  final VoidCallback onRefreshSuccess;
  final VoidCallback onLogout;

  const StatusGateScreen({
    super.key,
    required this.user,
    required this.onRefreshSuccess,
    required this.onLogout,
  });

  @override
  State<StatusGateScreen> createState() => _StatusGateScreenState();
}

class _StatusGateScreenState extends State<StatusGateScreen> {
  final _authService = CandidateAuthService();
  bool _isChecking = false;

  Future<void> _checkStatus() async {
    setState(() => _isChecking = true);
    await _authService.refreshApprovalStatus();
    setState(() => _isChecking = false);

    if (_authService.currentUser?.isActive == true) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Color(0xFF10B981),
            content: Text("🎉 Account Approved! Welcome to the War Room."),
          ),
        );
        widget.onRefreshSuccess();
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Color(0xFFF59E0B),
            content: Text("Status check complete: Verification still pending with Directorate."),
          ),
        );
      }
    }
  }

  void _showHelpDeskDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.headset_mic_rounded, color: Color(0xFF4F46E5)),
            SizedBox(width: 8),
            Text("Rajtantra Support Desk"),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Contact the Election Operations Directorate for expedited verification or account clearance:",
              style: TextStyle(fontSize: 13),
            ),
            const SizedBox(height: 14),
            _buildContactRow(Icons.phone_rounded, "Helpline", "+91 20 2567 8900"),
            _buildContactRow(Icons.phone_iphone_rounded, "Toll-Free", "1800-RAJ-TANTRA"),
            _buildContactRow(Icons.email_rounded, "Email", "operations@rajtantra.in"),
            _buildContactRow(Icons.verified_user_rounded, "Auth Desk", "superadmin@rajtantra.in"),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Close"),
          ),
        ],
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 16, color: const Color(0xFF6366F1)),
          const SizedBox(width: 8),
          Text("$label: ", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          Expanded(child: Text(val, style: const TextStyle(fontSize: 12))),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final c = CandidateColors(isDark);
    final isPending = widget.user.isPendingApproval;

    final primaryAccent = isPending ? const Color(0xFFF59E0B) : const Color(0xFFEF4444);
    final badgeBg = isPending ? const Color(0xFFFEF3C7) : const Color(0xFFFEE2E2);
    final badgeTextColor = isPending ? const Color(0xFFB45309) : const Color(0xFFB91C1C);

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        backgroundColor: c.appBarBg,
        elevation: 0,
        title: Text(
          isPending ? "Account Under Review" : "Account Suspended",
          style: TextStyle(color: c.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            tooltip: "Sign Out",
            icon: Icon(Icons.logout_rounded, color: c.textSecondary),
            onPressed: widget.onLogout,
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 12),

              // Hero Glowing Status Icon
              Container(
                width: 84,
                height: 84,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: primaryAccent.withOpacity(0.12),
                  border: Border.all(color: primaryAccent, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: primaryAccent.withOpacity(0.25),
                      blurRadius: 20,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Center(
                  child: Icon(
                    isPending ? Icons.hourglass_top_rounded : Icons.lock_outline_rounded,
                    size: 44,
                    color: primaryAccent,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Title and Marathi Subtitle
              Text(
                isPending
                    ? "Candidate Account Awaiting Approval"
                    : "Candidate War Room Access Suspended",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: c.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                isPending
                    ? "उमेदवार खाते मंजुरी प्रलंबित आहे"
                    : "उमेदवार वॉर रूम प्रवेश स्थगित करण्यात आला आहे",
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: primaryAccent,
                ),
              ),
              const SizedBox(height: 24),

              // Candidate Dossier Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: c.cardBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: c.cardBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "APPLICANT DOSSIER",
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.1,
                            color: c.textMuted,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: isDark ? primaryAccent.withOpacity(0.2) : badgeBg,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: primaryAccent.withOpacity(0.4)),
                          ),
                          child: Text(
                            isPending ? "PENDING APPROVAL" : "SUSPENDED",
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isDark ? primaryAccent : badgeTextColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    _buildDossierRow("Candidate Name", widget.user.name, c),
                    _buildDossierRow("Constituency", "${widget.user.constituencyCode} - ${widget.user.constituencyName}", c),
                    _buildDossierRow("Party Affiliation", widget.user.partyName, c),
                    _buildDossierRow("Registered Mobile", "+91 ${widget.user.mobile}", c),
                    _buildDossierRow("Registered Email", widget.user.email, c),
                    _buildDossierRow("Reference Token", widget.user.token, c, isMono: true),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Information Notice Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isPending
                      ? const Color(0xFFFEF3C7).withOpacity(isDark ? 0.08 : 0.6)
                      : const Color(0xFFFEE2E2).withOpacity(isDark ? 0.08 : 0.6),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: primaryAccent.withOpacity(0.3)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      isPending ? Icons.info_outline_rounded : Icons.warning_amber_rounded,
                      color: primaryAccent,
                      size: 22,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        isPending
                            ? "Your candidate registration has been safely received. To ensure strict tenant isolation and electoral roll compliance, the Party Super Admin is verifying your nomination details. You will gain full access to the War Room as soon as verification completes."
                            : "Access to this constituency War Room has been paused by the Platform Administrator. Possible causes include billing verification, role updates, or security compliance holds. Please reach out to the help desk below.",
                        style: TextStyle(
                          fontSize: 12,
                          height: 1.45,
                          color: c.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Action Buttons
              if (isPending) ...[
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton.icon(
                    onPressed: _isChecking ? null : _checkStatus,
                    icon: _isChecking
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : const Icon(Icons.sync_rounded),
                    label: Text(_isChecking ? "Checking Status..." : "Check Approval Status"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
              ],

              SizedBox(
                width: double.infinity,
                height: 48,
                child: OutlinedButton.icon(
                  onPressed: _showHelpDeskDialog,
                  icon: const Icon(Icons.headset_mic_rounded),
                  label: const Text("Contact Election Help Desk"),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: c.textPrimary,
                    side: BorderSide(color: c.cardBorder),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              TextButton.icon(
                onPressed: widget.onLogout,
                icon: const Icon(Icons.swap_horiz_rounded, size: 18),
                label: const Text("Sign In with Different Account"),
                style: TextButton.styleFrom(foregroundColor: c.textMuted),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDossierRow(String label, String value, CandidateColors c, {bool isMono = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: c.textSecondary)),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                fontFamily: isMono ? 'monospace' : null,
                color: c.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
