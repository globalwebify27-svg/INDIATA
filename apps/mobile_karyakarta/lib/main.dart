import 'package:flutter/material.dart';

void main() {
  runApp(const IndiataKaryakartaApp());
}

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
  ThemeMode _themeMode = ThemeMode.dark;

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
  String classification; // Supporter, Doubtful, Opponent, Neutral
  bool isVisited;
  bool isImportant;
  final String caste;
  final String scheme;

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
    required this.classification,
    this.isVisited = false,
    this.isImportant = false,
    this.caste = "Maratha",
    this.scheme = "Ladki Bahin Yojana",
  });
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

  SlipHistoryItem({
    required this.voterName,
    required this.marathiName,
    required this.boothNo,
    required this.epicId,
    required this.timestamp,
    required this.mode,
    required this.serialNo,
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

  const MainMobileScaffold({
    super.key,
    required this.themeMode,
    required this.onToggleTheme,
    required this.onSetTheme,
  });

  @override
  State<MainMobileScaffold> createState() => _MainMobileScaffoldState();
}

class _MainMobileScaffoldState extends State<MainMobileScaffold> {
  // Navigation & View Routing State
  String _currentView = "dashboard";
  int _currentTab = 0; // 0=Dashboard, 1=Voters, 2=Surveys, 3=Slips, 4=Copilot

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
        phone: "+91 98221 11221",
        classification: "Supporter",
        isVisited: true,
        isImportant: true,
        caste: "Maratha",
        scheme: "PM Awas Yojana",
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
        phone: "+91 98221 11222",
        classification: "Supporter",
        isVisited: true,
        caste: "Maratha",
        scheme: "Ladki Bahin Yojana",
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
        phone: "+91 98221 11223",
        classification: "Doubtful",
        isVisited: false,
        caste: "Maratha",
        scheme: "Youth Skill Voucher",
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
        phone: "+91 98221 11224",
        classification: "Supporter",
        isVisited: true,
        isImportant: true,
        caste: "Brahmin",
        scheme: "Sanjay Gandhi Niradhar",
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
        phone: "+91 98221 11225",
        classification: "Neutral",
        isVisited: false,
        caste: "Maratha",
        scheme: "Ladki Bahin Yojana",
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
        phone: "+91 98221 11226",
        classification: "Doubtful",
        isVisited: true,
        caste: "Maratha",
        scheme: "Kisan Samman",
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
        phone: "+91 98221 11227",
        classification: "Opponent",
        isVisited: true,
        caste: "Maratha",
        scheme: "None",
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
        phone: "+91 98221 11228",
        classification: "Supporter",
        isVisited: true,
        caste: "Muslim",
        scheme: "PMAY",
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
      ),
      SlipHistoryItem(
        voterName: "Sunita Rajesh Patil",
        marathiName: "सुनिता राजेश पाटील",
        boothNo: "101",
        epicId: "MH/04/101/00235",
        timestamp: "Today, 10:47 AM",
        mode: "WhatsApp Digital",
        serialNo: "043",
      ),
      SlipHistoryItem(
        voterName: "Ganesh Anant Kulkarni",
        marathiName: "गणेश अनंत कुलकर्णी",
        boothNo: "101",
        epicId: "MH/04/101/00237",
        timestamp: "Yesterday, 04:12 PM",
        mode: "Thermal Printed (58mm)",
        serialNo: "038",
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
    } else if (_activeKpiFilter == "unvisited") {
      list = list.where((v) => !v.isVisited).toList();
    } else if (_activeKpiFilter == "important") {
      list = list.where((v) => v.isImportant).toList();
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

    return list;
  }

  void _navigateTo(String viewName) {
    setState(() {
      _currentView = viewName;
      if (viewName == "dashboard") _currentTab = 0;
      if (viewName == "voters") _currentTab = 1;
      if (viewName == "surveys") _currentTab = 2;
      if (viewName == "slips") _currentTab = 3;
      if (viewName == "copilot") _currentTab = 4;
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
      // PERSISTENT 5-TAB BOTTOM NAVIGATION BAR (CORE FIELD CADRE ACTIONS)
      // ========================================================================
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: c.cardBg,
          border: Border(top: BorderSide(color: c.borderColor, width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentTab,
          onTap: (index) {
            setState(() {
              _currentTab = index;
              if (index == 0) _currentView = "dashboard";
              if (index == 1) _currentView = "voters";
              if (index == 2) _currentView = "surveys";
              if (index == 3) _currentView = "slips";
              if (index == 4) _currentView = "copilot";
            });
          },
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: c.primary,
          unselectedItemColor: c.textSecondary,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
          unselectedLabelStyle: const TextStyle(fontSize: 10),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: "Dashboard",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.people_alt_rounded),
              label: "Voters",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.assignment_turned_in_rounded),
              label: "Surveys",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.print_rounded),
              label: "Slips",
            ),
            BottomNavigationBarItem(
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
          activeFilter: _activeKpiFilter,
          onResetFilter: () => setState(() => _activeKpiFilter = "all"),
          onVoterUpdated: (updated) {
            setState(() {
              final idx = _voters.indexWhere((v) => v.id == updated.id);
              if (idx != -1) _voters[idx] = updated;
            });
          },
          onOpenAdvancedFilter: () => _navigateTo("advancedFilter"),
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
                ),
              );
            });
          },
        );

      case "copilot":
        return IndicAiCopilotScreen(
          c: c,
          isDark: isDark,
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
          matchingCount: filteredVoters.length,
          onApplyFilter: (booth, sentiment, age, gender) {
            setState(() {
              _filterBooth = booth;
              _filterSentiment = sentiment;
              _filterAgeGroup = age;
              _filterGender = gender;
              _navigateTo("voters");
            });
          },
          onResetFilter: () {
            setState(() {
              _filterBooth = "All";
              _filterSentiment = "All";
              _filterAgeGroup = "All";
              _filterGender = "All";
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
class DashboardScreen extends StatelessWidget {
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
  Widget build(BuildContext context) {
    final supporters = voters.where((v) => v.classification == "Supporter").length;
    final doubtful = voters.where((v) => v.classification == "Doubtful").length;
    final opponents = voters.where((v) => v.classification == "Opponent").length;
    final visited = voters.where((v) => v.isVisited).length;
    final unvisited = voters.where((v) => !v.isVisited).length;

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

        // SECTION: QUICK FIELD OPERATIONS (8 TILES FOR RAPID CLIENT ACCESS)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "QUICK FIELD OPERATIONS",
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textSecondary, letterSpacing: 1),
            ),
            Text(
              "8 Active Modules",
              style: TextStyle(fontSize: 9, color: c.primary, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 8),
        GridView.count(
          crossAxisCount: 4,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 8,
          crossAxisSpacing: 8,
          childAspectRatio: 0.95,
          children: [
            _quickTile(Icons.tune_rounded, "Advanced\nFilter", c.primary, () => onQuickActionTap("advancedFilter")),
            _quickTile(Icons.report_problem_rounded, "Issues &\nTickets (2)", c.red, () => onQuickActionTap("issues")),
            _quickTile(Icons.call_rounded, "Phone\nBook", c.cyan, () => onQuickActionTap("phoneBook")),
            _quickTile(Icons.location_city_rounded, "Booth &\nBLO Info", c.amber, () => onQuickActionTap("boothInfo")),
            _quickTile(Icons.assessment_rounded, "Reports &\nExports", c.purple, () => onQuickActionTap("reports")),
            _quickTile(Icons.receipt_long_rounded, "Slip\nHistory", c.green, () => onQuickActionTap("slipHistory")),
            _quickTile(Icons.history_rounded, "Activity\nAudit", c.textPrimary, () => onQuickActionTap("activityHistory")),
            _quickTile(Icons.manage_accounts_rounded, "Profile &\nSettings", c.primary, () => onQuickActionTap("profile")),
          ],
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
            _kpiCard("Total Visited", "$visited", "${((visited / voters.length) * 100).toInt()}% Doorstep", c.green, () => onKpiTap("all")),
            _kpiCard("Not Visited", "$unvisited", "Target pending", c.amber, () => onKpiTap("unvisited")),
            _kpiCard("Surveys Done", "$visited", "100% data captured", c.purple, () => onKpiTap("all")),
            _kpiCard("Important Contacts", "2", "Key influencers", Colors.amber, () => onKpiTap("important")),
            _kpiCard("Mobile Available", "${voters.length - 1}", "SMS reachable", c.cyan, () => onKpiTap("all")),
            _kpiCard("Supporters (Green)", "$supporters", "Strong vote cadre", c.green, () => onKpiTap("supporters")),
            _kpiCard("Doubtful / Swing", "$doubtful", "Follow-up required", c.amber, () => onKpiTap("doubtful")),
            _kpiCard("Opponents (Red)", "$opponents", "Leanings recorded", c.red, () => onKpiTap("opponents")),
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
// 2. ADVANCED FILTER SCREEN
// ==============================================================================
class AdvancedFilterScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final String selectedBooth;
  final String selectedSentiment;
  final String selectedAgeGroup;
  final String selectedGender;
  final int matchingCount;
  final Function(String, String, String, String) onApplyFilter;
  final VoidCallback onResetFilter;

  const AdvancedFilterScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.selectedBooth,
    required this.selectedSentiment,
    required this.selectedAgeGroup,
    required this.selectedGender,
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

  @override
  void initState() {
    super.initState();
    _booth = widget.selectedBooth;
    _sentiment = widget.selectedSentiment;
    _age = widget.selectedAgeGroup;
    _gender = widget.selectedGender;
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
            Text(
              "Advanced Voter Targeting",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            TextButton(
              onPressed: () {
                setState(() {
                  _booth = "All";
                  _sentiment = "All";
                  _age = "All";
                  _gender = "All";
                });
                widget.onResetFilter();
              },
              child: const Text("Reset All"),
            ),
          ],
        ),
        Text("Multi-parameter demographic and sentiment filtering", style: TextStyle(fontSize: 11, color: c.textSecondary)),
        const SizedBox(height: 16),

        _filterSectionTitle("Assigned Polling Booth", c),
        Wrap(
          spacing: 8,
          children: ["All", "101", "102", "103"].map((b) {
            final sel = _booth == b;
            return ChoiceChip(
              label: Text("Booth #$b"),
              selected: sel,
              onSelected: (val) => setState(() => _booth = b),
              selectedColor: c.primary,
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        _filterSectionTitle("Voter Classification Sentiment", c),
        Wrap(
          spacing: 8,
          children: ["All", "Supporter", "Doubtful", "Opponent"].map((s) {
            final sel = _sentiment == s;
            return ChoiceChip(
              label: Text(s),
              selected: sel,
              onSelected: (val) => setState(() => _sentiment = s),
              selectedColor: s == "Supporter" ? c.green : (s == "Doubtful" ? c.amber : c.primary),
              labelStyle: TextStyle(color: sel ? Colors.white : c.textPrimary, fontSize: 11),
            );
          }).toList(),
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
            widget.onApplyFilter(_booth, _sentiment, _age, _gender);
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
// 6. REPORTS & EXPORTS SCREEN
// ==============================================================================
class ReportsScreen extends StatelessWidget {
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
  Widget build(BuildContext context) {
    final visited = voters.where((v) => v.isVisited).length;

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Text("Daily Cadre Performance Audit", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary)),
        Text("Consolidated telemetry synced with Candidate War Room", style: TextStyle(fontSize: 11, color: c.textSecondary)),
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
              _metricRow("Total Allocated Voters", "${voters.length}", c),
              _metricRow("Doorstep Surveys Completed", "$visited (${((visited / voters.length) * 100).toInt()}%)", c),
              _metricRow("Voter Chits Dispatched", "${slipHistory.length}", c),
              _metricRow("Grievance Tickets Raised", "${issues.length}", c),
              _metricRow("Unresolved Grievances", "${issues.where((i) => i.status == 'Open').length}", c),
            ],
          ),
        ),

        const SizedBox(height: 20),
        ElevatedButton.icon(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                backgroundColor: Colors.green,
                content: Text("Export Generated: 'Kasba_Peth_Cadre_Audit_2026.csv' saved!"),
              ),
            );
          },
          icon: const Icon(Icons.download, color: Colors.white),
          label: const Text("Export Daily Audit CSV", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          style: ElevatedButton.styleFrom(
            backgroundColor: c.primary,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      ],
    );
  }

  Widget _metricRow(String label, String value, AppThemeColors c) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: c.textSecondary)),
          Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
        ],
      ),
    );
  }
}

// ==============================================================================
// 7. SLIP HISTORY SCREEN
// ==============================================================================
class SlipHistoryScreen extends StatelessWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<SlipHistoryItem> slips;

  const SlipHistoryScreen({super.key, required this.c, required this.isDark, required this.slips});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: slips.length,
      padding: const EdgeInsets.all(12),
      itemBuilder: (ctx, idx) {
        final s = slips[idx];
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
                  Text(s.marathiName, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: c.textPrimary)),
                  Text("${s.voterName} • Booth #${s.boothNo}", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                  Text("Serial #${s.serialNo} • ${s.timestamp}", style: TextStyle(fontSize: 9, color: c.textSecondary)),
                ],
              ),
              IconButton(
                icon: Icon(Icons.print, color: c.primary),
                tooltip: "Reprint Slip",
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Reprinting thermal chit for ${s.voterName}...")),
                  );
                },
              ),
            ],
          ),
        );
      },
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
  final VoidCallback onToggleTheme;
  final Function(String) onQaStateChanged;
  final VoidCallback onLogout;

  const ProfileSettingsScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.qaState,
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
// 11. VOTER SEARCH SCREEN & 6-TAB CENTRAL DOSSIER MODAL
// ==============================================================================
class VoterSearchScreen extends StatefulWidget {
  final AppThemeColors c;
  final bool isDark;
  final List<VoterItem> voters;
  final String activeFilter;
  final VoidCallback onResetFilter;
  final Function(VoterItem) onVoterUpdated;
  final VoidCallback onOpenAdvancedFilter;

  const VoterSearchScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voters,
    required this.activeFilter,
    required this.onResetFilter,
    required this.onVoterUpdated,
    required this.onOpenAdvancedFilter,
  });

  @override
  State<VoterSearchScreen> createState() => _VoterSearchScreenState();
}

class _VoterSearchScreenState extends State<VoterSearchScreen> {
  String _searchQuery = "";

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final displayList = widget.voters.where((v) {
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return v.name.toLowerCase().contains(q) ||
          v.marathiName.contains(q) ||
          v.epicId.toLowerCase().contains(q) ||
          v.houseNo.contains(q);
    }).toList();

    return Column(
      children: [
        // Search & Filter header
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: TextStyle(color: c.textPrimary, fontSize: 13),
                  decoration: InputDecoration(
                    hintText: "Search English / मराठी / EPIC / House...",
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

        if (widget.activeFilter != "all")
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Filtered by: ${widget.activeFilter}", style: TextStyle(color: c.amber, fontSize: 11, fontWeight: FontWeight.bold)),
                TextButton(
                  onPressed: widget.onResetFilter,
                  child: const Text("Reset Filter", style: TextStyle(fontSize: 11)),
                ),
              ],
            ),
          ),

        // Voter Cards List
        Expanded(
          child: ListView.builder(
            itemCount: displayList.length,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemBuilder: (context, idx) {
              final v = displayList[idx];
              Color pillColor = Colors.grey;
              if (v.classification == "Supporter") pillColor = c.green;
              if (v.classification == "Doubtful") pillColor = c.amber;
              if (v.classification == "Opponent") pillColor = c.red;

              return Container(
                margin: const EdgeInsets.only(bottom: 8),
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
                        Text(v.name, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: c.textPrimary)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: pillColor.withOpacity(0.18),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: pillColor),
                          ),
                          child: Text(
                            v.classification,
                            style: TextStyle(color: pillColor, fontSize: 9, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    Text(v.marathiName, style: TextStyle(fontSize: 11, color: c.textSecondary)),
                    const SizedBox(height: 4),
                    Text(
                      "Age ${v.age} • ${v.gender} • H.No ${v.houseNo} • Booth ${v.boothNo} • EPIC: ${v.epicId}",
                      style: TextStyle(fontSize: 10, color: c.textSecondary),
                    ),
                    const Divider(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {
                            _showDossierModal(context, v, c);
                          },
                          child: Text("Open 6-Tab Profile", style: TextStyle(fontSize: 11, color: c.primary, fontWeight: FontWeight.bold)),
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

  void _showDossierModal(BuildContext context, VoterItem voter, AppThemeColors c) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: c.cardBg,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return DefaultTabController(
          length: 6,
          child: SizedBox(
            height: MediaQuery.of(context).size.height * 0.75,
            child: Column(
              children: [
                const SizedBox(height: 10),
                Container(width: 40, height: 4, decoration: BoxDecoration(color: c.borderColor, borderRadius: BorderRadius.circular(2))),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(voter.name, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: c.textPrimary)),
                ),
                TabBar(
                  isScrollable: true,
                  indicatorColor: c.primary,
                  labelColor: c.primary,
                  unselectedLabelColor: c.textSecondary,
                  tabs: const [
                    Tab(text: "1. Details"),
                    Tab(text: "2. Family"),
                    Tab(text: "3. Sentiment"),
                    Tab(text: "4. Slip"),
                    Tab(text: "5. Issues"),
                    Tab(text: "6. Propose Edit"),
                  ],
                ),
                Expanded(
                  child: TabBarView(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text(
                          "EPIC ID: ${voter.epicId}\nHouse No: ${voter.houseNo}\nBooth: ${voter.boothNo}\nPhone: ${voter.phone}\nCaste: ${voter.caste}\nKey Scheme: ${voter.scheme}",
                          style: TextStyle(fontSize: 12, height: 1.6, color: c.textPrimary),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text(
                          "Patil Household (House #142):\n1. Rajesh V. Patil (Head, Age 48)\n2. Sunita R. Patil (Wife, Age 44)\n3. Amit R. Patil (Son, Age 22)",
                          style: TextStyle(fontSize: 12, height: 1.6, color: c.textPrimary),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: ["Supporter", "Doubtful", "Opponent", "Neutral"].map((s) {
                            return ListTile(
                              title: Text(s, style: TextStyle(color: c.textPrimary)),
                              trailing: voter.classification == s ? Icon(Icons.check, color: c.primary) : null,
                              onTap: () {
                                voter.classification = s;
                                widget.onVoterUpdated(voter);
                                Navigator.pop(ctx);
                              },
                            );
                          }).toList(),
                        ),
                      ),
                      Center(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Opening Voter Slip chit...")));
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: c.primary),
                          child: const Text("Generate Official ECI Slip", style: TextStyle(color: Colors.white)),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text("No unresolved grievances for this voter.", style: TextStyle(color: c.textSecondary)),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text("Propose corrections to Candidate War Room Quarantine.", style: TextStyle(color: c.textSecondary)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
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

  const DoorstepSurveyScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.voters,
    required this.onSurveyComplete,
  });

  @override
  Widget build(BuildContext context) {
    if (voters.isEmpty) {
      return Center(
        child: Text("All doorstep surveys completed for your assigned booths! 🎉", style: TextStyle(color: c.textSecondary)),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Text("PENDING DOORSTEP VISITS", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textSecondary)),
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
                    Text("${v.marathiName} • H.No ${v.houseNo}", style: TextStyle(fontSize: 10, color: c.textSecondary)),
                  ],
                ),
                ElevatedButton(
                  onPressed: () {
                    onSurveyComplete(v.id, "Supporter");
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: c.primary),
                  child: const Text("Conduct Survey", style: TextStyle(color: Colors.white, fontSize: 11)),
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
// 14. INDIC AI COPILOT
// ==============================================================================
class IndicAiCopilotScreen extends StatelessWidget {
  final AppThemeColors c;
  final bool isDark;
  final VoidCallback onLogout;

  const IndicAiCopilotScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: isDark
                  ? [const Color(0xFF1E1B4B), const Color(0xFF0B1527)]
                  : [const Color(0xFFEDE9FE), Colors.white],
            ),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: isDark ? const Color(0xFF4338CA) : const Color(0xFFC4B5FD)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Indic Election AI Copilot", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary)),
              Text("Marathi & English Ground Campaign Assistant", style: TextStyle(fontSize: 11, color: c.primary)),
              const SizedBox(height: 12),
              Text(
                "\"कस्बा पेठ मधील संशयित (Swing) मतदार दाखवा\"",
                style: TextStyle(fontStyle: FontStyle.italic, color: c.textSecondary, fontSize: 11),
              ),
            ],
          ),
        ),
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

  const ActivationScreen({super.key, required this.isDark, required this.onActivated});

  @override
  State<ActivationScreen> createState() => _ActivationScreenState();
}

class _ActivationScreenState extends State<ActivationScreen> {
  final _keyController = TextEditingController(text: "K9X2B7");
  final _phoneController = TextEditingController(text: "9822100001");

  @override
  Widget build(BuildContext context) {
    final c = AppThemeColors(widget.isDark);
    return Scaffold(
      backgroundColor: c.scaffoldBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF2563EB), Color(0xFF4F46E5), Color(0xFF9333EA)],
                    ),
                    borderRadius: BorderRadius.circular(20),
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
            ],
          ),
        ),
      ),
    );
  }
}
