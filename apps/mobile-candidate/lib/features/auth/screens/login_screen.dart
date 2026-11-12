import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../../../core/constants/app_constants.dart';
import '../services/auth_service.dart';
import '../models/candidate_user.dart';
import 'otp_verification_screen.dart';
import 'forgot_password_screen.dart';

class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;
  final VoidCallback onToggleTheme;
  final bool isDark;

  const LoginScreen({
    super.key,
    required this.onLoginSuccess,
    required this.onToggleTheme,
    required this.isDark,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _mobileController = TextEditingController(text: "9876543210");
  final _passwordController = TextEditingController(text: "admin@123");
  final _authService = CandidateAuthService();

  bool _obscurePassword = true;
  bool _rememberMe = true;
  bool _isLoading = false;

  @override
  void dispose() {
    _mobileController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    final mobileOrEmail = _mobileController.text.trim();
    final password = _passwordController.text.trim();

    if (mobileOrEmail.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter both Candidate ID/Mobile and Password.")),
      );
      return;
    }

    setState(() => _isLoading = true);
    await _authService.login(
      mobileOrEmail: mobileOrEmail,
      password: password,
    );
    setState(() => _isLoading = false);

    if (mounted) {
      // Navigate to OTP verification for 2FA security
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => OtpVerificationScreen(
            mobile: mobileOrEmail,
            onVerificationSuccess: () {
              Navigator.pop(context); // pop OTP screen
              widget.onLoginSuccess();
            },
          ),
        ),
      );
    }
  }

  void _fillPreset(CandidateUser user) {
    setState(() {
      _mobileController.text = user.mobile;
      _passwordController.text = "admin@123";
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Loaded credentials for: ${user.name} (${user.constituencyCode})"),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = widget.isDark;
    final c = CandidateColors(isDark);

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar with Theme Switcher & App Title
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF4F46E5),
                          border: Border.all(color: const Color(0xFFF59E0B), width: 1.5),
                        ),
                        child: const Center(
                          child: Icon(Icons.military_tech_rounded, size: 20, color: Color(0xFFFBBF24)),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        AppConstants.appName,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                          color: c.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: Icon(
                      isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                      color: c.textSecondary,
                    ),
                    onPressed: widget.onToggleTheme,
                    tooltip: "Toggle Theme",
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Welcome Title
              Text(
                "Candidate War Room",
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: c.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                "उमेदवार नियंत्रण कक्ष • Strategic Command Access",
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF6366F1),
                ),
              ),
              const SizedBox(height: 28),

              // Mobile Number or Candidate ID Field
              Text(
                "REGISTERED MOBILE / CANDIDATE ID",
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                  color: c.textMuted,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _mobileController,
                style: TextStyle(color: c.textPrimary, fontWeight: FontWeight.w600),
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  hintText: "Enter 10-digit mobile number",
                  prefixIcon: const Icon(Icons.phone_android_rounded, color: Color(0xFF6366F1)),
                  filled: true,
                  fillColor: c.cardBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: c.cardBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: c.cardBorder),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF4F46E5), width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 18),

              // Password Field
              Text(
                "SECURITY PASSCODE",
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                  color: c.textMuted,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                style: TextStyle(color: c.textPrimary, fontWeight: FontWeight.w600),
                decoration: InputDecoration(
                  hintText: "Enter your secure passcode",
                  prefixIcon: const Icon(Icons.lock_outline_rounded, color: Color(0xFF6366F1)),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      color: c.textMuted,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  filled: true,
                  fillColor: c.cardBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: c.cardBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: c.cardBorder),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF4F46E5), width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Remember Me & Forgot Password
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      SizedBox(
                        width: 24,
                        height: 24,
                        child: Checkbox(
                          value: _rememberMe,
                          activeColor: const Color(0xFF4F46E5),
                          onChanged: (v) => setState(() => _rememberMe = v ?? true),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        "Remember Device",
                        style: TextStyle(fontSize: 12, color: c.textSecondary),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ForgotPasswordScreen()),
                      );
                    },
                    style: TextButton.styleFrom(padding: EdgeInsets.zero),
                    child: const Text(
                      "Forgot Passcode?",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF6366F1)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Login Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4F46E5),
                    foregroundColor: Colors.white,
                    elevation: 3,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(strokeWidth: 2.2, color: Colors.white),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.login_rounded, size: 20),
                            SizedBox(width: 10),
                            Text(
                              "Sign In to War Room",
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 32),

              // Quick Preset Tester (To demo Active, Pending Approval, and Suspended Status Gates)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: c.cardBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.touch_app_rounded, size: 16, color: Color(0xFFF59E0B)),
                        const SizedBox(width: 6),
                        Text(
                          "QUICK DEMO PRESETS (STATUS GATES)",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                            color: c.textMuted,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        ActionChip(
                          avatar: const Icon(Icons.verified_rounded, size: 16, color: Color(0xFF10B981)),
                          label: const Text("Adv. Vikram (Active)", style: TextStyle(fontSize: 11)),
                          backgroundColor: c.cardBg,
                          onPressed: () => _fillPreset(CandidateAuthService.demoActive),
                        ),
                        ActionChip(
                          avatar: const Icon(Icons.hourglass_top_rounded, size: 16, color: Color(0xFFF59E0B)),
                          label: const Text("Smt. Priya (Pending)", style: TextStyle(fontSize: 11)),
                          backgroundColor: c.cardBg,
                          onPressed: () => _fillPreset(CandidateAuthService.demoPending),
                        ),
                        ActionChip(
                          avatar: const Icon(Icons.block_rounded, size: 16, color: Color(0xFFEF4444)),
                          label: const Text("Shri. Ramesh (Suspended)", style: TextStyle(fontSize: 11)),
                          backgroundColor: c.cardBg,
                          onPressed: () => _fillPreset(CandidateAuthService.demoSuspended),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Bottom Security Footer
              Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.shield_outlined, size: 14, color: c.textMuted),
                    const SizedBox(width: 6),
                    Text(
                      "256-Bit Encrypted Multi-Tenant Isolation • v${AppConstants.appVersion}",
                      style: TextStyle(fontSize: 11, color: c.textMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
