import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/subscription_model.dart';

class SubscriptionsScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const SubscriptionsScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<SubscriptionsScreen> createState() => _SubscriptionsScreenState();
}

class _SubscriptionsScreenState extends State<SubscriptionsScreen> {
  final List<ServiceQuota> _quotas = [
    const ServiceQuota(
      label: "Official WhatsApp Broadcasts",
      used: 42580,
      total: 50000,
      unit: "messages",
      icon: Icons.chat_rounded,
      color: Colors.green,
    ),
    const ServiceQuota(
      label: "Carrier Bulk SMS Messages",
      used: 80000,
      total: 200000,
      unit: "SMS",
      icon: Icons.sms_rounded,
      color: Colors.blue,
    ),
    const ServiceQuota(
      label: "Candidate AI Voice Minutes (IVR)",
      used: 3600,
      total: 16000,
      unit: "mins",
      icon: Icons.phone_forwarded_rounded,
      color: Colors.purple,
    ),
    const ServiceQuota(
      label: "Active Field Karyakarta Seats",
      used: 342,
      total: 500,
      unit: "devices",
      icon: Icons.badge_rounded,
      color: Colors.amber,
    ),
    const ServiceQuota(
      label: "AI Strategy Copilot Seats",
      used: 5,
      total: 5,
      unit: "leads",
      icon: Icons.auto_awesome_rounded,
      color: Colors.indigo,
    ),
  ];

  final List<AddonPack> _addonPacks = [
    const AddonPack(
      id: "pack_wa_50k",
      name: "WhatsApp 50,000 Messages Pack",
      description: "Direct carrier route with verified sender ID and media attachment support",
      price: "₹ 18,500",
      unitsAdded: "+50,000 WhatsApp",
      icon: Icons.chat_rounded,
    ),
    const AddonPack(
      id: "pack_sms_100k",
      name: "Bulk SMS 1,00,000 Credits",
      description: "DLT approved priority transactional & promotional election template route",
      price: "₹ 12,000",
      unitsAdded: "+1,00,000 SMS",
      icon: Icons.sms_rounded,
    ),
    const AddonPack(
      id: "pack_voice_10k",
      name: "AI Voice 10,000 Minutes Pack",
      description: "High concurrency outbound voice dialer with Marathi neural voice clone",
      price: "₹ 15,000",
      unitsAdded: "+10,000 Mins",
      icon: Icons.phone_in_talk_rounded,
    ),
    const AddonPack(
      id: "pack_seats_100",
      name: "100 Field Karyakarta App Seats",
      description: "Offline SQLite caching, GPS geofencing, and unlimited survey collection",
      price: "₹ 8,000",
      unitsAdded: "+100 Seats",
      icon: Icons.group_add_rounded,
    ),
  ];

  final List<BillingInvoice> _invoices = [
    const BillingInvoice(
      invoiceNumber: "INV-2024-8841",
      date: "01 Nov 2024",
      description: "War Room Elite Plan (Vidhan Sabha 2024)",
      amount: "₹ 1,50,000",
      status: "PAID",
    ),
    const BillingInvoice(
      invoiceNumber: "INV-2024-8812",
      date: "25 Oct 2024",
      description: "WhatsApp Broadcast Addon (50k Pack)",
      amount: "₹ 18,500",
      status: "PAID",
    ),
  ];

  void _purchaseAddon(AddonPack pack) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: widget.c.cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(pack.icon, color: widget.c.primary),
            const SizedBox(width: 8),
            Text("Confirm Add-on Pack", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: widget.c.textPrimary)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(pack.name, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: widget.c.textPrimary)),
            const SizedBox(height: 4),
            Text(pack.description, style: TextStyle(fontSize: 11, color: widget.c.textSecondary)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: widget.c.scaffoldBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Invoice Total (Inc. GST):", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                  Text(pack.price, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: widget.c.primary)),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Cancel", style: TextStyle(color: widget.c.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: Colors.green.shade800,
                  content: Text("Success! ${pack.unitsAdded} credited to Candidate War Room."),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: widget.c.primary),
            child: const Text("Authorize Purchase", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

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
              "Subscriptions & Quotas",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Election Edition License & Active Channel Balance",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          // Plan Hero Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F2744), Color(0xFF1E3A8A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 10, offset: const Offset(0, 4)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.amber,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        "WAR ROOM ELITE",
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.black87, letterSpacing: 0.8),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.greenAccent),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.check_circle_rounded, size: 11, color: Colors.greenAccent),
                          SizedBox(width: 4),
                          Text("ACTIVE LICENSE", style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  "Maharashtra Vidhan Sabha 2024 Assembly Edition",
                  style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 4),
                const Text(
                  "Assigned Constituency: 215 - Kasba Peth • Full AI Copilot & Live Telemetry",
                  style: TextStyle(fontSize: 10.5, color: Colors.white70),
                ),
                const SizedBox(height: 12),
                const Divider(color: Colors.white24, height: 1),
                const SizedBox(height: 10),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Validity: Till 31 Dec 2024", style: TextStyle(fontSize: 10, color: Colors.white70)),
                    Text("SLA: 99.98% High Availability", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.amberAccent)),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // Quota Consumption Matrix
          Text(
            "COMMUNICATION & CADRE QUOTAS",
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
          ),
          const SizedBox(height: 8),

          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              children: _quotas.map((q) {
                final isWarning = q.percentage > 0.8;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(q.icon, size: 15, color: q.color),
                              const SizedBox(width: 6),
                              Text(q.label, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: c.textPrimary)),
                            ],
                          ),
                          Text(
                            "${q.remaining} ${q.unit} left",
                            style: TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.bold,
                              color: isWarning ? Colors.red : q.color,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: q.percentage,
                          backgroundColor: c.borderColor,
                          color: isWarning ? Colors.red : q.color,
                          minHeight: 6,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text("${q.used} used of ${q.total}", style: TextStyle(fontSize: 9.5, color: c.textMuted)),
                          Text("${(q.percentage * 100).toInt()}% consumed", style: TextStyle(fontSize: 9.5, color: c.textMuted)),
                        ],
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 18),

          // Quota Top-Up Add-on Packs
          Text(
            "QUOTA TOP-UP ADD-ON PACKS",
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
          ),
          const SizedBox(height: 8),

          ..._addonPacks.map((pack) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: c.borderColor),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: c.primary.withOpacity(0.12),
                    child: Icon(pack.icon, size: 18, color: c.primary),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(pack.name, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                        const SizedBox(height: 2),
                        Text(pack.description, style: TextStyle(fontSize: 10, color: c.textSecondary)),
                        const SizedBox(height: 4),
                        Text(pack.price, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: c.primary)),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () => _purchaseAddon(pack),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: c.primary,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Top-Up", style: TextStyle(fontSize: 10.5, color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 18),

          // Billing History
          Text(
            "BILLING INVOICES & GST RECEIPTS",
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
          ),
          const SizedBox(height: 8),

          Container(
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.borderColor),
            ),
            child: Column(
              children: List.generate(_invoices.length, (idx) {
                final inv = _invoices[idx];
                final isLast = idx == _invoices.length - 1;

                return Column(
                  children: [
                    ListTile(
                      dense: true,
                      leading: const Icon(Icons.receipt_rounded, color: Colors.blue),
                      title: Text(inv.description, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: c.textPrimary)),
                      subtitle: Text("${inv.invoiceNumber} • ${inv.date}", style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(inv.amount, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: c.textPrimary)),
                          const SizedBox(width: 6),
                          IconButton(
                            icon: const Icon(Icons.download_rounded, size: 16),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text("Downloading invoice ${inv.invoiceNumber}.pdf...")),
                              );
                            },
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

          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
