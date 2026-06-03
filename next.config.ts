import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.CAPACITOR_BUILD === 'true' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: process.env.CAPACITOR_BUILD === 'true',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
