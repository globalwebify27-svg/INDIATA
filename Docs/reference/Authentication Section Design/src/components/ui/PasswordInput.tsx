import { forwardRef, useState } from "react";
import Input, { type InputState } from "./Input";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  state?: InputState;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ state = "idle", ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        {...props}
        type={visible ? "text" : "password"}
        state={state}
        rightElement={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
