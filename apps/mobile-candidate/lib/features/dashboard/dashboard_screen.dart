import 'package:flutter/material.dart';
import '../../core/theme/candidate_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../core/components/status_pill.dart';
import '../auth/services/auth_service.dart';
import 'models/telemetry_kpi.dart';
import 'data/dashboard_mock_data.dart';
import 'widgets/kpi_matrix_section.dart';
import 'widgets/sentiment_distribution_card.dart';
import 'widgets/turnout_forecast_card.dart';
import 'widgets/booth_readiness_section.dart';
import 'widgets/quick_war_room_actions.dart';

class DashboardScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final Function(int) onNavigateTab;
  final Function(String) onOpenModule;

  const DashboardScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.onNavigateTab,
    required this.onOpenModule,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late TelemetryKPIs _kpis;
  bool _isRefreshing = false;
  DateTime _lastSyncTime = DateTime.now();

  @override
  void initState() {
    super.initState();
    _kpis = DashboardMockData.defaultKPIs;
  }

  Future<void> _handleRefresh() async {
    setState(() => _isRefreshing = true);
    await Future.delayed(const Duration(milliseconds: 700));
    setState(() {
      _lastSyncTime = DateTime.now();
      _isRefreshing = false;
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF10B981),
          content: Text("War Room telemetry synced with central cluster at ${_formatTime(_lastSyncTime)}"),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final period = dt.hour >= 12 ? "PM" : "AM";
    final min = dt.minute.toString().padLeft(2, '0');
    final sec = dt.second.toString().padLeft(2, '0');
    return "$hour:$min:$sec $period";
  }

  void _showKpiDetailsDialog(String title, String val, String category) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: widget.c.cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF4F46E5).withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.analytics_rounded, color: Color(0xFF4F46E5), size: 20),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: widget.c.textPrimary)),
                  Text("Category: $category", style: TextStyle(fontSize: 11, color: widget.c.textMuted)),
                ],
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Current Constituency Metric:",
              style: TextStyle(fontSize: 12, color: widget.c.textSecondary),
            ),
            const SizedBox(height: 4),
            Text(
              val,
              style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: const Color(0xFF4F46E5)),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: widget.c.scaffoldBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                "Telemetry aggregated from 215 booth clusters and active field surveyors. Updates synchronized every 30 seconds via secure multi-tenant socket.",
                style: TextStyle(fontSize: 11, height: 1.4, color: widget.c.textSecondary),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Close"),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              widget.onOpenModule("Reports & Analytics");
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
            child: const Text("View In Reports", style: TextStyle(color: Colors.white, fontSize: 12)),
          ),
        ],
      ),
    );
  }

  void _exportBriefingReport() {
    showModalBottomSheet(
      context: context,
      backgroundColor: widget.c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFFEF4444), size: 28),
                const SizedBox(width: 10),
                Text(
                  "Export War Room Briefing",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              "Generate an executive intelligence summary of 215 - Kasba Peth with voter sentiment, critical booths, and karyakarta field coverage.",
              style: TextStyle(fontSize: 12, color: widget.c.textSecondary),
            ),
            const SizedBox(height: 20),
            ListTile(
              leading: const Icon(Icons.picture_as_pdf_outlined, color: Colors.red),
              title: const Text("Daily Candidate EOD Brief (PDF)"),
              subtitle: const Text("High-resolution print-ready dossier for core strategy meeting"),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Generating Candidate EOD Briefing PDF...")),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.table_chart_outlined, color: Colors.green),
              title: const Text("Constituency Booth Telemetry (CSV)"),
              subtitle: const Text("Raw demographic & swing voter numbers for external analysis"),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Exporting Booth Telemetry CSV...")),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = widget.isDark;
    final user = CandidateAuthService().currentUser ?? CandidateAuthService.demoActive;

    return RefreshIndicator(
      onRefresh: _handleRefresh,
      color: const Color(0xFF4F46E5),
      child: ListView(
        padding: const EdgeInsets.symmetric(vertical: 14),
        children: [
          // 1. Executive Candidate Identity Header
          _buildCandidateContextCard(user, c, isDark),
          const SizedBox(height: 16),

          // 2. Quick War Room Action Buttons
          QuickWarRoomActions(
            c: c,
            onOpenBroadcast: () => widget.onNavigateTab(3), // Campaign tab
            onOpenFieldMap: () => widget.onNavigateTab(2),   // Field tab
            onFilterSwingVoters: () => widget.onNavigateTab(1), // Voters tab
            onOpenIssues: () => widget.onOpenModule("Office & Grievances"),
            onOpenAiMode: () => widget.onOpenModule("AI Strategic Copilot"),
            onExportReport: _exportBriefingReport,
          ),
          const SizedBox(height: 18),

          // 3. Voter Sentiment Triad (Emerald / Amber / Rose)
          SentimentDistributionCard(
            kpis: _kpis,
            c: c,
            onSelectSentiment: (type) {
              widget.onNavigateTab(1); // Jump to voters with that filter
            },
          ),
          const SizedBox(height: 16),

          // 4. Projected Voter Turnout Trajectory Forecast
          TurnoutForecastCard(
            c: c,
            projectedPct: _kpis.projectedTurnoutPct,
          ),
          const SizedBox(height: 20),

          // 5. Section Header for the 22 KPIs
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.dashboard_customize_rounded, size: 18, color: Color(0xFF4F46E5)),
                    const SizedBox(width: 8),
                    Text(
                      "ALL 22 TELEMETRY METRICS",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.1,
                        color: c.textMuted,
                      ),
                    ),
                  ],
                ),
                Text(
                  "Interactive Matrix",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: c.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // 6. Complete 22 KPI Matrix with Category Filters
          KPIMatrixSection(
            kpis: _kpis,
            c: c,
            onKpiTapped: _showKpiDetailsDialog,
          ),
          const SizedBox(height: 20),

          // 7. Booth Readiness & Field Telemetry Table
          BoothReadinessSection(
            c: c,
            onSelectBooth: (booth) {
              widget.onNavigateTab(2); // Jump to Field Operations
            },
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildCandidateContextCard(dynamic user, CandidateColors c, bool isDark) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDark
              ? [const Color(0xFF0F2744), const Color(0xFF0A192F)]
              : [const Color(0xFFEEF2FF), Colors.white],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? const Color(0xFF1E3A8A) : const Color(0xFFC7D2FE),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Online Live Heartbeat Pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFF10B981),
                      ),
                    ),
                    const SizedBox(width: 6),
                    const Text(
                      "WAR ROOM LIVE",
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: Color(0xFF10B981),
                      ),
                    ),
                  ],
                ),
              ),

              // Days to Polling Pill
              StatusPill(
                label: "33 DAYS TO POLL",
                color: c.primary,
                icon: Icons.timer_outlined,
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Candidate Name & Marathi Name
          Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: const Color(0xFF4F46E5),
                child: Text(
                  user.name.split(" ").map((w) => w[0]).take(2).join(),
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.name,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.3,
                        color: c.textPrimary,
                      ),
                    ),
                    Text(
                      "${user.partyName} • ${user.constituencyCode} - ${user.constituencyName}",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: c.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Polling Date & Last Synchronized Time
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.event_available_rounded, size: 13, color: c.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    "Poll Date: ${AppConstants.defaultElectionDate}",
                    style: TextStyle(fontSize: 10, color: c.textMuted),
                  ),
                ],
              ),
              Text(
                "Sync: ${_formatTime(_lastSyncTime)}",
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w500, color: c.textMuted),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
