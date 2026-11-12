import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/office_issue_model.dart';

class AddGrievanceSheet extends StatefulWidget {
  final CandidateColors c;
  final Function(GrievanceTicket) onTicketCreated;

  const AddGrievanceSheet({
    super.key,
    required this.c,
    required this.onTicketCreated,
  });

  @override
  State<AddGrievanceSheet> createState() => _AddGrievanceSheetState();
}

class _AddGrievanceSheetState extends State<AddGrievanceSheet> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _pethController = TextEditingController(text: "Kasba Peth");
  final _boothController = TextEditingController(text: "42");
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  GrievanceCategory _category = GrievanceCategory.waterSupply;
  GrievancePriority _priority = GrievancePriority.high;
  String _assignedWorker = "Sachin Shinde (Prabhaag Lead)";
  String _assignedPhone = "+91 98220 12345";

  final List<Map<String, String>> _workers = [
    {"name": "Sachin Shinde (Prabhaag Lead)", "phone": "+91 98220 12345"},
    {"name": "Nitin More (Senior Lead)", "phone": "+91 94220 45678"},
    {"name": "Amit Jagtap (Booth Incharge)", "phone": "+91 98500 23456"},
    {"name": "Pooja Shinde (Mahila Lead)", "phone": "+91 97654 78901"},
    {"name": "Adv. Kulkarni (Legal Cell)", "phone": "+91 98221 88990"},
  ];

  void _handleSubmit() {
    if (_nameController.text.trim().isEmpty || _titleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill in Citizen Name and Issue Title.")),
      );
      return;
    }

    final newTicket = GrievanceTicket(
      id: "GRV-${1045 + DateTime.now().millisecond % 50}",
      citizenName: _nameController.text.trim(),
      citizenPhone: _phoneController.text.trim().isEmpty ? "+91 98000 00000" : _phoneController.text.trim(),
      pethOrWard: _pethController.text.trim(),
      boothNumber: int.tryParse(_boothController.text.trim()) ?? 1,
      category: _category,
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      priority: _priority,
      status: GrievanceStatus.ticketNew,
      assignedWorkerName: _assignedWorker,
      assignedWorkerPhone: _assignedPhone,
      createdAt: "Just now",
    );

    widget.onTicketCreated(newTicket);
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.green.shade800,
        content: Text("Grievance #${newTicket.id} registered and assigned to $_assignedWorker"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;

    return Container(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      height: MediaQuery.of(context).size.height * 0.88,
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.note_add_rounded, color: Color(0xFF1E3A8A), size: 22),
                  const SizedBox(width: 8),
                  Text(
                    "Log New Grievance / Demand",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close_rounded),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const Divider(),

          Expanded(
            child: ListView(
              children: [
                // Citizen Name & Phone
                Row(
                  children: [
                    Expanded(
                      child: _textField("Citizen Name", _nameController, "e.g. Ramesh Joshi"),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _textField("Mobile Number", _phoneController, "e.g. 98220 XXXXX"),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Locality & Booth #
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: _textField("Locality / Peth", _pethController, "e.g. Sadashiv Peth"),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _textField("Booth #", _boothController, "42"),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Category Dropdown
                Text("GRIEVANCE CATEGORY", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: c.scaffoldBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: c.borderColor),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<GrievanceCategory>(
                      value: _category,
                      isExpanded: true,
                      dropdownColor: c.cardBg,
                      items: GrievanceCategory.values.map((cat) {
                        return DropdownMenuItem(
                          value: cat,
                          child: Text(_categoryName(cat), style: TextStyle(fontSize: 12, color: c.textPrimary)),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _category = val);
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // Priority Selector
                Text("PRIORITY LEVEL", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
                const SizedBox(height: 4),
                Row(
                  children: GrievancePriority.values.map((p) {
                    final isSel = _priority == p;
                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 3),
                        child: InkWell(
                          onTap: () => setState(() => _priority = p),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: isSel ? _priorityColor(p) : c.scaffoldBg,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: _priorityColor(p)),
                            ),
                            child: Center(
                              child: Text(
                                _priorityLabel(p),
                                style: TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.bold,
                                  color: isSel ? Colors.white : _priorityColor(p),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 12),

                // Issue Title & Description
                _textField("Issue Summary / Title", _titleController, "e.g. Severely contaminated tap water in Wada #12"),
                const SizedBox(height: 10),
                Text("DETAILED DESCRIPTION", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
                const SizedBox(height: 4),
                TextField(
                  controller: _descriptionController,
                  maxLines: 3,
                  style: TextStyle(fontSize: 12, color: c.textPrimary),
                  decoration: InputDecoration(
                    hintText: "Enter complete ground details, affected families, PMC dept...",
                    hintStyle: TextStyle(fontSize: 11, color: c.textMuted),
                    filled: true,
                    fillColor: c.scaffoldBg,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                  ),
                ),

                const SizedBox(height: 12),

                // Assign Karyakarta Dropdown
                Text("ASSIGN ACTION KARYAKARTA", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: c.scaffoldBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: c.borderColor),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _assignedWorker,
                      isExpanded: true,
                      dropdownColor: c.cardBg,
                      items: _workers.map((w) {
                        return DropdownMenuItem(
                          value: w["name"],
                          child: Text(w["name"]!, style: TextStyle(fontSize: 12, color: c.textPrimary)),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          final match = _workers.firstWhere((w) => w["name"] == val);
                          setState(() {
                            _assignedWorker = match["name"]!;
                            _assignedPhone = match["phone"]!;
                          });
                        }
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Submit Button
                ElevatedButton.icon(
                  onPressed: _handleSubmit,
                  icon: const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                  label: const Text("Register & Dispatch to Karyakarta", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: c.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _textField(String label, TextEditingController controller, String hint) {
    final c = widget.c;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c.textMuted)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          style: TextStyle(fontSize: 12, color: c.textPrimary),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(fontSize: 11, color: c.textMuted),
            filled: true,
            fillColor: c.scaffoldBg,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
          ),
        ),
      ],
    );
  }

  String _categoryName(GrievanceCategory cat) {
    switch (cat) {
      case GrievanceCategory.waterSupply:
        return "Water Supply & Pressure";
      case GrievanceCategory.drainageSewerage:
        return "Drainage & Sewerage Overflow";
      case GrievanceCategory.roadsTraffic:
        return "Roads, Potholes & Traffic";
      case GrievanceCategory.streetlights:
        return "Streetlights & Electricity";
      case GrievanceCategory.wadaRedevelopment:
        return "Old Wada Redevelopment & Tenancy";
      case GrievanceCategory.govtScheme:
        return "Govt Welfare Scheme (DBT)";
      case GrievanceCategory.healthcare:
        return "Healthcare / Hospital Aid";
      case GrievanceCategory.policeLegal:
        return "Police / Legal Assistance";
    }
  }

  Color _priorityColor(GrievancePriority p) {
    switch (p) {
      case GrievancePriority.critical:
        return Colors.red;
      case GrievancePriority.high:
        return Colors.deepOrange;
      case GrievancePriority.medium:
        return Colors.amber.shade700;
      case GrievancePriority.low:
        return Colors.blue;
    }
  }

  String _priorityLabel(GrievancePriority p) {
    switch (p) {
      case GrievancePriority.critical:
        return "CRITICAL";
      case GrievancePriority.high:
        return "HIGH";
      case GrievancePriority.medium:
        return "MEDIUM";
      case GrievancePriority.low:
        return "LOW";
    }
  }
}
