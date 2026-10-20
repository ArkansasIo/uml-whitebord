ALGORITHM AUTHORIZE(principal, action, resource, policy)
  IF principal missing: DENY
  decision := evaluate trusted policy for subject, action, resource, context
  IF decision is not explicit ALLOW: audit denial; DENY
  audit allowed decision when required
  RETURN ALLOW
  NOTE: Default deny; enforce object-level permissions as well as route permissions.
