import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "danger"
  | "info"
  | "purple"
  | "neutral"
  | "navy"
  | "ai"
  | "teal";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  withDot?: boolean;
}

export function Badge({
  className,
  variant = "primary",
  size = "md",
  withDot = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-semibold rounded-full tracking-wide";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variants: Record<BadgeVariant, { container: string; dot: string }> = {
    primary: {
      container:
        "bg-[#E0EDFE] text-[#2087FE] dark:bg-[#0D79FD]/20 dark:text-[#0D79FD] border border-[#2087FE]/20 dark:border-[#0D79FD]/30",
      dot: "bg-[#2087FE] dark:bg-[#0D79FD]",
    },
    secondary: {
      container:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
      dot: "bg-indigo-600 dark:bg-indigo-400",
    },
    ai: {
      container:
        "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs",
      dot: "bg-purple-600 dark:bg-purple-400",
    },
    success: {
      container:
        "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      dot: "bg-[#12CF94] dark:bg-[#01C588]",
    },
    teal: {
      container:
        "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border border-cyan-200",
      dot: "bg-cyan-600 dark:bg-cyan-400",
    },
    warning: {
      container:
        "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
      dot: "bg-[#FC7C36] dark:bg-[#F48637]",
    },
    danger: {
      container:
        "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40",
      dot: "bg-rose-500",
    },
    error: {
      container:
        "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200",
      dot: "bg-rose-600",
    },
    info: {
      container:
        "bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD] border border-[#2087FE]/20 dark:border-[#0D79FD]/30",
      dot: "bg-[#2087FE] dark:bg-[#0D79FD]",
    },
    purple: {
      container:
        "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
      dot: "bg-purple-600 dark:bg-purple-400",
    },
    neutral: {
      container:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
      dot: "bg-slate-400 dark:bg-slate-500",
    },
    navy: {
      container:
        "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-800 dark:border-slate-100",
      dot: "bg-white dark:bg-slate-900",
    },
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <span
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], selectedVariant.container, className)
      )}
      {...props}
    >
      {withDot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full mr-1.5 shrink-0",
            selectedVariant.dot
          )}
        />
      )}
      {children}
    </span>
  );
}
