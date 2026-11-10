"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Mail, Phone, Lock, MapPin, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@rajtantra/ui/buttons";
import { Input } from "@rajtantra/ui/forms";

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!companyName.trim() || !contactName.trim() || !phone.trim() || !email.trim() || !location.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^\+?[0-9\s-]{10,15}$/.test(phone.replace(/\s+/g, ""))) {
      setError("Please enter a valid 10-digit mobile phone number.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the distributor agreement and privacy policy.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API registration call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch {
      setError("Registration request could not be processed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-premium rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Application Submitted
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Your franchise distributor application for <span className="font-semibold text-slate-800 dark:text-slate-200">{companyName}</span> has been received. Our compliance team will review your business credentials and territorial rights allocation within 24–48 hours.
            </p>
            <div className="space-y-3">
              <Link href="/distributor/pending-approval">
                <Button variant="primary" className="w-full">
                  Track Application Status
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Return to Central Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#010627] to-[#2087FE] text-white flex items-center justify-center mx-auto mb-3 shadow-premium-sm font-bold text-xl">
            R
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Franchise Distributor Registration
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Apply to become an authorized Rajtantra regional franchise partner
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-premium rounded-2xl border border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Enterprise / Agency Name"
                placeholder="e.g., Apex Political Campaign Services Pvt Ltd"
                leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Lead Contact Person"
                placeholder="e.g., Rajesh S. Patil"
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Official Mobile Number"
                  type="tel"
                  placeholder="+91 98220 12345"
                  leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  label="Business Email"
                  type="email"
                  placeholder="contact@agency.com"
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Input
                label="Primary Operating Territory"
                placeholder="e.g., Pune Metro, Western Maharashtra"
                leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                helperText="District, Division, or Region of operational campaign activity."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Portal Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2087FE] border-slate-300 dark:border-slate-700 focus:ring-[#2087FE] mt-0.5"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  I agree to the <span className="text-[#2087FE] font-medium hover:underline">Franchise Operating Agreement</span>, compliance guidelines, and privacy terms. I understand that account approval is subject to territorial verification by Super Admin.
                </span>
              </label>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                isLoading={isLoading}
              >
                <span>Submit Franchise Application</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already registered as a franchise partner?{" "}
              <Link href="/login" className="text-[#2087FE] font-semibold hover:underline">
                Sign In here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2087FE]" />
          <span>Rajtantra Enterprise Security &amp; Tenant Isolation Protocol</span>
        </div>
      </div>
    </div>
  );
}
