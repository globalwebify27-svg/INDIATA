import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/report_model.dart';

class ReportDetailScreen extends StatelessWidget {
  final ReportModel report;
  final CandidateColors c;
  final bool isDark;

  const ReportDetailScreen({
    super.key,
    required this.report,
    required this.c,
    required this.isDark,
  });

  void _handleExport(BuildContext context, String format) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: c.cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(format == "PDF" ? Icons.picture_as_pdf_rounded : Icons.table_chart_rounded,
                color: format == "PDF" ? Colors.red : Colors.green),
            const SizedBox(width: 10),
            Text("Exporting $format Report", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Report: #${report.number.toString().padLeft(2, '0')} ${report.title}",
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: c.textPrimary),
            ),
            const SizedBox(height: 8),
            Text(
              "Digital watermark: RAJTANTRA WAR ROOM • CONFIDENTIAL • CANDIDATE ONLY",
              style: TextStyle(fontSize: 10, color: c.textMuted),
            ),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              backgroundColor: c.borderColor,
              color: report.accentColor,
            ),
            const SizedBox(height: 8),
            Text("Packaging tables and strategic insights...", style: TextStyle(fontSize: 11, color: c.textSecondary)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Cancel", style: TextStyle(color: c.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: Colors.green.shade800,
                  content: Row(
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "Export complete! Saved to device downloads (${report.id}.${format.toLowerCase()})",
                          style: const TextStyle(fontSize: 12, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: report.accentColor,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text("Download Now", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: report.accentColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    "REP #${report.number.toString().padLeft(2, '0')}",
                    style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: report.accentColor),
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    report.title,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                  ),
                ),
              ],
            ),
            Text(
              report.titleMr,
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Export PDF",
            icon: const Icon(Icons.picture_as_pdf_outlined, color: Colors.redAccent, size: 20),
            onPressed: () => _handleExport(context, "PDF"),
          ),
          IconButton(
            tooltip: "Export CSV Data",
            icon: const Icon(Icons.table_chart_outlined, color: Colors.green, size: 20),
            onPressed: () => _handleExport(context, "CSV"),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        children: [
          // Header Card with Category, Icon and Description
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: report.accentColor.withOpacity(0.12),
                  child: Icon(report.icon, color: report.accentColor, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          color: c.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          report.categoryLabel.toUpperCase(),
                          style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: c.primary),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        report.description,
                        style: TextStyle(fontSize: 11.5, color: c.textSecondary, height: 1.4),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Key Summary Banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  report.accentColor.withOpacity(0.12),
                  report.accentColor.withOpacity(0.04),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: report.accentColor.withOpacity(0.4)),
            ),
            child: Row(
              children: [
                Icon(Icons.insights_rounded, color: report.accentColor, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "WAR ROOM EXECUTIVE SUMMARY",
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: report.accentColor, letterSpacing: 0.8),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        report.keySummary,
                        style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: c.textPrimary, height: 1.3),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // Tabular Metrics Breakdown
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "ANALYTICAL BREAKDOWN (${report.tableData.length} ROWS)",
                style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
              ),
              Text(
                "Verified Ground Telemetry",
                style: TextStyle(fontSize: 10, color: c.primary, fontWeight: FontWeight.w600),
              ),
            ],
          ),

          const SizedBox(height: 8),

          Container(
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              children: List.generate(report.tableData.length, (index) {
                final row = report.tableData[index];
                final isLast = index == report.tableData.length - 1;

                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      child: Row(
                        children: [
                          Container(
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: row.color ?? report.accentColor,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              row.label,
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: c.textPrimary),
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                row.value,
                                style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                              ),
                              if (row.percentage.isNotEmpty)
                                Text(
                                  row.percentage,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: row.color ?? c.textSecondary,
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    if (!isLast) Divider(height: 1, color: c.borderColor),
                  ],
                );
              }),
            ),
          ),

          const SizedBox(height: 14),

          // Strategic Advisory Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.amber.shade700.withOpacity(0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.psychology_alt_rounded, color: Colors.amber, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      "CAMPAIGN STRATEGY & TACTICAL DIRECTIVE",
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.amber.shade800, letterSpacing: 0.6),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  report.strategicInsight,
                  style: TextStyle(fontSize: 11.5, color: c.textPrimary, height: 1.45, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Bottom Quick Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _handleExport(context, "CSV"),
                  icon: const Icon(Icons.table_view_rounded, size: 16),
                  label: const Text("Export CSV"),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: c.textPrimary,
                    side: BorderSide(color: c.borderColor),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _handleExport(context, "PDF"),
                  icon: const Icon(Icons.picture_as_pdf_rounded, size: 16, color: Colors.white),
                  label: const Text("Export PDF Dossier", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: c.primary,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
