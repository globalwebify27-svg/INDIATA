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
      borderHover: "hover:border-[#2087FE]/50 dark:hover:border-[#0D79FD]/50",
      iconBg: "bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD]",
      badge: "bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD] border-[#ACB9D1] dark:border-[#0e3554]",
    },
    green: {
      borderHover: "hover:border-[#12CF94]/50 dark:hover:border-[#01C588]/50",
      iconBg: "bg-[#B3EDD7]/60 dark:bg-[#01C588]/15 text-[#12CF94] dark:text-[#01C588]",
      badge: "bg-[#B3EDD7] dark:bg-[#01C588]/15 text-[#010627] dark:text-[#01C588] border-[#12CF94]/40 dark:border-[#01C588]/30",
    },
    amber: {
      borderHover: "hover:border-[#FC7C36]/50 dark:hover:border-[#F48637]/50",
      iconBg: "bg-[#FC7C36]/15 dark:bg-[#F48637]/15 text-[#FC7C36] dark:text-[#F48637]",
      badge: "bg-[#FC7C36]/15 dark:bg-[#F48637]/15 text-[#FC7C36] dark:text-[#F48637] border-[#FC7C36]/30 dark:border-[#F48637]/30",
    },
    violet: {
      borderHover: "hover:border-[#2087FE]/50 dark:hover:border-[#6C43FC]/50",
      iconBg: "bg-[#E0EDFE] dark:bg-[#6C43FC]/15 text-[#2087FE] dark:text-[#6C43FC]",
      badge: "bg-[#E0EDFE] dark:bg-[#6C43FC]/15 text-[#2087FE] dark:text-[#6C43FC] border-[#ACB9D1] dark:border-[#0e3554]",
    },
    navy: {
      borderHover: "hover:border-[#2087FE]/50 dark:hover:border-[#0D79FD]/50",
      iconBg: "bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD]",
      badge: "bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD] border-[#ACB9D1] dark:border-[#0e3554]",
    },
  }[themeColor] || {
    borderHover: "hover:border-[#2087FE]/50 dark:hover:border-[#0D79FD]/50",
    iconBg: "bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD]",
    badge: "bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD] border-[#ACB9D1] dark:border-[#0e3554]",
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
      className={`group relative p-5 rounded-xl bg-[#FDFEFE] dark:bg-[#062237] border border-[#ACB9D1] dark:border-[#0e3554] shadow-2xs ${themeConfig.borderHover} transition-all duration-150 cursor-pointer overflow-hidden flex flex-col justify-between`}
    >
      <div>
        {/* Card Header: Title + Icon */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#717785] dark:text-[#94A3B8]">
              {title}
            </p>
            <h3 className="text-[28px] sm:text-[32px] font-bold text-[#010627] dark:text-[#F5F6F6] mt-1 tracking-tight tabular-nums">
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
      <div className="mt-4 pt-3 border-t border-[#ACB9D1] dark:border-[#0e3554] flex items-center justify-between text-xs text-[#717785] dark:text-[#94A3B8]">
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
