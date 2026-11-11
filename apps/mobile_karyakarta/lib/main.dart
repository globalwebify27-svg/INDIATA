import 'package:flutter/material.dart';

void main() {
  runApp(const IndiataKaryakartaApp());
}

class IndiataKaryakartaApp extends StatelessWidget {
  const IndiataKaryakartaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'INDIATA Karyakarta',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF010627), // Candidate Obsidian Navy
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF2087FE), // Candidate Electric Royal Blue
          secondary: Color(0xFF12CF94), // Candidate Emerald Green
          surface: Color(0xFF020817), // Candidate Deep Slate
        ),
      ),
      home: const MainMobileScaffold(),
    );
  }
}

// ==============================================================================
// VOTER MODEL (MOCK DATA FOR FIELD EXPERIENCES)
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
  });
}

// ==============================================================================
// MASTER NAVIGATION SCAFFOLD (MODULE 1: 5 TABS)
// ==============================================================================
class MainMobileScaffold extends StatefulWidget {
  const MainMobileScaffold({super.key});

  @override
  State<MainMobileScaffold> createState() => _MainMobileScaffoldState();
}

class _MainMobileScaffoldState extends State<MainMobileScaffold> {
  int _currentTab = 0;
  bool _isActivated = true; // Set to false to test Module 2 Activation Screen
  bool _isOnline = true;
  String _activeKpiFilter = "all";

  // Scoped Mock Voters
  late List<VoterItem> _voters;

  @override
  void initState() {
    super.initState();
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
        phone: "",
        classification: "Doubtful",
        isVisited: true,
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
      ),
    ];
  }

  // Filter voters by search and active KPI card
  List<VoterItem> get filteredVoters {
    if (_activeKpiFilter == "supporters") {
      return _voters.where((v) => v.classification == "Supporter").toList();
    }
    if (_activeKpiFilter == "doubtful") {
      return _voters.where((v) => v.classification == "Doubtful").toList();
    }
    if (_activeKpiFilter == "opponents") {
      return _voters.where((v) => v.classification == "Opponent").toList();
    }
    if (_activeKpiFilter == "unvisited") {
      return _voters.where((v) => !v.isVisited).toList();
    }
    if (_activeKpiFilter == "important") {
      return _voters.where((v) => v.isImportant).toList();
    }
    return _voters;
  }

  @override
  Widget build(BuildContext context) {
    // If not activated, render Module 2 Activation Screen
    if (!_isActivated) {
      return ActivationScreen(
        onActivated: () {
          setState(() {
            _isActivated = true;
          });
        },
      );
    }

    return Scaffold(
      // TOP STATUS BAR & HEADER
      appBar: AppBar(
        elevation: 0,
        backgroundColor: const Color(0xFF0B1527),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF2087FE).withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF2087FE).withOpacity(0.35)),
              ),
              child: const Text(
                "INDIATA",
                style: TextStyle(
                  color: Color(0xFF2087FE),
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                  letterSpacing: 1.2,
                ),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              "Karyakarta",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
            ),
          ],
        ),
        actions: [
          // Network toggle pill (Simulates Offline/Online SQLite Cache)
          GestureDetector(
            onTap: () {
              setState(() {
                _isOnline = !_isOnline;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  duration: const Duration(milliseconds: 1500),
                  backgroundColor: _isOnline ? Colors.green.shade900 : Colors.amber.shade900,
                  content: Text(_isOnline
                      ? "ONLINE: Local changes synchronized with War Room"
                      : "OFFLINE: Local SQLite caching enabled"),
                ),
              );
            },
            child: Container(
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: _isOnline
                    ? const Color(0xFF10B981).withOpacity(0.2)
                    : Colors.amber.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _isOnline ? Colors.greenAccent : Colors.amberAccent,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    _isOnline ? Icons.wifi : Icons.wifi_off,
                    size: 14,
                    color: _isOnline ? Colors.greenAccent : Colors.amberAccent,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    _isOnline ? "Online" : "Offline",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: _isOnline ? Colors.greenAccent : Colors.amberAccent,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),

      // ACTIVE MODULE SCREEN (PAGED BY BOTTOM BAR)
      body: IndexedStack(
        index: _currentTab,
        children: [
          // TAB 0: Performance Dashboard (15 KPIs)
          DashboardScreen(
            voters: _voters,
            onKpiTap: (filter) {
              setState(() {
                _activeKpiFilter = filter;
                _currentTab = 1; // Jump to Voters Tab
              });
            },
          ),

          // TAB 1: Fast Voter Search & 6-Tab Dossier
          VoterSearchScreen(
            voters: filteredVoters,
            activeFilter: _activeKpiFilter,
            onResetFilter: () {
              setState(() {
                _activeKpiFilter = "all";
              });
            },
            onVoterUpdated: (updated) {
              setState(() {
                final idx = _voters.indexWhere((v) => v.id == updated.id);
                if (idx != -1) _voters[idx] = updated;
              });
            },
          ),

          // TAB 2: Doorstep 26Q Survey Engine
          DoorstepSurveyScreen(
            voters: _voters.where((v) => !v.isVisited).toList(),
            onSurveyComplete: (voterId, sentiment) {
              setState(() {
                final v = _voters.firstWhere((item) => item.id == voterId);
                v.isVisited = true;
                v.classification = sentiment;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: Colors.green,
                  content: Text("Survey saved with GPS_VERIFIED geotag!"),
                ),
              );
            },
          ),

          // TAB 3: Voter Slips & Thermal Print
          SlipsPrintScreen(voters: _voters),

          // TAB 4: Indic AI Copilot & Grievance
          IndicAiCopilotScreen(
            onLogout: () {
              setState(() {
                _isActivated = false;
              });
            },
          ),
        ],
      ),

      // 5-TAB PERSISTENT BOTTOM NAVIGATION (MODULE 1)
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF0B1527),
          border: Border(top: BorderSide(color: Color(0xFF1E293B), width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentTab,
          onTap: (index) {
            setState(() {
              _currentTab = index;
            });
          },
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF2087FE), // Candidate Electric Blue active
          unselectedItemColor: Colors.grey,
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
}

// ==============================================================================
// MODULE 2: FIELD ACTIVATION & HARDWARE BINDING SCREEN
// ==============================================================================
class ActivationScreen extends StatefulWidget {
  final VoidCallback onActivated;
  const ActivationScreen({super.key, required this.onActivated});

  @override
  State<ActivationScreen> createState() => _ActivationScreenState();
}

class _ActivationScreenState extends State<ActivationScreen> {
  final _keyController = TextEditingController(text: "K9X2B7");
  final _phoneController = TextEditingController(text: "9822100001");

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF030712),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Logo
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
              const Text(
                "INDIATA Karyakarta",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              const Text(
                "Field Cadre Outreach & Booth Command",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 32),

              // 6-Character Key Input
              const Text("6-Character Activation Key", style: TextStyle(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 6),
              TextField(
                controller: _keyController,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 20,
                  letterSpacing: 4,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2087FE),
                ),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: const Color(0xFF020817),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 16),

              // Mobile Input
              const Text("Registered Mobile Number", style: TextStyle(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 6),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: const Color(0xFF020817),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 24),

              // Activate Button
              ElevatedButton(
                onPressed: widget.onActivated,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2087FE),
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

// ==============================================================================
// MODULE 3: PERFORMANCE DASHBOARD (15 KPIS)
// ==============================================================================
class DashboardScreen extends StatelessWidget {
  final List<VoterItem> voters;
  final Function(String) onKpiTap;

  const DashboardScreen({super.key, required this.voters, required this.onKpiTap});

  @override
  Widget build(BuildContext context) {
    final supporters = voters.where((v) => v.classification == "Supporter").length;
    final doubtful = voters.where((v) => v.classification == "Doubtful").length;
    final opponents = voters.where((v) => v.classification == "Opponent").length;
    final visited = voters.where((v) => v.isVisited).length;
    final unvisited = voters.where((v) => !v.isVisited).length;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Cadre Welcome Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0B1527), Color(0xFF1E1B4B)],
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF312E81)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.greenAccent),
                    ),
                    child: const Text(
                      "● FIELD CADRE ACTIVE",
                      style: TextStyle(color: Colors.greenAccent, fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const Text(
                    "Candidate: Anand Shinde",
                    style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                "Welcome back, Sachin D. Mane",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const Text(
                "215 - Kasba Peth • Shaniwar Peth Central",
                style: TextStyle(fontSize: 11, color: Colors.grey),
              ),
              const SizedBox(height: 10),
              // Booth Badges
              Wrap(
                spacing: 6,
                children: ["Booth #101", "Booth #102", "Booth #103"].map((b) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      b,
                      style: const TextStyle(fontSize: 10, color: Colors.cyanAccent, fontWeight: FontWeight.bold),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),
        const Text(
          "FIELD PERFORMANCE TELEMETRY (15 METRICS)",
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
        ),
        const SizedBox(height: 10),

        // 15 KPI Grid
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 8,
          crossAxisSpacing: 8,
          childAspectRatio: 1.8,
          children: [
            _kpiCard("Assigned Voters", "${voters.length}", "3 Booths allocated", Colors.blue, () => onKpiTap("all")),
            _kpiCard("Total Visited", "$visited", "${((visited / voters.length) * 100).toInt()}% doorstep", Colors.green, () => onKpiTap("all")),
            _kpiCard("Not Visited", "$unvisited", "Target pending", Colors.amber, () => onKpiTap("unvisited")),
            _kpiCard("Surveys Done", "$visited", "100% data captured", Colors.purple, () => onKpiTap("all")),
            _kpiCard("Important Contacts", "2", "Key influencers", Colors.yellow, () => onKpiTap("important")),
            _kpiCard("Mobile Available", "${voters.length - 1}", "SMS reachable", Colors.cyan, () => onKpiTap("all")),
            _kpiCard("Supporters (Green)", "$supporters", "Strong vote cadre", Colors.green, () => onKpiTap("supporters")),
            _kpiCard("Doubtful / Swing", "$doubtful", "Follow-up required", Colors.amber, () => onKpiTap("doubtful")),
            _kpiCard("Opponents (Red)", "$opponents", "Leanings recorded", Colors.red, () => onKpiTap("opponents")),
            _kpiCard("Open Grievances", "2", "Action in booths", Colors.orange, () => onKpiTap("all")),
          ],
        ),
      ],
    );
  }

  Widget _kpiCard(String title, String count, String sub, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: const Color(0xFF0B1527),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(title, style: TextStyle(color: Colors.grey.shade400, fontSize: 10, fontWeight: FontWeight.w600)),
            const SizedBox(height: 2),
            Text(count, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
            Text(sub, style: TextStyle(color: color, fontSize: 9, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

// ==============================================================================
// MODULE 4: VOTER SEARCH & 6-TAB CENTRAL DOSSIER
// ==============================================================================
class VoterSearchScreen extends StatefulWidget {
  final List<VoterItem> voters;
  final String activeFilter;
  final VoidCallback onResetFilter;
  final Function(VoterItem) onVoterUpdated;

  const VoterSearchScreen({
    super.key,
    required this.voters,
    required this.activeFilter,
    required this.onResetFilter,
    required this.onVoterUpdated,
  });

  @override
  State<VoterSearchScreen> createState() => _VoterSearchScreenState();
}

class _VoterSearchScreenState extends State<VoterSearchScreen> {
  String _searchQuery = "";

  @override
  Widget build(BuildContext context) {
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
        // Search Input
        Padding(
          padding: const EdgeInsets.all(12),
          child: TextField(
            onChanged: (val) => setState(() => _searchQuery = val),
            style: const TextStyle(color: Colors.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: "Search English / मराठी / EPIC / House...",
              hintStyle: const TextStyle(color: Colors.grey, fontSize: 12),
              prefixIcon: const Icon(Icons.search, size: 20, color: Colors.grey),
              filled: true,
              fillColor: const Color(0xFF0B1527),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            ),
          ),
        ),

        // Filter Reset Header
        if (widget.activeFilter != "all")
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Filtered by: ${widget.activeFilter}", style: const TextStyle(color: Colors.amber, fontSize: 11)),
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
              if (v.classification == "Supporter") pillColor = Colors.green;
              if (v.classification == "Doubtful") pillColor = Colors.amber;
              if (v.classification == "Opponent") pillColor = Colors.red;

              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF0B1527),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(v.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: pillColor.withOpacity(0.2),
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
                    Text(v.marathiName, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                    const SizedBox(height: 4),
                    Text(
                      "Age ${v.age} • ${v.gender} • H.No ${v.houseNo} • Booth ${v.boothNo} • EPIC: ${v.epicId}",
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                    const Divider(height: 16, color: Color(0xFF1E293B)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {
                            _showDossierModal(context, v);
                          },
                          child: const Text("Open 6-Tab Profile", style: TextStyle(fontSize: 11, color: Color(0xFF2087FE))),
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

  // 6-Tab Bottom Sheet Modal
  void _showDossierModal(BuildContext context, VoterItem voter) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF020817),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return DefaultTabController(
          length: 6,
          child: SizedBox(
            height: MediaQuery.of(context).size.height * 0.75,
            child: Column(
              children: [
                const SizedBox(height: 12),
                Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey, borderRadius: BorderRadius.circular(2))),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(voter.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                ),
                const TabBar(
                  isScrollable: true,
                  indicatorColor: Color(0xFF2087FE),
                  labelColor: Color(0xFF2087FE),
                  unselectedLabelColor: Colors.grey,
                  tabs: [
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
                      // Tab 1
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text("EPIC: ${voter.epicId}\nHouse: ${voter.houseNo}\nBooth: ${voter.boothNo}\nPhone: ${voter.phone}"),
                      ),
                      // Tab 2
                      const Padding(
                        padding: EdgeInsets.all(16),
                        child: Text("Patil Household:\n1. Rajesh V. Patil (Head)\n2. Sunita R. Patil (Wife)\n3. Amit R. Patil (Son)"),
                      ),
                      // Tab 3
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: ["Supporter", "Doubtful", "Opponent", "Neutral"].map((s) {
                            return ListTile(
                              title: Text(s),
                              trailing: voter.classification == s ? const Icon(Icons.check, color: Color(0xFF2087FE)) : null,
                              onTap: () {
                                voter.classification = s;
                                widget.onVoterUpdated(voter);
                                Navigator.pop(ctx);
                              },
                            );
                          }).toList(),
                        ),
                      ),
                      // Tab 4
                      Center(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Opening Voter Slip...")));
                          },
                          child: const Text("Generate Official ECI Slip"),
                        ),
                      ),
                      // Tab 5
                      const Padding(padding: EdgeInsets.all(16), child: Text("No unresolved grievances for this voter.")),
                      // Tab 6
                      const Padding(padding: EdgeInsets.all(16), child: Text("Propose corrections to War Room Quarantine.")),
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
// MODULE 5: 26Q DOORSTEP SURVEY WIZARD
// ==============================================================================
class DoorstepSurveyScreen extends StatelessWidget {
  final List<VoterItem> voters;
  final Function(String, String) onSurveyComplete;

  const DoorstepSurveyScreen({super.key, required this.voters, required this.onSurveyComplete});

  @override
  Widget build(BuildContext context) {
    if (voters.isEmpty) {
      return const Center(
        child: Text("All doorstep surveys completed for your assigned booths! 🎉", style: TextStyle(color: Colors.grey)),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text("PENDING DOORSTEP VISITS", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 10),
        ...voters.map((v) {
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0B1527),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(v.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                    Text("${v.marathiName} • H.No ${v.houseNo}", style: const TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
                ElevatedButton(
                  onPressed: () {
                    onSurveyComplete(v.id, "Supporter");
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2087FE)),
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
// MODULE 6: VOTER SLIPS & THERMAL RECEIPT PRINTER
// ==============================================================================
class SlipsPrintScreen extends StatelessWidget {
  final List<VoterItem> voters;
  const SlipsPrintScreen({super.key, required this.voters});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Printer Status Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFF020817),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.blueAccent.withOpacity(0.3)),
          ),
          child: const Row(
            children: [
              Icon(Icons.print, color: Colors.blueAccent),
              SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("ESC/POS Bluetooth Thermal Printer", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  Text("● TP-5801 Connected (Paper: 58mm)", style: TextStyle(color: Colors.greenAccent, fontSize: 10)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const Text("QUICK PRINT VOTING CHITS", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 10),

        // Slip items
        ...voters.take(3).map((v) {
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: const Color(0xFF020817), borderRadius: BorderRadius.circular(14)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(v.marathiName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                    Text("Sr. #042 • Booth ${v.boothNo} • EPIC: ${v.epicId}", style: const TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.print, color: Color(0xFF2087FE)),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Slip sent to TP-5801 Bluetooth Printer for ${v.name}!")),
                    );
                  },
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
// MODULE 8: INDIC AI COPILOT
// ==============================================================================
class IndicAiCopilotScreen extends StatelessWidget {
  final VoidCallback onLogout;
  const IndicAiCopilotScreen({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFF1E1B4B), Color(0xFF0B1527)]),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF4338CA)),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Indic Election AI Copilot", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
              Text("Marathi & English Ground Campaign Assistant", style: TextStyle(fontSize: 11, color: Colors.cyanAccent)),
              SizedBox(height: 12),
              Text(
                "\"कस्बा पेठ मधील संशयित (Swing) मतदार दाखवा\"",
                style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey, fontSize: 11),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: onLogout,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red.shade900,
            padding: const EdgeInsets.symmetric(vertical: 14),
          ),
          child: const Text("Unlink Device & Logout", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
