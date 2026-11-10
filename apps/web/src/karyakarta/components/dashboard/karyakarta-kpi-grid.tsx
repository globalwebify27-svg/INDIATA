"use client";

import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  FileText,
  Star,
  PhoneCall,
  PhoneOff,
  ThumbsUp,
  HelpCircle,
  ThumbsDown,
  Scale,
  AlertCircle,
  CheckCircle2,
  Share2,
  Printer,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { KaryakartaKpiStats } from "../../types/karyakarta.types";
import { useKaryakartaLanguage } from "../../context/karyakarta-language-context";

interface KaryakartaKpiGridProps {
  stats: KaryakartaKpiStats;
  onFilterClick?: (filterType: string) => void;
  activeFilter?: string;
}

export function KaryakartaKpiGrid({
  stats,
  onFilterClick,
  activeFilter,
}: KaryakartaKpiGridProps) {
  const { t } = useKaryakartaLanguage();

  const cards = [
    {
      id: "all",
      label: t("dash.assigned_voters", "Assigned Voters"),
      marathiLabel: "नियुक्त मतदार",
      value: stats.totalAssignedVoters,
      subtitle: `${stats.assignedBoothsCount} Polling Booths`,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
      borderColor: "border-blue-200 dark:border-blue-900/50",
      textColor: "text-blue-700 dark:text-blue-400",
      iconBg: "bg-blue-600 text-white",
      progress: null,
    },
    {
      id: "visited",
      label: t("dash.visited", "Total Visited"),
      marathiLabel: "भेट दिलेले",
      value: stats.visitedVoters,
      subtitle: `${stats.visitPercentage}% Doorstep Completed`,
      icon: UserCheck,
      color: "emerald",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
      textColor: "text-emerald-700 dark:text-emerald-400",
      iconBg: "bg-emerald-600 text-white",
      progress: stats.visitPercentage,
    },
    {
      id: "unvisited",
      label: t("dash.not_visited", "Pending Visits"),
      marathiLabel: "भेट बाकी",
      value: stats.unvisitedVoters,
      subtitle: `${100 - stats.visitPercentage}% Remaining to Visit`,
      icon: UserX,
      color: "amber",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      borderColor: "border-amber-200 dark:border-amber-900/50",
      textColor: "text-amber-700 dark:text-amber-400",
      iconBg: "bg-amber-600 text-white",
      progress: 100 - stats.visitPercentage,
    },
    {
      id: "surveys",
      label: t("dash.surveys_completed", "Surveys Completed"),
      marathiLabel: "सर्वेक्षण पूर्ण",
      value: stats.surveysCompleted,
      subtitle: `${stats.surveyPercentage}% Data Captured`,
      icon: FileText,
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-950/40",
      borderColor: "border-purple-200 dark:border-purple-900/50",
      textColor: "text-purple-700 dark:text-purple-400",
      iconBg: "bg-purple-600 text-white",
      progress: stats.surveyPercentage,
    },
    {
      id: "important",
      label: t("dash.important_voters", "Important / Stars"),
      marathiLabel: "महत्त्वाचे मतदार",
      value: stats.importantVoters,
      subtitle: `${stats.favouriteVoters} Priority Key Contacts`,
      icon: Star,
      color: "yellow",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/40",
      borderColor: "border-yellow-200 dark:border-yellow-900/50",
      textColor: "text-yellow-700 dark:text-yellow-400",
      iconBg: "bg-yellow-500 text-white",
      progress: null,
    },
    {
      id: "mobile_has",
      label: t("dash.mobile_available", "Mobile Available"),
      marathiLabel: "मोबाईल क्रमांक उपलब्ध",
      value: stats.mobileAvailable,
      subtitle: `${Math.round((stats.mobileAvailable / (stats.totalAssignedVoters || 1)) * 100)}% Reachable`,
      icon: PhoneCall,
      color: "cyan",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
      borderColor: "border-cyan-200 dark:border-cyan-900/50",
      textColor: "text-cyan-700 dark:text-cyan-400",
      iconBg: "bg-cyan-600 text-white",
      progress: Math.round((stats.mobileAvailable / (stats.totalAssignedVoters || 1)) * 100),
    },
    {
      id: "mobile_none",
      label: "Mobile Missing",
      marathiLabel: "मोबाईल नसलेले",
      value: stats.mobileMissing,
      subtitle: "Need field collection",
      icon: PhoneOff,
      color: "rose",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
      borderColor: "border-rose-200 dark:border-rose-900/50",
      textColor: "text-rose-700 dark:text-rose-400",
      iconBg: "bg-rose-600 text-white",
      progress: null,
    },
    {
      id: "supporters",
      label: "Supporters",
      marathiLabel: "अनुकूल / समर्थक",
      value: stats.supportersCount,
      subtitle: "Strong Anand Shinde cadre",
      icon: ThumbsUp,
      color: "emerald",
      bgColor: "bg-emerald-50/70 dark:bg-emerald-950/30",
      borderColor: "border-emerald-300 dark:border-emerald-800",
      textColor: "text-emerald-800 dark:text-emerald-300",
      iconBg: "bg-emerald-700 text-white",
      progress: null,
    },
    {
      id: "doubtful",
      label: "Doubtful / Swing",
      marathiLabel: "साशंक / संशयित",
      value: stats.doubtfulCount,
      subtitle: "Requires follow-up visits",
      icon: HelpCircle,
      color: "amber",
      bgColor: "bg-amber-50/70 dark:bg-amber-950/30",
      borderColor: "border-amber-300 dark:border-amber-800",
      textColor: "text-amber-800 dark:text-amber-300",
      iconBg: "bg-amber-600 text-white",
      progress: null,
    },
    {
      id: "opponents",
      label: "Opponents",
      marathiLabel: "विरोधी मतदार",
      value: stats.opponentsCount,
      subtitle: "Recorded leanings",
      icon: ThumbsDown,
      color: "red",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200 dark:border-red-900/40",
      textColor: "text-red-700 dark:text-red-400",
      iconBg: "bg-red-600 text-white",
      progress: null,
    },
    {
      id: "neutral",
      label: "Neutral / Undecided",
      marathiLabel: "तटस्थ मतदार",
      value: stats.neutralCount,
      subtitle: "Persuasion target",
      icon: Scale,
      color: "slate",
      bgColor: "bg-slate-100 dark:bg-slate-800/60",
      borderColor: "border-slate-300 dark:border-slate-700",
      textColor: "text-slate-800 dark:text-slate-200",
      iconBg: "bg-slate-600 text-white",
      progress: null,
    },
    {
      id: "issues_open",
      label: t("dash.open_issues", "Open Grievances"),
      marathiLabel: "प्रलंबित समस्या",
      value: stats.openIssues,
      subtitle: "Action required in booths",
      icon: AlertCircle,
      color: "orange",
      bgColor: "bg-orange-50 dark:bg-orange-950/40",
      borderColor: "border-orange-200 dark:border-orange-900/50",
      textColor: "text-orange-700 dark:text-orange-400",
      iconBg: "bg-orange-600 text-white",
      progress: null,
    },
    {
      id: "issues_resolved",
      label: t("dash.resolved_issues", "Resolved Issues"),
      marathiLabel: "निवारण झालेल्या तक्रारी",
      value: stats.resolvedIssues,
      subtitle: "Closed by War Room desk",
      icon: CheckCircle2,
      color: "teal",
      bgColor: "bg-teal-50 dark:bg-teal-950/40",
      borderColor: "border-teal-200 dark:border-teal-900/50",
      textColor: "text-teal-700 dark:text-teal-400",
      iconBg: "bg-teal-600 text-white",
      progress: null,
    },
    {
      id: "slips_digital",
      label: "Digital Slips (WhatsApp)",
      marathiLabel: "डिजिटल स्लिप्स पाठवल्या",
      value: stats.digitalSlipsSent,
      subtitle: "Delivered to phones",
      icon: Share2,
      color: "indigo",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/40",
      borderColor: "border-indigo-200 dark:border-indigo-900/50",
      textColor: "text-indigo-700 dark:text-indigo-400",
      iconBg: "bg-indigo-600 text-white",
      progress: null,
    },
    {
      id: "slips_printed",
      label: t("dash.slips_printed", "Printed Voter Slips"),
      marathiLabel: "छापील मतदान पावत्या",
      value: stats.slipsPrinted,
      subtitle: "Handed over physically",
      icon: Printer,
      color: "blue",
      bgColor: "bg-blue-50/80 dark:bg-blue-950/50",
      borderColor: "border-blue-300 dark:border-blue-800",
      textColor: "text-blue-800 dark:text-blue-300",
      iconBg: "bg-blue-700 text-white",
      progress: null,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#2087FE]/10 text-[#2087FE]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Field Performance Telemetry (15 Metrics)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Updated Real-Time • Scoped to Assigned Booths
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeFilter === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onFilterClick && onFilterClick(card.id)}
              className={`relative p-3.5 rounded-xl border transition-all duration-200 text-left ${
                card.bgColor
              } ${card.borderColor} ${
                onFilterClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""
              } ${
                isSelected
                  ? "ring-2 ring-blue-500 shadow-md scale-[1.02]"
                  : "shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 line-clamp-1">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${card.iconBg} shadow-sm shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value.toLocaleString()}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 truncate">
                  {card.subtitle}
                </span>
                {onFilterClick && (
                  <ChevronRight className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100" />
                )}
              </div>

              {card.progress !== null && (
                <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      card.color === "emerald"
                        ? "bg-emerald-500"
                        : card.color === "amber"
                        ? "bg-amber-500"
                        : card.color === "purple"
                        ? "bg-purple-500"
                        : "bg-cyan-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, card.progress))}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
