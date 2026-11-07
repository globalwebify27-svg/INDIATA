import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  changePeriod?: string;
  icon?: React.ReactNode;
  iconColor?: "primary" | "success" | "warning" | "danger" | "purple" | "neutral";
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "increase",
  changePeriod,
  icon,
  iconColor = "primary",
  subtitle,
  className,
  onClick,
}: StatCardProps) {
  const iconBgStyles = {
    primary: "bg-[#E0EDFE] text-[#2087FE] dark:bg-[#0D79FD]/20 dark:text-[#0D79FD]",
    success: "bg-emerald-50 text-[#12CF94] dark:bg-emerald-950/40 dark:text-[#01C588]",
    warning: "bg-amber-50 text-[#FC7C36] dark:bg-amber-950/40 dark:text-[#F48637]",
    danger: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  }[iconColor];

  const changeStyles = {
    increase: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
    decrease: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40",
    neutral: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
  }[changeType];

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={twMerge(
        clsx(
          "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-premium-xs transition-all duration-200",
          onClick ? "cursor-pointer hover:shadow-premium-md hover:border-slate-300 dark:hover:border-slate-700" : "",
          className
        )
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
          {title}
        </span>
        {icon && (
          <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", iconBgStyles)}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
          {value}
        </div>

        {change && (
          <div className={clsx("inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold", changeStyles)}>
            {changeType === "increase" && <ArrowUpRight className="w-3 h-3" />}
            {changeType === "decrease" && <ArrowDownRight className="w-3 h-3" />}
            {changeType === "neutral" && <Minus className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {(subtitle || changePeriod) && (
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {subtitle ?? changePeriod}
        </div>
      )}
    </div>
  );
}
