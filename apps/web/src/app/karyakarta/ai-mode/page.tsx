"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Bot,
  Mic,
  Send,
  Zap,
  Lock,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useKaryakartaAuth } from "../../../karyakarta/context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../../karyakarta/context/karyakarta-language-context";
import { MOCK_SCOPED_VOTERS } from "../../../karyakarta/data/mock-karyakarta-data";
import { VoterRecord } from "../../../karyakarta/types/karyakarta.types";
import { ResultantVoterList } from "../../../karyakarta/components/voters/resultant-voter-list";
import { CentralVoterProfile } from "../../../karyakarta/components/voters/central-voter-profile";
import { IndividualSurveyModal } from "../../../karyakarta/components/surveys/individual-survey-modal";
import { BulkSurveyModal } from "../../../karyakarta/components/surveys/bulk-survey-modal";
import { VoterSlipPreviewModal } from "../../../karyakarta/components/slips/voter-slip-preview-modal";

interface SamplePrompt {
  label: string;
  query: string;
  category: string;
}

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    label: "Senior Citizens Unvisited (Age 60+)",
    query: "Show unvisited senior citizen voters aged 60 and above in Booth 101",
    category: "Outreach Priority",
  },
  {
    label: "Doubtful Voters with Verified Phone",
    query: "Find doubtful voters who have a verified mobile phone number",
    category: "Persuasion Target",
  },
  {
    label: "Civic Issue & Water Demand Voters",
    query: "List voters who demanded water supply or road repairs during surveys",
    category: "Grievance Follow-up",
  },
  {
    label: "Welfare Scheme Beneficiaries (PMAY / Pension)",
    query: "Show supporters enrolled in government welfare schemes like PMAY or Ladki Bahin",
    category: "Voter Retention",
  },
  {
    label: "बूथ १०१ मधील संपर्क न झालेले मतदार (मराठी)",
    query: "बूथ १०१ मधील अद्याप भेट न घेतलेले सर्व मतदार दाखवा",
    category: "मराठी क्वेरी",
  },
];

export default function AiModePage() {
  const { user, assignedBooths } = useKaryakartaAuth();
  const { t } = useKaryakartaLanguage();

  // License simulation state (defaults to user.hasAiSeat)
  const [hasAiSeatOverride, setHasAiSeatOverride] = useState<boolean>(user?.hasAiSeat ?? true);

  const [promptInput, setPromptInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals
  const [activeProfileVoter, setActiveProfileVoter] = useState<VoterRecord | null>(null);
  const [surveyVoter, setSurveyVoter] = useState<VoterRecord | null>(null);
  const [bulkSurveyVoters, setBulkSurveyVoters] = useState<VoterRecord[]>([]);
  const [slipModalVoter, setSlipModalVoter] = useState<VoterRecord | null>(null);

  // Dynamic voter records
  const [votersList, setVotersList] = useState<VoterRecord[]>(MOCK_SCOPED_VOTERS);

  // Scoped base voters for this Karyakarta's booths
  const scopedBaseVoters = useMemo(() => {
    if (!assignedBooths || assignedBooths.length === 0) return votersList;
    return votersList.filter((v) => assignedBooths.includes(v.boothNumber));
  }, [assignedBooths, votersList]);

  // AI Matching Logic
  const { matchedVoters, aiInsights } = useMemo(() => {
    if (!activeQuery.trim()) {
      return {
        matchedVoters: scopedBaseVoters,
        aiInsights: null,
      };
    }

    const q = activeQuery.toLowerCase();
    const isSenior = q.includes("senior") || q.includes("60") || q.includes("वयस्कर") || q.includes("वृद्ध");
    const isUnvisited = q.includes("unvisited") || q.includes("not visited") || q.includes("भेट न घेतलेले") || q.includes("बाकी");
    const isDoubtful = q.includes("doubtful") || q.includes("साशंक");
    const isSupporter = q.includes("supporter") || q.includes("अनुकूल");
    const isOpponent = q.includes("opponent") || q.includes("विरोधी");
    const hasPhoneReq = q.includes("phone") || q.includes("mobile") || q.includes("मोबाइल") || q.includes("संपर्क");
    const hasGrievance = q.includes("water") || q.includes("road") || q.includes("पाणी") || q.includes("रस्ते") || q.includes("repair") || q.includes("issue");
    const hasScheme = q.includes("scheme") || q.includes("pmay") || q.includes("योजना") || q.includes("pension");
    const booth101 = q.includes("101") || q.includes("१०१");
    const booth102 = q.includes("102") || q.includes("१०२");

    const filtered = scopedBaseVoters.filter((v) => {
      if (booth101 && v.boothNumber !== "#101") return false;
      if (booth102 && v.boothNumber !== "#102") return false;
      if (isSenior && v.age < 60) return false;
      if (isUnvisited && v.isVisited) return false;
      if (isDoubtful && v.classification !== "Doubtful") return false;
      if (isSupporter && v.classification !== "Supporter") return false;
      if (isOpponent && v.classification !== "Opponent") return false;
      if (hasPhoneReq && !v.phone) return false;
      if (hasGrievance && !v.demand.toLowerCase().includes("water") && !v.demand.toLowerCase().includes("road") && !v.remarks.toLowerCase().includes("water")) return false;
      if (hasScheme && !v.scheme) return false;
      return true;
    });

    const parsedFilters: string[] = [];
    if (booth101) parsedFilters.push("Booth #101");
    if (booth102) parsedFilters.push("Booth #102");
    if (isSenior) parsedFilters.push("Age ≥ 60 (Senior Citizens)");
    if (isUnvisited) parsedFilters.push("Outreach Status: Unvisited");
    if (isDoubtful) parsedFilters.push("Sentiment: Doubtful");
    if (isSupporter) parsedFilters.push("Sentiment: Supporter");
    if (hasPhoneReq) parsedFilters.push("Phone: Verified Available");
    if (hasGrievance) parsedFilters.push("Demands: Water / Road Infrastructure");
    if (hasScheme) parsedFilters.push("Schemes: Active Beneficiaries");

    if (parsedFilters.length === 0) {
      parsedFilters.push(`Keyword match: "${activeQuery}"`);
    }

    return {
      matchedVoters: filtered,
      aiInsights: {
        filterSummary: parsedFilters,
        recommendation:
          filtered.length > 0
            ? `INDIATA AI Intelligence recommends scheduling a targeted field visit to these ${filtered.length} electors before polling week.`
            : "No electors match the query parameters in your assigned booths. Try broadening the search criteria.",
      },
    };
  }, [activeQuery, scopedBaseVoters]);

  const handleExecutePrompt = (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setPromptInput(text);
    setTimeout(() => {
      setActiveQuery(text);
      setIsProcessing(false);
    }, 400);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      handleExecutePrompt("Show unvisited senior citizens in Booth 101");
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleExecutePrompt("Show unvisited senior citizen voters aged 60 and above in Booth 101");
      }, 2500);
    }
  };

  const handleToggleImportant = (voterId: string) => {
    setVotersList((prev) =>
      prev.map((v) => (v.id === voterId ? { ...v, isImportant: !v.isImportant } : v))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
              M20 AI Campaign Intelligence
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Candidate: {user?.candidateName || "Anand Shinde"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {t("ai.title", "INDIATA AI Field Assistant & Search Copilot")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Query your assigned voter roll in natural Marathi or English. Extract micro-segments, prioritize doorstep visits, and spot persuasion opportunities.
          </p>
        </div>

        {/* AI Seat License Indicator & Demo Switcher */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>AI Seat License:</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                    hasAiSeatOverride
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  {hasAiSeatOverride ? "ACTIVE (PRO)" : "LOCKED"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasAiSeatOverride(!hasAiSeatOverride)}
                className="text-[10px] font-semibold text-indigo-600 hover:underline"
              >
                [Toggle Demo AI License]
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LOCKED STATE (When Karyakarta lacks an AI Seat) */}
      {!hasAiSeatOverride ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            AI Assistant License Required
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Natural language semantic search and generative voter segmentation require an assigned <strong>AI Field Seat</strong>. Your candidate administrator ({user?.candidateName || "Anand Shinde"}) allocates AI seats to designated key sector coordinators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => alert("Request sent to Candidate War Room desk. You will be notified once approved.")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
            >
              Request AI Seat Allocation
            </button>
            <button
              onClick={() => setHasAiSeatOverride(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Preview with Demo Seat &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE AI COPILOT WORKSPACE */
        <div className="space-y-6">
          {/* AI Search & Prompt Box */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-700/40 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Ask INDIATA Copilot</h2>
                    <p className="text-[11px] text-indigo-200">
                      Semantic NLP voter intelligence across assigned Booths: {user?.assignedBooths?.join(", ") || "All"}
                    </p>
                  </div>
                </div>

                {activeQuery && (
                  <button
                    onClick={() => {
                      setActiveQuery("");
                      setPromptInput("");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-indigo-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset AI Search
                  </button>
                )}
              </div>

              {/* Main Prompt Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleExecutePrompt(promptInput)}
                  placeholder="e.g. Find senior citizen voters in Booth 101 who have not been visited..."
                  className="w-full pl-4 pr-24 py-3.5 rounded-xl bg-white/10 dark:bg-slate-800/80 border border-white/20 text-white placeholder-indigo-200/60 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                />

                <div className="absolute right-2 top-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                    title={isListening ? "Listening... click to submit" : "Voice query input (Marathi / Hindi / English)"}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecutePrompt(promptInput)}
                    disabled={isProcessing}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <>
                        <span>Ask</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sample Prompt Chips */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                  Suggested AI Prompts (Click to test):
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map((sp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleExecutePrompt(sp.query)}
                      className="text-left text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-indigo-100 transition-colors flex items-center gap-2 group"
                    >
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/40 font-mono text-indigo-200">
                        {sp.category}
                      </span>
                      <span>{sp.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Intelligence Synthesis Card (When query is active) */}
          {aiInsights && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      AI Field Query Results: {matchedVoters.length} Electors Found
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Matched query: &ldquo;{activeQuery}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {aiInsights.filterSummary.map((f, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800"
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 bg-indigo-50/50 dark:bg-slate-800/40 p-3 rounded-xl border border-indigo-100 dark:border-slate-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Field Cadre Strategy Note:</strong> {aiInsights.recommendation}
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* RESULTANT VOTER LIST (Reusable Core Table)                */}
          {/* ========================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Matched Electors Result</span>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                  {matchedVoters.length} records
                </span>
              </h3>
            </div>

            <ResultantVoterList
              voters={matchedVoters}
              onSelectVoter={(v) => setActiveProfileVoter(v)}
              onConductSurvey={(v) => setSurveyVoter(v)}
              onPrintSlip={(v) => setSlipModalVoter(v)}
              onRaiseIssue={(v) => setActiveProfileVoter(v)}
              onToggleImportant={handleToggleImportant}
              onBulkSurvey={(selected) => setBulkSurveyVoters(selected)}
              pageSizeDefault={10}
              showBatchActions={true}
            />
          </div>
        </div>
      )}

      {/* Central Voter Profile Modal */}
      <CentralVoterProfile
        voter={activeProfileVoter}
        isOpen={!!activeProfileVoter}
        onClose={() => setActiveProfileVoter(null)}
        onOpenSurvey={(v) => {
          setActiveProfileVoter(null);
          setSurveyVoter(v);
        }}
        onPrintSlip={(v) => {
          setActiveProfileVoter(null);
          setSlipModalVoter(v);
        }}
      />

      {/* Individual Survey Modal */}
      <IndividualSurveyModal
        isOpen={!!surveyVoter}
        voter={surveyVoter}
        onClose={() => setSurveyVoter(null)}
        onSave={(updatedVoter: VoterRecord) => {
          setVotersList((prev) =>
            prev.map((v) => (v.id === updatedVoter.id ? updatedVoter : v))
          );
          setSurveyVoter(null);
        }}
      />

      {/* Bulk Survey Modal */}
      <BulkSurveyModal
        isOpen={bulkSurveyVoters.length > 0}
        selectedVoters={bulkSurveyVoters}
        onClose={() => setBulkSurveyVoters([])}
        onComplete={(updatedList: VoterRecord[]) => {
          const map = new Map(updatedList.map((u) => [u.id, u]));
          setVotersList((prev) => prev.map((v) => map.get(v.id) || v));
          setBulkSurveyVoters([]);
        }}
      />

      {/* Voter Slip Modal */}
      {slipModalVoter && (
        <VoterSlipPreviewModal
          isOpen={!!slipModalVoter}
          voter={slipModalVoter}
          onClose={() => setSlipModalVoter(null)}
        />
      )}
    </div>
  );
}
