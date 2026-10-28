import { useState } from "react";
import AuthLeftPanel from "../components/AuthLeftPanel";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import FormLabel from "../components/ui/FormLabel";
import ErrorMessage from "../components/ui/ErrorMessage";
import type { InputState } from "../components/ui/Input";

interface LoginPageProps {
  onNavigate: (page: "login" | "create-account" | "dashboard") => void;
}

interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FieldErrors {
  email?: string;
  password?: string;
  form?: string;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [form, setForm] = useState<FormState>({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const validate = (field: keyof FormState, value: string): string | undefined => {
    if (field === "email") {
      if (!value) return "Email address is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    }
    if (field === "password") {
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
    }
  };

  const getFieldState = (field: "email" | "password"): InputState => {
    if (status === "loading") return "loading";
    if (!touched[field]) return "idle";
    if (errors[field]) return "error";
    if (form[field]) return "valid";
    return "idle";
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      const err = typeof value === "string" ? validate(field, value) : undefined;
      setErrors((e) => ({ ...e, [field]: err }));
    }
  };

  const handleBlur = (field: "email" | "password") => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validate(field, form[field] as string);
    setErrors((e) => ({ ...e, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const emailErr = validate("email", form.email);
    const passwordErr = validate("password", form.password);
    setErrors({ email: emailErr, password: passwordErr });
    if (emailErr || passwordErr) return;

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("success");
    await new Promise((r) => setTimeout(r, 600));
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-full grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[55%_45%]">
      <AuthLeftPanel />

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="8" width="18" height="12" rx="2" stroke="white" strokeWidth="1.8" />
                <path d="M7 8V6a4 4 0 018 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M7.5 14.5l2 2L14.5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-slate-900" style={{ fontFamily: "Fraunces, serif" }}>VoterX</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              Welcome back
            </h2>
            <p className="text-sm text-slate-500">Sign in to your VoterX account to continue.</p>
          </div>

          {errors.form && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <FormLabel htmlFor="email" required>Email address</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@organization.gov"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                state={getFieldState("email")}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              <ErrorMessage id="email-error" message={touched.email ? errors.email : undefined} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FormLabel htmlFor="password" required>Password</FormLabel>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                state={getFieldState("password")}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <ErrorMessage id="password-error" message={touched.password ? errors.password : undefined} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                id="remember"
                label="Remember me for 30 days"
                checked={form.rememberMe}
                onChange={handleChange("rememberMe")}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={status === "loading"}
              success={status === "success"}
              className="mt-2"
            >
              {status === "success" ? "Signed in" : status === "loading" ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("create-account")}
              className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:underline"
            >
              Create Account
            </button>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
            Protected by VoterX security.{" "}
            <button type="button" className="underline hover:text-slate-600">Privacy Policy</button>
            {" · "}
            <button type="button" className="underline hover:text-slate-600">Terms of Service</button>
          </p>
        </div>
      </div>
    </div>
  );
}
