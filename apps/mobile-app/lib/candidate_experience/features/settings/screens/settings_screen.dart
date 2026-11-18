import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../../../core/constants/app_constants.dart';
import '../models/karyakarta_app_config_model.dart';

class SettingsScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const SettingsScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  int _selectedTab = 0; // 0: Karyakarta App Appearance, 1: Candidate Profile, 2: Security & App Lock

  // Karyakarta App Customizer State
  final KaryakartaAppConfig _appConfig = KaryakartaAppConfig();
  late TextEditingController _karyakartaTitleController;
  late TextEditingController _karyakartaMissionController;

  // Candidate Profile State
  final _nameController = TextEditingController(text: AppConstants.defaultCandidateName);
  final _partyController = TextEditingController(text: AppConstants.defaultPartyName);
  final _sloganController = TextEditingController(text: "विकास, विश्वास आणि कसबा पेठचा सन्मान");
  final _phoneController = TextEditingController(text: "+91 98220 99999");
  final _constituencyController = TextEditingController(text: AppConstants.defaultConstituency);

  // Security State
  bool _biometricEnabled = true;
  bool _twoFactorEnabled = true;
  String _autoLockDuration = "5 Minutes";

  final List<Map<String, dynamic>> _themePalettes = [
    {"name": "Executive Navy", "hex": "#0F2744", "color": const Color(0xFF0F2744)},
    {"name": "Royal Saffron", "hex": "#EA580C", "color": const Color(0xFFEA580C)},
    {"name": "Electric Indigo", "hex": "#4F46E5", "color": const Color(0xFF4F46E5)},
    {"name": "Emerald Victory", "hex": "#059669", "color": const Color(0xFF059669)},
    {"name": "Deep Crimson", "hex": "#991B1B", "color": const Color(0xFF991B1B)},
  ];

  @override
  void initState() {
    super.initState();
    _karyakartaTitleController = TextEditingController(text: _appConfig.campaignHeaderTitle);
    _karyakartaMissionController = TextEditingController(text: _appConfig.dailyMissionNotice);
  }

  void _publishKaryakartaConfig() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.green.shade800,
        content: const Row(
          children: [
            Icon(Icons.cloud_upload_rounded, color: Colors.white, size: 18),
            SizedBox(width: 8),
            Expanded(
              child: Text(
                "Karyakarta App appearance & mission published to 342 active field devices!",
                style: TextStyle(color: Colors.white, fontSize: 11),
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
              "Profile & App Customizer",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Configure Campaign Identity & Karyakarta App",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Segmented Tab Selector
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            color: c.cardBg,
            child: Row(
              children: [
                _tabButton(0, "Karyakarta App"),
                const SizedBox(width: 6),
                _tabButton(1, "Candidate Profile"),
                const SizedBox(width: 6),
                _tabButton(2, "Security & Lock"),
              ],
            ),
          ),

          Expanded(
            child: _buildCurrentTab(),
          ),
        ],
      ),
    );
  }

  Widget _tabButton(int index, String title) {
    final isSelected = _selectedTab == index;
    final c = widget.c;

    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedTab = index),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? c.primary : c.scaffoldBg,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: isSelected ? c.primary : c.borderColor),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : c.textSecondary,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentTab() {
    switch (_selectedTab) {
      case 0:
        return _buildKaryakartaCustomizerTab();
      case 1:
        return _buildCandidateProfileTab();
      case 2:
      default:
        return _buildSecurityTab();
    }
  }

  // --- TAB 0: KARYAKARTA APP CUSTOMIZER ---
  Widget _buildKaryakartaCustomizerTab() {
    final c = widget.c;

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        // Live Mobile Phone Mockup Preview
        Text(
          "LIVE KARYAKARTA APP PREVIEW",
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),

        Container(
          height: 230,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: widget.isDark ? const Color(0xFF090D16) : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: c.borderColor, width: 2),
          ),
          child: Column(
            children: [
              // Phone Notch & Status bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("9:41", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textPrimary)),
                  Container(
                    width: 60,
                    height: 12,
                    decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(8)),
                  ),
                  Row(
                    children: [
                      Icon(Icons.wifi, size: 11, color: c.textPrimary),
                      const SizedBox(width: 4),
                      Icon(Icons.battery_full, size: 11, color: c.textPrimary),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Mockup Header with Selected Theme Color
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: _appConfig.themeColor,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 14,
                      backgroundColor: Colors.white24,
                      child: const Text("VP", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _karyakartaTitleController.text,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          const Text("Karyakarta Portal • Kasba Peth", style: TextStyle(fontSize: 9, color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 8),

              // Daily Mission Notice Banner
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _appConfig.themeColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _appConfig.themeColor.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.campaign_rounded, size: 15, color: _appConfig.themeColor),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        _karyakartaMissionController.text,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w600, color: _appConfig.themeColor),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 10),

              // Mock Feature Tiles
              Row(
                children: [
                  Expanded(
                    child: _mockFeatureCard("Doorstep Survey", Icons.how_to_vote_rounded, _appConfig.enableDoorstepSurveys),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: _mockFeatureCard("Voter Slips", Icons.badge_rounded, _appConfig.enableVoterSlips),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: _mockFeatureCard("Grievance Desk", Icons.receipt_long_rounded, _appConfig.enablePublicIssues),
                  ),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Brand Color Theme Palette Selector
        Text(
          "SELECT KARYAKARTA APP BRANDING COLOR",
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),

        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: _themePalettes.map((pal) {
            final isSel = _appConfig.themeColorHex == pal["hex"];
            return GestureDetector(
              onTap: () {
                setState(() {
                  _appConfig.themeColorHex = pal["hex"];
                });
              },
              child: Column(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: pal["color"],
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isSel ? Colors.amber : Colors.transparent,
                        width: isSel ? 3 : 0,
                      ),
                    ),
                    child: isSel ? const Icon(Icons.check, color: Colors.white, size: 20) : null,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    pal["name"].split(" ")[0],
                    style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: isSel ? c.primary : c.textSecondary),
                  ),
                ],
              ),
            );
          }).toList(),
        ),

        const SizedBox(height: 16),

        // Campaign Banner Title Input
        Text("CAMPAIGN HEADER TITLE", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
        const SizedBox(height: 4),
        TextField(
          controller: _karyakartaTitleController,
          onChanged: (val) => setState(() => _appConfig.campaignHeaderTitle = val),
          style: TextStyle(fontSize: 12, color: c.textPrimary),
          decoration: InputDecoration(
            filled: true,
            fillColor: c.cardBg,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
          ),
        ),

        const SizedBox(height: 12),

        // Daily Mission Notice Input
        Text("DAILY KARYAKARTA MISSION MESSAGE", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
        const SizedBox(height: 4),
        TextField(
          controller: _karyakartaMissionController,
          onChanged: (val) => setState(() => _appConfig.dailyMissionNotice = val),
          maxLines: 2,
          style: TextStyle(fontSize: 12, color: c.textPrimary),
          decoration: InputDecoration(
            filled: true,
            fillColor: c.cardBg,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
          ),
        ),

        const SizedBox(height: 16),

        // Feature Toggles Section
        Text(
          "FIELD WORKER MODULE PERMISSIONS",
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
            children: [
              _switchTile("Doorstep Survey Execution", "Allow field workers to collect voter sentiment & phone numbers", _appConfig.enableDoorstepSurveys, (val) => setState(() => _appConfig.enableDoorstepSurveys = val)),
              Divider(height: 1, color: c.borderColor),
              _switchTile("Voter Slip Generation (Thermal/PDF)", "Allow on-the-spot thermal printing and WhatsApp delivery", _appConfig.enableVoterSlips, (val) => setState(() => _appConfig.enableVoterSlips = val)),
              Divider(height: 1, color: c.borderColor),
              _switchTile("GPS Geofence Tracking", "Verify surveyor presence within assigned polling station polygon", _appConfig.enableGpsVerification, (val) => setState(() => _appConfig.enableGpsVerification = val)),
              Divider(height: 1, color: c.borderColor),
              _switchTile("Citizen Grievance Submission", "Enable field logging of civic issues and PMC escalation requests", _appConfig.enablePublicIssues, (val) => setState(() => _appConfig.enablePublicIssues = val)),
              Divider(height: 1, color: c.borderColor),
              _switchTile("Deceased / Shifted Voter Flagging", "Allow reporting roll discrepancies for Form 7/8 revision", _appConfig.enableDeceasedVoterFlagging, (val) => setState(() => _appConfig.enableDeceasedVoterFlagging = val)),
            ],
          ),
        ),

        const SizedBox(height: 18),

        // Publish Button
        ElevatedButton.icon(
          onPressed: _publishKaryakartaConfig,
          icon: const Icon(Icons.publish_rounded, color: Colors.white, size: 18),
          label: const Text("Publish Configuration to All Karyakartas", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          style: ElevatedButton.styleFrom(
            backgroundColor: c.primary,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),

        const SizedBox(height: 20),
      ],
    );
  }

  Widget _mockFeatureCard(String label, IconData icon, bool isEnabled) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
      decoration: BoxDecoration(
        color: isEnabled ? Colors.white : Colors.grey.shade300,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Icon(icon, size: 16, color: isEnabled ? Colors.black87 : Colors.black38),
          const SizedBox(height: 3),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 1,
            style: TextStyle(
              fontSize: 8.5,
              fontWeight: FontWeight.bold,
              color: isEnabled ? Colors.black87 : Colors.black38,
            ),
          ),
        ],
      ),
    );
  }

  Widget _switchTile(String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    final c = widget.c;
    return SwitchListTile(
      dense: true,
      title: Text(title, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
      subtitle: Text(subtitle, style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
      value: value,
      activeColor: c.primary,
      onChanged: onChanged,
    );
  }

  // --- TAB 1: CANDIDATE & CAMPAIGN PROFILE ---
  Widget _buildCandidateProfileTab() {
    final c = widget.c;

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        // Avatar with edit button
        Center(
          child: Stack(
            children: [
              CircleAvatar(
                radius: 40,
                backgroundColor: c.primary,
                child: const Text("VP", style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: CircleAvatar(
                  radius: 14,
                  backgroundColor: Colors.amber,
                  child: const Icon(Icons.camera_alt_rounded, size: 14, color: Colors.black87),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        _profileField("Legal Candidate Name", _nameController),
        const SizedBox(height: 10),
        _profileField("Political Party Name", _partyController),
        const SizedBox(height: 10),
        _profileField("Campaign Slogan (Marathi / English)", _sloganController),
        const SizedBox(height: 10),
        _profileField("Constituency Details", _constituencyController),
        const SizedBox(height: 10),
        _profileField("War Room Hotline Phone", _phoneController),

        const SizedBox(height: 20),

        ElevatedButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Candidate campaign profile updated successfully.")),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: c.primary,
            padding: const EdgeInsets.symmetric(vertical: 13),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
          child: const Text("Save Profile Changes", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),

        const SizedBox(height: 20),
      ],
    );
  }

  Widget _profileField(String label, TextEditingController controller) {
    final c = widget.c;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.textMuted)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          style: TextStyle(fontSize: 12, color: c.textPrimary),
          decoration: InputDecoration(
            filled: true,
            fillColor: c.cardBg,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
          ),
        ),
      ],
    );
  }

  // --- TAB 2: SECURITY & APP LOCK ---
  Widget _buildSecurityTab() {
    final c = widget.c;

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Container(
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            children: [
              SwitchListTile(
                dense: true,
                title: Text("Biometric App Lock (FaceID / Fingerprint)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                subtitle: Text("Require biometric scan upon opening Candidate War Room", style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
                value: _biometricEnabled,
                activeColor: c.primary,
                onChanged: (val) => setState(() => _biometricEnabled = val),
              ),
              Divider(height: 1, color: c.borderColor),
              SwitchListTile(
                dense: true,
                title: Text("Two-Factor Authentication (SMS OTP)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                subtitle: Text("Require OTP for confidential voter exports & broadcasts", style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
                value: _twoFactorEnabled,
                activeColor: c.primary,
                onChanged: (val) => setState(() => _twoFactorEnabled = val),
              ),
              Divider(height: 1, color: c.borderColor),
              ListTile(
                dense: true,
                title: Text("Auto-Lock Inactivity Timeout", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: c.textPrimary)),
                subtitle: Text("Automatically lock session when app is minimized", style: TextStyle(fontSize: 9.5, color: c.textSecondary)),
                trailing: DropdownButton<String>(
                  value: _autoLockDuration,
                  underline: const SizedBox(),
                  dropdownColor: c.cardBg,
                  items: ["Immediate", "5 Minutes", "15 Minutes", "30 Minutes"].map((dur) {
                    return DropdownMenuItem(value: dur, child: Text(dur, style: TextStyle(fontSize: 11, color: c.textPrimary)));
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _autoLockDuration = val);
                  },
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        Text(
          "AUTHORIZED ACTIVE SESSIONS & DEVICES",
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: c.textMuted, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),

        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            children: [
              _deviceTile("Apple iPhone 15 Pro (Current Device)", "Pune Central • Active Now", Icons.phone_iphone_rounded, true),
              Divider(height: 14, color: c.borderColor),
              _deviceTile("War Room Master Dashboard PC", "Kasba Central Office • Last active 2h ago", Icons.laptop_mac_rounded, false),
            ],
          ),
        ),

        const SizedBox(height: 20),
      ],
    );
  }

  Widget _deviceTile(String name, String status, IconData icon, bool isCurrent) {
    final c = widget.c;
    return Row(
      children: [
        CircleAvatar(
          radius: 16,
          backgroundColor: isCurrent ? Colors.green.withOpacity(0.12) : c.borderColor,
          child: Icon(icon, size: 16, color: isCurrent ? Colors.green : c.textSecondary),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: c.textPrimary)),
              Text(status, style: TextStyle(fontSize: 9.5, color: isCurrent ? Colors.green : c.textSecondary)),
            ],
          ),
        ),
        if (!isCurrent)
          TextButton(
            onPressed: () {},
            child: const Text("Revoke", style: TextStyle(color: Colors.red, fontSize: 10.5)),
          ),
      ],
    );
  }
}
