import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/map_pin_model.dart';
import '../data/blo_mock_data.dart';
import 'map_pin_detail_sheet.dart';

class InteractiveMapCanvas extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;
  final VoidCallback? onNavigateToBoothVoters;

  const InteractiveMapCanvas({
    super.key,
    required this.c,
    required this.isDark,
    this.onNavigateToBoothVoters,
  });

  @override
  State<InteractiveMapCanvas> createState() => _InteractiveMapCanvasState();
}

class _InteractiveMapCanvasState extends State<InteractiveMapCanvas>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  bool _showWorkers = true;
  bool _showBooths = true;
  bool _showGrievances = true;
  bool _showDensity = false;

  double _zoomLevel = 1.0;
  Offset _panOffset = Offset.zero;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.85, end: 1.25).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _resetMap() {
    setState(() {
      _zoomLevel = 1.0;
      _panOffset = Offset.zero;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Map recentered on 215 - Kasba Peth Constituency Center.")),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = widget.isDark;
    final allPins = BloMockData.mapPins;

    // Filter pins by active layers
    final visiblePins = allPins.where((p) {
      if (p.type == MapPinType.worker && !_showWorkers) return false;
      if (p.type == MapPinType.booth && !_showBooths) return false;
      if (p.type == MapPinType.grievance && !_showGrievances) return false;
      if (p.type == MapPinType.voterCluster && !_showDensity) return false;
      return true;
    }).toList();

    return Column(
      children: [
        // 1. LIVE TELEMETRY TICKER BAR
        Container(
          margin: const EdgeInsets.fromLTRB(16, 6, 16, 10),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF0F223D) : const Color(0xFFEFF6FF),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: const Color(0xFF3B82F6).withOpacity(0.3)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                      color: Color(0xFF10B981),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    "42 SURVEYORS ONLINE",
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                  ),
                ],
              ),
              const Text(
                "⚡ Velocity: +3.8 / min",
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF3B82F6)),
              ),
              const Text(
                "📍 Geofence 100%",
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF8B5CF6)),
              ),
            ],
          ),
        ),

        // 2. LAYER TOGGLE CHIPS
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              _layerToggle("Workers (4)", _showWorkers, const Color(0xFF10B981), (v) => setState(() => _showWorkers = v)),
              _layerToggle("Booths (4)", _showBooths, const Color(0xFF4F46E5), (v) => setState(() => _showBooths = v)),
              _layerToggle("Issues (2)", _showGrievances, const Color(0xFFEF4444), (v) => setState(() => _showGrievances = v)),
              _layerToggle("Voter Clusters", _showDensity, const Color(0xFF6366F1), (v) => setState(() => _showDensity = v)),
            ],
          ),
        ),
        const SizedBox(height: 10),

        // 3. MAP CANVAS WITH TOPOGRAPHICAL GRID & PINS
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          height: 290,
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF081222) : const Color(0xFFE2E8F0),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: c.cardBorder),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(isDark ? 0.35 : 0.08),
                blurRadius: 14,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(18),
            child: Stack(
              children: [
                // Custom Topography Painter (Pune Kasba Street Grid & Mutha River)
                Positioned.fill(
                  child: CustomPaint(
                    painter: _ConstituencyTopographyPainter(isDark: isDark),
                  ),
                ),

                // Constituency Watermark Badge
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: (isDark ? const Color(0xFF0F172A) : Colors.white).withOpacity(0.85),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: c.cardBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "215 - KASBA PETH LOCUS",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.0,
                            color: c.textPrimary,
                          ),
                        ),
                        Text(
                          "Lat: 18.5204° N, Long: 73.8567° E",
                          style: TextStyle(fontSize: 8.5, fontFamily: 'monospace', color: c.textMuted),
                        ),
                      ],
                    ),
                  ),
                ),

                // Interactive Map Pins
                ...visiblePins.map((pin) {
                  return LayoutBuilder(
                    builder: (context, constraints) {
                      final left = (constraints.maxWidth * pin.xPct) - 20;
                      final top = (constraints.maxHeight * pin.yPct) - 20;

                      return Positioned(
                        left: left,
                        top: top,
                        child: GestureDetector(
                          onTap: () {
                            MapPinDetailSheet.show(
                              context,
                              pin,
                              c,
                              onAction: widget.onNavigateToBoothVoters,
                            );
                          },
                          child: _buildPinWidget(pin, isDark),
                        ),
                      );
                    },
                  );
                }),

                // Floating Map Controls (Zoom In, Zoom Out, Recenter)
                Positioned(
                  right: 12,
                  bottom: 12,
                  child: Column(
                    children: [
                      _floatingControl(
                        Icons.add_rounded,
                        () => setState(() => _zoomLevel = (_zoomLevel + 0.2).clamp(1.0, 2.2)),
                        c,
                      ),
                      const SizedBox(height: 6),
                      _floatingControl(
                        Icons.remove_rounded,
                        () => setState(() => _zoomLevel = (_zoomLevel - 0.2).clamp(1.0, 2.2)),
                        c,
                      ),
                      const SizedBox(height: 6),
                      _floatingControl(
                        Icons.my_location_rounded,
                        _resetMap,
                        c,
                        accent: const Color(0xFF4F46E5),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _layerToggle(String label, bool isSelected, Color color, Function(bool) onToggle) {
    final c = widget.c;
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        selectedColor: color.withOpacity(0.18),
        backgroundColor: c.cardBg,
        checkmarkColor: color,
        labelStyle: TextStyle(
          fontSize: 10.5,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
          color: isSelected ? color : c.textSecondary,
        ),
        side: BorderSide(color: isSelected ? color : c.cardBorder),
        onSelected: onToggle,
      ),
    );
  }

  Widget _floatingControl(IconData icon, VoidCallback onTap, CandidateColors c, {Color? accent}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: widget.isDark ? const Color(0xFF0F172A).withOpacity(0.9) : Colors.white.withOpacity(0.9),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: c.cardBorder),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 4),
          ],
        ),
        child: Icon(icon, size: 18, color: accent ?? c.textPrimary),
      ),
    );
  }

  Widget _buildPinWidget(MapPinModel pin, bool isDark) {
    switch (pin.type) {
      case MapPinType.worker:
        return AnimatedBuilder(
          animation: _pulseAnimation,
          builder: (context, child) {
            return Transform.scale(
              scale: _pulseAnimation.value,
              child: Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF10B981),
                  border: Border.all(color: Colors.white, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF10B981).withOpacity(0.4),
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    pin.title.split(" ").map((w) => w[0]).take(2).join(),
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
              ),
            );
          },
        );

      case MapPinType.booth:
        Color col = pin.status == "SAFE"
            ? const Color(0xFF10B981)
            : (pin.status == "BATTLEGROUND" ? const Color(0xFFF59E0B) : const Color(0xFFEF4444));

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF0F172A) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: col, width: 1.8),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 6),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.how_to_vote_rounded, size: 12, color: col),
              const SizedBox(width: 3),
              Text(
                "B#${(pin.metadata as Map)["boothNumber"]}",
                style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: col),
              ),
            ],
          ),
        );

      case MapPinType.grievance:
        return Container(
          padding: const EdgeInsets.all(5),
          decoration: BoxDecoration(
            color: const Color(0xFFEF4444),
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 1.5),
            boxShadow: [
              BoxShadow(color: Colors.red.withOpacity(0.4), blurRadius: 6),
            ],
          ),
          child: const Icon(Icons.priority_high_rounded, size: 14, color: Colors.white),
        );

      case MapPinType.voterCluster:
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1).withOpacity(0.85),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.white, width: 1.2),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.groups_rounded, size: 12, color: Colors.white),
              SizedBox(width: 4),
              Text("14.8k Voters", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white)),
            ],
          ),
        );
    }
  }
}

class _ConstituencyTopographyPainter extends CustomPainter {
  final bool isDark;

  _ConstituencyTopographyPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Mutha River Boundary (North-West Arc)
    final riverPaint = Paint()
      ..color = (isDark ? const Color(0xFF1E3A8A) : const Color(0xFF93C5FD)).withOpacity(0.35)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 14;

    final riverPath = Path()
      ..moveTo(0, size.height * 0.15)
      ..cubicTo(
        size.width * 0.25,
        size.height * 0.05,
        size.width * 0.45,
        size.height * 0.12,
        size.width * 0.85,
        0,
      );
    canvas.drawPath(riverPath, riverPaint);

    // 2. Arterial Roads (Shivaji Rd, Bajirao Rd, Laxmi Rd, Shaniwar Wada Corridor)
    final roadPaint = Paint()
      ..color = (isDark ? const Color(0xFF1E293B) : const Color(0xFFCBD5E1)).withOpacity(0.65)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    // Shivaji Road (North-South)
    canvas.drawLine(
      Offset(size.width * 0.35, 0),
      Offset(size.width * 0.38, size.height),
      roadPaint,
    );

    // Bajirao Road (North-South parallel)
    canvas.drawLine(
      Offset(size.width * 0.22, 0),
      Offset(size.width * 0.25, size.height),
      roadPaint,
    );

    // Laxmi Road (East-West Arterial)
    canvas.drawLine(
      Offset(0, size.height * 0.48),
      Offset(size.width, size.height * 0.52),
      roadPaint,
    );

    // Phadke Haud to Bhavani Peth
    canvas.drawLine(
      Offset(size.width * 0.55, size.height * 0.1),
      Offset(size.width * 0.85, size.height * 0.85),
      roadPaint,
    );

    // Landmark Text Labels
    _drawText(canvas, "MUTHA RIVER", Offset(size.width * 0.18, size.height * 0.06), isDark);
    _drawText(canvas, "SHANIWAR WADA", Offset(size.width * 0.15, size.height * 0.22), isDark);
    _drawText(canvas, "KASBA GANPATI", Offset(size.width * 0.42, size.height * 0.32), isDark);
    _drawText(canvas, "RAVIWAR PETH", Offset(size.width * 0.60, size.height * 0.45), isDark);
    _drawText(canvas, "BHAVANI PETH", Offset(size.width * 0.72, size.height * 0.75), isDark);
  }

  void _drawText(Canvas canvas, String text, Offset offset, bool isDark) {
    final textPainter = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(
          color: (isDark ? Colors.white : Colors.black).withOpacity(0.22),
          fontSize: 7.5,
          fontWeight: FontWeight.w900,
          letterSpacing: 0.8,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    textPainter.paint(canvas, offset);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
