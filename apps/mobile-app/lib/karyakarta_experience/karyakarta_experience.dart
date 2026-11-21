import 'package:flutter/material.dart';

// ==============================================================================
// THEME COLOR HELPER (SUPPORTS BOTH OBSIDIAN DARK & CRISP DAYLIGHT LIGHT MODES)
// ==============================================================================
class AppThemeColors {
  final bool isDark;
  const AppThemeColors(this.isDark);

  Color get scaffoldBg => isDark ? const Color(0xFF010627) : const Color(0xFFF8FAFC);
  Color get cardBg => isDark ? const Color(0xFF0B1527) : Colors.white;
  Color get surfaceBg => isDark ? const Color(0xFF020817) : const Color(0xFFF1F5F9);
  Color get borderColor => isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);
  Color get textPrimary => isDark ? Colors.white : const Color(0xFF0F172A);
  Color get textSecondary => isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
  Color get primary => const Color(0xFF2087FE); // Candidate Electric Royal Blue
  Color get green => isDark ? const Color(0xFF10B981) : const Color(0xFF059669);
  Color get amber => isDark ? const Color(0xFFF59E0B) : const Color(0xFFD97706);
  Color get red => isDark ? const Color(0xFFEF4444) : const Color(0xFFDC2626);
  Color get purple => isDark ? const Color(0xFFA855F7) : const Color(0xFF9333EA);
  Color get cyan => isDark ? const Color(0xFF06B6D4) : const Color(0xFF0891B2);
}

// ==============================================================================
// ROOT APPLICATION WITH DYNAMIC LIGHT / DARK THEME MANAGEMENT
// ==============================================================================
class IndiataKaryakartaApp extends StatefulWidget {
  const IndiataKaryakartaApp({super.key});

  @override
  State<IndiataKaryakartaApp> createState() => _IndiataKaryakartaAppState();
}

class _IndiataKaryakartaAppState extends State<IndiataKaryakartaApp> {
  ThemeMode _themeMode = ThemeMode.light;

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  void _setTheme(ThemeMode mode) {
    setState(() {
      _themeMode = mode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'INDIATA Karyakarta',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        cardColor: Colors.white,
        dividerColor: const Color(0xFFE2E8F0),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF2087FE),
          secondary: Color(0xFF059669),
          surface: Colors.white,
          onSurface: Color(0xFF0F172A),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF010627),
        cardColor: const Color(0xFF0B1527),
        dividerColor: const Color(0xFF1E293B),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF2087FE),
          secondary: Color(0xFF12CF94),
          surface: Color(0xFF0B1527),
          onSurface: Colors.white,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0B1527),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: MainMobileScaffold(
        themeMode: _themeMode,
        onToggleTheme: _toggleTheme,
        onSetTheme: _setTheme,
      ),
    );
  }
}

// ==============================================================================
// DATA MODELS
// ==============================================================================
class VoterItem {
  final String id;
  final String name;
  final String marathiName;
  final String epicId;
  final int age;
  final String gender;
  final String houseNo;
  final String boothNo;
  final String phone;
  final String serialNo;
  final String communityGroup;
  String classification; // Supporter, Doubtful, Opponent, Neutral
  bool isVisited;
  bool isImportant;
  final String caste;
  final String scheme;
  String surveyFeedback;
  String surveyTimestamp;
  bool hasVoted;
  String? votedAt;
  String? votedBy;
  List<Map<String, String>> votingAuditTrail;

  VoterItem({
    required this.id,
    required this.name,
    required this.marathiName,
    required this.epicId,
    required this.age,
    required this.gender,
    required this.houseNo,
    required this.boothNo,
    required this.phone,
    this.serialNo = "101",
    this.communityGroup = "Village Community",
    this.classification = "Neutral",
    this.isVisited = false,
    this.isImportant = false,
    this.caste = "Maratha",
    this.scheme = "Ladki Bahin Yojana",
    this.surveyFeedback = "",
    this.surveyTimestamp = "",
    this.hasVoted = false,
    this.votedAt,
    this.votedBy,
    List<Map<String, String>>? votingAuditTrail,
  }) : votingAuditTrail = votingAuditTrail ?? [];
}

class IssueItem {
  final String id;
  final String title;
  final String citizenName;
  final String category;
  final String priority; // High, Medium, Low
  String status; // Open, In Progress, Resolved
  final String boothNo;
  final String date;
  final bool audioRecorded;

  IssueItem({
    required this.id,
    required this.title,
    required this.citizenName,
    required this.category,
    required this.priority,
    required this.status,
    required this.boothNo,
    required this.date,
    this.audioRecorded = false,
  });
}

class BoothItem {
  final String boothNo;
  final String name;
  final int totalVoters;
  final String bloName;
  final String bloPhone;
  final String address;

  BoothItem({
    required this.boothNo,
    required this.name,
    required this.totalVoters,
    required this.bloName,
    required this.bloPhone,
    required this.address,
  });
}

class SlipHistoryItem {
  final String voterName;
  final String marathiName;
  final String boothNo;
  final String epicId;
  final String timestamp;
  final String mode; // Thermal Printed, WhatsApp Digital
  final String serialNo;
  final String status; // Delivered, Printed, Pending, Failed

  SlipHistoryItem({
    required this.voterName,
    required this.marathiName,
    required this.boothNo,
    required this.epicId,
    required this.timestamp,
    required this.mode,
    required this.serialNo,
    this.status = "Delivered",
  });
}

class ActivityItem {
  final String title;
  final String target;
  final String timestamp;
  final String status;
  final String details;
  final IconData icon;

  ActivityItem({
    required this.title,
    required this.target,
    required this.timestamp,
    required this.status,
    required this.details,
    required this.icon,
  });
}

// ==============================================================================
// MASTER NAVIGATION SCAFFOLD (DRAWER + QUICK ACTIONS + BOTTOM TABS)
// ==============================================================================
class MainMobileScaffold extends StatefulWidget {
  final ThemeMode themeMode;
  final VoidCallback onToggleTheme;
  final Function(ThemeMode) onSetTheme;
  final VoidCallback? onSignOut;

  const MainMobileScaffold({
    super.key,
    required this.themeMode,
    required this.onToggleTheme,
    required this.onSetTheme,
    this.onSignOut,
  });

  @override
  State<MainMobileScaffold> createState() => _MainMobileScaffoldState();
}

class _MainMobileScaffoldState extends State<MainMobileScaffold> {
  // Navigation & View Routing State
  String _currentView = "dashboard";
  int _currentTab = 0; // 0=Dashboard, 1=Voters, 2=Slips, 3=Copilot
  bool _isAiEnabled = true; // Admin Gated per Karyakarta

  // Hardware Activation & Testing States
  bool _isActivated = true;
  bool _isOnline = true;
  String _qaState = "active"; // "active", "pending", "blocked"
  String _language = "MR"; // "MR", "EN", "HI"
  String _activeKpiFilter = "all";

  // Data Collections
  late List<VoterItem> _voters;
  late List<IssueItem> _issues;
  late List<BoothItem> _booths;
  late List<SlipHistoryItem> _slipHistory;
  late List<ActivityItem> _activities;

  // Advanced Filters State
  String _filterBooth = "All";
  String _filterAgeGroup = "All";
  String _filterGender = "All";
  String _filterSentiment = "All";
  String _filterContact = "All";
  String _filterVisited = "All";
  String _filterCommunity = "All";
  String _filterScheme = "All";
  String _filterSerial = "";

  @override
  void initState() {
    super.initState();
    _initMockData();
  }

  void _initMockData() {
    _voters = [
      VoterItem(
        id: "v-01",
        name: "Rajesh Vithal Patil",
        marathiName: "राजेश विठ्ठल पाटील",
        epicId: "MH/04/101/00234",
        age: 48,
        gender: "M",
        houseNo: "142",
        boothNo: "101",
        serialNo: "101",
        phone: "+91 98221 11221",
        classification: "Neutral",
        isVisited: true,
        isImportant: true,
        caste: "Maratha",
        scheme: "PM Awas Yojana",
        communityGroup: "Local Organisations",
      ),
      VoterItem(
        id: "v-02",
        name: "Sunita Rajesh Patil",
        marathiName: "सुनिता राजेश पाटील",
        epicId: "MH/04/101/00235",
        age: 44,
        gender: "F",
        houseNo: "142",
        boothNo: "101",
        serialNo: "102",
        phone: "+91 98221 11222",
        classification: "Neutral",
        isVisited: true,
        caste: "Maratha",
        scheme: "Ladki Bahin Yojana",
        communityGroup: "Self-Help Groups",
      ),
      VoterItem(
        id: "v-03",
        name: "Amit Rajesh Patil",
        marathiName: "अमित राजेश पाटील",
        epicId: "MH/04/101/00236",
        age: 22,
        gender: "M",
        houseNo: "142",
        boothNo: "101",
        serialNo: "103",
        phone: "+91 98221 11223",
        classification: "Neutral",
        isVisited: false,
        caste: "Maratha",
        scheme: "Youth Skill Voucher",
        communityGroup: "Village Community",
      ),
      VoterItem(
        id: "v-04",
        name: "Ganesh Anant Kulkarni",
        marathiName: "गणेश अनंत कुलकर्णी",
        epicId: "MH/04/101/00237",
        age: 62,
        gender: "M",
        houseNo: "145",
        boothNo: "101",
        serialNo: "104",
        phone: "+91 98221 11224",
        classification: "Neutral",
        isVisited: true,
        isImportant: true,
        caste: "Brahmin",
        scheme: "Sanjay Gandhi Niradhar",
        communityGroup: "Village Community",
      ),
      VoterItem(
        id: "v-05",
        name: "Pooja Santosh Shinde",
        marathiName: "पूजा संतोष शिंदे",
        epicId: "MH/04/102/00118",
        age: 29,
        gender: "F",
        houseNo: "88-B",
        boothNo: "102",
        serialNo: "105",
        phone: "+91 98221 11225",
        classification: "Neutral",
        isVisited: false,
        caste: "Maratha",
        scheme: "Ladki Bahin Yojana",
        communityGroup: "Self-Help Groups",
      ),
      VoterItem(
        id: "v-06",
        name: "Vikram R. Deshmukh",
        marathiName: "विक्रम आर. देशमुख",
        epicId: "MH/04/102/00119",
        age: 51,
        gender: "M",
        houseNo: "90",
        boothNo: "102",
        serialNo: "106",
        phone: "+91 98221 11226",
        classification: "Neutral",
        isVisited: true,
        caste: "Maratha",
        scheme: "Kisan Samman",
        communityGroup: "Local Organisations",
      ),
      VoterItem(
        id: "v-07",
        name: "Smita Vikram Deshmukh",
        marathiName: "स्मिता विक्रम देशमुख",
        epicId: "MH/04/102/00120",
        age: 46,
        gender: "F",
        houseNo: "90",
        boothNo: "102",
        serialNo: "107",
        phone: "+91 98221 11227",
        classification: "Neutral",
        isVisited: true,
        caste: "Maratha",
        scheme: "None",
        communityGroup: "Self-Help Groups",
      ),
      VoterItem(
        id: "v-08",
        name: "Salim Ismail Shaikh",
        marathiName: "सलीम इस्माईल शेख",
        epicId: "MH/04/103/00341",
        age: 38,
        gender: "M",
        houseNo: "12/A",
        boothNo: "103",
        serialNo: "108",
        phone: "+91 98221 11228",
        classification: "Neutral",
        isVisited: true,
        caste: "Muslim",
        scheme: "PMAY",
        communityGroup: "Local Organisations",
      ),
    ];

    _issues = [
      IssueItem(
        id: "ISS-01",
        title: "Low Water Pressure in Lane 4",
        citizenName: "Rajesh V. Patil",
        category: "Water Supply",
        priority: "High",
        status: "Open",
        boothNo: "101",
        date: "09 Feb 2026",
        audioRecorded: true,
      ),
      IssueItem(
        id: "ISS-02",
        title: "Road Potholes near Community Hall",
        citizenName: "Pooja S. Shinde",
        category: "Road Infrastructure",
        priority: "Medium",
        status: "Open",
        boothNo: "102",
        date: "08 Feb 2026",
      ),
      IssueItem(
        id: "ISS-03",
        title: "Street Light Fault at Shaniwar Chowk",
        citizenName: "Ganesh Kulkarni",
        category: "Electricity",
        priority: "Low",
        status: "Resolved",
        boothNo: "101",
        date: "05 Feb 2026",
      ),
    ];

    _booths = [
      BoothItem(
        boothNo: "101",
        name: "Shaniwar Peth Central School, Room #1",
        totalVoters: 1240,
        bloName: "Shri. Ramesh Gaikwad",
        bloPhone: "+91 98221 55661",
        address: "Near Shaniwar Wada Gate, Kasba Peth, Pune",
      ),
      BoothItem(
        boothNo: "102",
        name: "Municipal Boys School, Ground Floor",
        totalVoters: 1180,
        bloName: "Smt. Shaila More",
        bloPhone: "+91 98221 55662",
        address: "Raviwar Peth Chowk, Pune",
      ),
      BoothItem(
        boothNo: "103",
        name: "Dr. B. R. Ambedkar Community Bhavan",
        totalVoters: 940,
        bloName: "Shri. Sachin Jadhav",
        bloPhone: "+91 98221 55663",
        address: "Kasba Central Ward Office, Pune",
      ),
    ];

    _slipHistory = [
      SlipHistoryItem(
        voterName: "Rajesh Vithal Patil",
        marathiName: "राजेश विठ्ठल पाटील",
        boothNo: "101",
        epicId: "MH/04/101/00234",
        timestamp: "Today, 10:45 AM",
        mode: "Thermal Printed (58mm)",
        serialNo: "042",
        status: "Printed",
      ),
      SlipHistoryItem(
        voterName: "Sunita Rajesh Patil",
        marathiName: "सुनिता राजेश पाटील",
        boothNo: "101",
        epicId: "MH/04/101/00235",
        timestamp: "Today, 10:47 AM",
        mode: "WhatsApp Digital",
        serialNo: "043",
        status: "Delivered",
      ),
      SlipHistoryItem(
        voterName: "Ganesh Anant Kulkarni",
        marathiName: "गणेश अनंत कुलकर्णी",
        boothNo: "101",
        epicId: "MH/04/101/00237",
        timestamp: "Yesterday, 04:12 PM",
        mode: "Thermal Printed (58mm)",
        serialNo: "038",
        status: "Printed",
      ),
      SlipHistoryItem(
        voterName: "Pooja Santosh Shinde",
        marathiName: "पूजा संतोष शिंदे",
        boothNo: "102",
        epicId: "MH/04/102/00118",
        timestamp: "Yesterday, 02:30 PM",
        mode: "WhatsApp Digital",
        serialNo: "105",
        status: "Delivered",
      ),
      SlipHistoryItem(
        voterName: "Vikram R. Deshmukh",
        marathiName: "विक्रम आर. देशमुख",
        boothNo: "102",
        epicId: "MH/04/102/00119",
        timestamp: "07 Feb 2026, 11:15 AM",
        mode: "WhatsApp Digital",
        serialNo: "106",
        status: "Pending",
      ),
    ];

    _activities = [
      ActivityItem(
        title: "Doorstep Survey Completed",
        target: "Sunita Rajesh Patil (MH/04/101/00235)",
        timestamp: "08 Feb 2026, 11:30 AM",
        status: "SUCCESS",
        details: "Marked as Supporter, enrolled in Ladki Bahin tracking.",
        icon: Icons.check_circle_outline,
      ),
      ActivityItem(
        title: "Thermal Voter Slip Printed",
        target: "Rajesh Vithal Patil (Booth #101)",
        timestamp: "08 Feb 2026, 11:35 AM",
        status: "SUCCESS",
        details: "Physical thermal chit issued via TP-5801 printer.",
        icon: Icons.print,
      ),
      ActivityItem(
        title: "Citizen Grievance Logged",
        target: "Low Water Pressure in Lane 4",
        timestamp: "08 Feb 2026, 11:48 AM",
        status: "OPEN",
        details: "Audio voice note attached, routed to War Room.",
        icon: Icons.report_problem,
      ),
    ];
  }

  // Filtered Voters Helper
  List<VoterItem> get filteredVoters {
    var list = _voters;

    // Filter by KPI
    if (_activeKpiFilter == "supporters") {
      list = list.where((v) => v.classification == "Supporter").toList();
    } else if (_activeKpiFilter == "doubtful") {
      list = list.where((v) => v.classification == "Doubtful").toList();
    } else if (_activeKpiFilter == "opponents") {
      list = list.where((v) => v.classification == "Opponent").toList();
    } else if (_activeKpiFilter == "neutral") {
      list = list.where((v) => v.classification == "Neutral").toList();
    } else if (_activeKpiFilter == "visited") {
      list = list.where((v) => v.isVisited).toList();
    } else if (_activeKpiFilter == "unvisited") {
      list = list.where((v) => !v.isVisited).toList();
    } else if (_activeKpiFilter == "important") {
      list = list.where((v) => v.isImportant).toList();
    } else if (_activeKpiFilter == "mobile_has") {
      list = list.where((v) => v.phone.isNotEmpty).toList();
    } else if (_activeKpiFilter.startsWith("caste_")) {
      final c = _activeKpiFilter.replaceFirst("caste_", "").toLowerCase();
      list = list.where((v) => v.caste.toLowerCase().contains(c)).toList();
    } else if (_activeKpiFilter.startsWith("comm_")) {
      final g = _activeKpiFilter.replaceFirst("comm_", "");
      list = list.where((v) => v.communityGroup == g).toList();
    }

    // Advanced Filters
    if (_filterBooth != "All") {
      list = list.where((v) => v.boothNo == _filterBooth).toList();
    }
    if (_filterSentiment != "All") {
      list = list.where((v) => v.classification == _filterSentiment).toList();
    }
    if (_filterGender != "All") {
      list = list.where((v) => v.gender == _filterGender).toList();
    }
    if (_filterAgeGroup == "<30") {
      list = list.where((v) => v.age < 30).toList();
    } else if (_filterAgeGroup == "30-50") {
      list = list.where((v) => v.age >= 30 && v.age <= 50).toList();
    } else if (_filterAgeGroup == "50+") {
      list = list.where((v) => v.age > 50).toList();
    }
    if (_filterContact == "Has Mobile") {
      list = list.where((v) => v.phone.isNotEmpty).toList();
    } else if (_filterContact == "No Mobile") {
      list = list.where((v) => v.phone.isEmpty).toList();
    }
    if (_filterVisited == "Visited") {
      list = list.where((v) => v.isVisited).toList();
    } else if (_filterVisited == "Unvisited") {
      list = list.where((v) => !v.isVisited).toList();
    }
    if (_filterCommunity != "All") {
      list = list.where((v) => v.communityGroup == _filterCommunity).toList();
    }
    if (_filterScheme != "All") {
      list = list.where((v) => v.scheme.toLowerCase().contains(_filterScheme.toLowerCase())).toList();
    }
    if (_filterSerial.trim().isNotEmpty) {
      list = list.where((v) => v.serialNo.contains(_filterSerial.trim())).toList();
    }

    return list;
  }

  void _navigateTo(String viewName) {
    setState(() {
      _currentView = viewName;
      if (viewName == "dashboard") _currentTab = 0;
      if (viewName == "voters") _currentTab = 1;
      if (viewName == "slips") _currentTab = 2;
      if (viewName == "copilot") _currentTab = _isAiEnabled ? 3 : 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = widget.themeMode == ThemeMode.dark;
    final c = AppThemeColors(isDark);

    // 1. Hardware Activation Screen
    if (!_isActivated) {
      return ActivationScreen(
        isDark: isDark,
        onSwitchPortal: widget.onSignOut,
        onActivated: () {
          setState(() {
            _isActivated = true;
          });
        },
      );
    }

    // 2. QA State Verification Screens (Pending / Blocked)
    if (_qaState == "pending") {
      return PendingApprovalScreen(
        isDark: isDark,
        onSwitchToActive: () => setState(() => _qaState = "active"),
      );
    }
    if (_qaState == "blocked") {
      return BlockedAccountScreen(
        isDark: isDark,
        onSwitchToActive: () => setState(() => _qaState = "active"),
      );
    }

    return Scaffold(
      backgroundColor: c.scaffoldBg,

      // ========================================================================
      // TOP APPBAR WITH HAMBURGER DRAWER + THEME TOGGLE + OFFLINE + LANGUAGE
      // ========================================================================
      appBar: AppBar(
        elevation: 0,
        backgroundColor: c.cardBg,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: Icon(Icons.menu_rounded, color: c.textPrimary),
            tooltip: "Open Full Portal Navigation",
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: c.primary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: c.primary.withOpacity(0.35)),
              ),
              child: Text(
                "INDIATA",
                style: TextStyle(
                  color: c.primary,
                  fontWeight: FontWeight.w900,
                  fontSize: 11,
                  letterSpacing: 1.1,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              "Karyakarta",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
          ],
        ),
        actions: [
          // 1. THEME MODE TOGGLE (☀️ / 🌙)
          IconButton(
            icon: Icon(
              isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
              color: isDark ? Colors.amberAccent : c.textPrimary,
              size: 20,
            ),
            tooltip: isDark ? "Switch to Light Theme (Daylight)" : "Switch to Dark Theme (Obsidian)",
            onPressed: widget.onToggleTheme,
          ),

          // 2. LANGUAGE TOGGLE (MR / EN / HI)
          GestureDetector(
            onTap: () {
              setState(() {
                if (_language == "MR") _language = "EN";
                else if (_language == "EN") _language = "HI";
                else _language = "MR";
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  duration: const Duration(milliseconds: 1000),
                  content: Text("Language switched to: $_language"),
                ),
              );
            },
            child: Container(
              margin: const EdgeInsets.only(right: 6),
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
              decoration: BoxDecoration(
                color: c.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: c.primary.withOpacity(0.3)),
              ),
              child: Text(
                _language,
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.primary),
              ),
            ),
          ),

          // 3. ONLINE / OFFLINE TOGGLE PILL
          GestureDetector(
            onTap: () {
              setState(() {
                _isOnline = !_isOnline;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  duration: const Duration(milliseconds: 1500),
                  backgroundColor: _isOnline ? c.green : c.amber,
                  content: Text(_isOnline
                      ? "ONLINE: Local changes synchronized with Candidate War Room"
                      : "OFFLINE: Local SQLite caching enabled"),
                ),
              );
            },
            child: Container(
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: _isOnline ? c.green.withOpacity(0.15) : c.amber.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _isOnline ? c.green : c.amber),
              ),
              child: Row(
                children: [
                  Icon(_isOnline ? Icons.wifi : Icons.wifi_off, size: 12, color: _isOnline ? c.green : c.amber),
                  const SizedBox(width: 4),
                  Text(
                    _isOnline ? "Online" : "Offline",
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: _isOnline ? c.green : c.amber),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),

      // ========================================================================
      // FULL NAVIGATION DRAWER (REPLICATES ALL 15 WEB PORTAL OPTIONS)
      // ========================================================================
      drawer: _buildPortalDrawer(c, isDark),

      // ========================================================================
      // ACTIVE VIEW BODY (DASHBOARD, MODULE SCREENS, OR BOTTOM TAB PAGES)
      // ========================================================================
      body: _buildCurrentView(c, isDark),

      // ========================================================================
      // PERSISTENT 4-TAB BOTTOM NAVIGATION BAR (CORE FIELD CADRE ACTIONS)
      // ========================================================================
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: c.cardBg,
          border: Border(top: BorderSide(color: c.borderColor, width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentTab > (_isAiEnabled ? 3 : 2) ? 0 : _currentTab,
          onTap: (index) {
            setState(() {
              _currentTab = index;
              if (index == 0) _currentView = "dashboard";
              if (index == 1) _currentView = "voters";
              if (index == 2) _currentView = "slips";
              if (index == 3 && _isAiEnabled) _currentView = "copilot";
            });
          },
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: c.primary,
          unselectedItemColor: c.textSecondary,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
          unselectedLabelStyle: const TextStyle(fontSize: 10),
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: "Dashboard",
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.people_alt_rounded),
              label: "Voters",
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.print_rounded),
              label: "Slips",
            ),
            if (_isAiEnabled)
              const BottomNavigationBarItem(
                icon: Icon(Icons.auto_awesome_rounded),
                label: "Copilot",
              ),
          ],
        ),
      ),
    );
  }

  // ==============================================================================
  // NAVIGATION DRAWER (EXACT COMPLETE WEB PORTAL SIDEBAR REPLICATION)
  // ==============================================================================
  Widget _buildPortalDrawer(AppThemeColors c, bool isDark) {
    return Drawer(
      backgroundColor: c.cardBg,
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // Drawer Cadre Profile Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF020817) : const Color(0xFFF1F5F9),
                border: Border(bottom: BorderSide(color: c.borderColor)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: c.primary,
                        child: const Text("SM", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Sachin D. Mane",
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: c.textPrimary),
                            ),
                            Text(
                              "Verified Karyakarta (KAR-2026-001)",
                              style: TextStyle(fontSize: 10, color: c.green, fontWeight: FontWeight.w600),
                            ),
                            Text(
                              "Candidate: Anand Shinde",
                              style: TextStyle(fontSize: 10, color: c.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 4,
                    children: ["Booth #101", "Booth #102", "Booth #103"].map((b) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: c.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(b, style: TextStyle(fontSize: 9, color: c.primary, fontWeight: FontWeight.bold)),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),

            // SECTION 1: FIELD OPERATIONS
            _drawerSectionHeader("FIELD OPERATIONS", c),
            _drawerItem(Icons.dashboard_rounded, "Performance Dashboard", "dashboard", c),
            _drawerItem(Icons.search_rounded, "Search Voter & Dossier", "voters", c),
            _drawerItem(Icons.tune_rounded, "Advanced Filter", "advancedFilter", c),
            _drawerItem(Icons.report_problem_rounded, "Voter Issues & Tickets", "issues", c, badge: "${_issues.where((i) => i.status == 'Open').length} Open", badgeColor: c.red),
            if (_isAiEnabled)
              _drawerItem(Icons.auto_awesome_rounded, "AI Field Assistant", "copilot", c, badge: "AI", badgeColor: c.purple),
            _drawerItem(Icons.call_rounded, "Phone Book Directory", "phoneBook", c),
            _drawerItem(Icons.location_city_rounded, "Booth & BLO Directory", "boothInfo", c),
            _drawerItem(Icons.assessment_rounded, "Reports & Exports", "reports", c),

            // SECTION 2: LEDGER & SETTINGS
            _drawerSectionHeader("LEDGER & SETTINGS", c),
            _drawerItem(Icons.receipt_long_rounded, "Slip History", "slipHistory", c),
            _drawerItem(Icons.history_rounded, "Activity Audit History", "activityHistory", c),
            _drawerItem(Icons.manage_accounts_rounded, "Profile & Device Settings", "profile", c),

            const Divider(),

            // SECTION 3: TESTING CONTROLS & DEV MODE
            _drawerSectionHeader("TESTING & QA SIMULATOR", c),

            // Theme Mode Toggle in Drawer
            ListTile(
              dense: true,
              leading: Icon(isDark ? Icons.light_mode : Icons.dark_mode, size: 20, color: c.amber),
              title: Text("Theme Mode", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
              trailing: Text(isDark ? "Dark (Obsidian)" : "Light (Daylight)", style: TextStyle(fontSize: 10, color: c.primary, fontWeight: FontWeight.bold)),
              onTap: () {
                Navigator.pop(context);
                widget.onToggleTheme();
              },
            ),

            // QA State Switcher (Active, Pending, Blocked)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("QA Access Switcher:", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textSecondary)),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      _qaStateChip("Active", "active", c.green, c),
                      const SizedBox(width: 6),
                      _qaStateChip("Pending", "pending", c.amber, c),
                      const SizedBox(width: 6),
                      _qaStateChip("Blocked", "blocked", c.red, c),
                    ],
                  ),
                ],
              ),
            ),

            // Sign Out
            ListTile(
              dense: true,
              leading: const Icon(Icons.logout, size: 20, color: Colors.red),
              title: const Text("Sign Out / Unlink Device", style: TextStyle(fontSize: 12, color: Colors.red, fontWeight: FontWeight.bold)),
              onTap: () {
                Navigator.pop(context);
                setState(() => _isActivated = false);
                if (widget.onSignOut != null) {
                  widget.onSignOut!();
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _drawerSectionHeader(String title, AppThemeColors c) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, top: 12, bottom: 4),
      child: Text(
        title,
        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1.2),
      ),
    );
  }

  Widget _drawerItem(IconData icon, String title, String viewName, AppThemeColors c, {String? badge, Color? badgeColor}) {
    final isSelected = _currentView == viewName;
    return ListTile(
      dense: true,
      selected: isSelected,
      selectedTileColor: c.primary.withOpacity(0.12),
      leading: Icon(icon, size: 19, color: isSelected ? c.primary : c.textSecondary),
      title: Text(
        title,
        style: TextStyle(
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? c.primary : c.textPrimary,
        ),
      ),
      trailing: badge != null
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: (badgeColor ?? c.primary).withOpacity(0.18),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: badgeColor ?? c.primary, width: 0.8),
              ),
              child: Text(
                badge,
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: badgeColor ?? c.primary),
              ),
            )
          : null,
      onTap: () {
        Navigator.pop(context);
        _navigateTo(viewName);
      },
    );
  }

  Widget _qaStateChip(String label, String value, Color color, AppThemeColors c) {
    final isSelected = _qaState == value;
    return InkWell(
      onTap: () {
        setState(() => _qaState = value);
        Navigator.pop(context);
      },
      borderRadius: BorderRadius.circular(6),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.2) : c.surfaceBg,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: isSelected ? color : c.borderColor),
        ),
        child: Text(
          label,
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isSelected ? color : c.textSecondary),
        ),
      ),
    );
  }

  // ==============================================================================
  // VIEW ROUTER (SWITCHES BODY CONTENT BASED ON DRAWER OR BOTTOM NAV SELECTION)
  // ==============================================================================
  Widget _buildCurrentView(AppThemeColors c, bool isDark) {
    switch (_currentView) {
      case "dashboard":
        return DashboardScreen(
          c: c,
          isDark: isDark,
          voters: _voters,
          onKpiTap: (filter) {
            setState(() {
              _activeKpiFilter = filter;
              _navigateTo("voters");
            });
          },
          onQuickActionTap: (view) => _navigateTo(view),
        );

      case "voters":
        return VoterSearchScreen(
          c: c,
          isDark: isDark,
          voters: filteredVoters,
          allVoters: _voters,
          issues: _issues,
          slipHistory: _slipHistory,
          activeFilter: _activeKpiFilter,
          onResetFilter: () => setState(() => _activeKpiFilter = "all"),
          onVoterUpdated: (updated) {
            setState(() {
              final idx = _voters.indexWhere((v) => v.id == updated.id);
              if (idx != -1) _voters[idx] = updated;
            });
          },
          onOpenAdvancedFilter: () => _navigateTo("advancedFilter"),
          onAddActivity: (act) {
            setState(() => _activities.insert(0, act));
          },
          onAddSlip: (slip) {
            setState(() => _slipHistory.insert(0, slip));
          },
          onAddIssue: (issue) {
            setState(() => _issues.insert(0, issue));
          },
        );

      case "surveys":
        return DoorstepSurveyScreen(
          c: c,
          isDark: isDark,
          voters: _voters.where((v) => !v.isVisited).toList(),
          onSurveyComplete: (voterId, sentiment) {
            setState(() {
              final v = _voters.firstWhere((item) => item.id == voterId);
              v.isVisited = true;
              v.classification = sentiment;
              _activities.insert(
                0,
                ActivityItem(
                  title: "Doorstep Survey Completed",
                  target: "${v.name} (${v.epicId})",
                  timestamp: "Just Now",
                  status: "SUCCESS",
                  details: "Marked as $sentiment with GPS_VERIFIED tag.",
                  icon: Icons.check_circle_outline,
                ),
              );
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(backgroundColor: c.green, content: const Text("Survey saved with GPS_VERIFIED geotag!")),
            );
          },
          onNavigateToVoters: () => _navigateTo("voters"),
        );

      case "slips":
        return SlipsPrintScreen(
          c: c,
          isDark: isDark,
          voters: _voters,
          onSlipPrinted: (v, mode) {
            setState(() {
              _slipHistory.insert(
                0,
                SlipHistoryItem(
                  voterName: v.name,
                  marathiName: v.marathiName,
                  boothNo: v.boothNo,
                  epicId: v.epicId,
                  timestamp: "Just Now",
                  mode: mode,
                  serialNo: "04${_slipHistory.length + 1}",
                  status: mode.contains("Thermal") ? "Printed" : "Delivered",
                ),
              );
            });
          },
        );

      case "copilot":
        if (!_isAiEnabled) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  color: c.cardBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: c.borderColor),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.lock_rounded, size: 44, color: c.amber),
                    const SizedBox(height: 12),
                    Text(
                      "AI Field Assistant Disabled",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: c.textPrimary),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Access to the Indic AI Copilot has been disabled for this Karyakarta by the Main Candidate Admin. Please contact your campaign administrator to re-enable AI Field Assistant privileges.",
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, color: c.textSecondary, height: 1.4),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => _navigateTo("dashboard"),
                      style: ElevatedButton.styleFrom(backgroundColor: c.primary),
                      child: const Text("Return to Dashboard", style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ),
              ),
            ),
          );
        }
        return IndicAiCopilotScreen(
          c: c,
          isDark: isDark,
          voters: _voters,
          onNavigateToVoters: () => _navigateTo("voters"),
          onLogout: () => setState(() => _isActivated = false),
        );

      case "advancedFilter":
        return AdvancedFilterScreen(
          c: c,
          isDark: isDark,
          selectedBooth: _filterBooth,
          selectedSentiment: _filterSentiment,
          selectedAgeGroup: _filterAgeGroup,
          selectedGender: _filterGender,
          selectedContact: _filterContact,
          selectedVisited: _filterVisited,
          selectedCommunity: _filterCommunity,
          selectedScheme: _filterScheme,
          selectedSerial: _filterSerial,
          matchingCount: filteredVoters.length,
          onApplyFilter: (booth, sentiment, age, gender, contact, visited, community, scheme, serial) {
            setState(() {
              _filterBooth = booth;
              _filterSentiment = sentiment;
              _filterAgeGroup = age;
              _filterGender = gender;
              _filterContact = contact;
              _filterVisited = visited;
              _filterCommunity = community;
              _filterScheme = scheme;
              _filterSerial = serial;
              _navigateTo("voters");
            });
          },
          onResetFilter: () {
            setState(() {
              _filterBooth = "All";
              _filterSentiment = "All";
              _filterAgeGroup = "All";
              _filterGender = "All";
              _filterContact = "All";
              _filterVisited = "All";
              _filterCommunity = "All";
              _filterScheme = "All";
              _filterSerial = "";
              _activeKpiFilter = "all";
            });
          },
        );

      case "issues":
        return VoterIssuesScreen(
          c: c,
          isDark: isDark,
          issues: _issues,
          onAddIssue: (newIssue) {
            setState(() {
              _issues.insert(0, newIssue);
              _activities.insert(
                0,
                ActivityItem(
                  title: "Grievance Ticket Logged",
                  target: newIssue.title,
                  timestamp: "Just Now",
                  status: "OPEN",
                  details: "Logged for ${newIssue.citizenName} (Booth #${newIssue.boothNo})",
                  icon: Icons.report_problem,
                ),
              );
            });
          },
          onStatusToggle: (id) {
            setState(() {
              final idx = _issues.indexWhere((i) => i.id == id);
              if (idx != -1) {
                _issues[idx].status = _issues[idx].status == "Open" ? "Resolved" : "Open";
              }
            });
          },
        );

      case "phoneBook":
        return PhoneBookScreen(c: c, isDark: isDark, voters: _voters);

      case "boothInfo":
        return BoothDirectoryScreen(c: c, isDark: isDark, booths: _booths);

      case "reports":
        return ReportsScreen(c: c, isDark: isDark, voters: _voters, issues: _issues, slipHistory: _slipHistory);

      case "slipHistory":
        return SlipHistoryScreen(c: c, isDark: isDark, slips: _slipHistory);

      case "activityHistory":
        return ActivityHistoryScreen(c: c, isDark: isDark, activities: _activities);

      case "profile":
        return ProfileSettingsScreen(
          c: c,
          isDark: isDark,
          qaState: _qaState,
          isAiEnabled: _isAiEnabled,
          onToggleAi: () => setState(() => _isAiEnabled = !_isAiEnabled),
          onToggleTheme: widget.onToggleTheme,
          onQaStateChanged: (s) => setState(() => _qaState = s),
          onLogout: () => setState(() => _isActivated = false),
        );

      default:
        return const SizedBox();
    }
  }
}

// ==============================================================================
// 1. PERFORMANCE DASHBOARD (15 KPIS + QUICK ACTION HUB FOR CLIENT DEMOS)
// ==============================================================================
class DashboardScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<VoterItem> voters;
  final Function(String) onKpiTap;
  final Function(String) onQuickActionTap;

  const DashboardScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voters,
    required this.onKpiTap,
    required this.onQuickActionTap,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _quickPage = 0;
  final PageController _quickController = PageController();

  @override
  void dispose() {
    _quickController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = widget.isDark;
    final voters = widget.voters;
    final onKpiTap = widget.onKpiTap;
    final onQuickActionTap = widget.onQuickActionTap;

    final supporters = voters.where((v) => v.classification == "Supporter").length;
    final doubtful = voters.where((v) => v.classification == "Doubtful").length;
    final opponents = voters.where((v) => v.classification == "Opponent").length;
    final neutral = voters.where((v) => v.classification == "Neutral").length;
    final visited = voters.where((v) => v.isVisited).length;
    final unvisited = voters.where((v) => !v.isVisited).length;
    final mobileHas = voters.where((v) => v.phone.isNotEmpty).length;

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        // Welcome Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: isDark
                  ? [const Color(0xFF0B1527), const Color(0xFF1E1B4B)]
                  : [const Color(0xFFE0E7FF), Colors.white],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: isDark ? const Color(0xFF312E81) : const Color(0xFFC7D2FE)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: c.green.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: c.green),
                    ),
                    child: Text(
                      "● FIELD CADRE ACTIVE",
                      style: TextStyle(color: c.green, fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Text(
                    "Candidate: Anand Shinde",
                    style: TextStyle(color: c.textPrimary, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                "Welcome back, Sachin D. Mane",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: c.textPrimary),
              ),
              Text(
                "Constituency: 215 - Kasba Peth Assembly • Shaniwar Peth",
                style: TextStyle(fontSize: 11, color: c.textSecondary),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 6,
                children: ["Booth #101", "Booth #102", "Booth #103"].map((b) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    decoration: BoxDecoration(
                      color: c.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: c.primary.withOpacity(0.3)),
                    ),
                    child: Text(b, style: TextStyle(fontSize: 9, color: c.primary, fontWeight: FontWeight.bold)),
                  );
                }).toList(),
              ),
            ],
          ),
        ),

        const SizedBox(height: 14),

        // SECTION: QUICK COMMANDS (TWO-ROW HORIZONTALLY SWIPEABLE CAROUSEL - 16 SHORTCUTS)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(
                  "QUICK COMMANDS",
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1),
                ),
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: c.primary.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    "2 Rows • Swipe ◄ ►",
                    style: TextStyle(fontSize: 8.5, color: c.primary, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                Text(
                  "16 Shortcuts",
                  style: TextStyle(fontSize: 9, color: c.primary, fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 6),
                // Dynamic Page Dot Indicators
                Row(
                  children: List.generate(2, (index) {
                    final isActive = _quickPage == index;
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 2),
                      width: isActive ? 12 : 5,
                      height: 5,
                      decoration: BoxDecoration(
                        color: isActive ? c.primary : c.borderColor,
                        borderRadius: BorderRadius.circular(3),
                      ),
                    );
                  }),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 8),

        SizedBox(
          height: 185,
          child: PageView(
            controller: _quickController,
            onPageChanged: (page) => setState(() => _quickPage = page),
            children: [
              // PAGE 1: Core Field Intelligence & Essential Operations (2 rows of 4)
              GridView.count(
                crossAxisCount: 4,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                childAspectRatio: 0.95,
                children: [
                  _quickTile(Icons.person_search_rounded, "Search\nVoter", c.primary, () => onQuickActionTap("voters")),
                  _quickTile(Icons.tune_rounded, "Advanced\nSearch", c.cyan, () => onQuickActionTap("advancedFilter")),
                  _quickTile(Icons.assignment_turned_in_rounded, "Doorstep\nSurvey", c.green, () => onQuickActionTap("surveys")),
                  _quickTile(Icons.how_to_vote_rounded, "Mark\nTurnout", Colors.purple, () => onQuickActionTap("voters")),
                  _quickTile(Icons.report_problem_rounded, "Issues &\nTickets (2)", c.red, () => onQuickActionTap("issues")),
                  _quickTile(Icons.call_rounded, "Phone\nBook", c.cyan, () => onQuickActionTap("phoneBook")),
                  _quickTile(Icons.location_city_rounded, "Booth &\nBLO Info", c.amber, () => onQuickActionTap("boothInfo")),
                  _quickTile(Icons.assessment_rounded, "Reports &\nExports", c.purple, () => onQuickActionTap("reports")),
                ],
              ),
              // PAGE 2: Slips, Audits, Family Network & Utilities (2 rows of 4)
              GridView.count(
                crossAxisCount: 4,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                childAspectRatio: 0.95,
                children: [
                  _quickTile(Icons.print_rounded, "Print\nVoter Slip", c.primary, () => onQuickActionTap("slipHistory")),
                  _quickTile(Icons.share_rounded, "WhatsApp\nSlip", c.green, () => onQuickActionTap("voters")),
                  _quickTile(Icons.person_add_alt_1_rounded, "Register\nVoter", Colors.teal, () => onQuickActionTap("voters")),
                  _quickTile(Icons.account_tree_rounded, "Family\nTree", Colors.indigo, () => onQuickActionTap("voters")),
                  _quickTile(Icons.receipt_long_rounded, "Slip\nHistory", c.green, () => onQuickActionTap("slipHistory")),
                  _quickTile(Icons.history_rounded, "Activity\nAudit", c.textPrimary, () => onQuickActionTap("activityHistory")),
                  _quickTile(Icons.auto_awesome_rounded, "AI Field\nCopilot", Colors.amber, () => onQuickActionTap("aiMode")),
                  _quickTile(Icons.manage_accounts_rounded, "Profile &\nSettings", c.primary, () => onQuickActionTap("profile")),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // SECTION: CULTURAL & COMMUNITY DEMOGRAPHIC CLUSTERS (INTERACTIVE)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "CULTURAL & COMMUNITY CLUSTERS",
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1),
            ),
            Text(
              "Click to Target",
              style: TextStyle(fontSize: 9, color: c.primary, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 38,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              _communityChip("मराठा (Maratha)", c.primary, () => onKpiTap("caste_maratha")),
              const SizedBox(width: 6),
              _communityChip("ब्राह्मण (Brahmin)", Colors.indigo, () => onKpiTap("caste_brahmin")),
              const SizedBox(width: 6),
              _communityChip("इतर मागास (OBC)", c.cyan, () => onKpiTap("caste_obc")),
              const SizedBox(width: 6),
              _communityChip("अल्पसंख्याक (Minority)", c.green, () => onKpiTap("caste_muslim")),
              const SizedBox(width: 6),
              _communityChip("महिला बचत गट (SHG)", Colors.pink, () => onKpiTap("comm_Self-Help Groups")),
              const SizedBox(width: 6),
              _communityChip("व्यापारी मंडळ (Traders)", c.amber, () => onKpiTap("comm_Local Organisations")),
              const SizedBox(width: 6),
              _communityChip("तरुण मंडळ (Youth)", c.purple, () => onKpiTap("comm_Village Community")),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // SECTION: 15 FIELD PERFORMANCE TELEMETRY KPIS
        Text(
          "FIELD PERFORMANCE TELEMETRY (15 METRICS)",
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1),
        ),
        const SizedBox(height: 8),

        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 8,
          crossAxisSpacing: 8,
          childAspectRatio: 1.8,
          children: [
            _kpiCard("Assigned Voters", "${voters.length}", "3 Polling Booths", c.primary, () => onKpiTap("all")),
            _kpiCard("Total Visited", "$visited", "${((visited / (voters.isEmpty ? 1 : voters.length)) * 100).toInt()}% Doorstep", c.green, () => onKpiTap("visited")),
            _kpiCard("Not Visited", "$unvisited", "Target pending", c.amber, () => onKpiTap("unvisited")),
            _kpiCard("Surveys Done", "$visited", "100% data captured", c.purple, () => onKpiTap("visited")),
            _kpiCard("Important Contacts", "2", "Key influencers", Colors.amber, () => onKpiTap("important")),
            _kpiCard("Mobile Available", "$mobileHas", "SMS reachable", c.cyan, () => onKpiTap("mobile_has")),
            _kpiCard("Supporters (Green)", "$supporters", "Strong vote cadre", c.green, () => onKpiTap("supporters")),
            _kpiCard("Doubtful / Swing", "$doubtful", "Follow-up required", c.amber, () => onKpiTap("doubtful")),
            _kpiCard("Opponents (Red)", "$opponents", "Leanings recorded", c.red, () => onKpiTap("opponents")),
            _kpiCard("Neutral (Slate)", "$neutral", "Persuasion target", Colors.blueGrey, () => onKpiTap("neutral")),
            _kpiCard("Open Grievances", "2", "Action in booths", Colors.orange, () => onQuickActionTap("issues")),
          ],
        ),
      ],
    );
  }

  Widget _quickTile(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
        decoration: BoxDecoration(
          color: c.cardBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: c.borderColor),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 22, color: color),
            const SizedBox(height: 4),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold, color: c.textPrimary, height: 1.1),
            ),
          ],
        ),
      ),
    );
  }

  Widget _communityChip(String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: c.cardBg,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.4)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 6, height: 6, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
            const SizedBox(width: 6),
            Text(label, style: TextStyle(color: c.textPrimary, fontSize: 10, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _kpiCard(String title, String count, String sub, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: c.cardBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.35)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(title, style: TextStyle(color: c.textSecondary, fontSize: 9.5, fontWeight: FontWeight.w600)),
            const SizedBox(height: 2),
            Text(count, style: TextStyle(color: c.textPrimary, fontSize: 17, fontWeight: FontWeight.w900)),
            Text(sub, style: TextStyle(color: color, fontSize: 8.5, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

// ==============================================================================
// 2. ADVANCED FILTER SCREEN (ALIGNED WITH CANDIDATE TOTAL VOTERS SECTION)
// ==============================================================================
class AdvancedFilterScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final String selectedBooth;
  final String selectedSentiment;
  final String selectedAgeGroup;
  final String selectedGender;
  final String selectedContact;
  final String selectedVisited;
  final String selectedCommunity;
  final String selectedScheme;
  final String selectedSerial;
  final int matchingCount;
  final Function(
    String booth,
    String sentiment,
    String age,
    String gender,
    String contact,
    String visited,
    String community,
    String scheme,
    String serial,
  ) onApplyFilter;
  final VoidCallback onResetFilter;

  const AdvancedFilterScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.selectedBooth,
    required this.selectedSentiment,
    required this.selectedAgeGroup,
    required this.selectedGender,
    required this.selectedContact,
    required this.selectedVisited,
    required this.selectedCommunity,
    required this.selectedScheme,
    required this.selectedSerial,
    required this.matchingCount,
    required this.onApplyFilter,
    required this.onResetFilter,
  });

  @override
  State<AdvancedFilterScreen> createState() => _AdvancedFilterScreenState();
}

class _AdvancedFilterScreenState extends State<AdvancedFilterScreen> {
  late String _booth;
  late String _sentiment;
  late String _age;
  late String _gender;
  late String _contact;
  late String _visited;
  late String _community;
  late String _scheme;
  late TextEditingController _serialController;

  @override
  void initState() {
    super.initState();
    _booth = widget.selectedBooth;
    _sentiment = widget.selectedSentiment;
    _age = widget.selectedAgeGroup;
    _gender = widget.selectedGender;
    _contact = widget.selectedContact;
    _visited = widget.selectedVisited;
    _community = widget.selectedCommunity;
    _scheme = widget.selectedScheme;
    _serialController = TextEditingController(text: widget.selectedSerial);
  }

  @override
  void dispose() {
    _serialController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Advanced Voter Targeting",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
                ),
                Text(
                  "Mirrored with Candidate Portal filters",
                  style: TextStyle(fontSize: 11, color: c.textSecondary),
                ),
              ],
            ),
            TextButton(
              onPressed: () {
                setState(() {
                  _booth = "All";
                  _sentiment = "All";
                  _age = "All";
                  _gender = "All";
                  _contact = "All";
                  _visited = "All";
                  _community = "All";
                  _scheme = "All";
                  _serialController.clear();
                });
                widget.onResetFilter();
              },
              child: const Text("Reset All"),
            ),
          ],
        ),
        const SizedBox(height: 16),

        _filterSectionTitle("Assigned Polling Booth", c),
        Wrap(
          spacing: 8,
          children: ["All", "101", "102", "103"].map((b) {
            final sel = _booth == b;
            return ChoiceChip(
              label: Text(b == "All" ? "All Booths" : "Booth #$b"),
              selected: sel,
              onSelected: (val) => setState(() => _booth = b),
              selectedColor: c.primary,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Voter Classification Sentiment (Default Neutral)", c),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: ["All", "Supporter", "Doubtful", "Opponent", "Neutral"].map((s) {
            final sel = _sentiment == s;
            Color chipColor = c.primary;
            if (s == "Supporter") chipColor = c.green;
            if (s == "Doubtful") chipColor = c.amber;
            if (s == "Opponent") chipColor = Colors.redAccent;
            if (s == "Neutral") chipColor = Colors.blueGrey;

            return ChoiceChip(
              label: Text(s),
              selected: sel,
              onSelected: (val) => setState(() => _sentiment = s),
              selectedColor: chipColor,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11, fontWeight: sel ? FontWeight.bold : FontWeight.normal),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Contact Availability", c),
        Wrap(
          spacing: 8,
          children: ["All", "Has Mobile", "No Mobile"].map((opt) {
            final sel = _contact == opt;
            return ChoiceChip(
              label: Text(opt),
              selected: sel,
              onSelected: (val) => setState(() => _contact = opt),
              selectedColor: c.primary,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Field Outreach Status", c),
        Wrap(
          spacing: 8,
          children: ["All", "Visited", "Unvisited"].map((opt) {
            final sel = _visited == opt;
            return ChoiceChip(
              label: Text(opt),
              selected: sel,
              onSelected: (val) => setState(() => _visited = opt),
              selectedColor: c.primary,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Community & Cultural Groups", c),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: [
            "All",
            "Local Organisations",
            "Self-Help Groups",
            "Village Community",
            "Farmers",
            "Youth Mandals",
            "Vyapar Mandals"
          ].map((grp) {
            final sel = _community == grp;
            return ChoiceChip(
              label: Text(grp),
              selected: sel,
              onSelected: (val) => setState(() => _community = grp),
              selectedColor: c.primary,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Government Scheme Beneficiaries", c),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: ["All", "Ladki Bahin", "Kisan Samman", "PMAY", "Ayushman"].map((sch) {
            final sel = _scheme == sch;
            return ChoiceChip(
              label: Text(sch),
              selected: sel,
              onSelected: (val) => setState(() => _scheme = sch),
              selectedColor: c.primary,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Serial Number Search", c),
        TextField(
          controller: _serialController,
          keyboardType: TextInputType.number,
          style: TextStyle(color: c.textPrimary, fontSize: 12),
          decoration: InputDecoration(
            hintText: "Enter voter serial number (e.g. 101, 102)...",
            hintStyle: TextStyle(color: c.textSecondary, fontSize: 11),
            isDense: true,
            filled: true,
            fillColor: c.cardBg,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide(color: c.borderColor),
            ),
            prefixIcon: Icon(Icons.pin, size: 16, color: c.textSecondary),
          ),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Age Brackets", c),
        Wrap(
          spacing: 8,
          children: ["All", "<30", "30-50", "50+"].map((a) {
            final sel = _age == a;
            return ChoiceChip(
              label: Text(a == "All" ? "All Ages" : (a == "<30" ? "Youth (<30)" : a)),
              selected: sel,
              onSelected: (val) => setState(() => _age = a),
              selectedColor: c.primary,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Gender Scope", c),
        Wrap(
          spacing: 8,
          children: ["All", "M", "F"].map((g) {
            final sel = _gender == g;
            return ChoiceChip(
              label: Text(g == "All" ? "All Genders" : (g == "M" ? "Male Voters" : "Female Voters")),
              selected: sel,
              onSelected: (val) => setState(() => _gender = g),
              selectedColor: c.primary,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
        ),

        const SizedBox(height: 28),
        ElevatedButton(
          onPressed: () {
            widget.onApplyFilter(
              _booth,
              _sentiment,
              _age,
              _gender,
              _contact,
              _visited,
              _community,
              _scheme,
              _serialController.text.trim(),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: c.primary,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: Text(
            "Apply Filters & View Voters (${widget.matchingCount} Matches)",
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }

  Widget _filterSectionTitle(String title, AppThemeColors c) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textSecondary)),
    );
  }
}

// ==============================================================================
// 3. VOTER ISSUES & TICKETS SCREEN (WITH AUDIO NOTE RECORDING)
// ==============================================================================
class VoterIssuesScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<IssueItem> issues;
  final Function(IssueItem) onAddIssue;
  final Function(String) onStatusToggle;

  const VoterIssuesScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.issues,
    required this.onAddIssue,
    required this.onStatusToggle,
  });

  @override
  State<VoterIssuesScreen> createState() => _VoterIssuesScreenState();
}

class _VoterIssuesScreenState extends State<VoterIssuesScreen> {
  String _filter = "All";

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final list = widget.issues.where((i) {
      if (_filter == "Open") return i.status == "Open";
      if (_filter == "Resolved") return i.status == "Resolved";
      return true;
    }).toList();

    return Column(
      children: [
        // Filter Tabs & New Ticket button
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Wrap(
                spacing: 6,
                children: ["All", "Open", "Resolved"].map((f) {
                  final sel = _filter == f;
                  return InkWell(
                    onTap: () => setState(() => _filter = f),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: sel ? c.primary : c.cardBg,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: sel ? c.primary : c.borderColor),
                      ),
                      child: Text(
                        f,
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: sel ? Colors.white : c.textPrimary),
                      ),
                    ),
                  );
                }).toList(),
              ),
              ElevatedButton.icon(
                onPressed: () => _showAddIssueDialog(context),
                icon: const Icon(Icons.add, size: 16, color: Colors.white),
                label: const Text("Log Issue", style: TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(backgroundColor: c.primary, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
              ),
            ],
          ),
        ),

        // Issue Cards Feed
        Expanded(
          child: ListView.builder(
            itemCount: list.length,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemBuilder: (ctx, idx) {
              final item = list[idx];
              final isOpen = item.status == "Open";

              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: c.cardBg,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: c.borderColor),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: c.primary.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(item.category, style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: c.primary)),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: isOpen ? c.red.withOpacity(0.15) : c.green.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: isOpen ? c.red : c.green),
                          ),
                          child: Text(
                            item.status.toUpperCase(),
                            style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: isOpen ? c.red : c.green),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(item.title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: c.textPrimary)),
                    const SizedBox(height: 4),
                    Text(
                      "Citizen: ${item.citizenName} • Booth #${item.boothNo} • Logged: ${item.date}",
                      style: TextStyle(fontSize: 10, color: c.textSecondary),
                    ),
                    if (item.audioRecorded) ...[
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: c.surfaceBg, borderRadius: BorderRadius.circular(6)),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.mic, size: 12, color: c.red),
                            const SizedBox(width: 4),
                            Text("Voice Note Attached (0:14)", style: TextStyle(fontSize: 9, color: c.textSecondary)),
                          ],
                        ),
                      ),
                    ],
                    const Divider(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () => widget.onStatusToggle(item.id),
                          child: Text(
                            isOpen ? "Mark as Resolved" : "Re-open Ticket",
                            style: TextStyle(fontSize: 11, color: isOpen ? c.green : c.amber, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _showAddIssueDialog(BuildContext context) {
    final titleCtrl = TextEditingController();
    final citizenCtrl = TextEditingController(text: "Rajesh V. Patil");
    String cat = "Water Supply";
    bool voiceRecorded = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: widget.c.cardBg,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (dialogCtx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 16,
                right: 16,
                top: 16,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text("Log Citizen Grievance", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: widget.c.textPrimary)),
                  const SizedBox(height: 12),
                  TextField(
                    controller: titleCtrl,
                    style: TextStyle(color: widget.c.textPrimary, fontSize: 13),
                    decoration: InputDecoration(
                      labelText: "Issue Description / Title",
                      hintText: "e.g., Low water pressure, street light off...",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: citizenCtrl,
                    style: TextStyle(color: widget.c.textPrimary, fontSize: 13),
                    decoration: InputDecoration(
                      labelText: "Citizen Name",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    value: cat,
                    dropdownColor: widget.c.cardBg,
                    style: TextStyle(color: widget.c.textPrimary, fontSize: 13),
                    decoration: InputDecoration(labelText: "Category", border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                    items: ["Water Supply", "Road Infrastructure", "Electricity", "Sanitation", "Pension / Scheme"].map((c) {
                      return DropdownMenuItem(value: c, child: Text(c));
                    }).toList(),
                    onChanged: (val) => setModalState(() => cat = val!),
                  ),
                  const SizedBox(height: 12),
                  // Voice recording simulation
                  InkWell(
                    onTap: () {
                      setModalState(() => voiceRecorded = !voiceRecorded);
                    },
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: voiceRecorded ? Colors.green.withOpacity(0.15) : widget.c.surfaceBg,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: voiceRecorded ? Colors.green : widget.c.borderColor),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(voiceRecorded ? Icons.check_circle : Icons.mic, color: voiceRecorded ? Colors.green : Colors.red, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            voiceRecorded ? "Voice Note Attached (0:12)" : "Tap to Record Citizen Voice Note",
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      if (titleCtrl.text.isNotEmpty) {
                        widget.onAddIssue(
                          IssueItem(
                            id: "ISS-0${widget.issues.length + 1}",
                            title: titleCtrl.text,
                            citizenName: citizenCtrl.text,
                            category: cat,
                            priority: "High",
                            status: "Open",
                            boothNo: "101",
                            date: "Just Now",
                            audioRecorded: voiceRecorded,
                          ),
                        );
                        Navigator.pop(ctx);
                      }
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: widget.c.primary, padding: const EdgeInsets.symmetric(vertical: 14)),
                    child: const Text("Submit Ticket to War Room", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

// ==============================================================================
// 4. PHONE BOOK DIRECTORY SCREEN
// ==============================================================================
class PhoneBookScreen extends StatelessWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<VoterItem> voters;

  const PhoneBookScreen({super.key, required this.c, required this.isDark, required this.voters});

  @override
  Widget build(BuildContext context) {
    final phoneVoters = voters.where((v) => v.phone.isNotEmpty).toList();

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          color: c.surfaceBg,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Directory: ${phoneVoters.length} Verified Mobile Contacts", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: c.textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: c.green.withOpacity(0.15), borderRadius: BorderRadius.circular(6)),
                child: Text("Direct WhatsApp Enabled", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: c.green)),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: phoneVoters.length,
            padding: const EdgeInsets.all(12),
            itemBuilder: (ctx, idx) {
              final v = phoneVoters[idx];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: c.cardBg,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: c.borderColor),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor: c.primary.withOpacity(0.15),
                      child: Text(v.name[0], style: TextStyle(color: c.primary, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(v.name, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: c.textPrimary)),
                          Text("${v.marathiName} • ${v.phone}", style: TextStyle(fontSize: 10.5, color: c.textSecondary)),
                          Text("H.No ${v.houseNo} • Booth #${v.boothNo}", style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.call, color: c.green, size: 20),
                      tooltip: "Call Voter",
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Calling ${v.name} (${v.phone})...")),
                        );
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.share, color: Color(0xFF25D366), size: 20),
                      tooltip: "Send WhatsApp Chit",
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("WhatsApp voter chit sent to ${v.phone}!")),
                        );
                      },
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

// ==============================================================================
// 5. BOOTH & BLO DIRECTORY SCREEN
// ==============================================================================
class BoothDirectoryScreen extends StatelessWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<BoothItem> booths;

  const BoothDirectoryScreen({super.key, required this.c, required this.isDark, required this.booths});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: booths.length,
      padding: const EdgeInsets.all(14),
      itemBuilder: (ctx, idx) {
        final b = booths[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: c.primary.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text("POLLING BOOTH #${b.boothNo}", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.primary)),
                  ),
                  Text("${b.totalVoters} Voters", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.green)),
                ],
              ),
              const SizedBox(height: 8),
              Text(b.name, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary)),
              Text(b.address, style: TextStyle(fontSize: 10.5, color: c.textSecondary)),
              const Divider(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("BLO Officer:", style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
                      Text(b.bloName, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textPrimary)),
                      Text(b.bloPhone, style: TextStyle(fontSize: 10, color: c.primary)),
                    ],
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Calling BLO ${b.bloName}...")));
                    },
                    icon: const Icon(Icons.call, size: 14, color: Colors.white),
                    label: const Text("Call BLO", style: TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(backgroundColor: c.primary),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

// ==============================================================================
// 6. REPORTS & EXPORTS SCREEN (CUSTOM FILTERING & MULTI-FORMAT EXPORTS)
// ==============================================================================
class ReportsScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<VoterItem> voters;
  final List<IssueItem> issues;
  final List<SlipHistoryItem> slipHistory;

  const ReportsScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voters,
    required this.issues,
    required this.slipHistory,
  });

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String _selectedFilter = "All Allocated Electors";
  final String _customTitle = "Kasba Peth Cadre Audit & Electorate Report";

  final List<String> _filterScopes = [
    "All Allocated Electors",
    "Newly Added Voters",
    "Newly Added Female Voters",
    "Youth Electors (<30)",
    "Senior Citizens (60+)",
    "Confirmed Supporters (🟢)",
    "Swing / Doubtful Voters (🟡)",
    "Opposition Lean (🔴)",
    "Open Voter Issues & Tickets",
    "Daily Cadre Activity Audit",
  ];

  List<VoterItem> get _filteredVoters {
    switch (_selectedFilter) {
      case "Newly Added Voters":
        return widget.voters.where((v) => int.tryParse(v.serialNo) != null && int.parse(v.serialNo) >= 105).toList();
      case "Newly Added Female Voters":
        return widget.voters.where((v) => v.gender == "F" && (int.tryParse(v.serialNo) ?? 0) >= 102).toList();
      case "Youth Electors (<30)":
        return widget.voters.where((v) => v.age < 30).toList();
      case "Senior Citizens (60+)":
        return widget.voters.where((v) => v.age >= 60).toList();
      case "Confirmed Supporters (🟢)":
        return widget.voters.where((v) => v.classification == "Supporter").toList();
      case "Swing / Doubtful Voters (🟡)":
        return widget.voters.where((v) => v.classification == "Doubtful").toList();
      case "Opposition Lean (🔴)":
        return widget.voters.where((v) => v.classification == "Opponent").toList();
      default:
        return widget.voters;
    }
  }

  void _triggerExport(String format) {
    final count = _filteredVoters.length;
    final fileName = "${_customTitle.replaceAll(' ', '_')}_${_selectedFilter.replaceAll(' ', '_')}";
    String ext = format == "PDF" ? "pdf" : (format == "CSV" ? "csv" : "xlsx");

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF10B981),
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                "Exported $count records as '$fileName.$ext' ($format format)!",
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final filtered = _filteredVoters;
    final visited = widget.voters.where((v) => v.isVisited).length;

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Text(
          "Field Reports & Custom Export Builder",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
        ),
        Text(
          "Extract authenticated voter intelligence, doorstep audits, and delivery logs",
          style: TextStyle(fontSize: 11, color: c.textSecondary),
        ),
        const SizedBox(height: 14),

        // Summary Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            children: [
              _metricRow("Total Allocated Voters", "${widget.voters.length}", c),
              _metricRow("Doorstep Surveys Completed", "$visited (${((visited / widget.voters.length) * 100).toInt()}%)", c),
              _metricRow("Voter Chits Dispatched", "${widget.slipHistory.length}", c),
              _metricRow("Grievance Tickets Raised", "${widget.issues.length}", c),
              _metricRow("Unresolved Grievances", "${widget.issues.where((i) => i.status == 'Open').length}", c),
            ],
          ),
        ),

        const SizedBox(height: 16),
        Text(
          "FILTER SCOPE (SELECT TARGET DATASET)",
          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1.0),
        ),
        const SizedBox(height: 8),

        // Filter Scopes Chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: _filterScopes.map((scope) {
              final isSel = _selectedFilter == scope;
              return Padding(
                padding: const EdgeInsets.only(right: 6),
                child: ChoiceChip(
                  label: Text(scope),
                  selected: isSel,
                  selectedColor: c.primary,
                  backgroundColor: c.cardBg,
                  labelStyle: TextStyle(
                    fontSize: 11,
                    fontWeight: isSel ? FontWeight.bold : FontWeight.normal,
                    color: isSel ? Colors.white : c.textPrimary,
                  ),
                  side: BorderSide(color: isSel ? c.primary : c.borderColor),
                  onSelected: (val) {
                    if (val) setState(() => _selectedFilter = scope);
                  },
                ),
              );
            }).toList(),
          ),
        ),

        const SizedBox(height: 16),

        // Pre-Download Report Preview Container
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.preview_rounded, size: 16, color: c.primary),
                      const SizedBox(width: 6),
                      Text(
                        "Pre-Download Report Preview",
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: c.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      "${filtered.length} Records",
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.primary),
                    ),
                  ),
                ],
              ),
              const Divider(height: 18),
              _previewRow("Active Filter Scope", _selectedFilter, c),
              _previewRow("Electoral Roll Base", "Assembly 215 - Kasba Peth (Booths #101-#103)", c),
              _previewRow("Included Schema Fields", "Name, Marathi, EPIC, Phone, Booth, Age, Stance", c),
              _previewRow("Telemetry Audit Tag", "GPS_VERIFIED • War Room Sync Commited", c),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Multi-Format Export Buttons (PDF, CSV, Excel XLSX)
        Text(
          "REQUIRED EXPORT FORMATS",
          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1.0),
        ),
        const SizedBox(height: 8),

        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () => _triggerExport("PDF"),
                icon: const Icon(Icons.picture_as_pdf_rounded, size: 15, color: Colors.white),
                label: const Text("Export PDF", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEF4444),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () => _triggerExport("CSV"),
                icon: const Icon(Icons.table_chart_rounded, size: 15, color: Colors.white),
                label: const Text("Export CSV", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () => _triggerExport("Excel XLSX"),
                icon: const Icon(Icons.grid_on_rounded, size: 15, color: Colors.white),
                label: const Text("Export XLSX", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: c.primary,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _metricRow(String label, String value, AppThemeColors c) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 11.5, color: c.textSecondary)),
          Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
        ],
      ),
    );
  }

  Widget _previewRow(String label, String value, AppThemeColors c) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 10.5, color: c.textSecondary)),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: c.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}

// ==============================================================================
// 7. SLIP HISTORY SCREEN (DEDICATED KARYAKARTA DASHBOARD & KPIS)
// ==============================================================================
class SlipHistoryScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<SlipHistoryItem> slips;

  const SlipHistoryScreen({super.key, required this.c, required this.isDark, required this.slips});

  @override
  State<SlipHistoryScreen> createState() => _SlipHistoryScreenState();
}

class _SlipHistoryScreenState extends State<SlipHistoryScreen> {
  String _selectedMethod = "All";
  String _selectedStatus = "All";

  List<SlipHistoryItem> get _filteredSlips {
    return widget.slips.where((s) {
      if (_selectedMethod != "All") {
        if (_selectedMethod == "WhatsApp" && !s.mode.contains("WhatsApp")) return false;
        if (_selectedMethod == "Thermal" && !s.mode.contains("Thermal")) return false;
      }
      if (_selectedStatus != "All" && s.status != _selectedStatus) {
        return false;
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final total = widget.slips.length;
    final waCount = widget.slips.where((s) => s.mode.contains("WhatsApp")).length;
    final thermalCount = widget.slips.where((s) => s.mode.contains("Thermal")).length;
    final deliveredCount = widget.slips.where((s) => s.status == "Delivered" || s.status == "Printed").length;
    final pendingCount = widget.slips.where((s) => s.status == "Pending").length;
    final displayList = _filteredSlips;

    return Column(
      children: [
        // KPI Summary Cards
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 6),
          child: Column(
            children: [
              Row(
                children: [
                  _kpiMiniCard("Total Slips", "$total", Icons.receipt_long, c.primary, c),
                  const SizedBox(width: 8),
                  _kpiMiniCard("WhatsApp Sent", "$waCount", Icons.chat_bubble, const Color(0xFF10B981), c),
                  const SizedBox(width: 8),
                  _kpiMiniCard("Thermal Print", "$thermalCount", Icons.print, const Color(0xFF6366F1), c),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  _kpiMiniCard("Successful Delivery", "$deliveredCount", Icons.check_circle, const Color(0xFF10B981), c),
                  const SizedBox(width: 8),
                  _kpiMiniCard("Pending Dispatch", "$pendingCount", Icons.hourglass_top, const Color(0xFFF59E0B), c),
                ],
              ),
            ],
          ),
        ),

        // Filter Bar (Method & Status)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _filterChip("All", _selectedMethod == "All", (v) => setState(() => _selectedMethod = "All"), c),
                const SizedBox(width: 6),
                _filterChip("WhatsApp Only", _selectedMethod == "WhatsApp", (v) => setState(() => _selectedMethod = "WhatsApp"), c),
                const SizedBox(width: 6),
                _filterChip("Thermal Print Only", _selectedMethod == "Thermal", (v) => setState(() => _selectedMethod = "Thermal"), c),
                const SizedBox(width: 10),
                Container(height: 20, width: 1, color: c.borderColor),
                const SizedBox(width: 10),
                _filterChip("Delivered", _selectedStatus == "Delivered", (v) => setState(() => _selectedStatus = _selectedStatus == "Delivered" ? "All" : "Delivered"), c),
                const SizedBox(width: 6),
                _filterChip("Printed", _selectedStatus == "Printed", (v) => setState(() => _selectedStatus = _selectedStatus == "Printed" ? "All" : "Printed"), c),
                const SizedBox(width: 6),
                _filterChip("Pending", _selectedStatus == "Pending", (v) => setState(() => _selectedStatus = _selectedStatus == "Pending" ? "All" : "Pending"), c),
              ],
            ),
          ),
        ),

        // Slip History List
        Expanded(
          child: displayList.isNotEmpty
              ? ListView.builder(
                  itemCount: displayList.length,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  itemBuilder: (ctx, idx) {
                    final s = displayList[idx];
                    Color statusColor = c.green;
                    if (s.status == "Pending") statusColor = c.amber;
                    if (s.status == "Failed") statusColor = c.red;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: c.cardBg,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: c.borderColor),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(s.marathiName, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: c.textPrimary)),
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: statusColor.withOpacity(0.12),
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(color: statusColor.withOpacity(0.4)),
                                      ),
                                      child: Text(
                                        s.status,
                                        style: TextStyle(color: statusColor, fontSize: 8.5, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text("${s.voterName} • Booth #${s.boothNo} • Serial #${s.serialNo}", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                                Text("${s.mode} • ${s.timestamp}", style: TextStyle(fontSize: 9, color: c.textSecondary)),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: Icon(s.mode.contains("WhatsApp") ? Icons.chat_bubble_outline : Icons.print, color: c.primary, size: 20),
                            tooltip: s.mode.contains("WhatsApp") ? "Resend WhatsApp Slip" : "Reprint Slip",
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: c.primary,
                                  content: Text(s.mode.contains("WhatsApp")
                                      ? "Resending WhatsApp ECI slip chit to ${s.voterName}..."
                                      : "Reprinting thermal chit for ${s.voterName}..."),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    );
                  },
                )
              : Center(
                  child: Text("No slip records matching the selected filter.", style: TextStyle(color: c.textSecondary, fontSize: 12)),
                ),
        ),
      ],
    );
  }

  Widget _kpiMiniCard(String label, String value, IconData icon, Color color, AppThemeColors c) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: c.cardBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: c.borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary)),
                Icon(icon, size: 16, color: color),
              ],
            ),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(fontSize: 9, color: c.textSecondary), maxLines: 1, overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }

  Widget _filterChip(String label, bool isSelected, Function(bool) onSelected, AppThemeColors c) {
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: c.primary,
      backgroundColor: c.cardBg,
      labelStyle: TextStyle(
        fontSize: 10,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        color: isSelected ? Colors.white : c.textPrimary,
      ),
      side: BorderSide(color: isSelected ? c.primary : c.borderColor),
      onSelected: onSelected,
    );
  }
}

// ==============================================================================
// 8. FIELD ACTIVITY AUDIT HISTORY SCREEN
// ==============================================================================
class ActivityHistoryScreen extends StatelessWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<ActivityItem> activities;

  const ActivityHistoryScreen({super.key, required this.c, required this.isDark, required this.activities});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: activities.length,
      padding: const EdgeInsets.all(14),
      itemBuilder: (ctx, idx) {
        final a = activities[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: c.primary.withOpacity(0.12),
                child: Icon(a.icon, size: 16, color: c.primary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(a.title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: c.textPrimary)),
                        Text(a.timestamp, style: TextStyle(fontSize: 9, color: c.textSecondary)),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(a.target, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: c.primary)),
                    Text(a.details, style: TextStyle(fontSize: 10, color: c.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// ==============================================================================
// 9. PROFILE & DEVICE SETTINGS SCREEN
// ==============================================================================
class ProfileSettingsScreen extends StatelessWidget {
  final AppThemeColors c;
  final bool isDark;
  final String qaState;
  final bool isAiEnabled;
  final VoidCallback onToggleAi;
  final VoidCallback onToggleTheme;
  final Function(String) onQaStateChanged;
  final VoidCallback onLogout;

  const ProfileSettingsScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.qaState,
    required this.isAiEnabled,
    required this.onToggleAi,
    required this.onToggleTheme,
    required this.onQaStateChanged,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Cadre Profile Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: c.primary,
                child: const Text("SM", style: TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 10),
              Text("Sachin D. Mane", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary)),
              Text("Cadre ID: KAR-2026-001 • Verified", style: TextStyle(fontSize: 11, color: c.green, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text("Constituency: 215 - Kasba Peth Assembly", style: TextStyle(fontSize: 11, color: c.textSecondary)),
              Text("Allocated: Booth #101, #102, #103", style: TextStyle(fontSize: 11, color: c.textSecondary)),
            ],
          ),
        ),

        const SizedBox(height: 16),
        _sectionTitle("SCOPE & PORTAL ROLES MATRIX (CANDIDATE WORKFORCE SPECIFICATION)", c),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.verified_user, size: 16, color: c.green),
                      const SizedBox(width: 6),
                      Text("Active Scope Assignment", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: c.green.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: c.green.withOpacity(0.3)),
                    ),
                    child: Text("Candidate Aligned", style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.green)),
                  ),
                ],
              ),
              const Divider(height: 20),
              _scopeGridRow("Role / Cadre", "Field Worker (Karyakarta)", c),
              _scopeGridRow("Constituency", "215 - Kasba Peth Assembly", c),
              _scopeGridRow("Booth Number", "Booth #101, #102, #103", c),
              _scopeGridRow("Serial Number Range", "Part 101: 001-450\nPart 102: 001-380\nPart 103: 001-310", c),
              _scopeGridRow("Assigned Sector / Station", "Prabhaag 18 - Shaniwar Peth", c),
              _scopeGridRow("Authorization Status", "Active & Cadre Assigned", c, statusColor: c.green),
            ],
          ),
        ),

        const SizedBox(height: 16),
        _sectionTitle("APPLICATION & HARDWARE BINDING", c),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            children: [
              _infoRow("Device Hardware UUID", "HW-X889-PUNE-2026", c),
              _infoRow("Local SQLite Cache", "1,240 records (4.2 MB)", c),
              _infoRow("Active Theme Mode", isDark ? "Dark (Obsidian)" : "Light (Daylight)", c),
            ],
          ),
        ),

        const SizedBox(height: 16),
        _sectionTitle("CONTROLS & TESTING", c),
        ListTile(
          tileColor: c.cardBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          leading: Icon(isDark ? Icons.light_mode : Icons.dark_mode, color: c.amber),
          title: Text("Toggle Dark / Light Theme", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
          subtitle: Text("Switch between high-contrast daylight & night theme", style: TextStyle(fontSize: 10, color: c.textSecondary)),
          onTap: onToggleTheme,
        ),

        const SizedBox(height: 12),
        ListTile(
          tileColor: c.cardBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          leading: Icon(Icons.auto_awesome_rounded, color: isAiEnabled ? c.purple : c.textSecondary),
          title: Text("Indic AI Field Assistant", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
          subtitle: Text(
            isAiEnabled ? "Enabled by Candidate Admin (Copilot Active)" : "Disabled by Candidate Admin (Copilot Hidden)",
            style: TextStyle(fontSize: 10, color: isAiEnabled ? c.green : c.red),
          ),
          trailing: Switch(
            value: isAiEnabled,
            activeColor: c.primary,
            onChanged: (val) => onToggleAi(),
          ),
        ),

        const SizedBox(height: 12),
        ElevatedButton.icon(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(backgroundColor: Colors.green, content: Text("SQLite cache synced with Candidate War Room!")),
            );
          },
          icon: const Icon(Icons.sync, color: Colors.white),
          label: const Text("Force Cloud Synchronization", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          style: ElevatedButton.styleFrom(
            backgroundColor: c.primary,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),

        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: onLogout,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red.shade900,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Text("Unlink Device & Sign Out", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  Widget _sectionTitle(String title, AppThemeColors c) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(title, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1.1)),
    );
  }

  Widget _infoRow(String label, String value, AppThemeColors c) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: c.textSecondary)),
          Text(value, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textPrimary)),
        ],
      ),
    );
  }

  Widget _scopeGridRow(String label, String value, AppThemeColors c, {Color? statusColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label,
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: c.textSecondary),
            ),
          ),
          const Text(": ", style: TextStyle(fontSize: 11, color: Colors.grey)),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: statusColor ?? c.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ==============================================================================
// 10. QA VERIFICATION SCREENS (PENDING APPROVAL & BLOCKED COMPLIANCE SCREENS)
// ==============================================================================
class PendingApprovalScreen extends StatelessWidget {
  final bool isDark;
  final VoidCallback onSwitchToActive;

  const PendingApprovalScreen({super.key, required this.isDark, required this.onSwitchToActive});

  @override
  Widget build(BuildContext context) {
    final c = AppThemeColors(isDark);
    return Scaffold(
      backgroundColor: c.scaffoldBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Icon(Icons.hourglass_empty_rounded, size: 64, color: c.amber),
              const SizedBox(height: 16),
              Text(
                "Account Pending Verification",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: c.textPrimary),
              ),
              const SizedBox(height: 8),
              Text(
                "Your registration for Kasba Peth Assembly is awaiting approval from Candidate Anand Shinde's RO Office.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: c.textSecondary),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: onSwitchToActive,
                style: ElevatedButton.styleFrom(
                  backgroundColor: c.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text("Switch to Active (Client Demo Mode)", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class BlockedAccountScreen extends StatelessWidget {
  final bool isDark;
  final VoidCallback onSwitchToActive;

  const BlockedAccountScreen({super.key, required this.isDark, required this.onSwitchToActive});

  @override
  Widget build(BuildContext context) {
    final c = AppThemeColors(isDark);
    return Scaffold(
      backgroundColor: c.scaffoldBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Icon(Icons.block_rounded, size: 64, color: c.red),
              const SizedBox(height: 16),
              Text(
                "Cadre Account Blocked",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: c.textPrimary),
              ),
              const SizedBox(height: 8),
              Text(
                "This device has been temporarily suspended due to ECI audit verification. Contact the Central War Room.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: c.textSecondary),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: onSwitchToActive,
                style: ElevatedButton.styleFrom(
                  backgroundColor: c.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text("Restore Active Status (Client Demo Mode)", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ==============================================================================
// 11. VOTER SEARCH SCREEN & CENTRAL VOTER PROFILE / DOSSIER
// ==============================================================================
class VoterSearchScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<VoterItem> voters;
  final List<VoterItem> allVoters;
  final List<IssueItem> issues;
  final List<SlipHistoryItem> slipHistory;
  final String activeFilter;
  final VoidCallback onResetFilter;
  final Function(VoterItem) onVoterUpdated;
  final VoidCallback onOpenAdvancedFilter;
  final Function(ActivityItem)? onAddActivity;
  final Function(SlipHistoryItem)? onAddSlip;
  final Function(IssueItem)? onAddIssue;

  const VoterSearchScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voters,
    required this.allVoters,
    required this.issues,
    required this.slipHistory,
    required this.activeFilter,
    required this.onResetFilter,
    required this.onVoterUpdated,
    required this.onOpenAdvancedFilter,
    this.onAddActivity,
    this.onAddSlip,
    this.onAddIssue,
  });

  @override
  State<VoterSearchScreen> createState() => _VoterSearchScreenState();
}

class _VoterSearchScreenState extends State<VoterSearchScreen> {
  String _searchQuery = "";

  void _openDossier(VoterItem v) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CentralVoterDossierScreen(
          c: widget.c,
          isDark: widget.isDark,
          voter: v,
          allVoters: widget.allVoters,
          issues: widget.issues,
          slipHistory: widget.slipHistory,
          onVoterUpdated: widget.onVoterUpdated,
          onAddActivity: widget.onAddActivity,
          onAddSlip: widget.onAddSlip,
          onAddIssue: widget.onAddIssue,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final displayList = widget.voters.where((v) {
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return v.name.toLowerCase().contains(q) ||
          v.marathiName.contains(q) ||
          v.epicId.toLowerCase().contains(q) ||
          v.houseNo.contains(q) ||
          v.phone.contains(q);
    }).toList();

    return Column(
      children: [
        // 1. Search Bar & Filter Header
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: TextStyle(color: c.textPrimary, fontSize: 13),
                  decoration: InputDecoration(
                    hintText: "Search Name, मराठी, EPIC, House, Phone...",
                    hintStyle: TextStyle(color: c.textSecondary, fontSize: 12),
                    prefixIcon: Icon(Icons.search, size: 20, color: c.textSecondary),
                    filled: true,
                    fillColor: c.cardBg,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: c.borderColor)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: c.borderColor)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: Icon(Icons.tune_rounded, color: c.primary),
                tooltip: "Open Advanced Filters",
                onPressed: widget.onOpenAdvancedFilter,
              ),
            ],
          ),
        ),

        // 2. Prominent Total Voter Count Banner
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: c.borderColor),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Showing ${displayList.length} of ${widget.voters.length} Allocated Electors",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5, color: c.textPrimary),
              ),
              if (widget.activeFilter != "all")
                InkWell(
                  onTap: widget.onResetFilter,
                  child: Text(
                    "Reset (${widget.activeFilter})",
                    style: TextStyle(color: c.primary, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 4),

        // 3. Structured Voter Cards List
        Expanded(
          child: displayList.isNotEmpty
              ? ListView.builder(
                  itemCount: displayList.length,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  itemBuilder: (context, idx) {
                    final v = displayList[idx];
                    Color pillColor = Colors.grey;
                    if (v.classification == "Supporter") pillColor = c.green;
                    if (v.classification == "Doubtful") pillColor = c.amber;
                    if (v.classification == "Opponent") pillColor = c.red;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      decoration: BoxDecoration(
                        color: c.cardBg,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: c.borderColor),
                      ),
                      child: InkWell(
                        onTap: () => _openDossier(v),
                        borderRadius: BorderRadius.circular(14),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Row 1: Name, Badges & 3-Dot Menu
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Row(
                                      children: [
                                        Flexible(
                                          child: Text(
                                            v.name,
                                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: c.textPrimary),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                                          decoration: BoxDecoration(
                                            color: c.primary.withOpacity(0.12),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            "${v.gender} • ${v.age}",
                                            style: TextStyle(color: c.primary, fontSize: 9, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: pillColor.withOpacity(0.18),
                                          borderRadius: BorderRadius.circular(6),
                                          border: Border.all(color: pillColor),
                                        ),
                                        child: Text(
                                          v.classification,
                                          style: TextStyle(color: pillColor, fontSize: 8.5, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      const SizedBox(width: 4),
                                      PopupMenuButton<String>(
                                        icon: Icon(Icons.more_vert, size: 18, color: c.textSecondary),
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(),
                                        onSelected: (action) {
                                          if (action == "dossier" || action == "survey") {
                                            _openDossier(v);
                                          } else if (action == "call") {
                                            ScaffoldMessenger.of(context).showSnackBar(
                                              SnackBar(content: Text("Calling ${v.name} (${v.phone})...")),
                                            );
                                          } else if (action == "whatsapp") {
                                            ScaffoldMessenger.of(context).showSnackBar(
                                              SnackBar(content: Text("Dispatching WhatsApp Voter Slip to ${v.name}...")),
                                            );
                                          } else if (action == "print") {
                                            ScaffoldMessenger.of(context).showSnackBar(
                                              SnackBar(content: Text("Printing thermal slip for ${v.name}...")),
                                            );
                                          }
                                        },
                                        itemBuilder: (ctx) => [
                                          const PopupMenuItem(
                                            value: "dossier",
                                            child: Row(
                                              children: [
                                                Icon(Icons.badge_outlined, size: 16),
                                                SizedBox(width: 8),
                                                Text("Open Central Dossier", style: TextStyle(fontSize: 12)),
                                              ],
                                            ),
                                          ),
                                          const PopupMenuItem(
                                            value: "survey",
                                            child: Row(
                                              children: [
                                                Icon(Icons.assignment_turned_in_rounded, size: 16),
                                                SizedBox(width: 8),
                                                Text("Doorstep Survey & Stance", style: TextStyle(fontSize: 12)),
                                              ],
                                            ),
                                          ),
                                          const PopupMenuItem(
                                            value: "call",
                                            child: Row(
                                              children: [
                                                Icon(Icons.phone_rounded, size: 16),
                                                SizedBox(width: 8),
                                                Text("Call Voter", style: TextStyle(fontSize: 12)),
                                              ],
                                            ),
                                          ),
                                          const PopupMenuItem(
                                            value: "whatsapp",
                                            child: Row(
                                              children: [
                                                Icon(Icons.chat_bubble_outline_rounded, size: 16),
                                                SizedBox(width: 8),
                                                Text("WhatsApp Slip", style: TextStyle(fontSize: 12)),
                                              ],
                                            ),
                                          ),
                                          const PopupMenuItem(
                                            value: "print",
                                            child: Row(
                                              children: [
                                                Icon(Icons.print_rounded, size: 16),
                                                SizedBox(width: 8),
                                                Text("Print Thermal Slip", style: TextStyle(fontSize: 12)),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              Text(v.marathiName, style: TextStyle(fontSize: 11, color: c.textSecondary)),
                              const SizedBox(height: 6),
                              // Row 2: EPIC, Booth, House No
                              Text(
                                "EPIC: ${v.epicId}  •  Booth #${v.boothNo}  •  H.No ${v.houseNo}",
                                style: TextStyle(fontSize: 10, color: c.textSecondary),
                              ),
                              const SizedBox(height: 4),
                              // Row 3: Phone & Doorstep status
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "📞 ${v.phone.isNotEmpty ? v.phone : 'Not Registered'}",
                                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: c.primary),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: (v.isVisited ? c.green : c.amber).withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      v.isVisited ? "✓ Doorstep Survey Done" : "⏳ Survey Pending",
                                      style: TextStyle(
                                        fontSize: 8.5,
                                        fontWeight: FontWeight.bold,
                                        color: v.isVisited ? c.green : c.amber,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                )
              : Center(
                  child: Text("No matching voters found.", style: TextStyle(color: c.textSecondary, fontSize: 12)),
                ),
        ),
      ],
    );
  }
}

// ==============================================================================
// CENTRAL VOTER PROFILE / DOSSIER (UNIFIED SINGLE-SCREEN ARCHITECTURE)
// ==============================================================================
class CentralVoterDossierScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final VoterItem voter;
  final List<VoterItem> allVoters;
  final List<IssueItem> issues;
  final List<SlipHistoryItem> slipHistory;
  final Function(VoterItem) onVoterUpdated;
  final Function(ActivityItem)? onAddActivity;
  final Function(SlipHistoryItem)? onAddSlip;
  final Function(IssueItem)? onAddIssue;

  const CentralVoterDossierScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voter,
    required this.allVoters,
    required this.issues,
    required this.slipHistory,
    required this.onVoterUpdated,
    this.onAddActivity,
    this.onAddSlip,
    this.onAddIssue,
  });

  @override
  State<CentralVoterDossierScreen> createState() => _CentralVoterDossierScreenState();
}

class _CentralVoterDossierScreenState extends State<CentralVoterDossierScreen> {
  late VoterItem _voter;
  late TextEditingController _surveyNotesController;
  late TextEditingController _proposeEditController;
  late String _selectedScheme;
  bool _isStar = false;

  @override
  void initState() {
    super.initState();
    _voter = widget.voter;
    _surveyNotesController = TextEditingController(text: _voter.surveyFeedback);
    _proposeEditController = TextEditingController();
    _selectedScheme = _voter.scheme.isNotEmpty ? _voter.scheme : "Ladki Bahin Yojana";
    _isStar = _voter.isImportant;
  }

  @override
  void dispose() {
    _surveyNotesController.dispose();
    _proposeEditController.dispose();
    super.dispose();
  }

  void _updateStance(String stance) {
    setState(() {
      _voter.classification = stance;
    });
    widget.onVoterUpdated(_voter);
    widget.onAddActivity?.call(
      ActivityItem(
        title: "Voter Stance Updated",
        target: "${_voter.name} (${_voter.epicId})",
        timestamp: "Just Now",
        status: "SUCCESS",
        details: "Stance classified as $stance",
        icon: Icons.how_to_vote_rounded,
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: widget.c.primary,
        content: Text("Stance updated: $stance (Saved to master record)"),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _submitDoorstepSurvey() {
    setState(() {
      _voter.isVisited = true;
      _voter.surveyFeedback = _surveyNotesController.text.trim();
      _voter.surveyTimestamp = "Today (GPS Geotagged)";
    });
    widget.onVoterUpdated(_voter);
    widget.onAddActivity?.call(
      ActivityItem(
        title: "Doorstep Survey Recorded",
        target: "${_voter.name} (${_voter.epicId})",
        timestamp: "Just Now",
        status: "SUCCESS",
        details: "Scheme: $_selectedScheme | Notes: ${_voter.surveyFeedback.isNotEmpty ? _voter.surveyFeedback : 'None'} | Geotag: Lat 18.5204° N, Long 73.8567° E",
        icon: Icons.verified_rounded,
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: Color(0xFF10B981),
        content: Row(
          children: [
            Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
            SizedBox(width: 8),
            Expanded(
              child: Text(
                "✓ Doorstep Survey successfully saved to central master database with GPS geotag!",
                style: TextStyle(color: Colors.white, fontSize: 11.5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _markAsVoted() {
    final c = widget.c;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: c.cardBg,
        title: Row(
          children: [
            Icon(Icons.how_to_vote_rounded, color: c.green, size: 22),
            const SizedBox(width: 8),
            Text("Confirm Voter Turnout", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary)),
          ],
        ),
        content: Text(
          "Are you sure you want to mark ${_voter.name} (${_voter.epicId}) as VOTED at Booth #${_voter.boothNo}?\n\n• Live voting timestamp will be logged.\n• Turnout percentage will update automatically in War Room.",
          style: TextStyle(fontSize: 12, color: c.textSecondary),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              final nowTime = "Today, 11:20 AM";
              setState(() {
                _voter.hasVoted = true;
                _voter.votedAt = nowTime;
                _voter.votedBy = "Karyakarta (Field Cadre)";
                _voter.votingAuditTrail.add({
                  "status": "VOTED",
                  "timestamp": nowTime,
                  "updatedBy": "Karyakarta (Field Cadre)",
                  "reason": "Polling Booth Slip Verification",
                });
              });
              widget.onVoterUpdated(_voter);
              widget.onAddActivity?.call(
                ActivityItem(
                  title: "Turnout Recorded: Voted",
                  target: "${_voter.name} (${_voter.epicId})",
                  timestamp: "Just Now",
                  status: "SUCCESS",
                  details: "Marked as Voted at Booth #${_voter.boothNo}. Synced to Live Polling Engine.",
                  icon: Icons.how_to_vote_rounded,
                ),
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: c.green,
                  content: Text("✓ ${_voter.name} marked as VOTED! Synced to Live Polling Engine."),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: c.green),
            child: const Text("Yes, Mark Voted", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _correctVotingStatus() {
    final c = widget.c;
    String selectedReason = "Wrong EPIC verified at booth";
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: c.cardBg,
          title: Row(
            children: [
              Icon(Icons.history_rounded, color: c.amber, size: 22),
              const SizedBox(width: 8),
              Text("Correct Turnout Status", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Select verification justification to revert voting record for ${_voter.name}:",
                style: TextStyle(fontSize: 12, color: c.textSecondary),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: selectedReason,
                dropdownColor: c.cardBg,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: c.scaffoldBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                ),
                items: [
                  "Wrong EPIC verified at booth",
                  "Clerical / double-entry mistake",
                  "Elector left before ballot casting",
                  "Presiding officer correction",
                ].map((r) => DropdownMenuItem(value: r, child: Text(r, style: TextStyle(fontSize: 11, color: c.textPrimary)))).toList(),
                onChanged: (val) {
                  if (val != null) setDialogState(() => selectedReason = val);
                },
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                final nowTime = "Today, 11:35 AM";
                setState(() {
                  _voter.hasVoted = false;
                  _voter.votedAt = null;
                  _voter.votingAuditTrail.add({
                    "status": "NOT_VOTED",
                    "timestamp": nowTime,
                    "updatedBy": "Karyakarta (Field Cadre)",
                    "reason": selectedReason,
                  });
                });
                widget.onVoterUpdated(_voter);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: c.amber,
                    content: Text("Turnout status reverted for ${_voter.name}. Audit log updated."),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: c.amber),
              child: const Text("Revert Status", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddressModal() {
    final c = widget.c;
    showModalBottomSheet(
      context: context,
      backgroundColor: c.cardBg,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.location_on_rounded, color: c.primary, size: 22),
                    const SizedBox(width: 8),
                    Text("Structural House Address & GPS", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: c.textPrimary)),
                  ],
                ),
                IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(ctx)),
              ],
            ),
            const Divider(height: 18),
            _infoRow("House / Tenement No.", "#${_voter.houseNo}, Lane 4", c),
            _infoRow("Building / Chawl", "Shree Ganesh Krupa Niwas", c),
            _infoRow("Street & Area", "Shaniwar Peth, Near Wada Gate", c),
            _infoRow("Assembly & Ward", "215 - Kasba Peth (Ward 18)", c),
            _infoRow("Pincode", "Pune - 411030", c),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: c.primary.withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: c.primary.withOpacity(0.2)),
              ),
              child: Row(
                children: [
                  Icon(Icons.gps_fixed_rounded, size: 16, color: c.primary),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "GPS Coordinates: 18.52043° N, 73.85674° E (Accuracy: ±2.4m)",
                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.primary),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Address copied to clipboard.")));
                    },
                    icon: const Icon(Icons.copy_rounded, size: 14),
                    label: const Text("Copy Address"),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(backgroundColor: c.primary, content: Text("Launching Google Maps directions for ${_voter.name}...")));
                    },
                    icon: const Icon(Icons.navigation_rounded, size: 14, color: Colors.white),
                    label: const Text("Navigate (GPS)", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(backgroundColor: c.primary),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _dispatchSlip(String channel) {
    widget.onAddSlip?.call(
      SlipHistoryItem(
        voterName: _voter.name,
        marathiName: _voter.marathiName,
        boothNo: _voter.boothNo,
        epicId: _voter.epicId,
        timestamp: "Just Now",
        mode: channel,
        serialNo: _voter.serialNo,
        status: channel.contains("Thermal") ? "Printed" : "Delivered",
      ),
    );
    widget.onAddActivity?.call(
      ActivityItem(
        title: channel.contains("Thermal") ? "Thermal Slip Printed" : "WhatsApp Slip Sent",
        target: "${_voter.name} (${_voter.epicId})",
        timestamp: "Just Now",
        status: "SUCCESS",
        details: "Dispatched via $channel for Booth #${_voter.boothNo}",
        icon: channel.contains("Thermal") ? Icons.print : Icons.chat_bubble_outline,
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF10B981),
        content: Text("✓ Voter Slip successfully dispatched via $channel to ${_voter.name}!"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final family = widget.allVoters.where((v) => v.houseNo == _voter.houseNo && v.id != _voter.id).toList();
    final voterSlips = widget.slipHistory.where((s) => s.epicId == _voter.epicId || s.voterName == _voter.name).toList();
    final voterIssues = widget.issues.where((i) => i.citizenName.toLowerCase().contains(_voter.name.toLowerCase())).toList();

    Color stanceColor = Colors.grey;
    if (_voter.classification == "Supporter") stanceColor = c.green;
    if (_voter.classification == "Doubtful") stanceColor = c.amber;
    if (_voter.classification == "Opponent") stanceColor = c.red;

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        backgroundColor: c.cardBg,
        elevation: 0.5,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: c.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Central Voter Dossier",
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Assembly 215 - Kasba Peth • Serial #${_voter.serialNo}",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(_isStar ? Icons.star_rounded : Icons.star_border_rounded, color: _isStar ? Colors.amber : c.textSecondary),
            tooltip: "Bookmark Voter",
            onPressed: () {
              setState(() {
                _isStar = !_isStar;
                _voter.isImportant = _isStar;
              });
              widget.onVoterUpdated(_voter);
            },
          ),
          IconButton(
            icon: Icon(Icons.share_rounded, size: 20, color: c.textSecondary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Sharing voter dossier card...")));
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          // 1. HERO VITALS CARD
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _voter.name,
                            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: c.textPrimary),
                          ),
                          Text(
                            _voter.marathiName,
                            style: TextStyle(fontSize: 12, color: c.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: stanceColor.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: stanceColor.withOpacity(0.5)),
                      ),
                      child: Text(
                        _voter.classification,
                        style: TextStyle(color: stanceColor, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _vitalTag("${_voter.gender} • ${_voter.age} Yrs", c),
                    const SizedBox(width: 6),
                    _vitalTag("Booth #${_voter.boothNo}", c),
                    const SizedBox(width: 6),
                    _vitalTag("H.No #${_voter.houseNo}", c),
                    const SizedBox(width: 6),
                    _vitalTag(_voter.caste, c),
                  ],
                ),
                const Divider(height: 20),
                _infoRow("Voter ID (EPIC)", _voter.epicId, c, isBold: true),
                _infoRow("Primary Contact", _voter.phone.isNotEmpty ? _voter.phone : "Not Registered", c),
                _infoRow("Doorstep Visit", _voter.isVisited ? "✓ Completed (Geotagged)" : "⏳ Visit Pending", c, color: _voter.isVisited ? c.green : c.amber),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: _showAddressModal,
                    icon: Icon(Icons.location_on_rounded, size: 16, color: c.primary),
                    label: Text("House Address & GPS Telemetry", style: TextStyle(color: c.primary, fontWeight: FontWeight.bold, fontSize: 11.5)),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      side: BorderSide(color: c.primary.withOpacity(0.4)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // ELECTION DAY POLLING DAY TURNOUT CALLOUT (LPIANE)
          Container(
            margin: const EdgeInsets.only(top: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: _voter.hasVoted ? c.green.withOpacity(0.08) : c.amber.withOpacity(0.08),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: _voter.hasVoted ? c.green.withOpacity(0.4) : c.amber.withOpacity(0.4)),
            ),
            child: Row(
              children: [
                Icon(
                  _voter.hasVoted ? Icons.check_circle_rounded : Icons.how_to_vote_rounded,
                  color: _voter.hasVoted ? c.green : c.amber,
                  size: 24,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _voter.hasVoted ? "VOTED (मतदान पूर्ण)" : "NOT VOTED (मतदान बाकी)",
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.bold,
                          color: _voter.hasVoted ? c.green : c.amber,
                        ),
                      ),
                      Text(
                        _voter.hasVoted
                            ? "Recorded: ${_voter.votedAt ?? 'Today'} by ${_voter.votedBy ?? 'Cadre'}"
                            : "Elector has not yet cast their vote at Booth #${_voter.boothNo}",
                        style: TextStyle(fontSize: 10, color: c.textSecondary),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                if (!_voter.hasVoted)
                  ElevatedButton.icon(
                    onPressed: _markAsVoted,
                    icon: const Icon(Icons.touch_app_rounded, size: 14),
                    label: const Text("Mark Voted", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: c.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  )
                else
                  OutlinedButton.icon(
                    onPressed: _correctVotingStatus,
                    icon: const Icon(Icons.history_rounded, size: 13),
                    label: const Text("Correct", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: c.amber,
                      side: BorderSide(color: c.amber),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // 2. QUICK ACTIONS BAR
          Row(
            children: [
              _actionSquare("Call", Icons.phone_rounded, c.primary, () {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Calling ${_voter.name} (${_voter.phone})...")));
              }, c),
              const SizedBox(width: 8),
              _actionSquare("WhatsApp", Icons.chat_bubble_outline_rounded, const Color(0xFF10B981), () => _dispatchSlip("WhatsApp Digital"), c),
              const SizedBox(width: 8),
              _actionSquare("Thermal Print", Icons.print_rounded, const Color(0xFF6366F1), () => _dispatchSlip("Thermal Printed (58mm)"), c),
              const SizedBox(width: 8),
              _actionSquare("Location", Icons.directions_rounded, Colors.orange, _showAddressModal, c),
            ],
          ),

          const SizedBox(height: 16),

          // 3. POLITICAL STANCE / INCLINATION CLASSIFICATION
          _sectionHeader("POLITICAL STANCE & VOTER INCLINATION", c),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Tap to update voter stance against master electoral database:",
                  style: TextStyle(fontSize: 11, color: c.textSecondary),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    _stanceChip("Supporter", c.green, () => _updateStance("Supporter")),
                    _stanceChip("Doubtful", c.amber, () => _updateStance("Doubtful")),
                    _stanceChip("Opponent", c.red, () => _updateStance("Opponent")),
                    _stanceChip("Neutral", Colors.grey, () => _updateStance("Neutral")),
                    _stanceChip("Undecided", c.purple, () => _updateStance("Undecided")),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // 4. INTEGRATED DOORSTEP SURVEY SECTION (CORE CLIENT REQUIREMENT)
          _sectionHeader("INTEGRATED DOORSTEP SURVEY & FIELD FEEDBACK", c),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: _voter.isVisited ? c.green.withOpacity(0.5) : c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Doorstep Survey Status",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: (_voter.isVisited ? c.green : c.amber).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        _voter.isVisited ? "✓ Completed (Geotagged)" : "Visit Pending",
                        style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: _voter.isVisited ? c.green : c.amber),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  "Key Welfare Scheme Beneficiary:",
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textSecondary),
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  value: _selectedScheme,
                  items: [
                    "Ladki Bahin Yojana",
                    "PM Awas Yojana",
                    "Ayushman Bharat Health Card",
                    "Kisan Samman Nidhi",
                    "Senior Citizen Pension",
                    "None / General Electorate",
                  ].map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 12)))).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedScheme = val);
                  },
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  "Voter Stance Notes & Local Issues Feedback:",
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textSecondary),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _surveyNotesController,
                  maxLines: 3,
                  style: TextStyle(fontSize: 12, color: c.textPrimary),
                  decoration: InputDecoration(
                    hintText: "Enter doorstep feedback, civic demands, or voting inclination factors...",
                    hintStyle: TextStyle(fontSize: 11, color: c.textSecondary),
                    contentPadding: const EdgeInsets.all(12),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                  ),
                ),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _submitDoorstepSurvey,
                    icon: const Icon(Icons.check_circle_rounded, size: 16, color: Colors.white),
                    label: Text(
                      _voter.isVisited ? "Update Doorstep Survey (GPS Commited)" : "Submit Doorstep Survey & Record Geotag",
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11.5),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: c.primary,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // 5. HOUSEHOLD & FAMILY TREE SECTION
          _sectionHeader("FAMILY TREE & HOUSEHOLD (HOUSE #${_voter.houseNo})", c),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: family.isNotEmpty
                ? Column(
                    children: family.map((m) {
                      Color fStance = Colors.grey;
                      if (m.classification == "Supporter") fStance = c.green;
                      if (m.classification == "Doubtful") fStance = c.amber;
                      if (m.classification == "Opponent") fStance = c.red;

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(m.name, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                                Text("${m.marathiName} • ${m.gender}, ${m.age} Yrs", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: fStance.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(m.classification, style: TextStyle(color: fStance, fontSize: 9, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  )
                : Text("Single voter registered at this address.", style: TextStyle(color: c.textSecondary, fontSize: 11)),
          ),

          const SizedBox(height: 16),

          // 6. OFFICIAL ECI VOTER SLIP ACTIONS & LOGS
          _sectionHeader("OFFICIAL ECI VOTER SLIP ACTIONS & LOGS", c),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Slip Preview Chit
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: c.scaffoldBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: c.borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Text(
                          "ECI VOTER INFORMATION SLIP (मतदार माहिती पावती)",
                          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.primary, letterSpacing: 0.5),
                        ),
                      ),
                      const Divider(height: 14),
                      Text("Elector Name: ${_voter.name}", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5, color: c.textPrimary)),
                      Text("नाव: ${_voter.marathiName}", style: TextStyle(fontSize: 11, color: c.textSecondary)),
                      Text("EPIC No: ${_voter.epicId}", style: TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, fontSize: 11, color: c.primary)),
                      Text("Part / Booth No: ${_voter.boothNo} • Serial No: ${_voter.serialNo}", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                      Text("Polling Station: Kasba Peth Central School", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => _dispatchSlip("WhatsApp Digital"),
                        icon: const Icon(Icons.chat_bubble_outline_rounded, size: 14, color: Colors.white),
                        label: const Text("WhatsApp Slip", style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => _dispatchSlip("Thermal Printed (58mm)"),
                        icon: const Icon(Icons.print_rounded, size: 14, color: Colors.white),
                        label: const Text("Thermal Print", style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
                      ),
                    ),
                  ],
                ),
                if (voterSlips.isNotEmpty) ...[
                  const Divider(height: 20),
                  Text("Past Dispatched Slips:", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textSecondary)),
                  const SizedBox(height: 6),
                  ...voterSlips.map((s) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 3),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text("${s.mode} • ${s.timestamp}", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                            Text("✓ ${s.status}", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.green)),
                          ],
                        ),
                      )),
                ],
              ],
            ),
          ),

          const SizedBox(height: 16),

          // 7. CIVIC GRIEVANCES & TICKETS
          _sectionHeader("REPORTED ISSUES & TICKETS", c),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (voterIssues.isNotEmpty)
                  ...voterIssues.map((iss) => ListTile(
                        dense: true,
                        contentPadding: EdgeInsets.zero,
                        leading: Icon(Icons.report_problem, color: c.red, size: 18),
                        title: Text(iss.title, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: c.textPrimary)),
                        subtitle: Text("${iss.category} • Status: ${iss.status}", style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
                      ))
                else
                  Text("No open grievance tickets logged for this elector.", style: TextStyle(fontSize: 11, color: c.textSecondary)),
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  onPressed: () {
                    final titCtrl = TextEditingController();
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        backgroundColor: c.cardBg,
                        title: Text("Log Field Grievance", style: TextStyle(color: c.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
                        content: TextField(
                          controller: titCtrl,
                          decoration: InputDecoration(
                            hintText: "Issue description (e.g. water pipeline leakage, ration card renewal)...",
                            hintStyle: TextStyle(fontSize: 11, color: c.textSecondary),
                          ),
                        ),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
                          ElevatedButton(
                            onPressed: () {
                              if (titCtrl.text.trim().isNotEmpty) {
                                widget.onAddIssue?.call(
                                  IssueItem(
                                    id: "iss-${DateTime.now().millisecondsSinceEpoch}",
                                    title: titCtrl.text.trim(),
                                    citizenName: _voter.name,
                                    category: "Civic / Municipal",
                                    priority: "Medium",
                                    status: "Open",
                                    boothNo: _voter.boothNo,
                                    date: "Today",
                                  ),
                                );
                                Navigator.pop(ctx);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(backgroundColor: Colors.green, content: Text("Grievance ticket logged & synced!")),
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(backgroundColor: c.primary),
                            child: const Text("Submit Ticket", style: TextStyle(color: Colors.white)),
                          ),
                        ],
                      ),
                    );
                  },
                  icon: const Icon(Icons.add, size: 14),
                  label: const Text("Report New Field Issue", style: TextStyle(fontSize: 11)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // 8. PROPOSE CORRECTIONS (WAR ROOM QUARANTINE)
          _sectionHeader("PROPOSE CORRECTIONS (WAR ROOM QUARANTINE)", c),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Report voter shift, deceased status, or phone corrections to Candidate War Room:",
                  style: TextStyle(fontSize: 11, color: c.textSecondary),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _proposeEditController,
                  style: TextStyle(fontSize: 12, color: c.textPrimary),
                  decoration: InputDecoration(
                    hintText: "e.g. Correct mobile number is +91 98220 99881; shifted to Lane 5...",
                    hintStyle: TextStyle(fontSize: 11, color: c.textSecondary),
                    contentPadding: const EdgeInsets.all(10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: c.borderColor)),
                  ),
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () {
                    if (_proposeEditController.text.trim().isNotEmpty) {
                      _proposeEditController.clear();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: Color(0xFF10B981),
                          content: Text("✓ Correction proposal submitted to Candidate War Room Quarantine!"),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: c.primary),
                  child: const Text("Propose to War Room Quarantine", style: TextStyle(color: Colors.white, fontSize: 11)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // 9. POLLING DAY AUDIT & TURNOUT HISTORY (LPIANE)
          _sectionHeader("POLLING DAY AUDIT & TURNOUT HISTORY (LPIANE)", c),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Turnout Status Audit Log", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: c.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(6)),
                      child: Text("ECI AUDIT SYNC", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: c.primary)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                if (_voter.votingAuditTrail.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text("No previous polling status modifications recorded. Standing ready.", style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: c.textSecondary)),
                  )
                else
                  ..._voter.votingAuditTrail.map((log) => Container(
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: c.scaffoldBg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: c.borderColor.withOpacity(0.6)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Status: ${log['status']} • ${log['reason'] ?? 'Turnout Record'}",
                              style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                            ),
                            Text(
                              "Updated by ${log['updatedBy']} • ${log['timestamp']}",
                              style: TextStyle(fontSize: 9.5, color: c.textSecondary),
                            ),
                          ],
                        ),
                        Icon(Icons.verified_user_rounded, size: 14, color: c.green),
                      ],
                    ),
                  )),
              ],
            ),
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _sectionHeader(String title, AppThemeColors c) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        title,
        style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 0.8),
      ),
    );
  }

  Widget _vitalTag(String text, AppThemeColors c) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
      decoration: BoxDecoration(
        color: c.primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.primary),
      ),
    );
  }

  Widget _stanceChip(String label, Color color, VoidCallback onTap) {
    final isSel = _voter.classification == label;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSel ? color : color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: isSel ? Colors.white : color,
          ),
        ),
      ),
    );
  }

  Widget _actionSquare(String label, IconData icon, Color color, VoidCallback onTap, AppThemeColors c) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            children: [
              Icon(icon, size: 18, color: color),
              const SizedBox(height: 4),
              Text(label, style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.textPrimary)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value, AppThemeColors c, {bool isBold = false, Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: c.textSecondary)),
          Text(
            value,
            style: TextStyle(
              fontSize: 11.5,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: color ?? c.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

// ==============================================================================
// 12. DOORSTEP SURVEY WIZARD
// ==============================================================================
class DoorstepSurveyScreen extends StatelessWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<VoterItem> voters;
  final Function(String, String) onSurveyComplete;
  final VoidCallback? onNavigateToVoters;

  const DoorstepSurveyScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voters,
    required this.onSurveyComplete,
    this.onNavigateToVoters,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: c.primary.withOpacity(0.08),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: c.primary.withOpacity(0.3)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.how_to_reg_rounded, color: c.primary, size: 22),
                  const SizedBox(width: 8),
                  Text(
                    "Integrated Doorstep Survey Workflow",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: c.textPrimary),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                "Per system guidelines, surveys are now integrated directly inside the Central Voter Profile for anti-tamper GPS geotagging. Select any voter from the list to record feedback and update stance.",
                style: TextStyle(fontSize: 11, color: c.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: onNavigateToVoters,
                icon: const Icon(Icons.search, size: 16, color: Colors.white),
                label: const Text("Open Total Voters List & Search", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                style: ElevatedButton.styleFrom(backgroundColor: c.primary),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Text("PENDING UNVISITED ELECTORS (${voters.length})", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textSecondary)),
        const SizedBox(height: 10),
        ...voters.map((v) {
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(v.name, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: c.textPrimary)),
                    Text("${v.marathiName} • H.No ${v.houseNo} • Booth #${v.boothNo}", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                  ],
                ),
                ElevatedButton(
                  onPressed: () {
                    onSurveyComplete(v.id, "Supporter");
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: c.primary),
                  child: const Text("Record Stance", style: TextStyle(color: Colors.white, fontSize: 11)),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}

// ==============================================================================
// 13. SLIPS PRINT & DISPATCH SCREEN
// ==============================================================================
class SlipsPrintScreen extends StatelessWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<VoterItem> voters;
  final Function(VoterItem, String) onSlipPrinted;

  const SlipsPrintScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voters,
    required this.onSlipPrinted,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        // Printer Status Card
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.primary.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Icon(Icons.print, color: c.primary),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("ESC/POS Bluetooth Thermal Printer", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: c.textPrimary)),
                  Text("● TP-5801 Connected (Paper: 58mm)", style: TextStyle(color: c.green, fontSize: 10)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Text("QUICK PRINT VOTING CHITS", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textSecondary)),
        const SizedBox(height: 10),

        ...voters.take(4).map((v) {
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(v.marathiName, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: c.textPrimary)),
                    Text("Booth #${v.boothNo} • EPIC: ${v.epicId}", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                  ],
                ),
                Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.print, color: c.primary),
                      onPressed: () {
                        onSlipPrinted(v, "Thermal Printed (58mm)");
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Slip sent to TP-5801 Bluetooth Printer for ${v.name}!")),
                        );
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.share, color: Color(0xFF25D366)),
                      onPressed: () {
                        onSlipPrinted(v, "WhatsApp Digital");
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("WhatsApp voter chit dispatched to ${v.phone}!")),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}

// ==============================================================================
// 14. INDIC AI FIELD ASSISTANT (POPULATED WITH SUGGESTED PROMPTS & REAL-TIME GROUND INTELLIGENCE)
// ==============================================================================
class IndicAiCopilotScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<VoterItem> voters;
  final VoidCallback onNavigateToVoters;
  final VoidCallback onLogout;

  const IndicAiCopilotScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voters,
    required this.onNavigateToVoters,
    required this.onLogout,
  });

  @override
  State<IndicAiCopilotScreen> createState() => _IndicAiCopilotScreenState();
}

class _IndicAiCopilotScreenState extends State<IndicAiCopilotScreen> {
  final TextEditingController _queryController = TextEditingController();
  List<VoterItem> _matchingResults = [];
  String _aiSummary = "";
  bool _hasSearched = false;

  final List<Map<String, String>> _suggestedPrompts = [
    {
      "title": "संशयित (Swing) मतदार",
      "prompt": "कस्बा पेठ मधील संशयित (Swing) मतदार दाखवा",
      "category": "Sentiment",
    },
    {
      "title": "लाडकी बहीण लाभार्थी",
      "prompt": "लाडकी बहीण योजनेचे लाभार्थी कोण आहेत?",
      "category": "Schemes",
    },
    {
      "title": "महिला बचत गट",
      "prompt": "महिला बचत गट मतदारांची यादी द्या",
      "category": "Community",
    },
    {
      "title": "आज भेट न दिलेले",
      "prompt": "आज भेट न दिलेल्या मतदारांची यादी दाखवा",
      "category": "Outreach",
    },
    {
      "title": "ज्येष्ठ नागरिक (६०+)",
      "prompt": "६० वर्षांवरील ज्येष्ठ मतदारांची यादी आणि फोन नंबर",
      "category": "Age Scope",
    },
    {
      "title": "Uncontacted Voters",
      "prompt": "Show voters in Booth 101 without phone numbers",
      "category": "Contact",
    },
    {
      "title": "Neutral Voters",
      "prompt": "Show neutral voters in Shaniwar Peth",
      "category": "Sentiment",
    },
    {
      "title": "58mm Slip Targets",
      "prompt": "Generate 58mm thermal slip delivery list",
      "category": "Slips",
    },
  ];

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  void _executeAiQuery(String query) {
    if (query.trim().isEmpty) return;
    final q = query.toLowerCase();
    List<VoterItem> results = [];
    String summary = "";

    if (q.contains("संशयित") || q.contains("swing") || q.contains("doubtful")) {
      results = widget.voters.where((v) => v.classification == "Doubtful").toList();
      summary = "संशयित (Doubtful / Swing) मतदार: ${results.length} मतदार आढळले. यांना विशेष भेट देण्याची आवश्यकता आहे.";
    } else if (q.contains("लाडकी बहीण") || q.contains("ladki") || q.contains("bahin")) {
      results = widget.voters.where((v) => v.scheme.toLowerCase().contains("ladki") || v.scheme.toLowerCase().contains("bahin")).toList();
      summary = "लाडकी बहीण योजना लाभार्थी: ${results.length} महिला मतदार आढळल्या.";
    } else if (q.contains("बचत गट") || q.contains("self-help") || q.contains("bachat")) {
      results = widget.voters.where((v) => v.communityGroup.toLowerCase().contains("self-help")).toList();
      summary = "महिला बचत गट (Self-Help Groups): ${results.length} मतदार आढळले.";
    } else if (q.contains("भेट न दिलेले") || q.contains("unvisited") || q.contains("not visited")) {
      results = widget.voters.where((v) => !v.isVisited).toList();
      summary = "अद्याप भेट न दिलेले (Pending Visits): ${results.length} मतदार शिल्लक आहेत.";
    } else if (q.contains("६०") || q.contains("60") || q.contains("ज्येष्ठ") || q.contains("senior")) {
      results = widget.voters.where((v) => v.age >= 60).toList();
      summary = "ज्येष्ठ नागरिक (६०+ वर्षे): ${results.length} मतदार सापडले.";
    } else if (q.contains("phone") || q.contains("number") || q.contains("without") || q.contains("फोन")) {
      results = widget.voters.where((v) => v.phone.isEmpty).toList();
      summary = "मोबाईल नंबर नसलेले मतदार: ${results.length} मतदार आढळले.";
    } else if (q.contains("neutral") || q.contains("तटस्थ")) {
      results = widget.voters.where((v) => v.classification == "Neutral").toList();
      summary = "तटस्थ (Neutral) मतदार: ${results.length} मतदार आढळले. मतपरिवर्तनासाठी प्राधान्य द्या.";
    } else if (q.contains("slip") || q.contains("thermal") || q.contains("पावती")) {
      results = widget.voters.where((v) => v.isVisited).toList();
      summary = "५८ मिमी थर्मल स्लिप वितरण यादी: ${results.length} मतदार तयार आहेत.";
    } else {
      results = widget.voters.where((v) =>
        v.name.toLowerCase().contains(q) ||
        v.marathiName.contains(query) ||
        v.epicId.toLowerCase().contains(q) ||
        v.caste.toLowerCase().contains(q) ||
        v.communityGroup.toLowerCase().contains(q)
      ).toList();
      summary = results.isNotEmpty
        ? "\"$query\" साठी ${results.length} मतदार आढळले."
        : "\"$query\" साठी कोणताही थेट मतदार आढळला नाही. सर्व मतदार दाखवत आहोत.";
      if (results.isEmpty) results = widget.voters;
    }

    setState(() {
      _queryController.text = query;
      _matchingResults = results;
      _aiSummary = summary;
      _hasSearched = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // AI Header Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: widget.isDark
                  ? [const Color(0xFF1E1B4B), const Color(0xFF0B1527)]
                  : [const Color(0xFFEDE9FE), Colors.white],
            ),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: widget.isDark ? const Color(0xFF4338CA) : const Color(0xFFC4B5FD)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: c.primary,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.auto_awesome, color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Indic Election AI Field Assistant", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary)),
                        Text("Marathi & English Ground Campaign Intelligence", style: TextStyle(fontSize: 11, color: c.primary, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                "कृत्रिम बुद्धिमत्ता (AI) द्वारे मतदार यादी, संशयित मतदार, योजना लाभार्थी आणि बूथ व्यवस्थापनाचे जलद विश्लेषण.",
                style: TextStyle(fontSize: 11, color: c.textSecondary, height: 1.4),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),
        // Search & Input bar
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _queryController,
                style: TextStyle(color: c.textPrimary, fontSize: 13),
                decoration: InputDecoration(
                  hintText: "उदा. संशयित मतदार, लाडकी बहीण लाभार्थी...",
                  hintStyle: TextStyle(color: c.textSecondary, fontSize: 11),
                  isDense: true,
                  filled: true,
                  fillColor: c.cardBg,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: c.borderColor),
                  ),
                  prefixIcon: Icon(Icons.psychology, size: 20, color: c.primary),
                  suffixIcon: _queryController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, size: 16),
                          onPressed: () {
                            _queryController.clear();
                            setState(() {
                              _hasSearched = false;
                              _matchingResults.clear();
                              _aiSummary = "";
                            });
                          },
                        )
                      : null,
                ),
                onSubmitted: _executeAiQuery,
              ),
            ),
            const SizedBox(width: 8),
            ElevatedButton(
              onPressed: () => _executeAiQuery(_queryController.text),
              style: ElevatedButton.styleFrom(
                backgroundColor: c.primary,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Icon(Icons.arrow_forward, color: Colors.white, size: 18),
            ),
          ],
        ),

        const SizedBox(height: 18),
        // Section Title: Suggested Prompts
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "SUGGESTED AI PROMPTS (क्लिक करा व शोधा)",
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 0.8),
            ),
            Text(
              "${_suggestedPrompts.length} Prompts",
              style: TextStyle(fontSize: 10, color: c.primary, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _suggestedPrompts.map((item) {
            return InkWell(
              onTap: () => _executeAiQuery(item["prompt"]!),
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: c.cardBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: c.borderColor),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.bolt, size: 14, color: c.amber),
                    const SizedBox(width: 4),
                    Text(
                      item["title"]!,
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),

        if (_hasSearched) ...[
          const SizedBox(height: 20),
          // AI Summary Box
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.primary.withOpacity(0.3)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.insights, size: 18, color: c.primary),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("AI Field Assessment", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.primary)),
                      const SizedBox(height: 4),
                      Text(_aiSummary, style: TextStyle(fontSize: 12, color: c.textPrimary, height: 1.3)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Matching Electors (${_matchingResults.length})",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary),
              ),
              TextButton(
                onPressed: widget.onNavigateToVoters,
                child: const Text("Open in Voters Directory →", style: TextStyle(fontSize: 11)),
              ),
            ],
          ),

          // Matching voters list
          ..._matchingResults.map((voter) {
            Color sentimentColor = c.textSecondary;
            if (voter.classification == "Supporter") sentimentColor = c.green;
            if (voter.classification == "Doubtful") sentimentColor = c.amber;
            if (voter.classification == "Opponent") sentimentColor = Colors.redAccent;
            if (voter.classification == "Neutral") sentimentColor = Colors.blueGrey;

            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: c.borderColor),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: sentimentColor.withOpacity(0.15),
                    child: Text(
                      voter.serialNo,
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: sentimentColor),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(voter.marathiName, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary)),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                              decoration: BoxDecoration(
                                color: sentimentColor.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(voter.classification, style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: sentimentColor)),
                            ),
                          ],
                        ),
                        Text("${voter.name} • Age ${voter.age} • ${voter.gender} • Booth #${voter.boothNo}", style: TextStyle(fontSize: 10.5, color: c.textSecondary)),
                        if (voter.scheme.isNotEmpty && voter.scheme != "None")
                          Text("योजना: ${voter.scheme} • ${voter.communityGroup}", style: TextStyle(fontSize: 10, color: c.primary, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                  if (voter.phone.isNotEmpty)
                    Icon(Icons.phone, size: 16, color: c.green),
                ],
              ),
            );
          }),
        ] else ...[
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              children: [
                Icon(Icons.lightbulb_outline, size: 32, color: c.amber),
                const SizedBox(height: 8),
                Text("How to use AI Field Assistant", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary)),
                const SizedBox(height: 4),
                Text(
                  "Tap any suggested prompt above or type your question in Marathi or English. The assistant will immediately segment your booth electors, identify swing clusters, filter government schemes, and prepare your daily outreach list.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 11, color: c.textSecondary, height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

// ==============================================================================
// 15. ACTIVATION SCREEN (HARDWARE BINDING LOCK)
// ==============================================================================
class ActivationScreen extends StatefulWidget {
  final bool isDark;
  final VoidCallback onActivated;
  final VoidCallback? onSwitchPortal;

  const ActivationScreen({
    super.key,
    required this.isDark,
    required this.onActivated,
    this.onSwitchPortal,
  });

  @override
  State<ActivationScreen> createState() => _ActivationScreenState();
}

class _ActivationScreenState extends State<ActivationScreen> {
  final _keyController = TextEditingController(text: "K9X2B7");
  final _phoneController = TextEditingController(text: "9822100001");

  @override
  void dispose() {
    _keyController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = AppThemeColors(widget.isDark);
    return Scaffold(
      backgroundColor: c.scaffoldBg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Back / Change Role Button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (widget.onSwitchPortal != null)
                    InkWell(
                      onTap: widget.onSwitchPortal,
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.arrow_back_rounded, size: 18, color: c.textSecondary),
                            const SizedBox(width: 4),
                            Text(
                              "Change Portal",
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: c.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    const SizedBox.shrink(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: c.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: c.primary.withOpacity(0.3)),
                    ),
                    child: Text(
                      "KARYAKARTA",
                      style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: c.primary, letterSpacing: 0.8),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              Center(
                child: Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF2563EB), Color(0xFF4F46E5), Color(0xFF9333EA)],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF2563EB).withOpacity(0.3),
                        blurRadius: 14,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      "IN",
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 28),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                "INDIATA Karyakarta",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: c.textPrimary),
              ),
              Text(
                "Field Cadre Outreach & Booth Command",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: c.textSecondary),
              ),
              const SizedBox(height: 32),
              Text("6-Character Activation Key", style: TextStyle(fontSize: 12, color: c.textSecondary)),
              const SizedBox(height: 6),
              TextField(
                controller: _keyController,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, letterSpacing: 4, fontWeight: FontWeight.bold, color: c.primary),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: c.cardBg,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: c.borderColor)),
                ),
              ),
              const SizedBox(height: 16),
              Text("Registered Mobile Number", style: TextStyle(fontSize: 12, color: c.textSecondary)),
              const SizedBox(height: 6),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                style: TextStyle(color: c.textPrimary, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: c.cardBg,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: c.borderColor)),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: widget.onActivated,
                style: ElevatedButton.styleFrom(
                  backgroundColor: c.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text(
                  "Verify & Activate App (प्रवेश करा)",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),

              if (widget.onSwitchPortal != null) ...[
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: widget.onSwitchPortal,
                  icon: const Icon(Icons.swap_horiz_rounded, size: 18),
                  label: const Text(
                    "Switch to Candidate Portal (उमेदवार पोर्टल निवडा)",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: c.primary,
                    side: BorderSide(color: c.borderColor, width: 1.2),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
