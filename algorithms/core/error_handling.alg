ALGORITHM MAP_ERROR(error, context)
  id := CORRELATION_ID(context)
  LOG_REDACTED_DIAGNOSTICS(id, error)
  category := CLASSIFY(error)
  response := SAFE_PUBLIC_ERROR_FOR(category)
  response.correlation_id := id
  RETURN response
  NOTE: Never expose stack traces, secrets, SQL details, or internal paths to callers.
