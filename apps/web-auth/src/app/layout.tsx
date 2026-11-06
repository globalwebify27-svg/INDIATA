import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rajtantra Central SSO — Election Intelligence Platform",
  description: "One Central Identity & Authorization Gateway for Rajtantra Platform Consoles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-[#030e17] text-slate-800 dark:text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
