import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/campaign_model.dart';
import '../data/campaign_mock_data.dart';

class CampaignWizardSheet extends StatefulWidget {
  final CandidateColors c;
  final Function(CampaignModel newCampaign) onCampaignLaunched;

  const CampaignWizardSheet({
    super.key,
    required this.c,
    required this.onCampaignLaunched,
  });

  static void show(BuildContext context, CandidateColors c, Function(CampaignModel) onLaunched) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => CampaignWizardSheet(c: c, onCampaignLaunched: onLaunched),
    );
  }

  @override
  State<CampaignWizardSheet> createState() => _CampaignWizardSheetState();
}

class _CampaignWizardSheetState extends State<CampaignWizardSheet> {
  int _currentStep = 1; // 1 to 7

  // Step 1: Channel
  CampaignChannel _selectedChannel = CampaignChannel.whatsapp;

  // Step 2: Category
  CampaignCategory _selectedCategory = CampaignCategory.festivalGreeting;

  // Step 3: Audience
  String _selectedAudience = "Confirmed Supporters";
  int _recipientCount = 92535;

  // Step 4: Template & Message
  final TextEditingController _titleController = TextEditingController(text: "Festival & Welfare Outreach");
  final TextEditingController _messageController = TextEditingController(
    text: "नमस्कार {{voter_name}} जी, ॲड. विक्रम पाटील यांच्याकडून मनःपूर्वक शुभेच्छा. कसबा पेठेच्या विकासासाठी आम्ही कटिबद्ध आहोत. आपले मतदान केंद्र: बूथ क्र. {{booth_number}}.",
  );

  // Step 5: Media Attachment
  String _attachmentType = "image"; // none, image, pdf, audio

  // Step 6: Scheduling & Throttling
  bool _sendImmediately = true;
  String _throttleRate = "500 msgs/min (Safe DLT)";

  @override
  void dispose() {
    _titleController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < 7) {
      setState(() => _currentStep++);
    } else {
      _launchCampaign();
    }
  }

  void _prevStep() {
    if (_currentStep > 1) {
      setState(() => _currentStep--);
    }
  }

  void _launchCampaign() {
    final newCamp = CampaignModel(
      id: "CMP-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}",
      title: _titleController.text.trim().isNotEmpty ? _titleController.text.trim() : "Multi-Channel Broadcast",
      titleMr: "नवीन प्रचार संदेश",
      channel: _selectedChannel,
      category: _selectedCategory,
      status: _sendImmediately ? CampaignStatus.liveDispatching : CampaignStatus.scheduled,
      targetAudience: "$_recipientCount Recipients ($_selectedAudience)",
      targetCount: _recipientCount,
      dispatchedCount: _sendImmediately ? 120 : 0,
      deliveredCount: _sendImmediately ? 114 : 0,
      readCount: _sendImmediately ? 92 : 0,
      failedCount: 0,
      messageContent: _messageController.text.trim(),
      attachmentType: _attachmentType == "none" ? null : _attachmentType,
      createdDate: "Just now",
      scheduledDate: _sendImmediately ? "Immediate Dispatch" : "Tomorrow, 08:00 AM",
    );

    widget.onCampaignLaunched(newCamp);
    Navigator.pop(context);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF10B981),
        content: Text("🚀 Campaign \"${newCamp.title}\" successfully launched across ${_recipientCount} voters!"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    return Container(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      height: MediaQuery.of(context).size.height * 0.88,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header & Step Indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.campaign_rounded, color: Color(0xFF4F46E5), size: 24),
                  const SizedBox(width: 8),
                  Text(
                    "7-Step Campaign Wizard",
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: c.textPrimary),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Stepper Progress Bar
          Row(
            children: List.generate(7, (idx) {
              final stepNum = idx + 1;
              final isDone = stepNum < _currentStep;
              final isCurrent = stepNum == _currentStep;
              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  height: 4,
                  decoration: BoxDecoration(
                    color: isDone || isCurrent ? const Color(0xFF4F46E5) : c.cardBorder,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 6),
          Text(
            "STEP $_currentStep OF 7: ${_getStepTitle(_currentStep)}",
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.1,
              color: Color(0xFF6366F1),
            ),
          ),
          const Divider(height: 20),

          // Step Body
          Expanded(
            child: SingleChildScrollView(
              child: _buildStepContent(c),
            ),
          ),
          const Divider(height: 16),

          // Bottom Navigation Buttons (Back & Next/Launch)
          Row(
            children: [
              if (_currentStep > 1) ...[
                Expanded(
                  child: OutlinedButton(
                    onPressed: _prevStep,
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: c.cardBorder),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text("Previous Step"),
                  ),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: _nextStep,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4F46E5),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: Text(
                    _currentStep == 7 ? "🚀 Launch Broadcast Now" : "Continue to Step ${_currentStep + 1}",
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _getStepTitle(int step) {
    switch (step) {
      case 1:
        return "BROADCAST GATEWAY CHANNEL";
      case 2:
        return "CAMPAIGN CATEGORY & PURPOSE";
      case 3:
        return "TARGET AUDIENCE SEGMENT";
      case 4:
        return "MESSAGE COMPOSER & TAGS";
      case 5:
        return "MULTIMEDIA ATTACHMENT";
      case 6:
        return "SCHEDULE & RATE LIMITING";
      case 7:
        return "QUOTA AUDIT & CONFIRMATION";
      default:
        return "";
    }
  }

  Widget _buildStepContent(CandidateColors c) {
    switch (_currentStep) {
      case 1:
        return _buildStep1(c);
      case 2:
        return _buildStep2(c);
      case 3:
        return _buildStep3(c);
      case 4:
        return _buildStep4(c);
      case 5:
        return _buildStep5(c);
      case 6:
        return _buildStep6(c);
      case 7:
        return _buildStep7(c);
      default:
        return const SizedBox();
    }
  }

  // Step 1: Channel
  Widget _buildStep1(CandidateColors c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _channelOption(CampaignChannel.whatsapp, "WhatsApp Business API", "High engagement, rich multimedia, 98% read rate", Icons.chat_rounded, const Color(0xFF22C55E), c),
        _channelOption(CampaignChannel.sms, "Bulk SMS Gateway (DLT)", "Direct inbox delivery for non-smartphone voters", Icons.sms_rounded, const Color(0xFF3B82F6), c),
        _channelOption(CampaignChannel.aiVoice, "AI Agent Voice Calling", "Automated candidate speech bot in Marathi & English", Icons.record_voice_over_rounded, const Color(0xFF8B5CF6), c),
        _channelOption(CampaignChannel.autoGreeting, "Automated Birthday/Festival Chits", "Auto-dispatched on citizen birthdays or special days", Icons.cake_rounded, const Color(0xFFF59E0B), c),
      ],
    );
  }

  Widget _channelOption(CampaignChannel ch, String title, String sub, IconData icon, Color color, CandidateColors c) {
    final isSel = _selectedChannel == ch;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: () => setState(() => _selectedChannel = ch),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isSel ? color.withOpacity(0.1) : c.cardBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSel ? color : c.cardBorder, width: isSel ? 2 : 1),
          ),
          child: Row(
            children: [
              Icon(icon, size: 24, color: color),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary)),
                    Text(sub, style: TextStyle(fontSize: 11, color: c.textSecondary)),
                  ],
                ),
              ),
              if (isSel) Icon(Icons.check_circle_rounded, color: color, size: 20),
            ],
          ),
        ),
      ),
    );
  }

  // Step 2: Category
  Widget _buildStep2(CandidateColors c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _categoryOption(CampaignCategory.festivalGreeting, "Festival / Cultural Greeting", "Gudhi Padwa, Ganeshotsav, Diwali appeals", c),
        _categoryOption(CampaignCategory.manifestoVision, "Candidate Manifesto & Vision", "Ward development commitments and schemes", c),
        _categoryOption(CampaignCategory.rallyInvitation, "Grand Public Sabha / Rally Invitation", "Time, location, and guest announcements", c),
        _categoryOption(CampaignCategory.voterSlipNotice, "Voter Information Slip Delivery", "Booth and serial number notifications", c),
        _categoryOption(CampaignCategory.pollingDayMobilization, "Polling Day Turnout Mobilization", "Urgent final appeal on voting day", c),
      ],
    );
  }

  Widget _categoryOption(CampaignCategory cat, String title, String sub, CandidateColors c) {
    final isSel = _selectedCategory == cat;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: () => setState(() => _selectedCategory = cat),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isSel ? const Color(0xFF4F46E5).withOpacity(0.1) : c.cardBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSel ? const Color(0xFF4F46E5) : c.cardBorder, width: isSel ? 2 : 1),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary)),
                    Text(sub, style: TextStyle(fontSize: 10.5, color: c.textSecondary)),
                  ],
                ),
              ),
              if (isSel) const Icon(Icons.check_circle_rounded, color: Color(0xFF4F46E5), size: 20),
            ],
          ),
        ),
      ),
    );
  }

  // Step 3: Audience
  Widget _buildStep3(CandidateColors c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _audienceOption("Confirmed Supporters", 92535, "Core loyalist voting block in 215", c),
        _audienceOption("Swing / Persuadables", 34120, "High-leverage undecided voters", c),
        _audienceOption("Youth Voters (<30)", 48200, "First-time and young professionals", c),
        _audienceOption("Female Voters", 119890, "Welfare scheme and family decision makers", c),
        _audienceOption("Entire Constituency Electorate", 248510, "All 215 Polling Booths (Full Reach)", c),
      ],
    );
  }

  Widget _audienceOption(String title, int count, String sub, CandidateColors c) {
    final isSel = _selectedAudience == title;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedAudience = title;
            _recipientCount = count;
          });
        },
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isSel ? const Color(0xFF4F46E5).withOpacity(0.1) : c.cardBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSel ? const Color(0xFF4F46E5) : c.cardBorder, width: isSel ? 2 : 1),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary)),
                    Text(sub, style: TextStyle(fontSize: 10.5, color: c.textSecondary)),
                  ],
                ),
              ),
              Text(
                "${(count / 1000).toStringAsFixed(1)}k",
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF4F46E5)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Step 4: Template & Composer
  Widget _buildStep4(CandidateColors c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("CAMPAIGN TITLE", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
        const SizedBox(height: 6),
        TextField(
          controller: _titleController,
          style: TextStyle(color: c.textPrimary, fontSize: 13),
          decoration: InputDecoration(
            filled: true,
            fillColor: c.scaffoldBg,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          ),
        ),
        const SizedBox(height: 14),

        Text("DYNAMIC PERSONALIZATION TAGS", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
        const SizedBox(height: 6),
        Wrap(
          spacing: 6,
          children: [
            _tagChip("{{voter_name}}"),
            _tagChip("{{booth_number}}"),
            _tagChip("{{serial_number}}"),
          ],
        ),
        const SizedBox(height: 14),

        Text("MESSAGE CONTENT (मराठी / ENGLISH)", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
        const SizedBox(height: 6),
        TextField(
          controller: _messageController,
          maxLines: 4,
          style: TextStyle(color: c.textPrimary, fontSize: 13),
          decoration: InputDecoration(
            filled: true,
            fillColor: c.scaffoldBg,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          ),
        ),
      ],
    );
  }

  Widget _tagChip(String tag) {
    return ActionChip(
      label: Text(tag, style: const TextStyle(fontSize: 10, fontFamily: 'monospace')),
      backgroundColor: const Color(0xFF4F46E5).withOpacity(0.12),
      onPressed: () {
        _messageController.text += " $tag ";
      },
    );
  }

  // Step 5: Media Attachment
  Widget _buildStep5(CandidateColors c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _mediaOption("image", "Campaign Poster (HD JPEG)", Icons.image_rounded, c),
        _mediaOption("audio", "Candidate Voice Note (MP3)", Icons.mic_rounded, c),
        _mediaOption("pdf", "Kasba Vision Manifesto (PDF)", Icons.picture_as_pdf_rounded, c),
        _mediaOption("none", "Text Only (No Media)", Icons.text_fields_rounded, c),
      ],
    );
  }

  Widget _mediaOption(String type, String title, IconData icon, CandidateColors c) {
    final isSel = _attachmentType == type;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: () => setState(() => _attachmentType = type),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isSel ? const Color(0xFF4F46E5).withOpacity(0.1) : c.cardBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSel ? const Color(0xFF4F46E5) : c.cardBorder, width: isSel ? 2 : 1),
          ),
          child: Row(
            children: [
              Icon(icon, size: 22, color: const Color(0xFF4F46E5)),
              const SizedBox(width: 12),
              Expanded(
                child: Text(title, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary)),
              ),
              if (isSel) const Icon(Icons.check_circle_rounded, color: Color(0xFF4F46E5), size: 18),
            ],
          ),
        ),
      ),
    );
  }

  // Step 6: Scheduling & Throttling
  Widget _buildStep6(CandidateColors c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RadioListTile<bool>(
          title: const Text("Dispatch Immediately Upon Launch", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          subtitle: const Text("Queues message batch directly to carrier cluster", style: TextStyle(fontSize: 11)),
          value: true,
          groupValue: _sendImmediately,
          activeColor: const Color(0xFF4F46E5),
          onChanged: (v) => setState(() => _sendImmediately = v ?? true),
        ),
        RadioListTile<bool>(
          title: const Text("Schedule for Tomorrow 08:00 AM", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          subtitle: const Text("Optimal morning engagement window", style: TextStyle(fontSize: 11)),
          value: false,
          groupValue: _sendImmediately,
          activeColor: const Color(0xFF4F46E5),
          onChanged: (v) => setState(() => _sendImmediately = v ?? false),
        ),
        const SizedBox(height: 16),

        Text("DELIVERY RATE THROTTLING", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: c.cardBorder),
          ),
          child: Row(
            children: [
              const Icon(Icons.speed_rounded, size: 20, color: Color(0xFF10B981)),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_throttleRate, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                    const Text("Prevents carrier spam filters and ensures 99.2% inbox placement", style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Step 7: Quota Audit & Confirmation
  Widget _buildStep7(CandidateColors c) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: c.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.verified_user_rounded, color: Color(0xFF10B981), size: 20),
              SizedBox(width: 8),
              Text(
                "PRE-FLIGHT CAMPAIGN AUDIT",
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: Color(0xFF10B981)),
              ),
            ],
          ),
          const Divider(height: 20),

          _auditRow("Broadcast Channel", _selectedChannel.name.toUpperCase()),
          _auditRow("Target Audience", _selectedAudience),
          _auditRow("Recipient Count", "$_recipientCount Voters"),
          _auditRow("Estimated Credits", "$_recipientCount Units"),
          _auditRow("Available Balance", "${CampaignMockData.whatsappBalance} Units", isGreen: true),
          _auditRow("Dispatch Schedule", _sendImmediately ? "Immediate (Live Queue)" : "Tomorrow, 08:00 AM"),
          const SizedBox(height: 12),

          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.08),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
            ),
            child: const Row(
              children: [
                Icon(Icons.check_circle_outline, color: Color(0xFF10B981), size: 18),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "Quota verified. DLT template approved. Gateway cluster ready for dispatch.",
                    style: TextStyle(fontSize: 11, color: Color(0xFF047857), fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _auditRow(String label, String value, {bool isGreen = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Text(
            value,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isGreen ? const Color(0xFF10B981) : widget.c.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
