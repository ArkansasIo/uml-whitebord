ALGORITHM CHECK_HEALTH(policy)
  IF process cannot respond: RETURN UNHEALTHY
  IF required initialization incomplete: RETURN NOT_READY
  IF critical dependency degraded: RETURN DEGRADED
  RETURN HEALTHY
  NOTE: Keep liveness cheap and avoid restart loops during dependency outages.
