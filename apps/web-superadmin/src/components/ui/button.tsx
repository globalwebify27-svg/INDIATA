"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sky-600 hover:bg-sky-700 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-sky-500",
  secondary:
    "bg-slate-800 hover:bg-slate-900 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600",
  outline:
    "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-xs focus-visible:ring-2 focus-visible:ring-slate-400",
  ghost:
    "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-slate-400",
  danger:
    "bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-rose-500",
  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-emerald-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs gap-1.5 rounded-md",
  sm: "px-3 py-1.5 text-xs font-medium gap-1.5 rounded-lg",
  md: "px-4 py-2 text-sm font-medium gap-2 rounded-lg",
  lg: "px-5 py-2.5 text-base font-medium gap-2.5 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "sm",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
