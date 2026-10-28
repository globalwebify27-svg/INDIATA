import { useId } from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  error?: string;
}

export default function Checkbox({ label, error, id: propId, className = "", checked, ...props }: CheckboxProps) {
  const generatedId = useId();
  const id = propId ?? generatedId;

  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0 w-4 h-4">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            {...props}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className={[
              "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 pointer-events-none",
              checked ? "bg-blue-600 border-blue-600" : error ? "border-red-400" : "border-slate-300 group-hover:border-slate-400",
            ].join(" ")}
          >
            {checked && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5L8.5 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm text-slate-600 leading-snug select-none">{label}</span>
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
