import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/voter_model.dart';

class VoterFilterState {
  String sentiment;
  String community;
  String ageBracket;
  String gender;
  int? boothNumber;
  String surveyStatus;
  String slipStatus;
  bool onlyInfluencers;
  bool onlyFamilyHeads;
  bool onlyWelfareBeneficiaries;

  VoterFilterState({
    this.sentiment = "All",
    this.community = "All",
    this.ageBracket = "All",
    this.gender = "All",
    this.boothNumber,
    this.surveyStatus = "All",
    this.slipStatus = "All",
    this.onlyInfluencers = false,
    this.onlyFamilyHeads = false,
    this.onlyWelfareBeneficiaries = false,
  });

  bool get isDefault =>
      sentiment == "All" &&
      community == "All" &&
      ageBracket == "All" &&
      gender == "All" &&
      boothNumber == null &&
      surveyStatus == "All" &&
      slipStatus == "All" &&
      !onlyInfluencers &&
      !onlyFamilyHeads &&
      !onlyWelfareBeneficiaries;

  void reset() {
    sentiment = "All";
    community = "All";
    ageBracket = "All";
    gender = "All";
    boothNumber = null;
    surveyStatus = "All";
    slipStatus = "All";
    onlyInfluencers = false;
    onlyFamilyHeads = false;
    onlyWelfareBeneficiaries = false;
  }
}

class VoterFilterSheet extends StatefulWidget {
  final VoterFilterState initialFilter;
  final CandidateColors c;
  final Function(VoterFilterState) onApply;

  const VoterFilterSheet({
    super.key,
    required this.initialFilter,
    required this.c,
    required this.onApply,
  });

  static void show(
    BuildContext context,
    VoterFilterState filter,
    CandidateColors c,
    Function(VoterFilterState) onApply,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => VoterFilterSheet(
        initialFilter: filter,
        c: c,
        onApply: onApply,
      ),
    );
  }

  @override
  State<VoterFilterSheet> createState() => _VoterFilterSheetState();
}

class _VoterFilterSheetState extends State<VoterFilterSheet> {
  late VoterFilterState _state;

  @override
  void initState() {
    super.initState();
    // Copy state
    _state = VoterFilterState(
      sentiment: widget.initialFilter.sentiment,
      community: widget.initialFilter.community,
      ageBracket: widget.initialFilter.ageBracket,
      gender: widget.initialFilter.gender,
      boothNumber: widget.initialFilter.boothNumber,
      surveyStatus: widget.initialFilter.surveyStatus,
      slipStatus: widget.initialFilter.slipStatus,
      onlyInfluencers: widget.initialFilter.onlyInfluencers,
      onlyFamilyHeads: widget.initialFilter.onlyFamilyHeads,
      onlyWelfareBeneficiaries: widget.initialFilter.onlyWelfareBeneficiaries,
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    return Container(
      padding: const EdgeInsets.all(20),
      height: MediaQuery.of(context).size.height * 0.85,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.tune_rounded, color: Color(0xFF4F46E5), size: 22),
                  const SizedBox(width: 8),
                  Text(
                    "Advanced Voter Filters",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: c.textPrimary),
                  ),
                ],
              ),
              TextButton(
                onPressed: () {
                  setState(() => _state.reset());
                },
                child: const Text("Reset All", style: TextStyle(color: Color(0xFFEF4444), fontSize: 12)),
              ),
            ],
          ),
          const Divider(height: 16),

          // Scrollable Filter Sections
          Expanded(
            child: ListView(
              children: [
                _buildFilterGroup(
                  title: "POLITICAL SENTIMENT STANCE",
                  options: ["All", "Supporter", "Swing Voter", "Opposition"],
                  selected: _state.sentiment,
                  onSelect: (val) => setState(() => _state.sentiment = val),
                  c: c,
                ),
                const SizedBox(height: 14),

                _buildFilterGroup(
                  title: "COMMUNITY / CASTE GROUP",
                  options: ["All", "Maratha", "Brahmin", "OBC", "SC", "Minority"],
                  selected: _state.community,
                  onSelect: (val) => setState(() => _state.community = val),
                  c: c,
                ),
                const SizedBox(height: 14),

                _buildFilterGroup(
                  title: "AGE DEMOGRAPHIC",
                  options: ["All", "Youth (<30)", "Middle Aged (30-59)", "Senior (60+)"],
                  selected: _state.ageBracket,
                  onSelect: (val) => setState(() => _state.ageBracket = val),
                  c: c,
                ),
                const SizedBox(height: 14),

                _buildFilterGroup(
                  title: "GENDER",
                  options: ["All", "Male", "Female"],
                  selected: _state.gender,
                  onSelect: (val) => setState(() => _state.gender = val),
                  c: c,
                ),
                const SizedBox(height: 14),

                _buildFilterGroup(
                  title: "DOORSTEP SURVEY STATUS",
                  options: ["All", "Survey Completed", "Unvisited Doorstep"],
                  selected: _state.surveyStatus,
                  onSelect: (val) => setState(() => _state.surveyStatus = val),
                  c: c,
                ),
                const SizedBox(height: 14),

                _buildFilterGroup(
                  title: "VOTER SLIP DELIVERY",
                  options: ["All", "Delivered", "Pending Delivery"],
                  selected: _state.slipStatus,
                  onSelect: (val) => setState(() => _state.slipStatus = val),
                  c: c,
                ),
                const SizedBox(height: 16),

                // Special Toggles
                Text(
                  "SPECIAL STRATEGIC TAGS",
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: c.textMuted),
                ),
                const SizedBox(height: 8),

                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  title: const Text("Key Opinion Leaders (Influencers)", style: TextStyle(fontSize: 13)),
                  subtitle: const Text("Influences society or mandal voting blocks", style: TextStyle(fontSize: 10)),
                  value: _state.onlyInfluencers,
                  activeColor: const Color(0xFF4F46E5),
                  onChanged: (v) => setState(() => _state.onlyInfluencers = v),
                ),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  title: const Text("Head of Family Only", style: TextStyle(fontSize: 13)),
                  subtitle: const Text("Primary household decision maker", style: TextStyle(fontSize: 10)),
                  value: _state.onlyFamilyHeads,
                  activeColor: const Color(0xFF4F46E5),
                  onChanged: (v) => setState(() => _state.onlyFamilyHeads = v),
                ),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  title: const Text("Welfare Beneficiaries (Ladki Bahin, PM Awas)", style: TextStyle(fontSize: 13)),
                  subtitle: const Text("Enrolled in state or central welfare schemes", style: TextStyle(fontSize: 10)),
                  value: _state.onlyWelfareBeneficiaries,
                  activeColor: const Color(0xFF4F46E5),
                  onChanged: (v) => setState(() => _state.onlyWelfareBeneficiaries = v),
                ),
              ],
            ),
          ),

          // Apply Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {
                widget.onApply(_state);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text("Apply Segmented Filters", style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterGroup({
    required String title,
    required List<String> options,
    required String selected,
    required Function(String) onSelect,
    required CandidateColors c,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: c.textMuted),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: options.map((opt) {
            final isSel = selected == opt;
            return ChoiceChip(
              label: Text(opt),
              selected: isSel,
              selectedColor: const Color(0xFF4F46E5),
              backgroundColor: c.scaffoldBg,
              labelStyle: TextStyle(
                fontSize: 11,
                fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                color: isSel ? Colors.white : c.textSecondary,
              ),
              side: BorderSide(color: isSel ? const Color(0xFF4F46E5) : c.cardBorder),
              onSelected: (val) {
                if (val) onSelect(opt);
              },
            );
          }).toList(),
        ),
      ],
    );
  }
}
