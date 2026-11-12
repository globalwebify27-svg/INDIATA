enum CandidateAccountStatus {
  active,
  pendingApproval,
  suspended,
}

enum CandidateRole {
  candidate,
  campaignManager,
  chiefStrategist,
}

class CandidateUser {
  final String id;
  final String name;
  final String candidateNameMr; // Marathi Name
  final String mobile;
  final String email;
  final String constituencyCode;
  final String constituencyName;
  final String constituencyNameMr;
  final String partyName;
  final String partyNameMr;
  final String partySymbolUrl;
  final String photoUrl;
  final CandidateRole role;
  final CandidateAccountStatus status;
  final String token;
  final DateTime lastLoginAt;
  final String organizationId;

  const CandidateUser({
    required this.id,
    required this.name,
    this.candidateNameMr = "ॲड. विक्रम पाटील",
    required this.mobile,
    required this.email,
    required this.constituencyCode,
    required this.constituencyName,
    this.constituencyNameMr = "२१५ - कसबा पेठ",
    required this.partyName,
    this.partyNameMr = "राष्ट्रवादी काँग्रेस पक्ष",
    this.partySymbolUrl = "assets/images/party_symbol.png",
    this.photoUrl = "assets/images/candidate_avatar.png",
    this.role = CandidateRole.candidate,
    this.status = CandidateAccountStatus.active,
    required this.token,
    required this.lastLoginAt,
    required this.organizationId,
  });

  bool get isActive => status == CandidateAccountStatus.active;
  bool get isPendingApproval => status == CandidateAccountStatus.pendingApproval;
  bool get isSuspended => status == CandidateAccountStatus.suspended;

  CandidateUser copyWith({
    String? id,
    String? name,
    String? candidateNameMr,
    String? mobile,
    String? email,
    String? constituencyCode,
    String? constituencyName,
    String? constituencyNameMr,
    String? partyName,
    String? partyNameMr,
    String? partySymbolUrl,
    String? photoUrl,
    CandidateRole? role,
    CandidateAccountStatus? status,
    String? token,
    DateTime? lastLoginAt,
    String? organizationId,
  }) {
    return CandidateUser(
      id: id ?? this.id,
      name: name ?? this.name,
      candidateNameMr: candidateNameMr ?? this.candidateNameMr,
      mobile: mobile ?? this.mobile,
      email: email ?? this.email,
      constituencyCode: constituencyCode ?? this.constituencyCode,
      constituencyName: constituencyName ?? this.constituencyName,
      constituencyNameMr: constituencyNameMr ?? this.constituencyNameMr,
      partyName: partyName ?? this.partyName,
      partyNameMr: partyNameMr ?? this.partyNameMr,
      partySymbolUrl: partySymbolUrl ?? this.partySymbolUrl,
      photoUrl: photoUrl ?? this.photoUrl,
      role: role ?? this.role,
      status: status ?? this.status,
      token: token ?? this.token,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
      organizationId: organizationId ?? this.organizationId,
    );
  }
}
