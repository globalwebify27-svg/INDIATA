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
  int _currentTab = 0;
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
          DashboardScreen(
            c: c,
            isDark: widget.isDark,
            onNavigateTab: _navigateToTab,
            onOpenModule: _handleOpenModule,
          ),
          VotersScreen(
            c: c,
            isDark: widget.isDark,
            onOpenVoterDossier: _handleOpenVoterDossier,
          ),
          FieldOperationsScreen(
            c: c,
            isDark: widget.isDark,
          ),
          CampaignsScreen(
            c: c,
            isDark: widget.isDark,
          ),
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
        decoration: BoxDecoration(
          color: c.cardBg,
          border: Border(top: BorderSide(color: c.borderColor, width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentTab,
          onTap: _navigateToTab,
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: c.primary,
          unselectedItemColor: c.textSecondary,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
          unselectedLabelStyle: const TextStyle(fontSize: 10),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: "Home",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.people_alt_rounded),
              label: "Voters",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.map_rounded),
              label: "Field",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.campaign_rounded),
              label: "Campaign",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.menu_rounded),
              label: "More",
            ),
          ],
        ),
      ),
    );
  }
}
