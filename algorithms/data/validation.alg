ALGORITHM VALIDATE_INPUT(value, schema)
  CHECK size limits before parsing
  CHECK required fields, types, ranges, formats, enums, and cross-field rules
  IF any violation: RETURN VALIDATION_ERRORS
  RETURN NORMALIZE_ALLOWED_VALUES(value)
