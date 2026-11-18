import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../../voters/models/voter_model.dart';
import '../../voters/data/voters_mock_data.dart';
import '../models/office_issue_model.dart';
import '../data/office_issues_mock_data.dart';
import 'grievance_detail_screen.dart';
import 'add_grievance_sheet.dart';

class OfficeIssuesScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const OfficeIssuesScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<OfficeIssuesScreen> createState() => _OfficeIssuesScreenState();
}

class _OfficeIssuesScreenState extends State<OfficeIssuesScreen> {
  int _selectedSegment = 0; // 0: Grievances, 1: Visitors Log
  String _searchQuery = "";
  GrievanceStatus? _selectedStatus; // null = all

  final List<GrievanceTicket> _tickets = List.from(OfficeIssuesMockData.tickets);
  final List<VisitorRecord> _visitors = List.from(OfficeIssuesMockData.visitorsToday);

  List<GrievanceTicket> get _filteredTickets {
    return _tickets.where((t) {
      final matchesSearch = _searchQuery.isEmpty ||
          t.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.citizenName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.pethOrWard.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.id.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesStatus = _selectedStatus == null || t.status == _selectedStatus;

      return matchesSearch && matchesStatus;
    }).toList();
  }

  List<VoterModel> get _matchedVoters {
    if (_searchQuery.trim().isEmpty) return [];
    final q = _searchQuery.trim().toLowerCase();
    return VotersMockData.voters.where((v) {
      return v.name.toLowerCase().contains(q) ||
          v.nameMr.contains(q) ||
          v.epic.toLowerCase().contains(q) ||
          v.mobile.contains(q);
    }).take(4).toList();
  }

  void _openAddGrievanceSheet({
    String? initialName,
    String? initialPhone,
    String? initialBooth,
    String? initialPeth,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AddGrievanceSheet(
        c: widget.c,
        initialCitizenName: initialName,
        initialPhone: initialPhone,
        initialBooth: initialBooth,
        initialPeth: initialPeth,
        onTicketCreated: (newTicket) {
          setState(() {
            _tickets.insert(0, newTicket);
          });
        },
      ),
    );
  }

  // New Voter Onboarding Flow (Section 9 Requirement)
  void _openNewVoterOnboardingDialog(String defaultQuery) {
    final nameCtrl = TextEditingController(text: defaultQuery.trim());
    final epicCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final nameMrCtrl = TextEditingController();
    final ageCtrl = TextEditingController(text: "32");
    final casteCtrl = TextEditingController(text: "Maratha");
    final boothCtrl = TextEditingController(text: "42");
    final addressCtrl = TextEditingController(text: "Kasba Peth, Pune");
    VoterGender selectedGender = VoterGender.male;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: widget.c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6256D9).withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.person_add_rounded, color: Color(0xFF6256D9), size: 20),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "New Voter Onboarding",
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                          ),
                          Text(
                            "Register citizen into Central Voter Profile Schema",
                            style: TextStyle(fontSize: 10, color: widget.c.textSecondary),
                          ),
                        ],
                      ),
                    ],
                  ),
                  IconButton(
                    icon: Icon(Icons.close_rounded, size: 20, color: widget.c.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Divider(height: 1),
              const SizedBox(height: 12),

              Expanded(
                child: ListView(
                  children: [
                    // Mandatory Banner
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.amber.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.amber.withOpacity(0.4)),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.info_outline_rounded, size: 14, color: Colors.amber),
                          SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              "Mandatory: Name, Voter ID (EPIC), and Phone Number. All demographic & spatial fields are optional.",
                              style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w600, color: Colors.amber),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Field 1: Full Name (Mandatory)
                    _formField("Voter Full Name (English) *", nameCtrl, "e.g. Ramesh Vithal Jadhav"),
                    const SizedBox(height: 10),

                    // Field 2: Voter ID (EPIC) (Mandatory)
                    _formField("Voter ID / EPIC Number *", epicCtrl, "e.g. MH/04/042/123456"),
                    const SizedBox(height: 10),

                    // Field 3: Phone Number (Mandatory)
                    _formField("Mobile Phone Number *", phoneCtrl, "e.g. 9822012345", isPhone: true),
                    const SizedBox(height: 10),

                    // Optional Fields Header
                    Text(
                      "OPTIONAL DEMOGRAPHIC & SPATIAL ATTRIBUTES",
                      style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.8),
                    ),
                    const SizedBox(height: 8),

                    // Field 4: Marathi Name (Optional)
                    _formField("Name in Marathi (Optional)", nameMrCtrl, "उदा. रमेश विठ्ठल जाधव"),
                    const SizedBox(height: 10),

                    // Row: Age & Gender
                    Row(
                      children: [
                        Expanded(
                          child: _formField("Age", ageCtrl, "e.g. 35", isPhone: true),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Gender", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: widget.c.textSecondary)),
                              const SizedBox(height: 4),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10),
                                decoration: BoxDecoration(
                                  color: widget.c.scaffoldBg,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: widget.c.cardBorder),
                                ),
                                child: DropdownButtonHideUnderline(
                                  child: DropdownButton<VoterGender>(
                                    value: selectedGender,
                                    isExpanded: true,
                                    dropdownColor: widget.c.cardBg,
                                    style: TextStyle(fontSize: 12, color: widget.c.textPrimary),
                                    items: const [
                                      DropdownMenuItem(value: VoterGender.male, child: Text("Male")),
                                      DropdownMenuItem(value: VoterGender.female, child: Text("Female")),
                                      DropdownMenuItem(value: VoterGender.other, child: Text("Other")),
                                    ],
                                    onChanged: (val) {
                                      if (val != null) setModalState(() => selectedGender = val);
                                    },
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Row: Community & Booth #
                    Row(
                      children: [
                        Expanded(
                          child: _formField("Caste / Community", casteCtrl, "e.g. Maratha / OBC"),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _formField("Booth Number", boothCtrl, "e.g. 42", isPhone: true),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // House Address
                    _formField("House Address / Locus", addressCtrl, "e.g. Flat 302, Sadashiv Peth, Pune"),
                    const SizedBox(height: 20),
                  ],
                ),
              ),

              // Action Button
              SizedBox(
                width: double.infinity,
                height: 46,
                child: ElevatedButton.icon(
                  onPressed: () {
                    final name = nameCtrl.text.trim();
                    final epic = epicCtrl.text.trim();
                    final phone = phoneCtrl.text.trim();

                    if (name.isEmpty || epic.isEmpty || phone.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: Colors.red,
                          content: Text("Validation Error: Name, Voter ID (EPIC), and Phone Number are mandatory."),
                        ),
                      );
                      return;
                    }

                    // Onboard into master database
                    final newVoter = VoterModel(
                      id: "VOT-NEW-${DateTime.now().millisecondsSinceEpoch % 10000}",
                      epic: epic,
                      serialNumber: "999",
                      boothNumber: int.tryParse(boothCtrl.text.trim()) ?? 42,
                      name: name,
                      nameMr: nameMrCtrl.text.trim().isEmpty ? name : nameMrCtrl.text.trim(),
                      age: int.tryParse(ageCtrl.text.trim()) ?? 30,
                      gender: selectedGender,
                      guardianName: "Family Head",
                      guardianRelation: "Guardian",
                      mobile: phone,
                      whatsapp: phone,
                      houseNumber: "HN-NEW",
                      buildingOrChawl: addressCtrl.text.trim(),
                      street: "Constituency Sector",
                      area: "Kasba Peth",
                      landmark: "Ward Office Vicinity",
                      communityGroup: casteCtrl.text.trim(),
                      subCaste: "General",
                      sentiment: VoterSentiment.favorable,
                      isKeyInfluencer: false,
                      familyId: "FAM-NEW",
                      isHeadOfFamily: false,
                      isSurveyed: true,
                      surveyDate: "Today",
                      surveyorKaryakarta: "Office Desk Entry",
                      surveyorContact: "+91 98220 11234",
                      surveyGpsCoordinates: "18.5204° N, 73.8567° E",
                      surveyorNotes: "New voter onboarded directly from Constituency Office desk.",
                      welfareSchemes: const [],
                      grievances: const [],
                    );

                    setState(() {
                      VotersMockData.voters.insert(0, newVoter);
                    });

                    Navigator.pop(ctx);

                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFF10B981),
                        content: Text("Voter '$name' ($epic) successfully onboarded to roll."),
                      ),
                    );

                    // Immediately open Issue Logging for this voter
                    _openAddGrievanceSheet(
                      initialName: name,
                      initialPhone: phone,
                      initialBooth: boothCtrl.text.trim(),
                      initialPeth: "Kasba Peth",
                    );
                  },
                  icon: const Icon(Icons.check_circle_outline_rounded, size: 18),
                  label: const Text("Complete Onboarding & Log Issue", style: TextStyle(fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6256D9),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _formField(String label, TextEditingController ctrl, String hint, {bool isPhone = false}) {
    final c = widget.c;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textSecondary)),
        const SizedBox(height: 4),
        TextField(
          controller: ctrl,
          keyboardType: isPhone ? TextInputType.phone : TextInputType.text,
          style: TextStyle(fontSize: 12, color: c.textPrimary),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(fontSize: 11, color: c.textMuted),
            filled: true,
            fillColor: c.scaffoldBg,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: c.cardBorder)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: c.cardBorder)),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        backgroundColor: c.cardBg,
        elevation: 0.5,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: c.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Office & Issues Management",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Citizen Demands & Constituency Visitor Log",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Log New Grievance",
            icon: const Icon(Icons.add_task_rounded, color: Color(0xFF6256D9), size: 22),
            onPressed: () => _openAddGrievanceSheet(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openAddGrievanceSheet(),
        backgroundColor: const Color(0xFF6256D9),
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text("Log Issue", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Top Statistics Row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            color: c.cardBg,
            child: Row(
              children: [
                Expanded(child: _kpiTile("Walk-ins Today", "${_visitors.length}", Colors.blue)),
                const SizedBox(width: 8),
                Expanded(child: _kpiTile("Open Tickets", "${_tickets.where((t) => t.status != GrievanceStatus.closed).length}", Colors.red)),
                const SizedBox(width: 8),
                Expanded(child: _kpiTile("Resolved Week", "${OfficeIssuesMockData.resolvedThisWeek}", Colors.green)),
                const SizedBox(width: 8),
                Expanded(child: _kpiTile("Escalated PMC", "${OfficeIssuesMockData.escalatedToPMC}", Colors.amber.shade800)),
              ],
            ),
          ),

          // Segment Selector
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            color: c.cardBg,
            child: Row(
              children: [
                Expanded(
                  child: _segmentButton(0, "Citizen Grievances (${_tickets.length})"),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _segmentButton(1, "Office Visitors (${_visitors.length})"),
                ),
              ],
            ),
          ),

          // Main Content
          Expanded(
            child: _selectedSegment == 0 ? _buildGrievancesView() : _buildVisitorsView(),
          ),
        ],
      ),
    );
  }

  Widget _kpiTile(String label, String value, Color color) {
    final c = widget.c;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: color),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: c.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _segmentButton(int index, String title) {
    final isSelected = _selectedSegment == index;
    final c = widget.c;

    return InkWell(
      onTap: () => setState(() => _selectedSegment = index),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF6256D9) : c.scaffoldBg,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? const Color(0xFF6256D9) : c.cardBorder),
        ),
        child: Center(
          child: Text(
            title,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : c.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  // --- GRIEVANCES VIEW ---
  Widget _buildGrievancesView() {
    final c = widget.c;
    final filtered = _filteredTickets;
    final voterMatches = _matchedVoters;

    return Column(
      children: [
        // Prominent Voter & Issue Search Bar
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          color: c.cardBg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: InputDecoration(
                  hintText: "Search registered voter by Name, EPIC, or Mobile...",
                  hintStyle: TextStyle(fontSize: 11.5, color: c.textMuted),
                  prefixIcon: const Icon(Icons.person_search_rounded, size: 18, color: Color(0xFF6256D9)),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, size: 16),
                          onPressed: () => setState(() => _searchQuery = ""),
                        )
                      : null,
                  filled: true,
                  fillColor: c.scaffoldBg,
                  contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.cardBorder)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.cardBorder)),
                ),
                style: TextStyle(fontSize: 12, color: c.textPrimary),
              ),

              // Dynamic Voter Roll Lookup Match / Onboard Section
              if (_searchQuery.trim().isNotEmpty) ...[
                const SizedBox(height: 8),
                if (voterMatches.isNotEmpty) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "MATCHED VOTERS IN 215 KASBA PETH (${voterMatches.length})",
                        style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
                      ),
                      InkWell(
                        onTap: () => _openNewVoterOnboardingDialog(_searchQuery),
                        child: const Text(
                          "+ Add New Voter",
                          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF6256D9)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ...voterMatches.map((v) => Container(
                        margin: const EdgeInsets.only(bottom: 6),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: widget.isDark ? const Color(0xFF141417) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFF6256D9).withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 14,
                              backgroundColor: const Color(0xFF6256D9).withOpacity(0.12),
                              child: const Icon(Icons.person_rounded, size: 15, color: Color(0xFF6256D9)),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "${v.name} (${v.nameMr})",
                                    style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                                  ),
                                  Text(
                                    "EPIC: ${v.epic} • Booth #${v.boothNumber} • ${v.mobile}",
                                    style: TextStyle(fontSize: 9.5, color: c.textSecondary),
                                  ),
                                ],
                              ),
                            ),
                            ElevatedButton.icon(
                              onPressed: () => _openAddGrievanceSheet(
                                initialName: v.name,
                                initialPhone: v.mobile,
                                initialBooth: v.boothNumber.toString(),
                                initialPeth: v.area,
                              ),
                              icon: const Icon(Icons.edit_note_rounded, size: 14),
                              label: const Text("Log Issue", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF6256D9),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                              ),
                            ),
                          ],
                        ),
                      )),
                ] else ...[
                  // Zero matched voters in registry -> Present [ Add New Voter ] action
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: widget.isDark ? const Color(0xFF141417) : const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.red.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.person_off_rounded, color: Colors.red, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "No registered voter matching '$_searchQuery'",
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textPrimary),
                              ),
                              Text(
                                "Citizen not found in 215 - Kasba Peth electoral roll.",
                                style: TextStyle(fontSize: 9.5, color: c.textSecondary),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton.icon(
                          onPressed: () => _openNewVoterOnboardingDialog(_searchQuery),
                          icon: const Icon(Icons.add_rounded, size: 14),
                          label: const Text("Add New Voter", style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red.shade700,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],

              const SizedBox(height: 8),

              // Status Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _statusChip("All", null),
                    const SizedBox(width: 6),
                    _statusChip("New", GrievanceStatus.ticketNew),
                    const SizedBox(width: 6),
                    _statusChip("In Progress", GrievanceStatus.inProgress),
                    const SizedBox(width: 6),
                    _statusChip("Resolved", GrievanceStatus.resolved),
                    const SizedBox(width: 6),
                    _statusChip("Closed", GrievanceStatus.closed),
                  ],
                ),
              ),
            ],
          ),
        ),

        // Grievance Cards List
        Expanded(
          child: filtered.isEmpty
              ? Center(child: Text("No grievances found.", style: TextStyle(color: c.textSecondary, fontSize: 12)))
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(14, 12, 14, 80),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final ticket = filtered[index];
                    return _buildGrievanceCard(ticket);
                  },
                ),
        ),
      ],
    );
  }

  Widget _statusChip(String label, GrievanceStatus? status) {
    final isSelected = _selectedStatus == status;
    final c = widget.c;

    return InkWell(
      onTap: () => setState(() => _selectedStatus = status),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF6256D9) : c.cardBg,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? const Color(0xFF6256D9) : c.cardBorder),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : c.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildGrievanceCard(GrievanceTicket ticket) {
    final c = widget.c;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.cardBorder),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => GrievanceDetailScreen(
                ticket: ticket,
                c: c,
                isDark: widget.isDark,
                onTicketUpdated: () => setState(() {}),
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6256D9).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          ticket.id,
                          style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF6256D9)),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: ticket.priorityColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: ticket.priorityColor.withOpacity(0.4)),
                        ),
                        child: Text(
                          ticket.priorityLabel,
                          style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: ticket.priorityColor),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                    decoration: BoxDecoration(
                      color: ticket.statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: ticket.statusColor),
                    ),
                    child: Text(
                      ticket.statusLabel,
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: ticket.statusColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  CircleAvatar(
                    radius: 14,
                    backgroundColor: const Color(0xFF6256D9).withOpacity(0.1),
                    child: Icon(ticket.categoryIcon, size: 15, color: const Color(0xFF6256D9)),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      ticket.title,
                      style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                "${ticket.citizenName} • ${ticket.pethOrWard} • Booth #${ticket.boothNumber}",
                style: TextStyle(fontSize: 10.5, color: c.textSecondary),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                decoration: BoxDecoration(
                  color: c.scaffoldBg,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.person_pin_rounded, size: 13, color: Colors.teal),
                        const SizedBox(width: 4),
                        Text(
                          "Assigned: ${ticket.assignedWorkerName}",
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: c.textPrimary),
                        ),
                      ],
                    ),
                    Text(
                      ticket.createdAt,
                      style: TextStyle(fontSize: 9.5, color: c.textMuted),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- VISITORS VIEW ---
  Widget _buildVisitorsView() {
    final c = widget.c;

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 80),
      itemCount: _visitors.length,
      itemBuilder: (context, index) {
        final visitor = _visitors[index];

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.cardBorder),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6256D9).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          visitor.id,
                          style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF6256D9)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        visitor.name,
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                    decoration: BoxDecoration(
                      color: visitor.statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: visitor.statusColor),
                    ),
                    child: Text(
                      visitor.status,
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: visitor.statusColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Icon(Icons.location_on_rounded, size: 13, color: c.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    "${visitor.pethOrWard} • ${visitor.phone}",
                    style: TextStyle(fontSize: 10.5, color: c.textSecondary),
                  ),
                  const Spacer(),
                  Icon(Icons.access_time_rounded, size: 12, color: c.textMuted),
                  const SizedBox(width: 3),
                  Text(
                    visitor.timeIn,
                    style: TextStyle(fontSize: 10, color: c.textMuted),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: c.scaffoldBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Purpose: ${visitor.purpose}",
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      visitor.notes,
                      style: TextStyle(fontSize: 10.5, color: c.textSecondary),
                    ),
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
