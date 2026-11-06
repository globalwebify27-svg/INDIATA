"use client";

import React, { useState } from "react";
import {
  Bot,
  BarChart3,
  Sparkles,
  Send,
  Download,
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
    classification: "Critical Swing",
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

  const SUGGESTED_PROMPTS = [
    "Identify top 5 swing booths where margin was under 100 votes",
    "Compare Ward 12 voter turnout between 2014 and 2019",
    "What campaign message resonated best with senior citizens in AC-215?",
    "Recommend doorstep strategy for Ferguson College youth voters",
  ];

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
            { label: "Expected Turnout Impact", value: "+3.2% Potential Swing" },
          ],
          recommendation: "Conduct intensive Karyakarta verification across Booths #106 and #88 during the 48-hour silent period.",
        },
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const handleExportStrategy = () => {
    showToast(
      "success",
      "Strategy Dossier Exported",
      "Historical election comparison and AI war room tactical recommendations downloaded as encrypted PDF."
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 14: Predictive Strategy
            </span>
            <Badge variant="teal">Subscription Entitled: Active</Badge>
            <Badge variant="ai">AI Strategy Engine v4.2</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Previous Election &amp; Strategy Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Query historical election trends, booth-wise margin shifts, and simulate turnout scenarios with conversational AI.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md" onClick={handleExportStrategy}>
            <Download className="w-3.5 h-3.5" />
            <span>Export Strategy Dossier</span>
          </Button>
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
              <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">Won by +7,850 votes (-3.6% swing)</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500">2024 Turnout Target</span>
              <div className="text-2xl font-bold text-brand-600 mt-1">64.5%</div>
              <span className="text-[11px] text-brand-600 font-semibold mt-0.5 block">Target Margin: +16,500</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs text-slate-500">Identified Swing Stations</span>
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
                            b.classification === "Critical Swing"
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
  );
}
