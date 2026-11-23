"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, BadgeAlert } from "lucide-react";
import { useToast } from "@/context/toast-context";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token") || searchParams.get("otp");
    const idParam = searchParams.get("identifier") || searchParams.get("email");
    if (tokenParam) setOtp(tokenParam);
    if (idParam) setIdentifier(idParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Registered email address or mobile number is required.");
      return;
    }

    if (!otp.trim()) {
      setErrorMessage("Verification code (OTP) is required.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setIsSuccess(true);
        showToast("success", "Password Reset Successful", "Please log in with your new password.");
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      } else {
        const errorMsg = data.message || "Failed to reset password. Please check your verification code.";
        setErrorMessage(errorMsg);
        showToast("error", "Reset Failed", errorMsg);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not connect to authentication service";
      setErrorMessage(msg);
      showToast("error", "Connection Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen h-screen w-full relative flex flex-col items-center justify-center p-3 sm:p-4 bg-[#071426] text-slate-900 selection:bg-[#4F46E5] selection:text-white font-sans antialiased overflow-y-auto sm:overflow-hidden">
      {/* Background Visual Effects & Subtle Glowing Gradients */}
      <div
        className="fixed inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundSize: "36px 36px",
          backgroundImage:
            "linear-gradient(to right, rgba(96, 165, 250, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(96, 165, 250, 0.05) 1px, transparent 1px)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(79, 70, 229, 0.25), transparent)",
        }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-[#4F46E5]/20 via-[#7C3AED]/20 to-[#60A5FA]/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-[440px] relative z-10 flex flex-col justify-center my-auto">
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.65)] p-5 sm:p-6 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2087FE] to-[#6256D9] flex items-center justify-center text-white font-black text-xs shadow-sm shadow-[#2087FE]/20">
                I
              </div>
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wider">
                INDIATA
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#4F46E5] px-2 py-0.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20">
              SECURE RECOVERY
            </span>
          </div>

          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-800">Set New Account Password</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Enter your single-use verification code and choose a new confidential password.
            </p>
          </div>

          {/* Success Message View */}
          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Password Reset Complete!</h3>
              <p className="text-xs text-slate-500">
                Your credentials have been securely updated. Redirecting to login console...
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#4F46E5] font-bold hover:underline"
                >
                  <span>Go to Login Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                  <BadgeAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Identifier Field */}
              <div>
                <label className="block text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                  REGISTERED EMAIL OR MOBILE <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. superadmin@indiata.in"
                  className="block w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                />
              </div>

              {/* OTP Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    6-DIGIT VERIFICATION CODE <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Valid for 15 mins</span>
                </div>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim())}
                    placeholder="Enter code (e.g. 849201)"
                    className="block w-full pl-9 pr-3 py-2 text-xs font-mono font-bold tracking-widest text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                  NEW CONFIDENTIAL PASSWORD <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="block w-full pl-9 pr-9 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                  CONFIRM NEW PASSWORD <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="block w-full pl-9 pr-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-xs tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full mr-1" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password &amp; Revoke Old Sessions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium hover:underline"
                >
                  Remembered your password? Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#071426] flex items-center justify-center text-white text-xs">Loading recovery console...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
