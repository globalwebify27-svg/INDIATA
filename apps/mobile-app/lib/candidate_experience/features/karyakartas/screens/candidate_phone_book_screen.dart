import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../data/karyakarta_mock_data.dart';

class CandidatePhoneBookScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const CandidatePhoneBookScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<CandidatePhoneBookScreen> createState() => _CandidatePhoneBookScreenState();
}

class _CandidatePhoneBookScreenState extends State<CandidatePhoneBookScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<PhoneBookContact> _contacts = [];
  String _selectedCategory = "All";

  final List<String> _categories = [
    "All",
    "Core Strategy",
    "Booth Presidents",
    "Prabhaag Leads",
    "Government BLO",
    "Legal & Admin",
  ];

  @override
  void initState() {
    super.initState();
    _contacts = List.from(KaryakartaMockData.phoneBookContacts);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<PhoneBookContact> get _filteredContacts {
    final q = _searchController.text.trim().toLowerCase();

    return _contacts.where((c) {
      if (q.isNotEmpty) {
        final matchName = c.name.toLowerCase().contains(q);
        final matchDesig = c.designation.toLowerCase().contains(q);
        final matchPhone = c.phone.contains(q);
        final matchLoc = c.location.toLowerCase().contains(q);
        if (!matchName && !matchDesig && !matchPhone && !matchLoc) {
          return false;
        }
      }

      if (_selectedCategory != "All" && c.category != _selectedCategory) {
        return false;
      }

      return true;
    }).toList();
  }

  void _addNewContact() {
    final nameCtrl = TextEditingController();
    final desigCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    String category = "Booth Presidents";

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: widget.c.cardBg,
          title: Text("Add Contact to Phone Book", style: TextStyle(color: widget.c.textPrimary, fontSize: 16)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameCtrl,
                  style: TextStyle(color: widget.c.textPrimary),
                  decoration: InputDecoration(
                    labelText: "Contact Name",
                    labelStyle: TextStyle(color: widget.c.textSecondary),
                    filled: true,
                    fillColor: widget.c.scaffoldBg,
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: desigCtrl,
                  style: TextStyle(color: widget.c.textPrimary),
                  decoration: InputDecoration(
                    labelText: "Designation / Role",
                    labelStyle: TextStyle(color: widget.c.textSecondary),
                    filled: true,
                    fillColor: widget.c.scaffoldBg,
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: phoneCtrl,
                  keyboardType: TextInputType.phone,
                  style: TextStyle(color: widget.c.textPrimary),
                  decoration: InputDecoration(
                    labelText: "Phone Number",
                    labelStyle: TextStyle(color: widget.c.textSecondary),
                    filled: true,
                    fillColor: widget.c.scaffoldBg,
                  ),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: category,
                  dropdownColor: widget.c.cardBg,
                  decoration: InputDecoration(
                    labelText: "Category",
                    filled: true,
                    fillColor: widget.c.scaffoldBg,
                  ),
                  items: _categories.where((cat) => cat != "All").map((cat) {
                    return DropdownMenuItem(value: cat, child: Text(cat, style: TextStyle(color: widget.c.textPrimary, fontSize: 13)));
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) setDialogState(() => category = v);
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
            ElevatedButton(
              onPressed: () {
                if (nameCtrl.text.isNotEmpty && phoneCtrl.text.isNotEmpty) {
                  setState(() {
                    _contacts.insert(
                      0,
                      PhoneBookContact(
                        id: "CON-${DateTime.now().millisecond}",
                        name: nameCtrl.text.trim(),
                        designation: desigCtrl.text.trim().isNotEmpty ? desigCtrl.text.trim() : "Campaign Associate",
                        category: category,
                        phone: phoneCtrl.text.trim(),
                        location: "215 - Kasba Peth",
                      ),
                    );
                  });
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Added ${nameCtrl.text} to Candidate Phone Book!")),
                  );
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
              child: const Text("Save Contact", style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.c;
    final results = _filteredContacts;

    return Scaffold(
      backgroundColor: c.scaffoldBg,
      appBar: AppBar(
        backgroundColor: c.appBarBg,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: c.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Candidate Phone Book",
          style: TextStyle(color: c.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_rounded, color: Color(0xFF4F46E5)),
            tooltip: "Add Contact",
            onPressed: _addNewContact,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Category Chips
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            color: c.appBarBg,
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  style: TextStyle(color: c.textPrimary, fontSize: 13),
                  decoration: InputDecoration(
                    hintText: "Search Contact, Role, Phone...",
                    hintStyle: TextStyle(fontSize: 12, color: c.textMuted),
                    prefixIcon: const Icon(Icons.search_rounded, size: 20, color: Color(0xFF6366F1)),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {});
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: c.cardBg,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: c.cardBorder),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: c.cardBorder),
                    ),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 10),

                // Category Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _categories.map((cat) {
                      final isSel = _selectedCategory == cat;
                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: isSel,
                          selectedColor: const Color(0xFF4F46E5),
                          backgroundColor: c.cardBg,
                          labelStyle: TextStyle(
                            fontSize: 11,
                            fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                            color: isSel ? Colors.white : c.textSecondary,
                          ),
                          side: BorderSide(color: isSel ? const Color(0xFF4F46E5) : c.cardBorder),
                          onSelected: (val) {
                            if (val) setState(() => _selectedCategory = cat);
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // Count Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: c.scaffoldBg,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Contacts Found: ${results.length}",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textMuted),
                ),
                Text(
                  "One-Tap Fast Dialing",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF10B981)),
                ),
              ],
            ),
          ),

          // List of Contacts
          Expanded(
            child: results.isNotEmpty
                ? ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: results.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final contact = results[index];
                      return _buildContactCard(contact, c);
                    },
                  )
                : Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.contact_phone_outlined, size: 54, color: c.textMuted),
                        const SizedBox(height: 10),
                        Text("No contacts found", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary)),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard(PhoneBookContact contact, CandidateColors c) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.cardBorder),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: const Color(0xFF4F46E5).withOpacity(0.12),
            child: Text(
              contact.name.split(" ").map((w) => w[0]).take(2).join(),
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      contact.name,
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    if (contact.isPriority) ...[
                      const SizedBox(width: 4),
                      const Icon(Icons.star_rounded, size: 15, color: Color(0xFFF59E0B)),
                    ],
                  ],
                ),
                Text(
                  "${contact.designation} • ${contact.category}",
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF6366F1)),
                ),
                const SizedBox(height: 2),
                Text(
                  "${contact.phone} • ${contact.location}",
                  style: TextStyle(fontSize: 10.5, color: c.textMuted),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),

          // Call Button
          InkWell(
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Calling ${contact.name} (${contact.phone})...")),
              );
            },
            borderRadius: BorderRadius.circular(20),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.call_rounded, size: 18, color: Color(0xFF10B981)),
            ),
          ),
          const SizedBox(width: 6),

          // WhatsApp Button
          InkWell(
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Opening WhatsApp with ${contact.name}...")),
              );
            },
            borderRadius: BorderRadius.circular(20),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF22C55E).withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.chat_rounded, size: 18, color: Color(0xFF22C55E)),
            ),
          ),
        ],
      ),
    );
  }
}
