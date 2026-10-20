ALGORITHM MAP_RESPONSE(result)
  IF success: map to explicit public DTO and documented success status
  ELSE map typed categories: validation 400; unauthenticated 401; forbidden 403;
    not-found 404; conflict 409; rate-limited 429; unexpected 500
  omit secrets, stack traces, and internal diagnostics
  include correlation id where applicable
