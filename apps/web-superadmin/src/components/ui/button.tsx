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
