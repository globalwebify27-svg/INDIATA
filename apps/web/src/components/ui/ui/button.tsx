import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "teal" | "navy" | "amber";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

    const variants = {
      primary:
        "bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 shadow-xs active:scale-[0.98]",
      secondary:
        "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-xs active:scale-[0.98]",
      navy:
        "bg-slate-900 hover:bg-slate-950 text-white focus:ring-slate-800 shadow-xs active:scale-[0.98]",
      teal:
        "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-xs active:scale-[0.98]",
      amber:
        "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500 shadow-xs active:scale-[0.98]",
      outline:
        "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-brand-500 shadow-premium-xs",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-xs active:scale-[0.98]",
      ghost:
        "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
      md: "text-xs px-3.5 py-2 h-9 gap-2",
      lg: "text-sm px-5 py-2.5 h-10 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
