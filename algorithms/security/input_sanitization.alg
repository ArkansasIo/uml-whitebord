ALGORITHM PROCESS_UNTRUSTED_INPUT(raw, schema, context)
  enforce byte and nesting limits before parsing
  parse using safe parser and validate types, ranges, allowlists, business rules
  use parameterized SQL values, contextual HTML encoding, and safe process APIs
  reject unsafe shell interpolation
  RETURN validated value
