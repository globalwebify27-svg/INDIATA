"use client";

import React from "react";
import { Search, X, Filter, SlidersHorizontal, Users, CheckCircle2, Star, Phone } from "lucide-react";
import { useKaryakartaLanguage } from "../../context/karyakarta-language-context";

interface VoterSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeQuickFilter: string;
  onQuickFilterChange: (filter: string) => void;
  onOpenAdvancedFilter?: () => void;
  totalCount: number;
}

export function VoterSearchBar({
  searchQuery,
  onSearchChange,
  activeQuickFilter,
  onQuickFilterChange,
  onOpenAdvancedFilter,
  totalCount,
}: VoterSearchBarProps) {
  const { t } = useKaryakartaLanguage();

  const quickFilters = [
    { id: "all", label: "All Voters", icon: Users },
    { id: "visited", label: "Visited", icon: CheckCircle2 },
    { id: "unvisited", label: "Unvisited", icon: Filter },
    { id: "important", label: "Important / Starred", icon: Star },
    { id: "has_phone", label: "With Mobile", icon: Phone },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t(
              "common.search",
              "Search by voter name, Marathi name, EPIC ID, phone, or house number..."
            )}
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#2087FE] focus:border-[#2087FE] placeholder-slate-400 shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Advanced Filter Trigger Button */}
        {onOpenAdvancedFilter && (
          <button
            onClick={onOpenAdvancedFilter}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2087FE]" />
            <span>Advanced Filters</span>
          </button>
        )}
      </div>

      {/* Quick Filter Chips Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {quickFilters.map((qf) => {
            const Icon = qf.icon;
            const isSelected = activeQuickFilter === qf.id;
            return (
              <button
                key={qf.id}
                onClick={() => onQuickFilterChange(qf.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#2087FE] text-white shadow-xs font-semibold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{qf.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
          {totalCount.toLocaleString()} Matching Voters
        </span>
      </div>
    </div>
  );
}
