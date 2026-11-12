import 'package:flutter/material.dart';
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
  int _selectedSegment = 0; // 0: Elections, 1: Peth Swing & Playbooks, 2: Strategy Bot
  int _selectedElectionIndex = 0;

  // For Strategy Bot
  final TextEditingController _botQueryController = TextEditingController();
  final List<Map<String, String>> _chatHistory = [
    {
      "role": "bot",
      "text": "Namaskar Adv. Vikram Patil. I am your RAJTANTRA Historical Election & Strategic War Room Bot. Tap any query below or ask about booth trends, swing dynamics, or past voting patterns."
    }
  ];

  void _handleAskBot(String query) {
    if (query.trim().isEmpty) return;

    setState(() {
      _chatHistory.add({"role": "user", "text": query});
      _botQueryController.clear();
    });

    // Check if query matches mock QA or generate strategic response
    final match = StrategyMockData.botQAs.firstWhere(
      (qa) => qa.query.toLowerCase().contains(query.toLowerCase()) ||
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
            color: isSelected ? c.primary : c.scaffoldBg,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: isSelected ? c.primary : c.borderColor),
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
        // Election Switcher Cards
        Row(
          children: List.generate(elections.length, (idx) {
            final e = elections[idx];
            final isCurrent = idx == _selectedElectionIndex;
            return Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _selectedElectionIndex = idx),
                child: Container(
                  margin: EdgeInsets.only(right: idx < elections.length - 1 ? 8 : 0),
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                  decoration: BoxDecoration(
                    color: isCurrent ? c.primary.withOpacity(0.12) : c.cardBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isCurrent ? c.primary : c.borderColor,
                      width: isCurrent ? 1.5 : 1,
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(
                        "${e.year}",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: isCurrent ? c.primary : c.textPrimary,
                        ),
                      ),
                      Text(
                        idx == 0 ? "Lok Sabha" : (idx == 1 ? "By-Election" : "Vidhan Sabha"),
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w600,
                          color: isCurrent ? c.primary : c.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ),

        const SizedBox(height: 14),

        // Election Headline Card
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
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: c.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      current.type.toUpperCase(),
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: c.primary),
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
            border: Border.all(color: c.borderColor),
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
                        backgroundColor: c.borderColor,
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
        color: isAccent ? c.primary.withOpacity(0.1) : c.scaffoldBg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: isAccent ? c.primary.withOpacity(0.3) : c.borderColor),
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
              color: isAccent ? c.primary : c.textPrimary,
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
        // Section 1: Peth Swing Breakdown
        Text(
          "LOCALITY & PETH SWING BREAKDOWN (12 LOCALITIES)",
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),

        Container(
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
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
                  if (!isLast) Divider(height: 1, color: c.borderColor),
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
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 17,
                      backgroundColor: c.primary.withOpacity(0.12),
                      child: Icon(pb.icon, color: c.primary, size: 18),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                            decoration: BoxDecoration(
                              color: c.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              pb.category.toUpperCase(),
                              style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w800, color: c.primary),
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
                        side: BorderSide(color: c.borderColor),
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
                    color: isUser ? c.primary : c.cardBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: isUser ? c.primary : c.borderColor),
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
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                  ),
                  style: TextStyle(fontSize: 11.5, color: c.textPrimary),
                  onSubmitted: _handleAskBot,
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filled(
                icon: const Icon(Icons.send_rounded, size: 16),
                style: IconButton.styleFrom(backgroundColor: c.primary),
                onPressed: () => _handleAskBot(_botQueryController.text),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
