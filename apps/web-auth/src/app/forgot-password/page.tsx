"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { Button, Input, Card, CardContent, Badge } from "@rajtantra/ui";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);
    // Simulate password reset email/SMS dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030e17] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="h-10 mb-2 flex items-center justify-center">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#2087FE] flex items-center justify-center text-white text-base font-black shadow-xs">
                R
              </span>
              RAJTANTRA / INDATA
            </span>
          </div>
          <Badge variant="primary">Security Recovery Gateway</Badge>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-premium-sm bg-white dark:bg-[#072439]">
          <CardContent className="pt-6">
            {!isSent ? (
              <>
                <div className="mb-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 flex items-center justify-center mx-auto mb-3">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Reset Account Password
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your registered email address or mobile number to receive a secure recovery code.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Registered Email or Mobile"
                    type="text"
                    placeholder="e.g. candidate@rajtantra.in"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full mt-2 font-semibold"
                    isLoading={isSubmitting}
                  >
                    Send Recovery Code
                  </Button>

                  <div className="pt-2 text-center">
                    <Link
                      href="/login"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Central Login
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recovery Instructions Dispatched
                </h2>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                  A verification token has been transmitted to your registered contact channel. Please review your messages.
                </p>
                <div className="mt-6">
                  <Link href="/login">
                    <Button variant="outline" size="md" className="w-full">
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
