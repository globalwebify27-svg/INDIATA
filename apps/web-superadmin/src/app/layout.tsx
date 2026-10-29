import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../context/theme-context";
import { ToastProvider } from "../context/toast-context";

export const metadata: Metadata = {
  title: "INDIATA — Super Admin Platform Console",
  description:
    "AI-Powered enterprise election management and multi-tenant administration platform",
  icons: {
    icon: "/brand/indiata-icon.png",
    shortcut: "/brand/indiata-icon.png",
    apple: "/brand/indiata-icon.png",
  },
  openGraph: {
    title: "INDIATA — Super Admin Platform Console",
    description:
      "AI-Powered enterprise election management and multi-tenant administration platform",
    siteName: "INDIATA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#FFF8F2] dark:bg-[#191410] text-[#1E1B17] dark:text-[#F7EFE9] font-sans selection:bg-[#FFDCC3] selection:text-[#2F1500]">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
