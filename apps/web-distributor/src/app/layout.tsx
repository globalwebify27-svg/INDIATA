import type { Metadata } from "next";
import "./globals.css";
import { DistributorAuthProvider } from "../context/distributor-auth-context";

export const metadata: Metadata = {
  title: "Rajtantra — Distributor Franchise Portal",
  description: "Regional Partner & Candidate Management Console for Rajtantra Election Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-[#2087FE] selection:text-white">
        <DistributorAuthProvider>
          {children}
        </DistributorAuthProvider>
      </body>
    </html>
  );
}
