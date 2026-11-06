import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@rajtantra/common-types", "@rajtantra/auth"],
};

export default nextConfig;
