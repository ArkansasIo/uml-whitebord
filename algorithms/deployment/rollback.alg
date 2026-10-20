ALGORITHM ROLLBACK(failed_release, previous_release)
  stop new deployments and assess data/schema state
  if schema is backward compatible: restore previous application version
  otherwise execute documented data recovery or forward-fix procedure
  verify configuration, smoke tests, and health
  if verification fails: escalate to recovery plan
  record incident and rollback result
