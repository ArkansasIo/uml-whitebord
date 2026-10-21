# UML Studio — Feature Architecture

## Runtime layers

```text
UI / Workbench
    |
    +-- Toolbar / Menus / Command Palette
    |
    +-- Workspace Modes
    |      UML / Brain / Agents / Memory / Source / Docs / Git / Runtime
    |
    v
Diagram Interaction Layer
    |
    +-- Selection
    +-- Transform
    +-- Connection Routing
    +-- Layout
    +-- Undo / Redo
    |
    v
Diagram Model
    |
    +-- Project
    +-- Diagram
    +-- Node
    +-- Relationship
    +-- Style
    +-- Annotation
    +-- Metadata
    |
    +-------------------------+
    |                         |
    v                         v
Validation               Serialization
    |                         |
    v                         +-- MLTA JSON
Diagnostics                  +-- SVG
                              +-- Future interchange formats

Optional integrations
    |
    +-- BrainScript
    +-- AI adapters
    +-- Source analysis
    +-- Documentation
    +-- Git
    +-- Remote collaboration
```

## Model requirements

Every diagram object should have:

- Stable unique ID.
- Type discriminator.
- Human-readable name where applicable.
- Position and dimensions.
- Style reference or inline style.
- Optional metadata.
- Schema version at document level.

Relationships should reference object IDs rather than object positions. Importers must reject or quarantine dangling references rather than silently creating invalid models.

## Command architecture

All mutations should eventually flow through a command abstraction:

```text
Command
  -> validate preconditions
  -> capture undo state
  -> mutate model
  -> emit model-change event
  -> update view
  -> persist if enabled
```

This gives toolbar buttons, keyboard shortcuts, command palette commands, AI proposals, and future collaboration operations the same mutation semantics.

## AI mutation architecture

AI systems should never directly modify the active model.

```text
Prompt / Source
      |
      v
AI Adapter
      |
      v
Structured Proposal
      |
      v
Schema Validation
      |
      v
Human Review
      |
      +---- reject
      |
      v
Command Batch
      |
      v
Undoable Model Mutation
```

## Collaboration architecture

Remote collaboration should be added only after the local command model is stable.

```text
Local Command
      |
      v
Operation / Event
      |
      +--> Local model
      |
      +--> Sync transport
                |
                v
          Server authority
                |
                v
          Other clients
```

Conflict handling should be explicit. The first implementation should prefer deterministic operation ordering and revision IDs over attempting an undocumented CRDT design.

## Source synchronization

Source integration should use a mapping layer:

```text
Source Symbol <-> Model Element <-> Diagram Object
```

Generation and reverse engineering must operate on a preview/diff model. Source files are never overwritten merely because a diagram changed.

## Persistence strategy

### Local-first

The current application is offline-first. Browser storage is appropriate for the current prototype. JSON export is the portable backup format.

### Future project storage

A project store should provide:

- Project ID.
- Revision ID.
- Updated timestamp.
- Schema version.
- Diagram collection.
- Asset references.
- Audit metadata.

## Security boundaries

External capabilities must be isolated:

- AI network access is opt-in.
- Git writes require explicit approval.
- Imported SVG must be sanitized.
- Imported JSON must have size and nesting limits.
- Remote collaboration must authenticate users before reading private projects.
- Secrets never belong in browser source files.

## Testing strategy

The architecture should support four levels of verification:

1. Pure model/unit tests.
2. Command and serialization tests.
3. Browser interaction tests.
4. Integration tests for optional AI/Git/backend services.

A feature is not considered production-ready until its core mutation path is covered by regression tests.
