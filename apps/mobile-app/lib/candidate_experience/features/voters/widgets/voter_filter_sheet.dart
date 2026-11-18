import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/voter_model.dart';

class VoterFilterState {
  Set<String> sentiments;
  Set<String> communities;
  Set<String> ageBrackets;
  Set<int> booths;
  String gender;
  String surveyStatus;
  String slipStatus;
  bool onlyInfluencers;
  bool onlyFamilyHeads;
  bool onlyWelfareBeneficiaries;

  VoterFilterState({
    Set<String>? sentiments,
    Set<String>? communities,
    Set<String>? ageBrackets,
    Set<int>? booths,
    this.gender = "All",
    this.surveyStatus = "All",
    this.slipStatus = "All",
    this.onlyInfluencers = false,
    this.onlyFamilyHeads = false,
    this.onlyWelfareBeneficiaries = false,
  })  : sentiments = sentiments ?? {},
        communities = communities ?? {},
        ageBrackets = ageBrackets ?? {},
        booths = booths ?? {};

  // Backward compatibility getters
  String get sentiment => sentiments.isEmpty ? "All" : sentiments.first;
  String get community => communities.isEmpty ? "All" : communities.first;
  String get ageBracket => ageBrackets.isEmpty ? "All" : ageBrackets.first;
  int? get boothNumber => booths.isEmpty ? null : booths.first;

  bool get isDefault =>
      sentiments.isEmpty &&
      communities.isEmpty &&
      ageBrackets.isEmpty &&
      booths.isEmpty &&
      gender == "All" &&
      surveyStatus == "All" &&
      slipStatus == "All" &&
      !onlyInfluencers &&
      !onlyFamilyHeads &&
      !onlyWelfareBeneficiaries;

  void reset() {
    sentiments.clear();
    communities.clear();
    ageBrackets.clear();
    booths.clear();
    gender = "All";
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
    // Clone state
    _state = VoterFilterState(
      sentiments: Set.from(widget.initialFilter.sentiments),
      communities: Set.from(widget.initialFilter.communities),
      ageBrackets: Set.from(widget.initialFilter.ageBrackets),
      booths: Set.from(widget.initialFilter.booths),
      gender: widget.initialFilter.gender,
      surveyStatus: widget.initialFilter.surveyStatus,
      slipStatus: widget.initialFilter.slipStatus,
      onlyInfluencers: widget.initialFilter.onlyInfluencers,
      onlyFamilyHeads: widget.initialFilter.onlyFamilyHeads,
      onlyWelfareBeneficiaries: widget.initialFilter.onlyWelfareBeneficiaries,
    );
  }

  int get _activeCount {
    int cnt = 0;
    cnt += _state.sentiments.length;
    cnt += _state.communities.length;
    cnt += _state.ageBrackets.length;
    cnt += _state.booths.length;
    if (_state.gender != "All") cnt++;
    if (_state.surveyStatus != "All") cnt++;
    if (_state.slipStatus != "All") cnt++;
    if (_state.onlyInfluencers) cnt++;
    if (_state.onlyFamilyHeads) cnt++;
    if (_state.onlyWelfareBeneficiaries) cnt++;
    return cnt;
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    return Container(
      padding: const EdgeInsets.all(20),
      height: MediaQuery.of(context).size.height * 0.88,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6256D9).withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.tune_rounded, color: Color(0xFF6256D9), size: 20),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Advanced Voter Filters",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
                      ),
                      Text(
                        "$_activeCount filters currently active",
                        style: TextStyle(fontSize: 10, color: c.textSecondary),
                      ),
                    ],
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () {
                  setState(() => _state.reset());
                },
                icon: const Icon(Icons.restart_alt_rounded, size: 14, color: Color(0xFFEF4444)),
                label: const Text("Reset All", style: TextStyle(color: Color(0xFFEF4444), fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Divider(height: 1),
          const SizedBox(height: 10),

          // Scrollable Multi-Select Accordions (Legacy Election Software Layout)
          Expanded(
            child: ListView(
              children: [
                // Accordion 1: Community / Caste Multi-Select
                _buildMultiSelectAccordion(
                  title: "CASTE / COMMUNITY GROUP",
                  subtitle: _state.communities.isEmpty ? "All Communities" : "${_state.communities.length} Selected",
                  icon: Icons.groups_rounded,
                  options: ["Maratha", "Brahmin", "OBC", "SC", "Minority", "Vyapari / Jain", "Other"],
                  selectedItems: _state.communities,
                  onToggle: (item) {
                    setState(() {
                      if (_state.communities.contains(item)) {
                        _state.communities.remove(item);
                      } else {
                        _state.communities.add(item);
                      }
                    });
                  },
                ),

                // Accordion 2: Polling Station & Booths Multi-Select
                _buildMultiSelectAccordion(
                  title: "POLLING STATION & BOOTHS",
                  subtitle: _state.booths.isEmpty ? "All 215 Polling Booths" : "${_state.booths.length} Booths Selected",
                  icon: Icons.how_to_vote_rounded,
                  options: ["Booth #42", "Booth #104", "Booth #78", "Booth #15", "Booth #162", "Booth #198"],
                  selectedItems: _state.booths.map((b) => "Booth #$b").toSet(),
                  onToggle: (item) {
                    final bNum = int.tryParse(item.replaceAll("Booth #", "")) ?? 42;
                    setState(() {
                      if (_state.booths.contains(bNum)) {
                        _state.booths.remove(bNum);
                      } else {
                        _state.booths.add(bNum);
                      }
                    });
                  },
                ),

                // Accordion 3: Voting Stance / Inclination Multi-Select
                _buildMultiSelectAccordion(
                  title: "VOTING STANCE / INCLINATION",
                  subtitle: _state.sentiments.isEmpty ? "All Stances" : "${_state.sentiments.length} Selected",
                  icon: Icons.thumbs_up_down_rounded,
                  options: ["Supporter", "Swing Voter", "Opposition"],
                  selectedItems: _state.sentiments,
                  onToggle: (item) {
                    setState(() {
                      if (_state.sentiments.contains(item)) {
                        _state.sentiments.remove(item);
                      } else {
                        _state.sentiments.add(item);
                      }
                    });
                  },
                ),

                // Accordion 4: Age Demographic Brackets Multi-Select
                _buildMultiSelectAccordion(
                  title: "AGE DEMOGRAPHIC BRACKETS",
                  subtitle: _state.ageBrackets.isEmpty ? "All Age Groups" : "${_state.ageBrackets.length} Selected",
                  icon: Icons.cake_rounded,
                  options: ["18-25 (Youth First-Time)", "26-40 (Working Professionals)", "41-60 (Middle-Aged)", "60+ (Senior Citizens)"],
                  selectedItems: _state.ageBrackets,
                  onToggle: (item) {
                    setState(() {
                      if (_state.ageBrackets.contains(item)) {
                        _state.ageBrackets.remove(item);
                      } else {
                        _state.ageBrackets.add(item);
                      }
                    });
                  },
                ),

                // Accordion 5: Special Tactical Tags & Household Toggles
                Theme(
                  data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    decoration: BoxDecoration(
                      color: widget.c.scaffoldBg,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: widget.c.cardBorder),
                    ),
                    child: ExpansionTile(
                      leading: const Icon(Icons.star_rounded, color: Color(0xFF6256D9), size: 20),
                      title: Text(
                        "SPECIAL TACTICAL TAGS",
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.8, color: widget.c.textPrimary),
                      ),
                      subtitle: Text(
                        "Influencers, Family Heads & Schemes",
                        style: TextStyle(fontSize: 9.5, color: widget.c.textSecondary),
                      ),
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(14, 0, 14, 12),
                          child: Column(
                            children: [
                              SwitchListTile(
                                contentPadding: EdgeInsets.zero,
                                dense: true,
                                title: const Text("Key Opinion Leaders (Influencers)", style: TextStyle(fontSize: 12)),
                                subtitle: const Text("Society / mandal decision makers", style: TextStyle(fontSize: 9.5)),
                                value: _state.onlyInfluencers,
                                activeColor: const Color(0xFF6256D9),
                                onChanged: (v) => setState(() => _state.onlyInfluencers = v),
                              ),
                              SwitchListTile(
                                contentPadding: EdgeInsets.zero,
                                dense: true,
                                title: const Text("Head of Family Only", style: TextStyle(fontSize: 12)),
                                subtitle: const Text("Primary household voter", style: TextStyle(fontSize: 9.5)),
                                value: _state.onlyFamilyHeads,
                                activeColor: const Color(0xFF6256D9),
                                onChanged: (v) => setState(() => _state.onlyFamilyHeads = v),
                              ),
                              SwitchListTile(
                                contentPadding: EdgeInsets.zero,
                                dense: true,
                                title: const Text("Welfare Beneficiaries (Ladki Bahin, PM Awas)", style: TextStyle(fontSize: 12)),
                                subtitle: const Text("Enrolled in state or central welfare DBT", style: TextStyle(fontSize: 9.5)),
                                value: _state.onlyWelfareBeneficiaries,
                                activeColor: const Color(0xFF6256D9),
                                onChanged: (v) => setState(() => _state.onlyWelfareBeneficiaries = v),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Apply Button
          SizedBox(
            width: double.infinity,
            height: 46,
            child: ElevatedButton.icon(
              onPressed: () {
                widget.onApply(_state);
                Navigator.pop(context);
              },
              icon: const Icon(Icons.check_rounded, size: 18),
              label: Text("Apply Filters ($_activeCount Active)", style: const TextStyle(fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6256D9),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMultiSelectAccordion({
    required String title,
    required String subtitle,
    required IconData icon,
    required List<String> options,
    required Set<String> selectedItems,
    required Function(String) onToggle,
  }) {
    final c = widget.c;
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: c.scaffoldBg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selectedItems.isNotEmpty ? const Color(0xFF6256D9).withOpacity(0.5) : c.cardBorder,
          ),
        ),
        child: ExpansionTile(
          leading: Icon(icon, color: selectedItems.isNotEmpty ? const Color(0xFF6256D9) : c.textSecondary, size: 20),
          title: Text(
            title,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.8,
              color: c.textPrimary,
            ),
          ),
          subtitle: Text(
            subtitle,
            style: TextStyle(
              fontSize: 9.5,
              fontWeight: selectedItems.isNotEmpty ? FontWeight.bold : FontWeight.normal,
              color: selectedItems.isNotEmpty ? const Color(0xFF6256D9) : c.textSecondary,
            ),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 12),
              child: Wrap(
                spacing: 6,
                runSpacing: 6,
                children: options.map((opt) {
                  final isSel = selectedItems.contains(opt);
                  return FilterChip(
                    label: Text(opt),
                    selected: isSel,
                    selectedColor: const Color(0xFF6256D9).withOpacity(0.18),
                    backgroundColor: c.cardBg,
                    checkmarkColor: const Color(0xFF6256D9),
                    labelStyle: TextStyle(
                      fontSize: 10.5,
                      fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                      color: isSel ? const Color(0xFF6256D9) : c.textPrimary,
                    ),
                    side: BorderSide(
                      color: isSel ? const Color(0xFF6256D9) : c.cardBorder,
                    ),
                    onSelected: (_) => onToggle(opt),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
