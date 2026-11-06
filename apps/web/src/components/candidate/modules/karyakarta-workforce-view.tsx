"use client";

import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Phone,
  Key,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface KaryakartaItem {
  id: string;
  name: string;
  phone: string;
  role: "Ward Coordinator" | "Booth Captain" | "Field Canvasser";
  assignedWard: string;
  assignedBooths: string[];
  doorstepTarget: number;
  doorstepCompleted: number;
  status: "Active on Field" | "Standby" | "Offline";
  lastPing: string;
  hasAppKey: boolean;
}

const SAMPLE_KARYAKARTAS: KaryakartaItem[] = [
  {
    id: "k-01",
    name: "Vikas M. Jadhav",
    phone: "+91 98224 55441",
    role: "Ward Coordinator",
    assignedWard: "Ward 12 (Kothrud)",
    assignedBooths: ["#101", "#102", "#103", "#104"],
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
    doorstepTarget: 350,
    doorstepCompleted: 320,
    status: "Active on Field",
    lastPing: " Just now",
    hasAppKey: true,
  },
  {
    id: "k-03",
    name: "Ganesh P. Bhosale",
    phone: "+91 97654 00987",
    role: "Booth Captain",
    assignedWard: "Ward 14 (Erandwane)",
    assignedBooths: ["#106", "#107"],
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
    doorstepTarget: 250,
    doorstepCompleted: 110,
    status: "Offline",
    lastPing: "2h ago",
    hasAppKey: true,
  },
];

export function KaryakartaWorkforceView() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = SAMPLE_KARYAKARTAS.filter((k) => {
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
      `SMS dispatch key and secure login link sent to ${name}.`,
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Workforce Operations
            </span>
            <Badge variant="teal">3,120 Active on Field</Badge>
            <Badge variant="warning">18 Pending Keys</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Karyakarta Workforce &amp; Booth Captains
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Volunteer roster, assigned booth jurisdictions, doorstep survey quotas, and mobile app activation keys.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md">
            <Key className="w-3.5 h-3.5" />
            <span>Bulk Key Dispatch</span>
          </Button>

          <Button variant="primary" size="md">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard Karyakarta</span>
          </Button>
        </div>
      </section>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Total Registered Workforce</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 tabular-nums">
            4,850
          </div>
          <div className="text-[11px] text-brand-600 font-medium mt-1">100% Assigned to Wards</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Active GPS Telemetry</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            3,120
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Live Canvassing Today</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">Doorstep Survey Coverage</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 tabular-nums">
            84.2%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">42,800 Households Verified</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs">
          <span className="text-xs font-semibold text-slate-500">App Activation Rate</span>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            96.3%
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">18 Activation Keys Pending</div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search volunteer, phone, ward..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-1.5 pl-2.5 pr-6 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Ward Coordinator">Ward Coordinators</option>
              <option value="Booth Captain">Booth Captains</option>
              <option value="Field Canvasser">Field Canvassers</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                <th className="py-3 px-4">Karyakarta Details</th>
                <th className="py-3 px-4">Role &amp; Jurisdiction</th>
                <th className="py-3 px-3">Assigned Booths</th>
                <th className="py-3 px-4">Doorstep Canvassing Progress</th>
                <th className="py-3 px-3">Live Telemetry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE2EC]/60 dark:divide-[#22324F]/60 text-slate-800 dark:text-white">
              {filtered.map((item) => {
                const percent = Math.round((item.doorstepCompleted / item.doorstepTarget) * 100);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1E293B]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.hasAppKey ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0DAD9B]" title="App Key Active" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F2A93B]" title="Key Pending" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{item.role}</div>
                      <div className="text-[11px] text-slate-500">{item.assignedWard}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.assignedBooths.map((b) => (
                          <span key={b} className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 font-bold text-[10px]">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500">{item.doorstepCompleted} / {item.doorstepTarget}</span>
                        <span className="font-bold tabular-nums">{percent}%</span>
                      </div>
                      <div className="w-full bg-[#DCE2EC] dark:bg-[#22324F] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percent >= 80 ? "bg-[#0DAD9B]" : "bg-brand-600"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          item.status === "Active on Field"
                            ? "bg-emerald-50 text-emerald-600"
                            : item.status === "Standby"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Active on Field"
                              ? "bg-[#0DAD9B] animate-pulse"
                              : item.status === "Standby"
                              ? "bg-[#F2A93B]"
                              : "bg-[#667085]"
                          }`}
                        />
                        <span>{item.status}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{item.lastPing}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!item.hasAppKey && (
                          <button
                            type="button"
                            onClick={() => handleIssueKey(item.name)}
                            className="px-2 py-1 rounded bg-amber-50 text-amber-600 font-semibold text-[11px] hover:bg-[#F2A93B] hover:text-white transition-colors cursor-pointer"
                          >
                            Send Key
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              "info",
                              "Direct Telephony Dial",
                              `Dialing ${item.name} (${item.phone})...`,
                            )
                          }
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-500 hover:text-brand-600"
                          title="Call volunteer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
