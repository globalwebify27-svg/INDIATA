enum KaryakartaStatus {
  onDuty,   // Active in field with live GPS heartbeat
  offDuty,  // Offline or resting
  inactive, // Inactive alert (>48h without activity)
}

enum KaryakartaRole {
  boothPresident,
  fieldSurveyor,
  prabhaagIncharge,
  youthWingLeader,
  womenWingLeader,
  volunteer,
}

class KaryakartaModel {
  final String id;
  final String name;
  final String nameMr;
  final String mobile;
  final String email;
  final KaryakartaRole role;
  final KaryakartaStatus status;
  final int assignedBooth;
  final int assignedPrabhaag;
  final int targetSurveys;
  final int completedSurveys;
  final int todaySurveys;
  final int distributedSlips;
  final int totalSlips;
  final String lastActiveLocation;
  final String lastActiveTime;
  final double? latitude;
  final double? longitude;
  final bool isAlertInactive;

  const KaryakartaModel({
    required this.id,
    required this.name,
    required this.nameMr,
    required this.mobile,
    this.email = "",
    required this.role,
    required this.status,
    required this.assignedBooth,
    this.assignedPrabhaag = 14,
    required this.targetSurveys,
    required this.completedSurveys,
    required this.todaySurveys,
    required this.distributedSlips,
    required this.totalSlips,
    required this.lastActiveLocation,
    required this.lastActiveTime,
    this.latitude,
    this.longitude,
    this.isAlertInactive = false,
  });

  double get surveyProgressPct =>
      targetSurveys > 0 ? (completedSurveys / targetSurveys) * 100 : 0.0;
  double get slipProgressPct =>
      totalSlips > 0 ? (distributedSlips / totalSlips) * 100 : 0.0;

  String get roleLabel {
    switch (role) {
      case KaryakartaRole.boothPresident:
        return "Booth President";
      case KaryakartaRole.fieldSurveyor:
        return "Doorstep Surveyor";
      case KaryakartaRole.prabhaagIncharge:
        return "Prabhaag Incharge";
      case KaryakartaRole.youthWingLeader:
        return "Youth Wing Lead";
      case KaryakartaRole.womenWingLeader:
        return "Mahila Aghadi Lead";
      case KaryakartaRole.volunteer:
        return "Ground Volunteer";
    }
  }

  KaryakartaModel copyWith({
    KaryakartaStatus? status,
    int? completedSurveys,
    int? todaySurveys,
    int? distributedSlips,
    String? lastActiveLocation,
    String? lastActiveTime,
    bool? isAlertInactive,
  }) {
    return KaryakartaModel(
      id: id,
      name: name,
      nameMr: nameMr,
      mobile: mobile,
      email: email,
      role: role,
      status: status ?? this.status,
      assignedBooth: assignedBooth,
      assignedPrabhaag: assignedPrabhaag,
      targetSurveys: targetSurveys,
      completedSurveys: completedSurveys ?? this.completedSurveys,
      todaySurveys: todaySurveys ?? this.todaySurveys,
      distributedSlips: distributedSlips ?? this.distributedSlips,
      totalSlips: totalSlips,
      lastActiveLocation: lastActiveLocation ?? this.lastActiveLocation,
      lastActiveTime: lastActiveTime ?? this.lastActiveTime,
      latitude: latitude,
      longitude: longitude,
      isAlertInactive: isAlertInactive ?? this.isAlertInactive,
    );
  }
}
