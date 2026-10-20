# MLTA Studio — Component, Field, Tool, and API Catalog

## Application surfaces
- Application shell: header, menu bar, toolbar, command palette, navigation tree, workspace, page host, dockable panels, status bar, notifications, footer.
- Project tools: new/open/close project, source explorer, file templates, project settings, import/export, build targets, recent projects.
- Logic tools: node palette, tree/graph editor, property inspector, variable inspector, expression editor, type browser, module/class/function browser, execution trace.
- Quality tools: validation, diagnostics list, source locations, warnings/errors, resource-budget view, test runner, test results.
- API tools: endpoint catalog, request/response schema editor, route inspector, API contract preview, OpenAPI export, adapter integration points.
- Extensibility: plugin catalog, capability declarations, permission review, plugin diagnostics, lifecycle controls.
- Persistence: project manifest, settings, source files, local cache, export/import, storage-adapter interfaces.

## Field definition model
Each field has a stable key, type, description, required flag, optional default, validation constraints, and optional UI metadata. Types should include null, boolean, integer, float, string, enum, object, array, reference, date/time, and binary metadata. Validate all values at trust boundaries; do not execute untrusted plugin code by default.

## Logic node kinds
Master, Statement, Branch, Module, Class, Type, Array, Operation, Function, Literal, and Variable.

## Initial expression syntax
One expression per line; blank lines and lines starting with # are ignored.

    add(2, 3)
    and(true, not(false))
    concat("MLTA ", "Studio")
    eq("ready", "ready")

Supported operations: add, sub, mul, div, gt, lt, eq, and, or, not, and concat. Variable identifiers resolve against the execution context. This is an initial expression language, not a full programming language with declarations, loops, functions, or module imports.

## In-process API routes
| Method | Path | Purpose |
|---|---|---|
| GET | /health | Health check |
| GET | /v1/capabilities | List implemented engine capabilities |
| POST | /v1/validate | Validate expression source |
| POST | /v1/execute | Execute expression source |

The current router is a transport-neutral C++ handler, not an HTTP listener. To expose it over a network, add an HTTP adapter and configure authentication, authorization, TLS, request-size limits, rate limiting, audit logging, and deployment policy. Do not expose arbitrary execution to an untrusted network without those controls.

## Roadmap
1. Connect the engine to the Qt shell.
2. Add interactive node editing with selection, connectors, undo/redo, and keyboard navigation.
3. Implement project manifests, generated API project templates, and schema validation.
4. Add persistent project storage and safe plugin lifecycle management.
5. Add HTTP server adapter, authentication middleware, OpenAPI generation, and integration tests.
6. Add debugger stepping, breakpoints, source maps, profiler, and resource metrics.
7. Package installers and add platform CI builds.
