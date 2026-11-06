"use client";

import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Phone,
  Key,
  Users,
  CheckCircle2,
  XCircle,
  FileEdit,
  BadgeCheck,
  X,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface KaryakartaItem {
  id: string;
  name: string;
  phone: string;
  role: "Ward Coordinator" | "Booth Captain" | "Field Canvasser" | "Office Operator";
  assignedWard: string;
  assignedBooths: string[];
  srNoRange: string;
  doorstepTarget: number;
  doorstepCompleted: number;
  status: "Active on Field" | "Standby" | "Offline";
  lastPing: string;
  hasAppKey: boolean;
}

interface MemberRequestItem {
  id: string;
  name: string;
  phone: string;
  ward: string;
  locality: string;
  requestedDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface FieldUpdateRequestItem {
  id: string;
  submittedBy: string;
  workerRole: string;
  voterEpic: string;
  voterName: string;
  booth: string;
  changeField: string;
  oldValue: string;
  newValue: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const SAMPLE_KARYAKARTAS: KaryakartaItem[] = [
  {
    id: "k-01",
    name: "Vikas M. Jadhav",
    phone: "+91 98224 55441",
    role: "Ward Coordinator",
    assignedWard: "Ward 12 (Kothrud)",
    assignedBooths: ["#101", "#102", "#103", "#104"],
    srNoRange: "Sr. No. 1 - 1,200",
    doorstepTarget: 1200,
    doorstepCompleted: 1040,
    status: "Active on Field",
    lastPing: "2m ago",
    hasAppKey: true,
  },
  {
    id: "k-02",
    name: "Pooja Santosh Jagtap",
    phone: "+91 98901 22334",
    role: "Booth Captain",
    assignedWard: "Ward 12 (Kothrud)",
    assignedBooths: ["#101"],
    srNoRange: "Sr. No. 1 - 350",
    doorstepTarget: 350,
    doorstepCompleted: 320,
    status: "Active on Field",
    lastPing: "Just now",
    hasAppKey: true,
  },
  {
    id: "k-03",
    name: "Ganesh P. Bhosale",
    phone: "+91 97654 00987",
    role: "Booth Captain",
    assignedWard: "Ward 14 (Erandwane)",
    assignedBooths: ["#106", "#107"],
    srNoRange: "Sr. No. 351 - 950",
    doorstepTarget: 600,
    doorstepCompleted: 450,
    status: "Active on Field",
    lastPing: "8m ago",
    hasAppKey: true,
  },
  {
    id: "k-04",
    name: "Nilesh D. Shinde",
    phone: "+91 98230 44556",
    role: "Field Canvasser",
    assignedWard: "Ward 9 (Gaothan)",
    assignedBooths: ["#88"],
    srNoRange: "Sr. No. 1 - 250",
    doorstepTarget: 250,
    doorstepCompleted: 180,
    status: "Standby",
    lastPing: "34m ago",
    hasAppKey: false,
  },
  {
    id: "k-05",
    name: "Sunil K. More",
    phone: "+91 99220 88776",
    role: "Field Canvasser",
    assignedWard: "Ward 14 (Erandwane)",
    assignedBooths: ["#108"],
    srNoRange: "Sr. No. 1 - 250",
    doorstepTarget: 250,
    doorstepCompleted: 110,
    status: "Offline",
    lastPing: "2h ago",
    hasAppKey: true,
  },
];

const INITIAL_MEMBERS: MemberRequestItem[] = [
  { id: "mem-1", name: "Anand R. Kulkarni", phone: "+91 98231 00991", ward: "Ward 12", locality: "Dahanukar Colony", requestedDate: "Today, 10:30 AM", status: "PENDING" },
  { id: "mem-2", name: "Rutuja M. Deshpande", phone: "+91 97650 22114", ward: "Ward 14", locality: "Shivaji Housing Society", requestedDate: "Yesterday, 04:15 PM", status: "PENDING" },
  { id: "mem-3", name: "Sunil D. Jadhav", phone: "+91 99221 44556", ward: "Ward 9", locality: "Gaothan Ganpati Chowk", requestedDate: "03 Nov 2026", status: "APPROVED" },
];

const INITIAL_UPDATE_REQUESTS: FieldUpdateRequestItem[] = [
  {
    id: "REQ-901",
    submittedBy: "Vikas M. Jadhav",
    workerRole: "Ward Coordinator",
    voterEpic: "WXE4829102",
    voterName: "Rajesh Kumar Verma",
    booth: "Booth #101",
    changeField: "Mobile Number & Head Linkage",
    oldValue: "Phone: Unverified • Head: Self",
    newValue: "Phone: +91 98221 44001 • Head: Verified (Plot 14)",
    submittedAt: "Today, 10:15 AM",
    status: "PENDING",
  },
  {
    id: "REQ-902",
    submittedBy: "Pooja Santosh Jagtap",
    workerRole: "Booth Captain",
    voterEpic: "WXE1290384",
    voterName: "Amit Baban Shinde",
    booth: "Booth #106",
    changeField: "Welfare Scheme Tag",
    oldValue: "Scheme: None",
    newValue: "Scheme: Ayushman Bharat - PMJAY Beneficiary",
    submittedAt: "Yesterday, 03:40 PM",
    status: "PENDING",
  },
  {
    id: "REQ-903",
    submittedBy: "Ganesh P. Bhosale",
    workerRole: "Booth Captain",
    voterEpic: "WXE5544321",
    voterName: "Surendra Mohan Joshi",
    booth: "Booth #108",
    changeField: "Residential Address Correction",
    oldValue: "Bungalow 7, Deccan",
    newValue: "Flat 201, Shanti Niketan Apt, Deccan",
    submittedAt: "02 Nov 2026",
    status: "APPROVED",
  },
];

export function KaryakartaWorkforceView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"staff" | "members" | "requests">("staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [workers, setWorkers] = useState<KaryakartaItem[]>(SAMPLE_KARYAKARTAS);
  const [memberRequests, setMemberRequests] = useState<MemberRequestItem[]>(INITIAL_MEMBERS);
  const [updateRequests, setUpdateRequests] = useState<FieldUpdateRequestItem[]>(INITIAL_UPDATE_REQUESTS);

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState<KaryakartaItem["role"]>("Booth Captain");
  const [newUserWard, setNewUserWard] = useState("Ward 12 (Kothrud)");
  const [newUserBooth, setNewUserBooth] = useState("#101");
  const [newUserSrNoRange, setNewUserSrNoRange] = useState("Sr. No. 1 - 250");

  const filteredWorkers = workers.filter((k) => {
    const matchSearch =
      k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.phone.includes(searchTerm) ||
      k.assignedWard.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || k.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleIssueKey = (name: string) => {
    showToast(
      "success",
      "Activation Key Dispatched",
      `SMS dispatch key and secure login link sent to ${name}.`
    );
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPhone.trim()) return;

    const newWorker: KaryakartaItem = {
      id: `k-${Date.now()}`,
      name: newUserName.trim(),
      phone: newUserPhone.trim(),
      role: newUserRole,
      assignedWard: newUserWard,
      assignedBooths: [newUserBooth],
      srNoRange: newUserSrNoRange,
      doorstepTarget: 250,
      doorstepCompleted: 0,
      status: "Active on Field",
      lastPing: "Just now",
      hasAppKey: true,
    };

    setWorkers((prev) => [newWorker, ...prev]);
    setShowAddUserModal(false);
    setNewUserName("");
    setNewUserPhone("");

    showToast(
      "success",
      "Karyakarta Onboarded",
      `Assigned ${newWorker.name} to ${newWorker.assignedWard} (${newWorker.assignedBooths[0]}) with mobile app key.`
    );
  };

  const handleMemberApproval = (id: string, name: string, approve: boolean) => {
    setMemberRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: approve ? "APPROVED" : "REJECTED" } : m))
    );
    showToast(
      approve ? "success" : "info",
      approve ? "Member Approved" : "Registration Declined",
      `${name} has been ${approve ? "approved and sent volunteer app credentials" : "declined"}.`
    );
  };

  const handleUpdateRequestApproval = (id: string, approve: boolean) => {
    setUpdateRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: approve ? "APPROVED" : "REJECTED" } : r))
    );
    showToast(
      approve ? "success" : "info",
      approve ? "Field Data Change Approved" : "Update Request Rejected",
      `Request ${id} ${approve ? "applied to master electoral roll" : "rejected with reason logged"}.`
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 03: Workforce &amp; Team
            </span>
            <Badge variant="teal">3,120 Active on Field</Badge>
            <Badge variant="warning">{updateRequests.filter((r) => r.status === "PENDING").length} Pending Updates</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Karyakarta Workforce, Members &amp; Update Requests
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Volunteer workforce roster, serial-number booth jurisdiction assignments, member registrations, and field data change approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md" onClick={() => handleIssueKey("All Pending Workforce")}>
            <Key className="w-3.5 h-3.5" />
            <span>Bulk Key Dispatch</span>
          </Button>

          <Button variant="primary" size="md" onClick={() => setShowAddUserModal(true)}>
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard Karyakarta</span>
          </Button>
        </div>
      </section>

      {/* 4 Summary Stat Cards & Voter Slip Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Total Registered Workforce</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 tabular-nums">
            {workers.length * 970}
          </div>
          <div className="text-[11px] text-brand-600 font-medium mt-1">100% Assigned to Wards &amp; Booths</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Active Field Telemetry</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            3,120
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Live Canvassing Today</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Digital Voter Slips Generated</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">
            14,250
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">Shared via WhatsApp &amp; SMS</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Printed Slips Handed Door-to-Door</span>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            8,920
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Physical Verification Slips</div>
        </div>
      </div>

      {/* Tabs Selector Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "staff"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Workforce &amp; Staff ({workers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("members")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "members"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Members &amp; Cadre Requests ({memberRequests.filter((m) => m.status === "PENDING").length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "requests"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Field Update Requests ({updateRequests.filter((r) => r.status === "PENDING").length})</span>
            </button>
          </div>

          {activeTab === "staff" && (
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-1 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              >
                <option value="all">All Roles</option>
                <option value="Ward Coordinator">Ward Coordinator</option>
                <option value="Booth Captain">Booth Captain</option>
                <option value="Field Canvasser">Field Canvasser</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: ALL WORKFORCE & FIELD STAFF */}
        {activeTab === "staff" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Karyakarta Details</th>
                  <th className="py-3 px-4">Role &amp; Jurisdiction</th>
                  <th className="py-3 px-3">Assigned Booths &amp; Sr No.</th>
                  <th className="py-3 px-4">Doorstep Progress</th>
                  <th className="py-3 px-3">Telemetry</th>
                  <th className="py-3 px-4 text-right">Outreach Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredWorkers.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <span>{k.name}</span>
                        {k.hasAppKey && (
                          <span title="App key dispatched">
                            <Key className="w-3 h-3 text-amber-500" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{k.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-white block">{k.role}</span>
                      <span className="text-[11px] text-slate-500">{k.assignedWard}</span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {k.assignedBooths.map((b) => (
                          <span key={b} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                            {b}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">{k.srNoRange}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {k.doorstepCompleted} / {k.doorstepTarget}
                        </span>
                        <span className="font-bold text-brand-600">
                          {Math.round((k.doorstepCompleted / k.doorstepTarget) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-600 h-full rounded-full"
                          style={{ width: `${(k.doorstepCompleted / k.doorstepTarget) * 100}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          k.status === "Active on Field"
                            ? "bg-emerald-50 text-emerald-600"
                            : k.status === "Standby"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${k.status === "Active on Field" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        <span>{k.status}</span>
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{k.lastPing}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showToast("info", `Dialing ${k.name}`, `Calling ${k.phone}`)}
                          className="text-brand-600 cursor-pointer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIssueKey(k.name)}
                          className="cursor-pointer"
                        >
                          <Key className="w-3 h-3" />
                          <span>App Key</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: MEMBERS & CADRE REGISTRATION QUEUE */}
        {activeTab === "members" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Applicant Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Ward &amp; Locality</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {memberRequests.map((mem) => (
                  <tr key={mem.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">{mem.name}</td>
                    <td className="py-3 px-4 font-mono">{mem.phone}</td>
                    <td className="py-3 px-4">{mem.ward} • {mem.locality}</td>
                    <td className="py-3 px-4 text-slate-400">{mem.requestedDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mem.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" : mem.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {mem.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {mem.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleMemberApproval(mem.id, mem.name, true)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMemberApproval(mem.id, mem.name, false)}
                            className="text-rose-600 border-rose-200"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: FIELD UPDATE REQUESTS (KARYAKARTA MOBILE SUBMISSIONS) */}
        {activeTab === "requests" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Request ID &amp; Submitter</th>
                  <th className="py-3 px-4">Elector Target</th>
                  <th className="py-3 px-4">Field Attribute</th>
                  <th className="py-3 px-4">Old vs. Proposed Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Approval Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {updateRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-white">{req.id}</div>
                      <div className="text-[11px] text-slate-500">{req.submittedBy} ({req.workerRole})</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-white">{req.voterName}</div>
                      <div className="text-[10px] text-brand-600 font-mono">{req.voterEpic} • {req.booth}</div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {req.changeField}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-[11px] text-rose-600 line-through">{req.oldValue}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold">{req.newValue}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" : req.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {req.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateRequestApproval(req.id, true)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateRequestApproval(req.id, false)}
                            className="text-rose-600 border-rose-200"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD USER / ONBOARD KARYAKARTA MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-brand-600" />
                  <span>Onboard Karyakarta / Assign Jurisdiction</span>
                </h3>
                <p className="text-xs text-slate-500">Assign role, ward, booth, and voter serial number boundaries.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Ramesh V. Kadam"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone (+91) *</label>
                <input
                  type="tel"
                  required
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as KaryakartaItem["role"])}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Booth Captain">Booth Captain</option>
                    <option value="Ward Coordinator">Ward Coordinator</option>
                    <option value="Field Canvasser">Field Canvasser</option>
                    <option value="Office Operator">Office Operator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Ward *</label>
                  <select
                    value={newUserWard}
                    onChange={(e) => setNewUserWard(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Ward 12 (Kothrud)">Ward 12 (Kothrud)</option>
                    <option value="Ward 14 (Erandwane)">Ward 14 (Erandwane)</option>
                    <option value="Ward 9 (Gaothan)">Ward 9 (Gaothan)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Booth *</label>
                  <select
                    value={newUserBooth}
                    onChange={(e) => setNewUserBooth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="#101">Booth #101 (Navbharat HS)</option>
                    <option value="#102">Booth #102 (Navbharat HS)</option>
                    <option value="#106">Booth #106 (Modern HS)</option>
                    <option value="#107">Booth #107 (Ferguson)</option>
                    <option value="#108">Booth #108 (Gokhale Hall)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Elector Serial Number Range *</label>
                <input
                  type="text"
                  value={newUserSrNoRange}
                  onChange={(e) => setNewUserSrNoRange(e.target.value)}
                  placeholder="e.g. Sr. No. 1 - 250"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create &amp; Dispatch App Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
