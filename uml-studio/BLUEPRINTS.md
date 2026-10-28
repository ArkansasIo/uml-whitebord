# UML Blueprint Library

The Blueprint button in the UML Studio toolbar opens reusable diagram starters. Applying a blueprint replaces the active diagram after a confirmation prompt. Export your current work to JSON first if it must be retained.

## Included templates

- **Application Class Model** — application/service/repository contracts and persistence.
- **REST API Architecture** — client, HTTP API, domain service, repository, and database boundaries.
- **RPG / MMORPG Core** — character progression, stats, combat, inventory/equipment, quests, authoritative server, and persistence.
- **Database Domain Model** — user, role, and permission relationships.
- **AI Agent Runtime** — planner, policy gate, tool executor, audit trace, and scoped memory.

## Blueprint format

A blueprint uses the same node and relationship structures as the current editor:

- `schemaVersion`: integer version of the blueprint interchange format.
- `title`: diagram title.
- `nodes`: unique IDs, supported node type, name, description, members, and numeric x/y/w/h geometry.
- `edges`: unique IDs, source and target node IDs, relationship type, and optional label.

Supported node types: `class`, `interface`, `package`, `component`, `usecase`, `actor`, `database`, `note`, and `state`.

Supported relationships: `association`, `dependency`, `inheritance`, `composition`, and `aggregation`.

## Safety and limitations

The blueprint registry validates IDs, node/edge limits, supported types, geometry, and relationship endpoints before applying a template. Templates are local JavaScript data; no external AI service or server is required. Applying a template is an undoable editor operation. Downloaded JSON is portable, but cloud storage and collaboration are not provided by this feature.

This is a practical starter-template system, not a claim of full OMG UML 2.5.1 conformance. See the [official UML specification](https://www.omg.org/spec/UML/2.5.1).
