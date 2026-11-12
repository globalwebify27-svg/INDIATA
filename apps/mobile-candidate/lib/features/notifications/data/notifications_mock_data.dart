import '../models/notification_item_model.dart';

class NotificationsMockData {
  static final List<NotificationItem> items = [
    // Intelligence 1
    NotificationItem(
      id: "notif_01",
      channel: NotificationChannel.intelligence,
      title: "Rival Corner Meeting Detected in Prabhaag 16",
      body: "Chief rival announced an unscheduled corner meeting at 6:30 PM outside Kasba Ganpati mandal. Ground workers report local trader participation.",
      timeAgo: "8m ago",
      isRead: false,
      actionModule: "field_operations",
      actionLabel: "View Field Map",
    ),

    // Engagement 1
    NotificationItem(
      id: "notif_02",
      channel: NotificationChannel.engagement,
      title: "4 New Field Roll Update Requests Awaiting Approval",
      body: "Sachin Shinde and Amit Jagtap reported 2 deceased voters and 2 relocated households in Booths 42 and 158. Candidate sign-off required.",
      timeAgo: "25m ago",
      isRead: false,
      actionModule: "update_requests",
      actionLabel: "Review Requests",
    ),

    // System 1
    NotificationItem(
      id: "notif_03",
      channel: NotificationChannel.system,
      title: "WhatsApp Broadcast API Balance Warning",
      body: "WhatsApp message balance is below 15% (7,420 remaining out of 50,000 quota). Top-up recommended before evening mega broadcast.",
      timeAgo: "1h ago",
      isRead: false,
      actionModule: "campaigns",
      actionLabel: "Manage Quota",
    ),

    // Directives 1
    NotificationItem(
      id: "notif_04",
      channel: NotificationChannel.directives,
      title: "Election Commission (ECI) Model Code Advisory",
      body: "District Election Officer circular issued regarding silent period commencement 48 hours prior to polling. All loudspeaker permissions terminate at 10 PM.",
      timeAgo: "2h ago",
      isRead: false,
      actionModule: "reports",
      actionLabel: "Read Directive",
    ),

    // Intelligence 2
    NotificationItem(
      id: "notif_05",
      channel: NotificationChannel.intelligence,
      title: "Voter Sentiment Shift in Shaniwar Peth (+4.2% Lead)",
      body: "Doorstep survey batch #182 indicates favorable sentiment expansion following yesterday's wada cluster redevelopment townhall.",
      timeAgo: "3h ago",
      isRead: true,
      actionModule: "reports",
      actionLabel: "View Report #03",
    ),

    // Engagement 2
    NotificationItem(
      id: "notif_06",
      channel: NotificationChannel.engagement,
      title: "Karyakarta Milestone: Nitin More crossed 1,000 surveys",
      body: "Bhavani Peth lead Nitin More achieved 100% household coverage in Booth 158. Digital badge awarded to karyakarta profile.",
      timeAgo: "4h ago",
      isRead: true,
      actionModule: "field_operations",
      actionLabel: "View Scorecard",
    ),

    // Directives 2
    NotificationItem(
      id: "notif_07",
      channel: NotificationChannel.directives,
      title: "State Party President Video Conference at 9:00 PM",
      body: "Mandatory virtual strategy briefing for all 8 Pune assembly candidates with Core Election Committee.",
      timeAgo: "5h ago",
      isRead: true,
      actionModule: "phone_book",
      actionLabel: "Core Committee Dial",
    ),

    // System 2
    NotificationItem(
      id: "notif_08",
      channel: NotificationChannel.system,
      title: "Automated Nightly Telemetry Backup Succeeded",
      body: "2,75,420 voter records, 210 booth logs, and 1,420 grievance tickets securely encrypted and synchronized with central cloud repository.",
      timeAgo: "10h ago",
      isRead: true,
      actionModule: "audit_log",
      actionLabel: "Audit Ledger",
    ),
  ];
}
