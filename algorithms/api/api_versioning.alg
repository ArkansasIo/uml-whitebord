ALGORITHM RESOLVE_API_VERSION(requested, supported, policy)
  version := parse requested version or documented default
  IF invalid syntax: RETURN INVALID_VERSION
  IF unsupported or retired: RETURN VERSION_UNAVAILABLE
  RETURN version
  NOTE: Publish deprecation policy and test backward compatibility.
