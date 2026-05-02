// server.js
// CPanel Passenger Standalone Wrapper

// Force Next.js standalone server to bind properly in CPanel
process.env.NODE_ENV = 'production';
process.env.HOSTNAME = '127.0.0.1';
process.env.PORT = process.env.PORT || 3000;

// AGGRESSIVE PROCESS/MEMORY LIMITS FOR SHARED HOSTING
process.env.UV_THREADPOOL_SIZE = '1'; 
process.env.NODE_OPTIONS = '--max-old-space-size=256';

console.log('Starting standalone Next.js server on port ' + process.env.PORT);

// Boot the highly-optimized standalone server directly
try {
  require('./.next/standalone/server.js');
} catch (e) {
  console.error("Failed to start standalone server. Make sure you uploaded the .next folder.", e);
  process.exit(1);
}
