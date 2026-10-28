import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  withDot?: boolean;
}

const variantClasses: Record<BadgeVariant, { container: string; dot: string }> = {
  success: {
    container:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  warning: {
    container:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  danger: {
    container:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
  },
  info: {
    container:
      "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    dot: "bg-sky-500",
  },
  purple: {
    container:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    dot: "bg-indigo-500",
  },
  neutral: {
    container:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

export function Badge({
  variant = "neutral",
  withDot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const current = variantClasses[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border select-none ${current.container} ${className}`}
      {...props}
    >
      {withDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      )}
      {children}
    </span>
  );
}
