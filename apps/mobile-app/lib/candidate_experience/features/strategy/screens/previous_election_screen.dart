import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/historical_election_model.dart';
import '../data/strategy_mock_data.dart';

class PreviousElectionScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const PreviousElectionScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<PreviousElectionScreen> createState() => _PreviousElectionScreenState();
}

class _PreviousElectionScreenState extends State<PreviousElectionScreen> {
  int _selectedSegment = 0; // 0: Past Results, 1: Peth Swing & Playbooks, 2: Strategy Bot
  int _selectedElectionIndex = 0;

  // Active Subscription Tier Simulation (Tier 1: 2024 only, Tier 2: 2024 & 2023, Tier 3: 2024-2019, Tier 4: Full Archives)
  int _activeTier = 3; // Default Tier 3: Election Mode + AI

  // Strategy Bot
  final TextEditingController _botQueryController = TextEditingController();
  final List<Map<String, String>> _chatHistory = [
    {
      "role": "bot",
      "text":
          "Namaskar Adv. Vikram Patil. I am your RAJTANTRA Historical Election & Strategic War Room Bot. Tap any query below or ask about booth trends, swing dynamics, or past voting patterns."
    }
  ];

  bool _isElectionUnlocked(int year) {
    if (year >= 2024) return _activeTier >= 1;
    if (year == 2023) return _activeTier >= 2;
    if (year == 2019) return _activeTier >= 3;
    return _activeTier >= 4; // 2014, 2009 requires Tier 4
  }

  String _requiredTierFor(int year) {
    if (year >= 2024) return "Tier 1";
    if (year == 2023) return "Tier 2";
    if (year == 2019) return "Tier 3";
    return "Tier 4";
  }

  String get _tierName {
    switch (_activeTier) {
      case 1:
        return "Tier 1: Election Mode (2024 Only)";
      case 2:
        return "Tier 2: Office Mode (2023-2024)";
      case 3:
        return "Tier 3: Election + AI (2019-2024)";
      case 4:
      default:
        return "Tier 4: Office + AI (Full Archives 2009-2024)";
    }
  }

  void _showLockedElectionDialog(HistoricalElection e) {
    final reqTier = _requiredTierFor(e.year);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: widget.c.cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.14),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.lock_clock_rounded, color: Colors.amber, size: 22),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Historical Archive Gated",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                  ),
                  Text(
                    "Requires $reqTier License",
                    style: TextStyle(fontSize: 10, color: widget.c.textSecondary),
                  ),
                ],
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Booth-level turnout records, margin swings, and candidate analyses for the ${e.name} are restricted under your current license.",
              style: TextStyle(fontSize: 11.5, color: widget.c.textSecondary, height: 1.4),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: widget.isDark ? const Color(0xFF141417) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: widget.c.cardBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "CURRENT PLAN: $_tierName",
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: widget.c.textMuted),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "To unlock full 15-year historical intelligence (2009–2024), upgrade your constituency license to Tier 4: Office Mode + AI.",
                    style: TextStyle(fontSize: 10.5, color: widget.c.textPrimary),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Dismiss", style: TextStyle(color: widget.c.textSecondary)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              Clipboard.setData(const ClipboardData(text: "+919822011234"));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: Color(0xFF10B981),
                  content: Text("Calling Sales Team (+91 98220 11234)... Number copied to dialer."),
                ),
              );
            },
            icon: const Icon(Icons.call_rounded, size: 16),
            label: const Text("Inquire with Sales"),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6256D9),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }

  void _handleAskBot(String query) {
    if (query.trim().isEmpty) return;

    setState(() {
      _chatHistory.add({"role": "user", "text": query});
      _botQueryController.clear();
    });

    // Check if query matches mock QA or generate strategic response
    final match = StrategyMockData.botQAs.firstWhere(
      (qa) =>
          qa.query.toLowerCase().contains(query.toLowerCase()) ||
          qa.queryMr.contains(query) ||
          query.toLowerCase().contains("2023") && qa.id == "qa_01" ||
          query.toLowerCase().contains("booth") && qa.id == "qa_02" ||
          query.toLowerCase().contains("vyapari") && qa.id == "qa_03" ||
          query.toLowerCase().contains("bla") && qa.id == "qa_04",
      orElse: () => StrategyMockData.botQAs[0],
    );

    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {
          _chatHistory.add({"role": "bot", "text": match.answer});
        });
      }
    });
  }

  void _cycleActiveTier() {
    setState(() {
      _activeTier = (_activeTier % 4) + 1;
      // If selected election is locked in new tier, fallback to 0 (2024)
      final elections = StrategyMockData.elections;
      if (!_isElectionUnlocked(elections[_selectedElectionIndex].year)) {
        _selectedElectionIndex = 0;
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        duration: const Duration(milliseconds: 1400),
        content: Text("Switched active plan to: $_tierName"),
      ),
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
              "Previous Election & Strategy",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Kasba Peth Historical Intelligence & Playbooks",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          // Tier Switcher Chip for Entitlement Testing
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: _cycleActiveTier,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF6256D9).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF6256D9).withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.shield_rounded, size: 12, color: Color(0xFF6256D9)),
                    const SizedBox(width: 4),
                    Text(
                      "Tier $_activeTier",
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF6256D9)),
                    ),
                  ],
                ),
              ),
            ),
          ),
          // Note: All Data Export / Download buttons have been permanently stripped per Section 7 specification
        ],
      ),
      body: Column(
        children: [
          // Segmented Tab Selector
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            color: c.cardBg,
            child: Row(
              children: [
                _segmentButton(0, "Past Results"),
                const SizedBox(width: 6),
                _segmentButton(1, "Peth Swings & Playbooks"),
                const SizedBox(width: 6),
                _segmentButton(2, "Strategy Bot"),
              ],
            ),
          ),

          Expanded(
            child: _buildCurrentSegment(),
          ),
        ],
      ),
    );
  }

  Widget _segmentButton(int index, String title) {
    final isSelected = _selectedSegment == index;
    final c = widget.c;

    return Expanded(
      child: InkWell(
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
                fontSize: 10.5,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : c.textSecondary,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentSegment() {
    switch (_selectedSegment) {
      case 0:
        return _buildPastResultsView();
      case 1:
        return _buildPethSwingAndPlaybooksView();
      case 2:
      default:
        return _buildStrategyBotView();
    }
  }

  // --- SEGMENT 0: PAST RESULTS ---
  Widget _buildPastResultsView() {
    final c = widget.c;
    final elections = StrategyMockData.elections;
    final current = elections[_selectedElectionIndex];

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        // Historical Archive Depth Status Banner
        Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: widget.isDark ? const Color(0xFF141417) : const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: c.cardBorder),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.history_edu_rounded, size: 14, color: Color(0xFF6256D9)),
                  const SizedBox(width: 6),
                  Text(
                    "ARCHIVE DEPTH: $_tierName",
                    style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                  ),
                ],
              ),
              InkWell(
                onTap: _cycleActiveTier,
                child: const Text(
                  "Change Tier ↗",
                  style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF6256D9)),
                ),
              ),
            ],
          ),
        ),

        // Plan-Tiered Election Switcher Cards (Horizontal Scroll)
        SizedBox(
          height: 64,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: elections.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, idx) {
              final e = elections[idx];
              final isCurrent = idx == _selectedElectionIndex;
              final isUnlocked = _isElectionUnlocked(e.year);

              return GestureDetector(
                onTap: () {
                  if (isUnlocked) {
                    setState(() => _selectedElectionIndex = idx);
                  } else {
                    _showLockedElectionDialog(e);
                  }
                },
                child: Container(
                  width: 95,
                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                  decoration: BoxDecoration(
                    color: isCurrent
                        ? const Color(0xFF6256D9).withOpacity(0.14)
                        : (isUnlocked ? c.cardBg : (widget.isDark ? const Color(0xFF141417) : const Color(0xFFF1F5F9))),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isCurrent
                          ? const Color(0xFF6256D9)
                          : (isUnlocked ? c.cardBorder : c.cardBorder.withOpacity(0.5)),
                      width: isCurrent ? 1.8 : 1,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "${e.year}",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: isCurrent
                                  ? const Color(0xFF6256D9)
                                  : (isUnlocked ? c.textPrimary : c.textMuted),
                            ),
                          ),
                          if (!isUnlocked) ...[
                            const SizedBox(width: 4),
                            const Icon(Icons.lock_rounded, size: 12, color: Colors.amber),
                          ],
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        isUnlocked
                            ? (e.year == 2024
                                ? "Lok Sabha"
                                : (e.year == 2023 ? "By-Poll" : "Vidhan Sabha"))
                            : "${_requiredTierFor(e.year)} Req",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 8.5,
                          fontWeight: FontWeight.w600,
                          color: isCurrent
                              ? const Color(0xFF6256D9)
                              : (isUnlocked ? c.textSecondary : Colors.amber.shade700),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),

        const SizedBox(height: 14),

        // Election Headline Card
        Container(
          padding: const EdgeInsets.all(14),
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
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6256D9).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      current.type.toUpperCase(),
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Color(0xFF6256D9)),
                    ),
                  ),
                  Text(
                    "Turnout: ${current.turnoutPercentage}%",
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blue.shade700),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                current.name,
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary),
              ),
              Text(
                current.nameMr,
                style: TextStyle(fontSize: 10.5, color: c.textSecondary),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _statPill("Total Polled", current.totalVotesPolled.toString()),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _statPill("Winning Margin", current.winningMargin, isAccent: true),
                  ),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 14),

        // Vote Share Bars
        Text(
          "CANDIDATE VOTE SHARES & RESULTS",
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),

        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.cardBorder),
          ),
          child: Column(
            children: current.results.map((res) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            if (res.isWinner)
                              const Padding(
                                padding: EdgeInsets.only(right: 6),
                                child: Icon(Icons.emoji_events_rounded, color: Colors.amber, size: 16),
                              ),
                            Text(
                              res.name,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: res.isWinner ? FontWeight.w900 : FontWeight.w600,
                                color: c.textPrimary,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          "${res.votes} (${res.percentage}%)",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: res.partyColor,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: res.percentage / 100,
                        backgroundColor: widget.isDark ? const Color(0xFF27272A) : const Color(0xFFE2E8F0),
                        color: res.partyColor,
                        minHeight: 7,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),

        const SizedBox(height: 14),

        // Key Strategic Takeaway
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.amber.shade700.withOpacity(0.5)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.lightbulb_rounded, color: Colors.amber, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    "WAR ROOM STRATEGIC LESSON",
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.amber.shade800),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                current.keyTakeaway,
                style: TextStyle(fontSize: 11.5, color: c.textPrimary, height: 1.4),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),
      ],
    );
  }

  Widget _statPill(String label, String value, {bool isAccent = false}) {
    final c = widget.c;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: isAccent ? const Color(0xFF6256D9).withOpacity(0.1) : c.scaffoldBg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: isAccent ? const Color(0xFF6256D9).withOpacity(0.3) : c.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.bold,
              color: isAccent ? const Color(0xFF6256D9) : c.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  // --- SEGMENT 1: PETH SWING & PLAYBOOKS ---
  Widget _buildPethSwingAndPlaybooksView() {
    final c = widget.c;
    final peths = StrategyMockData.pethSwings;
    final playbooks = StrategyMockData.playbooks;

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Text(
          "LOCALITY & PETH SWING BREAKDOWN (12 LOCALITIES)",
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),

        Container(
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.cardBorder),
          ),
          child: Column(
            children: List.generate(peths.length, (idx) {
              final peth = peths[idx];
              final isLast = idx == peths.length - 1;

              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Text(
                                  peth.pethName,
                                  style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  "(${peth.pethNameMr})",
                                  style: TextStyle(fontSize: 10, color: c.textSecondary),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                              decoration: BoxDecoration(
                                color: peth.statusColor.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: peth.statusColor.withOpacity(0.6), width: 0.8),
                              ),
                              child: Text(
                                peth.swingStatus,
                                style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: peth.statusColor),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              "${peth.totalBooths} Booths • Margin: ${peth.historicalMargin}",
                              style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: peth.statusColor),
                            ),
                          ],
                        ),
                        const SizedBox(height: 3),
                        Text(
                          "Directive: ${peth.strategicAction}",
                          style: TextStyle(fontSize: 10, color: c.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  if (!isLast) Divider(height: 1, color: c.cardBorder),
                ],
              );
            }),
          ),
        ),

        const SizedBox(height: 18),

        // Section 2: Strategy Playbooks
        Text(
          "TACTICAL CAMPAIGN PLAYBOOKS (${playbooks.length})",
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),

        ...playbooks.map((pb) {
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.cardBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 17,
                      backgroundColor: const Color(0xFF6256D9).withOpacity(0.12),
                      child: Icon(pb.icon, color: const Color(0xFF6256D9), size: 18),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6256D9).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              pb.category.toUpperCase(),
                              style: const TextStyle(fontSize: 8.5, fontWeight: FontWeight.w800, color: Color(0xFF6256D9)),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            pb.title,
                            style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  "Goal: ${pb.objective}",
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: Colors.blue.shade700),
                ),
                const SizedBox(height: 6),
                ...pb.actionSteps.map((step) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(Icons.check_circle_outline_rounded, size: 14, color: Colors.green.shade600),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              step,
                              style: TextStyle(fontSize: 10.5, color: c.textSecondary, height: 1.3),
                            ),
                          ),
                        ],
                      ),
                    )),
              ],
            ),
          );
        }),

        const SizedBox(height: 20),
      ],
    );
  }

  // --- SEGMENT 2: STRATEGY BOT VIEW ---
  Widget _buildStrategyBotView() {
    final c = widget.c;

    return Column(
      children: [
        // Preset Strategic Query Chips
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          color: c.cardBg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "POPULAR STRATEGIC QUERIES",
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
              ),
              const SizedBox(height: 6),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: StrategyMockData.botQAs.map((qa) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ActionChip(
                        onPressed: () => _handleAskBot(qa.query),
                        backgroundColor: c.scaffoldBg,
                        side: BorderSide(color: c.cardBorder),
                        label: Text(
                          qa.query,
                          style: TextStyle(fontSize: 10, color: c.textPrimary, fontWeight: FontWeight.w600),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),

        // Chat Message Stream
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(14),
            itemCount: _chatHistory.length,
            itemBuilder: (context, idx) {
              final msg = _chatHistory[idx];
              final isUser = msg["role"] == "user";

              return Align(
                alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isUser ? const Color(0xFF6256D9) : c.cardBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: isUser ? const Color(0xFF6256D9) : c.cardBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (!isUser)
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.auto_awesome_rounded, color: Colors.amber, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              "RAJTANTRA STRATEGY COPILOT",
                              style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: Colors.amber.shade800),
                            ),
                          ],
                        ),
                      if (!isUser) const SizedBox(height: 4),
                      Text(
                        msg["text"] ?? "",
                        style: TextStyle(
                          fontSize: 11.5,
                          height: 1.4,
                          color: isUser ? Colors.white : c.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),

        // Input Field
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          color: c.cardBg,
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _botQueryController,
                  decoration: InputDecoration(
                    hintText: "Ask strategy bot (e.g. 2023 turnout, swing booths)...",
                    hintStyle: TextStyle(fontSize: 11, color: c.textMuted),
                    filled: true,
                    fillColor: c.scaffoldBg,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.cardBorder)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.cardBorder)),
                  ),
                  style: TextStyle(fontSize: 11.5, color: c.textPrimary),
                  onSubmitted: _handleAskBot,
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filled(
                icon: const Icon(Icons.send_rounded, size: 16),
                style: IconButton.styleFrom(backgroundColor: const Color(0xFF6256D9)),
                onPressed: () => _handleAskBot(_botQueryController.text),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
