"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/context/toast-context";
import { useAuth } from "@/context/auth-context";

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isDevPreview } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isDevPreview || isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isDevPreview, isAuthenticated, router]);

  const enquiryNumber = searchParams.get("enq") || "ENQ-2026-PENDING";
  const candidateName = searchParams.get("candidate") || "Candidate Representative";
  const constituency = searchParams.get("constituency") || "Configured Constituency";

  const handleCopyEnquiryId = () => {
    navigator.clipboard.writeText(enquiryNumber);
    showToast("info", "Copied", "Enquiry tracking reference copied to clipboard.");
  };

  return (
    <div className="min-h-screen bg-[#F3F8FD] dark:bg-[#011A2D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <Card className="border-[#ACB9D1] dark:border-[#0e3554] shadow-md overflow-hidden text-center">
          <div className="bg-[#B3EDD7]/30 dark:bg-[#133528]/40 p-6 flex flex-col items-center border-b border-[#12CF94]/20">
            <div className="w-16 h-16 rounded-full bg-[#12CF94] text-white flex items-center justify-center shadow-lg mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <Badge variant="success" size="md">
              Enquiry Submitted Successfully
            </Badge>
            <h2 className="text-xl font-extrabold text-[#010627] dark:text-[#F5F6F6] mt-2">
              Registration Under Review
            </h2>
          </div>

          <CardContent className="pt-6 space-y-5">
            <p className="text-xs text-[#717785] dark:text-[#94A3B8]">
              Thank you, <strong className="text-[#010627] dark:text-[#F5F6F6]">{candidateName}</strong>. Your campaign registration enquiry for <strong className="text-[#010627] dark:text-[#F5F6F6]">{constituency}</strong> has been transmitted to Super Admin.
            </p>

            <div className="bg-[#E0EDFE]/40 dark:bg-[#072439] p-4 rounded-xl border border-[#2087FE]/20 text-left">
              <span className="text-[10px] font-bold text-[#717785] dark:text-[#94A3B8] uppercase tracking-wider block mb-1">
                Enquiry Reference Number
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-[#2087FE]">
                  {enquiryNumber}
                </span>
                <button
                  onClick={handleCopyEnquiryId}
                  className="p-1.5 rounded-lg hover:bg-[#2087FE]/10 text-[#2087FE] transition-colors"
                  title="Copy reference code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#062237] border border-[#ACB9D1]/30 text-left text-xs space-y-2">
              <div className="flex items-start gap-2 text-[#010627] dark:text-[#F5F6F6]">
                <Clock className="w-4 h-4 text-[#FC7C36] shrink-0 mt-0.5" />
                <span>
                  <strong>Estimated Review Time:</strong> 1 to 24 Business Hours.
                </span>
              </div>
              <div className="flex items-start gap-2 text-[#010627] dark:text-[#F5F6F6]">
                <ShieldCheck className="w-4 h-4 text-[#12CF94] shrink-0 mt-0.5" />
                <span>
                  <strong>Activation Notice:</strong> Once approved, your workspace will be unlocked and you will be notified via WhatsApp / SMS.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/auth/login" className="w-full block">
                <Button variant="primary" size="lg" className="w-full font-bold">
                  Return to Sign In Screen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F8FD] dark:bg-[#011A2D]" />}>
      <RegistrationSuccessContent />
    </Suspense>
  );
}
