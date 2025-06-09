// Keep process alive without active CPU usage
export function keepAlive () {
  // Let the event loop run without blocking
  setInterval(() => {
    // Optional: Minimal heartbeat log (e.g., every hour)
  }, 3_600_000); // 1-hour interval (adjust as needed)

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Shutting down gracefully');
    process.exit(0);
  });
};