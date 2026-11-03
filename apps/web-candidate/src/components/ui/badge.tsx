import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-semibold rounded-full";

  const variants = {
    primary:
      "bg-[#ECE8FF] text-[#6256D9] dark:bg-[#1E1B4B] dark:text-[#C5C0FF] border border-[#6256D9]/20",
    secondary:
      "bg-[#EBF3FB] text-[#3986D9] dark:bg-[#0B2545] dark:text-[#88BEF8] border border-[#3986D9]/20",
    success:
      "bg-[#E6F7F5] text-[#159B91] dark:bg-[#042F2E] dark:text-[#5EEAD4] border border-[#159B91]/20",
    warning:
      "bg-[#FEF7ED] text-[#E99A32] dark:bg-[#451A03] dark:text-[#FBBF24] border border-[#E99A32]/20",
    error:
      "bg-[#FDF2F4] text-[#E15B70] dark:bg-[#4C0519] dark:text-[#FDA4AF] border border-[#E15B70]/20",
    neutral:
      "bg-[#F1F3FA] text-[#707E94] dark:bg-[#1E293B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155]",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </span>
  );
}
