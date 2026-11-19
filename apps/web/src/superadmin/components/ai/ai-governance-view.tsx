"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  ShieldAlert,
  Cpu,
  Zap,
  RefreshCw,
  MessageSquareText,
  Copy,
  Check,
} from "lucide-react";
import { superAdminApi } from "../../services/superadmin-api";
import { useToast } from "@/context/toast-context";
import { AiTenantUsage } from "@/app/api/superadmin/store";

const SYSTEM_SUGGESTED_PROMPTS = [
  {
    id: "PR-01",
    category: "Voter Sentiment & Swing",
    title: "Swing Booth Vulnerability Scan",
    promptEn: "Identify swing booths in Kasba Peth where the victory margin in the previous election was below 500 votes, and correlate with current voter sentiment.",
    promptMr: "मागील निवडणुकीत ५०० पेक्षा कमी मताधिक्य असलेले कसबा पेठेतील स्विंग बूथ ओळखा आणि चालू जनभावनेशी त्यांची सांगड घाला.",
    targetPortals: ["Candidate War Room", "Super Admin"],
  },
  {
    id: "PR-02",
    category: "Voter Sentiment & Swing",
    title: "Ward Sentiment Shift Analysis",
    promptEn: "Analyze sentiment shifts among uncontacted vs visited voters in Ward 14 over the past 30 days and highlight negative-to-neutral movements.",
    promptMr: "गेल्या ३० दिवसांतील प्रभाग १४ मधील संपर्क झालेल्या विरूद्ध न झालेल्या मतदारांच्या भावनांचा बदल तपासा.",
    targetPortals: ["Candidate War Room"],
  },
  {
    id: "PR-03",
    category: "Door-to-Door & Cadre Outreach",
    title: "Doorstep Youth Pitch (Marathi)",
    promptEn: "Generate a persuasive 3-minute Marathi door-to-door pitch tailored for first-time youth voters focusing on local skill centers and IT parks.",
    promptMr: "पहिल्यांदा मतदान करणाऱ्या तरुणांसाठी स्थानिक कौशल्य केंद्रे आणि आयटी पार्कवर भर देणारा ३ मिनिटांचा प्रभावी मराठी संवाद तयार करा.",
    targetPortals: ["Karyakarta App", "Candidate War Room"],
  },
  {
    id: "PR-04",
    category: "Door-to-Door & Cadre Outreach",
    title: "Doorstep Civic Grievance Handling",
    promptEn: "Provide calm, factual objection-handling talking points for karyakartas addressing delays in the municipal drinking water pipeline scheme.",
    promptMr: "महापालिका पाणीपुरवठा योजनेतील विलंबाबाबत नागरिकांच्या प्रश्नांना शांतपणे व पुराव्यानिशी उत्तरे देण्यासाठी कार्यकर्त्यांसाठी मुद्दे द्या.",
    targetPortals: ["Karyakarta App"],
  },
  {
    id: "PR-05",
    category: "Welfare Schemes & Beneficiaries",
    title: "Ladki Bahin Yojana Beneficiary Audit",
    promptEn: "Map Mukhyamantri Majhi Ladki Bahin Yojana registered female electors against booth turnout records to evaluate outreach penetration.",
    promptMr: "मुख्यमंत्री माझी लाडकी बहीण योजनेच्या महिला लाभार्थींची संख्या आणि बूथवरील मतदान टक्केवारी यांची तुलना करा.",
    targetPortals: ["Candidate War Room", "Karyakarta App"],
  },
  {
    id: "PR-06",
    category: "Welfare Schemes & Beneficiaries",
    title: "PMAY Eligibility Guide in Simple Marathi",
    promptEn: "Summarize Pradhan Mantri Awas Yojana (Urban) eligibility requirements and needed documentation in 4 easy bullet points for booth-level distribution.",
    promptMr: "पंतप्रधान आवास योजनेची (शहरी) पात्रता आणि आवश्यक कागदपत्रे बूथ स्तरावर वाटण्यासाठी ४ सोप्या मुद्द्यांमध्ये सांगा.",
    targetPortals: ["Karyakarta App"],
  },
  {
    id: "PR-07",
    category: "Booth Turnout Strategy",
    title: "Low Morning Turnout Intervention",
    promptEn: "Detect polling booths with morning voter turnout under 22% by 11:00 AM and generate prioritized auto-call audio dispatch lists.",
    promptMr: "सकाळी ११:०० वाजेपर्यंत २२% पेक्षा कमी मतदान झालेल्या केंद्रांची यादी तयार करा आणि प्राधान्याने व्हॉइस कॉल संदेश पाठवा.",
    targetPortals: ["Candidate War Room", "Super Admin"],
  },
  {
    id: "PR-08",
    category: "Model Code of Conduct Compliance",
    title: "ECI Loudspeaker & Permission Check",
    promptEn: "Cross-check proposed public corner meeting schedule and loudspeaker sound decibels against current Election Commission guidelines and quiet hours.",
    promptMr: "निवडणूक आयोगाच्या नियमांनुसार कॉर्नर सभेच्या वेळा आणि लाऊडस्पीकर डेसिबल मर्यादा तपासून खात्री करा.",
    targetPortals: ["Candidate War Room", "Super Admin"],
  },
];

export function AiGovernanceView() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>("ALL");

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

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast("Suggested AI prompt copied to clipboard.", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ["ALL", ...Array.from(new Set(SYSTEM_SUGGESTED_PROMPTS.map((p) => p.category)))];

  const filteredPrompts = selectedPromptCategory === "ALL"
    ? SYSTEM_SUGGESTED_PROMPTS
    : SYSTEM_SUGGESTED_PROMPTS.filter((p) => p.category === selectedPromptCategory);

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

      {/* System-Wide Suggested AI Prompts Repository & Prompt Library */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                System-Wide Suggested AI Prompts Repository &amp; Prompt Library
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                {SYSTEM_SUGGESTED_PROMPTS.length} Curated Prompts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bilingual (English &amp; Marathi) prompt templates accessible in AI fields across Candidate War Room, Karyakarta App, and Super Admin.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedPromptCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedPromptCategory === cat
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredPrompts.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-700/60 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {p.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {p.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  {p.targetPortals.map((portal) => (
                    <span
                      key={portal}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-[#2087FE] dark:text-[#0D79FD] border border-blue-200/50 dark:border-blue-800/50"
                    >
                      {portal}
                    </span>
                  ))}
                </div>
              </div>

              {/* English Prompt */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>English Prompt</span>
                  <button
                    onClick={() => handleCopyPrompt(`${p.id}-en`, p.promptEn)}
                    className="flex items-center gap-1 text-[#2087FE] hover:underline"
                    title="Copy English prompt"
                  >
                    {copiedId === `${p.id}-en` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  &ldquo;{p.promptEn}&rdquo;
                </p>
              </div>

              {/* Marathi Prompt */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>मराठी सूचना (Marathi Prompt)</span>
                  <button
                    onClick={() => handleCopyPrompt(`${p.id}-mr`, p.promptMr)}
                    className="flex items-center gap-1 text-[#2087FE] hover:underline"
                    title="Copy Marathi prompt"
                  >
                    {copiedId === `${p.id}-mr` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  &ldquo;{p.promptMr}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
