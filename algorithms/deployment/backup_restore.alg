ALGORITHM BACKUP_AND_VERIFY(target, policy)
  create consistent snapshot using storage-native mechanism
  encrypt and store backup with access controls and retention
  verify checksum and metadata
  restore to isolated environment
  validate restored data and record recovery test
  RETURN backup only after verification succeeds
