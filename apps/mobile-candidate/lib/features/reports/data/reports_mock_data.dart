import 'package:flutter/material.dart';
import '../models/report_model.dart';

class ReportsMockData {
  static final List<ReportModel> allReports = [
    // 01: Electorate Demographic Breakdown
    ReportModel(
      number: 1,
      id: "demographic_breakdown",
      title: "Electorate Demographic Breakdown",
      titleMr: "मतदार लोकसंख्या व वयोगट विश्लेषण",
      category: ReportCategory.electorate,
      description: "Comprehensive age-bracket, gender ratio, and generational distribution across Kasba Peth constituency.",
      icon: Icons.people_alt_rounded,
      accentColor: const Color(0xFF1E3A8A),
      keySummary: "Total Electorate: 2,75,420 • Male: 1,38,210 (50.2%) • Female: 1,37,185 (49.8%) • Third Gender: 25",
      tableData: const [
        ReportMetricRow(label: "Youth (18 - 25 yrs)", value: "38,560", percentage: "14.0%", color: Colors.blue),
        ReportMetricRow(label: "Young Adults (26 - 35 yrs)", value: "62,400", percentage: "22.7%", color: Colors.indigo),
        ReportMetricRow(label: "Middle Age (36 - 50 yrs)", value: "84,310", percentage: "30.6%", color: Colors.purple),
        ReportMetricRow(label: "Senior Cadre (51 - 65 yrs)", value: "54,250", percentage: "19.7%", color: Colors.amber),
        ReportMetricRow(label: "Elderly / Super Seniors (65+ yrs)", value: "35,900", percentage: "13.0%", color: Colors.teal),
        ReportMetricRow(label: "Identified First-Time Voters", value: "8,940", percentage: "3.2%", color: Colors.green),
      ],
      strategicInsight: "The 26-50 age segment constitutes over 53% of the active voter base. Targeted digital outreach on civic infrastructure and business ease will drive high conversion here.",
    ),

    // 02: Caste & Community Segmentation Analysis
    ReportModel(
      number: 2,
      id: "caste_community_analysis",
      title: "Caste & Community Segmentation",
      titleMr: "जात व समाज घटक विश्लेषण",
      category: ReportCategory.electorate,
      description: "Aggregated sociocultural profile for community outreach, sammelan planning, and leadership coordination.",
      icon: Icons.groups_rounded,
      accentColor: const Color(0xFF7C3AED),
      keySummary: "Predominantly urban traditional core with strong presence of Maratha, Brahmin, Vyapari, and artisan communities.",
      tableData: const [
        ReportMetricRow(label: "Maratha / Kunbi", value: "88,130", percentage: "32.0%", color: Colors.deepOrange),
        ReportMetricRow(label: "Brahmin Community", value: "66,100", percentage: "24.0%", color: Colors.indigo),
        ReportMetricRow(label: "OBC (Mali, Teli, Shimpi, etc.)", value: "46,820", percentage: "17.0%", color: Colors.amber),
        ReportMetricRow(label: "SC / Nav-Buddhist", value: "33,050", percentage: "12.0%", color: Colors.blue),
        ReportMetricRow(label: "Muslim Community", value: "22,030", percentage: "8.0%", color: Colors.green),
        ReportMetricRow(label: "Jain, Marwadi & Gujarati (Vyapari)", value: "19,290", percentage: "7.0%", color: Colors.teal),
      ],
      strategicInsight: "Brahmin and Vyapari communities are historically high-turnout blocs (>68%). Close liaison with Kasba Ganpati and Shaniwar Wada business trade associations ensures key multiplier endorsements.",
    ),

    // 03: Voter Sentiment Triad
    ReportModel(
      number: 3,
      id: "voter_sentiment_triad",
      title: "Voter Sentiment Triad & Net Lead",
      titleMr: "मतदार कल व अनुकूलता विश्लेषण",
      category: ReportCategory.sentimentAndBooths,
      description: "Verified field sentiment mapped across all 210 booths via continuous doorstep surveys.",
      icon: Icons.pie_chart_rounded,
      accentColor: const Color(0xFF10B981),
      keySummary: "Favorable (Green): 42.0% • Neutral/Swing (Amber): 38.0% • Unfavorable (Red): 20.0%",
      tableData: const [
        ReportMetricRow(label: "Favorable / Core Supporters (Green)", value: "1,15,676", percentage: "42.0%", color: Colors.green),
        ReportMetricRow(label: "Neutral / Persuadable Swing (Amber)", value: "1,04,660", percentage: "38.0%", color: Colors.amber),
        ReportMetricRow(label: "Unfavorable / Rival Leaning (Red)", value: "55,084", percentage: "20.0%", color: Colors.red),
        ReportMetricRow(label: "Net Positive Margin Differential", value: "+60,592", percentage: "+22.0%", color: Colors.teal),
      ],
      strategicInsight: "The election will be won in the 38% Amber cohort. Converting just 15% of neutral voters guarantees an unassailable 25,000+ victory margin.",
    ),

    // 04: Polling Booth Performance & Readiness Matrix
    ReportModel(
      number: 4,
      id: "booth_readiness_matrix",
      title: "Polling Booth Performance & Readiness",
      titleMr: "मतदान केंद्र कामगिरी व सज्जता मॅट्रिक्स",
      category: ReportCategory.sentimentAndBooths,
      description: "Readiness audit across all 210 booths including BLA-2 appointment, voter slip coverage, and local lead scorecards.",
      icon: Icons.how_to_vote_rounded,
      accentColor: const Color(0xFF3B82F6),
      keySummary: "210 Total Booths: 142 Strong (>50% Lead) • 48 Swing/Contested • 20 Critical Attention Required",
      tableData: const [
        ReportMetricRow(label: "A-Grade Secure Fortress Booths", value: "98 Booths", percentage: "46.7%", color: Colors.green),
        ReportMetricRow(label: "B-Grade Favorable Lean Booths", value: "44 Booths", percentage: "21.0%", color: Colors.teal),
        ReportMetricRow(label: "C-Grade Tight Competitive Swing", value: "48 Booths", percentage: "22.8%", color: Colors.amber),
        ReportMetricRow(label: "D-Grade High Priority Intervention", value: "20 Booths", percentage: "9.5%", color: Colors.red),
        ReportMetricRow(label: "BLA-2 Polling Agent Coverage", value: "206 / 210", percentage: "98.1%", color: Colors.blue),
      ],
      strategicInsight: "Focus final 72-hour resources strictly on 20 D-Grade booths located in Bhavani Peth and Mangalwar Peth clusters to prevent rival mobilization.",
    ),

    // 05: Karyakarta Doorstep Survey Velocity
    ReportModel(
      number: 5,
      id: "survey_velocity",
      title: "Karyakarta Doorstep Survey Velocity",
      titleMr: "कार्यकर्ता घरोघरी सर्वेक्षण प्रगती",
      category: ReportCategory.workforce,
      description: "Daily survey throughput, household touch rates, and ground workforce accountability metrics.",
      icon: Icons.directions_walk_rounded,
      accentColor: const Color(0xFFF59E0B),
      keySummary: "1,98,450 Doorstep Visits Completed (72.1% Coverage) • 342 Active Field Workers • Avg 45 visits/worker/day",
      tableData: const [
        ReportMetricRow(label: "Fully Surveyed Households", value: "48,210", percentage: "74.2%", color: Colors.green),
        ReportMetricRow(label: "Locked / Re-visit Scheduled", value: "11,340", percentage: "17.4%", color: Colors.amber),
        ReportMetricRow(label: "Refused / Not Interested", value: "5,450", percentage: "8.4%", color: Colors.red),
        ReportMetricRow(label: "Top Performer: Sachin Shinde", value: "1,240 Surveys", percentage: "100%", color: Colors.purple),
        ReportMetricRow(label: "Avg Time Spent per Household", value: "4.8 mins", percentage: "-", color: Colors.blue),
      ],
      strategicInsight: "Prabhaag 14 & 18 need workforce redeployment. 15 workers from saturated Shaniwar Peth should be shifted to Bhavani Peth for final sweep.",
    ),

    // 06: Voter Slip Distribution Progress
    ReportModel(
      number: 6,
      id: "voter_slip_progress",
      title: "Voter Slip Distribution Progress",
      titleMr: "मतदार पावती वाटप प्रगती अहवाल",
      category: ReportCategory.workforce,
      description: "Real-time audit of printed, dispatched, delivered door-to-door, and WhatsApp delivered voter slips.",
      icon: Icons.badge_rounded,
      accentColor: const Color(0xFF06B6D4),
      keySummary: "1,84,530 / 2,75,420 Slips Handed Over (67.0%) • 45,000 Sent via WhatsApp • 45,890 Pending",
      tableData: const [
        ReportMetricRow(label: "Door-to-Door Physical Delivery", value: "1,39,530", percentage: "50.7%", color: Colors.green),
        ReportMetricRow(label: "WhatsApp Digital Slip Dispatched", value: "45,000", percentage: "16.3%", color: Colors.teal),
        ReportMetricRow(label: "Printed & Ready with Booth Leads", value: "32,400", percentage: "11.8%", color: Colors.amber),
        ReportMetricRow(label: "Pending Verification / Print", value: "58,490", percentage: "21.2%", color: Colors.red),
      ],
      strategicInsight: "Digital slips have a 91% download rate among 18-35 age group. Trigger second WhatsApp blast with Google Maps directions to polling booth.",
    ),

    // 07: Citizen Grievances & Civic Issues Audit
    ReportModel(
      number: 7,
      id: "civic_issues_audit",
      title: "Citizen Grievances & Civic Issues Audit",
      titleMr: "नागरिक तक्रारी व समस्या निवारण अहवाल",
      category: ReportCategory.campaignsAndGovernance,
      description: "Consolidated register of ground issues collected via doorstep surveys, office visits, and mobile app.",
      icon: Icons.receipt_long_rounded,
      accentColor: const Color(0xFFEF4444),
      keySummary: "1,420 Grievances Registered • 980 Resolved (69.0%) • 310 In Progress • 130 Critical Escalations",
      tableData: const [
        ReportMetricRow(label: "Water Supply & Pressure (PMC)", value: "480 Tickets", percentage: "33.8%", color: Colors.blue),
        ReportMetricRow(label: "Roads, Potholes & Peth Traffic", value: "360 Tickets", percentage: "25.4%", color: Colors.amber),
        ReportMetricRow(label: "Drainage & Sewerage Overflow", value: "290 Tickets", percentage: "20.4%", color: Colors.purple),
        ReportMetricRow(label: "Streetlights & CCTV Safety", value: "180 Tickets", percentage: "12.7%", color: Colors.teal),
        ReportMetricRow(label: "Senior Citizen Pension / Aid", value: "110 Tickets", percentage: "7.7%", color: Colors.green),
      ],
      strategicInsight: "Water pressure issues in Kasba Peth Wada clusters are causing voter dissatisfaction. Fast-tracking 25 water-tanker rounds under Candidate Helpdesk will generate immediate goodwill.",
    ),

    // 08: Government Welfare Scheme Penetration
    ReportModel(
      number: 8,
      id: "welfare_scheme_penetration",
      title: "Welfare Scheme Beneficiaries (DBT)",
      titleMr: "शासकीय योजना लाभार्थी व थेट लाभ",
      category: ReportCategory.campaignsAndGovernance,
      description: "Beneficiary database matching state & central government welfare schemes across the constituency.",
      icon: Icons.account_balance_rounded,
      accentColor: const Color(0xFF059669),
      keySummary: "68,400 Registered Beneficiary Voters Identified • 24.8% of Total Electorate directly impacted.",
      tableData: const [
        ReportMetricRow(label: "Mukhyamantri Majhi Ladki Bahin", value: "34,200", percentage: "50.0%", color: Colors.purple),
        ReportMetricRow(label: "PM Ayushman Bharat Card Holders", value: "18,450", percentage: "27.0%", color: Colors.green),
        ReportMetricRow(label: "PM Awas Yojana (Peth Wadas)", value: "6,120", percentage: "8.9%", color: Colors.blue),
        ReportMetricRow(label: "PM SVANidhi (Street Vendors)", value: "5,430", percentage: "7.9%", color: Colors.amber),
        ReportMetricRow(label: "Sanjay Gandhi Niradhar Yojana", value: "4,200", percentage: "6.2%", color: Colors.teal),
      ],
      strategicInsight: "Ladki Bahin beneficiaries represent our strongest loyal female voting bloc. Mobilizing this group early in the morning (7 AM - 11 AM) will set an uncatchable baseline.",
    ),

    // 09: First-Time & Youth Voters Register
    ReportModel(
      number: 9,
      id: "youth_voter_register",
      title: "First-Time & Youth Voters Register",
      titleMr: "नवमतदार व तरुण मतदार नोंदणी",
      category: ReportCategory.electorate,
      description: "Dedicated profile of Gen-Z and first-time voters aged 18-21 registered under Form 6.",
      icon: Icons.school_rounded,
      accentColor: const Color(0xFF8B5CF6),
      keySummary: "8,940 First-Time Voters (18-21) • 84% Smart Phone Active • High Concentration near SP College & Fergusson Road",
      tableData: const [
        ReportMetricRow(label: "College / University Students", value: "5,420", percentage: "60.6%", color: Colors.indigo),
        ReportMetricRow(label: "Young Tech / BPO Professionals", value: "2,310", percentage: "25.8%", color: Colors.blue),
        ReportMetricRow(label: "Family Business Apprentices", value: "1,210", percentage: "13.6%", color: Colors.amber),
        ReportMetricRow(label: "Attended Youth Conclave Event", value: "3,400", percentage: "38.0%", color: Colors.green),
      ],
      strategicInsight: "Youth voters respond strongly to Instagram Reels and startup/skill development manifestos rather than traditional banner ads.",
    ),

    // 10: Household & Family Tree Consolidation
    ReportModel(
      number: 10,
      id: "household_consolidation",
      title: "Household & Family Tree Consolidation",
      titleMr: "कुटुंब वृक्ष व घरनिहाय एकत्रीकरण",
      category: ReportCategory.electorate,
      description: "Clustering individual voters into consolidated family units to enable single-touchpoint family voting influence.",
      icon: Icons.home_work_rounded,
      accentColor: const Color(0xFF0284C7),
      keySummary: "64,980 Unique Households • Average 4.24 Voters per Household • 12,400 Joint Families (5+ Voters)",
      tableData: const [
        ReportMetricRow(label: "Large Joint Families (5+ Voters)", value: "12,400 Houses", percentage: "38.5% votes", color: Colors.indigo),
        ReportMetricRow(label: "Medium Nuclear Families (3-4 Voters)", value: "28,300 Houses", percentage: "41.2% votes", color: Colors.blue),
        ReportMetricRow(label: "Small Families (2 Voters)", value: "16,100 Houses", percentage: "14.6% votes", color: Colors.teal),
        ReportMetricRow(label: "Single Voter / Bachelor Households", value: "8,180 Houses", percentage: "5.7% votes", color: Colors.amber),
      ],
      strategicInsight: "Winning the Head of Household in the 12,400 large joint families secures 62,000+ votes in a single strike. Prioritize personal candidate letters to these family heads.",
    ),

    // 11: Multi-Channel Campaign Broadcast Delivery
    ReportModel(
      number: 11,
      id: "campaign_broadcast_delivery",
      title: "Multi-Channel Broadcast Analytics",
      titleMr: "प्रचार संदेश वहन व वाचन अहवाल",
      category: ReportCategory.campaignsAndGovernance,
      description: "Aggregated performance of WhatsApp blasts, Bulk SMS, and AI IVR interactive voice calls.",
      icon: Icons.cell_tower_rounded,
      accentColor: const Color(0xFF10B981),
      keySummary: "Total Outbound Dispatches: 2,65,000 • Delivered: 2,49,100 (94.0%) • Read / Listened: 1,82,400 (68.8%)",
      tableData: const [
        ReportMetricRow(label: "Official WhatsApp Broadcasts", value: "85,000 sent", percentage: "91% read rate", color: Colors.green),
        ReportMetricRow(label: "Carrier Bulk SMS Messages", value: "1,20,000 sent", percentage: "96% delivered", color: Colors.blue),
        ReportMetricRow(label: "AI Candidate Voice Calls (IVR)", value: "60,000 calls", percentage: "62% completed", color: Colors.purple),
        ReportMetricRow(label: "Inbound Callbacks / Enquiries", value: "3,420 calls", percentage: "1.3% response", color: Colors.amber),
      ],
      strategicInsight: "AI Voice messages recorded in the candidate's authentic voice achieved 62% full listen-through, creating high emotional resonance before rallies.",
    ),

    // 12: Ground Update Requests & Roll Mutations
    ReportModel(
      number: 12,
      id: "voter_roll_mutations",
      title: "Ground Update Requests & Roll Mutations",
      titleMr: "मतदार यादी फेरफार व दुरुस्ती अहवाल",
      category: ReportCategory.workforce,
      description: "Status of ground updates submitted by Karyakartas for deceased, shifted, or unlisted voters.",
      icon: Icons.published_with_changes_rounded,
      accentColor: const Color(0xFFD97706),
      keySummary: "3,890 Ground Flags Submitted • 3,240 Verified & Approved (83.3%) • 450 Pending BLO Form Submission",
      tableData: const [
        ReportMetricRow(label: "Reported Deceased (Form 7 target)", value: "1,420 voters", percentage: "36.5%", color: Colors.red),
        ReportMetricRow(label: "Relocated / Shifted Out of Area", value: "1,280 voters", percentage: "32.9%", color: Colors.amber),
        ReportMetricRow(label: "Phone / Address Corrections", value: "890 voters", percentage: "22.9%", color: Colors.blue),
        ReportMetricRow(label: "New Voters Enrolled (Form 6)", value: "300 voters", percentage: "7.7%", color: Colors.green),
      ],
      strategicInsight: "Identifying 1,420 deceased names prevents fake voting on polling day. Ensure our BLA-2 agents carry the verified marked copy at every polling station table.",
    ),

    // 13: Key Opinion Leaders (KOLs) Directory
    ReportModel(
      number: 13,
      id: "key_opinion_leaders",
      title: "Key Opinion Leaders (KOLs) & Influencers",
      titleMr: "स्थानिक प्रभाव गट व प्रतिष्ठित नागरिक",
      category: ReportCategory.sentimentAndBooths,
      description: "Mapping of influential society chairmen, mandal presidents, trade body leaders, and religious trustees.",
      icon: Icons.star_rate_rounded,
      accentColor: const Color(0xFFEC4899),
      keySummary: "480 Key Opinion Leaders Mapped • 340 Favorably Aligned • Influence on est. 85,000 voters",
      tableData: const [
        ReportMetricRow(label: "Ganesh Mandal & Utsav Committee Heads", value: "142 Leads", percentage: "82% Favorable", color: Colors.deepOrange),
        ReportMetricRow(label: "Housing Society / Wada Chairmen", value: "165 Leads", percentage: "74% Favorable", color: Colors.blue),
        ReportMetricRow(label: "Vyapari Mandal & Trade Guild Heads", value: "88 Leads", percentage: "69% Favorable", color: Colors.amber),
        ReportMetricRow(label: "Senior Doctors, Lawyers & CA Guild", value: "85 Leads", percentage: "78% Favorable", color: Colors.teal),
      ],
      strategicInsight: "A personal dinner meeting with the 88 Vyapari Mandal heads will solidify market trust across Raviwar Peth and Budhwar Peth commercial strips.",
    ),

    // 14: Projected Voter Turnout & Margin Simulation
    ReportModel(
      number: 14,
      id: "turnout_margin_simulation",
      title: "Projected Turnout & Margin Simulation",
      titleMr: "संभाव्य मतदान टक्केवारी व मताधिक्य अंदाज",
      category: ReportCategory.sentimentAndBooths,
      description: "Predictive scenario modeling simulating vote share and lead margins at 55%, 62%, and 70% voter turnout levels.",
      icon: Icons.query_stats_rounded,
      accentColor: const Color(0xFF1E3A8A),
      keySummary: "Baseline Expected Turnout: 63.4% • Projected Candidate Vote Share: 52.8% • Estimated Winning Lead: +18,400 to +24,200 votes",
      tableData: const [
        ReportMetricRow(label: "Low Turnout Scenario (55% / 1,51,480)", value: "Candidate Lead: +14,200", percentage: "51.8% Share", color: Colors.amber),
        ReportMetricRow(label: "Moderate Baseline Scenario (63% / 1,73,500)", value: "Candidate Lead: +21,800", percentage: "53.2% Share", color: Colors.green),
        ReportMetricRow(label: "High Wave Turnout Scenario (70% / 1,92,790)", value: "Candidate Lead: +28,500", percentage: "54.4% Share", color: Colors.teal),
        ReportMetricRow(label: "Minimum Winning Threshold", value: "86,750 votes", percentage: "50.1%", color: Colors.indigo),
      ],
      strategicInsight: "Higher turnout directly expands our lead because the majority of uncommitted voters (Amber) break in favor of our development and welfare agenda. Early voter mobilization is crucial.",
    ),
  ];
}
