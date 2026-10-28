import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../context/theme-context";
import { ToastProvider } from "../context/toast-context";

export const metadata: Metadata = {
  title: "Rajtantra — Super Admin Platform Console",
  description:
    "Enterprise election management and multi-tenant administration platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
