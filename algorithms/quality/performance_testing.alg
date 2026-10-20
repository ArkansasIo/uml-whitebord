ALGORITHM RUN_PERFORMANCE_TEST(workload, thresholds)
  define dataset, concurrency, duration, ramp, and target percentiles
  warm up system
  execute controlled workload and collect latency, throughput, errors, resource use
  compare p50/p95/p99 and error rate to thresholds
  RETURN reproducible report with environment metadata
