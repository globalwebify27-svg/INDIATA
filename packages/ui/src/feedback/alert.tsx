import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  onClose?: () => void;
  className?: string;
}

export function Alert({
  title,
  children,
  variant = "info",
  onClose,
  className,
}: AlertProps) {
  const variantStyles = {
    info: {
      container: "bg-[#E0EDFE]/60 dark:bg-[#0D79FD]/15 border-[#2087FE]/30 text-slate-800 dark:text-slate-200",
      icon: <Info className="w-4 h-4 text-[#2087FE] shrink-0 mt-0.5" />,
      title: "text-[#1A6ED1] dark:text-[#38BDF8]",
    },
    success: {
      container: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200",
      icon: <CheckCircle2 className="w-4 h-4 text-[#12CF94] shrink-0 mt-0.5" />,
      title: "text-emerald-800 dark:text-emerald-300",
    },
    warning: {
      container: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200",
      icon: <AlertTriangle className="w-4 h-4 text-[#FC7C36] shrink-0 mt-0.5" />,
      title: "text-amber-800 dark:text-amber-300",
    },
    error: {
      container: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-200",
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      title: "text-rose-800 dark:text-rose-300",
    },
  }[variant];

  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          "p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed transition-all",
          variantStyles.container,
          className
        )
      )}
    >
      {variantStyles.icon}
      <div className="flex-1">
        {title && (
          <div className={clsx("font-bold text-xs mb-0.5", variantStyles.title)}>
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
