import 'package:flutter/foundation.dart';
import '../models/candidate_user.dart';

class CandidateAuthService extends ChangeNotifier {
  static final CandidateAuthService _instance = CandidateAuthService._internal();
  factory CandidateAuthService() => _instance;
  CandidateAuthService._internal();

  // Preset Demo Accounts for testing and verification
  static final CandidateUser demoActive = CandidateUser(
    id: "cand-active-001",
    name: "Adv. Vikram Patil",
    candidateNameMr: "ॲड. विक्रम पाटील",
    mobile: "9876543210",
    email: "vikram.patil@rajtantra.in",
    constituencyCode: "215",
    constituencyName: "Kasba Peth",
    constituencyNameMr: "२१५ - कसबा पेठ",
    partyName: "Rashtravadi Mahayuti",
    partyNameMr: "राष्ट्रवादी महायुती",
    role: CandidateRole.candidate,
    status: CandidateAccountStatus.active,
    token: "jwt_token_active_vikram_215",
    lastLoginAt: DateTime.now(),
    organizationId: "org-pune-215",
  );

  static final CandidateUser demoPending = CandidateUser(
    id: "cand-pending-002",
    name: "Smt. Priya Sharma",
    candidateNameMr: "श्रीमती प्रिया शर्मा",
    mobile: "9823012345",
    email: "priya.sharma@rajtantra.in",
    constituencyCode: "214",
    constituencyName: "Pune Cantonment",
    constituencyNameMr: "२१४ - पुणे छावणी",
    partyName: "Independent Coalition",
    partyNameMr: "अपक्ष आघाडी",
    role: CandidateRole.candidate,
    status: CandidateAccountStatus.pendingApproval,
    token: "jwt_token_pending_priya_214",
    lastLoginAt: DateTime.now().subtract(const Duration(hours: 3)),
    organizationId: "org-pune-214",
  );

  static final CandidateUser demoSuspended = CandidateUser(
    id: "cand-suspended-003",
    name: "Shri. Ramesh Shinde",
    candidateNameMr: "श्री. रमेश शिंदे",
    mobile: "9812345678",
    email: "ramesh.shinde@rajtantra.in",
    constituencyCode: "216",
    constituencyName: "Kothrud",
    constituencyNameMr: "२१६ - कोथरूड",
    partyName: "Democratic Front",
    partyNameMr: "लोकशाही आघाडी",
    role: CandidateRole.candidate,
    status: CandidateAccountStatus.suspended,
    token: "jwt_token_suspended_ramesh_216",
    lastLoginAt: DateTime.now().subtract(const Duration(days: 2)),
    organizationId: "org-pune-216",
  );

  CandidateUser? _currentUser;
  bool _isLoading = false;
  String? _pendingMobileForOtp;

  CandidateUser? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isLoading => _isLoading;
  String? get pendingMobileForOtp => _pendingMobileForOtp;

  void initializeWithUser(CandidateUser user) {
    _currentUser = user;
    notifyListeners();
  }

  Future<bool> login({
    required String mobileOrEmail,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 600));

    // Match demo accounts or assign active by default
    final query = mobileOrEmail.trim().toLowerCase();
    if (query.contains("pending") || query.contains("9823012345") || query.contains("priya")) {
      _currentUser = demoPending;
    } else if (query.contains("suspended") || query.contains("9812345678") || query.contains("shinde")) {
      _currentUser = demoSuspended;
    } else {
      // Default Active Candidate
      _currentUser = demoActive.copyWith(
        mobile: mobileOrEmail.contains("@") ? "9876543210" : mobileOrEmail,
        email: mobileOrEmail.contains("@") ? mobileOrEmail : "vikram.patil@rajtantra.in",
        lastLoginAt: DateTime.now(),
      );
    }

    _isLoading = false;
    notifyListeners();
    return true;
  }

  void prepareOtpVerification(String mobile) {
    _pendingMobileForOtp = mobile;
    notifyListeners();
  }

  Future<bool> verifyOtp(String otp) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 500));

    // Accept valid 6-digit OTP
    if (otp.length == 6) {
      if (_pendingMobileForOtp != null && _pendingMobileForOtp!.contains("9823012345")) {
        _currentUser = demoPending;
      } else if (_pendingMobileForOtp != null && _pendingMobileForOtp!.contains("9812345678")) {
        _currentUser = demoSuspended;
      } else {
        _currentUser = demoActive;
      }
      _pendingMobileForOtp = null;
      _isLoading = false;
      notifyListeners();
      return true;
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> refreshApprovalStatus() async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 800));

    // If pending, simulate approval toggle for interactive demonstration
    if (_currentUser?.status == CandidateAccountStatus.pendingApproval) {
      _currentUser = _currentUser?.copyWith(
        status: CandidateAccountStatus.active,
      );
    }
    _isLoading = false;
    notifyListeners();
  }

  void switchAccount(CandidateUser account) {
    _currentUser = account;
    notifyListeners();
  }

  void logout() {
    _currentUser = null;
    _pendingMobileForOtp = null;
    notifyListeners();
  }
}
