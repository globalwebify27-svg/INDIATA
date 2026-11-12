import 'package:flutter/material.dart';
import '../../../core/theme/candidate_theme.dart';
import '../models/office_issue_model.dart';
import '../data/office_issues_mock_data.dart';
import 'grievance_detail_screen.dart';
import 'add_grievance_sheet.dart';

class OfficeIssuesScreen extends StatefulWidget {
  final CandidateColors c;
  final bool isDark;

  const OfficeIssuesScreen({
    super.key,
    required this.c,
    required this.isDark,
  });

  @override
  State<OfficeIssuesScreen> createState() => _OfficeIssuesScreenState();
}

class _OfficeIssuesScreenState extends State<OfficeIssuesScreen> {
  int _selectedSegment = 0; // 0: Grievances, 1: Visitors Log
  String _searchQuery = "";
  GrievanceStatus? _selectedStatus; // null = all

  final List<GrievanceTicket> _tickets = List.from(OfficeIssuesMockData.tickets);
  final List<VisitorRecord> _visitors = List.from(OfficeIssuesMockData.visitorsToday);

  List<GrievanceTicket> get _filteredTickets {
    return _tickets.where((t) {
      final matchesSearch = _searchQuery.isEmpty ||
          t.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.citizenName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.pethOrWard.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.id.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesStatus = _selectedStatus == null || t.status == _selectedStatus;

      return matchesSearch && matchesStatus;
    }).toList();
  }

  void _openAddGrievanceSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AddGrievanceSheet(
        c: widget.c,
        onTicketCreated: (newTicket) {
          setState(() {
            _tickets.insert(0, newTicket);
          });
        },
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
              "Office & Issues Management",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: c.textPrimary),
            ),
            Text(
              "Citizen Demands & Constituency Visitor Log",
              style: TextStyle(fontSize: 10, color: c.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Log New Grievance",
            icon: Icon(Icons.add_task_rounded, color: c.primary, size: 22),
            onPressed: _openAddGrievanceSheet,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openAddGrievanceSheet,
        backgroundColor: c.primary,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text("Log Issue", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Top Statistics Row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            color: c.cardBg,
            child: Row(
              children: [
                Expanded(child: _kpiTile("Walk-ins Today", "${_visitors.length}", Colors.blue)),
                const SizedBox(width: 8),
                Expanded(child: _kpiTile("Open Tickets", "${_tickets.where((t) => t.status != GrievanceStatus.closed).length}", Colors.red)),
                const SizedBox(width: 8),
                Expanded(child: _kpiTile("Resolved Week", "${OfficeIssuesMockData.resolvedThisWeek}", Colors.green)),
                const SizedBox(width: 8),
                Expanded(child: _kpiTile("Escalated PMC", "${OfficeIssuesMockData.escalatedToPMC}", Colors.amber.shade800)),
              ],
            ),
          ),

          // Segment Selector
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            color: c.cardBg,
            child: Row(
              children: [
                Expanded(
                  child: _segmentButton(0, "Citizen Grievances (${_tickets.length})"),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _segmentButton(1, "Office Visitors (${_visitors.length})"),
                ),
              ],
            ),
          ),

          // Main Content
          Expanded(
            child: _selectedSegment == 0 ? _buildGrievancesView() : _buildVisitorsView(),
          ),
        ],
      ),
    );
  }

  Widget _kpiTile(String label, String value, Color color) {
    final c = widget.c;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: color),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: c.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _segmentButton(int index, String title) {
    final isSelected = _selectedSegment == index;
    final c = widget.c;

    return InkWell(
      onTap: () => setState(() => _selectedSegment = index),
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
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : c.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  // --- GRIEVANCES VIEW ---
  Widget _buildGrievancesView() {
    final c = widget.c;
    final filtered = _filteredTickets;

    return Column(
      children: [
        // Search & Status Filters
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          color: c.cardBg,
          child: Column(
            children: [
              TextField(
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: InputDecoration(
                  hintText: "Search citizen name, ticket ID, or issue...",
                  hintStyle: TextStyle(fontSize: 11.5, color: c.textMuted),
                  prefixIcon: Icon(Icons.search_rounded, size: 18, color: c.textMuted),
                  filled: true,
                  fillColor: c.scaffoldBg,
                  contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: c.borderColor)),
                ),
                style: TextStyle(fontSize: 12, color: c.textPrimary),
              ),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _statusChip("All", null),
                    const SizedBox(width: 6),
                    _statusChip("New", GrievanceStatus.ticketNew),
                    const SizedBox(width: 6),
                    _statusChip("In Progress", GrievanceStatus.inProgress),
                    const SizedBox(width: 6),
                    _statusChip("Resolved", GrievanceStatus.resolved),
                    const SizedBox(width: 6),
                    _statusChip("Closed", GrievanceStatus.closed),
                  ],
                ),
              ),
            ],
          ),
        ),

        // Grievance Cards List
        Expanded(
          child: filtered.isEmpty
              ? Center(child: Text("No grievances found.", style: TextStyle(color: c.textSecondary, fontSize: 12)))
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(14, 12, 14, 80),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final ticket = filtered[index];
                    return _buildGrievanceCard(ticket);
                  },
                ),
        ),
      ],
    );
  }

  Widget _statusChip(String label, GrievanceStatus? status) {
    final isSelected = _selectedStatus == status;
    final c = widget.c;

    return InkWell(
      onTap: () => setState(() => _selectedStatus = status),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? c.primary : c.cardBg,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? c.primary : c.borderColor),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : c.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildGrievanceCard(GrievanceTicket ticket) {
    final c = widget.c;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: c.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.borderColor),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => GrievanceDetailScreen(
                ticket: ticket,
                c: c,
                isDark: widget.isDark,
                onTicketUpdated: () => setState(() {}),
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: c.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          ticket.id,
                          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.primary),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: ticket.priorityColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: ticket.priorityColor.withOpacity(0.4)),
                        ),
                        child: Text(
                          ticket.priorityLabel,
                          style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: ticket.priorityColor),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                    decoration: BoxDecoration(
                      color: ticket.statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: ticket.statusColor),
                    ),
                    child: Text(
                      ticket.statusLabel,
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: ticket.statusColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  CircleAvatar(
                    radius: 14,
                    backgroundColor: c.primary.withOpacity(0.1),
                    child: Icon(ticket.categoryIcon, size: 15, color: c.primary),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      ticket.title,
                      style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                "${ticket.citizenName} • ${ticket.pethOrWard} • Booth #${ticket.boothNumber}",
                style: TextStyle(fontSize: 10.5, color: c.textSecondary),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                decoration: BoxDecoration(
                  color: c.scaffoldBg,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.person_pin_rounded, size: 13, color: Colors.teal),
                        const SizedBox(width: 4),
                        Text(
                          "Assigned: ${ticket.assignedWorkerName}",
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: c.textPrimary),
                        ),
                      ],
                    ),
                    Text(
                      ticket.createdAt,
                      style: TextStyle(fontSize: 9.5, color: c.textMuted),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- VISITORS VIEW ---
  Widget _buildVisitorsView() {
    final c = widget.c;

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 80),
      itemCount: _visitors.length,
      itemBuilder: (context, index) {
        final visitor = _visitors[index];

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: c.cardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: c.borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: c.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          visitor.id,
                          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: c.primary),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        visitor.name,
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: c.textPrimary),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                    decoration: BoxDecoration(
                      color: visitor.statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: visitor.statusColor),
                    ),
                    child: Text(
                      visitor.status,
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: visitor.statusColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Icon(Icons.location_on_rounded, size: 13, color: c.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    "${visitor.pethOrWard} • ${visitor.phone}",
                    style: TextStyle(fontSize: 10.5, color: c.textSecondary),
                  ),
                  const Spacer(),
                  Icon(Icons.access_time_rounded, size: 12, color: c.textMuted),
                  const SizedBox(width: 3),
                  Text(
                    visitor.timeIn,
                    style: TextStyle(fontSize: 10, color: c.textMuted),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: c.scaffoldBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Purpose: ${visitor.purpose}",
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: c.textPrimary),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      visitor.notes,
                      style: TextStyle(fontSize: 10.5, color: c.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
