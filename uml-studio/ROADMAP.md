# UML Whiteboard — Product Roadmap

This document tracks a practical evolution path for MLTA UML Studio, the static browser-based UML diagram editor in `uml-studio/`.

## Current implemented baseline

- Browser-based diagram canvas with class, interface, package, component, use-case, actor, database, note, and state shapes.
- Move and edit shapes; create and edit association, dependency, inheritance, composition, and aggregation relationships.
- Shape inspector, canvas grid, snap-to-grid controls, zoom and fit controls.
- Undo/redo, keyboard shortcuts, local browser save/restore, and new diagram action.
- Editable JSON import/export and SVG export.
- Command palette and supplemental Brain, Agents, Memory, Source, Docs, Git, and Runtime workbench panels.
- GitHub Actions validation and optional GitHub Pages deployment.

**Storage note:** diagram persistence is local to the browser origin. JSON export/import is the portability mechanism; cloud sync and real-time collaboration are not currently implemented.

## Priority 1 — Diagram reliability

- [ ] Add automated browser tests for create, rename, move, connect, delete, undo/redo, save/restore, import, and export workflows.
- [ ] Add schema-versioned JSON files and explicit migration handlers.
- [ ] Validate node dimensions, coordinates, relationship types, unique IDs, and endpoint references with actionable import diagnostics.
- [ ] Add dirty-state confirmation before destructive replacement or navigation.
- [ ] Test keyboard navigation, focus handling, and mobile touch interaction.
- [ ] Add regression coverage for missing localStorage, malformed JSON, and oversized import files.

## Priority 2 — UML authoring

- [ ] Add dedicated sequence-diagram lifelines, messages, and activation bars.
- [ ] Add activity-diagram actions, decisions, merge nodes, and swimlanes.
- [ ] Add state-machine initial/final pseudostates and transition guards.
- [ ] Add package containment and diagram layers.
- [ ] Add relationship multiplicities, role names, stereotypes, and visibility modifiers.
- [ ] Add alignment, distribution, duplicate, group, and multi-select operations.
- [ ] Add diagram validation for common UML constraints with warnings instead of silently altering content.

## Priority 3 — Project workspace

- [ ] Add a project manifest supporting multiple diagrams and shared model elements.
- [ ] Add explicit local project open/save/export workflows.
- [ ] Add a searchable diagram list and recent diagrams.
- [ ] Add deterministic SVG export and print/page-layout options.
- [ ] Add accessibility labels, high-contrast themes, and configurable keyboard shortcuts.

## Priority 4 — Collaboration and integrations

These require architecture and deployment work beyond the current static prototype.

- [ ] Define authentication, authorization, and workspace membership before adding remote storage.
- [ ] Design a versioned diagram API and persistent data model.
- [ ] Design conflict handling and operation ordering before real-time collaborative editing.
- [ ] Add revision history, comments, sharing links, and restore flows only after server-side identity and permissions are in place.
- [ ] Add optional Git integration with explicit user approval before creating or changing repository files.
- [ ] Add BrainScript/AI diagram generation with preview, validation, and undoable application of changes.

## Definition of done

A feature is complete when its behavior is documented, failure states are handled, automated checks cover important paths, existing diagram files remain compatible (or have a migration), accessibility has been considered, and CI passes. Avoid describing a planned capability as available until it has been implemented and verified.

## Deployment

The GitHub Pages workflow validates `uml-studio/` and deploys it using GitHub Actions when configured in repository Settings → Pages. Check the Actions run and Settings → Pages for the actual deployment result.
