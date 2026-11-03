"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, isDevPreview } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // In UI preview development mode, redirect away from the password reset flow
  useEffect(() => {
    if (isDevPreview || isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isDevPreview, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg("Please enter your registered mobile number or email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to process password reset request.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F8FD] dark:bg-[#011A2D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#2087FE] items-center justify-center text-white shadow-md mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#010627] dark:text-[#F5F6F6]">
            Password Recovery
          </h1>
          <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
            INDIATA Candidate War Room Account Security
          </p>
        </div>

        <Card className="border-[#ACB9D1] dark:border-[#0e3554] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Reset Account Password</CardTitle>
            <CardDescription>
              Enter the registered email address or mobile number associated with your candidate workspace.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#BA1A1A] text-xs font-medium flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#12CF94]/20 text-[#12CF94] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#010627] dark:text-[#F5F6F6]">
                  Verification Instructions Dispatched
                </h4>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8]">
                  If an account exists with{" "}
                  <strong className="text-[#010627] dark:text-[#F5F6F6]">{identifier}</strong>, password reset verification has been dispatched via SMS / email.
                </p>
                <div className="pt-2">
                  <Link href="/auth/login">
                    <Button variant="primary" size="md" className="w-full">
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Mobile or Email"
                  placeholder="e.g. 9822014590 or candidate@rajtantra.in"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold"
                  isLoading={isSubmitting}
                >
                  Send Reset Instructions
                </Button>

                <div className="text-center pt-2">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center text-xs text-[#717785] dark:text-[#94A3B8] hover:text-[#2087FE] hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
