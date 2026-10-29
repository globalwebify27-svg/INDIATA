"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export type ActionCardColor = "coral" | "amber" | "purple" | "blue";

export interface AdminActionCardProps {
  title: string;
  count: number;
  countLabel: string;
  description: string;
  priority: string;
  icon: React.ReactNode;
  colorVariant: ActionCardColor;
  buttonLabel: string;
  onClick: () => void;
}

export function AdminActionCard({
  title,
  count,
  countLabel,
  description,
  priority,
  icon,
  colorVariant,
  buttonLabel,
  onClick,
}: AdminActionCardProps) {
  const styles = {
    coral: {
      cardBg: "bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/60 hover:border-rose-300",
      iconBg: "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
      badge: "bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800",
      priorityText: "text-rose-700 dark:text-rose-400",
      buttonBorder: "border-rose-200 dark:border-rose-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-800 dark:text-rose-200",
    },
    amber: {
      cardBg: "bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 hover:border-amber-300",
      iconBg: "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
      badge: "bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800",
      priorityText: "text-amber-700 dark:text-amber-400",
      buttonBorder: "border-amber-200 dark:border-amber-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200",
    },
    purple: {
      cardBg: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300",
      iconBg: "bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      badge: "bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      priorityText: "text-blue-700 dark:text-blue-400",
      buttonBorder: "border-blue-200 dark:border-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-800 dark:text-blue-200",
    },
    blue: {
      cardBg: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300",
      iconBg: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
      badge: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
      priorityText: "text-slate-700 dark:text-slate-400",
      buttonBorder: "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200",
    },
  }[colorVariant];

  return (
    <div
      className={`p-4 rounded-2xl border ${styles.cardBg} shadow-soft-card hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
    >
      <div>
        {/* Top Header: Icon + Title + Count Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${styles.iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-200 shadow-2xs`}>
              {icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {title}
              </h4>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${styles.priorityText} font-mono`}>
                {priority}
              </span>
            </div>
          </div>

          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${styles.badge}`}>
            {count} {countLabel}
          </span>
        </div>

        {/* Short Summary Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <Button
        variant="outline"
        size="xs"
        onClick={onClick}
        rightIcon={<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />}
        className={`w-full justify-between rounded-xl font-semibold shadow-2xs ${styles.buttonBorder}`}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
