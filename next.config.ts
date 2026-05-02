import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: false, // Let cPanel handle compression to save memory
  /* config options here */
};

export default nextConfig;
