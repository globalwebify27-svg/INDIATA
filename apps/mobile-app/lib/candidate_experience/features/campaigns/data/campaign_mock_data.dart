import '../models/campaign_model.dart';

class CampaignTemplate {
  final String id;
  final String name;
  final CampaignChannel channel;
  final String contentEn;
  final String contentMr;
  final List<String> placeholders;

  const CampaignTemplate({
    required this.id,
    required this.name,
    required this.channel,
    required this.contentEn,
    required this.contentMr,
    required this.placeholders,
  });
}

class CampaignMockData {
  // Gateway Quotas
  static const int whatsappTotal = 100000;
  static const int whatsappUsed = 54800;
  static const int whatsappBalance = 45200;

  static const int smsTotal = 200000;
  static const int smsUsed = 80000;
  static const int smsBalance = 120000;

  static const int voiceMinutesTotal = 25000;
  static const int voiceMinutesUsed = 12600;
  static const int voiceMinutesBalance = 12400;

  // Pre-approved message templates
  static final List<CampaignTemplate> templates = [
    const CampaignTemplate(
      id: "TPL-WA-01",
      name: "Ladki Bahin Yojana Scheme Greeting",
      channel: CampaignChannel.whatsapp,
      contentEn:
          "Namaskar {{voter_name}} Ji, heartiest greetings on behalf of Adv. Vikram Patil. As an active beneficiary of Majhi Ladki Bahin Yojana, we commit to strengthening women's welfare programs in 215 - Kasba Peth. Your polling booth is #{{booth_number}}. Contact our War Room for any assistance.",
      contentMr:
          "नमस्कार {{voter_name}} जी, ॲड. विक्रम पाटील यांच्याकडून मनःपूर्वक शुभेच्छा. 'माझी लाडकी बहीण योजने'चा लाभ आपणास मिळत असल्याचा आम्हाला आनंद आहे. कसबा पेठेच्या सर्वांगीण विकासासाठी आम्ही कटिबद्ध आहोत. आपले मतदान केंद्र: बूथ क्र. {{booth_number}}.",
      placeholders: ["{{voter_name}}", "{{booth_number}}"],
    ),

    const CampaignTemplate(
      id: "TPL-WA-02",
      name: "Voter Information Slip Notification",
      channel: CampaignChannel.whatsapp,
      contentEn:
          "Dear {{voter_name}}, your Official Voter Information Slip for Kasba Peth (Booth #{{booth_number}}, Serial #{{serial_number}}) has been generated. Please cast your valuable vote on 20 November 2026. Adv. Vikram Patil Campaign.",
      contentMr:
          "आदरणीय {{voter_name}}, कसबा पेठ विधानसभा निवडणुकीसाठी आपली अधिकृत मतदार पावती (बूथ क्र. {{booth_number}}, अनुक्रमांक {{serial_number}}) तयार आहे. कृपया २० नोव्हेंबर रोजी आपला मतदानाचा हक्क अवश्य बजावा. ॲड. विक्रम पाटील प्रचार समिती.",
      placeholders: ["{{voter_name}}", "{{booth_number}}", "{{serial_number}}"],
    ),

    const CampaignTemplate(
      id: "TPL-SMS-01",
      name: "Polling Day Turnout Mobilization",
      channel: CampaignChannel.sms,
      contentEn:
          "RAJ-TANTRA: {{voter_name}}, polling is live! Cast your vote at Booth #{{booth_number}} before 6 PM. For free transport assistance, call 1800-RAJ-TANTRA.",
      contentMr:
          "राजतंत्र: {{voter_name}}, आज मतदानाचा दिवस! बूथ क्र. {{booth_number}} येथे संध्याकाळी ६ पूर्वी अवश्य मतदान करा. मोफत वाहन मदतीसाठी संपर्क: १८००-राज-तंत्र.",
      placeholders: ["{{voter_name}}", "{{booth_number}}"],
    ),

    const CampaignTemplate(
      id: "TPL-VOICE-01",
      name: "Candidate Personal Vision Audio Call",
      channel: CampaignChannel.aiVoice,
      contentEn:
          "Hello {{voter_name}}, I am Adv. Vikram Patil speaking directly to you from our Kasba Peth election war room. I request your blessings and support for modern healthcare, wada redevelopment, and clean drinking water. Thank you.",
      contentMr:
          "नमस्कार {{voter_name}}, मी ॲड. विक्रम पाटील आपल्या कसबा पेठ निवडणूक नियंत्रण कक्षातून थेट आपल्याशी संवाद साधत आहे. कसबा पेठेतील वाडा पुनर्विकास, शुद्ध पाणी व आरोग्य सुविधांसाठी आपले बहुमूल्य मत व आशीर्वाद मला द्यावेत, ही नम्र विनंती.",
      placeholders: ["{{voter_name}}"],
    ),
  ];

  // Active and past campaigns
  static final List<CampaignModel> campaigns = [
    const CampaignModel(
      id: "CMP-2026-001",
      title: "Majhi Ladki Bahin Beneficiaries Greeting",
      titleMr: "माझी लाडकी बहीण लाभार्थी संवाद",
      channel: CampaignChannel.whatsapp,
      category: CampaignCategory.festivalGreeting,
      status: CampaignStatus.liveDispatching,
      targetAudience: "45,000 Female Voters (Kasba Peth Core)",
      targetCount: 45000,
      dispatchedCount: 42100,
      deliveredCount: 40200,
      readCount: 34800,
      failedCount: 420,
      messageContent:
          "नमस्कार {{voter_name}} जी, ॲड. विक्रम पाटील यांच्याकडून मनःपूर्वक शुभेच्छा. 'माझी लाडकी बहीण योजने'चा लाभ आपणास मिळत असल्याचा आम्हाला आनंद आहे. कसबा पेठेच्या सर्वांगीण विकासासाठी आम्ही कटिबद्ध आहोत.",
      createdDate: "Today, 09:30 AM",
      scheduledDate: "Immediate Dispatch",
      attachmentType: "image",
    ),

    const CampaignModel(
      id: "CMP-2026-002",
      title: "Adv. Vikram Patil Personal Vision Audio Call",
      titleMr: "उमेदवार वैयक्तिक व्हॉईस कॉल मोहीम",
      channel: CampaignChannel.aiVoice,
      category: CampaignCategory.manifestoVision,
      status: CampaignStatus.liveDispatching,
      targetAudience: "14,000 Senior Citizens & Family Heads",
      targetCount: 14000,
      dispatchedCount: 9800,
      deliveredCount: 8400,
      readCount: 7900,
      failedCount: 180,
      messageContent:
          "नमस्कार {{voter_name}}, मी ॲड. विक्रम पाटील बोलत आहे. कसबा पेठेतील वाडा पुनर्विकास आणि पाणी प्रश्नावर आम्ही पूर्ण ताकदीने काम करत आहोत. आपले आशीर्वाद सदैव पाठीशी असू द्या.",
      createdDate: "Today, 10:15 AM",
      scheduledDate: "Immediate Dispatch",
      attachmentType: "audio",
    ),

    const CampaignModel(
      id: "CMP-2026-003",
      title: "Booth #40-#45 Doorstep Survey Pre-Notification",
      titleMr: "बूथ ४०-४५ घरोघरी सर्व्हे पूर्वसूचना",
      channel: CampaignChannel.sms,
      category: CampaignCategory.voterSlipNotice,
      status: CampaignStatus.completed,
      targetAudience: "8,400 Household Heads in Shaniwar Peth",
      targetCount: 8400,
      dispatchedCount: 8400,
      deliveredCount: 8280,
      readCount: 7950,
      failedCount: 120,
      messageContent:
          "RAJ-TANTRA: Our karyakarta Mahesh Deshmukh is visiting your lane today for voter slip distribution and doorstep civic survey. Adv. Vikram Patil Campaign.",
      createdDate: "Yesterday, 04:00 PM",
      scheduledDate: "Dispatched Successfully",
    ),

    const CampaignModel(
      id: "CMP-2026-004",
      title: "Grand Campaign Rally at Shaniwar Wada",
      titleMr: "शनिवार वाडा भव्य प्रचार सभा निमंत्रण",
      channel: CampaignChannel.whatsapp,
      category: CampaignCategory.rallyInvitation,
      status: CampaignStatus.scheduled,
      targetAudience: "68,000 Youth & Committed Supporters",
      targetCount: 68000,
      dispatchedCount: 0,
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
      messageContent:
          "🚩 भव्य जाहीर सभा! शनिवार वाडा पटांगण येथे रविवार, सायंकाळी ६ वाजता. प्रमुख उपस्थिती: ॲड. विक्रम पाटील व महायुतीचे सर्व ज्येष्ठ नेते. आपण सहकुटुंब उपस्थित राहावे ही आग्रहाची विनंती.",
      createdDate: "Today, 01:00 PM",
      scheduledDate: "Tomorrow, 08:00 AM",
      attachmentType: "image",
    ),

    const CampaignModel(
      id: "CMP-2026-005",
      title: "Traders & Merchant Association Policy Brief",
      titleMr: "रविवार पेठ व्यापारी धोरण जाहीरनामा",
      channel: CampaignChannel.whatsapp,
      category: CampaignCategory.manifestoVision,
      status: CampaignStatus.paused,
      targetAudience: "6,200 Commercial Shop Owners in Raviwar Peth",
      targetCount: 6200,
      dispatchedCount: 2400,
      deliveredCount: 2280,
      readCount: 1910,
      failedCount: 45,
      messageContent:
          "Commercial trade policy statement by Adv. Vikram Patil: Dedicated parking complexes and streamlined trade licensing in Kasba Peth market corridor.",
      createdDate: "09 Feb 2026",
      scheduledDate: "Paused by Candidate",
      attachmentType: "pdf",
    ),
  ];
}
