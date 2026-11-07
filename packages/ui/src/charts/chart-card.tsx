import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../cards/card";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  periods?: string[];
  activePeriod?: string;
  onPeriodChange?: (period: string) => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  action,
  periods,
  activePeriod,
  onPeriodChange,
  children,
  footer,
  className,
}: ChartCardProps) {
  return (
    <Card className={twMerge(clsx("overflow-hidden", className))}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>

        <div className="flex items-center gap-2">
          {periods && onPeriodChange && (
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPeriodChange(p)}
                  className={clsx(
                    "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer",
                    activePeriod === p
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-premium-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          {footer}
        </div>
      )}
    </Card>
  );
}
