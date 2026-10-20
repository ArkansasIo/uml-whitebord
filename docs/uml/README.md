# MLTA Application Engine — UML Design Document

**Implementation target:** C++23  
**Purpose:** A reusable application shell with a public API, GUI navigation, nested menus, toolbars, page/subpage routing, workspace planes, configuration, persistence, and plugin support.

## Design goals

1. Separate the application core from GUI implementation details.
2. Expose stable application services through `ApplicationAPI`.
3. Make menus, toolbar items, navigation nodes, pages, and commands data-driven.
4. Support nested pages and workspace planes without hard-coding each screen into the engine.
5. Allow storage adapters to be swapped between JSON files, SQLite, or another backend.
6. Keep the core testable without launching the GUI.

## UML files

- `MLTA_Application_Engine.puml` — class/component structure.
- `MLTA_Navigation_Sequence.puml` — page navigation and command-dispatch sequence.

These are PlantUML source files. They can be rendered with PlantUML and used as diagram source when recreating the diagrams in Lucidchart. Lucidchart may not import PlantUML source directly; if direct import is unavailable, render to SVG/PNG and insert the rendered diagram, or recreate the classes and relationships using Lucidchart's UML shapes.

## Main subsystem responsibilities

| Subsystem | Responsibility |
|---|---|
| `ApplicationEngine` | Lifecycle, service registration, configuration, shutdown |
| `MainWindow` | Top-level GUI shell |
| `HeaderBar` | Application title, account/window actions |
| `MenuBar` / `Menu` | Hierarchical menus and submenus |
| `ToolBar` | Shortcuts to common commands |
| `NavigationPanel` | Tree navigation and expandable sections |
| `PageRouter` | Route registration, navigation history, route resolution |
| `WorkspaceView` / `PageHost` | Mounting and activating pages |
| `Page` / `SubPage` | Page lifecycle and nested content |
| `PlaneView` | Dashboard/canvas region with widgets and nested work areas |
| `FooterBar` | Status, progress, connection and activity indicators |
| `ApplicationAPI` | Public, GUI-independent application API |
| `ApiRouter` | Request dispatch to API handlers |
| `CommandRegistry` | Named actions shared by menus, toolbar, shortcuts, and API |
| `EventBus` | Decoupled notifications between subsystems |
| `SettingsService` | Typed configuration access and persistence |
| `PluginManager` | Optional feature modules and extension points |

## GUI layout

```text
+------------------------------------------------------------------+
| HeaderBar: application title, account, window actions             |
+------------------------------------------------------------------+
| MenuBar: File | Edit | View | Navigate | Tools | Window | Help     |
+------------------------------------------------------------------+
| ToolBar: Back | Forward | Save | Refresh | Search | Custom tools   |
+------------------+-----------------------------------------------+
| NavigationPanel | WorkspaceView                                  |
| - Home           | +-------------------------------------------+ |
| - Projects       | | Active Page / Subpage                     | |
|   - Overview     | |                                           | |
|   - Settings     | | PlaneView / dashboards / editor widgets   | |
| - Tools          | +-------------------------------------------+ |
| - Extensions     |                                               |
+------------------+-----------------------------------------------+
| FooterBar: status | progress | connection | notifications         |
+------------------------------------------------------------------+
```

## API design rules

- Return a `Result<T>` or equivalent error-bearing type from operations that can fail.
- Validate routes, command IDs, payload types, permissions, and plugin state at the API boundary.
- Avoid exposing raw GUI widget pointers through the public API.
- Define API versioning and a stable error-code convention.
- If an HTTP API is added, treat it as a transport adapter over the same application services, not as a second business-logic implementation.
- Add authentication and authorization before exposing the API to untrusted clients.

## C++23 implementation recommendations

- Build with CMake and a compiler supporting C++23.
- Use interfaces/abstract classes for storage and GUI adapters.
- Use RAII and smart pointers for ownership.
- Use `std::expected` where supported by the selected standard library, or a small project `Result<T>` type.
- Keep the GUI toolkit behind an adapter. Qt 6 is a practical option for native desktop menus, toolbars, dock panels, stacked pages, and status bars.
- Use unit tests for route resolution, command dispatch, permissions, persistence, and lifecycle transitions.

## Suggested source tree

```text
MLTAApplicationEngine/
├── CMakeLists.txt
├── README.md
├── docs/
│   └── uml/
│       ├── MLTA_Application_Engine.puml
│       ├── MLTA_Navigation_Sequence.puml
│       └── README.md
├── include/mlta/
│   ├── application_engine.hpp
│   ├── application_api.hpp
│   ├── result.hpp
│   ├── event_bus.hpp
│   ├── command_registry.hpp
│   ├── page_router.hpp
│   ├── page.hpp
│   ├── menu_model.hpp
│   ├── layout_manager.hpp
│   ├── plugin_manager.hpp
│   └── storage_adapter.hpp
├── src/
│   ├── application_engine.cpp
│   ├── application_api.cpp
│   ├── event_bus.cpp
│   ├── command_registry.cpp
│   ├── page_router.cpp
│   ├── plugin_manager.cpp
│   └── storage/
│       ├── json_file_storage.cpp
│       └── sqlite_storage.cpp
├── gui/
│   ├── main_window.cpp
│   ├── header_bar.cpp
│   ├── menu_bar.cpp
│   ├── tool_bar.cpp
│   ├── navigation_panel.cpp
│   ├── workspace_view.cpp
│   └── footer_bar.cpp
└── tests/
    ├── page_router_tests.cpp
    ├── command_registry_tests.cpp
    └── application_api_tests.cpp
```

## Acceptance criteria

- The engine starts and shuts down cleanly.
- A menu item and toolbar item can invoke the same registered command.
- Navigation can open pages and nested subpages by route.
- Back/forward navigation is deterministic.
- The active workspace plane can host configurable widgets.
- The GUI can be replaced or tested with a headless adapter.
- API failures return structured diagnostics rather than silently failing.
- Persistence adapters can be substituted without changing page or command logic.
