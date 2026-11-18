import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../../karyakartas/models/karyakarta_model.dart';
import '../../karyakartas/data/karyakarta_mock_data.dart';
import '../models/notification_item_model.dart';
import '../data/notifications_mock_data.dart';

class NotificationsScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final Function(String) onOpenModule;

  const NotificationsScreen({
    super.key,
    required this.c,
    required this.isDark,
    required this.onOpenModule,
  });

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<NotificationItem> _items = List.from(NotificationsMockData.items);
  NotificationChannel? _selectedChannel; // null = all

  int get _unreadCount => _items.where((i) => !i.isRead).length;

  List<NotificationItem> get _filteredItems {
    if (_selectedChannel == null) return _items;
    return _items.where((i) => i.channel == _selectedChannel).toList();
  }

  void _markAllAsRead() {
    setState(() {
      for (final item in _items) {
        item.isRead = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("All notifications marked as read.")),
    );
  }

  void _clearNotifications() {
    setState(() {
      _items.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("All notifications cleared.")),
    );
  }

  // Custom Karyakarta Messaging Module (Section 11 Requirement)
  void _openComposeDirectiveSheet() {
    bool isBulk = true;
    KaryakartaModel selectedWorker = KaryakartaMockData.karyakartas.first;
    final titleController = TextEditingController();
    final bodyController = TextEditingController();
    String priority = "High Priority";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: widget.c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6256D9).withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.send_rounded, color: Color(0xFF6256D9), size: 20),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Dispatch Karyakarta Push Directive",
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                          ),
                          Text(
                            "Direct mobile application broadcast to ground field force",
                            style: TextStyle(fontSize: 10, color: widget.c.textSecondary),
                          ),
                        ],
                      ),
                    ],
                  ),
                  IconButton(
                    icon: Icon(Icons.close_rounded, size: 20, color: widget.c.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Divider(height: 1),
              const SizedBox(height: 12),

              // Delivery Scope Switcher (Bulk vs 1-to-1)
              Text(
                "DELIVERY SCOPE",
                style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.8),
              ),
              const SizedBox(height: 8),

              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => setSheetState(() => isBulk = true),
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                        decoration: BoxDecoration(
                          color: isBulk ? const Color(0xFF6256D9) : widget.c.scaffoldBg,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isBulk ? const Color(0xFF6256D9) : widget.c.cardBorder,
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.groups_rounded, size: 16, color: isBulk ? Colors.white : widget.c.textSecondary),
                            const SizedBox(width: 6),
                            Text(
                              "Bulk (All 184)",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: isBulk ? Colors.white : widget.c.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: InkWell(
                      onTap: () => setSheetState(() => isBulk = false),
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                        decoration: BoxDecoration(
                          color: !isBulk ? const Color(0xFF6256D9) : widget.c.scaffoldBg,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: !isBulk ? const Color(0xFF6256D9) : widget.c.cardBorder,
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.person_rounded, size: 16, color: !isBulk ? Colors.white : widget.c.textSecondary),
                            const SizedBox(width: 6),
                            Text(
                              "Targeted 1-to-1",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: !isBulk ? Colors.white : widget.c.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Targeted Karyakarta Picker (if not bulk)
              if (!isBulk) ...[
                Text(
                  "SELECT RECIPIENT KARYAKARTA",
                  style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.8),
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: widget.c.scaffoldBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: widget.c.cardBorder),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<KaryakartaModel>(
                      value: selectedWorker,
                      isExpanded: true,
                      dropdownColor: widget.c.cardBg,
                      style: TextStyle(fontSize: 12, color: widget.c.textPrimary),
                      items: KaryakartaMockData.karyakartas.map((k) {
                        return DropdownMenuItem(
                          value: k,
                          child: Text("${k.name} (Booth #${k.assignedBooth}) • ${k.role}"),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setSheetState(() => selectedWorker = val);
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 12),
              ],

              // Priority Selector
              Text(
                "PRIORITY LEVEL",
                style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.8),
              ),
              const SizedBox(height: 6),
              Row(
                children: ["High Priority", "Field Directive", "Routine Update"].map((p) {
                  final isSelected = priority == p;
                  return Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: ChoiceChip(
                      label: Text(p),
                      selected: isSelected,
                      selectedColor: const Color(0xFF6256D9).withOpacity(0.18),
                      backgroundColor: widget.c.scaffoldBg,
                      labelStyle: TextStyle(
                        fontSize: 10,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        color: isSelected ? const Color(0xFF6256D9) : widget.c.textSecondary,
                      ),
                      side: BorderSide(
                        color: isSelected ? const Color(0xFF6256D9) : widget.c.cardBorder,
                      ),
                      onSelected: (val) {
                        if (val) setSheetState(() => priority = p);
                      },
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 12),

              // Directive Title
              Text(
                "DIRECTIVE TITLE *",
                style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.8),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: titleController,
                style: TextStyle(fontSize: 12, color: widget.c.textPrimary),
                decoration: InputDecoration(
                  hintText: "e.g. Morning Doorstep Voter Slip Rush for Booth #42",
                  hintStyle: TextStyle(fontSize: 11, color: widget.c.textMuted),
                  filled: true,
                  fillColor: widget.c.scaffoldBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: widget.c.cardBorder)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: widget.c.cardBorder)),
                ),
              ),
              const SizedBox(height: 12),

              // Directive Body
              Text(
                "DIRECTIVE MESSAGE INSTRUCTIONS *",
                style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.8),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: bodyController,
                maxLines: 3,
                style: TextStyle(fontSize: 12, color: widget.c.textPrimary),
                decoration: InputDecoration(
                  hintText: "Enter operational instructions (e.g. verify Ladki Bahin slips before 11 AM)...",
                  hintStyle: TextStyle(fontSize: 11, color: widget.c.textMuted),
                  filled: true,
                  fillColor: widget.c.scaffoldBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: widget.c.cardBorder)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: widget.c.cardBorder)),
                ),
              ),
              const SizedBox(height: 18),

              // Action Button
              SizedBox(
                width: double.infinity,
                height: 46,
                child: ElevatedButton.icon(
                  onPressed: () {
                    final title = titleController.text.trim();
                    final body = bodyController.text.trim();

                    if (title.isEmpty || body.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Please provide Directive Title and Message.")),
                      );
                      return;
                    }

                    final recipientDesc = isBulk ? "All 184 Karyakartas" : selectedWorker.name;

                    final newNotification = NotificationItem(
                      id: "notif_dir_${DateTime.now().millisecondsSinceEpoch}",
                      channel: NotificationChannel.directives,
                      title: "[$priority] $title → $recipientDesc",
                      body: body,
                      timeAgo: "Just now",
                      isRead: false,
                      actionLabel: "View Field Tracking",
                      actionModule: "field-map",
                    );

                    setState(() {
                      _items.insert(0, newNotification);
                    });

                    Navigator.pop(ctx);

                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFF10B981),
                        content: Row(
                          children: [
                            const Icon(Icons.check_circle_rounded, color: Colors.white, size: 16),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                "Push notification successfully dispatched to $recipientDesc.",
                                style: const TextStyle(color: Colors.white, fontSize: 12),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.send_rounded, size: 16),
                  label: const Text("Dispatch Push Notification", style: TextStyle(fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6256D9),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final items = _filteredItems;

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
                Text(
                  "Notifications Stream",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
                ),
                if (_unreadCount > 0) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      "$_unreadCount NEW",
                      style: const TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                  ),
                ],
              ],
            ),
            Text(
              "4 Channels: Directives • Ground • Intel • System",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Mark All as Read",
            icon: const Icon(Icons.done_all_rounded, size: 20, color: Color(0xFF6256D9)),
            onPressed: _markAllAsRead,
          ),
          IconButton(
            tooltip: "Clear All",
            icon: Icon(Icons.delete_sweep_rounded, size: 20, color: c.textSecondary),
            onPressed: _clearNotifications,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openComposeDirectiveSheet,
        backgroundColor: const Color(0xFF6256D9),
        icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
        label: const Text(
          "Compose Directive",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          // Channel Filter Chips
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            color: c.cardBg,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _channelChip("All (${_items.length})", null),
                  const SizedBox(width: 6),
                  _channelChip(
                    "Directives (${_items.where((i) => i.channel == NotificationChannel.directives).length})",
                    NotificationChannel.directives,
                  ),
                  const SizedBox(width: 6),
                  _channelChip(
                    "Ground (${_items.where((i) => i.channel == NotificationChannel.engagement).length})",
                    NotificationChannel.engagement,
                  ),
                  const SizedBox(width: 6),
                  _channelChip(
                    "Intel (${_items.where((i) => i.channel == NotificationChannel.intelligence).length})",
                    NotificationChannel.intelligence,
                  ),
                  const SizedBox(width: 6),
                  _channelChip(
                    "System (${_items.where((i) => i.channel == NotificationChannel.system).length})",
                    NotificationChannel.system,
                  ),
                ],
              ),
            ),
          ),

          // Notifications List
          Expanded(
            child: items.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.notifications_off_outlined, size: 48, color: c.textMuted),
                        const SizedBox(height: 10),
                        Text(
                          "No notifications in this channel.",
                          style: TextStyle(fontSize: 12, color: c.textSecondary),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(14, 12, 14, 80),
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      final item = items[index];
                      return _buildNotificationCard(item);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _channelChip(String label, NotificationChannel? channel) {
    final isSelected = _selectedChannel == channel;
    final c = widget.c;

    return InkWell(
      onTap: () => setState(() => _selectedChannel = channel),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF6256D9) : c.cardBg,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? const Color(0xFF6256D9) : c.cardBorder),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : c.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationCard(NotificationItem item) {
    final c = widget.c;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: item.isRead
            ? c.cardBg
            : (widget.isDark ? const Color(0xFF141417) : const Color(0xFFF5F3FF)),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: item.isRead ? c.cardBorder : const Color(0xFF6256D9).withOpacity(0.5),
          width: item.isRead ? 1 : 1.5,
        ),
        boxShadow: [
          if (!item.isRead)
            BoxShadow(
              color: const Color(0xFF6256D9).withOpacity(0.12),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          setState(() {
            item.isRead = true;
          });
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: item.channelColor.withOpacity(0.12),
                child: Icon(item.channelIcon, size: 18, color: item.channelColor),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: item.channelColor.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            item.channelLabel,
                            style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: item.channelColor),
                          ),
                        ),
                        Row(
                          children: [
                            Text(
                              item.timeAgo,
                              style: TextStyle(fontSize: 9.5, color: c.textMuted),
                            ),
                            if (!item.isRead) ...[
                              const SizedBox(width: 6),
                              Container(
                                width: 7,
                                height: 7,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF6256D9),
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    Text(
                      item.title,
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: item.isRead ? FontWeight.bold : FontWeight.w900,
                        color: c.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item.body,
                      style: TextStyle(fontSize: 11, color: c.textSecondary, height: 1.35),
                    ),
                    if (item.actionModule != null && item.actionLabel != null) ...[
                      const SizedBox(height: 8),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: OutlinedButton.icon(
                          onPressed: () {
                            setState(() {
                              item.isRead = true;
                            });
                            widget.onOpenModule(item.actionModule!);
                          },
                          icon: const Icon(Icons.arrow_outward_rounded, size: 12),
                          label: Text(item.actionLabel!, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: item.channelColor,
                            side: BorderSide(color: item.channelColor.withOpacity(0.5)),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
