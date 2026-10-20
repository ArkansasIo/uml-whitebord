ALGORITHM CHECK_RATE_LIMIT(identity, operation, policy)
  key := stable scoped key(identity, operation)
  decision := atomically consume token-bucket or sliding-window capacity
  IF allowed: RETURN ALLOW
  RETURN RATE_LIMITED(retry_after)
  NOTE: Distributed instances need shared/coordinated state for global limits.
