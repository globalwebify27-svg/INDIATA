import 'package:flutter/material.dart';
import '../core/theme/candidate_theme.dart';
import '../core/constants/app_constants.dart';
import '../features/auth/services/auth_service.dart';
import '../features/auth/models/candidate_user.dart';
import '../features/auth/screens/splash_screen.dart';
import '../features/auth/screens/login_screen.dart';
import '../features/auth/screens/status_gate_screen.dart';
import '../navigation/main_navigation_scaffold.dart';

class CandidateApp extends StatefulWidget {
  const CandidateApp({super.key});

  @override
  State<CandidateApp> createState() => _CandidateAppState();
}

class _CandidateAppState extends State<CandidateApp> {
  ThemeMode _themeMode = ThemeMode.dark; // Executive Dark Mode by default
  bool _isSplashShowing = true;
  final CandidateAuthService _authService = CandidateAuthService();

  @override
  void initState() {
    super.initState();
    // Start with Active Candidate preloaded for zero-friction launch, but allow full logout/switching
    _authService.initializeWithUser(CandidateAuthService.demoActive);
    _authService.addListener(_onAuthChanged);
  }

  @override
  void dispose() {
    _authService.removeListener(_onAuthChanged);
    super.dispose();
  }

  void _onAuthChanged() {
    setState(() {});
  }

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  void _handleLogout() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: _themeMode == ThemeMode.dark ? const Color(0xFF0B1527) : Colors.white,
        title: const Text("Sign Out of War Room"),
        content: const Text("Are you sure you want to sign out of the Candidate War Room?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _authService.logout();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Candidate logged out safely.")),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text("Sign Out", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = _themeMode == ThemeMode.dark;
    final c = CandidateColors(isDark);
    final user = _authService.currentUser;

    Widget bodyWidget;

    if (_isSplashShowing) {
      bodyWidget = SplashScreen(
        onInitialized: () {
          setState(() => _isSplashShowing = false);
        },
      );
    } else if (user == null) {
      bodyWidget = LoginScreen(
        isDark: isDark,
        onToggleTheme: _toggleTheme,
        onLoginSuccess: () {
          setState(() {});
        },
      );
    } else if (user.isPendingApproval || user.isSuspended) {
      bodyWidget = StatusGateScreen(
        user: user,
        onRefreshSuccess: () {
          setState(() {});
        },
        onLogout: () {
          _authService.logout();
        },
      );
    } else {
      bodyWidget = MainNavigationScaffold(
        c: c,
        isDark: isDark,
        onToggleTheme: _toggleTheme,
        onLogout: _handleLogout,
      );
    }

    return MaterialApp(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: CandidateTheme.buildLightTheme(),
      darkTheme: CandidateTheme.buildDarkTheme(),
      home: bodyWidget,
    );
  }
}
