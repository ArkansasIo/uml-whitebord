ALGORITHM TRANSITION_LIFECYCLE(current, next)
  allowed := {created:[starting,stopping,failed], starting:[ready,stopping,failed],
              ready:[stopping,failed], stopping:[stopped,failed], stopped:[], failed:[stopping,stopped]}
  IF next NOT IN allowed[current]: RETURN INVALID_TRANSITION
  RETURN next
