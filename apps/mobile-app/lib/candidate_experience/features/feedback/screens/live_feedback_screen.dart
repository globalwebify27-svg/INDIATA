import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';

class FeedbackItem {
  final String id;
  final String citizenName;
  final String citizenPhone;
  final int boothNumber;
  final String prabhaag;
  final String sentiment; // POSITIVE, URGENT, NEUTRAL
  final String channel; // Karyakarta App, WhatsApp, IVR Call, Kiosk
  final String timestamp;
  final String message;
  final String reporter;
  String status; // NEW, ACKNOWLEDGED, RESOLVED
  final List<String> tags;

  FeedbackItem({
    required this.id,
    required this.citizenName,
    required this.citizenPhone,
    required this.boothNumber,
    required this.prabhaag,
    required this.sentiment,
    required this.channel,
    required this.timestamp,
    required this.message,
    required this.reporter,
    required this.status,
    required this.tags,
  });
}

class LiveFeedbackScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const LiveFeedbackScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<LiveFeedbackScreen> createState() => _LiveFeedbackScreenState();
}

class _LiveFeedbackScreenState extends State<LiveFeedbackScreen> {
  String _activeFilter = "ALL";
  String _searchQuery = "";
  final TextEditingController _searchController = TextEditingController();

  late List<FeedbackItem> _items;

  @override
  void initState() {
    super.initState();
    _initData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _initData() {
    _items = [
      FeedbackItem(
        id: "fb-01",
        citizenName: "Ramesh Narayan Joshi",
        citizenPhone: "+91 98220 11450",
        boothNumber: 101,
        prabhaag: "Prabhaag 12 - Kothrud West",
        sentiment: "POSITIVE",
        channel: "Karyakarta App",
        timestamp: "4 mins ago",
        message: "Voter slip delivered at home by karyakarta Pooja Jadhav. Entire family (5 electors) confirmed support for Adv. Vikram Patil. Requested candidate to visit Ganesh society mandal.",
        reporter: "Pooja Jadhav (Karyakarta #101)",
        status: "NEW",
        tags: ["Slip Confirmed", "5 Votes", "Society Visit"],
      ),
      FeedbackItem(
        id: "fb-02",
        citizenName: "Sunita Ashok Deshmukh",
        citizenPhone: "+91 98500 23145",
        boothNumber: 102,
        prabhaag: "Prabhaag 12 - Kothrud West",
        sentiment: "URGENT",
        channel: "WhatsApp",
        timestamp: "12 mins ago",
        message: "Drinking water supply in Dahanukar Colony Lane 3 has low pressure since morning. Ward corporator promised repair earlier this week. Urgently request water tanker before polling day.",
        reporter: "Sachin Babar (Prabhaag Incharge)",
        status: "NEW",
        tags: ["Civic Water Issue", "Immediate Follow-up", "Urgent"],
      ),
      FeedbackItem(
        id: "fb-03",
        citizenName: "Amit Suresh Kulkarni",
        citizenPhone: "+91 94220 33890",
        boothNumber: 103,
        prabhaag: "Prabhaag 12 - Kothrud West",
        sentiment: "NEUTRAL",
        channel: "IVR Call",
        timestamp: "28 mins ago",
        message: "Citizen answered outbound AI voice call. Expressed satisfaction with candidate's clean track record, but inquired about local traffic decongestion plans near Paud Phata junction.",
        reporter: "Indic Voice AI Agent",
        status: "ACKNOWLEDGED",
        tags: ["IVR Telemetry", "Traffic Demands", "Swing Elector"],
      ),
      FeedbackItem(
        id: "fb-04",
        citizenName: "Meenakshi Vilas Shinde",
        citizenPhone: "+91 98909 44120",
        boothNumber: 104,
        prabhaag: "Prabhaag 12 - Kothrud West",
        sentiment: "POSITIVE",
        channel: "Booth Kiosk",
        timestamp: "45 mins ago",
        message: "Verified enrollment at Helpdesk Kiosk. Grateful that candidate's team helped resolve grandfather's senior citizen pension documentation last month. Staunch supporter.",
        reporter: "Ganesh Patil (Karyakarta #102)",
        status: "RESOLVED",
        tags: ["Pension Helped", "Grateful", "Committed Voter"],
      ),
      FeedbackItem(
        id: "fb-05",
        citizenName: "Dr. Arvind G. Kulkarni",
        citizenPhone: "+91 98224 88910",
        boothNumber: 105,
        prabhaag: "Prabhaag 14 - Deccan Gymkhana",
        sentiment: "POSITIVE",
        channel: "Karyakarta App",
        timestamp: "1 hour ago",
        message: "Met during morning padayatra at Taljai Hills. Pledged support of 30+ medical association members. Requested manifesto copy on healthcare reforms.",
        reporter: "Mahesh Deshmukh (Ward Coordinator)",
        status: "ACKNOWLEDGED",
        tags: ["Doctor Cadre", "Padayatra", "Influencer"],
      ),
      FeedbackItem(
        id: "fb-06",
        citizenName: "Santosh Baban Kamble",
        citizenPhone: "+91 98600 55210",
        boothNumber: 106,
        prabhaag: "Prabhaag 11 - Kasba Central",
        sentiment: "URGENT",
        channel: "WhatsApp",
        timestamp: "1.5 hours ago",
        message: "Polling station queue shed was damaged in last night wind near Kasba Peth school. Requesting emergency shamiana canopy setup before peak morning turnout.",
        reporter: "Rahul Shinde (Booth Adhyaksh)",
        status: "NEW",
        tags: ["Booth Logistics", "Urgent Canopy", "Station 106"],
      ),
    ];
  }

  List<FeedbackItem> get _filteredItems {
    return _items.where((item) {
      if (_activeFilter != "ALL" && item.sentiment != _activeFilter) {
        return false;
      }
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        return item.citizenName.toLowerCase().contains(query) ||
            item.citizenPhone.contains(query) ||
            item.message.toLowerCase().contains(query) ||
            item.tags.any((t) => t.toLowerCase().contains(query));
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = widget.isDark;

    final totalCount = _items.length;
    final positiveCount = _items.where((i) => i.sentiment == "POSITIVE").length;
    final urgentCount = _items.where((i) => i.sentiment == "URGENT").length;
    final resolvedCount = _items.where((i) => i.status == "RESOLVED").length;

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: c.cardBg,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  "Live Feedback",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: c.textPrimary,
                  ),
                ),
                const SizedBox(width: 6),
                Container(
                  width: 7,
                  height: 7,
                  decoration: const BoxDecoration(
                    color: Color(0xFF22D3EE),
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),
            Text(
              "Real-time Ground Signals & Elector Sentiment",
              style: TextStyle(fontSize: 10.5, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh_rounded, color: c.textPrimary),
            tooltip: "Refresh Feed",
            onPressed: () {
              setState(() => _initData());
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Feedback telemetry synchronized."),
                  duration: Duration(milliseconds: 1200),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // KPI Metric Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
            child: Row(
              children: [
                _buildKpiCard("TOTAL", "$totalCount", const Color(0xFF3B82F6), c),
                const SizedBox(width: 8),
                _buildKpiCard("POSITIVE", "$positiveCount", const Color(0xFF10B981), c),
                const SizedBox(width: 8),
                _buildKpiCard("URGENT", "$urgentCount", const Color(0xFFEF4444), c),
                const SizedBox(width: 8),
                _buildKpiCard("RESOLVED", "$resolvedCount", const Color(0xFF8B5CF6), c),
              ],
            ),
          ),

          // Search Bar & Filter Chips
          Container(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 6),
            color: c.cardBg,
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: (val) => setState(() => _searchQuery = val.trim()),
                  style: TextStyle(fontSize: 13, color: c.textPrimary),
                  decoration: InputDecoration(
                    hintText: "Search signals by citizen, phone, or issue...",
                    hintStyle: TextStyle(fontSize: 12, color: c.textSecondary),
                    prefixIcon: const Icon(Icons.search_rounded, size: 20),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.close_rounded, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              setState(() => _searchQuery = "");
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: c.borderColor),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: c.borderColor),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildFilterChip("ALL", "All Signals ($totalCount)"),
                      const SizedBox(width: 6),
                      _buildFilterChip("POSITIVE", "Positive ($positiveCount)", color: const Color(0xFF10B981)),
                      const SizedBox(width: 6),
                      _buildFilterChip("URGENT", "Urgent Issues ($urgentCount)", color: const Color(0xFFEF4444)),
                      const SizedBox(width: 6),
                      _buildFilterChip("NEUTRAL", "Neutral / Swing (1)", color: const Color(0xFF6366F1)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Feedback Stream List
          Expanded(
            child: _filteredItems.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.chat_bubble_outline_rounded, size: 44, color: c.textSecondary),
                        const SizedBox(height: 10),
                        Text(
                          "No feedback signals match your filter",
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: _filteredItems.length,
                    itemBuilder: (context, index) {
                      final item = _filteredItems[index];
                      return _buildFeedbackCard(item, c, isDark);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpiCard(String title, String count, Color color, CandidateColors c) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
        decoration: BoxDecoration(
          color: color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.3), width: 0.8),
        ),
        child: Column(
          children: [
            Text(
              count,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: color),
            ),
            Text(
              title,
              style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold, color: c.textSecondary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String filterKey, String label, {Color? color}) {
    final isSelected = _activeFilter == filterKey;
    final activeColor = color ?? const Color(0xFF3B82F6);

    return InkWell(
      onTap: () => setState(() => _activeFilter = filterKey),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? activeColor.withOpacity(0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? activeColor : widget.c.borderColor,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? activeColor : widget.c.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildFeedbackCard(FeedbackItem item, CandidateColors c, bool isDark) {
    Color sentimentColor;
    String sentimentLabel;
    IconData sentimentIcon;

    if (item.sentiment == "POSITIVE") {
      sentimentColor = const Color(0xFF10B981);
      sentimentLabel = "POSITIVE";
      sentimentIcon = Icons.thumb_up_rounded;
    } else if (item.sentiment == "URGENT") {
      sentimentColor = const Color(0xFFEF4444);
      sentimentLabel = "URGENT ISSUE";
      sentimentIcon = Icons.warning_rounded;
    } else {
      sentimentColor = const Color(0xFF6366F1);
      sentimentLabel = "NEUTRAL / SWING";
      sentimentIcon = Icons.info_rounded;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: item.sentiment == "URGENT" && item.status == "NEW"
              ? const Color(0xFFEF4444).withOpacity(0.4)
              : c.borderColor,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Header: Sentiment Badge + Channel + Timestamp
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                decoration: BoxDecoration(
                  color: sentimentColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: sentimentColor.withOpacity(0.4), width: 0.8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(sentimentIcon, size: 11, color: sentimentColor),
                    const SizedBox(width: 4),
                    Text(
                      sentimentLabel,
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        color: sentimentColor,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      item.channel,
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: c.textSecondary),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    item.timestamp,
                    style: TextStyle(fontSize: 10, color: c.textSecondary),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Citizen Name + Phone + Booth
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: c.primary.withOpacity(0.15),
                child: Text(
                  item.citizenName.split(" ").map((w) => w[0]).take(2).join(),
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.primary),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.citizenName,
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    Text(
                      "${item.citizenPhone} • Booth #${item.boothNumber} (${item.prabhaag})",
                      style: TextStyle(fontSize: 10, color: c.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Message Body
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: c.borderColor.withOpacity(0.6)),
            ),
            child: Text(
              item.message,
              style: TextStyle(fontSize: 11.5, height: 1.4, color: c.textPrimary),
            ),
          ),

          const SizedBox(height: 8),

          // Tags Row
          Wrap(
            spacing: 5,
            runSpacing: 4,
            children: item.tags.map((tag) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : const Color(0xFFEDE9FE),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  "#$tag",
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w600,
                    color: isDark ? const Color(0xFFA5B4FC) : const Color(0xFF4F46E5),
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 10),

          // Footer Action Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Via: ${item.reporter}",
                style: TextStyle(fontSize: 9.5, fontStyle: FontStyle.italic, color: c.textSecondary),
              ),
              Row(
                children: [
                  if (item.status != "RESOLVED")
                    InkWell(
                      onTap: () {
                        setState(() {
                          item.status = "RESOLVED";
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Signal for ${item.citizenName} marked as Resolved.")),
                        );
                      },
                      borderRadius: BorderRadius.circular(6),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.check_circle_outline, size: 12, color: Color(0xFF10B981)),
                            SizedBox(width: 4),
                            Text(
                              "Resolve",
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        "Resolved ✓",
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
