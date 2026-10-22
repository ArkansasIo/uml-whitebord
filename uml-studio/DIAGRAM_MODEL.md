# UML Diagram Model Contract

```text
Browser editor
    -> parsed JSON / current in-memory document
    -> MLTADiagramModel.validateDiagram
    -> diagnostics (errors + warnings)
    -> normalizeDiagram (schemaVersion: 1)
    -> editor or export/import adapter
```

## Public browser API

```js
const result = window.MLTADiagramModel.validateDiagram(document);
if (!result.ok) {
  console.error(result.errors);
}
const normalized = window.MLTADiagramModel.normalizeDiagram(document);
```

```ts
type Diagnostic = {
  code: string;
  message: string;
  path: string;
};
type ValidationResult = {
  ok: boolean;
  errors: Diagnostic[];
  warnings: Diagnostic[];
};
```

## Validated invariants

- Input is an object containing node and edge arrays.
- Node and edge identifiers are non-empty strings and unique within their respective collections.
- Node and relationship kinds belong to the editor's supported enumerations.
- Geometry values are finite; node width and height remain within editor bounds.
- Node names, descriptions, member lists, relationship labels and title have explicit size limits.
- Every relationship endpoint refers to an existing node.
- Self-relationships are rejected because the current editor does not support them.
- Node and relationship count caps protect callers from unexpectedly large documents.
- Only schema version 1 is normalized; a future schema migration should be explicit rather than guessed.

## Diagnostic codes

Representative error codes include `NODES_NOT_ARRAY`, `DUPLICATE_NODE_ID`, `INVALID_NODE_GEOMETRY`, `INVALID_EDGE_TYPE`, `DANGLING_SOURCE`, `DANGLING_TARGET`, `SELF_RELATIONSHIP`, `NODE_LIMIT_EXCEEDED`, and `UNSUPPORTED_SCHEMA_VERSION`.

Paths use JSONPath-like strings to identify the source property, for example `$.nodes[2].w`.

## Scope boundary

This module validates the editor's present data model. It is not a complete OMG UML conformance checker. It does not yet implement sequence, activity, state-machine, multiplicity, visibility, or stereotype semantics. Import code should call validation before replacing the active diagram, and any migration between schema versions must be separately tested.
