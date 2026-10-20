ALGORITHM RECORD_AUDIT(actor, action, resource, outcome, correlation_id)
  build schema-conformant event with UTC timestamp
  minimize personal data and redact secrets
  write to protected append-only or tamper-evident sink
  if write fails, apply documented fail-closed or degraded policy
  RETURN durable write result
