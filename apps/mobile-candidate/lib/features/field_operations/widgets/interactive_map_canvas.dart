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

  // Layer Toggles
  bool _showSlipsDelivered = true;
  bool _showWhatsAppSlips = true;
  bool _showGrievances = true;
  bool _showWorkers = true;
  bool _showBooths = true;
  bool _showDensity = false;

  bool _isLayerPanelExpanded = false;

  double _zoomLevel = 1.0;
  Offset _panOffset = Offset.zero;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.88, end: 1.22).animate(
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

  int get _activeLayerCount {
    int count = 0;
    if (_showSlipsDelivered) count++;
    if (_showWhatsAppSlips) count++;
    if (_showGrievances) count++;
    if (_showWorkers) count++;
    if (_showBooths) count++;
    if (_showDensity) count++;
    return count;
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = widget.isDark;
    final allPins = BloMockData.mapPins;

    // Filter pins by active layers
    final visiblePins = allPins.where((p) {
      if (p.type == MapPinType.slipDelivered && !_showSlipsDelivered) return false;
      if (p.type == MapPinType.whatsAppSlip && !_showWhatsAppSlips) return false;
      if (p.type == MapPinType.grievance && !_showGrievances) return false;
      if (p.type == MapPinType.worker && !_showWorkers) return false;
      if (p.type == MapPinType.booth && !_showBooths) return false;
      if (p.type == MapPinType.voterCluster && !_showDensity) return false;
      return true;
    }).toList();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      height: 440,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF081222) : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: c.cardBorder, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.45 : 0.09),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            // 1. Topography Painter with Pune Kasba Street Grid, Mutha River, & Lat/Long Coordinates
            Positioned.fill(
              child: CustomPaint(
                painter: _ConstituencyTopographyPainter(isDark: isDark),
              ),
            ),

            // 2. Constituency Locus Watermark Badge (Top-Left)
            Positioned(
              top: 14,
              left: 14,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: (isDark ? const Color(0xFF0F172A) : Colors.white).withOpacity(0.92),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: c.cardBorder),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.12), blurRadius: 6),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            color: Color(0xFF10B981),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 5),
                        Text(
                          "215 - KASBA PETH LOCUS",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.8,
                            color: c.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Lat: 18.5204° N • Long: 73.8567° E",
                      style: TextStyle(
                        fontSize: 8.5,
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.w600,
                        color: c.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // 3. Floating Layer Toggle Button (Top-Right)
            Positioned(
              top: 14,
              right: 14,
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _isLayerPanelExpanded = !_isLayerPanelExpanded;
                    });
                  },
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                    decoration: BoxDecoration(
                      color: _isLayerPanelExpanded
                          ? const Color(0xFF6256D9)
                          : (isDark ? const Color(0xFF0F172A) : Colors.white).withOpacity(0.92),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: _isLayerPanelExpanded ? const Color(0xFF6256D9) : c.cardBorder,
                      ),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 6),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.layers_rounded,
                          size: 15,
                          color: _isLayerPanelExpanded ? Colors.white : const Color(0xFF6256D9),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          "Layers ($_activeLayerCount)",
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: _isLayerPanelExpanded ? Colors.white : c.textPrimary,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(
                          _isLayerPanelExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                          size: 16,
                          color: _isLayerPanelExpanded ? Colors.white : c.textMuted,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // 4. Interactive Map Pins
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

            // 5. Bottom Telemetry Status Pill (Bottom-Left)
            Positioned(
              left: 14,
              bottom: 14,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: (isDark ? const Color(0xFF0F172A) : Colors.white).withOpacity(0.92),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: c.cardBorder),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 6),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
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
                    Text(
                      "42 Surveyors Active",
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      "•",
                      style: TextStyle(color: c.textMuted),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      "100% Geofence",
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF8B5CF6)),
                    ),
                  ],
                ),
              ),
            ),

            // 6. Floating Zoom & Recenter Controls (Bottom-Right)
            Positioned(
              right: 14,
              bottom: 14,
              child: Column(
                mainAxisSize: MainAxisSize.min,
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
                    accent: const Color(0xFF6256D9),
                  ),
                ],
              ),
            ),

            // 7. Floating Layer Control Panel (Collapsible Overlay)
            if (_isLayerPanelExpanded)
              Positioned(
                top: 52,
                right: 14,
                width: 250,
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0F172A).withOpacity(0.97) : Colors.white.withOpacity(0.97),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: c.cardBorder, width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.28),
                        blurRadius: 16,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "FIELD MAP LAYERS",
                            style: TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.8,
                              color: c.textMuted,
                            ),
                          ),
                          InkWell(
                            onTap: () => setState(() => _isLayerPanelExpanded = false),
                            child: Icon(Icons.close_rounded, size: 16, color: c.textMuted),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const Divider(height: 1),
                      const SizedBox(height: 4),

                      // Layer 1: Slips Delivered
                      _layerSwitchRow(
                        icon: Icons.print_rounded,
                        color: const Color(0xFF2563EB),
                        label: "Slips Printed / Delivered",
                        value: _showSlipsDelivered,
                        onChanged: (v) => setState(() => _showSlipsDelivered = v),
                      ),

                      // Layer 2: WhatsApp Slips
                      _layerSwitchRow(
                        icon: Icons.chat_bubble_rounded,
                        color: const Color(0xFF10B981),
                        label: "WhatsApp Slips Sent",
                        value: _showWhatsAppSlips,
                        onChanged: (v) => setState(() => _showWhatsAppSlips = v),
                      ),

                      // Layer 3: Grievance / Issues
                      _layerSwitchRow(
                        icon: Icons.priority_high_rounded,
                        color: const Color(0xFFEF4444),
                        label: "Voter-Reported Issues",
                        value: _showGrievances,
                        onChanged: (v) => setState(() => _showGrievances = v),
                      ),

                      // Layer 4: Karyakarta Live GPS
                      _layerSwitchRow(
                        icon: Icons.navigation_rounded,
                        color: const Color(0xFF059669),
                        label: "Active Karyakartas GPS",
                        value: _showWorkers,
                        onChanged: (v) => setState(() => _showWorkers = v),
                      ),

                      // Layer 5: Polling Booths
                      _layerSwitchRow(
                        icon: Icons.how_to_vote_rounded,
                        color: const Color(0xFF6256D9),
                        label: "Polling Booth Stations",
                        value: _showBooths,
                        onChanged: (v) => setState(() => _showBooths = v),
                      ),

                      // Layer 6: Density Clusters
                      _layerSwitchRow(
                        icon: Icons.groups_rounded,
                        color: const Color(0xFF8B5CF6),
                        label: "Voter Density Clusters",
                        value: _showDensity,
                        onChanged: (v) => setState(() => _showDensity = v),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _layerSwitchRow({
    required IconData icon,
    required Color color,
    required String label,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    final c = widget.c;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(icon, size: 13, color: color),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 10.5,
                fontWeight: value ? FontWeight.bold : FontWeight.w500,
                color: value ? c.textPrimary : c.textSecondary,
              ),
            ),
          ),
          Switch(
            value: value,
            activeColor: color,
            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            onChanged: onChanged,
          ),
        ],
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
          color: widget.isDark ? const Color(0xFF0F172A).withOpacity(0.92) : Colors.white.withOpacity(0.92),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: c.cardBorder),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.14), blurRadius: 4),
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
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF059669),
                  border: Border.all(color: Colors.white, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF059669).withOpacity(0.45),
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    pin.title.split(" ").map((w) => w[0]).take(2).join(),
                    style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
              ),
            );
          },
        );

      case MapPinType.slipDelivered:
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3.5),
          decoration: BoxDecoration(
            color: const Color(0xFF2563EB),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white, width: 1.8),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF2563EB).withOpacity(0.4),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.print_rounded, size: 11, color: Colors.white),
              SizedBox(width: 3),
              Text(
                "Slip ✓",
                style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: Colors.white),
              ),
            ],
          ),
        );

      case MapPinType.whatsAppSlip:
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3.5),
          decoration: BoxDecoration(
            color: const Color(0xFF10B981),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white, width: 1.8),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF10B981).withOpacity(0.4),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.chat_bubble_rounded, size: 10, color: Colors.white),
              SizedBox(width: 3),
              Text(
                "WA Slip",
                style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: Colors.white),
              ),
            ],
          ),
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
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: const Color(0xFFEF4444),
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2),
            boxShadow: [
              BoxShadow(color: Colors.red.withOpacity(0.5), blurRadius: 8, spreadRadius: 1),
            ],
          ),
          child: const Icon(Icons.priority_high_rounded, size: 13, color: Colors.white),
        );

      case MapPinType.voterCluster:
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
          decoration: BoxDecoration(
            color: const Color(0xFF6256D9).withOpacity(0.9),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.white, width: 1.4),
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
    // 1. Latitude & Longitude Coordinate Grid Lines
    final gridPaint = Paint()
      ..color = (isDark ? Colors.white : Colors.black).withOpacity(0.06)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;

    // Horizontal Latitude Lines
    canvas.drawLine(Offset(0, size.height * 0.25), Offset(size.width, size.height * 0.25), gridPaint);
    canvas.drawLine(Offset(0, size.height * 0.50), Offset(size.width, size.height * 0.50), gridPaint);
    canvas.drawLine(Offset(0, size.height * 0.75), Offset(size.width, size.height * 0.75), gridPaint);

    // Vertical Longitude Lines
    canvas.drawLine(Offset(size.width * 0.25, 0), Offset(size.width * 0.25, size.height), gridPaint);
    canvas.drawLine(Offset(size.width * 0.50, 0), Offset(size.width * 0.50, size.height), gridPaint);
    canvas.drawLine(Offset(size.width * 0.75, 0), Offset(size.width * 0.75, size.height), gridPaint);

    // Coordinate Reference Watermark Labels
    _drawCoordinateText(canvas, "18.522° N", Offset(size.width - 48, size.height * 0.25 - 10), isDark);
    _drawCoordinateText(canvas, "18.520° N", Offset(size.width - 48, size.height * 0.50 - 10), isDark);
    _drawCoordinateText(canvas, "18.518° N", Offset(size.width - 48, size.height * 0.75 - 10), isDark);
    _drawCoordinateText(canvas, "73.854° E", Offset(size.width * 0.25 + 4, size.height - 14), isDark);
    _drawCoordinateText(canvas, "73.858° E", Offset(size.width * 0.50 + 4, size.height - 14), isDark);
    _drawCoordinateText(canvas, "73.862° E", Offset(size.width * 0.75 + 4, size.height - 14), isDark);

    // 2. Mutha River Boundary (North-West Arc)
    final riverPaint = Paint()
      ..color = (isDark ? const Color(0xFF1E3A8A) : const Color(0xFF93C5FD)).withOpacity(0.35)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 16;

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

    // 3. Arterial Roads (Shivaji Rd, Bajirao Rd, Laxmi Rd, Shaniwar Wada Corridor)
    final roadPaint = Paint()
      ..color = (isDark ? const Color(0xFF1E293B) : const Color(0xFFCBD5E1)).withOpacity(0.70)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.5;

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
    _drawText(canvas, "SHANIWAR WADA", Offset(size.width * 0.12, size.height * 0.20), isDark);
    _drawText(canvas, "KASBA GANPATI", Offset(size.width * 0.40, size.height * 0.31), isDark);
    _drawText(canvas, "RAVIWAR PETH", Offset(size.width * 0.60, size.height * 0.43), isDark);
    _drawText(canvas, "BHAVANI PETH", Offset(size.width * 0.70, size.height * 0.72), isDark);
  }

  void _drawCoordinateText(Canvas canvas, String text, Offset offset, bool isDark) {
    final textPainter = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(
          color: (isDark ? Colors.white : Colors.black).withOpacity(0.20),
          fontSize: 7.0,
          fontFamily: 'monospace',
          fontWeight: FontWeight.w600,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    textPainter.paint(canvas, offset);
  }

  void _drawText(Canvas canvas, String text, Offset offset, bool isDark) {
    final textPainter = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(
          color: (isDark ? Colors.white : Colors.black).withOpacity(0.25),
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
