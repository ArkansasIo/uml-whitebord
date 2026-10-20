ALGORITHM GRACEFUL_SHUTDOWN(deadline)
  atomically transition to stopping; repeated calls are safe
  stop accepting new work
  signal workers and wait until deadline
  cancel remaining work according to policy
  checkpoint required state and close connections
  flush logs/metrics and release resources
  transition to stopped
