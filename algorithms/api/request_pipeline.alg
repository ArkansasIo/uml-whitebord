ALGORITHM PROCESS_REQUEST(request)
  enforce protocol, size, and timeout limits
  route := match method and normalized path; reject ambiguous routes
  apply request policy and rate limit
  authenticate where required; authorize action and resource
  parse and validate body against schema
  invoke application use case
  map typed result to stable response contract
  on unexpected error: log redacted details and return generic error with correlation id
  finally record metrics and release request resources
