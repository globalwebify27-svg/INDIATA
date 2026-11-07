import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ButtonVariant, ButtonSize } from "./button";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  "aria-label": string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: "md" | "lg" | "full";
}

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: "w-7 h-7 p-1 text-xs",
  sm: "w-8 h-8 p-1.5 text-xs",
  md: "w-9 h-9 p-2 text-sm",
  lg: "w-11 h-11 p-2.5 text-base",
};

const iconVariantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#2087FE] hover:bg-[#1A6ED1] text-white dark:bg-[#0D79FD]",
  secondary: "bg-[#010627] hover:bg-[#072439] text-white dark:bg-[#072439]",
  outline: "bg-white dark:bg-[#062237] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] text-slate-700 dark:text-[#F5F6F6] border border-slate-200 dark:border-[#0e3554]",
  ghost: "bg-transparent hover:bg-[#E0EDFE]/80 dark:hover:bg-[#072439] text-slate-600 dark:text-[#F5F6F6]",
  danger: "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40",
  success: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200",
  teal: "bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
  navy: "bg-slate-900 hover:bg-slate-950 text-white",
  amber: "bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      "aria-label": ariaLabel,
      variant = "ghost",
      size = "md",
      rounded = "lg",
      className,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const roundedStyles = {
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    }[rounded];

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={disabled}
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center transition-all select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2087FE]/40 disabled:opacity-50 disabled:cursor-not-allowed",
            iconVariantStyles[variant],
            iconSizeStyles[size],
            roundedStyles,
            className
          )
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
