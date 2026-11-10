"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { useDistributorAuth } from "../../../distributor/context/distributor-auth-context";
import { Button } from "@rajtantra/ui/buttons";
import { Input } from "@rajtantra/ui/forms";

export default function LoginPage() {
  const { login } = useDistributorAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your registered email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || "Authentication failed.");
      }
    } catch {
      setError("Unable to connect to authentication service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("Distributor@2026");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2087FE] flex items-center justify-center text-white font-bold text-xl shadow-premium-sm">
            R
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Distributor Partner Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Sign in to manage your regional election candidates, subscriptions &amp; enquiries.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-premium-md rounded-2xl sm:px-10 border border-slate-200/80 dark:border-slate-800">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-start gap-2.5 text-rose-700 dark:text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Registered Email or Mobile"
              type="text"
              required
              placeholder="distributor@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#2087FE] focus:ring-[#2087FE]"
                />
                <span>Remember session</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password reset is managed through your Super Admin account manager or Central Support.");
                }}
                className="font-medium text-[#2087FE] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full"
              >
                <span>Sign In to Distributor Console</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>

          {/* Quick-Fill Testing Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              1-Click Test Role Sign In:
            </span>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill("distributor@mahamedia.com")}
                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-emerald-900 dark:text-emerald-200">Active Distributor (DIS-101)</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">distributor@mahamedia.com</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                  Approved
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("pending@marathwada.com")}
                className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-amber-900 dark:text-amber-200">Pending Distributor (DIS-105)</div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400">pending@marathwada.com</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                  Pending
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("suspended@khandesh.com")}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-rose-900 dark:text-rose-200">Suspended Distributor (DIS-106)</div>
                  <div className="text-[10px] text-rose-700 dark:text-rose-400">suspended@khandesh.com</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100">
                  Blocked
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Want to become an authorized partner?{" "}
              <Link href="/distributor/register" className="font-semibold text-[#2087FE] hover:underline">
                Apply for Distributor Franchise
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Role-Based Scoped Multi-Tenant Authentication</span>
        </div>
      </div>
    </div>
  );
}
