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
      "bg-[#B3EDD7] dark:bg-emerald-950/60 text-[#010627] dark:text-emerald-300 border-[#12CF94]/40 dark:border-emerald-800",
    dot: "bg-[#12CF94]",
  },
  warning: {
    container:
      "bg-[#FC7C36]/15 dark:bg-amber-950/60 text-[#FC7C36] dark:text-amber-300 border-[#FC7C36]/30 dark:border-amber-800",
    dot: "bg-[#FC7C36]",
  },
  danger: {
    container:
      "bg-[#FC7C36]/15 dark:bg-rose-950/60 text-[#FC7C36] dark:text-rose-300 border-[#FC7C36]/30 dark:border-rose-800",
    dot: "bg-[#FC7C36]",
  },
  info: {
    container:
      "bg-[#E0EDFE] dark:bg-sky-950/60 text-[#2087FE] dark:text-sky-300 border-[#ACB9D1] dark:border-sky-800",
    dot: "bg-[#2087FE]",
  },
  purple: {
    container:
      "bg-[#E0EDFE] dark:bg-indigo-950/60 text-[#2087FE] dark:text-indigo-300 border-[#ACB9D1] dark:border-indigo-800",
    dot: "bg-[#2087FE]",
  },
  neutral: {
    container:
      "bg-[#F3F8FD] dark:bg-slate-800 text-[#717785] dark:text-slate-300 border-[#ACB9D1] dark:border-slate-700",
    dot: "bg-[#717785]",
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
