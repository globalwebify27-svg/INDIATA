"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Please enter your registered email or mobile number.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(identifier.trim(), password);
      showToast("success", "Welcome Back", "Signed into Candidate War Room successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.";
      setErrorMessage(msg);
      showToast("error", "Authentication Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDemoCredentials = () => {
    setIdentifier("candidate@indiata.in");
    setPassword("Indiata@2026");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-10 mb-2 flex items-center justify-center">
            <img
              src="/brand/indiata-logo.png"
              alt="Rajtantra"
              className="h-9 w-auto object-contain dark:hidden"
            />
            <img
              src="/brand/indiata-logo-dark.png"
              alt="Rajtantra"
              className="h-9 w-auto object-contain hidden dark:block"
            />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="primary">Candidate War Room Command</Badge>
            <span className="text-xs text-slate-400">v4.2</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Institutional Election Management &amp; Campaign Intelligence Platform
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-premium-sm">
          <CardContent className="pt-6">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email or Mobile Number"
                type="text"
                placeholder="candidate@indiata.in or 9822014590"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-brand-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs transition-colors bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 font-semibold"
                isLoading={isSubmitting}
              >
                Sign In to War Room
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  Demo Access Credentials
                </span>
                <button
                  type="button"
                  onClick={handleUseDemoCredentials}
                  className="text-xs text-brand-600 font-medium hover:underline cursor-pointer"
                >
                  Auto-fill Form
                </button>
              </div>
              <div className="bg-brand-50/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-brand-200/60 dark:border-slate-700 text-xs space-y-1 text-slate-800 dark:text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Login:</span>
                  <span className="font-mono font-medium">candidate@indiata.in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Password:</span>
                  <span className="font-mono font-medium">Indiata@2026</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Registration Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Not yet registered for this election cycle?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-brand-600 hover:underline"
            >
              Submit Registration Enquiry
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
