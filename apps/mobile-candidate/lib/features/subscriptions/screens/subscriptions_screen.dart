import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
  // 4 Core Subscription Tiers
  final List<SubscriptionTier> _subscriptionTiers = [
    const SubscriptionTier(
      id: "tier_election",
      name: "Election Mode",
      tag: "CAMPAIGN SPRINT",
      description: "Optimized for pre-poll campaign velocity, voter slip delivery & booth turnout.",
      features: [
        "Voter Slip Distribution (Thermal & Digital)",
        "Real-Time Voter Stance (Supporter / Neutral / Opposition)",
        "Constituency & Booth-level War Room Dashboard",
        "Multi-Channel Bulk WhatsApp & SMS Broadcasts",
        "Live Polling Day GOTV Turnout Telemetry",
      ],
      isCurrent: false,
      isPopular: false,
      accentColor: Color(0xFF2563EB),
      icon: Icons.how_to_vote_rounded,
    ),
    const SubscriptionTier(
      id: "tier_office",
      name: "Office Mode",
      tag: "CONSTITUENCY PERMANENT DESK",
      description: "Designed for MLA / MP permanent offices, year-round citizen governance & ticketing.",
      features: [
        "360° Citizen Grievance Ticketing & Department Routing",
        "Official Recommendation Letters & Public Work Ledger",
        "Permanent Cadre Directory & Ward Volunteer Roster",
        "Public Meetings & Event Calendar Management",
        "Beneficiary & Welfare Scheme Registry Tracking",
      ],
      isCurrent: false,
      isPopular: false,
      accentColor: Color(0xFF0D9488),
      icon: Icons.apartment_rounded,
    ),
    const SubscriptionTier(
      id: "tier_election_ai",
      name: "Election Mode + AI",
      tag: "WAR ROOM ELITE • ACTIVE",
      description: "Full election command suite powered by Indiata AI voice cloned calls & swing modeling.",
      features: [
        "All Election Mode features included",
        "Outbound AI Marathi / Hindi Voice Cloned IVR Calls",
        "Dynamic Swing Voter Prediction & Sentiment Analytics",
        "AI Speech & Press Release Drafter for Local Issues",
        "Demographic & Caste Clustering Intelligence",
      ],
      isCurrent: true,
      isPopular: true,
      accentColor: Color(0xFF6256D9),
      icon: Icons.auto_awesome_rounded,
    ),
    const SubscriptionTier(
      id: "tier_office_ai",
      name: "Office Mode + AI",
      tag: "AUTONOMOUS OFFICE",
      description: "Autonomous political office with 24/7 AI citizen engagement & intelligent drafting.",
      features: [
        "All Office Mode permanent features included",
        "24/7 Citizen WhatsApp AI Assistant & Auto-responder",
        "Automated Marathi Petition & Grievance Drafter",
        "Predictive Locality Grievance Radar & Municipal Heatmaps",
        "Voice-to-Text Office Dictation & VIP Protocol Alerts",
      ],
      isCurrent: false,
      isPopular: false,
      accentColor: Color(0xFFEA580C),
      icon: Icons.smart_toy_rounded,
    ),
  ];

  // Extra Hardware & Merchandise Items
  final List<ExtraServiceItem> _extraServices = [
    const ExtraServiceItem(
      id: "svc_evm",
      title: "EVM Demo Units",
      subtitle: "Interactive voter training mock EVM with VVPAT simulation lamp",
      priceRange: "₹ 4,500 / unit",
      storeUrl: "https://store.indiata.in/hardware/evm-demo",
      icon: Icons.touch_app_rounded,
      color: Color(0xFF2563EB),
    ),
    const ExtraServiceItem(
      id: "svc_pocket_device",
      title: "Pocket Voter Search",
      subtitle: "Battery-powered handheld offline voter roll lookup hardware",
      priceRange: "₹ 6,200 / unit",
      storeUrl: "https://store.indiata.in/hardware/pocket-search",
      icon: Icons.phone_android_rounded,
      color: Color(0xFF7C3AED),
    ),
    const ExtraServiceItem(
      id: "svc_printer",
      title: "Bluetooth Thermal Printers",
      subtitle: "Wireless 58mm rugged portable printers for doorstep voter slips",
      priceRange: "₹ 2,800 / unit",
      storeUrl: "https://store.indiata.in/hardware/thermal-printers",
      icon: Icons.print_rounded,
      color: Color(0xFF059669),
    ),
    const ExtraServiceItem(
      id: "svc_rolls",
      title: "Thermal Paper Rolls",
      subtitle: "Pack of 50 BPA-free weatherproof 58mm rolls (5-yr legibility)",
      priceRange: "₹ 1,150 / pack",
      storeUrl: "https://store.indiata.in/hardware/paper-rolls",
      icon: Icons.receipt_long_rounded,
      color: Color(0xFFD97706),
    ),
    const ExtraServiceItem(
      id: "svc_merch",
      title: "Campaign Merchandise",
      subtitle: "Candidate custom branded caps, scarves, flags & volunteer jackets",
      priceRange: "Bulk Quotation",
      storeUrl: "https://store.indiata.in/merchandise",
      icon: Icons.checkroom_rounded,
      color: Color(0xFFE11D48),
    ),
  ];

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

  // Sales Liaison Dialog (Replaces Automated Instant Checkout)
  void _openSalesInquiryDialog(String subject) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: widget.c.cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF6256D9).withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.support_agent_rounded, color: Color(0xFF6256D9), size: 22),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Enterprise Sales Desk",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                  ),
                  Text(
                    "Dedicated Political Account Manager",
                    style: TextStyle(fontSize: 10, color: widget.c.textSecondary),
                  ),
                ],
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: widget.isDark ? const Color(0xFF141417) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: widget.c.cardBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "INQUIRY SUBJECT:",
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: widget.c.textMuted, letterSpacing: 0.6),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subject,
                    style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                  ),
                  const SizedBox(height: 10),
                  const Divider(height: 1),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 16,
                        backgroundColor: Color(0xFF6256D9),
                        child: Text("SP", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Sachin Pawar",
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                            ),
                            Text(
                              "Regional Account Manager (Western Maharashtra)",
                              style: TextStyle(fontSize: 9.5, color: widget.c.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Icon(Icons.phone_rounded, size: 13, color: Color(0xFF10B981)),
                      const SizedBox(width: 6),
                      Text("+91 98220 11234", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: widget.c.textPrimary)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.email_rounded, size: 13, color: Color(0xFF3B82F6)),
                      const SizedBox(width: 6),
                      Text("sales@indiata.in", style: TextStyle(fontSize: 11, color: widget.c.textSecondary)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Text(
              "Note: Enterprise subscription modifications, quota top-ups, and device procurement require customized political SLA agreements and GST invoicing.",
              style: TextStyle(fontSize: 10, color: widget.c.textMuted, height: 1.3),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Cancel", style: TextStyle(color: widget.c.textSecondary)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              Clipboard.setData(const ClipboardData(text: "+919822011234"));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: Color(0xFF10B981),
                  content: Text("Calling Sales Team (+91 98220 11234)... Number copied to phone dialer."),
                ),
              );
            },
            icon: const Icon(Icons.call_rounded, size: 16),
            label: const Text("Call Sales Team"),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6256D9),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }

  // Hardware Store Modal
  void _openHardwareStoreModal(ExtraServiceItem item) {
    showModalBottomSheet(
      context: context,
      backgroundColor: widget.c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: item.color.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(item.icon, color: item.color, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.title,
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: widget.c.textPrimary),
                      ),
                      Text(
                        item.priceRange,
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: item.color),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              item.subtitle,
              style: TextStyle(fontSize: 12, color: widget.c.textSecondary, height: 1.4),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: widget.isDark ? const Color(0xFF141417) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: widget.c.cardBorder),
              ),
              child: Row(
                children: [
                  const Icon(Icons.verified_rounded, size: 16, color: Color(0xFF10B981)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Pre-calibrated for RAJTANTRA Candidate Mobile App & thermal sync.",
                      style: TextStyle(fontSize: 10.5, color: widget.c.textPrimary),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: widget.c.textSecondary,
                      side: BorderSide(color: widget.c.cardBorder),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text("Dismiss"),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      Clipboard.setData(ClipboardData(text: item.storeUrl));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: const Color(0xFF6256D9),
                          content: Text("Opening Indiata Store (${item.storeUrl}). Link copied to clipboard."),
                        ),
                      );
                    },
                    icon: const Icon(Icons.open_in_new_rounded, size: 16),
                    label: const Text("Order via Store"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6256D9),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final isDark = widget.isDark;

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
              "Subscriptions & Procurement",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Licensing Tiers, Quotas & Field Hardware Store",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildExtraServicesBottomBar(c, isDark),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 24),
        children: [
          // Section 1: 4 Core Subscription Tiers Matrix
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "SUBSCRIPTION TIERS MATRIX",
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
              ),
              InkWell(
                onTap: () => _openSalesInquiryDialog("Plan Upgrade Consultation"),
                child: Text(
                  "Compare All ↗",
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.primary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Horizontal scroll of 4 Core Tiers
          SizedBox(
            height: 280,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _subscriptionTiers.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final tier = _subscriptionTiers[index];
                return _buildTierCard(tier, c, isDark);
              },
            ),
          ),

          const SizedBox(height: 20),

          // Section 2: Communication & Cadre Quotas
          Text(
            "ACTIVE USAGE & SYSTEM QUOTAS",
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
          ),
          const SizedBox(height: 8),

          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.cardBorder),
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
                          backgroundColor: isDark ? const Color(0xFF27272A) : const Color(0xFFE2E8F0),
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

          const SizedBox(height: 20),

          // Section 3: Quota Top-Up Add-on Packs
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "QUOTA TOP-UP ADD-ON PACKS",
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
              ),
              Text(
                "Direct Provisioning",
                style: TextStyle(fontSize: 9.5, color: c.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 8),

          ..._addonPacks.map((pack) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: c.cardBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: c.cardBorder),
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
                    onPressed: () => _openSalesInquiryDialog("Add-on Quota: ${pack.name} (${pack.price})"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: c.primary,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Inquire", style: TextStyle(fontSize: 10.5, color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 20),

          // Section 4: Billing History
          Text(
            "BILLING INVOICES & GST RECEIPTS",
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
          ),
          const SizedBox(height: 8),

          Container(
            decoration: BoxDecoration(
              color: c.cardBg,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: c.cardBorder),
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
                                SnackBar(content: Text("Downloading official receipt ${inv.invoiceNumber}.pdf...")),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                    if (!isLast) Divider(height: 1, color: c.cardBorder),
                  ],
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  // Tier Card Widget
  Widget _buildTierCard(SubscriptionTier tier, CandidateColors c, bool isDark) {
    return Container(
      width: 250,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: tier.isCurrent ? tier.accentColor : c.cardBorder,
          width: tier.isCurrent ? 2.0 : 1.0,
        ),
        boxShadow: [
          if (tier.isCurrent)
            BoxShadow(
              color: tier.accentColor.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: tier.accentColor.withOpacity(0.14),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  tier.tag,
                  style: TextStyle(
                    fontSize: 8.5,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.6,
                    color: tier.accentColor,
                  ),
                ),
              ),
              Icon(tier.icon, size: 18, color: tier.accentColor),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            tier.name,
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
          ),
          const SizedBox(height: 4),
          Text(
            tier.description,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: 10, color: c.textSecondary, height: 1.25),
          ),
          const SizedBox(height: 10),
          const Divider(height: 1),
          const SizedBox(height: 8),
          Expanded(
            child: ListView(
              physics: const NeverScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              children: tier.features.map((f) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.check_rounded, size: 12, color: tier.accentColor),
                      const SizedBox(width: 5),
                      Expanded(
                        child: Text(
                          f,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 9.5, color: c.textPrimary),
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            height: 36,
            child: tier.isCurrent
                ? OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: tier.accentColor),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text(
                      "Current Active Plan",
                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: tier.accentColor),
                    ),
                  )
                : ElevatedButton(
                    onPressed: () => _openSalesInquiryDialog("Upgrade Plan to ${tier.name}"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: tier.accentColor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text(
                      "Inquire with Sales",
                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold),
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  // Fixed Bottom Horizontal Extra Services Bar
  Widget _buildExtraServicesBottomBar(CandidateColors c, bool isDark) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
      decoration: BoxDecoration(
        color: c.cardBg,
        border: Border(top: BorderSide(color: c.cardBorder, width: 1.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.4 : 0.08),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.shopping_bag_rounded, size: 14, color: Color(0xFF6256D9)),
                    const SizedBox(width: 6),
                    Text(
                      "EXTRA HARDWARE & CAMPAIGN MERCHANDISE",
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.8,
                        color: c.textPrimary,
                      ),
                    ),
                  ],
                ),
                Text(
                  "Official Store ↗",
                  style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.primary),
                ),
              ],
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 52,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _extraServices.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final item = _extraServices[index];
                  return InkWell(
                    onTap: () => _openHardwareStoreModal(item),
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF141417) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: c.cardBorder),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(5),
                            decoration: BoxDecoration(
                              color: item.color.withOpacity(0.14),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Icon(item.icon, size: 14, color: item.color),
                          ),
                          const SizedBox(width: 8),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                item.title,
                                style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                              ),
                              Text(
                                item.priceRange,
                                style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: item.color),
                              ),
                            ],
                          ),
                          const SizedBox(width: 6),
                          Icon(Icons.arrow_forward_ios_rounded, size: 9, color: c.textMuted),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
