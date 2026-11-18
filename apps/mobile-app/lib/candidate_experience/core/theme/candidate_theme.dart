import 'package:flutter/material.dart';

class CandidateColors {
  final bool isDark;
  const CandidateColors(this.isDark);

  // Brand Palettes - Vibrant Violet & Neon AI Accents
  static const Color brandViolet = Color(0xFF6256D9);
  static const Color violetDeep = Color(0xFF4F46E5);
  static const Color violetNeon = Color(0xFFA855F7);
  static const Color violetLight = Color(0xFF7C3AED);
  static const Color charcoalDark = Color(0xFF09090B);
  static const Color charcoalSurface = Color(0xFF141417);
  static const Color charcoalElevated = Color(0xFF202026);

  // Backward compatibility aliases
  static const Color navyDark = Color(0xFF141417);
  static const Color navyDeep = Color(0xFF202026);
  static const Color indigoAccent = Color(0xFF6256D9);
  static const Color royalBlue = Color(0xFF6256D9);

  // Adaptive Surfaces
  Color get scaffoldBg => isDark ? const Color(0xFF09090B) : const Color(0xFFF6F5FF);
  Color get cardBg => isDark ? const Color(0xFF141417) : Colors.white;
  Color get surfaceElevated => isDark ? const Color(0xFF202026) : const Color(0xFFEDE9FE);
  Color get borderColor => isDark ? const Color(0xFF272732) : const Color(0xFFE5E1F8);
  Color get cardBorder => borderColor;
  Color get appBarBg => isDark ? const Color(0xFF141417) : Colors.white;
  
  // Typography
  Color get textPrimary => isDark ? const Color(0xFFF4F4F5) : const Color(0xFF18181B);
  Color get textSecondary => isDark ? const Color(0xFFA1A1AA) : const Color(0xFF52525B);
  Color get textMuted => isDark ? const Color(0xFF71717A) : const Color(0xFF8B8BA3);

  // Status Colors
  Color get primary => isDark ? violetNeon : brandViolet;
  Color get indigo => isDark ? violetNeon : brandViolet;
  Color get accentIndigo => isDark ? violetLight : violetDeep;
  Color get green => isDark ? const Color(0xFF10B981) : const Color(0xFF059669);
  Color get amber => isDark ? const Color(0xFFF59E0B) : const Color(0xFFD97706);
  Color get red => isDark ? const Color(0xFFEF4444) : const Color(0xFFDC2626);
  Color get cyan => isDark ? const Color(0xFF06B6D4) : const Color(0xFF0891B2);
  Color get purple => isDark ? const Color(0xFFC084FC) : const Color(0xFF9333EA);
}

class CandidateTheme {
  static ThemeData buildDarkTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: const Color(0xFF09090B),
      cardColor: const Color(0xFF141417),
      dividerColor: const Color(0xFF272732),
      colorScheme: const ColorScheme.dark(
        primary: CandidateColors.violetNeon,
        secondary: CandidateColors.violetLight,
        surface: Color(0xFF141417),
        onSurface: Color(0xFFF4F4F5),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF141417),
        foregroundColor: Color(0xFFF4F4F5),
        elevation: 0,
      ),
    );
  }

  static ThemeData buildLightTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF6F5FF),
      cardColor: Colors.white,
      dividerColor: const Color(0xFFE5E1F8),
      colorScheme: const ColorScheme.light(
        primary: CandidateColors.brandViolet,
        secondary: CandidateColors.violetLight,
        surface: Colors.white,
        onSurface: Color(0xFF18181B),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: Color(0xFF18181B),
        elevation: 0,
      ),
    );
  }
}
