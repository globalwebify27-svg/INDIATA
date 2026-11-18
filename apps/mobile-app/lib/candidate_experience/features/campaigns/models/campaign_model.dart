enum CampaignChannel {
  whatsapp,
  sms,
  aiVoice,
  autoGreeting,
}

enum CampaignStatus {
  liveDispatching,
  scheduled,
  completed,
  paused,
}

enum CampaignCategory {
  rallyInvitation,
  manifestoVision,
  festivalGreeting,
  pollingDayMobilization,
  voterSlipNotice,
}

class CampaignModel {
  final String id;
  final String title;
  final String titleMr;
  final CampaignChannel channel;
  final CampaignCategory category;
  final CampaignStatus status;
  final String targetAudience;
  final int targetCount;
  final int dispatchedCount;
  final int deliveredCount;
  final int readCount;
  final int failedCount;
  final String messageContent;
  final String? attachmentUrl;
  final String? attachmentType; // image, pdf, audio
  final String createdDate;
  final String scheduledDate;
  final String creatorName;

  const CampaignModel({
    required this.id,
    required this.title,
    required this.titleMr,
    required this.channel,
    required this.category,
    required this.status,
    required this.targetAudience,
    required this.targetCount,
    required this.dispatchedCount,
    required this.deliveredCount,
    required this.readCount,
    required this.failedCount,
    required this.messageContent,
    this.attachmentUrl,
    this.attachmentType,
    required this.createdDate,
    required this.scheduledDate,
    this.creatorName = "Adv. Vikram Patil (Candidate)",
  });

  double get progressPct =>
      targetCount > 0 ? (dispatchedCount / targetCount) * 100 : 0.0;
  double get deliveryRatePct =>
      dispatchedCount > 0 ? (deliveredCount / dispatchedCount) * 100 : 0.0;
  double get readRatePct =>
      deliveredCount > 0 ? (readCount / deliveredCount) * 100 : 0.0;

  String get channelLabel {
    switch (channel) {
      case CampaignChannel.whatsapp:
        return "WhatsApp API";
      case CampaignChannel.sms:
        return "Bulk SMS Gateway";
      case CampaignChannel.aiVoice:
        return "AI Voice Calling Bot";
      case CampaignChannel.autoGreeting:
        return "Automated Greeting";
    }
  }

  CampaignModel copyWith({
    CampaignStatus? status,
    int? dispatchedCount,
    int? deliveredCount,
    int? readCount,
  }) {
    return CampaignModel(
      id: id,
      title: title,
      titleMr: titleMr,
      channel: channel,
      category: category,
      status: status ?? this.status,
      targetAudience: targetAudience,
      targetCount: targetCount,
      dispatchedCount: dispatchedCount ?? this.dispatchedCount,
      deliveredCount: deliveredCount ?? this.deliveredCount,
      readCount: readCount ?? this.readCount,
      failedCount: failedCount,
      messageContent: messageContent,
      attachmentUrl: attachmentUrl,
      attachmentType: attachmentType,
      createdDate: createdDate,
      scheduledDate: scheduledDate,
      creatorName: creatorName,
    );
  }
}
