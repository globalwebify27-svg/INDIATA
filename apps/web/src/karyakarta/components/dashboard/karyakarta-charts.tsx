"use client";

import React from "react";
import {
  PieChart,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Printer,
  Share2,
} from "lucide-react";
import { KaryakartaKpiStats, PollingBooth } from "../../types/karyakarta.types";

interface KaryakartaChartsProps {
  stats: KaryakartaKpiStats;
  booths: PollingBooth[];
}

export function KaryakartaCharts({ stats, booths }: KaryakartaChartsProps) {
  const total = stats.totalAssignedVoters || 1;
  const supporterPct = Math.round((stats.supportersCount / total) * 100);
  const doubtfulPct = Math.round((stats.doubtfulCount / total) * 100);
  const opponentPct = Math.round((stats.opponentsCount / total) * 100);
  const neutralPct = Math.max(0, 100 - supporterPct - doubtfulPct - opponentPct);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart 1: Doorstep Coverage & Visit Velocity */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Doorstep Outreach Progress
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Visited vs. Remaining in Assigned Booths
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              {stats.visitPercentage}% Done
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all duration-700"
              style={{ width: `${stats.visitPercentage}%` }}
              title={`Visited: ${stats.visitedVoters}`}
            />
            <div
              className="bg-amber-400/80 transition-all duration-700"
              style={{ width: `${100 - stats.visitPercentage}%` }}
              title={`Unvisited: ${stats.unvisitedVoters}`}
            />
          </div>

          {/* Legend Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Visited &amp; Verified
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                {stats.visitedVoters.toLocaleString()}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
              <span className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Pending Outreach
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                {stats.unvisitedVoters.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Target: 100% door-to-door before silence period</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">On Track</span>
        </div>
      </div>

      {/* Chart 2: Voter Sentiment Breakdown */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2087FE]">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Voter Leaning &amp; Sentiment
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Field Classification Index
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#2087FE] dark:text-blue-400">
              {stats.surveysCompleted} Classified
            </span>
          </div>

          {/* Segmented Sentiment Bar */}
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all duration-700"
              style={{ width: `${supporterPct}%` }}
              title={`Supporter: ${supporterPct}%`}
            />
            <div
              className="bg-amber-400 transition-all duration-700"
              style={{ width: `${doubtfulPct}%` }}
              title={`Doubtful: ${doubtfulPct}%`}
            />
            <div
              className="bg-rose-500 transition-all duration-700"
              style={{ width: `${opponentPct}%` }}
              title={`Opponent: ${opponentPct}%`}
            />
            <div
              className="bg-slate-400 transition-all duration-700"
              style={{ width: `${neutralPct}%` }}
              title={`Neutral: ${neutralPct}%`}
            />
          </div>

          {/* 4 Sentiment Badges */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Supporter
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {stats.supportersCount} ({supporterPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30">
              <span className="text-amber-700 dark:text-amber-400 font-semibold text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Doubtful
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {stats.doubtfulCount} ({doubtfulPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30">
              <span className="text-rose-700 dark:text-rose-400 font-semibold text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Opponent
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {stats.opponentsCount} ({opponentPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Neutral
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {stats.neutralCount} ({neutralPct}%)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Priority: Convert Doubtful into Supporters</span>
          <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
        </div>
      </div>

      {/* Chart 3: Booth Workload Distribution */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Allocated Booths Load
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Cadre distribution &amp; voter counts
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {booths.length} Stations
            </span>
          </div>

          <div className="space-y-3">
            {booths.slice(0, 3).map((b) => (
              <div key={b.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-[10px]">
                      {b.boothNumber}
                    </span>
                    <span className="truncate max-w-[170px]">{b.boothName}</span>
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">
                    {b.totalVoters} Voters
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((b.totalVoters / 1000) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>BLO: {b.bloName}</span>
                  <span>{b.bloPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
              <Share2 className="w-3 h-3" />
              <span>{stats.digitalSlipsSent} Shared</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
              <Printer className="w-3 h-3" />
              <span>{stats.slipsPrinted} Printed</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
