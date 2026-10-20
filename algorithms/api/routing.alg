ALGORITHM MATCH_ROUTE(method, path, registry)
  normalized := normalize path without bypassing security boundaries
  candidates := registry match normalized path and method
  IF zero candidates: RETURN NOT_FOUND
  IF multiple candidates: RETURN AMBIGUOUS_ROUTE
  RETURN single route
