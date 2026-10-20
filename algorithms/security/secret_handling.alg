ALGORITHM RESOLVE_SECRET(reference, identity, provider)
  validate reference and allowlisted provider
  authorize identity for this secret
  retrieve secret through provider; fail closed if unavailable
  register redaction and keep value out of logs and error details
  RETURN secret only to authorized caller
