ALGORITHM GET_CACHED(key, loader, policy)
  entry := cache.get(key)
  IF entry exists AND not expired: RETURN entry.value
  value := loader(key)
  IF loader failed: RETURN failure
  cache.set(key, value, bounded_expiry(policy))
  RETURN value
  NOTE: Define invalidation, maximum size, concurrency, and stale-data policy.
