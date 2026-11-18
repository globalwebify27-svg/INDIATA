"use client";

import React, { useState } from "react";
import {
  Bell,
  Clock,
  Send,
  MessageSquare,
  Smartphone,
  Mail,
  ExternalLink,
  Save,
  Play,
  Sparkles,
} from "lucide-react";
import {
  NotificationDeliveryConfig,
  NotificationTemplateConfig,
  NotificationFrequency,
  TargetPortalType,
} from "../../types/superadmin.types";

interface NotificationManagementPanelProps {
  deliveryConfig: NotificationDeliveryConfig;
  templates: NotificationTemplateConfig[];
  onSaveDeliveryConfig: (config: NotificationDeliveryConfig) => Promise<void>;
  onSaveTemplates: (templates: NotificationTemplateConfig[]) => Promise<void>;
  saving: boolean;
}

const FREQUENCY_OPTIONS: { value: NotificationFrequency; label: string; desc: string }[] = [
  { value: "REAL_TIME", label: "Real-Time (Instant)", desc: "Immediate push & SMS dispatch upon trigger event" },
  { value: "HOURLY_DIGEST", label: "Hourly Digest", desc: "Batched and dispatched at the top of each hour" },
  { value: "DAILY_SUMMARY", label: "Daily Summary", desc: "Consolidated morning (08:00) & evening (20:00) briefs" },
  { value: "WEEKLY_BRIEF", label: "Weekly Brief", desc: "Aggregated campaign intelligence report every Monday" },
  { value: "MUTED", label: "Muted / Paused", desc: "Temporarily suppress dispatch across all channels" },
];

const TARGET_PORTALS: { value: TargetPortalType; label: string; defaultRoute: string }[] = [
  { value: "CANDIDATE", label: "Candidate War Room Portal", defaultRoute: "/candidate" },
  { value: "KARYAKARTA", label: "Field Worker (Karyakarta) App", defaultRoute: "/karyakarta/dashboard" },
  { value: "DISTRIBUTOR", label: "Distributor Partner Portal", defaultRoute: "/distributor" },
  { value: "SUPER_ADMIN", label: "Super Admin Command Console", defaultRoute: "/super-admin" },
  { value: "CITIZEN", label: "Public Voter Information Slip Portal", defaultRoute: "/voter-slip" },
];

export function NotificationManagementPanel({
  deliveryConfig: initialDelivery,
  templates: initialTemplates,
  onSaveDeliveryConfig,
  onSaveTemplates,
  saving,
}: NotificationManagementPanelProps) {
  const [delivery, setDelivery] = useState<NotificationDeliveryConfig>(initialDelivery);
  const [templates, setTemplates] = useState<NotificationTemplateConfig[]>(initialTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeTemplateId, setActiveTemplateId] = useState<string>(initialTemplates[0]?.id || "");
  const [testSimulatorOpen, setTestSimulatorOpen] = useState(false);
  const [simulatedOutput, setSimulatedOutput] = useState<{ subject: string; body: string; url: string } | null>(null);

  const activeTemplate = templates.find((t) => t.id === activeTemplateId) || templates[0];

  const handleUpdateActiveTemplate = (partial: Partial<NotificationTemplateConfig>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === activeTemplateId ? { ...t, ...partial } : t))
    );
  };

  const handleUpdateRedirection = (partial: Partial<NotificationTemplateConfig["redirection"]>) => {
    if (!activeTemplate) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === activeTemplateId
          ? { ...t, redirection: { ...t.redirection, ...partial } }
          : t
      )
    );
  };

  const handleInsertTag = (tag: string) => {
    if (!activeTemplate) return;
    const updatedBody = activeTemplate.templateBody + " " + tag;
    handleUpdateActiveTemplate({ templateBody: updatedBody });
  };

  const handleSimulateDispatch = () => {
    if (!activeTemplate) return;
    const sampleValues: Record<string, string> = {
      "{candidate_name}": "Adv. Vikram Patil",
      "{constituency}": "215 - Kasba Peth Assembly",
      "{election_type}": "Vidhan Sabha 2026",
      "{war_room_url}": "https://indiata.gov.in/candidate",
      "{login_id}": "vikram.patil@indiata.in",
      "{quota_percentage}": "89.4",
      "{quota_used}": "44,700",
      "{quota_allowed}": "50,000",
      "{expiry_date}": "15 Dec 2026",
      "{swing_count}": "48",
      "{booth_no}": "101",
      "{station_name}": "Shaniwar Peth Central School",
      "{sector_name}": "Prabhaag 18",
      "{worker_name}": "Sachin D. Mane",
      "{activation_key}": "K9X2B7",
      "{phone}": "+91 98221 00001",
      "{expiry_hours}": "24",
      "{distributor_name}": "MahaMedia Political Solutions",
      "{settlement_amount}": "4,80,000",
      "{settlement_id}": "SET-2026-NOV-01",
      "{candidate_count}": "12",
      "{username}": "admin@indiata.gov.in",
      "{ip_address}": "103.44.120.89",
      "{location}": "Pune Central, MH",
      "{failed_attempts}": "3",
      "{timestamp}": "18 Nov 2026, 17:45 IST",
      "{voter_name}": "Rajesh Vithal Patil",
      "{polling_station}": "Municipal Boys School Room 1",
      "{serial_no}": "101",
      "{slip_url}": "https://indiata.gov.in/slip/v-01",
    };

    let subject = activeTemplate.templateSubject;
    let body = activeTemplate.templateBody;

    Object.entries(sampleValues).forEach(([tag, val]) => {
      subject = subject.replaceAll(tag, val);
      body = body.replaceAll(tag, val);
    });

    const route = activeTemplate.redirection.routePath;
    const params = activeTemplate.redirection.passParameters ? "?src=notif&ref=" + activeTemplate.id : "";
    const fullUrl = `https://indiata.gov.in${route}${params}`;

    setSimulatedOutput({ subject, body, url: fullUrl });
    setTestSimulatorOpen(true);
  };

  const filteredTemplates = templates.filter((t) => {
    if (selectedCategory === "ALL") return true;
    return t.category.toUpperCase() === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* SECTION 1: GLOBAL NOTIFICATION DELIVERY FREQUENCY & THROTTLE CONTROLS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2087FE]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Notification Delivery Frequency &amp; Rate Controls
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure platform-wide cadence, hourly carrier rate limits, and quiet-hour scheduling across all election portals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              DLT &amp; Gateway Active
            </span>
          </div>
        </div>

        {/* Global Delivery Frequency Radio Cards */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Default Delivery Frequency Cadence
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {FREQUENCY_OPTIONS.map((opt) => {
              const isSelected = delivery.globalFrequency === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => setDelivery({ ...delivery, globalFrequency: opt.value })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#2087FE] bg-[#2087FE]/5 dark:bg-[#2087FE]/10 ring-2 ring-[#2087FE]/30"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</span>
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setDelivery({ ...delivery, globalFrequency: opt.value })}
                      className="text-[#2087FE] focus:ring-[#2087FE]"
                    />
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                    {opt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiet Hours & Channel Rate Limits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Quiet Hours Policy */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Quiet Hours Suppression</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Suppress non-critical SMS, push, and audio alerts to candidate cadres during rest hours.
                </p>
              </div>
              <input
                type="checkbox"
                checked={delivery.quietHoursEnabled}
                onChange={(e) => setDelivery({ ...delivery, quietHoursEnabled: e.target.checked })}
                className="w-5 h-5 rounded text-[#2087FE] focus:ring-[#2087FE]"
              />
            </div>

            {delivery.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Quiet Hours Start Time
                  </label>
                  <input
                    type="time"
                    value={delivery.quietHoursStart}
                    onChange={(e) => setDelivery({ ...delivery, quietHoursStart: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Quiet Hours End Time
                  </label>
                  <input
                    type="time"
                    value={delivery.quietHoursEnd}
                    onChange={(e) => setDelivery({ ...delivery, quietHoursEnd: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Granular Throttle & Rate Caps */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Channel Hourly Surge &amp; Rate Caps
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                  Max SMS / Hr
                </label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={delivery.maxSmsPerHour}
                  onChange={(e) => setDelivery({ ...delivery, maxSmsPerHour: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                  Max WhatsApp / Day
                </label>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={delivery.maxWhatsAppPerDay}
                  onChange={(e) => setDelivery({ ...delivery, maxWhatsAppPerDay: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                  Max Push / Hr
                </label>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={delivery.maxPushPerHour}
                  onChange={(e) => setDelivery({ ...delivery, maxPushPerHour: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Guards against carrier rate-limiting and telecom DLT spam penalties.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => onSaveDeliveryConfig(delivery)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs transition shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Delivery Cadence & Rate Caps"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: TEMPLATE CUSTOMIZATION & REDIRECTION DEEP-LINK ENGINE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Notification Template Customization &amp; Redirection Engine
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customize subject and message copy for each alert type, enable multi-channel delivery, and configure deep-link routing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSimulateDispatch}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Simulate &amp; Preview</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {["ALL", "CANDIDATE", "OPERATIONS", "VOTERS", "DISTRIBUTOR", "SECURITY", "BILLING"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#2087FE] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Two-Column Editor Layout: Template Selector (Left) & Granular Editor (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Template Selector List */}
          <div className="lg:col-span-4 space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredTemplates.map((item) => {
              const isSelected = item.id === activeTemplateId;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveTemplateId(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#2087FE] bg-[#2087FE]/5 dark:bg-[#2087FE]/10 ring-1 ring-[#2087FE]"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.category}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                        item.isActive
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 mt-1 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                    <span>Route: <strong className="text-slate-600 dark:text-slate-300">{item.redirection.targetPortal}</strong></span>
                    <span>•</span>
                    <span>{item.frequency}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Granular Template & Redirection Editor */}
          {activeTemplate && (
            <div className="lg:col-span-8 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-5">
              {/* Template Header & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeTemplate.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">ID: {activeTemplate.id} • Type: {activeTemplate.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={activeTemplate.isActive}
                      onChange={(e) => handleUpdateActiveTemplate({ isActive: e.target.checked })}
                      className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                    />
                    <span>Template Enabled</span>
                  </label>
                </div>
              </div>

              {/* Multi-Channel Dispatch Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Enabled Dispatch Channels
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { key: "inApp", label: "In-App Drawer", icon: Bell },
                    { key: "push", label: "Push Alert", icon: Smartphone },
                    { key: "sms", label: "SMS Gateway", icon: MessageSquare },
                    { key: "whatsapp", label: "WhatsApp Bot", icon: MessageSquare },
                    { key: "email", label: "Email Dispatch", icon: Mail },
                  ].map(({ key, label, icon: Icon }) => {
                    const isChecked = (activeTemplate.channels as any)[key];
                    return (
                      <label
                        key={key}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                          isChecked
                            ? "border-[#2087FE] bg-[#2087FE]/10 text-slate-900 dark:text-white font-bold"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleUpdateActiveTemplate({
                              channels: { ...activeTemplate.channels, [key]: e.target.checked },
                            })
                          }
                          className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                        />
                        <Icon className="w-3.5 h-3.5 text-[#2087FE]" />
                        <span className="text-[11px]">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Template Subject Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notification Title / Subject
                </label>
                <input
                  type="text"
                  value={activeTemplate.templateSubject}
                  onChange={(e) => handleUpdateActiveTemplate({ templateSubject: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                />
              </div>

              {/* Template Body Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Message Body Template
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Supports Unicode &amp; DLT Marathi/English tags
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={activeTemplate.templateBody}
                  onChange={(e) => handleUpdateActiveTemplate({ templateBody: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                />

                {/* Tag helper pills */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Click to Insert Tag:
                  </span>
                  {activeTemplate.availablePlaceholders.map((ph) => (
                    <button
                      key={ph}
                      type="button"
                      onClick={() => handleInsertTag(ph)}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#2087FE] hover:text-white transition"
                    >
                      {ph}
                    </button>
                  ))}
                </div>
              </div>

              {/* REDIRECTION LINK CONFIGURATION BOX */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <ExternalLink className="w-4 h-4 text-[#2087FE]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Redirection Link &amp; Destination Navigation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Target Role / Portal
                    </label>
                    <select
                      value={activeTemplate.redirection.targetPortal}
                      onChange={(e) => {
                        const portal = e.target.value as TargetPortalType;
                        const match = TARGET_PORTALS.find((p) => p.value === portal);
                        handleUpdateRedirection({
                          targetPortal: portal,
                          routePath: match?.defaultRoute || "/candidate",
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                    >
                      {TARGET_PORTALS.map((tp) => (
                        <option key={tp.value} value={tp.value}>
                          {tp.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Target Deep-Link Path
                    </label>
                    <input
                      type="text"
                      value={activeTemplate.redirection.routePath}
                      onChange={(e) => handleUpdateRedirection({ routePath: e.target.value })}
                      placeholder="/candidate?tab=voters"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Fallback URL (If unauthenticated / permission missing)
                    </label>
                    <input
                      type="text"
                      value={activeTemplate.redirection.fallbackRoute}
                      onChange={(e) => handleUpdateRedirection({ fallbackRoute: e.target.value })}
                      placeholder="/login"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="passParamsCheck"
                      checked={activeTemplate.redirection.passParameters}
                      onChange={(e) => handleUpdateRedirection({ passParameters: e.target.checked })}
                      className="rounded text-[#2087FE] focus:ring-[#2087FE]"
                    />
                    <label htmlFor="passParamsCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Pass Source &amp; Notification Ref in URL query parameters
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSimulateDispatch}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
                >
                  <Play className="w-3.5 h-3.5 text-purple-500" />
                  <span>Preview Rendered Message</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSaveTemplates(templates)}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2087FE] hover:bg-blue-600 text-white font-bold text-xs transition shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving Changes..." : "Save Template Customizations"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SIMULATOR MODAL / DRAWER */}
      {testSimulatorOpen && simulatedOutput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Dispatch &amp; Redirection Preview
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setTestSimulatorOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Rendered Notification Subject
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {simulatedOutput.subject}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Rendered Message Copy (With Sample Variables Interpolated)
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {simulatedOutput.body}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2087FE] block mb-1 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Configured Redirection URL Destination
                </span>
                <p className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all select-all">
                  {simulatedOutput.url}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setTestSimulatorOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                Done
              </button>
              <a
                href={activeTemplate?.redirection?.routePath || "/candidate"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2087FE] text-white hover:bg-blue-600 transition"
              >
                <span>Test Live Destination Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
