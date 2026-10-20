ALGORITHM LOAD_CONFIGURATION(defaults, files, environment, arguments)
  result := COPY(defaults)
  FOR source IN [files, environment, arguments]:
    result := MERGE_BY_DOCUMENTED_PRECEDENCE(result, source)
  errors := VALIDATE_SCHEMA_AND_RANGES(result)
  IF errors not empty: RETURN INVALID_CONFIGURATION(errors)
  RESOLVE_SECRET_REFERENCES_WITH_SECRET_PROVIDER(result)
  RETURN IMMUTABLE(result)
