import { forwardRef } from "react";

export type InputState = "idle" | "error" | "valid" | "loading";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState;
  rightElement?: React.ReactNode;
}

const stateClasses: Record<InputState, string> = {
  idle: "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20",
  error: "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30",
  valid: "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20",
  loading: "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 opacity-70",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ state = "idle", rightElement, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          {...props}
          className={[
            "w-full h-11 px-3.5 rounded-lg border bg-white text-sm text-slate-900",
            "placeholder:text-slate-400 outline-none",
            "focus:ring-2 transition-all duration-150",
            rightElement ? "pr-10" : "",
            stateClasses[state],
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
        {state === "valid" && !rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
