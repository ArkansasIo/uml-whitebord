ALGORITHM APPLY_MIGRATIONS(catalog, current_version)
  pending := SORT_ASCENDING(catalog versions greater than current_version)
  FOR migration IN pending:
    REQUIRE migration.version is next expected version
    VERIFY checksum and prerequisites
    APPLY with migration lock / concurrency coordination
    IF failure: STOP and report exact migration; do not mark success
    RECORD version and checksum only after successful application
  RETURN latest applied version
