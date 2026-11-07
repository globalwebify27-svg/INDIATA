import React from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "slate" | "success";
}

export function Spinner({
  size = "md",
  color = "primary",
  className,
  ...props
}: SpinnerProps) {
  const sizeStyles = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  }[size];

  const colorStyles = {
    primary: "text-[#2087FE] dark:text-[#0D79FD]",
    white: "text-white",
    slate: "text-slate-500",
    success: "text-[#12CF94]",
  }[color];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={twMerge(clsx("inline-flex items-center justify-center", className))}
      {...props}
    >
      <Loader2 className={clsx("animate-spin shrink-0", sizeStyles, colorStyles)} />
    </div>
  );
}
