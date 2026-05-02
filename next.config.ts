import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: false, // Let cPanel handle compression to save memory
  experimental: {
    // CRITICAL: Disable worker threads to prevent cPanel from killing the process
    // This fixes both the "large number of processes" error and the missing CSS issue
    workerThreads: false,
    memoryBasedWorkersCount: false,
    staticGenerationMaxConcurrency: 1, // Prevent parallel ISR spikes
  },
};

export default nextConfig;
