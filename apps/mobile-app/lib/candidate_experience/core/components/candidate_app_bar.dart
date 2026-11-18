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
  Size get preferredSize => const Size.fromHeight(64);

  Widget _buildTranslucentDivider(CandidateColors c, bool isDark) {
    return Container(
      width: 1,
      height: 20,
      margin: const EdgeInsets.symmetric(horizontal: 2),
      color: (isDark ? Colors.white : Colors.black).withOpacity(0.08),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      elevation: 0,
      backgroundColor: c.cardBg,
      toolbarHeight: 64,
      titleSpacing: 0,
      leading: IconButton(
        icon: Icon(Icons.menu_rounded, color: c.textPrimary, size: 22),
        tooltip: "Open Command Drawer",
        onPressed: onOpenDrawer,
      ),
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1.0),
        child: Container(
          color: c.borderColor.withOpacity(isDark ? 0.4 : 0.9),
          height: 1.0,
        ),
      ),
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3.5),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark
                    ? const [Color(0xFF6256D9), Color(0xFFA855F7)]
                    : const [Color(0xFF4F46E5), Color(0xFF7C3AED)],
              ),
              borderRadius: BorderRadius.circular(6),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6256D9).withOpacity(0.3),
                  blurRadius: 4,
                  offset: const Offset(0, 1.5),
                ),
              ],
            ),
            child: const Text(
              "IN",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w900,
                fontSize: 11,
                letterSpacing: 0.8,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Flexible(
                      child: Text(
                        "War Room",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.bold,
                          color: c.textPrimary,
                          letterSpacing: -0.2,
                        ),
                      ),
                    ),
                    const SizedBox(width: 5),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                      decoration: BoxDecoration(
                        color: c.primary.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        "PRO",
                        style: TextStyle(
                          fontSize: 8,
                          fontWeight: FontWeight.w900,
                          color: c.primary,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  "${CandidateAuthService().currentUser?.name ?? AppConstants.defaultCandidateName} • ${CandidateAuthService().currentUser?.constituencyCode ?? '215'}",
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w500,
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
        Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
            decoration: BoxDecoration(
              color: c.green.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: c.green.withOpacity(0.5), width: 0.8),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 5,
                  height: 5,
                  decoration: BoxDecoration(
                    color: c.green,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 3.5),
                Text(
                  "LIVE",
                  style: TextStyle(
                    fontSize: 8.5,
                    fontWeight: FontWeight.w900,
                    color: c.green,
                    letterSpacing: 0.6,
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(width: 2),
        _buildTranslucentDivider(c, isDark),

        // Dark / Light Theme Toggle
        IconButton(
          constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
          padding: EdgeInsets.zero,
          icon: Icon(
            isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
            color: isDark ? Colors.amberAccent : c.textPrimary,
            size: 19,
          ),
          tooltip: isDark ? "Switch to Daylight Mode" : "Switch to Obsidian Mode",
          onPressed: onToggleTheme,
        ),

        _buildTranslucentDivider(c, isDark),

        // Notifications Bell
        IconButton(
          constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
          padding: EdgeInsets.zero,
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
                    border: Border.all(color: c.cardBg, width: 1.2),
                  ),
                  child: const Text(
                    "4",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 7,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
          onPressed: onNotificationsTap,
        ),
        const SizedBox(width: 6),
      ],
    );
  }
}
