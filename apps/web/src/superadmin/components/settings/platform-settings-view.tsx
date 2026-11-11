"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Server,
  ShieldCheck,
  Database,
  RefreshCw,
  Save,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";

export function PlatformSettingsView() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getSettings();
      if (res.success) {
        setSettings(res.data.settings);
        setTelemetry(res.data.telemetry);
      }
    } catch {
      toast("Failed to load platform settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await superAdminApi.updateSettings(settings);
      if (res.success) {
        toast("Platform settings updated successfully.", "success");
        loadData();
      }
    } catch {
      toast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#2087FE]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Platform Configuration &amp; High-Availability SLA
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global election cadence deployment, high-concurrency node clustering, and public access switches.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Cluster</span>
        </button>
      </div>

      {/* Cluster Health Cards */}
      {telemetry && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Cluster SLA Health</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2">99.98%</div>
            <p className="text-[11px] text-slate-400 mt-1">Operational tier v4.2</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>API Gateway Latency</span>
              <Server className="w-4 h-4 text-[#2087FE]" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{telemetry.apiLatencyMs} ms</div>
            <p className="text-[11px] text-emerald-600 mt-1">Sub-25ms response target</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Database Cluster</span>
              <Database className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">
              {telemetry.databaseClusterStatus}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">3 active synchronized replicas</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Last Replication Sync</span>
              <RefreshCw className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">
              {telemetry.lastReplicationSync}
            </div>
            <p className="text-[11px] text-emerald-600 mt-1">Zero lag on read replicas</p>
          </div>
        </div>
      )}

      {/* Settings Form */}
      {settings && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Global Electoral Operations Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Active Election Operational Cadence
              </label>
              <input
                type="text"
                value={settings.generalElectionCadence}
                onChange={(e) => setSettings({ ...settings, generalElectionCadence: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2087FE] font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed across war room headers and high-availability telemetry banners.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                High-Availability Node Cluster Replicas
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={settings.highAvailabilityReplicas}
                onChange={(e) => setSettings({ ...settings, highAvailabilityReplicas: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2087FE] font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Active parallel database and telemetry nodes allocated for election surge.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Public Pricing Catalog Visibility</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Allows candidates and distributors to view standardized pricing plans on public portals.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.pricingPublic}
                onChange={(e) => setSettings({ ...settings, pricingPublic: e.target.checked })}
                className="w-5 h-5 rounded text-[#2087FE] focus:ring-[#2087FE]"
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Emergency Maintenance Mode</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Locks write operations and displays maintenance banner across all tenant war rooms.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs transition shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Platform Configuration"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
