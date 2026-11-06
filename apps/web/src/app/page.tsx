import { redirect } from "next/navigation";

/**
 * Root Entry Point for Port 3000.
 * Directly routes any incoming browser traffic to the Central SSO Login page.
 */
export default function RootPage() {
  redirect("/login");
}
