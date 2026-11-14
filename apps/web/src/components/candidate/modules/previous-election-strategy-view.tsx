"use client";

import React, { useState } from "react";
import {
  Bot,
  BarChart3,
  Sparkles,
  Send,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  dataSnippet?: {
    title: string;
    metrics: { label: string; value: string }[];
    recommendation: string;
  };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    text: "Namaskar! I am your Rajtantra Strategy Bot. I have cross-indexed historical election results for AC-215 (Kasba Peth) across the 2014, 2019 General Assemblies, and recent local municipal polls. How can I assist your campaign planning today?",
    timestamp: "10:00 AM",
  },
  {
    id: "msg-2",
    sender: "user",
    text: "Which polling booths had less than 50% voter turnout in the 2019 Assembly elections?",
    timestamp: "10:01 AM",
  },
  {
    id: "msg-3",
    sender: "bot",
    text: "According to ECI historical records for AC-215, 14 polling booths recorded voter turnout below 50% in 2019. The lowest turnouts were concentrated in Ward 9 (Gaothan) and high-density student areas near Modern High School and Ferguson.",
    timestamp: "10:01 AM",
    dataSnippet: {
      title: "Lowest Turnout Polling Stations (2019)",
      metrics: [
        { label: "Booth #88 (Gaothan)", value: "44.2% Turnout (-8.4% vs 2014)" },
        { label: "Booth #106 (Modern HS)", value: "47.1% Turnout (-6.2% vs 2014)" },
        { label: "Booth #109 (Erandwane)", value: "48.9% Turnout (-5.1% vs 2014)" },
      ],
      recommendation: "Deploy dedicated youth volunteer squads 3 days before polling with digital voter slip WhatsApp blasts to reverse the student apathy trend.",
    },
  },
];

const HISTORICAL_BOOTHS = [
  {
    booth: "#101",
    name: "Navbharat High School, Room 1",
    ward: "Ward 12",
    voters: 1142,
    result2014: "Won by +245 (58.4%)",
    result2019: "Won by +182 (54.1%)",
    classification: "Safe Hold",
    strategy: "Maintain lead with Ladki Bahin welfare outreach and elder morning walk meetups.",
  },
  {
    booth: "#106",
    name: "Modern High School, Wing A",
    ward: "Ward 9",
    voters: 980,
    result2014: "Won by +42 (51.2%)",
    result2019: "Lost by -18 (47.1%)",
    classification: "Critical Focus",
    strategy: "High priority: Candidate corner meeting required. Address road potholes and municipal water issues.",
  },
  {
    booth: "#107",
    name: "Ferguson Junior College",
    ward: "Ward 14",
    voters: 1250,
    result2014: "Won by +310 (64.2%)",
    result2019: "Won by +195 (56.0%)",
    classification: "Lean Favorable",
    strategy: "Focus on 18-25 first-time voter mobilization and employment skill promises.",
  },
  {
    booth: "#108",
    name: "Gokhale Memorial Hall",
    ward: "Ward 14",
    voters: 840,
    result2014: "Won by +380 (68.9%)",
    result2019: "Won by +290 (63.4%)",
    classification: "Fortress Hold",
    strategy: "Maximal slip distribution to drive elderly turnout to 75% on polling morning.",
  },
];

export function PreviousElectionStrategyView() {
  const { showToast } = useToast();
  const [activeMode, setActiveMode] = useState<"bot" | "manual">("bot");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Section 6 & 7: Historical Data Depth & AI Entitlement States
  const [dataTier, setDataTier] = useState<"tier1" | "tier2" | "tier3" | "tier4">("tier2");
  const [hasAiEntitlement, setHasAiEntitlement] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showTierUpgradeModal, setShowTierUpgradeModal] = useState(false);
  const [pendingTier, setPendingTier] = useState<string>("");

  const SUGGESTED_PROMPTS = [
    "Identify top 5 critical focus booths where margin was under 100 votes",
    "Compare Ward 12 voter turnout between 2014 and 2019",
    "What campaign message resonated best with senior citizens in AC-215?",
    "Recommend doorstep strategy for Ferguson College youth voters",
  ];

  const handleDataTierChange = (newTier: "tier1" | "tier2" | "tier3" | "tier4") => {
    // Tier 1 and 2 are allowed on basic tiers. Tier 3 (2014) and Tier 4 (2009) require plan upgrade.
    if (newTier === "tier3" || newTier === "tier4") {
      setPendingTier(newTier === "tier3" ? "Tier 3: 2014 - 2024 Decade Archive" : "Tier 4: 2009 - 2024 Full 15-Year Archive");
      setShowTierUpgradeModal(true);
      return;
    }
    setDataTier(newTier);
    showToast("info", "Historical Depth Updated", `Data scope adjusted to ${newTier.toUpperCase()}.`);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: `Analysis for "${text}": In the 2019 contest, AC-215 vote distribution showed strong loyalty in urban core peths, while peripheral development areas fluctuated based on civic grievances. Focusing door-to-door Karyakarta contact on households with 3+ registered voters yields the highest statistical ROI.`,
        timestamp: "Just now",
        dataSnippet: {
          title: "Strategy Bot Tactical Recommendation",
          metrics: [
            { label: "Target Electors", value: "8,400 Key Undecided Voters" },
            { label: "Recommended Channel", value: "WhatsApp Slip + Doorstep Canvass" },
            { label: "Expected Turnout Impact", value: "+3.2% Potential Margin Shift" },
          ],
          recommendation: "Conduct intensive Karyakarta verification across Booths #106 and #88 during the 48-hour silent period.",
        },
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header - NOTE: NO EXPORT / DOWNLOAD BUTTONS (Purged per Client Spec) */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 dark:text-brand-400 px-2.5 py-0.5 rounded-full">
              Module 14: Predictive Strategy &amp; AI
            </span>
            <Badge variant={hasAiEntitlement ? "teal" : "warning"}>
              {hasAiEntitlement ? "Agentic AI Entitlement: Active" : "AI Mode: Entitlement Locked"}
            </Badge>
            <Badge variant="ai">ECI Historical Multi-Cycle Engine</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Previous Election &amp; Strategy Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Query historical election trends, booth-wise margin shifts, and simulate turnout scenarios with conversational AI.
          </p>
        </div>

        {/* Plan-Tiered Historical Data Depth Dropdown & Interactive Entitlement Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="text-slate-500 font-medium hidden sm:inline">Archive Depth:</span>
            <select
              value={dataTier}
              onChange={(e) => handleDataTierChange(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="tier1">Tier 1: 2024 Only</option>
              <option value="tier2">Tier 2: 2019 - 2024</option>
              <option value="tier3">Tier 3: 2014 - 2024 (Locked)</option>
              <option value="tier4">Tier 4: 2009 - 2024 Full (Locked)</option>
            </select>
          </div>

          {/* Interactive Demo Preview Switch */}
          <button
            type="button"
            onClick={() => {
              const next = !hasAiEntitlement;
              setHasAiEntitlement(next);
              showToast(
                next ? "success" : "info",
                next ? "Agentic AI Mode Unlocked (Demo)" : "Agentic AI Mode Locked",
                next
                  ? "Demonstrating full autonomous AI Strategy Bot capabilities."
                  : "Showing frosted subscription lock screen."
              );
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              hasAiEntitlement
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                : "bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700"
            }`}
          >
            {hasAiEntitlement ? "Active: Entitled" : "Preview: Locked"}
          </button>
        </div>
      </section>

      {/* Mode Selector Tabs */}
      <div className="flex items-center bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs gap-2">
        <button
          type="button"
          onClick={() => setActiveMode("bot")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeMode === "bot"
              ? "bg-brand-600 text-white shadow-premium-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Strategy Bot (Conversational AI Mode)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("manual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeMode === "manual"
              ? "bg-brand-600 text-white shadow-premium-xs"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Manual Mode (Historical Comparative Analytics)</span>
        </button>
      </div>

      {/* MAIN CONTENT AREA WITH FROSTED / BLURRED ENTITLEMENT LOCK SCREEN (SECTIONS 6 & 7) */}
      <div className="relative">
        {/* If user lacks AI entitlement, overlay frosted lock screen */}
        {!hasAiEntitlement && (
          <div className="absolute inset-0 z-30 backdrop-blur-md bg-slate-950/65 rounded-xl border border-slate-800 flex items-center justify-center p-4">
            <div className="bg-slate-900/95 border border-brand-500/40 rounded-2xl max-w-lg w-full p-6 text-center shadow-2xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Agentic AI Mode Locked
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  Unlock Autonomous AI Strategic Intelligence
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Simulate booth-level swings, autonomous margin shifts, voter sentiment predictions, and automated speech synthesis with Tier 3 &amp; 4 subscription licensure.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="text-left bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-Cycle Turnout &amp; Margin Shift Simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated Marathi Voice Synthesis for Candidate Speech</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Autonomous Micro-Targeting &amp; Priority Focus Identification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24/7 Strategic War Room Advisory</span>
                </div>
              </div>

              {/* Sales Contact Details & CTA */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowSalesModal(true)}
                  className="bg-brand-600 hover:bg-brand-700 text-white shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Unlock Agentic AI Features</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setHasAiEntitlement(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                >
                  Demo Active Preview
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11.5px] text-slate-400">
                Dedicated Account Manager: <strong className="text-slate-200">Sachin Pawar</strong> (+91 98220 11234)
              </div>
            </div>
          </div>
        )}

        {/* Interactive Strategy Bot & Manual Analytics (Functional underneath) */}
        {activeMode === "bot" ? (
          /* STRATEGY BOT CONVERSATIONAL VIEW */
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col h-[650px] overflow-hidden">
            {/* Chat Messages Log */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-indigo-600 text-white shadow-sm"
                    }`}
                  >
                    {msg.sender === "user" ? "VP" : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-brand-600 text-white rounded-tr-none"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-tl-none shadow-2xs"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.dataSnippet && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2 text-xs">
                        <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>{msg.dataSnippet.title}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {msg.dataSnippet.metrics.map((m, idx) => (
                            <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                              <span className="text-[10px] text-slate-400 block">{m.label}</span>
                              <span className="font-bold text-slate-800 dark:text-white text-xs">{m.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-1 text-[11px] text-indigo-800 dark:text-indigo-300">
                          <strong>Action Recommendation: </strong> {msg.dataSnippet.recommendation}
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 px-1 block">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                  <Bot className="w-4 h-4 text-indigo-500" />
                  <span>Strategy Bot is synthesizing historical election intelligence...</span>
                </div>
              )}
            </div>

            {/* Prompt Suggestions */}
            <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Queries:</span>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 shrink-0 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask strategy questions (e.g. 'How did Ward 14 vote in 2014 vs 2019?')..."
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                />
                <Button type="submit" variant="primary" size="md">
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* MANUAL COMPARATIVE ANALYTICS VIEW */
          <div className="space-y-5">
            {/* Historical Trend KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-xs text-slate-500">2014 Assembly Turnout</span>
                <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">62.4%</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Won by +14,200 votes</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-xs text-slate-500">2019 Assembly Turnout</span>
                <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">58.8%</div>
                <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">Won by +7,850 votes (-3.6% shift)</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-xs text-slate-500">2024 Turnout Target</span>
                <div className="text-2xl font-bold text-brand-600 mt-1">64.5%</div>
                <span className="text-[11px] text-brand-600 font-semibold mt-0.5 block">Target Margin: +16,500</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-xs text-slate-500">Identified Focus Stations</span>
                <div className="text-2xl font-bold text-amber-500 mt-1">42 Booths</div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Margin under 100 votes</span>
              </div>
            </div>

            {/* Historical Booth Matrix */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    Booth-Wise Comparative Analysis (2014 vs. 2019)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detailed polling station outcomes with strategic mobilization directives.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Booth Station</th>
                      <th className="py-3 px-4">2014 Outcome</th>
                      <th className="py-3 px-4">2019 Outcome</th>
                      <th className="py-3 px-4">Classification</th>
                      <th className="py-3 px-4">Strategic Directive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {HISTORICAL_BOOTHS.map((b) => (
                      <tr key={b.booth} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 dark:text-white">{b.booth} - {b.name}</div>
                          <div className="text-[10px] text-slate-400">{b.ward} • {b.voters.toLocaleString()} Electors</div>
                        </td>

                        <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">
                          {b.result2014}
                        </td>

                        <td className="py-3 px-4">
                          <span className={b.result2019.includes("Lost") ? "font-bold text-rose-600" : "font-medium text-emerald-600 dark:text-emerald-400"}>
                            {b.result2019}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.classification === "Critical Focus"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300"
                                : b.classification === "Safe Hold"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            }`}
                          >
                            {b.classification}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                          {b.strategy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SALES INQUIRY MODAL (WITH SPECIFIED SACHIN PAWAR DETAILS) */}
      {showSalesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-600 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Unlock Agentic AI Licensure
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Direct Campaign Secretariat Support
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSalesModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Agentic AI mode provides multi-cycle simulation models, Marathi speech synthesis, and voter sentiment mapping. To activate this license for your assembly constituency, contact your dedicated account manager:
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Sachin Pawar
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                Senior Strategic Account Lead • Indiata Political Operations
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                <a
                  href="tel:+919822011234"
                  className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 98220 11234</span>
                </a>
                <a
                  href="mailto:sales@indiata.in"
                  className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>sales@indiata.in</span>
                </a>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href="tel:+919822011234"
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs text-center shadow-sm cursor-pointer transition-all"
              >
                Call Account Manager
              </a>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowSalesModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PLAN-TIER HISTORICAL DEPTH UPGRADE MODAL */}
      {showTierUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Historical Archive Restricted
                </h3>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                  Tier Upgrade Required
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              Accessing <strong>{pendingTier}</strong> requires an active <strong>Tier 3 (Election Mode + AI)</strong> or <strong>Tier 4 (Office Mode + AI)</strong> subscription package.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200">Contact Sales Team:</div>
              <div className="text-brand-600 dark:text-brand-400 font-mono">Sachin Pawar: +91 98220 11234</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTierUpgradeModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowTierUpgradeModal(false);
                  setShowSalesModal(true);
                }}
              >
                View Contact Info
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
