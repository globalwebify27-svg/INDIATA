import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
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
              "4 Channels: System • Ground • Intel • Directives",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Mark All as Read",
            icon: const Icon(Icons.done_all_rounded, size: 20, color: Colors.blue),
            onPressed: _markAllAsRead,
          ),
          IconButton(
            tooltip: "Clear All",
            icon: Icon(Icons.delete_sweep_rounded, size: 20, color: c.textSecondary),
            onPressed: _clearNotifications,
          ),
        ],
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
                  _channelChip("System (${_items.where((i) => i.channel == NotificationChannel.system).length})", NotificationChannel.system),
                  const SizedBox(width: 6),
                  _channelChip("Ground (${_items.where((i) => i.channel == NotificationChannel.engagement).length})", NotificationChannel.engagement),
                  const SizedBox(width: 6),
                  _channelChip("Intel (${_items.where((i) => i.channel == NotificationChannel.intelligence).length})", NotificationChannel.intelligence),
                  const SizedBox(width: 6),
                  _channelChip("Directives (${_items.where((i) => i.channel == NotificationChannel.directives).length})", NotificationChannel.directives),
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
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
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
          color: isSelected ? c.primary : c.cardBg,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? c.primary : c.borderColor),
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
        color: item.isRead ? c.cardBg : (widget.isDark ? const Color(0xFF1E293B) : const Color(0xFFF0FDF4)),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: item.isRead ? c.borderColor : item.channelColor.withOpacity(0.5),
          width: item.isRead ? 1 : 1.5,
        ),
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
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
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
                                  color: Colors.red,
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
