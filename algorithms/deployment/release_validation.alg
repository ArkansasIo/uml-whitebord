ALGORITHM VALIDATE_RELEASE(artifact, policy)
  verify provenance, checksum, version, test evidence, and dependency report
  verify configuration schema and migration compatibility
  verify backup restore and rollback procedures
  require approvals when policy says so
  RETURN APPROVED only when all mandatory checks pass
