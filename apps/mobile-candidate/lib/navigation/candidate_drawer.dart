import 'package:flutter/material.dart';
import '../core/theme/candidate_theme.dart';
import '../core/constants/app_constants.dart';
import '../core/components/status_pill.dart';
import '../features/auth/services/auth_service.dart';

class CandidateDrawer extends StatelessWidget {
  final CandidateColors c;
  final bool isDark;
  final VoidCallback onToggleTheme;
  final Function(int) onNavigateTab;
  final Function(String) onOpenModule;
  final VoidCallback onLogout;

  const CandidateDrawer({
    super.key,
    required this.c,
    required this.isDark,
    required this.onToggleTheme,
    required this.onNavigateTab,
    required this.onOpenModule,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final user = CandidateAuthService().currentUser ?? CandidateAuthService.demoActive;
    final initials = user.name.split(" ").map((w) => w.isNotEmpty ? w[0] : "").take(2).join();

    return Drawer(
      backgroundColor: c.cardBg,
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // Drawer Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF0F223D) : const Color(0xFFEEF2FF),
                border: Border(bottom: BorderSide(color: c.borderColor)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 22,
                        backgroundColor: c.primary,
                        child: Text(
                          initials.isEmpty ? "VP" : initials,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user.name,
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: c.textPrimary),
                            ),
                            Text(
                              user.partyName,
                              style: TextStyle(fontSize: 10, color: c.primary, fontWeight: FontWeight.w600),
                            ),
                            Text(
                              "${user.constituencyCode} - ${user.constituencyName}",
                              style: TextStyle(fontSize: 9.5, color: c.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      StatusPill(label: "WAR ROOM L-9 ACTIVE", color: c.green),
                      const SizedBox(width: 6),
                      StatusPill(label: "SLA 99.98%", color: c.primary),
                    ],
                  ),
                ],
              ),
            ),

            // NAVIGATION SECTIONS
            _drawerHeader("WAR ROOM CORE"),
            _drawerTile(Icons.dashboard_rounded, "Main Dashboard", () {
              Navigator.pop(context);
              onNavigateTab(0);
            }),
            _drawerTile(Icons.how_to_reg_rounded, "Total Voters Directory", () {
              Navigator.pop(context);
              onNavigateTab(1);
            }),
            _drawerTile(Icons.map_rounded, "Live Field Map & Booths", () {
              Navigator.pop(context);
              onNavigateTab(2);
            }),
            _drawerTile(Icons.campaign_rounded, "Campaign Broadcasts", () {
              Navigator.pop(context);
              onNavigateTab(3);
            }),

            _drawerHeader("INTELLIGENCE & STRATEGY"),
            _drawerTile(Icons.auto_awesome_rounded, "Agentic AI Mode", () {
              Navigator.pop(context);
              onOpenModule("ai_mode");
            }, badge: "AI", badgeColor: c.indigo),
            _drawerTile(Icons.history_edu_rounded, "Previous Election Strategy", () {
              Navigator.pop(context);
              onOpenModule("previous_election");
            }),
            _drawerTile(Icons.assessment_rounded, "Reports & Analytics", () {
              Navigator.pop(context);
              onOpenModule("reports");
            }),
            _drawerTile(Icons.receipt_long_rounded, "Office & Issues", () {
              Navigator.pop(context);
              onOpenModule("office_issues");
            }, badge: "18 Open", badgeColor: c.red),

            _drawerHeader("ADMINISTRATION & SETTINGS"),
            _drawerTile(Icons.contacts_rounded, "BLO Directory", () {
              Navigator.pop(context);
              onOpenModule("blo");
            }),
            _drawerTile(Icons.notifications_rounded, "Notifications (4 Streams)", () {
              Navigator.pop(context);
              onOpenModule("notifications");
            }),
            _drawerTile(Icons.workspace_premium_rounded, "Subscriptions & Plans", () {
              Navigator.pop(context);
              onOpenModule("subscriptions");
            }),
            _drawerTile(Icons.settings_suggest_rounded, "Profile & App Appearance", () {
              Navigator.pop(context);
              onOpenModule("settings");
            }),

            const Divider(),

            // Theme Toggle
            ListTile(
              dense: true,
              leading: Icon(isDark ? Icons.light_mode : Icons.dark_mode, size: 20, color: c.amber),
              title: Text("Theme Mode", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
              trailing: Text(isDark ? "Dark 🌙" : "Light ☀️", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.primary)),
              onTap: () {
                Navigator.pop(context);
                onToggleTheme();
              },
            ),

            // Logout
            ListTile(
              dense: true,
              leading: const Icon(Icons.logout, size: 20, color: Colors.red),
              title: const Text("Sign Out of War Room", style: TextStyle(fontSize: 12, color: Colors.red, fontWeight: FontWeight.bold)),
              onTap: () {
                Navigator.pop(context);
                onLogout();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _drawerHeader(String label) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, top: 12, bottom: 4),
      child: Text(
        label,
        style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1.1),
      ),
    );
  }

  Widget _drawerTile(IconData icon, String title, VoidCallback onTap, {String? badge, Color? badgeColor}) {
    return ListTile(
      dense: true,
      leading: Icon(icon, size: 19, color: c.textPrimary),
      title: Text(title, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: c.textPrimary)),
      trailing: badge != null
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: (badgeColor ?? c.primary).withOpacity(0.18),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: badgeColor ?? c.primary, width: 0.8),
              ),
              child: Text(
                badge,
                style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold, color: badgeColor ?? c.primary),
              ),
            )
          : null,
      onTap: onTap,
    );
  }
}
