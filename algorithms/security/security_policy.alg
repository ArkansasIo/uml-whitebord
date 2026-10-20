ALGORITHM EVALUATE_POLICY(principal, action, resource, context)
  if identity/context invalid: DENY
  if resource out of scope or action prohibited: DENY
  decision := evaluate policy with trusted attributes
  if decision is not explicit ALLOW: DENY
  RETURN ALLOW
