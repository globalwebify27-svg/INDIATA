import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@rajtantra/ui",
    "@rajtantra/auth",
    "@rajtantra/rbac",
    "@rajtantra/api-client",
    "@rajtantra/common-types",
    "@rajtantra/validation",
  ],
};

export default nextConfig;
