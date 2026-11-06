"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  User,
  Laptop,
  X,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActivityRecord {
  id: string;
  timestamp: string;
  userName: string;
  userRole: "Candidate Admin" | "Office Lead" | "Ward Coordinator" | "Booth Captain" | "Field Canvasser";
  actionType: "LOGIN" | "EXPORT_VOTERS" | "UPDATE_VOTER" | "APPROVE_REQUEST" | "CREATE_TICKET" | "DISPATCH_CAMPAIGN" | "SETTINGS_UPDATE";
  module: "Total Voters" | "Office & Issues" | "Campaign Control" | "Workforce & Users" | "Settings" | "Authentication";
  targetEntity: string;
  ipAddress: string;
  device: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
  beforeState?: Record<string, string>;
  afterState?: Record<string, string>;
  details: string;
}

const SAMPLE_ACTIVITIES: ActivityRecord[] = [
  {
    id: "act-101",
    timestamp: "Today, 11:42 AM",
    userName: "Adv. Vikram Patil",
    userRole: "Candidate Admin",
    actionType: "DISPATCH_CAMPAIGN",
    module: "Campaign Control",
    targetEntity: "Campaign #CMP-401 (WhatsApp Voter Slips)",
    ipAddress: "103.24.182.55",
    device: "Chrome 131 • Windows 11",
    status: "SUCCESS",
    details: "Dispatched automated WhatsApp voter slip broadcast to 4,500 electors across Ward 12 & 14.",
    beforeState: { status: "SCHEDULED", queued: "4,500" },
    afterState: { status: "ACTIVE_DISPATCH", dispatched: "4,320", delivered: "96%" },
  },
  {
    id: "act-102",
    timestamp: "Today, 10:15 AM",
    userName: "Ashok Shinde",
    userRole: "Office Lead",
    actionType: "APPROVE_REQUEST",
    module: "Workforce & Users",
    targetEntity: "Update Req #REQ-901 (Elector: Suresh Patil)",
    ipAddress: "103.24.182.58",
    device: "Edge 128 • Windows 10",
    status: "SUCCESS",
    details: "Approved mobile number correction and updated family head linkage submitted by Karyakarta Vikas Jadhav.",
    beforeState: { phone: "Unverified", head: "Self" },
    afterState: { phone: "+91 98220 11990", head: "Ramesh Patil" },
  },
  {
    id: "act-103",
    timestamp: "Today, 09:30 AM",
    userName: "Ashok Shinde",
    userRole: "Office Lead",
    actionType: "CREATE_TICKET",
    module: "Office & Issues",
    targetEntity: "Ticket #TKT-9210 (Low Municipal Water Pressure)",
    ipAddress: "103.24.182.58",
    device: "Edge 128 • Windows 10",
    status: "SUCCESS",
    details: "Logged priority grievance ticket for visitor Suresh Patil, assigned to Ward Coordinator Vikas Jadhav.",
    beforeState: { status: "None" },
    afterState: { status: "OPEN", priority: "HIGH", ward: "Ward 12" },
  },
  {
    id: "act-104",
    timestamp: "Today, 08:45 AM",
    userName: "Pooja Jagtap",
    userRole: "Booth Captain",
    actionType: "LOGIN",
    module: "Authentication",
    targetEntity: "Karyakarta Mobile Gateway",
    ipAddress: "49.36.128.90",
    device: "Android 14 • Pixel 7",
    status: "SUCCESS",
    details: "Successfully authenticated with OTP into Karyakarta Doorstep Field App for Booth #101.",
  },
  {
    id: "act-105",
    timestamp: "Yesterday, 06:12 PM",
    userName: "Adv. Vikram Patil",
    userRole: "Candidate Admin",
    actionType: "EXPORT_VOTERS",
    module: "Total Voters",
    targetEntity: "Booth #101-105 Filtered Elector Roll (5,420 Electors)",
    ipAddress: "103.24.182.55",
    device: "Chrome 131 • Windows 11",
    status: "SUCCESS",
    details: "Generated encrypted Excel export of 5,420 verified electors for Booth Captains field kit.",
  },
  {
    id: "act-106",
    timestamp: "Yesterday, 04:30 PM",
    userName: "Ganesh Bhosale",
    userRole: "Ward Coordinator",
    actionType: "UPDATE_VOTER",
    module: "Total Voters",
    targetEntity: "Elector #WXE1290384 (Amit Baban Shinde)",
    ipAddress: "49.36.140.22",
    device: "Safari • iPhone 15",
    status: "SUCCESS",
    details: "Updated residential lane location and added 'Ladki Bahin Beneficiary' tag.",
    beforeState: { houseNo: "House 88", scheme: "None" },
    afterState: { houseNo: "House 88, Gaothan Lane 2", scheme: "Ladki Bahin" },
  },
  {
    id: "act-107",
    timestamp: "Yesterday, 02:15 PM",
    userName: "Unknown External IP",
    userRole: "Field Canvasser",
    actionType: "LOGIN",
    module: "Authentication",
    targetEntity: "Portal Staff Portal",
    ipAddress: "185.220.101.5",
    device: "Firefox 120 • Linux",
    status: "BLOCKED",
    details: "Failed login attempt: Invalid staff security key. Blocked by firewall security policy.",
  },
];

export function UserActivitiesAuditView() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);

  const filtered = SAMPLE_ACTIVITIES.filter((a) => {
    const matchSearch =
      a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ipAddress.includes(searchTerm);

    const matchRole = roleFilter === "all" || a.userRole === roleFilter;
    const matchAction = actionFilter === "all" || a.actionType === actionFilter;

    return matchSearch && matchRole && matchAction;
  });

  const handleExport = () => {
    showToast(
      "success",
      "Audit Trail Exported",
      `Exporting ${filtered.length} cryptographically signed audit log records to Excel / CSV format.`
    );
  };

  const getActionBadge = (type: ActivityRecord["actionType"]) => {
    switch (type) {
      case "DISPATCH_CAMPAIGN":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">CAMPAIGN DISPATCH</span>;
      case "APPROVE_REQUEST":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">APPROVE UPDATE</span>;
      case "CREATE_TICKET":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">CREATE TICKET</span>;
      case "EXPORT_VOTERS":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">DATA EXPORT</span>;
      case "UPDATE_VOTER":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">VOTER EDIT</span>;
      case "LOGIN":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">AUTH LOGIN</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{type}</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 06: Compliance &amp; Security
            </span>
            <Badge variant="teal">Immutable Audit Ledger</Badge>
            <Badge variant="neutral">AC-215 Bound</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            User Activities &amp; Operations Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Real-time audit logging of all portal operations: logins, voter roll queries, ticket handling, field data change approvals, and campaign broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </Button>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, action details, IP address..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-1.5 pl-2.5 pr-7 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All User Roles</option>
              <option value="Candidate Admin">Candidate Admin</option>
              <option value="Office Lead">Office Lead</option>
              <option value="Ward Coordinator">Ward Coordinator</option>
              <option value="Booth Captain">Booth Captain</option>
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="py-1.5 pl-2.5 pr-7 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Action Types</option>
              <option value="DISPATCH_CAMPAIGN">Campaign Dispatch</option>
              <option value="APPROVE_REQUEST">Approve Update</option>
              <option value="CREATE_TICKET">Create Ticket</option>
              <option value="EXPORT_VOTERS">Data Export</option>
              <option value="UPDATE_VOTER">Voter Edit</option>
              <option value="LOGIN">Auth Login</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User &amp; Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module &amp; Entity</th>
                <th className="py-3 px-4">Device &amp; IP</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {record.timestamp}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{record.userName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{record.userRole}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {getActionBadge(record.actionType)}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {record.targetEntity}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{record.module}</div>
                  </td>

                  <td className="py-3 px-4 text-[11px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Laptop className="w-3 h-3 text-slate-400" />
                      <span>{record.device}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">IP: {record.ipAddress}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {record.status === "SUCCESS" ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Success</span>
                      </span>
                    ) : record.status === "WARNING" ? (
                      <span className="flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Warning</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Blocked</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedActivity(record)}
                      className="cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Activity Payload Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <span>Activity Event Inspector</span>
                  <span className="font-mono text-xs text-brand-600 font-normal">#{selectedActivity.id}</span>
                </h3>
                <p className="text-xs text-slate-500">{selectedActivity.timestamp}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">User / Actor:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedActivity.userName} ({selectedActivity.userRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Entity:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedActivity.targetEntity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Client Environment:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">{selectedActivity.device} • {selectedActivity.ipAddress}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Operation Narrative
                </label>
                <p className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                  {selectedActivity.details}
                </p>
              </div>

              {selectedActivity.beforeState && selectedActivity.afterState && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Before vs. After State Diff
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-[11px]">
                      <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">Before Change:</span>
                      <pre className="font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {JSON.stringify(selectedActivity.beforeState, null, 2)}
                      </pre>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-[11px]">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">After Change:</span>
                      <pre className="font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {JSON.stringify(selectedActivity.afterState, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedActivity(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
