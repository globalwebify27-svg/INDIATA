import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface MeterSegment {
  label: string;
  value: number;
  color: string; // e.g. '#2087FE' or Tailwind color
  countFormatted?: string;
}

export interface StatMeterProps {
  segments: MeterSegment[];
  total?: number;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export function StatMeter({
  segments,
  total,
  height = 8,
  showLegend = true,
  className,
}: StatMeterProps) {
  const calculatedTotal = total ?? segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className={twMerge(clsx("space-y-2.5", className))}>
      {/* Stacked Horizontal Meter */}
      <div
        className="w-full flex rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800"
        style={{ height }}
      >
        {segments.map((segment, idx) => {
          const pct = calculatedTotal > 0 ? (segment.value / calculatedTotal) * 100 : 0;
          if (pct === 0) return null;

          return (
            <div
              key={idx}
              className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${pct}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.label}: ${segment.value} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center gap-4 flex-wrap text-xs">
          {segments.map((segment, idx) => {
            const pct = calculatedTotal > 0 ? Math.round((segment.value / calculatedTotal) * 100) : 0;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {segment.label}
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {segment.countFormatted ?? `${pct}%`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
