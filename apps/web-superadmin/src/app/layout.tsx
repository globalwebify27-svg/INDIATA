import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rajtantra — Super Admin Platform Console",
  description:
    "Enterprise election management and tenant administration portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
