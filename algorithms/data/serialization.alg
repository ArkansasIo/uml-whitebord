ALGORITHM SERIALIZE(domain_object, format, version)
  IF format unsupported: RETURN UNSUPPORTED_FORMAT
  CHECK domain invariants
  dto := MAP_TO_EXPLICIT_PUBLIC_DTO(domain_object)
  APPLY_SCHEMA_VERSION(dto, version)
  result := SAFE_ENCODE(dto, format)
  IF result failed: RETURN SERIALIZATION_FAILED
  RETURN result
