"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Server,
  ShieldCheck,
  Database,
  RefreshCw,
  Save,
  Users,
  ShieldAlert,
  Smartphone,
  Briefcase,
  Bell,
  Sliders,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";
import {
  RolePortalSettingsConfig,
  NotificationDeliveryConfig,
  NotificationTemplateConfig,
} from "../../types/superadmin.types";
import {
  MOCK_ROLE_SETTINGS,
  MOCK_NOTIFICATION_DELIVERY_CONFIG,
  MOCK_NOTIFICATION_TEMPLATES,
} from "../../data/mock-superadmin-data";
import { NotificationManagementPanel } from "./notification-management-panel";

type SettingsSubTab = "global" | "roles" | "notifications";

export function PlatformSettingsView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsSubTab>("global");
  const [settings, setSettings] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [roleSettings, setRoleSettings] = useState<RolePortalSettingsConfig>(MOCK_ROLE_SETTINGS);
  const [deliveryConfig, setDeliveryConfig] = useState<NotificationDeliveryConfig>(MOCK_NOTIFICATION_DELIVERY_CONFIG);
  const [templates, setTemplates] = useState<NotificationTemplateConfig[]>(MOCK_NOTIFICATION_TEMPLATES);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getSettings();
      if (res.success) {
        setSettings(res.data.settings);
        setTelemetry(res.data.telemetry);
        if (res.data.settings.roleSettings) {
          setRoleSettings(res.data.settings.roleSettings);
        }
        if (res.data.settings.notificationDelivery) {
          setDeliveryConfig(res.data.settings.notificationDelivery);
        }
        if (res.data.settings.notificationTemplates) {
          setTemplates(res.data.settings.notificationTemplates);
        }
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

  // Save Global Platform SLA & Cluster parameters
  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await superAdminApi.updateSettings({
        generalElectionCadence: settings.generalElectionCadence,
        highAvailabilityReplicas: settings.highAvailabilityReplicas,
        pricingPublic: settings.pricingPublic,
        maintenanceMode: settings.maintenanceMode,
      });
      if (res.success) {
        toast("Global cluster SLA & platform parameters updated.", "success");
        loadData();
      }
    } catch {
      toast("Failed to save global settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Save Granular Multi-Role & Cross-Portal Configuration Matrix
  const handleSaveRoleSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await superAdminApi.updateSettings({
        roleSettings,
      });
      if (res.success) {
        toast("Multi-role governance and portal policies saved.", "success");
        loadData();
      }
    } catch {
      toast("Failed to save role settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Save Notification Delivery Frequency & Throttle Config
  const handleSaveDeliveryConfig = async (newConfig: NotificationDeliveryConfig) => {
    setSaving(true);
    try {
      const res = await superAdminApi.updateSettings({
        notificationDelivery: newConfig,
      });
      if (res.success) {
        setDeliveryConfig(newConfig);
        toast("Notification delivery frequency & rate caps saved.", "success");
      }
    } catch {
      toast("Failed to save delivery frequency.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Save Notification Templates & Redirection Routes
  const handleSaveTemplates = async (newTemplates: NotificationTemplateConfig[]) => {
    setSaving(true);
    try {
      const res = await superAdminApi.updateSettings({
        notificationTemplates: newTemplates,
      });
      if (res.success) {
        setTemplates(newTemplates);
        toast("Notification templates and redirection deep-links saved.", "success");
      }
    } catch {
      toast("Failed to save notification templates.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#2087FE]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              System Configuration &amp; Governance Center
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2087FE]/10 text-[#2087FE] border border-[#2087FE]/20">
              <Sliders className="w-3.5 h-3.5" />
              42 Total System Settings Configured
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global election cadence deployment, multi-role granular policies, notification delivery engine, and deep-link routing.
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

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("global")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "global"
              ? "bg-[#2087FE] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Global SLA &amp; Cluster Health</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
              activeTab === "global"
                ? "bg-white/20 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            4
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "roles"
              ? "bg-[#2087FE] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Multi-Role &amp; Portal Policies</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
              activeTab === "roles"
                ? "bg-white/20 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            25
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "notifications"
              ? "bg-[#2087FE] text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notification &amp; Redirection Management</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
              activeTab === "notifications"
                ? "bg-white/20 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            13
          </span>
        </button>
      </div>

      {/* TAB 1: GLOBAL PLATFORM & CLUSTER SLA */}
      {activeTab === "global" && (
        <div className="space-y-6 animate-in fade-in duration-150">
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
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {telemetry.apiLatencyMs} ms
                </div>
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
            <form onSubmit={handleSaveGlobal} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
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
      )}

      {/* TAB 2: MULTI-ROLE & CROSS-PORTAL CONFIGURATION MATRIX */}
      {activeTab === "roles" && (
        <form onSubmit={handleSaveRoleSettings} className="space-y-6 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
            <Sliders className="w-5 h-5 text-[#2087FE] mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-[#010627] dark:text-blue-200">
                Granular Role &amp; Portal Policy Matrix
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                Super Admin command policies governing session lifetimes, data export permissions, geospatial tracking tolerances, and citizen privacy across all 5 operational platforms.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. SUPER ADMIN ROLE & GOVERNANCE */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Super Admin Console Security
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                  Tier L9 Superuser
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Inactivity Session Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={480}
                    value={roleSettings.superAdmin.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        superAdmin: { ...roleSettings.superAdmin, sessionTimeoutMinutes: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Audit Trail Retention Horizon (Days)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={1825}
                    value={roleSettings.superAdmin.auditRetentionDays}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        superAdmin: { ...roleSettings.superAdmin, auditRetentionDays: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Enforce Hardware / Authenticator Strict 2FA
                  </span>
                  <input
                    type="checkbox"
                    checked={roleSettings.superAdmin.enforceStrict2FA}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        superAdmin: { ...roleSettings.superAdmin, enforceStrict2FA: e.target.checked },
                      })
                    }
                    className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Emergency Admin Lockdown (Write Freeze)
                  </span>
                  <input
                    type="checkbox"
                    checked={roleSettings.superAdmin.emergencyLockdown}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        superAdmin: { ...roleSettings.superAdmin, emergencyLockdown: e.target.checked },
                      })
                    }
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. CANDIDATE WAR ROOM PORTAL & ROLE */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#2087FE]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Candidate War Room Governance
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  Candidate Admin
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Max Sub-Users / Booth Agents
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={roleSettings.candidate.maxSubUsersLimit}
                      onChange={(e) =>
                        setRoleSettings({
                          ...roleSettings,
                          candidate: { ...roleSettings.candidate, maxSubUsersLimit: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Daily AI Copilot Query Limit
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      value={roleSettings.candidate.aiCopilotDailyPromptLimit}
                      onChange={(e) =>
                        setRoleSettings({
                          ...roleSettings,
                          candidate: { ...roleSettings.candidate, aiCopilotDailyPromptLimit: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                    />
                  </div>
                </div>

                {/* Data Export Permissions */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                    Candidate Elector Data Export Privileges
                  </span>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span>Voter Roll CSV Download</span>
                    <input
                      type="checkbox"
                      checked={roleSettings.candidate.allowVoterRollCsvExport}
                      onChange={(e) =>
                        setRoleSettings({
                          ...roleSettings,
                          candidate: { ...roleSettings.candidate, allowVoterRollCsvExport: e.target.checked },
                        })
                      }
                      className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Voter Roll Excel (.xlsx) Download</span>
                    <input
                      type="checkbox"
                      checked={roleSettings.candidate.allowVoterRollExcelExport}
                      onChange={(e) =>
                        setRoleSettings({
                          ...roleSettings,
                          candidate: { ...roleSettings.candidate, allowVoterRollExcelExport: e.target.checked },
                        })
                      }
                      className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Voter Slip PDF Generation &amp; Print</span>
                    <input
                      type="checkbox"
                      checked={roleSettings.candidate.allowVoterRollPdfExport}
                      onChange={(e) =>
                        setRoleSettings({
                          ...roleSettings,
                          candidate: { ...roleSettings.candidate, allowVoterRollPdfExport: e.target.checked },
                        })
                      }
                      className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. FIELD WORKER (KARYAKARTA) APP & PORTAL */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Field Worker (Karyakarta) App Policies
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  Mobile Cadre
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      GPS Geofence Radius (Meters)
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={5000}
                      step={50}
                      value={roleSettings.karyakarta.gpsGeofenceRadiusMeters}
                      onChange={(e) =>
                        setRoleSettings({
                          ...roleSettings,
                          karyakarta: { ...roleSettings.karyakarta, gpsGeofenceRadiusMeters: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Offline SQLite Sync (Minutes)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={roleSettings.karyakarta.offlineSyncFrequencyMinutes}
                      onChange={(e) =>
                        setRoleSettings({
                          ...roleSettings,
                          karyakarta: { ...roleSettings.karyakarta, offlineSyncFrequencyMinutes: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Direct Sentiment Reclassification
                    </span>
                    <p className="text-[10.5px] text-slate-500">
                      Allows field worker to update voter classification without supervisor approval.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={roleSettings.karyakarta.allowDirectSentimentEdit}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        karyakarta: { ...roleSettings.karyakarta, allowDirectSentimentEdit: e.target.checked },
                      })
                    }
                    className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Bluetooth 58mm Thermal Slip Printing Permission
                  </span>
                  <input
                    type="checkbox"
                    checked={roleSettings.karyakarta.bluetoothThermalPrintingEnabled}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        karyakarta: { ...roleSettings.karyakarta, bluetoothThermalPrintingEnabled: e.target.checked },
                      })
                    }
                    className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                  />
                </div>
              </div>
            </div>

            {/* 4. DISTRIBUTOR & CITIZEN PORTAL POLICIES */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Distributor &amp; Citizen Privacy Policies
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  Franchise &amp; Public
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Show Franchise Commission Tiers
                    </span>
                    <p className="text-[10.5px] text-slate-500">
                      Displays revenue share percentages directly in distributor partner dashboard.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={roleSettings.distributor.showCommissionTiers}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        distributor: { ...roleSettings.distributor, showCommissionTiers: e.target.checked },
                      })
                    }
                    className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Enforce Citizen Search CAPTCHA
                    </span>
                    <p className="text-[10.5px] text-slate-500">
                      Protects public voter roll lookups against automated scraping scripts.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={roleSettings.citizen.enforceSearchCaptcha}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        citizen: { ...roleSettings.citizen, enforceSearchCaptcha: e.target.checked },
                      })
                    }
                    className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Mask Citizen Phone Number Digits
                    </span>
                    <p className="text-[10.5px] text-slate-500">
                      Replaces middle 6 digits (+91 98*** **234) on public search results.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={roleSettings.citizen.maskPhoneNumberDigits}
                    onChange={(e) =>
                      setRoleSettings({
                        ...roleSettings,
                        citizen: { ...roleSettings.citizen, maskPhoneNumberDigits: e.target.checked },
                      })
                    }
                    className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs transition shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Policies..." : "Save Multi-Role & Portal Policies"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: NOTIFICATION & REDIRECTION MANAGEMENT ENGINE */}
      {activeTab === "notifications" && (
        <div className="animate-in fade-in duration-150">
          <NotificationManagementPanel
            deliveryConfig={deliveryConfig}
            templates={templates}
            onSaveDeliveryConfig={handleSaveDeliveryConfig}
            onSaveTemplates={handleSaveTemplates}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
}
