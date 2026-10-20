ALGORITHM EXECUTE_TRANSACTION(work, manager)
  tx := manager.begin()
  IF tx failed: RETURN TRANSACTION_START_FAILED
  TRY:
    result := work(tx)
    IF result failed: ROLLBACK_IF_ACTIVE(tx); RETURN result
    commit := COMMIT(tx)
    IF commit failed: ROLLBACK_IF_ACTIVE(tx); RETURN COMMIT_FAILED
    RETURN result
  CATCH error:
    ROLLBACK_IF_ACTIVE(tx)
    RETURN TRANSACTION_FAILED
