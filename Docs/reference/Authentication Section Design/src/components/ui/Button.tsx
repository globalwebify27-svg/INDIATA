interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  success?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500/30 border-transparent",
  secondary:
    "bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-300/40 border-slate-200",
  ghost:
    "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300/30 border-transparent",
};

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  variant = "primary",
  loading = false,
  success = false,
  size = "md",
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold",
        "transition-all duration-150 focus:outline-none focus:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        variantClasses[variant],
        sizeClasses[size],
        success ? "bg-emerald-600 hover:bg-emerald-600 border-transparent" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {success && !loading && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {children}
    </button>
  );
}
