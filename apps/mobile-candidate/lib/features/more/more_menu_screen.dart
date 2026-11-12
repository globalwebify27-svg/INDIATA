import 'package:flutter/material.dart';
import '../../core/theme/candidate_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../core/components/section_header.dart';

class MoreMenuScreen extends StatelessWidget {
  final CandidateColors c;
  final bool isDark;
  final VoidCallback onToggleTheme;
  final Function(String) onOpenModule;
  final VoidCallback onLogout;

  const MoreMenuScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.onToggleTheme,
    required this.onOpenModule,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      children: [
        // Candidate Profile Summary Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: c.borderColor),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: c.primary,
                child: const Text("VP", style: TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      AppConstants.defaultCandidateName,
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Text(
                      "Candidate Admin • ${AppConstants.defaultPartyName}",
                      style: TextStyle(fontSize: 10.5, color: c.primary, fontWeight: FontWeight.w600),
                    ),
                    Text(
                      AppConstants.defaultConstituency,
                      style: TextStyle(fontSize: 10, color: c.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 10),

        // SECTION 1: STRATEGIC INTELLIGENCE & AI
        SectionHeader(c: c, title: "Strategic Intelligence & AI"),
        _menuTile(Icons.auto_awesome_rounded, "Global AI Mode (Agentic Copilot)", "Natural language candidate assistant & SQL query generator", c.indigo, () => onOpenModule("ai_mode"), badge: "AI ACTIVE"),
        _menuTile(Icons.history_edu_rounded, "Previous Election & Strategy", "Lok Sabha & Vidhan Sabha trends, swing analysis, strategy bot", c.amber, () => onOpenModule("previous_election")),
        _menuTile(Icons.assessment_rounded, "Reports & Analytics", "14 Mobile analytical reports, export queue, PDF summaries", c.green, () => onOpenModule("reports")),

        const SizedBox(height: 10),

        // SECTION 2: CONSTITUENCY & GROUND MANAGEMENT
        SectionHeader(c: c, title: "Constituency & Operations"),
        _menuTile(Icons.pending_actions_rounded, "Field Update Requests", "Review ground data edits submitted by Karyakartas", c.amber, () => onOpenModule("update_requests"), badge: "4 PENDING"),
        _menuTile(Icons.perm_contact_calendar_rounded, "Candidate Phone Book", "Executive speed-dial directory for key leads and core committee", c.green, () => onOpenModule("phone_book")),
        _menuTile(Icons.receipt_long_rounded, "Office & Issues (Citizen Tickets)", "Visitor log, grievance tracker (NEW -> CLOSED lifecycle)", c.red, () => onOpenModule("office_issues"), badge: "18 OPEN"),
        _menuTile(Icons.contacts_rounded, "BLO Information Directory", "Booth Level Officers registry, contacts, and polling stations", c.primary, () => onOpenModule("blo")),
        _menuTile(Icons.notifications_active_rounded, "Notifications Stream (4 Channels)", "System, Engagement, Strategic Intelligence & Directives", c.purple, () => onOpenModule("notifications"), badge: "4 NEW"),
        _menuTile(Icons.tune_rounded, "Master Filters Management", "Configure demographic, caste, scheme, and household filters", c.cyan, () => onOpenModule("filters")),

        const SizedBox(height: 10),

        // SECTION 3: SYSTEM, LEDGER & SETTINGS
        SectionHeader(c: c, title: "System, Ledger & Subscriptions"),
        _menuTile(Icons.history_rounded, "User Activities & Security Audit", "Immutable event ledger of all candidate and cadre operations", c.textSecondary, () => onOpenModule("audit_log")),
        _menuTile(Icons.workspace_premium_rounded, "Subscription & Commercial Plans", "Election module plans, AI seats, active licenses", c.amber, () => onOpenModule("subscriptions")),
        _menuTile(Icons.settings_suggest_rounded, "Profile, Party & App Settings", "Branding, Karyakarta App Appearance customizer", c.primary, () => onOpenModule("settings")),

        const SizedBox(height: 10),

        // Dark / Light Theme Toggle Tile
        Container(
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: ListTile(
            leading: Icon(isDark ? Icons.light_mode : Icons.dark_mode, color: c.amber),
            title: Text("Display Theme Mode", style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary)),
            subtitle: Text(isDark ? "Obsidian Navy (Night / Indoor)" : "Daylight Crisp Slate (Outdoor Sunlight)", style: TextStyle(fontSize: 10, color: c.textSecondary)),
            trailing: Text(isDark ? "Dark 🌙" : "Light ☀️", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.primary)),
            onTap: onToggleTheme,
          ),
        ),

        const SizedBox(height: 10),

        // Logout
        ElevatedButton.icon(
          onPressed: onLogout,
          icon: const Icon(Icons.logout, color: Colors.white, size: 16),
          label: const Text("Sign Out of War Room", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red.shade900,
            padding: const EdgeInsets.symmetric(vertical: 13),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _menuTile(IconData icon, String title, String subtitle, Color color, VoidCallback onTap, {String? badge}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.borderColor),
      ),
      child: ListTile(
        onTap: onTap,
        dense: true,
        leading: CircleAvatar(
          radius: 17,
          backgroundColor: color.withOpacity(0.12),
          child: Icon(icon, size: 18, color: color),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary),
              ),
            ),
            if (badge != null)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: color, width: 0.8),
                ),
                child: Text(
                  badge,
                  style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold, color: color),
                ),
              ),
          ],
        ),
        subtitle: Text(
          subtitle,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(fontSize: 10, color: c.textSecondary),
        ),
        trailing: Icon(Icons.chevron_right, size: 18, color: c.textMuted),
      ),
    );
  }
}
