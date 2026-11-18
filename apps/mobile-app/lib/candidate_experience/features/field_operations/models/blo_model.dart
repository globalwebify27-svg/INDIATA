class BloModel {
  final String id;
  final String name;
  final String nameMr;
  final String designation;
  final String mobile;
  final String officePhone;
  final String officeAddress;
  final String boothRange;
  final List<int> assignedBooths;
  final int totalVotersInCharge;
  final int form6NewVotersCount;
  final int form6ApprovedCount;
  final int form7DeletionsCount;
  final int form8CorrectionsCount;
  final String lastMeetingDate;
  final String candidateLiaisonNotes;

  const BloModel({
    required this.id,
    required this.name,
    required this.nameMr,
    required this.designation,
    required this.mobile,
    this.officePhone = "020-25678900",
    required this.officeAddress,
    required this.boothRange,
    required this.assignedBooths,
    required this.totalVotersInCharge,
    required this.form6NewVotersCount,
    required this.form6ApprovedCount,
    required this.form7DeletionsCount,
    required this.form8CorrectionsCount,
    this.lastMeetingDate = "05 Feb 2026",
    this.candidateLiaisonNotes = "",
  });

  BloModel copyWith({
    String? candidateLiaisonNotes,
    String? lastMeetingDate,
  }) {
    return BloModel(
      id: id,
      name: name,
      nameMr: nameMr,
      designation: designation,
      mobile: mobile,
      officePhone: officePhone,
      officeAddress: officeAddress,
      boothRange: boothRange,
      assignedBooths: assignedBooths,
      totalVotersInCharge: totalVotersInCharge,
      form6NewVotersCount: form6NewVotersCount,
      form6ApprovedCount: form6ApprovedCount,
      form7DeletionsCount: form7DeletionsCount,
      form8CorrectionsCount: form8CorrectionsCount,
      lastMeetingDate: lastMeetingDate ?? this.lastMeetingDate,
      candidateLiaisonNotes: candidateLiaisonNotes ?? this.candidateLiaisonNotes,
    );
  }
}
