import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: false, // Let cPanel handle compression to save memory
  experimental: {
    workerThreads: true,
    cpus: 1, // Restrict background processes drastically
  },
  /* config options here */
};

export default nextConfig;
