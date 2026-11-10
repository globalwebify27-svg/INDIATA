"use client";

import React from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Share2,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { ActivityLogRecord } from "../../types/karyakarta.types";
import Link from "next/link";

interface RecentActivityFeedProps {
  activities: ActivityLogRecord[];
  maxItems?: number;
}

export function RecentActivityFeed({ activities, maxItems = 5 }: RecentActivityFeedProps) {
  const displayed = activities.slice(0, maxItems);

  const getActionIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("survey")) {
      return <FileText className="w-4 h-4 text-purple-600" />;
    }
    if (act.includes("print")) {
      return <Printer className="w-4 h-4 text-blue-600" />;
    }
    if (act.includes("digital") || act.includes("slip") || act.includes("whatsapp")) {
      return <Share2 className="w-4 h-4 text-emerald-600" />;
    }
    if (act.includes("issue") || act.includes("ticket")) {
      return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
    if (act.includes("booth") || act.includes("location")) {
      return <MapPin className="w-4 h-4 text-cyan-600" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Field Log
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Audited Karyakarta chronological dispatches
            </p>
          </div>
        </div>
        <Link
          href="/karyakarta/activity-history"
          className="text-xs font-semibold text-[#2087FE] hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {displayed.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800"
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
              {getActionIcon(item.action)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {item.action}
                </span>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                {item.target}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-1">
                {item.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
