import 'package:flutter/material.dart';
import '../../core/theme/candidate_theme.dart';
import 'models/voter_model.dart';
import 'data/voters_mock_data.dart';
import 'widgets/voter_card.dart';
import 'widgets/voter_filter_sheet.dart';
import 'screens/voter_profile_screen.dart';

class VotersScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final Function(String)? onOpenVoterDossier;

  const VotersScreen({
    super.key,
    required this.c,
    required this.isDark,
    this.onOpenVoterDossier,
  });

  @override
  State<VotersScreen> createState() => _VotersScreenState();
}

class _VotersScreenState extends State<VotersScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<VoterModel> _allVoters = [];
  String _activeQuickFilter = "All";
  VoterFilterState _filterState = VoterFilterState();
  String _sortBy = "Serial"; // Serial, Name, Age, House

  final List<String> _quickFilterList = [
    "All",
    "Confirmed Supporters (🟢)",
    "Swing / Doubtful (🟡)",
    "Opponent Core (🔴)",
    "Youth (<30)",
    "Middle Aged (30-59)",
    "Senior Citizens (60+)",
    "Female Voters",
    "Male Voters",
    "Unvisited Doorstep",
    "Survey Completed",
    "Key Influencers",
    "Head of Family",
    "Booth #42",
    "Booth #104",
    "Booth #78",
    "Booth #15",
    "Booth #162",
    "Booth #198",
    "Ladki Bahin Beneficiaries",
    "PM Awas Beneficiaries",
    "Open Grievance Tickets",
  ];

  @override
  void initState() {
    super.initState();
    _allVoters = List.from(VotersMockData.voters);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<VoterModel> get _filteredVoters {
    final q = _searchController.text.trim().toLowerCase();

    return _allVoters.where((v) {
      // 1. Search Query (Bilingual English / Marathi / EPIC / House / Mobile)
      if (q.isNotEmpty) {
        final matchName = v.name.toLowerCase().contains(q);
        final matchNameMr = v.nameMr.contains(q);
        final matchEpic = v.epic.toLowerCase().contains(q);
        final matchHouse = v.houseNumber.toLowerCase().contains(q);
        final matchMobile = v.mobile.contains(q);
        final matchArea = v.area.toLowerCase().contains(q);

        if (!matchName && !matchNameMr && !matchEpic && !matchHouse && !matchMobile && !matchArea) {
          return false;
        }
      }

      // 2. 22 Quick Filters
      if (_activeQuickFilter != "All") {
        if (_activeQuickFilter.startsWith("Confirmed Supporters") && v.sentiment != VoterSentiment.favorable) return false;
        if (_activeQuickFilter.startsWith("Swing / Doubtful") && v.sentiment != VoterSentiment.swing) return false;
        if (_activeQuickFilter.startsWith("Opponent Core") && v.sentiment != VoterSentiment.opposition) return false;
        if (_activeQuickFilter.startsWith("Youth") && v.age >= 30) return false;
        if (_activeQuickFilter.startsWith("Middle Aged") && (v.age < 30 || v.age >= 60)) return false;
        if (_activeQuickFilter.startsWith("Senior Citizens") && v.age < 60) return false;
        if (_activeQuickFilter == "Female Voters" && v.gender != VoterGender.female) return false;
        if (_activeQuickFilter == "Male Voters" && v.gender != VoterGender.male) return false;
        if (_activeQuickFilter == "Unvisited Doorstep" && v.isSurveyed) return false;
        if (_activeQuickFilter == "Survey Completed" && !v.isSurveyed) return false;
        if (_activeQuickFilter == "Key Influencers" && !v.isKeyInfluencer) return false;
        if (_activeQuickFilter == "Head of Family" && !v.isHeadOfFamily) return false;
        if (_activeQuickFilter == "Booth #42" && v.boothNumber != 42) return false;
        if (_activeQuickFilter == "Booth #104" && v.boothNumber != 104) return false;
        if (_activeQuickFilter == "Booth #78" && v.boothNumber != 78) return false;
        if (_activeQuickFilter == "Booth #15" && v.boothNumber != 15) return false;
        if (_activeQuickFilter == "Booth #162" && v.boothNumber != 162) return false;
        if (_activeQuickFilter == "Booth #198" && v.boothNumber != 198) return false;
        if (_activeQuickFilter.startsWith("Ladki Bahin") && !v.welfareSchemes.any((w) => w.schemeName.contains("Ladki Bahin"))) return false;
        if (_activeQuickFilter.startsWith("PM Awas") && !v.welfareSchemes.any((w) => w.schemeName.contains("Awas"))) return false;
        if (_activeQuickFilter.startsWith("Open Grievance") && v.grievances.isEmpty) return false;
      }

      // 3. Advanced Sheet Filter
      if (!_filterState.isDefault) {
        if (_filterState.sentiment == "Supporter" && v.sentiment != VoterSentiment.favorable) return false;
        if (_filterState.sentiment == "Swing Voter" && v.sentiment != VoterSentiment.swing) return false;
        if (_filterState.sentiment == "Opposition" && v.sentiment != VoterSentiment.opposition) return false;

        if (_filterState.community != "All" && v.communityGroup != _filterState.community) return false;

        if (_filterState.ageBracket == "Youth (<30)" && v.age >= 30) return false;
        if (_filterState.ageBracket == "Middle Aged (30-59)" && (v.age < 30 || v.age >= 60)) return false;
        if (_filterState.ageBracket == "Senior (60+)" && v.age < 60) return false;

        if (_filterState.gender == "Male" && v.gender != VoterGender.male) return false;
        if (_filterState.gender == "Female" && v.gender != VoterGender.female) return false;

        if (_filterState.surveyStatus == "Survey Completed" && !v.isSurveyed) return false;
        if (_filterState.surveyStatus == "Unvisited Doorstep" && v.isSurveyed) return false;

        if (_filterState.slipStatus == "Delivered" && !v.isSlipDistributed) return false;
        if (_filterState.slipStatus == "Pending Delivery" && v.isSlipDistributed) return false;

        if (_filterState.onlyInfluencers && !v.isKeyInfluencer) return false;
        if (_filterState.onlyFamilyHeads && !v.isHeadOfFamily) return false;
        if (_filterState.onlyWelfareBeneficiaries && v.welfareSchemes.isEmpty) return false;
      }

      return true;
    }).toList()
      ..sort((a, b) {
        if (_sortBy == "Name") return a.name.compareTo(b.name);
        if (_sortBy == "Age") return a.age.compareTo(b.age);
        if (_sortBy == "House") return a.houseNumber.compareTo(b.houseNumber);
        return a.serialNumber.compareTo(b.serialNumber); // default
      });
  }

  void _openDossier(VoterModel voter) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => VoterProfileScreen(
          voter: voter,
          c: widget.c,
          onVoterUpdated: (updated) {
            setState(() {
              final idx = _allVoters.indexWhere((x) => x.id == updated.id);
              if (idx != -1) {
                _allVoters[idx] = updated;
              }
            });
          },
        ),
      ),
    );
  }

  void _showSortDialog() {
    showDialog(
      context: context,
      builder: (ctx) => SimpleDialog(
        backgroundColor: widget.c.cardBg,
        title: Text("Sort Electorate By", style: TextStyle(color: widget.c.textPrimary)),
        children: [
          _sortOption("Serial Number (Electoral Roll)", "Serial"),
          _sortOption("Voter Name (A to Z)", "Name"),
          _sortOption("Voter Age (Ascending)", "Age"),
          _sortOption("House Number", "House"),
        ],
      ),
    );
  }

  Widget _sortOption(String label, String key) {
    final isSel = _sortBy == key;
    return SimpleDialogOption(
      onPressed: () {
        setState(() => _sortBy = key);
        Navigator.pop(context);
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, fontWeight: isSel ? FontWeight.bold : FontWeight.normal, color: widget.c.textPrimary)),
          if (isSel) const Icon(Icons.check_rounded, size: 18, color: Color(0xFF4F46E5)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final results = _filteredVoters;

    return Column(
      children: [
        // 1. Search Bar & Filter Buttons
        Container(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
          color: c.appBarBg,
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      style: TextStyle(color: c.textPrimary, fontSize: 13),
                      decoration: InputDecoration(
                        hintText: "Search Name, मराठी नाव, EPIC, House...",
                        hintStyle: TextStyle(fontSize: 12, color: c.textMuted),
                        prefixIcon: const Icon(Icons.search_rounded, size: 20, color: Color(0xFF6366F1)),
                        suffixIcon: _searchController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear_rounded, size: 18),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() {});
                                },
                              )
                            : null,
                        filled: true,
                        fillColor: c.cardBg,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: c.cardBorder),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: c.cardBorder),
                        ),
                      ),
                      onChanged: (_) => setState(() {}),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Filter Trigger Button
                  InkWell(
                    onTap: () {
                      VoterFilterSheet.show(context, _filterState, c, (applied) {
                        setState(() => _filterState = applied);
                      });
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: !_filterState.isDefault ? const Color(0xFF4F46E5) : c.cardBg,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: c.cardBorder),
                      ),
                      child: Icon(
                        Icons.tune_rounded,
                        size: 20,
                        color: !_filterState.isDefault ? Colors.white : c.textSecondary,
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),

                  // Sort Button
                  InkWell(
                    onTap: _showSortDialog,
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: c.cardBg,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: c.cardBorder),
                      ),
                      child: Icon(Icons.sort_rounded, size: 20, color: c.textSecondary),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // 2. Horizontal 22 Quick Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _quickFilterList.map((filter) {
                    final isSel = _activeQuickFilter == filter;
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        label: Text(filter),
                        selected: isSel,
                        selectedColor: const Color(0xFF4F46E5),
                        backgroundColor: c.cardBg,
                        labelStyle: TextStyle(
                          fontSize: 11,
                          fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                          color: isSel ? Colors.white : c.textSecondary,
                        ),
                        side: BorderSide(color: isSel ? const Color(0xFF4F46E5) : c.cardBorder),
                        onSelected: (val) {
                          if (val) setState(() => _activeQuickFilter = filter);
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),

        // 3. Electorate Results Counter
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          color: c.scaffoldBg,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Displaying ${results.length} of 248,510 Voters",
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textMuted),
              ),
              Text(
                "Sort: $_sortBy",
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF6366F1)),
              ),
            ],
          ),
        ),

        // 4. Voters List or Empty State
        Expanded(
          child: results.isNotEmpty
              ? ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 6, 16, 24),
                  itemCount: results.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final voter = results[index];
                    return VoterCard(
                      voter: voter,
                      c: c,
                      onTap: () => _openDossier(voter),
                    );
                  },
                )
              : Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.person_search_rounded, size: 54, color: c.textMuted),
                      const SizedBox(height: 12),
                      Text(
                        "No matching voters found",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: c.textPrimary),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        "Try clearing your search query or reset filter parameters.",
                        style: TextStyle(fontSize: 12, color: c.textSecondary),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _searchController.clear();
                            _activeQuickFilter = "All";
                            _filterState.reset();
                          });
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
                        child: const Text("Reset All Filters", style: TextStyle(color: Colors.white, fontSize: 12)),
                      ),
                    ],
                  ),
                ),
        ),
      ],
    );
  }
}
