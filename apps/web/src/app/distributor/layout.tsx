"use client";

import React from "react";
import { DistributorAuthProvider } from "../../distributor/context/distributor-auth-context";

export default function DistributorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DistributorAuthProvider>{children}</DistributorAuthProvider>;
}
