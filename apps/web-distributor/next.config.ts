import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@rajtantra/common-types",
    "@rajtantra/auth",
    "@rajtantra/rbac",
    "@rajtantra/ui",
  ],
};

export default nextConfig;
