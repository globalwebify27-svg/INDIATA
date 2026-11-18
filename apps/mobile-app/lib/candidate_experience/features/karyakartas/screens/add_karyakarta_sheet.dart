import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/karyakarta_model.dart';

class AddKaryakartaSheet extends StatefulWidget {
  final CandidateColors c;
  final Function(KaryakartaModel newWorker) onWorkerAdded;

  const AddKaryakartaSheet({
    super.key,
    required this.c,
    required this.onWorkerAdded,
  });

  static void show(BuildContext context, CandidateColors c, Function(KaryakartaModel) onAdded) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: c.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => AddKaryakartaSheet(c: c, onWorkerAdded: onAdded),
    );
  }

  @override
  State<AddKaryakartaSheet> createState() => _AddKaryakartaSheetState();
}

class _AddKaryakartaSheetState extends State<AddKaryakartaSheet> {
  final _nameController = TextEditingController();
  final _nameMrController = TextEditingController();
  final _mobileController = TextEditingController();
  final _boothController = TextEditingController(text: "101");
  KaryakartaRole _selectedRole = KaryakartaRole.fieldSurveyor;
  bool _sendInviteWhatsApp = true;

  @override
  void dispose() {
    _nameController.dispose();
    _nameMrController.dispose();
    _mobileController.dispose();
    _boothController.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    final name = _nameController.text.trim();
    final mobile = _mobileController.text.trim();
    final booth = int.tryParse(_boothController.text.trim()) ?? 101;

    if (name.isEmpty || mobile.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter a valid worker name and 10-digit mobile number.")),
      );
      return;
    }

    final newWorker = KaryakartaModel(
      id: "KAR-${booth.toString().padLeft(3, '0')}-${DateTime.now().millisecond}",
      name: name,
      nameMr: _nameMrController.text.trim().isNotEmpty ? _nameMrController.text.trim() : name,
      mobile: mobile,
      email: "$name@rajtantra.in".toLowerCase().replaceAll(" ", "."),
      role: _selectedRole,
      status: KaryakartaStatus.onDuty,
      assignedBooth: booth,
      assignedPrabhaag: 14,
      targetSurveys: 1200,
      completedSurveys: 0,
      todaySurveys: 0,
      distributedSlips: 0,
      totalSlips: 1200,
      lastActiveLocation: "Just Enrolled (Pending First Login)",
      lastActiveTime: "Active just now",
      isAlertInactive: false,
    );

    widget.onWorkerAdded(newWorker);
    Navigator.pop(context);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF10B981),
        content: Text("🎉 Added $name to Booth #$booth! Welcome invite sent via WhatsApp."),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.person_add_alt_1_rounded, color: Color(0xFF4F46E5), size: 24),
                    const SizedBox(width: 8),
                    Text(
                      "Add Field Karyakarta",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              "नवीन कार्यकर्ता नोंदणी • Allocates login credentials for Karyakarta App",
              style: TextStyle(fontSize: 11, color: c.textMuted),
            ),
            const Divider(height: 20),

            _buildFieldLabel("FULL NAME (ENGLISH)", c),
            TextField(
              controller: _nameController,
              style: TextStyle(color: c.textPrimary),
              decoration: _inputDecoration("e.g. Rahul Ashok Jadhav", c),
            ),
            const SizedBox(height: 12),

            _buildFieldLabel("FULL NAME (मराठी नाव)", c),
            TextField(
              controller: _nameMrController,
              style: TextStyle(color: c.textPrimary),
              decoration: _inputDecoration("उदा. राहुल अशोक जाधव", c),
            ),
            const SizedBox(height: 12),

            _buildFieldLabel("MOBILE NUMBER (FOR OTP LOGIN)", c),
            TextField(
              controller: _mobileController,
              keyboardType: TextInputType.phone,
              style: TextStyle(color: c.textPrimary),
              decoration: _inputDecoration("10-digit mobile number", c, prefix: "+91 "),
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildFieldLabel("ASSIGNED BOOTH #", c),
                      TextField(
                        controller: _boothController,
                        keyboardType: TextInputType.number,
                        style: TextStyle(color: c.textPrimary),
                        decoration: _inputDecoration("e.g. 104", c),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildFieldLabel("WORKFORCE ROLE", c),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          color: c.scaffoldBg,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: c.cardBorder),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<KaryakartaRole>(
                            value: _selectedRole,
                            dropdownColor: c.cardBg,
                            isExpanded: true,
                            items: const [
                              DropdownMenuItem(
                                value: KaryakartaRole.fieldSurveyor,
                                child: Text("Surveyor", style: TextStyle(fontSize: 12)),
                              ),
                              DropdownMenuItem(
                                value: KaryakartaRole.boothPresident,
                                child: Text("Booth Pres.", style: TextStyle(fontSize: 12)),
                              ),
                              DropdownMenuItem(
                                value: KaryakartaRole.youthWingLeader,
                                child: Text("Youth Lead", style: TextStyle(fontSize: 12)),
                              ),
                            ],
                            onChanged: (v) {
                              if (v != null) setState(() => _selectedRole = v);
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            CheckboxListTile(
              contentPadding: EdgeInsets.zero,
              dense: true,
              value: _sendInviteWhatsApp,
              activeColor: const Color(0xFF4F46E5),
              title: const Text("Dispatch WhatsApp App Invite Link", style: TextStyle(fontSize: 12)),
              subtitle: const Text("Sends download link and OTP instructions to worker phone", style: TextStyle(fontSize: 10)),
              onChanged: (v) => setState(() => _sendInviteWhatsApp = v ?? true),
            ),
            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _handleSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF4F46E5),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text("Enrol & Grant Karyakarta Access", style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFieldLabel(String label, CandidateColors c) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        label,
        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0, color: c.textMuted),
      ),
    );
  }

  InputDecoration _inputDecoration(String hint, CandidateColors c, {String? prefix}) {
    return InputDecoration(
      hintText: hint,
      prefixText: prefix,
      filled: true,
      fillColor: c.scaffoldBg,
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: c.cardBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: c.cardBorder),
      ),
    );
  }
}
