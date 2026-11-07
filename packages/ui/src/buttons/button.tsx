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
    "bg-[#2087FE] hover:bg-[#1A6ED1] active:bg-[#1558A8] text-white shadow-premium-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#2087FE]/40 dark:bg-[#0D79FD] dark:hover:bg-[#0b66d4]",
  secondary:
    "bg-[#010627] hover:bg-[#072439] active:bg-[#062237] text-white shadow-premium-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#010627]/40 dark:bg-[#072439] dark:hover:bg-[#0e3554] dark:text-[#F5F6F6] dark:border-[#0e3554]",
  outline:
    "bg-white dark:bg-[#062237] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] border border-slate-200 dark:border-[#0e3554] shadow-premium-xs focus-visible:ring-2 focus-visible:ring-[#2087FE]/40",
  ghost:
    "bg-transparent hover:bg-[#E0EDFE]/80 dark:hover:bg-[#072439] text-slate-700 dark:text-[#F5F6F6] focus-visible:ring-2 focus-visible:ring-[#2087FE]/40",
  danger:
    "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-premium-xs border border-transparent focus-visible:ring-2 focus-visible:ring-rose-500/40 dark:bg-rose-700 dark:hover:bg-rose-600",
  success:
    "bg-[#12CF94] hover:bg-[#0EAC7A] active:bg-[#0a875f] text-slate-950 font-bold shadow-premium-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#12CF94]/40 dark:bg-[#01C588] dark:hover:bg-[#01A370]",
  teal:
    "bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-2 focus-visible:ring-emerald-500/40 shadow-premium-xs border border-transparent",
  navy:
    "bg-slate-900 hover:bg-slate-950 text-white focus-visible:ring-2 focus-visible:ring-slate-800/40 shadow-premium-xs border border-transparent",
  amber:
    "bg-[#FC7C36] hover:bg-[#E06622] text-white focus-visible:ring-2 focus-visible:ring-amber-500/40 shadow-premium-xs border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs gap-1.5 rounded-md",
  sm: "px-3 py-1.5 text-xs font-medium gap-1.5 rounded-lg",
  md: "px-4 py-2 text-sm font-medium gap-2 rounded-lg",
  lg: "px-5 py-2.5 text-base font-medium gap-2.5 rounded-xl",
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
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
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
