ALGORITHM EXECUTE_WORKFLOW(definition, persisted_context)
  FOR step IN definition.steps:
    persist step status = in_progress
    result := execute step with bounded timeout
    IF transient failure AND retry safe AND attempts remain: retry with backoff+jitter
    IF permanent failure: run defined compensations in reverse order; persist failed state; RETURN failure
    persist result and completed status
  RETURN workflow context
