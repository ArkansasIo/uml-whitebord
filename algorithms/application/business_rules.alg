ALGORITHM APPLY_BUSINESS_RULES(state, command, rules)
  proposed := immutable_copy_or_draft(state)
  FOR rule IN deterministic_order(rules):
    IF rule.applies(command):
      CHECK rule.preconditions(proposed, command)
      IF failed: RETURN BUSINESS_RULE_VIOLATION
      proposed := rule.apply(proposed, command)
  CHECK all domain invariants(proposed)
  RETURN proposed state
