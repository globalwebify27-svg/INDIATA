import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/ai_message_model.dart';
import '../data/ai_mode_mock_data.dart';

class AiModeScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final Function(String) onExecuteAction;
  final bool initialEntitlement;

  const AiModeScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.onExecuteAction,
    this.initialEntitlement = true,
  });

  @override
  State<AiModeScreen> createState() => _AiModeScreenState();
}

class _AiModeScreenState extends State<AiModeScreen> {
  late bool _isAiEntitled;
  final List<AiMessage> _messages = List.from(AiModeMockData.initialConversation);
  final TextEditingController _promptController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isListeningVoice = false;

  @override
  void initState() {
    super.initState();
    _isAiEntitled = widget.initialEntitlement;
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _handleSendMessage(String query) {
    if (!_isAiEntitled) {
      _showUpgradeDialog();
      return;
    }

    if (query.trim().isEmpty) return;

    final userMsg = AiMessage(
      id: "usr_${DateTime.now().millisecondsSinceEpoch}",
      role: "user",
      text: query.trim(),
      timestamp: DateTime.now(),
    );

    setState(() {
      _messages.add(userMsg);
      _promptController.clear();
      _isListeningVoice = false;
    });

    _scrollToBottom();

    // Simulate AI generation delay
    Future.delayed(const Duration(milliseconds: 400), () {
      if (mounted) {
        final aiResponse = AiModeMockData.getAiResponseFor(query);
        setState(() {
          _messages.add(aiResponse);
        });
        _scrollToBottom();
      }
    });
  }

  void _toggleVoiceInput() {
    if (!_isAiEntitled) {
      _showUpgradeDialog();
      return;
    }

    setState(() {
      _isListeningVoice = !_isListeningVoice;
    });

    if (_isListeningVoice) {
      // Simulate speech recognition after 2 seconds
      Future.delayed(const Duration(milliseconds: 1800), () {
        if (mounted && _isListeningVoice) {
          const simulatedVoicePrompt = "Simulate victory margin at 64% voter turnout.";
          _promptController.text = simulatedVoicePrompt;
          _handleSendMessage(simulatedVoicePrompt);
        }
      });
    }
  }

  void _handleActionTap(AiAction action) {
    if (action.actionKey == "COPY_SPEECH") {
      Clipboard.setData(const ClipboardData(
        text: "मराठी भाषण रूपरेषा: शनिवार पेठ वाडा रहिवासी मेळावा\n"
            "१. प्रारंभ व आदर: पुण्याची ऐतिहासिक ओळख जपणार्‍या शनिवार पेठेतील सर्व ज्येष्ठ नागरिक व माता-भगिनींना सस्नेह नमस्कार...\n"
            "२. वाडा पुनर्विकास वचन: जुने वाडे ही आमची संस्कृती आहे. भाडेकरूंना हक्काचे मालकी हक्क देणारा क्लस्टर पुनर्विकास हाच आमचा निर्धार आहे.\n"
            "३. स्थानिक समस्या: मुळा-मुठा नदी सुधारणा व अंतर्गत वाहतूक कोंडी सोडवण्यासाठी ठोस पावले.",
      ));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFF10B981),
          content: Row(
            children: [
              Icon(Icons.check_circle_rounded, color: Colors.white, size: 16),
              SizedBox(width: 8),
              Text("Marathi speech outline copied to clipboard!", style: TextStyle(color: Colors.white)),
            ],
          ),
        ),
      );
      return;
    }

    widget.onExecuteAction(action.actionKey);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: action.color,
        content: Text("Triggering War Room Action: ${action.label}"),
      ),
    );
  }

  void _showUpgradeDialog() {
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
                color: const Color(0xFF6256D9).withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.bolt_rounded, color: Color(0xFF6256D9), size: 22),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Upgrade to Agentic AI",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                  ),
                  Text(
                    "Tier 3: Election + AI or Tier 4: Office + AI",
                    style: TextStyle(fontSize: 9.5, color: widget.c.textSecondary),
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
              "Agentic AI copilot features (function calling, turnout simulation, Marathi speech generation, and predictive swing clustering) require an active enterprise AI license.",
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
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 14,
                        backgroundColor: Color(0xFF6256D9),
                        child: Text("SP", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "Sachin Pawar • Regional Sales Lead",
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.phone_rounded, size: 12, color: Color(0xFF10B981)),
                      const SizedBox(width: 6),
                      Text("+91 98220 11234", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: widget.c.textPrimary)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Cancel", style: TextStyle(color: widget.c.textSecondary)),
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
            label: const Text("Call Sales Team"),
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

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = widget.isDark;

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
            Row(
              children: [
                const Icon(Icons.auto_awesome_rounded, color: Color(0xFF7C3AED), size: 16),
                const SizedBox(width: 6),
                Text(
                  "Global AI Mode",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                  decoration: BoxDecoration(
                    color: _isAiEntitled ? const Color(0xFF7C3AED).withOpacity(0.14) : Colors.amber.withOpacity(0.14),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(
                      color: _isAiEntitled ? const Color(0xFF7C3AED).withOpacity(0.4) : Colors.amber.withOpacity(0.4),
                    ),
                  ),
                  child: Text(
                    _isAiEntitled ? "AGENTIC COPILOT" : "LOCKED",
                    style: TextStyle(
                      fontSize: 8.5,
                      fontWeight: FontWeight.w900,
                      color: _isAiEntitled ? const Color(0xFF7C3AED) : Colors.amber.shade700,
                    ),
                  ),
                ),
              ],
            ),
            Text(
              "Kasba Peth Strategic Intelligence LLM • Marathi & English",
              style: TextStyle(fontSize: 9.5, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          // Entitlement Dev/Demo Switcher Chip
          IconButton(
            tooltip: _isAiEntitled ? "Simulate Locked State (Tier 1/2)" : "Simulate Unlocked State (Tier 3/4)",
            icon: Icon(
              _isAiEntitled ? Icons.lock_open_rounded : Icons.lock_rounded,
              color: _isAiEntitled ? const Color(0xFF10B981) : Colors.amber.shade700,
              size: 20,
            ),
            onPressed: () {
              setState(() {
                _isAiEntitled = !_isAiEntitled;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  duration: const Duration(milliseconds: 1400),
                  content: Text(_isAiEntitled
                      ? "Switched to Subscribed State (Tier 3 AI Active)."
                      : "Switched to Non-Subscribed State (Tier 1/2 AI Locked)."),
                ),
              );
            },
          ),
          IconButton(
            tooltip: "Reset Conversation",
            icon: Icon(Icons.refresh_rounded, color: c.textSecondary, size: 20),
            onPressed: () {
              setState(() {
                _messages.clear();
                _messages.addAll(AiModeMockData.initialConversation);
              });
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          // 1. Core Chat Interface (Visible in background when locked)
          Column(
            children: [
              // Preset Prompts Chips
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                color: c.cardBg,
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: AiModeMockData.presetPrompts.map((prompt) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ActionChip(
                          onPressed: () => _handleSendMessage(prompt),
                          backgroundColor: c.scaffoldBg,
                          side: BorderSide(color: c.cardBorder),
                          avatar: const Icon(Icons.bolt_rounded, size: 14, color: Colors.amber),
                          label: Text(
                            prompt,
                            style: TextStyle(fontSize: 10, color: c.textPrimary, fontWeight: FontWeight.w600),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),

              // Voice Listening Banner (when voice active)
              if (_isListeningVoice)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  color: Colors.red.shade900,
                  child: Row(
                    children: [
                      const Icon(Icons.mic, color: Colors.white, size: 20),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          "Listening... Speak prompt in Marathi or English (e.g. 'Turnout simulate kara')",
                          style: TextStyle(fontSize: 11.5, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                      TextButton(
                        onPressed: _toggleVoiceInput,
                        child: const Text("Cancel", style: TextStyle(color: Colors.white, fontSize: 11)),
                      ),
                    ],
                  ),
                ),

              // Message Stream
              Expanded(
                child: ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(14),
                  itemCount: _messages.length,
                  itemBuilder: (context, index) {
                    final msg = _messages[index];
                    return _buildMessageBubble(msg);
                  },
                ),
              ),

              // Bottom Input Bar
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: c.cardBg,
                  border: Border(top: BorderSide(color: c.cardBorder)),
                ),
                child: Row(
                  children: [
                    IconButton(
                      tooltip: _isListeningVoice ? "Stop Listening" : "Speak Voice Prompt",
                      icon: Icon(
                        _isListeningVoice ? Icons.mic_off_rounded : Icons.mic_rounded,
                        color: _isListeningVoice ? Colors.red : const Color(0xFF6256D9),
                        size: 24,
                      ),
                      onPressed: _toggleVoiceInput,
                    ),
                    Expanded(
                      child: TextField(
                        controller: _promptController,
                        decoration: InputDecoration(
                          hintText: "Ask anything (e.g. victory margin, Marathi speech outline)...",
                          hintStyle: TextStyle(fontSize: 11.5, color: c.textMuted),
                          filled: true,
                          fillColor: c.scaffoldBg,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(20),
                            borderSide: BorderSide(color: c.cardBorder),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(20),
                            borderSide: BorderSide(color: c.cardBorder),
                          ),
                        ),
                        style: TextStyle(fontSize: 12, color: c.textPrimary),
                        onSubmitted: _handleSendMessage,
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton.filled(
                      icon: const Icon(Icons.arrow_upward_rounded, size: 18),
                      style: IconButton.styleFrom(backgroundColor: const Color(0xFF6256D9)),
                      onPressed: () => _handleSendMessage(_promptController.text),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // 2. Blurred Lock Screen Overlay (Rendered when candidate lacks AI license)
          if (!_isAiEntitled)
            Positioned.fill(
              child: ClipRect(
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 7.0, sigmaY: 7.0),
                  child: Container(
                    color: (isDark ? const Color(0xFF09090B) : Colors.white).withOpacity(0.82),
                    padding: const EdgeInsets.all(24),
                    child: Center(
                      child: SingleChildScrollView(
                        child: Container(
                          constraints: const BoxConstraints(maxWidth: 380),
                          padding: const EdgeInsets.all(22),
                          decoration: BoxDecoration(
                            color: c.cardBg,
                            borderRadius: BorderRadius.circular(22),
                            border: Border.all(color: const Color(0xFF7C3AED).withOpacity(0.5), width: 1.5),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF7C3AED).withOpacity(0.25),
                                blurRadius: 24,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Glowing Neon Violet Lock Badge
                              Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF7C3AED).withOpacity(0.15),
                                  shape: BoxShape.circle,
                                  border: Border.all(color: const Color(0xFF7C3AED), width: 2),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF7C3AED).withOpacity(0.4),
                                      blurRadius: 14,
                                      spreadRadius: 2,
                                    ),
                                  ],
                                ),
                                child: const Icon(
                                  Icons.lock_person_rounded,
                                  color: Color(0xFF7C3AED),
                                  size: 28,
                                ),
                              ),
                              const SizedBox(height: 14),

                              // Tag Badge
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3.5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF7C3AED).withOpacity(0.14),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: const Color(0xFF7C3AED).withOpacity(0.3)),
                                ),
                                child: const Text(
                                  "TIER RESTRICTED • AI ADD-ON REQUIRED",
                                  style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 0.8,
                                    color: Color(0xFF7C3AED),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 10),

                              // Title
                              Text(
                                "Unlock Agentic AI War Room",
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  color: c.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 6),

                              // Description
                              Text(
                                "Autonomous multi-step electoral reasoning, live turnout simulations, predictive swing voter modeling, and instant Marathi speech drafting require an active AI license.",
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 11.5,
                                  color: c.textSecondary,
                                  height: 1.4,
                                ),
                              ),
                              const SizedBox(height: 16),

                              // Capability Highlights Checklist
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF141417) : const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: c.cardBorder),
                                ),
                                child: Column(
                                  children: [
                                    _lockedFeatureRow(Icons.query_stats_rounded, "Turnout & Victory Margin Simulator"),
                                    const SizedBox(height: 8),
                                    _lockedFeatureRow(Icons.radar_rounded, "Predictive Swing Voter Modeling across 215 Booths"),
                                    const SizedBox(height: 8),
                                    _lockedFeatureRow(Icons.record_voice_over_rounded, "Automated Marathi Rally Speech & Press Drafter"),
                                    const SizedBox(height: 8),
                                    _lockedFeatureRow(Icons.auto_awesome_rounded, "Agentic Function Calling & Inline Dossiers"),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 20),

                              // Primary CTA: [ Unlock Agentic AI Features ]
                              SizedBox(
                                width: double.infinity,
                                height: 46,
                                child: ElevatedButton.icon(
                                  onPressed: _showUpgradeDialog,
                                  icon: const Icon(Icons.bolt_rounded, size: 18),
                                  label: const Text(
                                    "Unlock Agentic AI Features",
                                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF6256D9),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    elevation: 4,
                                    shadowColor: const Color(0xFF6256D9).withOpacity(0.5),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 10),

                              // Demo Preview Switch
                              TextButton(
                                onPressed: () {
                                  setState(() {
                                    _isAiEntitled = true;
                                  });
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      backgroundColor: Color(0xFF10B981),
                                      content: Text("Demo Mode Enabled: Agentic AI Copilot Unlocked."),
                                    ),
                                  );
                                },
                                child: Text(
                                  "Switch to Demo Mode (Preview)",
                                  style: TextStyle(fontSize: 11, color: c.textMuted),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _lockedFeatureRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 15, color: const Color(0xFF7C3AED)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: widget.c.textPrimary),
          ),
        ),
      ],
    );
  }

  Widget _buildMessageBubble(AiMessage msg) {
    final isUser = msg.role == "user";
    final c = widget.c;

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.88),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isUser ? const Color(0xFF6256D9) : c.cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isUser ? const Color(0xFF6256D9) : c.cardBorder),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(widget.isDark ? 0.25 : 0.05),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isUser)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.auto_awesome_rounded, color: Color(0xFF7C3AED), size: 14),
                  const SizedBox(width: 5),
                  const Text(
                    "RAJTANTRA AI STRATEGY ENGINE",
                    style: TextStyle(
                      fontSize: 8.5,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF7C3AED),
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
            if (!isUser) const SizedBox(height: 6),
            Text(
              msg.text,
              style: TextStyle(
                fontSize: 12,
                height: 1.45,
                color: isUser ? Colors.white : c.textPrimary,
              ),
            ),
            if (msg.actions != null && msg.actions!.isNotEmpty) ...[
              const SizedBox(height: 10),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: msg.actions!.map((act) {
                  return ElevatedButton.icon(
                    onPressed: () => _handleActionTap(act),
                    icon: Icon(act.icon, size: 13, color: Colors.white),
                    label: Text(act.label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: act.color,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  );
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
