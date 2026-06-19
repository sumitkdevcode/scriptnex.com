// server.js
// CPanel Passenger Standalone Wrapper

// Force Next.js standalone server to bind properly in CPanel
process.env.NODE_ENV = 'production';
process.env.HOSTNAME = '127.0.0.1';
process.env.PORT = process.env.PORT || 3000;

// PROCESS/MEMORY LIMITS FOR SHARED HOSTING
// 384MB balances cPanel constraints with ISR + sitemap generation needs.
// The previous 256MB caused OOM kills during sitemap revalidation (5000+ items).
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.UV_THREADPOOL_SIZE = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=384 --gc-interval=100 --no-warnings';
process.env.NEXT_MANUAL_SIG_HANDLE = 'true';

console.log('Starting standalone Next.js server on port ' + process.env.PORT);

async function boot() {
  try {
    await import('./.next/standalone/server.js');
  } catch (error) {
    console.error('Failed to start standalone server. Make sure you uploaded the .next folder.', error);
    process.exit(1);
  }
}

void boot();
