import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/ai_message_model.dart';
import '../data/ai_mode_mock_data.dart';

class AiModeScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final Function(String) onExecuteAction;

  const AiModeScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.onExecuteAction,
  });

  @override
  State<AiModeScreen> createState() => _AiModeScreenState();
}

class _AiModeScreenState extends State<AiModeScreen> {
  final List<AiMessage> _messages = List.from(AiModeMockData.initialConversation);
  final TextEditingController _promptController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isListeningVoice = false;

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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Colors.green.shade800,
          content: const Row(
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
            Row(
              children: [
                const Icon(Icons.auto_awesome_rounded, color: Colors.indigoAccent, size: 16),
                const SizedBox(width: 6),
                Text(
                  "Global AI Mode",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                  decoration: BoxDecoration(
                    color: Colors.indigo.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(color: Colors.indigo.withOpacity(0.4)),
                  ),
                  child: const Text(
                    "AGENTIC COPILOT",
                    style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: Colors.indigo),
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
      body: Column(
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
                      side: BorderSide(color: c.borderColor),
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
                      "Listening... Speak your prompt in Marathi or English (e.g. 'Turnout simulate kara')",
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
              border: Border(top: BorderSide(color: c.borderColor)),
            ),
            child: Row(
              children: [
                IconButton(
                  tooltip: _isListeningVoice ? "Stop Listening" : "Speak Voice Prompt",
                  icon: Icon(
                    _isListeningVoice ? Icons.mic_off_rounded : Icons.mic_rounded,
                    color: _isListeningVoice ? Colors.red : Colors.indigo,
                    size: 24,
                  ),
                  onPressed: _toggleVoiceInput,
                ),
                Expanded(
                  child: TextField(
                    controller: _promptController,
                    decoration: InputDecoration(
                      hintText: "Ask anything (e.g. Ladki Bahin count, speech outline)...",
                      hintStyle: TextStyle(fontSize: 11.5, color: c.textMuted),
                      filled: true,
                      fillColor: c.scaffoldBg,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide(color: c.borderColor)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide(color: c.borderColor)),
                    ),
                    style: TextStyle(fontSize: 12, color: c.textPrimary),
                    onSubmitted: _handleSendMessage,
                  ),
                ),
                const SizedBox(width: 8),
                IconButton.filled(
                  icon: const Icon(Icons.arrow_upward_rounded, size: 18),
                  style: IconButton.styleFrom(backgroundColor: c.primary),
                  onPressed: () => _handleSendMessage(_promptController.text),
                ),
              ],
            ),
          ),
        ],
      ),
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
          color: isUser ? c.primary : c.cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isUser ? c.primary : c.borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isUser)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.auto_awesome_rounded, color: Colors.indigoAccent, size: 14),
                  const SizedBox(width: 5),
                  Text(
                    "RAJTANTRA AI STRATEGY ENGINE",
                    style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: Colors.indigo.shade400, letterSpacing: 0.8),
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
