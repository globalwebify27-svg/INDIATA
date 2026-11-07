import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface MetricProgressProps {
  label: string;
  value: number;
  max?: number;
  color?: "primary" | "success" | "warning" | "danger" | "purple" | "neutral";
  showValue?: boolean;
  valueFormatter?: (val: number, max: number) => string;
  className?: string;
}

export function MetricProgress({
  label,
  value,
  max = 100,
  color = "primary",
  showValue = true,
  valueFormatter,
  className,
}: MetricProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const barColor = {
    primary: "bg-[#2087FE] dark:bg-[#0D79FD]",
    success: "bg-[#12CF94] dark:bg-[#01C588]",
    warning: "bg-[#FC7C36] dark:bg-[#F48637]",
    danger: "bg-rose-500",
    purple: "bg-purple-600",
    neutral: "bg-slate-600",
  }[color];

  return (
    <div className={twMerge(clsx("space-y-1.5", className))}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span>
        {showValue && (
          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
            {valueFormatter ? valueFormatter(value, max) : `${Math.round(percentage)}%`}
          </span>
        )}
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
