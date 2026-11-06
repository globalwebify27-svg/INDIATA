"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "teal"
  | "navy"
  | "amber";

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
    "bg-[#2087FE] hover:bg-[#2087FE]/90 dark:bg-[#0D79FD] dark:hover:bg-[#0D79FD]/90 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#2087FE] dark:focus-visible:ring-[#0D79FD]",
  secondary:
    "bg-[#010627] hover:bg-[#010627]/90 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#010627] dark:bg-[#072439] dark:hover:bg-[#072439]/80 dark:text-[#F5F6F6] dark:border-[#0e3554]",
  outline:
    "bg-[#FDFEFE] dark:bg-[#062237] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] border border-[#ACB9D1] dark:border-[#0e3554] shadow-xs focus-visible:ring-2 focus-visible:ring-[#2087FE] dark:focus-visible:ring-[#0D79FD]",
  ghost:
    "bg-transparent hover:bg-[#E0EDFE] dark:hover:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] focus-visible:ring-2 focus-visible:ring-[#2087FE] dark:focus-visible:ring-[#0D79FD]",
  danger:
    "bg-[#FC7C36] hover:bg-[#FC7C36]/90 dark:bg-[#F48637] dark:hover:bg-[#F48637]/90 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#FC7C36] dark:focus-visible:ring-[#F48637]",
  success:
    "bg-[#12CF94] hover:bg-[#12CF94]/90 dark:bg-[#01C588] dark:hover:bg-[#01C588]/90 text-[#010627] dark:text-[#011A2D] font-bold shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#12CF94] dark:focus-visible:ring-[#01C588]",
  teal:
    "bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-xs border border-transparent",
  navy:
    "bg-slate-900 hover:bg-slate-950 text-white focus-visible:ring-2 focus-visible:ring-slate-800 shadow-xs border border-transparent",
  amber:
    "bg-amber-600 hover:bg-amber-700 text-white focus-visible:ring-2 focus-visible:ring-amber-500 shadow-xs border border-transparent",
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
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center font-semibold transition-all duration-150 select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
            variantStyles[variant] || variantStyles.primary,
            sizeStyles[size] || sizeStyles.md,
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
