# UML Studio — Complete Feature Set

This document is the functional target for the UML Whiteboard application. Items marked **Current** exist in the browser editor today; **Planned** items are the remaining implementation scope.

## 1. Workspace and project management

### Current
- UML workspace mode.
- Brain, Agents, Memory, Source, Docs, Git, and Runtime workspace modes.
- Diagram title editing.
- New diagram command.
- Local browser persistence.
- Editable JSON import/export.
- SVG export.

### Planned
- Project container with multiple diagrams.
- Project explorer tree.
- Folders and diagram groups.
- Recent projects and recent diagrams.
- Rename, duplicate, archive, and delete diagram commands.
- Project metadata: name, version, author, description, tags.
- Autosave with configurable interval.
- Local backup snapshots.
- Import/export complete project bundles.
- Schema migration between project versions.
- Optional remote project storage.

## 2. Canvas and navigation

### Current
- SVG diagram canvas.
- Pan/zoom.
- Fit-to-canvas.
- Grid visibility.
- Snap-to-grid setting.
- Select and connector tools.
- Delete, undo, and redo.

### Planned
- Mouse-wheel zoom around cursor.
- Space/hand pan mode.
- Multi-select marquee.
- Shift-click additive selection.
- Select all / invert selection.
- Lock/unlock objects.
- Hide/show objects.
- Alignment guides.
- Smart guides.
- Horizontal/vertical distribution.
- Center horizontally/vertically.
- Group/ungroup.
- Bring forward/send backward.
- Layers panel.
- Canvas minimap.
- Rulers and guides.
- Infinite canvas mode.
- Page/frame mode for printable diagrams.
- Fullscreen canvas.

## 3. UML class modeling

### Current
- Class and interface nodes.
- Attributes and operations/member text.
- Description field.
- Position and size editing.
- Association, dependency, inheritance, composition, and aggregation relationships.

### Planned
- Visibility modifiers: public, protected, private, package.
- Static and abstract members.
- Generic types.
- Parameter lists and return types.
- Stereotypes.
- Multiplicity.
- Role names.
- Navigability.
- Association classes.
- Template classes.
- Enumeration types.
- Primitive/data types palette.
- Method signatures with structured editing.
- Class compartments with configurable visibility.
- Automatic class layout.
- Model consistency validation.

## 4. Structural UML diagrams

- **Package diagram:** packages, imports, dependencies, containment.
- **Component diagram:** components, ports, interfaces, connectors.
- **Deployment diagram:** nodes, devices, execution environments, artifacts.
- **Composite structure:** parts, ports, connectors, collaborations.
- **Object diagram:** object instances and slot values.
- **Profile diagram:** stereotypes, metaclasses, tagged values, constraints.

## 5. Behavioral UML diagrams

- **Use-case diagram:** actors, use cases, system boundaries, include, extend, generalization.
- **Activity diagram:** actions, decisions, merges, forks, joins, initial/final nodes, swimlanes.
- **State-machine diagram:** states, transitions, guards, events, entry/exit/do actions, composite states.
- **Sequence diagram:** participants, lifelines, calls, returns, activation bars, fragments, messages.
- **Communication diagram:** participants and numbered message links.
- **Interaction overview:** interaction nodes and control flow.
- **Timing diagram:** lifelines, state/value changes, time constraints.

## 6. Relationship system

Planned relationship metadata:
- Relationship type.
- Source and target endpoints.
- Label.
- Source/target role.
- Multiplicity.
- Directionality.
- Navigability.
- Guard/condition.
- Stereotype.
- Line style.
- Arrowhead style.
- Routing mode.
- Waypoints.
- Orthogonal routing.
- Self-reference routing.
- Relationship validation.

## 7. Styling and themes

### Current
- Canvas background color.
- Grid toggle.
- Style panel.

### Planned
- Light, dark, and high-contrast themes.
- UML color themes.
- Shape fill/border/text controls.
- Font family, size, weight, and alignment.
- Line width and dash style.
- Arrowhead configuration.
- Corner radius.
- Shadow controls.
- Global diagram theme tokens.
- Per-object style overrides.
- Style presets.
- Import/export theme definitions.

## 8. Text and annotation

Planned:
- Free text blocks.
- Rich text notes.
- Markdown notes.
- Callouts.
- Constraints.
- Comments.
- Links to source files.
- Links to documentation.
- Embedded code snippets.
- Diagram legends.
- Titles and section headers.
- Sticky-note style annotations.

## 9. Automatic layout

Planned layout engines:
- Grid.
- Tree.
- Hierarchical.
- Layered DAG.
- Force-directed.
- Orthogonal.
- Radial.
- Circular.
- Swimlane-aware activity layout.
- Sequence-diagram participant alignment.
- State-machine layout.
- Package containment layout.
- Layout preview before applying changes.
- Undoable layout operations.

## 10. Search, navigation, and commands

### Current
- Shape search.
- Command palette.
- File/Edit/View/Arrange menus.

### Planned
- Global project search.
- Search by class, interface, relationship, tag, or note.
- Find references.
- Go to symbol.
- Go to diagram.
- Command history.
- Recent commands.
- Keyboard shortcut editor.
- Context menus.
- Quick actions.
- Command aliases.
- Fuzzy command search.

## 11. Verification and validation

Planned validator categories:
- Invalid relationship endpoints.
- Duplicate model IDs.
- Dangling references.
- Missing required UML properties.
- Invalid multiplicity syntax.
- Invalid member signatures.
- Invalid state transitions.
- Sequence message ordering errors.
- Package containment errors.
- Unsupported stereotype usage.
- Import schema errors.
- Accessibility warnings.
- Export warnings.

Validation output should contain severity, code, message, object ID, source location, and suggested fix.

## 12. Code and source integration

Planned:
- Source explorer.
- File-to-diagram links.
- Symbol-to-class mapping.
- Generate UML from TypeScript/JavaScript.
- Generate UML from C++.
- Generate UML from Python.
- Generate UML from Java/C#.
- Reverse-engineer class relationships.
- Generate code from class diagrams.
- Synchronization preview.
- Conflict detection.
- Never overwrite source without explicit confirmation.

## 13. Documentation integration

Planned:
- Diagram documentation pages.
- Architecture decision records.
- Design notes.
- Requirements links.
- API documentation links.
- Markdown export.
- HTML documentation export.
- Static documentation site generation.
- Diagram embedding into Markdown.

## 14. Git integration

Planned:
- Repository status.
- Branch information.
- Diagram change summary.
- Diff viewer for JSON diagrams.
- Commit preparation.
- Commit message assistant.
- Pull-request preparation.
- Version tags.
- Diagram history.
- Restore from a previous revision.
- Explicit confirmation before any remote write.

## 15. AI-assisted architecture

### Current foundation
- Brain workspace.
- Agents workspace.
- BrainScript runtime integration.
- Ollama adapter.
- Brain adapter.
- Verification hooks.

### Planned
- Natural-language diagram generation.
- Explain selected diagram.
- Detect architecture smells.
- Suggest missing relationships.
- Generate sequence diagrams from workflows.
- Generate class diagrams from source.
- Convert requirements into UML.
- Refactor diagram layout with AI.
- Generate documentation from diagrams.
- Generate implementation scaffolding.
- Compare two architectures.
- Architecture review agent.
- UML validation agent.
- Test-design agent.
- Documentation agent.
- Human approval gate before applying AI mutations.
- Full undo for AI-generated changes.

## 16. Agent system

Planned agents:
- Architect Agent.
- UML Modeler Agent.
- Code Analyst Agent.
- Documentation Agent.
- Test Agent.
- Security Review Agent.
- Performance Review Agent.
- Refactoring Agent.
- Git Agent.
- Project Manager Agent.

Every agent should expose capabilities, inputs, outputs, permissions, execution status, diagnostics, and an audit trail.

## 17. Memory system

Planned:
- Project facts.
- Architecture decisions.
- Design conventions.
- Naming rules.
- User-defined constraints.
- Diagram history summaries.
- Source relationships.
- Searchable semantic memory.
- Memory approval/deletion controls.
- Memory export/import.

## 18. Collaboration

Planned server-backed capabilities:
- User accounts.
- Workspace membership.
- Roles and permissions.
- Presence indicators.
- Real-time cursors.
- Collaborative selection.
- Operation-based synchronization.
- Conflict resolution.
- Comments and mentions.
- Review mode.
- Version history.
- Restore points.

Collaboration is intentionally not represented as available until a backend, authentication model, persistence layer, and synchronization protocol exist.

## 19. Import/export

Planned formats:
- MLTA JSON.
- Project bundle.
- SVG.
- PNG.
- PDF.
- Mermaid.
- PlantUML.
- Graphviz DOT.
- Markdown.
- HTML.
- XMI/UML exchange where practical.

Every importer should validate before mutating the active document.

## 20. Accessibility and device support

Planned:
- Full keyboard operation.
- Screen-reader labels.
- Focus-visible states.
- Reduced-motion mode.
- High-contrast mode.
- Touch-friendly handles.
- Tablet layout.
- Mobile inspection mode.
- Responsive sidebars.
- Minimum target sizes.
- Accessible dialogs and menus.

## 21. Security and privacy

Planned:
- Content Security Policy.
- Input sanitization.
- Safe SVG export.
- Safe import limits.
- No implicit external network calls.
- AI provider permission controls.
- Secret-free client configuration.
- Audit log for privileged actions.
- Explicit Git write confirmation.
- Data deletion/export controls.

## 22. Testing

Planned test layers:
- Unit tests.
- Model/schema tests.
- Import/export round-trip tests.
- Browser interaction tests.
- Accessibility tests.
- Visual regression tests.
- Performance tests.
- AI contract tests.
- Git integration tests using fixtures.
- Security tests.
- Mobile viewport tests.

## 23. Performance

Planned:
- Virtualized object rendering for large diagrams.
- Batched SVG updates.
- Spatial indexing.
- Incremental relationship routing.
- Debounced persistence.
- Worker-based layout calculation.
- Lazy workspace modules.
- Large-project memory profiling.
- Export performance benchmarks.

## 24. Administration and diagnostics

Planned:
- Runtime diagnostics panel.
- Environment information.
- Feature flags.
- Log viewer.
- Error reports.
- Storage inspector.
- Import/export diagnostics.
- AI provider diagnostics.
- Git diagnostics.
- Performance profiler.

## 25. Definition of complete UML Studio

The application is considered feature-complete when a user can create a multi-diagram project, model structural and behavioral UML, validate the model, organize and style diagrams, import/export interoperable representations, connect diagrams to source/documentation, safely use AI assistance, test workflows, and recover previous versions without requiring an undocumented backend dependency.
