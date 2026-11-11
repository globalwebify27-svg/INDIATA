"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { KaryakartaAuthProvider } from "../../karyakarta/context/karyakarta-auth-context";
import { KaryakartaLanguageProvider } from "../../karyakarta/context/karyakarta-language-context";
import { KaryakartaLayout } from "../../karyakarta/components/layout/karyakarta-layout";

function KaryakartaLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthGate =
    pathname.includes("/pending-approval") ||
    pathname.includes("/blocked") ||
    pathname.includes("/mobile-view") ||
    pathname.endsWith("/login") ||
    pathname.endsWith("/register");

  if (isAuthGate) {
    return <>{children}</>;
  }

  return <KaryakartaLayout>{children}</KaryakartaLayout>;
}

export default function KaryakartaRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KaryakartaAuthProvider>
      <KaryakartaLanguageProvider>
        <KaryakartaLayoutWrapper>{children}</KaryakartaLayoutWrapper>
      </KaryakartaLanguageProvider>
    </KaryakartaAuthProvider>
  );
}
