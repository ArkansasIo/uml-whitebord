# UML Relationship and Diagram System

## Current editor compatibility

The existing canvas model supports these node kinds: class, interface, package, component, use case, actor, database, note, and state. Its current connector renderer supports association, dependency, inheritance, composition, and aggregation.

The new `uml-systems.js` catalog describes 14 diagram families and their specialized semantic elements and properties. Catalog entries are capability contracts and design metadata; they do **not** imply that every specialized visual editor or UML metamodel is already implemented.

## Relationship model contract

A normalized relationship should carry:

```json
{
  "id": "edge-1",
  "type": "association",
  "from": "node-1",
  "to": "node-2",
  "label": "owns",
  "sourceRole": "owner",
  "targetRole": "owned",
  "sourceMultiplicity": "1",
  "targetMultiplicity": "0..*",
  "navigability": "target",
  "stereotype": "",
  "guard": "",
  "routing": "orthogonal",
  "waypoints": []
}
```

Use stable node IDs for endpoints; never bind relationships to array indices or screen coordinates. Imports should validate ID uniqueness, endpoint existence, supported kinds, geometry, and size limits. Unknown fields should be preserved by a migration layer only when their semantics are understood.

## Diagram families in the catalog

Class, use-case, sequence, activity, state-machine, component, deployment, package, object, communication, timing, interaction-overview, composite-structure, and profile diagrams.

## Implementation boundary

The catalog is a roadmap contract for specialized editors. Sequence lifelines/messages, activity control nodes, state transition guards, deployment artifacts, and profile extensions require dedicated model shapes and renderers before those diagrams can be described as fully supported. The current generic canvas is not a complete UML 2.5.1 implementation.
