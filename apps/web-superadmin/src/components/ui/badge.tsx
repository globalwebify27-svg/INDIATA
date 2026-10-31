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
      "bg-[#B3EDD7] dark:bg-[#01C588]/15 text-[#010627] dark:text-[#01C588] border-[#12CF94]/40 dark:border-[#01C588]/30",
    dot: "bg-[#12CF94] dark:bg-[#01C588]",
  },
  warning: {
    container:
      "bg-[#FC7C36]/15 dark:bg-[#F48637]/15 text-[#FC7C36] dark:text-[#F48637] border-[#FC7C36]/30 dark:border-[#F48637]/30",
    dot: "bg-[#FC7C36] dark:bg-[#F48637]",
  },
  danger: {
    container:
      "bg-[#FC7C36]/15 dark:bg-[#F48637]/15 text-[#FC7C36] dark:text-[#F48637] border-[#FC7C36]/30 dark:border-[#F48637]/30",
    dot: "bg-[#FC7C36] dark:bg-[#F48637]",
  },
  info: {
    container:
      "bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD] border-[#ACB9D1] dark:border-[#0D79FD]/30",
    dot: "bg-[#2087FE] dark:bg-[#0D79FD]",
  },
  purple: {
    container:
      "bg-[#E0EDFE] dark:bg-[#6C43FC]/15 text-[#2087FE] dark:text-[#6C43FC] border-[#ACB9D1] dark:border-[#6C43FC]/30",
    dot: "bg-[#2087FE] dark:bg-[#6C43FC]",
  },
  neutral: {
    container:
      "bg-[#F3F8FD] dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8] border-[#ACB9D1] dark:border-[#0e3554]",
    dot: "bg-[#717785] dark:bg-[#94A3B8]",
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
