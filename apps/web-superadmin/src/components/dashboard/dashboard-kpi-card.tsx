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
      borderHover: "hover:border-[#8D4B00]/50",
      iconBg: "bg-[#FAF2EB] dark:bg-[#2B241E] text-[#8D4B00] dark:text-[#FFB77D]",
      badge: "bg-[#FAF2EB] dark:bg-[#2B241E] text-[#8D4B00] dark:text-[#FFB77D] border-[#EAE5DC] dark:border-[#3F372F]",
    },
    green: {
      borderHover: "hover:border-[#006D30]/50",
      iconBg: "bg-[#DCFCE7]/60 dark:bg-[#005323]/40 text-[#006D30] dark:text-[#92F5A4]",
      badge: "bg-[#DCFCE7]/60 dark:bg-[#005323]/40 text-[#006D30] dark:text-[#92F5A4] border-[#92F5A4] dark:border-[#005323]",
    },
    amber: {
      borderHover: "hover:border-[#B15F00]/50",
      iconBg: "bg-[#FFDCC3] dark:bg-[#6E3900] text-[#8D4B00] dark:text-[#FFB77D]",
      badge: "bg-[#FFDCC3] dark:bg-[#6E3900] text-[#6E3900] dark:text-[#FFDCC3] border-[#B15F00]/20",
    },
    violet: {
      borderHover: "hover:border-[#712AE2]/50",
      iconBg: "bg-[#EADDFF] dark:bg-[#3D0089] text-[#712AE2] dark:text-[#D2BBFF]",
      badge: "bg-[#EADDFF] dark:bg-[#3D0089] text-[#25005A] dark:text-[#D2BBFF] border-[#8A4CFC]/20",
    },
    navy: {
      borderHover: "hover:border-[#8D4B00]/50",
      iconBg: "bg-[#FAF2EB] dark:bg-[#2B241E] text-[#8D4B00] dark:text-[#FFB77D]",
      badge: "bg-[#FAF2EB] dark:bg-[#2B241E] text-[#8D4B00] dark:text-[#FFB77D] border-[#EAE5DC]",
    },
  }[themeColor] || {
    borderHover: "hover:border-[#8D4B00]/50",
    iconBg: "bg-[#FAF2EB] text-[#8D4B00]",
    badge: "bg-[#FAF2EB] text-[#8D4B00] border-[#EAE5DC]",
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
      className={`group relative p-5 rounded-xl bg-white dark:bg-[#201A15] border border-[#EAE5DC] dark:border-[#352B22] shadow-2xs ${themeConfig.borderHover} transition-all duration-150 cursor-pointer overflow-hidden flex flex-col justify-between`}
    >
      <div>
        {/* Card Header: Title + Icon */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#554336] dark:text-[#DBC2B0]">
              {title}
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B17] dark:text-[#F7EFE9] mt-1 tracking-tight tabular-nums">
              {displayValue}
            </h3>
          </div>

          <div
            className={`p-2.5 rounded-xl ${themeConfig.iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-150`}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Footer Subtext and Badge */}
      <div className="mt-4 pt-3 border-t border-[#EAE5DC] dark:border-[#352B22] flex items-center justify-between text-xs text-[#554336] dark:text-[#DBC2B0]">
        <span className="truncate pr-2">{primarySubtext}</span>
        {badgeText && (
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex-shrink-0 ${themeConfig.badge}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
