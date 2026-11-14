import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';

class LiveFieldMapPreviewCard extends StatelessWidget {
  final CandidateColors c;
  final bool isDark;
  final VoidCallback onTap;

  const LiveFieldMapPreviewCard({
    super.key,
    required this.c,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: c.borderColor.withOpacity(isDark ? 0.5 : 0.8),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.35 : 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row
              Padding(
                padding: const EdgeInsets.fromLTRB(14, 12, 14, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: c.primary.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(Icons.map_rounded, size: 16, color: c.primary),
                        ),
                        const SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "LIVE FIELD MAP & TELEMETRY",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 0.8,
                                color: c.textPrimary,
                              ),
                            ),
                            Text(
                              "Real-time GPS worker telemetry & booth locus",
                              style: TextStyle(fontSize: 10, color: c.textSecondary),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: const Color(0xFF10B981).withOpacity(0.5),
                          width: 0.8,
                        ),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.circle, size: 6, color: Color(0xFF10B981)),
                          SizedBox(width: 4),
                          Text(
                            "42 ONLINE",
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF10B981),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Compact Map Canvas Preview
              Container(
                height: 140,
                margin: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF0D0D11) : const Color(0xFFE9E5F8),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: c.borderColor.withOpacity(isDark ? 0.3 : 0.6),
                  ),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Stack(
                    children: [
                      // Grid lines / Street Simulation
                      Positioned.fill(
                        child: CustomPaint(
                          painter: _MiniMapPainter(isDark: isDark),
                        ),
                      ),

                      // Location Pins
                      _mapMarker(left: 45, top: 25, label: "Booth #101", color: const Color(0xFF6256D9)),
                      _mapMarker(left: 140, top: 40, label: "Mahesh (GPS)", color: const Color(0xFF10B981), isPulsing: true),
                      _mapMarker(left: 230, top: 30, label: "Booth #104", color: const Color(0xFF6256D9)),
                      _mapMarker(left: 100, top: 85, label: "Issue: Water", color: const Color(0xFFEF4444)),
                      _mapMarker(left: 200, top: 80, label: "Suresh (GPS)", color: const Color(0xFF10B981), isPulsing: true),

                      // Locus Overlay Pill
                      Positioned(
                        bottom: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: (isDark ? Colors.black : Colors.white).withOpacity(0.85),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: c.cardBorder),
                          ),
                          child: Text(
                            "215 Kasba Peth • 18.5204° N, 73.8567° E",
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              fontFamily: 'monospace',
                              color: c.textPrimary,
                            ),
                          ),
                        ),
                      ),

                      // Tap hint overlay button
                      Positioned(
                        bottom: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: c.primary,
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: c.primary.withOpacity(0.35),
                                blurRadius: 4,
                              ),
                            ],
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                "Open Full Map",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(width: 3),
                              Icon(Icons.arrow_forward_rounded, size: 11, color: Colors.white),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Footer Bar
              Padding(
                padding: const EdgeInsets.fromLTRB(14, 8, 14, 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        _legendDot(const Color(0xFF10B981), "Karyakartas"),
                        const SizedBox(width: 10),
                        _legendDot(const Color(0xFF6256D9), "Booths"),
                        const SizedBox(width: 10),
                        _legendDot(const Color(0xFFEF4444), "Grievances"),
                      ],
                    ),
                    Text(
                      "Tap to launch map →",
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: c.primary,
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

  Widget _legendDot(Color color, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 7,
          height: 7,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
      ],
    );
  }

  Widget _mapMarker({
    required double left,
    required double top,
    required String label,
    required Color color,
    bool isPulsing = false,
  }) {
    return Positioned(
      left: left,
      top: top,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.5),
                  blurRadius: isPulsing ? 6 : 2,
                  spreadRadius: isPulsing ? 1.5 : 0,
                ),
              ],
            ),
            child: const Icon(Icons.circle, size: 4, color: Colors.white),
          ),
          const SizedBox(height: 2),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.75),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 8,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniMapPainter extends CustomPainter {
  final bool isDark;
  _MiniMapPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final roadPaint = Paint()
      ..color = (isDark ? const Color(0xFF22222A) : const Color(0xFFD4CEF0))
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    final primaryRoadPaint = Paint()
      ..color = (isDark ? const Color(0xFF2D2D38) : const Color(0xFFC3BCED))
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke;

    // Diagonal arterial roads
    canvas.drawLine(Offset(0, size.height * 0.3), Offset(size.width, size.height * 0.7), primaryRoadPaint);
    canvas.drawLine(Offset(size.width * 0.25, 0), Offset(size.width * 0.75, size.height), primaryRoadPaint);

    // Cross lanes
    canvas.drawLine(Offset(0, size.height * 0.65), Offset(size.width * 0.8, 0), roadPaint);
    canvas.drawLine(Offset(size.width * 0.1, size.height), Offset(size.width, size.height * 0.2), roadPaint);
    canvas.drawLine(Offset(size.width * 0.5, 0), Offset(size.width * 0.5, size.height), roadPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
