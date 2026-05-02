// server.js
// CPanel Passenger Standalone Wrapper

// Force Next.js standalone server to bind properly in CPanel
process.env.NODE_ENV = 'production';
process.env.HOSTNAME = '127.0.0.1';
process.env.PORT = process.env.PORT || 3000;

console.log('Starting standalone Next.js server on port ' + process.env.PORT);

// Boot the highly-optimized standalone server directly
try {
  require('./.next/standalone/server.js');
} catch (e) {
  console.error("Failed to start standalone server. Make sure you uploaded the .next folder.", e);
  process.exit(1);
}
