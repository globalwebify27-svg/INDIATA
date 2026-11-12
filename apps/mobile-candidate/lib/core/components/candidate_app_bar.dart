import 'package:flutter/material.dart';
import '../theme/candidate_theme.dart';
import '../constants/app_constants.dart';
import '../../features/auth/services/auth_service.dart';

class CandidateAppBar extends StatelessWidget implements PreferredSizeWidget {
  final CandidateColors c;
  final bool isDark;
  final VoidCallback onToggleTheme;
  final VoidCallback onOpenDrawer;
  final VoidCallback? onNotificationsTap;

  const CandidateAppBar({
    super.key,
    required this.c,
    required this.isDark,
    required this.onToggleTheme,
    required this.onOpenDrawer,
    this.onNotificationsTap,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      elevation: 0,
      backgroundColor: c.cardBg,
      leading: IconButton(
        icon: Icon(Icons.menu_rounded, color: c.textPrimary),
        tooltip: "Open Command Drawer",
        onPressed: onOpenDrawer,
      ),
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3.5),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F2744), Color(0xFF2087FE)],
              ),
              borderRadius: BorderRadius.circular(6),
            ),
            child: const Text(
              "RAJTANTRA",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w900,
                fontSize: 10,
                letterSpacing: 1.1,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "War Room",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: c.textPrimary,
                  ),
                ),
                Text(
                  "${CandidateAuthService().currentUser?.name ?? AppConstants.defaultCandidateName} • ${CandidateAuthService().currentUser?.constituencyCode ?? '215'}",
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 9.5,
                    color: c.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        // Live Telemetry Indicator
        Container(
          margin: const EdgeInsets.symmetric(vertical: 14),
          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
          decoration: BoxDecoration(
            color: c.green.withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: c.green, width: 0.8),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: c.green,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 4),
              Text(
                "LIVE",
                style: TextStyle(
                  fontSize: 8.5,
                  fontWeight: FontWeight.w900,
                  color: c.green,
                  letterSpacing: 0.8,
                ),
              ),
            ],
          ),
        ),

        // Dark / Light Theme Toggle
        IconButton(
          icon: Icon(
            isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
            color: isDark ? Colors.amberAccent : c.textPrimary,
            size: 19,
          ),
          tooltip: isDark ? "Switch to Daylight Mode" : "Switch to Obsidian Mode",
          onPressed: onToggleTheme,
        ),

        // Notifications Bell
        IconButton(
          icon: Stack(
            clipBehavior: Clip.none,
            children: [
              Icon(Icons.notifications_none_rounded, color: c.textPrimary, size: 20),
              Positioned(
                right: -2,
                top: -2,
                child: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    color: c.red,
                    shape: BoxShape.circle,
                  ),
                  child: const Text(
                    "4",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 7.5,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
          onPressed: onNotificationsTap,
        ),
      ],
    );
  }
}
