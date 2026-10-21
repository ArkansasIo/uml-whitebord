# UML Studio — Complete Tool Catalog

The toolbar and command system should converge on the following toolset. **Current** means the capability exists in the present browser editor; **Planned** means it is specified for implementation.

## Core canvas tools

| Tool | Status | Purpose |
|---|---|---|
| Select | Current | Select and inspect a node or relationship |
| Connector | Current | Connect two diagram objects |
| Pan | Planned | Move the viewport without changing objects |
| Zoom | Current | Zoom the diagram |
| Fit | Current | Fit all objects into the viewport |
| Marquee Select | Planned | Select multiple objects with a rectangle |
| Hand Tool | Planned | Pan using drag gestures |
| Lock | Planned | Prevent accidental edits |
| Hide | Planned | Temporarily hide objects |
| Measure | Planned | Measure canvas distances |
| Minimap | Planned | Navigate large diagrams |

## Object tools

- Add Class — Current
- Add Interface — Current
- Add Package — Current
- Add Component — Current
- Add Use Case — Current
- Add Actor — Current
- Add Database — Current
- Add Note — Current
- Add State — Current
- Add Enumeration — Planned
- Add Object — Planned
- Add Artifact — Planned
- Add Node — Planned
- Add Device — Planned
- Add Port — Planned
- Add Lifeline — Planned
- Add Action — Planned
- Add Decision — Planned
- Add Initial Node — Planned
- Add Final Node — Planned
- Add Fork/Join — Planned
- Add Swimlane — Planned
- Add Frame — Planned
- Add Constraint — Planned
- Add Text — Planned

## Relationship tools

- Association — Current
- Dependency — Current
- Inheritance — Current
- Composition — Current
- Aggregation — Current
- Realization — Planned
- Include — Planned
- Extend — Planned
- Generalization — Planned
- Implementation — Planned
- Message — Planned
- Return Message — Planned
- Create Message — Planned
- Destroy Message — Planned
- Transition — Planned
- Control Flow — Planned
- Object Flow — Planned
- Deployment Link — Planned
- Port Connector — Planned

## Arrange tools

- Align Left
- Align Center
- Align Right
- Align Top
- Align Middle
- Align Bottom
- Distribute Horizontally
- Distribute Vertically
- Make Same Width
- Make Same Height
- Make Same Size
- Group
- Ungroup
- Bring Forward
- Bring to Front
- Send Backward
- Send to Back
- Auto Layout
- Tidy Diagram
- Route Relationships
- Reset Waypoints

## Diagram tools

### Class diagram
- Class
- Interface
- Enumeration
- Association
- Aggregation
- Composition
- Dependency
- Generalization
- Realization
- Association class
- Package

### Use-case diagram
- Actor
- Use case
- System boundary
- Include
- Extend
- Generalization
- Association

### Sequence diagram
- Lifeline
- Actor lifeline
- Boundary
- Control
- Entity
- Activation
- Synchronous message
- Asynchronous message
- Return message
- Create message
- Destroy message
- Combined fragment
- Guard
- Note

### Activity diagram
- Initial node
- Action
- Object node
- Decision
- Merge
- Fork
- Join
- Activity final
- Flow final
- Swimlane
- Control flow
- Object flow

### State machine
- Initial state
- State
- Composite state
- Submachine state
- Choice
- Junction
- History
- Entry point
- Exit point
- Final state
- Transition

### Component diagram
- Component
- Interface
- Provided interface
- Required interface
- Port
- Connector
- Dependency

### Deployment diagram
- Node
- Device
- Execution environment
- Artifact
- Communication path
- Deployment

### Package diagram
- Package
- Import
- Merge
- Access
- Dependency

## Property tools

- Object inspector.
- Relationship inspector.
- Member editor.
- Multiplicity editor.
- Stereotype editor.
- Guard editor.
- Role editor.
- Documentation editor.
- Style editor.
- Position/size editor.
- Layer editor.
- Link editor.
- Source mapping editor.

## Search and command tools

- Shape search — Current
- Command palette — Current
- Global search — Planned
- Symbol search — Planned
- Find references — Planned
- Go to diagram — Planned
- Go to source — Planned
- Keyboard shortcut editor — Planned
- Recent commands — Planned
- Context menu — Planned

## File tools

- New diagram — Current
- Save locally — Current
- Import JSON — Current
- Export JSON — Current
- Export SVG — Current
- Project open — Planned
- Project save — Planned
- Project backup — Planned
- PNG export — Planned
- PDF export — Planned
- Mermaid export — Planned
- PlantUML export — Planned
- Graphviz export — Planned
- XMI export — Planned
- Markdown export — Planned
- HTML export — Planned

## Validation tools

- Validate diagram.
- Validate selected object.
- Validate relationships.
- Validate multiplicities.
- Validate class members.
- Validate state transitions.
- Validate sequence ordering.
- Validate imports.
- Accessibility audit.
- Export preflight.
- Architecture smell detection.

Validation results should be actionable and never silently mutate the user's model.

## AI tools

- Explain diagram.
- Generate diagram from prompt.
- Generate class model from source.
- Generate sequence from workflow.
- Suggest missing relationships.
- Detect architecture smells.
- Rename model elements.
- Normalize naming.
- Improve layout.
- Generate documentation.
- Generate code scaffold.
- Review architecture.
- Compare architectures.
- Create test plan.
- Summarize changes.

AI changes should be previewed as a proposed patch and applied only after explicit approval.

## Agent tools

- Architect Agent.
- UML Agent.
- Source Analysis Agent.
- Documentation Agent.
- Test Agent.
- Security Agent.
- Performance Agent.
- Refactoring Agent.
- Git Agent.

Each agent needs a declared permission set and an execution log.

## Git tools

- Repository status.
- Branch selector.
- Diagram diff.
- Commit preparation.
- Commit message generation.
- Pull request preparation.
- Revision history.
- Restore revision.
- Source mapping.
- Change audit.

Remote writes require explicit user confirmation.

## Runtime and diagnostics tools

- Runtime health.
- JavaScript syntax checks.
- AI adapter status.
- BrainScript validation.
- Storage status.
- Import diagnostics.
- Export diagnostics.
- Error log.
- Performance profiler.
- Feature flag inspector.

## Collaboration tools

These are backend-dependent and should remain disabled until the collaboration service exists:

- Invite member.
- Workspace roles.
- Presence.
- Shared cursor.
- Live selection.
- Comments.
- Mentions.
- Review mode.
- Change requests.
- Conflict resolver.
- Version history.
- Restore checkpoint.

## Accessibility tools

- Keyboard navigation.
- Focus manager.
- Screen-reader descriptions.
- High-contrast mode.
- Reduced motion.
- Touch target diagnostics.
- Accessible export checks.

## Security tools

- Content Security Policy checker.
- SVG sanitization.
- Import size limits.
- File type validation.
- External network permission inspector.
- AI provider permission inspector.
- Git write confirmation.
- Audit log.

## Tool implementation rules

1. Every tool must have a command identifier.
2. Every mutating tool must create an undo checkpoint.
3. Every tool must expose a disabled/unsupported state when prerequisites are missing.
4. Importers validate before changing the active diagram.
5. AI tools produce a reviewable proposal before mutation.
6. Git tools never perform remote writes implicitly.
7. Tools should work from both toolbar and command palette where practical.
8. Keyboard shortcuts must not interfere with text inputs.
9. Tool failures must produce user-readable diagnostics.
10. New tools must have automated regression coverage before being marked Current.
