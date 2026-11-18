import 'package:flutter/material.dart';
import 'candidate_experience/app/candidate_app.dart';
import 'candidate_experience/core/theme/candidate_theme.dart';
import 'candidate_experience/features/auth/services/auth_service.dart';
import 'candidate_experience/navigation/main_navigation_scaffold.dart';
import 'karyakarta_experience/karyakarta_experience.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RajtantraUnifiedApp());
}

/// The Single Unified Mobile Application for Rajtantra.
/// Integrates both the exact Candidate Admin UI (Vibrant Violet #6256D9 / Charcoal #09090B)
/// and the exact Karyakarta UI (Royal Electric Blue #2087FE / Obsidian Navy #010627).
class RajtantraUnifiedApp extends StatefulWidget {
  const RajtantraUnifiedApp({super.key});

  @override
  State<RajtantraUnifiedApp> createState() => _RajtantraUnifiedAppState();
}

class _RajtantraUnifiedAppState extends State<RajtantraUnifiedApp> {
  // Active role portal: 'select', 'candidate', 'karyakarta'
  String _activePortal = 'select';
  ThemeMode _themeMode = ThemeMode.dark;

  void _selectPortal(String portal) {
    setState(() {
      _activePortal = portal;
    });
  }

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  void _setTheme(ThemeMode mode) {
    setState(() {
      _themeMode = mode;
    });
  }

  @override
  Widget build(BuildContext context) {
    // 1. If Candidate Admin selected: render Candidate Theme & exact Candidate Experience
    if (_activePortal == 'candidate') {
      return MaterialApp(
        title: 'RAJTANTRA - Candidate War Room',
        debugShowCheckedModeBanner: false,
        themeMode: _themeMode,
        theme: CandidateTheme.buildLightTheme(),
        darkTheme: CandidateTheme.buildDarkTheme(),
        home: CandidateExperienceWrapper(
          themeMode: _themeMode,
          onToggleTheme: _toggleTheme,
          onSignOut: () => _selectPortal('select'),
        ),
      );
    }

    // 2. If Karyakarta selected: render Karyakarta Theme & exact Karyakarta Experience
    if (_activePortal == 'karyakarta') {
      return MaterialApp(
        title: 'RAJTANTRA - Karyakarta Field Worker',
        debugShowCheckedModeBanner: false,
        themeMode: _themeMode,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.light,
          scaffoldBackgroundColor: const Color(0xFFF8FAFC),
          cardColor: Colors.white,
          dividerColor: const Color(0xFFE2E8F0),
          colorScheme: const ColorScheme.light(
            primary: Color(0xFF2087FE),
            secondary: Color(0xFF059669),
            surface: Colors.white,
            onSurface: Color(0xFF0F172A),
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            foregroundColor: Color(0xFF0F172A),
            elevation: 0,
          ),
        ),
        darkTheme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          scaffoldBackgroundColor: const Color(0xFF010627),
          cardColor: const Color(0xFF0B1527),
          dividerColor: const Color(0xFF1E293B),
          colorScheme: const ColorScheme.dark(
            primary: Color(0xFF2087FE),
            secondary: Color(0xFF12CF94),
            surface: Color(0xFF0B1527),
            onSurface: Colors.white,
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF0B1527),
            foregroundColor: Colors.white,
            elevation: 0,
          ),
        ),
        home: KaryakartaExperienceWrapper(
          themeMode: _themeMode,
          onToggleTheme: _toggleTheme,
          onSetTheme: _setTheme,
          onSignOut: () => _selectPortal('select'),
        ),
      );
    }

    // 3. Root Role Gateway: Select between Candidate and Karyakarta workspaces
    return MaterialApp(
      title: 'RAJTANTRA - Unified Mobile App',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: ThemeData.light(useMaterial3: true),
      darkTheme: ThemeData.dark(useMaterial3: true),
      home: UnifiedPortalGateway(
        isDark: _themeMode == ThemeMode.dark,
        onToggleTheme: _toggleTheme,
        onSelectCandidate: () => _selectPortal('candidate'),
        onSelectKaryakarta: () => _selectPortal('karyakarta'),
      ),
    );
  }
}

// ==============================================================================
// CANDIDATE EXPERIENCE WRAPPER
// ==============================================================================
class CandidateExperienceWrapper extends StatelessWidget {
  final ThemeMode themeMode;
  final VoidCallback onToggleTheme;
  final VoidCallback onSignOut;

  const CandidateExperienceWrapper({
    super.key,
    required this.themeMode,
    required this.onToggleTheme,
    required this.onSignOut,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = themeMode == ThemeMode.dark;
    final c = CandidateColors(isDark);

    return Scaffold(
      body: MainNavigationScaffold(
        c: c,
        isDark: isDark,
        onToggleTheme: onToggleTheme,
        onLogout: onSignOut,
      ),
    );
  }
}

// ==============================================================================
// KARYAKARTA EXPERIENCE WRAPPER
// ==============================================================================
class KaryakartaExperienceWrapper extends StatelessWidget {
  final ThemeMode themeMode;
  final VoidCallback onToggleTheme;
  final Function(ThemeMode) onSetTheme;
  final VoidCallback onSignOut;

  const KaryakartaExperienceWrapper({
    super.key,
    required this.themeMode,
    required this.onToggleTheme,
    required this.onSetTheme,
    required this.onSignOut,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: MainMobileScaffold(
        themeMode: themeMode,
        onToggleTheme: onToggleTheme,
        onSetTheme: onSetTheme,
      ),
    );
  }
}

// ==============================================================================
// UNIFIED PORTAL GATEWAY (Landing Role Switcher)
// ==============================================================================
class UnifiedPortalGateway extends StatelessWidget {
  final bool isDark;
  final VoidCallback onToggleTheme;
  final VoidCallback onSelectCandidate;
  final VoidCallback onSelectKaryakarta;

  const UnifiedPortalGateway({
    super.key,
    required this.isDark,
    required this.onToggleTheme,
    required this.onSelectCandidate,
    required this.onSelectKaryakarta,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = isDark ? const Color(0xFF09090B) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF141417) : Colors.white;
    final borderColor = isDark ? const Color(0xFF272732) : const Color(0xFFE2E8F0);
    final textPrimary = isDark ? Colors.white : const Color(0xFF0F172A);
    final textSecondary = isDark ? const Color(0xFFA1A1AA) : const Color(0xFF64748B);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Theme switcher top bar
              Align(
                alignment: Alignment.topRight,
                child: IconButton(
                  icon: Icon(
                    isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                    color: textSecondary,
                  ),
                  onPressed: onToggleTheme,
                ),
              ),
              const SizedBox(height: 10),

              // Logo & App Name
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF6256D9), Color(0xFF2087FE)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF6256D9).withOpacity(0.3),
                      blurRadius: 18,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: const Center(
                  child: Text(
                    'RT',
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 30,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 18),

              Text(
                'RAJTANTRA',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Role-Based Election Management Mobile App',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: textSecondary,
                ),
              ),
              const SizedBox(height: 36),

              // Option 1: Candidate Admin
              _buildWorkspaceCard(
                title: 'Candidate Admin',
                tag: 'WAR ROOM COMMAND CENTER',
                tagColor: const Color(0xFFA855F7),
                accentColor: const Color(0xFF6256D9),
                icon: Icons.dashboard_customize_rounded,
                description:
                    'War Room Dashboard, Constituency Voters, Turnout Analytics, Karyakarta Fleet, AI Strategy Copilot, and Reports.',
                colorSchemeText: 'Exact UI & Theme: Vibrant Violet (#6256D9) & Executive Charcoal',
                cardBg: cardBg,
                borderColor: borderColor,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                onTap: onSelectCandidate,
              ),

              const SizedBox(height: 20),

              // Option 2: Ground Karyakarta
              _buildWorkspaceCard(
                title: 'Ground Karyakarta',
                tag: 'FIELD WORKER OPERATIONS',
                tagColor: const Color(0xFF10B981),
                accentColor: const Color(0xFF2087FE),
                icon: Icons.how_to_vote_rounded,
                description:
                    'Assigned Polling Booths, 6-Char Key Activation, Offline Voter Search, Doorstep Surveys, and 58mm Thermal Slip Printing.',
                colorSchemeText: 'Exact UI & Theme: Royal Blue (#2087FE) & Obsidian Navy',
                cardBg: cardBg,
                borderColor: borderColor,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                onTap: onSelectKaryakarta,
              ),

              const SizedBox(height: 36),

              // Bottom note
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: borderColor),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.verified_user_outlined, size: 16, color: textSecondary),
                    const SizedBox(width: 8),
                    Text(
                      'Single APK Binary • Role Isolated & Secure',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWorkspaceCard({
    required String title,
    required String tag,
    required Color tagColor,
    required Color accentColor,
    required IconData icon,
    required String description,
    required String colorSchemeText,
    required Color cardBg,
    required Color borderColor,
    required Color textPrimary,
    required Color textSecondary,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: accentColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: accentColor, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                        decoration: BoxDecoration(
                          color: tagColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          tag,
                          style: TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                            color: tagColor,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.arrow_forward_ios_rounded, size: 16, color: textSecondary),
              ],
            ),
            const SizedBox(height: 14),
            Text(
              description,
              style: TextStyle(fontSize: 12.5, height: 1.4, color: textSecondary),
            ),
            const SizedBox(height: 12),
            Divider(color: borderColor, height: 1),
            const SizedBox(height: 10),
            Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: accentColor,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    colorSchemeText,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: accentColor,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
