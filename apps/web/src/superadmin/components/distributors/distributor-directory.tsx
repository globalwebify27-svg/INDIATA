"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  RefreshCw,
  Search,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";
import { DistributorRecord, DistributorRequestItem } from "../../types/superadmin.types";
import { SettlementBatch } from "@/app/api/superadmin/store";

export function DistributorDirectory() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"network" | "requests" | "settlements">("network");
  const [distributors, setDistributors] = useState<DistributorRecord[]>([]);
  const [requests, setRequests] = useState<DistributorRequestItem[]>([]);
  const [settlements, setSettlements] = useState<SettlementBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [distRes, reqRes, settleRes] = await Promise.all([
        superAdminApi.getDistributors(),
        superAdminApi.getDistributorRequests(),
        superAdminApi.getSettlements(),
      ]);
      if (distRes.success) setDistributors(distRes.data);
      if (reqRes.success) setRequests(reqRes.data);
      if (settleRes.success) setSettlements(settleRes.data);
    } catch {
      toast("Failed to load distributor data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await superAdminApi.toggleDistributorStatus(id);
      if (res.success) {
        toast(`Franchise partner status updated to ${res.data.status}.`, "success");
        loadData();
      }
    } catch {
      toast("Status update failed.", "error");
    }
  };

  const handleRequestAction = async (id: string, action: "approve" | "decline") => {
    try {
      const res = await superAdminApi.handleDistributorRequest(id, action);
      if (res.success) {
        toast(`Partner application ${action === "approve" ? "Approved & Onboarded" : "Declined"}.`, "success");
        loadData();
      }
    } catch {
      toast("Action failed.", "error");
    }
  };

  const handleVerifySettlement = async (id: string) => {
    try {
      const res = await superAdminApi.verifySettlement(id);
      if (res.success) {
        toast("Settlement batch verified for disbursement.", "success");
        loadData();
      }
    } catch {
      toast("Verification failed.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#2087FE]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Distributor Franchise Partners &amp; Commercial Settlements
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Regional franchise network governance, incoming partner applications, and commission settlement verification.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("network")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "network"
                ? "bg-white dark:bg-slate-900 text-[#2087FE] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Active Network ({distributors.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "requests"
                ? "bg-white dark:bg-slate-900 text-[#2087FE] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Applications ({requests.filter((r) => r.status === "Pending").length})
          </button>
          <button
            onClick={() => setActiveTab("settlements")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "settlements"
                ? "bg-white dark:bg-slate-900 text-[#2087FE] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Settlements (₹4.8L)
          </button>
        </div>
      </div>

      {/* Filter and Refresh Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search franchise by name, city, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
          />
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Network Tab */}
      {activeTab === "network" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Franchise Agency</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Territory / City</th>
                <th className="p-4">Candidates Onboarded</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">License Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {distributors
                .filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.city.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((dist) => (
                  <tr key={dist.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {dist.name}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[#2087FE] font-bold">
                          {dist.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Reg: {dist.registeredDate}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{dist.contactPerson}</div>
                      <div className="text-[11px] text-slate-400">{dist.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{dist.city}</div>
                      <div className="text-[11px] text-slate-400">{dist.state}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{dist.candidateCount}</span>
                      <span className="text-slate-400 ml-1 text-[11px]">War Rooms</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dist.status === "ACTIVE"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {dist.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(dist.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          dist.status === "ACTIVE"
                            ? "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                            : "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {dist.status === "ACTIVE" ? "Suspend License" : "Restore Active"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "requests" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Agency Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Proposed Territory</th>
                <th className="p-4">Submitted At</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Clearance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{req.agencyName}</td>
                  <td className="p-4">
                    <div>{req.contactPerson}</div>
                    <div className="text-[11px] text-slate-400">{req.phone} • {req.email}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{req.proposedTerritory}</td>
                  <td className="p-4 text-[11px] text-slate-500">{req.submittedAt}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : req.status === "Declined"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {req.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRequestAction(req.id, "approve")}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white transition shadow-xs"
                        >
                          Approve Partner
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, "decline")}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Settlements Tab */}
      {activeTab === "settlements" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Pending Franchise Payouts</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹4,80,000</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">3 batches ready for verification</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Verified This Cycle</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                ₹{settlements.filter((s) => s.status === "Verified").length > 0 ? "2,40,000" : "0"}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Bank direct remittance route</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Commission Margin Rules</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-1">15% Standard / 18% Platinum</div>
              <p className="text-[11px] text-slate-400 mt-1">Automated revenue share ledger</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Batch ID</th>
                  <th className="p-4">Distributor Partner</th>
                  <th className="p-4">Settlement Period</th>
                  <th className="p-4">Mapped Candidates</th>
                  <th className="p-4">Payout Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Audit &amp; Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {settlements.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{batch.id}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{batch.distributorName}</td>
                    <td className="p-4 text-slate-500">{batch.batchPeriod}</td>
                    <td className="p-4 font-semibold">{batch.candidatesCount} War Rooms</td>
                    <td className="p-4 font-black text-sm text-[#2087FE]">{batch.amount}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          batch.status === "Verified"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {batch.status !== "Verified" ? (
                        <button
                          onClick={() => handleVerifySettlement(batch.id)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white transition shadow-xs"
                        >
                          Verify Settlement
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold">✓ Verified &amp; Queued</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
