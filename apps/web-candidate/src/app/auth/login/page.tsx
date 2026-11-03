"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, ArrowRight, Vote, Sparkles } from "lucide-react";
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

  // In development UI preview mode, skip the login screen and redirect to War Room dashboard
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
    setIdentifier("candidate@rajtantra.in");
    setPassword("Rajtantra@2026");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F8FD] dark:bg-[#011A2D] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-[#6256D9] flex items-center justify-center text-white shadow-md mb-3 ring-2 ring-[#6256D9]/20">
            <Vote className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#252A3A] dark:text-[#F8FAFC]">
            INDIATA
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="primary">Candidate Admin War Room</Badge>
            <span className="text-xs text-[#707E94] dark:text-[#94A3B8]">v4.2</span>
          </div>
          <p className="mt-2 text-xs text-[#707E94] dark:text-[#94A3B8]">
            Institutional Election Management & Campaign Intelligence Platform
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border-[#ACB9D1] dark:border-[#0e3554] shadow-sm">
          <CardContent className="pt-6">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#BA1A1A] text-xs font-medium flex items-start gap-2.5">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email or Mobile Number"
                type="text"
                placeholder="candidate@rajtantra.in or 9822014590"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#010627] dark:text-[#F5F6F6] uppercase tracking-wide">
                    Password <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-[#2087FE] hover:underline"
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
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm transition-colors bg-white dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] border-[#ACB9D1] dark:border-[#0e3554] focus:outline-none focus:ring-2 focus:ring-[#2087FE] focus:border-[#2087FE]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#717785] dark:text-[#94A3B8] hover:text-[#010627]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#717785] dark:text-[#94A3B8]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#ACB9D1] text-[#2087FE] focus:ring-[#2087FE]"
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
            <div className="mt-6 pt-5 border-t border-[#ACB9D1]/30 dark:border-[#0e3554]/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#717785] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2087FE]" />
                  Demo Access Credentials
                </span>
                <button
                  type="button"
                  onClick={handleUseDemoCredentials}
                  className="text-xs text-[#2087FE] font-medium hover:underline cursor-pointer"
                >
                  Auto-fill Form
                </button>
              </div>
              <div className="bg-[#E0EDFE]/40 dark:bg-[#072439]/60 p-2.5 rounded-lg text-xs space-y-1 text-[#010627] dark:text-[#F5F6F6]">
                <div className="flex justify-between">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Login:</span>
                  <span className="font-mono font-medium">candidate@rajtantra.in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Password:</span>
                  <span className="font-mono font-medium">Rajtantra@2026</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Registration Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#717785] dark:text-[#94A3B8]">
            Not yet registered for this election cycle?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-[#2087FE] hover:underline"
            >
              Submit Registration Enquiry
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
