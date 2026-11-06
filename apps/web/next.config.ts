import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@rajtantra/common-types",
    "@rajtantra/auth",
    "@rajtantra/rbac",
    "@rajtantra/ui"
  ],
  async rewrites() {
    return [
      { source: "/dashboard", destination: "/candidate" },
      { source: "/field-map", destination: "/candidate/field-map" },
      { source: "/voters", destination: "/candidate/voters" },
      { source: "/voters/:path*", destination: "/candidate/voters/:path*" },
      { source: "/users", destination: "/candidate/users" },
      { source: "/users/:path*", destination: "/candidate/users/:path*" },
      { source: "/members", destination: "/candidate/members" },
      { source: "/members/:path*", destination: "/candidate/members/:path*" },
      { source: "/blo", destination: "/candidate/blo" },
      { source: "/blo/:path*", destination: "/candidate/blo/:path*" },
      { source: "/booths", destination: "/candidate/booths" },
      { source: "/booths/:path*", destination: "/candidate/booths/:path*" },
      { source: "/office", destination: "/candidate/office" },
      { source: "/office/:path*", destination: "/candidate/office/:path*" },
      { source: "/campaigns", destination: "/candidate/campaigns" },
      { source: "/campaigns/:path*", destination: "/candidate/campaigns/:path*" },
      { source: "/ai", destination: "/candidate/ai" },
      { source: "/ai/:path*", destination: "/candidate/ai/:path*" },
      { source: "/subscriptions", destination: "/candidate/subscriptions" },
      { source: "/subscriptions/:path*", destination: "/candidate/subscriptions/:path*" },
      { source: "/reports", destination: "/candidate/reports" },
      { source: "/reports/:path*", destination: "/candidate/reports/:path*" },
      { source: "/settings", destination: "/candidate/settings" },
      { source: "/settings/:path*", destination: "/candidate/settings/:path*" },
    ];
  },
};

export default nextConfig;
