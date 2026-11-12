enum MapPinType {
  worker,
  booth,
  grievance,
  voterCluster,
}

class MapPinModel {
  final String id;
  final String title;
  final String subtitle;
  final MapPinType type;
  final double xPct; // Relative X coordinate on canvas (0.0 to 1.0)
  final double yPct; // Relative Y coordinate on canvas (0.0 to 1.0)
  final double latitude;
  final double longitude;
  final String status;
  final dynamic metadata;

  const MapPinModel({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.type,
    required this.xPct,
    required this.yPct,
    required this.latitude,
    required this.longitude,
    required this.status,
    this.metadata,
  });
}
