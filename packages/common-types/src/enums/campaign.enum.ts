export enum CampaignChannel {
  WHATSAPP = "WHATSAPP",
  SMS = "SMS",
  AI_VOICE = "AI_VOICE",
  BULK = "BULK",
}

export enum CampaignStatus {
  RUNNING = "RUNNING",
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
  DRAFT = "DRAFT",
}

export enum CampaignType {
  VOTER_SLIP = "Voter Slip Sharing",
  VOTING_INFO = "Voting Information",
  ANNOUNCEMENT = "General Announcement",
  ELECTION_DAY_REMINDER = "Election Day Reminder",
  GREETINGS = "Festival / Holiday Greetings",
  VOLUNTEER_COMMUNICATION = "Volunteer / Worker Communication",
}

export enum TemplateStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}
