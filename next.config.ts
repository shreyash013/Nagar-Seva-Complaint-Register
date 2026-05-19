import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-expect-error as suggested by Next.js
  allowedDevOrigins: ['10.123.202.19'],
};

export default nextConfig;
