import 'package:flutter/material.dart';
import '../models/ai_message_model.dart';

class AiModeMockData {
  static final List<String> presetPrompts = [
    "Simulate victory margin at 64% voter turnout.",
    "Generate Marathi speech outline for Shaniwar Peth wada meeting.",
    "Which 20 booths have the highest concentration of undecided swing voters?",
    "Show Majhi Ladki Bahin beneficiaries across all 210 booths.",
    "Draft an urgent WhatsApp broadcast for trade shopkeepers in Raviwar Peth.",
  ];

  static final List<AiMessage> initialConversation = [
    AiMessage(
      id: "msg_init_1",
      role: "assistant",
      text:
          "Namaskar Adv. Vikram Patil. I am your RAJTANTRA Agentic Strategic Copilot, connected live to Kasba Peth telemetry, 210 polling booths, and 1,98,450 doorstep survey records.\n\nYou can speak or type in Marathi or English. Ask me to simulate margins, draft speeches, analyze rival movements, or trigger campaign dispatches.",
      timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
      actions: const [
        AiAction(
          label: "View 20 Swing Booths",
          actionKey: "VIEW_SWING_BOOTHS",
          icon: Icons.how_to_vote_rounded,
          color: Colors.amber,
        ),
        AiAction(
          label: "Simulate Turnout",
          actionKey: "SIMULATE_TURNOUT",
          icon: Icons.query_stats_rounded,
          color: Colors.blue,
        ),
        AiAction(
          label: "Draft Marathi Speech",
          actionKey: "DRAFT_SPEECH",
          icon: Icons.record_voice_over_rounded,
          color: Colors.purple,
        ),
      ],
    ),
  ];

  static AiMessage getAiResponseFor(String query) {
    final lower = query.toLowerCase();

    if (lower.contains("speech") || lower.contains("भाषण") || lower.contains("shaniwar")) {
      return AiMessage(
        id: "msg_${DateTime.now().millisecondsSinceEpoch}",
        role: "assistant",
        text:
            "**मराठी भाषण रूपरेषा: शनिवार पेठ वाडा रहिवासी मेळावा (वेळ: १० मिनिटे)**\n\n"
            "१. **प्रारंभ व आदर**: 'पुण्याची ऐतिहासिक ओळख जपणार्‍या शनिवार पेठेतील सर्व ज्येष्ठ नागरिक व माता-भगिनींना सस्नेह नमस्कार...'\n\n"
            "२. **वाडा पुनर्विकास वचन**: 'जुने वाडे ही आमची संस्कृती आहे. भाडेकरूंना हक्काचे मालकी हक्क देणारा क्लस्टर पुनर्विकास हाच आमचा निर्धार आहे. कोणालाही बेघर होऊ देणार नाही.'\n\n"
            "३. **स्थानिक समस्यांची सोडवणूक**: 'गेल्या २ वर्षांत मुळा-मुठा नदी सुधारणा, पाणीपुरवठा आणि अंतर्गत वाहतूक कोंडी सोडवण्यासाठी घेतलेले ठोस निर्णय.'\n\n"
            "४. **आवाहन**: 'सकाळी ७ ते ११ या वेळेत मतदान केंद्रावर जाऊन शतप्रतिशत मतदान करण्याचे आवाहन करा.'",
        timestamp: DateTime.now(),
        actions: const [
          AiAction(
            label: "Copy Marathi Speech Text",
            actionKey: "COPY_SPEECH",
            icon: Icons.copy_rounded,
            color: Colors.green,
          ),
          AiAction(
            label: "Share with Media Cell",
            actionKey: "SHARE_MEDIA",
            icon: Icons.share_rounded,
            color: Colors.blue,
          ),
        ],
      );
    }

    if (lower.contains("margin") || lower.contains("turnout") || lower.contains("टक्केवारी") || lower.contains("simulate")) {
      return AiMessage(
        id: "msg_${DateTime.now().millisecondsSinceEpoch}",
        role: "assistant",
        text:
            "**TURNOUT & VICTORY MARGIN SIMULATION ENGINE (KASBA PETH)**\n\n"
            "• **Total Electorate**: 2,75,420\n"
            "• **Target Turnout (64.0%)**: 1,76,268 votes polled\n"
            "• **Candidate Projected Vote Share**: 53.4% (94,127 votes)\n"
            "• **Chief Rival Projected Vote Share**: 40.8% (71,917 votes)\n"
            "• **Projected Winning Lead**: **+22,210 votes**\n\n"
            "⚡ **Tactical Key**: If turnout in Sadashiv & Shaniwar Peth exceeds 70%, the lead automatically widens to +26,500. Ensure our 44 EV shuttle rickshaws operate without interruption from 7 AM.",
        timestamp: DateTime.now(),
        actions: const [
          AiAction(
            label: "View Report #14 Simulation",
            actionKey: "OPEN_REPORT_14",
            icon: Icons.analytics_rounded,
            color: Colors.indigo,
          ),
          AiAction(
            label: "Export Turnout Forecast PDF",
            actionKey: "EXPORT_PDF",
            icon: Icons.picture_as_pdf_rounded,
            color: Colors.red,
          ),
        ],
      );
    }

    if (lower.contains("ladki") || lower.contains("bahin") || lower.contains("योजना") || lower.contains("dbt")) {
      return AiMessage(
        id: "msg_${DateTime.now().millisecondsSinceEpoch}",
        role: "assistant",
        text:
            "**MAJHI LADKI BAHIN YOJANA CONSTITUENCY AUDIT**\n\n"
            "• **Total Beneficiaries Identified**: 34,200 women voters (12.4% of total electorate)\n"
            "• **Direct Bank Transfer (DBT) Success Rate**: 96.8%\n"
            "• **Sentiment Alignment**: 88% Green (Favorable)\n"
            "• **Top Concentration Booths**: Booths 142 to 170 in Bhavani Peth and Mangalwar Peth clusters.\n\n"
            "🎯 **Recommendation**: Dispatch a personalized recorded audio call from the candidate thanking them and reminding them to vote in the morning slot.",
        timestamp: DateTime.now(),
        actions: const [
          AiAction(
            label: "Target 34.2k via WhatsApp",
            actionKey: "BROADCAST_LADKI_BAHIN",
            icon: Icons.campaign_rounded,
            color: Colors.purple,
          ),
          AiAction(
            label: "View Beneficiary Roll",
            actionKey: "VIEW_BENEFICIARIES",
            icon: Icons.people_outline_rounded,
            color: Colors.teal,
          ),
        ],
      );
    }

    if (lower.contains("booth") || lower.contains("swing") || lower.contains("केंद्रे")) {
      return AiMessage(
        id: "msg_${DateTime.now().millisecondsSinceEpoch}",
        role: "assistant",
        text:
            "**20 HIGH-PRIORITY SWING BOOTHS IDENTIFIED**\n\n"
            "1. **Booth 42-45 (Kasba Peth - Tambat Ali)**: Lead margin currently within ±120 votes.\n"
            "2. **Booth 88-92 (Somwar Peth - Railway Quarters)**: Swing voter concentration: 44%.\n"
            "3. **Booth 156-162 (Bhavani Peth - Timber Market)**: High trade voter density.\n\n"
            "🚩 **Strategic Directive**: 15 senior karyakartas should be redeployed to these booths for doorstep voter slip delivery before 5 PM today.",
        timestamp: DateTime.now(),
        actions: const [
          AiAction(
            label: "Deploy Field Workers",
            actionKey: "DEPLOY_WORKERS",
            icon: Icons.directions_walk_rounded,
            color: Colors.amber,
          ),
          AiAction(
            label: "Open Live Telemetry Map",
            actionKey: "OPEN_FIELD_MAP",
            icon: Icons.map_rounded,
            color: Colors.green,
          ),
        ],
      );
    }

    // Default intelligence answer
    return AiMessage(
      id: "msg_${DateTime.now().millisecondsSinceEpoch}",
      role: "assistant",
      text:
          "Query analyzed across 210 booths and live survey telemetry.\n\n"
          "Our ground feedback indicates steady positive consolidation (+22% net margin). For '$query', the War Room recommends synchronizing booth agent marked lists and triggering micro-targeted WhatsApp messages to local housing society chairmen.",
      timestamp: DateTime.now(),
      actions: const [
        AiAction(
          label: "View Voters Directory",
          actionKey: "OPEN_VOTERS",
          icon: Icons.how_to_reg_rounded,
          color: Colors.blue,
        ),
        AiAction(
          label: "Launch Campaign Blast",
          actionKey: "LAUNCH_CAMPAIGN",
          icon: Icons.campaign_rounded,
          color: Colors.indigo,
        ),
      ],
    );
  }
}
