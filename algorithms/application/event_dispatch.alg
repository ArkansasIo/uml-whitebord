ALGORITHM DISPATCH_EVENT(event, subscribers)
  matched := subscribers for event type
  FOR subscriber IN matched:
    result := invoke according to sync/async policy
    record handler result
    IF durable delivery required: use persistent queue/outbox and retry policy
  RETURN dispatch summary
