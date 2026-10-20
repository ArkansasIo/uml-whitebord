ALGORITHM BUILD_AND_VERIFY(revision)
  checkout exact revision and install locked dependencies
  run format, lint, static analysis, and type checks
  build release artifact
  run unit, integration, and contract tests
  fail pipeline on required check failure
  generate provenance, version metadata, and checksum
  RETURN verified artifact
