import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/voter_model.dart';
import '../widgets/voter_slip_dialog.dart';

class VoterProfileScreen extends StatefulWidget {
  final VoterModel voter;
  final CandidateColors c;
  final Function(VoterModel updatedVoter)? onVoterUpdated;

  const VoterProfileScreen({
    super.key,
    required this.voter,
    required this.c,
    this.onVoterUpdated,
  });

  @override
  State<VoterProfileScreen> createState() => _VoterProfileScreenState();
}

class _VoterProfileScreenState extends State<VoterProfileScreen> {
  late VoterModel _voter;

  @override
  void initState() {
    super.initState();
    _voter = widget.voter;
  }

  void _updateSentiment(VoterSentiment newSentiment) {
    setState(() {
      _voter = _voter.copyWith(sentiment: newSentiment);
    });
    widget.onVoterUpdated?.call(_voter);

    String name;
    Color col;
    switch (newSentiment) {
      case VoterSentiment.favorable:
        name = "Confirmed Supporter (🟢)";
        col = const Color(0xFF10B981);
        break;
      case VoterSentiment.swing:
        name = "Swing / Persuadable (🟡)";
        col = const Color(0xFFF59E0B);
        break;
      case VoterSentiment.opposition:
        name = "Opposition Lean (🔴)";
        col = const Color(0xFFEF4444);
        break;
      case VoterSentiment.unclassified:
        name = "Unclassified (⚪)";
        col = const Color(0xFF94A3B8);
        break;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: col,
        content: Text("Voter stance updated: $name"),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _editStrategyNotes() {
    final controller = TextEditingController(text: _voter.strategyNotes);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: widget.c.cardBg,
        title: Text("Candidate Strategy Notes", style: TextStyle(color: widget.c.textPrimary)),
        content: TextField(
          controller: controller,
          maxLines: 4,
          style: TextStyle(color: widget.c.textPrimary),
          decoration: InputDecoration(
            hintText: "Enter private notes on this voter or family...",
            filled: true,
            fillColor: widget.c.scaffoldBg,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _voter = _voter.copyWith(strategyNotes: controller.text.trim());
              });
              widget.onVoterUpdated?.call(_voter);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Strategy notes saved successfully.")),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
            child: const Text("Save Notes", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Color sentimentColor;
    switch (_voter.sentiment) {
      case VoterSentiment.favorable:
        sentimentColor = const Color(0xFF10B981);
        break;
      case VoterSentiment.swing:
        sentimentColor = const Color(0xFFF59E0B);
        break;
      case VoterSentiment.opposition:
        sentimentColor = const Color(0xFFEF4444);
        break;
      case VoterSentiment.unclassified:
        sentimentColor = const Color(0xFF94A3B8);
        break;
    }

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        backgroundColor: c.appBarBg,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: c.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Central Voter Dossier",
          style: TextStyle(color: c.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.confirmation_number_outlined, color: Color(0xFF4F46E5)),
            tooltip: "Voter Slip",
            onPressed: () => VoterSlipDialog.show(context, _voter, c),
          ),
          IconButton(
            icon: Icon(Icons.share_outlined, color: c.textSecondary),
            tooltip: "Share Dossier",
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Sharing voter briefing for ${_voter.name}...")),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // HERO PROFILE HEADER CARD
            _buildHeroCard(c, sentimentColor, isDark),
            const SizedBox(height: 16),

            // QUICK ACTIONS BAR (CALL, WHATSAPP, SLIP, MAP)
            _buildQuickActionBar(c),
            const SizedBox(height: 16),

            // SENTIMENT TOGGLE BAR
            _buildSentimentToggleBar(c),
            const SizedBox(height: 20),

            // 13 STRUCTURED SECTIONS
            _buildSectionHeader("13-SECTION ELECTORAL INTELLIGENCE", c),
            const SizedBox(height: 10),

            _buildSectionTile(
              sectionNum: "01",
              title: "Personal Identification",
              icon: Icons.badge_outlined,
              c: c,
              content: Column(
                children: [
                  _infoRow("Full Name (English)", _voter.name, c),
                  _infoRow("Full Name (मराठी)", _voter.nameMr, c),
                  _infoRow("EPIC ID (मतदार ओळखपत्र)", _voter.epic, c, isMono: true),
                  _infoRow("Serial Number", _voter.serialNumber, c, isBold: true),
                  _infoRow("Part / Booth Number", "Booth #${_voter.boothNumber}", c),
                  _infoRow("Constituency", _voter.constituency, c),
                ],
              ),
            ),

            _buildSectionTile(
              sectionNum: "02",
              title: "Demographic Profile",
              icon: Icons.person_outline_rounded,
              c: c,
              content: Column(
                children: [
                  _infoRow("Age", "${_voter.age} Years", c),
                  _infoRow("Gender", _voter.gender == VoterGender.male ? "Male (पुरुष)" : "Female (स्त्री)", c),
                  _infoRow("Date of Birth (Est.)", _voter.dob, c),
                  _infoRow("${_voter.guardianRelation}'s Name", _voter.guardianName, c),
                  _infoRow("Relationship", _voter.guardianRelation, c),
                ],
              ),
            ),

            _buildSectionTile(
              sectionNum: "03",
              title: "Contact Details & Verification",
              icon: Icons.phone_android_rounded,
              c: c,
              content: Column(
                children: [
                  _infoRow("Primary Mobile", "+91 ${_voter.mobile}", c),
                  _infoRow("WhatsApp Number", "+91 ${_voter.whatsapp}", c),
                  _infoRow("Phone Verification", _voter.isPhoneVerified ? "Verified Active (Karyakarta OTP)" : "Unverified", c, isGreen: _voter.isPhoneVerified),
                  if (_voter.alternatePhone.isNotEmpty)
                    _infoRow("Alternate Phone", _voter.alternatePhone, c),
                ],
              ),
            ),

            _buildSectionTile(
              sectionNum: "04",
              title: "Residence & Locus",
              icon: Icons.home_work_outlined,
              c: c,
              content: Column(
                children: [
                  _infoRow("House Number", _voter.houseNumber, c, isBold: true),
                  _infoRow("Building / Wada", _voter.buildingOrChawl, c),
                  _infoRow("Street / Lane", _voter.street, c),
                  _infoRow("Area / Peth", _voter.area, c),
                  _infoRow("Landmark", _voter.landmark, c),
                  _infoRow("Pincode", _voter.pincode, c),
                ],
              ),
            ),

            _buildSectionTile(
              sectionNum: "05",
              title: "Sociological & Community Classification",
              icon: Icons.account_balance_outlined,
              c: c,
              content: Column(
                children: [
                  _infoRow("Community / Caste Group", _voter.communityGroup, c, isBold: true),
                  _infoRow("Sub-Caste", _voter.subCaste, c),
                  _infoRow("Primary Language", _voter.primaryLanguage, c),
                  _infoRow("Community Influence", _voter.isKeyInfluencer ? "High (Community Leader)" : "General Household", c),
                ],
              ),
            ),

            _buildSectionTile(
              sectionNum: "06",
              title: "Political Alignment & Stance",
              icon: Icons.how_to_vote_outlined,
              c: c,
              content: Column(
                children: [
                  _infoRow("Current Sentiment Stance", _voter.sentiment == VoterSentiment.favorable ? "Supporter (अनुकूल)" : (_voter.sentiment == VoterSentiment.swing ? "Swing / Persuadable (डळमळीत)" : "Opposition (प्रतिकूल)"), c, isBold: true),
                  _infoRow("Voting Likelihood", "${_voter.votingLikelihoodPct}% (High Probability)", c),
                  _infoRow("Historical Pattern", _voter.historicalTrend, c),
                ],
              ),
            ),

            _buildSectionTile(
              sectionNum: "07",
              title: "Family Tree & Household Hierarchy",
              icon: Icons.family_restroom_rounded,
              c: c,
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Household ID: ${_voter.familyId}", style: TextStyle(fontSize: 11, fontFamily: 'monospace', color: c.textMuted)),
                      Text("${_voter.familyMembers.length} Registered Voters", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF6366F1))),
                    ],
                  ),
                  const Divider(height: 16),
                  ..._voter.familyMembers.map((fm) => _buildFamilyMemberRow(fm, c)),
                ],
              ),
            ),

            _buildSectionTile(
              sectionNum: "08",
              title: "Doorstep Survey History",
              icon: Icons.fact_check_outlined,
              c: c,
              content: _voter.isSurveyed
                  ? Column(
                      children: [
                        _infoRow("Survey Status", "Completed (Doorstep Visited)", c, isGreen: true),
                        _infoRow("Survey Date", _voter.surveyDate ?? "08 Feb 2026", c),
                        _infoRow("Assigned Karyakarta", _voter.surveyorKaryakarta ?? "Mahesh Deshmukh", c),
                        _infoRow("Karyakarta Phone", "+91 ${_voter.surveyorContact ?? '9822011223'}", c),
                        _infoRow("GPS Geotag", _voter.surveyGpsCoordinates ?? "18.5196° N, 73.8553° E", c, isMono: true),
                        _infoRow("Surveyor Ground Notes", _voter.surveyorNotes ?? "Positive doorstep reception.", c),
                      ],
                    )
                  : Column(
                      children: [
                        _infoRow("Survey Status", "Pending Doorstep Survey", c),
                        const SizedBox(height: 8),
                        Text(
                          "This household has not been visited yet. Assign booth karyakarta to conduct doorstep outreach.",
                          style: TextStyle(fontSize: 11, color: c.textSecondary),
                        ),
                      ],
                    ),
            ),

            _buildSectionTile(
              sectionNum: "09",
              title: "Government Welfare Schemes",
              icon: Icons.volunteer_activism_outlined,
              c: c,
              content: _voter.welfareSchemes.isNotEmpty
                  ? Column(
                      children: _voter.welfareSchemes
                          .map((ws) => _buildWelfareSchemeCard(ws, c))
                          .toList(),
                    )
                  : Text("No government scheme enrollments recorded yet.", style: TextStyle(fontSize: 12, color: c.textMuted)),
            ),

            _buildSectionTile(
              sectionNum: "10",
              title: "Civic Grievances & Service Tickets",
              icon: Icons.report_problem_outlined,
              c: c,
              content: _voter.grievances.isNotEmpty
                  ? Column(
                      children: _voter.grievances
                          .map((g) => _buildGrievanceRow(g, c))
                          .toList(),
                    )
                  : Text("No civic tickets reported from this address.", style: TextStyle(fontSize: 12, color: c.textMuted)),
            ),

            _buildSectionTile(
              sectionNum: "11",
              title: "Campaign Outreach Ledger",
              icon: Icons.history_rounded,
              c: c,
              content: _voter.outreachHistory.isNotEmpty
                  ? Column(
                      children: _voter.outreachHistory
                          .map((outreach) => _buildOutreachRow(outreach, c))
                          .toList(),
                    )
                  : Text("No direct broadcast interaction recorded.", style: TextStyle(fontSize: 12, color: c.textMuted)),
            ),

            _buildSectionTile(
              sectionNum: "12",
              title: "Voter Slip Delivery Status",
              icon: Icons.confirmation_number_outlined,
              c: c,
              content: Column(
                children: [
                  _infoRow("Voter Slip Generated", _voter.isSlipGenerated ? "Yes (QR Encrypted)" : "Pending", c, isGreen: _voter.isSlipGenerated),
                  _infoRow("Delivery Status", _voter.isSlipDistributed ? "Delivered at Doorstep" : "Pending Delivery", c, isGreen: _voter.isSlipDistributed),
                  if (_voter.slipDistributedAt != null)
                    _infoRow("Delivered On", _voter.slipDistributedAt!, c),
                  if (_voter.slipDistributedBy != null)
                    _infoRow("Delivered By", _voter.slipDistributedBy!, c),
                ],
              ),
            ),

            _buildSectionTile(
              sectionNum: "13",
              title: "Candidate Private Strategy Notes & Tags",
              icon: Icons.lock_outline_rounded,
              c: c,
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("EXECUTIVE EYES ONLY", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: const Color(0xFFEF4444))),
                      TextButton.icon(
                        onPressed: _editStrategyNotes,
                        icon: const Icon(Icons.edit_outlined, size: 14),
                        label: const Text("Edit Notes", style: TextStyle(fontSize: 11)),
                      ),
                    ],
                  ),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: c.scaffoldBg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: c.cardBorder),
                    ),
                    child: Text(
                      _voter.strategyNotes.isNotEmpty ? _voter.strategyNotes : "No candidate strategy notes entered. Tap 'Edit Notes' to add.",
                      style: TextStyle(fontSize: 12, height: 1.4, color: c.textPrimary),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: _voter.tags.map((t) {
                      return Chip(
                        label: Text(t, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                        backgroundColor: const Color(0xFF4F46E5).withOpacity(0.12),
                        side: const BorderSide(color: Color(0xFF6366F1)),
                        padding: EdgeInsets.zero,
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroCard(CandidateColors c, Color sentimentColor, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: c.cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Avatar with sentiment border
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: sentimentColor.withOpacity(0.15),
                  border: Border.all(color: sentimentColor, width: 2.5),
                ),
                child: Center(
                  child: Text(
                    _voter.name.isNotEmpty ? _voter.name[0] : "V",
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: sentimentColor),
                  ),
                ),
              ),
              const SizedBox(width: 14),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _voter.name,
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Text(
                      _voter.nameMr,
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: c.textSecondary),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "EPIC: ${_voter.epic}",
                      style: TextStyle(fontSize: 11, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: const Color(0xFF6366F1)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1),
          const SizedBox(height: 10),

          // Meta Row: Booth, Serial, Age, Gender
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _heroMeta("Booth", "Booth #${_voter.boothNumber}", c),
              _heroMeta("Serial", "#${_voter.serialNumber}", c),
              _heroMeta("Age", "${_voter.age} Yrs", c),
              _heroMeta("Gender", _voter.gender == VoterGender.male ? "Male" : "Female", c),
              _heroMeta("House", "#${_voter.houseNumber}", c),
            ],
          ),
        ],
      ),
    );
  }

  Widget _heroMeta(String label, String value, CandidateColors c) {
    return Column(
      children: [
        Text(label, style: TextStyle(fontSize: 10, color: c.textMuted)),
        const SizedBox(height: 2),
        Text(value, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textPrimary)),
      ],
    );
  }

  Widget _buildQuickActionBar(CandidateColors c) {
    return Row(
      children: [
        Expanded(
          child: _quickActionButton(
            icon: Icons.call_rounded,
            label: "Call",
            color: const Color(0xFF10B981),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Calling ${_voter.name} (+91 ${_voter.mobile})...")),
              );
            },
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _quickActionButton(
            icon: Icons.chat_rounded,
            label: "WhatsApp",
            color: const Color(0xFF22C55E),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Opening WhatsApp message to ${_voter.name}...")),
              );
            },
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _quickActionButton(
            icon: Icons.confirmation_number_outlined,
            label: "Voter Slip",
            color: const Color(0xFF4F46E5),
            onTap: () => VoterSlipDialog.show(context, _voter, c),
          ),
        ),
      ],
    );
  }

  Widget _quickActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color)),
          ],
        ),
      ),
    );
  }

  Widget _buildSentimentToggleBar(CandidateColors c) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: c.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "POLITICAL SENTIMENT CLASSIFICATION",
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0, color: c.textMuted),
              ),
              const Icon(Icons.touch_app_rounded, size: 14, color: Color(0xFF6366F1)),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _sentimentChoiceChip(
                  label: "Supporter",
                  sentiment: VoterSentiment.favorable,
                  color: const Color(0xFF10B981),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: _sentimentChoiceChip(
                  label: "Swing",
                  sentiment: VoterSentiment.swing,
                  color: const Color(0xFFF59E0B),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: _sentimentChoiceChip(
                  label: "Opposition",
                  sentiment: VoterSentiment.opposition,
                  color: const Color(0xFFEF4444),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _sentimentChoiceChip({
    required String label,
    required VoterSentiment sentiment,
    required Color color,
  }) {
    final isSelected = _voter.sentiment == sentiment;
    return InkWell(
      onTap: () => _updateSentiment(sentiment),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? color : color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color, width: isSelected ? 1.8 : 1),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : color,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, CandidateColors c) {
    return Text(
      title,
      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: c.textMuted),
    );
  }

  Widget _buildSectionTile({
    required String sectionNum,
    required String title,
    required IconData icon,
    required CandidateColors c,
    required Widget content,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: c.cardBorder),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          initiallyExpanded: sectionNum == "01" || sectionNum == "07" || sectionNum == "08",
          leading: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: const Color(0xFF4F46E5).withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(icon, size: 18, color: const Color(0xFF6366F1)),
          ),
          title: Text(
            "$sectionNum. $title",
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
          ),
          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          children: [content],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value, CandidateColors c, {bool isBold = false, bool isMono = false, bool isGreen = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: c.textSecondary)),
          const SizedBox(width: 12),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
                fontFamily: isMono ? 'monospace' : null,
                color: isGreen ? const Color(0xFF10B981) : c.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFamilyMemberRow(FamilyMember fm, CandidateColors c) {
    Color col;
    switch (fm.sentiment) {
      case VoterSentiment.favorable:
        col = const Color(0xFF10B981);
        break;
      case VoterSentiment.swing:
        col = const Color(0xFFF59E0B);
        break;
      case VoterSentiment.opposition:
        col = const Color(0xFFEF4444);
        break;
      case VoterSentiment.unclassified:
        col = const Color(0xFF94A3B8);
        break;
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(shape: BoxShape.circle, color: col),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(fm.name, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                Text("${fm.relation} • ${fm.age} Yrs • EPIC: ${fm.epic}", style: TextStyle(fontSize: 10, color: c.textMuted)),
              ],
            ),
          ),
          if (fm.isHead)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF4F46E5).withOpacity(0.12),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Text("Head", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF6366F1))),
            ),
        ],
      ),
    );
  }

  Widget _buildWelfareSchemeCard(WelfareSchemeItem ws, CandidateColors c) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFF10B981).withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF10B981).withOpacity(0.2)),
      ),
      child: Row(
        children: [
          const Icon(Icons.verified_rounded, size: 20, color: Color(0xFF10B981)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(ws.schemeName, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                Text(ws.schemeNameMr, style: TextStyle(fontSize: 11, color: c.textSecondary)),
                Text(ws.benefitDetails, style: TextStyle(fontSize: 10, color: const Color(0xFF10B981))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGrievanceRow(CivicGrievanceItem g, CandidateColors c) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: c.scaffoldBg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: c.cardBorder),
      ),
      child: Row(
        children: [
          const Icon(Icons.report_problem_outlined, size: 18, color: Color(0xFFEF4444)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(g.title, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                Text("${g.category} • Reported: ${g.reportedDate}", style: TextStyle(fontSize: 10, color: c.textMuted)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: const Color(0xFFF59E0B).withOpacity(0.12),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(g.status, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFFD97706))),
          ),
        ],
      ),
    );
  }

  Widget _buildOutreachRow(CampaignOutreachItem o, CandidateColors c) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            o.channel == "WhatsApp" ? Icons.chat_rounded : Icons.record_voice_over_rounded,
            size: 16,
            color: o.channel == "WhatsApp" ? const Color(0xFF22C55E) : const Color(0xFF6366F1),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(o.title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textPrimary)),
                Text("${o.channel} • ${o.date}", style: TextStyle(fontSize: 10, color: c.textMuted)),
              ],
            ),
          ),
          Text(o.status, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF10B981))),
        ],
      ),
    );
  }
}
