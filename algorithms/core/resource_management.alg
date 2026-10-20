ALGORITHM WITH_RESOURCE(acquire, operation, release)
  resource := acquire()
  IF resource failed: RETURN RESOURCE_ACQUISITION_FAILED
  TRY: RETURN operation(resource)
  FINALLY:
    cleanup := release(resource)
    IF cleanup failed: LOG_CLEANUP_FAILURE(cleanup)
  NOTE: Preserve the primary operation error if cleanup also fails.
