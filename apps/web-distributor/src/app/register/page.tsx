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
      setError("Please accept the distributor partner compliance agreement.");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate registration request creation
      await new Promise((res) => setTimeout(res, 800));
      setIsSubmitted(true);
    } catch {
      setError("Unable to submit application. Please verify your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-premium-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Application Submitted
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Your distributor franchise registration for <strong>{companyName}</strong> has been logged with status <span className="font-semibold text-amber-600 dark:text-amber-400">PENDING</span>.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs shadow-premium-xs">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Franchise Lead:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{contactName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Operating Territory:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{location}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Registered Email:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Review Timeline:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Within 24–48 Business Hours</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link href="/pending-approval">
              <Button variant="primary" size="md" className="w-full">
                <span>View Application Status</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/login" className="block text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2087FE] flex items-center justify-center text-white font-bold text-xl shadow-premium-sm">
            R
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Apply for Distributor Franchise
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Partner with Rajtantra to onboard and manage election candidates across your authorized territory.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-premium-md rounded-2xl sm:px-10 border border-slate-200/80 dark:border-slate-800">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-start gap-2.5 text-rose-700 dark:text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Distributor / Company Name"
                required
                placeholder="e.g. MahaMedia Solutions Pvt Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={<Building2 className="w-4 h-4" />}
              />

              <Input
                label="Primary Contact Person"
                required
                placeholder="Full Legal Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Mobile Phone"
                type="tel"
                required
                placeholder="+91 98220 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Input
                label="Official Email Address"
                type="email"
                required
                placeholder="partner@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Operating Territory / District"
              required
              placeholder="e.g. Pune, Satara, Kolhapur (Western Maharashtra)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
              helperText="Enter districts or regions where you intend to distribute Rajtantra candidate accounts."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Account Password"
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#2087FE] focus:ring-[#2087FE]"
                />
                <span>
                  I agree to the <strong>Rajtantra Franchise Partner Compliance Terms</strong>. I understand that registration submits an application with status <span className="font-semibold text-amber-600">Pending</span> and requires Super Admin verification before portal login is enabled.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full"
              >
                <span>Submit Franchise Application</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Already registered and approved?{" "}
              <Link href="/login" className="font-semibold text-[#2087FE] hover:underline">
                Sign In to Distributor Portal
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted partner application • Super Admin verified franchise governance</span>
        </div>
      </div>
    </div>
  );
}
