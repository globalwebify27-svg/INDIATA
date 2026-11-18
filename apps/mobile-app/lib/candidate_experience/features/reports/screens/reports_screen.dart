import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/report_model.dart';
import '../data/reports_mock_data.dart';
import 'report_detail_screen.dart';

class ReportsScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const ReportsScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String _searchQuery = "";
  ReportCategory? _selectedCategory; // null = all

  List<ReportModel> get _filteredReports {
    return ReportsMockData.allReports.where((r) {
      final matchesSearch = _searchQuery.isEmpty ||
          r.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          r.titleMr.contains(_searchQuery) ||
          r.keySummary.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesCategory = _selectedCategory == null || r.category == _selectedCategory;

      return matchesSearch && matchesCategory;
    }).toList();
  }

  // Comprehensive 4-Category Export Engine (Section 8 Requirement)
  void _openExportDatasetModal() {
    int selectedExportCategory = 0; // 0=Demographics, 1=Campaigns, 2=Slips, 3=Issues
    String selectedFormat = "PDF"; // PDF, CSV, Excel

    // Category 1 filters
    String genderFilter = "All";
    String mobileFilter = "All";
    String duplicateFilter = "All";

    // Category 2 filters
    String campaignStatusFilter = "All";

    // Category 3 filters
    String slipChannelFilter = "All";

    // Category 4 filters
    String issueStatusFilter = "All";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: widget.c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setExportState) => Padding(
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
                        child: const Icon(Icons.file_download_rounded, color: Color(0xFF6256D9), size: 20),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Export Filtered Dataset",
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                          ),
                          Text(
                            "Multi-Category Analytical Extraction (PDF / CSV / Excel)",
                            style: TextStyle(fontSize: 9.5, color: widget.c.textSecondary),
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
              const SizedBox(height: 12),
              const Divider(height: 1),
              const SizedBox(height: 12),

              // Category Selector Tabs
              Text(
                "DATASET CATEGORY",
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.8),
              ),
              const SizedBox(height: 6),

              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _categoryTab("1. Demographics & Lists", 0, selectedExportCategory, (idx) => setExportState(() => selectedExportCategory = idx)),
                    const SizedBox(width: 6),
                    _categoryTab("2. Campaign Metrics", 1, selectedExportCategory, (idx) => setExportState(() => selectedExportCategory = idx)),
                    const SizedBox(width: 6),
                    _categoryTab("3. Slip Generation Logs", 2, selectedExportCategory, (idx) => setExportState(() => selectedExportCategory = idx)),
                    const SizedBox(width: 6),
                    _categoryTab("4. Survey & Booth Issues", 3, selectedExportCategory, (idx) => setExportState(() => selectedExportCategory = idx)),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // Filter Controls Container
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: widget.isDark ? const Color(0xFF141417) : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: widget.c.cardBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (selectedExportCategory == 0) ...[
                      // Category 1: Demographics & Lists
                      _dropdownFilterRow("Gender Filter", genderFilter, ["All", "Male", "Female", "Other"], (v) => setExportState(() => genderFilter = v)),
                      const SizedBox(height: 8),
                      _dropdownFilterRow("Mobile Number Availability", mobileFilter, ["All", "Present (84%)", "Missing (16%)"], (v) => setExportState(() => mobileFilter = v)),
                      const SizedBox(height: 8),
                      _dropdownFilterRow("Duplicate Analysis", duplicateFilter, ["All Records", "Duplicate Phone Numbers (1,240)", "Duplicate EPIC IDs (18)"], (v) => setExportState(() => duplicateFilter = v)),
                    ] else if (selectedExportCategory == 1) ...[
                      // Category 2: Campaign Metrics
                      _dropdownFilterRow("Delivery Status", campaignStatusFilter, ["All Dispatches", "Total Sent (122.5k)", "Delivered (118.4k)", "Received/Read (98.2k)", "Failed (4.1k)"], (v) => setExportState(() => campaignStatusFilter = v)),
                    ] else if (selectedExportCategory == 2) ...[
                      // Category 3: Slip Generation Logs
                      _dropdownFilterRow("Slip Channel", slipChannelFilter, ["All Slip Records", "Thermal Bluetooth Printed (18.4k)", "Digital WhatsApp PDF (32.8k)"], (v) => setExportState(() => slipChannelFilter = v)),
                    ] else ...[
                      // Category 4: Survey & Booth Issues
                      _dropdownFilterRow("Resolution Status", issueStatusFilter, ["All Ground Issues", "Open Tickets (42)", "In Progress (18)", "Resolved (84)"], (v) => setExportState(() => issueStatusFilter = v)),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // File Format Selector
              Text(
                "FILE EXPORT FORMAT",
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.8),
              ),
              const SizedBox(height: 6),

              Row(
                children: [
                  _formatChip("PDF Report (.pdf)", Icons.picture_as_pdf_rounded, "PDF", selectedFormat, Colors.red, (f) => setExportState(() => selectedFormat = f)),
                  const SizedBox(width: 8),
                  _formatChip("CSV Spreadsheet (.csv)", Icons.table_chart_rounded, "CSV", selectedFormat, Colors.green, (f) => setExportState(() => selectedFormat = f)),
                  const SizedBox(width: 8),
                  _formatChip("Excel (.xlsx)", Icons.grid_on_rounded, "Excel", selectedFormat, Colors.blue, (f) => setExportState(() => selectedFormat = f)),
                ],
              ),
              const SizedBox(height: 18),

              // Export Button
              SizedBox(
                width: double.infinity,
                height: 46,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFF6256D9),
                        content: Row(
                          children: [
                            const Icon(Icons.check_circle_rounded, color: Colors.white, size: 16),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                "Generated and downloaded: Kasba_Peth_Category${selectedExportCategory + 1}_Dataset.$selectedFormat",
                                style: const TextStyle(color: Colors.white, fontSize: 11.5),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.download_rounded, size: 18),
                  label: Text("Download $selectedFormat Dataset", style: const TextStyle(fontWeight: FontWeight.bold)),
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

  Widget _categoryTab(String title, int index, int selected, Function(int) onSelect) {
    final isSelected = selected == index;
    return InkWell(
      onTap: () => onSelect(index),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF6256D9) : widget.c.scaffoldBg,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? const Color(0xFF6256D9) : widget.c.cardBorder),
        ),
        child: Text(
          title,
          style: TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : widget.c.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _dropdownFilterRow(String label, String value, List<String> options, Function(String) onChanged) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: widget.c.textPrimary)),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          decoration: BoxDecoration(
            color: widget.c.cardBg,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: widget.c.cardBorder),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: value,
              isDense: true,
              dropdownColor: widget.c.cardBg,
              style: TextStyle(fontSize: 11, color: widget.c.textPrimary),
              items: options.map((opt) => DropdownMenuItem(value: opt, child: Text(opt))).toList(),
              onChanged: (val) {
                if (val != null) onChanged(val);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _formatChip(String label, IconData icon, String format, String current, Color color, Function(String) onSelect) {
    final isSelected = current == format;
    return Expanded(
      child: InkWell(
        onTap: () => onSelect(format),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? color.withOpacity(0.15) : widget.c.scaffoldBg,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: isSelected ? color : widget.c.cardBorder, width: isSelected ? 1.5 : 1),
          ),
          child: Column(
            children: [
              Icon(icon, size: 16, color: isSelected ? color : widget.c.textMuted),
              const SizedBox(height: 3),
              Text(
                format,
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isSelected ? color : widget.c.textSecondary),
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
    final isDark = widget.isDark;
    final reports = _filteredReports;

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
            Text(
              "Reports & Analytics",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "14 Strategic Dossiers • 4-Category Export Module",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Export Filtered Dataset",
            icon: const Icon(Icons.file_download_rounded, color: Color(0xFF6256D9), size: 22),
            onPressed: _openExportDatasetModal,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openExportDatasetModal,
        backgroundColor: const Color(0xFF6256D9),
        icon: const Icon(Icons.file_download_rounded, color: Colors.white, size: 18),
        label: const Text("Export Dataset", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            color: c.cardBg,
            child: Column(
              children: [
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: "Search analytical reports, titles, or metrics...",
                    hintStyle: TextStyle(fontSize: 11.5, color: c.textMuted),
                    prefixIcon: Icon(Icons.search_rounded, size: 18, color: c.textMuted),
                    filled: true,
                    fillColor: c.scaffoldBg,
                    contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: c.cardBorder),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: c.cardBorder),
                    ),
                  ),
                  style: TextStyle(fontSize: 12, color: c.textPrimary),
                ),
                const SizedBox(height: 8),

                // Category Filter Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _categoryChip("All (14)", null),
                      const SizedBox(width: 6),
                      _categoryChip("Electorate", ReportCategory.electorate),
                      const SizedBox(width: 6),
                      _categoryChip("Workforce", ReportCategory.workforce),
                      const SizedBox(width: 6),
                      _categoryChip("Sentiment & Booths", ReportCategory.sentimentAndBooths),
                      const SizedBox(width: 6),
                      _categoryChip("Governance", ReportCategory.campaignsAndGovernance),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Report List
          Expanded(
            child: reports.isEmpty
                ? Center(
                    child: Text(
                      "No reports match the selected query.",
                      style: TextStyle(color: c.textSecondary, fontSize: 12),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(14, 12, 14, 80),
                    itemCount: reports.length,
                    itemBuilder: (context, index) {
                      final report = reports[index];
                      return _buildReportCard(report);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _categoryChip(String label, ReportCategory? category) {
    final isSelected = _selectedCategory == category;
    final c = widget.c;

    return InkWell(
      onTap: () => setState(() => _selectedCategory = category),
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

  Widget _buildReportCard(ReportModel report) {
    final c = widget.c;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(widget.isDark ? 0.3 : 0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ReportDetailScreen(
                report: report,
                c: c,
                isDark: widget.isDark,
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 19,
                    backgroundColor: report.accentColor.withOpacity(0.12),
                    child: Icon(report.icon, color: report.accentColor, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                              decoration: BoxDecoration(
                                color: report.accentColor.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                "REP #${report.number.toString().padLeft(2, '0')}",
                                style: TextStyle(
                                  fontSize: 8.5,
                                  fontWeight: FontWeight.w800,
                                  color: report.accentColor,
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              report.categoryLabel,
                              style: TextStyle(fontSize: 9, color: c.textMuted, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        const SizedBox(height: 3),
                        Text(
                          report.title,
                          style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                        ),
                        Text(
                          report.titleMr,
                          style: TextStyle(fontSize: 9.5, color: c.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.arrow_forward_ios_rounded, size: 14, color: c.textMuted),
                ],
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: c.scaffoldBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.analytics_outlined, size: 14, color: report.accentColor),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        report.keySummary,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 10, color: c.textSecondary, fontWeight: FontWeight.w500),
                      ),
                    ),
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
