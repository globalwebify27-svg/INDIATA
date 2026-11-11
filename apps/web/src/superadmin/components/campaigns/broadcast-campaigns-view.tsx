"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Radio,
  Send,
  ShieldCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";
import { CampaignRecord } from "@/app/api/superadmin/store";

export function BroadcastCampaignsView() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getCampaigns();
      if (res.success) {
        setCampaigns(res.data.campaigns);
        setTelemetry(res.data.telemetry);
      }
    } catch {
      toast("Failed to load campaigns telemetry.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#2087FE]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Multi-Tenant Broadcast Campaigns &amp; Carrier Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time delivery status, DLT template verification, and message carrier pool health across candidate war rooms.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Gateway</span>
        </button>
      </div>

      {/* Gateway Telemetry Cards */}
      {telemetry && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Total Dispatched</span>
              <Send className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {telemetry.totalRecipients.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              ✓ {telemetry.totalDelivered.toLocaleString()} Delivered ({telemetry.deliveryRatePct}%)
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Gateway Throughput</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {telemetry.throughputMsgSec} msg/s
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Multi-carrier pooled relay</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">DLT Compliance Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2">
              {telemetry.dltCompliancePct}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">TRAI verified template headers</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Carrier Gateway Pools</span>
              <Radio className="w-4 h-4 text-[#2087FE]" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">3 Routes</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">All routes operational</div>
          </div>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recent Multi-Tenant Broadcast Dispatches
          </h3>
          <span className="text-xs text-slate-400">{campaigns.length} Active Records</span>
        </div>
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Candidate &amp; War Room</th>
              <th className="p-4">Campaign Title</th>
              <th className="p-4">Channel</th>
              <th className="p-4">Recipients</th>
              <th className="p-4">Delivery Rate</th>
              <th className="p-4">DLT Template</th>
              <th className="p-4">Dispatched</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {campaigns.map((c) => {
              const pct = ((c.deliveredCount / c.recipientsCount) * 100).toFixed(1);
              return (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{c.candidateName}</div>
                    <div className="text-[11px] text-slate-400">{c.warRoom}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs">{c.title}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.channel === "WhatsApp"
                          ? "bg-emerald-100 text-emerald-700"
                          : c.channel === "SMS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {c.channel}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{c.recipientsCount.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="font-bold text-emerald-600">{pct}%</div>
                    <div className="text-[10px] text-slate-400">
                      {c.deliveredCount.toLocaleString()} / {c.recipientsCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[10px] text-slate-500">{c.dltTemplateId}</td>
                  <td className="p-4 text-[11px] text-slate-500">{c.dispatchedAt}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : c.status === "Processing"
                          ? "bg-amber-100 text-amber-700 animate-pulse"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
