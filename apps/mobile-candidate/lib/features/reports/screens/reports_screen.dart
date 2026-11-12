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

  void _exportAllReports(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: widget.c.primary,
        content: const Row(
          children: [
            Icon(Icons.downloading_rounded, color: Colors.white, size: 18),
            SizedBox(width: 8),
            Expanded(
              child: Text(
                "Exporting Complete 14-Report Executive Dossier (PDF/ZIP)...",
                style: TextStyle(fontSize: 12, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
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
              "14 Mobile Analytical Dossiers",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Export All Dossiers",
            icon: Icon(Icons.file_download_outlined, color: c.primary, size: 22),
            onPressed: () => _exportAllReports(context),
          ),
        ],
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
                    hintText: "Search report name, Marathi, or metrics...",
                    hintStyle: TextStyle(fontSize: 11.5, color: c.textMuted),
                    prefixIcon: Icon(Icons.search_rounded, size: 18, color: c.textMuted),
                    filled: true,
                    fillColor: c.scaffoldBg,
                    contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: c.borderColor),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: c.borderColor),
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
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
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

  Widget _buildReportCard(ReportModel report) {
    final c = widget.c;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.borderColor),
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
