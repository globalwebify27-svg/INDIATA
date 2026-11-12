import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../../../core/constants/app_constants.dart';
import '../services/auth_service.dart';

class SplashScreen extends StatefulWidget {
  final VoidCallback onInitialized;

  const SplashScreen({
    super.key,
    required this.onInitialized,
  });

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeIn,
    );

    _scaleAnimation = Tween<double>(begin: 0.88, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutBack),
    );

    _animController.forward();

    // Auto-advance after initialization
    Future.delayed(const Duration(milliseconds: 1800), () {
      if (mounted) {
        widget.onInitialized();
      }
    });
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final c = CandidateColors(isDark);

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF070F1E) : const Color(0xFFF1F5F9),
      body: Stack(
        children: [
          // Background ambient radial gradient
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.center,
                  radius: 1.2,
                  colors: isDark
                      ? [
                          const Color(0xFF1E1B4B).withOpacity(0.5),
                          const Color(0xFF070F1E),
                        ]
                      : [
                          const Color(0xFFE0E7FF),
                          const Color(0xFFF8FAFC),
                        ],
                ),
              ),
            ),
          ),

          Center(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: ScaleTransition(
                scale: _scaleAnimation,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Executive Emblem Seal
                    Container(
                      width: 96,
                      height: 96,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color(0xFF6366F1), // Indigo
                            Color(0xFF4338CA), // Deep Indigo
                            Color(0xFF0F172A), // Navy
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF4F46E5).withOpacity(0.4),
                            blurRadius: 28,
                            spreadRadius: 4,
                            offset: const Offset(0, 10),
                          ),
                        ],
                        border: Border.all(
                          color: const Color(0xFFF59E0B).withOpacity(0.8), // Gold border
                          width: 2.5,
                        ),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.military_tech_rounded,
                          size: 48,
                          color: Color(0xFFFBBF24),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // App Title
                    Text(
                      AppConstants.appName,
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 3.0,
                        color: c.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 6),

                    // Badge: Candidate Command Portal
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                      decoration: BoxDecoration(
                        color: const Color(0xFF4F46E5).withOpacity(0.18),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: const Color(0xFF6366F1).withOpacity(0.4),
                        ),
                      ),
                      child: const Text(
                        "CANDIDATE COMMAND CONSOLE",
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1.4,
                          color: Color(0xFF818CF8),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Tagline
                    Text(
                      "Election Intelligence & War Room Architecture",
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: c.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Bottom Telemetry Verification
          Positioned(
            bottom: 36,
            left: 0,
            right: 0,
            child: Column(
              children: [
                SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.2,
                    valueColor: AlwaysStoppedAnimation<Color>(c.accentIndigo),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  "Initializing Secure Tenant Telemetry v${AppConstants.appVersion}",
                  style: TextStyle(
                    fontSize: 11,
                    letterSpacing: 0.5,
                    color: c.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
