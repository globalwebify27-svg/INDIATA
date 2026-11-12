import 'package:flutter/material.dart';

class CandidateColors {
  final bool isDark;
  const CandidateColors(this.isDark);

  // Brand Palettes
  static const Color navyDark = Color(0xFF0A192F);
  static const Color navyDeep = Color(0xFF0F2744);
  static const Color indigoAccent = Color(0xFF4F46E5);
  static const Color royalBlue = Color(0xFF2087FE);

  // Adaptive Surfaces
  Color get scaffoldBg => isDark ? const Color(0xFF010627) : const Color(0xFFF8FAFC);
  Color get cardBg => isDark ? const Color(0xFF0B1527) : Colors.white;
  Color get surfaceElevated => isDark ? const Color(0xFF0F223D) : const Color(0xFFF1F5F9);
  Color get borderColor => isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);
  Color get cardBorder => borderColor;
  Color get appBarBg => isDark ? const Color(0xFF0B1527) : Colors.white;
  
  // Typography
  Color get textPrimary => isDark ? Colors.white : const Color(0xFF0F172A);
  Color get textSecondary => isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
  Color get textMuted => isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8);

  // Status Colors
  Color get primary => royalBlue;
  Color get indigo => indigoAccent;
  Color get accentIndigo => indigoAccent;
  Color get green => isDark ? const Color(0xFF10B981) : const Color(0xFF059669);
  Color get amber => isDark ? const Color(0xFFF59E0B) : const Color(0xFFD97706);
  Color get red => isDark ? const Color(0xFFEF4444) : const Color(0xFFDC2626);
  Color get cyan => isDark ? const Color(0xFF06B6D4) : const Color(0xFF0891B2);
  Color get purple => isDark ? const Color(0xFFA855F7) : const Color(0xFF9333EA);
}

class CandidateTheme {
  static ThemeData buildDarkTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: const Color(0xFF010627),
      cardColor: const Color(0xFF0B1527),
      dividerColor: const Color(0xFF1E293B),
      colorScheme: const ColorScheme.dark(
        primary: CandidateColors.royalBlue,
        secondary: CandidateColors.indigoAccent,
        surface: Color(0xFF0B1527),
        onSurface: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF0B1527),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
    );
  }

  static ThemeData buildLightTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      cardColor: Colors.white,
      dividerColor: const Color(0xFFE2E8F0),
      colorScheme: const ColorScheme.light(
        primary: CandidateColors.royalBlue,
        secondary: CandidateColors.indigoAccent,
        surface: Colors.white,
        onSurface: Color(0xFF0F172A),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: Color(0xFF0F172A),
        elevation: 0,
      ),
    );
  }
}
