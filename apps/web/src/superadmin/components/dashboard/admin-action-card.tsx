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
      cardBg: "bg-white dark:bg-[#062237] border-rose-200 dark:border-[#0e3554] hover:border-rose-300 dark:hover:border-[#F48637]/50",
      iconBg: "bg-rose-50 dark:bg-[#F48637]/15 text-rose-700 dark:text-[#F48637] border border-rose-200 dark:border-[#F48637]/30",
      badge: "bg-rose-50 dark:bg-[#F48637]/15 text-rose-800 dark:text-[#F48637] border-rose-200 dark:border-[#F48637]/30",
      priorityText: "text-rose-700 dark:text-[#F48637]",
      buttonBorder: "border-rose-200 dark:border-[#0e3554] hover:bg-rose-50 dark:hover:bg-[#072439] text-rose-800 dark:text-[#F5F6F6]",
    },
    amber: {
      cardBg: "bg-white dark:bg-[#062237] border-amber-200 dark:border-[#0e3554] hover:border-amber-300 dark:hover:border-[#F48637]/50",
      iconBg: "bg-amber-50 dark:bg-[#F48637]/15 text-amber-800 dark:text-[#F48637] border border-amber-200 dark:border-[#F48637]/30",
      badge: "bg-amber-50 dark:bg-[#F48637]/15 text-amber-900 dark:text-[#F48637] border-amber-200 dark:border-[#F48637]/30",
      priorityText: "text-amber-700 dark:text-[#F48637]",
      buttonBorder: "border-amber-200 dark:border-[#0e3554] hover:bg-amber-50 dark:hover:bg-[#072439] text-amber-900 dark:text-[#F5F6F6]",
    },
    purple: {
      cardBg: "bg-white dark:bg-[#062237] border-slate-200 dark:border-[#0e3554] hover:border-blue-300 dark:hover:border-[#6C43FC]/50",
      iconBg: "bg-blue-50 dark:bg-[#6C43FC]/15 text-blue-800 dark:text-[#6C43FC] border border-blue-200 dark:border-[#6C43FC]/30",
      badge: "bg-blue-50 dark:bg-[#6C43FC]/15 text-blue-800 dark:text-[#6C43FC] border-blue-200 dark:border-[#6C43FC]/30",
      priorityText: "text-blue-700 dark:text-[#6C43FC]",
      buttonBorder: "border-blue-200 dark:border-[#0e3554] hover:bg-blue-50 dark:hover:bg-[#072439] text-blue-800 dark:text-[#F5F6F6]",
    },
    blue: {
      cardBg: "bg-white dark:bg-[#062237] border-slate-200 dark:border-[#0e3554] hover:border-slate-300 dark:hover:border-[#0D79FD]/50",
      iconBg: "bg-slate-100 dark:bg-[#0D79FD]/15 text-slate-800 dark:text-[#0D79FD] border border-slate-200 dark:border-[#0D79FD]/30",
      badge: "bg-slate-100 dark:bg-[#0D79FD]/15 text-slate-800 dark:text-[#0D79FD] border-slate-200 dark:border-[#0D79FD]/30",
      priorityText: "text-slate-700 dark:text-[#0D79FD]",
      buttonBorder: "border-slate-200 dark:border-[#0e3554] hover:bg-slate-50 dark:hover:bg-[#072439] text-slate-800 dark:text-[#F5F6F6]",
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
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F6F6] leading-tight">
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
        <p className="text-xs text-slate-600 dark:text-[#94A3B8] mb-4 leading-relaxed">
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
