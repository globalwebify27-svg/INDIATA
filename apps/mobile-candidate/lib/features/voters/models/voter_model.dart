enum VoterSentiment {
  favorable, // Supporter (Green)
  swing,      // Neutral / Persuadable (Amber)
  opposition, // Opponent (Rose)
  unclassified,
}

enum VoterGender {
  male,
  female,
  other,
}

class FamilyMember {
  final String id;
  final String name;
  final String nameMr;
  final String relation;
  final int age;
  final VoterGender gender;
  final VoterSentiment sentiment;
  final bool isHead;
  final String epic;

  const FamilyMember({
    required this.id,
    required this.name,
    required this.nameMr,
    required this.relation,
    required this.age,
    required this.gender,
    required this.sentiment,
    this.isHead = false,
    required this.epic,
  });
}

class WelfareSchemeItem {
  final String schemeName;
  final String schemeNameMr;
  final String status;
  final String benefitDetails;

  const WelfareSchemeItem({
    required this.schemeName,
    required this.schemeNameMr,
    required this.status,
    required this.benefitDetails,
  });
}

class CivicGrievanceItem {
  final String ticketId;
  final String title;
  final String category;
  final String priority;
  final String status;
  final String reportedDate;

  const CivicGrievanceItem({
    required this.ticketId,
    required this.title,
    required this.category,
    required this.priority,
    required this.status,
    required this.reportedDate,
  });
}

class CampaignOutreachItem {
  final String channel; // WhatsApp, SMS, AI Voice, Doorstep
  final String title;
  final String date;
  final String status;

  const CampaignOutreachItem({
    required this.channel,
    required this.title,
    required this.date,
    required this.status,
  });
}

class VoterModel {
  // 1. Personal Identification
  final String id;
  final String epic;
  final String serialNumber;
  final int boothNumber;
  final String constituency;
  final String name;
  final String nameMr;

  // 2. Demographic Profile
  final int age;
  final VoterGender gender;
  final String dob;
  final String guardianName;
  final String guardianRelation;

  // 3. Contact Details
  final String mobile;
  final String whatsapp;
  final String alternatePhone;
  final String email;
  final bool isPhoneVerified;

  // 4. Residence & Locus
  final String houseNumber;
  final String buildingOrChawl;
  final String street;
  final String area;
  final String landmark;
  final String pincode;

  // 5. Sociological & Community
  final String communityGroup; // Maratha, Brahmin, OBC, SC, ST, Minority
  final String subCaste;
  final String primaryLanguage;

  // 6. Political Alignment & Stance
  final VoterSentiment sentiment;
  final String historicalTrend;
  final int votingLikelihoodPct;
  final bool isKeyInfluencer;

  // 7. Family Hierarchy
  final String familyId;
  final bool isHeadOfFamily;
  final List<FamilyMember> familyMembers;

  // 8. Doorstep Survey History
  final bool isSurveyed;
  final String? surveyDate;
  final String? surveyorKaryakarta;
  final String? surveyorContact;
  final String? surveyGpsCoordinates;
  final String? surveyorNotes;

  // 9. Government Welfare Schemes
  final List<WelfareSchemeItem> welfareSchemes;

  // 10. Civic Grievances
  final List<CivicGrievanceItem> grievances;

  // 11. Campaign Outreach Ledger
  final List<CampaignOutreachItem> outreachHistory;

  // 12. Voter Slip Status
  final bool isSlipGenerated;
  final bool isSlipDistributed;
  final String? slipDistributedAt;
  final String? slipDistributedBy;

  // 13. Candidate Private Notes & Tags
  final String strategyNotes;
  final List<String> tags;

  const VoterModel({
    required this.id,
    required this.epic,
    required this.serialNumber,
    required this.boothNumber,
    this.constituency = "215 - Kasba Peth",
    required this.name,
    required this.nameMr,
    required this.age,
    required this.gender,
    this.dob = "12/04/1978",
    required this.guardianName,
    this.guardianRelation = "Father",
    required this.mobile,
    required this.whatsapp,
    this.alternatePhone = "",
    this.email = "",
    this.isPhoneVerified = true,
    required this.houseNumber,
    required this.buildingOrChawl,
    required this.street,
    required this.area,
    required this.landmark,
    this.pincode = "411011",
    required this.communityGroup,
    required this.subCaste,
    this.primaryLanguage = "Marathi",
    required this.sentiment,
    this.historicalTrend = "Consistent Lok Sabha & Vidhan Sabha voter",
    this.votingLikelihoodPct = 95,
    this.isKeyInfluencer = false,
    required this.familyId,
    this.isHeadOfFamily = false,
    this.familyMembers = const [],
    required this.isSurveyed,
    this.surveyDate,
    this.surveyorKaryakarta,
    this.surveyorContact,
    this.surveyGpsCoordinates,
    this.surveyorNotes,
    this.welfareSchemes = const [],
    this.grievances = const [],
    this.outreachHistory = const [],
    this.isSlipGenerated = true,
    this.isSlipDistributed = false,
    this.slipDistributedAt,
    this.slipDistributedBy,
    this.strategyNotes = "",
    this.tags = const [],
  });

  VoterModel copyWith({
    VoterSentiment? sentiment,
    bool? isSlipDistributed,
    String? slipDistributedAt,
    String? strategyNotes,
    List<String>? tags,
  }) {
    return VoterModel(
      id: id,
      epic: epic,
      serialNumber: serialNumber,
      boothNumber: boothNumber,
      constituency: constituency,
      name: name,
      nameMr: nameMr,
      age: age,
      gender: gender,
      dob: dob,
      guardianName: guardianName,
      guardianRelation: guardianRelation,
      mobile: mobile,
      whatsapp: whatsapp,
      alternatePhone: alternatePhone,
      email: email,
      isPhoneVerified: isPhoneVerified,
      houseNumber: houseNumber,
      buildingOrChawl: buildingOrChawl,
      street: street,
      area: area,
      landmark: landmark,
      pincode: pincode,
      communityGroup: communityGroup,
      subCaste: subCaste,
      primaryLanguage: primaryLanguage,
      sentiment: sentiment ?? this.sentiment,
      historicalTrend: historicalTrend,
      votingLikelihoodPct: votingLikelihoodPct,
      isKeyInfluencer: isKeyInfluencer,
      familyId: familyId,
      isHeadOfFamily: isHeadOfFamily,
      familyMembers: familyMembers,
      isSurveyed: isSurveyed,
      surveyDate: surveyDate,
      surveyorKaryakarta: surveyorKaryakarta,
      surveyorContact: surveyorContact,
      surveyGpsCoordinates: surveyGpsCoordinates,
      surveyorNotes: surveyorNotes,
      welfareSchemes: welfareSchemes,
      grievances: grievances,
      outreachHistory: outreachHistory,
      isSlipGenerated: isSlipGenerated,
      isSlipDistributed: isSlipDistributed ?? this.isSlipDistributed,
      slipDistributedAt: slipDistributedAt ?? this.slipDistributedAt,
      slipDistributedBy: slipDistributedBy,
      strategyNotes: strategyNotes ?? this.strategyNotes,
      tags: tags ?? this.tags,
    );
  }
}
