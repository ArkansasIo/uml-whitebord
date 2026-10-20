ALGORITHM EXECUTE_IDEMPOTENT(principal, key, fingerprint, operation)
  REQUIRE nonempty key
  record := atomically reserve (principal, key)
  IF existing fingerprint differs: RETURN KEY_REUSED_WITH_DIFFERENT_REQUEST
  IF existing completed: RETURN stored result
  IF existing in progress: RETURN RETRYABLE_IN_PROGRESS
  result := execute with recovery for side effects
  atomically persist result and completed status
  RETURN result
