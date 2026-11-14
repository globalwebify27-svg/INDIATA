import 'package:flutter/material.dart';
import '../core/theme/candidate_theme.dart';
import '../core/components/candidate_app_bar.dart';
import 'candidate_drawer.dart';
import '../features/dashboard/dashboard_screen.dart';
import '../features/voters/voters_screen.dart';
import '../features/voters/screens/voter_profile_screen.dart';
import '../features/voters/data/voters_mock_data.dart';
import '../features/field_operations/field_operations_screen.dart';
import '../features/campaigns/campaigns_screen.dart';
import '../features/more/more_menu_screen.dart';
import '../features/karyakartas/screens/update_requests_screen.dart';
import '../features/karyakartas/screens/candidate_phone_book_screen.dart';
import '../features/field_operations/screens/blo_directory_screen.dart';
import '../features/reports/screens/reports_screen.dart';
import '../features/strategy/screens/previous_election_screen.dart';
import '../features/office_issues/screens/office_issues_screen.dart';
import '../features/ai_mode/screens/ai_mode_screen.dart';
import '../features/notifications/screens/notifications_screen.dart';
import '../features/audit_log/screens/audit_log_screen.dart';
import '../features/settings/screens/settings_screen.dart';
import '../features/subscriptions/screens/subscriptions_screen.dart';
import '../features/filters/screens/filters_management_screen.dart';

class MainNavigationScaffold extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final VoidCallback onToggleTheme;
  final VoidCallback onLogout;

  const MainNavigationScaffold({
    super.key,
    required this.c,
    required this.isDark,
    required this.onToggleTheme,
    required this.onLogout,
  });

  @override
  State<MainNavigationScaffold> createState() => _MainNavigationScaffoldState();
}

class _MainNavigationScaffoldState extends State<MainNavigationScaffold> {
  // Slot 3 (Center Anchor): Home Dashboard (Index 2)
  int _currentTab = 2;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  void _navigateToTab(int index) {
    setState(() {
      _currentTab = index;
    });
  }

  void _handleOpenModule(String moduleKey) {
    if (moduleKey == "update_requests" || moduleKey == "Update Requests") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => UpdateRequestsScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "phone_book" || moduleKey == "Phone Book") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => CandidatePhoneBookScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "blo" || moduleKey == "BLO Information Directory" || moduleKey == "blo_directory") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => BloDirectoryScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "reports" || moduleKey == "Reports & Analytics") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ReportsScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "previous_election" ||
        moduleKey == "Previous Election & Strategy" ||
        moduleKey == "Previous Election Strategy") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => PreviousElectionScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "office_issues" ||
        moduleKey == "Office & Issues" ||
        moduleKey == "Office & Grievances") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => OfficeIssuesScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "ai_mode" ||
        moduleKey == "AI Strategic Copilot" ||
        moduleKey == "Agentic AI Mode" ||
        moduleKey == "Global AI Mode (Agentic Copilot)") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => AiModeScreen(
            c: widget.c,
            isDark: widget.isDark,
            onExecuteAction: (actionKey) {
              if (actionKey == "VIEW_SWING_BOOTHS" ||
                  actionKey == "OPEN_VOTERS" ||
                  actionKey == "VIEW_BENEFICIARIES") {
                _navigateToTab(1);
              } else if (actionKey == "OPEN_FIELD_MAP" ||
                  actionKey == "DEPLOY_WORKERS") {
                _navigateToTab(2);
              } else if (actionKey == "LAUNCH_CAMPAIGN" ||
                  actionKey == "BROADCAST_LADKI_BAHIN") {
                _navigateToTab(3);
              } else if (actionKey == "OPEN_REPORT_14" ||
                  actionKey == "SIMULATE_TURNOUT") {
                _handleOpenModule("reports");
              }
            },
          ),
        ),
      );
      return;
    }

    if (moduleKey == "notifications" ||
        moduleKey == "Notifications Stream (4 Channels)" ||
        moduleKey == "Notifications (4 Streams)") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => NotificationsScreen(
            c: widget.c,
            isDark: widget.isDark,
            onOpenModule: _handleOpenModule,
          ),
        ),
      );
      return;
    }

    if (moduleKey == "audit_log" ||
        moduleKey == "User Activities & Security Audit" ||
        moduleKey == "Audit Ledger") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => AuditLogScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "settings" ||
        moduleKey == "Profile, Party & App Settings" ||
        moduleKey == "Profile & App Appearance") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => SettingsScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "subscriptions" ||
        moduleKey == "Subscription & Commercial Plans" ||
        moduleKey == "Subscriptions & Plans") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => SubscriptionsScreen(c: widget.c, isDark: widget.isDark),
        ),
      );
      return;
    }

    if (moduleKey == "filters" ||
        moduleKey == "Master Filters Management") {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => FiltersManagementScreen(
            c: widget.c,
            isDark: widget.isDark,
            onNavigateTab: _navigateToTab,
          ),
        ),
      );
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: widget.c.cardBg,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(20),
          height: MediaQuery.of(context).size.height * 0.65,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "MODULE: ${moduleKey.toUpperCase()}",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w900,
                      color: widget.c.primary,
                      letterSpacing: 1,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const Divider(),
              const SizedBox(height: 10),
              Text(
                "RAJTANTRA Candidate War Room Module Active",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
              ),
              const SizedBox(height: 8),
              Text(
                "This module is initialized in Phase 1 Foundation and connects to the central candidate backend in the upcoming phase execution.",
                style: TextStyle(fontSize: 12, color: widget.c.textSecondary, height: 1.5),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(
                  backgroundColor: widget.c.primary,
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text("Return to War Room", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      },
    );
  }

  void _handleOpenVoterDossier(String voterId) {
    final voter = VotersMockData.voters.firstWhere(
      (v) => v.id == voterId || v.epic == voterId,
      orElse: () => VotersMockData.voters.first,
    );

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => VoterProfileScreen(
          voter: voter,
          c: widget.c,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: c.scaffoldBg,
      appBar: CandidateAppBar(
        c: c,
        isDark: widget.isDark,
        onToggleTheme: widget.onToggleTheme,
        onOpenDrawer: () => _scaffoldKey.currentState?.openDrawer(),
        onNotificationsTap: () => _handleOpenModule("notifications"),
      ),
      drawer: CandidateDrawer(
        c: c,
        isDark: widget.isDark,
        onToggleTheme: widget.onToggleTheme,
        onNavigateTab: _navigateToTab,
        onOpenModule: _handleOpenModule,
        onLogout: widget.onLogout,
      ),
      body: IndexedStack(
        index: _currentTab,
        children: [
          // Slot 1: Voter Directory (Index 0)
          VotersScreen(
            c: c,
            isDark: widget.isDark,
            onOpenVoterDossier: _handleOpenVoterDossier,
          ),
          // Slot 2: Field Tracking (Index 1)
          FieldOperationsScreen(
            c: c,
            isDark: widget.isDark,
          ),
          // Slot 3 (Center Anchor): Home Dashboard (Index 2)
          DashboardScreen(
            c: c,
            isDark: widget.isDark,
            onNavigateTab: _navigateToTab,
            onOpenModule: _handleOpenModule,
          ),
          // Slot 4: Broadcasts (Index 3)
          CampaignsScreen(
            c: c,
            isDark: widget.isDark,
          ),
          // Slot 5: Office / Profile (Index 4)
          MoreMenuScreen(
            c: c,
            isDark: widget.isDark,
            onToggleTheme: widget.onToggleTheme,
            onOpenModule: _handleOpenModule,
            onLogout: widget.onLogout,
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        decoration: BoxDecoration(
          color: c.cardBg,
          border: Border(
            top: BorderSide(
              color: c.borderColor.withOpacity(widget.isDark ? 0.4 : 0.8),
              width: 1.2,
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(widget.isDark ? 0.35 : 0.05),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: Row(
            children: [
              _buildNavTab(
                index: 0,
                label: "Voters",
                sublabel: "Directory",
                icon: Icons.how_to_reg_rounded,
                isCenter: false,
                c: c,
              ),
              _buildNavDivider(c),
              _buildNavTab(
                index: 1,
                label: "Field",
                sublabel: "Tracking",
                icon: Icons.map_rounded,
                isCenter: false,
                c: c,
              ),
              _buildNavDivider(c),
              _buildNavTab(
                index: 2,
                label: "Home",
                sublabel: "Dashboard",
                icon: Icons.dashboard_rounded,
                isCenter: true,
                c: c,
              ),
              _buildNavDivider(c),
              _buildNavTab(
                index: 3,
                label: "Broadcasts",
                sublabel: "Campaign",
                icon: Icons.campaign_rounded,
                isCenter: false,
                c: c,
              ),
              _buildNavDivider(c),
              _buildNavTab(
                index: 4,
                label: "Office",
                sublabel: "Profile",
                icon: Icons.account_circle_rounded,
                isCenter: false,
                c: c,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavTab({
    required int index,
    required String label,
    required String sublabel,
    required IconData icon,
    required bool isCenter,
    required CandidateColors c,
  }) {
    final isSelected = _currentTab == index;
    final isDark = widget.isDark;

    if (isCenter) {
      return Expanded(
        flex: 12,
        child: InkWell(
          onTap: () => _navigateToTab(index),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 4),
            decoration: BoxDecoration(
              gradient: isSelected
                  ? LinearGradient(
                      colors: isDark
                          ? const [Color(0xFF6256D9), Color(0xFFA855F7)]
                          : const [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                    )
                  : null,
              color: isSelected
                  ? null
                  : (isDark ? const Color(0xFF202026) : const Color(0xFFEDE9FE)),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected
                    ? c.primary
                    : (isDark ? const Color(0xFF272732) : const Color(0xFFE5E1F8)),
                width: 1.2,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: const Color(0xFF6256D9).withOpacity(0.35),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ]
                  : null,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  icon,
                  size: 21,
                  color: isSelected
                      ? Colors.white
                      : (isDark ? const Color(0xFFA855F7) : const Color(0xFF6256D9)),
                ),
                const SizedBox(height: 2),
                Text(
                  label,
                  maxLines: 1,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: isSelected
                        ? Colors.white
                        : (isDark ? const Color(0xFFA855F7) : const Color(0xFF6256D9)),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Expanded(
      flex: 11,
      child: InkWell(
        onTap: () => _navigateToTab(index),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
          decoration: BoxDecoration(
            color: isSelected
                ? (isDark ? const Color(0xFF272732) : const Color(0xFFEDE9FE))
                : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected
                  ? (isDark
                      ? const Color(0xFFA855F7).withOpacity(0.5)
                      : const Color(0xFF6256D9).withOpacity(0.35))
                  : Colors.transparent,
              width: 1,
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 20,
                color: isSelected ? c.primary : c.textSecondary,
              ),
              const SizedBox(height: 2),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 9.5,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                  color: isSelected ? c.primary : c.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavDivider(CandidateColors c) {
    return Container(
      width: 1,
      height: 26,
      margin: const EdgeInsets.symmetric(horizontal: 2),
      color: (widget.isDark ? Colors.white : Colors.black).withOpacity(0.06),
    );
  }
    );
  }
}
