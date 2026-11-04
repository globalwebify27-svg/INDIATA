"use client";

import React from "react";
import { useCountUp } from "../../hooks/use-count-up";

export type KpiThemeColor = "saffron" | "green" | "amber" | "violet" | "navy";

export interface DashboardKpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  themeColor: KpiThemeColor;
  badgeText?: string;
  primarySubtext: string;
  secondarySubtext?: string;
  onClick?: () => void;
}

export function DashboardKpiCard({
  title,
  value,
  icon,
  themeColor,
  badgeText,
  primarySubtext,
  onClick,
}: DashboardKpiCardProps) {
  const numericValue = typeof value === "number" ? value : 0;
  const animatedValue = useCountUp(numericValue, 750);
  const displayValue = typeof value === "number" ? animatedValue : value;

  const themeConfig = {
    saffron: {
      borderHover: "hover:border-[#2087FE]/40 dark:hover:border-[#0D79FD]/40",
      accentBar: "bg-[#2087FE]",
      iconBg: "bg-blue-50 dark:bg-blue-950/50 text-[#2087FE] dark:text-[#38BDF8]",
      badge: "bg-blue-50 dark:bg-blue-950/50 text-[#1D4ED8] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800/60",
    },
    green: {
      borderHover: "hover:border-[#12CF94]/40 dark:hover:border-[#01C588]/40",
      accentBar: "bg-[#12CF94]",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    },
    amber: {
      borderHover: "hover:border-[#FC7C36]/40 dark:hover:border-[#F48637]/40",
      accentBar: "bg-[#FC7C36]",
      iconBg: "bg-orange-50 dark:bg-orange-950/50 text-orange-500 dark:text-orange-400",
      badge: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    },
    violet: {
      borderHover: "hover:border-[#7C3AED]/40 dark:hover:border-[#8B5CF6]/40",
      accentBar: "bg-[#7C3AED]",
      iconBg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
      badge: "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    },
    navy: {
      borderHover: "hover:border-[#2087FE]/40 dark:hover:border-[#0D79FD]/40",
      accentBar: "bg-[#1E3A8A]",
      iconBg: "bg-blue-50 dark:bg-blue-950/50 text-[#1E3A8A] dark:text-[#60A5FA]",
      badge: "bg-blue-50 dark:bg-blue-950/50 text-[#2087FE] dark:text-[#0D79FD] border-blue-200 dark:border-blue-800/60",
    },
  }[themeColor] || {
    borderHover: "hover:border-[#2087FE]/40 dark:hover:border-[#0D79FD]/40",
    accentBar: "bg-[#2087FE]",
    iconBg: "bg-blue-50 dark:bg-blue-950/50 text-[#2087FE] dark:text-[#38BDF8]",
    badge: "bg-blue-50 dark:bg-blue-950/50 text-[#2087FE] dark:text-[#0D79FD] border-blue-200 dark:border-blue-800/60",
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative p-5 rounded-xl bg-white dark:bg-[#062237] border border-[#E2E8F0] dark:border-[#0e3554] shadow-sm hover:shadow-md ${themeConfig.borderHover} hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between`}
    >
      {/* Subtle Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${themeConfig.accentBar} opacity-90`} />

      <div>
        {/* Card Header: Title + Icon */}
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <p className="text-[11.5px] font-medium text-[#717785] dark:text-[#94A3B8] tracking-wide">
              {title}
            </p>
            <h3 className="text-[22px] sm:text-[24px] font-bold text-[#010627] dark:text-[#F5F6F6] mt-0.5 tracking-tight tabular-nums">
              {displayValue}
            </h3>
          </div>

          <div
            className={`p-2.5 rounded-xl ${themeConfig.iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-200`}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Footer Subtext and Badge */}
      <div className="mt-3 pt-3 border-t border-[#F1F5F9] dark:border-[#0e3554] flex items-center justify-between text-[11px] text-[#717785] dark:text-[#94A3B8]">
        <span className="truncate pr-1.5 font-medium">{primarySubtext}</span>
        {badgeText && (
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold border flex-shrink-0 shadow-2xs ${themeConfig.badge}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
