import 'package:flutter/material.dart';

class ServiceQuota {
  final String label;
  final int used;
  final int total;
  final String unit;
  final IconData icon;
  final Color color;

  const ServiceQuota({
    required this.label,
    required this.used,
    required this.total,
    required this.unit,
    required this.icon,
    required this.color,
  });

  double get percentage => total > 0 ? (used / total).clamp(0.0, 1.0) : 0.0;
  int get remaining => total - used;
}

class AddonPack {
  final String id;
  final String name;
  final String description;
  final String price;
  final String unitsAdded;
  final IconData icon;

  const AddonPack({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.unitsAdded,
    required this.icon,
  });
}

class BillingInvoice {
  final String invoiceNumber;
  final String date;
  final String description;
  final String amount;
  final String status;

  const BillingInvoice({
    required this.invoiceNumber,
    required this.date,
    required this.description,
    required this.amount,
    required this.status,
  });
}
