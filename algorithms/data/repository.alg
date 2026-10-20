ALGORITHM SAVE_ENTITY(entity, repository)
  CHECK entity and domain invariants
  result := repository.ATOMIC_INSERT_OR_UPDATE(entity)
  IF unique constraint or concurrency conflict: RETURN CONFLICT
  IF storage failure: RETURN DEPENDENCY_FAILURE
  RETURN saved entity
  NOTE: Prefer database-native upsert or a transaction over read-then-write.
