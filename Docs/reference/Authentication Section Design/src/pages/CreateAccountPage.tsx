import { useState } from "react";
import AuthLeftPanel from "../components/AuthLeftPanel";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import FormLabel from "../components/ui/FormLabel";
import ErrorMessage from "../components/ui/ErrorMessage";
import type { InputState } from "../components/ui/Input";

interface CreateAccountPageProps {
  onNavigate: (page: "login" | "create-account" | "dashboard") => void;
}

interface FormState {
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FieldErrors {
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

type TouchedState = Partial<Record<keyof FormState, boolean>>;

const validators: Record<string, (value: string, form?: FormState) => string | undefined> = {
  email: (v) => {
    if (!v) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  },
  mobile: (v) => {
    if (!v) return "Mobile number is required";
    if (!/^\+?[\d\s\-().]{7,15}$/.test(v)) return "Enter a valid mobile number";
  },
  password: (v) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter";
    if (!/[0-9]/.test(v)) return "Include at least one number";
  },
  confirmPassword: (v, form) => {
    if (!v) return "Please confirm your password";
    if (form && v !== form.password) return "Passwords do not match";
  },
};

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (!password) return { label: "", color: "bg-slate-200", width: "0%" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "20%" };
  if (score <= 2) return { label: "Fair", color: "bg-orange-400", width: "45%" };
  if (score <= 3) return { label: "Good", color: "bg-yellow-400", width: "65%" };
  if (score <= 4) return { label: "Strong", color: "bg-emerald-400", width: "85%" };
  return { label: "Excellent", color: "bg-emerald-500", width: "100%" };
}

export default function CreateAccountPage({ onNavigate }: CreateAccountPageProps) {
  const [form, setForm] = useState<FormState>({
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedState>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const getFieldState = (field: keyof Omit<FormState, "terms">): InputState => {
    if (status === "loading") return "loading";
    if (!touched[field]) return "idle";
    if (errors[field]) return "error";
    if (form[field]) return "valid";
    return "idle";
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    if (touched[field] && typeof value === "string") {
      const err = validators[field]?.(value, newForm);
      setErrors((prev) => ({ ...prev, [field]: err }));
      if (field === "password" && touched.confirmPassword) {
        const confirmErr = validators.confirmPassword?.(newForm.confirmPassword, newForm);
        setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
      }
    }
  };

  const handleBlur = (field: keyof Omit<FormState, "terms">) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validators[field]?.(form[field] as string, form);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      (["email", "mobile", "password", "confirmPassword"] as const).map((k) => [k, true])
    ) as TouchedState;
    setTouched(allTouched);

    const newErrors: FieldErrors = {};
    (["email", "mobile", "password", "confirmPassword"] as const).forEach((field) => {
      newErrors[field] = validators[field]?.(form[field] as string, form);
    });
    if (!form.terms) newErrors.terms = "You must accept the terms to continue";
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 2000));
    setStatus("success");
    await new Promise((r) => setTimeout(r, 800));
    onNavigate("login");
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="min-h-full grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[55%_45%]">
      <AuthLeftPanel />

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="8" width="18" height="12" rx="2" stroke="white" strokeWidth="1.8" />
                <path d="M7 8V6a4 4 0 018 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M7.5 14.5l2 2L14.5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-slate-900" style={{ fontFamily: "Fraunces, serif" }}>VoterX</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              Create your account
            </h2>
            <p className="text-sm text-slate-500">Join VoterX to manage elections and campaigns.</p>
          </div>

          {status === "success" && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
              <svg className="text-emerald-500 mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-emerald-800">Account created successfully!</p>
                <p className="text-xs text-emerald-600 mt-0.5">Redirecting you to sign in…</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <FormLabel htmlFor="ca-email" required>Email Address</FormLabel>
              <Input
                id="ca-email"
                type="email"
                placeholder="you@organization.gov"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                state={getFieldState("email")}
              />
              <ErrorMessage message={touched.email ? errors.email : undefined} />
            </div>

            <div>
              <FormLabel htmlFor="ca-mobile" required>Mobile Number</FormLabel>
              <Input
                id="ca-mobile"
                type="tel"
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
                value={form.mobile}
                onChange={handleChange("mobile")}
                onBlur={handleBlur("mobile")}
                state={getFieldState("mobile")}
              />
              <ErrorMessage message={touched.mobile ? errors.mobile : undefined} />
            </div>

            <div>
              <FormLabel htmlFor="ca-password" required>Password</FormLabel>
              <PasswordInput
                id="ca-password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                state={getFieldState("password")}
              />
              <ErrorMessage message={touched.password ? errors.password : undefined} />
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-1 flex-1 rounded-full bg-slate-100 overflow-hidden mr-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <FormLabel htmlFor="ca-confirm" required>Confirm Password</FormLabel>
              <PasswordInput
                id="ca-confirm"
                placeholder="Repeat your password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                state={getFieldState("confirmPassword")}
              />
              <ErrorMessage message={touched.confirmPassword ? errors.confirmPassword : undefined} />
            </div>

            <div className="pt-1">
              <Checkbox
                id="ca-terms"
                checked={form.terms}
                onChange={handleChange("terms")}
                error={errors.terms}
                label={
                  <span>
                    I agree to VoterX&apos;s{" "}
                    <button type="button" className="text-blue-600 hover:underline font-medium">
                      Terms &amp; Conditions
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-blue-600 hover:underline font-medium">
                      Privacy Policy
                    </button>
                  </span>
                }
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
              {status === "success"
                ? "Account Created"
                : status === "loading"
                ? "Creating Account…"
                : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
