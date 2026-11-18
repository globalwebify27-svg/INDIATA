import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _controller = TextEditingController();
  bool _submitted = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleReset() {
    if (_controller.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter your registered mobile number or election ID.")),
      );
      return;
    }
    setState(() => _submitted = true);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final c = CandidateColors(isDark);

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        backgroundColor: c.appBarBg,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: c.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Reset Candidate Credentials",
          style: TextStyle(color: c.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: _submitted ? _buildSuccessView(c) : _buildInputView(c),
        ),
      ),
    );
  }

  Widget _buildInputView(CandidateColors c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 12),
        Center(
          child: Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFF4F46E5).withOpacity(0.12),
              border: Border.all(color: const Color(0xFF6366F1)),
            ),
            child: const Center(
              child: Icon(Icons.lock_reset_rounded, size: 38, color: Color(0xFF4F46E5)),
            ),
          ),
        ),
        const SizedBox(height: 24),
        Text(
          "Forgot Your Access Key?",
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: c.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          "Enter your registered mobile phone number or your candidate nomination ID. We will dispatch an OTP verification link to reset your War Room access key.",
          style: TextStyle(fontSize: 13, height: 1.45, color: c.textSecondary),
        ),
        const SizedBox(height: 28),
        Text(
          "REGISTERED MOBILE / NOMINATION ID",
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.1,
            color: c.textMuted,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _controller,
          style: TextStyle(color: c.textPrimary),
          decoration: InputDecoration(
            hintText: "e.g. 9876543210 or MH-215-CAND",
            prefixIcon: const Icon(Icons.badge_outlined, color: Color(0xFF6366F1)),
            filled: true,
            fillColor: c.cardBg,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: c.cardBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: c.cardBorder),
            ),
          ),
        ),
        const SizedBox(height: 28),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: _handleReset,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4F46E5),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Dispatch Reset Verification", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ),
      ],
    );
  }

  Widget _buildSuccessView(CandidateColors c) {
    return Column(
      children: [
        const SizedBox(height: 32),
        const Icon(Icons.check_circle_outline_rounded, color: Color(0xFF10B981), size: 72),
        const SizedBox(height: 20),
        Text(
          "Verification Dispatched",
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: c.textPrimary),
        ),
        const SizedBox(height: 10),
        Text(
          "An encrypted recovery code has been dispatched via SMS to ${_controller.text.trim()}. Please follow the instructions to reset your passcode.",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 13, height: 1.4, color: c.textSecondary),
        ),
        const SizedBox(height: 32),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4F46E5),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Return to Candidate Login"),
          ),
        ),
      ],
    );
  }
}
