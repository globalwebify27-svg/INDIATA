"use client";

import React, { useState } from "react";
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, BadgeAlert, ArrowRight, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/context/toast-context";

interface ChangePasswordCardProps {
  onSuccess?: () => void;
  className?: string;
}

export function ChangePasswordCard({ onSuccess, className = "" }: ChangePasswordCardProps) {
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage("New password must be different from your current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch<{ message: string }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (response.success || response.statusCode === 200) {
        setSuccessMessage("Password changed successfully. Other active sessions have been revoked.");
        showToast("success", "Password Updated", "Your new password is now active.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        if (onSuccess) onSuccess();
      } else {
        const msg = response.message || "Failed to change password.";
        setErrorMessage(msg);
        showToast("error", "Update Failed", msg);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to authentication service.";
      setErrorMessage(msg);
      showToast("error", "Update Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center font-bold">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Change Account Password
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Update your confidential login password. Requires your current password.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Session Guard</span>
        </span>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 text-xs flex items-center gap-2">
          <BadgeAlert className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 max-w-lg text-xs">
        {/* Current Password Field */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Current Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-lg shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="block w-full pl-9 pr-9 py-2 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* New Password Field */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            New Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-lg shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              type={showNew ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="block w-full pl-9 pr-9 py-2 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password Field */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Confirm New Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-lg shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              type={showNew ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="block w-full pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
            />
          </div>
        </div>

        {/* Security Policy Advisory */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong>Security Note:</strong> Changing your password will immediately revoke all other active refresh sessions across other devices and browsers.
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
