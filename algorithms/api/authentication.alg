ALGORITHM AUTHENTICATE(credentials, identity_provider)
  IF credentials missing: RETURN UNAUTHENTICATED
  verification := provider.verify using established protocol/library
  IF invalid, expired, revoked, disabled, or unverifiable: RETURN UNAUTHENTICATED
  principal := load trusted identity and current status
  IF principal missing or disabled: RETURN UNAUTHENTICATED
  RETURN principal
