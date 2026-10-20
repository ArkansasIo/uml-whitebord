ALGORITHM INITIALIZE_APPLICATION(config, services)
  initialized := []
  order := RESOLVE_DEPENDENCIES(services)
  IF order is error: RETURN CIRCULAR_OR_MISSING_DEPENDENCY
  FOR service IN order:
    IF NOT dependencies_ready(service): CLEANUP_REVERSE(initialized); RETURN DEPENDENCY_NOT_READY
    result := service.initialize(config)
    IF result is error: CLEANUP_REVERSE(initialized); RETURN INITIALIZATION_FAILED
    APPEND initialized, service
  RETURN SUCCESS(initialized)
