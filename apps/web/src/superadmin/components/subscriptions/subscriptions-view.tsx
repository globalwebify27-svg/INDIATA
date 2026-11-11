"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Key,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";
import { LicenseRecord } from "@/app/api/superadmin/store";

export function SubscriptionsView() {
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenModal, setShowGenModal] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newPlanName, setNewPlanName] = useState("Vidhan Sabha Enterprise (12M)");
  const [newAmount, setNewAmount] = useState("₹2,50,000");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getSubscriptions();
      if (res.success) setLicenses(res.data);
    } catch {
      toast("Failed to load subscription licenses.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim()) {
      toast("Please enter a candidate name.", "warning");
      return;
    }
    try {
      const res = await superAdminApi.generateLicense(newCandidateName, newPlanName, newAmount);
      if (res.success) {
        toast(`Generated license key: ${res.data.licenseKey}`, "success");
        setShowGenModal(false);
        setNewCandidateName("");
        loadData();
      }
    } catch {
      toast("License generation failed.", "error");
    }
  };

  const filteredLicenses = licenses.filter(
    (l) =>
      l.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.licenseKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#2087FE]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Subscriptions, Licensing Governance &amp; Revenue Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official cryptographic election license issuance, renewal alerts, and quota entitlement verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGenModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Generate License Key</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tier Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Active War Room Licenses</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {licenses.filter((l) => l.status === "Active").length} Paid
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">92% retention this general election cycle</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Expiring Within 30 Days</div>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {licenses.filter((l) => l.status === "Expiring Soon").length} Accounts
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Automatic renewal dispatched to campaign leads</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Public Pricing Mode</div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">Visible on Landing Page</div>
          <p className="text-[11px] text-[#2087FE] font-medium mt-1">Standardized transparent electoral rates</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-sm w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by license key, candidate, plan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
        />
      </div>

      {/* Licenses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">License Key</th>
              <th className="p-4">Candidate / Campaign</th>
              <th className="p-4">Subscription Plan</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Issued Date</th>
              <th className="p-4">Expires At</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLicenses.map((lic) => (
              <tr key={lic.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <td className="p-4">
                  <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#2087FE]" />
                    {lic.licenseKey}
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{lic.candidateName}</td>
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{lic.planName}</td>
                <td className="p-4 font-black text-slate-900 dark:text-white">{lic.amount}</td>
                <td className="p-4 text-slate-500">{lic.issuedDate}</td>
                <td className="p-4 text-slate-500">{lic.expiresAt}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lic.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {lic.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Generate License Key */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-[#2087FE]" />
              Generate Official License Key
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Issue a cryptographically signed tenant license key for candidate activation.
            </p>

            <form onSubmit={handleGenerate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g. Adv. Ganesh V. Narvekar"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Plan Tier</label>
                <select
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                >
                  <option value="Vidhan Sabha Enterprise (12M)">Vidhan Sabha Enterprise (12M)</option>
                  <option value="Lok Sabha Supreme (Full Cadence)">Lok Sabha Supreme (Full Cadence)</option>
                  <option value="Municipal Corporation Gold (6M)">Municipal Corporation Gold (6M)</option>
                  <option value="Zilla Parishad Standard (6M)">Zilla Parishad Standard (6M)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contract Amount</label>
                <input
                  type="text"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold shadow-xs"
                >
                  Issue License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
