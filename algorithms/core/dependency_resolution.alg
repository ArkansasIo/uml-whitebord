ALGORITHM RESOLVE_DEPENDENCIES(nodes, edges)
  indegree := ZERO_COUNTS(nodes)
  FOR edge IN edges: INCREMENT indegree[edge.dependent]
  ready := all nodes with indegree 0
  ordered := []
  WHILE ready not empty:
    node := REMOVE_ONE(ready); APPEND ordered, node
    FOR dependent IN DEPENDENTS(node):
      DECREMENT indegree[dependent]
      IF indegree[dependent] = 0: ADD ready, dependent
  IF LENGTH(ordered) != LENGTH(nodes): RETURN CYCLE_OR_INVALID_EDGE
  RETURN ordered
