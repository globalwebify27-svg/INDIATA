import 'package:flutter/material.dart';
import '../core/theme/candidate_theme.dart';
import '../core/constants/app_constants.dart';
import '../features/auth/services/auth_service.dart';

class CandidateDrawer extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final VoidCallback onToggleTheme;
  final Function(int) onNavigateTab;
  final Function(String) onOpenModule;
  final VoidCallback onLogout;
  final int currentTab;

  const CandidateDrawer({
    super.key,
    required this.c,
    required this.isDark,
    required this.onToggleTheme,
    required this.onNavigateTab,
    required this.onOpenModule,
    required this.onLogout,
    this.currentTab = 2,
  });

  @override
  State<CandidateDrawer> createState() => _CandidateDrawerState();
}

class _CandidateDrawerState extends State<CandidateDrawer> {
  bool _usersExpanded = true;

  @override
  Widget build(BuildContext context) {
    final user = CandidateAuthService().currentUser ?? CandidateAuthService.demoActive;
    final initials = user.name.split(" ").map((w) => w.isNotEmpty ? w[0] : "").take(2).join();

    const slate950 = Color(0xFF020617);
    const slate900 = Color(0xFF0F172A);
    const slate800 = Color(0xFF1E293B);
    const slate400 = Color(0xFF94A3B8);
    const slate300 = Color(0xFFCBD5E1);

    return Drawer(
      backgroundColor: slate950,
      child: SafeArea(
        child: Column(
          children: [
            // BRAND HEADER BAR (MATCHES EXACT WEB SIDEBAR SPEC)
            Container(
              height: 64,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: const BoxDecoration(
                color: slate950,
                border: Border(bottom: BorderSide(color: slate900, width: 1.2)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF2563EB), Color(0xFF4F46E5), Color(0xFF9333EA)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF4F46E5).withOpacity(0.35),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      "IN",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text(
                              "INDATA",
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                                fontSize: 15,
                                letterSpacing: -0.2,
                              ),
                            ),
                            const SizedBox(width: 5),
                            Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                color: const Color(0xFF22D3EE),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF22D3EE).withOpacity(0.8),
                                    blurRadius: 6,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 1),
                        ShaderMask(
                          shaderCallback: (bounds) => const LinearGradient(
                            colors: [Color(0xFFFBBF24), Color(0xFFF472B6), Color(0xFF22D3EE)],
                          ).createShader(bounds),
                          child: const Text(
                            "CANDIDATE PORTAL",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: slate400, size: 20),
                    tooltip: "Close drawer",
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            // MIDDLE SCROLLABLE NAVIGATION LIST (6 EXACT WEB GROUPS)
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                children: [
                  // 1. CORE OPERATIONS
                  _groupHeader("CORE OPERATIONS"),
                  _navItem(
                    icon: Icons.dashboard_rounded,
                    label: "War Room Dashboard",
                    isActive: widget.currentTab == 2,
                    iconColor: const Color(0xFF3B82F6),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onNavigateTab(2);
                    },
                  ),
                  _navItem(
                    icon: Icons.location_on_rounded,
                    label: "Live Field Map",
                    isActive: widget.currentTab == 1,
                    iconColor: const Color(0xFF22D3EE),
                    pulseDot: true,
                    onTap: () {
                      Navigator.pop(context);
                      widget.onNavigateTab(1);
                    },
                  ),
                  _navItem(
                    icon: Icons.chat_bubble_rounded,
                    label: "Live Feedback",
                    iconColor: const Color(0xFF22D3EE),
                    pulseDot: true,
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("feedback");
                    },
                  ),
                  _navItem(
                    icon: Icons.domain_rounded,
                    label: "Office & Issues",
                    iconColor: const Color(0xFFFBBF24),
                    badge: "2",
                    badgeBg: const Color(0x33F59E0B),
                    badgeText: const Color(0xFFFBBF24),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("office_issues");
                    },
                  ),

                  // 2. VOTER INTELLIGENCE
                  _groupHeader("VOTER INTELLIGENCE"),
                  _navItem(
                    icon: Icons.how_to_vote_rounded,
                    label: "Total Voters",
                    isActive: widget.currentTab == 0,
                    iconColor: const Color(0xFF22D3EE),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onNavigateTab(0);
                    },
                  ),
                  _navItem(
                    icon: Icons.contact_phone_rounded,
                    label: "Phone Book",
                    iconColor: const Color(0xFFA855F7),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("phone_book");
                    },
                  ),
                  _navItem(
                    icon: Icons.filter_list_rounded,
                    label: "Filters",
                    iconColor: const Color(0xFF818CF8),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("filters");
                    },
                  ),

                  // 3. WORKFORCE & TEAM
                  _groupHeader("WORKFORCE & TEAM"),
                  _buildUsersAccordion(context),
                  _navItem(
                    icon: Icons.verified_user_rounded,
                    label: "BLO Information",
                    iconColor: const Color(0xFF34D399),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("blo");
                    },
                  ),
                  _navItem(
                    icon: Icons.query_stats_rounded,
                    label: "User Activities",
                    iconColor: const Color(0xFF38BDF8),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("audit_log");
                    },
                  ),

                  // 4. CAMPAIGN & PLANS
                  _groupHeader("CAMPAIGN & PLANS"),
                  _navItem(
                    icon: Icons.campaign_rounded,
                    label: "Campaign Control",
                    isActive: widget.currentTab == 3,
                    iconColor: const Color(0xFFFB7185),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onNavigateTab(3);
                    },
                  ),
                  _navItem(
                    icon: Icons.credit_card_rounded,
                    label: "Subscription Plans",
                    iconColor: const Color(0xFFFBBF24),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("subscriptions");
                    },
                  ),

                  // 5. ANALYTICS & STRATEGY
                  _groupHeader("ANALYTICS & STRATEGY"),
                  _navItem(
                    icon: Icons.bar_chart_rounded,
                    label: "Reports",
                    iconColor: const Color(0xFFA78BFA),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("reports");
                    },
                  ),
                  _navItem(
                    icon: Icons.history_rounded,
                    label: "Previous Election & Strategy",
                    iconColor: const Color(0xFFE879F9),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("previous_election");
                    },
                  ),

                  // 6. ADMINISTRATION
                  _groupHeader("ADMINISTRATION"),
                  _navItem(
                    icon: Icons.settings_suggest_rounded,
                    label: "Profile & Party Settings",
                    iconColor: slate400,
                    onTap: () {
                      Navigator.pop(context);
                      widget.onOpenModule("settings");
                    },
                  ),
                  _navItem(
                    icon: Icons.logout_rounded,
                    label: "Logout",
                    iconColor: const Color(0xFFF43F5E),
                    textColor: const Color(0xFFF43F5E),
                    onTap: () {
                      Navigator.pop(context);
                      widget.onLogout();
                    },
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            ),

            // BOTTOM USER PROFILE PILL (EXACT SPEC MATCH FROM WEB SIDEBAR)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Color(0xFF030712),
                border: Border(top: BorderSide(color: slate900, width: 1.2)),
              ),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A).withOpacity(0.8),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: slate800, width: 1),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: const Color(0xFF2563EB),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        initials.isEmpty ? "VP" : initials,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            user.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 1.5),
                          Row(
                            children: [
                              Container(
                                width: 5,
                                height: 5,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF10B981),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  "${user.constituencyCode} - ${user.constituencyName}",
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    color: slate400,
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _groupHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 10, top: 14, bottom: 4),
      child: Text(
        title,
        style: const TextStyle(
          color: Color(0xFF64748B),
          fontSize: 9.5,
          fontWeight: FontWeight.w800,
          letterSpacing: 1.1,
        ),
      ),
    );
  }

  Widget _navItem({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    bool isActive = false,
    Color? iconColor,
    Color? textColor,
    bool pulseDot = false,
    String? badge,
    Color? badgeBg,
    Color? badgeText,
  }) {
    const activeBg = Color(0xFF132347);
    const activeBorder = Color(0x663B82F6);
    const slate300 = Color(0xFFCBD5E1);

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 1.5),
      decoration: BoxDecoration(
        color: isActive ? activeBg : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isActive ? activeBorder : Colors.transparent,
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8.5),
            child: Row(
              children: [
                if (isActive)
                  Container(
                    width: 3.5,
                    height: 18,
                    margin: const EdgeInsets.only(right: 7),
                    decoration: BoxDecoration(
                      color: const Color(0xFF38BDF8),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                Icon(
                  icon,
                  size: 18,
                  color: isActive ? const Color(0xFF60A5FA) : (iconColor ?? slate300),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: textColor ?? (isActive ? Colors.white : slate300),
                      fontSize: 12,
                      fontWeight: isActive ? FontWeight.bold : FontWeight.w600,
                    ),
                  ),
                ),
                if (pulseDot)
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: const Color(0xFF22D3EE),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF22D3EE).withOpacity(0.8),
                          blurRadius: 5,
                        ),
                      ],
                    ),
                  ),
                if (badge != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                    decoration: BoxDecoration(
                      color: badgeBg ?? const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                        color: badgeText ?? Colors.transparent,
                        width: 0.8,
                      ),
                    ),
                    child: Text(
                      badge,
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: badgeText ?? Colors.white,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUsersAccordion(BuildContext context) {
    const slate300 = Color(0xFFCBD5E1);

    return Column(
      children: [
        Container(
          margin: const EdgeInsets.symmetric(vertical: 1.5),
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                setState(() {
                  _usersExpanded = !_usersExpanded;
                });
              },
              borderRadius: BorderRadius.circular(12),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8.5),
                child: Row(
                  children: [
                    const Icon(
                      Icons.people_alt_rounded,
                      size: 18,
                      color: Color(0xFF2DD4BF),
                    ),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Text(
                        "Users",
                        style: TextStyle(
                          color: slate300,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Container(
                      width: 6,
                      height: 6,
                      margin: const EdgeInsets.only(right: 6),
                      decoration: const BoxDecoration(
                        color: Color(0xFFFBBF24),
                        shape: BoxShape.circle,
                      ),
                    ),
                    Icon(
                      _usersExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                      size: 18,
                      color: const Color(0xFF94A3B8),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        if (_usersExpanded)
          Container(
            margin: const EdgeInsets.only(left: 20, top: 2, bottom: 4),
            padding: const EdgeInsets.only(left: 10),
            decoration: const BoxDecoration(
              border: Border(
                left: BorderSide(color: Color(0xFF334155), width: 1.2),
              ),
            ),
            child: Column(
              children: [
                _subMenuItem("User Dashboard", () {
                  Navigator.pop(context);
                  widget.onOpenModule("user_dashboard");
                }),
                _subMenuItem("All Users", () {
                  Navigator.pop(context);
                  widget.onOpenModule("all_users");
                }),
                _subMenuItem("+ Add User", () {
                  Navigator.pop(context);
                  widget.onOpenModule("add_user");
                }),
                _subMenuItem("Members / Karyakartas", () {
                  Navigator.pop(context);
                  widget.onOpenModule("members");
                }),
                _subMenuItem(
                  "Update Requests",
                  () {
                    Navigator.pop(context);
                    widget.onOpenModule("update_requests");
                  },
                  badge: "3",
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _subMenuItem(String title, VoidCallback onTap, {String? badge}) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              if (badge != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                  decoration: BoxDecoration(
                    color: const Color(0x33F59E0B),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFFBBF24), width: 0.8),
                  ),
                  child: Text(
                    badge,
                    style: const TextStyle(
                      fontSize: 8.5,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFBBF24),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
