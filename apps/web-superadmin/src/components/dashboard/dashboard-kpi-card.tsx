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
      borderHover: "hover:border-[#2087FE]/50",
      iconBg: "bg-[#E0EDFE] dark:bg-[#2B241E] text-[#2087FE] dark:text-[#FFB77D]",
      badge: "bg-[#E0EDFE] dark:bg-[#2B241E] text-[#2087FE] dark:text-[#FFB77D] border-[#ACB9D1] dark:border-[#3F372F]",
    },
    green: {
      borderHover: "hover:border-[#12CF94]/50",
      iconBg: "bg-[#B3EDD7]/60 dark:bg-[#005323]/40 text-[#12CF94] dark:text-[#92F5A4]",
      badge: "bg-[#B3EDD7] dark:bg-[#005323]/40 text-[#010627] dark:text-[#92F5A4] border-[#12CF94]/40 dark:border-[#005323]",
    },
    amber: {
      borderHover: "hover:border-[#FC7C36]/50",
      iconBg: "bg-[#FC7C36]/15 dark:bg-[#6E3900] text-[#FC7C36] dark:text-[#FFB77D]",
      badge: "bg-[#FC7C36]/15 dark:bg-[#6E3900] text-[#FC7C36] dark:text-[#FFDCC3] border-[#FC7C36]/30",
    },
    violet: {
      borderHover: "hover:border-[#2087FE]/50",
      iconBg: "bg-[#E0EDFE] dark:bg-[#3D0089] text-[#2087FE] dark:text-[#D2BBFF]",
      badge: "bg-[#E0EDFE] dark:bg-[#3D0089] text-[#2087FE] dark:text-[#D2BBFF] border-[#ACB9D1]",
    },
    navy: {
      borderHover: "hover:border-[#2087FE]/50",
      iconBg: "bg-[#E0EDFE] dark:bg-[#2B241E] text-[#2087FE] dark:text-[#FFB77D]",
      badge: "bg-[#E0EDFE] dark:bg-[#2B241E] text-[#2087FE] dark:text-[#FFB77D] border-[#ACB9D1]",
    },
  }[themeColor] || {
    borderHover: "hover:border-[#2087FE]/50",
    iconBg: "bg-[#E0EDFE] text-[#2087FE]",
    badge: "bg-[#E0EDFE] text-[#2087FE] border-[#ACB9D1]",
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
      className={`group relative p-5 rounded-xl bg-[#FDFEFE] dark:bg-[#201A15] border border-[#ACB9D1] dark:border-[#352B22] shadow-2xs ${themeConfig.borderHover} transition-all duration-150 cursor-pointer overflow-hidden flex flex-col justify-between`}
    >
      <div>
        {/* Card Header: Title + Icon */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#717785] dark:text-[#DBC2B0]">
              {title}
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#010627] dark:text-[#F7EFE9] mt-1 tracking-tight tabular-nums">
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
      <div className="mt-4 pt-3 border-t border-[#ACB9D1] dark:border-[#352B22] flex items-center justify-between text-xs text-[#717785] dark:text-[#DBC2B0]">
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
