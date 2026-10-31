"use client";

import React from "react";

export function DashboardLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-28 rounded-2xl bg-[#E0EDFE]/60 dark:bg-slate-800/60" />

      {/* Action Center Skeleton */}
      <div className="h-44 rounded-2xl bg-[#E0EDFE]/50 dark:bg-slate-800/50" />

      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-[#E0EDFE]/60 dark:bg-slate-800/60" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-2xl bg-[#E0EDFE]/50 dark:bg-slate-800/50" />
        <div className="h-72 rounded-2xl bg-[#E0EDFE]/50 dark:bg-slate-800/50" />
      </div>
    </div>
  );
}
