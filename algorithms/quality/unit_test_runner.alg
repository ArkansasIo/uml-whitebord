ALGORITHM RUN_UNIT_TESTS(catalog)
  report := new report
  FOR test IN catalog:
    create isolated context and fixtures
    execute with bounded timeout; record pass/fail/error
    always clean fixtures and context
  calculate counts and coverage if available
  RETURN report
