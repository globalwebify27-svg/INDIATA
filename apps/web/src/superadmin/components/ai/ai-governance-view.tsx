"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  ShieldAlert,
  Cpu,
  Zap,
  RefreshCw,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";
import { AiTenantUsage } from "@/app/api/superadmin/store";

export function AiGovernanceView() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getAiGovernance();
      if (res.success) {
        setStats(res.data);
      }
    } catch {
      toast("Failed to load AI Governance telemetry.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustSeats = async (id: string, additionalSeats: number) => {
    try {
      const res = await superAdminApi.updateAiQuota(id, additionalSeats);
      if (res.success) {
        toast(`Allocated +${additionalSeats} AI seats to ${res.data.candidateName}.`, "success");
        loadData();
      }
    } catch {
      toast("Failed to update AI seats.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#2087FE]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Engine Governance &amp; Multi-Tenant Seat Allocation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time LLM token consumption, voter sentiment analysis inference metrics, and safety guardrails.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync LLM Telemetry</span>
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Monthly Tokens Consumed</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {stats.totalTokensConsumed}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Gemini 2.0 Pro Inference</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Sentiment Queries</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {stats.totalQueriesProcessed.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Voter issue NLP categorization</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Allocated AI Seats</span>
              <Cpu className="w-4 h-4 text-[#2087FE]" />
            </div>
            <div className="text-2xl font-black text-[#2087FE] mt-2">
              {stats.activeSeats} Seats
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Active war room researchers</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Safety Violations Blocked</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600 mt-2">
              {stats.safetyFiltersTriggered} Filtered
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">100% Guardrail enforcement</div>
          </div>
        </div>
      )}

      {/* Tenant AI Allocation Table */}
      {stats?.tenants && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Candidate War Room AI Resource Allocations
            </h3>
          </div>
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Candidate &amp; War Room</th>
                <th className="p-4">Election Category</th>
                <th className="p-4">Seats Allocated</th>
                <th className="p-4">Token Usage / Cap</th>
                <th className="p-4">Sentiment Queries</th>
                <th className="p-4">Health Status</th>
                <th className="p-4 text-right">Quota Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.tenants.map((t: AiTenantUsage) => {
                const pct = ((t.tokensThisMonth / t.tokenCap) * 100).toFixed(0);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{t.candidateName}</div>
                      <div className="text-[11px] text-slate-400">{t.warRoom}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{t.electionType}</td>
                    <td className="p-4">
                      <span className="font-extrabold text-sm text-[#2087FE]">{t.seatsUsed}</span>
                      <span className="text-slate-400"> / {t.seatsAllocated} Seats</span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {(t.tokensThisMonth / 1000000).toFixed(2)}M / {(t.tokenCap / 1000000).toFixed(0)}M
                      </div>
                      <div className="w-32 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            Number(pct) > 90 ? "bg-rose-500" : Number(pct) > 75 ? "bg-amber-500" : "bg-[#2087FE]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {t.sentimentQueries.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === "Healthy"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAdjustSeats(t.id, 2)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white transition shadow-xs"
                        >
                          +2 Seats
                        </button>
                        <button
                          onClick={() => handleAdjustSeats(t.id, 5)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        >
                          +5 Seats
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
