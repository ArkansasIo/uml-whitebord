ALGORITHM DISPATCH_USE_CASE(command, context, registry)
  IF command missing: RETURN INVALID_COMMAND
  handler := registry.find_exact_handler(type(command))
  IF handler missing: RETURN UNSUPPORTED_OPERATION
  VALIDATE command
  AUTHORIZE context.principal for command and target resource
  result := handler.execute(command, context)
  RETURN normalized Result(success or typed error)
