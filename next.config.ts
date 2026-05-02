import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: false, // Let cPanel handle compression to save memory
  cacheMaxMemorySize: 10485760, // Cap cache at 10MB to prevent memory bloat
  generateEtags: false, // Save CPU
  experimental: {
    workerThreads: true,
    cpus: 1, // Restrict background processes drastically
    staticGenerationMaxConcurrency: 1, // Prevent parallel ISR spikes
    memoryBasedWorkersCount: false,
  },
};

export default nextConfig;
