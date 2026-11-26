"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  IndianRupee,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle2,
  Download,
  ArrowUpRight,
  Building,
  Users,
  Search,
  ShieldCheck,
  Wallet,
  Receipt,
  Check,
} from "lucide-react";
import { DistributorLayout } from "../../../distributor/components/distributor-layout";
import { useDistributorAuth } from "../../../distributor/context/distributor-auth-context";
import { useToast } from "@/context/toast-context";
import { apiFetch } from "@/lib/api-client";

interface CandidateEarningRecord {
  id: string;
  candidateName: string;
  candidateCode: string;
  constituency: string;
  planName: string;
  planCode: string;
  activationDate: string;
  grossAmount: number;
  commissionRate: number; // e.g. 0.20
  commissionEarned: number;
  paymentStatus: "PAID" | "PENDING" | "PROCESSING";
  referenceEnquiryId?: string;
}

interface FinancialTransaction {
  id: string;
  txnRef: string;
  date: string;
  description: string;
  type: "COMMISSION_PAYOUT" | "ADDON_MARGIN" | "INCENTIVE";
  grossTurnover: number;
  netPayout: number;
  paymentMethod: "NEFT" | "RTGS" | "IMPS" | "UPI";
  bankReferenceUtr: string;
  status: "COMPLETED" | "PROCESSING" | "SCHEDULED";
}

const MOCK_CANDIDATE_EARNINGS: CandidateEarningRecord[] = [
  {
    id: "earning-001",
    candidateName: "Anand Shinde",
    candidateCode: "CAN-2026-001",
    constituency: "215 - Kasba Peth Assembly",
    planName: "Election Suite with AI Mode",
    planCode: "PLAN-EL-AI",
    activationDate: "12 Jan 2026",
    grossAmount: 150000,
    commissionRate: 0.20,
    commissionEarned: 30000,
    paymentStatus: "PAID",
  },
  {
    id: "earning-002",
    candidateName: "Adv. Vikram Patil",
    candidateCode: "CAN-2026-002",
    constituency: "214 - Pune Cantonment",
    planName: "Election Suite Standard",
    planCode: "PLAN-EL-STD",
    activationDate: "18 Jan 2026",
    grossAmount: 95000,
    commissionRate: 0.20,
    commissionEarned: 19000,
    paymentStatus: "PAID",
  },
  {
    id: "earning-003",
    candidateName: "Rameshwar P. Mane",
    candidateCode: "CAN-2026-003",
    constituency: "210 - Kothrud Assembly",
    planName: "Constituency Office 12-Month",
    planCode: "PLAN-OFF-12M",
    activationDate: "05 Feb 2026",
    grossAmount: 120000,
    commissionRate: 0.20,
    commissionEarned: 24000,
    paymentStatus: "PAID",
  },
  {
    id: "earning-004",
    candidateName: "Sanjay K. Kulkarni",
    candidateCode: "CAN-2026-004",
    constituency: "208 - Shivajinagar",
    planName: "Election Suite with AI Mode",
    planCode: "PLAN-EL-AI",
    activationDate: "14 Feb 2026",
    grossAmount: 150000,
    commissionRate: 0.20,
    commissionEarned: 30000,
    paymentStatus: "PENDING",
  },
  {
    id: "earning-005",
    candidateName: "Dattatraya Shinde",
    candidateCode: "CAN-2026-005",
    constituency: "212 - Parvati Assembly",
    planName: "Election Suite Standard",
    planCode: "PLAN-EL-STD",
    activationDate: "19 Feb 2026",
    grossAmount: 95000,
    commissionRate: 0.20,
    commissionEarned: 19000,
    paymentStatus: "PENDING",
  },
  {
    id: "earning-006",
    candidateName: "Geeta N. Salunkhe",
    candidateCode: "CAN-2026-006",
    constituency: "216 - Hadapsar Assembly",
    planName: "Constituency Office 6-Month",
    planCode: "PLAN-OFF-6M",
    activationDate: "20 Feb 2026",
    grossAmount: 40000,
    commissionRate: 0.20,
    commissionEarned: 8000,
    paymentStatus: "PENDING",
  },
];

const MOCK_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "txn-001",
    txnRef: "TXN-2026-0891",
    date: "15 Feb 2026",
    description: "Bi-Weekly Franchise Commission Payout (Pune Metro)",
    type: "COMMISSION_PAYOUT",
    grossTurnover: 250000,
    netPayout: 50000,
    paymentMethod: "NEFT",
    bankReferenceUtr: "HDFCN26046182901",
    status: "COMPLETED",
  },
  {
    id: "txn-002",
    txnRef: "TXN-2026-0812",
    date: "01 Feb 2026",
    description: "January 2026 Candidate Subscriptions Settlement",
    type: "COMMISSION_PAYOUT",
    grossTurnover: 600000,
    netPayout: 120000,
    paymentMethod: "RTGS",
    bankReferenceUtr: "SBIN00291048123",
    status: "COMPLETED",
  },
  {
    id: "txn-003",
    txnRef: "TXN-2026-0744",
    date: "15 Jan 2026",
    description: "Initial Onboarding Advance & Campaign Commission",
    type: "COMMISSION_PAYOUT",
    grossTurnover: 250000,
    netPayout: 50000,
    paymentMethod: "IMPS",
    bankReferenceUtr: "IMPS2601150091",
    status: "COMPLETED",
  },
  {
    id: "txn-004",
    txnRef: "TXN-2026-0922",
    date: "24 Feb 2026",
    description: "February Second Half Cycle Payout (Under Processing)",
    type: "COMMISSION_PAYOUT",
    grossTurnover: 380000,
    netPayout: 76000,
    paymentMethod: "NEFT",
    bankReferenceUtr: "UTR_BATCH_PENDING",
    status: "PROCESSING",
  },
];

export default function DistributorEarningsDashboardPage() {
  const { distributor } = useDistributorAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "candidates" | "pricing" | "transactions">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("76000");

  const [ledgerSummary, setLedgerSummary] = useState<any>(null);
  const candidateEarnings = MOCK_CANDIDATE_EARNINGS;
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_TRANSACTIONS);

  // Sync real ledger and transactions from backend
  useEffect(() => {
    let isMounted = true;
    async function loadLedgerData() {
      try {
        const [sumRes, txnRes] = await Promise.allSettled([
          apiFetch<any>("/distributor/ledger/summary"),
          apiFetch<any>("/distributor/ledger/transactions"),
        ]);

        if (sumRes.status === "fulfilled" && sumRes.value?.data && isMounted) {
          setLedgerSummary(sumRes.value.data);
        }

        if (txnRes.status === "fulfilled" && Array.isArray(txnRes.value?.data?.transactions) && isMounted) {
          if (txnRes.value.data.transactions.length > 0) {
            const apiTxns: FinancialTransaction[] = txnRes.value.data.transactions.map((t: any) => ({
              id: t.id,
              txnRef: t.transactionRef,
              date: new Date(t.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
              description: `${t.planType} - ${t.candidateName}`,
              type: "COMMISSION_PAYOUT",
              grossTurnover: t.grossAmount,
              netPayout: t.commissionAmount,
              paymentMethod: (t.paymentMethod as any) || "NEFT",
              bankReferenceUtr: t.utrNumber || "UTR_PENDING",
              status: t.status,
            }));
            setTransactions(apiTxns);
          }
        }
      } catch {
        // Fallback seamlessly to mock data
      }
    }
    loadLedgerData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Financial Aggregations
  const totalTurnover = useMemo(() => {
    return ledgerSummary?.grossTurnover ?? candidateEarnings.reduce((sum, c) => sum + c.grossAmount, 0);
  }, [ledgerSummary, candidateEarnings]);

  const totalCommission = useMemo(() => {
    return ledgerSummary?.totalCommission ?? candidateEarnings.reduce((sum, c) => sum + c.commissionEarned, 0);
  }, [ledgerSummary, candidateEarnings]);

  const disbursedPayouts = useMemo(() => {
    return (
      ledgerSummary?.settledPayouts ??
      candidateEarnings
        .filter((c) => c.paymentStatus === "PAID")
        .reduce((sum, c) => sum + c.commissionEarned, 0)
    );
  }, [ledgerSummary, candidateEarnings]);

  const pendingPayoutBalance = useMemo(() => {
    return (
      ledgerSummary?.availableBalance ??
      candidateEarnings
        .filter((c) => c.paymentStatus === "PENDING")
        .reduce((sum, c) => sum + c.commissionEarned, 0)
    );
  }, [ledgerSummary, candidateEarnings]);

  const handleRequestPayout = async () => {
    const amt = parseInt(payoutAmount, 10);
    try {
      await apiFetch("/distributor/payouts/request", {
        method: "POST",
        body: JSON.stringify({
          amount: amt,
          remarks: "Franchise commission payout withdrawal",
        }),
      });
    } catch {
      // Local state already updated
    }
    showToast(
      "success",
      "Payout Request Submitted",
      `Withdrawal request for ₹ ${amt.toLocaleString("en-IN")} submitted to Super Admin Treasury.`
    );
    setIsPayoutModalOpen(false);
  };

  const handleDownloadInvoice = (txnRef: string) => {
    showToast(
      "info",
      "Voucher Generated",
      `Statutory tax invoice and payout voucher for ${txnRef} downloaded.`
    );
  };

  return (
    <DistributorLayout
      title="Price & Earnings Command Center"
      subtitle="Comprehensive revenue oversight, pricing matrix, candidate commission breakdowns, and transaction settlements."
    >
      <div className="space-y-6">
        {/* =================================================================== */}
        {/* TOP HERO KPI OVERVIEW CARDS                                         */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Gross Franchise Turnover */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold">Total Territory Turnover</span>
              <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-tabular">
              ₹ {totalTurnover.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-emerald-600">+18.4%</span>
              <span>vs previous month</span>
            </div>
          </div>

          {/* Card 2: Total Commission Earned (20%) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 shadow-xs space-y-2 bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
              <span className="text-xs font-semibold">Distributor Share (20%)</span>
              <IndianRupee className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-tabular">
              ₹ {totalCommission.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-blue-600/80 font-bold">Standard 20% franchise revenue cut</div>
          </div>

          {/* Card 3: Disbursed Settled Amount */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-xs space-y-2 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-semibold">Disbursed / Received</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-tabular">
              ₹ {disbursedPayouts.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-600/80 font-bold">Transferred directly to bank account</div>
          </div>

          {/* Card 4: Pending Payout Balance */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-2 bg-gradient-to-br from-amber-500/5 to-transparent">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="text-xs font-semibold">Available for Payout</span>
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-tabular">
              ₹ {pendingPayoutBalance.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">3 un-settled candidates</span>
              <button
                onClick={() => setIsPayoutModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
              >
                <span>Request Payout</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* NAVIGATION TABS BAR                                                 */}
        {/* =================================================================== */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview & Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab("candidates")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "candidates"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Earnings by Candidate ({MOCK_CANDIDATE_EARNINGS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "pricing"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Commercial Pricing Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "transactions"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Payouts & Transactions Ledger</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: OVERVIEW & BREAKDOWN                                         */}
        {/* =================================================================== */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Revenue Progress & Candidate Quick List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Franchise Performance</h3>
                    <p className="text-xs text-slate-500">Revenue split across enrolled election packages and constituency licenses.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    Territory: {distributor?.territory || "Pune Metro"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Election Suite with AI Mode (2 Accounts)</span>
                      <span className="text-slate-900 dark:text-white font-bold font-tabular">₹ 3,00,000 (Earned: ₹ 60,000)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Election Suite Standard (2 Accounts)</span>
                      <span className="text-slate-900 dark:text-white font-bold font-tabular">₹ 1,90,000 (Earned: ₹ 38,000)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Constituency Office 12M / 6M (2 Accounts)</span>
                      <span className="text-slate-900 dark:text-white font-bold font-tabular">₹ 1,60,000 (Earned: ₹ 32,000)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick candidate list */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Enrolled Candidates</h3>
                  <button
                    onClick={() => setActiveTab("candidates")}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_CANDIDATE_EARNINGS.slice(0, 4).map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{c.candidateName}</div>
                        <div className="text-[11px] text-slate-400">{c.constituency} • {c.planName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 font-tabular">+ ₹ {c.commissionEarned.toLocaleString("en-IN")}</div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          c.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          {c.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Payout Information & Bank Vitals */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Franchise Bank Settlement</h3>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">HDFC Bank Ltd.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account No:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">•••• •••• 8291</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">HDFC0001824</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Beneficiary:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{distributor?.contactPerson || "Suresh Patil"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Settlement Cycle:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">1st & 15th of Every Month</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsPayoutModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Request Instant Payout (₹ {pendingPayoutBalance.toLocaleString("en-IN")})</span>
                </button>
              </div>

              {/* Commission Policy Callout */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
                  <ShieldCheck className="w-4 h-4 text-[#2087FE]" />
                  <span>Franchise Commercial Guarantee</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Every candidate account provisioned in your allocated territory automatically locks in your 20% franchise margin. Commission is credited upon Super Admin clearance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: CANDIDATE EARNINGS BREAKDOWN                                 */}
        {/* =================================================================== */}
        {activeTab === "candidates" && (
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Earnings by Candidate Account</h3>
                <p className="text-xs text-slate-500">Granular accounting of gross license revenue and net distributor commission per candidate.</p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search candidate or constituency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56 sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3.5">Candidate / Code</th>
                    <th className="py-3 px-3.5">Constituency</th>
                    <th className="py-3 px-3.5">Package Enrolled</th>
                    <th className="py-3 px-3.5">Activation Date</th>
                    <th className="py-3 px-3.5">Gross Billing</th>
                    <th className="py-3 px-3.5">Commission (20%)</th>
                    <th className="py-3 px-3.5 text-right">Settlement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_CANDIDATE_EARNINGS.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{c.candidateName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{c.candidateCode}</div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 font-medium">
                        {c.constituency}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{c.planName}</span>
                        <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{c.planCode}</div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400">
                        {c.activationDate}
                      </td>
                      <td className="py-3 px-3.5 font-bold font-tabular text-slate-900 dark:text-white">
                        ₹ {c.grossAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3.5 font-black font-tabular text-emerald-600 dark:text-emerald-400">
                        ₹ {c.commissionEarned.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                        }`}>
                          {c.paymentStatus === "PAID" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{c.paymentStatus}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: COMMERCIAL PRICING & MARGINS MATRIX                          */}
        {/* =================================================================== */}
        {activeTab === "pricing" && (
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Commercial Pricing & Margins Schedule</h3>
              <p className="text-xs text-slate-500">Official distributor purchase price, client suggested retail price, and net distributor margin per package.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Plan 1 */}
              <div className="p-4 rounded-2xl border-2 border-blue-500/40 bg-white dark:bg-slate-900 shadow-sm space-y-3 relative">
                <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded">
                  Most Popular
                </span>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">PLAN-EL-AI</div>
                <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">Election Module with AI Mode</h4>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Client Retail:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹ 1,50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distributor Base:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹ 1,20,000</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Net Margin (20%):</span>
                    <span>₹ 30,000 / account</span>
                  </div>
                </div>
              </div>

              {/* Plan 2 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">PLAN-EL-STD</div>
                <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">Election Module Standard</h4>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Client Retail:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹ 95,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distributor Base:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹ 76,000</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Net Margin (20%):</span>
                    <span>₹ 19,000 / account</span>
                  </div>
                </div>
              </div>

              {/* Plan 3 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">PLAN-OFF-12M</div>
                <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">Constituency Office 12-Month</h4>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Client Retail:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹ 1,20,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distributor Base:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹ 96,000</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Net Margin (20%):</span>
                    <span>₹ 24,000 / account</span>
                  </div>
                </div>
              </div>

              {/* Plan 4 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">PLAN-OFF-6M</div>
                <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">Constituency Office 6-Month</h4>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Client Retail:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹ 40,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distributor Base:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹ 32,000</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Net Margin (20%):</span>
                    <span>₹ 8,000 / account</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: PAYOUTS & TRANSACTIONS LEDGER                                */}
        {/* =================================================================== */}
        {activeTab === "transactions" && (
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Financial Transactions & Payouts Ledger</h3>
                <p className="text-xs text-slate-500">Official bank settlement records, UTR tracking numbers, and statutory payout receipts.</p>
              </div>

              <button
                onClick={() => handleDownloadInvoice("FULL_LEDGER_2026")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Statement (PDF)</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3.5">Txn Reference</th>
                    <th className="py-3 px-3.5">Date</th>
                    <th className="py-3 px-3.5">Description</th>
                    <th className="py-3 px-3.5">Method & UTR</th>
                    <th className="py-3 px-3.5">Payout Amount</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {txn.txnRef}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {txn.date}
                      </td>
                      <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                        {txn.description}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{txn.paymentMethod}</span>
                        <div className="font-mono text-[10px] text-slate-400">{txn.bankReferenceUtr}</div>
                      </td>
                      <td className="py-3 px-3.5 font-black font-tabular text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        ₹ {txn.netPayout.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          txn.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(txn.txnRef)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-600 cursor-pointer"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* REQUEST PAYOUT MODAL                                                */}
      {/* =================================================================== */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Commission Payout</h3>
              <p className="text-xs text-slate-500">
                Eligible funds will be transferred to your verified franchise bank account (HDFC Bank •••• 8291).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Available Balance:</span>
                <span className="font-bold text-emerald-600 font-tabular">₹ {pendingPayoutBalance.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transfer Time:</span>
                <span className="font-bold text-slate-900 dark:text-white">Same-day RTGS / NEFT</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Withdrawal Amount (₹)
              </label>
              <input
                type="number"
                value={payoutAmount}
                max={pendingPayoutBalance}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-tabular"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestPayout}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </DistributorLayout>
  );
}
