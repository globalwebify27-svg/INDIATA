import 'package:flutter/material.dart';

class KaryakartaAppConfig {
  String themeColorHex;
  String campaignHeaderTitle;
  String dailyMissionNotice;
  bool enableDoorstepSurveys;
  bool enableVoterSlips;
  bool enableGpsVerification;
  bool enablePublicIssues;
  bool enableDeceasedVoterFlagging;
  bool enableOfflineCaching;

  KaryakartaAppConfig({
    this.themeColorHex = "#0F2744", // Executive Navy
    this.campaignHeaderTitle = "Adv. Vikram Patil Official Campaign",
    this.dailyMissionNotice = "Kasba Peth Vijay Sankalp 2024: Focus on morning wada surveys between 7 AM and 11 AM!",
    this.enableDoorstepSurveys = true,
    this.enableVoterSlips = true,
    this.enableGpsVerification = true,
    this.enablePublicIssues = true,
    this.enableDeceasedVoterFlagging = true,
    this.enableOfflineCaching = true,
  });

  Color get themeColor {
    final hex = themeColorHex.replaceAll("#", "");
    return Color(int.parse("FF$hex", radix: 16));
  }
}
