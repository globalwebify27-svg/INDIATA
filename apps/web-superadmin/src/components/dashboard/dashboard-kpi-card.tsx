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
      borderHover: "hover:border-[#2087FE]/60 dark:hover:border-[#0D79FD]/60",
      accentBar: "bg-gradient-to-r from-[#2087FE] to-[#38BDF8]",
      iconBg: "bg-gradient-to-br from-[#2087FE] to-[#0D62D9] text-white shadow-2xs shadow-[#2087FE]/25",
      badge: "bg-blue-50 dark:bg-blue-950/50 text-[#1D4ED8] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800/60",
    },
    green: {
      borderHover: "hover:border-[#12CF94]/60 dark:hover:border-[#01C588]/60",
      accentBar: "bg-gradient-to-r from-[#12CF94] to-[#10B981]",
      iconBg: "bg-gradient-to-br from-[#12CF94] to-[#0AA675] text-white shadow-2xs shadow-[#12CF94]/25",
      badge: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    },
    amber: {
      borderHover: "hover:border-[#FC7C36]/60 dark:hover:border-[#F48637]/60",
      accentBar: "bg-gradient-to-r from-[#FC7C36] to-[#F59E0B]",
      iconBg: "bg-gradient-to-br from-[#FC7C36] to-[#E25C18] text-white shadow-2xs shadow-[#FC7C36]/25",
      badge: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    },
    violet: {
      borderHover: "hover:border-[#7C3AED]/60 dark:hover:border-[#8B5CF6]/60",
      accentBar: "bg-gradient-to-r from-[#7C3AED] to-[#A855F7]",
      iconBg: "bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white shadow-2xs shadow-[#7C3AED]/25",
      badge: "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    },
    navy: {
      borderHover: "hover:border-[#2087FE]/60 dark:hover:border-[#0D79FD]/60",
      accentBar: "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB]",
      iconBg: "bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white shadow-2xs shadow-[#2087FE]/25",
      badge: "bg-blue-50 dark:bg-blue-950/50 text-[#2087FE] dark:text-[#0D79FD] border-blue-200 dark:border-blue-800/60",
    },
  }[themeColor] || {
    borderHover: "hover:border-[#2087FE]/60 dark:hover:border-[#0D79FD]/60",
    accentBar: "bg-gradient-to-r from-[#2087FE] to-[#38BDF8]",
    iconBg: "bg-gradient-to-br from-[#2087FE] to-[#0D62D9] text-white shadow-2xs shadow-[#2087FE]/25",
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
      className={`group relative p-4 rounded-xl bg-white dark:bg-[#062237] border border-[#ACB9D1]/80 dark:border-[#0e3554] shadow-xs hover:shadow-md ${themeConfig.borderHover} hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between`}
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
            className={`p-2 rounded-lg ${themeConfig.iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-200`}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Footer Subtext and Badge */}
      <div className="mt-3 pt-2.5 border-t border-[#ACB9D1]/40 dark:border-[#0e3554] flex items-center justify-between text-[11px] text-[#717785] dark:text-[#94A3B8]">
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
