# MLTA Studio

MLTA Studio is a C++23 desktop development environment and application/API builder based on MLTAEngine.

## Implemented foundation

- Optional Qt 6 Widgets shell with project explorer, source editor, logic outline, diagnostics output, component/field catalog, toolbox, menus, toolbar, and status footer.
- Engine library with typed values, logic nodes, expression parser/evaluator, variable context, diagnostics, execution trace, and configurable depth/instruction/source limits.
- Transport-neutral API router for health, capabilities, validation, and execution.
- Component/field catalog for application manifests, logic nodes, modules, classes, types, arrays, operations, functions, pages, widgets, data models, API endpoints, and plugins.
- OpenAPI 3.1 contract and initial C++ unit/integration tests.
- CLI bootstrap when Qt 6 is not installed.

## Build and test

Requirements: CMake 3.25+ and a C++23-capable compiler. Qt 6.4+ with Widgets enables the GUI.

```sh
cmake -S mlta-studio -B build/mlta-studio -DCMAKE_BUILD_TYPE=Release
cmake --build build/mlta-studio --config Release
ctest --test-dir build/mlta-studio --output-on-failure
```

Example expressions (one expression per line):

```text
add(2, 3)
and(true, not(false))
concat("MLTA ", "Studio")
eq("ready", "ready")
```

Initial operations: add, sub, mul, div, gt, lt, eq, and, or, not, concat. Variables can be supplied through the engine execution context.

## API project generator

The `mlta::generator::generateApiApplication` function writes a starter C++23 API project, CMake file, README, and OpenAPI 3.1 contract from an application specification. See [Project Generator](docs/PROJECT_GENERATOR.md). Project slugs and route methods are validated. The generated output is a starter, not a running HTTP server.

## API

See [OpenAPI contract](api/openapi.yaml) and [component catalog](docs/COMPONENT_CATALOG_AND_API.md).

- `GET /health`
- `GET /v1/capabilities`
- `POST /v1/validate` — body is MLTA expression source as text
- `POST /v1/execute` — body is MLTA expression source as text

The C++ router is an in-process request handler, **not a network HTTP server**. Before network exposure, add a real HTTP adapter plus authentication/authorization, TLS, rate limiting, request limits, and audit logging.

## Planned next milestones

1. Full grammar with declarations, branch/control-flow semantics, functions, modules, and static type checking.
2. Editable graph canvas, selection/connectors, property inspector, undo/redo, and data binding.
3. Project manifest schema, project templates, file generation, and persistence.
4. Real HTTP transport adapter, middleware, auth policies, and API integration tests.
5. Debugger, breakpoints, profiler, plugin sandbox/permissions, and platform installers.

This is an initial implementation foundation, not a finished production IDE or public network API service.
