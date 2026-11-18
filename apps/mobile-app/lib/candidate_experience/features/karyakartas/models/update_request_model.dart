enum UpdateRequestStatus {
  pending,
  approved,
  rejected,
}

enum UpdateFieldType {
  mobileNumber,
  addressShifted,
  deceasedVoter,
  sentimentChanged,
  familyHead,
  schemeEnrollment,
}

class UpdateRequestModel {
  final String id;
  final String voterId;
  final String voterName;
  final String voterNameMr;
  final int boothNumber;
  final String serialNumber;
  final String karyakartaName;
  final String karyakartaPhone;
  final UpdateFieldType fieldType;
  final String fieldLabel;
  final String oldValue;
  final String newValue;
  final String reason;
  final UpdateRequestStatus status;
  final String submittedAt;
  final String? reviewedAt;
  final String? candidateRemarks;

  const UpdateRequestModel({
    required this.id,
    required this.voterId,
    required this.voterName,
    required this.voterNameMr,
    required this.boothNumber,
    required this.serialNumber,
    required this.karyakartaName,
    required this.karyakartaPhone,
    required this.fieldType,
    required this.fieldLabel,
    required this.oldValue,
    required this.newValue,
    required this.reason,
    this.status = UpdateRequestStatus.pending,
    required this.submittedAt,
    this.reviewedAt,
    this.candidateRemarks,
  });

  UpdateRequestModel copyWith({
    UpdateRequestStatus? status,
    String? reviewedAt,
    String? candidateRemarks,
  }) {
    return UpdateRequestModel(
      id: id,
      voterId: voterId,
      voterName: voterName,
      voterNameMr: voterNameMr,
      boothNumber: boothNumber,
      serialNumber: serialNumber,
      karyakartaName: karyakartaName,
      karyakartaPhone: karyakartaPhone,
      fieldType: fieldType,
      fieldLabel: fieldLabel,
      oldValue: oldValue,
      newValue: newValue,
      reason: reason,
      status: status ?? this.status,
      submittedAt: submittedAt,
      reviewedAt: reviewedAt ?? this.reviewedAt,
      candidateRemarks: candidateRemarks ?? this.candidateRemarks,
    );
  }
}
